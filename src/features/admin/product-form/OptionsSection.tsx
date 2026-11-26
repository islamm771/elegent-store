import { colors, sizes } from "@/features/shop/catalog";
import { Chip, Group } from "./fields";
import { DEPARTMENTS } from "./types";
import type { ProductFormApi } from "./useProductForm";

export function OptionsSection({ form }: { form: ProductFormApi }) {
  const { v, errors, toggle } = form;
  return (
    <>
      <Group legend="Departments" error={errors.departments}>
        {DEPARTMENTS.map((d) => <Chip key={d} on={v.departments.includes(d)} onClick={() => toggle("departments", d)}><span className="capitalize">{d}</span></Chip>)}
      </Group>
      <Group legend="Colours" error={errors.colors}>
        {colors.map((c) => (
          <Chip key={c.id} on={v.colors.includes(c.id)} onClick={() => toggle("colors", c.id)}>
            <span className="size-3.5 rounded-full border border-black/20" style={{ background: c.hex }} aria-hidden />{c.name}
          </Chip>
        ))}
      </Group>
      <Group legend="Sizes" error={errors.sizes}>
        {sizes.map((s) => <Chip key={s} on={v.sizes.includes(s)} onClick={() => toggle("sizes", s)}>{s.toUpperCase()}</Chip>)}
      </Group>
    </>
  );
}
