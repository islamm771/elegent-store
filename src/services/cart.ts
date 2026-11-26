import { http } from "@/lib/api/http";
import type { CartItem } from "@/features/shop/store.types";

/** Every call of the bag + wishlist API. Never cached: these are the user's live data. */

export interface CartLine { id: string; color: string; size: string; qty: number }
export interface CartResponse { items: CartItem[] }
export interface WishlistResponse { slugs: string[] }

const call = <T>(url: string, init: RequestInit & { json?: unknown } = {}) => http<T>(url, { cache: "no-store", ...init });

export const cartApi = {
  get: () => call<CartResponse>("/api/cart"),
  /** At sign-in: adds the guest's lines to the account's bag. */
  merge: (lines: CartLine[]) => call<CartResponse>("/api/cart/merge", { method: "POST", json: { items: lines } }),
  add: (line: CartLine) => call<CartResponse>("/api/cart", { method: "POST", json: line }),
  setQty: (line: CartLine) => call<CartResponse>("/api/cart", { method: "PATCH", json: line }),
  remove: (line: Pick<CartLine, "id" | "color" | "size">) =>
    call<CartResponse>(`/api/cart?${new URLSearchParams({ id: line.id, color: line.color, size: line.size })}`, { method: "DELETE" }),
};

export const wishlistApi = {
  get: () => call<WishlistResponse>("/api/wishlist"),
  merge: (ids: string[]) => call<WishlistResponse>("/api/wishlist/merge", { method: "POST", json: { ids } }),
  add: (id: string) => call<WishlistResponse>("/api/wishlist", { method: "POST", json: { id } }),
  remove: (id: string) => call<WishlistResponse>(`/api/wishlist?id=${encodeURIComponent(id)}`, { method: "DELETE" }),
  clear: () => call<WishlistResponse>("/api/wishlist?all=1", { method: "DELETE" }),
};
