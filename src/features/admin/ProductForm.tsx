"use client";
import { cn } from "@/lib/cn";
import { Button } from "@/ui";
import { AppearanceSection } from "./product-form/AppearanceSection";
import { BasicsSection } from "./product-form/BasicsSection";
import { MediaSection } from "./product-form/MediaSection";
import { OptionsSection } from "./product-form/OptionsSection";
import { PricingSection } from "./product-form/PricingSection";
import type { ProductFormValues } from "./product-form/types";
import { useProductForm } from "./product-form/useProductForm";

// the pages import these from here, so keep them available
export { emptyProduct } from "./product-form/types";
export type { ProductFormValues } from "./product-form/types";

/** Layout only: state lives in useProductForm, rules in product-form/validation, API calls in services/products. */
export function ProductForm({ initial, editing }: { initial: ProductFormValues; editing: boolean }) {
  const form = useProductForm(initial, editing);
  const { msg, busy, submit, remove } = form;

  return (
    <form onSubmit={submit} noValidate className="mx-auto flex max-w-3xl flex-col gap-6 rounded-[8px] bg-surface p-5 shadow-hairline sm:p-8">
      <BasicsSection form={form} />
      <OptionsSection form={form} />
      <PricingSection form={form} />
      <MediaSection form={form} />
      <AppearanceSection form={form} />

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
