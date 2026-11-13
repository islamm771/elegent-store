import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MAX_MERGE, addToCart, bad, failure, parseLine, readCart, sessionUserId, unauthorized, type LineInput } from "@/lib/bag";

/** Right after sign-in: folds the bag a guest built in the browser into the account's bag. Body { items: [{ id, color?, size?, qty }] } */
export async function POST(req: Request) {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.items)) return bad("invalid_json");
  const lines = body.items.slice(0, MAX_MERGE).map(parseLine).filter((l: LineInput | null): l is LineInput => l !== null);

  try {
    const products = await prisma.product.findMany({
      where: { slug: { in: [...new Set(lines.map((l: LineInput) => l.slug))] as string[] }, isActive: true, stock: { gt: 0 } },
      select: { id: true, slug: true, stock: true },
    });
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    for (const line of lines) {
      const product = bySlug.get(line.slug);
      if (product) await addToCart(userId, line, product); // unknown / hidden / sold-out products are skipped
    }
    return NextResponse.json({ items: await readCart(userId) });
  } catch (e) { return failure(e, "cart merge"); }
}
