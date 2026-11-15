import { NextResponse } from "next/server";
import { bad, failure, sessionUserId, unauthorized } from "@/lib/bag";
import { cancelByUser } from "@/lib/orders";

/** Customer cancels their own order (before it ships). Answers { refunded, refundFailed }. */
export async function POST(_req: Request, { params }: { params: Promise<{ number: string }> }) {
  const userId = await sessionUserId();
  if (!userId) return unauthorized();
  const { number } = await params;
  try {
    const r = await cancelByUser(number, userId);
    if (!r.ok) return bad(r.reason, r.reason === "not_found" ? 404 : 409);
    return NextResponse.json({ refunded: r.refunded, refundFailed: r.refundFailed });
  } catch (e) { return failure(e, "order cancel"); }
}
