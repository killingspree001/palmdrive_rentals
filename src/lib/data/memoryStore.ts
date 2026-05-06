// In-memory data store used when Firebase env vars are not configured.
// Backs the entire app so the user can verify the frontend without setting up Firebase.
// State persists across requests within a single Node process; resets on restart.

import { randomUUID } from "node:crypto";
import { SEED_VEHICLES } from "./seed";
import {
  DEFAULT_SETTINGS,
  type Inquiry,
  type SiteSettings,
  type Vehicle,
} from "./types";

type Store = {
  vehicles: Map<string, Vehicle>;
  inquiries: Map<string, Inquiry>;
  settings: SiteSettings;
};

// Persist across hot reloads in dev
const g = globalThis as unknown as { __palmdriveStore?: Store };

function makeStore(): Store {
  const vehicles = new Map<string, Vehicle>();
  const now = new Date().toISOString();
  for (const v of SEED_VEHICLES) {
    const id = randomUUID();
    vehicles.set(id, { ...v, id, createdAt: now, updatedAt: now });
  }
  return {
    vehicles,
    inquiries: new Map(),
    settings: { ...DEFAULT_SETTINGS, updatedAt: now },
  };
}

export function store(): Store {
  if (!g.__palmdriveStore) {
    g.__palmdriveStore = makeStore();
  }
  return g.__palmdriveStore;
}

export function newId() {
  return randomUUID();
}
