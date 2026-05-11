"use client";

import { useState } from "react";
import type { Vehicle } from "@/lib/data/types";
import { useRouter } from "next/navigation";

const EMPTY: Partial<Vehicle> = {
  name: "",
  description: "",
  imageUrl: "",
  featured: false,
  available: true,
};

export default function FleetManager({
  initialVehicles,
}: {
  initialVehicles: Vehicle[];
}) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [editing, setEditing] = useState<Partial<Vehicle> | null>(null);
  const [form, setForm] = useState<Partial<Vehicle>>({ ...EMPTY });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function reset() {
    setForm({ ...EMPTY });
    setEditing(null);
    setError("");
  }

  function startEdit(v: Vehicle) {
    setEditing(v);
    setForm({ ...v });
    setError("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Upload failed");
      }
      const { url } = await res.json();
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const isEdit = !!editing?.id;
      const res = await fetch(
        isEdit ? `/api/vehicles/${editing!.id}` : "/api/vehicles",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Save failed");
      }
      const saved: Vehicle = await res.json();
      setVehicles((vs) =>
        isEdit ? vs.map((v) => (v.id === saved.id ? saved : v)) : [saved, ...vs]
      );
      reset();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this vehicle? This cannot be undone.")) return;
    const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    if (res.ok) {
      setVehicles((vs) => vs.filter((v) => v.id !== id));
      if (editing?.id === id) reset();
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">Fleet Inventory</h1>
        <p className="mt-1 text-navy/70">
          Manage the vehicles shown on the public site.
        </p>
      </div>

      {/* Form */}
      <section className="card border border-navy/10 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">
            {editing?.id ? "Edit vehicle" : "New vehicle"}
          </h2>
          {editing?.id && (
            <button onClick={reset} className="text-sm text-navy/60 hover:text-navy">
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Vehicle Name" className="sm:col-span-2">
            <input
              required
              className="input"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Range Rover Velar"
            />
          </Field>



          <Field label="Description" className="sm:col-span-2">
            <textarea
              rows={3}
              className="input"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Short, evocative description..."
            />
          </Field>


          <Field label="Vehicle Image" className="sm:col-span-2">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="btn-secondary cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                  {uploading ? "Uploading..." : "Upload image"}
                </label>
                <span className="text-xs text-navy/50">or paste a URL below</span>
              </div>
              <input
                className="input"
                value={form.imageUrl || ""}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
              />
              {form.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt=""
                  className="h-40 w-full rounded-lg object-cover"
                />
              )}
            </div>
          </Field>

          <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={!!form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={form.available !== false}
                onChange={(e) =>
                  setForm({ ...form, available: e.target.checked })
                }
              />
              Available (visible on site)
            </label>
          </div>

          {error && (
            <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? "Saving..." : editing?.id ? "Save changes" : "Add vehicle"}
            </button>
            {editing?.id && (
              <button type="button" onClick={reset} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* List */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-navy">
          Vehicles ({vehicles.length})
        </h2>
        {vehicles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy/20 bg-white/60 p-12 text-center text-navy/60">
            No vehicles yet — add your first one above.
          </div>
        ) : (
          <div className="grid gap-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="grid gap-4 rounded-2xl bg-white p-4 shadow-soft sm:grid-cols-[140px_1fr_auto] sm:items-center"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-sand sm:w-[140px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.imageUrl || ""}
                    alt={v.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {v.featured && (
                      <span className="rounded-md bg-terracotta/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-terracotta">
                        Featured
                      </span>
                    )}
                    {!v.available && (
                      <span className="rounded-md bg-navy/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy/60">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-base font-bold text-navy">
                    {v.name}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(v)}
                    className="btn-secondary !py-2 !text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:border-red-300 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="label mb-2">{label}</div>
      {children}
    </div>
  );
}
