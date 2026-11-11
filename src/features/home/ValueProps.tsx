import { BadgeCheckIcon, HeadsetIcon, LeafIcon, RulerIcon, TruckIcon } from "@/ui";

const props = [
  { icon: RulerIcon, title: "Tailored Virtual Fittings", text: "Precision digital sizing consultation with our master couturiers before your order dispatches." },
  { icon: LeafIcon, title: "100% Certified Linen", text: "European flax farmed without chemical defoliants, preserving softness and lifelong drape." },
  { icon: HeadsetIcon, title: "24/7 Styling Concierge", text: "Dedicated wardrobe curators ready to advise on event dressing, layering, and jewelry matching." },
  { icon: TruckIcon, title: "Global Express Duty-Free", text: "Complimentary climate-neutral courier to 120+ countries on all boutique purchases over $200." },
];

const mini = [
  { icon: TruckIcon, a: "Free express", b: "Over $150" },
  { icon: LeafIcon, a: "Organic linen", b: "Sustainably made" },
  { icon: HeadsetIcon, a: "Concierge", b: "24/7 styling" },
];

export function ValueProps() {
  return (
    <>
      <section className="px-4 py-5 lg:hidden">
        <div className="flex flex-col gap-4 rounded-[8px] bg-field p-5">
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-[#fed9b9]"><BadgeCheckIcon width={18} height={18} /></span>
            <div>
              <h3 className="text-base font-semibold leading-6">We Care About Your Satisfaction</h3>
              <p className="text-[13px] leading-5 text-ink-muted">Complimentary tailored fittings &amp; 30-day effortless returns.</p>
            </div>
          </div>
          <ul className="grid grid-cols-3 gap-2 rounded-sm bg-surface px-3 pb-3 pt-2 text-center">
            {mini.map(({ icon: Icon, a, b }) => (
              <li key={a} className="flex flex-col items-center">
                <Icon width={15} height={15} className="mb-1" />
                <span className="text-[10px] font-semibold uppercase leading-6">{a}</span>
                <span className="text-[11px] uppercase leading-6 text-ink-muted">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hidden py-12 lg:block">
        <ul className="mx-auto grid max-w-360 grid-cols-4 gap-8 px-6">
          {props.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex flex-col items-start gap-3">
              <span className="grid size-12 place-items-center rounded-pill bg-[#fed9b9]"><Icon width={20} height={20} /></span>
              <h3 className="text-base font-semibold leading-6">{title}</h3>
              <p className="text-[13px] leading-5 text-ink-muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
