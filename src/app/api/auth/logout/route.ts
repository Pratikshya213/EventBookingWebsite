import { NextResponse } from "next/server";
import { COOKIE_NAME, sessionCookieOptions } from "@/lib/server/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
