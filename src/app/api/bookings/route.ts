import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/server/database";
import { requireAdmin } from "@/lib/server/guards";
import { apiError } from "@/lib/server/http";

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;
    const sql = await getDatabase();
    const rows = await sql`SELECT id, booking_id AS "bookingId", created_at AS "createdAt", name, email, event, date, tickets, event_id AS "eventId", image, venue, time, price FROM bookings ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const eventId = typeof body.eventId === "string" ? body.eventId : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const tickets = body.tickets;
    if (!eventId || name.length < 2 || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || typeof tickets !== "number" || !Number.isInteger(tickets) || tickets < 1 || tickets > 10) {
      return NextResponse.json({ error: "Booking details are invalid." }, { status: 400 });
    }
    const sql = await getDatabase();
    const bookingId = randomUUID();
    const rows = await sql`
      WITH reserved AS (
        UPDATE events SET available_tickets = available_tickets - ${tickets}
        WHERE id = ${eventId} AND available_tickets >= ${tickets}
        RETURNING id, title, date, image, venue, time, price
      )
      INSERT INTO bookings (id, booking_id, name, email, event, date, tickets, event_id, image, venue, time, price)
      SELECT ${bookingId}, ${bookingId}, ${name}, ${email}, reserved.title, reserved.date, ${tickets}, reserved.id, reserved.image, reserved.venue, reserved.time, reserved.price
      FROM reserved
      RETURNING id, booking_id AS "bookingId", created_at AS "createdAt", name, email, event, date, tickets, event_id AS "eventId", image, venue, time, price
    `;
    if (!rows.length) return NextResponse.json({ error: "That event does not have enough tickets available." }, { status: 409 });
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) { return apiError(error); }
}
