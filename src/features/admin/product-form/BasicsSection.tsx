import { categories, materials } from "@/features/shop/catalog";
import { cn } from "@/lib/cn";
import { TextField } from "@/ui";
import { FieldError, labelClass, plain, selectClass } from "./fields";
import type { ProductFormApi } from "./useProductForm";

export function BasicsSection({ form }: { form: ProductFormApi }) {
  const { v, errors, editing, text, setName, setSlug } = form;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" value={v.name} error={errors.name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Slug (URL)" value={v.slug} error={errors.slug} disabled={editing} onChange={(e) => setSlug(e.target.value)}
          aside={<span className="text-[11px] text-ink-subtle">{editing ? "can't change" : "/shop/…"}</span>} />
      </div>
      <TextField label="Short label" value={v.label} onChange={text("label")} error={errors.label} aside={<span className="text-[11px] text-ink-subtle">e.g. Normandy flax</span>} />

      <label className={labelClass}>Description
        <textarea value={v.description} onChange={text("description")} rows={4} maxLength={2000} className={cn(selectClass, "resize-y", plain)} />
        <FieldError>{errors.description}</FieldError>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>Category
          <select value={v.category} onChange={text("category")} className={cn(selectClass, plain)}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </label>
        <label className={labelClass}>Material
          <select value={v.material} onChange={text("material")} className={cn(selectClass, plain)}>{materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
        </label>
      </div>
    </>
  );
}
