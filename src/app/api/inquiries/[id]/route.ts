import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateInquiryStatus, deleteInquiry } from "@/lib/data";
import { readSession } from "@/lib/auth";

const Patch = z.object({
  status: z.enum(["new", "read", "responded"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const parsed = Patch.safeParse(body);
  if (!parsed.success || !parsed.data.status) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const inquiry = await updateInquiryStatus(params.id, parsed.data.status);
  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(inquiry);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await deleteInquiry(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
