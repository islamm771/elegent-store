import { categories, materials } from "@/features/shop/catalog";

/** Types and constants of the product form. No React, no fetch, no validation rules in here. */

export const DEPARTMENTS = ["women", "men", "kids"] as const;
export const BADGE_TONES = ["dark", "accent", "danger", "light"] as const;

/** What the inputs hold: everything is a string/boolean/array exactly as typed (prices in dollars, images one per line). */
export interface ProductFormValues {
  slug: string; name: string; label: string; description: string; category: string; material: string;
  departments: string[]; colors: string[]; sizes: string[]; images: string; tone: string;
  price: string; compareAt: string; stock: string; badgeText: string; badgeTone: string;
  oeko: boolean; trending: boolean; isActive: boolean;
}

/** What the API expects: cents, real arrays, badge as an object. Built from the form values by `toProductBody`. */
export interface ProductBody {
  slug?: string; // only when creating
  name: string; label: string; description: string | null; category: string; material: string;
  departments: string[]; colors: string[]; sizes: string[]; images: string[]; tone: string;
  priceCents: number; compareAtCents: number | null; stock: number;
  badge: { text: string; tone: string } | null;
  oeko: boolean; trending: boolean; isActive: boolean;
}

/** field name → message. The keys can also be API names such as priceCents / compareAtCents. */
export type FieldErrors = Record<string, string>;

export const emptyProduct: ProductFormValues = {
  slug: "", name: "", label: "", description: "", category: categories[0].id, material: materials[0].id,
  departments: ["women"], colors: [], sizes: [], images: "", tone: "#d9c4a4",
  price: "", compareAt: "", stock: "0", badgeText: "", badgeTone: "dark", oeko: false, trending: false, isActive: true,
};
