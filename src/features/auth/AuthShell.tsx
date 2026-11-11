import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const columns = { even: "lg:grid-cols-2", wide: "lg:grid-cols-[5fr_7fr]" } as const;

/** Mobile: single column. lg+: sticky image panel on the left, content on the right. */
export function AuthShell({ hero, layout = "even", children }: { hero: ReactNode; layout?: keyof typeof columns; children: ReactNode }) {
  return (
    <div className={cn("min-h-dvh bg-canvas lg:grid", columns[layout])}>
      <aside className="sticky top-0 hidden h-dvh overflow-hidden bg-accent lg:block">{hero}</aside>
      <main className={cn("flex min-h-dvh flex-col px-5 py-7 lg:py-14", layout === "wide" ? "lg:px-20" : "lg:px-14")}>{children}</main>
    </div>
  );
}
