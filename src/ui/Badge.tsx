import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return <span className="eyebrow inline-flex w-fit items-center rounded-pill bg-field px-2.5 py-1 text-accent">{children}</span>;
}
