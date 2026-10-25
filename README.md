# VYBE Event Booking

An event discovery and ticket booking app built with Next.js 16, React 19, and TypeScript.

## Local development

Use Node.js 20.9 or newer. Create a Postgres database (Neon works well), copy `.env.example` to `.env.local`, fill in the values, then run:

```bash
npm install
npm install
npm run dev
```

The app and its API run together at [http://localhost:3000](http://localhost:3000). Database tables and starter events are created automatically on the first API request. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to create the initial admin account.

## Production build

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

## Vercel deployment

Import the repository into Vercel and add a Postgres database from the Vercel Marketplace (Neon is supported). Add a Vercel Blob store for event image uploads. Configure these environment variables in Vercel for Production and Preview:

- `DATABASE_URL` — Postgres connection string (usually added by the database integration). The backend also accepts `POSTGRES_URL`, `NEON_DATABASE_URL`, `DATABASE_URL_UNPOOLED`, or `POSTGRES_URL_NON_POOLING` if your provider uses one of those names.
- `AUTH_SECRET` — a private random value of at least 32 characters.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` — credentials for the first admin account.
- `BLOB_READ_WRITE_TOKEN` — usually added by the Blob integration.

Then deploy using Vercel's standard Next.js build settings. API routes, cookie-based login, events and bookings use the same deployment; event images are stored in Blob. Use a new/empty database for the initial setup. Keep secrets out of source control. `backend/db.json` remains only as legacy demo data; the deployed app does not use JSON Server or local disk storage.
