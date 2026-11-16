"use client";
import { categories, colors, materials, sizes } from "@/features/shop/catalog";
import { cn } from "@/lib/cn";
import { Button, Checkbox, TextField } from "@/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEPARTMENTS = ["women", "men", "kids"] as const;
const BADGE_TONES = ["dark", "accent", "danger", "light"] as const;

export interface ProductFormValues {
  slug: string; name: string; label: string; description: string; category: string; material: string;
  departments: string[]; colors: string[]; sizes: string[]; images: string; tone: string;
  price: string; compareAt: string; stock: string; badgeText: string; badgeTone: string; oeko: boolean; trending: boolean; isActive: boolean;
}
export const emptyProduct: ProductFormValues = {
  slug: "", name: "", label: "", description: "", category: categories[0].id, material: materials[0].id,
  departments: ["women"], colors: [], sizes: [], images: "", tone: "#d9c4a4",
  price: "", compareAt: "", stock: "0", badgeText: "", badgeTone: "dark", oeko: false, trending: false, isActive: true,
};

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const toCents = (v: string) => Math.round(Number(v) * 100);
const select = "w-full rounded-field bg-field px-4 py-3 text-[15px] text-ink outline-none focus:ring-1 focus:ring-accent";

function Group({ legend, error, children }: { legend: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
    </fieldset>
  );
}
const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" aria-pressed={on} onClick={onClick}
    className={cn("flex items-center gap-2 rounded-pill px-4 py-2 text-[13px] font-semibold shadow-hairline", on ? "bg-black text-white" : "bg-surface text-ink hover:bg-field")}>{children}</button>
);

