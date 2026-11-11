"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRightIcon, Button, CheckIcon, MailIcon, TextField } from "@/ui";
import { isEmail } from "@/lib/validation";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!isEmail(value)) return setError("Enter a valid email address.");
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/password/forgot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: value }) });
      if (!res.ok) throw new Error();
      setSentTo(value);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-start gap-4" role="status">
        <span className="grid size-12 place-items-center rounded-pill bg-[#fed9b9]"><CheckIcon width={20} height={20} /></span>
        <h2 className="font-serif text-2xl font-semibold leading-8">Check your inbox</h2>
        <p className="text-[15px] leading-6 text-ink-muted">
          If an account exists for <b className="text-ink">{sentTo}</b>, we’ve sent a link to choose a new password. It expires in 1 hour.
        </p>
        <p className="text-[13px] leading-5 text-ink-subtle">Nothing there? Check your spam folder, or wait a minute and try again.</p>
        <button type="button" onClick={() => { setSentTo(null); setEmail(""); }} className="label-caps text-ink underline underline-offset-2">Use a different email</button>
        <Link href="/login" className="label-caps text-accent underline underline-offset-2">Back to sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 lg:gap-6">
      <TextField label="Email" type="email" name="email" autoComplete="email" placeholder="curator@elegent.com"
        value={email} onChange={(e) => setEmail(e.target.value)} error={error} leading={<MailIcon />} />
      <Button type="submit" loading={loading} rightIcon={<ArrowRightIcon width={12} height={12} />}>Send reset link</Button>
    </form>
  );
}
