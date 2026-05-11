import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);
const LEGACY_COOKIE = "palmdrive_admin";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function supabaseConfigured() {
  if (!SUPABASE_URL || !SUPABASE_ANON) return false;
  if (SUPABASE_URL.startsWith("YOUR_") || SUPABASE_ANON.startsWith("YOUR_")) return false;
  return SUPABASE_URL.startsWith("https://") && SUPABASE_URL.includes(".supabase.");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin/*; allow /admin/login through unauthenticated
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  // ----- Supabase Auth path --------------------------------------------
  if (supabaseConfigured()) {
    let response = NextResponse.next({ request: req });

    const sb = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await sb.auth.getUser();

    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // ----- Demo fallback: legacy JWT cookie -------------------------------
  const token = req.cookies.get(LEGACY_COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
