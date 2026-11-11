import Link from "next/link";
import { BadgeCheckIcon, ShieldIcon, TruckIcon } from "@/ui";

export function TrustStrip() {
  return (
    <>
      {/* mobile: inline row */}
      <div className="eyebrow mt-7 flex items-center justify-center gap-5 text-ink-subtle lg:hidden">
        <span className="flex items-center gap-1.5"><BadgeCheckIcon width={15} height={15} /> Official boutique</span>
        <span className="size-1 rounded-pill bg-ink-faint" />
        <span className="flex items-center gap-1.5"><TruckIcon width={15} height={15} /> Express dispatch</span>
      </div>

      {/* desktop: boxed + legal row */}
      <footer className="hidden pt-8 lg:block">
        <ul className="label-caps grid grid-cols-3 gap-2 rounded-field bg-field p-4 text-center text-ink">
          <li className="flex flex-col items-center gap-1"><BadgeCheckIcon /> Official boutique</li>
          <li className="flex flex-col items-center gap-1"><TruckIcon /> Express dispatch</li>
          <li className="flex flex-col items-center gap-1"><ShieldIcon /> Concierge security</li>
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-1 text-[11px] font-semibold tracking-[0.05em]">
          <span className="text-accent">© MMXXIV Maison Elegent. All rights reserved.</span>
          <span className="flex gap-6 whitespace-nowrap text-ink-muted">
            <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ink">Terms of Service</Link>
          </span>
        </div>
      </footer>
    </>
  );
}
