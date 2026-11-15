import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { TocNav } from "./TocNav";

export const mailto = (to: string, subject?: string, body?: string) => {
  const q = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean).join("&");
  return `mailto:${to}${q ? `?${q}` : ""}`;
};

export const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.1em]";

export function Crumbs({ items }: { items: string[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.1em]">
      {items.map((it, i) => (
        <span key={it} className="flex items-center gap-2">
          {i === 0 ? <Link href="/" className="text-ink-muted hover:text-ink">{it}</Link> : i < items.length - 1 ? <span className="text-ink-muted">{it}</span> : <span className="font-semibold text-black">{it}</span>}
          {i < items.length - 1 && <span className="text-ink-faint">/</span>}
        </span>
      ))}
    </nav>
  );
}

/** Sticky "index" card on desktop, a collapsible list on mobile. */
export function IndexCard({ title, meta, sections, marker }: { title: string; meta?: string; sections: { id: string; title: string }[]; marker: "decimal" | "roman" }) {
  const head = (
    <>
      <span className={cn(eyebrow, marker === "roman" ? "text-accent tracking-[0.2em]" : "text-black")}>{title}</span>
      {meta && <span className="text-[11px] text-accent">{meta}</span>}
    </>
  );
  return (
    <div className="rounded-[2px] bg-surface shadow-hairline print:hidden">
      <details className="group p-5 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">{head}<span className="text-lg leading-none text-accent transition-transform group-open:rotate-45">+</span></summary>
        <div className="pt-3"><TocNav sections={sections} marker={marker} /></div>
      </details>
      <div className="hidden p-6 lg:block lg:p-8">
        <div className="flex items-center justify-between pb-4">{head}</div>
        <TocNav sections={sections} marker={marker} />
      </div>
    </div>
  );
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
const WORDS = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN"];

export function RomanArticle({ id, no, title, children }: { id: string; no: number; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 lg:scroll-mt-36 flex flex-col gap-5 lg:gap-6">
      <div className="flex items-start gap-3 lg:gap-4">
        <span className="text-[26px] font-light leading-9 text-accent lg:text-[30px]">{ROMAN[no - 1]}.</span>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-accent">ARTICLE {WORDS[no - 1]}</p>
          <h2 className="text-[24px] font-medium leading-[30px] tracking-[-0.025em] text-black lg:text-[30px] lg:leading-9">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

export function SectionArticle({ id, no, title, children }: { id: string; no: number; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 lg:scroll-mt-36 flex flex-col gap-5 lg:gap-6">
      <div className="flex items-center gap-4">
        <span className="text-[26px] italic leading-9 text-accent lg:text-[30px]">§ {String(no).padStart(2, "0")}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <h2 className="text-[24px] font-medium leading-[30px] tracking-[-0.025em] text-black lg:text-[30px] lg:leading-9">{title}</h2>
      {children}
    </section>
  );
}

export const Body = ({ children }: { children: ReactNode }) => <p className="text-[15px] leading-6 text-ink-muted lg:text-[16px] lg:leading-[26px]">{children}</p>;

export function Clause({ n, title, children }: { n: string; title: string; children?: ReactNode }) {
  return <p className="text-[14px] leading-[22.75px] text-ink-muted">{n} <b className="font-semibold text-ink">{title}</b>{children ? <> {children}</> : null}</p>;
}

export const Pill = ({ children, tone = "field" }: { children: ReactNode; tone?: "field" | "peach" }) => (
  <span className={cn("shrink-0 rounded-[12px] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]", tone === "peach" ? "bg-[#fed9b9] text-[#795d44]" : "bg-field text-black")}>{children}</span>
);
