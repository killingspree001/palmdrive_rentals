"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/data/types";
import { useRouter } from "next/navigation";

export default function HeroForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
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
      update("heroImage", url);
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
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroImage: form.heroImage,
          heroTitle: form.heroTitle,
          heroSubtitle: form.heroSubtitle,
          heroDescription: form.heroDescription,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Could not save hero settings");
      }
      const updated = await res.json();
      setForm(updated);
      setSaved(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card border border-navy/10 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Hero Title" className="sm:col-span-2">
          <input
            className="input"
            value={form.heroTitle}
            onChange={(e) => update("heroTitle", e.target.value)}
            required
          />
        </Field>

        <Field label="Hero Subtitle" className="sm:col-span-2">
          <input
            className="input"
            value={form.heroSubtitle}
            onChange={(e) => update("heroSubtitle", e.target.value)}
          />
        </Field>

        <Field label="Hero Description" className="sm:col-span-2">
          <textarea
            rows={2}
            className="input"
            value={form.heroDescription}
            onChange={(e) => update("heroDescription", e.target.value)}
          />
        </Field>

        <Field label="Hero Background Image" className="sm:col-span-2">
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
              value={form.heroImage || ""}
              onChange={(e) => update("heroImage", e.target.value)}
              placeholder="https://..."
            />
            {form.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.heroImage}
                alt="Hero preview"
                className="h-40 w-full rounded-lg object-cover"
              />
            )}
          </div>
        </Field>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Saved. Public pages will reflect the change on next load.
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? "Saving..." : "Save hero settings"}
        </button>
      </div>
    </form>
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
