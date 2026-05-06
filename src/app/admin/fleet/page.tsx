import { listVehicles } from "@/lib/data";
import FleetManager from "./FleetManager";

export const dynamic = "force-dynamic";

export default async function AdminFleetPage() {
  const vehicles = await listVehicles();
  return <FleetManager initialVehicles={vehicles} />;
}
