import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVehicle, updateVehicle, deleteVehicle } from "@/lib/data";
import { readSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const UpdateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().max(1000).optional(),
  featured: z.boolean().optional(),
  available: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const v = await getVehicle(params.id);
  if (!v) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(v);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const v = await updateVehicle(params.id, parsed.data);
  if (!v) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json(v);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await deleteVehicle(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
