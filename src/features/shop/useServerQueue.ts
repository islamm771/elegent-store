"use client";
import { ApiError } from "@/lib/api/http";
import { cartApi, wishlistApi } from "@/services/cart";
import { useCallback, useRef, type RefObject } from "react";
import toast from "react-hot-toast";
import type { CartItem } from "./store.types";

/**
 * Sends the user's changes to the server: one at a time, in order. Only the last answer is applied, so fast
 * clicks don't flicker; if a call fails, the state is re-read from the server (`resync`).
 * The screen has already changed optimistically before any of this runs.
 */
export function useServerQueue(enabled: RefObject<boolean>, onSynced: (items: CartItem[], slugs: string[]) => void) {
  const chain = useRef<Promise<void>>(Promise.resolve());
  const pending = useRef(0);

  const resync = useCallback(async () => {
    try {
      const [cart, wish] = await Promise.all([cartApi.get(), wishlistApi.get()]);
      onSynced(cart.items, wish.slugs);
    } catch { /* offline: keep the optimistic state */ }
  }, [onSynced]);

  return useCallback(<T,>(run: () => Promise<T>, apply: (v: T) => void) => {
    if (!enabled.current) return; // guests have no server copy
    pending.current++;
    chain.current = chain.current.then(async () => {
      try {
        const v = await run();
        if (pending.current === 1) apply(v);
      } catch (e) {
        if (e instanceof ApiError && e.status === 409) toast("Sorry, this piece just sold out");
        if (pending.current === 1) await resync();
      } finally { pending.current--; }
    });
  }, [enabled, resync]);
}
