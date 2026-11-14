import { MobileTabBar } from "@/features/shell/MobileTabBar";
import { SiteFooter } from "@/features/shell/SiteFooter";
import { SiteHeader } from "@/features/shell/SiteHeader";
import { CartView } from "@/features/shop/CartView";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const metadata = { title: "Your bag — Elegent" };

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <SiteHeader user={session?.user ?? null} />
      <main className="mx-auto min-h-[57vh] max-w-360 px-4 pb-24 pt-16 lg:pb-10 lg:pt-25.5 lg:px-6">
        <div className="py-6 lg:py-10">
          <p className="eyebrow text-accent">Shopping bag</p>
          <h1 className="mb-6 font-serif text-[32px] leading-10 lg:text-5xl lg:leading-14">Your bag</h1>
        </div>
        <CartView />
      </main>
      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
