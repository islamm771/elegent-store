import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const current = String(body?.current ?? "");
  const next = String(body?.next ?? "");
  if (next.length < 8) return NextResponse.json({ error: "weak_password" }, { status: 400 });
  if (next === current) return NextResponse.json({ error: "same_password" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { passwordHash: true } });
    if (!user || !(await compare(current, user.passwordHash))) return NextResponse.json({ error: "wrong_password" }, { status: 400 });
    await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash: await hash(next, 12) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("password change failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
