# Elegent store

Fashion boutique built from the "New Elegant" Figma file — custom UI kit (no Chakra), real database, auth, shop, cart and account.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind v4 · NextAuth v4 (credentials, optional Google) · Prisma 7 + PostgreSQL (Neon) · bcrypt · Nodemailer.

## Quick start
Needs Node.js 20.19+ (22 recommended).
```bash
npm install                 # also runs `prisma generate`
cp .env.example .env        # then fill it in (table below)
npm run db:push             # creates the tables
npm run db:seed             # loads 50 sample products (safe to re-run)
npm run dev                 # http://localhost:3000
```
Shortcut for the three database steps: `npm run db:setup`. Generate a secret with `openssl rand -base64 32`.
> Don't run `npm i prisma@latest` — that is the Prisma 8 release candidate (a different API). This project is on Prisma 7.

## Environment variables
| Variable | Required | What for |
|---|---|---|
| `DATABASE_URL` | yes | Neon **pooled** connection string (used by the app) |
| `DIRECT_URL` | yes | Neon **direct** connection string (used by `db:push` / `db:seed`) |
| `NEXTAUTH_SECRET` | yes | signs the session cookie |
| `NEXTAUTH_URL` | yes | site URL, e.g. `http://localhost:3000` (also used in reset-password links) |
| `ADMIN_EMAILS` | for admin | comma-separated emails allowed to create/edit/delete products via the API |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` `MAIL_FROM` | for reset emails | Gmail: enable 2-step verification, then create an **App password**. With no SMTP set, the reset link is printed in the server console in development |
| `GOOGLE_CLIENT_ID` `GOOGLE_CLIENT_SECRET` | optional | shows the Google button on login/register |

## Scripts
`dev` · `build` · `start` · `typecheck` · `db:generate` · `db:push` · `db:seed` · `db:studio` (Prisma Studio on :5555) · `db:setup`

## What's in it
| Area | Route | Notes |
|---|---|---|
| Home | `/` | hero, categories (real counts), most-reviewed pieces, editorial, newsletter (`/api/newsletter`) |
| Shop | `/shop` | filters, sort, search, pagination — all in the URL and run by the database |
| Product | `/shop/<slug>` | gallery + zoom, colour/size, size guide, "Complete the look" recommendations, reviews |
| Bag / Wishlist | `/cart` `/wishlist` | signed in: saved in the database (`CartItem` / `WishlistItem`, linked to the `User`) via `/api/cart` and `/api/wishlist`; guest: browser localStorage, merged into the account at sign-in |
| Auth | `/login` `/register` | "Remember for 30 days" (30-day vs 24-hour session) |
| Password reset | `/forgot-password` `/reset-password` | emailed one-hour link, used once, only a hash is stored |
| Account | `/account` | profile, password, sizing profile, saved addresses (orders: empty state) |
| Products API | `/api/products` | public list/detail, admin create/update/delete — see `docs/products-api.md` |

## Data
- **Products** live in the `Product` table. `prisma/seed.ts` fills it from `src/features/shop/catalog.ts` (17) + `prisma/more-products.ts` (33). Re-seeding resets products to those values, so don't re-seed after you start editing products in the database.
- Colours, sizes, categories and materials are fixed lists in `src/features/shop/catalog.ts` (the API validates against them).
- Prices are stored in **cents**.
- Photos are not included: pages show a tonal placeholder until files exist in `public/images/` — see the README in `home/` and `shop/` there (`shop/<slug>.jpg`, `-2`…`-4`).

## Not built yet / known limits
- **Not built:** checkout and orders, `/terms` and `/privacy` (placeholders), an admin UI (use the API), real shoe / kids sizes.
- After a password reset, sessions already open on other devices stay valid until they expire (JWT sessions).
- No rate limiting except the per-account limit on reset emails.
- Guests' bag and wishlist stay on their device until they sign in.

## Layout
```
prisma/            schema.prisma, seed.ts, more-products.ts
prisma.config.ts   Prisma CLI config (uses DIRECT_URL)
docs/              products-api.md
src/app/           pages + API routes   (auth)/ login, register, forgot/reset password
src/features/      home · shop · shell · auth · account · wishlist
src/ui/            design-system components (Button, TextField, Checkbox, …) + icons
src/styles/        tokens.css (colours, radii, shadows, type roles)
src/lib/           auth, db, mail, products, shop-data, validation, …
```