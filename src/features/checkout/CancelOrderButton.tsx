"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CancelOrderButton({ number, paid }: { number: string; paid: boolean }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function cancel() {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(number)}/cancel`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { router.refresh(); return; }
      setMsg(res.status === 409 ? "This order can no longer be cancelled — it may already be on its way." : "Something went wrong. Please try again.");
    } catch { setMsg("Network problem. Please try again."); }
    setBusy(false); setConfirm(false);
  }

  if (!confirm) {
    return (
      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => setConfirm(true)} className="label-caps self-start text-danger underline underline-offset-2">Cancel this order</button>
        {msg && <p role="alert" className="text-[13px] text-danger">{msg}</p>}
      </div>
    );
  }
  return (
    <div role="alertdialog" aria-label="Confirm cancellation" className="rounded-[8px] bg-surface p-4 shadow-hairline">
      <p className="text-[15px] font-semibold">Cancel order {number}?</p>
      <p className="mt-1 text-[13px] leading-5 text-ink-muted">{paid ? "You'll be refunded in full to your card (it can take a few days to show up)." : "Nothing will be charged."}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={cancel} className="rounded-field bg-danger px-5 py-2.5 text-[12px] font-semibold uppercase tracking-widest text-white disabled:opacity-60">{busy ? "Cancelling…" : "Yes, cancel"}</button>
        <button type="button" disabled={busy} onClick={() => setConfirm(false)} className="label-caps self-center text-ink underline underline-offset-2">Keep order</button>
      </div>
    </div>
  );
}
