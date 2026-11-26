import { http } from "@/lib/api/http";
import type { PayMethod, ShippingInfo } from "@/lib/checkout";

/** Calls to the checkout API. (If you like, merge `place` into your `ordersApi` — it's the same idea.) */
export const checkoutApi = {
  /** → { number, redirect }: go to `redirect` (the Stripe page for "online", the order page for "cod"). */
  place: (shipping: ShippingInfo, method: PayMethod) =>
    http<{ number: string; redirect: string }>("/api/checkout", { method: "POST", json: { shipping, method } }),
};
