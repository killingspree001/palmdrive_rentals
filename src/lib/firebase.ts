// Lazy Firebase initialization.
// Returns null if Firebase env vars are missing or look like placeholders,
// which signals the data layer to use the in-memory demo store instead.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function looksConfigured() {
  const k = config.apiKey || "";
  const p = config.projectId || "";
  if (!k || !p) return false;
  if (k.startsWith("YOUR_") || k.includes("xxxx") || k === "demo") return false;
  if (p.startsWith("YOUR_") || p === "demo") return false;
  return true;
}

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function isFirebaseConfigured() {
  return looksConfigured();
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!looksConfigured()) return null;
  if (_app) return _app;
  _app = getApps()[0] || initializeApp(config as any);
  return _app;
}

export function getDb(): Firestore | null {
  if (_db) return _db;
  const app = getFirebaseApp();
  if (!app) return null;
  _db = getFirestore(app);
  return _db;
}

export function getStorageBucket(): FirebaseStorage | null {
  if (_storage) return _storage;
  const app = getFirebaseApp();
  if (!app) return null;
  _storage = getStorage(app);
  return _storage;
}
