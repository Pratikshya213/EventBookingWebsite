# Happen Event Booking

An event discovery and ticket booking frontend built with Next.js 16, React 19, and TypeScript.

## Local development

Use Node.js 20.9 or newer, then run:

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). It uses static starter events and browser `localStorage` for accounts, favorites, bookings, and admin-created events. Demo credentials:

- Admin: `admin@gmail.com` / `admin1234`
- User: `simran@gmail.com` / `simran123`
- User: `alex@gmail.com` / `alex1234`

## Build and deploy

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The static site is generated in `out/`. Import the repository into Vercel and deploy with the default Next.js build command (`npm run build`). No database or environment variables are needed.

This frontend demo is not a secure multi-user booking service: browser data is local to each device and can be edited by its owner. Real accounts, shared bookings, secure admin access, or payment processing require a server/database backend.
