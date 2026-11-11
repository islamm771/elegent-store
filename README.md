# Elegent store — auth (login + register), no Chakra

Next.js 15 (App Router) · TypeScript · Tailwind v4 · NextAuth v4 (credentials) · Prisma 7 + PostgreSQL (Neon, `@prisma/adapter-pg`) · bcrypt.
UI comes from our own kit in `src/ui` + `src/styles/tokens.css` (built from the "New Elegant" Figma file).

## Requirements
Node.js 20.19+ (22 recommended). Prisma is pinned to the 7.x line: `prisma@latest` on npm is now the Prisma 8 release candidate, which is a different API — don't run `npm i prisma@latest`.

## Run
```bash
npm install                 # also runs `prisma generate`
cp .env.example .env        # fill DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET
npm run db:push             # creates the tables
npm run db:seed             # loads the 17 catalogue products into the Product table (safe to re-run)
npm run dev                 # http://localhost:3000
```

## Product table
`prisma/schema.prisma` has a `Product` model and `prisma/seed.ts` fills it from `src/features/shop/catalog.ts` (upsert by `slug`, so re-running never duplicates; it does reset any product you edited in the database back to the catalogue values). Prices are stored in cents. The storefront pages still read the in-code catalogue until they are switched to the database.

## What works
- `/register` → `POST /api/register` (validates, lowercases email, bcrypt-12, 409 on duplicate email) → redirects to `/login`
- `/login` → NextAuth credentials. "Remember for 30 days" ON = 30-day token, OFF = 24h (`src/lib/auth.ts`)
- `/account` is protected by `src/middleware.ts`; unauthenticated users go to `/login?callbackUrl=/account`
- Google button appears only when `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are set (Apple is not wired)

## Home page (`/`)
Sections: header (announcement bar + nav) · hero · categories (tabs) · curated product grid · editorial banner · value props · newsletter · footer · mobile tab bar.
- Catalogue is placeholder data in `src/features/home/data.ts` (swap for Prisma queries later).
- Newsletter form → `POST /api/newsletter` → `Subscriber` table (run `npm run db:push` after pulling this version).
- Wishlist heart and quick-add are UI-only for now (no cart/wishlist backend yet).
- Photos: `public/images/home/` (see the README there). Tonal placeholders show until they exist.

## Shop (`/shop`)
Filters, sorting, search and pagination live in the URL (shareable, rendered on the server): `?dept=men|women|kids|sale|trends`, `cat`, `color`, `size`, `material`, `max`, `oeko`, `q`, `sort`, `view=list`, `page`.
- Catalogue = 12 placeholder products in `src/features/shop/catalog.ts` (swap for Prisma later); query logic in `query.ts`.
- Cart + wishlist are client-side (localStorage) via `src/features/shop/store.tsx`; `/cart` shows the bag. Checkout is not built.
- Photos: `public/images/shop/<product-id>.jpg` (see the README there).

## Product page (`/shop/<id>`)
Works for every product in the catalogue: gallery (thumbnails + hover zoom on desktop), colour/size pickers with a size-guide dialog, quantity, add to bag / instant checkout (adds to the bag and opens `/cart`), accordions, "Complete the look" pairings, and reviews.
- Copy for the featured dress (`square-neck-buttoned-linen-dress`) comes from Figma; other products get generated placeholder copy (`src/features/shop/details.ts`). Written reviews exist only for the featured dress.
- Gallery photos: `/images/shop/<id>.jpg`, `<id>-2.jpg`, `<id>-3.jpg`, `<id>-4.jpg`; pairings: `pair-*.jpg`.

## Wishlist (`/wishlist`)
There is no Wishlist frame in the Figma file, so it reuses the Shop card/grid and tokens. Hearts anywhere (Home, Shop, product page) feed one list stored in the browser (localStorage), so it is per device and works without signing in. Features: move all to bag, clear all, "Most loved" suggestions when empty, and a count badge on the mobile tab bar.
- The 4 products on the Home page now live in the shop catalogue too, so they can be saved, opened and bought like any other piece.
- To sync the wishlist across devices later, add a `WishlistItem` model and mirror `toggleSaved` in `src/features/shop/store.tsx`.

## Account (`/account`)
Protected page built from the Figma Profile design, on real user data. Tabs: `?tab=profile|orders|sizing|addresses|security`.
- Profile: change name / phone / newsletter (`PATCH /api/account`; the session picks up the new name).
- Security: change password (`POST /api/account/password`, checks the current one, bcrypt-12).
- Sizing profile (bust / waist / hip / inseam + default size) and up to 5 saved addresses, stored as JSON columns on `User` — run `npm run db:push` after pulling this version.
- Orders is an empty state until an Orders model exists. Wishlist / bag counters are read from the browser store.
- Accounts created with Google have no database row, so they see a read-only notice instead of the forms.

## Not built yet
`/forgot-password`, `/terms`, `/privacy` are placeholders (the links exist in the UI).

## Images (optional)
Put the Figma photos in `public/brand/`: `auth-hero.jpg` (login) and `register-hero.jpg` (register). Pages render without them.

## Layout
```
prisma/schema.prisma        User model
prisma.config.ts            CLI config (uses DIRECT_URL for db push / migrate)
src/generated/prisma        generated client (git-ignored, created by `prisma generate`)
src/lib/{auth,db,validation,password,cn}.ts
src/ui/                     Button, TextField/PasswordInput, Checkbox, Divider, Badge, StrengthMeter, Logo, icons
src/features/auth/          AuthShell, AuthHero, RegisterHero, TrustStrip, SocialAuth, LoginForm, RegisterForm
src/app/(auth)/{login,register}/page.tsx
src/app/api/{auth/[...nextauth],register}/route.ts
```
