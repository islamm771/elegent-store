import { emptyShipping, type ShippingInfo } from "@/lib/checkout";
import { money } from "@/lib/money";
import type { Address } from "@/lib/account";
import type { CheckoutUser } from "./types";

/** Small pure helpers of the checkout screen. */

export const cents = (dollars: number) => Math.round(dollars * 100);
export const usd = (c: number) => money(c / 100, { cents: true });
export const subtotalCents = (items: { price: number; qty: number }[]) => items.reduce((n, i) => n + cents(i.price) * i.qty, 0);

/** The form values to start from: the user's name/phone plus the chosen saved address (or empty for "New address"). */
export function fromAddress(user: CheckoutUser, a?: Address): ShippingInfo {
  return { ...emptyShipping, name: user.name, phone: user.phone, line1: a?.line1 ?? "", line2: a?.line2 ?? "", city: a?.city ?? "", postal: a?.postal ?? "", country: a?.country ?? "" };
}
