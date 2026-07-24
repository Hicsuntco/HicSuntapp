/* ── HIC SUNT · generate-itinerary — Edge Function (Supabase) ─────────────
   Port serveur du moteur de génération de generate.js (app cliente), pour
   que la génération continue même si l'app est fermée (iOS Safari ne peut
   pas exécuter de JS en arrière-plan).

   ⚠️ MAINTENANCE : ce fichier est une COPIE portée en TypeScript/Deno de la
   logique de generate.js (prompts, orchestration, mise en forme du résultat).
   Toute modification de prompt ou de logique de génération faite dans
   generate.js doit être répercutée ICI AUSSI, sinon les deux chemins de
   génération (synchrone client / asynchrone serveur) divergent en silence.

   Déploiement : coller l'intégralité de ce fichier dans Supabase Dashboard
   → Edge Functions → New function (nom : "generate-itinerary") → Deploy.
   Aucun secret à configurer : SUPABASE_URL, SUPABASE_ANON_KEY et
   SUPABASE_SERVICE_ROLE_KEY sont injectés automatiquement dans l'environnement
   de chaque fonction Supabase.

   Contrat HTTP :
     POST /functions/v1/generate-itinerary
     Headers: apikey: <anon key>, Authorization: Bearer <sb_token utilisateur>
     Body: { "state": { destination, origin, dateFrom, dateTo, travelers,
                         budget, rythme, styles, interests, occasion,
                         flightOut, flightIn, dream, childrenCount,
                         childrenAges, transport, dietary, alreadyDone,
                         fitnessLevel, accomStyle, createTab } }
     → 202 { jobId, status:'pending' }  (la génération continue en arrière-plan)
     → 401 si pas de session utilisateur réelle valide
     → 400 si "state" est manquant/invalide
   ────────────────────────────────────────────────────────────────────── */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* ── appel du moteur IA existant (super-endpoint, déjà en prod) ─────────
   Mêmes identifiants que ceux utilisés côté client (generate.js) — ce
   n'est pas un secret sensible, c'est la clé "anon" publique du projet,
   déjà exposée dans le bundle JS servi au navigateur. */
const SUPABASE_ENDPOINT = 'https://lucbxwxcismnvcdnctau.supabase.co/functions/v1/super-endpoint';
const SUPABASE_ANON_KEY_FOR_ENDPOINT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Y2J4d3hjaXNtbnZjZG5jdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODc0NDYsImV4cCI6MjA1OTk2MzQ0Nn0.6GPNP_GFoJtJ9vkMX5JJNANaHzUUjIg7kGY3LGc6lqM';
const SUPABASE_HEADERS = { 'content-type': 'application/json', 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY_FOR_ENDPOINT };

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 1 — constantes & petits helpers purs (port verbatim generate.js)
   ═══════════════════════════════════════════════════════════════════════ */

const GEN_KINDS = ['plane','fork','droplet','wave','peaks','arch','leaf','sun','moon','bed','star','camera','ticket','pin','compass'];
const GEN_SKY = ['sun','cloud','rain'];
const TAG_MAP: Record<string, [string,string]> = {
  plane:['plane','Transfert'], fork:['fork','Table'], droplet:['droplet','Détente'],
  wave:['wave','Océan'], peaks:['peaks','Marche'], arch:['arch','Patrimoine'],
  leaf:['leaf','Nature'], sun:['sun','Plein air'], moon:['moon','Soirée'],
  bed:['bed','Repos'], star:['star','Temps fort'], camera:['camera','Photo'],
  ticket:['ticket','Expérience'], pin:['pin','Étape'], compass:['compass','Exploration'],
};
const KIND_CATEGORY: Record<string,string> = {
  peaks:'hike', leaf:'hike', compass:'hike',
  wave:'beach', droplet:'spa', fork:'food', moon:'food',
  arch:'culture', camera:'culture', star:'culture', ticket:'culture',
  sun:'outdoor', plane:'transit', bed:'transit', pin:'culture',
};
const THEME_PALETTES: Record<string, Record<string,string>> = {
  tropical:    { hike:'#2D9E6B', beach:'#E87A4A', spa:'#F0C060', food:'#D45A30', culture:'#C4803A', outdoor:'#48B89A', transit:'#7DA898' },
  tropical_io: { hike:'#3AAE8A', beach:'#4AC8E0', spa:'#E87A9A', food:'#E89A4A', culture:'#A87BD4', outdoor:'#60C8B0', transit:'#7DAAB8' },
  desert:      { hike:'#D4943A', beach:'#D9B870', spa:'#E8A070', food:'#D4522A', culture:'#B08A3A', outdoor:'#D4C06A', transit:'#A89572' },
  steppe:      { hike:'#7A9E8A', beach:'#5A8AAA', spa:'#B0A0D4', food:'#C0804A', culture:'#8A7A6A', outdoor:'#9ABAC0', transit:'#8A9EA8' },
  alpine:      { hike:'#3A9E7E', beach:'#4A8EC9', spa:'#9B8AD4', food:'#D47A3A', culture:'#6A96B8', outdoor:'#4ABECE', transit:'#8AA4A8' },
  andean:      { hike:'#8A6A3A', beach:'#C0903A', spa:'#A880C0', food:'#D06040', culture:'#C0A040', outdoor:'#6A9860', transit:'#907060' },
  urban_asia:  { hike:'#4A6AAA', beach:'#4A9FBE', spa:'#E06090', food:'#E05030', culture:'#7A50C0', outdoor:'#D0A030', transit:'#8090A8' },
  urban:       { hike:'#5AAE6E', beach:'#4A9FBE', spa:'#C97AC9', food:'#D4854A', culture:'#7A65D4', outdoor:'#D4A84A', transit:'#8A9E8A' },
  mediterranean:{ hike:'#5A9A5A', beach:'#3A9EC9', spa:'#E8A87A', food:'#D44A2A', culture:'#D4943A', outdoor:'#4ABDB0', transit:'#A89880' },
  savanna:     { hike:'#8AAA3A', beach:'#D0A040', spa:'#E09060', food:'#C05030', culture:'#B07030', outdoor:'#70A850', transit:'#9A8060' },
  caribbean:   { hike:'#3AAA6A', beach:'#30C0C0', spa:'#E070B0', food:'#E0A030', culture:'#C06030', outdoor:'#60C880', transit:'#70A0A8' },
};
const OCCASIONS = [
  { id:'lune-de-miel', label:'Lune de miel' },
  { id:'anniversaire', label:'Anniversaire' },
  { id:'evjf',         label:'EVJF' },
  { id:'evg',          label:'EVG' },
  { id:'famille',      label:'En famille' },
  { id:'solo',         label:'En solo' },
  { id:'amis',         label:'Entre amis' },
  { id:'bien-etre',    label:'Retraite bien-être' },
];
const FLIGHT_BANDS: Record<string, [number,number]> = {
  court:[80,320], moyen:[250,550], long:[600,1050], tresLong:[800,1450],
};
const ACT_PRICE: Record<string,number> = {peaks:78,arch:55,leaf:62,wave:95,droplet:48,fork:120,sun:52,star:88,camera:60,ticket:70,moon:64,compass:58,pin:50,plane:0,bed:0};

function _clampInt(v:any, lo:number, hi:number, dflt:number){ const n=Math.round(Number(v)); return isFinite(n)?Math.max(lo,Math.min(hi,n)):dflt; }
function _kind(x:string){ return GEN_KINDS.includes(x)?x:'pin'; }
function _stayIcon(type:string){
  const t=(type||'').toLowerCase();
  if(/mer|océan|ocean|plage|beach|front/.test(t)) return 'wave';
  if(/villa|piscine|pool/.test(t)) return 'droplet';
  if(/lodge|jungle|nature|tente|camp|safari|éco|eco/.test(t)) return 'leaf';
  if(/riad|palais|palace|temple|fort|kasbah|ryokan|maison|demeure/.test(t)) return 'arch';
  if(/sommet|montagne|chalet|refuge/.test(t)) return 'peaks';
  return 'bed';
}
function _occasionLabel(id:string|null){
  const o = id ? OCCASIONS.find(function(x){ return x.id===id; }) : null;
  return o ? o.label : null;
}

/* ── contrainte géographique dynamique (port verbatim) ── */
function _suggestZone(d:string, dc:number, rythme:string){
  if(d.includes('sardaigne')){
    return dc<=4 ? 'sud (Cagliari, Chia, Villasimius, Teulada) OU nord (Olbia, Costa Smeralda, Palau, La Maddalena)' : 'sud+centre (Cagliari → Oristano) OU nord+centre (Olbia → Nuoro)';
  }
  if(d.includes('thaïlande')||d.includes('bangkok')){
    return dc<=4 ? 'Bangkok et ses environs immédiats (Ayutthaya, Kanchanaburi)' : 'nord (Chiang Mai+Pai) OU sud (îles+plages)';
  }
  if(d.includes('bali')){
    return 'Ubud+Seminyak+Canggu (centre-ouest) OU Ubud+Amed+Sidemen (centre-est)';
  }
  if(d.includes('maroc')){
    return dc<=4 ? 'Marrakech et ses environs (Essaouira, Atlas, vallées)' : 'Marrakech+désert (Ouarzazate+Merzouga)';
  }
  if(d.includes('japon')){
    return dc<=4 ? 'Tokyo et ses environs (Kamakura, Nikko, Hakone)' : 'Tokyo+Kyoto+Osaka (axe Shinkansen)';
  }
  if(d.includes('italie')){
    return dc<=4 ? 'Rome et ses environs OU Toscane uniquement' : 'Rome+Naples+Amalfi OU Florence+Sienne+Cinque Terre';
  }
  if(d.includes('grèce')){
    return dc<=4 ? 'Athènes+une île (Hydra ou Égine)' : 'Athènes+Santorin+Mykonos';
  }
  return 'une région cohérente géographiquement, étapes dans un rayon de 60-80km';
}
function _geoConstraintDirective(dest:string, dc:number, rythme:string){
  const d=(dest||'').toLowerCase();
  const r=(rythme||'Équilibré').toLowerCase();
  const isIsland=['sardaigne','sicile','bali','sri lanka','islande','crete','corse','reunion','martinique','guadeloupe','malte','maldives','chypre','majorque','minorque','ibiza','capri','sicily','madere','canaries','lanzarote','fuerteventura'].some(function(k){return d.includes(k);});
  const rythmeKm:Record<string,number> = isIsland
    ? {'intensif':50,'équilibré':35,'lent':20,'contemplati':15,'détente':12}
    : {'intensif':120,'équilibré':80,'lent':45,'contemplati':30,'détente':25};
  const kmPerDay=Object.entries(rythmeKm).find(function(e){return r.includes(e[0]);});
  const kmDay=kmPerDay?kmPerDay[1]:(isIsland?35:80);
  const totalKm=dc*kmDay;
  let directive='';
  const zones=Math.max(1,Math.min(dc,Math.round(totalKm/80)));
  if(isIsland){
    if(totalKm<=80){
      const zone=_suggestZone(d,dc,rythme);
      directive='CONTRAINTE GÉOGRAPHIQUE STRICTE (île) : avec '+dc+' jours en rythme '+rythme+', rester dans UNE seule zone locale (~'+Math.round(totalKm)+'km max de déplacement). '
        +'Zone recommandée : '+zone+'. INTERDIT de traverser l\'île. Étapes à moins de 40km les unes des autres.';
    } else if(totalKm<=160){
      directive='CONTRAINTE GÉOGRAPHIQUE (île) : avec '+dc+' jours en rythme '+rythme+', couvrir UNE zone principale + une excursion (~'+Math.round(totalKm)+'km). '
        +'Ex Sardaigne : rester dans le sud OU le nord. Pas de traversée complète.';
    } else {
      directive='CONTRAINTE GÉOGRAPHIQUE (île) : avec '+dc+' jours, traversée possible mais LINÉAIRE (~'+Math.round(totalKm)+'km). '
        +'Choisir un axe nord→sud OU côte est→côte ouest et s\'y tenir sans retour en arrière.';
    }
  } else {
    const COUNTRY_KM:Record<string,number>={
      france:1000,espagne:1000,italie:1300,allemagne:850,portugal:550,
      maroc:1500,tunisie:750,algérie:2000,égypte:1500,
      jordanie:420,turquie:1600,grèce:700,
      thaïlande:1800,vietnam:1800,cambodge:500,laos:700,
      japon:2400,chine:4000,inde:3000,népal:800,
      pérou:1800,colombie:1800,mexique:2000,brésil:4000,
      kenya:850,tanzanie:950,éthiopie:1600,
      australie:4000,nouvelle:1600,
    };
    const countrySize=Object.entries(COUNTRY_KM).find(function(e){return d.includes(e[0]);});
    const csKm=countrySize?countrySize[1]:1200;
    const ratio=Math.min(1,totalKm/csKm);
    if(ratio<=0.20){
      const zone=_suggestZone(d,dc,rythme);
      directive='CONTRAINTE GÉOGRAPHIQUE STRICTE : avec '+dc+' jours en rythme '+rythme+', couvrir UNE seule région (~'+Math.round(totalKm)+'km sur '+csKm+'km de pays). '
        +'Zone recommandée : '+zone+'. INTERDIT de traverser tout le pays.';
    } else if(ratio<=0.45){
      directive='CONTRAINTE GÉOGRAPHIQUE : avec '+dc+' jours, couvrir maximum 2 zones adjacentes (~'+Math.round(totalKm)+'km). '
        +'Axe logique (nord→sud OU est→ouest). Environ '+zones+' étapes. Pas de retour en arrière.';
    } else if(ratio<=0.70){
      directive='CONTRAINTE GÉOGRAPHIQUE : traversée partielle possible (~'+Math.round(totalKm)+'km / '+csKm+'km). '
        +'Progression LINÉAIRE sans zigzags. Chaque étape dans la même direction que la précédente.';
    } else {
      directive='CONTRAINTE GÉOGRAPHIQUE : circuit complet envisageable (~'+Math.round(totalKm)+'km). '
        +'Trajet CIRCULAIRE ou LINÉAIRE cohérent. Jamais revenir sur ses pas sauf aéroport départ.';
    }
  }
  return directive;
}
function _zoneFromDream(dest:string, dream:string){
  if(!dream) return '';
  const d=dream.toLowerCase(), dest_l=(dest||'').toLowerCase();
  if(/sud\b|south\b|méridional/.test(d)) return '⚠️ ZONE IMPOSÉE PAR LE CLIENT : SUD uniquement. Aucune étape au nord ou au centre.';
  if(/nord\b|north\b|septentrion/.test(d)) return '⚠️ ZONE IMPOSÉE PAR LE CLIENT : NORD uniquement. Aucune étape au sud ou au centre.';
  if(/\best\b|orient/.test(d)) return '⚠️ ZONE IMPOSÉE PAR LE CLIENT : EST uniquement. Côte est.';
  if(/\bouest\b|west\b|occident/.test(d)) return '⚠️ ZONE IMPOSÉE PAR LE CLIENT : OUEST uniquement. Côte ouest.';
  if(dest_l.includes('sardaigne')){
    if(/cagliari|chia|villasimius|sulcis|campidano|iglesiente/.test(d)) return '⚠️ ZONE : Extrême SUD Sardaigne (Cagliari, Chia, Villasimius, Sulcis). Aucune étape au-delà de Carbonia/Oristano.';
    if(/alghero|sassari|castelsardo|bosa|nurra/.test(d)) return '⚠️ ZONE : NORD-OUEST Sardaigne (Alghero, Sassari, Bosa). Aucune étape au sud.';
    if(/olbia|costa smeralda|gallura|palau|maddalena/.test(d)) return '⚠️ ZONE : NORD-EST Sardaigne / Gallura (Olbia, Costa Smeralda, Palau). Aucune étape au sud.';
    if(/nuoro|barbagia|ogliastra|oliena|orgosolo/.test(d)) return '⚠️ ZONE : CENTRE-EST Sardaigne (Nuoro, Barbagia, Ogliastra). Pas de côte.';
  }
  return '';
}
function _themeForDestination(dest:string, region:string, country:string){
  const s=((dest||'')+' '+(region||'')+' '+(country||'')).toLowerCase();
  if(/maroc|sahara|jordanie|égypte|namibie|dubai|émirats|oman|tunisie|libye|arabie/.test(s)) return 'desert';
  if(/islande|mongolie|kirghizstan|kazakhstan/.test(s)) return 'steppe';
  if(/pérou|bolivie|équateur|népal|himalaya|tibet|patagonie|andes/.test(s)) return 'andean';
  if(/alpes|suisse|autriche|dolomites|pyrénées|norvège|écosse|finlande|suède/.test(s)) return 'alpine';
  if(/japon|tokyo|kyoto|corée|séoul|singapour|hong kong|taipei|taiwan/.test(s)) return 'urban_asia';
  if(/paris|londres|berlin|new york|amsterdam|barcelone|madrid|lisbonne.*city/.test(s)) return 'urban';
  if(/italie|grèce|espagne|portugal|croatie|sardaigne|sicile|provence|méditerran|malte|chypre/.test(s)) return 'mediterranean';
  if(/kenya|tanzanie|rwanda|ouganda|zimbabwe|botswana|afrique.*sud|namibie|éthiopie|sénégal/.test(s)) return 'savanna';
  if(/mexique|cuba|jamaïque|martinique|guadeloupe|costa rica|panama|colombie|brésil.*côte|caraïbes/.test(s)) return 'caribbean';
  if(/maldives|réunion|maurice|seychelles|madagascar|mozambique/.test(s)) return 'tropical_io';
  return 'tropical';
}
function _costOfLivingFactor(dest:string, region:string, country:string){
  const s=((dest||'')+' '+(region||'')+' '+(country||'')).toLowerCase();
  if(/japon|tokyo|kyoto|suisse|norvège|islande|new york|émirats|dubai|singapour|hong kong/.test(s)) return 1.25;
  if(/thaïlande|vietnam|cambodge|laos|indonésie|bali|sri lanka|inde|népal|philippines|maroc|égypte|kenya|tanzanie|madagascar/.test(s)) return 0.55;
  if(/portugal|grèce|croatie|mexique|pérou|colombie|turquie|géorgie|albanie/.test(s)) return 0.75;
  return 1;
}
function _flightBand(dest:string, region:string, country:string){
  const s=((dest||'')+' '+(region||'')+' '+(country||'')).toLowerCase();
  if(/maroc|italie|espagne|portugal|grèce|croatie|sardaigne|sicile|provence|méditerran|tunisie|malte|chypre/.test(s)) return 'court';
  if(/turquie|égypte|émirats|dubai|jordanie|géorgie|albanie|israël|liban|arménie/.test(s)) return 'moyen';
  if(/thaïlande|vietnam|cambodge|laos|indonésie|bali|sri lanka|inde|népal|philippines|kenya|tanzanie|madagascar|maldives|birmanie/.test(s)) return 'long';
  if(/japon|corée|chine|singapour|hong kong|australie|nouvelle-zélande|pérou|colombie|mexique|brésil|argentine|chili|états-unis|canada|polynésie|tahiti|fidji/.test(s)) return 'tresLong';
  return 'long';
}
function _flightEstimate(dest:string, region:string, country:string, travelers:number){
  const band=FLIGHT_BANDS[_flightBand(dest,region,country)];
  const perPerson=Math.round((band[0]+band[1])/2);
  return perPerson*Math.max(1,travelers||1);
}

