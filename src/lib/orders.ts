import { randomBytes } from "node:crypto";
import type Stripe from "stripe";
import { Prisma } from "@/generated/prisma/client";
import { orderTotals, type PayMethod, type ShippingInfo } from "./checkout";
import { prisma } from "./db";
import { sendPlainEmail } from "./mail";
import { money } from "./money";
import { siteUrl, stripe } from "./stripe";

/** Server side of checkout: turns the signed-in user's bag into an Order (cash on delivery, or online via Stripe Checkout). */

export class CheckoutError extends Error {
  constructor(public code: "empty" | "stock" | "payment", public detail?: string) { super(code); }
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 chars, no 0/O/1/I
const newNumber = () => "EL-" + Array.from(randomBytes(8), (b) => ALPHABET[b % 32]).join("");

export const parseShipping = (v: unknown): ShippingInfo => {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const s = (k: string) => (typeof o[k] === "string" ? (o[k] as string) : "");
  return { name: s("name"), phone: s("phone"), line1: s("line1"), line2: s("line2"), city: s("city"), postal: s("postal"), country: s("country"), notes: s("notes") };
};

/** Gives the stock of a cancelled order back — only the first caller wins, so it is safe to call twice (webhook + page). */
export async function cancelOrder(orderId: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: "PENDING", paymentStatus: "PENDING" },
      data: { status: "CANCELLED", paymentStatus: "FAILED" },
    });
    if (count !== 1) return false;
    const items = await tx.orderItem.findMany({ where: { orderId } });
    for (const i of items) if (i.productId) await tx.product.update({ where: { id: i.productId }, data: { stock: { increment: i.qty } } });
    return true;
  });
}

export type CancelResult = { ok: true; refunded: boolean; refundFailed: boolean } | { ok: false; reason: "not_found" | "not_cancellable" };

/**
 * The customer cancels their own order. Allowed until it ships (PENDING / CONFIRMED).
 * Stock goes back on the shelf; an online order that was already paid is refunded in full through Stripe.
 */
export async function cancelByUser(number: string, userId: string): Promise<CancelResult> {
  const order = await prisma.order.findFirst({ where: { number, userId } });
  if (!order) return { ok: false, reason: "not_found" };

  if (order.paymentMethod === "ONLINE" && order.paymentStatus === "PENDING") await syncOrderPayment(order); // maybe it was paid a second ago

  const claimed = await prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({ where: { id: order.id, userId, status: { in: ["PENDING", "CONFIRMED"] } }, data: { status: "CANCELLED" } });
    if (count !== 1) return false;
    const items = await tx.orderItem.findMany({ where: { orderId: order.id } });
    for (const i of items) if (i.productId) await tx.product.update({ where: { id: i.productId }, data: { stock: { increment: i.qty } } });
    return true;
  });
  if (!claimed) return { ok: false, reason: "not_cancellable" };

  const fresh = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  if (fresh.paymentMethod !== "ONLINE") return { ok: true, refunded: false, refundFailed: false };

  if (fresh.paymentStatus === "PAID" && fresh.stripeSessionId) {
    try {
      const s = await stripe().checkout.sessions.retrieve(fresh.stripeSessionId);
      const pi = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id;
      if (!pi) throw new Error("no payment intent");
      await stripe().refunds.create({ payment_intent: pi }, { idempotencyKey: `refund-${fresh.id}` });
      await prisma.order.update({ where: { id: fresh.id }, data: { paymentStatus: "REFUNDED" } });
      return { ok: true, refunded: true, refundFailed: false };
    } catch (e) {
      console.error(`REFUND FAILED for order ${fresh.number} — refund it manually in Stripe`, e);
      return { ok: true, refunded: false, refundFailed: true };
    }
  }
  if (fresh.paymentStatus === "PENDING") { // never paid: close the payment page too
    await prisma.order.update({ where: { id: fresh.id }, data: { paymentStatus: "FAILED" } });
    if (fresh.stripeSessionId) await stripe().checkout.sessions.expire(fresh.stripeSessionId).catch(() => {});
  }
  return { ok: true, refunded: false, refundFailed: false };
}

/** Marks an online order as paid (once) and removes the bought lines from the user's bag. */
export async function markPaid(orderId: string): Promise<boolean> {
  const done = await prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: "PENDING", paymentStatus: "PENDING" },
      data: { status: "CONFIRMED", paymentStatus: "PAID", paidAt: new Date() },
    });
    if (count !== 1) return false;
    const o = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true } });
    for (const i of o.items) {
      if (i.productId) await tx.cartItem.deleteMany({ where: { userId: o.userId, productId: i.productId, color: i.color, size: i.size } });
    }
    return true;
  });
  if (done) void sendOrderEmail(orderId);
  return done;
}

/** Asks Stripe what happened to a still-pending online order. Lets the order page work even if the webhook is late or not set up yet. */
export async function syncOrderPayment(order: { id: string; paymentMethod: string; paymentStatus: string; stripeSessionId: string | null }) {
  if (order.paymentMethod !== "ONLINE" || order.paymentStatus !== "PENDING" || !order.stripeSessionId) return;
  try {
    const s = await stripe().checkout.sessions.retrieve(order.stripeSessionId);
    if (s.payment_status === "paid") await markPaid(order.id);
    else if (s.status === "expired") await cancelOrder(order.id);
  } catch (e) { console.error("payment sync failed", e); }
}

