"use client";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { isEmail } from "@/lib/validation";
import { cn } from "@/lib/cn";

export function NewsletterForm({ placeholder = "Enter your email address", button = "Join", className }: {
  placeholder?: string; button?: string; className?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) return setError("Enter a valid email address.");
    setError(""); setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error();
      setState("done"); setEmail("");
      toast.success("Welcome to the Elegent Society.");
    } catch {
      setState("idle"); setError("Could not subscribe. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-2">
        <input type="email" name="email" aria-label="Email address" autoComplete="email" placeholder={placeholder}
          value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error || undefined}
          className="min-w-0 flex-1 rounded-[4px] bg-white px-4 py-3 text-[13px] shadow-hairline outline-none placeholder:text-ink-muted/60 focus:ring-1 focus:ring-accent" />
        <button type="submit" disabled={state === "loading"}
          className="rounded-[4px] bg-black px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-white hover:bg-ink disabled:opacity-60">
          {state === "loading" ? "…" : state === "done" ? "Joined" : button}
        </button>
      </div>
      {error && <p role="alert" className="text-xs text-danger">{error}</p>}
    </form>
  );
}
