/* ── HIC SUNT · Sillage — moteur de génération IA ──────────────────────
   Connecté à l'Edge Function Supabase (super-endpoint).
   3 passes : ossature → jours détaillés → adresses & highlights        */

const SUPABASE_ENDPOINT = 'https://lucbxwxcismnvcdnctau.supabase.co/functions/v1/super-endpoint';

const GEN_KINDS = ['plane','fork','droplet','wave','peaks','arch','leaf','sun','moon','bed','star','camera','ticket','pin','compass'];
const GEN_SKY   = ['sun','cloud','rain'];
const TAG_MAP   = {
  plane:['plane','Transfert'], fork:['fork','Table'], droplet:['droplet','Détente'],
  wave:['wave','Océan'], peaks:['peaks','Marche'], arch:['arch','Patrimoine'],
  leaf:['leaf','Nature'], sun:['sun','Plein air'], moon:['moon','Soirée'],
  bed:['bed','Repos'], star:['star','Temps fort'], camera:['camera','Photo'],
  ticket:['ticket','Expérience'], pin:['pin','Étape'], compass:['compass','Exploration'],
};

function _clampInt(v, lo, hi, dflt){ const n=Math.round(Number(v)); return isFinite(n)?Math.max(lo,Math.min(hi,n)):dflt; }
function _kind(x){ return GEN_KINDS.includes(x)?x:'pin'; }
function _stayIcon(type){
  const t=(type||'').toLowerCase();
  if(/mer|océan|ocean|plage|beach|front/.test(t)) return 'wave';
  if(/villa|piscine|pool/.test(t)) return 'droplet';
  if(/lodge|jungle|nature|tente|camp|safari|éco|eco/.test(t)) return 'leaf';
  if(/riad|palais|palace|temple|fort|kasbah|ryokan|maison|demeure/.test(t)) return 'arch';
  if(/sommet|montagne|chalet|refuge/.test(t)) return 'peaks';
  return 'bed';
}
function _occasionLabel(id){
  const o=(typeof OCCASIONS!=='undefined')&&OCCASIONS.find(function(x){return x.id===id;});
  return o?o.label:null;
}
function _interestsDirective(){
  const interests=(state.interests||[]);
  if(!interests.length) return '';
  return 'INTÉRÊTS DU CLIENT (impératif — CHAQUE jour doit refléter au moins un de ces intérêts dans ses moments/activités, et la majorité des moments du voyage doivent s\'y rattacher) : '+interests.join(', ')+'. Ne propose PAS d\'activités hors de ces thèmes sauf nécessité logistique (transferts, repas).';
}
function _antiTouristDirective(){
  return 'EXIGENCE ÉDITORIALE HIC SUNT (non négociable, prioritaire sur tout le reste) : Hic Sunt signifie "Beyond the Known" — chaque étape doit éviter le circuit touristique de masse. '
    + 'AUTO-VÉRIFICATION OBLIGATOIRE avant de valider chaque lieu : "Ce nom apparaît-il dans le top 5 des résultats Google Images, TripAdvisor ou Instagram pour cette destination ?" Si oui, c\'est interdit — trouve une alternative réelle et moins connue. '
    + 'Exemples concrets de ce qui est INTERDIT sauf demande explicite du client : Jardin Majorelle à Marrakech, plage de Patong ou Kata à Phuket, Wat Pho/Wat Arun à Bangkok, Ubud central à Bali, Santorin/Oia, Eiffel/Louvre à Paris — et tout équivalent "carte postale" dans n\'importe quelle destination. '
    + 'Remplace systématiquement par l\'alternative la plus secrète et la moins fréquentée de la même région : une crique voisine au lieu de la plage la plus citée, un marché de quartier au lieu du marché central, un village à 20-40 minutes au lieu de la ville-aimant-à-touristes, un riad/maison d\'hôtes tenu par des locaux au lieu de l\'adresse listée partout, un jardin privé ou une plantation discrète au lieu du jardin botanique le plus visité. '
    + 'Si l\'utilisateur mentionne explicitement vouloir éviter la foule/le tourisme de masse, c\'est une contrainte ABSOLUE : aucune plage/site bondé en haute saison, même célèbre, ne doit apparaître, même en filigrane ou en passage rapide. '
    + 'Les hébergements doivent aussi privilégier des adresses indépendantes et discrètes plutôt que les grandes chaînes archi-connues, sauf si le niveau de confort/style du client l\'exige explicitement.';
}

/* ── traduction des réponses du questionnaire en consignes concrètes ── */
const RYTHME_MOMENTS={'Lent':2,'Équilibré':3,'Intense':4};
function _momentsPerDay(){ return RYTHME_MOMENTS[state.rythme] || 3; }
function _rythmeDirective(){
  const r=state.rythme||'Équilibré';
  if(r==='Lent') return 'Rythme LENT : peu d\'étapes par jour, larges plages libres, favoriser un même lieu plusieurs jours, transferts courts.';
  if(r==='Intense') return 'Rythme INTENSE : journées denses, plusieurs activités/lieux par jour, peu de temps mort, maximiser les découvertes.';
  return 'Rythme ÉQUILIBRÉ : alternance activités et temps libre, transferts raisonnables.';
}
function _occasionDirective(){
  const id=state.occasion;
  if(!id) return '';
  const map={
    'lune-de-miel':'OCCASION — Lune de miel : privilégier dîners romantiques en tête-à-tête, hébergements intimistes (vue, terrasse privée, suites), moments à deux (massage en duo, bateau privé, coucher de soleil).',
    'anniversaire':'OCCASION — Anniversaire : prévoir au moins un moment de célébration mémorable (dîner spécial, surprise locale, expérience exclusive le jour J si possible).',
    'evjf':'OCCASION — EVJF : adresses tendance et instagrammables, spas/bien-être, brunchs et rooftops, ambiance festive entre amies.',
    'evg':'OCCASION — EVG : expériences fortes en sensations (sports, sorties nocturnes, activités entre amis), ambiance conviviale et dynamique.',
    'famille':'OCCASION — En famille : activités adaptées à tous âges (pas d\'horaires extrêmes, pas de randonnées trop longues), hébergements avec espace/piscine, rythme doux.',
    'solo':'OCCASION — En solo : favoriser rencontres locales, hébergements conviviaux (guesthouses, petites adresses), activités modulables.',
  };
  return map[id]||'';
}
function _styleDirective(){
  const styles=(state.styles||[]);
  if(!styles.length) return '';
  const lower=styles.join(' ').toLowerCase();
  const notes=[];
  if(lower.includes('luxe')) notes.push('hébergements haut de gamme, services premium, adresses signature');
  if(lower.includes('authentique')||lower.includes('local')) notes.push('guesthouses et adresses tenues par des locaux, immersion culturelle');
  if(lower.includes('nature')||lower.includes('aventure')) notes.push('lodges nature, accès direct aux sentiers/sites naturels');
  if(lower.includes('détente')||lower.includes('bien-être')) notes.push('hébergements avec spa/piscine, journées avec temps de repos');
  if(lower.includes('gastro')||lower.includes('culinaire')) notes.push('hébergements proches de bonnes tables, expériences culinaires locales');
  return notes.length ? 'STYLE DE VOYAGE ('+styles.join(', ')+') : '+notes.join(' ; ')+'.' : '';
}
function _dreamDirective(){
  if(!state.dream) return '';
  const surprise=state.createTab==='surprise';
  return (surprise?'CONTRAINTES / À ÉVITER (impératif) : ':'ENVIE PRIORITAIRE DU CLIENT (à intégrer absolument) : ')+state.dream;
}

