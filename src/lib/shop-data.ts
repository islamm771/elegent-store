import { PAGE_SIZE, PRICE_MAX, categories, type ShopProduct } from "@/features/shop/catalog";
import type { ShopQuery } from "@/features/shop/query";
import { toShopProduct } from "@/features/shop/view";
import { prisma } from "./db";
import { parseListQuery, toDto } from "./products";

const toView = (rows: Awaited<ReturnType<typeof prisma.product.findMany>>) => rows.map((r) => toShopProduct(toDto(r)));

/** One page of the shop, filtered/sorted by the database. */
export async function getShopPage(q: ShopQuery) {
  const sp = new URLSearchParams();
  if (q.dept !== "all") sp.set("dept", q.dept);
  if (q.cat) sp.set("cat", q.cat);
  if (q.colors.length) sp.set("color", q.colors.join(","));
  if (q.sizes.length) sp.set("size", q.sizes.join(","));
  if (q.materials.length) sp.set("material", q.materials.join(","));
  if (q.max < PRICE_MAX) sp.set("maxPrice", String(q.max * 100));
  if (q.oeko) sp.set("oeko", "1");
  if (q.q) sp.set("q", q.q);
  sp.set("sort", q.sort);
  const { where, orderBy } = parseListQuery(sp, false);

  const [total, grouped, totalAll] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.groupBy({ by: ["category"], where: { isActive: true }, _count: { _all: true } }),
    prisma.product.count({ where: { isActive: true } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(q.page, pages);
  const rows = await prisma.product.findMany({ where, orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE });

  return {
    items: toView(rows), total, pages, page, shownUpTo: (page - 1) * PAGE_SIZE + rows.length, totalAll,
    categoryCounts: categories.map((c) => ({ id: c.id, name: c.name, count: grouped.find((g) => g.category === c.id)?._count._all ?? 0 })),
  };
}

export async function getProductBySlug(slug: string) {
  const row = await prisma.product.findFirst({ where: { slug, isActive: true } });
  return row ? toShopProduct(toDto(row)) : null;
}

/** Home page: the most-reviewed pieces + real counts for each category card. */
export async function getHomeData(cardFilters: Array<{ id: string; where: { category?: string; material?: string } }>) {
  const active = { isActive: true };
  const [popular, totalAll, counts] = await Promise.all([
    prisma.product.findMany({ where: active, orderBy: [{ reviewCount: "desc" }, { id: "asc" }], take: 4 }),
    prisma.product.count({ where: active }),
    Promise.all(cardFilters.map((c) => prisma.product.count({ where: { ...active, ...c.where } }))),
  ]);
  return { popular: toView(popular), totalAll, counts: Object.fromEntries(cardFilters.map((c, i) => [c.id, counts[i]])) as Record<string, number> };
}

/**
 * What to wear it with: the order in which to pick pieces from complementary categories
 * (a dress gets mostly accessories plus a layer, a top gets bottoms, and so on).
 */
const PAIRING_ORDER: Record<string, string[]> = {
  dresses: ["accessories", "outerwear", "accessories", "accessories"],
  tops: ["trousers", "accessories", "outerwear", "accessories"],
  trousers: ["tops", "accessories", "outerwear", "accessories"],
  outerwear: ["tops", "trousers", "accessories", "accessories"],
  accessories: ["dresses", "tops", "trousers", "dresses"],
};

/** "Complete the look": available pieces from complementary categories, in the same department, never the product itself. */
export async function getPairings(p: Pick<ShopProduct, "id" | "category" | "depts" | "colors">, limit = 4): Promise<ShopProduct[]> {
  const order = PAIRING_ORDER[p.category] ?? [];
  const base = { isActive: true, stock: { gt: 0 }, ...(p.depts.length ? { departments: { hasSome: p.depts } } : {}) };

  const rows = order.length
    ? await prisma.product.findMany({ where: { ...base, slug: { not: p.id }, category: { in: [...new Set(order)] } }, orderBy: [{ reviewCount: "desc" }, { id: "asc" }], take: 80 })
    : [];

  // colours that sit well together first, then rating and popularity
  const score = (r: (typeof rows)[number]) => r.colors.filter((c) => p.colors.includes(c as ShopProduct["colors"][number])).length * 2 + r.rating + Math.min(r.reviewCount, 100) / 100;
  rows.sort((a, b) => score(b) - score(a) || a.slug.localeCompare(b.slug));

  const pools = new Map<string, typeof rows>();
  for (const c of new Set(order)) pools.set(c, rows.filter((r) => r.category === c));

  const picked: typeof rows = [];
  for (let added = true; added && picked.length < limit; ) {
    added = false;
    for (const c of order) {
      const next = pools.get(c)?.shift();
      if (next && picked.length < limit) { picked.push(next); added = true; }
    }
  }

  // Not enough complementary pieces in this department (e.g. kids): top up with the best of anything else available.
  if (picked.length < limit) {
    const more = await prisma.product.findMany({
      where: { ...base, slug: { notIn: [p.id, ...picked.map((x) => x.slug)] } },
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }, { id: "asc" }],
      take: limit - picked.length,
    });
    picked.push(...more);
  }
  return toView(picked);
}
