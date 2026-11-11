"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Button, Checkbox, PlusIcon, StrengthMeter, TextField } from "@/ui";
import { cn } from "@/lib/cn";
import { MAX_ADDRESSES, SIZES, validateProfile, type Address, type Measurements } from "@/lib/account";
import { FieldMsg } from "./Parts";
import type { AccountUser } from "./types";

async function send(url: string, method: "PATCH" | "POST", body: unknown) {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json } as { ok: boolean; status: number; json: { error?: string; fields?: Record<string, string> } };
}

/* ---------------- profile ---------------- */
export function ProfileForm({ user }: { user: AccountUser }) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [newsletter, setNewsletter] = useState(user.newsletter);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateProfile({ name, phone });
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      const r = await send("/api/account", "PATCH", { name, phone, newsletter });
      if (!r.ok) return setErrors(r.json.fields ?? { form: "Could not save your changes. Please try again." });
      await update({ name: name.trim() });
      toast.success("Profile updated");
      router.refresh();
    } catch { setErrors({ form: "Something went wrong. Please try again." }); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 lg:gap-5">
      {errors.form && <FieldMsg>{errors.form}</FieldMsg>}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <TextField label="Full name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <TextField label="Email address" type="email" value={user.email} readOnly aria-readonly className="text-ink-muted" aside={<span className="text-[11px] font-semibold lowercase text-ink-subtle">cannot be changed</span>} />
        <TextField label="Phone number" type="tel" name="phone" autoComplete="tel" placeholder="+1 (555) 019-2834" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone}
          aside={<span className="text-[11px] font-semibold lowercase text-ink-subtle">optional</span>} />
      </div>
      <Checkbox checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)}>Send me editorial drops, private invitations and seasonal previews.</Checkbox>
      <div className="lg:max-w-xs"><Button type="submit" loading={saving}>Save changes</Button></div>
    </form>
  );
}

/* ---------------- sizing ---------------- */
const metrics = [["bust", "Bust"], ["waist", "Waist"], ["hip", "Hip"], ["inseam", "Inseam"]] as const;
const inches = (cm: number | null) => (cm ? `${(cm / 2.54).toFixed(1)} in` : "");

export function SizingForm({ initial }: { initial: Measurements }) {
  const router = useRouter();
  const [m, setM] = useState({ bust: initial.bust?.toString() ?? "", waist: initial.waist?.toString() ?? "", hip: initial.hip?.toString() ?? "", inseam: initial.inseam?.toString() ?? "" });
  const [size, setSize] = useState(initial.size);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const num = (v: string) => (v.trim() === "" ? null : Number(v));
    const measurements = { bust: num(m.bust), waist: num(m.waist), hip: num(m.hip), inseam: num(m.inseam), size };
    setError(""); setSaving(true);
    try {
      const r = await send("/api/account", "PATCH", { measurements });
      if (!r.ok) return setError(r.json.error && r.json.error !== "server" ? r.json.error : "Could not save your sizing profile.");
      toast.success("Sizing profile saved");
      router.refresh();
    } catch { setError("Something went wrong. Please try again."); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {error && <FieldMsg>{error}</FieldMsg>}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map(([k, label]) => (
          <div key={k} className="flex flex-col gap-1">
            <TextField label={label} type="number" inputMode="decimal" min={30} max={250} step="0.5" placeholder="—" value={m[k]}
              onChange={(e) => setM((s) => ({ ...s, [k]: e.target.value }))} trailing={<span className="text-[13px]">cm</span>} />
            <p className="h-4 px-1 text-[11px] text-ink-subtle">{inches(Number(m[k]) || null)}</p>
          </div>
        ))}
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="label-caps pb-2 text-ink-muted lg:text-[13px] lg:text-ink">Default ready-to-wear size</legend>
        <div className="flex gap-2">
          {SIZES.map((s) => (
            <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(size === s ? "" : s)}
              className={cn("h-11 flex-1 rounded-[2px] text-[13px] font-semibold uppercase tracking-[0.05em]", size === s ? "bg-black text-white shadow-cta" : "bg-field text-ink hover:bg-line")}>{s}</button>
          ))}
        </div>
      </fieldset>
      <div className="lg:max-w-xs"><Button type="submit" loading={saving}>Save sizing profile</Button></div>
    </form>
  );
}

/* ---------------- addresses ---------------- */
const blank = { label: "", line1: "", line2: "", city: "", postal: "", country: "" };

