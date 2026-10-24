import { NextResponse } from "next/server";
import { currentUser } from "@/lib/server/session";
import { apiError } from "@/lib/server/http";

export async function GET(request: Request) {
  try { return NextResponse.json({ user: await currentUser(request) }); }
  catch (error) { return apiError(error); }
}
