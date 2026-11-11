"use client";
import { cn } from "@/lib/cn";
import { ArrowRightIcon } from "@/ui";
import Link from "next/link";
import { useState } from "react";
import { categories, categoryTabs } from "./data";
import { Photo, SectionHeader } from "./Photo";

export function Categories({ counts }: { counts: Record<string, number> }) {
  const [tab, setTab] = useState<(typeof categoryTabs)[number]>("all");
  const shown = categories.filter((c) => tab === "all" || (c.groups as readonly string[]).includes(tab));

  return (
    <section className="py-4 lg:bg-canvas lg:py-12">
      <div className="mx-auto max-w-360 px-4 lg:px-6">
        <SectionHeader eyebrow={"Seasonal edit"}
          title="Explore By Category"
          action={
            <>
              <Link href="/shop" className="label-caps pb-1 text-accent underline underline-offset-2 lg:hidden">All ({categories.length})</Link>
              <div role="tablist" aria-label="Category filter" className="hidden gap-6 lg:flex">
                {categoryTabs.map((t) => (
                  <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                    className={cn("eyebrow border-b pb-1 transition-colors", tab === t ? "border-black text-black" : "border-transparent text-ink-subtle hover:text-ink")}>
                    {t}
                  </button>
                ))}
              </div>
            </>
          } />

        <ul className="mt-4 flex snap-x gap-3.5 overflow-x-auto pb-2 scrollbar-none lg:mt-8 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
          {shown.map((c) => (
            <li key={c.id} className="w-35 shrink-0 snap-start lg:w-auto">
              <Link href={c.href} className="group block">
                <Photo src={c.image} tone={c.tone} alt={c.title}
                  className="flex h-46.25 items-end rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] lg:h-90">
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent via-50% to-transparent transition-opacity group-hover:opacity-90" />
                  <p className="relative p-2 text-[9px] font-medium uppercase leading-6 tracking-wider text-white/90 lg:p-4 lg:text-[11px]">{counts[c.id] ?? 0} pieces</p>
                </Photo>
                <h3 className="mt-2.5 font-serif text-base leading-5.5 lg:mt-4 lg:text-xl lg:leading-7">{c.title}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] uppercase leading-6 tracking-widset text-ink-muted lg:text-[11px]">
                  Shop now <ArrowRightIcon width={8} height={8} className="transition-transform group-hover:translate-x-0.5" />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
