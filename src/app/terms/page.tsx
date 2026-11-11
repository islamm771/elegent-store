import Link from "next/link";

export const metadata = { title: "Terms of Service — Elegent" };

export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-5">
      <p className="eyebrow text-accent">Coming soon</p>
      <h1 className="font-serif text-[32px] leading-10">Terms of Service</h1>
      <p className="text-[15px] leading-6 text-ink-muted">This page hasn&apos;t been built yet.</p>
      <Link href="/login" className="label-caps text-ink underline underline-offset-2">Back to sign in</Link>
    </main>
  );
}
