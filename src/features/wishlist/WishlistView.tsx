"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BagIcon, HeartIcon } from "@/ui";
import { colorTitles } from "@/features/shop/details";
import type { ShopProduct } from "@/features/shop/catalog";
import { notifyAdded } from "@/features/shop/notify";
import { ShopProductCard } from "@/features/shop/ShopProductCard";
import { useStore } from "@/features/shop/store";
import { toShopProduct } from "@/features/shop/view";

const grid = "grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-12";

async function fetchProducts(query: string): Promise<ShopProduct[]> {
  const res = await fetch(`/api/products?${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error(String(res.status));
  const json = await res.json();
  return (json.items as Parameters<typeof toShopProduct>[0][]).map(toShopProduct);
}

export function WishlistView() {
  const { wishlist, ready, add, clearWishlist } = useStore();
  const [confirming, setConfirming] = useState(false);
  const [loaded, setLoaded] = useState<Record<string, ShopProduct>>({});
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [popular, setPopular] = useState<ShopProduct[]>([]);

  const key = wishlist.join(",");

  // Load whichever saved products we don't have yet. Ids that no longer exist (hidden/deleted) simply don't come back.
  useEffect(() => {
    if (!ready) return;
    const missing = wishlist.filter((id) => !(id in loaded));
    if (missing.length === 0) { setStatus("ready"); return; }
    let cancelled = false;
    setStatus("loading");
    fetchProducts(`slugs=${missing.slice(0, 48).join(",")}&pageSize=48`)
      .then((items) => { if (!cancelled) { setLoaded((l) => ({ ...l, ...Object.fromEntries(items.map((p) => [p.id, p])) })); setStatus("ready"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, key]);

  const saved = useMemo(() => wishlist.map((id) => loaded[id]).filter((p): p is ShopProduct => Boolean(p)), [wishlist, loaded]);

  // "Most loved" suggestions, only needed for the empty state
  const needSuggestions = ready && status === "ready" && saved.length === 0;
  useEffect(() => {
    if (!needSuggestions || popular.length) return;
    fetchProducts("sort=popular&pageSize=8").then(setPopular).catch(() => {});
  }, [needSuggestions, popular.length]);
  const suggestions = useMemo(() => popular.filter((p) => !wishlist.includes(p.id)).slice(0, 4), [popular, wishlist]);

  function moveAllToBag() {
    const buyable = saved.filter((p) => p.stock > 0);
    buyable.forEach((p) =>
      add({ id: p.id, name: p.name, price: p.price, color: colorTitles[p.colors[0]], size: p.sizes.includes("m") ? "m" : p.sizes[0], image: p.images[0], tone: p.tone }));
    notifyAdded(`${buyable.length} ${buyable.length === 1 ? "piece" : "pieces"} added to your bag`);
  }

  const loading = !ready || (status === "loading" && wishlist.length > 0 && saved.length === 0);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-12 lg:px-6">
      <header className="flex flex-col gap-4 py-6 lg:flex-row lg:items-end lg:justify-between lg:py-10">
        <div className="flex flex-col gap-1">
          <p className="eyebrow text-accent">Saved edits</p>
          <h1 className="font-serif text-[32px] font-medium leading-10 tracking-[-0.025em] lg:text-5xl lg:leading-[56px]">Your Wishlist</h1>
          <p className="text-[13px] leading-5 text-ink-muted lg:text-[15px] lg:leading-6" aria-live="polite">
            {loading ? "Loading your saved pieces…" : status === "error" ? "We couldn’t load your saved pieces." : saved.length === 0 ? "Pieces you save will wait for you here." : `${saved.length} ${saved.length === 1 ? "piece" : "pieces"} saved on this device`}
          </p>
        </div>

        {ready && saved.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={moveAllToBag} className="flex items-center gap-2 rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-cta hover:bg-ink">
              <BagIcon width={14} height={14} /> Move all to bag
            </button>
            {confirming ? (
              <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.05em]">
                Remove all?
                <button type="button" onClick={() => { clearWishlist(); setConfirming(false); }} className="text-danger underline underline-offset-2">Yes, clear</button>
                <button type="button" onClick={() => setConfirming(false)} className="text-ink-muted underline underline-offset-2">Cancel</button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="label-caps text-ink-muted underline underline-offset-2 hover:text-ink">Clear all</button>
            )}
          </div>
        )}
      </header>

      {status === "error" && saved.length === 0 ? (
        <div role="alert" className="flex flex-col items-start gap-3 rounded-[8px] bg-surface p-6 shadow-hairline">
          <p className="text-[15px] leading-6 text-ink-muted">Please check your connection and try again.</p>
          <button type="button" onClick={() => { setStatus("loading"); setLoaded({}); }} className="label-caps text-ink underline underline-offset-2">Retry</button>
        </div>
      ) : loading ? (
        <div className={grid} aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse flex-col gap-2">
              <div className="h-[231px] rounded-[8px] bg-field lg:h-[393px] lg:rounded-none" />
              <div className="h-3 w-1/3 rounded-pill bg-field" /><div className="h-4 w-3/4 rounded-pill bg-field" />
            </div>
          ))}
        </div>
      ) : saved.length > 0 ? (
        <div className={grid}>{saved.map((p) => <ShopProductCard key={p.id} product={p} />)}</div>
      ) : (
        <>
          <div className="flex flex-col items-start gap-4 rounded-[8px] bg-surface p-6 shadow-hairline lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-pill bg-[#fed9b9]"><HeartIcon width={20} height={20} /></span>
              <div>
                <h2 className="font-serif text-2xl font-semibold leading-8">Nothing saved yet</h2>
                <p className="max-w-lg pt-1 text-[15px] leading-6 text-ink-muted">Tap the heart on any piece to keep it here. Your wishlist is stored on this device.</p>
              </div>
            </div>
            <Link href="/shop" className="rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-cta hover:bg-ink">Browse the capsule</Link>
          </div>

          {suggestions.length > 0 && (
            <section className="pt-12" aria-labelledby="loved">
              <p className="eyebrow text-accent">Most loved</p>
              <h2 id="loved" className="pb-6 font-serif text-2xl font-semibold leading-8 lg:text-[36px] lg:leading-[44px] lg:tracking-[-0.025em]">Start with these</h2>
              <div className={grid}>{suggestions.map((p) => <ShopProductCard key={p.id} product={p} />)}</div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