/* ── traduction des réponses du questionnaire en consignes concrètes (port verbatim) ── */
const RYTHME_MOMENTS:Record<string,number>={'Lent':2,'Équilibré':3,'Intense':4};
function _momentsPerDay(state:any){ return RYTHME_MOMENTS[state.rythme] || 3; }
function _accomStyleDirective(state:any){
  const a=state.accomStyle||'';
  if(!a||a==='L\'emplacement avant tout') return '';
  if(a==='Charme & histoire') return 'HÉBERGEMENT  -  IMPÉRATIF : maisons d\'hôtes, riads, agriturismi, mas, bastides  -  tenus par des locaux, histoire tangible, aucune chaîne.';
  if(a==='Design & contemporain') return 'HÉBERGEMENT  -  IMPÉRATIF : architecture remarquable, design soigné, matériaux nobles, service irréprochable. Boutique-hôtels primés.';
  if(a==='Nature & immersion') return 'HÉBERGEMENT  -  IMPÉRATIF : lodges, glamping luxe, écolodges, cabanes  -  vue directe sur la nature depuis le lit.';
  return '';
}
function _fitnessDirective(state:any){
  const f=state.fitnessLevel||'Modéré';
  if(f==='Tranquille') return 'MOBILITÉ : zéro randonnée, transports confortables, sites accessibles en véhicule, activités assises.';
  if(f==='Sportif') return 'NIVEAU SPORTIF : randonnées réelles (5-15km, dénivelé), vélo, kayak, outdoor exigeant.';
  if(f==='Extrême') return 'NIVEAU EXTRÊME : trails techniques, sommets, via ferrata, expéditions  -  pas de limite physique.';
  return 'NIVEAU MODÉRÉ : quelques heures de marche/jour (3-8km), pas de trek exigeant.';
}
function _rythmeDirective(state:any){
  const r=state.rythme||'Équilibré';
  if(r==='Lent') return 'RYTHME LENT : 1-2 activités/jour max, rester au même endroit plusieurs nuits, transferts <45min. Les après-midis libres sont un luxe, pas un oubli.';
  if(r==='Dense') return 'RYTHME DENSE : 3-4 activités/jour, journées 7h→21h, maximiser les expériences, peu de temps mort.';
  return 'RYTHME ÉQUILIBRÉ : 2-3 activités significatives/jour, matin actif, après-midi libre possible.';
}
function _childrenDirective(state:any){
  if(state.occasion!=='famille'&&state.travelers<3) return '';
  const count=state.childrenCount||1;
  const countLbl=count+(count>1?' enfants':' enfant');
  if(!state.childrenAges) return 'FAMILLE avec '+countLbl+' : hébergements avec piscine et espace, activités adaptées tous âges (marche < 3km, visite < 1h30), rythme doux, sieste possible, restaurants family-friendly.';
  const ages=state.childrenAges;
  const hasToddler=/\b[0-3]\b/.test(ages);
  const hasPrimaire=/\b[4-9]\b|\b1[0-2]\b/.test(ages);
  const hasAdo=/\b1[3-9]\b/.test(ages);
  let d='FAMILLE avec '+countLbl+' (âges : '+ages+')  -  contraintes absolues :';
  if(hasToddler) d+=' BÉBÉ/TOUT-PETIT : lit bébé obligatoire, transferts < 30min, sieste 13h-15h dans le planning, activités sensorielles (animaux, eau, couleurs), chaises hautes et menu enfant au restaurant.';
  if(hasPrimaire) d+=' ENFANTS PRIMAIRE : activités ludo-éducatives (animaux, ateliers, aventure accessible), piscine essentielle, horaires souples coucher.';
  if(hasAdo) d+=' ADOLESCENTS : activités à sensations (snorkeling, quad, accrobranche), lieux cool, wifi hébergement, pas "bébé".';
  d+=' INTERDIT : randonnées > 3km, musées sans espace interactif, restaurants huppés sans ambiance familiale, transferts > 1h avec moins de 5 ans.';
  return d;
}
function _dietaryDirective(state:any){
  if(!state.dietary) return '';
  return 'RÉGIME / ALLERGIES (vérifier CHAQUE restaurant proposé) : '+state.dietary+'. Mentionner explicitement si l\'adresse peut accommoder. Ne jamais proposer de restaurant incompatible.';
}
function _alreadyDoneDirective(state:any){
  if(!state.alreadyDone) return '';
  return 'DÉJÀ VU / À ÉVITER ABSOLUMENT : '+state.alreadyDone+'. Trouver des alternatives inédites. Ne pas répéter ces expériences, destinations ou types d\'activité.';
}
function _occasionDirective(state:any){
  const id=state.occasion;
  if(!id) return '';
  const map:Record<string,string>={
    'lune-de-miel':[
      '== LUNE DE MIEL  -  CE FILTRE S\'APPLIQUE À CHAQUE DÉCISION DE L\'ITINÉRAIRE ==',
      '* GÉOGRAPHIE : privilégier UNE ou DEUX zones maximum sur tout le séjour (pas de circuit qui change d\'hébergement tous les jours) — s\'installer et profiter, pas cocher des étapes. Un aller-retour lointain ne se justifie que par un séjour sur place d\'au moins 3-4 nuits.',
      '* HÉBERGEMENTS : suites ou chambres avec terrasse/vue privative, lit king, bain ou jacuzzi si possible. Structures intimistes (< 12 chambres) pour le sentiment de cocon. Zéro chambre standard face à un parking.',
      '* REPAS : dîners en tête-à-tête uniquement  -  tables isolées, éclairage tamisé, vue imprenable. Au moins 1 dîner d\'exception (gastronomique, pieds dans le sable, terrasse privée ou expérience unique). Jamais de buffets ou restaurants bruyants le soir.',
      '* MOMENTS ROMANTIQUES OBLIGATOIRES : (1) coucher de soleil structuré  -  en bateau, sur un toit ou depuis un belvédère secret ; (2) massage en duo avec nom du spa, type de soin et prix précis ; (3) expérience exclusive à deux  -  bateau privé, pique-nique sur plage déserte, balade à cheval au coucher du soleil.',
      '* RYTHME : jamais de réveil < 7h30. Après-midis libres pour flâner ensemble. Pas de journée "marathon touristique".',
      '* DÉTAILS QUI COMPTENT : pétales de roses à l\'arrivée si disponible, champagne offert, accès piscine privée, service de chambre romantique, notes de bienvenue.',
      '* PROHIBÉ : auberges, hôtels de chaîne sans âme, buffets, activités de groupe bondées, bus locaux.',
      '==════════════════════════════════════════════════════════════════════════════',
    ].join('\n'),
    'anniversaire':[
      '== ANNIVERSAIRE  -  CÉLÉBRATION AU CŒUR DE L\'ITINÉRAIRE ==',
      '* MOMENT CLÉ : identifier le jour J (milieu du séjour si non précisé) et le rendre inoubliable  -  dîner de gala, expérience exclusive, surprise locale.',
      '* Au moins 1 expérience "première fois" : activité jamais tentée, lieu d\'exception, table impossible à trouver seul.',
      '* Hébergements avec valeur ajoutée : vue, standing, service. Mentionner les formules anniversaire disponibles (gâteau, décoration, chambre surclassée).',
      '* 1 gem cachée réservée au jour J : spot secret, chemin non balisé, crique inaccessible normalement.',
      '* Ton : légèreté, plaisir, spontanéité  -  laisser du vide pour les coups de cœur imprévus.',
      '==════════════════════════════════════════════════════════',
    ].join('\n'),
    'evjf':[
      '== EVJF  -  PROGRAMME ENTRE FILLES, FESTIF DU DÉBUT À LA FIN ==',
      '* GÉOGRAPHIE : UNE seule ville/zone pour tout le séjour, jamais de circuit qui déplace le groupe — s\'installer dans une base festive et rayonner en excursions courtes depuis là.',
      '* HÉBERGEMENT : villa avec piscine privée ou grand appartement  -  espace commun pour soirées de groupe, si possible proche des quartiers de sortie.',
      '* ACTIVITÉS PRIORITAIRES : spa privatisé pour le groupe, cours de cuisine ou atelier local (céramique, cocktails, parfum), sunset rooftop ou bar avec vue, plage/piscine avec service.',
      '* VIE NOCTURNE OBLIGATOIRE (au moins 1 soir sur 2) : restaurants festifs avec ambiance et cocktails, bars/rooftops qui ferment tard, au moins 1 vraie boîte de nuit ou club nommé et réputé sur place  -  jamais une soirée qui se termine avant minuit sauf demande contraire.',
      '* ESTHÉTIQUE : lieux instagrammables mais authentiques  -  pas de kitch. Couleurs, architecture, lumière favorable.',
      '* Éviter : musées ennuyeux, randonnées épuisantes, hôtels formels. Favoriser mouvement, photos, rire, fête.',
      '* Budget repas/soirées : restaurants trendy avec cocktails + entrée boîte de nuit  -  intégrer les boissons et les entrées de club dans l\'estimation.',
      '==═════════════════════════════════',
    ].join('\n'),
    'evg':[
      '== EVG  -  ADRÉNALINE LE JOUR, FESTIF LE SOIR ==',
      '* GÉOGRAPHIE : UNE seule ville/zone pour tout le séjour, jamais de circuit qui déplace le groupe — s\'installer dans une base et rayonner en excursions courtes depuis là.',
      '* ACTIVITÉS JOUR : quad, karting, surf, accrobranche, paintball, plongée, parapente, 4x4  -  au moins 2 activités physiques intenses.',
      '* VIE NOCTURNE OBLIGATOIRE (au moins 1 soir sur 2) : bars à cocktails qui ferment tard, au moins 1 vraie boîte de nuit ou club nommé et réputé sur place (pas un club à touristes), ou une soirée locale authentique  -  jamais une soirée qui se termine avant minuit sauf demande contraire.',
      '* HÉBERGEMENTS : grande villa ou lodge avec espace commun (terrasse, piscine) pour le groupe, si possible proche des quartiers de sortie.',
      '* REPAS : grillades, BBQ, street food de qualité, portions généreuses, au moins 1 tablée conviviale.',
      '* Budget soirées : intégrer les boissons et les entrées de club/bar dans l\'estimation.',
      '* Éviter : gastronomie trop formelle, rythme lent. Chaque jour doit avoir une histoire à raconter.',
      '==═════════════════════════════════════════',
    ].join('\n'),
    'amis': [
      'ENTRE AMIS : partage, convivialité, expériences communes.',
      '* Hébergements avec espaces communs (villa, appartement, terrasse partagée).',
      '* Repas conviviaux : tablées, barbecue, street food de qualité, marchés.',
      '* Activités en groupe : randonnée, sports nautiques, visite culturelle.',
      '* 1 soirée mémorable par groupe (bar local avec musique live, restaurant festif).',
      '* Liberté individuelle possible dans la journée  -  se retrouver le soir.',
    ].join('\n'),
    'bien-etre': [
      '== RETRAITE BIEN-ÊTRE  -  RESSOURCEMENT ET DÉCONNEXION ==',
      '* GÉOGRAPHIE : UNE seule zone/un seul hébergement pour tout le séjour si possible  -  le ressourcement se construit dans la durée, pas en enchaînant les lieux.',
      '* HÉBERGEMENT : lieu calme et silencieux, isolé si possible, avec spa/piscine naturelle, jamais en zone bruyante ou nocturne.',
      '* RYTHME : très lent, jamais plus de 2 activités/jour, larges plages libres, jamais de réveil avant 8h imposé.',
      '* ACTIVITÉS PRIORITAIRES : soins spa/massage nommés avec prix, yoga ou méditation au lever du soleil, bains thermaux/naturels, alimentation saine et locale, marche douce en nature.',
      '* Éviter absolument : vie nocturne, transferts fréquents, activités à sensations fortes, rythme dense, groupes bruyants.',
      '* Ton : calme, présence, lenteur assumée  -  chaque jour doit laisser du temps ne rien faire.',
    ].join('\n'),
    'solo': [
      'VOYAGE EN SOLO : liberté, rencontres, immersion.',
      '* Hébergements favorisant les rencontres (guesthouses avec table d\'hôtes) sans sacrifier la qualité.',
      '* Activités réalisables seul : excursions avec guides locaux recommandés, petits groupes.',
      '* Tips de sécurité spécifiques à la destination intégrés naturellement.',
      '* Moments libres pour flâner : mercados, cafés de quartier, bibliothèques, parcs.',
      '* Signaler quand une activité est difficile seul et proposer l\'alternative solo-friendly.',
    ].join('\n'),
  };
  if(id==='famille') return _childrenDirective(state) || map['famille'] || [
    '== EN FAMILLE ==',
    '* Hébergements spacieux avec piscine, espaces verts, activités sur place.',
    '* Activités adaptées tous âges : animaux, eau, découvertes sensorielles.',
    '* Rythme doux, horaires souples, restaurants menu enfant.',
    '* Pas de longues randonnées ni de musées sans espace interactif.',
    '==══════════════',
  ].join('\n');
  return map[id]||'';
}
function _styleDirective(state:any){
  const styles=(state.styles||[]);
  if(!styles.length) return '';
  const lower=styles.join(' ').toLowerCase();
  const notes:string[]=[];
  if(lower.includes('aube')||lower.includes('lever')) notes.push('sites tôt le matin avant les foules, golden hour planifiée');
  if(lower.includes('habitant')) notes.push('tables d\'hôtes, repas chez l\'habitant, marchés de producteurs');
  if(lower.includes('locaux')||lower.includes('bar que')) notes.push('bars et restaurants exclusivement locaux, zéro touristique');
  if(lower.includes('marcher')||lower.includes('vue')) notes.push('randonnées avec point de vue exceptionnel, effort récompensé');
  if(lower.includes('flâner')||lower.includes('perdre')) notes.push('temps libres non planifiés, quartiers à explorer seul');
  if(lower.includes('histoire')) notes.push('hébergements avec âme et histoire, bâtisses remarquables');
  if(lower.includes('savoirs-faire')||lower.includes('rapporter')) notes.push('ateliers artisanaux, rencontres de producteurs, cours pratiques');
  if(lower.includes('foules')||lower.includes('fuir')) notes.push('destinations et horaires hors-afflux, sites alternatifs aux blockbusters');
  if(lower.includes('nager')||lower.includes('eaux')) notes.push('criques sauvages, spots de baignade non balisés');
  if(lower.includes('vivent')||lower.includes('comment les')) notes.push('quartiers résidentiels, marchés quotidiens, vie locale authentique');
  if(lower.includes('léger')||lower.includes('changé')) notes.push('voyage minimaliste, immersion profonde');
  if(lower.includes('manger le meilleur')) notes.push('meilleures tables locales de chaque étape');
  if(lower.includes('rouler')||lower.includes('road')) notes.push('road trip, haltes spontanées, hébergements variés au fil de la route');
  if(lower.includes('photographier')||lower.includes('photo')) notes.push('golden hours, belvédères secrets, sujets photographiques uniques');
  if(lower.includes('une seule chose')) notes.push('rythme ultra-lent, 1 expérience par jour, approfondissement');
  if(lower.includes('limites')||lower.includes('physiques')) notes.push('activités exigeantes, dépassement de soi');
  return notes.length ? 'MANIÈRE DE VOYAGER  -  intégrer dans chaque journée : '+notes.join(' · ')+'.' : '';
}
function _interestsDirective(state:any){
  const interests=(state.interests||[]);
  if(!interests.length) return '';
  const lower=interests.join(' ').toLowerCase();
  const notes:string[]=[];
  if(lower.includes('marchés de producteurs')) notes.push('marchés de producteurs locaux, horaires 7h-12h');
  if(lower.includes('criques')||lower.includes('sans chemin')) notes.push('plages et criques non balisées, accessibles à pied ou en bateau');
  if(lower.includes('restaurants que les guides')) notes.push('tables locales non touristiques, recommandations d\'habitants');
  if(lower.includes('randonnées avec vue')) notes.push('sentiers nommés avec dénivelé, point de vue exceptionnel à l\'arrivée');
  if(lower.includes('villages perchés')) notes.push('villages fortifiés, ruelles médiévales, loin des bus touristiques');
  if(lower.includes('couchers de soleil')) notes.push('belvédères secrets pour coucher de soleil, horaire précis');
  if(lower.includes('faune')||lower.includes('safaris')) notes.push('sorties safari avec guides nommés');
  if(lower.includes('temples')||lower.includes('spiritualité')) notes.push('sites spirituels hors affluence, heures de visite calmes');
  if(lower.includes('vignobles')||lower.includes('caves')) notes.push('domaines viticoles avec dégustation producteur');
  if(lower.includes('cours de cuisine')) notes.push('cours de cuisine chez un habitant ou chef local');
  if(lower.includes('plongée')||lower.includes('snorkeling')) notes.push('spots plongée/snorkeling avec prestataires locaux nommés');
  if(lower.includes('architecture')) notes.push('bâtiments remarquables, quartiers patrimoniaux');
  if(lower.includes('spas')||lower.includes('soins')||lower.includes('bains')) notes.push('spas ou hammams locaux avec noms et tarifs');
  if(lower.includes('musique')||lower.includes('culturelle')) notes.push('concerts live, scène musicale locale');
  if(lower.includes('vélo')||lower.includes('routes secondaires')) notes.push('itinéraires cyclables, location nommée');
  if(lower.includes('sources thermales')||lower.includes('bains naturels')) notes.push('thermes et sources naturelles avec conditions d\'accès');
  if(lower.includes('nautiques')) notes.push('kayak, voile, paddle, jet-ski avec prestataires');
  if(lower.includes('ateliers artisanaux')) notes.push('ateliers artisans locaux, savoir-faire régionaux');
  return notes.length ? 'EXPÉRIENCES PRIORITAIRES  -  au moins 1 par jour : '+notes.join(' · ')+'.' : '';
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 2 — brief & prompts (port verbatim, "state" en paramètre au lieu
   d'une variable globale — chaque requête a son propre "state" isolé)
   ═══════════════════════════════════════════════════════════════════════ */

function _travelerLabel(state:any){
  const n = state.travelers || 2;
  return n + ' voyageur' + (n>1?'s':'');
}
function buildBrief(state:any){
  const surprise=state.createTab==='surprise';
  const occ=_occasionLabel(state.occasion);
  let datesLine='Dates : non précisées', durationLine='', daysCount=7;
  if(state.dateFrom&&state.dateTo){
    const from=new Date(state.dateFrom), to=new Date(state.dateTo);
    const days=Math.round((to.getTime()-from.getTime())/86400000);
    const fmt=function(d:Date){return d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});};
    datesLine='Dates : '+fmt(from)+' au '+fmt(to);
    durationLine='Durée : '+days+' jour'+(days>1?'s':'');
    if(days>0) daysCount=days;
  }
  const flightsLine=(state.flightOut||state.flightIn)
    ?'Vols : aller '+(state.flightOut||'non renseigné')+' / retour '+(state.flightIn||'non renseigné'):'';
  const lines=[
    'Destination : '+(state.destination?state.destination:(surprise?'SURPRISE  -  choisis la destination la plus désirable pour ce profil':'')),
    'Départ : '+(state.origin||'Paris'),
    datesLine, durationLine,
    'Voyageurs : '+_travelerLabel(state),
    state.occasion==='famille' ? 'Enfants : '+state.childrenCount+(state.childrenCount>1?' enfants':' enfant')+(state.childrenAges?' (âges : '+state.childrenAges+')':'') : '',
    'Confort : '+(state.budget||'Confort'),
    'Rythme : '+(state.rythme||'Équilibré'),
    'Forme physique : '+(state.fitnessLevel||'Modéré'),
    'Transport préféré : '+(state.transport||'Mixte'),
    state.accomStyle ? 'Style hébergement souhaité : '+state.accomStyle : '',
    'Styles de voyage : '+((state.styles||[]).join(', ')||'variés'),
    'Intérêts : '+((state.interests||[]).join(', ')||'découverte générale'),
    'Occasion : '+(occ||'aucune'),
    state.dietary ? 'Régime / allergies : '+state.dietary : '',
    state.alreadyDone ? 'Déjà fait / à éviter : '+state.alreadyDone : '',
    flightsLine,
    (surprise?'Contraintes / à éviter : ':'Ce voyage représente : ')+(state.dream||' - '),
  ].filter(Boolean).join('\n');
  return {surprise:surprise, lines:lines, daysCount:daysCount};
}

