import { href } from "@/lib/account";
import { cn } from "@/lib/cn";
import { ChevronRightIcon, HeartIcon, LockIcon, PackageIcon, PinIcon, RulerIcon, UserIcon } from "@/ui";
import Link from "next/link";
import type { ReactNode } from "react";
import AddressesSummary from "./AddressesSummary";
import { AddressesManager, PasswordForm, ProfileForm, SizingForm } from "./Forms";
import OrdersCard from "./OrdersCard";
import { Avatar, Card, StatPills } from "./Parts";
import { SignOutButton } from "./SignOutButton";
import SizingProfile from "./SizingProfile";
import { memberSince, type AccountUser, type OrderSummary, type Tab } from "./types";

interface Props { tab: Tab; user: AccountUser | null; fallback: { name: string; email: string }; dbDown: boolean; orders: OrderSummary[] }

function Unavailable({ dbDown }: { dbDown: boolean }) {
  return (
    <Card eyebrow="Heads up" title={dbDown ? "We couldn’t load your details" : "Profile editing isn’t available"}>
      <p className="text-[15px] leading-6 text-ink-muted">
        {dbDown ? "Something went wrong while loading your account. Please refresh the page in a moment." : "Your account was created with a social sign-in, so there are no saved profile details to edit here."}
      </p>
    </Card>
  );
}

/* ---------- mobile overview list ---------- */
function Row({ to, icon: Icon, title, text, meta }: { to: string; icon: typeof UserIcon; title: string; text: string; meta?: ReactNode }) {
  return (
    <Link href={to} className="flex items-center justify-between gap-3 rounded-[8px] bg-field p-3.5">
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-surface"><Icon width={16} height={16} /></span>
        <span className="min-w-0"><span className="block truncate text-base font-semibold leading-6">{title}</span><span className="block truncate text-[13px] leading-5 text-ink-muted">{text}</span></span>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-[13px] text-ink-muted">{meta}<ChevronRightIcon width={12} height={12} /></span>
    </Link>
  );
}

function MobileOverview({ user, name, email, orderCount }: { user: AccountUser | null; name: string; email: string; orderCount: number }) {
  const m = user?.measurements;
  return (
    <div className="flex flex-col gap-4 pt-4 lg:hidden">
      <div className="relative overflow-hidden rounded-[12px] bg-field p-4 shadow-hairline">
        <div className="flex items-center gap-4">
          <Avatar name={name} className="size-16 text-xl" />
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl font-semibold leading-8">{name}</h1>
            <p className="truncate text-[13px] leading-5 text-ink-muted">{email}</p>
            {user && <p className="mt-2 w-fit rounded-pill bg-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase leading-3.5 tracking-wider text-white">Member since {memberSince(user.createdAt)}</p>}
          </div>
        </div>
        <StatPills variant="mobile" orders={orderCount} />
      </div>

      <section className="flex flex-col gap-2 pt-3">
        <div className="flex items-center justify-between"><h2 className="font-serif text-xl leading-6">Curated Account</h2><span className="eyebrow text-accent">Bespoke suite</span></div>
        {user ? (
          <>
            <Row to={href("profile")} icon={UserIcon} title="Profile Details" text="Name, phone & preferences" />
            <Row to={href("orders")} icon={PackageIcon} title="Order History" text="Archived orders & returns" meta={`${orderCount} order${orderCount === 1 ? "" : "s"}`} />
            <Row to={href("sizing")} icon={RulerIcon} title="Saved Measurements & Fit" text="Tailored sizing profile" meta={m?.size ? <span className="rounded-md bg-line px-2 text-[11px] text-ink">{m.size.toUpperCase()}</span> : "Not set"} />
            <Row to="/wishlist" icon={HeartIcon} title="My Wardrobe & Wishlist" text="Saved edits for future seasons" />
            <Row to={href("addresses")} icon={PinIcon} title="Shipping Addresses" text="Where we deliver" meta={`${user.addresses.length} saved`} />
            <Row to={href("security")} icon={LockIcon} title="Account Security" text="Change your password" />
          </>
        ) : <Unavailable dbDown={false} />}
      </section>

      <SignOutButton />
      <div className="flex flex-col items-center gap-0.5 pt-2 opacity-70">
        <p className="font-serif text-[15px] font-bold tracking-[3.75px]">ELEGENT ATELIER</p>
        <p className="text-xs text-ink-muted">Private members’ account</p>
      </div>
    </div>
  );
}

