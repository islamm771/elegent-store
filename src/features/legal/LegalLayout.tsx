import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { legalPlaceholders } from "@/lib/legal";
import { MobileTabBar } from "@/features/shell/MobileTabBar";
import { SiteFooter } from "@/features/shell/SiteFooter";
import { SiteHeader } from "@/features/shell/SiteHeader";

export async function LegalLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const sample = process.env.NODE_ENV === "production" ? [] : legalPlaceholders();
  return (
    <>
      <div className="print:hidden"><SiteHeader user={session?.user ?? null} /></div>
      <main id="top" className="bg-canvas pb-24 pt-16 lg:pb-0 lg:pt-[102px]">
        {sample.length > 0 && (
          <p role="note" className="bg-[#fed9b9] px-4 py-2 text-center text-[13px] leading-5 text-[#5a3e22] print:hidden">
            <b>Development notice:</b> the {sample.map((m) => <code key={m} className="mx-0.5 rounded-[2px] bg-white/60 px-1">{m}</code>)} on this page are the Figma sample details — replace them in <code className="rounded-[2px] bg-white/60 px-1">src/lib/legal.ts</code>. Never shown in production.
          </p>
        )}
        {children}
      </main>
      <div className="print:hidden"><SiteFooter /><MobileTabBar /></div>
    </>
  );
}
