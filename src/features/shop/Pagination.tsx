import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/ui";
import { cn } from "@/lib/cn";
import { shopHref, type ShopQuery } from "./query";

export function Pagination({ query, page, pages, shownUpTo, total }: { query: ShopQuery; page: number; pages: number; shownUpTo: number; total: number }) {
  const cell = "grid size-8 place-items-center text-[11px] tracking-[0.1em]";
  const pct = total ? Math.round((shownUpTo / total) * 100) : 0;
  return (
    <div className="flex flex-col items-center gap-4 bg-surface/40 p-7">
      <div className="flex w-full max-w-80 flex-col items-center gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-subtle">Displaying {shownUpTo} of {total} pieces</p>
        <div className="h-1 w-full overflow-hidden rounded-pill bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-pill bg-black" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {page < pages && (
        <Link href={shopHref(query, { page: page + 1 })} scroll={false}
          className="bg-black px-12 py-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-white shadow-hairline hover:bg-ink">Load more pieces</Link>
      )}
      {pages > 1 && (
        <nav aria-label="Pagination" className="hidden items-center gap-1 lg:flex">
          <Link aria-label="Previous page" aria-disabled={page === 1} href={shopHref(query, { page: Math.max(1, page - 1) })} className={cn(cell, "bg-field", page === 1 && "pointer-events-none opacity-40")}><ChevronLeftIcon width={11} height={11} /></Link>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={shopHref(query, { page: n })} aria-current={n === page ? "page" : undefined}
              className={cn(cell, n === page ? "bg-black font-bold text-white" : "bg-field font-semibold text-ink hover:bg-line")}>{n}</Link>
          ))}
          <Link aria-label="Next page" aria-disabled={page === pages} href={shopHref(query, { page: Math.min(pages, page + 1) })} className={cn(cell, "bg-field", page === pages && "pointer-events-none opacity-40")}><ChevronRightIcon width={11} height={11} /></Link>
        </nav>
      )}
    </div>
  );
}
