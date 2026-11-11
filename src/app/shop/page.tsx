import { MobileTabBar } from "@/features/shell/MobileTabBar";
import { SiteFooter } from "@/features/shell/SiteFooter";
import { SiteHeader } from "@/features/shell/SiteHeader";
import { ActiveFilters, MobileFilterBar, SearchBar, SortSelect, ViewToggle } from "@/features/shop/Controls";
import { FilterPanel } from "@/features/shop/FilterPanel";
import { Pagination } from "@/features/shop/Pagination";
import { CapsuleHero, DeptPills, Footnote, MobileLookbook, SustainabilityBanner } from "@/features/shop/Sections";
import { ShopProductCard } from "@/features/shop/ShopProductCard";
import { parseQuery, type Params } from "@/features/shop/query";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { getShopPage } from "@/lib/shop-data";
import { getServerSession } from "next-auth";
import Link from "next/link";

export const metadata = { title: "Shop — Elegent" };
export const dynamic = "force-dynamic"; // always read the live catalogue

export default async function ShopPage({ searchParams }: { searchParams: Promise<Params> }) {
  const query = parseQuery(await searchParams);
  const session = await getServerSession(authOptions);
  const list = query.view === "list";

  let data: Awaited<ReturnType<typeof getShopPage>> | null = null;
  try {
    data = await getShopPage(query);
  } catch (e) {
    console.error("shop load failed", e);
  }
  const { items = [], total = 0, pages = 1, page = 1, shownUpTo = 0, totalAll = 0, categoryCounts = [] } = data ?? {};

  return (
    <>
      <SiteHeader user={session?.user ?? null} />
      <main className="pb-24 pt-16 lg:pb-0 lg:pt-25.5">
        {/* mobile controls */}
        <div className="lg:hidden">
          <div className="px-4 pb-2 pt-3"><SearchBar /></div>
          <DeptPills query={query} />
          <div className="px-4"><MobileFilterBar total={total} /></div>
        </div>
        <MobileLookbook />
        <CapsuleHero query={query} total={totalAll} />

        <section className="mx-auto max-w-360 px-4 lg:px-6 lg:py-7">
          <div className="hidden items-center justify-between gap-4 bg-surface/40 p-4 lg:flex">
            <ActiveFilters shown={items.length} total={total} />
            <div className="flex items-center gap-4">
              <SortSelect />
              <ViewToggle />
            </div>
          </div>

          <div className="lg:mt-7 lg:grid lg:grid-cols-12 lg:gap-7">
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-30.5 max-h-[calc(100dvh-8.5rem)] overflow-y-auto"><FilterPanel categoryCounts={categoryCounts} totalAll={totalAll} /></div>
            </aside>

            <div className="flex flex-col gap-7 px-4 py-4 lg:col-span-9 lg:gap-12 lg:p-0">
              {!data ? (
                <div role="alert" className="flex flex-col items-center gap-3 rounded-[8px] bg-surface/60 px-6 py-16 text-center">
                  <h2 className="font-serif text-2xl">We couldn’t load the collection</h2>
                  <p className="max-w-sm text-[13px] leading-5 text-ink-muted">Something went wrong on our side. Please refresh the page in a moment.</p>
                </div>
              ) : items.length > 0 ? (
                <div className={cn("grid grid-cols-2 gap-x-3 gap-y-6 lg:gap-x-4 lg:gap-y-12", list ? "lg:grid-cols-1" : "lg:grid-cols-3")}>
                  {items.map((p) => <ShopProductCard key={p.id} product={p} list={list} />)}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-[8px] bg-surface/60 px-6 py-16 text-center">
                  <h2 className="font-serif text-2xl">No pieces match these filters</h2>
                  <p className="max-w-sm text-[13px] leading-5 text-ink-muted">Try removing a filter or two, or browse the full capsule.</p>
                  <Link href="/shop" className="label-caps text-ink underline underline-offset-2">Clear all filters</Link>
                </div>
              )}
              {items.length > 0 && <Pagination query={query} page={page} pages={pages} shownUpTo={shownUpTo} total={total} />}
            </div>
          </div>
        </section>

        <Footnote />
        <SustainabilityBanner />
      </main>
      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
