"use client";
import { useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import toast from "react-hot-toast";

export interface CartItem {
  key: string; id: string; name: string; price: number; qty: number;
  color?: string; size?: string; image?: string; tone?: string;
}
type NewItem = Omit<CartItem, "key" | "qty">;

interface Store {
  ready: boolean;
  /** true when the bag / wishlist live in the user's account (database); false = guest, kept in this browser only */
  signedIn: boolean;
  items: CartItem[]; count: number; subtotal: number;
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
  try {
    const raw = localStorage.getItem(key);
    const v = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(v) ? (v as T) : fallback;
  } catch { return fallback; }
}
function forget(...keys: string[]) { for (const k of keys) try { localStorage.removeItem(k); } catch {} }

async function api<T>(url: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(url, { method, cache: "no-store", headers: body ? { "content-type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) {
    if (res.status === 409) toast("Sorry, this piece just sold out");
    throw new Error(String(res.status));
  }
  return res.json() as Promise<T>;
}

const lineOf = (i: CartItem, qty = i.qty) => ({ id: i.id, color: i.color ?? "", size: i.size ?? "", qty });
const lineQuery = (i: CartItem) => new URLSearchParams({ id: i.id, color: i.color ?? "", size: i.size ?? "" }).toString();

/**
 * Bag + wishlist.
 *  - Guest: kept in localStorage (this browser only).
 *  - Signed in: kept in the database, linked to the user (CartItem / WishlistItem). Whatever the guest had is merged
 *    into the account at sign-in, then the local copy is dropped so it never leaks to the next person on this device.
 * The UI always reads the same state; changes are applied instantly and confirmed by the server afterwards.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<"local" | "server" | null>(null);

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
      setItems(read<CartItem[]>(CART_KEY, [])); setWishlist(read<string[]>(WISH_KEY, []));
      setSource("local"); setReady(true);
      return;
    }

    signedInRef.current = true;
    setReady(false);
    const localItems = read<CartItem[]>(CART_KEY, []);
    const localWish = read<string[]>(WISH_KEY, []);
    (async () => {
      try {
        const [cart, wish] = await Promise.all([
          localItems.length ? api<{ items: CartItem[] }>("/api/cart/merge", "POST", { items: localItems.map((i) => lineOf(i)) }) : api<{ items: CartItem[] }>("/api/cart"),
          localWish.length ? api<{ slugs: string[] }>("/api/wishlist/merge", "POST", { ids: localWish }) : api<{ slugs: string[] }>("/api/wishlist"),
        ]);
        if (cancelled) return;
        setItems(cart.items); setWishlist(wish.slugs); setSource("server");
        forget(CART_KEY, WISH_KEY);
      } catch {
        if (cancelled) return;
        setItems(localItems); setWishlist(localWish); setSource("server"); // server unreachable: show what we have, retry on the next change
      }
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [status, userId]);

  // guest persistence (never writes account data to the browser)
  useEffect(() => { if (ready && source === "local") try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {} }, [items, ready, source]);
  useEffect(() => { if (ready && source === "local") try { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); } catch {} }, [wishlist, ready, source]);

  // ---- server writes: one at a time, in order; only the last answer is applied so fast clicks don't flicker ----
  const chain = useRef<Promise<void>>(Promise.resolve());
  const pending = useRef(0);

  const resync = useCallback(async () => {
    try {
      const [cart, wish] = await Promise.all([api<{ items: CartItem[] }>("/api/cart"), api<{ slugs: string[] }>("/api/wishlist")]);
      setItems(cart.items); setWishlist(wish.slugs);
    } catch { /* offline: keep the optimistic state */ }
  }, []);

  const send = useCallback(<T,>(run: () => Promise<T>, apply: (v: T) => void) => {
    if (!signedInRef.current) return;
    pending.current++;
    chain.current = chain.current.then(async () => {
      try {
        const v = await run();
        if (pending.current === 1) apply(v);
      } catch {
        if (pending.current === 1) await resync();
      } finally { pending.current--; }
    });
  }, [resync]);

  const applyCart = useCallback((r: { items: CartItem[] }) => setItems(r.items), []);
  const applyWish = useCallback((r: { slugs: string[] }) => setWishlist(r.slugs), []);

  // ---- actions ----
  const add = useCallback((item: NewItem, qty = 1) => {
    const key = `${item.id}|${item.color ?? ""}|${item.size ?? ""}`;
    setItems((cur) => cur.some((i) => i.key === key)
      ? cur.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      : [...cur, { ...item, key, qty }]);
    send(() => api<{ items: CartItem[] }>("/api/cart", "POST", { id: item.id, color: item.color ?? "", size: item.size ?? "", qty }), applyCart);
  }, [send, applyCart]);

  const setQty = useCallback((key: string, qty: number) => {
    const line = itemsRef.current.find((i) => i.key === key);
    setItems((cur) => (qty <= 0 ? cur.filter((i) => i.key !== key) : cur.map((i) => (i.key === key ? { ...i, qty } : i))));
    if (line) send(() => api<{ items: CartItem[] }>("/api/cart", "PATCH", lineOf(line, qty)), applyCart);
  }, [send, applyCart]);

  const remove = useCallback((key: string) => {
    const line = itemsRef.current.find((i) => i.key === key);
    setItems((cur) => cur.filter((i) => i.key !== key));
    if (line) send(() => api<{ items: CartItem[] }>(`/api/cart?${lineQuery(line)}`, "DELETE"), applyCart);
  }, [send, applyCart]);

  const toggleSaved = useCallback((id: string) => {
    const next = !wishRef.current.includes(id);
    setWishlist((cur) => (next ? [...cur.filter((x) => x !== id), id] : cur.filter((x) => x !== id)));
    send(() => next
      ? api<{ slugs: string[] }>("/api/wishlist", "POST", { id })
      : api<{ slugs: string[] }>(`/api/wishlist?id=${encodeURIComponent(id)}`, "DELETE"), applyWish);
    return next;
  }, [send, applyWish]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    send(() => api<{ slugs: string[] }>("/api/wishlist?all=1", "DELETE"), applyWish);
  }, [send, applyWish]);

  const value = useMemo<Store>(() => ({
    ready, signedIn: status === "authenticated", items, add, setQty, remove, wishlist, toggleSaved, clearWishlist,
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
    isSaved: (id) => wishlist.includes(id),
  }), [ready, status, items, wishlist, add, setQty, remove, toggleSaved, clearWishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}
