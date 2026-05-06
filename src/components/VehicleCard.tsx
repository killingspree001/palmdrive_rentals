import Link from "next/link";
import type { Vehicle } from "@/lib/data/types";

const PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 360'><rect width='600' height='360' fill='%23EFEAE0'/><text x='50%25' y='50%25' fill='%231A2A47' font-family='sans-serif' font-size='24' text-anchor='middle' dominant-baseline='middle'>No image</text></svg>";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const img = vehicle.imageUrl || PLACEHOLDER;
  return (
    <Link
      href={`/fleet/${vehicle.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition hover:shadow-card"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={vehicle.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {vehicle.featured && (
          <span className="absolute left-3 top-3 rounded-md bg-terracotta px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-navy">{vehicle.name}</h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy/70">
          <span>{vehicle.transmission}</span>
          <span>·</span>
          <span>{vehicle.seats} Seats</span>
          {vehicle.fuel && (
            <>
              <span>·</span>
              <span>{vehicle.fuel}</span>
            </>
          )}
        </div>
        <div className="mt-5 flex items-end justify-between border-t border-navy/10 pt-4">
          <div>
            <div className="text-2xl font-bold text-terracotta">
              ${vehicle.pricePerDay}
              <span className="ml-1 text-sm font-medium text-navy/60">/day</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-navy/50">
              Optional pricing
            </div>
          </div>
          <span className="text-sm font-semibold text-navy group-hover:text-terracotta">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