/* ── catégories thématiques & palettes adaptatives ───────────────────── */
/* chaque "kind" de moment appartient à une catégorie thématique */
const KIND_CATEGORY={
  peaks:'hike', leaf:'hike', compass:'hike',
  wave:'beach',
  droplet:'spa',
  fork:'food', moon:'food',
  arch:'culture', camera:'culture', star:'culture', ticket:'culture',
  sun:'outdoor',
  plane:'transit', bed:'transit', pin:'culture',
};
const CATEGORY_LABELS={
  hike:'Rando & nature', beach:'Plage & océan', spa:'Bien-être',
  food:'Table & saveurs', culture:'Patrimoine', outdoor:'Plein air', transit:'Transfert',
};

/* palettes par "climat visuel" — choisies selon mots-clés de la destination/région */
const THEME_PALETTES={
  tropical:{ hike:'#7BAE6E', beach:'#5B9FBE', spa:'#E8A0A0', food:'#C98A52', culture:'#B07EB0', outdoor:'#C9A853', transit:'#8A9E88' },
  desert:  { hike:'#C9A853', beach:'#E0C28A', spa:'#E8B7A0', food:'#C9784F', culture:'#B5895A', outdoor:'#D9B26A', transit:'#A99572' },
  alpine:  { hike:'#6FA888', beach:'#6FA0C9', spa:'#C9B6E8', food:'#C98A52', culture:'#9BA7B5', outdoor:'#7BAEBE', transit:'#94A3A8' },
  urban:   { hike:'#7BAE6E', beach:'#5B9FBE', spa:'#D9A0C9', food:'#C9965A', culture:'#9B85CC', outdoor:'#C9A853', transit:'#8A9E88' },
  mediterranean:{ hike:'#8BAE6E', beach:'#5BA8C9', spa:'#E8C0A0', food:'#C9784F', culture:'#C9A85A', outdoor:'#7BC4B0', transit:'#A99880' },
};
function _themeForDestination(dest, region, country){
  const s=((dest||'')+' '+(region||'')+' '+(country||'')).toLowerCase();
  if(/maroc|sahara|désert|jordanie|égypte|namibie|dubai|émirats|oman/.test(s)) return 'desert';
  if(/islande|alpes|pérou|andes|nepal|himalaya|patagonie|norvège|suisse|montagne/.test(s)) return 'alpine';
  if(/japon|tokyo|new york|londres|paris|corée|singapour|hong kong/.test(s)) return 'urban';
  if(/italie|grèce|espagne|portugal|croatie|sardaigne|sicile|provence|méditerran/.test(s)) return 'mediterranean';
  return 'tropical';
}

/* ── coefficient de coût de vie par destination ──────────────────────
   Le niveau de confort (Éco/Confort/Luxe/Ultra) définit une fourchette
   de base en €/pers/jour, calibrée sur un coût de vie "Europe de l'Ouest".
   Ce coefficient l'ajuste à la réalité locale (Asie du SE, Afrique etc.
   sont nettement moins chères ; Japon/Suisse/USA/Émirats plus chères). ── */
function _costOfLivingFactor(dest, region, country){
  const s=((dest||'')+' '+(region||'')+' '+(country||'')).toLowerCase();
  /* zones très onéreuses */
  if(/japon|tokyo|kyoto|suisse|norvège|islande|new york|émirats|dubai|singapour|hong kong/.test(s)) return 1.25;
  /* zones très économiques */
  if(/thaïlande|vietnam|cambodge|laos|indonésie|bali|sri lanka|inde|népal|philippines|maroc|égypte|kenya|tanzanie|madagascar/.test(s)) return 0.55;
  /* zones modérément économiques */
  if(/portugal|grèce|croatie|mexique|pérou|colombie|turquie|géorgie|albanie/.test(s)) return 0.75;
  /* défaut : Europe de l'Ouest / Amérique du Nord */
  return 1;
}

/* ── fourchettes de prix de vols A/R au départ de Paris, par zone ──────
   Calibré sur des moyennes réelles observées (sources : comparateurs de vols,
   moyennes 2026). Volontairement large car les tarifs varient fortement
   selon la saison et le délai de réservation — l'objectif est un budget
   crédible, pas un prix de billet exact. ── */
const FLIGHT_BANDS={
  court:    [80, 320],   /* Maroc, Italie, Espagne, Portugal, Grèce, Croatie... */
  moyen:    [250, 550],  /* Turquie, Égypte, Émirats, Europe de l'Est lointaine... */
  long:     [600, 1050], /* Thaïlande, Bali, Sri Lanka, Kenya, Inde... */
  tresLong: [800, 1450], /* Amérique, Océanie, Japon, Pacifique... */
};
function _flightBand(dest, region, country){
  const s=((dest||'')+' '+(region||'')+' '+(country||'')).toLowerCase();
  if(/maroc|italie|espagne|portugal|grèce|croatie|sardaigne|sicile|provence|méditerran|tunisie|malte|chypre/.test(s)) return 'court';
  if(/turquie|égypte|émirats|dubai|jordanie|géorgie|albanie|israël|liban|arménie/.test(s)) return 'moyen';
  if(/thaïlande|vietnam|cambodge|laos|indonésie|bali|sri lanka|inde|népal|philippines|kenya|tanzanie|madagascar|maldives|birmanie/.test(s)) return 'long';
  if(/japon|corée|chine|singapour|hong kong|australie|nouvelle-zélande|pérou|colombie|mexique|brésil|argentine|chili|états-unis|canada|polynésie|tahiti|fidji/.test(s)) return 'tresLong';
  return 'long';
}
function _flightEstimate(dest, region, country, travelers){
  const band = FLIGHT_BANDS[_flightBand(dest, region, country)];
  const perPerson = Math.round((band[0]+band[1])/2);
  return perPerson * Math.max(1, travelers||1);
}