/** A customer who left Stripe and starts over shouldn't keep stock locked: release the old unpaid online orders first. */
async function releaseUnpaidOnlineOrders(userId: string) {
  const old = await prisma.order.findMany({
    where: { userId, paymentMethod: "ONLINE", paymentStatus: "PENDING", status: "PENDING" },
    select: { id: true, paymentMethod: true, paymentStatus: true, stripeSessionId: true },
  });
  for (const o of old) {
    await syncOrderPayment(o); // it may actually have been paid a second ago
    if (await cancelOrder(o.id) && o.stripeSessionId) await stripe().checkout.sessions.expire(o.stripeSessionId).catch(() => {});
  }
}

export async function createOrder(args: { userId: string; email: string; shipping: ShippingInfo; method: PayMethod }): Promise<{ number: string; redirect: string }> {
  const { userId, email, shipping, method } = args;
  const cod = method === "cod";
  if (!cod) await releaseUnpaidOnlineOrders(userId);

  const order = await prisma.$transaction(async (tx) => {
    const rows = await tx.cartItem.findMany({
      where: { userId, product: { isActive: true } }, orderBy: { createdAt: "asc" }, include: { product: true },
    });
    if (rows.length === 0) throw new CheckoutError("empty");

    // take the stock first; the conditional update means two buyers can never both get the last piece
    for (const r of rows) {
      const { count } = await tx.product.updateMany({ where: { id: r.productId, stock: { gte: r.qty } }, data: { stock: { decrement: r.qty } } });
      if (count !== 1) throw new CheckoutError("stock", r.product.name);
    }

    // prices come from the database, never from the browser
    const t = orderTotals(rows.reduce((n, r) => n + r.product.priceCents * r.qty, 0));
    const created = await tx.order.create({
      data: {
        number: newNumber(), userId, email, phone: shipping.phone,
        shipping: shipping as unknown as Prisma.InputJsonValue,
        paymentMethod: cod ? "COD" : "ONLINE",
        status: cod ? "CONFIRMED" : "PENDING",
        ...t,
        items: { create: rows.map((r) => ({ productId: r.productId, slug: r.product.slug, name: r.product.name, image: r.product.images[0] ?? null, color: r.color, size: r.size, qty: r.qty, unitCents: r.product.priceCents })) },
      },
      include: { items: true },
    });
    // COD is final now → empty the bag. Online orders empty it once the payment really went through.
    if (cod) await tx.cartItem.deleteMany({ where: { id: { in: rows.map((r) => r.id) } } });
    return created;
  });

  if (cod) {
    void sendOrderEmail(order.id);
    return { number: order.number, redirect: `/order/${order.number}` };
  }

  try {
    const base = siteUrl();
    const publicImages = !/localhost|127\.0\.0\.1/.test(base); // Stripe must be able to download them
    const lines: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((i) => ({
      quantity: i.qty,
      price_data: {
        currency: "usd", unit_amount: i.unitCents,
        product_data: {
          name: i.name,
          description: [i.color, i.size.toUpperCase()].filter(Boolean).join(" · ") || undefined,
          images: publicImages && i.image ? [i.image.startsWith("http") ? i.image : `${base}${i.image}`] : undefined,
        },
      },
    }));
    const extra = (name: string, cents: number) => { if (cents > 0) lines.push({ quantity: 1, price_data: { currency: "usd", unit_amount: cents, product_data: { name } } }); };
    extra("Shipping", order.shippingCents);
    extra("Tax", order.taxCents);

    const session = await stripe().checkout.sessions.create({
      mode: "payment", line_items: lines, customer_email: email, client_reference_id: order.id,
      metadata: { orderId: order.id, number: order.number },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${base}/order/${order.number}`,
      cancel_url: `${base}/checkout?cancelled=1`,
    });
    if (!session.url) throw new Error("Stripe returned no checkout url");
    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
    return { number: order.number, redirect: session.url };
  } catch (e) {
    console.error("stripe session failed", e);
    await cancelOrder(order.id); // give the stock back
    throw new CheckoutError("payment");
  }
}


export async function getOrderForUser(number: string, userId: string) {
  return prisma.order.findFirst({ where: { number, userId }, include: { items: true } });
}

export async function listOrders(userId: string) {
  return prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50, include: { items: true } });
}

async function sendOrderEmail(orderId: string) {
  try {
    const o = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!o) return;
    const ship = parseShipping(o.shipping);
    const lines = o.items.map((i) => `• ${i.name}${[i.color, i.size.toUpperCase()].filter(Boolean).length ? ` (${[i.color, i.size.toUpperCase()].filter(Boolean).join(", ")})` : ""} × ${i.qty} — ${money((i.unitCents * i.qty) / 100, { cents: true })}`);
    const pay = o.paymentMethod === "COD" ? "Cash on delivery — please have the amount ready for the courier." : "Paid online — thank you.";
    const text = [
      `Hi ${ship.name.split(/\s+/)[0] || "there"},`, "", `Thank you — we received your order ${o.number}.`, "",
      ...lines, "",
      `Subtotal: ${money(o.subtotalCents / 100, { cents: true })}`,
      `Shipping: ${o.shippingCents ? money(o.shippingCents / 100, { cents: true }) : "Free"}`,
      ...(o.taxCents ? [`Tax: ${money(o.taxCents / 100, { cents: true })}`] : []),
      `Total: ${money(o.totalCents / 100, { cents: true })}`, "", pay, "",
      "Delivering to:", ship.name, ship.line1, ship.line2, [ship.city, ship.postal].filter(Boolean).join(" "), ship.country, `Phone: ${ship.phone}`, "",
      `Track it any time: ${siteUrl()}/order/${o.number}`, "", "Elegent",
    ].filter((l) => l !== undefined).join("\n");
    await sendPlainEmail({ to: o.email, subject: `Your Elegent order ${o.number}`, text });
  } catch (e) { console.error("order email failed", e); }
}
