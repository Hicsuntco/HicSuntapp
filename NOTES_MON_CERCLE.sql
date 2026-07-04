-- ─────────────────────────────────────────────────────────────────────────
-- Mon Cercle · compagnons de route — à exécuter UNE FOIS dans l'éditeur SQL
-- du projet Supabase (Dashboard → SQL Editor → New query → coller → Run).
--
-- Sans cette table, le panneau "Mon Cercle" du profil reste vide (aucune
-- fausse donnée n'est affichée à la place) : la fonctionnalité attend cette
-- table pour devenir réelle.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.travel_companions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.travel_companions enable row level security;

-- Chacun ne voit, n'ajoute et ne retire que ses propres compagnons —
-- ce n'est pas un cercle mutuel (pas d'acceptation), juste une liste
-- personnelle de qui vous accompagne en voyage.
create policy "select own companions" on public.travel_companions
  for select using (auth.uid() = user_id);

create policy "insert own companions" on public.travel_companions
  for insert with check (auth.uid() = user_id);

create policy "delete own companions" on public.travel_companions
  for delete using (auth.uid() = user_id);

-- Le client (app.js, fonction addCompanion) envoie déjà "user_id" dans le
-- corps de la requête d'insertion — même schéma que la table "itineraries"
-- existante. La policy ci-dessus vérifie juste que ce user_id correspond
-- bien à la personne connectée.
