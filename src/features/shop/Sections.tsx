import { Photo } from "@/features/home/Photo";
import { cn } from "@/lib/cn";
import { LeafIcon } from "@/ui";
import Link from "next/link";
import { departments } from "./catalog";
import { shopHref, type ShopQuery } from "./query";

export function DeptPills({ query }: { query: ShopQuery }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none" role="navigation" aria-label="Departments">
      {departments.map((d) => {
        const on = query.dept === d.id;
        return (
          <Link key={d.id} href={shopHref(query, { dept: d.id, page: 1 })} aria-current={on ? "page" : undefined}
            className={cn("flex shrink-0 items-center gap-1 rounded-pill px-4 py-2 text-[11px] font-semibold uppercase tracking-wider",
              on ? "bg-black text-white shadow-hairline" : d.id === "sale" ? "bg-[#fed9b9] text-[#795d44]" : "bg-surface text-ink")}>
            {d.id === "sale" && <span className="size-1.5 rounded-pill bg-danger" />}
            {d.label}
          </Link>
        );
      })}
    </div>
  );
}

export function MobileLookbook() {
  return (
    <div className="px-4 pb-1 pt-3 lg:hidden">
      <div className="flex items-center justify-between rounded-[8px] bg-field p-4 shadow-hairline">
        <div className="pr-2">
          <p className="label-caps text-accent">Autumn lookbook</p>
          <h2 className="pt-0.5 font-serif text-2xl font-semibold leading-7.5">The Pure Linen<br />Capsule</h2>
          <p className="pt-1 text-[13px] leading-5 text-ink-muted">Earthy silhouettes tailored for unhurried days.</p>
        </div>
        <span className="grid size-14 shrink-0 place-items-center rounded-pill bg-[#fed9b9] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"><LeafIcon width={22} height={22} /></span>
      </div>
    </div>
  );
}

export function CapsuleHero({ query, total }: { query: ShopQuery; total: number }) {
  const crumb = departments.find((d) => d.id === query.dept);
  return (
    <section className="hidden bg-surface/70 py-12 lg:block">
      <div className="mx-auto flex max-w-360 flex-col gap-2 px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">
          <Link href="/" className="text-ink-subtle hover:text-ink">Home</Link><span className="text-ink-faint">/</span>
          <Link href="/shop?dept=women" className="text-ink-subtle hover:text-ink">{query.dept === "all" || !crumb ? "Women" : crumb.label}</Link><span className="text-ink-faint">/</span>
          <span className="text-black">Linen capsule collection</span>
        </nav>
        <div className="flex items-end justify-between pt-1">
          <div className="flex max-w-2xl flex-col items-start gap-1 pt-1">
            <p className="eyebrow flex items-center gap-1 bg-field px-2 py-1 text-accent"><span className="size-1.5 rounded-pill bg-accent" /> Autumn / Winter series ’25</p>
            <h1 className="font-serif text-5xl font-medium leading-14 tracking-tight">The Autumn Linen Capsule</h1>
            <p className="text-lg leading-7.25 text-ink-muted">Earthy silhouettes tailored for unhurried days, crafted with 100% organic European flax. Rooted in warm tactile hues and architectural drape.</p>
          </div>
          <div className="flex items-center gap-4 bg-field px-4 py-2">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">Capsule in stock</p>
              <p className="text-base font-bold leading-6">{total} Pieces Limited Run</p>
            </div>
            <span className="h-8 w-px bg-ink-faint/60" />
            <p className="eyebrow flex items-center gap-1.5 text-accent"><LeafIcon width={14} height={14} /> 100% traceable flax</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footnote() {
  return (
    <section className="p-4 lg:hidden">
      <div className="flex flex-col items-center rounded-2xl bg-sand/80 p-5 text-center shadow-hairline">
        <LeafIcon width={17} height={17} />
        <h3 className="pt-1 font-serif text-2xl font-semibold leading-8">Consciously Woven</h3>
        <p className="max-w-80 pt-1 text-[13px] leading-5 text-ink-muted">Every piece is dyed with non-toxic earthy pigments and cut from 100% natural organic flax linen.</p>
        <Link href="/shop" className="pt-3 text-[11px] font-bold uppercase tracking-widest underline">Learn our process</Link>
      </div>
    </section>
  );
}

export function SustainabilityBanner() {
  const facts = [
    ["Normandy Harvest", "Rain-fed French flax stalks spun in historical mills."],
    ["Low-Impact Dyes", "Botanical and non-toxic earth-derived pigments."],
    ["Circular Returns", "Complimentary atelier mending and lifetime buyback."],
  ];
  return (
    <section className="hidden lg:block">
      <div className="bg-sand/60 px-6 py-12">
        <div className="mx-auto grid max-w-360 grid-cols-12 items-center gap-7">
          <div className="relative col-span-5">
            <Photo src="/images/shop/sustainability.jpg" tone="#b9a584" alt="Certified European flax linen" className="h-93.25 shadow-cta" />
            <div className="absolute -bottom-4 -right-4 flex flex-col gap-1 bg-black p-4 shadow-lg">
              <p className="font-serif text-2xl font-bold leading-6 text-white">100%</p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-field">Zero synthetics</p>
            </div>
          </div>
          <div className="col-span-7 flex flex-col pl-7">
            <p className="eyebrow flex items-center gap-1 pb-1 text-accent"><LeafIcon width={16} height={16} /> Responsible luxury charter</p>
            <h2 className="font-serif text-5xl font-medium leading-14 tracking-tight">Consciously Woven for<br />Generational Wear</h2>
            <p className="max-w-xl pt-2 text-lg leading-7.25 text-ink-muted">Every piece in this Autumn Capsule is spun from Certified European Flax grown without artificial irrigation or genetically modified seeds. Naturally thermoregulating, antimicrobial, and softer with every laundering cycle.</p>
            <div className="mt-7 flex gap-4 bg-field/70 p-4">
              {facts.map(([t, d]) => (
                <div key={t} className="flex-1"><h3 className="text-base font-bold leading-6">{t}</h3><p className="text-[13px] leading-5 text-ink-muted">{d}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
