import { getSettings } from "@/lib/data";
import HeroForm from "./HeroForm";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="mb-4 text-3xl font-extrabold text-navy">
        Hero Section Settings
      </h1>
      <HeroForm initial={settings} />
    </div>
  );
}