const SKEL_BATCH_SIZE = 7;
const DAYS_BATCH_SIZE = 7;

/* genCtx : équivalent local (par requête) de state._genStays/_genLastSteps/
   _genAllSteps côté client — là-bas ce sont des propriétés mutables du
   "state" global ; ici chaque génération est isolée donc un simple objet
   passé en paramètre suffit, pas besoin de global mutable partagé. */
type GenCtx = { genStays: any[]; genLastSteps: any[]; genAllSteps: any[] };

function buildSkeletonPrompt(state:any, genCtx:GenCtx, dc:number, batchSize:number, offset:number){
  const b=buildBrief(state);
  const isFirst = offset===0;
  const n = Math.min(batchSize, dc-offset);
  const rythme = state.rythme||'Équilibré';
  const dest = state.destination||'';
  const geoConstraint = _geoConstraintDirective(dest, dc, rythme);
  const zoneConstraint = _zoneFromDream(dest, state.dream||'');
  const maxKm = rythme.includes('lent')||rythme.includes('déten')?80
    : rythme.includes('intensif')?250 : 150;
  const singleBaseDirective = ['evjf','evg','lune-de-miel','bien-etre'].indexOf(state.occasion)>=0
    ? '=== OCCASION "'+state.occasion.toUpperCase()+'" : BASE UNIQUE ===\nPrivilégier UNE SEULE zone/ville pour tout le séjour (deux maximum si le voyage dépasse 7 jours) — jamais de circuit qui déplace le groupe chaque jour. S\'installer dans une base fixe et rayonner en excursions courtes depuis là plutôt que d\'enchaîner les hébergements.'
    : '';
  const common=[
    singleBaseDirective,
    geoConstraint,
    zoneConstraint ? zoneConstraint : '',
    '=== ITINÉRAIRE GÉOGRAPHIQUEMENT COHÉRENT - RÈGLE ABSOLUE ===',
    'CRITIQUE : Conçois un CIRCUIT LOGIQUE qui ne revient JAMAIS en arrière. Imagine la carte réelle du pays.',
    'Le voyage doit suivre une BOUCLE ou une LIGNE continue : on avance toujours vers la destination suivante la plus proche, jamais de zigzag.',
    'INTERDIT ABSOLU : revenir dans une ville déjà visitée puis repartir (ex: Colombo -> Sud -> Ella -> Kandy -> Negombo -> Kandy -> Ella = INVALIDE car repasse 2x par Kandy et Ella).',
    'BON EXEMPLE (Sri Lanka) : Colombo (arrivée) -> Sigiriya/triangle culturel (nord) -> Kandy -> Ella/montagnes -> Yala (safari sud-est) -> côte sud (Mirissa, Tangalle) -> Negombo/Colombo (départ). Boucle fluide sans retour.',
    'BON EXEMPLE (Maroc) : Marrakech -> Aït Ben Haddou -> Ouarzazate -> Gorges du Dadès -> Merzouga (désert) -> Fès -> Chefchaouen -> retour. Jamais de zigzag.',
    'BON EXEMPLE (Vietnam) : Hanoï (nord) -> Ha Long -> Hué -> Hoi An (centre) -> Da Lat -> Hô Chi Minh (sud). Ligne nord->sud continue.',
    'BON EXEMPLE (Japon) : Tokyo (arrivée) -> Hakone (montagnes/onsen, 1h30 de Tokyo) -> Kanazawa (détour, jardins/vieille ville) -> Kyoto (temples) -> Hiroshima/Miyajima (mémorial) -> retour Tokyo pour le vol international si besoin. Kanazawa se place ENTRE Tokyo et Kyoto (pas après Kyoto) : Kyoto -> Kanazawa -> Hiroshima serait un zigzag INVALIDE (retour vers le nord puis re-descente au sud-ouest).',
    'Adapte ce principe à TOUTE destination : identifie le point d\'arrivée, les zones d\'intérêt, et trace le chemin le plus court qui les relie sans repasser deux fois.',
    'Si le vol retour est dans la même ville que l\'arrivée, organise une BOUCLE qui y revient naturellement à la fin - PAS d\'aller-retours multiples.',
    'Planifie mentalement le trajet AVANT : liste les zones dans l\'ordre géographique optimal, puis répartis les jours.',
    '',
    '=== RÈGLES LOGISTIQUES (violations = itinéraire invalide) ===',
    '1. TRACÉ LINÉAIRE OU BOUCLE : jamais de retour arrière. Chaque étape plus proche de la suivante.',
    '2. DISTANCES RÉALISTES : max '+maxKm+'km entre deux étapes consécutives (rythme '+rythme+'). Mentionner le trajet si > 45min.',
    '3. JOURS DE TRANSFERT : si trajet > 2h, dédier ce jour au trajet + arrivée.',
    '4. FERRIES/BATEAUX : planifier aller ET retour avec dates précises.',
    '5. UN HÉBERGEMENT PAR ZONE : changer d\'hébergement SEULEMENT en changeant de zone (>30km). Regrouper les nuits consécutives au même endroit.',
    '6. COHÉRENCE "night" : champ "night" = "name" EXACT d\'un hébergement de "stays".',
    '7. SKY : sun, cloud, ou rain uniquement.',
    '8. JSON valide compact. Zéro texte autour.',
    '9. JAMAIS de référence de jour dans un champ texte ("J8", "Jour 10", "J10-12", "jours 8 à 10", etc.) — le numéro de jour est déjà déterminé par la position dans "plan", ne JAMAIS l\'écrire dans "title" ni "hook". Ces champs décrivent le LIEU/l\'activité, jamais le calendrier.',
    (dc<=6 ? '10. VOYAGE COURT ('+dc+' jours) : rester dans UNE SEULE région compacte, PAS d\'aller-retour lointain qui sacrifie plusieurs jours au seul trajet. Un transfert de plus de 2h ne se justifie QUE s\'il est suivi d\'au moins 2 nuits sur place — jamais pour une seule nuit isolée avant de repartir. Mieux vaut 2-3 zones proches et bien vécues qu\'une zone lointaine ajoutée juste pour la "cocher".' : '10. RÉPARTITION : plus le voyage est long, plus chaque zone doit avoir un nombre de nuits proportionnel à la distance parcourue pour l\'atteindre — un aller-retour lointain ne se justifie que par un séjour sur place d\'au moins 2-3 nuits.'),
    '11. CHAMP "loc" : toujours un lieu géographique RÉEL et précis (ville, village, hameau, point de repère nommé) que l\'on peut situer sur une carte — jamais un thème de journée, une direction seule, ou une description de trajet. INTERDIT comme "loc" : "Trajets sud-est", "Journée détente", "Balade côtière", "Excursion nature". Si le jour couvre plusieurs lieux, "loc" = celui où se déroule l\'essentiel du jour (ex: "Porto-Vecchio", pas "Trajets sud-est" pour une journée d\'excursions autour de Porto-Vecchio).',
  ];
  if(isFirst){
    const compact2:string[]=[];
    if(state.occasion){
      const occMap:Record<string,string>={'lune-de-miel':'Lune de miel: suites, dîners romantiques, activités à deux, intimité, base unique.','anniversaire':'Anniversaire: 1 moment exceptionnel, gem caché.','evjf':'EVJF: base unique, spa, rooftop, lieux instagrammables, vie nocturne (bars tardifs, boîte de nuit).','evg':'EVG: base unique, activités sportives le jour, vie nocturne le soir (bars tardifs, boîte de nuit).','famille':'Famille (enfants '+state.childrenAges+'): hébergement spacieux, activités tous âges.','solo':'Solo: guesthouses, activités modulables, sécurité.','amis':'Entre amis: hébergement partagé, activités de groupe, 1 soirée mémorable.','bien-etre':'Retraite bien-être: base unique, rythme lent, spa/yoga/nature, jamais de vie nocturne.'};
      if(occMap[state.occasion]) compact2.push(occMap[state.occasion]);
    }
    if(state.dietary) compact2.push('Régime: '+state.dietary);
    if(state.alreadyDone) compact2.push('Éviter: '+state.alreadyDone);
    if(state.transport&&state.transport!=='Mixte') compact2.push('Transport: '+state.transport);
    if(state.accomStyle&&state.accomStyle!=='Peu importe') compact2.push('Hébergement: '+state.accomStyle);
    if(state.fitnessLevel&&state.fitnessLevel!=='Modéré') compact2.push('Forme: '+state.fitnessLevel);
    const styles2=(state.styles||[]);
    if(styles2.length) compact2.push('Style: '+styles2.join(', '));
    const interests2=(state.interests||[]);
    if(interests2.length) compact2.push('Intérêts: '+interests2.join(', '));
    if(state.dream) compact2.push('Envie: '+state.dream.slice(0,120));
    const destLock = (!b.surprise&&dest)
      ? '⚠️ DESTINATION IMPOSÉE : "'+dest+'". "dest" DOIT être "'+dest+'". Absolument aucune autre destination.' : '';
    return [
      '═══════════════════════════════════════════════════════════════',
      '║  HIC SUNT · BEYOND THE KNOWN  -  CARTOGRAPHE SENIOR            ║',
      '║  Standard : directeur d\'une agence de voyage ultra-luxe       ║',
      '║  Exigence : cohérence logistique absolue + authenticité       ║',
      '==═════════════════════════════════════════════════════════════',
      '',
      destLock,
      zoneConstraint ? zoneConstraint+'\n' : '',
      '━━━ BRIEF CLIENT ━━━',
      b.lines,
      '',
      '━━━ PERSONNALISATION ━━━',
      compact2.length?compact2.join(' | '):'Confort, découvertes authentiques.',
      '',
      '━━━ PHILOSOPHIE ÉDITORIALE ━━━',
      '* NOMS RÉELS : restaurants, guides, excursions  -  décris-les précisément. Pour les HÉBERGEMENTS, propose un nom plausible et le bon standing : ils seront ensuite remplacés par de vrais établissements vérifiés.',
      '* STANDING HÉBERGEMENTS : toujours indiquer la classification (Relais & Châteaux / 5⭐ / Boutique 4⭐ / Agriturismo bio / Maison d\'hôtes charme).',
      '* RESTAURANTS : nom exact + quartier + spécialité signature + fourchette de prix + note Google si connue. N\'indiquer que des adresses réputées pour leur qualité (note Google/TripAdvisor 4,5+/5) — jamais une adresse moyenne ou quelconque, ces noms seront de toute façon vérifiés ensuite.',
      '* EXCURSIONS : nom du prestataire ou du guide local + contact si disponible.',
      '* ANCRAGE LOCAL : familles, producteurs, artisans. "Trattoria tenue par la même famille depuis 1974."',
      '* HORAIRES PRATIQUES : meilleur moment, réservation conseillée, à éviter si surpeuplé.',
      '* ANTI-TOURISTIQUE : pas de spots Instagram saturés. Penser comme un habitant cultivé, pas comme un guide Lonely Planet.',
      '* LOGISTIQUE RÉALISTE : si le trajet d\'un jour dépasse 2h, c\'est un jour de route  -  pas de visite intensive ce jour-là.',
      '',
      '━━━ CONSIGNES STRICTES ━━━',
      common.join('\n'),
      '',
      '* "plan" : EXACTEMENT '+n+' entrées numérotées (jours 1→'+n+' sur '+dc+').',
      '* "stays" : couvre les '+dc+' JOURS complets. Max '+Math.min(5,Math.max(1,Math.ceil(dc/4)))+' hébergements (1 par zone géographique distincte > 30km).',
      '* IMPÉRATIF : la somme des "nights" de TOUS les hébergements doit être EXACTEMENT '+dc+' (jamais plus, jamais moins) — sinon le budget affiché au client est faux.',
      '* Hébergement J1 = lieu d\'arrivée (aéroport proche). Dernier hébergement = près de l\'aéroport de départ.',
      '* Prix hébergements RÉALISTES et DISTINCTS par type :',
      '  Sardaigne/Corse: agriturismo 65-95€ · boutique 95-145€ · resort 140-210€ · villa/charme 190-380€',
      '  Thaïlande: guesthouse 35-75€ · boutique-hôtel 75-135€ · resort plage 110-200€ · villa privée 180-400€',
      '  Maroc: maison d\'hôtes 55-95€ · riad médina 90-160€ · camp désert 130-230€ · resort Atlas 150-280€',
      '  Japon: ryokan 120-280€ · business hotel 80-130€ · boutique 100-200€',
      '  Ajuster × colFactor selon la destination',
      '* Budget TOTAL réaliste pour '+dc+' jours × TOUS voyageurs (héberg+repas+activités+transport local, hors vols) :',
      '  Éco 60-90€/pers/j · Confort 110-190€/pers/j · Luxe 220-450€/pers/j · Ultra 450€+/pers/j',
      '',
      '━━━ AUTO-VALIDATION AVANT DE RÉPONDRE ━━━',
      'Avant de générer le JSON, vérifier mentalement :',
      '✓ Chaque trajet est-il physiquement possible en 1 journée (< '+maxKm+'km) ?',
      '✓ Si ferry prévu pour une île, le retour est-il dans le plan ?',
      '✓ Les jours lourds en trajet sont-ils allégés en activités ?',
      '✓ Tous les "night" correspondent à un nom exact de "stays" ?',
      '✓ Les hébergements ne changent pas si on reste dans la même zone ?',
      '✓ L\'itinéraire finit logiquement près de l\'aéroport de retour ?',
      '',
      destLock?'Rappel final : dest = "'+dest+'" sans exception.':'',
      '',
      'SCHÉMA (utilise des vraies données à la place des exemples) :',
      '{"dest":"Sardaigne","country":"Italie","tagline":"Criques secrètes et maquis odorant sous le soleil d\'août","level":"Confort","dates":"14-22 août 2026 · '+dc+' jours","days_count":'+dc+',"budget":'+Math.round(dc*140*2)+',"season":"Août chaud, idéal mer  -  éviter mi-août pour Cagliari","coords":"39°13\'N · 9°07\'E","region":"Sardaigne","stays":['
      +'{"name":"Agriturismo Mandra Edera","type":"Agriturismo bio · charme","loc":"Chia / Extrême Sud","price":88,"nights":4,"blurb":"Crique privée à 800m, production fromagère, couchers de soleil sur l\'archipel"},'
      +'{"name":"Su Gologone","type":"Relais & Châteaux · 4⭐","loc":"Oliena / Nuoro  -  centre","price":148,"nights":4,"blurb":"Source naturelle, jardins secrets, cuisine barbaricina authentique"}],'
      +'"plan":[{"title":"Arrivée Cagliari  -  premiers pas dans le sud sauvage","loc":"Cagliari / Aéroport","night":"Agriturismo Mandra Edera","sky":"sun","temp":"29°","hook":"45min de route depuis l\'aéroport : la Sardaigne commence au premier virage côtier."}]}',
    ].filter(Boolean).join('\n');
  }
  const staysList=(genCtx.genStays||[]).map(function(s){return '"'+s.name+'" ('+s.type+', '+s.loc+')  -  '+s.nights+' nuits';}).join('\n');
  const allVisited=(genCtx.genAllSteps||[]).map(function(p){return p.loc;}).filter(function(v,i,a){return a.indexOf(v)===i;});
  const lastSteps=(genCtx.genLastSteps||[]).slice(-2).map(function(p){return p.n+'. '+p.loc+' ('+p.title+')';}).join(' → ');
  const lastLoc=(genCtx.genLastSteps&&genCtx.genLastSteps.length)?genCtx.genLastSteps[genCtx.genLastSteps.length-1].loc:'';
  return [
    'HIC SUNT  -  SUITE itinéraire '+dest+', '+dc+'j. Jours '+(offset+1)+'→'+(offset+n)+'.',
    'MÊMES EXIGENCES : noms réels, logistique rigoureuse, ancrage local.',
    '',
    '=== BRIEF CLIENT ===',
    b.lines,
    '',
    '=== CONTEXTE GÉOGRAPHIQUE - CRITIQUE ===',
    'Tu es actuellement à : '+lastLoc,
    'Dernières étapes : '+lastSteps,
    'Villes DÉJÀ VISITÉES (ne PAS y retourner sauf si c\'est l\'aéroport de départ final) : '+allVisited.join(', '),
    'RÈGLE ABSOLUE : continue le circuit vers l\'AVANT depuis '+lastLoc+'. Ne reviens PAS dans une ville déjà visitée.',
    'Si ces jours sont les DERNIERS du voyage, dirige-toi progressivement vers l\'aéroport de départ.',
    '',
    'Hébergements établis (utiliser "name" EXACT dans "night") :',
    staysList,
    '',
    common.join('\n'),
    '* EXACTEMENT '+n+' entrées : jours '+(offset+1)+'→'+(offset+n)+'.',
    '* Continuer géographiquement depuis '+lastLoc+' SANS retour arrière.',
    '* Vérifier : trajet réaliste ? ferry retour prévu ? nuits cohérentes ? aucune ville déjà visitée ?',
    '',
    '{"plan":[{"title":"","loc":"ville précise","night":"nom exact stays","sky":"sun","temp":"26°","hook":"phrase évocatrice 10 mots max"}]}',
  ].join('\n');
}

