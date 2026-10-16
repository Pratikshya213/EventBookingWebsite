import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/server/database";
import { requireAdmin } from "@/lib/server/guards";
import { apiError } from "@/lib/server/http";

function validEvent(value: Record<string, unknown>) {
  return typeof value.slug === "string" && typeof value.title === "string" &&
    typeof value.category === "string" && typeof value.date === "string" &&
    typeof value.time === "string" && typeof value.venue === "string" &&
    typeof value.city === "string" && typeof value.description === "string" &&
    typeof value.image === "string" && typeof value.price === "number" && value.price >= 0 &&
    typeof value.availableTickets === "number" && Number.isInteger(value.availableTickets) && value.availableTickets >= 0;
}

export async function GET() {
  try {
    const sql = await getDatabase();
    const events = await sql`SELECT id, slug, title, category, date, time, venue, city, price, image, description, available_tickets AS "availableTickets" FROM events ORDER BY date, time`;
    return NextResponse.json(events);
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;
    const body = await request.json() as Record<string, unknown>;
    if (!validEvent(body)) return NextResponse.json({ error: "Event details are invalid." }, { status: 400 });
    const sql = await getDatabase();
    const rows = await sql`
      INSERT INTO events (id, slug, title, category, date, time, venue, city, price, image, description, available_tickets)
      VALUES (${randomUUID()}, ${body.slug}, ${body.title}, ${body.category}, ${body.date}, ${body.time}, ${body.venue}, ${body.city}, ${body.price}, ${body.image}, ${body.description}, ${body.availableTickets})
      RETURNING id, slug, title, category, date, time, venue, city, price, image, description, available_tickets AS "availableTickets"
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) { return apiError(error); }
}
