import { isPhone } from "./validation";

/** Rules shared by the checkout page (to show the totals) and the server (which is the one that actually decides them). All money is in cents. */

export const FREE_SHIPPING_OVER_CENTS = 20000; // "Complimentary shipping on orders over $200"
export const SHIPPING_FLAT_CENTS = 1200;
export const DELIVERY_DAYS = 3; // shown as "Anticipated delivery" on the order page
export const TAX_RATE = 0; // set e.g. 0.14 to add 14% VAT on top of the subtotal

export function orderTotals(subtotalCents: number) {
  const shippingCents = subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_OVER_CENTS ? 0 : SHIPPING_FLAT_CENTS;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  return { subtotalCents, shippingCents, taxCents, totalCents: subtotalCents + shippingCents + taxCents };
}

export type PayMethod = "cod" | "online";
export const isPayMethod = (v: unknown): v is PayMethod => v === "cod" || v === "online";

export interface ShippingInfo { name: string; phone: string; line1: string; line2: string; city: string; postal: string; country: string; notes: string }
export type ShippingErrors = Partial<Record<keyof ShippingInfo, string>>;

export const emptyShipping: ShippingInfo = { name: "", phone: "", line1: "", line2: "", city: "", postal: "", country: "", notes: "" };

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max + 1) : "");

/** Cleans + validates the delivery details. Used in the browser (to show errors) and again on the server (never trust the browser). */
export function validateShipping(input: unknown): { value: ShippingInfo; errors: ShippingErrors } {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const v: ShippingInfo = {
    name: str(o.name, 80), phone: str(o.phone, 30), line1: str(o.line1, 120), line2: str(o.line2, 120),
    city: str(o.city, 60), postal: str(o.postal, 20), country: str(o.country, 60), notes: str(o.notes, 300),
  };
  const e: ShippingErrors = {};
  if (v.name.length < 2) e.name = "Enter the recipient's full name.";
  else if (v.name.length > 80) e.name = "Name is too long.";
  if (!v.phone) e.phone = "We need a phone number for the courier.";
  else if (!isPhone(v.phone) || v.phone.length > 30) e.phone = "Enter a valid phone number.";
  if (!v.line1) e.line1 = "Enter the street address.";
  else if (v.line1.length > 120) e.line1 = "Address is too long.";
  if (v.line2.length > 120) e.line2 = "Address is too long.";
  if (!v.city) e.city = "Enter the city.";
  else if (v.city.length > 60) e.city = "City is too long.";
  if (v.postal.length > 20) e.postal = "Postal code is too long.";
  if (!v.country) e.country = "Enter the country.";
  else if (v.country.length > 60) e.country = "Country is too long.";
  if (v.notes.length > 300) e.notes = "Keep the note under 300 characters.";
  return { value: v, errors: e };
}
