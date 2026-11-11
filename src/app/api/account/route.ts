import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { validateAddresses, validateMeasurements, validateProfile } from "@/lib/account";

const bad = (error: string, fields?: Record<string, string>) => NextResponse.json({ error, fields }, { status: 400 });

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return bad("invalid_json");

  const data: Prisma.UserUpdateInput = {};

  const fields = validateProfile(body);
  if (Object.keys(fields).length) return bad("validation", fields);
  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.phone === "string") data.phone = body.phone.trim() || null;
  if (typeof body.newsletter === "boolean") data.newsletter = body.newsletter;

  if ("measurements" in body) {
    const r = validateMeasurements(body.measurements);
    if (r.error) return bad(r.error);
    data.measurements = r.value as unknown as Prisma.InputJsonValue;
  }
  if ("addresses" in body) {
    const r = validateAddresses(body.addresses);
    if (r.error) return bad(r.error);
    data.addresses = r.value as unknown as Prisma.InputJsonValue;
  }
  if (!Object.keys(data).length) return bad("nothing_to_update");

  try {
    await prisma.user.update({ where: { id: session.user.id }, data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return NextResponse.json({ error: "not_found" }, { status: 404 });
    console.error("account update failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
