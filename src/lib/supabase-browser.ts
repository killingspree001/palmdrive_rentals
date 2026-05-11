"use client";

import { createBrowserClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getAuthBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  if (url.startsWith("YOUR_") || anon.startsWith("YOUR_")) return null;
  if (_client) return _client;
  _client = createBrowserClient(url, anon);
  return _client;
}

export function isSupabaseConfiguredOnClient(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return false;
  if (url.startsWith("YOUR_") || anon.startsWith("YOUR_")) return false;
  return url.startsWith("https://") && url.includes(".supabase.");
}

// CookieOptions re-exported for any caller that needs the type
export type { CookieOptions };
