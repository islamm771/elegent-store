interface Props {
  /** Put the photo in /public/brand/auth-hero.jpg (export it from the Figma frame). */
  image?: string;
  quote?: string;
  attribution?: string;
}

export function AuthHero({
  image = "/brand/auth-hero.jpg",
  quote = "“Elegance is not about being noticed, it is about being remembered.”",
  attribution = "Architectural Collection",
}: Props) {
  return (
    <div className="relative h-full text-canvas">
      <div className="absolute inset-0 bg-accent bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 via-50% to-transparent" />
      <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />

      <div className="relative flex h-full flex-col justify-between p-14">
        <div className="flex items-center justify-between gap-6">
          <p className="eyebrow max-w-28 rounded-[2px] bg-black/40 px-3 py-1.5 tracking-[0.25em] text-canvas/90 backdrop-blur-sm">
            Edition Autumn / Winter MMXXIV
          </p>
          <p className="eyebrow flex items-center gap-1.5 text-canvas/70">
            <span className="h-1.5 w-0.5 rounded-pill bg-peach" /> Verified private atelier
          </p>
        </div>

        <figure className="flex max-w-xl flex-col gap-5">
          <span className="h-0.5 w-12 bg-peach" />
          <blockquote className="font-serif text-[32px] italic leading-11 tracking-tight">{quote}</blockquote>
          <figcaption className="eyebrow tracking-[0.2em] text-sand">{attribution}</figcaption>
        </figure>
      </div>
    </div>
  );
}
