import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addToCart, bad, capQty, failure, parseLine, readCart, sessionUserId, unauthorized } from "@/lib/bag";

// The signed-in user's shopping bag. Every call answers with the full, up-to-date bag: { items }.

export async function GET() {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();
  try {
    return NextResponse.json({ items: await readCart(userId) });
  } catch (e) { return failure(e, "cart read"); }
}

/** Add to bag: body { id: slug, color?, size?, qty? } — quantities add up. */
export async function POST(req: Request) {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();
  const line = parseLine(await req.json().catch(() => null));
  if (!line) return bad("invalid_item");

  try {
    const product = await prisma.product.findFirst({ where: { slug: line.slug, isActive: true }, select: { id: true, stock: true } });
    if (!product) return bad("not_found", 404);
    if (product.stock <= 0) return bad("sold_out", 409);
    await addToCart(userId, line, product);
    return NextResponse.json({ items: await readCart(userId) });
  } catch (e) { return failure(e, "cart add"); }
}

/** Set a line's quantity: body { id, color?, size?, qty } — qty <= 0 removes the line. */
export async function PATCH(req: Request) {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();
  const line = parseLine(await req.json().catch(() => null));
  if (!line) return bad("invalid_item");

  try {
    const product = await prisma.product.findFirst({ where: { slug: line.slug }, select: { id: true, stock: true } });
    if (product) {
      const target = { userId, productId: product.id, color: line.color, size: line.size };
      if (line.qty <= 0) await prisma.cartItem.deleteMany({ where: target });
      else await prisma.cartItem.updateMany({ where: target, data: { qty: capQty(line.qty, product.stock) } });
    }
    return NextResponse.json({ items: await readCart(userId) });
  } catch (e) { return failure(e, "cart update"); }
}

/** Remove one line (?id=<slug>&color=&size=) or empty the bag (?all=1). */
export async function DELETE(req: Request) {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();
  const q = new URL(req.url).searchParams;

  try {
    if (q.get("all") === "1") {
      await prisma.cartItem.deleteMany({ where: { userId } });
    } else {
      const line = parseLine({ id: q.get("id"), color: q.get("color"), size: q.get("size") });
      if (!line) return bad("invalid_item");
      await prisma.cartItem.deleteMany({ where: { userId, product: { slug: line.slug }, color: line.color, size: line.size } });
    }
    return NextResponse.json({ items: await readCart(userId) });
  } catch (e) { return failure(e, "cart remove"); }
}
