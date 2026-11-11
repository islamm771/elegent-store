"use client";
import Link from "next/link";
import { BagIcon } from "@/ui";
import { useStore } from "@/features/shop/store";

export function BagButton() {
  const { count } = useStore();
  return (
    <Link href="/cart" aria-label={`Shopping bag${count ? `, ${count} items` : ""}`} className="relative grid size-10 place-items-center rounded-pill hover:bg-field">
      <BagIcon width={18} height={18} />
      {count > 0 && <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-pill bg-black text-[9px] font-bold text-white">{count}</span>}
    </Link>
  );
}
