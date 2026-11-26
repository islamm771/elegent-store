"use client";
import { ApiError, errorText } from "@/lib/api/http";
import { ordersApi } from "@/services/orders";
import { NEXT } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrderActions({ number, status, cod }: { number: string; status: string; cod: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const next = NEXT[status];
  if (!next) return null;
  const target = next.to;

  async function go() {
    if (target === "DELIVERED" && cod && !confirm("Cash was collected from the customer?")) return;
    setBusy(true); setErr(null);
    try {
      await ordersApi.setStatus(number, target)
      router.refresh();
    } catch (e) {
      setErr(errorText(e, { 403: "Not allowed.", 409: "Already changed — refreshing." }, "Failed, try again."));
      if (e instanceof ApiError && e.status === 409) {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={go} disabled={busy}
        className="rounded-field bg-black px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-white hover:bg-ink disabled:opacity-60">
        {busy ? "Saving…" : next.label}
      </button>
      {err && <p role="alert" className="text-[12px] text-danger">{err}</p>}
    </div>
  );
}
