-- ─────────────────────────────────────────────────────────────
-- Tabella per contare le partite/aperture delle app
-- Da eseguire UNA VOLTA in Supabase:
--   progetto  →  SQL Editor  →  incolla tutto  →  Run
-- ─────────────────────────────────────────────────────────────

create table if not exists public.pings (
  id         bigint generated always as identity primary key,
  app        text        not null,
  mode       text,
  diff       text,
  created_at timestamptz not null default now()
);

create index if not exists pings_app_date_idx
  on public.pings (app, created_at desc);

alter table public.pings enable row level security;

-- chiunque può registrare un ping (l'app scrive con la chiave anon pubblica)
drop policy if exists "pings insert anon" on public.pings;
create policy "pings insert anon"
  on public.pings for insert
  to anon, authenticated
  with check (true);

-- chiunque può leggere il conteggio (serve alla dashboard)
drop policy if exists "pings select anon" on public.pings;
create policy "pings select anon"
  on public.pings for select
  to anon, authenticated
  using (true);

-- ─────────────────────────────────────────────────────────────
-- Verifica: quante partite oggi, per app
--   select app, count(*) from public.pings
--   where created_at >= date_trunc('day', now())
--   group by app;
--
-- Pulizia dei dati vecchi (facoltativa, da lanciare ogni tanto):
--   delete from public.pings where created_at < now() - interval '90 days';
-- ─────────────────────────────────────────────────────────────
