import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import VehicleCard from "@/components/VehicleCard";
import InquiryForm from "@/components/InquiryForm";
import { getVehicle, listVehicles } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function VehicleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const vehicle = await getVehicle(params.id);
  if (!vehicle) notFound();

  const features = vehicle.features
    ? vehicle.features.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  const all = await listVehicles({ availableOnly: true });
  const related = all.filter((v) => v.id !== vehicle.id).slice(0, 3);

  return (
    <PageShell>
      <div className="container-page py-8 lg:py-12">
        <div className="mb-6 text-sm text-navy/60">
          <Link href="/fleet" className="hover:text-terracotta">← Back to fleet</Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl bg-sand shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vehicle.imageUrl}
                alt={vehicle.name}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              {vehicle.featured && (
                <span className="inline-block rounded-md bg-terracotta px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Featured
                </span>
              )}
              <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
                {vehicle.name}
              </h1>
              <p className="mt-3 leading-relaxed text-navy/75">
                {vehicle.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Spec label="Seats" value={String(vehicle.seats)} />
              <Spec label="Bags" value={String(vehicle.bags)} />
              <Spec label="Trans." value={vehicle.transmission} />
              <Spec label="Fuel" value={vehicle.fuel} />
            </div>

            {features.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-navy/60">
                  Highlights
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-medium text-navy"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-navy/10 bg-white p-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-navy/60">
                  Optional daily rate
                </div>
                <div className="mt-1 text-4xl font-bold text-terracotta">
                  ${vehicle.pricePerDay}
                  <span className="ml-1 text-base font-medium text-navy/60">
                    /day
                  </span>
                </div>
                <div className="mt-1 text-xs text-navy/50">
                  Final pricing confirmed at inquiry.
                </div>
              </div>
              <a href="#inquire" className="btn-primary">
                Inquire about this vehicle
              </a>
            </div>
          </div>
        </div>

        <section id="inquire" className="mt-16 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              Interested? Send us a quick note.
            </h2>
            <p className="mt-3 text-navy/70">
              Tell us about your trip and we&apos;ll respond promptly with
              availability, flexible pricing options, and pick-up details.
            </p>
          </div>
          <div className="lg:col-span-3">
            <InquiryForm vehicleId={vehicle.id} vehicleName={vehicle.name} />
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                You may also like
              </h2>
              <Link
                href="/fleet"
                className="text-sm font-semibold text-navy hover:text-terracotta"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <VehicleCard key={r.id} vehicle={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy/10 bg-white px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/55">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-navy">{value}</div>
    </div>
  );
}
