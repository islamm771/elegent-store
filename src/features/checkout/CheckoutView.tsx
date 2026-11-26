"use client";
import Link from "next/link";
import { OrderSummary } from "./OrderSummary";
import { PaymentStep } from "./PaymentStep";
import { ReviewStep } from "./ReviewStep";
import { ShippingStep } from "./ShippingStep";
import { Stepper } from "./Stepper";
import type { CheckoutUser } from "./types";
import { useCheckout } from "./useCheckout";

export type { CheckoutUser } from "./types";

/** Layout only: state in useCheckout, API in services/checkout, rules in lib/checkout, error texts in errors.ts. */
export function CheckoutView({ user, onlineEnabled, cancelled }: { user: CheckoutUser; onlineEnabled: boolean; cancelled: boolean }) {
  const c = useCheckout(user, cancelled);

  if (!c.ready) return <p className="text-[15px] leading-6 text-ink-muted" aria-live="polite">Loading your bag…</p>;
  if (c.items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-[15px] leading-6 text-ink-muted">Your bag is empty, so there is nothing to check out.</p>
        <Link href="/shop" className="rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-cta hover:bg-ink">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <Stepper step={c.step} onGo={c.goTo} />

        {c.problem && (
          <p role="alert" className="mb-5 rounded-field bg-field px-4 py-3 text-[13px] leading-5 text-danger">
            {c.problem.text}{" "}
            {c.problem.bagLink && <Link href="/cart" className="underline underline-offset-2">Go to bag</Link>}
          </p>
        )}

        {c.step === 0 && <ShippingStep c={c} user={user} />}
        {c.step === 1 && <PaymentStep c={c} onlineEnabled={onlineEnabled} />}
        {c.step === 2 && <ReviewStep c={c} />}
      </div>

      <OrderSummary items={c.items} totals={c.totals} />
    </div>
  );
}
