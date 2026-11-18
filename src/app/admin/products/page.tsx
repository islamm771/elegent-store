import { AdminShell } from "@/features/admin/AdminShell";
import { ProductRowActions, StockInput } from "@/features/admin/ProductRowActions";
import { categories } from "@/features/shop/catalog";
import { adminPage } from "@/lib/admin-page";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/db";
import { money } from "@/lib/money";
import Link from "next/link";

export const metadata = { title: "Products — Admin" };
export const dynamic = "force-dynamic";

const LOW_STOCK = 5;
const TABS = [
  { id: "all", label: "All" }, { id: "active", label: "Visible" }, { id: "hidden", label: "Hidden" },
  { id: "low", label: `Low stock (≤ ${LOW_STOCK})` }, { id: "out", label: "Out of stock" },
] as const;

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ view?: string; q?: string }> }) {
  const session = await adminPage("/admin/products");
  const { view, q } = await searchParams;
  const tab = TABS.find((t) => t.id === view)?.id ?? "all";
  const term = (q ?? "").trim().slice(0, 60);

  const base = term ? { OR: [{ name: { contains: term, mode: "insensitive" as const } }, { slug: { contains: term, mode: "insensitive" as const } }] } : {};
  const [products, total, active, low, out] = await Promise.all([
    prisma.product.findMany({
      where: { ...base, ...(tab === "active" ? { isActive: true } : tab === "hidden" ? { isActive: false } : tab === "low" ? { stock: { gt: 0, lte: LOW_STOCK } } : tab === "out" ? { stock: 0 } : {}) },
      orderBy: { createdAt: "desc" }, take: 200,
    }),
    prisma.product.count(), prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { stock: { gt: 0, lte: LOW_STOCK } } }), prisma.product.count({ where: { stock: 0 } }),
  ]);
  const counts: Record<string, number> = { all: total, active, hidden: total - active, low, out };
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

  return (
    <AdminShell user={session.user} active="products" title="Products"
      action={<Link href="/admin/products/new" className="rounded-field bg-black px-5 py-3 text-[12px] font-semibold uppercase tracking-widest text-white shadow-cta hover:bg-ink">+ New product</Link>}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Product filter" className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link key={t.id} href={`/admin/products?view=${t.id}${term ? `&q=${encodeURIComponent(term)}` : ""}`} aria-current={t.id === tab ? "page" : undefined}
              className={cn("rounded-pill px-4 py-2 text-[13px] font-semibold shadow-hairline", t.id === tab ? "bg-black text-white" : "bg-surface text-ink hover:bg-field")}>
              {t.label} <span className="ml-1 opacity-60">{counts[t.id]}</span>
            </Link>
          ))}
        </nav>
        <form action="/admin/products" className="flex gap-2">
          <input type="hidden" name="view" value={tab} />
          <input name="q" defaultValue={term} placeholder="Search name or slug" aria-label="Search products" className="w-56 rounded-field bg-field px-4 py-2.5 text-[14px] outline-none focus:ring-1 focus:ring-accent" />
          <button className="rounded-field bg-surface px-4 py-2.5 text-[12px] font-semibold uppercase tracking-widest shadow-hairline hover:bg-field">Search</button>
        </form>
      </div>

      {products.length === 0 ? <p className="text-[15px] text-ink-muted">No products here.</p> : (
        <ul className="flex flex-col gap-3">
          {products.map((p) => (
            <li key={p.id} className={cn("flex flex-wrap items-center gap-4 rounded-[8px] bg-surface p-3 shadow-hairline", !p.isActive && "opacity-70")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.images[0] ? <img src={p.images[0]} alt="" className="h-16 w-14 shrink-0 rounded-sm object-cover" /> : <span className="h-16 w-14 shrink-0 rounded-sm" style={{ background: p.tone }} aria-hidden />}
              <div className="min-w-48 flex-1">
                <Link href={`/admin/products/${p.slug}`} className="text-[15px] font-semibold hover:underline">{p.name}</Link>
                {!p.isActive && <span className="ml-2 rounded-pill bg-field px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Hidden</span>}
                <p className="text-[12px] text-ink-subtle">{catName(p.category)} · {p.slug}</p>
              </div>
              <div className="w-24 text-[14px] font-bold">
                {money(p.priceCents / 100, { cents: true })}
                {p.compareAtCents && <span className="block text-[12px] font-normal text-ink-subtle line-through">{money(p.compareAtCents / 100, { cents: true })}</span>}
              </div>
              <div className="flex items-center gap-2">
                <StockInput key={`${p.id}-${p.stock}`} slug={p.slug} stock={p.stock} />
                {p.stock === 0 ? <span className="text-[11px] font-semibold uppercase text-danger">Out</span> : p.stock <= LOW_STOCK ? <span className="text-[11px] font-semibold uppercase text-accent">Low</span> : null}
              </div>
              <div className="ml-auto"><ProductRowActions slug={p.slug} name={p.name} isActive={p.isActive} /></div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
