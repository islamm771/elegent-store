import type { ShopProduct } from "@/features/shop/catalog";
import Link from "next/link";
import { SectionHeader } from "./Photo";
import { ProductCard } from "./ProductCard";

export function CuratedGrid({ products, total }: { products: ShopProduct[]; total: number }) {
  return (
    <section className="py-4 lg:py-12">
      <div className="mx-auto max-w-360 px-4 lg:px-6">
        <SectionHeader eyebrow={"Slow fashion craft"}
          title="Curated For You"
          action={
            <Link href="/shop" className="label-caps pb-1 underline underline-offset-2">
              <span className="lg:hidden">View all ({total})</span><span className="hidden lg:inline">View all {total} pieces</span>
            </Link>
          } />
        <div className="mt-4 grid grid-cols-2 gap-3.5 lg:mt-8 lg:grid-cols-4 lg:gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
