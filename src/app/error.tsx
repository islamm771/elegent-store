"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-5">
      <p className="eyebrow text-accent">Something went wrong</p>
      <h1 className="font-serif text-[32px] leading-10">We hit a snag</h1>
      <p className="text-[15px] leading-6 text-ink-muted">Please try again. If it keeps happening, come back in a few minutes.</p>
      <button type="button" onClick={reset} className="w-fit rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-widest text-white shadow-cta">Try again</button>
    </main>
  );
}
