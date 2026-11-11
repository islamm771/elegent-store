import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/** Admins are the emails listed in ADMIN_EMAILS (comma separated). No schema change needed. */
const adminEmails = () => (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  return Boolean(email && adminEmails().includes(email));
}

/** Returns an error response to send back, or null when the caller is an admin. */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const email = session.user.email?.toLowerCase();
  if (!email || !adminEmails().includes(email)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return null;
}
