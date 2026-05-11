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

            <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-navy/10 bg-white p-6 mt-8">
              <a href="#inquire" className="btn-primary w-full text-center">
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