export function ProductForm({ initial, editing }: { initial: ProductFormValues; editing: boolean }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(editing);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) => { setV((s) => ({ ...s, [k]: val })); setErrors((e) => ({ ...e, [k]: "" })); };
  const text = (k: keyof ProductFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(k, e.target.value as never);
  const toggle = (k: "departments" | "colors" | "sizes", id: string) => set(k, v[k].includes(id) ? v[k].filter((x) => x !== id) : [...v[k], id]);
  const imageList = v.images.split("\n").map((s) => s.trim()).filter(Boolean);

  function validate() {
    const e: Record<string, string> = {};
    if (v.name.trim().length < 2) e.name = "Enter the product name.";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.slug) || v.slug.length < 2) e.slug = "Lowercase letters, numbers and hyphens only.";
    if (v.label.trim().length < 2) e.label = "Enter a short label, e.g. “Normandy flax”.";
    if (!(Number(v.price) >= 1)) e.price = "Enter the price in dollars (min 1).";
    if (v.compareAt && !(Number(v.compareAt) > Number(v.price))) e.compareAt = "Must be higher than the price (or leave empty).";
    if (!Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) e.stock = "A whole number, 0 or more.";
    if (v.departments.length === 0) e.departments = "Pick at least one department.";
    if (v.colors.length === 0) e.colors = "Pick at least one colour (the first one picked is the default).";
    if (v.sizes.length === 0) e.sizes = "Pick at least one size.";
    if (!/^#[0-9a-fA-F]{6}$/.test(v.tone)) e.tone = "Use a #rrggbb colour.";
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault(); setMsg(null);
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) { setMsg({ ok: false, text: "Please fix the highlighted fields." }); return; }
    const body = {
      ...(editing ? {} : { slug: v.slug }),
      name: v.name.trim(), label: v.label.trim(), description: v.description.trim() || null, category: v.category, material: v.material,
      departments: v.departments, colors: v.colors, sizes: v.sizes, images: imageList, tone: v.tone,
      priceCents: toCents(v.price), compareAtCents: v.compareAt ? toCents(v.compareAt) : null, stock: Number(v.stock),
      badge: v.badgeText.trim() ? { text: v.badgeText.trim(), tone: v.badgeTone } : null,
      oeko: v.oeko, trending: v.trending, isActive: v.isActive,
    };
    setBusy(true);
    try {
      const res = await fetch(editing ? `/api/products/${encodeURIComponent(v.slug)}` : "/api/products", { method: editing ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (editing) { setMsg({ ok: true, text: "Saved." }); router.refresh(); }
        else router.push(`/admin/products?created=${v.slug}`);
        return;
      }
      if (data.fields) { setErrors(data.fields); setMsg({ ok: false, text: "Some fields were rejected — see below." }); }
      else setMsg({ ok: false, text: res.status === 403 ? "You're not allowed to do that." : "Something went wrong. Please try again." });
    } catch { setMsg({ ok: false, text: "Network problem. Please try again." }); }
    setBusy(false);
  }

  async function remove() {
    if (!confirm(`Delete “${v.name}” permanently?\n\nIt will also disappear from bags and wishlists. To just take it off the shop, untick “Visible in the shop” instead.`)) return;
    setBusy(true);
    const res = await fetch(`/api/products/${encodeURIComponent(v.slug)}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) router.push("/admin/products"); else { setMsg({ ok: false, text: "Couldn't delete the product." }); setBusy(false); }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6 rounded-[8px] bg-surface p-5 shadow-hairline sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" value={v.name} error={errors.name}
          onChange={(e) => { set("name", e.target.value); if (!slugTouched) setV((s) => ({ ...s, name: e.target.value, slug: slugify(e.target.value) })); }} />
        <TextField label="Slug (URL)" value={v.slug} error={errors.slug} disabled={editing} aside={<span className="text-[11px] text-ink-subtle">{editing ? "can't change" : "/shop/…"}</span>}
          onChange={(e) => { setSlugTouched(true); set("slug", e.target.value.toLowerCase()); }} />
      </div>
      <TextField label="Short label" value={v.label} onChange={text("label")} error={errors.label} aside={<span className="text-[11px] text-ink-subtle">e.g. Normandy flax</span>} />

      <label className="flex flex-col gap-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Description
        <textarea value={v.description} onChange={text("description")} rows={4} maxLength={2000} className={cn(select, "resize-y font-normal normal-case tracking-normal")} />
        {errors.description && <span role="alert" className="text-[13px] font-normal normal-case text-danger">{errors.description}</span>}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Category
          <select value={v.category} onChange={text("category")} className={cn(select, "font-normal normal-case tracking-normal")}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Material
          <select value={v.material} onChange={text("material")} className={cn(select, "font-normal normal-case tracking-normal")}>{materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
        </label>
      </div>

      <Group legend="Departments" error={errors.departments}>{DEPARTMENTS.map((d) => <Chip key={d} on={v.departments.includes(d)} onClick={() => toggle("departments", d)}><span className="capitalize">{d}</span></Chip>)}</Group>
      <Group legend="Colours" error={errors.colors}>{colors.map((c) => <Chip key={c.id} on={v.colors.includes(c.id)} onClick={() => toggle("colors", c.id)}><span className="size-3.5 rounded-full border border-black/20" style={{ background: c.hex }} aria-hidden />{c.name}</Chip>)}</Group>
      <Group legend="Sizes" error={errors.sizes}>{sizes.map((s) => <Chip key={s} on={v.sizes.includes(s)} onClick={() => toggle("sizes", s)}>{s.toUpperCase()}</Chip>)}</Group>

      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="Price ($)" inputMode="decimal" value={v.price} onChange={text("price")} error={errors.priceCents ?? errors.price} />
        <TextField label="Was ($)" inputMode="decimal" value={v.compareAt} onChange={text("compareAt")} error={errors.compareAtCents ?? errors.compareAt} aside={<span className="text-[11px] text-ink-subtle">sale only</span>} />
        <TextField label="Stock (units)" inputMode="numeric" value={v.stock} onChange={text("stock")} error={errors.stock} />
      </div>

      <label className="flex flex-col gap-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Images <span className="font-normal normal-case tracking-normal text-ink-subtle">one per line — a /path or full https:// URL; the first is the main photo</span>
        <textarea value={v.images} onChange={text("images")} rows={3} spellCheck={false} className={cn(select, "resize-y font-mono text-[13px] font-normal normal-case tracking-normal")} />
        {errors.images && <span role="alert" className="text-[13px] font-normal normal-case text-danger">{errors.images}</span>}
      </label>
      {imageList.length > 0 && (
        <div className="flex flex-wrap gap-2">{imageList.map((u, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={u + i} src={u} alt={`Preview ${i + 1}`} className="h-24 w-20 rounded-sm bg-field object-cover" />
        ))}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Placeholder colour
          <span className="flex items-center gap-3"><input type="color" value={/^#[0-9a-fA-F]{6}$/.test(v.tone) ? v.tone : "#d9c4a4"} onChange={text("tone")} className="h-11 w-14 cursor-pointer rounded-field bg-field p-1" /><span className="font-mono text-[13px] font-normal normal-case tracking-normal">{v.tone}</span></span>
        </label>
        <TextField label="Badge text" value={v.badgeText} onChange={text("badgeText")} maxLength={30} error={errors.badge} aside={<span className="text-[11px] text-ink-subtle">optional</span>} />
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Badge style
          <select value={v.badgeTone} onChange={text("badgeTone")} className={cn(select, "font-normal normal-case capitalize tracking-normal")}>{BADGE_TONES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <Checkbox checked={v.isActive} onChange={(e) => set("isActive", e.target.checked)}>Visible in the shop</Checkbox>
        <Checkbox checked={v.trending} onChange={(e) => set("trending", e.target.checked)}>Trending</Checkbox>
        <Checkbox checked={v.oeko} onChange={(e) => set("oeko", e.target.checked)}>OEKO-TEX certified</Checkbox>
      </div>

      {msg && <p role={msg.ok ? "status" : "alert"} className={cn("rounded-field bg-field px-4 py-3 text-[13px]", msg.ok ? "text-accent" : "text-danger")}>{msg.text}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-5">
          <Button type="submit" className="w-auto" loading={busy}>{editing ? "Save changes" : "Create product"}</Button>
          <a href="/admin/products" className="label-caps text-ink underline underline-offset-2">Back to list</a>
        </div>
        {editing && <button type="button" onClick={remove} disabled={busy} className="label-caps text-danger underline underline-offset-2 disabled:opacity-50">Delete product</button>}
      </div>
    </form>
  );
}