export function AddressesManager({ initial }: { initial: Address[] }) {
  const router = useRouter();
  const [list, setList] = useState<Address[]>(initial);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(blank);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function persist(next: Address[], success: string) {
    setBusy(true); setError("");
    try {
      const r = await send("/api/account", "PATCH", { addresses: next });
      if (!r.ok) { setError(r.json.error && r.json.error !== "server" ? r.json.error : "Could not save your addresses."); return false; }
      setList(next.some((a) => a.isDefault) || !next.length ? next : next.map((a, i) => ({ ...a, isDefault: i === 0 })));
      toast.success(success); router.refresh(); return true;
    } catch { setError("Something went wrong. Please try again."); return false; } finally { setBusy(false); }
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    const missing = (["label", "line1", "city", "country"] as const).find((k) => !draft[k].trim());
    if (missing) return setError("Label, street, city and country are required.");
    const ok = await persist([...list, { ...draft, id: crypto.randomUUID(), isDefault: list.length === 0 }], "Address saved");
    if (ok) { setDraft(blank); setAdding(false); }
  }

  const set = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement>) => setDraft((d) => ({ ...d, [k]: e.target.value }));

  return (
    <div className="flex flex-col gap-3">
      {error && <FieldMsg>{error}</FieldMsg>}
      {list.length === 0 && !adding && <p className="text-[15px] leading-6 text-ink-muted">No saved addresses yet.</p>}
      <ul className="flex flex-col gap-2">
        {list.map((a) => (
          <li key={a.id} className="flex flex-col gap-1 rounded-[4px] bg-white p-3 shadow-hairline">
            <div className="flex items-center justify-between gap-2">
              <p className="text-base font-semibold leading-6">{a.label}</p>
              {a.isDefault && <span className="rounded-[2px] bg-[#fed9b9] px-2 py-0.5 text-[9px] font-bold uppercase leading-5 text-[#795d44]">Default</span>}
            </div>
            <p className="text-[13px] leading-5 text-ink-muted">{[a.line1, a.line2].filter(Boolean).join(", ")}<br />{[a.postal, a.city].filter(Boolean).join(" ")}, {a.country}</p>
            <div className="flex gap-4 pt-1 text-[11px] font-semibold uppercase tracking-[0.05em]">
              {!a.isDefault && <button type="button" disabled={busy} onClick={() => persist(list.map((x) => ({ ...x, isDefault: x.id === a.id })), "Default address updated")} className="text-accent underline underline-offset-2">Set as default</button>}
              <button type="button" disabled={busy} onClick={() => persist(list.filter((x) => x.id !== a.id), "Address removed")} className="text-ink-muted underline underline-offset-2">Remove</button>
            </div>
          </li>
        ))}
      </ul>

      {adding ? (
        <form onSubmit={add} noValidate className="flex flex-col gap-3 rounded-[4px] bg-field p-4">
          <TextField label="Label" placeholder="Home, Studio…" value={draft.label} onChange={set("label")} />
          <TextField label="Street address" autoComplete="address-line1" value={draft.line1} onChange={set("line1")} />
          <TextField label="Apartment, floor, etc." autoComplete="address-line2" value={draft.line2} onChange={set("line2")} aside={<span className="text-[11px] font-semibold lowercase text-ink-subtle">optional</span>} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="City" autoComplete="address-level2" value={draft.city} onChange={set("city")} />
            <TextField label="Postal code" autoComplete="postal-code" value={draft.postal} onChange={set("postal")} />
          </div>
          <TextField label="Country" autoComplete="country-name" value={draft.country} onChange={set("country")} />
          <div className="flex gap-2 pt-1">
            <Button type="submit" loading={busy}>Save address</Button>
            <Button type="button" variant="social" onClick={() => { setAdding(false); setDraft(blank); setError(""); }}>Cancel</Button>
          </div>
        </form>
      ) : list.length < MAX_ADDRESSES ? (
        <button type="button" onClick={() => setAdding(true)} className="flex items-center justify-center gap-2 rounded-field bg-field py-3 text-[11px] font-semibold uppercase tracking-[0.05em] hover:bg-line">
          <PlusIcon width={12} height={12} strokeWidth={2.5} /> Add an address
        </button>
      ) : (
        <p className="text-[13px] text-ink-muted">You’ve reached the limit of {MAX_ADDRESSES} saved addresses.</p>
      )}
    </div>
  );
}

/* ---------------- password ---------------- */
export function PasswordForm() {
  const [v, setV] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (!v.current) found.current = "Enter your current password.";
    if (v.next.length < 8) found.next = "Use at least 8 characters.";
    else if (v.next === v.current) found.next = "Choose a password different from the current one.";
    if (v.confirm !== v.next) found.confirm = "Passwords don’t match.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const r = await send("/api/account/password", "POST", { current: v.current, next: v.next });
      if (r.ok) { toast.success("Password updated"); setV({ current: "", next: "", confirm: "" }); return; }
      setErrors(r.json.error === "wrong_password" ? { current: "That password is incorrect." } : { form: "Could not update your password. Please try again." });
    } catch { setErrors({ form: "Something went wrong. Please try again." }); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 lg:max-w-md">
      {errors.form && <FieldMsg>{errors.form}</FieldMsg>}
      <TextField label="Current password" type="password" autoComplete="current-password" value={v.current} onChange={set("current")} error={errors.current} />
      <div>
        <TextField label="New password" type="password" autoComplete="new-password" value={v.next} onChange={set("next")} error={errors.next} />
        <StrengthMeter password={v.next} />
      </div>
      <TextField label="Confirm new password" type="password" autoComplete="new-password" value={v.confirm} onChange={set("confirm")} error={errors.confirm} />
      <Button type="submit" loading={saving}>Update password</Button>
    </form>
  );
}
