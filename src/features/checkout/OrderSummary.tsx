import { Photo } from "@/features/home/Photo";
import { FREE_SHIPPING_OVER_CENTS } from "@/lib/checkout";
import { TruckIcon } from "@/ui";
import type { CheckoutApi } from "./useCheckout";
import { cents, usd } from "./utils";

export function OrderSummary({ items, totals }: Pick<CheckoutApi, "items" | "totals">) {
  return (
    <aside className="h-fit rounded-[8px] bg-surface p-5 shadow-hairline" aria-label="Order summary">
      <p className="eyebrow text-accent">Order summary</p>
      <ul className="mt-3 flex flex-col gap-3">
        {items.map((i) => (
          <li key={i.key} className="flex items-center gap-3">
            <span className="relative">
              <Photo src={i.image} tone={i.tone} alt={i.name} className="h-14 w-12 rounded-sm" />
              <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-black text-[10px] font-semibold text-white">{i.qty}</span>
            </span>
            <span className="flex-1 text-[13px] leading-5">{i.name}<span className="block text-[12px] text-ink-muted">{[i.color, i.size?.toUpperCase()].filter(Boolean).join(" · ")}</span></span>
            <span className="text-[13px] font-semibold">{usd(cents(i.price) * i.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4 text-[14px]">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{usd(totals.subtotalCents)}</dd></div>
        <div className="flex justify-between"><dt className="flex items-center gap-1.5"><TruckIcon width={14} height={14} />Shipping</dt><dd>{totals.shippingCents ? usd(totals.shippingCents) : "Free"}</dd></div>
        {totals.taxCents > 0 && <div className="flex justify-between"><dt>Tax</dt><dd>{usd(totals.taxCents)}</dd></div>}
        <div className="mt-2 flex justify-between border-t border-line pt-3 text-base font-bold"><dt>Total</dt><dd>{usd(totals.totalCents)}</dd></div>
      </dl>
      {totals.shippingCents > 0 && <p className="mt-3 text-[12px] text-ink-muted">Add {usd(FREE_SHIPPING_OVER_CENTS - totals.subtotalCents)} more for free shipping.</p>}
    </aside>
  );
}
