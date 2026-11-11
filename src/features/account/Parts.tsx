"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useStore } from "@/features/shop/store";
import { initials } from "./types";

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span aria-hidden className={cn("grid shrink-0 place-items-center rounded-[12px] bg-sand font-serif font-semibold text-accent shadow-hairline", className)}>
      {initials(name)}
    </span>
  );
}

/** Orders / Wishlist / Bag counters. Wishlist and bag live in the browser, orders will come from the database. */
export function StatPills({ orders = 0, variant }: { orders?: number; variant: "mobile" | "desktop" }) {
  const { wishlist, count } = useStore();
  const items = [
    { label: "Orders", value: orders, href: "/account?tab=orders" },
    { label: "Wishlist", value: wishlist.length, href: "/wishlist" },
    { label: "Bag", value: count, href: "/cart" },
  ];
  return (
    <ul className={cn("flex", variant === "mobile" ? "gap-1 pt-1" : "gap-4")}>
      {items.map((s) => (
        <li key={s.label} className="flex-1">
          <Link href={s.href} className={cn("flex flex-col items-center justify-center", variant === "mobile" ? "rounded-[8px] bg-surface p-2.5" : "min-w-24 rounded-[4px] bg-white px-4 py-3 shadow-hairline")}>
            <span className={cn("font-semibold uppercase text-ink-muted", variant === "mobile" ? "text-[11px] tracking-[0.1em]" : "text-[10px] tracking-[0.05em] text-ink-subtle")}>{s.label}</span>
            <span className={cn("font-serif font-semibold", variant === "mobile" ? "pt-0.5 text-lg leading-[26px]" : "text-2xl leading-8")}>{s.value}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Card({ eyebrow, title, action, children, className }: { eyebrow?: string; title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4 rounded-[8px] bg-surface p-5 shadow-hairline lg:p-7", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow && <p className="eyebrow text-accent">{eyebrow}</p>}
          <h2 className="font-serif text-2xl font-semibold leading-8">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export const FieldMsg = ({ children }: { children: ReactNode }) => (
  <p role="alert" className="rounded-field bg-danger/10 px-3 py-2 text-[13px] text-danger">{children}</p>
);
