import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MAX_MERGE, bad, failure, readWishlist, sessionUserId, unauthorized } from "@/lib/bag";

/** Right after sign-in: folds the wishlist a guest built in the browser into the account's wishlist. Body { ids: [slug] } */
export async function POST(req: Request) {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.ids)) return bad("invalid_json");
  const slugs = [...new Set((body.ids as unknown[]).slice(0, MAX_MERGE).filter((s): s is string => typeof s === "string").map((s) => s.trim().slice(0, 120)).filter(Boolean))];

  try {
    const products = await prisma.product.findMany({ where: { slug: { in: slugs }, isActive: true }, select: { id: true } });
    await prisma.wishlistItem.createMany({ data: products.map((p) => ({ userId, productId: p.id })), skipDuplicates: true });
    return NextResponse.json({ slugs: await readWishlist(userId) });
  } catch (e) { return failure(e, "wishlist merge"); }
}
