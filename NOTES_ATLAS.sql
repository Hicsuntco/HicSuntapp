-- ─────────────────────────────────────────────────────────────────────────
-- Atlas Vivant · pays révélés — à exécuter UNE FOIS dans l'éditeur SQL
-- du projet Supabase (Dashboard → SQL Editor → New query → coller → Run).
--
-- Sans cette table, l'écran Atlas reste en brume totale pour tout le monde
-- (aucun pays fictif n'est affiché à la place) : la fonctionnalité attend
-- cette table pour devenir réelle.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.atlas_countries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  country_iso text not null,                       -- ISO 3166-1 alpha-3
  status text not null default 'explored' check (status in ('explored','visited')),
  first_unlocked_at timestamptz not null default now(),
  visited_at timestamptz,
  source text,                                      -- ex: destination de l'itinéraire déclencheur
  unique (user_id, country_iso)
);

alter table public.atlas_countries enable row level security;

-- Chacun ne voit, ne débloque et ne met à jour que ses propres pays —
-- même principe que "travel_companions" (voir NOTES_MON_CERCLE.sql).
create policy "atlas_select_own" on public.atlas_countries
  for select using (auth.uid() = user_id);

create policy "atlas_insert_own" on public.atlas_countries
  for insert with check (auth.uid() = user_id);

create policy "atlas_update_own" on public.atlas_countries
  for update using (auth.uid() = user_id);

-- Le client (atlas.js, fonction _atlasUnlockCountry) envoie déjà "user_id"
-- dans le corps de la requête d'insertion — même schéma que
-- "itineraries"/"travel_companions" existants. Les policies ci-dessus
-- vérifient juste que ce user_id correspond à la personne connectée.
--
-- Débloquer un pays = simple INSERT (pas d'upsert) grâce à la contrainte
-- unique (user_id, country_iso) : le code client sait sans ambiguïté que
-- c'est une PREMIÈRE découverte quand l'insertion réussit (201), et que le
-- pays était déjà débloqué quand elle échoue pour cause de doublon (409) —
-- pas besoin de comparer des timestamps. L'animation de dévoilement n'est
-- déclenchée que sur un vrai 201.
