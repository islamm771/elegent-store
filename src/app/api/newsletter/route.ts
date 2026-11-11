import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isEmail } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

  try {
    await prisma.subscriber.upsert({ where: { email }, update: {}, create: { email } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("newsletter failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
