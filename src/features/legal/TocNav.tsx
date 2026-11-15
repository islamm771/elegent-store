"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const ROMAN = ["I.", "II.", "III.", "IV.", "V.", "VI.", "VII.", "VIII.", "IX.", "X."];

/** "Index" list. It follows your scroll position and marks the section you are reading. */
export function TocNav({ sections, marker = "decimal" }: { sections: { id: string; title: string }[]; marker?: "decimal" | "roman" }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const first = sections.find((s) => seen.get(s.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [sections]);

  return (
    <ol className="flex flex-col gap-1">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a href={`#${s.id}`} aria-current={active === s.id ? "location" : undefined}
            className={cn("flex items-baseline gap-3 px-3 py-2 transition-colors", active === s.id ? "bg-sand font-semibold text-black" : "text-ink-muted hover:text-black")}>
            <span className={cn("shrink-0 font-semibold text-accent", marker === "roman" ? "w-7 text-[12px]" : "w-6 text-[12px]")}>{marker === "roman" ? ROMAN[i] : String(i + 1).padStart(2, "0")}</span>
            <span className={marker === "roman" ? "text-[12px] leading-[16.5px]" : "text-[14px] leading-[19px]"}>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
