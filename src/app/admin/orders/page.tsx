import { OrderActions } from "@/features/admin/OrderActions";
import { AdminShell } from "@/features/admin/AdminShell";
import { adminPage } from "@/lib/admin-page";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/db";
import { money } from "@/lib/money";
import { parseShipping } from "@/lib/orders";
import Link from "next/link";

export const metadata = { title: "Orders — Admin" };
export const dynamic = "force-dynamic";

const TABS = [
  { id: "active", label: "To handle" }, // everything that still needs a move
  { id: "PENDING", label: "Awaiting payment" },
  { id: "CONFIRMED", label: "Confirmed" },
  { id: "PACKED", label: "Packed" },
  { id: "SHIPPED", label: "Out for delivery" },
  { id: "DELIVERED", label: "Delivered" },
  { id: "CANCELLED", label: "Cancelled" },
  { id: "all", label: "All" },
] as const;
const STATUS_LABEL: Record<string, string> = { PENDING: "Awaiting payment", CONFIRMED: "Confirmed", PACKED: "Packed", SHIPPED: "Out for delivery", DELIVERED: "Delivered", CANCELLED: "Cancelled" };
const usd = (c: number) => money(c / 100, { cents: true });

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await adminPage("/admin/orders");

  const { status } = await searchParams;
  const tab = TABS.find((t) => t.id === status)?.id ?? "active";
  const where = tab === "all" ? {} : tab === "active" ? { status: { in: ["CONFIRMED", "PACKED", "SHIPPED"] as ("CONFIRMED" | "PACKED" | "SHIPPED")[] } } : { status: tab };

  const [orders, groups] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: tab === "active" ? "asc" : "desc" }, take: 100, include: { items: true } }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const count = (s: string) => groups.find((g) => g.status === s)?._count._all ?? 0;
  const counts: Record<string, number> = {
    active: count("CONFIRMED") + count("PACKED") + count("SHIPPED"), all: groups.reduce((n, g) => n + g._count._all, 0),
    ...Object.fromEntries(Object.keys(STATUS_LABEL).map((s) => [s, count(s)])),
  };

  return (
    <AdminShell user={session.user} active="orders" title="Orders">
        <nav aria-label="Order status" className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link key={t.id} href={`/admin/orders?status=${t.id}`} aria-current={t.id === tab ? "page" : undefined}
              className={cn("rounded-pill px-4 py-2 text-[13px] font-semibold shadow-hairline", t.id === tab ? "bg-black text-white" : "bg-surface text-ink hover:bg-field")}>
              {t.label} <span className="ml-1 opacity-60">{counts[t.id] ?? 0}</span>
            </Link>
          ))}
        </nav>

        {orders.length === 0 ? (
          <p className="text-[15px] text-ink-muted">No orders here.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {orders.map((o) => {
              const ship = parseShipping(o.shipping);
              const cod = o.paymentMethod === "COD";
              return (
                <li key={o.id} className="rounded-[8px] bg-surface p-4 shadow-hairline">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold">
                        <Link href={`/order/${o.number}`} className="underline-offset-2 hover:underline">{o.number}</Link>
                        <span className="ml-2 rounded-pill bg-field px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{STATUS_LABEL[o.status] ?? o.status}</span>
                      </p>
                      <p className="text-[12px] text-ink-subtle">{o.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[15px] font-bold">{usd(o.totalCents)}</p>
                      <p className={cn("text-[12px] font-semibold", o.paymentStatus === "PAID" ? "text-accent" : "text-ink-muted")}>
                        {cod ? (o.paymentStatus === "PAID" ? "COD · cash collected" : "COD · collect on delivery") : o.paymentStatus === "PAID" ? "Paid online" : o.paymentStatus === "REFUNDED" ? "Refunded" : "Online · unpaid"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-4 text-[13px] leading-5 sm:grid-cols-2">
                    <div>
                      <p className="font-semibold">{ship.name}</p>
                      <p className="text-ink-muted">{ship.line1}{ship.line2 && <>, {ship.line2}</>}, {[ship.city, ship.postal].filter(Boolean).join(" ")}, {ship.country}</p>
                      <p className="text-ink-muted"><a href={`tel:${ship.phone}`} className="underline underline-offset-2">{ship.phone}</a> · {o.email}</p>
                      {ship.notes && <p className="italic text-ink-muted">“{ship.notes}”</p>}
                    </div>
                    <ul className="text-ink-muted">
                      {o.items.map((i) => <li key={i.id}>{i.qty}× {i.name}{[i.color, i.size.toUpperCase()].filter(Boolean).length > 0 && ` (${[i.color, i.size.toUpperCase()].filter(Boolean).join(", ")})`}</li>)}
                    </ul>
                  </div>

                  <div className="mt-3 flex justify-end empty:hidden"><OrderActions number={o.number} status={o.status} cod={cod} /></div>
                </li>
              );
            })}
          </ul>
        )}
    </AdminShell>
  );
}
