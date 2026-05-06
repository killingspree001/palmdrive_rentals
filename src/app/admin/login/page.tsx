import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Logo from "@/components/Logo";
import Link from "next/link";

export const metadata = { title: "Admin Login — Palmdrive Rentals" };
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=60&blur=200)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px)",
        }}
      />
      <div className="absolute inset-0 bg-cream/60" />

      <div className="relative mx-auto flex min-h-screen max-w-md items-center px-5 py-10">
        <div className="w-full rounded-3xl bg-white p-8 shadow-card sm:p-10">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold text-navy">Secure Admin Portal</h1>
            <p className="mt-2 text-sm text-navy/60">
              Authorized personnel only.
            </p>
          </div>
          <div className="my-6 border-t border-navy/10" />
          <Suspense fallback={<div className="h-40" />}>
            <LoginForm />
          </Suspense>
          <div className="mt-6 rounded-lg bg-sand/60 px-4 py-3 text-center text-sm">
            <Link href="/" className="text-navy/70 hover:text-terracotta">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
