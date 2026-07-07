/* ── HIC SUNT · Atlas Vivant — carte du monde en fog-of-war ──────────────
   Chaque pays exploré (voyage sauvegardé) s'illumine sur une carte de
   cartographe ancienne ; le reste reste dans la brume. Persisté dans
   Supabase (table atlas_countries, voir NOTES_ATLAS.sql) pour ne déclencher
   l'animation de dévoilement qu'une seule fois par pays, à la première
   découverte réelle. ── */

/* ── résolution pays (nom FR libre → ISO 3166-1 alpha-3) ─────────────────
   Le Cartographe renvoie ITINERARY.country en texte libre français (ex.
   "Italie", "Corée du Sud"). Cette table couvre les pays reconnus par
   l'ONU (+ quelques territoires déjà traités comme "pays" ailleurs dans
   l'app, ex. Polynésie française) avec leurs variantes de nom courantes.
   Toutes les clés sont quotées et pré-normalisées (minuscule, sans accent/
   ponctuation) pour un lookup direct via _atlasNormCountry(). */
const ATLAS_COUNTRY_ISO = {
  /* Europe */
  'france':'FRA', 'espagne':'ESP', 'italie':'ITA', 'portugal':'PRT', 'allemagne':'DEU',
  'royaume uni':'GBR', 'angleterre':'GBR', 'ecosse':'GBR', 'pays de galles':'GBR',
  'irlande':'IRL', 'belgique':'BEL', 'pays bas':'NLD', 'hollande':'NLD',
  'luxembourg':'LUX', 'suisse':'CHE', 'autriche':'AUT', 'grece':'GRC',
  'chypre':'CYP', 'malte':'MLT', 'islande':'ISL', 'norvege':'NOR', 'suede':'SWE',
  'finlande':'FIN', 'danemark':'DNK', 'pologne':'POL', 'republique tcheque':'CZE',
  'tchequie':'CZE', 'slovaquie':'SVK', 'hongrie':'HUN', 'roumanie':'ROU',
  'bulgarie':'BGR', 'croatie':'HRV', 'slovenie':'SVN', 'serbie':'SRB',
  'montenegro':'MNE', 'bosnie herzegovine':'BIH', 'macedoine du nord':'MKD',
  'albanie':'ALB', 'kosovo':'XKX', 'moldavie':'MDA', 'ukraine':'UKR', 'belarus':'BLR',
  'bielorussie':'BLR', 'russie':'RUS', 'estonie':'EST', 'lettonie':'LVA',
  'lituanie':'LTU', 'monaco':'MCO', 'andorre':'AND', 'saint marin':'SMR',
  'vatican':'VAT', 'liechtenstein':'LIE',
  /* Amérique du Nord */
  'etats unis':'USA', 'usa':'USA', 'etats unis d amerique':'USA', 'canada':'CAN',
  'mexique':'MEX', 'groenland':'GRL',
  /* Amérique centrale et Caraïbes */
  'costa rica':'CRI', 'panama':'PAN', 'nicaragua':'NIC', 'honduras':'HND',
  'guatemala':'GTM', 'belize':'BLZ', 'salvador':'SLV', 'cuba':'CUB',
  'republique dominicaine':'DOM', 'haiti':'HTI', 'jamaique':'JAM',
  'bahamas':'BHS', 'barbade':'BRB', 'trinite et tobago':'TTO',
  /* Amérique du Sud */
  'bresil':'BRA', 'argentine':'ARG', 'chili':'CHL', 'perou':'PER', 'colombie':'COL',
  'venezuela':'VEN', 'equateur':'ECU', 'bolivie':'BOL', 'paraguay':'PRY',
  'uruguay':'URY', 'guyana':'GUY', 'suriname':'SUR',
  /* Afrique */
  'maroc':'MAR', 'algerie':'DZA', 'tunisie':'TUN', 'libye':'LBY', 'egypte':'EGY',
  'soudan':'SDN', 'ethiopie':'ETH', 'erythree':'ERI', 'djibouti':'DJI',
  'somalie':'SOM', 'kenya':'KEN', 'tanzanie':'TZA', 'ouganda':'UGA',
  'rwanda':'RWA', 'burundi':'BDI', 'republique democratique du congo':'COD',
  'congo':'COG', 'gabon':'GAB', 'cameroun':'CMR', 'republique centrafricaine':'CAF',
  'tchad':'TCD', 'niger':'NER', 'nigeria':'NGA', 'benin':'BEN', 'togo':'TGO',
  'ghana':'GHA', 'cote d ivoire':'CIV', 'liberia':'LBR', 'sierra leone':'SLE',
  'guinee':'GIN', 'guinee bissau':'GNB', 'senegal':'SEN', 'gambie':'GMB',
  'mali':'MLI', 'mauritanie':'MRT', 'burkina faso':'BFA', 'afrique du sud':'ZAF',
  'namibie':'NAM', 'botswana':'BWA', 'zimbabwe':'ZWE', 'zambie':'ZMB',
  'mozambique':'MOZ', 'malawi':'MWI', 'madagascar':'MDG', 'maurice':'MUS',
  'seychelles':'SYC', 'comores':'COM', 'cap vert':'CPV', 'angola':'AGO',
  'guinee equatoriale':'GNQ', 'sao tome et principe':'STP', 'eswatini':'SWZ',
  'lesotho':'LSO', 'soudan du sud':'SSD',
  /* Moyen-Orient */
  'turquie':'TUR', 'israel':'ISR', 'palestine':'PSE', 'jordanie':'JOR',
  'liban':'LBN', 'syrie':'SYR', 'irak':'IRQ', 'iran':'IRN', 'arabie saoudite':'SAU',
  'yemen':'YEM', 'oman':'OMN', 'emirats arabes unis':'ARE', 'qatar':'QAT',
  'bahrein':'BHR', 'koweit':'KWT',
  /* Asie centrale et du Sud */
  'kazakhstan':'KAZ', 'ouzbekistan':'UZB', 'turkmenistan':'TKM',
  'kirghizistan':'KGZ', 'tadjikistan':'TJK', 'afghanistan':'AFG',
  'pakistan':'PAK', 'inde':'IND', 'nepal':'NPL', 'bhoutan':'BTN',
  'bangladesh':'BGD', 'sri lanka':'LKA', 'maldives':'MDV',
  /* Asie de l'Est */
  'chine':'CHN', 'mongolie':'MNG', 'coree du sud':'KOR', 'coree du nord':'PRK',
  'japon':'JPN', 'taiwan':'TWN', 'hong kong':'HKG',
  /* Asie du Sud-Est */
  'thailande':'THA', 'vietnam':'VNM', 'cambodge':'KHM', 'laos':'LAO',
  'myanmar':'MMR', 'birmanie':'MMR', 'malaisie':'MYS', 'singapour':'SGP',
  'indonesie':'IDN', 'philippines':'PHL', 'brunei':'BRN', 'timor oriental':'TLS',
  /* Océanie */
  'australie':'AUS', 'nouvelle zelande':'NZL', 'fidji':'FJI',
  'papouasie nouvelle guinee':'PNG', 'polynesie':'PYF',
  'polynesie francaise':'PYF', 'nouvelle caledonie':'NCL', 'vanuatu':'VUT',
  'samoa':'WSM', 'tonga':'TON', 'palaos':'PLW', 'kiribati':'KIR',
};
/* Normalise un nom de pays libre pour lookup : minuscule, sans accent,
   apostrophes/tirets/ponctuation réduits à des espaces simples. */
