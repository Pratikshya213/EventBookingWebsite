import { createHmac, timingSafeEqual } from "node:crypto";
import { getDatabase } from "./database";

const COOKIE_NAME = "vybe_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

function sessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random value of at least 32 characters.");
  }
  return secret;
}

export function createSessionToken(userId: string) {
  const payload = Buffer.from(JSON.stringify({ userId, expiresAt: Date.now() + SESSION_SECONDS * 1000 })).toString("base64url");
  const signature = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function readSessionUserId(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = createHmac("sha256", sessionSecret()).update(payload).digest();
  const received = Buffer.from(signature, "base64url");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      userId?: unknown;
      expiresAt?: unknown;
    };
    if (typeof data.userId !== "string" || typeof data.expiresAt !== "number" || data.expiresAt <= Date.now()) return null;
    return data.userId;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_SECONDS,
  };
}

export async function currentUser(request?: Request): Promise<SessionUser | null> {
  const token = request
    ? request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1)
    : undefined;
  if (!token) return null;

  const userId = readSessionUserId(token);
  if (!userId) return null;

  const sql = await getDatabase();
  const rows = await sql`
    SELECT id, name, email, role FROM app_users WHERE id = ${userId} LIMIT 1
  `;
  return (rows[0] as SessionUser | undefined) ?? null;
}

export { COOKIE_NAME };
