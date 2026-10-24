import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/uploads";
import { requireAdmin } from "@/lib/server/guards";
import { apiError } from "@/lib/server/http";

export async function POST(request: Request) {
  try {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image was sent." }, { status: 400 });
  }

  const ext = IMAGE_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP, GIF or AVIF image." }, { status: 415 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 5 MB)." }, { status: 413 });
  }

  const blob = await put(`events/${randomUUID()}.${ext}`, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });
  return NextResponse.json({ url: blob.url });
  } catch (error) { return apiError(error); }
}
