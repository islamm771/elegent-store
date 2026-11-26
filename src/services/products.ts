import type { ProductBody } from "@/features/admin/product-form/types";
import { http } from "@/lib/api/http";

/** Every call to the products API lives here — components never write a URL. */
export const productsApi = {
  readAll: (query: string) => http<{ items: ProductBody[]; total: number }>(`/api/products?${query}`, { cache: "no-store" }),
  read: (slug: string) => http<ProductBody>(`/api/products/${encodeURIComponent(slug)}`),
  create: (body: ProductBody) => http<{ slug: string }>("/api/products", { method: "POST", json: body }),
  update: (slug: string, body: Partial<ProductBody>) => http<{ slug: string }>(`/api/products/${encodeURIComponent(slug)}`, { method: "PATCH", json: body }),
  remove: (slug: string) => http<{ ok: true }>(`/api/products/${encodeURIComponent(slug)}`, { method: "DELETE" }),
};