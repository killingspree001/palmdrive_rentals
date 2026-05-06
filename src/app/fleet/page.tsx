import Link from "next/link";
import PageShell from "@/components/PageShell";
import VehicleCard from "@/components/VehicleCard";
import { listVehicles } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const vehicles = await listVehicles({ availableOnly: true });

  return (
    <PageShell>
      <section className="container-page py-12 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-terracotta">
            Our Fleet
          </div>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl">
            Discover Unmatched Elegance
          </h1>
          <p className="mt-5 text-navy/70 sm:text-lg">
            Experience Fort Lauderdale in unparalleled style. Our curated fleet
            of luxury, performance, and electric vehicles is designed for those
            who demand the exceptional. Effortless booking, seamless delivery.
          </p>
        </div>

        {vehicles.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-navy/20 bg-white/60 p-12 text-center text-navy/60">
            No vehicles in the fleet right now. Please{" "}
            <Link href="/contact" className="text-terracotta underline">
              contact us
            </Link>
            .
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
