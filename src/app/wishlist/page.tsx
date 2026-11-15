import { MobileTabBar } from "@/features/shell/MobileTabBar";
import { SiteFooter } from "@/features/shell/SiteFooter";
import { SiteHeader } from "@/features/shell/SiteHeader";
import { WishlistView } from "@/features/wishlist/WishlistView";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const metadata = { title: "Wishlist — Elegent" };

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <SiteHeader user={session?.user ?? null} />
      <main className="min-h-dvh pb-24 pt-16 lg:min-h-0 lg:pb-0 lg:pt-25.5">
        <WishlistView />
      </main>
      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
