import { cn } from "@/lib/cn";

/** Wordmark tile. Replace the inner span with <Image src="/brand/elegent-logo.png" …/> once the Figma logo is exported. */
export function Logo({ size = "md", className }: { size?: "sm" | "md"; className?: string }) {
  return (
    <span aria-label="Elegent"
      className={cn("grid place-items-center bg-white font-serif font-bold tracking-wide text-ink shadow-hairline",
        size === "md" ? "size-16 text-[11px]" : "size-8 text-[6px]", className)}>
      ELEGENT
    </span>
  );
}
