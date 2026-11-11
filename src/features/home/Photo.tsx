import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Photo slot. The tone colour shows until the image file exists, so layout never breaks. */
export function Photo({ src, tone = "#d9c4a4", alt = "", className, style, children }: {
  src?: string; tone?: string; alt?: string; className?: string; style?: CSSProperties; children?: ReactNode;
}) {
  return (
    <div role={alt ? "img" : undefined} aria-label={alt || undefined}
      className={cn("relative overflow-hidden bg-cover bg-top", className)}
      style={{ backgroundColor: tone, backgroundImage: src ? `url(${src})` : undefined, ...style }}>
      {children}
    </div>
  );
}

export function DotGrid({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("font-mono text-[11px] leading-[14px] tracking-[6px] text-ink-muted opacity-40", className)}>
      {[0, 1, 2, 3].map((i) => <p key={i}>· · · · ·</p>)}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, action, className }: {
  eyebrow: ReactNode; title: string; action?: ReactNode; className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="flex flex-col gap-1">
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h2 className="font-serif text-2xl font-semibold leading-8 lg:text-[36px] lg:leading-[44px] lg:tracking-[-0.025em]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
