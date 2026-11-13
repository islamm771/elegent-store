"use client";
import { useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, StarIcon } from "@/ui";
import { money } from "@/lib/money";
import { Photo } from "@/features/home/Photo";
import { categoryName, type ShopProduct } from "./catalog";
import { notifyAdded } from "./notify";
import { useStore } from "./store";
import { colorTitles, type ReviewData } from "./details";

export function PairingSection({ items }: { items: ShopProduct[] }) {
  const { add } = useStore();
  const scroller = useRef<HTMLUListElement>(null);
  const by = (dir: number) => scroller.current?.scrollBy({ left: dir * 208, behavior: "smooth" });
  if (items.length === 0) return null;

  const addPair = (p: ShopProduct) => {
    add({ id: p.id, name: p.name, price: p.price, color: colorTitles[p.colors[0]], size: p.sizes.includes("m") ? "m" : p.sizes[0], image: p.images[0], tone: p.tone });
    notifyAdded();
  };

  return (
    <section className="py-12 lg:bg-surface/70">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between px-4 lg:px-6">
          <div>
            <p className="eyebrow text-accent"><span className="lg:hidden">Curated pairing</span><span className="hidden lg:inline">Editorial pairing</span></p>
            <h2 className="font-serif text-2xl font-semibold leading-8 lg:text-[36px] lg:leading-[44px] lg:tracking-[-0.025em]"><span className="lg:hidden">Complete The Look</span><span className="hidden lg:inline">Complete The Aesthetic</span></h2>
          </div>
          <div className="flex gap-2 lg:hidden">
            <button type="button" aria-label="Previous" onClick={() => by(-1)} className="grid size-9 place-items-center rounded-pill bg-field"><ChevronLeftIcon width={14} height={14} /></button>
            <button type="button" aria-label="Next" onClick={() => by(1)} className="grid size-9 place-items-center rounded-pill bg-field"><ChevronRightIcon width={14} height={14} /></button>
          </div>
          <p className="hidden max-w-sm text-[15px] leading-6 text-ink-muted lg:block">Hand-selected pieces that complement the palette and silhouette of this one.</p>
        </div>

        <ul ref={scroller} className="mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mt-10 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-6">
          {items.map((p) => (
            <li key={p.id} className="w-48 shrink-0 snap-start lg:w-auto">
              <div className="rounded-[8px] bg-surface p-2 lg:rounded-none lg:bg-transparent lg:p-0">
                <Photo src={p.images[0]} tone={p.tone} alt={p.name} className="h-[229px] rounded-[4px] lg:h-[370px] lg:rounded-none">
                  <Link href={`/shop/${p.id}`} aria-label={`View ${p.name}`} className="absolute inset-0" />
                  <button type="button" aria-label={`Quick add ${p.name}`} onClick={() => addPair(p)} className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-pill bg-black text-white shadow-cta hover:bg-ink">
                    <PlusIcon width={11} height={11} strokeWidth={2.5} />
                  </button>
                </Photo>
                <div className="px-1 pb-1 pt-2.5 lg:px-0 lg:pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-accent">{categoryName(p.category).split(" & ")[0]}</p>
                  <h3 className="truncate text-base font-medium leading-6"><Link href={`/shop/${p.id}`} className="hover:underline">{p.name}</Link></h3>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold">{money(p.price, { cents: true })}</p>
                    <button type="button" onClick={() => addPair(p)} className="hidden text-[11px] font-semibold uppercase tracking-[0.1em] underline underline-offset-2 lg:block">Quick add</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="flex gap-0.5 text-accent" role="img" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => <StarIcon key={n} width={size} height={size} fill={n <= Math.round(value) ? "currentColor" : "none"} />)}
    </span>
  );
}

export function ReviewsSection({ rating, count, data }: { rating: number; count: number; data?: ReviewData }) {
  const fit = data && [["Runs small", data.fit.small], ["True to size", data.fit.true], ["Runs large", data.fit.large]] as const;
  return (
    <section id="reviews" className="hidden scroll-mt-32 px-6 py-12 lg:block">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-12">
        <aside className="col-span-4 flex flex-col gap-5 bg-surface/70 p-6">
          <p className="eyebrow text-accent">Verified verdict</p>
          <div className="flex items-end gap-3">
            <span className="font-serif text-6xl leading-none">{rating.toFixed(1)}</span>
            <div className="pb-1"><Stars value={rating} /><p className="pt-1 text-[13px] text-ink-muted">Based on {count} clients</p></div>
          </div>
          {data ? (
            <>
              <ul className="flex flex-col gap-1.5">
                {[5, 4, 3, 2, 1].map((n, idx) => (
                  <li key={n} className="flex items-center gap-3 text-[11px] font-semibold text-ink-muted">
                    <span className="w-3">{n}</span>
                    <span className="h-1 flex-1 overflow-hidden rounded-pill bg-line"><span className="block h-full bg-black" style={{ width: `${data.dist[idx]}%` }} /></span>
                    <span className="w-8 text-right">{data.dist[idx]}%</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line pt-4">
                <p className="eyebrow pb-2 text-ink">Fit feedback</p>
                {fit!.map(([label, v]) => <p key={label} className="flex justify-between text-[13px] leading-6 text-ink-muted"><span>{label}</span><b className="text-ink">{v}%</b></p>)}
              </div>
            </>
          ) : (
            <p className="text-[13px] leading-5 text-ink-muted">Detailed client feedback for this piece will appear here.</p>
          )}
          <button type="button" className="border border-ink/30 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] hover:bg-field">Write an atelier review</button>
        </aside>

        <div className="col-span-8 flex flex-col divide-y divide-line">
          {data ? data.items.map((r) => (
            <article key={r.author} className="flex flex-col gap-2 py-6 first:pt-0">
              <div className="flex items-center justify-between"><Stars value={5} /><span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-subtle">{r.when}</span></div>
              <h3 className="text-lg font-semibold leading-7">{r.title}</h3>
              <p className="text-[15px] leading-6 text-ink-muted">{r.body}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em]">{r.author} <span className="font-medium text-ink-subtle">· Verified buyer · Size {r.size}</span></p>
            </article>
          )) : <p className="text-[15px] leading-6 text-ink-muted">No written reviews yet.</p>}
        </div>
      </div>
    </section>
  );
}
