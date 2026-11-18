import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "./admin";
import { authOptions } from "./auth";

/** Guard for admin pages: signed-out → login, signed-in non-admin → 404 (the page's existence isn't revealed). Call it first, before reading any data. */
export async function adminPage(path: string) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/login?callbackUrl=${encodeURIComponent(path)}`);
  if (!(await isAdmin())) notFound();
  return session;
}
