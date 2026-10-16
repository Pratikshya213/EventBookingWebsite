import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/server/database";
import { requireAdmin } from "@/lib/server/guards";
import { apiError } from "@/lib/server/http";

function validEvent(value: Record<string, unknown>) {
  return ["slug", "title", "category", "date", "time", "venue", "city", "description", "image"].every((key) => typeof value[key] === "string") &&
    typeof value.price === "number" && value.price >= 0 && Number.isInteger(value.availableTickets) && Number(value.availableTickets) >= 0;
}

export async function PATCH(request: Request, context: RouteContext<"/api/events/[id]">) {
  try {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;
    const { id } = await context.params;
    const body = await request.json() as Record<string, unknown>;
    if (!validEvent(body)) return NextResponse.json({ error: "Event details are invalid." }, { status: 400 });
    const sql = await getDatabase();
    const rows = await sql`
      UPDATE events SET slug=${body.slug as string}, title=${body.title as string}, category=${body.category as string}, date=${body.date as string}, time=${body.time as string}, venue=${body.venue as string}, city=${body.city as string}, price=${body.price as number}, image=${body.image as string}, description=${body.description as string}, available_tickets=${body.availableTickets as number}
      WHERE id=${id} RETURNING id, slug, title, category, date, time, venue, city, price, image, description, available_tickets AS "availableTickets"
    `;
    if (!rows.length) return NextResponse.json({ error: "Event not found." }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: Request, context: RouteContext<"/api/events/[id]">) {
  try {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;
    const { id } = await context.params;
    const sql = await getDatabase();
    const rows = await sql`DELETE FROM events WHERE id=${id} RETURNING id`;
    if (!rows.length) return NextResponse.json({ error: "Event not found." }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) { return apiError(error); }
}
