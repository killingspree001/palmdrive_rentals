# Palmdrive Rentals

Premium car rental website for Fort Lauderdale — Next.js 14 + Tailwind + **Supabase** (Postgres + Storage).

Fully responsive (mobile + desktop). Public site for browsing the fleet and sending inquiries; admin portal for managing vehicles, replying to inquiries, and editing site contact info.

---

## Quick start (demo mode — no Supabase needed yet)

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

The app ships in **demo mode** — it boots with a seeded in-memory store of seven sample vehicles + default site settings, so the frontend is fully clickable without any Supabase setup. Data persists for the life of the dev server, then resets when you restart it.

When you're ready to wire up the real backend, fill in the Supabase env vars (below) and the app automatically switches to Postgres. No code changes required.

### Default admin login

- URL: <http://localhost:3000/admin/login>
- Email: `admin@palmdriverentals.com`
- Password: `palmdrive123`

(Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` to swap them.)

---

## Connecting your Supabase project

### 1. Create a Supabase project
- Go to <https://supabase.com> → **Sign in** → **New project**
- Name it `palmdrive-rentals` (or anything), pick a strong DB password, choose the region closest to Fort Lauderdale (`us-east-1` or `us-east-2`)
- Wait ~2 minutes for it to provision

### 2. Run the schema
- In your project sidebar: **SQL Editor** → **New query**
- Open `supabase/schema.sql` from this repo, copy the whole thing, paste, click **Run**
- This creates the `vehicles`, `inquiries`, `settings` tables, adds RLS policies, seeds the seven sample vehicles, and creates the `vehicle-images` storage bucket

### 3. Make the storage bucket public (one click)
- Sidebar: **Storage** → click `vehicle-images` → toggle **Public bucket** on
- (Or it should already be public from the schema script — verify in the UI)

### 4. Grab your API keys
- Sidebar: **Project Settings** → **API**
- Copy these three values:

| Supabase value | Goes into `.env` as |
|---|---|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role** key (under "Reveal") | `SUPABASE_SERVICE_ROLE_KEY` ⚠️ server-only |

> ⚠️ The **service_role** key bypasses Row Level Security. Never expose it in a `NEXT_PUBLIC_` variable, never commit it, never paste it into client code. Our `/api/*` routes use it server-side only.

### 5. Restart the dev server
Press **Ctrl+C** in the terminal running `npm run dev`, then run again:
```bash
npm run dev
```

### 6. Verify
- Visit <http://localhost:3000/fleet> — you should see the seven seeded vehicles loaded from Postgres.
- Log into `/admin/login` → add a vehicle → check Supabase **Table Editor → vehicles** — your new row is there.
- Submit a contact form on `/contact` → check **Table Editor → inquiries**.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                     # Home
│   ├── fleet/page.tsx               # Browse fleet
│   ├── fleet/[id]/page.tsx          # Vehicle detail + inquiry form
│   ├── contact/page.tsx             # Contact page (reads from settings)
│   ├── admin/login/                 # Admin login
│   ├── admin/fleet/                 # Manage vehicles (CRUD + image upload)
│   ├── admin/inquiries/             # Inbox of customer inquiries
│   ├── admin/settings/              # Edit site contact info
│   └── api/                         # REST API routes
├── components/                      # Header, Footer, Logo, VehicleCard, InquiryForm...
├── lib/
│   ├── supabase.ts                  # Supabase client (anon + admin, env-gated)
│   ├── auth.ts                      # Admin JWT cookie sessions
│   └── data/                        # Unified data layer
│       ├── index.ts                 # Public API: listVehicles, createVehicle, ...
│       ├── memoryStore.ts           # Demo-mode in-memory store
│       ├── seed.ts                  # Sample vehicles
│       └── types.ts                 # Vehicle / Inquiry / SiteSettings types
└── middleware.ts                    # Protects /admin/* (except /admin/login)
supabase/
└── schema.sql                       # One-shot setup script for Supabase
public/
├── logo.png                         # Brand logo
└── uploads/                         # Local image fallback (demo mode only)
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
| POST | `/api/upload`          | admin  | Image upload (Supabase Storage in prod, `/public/uploads` in demo) |
| POST | `/api/auth/login`      | public | Login (sets HttpOnly cookie, 7 days) |
| POST | `/api/auth/logout`     | public | Clear cookie |

---

## Deployment notes

- **Vercel / Netlify**: works out of the box once Supabase env vars are set.
- **Image uploads**: in production (Supabase configured), uploads go straight to your `vehicle-images` bucket and the public URL is stored in `vehicles.image_url`.
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
- **Supabase 2** — Postgres database + Storage
- **bcryptjs** + **jose** — admin password + JWT cookie sessions
- **Zod** — request validation on every API route

## Brand tokens (from your logo)

- Cream `#F8F5EE` — page background
- Navy `#1A2A47` — primary text & headings
- Terracotta `#C04A2A` — accent / CTAs
- Plus Jakarta Sans (display) + Inter (body)
