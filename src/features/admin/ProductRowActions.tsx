"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function api(slug: string, method: "PATCH" | "DELETE", body?: unknown) {
  const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, { method, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  return res.ok;
}

/** Quick edit of the stock number straight from the list (saves when you leave the field or press Enter). */
export function StockInput({ slug, stock }: { slug: string; stock: number }) {
  const router = useRouter();
  const [v, setV] = useState(String(stock));
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  async function save() {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0 || n === stock) { setV(String(stock)); return; }
    setState("saving");
    if (await api(slug, "PATCH", { stock: n })) { setState("idle"); router.refresh(); } else { setState("error"); setV(String(stock)); }
  }
  return (
    <input type="number" min={0} inputMode="numeric" aria-label="Stock" value={v} disabled={state === "saving"}
      onChange={(e) => setV(e.target.value)} onBlur={save} onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur())}
      className={`w-20 rounded-field bg-field px-3 py-2 text-[14px] outline-none focus:ring-1 focus:ring-accent ${state === "error" ? "ring-1 ring-danger" : ""}`} />
  );
}

export function ProductRowActions({ slug, name, isActive }: { slug: string; name: string; isActive: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  async function run(fn: () => Promise<boolean>) {
    setBusy(true); setErr(false);
    if (await fn().catch(() => false)) router.refresh(); else setErr(true);
    setBusy(false);
  }
  const link = "label-caps underline underline-offset-2 disabled:opacity-50";
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
      <a href={`/admin/products/${slug}`} className={link}>Edit</a>
      <button type="button" disabled={busy} className={link} onClick={() => run(() => api(slug, "PATCH", { isActive: !isActive }))}>{isActive ? "Hide" : "Show"}</button>
      <button type="button" disabled={busy} className={`${link} text-danger`}
        onClick={() => confirm(`Delete “${name}” permanently?\n\nIt will also disappear from bags and wishlists. To just take it off the shop, use Hide instead.`) && run(() => api(slug, "DELETE"))}>Delete</button>
      {err && <span role="alert" className="text-[12px] text-danger">Failed</span>}
    </div>
  );
}