function _atlasNormCountry(s){
  return _stripAccents(String(s||''))
    .replace(/['’-]/g,' ')
    .replace(/[^a-z0-9 ]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}
/* Résout le pays ISO3 d'un itinéraire : d'abord ITINERARY.country (texte FR
   fiable généré par le Cartographe à chaque génération récente), puis en
   repli _countryKeyFromDest(dest) + COUNTRY_META (couvre les anciens
   voyages sauvegardés avant l'ajout du champ "country", ou les destinations
   du catalogue Découvrir). Retourne null si non résolu — on ne devine
   jamais un pays au hasard. */
function _atlasResolveCountryISO(it){
  if(!it) return null;
  const fromCountry = ATLAS_COUNTRY_ISO[_atlasNormCountry(it.country)];
  if(fromCountry) return fromCountry;
  if(typeof _countryKeyFromDest==='function' && typeof COUNTRY_META!=='undefined'){
    const key = _countryKeyFromDest(it.dest||it.destination);
    if(key && COUNTRY_META[key]) return COUNTRY_META[key].code;
  }
  return null;
}

/* ── déblocage (appelé depuis saveItinerary(), app.js) ────────────────────
   INSERT simple (pas d'upsert) : la contrainte unique (user_id,country_iso)
   fait qu'un 201 = vraie première découverte, un 409 = déjà débloqué. Pas
   besoin de comparer des timestamps pour savoir si l'animation doit jouer.
   Ne fait rien sans compte connecté (donnée de compte, pas un brouillon
   local — même principe que Mon Cercle, voir NOTES_MON_CERCLE.sql). */
async function atlasUnlockFromItinerary(it){
  const token = localStorage.getItem('sb_token');
  const userId = typeof _getUserId==='function' ? _getUserId() : null;
  if(!token || !userId) return;
  const iso = _atlasResolveCountryISO(it);
  if(!iso) return;
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/atlas_countries',{
      method:'POST',
      headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Prefer':'return=minimal'},
      body:JSON.stringify({user_id:userId, country_iso:iso, source:(it.dest||it.destination||'')})
    });
    if(res.status===201){
      /* Nouvelle découverte : mise en file pour l'animation de dévoilement,
         jouée au prochain passage sur l'écran Atlas (pas forcément ouvert
         maintenant — on sauvegarde un voyage depuis l'écran itinéraire). */
      var pending = [];
      try{ pending = JSON.parse(localStorage.getItem('hs_atlas_pending')||'[]'); }catch(e){}
      if(pending.indexOf(iso)<0) pending.push(iso);
      localStorage.setItem('hs_atlas_pending', JSON.stringify(pending));
    }
    /* 409 = déjà débloqué : rien à faire, silencieux. */
  }catch(e){ /* best-effort : un souci réseau ici ne doit jamais bloquer la sauvegarde du voyage */ }
}

