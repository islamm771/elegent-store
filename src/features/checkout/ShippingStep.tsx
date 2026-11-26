import { cn } from "@/lib/cn";
import { Button, TextField } from "@/ui";
import Link from "next/link";
import type { CheckoutUser } from "./types";
import type { CheckoutApi } from "./useCheckout";

const optional = <span className="text-[11px] text-ink-subtle">optional</span>;
const pill = (on: boolean) => cn("rounded-pill px-4 py-2 text-[13px] font-semibold shadow-hairline", on ? "bg-black text-white" : "bg-surface text-ink hover:bg-field");

export function ShippingStep({ c, user }: { c: CheckoutApi; user: CheckoutUser }) {
  const { ship, errors, field, addrId, pickAddress, nextFromShipping } = c;
  return (
    <section aria-labelledby="ship-h" className="flex flex-col gap-5">
      <h2 id="ship-h" className="font-serif text-2xl leading-8">Where should we deliver?</h2>

      {user.addresses.length > 0 && (
        <div role="radiogroup" aria-label="Saved addresses" className="flex flex-wrap gap-2">
          {user.addresses.map((a) => (
            <button key={a.id} type="button" role="radio" aria-checked={addrId === a.id} onClick={() => pickAddress(a.id)} className={pill(addrId === a.id)}>{a.label}</button>
          ))}
          <button type="button" role="radio" aria-checked={addrId === "new"} onClick={() => pickAddress("new")} className={pill(addrId === "new")}>New address</button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" autoComplete="name" value={ship.name} onChange={field("name")} error={errors.name} />
        <TextField label="Phone" type="tel" autoComplete="tel" value={ship.phone} onChange={field("phone")} error={errors.phone} aside={<span className="text-[11px] text-ink-subtle">for the courier</span>} />
      </div>
      <TextField label="Street address" autoComplete="address-line1" value={ship.line1} onChange={field("line1")} error={errors.line1} />
      <TextField label="Apartment, floor, landmark" autoComplete="address-line2" value={ship.line2} onChange={field("line2")} error={errors.line2} aside={optional} />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="City" autoComplete="address-level2" value={ship.city} onChange={field("city")} error={errors.city} />
        <TextField label="Postal code" autoComplete="postal-code" value={ship.postal} onChange={field("postal")} error={errors.postal} aside={optional} />
        <TextField label="Country" autoComplete="country-name" value={ship.country} onChange={field("country")} error={errors.country} />
      </div>
      <TextField label="Delivery notes" value={ship.notes} onChange={field("notes")} error={errors.notes} aside={optional} />
      <p className="text-[13px] text-ink-muted">Order updates go to <b>{user.email}</b>.</p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/cart" className="label-caps text-ink underline underline-offset-2">Back to bag</Link>
        <Button className="w-auto" onClick={nextFromShipping}>Continue to payment</Button>
      </div>
    </section>
  );
}
