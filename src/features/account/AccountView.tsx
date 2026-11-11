import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRightIcon, HeartIcon, LockIcon, PackageIcon, PinIcon, RulerIcon, UserIcon } from "@/ui";
import { cn } from "@/lib/cn";
import { SIZES } from "@/lib/account";
import { SignOutButton } from "./SignOutButton";
import { AddressesManager, PasswordForm, ProfileForm, SizingForm } from "./Forms";
import { Avatar, Card, StatPills } from "./Parts";
import { initials, memberSince, type AccountUser, type Tab } from "./types";

interface Props { tab: Tab; user: AccountUser | null; fallback: { name: string; email: string }; dbDown: boolean }

const href = (t: Tab) => (t === "overview" ? "/account" : `/account?tab=${t}`);
const titles: Record<Exclude<Tab, "overview">, string> = { profile: "Profile details", orders: "Order vault", sizing: "Sizing profile", addresses: "Saved addresses", security: "Security" };

function Unavailable({ dbDown }: { dbDown: boolean }) {
  return (
    <Card eyebrow="Heads up" title={dbDown ? "We couldn’t load your details" : "Profile editing isn’t available"}>
      <p className="text-[15px] leading-6 text-ink-muted">
        {dbDown ? "Something went wrong while loading your account. Please refresh the page in a moment." : "Your account was created with a social sign-in, so there are no saved profile details to edit here."}
      </p>
    </Card>
  );
}

function OrdersEmpty() {
  return (
    <Card eyebrow="Order vault" title="No orders yet">
      <div className="flex flex-col items-start gap-3">
        <span className="grid size-12 place-items-center rounded-pill bg-[#fed9b9]"><PackageIcon width={20} height={20} /></span>
        <p className="max-w-md text-[15px] leading-6 text-ink-muted">When you place an order, you’ll be able to follow its courier, download the invoice and reorder from here.</p>
        <Link href="/shop" className="rounded-field bg-black px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-cta hover:bg-ink">Browse the capsule</Link>
      </div>
    </Card>
  );
}

function SizingSummary({ user }: { user: AccountUser }) {
  const m = user.measurements;
  const cells = [["Bust", m.bust], ["Waist", m.waist], ["Hip", m.hip], ["Inseam", m.inseam]] as const;
  const any = cells.some(([, v]) => v) || m.size;
  return (
    <Card eyebrow="Master tailor metrics" title="Custom Sizing Capsule" action={<Link href={href("sizing")} className="label-caps text-accent underline underline-offset-2">Edit</Link>}>
      {any ? (
        <>
          <ul className="grid grid-cols-4 gap-2">
            {cells.map(([l, v]) => (
              <li key={l} className="flex flex-col items-center rounded-[4px] bg-white py-3 shadow-hairline">
                <span className="text-[10px] uppercase tracking-[0.05em] text-ink-subtle">{l}</span>
                <span className="text-lg font-semibold leading-[26px]">{v ?? "—"}{v ? <small className="pl-0.5 text-[13px] font-normal text-ink-subtle">cm</small> : null}</span>
              </li>
            ))}
          </ul>
          <p className="flex justify-between rounded-[2px] bg-field/60 px-2 py-1 text-[13px]"><span className="text-ink-muted">Default size</span><b>{m.size ? m.size.toUpperCase() : "Not set"}</b></p>
        </>
      ) : (
        <p className="text-[15px] leading-6 text-ink-muted">Save your measurements so we can pre-select the right size and tailor every piece before dispatch.</p>
      )}
    </Card>
  );
}

