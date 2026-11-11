"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { HeartIcon, PlusIcon, StarIcon } from "@/ui";
import { cn } from "@/lib/cn";
import { Photo } from "@/features/home/Photo";
import { money } from "@/lib/money";
import { colorById, type BadgeTone, type ShopProduct } from "./catalog";
import { notifyAdded } from "./notify";
import { useStore } from "./store";

const badgeTone: Record<BadgeTone, string> = {
  dark: "bg-black text-white",
  accent: "bg-accent text-white",
  danger: "bg-[#ffdad6] text-[#93000a] lg:bg-danger lg:text-white",
  light: "bg-line text-ink",
};

export function ShopProductCard({ product: p, list = false }: { product: ShopProduct; list?: boolean }) {
  const { add, isSaved, toggleSaved } = useStore();
  const [colorId, setColorId] = useState<string>(p.colors[0]);
  const color = colorById(colorId);
  const saved = isSaved(p.id);
  const glass = "bg-canvas/80 backdrop-blur-[6px]";
  const soldOut = p.stock <= 0;
  const image = p.images[0];

  function quickAdd() {
    if (soldOut) return;
    add({ id: p.id, name: p.name, price: p.price, color: color.name, size: p.sizes.includes("m") ? "m" : p.sizes[0], image, tone: p.tone });
    notifyAdded();
  }

  return (
    <article className={cn("group flex flex-col", list && "lg:flex-row lg:items-stretch lg:gap-6")}>
      <div className={cn("relative overflow-hidden rounded-[8px] bg-field shadow-[0_1px_2px_rgba(0,0,0,0.05)] lg:rounded-none lg:bg-surface lg:shadow-none", list && "lg:w-72 lg:shrink-0")}>
        <Photo src={image} tone={p.tone} alt={p.name} className={cn("h-[231px] lg:h-[393px]", list && "lg:h-[360px]")} />
        {p.badge && (
          <span className={cn("absolute left-2.5 top-2.5 rounded-[2px] px-2 py-0.5 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] shadow-hairline lg:left-3 lg:top-3 lg:py-1", badgeTone[p.badge.tone])}>
            {p.badge.text}
          </span>
        )}
        <button type="button" aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={saved}
          onClick={() => toast(toggleSaved(p.id) ? "Saved to wishlist" : "Removed from wishlist")}
          className={cn("absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-pill shadow-hairline lg:right-3 lg:top-3 lg:size-9", glass)}>
          <HeartIcon width={14} height={14} fill={saved ? "currentColor" : "none"} className={saved ? "text-accent" : undefined} />
        </button>
        <button type="button" onClick={quickAdd} disabled={soldOut} aria-label={`Quick add ${p.name}`}
          className="absolute inset-x-3 bottom-2 disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-ink-subtle flex items-center justify-center gap-1 rounded-[2px] bg-black/95 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-white opacity-90 shadow-cta backdrop-blur-[2px] transition lg:inset-x-4 lg:bottom-4 lg:translate-y-1 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          {soldOut ? "Sold out" : <><PlusIcon width={9} height={9} strokeWidth={2.5} /> Quick add</>}
        </button>
      </div>

      <div className={cn("flex flex-col gap-0.5 pt-2.5 lg:gap-1 lg:pt-2", list && "lg:flex-1 lg:justify-center lg:pt-0")}>
        <div className="flex items-center justify-between">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.05em] text-accent">
            <span className="lg:hidden">{color.name}</span><span className="hidden lg:inline">{p.label}</span>
          </p>
          <p className="flex items-center gap-0.5 text-[11px] font-semibold tracking-[0.1em]">
            <StarIcon width={11} height={11} fill="currentColor" className="text-accent" /> {p.rating.toFixed(1)}
            <span className="text-ink-muted lg:hidden">({p.reviews})</span>
          </p>
        </div>
        <h3 className="truncate text-base font-medium leading-6 lg:font-semibold lg:whitespace-normal">
          <Link href={`/shop/${p.id}`} className="hover:underline">{p.name}</Link>
        </h3>
        <div className="flex items-center justify-between pt-1.5 lg:pt-1">
          <p className="flex items-baseline gap-1.5 text-base font-semibold leading-6 lg:font-bold">
            <span><span className="lg:hidden">{money(p.price)}</span><span className="hidden lg:inline">{money(p.price, { cents: true })}</span></span>
            {p.compareAt && <s className="text-[13px] font-normal text-ink-muted">{money(p.compareAt)}</s>}
          </p>
          <div className="flex items-center gap-1 lg:gap-1.5" role="group" aria-label="Colours">
            {p.colors.map((id) => {
              const c = colorById(id);
              return (
                <button key={id} type="button" aria-label={c.name} aria-pressed={id === colorId} onClick={() => setColorId(id)}
                  className={cn("size-2.5 rounded-full lg:size-3", id === colorId && "ring-1 ring-black/70 ring-offset-1 ring-offset-canvas")}
                  style={{ backgroundColor: c.hex }} />
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
