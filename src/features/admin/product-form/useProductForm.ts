"use client";
import { ApiError, errorText } from "@/lib/api/http";
import { productsApi } from "@/services/products";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import type { FieldErrors, ProductFormValues } from "./types";
import { hasErrors, parseImages, slugify, toProductBody, validateProduct } from "./validation";

type Msg = { ok: boolean; text: string } | null;

/** All the state and behaviour of the form. The components only render what this returns. */
export function useProductForm(initial: ProductFormValues, editing: boolean) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(editing); // once the admin edits the slug by hand, stop generating it from the name
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  /** Sets one field and clears its error. */
  const set = <K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };
  /** onChange handler for plain inputs / textareas / selects holding a string. */
  const text = (k: keyof ProductFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(k, e.target.value as never);
  const toggle = (k: "departments" | "colors" | "sizes", id: string) => set(k, v[k].includes(id) ? v[k].filter((x) => x !== id) : [...v[k], id]);

  const setName = (name: string) => {
    set("name", name);
    if (!slugTouched) setV((s) => ({ ...s, name, slug: slugify(name) }));
  };
  const setSlug = (slug: string) => { setSlugTouched(true); set("slug", slug.toLowerCase()); };

  async function submit(ev: React.FormEvent) {
    ev.preventDefault(); setMsg(null);
    const found = validateProduct(v);
    setErrors(found);
    if (hasErrors(found)) { setMsg({ ok: false, text: "Please fix the highlighted fields." }); return; }

    setBusy(true);
    try {
      const body = toProductBody(v, editing);
      if (editing) {
        await productsApi.update(v.slug, body);
        setMsg({ ok: true, text: "Saved." });
        router.refresh();
        setBusy(false);
      } else {
        await productsApi.create(body);
        router.push(`/admin/products?created=${v.slug}`); // stay "busy" while navigating so it can't be submitted twice
      }
    } catch (e) {
      // field errors come back with 400 (validation) AND 409 (slug already used) → look for the fields, not the status
      if (e instanceof ApiError && e.data?.fields) {
        setErrors(e.data.fields);
        setMsg({ ok: false, text: "Some fields were rejected — see below." });
      } else {
        setMsg({ ok: false, text: errorText(e, { 403: "You're not allowed to do that." }, "Something went wrong. Please try again.") });
      }
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete “${v.name}” permanently?\n\nIt will also disappear from bags and wishlists. To just take it off the shop, untick “Visible in the shop” instead.`)) return;
    setBusy(true);
    try {
      await productsApi.remove(v.slug);
      router.push("/admin/products");
    } catch {
      setMsg({ ok: false, text: "Couldn't delete the product." });
      setBusy(false);
    }
  }

  return { v, errors, busy, msg, editing, imageList: parseImages(v.images), set, text, toggle, setName, setSlug, submit, remove };
}

export type ProductFormApi = ReturnType<typeof useProductForm>;