/* ── chargement des pays débloqués ────────────────────────────────────── */
async function _atlasLoadCountries(){
  const token = localStorage.getItem('sb_token');
  if(!token) return [];
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/atlas_countries?select=country_iso,status,first_unlocked_at,visited_at&order=first_unlocked_at.asc',{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    if(!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }catch(e){ return []; }
}
/* Cache en mémoire du dernier chargement — évite un aller-retour réseau à
   chaque tap sur un pays pour l'infobulle (voir _atlasShowCountryInfo). */
var _atlasCountriesCache = {};
function _atlasCountryInfo(iso){
  var row = _atlasCountriesCache[iso];
  var name = (typeof ATLAS_COUNTRY_LABELS!=='undefined' && ATLAS_COUNTRY_LABELS[iso]) || iso;
  if(!row) return { iso:iso, name:name, status:'brume' };
  return {
    iso:iso, name:name, status:row.status||'explored',
    since: row.status==='visited' ? row.visited_at : row.first_unlocked_at,
  };
}

/* ── infobulle au tap sur un pays ─────────────────────────────────────────
   Panneau ancré en bas (comme une "place card" de carte moderne — Plans,
   Google Maps) plutôt que positionné aux coordonnées exactes du tap :
   évite tout calcul de positionnement fragile (bords d'écran, .phone
   maquette desktop non plein écran) pour un résultat plus robuste. */
