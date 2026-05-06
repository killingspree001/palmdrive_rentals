import { NextResponse } from "next/server";
import { listInquiries } from "@/lib/data";
import { readSession } from "@/lib/auth";

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const inquiries = await listInquiries();
  return NextResponse.json(inquiries);
}
