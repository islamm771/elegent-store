"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRightIcon, Button, LockIcon, StrengthMeter, TextField } from "@/ui";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; form?: string }>({});
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found: typeof errors = {};
    if (password.length < 8) found.password = "Use at least 8 characters.";
    if (confirm !== password) found.confirm = "Passwords don’t match.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/password/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      if (res.ok) { router.push("/login?reset=1"); return; }
      const json = await res.json().catch(() => ({}));
      if (json.error === "invalid_token") return setExpired(true);
      setErrors({ form: json.error === "weak_password" ? "Use at least 8 characters." : "Could not update your password. Please try again." });
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  if (expired) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <h2 className="font-serif text-2xl font-semibold leading-8">This link is no longer valid</h2>
        <p className="text-[15px] leading-6 text-ink-muted">It may have expired or already been used. Request a new one and we’ll email it right away.</p>
        <Link href="/forgot-password" className="rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-cta hover:bg-ink">Request a new link</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 lg:gap-6">
      {errors.form && <p role="alert" className="rounded-field bg-danger/10 px-3 py-2 text-[13px] text-danger">{errors.form}</p>}
      <div>
        <TextField label="New password" type="password" name="password" autoComplete="new-password" placeholder="••••••••••••"
          value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} leading={<LockIcon />}
          aside={<span className="text-[11px] font-semibold lowercase text-accent">min. 8 characters</span>} />
        <StrengthMeter password={password} />
      </div>
      <TextField label="Confirm new password" type="password" name="confirm" autoComplete="new-password" placeholder="••••••••••••"
        value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} leading={<LockIcon />} />
      <Button type="submit" loading={loading} rightIcon={<ArrowRightIcon width={12} height={12} />}>Update password</Button>
    </form>
  );
}
