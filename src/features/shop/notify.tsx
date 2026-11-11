"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { CheckIcon } from "@/ui";

export function notifyAdded(message = "Added to your shopping bag") {
  toast((t) => (
    <span className="flex items-center gap-4 text-[13px]">
      <CheckIcon width={15} height={15} className="text-peach" />
      {message}
      <Link href="/cart" onClick={() => toast.dismiss(t.id)} className="eyebrow text-peach">View</Link>
    </span>
  ), { duration: 3500 });
}
