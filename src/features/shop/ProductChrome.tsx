"use client";
import { BagButton } from "@/features/shell/BagButton";
import { ArrowLeftIcon, HeartIcon, ShareIcon } from "@/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { categoryName, type ShopProduct } from "./catalog";
import { shareProduct } from "./share";
import { useStore } from "./store";

export function ProductMobileHeader({ product }: { product: ShopProduct }) {
  const router = useRouter();
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-canvas/90 px-2 shadow-[0_1px_8px_rgba(45,34,27,0.06)] backdrop-blur-md lg:hidden">
      <button type="button" aria-label="Back" onClick={() => (window.history.length > 1 ? router.back() : router.push("/shop"))} className="grid size-10 place-items-center rounded-pill hover:bg-field">
        <ArrowLeftIcon width={18} height={18} />
      </button>
      <Link href="/" className="font-serif text-xl font-bold uppercase tracking-[4px] text-black">Elegent</Link>
      <div className="flex items-center">
        <button type="button" aria-label="Share" onClick={() => shareProduct(product.name)} className="grid size-10 place-items-center rounded-pill hover:bg-field"><ShareIcon width={17} height={17} /></button>
        <BagButton />
      </div>
    </header>
  );
}

export function ProductBreadcrumb({ product }: { product: ShopProduct }) {
  const { isSaved, toggleSaved } = useStore();
  const saved = isSaved(product.id);
  const crumb = "text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-subtle hover:text-ink";
  return (
    <div>
      <div className="mx-auto flex max-w-360 items-center justify-between py-6 flex-wrap gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link href="/" className={crumb}>Home</Link><span className="text-ink-faint">/</span>
          <Link href="/shop" className={crumb}>Shop</Link><span className="text-ink-faint">/</span>
          <Link href={`/shop?cat=${product.category}`} className={crumb}>{categoryName(product.category).split(" & ")[0]}</Link><span className="text-ink-faint">/</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-black">{product.name}</span>
        </nav>
        <div className="flex items-center gap-6 text-[11px] font-semibold uppercase tracking-wider">
          <button type="button" onClick={() => shareProduct(product.name)} className="flex items-center gap-1.5 hover:text-accent"><ShareIcon width={13} height={13} /> Share</button>
          <button type="button" aria-pressed={saved} onClick={() => toast(toggleSaved(product.id) ? "Saved to wishlist" : "Removed from wishlist")} className="flex items-center gap-1.5 hover:text-accent">
            <HeartIcon width={13} height={13} fill={saved ? "currentColor" : "none"} className={saved ? "text-accent" : undefined} /> {saved ? "Saved" : "Save to wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
