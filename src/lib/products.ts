import type { Prisma, Product } from "@/generated/prisma/client";
import { categories, colors, materials, sizes } from "@/features/shop/catalog";

const ids = (xs: readonly { id: string }[]) => xs.map((x) => x.id);
export const CATEGORY_IDS = ids(categories);
export const MATERIAL_IDS = ids(materials);
export const COLOR_IDS = ids(colors);
export const SIZE_IDS: readonly string[] = sizes;
export const DEPARTMENT_IDS = ["women", "men", "kids"] as const;
export const BADGE_TONES = ["dark", "accent", "danger", "light"] as const;
export type BadgeToneId = (typeof BADGE_TONES)[number];
export const SORTS = ["featured", "popular", "newest", "price-asc", "price-desc"] as const;

/* ---------------------------------- output ---------------------------------- */
export function toDto(p: Product) {
  return {
    id: p.id, slug: p.slug, name: p.name, label: p.label, description: p.description,
    category: p.category, departments: p.departments, material: p.material,
    colors: p.colors, sizes: p.sizes, images: p.images, tone: p.tone,
    priceCents: p.priceCents, compareAtCents: p.compareAtCents,
    rating: p.rating, reviewCount: p.reviewCount,
    badge: p.badgeText && p.badgeTone ? { text: p.badgeText, tone: p.badgeTone } : null,
    oeko: p.oeko, trending: p.trending, stock: p.stock, inStock: p.stock > 0, isActive: p.isActive,
    createdAt: p.createdAt, updatedAt: p.updatedAt,
  };
}

/* ---------------------------------- input ----------------------------------- */
export interface ProductWrite {
  slug: string; name: string; label: string; description: string | null; category: string; departments: string[];
  material: string; colors: string[]; sizes: string[]; images: string[]; tone: string; priceCents: number;
  compareAtCents: number | null; rating: number; reviewCount: number; badgeText: string | null; badgeTone: BadgeToneId | null;
  oeko: boolean; trending: boolean; stock: number; isActive: boolean;
}
export type Fields = Record<string, string>;

const REQUIRED: Array<keyof ProductWrite> = ["slug", "name", "label", "category", "departments", "material", "colors", "sizes", "priceCents"];
const DEFAULTS = {
  description: null, images: [], tone: "#d9c4a4", compareAtCents: null, rating: 0, reviewCount: 0,
  badgeText: null, badgeTone: null, oeko: false, trending: false, stock: 0, isActive: true,
} satisfies Partial<ProductWrite>;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const intIn = (v: unknown, min: number, max: number) => typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;

function strList(v: unknown, allowed: readonly string[] | null, min: number, max: number): string[] | string {
  if (!Array.isArray(v)) return "Must be an array.";
  if (v.length < min || v.length > max) return min === max ? `Must have exactly ${min} items.` : `Must have between ${min} and ${max} items.`;
  if (!v.every((x) => typeof x === "string")) return "Must be an array of strings.";
  const list = [...new Set(v as string[])];
  if (allowed) { const bad = list.find((x) => !allowed.includes(x)); if (bad) return `"${bad}" is not allowed. Use: ${allowed.join(", ")}.`; }
  return list;
}

