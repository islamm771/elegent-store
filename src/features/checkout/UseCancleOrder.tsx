"use client";
import { ApiError } from '@/lib/api/http';
import { ordersApi } from '@/services/orders';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const UseCancleOrder = () => {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function cancel(number: string) {
    setBusy(true); setMsg(null);
    try {
      await ordersApi.cancel(number);
      router.refresh();
      return;
    } catch (e) {
      setMsg(e instanceof ApiError && e.status === 409
        ? "This order can no longer be cancelled."
        : "Something went wrong. Please try again.");
    } finally {
      setBusy(false); setConfirm(false);
    }
  }
  return {
    busy,
    msg,
    confirm,
    setConfirm,
    cancel
  }
}
