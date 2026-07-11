/* ── HIC SUNT · delete-account — Edge Function (Supabase) ─────────────────
   Supprime définitivement le compte de l'utilisateur authentifié et
   toutes ses données. Exigé par Apple (règle App Store 5.1.1(v)) : une app
   qui permet de créer un compte doit permettre de le supprimer depuis
   l'app elle-même, pas seulement sur demande par e-mail.

   Déploiement : coller l'intégralité de ce fichier dans Supabase Dashboard
   → Edge Functions → New function (nom : "delete-account") → Deploy.
   Aucun secret à configurer (SUPABASE_URL/SUPABASE_ANON_KEY/
   SUPABASE_SERVICE_ROLE_KEY injectés automatiquement).

   Contrat HTTP :
     POST /functions/v1/delete-account
     Headers: apikey: <anon key>, Authorization: Bearer <sb_token utilisateur>
     (aucun corps requis — l'utilisateur à supprimer est celui du token)
     → 200 {"ok":true}
     → 401 si le token ne correspond à aucune session réelle
     → 500 en cas d'échec (voir "error" dans la réponse)

   Supprime, dans l'ordre, toutes les lignes appartenant à l'utilisateur
   dans les tables applicatives, PUIS le compte auth.users lui-même — on ne
   se repose pas sur "on delete cascade" seul : certaines tables (dont
   "itineraries", créée avant ce dépôt) ne sont pas garanties d'avoir cette
   contrainte, un échec de suppression explicite est plus sûr qu'un
   cascade supposé. ── */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/* Toutes les tables applicatives connues qui portent une colonne "user_id"
   scopée à un compte (voir NOTES_*.sql + les appels REST du client). Ajouter
   ici toute nouvelle table utilisateur créée à l'avenir, sinon elle survit
   silencieusement à une suppression de compte. */
const USER_SCOPED_TABLES = [
  'itineraries',
  'notifications',
  'travel_companions',
  'atlas_countries',
  'generation_jobs',
];

function json(body: unknown, status = 200){
  return new Response(JSON.stringify(body), { status, headers: { ...CORS_HEADERS, 'content-type': 'application/json' } });
}

Deno.serve(async (req: Request) => {
  if(req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if(req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  try{
    const authHeader = req.headers.get('Authorization') || '';
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if(userErr || !userData || !userData.user){
      return json({ error: 'authentification requise' }, 401);
    }
    const userId = userData.user.id;

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    for(const table of USER_SCOPED_TABLES){
      const { error } = await admin.from(table).delete().eq('user_id', userId);
      /* best-effort par table : une table absente ou déjà vide ne doit pas
         empêcher la suppression du reste — seule l'étape finale (compte
         auth) doit vraiment réussir pour renvoyer un succès. */
      if(error) console.warn('[delete-account] '+table+':', error.message);
    }
    /* "profiles" est indexée par "id" (= user id), pas "user_id" — voir
       checkProfile()/app.js. */
    try{ await admin.from('profiles').delete().eq('id', userId); }
    catch(e){ console.warn('[delete-account] profiles:', e); }

    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if(delErr) throw delErr;

    return json({ ok: true });
  }catch(e: any){
    return json({ error: String(e && e.message || e) }, 500);
  }
});
