import type { Address, Measurements } from "@/lib/account";

export type Tab = "overview" | "profile" | "orders" | "sizing" | "addresses" | "security";
export const tabs: Tab[] = ["overview", "profile", "orders", "sizing", "addresses", "security"];

export interface AccountUser {
  id: string; name: string; email: string; phone: string; newsletter: boolean;
  createdAt: string; measurements: Measurements; addresses: Address[];
}

export const memberSince = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "E";
