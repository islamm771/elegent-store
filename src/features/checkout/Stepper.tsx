import { cn } from "@/lib/cn";
import { CheckIcon } from "@/ui";
import { STEPS, type StepIndex } from "./types";

export function Stepper({ step, onGo }: { step: number; onGo: (i: StepIndex) => void }) {
  return (
    <ol className="mb-8 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em]" aria-label="Checkout steps">
      {STEPS.map((label, i) => {
        const done = i < step, current = i === step;
        return (
          <li key={label} className="flex flex-1 items-center gap-2" aria-current={current ? "step" : undefined}>
            <button type="button" disabled={!done} onClick={() => onGo(i as StepIndex)}
              className={cn("flex items-center gap-2 whitespace-nowrap", done ? "cursor-pointer text-ink" : current ? "text-ink" : "cursor-default text-ink-subtle")}>
              <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[11px]", done ? "bg-accent text-white" : current ? "bg-black text-white" : "bg-field text-ink-subtle")}>
                {done ? <CheckIcon width={12} height={12} /> : i + 1}
              </span>
              <span className={cn(!current && "hidden sm:inline")}>{label}</span>
            </button>
            {i < STEPS.length - 1 && <span className={cn("h-px flex-1", done ? "bg-accent" : "bg-line")} aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
