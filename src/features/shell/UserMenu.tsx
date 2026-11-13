"use client";
import { initials } from "@/features/account/types";
import { useStore } from "@/features/shop/store";
import { cn } from "@/lib/cn";
import { BadgeCheckIcon, BagIcon, ChevronDownIcon, ChevronRightIcon, HeartIcon, LogOutIcon, PackageIcon, RulerIcon, UserIcon } from "@/ui";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ComponentType, type ReactNode, type SVGProps } from "react";

interface Props { user: { name?: string | null; email?: string | null } }
type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const GOLD = "text-[#C5A059]";
const itemClass = "flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left text-[13px] font-medium text-ink outline-none transition-colors hover:bg-sand/70 focus-visible:bg-sand/70 focus-visible:ring-2 focus-visible:ring-accent/40";

function Item({ href, icon: I, label, right, onNavigate }: { href: string; icon: Icon; label: string; right?: ReactNode; onNavigate: () => void }) {
  return (
    <li role="none">
      <Link href={href} role="menuitem" onClick={onNavigate} className={itemClass}>
        <I width={16} height={16} className="shrink-0 text-ink-muted" />
        <span className="flex-1">{label}</span>
        {right ?? <ChevronRightIcon width={14} height={14} className="text-ink-subtle" />}
      </Link>
    </li>
  );
}

const Count = ({ n }: { n: number }) => (
  <span className="rounded-sm bg-sand px-2 py-0.5 text-[11px] font-semibold text-accent">{n}</span>
);

/** Signed-in account menu for the desktop header. Name/email come from the session; counters from the user's bag + wishlist. */
export function UserMenu({ user }: Props) {
  const name = user.name?.trim() || "Account";
  const email = user.email ?? "";
  const first = name.split(/\s+/)[0];

  const { wishlist, count, ready } = useStore();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const path = usePathname();

  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  }, []);

  // close after any navigation
  useEffect(() => setOpen(false), [path]);

  // outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(true); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open, close]);

  // arrow keys move between items
  function onMenuKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next].focus();
  }

  const stats = [
    { label: "Orders", value: "0", href: "/account?tab=orders" }, // checkout/orders aren't built yet
    { label: "Wishlist", value: ready ? String(wishlist.length) : "–", href: "/wishlist" },
    { label: "Bag", value: ready ? String(count) : "–", href: "/cart" },
  ];

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        className="flex h-12.5 items-center rounded-4xl border border-accent/20 bg-sand p-3 pr-4 text-xs font-bold leading-4 text-[#2D221B] transition-colors duration-300 hover:bg-[#E0D3C1]"
      >
        <span aria-hidden className={cn("mr-2 grid size-8 place-items-center rounded-full border border-accent bg-ink text-sm font-semibold leading-5", GOLD)}>{initials(name)}</span>
        {first}
        <ChevronDownIcon aria-hidden className={cn("ml-2 inline-block size-4 text-ink-subtle transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account menu"
          onKeyDown={onMenuKey}
          className="absolute right-0 top-full z-50 mt-3 w-85 rounded-3xl border border-accent/10 bg-canvas p-4 shadow-[0_24px_48px_-12px_rgba(45,34,27,0.25)]"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-ink p-4">
            <span aria-hidden className={cn("grid size-12 shrink-0 place-items-center rounded-full bg-white/10 font-serif text-lg font-semibold", GOLD)}>{initials(name)}</span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-serif text-lg font-semibold leading-6 text-canvas">
                <span className="truncate">{name}</span>
                <BadgeCheckIcon width={16} height={16} className={cn("shrink-0", GOLD)} aria-label="Verified account" />
              </p>
              {email && <p className="truncate text-xs leading-4 text-canvas/60">{email}</p>}
            </div>
          </div>

          <ul role="none" className="mt-3 grid grid-cols-3 divide-x divide-accent/15 rounded-[12px] bg-sand/70 py-3">
            {stats.map((s) => (
              <li key={s.label} role="none" className="px-1 text-center">
                <Link href={s.href} role="menuitem" onClick={() => close()} className="flex flex-col items-center gap-0.5 rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
                  <span className="eyebrow text-[10px] text-ink-subtle">{s.label}</span>
                  <span className="font-serif text-lg font-semibold leading-6">{s.value}</span>
                </Link>
              </li>
            ))}
          </ul>

          <ul role="none" className="mt-3 flex flex-col">
            <Item href="/account" icon={UserIcon} label="Profile & account overview" onNavigate={() => close()} />
            <Item href="/account?tab=orders" icon={PackageIcon} label="Order vault & shipments" onNavigate={() => close()} />
            <Item href="/account?tab=sizing" icon={RulerIcon} label="Sizing profile" onNavigate={() => close()} />
            <Item href="/wishlist" icon={HeartIcon} label="Wishlist" right={ready && wishlist.length > 0 ? <Count n={wishlist.length} /> : undefined} onNavigate={() => close()} />
            <Item href="/cart" icon={BagIcon} label="Shopping bag" right={ready && count > 0 ? <Count n={count} /> : undefined} onNavigate={() => close()} />
          </ul>

          <div className="mt-2 border-t border-line pt-2">
            <button type="button" role="menuitem" onClick={() => signOut({ callbackUrl: "/" })} className={cn(itemClass, "font-semibold text-danger")}>
              <LogOutIcon width={16} height={16} className="shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
