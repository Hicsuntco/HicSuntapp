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
    const res = await fetch(SUPABASE_URL+'/rest/v1/atlas_countries?select=country_iso,status&order=first_unlocked_at.asc',{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    if(!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }catch(e){ return []; }
}

/* ── écran Atlas ───────────────────────────────────────────────────────── */
function openAtlas(){
  openOverlay('atlas', atlasView());
  loadAtlasTab();
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
    +   '<div class="atlas-map-wrap" data-atlas-map>'
    +     (typeof ATLAS_MAP_SVG==='string' ? ATLAS_MAP_SVG : '')
    +   '</div>'
    +   (hasRealAuth ? '' : '<p class="atlas-login-hint">Connectez-vous pour que chaque voyage sauvegardé illumine son pays sur votre atlas.</p><button class="btn" style="width:100%;margin-top:4px" onclick="closeOverlay();openOverlay(\'login\', loginView(), {modal:true})">Se connecter</button>')
    + '</div>'
    + '<div class="atlas-seal-layer" data-atlas-seal></div>';
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

  /* Pays en attente de dévoilement (débloqués depuis la dernière visite de
     l'écran) : on les affiche d'abord en brume, puis on joue l'animation
     pour eux spécifiquement — tous les autres pays déjà connus passent
     directement à l'état final, sans animation répétée. */
  var pending = [];
  try{ pending = JSON.parse(localStorage.getItem('hs_atlas_pending')||'[]'); }catch(e){}
  pending = pending.filter(function(iso){ return isoList.indexOf(iso)>=0; });

  const immediate = isoList.filter(function(iso){ return pending.indexOf(iso)<0; });
  _atlasApplyClasses(svgEl, immediate);

  const counterEl = scope.querySelector('[data-atlas-counter]');
  const setCounter = function(n){ if(counterEl) counterEl.textContent = n+' / '+WORLD_COUNTRIES_COUNT+' territoires révélés'; };
  setCounter(immediate.length);

  if(pending.length){
    await _atlasRevealSequence(scope, svgEl, pending, immediate.length, setCounter);
    localStorage.setItem('hs_atlas_pending', JSON.stringify([]));
  }
}

function _atlasApplyClasses(svgEl, isoList){
  isoList.forEach(function(iso){
    var paths = svgEl.querySelectorAll('path[data-iso="'+iso+'"]');
    paths.forEach(function(p){ p.classList.add('explored'); });
  });
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
