"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const FILTER_KEYS = ["cat", "color", "size", "material", "max", "oeko", "q", "dept"];

/** Shop filters live in the URL, so every state is shareable and the server renders the result. */
export function useQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const push = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(sp.toString());
    mutate(next);
    next.delete("page");
    const s = next.toString();
    start(() => router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false }));
  };
  const getList = (k: string) => sp.get(k)?.split(",").filter(Boolean) ?? [];
  const set = (k: string, v: string | null) => push((p) => (v ? p.set(k, v) : p.delete(k)));
  const toggle = (k: string, v: string) => push((p) => {
    const cur = p.get(k)?.split(",").filter(Boolean) ?? [];
    const nx = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    if (nx.length) p.set(k, nx.join(",")); else p.delete(k);
  });
  const clearAll = () => push((p) => FILTER_KEYS.forEach((k) => p.delete(k)));

  return { sp, pending, getList, set, toggle, clearAll, push };
}
