import { MobileTabBar } from "@/features/shell/MobileTabBar";
import { SiteFooter } from "@/features/shell/SiteFooter";
import { SiteHeader } from "@/features/shell/SiteHeader";
import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ReactNode } from "react";

const SECTIONS = [{ id: "orders", label: "Orders", href: "/admin/orders" }, { id: "products", label: "Products", href: "/admin/products" }] as const;

export function AdminShell({ user, active, title, action, children }: {
  user: { name?: string | null; email?: string | null }; active: "orders" | "products"; title: string; action?: ReactNode; children: ReactNode;
}) {
  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto min-h-[57vh] max-w-360 px-4 pb-24 pt-16 lg:px-6 lg:pb-10 lg:pt-25.5">
        <div className="flex flex-wrap items-end justify-between gap-4 py-6 lg:py-10">
          <div>
            <p className="eyebrow text-accent">Admin</p>
            <h1 className="font-serif text-[32px] leading-10 lg:text-5xl lg:leading-14">{title}</h1>
          </div>
          {action}
        </div>
        <nav aria-label="Admin sections" className="mb-6 flex gap-6 border-b border-line">
          {SECTIONS.map((s) => (
            <Link key={s.id} href={s.href} aria-current={s.id === active ? "page" : undefined}
              className={cn("-mb-px border-b-2 pb-3 text-[13px] font-semibold uppercase tracking-widest", s.id === active ? "border-black text-ink" : "border-transparent text-ink-subtle hover:text-ink")}>
              {s.label}
            </Link>
          ))}
        </nav>
        {children}
      </main>
      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