function _atlasCountryInfoHTML(info){
  var statusLabel = info.status==='visited' ? 'Visité'
    : info.status==='explored' ? 'Exploré'
    : 'Dans la brume';
  var statusColor = info.status==='visited' ? 'var(--gold-deep)'
    : info.status==='explored' ? 'var(--gold)'
    : 'var(--sub)';
  var dateLine = '';
  if(info.since){
    try{
      var d = new Date(info.since);
      if(!isNaN(d)) dateLine = (info.status==='visited'?'Confirmé le ':'Débloqué le ') + d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
    }catch(e){}
  }
  var sub = dateLine || (info.status==='brume' ? 'Composez un voyage pour l\'illuminer' : '');
  return '<div class="atlas-info-card">'
    + '<div style="flex:1;min-width:0">'
    + '<div class="atlas-info-name">' + esc(info.name) + '</div>'
    + (sub ? '<div class="atlas-info-sub">' + esc(sub) + '</div>' : '')
    + '</div>'
    + '<span class="atlas-info-status" style="color:'+statusColor+';border-color:'+statusColor+'">' + esc(statusLabel) + '</span>'
    + '<button class="atlas-info-close" onclick="_atlasHideCountryInfo(screenEl())" aria-label="Fermer">' + ico('close',14,1.8) + '</button>'
    + '</div>';
}
function _atlasShowCountryInfo(scope, iso){
  var layer = scope && scope.querySelector('[data-atlas-info]');
  if(!layer) return;
  var info = _atlasCountryInfo(iso);
  layer.innerHTML = _atlasCountryInfoHTML(info);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ layer.classList.add('in'); }); });
}
function _atlasHideCountryInfo(scope){
  var layer = scope && scope.querySelector('[data-atlas-info]');
  if(!layer) return;
  layer.classList.remove('in');
  setTimeout(function(){ if(!layer.classList.contains('in')) layer.innerHTML=''; }, 260);
}

/* ── statut "visité" (confirmation manuelle) ──────────────────────────────
   "Visité" ne peut être posé que sur un pays déjà "exploré" (une ligne doit
   déjà exister — voir atlasUnlockFromItinerary) : on ne crée jamais de ligne
   ici, on ne fait qu'UPDATE son statut. Si le voyage n'a jamais été
   sauvegardé (donc jamais exploré), il n'y a rien à marquer visité. */
async function _atlasGetCountryStatus(iso){
  const token = localStorage.getItem('sb_token');
  if(!token || !iso) return null;
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/atlas_countries?user_id=eq.'+encodeURIComponent(_getUserId())+'&country_iso=eq.'+encodeURIComponent(iso)+'&select=status',{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    if(!res.ok) return null;
    const rows = await res.json();
    return (Array.isArray(rows) && rows[0]) ? rows[0].status : null;
  }catch(e){ return null; }
}
async function _atlasMarkVisited(iso){
  const token = localStorage.getItem('sb_token');
  const userId = _getUserId();
  if(!token || !userId || !iso) return false;
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/atlas_countries?user_id=eq.'+encodeURIComponent(userId)+'&country_iso=eq.'+encodeURIComponent(iso),{
      method:'PATCH',
      headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Prefer':'return=minimal'},
      body:JSON.stringify({status:'visited', visited_at:new Date().toISOString()})
    });
    return res.ok;
  }catch(e){ return false; }
}
function _atlasVisitedCtaHTML(kind){
  if(kind==='visited'){
    return '<div style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:14px;background:'+hexA('#A6824A',0.12)+';font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--gold-deep)">'
      + ico('checkbig',14,1.8) + '<span>Pays visité</span></div>';
  }
  return '<button onclick="_atlasMarkVisitedClick()" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;border-radius:14px;border:1px dashed var(--line2);background:none;cursor:pointer;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--gold)">'
    + ico('checkbig',14,1.8) + '<span>J\'y suis allé(e)</span></button>';
}
/* État courant retenu pour le clic (évite de re-résoudre l'ISO à chaque
   interaction) — une seule fiche voyage affichée à la fois dans l'app. */
var _atlasVisitedCtaIso = null;
async function _atlasSyncVisitedCTA(){
  const scope = screenEl();
  const el = scope && scope.querySelector('[data-atlas-visited-cta]');
  if(!el) return;
  el.innerHTML = '';
  _atlasVisitedCtaIso = null;
  if(!localStorage.getItem('sb_token')) return;
  const iso = _atlasResolveCountryISO(ITINERARY);
  if(!iso) return;
  const status = await _atlasGetCountryStatus(iso);
  if(!status) return; /* jamais exploré : rien à confirmer */
  _atlasVisitedCtaIso = iso;
  el.innerHTML = _atlasVisitedCtaHTML(status);
}
async function _atlasMarkVisitedClick(){
  const iso = _atlasVisitedCtaIso;
  if(!iso) return;
  const scope = screenEl();
  const el = scope && scope.querySelector('[data-atlas-visited-cta]');
  const ok = await _atlasMarkVisited(iso);
  if(ok){
    if(el) el.innerHTML = _atlasVisitedCtaHTML('visited');
    try{ if(navigator.vibrate) navigator.vibrate([14,50,14]); }catch(e){}
    if(typeof toast==='function') toast('Pays marqué comme visité ✓');
  } else if(typeof toast==='function'){
    toast('Impossible de confirmer pour le moment');
  }
}

