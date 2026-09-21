-- Execute uma vez no SQL Editor do projeto Supabase da beta.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  city_state text,
  whatsapp text,
  instagram text,
  address text,
  photo_processing_consent_at timestamptz,
  email_marketing boolean not null default false,
  whatsapp_marketing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.journeys (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{"answers":[],"photos":{},"favorites":[],"completed":false}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (
    user_id, full_name, city_state, whatsapp, instagram, address,
    photo_processing_consent_at, email_marketing, whatsapp_marketing
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Cliente'),
    new.raw_user_meta_data->>'city_state',
    nullif(new.raw_user_meta_data->>'whatsapp',''),
    nullif(new.raw_user_meta_data->>'instagram',''),
    nullif(new.raw_user_meta_data->>'address',''),
    (new.raw_user_meta_data->>'photo_processing_consent_at')::timestamptz,
    coalesce((new.raw_user_meta_data->>'email_marketing')::boolean, false),
    coalesce((new.raw_user_meta_data->>'whatsapp_marketing')::boolean, false)
  ) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.journeys enable row level security;
alter table public.feedback enable row level security;

create policy "profiles own row" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "journeys own row" on public.journeys for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "feedback own rows" on public.feedback for select using (auth.uid() = user_id);
create policy "feedback insert own rows" on public.feedback for insert with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('private-photos', 'private-photos', false, 15728640, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "photos own folder read" on storage.objects for select
using (bucket_id = 'private-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos own folder insert" on storage.objects for insert
with check (bucket_id = 'private-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos own folder update" on storage.objects for update
using (bucket_id = 'private-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos own folder delete" on storage.objects for delete
using (bucket_id = 'private-photos' and (storage.foldername(name))[1] = auth.uid()::text);
