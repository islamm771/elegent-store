"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NEXT: Record<string, { to: string; label: string } | undefined> = {
  CONFIRMED: { to: "PACKED", label: "Mark packed" },
  PACKED: { to: "SHIPPED", label: "Out for delivery" },
  SHIPPED: { to: "DELIVERED", label: "Mark delivered" },
};

export function OrderActions({ number, status, cod }: { number: string; status: string; cod: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const next = NEXT[status];
  if (!next) return null;

  async function go() {
    if (next!.to === "DELIVERED" && cod && !confirm("Cash was collected from the customer?")) return;
    setBusy(true); setErr(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(number)}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: next!.to }) });
      if (res.ok) router.refresh();
      else setErr(res.status === 409 ? "Already changed — refreshing." : res.status === 403 ? "Not allowed." : "Failed, try again.");
      if (res.status === 409) router.refresh();
    } catch { setErr("Network problem."); }
    setBusy(false);
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
