import { UserIcon } from "@/ui";
import Link from "next/link";
import { SearchBar } from "../shop/Controls";
import { BagButton } from "./BagButton";
import LogoLink from "./LogoLink";
import { UserMenu } from "./UserMenu";
import { WishlistButton } from "./WishlistButton";

const nav = [
  { label: "Men", href: "/shop?dept=men" },
  { label: "Women", href: "/shop?dept=women" },
  { label: "Kids collection", href: "/shop?dept=kids" },
  { label: "Sale", href: "/shop?dept=sale" },
  { label: "Trends", href: "/shop?dept=trends" },
];

export function SiteHeader({ user }: { user?: { name?: string | null; email?: string | null } | null }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-canvas/90 shadow-[0_1px_8px_rgba(45,34,27,0.06)] backdrop-blur-md">
      <p className="eyebrow hidden bg-line/80 px-6 py-1 text-center text-ink-muted lg:block">
        Complimentary global express shipping on orders over $200 · Curated editorial drops
      </p>
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between border-b border-sand/60 px-6 lg:h-20 lg:border-0">
        <LogoLink />

        {user && (
          <div className="hidden lg:block w-full max-w-100">
            <SearchBar />
          </div>
        )}

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} className="text-[13px] font-semibold uppercase tracking-wider text-ink-muted transition-colors hover:text-black">{n.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 lg:gap-5">
          <WishlistButton />
          <BagButton />
          {/* mobile: profile bubble */}
          <Link href={user ? "/account" : "/login"} aria-label={user ? "My account" : "Sign in"} className="grid size-8 place-items-center rounded-pill bg-black text-white lg:hidden">
            <UserIcon width={13} height={13} />
          </Link>
          {/* desktop: text links */}
          <div className="hidden items-center gap-5 lg:flex">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link href="/login" className="text-[13px] font-semibold uppercase tracking-wider text-ink-muted hover:text-black">Login</Link>
                <Link href="/register" className="rounded-field bg-black px-5 py-2.5 text-[13px] font-semibold uppercase tracking-widest text-white shadow-cta hover:bg-ink">Signup</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
