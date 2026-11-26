import { cn } from "@/lib/cn";
import { Checkbox, TextField } from "@/ui";
import { labelClass, plain, selectClass } from "./fields";
import { BADGE_TONES } from "./types";
import { HEX_RE } from "./validation";
import type { ProductFormApi } from "./useProductForm";

export function AppearanceSection({ form }: { form: ProductFormApi }) {
  const { v, errors, text, set } = form;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className={labelClass}>Placeholder colour
          <span className="flex items-center gap-3">
            <input type="color" value={HEX_RE.test(v.tone) ? v.tone : "#d9c4a4"} onChange={text("tone")} className="h-11 w-14 cursor-pointer rounded-field bg-field p-1" />
            <span className={cn("font-mono text-[13px]", plain)}>{v.tone}</span>
          </span>
        </label>
        <TextField label="Badge text" value={v.badgeText} onChange={text("badgeText")} maxLength={30} error={errors.badge} aside={<span className="text-[11px] text-ink-subtle">optional</span>} />
        <label className={labelClass}>Badge style
          <select value={v.badgeTone} onChange={text("badgeTone")} className={cn(selectClass, "font-normal capitalize tracking-normal")}>{BADGE_TONES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <Checkbox checked={v.isActive} onChange={(e) => set("isActive", e.target.checked)}>Visible in the shop</Checkbox>
        <Checkbox checked={v.trending} onChange={(e) => set("trending", e.target.checked)}>Trending</Checkbox>
        <Checkbox checked={v.oeko} onChange={(e) => set("oeko", e.target.checked)}>OEKO-TEX certified</Checkbox>
      </div>
    </>
  );
}