function buildDaysPrompt(state:any, skel:any, planSteps:any[], offset:number){
  const b=buildBrief(state);
  const nMoments=_momentsPerDay(state);
  const compact:string[]=[];
  const occDirective=_occasionDirective(state);
  if(occDirective) compact.push(occDirective);
  const dietDirective=_dietaryDirective(state);
  if(dietDirective) compact.push(dietDirective);
  const avoidDirective=_alreadyDoneDirective(state);
  if(avoidDirective) compact.push(avoidDirective);
  if(state.transport&&state.transport!=='Mixte') compact.push('TRANSPORT: '+state.transport+'.');
  const accomDirective=_accomStyleDirective(state);
  if(accomDirective) compact.push(accomDirective);
  compact.push(_fitnessDirective(state));
  compact.push(_rythmeDirective(state));
  const styleDirective=_styleDirective(state);
  if(styleDirective) compact.push(styleDirective);
  const interests=(state.interests||[]);
  if(interests.length){
    compact.push('INTÉRÊTS COCHÉS (au moins 1 par jour) : '+interests.join(', ')+'.');
    const interestsDirective=_interestsDirective(state);
    if(interestsDirective) compact.push(interestsDirective);
  }
  compact.push('NE PROPOSER un thème d\'activité (randonnée, plongée, spa, vignoble, etc.) QUE s\'il correspond à un intérêt/style coché ci-dessus, à la forme physique indiquée, ou à un incontournable évident et inévitable de la destination elle-même. Sinon, explorer davantage les intérêts réellement sélectionnés plutôt que d\'ajouter une activité générique de remplissage.');
  if(state.dream) compact.push('ADN DU VOYAGE: '+state.dream.slice(0,120));
  const steps=planSteps.map(function(p,i){return (offset+i+1)+'. '+p.title+'  -  '+p.loc+(p.hook?' ('+p.hook+')':'');}).join('\n');
  return [
    'HIC SUNT · CARTOGRAPHE  -  détail jours '+skel.dest+', jours '+(offset+1)+'→'+(offset+planSteps.length),
    'Standard Condé Nast. Noms RÉELS et vérifiables. JSON UNIQUEMENT.',
    '',
    'BRIEF: '+b.lines.replace(/\n/g,' | '),
    compact.length ? 'CONTRAINTES: '+compact.join(' / ') : '',
    '',
    'ÉTAPES:\n'+steps,
    '',
    'RÈGLES:',
    '* Géo stricte: chaque lieu dans la zone de l\'étape (<15km). Sur île: sur cette île uniquement.',
    '* desc: 2 phrases évocatrices max 40 mots (sensations, lumière, atmosphère).',
    '* moments: '+nMoments+' items réels  -  {t:"HH:MM",k:"['+GEN_KINDS.slice(0,8).join('|')+']",ti:"NOM RÉEL",d:"détail pratique 8-12 mots",free:true|false}',
    '* d (détail du moment) : 8-12 mots PRATIQUES et actionnables, pas juste une description — glisser, quand c\'est pertinent, la durée sur place, le prix d\'entrée (ou "gratuit"), si une réservation est nécessaire, ou le meilleur créneau pour y aller (éviter la foule, lumière...). Objectif : le voyageur sait exactement à quoi s\'attendre sur place, sans avoir à chercher ailleurs.',
    '* free: true si l\'activité est en accès libre et non réservable (plage publique, point de vue, photo, balade, marché à parcourir, coucher de soleil, rue/place, église) — false si elle a un coût réel (visite guidée, musée/site payant, spa, excursion, activité nautique encadrée, cours, location).',
    '* tip: conseil initié ultra-spécifique (heure, jour, lieu exact).',
    '* restaurant: {name,type,price:"€/€€/€€€",note,rating:"4,x⭐",review}',
    '* wellness: null ou {name,type,price,note} si spa/lune de miel.',
    '* JAMAIS de numéro/plage de jour du voyage dans un champ texte ("J8", "Jour 10", "J10-12"...) — chaque entrée de "days" correspond déjà à UN jour précis par sa position, ne jamais l\'écrire dans "desc", "tip" ou "moments".',
    '',
    'JSON EXACT  -  '+planSteps.length+' entrées dans "days":',
    '{"days":[{"desc":"","tip":"","restaurant":{"name":"","type":"","price":"€€","note":"","rating":"","review":""},"wellness":null,"moments":[{"t":"","k":"","ti":"","d":"","free":false}]}]}',
  ].filter(Boolean).join('\n');
}

