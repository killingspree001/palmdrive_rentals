-- Palmdrive Rentals — Supabase schema
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Idempotent: safe to re-run.

-- =============================================================
-- 1. TABLES
-- =============================================================

create table if not exists public.vehicles (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text default '',
  price_per_day integer not null default 0,
  seats         integer not null default 4,
  bags          integer not null default 2,
  transmission  text not null default 'Automatic',
  fuel          text not null default 'Gasoline',
  description   text not null default '',
  features      text not null default '',
  image_url     text not null default '',
  featured      boolean not null default false,
  available     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text not null default '',
  message    text not null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  status     text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id            text primary key,
  company_name  text not null default 'Palmdrive Rentals',
  tagline       text not null default '',
  address_line  text not null default '',
  city          text not null default '',
  state         text not null default '',
  zip           text not null default '',
  phone         text not null default '',
  email         text not null default '',
  map_query     text not null default '',
  updated_at    timestamptz not null default now()
);

-- Seed the single settings row (id='main')
insert into public.settings (id, company_name, tagline, address_line, city, state, zip, phone, email, map_query)
values (
  'main',
  'Palmdrive Rentals',
  'Premium and economy car rentals in Fort Lauderdale. Curated luxury, performance, and electric vehicles.',
  '990 South Federal Highway',
  'Fort Lauderdale',
  'FL',
  '33316',
  '+1 (954) 555-0199',
  'concierge@palmdriverentals.com',
  '990 South Federal Highway, Fort Lauderdale, FL 33316'
)
on conflict (id) do nothing;

-- =============================================================
-- 2. ROW LEVEL SECURITY
-- =============================================================
-- The Next.js admin endpoints use the SERVICE ROLE key, which bypasses RLS.
-- These policies cover what the PUBLIC (anon) client is allowed to do directly.

alter table public.vehicles  enable row level security;
alter table public.inquiries enable row level security;
alter table public.settings  enable row level security;

-- Drop existing policies so the script is idempotent
drop policy if exists "vehicles read for everyone"   on public.vehicles;
drop policy if exists "settings read for everyone"   on public.settings;
drop policy if exists "inquiries insert for everyone" on public.inquiries;

create policy "vehicles read for everyone"
  on public.vehicles for select
  to anon, authenticated
  using (true);

create policy "settings read for everyone"
  on public.settings for select
  to anon, authenticated
  using (true);

create policy "inquiries insert for everyone"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

-- =============================================================
-- 3. SEED VEHICLES (only if the table is currently empty)
-- =============================================================
insert into public.vehicles (name, category, price_per_day, seats, bags, transmission, fuel, description, features, image_url, featured)
select * from (values
  ('Porsche 911 Carrera',           'Sports Car',  450, 2, 1, 'Automatic', 'Gasoline',
   'Iconic silhouette, blistering performance, and refined interior. The ultimate driving experience for the coastal highways.',
   '0-60 in 3.8s,Premium Sound,Sport Chrono,Heated Seats',
   'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80', true),
  ('Tesla Model S Plaid',           'Electric',    320, 5, 3, 'Automatic', 'Electric',
   'Tri-motor all-wheel drive electric sedan with 1,020 horsepower and a 17-inch cinematic display.',
   '0-60 in 1.99s,Autopilot,Glass Roof,Premium Audio',
   'https://images.unsplash.com/photo-1617704548623-340376564e68?w=1200&q=80', false),
  ('Range Rover Autobiography',     'Luxury SUV',  380, 5, 4, 'Automatic', 'Hybrid',
   'Effortless luxury with semi-aniline leather, rear executive class seats, and class-leading off-road capability.',
   'Massaging Seats,Meridian Audio,Pano Roof,Air Suspension',
   'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80', false),
  ('BMW M4 Competition Convertible','Convertible', 290, 4, 2, 'Automatic', 'Gasoline',
   '503-horsepower twin-turbo six with a retractable soft top — built for sun-soaked coastal cruising.',
   '0-60 in 3.6s,M Sport Brakes,Harman Kardon,Heated Steering',
   'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80', false),
  ('Rivian R1S',                    'Electric SUV',310, 7, 5, 'Automatic', 'Electric',
   'Three-row, all-electric adventure SUV with quad-motor torque vectoring and 316-mile range.',
   'AWD,Off-Road Mode,Glass Roof,Tow Mode',
   'https://images.unsplash.com/photo-1669228431771-c12c4ed64bb1?w=1200&q=80', false),
  ('Range Rover Velar',             'Luxury SUV',  285, 5, 3, 'Automatic', 'Hybrid',
   'Sleek, minimalist design meets refined performance. The most road-focused Range Rover.',
   'Touch Pro Duo,Hybrid,Meridian Audio,Heated Seats',
   'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=1200&q=80', false),
  ('Mercedes-Benz S-Class',         'Sedan',       360, 5, 4, 'Automatic', 'Gasoline',
   'The benchmark for luxury sedans. Burmester 4D audio, executive rear seats, and silken ride quality.',
   'Burmester 4D,Massaging Seats,HUD,Night Vision',
   'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80', false)
) as v(name, category, price_per_day, seats, bags, transmission, fuel, description, features, image_url, featured)
where not exists (select 1 from public.vehicles);

-- =============================================================
-- 4. STORAGE BUCKET (for vehicle image uploads)
-- =============================================================
-- Run this AFTER you've created a bucket called "vehicle-images" in
-- Supabase → Storage. Or run the insert below, then mark it Public in the UI.

insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

drop policy if exists "vehicle images public read" on storage.objects;
create policy "vehicle images public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'vehicle-images');
