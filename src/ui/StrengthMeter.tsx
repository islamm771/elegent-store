import { passwordStrength } from "@/lib/password";
import { cn } from "@/lib/cn";

/** 4 segments. Mobile shows "Security score / label"; desktop shows the requirement hint instead. */
export function StrengthMeter({ password }: { password: string }) {
  const { score, label } = passwordStrength(password);
  return (
    <div className="flex flex-col gap-1.5 px-0.5 pt-1.5" aria-live="polite">
      <div className="eyebrow flex justify-between lg:hidden">
        <span className="text-ink-subtle">Security score</span>
        <span className="text-accent">{label}</span>
      </div>
      <div className="flex h-1 gap-1.5" role="img" aria-label={label ? `Password strength: ${label}` : "Password strength"}>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-full flex-1 rounded-pill transition-colors duration-300", i <= score ? "bg-accent" : "bg-line lg:bg-accent/30")} />
        ))}
      </div>
      <p className="hidden text-[13px] leading-[16px] text-ink-muted/70 lg:block">
        Must include 8+ characters, one uppercase, and a special symbol.
      </p>
    </div>
  );
}
