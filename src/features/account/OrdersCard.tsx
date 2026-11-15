
import { money } from '@/lib/money';
import Link from 'next/link';
import OrdersEmpty from './OrdersEmpty';
import { Card } from './Parts';
import { OrderSummary } from './types';

const statusLabel = (o: OrderSummary) =>
  o.status === "CANCELLED" ? "Cancelled" : o.paymentMethod === "ONLINE" && o.paymentStatus === "PENDING" ? "Awaiting payment"
    : ({ PENDING: "Received", CONFIRMED: "Confirmed", SHIPPED: "Shipped", DELIVERED: "Delivered" } as Record<string, string>)[o.status] ?? o.status;

function OrdersCard({ orders }: { orders: OrderSummary[] }) {
  if (orders.length === 0) return <OrdersEmpty />;
  return (
    <Card eyebrow="Order vault" title={`${orders.length} order${orders.length === 1 ? "" : "s"}`}>
      <ul className="flex flex-col divide-y divide-line">
        {orders.map((o) => (
          <li key={o.number}>
            <Link href={`/order/${o.number}`} className="flex items-center justify-between gap-4 py-3 hover:bg-field/50">
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold">{o.number} <span className="ml-1 rounded-pill bg-field px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{statusLabel(o)}</span></span>
                <span className="block truncate text-[13px] text-ink-muted">{new Date(o.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} · {o.itemCount} item{o.itemCount === 1 ? "" : "s"} · {o.paymentMethod === "COD" ? "Cash on delivery" : "Paid online"}</span>
                <span className="block truncate text-[12px] text-ink-subtle">{o.names.join(", ")}</span>
              </span>
              <b className="shrink-0 text-[15px]">{money(o.totalCents / 100, { cents: true })}</b>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default OrdersCard

