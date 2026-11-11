import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MobileTabBar } from "./MobileTabBar";
import { SiteHeader } from "./SiteHeader";

export async function ComingSoon({ title }: { title: string }) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <SiteHeader user={session?.user ?? null} />
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-5 pb-20 pt-24">
        <p className="eyebrow text-accent">Coming soon</p>
        <h1 className="font-serif text-[32px] leading-10">{title}</h1>
        <p className="text-[15px] leading-6 text-ink-muted">This page hasn&apos;t been built yet.</p>
        <Link href="/" className="label-caps text-ink underline underline-offset-2">Back to home</Link>
      </main>
      <MobileTabBar />
    </>
  );
}
