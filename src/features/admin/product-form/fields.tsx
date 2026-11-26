import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/** Small shared building blocks of the product form. */

export const labelClass = "flex flex-col gap-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted";
export const plain = "font-normal normal-case tracking-normal"; // resets the label's uppercase style for the control inside it
export const selectClass = "w-full rounded-field bg-field px-4 py-3 text-[15px] text-ink outline-none focus:ring-1 focus:ring-accent";

export function FieldError({ children }: { children?: string }) {
  return children ? <span role="alert" className="text-[13px] font-normal normal-case text-danger">{children}</span> : null;
}

export function Group({ legend, error, children }: { legend: string; error?: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
    </fieldset>
  );
}

export const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => (
  <button type="button" aria-pressed={on} onClick={onClick}
    className={cn("flex items-center gap-2 rounded-pill px-4 py-2 text-[13px] font-semibold shadow-hairline", on ? "bg-black text-white" : "bg-surface text-ink hover:bg-field")}>{children}</button>
);