/* ── écran Atlas ───────────────────────────────────────────────────────── */
function openAtlas(){
  openOverlay('atlas', atlasView());
  return loadAtlasTab(); /* usage normale : appel "fire and forget", la promesse retournée n'est utile qu'aux tests */
}
function atlasView(){
  const hasRealAuth = !!localStorage.getItem('sb_token');
  return statusBar() + navbar('')
    + '<div class="ov-scroll atlas-scroll">'
    +   '<div class="atlas-head">'
    +     '<span class="eyebrow">L\'Atlas Vivant</span>'
    +     '<h1 class="atlas-title">Votre monde exploré</h1>'
    +     '<div class="atlas-counter" data-atlas-counter>'+(hasRealAuth?'…':'0')+' / '+WORLD_COUNTRIES_COUNT+' territoires révélés</div>'
    +   '</div>'
    +   '<div class="atlas-map-outer">'
    +     '<div class="atlas-map-wrap" data-atlas-map>'
    +       (typeof ATLAS_MAP_SVG==='string' ? ATLAS_MAP_SVG : '')
    +     '</div>'
    +     '<div class="atlas-zoom-ctrl">'
    +       '<button data-atlas-zoom-in aria-label="Zoomer">' + ico('plus',16,1.8) + '</button>'
    +       '<button data-atlas-zoom-out aria-label="Dézoomer">' + ico('minus',16,1.8) + '</button>'
    +     '</div>'
    +     '<button class="atlas-zoom-reset" data-atlas-zoom-reset aria-label="Réinitialiser le zoom" style="display:none">' + ico('compass',14,1.7) + '</button>'
    +   '</div>'
    +   '<div class="atlas-legend">'
    +     '<span class="atlas-legend-it"><span class="atlas-legend-sw" style="background:'+hexA('#221D16',0.16)+'"></span>Brume</span>'
    +     '<span class="atlas-legend-it"><span class="atlas-legend-sw" style="background:'+hexA('#E8C98C',0.5)+';box-shadow:inset 0 0 0 1px var(--gold)"></span>Exploré</span>'
    +     '<span class="atlas-legend-it"><span class="atlas-legend-sw" style="background:var(--gold-bright)"></span>Visité</span>'
    +   '</div>'
    +   '<p class="atlas-hint">Pincez pour zoomer, glissez pour explorer, touchez un pays pour le nommer.</p>'
    +   (hasRealAuth ? '' : '<div style="padding:0 20px"><p class="atlas-login-hint" style="padding:0">Connectez-vous pour que chaque voyage sauvegardé illumine son pays sur votre atlas.</p><button class="btn" style="width:100%;margin-top:4px" onclick="closeOverlay();openOverlay(\'login\', loginView(), {modal:true})">Se connecter</button></div>')
    + '</div>'
    + '<div class="atlas-seal-layer" data-atlas-seal></div>'
    + '<div class="atlas-info-panel" data-atlas-info></div>';
}

const ATLAS_MILESTONES = [5,10,15,20];

/* Un double-tap sur l'entrée "Carnet de voyage" du profil peut empiler deux
   overlays Atlas coup sur coup (comportement général des overlays de l'app,
   pas spécifique ici) — sans garde, les deux appels liraient et videraient
   la même file hs_atlas_pending en parallèle, doublant le dévoilement d'un
   même pays. */
