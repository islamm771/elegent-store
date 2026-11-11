import { AuthHero } from "@/features/auth/AuthHero";
import { AuthShell } from "@/features/auth/AuthShell";
import { ResetPasswordForm } from "@/features/auth/ResetPasswordForm";
import { TrustStrip } from "@/features/auth/TrustStrip";
import { prisma } from "@/lib/db";
import { hashToken, looksLikeToken } from "@/lib/reset-token";
import { ArrowLeftIcon, LockIcon, Logo } from "@/ui";
import Link from "next/link";

export const metadata = { title: "Reset password — Elegent" };
export const dynamic = "force-dynamic";

/** Checks the link without using it up, so people see "expired" straight away instead of after typing a password. */
async function linkState(token: string | undefined): Promise<"valid" | "invalid" | "error"> {
  if (!looksLikeToken(token)) return "invalid";
  try {
    const rec = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) }, select: { usedAt: true, expiresAt: true } });
    return rec && !rec.usedAt && rec.expiresAt > new Date() ? "valid" : "invalid";
  } catch (e) {
    console.error("reset link check failed", e);
    return "error";
  }
}

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const state = await linkState(token);

  return (
    <AuthShell hero={<AuthHero />}>
      <header className="hidden items-center justify-between lg:flex">
        <Link href="/login" className="eyebrow flex items-center gap-2 text-ink-muted hover:text-ink"><ArrowLeftIcon width={11} height={11} /> Back to sign in</Link>
        <span className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-accent"><LockIcon width={10} height={12} /> SSL 256-Bit</span>
      </header>

      <div className="mx-auto flex w-full max-w-115 flex-1 flex-col justify-center gap-7 py-2 lg:gap-8 lg:py-10">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <p className="eyebrow mt-2 text-accent lg:tracking-[0.3em]">Account recovery</p>
          <h1 className="mt-3 font-serif text-[32px] font-medium leading-10 tracking-tight">Choose a new password</h1>
          {state === "valid" && <p className="mt-1 max-w-80 text-[15px] leading-6 text-ink-muted">Pick something you haven’t used before — at least 8 characters.</p>}
        </div>

        <div className="rounded-card bg-surface p-7 shadow-hairline lg:bg-transparent lg:p-0 lg:shadow-none">
          {state === "valid" ? (
            <ResetPasswordForm token={token!} />
          ) : (
            <div role="alert" className="flex flex-col items-start gap-3">
              <h2 className="font-serif text-2xl font-semibold leading-8">{state === "error" ? "We couldn’t check this link" : "This link is no longer valid"}</h2>
              <p className="text-[15px] leading-6 text-ink-muted">
                {state === "error" ? "Something went wrong on our side. Please try again in a moment." : "It may have expired or already been used. Request a new one and we’ll email it right away."}
              </p>
              <Link href="/forgot-password" className="rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-widest text-white shadow-cta hover:bg-ink">Request a new link</Link>
            </div>
          )}
        </div>
      </div>
      <TrustStrip />
    </AuthShell>
  );
}
