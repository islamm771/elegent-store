# Products API

Base path: `/api/products`. All prices are **integer cents** (`14500` = $145.00). Errors are `{ "error": "<code>", "fields"?: { "<field>": "<message>" } }`.

| Method | Path | Who | Result |
|---|---|---|---|
| GET | `/api/products` | anyone | `{ items, total, page, pageSize, pages }` |
| GET | `/api/products/:slug` | anyone | one product (hidden products: admin only) |
| POST | `/api/products` | admin | `201` + product, `Location` header |
| PATCH | `/api/products/:slug` | admin | `200` + updated product (send any subset) |
| DELETE | `/api/products/:slug` | admin | `{ "ok": true }` |

Statuses: `400` validation · `401` not signed in · `403` signed in but not an admin · `404` not found · `409` slug already exists.

**Admins** are the emails in `ADMIN_EMAILS` (comma separated). Calls use the normal NextAuth session cookie.

## List filters (query string)
`dept` women | men | kids | sale | trends · `cat` dresses | tops | trousers | outerwear | accessories · `color` / `size` / `material` (comma separated, any-of) · `minPrice` / `maxPrice` (cents) · `oeko=1` · `inStock=1` · `q` (every word must match name, label or description) · `sort` featured | popular | newest | price-asc | price-desc · `page` (1+) · `pageSize` (1–48, default 12) · `slugs` (comma separated, up to 48 — fetch specific products, used by the wishlist) · `includeInactive=1` (admin only). Unknown values are ignored.

## Product object
```json
{
  "id": "cm…", "slug": "square-neck-buttoned-linen-dress", "name": "…", "label": "Normandy flax", "description": "…",
  "category": "dresses", "departments": ["women"], "material": "flax-linen",
  "colors": ["mocha","sand"], "sizes": ["xs","s","m"], "images": ["/images/shop/….jpg"], "tone": "#8a5a36",
  "priceCents": 14500, "compareAtCents": null, "rating": 4.9, "reviewCount": 128,
  "badge": { "text": "Ready to ship", "tone": "light" }, "oeko": true, "trending": true,
  "stock": 25, "inStock": true, "isActive": true, "createdAt": "…", "updatedAt": "…"
}
```
Create requires: `slug, name, label, category, departments, material, colors, sizes, priceCents`. Everything else is optional. `badge` is `{ text, tone: dark|accent|danger|light }` or `null`. `compareAtCents` must be higher than `priceCents`. The `slug` can't be changed after creation (cart and wishlist use it). To hide a product without deleting it: `PATCH { "isActive": false }`.

## Examples
```bash
curl "/api/products?dept=women&cat=dresses&maxPrice=20000&sort=price-asc"
curl -X POST /api/products -H "Content-Type: application/json" -b cookies.txt \
  -d '{"slug":"linen-coat","name":"Linen Coat","label":"Relaxed","category":"outerwear","departments":["women"],"material":"flax-linen","colors":["sand"],"sizes":["s","m"],"priceCents":19900}'
curl -X PATCH /api/products/linen-coat -H "Content-Type: application/json" -b cookies.txt -d '{"stock":12,"badge":{"text":"New","tone":"accent"}}'
```
From the browser (signed-in admin): `fetch("/api/products/linen-coat", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ stock: 12 }) })`.
