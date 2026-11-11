import { SiteFooter } from "@/features/shell/SiteFooter";
import { SiteHeader } from "@/features/shell/SiteHeader";
import { getDetail, makeSlides } from "@/features/shop/details";
import { ProductBreadcrumb } from "@/features/shop/ProductChrome";
import { ProductGallery } from "@/features/shop/ProductGallery";
import { ProductInfo } from "@/features/shop/ProductInfo";
import { PairingSection, ReviewsSection } from "@/features/shop/ProductSections";
import { authOptions } from "@/lib/auth";
import { getProductBySlug } from "@/lib/shop-data";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  try { return await getProductBySlug(slug); } catch (e) { console.error("product load failed", e); throw e; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug).catch(() => null);
  return { title: p ? `${p.name} — Elegent` : "Product — Elegent", description: p?.description ?? undefined };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await load(slug);
  if (!product) notFound();

  const session = await getServerSession(authOptions);
  const detail = getDetail(product);
  if (product.description) detail.description = product.description; // the database copy wins over generated copy

  return (
    <>
      <SiteHeader user={session?.user ?? null} />
      {/* <ProductMobileHeader product={product} /> */}
      <main className="pt-16 lg:pt-25.5">
        <section className="mx-auto max-w-360 px-4 lg:px-6 lg:pb-12">
          <ProductBreadcrumb product={product} />
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7"><ProductGallery product={product} slides={makeSlides(product)} capsule={detail.capsule} slowCraft={detail.slowCraft} /></div>
            <div className="lg:col-span-5"><ProductInfo product={product} detail={detail} /></div>
          </div>
        </section>
        <PairingSection />
        <ReviewsSection rating={product.rating} count={product.reviews} data={detail.reviews} />
      </main>
      <SiteFooter />
    </>
  );
}
