"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { PRICE_MAX, PRICE_MIN, colors, materials, sizes } from "./catalog";
import { useQueryState } from "./useQueryState";

const h = "text-[13px] font-bold uppercase leading-4 tracking-[0.1em] text-black";

/** `compact` = the mobile drawer (colours + sizes). Full = desktop sidebar. */
export interface CategoryCount { id: string; name: string; count: number }

export function FilterPanel({ compact = false, categoryCounts = [], totalAll = 0 }: { compact?: boolean; categoryCounts?: CategoryCount[]; totalAll?: number }) {
  const { sp, getList, set, toggle } = useQueryState();
  const cat = sp.get("cat") ?? "";
  const selColors = getList("color");
  const selSizes = getList("size");
  const selMaterials = getList("material");
  const oeko = sp.get("oeko") === "1";

  const urlMax = Number(sp.get("max")) || PRICE_MAX;
  const [max, setMax] = useState(urlMax);
  useEffect(() => setMax(urlMax), [urlMax]);
  const commitMax = () => set("max", max >= PRICE_MAX ? null : String(max));

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 overflow-x-auto py-1">
        <div className="flex items-center gap-2" role="group" aria-label="Colour">
          {colors.map((c) => {
            const on = selColors.includes(c.id);
            return (
              <button key={c.id} type="button" aria-label={c.name} aria-pressed={on} onClick={() => toggle("color", c.id)}
                className={cn("size-6 shrink-0 rounded-full shadow-hairline", on && "ring-2 ring-black ring-offset-2 ring-offset-white")}
                style={{ backgroundColor: c.hex }} />
            );
          })}
        </div>
        <span aria-hidden className="h-4 w-px shrink-0 bg-[#e1d9cd]" />
        <div className="flex items-center gap-1" role="group" aria-label="Size">
          {sizes.filter((s) => s !== "xl").map((s) => {
            const on = selSizes.includes(s);
            return (
              <button key={s} type="button" aria-pressed={on} onClick={() => toggle("size", s)}
                className={cn("rounded-[2px] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em]", on ? "bg-black text-white shadow-hairline" : "bg-sand text-ink")}>
                {s}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 bg-surface/60 p-4">
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between"><h2 className={h}>Categories</h2><span className="text-[11px] font-semibold tracking-[0.1em] text-ink-subtle">{String(categoryCounts.length + 1).padStart(2, "0")}</span></div>
        <ul className="flex flex-col gap-1">
          <li>
            <button type="button" onClick={() => set("cat", null)} className={cn("flex w-full items-center justify-between px-2 py-1 text-[13px] leading-5", !cat ? "bg-field font-semibold text-black" : "text-ink-muted hover:text-black")}>
              All Garments <span className="text-[11px] font-semibold tracking-[0.1em] text-ink-subtle">{totalAll}</span>
            </button>
          </li>
          {categoryCounts.map((c) => (
            <li key={c.id}>
              <button type="button" aria-pressed={cat === c.id} onClick={() => set("cat", cat === c.id ? null : c.id)}
                className={cn("flex w-full items-center justify-between px-2 py-1 text-[13px] leading-5", cat === c.id ? "bg-field font-semibold text-black" : "text-ink-muted hover:text-black")}>
                {c.name} <span className={cn("text-[11px] font-semibold tracking-[0.1em]", cat === c.id ? "text-accent" : "text-ink-subtle")}>{String(c.count).padStart(2, "0")}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3.5 bg-sand/30 p-2">
        <div className="flex items-center justify-between"><h2 className={h}>Price spectrum</h2><span className="text-[11px] font-semibold tracking-[0.1em] text-accent">${PRICE_MIN} — ${max}</span></div>
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={5} value={max} aria-label="Maximum price"
          onChange={(e) => setMax(Number(e.target.value))} onPointerUp={commitMax} onKeyUp={commitMax} onBlur={commitMax}
          className="h-1 w-full cursor-pointer accent-black" />
        <div className="flex justify-between text-[11px] font-semibold tracking-[0.1em] text-ink-subtle"><span>Min ${PRICE_MIN}</span><span>Max ${PRICE_MAX}</span></div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className={h}>Earthy palettes</h2>
        <div className="grid grid-cols-3 gap-1">
          {colors.map((c) => {
            const on = selColors.includes(c.id);
            return (
              <button key={c.id} type="button" aria-pressed={on} onClick={() => toggle("color", c.id)}
                className={cn("flex flex-col items-center gap-1 py-2 text-[10px]", on ? "bg-line font-bold text-black ring-1 ring-black" : "bg-field text-ink-muted hover:bg-line")}>
                <span className="size-6 rounded-full shadow-hairline" style={{ backgroundColor: c.hex }} />
                {c.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className={h}>Select size</h2>
        <div className="flex gap-1.5">
          {sizes.map((s) => {
            const on = selSizes.includes(s);
            return (
              <button key={s} type="button" aria-pressed={on} onClick={() => toggle("size", s)}
                className={cn("h-9 flex-1 text-[11px] uppercase tracking-[0.1em]", on ? "bg-black font-bold text-white" : "bg-field font-semibold text-ink-muted hover:bg-line")}>
                {s}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className={h}>Textile craft</h2>
        {materials.map((m) => {
          const on = selMaterials.includes(m.id);
          return (
            <label key={m.id} className="flex cursor-pointer items-center gap-2 py-0.5 text-[13px] leading-5">
              <input type="checkbox" checked={on} onChange={() => toggle("material", m.id)} className="size-[13px] accent-black" />
              <span className={on ? "font-medium text-black" : "text-ink-muted"}>{m.name}</span>
            </label>
          );
        })}
      </section>

      <label className="flex cursor-pointer items-start gap-1 bg-field px-2 pb-2 pt-3">
        <input type="checkbox" checked={oeko} onChange={(e) => set("oeko", e.target.checked ? "1" : null)} className="mt-1 size-[13px] accent-accent" />
        <span className="flex flex-col gap-0.5">
          <span className="text-[13px] font-bold uppercase leading-4 tracking-[0.08em] text-accent">OEKO-TEX® certified</span>
          <span className="text-[13px] leading-[16px] text-ink-muted">Filter items with zero synthetic chemicals and zero dye run-off.</span>
        </span>
      </label>
    </div>
  );
}
