/** The guest's copy of the bag + wishlist, kept in this browser. Every access is wrapped: storage can be blocked or full. */

export const CART_KEY = "elegent:cart";
export const WISH_KEY = "elegent:wishlist";

export function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    const v = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(v) ? (v as T) : fallback;
  } catch { return fallback; }
}

export function writeLocal(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked/full: the bag just won't survive a reload */ }
}

export function forgetLocal(...keys: string[]) {
  for (const k of keys) try { localStorage.removeItem(k); } catch { /* ignore */ }
}
