"use client";
import Link from "next/link";
import { HeartIcon } from "@/ui";
import { useStore } from "@/features/shop/store";

/** Header shortcut to /wishlist (desktop; on mobile the tab bar already has it). */
export function WishlistButton() {
  const { wishlist } = useStore();
  const n = wishlist.length;
  return (
    <Link href="/wishlist" aria-label={`Wishlist${n ? `, ${n} saved` : ""}`} className="relative hidden size-10 place-items-center rounded-pill hover:bg-field lg:grid">
      <HeartIcon width={18} height={18} />
      {n > 0 && <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-pill bg-black text-[9px] font-bold text-white">{n}</span>}
    </Link>
  );
}
