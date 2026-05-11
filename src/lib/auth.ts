// Admin session resolver.
//   - If Supabase is configured: check Supabase Auth (real authentication).
//   - Otherwise (demo mode): check the legacy signed JWT cookie set by
//     /api/auth/login against ADMIN_EMAIL/ADMIN_PASSWORD env vars.
//
// API routes import readSession() and don't care which path is active.

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./supabase";
import { getAuthServerClient } from "./supabase-server";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me-in-production"
);
const COOKIE_NAME = "palmdrive_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type AdminSession = { sub: string; email: string; name: string };

/** Returns the current admin session, or null. */
export async function readSession(): Promise<AdminSession | null> {
  if (isSupabaseConfigured()) {
    const sb = getAuthServerClient();
    if (!sb) return null;
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return null;
    return {
      sub: user.id,
      email: user.email || "",
      name:
        (user.user_metadata?.full_name as string) ||
        (user.user_metadata?.name as string) ||
        "Admin",
    };
  }

  // Demo fallback: legacy JWT cookie
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}

// =================================================================
// Demo-mode helpers (used only when Supabase is NOT configured)
// =================================================================

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminSession | null> {
  const expectedEmail = (process.env.ADMIN_EMAIL || "admin@palmdriverentals.com").toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || "palmdrive123";
  const expectedHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (email.toLowerCase() !== expectedEmail) return null;

  let ok = false;
  if (expectedHash) {
    ok = await bcrypt.compare(password, expectedHash);
  } else {
    ok = password === expectedPassword;
  }
  if (!ok) return null;

  return {
    sub: "admin",
    email: expectedEmail,
    name: "Palmdrive Admin",
  };
}

export async function createSessionToken(payload: AdminSession) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}
