import PageShell from "@/components/PageShell";
import InquiryForm from "@/components/InquiryForm";
import { getSettings } from "@/lib/data";

export const metadata = {
  title: "Contact — Palmdrive Rentals",
  description: "Get in touch with our Fort Lauderdale concierge team.",
};
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const s = await getSettings();
  const phoneTel = s.phone.replace(/[^+\d]/g, "");
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(s.mapQuery)}&output=embed`;

  return (
    <PageShell>
      <section className="container-page py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              Concierge
            </div>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 max-w-md text-navy/75 sm:text-lg">
              We&apos;re here to help you secure the perfect vehicle for your
              {` ${s.city} `}stay. Send us a message and our concierge team will
              respond promptly.
            </p>

            <div className="mt-10 space-y-5">
              <ContactRow
                icon="pin"
                label="Visit"
                value={
                  <>
                    {s.companyName}<br />
                    {s.addressLine}<br />
                    {s.city}, {s.state} {s.zip}
                  </>
                }
              />
              <ContactRow
                icon="phone"
                label="Call"
                value={
                  <a href={`tel:${phoneTel}`} className="hover:text-terracotta">
                    {s.phone}
                  </a>
                }
              />
              <ContactRow
                icon="mail"
                label="Email"
                value={
                  <a
                    href={`mailto:${s.email}`}
                    className="hover:text-terracotta"
                  >
                    {s.email}
                  </a>
                }
              />
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-navy/10">
              <iframe
                title="Map"
                src={mapSrc}
                className="h-72 w-full"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <InquiryForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: "pin" | "phone" | "mail";
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
        {icon === "pin" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" strokeLinejoin="round" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        )}
        {icon === "phone" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
          </svg>
        )}
        {icon === "mail" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16v12H4z" />
            <path d="M4 6l8 7 8-7" />
          </svg>
        )}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-navy/55">
          {label}
        </div>
        <div className="mt-1 text-sm leading-relaxed text-navy">{value}</div>
      </div>
    </div>
  );
}
