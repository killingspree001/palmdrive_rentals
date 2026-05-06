import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="container-page py-24 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-terracotta">
          404
        </div>
        <h1 className="mt-3 text-4xl font-extrabold text-navy sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-navy/70">
          The page you&apos;re looking for has either moved or no longer exists.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">Back home</Link>
          <Link href="/fleet" className="btn-secondary">Browse fleet</Link>
        </div>
      </div>
    </PageShell>
  );
}
