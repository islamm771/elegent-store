import { cn } from "@/lib/cn";
import { CheckIcon } from "@/ui";
import type { ReactNode } from "react";

export function PaymentOption({ checked, disabled, onSelect, icon, title, text, badge }: {
  checked: boolean; disabled?: boolean; onSelect: () => void; icon: ReactNode; title: string; text: string; badge?: string;
}) {
  return (
    <button type="button" role="radio" aria-checked={checked} disabled={disabled} onClick={onSelect}
      className={cn("flex w-full items-start gap-4 rounded-[8px] bg-surface p-4 text-left shadow-hairline transition-shadow disabled:cursor-not-allowed disabled:opacity-60",
        checked ? "ring-1 ring-accent" : "hover:ring-1 hover:ring-line")}>
      <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-peach text-ink">{icon}</span>
      <span className="flex-1">
        <span className="flex items-center gap-2 text-[15px] font-semibold">{title}{badge && <span className="rounded-sm bg-field px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">{badge}</span>}</span>
        <span className="mt-0.5 block text-[13px] leading-5 text-ink-muted">{text}</span>
      </span>
      <span className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full border", checked ? "border-accent bg-accent text-white" : "border-ink-faint")}>
        {checked && <CheckIcon width={11} height={11} />}
      </span>
    </button>
  );
}
