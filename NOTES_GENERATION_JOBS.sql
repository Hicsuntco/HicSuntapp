-- ─────────────────────────────────────────────────────────────────────────
-- Génération d'itinéraire en arrière-plan (Partie C) — à exécuter UNE FOIS
-- dans l'éditeur SQL du projet Supabase (Dashboard → SQL Editor → New query
-- → coller → Run).
--
-- Sert de file d'attente + suivi de progression pour la nouvelle Edge
-- Function "generate-itinerary" (voir supabase-functions/generate-itinerary.ts) :
-- le client crée une ligne "pending", la fonction la fait vivre elle-même
-- (running → done/error) pendant qu'elle continue de générer en arrière-plan,
-- indépendamment du fait que l'app soit encore ouverte ou non.
--
-- Contrairement à "notifications"/"travel_companions", le client n'écrit
-- JAMAIS directement sur cette table : c'est l'Edge Function (clé
-- service_role, qui contourne la RLS) qui possède tout le cycle de vie de
-- la ligne. Le client n'a besoin que de LIRE sa propre ligne pour faire du
-- polling de progression pendant que l'app reste ouverte.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',       -- 'pending' | 'running' | 'done' | 'error'
  progress numeric not null default 0,           -- 0..100, pour la barre de progression
  phase text not null default 'queued',          -- libellé humain de l'étape en cours
  state jsonb not null,                          -- snapshot des réponses du questionnaire
  result_itinerary_id uuid,                      -- id du voyage créé dans "itineraries" une fois prêt
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table public.generation_jobs enable row level security;

-- Lecture seule côté client (polling de progression) — aucune policy
-- insert/update/delete : ces écritures passent exclusivement par la clé
-- service_role de l'Edge Function, qui contourne la RLS.
create policy "genjobs_select_own" on public.generation_jobs
  for select using (auth.uid() = user_id);
