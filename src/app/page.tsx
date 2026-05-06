import Link from "next/link";
import PageShell from "@/components/PageShell";
import VehicleCard from "@/components/VehicleCard";
import { listVehicles } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const all = await listVehicles({ availableOnly: true });
  const vehicles = all.slice(0, 6);

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy/80">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
              Fort Lauderdale · Concierge service
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.05] text-navy sm:text-5xl lg:text-6xl">
              Reliable Car Rentals for Every Adventure
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-navy/75 sm:text-lg">
              Palmdrive Rentals delivers premium and economy car rental options
              for visitors and residents in Fort Lauderdale. A focus on quality
              service and vehicle reliability — with flexible rental durations,
              roadside assistance, and exclusive discounts for long-term bookings.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/fleet" className="btn-primary">
                Browse the fleet
              </Link>
              <Link href="/contact" className="btn-secondary">
                Speak to concierge
              </Link>
            </div>
            <ul className="grid gap-3 pt-4 sm:grid-cols-3">
              {[
                "Quick reservations",
                "Customized rental periods",
                "Fast pick-up & return",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm text-navy"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-terracotta"
                  >
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-terracotta/15 blur-3xl" />
            <div className="absolute -bottom-12 -left-6 h-64 w-64 rounded-full bg-navy/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1400&q=80"
                alt="Palm-lined coastal drive"
                className="h-[420px] w-full object-cover lg:h-[520px]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-6 text-white">
                <div className="text-xs uppercase tracking-wider text-white/70">
                  Featured this week
                </div>
                <div className="mt-1 text-2xl font-bold">Coastal Prestige</div>
                <div className="text-sm text-white/80">
                  Hand-picked luxury & sport vehicles for the South Florida coast.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLEET PREVIEW */}
      <section className="container-page py-16 lg:py-24">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              The fleet
            </div>
            <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Discover unmatched elegance
            </h2>
            <p className="mt-3 text-navy/70">
              A curated lineup of luxury, performance, and electric vehicles —
              ready when you are.
            </p>
          </div>
          <Link href="/fleet" className="btn-secondary">
            View all vehicles →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="container-page pb-20">
        <div className="grid gap-4 rounded-3xl bg-navy p-8 text-white sm:grid-cols-3 sm:p-12">
          {[
            { k: "7 days", v: "Average rental length" },
            { k: "24/7", v: "Concierge support" },
            { k: "0 fees", v: "No hidden charges, ever" },
          ].map((s) => (
            <div key={s.k}>
              <div className="text-3xl font-bold text-terracotta-400 sm:text-4xl">
                {s.k}
              </div>
              <div className="mt-1 text-sm text-white/75">{s.v}</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
