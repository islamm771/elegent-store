/** Placeholder catalogue — swap for Prisma queries later. Photos: /public/images/shop/<id>.jpg */
export const PRICE_MIN = 30;
export const PRICE_MAX = 450;
export const PAGE_SIZE = 6;

export const colors = [
  { id: "mocha", name: "Mocha", hex: "#8e644a" },
  { id: "sand", name: "Sand", hex: "#d4b996" },
  { id: "biscuit", name: "Biscuit", hex: "#e5d7c5" },
  { id: "olive", name: "Olive", hex: "#676b55" },
  { id: "espresso", name: "Espresso", hex: "#1a1a1a" },
  { id: "terra", name: "Terra", hex: "#a85138" },
] as const;

export const sizes = ["xs", "s", "m", "l", "xl"] as const;

export const materials = [
  { id: "flax-linen", name: "Pure European Flax Linen" },
  { id: "mulberry-silk", name: "Mulberry Raw Silk" },
  { id: "cashmere", name: "Grade-A Cashmere" },
  { id: "organic-cotton", name: "GOTS Organic Cotton" },
  { id: "wool-lyocell", name: "Virgin Wool & Lyocell" },
  { id: "leather", name: "Vegetable-Tanned Leather" },
  { id: "raffia", name: "Hand-Woven Raffia" },
  { id: "gold-vermeil", name: "18k Gold Vermeil" },
] as const;

export const categories = [
  { id: "dresses", name: "Dresses & Jumpsuits" },
  { id: "tops", name: "Tops & Oversized Shirts" },
  { id: "trousers", name: "Trousers & Shorts" },
  { id: "outerwear", name: "Tailored Outerwear" },
  { id: "accessories", name: "Accessories & Belts" },
] as const;

export const departments = [
  { id: "all", label: "All" },
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "kids", label: "Kids collection" },
  { id: "sale", label: "Sale" },
  { id: "trends", label: "Trends" },
] as const;

export const sortOptions = [
  { id: "featured", label: "Featured curations", short: "Featured" },
  { id: "popular", label: "Popular", short: "Popular" },
  { id: "newest", label: "Newest arrivals", short: "Newest" },
  { id: "price-asc", label: "Price: low to high", short: "Price ↑" },
  { id: "price-desc", label: "Price: high to low", short: "Price ↓" },
] as const;

export type BadgeTone = "dark" | "accent" | "danger" | "light";

export interface ShopProduct {
  id: string;
  name: string;
  label: string;                // attribute line shown above the name on desktop
  category: (typeof categories)[number]["id"];
  depts: Array<"women" | "men" | "kids">;
  trending?: boolean;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  badge?: { text: string; tone: BadgeTone };
  colors: Array<(typeof colors)[number]["id"]>; // first = default
  sizes: Array<(typeof sizes)[number]>;
  material: (typeof materials)[number]["id"];
  oeko: boolean;
  addedAt: number;
  tone: string;
  images: string[];            // gallery, first = main (from the database)
  stock: number;
  description?: string | null;
}

/** The static catalogue below is only used by prisma/seed.ts to fill the Product table. */
export type SeedProduct = Omit<ShopProduct, "images" | "stock" | "description">;

const img = (id: string) => `/images/shop/${id}.jpg`;
export const productImage = img;

