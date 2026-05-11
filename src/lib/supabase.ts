// Lazy Supabase clients.
// Returns null if env vars are missing or look like placeholders, signaling
// the data layer to use the in-memory demo store instead.
//
// We have TWO clients:
//   - Anon client: for public reads + public writes that RLS allows (e.g. inquiry submission)
//   - Admin client: uses the service role key to bypass RLS for admin operations
//     (Service role key NEVER goes into a NEXT_PUBLIC_ var — server-only.)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function looksConfigured() {
  if (!URL || !ANON_KEY) return false;
  if (URL.startsWith("YOUR_") || ANON_KEY.startsWith("YOUR_")) return false;
  if (URL === "https://your-project.supabase.co") return false;
  return URL.startsWith("https://") && URL.includes(".supabase.");
}

let _anon: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return looksConfigured();
}

export function getSupabase(): SupabaseClient | null {
  if (!looksConfigured()) return null;
  if (_anon) return _anon;
  _anon = createClient(URL!, ANON_KEY!, {
    auth: { persistSession: false },
  });
  return _anon;
}

/**
 * Server-only admin client (bypasses Row Level Security).
 * Returns null if SUPABASE_SERVICE_ROLE_KEY is missing — falls back to anon
 * client (so the app still runs, but admin writes will be subject to RLS).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!looksConfigured()) return null;
  if (!SERVICE_KEY || SERVICE_KEY.startsWith("YOUR_")) return getSupabase();
  if (_admin) return _admin;
  _admin = createClient(URL!, SERVICE_KEY, {
    auth: { persistSession: false },
  });
  return _admin;
}

export const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "vehicle-images";
