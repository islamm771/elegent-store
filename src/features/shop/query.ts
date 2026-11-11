import { PRICE_MAX, PRICE_MIN, categories, colors, departments, materials, sizes, sortOptions } from "./catalog";

export type Params = Record<string, string | string[] | undefined>;

export interface ShopQuery {
  dept: string; cat: string; colors: string[]; sizes: string[]; materials: string[];
  max: number; oeko: boolean; q: string; sort: string; page: number; view: "grid" | "list";
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const csv = (v: string | string[] | undefined, allowed: readonly string[]) => first(v).split(",").filter((x) => allowed.includes(x));
const ids = <T extends { id: string }>(xs: readonly T[]) => xs.map((x) => x.id);

export function parseQuery(p: Params): ShopQuery {
  let dept = first(p.dept);
  let cat = first(p.cat);
  const legacy = first(p.category); // older links: ?category=women | ?category=dresses
  if (legacy) {
    if (ids(departments).includes(legacy)) dept ||= legacy;
    else if (ids(categories).includes(legacy)) cat ||= legacy;
  }
  const max = Number(first(p.max));
  return {
    dept: ids(departments).includes(dept) ? dept : "all",
    cat: ids(categories).includes(cat) ? cat : "",
    colors: csv(p.color, ids(colors)),
    sizes: csv(p.size, sizes),
    materials: csv(p.material, ids(materials)),
    max: Number.isFinite(max) && max > 0 ? Math.min(PRICE_MAX, Math.max(PRICE_MIN, max)) : PRICE_MAX,
    oeko: first(p.oeko) === "1",
    q: first(p.q).trim().slice(0, 60),
    sort: ids(sortOptions).includes(first(p.sort)) ? first(p.sort) : "featured",
    page: Math.max(1, parseInt(first(p.page), 10) || 1),
    view: first(p.view) === "list" ? "list" : "grid",
  };
}

/** Build a /shop URL from a query (defaults omitted). */
export function shopHref(q: ShopQuery, over: Partial<ShopQuery> = {}) {
  const n = { ...q, ...over };
  const p = new URLSearchParams();
  if (n.dept !== "all") p.set("dept", n.dept);
  if (n.cat) p.set("cat", n.cat);
  if (n.colors.length) p.set("color", n.colors.join(","));
  if (n.sizes.length) p.set("size", n.sizes.join(","));
  if (n.materials.length) p.set("material", n.materials.join(","));
  if (n.max < PRICE_MAX) p.set("max", String(n.max));
  if (n.oeko) p.set("oeko", "1");
  if (n.q) p.set("q", n.q);
  if (n.sort !== "featured") p.set("sort", n.sort);
  if (n.view === "list") p.set("view", "list");
  if (n.page > 1) p.set("page", String(n.page));
  const s = p.toString();
  return s ? `/shop?${s}` : "/shop";
}
