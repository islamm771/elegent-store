"use client";
import { cartApi, wishlistApi } from "@/services/cart";
import { useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CART_KEY, forgetLocal, readLocal, WISH_KEY } from "./store.storage";
import type { CartItem, NewItem, Store, StoreSource } from "./store.types";
import { addLine, toLine, totalCount, totalPrice, withoutLine, withQty, withSaved } from "./store.utils";
import { useGuestPersistence } from "./useGuestPersistence";
import { useServerQueue } from "./useServerQueue";

export type { CartItem } from "./store.types";

const Ctx = createContext<Store | null>(null);

/**
 * Bag + wishlist.
 *  - Guest: kept in localStorage (this browser only).
 *  - Signed in: kept in the database, linked to the user (CartItem / WishlistItem). Whatever the guest had is merged
 *    into the account at sign-in, then the local copy is dropped so it never leaks to the next person on this device.
 * The UI always reads the same state; changes are applied instantly and confirmed by the server afterwards.
 *
 * Where things live: types → store.types · pure list functions → store.utils · localStorage → store.storage ·
 * API calls → services/cart · server write queue → useServerQueue · guest saving → useGuestPersistence.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<StoreSource>(null);

  // latest values for callbacks that must not go stale
  const itemsRef = useRef(items); itemsRef.current = items;
  const wishRef = useRef(wishlist); wishRef.current = wishlist;
  const signedInRef = useRef(false);

  // ---- load: guest → localStorage, signed in → database (+ merge of the guest's data) ----
  useEffect(() => {
    if (status === "loading") return;
    let cancelled = false;

    if (status === "unauthenticated") {
      signedInRef.current = false;
      setItems(readLocal<CartItem[]>(CART_KEY, [])); setWishlist(readLocal<string[]>(WISH_KEY, []));
      setSource("local"); setReady(true);
      return;
    }

    signedInRef.current = true;
    setReady(false);
    const localItems = readLocal<CartItem[]>(CART_KEY, []);
    const localWish = readLocal<string[]>(WISH_KEY, []);
    (async () => {
      try {
        const [cart, wish] = await Promise.all([
          localItems.length ? cartApi.merge(localItems.map((i) => toLine(i, i.qty))) : cartApi.get(),
          localWish.length ? wishlistApi.merge(localWish) : wishlistApi.get(),
        ]);
        if (cancelled) return;
        setItems(cart.items); setWishlist(wish.slugs); setSource("server");
        forgetLocal(CART_KEY, WISH_KEY);
      } catch {
        if (cancelled) return;
        setItems(localItems); setWishlist(localWish); setSource("server"); // server unreachable: show what we have, retry on the next change
      }
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [status, userId]);

  useGuestPersistence(items, wishlist, ready, source);

  // ---- server writes ----
  const onSynced = useCallback((i: CartItem[], slugs: string[]) => { setItems(i); setWishlist(slugs); }, []);
  const send = useServerQueue(signedInRef, onSynced);
  const applyCart = useCallback((r: { items: CartItem[] }) => setItems(r.items), []);
  const applyWish = useCallback((r: { slugs: string[] }) => setWishlist(r.slugs), []);

  // ---- actions: change the screen first, then tell the server ----
  const add = useCallback((item: NewItem, qty = 1) => {
    setItems((cur) => addLine(cur, item, qty));
    send(() => cartApi.add(toLine(item, qty)), applyCart);
  }, [send, applyCart]);

  const setQty = useCallback((key: string, qty: number) => {
    const line = itemsRef.current.find((i) => i.key === key);
    setItems((cur) => withQty(cur, key, qty));
    if (line) send(() => cartApi.setQty(toLine(line, qty)), applyCart);
  }, [send, applyCart]);

  const remove = useCallback((key: string) => {
    const line = itemsRef.current.find((i) => i.key === key);
    setItems((cur) => withoutLine(cur, key));
    if (line) send(() => cartApi.remove(toLine(line, line.qty)), applyCart);
  }, [send, applyCart]);

  const toggleSaved = useCallback((id: string) => {
    const next = !wishRef.current.includes(id);
    setWishlist((cur) => withSaved(cur, id, next));
    send(() => (next ? wishlistApi.add(id) : wishlistApi.remove(id)), applyWish);
    return next;
  }, [send, applyWish]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    send(() => wishlistApi.clear(), applyWish);
  }, [send, applyWish]);

  const value = useMemo<Store>(() => ({
    ready, signedIn: status === "authenticated", items, add, setQty, remove, wishlist, toggleSaved, clearWishlist,
    count: totalCount(items),
    subtotal: totalPrice(items),
    isSaved: (id) => wishlist.includes(id),
  }), [ready, status, items, wishlist, add, setQty, remove, toggleSaved, clearWishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}
