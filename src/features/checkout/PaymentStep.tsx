import { Button, LockIcon, PackageIcon } from "@/ui";
import { PaymentOption } from "./PaymentOption";
import type { CheckoutApi } from "./useCheckout";

export function PaymentStep({ c, onlineEnabled }: { c: CheckoutApi; onlineEnabled: boolean }) {
  const { method, setMethod, goTo } = c;
  return (
    <section aria-labelledby="pay-h" className="flex flex-col gap-5">
      <h2 id="pay-h" className="font-serif text-2xl leading-8">How would you like to pay?</h2>
      <div role="radiogroup" aria-label="Payment method" className="flex flex-col gap-3">
        <PaymentOption checked={method === "cod"} onSelect={() => setMethod("cod")} icon={<PackageIcon width={18} height={18} />}
          title="Cash on delivery" text="Pay in cash to the courier when your order arrives. Please have the exact amount ready." />
        <PaymentOption checked={method === "online"} disabled={!onlineEnabled} onSelect={() => setMethod("online")} icon={<LockIcon width={18} height={18} />}
          title="Pay online" badge={onlineEnabled ? undefined : "Unavailable"}
          text={onlineEnabled ? "Credit or debit card on a secure payment page. We never see or store your card details." : "Online payment is not available right now — please choose cash on delivery."} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => goTo(0)} className="label-caps text-ink underline underline-offset-2">Back</button>
        <Button className="w-auto" onClick={() => goTo(2)}>Review order</Button>
      </div>
    </section>
  );
}