var _atlasLoading = false;
async function loadAtlasTab(){
  if(_atlasLoading) return;
  _atlasLoading = true;
  try{ await _atlasLoadTabInner(); }
  finally{ _atlasLoading = false; }
}
async function _atlasLoadTabInner(){
  const scope = screenEl();
  const mapWrap = scope && scope.querySelector('[data-atlas-map]');
  if(!mapWrap) return;
  const svgEl = mapWrap.querySelector('svg');
  const hasRealAuth = !!localStorage.getItem('sb_token');
  if(!hasRealAuth || !svgEl) return;

  const countries = await _atlasLoadCountries();
  const isoList = countries.map(function(c){ return c.country_iso; });
  const statusByIso = {};
  _atlasCountriesCache = {};
  countries.forEach(function(c){ statusByIso[c.country_iso] = c.status; _atlasCountriesCache[c.country_iso] = c; });

  /* Pays en attente de dévoilement (débloqués depuis la dernière visite de
     l'écran) : on les affiche d'abord en brume, puis on joue l'animation
     pour eux spécifiquement — tous les autres pays déjà connus passent
     directement à l'état final, sans animation répétée. */
  var pending = [];
  try{ pending = JSON.parse(localStorage.getItem('hs_atlas_pending')||'[]'); }catch(e){}
  pending = pending.filter(function(iso){ return isoList.indexOf(iso)>=0; });

  const immediate = isoList.filter(function(iso){ return pending.indexOf(iso)<0; });
  _atlasApplyClasses(svgEl, immediate, statusByIso);

  const counterEl = scope.querySelector('[data-atlas-counter]');
  const setCounter = function(n){ if(counterEl) counterEl.textContent = n+' / '+WORLD_COUNTRIES_COUNT+' territoires révélés'; };
  setCounter(immediate.length);

  /* Zoom/pan + tap-infobulle : initialisé une seule fois par ouverture
     d'écran (idempotent grâce au data-atlas-interactive posé sur le
     conteneur), indépendamment du chargement des pays qui peut se
     re-déclencher (ex. après un unlock). */
  if(!mapWrap.dataset.atlasInteractive){
    mapWrap.dataset.atlasInteractive = '1';
    _atlasSetupInteraction(mapWrap, svgEl, scope);
  }

  if(pending.length){
    await _atlasRevealSequence(scope, svgEl, pending, immediate.length, setCounter);
    localStorage.setItem('hs_atlas_pending', JSON.stringify([]));
  }
}

/* "explored" (contour lumineux) et "visited" (remplissage plein) sont
   mutuellement exclusifs sur la carte — un pays visité n'a plus besoin
   d'afficher aussi son contour "juste exploré". */
function _atlasApplyClasses(svgEl, isoList, statusByIso){
  isoList.forEach(function(iso){
    var cls = (statusByIso && statusByIso[iso]==='visited') ? 'visited' : 'explored';
    var paths = svgEl.querySelectorAll('path[data-iso="'+iso+'"]');
    paths.forEach(function(p){ p.classList.add(cls); });
  });
}

/* ── zoom / déplacement tactile + tap-infobulle ───────────────────────────
   Pointer Events (pas de lib) : un doigt = déplacement, deux doigts =
   pincement pour zoomer. Un tap (relâché sans déplacement notable) sur un
   pays affiche son infobulle plutôt que de zoomer — les deux gestes
   partagent le même suivi de pointeurs pour rester mutuellement exclusifs
   sans ambiguïté. touch-action:none sur le cadre (voir CSS) laisse le
   geste entièrement à notre charge à l'intérieur de la carte, tout en
   laissant le reste de l'écran défiler normalement au doigt. */
