/**
 * Seeds the Product table from the in-code catalogue (src/features/shop/catalog.ts).
 * Safe to re-run: products are upserted by slug, so nothing is duplicated.
 *   npm run db:seed
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "../src/generated/prisma/client";
import { products as baseProducts } from "../src/features/shop/catalog";
import { moreProducts } from "./more-products";
import { getDetail } from "../src/features/shop/details";

const DEFAULT_STOCK = 25;
const products = [...baseProducts, ...moreProducts];
const newestAdded = Math.max(...products.map((p) => p.addedAt));

async function main() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Set DIRECT_URL or DATABASE_URL in .env before seeding.");

  const slugs = products.map((p) => p.id);
  const dup = slugs.find((s, i) => slugs.indexOf(s) !== i);
  if (dup) throw new Error(`Duplicate slug in the seed data: ${dup}`);

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    for (const p of products) {
      // "Only 3 left" badge => 3 units, otherwise a comfortable default
      const left = /only (\d+) left/i.exec(p.badge?.text ?? "");

      const data: Prisma.ProductCreateInput = {
        slug: p.id,
        name: p.name,
        label: p.label,
        description: getDetail(p).description,
        category: p.category,
        departments: p.depts,
        material: p.material,
        colors: p.colors,
        sizes: p.sizes,
        images: [`/images/shop/${p.id}.jpg`, ...[2, 3, 4].map((n) => `/images/shop/${p.id}-${n}.jpg`)],
        tone: p.tone,
        priceCents: Math.round(p.price * 100),
        compareAtCents: p.compareAt ? Math.round(p.compareAt * 100) : null,
        rating: p.rating,
        reviewCount: p.reviews,
        badgeText: p.badge?.text ?? null,
        badgeTone: p.badge?.tone ?? null,
        oeko: p.oeko,
        trending: p.trending ?? false,
        stock: left ? Number(left[1]) : DEFAULT_STOCK,
        createdAt: new Date(Date.now() - (newestAdded - p.addedAt) * 86_400_000), // so "Newest" sorts like the catalogue order
      };

      await prisma.product.upsert({ where: { slug: p.id }, update: data, create: data });
      console.log(`✔ ${p.id}`);
    }
    console.log(`\nSeeded ${products.length} products (total in table: ${await prisma.product.count()}).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
