import { getSettings } from "@/lib/data";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">Contact Settings</h1>
        <p className="mt-1 text-navy/70">
          These details appear in the site footer and on the public Contact page.
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
