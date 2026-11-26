import { ChevronRightIcon } from "@/ui";
import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export const GOLD = "text-[#C5A059]";
export const itemClass = "flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left text-[13px] font-medium text-ink outline-none transition-colors hover:bg-sand/70 focus-visible:bg-sand/70 focus-visible:ring-2 focus-visible:ring-accent/40";

export function Item({ href, icon: I, label, right, onNavigate }: { href: string; icon: Icon; label: string; right?: ReactNode; onNavigate: () => void }) {
  return (
    <li role="none">
      <Link href={href} role="menuitem" onClick={onNavigate} className={itemClass}>
        <I width={16} height={16} className="shrink-0 text-ink-muted" />
        <span className="flex-1">{label}</span>
        {right ?? <ChevronRightIcon width={14} height={14} className="text-ink-subtle" />}
      </Link>
    </li>
  );
}

export const Count = ({ n }: { n: number }) => (
  <span className="rounded-sm bg-sand px-2 py-0.5 text-[11px] font-semibold text-accent">{n}</span>
);