export const products: SeedProduct[] = [
  { id: "square-neck-buttoned-linen-dress", name: "Square-Neck Buttoned Linen Dress", label: "Normandy flax", category: "dresses", depts: ["women"], trending: true, price: 145, rating: 4.9, reviews: 128, badge: { text: "Ready to ship", tone: "light" }, colors: ["mocha", "sand", "olive", "espresso"], sizes: ["xs", "s", "m", "l", "xl"], material: "flax-linen", oeko: true, addedAt: 14, tone: "#8a5a36" },
  { id: "belted-linen-shirt-dress", name: "Belted Linen Shirt Dress", label: "Normandy flax", category: "dresses", depts: ["women"], price: 160, rating: 4.9, reviews: 48, badge: { text: "Bestseller", tone: "dark" }, colors: ["mocha", "sand", "espresso"], sizes: ["xs", "s", "m", "l"], material: "flax-linen", oeko: true, addedAt: 9, tone: "#cdb89a" },
  { id: "tailored-relaxed-linen-shirt", name: "Tailored Relaxed Linen Shirt", label: "Relaxed cut", category: "tops", depts: ["women", "men"], price: 95, rating: 4.8, reviews: 34, badge: { text: "New color", tone: "accent" }, colors: ["biscuit", "olive"], sizes: ["s", "m", "l", "xl"], material: "flax-linen", oeko: true, addedAt: 11, tone: "#b9a584" },
  { id: "pleated-high-rise-linen-shorts", name: "Pleated High-Rise Linen Shorts", label: "Tailored fit", category: "trousers", depts: ["women"], price: 85, rating: 5.0, reviews: 29, badge: { text: "Only 3 left", tone: "danger" }, colors: ["sand", "espresso", "terra"], sizes: ["xs", "s", "m"], material: "flax-linen", oeko: false, addedAt: 7, tone: "#d9c4a4" },
  { id: "square-neck-a-line-midi-dress", name: "Square-Neck A-Line Midi Dress", label: "A-line silhouette", category: "dresses", depts: ["women"], trending: true, price: 175, compareAt: 210, rating: 4.9, reviews: 12, badge: { text: "Curator’s pick", tone: "light" }, colors: ["terra", "mocha", "biscuit"], sizes: ["s", "m", "l"], material: "flax-linen", oeko: true, addedAt: 8, tone: "#b5623f" },
  { id: "minimal-cashmere-fine-crew", name: "Minimal Cashmere Fine Crew", label: "Grade-A Mongolian", category: "tops", depts: ["women"], price: 190, rating: 4.9, reviews: 24, badge: { text: "Essential", tone: "dark" }, colors: ["olive", "sand", "espresso"], sizes: ["xs", "s", "m", "l", "xl"], material: "cashmere", oeko: false, addedAt: 6, tone: "#6f7458" },
  { id: "tailored-single-breasted-blazer", name: "Tailored Single-Breasted Blazer", label: "Structured fit", category: "outerwear", depts: ["women"], trending: true, price: 240, rating: 4.7, reviews: 18, badge: { text: "Atelier drop", tone: "accent" }, colors: ["biscuit", "mocha"], sizes: ["s", "m", "l"], material: "flax-linen", oeko: true, addedAt: 12, tone: "#cbbba3" },
  { id: "wrap-linen-jumpsuit", name: "Wide-Leg Wrap Linen Jumpsuit", label: "Wrap waist", category: "dresses", depts: ["women"], price: 205, rating: 4.8, reviews: 21, colors: ["olive", "terra"], sizes: ["xs", "s", "m", "l"], material: "flax-linen", oeko: true, addedAt: 10, tone: "#8a8f73" },
  { id: "bias-cut-silk-camisole", name: "Bias-Cut Silk Camisole", label: "Mulberry 22mm", category: "tops", depts: ["women"], trending: true, price: 120, rating: 4.9, reviews: 33, badge: { text: "New", tone: "accent" }, colors: ["biscuit", "sand", "espresso"], sizes: ["xs", "s", "m", "l"], material: "mulberry-silk", oeko: false, addedAt: 13, tone: "#e6d9c3" },
  { id: "wide-leg-linen-trousers", name: "Wide-Leg Linen Trousers", label: "Relaxed drape", category: "trousers", depts: ["women", "men"], price: 130, rating: 4.7, reviews: 41, colors: ["sand", "olive", "espresso"], sizes: ["s", "m", "l", "xl"], material: "flax-linen", oeko: true, addedAt: 5, tone: "#c8b392" },
  { id: "cropped-linen-jacket", name: "Cropped Linen Jacket", label: "Boxy cut", category: "outerwear", depts: ["women"], price: 185, compareAt: 230, rating: 4.6, reviews: 15, colors: ["mocha", "biscuit"], sizes: ["xs", "s", "m", "l"], material: "flax-linen", oeko: true, addedAt: 4, tone: "#a47f60" },
  { id: "woven-cotton-utility-belt", name: "Woven Cotton Utility Belt", label: "Hand-loomed", category: "accessories", depts: ["women", "men"], price: 65, rating: 4.9, reviews: 57, badge: { text: "Handcrafted", tone: "light" }, colors: ["mocha", "espresso"], sizes: ["s", "m", "l"], material: "organic-cotton", oeko: true, addedAt: 3, tone: "#8e644a" },
  { id: "raw-silk-hair-scarf", name: "Raw Silk Hair Scarf", label: "Mulberry raw silk", category: "accessories", depts: ["women"], price: 55, rating: 4.8, reviews: 26, colors: ["terra", "sand"], sizes: ["m"], material: "mulberry-silk", oeko: false, addedAt: 2, tone: "#c9a07c" },
  { id: "sienna-buttoned-linen-dress", name: "Sienna Buttoned Linen Dress", label: "Pure organic linen", category: "dresses", depts: ["women"], price: 145, rating: 4.9, reviews: 142, badge: { text: "Best seller", tone: "dark" }, colors: ["mocha", "sand"], sizes: ["xs", "s", "m", "l"], material: "flax-linen", oeko: true, addedAt: 15, tone: "#b98a5e" },
  { id: "palermo-structured-trench", name: "Palermo Structured Trench", label: "Water-resistant cotton", category: "outerwear", depts: ["women", "men"], price: 220, rating: 5.0, reviews: 89, badge: { text: "Atelier new", tone: "accent" }, colors: ["sand", "biscuit"], sizes: ["s", "m", "l", "xl"], material: "organic-cotton", oeko: true, addedAt: 16, tone: "#d9c4a4" },
  { id: "astrid-minimalist-silk-blouse", name: "Astrid Minimalist Silk Blouse", label: "Mulberry silk 22mm", category: "tops", depts: ["women"], price: 110, rating: 4.8, reviews: 64, badge: { text: "New", tone: "accent" }, colors: ["biscuit", "sand"], sizes: ["xs", "s", "m", "l"], material: "mulberry-silk", oeko: false, addedAt: 17, tone: "#eadfcb" },
  { id: "verona-pleated-wide-trousers", name: "Verona Pleated Wide Trousers", label: "Tailored cut", category: "trousers", depts: ["women", "men"], price: 135, rating: 4.9, reviews: 112, badge: { text: "Curator’s pick", tone: "light" }, colors: ["espresso", "olive"], sizes: ["s", "m", "l", "xl"], material: "wool-lyocell", oeko: false, addedAt: 18, tone: "#6b4a35" },
];

export const colorById = (id: string) => colors.find((c) => c.id === id)!;
export const materialName = (id: string) => materials.find((m) => m.id === id)?.name ?? id;
export const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;
