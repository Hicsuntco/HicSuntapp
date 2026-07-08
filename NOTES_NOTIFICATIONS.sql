-- ─────────────────────────────────────────────────────────────────────────
-- Notifications · centre de notifications in-app — à exécuter UNE FOIS dans
-- l'éditeur SQL du projet Supabase (Dashboard → SQL Editor → New query →
-- coller → Run).
--
-- Sans cette table, l'écran Notifications reste vide pour tout le monde
-- (aucune notification fictive n'est affichée à la place) : la
-- fonctionnalité attend cette table pour devenir réelle.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null default '',
  kind text not null default 'info',      -- ex: 'itinerary_ready', 'info'
  link text,                              -- action optionnelle (ex: id de voyage à ouvrir)
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

-- Chacun ne voit, ne crée et ne met à jour (marquer comme lue) que ses
-- propres notifications — même principe que "atlas_countries"
-- (voir NOTES_ATLAS.sql) et "travel_companions" (voir NOTES_MON_CERCLE.sql).
create policy "notif_select_own" on public.notifications
  for select using (auth.uid() = user_id);

create policy "notif_insert_own" on public.notifications
  for insert with check (auth.uid() = user_id);

create policy "notif_update_own" on public.notifications
  for update using (auth.uid() = user_id);

-- Le client (app.js, fonction _createNotification) envoie déjà "user_id"
-- dans le corps de la requête d'insertion — même schéma que
-- "itineraries"/"atlas_countries" existants. Les policies ci-dessus
-- vérifient juste que ce user_id correspond à la personne connectée.
--
-- "read" passe à true via un PATCH côté client à l'ouverture de l'écran
-- Notifications (marquage silencieux, pas d'action explicite requise de
-- la part de l'utilisateur pour "consommer" une notification déjà vue).
