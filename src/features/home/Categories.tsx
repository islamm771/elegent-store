"use client";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useState } from "react";
import CategoryCard from "./CategoryCard";
import { categories, categoryTabs } from "./data";
import { SectionHeader } from "./Photo";

export function Categories({ counts }: { counts: Record<string, number> }) {
  const [tab, setTab] = useState<(typeof categoryTabs)[number]>("all");
  const shown = categories.filter((c) => tab === "all" || (c.groups as readonly string[]).includes(tab));

  return (
    <section className="py-4 lg:bg-canvas lg:py-12">
      <div className="mx-auto max-w-360 px-4 lg:px-6">
        <SectionHeader eyebrow={"Seasonal edit"}
          title="Curated Categories"
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
              <CategoryCard c={c} counts={counts} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
