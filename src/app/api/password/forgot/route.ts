import { after, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import { RESET_COOLDOWN_MS, RESET_MAX_PER_HOUR, RESET_TTL_MS, hashToken, makeToken } from "@/lib/reset-token";
import { isEmail } from "@/lib/validation";

async function issueResetLink(email: string, origin: string) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true } });
  if (!user) return; // same silent outcome as a known address

  const now = Date.now();
  const recent = await prisma.passwordResetToken.findMany({ where: { userId: user.id, createdAt: { gt: new Date(now - 60 * 60 * 1000) } }, select: { createdAt: true } });
  if (recent.length >= RESET_MAX_PER_HOUR) return;
  if (recent.some((t) => now - t.createdAt.getTime() < RESET_COOLDOWN_MS)) return;

  // Older links stop working as soon as a new one is issued (rows are kept so the hourly limit still counts them).
  await prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } });
  const token = makeToken();
  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(now + RESET_TTL_MS) } });

  await sendPasswordResetEmail({ to: user.email, name: user.name, url: `${origin}/reset-password?token=${token}` });
  await prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: new Date(now - 24 * 60 * 60 * 1000) } } }); // tidy up old rows
}

/** POST /api/password/forgot { email } — always answers the same way, so it can't be used to find out who has an account. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!isEmail(email) || email.length > 254) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

  const origin = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || new URL(req.url).origin;
  // Everything else happens after the response, so the reply takes the same time for every address.
  after(async () => {
    try { await issueResetLink(email, origin); } catch (e) { console.error("password reset request failed", e); }
  });
  return NextResponse.json({ ok: true });
}
