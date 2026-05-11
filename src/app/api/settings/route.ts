import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSettings, updateSettings } from "@/lib/data";
import { readSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const PatchSchema = z.object({
  companyName: z.string().min(1).max(120).optional(),
  tagline: z.string().max(500).optional(),
  addressLine: z.string().max(200).optional(),
  city: z.string().max(120).optional(),
  state: z.string().max(40).optional(),
  zip: z.string().max(20).optional(),
  phone: z.string().max(40).optional(),
  email: z.string().email().max(200).optional(),
  mapQuery: z.string().max(300).optional(),
  heroImage: z.string().max(500).optional(),
  heroTitle: z.string().max(120).optional(),
  heroSubtitle: z.string().max(120).optional(),
  heroDescription: z.string().max(500).optional(),
});

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const updated = await updateSettings(parsed.data);
  revalidatePath("/", "layout");
  return NextResponse.json(updated);
}
