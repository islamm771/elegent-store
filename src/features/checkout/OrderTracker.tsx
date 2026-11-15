import { DELIVERY_DAYS } from "@/lib/checkout";
import { cn } from "@/lib/cn";

const STEPS = [
  { status: "CONFIRMED", label: "Order confirmed", text: "Order Confirmed — we're preparing your pieces" },
  { status: "PACKED", label: "Atelier hand-packaged", text: "Hand-packaged — ready for the courier" },
  { status: "SHIPPED", label: "Out for delivery", text: "In Transit — Out for Delivery" },
  { status: "DELIVERED", label: "Delivered", text: "Delivered — enjoy your new pieces" },
] as const;

const day = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

/** Progress of an order: confirmed → hand-packaged → out for delivery → delivered. */
export function OrderTracker({ status, createdAt, updatedAt }: { status: string; createdAt: Date; updatedAt: Date }) {
  const current = STEPS.findIndex((s) => s.status === status);
  if (current === -1) return null;
  const delivered = current === STEPS.length - 1;
  const eta = new Date(createdAt.getTime() + DELIVERY_DAYS * 86_400_000);

  return (
    <section aria-label="Order tracking" className="mb-6 rounded-[8px] bg-surface p-4 shadow-hairline sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="eyebrow text-ink-subtle">Current status</p>
          <p className="mt-2 text-[15px] font-semibold leading-6 text-ink">{STEPS[current].text}</p>
        </div>
        <div className="sm:text-right">
          <p className="eyebrow text-ink-subtle">{delivered ? "Delivered on" : "Anticipated delivery"}</p>
          <p className="mt-2 text-[15px] font-semibold leading-6 text-accent">{delivered ? day(updatedAt) : `By ${day(eta)}`}</p>
        </div>
      </div>

      <div className="mt-5 h-[3px] w-full rounded-full bg-line" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={current + 1} aria-valuetext={STEPS[current].label}>
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${((current + 1) / STEPS.length) * 100}%` }} />
      </div>

      <ol className="mt-4 grid grid-cols-4 gap-2 text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] sm:text-[13px]">
        {STEPS.map((s, i) => (
          <li key={s.status} aria-current={i === current ? "step" : undefined}
            className={cn(i < current ? "text-ink" : i === current ? "text-accent" : "text-ink-subtle")}>
            {i + 1}. {s.label}
          </li>
        ))}
      </ol>
    </section>
  );
}
