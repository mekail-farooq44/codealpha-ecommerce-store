# Shopfront — Simple E-commerce Store

A full-stack e-commerce store built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Drizzle ORM + SQLite**, and **NextAuth**.

## Features

- **Product listing** — home page grid of all products
- **Product details page** — full description, price, stock, add-to-cart
- **Shopping cart** — client-side cart (persisted to `localStorage`), quantity editing, live totals
- **User login / register** — email + password auth via NextAuth (credentials provider), passwords hashed with bcrypt
- **Order processing** — checkout form → creates an order + order items, decrements stock
- **Order history** — logged-in users can view their past orders
- **Database** — SQLite file (`sqlite.db`), no external DB server required

## Tech Stack

| Layer      | Choice                                  |
|------------|------------------------------------------|
| Framework  | Next.js 16 (App Router, TypeScript)       |
| Styling    | Tailwind CSS                              |
| Database   | SQLite via `@libsql/client`               |
| ORM        | Drizzle ORM                               |
| Auth       | NextAuth.js (credentials provider, JWT)   |
| Validation | Zod                                       |

> **Why not Prisma / better-sqlite3?** Both require downloading prebuilt binaries
> from external domains, which can fail on locked-down networks. This project
> uses `@libsql/client`, which ships pure npm packages with no native build
> step — it installs and runs anywhere `npm install` works.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file:

```bash
cp .env.example .env.local
```

`.env.local` is already pre-filled with working local defaults, but for production
generate a real secret:

```bash
openssl rand -base64 32
```

and set it as `NEXTAUTH_SECRET`.

### 3. Set up the database

Creates the SQLite tables and seeds 8 sample products:

```bash
npm run db:setup
```

(Safe to re-run — it skips seeding if products already exist.)

### 4. Run the dev server

```bash
npm run dev
```

Visit **http://localhost:3000**.

### 5. Build for production

```bash
npm run build
npm run start
```

## Project Structure

```
app/
  page.tsx                    -> product listing (home)
  products/[id]/page.tsx      -> product details
  cart/page.tsx                -> shopping cart
  checkout/page.tsx            -> order processing / checkout form
  orders/page.tsx               -> order history (requires login)
  login/page.tsx                -> login
  register/page.tsx             -> registration
  api/
    products/route.ts            -> GET all products
    products/[id]/route.ts       -> GET single product
    orders/route.ts               -> POST create order, GET user's orders
    auth/register/route.ts        -> POST create user account
    auth/[...nextauth]/route.ts   -> NextAuth handler
components/
  Navbar.tsx                    -> top nav with cart badge + auth state
  ProductCard.tsx                -> product grid card
  AddToCartButton.tsx             -> quantity picker + add to cart (client)
  CartContext.tsx                  -> cart state (React context + localStorage)
  AuthProvider.tsx                  -> NextAuth SessionProvider wrapper
db/
  schema.ts                      -> Drizzle table definitions
  index.ts                        -> Drizzle client
  setup.ts                         -> create tables + seed sample data
```

## Database Schema

- **users**: id, name, email, password_hash, created_at
- **products**: id, name, description, price, image_url, category, stock, created_at
- **orders**: id, user_id, status, total, shipping_name, shipping_address, created_at
- **order_items**: id, order_id, product_id, product_name, quantity, price_at_purchase

## Notes & Next Steps

- Product images are placeholder images from `picsum.photos` — swap in real product photos for production.
- Checkout is a mock flow (no real payment processor). To add real payments, integrate Stripe in `app/api/orders/route.ts` before creating the order.
- Auth uses JWT sessions — fine for a simple store; swap to a database session strategy if you need to revoke sessions server-side.
- To move off SQLite to a hosted Postgres/MySQL later, only `db/schema.ts` and `db/index.ts` need to change — the Drizzle query API stays the same.
