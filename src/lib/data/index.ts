// Unified data access. Routes & pages import from here.
// If Supabase env vars are present, all reads/writes go to Postgres via
// @supabase/supabase-js. Otherwise, the in-memory demo store is used so the
// app remains runnable.
//
// DB columns are snake_case (Postgres convention); we map to/from camelCase here.

import {
  getSupabase,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "../supabase";
import { newId, store } from "./memoryStore";
import {
  DEFAULT_SETTINGS,
  type Inquiry,
  type InquiryInput,
  type SiteSettings,
  type Vehicle,
  type VehicleInput,
} from "./types";

const T_VEHICLES = "vehicles";
const T_INQUIRIES = "inquiries";
const T_SETTINGS = "settings";
const SETTINGS_ID = "main";

// ---- mappers --------------------------------------------------------------

function vehicleFromRow(row: any): Vehicle {
  return {
    id: row.id,
    name: row.name ?? "",
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
    featured: !!row.featured,
    available: row.available !== false,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function vehicleToRow(input: Partial<VehicleInput>) {
  const out: Record<string, unknown> = {};
  if (input.name !== undefined) out.name = input.name;
  if (input.description !== undefined) out.description = input.description;
  if (input.imageUrl !== undefined) out.image_url = input.imageUrl;
  if (input.featured !== undefined) out.featured = input.featured;
  if (input.available !== undefined) out.available = input.available;
  return out;
}

function inquiryFromRow(row: any): Inquiry {
  const status =
    row.status === "read" || row.status === "responded" ? row.status : "new";
  return {
    id: row.id,
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    message: row.message ?? "",
    vehicleId: row.vehicle_id ?? null,
    status,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function settingsFromRow(row: any): SiteSettings {
  if (!row) return DEFAULT_SETTINGS;
  return {
    companyName: row.company_name ?? DEFAULT_SETTINGS.companyName,
    tagline: row.tagline ?? DEFAULT_SETTINGS.tagline,
    addressLine: row.address_line ?? DEFAULT_SETTINGS.addressLine,
    city: row.city ?? DEFAULT_SETTINGS.city,
    state: row.state ?? DEFAULT_SETTINGS.state,
    zip: row.zip ?? DEFAULT_SETTINGS.zip,
    phone: row.phone ?? DEFAULT_SETTINGS.phone,
    email: row.email ?? DEFAULT_SETTINGS.email,
    mapQuery: row.map_query ?? DEFAULT_SETTINGS.mapQuery,
    heroImage: row.hero_image ?? DEFAULT_SETTINGS.heroImage,
    heroTitle: row.hero_title ?? DEFAULT_SETTINGS.heroTitle,
    heroSubtitle: row.hero_subtitle ?? DEFAULT_SETTINGS.heroSubtitle,
    heroDescription: row.hero_description ?? DEFAULT_SETTINGS.heroDescription,
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function settingsToRow(input: Partial<SiteSettings>) {
  const out: Record<string, unknown> = {};
  if (input.companyName !== undefined) out.company_name = input.companyName;
  if (input.tagline !== undefined) out.tagline = input.tagline;
  if (input.addressLine !== undefined) out.address_line = input.addressLine;
  if (input.city !== undefined) out.city = input.city;
  if (input.state !== undefined) out.state = input.state;
  if (input.zip !== undefined) out.zip = input.zip;
  if (input.phone !== undefined) out.phone = input.phone;
  if (input.email !== undefined) out.email = input.email;
  if (input.mapQuery !== undefined) out.map_query = input.mapQuery;
  if (input.heroImage !== undefined) out.hero_image = input.heroImage;
  if (input.heroTitle !== undefined) out.hero_title = input.heroTitle;
  if (input.heroSubtitle !== undefined) out.hero_subtitle = input.heroSubtitle;
  if (input.heroDescription !== undefined) out.hero_description = input.heroDescription;
  return out;
}

function sortVehicles(vs: Vehicle[]): Vehicle[] {
  return [...vs].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

// ---- vehicles -------------------------------------------------------------

export async function listVehicles(opts?: {
  availableOnly?: boolean;
}): Promise<Vehicle[]> {
  const availableOnly = opts?.availableOnly ?? false;

  if (isSupabaseConfigured()) {
    const sb = getSupabase()!;
    let q = sb.from(T_VEHICLES).select("*");
    if (availableOnly) q = q.eq("available", true);
    const { data, error } = await q;
    if (error) throw error;
    return sortVehicles((data || []).map(vehicleFromRow));
  }

  const all = Array.from(store().vehicles.values());
  return sortVehicles(availableOnly ? all.filter((v) => v.available) : all);
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase()!;
    const { data, error } = await sb
      .from(T_VEHICLES)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? vehicleFromRow(data) : null;
  }
  return store().vehicles.get(id) || null;
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb
      .from(T_VEHICLES)
      .insert(vehicleToRow(input))
      .select()
      .single();
    if (error) throw error;
    return vehicleFromRow(data);
  }

  const now = new Date().toISOString();
  const id = newId();
  const v: Vehicle = { ...input, id, createdAt: now, updatedAt: now };
  store().vehicles.set(id, v);
  return v;
}

export async function updateVehicle(
  id: string,
  patch: Partial<VehicleInput>
): Promise<Vehicle | null> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb
      .from(T_VEHICLES)
      .update({ ...vehicleToRow(patch), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data ? vehicleFromRow(data) : null;
  }

  const cur = store().vehicles.get(id);
  if (!cur) return null;
  const next: Vehicle = { ...cur, ...patch, updatedAt: new Date().toISOString() };
  store().vehicles.set(id, next);
  return next;
}

export async function deleteVehicle(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { error } = await sb.from(T_VEHICLES).delete().eq("id", id);
    if (error) throw error;
    return true;
  }
  return store().vehicles.delete(id);
}

// ---- inquiries ------------------------------------------------------------

export async function listInquiries(): Promise<Inquiry[]> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb
      .from(T_INQUIRIES)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(inquiryFromRow);
  }
  return Array.from(store().inquiries.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function createInquiry(input: InquiryInput): Promise<Inquiry> {
  const status: Inquiry["status"] = input.status || "new";

  if (isSupabaseConfigured()) {
    const sb = getSupabase()!; // public insert allowed by RLS
    const { data, error } = await sb
      .from(T_INQUIRIES)
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone || "",
        message: input.message,
        vehicle_id: input.vehicleId || null,
        status,
      })
      .select()
      .single();
    if (error) throw error;
    return inquiryFromRow(data);
  }

  const now = new Date().toISOString();
  const id = newId();
  const inq: Inquiry = { ...input, id, status, createdAt: now };
  store().inquiries.set(id, inq);
  return inq;
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry["status"]
): Promise<Inquiry | null> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb
      .from(T_INQUIRIES)
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data ? inquiryFromRow(data) : null;
  }

  const cur = store().inquiries.get(id);
  if (!cur) return null;
  const next: Inquiry = { ...cur, status };
  store().inquiries.set(id, next);
  return next;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { error } = await sb.from(T_INQUIRIES).delete().eq("id", id);
    if (error) throw error;
    return true;
  }
  return store().inquiries.delete(id);
}

// ---- site settings --------------------------------------------------------

export async function getSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase()!;
    const { data, error } = await sb
      .from(T_SETTINGS)
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle();
    if (error) throw error;
    return settingsFromRow(data);
  }
  return store().settings;
}

export async function updateSettings(
  patch: Partial<SiteSettings>
): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb
      .from(T_SETTINGS)
      .upsert(
        {
          id: SETTINGS_ID,
          ...settingsToRow(patch),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();
    if (error) throw error;
    return settingsFromRow(data);
  }

  const next: SiteSettings = {
    ...store().settings,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  store().settings = next;
  return next;
}

// ---- types re-export ------------------------------------------------------
export type { Vehicle, Inquiry, SiteSettings };
