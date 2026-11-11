import { ArrowRightIcon, HeartIcon } from "@/ui";
import Link from "next/link";
import { DotGrid, Photo } from "./Photo";

const stats = [
  { value: "98.4%", label: "Fitting accuracy" },
  { value: "100%", label: "Organic fibers" },
  { value: "48h", label: "Global express" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-6 lg:bg-field lg:px-6 lg:py-26">
      <div aria-hidden className="absolute -left-32 -top-32 hidden size-96 rounded-pill bg-[rgba(254,217,185,0.2)] blur-[32px] lg:block" />
      <div aria-hidden className="absolute bottom-0 left-1/2 right-1/4 hidden h-80 rounded-pill bg-[rgba(239,231,219,0.4)] blur-[20px] lg:block" />

      <div className="relative mx-auto grid max-w-360 gap-6 lg:grid-cols-2 lg:items-center lg:gap-7 px-4 lg:px-6">
        <div className="flex max-w-xl flex-col items-start lg:pr-4">
          <p className="eyebrow flex items-center gap-2 pb-3.5 text-accent">
            <span className="size-1.5 rounded-pill bg-accent" /> Autumn / Winter ’25 · Seasonal capsule
          </p>
          <h1 className="font-serif text-[40px] font-normal leading-[44.8px] tracking-[-1px] lg:text-[72px] lg:font-semibold lg:leading-[75.6px] lg:tracking-[-1.8px]">
            Find The Best<br />Fashion Style<br />For You
          </h1>
          <p className="max-w-sm pb-6 pt-4 text-[14px] leading-[22.75px] text-ink-muted lg:max-w-lg lg:pb-12 lg:pt-6 lg:text-[18px] lg:leading-[29px]">
            We are here to help you, customer. You are important to us and we care about your satisfaction. You will find everything you want here. Just let us help you to complete your elegance.
          </p>

          <div className="flex flex-wrap items-center gap-4 pb-7 lg:pb-4">
            <Link href="/shop" className="inline-flex items-center gap-3 rounded-field bg-black px-9 py-4 text-[13px] font-semibold uppercase leading-4 tracking-widest text-white shadow-cta hover:bg-ink">
              Shop now <ArrowRightIcon width={11} height={11} />
            </Link>
            <Link href="/shop?dept=women" className="hidden items-center gap-3 rounded-field border border-ink/20 px-8 py-4 text-[13px] font-semibold uppercase leading-4 tracking-wider hover:bg-surface lg:inline-flex">
              Explore collection <ArrowRightIcon width={12} height={12} />
            </Link>
          </div>

          <dl className="hidden w-full gap-4 bg-surface/60 p-4 lg:flex">
            {stats.map((s) => (
              <div key={s.label} className="flex-1">
                <dd className="font-serif text-2xl font-medium leading-8 text-black">{s.value}</dd>
                <dt className="text-[11px] font-semibold uppercase leading-[14px] tracking-wider text-ink-subtle">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative pt-2 lg:pt-0">
          <Photo src="/images/home/hero.jpg" tone="#c9a27c" alt="Sienna Buttoned Linen Dress, Look No. 04"
            className="flex h-[447px] items-end rounded-bl-[64px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[28px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] lg:h-[580px] lg:rounded-bl-[96px] lg:rounded-tr-[40px]">
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent via-50% to-transparent" />
            <div className="relative m-4 flex w-full items-center justify-between rounded-pill bg-canvas/90 px-4 py-2.5 shadow-cta backdrop-blur-md">
              <div className="flex items-center gap-2.5 pr-2">
                <span className="size-2 rounded-pill bg-accent" />
                <p className="text-[10px] font-bold uppercase leading-6 tracking-wider text-accent">Look no. 04</p>
                <p className="truncate text-[12px] font-medium leading-6">
                  <span className="lg:hidden">Sienna Linen Dress · $145</span>
                  <span className="hidden lg:inline">Sienna Buttoned Linen Dress · $145</span>
                </p>
              </div>
              <button type="button" aria-label="Save look" className="grid size-8 shrink-0 place-items-center rounded-pill bg-field shadow-hairline hover:bg-sand">
                <HeartIcon width={14} height={14} />
              </button>
            </div>
          </Photo>
          <DotGrid className="absolute -right-2 -top-1 lg:-top-4" />
          <DotGrid className="absolute -bottom-3 -left-1" />
        </div>
      </div>
    </section>
  );
}
