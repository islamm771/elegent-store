import { authOptions } from "@/lib/auth";
import { parseAddresses } from "@/lib/account";
import { prisma } from "@/lib/db";
import { isOnlineEnabled } from "@/lib/stripe";
import { CheckoutView } from "@/features/checkout/CheckoutView";
import { MobileTabBar } from "@/features/shell/MobileTabBar";
import { SiteFooter } from "@/features/shell/SiteFooter";
import { SiteHeader } from "@/features/shell/SiteHeader";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Checkout — Elegent" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/checkout"); // the bag of a signed-in user lives in the database, which is what the order is built from

  const { cancelled } = await searchParams;
  const u = await prisma.user.findUnique({ where: { id: session.user.id } }).catch(() => null);
  const user = {
    name: u?.name ?? session.user.name ?? "",
    email: u?.email ?? session.user.email ?? "",
    phone: u?.phone ?? "",
    addresses: parseAddresses(u?.addresses),
  };

  return (
    <>
      <SiteHeader user={session.user} />
      <main className="mx-auto min-h-[57vh] max-w-360 px-4 pb-24 pt-16 lg:px-6 lg:pb-10 lg:pt-25.5">
        <div className="py-6 lg:py-10">
          <p className="eyebrow text-accent">Secure checkout</p>
          <h1 className="font-serif text-[32px] leading-10 lg:text-5xl lg:leading-14">Checkout</h1>
        </div>
        <CheckoutView user={user} onlineEnabled={isOnlineEnabled()} cancelled={cancelled === "1"} />
      </main>
      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
