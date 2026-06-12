-- Members table: one row per signed-in parent.
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).

create table if not exists public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

alter table public.members enable row level security;

create policy "Members can view their own row"
  on public.members for select
  using (auth.uid() = id);

create policy "Members can insert their own row"
  on public.members for insert
  with check (auth.uid() = id);

create policy "Members can update their own row"
  on public.members for update
  using (auth.uid() = id);
