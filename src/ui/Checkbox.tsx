import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CheckIcon } from "./icons";

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }>(
  function Checkbox({ children, className, ...rest }, ref) {
    return (
      <label className={cn("flex cursor-pointer items-start gap-3 text-[13px] text-ink-muted", className)}>
        <input ref={ref} type="checkbox" className="peer sr-only" {...rest} />
        <span aria-hidden
          className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-[2px] border border-ink text-white transition-colors
                     peer-checked:bg-black peer-checked:[&_svg]:opacity-100
                     peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
          <CheckIcon width={10} height={10} strokeWidth={3} className="opacity-0" />
        </span>
        <span>{children}</span>
      </label>
    );
  },
);