/* ── brief ───────────────────────────────────────────────────────────── */
function buildBrief(){
  const surprise=state.createTab==='surprise';
  const occ=_occasionLabel(state.occasion);
  let datesLine='Dates : non précisées', durationLine='', daysCount=7;
  if(state.dateFrom&&state.dateTo){
    const from=new Date(state.dateFrom), to=new Date(state.dateTo);
    const days=Math.round((to-from)/86400000);
    const fmt=function(d){return d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});};
    datesLine='Dates : '+fmt(from)+' au '+fmt(to);
    durationLine='Durée : '+days+' jour'+(days>1?'s':'');
    if(days>0) daysCount=days;
  }
  const flightsLine=(state.flightOut||state.flightIn)
    ?'Vols : aller '+(state.flightOut||'non renseigné')+' / retour '+(state.flightIn||'non renseigné'):'';
  const lines=[
    'Destination : '+(state.destination?state.destination:(surprise?'SURPRISE — choisis la destination la plus désirable pour ce profil':'')),
    'Départ : '+(state.origin||'Paris'),
    datesLine, durationLine,
    'Voyageurs : '+travelerLabel(),
    'Confort : '+(state.budget||'Confort'),
    'Rythme : '+(state.rythme||'Équilibré'),
    'Styles : '+((state.styles||[]).join(', ')||'variés'),
    "Intérêts : "+((state.interests||[]).join(', ')||'découverte générale'),
    'Occasion : '+(occ||'aucune'),
    flightsLine,
    (surprise?'Contraintes / à éviter : ':'Rêve du voyage : ')+(state.dream||'—'),
  ].filter(Boolean).join('\n');
  return {surprise:surprise, lines:lines, daysCount:daysCount};
}

/* ── Passe 1 : ossature + étapes (par lots si voyage long) ───────────── */
const SKEL_BATCH_SIZE = 7;
function buildSkeletonPrompt(dc, batchSize, offset){
  const b=buildBrief();
  const isFirst = offset === 0;
  const n = Math.min(batchSize, dc-offset);
  const common=[
    '- Étapes RÉELLES dans un ordre logique géographiquement (ne pas sauter d\'un bout à l\'autre du pays).',
    '- "night" de chaque entrée "plan" = "name" EXACT d\'un hébergement de "stays".',
    '- sky dans [sun, cloud, rain].',
    '- Réponds UNIQUEMENT en JSON compact valide, sans texte ni markdown autour.',
  ];
  if(isFirst){
    const directives=[_antiTouristDirective(),_interestsDirective(),_rythmeDirective(),_occasionDirective(),_styleDirective(),_dreamDirective()].filter(Boolean);
    const destLock = (!b.surprise && state.destination)
      ? '\n⚠️ DESTINATION IMPOSÉE PAR LE CLIENT (non négociable, ne PAS en choisir une autre) : "'+state.destination+'". Tout le voyage doit se dérouler dans cette destination exacte ou sa région immédiate. Le champ "dest" de ta réponse DOIT être "'+state.destination+'" (ou son nom complet usuel), jamais une autre destination.\n'
      : '';
    return [
      'Tu es le cartographe senior de Hic Sunt, maison de voyages haut de gamme avec une exigence éditoriale absolue.',
      destLock,
      'Compose l\'OSSATURE d\'un itinéraire RÉEL, DÉSIRABLE et PRÉCIS de '+dc+' jours au total.',
      '',
      '═══ BRIEF CLIENT ═══',
      b.lines,
      '',
      '═══ DIRECTIVES PERSONNALISATION (à respecter dans le choix des étapes et hébergements) ═══',
      directives.length?directives.join('\n'):'Aucune contrainte spécifique au-delà du brief ci-dessus.',
      '',
      '═══ CONSIGNES STRICTES ═══',
      common.join('\n'),
      '- "plan" doit contenir EXACTEMENT '+n+' entrées : les jours 1 à '+n+' de ce voyage de '+dc+' jours (les jours suivants seront détaillés séparément).',
      '- "stays" doit couvrir TOUT le voyage de '+dc+' jours (pas seulement ces '+n+' premiers jours) — prévoir tous les hébergements nécessaires pour les '+dc+' jours. Pas plus de '+Math.min(8,Math.max(3,Math.ceil(dc/3)))+' hébergements différents.',
      '- Les hébergements doivent refléter les directives de personnalisation ci-dessus (style, occasion).',
      '- "budget" = fourchette totale réaliste en euros pour TOUS les voyageurs sur les '+dc+' jours (hébergements+repas+activités+transport local, hors vols).',
      '  · Éco: 60-100€/pers/j · Confort: 120-220€/pers/j · Luxe: 250-500€/pers/j · Ultra: 500€+/pers/j',
      destLock ? '\nRappel final : "dest" doit être "'+state.destination+'". Ne propose AUCUNE autre destination.' : '',
      '',
      'SCHÉMA (respecte les types et clés exactement) :',
      '{"dest":"","country":"","tagline":"phrase poétique évocatrice","level":"Éco|Confort|Luxe|Ultra","dates":"ex: Août 2026 · '+dc+' jours","days_count":'+dc+',"budget":0,"season":"meilleure saison courte","coords":"ex: 6°55′N · 79°51′E","region":"région","stays":[{"name":"vrai nom hébergement","type":"ex: Lodge safari","loc":"ville","price":0,"nights":1,"blurb":"max 6 mots évocateurs"}],"plan":[{"title":"titre évocateur","loc":"ville / zone","night":"nom exact stays","sky":"sun","temp":"27°","hook":"accroche 1 phrase narrative"}]}',
    ].filter(Boolean).join('\n');
  }
  /* batches suivants : continuer le plan uniquement, avec les stays déjà établis */
  const staysList=(state._genStays||[]).map(function(s){return '- "'+s.name+'" ('+s.type+', '+s.loc+')';}).join('\n');
  return [
    'Tu es le cartographe senior de Hic Sunt. Tu CONTINUES l\'itinéraire de '+dc+' jours déjà commencé.',
    '',
    '═══ BRIEF CLIENT ═══',
    b.lines,
    '',
    'Hébergements déjà établis pour ce voyage (réutilise EXACTEMENT ces noms dans "night", n\'en crée pas de nouveaux) :',
    staysList,
    '',
    '═══ CONSIGNES STRICTES ═══',
    common.join('\n'),
    '- "plan" doit contenir EXACTEMENT '+n+' entrées : les jours '+(offset+1)+' à '+(offset+n)+' de ce voyage de '+dc+' jours.',
    '- Continue logiquement depuis l\'étape précédente (même région ou étape suivante du circuit).',
    '',
    'Réponds UNIQUEMENT avec :',
    '{"plan":[{"title":"titre évocateur","loc":"ville / zone","night":"nom exact stays","sky":"sun","temp":"27°","hook":"accroche 1 phrase narrative"}]}',
  ].join('\n');
}

