import Stripe from "stripe";

/** Online payments run on Stripe Checkout (hosted page: card details never touch our server). Without STRIPE_SECRET_KEY only cash on delivery is offered. */

export const isOnlineEnabled = () => !!process.env.STRIPE_SECRET_KEY;

let client: Stripe | undefined;
export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return (client ??= new Stripe(key));
}

export function siteUrl() {
  return (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
}
