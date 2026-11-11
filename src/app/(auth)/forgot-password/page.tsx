import Link from "next/link";
import { ArrowLeftIcon, LockIcon, Logo } from "@/ui";
import { AuthHero } from "@/features/auth/AuthHero";
import { AuthShell } from "@/features/auth/AuthShell";
import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";
import { TrustStrip } from "@/features/auth/TrustStrip";

export const metadata = { title: "Forgot password — Elegent" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell hero={<AuthHero />}>
      <header className="hidden items-center justify-between lg:flex">
        <Link href="/login" className="eyebrow flex items-center gap-2 text-ink-muted hover:text-ink"><ArrowLeftIcon width={11} height={11} /> Back to sign in</Link>
        <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.05em] text-accent"><LockIcon width={10} height={12} /> SSL 256-Bit</span>
      </header>

      <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center gap-7 py-2 lg:gap-8 lg:py-10">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <p className="eyebrow mt-2 text-accent lg:tracking-[0.3em]">Account recovery</p>
          <h1 className="mt-3 font-serif text-[32px] font-medium leading-10 tracking-[-0.025em]">Forgot your password?</h1>
          <p className="mt-1 max-w-80 text-[15px] leading-6 text-ink-muted">Enter the email you registered with and we’ll send you a link to choose a new one.</p>
        </div>
        <div className="rounded-card bg-surface p-7 shadow-hairline lg:bg-transparent lg:p-0 lg:shadow-none"><ForgotPasswordForm /></div>
        <p className="mx-auto flex items-center gap-2 rounded-pill bg-sand/60 px-4 py-1.5 text-[13px] text-ink-muted lg:bg-transparent lg:p-0">
          Remembered it? <Link href="/login" className="label-caps text-ink underline underline-offset-2">Sign in</Link>
        </p>
      </div>
      <TrustStrip />
    </AuthShell>
  );
}
