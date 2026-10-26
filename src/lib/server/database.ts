import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { events as starterEvents } from "@/lib/events";
import { hashPassword } from "./password";

let schemaReady: Promise<void> | undefined;

export async function getDatabase() {
  const connectionString = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.NEON_DATABASE_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
  ].find((value) => value?.trim());
  if (!connectionString) {
    throw new Error(
      "Database is not configured. Connect a Postgres database and set DATABASE_URL (or POSTGRES_URL) in the Vercel environment variables.",
    );
  }

  const sql = neon(connectionString);
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS app_users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          venue TEXT NOT NULL,
          city TEXT NOT NULL,
          price DOUBLE PRECISION NOT NULL DEFAULT 0,
          image TEXT NOT NULL,
          description TEXT NOT NULL,
          available_tickets INTEGER NOT NULL DEFAULT 0 CHECK (available_tickets >= 0)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS bookings (
          id TEXT PRIMARY KEY,
          booking_id TEXT NOT NULL UNIQUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          event TEXT NOT NULL,
          date TEXT NOT NULL,
          tickets INTEGER NOT NULL CHECK (tickets > 0),
          event_id TEXT,
          image TEXT,
          venue TEXT,
          time TEXT,
          price DOUBLE PRECISION
        )
      `;

      for (const event of starterEvents) {
        await sql`
          INSERT INTO events (
            id, slug, title, category, date, time, venue, city, price, image, description, available_tickets
          ) VALUES (
            ${event.id}, ${event.slug}, ${event.title}, ${event.category}, ${event.date}, ${event.time},
            ${event.venue}, ${event.city}, ${event.price}, ${event.image}, ${event.description}, ${event.availableTickets}
          ) ON CONFLICT (id) DO NOTHING
        `;
      }

      const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminEmail && adminPassword) {
        const existing = await sql`SELECT id FROM app_users WHERE email = ${adminEmail} LIMIT 1`;
        if (existing.length === 0) {
          const hash = await hashPassword(adminPassword);
          await sql`
            INSERT INTO app_users (id, name, email, password_hash, role)
            VALUES (${randomUUID()}, 'Administrator', ${adminEmail}, ${hash}, 'admin')
            ON CONFLICT (email) DO NOTHING
          `;
        }
      }
    })().catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }

  await schemaReady;
  return sql;
}

export const EVENT_COLUMNS = `
  id, slug, title, category, date, time, venue, city, price, image, description,
  available_tickets AS "availableTickets"
`;

export const BOOKING_COLUMNS = `
  id, booking_id AS "bookingId", created_at AS "createdAt", name, email, event, date, tickets,
  event_id AS "eventId", image, venue, time, price
`;
