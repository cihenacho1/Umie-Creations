# Umie Creations

Full-stack marketing site and booking platform: Next.js App Router, Prisma + SQLite, Stripe Checkout, and a password-protected admin dashboard.

## UI / shadcn-style layout

- **`src/lib/utils.ts`** — `cn()` helper (`clsx` + `tailwind-merge`), used by shadcn components.
- **`src/components/ui/`** — design-system primitives. This matches shadcn’s default so you can run `npx shadcn@latest init` (or add individual components) without moving folders.

To add full shadcn/ui later:

```bash
npx shadcn@latest init
```

Choose **Tailwind**, **TypeScript**, and align the components path to **`src/components/ui`** if prompted.

## Local setup

1. **Node.js** 20+ recommended.

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in at minimum:

   - `DATABASE_URL="file:./dev.db"`
   - `ADMIN_PASSWORD` — shared admin login password
   - `ADMIN_SESSION_SECRET` — optional; long random string for signing cookies (defaults to deriving from `ADMIN_PASSWORD` if unset)
   - `NEXT_PUBLIC_APP_URL=http://localhost:3000`
   - Stripe keys when testing payments:
     - `STRIPE_SECRET_KEY`
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `STRIPE_WEBHOOK_SECRET` (from Stripe CLI or Dashboard webhook endpoint)

3. Install and database:

   ```bash
   npm install
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Stripe webhooks (local):**

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Use the signing secret Stripe prints as `STRIPE_WEBHOOK_SECRET` in `.env`.

5. **Run the app:**

   ```bash
   npm run dev
   ```

   - Site: [http://localhost:3000](http://localhost:3000)
   - Book: [http://localhost:3000/book](http://localhost:3000/book)
   - Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

If you see a **blank page** or **500** on `http://localhost:3000`:

1. Another stuck `next dev` may still be bound to port 3000. Stop **all** dev servers (Terminal: Ctrl+C), then run `lsof -i :3000` and kill any leftover node process if needed.
2. From the project root: `rm -rf .next` then `npm run dev` again.
3. Confirm the database exists: `npx prisma migrate dev && npx prisma db seed` (SQLite file is `prisma/dev.db`).
4. If Next printed *“Port 3000 is in use … using 3001”*, open **http://localhost:3001** instead.

## Preview / hydration in Cursor

If you use Cursor’s embedded/Simple Browser, you may see React **hydration warnings** because the IDE injects `data-cursor-ref` on links before hydration. The site still works; for a clean console, preview in Chrome or Safari.

## Placeholder images

Seed data and the gallery use Unsplash URLs for demos only. Replace them in **Admin → Gallery** (or in `prisma/seed.ts`) with your own licensed photography before launch.

Inspiration uploads from the booking form are stored under `public/uploads/inspiration/` (suitable for local MVP; use cloud storage in production).

## Scripts

| Command               | Description                    |
| --------------------- | ------------------------------ |
| `npm run dev`         | Development server (Turbopack) |
| `npm run build`       | Production build               |
| `npm run start`       | Start production server        |
| `npx prisma studio`   | Browse SQLite data             |
