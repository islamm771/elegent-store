import { colors, materials, sizes, type ShopProduct } from "./catalog";
import type { toDto } from "@/lib/products";

type ProductDto = ReturnType<typeof toDto>;
const known = (list: readonly { id: string }[] | readonly string[]) => (v: string) => (list as readonly unknown[]).some((x) => (typeof x === "string" ? x : (x as { id: string }).id) === v);

/** API/database product -> the shape the storefront components use (prices in dollars, `id` = slug). */
export function toShopProduct(p: Omit<ProductDto, "createdAt" | "updatedAt"> & { createdAt: string | Date }): ShopProduct {
  return {
    id: p.slug,
    name: p.name,
    label: p.label,
    category: p.category as ShopProduct["category"],
    depts: p.departments.filter((d): d is "women" | "men" | "kids" => d === "women" || d === "men" || d === "kids"),
    trending: p.trending,
    price: p.priceCents / 100,
    compareAt: p.compareAtCents ? p.compareAtCents / 100 : undefined,
    rating: p.rating,
    reviews: p.reviewCount,
    badge: p.badge ?? undefined,
    colors: p.colors.filter(known(colors)) as ShopProduct["colors"],
    sizes: p.sizes.filter(known(sizes)) as ShopProduct["sizes"],
    material: (materials.some((m) => m.id === p.material) ? p.material : "flax-linen") as ShopProduct["material"],
    oeko: p.oeko,
    addedAt: new Date(p.createdAt).getTime(),
    tone: p.tone,
    images: p.images,
    stock: p.stock,
    description: p.description,
  };
}
