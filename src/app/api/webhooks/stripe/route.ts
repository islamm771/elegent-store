import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { cancelOrder, markPaid } from "@/lib/orders";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe → us. Point a webhook endpoint at /api/webhooks/stripe with the events
 *   checkout.session.completed, checkout.session.async_payment_succeeded,
 *   checkout.session.async_payment_failed, checkout.session.expired
 * and put its signing secret in STRIPE_WEBHOOK_SECRET. (Locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.)
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "not_configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), sig, secret); // raw body, or the signature won't match
  } catch {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  try {
    if (event.type.startsWith("checkout.session.")) {
      const s = event.data.object as Stripe.Checkout.Session;
      const orderId = s.client_reference_id ?? s.metadata?.orderId;
      if (orderId) {
        if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
          if (s.payment_status === "paid") await markPaid(orderId);
        } else if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
          await cancelOrder(orderId);
        }
      }
    }
  } catch (e) {
    console.error("stripe webhook failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 }); // Stripe will retry
  }
  return NextResponse.json({ received: true });
}
