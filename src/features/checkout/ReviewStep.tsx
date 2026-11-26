import { Photo } from "@/features/home/Photo";
import { Button, LockIcon } from "@/ui";
import Link from "next/link";
import type { CheckoutApi } from "./useCheckout";
import { cents, usd } from "./utils";

const editLink = "label-caps text-ink underline underline-offset-2";

export function ReviewStep({ c }: { c: CheckoutApi }) {
  const { ship, items, totals, online, busy, placeOrder, goTo } = c;
  return (
    <section aria-labelledby="rev-h" className="flex flex-col gap-5">
      <h2 id="rev-h" className="font-serif text-2xl leading-8">Review your order</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[8px] bg-surface p-4 shadow-hairline">
          <div className="mb-2 flex items-center justify-between"><p className="eyebrow text-accent">Deliver to</p><button type="button" onClick={() => goTo(0)} className={editLink}>Edit</button></div>
          <p className="text-[15px] font-semibold">{ship.name}</p>
          <p className="text-[13px] leading-5 text-ink-muted">
            {ship.line1}{ship.line2 && <>, {ship.line2}</>}<br />{[ship.city, ship.postal].filter(Boolean).join(" ")}, {ship.country}<br />{ship.phone}
          </p>
          {ship.notes && <p className="mt-2 text-[13px] italic text-ink-muted">“{ship.notes}”</p>}
        </div>
        <div className="rounded-[8px] bg-surface p-4 shadow-hairline">
          <div className="mb-2 flex items-center justify-between"><p className="eyebrow text-accent">Payment</p><button type="button" onClick={() => goTo(1)} className={editLink}>Edit</button></div>
          <p className="text-[15px] font-semibold">{online ? "Pay online" : "Cash on delivery"}</p>
          <p className="text-[13px] leading-5 text-ink-muted">{online ? "You'll be taken to a secure page to pay by card, then brought back here." : `Pay ${usd(totals.totalCents)} in cash when it arrives.`}</p>
        </div>
      </div>

      <ul className="divide-y divide-line rounded-[8px] bg-surface px-4 shadow-hairline">
        {items.map((i) => (
          <li key={i.key} className="flex items-center gap-3 py-3">
            <Photo src={i.image} tone={i.tone} alt={i.name} className="h-16 w-14 shrink-0 rounded-sm" />
            <div className="flex-1">
              <p className="text-[14px] font-semibold leading-5">{i.name}</p>
              <p className="text-[12px] text-ink-muted">{[i.color, i.size?.toUpperCase(), `Qty ${i.qty}`].filter(Boolean).join(" · ")}</p>
            </div>
            <p className="text-[14px] font-bold">{usd(cents(i.price) * i.qty)}</p>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => goTo(1)} className={editLink}>Back</button>
        <Button className="w-auto" loading={busy} onClick={placeOrder} leftIcon={online ? <LockIcon width={14} height={14} /> : undefined}>
          {online ? `Pay ${usd(totals.totalCents)}` : `Place order · ${usd(totals.totalCents)}`}
        </Button>
      </div>
      <p className="text-[12px] leading-5 text-ink-subtle">By placing your order you agree to our <Link href="/terms" className="underline underline-offset-2">Terms</Link> and <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.</p>
    </section>
  );
}
