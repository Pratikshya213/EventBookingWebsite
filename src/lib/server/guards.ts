import { NextResponse } from "next/server";
import { currentUser } from "./session";

export async function requireAdmin(request?: Request) {
  const user = await currentUser(request);
  if (!user) return { user: null, response: NextResponse.json({ error: "Please log in." }, { status: 401 }) };
  if (user.role !== "admin") return { user: null, response: NextResponse.json({ error: "Admin access required." }, { status: 403 }) };
  return { user, response: null };
}
