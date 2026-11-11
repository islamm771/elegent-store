"use client";
import { cn } from "@/lib/cn";
import { ChevronDownIcon, GridIcon, ListIcon, SearchIcon, SlidersIcon, XIcon } from "@/ui";
import { useEffect, useState, type FormEvent } from "react";
import { categoryName, colorById, departments, materialName, sortOptions } from "./catalog";
import { FilterPanel } from "./FilterPanel";
import { useQueryState } from "./useQueryState";

export function SortSelect({ mobile = false }: { mobile?: boolean }) {
  const { sp, set, pending } = useQueryState();
  return (
    <label className="flex items-center gap-1.5">
      <span className={cn("text-[11px] uppercase tracking-wider", mobile ? "hidden" : "font-semibold text-ink-subtle")}>Sort by</span>
      <span className={cn("relative", mobile ? "rounded-pill bg-surface shadow-hairline" : "bg-sand", pending && "opacity-70")}>
        <select aria-label="Sort" value={sp.get("sort") ?? "featured"} onChange={(e) => set("sort", e.target.value === "featured" ? null : e.target.value)}
          className={cn("appearance-none bg-transparent font-semibold uppercase outline-none", mobile ? "py-1.5 pl-3 pr-6 text-[11px] tracking-wider" : "py-2 pl-4 pr-8 text-[13px] tracking-wider")}>
          {sortOptions.map((o) => <option key={o.id} value={o.id}>{mobile ? `Sort: ${o.short}` : o.label}</option>)}
        </select>
        <ChevronDownIcon width={10} height={10} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
      </span>
    </label>
  );
}

export function ViewToggle() {
  const { sp, set } = useQueryState();
  const list = sp.get("view") === "list";
  const btn = "grid size-7 place-items-center";
  return (
    <div className="flex items-center gap-1 bg-field p-1" role="group" aria-label="Layout">
      <button type="button" aria-label="Grid view" aria-pressed={!list} onClick={() => set("view", null)} className={cn(btn, !list && "bg-black text-white")}><GridIcon width={13} height={13} /></button>
      <button type="button" aria-label="List view" aria-pressed={list} onClick={() => set("view", "list")} className={cn(btn, list && "bg-black text-white")}><ListIcon width={13} height={13} /></button>
    </div>
  );
}

export function ActiveFilters({ shown, total }: { shown: number; total: number }) {
  const { sp, getList, set, toggle, clearAll } = useQueryState();
  const chips: Array<{ id: string; label: string; remove: () => void }> = [];

  const dept = sp.get("dept");
  if (dept && dept !== "all") chips.push({ id: "dept", label: departments.find((d) => d.id === dept)?.label ?? dept, remove: () => set("dept", null) });
  const cat = sp.get("cat");
  if (cat) chips.push({ id: "cat", label: categoryName(cat), remove: () => set("cat", null) });
  getList("color").forEach((c) => chips.push({ id: `c-${c}`, label: `${colorById(c)?.name ?? c}`, remove: () => toggle("color", c) }));
  getList("size").forEach((s) => chips.push({ id: `s-${s}`, label: `Size ${s}`, remove: () => toggle("size", s) }));
  getList("material").forEach((m) => chips.push({ id: `m-${m}`, label: materialName(m), remove: () => toggle("material", m) }));
  if (sp.get("max")) chips.push({ id: "max", label: `Up to $${sp.get("max")}`, remove: () => set("max", null) });
  if (sp.get("oeko") === "1") chips.push({ id: "oeko", label: "OEKO-TEX®", remove: () => set("oeko", null) });
  if (sp.get("q")) chips.push({ id: "q", label: `“${sp.get("q")}”`, remove: () => set("q", null) });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="pr-1 text-[13px] font-medium uppercase tracking-wider text-ink-muted">
        Showing <b className="font-bold text-black">{shown} of {total}</b> items
      </p>
      {chips.map((c) => (
        <span key={c.id} className="flex items-center gap-1 bg-line px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-ink">
          {c.label}
          <button type="button" aria-label={`Remove ${c.label}`} onClick={c.remove}><XIcon width={9} height={9} strokeWidth={2.5} /></button>
        </span>
      ))}
      {chips.length > 0 && (
        <button type="button" onClick={clearAll} className="pl-1 text-[11px] font-semibold uppercase tracking-widest text-accent underline">Clear all</button>
      )}
    </div>
  );
}

export function SearchBar() {
  const { sp, set } = useQueryState();
  const [value, setValue] = useState(sp.get("q") ?? "");
  useEffect(() => setValue(sp.get("q") ?? ""), [sp]);
  const submit = (e: FormEvent) => { e.preventDefault(); set("q", value.trim() || null); };
  return (
    <form onSubmit={submit} role="search" className="relative">
      <SearchIcon width={15} height={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
      <input type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search modern essentials, linen, dresses..."
        aria-label="Search the shop" enterKeyHint="search"
        className="w-full rounded-pill bg-surface py-3.5 pl-10 pr-10 text-[13px] outline-none placeholder:text-ink-muted/60 focus:ring-1 focus:ring-accent" />
      {value && (
        <button type="button" aria-label="Clear search" onClick={() => { setValue(""); set("q", null); }} className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center">
          <XIcon width={13} height={13} />
        </button>
      )}
    </form>
  );
}

export function MobileFilterBar({ total }: { total: number }) {
  const { sp, getList, clearAll } = useQueryState();
  const [open, setOpen] = useState(false);
  const count = getList("color").length + getList("size").length + getList("material").length +
    (sp.get("oeko") ? 1 : 0) + (sp.get("max") ? 1 : 0) + (sp.get("cat") ? 1 : 0) + (sp.get("q") ? 1 : 0);
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-2.5">
        <div className="flex items-center gap-1">
          <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-pill bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider shadow-hairline">
            <SlidersIcon width={12} height={12} /> Filters
            {count > 0 && <span className="grid size-4 place-items-center rounded-pill bg-black text-[10px] font-bold text-white">{count}</span>}
          </button>
          <SortSelect mobile />
        </div>
        <p className="shrink-0 text-[11px] font-semibold text-ink-muted">{total} curated {total === 1 ? "item" : "items"}</p>
      </div>
      {open && (
        <div className="mb-1 flex flex-col gap-2.5 rounded-[8px] bg-surface/60 px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-accent">Refine by</p>
            <button type="button" onClick={clearAll} className="text-[11px] font-semibold tracking-wider text-ink-muted underline">Reset</button>
          </div>
          <FilterPanel compact />
        </div>
      )}
    </div>
  );
}
