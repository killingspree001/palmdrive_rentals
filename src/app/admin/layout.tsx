import AdminShell from "./AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is enforced by middleware (src/middleware.ts).
  // AdminShell skips its chrome on /admin/login so the bare login page renders cleanly.
  return <AdminShell>{children}</AdminShell>;
}
