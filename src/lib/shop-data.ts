import { PAGE_SIZE, PRICE_MAX, categories } from "@/features/shop/catalog";
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
