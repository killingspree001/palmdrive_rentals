import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listVehicles, createVehicle } from "@/lib/data";
import { readSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const VehicleSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(2000).default(""),
  imageUrl: z.string().max(1000).default(""),
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
});

export async function GET() {
  const vehicles = await listVehicles({ availableOnly: true });
  return NextResponse.json(vehicles);
}

export async function POST(req: NextRequest) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = VehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const vehicle = await createVehicle(parsed.data);
  revalidatePath("/", "layout");
  return NextResponse.json(vehicle, { status: 201 });
}
