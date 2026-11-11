import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { isAdmin, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { checkPrices, parseListQuery, parseProductInput, toDto, withDefaults } from "@/lib/products";

/** GET /api/products — public. Filters: dept, cat, color, size, material, minPrice, maxPrice (cents), oeko, inStock, q, sort, page, pageSize. */
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const includeInactive = sp.get("includeInactive") === "1" && (await isAdmin());
  const { where, orderBy, page, pageSize } = parseListQuery(sp, includeInactive);

  try {
    const [total, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    ]);
    return NextResponse.json({ items: rows.map(toDto), total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) });
  } catch (e) {
    console.error("products list failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

/** POST /api/products — admin only. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const { data, errors } = parseProductInput(body, "create");
  const priceError = !Object.keys(errors).length ? checkPrices(data.priceCents!, data.compareAtCents) : null;
  if (priceError) errors.compareAtCents = priceError;
  if (Object.keys(errors).length) return NextResponse.json({ error: "validation", fields: errors }, { status: 400 });

  try {
    const created = await prisma.product.create({ data: withDefaults(data) });
    return NextResponse.json(toDto(created), { status: 201, headers: { Location: `/api/products/${created.slug}` } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "validation", fields: { slug: "A product with this slug already exists." } }, { status: 409 });
    }
    console.error("product create failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
