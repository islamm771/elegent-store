import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { validateRegister } from "@/lib/validation";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const values = {
    name: String(body.name ?? "").trim(),
    email: String(body.email ?? "").trim().toLowerCase(),
    phone: String(body.phone ?? "").trim(),
    password: String(body.password ?? ""),
  };

  const errors = validateRegister(values);
  if (Object.keys(errors).length) return NextResponse.json({ error: "validation", fields: errors }, { status: 400 });

  try {
    await prisma.user.create({
      data: {
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        passwordHash: await hash(values.password, 12),
        newsletter: body.newsletter !== false,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "email_taken" }, { status: 409 });
    }
    console.error("register failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
