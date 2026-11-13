"use client";
import Link from "next/link";
import { MinusIcon, PlusIcon, XIcon } from "@/ui";
import { Photo } from "@/features/home/Photo";
import { useStore } from "./store";

export function CartView() {
  const { items, subtotal, setQty, remove, ready, signedIn, wishlist } = useStore();

  // signed-in bags come from the database, so don't flash "empty" while they load
  if (!ready) return <p className="text-[15px] leading-6 text-ink-muted" aria-live="polite">Loading your bag…</p>;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-[15px] leading-6 text-ink-muted">Your bag is empty.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/shop" className="rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-cta hover:bg-ink">Continue shopping</Link>
          <Link href="/wishlist" className="label-caps text-ink underline underline-offset-2">{wishlist.length ? `View wishlist (${wishlist.length})` : "View wishlist"}</Link>
        </div>
        {!signedIn && <p className="text-[13px] text-ink-muted">Have an account? <Link href="/login?callbackUrl=/cart" className="underline underline-offset-2">Sign in</Link> to see your saved bag.</p>}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="flex flex-col divide-y divide-line">
        {items.map((i) => (
          <li key={i.key} className="flex gap-4 py-4">
            <Photo src={i.image} tone={i.tone} alt={i.name} className="h-28 w-24 shrink-0 rounded-[4px]" />
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold leading-6">{i.name}</p>
                  <p className="text-[13px] text-ink-muted">{[i.color, i.size?.toUpperCase()].filter(Boolean).join(" · ")}</p>
                </div>
                <button type="button" aria-label={`Remove ${i.name}`} onClick={() => remove(i.key)} className="p-1 text-ink-muted hover:text-black"><XIcon width={14} height={14} /></button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-field">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty(i.key, i.qty - 1)} className="grid size-8 place-items-center"><MinusIcon width={12} height={12} /></button>
                  <span className="w-8 text-center text-[13px] font-semibold" aria-live="polite">{i.qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty(i.key, i.qty + 1)} className="grid size-8 place-items-center"><PlusIcon width={12} height={12} /></button>
                </div>
                <p className="text-base font-bold">${(i.price * i.qty).toFixed(2)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-[8px] bg-surface p-5 shadow-hairline">
        <p className="eyebrow text-accent">Order summary</p>
        <p className="mt-3 flex justify-between text-[15px]"><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></p>
        <p className="mt-1 text-[13px] text-ink-muted">Shipping and taxes are calculated at checkout.</p>
        <p className="mt-3 text-[13px] text-ink-muted">
          {signedIn ? "Your bag is saved to your account." : <>Your bag is stored on this device. <Link href="/login?callbackUrl=/cart" className="text-ink underline underline-offset-2">Sign in</Link> to keep it across devices.</>}
        </p>
        <Link href="/wishlist" className="label-caps mt-3 inline-block text-ink underline underline-offset-2">Go to wishlist{wishlist.length ? ` (${wishlist.length})` : ""}</Link>
        <button type="button" disabled className="mt-5 w-full rounded-field bg-black px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white opacity-50">Checkout — coming soon</button>
      </aside>
    </div>
  );
}
