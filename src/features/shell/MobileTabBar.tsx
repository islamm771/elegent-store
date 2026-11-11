"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, HeartIcon, HomeIcon, UserIcon } from "@/ui";
import { cn } from "@/lib/cn";
import { useStore } from "@/features/shop/store";

const tabs = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Shop", href: "/shop", icon: GridIcon },
  { label: "Wishlist", href: "/wishlist", icon: HeartIcon },
  { label: "Profile", href: "/account", icon: UserIcon },
];

export function MobileTabBar() {
  const path = usePathname();
  const { wishlist } = useStore();
  return (
    <nav aria-label="Tabs" className="fixed inset-x-0 bottom-0 z-40 bg-canvas/80 shadow-[0_-2px_12px_rgba(45,34,27,0.06)] backdrop-blur-md lg:hidden">
      <ul className="flex h-16 items-center justify-around px-4 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <li key={label}>
              <Link href={href} aria-current={active ? "page" : undefined}
                className={cn("flex h-12 min-w-14 flex-col items-center justify-center gap-0.5 eyebrow", active ? "text-black" : "text-ink-muted")}>
                <span className="relative">
                  <Icon width={17} height={17} strokeWidth={active ? 2.25 : 1.75} />
                  {href === "/wishlist" && wishlist.length > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 grid min-w-3.5 place-items-center rounded-pill bg-black px-1 text-[9px] font-bold leading-[14px] text-white">{wishlist.length}</span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
