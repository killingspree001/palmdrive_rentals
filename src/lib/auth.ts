// Admin session auth.
// Demo mode (no Firebase configured): the email/password from .env are checked
// against the request, then a signed JWT cookie is set.
// Production with Firebase: use Firebase Auth (signInWithEmailAndPassword) on
// the client and pass the ID token through to the server. Hooks in this file
// can be replaced with Firebase Admin SDK token verification when ready.

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me-in-production"
);
const COOKIE_NAME = "palmdrive_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type AdminSession = { sub: string; email: string; name: string };

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

export async function readSession(): Promise<AdminSession | null> {
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
