# FORME® — Premium D2C Commerce Platform

React + Vite + TypeScript + Tailwind + React Router + Zustand + React Hook Form/Zod + Supabase.
One codebase, one deployment per client brand.

## Run locally (demo mode, no credentials)
```bash
npm install
cp .env.example .env     # set VITE_WHATSAPP_NUMBER=91XXXXXXXXXX (digits only)
npm run dev
```
`npm run build` type-checks then builds. `npm test` runs the flow tests (checkout, coupons, validation, reviews, customer signup, admin product creation).

## Demo mode (no `VITE_SUPABASE_*`)
Everything runs in the browser and persists in localStorage: 20 products, sample reviews, 6 sample orders, simulated payments (no money, no card data).
- Admin `/admin/login`: `admin@forme.demo` / `demo1234`
- Customer `/account`: `customer@forme.demo` / `demo1234` (or register a new one)
- Coupons: `FORME10` (10%), `WELCOME200` (₹200 off). Free shipping above ₹1,999, otherwise ₹99.

## Live mode (Supabase)
1. Create a Supabase project. In the SQL editor run, in order: `supabase/migrations/001_schema.sql`, `002_functions_policies.sql`, `supabase/seed.sql`, `supabase/seed_products.sql` (demo catalogue, reviews, sample orders; regenerate with `npm run seed:sql`).
2. Authentication → create the admin user, then link them to the brand:
   `insert into profiles(id,brand_id,role) select '<AUTH_USER_UUID>', id, 'admin' from brands where slug='forme';`
3. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_BRAND_SLUG` in `.env`.
4. Shoppers can register at `/account`. If "Confirm email" is on in Supabase Auth, they confirm first, then sign in.

What goes through Supabase in live mode: catalogue, categories, store settings (name, colours, WhatsApp, hero…), product CRUD and stock, image upload (Storage bucket `product-images`, per-brand folders), orders, order status, customers, wishlists, reviews, coupon validation.
- **Checkout is server-side.** `place_order()` re-prices items from the database, validates the coupon, checks and decrements stock atomically, and returns the totals. Prices sent by the browser are never trusted.
- **Isolation.** Row Level Security scopes every private table to the admin's `brand_id`; shoppers can only read their own orders and wishlist; anonymous users can read the catalogue and place orders but never read orders, customers or coupons.

### Verification status
The SQL (schema, RLS, `place_order`, review trigger, customer functions, seeds) was executed in an embedded Postgres with checks for brand isolation, anonymous access, stock handling and coupon maths. The app's UI flows are covered by the `npm test` suite in demo mode. The browser → Supabase client calls were **not** exercised against a live hosted project, so do one smoke test (place an order, add a product, upload an image) after configuring a real project.

## Adding a client brand
Insert a `brands` row (`is_demo=false` for real clients), its `store_settings`, categories and products, and a `profiles` row for the client's admin. Deploy a separate Vercel project with that client's `VITE_BRAND_SLUG`, WhatsApp number and Supabase keys. Branding is editable in Admin → Settings.

## Payments
Payments are simulated in every mode. `src/services/payment.ts` defines the `PaymentProvider` interface; add a Razorpay test-mode provider there (create the order first, then verify the payment server-side) before taking real money.

## Known limits
- Reviews publish immediately (no moderation queue); admins can remove them in Supabase.
- Product photos are placeholders (picsum.photos). Each client uploads their own in Admin → Products or pastes image URLs.
- Coupons are managed in the `coupons` table (no admin screen yet).

## Deploy to Vercel
Import the repo (framework: Vite), add the env vars from `.env.example`. `vercel.json` handles SPA routing.
