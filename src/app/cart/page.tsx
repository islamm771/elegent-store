import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MobileTabBar } from "@/features/shell/MobileTabBar";
import { SiteHeader } from "@/features/shell/SiteHeader";
import { CartView } from "@/features/shop/CartView";

export const metadata = { title: "Your bag — Elegent" };

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <SiteHeader user={session?.user ?? null} />
      <main className="mx-auto min-h-dvh max-w-5xl px-5 pb-24 pt-24 lg:pt-36">
        <p className="eyebrow text-accent">Shopping bag</p>
        <h1 className="mb-6 font-serif text-[32px] leading-10 lg:text-5xl lg:leading-[56px]">Your bag</h1>
        <CartView />
      </main>
      <MobileTabBar />
    </>
  );
}
