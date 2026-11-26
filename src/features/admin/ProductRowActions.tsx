"use client";
import { productsApi } from "@/services/products";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Quick edit of the stock number straight from the list (saves when you leave the field or press Enter). */
export function StockInput({ slug, stock }: { slug: string; stock: number }) {
  const router = useRouter();
  const [v, setV] = useState(String(stock));
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");

  async function save() {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0 || n === stock) { setV(String(stock)); return; }
    setState("saving");
    try {
      await productsApi.update(slug, { stock: n });
      setState("idle");
      router.refresh();
    } catch {
      setState("error");
      setV(String(stock));
    }
  }

  return (
    <input type="number" min={0} inputMode="numeric" aria-label="Stock" value={v} disabled={state === "saving"}
      onChange={(e) => setV(e.target.value)} onBlur={save} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      className={`w-20 rounded-field bg-field px-3 py-2 text-[14px] outline-none focus:ring-1 focus:ring-accent ${state === "error" ? "ring-1 ring-danger" : ""}`} />
  );
}

export function ProductRowActions({ slug, name, isActive }: { slug: string; name: string; isActive: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  /** Runs one API call, then re-reads the list. Any failure just shows "Failed". */
  async function run(call: () => Promise<unknown>) {
    setBusy(true); setErr(false);
    try {
      await call();
      router.refresh();
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  }

  const toggleVisible = () => run(() => productsApi.update(slug, { isActive: !isActive }));
  const remove = () => {
    if (!confirm(`Delete “${name}” permanently?\n\nIt will also disappear from bags and wishlists. To just take it off the shop, use Hide instead.`)) return;
    run(() => productsApi.remove(slug));
  };

  const link = "label-caps underline underline-offset-2 disabled:opacity-50";
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
      <a href={`/admin/products/${slug}`} className={link}>Edit</a>
      <button type="button" disabled={busy} className={link} onClick={toggleVisible}>{isActive ? "Hide" : "Show"}</button>
      <button type="button" disabled={busy} className={`${link} text-danger`} onClick={remove}>Delete</button>
      {err && <span role="alert" className="text-[12px] text-danger">Failed</span>}
    </div>
  );
}