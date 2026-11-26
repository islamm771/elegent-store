import type { FieldErrors, ProductBody, ProductFormValues } from "./types";

/** Pure functions (no React): rules, cleaning and the form-values → API-body conversion. Easy to unit-test. */

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
export const toCents = (dollars: string) => Math.round(Number(dollars) * 100);
export const parseImages = (text: string) => text.split("\n").map((s) => s.trim()).filter(Boolean);
export const hasErrors = (e: FieldErrors) => Object.values(e).some(Boolean);

export function validateProduct(v: ProductFormValues): FieldErrors {
  const e: FieldErrors = {};
  if (v.name.trim().length < 2) e.name = "Enter the product name.";
  if (!SLUG_RE.test(v.slug) || v.slug.length < 2) e.slug = "Lowercase letters, numbers and hyphens only.";
  if (v.label.trim().length < 2) e.label = "Enter a short label, e.g. “Normandy flax”.";
  if (!(Number(v.price) >= 1)) e.price = "Enter the price in dollars (min 1).";
  if (v.compareAt && !(Number(v.compareAt) > Number(v.price))) e.compareAt = "Must be higher than the price (or leave empty).";
  if (!Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) e.stock = "A whole number, 0 or more.";
  if (v.departments.length === 0) e.departments = "Pick at least one department.";
  if (v.colors.length === 0) e.colors = "Pick at least one colour (the first one picked is the default).";
  if (v.sizes.length === 0) e.sizes = "Pick at least one size.";
  if (!HEX_RE.test(v.tone)) e.tone = "Use a #rrggbb colour.";
  return e;
}

/** Call only after validateProduct passed. The slug is sent on create only (it can't change afterwards). */
export function toProductBody(v: ProductFormValues, editing: boolean): ProductBody {
  return {
    ...(editing ? {} : { slug: v.slug }),
    name: v.name.trim(), label: v.label.trim(), description: v.description.trim() || null, category: v.category, material: v.material,
    departments: v.departments, colors: v.colors, sizes: v.sizes, images: parseImages(v.images), tone: v.tone,
    priceCents: toCents(v.price), compareAtCents: v.compareAt ? toCents(v.compareAt) : null, stock: Number(v.stock),
    badge: v.badgeText.trim() ? { text: v.badgeText.trim(), tone: v.badgeTone } : null,
    oeko: v.oeko, trending: v.trending, isActive: v.isActive,
  };
}
