import { cn } from "@/lib/cn";
import { FieldError, labelClass, plain, selectClass } from "./fields";
import type { ProductFormApi } from "./useProductForm";

export function MediaSection({ form }: { form: ProductFormApi }) {
  const { v, errors, text, imageList } = form;
  return (
    <>
      <label className={labelClass}>Images <span className={cn(plain, "text-ink-subtle")}>one per line — a /path or full https:// URL; the first is the main photo</span>
        <textarea value={v.images} onChange={text("images")} rows={3} spellCheck={false} className={cn(selectClass, "resize-y font-mono text-[13px]", plain)} />
        <FieldError>{errors.images}</FieldError>
      </label>
      {imageList.length > 0 && (
        <div className="flex flex-wrap gap-2">{imageList.map((u, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={u + i} src={u} alt={`Preview ${i + 1}`} className="h-24 w-20 rounded-sm bg-field object-cover" />
        ))}</div>
      )}
    </>
  );
}