/* ---------- desktop banner + sidebar ---------- */
function DesktopBanner({ user, name, email, orderCount }: { user: AccountUser | null; name: string; email: string; orderCount: number }) {
  return (
    <section className="relative hidden items-center justify-between gap-8 overflow-hidden rounded-[8px] bg-surface p-12 shadow-hairline lg:flex">
      <div aria-hidden className="absolute -right-10 -top-12 size-72 rounded-pill bg-[rgba(254,217,185,0.3)] blur-[32px]" />
      <div className="relative flex items-center gap-7">
        <Avatar name={name} className="size-24 text-3xl shadow-[0_0_0_4px_#f5ede1,0_4px_6px_-1px_rgba(0,0,0,0.1)]" />
        <div className="flex flex-col gap-1">
          <p className="eyebrow text-accent">{user ? `Member · Client ID #EL-${user.id.slice(-4).toUpperCase()}` : "Member"}</p>
          <h1 className="font-serif text-5xl font-medium leading-14 tracking-tight">{name}</h1>
          <p className="text-[13px] leading-5 text-ink-muted">{email}{user && <> · Patron since {memberSince(user.createdAt)}</>}</p>
        </div>
      </div>
      <div className="relative hidden max-w-sm rounded-sm bg-field p-4 xl:block">
        <p className="eyebrow pb-1 text-accent">Atelier privileges active</p>
        <p className="text-[13px] leading-5.25 text-ink-muted">Complimentary in-house alterations, white-glove courier handling and private salon styling sessions.</p>
      </div>
      <div className="relative"><StatPills variant="desktop" orders={orderCount} /></div>
    </section>
  );
}

function Sidebar({ tab, user }: { tab: Tab; user: AccountUser | null }) {
  const items: Array<{ id: Tab | "wishlist"; label: string; icon: typeof UserIcon; badge?: string; to: string }> = [
    { id: "overview", label: "Account Overview", icon: UserIcon, to: href("overview") },
    { id: "profile", label: "Profile Details", icon: UserIcon, to: href("profile") },
    { id: "orders", label: "Order Vault", icon: PackageIcon, to: href("orders") },
    { id: "sizing", label: "Sizing Profile", icon: RulerIcon, to: href("sizing") },
    { id: "addresses", label: "Saved Addresses", icon: PinIcon, badge: user ? String(user.addresses.length) : undefined, to: href("addresses") },
    { id: "security", label: "Security & Password", icon: LockIcon, to: href("security") },
    { id: "wishlist", label: "Wardrobe & Lookbook", icon: HeartIcon, to: "/wishlist" },
  ];
  return (
    <div className="flex flex-col gap-4 rounded-[8px] bg-surface p-4 shadow-hairline">
      <p className="px-2 text-[10px] uppercase tracking-widest text-ink-subtle">Salon management</p>
      <nav aria-label="Account" className="flex flex-col gap-1">
        {items.map(({ id, label, icon: Icon, badge, to }) => {
          const on = id === tab;
          return (
            <Link key={id} href={to} aria-current={on ? "page" : undefined}
              className={cn("flex items-center justify-between rounded-sm px-2 py-2.5 text-[15px] font-semibold tracking-[0.02em]", on ? "bg-black text-white shadow-hairline" : "text-ink-muted hover:bg-field")}>
              <span className="flex items-center gap-2"><Icon width={15} height={15} />{label}</span>
              {badge && <span className="rounded-pill bg-[#fed9b9] px-2 text-[10px] font-bold text-[#795d44]">{badge}</span>}
            </Link>
          );
        })}
      </nav>
      <SignOutButton />
    </div>
  );
}

export function AccountView({ tab, user, fallback, dbDown, orders }: Props) {
  const name = user?.name || fallback.name || "Member";
  const email = user?.email || fallback.email;

  let body: ReactNode;
  if (tab === "overview") {
    body = user ? (
      <div className="hidden flex-col gap-7 lg:flex">
        <OrdersCard orders={orders.slice(0, 3)} />
        <div className="grid grid-cols-2 gap-7">
          <SizingProfile user={user} />
          <AddressesSummary user={user} />
        </div>
      </div>
    ) : <div className="hidden lg:block"><Unavailable dbDown={dbDown} /></div>;
  } else if (!user) {
    body = <Unavailable dbDown={dbDown} />;
  } else if (tab === "profile") {
    body = <Card eyebrow="Account" title="Profile details"><ProfileForm user={user} /></Card>;
  } else if (tab === "orders") {
    body = <OrdersCard orders={orders} />;
  } else if (tab === "sizing") {
    body = <Card eyebrow="Master tailor metrics" title="Custom Sizing Capsule"><p className="text-[13px] leading-5 text-ink-muted">Used to pre-select your size and to tailor off-the-rack pieces before dispatch.</p><SizingForm initial={user.measurements} /></Card>;
  } else if (tab === "addresses") {
    body = <Card eyebrow="Private residences" title="Saved Addresses"><AddressesManager initial={user.addresses} /></Card>;
  } else {
    body = <Card eyebrow="Account" title="Change password"><PasswordForm /></Card>;
  }

  return (
    <div className="mx-auto max-w-360 px-4 lg:px-6 lg:py-7">
      <DesktopBanner user={user} name={name} email={email} orderCount={orders.length} />
      {tab === "overview" && <MobileOverview user={user} name={name} email={email} orderCount={orders.length} />}
      <div className="lg:mt-7 lg:grid lg:grid-cols-12 lg:gap-7">
        <aside className="hidden lg:col-span-3 lg:block"><Sidebar tab={tab} user={user} /></aside>
        <div className="flex flex-col gap-4 pt-4 lg:col-span-9 lg:pt-0">
          {tab !== "overview" && (
            <Link href="/account" className="label-caps flex items-center gap-1 text-accent lg:hidden"><ChevronRightIcon width={11} height={11} className="rotate-180" /> Account</Link>
          )}
          {body}
        </div>
      </div>
    </div>
  );
}
