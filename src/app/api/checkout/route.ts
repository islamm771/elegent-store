import { NextResponse } from "next/server";
import { bad, failure, sessionUserId, unauthorized } from "@/lib/bag";
import { isPayMethod, validateShipping } from "@/lib/checkout";
import { prisma } from "@/lib/db";
import { CheckoutError, createOrder } from "@/lib/orders";
import { isOnlineEnabled } from "@/lib/stripe";

/**
 * Place the order for the signed-in user's bag.
 * Body: { shipping: {name, phone, line1, line2?, city, postal?, country, notes?}, method: "cod" | "online" }
 * Answers { number, redirect } — go to `redirect` (the Stripe payment page for "online", the order page for "cod").
 */
export async function POST(req: Request) {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();

  const body = (await req.json().catch(() => null)) as { shipping?: unknown; method?: unknown } | null;
  if (!body || !isPayMethod(body.method)) return bad("invalid_method");
  if (body.method === "online" && !isOnlineEnabled()) return bad("online_unavailable");

  const { value: shipping, errors } = validateShipping(body.shipping);
  if (Object.keys(errors).length) return NextResponse.json({ error: "invalid_shipping", fields: errors }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user) return unauthorized();
    const result = await createOrder({ userId, email: user.email, shipping, method: body.method });
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof CheckoutError) {
      if (e.code === "empty") return bad("empty", 400);
      if (e.code === "stock") return NextResponse.json({ error: "stock", item: e.detail }, { status: 409 });
      return bad("payment_failed", 502);
    }
    return failure(e, "checkout");
  }
}
