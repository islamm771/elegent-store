import { CancelOrderButton } from "@/features/checkout/CancelOrderButton";
import { OrderTracker } from "@/features/checkout/OrderTracker";
import { Photo } from "@/features/home/Photo";
import { MobileTabBar } from "@/features/shell/MobileTabBar";
import { SiteFooter } from "@/features/shell/SiteFooter";
import { SiteHeader } from "@/features/shell/SiteHeader";
import { isAdmin } from "@/lib/admin";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/money";
import { getOrderForUser, parseShipping, syncOrderPayment } from "@/lib/orders";
import { CheckIcon, ClockIcon } from "@/ui";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const metadata = { title: "Your order — Elegent" };
export const dynamic = "force-dynamic";

const usd = (c: number) => money(c / 100, { cents: true });

export default async function OrderPage({ params }: { params: Promise<{ number: string }> }) {
  const session = await getServerSession(authOptions);
  const { number } = await params;
  if (!session) redirect(`/login?callbackUrl=/order/${encodeURIComponent(number)}`);

  // customers see their own orders only; admins can open any order
  const admin = await isAdmin();
  let order = admin
    ? await prisma.order.findFirst({ where: { number }, include: { items: true } })
    : await getOrderForUser(number, session.user.id);
  if (!order) notFound();
  const isOwner = order.userId === session.user.id;
  if (order.paymentMethod === "ONLINE" && order.paymentStatus === "PENDING") {
    await syncOrderPayment(order); // the customer may just have come back from the payment page
    order = (await prisma.order.findUnique({ where: { id: order.id }, include: { items: true } })) ?? order;
  }

  const ship = parseShipping(order.shipping);
  const cod = order.paymentMethod === "COD";
  const cancelled = order.status === "CANCELLED";
  const awaiting = !cod && order.paymentStatus === "PENDING" && !cancelled;

  const headline = cancelled ? "This order was cancelled" : awaiting ? "Waiting for your payment" : "Thank you — your order is in";
  const sub = cancelled ? "No payment was taken. You can go back to your bag and try again."
    : awaiting ? "We haven't received your payment yet. If you just paid, refresh this page in a moment."
      : cod ? `Pay ${usd(order.totalCents)} in cash to the courier on delivery.` : "Your payment was received. We're getting your pieces ready.";

  return (
    <>
      <SiteHeader user={session.user} />
      <main className="mx-auto min-h-[57vh] max-w-360 px-4 pb-24 pt-16 lg:pb-10 lg:pt-25.5 lg:px-6">
        {admin && !isOwner && (
          <p className="mt-2 rounded-field bg-field px-4 py-3 text-[13px] text-ink-muted">Admin view — customer: <b>{order.email}</b>. <Link href="/admin/orders" className="underline underline-offset-2">Back to admin orders</Link></p>
        )}
        <div className="flex flex-col items-start gap-3 py-8">
          <span className="grid size-12 place-items-center rounded-full bg-peach text-ink">{awaiting || cancelled ? <ClockIcon width={20} height={20} /> : <CheckIcon width={20} height={20} />}</span>
          <p className="eyebrow text-accent">Order {order.number}</p>
          <h1 className="font-serif text-[32px] leading-10 lg:text-5xl lg:leading-14">{headline}</h1>
          <p className="text-[15px] leading-6 text-ink-muted">{sub}</p>
          {!cancelled && <p className="text-[13px] text-ink-muted">A confirmation was sent to {order.email}.</p>}
        </div>

        {!cancelled && !awaiting && <OrderTracker status={order.status} createdAt={order.createdAt} updatedAt={order.updatedAt} />}

        <ul className="divide-y divide-line rounded-[8px] bg-surface px-4 shadow-hairline">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-3">
              <Photo src={i.image ?? undefined} tone="#d9c4a4" alt={i.name} className="h-16 w-14 shrink-0 rounded-sm" />
              <div className="flex-1">
                <p className="text-[14px] font-semibold leading-5">{i.name}</p>
                <p className="text-[12px] text-ink-muted">{[i.color, i.size.toUpperCase(), `Qty ${i.qty}`].filter(Boolean).join(" · ")}</p>
              </div>
              <p className="text-[14px] font-bold">{usd(i.unitCents * i.qty)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[8px] bg-surface p-4 shadow-hairline">
            <p className="eyebrow mb-2 text-accent">Deliver to</p>
            <p className="text-[15px] font-semibold">{ship.name}</p>
            <p className="text-[13px] leading-5 text-ink-muted">{ship.line1}{ship.line2 && <>, {ship.line2}</>}<br />{[ship.city, ship.postal].filter(Boolean).join(" ")}, {ship.country}<br />{ship.phone}</p>
          </div>
          <div className="rounded-[8px] bg-surface p-4 shadow-hairline">
            <p className="eyebrow mb-2 text-accent">Payment</p>
            <p className="text-[15px] font-semibold">{cod ? "Cash on delivery" : "Paid online"}</p>
            <dl className="mt-1 flex flex-col gap-1 text-[13px]">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{usd(order.subtotalCents)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{order.shippingCents ? usd(order.shippingCents) : "Free"}</dd></div>
              {order.taxCents > 0 && <div className="flex justify-between"><dt>Tax</dt><dd>{usd(order.taxCents)}</dd></div>}
              <div className="flex justify-between border-t border-line pt-1 text-[15px] font-bold"><dt>Total</dt><dd>{usd(order.totalCents)}</dd></div>
            </dl>
          </div>
        </div>

        {isOwner && (order.status === "PENDING" || order.status === "CONFIRMED") && (
          <div className="mt-6"><CancelOrderButton number={order.number} paid={order.paymentStatus === "PAID"} /></div>
        )}
        {cancelled && order.paymentMethod === "ONLINE" && order.paymentStatus === "PAID" && (
          <p className="mt-6 rounded-field bg-field px-4 py-3 text-[13px] leading-5 text-ink-muted">Your payment was received, and your refund is being processed by our team. We'll email you once it's done.</p>
        )}
        {cancelled && order.paymentStatus === "REFUNDED" && (
          <p className="mt-6 rounded-field bg-field px-4 py-3 text-[13px] leading-5 text-ink-muted">Your payment was refunded in full. It can take a few days to appear on your card.</p>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/shop" className="rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-widest text-white shadow-cta hover:bg-ink">Continue shopping</Link>
          {(cancelled || awaiting) && <Link href="/cart" className="label-caps self-center text-ink underline underline-offset-2">Back to bag</Link>}
          <Link href="/account?tab=orders" className="label-caps self-center text-ink underline underline-offset-2">All my orders</Link>
        </div>
      </main>
      <SiteFooter />
      <MobileTabBar />
    </>
  );
}