import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAuthServerClient } from "@/lib/supabase-server";

export async function POST() {
  if (isSupabaseConfigured()) {
    const sb = getAuthServerClient();
    if (sb) await sb.auth.signOut();
  }
  // Always clear the legacy cookie too (harmless if not present)
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
