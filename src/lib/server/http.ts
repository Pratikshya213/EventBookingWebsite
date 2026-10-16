import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";

export function apiError(error: unknown) {
  unstable_rethrow(error);
  console.error("API request failed:", error);
  if (error instanceof Error && (error.message.includes("DATABASE_URL") || error.message.includes("AUTH_SECRET"))) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
  return NextResponse.json({ error: "The request could not be completed." }, { status: 500 });
}
