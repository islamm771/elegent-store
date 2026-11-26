"use client";
import { ordersApi } from "@/services/orders";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** The signed-in user's number of orders (null until it arrives). Re-read after every navigation, e.g. right after placing one. */
export function useOrderCount(): number | null {
  const path = usePathname();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false; // ignore a late answer after we left the page
    ordersApi.count()
      .then((r) => { if (!cancelled) setCount(r.count); })
      .catch(() => { /* a failed counter just keeps showing "–" */ });
    return () => { cancelled = true; };
  }, [path]);

  return count;
}
