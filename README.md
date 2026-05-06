# Palmdrive Rentals

Premium car rental website for Fort Lauderdale — Next.js 14 + Tailwind + **Firebase** (Firestore).

Fully responsive (mobile + desktop). Public site for browsing the fleet and sending inquiries; admin portal for managing vehicles, replying to inquiries, and editing site contact info.

---

## Quick start (demo mode — no Firebase needed yet)

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

The app ships in **demo mode** — it boots with a seeded in-memory store of seven sample vehicles + default site settings, so the frontend is fully clickable without any Firebase setup. Data persists for the life of the dev server, then resets when you restart it.

When you're ready to wire up the real backend, fill in the Firebase env vars (below) and the app automatically switches to Firestore. No code changes required.

### Default admin login

- URL: <http://localhost:3000/admin/login>
- Email: `admin@palmdriverentals.com`
- Password: `palmdrive123`

(Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` to swap them.)

---

## Connecting your Firebase project

1. Create a Firebase project at <https://console.firebase.google.com>.
2. **Firestore**: enable it (Native mode is fine).
3. **Storage** (optional, for vehicle image uploads): enable it. Otherwise upload via URL paste only.
4. **Web app**: create a Web app in your project settings to get the config keys.
5. Copy `.env.example` → `.env` (already done locally) and replace the `YOUR_...` placeholders with the values from the Firebase console:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY="..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="<project>.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="<project-id>"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="<project>.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
   NEXT_PUBLIC_FIREBASE_APP_ID="..."
   ```
6. Restart `npm run dev`.
7. The app now reads/writes Firestore collections:
   - `vehicles` — your fleet
   - `inquiries` — contact form submissions
   - `settings/main` — site contact info edited from `/admin/settings`

The first time around your `vehicles` collection will be empty — log into `/admin/fleet` and add a few, or paste seed docs from `src/lib/data/seed.ts` into the Firestore console.

### Firestore security rules (suggested baseline)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    // Anyone can read the public vehicle catalog and site settings
    match /vehicles/{id}     { allow read: if true; }
    match /settings/{id}     { allow read: if true; }

    // Anyone can SUBMIT an inquiry, but no one can read/list (admins read via Admin SDK)
    match /inquiries/{id}    {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

> The current admin auth is a simple JWT cookie keyed on `ADMIN_EMAIL`/`ADMIN_PASSWORD` (good for staging/demo). For production, swap to **Firebase Auth + Admin SDK** by replacing `verifyAdminCredentials` in `src/lib/auth.ts` and verifying ID tokens server-side. Then your Firestore rules can grant `request.auth.uid != null` access to admin-only writes.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                     # Home
│   ├── fleet/page.tsx               # Browse fleet (no category filter)
│   ├── fleet/[id]/page.tsx          # Vehicle detail + inquiry form
│   ├── contact/page.tsx             # Contact page (reads from settings)
│   ├── admin/login/                 # Admin login
│   ├── admin/fleet/                 # Manage vehicles (CRUD + image upload)
│   ├── admin/inquiries/             # Inbox of customer inquiries
│   ├── admin/settings/              # Edit site contact info
│   └── api/                         # REST API routes
├── components/                      # Header, Footer, Logo, VehicleCard, InquiryForm...
├── lib/
│   ├── firebase.ts                  # Firebase init (lazy, env-gated)
│   ├── auth.ts                      # Admin JWT cookie sessions
│   └── data/                        # Unified data layer
│       ├── index.ts                 # Public API: listVehicles, createVehicle, ...
│       ├── memoryStore.ts           # Demo-mode in-memory store
│       ├── seed.ts                  # Sample vehicles
│       └── types.ts                 # Vehicle / Inquiry / SiteSettings types
└── middleware.ts                    # Protects /admin/* (except /admin/login)
public/
├── logo.png                         # Brand logo
└── uploads/                         # Vehicle images uploaded via admin
```

---

## API routes

All return JSON. Admin routes require a valid `palmdrive_admin` cookie set via `/api/auth/login`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET  | `/api/vehicles`        | public | List vehicles |
| GET  | `/api/vehicles/[id]`   | public | One vehicle |
| POST | `/api/vehicles`        | admin  | Create |
| PUT  | `/api/vehicles/[id]`   | admin  | Update |
| DELETE | `/api/vehicles/[id]` | admin  | Delete |
| POST | `/api/contact`         | public | Submit inquiry |
| GET  | `/api/inquiries`       | admin  | List inquiries |
| PATCH | `/api/inquiries/[id]` | admin  | Update status |
| DELETE | `/api/inquiries/[id]` | admin | Delete |
| GET  | `/api/settings`        | public | Get site contact info |
| PUT  | `/api/settings`        | admin  | Update site contact info |
| POST | `/api/upload`          | admin  | Multipart image upload → `/uploads/<filename>` |
| POST | `/api/auth/login`      | public | Login (sets HttpOnly cookie, 7 days) |
| POST | `/api/auth/logout`     | public | Clear cookie |

---

## Deployment notes

- **Vercel / Netlify**: works out of the box once Firebase env vars are set.
- **Image uploads**: `/api/upload` writes to the local `public/uploads` folder. On serverless platforms (Vercel), swap this to Firebase Storage by editing `src/app/api/upload/route.ts` to use the `firebase/storage` SDK and return the public download URL.
- **Sessions** use HttpOnly cookies signed via `jose`. The same `AUTH_SECRET` must be present in every environment.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start dev server on :3000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Tech stack

- **Next.js 14** (App Router) — frontend + API in one project
- **Tailwind CSS 3** — responsive design system
- **Firebase 10** (Firestore + Storage) — production data layer
- **bcryptjs** + **jose** — admin password + JWT cookie sessions
- **Zod** — request validation on every API route

## Brand tokens (from your logo)

- Cream `#F8F5EE` — page background
- Navy `#1A2A47` — primary text & headings
- Terracotta `#C04A2A` — accent / CTAs
- Plus Jakarta Sans (display) + Inter (body)
