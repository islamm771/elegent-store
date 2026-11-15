"use client";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { isEmail } from "@/lib/validation";

const natures = ["Bespoke Commission Addendum", "Institutional or corporate terms", "Returns or exchange question", "Another legal question"];
const field = "w-full rounded-[2px] bg-line px-4 py-[11px] text-[14px] text-ink outline-none placeholder:text-ink-subtle focus:ring-1 focus:ring-accent";
const label = "text-[11px] uppercase tracking-[0.05em] text-ink-muted";

export function InquiryForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [v, setV] = useState({ name: "", patronId: "", email: "", nature: natures[0], statement: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (v.name.trim().length < 2) found.name = "Enter your full name.";
    if (!isEmail(v.email)) found.email = "Enter a valid email so we can reply.";
    if (v.statement.trim().length < 20) found.statement = "Tell us a little more (at least 20 characters).";
    setErrors(found);
    if (Object.keys(found).length) return;
    setState("sending");
    try {
      const res = await fetch("/api/legal/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
      setState(res.ok ? "sent" : "failed");
    } catch { setState("failed"); }
  }

  if (state === "sent") {
    return <p role="status" className="rounded-[4px] bg-field px-4 py-4 text-[14px] leading-6 text-ink">Thank you — your message has reached our legal secretariat. We’ll reply to <b>{v.email}</b>.</p>;
  }

  const err = (k: string) => errors[k] && <p role="alert" className="pt-1 text-xs text-danger">{errors[k]}</p>;
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {state === "failed" && <p role="alert" className="rounded-[2px] bg-danger/10 px-3 py-2 text-[13px] text-danger">We couldn’t send your message. Please email <a className="underline" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a> instead.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="flex flex-col gap-1"><span className={label}>Full legal name</span><input value={v.name} onChange={set("name")} autoComplete="name" placeholder="Countess / Lady / Mr. / Ms." className={cn(field, errors.name && "ring-1 ring-danger")} /></label>{err("name")}</div>
        <div><label className="flex flex-col gap-1"><span className={label}>Client / patron reference ID</span><input value={v.patronId} onChange={set("patronId")} placeholder="EL-9482 (Optional)" className={field} /></label></div>
      </div>
      <div><label className="flex flex-col gap-1"><span className={label}>Your email</span><input type="email" value={v.email} onChange={set("email")} autoComplete="email" placeholder="So we know where to reply" className={cn(field, errors.email && "ring-1 ring-danger")} /></label>{err("email")}</div>
      <label className="flex flex-col gap-1"><span className={label}>Inquiry nature</span>
        <select value={v.nature} onChange={set("nature")} className={field}>{natures.map((n) => <option key={n}>{n}</option>)}</select>
      </label>
      <div><label className="flex flex-col gap-1"><span className={label}>Statement</span><textarea value={v.statement} onChange={set("statement")} rows={4} maxLength={2000} placeholder="Specify your question or contractual inquiry for our legal concierge..." className={cn(field, "resize-y", errors.statement && "ring-1 ring-danger")} /></label>{err("statement")}</div>
      <input type="text" name="website" value={v.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-ink-subtle">Sent over an encrypted connection (HTTPS).</p>
        <button type="submit" disabled={state === "sending"} className="bg-black px-8 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-white hover:bg-ink disabled:opacity-60">{state === "sending" ? "Sending…" : "Transmit to legal secretariat"}</button>
      </div>
    </form>
  );
}
