import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashToken, looksLikeToken } from "@/lib/reset-token";

const invalid = () => NextResponse.json({ error: "invalid_token" }, { status: 400 });

/** POST /api/password/reset { token, password } */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = body?.token;
  const password = String(body?.password ?? "");
  if (!looksLikeToken(token)) return invalid();
  if (password.length < 8 || password.length > 200) return NextResponse.json({ error: "weak_password" }, { status: 400 });

  try {
    const passwordHash = await hash(password, 12);
    const ok = await prisma.$transaction(async (tx) => {
      // Claim the token first: the conditional update lets exactly one request win, even if two arrive together.
      const claimed = await tx.passwordResetToken.updateMany({
        where: { tokenHash: hashToken(token), usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (claimed.count !== 1) return false;
      const rec = await tx.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) }, select: { userId: true } });
      if (!rec) return false;
      await tx.user.update({ where: { id: rec.userId }, data: { passwordHash } });
      await tx.passwordResetToken.updateMany({ where: { userId: rec.userId, usedAt: null }, data: { usedAt: new Date() } }); // any other open links
      return true;
    });
    return ok ? NextResponse.json({ ok: true }) : invalid();
  } catch (e) {
    console.error("password reset failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
