import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseAddresses, parseMeasurements } from "@/lib/account";
import { AccountView } from "@/features/account/AccountView";
import { tabs, type AccountUser, type Tab } from "@/features/account/types";
import { MobileTabBar } from "@/features/shell/MobileTabBar";
import { SiteFooter } from "@/features/shell/SiteFooter";
import { SiteHeader } from "@/features/shell/SiteHeader";

export const metadata = { title: "My account — Elegent" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account");

  const { tab: raw } = await searchParams;
  const tab = (tabs as string[]).includes(raw ?? "") ? (raw as Tab) : "overview";

  let user: AccountUser | null = null;
  let dbDown = false;
  try {
    const u = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (u) user = { id: u.id, name: u.name, email: u.email, phone: u.phone ?? "", newsletter: u.newsletter, createdAt: u.createdAt.toISOString(), measurements: parseMeasurements(u.measurements), addresses: parseAddresses(u.addresses) };
  } catch (e) {
    console.error("account load failed", e);
    dbDown = true;
  }

  return (
    <>
      <SiteHeader user={session.user} />
      <main className="pb-24 pt-16 lg:pb-0 lg:pt-[102px]">
        <AccountView tab={tab} user={user} dbDown={dbDown} fallback={{ name: session.user.name ?? "", email: session.user.email ?? "" }} />
      </main>
      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