/* ── Passe 2 : détail éditorial des jours (par lots) ─────────────────── */
function buildDaysPrompt(skel, planSteps, offset){
  const b=buildBrief();
  const nMoments=_momentsPerDay();
  const directives=[_antiTouristDirective(),_interestsDirective(),_rythmeDirective(),_occasionDirective(),_styleDirective(),_dreamDirective()].filter(Boolean);
  const steps=planSteps.map(function(p,i){return (offset+i+1)+'. '+p.title+' — '+p.loc+(p.hook?' ('+p.hook+')':'');}).join('\n');
  return [
    'Tu es le cartographe de Hic Sunt. Tu rédiges les détails éditoriaux de ces étapes (jours '+(offset+1)+' à '+(offset+planSteps.length)+' du voyage de '+skel.dest+').',
    '',
    '═══ BRIEF CLIENT ═══',
    b.lines,
    '',
    '═══ DIRECTIVES PERSONNALISATION ═══',
    directives.length?directives.join('\n'):'Aucune contrainte spécifique au-delà du brief ci-dessus.',
    '',
    'ÉTAPES (dans l\'ordre, même ordre dans ta réponse) :',
    steps,
    '',
    '═══ CONSIGNES ÉDITORIALES STRICTES ═══',
    'Pour CHAQUE étape, donne :',
    '- "desc" : 2 phrases narratives et évocatrices (max 25 mots), style guide de voyage haut de gamme — refléter le rythme et l\'occasion ci-dessus.',
    '- "moments" : EXACTEMENT '+nMoments+' moments réels et spécifiques à ce lieu — vrais noms de sites, restaurants, activités, cohérents avec le rythme et les intérêts du client',
    '  · moment = {t:"heure", k:"icône", ti:"nom précis du lieu/activité", d:"détail local en 6 mots max"}',
    '  · k dans ['+GEN_KINDS.join(',')+']',
    '  · Inclure au moins 1 repas avec VRAI nom de restaurant local, et des activités cohérentes avec les intérêts/occasion du client',
    '- "tip" : conseil d\'initié spécifique à cette étape (ex: "arriver avant 7h pour éviter les groupes")',
    '- "restaurant" : {"name":"vrai nom","type":"ex: Rice & curry local","price":"ex: €€","note":"1 phrase"}',
    '- "wellness" : si intérêts/occasion incluent spa/bien-être/lune de miel, un vrai spa/massage local avec nom et prix. Sinon null.',
    '',
    'Réponds UNIQUEMENT en JSON compact valide, EXACTEMENT '+planSteps.length+' entrées dans "days" :',
    '{"days":[{"desc":"","tip":"","restaurant":{"name":"","type":"","price":"","note":""},"wellness":null,"moments":[{"t":"07:30","k":"peaks","ti":"nom lieu","d":"détail court"}]}]}',
  ].join('\n');
}

/* ── Passe 3 : adresses, highlights, budget ─────────────────────────── */
function buildHighlightsPrompt(skel, days){
  const b=buildBrief();
  const dest=skel.dest||'';
  const interests=(state.interests||[]).join(', ')||'';
  const directives=[_antiTouristDirective(),_interestsDirective(),_occasionDirective(),_styleDirective(),_dreamDirective()].filter(Boolean);
  const locs=(skel.plan||[]).map(function(p){return p.loc;}).filter(function(v,i,a){return a.indexOf(v)===i;}).join(', ');
  const wantSpa=interests.toLowerCase().includes('spa')||interests.toLowerCase().includes('bien-être')||state.occasion==='lune-de-miel';
  const wantNature=interests.toLowerCase().includes('nature')||interests.toLowerCase().includes('randonn');
  const wantBeach=interests.toLowerCase().includes('plage');
  const wantFood=interests.toLowerCase().includes('gastro')||interests.toLowerCase().includes('cuisine');
  return [
    'Expert voyages Hic Sunt. Destination : '+dest+' · Étapes : '+locs,
    'Intérêts client : '+interests,
    directives.length?directives.join('\n'):'',
    '',
    'Les "gems" (pépites cachées) doivent refléter les directives de personnalisation ci-dessus si présentes (ex: lune de miel → lieu romantique peu connu ; famille → activité adaptée aux enfants).',
    'Génère UNIQUEMENT les sections suivantes. JSON compact valide, aucun texte autour.',
    '',
    '{"gems":[{"name":"vrai nom lieu secret","loc":"ville","desc":"pourquoi y aller en 1 phrase","tip":"conseil pratique"}],"highlights":{"spas":'+
    (wantSpa?'[{"name":"vrai spa local","loc":"ville","type":"ex: Massage ayurvédique","price":"ex: 35€/h","note":"1 phrase"}]':'[]')+
    ',"cascades":'+
    (wantNature?'[{"name":"nom cascade réelle","loc":"ville","desc":"accès et baignade","tip":"meilleur moment"}]':'[]')+
    ',"beaches":'+
    (wantBeach?'[{"name":"nom plage réelle","loc":"ville","desc":"ambiance et accès","tip":"conseil horaire"}]':'[]')+
    ',"restaurants":'+
    (wantFood?'[{"name":"vrai nom resto","loc":"ville","type":"spécialité","price":"fourchette","note":"pourquoi y aller"}]':'[]')+
    '},"essentials":{"transport":["conseil vols","conseil transport local"],"visa":"info visa ressortissants français","bestTime":"'+
    (skel.season||'à définir')+' — raison courte","toKnow":["info pratique 1","info culturelle 2","info sécurité 3"]},"budget_note":"fourchette totale par personne hors vols"}',
  ].filter(Boolean).join('\n');
}

/* ── parsing JSON ────────────────────────────────────────────────────── */
function repairJSON(s){
  const last=s.lastIndexOf('}'); if(last<0) return null;
  let t=s.slice(0,last+1), stack=[], inStr=false, esc2=false;
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
function parseItineraryJSON(text){
  if(!text) return null;
  let s=String(text).trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
  const a=s.indexOf('{'), b=s.lastIndexOf('}');
  const slice=(a>=0&&b>a)?s.slice(a,b+1):s.slice(a>=0?a:0);
  try{return JSON.parse(slice);}catch(e){}
  return repairJSON(s.slice(a>=0?a:0));
}

/* ── appel Supabase ─────────────────────────────────────────────────── */
async function _callSupabase(prompt){
  const res=await fetch(SUPABASE_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt:prompt})});
  if(!res.ok) throw new Error('HTTP '+res.status);
  const data=await res.json();
  if(data.error) throw new Error(data.error);
  return data.result||'';
}
async function _completeJSON(prompt){
  for(let a=0;a<2;a++){
    try{const txt=await _callSupabase(prompt); const j=parseItineraryJSON(txt); if(j) return j;}catch(e){}
  }
  return null;
}

