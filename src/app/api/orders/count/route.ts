import { NextResponse } from "next/server";
import { failure, sessionUserId, unauthorized } from "@/lib/bag";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** How many orders the signed-in user has — shown in the account menu. */
export async function GET() {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();
  try {
    return NextResponse.json({ count: await prisma.order.count({ where: { userId } }) });
  } catch (e) { return failure(e, "orders count"); }
}
