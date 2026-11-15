"use client";
import { cn } from "@/lib/cn";
import { money } from "@/lib/money";
import { BagIcon, ChevronDownIcon, LeafIcon, MinusIcon, PlusIcon, RulerIcon, StarIcon, TruckIcon, UndoIcon, XIcon } from "@/ui";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { colorById, sizes, type ShopProduct } from "./catalog";
import { colorTitles, type Detail } from "./details";
import { notifyAdded } from "./notify";
import { useStore } from "./store";

const sizeChart = [
  ["XS", "82", "64", "88"], ["S", "86", "68", "92"], ["M", "90", "72", "96"], ["L", "96", "78", "102"], ["XL", "102", "84", "108"],
];

function Accordion({ title, open = false, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group bg-surface/70 lg:bg-transparent lg:border-b lg:border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-base font-semibold leading-6 lg:px-0 lg:py-3 lg:text-[13px] lg:font-bold lg:uppercase lg:tracking-widest [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDownIcon width={16} height={16} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-4 pb-4 text-[13px] leading-5 text-ink-muted lg:px-0 lg:pb-5 lg:text-[15px] lg:leading-6">{children}</div>
    </details>
  );
}

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="flex flex-col gap-1.5">{items.map((b) => <li key={b} className="flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-pill bg-accent" />{b}</li>)}</ul>
);

