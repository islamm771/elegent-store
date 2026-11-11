import { ArrowRightIcon, LeafIcon } from "@/ui";
import Link from "next/link";
import { Photo } from "./Photo";

export function EditorialBanner() {
  return (
    <>
      {/* mobile: image card with overlaid copy */}
      <section className="p-4 lg:hidden">
        <Photo src="/images/home/editorial.jpg" tone="#b98a5e" className="flex min-h-65 flex-col justify-end rounded-2xl px-6 pb-6 pt-15 shadow-hairline">
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 via-50% to-transparent" />
          <div className="relative flex flex-col gap-2 text-white">
            <p className="eyebrow text-peach/90">Editorial highlight</p>
            <h3 className="font-serif text-2xl font-semibold leading-8.25">The Sun-Washed Earth<br />Capsule</h3>
            <p className="max-w-80 text-[13px] leading-5 text-white/80">Handcrafted natural fibers shaped into timeless feminine silhouettes made for everyday grace.</p>
            <Link href="/shop?dept=trends" className="flex items-center gap-2 pt-3 text-[13px] font-semibold uppercase tracking-wider">Explore trend <ArrowRightIcon width={12} height={12} /></Link>
          </div>
        </Photo>
      </section>

      {/* desktop: split */}
      <section className="hidden bg-field py-12 lg:block">
        <div className="mx-auto grid max-w-360 grid-cols-2 items-center gap-16 px-6">
          <Photo src="/images/home/editorial.jpg" tone="#b98a5e" alt="The Sun-Washed Earth Capsule" className="h-130 rounded-[8px] shadow-cta">
            <div className="absolute bottom-6 left-6 flex max-w-64 flex-col gap-1 bg-canvas/90 p-4 backdrop-blur-md">
              <p className="eyebrow flex items-center gap-1.5 text-accent"><LeafIcon width={13} height={13} /> Origin verified</p>
              <p className="font-serif text-lg">Tuscany &amp; Normandy</p>
              <p className="text-[13px] leading-5 text-ink-muted">Spun from certified zero-waste flax farms.</p>
            </div>
          </Photo>
          <div className="flex flex-col items-start gap-5">
            <p className="eyebrow text-accent">✦ Vol. 14 editorial</p>
            <h2 className="font-serif text-[56px] font-semibold leading-15 tracking-tight">The Sun-Washed<br />Earth Capsule</h2>
            <p className="max-w-lg text-[15px] leading-6 text-ink-muted">
              Conceived as an homage to the Mediterranean coastline, this capsule embodies effortless silhouette drape, artisanal vegetable tanning, and unhurried linen spinning. Built to evolve in texture with every wear.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <Link href="/shop?dept=trends" className="rounded-field bg-black px-7 py-4 text-[13px] font-semibold uppercase tracking-widest text-white shadow-cta hover:bg-ink">Explore lookbook</Link>
              <Link href="/shop" className="label-caps border-b border-ink pb-1">Read craft narrative</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
