// Shared types for the data layer. Same shape whether the source is Firestore
// or the in-memory demo store.

export type Vehicle = {
  id: string;
  name: string;
  category: string; // kept in schema for future use; not surfaced in UI
  pricePerDay: number;
  seats: number;
  bags: number;
  transmission: string;
  fuel: string;
  description: string;
  features: string; // comma-separated
  imageUrl: string;
  featured: boolean;
  available: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type VehicleInput = Omit<Vehicle, "id" | "createdAt" | "updatedAt">;

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  vehicleId: string | null;
  status: "new" | "read" | "responded";
  createdAt: string; // ISO
};

export type InquiryInput = Omit<Inquiry, "id" | "status" | "createdAt"> & {
  status?: Inquiry["status"];
};

export type SiteSettings = {
  companyName: string;
  tagline: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  mapQuery: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  updatedAt: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "Palmdrive Rentals",
  tagline:
    "Premium and economy car rentals in Fort Lauderdale. Curated luxury, performance, and electric vehicles.",
  addressLine: "990 South Federal Highway",
  city: "Fort Lauderdale",
  state: "FL",
  zip: "33316",
  phone: "+1 (954) 555-0199",
  email: "concierge@palmdriverentals.com",
  mapQuery: "990 South Federal Highway, Fort Lauderdale, FL 33316",
  heroImage: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1400&q=80",
  heroTitle: "Coastal Prestige",
  heroSubtitle: "Featured this week",
  heroDescription: "Hand-picked luxury & sport vehicles for the South Florida coast.",
  updatedAt: new Date(0).toISOString(),
};
