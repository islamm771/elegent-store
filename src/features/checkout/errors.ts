import { ApiError } from "@/lib/api/http";
import type { PlaceOrderFailure } from "./types";

/** Turns whatever "place order" threw into what the screen should show. Pure → easy to test. */
export function describePlaceOrderError(e: unknown): PlaceOrderFailure {
  if (!(e instanceof ApiError)) return { problem: { text: "Network problem. Please check your connection and try again." } };

  if (e.status === 401) return { redirect: "/login?callbackUrl=/checkout" };
  if (e.status === 409) return { problem: { text: `Sorry, ${e.data?.item ?? "one of your pieces"} just sold out or isn't available in that quantity. Please update your bag.`, bagLink: true } };

  switch (e.code) {
    case "invalid_shipping": return { fieldErrors: e.data?.fields ?? {} };
    case "empty": return { problem: { text: "Your bag is empty." } };
    case "online_unavailable": return { problem: { text: "Online payment isn't available right now. Please choose cash on delivery." } };
    case "payment_failed": return { problem: { text: "We couldn't start the payment. Nothing was charged — please try again or choose cash on delivery." } };
    default: return { problem: { text: "Something went wrong. Please try again." } };
  }
}
