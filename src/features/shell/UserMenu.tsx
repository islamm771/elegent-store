"use client";
import { initials } from "@/features/account/types";
import { useStore } from "@/features/shop/store";
import { cn } from "@/lib/cn";
import { BadgeCheckIcon, BagIcon, ChevronDownIcon, GridIcon, HeartIcon, LogOutIcon, PackageIcon, RulerIcon, UserIcon } from "@/ui";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Count, GOLD, Item, itemClass } from "./UserMenuParts";
import { useDropdownMenu } from "./useDropdownMenu";
import { useOrderCount } from "./useOrderCount";

interface Props { user: { name?: string | null; email?: string | null }; admin?: boolean }

/** Signed-in account menu for the desktop header. Layout only: open/close in useDropdownMenu, the counter in useOrderCount. */
export function UserMenu({ user, admin }: Props) {
  const name = user.name?.trim() || "Account";
  const email = user.email ?? "";
  const first = name.split(/\s+/)[0];

  const { wishlist, count, ready } = useStore();
  const orders = useOrderCount();
  const { open, close, toggle, root, trigger, menuId, onMenuKey } = useDropdownMenu();

  const stats = [
    { label: "Orders", value: orders === null ? "–" : String(orders), href: "/account?tab=orders" },
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
        onClick={toggle}
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
            {admin && <Item href="/admin/orders" icon={GridIcon} label="Admin panel" onNavigate={() => close()} />}
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
