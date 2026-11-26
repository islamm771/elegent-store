import { http } from "@/lib/api/http";
import type { NextStatus } from "@/types";

export const ordersApi = {
  cancel: (number: string) =>
    http<{ refunded: boolean; refundFailed: boolean }>(
      `/api/orders/${encodeURIComponent(number)}/cancel`,
      { method: "POST" },
    ),

  setStatus: (number: string, status: NextStatus) =>
    http<{ number: string; status: string }>(
      `/api/admin/orders/${encodeURIComponent(number)}`,
      { method: "PATCH", json: { status } },
    ),

  count: () => http<{ count: number }>("/api/orders/count", { cache: "no-store" }),
};