import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { readSession } from "@/lib/auth";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  SUPABASE_BUCKET,
} from "@/lib/supabase";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_SIZE = 6 * 1024 * 1024; // 6MB

export async function POST(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image too large (max 6MB)" }, { status: 400 });
  }

  const ext = file.type.split("/")[1] || "bin";
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  // --- Production path: Supabase Storage --------------------------------
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    if (!sb) {
      return NextResponse.json(
        { error: "Supabase admin client not configured" },
        { status: 500 }
      );
    }
    const { error } = await sb.storage
      .from(SUPABASE_BUCKET)
      .upload(filename, buf, {
        contentType: file.type,
        upsert: false,
      });
    if (error) {
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }
    const { data } = sb.storage.from(SUPABASE_BUCKET).getPublicUrl(filename);
    return NextResponse.json({ url: data.publicUrl });
  }

  // --- Demo path: local /public/uploads --------------------------------
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buf);
  return NextResponse.json({ url: `/uploads/${filename}` });
}
