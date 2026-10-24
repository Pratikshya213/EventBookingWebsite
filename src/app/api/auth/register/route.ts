import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/server/database";
import { hashPassword } from "@/lib/server/password";
import { apiError } from "@/lib/server/http";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: unknown; email?: unknown; password?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (name.length < 2 || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 200) {
      return NextResponse.json({ error: "Enter a valid name and email, and a password of 8–200 characters." }, { status: 400 });
    }
    const sql = await getDatabase();
    const hash = await hashPassword(password);
    const rows = await sql`
      INSERT INTO app_users (id, name, email, password_hash)
      VALUES (${randomUUID()}, ${name}, ${email}, ${hash})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email, role
    `;
    if (rows.length === 0) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) { return apiError(error); }
}
