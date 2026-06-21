create extension if not exists "pgcrypto";

create table if not exists trainers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  photo_url text,
  specialty text not null,
  bio text,
  certifications text[] default '{}',
  philosophy_quote text,
  instagram_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists membership_tiers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price_monthly numeric not null,
  price_annual numeric not null,
  features text[] default '{}',
  is_featured boolean default false,
  sort_order int default 0
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  day text not null,
  start_time time not null,
  end_time time not null,
  trainer_id uuid references trainers(id) on delete set null,
  intensity smallint check (intensity between 1 and 3),
  type text not null,
  capacity int default 0,
  spots_left int default 0,
  created_at timestamptz default now()
);

create table if not exists transformations (
  id uuid primary key default gen_random_uuid(),
  member_name text not null,
  duration_weeks int not null,
  goal_tag text not null,
  before_image_url text not null,
  after_image_url text not null,
  quote text,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  goal text not null,
  selected_plan_id uuid references membership_tiers(id) on delete set null,
  preferred_start_date date,
  message text,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

alter table trainers enable row level security;
alter table membership_tiers enable row level security;
alter table classes enable row level security;
alter table transformations enable row level security;
alter table leads enable row level security;
alter table newsletter_subscribers enable row level security;

create policy "Public active trainers" on trainers for select using (is_active = true);
create policy "Public membership tiers" on membership_tiers for select using (true);
create policy "Public classes" on classes for select using (true);
create policy "Public published transformations" on transformations for select using (is_published = true);
create policy "Public lead submissions" on leads for insert with check (true);
create policy "Public newsletter signup" on newsletter_subscribers for insert with check (true);
