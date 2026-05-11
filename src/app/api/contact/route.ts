import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createInquiry } from "@/lib/data";
import { revalidatePath } from "next/cache";

const InquirySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().default(""),
  message: z.string().min(1).max(2000),
  vehicleId: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = InquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const inquiry = await createInquiry({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || "",
      message: parsed.data.message,
      vehicleId: parsed.data.vehicleId || null,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create inquiry" },
      { status: 500 }
    );
  }
}
