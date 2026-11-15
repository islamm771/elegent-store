import { AuthShell } from "@/features/auth/AuthShell";
import { RegisterForm } from "@/features/auth/RegisterForm";
import { RegisterHero } from "@/features/auth/RegisterHero";
import LogoLink from "@/features/shell/LogoLink";
import { getSocialProviders } from "@/lib/auth";
import { Badge } from "@/ui";
import Link from "next/link";

export const metadata = { title: "Create account — Elegent" };

export default function RegisterPage() {
  return (
    <AuthShell hero={<RegisterHero />} layout="wide">
      <header className="flex items-center justify-between lg:pb-8">
        <LogoLink />
        <p className="flex items-center gap-4 text-[13px]">
          <span className="hidden text-ink-muted lg:inline">Already registered?</span>
          <Link href="/login" className="font-semibold uppercase tracking-[0.05em] text-accent lg:text-black lg:underline lg:underline-offset-2">Sign in</Link>
        </p>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 py-8 lg:max-w-xl lg:justify-center lg:gap-6 lg:py-4">
        <section className="relative flex flex-col gap-2 overflow-hidden rounded-card bg-surface p-6 shadow-hairline lg:gap-3 lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none">
          <Badge>Private membership</Badge>
          <h1 className="mt-1 font-serif text-[32px] font-normal leading-10 lg:text-5xl lg:leading-14 lg:tracking-tight">Create Your Account</h1>
          <p className="text-[13px] leading-5.25 text-ink-muted lg:max-w-lg lg:text-[15px] lg:leading-6">
            Join Elegent to experience personalized fashion recommendations, archival access, and bespoke member privileges.
          </p>
          <span aria-hidden className="absolute -bottom-6 -right-6 size-24 rounded-pill bg-peach/40 lg:hidden" />
        </section>

        <RegisterForm providers={getSocialProviders()} />

        <p className="text-center text-[15px] text-ink-muted lg:hidden">
          Already have an account? <Link href="/login" className="font-semibold text-black underline underline-offset-2">Sign In</Link>
        </p>
      </div>

      <footer className="hidden items-center justify-between pt-8 text-[13px] text-ink-muted/60 lg:flex">
        <span>256-bit Encrypted SSL Security</span>
        <span className="flex gap-6">
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/terms" className="hover:text-ink">Terms of Atelier</Link>
          <span>Concierge Assistance</span>
        </span>
      </footer>
    </AuthShell>
  );
}
