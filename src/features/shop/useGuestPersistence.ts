"use client";
import { useEffect } from "react";
import { CART_KEY, WISH_KEY, writeLocal } from "./store.storage";
import type { CartItem, StoreSource } from "./store.types";

/** Guests: keep the bag + wishlist in this browser. Never writes a signed-in user's data to the browser. */
export function useGuestPersistence(items: CartItem[], wishlist: string[], ready: boolean, source: StoreSource) {
  useEffect(() => { if (ready && source === "local") writeLocal(CART_KEY, items); }, [items, ready, source]);
  useEffect(() => { if (ready && source === "local") writeLocal(WISH_KEY, wishlist); }, [wishlist, ready, source]);
}
