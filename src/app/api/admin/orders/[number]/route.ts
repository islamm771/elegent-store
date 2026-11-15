import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { bad } from "@/lib/bag";
import { prisma } from "@/lib/db";

const FLOW = ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] as const;
type Step = (typeof FLOW)[number];

/**
 * Admin only (emails in ADMIN_EMAILS): move an order forward. Body: { status: "PACKED" | "SHIPPED" | "DELIVERED" }
 * e.g.  curl -X PATCH /api/admin/orders/EL-XXXXXXXX -H 'content-type: application/json' -d '{"status":"SHIPPED"}'   (with your admin session cookie)
 * Only forward moves are allowed. Marking a cash-on-delivery order DELIVERED also marks it as paid (the courier collected the cash).
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ number: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { number } = await params;
  const body = (await req.json().catch(() => null)) as { status?: unknown } | null;
  const next = FLOW.find((s) => s === body?.status);
  if (!next) return bad("invalid_status");

  const order = await prisma.order.findUnique({ where: { number } });
  if (!order) return bad("not_found", 404);
  const from = FLOW.indexOf(order.status as Step);
  if (from === -1 || FLOW.indexOf(next) <= from) return bad("invalid_transition", 409); // pending / cancelled / backwards

  const paid = next === "DELIVERED" && order.paymentMethod === "COD";
  const { count } = await prisma.order.updateMany({
    where: { id: order.id, status: order.status }, // fails if someone changed it meanwhile
    data: { status: next, ...(paid ? { paymentStatus: "PAID", paidAt: new Date() } : {}) },
  });
  if (count !== 1) return bad("conflict", 409);
  return NextResponse.json({ number, status: next });
}