var ATLAS_MIN_SCALE = 1, ATLAS_MAX_SCALE = 5;
var ATLAS_TAP_SLOP = 8; /* px de tolérance avant de considérer que c'est un geste, pas un tap */
function _atlasSetupInteraction(wrapEl, svgEl, scope){
  var pointers = {};
  var scale = 1, tx = 0, ty = 0;
  var startScale = 1, startDist = 0, startMidX = 0, startMidY = 0, startTx = 0, startTy = 0;
  var moved = false;
  var lastTapTime = 0;

  function apply(){
    svgEl.style.transform = 'translate('+tx.toFixed(1)+'px,'+ty.toFixed(1)+'px) scale('+scale.toFixed(3)+')';
    var resetBtn = wrapEl.parentNode && wrapEl.parentNode.querySelector('[data-atlas-zoom-reset]');
    if(resetBtn) resetBtn.style.display = (scale>1.02 ? 'flex' : 'none');
  }
  function clampScale(s){ return Math.max(ATLAS_MIN_SCALE, Math.min(ATLAS_MAX_SCALE, s)); }
  /* Empêche de faire glisser la carte entièrement hors champ : la marge
     autorisée grandit avec le zoom (plus on zoome, plus on peut se
     déplacer), nulle à scale=1 (rien à déplacer, la carte tient déjà). */
  function clampPan(){
    var rect = wrapEl.getBoundingClientRect();
    var maxX = (rect.width * (scale-1)) / 2 + rect.width*0.15;
    var maxY = (rect.height * (scale-1)) / 2 + rect.height*0.15;
    tx = Math.max(-maxX, Math.min(maxX, tx));
    ty = Math.max(-maxY, Math.min(maxY, ty));
  }
  function pointerList(){ return Object.keys(pointers).map(function(k){ return pointers[k]; }); }
  function midpoint(pts){ return { x:(pts[0].x+pts[1].x)/2, y:(pts[0].y+pts[1].y)/2 }; }

  function reset(){ scale=1; tx=0; ty=0; apply(); }
  wrapEl.__atlasResetZoom = reset;

  wrapEl.addEventListener('pointerdown', function(e){
    if(e.button!==undefined && e.button!==0 && e.pointerType==='mouse') return;
    try{ wrapEl.setPointerCapture(e.pointerId); }catch(err){}
    pointers[e.pointerId] = { x:e.clientX, y:e.clientY };
    var pts = pointerList();
    moved = false;
    if(pts.length===1){
      startTx = tx; startTy = ty;
      pointers[e.pointerId].startX = e.clientX; pointers[e.pointerId].startY = e.clientY;
    } else if(pts.length===2){
      startDist = Math.hypot(pts[0].x-pts[1].x, pts[0].y-pts[1].y) || 1;
      startScale = scale;
      var mid = midpoint(pts);
      startMidX = mid.x; startMidY = mid.y; startTx = tx; startTy = ty;
    }
  });

  wrapEl.addEventListener('pointermove', function(e){
    if(!pointers[e.pointerId]) return;
    pointers[e.pointerId].x = e.clientX; pointers[e.pointerId].y = e.clientY;
    var pts = pointerList();
    if(pts.length===1){
      var p0 = pointers[e.pointerId];
      var dx = e.clientX - p0.startX, dy = e.clientY - p0.startY;
      if(Math.abs(dx) > ATLAS_TAP_SLOP || Math.abs(dy) > ATLAS_TAP_SLOP) moved = true;
      if(scale>1){ tx = startTx + dx; ty = startTy + dy; clampPan(); apply(); }
    } else if(pts.length===2){
      moved = true;
      var dist = Math.hypot(pts[0].x-pts[1].x, pts[0].y-pts[1].y) || 1;
      scale = clampScale(startScale * (dist/startDist));
      var mid = midpoint(pts);
      tx = startTx + (mid.x - startMidX);
      ty = startTy + (mid.y - startMidY);
      clampPan();
      apply();
    }
  });

  function onUp(e){
    var wasSingle = Object.keys(pointers).length===1;
    var target = e.target;
    delete pointers[e.pointerId];
    if(wasSingle && !moved){
      var now = Date.now();
      if(now - lastTapTime < 320){
        reset(); lastTapTime = 0; _atlasHideCountryInfo(scope);
      } else {
        lastTapTime = now;
        var pathEl = target && target.closest ? target.closest('path[data-iso]') : null;
        if(pathEl) _atlasShowCountryInfo(scope, pathEl.getAttribute('data-iso'));
        else _atlasHideCountryInfo(scope);
      }
    }
  }
  wrapEl.addEventListener('pointerup', onUp);
  wrapEl.addEventListener('pointercancel', function(e){ delete pointers[e.pointerId]; });

  var zoomIn = wrapEl.parentNode && wrapEl.parentNode.querySelector('[data-atlas-zoom-in]');
  var zoomOut = wrapEl.parentNode && wrapEl.parentNode.querySelector('[data-atlas-zoom-out]');
  var zoomReset = wrapEl.parentNode && wrapEl.parentNode.querySelector('[data-atlas-zoom-reset]');
  if(zoomIn) zoomIn.addEventListener('click', function(){ scale = clampScale(scale*1.5); clampPan(); apply(); });
  if(zoomOut) zoomOut.addEventListener('click', function(){ scale = clampScale(scale/1.5); if(scale<=1){ tx=0; ty=0; } clampPan(); apply(); });
  if(zoomReset) zoomReset.addEventListener('click', reset);
}

