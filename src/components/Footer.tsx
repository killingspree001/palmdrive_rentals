import Link from "next/link";
import Logo from "./Logo";
import { getSettings } from "@/lib/data";

export default async function Footer() {
  const s = await getSettings();
  return (
    <footer className="mt-24 bg-navy text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 sm:col-span-2 lg:col-span-2">
          <div className="rounded-xl bg-cream p-4 inline-block">
            <Logo size="lg" />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            {s.tagline}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/60">
            Explore
          </h3>
          <ul className="space-y-3 text-sm text-white/85">
            <li><Link href="/" className="hover:text-terracotta-400">Home</Link></li>
            <li><Link href="/fleet" className="hover:text-terracotta-400">Our Fleet</Link></li>
            <li><Link href="/contact" className="hover:text-terracotta-400">Contact Support</Link></li>
            <li><Link href="/admin/login" className="hover:text-terracotta-400">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/60">
            Visit
          </h3>
          <address className="space-y-2 not-italic text-sm leading-relaxed text-white/85">
            <div>
              {s.addressLine}<br />
              {s.city}, {s.state} {s.zip}
            </div>
            <div>
              <a
                href={`tel:${s.phone.replace(/[^+\d]/g, "")}`}
                className="hover:text-terracotta-400"
              >
                {s.phone}
              </a>
            </div>
            <div>
              <a href={`mailto:${s.email}`} className="hover:text-terracotta-400">
                {s.email}
              </a>
            </div>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-5 text-xs text-white/60 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} {s.companyName}. All rights reserved.</div>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-white">Rental Policy</Link>
            <Link href="#" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
