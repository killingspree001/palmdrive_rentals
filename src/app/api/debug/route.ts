import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return NextResponse.json({
    isConfigured: isSupabaseConfigured(),
    url: {
      exists: !!url,
      startsWithHttps: url.startsWith("https://"),
      hasQuotes: url.startsWith('"') || url.startsWith("'"),
      value: url ? `${url.substring(0, 10)}...` : "missing",
    },
    anonKey: {
      exists: !!anon,
      hasQuotes: anon.startsWith('"') || anon.startsWith("'"),
      value: anon ? `${anon.substring(0, 10)}...` : "missing",
    },
    serviceKey: {
      exists: !!service,
      hasQuotes: service.startsWith('"') || service.startsWith("'"),
      value: service ? `${service.substring(0, 10)}...` : "missing",
    }
  });
}