/* Joue le dévoilement pour chaque pays en attente, l'un après l'autre :
   brume → balayage doré → sceau de cire avec le nom du pays. Un léger
   décalage entre pays évite un flash simultané si plusieurs voyages ont
   été sauvegardés depuis la dernière visite de l'écran. */
async function _atlasRevealSequence(scope, svgEl, isoList, startCount, setCounter){
  var shownMilestones = [];
  try{ shownMilestones = JSON.parse(localStorage.getItem('hs_atlas_milestones')||'[]'); }catch(e){}
  var count = startCount;
  for(var i=0;i<isoList.length;i++){
    var iso = isoList[i];
    var paths = svgEl.querySelectorAll('path[data-iso="'+iso+'"]');
    if(paths.length){
      paths.forEach(function(p){ p.classList.add('revealing'); });
      /* Retour haptique — protégé par feature-detection, iOS Safari n'a
         historiquement pas supporté navigator.vibrate, mais ne doit jamais
         faire planter le dévoilement si absent. */
      try{ if(navigator.vibrate) navigator.vibrate([12,40,18]); }catch(e){}
      await new Promise(function(r){ setTimeout(r, 650); });
      paths.forEach(function(p){ p.classList.remove('revealing'); p.classList.add('explored'); });
    }
    count += 1;
    setCounter(count);
    await _atlasShowSeal(scope, iso);

    if(ATLAS_MILESTONES.indexOf(count)>=0 && shownMilestones.indexOf(count)<0){
      shownMilestones.push(count);
      localStorage.setItem('hs_atlas_milestones', JSON.stringify(shownMilestones));
      await _atlasShowMilestone(scope, count);
    }
    /* Pause entre deux pays pour laisser le regard suivre, seulement s'il
       en reste un autre à révéler. */
    if(i<isoList.length-1) await new Promise(function(r){ setTimeout(r, 350); });
  }
}

/* Sceau de cire : nom du pays en Playfair Display, apparition/disparition
   en fondu-échelle, se ferme seule ou au clic. */
function _atlasShowSeal(scope, iso){
  return new Promise(function(resolve){
    var layer = scope.querySelector('[data-atlas-seal]');
    if(!layer){ resolve(); return; }
    var label = (typeof ATLAS_COUNTRY_LABELS!=='undefined' && ATLAS_COUNTRY_LABELS[iso]) || iso;
    var el = document.createElement('div');
    el.className = 'atlas-seal';
    el.innerHTML = '<div class="atlas-seal-badge">' + ico('compass',26,1.4) + '</div>'
      + '<div class="atlas-seal-name">' + esc(label) + '</div>'
      + '<div class="atlas-seal-sub">Territoire révélé</div>';
    var done = false;
    var finish = function(){
      if(done) return; done = true;
      el.classList.remove('in');
      setTimeout(function(){ el.remove(); resolve(); }, 320);
    };
    el.addEventListener('click', finish);
    layer.appendChild(el);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('in'); }); });
    setTimeout(finish, 2200);
  });
}
/* Célébration numérique aux jalons 5/10/15/20 — pas de récompense physique
   (reportée), juste un badge + toast. */
function _atlasShowMilestone(scope, count){
  return new Promise(function(resolve){
    var layer = scope.querySelector('[data-atlas-seal]');
    if(!layer){ resolve(); return; }
    var el = document.createElement('div');
    el.className = 'atlas-seal atlas-milestone';
    el.innerHTML = '<div class="atlas-seal-badge atlas-milestone-badge">' + ico('sparkle',28,1.3) + '</div>'
      + '<div class="atlas-seal-name">' + count + ' territoires</div>'
      + '<div class="atlas-seal-sub">Un nouveau jalon de votre atlas</div>';
    var done = false;
    var finish = function(){
      if(done) return; done = true;
      el.classList.remove('in');
      setTimeout(function(){ el.remove(); resolve(); }, 320);
    };
    el.addEventListener('click', finish);
    layer.appendChild(el);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('in'); }); });
    try{ if(navigator.vibrate) navigator.vibrate([16,60,16,60,24]); }catch(e){}
    setTimeout(finish, 2600);
  });
}
