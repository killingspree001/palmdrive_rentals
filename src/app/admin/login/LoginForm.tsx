"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAuthBrowserClient,
  isSupabaseConfiguredOnClient,
} from "@/lib/supabase-browser";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin/fleet";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    try {
      if (isSupabaseConfiguredOnClient()) {
        // Production path: Supabase Auth
        const sb = getAuthBrowserClient();
        if (!sb) throw new Error("Supabase client unavailable");
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
      } else {
        // Demo fallback: env-based password check via API route
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || "Login failed");
        }
      }
      router.replace(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">
          Admin Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="admin@palmdriverentals.com"
          className="input mt-2"
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input mt-2"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Signing in..." : "Login to Dashboard"}
      </button>
    </form>
  );
}
