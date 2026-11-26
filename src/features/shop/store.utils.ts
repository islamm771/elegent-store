import type { CartItem, NewItem } from "./store.types";

/** Pure functions of the store: no React, no network. Each takes the current list and returns the new one. */

type Variant = { id: string; color?: string; size?: string };

/** One bag line is a product + colour + size. */
export const cartKey = (i: Variant) => `${i.id}|${i.color ?? ""}|${i.size ?? ""}`;

/** The shape the API wants for a line. */
export const toLine = (i: Variant, qty: number) => ({ id: i.id, color: i.color ?? "", size: i.size ?? "", qty });

export const addLine = (cur: CartItem[], item: NewItem, qty: number): CartItem[] => {
  const key = cartKey(item);
  return cur.some((i) => i.key === key)
    ? cur.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
    : [...cur, { ...item, key, qty }];
};

/** qty ≤ 0 removes the line. */
export const withQty = (cur: CartItem[], key: string, qty: number): CartItem[] =>
  qty <= 0 ? cur.filter((i) => i.key !== key) : cur.map((i) => (i.key === key ? { ...i, qty } : i));

export const withoutLine = (cur: CartItem[], key: string): CartItem[] => cur.filter((i) => i.key !== key);

/** Adds the id at the end, or removes it. */
export const withSaved = (cur: string[], id: string, saved: boolean): string[] =>
  saved ? [...cur.filter((x) => x !== id), id] : cur.filter((x) => x !== id);

export const totalCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
export const totalPrice = (items: CartItem[]) => items.reduce((n, i) => n + i.qty * i.price, 0);
