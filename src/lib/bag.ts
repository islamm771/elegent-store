import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";
import { prisma } from "./db";
import { Prisma } from "@/generated/prisma/client";
import { SIZES } from "./account";

/** Server side of the shopping bag + wishlist (the rows live in CartItem / WishlistItem, owned by a User). */

export const MAX_QTY = 99;
export const MAX_MERGE = 100;

/** Same shape the browser store uses, so the UI doesn't care where the bag came from. `id` is the product slug, `price` is in dollars. */
export interface BagLine {
  key: string; id: string; name: string; price: number; qty: number;
  color?: string; size?: string; image?: string; tone?: string;
}

export interface LineInput { slug: string; color: string; size: string; qty: number }

export const lineKey = (slug: string, color: string, size: string) => `${slug}|${color}|${size}`;

export async function sessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export const unauthorized = () => NextResponse.json({ error: "unauthorized" }, { status: 401 });
export const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

/** Turns a thrown error into a response (a stale session whose user no longer exists is treated as signed out). */
export function failure(e: unknown, what: string) {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") return unauthorized();
  console.error(`${what} failed`, e);
  return bad("server", 500);
}

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Strict parser for one bag line coming from the browser. Returns null when it isn't valid. */
export function parseLine(v: unknown): LineInput | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const slug = text(o.id ?? o.slug, 120);
  const color = text(o.color, 40);
  const size = text(o.size, 8).toLowerCase();
  const qty = typeof o.qty === "number" ? Math.trunc(o.qty) : 1;
  if (!slug || !Number.isFinite(qty)) return null;
  if (size && !(SIZES as readonly string[]).includes(size)) return null;
  return { slug, color, size, qty };
}

export const capQty = (qty: number, stock: number) => Math.max(0, Math.min(qty, MAX_QTY, stock > 0 ? stock : MAX_QTY));

export async function readCart(userId: string): Promise<BagLine[]> {
  const rows = await prisma.cartItem.findMany({
    where: { userId, product: { isActive: true } },
    orderBy: { createdAt: "asc" },
    include: { product: { select: { slug: true, name: true, priceCents: true, images: true, tone: true } } },
  });
  return rows.map((r) => ({
    key: lineKey(r.product.slug, r.color, r.size),
    id: r.product.slug,
    name: r.product.name,
    price: r.product.priceCents / 100,
    qty: r.qty,
    color: r.color || undefined,
    size: r.size || undefined,
    image: r.product.images[0],
    tone: r.product.tone,
  }));
}

export async function readWishlist(userId: string): Promise<string[]> {
  const rows = await prisma.wishlistItem.findMany({
    where: { userId, product: { isActive: true } },
    orderBy: { createdAt: "asc" },
    select: { product: { select: { slug: true } } },
  });
  return rows.map((r) => r.product.slug);
}

/** Adds `qty` to a bag line (creating it if needed), never above the stock or MAX_QTY. */
export async function addToCart(userId: string, line: LineInput, product: { id: string; stock: number }) {
  const where = { userId_productId_color_size: { userId, productId: product.id, color: line.color, size: line.size } };
  const existing = await prisma.cartItem.findUnique({ where, select: { qty: true } });
  const qty = capQty((existing?.qty ?? 0) + Math.max(1, line.qty), product.stock);
  await prisma.cartItem.upsert({
    where,
    create: { userId, productId: product.id, color: line.color, size: line.size, qty },
    update: { qty },
  });
}
