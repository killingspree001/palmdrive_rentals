"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import {
  getAuthBrowserClient,
  isSupabaseConfiguredOnClient,
} from "@/lib/supabase-browser";

const NAV = [
  { href: "/admin/fleet", label: "Fleet Inventory", icon: "car" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "mail" },
  { href: "/admin/hero", label: "Hero Settings", icon: "image" },
  { href: "/admin/settings", label: "Contact Settings", icon: "cog" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Login page renders bare — no admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    if (isSupabaseConfiguredOnClient()) {
      const sb = getAuthBrowserClient();
      if (sb) await sb.auth.signOut();
    }
    // Always hit the API route too — it clears cookies + the legacy demo cookie
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-navy/10 bg-cream/90 backdrop-blur">
        <div className="container-page flex h-20 items-center justify-between sm:h-24">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="ml-2 hidden rounded-md bg-navy px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white sm:inline-block">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm text-navy/70 hover:text-navy sm:inline">
              View site
            </Link>
            <button onClick={logout} className="btn-secondary !py-2 !text-xs">
              Logout
            </button>
          </div>
        </div>
        {/* Mobile tab nav */}
        <nav className="container-page flex gap-1 overflow-x-auto pb-2 md:hidden">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? "bg-navy text-white" : "text-navy hover:bg-white"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="container-page grid gap-8 py-8 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <nav className="sticky top-24 space-y-1">
            {NAV.map((n) => {
              const active = pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-navy text-white"
                      : "text-navy/80 hover:bg-white"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