/** Validates a create (all required fields) or update (any subset) payload. Unknown keys are ignored. */
export function parseProductInput(body: unknown, mode: "create" | "update"): { data: Partial<ProductWrite>; errors: Fields } {
  const errors: Fields = {};
  const data: Partial<ProductWrite> = {};
  if (!isObj(body)) return { data, errors: { body: "Send a JSON object." } };
  const has = (k: string) => body[k] !== undefined;

  if (mode === "create") for (const k of REQUIRED) if (!has(k)) errors[k] = "Required.";

  if (has("slug")) {
    const v = body.slug;
    if (typeof v !== "string" || v.length < 2 || v.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) errors.slug = "Use 2–80 lowercase letters, numbers and single hyphens.";
    else data.slug = v;
  }
  for (const [k, max] of [["name", 120], ["label", 60]] as const) {
    if (!has(k)) continue;
    const v = body[k];
    if (typeof v !== "string" || v.trim().length < 2 || v.trim().length > max) errors[k] = `Must be 2–${max} characters.`;
    else data[k] = v.trim();
  }
  if (has("description")) {
    const v = body.description;
    if (v === null || v === "") data.description = null;
    else if (typeof v !== "string" || v.length > 2000) errors.description = "Must be text up to 2000 characters, or null.";
    else data.description = v.trim();
  }
  if (has("category")) { if (typeof body.category === "string" && CATEGORY_IDS.includes(body.category)) data.category = body.category; else errors.category = `Use one of: ${CATEGORY_IDS.join(", ")}.`; }
  if (has("material")) { if (typeof body.material === "string" && MATERIAL_IDS.includes(body.material)) data.material = body.material; else errors.material = `Use one of: ${MATERIAL_IDS.join(", ")}.`; }

  for (const [k, allowed, min, max] of [["departments", DEPARTMENT_IDS, 1, 3], ["colors", COLOR_IDS, 1, 12], ["sizes", SIZE_IDS, 1, 5]] as const) {
    if (!has(k)) continue;
    const r = strList(body[k], allowed, min, max);
    if (typeof r === "string") errors[k] = r; else data[k] = r;
  }
  if (has("images")) {
    const r = strList(body.images, null, 0, 10);
    if (typeof r === "string") errors.images = r;
    else if (r.some((u) => u.length > 300 || !(u.startsWith("/") && !u.startsWith("//")) && !/^https?:\/\//.test(u))) errors.images = "Each image must be a /path or an http(s) URL (max 300 chars).";
    else data.images = r;
  }
  if (has("tone")) { if (typeof body.tone === "string" && /^#[0-9a-fA-F]{6}$/.test(body.tone)) data.tone = body.tone; else errors.tone = "Use a #rrggbb colour."; }

  if (has("priceCents")) { if (intIn(body.priceCents, 100, 10_000_000)) data.priceCents = body.priceCents as number; else errors.priceCents = "Whole cents between 100 and 10,000,000."; }
  if (has("compareAtCents")) {
    if (body.compareAtCents === null) data.compareAtCents = null;
    else if (intIn(body.compareAtCents, 100, 10_000_000)) data.compareAtCents = body.compareAtCents as number;
    else errors.compareAtCents = "Whole cents between 100 and 10,000,000, or null.";
  }
  if (has("rating")) { if (typeof body.rating === "number" && body.rating >= 0 && body.rating <= 5) data.rating = Math.round(body.rating * 10) / 10; else errors.rating = "A number from 0 to 5."; }
  if (has("reviewCount")) { if (intIn(body.reviewCount, 0, 10_000_000)) data.reviewCount = body.reviewCount as number; else errors.reviewCount = "A whole number ≥ 0."; }
  if (has("stock")) { if (intIn(body.stock, 0, 1_000_000)) data.stock = body.stock as number; else errors.stock = "A whole number ≥ 0."; }
  for (const k of ["oeko", "trending", "isActive"] as const) if (has(k)) { if (typeof body[k] === "boolean") data[k] = body[k] as boolean; else errors[k] = "Must be true or false."; }

  if (has("badge")) {
    const b = body.badge;
    if (b === null) { data.badgeText = null; data.badgeTone = null; }
    else if (isObj(b) && typeof b.text === "string" && b.text.trim().length >= 1 && b.text.trim().length <= 30 && BADGE_TONES.includes(b.tone as BadgeToneId)) { data.badgeText = b.text.trim(); data.badgeTone = b.tone as BadgeToneId; }
    else errors.badge = `Use { "text": 1–30 chars, "tone": ${BADGE_TONES.join(" | ")} } or null.`;
  }
  return { data, errors };
}

/** Fills defaults for create. Call only when `errors` is empty. */
export const withDefaults = (d: Partial<ProductWrite>) => ({ ...DEFAULTS, ...d }) as ProductWrite;

export function checkPrices(price: number, compareAt: number | null | undefined): string | null {
  return compareAt != null && compareAt <= price ? "compareAtCents must be higher than priceCents." : null;
}

/* ---------------------------------- list query ------------------------------- */
export function parseListQuery(sp: URLSearchParams, includeInactive: boolean) {
  const csv = (k: string, allowed?: readonly string[]) => (sp.get(k) ?? "").split(",").map((s) => s.trim()).filter((x) => x && (!allowed || allowed.includes(x)));
  const int = (k: string) => { const n = Number(sp.get(k)); return sp.get(k) !== null && Number.isInteger(n) && n >= 0 ? n : null; };
  const and: Prisma.ProductWhereInput[] = [];

  if (!includeInactive) and.push({ isActive: true });

  const dept = sp.get("dept") ?? "";
  if ((DEPARTMENT_IDS as readonly string[]).includes(dept)) and.push({ departments: { has: dept } });
  else if (dept === "sale") and.push({ compareAtCents: { not: null } });
  else if (dept === "trends") and.push({ trending: true });

  const slugs = csv("slugs").filter((x) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x)).slice(0, 48);
  if (slugs.length) and.push({ slug: { in: slugs } });

  const cat = sp.get("cat") ?? "";
  if (CATEGORY_IDS.includes(cat)) and.push({ category: cat });
  const c = csv("color", COLOR_IDS); if (c.length) and.push({ colors: { hasSome: c } });
  const s = csv("size", SIZE_IDS); if (s.length) and.push({ sizes: { hasSome: s } });
  const m = csv("material", MATERIAL_IDS); if (m.length) and.push({ material: { in: m } });
  const min = int("minPrice"), max = int("maxPrice");
  if (min !== null || max !== null) and.push({ priceCents: { ...(min !== null && { gte: min }), ...(max !== null && { lte: max }) } });
  if (sp.get("oeko") === "1") and.push({ oeko: true });
  if (sp.get("inStock") === "1") and.push({ stock: { gt: 0 } });

  const q = (sp.get("q") ?? "").trim().slice(0, 80);
  for (const t of q.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 5)) {
    and.push({ OR: [{ name: { contains: t, mode: "insensitive" } }, { label: { contains: t, mode: "insensitive" } }, { description: { contains: t, mode: "insensitive" } }] });
  }

  const sortKey = SORTS.find((x) => x === sp.get("sort")) ?? "featured";
  const sorts: Record<(typeof SORTS)[number], Prisma.ProductOrderByWithRelationInput[]> = {
    featured: [{ trending: "desc" }, { reviewCount: "desc" }],
    popular: [{ reviewCount: "desc" }],
    newest: [{ createdAt: "desc" }],
    "price-asc": [{ priceCents: "asc" }],
    "price-desc": [{ priceCents: "desc" }],
  };
  const orderBy = [...sorts[sortKey], { id: "asc" as const }]; // id keeps pagination stable

  const pageSize = Math.min(48, Math.max(1, int("pageSize") ?? 12));
  const page = Math.max(1, int("page") ?? 1);
  return { where: { AND: and } as Prisma.ProductWhereInput, orderBy, page, pageSize };
}
