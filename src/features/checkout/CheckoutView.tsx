"use client";
import { Photo } from "@/features/home/Photo";
import { useStore } from "@/features/shop/store";
import { emptyShipping, orderTotals, validateShipping, type PayMethod, type ShippingErrors, type ShippingInfo } from "@/lib/checkout";
import { cn } from "@/lib/cn";
import { money } from "@/lib/money";
import type { Address } from "@/lib/account";
import { Button, CheckIcon, LockIcon, PackageIcon, TextField, TruckIcon } from "@/ui";
import Link from "next/link";
import { useMemo, useState } from "react";

export interface CheckoutUser { name: string; email: string; phone: string; addresses: Address[] }
interface Props { user: CheckoutUser; onlineEnabled: boolean; cancelled: boolean }

const STEPS = ["Shipping", "Payment", "Review"] as const;
const cents = (dollars: number) => Math.round(dollars * 100);
const usd = (c: number) => money(c / 100, { cents: true });

function fromAddress(user: CheckoutUser, a?: Address): ShippingInfo {
  return { ...emptyShipping, name: user.name, phone: user.phone, line1: a?.line1 ?? "", line2: a?.line2 ?? "", city: a?.city ?? "", postal: a?.postal ?? "", country: a?.country ?? "" };
}

function Stepper({ step, onGo }: { step: number; onGo: (i: number) => void }) {
  return (
    <ol className="mb-8 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em]" aria-label="Checkout steps">
      {STEPS.map((label, i) => {
        const done = i < step, current = i === step;
        return (
          <li key={label} className="flex flex-1 items-center gap-2" aria-current={current ? "step" : undefined}>
            <button type="button" disabled={!done} onClick={() => onGo(i)}
              className={cn("flex items-center gap-2 whitespace-nowrap", done ? "cursor-pointer text-ink" : current ? "text-ink" : "cursor-default text-ink-subtle")}>
              <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[11px]", done ? "bg-accent text-white" : current ? "bg-black text-white" : "bg-field text-ink-subtle")}>
                {done ? <CheckIcon width={12} height={12} /> : i + 1}
              </span>
              <span className={cn(!current && "hidden sm:inline")}>{label}</span>
            </button>
            {i < STEPS.length - 1 && <span className={cn("h-px flex-1", done ? "bg-accent" : "bg-line")} aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function Option({ checked, disabled, onSelect, icon, title, text, badge }: {
  checked: boolean; disabled?: boolean; onSelect: () => void; icon: React.ReactNode; title: string; text: string; badge?: string;
}) {
  return (
    <button type="button" role="radio" aria-checked={checked} disabled={disabled} onClick={onSelect}
      className={cn("flex w-full items-start gap-4 rounded-[8px] bg-surface p-4 text-left shadow-hairline transition-shadow disabled:cursor-not-allowed disabled:opacity-60",
        checked ? "ring-1 ring-accent" : "hover:ring-1 hover:ring-line")}>
      <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-peach text-ink">{icon}</span>
      <span className="flex-1">
        <span className="flex items-center gap-2 text-[15px] font-semibold">{title}{badge && <span className="rounded-sm bg-field px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">{badge}</span>}</span>
        <span className="mt-0.5 block text-[13px] leading-5 text-ink-muted">{text}</span>
      </span>
      <span className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full border", checked ? "border-accent bg-accent text-white" : "border-ink-faint")}>
        {checked && <CheckIcon width={11} height={11} />}
      </span>
    </button>
  );
}

export function CheckoutView({ user, onlineEnabled, cancelled }: Props) {
  const { items, ready } = useStore();
  const [step, setStep] = useState(0);
  const defaultAddr = user.addresses.find((a) => a.isDefault) ?? user.addresses[0];
  const [addrId, setAddrId] = useState<string>(defaultAddr?.id ?? "new");
  const [ship, setShip] = useState<ShippingInfo>(() => fromAddress(user, defaultAddr));
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [method, setMethod] = useState<PayMethod>("cod");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(cancelled ? "Payment was cancelled — nothing was charged. You can try again or choose cash on delivery." : null);

  const totals = useMemo(() => orderTotals(items.reduce((n, i) => n + cents(i.price) * i.qty, 0)), [items]);
  const set = (k: keyof ShippingInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setShip((s) => ({ ...s, [k]: e.target.value })); setErrors((x) => ({ ...x, [k]: undefined }));
  };

  if (!ready) return <p className="text-[15px] leading-6 text-ink-muted" aria-live="polite">Loading your bag…</p>;
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-[15px] leading-6 text-ink-muted">Your bag is empty, so there is nothing to check out.</p>
        <Link href="/shop" className="rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-cta hover:bg-ink">Continue shopping</Link>
      </div>
    );
  }

  function pickAddress(id: string) {
    setAddrId(id); setErrors({});
    setShip(fromAddress(user, user.addresses.find((a) => a.id === id)));
  }

  function nextFromShipping() {
    const { value, errors: e } = validateShipping(ship);
    setErrors(e);
    if (Object.keys(e).length) return;
    setShip(value); setProblem(null); setStep(1);
  }

  async function placeOrder() {
    setBusy(true); setProblem(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ shipping: ship, method }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.redirect) { window.location.assign(data.redirect); return; } // full load: the bag is empty / paid by now
      if (res.status === 401) { window.location.assign("/login?callbackUrl=/checkout"); return; }
      if (res.status === 409) setProblem(`Sorry, ${data.item ?? "one of your pieces"} just sold out or isn't available in that quantity. Please update your bag.`);
      else if (res.status === 400 && data.error === "invalid_shipping") { setErrors(data.fields ?? {}); setStep(0); }
      else if (data.error === "empty") setProblem("Your bag is empty.");
      else if (data.error === "online_unavailable") setProblem("Online payment isn't available right now. Please choose cash on delivery.");
      else if (data.error === "payment_failed") setProblem("We couldn't start the payment. Nothing was charged — please try again or choose cash on delivery.");
      else setProblem("Something went wrong. Please try again.");
    } catch {
      setProblem("Network problem. Please check your connection and try again.");
    }
    setBusy(false);
  }

  const online = method === "online";
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <Stepper step={step} onGo={(i) => { setProblem(null); setStep(i); }} />

        {problem && <p role="alert" className="mb-5 rounded-field bg-field px-4 py-3 text-[13px] leading-5 text-danger">{problem}{" "}{problem.includes("update your bag") && <Link href="/cart" className="underline underline-offset-2">Go to bag</Link>}</p>}

        {step === 0 && (
          <section aria-labelledby="ship-h" className="flex flex-col gap-5">
            <h2 id="ship-h" className="font-serif text-2xl leading-8">Where should we deliver?</h2>

            {user.addresses.length > 0 && (
              <div role="radiogroup" aria-label="Saved addresses" className="flex flex-wrap gap-2">
                {user.addresses.map((a) => (
                  <button key={a.id} type="button" role="radio" aria-checked={addrId === a.id} onClick={() => pickAddress(a.id)}
                    className={cn("rounded-pill px-4 py-2 text-[13px] font-semibold shadow-hairline", addrId === a.id ? "bg-black text-white" : "bg-surface text-ink hover:bg-field")}>
                    {a.label}
                  </button>
                ))}
                <button type="button" role="radio" aria-checked={addrId === "new"} onClick={() => pickAddress("new")}
                  className={cn("rounded-pill px-4 py-2 text-[13px] font-semibold shadow-hairline", addrId === "new" ? "bg-black text-white" : "bg-surface text-ink hover:bg-field")}>
                  New address
                </button>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Full name" autoComplete="name" value={ship.name} onChange={set("name")} error={errors.name} />
              <TextField label="Phone" type="tel" autoComplete="tel" value={ship.phone} onChange={set("phone")} error={errors.phone} aside={<span className="text-[11px] text-ink-subtle">for the courier</span>} />
            </div>
            <TextField label="Street address" autoComplete="address-line1" value={ship.line1} onChange={set("line1")} error={errors.line1} />
            <TextField label="Apartment, floor, landmark" autoComplete="address-line2" value={ship.line2} onChange={set("line2")} error={errors.line2} aside={<span className="text-[11px] text-ink-subtle">optional</span>} />
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField label="City" autoComplete="address-level2" value={ship.city} onChange={set("city")} error={errors.city} />
              <TextField label="Postal code" autoComplete="postal-code" value={ship.postal} onChange={set("postal")} error={errors.postal} aside={<span className="text-[11px] text-ink-subtle">optional</span>} />
              <TextField label="Country" autoComplete="country-name" value={ship.country} onChange={set("country")} error={errors.country} />
            </div>
            <TextField label="Delivery notes" value={ship.notes} onChange={set("notes")} error={errors.notes} aside={<span className="text-[11px] text-ink-subtle">optional</span>} />
            <p className="text-[13px] text-ink-muted">Order updates go to <b>{user.email}</b>.</p>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/cart" className="label-caps text-ink underline underline-offset-2">Back to bag</Link>
              <Button className="w-auto" onClick={nextFromShipping}>Continue to payment</Button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section aria-labelledby="pay-h" className="flex flex-col gap-5">
            <h2 id="pay-h" className="font-serif text-2xl leading-8">How would you like to pay?</h2>
            <div role="radiogroup" aria-label="Payment method" className="flex flex-col gap-3">
              <Option checked={method === "cod"} onSelect={() => setMethod("cod")} icon={<PackageIcon width={18} height={18} />}
                title="Cash on delivery" text="Pay in cash to the courier when your order arrives. Please have the exact amount ready." />
              <Option checked={method === "online"} disabled={!onlineEnabled} onSelect={() => setMethod("online")} icon={<LockIcon width={18} height={18} />}
                title="Pay online" badge={onlineEnabled ? undefined : "Unavailable"}
                text={onlineEnabled ? "Credit or debit card on a secure payment page. We never see or store your card details." : "Online payment is not available right now — please choose cash on delivery."} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => setStep(0)} className="label-caps text-ink underline underline-offset-2">Back</button>
              <Button className="w-auto" onClick={() => { setProblem(null); setStep(2); }}>Review order</Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="rev-h" className="flex flex-col gap-5">
            <h2 id="rev-h" className="font-serif text-2xl leading-8">Review your order</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[8px] bg-surface p-4 shadow-hairline">
                <div className="mb-2 flex items-center justify-between"><p className="eyebrow text-accent">Deliver to</p><button type="button" onClick={() => setStep(0)} className="label-caps text-ink underline underline-offset-2">Edit</button></div>
                <p className="text-[15px] font-semibold">{ship.name}</p>
                <p className="text-[13px] leading-5 text-ink-muted">
                  {ship.line1}{ship.line2 && <>, {ship.line2}</>}<br />{[ship.city, ship.postal].filter(Boolean).join(" ")}, {ship.country}<br />{ship.phone}
                </p>
                {ship.notes && <p className="mt-2 text-[13px] italic text-ink-muted">“{ship.notes}”</p>}
              </div>
              <div className="rounded-[8px] bg-surface p-4 shadow-hairline">
                <div className="mb-2 flex items-center justify-between"><p className="eyebrow text-accent">Payment</p><button type="button" onClick={() => setStep(1)} className="label-caps text-ink underline underline-offset-2">Edit</button></div>
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
              <button type="button" onClick={() => setStep(1)} className="label-caps text-ink underline underline-offset-2">Back</button>
              <Button className="w-auto" loading={busy} onClick={placeOrder} leftIcon={online ? <LockIcon width={14} height={14} /> : undefined}>
                {online ? `Pay ${usd(totals.totalCents)}` : `Place order · ${usd(totals.totalCents)}`}
              </Button>
            </div>
            <p className="text-[12px] leading-5 text-ink-subtle">By placing your order you agree to our <Link href="/terms" className="underline underline-offset-2">Terms</Link> and <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.</p>
          </section>
        )}
      </div>

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
        {totals.shippingCents > 0 && <p className="mt-3 text-[12px] text-ink-muted">Add {usd(20000 - totals.subtotalCents)} more for free shipping.</p>}
      </aside>
    </div>
  );
}
