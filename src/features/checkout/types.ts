import type { Address } from "@/lib/account";

/** Types and constants of the checkout screen. */

export interface CheckoutUser { name: string; email: string; phone: string; addresses: Address[] }

export const STEPS = ["Shipping", "Payment", "Review"] as const;
export type StepIndex = 0 | 1 | 2;

/** A message above the form. `bagLink` adds a "Go to bag" link (used when something sold out). */
export interface Problem { text: string; bagLink?: boolean }

/** What the screen should do after a failed "place order" — decided by describePlaceOrderError. */
export interface PlaceOrderFailure {
  problem?: Problem;
  fieldErrors?: Record<string, string>; // → show them and go back to the shipping step
  redirect?: string; // → leave the page (e.g. to the login)
}