export function ProductInfo({ product: p, detail }: { product: ShopProduct; detail: Detail }) {
  const router = useRouter();
  const { add } = useStore();
  const [colorId, setColorId] = useState<string>(p.colors[0]);
  const [size, setSize] = useState<string>(p.sizes.includes("m") ? "m" : p.sizes[0]);
  const [qty, setQty] = useState(1);
  const guide = useRef<HTMLDialogElement>(null);

  const total = (p.price * qty).toFixed(2);
  const soldOut = p.stock <= 0;

  function addToBag(goToCart = false) {
    if (soldOut) return;
    add({ id: p.id, name: p.name, price: p.price, color: colorTitles[colorId], size, image: p.images[0], tone: p.tone }, qty);
    if (goToCart) router.push("/cart"); else notifyAdded();
  }

  return (
    <div className="flex flex-col pb-28 lg:pb-0">
      <section className="flex flex-col gap-1 pt-7 lg:gap-2 lg:p-0">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-accent">Elegent <span className="lg:hidden">Studio</span><span className="hidden lg:inline">Atelier</span></p>
          <a href="#reviews" className="flex items-center gap-1 text-[13px] font-semibold">
            <StarIcon width={13} height={13} fill="currentColor" className="text-accent" /> {p.rating.toFixed(1)} <span className="font-normal text-ink-muted">({p.reviews} reviews)</span>
          </a>
        </div>
        <h1 className="font-serif text-[32px] leading-10 lg:text-5xl lg:font-medium lg:leading-14 lg:tracking-tight">{p.name}</h1>
        <div className="flex items-baseline justify-between pt-1 lg:justify-start lg:gap-4">
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-semibold lg:text-[28px]">{money(p.price, { cents: true })}</span>
            {p.compareAt && <s className="text-[15px] text-ink-muted">{money(p.compareAt, { cents: true })}</s>}
          </p>
          <p className="text-[13px] text-ink-muted">Taxes included</p>
          <span className="eyebrow hidden rounded-pill bg-field px-3 py-1 text-accent lg:inline">Ready to ship</span>
        </div>
        <p className="hidden pt-1 text-[15px] leading-6 text-ink-muted lg:block">Complimentary carbon-neutral express delivery. Order within 4 hrs for dispatch today.</p>
      </section>

      <div className="mt-6 flex flex-col gap-6 lg:mt-7 lg:gap-7 lg:border-t lg:border-line lg:px-0 lg:pt-7">
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Colour</legend>
          <div className="flex items-center justify-between">
            <p className="eyebrow text-ink">Color: <span className="font-medium normal-case tracking-normal text-ink-muted lg:font-semibold lg:uppercase lg:tracking-widest lg:text-accent">{colorTitles[colorId]}</span></p>
            <p className="eyebrow text-ink-subtle"><span className="lg:hidden">{p.colors.length} shades</span><span className="hidden lg:inline">Natural pigment dyed</span></p>
          </div>
          <div className="flex gap-3">
            {p.colors.map((id) => (
              <button key={id} type="button" aria-label={colorTitles[id]} aria-pressed={id === colorId} onClick={() => setColorId(id)}
                className={cn("size-9 rounded-full shadow-hairline", id === colorId && "ring-2 ring-black ring-offset-2 ring-offset-canvas")}
                style={{ backgroundColor: colorById(id).hex }} />
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Size</legend>
          <div className="flex items-center justify-between">
            <p className="eyebrow text-ink">Select size<span className="hidden lg:inline">: <b className="text-accent">{size.toUpperCase()}</b></span></p>
            <button type="button" onClick={() => guide.current?.showModal()} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider underline underline-offset-2">
              <RulerIcon width={13} height={13} /> Size guide
            </button>
          </div>
          <div className="flex gap-2">
            {sizes.map((s) => {
              const ok = (p.sizes as string[]).includes(s);
              return (
                <button key={s} type="button" disabled={!ok} aria-pressed={size === s} onClick={() => setSize(s)}
                  className={cn("h-12 flex-1 rounded-[2px] text-[13px] font-semibold uppercase tracking-wider transition-colors",
                    size === s ? "bg-black text-white shadow-cta" : "bg-surface text-ink hover:bg-field", !ok && "cursor-not-allowed line-through opacity-40 hover:bg-surface")}>
                  {s}
                </button>
              );
            })}
          </div>
          <p className="text-[13px] leading-5 text-ink-muted">{detail.fitNote}</p>
        </fieldset>

        <div className="flex items-start gap-3 bg-sand p-4 lg:bg-surface">
          <span className="grid size-9 shrink-0 place-items-center rounded-pill bg-line lg:rounded-none lg:bg-[#fed9b9]"><LeafIcon width={17} height={17} /></span>
          <div><h2 className="text-base font-semibold leading-6">{detail.valueProp.title}</h2><p className="text-[13px] leading-5 text-ink-muted">{detail.valueProp.text}</p></div>
        </div>

        {/* desktop purchase row */}
        <div className="hidden flex-col gap-3 lg:flex">
          <div className="flex gap-3">
            <div className="flex items-center bg-field" role="group" aria-label="Quantity">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-14 place-items-center hover:bg-line"><MinusIcon width={13} height={13} /></button>
              <span className="w-8 text-center text-base font-semibold" aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid size-14 place-items-center hover:bg-line"><PlusIcon width={13} height={13} /></button>
            </div>
            <button type="button" disabled={soldOut} onClick={() => addToBag()} className="flex flex-1 items-center justify-center gap-3 bg-black px-6 text-[13px] font-semibold uppercase tracking-[0.15em] text-white shadow-cta hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink-subtle">
              <BagIcon width={16} height={16} /> {soldOut ? "Sold out" : `Add to bag · $${total}`}
            </button>
          </div>
          <button type="button" disabled={soldOut} onClick={() => addToBag(true)} className="bg-[#fed9b9] py-4 disabled:opacity-50 text-[13px] font-semibold uppercase tracking-[0.15em] hover:brightness-95">Instant express checkout</button>
          <ul className="mt-2 grid grid-cols-3 gap-2 text-center">
            {[[TruckIcon, "Free shipping"], [UndoIcon, "30-day returns"], [RulerIcon, "Atelier fit"]].map(([Icon, label]) => {
              const I = Icon as typeof TruckIcon;
              return <li key={label as string} className="eyebrow flex flex-col items-center gap-1.5 bg-surface/70 px-2 py-3 text-ink-muted"><I width={16} height={16} />{label as string}</li>;
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-2 lg:gap-0 lg:border-t lg:border-line">
          <Accordion title="Description & Fit" open><p>{detail.description}</p><div className="mt-3"><Bullets items={detail.bullets} /></div></Accordion>
          <Accordion title="Fabric & Care"><Bullets items={detail.fabric} /></Accordion>
          <Accordion title="Shipping & Free Returns"><Bullets items={detail.shipping} /></Accordion>
        </div>
      </div>

      {/* mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 bg-canvas/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md lg:hidden">
        <div className="pr-1"><p className="eyebrow text-ink-subtle">Total</p><p className="font-serif text-xl font-semibold leading-6">${total}</p></div>
        <button type="button" disabled={soldOut} onClick={() => addToBag()} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[2px] bg-black text-[13px] font-semibold uppercase tracking-widest text-white shadow-cta disabled:bg-ink-subtle"><BagIcon width={15} height={15} /> {soldOut ? "Sold out" : "Add to bag"}</button>
        <button type="button" disabled={soldOut} onClick={() => addToBag(true)} className="h-12 rounded-[2px] bg-[#fed9b9] px-4 disabled:opacity-50 text-[13px] font-semibold uppercase tracking-widest">Buy now</button>
      </div>

      <dialog ref={guide} aria-label="Size guide" onClick={(e) => e.target === guide.current && guide.current?.close()}
        className="m-auto w-[min(92vw,28rem)] rounded-[8px] bg-canvas p-0 text-ink shadow-2xl backdrop:bg-black/40">
        <div className="flex items-center justify-between border-b border-line p-4">
          <h2 className="font-serif text-xl">Size guide <span className="text-[13px] font-sans font-normal text-ink-muted">(cm)</span></h2>
          <button type="button" aria-label="Close" onClick={() => guide.current?.close()}><XIcon width={16} height={16} /></button>
        </div>
        <table className="w-full text-center text-[13px]">
          <thead><tr className="eyebrow text-ink-subtle">{["Size", "Bust", "Waist", "Hip"].map((h) => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>{sizeChart.map((r) => <tr key={r[0]} className={cn("border-t border-line", r[0].toLowerCase() === size && "bg-field font-semibold")}>{r.map((c, n) => <td key={n} className="p-3">{c}</td>)}</tr>)}</tbody>
        </table>
        <p className="border-t border-line p-4 text-[13px] text-ink-muted">Between sizes? Choose the larger size for a relaxed drape.</p>
      </dialog>
    </div>
  );
}
