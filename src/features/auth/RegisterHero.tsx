import { CheckIcon, ShieldIcon, StarIcon } from "@/ui";

const benefits = ["Early Drop Access 48 Hours Ahead", "Complimentary Bespoke Atelier Tailoring", "Dedicated Concierge & Personal Stylist"];

export function RegisterHero({ image = "/brand/register-hero.jpg" }: { image?: string }) {
  return (
    <div className="relative h-full text-canvas">
      <div className="absolute inset-0 bg-accent bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 via-50% to-black/30" />

      <div className="relative flex h-full flex-col justify-between p-12">
        <div className="flex items-center justify-between">
          <p className="eyebrow bg-black/40 px-3 py-1.5 tracking-[0.25em] backdrop-blur-sm">Maison Elegent • Est. 2024</p>
          <p className="eyebrow flex items-center gap-1.5 text-peach"><ShieldIcon width={16} height={16} /> Verified atelier</p>
        </div>

        <div aria-hidden className="absolute right-6 top-1/3 grid grid-cols-5 gap-3 opacity-30">
          {Array.from({ length: 15 }, (_, i) => <span key={i} className="size-1 rounded-pill bg-white" />)}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 bg-white/15 p-6 shadow-xl backdrop-blur-md">
            <p className="eyebrow flex items-center gap-2 tracking-[0.2em] text-peach"><StarIcon width={15} height={15} /> Private membership benefits</p>
            <blockquote className="font-serif text-2xl italic leading-8 text-white">
              “True luxury lives in unhurried precision and effortless silhouette.”
            </blockquote>
            <ul className="flex flex-col gap-3 pt-3 text-[13px] leading-5 text-canvas">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="grid size-5 place-items-center rounded-pill bg-peach/20 text-peach"><CheckIcon width={10} height={10} strokeWidth={3} /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="label-caps flex justify-between text-canvas/70">
            <span>Paris • Milan • Tokyo • New York</span>
            <span>Autumn / Winter 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}
