"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  key: string; id: string; name: string; price: number; qty: number;
  color?: string; size?: string; image?: string; tone?: string;
}
type NewItem = Omit<CartItem, "key" | "qty">;

interface Store {
  ready: boolean; items: CartItem[]; count: number; subtotal: number;
  add: (item: NewItem, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  wishlist: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => boolean; // returns the new saved state
  clearWishlist: () => void;
}

const Ctx = createContext<Store | null>(null);
const CART_KEY = "elegent:cart";
const WISH_KEY = "elegent:wishlist";

function read<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => { setItems(read(CART_KEY, [])); setWishlist(read(WISH_KEY, [])); setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {} }, [items, ready]);
  useEffect(() => { if (ready) try { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); } catch {} }, [wishlist, ready]);

  const add = useCallback((item: NewItem, qty = 1) => {
    const key = `${item.id}|${item.color ?? ""}|${item.size ?? ""}`;
    setItems((cur) => cur.some((i) => i.key === key)
      ? cur.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      : [...cur, { ...item, key, qty }]);
  }, []);
  const setQty = useCallback((key: string, qty: number) =>
    setItems((cur) => (qty <= 0 ? cur.filter((i) => i.key !== key) : cur.map((i) => (i.key === key ? { ...i, qty } : i)))), []);
  const remove = useCallback((key: string) => setItems((cur) => cur.filter((i) => i.key !== key)), []);

  const toggleSaved = useCallback((id: string) => {
    const next = !wishlist.includes(id);
    setWishlist((cur) => (next ? [...cur, id] : cur.filter((x) => x !== id)));
    return next;
  }, [wishlist]);

  const clearWishlist = useCallback(() => setWishlist([]), []);

  const value = useMemo<Store>(() => ({
    ready, items, add, setQty, remove, wishlist, toggleSaved, clearWishlist,
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
    isSaved: (id) => wishlist.includes(id),
  }), [ready, items, wishlist, add, setQty, remove, toggleSaved, clearWishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}
