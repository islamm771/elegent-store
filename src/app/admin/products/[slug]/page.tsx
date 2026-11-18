import { AdminShell } from "@/features/admin/AdminShell";
import { ProductForm } from "@/features/admin/ProductForm";
import { adminPage } from "@/lib/admin-page";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit product — Admin" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await adminPage(`/admin/products/${slug}`);
  const p = await prisma.product.findUnique({ where: { slug } });
  if (!p) notFound();

  const initial = {
    slug: p.slug, name: p.name, label: p.label, description: p.description ?? "", category: p.category, material: p.material,
    departments: p.departments, colors: p.colors, sizes: p.sizes, images: p.images.join("\n"), tone: p.tone,
    price: String(p.priceCents / 100), compareAt: p.compareAtCents ? String(p.compareAtCents / 100) : "", stock: String(p.stock),
    badgeText: p.badgeText ?? "", badgeTone: p.badgeTone ?? "dark", oeko: p.oeko, trending: p.trending, isActive: p.isActive,
  };
  return (
    <AdminShell user={session.user} active="products" title={p.name}
      action={<Link href={`/shop/${p.slug}`} className="label-caps text-ink underline underline-offset-2">View in shop ↗</Link>}>
      <ProductForm initial={initial} editing />
    </AdminShell>
  );
}
