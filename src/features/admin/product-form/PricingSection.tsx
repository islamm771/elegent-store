import { TextField } from "@/ui";
import type { ProductFormApi } from "./useProductForm";

export function PricingSection({ form }: { form: ProductFormApi }) {
  const { v, errors, text } = form;
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <TextField label="Price ($)" inputMode="decimal" value={v.price} onChange={text("price")} error={errors.priceCents || errors.price} />
      <TextField label="Was ($)" inputMode="decimal" value={v.compareAt} onChange={text("compareAt")} error={errors.compareAtCents || errors.compareAt} aside={<span className="text-[11px] text-ink-subtle">sale only</span>} />
      <TextField label="Stock (units)" inputMode="numeric" value={v.stock} onChange={text("stock")} error={errors.stock} />
    </div>
  );
}
