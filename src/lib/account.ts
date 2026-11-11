import { isPhone } from "./validation";

export const SIZES = ["xs", "s", "m", "l", "xl"] as const;
export const MAX_ADDRESSES = 5;

export interface Measurements { bust: number | null; waist: number | null; hip: number | null; inseam: number | null; size: string }
export interface Address { id: string; label: string; line1: string; line2: string; city: string; postal: string; country: string; isDefault: boolean }
export type Result<T> = { value: T; error?: undefined } | { value?: undefined; error: string };

export const emptyMeasurements: Measurements = { bust: null, waist: null, hip: null, inseam: null, size: "" };

const obj = (v: unknown) => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Tolerant readers for data coming out of the database. */
export function parseMeasurements(v: unknown): Measurements {
  const o = obj(v);
  const num = (x: unknown) => (typeof x === "number" && Number.isFinite(x) ? x : null);
  return { bust: num(o.bust), waist: num(o.waist), hip: num(o.hip), inseam: num(o.inseam), size: (SIZES as readonly string[]).includes(str(o.size)) ? str(o.size) : "" };
}

export function parseAddresses(v: unknown): Address[] {
  if (!Array.isArray(v)) return [];
  return v.map((a) => {
    const o = obj(a);
    return { id: str(o.id), label: str(o.label), line1: str(o.line1), line2: str(o.line2), city: str(o.city), postal: str(o.postal), country: str(o.country), isDefault: o.isDefault === true };
  }).filter((a) => a.id && a.line1);
}

/** Strict validators for data coming from the browser. */
export function validateProfile(v: { name?: unknown; phone?: unknown }): Record<string, string> {
  const e: Record<string, string> = {};
  if (v.name !== undefined) {
    const n = str(v.name);
    if (n.length < 2) e.name = "Enter your full name.";
    else if (n.length > 80) e.name = "Name is too long.";
  }
  if (v.phone !== undefined && str(v.phone) && !isPhone(str(v.phone))) e.phone = "Enter a valid phone number.";
  return e;
}

export function validateMeasurements(v: unknown): Result<Measurements> {
  const o = obj(v);
  const out: Measurements = { ...emptyMeasurements };
  for (const k of ["bust", "waist", "hip", "inseam"] as const) {
    const raw = o[k];
    if (raw === null || raw === undefined || raw === "") continue;
    if (typeof raw !== "number" || !Number.isFinite(raw) || raw < 30 || raw > 250) return { error: `${k[0].toUpperCase()}${k.slice(1)} must be between 30 and 250 cm.` };
    out[k] = Math.round(raw * 10) / 10;
  }
  const size = str(o.size);
  if (size && !(SIZES as readonly string[]).includes(size)) return { error: "Choose a valid size." };
  out.size = size;
  return { value: out };
}

export function validateAddresses(v: unknown): Result<Address[]> {
  if (!Array.isArray(v)) return { error: "Invalid addresses." };
  if (v.length > MAX_ADDRESSES) return { error: `You can save up to ${MAX_ADDRESSES} addresses.` };
  const list: Address[] = [];
  for (const a of v) {
    const o = obj(a);
    const addr: Address = { id: str(o.id), label: str(o.label), line1: str(o.line1), line2: str(o.line2), city: str(o.city), postal: str(o.postal), country: str(o.country), isDefault: o.isDefault === true };
    if (!addr.id || addr.id.length > 64) return { error: "Invalid address." };
    if (!addr.label || !addr.line1 || !addr.city || !addr.country) return { error: "Label, street, city and country are required." };
    if (addr.label.length > 40 || addr.line1.length > 120 || addr.line2.length > 120 || addr.city.length > 60 || addr.postal.length > 20 || addr.country.length > 60) return { error: "One of the address fields is too long." };
    list.push(addr);
  }
  const first = list.findIndex((a) => a.isDefault);
  list.forEach((a, i) => { a.isDefault = i === (first === -1 ? 0 : first); }); // exactly one default
  return { value: list };
}
