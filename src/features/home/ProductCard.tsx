"use client";
import { materialName, type ShopProduct } from "@/features/shop/catalog";
import { colorTitles } from "@/features/shop/details";
import { notifyAdded } from "@/features/shop/notify";
import { useStore } from "@/features/shop/store";
import { cn } from "@/lib/cn";
import { money } from "@/lib/money";
import { HeartIcon, PlusIcon, StarIcon } from "@/ui";
import Link from "next/link";
import toast from "react-hot-toast";
import { Photo } from "./Photo";

export function ProductCard({ product: p }: { product: ShopProduct }) {
  const { add, isSaved, toggleSaved } = useStore();
  const saved = isSaved(p.id);
  const soldOut = p.stock <= 0;
  const color = colorTitles[p.colors[0]] ?? "";
  const glass = "backdrop-blur-[2px] bg-canvas/90";

  return (
    <article className="flex flex-col rounded-lg bg-surface">
      <Photo src={p.images[0]} tone={p.tone} alt={p.name} className="h-50.75 rounded-t-lg lg:h-85">
        {p.badge && (
          <span className={cn("absolute left-2 top-2 rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase leading-6 tracking-wider",
            p.badge.tone === "accent" ? "bg-accent text-white" : `${glass} text-ink`)}>{p.badge.text}</span>
        )}
        <button type="button" aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={saved}
          onClick={() => toast(toggleSaved(p.id) ? "Saved to wishlist" : "Removed from wishlist")}
          className={cn("absolute right-2 top-2 grid size-8 place-items-center rounded-pill shadow-hairline", glass)}>
          <HeartIcon width={14} height={14} fill={saved ? "currentColor" : "none"} className={saved ? "text-accent" : undefined} />
        </button>
        <button type="button" aria-label={`Quick add ${p.name}`} disabled={soldOut}
          onClick={() => { add({ id: p.id, name: p.name, price: p.price, color, image: p.images[0], tone: p.tone }); notifyAdded(); }}
          className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-pill bg-black text-white shadow-cta hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink-subtle">
          <PlusIcon width={11} height={11} strokeWidth={2.5} />
        </button>
      </Photo>

      <div className="flex flex-col gap-1 p-3">
        <p className="flex items-center gap-1 text-[11px] font-medium tracking-widset text-ink-muted">
          <StarIcon width={11} height={11} fill="currentColor" className="text-accent" /> {p.rating.toFixed(1)} ({p.reviews})
        </p>
        <h3 className="truncate text-base font-medium leading-6"><Link href={`/shop/${p.id}`} className="hover:underline">{p.name}</Link></h3>
        <p className="text-[13px] leading-5 text-ink-muted">{color}</p>
        <p className="hidden eyebrow text-accent lg:block">{materialName(p.material)}</p>
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-lg font-semibold leading-6.5">{money(p.price)}</span>
          <span className="truncate text-[10px] uppercase leading-6 tracking-wider text-accent">{soldOut ? "Sold out" : p.label}</span>
        </div>
      </div>
    </article>
  );
}