function buildHighlightsPrompt(state:any, skel:any){
  const dest=skel.dest||'';
  const occ=state.occasion||'';
  const interests=(state.interests||[]).slice(0,5).join(', ')||'';
  const locs=(skel.plan||[]).map(function(p:any){return p.loc;}).filter(function(v:any,i:number,a:any[]){return a.indexOf(v)===i;}).slice(0,5).join(', ');
  const wantSpa=occ==='lune-de-miel'||interests.toLowerCase().includes('spa')||interests.toLowerCase().includes('bain');
  const wantBeach=interests.toLowerCase().includes('plage')||interests.toLowerCase().includes('crique');
  const wantFood=interests.toLowerCase().includes('cuisine')||interests.toLowerCase().includes('restaurant');
  const compact:string[]=[];
  if(occ) compact.push('Occasion: '+occ);
  if(state.dietary) compact.push('Régime: '+state.dietary);
  if(state.dream) compact.push('Envie: '+state.dream.slice(0,80));
  return [
    'Hic Sunt. Destination: '+dest+' | Étapes: '+locs+(compact.length?' | '+compact.join(' | '):''),
    'Génère 4 gems cachées + sections demandées. JSON compact uniquement.',
    '',
    '{"gems":[{"name":"","loc":"","desc":"","tip":""}],"highlights":{'
    +'"spas":'+  (wantSpa?  '[{"name":"","loc":"","type":"","price":"","note":""}]':'[]')
    +',"beaches":'+(wantBeach?'[{"name":"","loc":"","desc":"","tip":""}]':'[]')
    +',"restaurants":'+(wantFood?'[{"name":"","loc":"","type":"","price":"","note":""}]':'[]')
    +'},"essentials":{"visa":"info ressortissants français","bestTime":"saison + raison","toKnow":["x","y","z"]},"budget_note":"fourchette/pers hors vols"}',
  ].filter(Boolean).join('\n');
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 3 — parsing JSON & appel du moteur IA (port verbatim)
   ═══════════════════════════════════════════════════════════════════════ */

function repairJSON(s:string){
  const last=s.lastIndexOf('}'); if(last<0) return null;
  let t=s.slice(0,last+1); const stack:string[]=[]; let inStr=false, esc2=false;
  for(let i=0;i<t.length;i++){
    const c=t[i];
    if(inStr){if(esc2)esc2=false;else if(c==='\\')esc2=true;else if(c==='"')inStr=false;continue;}
    if(c==='"'){inStr=true;continue;}
    if(c==='{'||c==='[')stack.push(c==='{'?'}':']');
    else if(c==='}'||c===']')stack.pop();
  }
  t=t.replace(/[\s,]*$/,'');
  let suf=''; for(let i=stack.length-1;i>=0;i--)suf+=stack[i];
  try{return JSON.parse(t+suf);}catch(e){return null;}
}
function parseItineraryJSON(text:string){
  if(!text) return null;
  let s=String(text).trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
  const a=s.indexOf('{'), b=s.lastIndexOf('}');
  const slice=(a>=0&&b>a)?s.slice(a,b+1):s.slice(a>=0?a:0);
  try{return JSON.parse(slice);}catch(e){}
  return repairJSON(s.slice(a>=0?a:0));
}
async function _callSupabase(prompt:string, webSearch?:boolean){
  const body:any={prompt:prompt};
  if(webSearch) body.webSearch=true;
  const res=await fetch(SUPABASE_ENDPOINT,{method:'POST',headers:SUPABASE_HEADERS,body:JSON.stringify(body)});
  if(!res.ok){
    const bodyTxt=await res.text().catch(function(){return '';});
    throw new Error('HTTP '+res.status+'  -  '+bodyTxt.slice(0,80));
  }
  const data=await res.json();
  if(data.error) throw new Error(data.error);
  return data.result||'';
}
async function _completeJSON(prompt:string){
  for(let a=0;a<3;a++){
    if(a>0) await new Promise(function(r){setTimeout(r,a*1500);});
    try{
      const txt=await _callSupabase(prompt);
      const j=parseItineraryJSON(txt);
      if(j) return j;
    }catch(e:any){
      const msg=String(e&&e.message||e).toLowerCase();
      if((msg.indexOf('load failed')>=0||msg.indexOf('network')>=0) && a<2){
        await new Promise(function(r){setTimeout(r,2000);});
      }
    }
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 4 — mise en forme du résultat (port de applyGenerated, sans la
   mutation d'un global ITINERARY — retourne un objet plain à la place)
   ═══════════════════════════════════════════════════════════════════════ */

function _momentIcon(ti:string){
  const s=(ti||'').toLowerCase();
  if(/vol|aéro|transfer|arriv|départ/.test(s)) return 'plane';
  if(/dîner|déjeuner|restaurant|table|cuisine|food/.test(s)) return 'fork';
  if(/temple|palais|musée|patrimoine|fort|cité|ruine/.test(s)) return 'arch';
  if(/plage|mer|océan|baignade|lagune/.test(s)) return 'wave';
  if(/randonn|trek|sommet|montagne|marche/.test(s)) return 'peaks';
  if(/spa|massage|détente|bien-être|piscine/.test(s)) return 'droplet';
  if(/marché|souk|artisan/.test(s)) return 'camera';
  if(/jungle|forêt|nature|cascade/.test(s)) return 'leaf';
  if(/safari|animaux|faune/.test(s)) return 'leaf';
  return 'pin';
}
function _isPlaceholderTime(t:string){ return /^[\s\-–—_]*$/.test(String(t||'')); }
function _repairPlanMoments(plan:any[]){
  if(!Array.isArray(plan)) return;
  plan.forEach(function(p){
    try{
      if(!p || !Array.isArray(p.moments)) return;
      const real=p.moments.filter(function(m:any){
        if(!m || typeof m!=='object') return false;
        let title=Array.isArray(m)?m[2]:(m.ti||m.title||'');
        let desc=Array.isArray(m)?m[3]:(m.d||m.desc||'');
        let time=Array.isArray(m)?m[0]:(m.t||'');
        title=String(title||''); desc=String(desc||''); time=String(time||'');
        return (title && title!=='Moment') || !!desc.trim() || (!_isPlaceholderTime(time) && !!time.trim());
      });
      p.moments = real.length ? real : [[' - ', _kind(_momentIcon(p.title)), p.title||p.loc||'Étape', '', false]];
    }catch(e){}
  });
}
function _stripDayRef(s:string){
  return String(s||'')
    .replace(/^\s*jours?\s*\d+(?:\s*(?:[-–—à]|au)\s*\d+)?\s*[·:\-–—]\s*/i, '')
    .replace(/^\s*j\d+(?:[-–—]\d+)?\s*[·:\-–—]\s*/i, '');
}
function _repairPlanTitles(plan:any[]){
  if(!Array.isArray(plan)) return;
  plan.forEach(function(p){
    if(!p) return;
    try{
      if(p.title) p.title = _stripDayRef(p.title);
      if(p.desc) p.desc = _stripDayRef(p.desc);
    }catch(e){}
  });
}
function _trimKeepFlights(moments:any[], cap:number){
  while(moments.length>cap){
    let idx=-1;
    for(let i=moments.length-1;i>=0;i--){ if(moments[i][1]!=='plane'){ idx=i; break; } }
    if(idx<0) break;
    moments.splice(idx,1);
  }
}
function _injectFlightMoments(state:any, plan:any[], flightInfo:any, dest:string){
  if(!Array.isArray(plan) || !plan.length || !flightInfo) return;
  const origin = state.origin || 'Paris';
  const cap = _momentsPerDay(state);
  const first = plan[0], last = plan[plan.length-1];
  [first, last].forEach(function(p){ if(!Array.isArray(p.moments)) p.moments=[]; });
  if(flightInfo.outbound || flightInfo.inbound){
    first.moments = first.moments.filter(function(m:any){return m[1]!=='plane';});
    if(last!==first) last.moments = last.moments.filter(function(m:any){return m[1]!=='plane';});
  }
  if(flightInfo.outbound){
    const air = flightInfo.outbound.airline ? ('Vol '+flightInfo.outbound.airline) : 'Vol direct';
    first.moments.unshift([flightInfo.outbound.arrTime, 'plane', 'Atterrissage à '+(first.loc||dest), air, false]);
  }
  if(flightInfo.inbound){
    const air = flightInfo.inbound.airline ? ('Vol '+flightInfo.inbound.airline) : 'Vol direct';
    last.moments.push([flightInfo.inbound.depTime, 'plane', 'Envol retour vers '+origin, air, false]);
  }
  _trimKeepFlights(first.moments, cap);
  if(last!==first) _trimKeepFlights(last.moments, cap);
}
function _fmtDateRangeCompact(dateFromISO:string, dateToISO:string){
  if(!dateFromISO || !dateToISO) return '';
  const from = new Date(dateFromISO), to = new Date(dateToISO);
  if(isNaN(from.getTime()) || isNaN(to.getTime())) return '';
  const monthYear = function(d:Date){ return d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}); };
  const full = function(d:Date){ return d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}); };
  if(monthYear(from) === monthYear(to)){
    return from.getDate()+'–'+full(to);
  }
  if(from.getFullYear() === to.getFullYear()){
    return from.toLocaleDateString('fr-FR',{day:'numeric',month:'long'})+' – '+full(to);
  }
  return full(from)+' – '+full(to);
}
function _normalizeStayNights(stays:any[], dc:number){
  if(!Array.isArray(stays) || !stays.length || !(dc>0)) return;
  if(stays.length>dc) stays.length=Math.max(1,dc);
  const sum=stays.reduce(function(s,a){return s+(Number(a.nights)||0);},0);
  if(sum===dc) return;
  let running=0;
  stays.forEach(function(a,i){
    if(i===stays.length-1){ a.nights=Math.max(1,dc-running); }
    else{ a.nights=Math.max(1,Math.round((Number(a.nights)||1)*(dc/Math.max(1,sum)))); running+=a.nights; }
  });
}
function _actLocLabel(loc:string, fallback:string){
  const s=String(loc||'').replace(/\(.*?\)/g,'').trim();
  const parts=s.split(/→|->/);
  const picked=(parts.length>1?parts[parts.length-1]:s).trim();
  return picked || fallback || '';
}
const _NON_PLACE_LOC_RX=/^(trajets?|journ[ée]e?s?|excursions?|balades?|circuits?|d[ée]tente|d[ée]couverte(s)?|visite libre|route(s)?\s+(vers|pour)|direction|environs|alentours|repos|libre)\b/i;
function _isPlaceLikeLoc(loc:string){
  const s=String(loc||'').trim();
  return !!s && !_NON_PLACE_LOC_RX.test(s);
}
function _validStayPhoto(url:any){
  if(typeof url!=='string') return '';
  const u=url.trim();
  if(!/^https:\/\/([a-z0-9-]+\.)?(bstatic\.com|muscache\.com)\/.+\.(jpe?g|png|webp)(\?.*)?$/i.test(u)
     && !/^https:\/\/upload\.wikimedia\.org\/.+\.(jpe?g|png)$/i.test(u)
     && !/^https:\/\/(dynamic-media-cdn|media-cdn)\.tripadvisor\.com\/.+\.(jpe?g|png|webp)(\?.*)?$/i.test(u)
     && !/^https:\/\/lh[3-6]\.googleusercontent\.com\/.+$/i.test(u)) return '';
  if(/\[|\]|xdata\/x|photo_?id|example\.com|placeholder/i.test(u)) return '';
  return u;
}
function _validPhotoPage(url:any){
  if(typeof url!=='string') return '';
  const u=url.trim();
  if(!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\//i.test(u)) return '';
  if(/\[|\]|example\.com|placeholder/i.test(u)) return '';
  return u;
}
/* Lien de réservation DIRECT vers la fiche de l'établissement (Booking,
   Airbnb, Hotels.com, Expedia, site officiel) — même règle que la photo :
   uniquement une URL vue littéralement dans les résultats de recherche,
   jamais construite, pour ne jamais renvoyer vers une page cassée. */
function _validBookingUrl(url:any){
  if(typeof url!=='string') return '';
  const u=url.trim();
  if(!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\//i.test(u)) return '';
  if(/\[|\]|example\.com|placeholder/i.test(u)) return '';
  return u;
}
/* Lien direct vers la fiche Google Maps d'un restaurant — vue littéralement
   dans les résultats, jamais reconstruite à partir du nom (sinon on retombe
   sur le même problème de "page Google cassée" qu'on cherche à éliminer). */
function _validMapsUrl(url:any){
  if(typeof url!=='string') return '';
  const u=url.trim();
  if(!/^https:\/\/(www\.)?(google\.[a-z.]{2,}\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)\//i.test(u)) return '';
  if(/\[|\]|example\.com|placeholder/i.test(u)) return '';
  return u;
}

function applyGenerated(state:any, skel:any, daysDetail:any, hilites:any, flightInfo:any, heroPhoto:string){
  const dest=skel.dest||state.destination||'Votre voyage';
  const level=['Éco','Confort','Luxe','Ultra'].includes(skel.level)?skel.level:(state.budget||'Confort');
  const dc=_clampInt(skel.days_count, 1, 60, buildBrief(state).daysCount);

  const colFactor=_costOfLivingFactor(dest, skel.region, skel.country);
  const ACC_PRICE_RANGE_BASE:Record<string,[number,number]>={'Éco':[25,70],'Confort':[60,140],'Luxe':[150,400],'Ultra':[350,1100]};
  const baseAcc=ACC_PRICE_RANGE_BASE[level]||ACC_PRICE_RANGE_BASE['Confort'];
  const accRange=[Math.round(baseAcc[0]*colFactor), Math.round(baseAcc[1]*colFactor)];
  const stayTags=['Coup de cœur','Adresse rare','Signature Hic Sunt','Pépite locale','Écrin de sérénité'];
  const stayRates=['4,96','4,89','4,92','4,88','4,94'];
  const stays=(Array.isArray(skel.stays)?skel.stays:[]).slice(0,8).map(function(s:any,i:number){
    const rawPrice=Math.round(Number(s.price)||0);
    const midAcc=Math.round((accRange[0]+accRange[1])/2);
    const isVerified = s.verified !== false;
    let price;
    if(isVerified && rawPrice>0 && rawPrice<=accRange[1]*8){
      price=rawPrice;
    } else if(rawPrice>=accRange[0]&&rawPrice<=accRange[1]*1.3){
      price=rawPrice;
    } else {
      const tl=(s.type||'').toLowerCase();
      if(/villa|résidence|privée/.test(tl))            price=Math.round(accRange[1]*0.85);
      else if(/luxe|resort|palace/.test(tl))           price=Math.round(accRange[1]*0.75);
      else if(/lodge|boutique|charme|écolodge/.test(tl))price=Math.round(midAcc*1.15);
      else if(/guesthouse|maison d|homestay/.test(tl)) price=Math.round(accRange[0]*1.3);
      else if(/hostel|auberge/.test(tl))               price=accRange[0];
      else price=midAcc;
      const vary=[1,0.85,1.15,0.92,1.08,0.78,1.22,0.88][i]||1;
      price=Math.max(accRange[0],Math.min(accRange[1],Math.round(price*vary)));
    }
    return {
      id:'a'+(i+1), n:String(s.name||('Hébergement '+(i+1))), i:_stayIcon(s.type),
      type:s.type||'Hôtel-boutique', loc:s.loc||dest,
      tag:stayTags[i%stayTags.length]||'Sélection', rate:stayRates[i%stayRates.length]||'4,9',
      nights:_clampInt(s.nights,1,21,2), price:price,
      am:['bed','wifi',i%2?'fork':'pool'], blurb:s.blurb||'Une adresse d\'exception.',
      photo: _validStayPhoto(s.photo),
      photoPage: _validPhotoPage(s.photoPage),
      url: _validBookingUrl(s.url),
      source: /^(booking|airbnb|hotels|expedia|officiel)$/i.test(String(s.source||'').trim()) ? String(s.source).trim().toLowerCase() : '',
      verified: s.verified !== false,
    };
  });
  while(stays.length<1) stays.push({id:'a1',n:'Hébergement local',i:'bed',type:'Hôtel-boutique',loc:dest,tag:'Sélection',rate:'4,9',nights:2,price:accRange[0],am:['bed','wifi','pool'],blurb:'',verified:false});
  _normalizeStayNights(stays, dc);

  const findStay=function(name:string){
    if(!name) return null;
    const k=String(name).toLowerCase().trim();
    return stays.find(function(s:any){return String(s.n||'').toLowerCase()===k;})
        ||stays.find(function(s:any){const sn=String(s.n||'').toLowerCase(); return sn.includes(k)||k.includes(sn);});
  };

  const detailDays=(daysDetail&&Array.isArray(daysDetail.days))?daysDetail.days:[];
  let _lastRealLoc=dest;
  const plan=(Array.isArray(skel.plan)?skel.plan:[]).map(function(p:any,i:number){
    const dd=detailDays[i]||{};
    const rawMoments=Array.isArray(dd.moments)&&dd.moments.length?dd.moments:[{t:' - ',k:_momentIcon(p.title),ti:p.title||'Étape',d:''}];
    const moments=rawMoments.slice(0,_momentsPerDay(state)).map(function(m:any){return [m.t||' - ',_kind(m.k||_momentIcon(m.ti)),m.ti||'Moment',m.d||'',!!m.free];});
    const tags:[string,string][]=[];
    moments.forEach(function(m:any){if(tags.length<2&&!tags.some(function(t){return t[0]===m[1];}))tags.push(TAG_MAP[m[1]]||TAG_MAP.pin);});
    while(tags.length<2) tags.push(TAG_MAP.pin);
    const stay=findStay(p.night);
    const catCounts:Record<string,number>={};
    moments.forEach(function(m:any){
      const cat=KIND_CATEGORY[m[1]]||'culture';
      if(cat==='transit') return;
      catCounts[cat]=(catCounts[cat]||0)+1;
    });
    let category='culture', best=0;
    Object.keys(catCounts).forEach(function(c){ if(catCounts[c]>best){ best=catCounts[c]; category=c; } });
    let cleanLoc=_actLocLabel(p.loc, dest);
    if(!_isPlaceLikeLoc(cleanLoc)){
      const stayLoc=stay&&stay.loc?_actLocLabel(stay.loc, ''):'';
      cleanLoc=stayLoc||_lastRealLoc||dest;
    }
    _lastRealLoc=cleanLoc;
    return {
      n:i+1, title:p.title||('Étape '+(i+1)), loc:cleanLoc,
      desc:dd.desc||p.hook||'', tip:dd.tip||'',
      tags:tags, category:category,
      wx:[GEN_SKY.includes(p.sky)?p.sky:'sun', p.temp||'28°'],
      night:stay?{acc:stay.id}:{n:p.night||'Nuit sur place',loc:cleanLoc},
      moments:moments,
      restaurant:dd.restaurant||null,
      wellness:dd.wellness||null,
    };
  });
  if(!plan.length) return null;

  if(state.dateFrom && state.dateTo){
    const fromD = new Date(state.dateFrom), toD = new Date(state.dateTo);
    if(!isNaN(fromD.getTime()) && !isNaN(toD.getTime())){
      const calendarDays = Math.round((toD.getTime() - fromD.getTime()) / 86400000) + 1;
      if(calendarDays === plan.length + 1){
        const lastDay = plan[plan.length - 1];
        plan.push({
          n: plan.length + 1, title: 'Retour', loc: lastDay ? lastDay.loc : dest,
          desc: 'Dernières heures avant le départ.', tip: '',
          tags: [TAG_MAP.plane, TAG_MAP.pin], category: 'transit',
          wx: (lastDay && Array.isArray(lastDay.wx)) ? lastDay.wx : ['sun', '—'],
          night: null,
          moments: [],
          restaurant: null, wellness: null,
        });
      }
    }
  }
  _injectFlightMoments(state, plan, flightInfo, dest);
  _repairPlanMoments(plan);
  _repairPlanTitles(plan);

  const PPD_RANGE:Record<string,[number,number]>={'Éco':[60,100],'Confort':[120,220],'Luxe':[250,500],'Ultra':[500,900]};
  const ppd=(PPD_RANGE[level]||PPD_RANGE['Confort']).map(function(v){return Math.round(v*colFactor);});
  const travelers=_clampInt(state.travelers,1,12,2);
  const minBudget=Math.round(ppd[0]*travelers*dc);
  const maxBudget=Math.round(ppd[1]*travelers*dc);
  const stayCost=stays.reduce(function(s:number,a:any){return s+a.price*a.nights;},0);
  const staticFlight=_flightEstimate(dest, skel.region, skel.country, travelers);
  const flightFloor=(flightInfo&&flightInfo.amount>0)?flightInfo.amount:staticFlight;
  let budgetTotal=_clampInt(skel.budget, minBudget, maxBudget*1.15, Math.round((minBudget+maxBudget)/2));
  const essentialFloor=stayCost+flightFloor;
  if(budgetTotal<essentialFloor) budgetTotal=Math.min(Math.round(essentialFloor*1.25), Math.max(maxBudget*1.15, essentialFloor*1.25));

  const themeName=_themeForDestination(dest, skel.region, skel.country);
  const itinerary:any = {
    dest:dest, country:skel.country||'', tag:skel.tagline||'Itinéraire composé pour vous',
    dates:(function(){
      const realN=plan.length;
      const compact=_fmtDateRangeCompact(state.dateFrom, state.dateTo);
      if(compact) return compact+' · '+realN+' jour'+(realN>1?'s':'');
      let raw=skel.dates||'Sur-mesure';
      raw=raw.replace(/\d+\s*jours?/i, realN+' jours');
      return raw;
    })(), days:plan.length, level:level,
    budgetTotal:budgetTotal, coords:skel.coords||dest, distance:plan.length+' jours',
    region:skel.region||'', season:skel.season||'', generated:true,
    theme:themeName, palette:THEME_PALETTES[themeName],
    dateFrom:state.dateFrom||'', dateTo:state.dateTo||'',
    _flightInfo:flightInfo||null,
    heroPhoto:heroPhoto||'',
    travelers:travelers,
    plan: plan,
    accommodations: stays,
    gems: hilites ? (hilites.gems||[]) : [],
    highlights: hilites ? (hilites.highlights||{}) : {},
    essentials: hilites ? (hilites.essentials||{}) : {},
    budget_note: hilites ? (hilites.budget_note||'') : '',
  };
  return itinerary;
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 5 — recherche web anti-hallucination (vols, hébergements,
   restaurants, pépites, photo) — port verbatim
   ═══════════════════════════════════════════════════════════════════════ */

function buildFlightSearchPrompt(state:any, dest:string, country:string, dateFrom:string, dateTo:string, travelers:number){
  const origin = state.origin || 'Paris';
  const period = (dateFrom && dateTo) ? ('le '+dateFrom+' (aller) et le '+dateTo+' (retour)') : 'pour les prochains mois';
  return [
    'Cherche sur le web un vol aller-retour réaliste et actuel en classe économique de '+origin+' vers '+(dest||'')+' ('+(country||'')+'), '+period+'.',
    'Base-toi sur des comparateurs de vols fiables (Google Flights, Kayak, Skyscanner, sites de compagnies aériennes) pour le prix ET les horaires (compagnie, heures de départ/arrivée réalistes pour cette liaison, avec éventuelle escale).',
    'Réponds UNIQUEMENT en JSON compact, sans texte ni markdown autour, au format exact :',
    '{"perPersonMin":0,"perPersonMax":0,"source":"nom du comparateur utilisé",'
    +'"outbound":{"airline":"","depTime":"HH:MM","arrTime":"HH:MM"},'
    +'"inbound":{"airline":"","depTime":"HH:MM","arrTime":"HH:MM"}}',
    '"outbound" = vol aller (départ '+origin+', arrivée près de '+(dest||'')+') le jour '+(dateFrom||'du début du séjour')+'.',
    '"inbound" = vol retour (départ près de '+(dest||'')+', arrivée '+origin+') le jour '+(dateTo||'de fin du séjour')+'.',
    'Les prix sont en euros, par personne, aller-retour. Si tu ne trouves rien de fiable, réponds {"perPersonMin":0,"perPersonMax":0,"source":"","outbound":null,"inbound":null}.',
  ].join('\n');
}
function _validFlightLeg(leg:any){
  return !!(leg && typeof leg==='object' && /^\d{1,2}:\d{2}$/.test(leg.depTime||'') && /^\d{1,2}:\d{2}$/.test(leg.arrTime||''));
}
async function _fetchFlightPriceFromWeb(state:any, dest:string, country:string, dateFrom:string, dateTo:string, travelers:number){
  try{
    const prompt = buildFlightSearchPrompt(state, dest, country, dateFrom, dateTo, travelers);
    const res = await fetch(SUPABASE_ENDPOINT,{ method:'POST', headers:SUPABASE_HEADERS, body:JSON.stringify({prompt:prompt, webSearch:true}) });
    if(!res.ok) return null;
    const data = await res.json();
    if(data.error) return null;
    const j = parseItineraryJSON(data.result||'');
    if(!j || !j.perPersonMin || !j.perPersonMax) return null;
    const perPerson = Math.round((j.perPersonMin+j.perPersonMax)/2);
    if(!isFinite(perPerson) || perPerson<=0) return null;
    return {
      amount: perPerson*Math.max(1,travelers||1), source: j.source||'',
      outbound: _validFlightLeg(j.outbound)?j.outbound:null,
      inbound: _validFlightLeg(j.inbound)?j.inbound:null,
    };
  }catch(e){ return null; }
}

function _computeStayDateRanges(stays:any[], dateFromISO:string){
  if(!dateFromISO || !Array.isArray(stays)) return (stays||[]).map(function(){ return null; });
  const from = new Date(dateFromISO);
  if(isNaN(from.getTime())) return stays.map(function(){ return null; });
  let offset = 0;
  const fmt = function(d:Date){ return d.toISOString().slice(0,10); };
  return stays.map(function(s){
    const nights = Math.max(1, Number(s.nights)||1);
    const checkinD = new Date(from.getTime() + offset*86400000);
    const checkoutD = new Date(checkinD.getTime() + nights*86400000);
    offset += nights;
    return { checkin: fmt(checkinD), checkout: fmt(checkoutD), nights: nights };
  });
}
function _mergeRealStays(origList:any[], zonesList:any[], realStays:any[]|null){
  const normS=function(s:any){return String(s||'').toLowerCase().normalize('NFD').replace(/[^\x00-\x7F]/g,'').trim();};
  const usedStay:Record<number,boolean>={};
  return origList.map(function(orig, i){
    const zone = zonesList[i];
    let real:any = null;
    if(Array.isArray(realStays)){
      for(let m=0; m<realStays.length; m++){
        if(usedStay[m]) continue;
        const rz = normS(realStays[m] && realStays[m].zone);
        if(rz && (rz===normS(zone) || rz.indexOf(normS(zone))>=0 || normS(zone).indexOf(rz)>=0)){
          real = realStays[m]; usedStay[m]=true; break;
        }
      }
      if(!real && realStays[i] && !usedStay[i]){ real = realStays[i]; usedStay[i]=true; }
    }
    const validName = real && real.name && typeof real.name === 'string'
      && real.name.trim().length >= 3
      && !/^\d+$/.test(real.name.trim());
    if(validName){
      return {
        name: real.name.trim(),
        type: real.type || orig.type,
        loc: orig.loc || real.zone,
        price: (typeof real.price==='number' && real.price>0) ? real.price : orig.price,
        nights: orig.nights,
        blurb: (real.blurb && real.blurb.length>5) ? real.blurb : orig.blurb,
        photo: _validStayPhoto(real.photo),
        photoPage: _validPhotoPage(real.photo_page),
        url: _validBookingUrl(real.url),
        source: /^(booking|airbnb|hotels|expedia|officiel)$/i.test(String(real.source||'').trim()) ? String(real.source).trim().toLowerCase() : '',
        rating: real.rating || orig.rating,
        verified: true,
      };
    }
    return Object.assign({}, orig, { verified: false });
  });
}
function buildStaySearchPrompt(dest:string, zones:string[], level:string, dateRanges:any[]){
  const lvl = (level||'Confort');
  const lvlGuide = lvl.indexOf('Éco')>=0?'auberges, guesthouses, agriturismi simples'
    : (lvl.indexOf('Luxe')>=0||lvl.indexOf('Ultra')>=0)?'hôtels 4-5 étoiles, Relais & Châteaux, villas de luxe, boutique-hôtels haut de gamme'
    : 'boutique-hôtels, agriturismi de charme, maisons d\'hôtes 3-4 étoiles';
  /* Seuil de note minimum adapté au budget : les hébergements très
     économiques dépassent rarement 4,3-4,4/5 même quand ils sont
     excellents dans leur catégorie — exiger 4,5+ partout écarterait
     systématiquement toute l'offre Éco. Luxe/Ultra doit rester au niveau
     le plus élevé, c'est justement ce qui justifie le tarif. */
  const ratingFloor = lvl.indexOf('Éco')>=0 ? '4,0'
    : (lvl.indexOf('Luxe')>=0||lvl.indexOf('Ultra')>=0) ? '4,6'
    : '4,3';
  const hasDates = Array.isArray(dateRanges) && dateRanges.some(Boolean);
  return [
    'Cherche sur le web des hébergements RÉELS et ACTUELLEMENT EN ACTIVITÉ pour un séjour à '+(dest||'')+'.',
    'Pour chacune de ces zones, trouve 1 hébergement réel et vérifiable ('+lvlGuide+') :',
    zones.map(function(z,i){
      const dr = dateRanges && dateRanges[i];
      const dateInfo = dr ? (' — séjour du '+dr.checkin+' au '+dr.checkout+' ('+dr.nights+' nuit'+(dr.nights>1?'s':'')+')') : '';
      return (i+1)+'. '+z+dateInfo;
    }).join('\n'),
    '',
    'EXIGENCES STRICTES :',
    '- Uniquement des établissements qui EXISTENT VRAIMENT (vérifiables sur Booking, Google Maps, ou leur site officiel).',
    '- Nom EXACT tel qu il apparait en ligne. Aucune invention, aucune approximation.',
    '- EXCLUSION ABSOLUE ET PRIORITAIRE : si tes résultats de recherche indiquent, même une seule fois, que l\'établissement est "définitivement fermé"/"permanently closed"/"closed down"/"fermé"/"n\'existe plus"/"a fermé ses portes" (peu importe qu\'il ait été réel et réputé), tu DOIS l\'exclure et chercher un autre établissement réel et actuellement ouvert pour cette zone — ne le propose sous aucun prétexte, même si aucune alternative n\'est trouvée (mets alors "name":"").',
    '- Si tu n es pas certain qu un établissement existe dans une zone, ou si son statut d\'ouverture actuel est incertain, mets "name":"" pour cette zone plutôt que de risquer un établissement fermé.',
    '- IMPORTANT — ne confonds pas deux niveaux d\'exigence différents : "name" exige une certitude forte (l\'établissement existe et n\'est pas fermé) ; "price" n\'exige qu\'une ESTIMATION raisonnable, jamais une certitude. Si tu as trouvé un établissement réel et ouvert mais que tu ne peux pas confirmer son tarif exact pour des dates lointaines (plus de quelques mois), tu DOIS quand même renseigner "name" avec ce vrai nom et donner une fourchette de prix réaliste pour ce type d\'établissement — ne mets JAMAIS "name":"" simplement parce que le prix précis est incertain, ce sont deux champs indépendants.',
    hasDates
      ? '- Prix : cherche le tarif RÉEL actuellement affiché (Booking, site officiel) pour CES dates précises indiquées ci-dessus, pas une moyenne générique — c\'est ce prix qui sert de base au budget affiché au client. Si le tarif exact pour ces dates n\'est pas trouvable (dates lointaines, pas encore ouvertes à la réservation...), donne la fourchette actuelle la plus réaliste pour ce type d\'établissement à cette période de l\'année — un prix estimé reste bien plus utile qu\'un champ vide.'
      : '- Prix indicatif par nuit réaliste en euros pour 2 personnes.',
    '- "source" : indique sur quelle plateforme tu as vérifié l\'existence de cet établissement dans tes résultats de recherche : "booking", "airbnb", "hotels", "expedia" ou "officiel" (site propre à l\'établissement). Laisse vide si tu n\'es pas sûr.',
    '- "photo" : cherche activement une vraie photo de cet établissement précis (page Booking/Airbnb, fiche TripAdvisor, fiche Google Maps/Business) et regarde si l\'URL complète de l\'image apparaît littéralement dans tes résultats de recherche — c\'est fréquent, ne t\'en prive pas si elle y est. La seule règle est de ne JAMAIS inventer ou reconstruire une URL à partir d\'un pattern connu (ex: "q-xx.bstatic.com/...", des identifiants entre crochets) : uniquement une URL que tu as VUE mot pour mot, telle quelle, dans un extrait/snippet de recherche. Si tu ne l\'as pas vue ainsi, laisse "photo" VIDE plutôt que de risquer une URL fictive qui cassera l\'affichage.',
    '- "photo_page" (différent de "photo") : si tu as trouvé une PAGE web réelle qui contient des photos de cet établissement (fiche TripAdvisor, fiche Google Maps, page galerie du site officiel) sans pouvoir en extraire l\'URL d\'image directe, indique l\'URL de cette page ici — l\'utilisateur pourra cliquer pour voir les photos lui-même. Cette URL doit aussi avoir été VUE littéralement dans tes résultats, jamais construite.',
    '- "url" (CRUCIAL — c\'est ce lien que le client touchera pour réserver) : si l\'URL de la fiche de réservation de CET établissement précis apparaît littéralement dans tes résultats de recherche (page Booking.com, Airbnb, Hotels.com ou Expedia qui mène DIRECTEMENT à cette fiche — jamais une page de résultats de recherche générique), indique-la ici telle que VUE mot pour mot dans un extrait/snippet. Ne l\'invente et ne la reconstruis JAMAIS à partir du nom de l\'établissement ou d\'un pattern d\'URL connu : une URL fabriquée mène très souvent vers une page d\'erreur, ce qui est pire que de n\'en fournir aucune. Si tu ne l\'as pas vue ainsi, laisse "url" VIDE — un lien de recherche construit proprement côté application vaut mieux qu\'un lien direct inventé qui casse.',
    '- "rating" : la note ACTUELLE de cet établissement (Google Maps ou Booking, ex: "4.6"), telle que vue dans tes résultats de recherche — jamais estimée ni inventée.',
    '- EXIGENCE DE QUALITÉ : n\'accepte que des établissements avec une note réelle d\'au moins '+ratingFloor+'/5. Si le meilleur hébergement que tu trouves pour cette zone est en dessous de ce seuil, cherche-en un autre pour cette même zone plutôt que de te contenter d\'une adresse moyenne — ne mets "name":"" pour ce motif que si vraiment aucun établissement à '+ratingFloor+'+ n\'existe dans cette zone précise.',
    '',
    'Réponds UNIQUEMENT en JSON compact valide, sans texte autour :',
    '{"stays":[{"zone":"nom de la zone","name":"nom exact reel","type":"type/standing","price":0,"photo":"","photo_page":"","url":"","source":"","rating":"","blurb":"description courte basee sur des infos reelles"}]}',
  ].join('\n');
}
async function _fetchRealStays(dest:string, zones:string[], level:string, dateRanges:any[]){
  for(let attempt=0; attempt<2; attempt++){
    if(attempt>0){ await new Promise(function(r){ setTimeout(r, 1500); }); }
    try{
      const res = await fetch(SUPABASE_ENDPOINT,{
        method:'POST', headers:SUPABASE_HEADERS,
        body:JSON.stringify({prompt:buildStaySearchPrompt(dest, zones, level, dateRanges), webSearch:true})
      });
      if(!res.ok) continue;
      const data = await res.json();
      if(data.error) continue;
      const raw = data.result || '';
      if(!raw) continue;
      let j = parseItineraryJSON(raw);
      if(!j || !Array.isArray(j.stays)){
        const m = raw.match(/\{[^]*"stays"[^]*\}/);
        if(m){ try{ j = JSON.parse(m[0]); }catch(e){} }
      }
      if(!j || !Array.isArray(j.stays)) continue;
      return j.stays;
    }catch(e){}
  }
  return null;
}

function buildRestoSearchPrompt(dest:string, places:string[], level:string){
  const lvl=(level||'Confort');
  const guide = lvl.indexOf('Éco')>=0?'trattorias familiales, tables locales authentiques, bon rapport qualité-prix'
    : (lvl.indexOf('Luxe')>=0||lvl.indexOf('Ultra')>=0)?'tables gastronomiques, restaurants étoilés ou réputés, chefs reconnus'
    : 'bonnes tables locales, cuisine régionale soignée, adresses appréciées';
  return [
    'Cherche sur le web de VRAIS restaurants actuellement en activité à '+(dest||'')+'.',
    'Pour chacun de ces lieux/étapes, trouve 1 restaurant réel et vérifiable ('+guide+') :',
    places.map(function(p,i){return (i+1)+'. '+p;}).join('\n'),
    '',
    'EXIGENCES STRICTES :',
    '- Uniquement des restaurants qui EXISTENT VRAIMENT (vérifiables sur Google Maps, TheFork, TripAdvisor).',
    '- Nom EXACT tel qu il apparait en ligne. Aucune invention.',
    '- EXCLUSION ABSOLUE ET PRIORITAIRE : si tes résultats de recherche indiquent, même une seule fois, que l\'établissement est "définitivement fermé"/"permanently closed"/"closed down"/"fermé"/"n\'existe plus"/"a fermé ses portes" (peu importe qu\'il ait été réel et réputé), tu DOIS l\'exclure et chercher une autre adresse réelle et actuellement ouverte pour ce lieu — ne le propose sous aucun prétexte, même si aucune alternative n\'est trouvée (mets alors "name":"").',
    '- Si tu n es pas certain pour un lieu, ou si le statut d\'ouverture actuel est incertain, mets "name":"" pour ce lieu plutôt que de risquer une adresse fermée.',
    '- Indique une spécialité réelle et une fourchette de prix (€, €€, €€€).',
    '- "rating" : la note ACTUELLE de ce restaurant (Google Maps ou TripAdvisor, ex: "4.7"), telle que vue dans tes résultats de recherche — jamais estimée ni inventée.',
    '- "maps_url" (CRUCIAL — c\'est le lien que le client touchera pour trouver le restaurant) : si l\'URL de la fiche Google Maps de CE restaurant précis apparaît littéralement dans tes résultats de recherche (ex: une URL commençant par "https://www.google.com/maps/place/..." ou "https://maps.app.goo.gl/..."), indique-la ici telle que VUE mot pour mot. Ne l\'invente et ne la reconstruis JAMAIS à partir du nom du restaurant : une URL fabriquée mène très souvent vers une page cassée ou le mauvais établissement. Si tu ne l\'as pas vue ainsi, laisse "maps_url" VIDE — l\'application construira alors elle-même un lien de recherche Maps fiable à partir du nom.',
    '- EXIGENCE DE QUALITÉ : n\'accepte qu\'un restaurant avec une note réelle d\'au moins 4,5/5. Si la meilleure table que tu trouves pour ce lieu est en dessous de ce seuil, cherche-en une autre pour ce même lieu plutôt que de te contenter d\'une adresse moyenne — ne mets "name":"" pour ce motif que si vraiment aucune adresse à 4,5+ n\'existe pour ce lieu précis.',
    '',
    'Réponds UNIQUEMENT en JSON compact valide, sans texte autour :',
    '{"restos":[{"place":"nom du lieu","name":"nom exact reel","type":"specialite/cuisine","price":"€€","note":"detail reel court","rating":"","maps_url":"","review":"ce qui rend ce lieu special"}]}',
  ].join('\n');
}
async function _fetchRealRestos(dest:string, places:string[], level:string){
  for(let attempt=0; attempt<2; attempt++){
    if(attempt>0){ await new Promise(function(r){ setTimeout(r, 1500); }); }
    try{
      const res = await fetch(SUPABASE_ENDPOINT,{
        method:'POST', headers:SUPABASE_HEADERS,
        body:JSON.stringify({prompt:buildRestoSearchPrompt(dest, places, level), webSearch:true})
      });
      if(!res.ok) continue;
      const data = await res.json();
      if(data.error) continue;
      const raw = data.result || '';
      if(!raw) continue;
      let j = parseItineraryJSON(raw);
      if(!j || !Array.isArray(j.restos)){
        const m = raw.match(/\{[^]*"restos"[^]*\}/);
        if(m){ try{ j = JSON.parse(m[0]); }catch(e){} }
      }
      if(!j || !Array.isArray(j.restos)) continue;
      return j.restos;
    }catch(e){}
  }
  return null;
}

function buildGemsSearchPrompt(dest:string, country:string, region:string, interests:string[]){
  const interestsLine = (interests && interests.length)
    ? 'Centres d\'intérêt du voyageur, à privilégier dans le choix des pépites : '+interests.join(', ')+'.'
    : '';
  return [
    'Cherche sur le web (avis Google Maps, TripAdvisor, forums de voyage type Routard/Reddit, blogs de voyageurs) les pépites les MOINS connues et les plus mémorables pour un séjour à '+(dest||'')+' ('+(country||region||'')+'), celles que les guides touristiques classiques ne mentionnent jamais.',
    interestsLine,
    'Pour chaque pépite trouvée, rapporte fidèlement ce qu\'un vrai avis/commentaire de voyageur en dit (paraphrase honnête d\'un avis réellement trouvé en ligne, jamais un commentaire inventé de toutes pièces).',
    'EXIGENCES STRICTES :',
    '- Uniquement des lieux RÉELS, vérifiables, actuellement accessibles.',
    '- EXCLUSION ABSOLUE ET PRIORITAIRE : si tes résultats de recherche indiquent, même une seule fois, que le lieu est "définitivement fermé"/"permanently closed"/"closed down"/"fermé"/"n\'existe plus", tu DOIS l\'exclure entièrement — ne le propose sous aucun prétexte, préfère en renvoyer moins.',
    '- Le commentaire cité doit correspondre au contenu d\'un vrai avis trouvé en ligne (paraphrase fidèle, pas une citation mot pour mot si tu n\'es pas sûr du texte exact).',
    '- Si tu ne trouves rien de fiable pour compléter 4 pépites, renvoie-en moins plutôt que d\'inventer.',
    'Réponds UNIQUEMENT en JSON compact, sans texte autour :',
    '{"gems":[{"name":"nom réel","loc":"lieu précis","desc":"description 2 phrases évocatrices","tip":"conseil pratique (horaire, accès, réservation)","review":"paraphrase fidèle d\'un vrai avis de voyageur","source":"type de source (ex: avis Google, forum Routard, blog voyage)"}]}',
  ].filter(Boolean).join('\n');
}
async function _fetchRealGems(dest:string, country:string, region:string, interests:string[]){
  for(let attempt=0; attempt<2; attempt++){
    if(attempt>0){ await new Promise(function(r){ setTimeout(r, 1500); }); }
    try{
      const res = await fetch(SUPABASE_ENDPOINT,{
        method:'POST', headers:SUPABASE_HEADERS,
        body:JSON.stringify({prompt:buildGemsSearchPrompt(dest, country, region, interests), webSearch:true})
      });
      if(!res.ok) continue;
      const data = await res.json();
      if(data.error) continue;
      const raw = data.result || '';
      if(!raw) continue;
      let j = parseItineraryJSON(raw);
      if(!j || !Array.isArray(j.gems)){
        const m = raw.match(/\{[^]*"gems"[^]*\}/);
        if(m){ try{ j = JSON.parse(m[0]); }catch(e){} }
      }
      if(!j || !Array.isArray(j.gems)) continue;
      const valid = j.gems.filter(function(g:any){
        return g && g.name && typeof g.name==='string'
          && g.name.trim().length>=3 && !/^\d+$/.test(g.name.trim());
      });
      if(valid.length) return valid;
    }catch(e){}
  }
  return null;
}

function buildDestPhotoSearchPrompt(dest:string, country:string, region:string){
  return [
    'Cherche activement une VRAIE photo (paysage, ville ou monument emblématique, pas un plan rapproché de personnes) de la destination : '+(dest||'')+' ('+(country||region||'')+').',
    'Regarde en priorité Wikimedia Commons, mais aussi TripAdvisor ou une fiche Google Maps/Business si l\'URL d\'image directe y apparaît — c\'est fréquent, ne t\'en prive pas si elle y est.',
    'EXIGENCES STRICTES :',
    '- UNIQUEMENT une URL d\'image DIRECTE (se terminant par .jpg/.jpeg/.png/.webp, ou une URL Google Maps/Business photo), jamais une page Wikipedia/TripAdvisor ou un lien vers une galerie.',
    '- La seule règle qui compte : ne JAMAIS inventer ou reconstruire une URL à partir d\'un pattern connu — uniquement une URL que tu as VUE mot pour mot, telle quelle, dans un extrait/snippet de recherche. Si tu ne l\'as pas vue ainsi, réponds "photo":"" plutôt que de risquer une URL fictive.',
    'Réponds UNIQUEMENT en JSON compact, sans texte autour :',
    '{"photo":""}',
  ].join('\n');
}
function _validDestPhoto(url:any){
  if(typeof url!=='string') return '';
  const u=url.trim();
  if(!/^https:\/\/upload\.wikimedia\.org\/.+\.(jpe?g|png)$/i.test(u)
     && !/^https:\/\/(dynamic-media-cdn|media-cdn)\.tripadvisor\.com\/.+\.(jpe?g|png|webp)(\?.*)?$/i.test(u)
     && !/^https:\/\/lh[3-6]\.googleusercontent\.com\/.+$/i.test(u)) return '';
  if(/\[|\]|example\.com|placeholder/i.test(u)) return '';
  return u;
}
async function _fetchRealDestPhoto(dest:string, country:string, region:string){
  try{
    const res = await fetch(SUPABASE_ENDPOINT,{
      method:'POST', headers:SUPABASE_HEADERS,
      body:JSON.stringify({prompt:buildDestPhotoSearchPrompt(dest, country, region), webSearch:true})
    });
    if(!res.ok) return '';
    const data = await res.json();
    if(data.error) return '';
    const raw = data.result || '';
    if(!raw) return '';
    let j = parseItineraryJSON(raw);
    if(!j){
      const m = raw.match(/\{[^]*"photo"[^]*\}/);
      if(m){ try{ j = JSON.parse(m[0]); }catch(e){} }
    }
    const photo = j && typeof j.photo==='string' ? j.photo.trim() : '';
    return _validDestPhoto(photo);
  }catch(e){ return ''; }
}
function _wikiExtractImage(data:any){
  if(!data || data.type === 'disambiguation') return '';
  const raw = (data.originalimage && data.originalimage.source) || (data.thumbnail && data.thumbnail.source) || '';
  const img = raw.split('?')[0];
  return /^https:\/\/upload\.wikimedia\.org\/.+\.(jpe?g|png)$/i.test(img) ? img : '';
}
const _WIKI_NON_SCENIC_RX = /\.svg[/.]|flag[_-]of|coat[_-]of[_-]arms|blason|locator|orthographic|projection|landsat|satellite|photosat|cloud-free|\blocation[_-]|\bmap\b|_map\.|administrative|topographic|logo/i;
function _isLikelyScenicWikiImage(url:string){
  return !!url && !_WIKI_NON_SCENIC_RX.test(url);
}
async function _wikiResolveTitle(host:string, name:string){
  try{
    const res = await fetch('https://'+host+'/w/api.php?action=query&list=search&format=json&origin=*&srlimit=1&srsearch='+encodeURIComponent(name));
    if(!res.ok) return '';
    const data = await res.json();
    const hit = data && data.query && data.query.search && data.query.search[0];
    return hit ? hit.title : '';
  }catch(e){ return ''; }
}
async function _wikiPageImage(host:string, title:string){
  try{
    const res = await fetch('https://'+host+'/api/rest_v1/page/summary/'+encodeURIComponent(title), { headers:{'Accept':'application/json'} });
    if(!res.ok) return '';
    const img = _wikiExtractImage(await res.json());
    return _isLikelyScenicWikiImage(img) ? img : '';
  }catch(e){ return ''; }
}
async function _wikiSitePhoto(host:string, name:string){
  if(!name) return '';
  let photo = await _wikiPageImage(host, name);
  if(photo) return photo;
  const resolved = await _wikiResolveTitle(host, name);
  if(!resolved || resolved.toLowerCase() === String(name).toLowerCase()) return '';
  return await _wikiPageImage(host, resolved);
}
async function _fetchDestPhoto(dest:string, country:string, region:string){
  const hosts = ['fr.wikivoyage.org', 'fr.wikipedia.org'];
  for(let i=0; i<hosts.length; i++){
    const fromDest = await _wikiSitePhoto(hosts[i], dest);
    if(fromDest) return fromDest;
    const fromCountry = await _wikiSitePhoto(hosts[i], country || region);
    if(fromCountry) return fromCountry;
  }
  return await _fetchRealDestPhoto(dest, country, region);
}

function _normDest(s:string){
  return (s||'').toString().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function _destinationMatches(requested:string, gotDest:string, gotCountry:string){
  const req=_normDest(requested);
  if(!req) return true;
  const got=_normDest((gotDest||'')+' '+(gotCountry||''));
  if(!got) return false;
  if(got.indexOf(req)!==-1 || req.indexOf(got)!==-1) return true;
  const reqWords=req.split(' ').filter(function(w){return w.length>=4;});
  if(!reqWords.length) return got.indexOf(req)!==-1;
  return reqWords.some(function(w){return got.indexOf(w)!==-1;});
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 6 — orchestration complète (port de callCartographe), avec
   rapport de progression réel écrit dans generation_jobs à chaque étape
   ═══════════════════════════════════════════════════════════════════════ */

type ProgressFn = (progress:number, phase:string) => Promise<void>;

async function callCartographe(state:any, onProgress:ProgressFn){
  const genCtx:GenCtx = { genStays:[], genLastSteps:[], genAllSteps:[] };
  const b=buildBrief(state);
  const dc=b.daysCount;

  await onProgress(5, 'Lecture de vos envies…');

  let skel:any=null;
  for(let offset=0; offset<dc; offset+=SKEL_BATCH_SIZE){
    const batchResult=await _completeJSON(buildSkeletonPrompt(state, genCtx, dc, SKEL_BATCH_SIZE, offset));
    if(offset===0){
      skel=batchResult;
      if(!skel||!Array.isArray(skel.plan)||!skel.plan.length) return null;
      if(state.destination && !_destinationMatches(state.destination, skel.dest, skel.country)){
        const retryResult=await _completeJSON(buildSkeletonPrompt(state, genCtx, dc, SKEL_BATCH_SIZE, offset));
        if(retryResult && Array.isArray(retryResult.plan) && retryResult.plan.length && _destinationMatches(state.destination, retryResult.dest, retryResult.country)){
          skel=retryResult;
        } else if(retryResult && Array.isArray(retryResult.plan) && retryResult.plan.length){
          skel=retryResult;
          skel.dest=state.destination;
        } else {
          skel.dest=state.destination;
        }
      }
      genCtx.genStays=skel.stays||[];
      genCtx.genLastSteps=skel.plan.slice(-2);
      genCtx.genAllSteps=skel.plan.slice();
    } else {
      const morePlan=(batchResult&&Array.isArray(batchResult.plan))?batchResult.plan:[];
      skel.plan=skel.plan.concat(morePlan);
      genCtx.genLastSteps=skel.plan.slice(-2);
      genCtx.genAllSteps=skel.plan.slice();
    }
  }
  if(skel.plan.length>dc) skel.plan=skel.plan.slice(0,dc);
  skel.days_count=skel.plan.length;
  await onProgress(20, 'Composition du circuit…');

  const flightPromise=_fetchFlightPriceFromWeb(state, skel.dest, skel.country, state.dateFrom, state.dateTo, state.travelers);
  const heroPhotoPromise=_fetchDestPhoto(skel.dest, skel.country, skel.region);

  if(Array.isArray(skel.stays) && skel.stays.length){
    await onProgress(35, 'Vérification des hébergements…');
    const zones = skel.stays.map(function(s:any){ return s.loc || s.zone || skel.dest; });
    const dateRanges = _computeStayDateRanges(skel.stays, state.dateFrom);
    const realStays = await _fetchRealStays(skel.dest, zones, skel.level, dateRanges);
    skel.stays = _mergeRealStays(skel.stays, zones, realStays);

    const failedIdx = skel.stays.map(function(s:any,i:number){ return s.verified?-1:i; }).filter(function(i:number){ return i>=0; });
    if(failedIdx.length){
      const failedZones = failedIdx.map(function(i:number){ return zones[i]; });
      const failedRanges = failedIdx.map(function(i:number){ return dateRanges[i]; });
      const retryStays = await _fetchRealStays(skel.dest, failedZones, skel.level, failedRanges);
      const merged = _mergeRealStays(failedIdx.map(function(i:number){ return skel.stays[i]; }), failedZones, retryStays);
      failedIdx.forEach(function(i:number, k:number){ skel.stays[i] = merged[k]; });
    }

    const nameMap:Record<string,string> = {};
    (genCtx.genStays||[]).forEach(function(old:any, i:number){
      if(skel.stays[i]) nameMap[old.name] = skel.stays[i].name;
    });
    skel.plan.forEach(function(p:any){
      if(p && p.night && nameMap[p.night]) p.night = nameMap[p.night];
    });
    genCtx.genStays = skel.stays;
  }
  await onProgress(50, 'Rédaction des étapes…');

  const allDays:any[]=[];
  for(let offset=0; offset<skel.plan.length; offset+=DAYS_BATCH_SIZE){
    const batch=skel.plan.slice(offset, offset+DAYS_BATCH_SIZE);
    const batchResult=await _completeJSON(buildDaysPrompt(state, skel, batch, offset));
    const batchDays=(batchResult&&Array.isArray(batchResult.days))?batchResult.days:[];
    for(let i=0;i<batch.length;i++){ allDays.push(batchDays[i]||null); }
    await onProgress(50 + Math.round(20*(offset+batch.length)/skel.plan.length), 'Rédaction des étapes…');
  }
  const daysDetail={days:allDays};

  await onProgress(75, 'Sélection des restaurants…');
  try{
    const restoIdx:number[]=[]; const places:string[]=[];
    allDays.forEach(function(dd, i){
      if(dd && dd.restaurant && dd.restaurant.name){
        const place = (skel.plan[i] && skel.plan[i].loc) || skel.dest;
        restoIdx.push(i); places.push(place);
      }
    });
    if(places.length){
      const realRestos = await _fetchRealRestos(skel.dest, places, skel.level);
      if(realRestos && realRestos.length){
        const norm=function(s:any){return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim();};
        const used:Record<number,boolean>={};
        restoIdx.forEach(function(dayI, k){
          const place = places[k];
          let real:any = null;
          for(let m=0;m<realRestos.length;m++){
            if(used[m]) continue;
            const rp = norm(realRestos[m].place);
            if(rp && (rp===norm(place) || rp.indexOf(norm(place))>=0 || norm(place).indexOf(rp)>=0)){
              real = realRestos[m]; used[m]=true; break;
            }
          }
          if(!real && realRestos[k] && !used[k]){ real = realRestos[k]; used[k]=true; }
          const validName = real && real.name && typeof real.name==='string'
            && real.name.trim().length>=3 && !/^\d+$/.test(real.name.trim());
          if(validName && allDays[dayI] && allDays[dayI].restaurant){
            const r = allDays[dayI].restaurant;
            r.name = real.name.trim();
            if(real.type) r.type = real.type;
            if(real.price) r.price = real.price;
            if(real.note && real.note.length>4) r.note = real.note;
            if(real.review && real.review.length>4) r.review = real.review;
            if(real.rating) r.rating = real.rating;
            const validMaps = _validMapsUrl(real.maps_url);
            if(validMaps) r.mapsUrl = validMaps;
          }
        });
      }
    }
  }catch(e){}

  await onProgress(85, 'Recherche des pépites cachées…');
  let hilites:any = null;
  try {
    hilites = await _completeJSON(buildHighlightsPrompt(state, skel));
  } catch(e) {}

  try{
    const realGems = await _fetchRealGems(skel.dest, skel.country, skel.region, state.interests);
    if(realGems && realGems.length){
      if(!hilites) hilites = {};
      hilites.gems = realGems;
    }
  }catch(e){}

  await onProgress(93, 'Derniers ajustements…');
  let flightInfo:any=null;
  try{ flightInfo=await flightPromise; }catch(e){ flightInfo=null; }
  let heroPhoto='';
  try{ heroPhoto=await heroPhotoPromise; }catch(e){ heroPhoto=''; }

  return {skel:skel, days:daysDetail, hilites:hilites, flightInfo:flightInfo, heroPhoto:heroPhoto};
}

async function callCartographeWithRetry(state:any, maxAttempts:number, onProgress:ProgressFn){
  let lastErr:any=null;
  for(let attempt=0; attempt<maxAttempts; attempt++){
    if(attempt>0){
      await onProgress(5, 'Nouvelle tentative…');
      await new Promise(function(r){ setTimeout(r, 1500); });
    }
    try{
      const result=await callCartographe(state, onProgress);
      if(result && result.skel && Array.isArray(result.skel.plan) && result.skel.plan.length) return result;
      lastErr=new Error('résultat vide ou incomplet');
    }catch(e){
      lastErr=e;
    }
  }
  throw lastErr||new Error('échec de génération après plusieurs tentatives');
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 7 — HTTP handler & job lifecycle
   ═══════════════════════════════════════════════════════════════════════ */

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/* Champs whitelist du "state" client — même liste que buildBrief/etc.
   ci-dessus consomment. On ne stocke/utilise que ceux-là, pas le body brut. */
const STATE_FIELDS = [
  'createTab','destination','origin','dateFrom','dateTo','travelers','budget',
  'rythme','styles','interests','occasion','flightOut','flightIn','dream',
  'childrenCount','childrenAges','transport','dietary','alreadyDone',
  'fitnessLevel','accomStyle',
];
function whitelistState(raw:any){
  const out:any={};
  STATE_FIELDS.forEach(function(k){ if(raw && raw[k]!==undefined) out[k]=raw[k]; });
  return out;
}

async function runPipeline(jobId:string, userId:string, state:any, admin:any){
  const onProgress:ProgressFn = async function(progress, phase){
    try{
      await admin.from('generation_jobs').update({
        progress: Math.min(99, progress), phase: phase, updated_at: new Date().toISOString(),
      }).eq('id', jobId);
    }catch(e){}
  };
  try{
    await admin.from('generation_jobs').update({ status:'running', updated_at: new Date().toISOString() }).eq('id', jobId);

    const result = await callCartographeWithRetry(state, 2, onProgress);
    const itinerary = applyGenerated(state, result.skel, result.days, result.hilites, result.flightInfo, result.heroPhoto);
    if(!itinerary || !itinerary.dest || !Array.isArray(itinerary.plan) || !itinerary.plan.length){
      throw new Error('résultat de génération vide ou incomplet');
    }

    const { data: inserted, error: insertErr } = await admin.from('itineraries').insert({
      user_id: userId,
      destination: itinerary.dest,
      dates: itinerary.dates,
      days: itinerary.days,
      budget: itinerary.budgetTotal,
      data: itinerary,
    }).select('id').single();
    if(insertErr) throw insertErr;

    await admin.from('notifications').insert({
      user_id: userId,
      title: 'Votre voyage est prêt',
      body: 'Votre itinéraire pour '+itinerary.dest+' vient d\'être généré.',
      kind: 'itinerary_ready',
      link: 'trip:'+inserted.id,
    });

    await admin.from('generation_jobs').update({
      status:'done', progress:100, phase:'ready',
      result_itinerary_id: inserted.id, finished_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }).eq('id', jobId);
  }catch(e:any){
    const message = String(e && e.message || e).slice(0, 500);
    try{
      await admin.from('generation_jobs').update({
        status:'error', error: message, finished_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }).eq('id', jobId);
    }catch(e2){}
    /* La génération peut échouer alors que l'utilisateur n'a plus l'app
       ouverte — sans cette notification d'échec, il n'aurait jamais aucun
       retour et penserait que son voyage arrive encore. */
    try{
      await admin.from('notifications').insert({
        user_id: userId,
        title: 'Échec de génération',
        body: 'La génération de votre itinéraire ('+(state.destination||'destination surprise')+') a échoué. Réessayez depuis l\'app.',
        kind: 'info',
        link: null,
      });
    }catch(e3){}
  }
}

Deno.serve(async (req:Request) => {
  if(req.method === 'OPTIONS'){
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if(req.method !== 'POST'){
    return new Response(JSON.stringify({ error: 'method not allowed' }), { status: 405, headers: { ...CORS_HEADERS, 'content-type':'application/json' } });
  }

  try{
    const authHeader = req.headers.get('Authorization') || '';

    /* Client scopé au JWT de la requête : sert UNIQUEMENT à vérifier que
       c'est une vraie session utilisateur (pas juste la clé anon) — toutes
       les écritures utilisent ensuite le client admin (service role). */
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if(userErr || !userData || !userData.user){
      return new Response(JSON.stringify({ error: 'authentification requise' }), { status: 401, headers: { ...CORS_HEADERS, 'content-type':'application/json' } });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(function(){ return null; });
    const rawState = body && body.state;
    if(!rawState || typeof rawState !== 'object'){
      return new Response(JSON.stringify({ error: '"state" manquant' }), { status: 400, headers: { ...CORS_HEADERS, 'content-type':'application/json' } });
    }
    const state = whitelistState(rawState);
    const hasDestination = !!state.destination;
    const isSurprise = state.createTab === 'surprise';
    if(!hasDestination && !isSurprise){
      return new Response(JSON.stringify({ error: 'destination manquante' }), { status: 400, headers: { ...CORS_HEADERS, 'content-type':'application/json' } });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: job, error: jobErr } = await admin.from('generation_jobs').insert({
      user_id: userId, status: 'pending', progress: 0, phase: 'queued', state: state,
    }).select('id').single();
    if(jobErr || !job){
      return new Response(JSON.stringify({ error: 'création du job impossible' }), { status: 500, headers: { ...CORS_HEADERS, 'content-type':'application/json' } });
    }

    /* @ts-ignore — EdgeRuntime est un global injecté par le runtime Supabase,
       pas standard Deno : permet de répondre vite tout en continuant le
       pipeline en arrière-plan (voir docs Supabase "Background Tasks"). */
    EdgeRuntime.waitUntil(runPipeline(job.id, userId, state, admin));

    return new Response(JSON.stringify({ jobId: job.id, status: 'pending' }), {
      status: 202, headers: { ...CORS_HEADERS, 'content-type':'application/json' },
    });
  }catch(e:any){
    return new Response(JSON.stringify({ error: String(e && e.message || e) }), { status: 500, headers: { ...CORS_HEADERS, 'content-type':'application/json' } });
  }
});
