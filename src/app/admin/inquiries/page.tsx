import { listInquiries, listVehicles } from "@/lib/data";
import InquiriesView from "./InquiriesView";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const [inquiries, vehicles] = await Promise.all([
    listInquiries(),
    listVehicles(),
  ]);
  const vehicleMap = Object.fromEntries(vehicles.map((v) => [v.id, v.name]));
  return <InquiriesView initial={inquiries} vehicleMap={vehicleMap} />;
}
