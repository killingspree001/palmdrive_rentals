"use client";

import { useState } from "react";

export default function InquiryForm({
  vehicleId,
  vehicleName,
}: {
  vehicleId?: string;
  vehicleName?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setErrorMsg("");
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      message: String(fd.get("message") || ""),
      vehicleId: vehicleId || null,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Could not send your message");
      }
      setStatus("ok");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <div className="card border border-navy/10 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/15 text-terracotta">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-bold text-navy">Inquiry sent</h3>
        <p className="mt-2 text-navy/70">
          Thanks — our concierge team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 btn-secondary"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card border border-navy/10 p-6 sm:p-8">
      {vehicleName && (
        <div className="mb-4 rounded-lg bg-sand px-3 py-2 text-xs text-navy/70">
          Inquiring about: <span className="font-semibold text-navy">{vehicleName}</span>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" required placeholder="John Doe" className="input mt-2" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="john@example.com" className="input mt-2" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="phone">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="input mt-2" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="message">Message</label>
          <textarea id="message" name="message" required rows={5} placeholder="How can we assist you today?" className="input mt-2" />
        </div>
      </div>

      {status === "error" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary mt-6 w-full sm:w-auto"
      >
        {status === "sending" ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
