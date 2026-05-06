"use client";

import { useState } from "react";
import type { Inquiry } from "@/lib/data/types";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  read: "Read",
  responded: "Responded",
};
const STATUS_STYLE: Record<string, string> = {
  new: "bg-terracotta/10 text-terracotta",
  read: "bg-navy/10 text-navy",
  responded: "bg-emerald-100 text-emerald-700",
};

export default function InquiriesView({
  initial,
  vehicleMap,
}: {
  initial: Inquiry[];
  vehicleMap: Record<string, string>;
}) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<string>("all");

  async function setStatus(id: string, status: string) {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((arr) => arr.map((i) => (i.id === id ? updated : i)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    if (res.ok) setItems((arr) => arr.filter((i) => i.id !== id));
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const counts = items.reduce<Record<string, number>>(
    (acc, i) => ({ ...acc, [i.status]: (acc[i.status] || 0) + 1 }),
    {}
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">Inquiries</h1>
        <p className="mt-1 text-navy/70">
          Customer messages from the contact form and vehicle pages.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { v: "all", label: `All (${items.length})` },
          { v: "new", label: `New (${counts.new || 0})` },
          { v: "read", label: `Read (${counts.read || 0})` },
          { v: "responded", label: `Responded (${counts.responded || 0})` },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`chip ${filter === f.v ? "chip-active" : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy/20 bg-white/60 p-12 text-center text-navy/60">
          No inquiries here yet.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((i) => (
            <div key={i.id} className="rounded-2xl bg-white p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        STATUS_STYLE[i.status] || ""
                      }`}
                    >
                      {STATUS_LABEL[i.status] || i.status}
                    </span>
                    {i.vehicleId && vehicleMap[i.vehicleId] && (
                      <span className="rounded-md bg-sand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy">
                        Re: {vehicleMap[i.vehicleId]}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-lg font-bold text-navy">{i.name}</div>
                  <div className="text-sm text-navy/70">
                    <a href={`mailto:${i.email}`} className="hover:text-terracotta">
                      {i.email}
                    </a>
                    {i.phone && <> · {i.phone}</>}
                  </div>
                </div>
                <div className="text-xs text-navy/50">
                  {new Date(i.createdAt).toLocaleString()}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-navy/85">
                {i.message}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-navy/10 pt-4">
                {i.status !== "read" && (
                  <button
                    onClick={() => setStatus(i.id, "read")}
                    className="btn-secondary !py-2 !text-xs"
                  >
                    Mark as read
                  </button>
                )}
                {i.status !== "responded" && (
                  <button
                    onClick={() => setStatus(i.id, "responded")}
                    className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    Mark responded
                  </button>
                )}
                <a
                  href={`mailto:${i.email}?subject=Re: Your Palmdrive Rentals inquiry`}
                  className="btn-primary !py-2 !text-xs"
                >
                  Reply by email
                </a>
                <button
                  onClick={() => remove(i.id)}
                  className="ml-auto inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
