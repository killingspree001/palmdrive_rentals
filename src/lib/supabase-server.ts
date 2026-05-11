// Cookie-aware Supabase client for Server Components, Route Handlers, and Server Actions.
// Used to read the auth session set by Supabase Auth on the client.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./supabase";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export function getAuthServerClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components can't set cookies — middleware refreshes the
            // session for us, so this is fine to swallow.
          }
        },
      },
    }
  );
}
