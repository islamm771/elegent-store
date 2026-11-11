import type { ReactNode } from "react";

export function Divider({ children }: { children?: ReactNode }) {
  if (!children) return <hr className="h-px border-0 bg-line" />;
  return (
    <div role="separator" className="flex items-center gap-4">
      <span className="h-px flex-1 bg-line" />
      <span className="eyebrow text-ink-subtle lg:text-ink-muted">{children}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
