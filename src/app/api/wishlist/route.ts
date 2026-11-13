import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { bad, failure, readWishlist, sessionUserId, unauthorized } from "@/lib/bag";

// The signed-in user's wishlist. Every call answers with the full list of saved product slugs: { slugs }.

const slugOf = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 120) : "");

export async function GET() {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();
  try {
    return NextResponse.json({ slugs: await readWishlist(userId) });
  } catch (e) { return failure(e, "wishlist read"); }
}

/** Save a product: body { id: slug } (saving twice is fine). */
export async function POST(req: Request) {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();
  const body = await req.json().catch(() => null);
  const slug = slugOf(body?.id);
  if (!slug) return bad("invalid_item");

  try {
    const product = await prisma.product.findFirst({ where: { slug, isActive: true }, select: { id: true } });
    if (!product) return bad("not_found", 404);
    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId: product.id } },
      create: { userId, productId: product.id },
      update: {},
    });
    return NextResponse.json({ slugs: await readWishlist(userId) });
  } catch (e) { return failure(e, "wishlist add"); }
}

/** Unsave one product (?id=<slug>) or clear the list (?all=1). */
export async function DELETE(req: Request) {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();
  const q = new URL(req.url).searchParams;

  try {
    if (q.get("all") === "1") {
      await prisma.wishlistItem.deleteMany({ where: { userId } });
    } else {
      const slug = slugOf(q.get("id"));
      if (!slug) return bad("invalid_item");
      await prisma.wishlistItem.deleteMany({ where: { userId, product: { slug } } });
    }
    return NextResponse.json({ slugs: await readWishlist(userId) });
  } catch (e) { return failure(e, "wishlist remove"); }
}
