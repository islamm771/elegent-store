"use client";
import { Photo } from "@/features/home/Photo";
import { cn } from "@/lib/cn";
import { HeartIcon, SearchIcon, ShareIcon } from "@/ui";
import { useState, type MouseEvent } from "react";
import toast from "react-hot-toast";
import type { ShopProduct } from "./catalog";
import { shareProduct } from "./share";
import { useStore } from "./store";

interface Slide { label: string; src: string; tone: string }

export function ProductGallery({ product, slides, capsule, slowCraft }: { product: ShopProduct; slides: Slide[]; capsule: string; slowCraft: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<string | null>(null); // transform-origin while hovering (desktop only)
  const { isSaved, toggleSaved } = useStore();
  const saved = isSaved(product.id);
  const slide = slides[i];

  const move = (e: MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const glass = "bg-canvas/80 backdrop-blur-[6px]";

  return (
    <div className="flex flex-col lg:flex-row-reverse lg:gap-4">
      <div className="relative h-130 overflow-hidden bg-sand lg:h-200.75 lg:flex-1 lg:cursor-zoom-in" onMouseMove={move} onMouseLeave={() => setZoom(null)}>
        <div className="absolute inset-0 transition-transform duration-200 ease-out" style={zoom ? { transform: "scale(1.9)", transformOrigin: zoom } : undefined}>
          <Photo src={slide.src} tone={slide.tone} alt={`${product.name} — ${slide.label}`} className="size-full" />
        </div>

        {/* mobile: actions + look badge + pager */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 lg:hidden">
          <button type="button" aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={saved}
            onClick={() => toast(toggleSaved(product.id) ? "Saved to wishlist" : "Removed from wishlist")}
            className={cn("grid size-10 place-items-center rounded-pill shadow-hairline", glass)}>
            <HeartIcon width={16} height={16} fill={saved ? "currentColor" : "none"} className={saved ? "text-accent" : undefined} />
          </button>
          <button type="button" aria-label="Share" onClick={() => shareProduct(product.name)} className={cn("grid size-10 place-items-center rounded-pill shadow-hairline", glass)}>
            <ShareIcon width={15} height={15} />
          </button>
        </div>
        <p className="eyebrow absolute bottom-4 left-4 rounded-[2px] bg-black/80 px-3 py-1.5 text-white backdrop-blur-sm lg:hidden">{capsule} · Look 04</p>
        <div className="absolute bottom-5 right-4 flex gap-1.5 rounded-pill bg-black/30 px-2 py-1.5 backdrop-blur-sm lg:hidden" role="tablist" aria-label="Image">
          {slides.map((s, n) => (
            <button key={s.label} type="button" role="tab" aria-selected={n === i} aria-label={s.label} onClick={() => setI(n)}
              className={cn("h-1.5 rounded-pill transition-all", n === i ? "w-4 bg-white" : "w-1.5 bg-white/60")} />
          ))}
        </div>

        {/* desktop: badges + zoom hint */}
        <div className="absolute left-4 top-4 hidden flex-col items-start gap-2 lg:flex">
          <p className="eyebrow bg-black px-3 py-1.5 text-white">{capsule}</p>
          <p className="eyebrow bg-canvas/80 px-3 py-1.5 text-ink backdrop-blur-sm">{slowCraft}</p>
        </div>
        <p className="eyebrow pointer-events-none absolute bottom-4 left-4 hidden items-center gap-2 bg-canvas/80 px-3 py-2 text-ink backdrop-blur-sm lg:flex">
          <SearchIcon width={13} height={13} /> Hover to inspect weave
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto px-1 pb-1 pt-3 scrollbar-none lg:flex-col lg:gap-3 lg:overflow-visible lg:p-0" role="group" aria-label="Product images">
        {slides.map((s, n) => (
          <button key={s.label} type="button" aria-label={s.label} aria-pressed={n === i} onClick={() => setI(n)}
            className={cn("h-20 w-16 shrink-0 overflow-hidden rounded-sm lg:h-28 lg:w-20 lg:rounded-none",
              n === i ? "ring-2 ring-black ring-offset-2 ring-offset-canvas lg:ring-1 lg:ring-offset-0" : "opacity-75 ring-1 ring-ink-faint hover:opacity-100 lg:ring-0")}>
            <Photo src={s.src} tone={s.tone} className="size-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
