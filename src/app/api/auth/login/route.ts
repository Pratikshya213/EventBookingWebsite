import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/server/database";
import { verifyPassword } from "@/lib/server/password";
import { apiError } from "@/lib/server/http";
import { COOKIE_NAME, createSessionToken, sessionCookieOptions, type SessionUser } from "@/lib/server/session";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: unknown; password?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
    const sql = await getDatabase();
    const rows = await sql`SELECT id, name, email, role, password_hash FROM app_users WHERE email = ${email} LIMIT 1`;
    const user = rows[0] as (SessionUser & { password_hash: string }) | undefined;
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const response = NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    response.cookies.set(COOKIE_NAME, createSessionToken(user.id), sessionCookieOptions());
    return response;
  } catch (error) { return apiError(error); }
}