function AddressesSummary({ user }: { user: AccountUser }) {
  return (
    <Card eyebrow="Private residences" title="Saved Addresses" action={<Link href={href("addresses")} className="label-caps text-accent underline underline-offset-2">Manage</Link>}>
      {user.addresses.length === 0 ? (
        <p className="text-[15px] leading-6 text-ink-muted">No saved addresses yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {user.addresses.slice(0, 2).map((a) => (
            <li key={a.id} className="rounded-[4px] bg-white p-3 shadow-hairline">
              <p className="flex items-center justify-between text-base font-semibold leading-6">{a.label}{a.isDefault && <span className="rounded-[2px] bg-[#fed9b9] px-2 text-[9px] font-bold uppercase leading-5 text-[#795d44]">Default</span>}</p>
              <p className="text-[13px] leading-5 text-ink-muted">{a.line1}, {a.city}, {a.country}</p>
            </li>
          ))}
        </ul>
      )}
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

function MobileOverview({ user, name, email }: { user: AccountUser | null; name: string; email: string }) {
  const m = user?.measurements;
  return (
    <div className="flex flex-col gap-4 pt-4 lg:hidden">
      <div className="relative overflow-hidden rounded-[12px] bg-field p-4 shadow-hairline">
        <div className="flex items-center gap-4">
          <Avatar name={name} className="size-16 text-xl" />
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl font-semibold leading-8">{name}</h1>
            <p className="truncate text-[13px] leading-5 text-ink-muted">{email}</p>
            {user && <p className="mt-2 w-fit rounded-pill bg-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.05em] text-white">Member since {memberSince(user.createdAt)}</p>}
          </div>
        </div>
        <StatPills variant="mobile" />
      </div>

      <section className="flex flex-col gap-2 pt-3">
        <div className="flex items-center justify-between"><h2 className="font-serif text-xl leading-6">Curated Account</h2><span className="eyebrow text-accent">Bespoke suite</span></div>
        {user ? (
          <>
            <Row to={href("profile")} icon={UserIcon} title="Profile Details" text="Name, phone & preferences" />
            <Row to={href("orders")} icon={PackageIcon} title="Order History" text="Archived orders & returns" meta="0 orders" />
            <Row to={href("sizing")} icon={RulerIcon} title="Saved Measurements & Fit" text="Tailored sizing profile" meta={m?.size ? <span className="rounded-[6px] bg-line px-2 text-[11px] text-ink">{m.size.toUpperCase()}</span> : "Not set"} />
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
function DesktopBanner({ user, name, email }: { user: AccountUser | null; name: string; email: string }) {
  return (
    <section className="relative hidden items-center justify-between gap-8 overflow-hidden rounded-[8px] bg-surface p-12 shadow-hairline lg:flex">
      <div aria-hidden className="absolute -right-10 -top-12 size-72 rounded-pill bg-[rgba(254,217,185,0.3)] blur-[32px]" />
      <div className="relative flex items-center gap-7">
        <Avatar name={name} className="size-24 text-3xl shadow-[0_0_0_4px_#f5ede1,0_4px_6px_-1px_rgba(0,0,0,0.1)]" />
        <div className="flex flex-col gap-1">
          <p className="eyebrow text-accent">{user ? `Member · Client ID #EL-${user.id.slice(-4).toUpperCase()}` : "Member"}</p>
          <h1 className="font-serif text-5xl font-medium leading-[56px] tracking-[-0.025em]">{name}</h1>
          <p className="text-[13px] leading-5 text-ink-muted">{email}{user && <> · Patron since {memberSince(user.createdAt)}</>}</p>
        </div>
      </div>
      <div className="relative hidden max-w-sm rounded-[4px] bg-field p-4 xl:block">
        <p className="eyebrow pb-1 text-accent">Atelier privileges active</p>
        <p className="text-[13px] leading-[21px] text-ink-muted">Complimentary in-house alterations, white-glove courier handling and private salon styling sessions.</p>
      </div>
      <div className="relative"><StatPills variant="desktop" /></div>
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
      <p className="px-2 text-[10px] uppercase tracking-[0.1em] text-ink-subtle">Salon management</p>
      <nav aria-label="Account" className="flex flex-col gap-1">
        {items.map(({ id, label, icon: Icon, badge, to }) => {
          const on = id === tab;
          return (
            <Link key={id} href={to} aria-current={on ? "page" : undefined}
              className={cn("flex items-center justify-between rounded-[4px] px-2 py-2.5 text-[15px] font-semibold tracking-[0.02em]", on ? "bg-black text-white shadow-hairline" : "text-ink-muted hover:bg-field")}>
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

export function AccountView({ tab, user, fallback, dbDown }: Props) {
  const name = user?.name || fallback.name || "Member";
  const email = user?.email || fallback.email;

  let body: ReactNode;
  if (tab === "overview") {
    body = user ? (
      <div className="hidden flex-col gap-7 lg:flex">
        <OrdersEmpty />
        <div className="grid grid-cols-2 gap-7"><SizingSummary user={user} /><AddressesSummary user={user} /></div>
      </div>
    ) : <div className="hidden lg:block"><Unavailable dbDown={dbDown} /></div>;
  } else if (!user) {
    body = <Unavailable dbDown={dbDown} />;
  } else if (tab === "profile") {
    body = <Card eyebrow="Account" title="Profile details"><ProfileForm user={user} /></Card>;
  } else if (tab === "orders") {
    body = <OrdersEmpty />;
  } else if (tab === "sizing") {
    body = <Card eyebrow="Master tailor metrics" title="Custom Sizing Capsule"><p className="text-[13px] leading-5 text-ink-muted">Used to pre-select your size and to tailor off-the-rack pieces before dispatch.</p><SizingForm initial={user.measurements} /></Card>;
  } else if (tab === "addresses") {
    body = <Card eyebrow="Private residences" title="Saved Addresses"><AddressesManager initial={user.addresses} /></Card>;
  } else {
    body = <Card eyebrow="Account" title="Change password"><PasswordForm /></Card>;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-6 lg:py-7">
      <DesktopBanner user={user} name={name} email={email} />
      {tab === "overview" && <MobileOverview user={user} name={name} email={email} />}
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