/* ── helpers icônes ─────────────────────────────────────────────────── */
function _momentIcon(ti){
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

/* ── application du JSON → ITINERARY ────────────────────────────────── */
function applyGenerated(skel, daysDetail, hilites, flightInfo){
  const dest=skel.dest||state.destination||'Votre voyage';
  const level=['Éco','Confort','Luxe','Ultra'].includes(skel.level)?skel.level:(state.budget||'Confort');
  const dc=_clampInt(skel.days_count, 1, 60, buildBrief().daysCount);

  /* hébergements */
  const colFactor=_costOfLivingFactor(dest, skel.region, skel.country);
  const ACC_PRICE_RANGE_BASE={'Éco':[25,70],'Confort':[60,140],'Luxe':[150,400],'Ultra':[350,1100]};
  const baseAcc=ACC_PRICE_RANGE_BASE[level]||ACC_PRICE_RANGE_BASE['Confort'];
  const accRange=[Math.round(baseAcc[0]*colFactor), Math.round(baseAcc[1]*colFactor)];
  const stayTags=['Coup de cœur','Adresse rare','Signature Hic Sunt','Pépite locale','Écrin de sérénité'];
  const stayRates=['4,96','4,89','4,92','4,88','4,94'];
  const stays=(Array.isArray(skel.stays)?skel.stays:[]).slice(0,5).map(function(s,i){
    return {
      id:'a'+(i+1), n:s.name||('Hébergement '+(i+1)), i:_stayIcon(s.type),
      type:s.type||'Hôtel-boutique', loc:s.loc||dest,
      tag:stayTags[i]||'Sélection', rate:stayRates[i]||'4,9',
      nights:_clampInt(s.nights,1,14,2), price:_clampInt(s.price,accRange[0],accRange[1],Math.round((accRange[0]+accRange[1])/2)),
      am:['bed','wifi',i%2?'fork':'pool'], blurb:s.blurb||'Une adresse d\'exception.',
    };
  });
  while(stays.length<1) stays.push({id:'a1',n:'Hébergement local',i:'bed',type:'Hôtel-boutique',loc:dest,tag:'Sélection',rate:'4,9',nights:2,price:accRange[0],am:['bed','wifi','pool'],blurb:''});

  const findStay=function(name){
    if(!name) return null;
    const k=String(name).toLowerCase().trim();
    return stays.find(function(s){return s.n.toLowerCase()===k;})
        ||stays.find(function(s){return s.n.toLowerCase().includes(k)||k.includes(s.n.toLowerCase());});
  };

  /* jours enrichis avec le détail éditorial + catégorie thématique */
  const detailDays=(daysDetail&&Array.isArray(daysDetail.days))?daysDetail.days:[];
  const plan=(Array.isArray(skel.plan)?skel.plan:[]).map(function(p,i){
    const dd=detailDays[i]||{};
    const rawMoments=Array.isArray(dd.moments)&&dd.moments.length?dd.moments:[{t:'—',k:_momentIcon(p.title),ti:p.title||'Étape',d:''}];
    const moments=rawMoments.slice(0,_momentsPerDay()).map(function(m){return [m.t||'—',_kind(m.k||_momentIcon(m.ti)),m.ti||'Moment',m.d||''];});
    const tags=[];
    moments.forEach(function(m){if(tags.length<2&&!tags.some(function(t){return t[0]===m[1];}))tags.push(TAG_MAP[m[1]]||TAG_MAP.pin);});
    while(tags.length<2) tags.push(TAG_MAP.pin);
    const stay=findStay(p.night);
    /* catégorie dominante du jour (hors transit) pour la coloration thématique */
    const catCounts={};
    moments.forEach(function(m){
      const cat=KIND_CATEGORY[m[1]]||'culture';
      if(cat==='transit') return;
      catCounts[cat]=(catCounts[cat]||0)+1;
    });
    let category='culture', best=0;
    Object.keys(catCounts).forEach(function(c){ if(catCounts[c]>best){ best=catCounts[c]; category=c; } });
    return {
      n:i+1, title:p.title||('Étape '+(i+1)), loc:p.loc||dest,
      desc:dd.desc||p.hook||'', tip:dd.tip||'',
      tags:tags, category:category,
      wx:[GEN_SKY.includes(p.sky)?p.sky:'sun', p.temp||'28°'],
      night:stay?{acc:stay.id}:{n:p.night||'Nuit sur place',loc:p.loc||dest},
      moments:moments,
      restaurant:dd.restaurant||null,
      wellness:dd.wellness||null,
    };
  });
  if(!plan.length) return false;

  /* budget — calibré sur le niveau de confort, la durée et le nb de voyageurs */
  const PPD_RANGE={'Éco':[60,100],'Confort':[120,220],'Luxe':[250,500],'Ultra':[500,900]};
  const ppd=PPD_RANGE[level]||PPD_RANGE['Confort'];
  const travelers=_clampInt(state.travelers,1,12,2);
  const minBudget=Math.round(ppd[0]*travelers*dc);
  const maxBudget=Math.round(ppd[1]*travelers*dc);
  const stayCost=stays.reduce(function(s,a){return s+a.price*a.nights;},0);
  /* prix de vol : on privilégie la recherche web fraîche si elle a renvoyé un résultat plausible,
     sinon on retombe sur la fourchette statique par zone */
  const staticFlight=_flightEstimate(dest, skel.region, skel.country, travelers);
  const flightFloor=(flightInfo&&flightInfo.amount>0)?flightInfo.amount:staticFlight;
  let budgetTotal=_clampInt(skel.budget, minBudget, maxBudget*1.15, Math.round((minBudget+maxBudget)/2));
  /* le budget doit au moins couvrir l'hébergement et une estimation réaliste des vols */
  const essentialFloor=stayCost+flightFloor;
  if(budgetTotal<essentialFloor) budgetTotal=Math.min(Math.round(essentialFloor*1.25), Math.max(maxBudget*1.15, essentialFloor*1.25));

  /* application */
  ITINERARY.plan.length=0; plan.forEach(function(p){ITINERARY.plan.push(p);});
  ITINERARY.accommodations.length=0; stays.forEach(function(s){ITINERARY.accommodations.push(s);});
  const themeName=_themeForDestination(dest, skel.region, skel.country);
  Object.assign(ITINERARY,{
    dest:dest, country:skel.country||'', tag:skel.tagline||'Itinéraire composé pour vous',
    dates:skel.dates||'Sur-mesure', days:plan.length, level:level,
    budgetTotal:budgetTotal, coords:skel.coords||dest, distance:plan.length+' jours',
    region:skel.region||'', season:skel.season||'', generated:true,
    theme:themeName, palette:THEME_PALETTES[themeName],
    dateFrom:state.dateFrom||'', dateTo:state.dateTo||'',
  });

  /* highlights */
  if(hilites){
    ITINERARY.gems=hilites.gems||[];
    ITINERARY.highlights=hilites.highlights||{};
    ITINERARY.essentials=hilites.essentials||{};
    ITINERARY.budget_note=hilites.budget_note||'';
  }

  deriveActivities(plan);
  const finalBudgetTotal=deriveBudget(stays, budgetTotal, dest, skel.region, skel.country, travelers, flightInfo);
  if(finalBudgetTotal && finalBudgetTotal!==budgetTotal) ITINERARY.budgetTotal=finalBudgetTotal;
  if(typeof SEASON!=='undefined'&&skel.season){SEASON.best=skel.season;SEASON.note=skel.season;}
  return true;
}

/* ── activités & budget dérivés ─────────────────────────────────────── */
const ACT_PRICE={peaks:78,arch:55,leaf:62,wave:95,droplet:48,fork:120,sun:52,star:88,camera:60,ticket:70,moon:64,compass:58,pin:50,plane:0,bed:0};
const ACT_DUR=['2 h','3 h','4 h','2 h 30','5 h','3 h 30'];
function deriveActivities(plan){
  if(typeof ACTIVITIES==='undefined') return;
  try{
    const picks=[];
    (Array.isArray(plan)?plan:[]).forEach(function(p){
      (Array.isArray(p.moments)?p.moments:[]).forEach(function(m){
        /* exclure les transferts/déplacements : ce ne sont pas de vraies activités réservables */
        if(m[1]==='plane'||m[1]==='bed'||m[1]==='compass') return;
        picks.push({day:p.n,i:m[1],n:m[2],loc:p.loc,tag:(TAG_MAP[m[1]]||TAG_MAP.pin)[1]});
      });
    });
    ACTIVITIES.length=0;
    picks.forEach(function(a,i){
      const base=ACT_PRICE[a.i]||55;
      ACTIVITIES.push({id:'ac'+(i+1),day:a.day,i:a.i,n:a.n,loc:a.loc,dur:ACT_DUR[i%ACT_DUR.length],rate:['4,9','4,95','4,8','4,88','4,92','4,97'][i%6],price:base+(i%2?7:0),tag:a.tag});
    });
    window._actSource = 'deriveActivities-ok (' + picks.length + ' picks bruts)';
  }catch(e){
    window._actSource = 'deriveActivities-ERREUR: ' + (e&&e.message?e.message:String(e));
    /* on vide quand même la fixture par défaut plutôt que de laisser le Sri Lanka affiché */
    ACTIVITIES.length=0;
  }
}
function deriveBudget(stays, total, dest, region, country, travelers, flightInfo){
  if(typeof BUDGET==='undefined') return;
  total=Number(total)||0;
  travelers=Math.max(1,Number(travelers)||1);
  const stayCost=stays.reduce(function(s,a){return s+(Number(a.price)||0)*(Number(a.nights)||0);},0);
  const nights=stays.reduce(function(s,a){return s+(Number(a.nights)||0);},0);
  const days=Math.max(1,nights);
  const nbAct=(typeof ACTIVITIES!=='undefined')?ACTIVITIES.length:0;
  const colFactor=Number(_costOfLivingFactor(dest, region, country))||1;

  /* plancher réaliste de restauration : ~30€/jour/pers en demi-pension en zone
     "Europe de l'Ouest" (colFactor=1), ajusté au coût de vie réel de la destination.
     C'est un MINIMUM absolu, pas une estimation — en dessous, le budget affiché
     serait simplement faux (ex: 107€ pour une semaine en Sardaigne est intenable). */
  const FOOD_PER_DAY_PER_PERSON=30;
  const foodFloor=Math.round(FOOD_PER_DAY_PER_PERSON*colFactor*travelers*days);
  /* plancher de transferts locaux : ~8€/jour/pers (taxis, locations, essence) */
  const TRANSFER_PER_DAY_PER_PERSON=8;
  const transferFloor=Math.round(TRANSFER_PER_DAY_PER_PERSON*colFactor*travelers*days);

  /* hébergement = coût réel, plafonné pour laisser de la place aux autres postes */
  const accom=Math.min(stayCost, Math.round(total*0.55));
  const remainder=total-accom;
  /* vols = prix issu d'une recherche web fraîche si disponible et plausible (et
     numériquement valide — on se méfie d'une réponse IA mal formée),
     sinon fourchette statique par zone — plafonné à ce que le budget restant peut absorber */
  const flightAmountNum=flightInfo?Number(flightInfo.amount):NaN;
  const hasRealFlight=isFinite(flightAmountNum)&&flightAmountNum>0&&flightAmountNum<20000;
  const flightsRaw=hasRealFlight?flightAmountNum:(Number(_flightEstimate(dest, region, country, travelers))||0);
  const flights=Math.min(flightsRaw, Math.max(0,Math.round(remainder*0.65)));
  let afterFlights=remainder-flights;

  /* si ce qui reste ne couvre même pas les planchers repas+transferts, le budget total
     affiché était sous-évalué pour ce voyage : on relève le total plutôt que d'afficher
     des montants irréalistes (ex: 107€ de repas pour une semaine) */
  const essentialAfterFlights=foodFloor+transferFloor;
  if(afterFlights<essentialAfterFlights){
    const gap=essentialAfterFlights-afterFlights;
    total+=gap;
    afterFlights=essentialAfterFlights;
  }
  /* le reste au-delà des planchers repas/transferts va aux activités */
  const food=foodFloor;
  const transfers=transferFloor;
  const activities=Math.max(0,afterFlights-food-transfers);
  const flightSub=(state.origin||'Paris')+' · aller-retour · '+travelerLabel()+(hasRealFlight&&flightInfo.source?' · estimation '+flightInfo.source:' · estimation')

  BUDGET.total=total; BUDGET.spent=0;
  BUDGET.lines=[
    {i:'bed',n:'Hébergements',sub:nights+' nuit'+(nights>1?'s':'')+' · '+stays.length+' adresse'+(stays.length>1?'s':''),amount:accom,paid:false},
    {i:'plane',n:'Vols',sub:flightSub,amount:flights,paid:false},
    {i:'ticket',n:'Activités & expériences',sub:nbAct+' suggérée'+(nbAct>1?'s':''),amount:activities,paid:false},
    {i:'fork',n:'Restauration',sub:'Estimation · demi-pension',amount:food,paid:false},
    {i:'compass',n:'Transferts & transport local',sub:'Selon votre circuit',amount:Math.max(0,transfers),paid:false},
  ];
  return total;
}

/* ── 3 passes de génération ─────────────────────────────────────────── */
const DAYS_BATCH_SIZE = 7;
/* ── Mode "Surprenez-moi" : suggestion légère avant génération complète ── */
function buildDestinationSuggestPrompt(excluded){
  const b=buildBrief();
  const directives=[_antiTouristDirective(),_interestsDirective(),_rythmeDirective(),_occasionDirective(),_styleDirective(),_dreamDirective()].filter(Boolean);
  const excludeLine=(excluded&&excluded.length)?('Ne propose AUCUNE des destinations déjà suggérées et refusées : '+excluded.join(', ')+'.'):'';
  return [
    'Tu es le cartographe senior de Hic Sunt, maison de voyages haut de gamme spécialisée dans les destinations hors des sentiers battus.',
    'Propose UNE SEULE destination (pays ou région), la plus désirable et la plus adaptée à ce profil.',
    '',
    '═══ BRIEF CLIENT ═══',
    b.lines,
    '',
    '═══ DIRECTIVES ═══',
    directives.length?directives.join('\n'):'Aucune contrainte spécifique au-delà du brief ci-dessus.',
    excludeLine,
    '',
    'Réponds UNIQUEMENT en JSON compact valide :',
    '{"dest":"nom du pays/région","country":"pays","tagline":"phrase poétique évocatrice (max 12 mots)","teaser":"2 phrases qui donnent envie, en lien avec le brief (max 35 mots)","coords":"ex: 6°55′N · 79°51′E"}',
  ].join('\n');
}
async function suggestDestination(excluded){
  return await _completeJSON(buildDestinationSuggestPrompt(excluded));
}

/* ── recherche web du prix de vol (appel séparé, avec fallback statique) ── */
function buildFlightSearchPrompt(dest, country, dateFrom, dateTo, travelers){
  const origin = state.origin || 'Paris';
  const period = (dateFrom && dateTo) ? ('autour des dates '+dateFrom+' au '+dateTo) : 'pour les prochains mois';
  return [
    'Cherche sur le web une fourchette de prix réaliste et actuelle pour un vol aller-retour en classe économique de '+origin+' vers '+(dest||'')+' ('+(country||'')+'), '+period+'.',
    'Base-toi sur des comparateurs de vols fiables (Google Flights, Kayak, Skyscanner, sites de compagnies aériennes).',
    'Réponds UNIQUEMENT en JSON compact, sans texte ni markdown autour, au format exact :',
    '{"perPersonMin":0,"perPersonMax":0,"source":"nom du comparateur utilisé"}',
    'Les deux valeurs sont en euros, par personne, aller-retour. Si tu ne trouves rien de fiable, réponds {"perPersonMin":0,"perPersonMax":0,"source":""}.',
  ].join('\n');
}
async function _fetchFlightPriceFromWeb(dest, country, dateFrom, dateTo, travelers){
  try{
    const prompt = buildFlightSearchPrompt(dest, country, dateFrom, dateTo, travelers);
    const res = await fetch(SUPABASE_ENDPOINT,{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({prompt:prompt, webSearch:true})
    });
    if(!res.ok) return null;
    const data = await res.json();
    if(data.error) return null;
    const j = parseItineraryJSON(data.result||'');
    if(!j || !j.perPersonMin || !j.perPersonMax) return null;
    const perPerson = Math.round((j.perPersonMin+j.perPersonMax)/2);
    if(!isFinite(perPerson) || perPerson<=0) return null;
    return { amount: perPerson*Math.max(1,travelers||1), source: j.source||'' };
  }catch(e){ return null; }
}

/* ── validation : la destination renvoyée correspond-elle à celle demandée ? ──
   Comparaison volontairement souple (accents/casse ignorés, sous-chaîne dans
   un sens ou l'autre) car le client peut taper "Sardaigne" et l'IA répondre
   "Sardaigne, Italie" ou l'inverse — ce n'est pas une erreur. ── */
function _normDest(s){
  return (s||'').toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function _destinationMatches(requested, gotDest, gotCountry){
  const req=_normDest(requested);
  if(!req) return true;
  const got=_normDest((gotDest||'')+' '+(gotCountry||''));
  if(!got) return false;
  if(got.indexOf(req)!==-1 || req.indexOf(got)!==-1) return true;
  /* comparaison mot à mot : si un mot significatif du nom demandé (4+ lettres) apparaît, on accepte */
  const reqWords=req.split(' ').filter(function(w){return w.length>=4;});
  if(!reqWords.length) return got.indexOf(req)!==-1;
  return reqWords.some(function(w){return got.indexOf(w)!==-1;});
}

/* ── orchestration des 3 passes (ossature, jours, highlights) ─────────── */
async function callCartographe(){
  const b=buildBrief();
  const dc=b.daysCount;

  /* Passe 1 — ossature, par lots de 7 jours pour les longs voyages */
  let skel=null;
  for(let offset=0; offset<dc; offset+=SKEL_BATCH_SIZE){
    let batchResult=await _completeJSON(buildSkeletonPrompt(dc, SKEL_BATCH_SIZE, offset));
    if(offset===0){
      skel=batchResult;
      if(!skel||!Array.isArray(skel.plan)||!skel.plan.length) return null;
      /* garde-fou : si une destination précise a été demandée, vérifie qu'elle a été respectée */
      if(state.destination && !_destinationMatches(state.destination, skel.dest, skel.country)){
        const retryResult=await _completeJSON(buildSkeletonPrompt(dc, SKEL_BATCH_SIZE, offset));
        if(retryResult && Array.isArray(retryResult.plan) && retryResult.plan.length && _destinationMatches(state.destination, retryResult.dest, retryResult.country)){
          skel=retryResult;
        } else if(retryResult && Array.isArray(retryResult.plan) && retryResult.plan.length){
          /* la 2e tentative a échoué aussi sur la destination — on force quand même
             le nom demandé par le client plutôt que d'afficher une destination différente */
          skel=retryResult;
          skel.dest=state.destination;
        } else {
          skel.dest=state.destination;
        }
      }
      state._genStays=skel.stays||[];
    } else {
      const morePlan=(batchResult&&Array.isArray(batchResult.plan))?batchResult.plan:[];
      skel.plan=skel.plan.concat(morePlan);
    }
  }
  /* sécurité : si la génération par lots n'atteint pas dc, on tronque proprement */
  if(skel.plan.length>dc) skel.plan=skel.plan.slice(0,dc);
  skel.days_count=skel.plan.length;

  /* recherche web du prix de vol — lancée en parallèle, dès que la destination est connue */
  const flightPromise=_fetchFlightPriceFromWeb(skel.dest, skel.country, state.dateFrom, state.dateTo, state.travelers);

  /* Passe 2 — détail éditorial des jours, par lots de 7 pour les longs voyages */
  const allDays=[];
  for(let offset=0; offset<skel.plan.length; offset+=DAYS_BATCH_SIZE){
    const batch=skel.plan.slice(offset, offset+DAYS_BATCH_SIZE);
    const batchResult=await _completeJSON(buildDaysPrompt(skel, batch, offset));
    const batchDays=(batchResult&&Array.isArray(batchResult.days))?batchResult.days:[];
    for(let i=0;i<batch.length;i++){ allDays.push(batchDays[i]||null); }
  }
  const daysDetail={days:allDays};

  /* Passe 3 — adresses, gems, highlights */
  const hilites=await _completeJSON(buildHighlightsPrompt(skel, daysDetail));

  /* le prix du vol a eu tout ce temps pour revenir ; sinon on retombe sur l'estimation statique */
  let flightInfo=null;
  try{ flightInfo=await flightPromise; }catch(e){ flightInfo=null; }

  return {skel:skel, days:daysDetail, hilites:hilites, flightInfo:flightInfo};
}

/* ── flux de génération ─────────────────────────────────────────────── */
async function runGeneration(){
  if(state.createTab==='surprise' && !state.destination){
    await runDestinationSuggestion([]);
    return;
  }
  await runFullGeneration();
}

/* ── Étape 1 (mode Surprenez-moi) : suggestion de destination ────────── */
async function runDestinationSuggestion(excluded){
  const el=openOverlay('generating',generationView(),{modal:true,carto:true});
  const gen=el.querySelector('.gen');
  requestAnimationFrame(function(){gen.classList.add('run');});
  const statusEl=el.querySelector('[data-gen-status]');
  if(statusEl) statusEl.textContent='Lecture de vos envies…';
  const minShow=new Promise(function(r){setTimeout(r,1400);});
  let suggestion=null;
  try{const res=await Promise.all([suggestDestination(excluded),minShow]);suggestion=res[0];}catch(e){await minShow;}
  if(!suggestion||!suggestion.dest){
    toast('Connexion limitée — réessayez');
    closeOverlay();
    return;
  }
  state._suggested=suggestion;
  state._suggestedExcluded=excluded;
  gen.classList.remove('run');
  setTimeout(function(){
    gen.outerHTML = destinationSuggestView(suggestion);
    const newGen=el.querySelector('.gen');
    requestAnimationFrame(function(){requestAnimationFrame(function(){newGen.classList.add('run');});});
  },280);
}
async function retrySuggestion(){
  const excluded=(state._suggestedExcluded||[]).concat(state._suggested?[state._suggested.dest]:[]);
  await runDestinationSuggestion(excluded);
}
async function confirmSuggestedDestination(){
  const s=state._suggested;
  if(!s) return;
  state.destination=s.dest;
  state._suggestedTagline=s.tagline||'';
  const el=document.querySelector('.ov[data-ov="generating"] .gen');
  if(el){
    el.classList.remove('run');
    setTimeout(function(){
      el.outerHTML = generationView();
      const newGen=document.querySelector('.ov[data-ov="generating"] .gen');
      requestAnimationFrame(function(){requestAnimationFrame(function(){newGen.classList.add('run');});});
      runFullGeneration(true);
    },280);
  } else {
    runFullGeneration(true);
  }
}

/* ── Étape 2 : génération complète de l'itinéraire ────────────────────── */
async function runFullGeneration(overlayAlreadyOpen){
  const el = overlayAlreadyOpen
    ? document.querySelector('.ov[data-ov="generating"]')
    : openOverlay('generating',generationView(),{modal:true,carto:true});
  const gen=el.querySelector('.gen');
  if(!overlayAlreadyOpen) requestAnimationFrame(function(){gen.classList.add('run');});
  const statusEl=el.querySelector('[data-gen-status]');
  const steps=[
    'Lecture de vos envies…','Choix des étapes…',"Tracé de l'itinéraire…",
    'Rédaction des étapes…','Sélection des adresses locales…','Recherche des pépites cachées…',
    'Calibrage du budget…','Derniers ajustements…',
  ];
  let si=0;
  const cycle=setInterval(function(){
    si=(si+1)%steps.length;
    if(statusEl){statusEl.style.opacity=0;setTimeout(function(){statusEl.textContent=steps[si];statusEl.style.opacity=1;},240);}
  },1300);
  const minShow=new Promise(function(r){setTimeout(r,2200);});
  let result=null;
  try{const res=await Promise.all([callCartographe(),minShow]);result=res[0];}catch(e){await minShow;}
  clearInterval(cycle);
  let ok=false;
  if(result){try{ok=applyGenerated(result.skel,result.days,result.hilites,result.flightInfo);}catch(e){ok=false;}}
  if(!ok) toast('Connexion limitée — itinéraire de démonstration');
  if(statusEl){statusEl.style.opacity=0;setTimeout(function(){statusEl.textContent='Votre voyage est prêt.';statusEl.style.opacity=1;},200);}
  setTimeout(function(){
    openItinerary();
    saveItinerary();
    state.deckIndex=0;
    state._suggested=null; state._suggestedExcluded=null;
    if(typeof initDeck==='function') initDeck();
    setTimeout(function(){
      const gi=ovStack.findIndex(function(o){return o.dataset.ov==='generating';});
      if(gi>=0){const g=ovStack.splice(gi,1)[0];g.remove();}
    },460);
  },620);
}

/* ── Cartographe IA — contextuel à la destination ───────────────────── */
function aiItinerarySummary(){
  const it=ITINERARY;
  const days=it.plan.map(function(p){return 'J'+p.n+' '+p.loc+' : '+p.title;}).join(' · ');
  return it.dest+' · '+it.days+' jours · '+it.level+' · budget ~'+it.budgetTotal+'€ — '+days;
}
async function aiCartographeReply(text){
  const prompt=[
    'Tu es le cartographe de Hic Sunt, assistant voyage expert sur la destination.',
    'Itinéraire actuel : '+aiItinerarySummary(),
    'Destination : '+ITINERARY.dest+(ITINERARY.country?' ('+ITINERARY.country+')':''),
    'Saison : '+(ITINERARY.season||'non précisée'),
    '',
    'Le voyageur demande : "'+text+'"',
    '',
    'Réponds avec des conseils SPÉCIFIQUES à '+ITINERARY.dest+' — vrais noms de lieux, restaurants, activités locales.',
    'Ton sobre et expert, 2-3 phrases max. Aucun emoji.',
    'JSON : {"reply":"...","chip":"étiquette courte ex: Jour 3 modifié · +150 €"}',
  ].join('\n');
  try{
    const txt=await _callSupabase(prompt);
    let s=String(txt||'').trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
    const a=s.indexOf('{'), b=s.lastIndexOf('}');
    if(a>=0&&b>a) s=s.slice(a,b+1);
    const j=JSON.parse(s);
    if(j&&j.reply) return {t:String(j.reply),chip:j.chip?String(j.chip):''};
  }catch(e){}
  return null;
}
async function aiSend(text){
  text=(text||'').trim(); if(!text) return;
  const chat=document.querySelector('[data-ai-chat]'); if(!chat) return;
  const me=document.createElement('div'); me.className='bub me'; me.textContent=text; chat.appendChild(me);
  const input=document.querySelector('[data-ai-input]'); if(input) input.value='';
  aiScroll();
  const typing=document.createElement('div'); typing.className='typing'; typing.innerHTML='<i></i><i></i><i></i>'; chat.appendChild(typing); aiScroll();
  let r=await aiCartographeReply(text);
  if(!r) r=(typeof aiReply==='function')?aiReply(text):{t:"J'ajuste l'itinéraire en conséquence.",chip:'Itinéraire mis à jour'};
  typing.remove();
  const b=document.createElement('div'); b.className='bub them'; b.textContent=r.t; chat.appendChild(b);
  if(r.chip){
    const c=document.createElement('div'); c.style.cssText='align-self:flex-start;margin-top:2px';
    c.innerHTML='<span class="status prep" style="display:inline-flex;align-items:center;gap:6px;padding:7px 11px">'+ico('check',12,2)+r.chip+'</span>';
    chat.appendChild(c);
  }
  aiScroll();
}
