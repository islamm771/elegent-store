"use client";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** "Download PDF": opens the browser's print dialog, where "Save as PDF" is one click away. */
export function PrintButton({ children, className }: { children: ReactNode; className?: string }) {
  return <button type="button" onClick={() => window.print()} className={cn("flex items-center justify-center gap-3 px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] shadow-hairline print:hidden", className)}>{children}</button>;
}
