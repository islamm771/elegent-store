import { Categories } from "@/features/home/Categories";
import { CuratedGrid } from "@/features/home/CuratedGrid";
import { EditorialBanner } from "@/features/home/EditorialBanner";
import { Hero } from "@/features/home/Hero";
import { NewsletterSection } from "@/features/home/NewsletterSection";
import { ValueProps } from "@/features/home/ValueProps";
import { categories } from "@/features/home/data";
import { MobileTabBar } from "@/features/shell/MobileTabBar";
import { SiteFooter } from "@/features/shell/SiteFooter";
import { SiteHeader } from "@/features/shell/SiteHeader";
import { authOptions } from "@/lib/auth";
import { getHomeData } from "@/lib/shop-data";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let data: Awaited<ReturnType<typeof getHomeData>> | null = null;
  try {
    data = await getHomeData(categories.map((c) => ({ id: c.id, where: c.where })));
  } catch (e) {
    console.error("home load failed", e);
  }

  return (
    <>
      <SiteHeader user={session?.user ?? null} />
      <main className="pb-20 pt-16 lg:pb-0 lg:pt-25.5">
        <Hero />
        <Categories counts={data?.counts ?? {}} />
        {data && data.popular.length > 0 && <CuratedGrid products={data.popular} total={data.totalAll} />}
        <EditorialBanner />
        <ValueProps />
        <NewsletterSection />
      </main>
      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
