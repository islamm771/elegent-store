import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { isAdmin, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { checkPrices, parseProductInput, toDto } from "@/lib/products";

type Ctx = { params: Promise<{ slug: string }> };
const notFound = () => NextResponse.json({ error: "not_found" }, { status: 404 });

/** GET /api/products/:slug — public (hidden products are visible to admins only). */
export async function GET(_req: Request, { params }: Ctx) {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product || (!product.isActive && !(await isAdmin()))) return notFound();
    return NextResponse.json(toDto(product));
  } catch (e) {
    console.error("product get failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

/** PATCH /api/products/:slug — admin only, send any subset of fields. The slug itself can't change (cart and wishlist use it). */
export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await params;

  const body = await req.json().catch(() => null);
  const { data, errors } = parseProductInput(body, "update");
  if (data.slug !== undefined && data.slug !== slug) errors.slug = "The slug can't be changed.";
  delete data.slug;
  if (!Object.keys(errors).length && !Object.keys(data).length) errors.body = "Send at least one field to update.";
  if (Object.keys(errors).length) return NextResponse.json({ error: "validation", fields: errors }, { status: 400 });

  try {
    const existing = await prisma.product.findUnique({ where: { slug }, select: { priceCents: true, compareAtCents: true } });
    if (!existing) return notFound();

    const price = data.priceCents ?? existing.priceCents;
    const compareAt = data.compareAtCents !== undefined ? data.compareAtCents : existing.compareAtCents;
    const priceError = checkPrices(price, compareAt);
    if (priceError) return NextResponse.json({ error: "validation", fields: { compareAtCents: priceError } }, { status: 400 });

    const updated = await prisma.product.update({ where: { slug }, data });
    return NextResponse.json(toDto(updated));
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return notFound();
    console.error("product update failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

/** DELETE /api/products/:slug — admin only, permanent. To hide a product instead, PATCH { "isActive": false }. */
export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await params;
  try {
    await prisma.product.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return notFound();
    console.error("product delete failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
