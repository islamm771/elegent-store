"use client";
import { useStore } from "@/features/shop/store";
import { orderTotals, validateShipping, type PayMethod, type ShippingErrors, type ShippingInfo } from "@/lib/checkout";
import { checkoutApi } from "@/services/checkout";
import { useMemo, useState, type ChangeEvent } from "react";
import { describePlaceOrderError } from "./errors";
import type { CheckoutUser, Problem, StepIndex } from "./types";
import { fromAddress, subtotalCents } from "./utils";

/** All the state and behaviour of the checkout. The components only render what this returns. */
export function useCheckout(user: CheckoutUser, cancelled: boolean) {
  const { items, ready } = useStore();
  const defaultAddr = user.addresses.find((a) => a.isDefault) ?? user.addresses[0];

  const [step, setStep] = useState<StepIndex>(0);
  const [addrId, setAddrId] = useState<string>(defaultAddr?.id ?? "new");
  const [ship, setShip] = useState<ShippingInfo>(() => fromAddress(user, defaultAddr));
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [method, setMethod] = useState<PayMethod>("cod");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(
    cancelled ? { text: "Payment was cancelled — nothing was charged. You can try again or choose cash on delivery." } : null,
  );

  const totals = useMemo(() => orderTotals(subtotalCents(items)), [items]);

  /** onChange handler for one shipping field; clears that field's error. */
  const field = (k: keyof ShippingInfo) => (e: ChangeEvent<HTMLInputElement>) => {
    setShip((s) => ({ ...s, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  function goTo(i: StepIndex) { setProblem(null); setStep(i); }

  function pickAddress(id: string) {
    setAddrId(id); setErrors({});
    setShip(fromAddress(user, user.addresses.find((a) => a.id === id)));
  }

  function nextFromShipping() {
    const { value, errors: found } = validateShipping(ship);
    setErrors(found);
    if (Object.keys(found).length) return;
    setShip(value); goTo(1);
  }

  async function placeOrder() {
    setBusy(true); setProblem(null);
    try {
      const { redirect } = await checkoutApi.place(ship, method);
      window.location.assign(redirect); // full page load: the bag is empty / paid by now. Stay "busy" while leaving.
    } catch (e) {
      const failure = describePlaceOrderError(e);
      if (failure.redirect) { window.location.assign(failure.redirect); return; }
      if (failure.fieldErrors) { setErrors(failure.fieldErrors); setStep(0); }
      if (failure.problem) setProblem(failure.problem);
      setBusy(false);
    }
  }

  return { items, ready, totals, step, goTo, addrId, pickAddress, ship, errors, field, nextFromShipping, method, setMethod, online: method === "online", busy, problem, placeOrder };
}

export type CheckoutApi = ReturnType<typeof useCheckout>;
