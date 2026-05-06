// Unified data access. Routes & pages import from here.
// If Firebase env vars are present, all reads/writes go to Firestore.
// Otherwise, the in-memory demo store is used so the app remains runnable.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "../firebase";
import { newId, store } from "./memoryStore";
import {
  DEFAULT_SETTINGS,
  type Inquiry,
  type InquiryInput,
  type SiteSettings,
  type Vehicle,
  type VehicleInput,
} from "./types";

const VEHICLES = "vehicles";
const INQUIRIES = "inquiries";
const SETTINGS = "settings";
const SETTINGS_DOC = "main";

// ---- helpers --------------------------------------------------------------

function tsToIso(v: unknown): string {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  return new Date().toISOString();
}

function vehicleFromDoc(id: string, raw: any): Vehicle {
  return {
    id,
    name: raw.name ?? "",
    category: raw.category ?? "",
    pricePerDay: Number(raw.pricePerDay ?? 0),
    seats: Number(raw.seats ?? 4),
    bags: Number(raw.bags ?? 2),
    transmission: raw.transmission ?? "Automatic",
    fuel: raw.fuel ?? "Gasoline",
    description: raw.description ?? "",
    features: raw.features ?? "",
    imageUrl: raw.imageUrl ?? "",
    featured: !!raw.featured,
    available: raw.available !== false,
    createdAt: tsToIso(raw.createdAt),
    updatedAt: tsToIso(raw.updatedAt),
  };
}

function inquiryFromDoc(id: string, raw: any): Inquiry {
  const status = raw.status === "read" || raw.status === "responded" ? raw.status : "new";
  return {
    id,
    name: raw.name ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    message: raw.message ?? "",
    vehicleId: raw.vehicleId ?? null,
    status,
    createdAt: tsToIso(raw.createdAt),
  };
}

function sortVehicles(vs: Vehicle[]): Vehicle[] {
  return [...vs].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.pricePerDay - a.pricePerDay;
  });
}

// ---- vehicles -------------------------------------------------------------

export async function listVehicles(opts?: {
  availableOnly?: boolean;
}): Promise<Vehicle[]> {
  const availableOnly = opts?.availableOnly ?? false;

  if (isFirebaseConfigured()) {
    const db = getDb()!;
    const q = availableOnly
      ? query(collection(db, VEHICLES), where("available", "==", true))
      : collection(db, VEHICLES);
    const snap = await getDocs(q);
    return sortVehicles(snap.docs.map((d) => vehicleFromDoc(d.id, d.data())));
  }

  const all = Array.from(store().vehicles.values());
  return sortVehicles(availableOnly ? all.filter((v) => v.available) : all);
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  if (isFirebaseConfigured()) {
    const db = getDb()!;
    const snap = await getDoc(doc(db, VEHICLES, id));
    return snap.exists() ? vehicleFromDoc(snap.id, snap.data()) : null;
  }
  return store().vehicles.get(id) || null;
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  const now = new Date().toISOString();

  if (isFirebaseConfigured()) {
    const db = getDb()!;
    const ref = await addDoc(collection(db, VEHICLES), {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { ...input, id: ref.id, createdAt: now, updatedAt: now };
  }

  const id = newId();
  const v: Vehicle = { ...input, id, createdAt: now, updatedAt: now };
  store().vehicles.set(id, v);
  return v;
}

export async function updateVehicle(
  id: string,
  patch: Partial<VehicleInput>
): Promise<Vehicle | null> {
  if (isFirebaseConfigured()) {
    const db = getDb()!;
    const ref = doc(db, VEHICLES, id);
    await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
    const snap = await getDoc(ref);
    return snap.exists() ? vehicleFromDoc(snap.id, snap.data()) : null;
  }

  const cur = store().vehicles.get(id);
  if (!cur) return null;
  const next: Vehicle = { ...cur, ...patch, updatedAt: new Date().toISOString() };
  store().vehicles.set(id, next);
  return next;
}

export async function deleteVehicle(id: string): Promise<boolean> {
  if (isFirebaseConfigured()) {
    const db = getDb()!;
    await deleteDoc(doc(db, VEHICLES, id));
    return true;
  }
  return store().vehicles.delete(id);
}

// ---- inquiries ------------------------------------------------------------

export async function listInquiries(): Promise<Inquiry[]> {
  if (isFirebaseConfigured()) {
    const db = getDb()!;
    const q = query(collection(db, INQUIRIES), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => inquiryFromDoc(d.id, d.data()));
  }
  return Array.from(store().inquiries.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function createInquiry(input: InquiryInput): Promise<Inquiry> {
  const now = new Date().toISOString();
  const status: Inquiry["status"] = input.status || "new";

  if (isFirebaseConfigured()) {
    const db = getDb()!;
    const ref = await addDoc(collection(db, INQUIRIES), {
      ...input,
      status,
      createdAt: serverTimestamp(),
    });
    return { ...input, id: ref.id, status, createdAt: now };
  }

  const id = newId();
  const inq: Inquiry = { ...input, id, status, createdAt: now };
  store().inquiries.set(id, inq);
  return inq;
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry["status"]
): Promise<Inquiry | null> {
  if (isFirebaseConfigured()) {
    const db = getDb()!;
    const ref = doc(db, INQUIRIES, id);
    await updateDoc(ref, { status });
    const snap = await getDoc(ref);
    return snap.exists() ? inquiryFromDoc(snap.id, snap.data()) : null;
  }

  const cur = store().inquiries.get(id);
  if (!cur) return null;
  const next: Inquiry = { ...cur, status };
  store().inquiries.set(id, next);
  return next;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  if (isFirebaseConfigured()) {
    const db = getDb()!;
    await deleteDoc(doc(db, INQUIRIES, id));
    return true;
  }
  return store().inquiries.delete(id);
}

// ---- site settings --------------------------------------------------------

export async function getSettings(): Promise<SiteSettings> {
  if (isFirebaseConfigured()) {
    const db = getDb()!;
    const snap = await getDoc(doc(db, SETTINGS, SETTINGS_DOC));
    if (snap.exists()) {
      const raw = snap.data();
      return {
        companyName: raw.companyName ?? DEFAULT_SETTINGS.companyName,
        tagline: raw.tagline ?? DEFAULT_SETTINGS.tagline,
        addressLine: raw.addressLine ?? DEFAULT_SETTINGS.addressLine,
        city: raw.city ?? DEFAULT_SETTINGS.city,
        state: raw.state ?? DEFAULT_SETTINGS.state,
        zip: raw.zip ?? DEFAULT_SETTINGS.zip,
        phone: raw.phone ?? DEFAULT_SETTINGS.phone,
        email: raw.email ?? DEFAULT_SETTINGS.email,
        mapQuery: raw.mapQuery ?? DEFAULT_SETTINGS.mapQuery,
        updatedAt: tsToIso(raw.updatedAt),
      };
    }
    return DEFAULT_SETTINGS;
  }
  return store().settings;
}

export async function updateSettings(
  patch: Partial<SiteSettings>
): Promise<SiteSettings> {
  const now = new Date().toISOString();

  if (isFirebaseConfigured()) {
    const db = getDb()!;
    const ref = doc(db, SETTINGS, SETTINGS_DOC);
    await setDoc(
      ref,
      { ...patch, updatedAt: serverTimestamp() },
      { merge: true }
    );
    return await getSettings();
  }

  const next: SiteSettings = { ...store().settings, ...patch, updatedAt: now };
  store().settings = next;
  return next;
}

// ---- types re-export ------------------------------------------------------
export type { Vehicle, Inquiry, SiteSettings };
