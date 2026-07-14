/* ── HIC SUNT · Sillage — vues principales (tabs) ───────────────────── */

/* coordonnées affichées en code cartographique sur les tiles */
const DEST_CODES = {
  'Sri Lanka':'06°55′N','Japon':'35°41′N','Maroc':'31°37′N','Portugal':'38°43′N',
  'Islande':'64°08′N','Pérou':'13°31′S','Thaïlande':'13°45′N','Kenya':'01°17′S',
};
const DEST_MUSE = [
  'les rizières de Bali…','un riad à Marrakech…','Kyoto au printemps…',
  'les fjords de Norvège…','la côte amalfitaine…','un lodge au Kenya…',
  'les Cyclades hors saison…','Lisbonne en automne…',
];

/* ── Découvrir ──────────────────────────────────────────────────────── */
function tileHTML(key){
  const d = DESTS[key];
  return '<div class="tile" onclick="openDest(\'' + key.replace(/'/g, "\\'") + '\')">'
    + '<div class="wash" style="' + destBgStyle(key) + '"></div>'
    + '<span class="wm">' + ico(d.i, 30, 1.3) + '</span>'
    + '<span class="code">' + (DEST_CODES[key] || '—') + '</span>'
    + '<div class="t-cap"><div class="t-n">' + esc(key) + '</div><div class="t-rule"></div><div class="t-r">' + esc(d.r) + '</div></div>'
    + '</div>';
}
function tripCard(t){
  const action = t.itin ? 'openItinerary()' : (t.s[0] === 'prep' ? "setTab('create')" : 'void(0)');
  return '<div class="trip" onclick="' + action + '">'
    + '<div class="th"><div class="wash" style="position:absolute;inset:0;background:' + t.bg + '"></div>'
    + '<span class="wm">' + ico(t.i, 34, 1.3) + '</span></div>'
    + '<div><div class="ti-n">' + esc(t.n) + '</div>'
    + '<div class="ti-d">' + esc(t.d) + '</div>'
    + '<div class="ti-days">' + esc(t.days) + '</div>'
    + '<div class="ti-st"><span class="status ' + t.s[0] + '">' + esc(t.s[1]) + '</span></div>'
    + '</div></div>';
}
function discoverView(){
  return statusBar()
    + '<div class="px disc-head">'
    +   '<div class="disc-top"><span class="eyebrow">Atlas personnel</span>'
    +     '<button class="bell-btn" onclick="openOverlay(\'notifications\', notificationsView())" aria-label="Notifications">' + ico('bell', 19, 1.5) + '<span class="dot" data-bell-dot style="display:none"></span></button></div>'
    +   '<hr class="hairline gold" style="margin-top:14px">'
    +   _inTripDashboard()
    +   '<div class="disc-hello">Bonjour, ' + esc(USER.name) + '</div>'
    +   '<h1 class="disc-hero">Où mène votre<br><em>boussole&nbsp;?</em></h1>'
    +   '<div class="muse">'
    +     '<div class="muse-top"><span class="eyebrow">Itinéraire sur-mesure</span><span class="muse-nsew">N · S · E · O</span></div>'
    +     '<div class="muse-row">'
    +       '<input class="muse-input" data-muse placeholder="' + DEST_MUSE[0] + '" aria-label="Destination rêvée">'
    +       '<button class="muse-go" onclick="composeFree()" aria-label="Composer">' + ico('chevron', 20, 1.8) + '</button>'
    +     '</div>'
    +     '<div class="muse-line"></div>'
    +     '<p class="muse-sub">Décrivez une envie — le cartographe compose l\'itinéraire.</p>'
    +   '</div>'
    +   '<div class="section-h"><h2>Destinations</h2><span class="meta">' + DEST_ORDER.length + ' régions</span></div>'
    +   '<div class="dest-grid" style="margin-top:0">' + DEST_ORDER.map(tileHTML).join('') + '</div>'
    +   '<div class="section-h"><h2>Mes voyages</h2><span class="meta">À venir</span></div>'
    +   '<div data-disc-trips><div style="text-align:center;padding:24px 0"><div class="notif-load"><i></i></div></div></div>'
    + '</div>';
}

/* ── Tableau de bord voyage en cours ───────────────────────────────── */
function _inTripDashboard(){
  var it = ITINERARY;
  if(!it || !it.dest || !it.dateFrom || !it.dateTo || !it.plan || !it.plan.length) return '';

  var today = new Date();
  today.setHours(0,0,0,0);
  var from = new Date(it.dateFrom); from.setHours(0,0,0,0);
  var to   = new Date(it.dateTo);   to.setHours(0,0,0,0);

  /* Voyage actif entre les dates */
  var isActive = today >= from && today <= to;
  /* Voyage à venir dans moins de 7 jours — afficher un aperçu */
  var daysUntil = Math.floor((from - today) / 86400000);
  var isUpcoming = daysUntil >= 0 && daysUntil <= 7;

  if(!isActive && !isUpcoming) return '';

  /* Jour actuel dans le plan */
  var dayNum = isActive ? Math.floor((today - from) / 86400000) : 0;
  var plan = it.plan;
  var todayPlan = plan[Math.min(dayNum, plan.length-1)];
  var tomorrowPlan = plan[dayNum+1] || null;
  var dayLabel = isActive
    ? 'Jour '+(dayNum+1)+' · '+_days(it)+' jours'
    : 'Départ dans '+daysUntil+' jour'+(daysUntil>1?'s':'');

  /* Hébergement du soir */
  var acc = (it.accommodations||[]).find(function(a){ return a.n === todayPlan.night || a.id === todayPlan.night; });

  /* Météo */
  var wxIcon = todayPlan.wx === 'rain' ? '🌧' : todayPlan.wx === 'cloud' ? '⛅' : '☀️';
  var wxTemp = (todayPlan.wx&&todayPlan.wx[1]) ? todayPlan.wx[1] : (todayPlan.temp||'');

  /* Moments du jour */
  var moments = Array.isArray(todayPlan.moments) ? todayPlan.moments.slice(0,3) : [];

  /* Palette */
  var palette = it.palette || {};
  var accent = palette.beach || palette.culture || '#C9A96E';

  /* Jours restants */
  var daysLeft = Math.max(0, Math.floor((to - today) / 86400000));

  var html = '<div class="trip-board" onclick="openItinerary()" style="cursor:pointer">'
    /* Header */
    + '<div class="tb-head" style="background:'+hexA(accent,0.10)+';border-bottom:1px solid '+hexA(accent,0.18)+'">'
    +   '<div style="display:flex;align-items:center;justify-content:space-between">'
    +     '<div>'
    +       '<div class="tb-eyebrow">En voyage · '+esc(it.dest)+'</div>'
    +       '<div class="tb-day">'+dayLabel+'</div>'
    +     '</div>'
    +     '<div class="tb-wx">'+wxIcon+(wxTemp?' <span>'+esc(typeof wxTemp==='string'?wxTemp:'')+'</span>':'')+'</div>'
    +   '</div>'
    /* Titre du jour */
    +   '<div class="tb-title">'+esc(todayPlan.title||'')+'</div>'
    +   '<div class="tb-loc">'+esc(todayPlan.loc||'')+'</div>'
    + '</div>'
    /* Corps — moments + hébergement */
    + '<div class="tb-body">'
    /* Moments clés */
    + (moments.length ? '<div class="tb-section-label">Programme du jour</div>'
    +   moments.map(function(m){
        var time = Array.isArray(m) ? m[0] : m.t;
        var title = Array.isArray(m) ? m[2] : (m.ti||m.title);
        var desc = Array.isArray(m) ? m[3] : (m.d||m.desc);
        return '<div class="tb-moment">'
          + '<span class="tb-time">'+esc(time||'')+'</span>'
          + '<div><div class="tb-mti">'+esc(title||'')+'</div>'
          + (desc?'<div class="tb-mdesc">'+esc(desc)+'</div>':'')
          + '</div></div>';
      }).join('') : '')
    /* Hébergement ce soir */
    + (acc ? '<div class="tb-section-label" style="margin-top:12px">Ce soir</div>'
    +   '<div class="tb-acc">'
    +     '<span style="color:'+accent+'">'+ico('bed',16,1.3)+'</span>'
    +     '<div><div class="tb-mti">'+esc(acc.n||'')+'</div><div class="tb-mdesc">'+esc(acc.loc||'')+'</div></div>'
    +   '</div>' : '')
    /* Demain */
    + (tomorrowPlan ? '<div class="tb-tomorrow">Demain : <strong>'+esc(tomorrowPlan.title||tomorrowPlan.loc||'')+'</strong></div>' : '')
    /* Footer */
    + '<div class="tb-footer">'
    +   '<span class="tb-days-left">'+daysLeft+' jour'+(daysLeft>1?'s':'')+' restant'+(daysLeft>1?'s':'')+'</span>'
    +   '<span class="tb-cta">Voir l\'itinéraire '+ico('chevron',11,1.4)+'</span>'
    + '</div>'
    + '</div>'
    + '</div>';

  return html;
}
async function loadDiscoverTrips(){
  const items = await loadItineraries();
  const host = document.querySelector('[data-disc-trips]');
  if(!host) return;
  if(items===null){
    host.innerHTML = '<p style="text-align:center;padding:24px 0;color:var(--sub);font-size:13px;font-style:italic">Erreur de chargement.</p>';
    return;
  }
  if(!items.length){
    host.innerHTML = '<p style="text-align:center;padding:24px 0;color:var(--sub);font-size:13px;font-style:italic">Aucun voyage sauvegardé pour le moment.</p>';
    return;
  }
  host.innerHTML = items.slice(0,3).map(savedTripCard).join('');
  const cards = host.querySelectorAll('.trip');
  requestAnimationFrame(function(){
    cards.forEach(function(c, i){
      c.style.animationDelay = (i * 70) + 'ms';
      c.classList.add('trip-in');
    });
  });
}

/* placeholder typewriter de la muse */
let _museTimer = null;
function museControl(run){
  clearInterval(_museTimer); _museTimer = null;
  if (!run) return;
  const inp = screenEl().querySelector('[data-muse]');
  if (!inp) return;
  let wi = 0, ci = 0, dir = 1;
  _museTimer = setInterval(function(){
    if (!inp.isConnected){ clearInterval(_museTimer); return; }
    if (document.activeElement === inp || inp.value){ inp.placeholder = DEST_MUSE[wi]; return; }
    const word = DEST_MUSE[wi];
    ci += dir;
    if (ci >= word.length + 14){ dir = -1; ci = word.length; }
    if (ci <= 0 && dir < 0){ dir = 1; wi = (wi + 1) % DEST_MUSE.length; ci = 0; }
    inp.placeholder = word.slice(0, Math.max(0, Math.min(ci, word.length)));
  }, 90);
}

/* ── Créer (shell — la deck vit dans deck.js) ───────────────────────── */
function createView(){
  return statusBar()
    + '<div class="px deck-head">'
    +   '<span class="eyebrow">Composer un voyage</span>'
    +   '<div class="deck-prog">'
    +     '<button class="deck-back" data-deck-back onclick="deckBack()" aria-label="Question précédente">' + ico('back', 18, 1.7) + '</button>'
    +     '<div class="deck-bar"><i data-deck-fill></i></div>'
    +     '<span class="deck-count" data-deck-count>01 / 10</span>'
    +   '</div>'
    + '</div>'
    + '<div id="deck"></div>';
}

/* ── Mes voyages ────────────────────────────────────────────────────── */
/* Dégradés façon carte postale — deux teintes évocatrices du pays
   (lagon, terre, temple…) plutôt qu'un aplat unique générique. */
const DEST_BG_MAP = {
  'sri lanka':['#0E7490','#1F8A6E'],  'japon':['#7A2E2E','#129A8B'],
  'maroc':['#B5532E','#2E6F8E'],      'portugal':['#C4632E','#2E6F8E'],
  'islande':['#1B4B5A','#173445'],    'pérou':['#8A4A28','#3F6B42'],
  'thaïlande':['#B5791F','#146B54'],  'kenya':['#B5791F','#3E8A54'],
  'indonesie':['#1F7A5C','#0E7490'],  'bali':['#1F7A5C','#0E7490'],
  'philippines':['#0E7490','#B5942E'],'vietnam':['#1F7A5C','#932E2E'],
  'sardaigne':['#0E7490','#C4632E'],  'italie':['#0E7490','#C4632E'],
  'sicile':['#0E7490','#C4632E'],     'grèce':['#1D5D82','#B5942E'],
  'espagne':['#B5791F','#932E2E'],    'croatie':['#1D5D82','#B5942E'],
};
/* Couleur d'accent thématique par destination — libellés & badges hors aplat */
const DEST_ACCENT_MAP = {
  mediterranean:{ primary:'#E8844A', glow:'rgba(244,238,223,0.22)' },
  desert:       { primary:'#D4943A', glow:'rgba(244,238,223,0.22)' },
  alpine:       { primary:'#3E8FA6', glow:'rgba(244,238,223,0.22)' },
  tropical:     { primary:'#54AE6E', glow:'rgba(244,238,223,0.22)' },
  urban:        { primary:'#9B85CC', glow:'rgba(244,238,223,0.22)' },
};
/* Sans accents, pour matcher indépendamment de l'orthographe saisie
   (« Indonésie » vs clé « indonesie ») — sinon la recherche par
   sous-chaîne échoue silencieusement et retombe sur la couleur par défaut. */
function _stripAccents(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
function destBg(name){
  const k=_stripAccents(name);
  let pair=['#A6824A','#7A5A2E'];
  for(const pat in DEST_BG_MAP){ if(k.includes(_stripAccents(pat))){ pair=DEST_BG_MAP[pat]; break; } }
  return 'linear-gradient(135deg,'+pair[0]+' 0%,'+pair[1]+' 100%)';
}
/* Photos libres de droit (Wikimedia Commons, voir images/dest/CREDITS.md) —
   utilisées quand disponibles pour la destination, sinon on retombe sur le
   dégradé de destBg(). Bali partage la photo de l'Indonésie. */
const DEST_PHOTO_MAP = {
  'sri lanka':'sri-lanka', 'japon':'japon', 'maroc':'maroc', 'portugal':'portugal',
  'islande':'islande', 'perou':'perou', 'thailande':'thailande', 'kenya':'kenya',
  'indonesie':'indonesie', 'bali':'indonesie', 'sardaigne':'sardaigne',
  'vietnam':'vietnam', 'italie':'italie', 'sicile':'sicile', 'grece':'grece',
  'espagne':'espagne', 'croatie':'croatie', 'philippines':'philippines',
};
function destPhoto(name){
  const k=_stripAccents(name);
  for(const pat in DEST_PHOTO_MAP){ if(k.includes(_stripAccents(pat))) return 'images/dest/'+DEST_PHOTO_MAP[pat]+'.jpg'; }
  return null;
}
/* Style de fond à appliquer au conteneur hero d'une destination : photo si on
   en a une, sinon le dégradé de secours — à utiliser avec .hero-veil pour la
   lisibilité du texte par-dessus. */
function destBgStyle(name){
  const photo = destPhoto(name);
  return photo
    ? 'background-image:url(\''+photo+'\');background-size:cover;background-position:center'
    : 'background:'+destBg(name);
}
function destIcon(name){ const k=_stripAccents(name); if(/japon|tokyo|kyoto/.test(k)) return 'arch'; if(/maroc|marrakech/.test(k)) return 'compass'; if(/islande/.test(k)) return 'peaks'; if(/safari|kenya|afrique/.test(k)) return 'leaf'; if(/bali|indonesie|philippines|thailande|vietnam/.test(k)) return 'leaf'; if(/perou|andes/.test(k)) return 'peaks'; return 'compass'; }

/* ── Profil · statistiques réelles ("carnet de voyage") ──────────────────
   Regroupe les clés régionales de _geoShapeSD (ex. sardaigne, sicile, corse,
   majorque, eoliennes) sous leur pays réel, pour que "pays visités" compte
   des PAYS et pas des régions du même pays. */
const REGION_TO_COUNTRY = {
  sardaigne:'italie', sicile:'italie', eoliennes:'italie',
  corse:'france', majorque:'espagne',
};
/* Code ISO 3166-1 alpha-3 + libellé par pays — clés = celles de _geoShapeSD
   (après regroupement région → pays) plus les destinations du catalogue
   Découvrir qui n'ont pas de forme géo dédiée (sri_lanka déjà présente). */
const COUNTRY_META = {
  france:{code:'FRA', label:'France'}, espagne:{code:'ESP', label:'Espagne'},
  italie:{code:'ITA', label:'Italie'}, portugal:{code:'PRT', label:'Portugal'},
  grece:{code:'GRC', label:'Grèce'}, maroc:{code:'MAR', label:'Maroc'},
  japon:{code:'JPN', label:'Japon'}, thaïlande:{code:'THA', label:'Thaïlande'},
  vietnam:{code:'VNM', label:'Vietnam'}, cambodge:{code:'KHM', label:'Cambodge'},
  laos:{code:'LAO', label:'Laos'}, islande:{code:'ISL', label:'Islande'},
  perou:{code:'PER', label:'Pérou'}, kenya:{code:'KEN', label:'Kenya'},
  jordanie:{code:'JOR', label:'Jordanie'}, mexique:{code:'MEX', label:'Mexique'},
  egypte:{code:'EGY', label:'Égypte'}, turquie:{code:'TUR', label:'Turquie'},
  australie:{code:'AUS', label:'Australie'}, costa_rica:{code:'CRI', label:'Costa Rica'},
  sri_lanka:{code:'LKA', label:'Sri Lanka'}, indonesie:{code:'IDN', label:'Indonésie'},
  maldives:{code:'MDV', label:'Maldives'}, cuba:{code:'CUB', label:'Cuba'},
  croatie:{code:'HRV', label:'Croatie'}, malte:{code:'MLT', label:'Malte'},
  polynesie:{code:'PYF', label:'Polynésie'},
};
const WORLD_COUNTRIES_COUNT = 195;
/* Clé pays (après regroupement région→pays) pour une destination libre —
   null si non reconnue (destination composée par l'IA hors référentiel). */
function _countryKeyFromDest(dest){
  if(typeof _geoShapeSD !== 'function') return null;
  const shape = _geoShapeSD(dest);
  if(!shape || shape.key === '_default') return null;
  return REGION_TO_COUNTRY[shape.key] || shape.key;
}
/* Style d'un badge pays du carnet de voyage : réutilise le dégradé/couleur
   déjà défini pour les cards de destination (destBg), avec un fallback pour
   les pays qui n'ont pas d'entrée dans DEST_BG_MAP. */
function _countryBadgeBg(key, label){
  const fallback = {
    france:'#3E8FA6', cambodge:'#1F7A5C', laos:'#1F7A5C', jordanie:'#B5791F',
    mexique:'#932E2E', egypte:'#B5791F', turquie:'#0E7490', australie:'#B5791F',
    costa_rica:'#1F7A5C', cuba:'#932E2E', maldives:'#0E7490', malte:'#1D5D82',
    polynesie:'#0E7490',
  };
  if(fallback[key]) return 'linear-gradient(135deg,'+fallback[key]+' 0%,'+fallback[key]+'CC 100%)';
  return destBg(label);
}
/* Agrège les statistiques réelles depuis les voyages sauvegardés de la
   personne (cloud + local) : pays distincts visités, nombre de voyages
   composés, jours cumulés. Ne fabrique jamais de chiffre — une valeur
   manquante reste à 0. */
async function loadProfileStats(){
  const items = (typeof loadItineraries === 'function') ? (await loadItineraries() || []) : [];
  const countries = {}; /* key -> {code,label} */
  let totalDays = 0;
  items.forEach(function(it){
    const dest = it.destination || (it.data && it.data.dest) || '';
    const key = _countryKeyFromDest(dest);
    if(key && COUNTRY_META[key] && !countries[key]) countries[key] = COUNTRY_META[key];
    const data = it.data || {};
    const days = Number(it.days || data.days) || (Array.isArray(data.plan) ? data.plan.length : 0);
    totalDays += days;
  });
  return {
    voyages: items.length,
    countries: Object.keys(countries).map(function(k){ return Object.assign({key:k}, countries[k]); }),
    days: totalDays,
  };
}
function _destAccent(dest){
  const theme = (typeof _themeForDestination === 'function') ? _themeForDestination(dest, '', '') : 'mediterranean';
  return DEST_ACCENT_MAP[theme] || DEST_ACCENT_MAP.mediterranean;
}
const OCC_LABELS = {
  'lune-de-miel': {label:'Lune de miel', ic:'heart'},
  'evjf':         {label:'EVJF',          ic:'sparkle'},
  'evg':          {label:'EVG',           ic:'star'},
  'famille':      {label:'En famille',    ic:'users'},
  'anniversaire': {label:'Anniversaire',  ic:'heart'},
  'solo':         {label:'Solo',          ic:'compass'},
  'amis':         {label:'Entre amis',    ic:'users'},
  'bien-etre':    {label:'Retraite bien-être', ic:'droplet'},
};
function savedTripCard(it){
  const bgStyle = destBgStyle(it.destination);
  const icon = destIcon(it.destination);
  const occ = it.occasion || (it.data && it.data.occasion) || '';
  const occInfo = OCC_LABELS[occ];
  const isDraft = (typeof _classifyItinerary === 'function') ? _classifyItinerary(it) === 'draft' : false;
  const region = (typeof DESTS !== 'undefined' && DESTS[it.destination]) ? DESTS[it.destination].r : '';
  const budget = (typeof eur === 'function' && it.budget) ? eur(it.budget) : '';
  const data = it.data || {};
  const coords = data.coords || it.coords || '';
  const companions = Array.isArray(data.companions) ? data.companions : [];

  if(isDraft){
    return '<div class="trip-card draft" onclick="loadSavedItinerary(\''+it.id+'\')">'
      +'<button class="trip-del" onclick="event.stopPropagation();deleteSavedItinerary(\''+it.id+'\')" aria-label="Supprimer">'+ico('close',14,2)+'</button>'
      +'<div class="trip-card-hero" style="'+bgStyle+'">'
      +  '<div class="hero-veil"></div>'
      +  '<span class="trip-card-wm">'+ico(icon,44,1.1)+'</span>'
      +  '<span class="trip-card-draft-badge"><span class="dot"></span><span>Brouillon</span></span>'
      +'</div>'
      +'<div class="trip-card-draftfoot">'
      +  '<div><div class="serif">'+esc(it.destination)+'</div><div class="tcd-sub">Dates à confirmer</div></div>'
      +  '<span class="accent">Reprendre →</span>'
      +'</div>'
      +'</div>';
  }

  /* Compte à rebours avant départ */
  const dateFrom = it.date_from || data.dateFrom || it.dateFrom || '';
  let countdown = '';
  if(dateFrom){
    const from = new Date(dateFrom); from.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    const daysLeft = Math.round((from - today) / 86400000);
    if(daysLeft > 0) countdown = 'dans ' + daysLeft + ' j';
    else if(daysLeft === 0) countdown = "aujourd'hui";
  }

  return '<div class="trip-card" onclick="loadSavedItinerary(\''+it.id+'\')">'
    +'<button class="trip-del" onclick="event.stopPropagation();deleteSavedItinerary(\''+it.id+'\')" aria-label="Supprimer">'+ico('close',14,2)+'</button>'
    +'<div class="trip-card-hero" style="'+bgStyle+'">'
    +  '<div class="hero-veil"></div>'
    +  '<span class="trip-card-wm">'+ico(icon,64,1.1)+'</span>'
    +  (coords ? '<span class="trip-card-coords mono">'+esc(coords)+'</span>' : '')
    +  (occInfo ? '<span class="trip-card-badge"><span>'+ico(occInfo.ic,11,1.7)+'</span><span class="mono">'+esc(occInfo.label)+'</span></span>' : '')
    +  '<div class="trip-card-cap">'
    +    '<div class="serif">'+esc(it.destination)+'</div>'
    +    '<div class="trip-card-rule"></div>'
    +    (region ? '<span class="mono">'+esc(region.toUpperCase())+'</span>' : '')
    +  '</div>'
    +'</div>'
    +'<div class="trip-card-foot">'
    +  '<div class="tcf-row">'
    /* it.dates inclut déjà "· N jours" (généré ainsi par le Cartographe) —
       y ajouter le nombre d'étapes rendait la ligne trop longue pour tenir
       sur une seule ligne (le nombre d'étapes reste visible sur l'écran
       détail de l'itinéraire). */
    +    '<span class="tcf-dates">'+esc(it.dates||'')+'</span>'
    +    '<span class="accent">'+[budget, countdown].filter(Boolean).join(' · ')+'</span>'
    +  '</div>'
    +  (companions.length ? '<div class="tcf-companions mono">Avec '+esc(companions.join(', '))+'</div>' : '')
    +'</div>'
    +'</div>';
}
function voyagesView(){
  const seg = state._voySeg || 'upcoming';
  const labels = [['upcoming','À venir'],['past','Passés'],['draft','Brouillons']];
  return statusBar()
    + '<div class="px">'
    +   '<h1 class="voy-title">Mes <em>voyages</em></h1>'
    +   '<div class="voy-pills">' + labels.map(function(l){
          return '<button class="voy-pill' + (seg === l[0] ? ' on' : '') + '" onclick="voySeg(\'' + l[0] + '\')">' + l[1] + '</button>';
        }).join('') + '</div>'
    +   '<div class="list" data-trips><div style="text-align:center;padding:40px 0"><div class="notif-load"><i></i></div></div></div>'
    + '</div>';
}
function voySeg(k){
  state._voySeg = k;
  const v = screenEl().querySelector('.tabview[data-tab="voyages"]');
  if (v){ v.innerHTML = voyagesView(); loadVoyagesTab(); }
}

/* ── Profil ─────────────────────────────────────────────────────────── */
function profileView(){
  const token = localStorage.getItem('sb_token');
  const email = localStorage.getItem('hs_email') || '';
  /* Connecté si token présent OU email stocké (auth Google réussie) */
  const connected = !!token || !!email;
  /* "connected" ci-dessus suffit pour l'affichage (nom, statut premium…),
     mais PAS pour les fonctions qui écrivent dans Supabase (Mon Cercle…) :
     l'accès propriétaire (?hs=...) stocke un email sans jamais créer de
     vraie session  -  sans ce distinguo, le bouton "Se connecter" reste
     caché alors qu'aucune action Supabase ne peut réellement fonctionner. */
  const hasRealAuth = !!token;
  const premium = (typeof _hasActivePremiumStatus === 'function') && _hasActivePremiumStatus();

  const rows = [
    ['compass','Préférences de voyage','Styles, budget et rythme par défaut', "openOverlay('prefs', prefsView())"],
    ['star','Abonnement Premium', premium ? 'Actif' : 'Débloqué à l\'achat d\'un itinéraire', "openPremium()"],
    ['bell','Notifications', '<span data-notif-sub>Aucune non lue</span>', "openOverlay('notifications', notificationsView())"],
  ];
  if(connected) rows.push(['logout','Déconnexion','', 'logout()']);

  const statSkeleton = ['Pays','Voyages','Jours'].map(function(l){
    return '<div class="prof-stat"><div class="ps-v">—</div><div class="ps-l">' + l + '</div></div>';
  }).join('');

  return statusBar()
    + '<div class="px">'
    +   '<h1 class="voy-title" style="margin-bottom:20px">Profil</h1>'
    +   '<div class="prof-card">'
    +     '<div class="prof-id">'
    +       '<span class="avatar" style="width:64px;height:64px;font-size:22px">' + (USER.initials || '✦') + '</span>'
    +       '<div><div class="prof-n">' + esc(USER.full || USER.name || 'Voyageur') + '</div>'
    +         (premium
              ? '<div class="prof-badge">' + ico('sparkle',11,2) + '<span>Explorateur · Premium</span></div>'
              : '<div class="prof-m">' + (email ? esc(email) : 'Composez votre premier itinéraire') + '</div>')
    +       '</div>'
    +     '</div>'
    +   '</div>'
    +   '<div class="prof-stats" data-prof-stats>' + statSkeleton + '</div>'
    +   '<div class="prof-circle-card" data-prof-circle onclick="openMonCercle()" style="cursor:pointer"><div class="cc-row"><div class="circle-empty-ico">' + ico('users',18,1.5) + '</div>'
    +     '<div style="flex:1"><div class="cc-t">Mon Cercle</div><div class="cc-s">Chargement…</div></div></div></div>'
    +   '<div class="section-h" style="margin-top:20px;cursor:pointer" onclick="openAtlas()">'
    +     '<h2>Carnet de voyage</h2>'
    +     '<span style="display:flex;align-items:center;gap:4px"><span class="meta" data-prof-badges-meta>…</span><span style="color:var(--sub);display:inline-flex">' + ico('chevron',14,1.6) + '</span></span>'
    +   '</div>'
    +   '<div class="prof-badges" data-prof-badges onclick="openAtlas()" style="cursor:pointer"><div class="cv-empty">Chargement…</div></div>'
    +   '<div class="atlas-cta-row" onclick="openAtlas()" style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:10px;padding:12px;border-radius:14px;border:1px dashed var(--line2);cursor:pointer;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--gold)">'
    +     ico('compass',14,1.7) + '<span>Voir mon Atlas Vivant</span>'
    +   '</div>'
    +   '<div class="prof-list" style="margin-top:20px">' + rows.map(function(r){
          return '<div class="row" onclick="' + r[3] + '">'
            + '<span class="r-ico">' + ico(r[0], 20, 1.5) + '</span>'
            + '<div class="r-main"><div class="r-t">' + r[1] + '</div>' + (r[2] ? '<div class="r-s">' + r[2] + '</div>' : '') + '</div>'
            + '<span class="r-chev">' + ico('chevron', 17, 1.6) + '</span></div>';
        }).join('') + '</div>'
    +   (hasRealAuth ? '' : '<button class="btn" style="width:100%;margin-top:20px" onclick="openOverlay(\'login\', loginView(), {modal:true})">Se connecter</button>')
    +   (hasRealAuth ? '<button onclick="_promptDeleteAccount()" style="display:block;width:100%;background:none;border:none;padding:16px 0 0;font-family:var(--sans);font-size:13px;color:var(--sub);text-align:center;cursor:pointer">Supprimer mon compte</button>' : '')
    +   '<p style="text-align:center;font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--sub);margin-top:32px">Hic Sunt · Beyond the Known</p>'
    + '</div>';
}
/* Remplit les blocs asynchrones du profil (stats, Cercle, carnet de voyage)
   avec de vraies données — jamais de chiffre fabriqué : à vide, on l'affiche
   comme tel plutôt que d'inventer une valeur. */
async function loadProfileTab(){
  const scope = screenEl();
  if(!scope || !scope.querySelector('[data-prof-stats]')) return;
  const connected = !!(localStorage.getItem('sb_token') || localStorage.getItem('hs_email'));
  /* Mon Cercle écrit dans Supabase : un email stocké sans vraie session
     (accès propriétaire, ou callback OAuth interrompu) ne suffit pas  -
     sans ce distinguo la carte affichait "Aucun compagnon" au lieu du
     vrai message "Connectez-vous", et Ajouter échouait en silence. */
  const hasRealAuth = !!localStorage.getItem('sb_token');

  const statsP = (typeof loadProfileStats === 'function') ? loadProfileStats() : Promise.resolve({voyages:0,countries:[],days:0,addresses:0});
  const companionsP = hasRealAuth && typeof loadCompanions === 'function' ? loadCompanions() : Promise.resolve([]);
  const [stats, companions] = await Promise.all([statsP, companionsP]);
  window._profStats = stats;
  window._profCompanions = companions;

  const statsEl = scope.querySelector('[data-prof-stats]');
  if(statsEl){
    statsEl.innerHTML = [
      [stats.countries.length, 'Pays'], [stats.voyages, 'Voyages'], [stats.days, 'Jours'],
    ].map(function(s){
      return '<div class="prof-stat"><div class="ps-v">' + s[0] + '</div><div class="ps-l">' + s[1] + '</div></div>';
    }).join('');
  }

  const circleEl = scope.querySelector('[data-prof-circle]');
  if(circleEl) circleEl.innerHTML = _circleCardHTML(companions, hasRealAuth);

  const badgesEl = scope.querySelector('[data-prof-badges]');
  const badgesMeta = scope.querySelector('[data-prof-badges-meta]');
  if(badgesMeta) badgesMeta.textContent = stats.countries.length + ' / ' + WORLD_COUNTRIES_COUNT + ' régions';
  if(badgesEl){
    badgesEl.innerHTML = stats.countries.map(function(c){
      return '<div class="cv-badge" style="background:' + _countryBadgeBg(c.key, c.label) + '">'
        + ico(destIcon(c.label), 22, 1.4) + '<span class="cv-code">' + c.code + '</span></div>';
    }).join('') + '<div class="cv-badge-add" onclick="setTab(\'discover\')">' + ico('plus', 20, 1.6) + '</div>';
  }
}
function _circleCardHTML(companions, connected){
  const hues = ['#3EA07C','#2E9CC0','#E86B4A','#D4943A','#9B85CC'];
  const shown = companions.slice(0,4);
  const avatars = shown.map(function(c,i){
    const initials = (c.name||'?').trim().split(/\s+/).map(function(w){ return w[0]||''; }).join('').toUpperCase().slice(0,2) || '?';
    return '<span class="circle-av" style="background:' + hues[i%hues.length] + '">' + esc(initials) + '</span>';
  }).join('');
  const more = companions.length>4 ? '<span class="circle-av more">+' + (companions.length-4) + '</span>' : '';
  const label = !connected ? 'Connectez-vous pour composer votre Cercle'
    : companions.length === 0 ? 'Aucun compagnon pour l\'instant'
    : companions.length + ' compagnon' + (companions.length>1?'s':'') + ' de route';
  return '<div class="cc-row">'
    + (companions.length ? '<div class="circle-avatars">' + avatars + more + '</div>' : '<div class="circle-empty-ico">' + ico('users',18,1.5) + '</div>')
    + '<div style="flex:1;min-width:0"><div class="cc-t">Mon Cercle</div><div class="cc-s">' + esc(label) + '</div></div>'
    + '</div>'
    + '<div class="cc-actions">'
    +   '<button class="cc-btn" onclick="event.stopPropagation();inviteCompanion()">Inviter</button>'
    +   '<button class="cc-btn ghost" onclick="event.stopPropagation();openAddCompanion()">+ Ajouter</button>'
    + '</div>';
}
/* Compagnons rattachés à UN voyage précis (liste de prénoms dans
   ITINERARY.companions) — distinct de _circleCardHTML qui montre le Cercle
   entier sur le Profil. Donne enfin un usage concret à Mon Cercle : on
   pioche dedans pour dire avec qui on part sur ce voyage-là. */
function _tripCompanionsHTML(names){
  const hues = ['#3EA07C','#2E9CC0','#E86B4A','#D4943A','#9B85CC'];
  const shown = names.slice(0,4);
  const avatars = shown.map(function(n,i){
    const initials = (n||'?').trim().split(/\s+/).map(function(w){ return w[0]||''; }).join('').toUpperCase().slice(0,2) || '?';
    return '<span class="circle-av" style="background:' + hues[i%hues.length] + '">' + esc(initials) + '</span>';
  }).join('');
  const more = names.length>4 ? '<span class="circle-av more">+' + (names.length-4) + '</span>' : '';
  const label = names.length === 0 ? 'Ajouter des compagnons de route'
    : 'Avec ' + names.join(', ');
  return (names.length ? '<div class="circle-avatars">' + avatars + more + '</div>' : '<div class="circle-empty-ico light">' + ico('users',18,1.5) + '</div>')
    + '<div style="flex:1;min-width:0"><div style="font-family:var(--serif);font-size:16px;color:var(--ink)">Compagnons</div><div style="font-family:var(--mono);font-size:10px;color:var(--sub);letter-spacing:.04em;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(label) + '</div></div>'
    + '<span style="color:var(--sub);display:inline-flex">' + ico('chevron',16,1.6) + '</span>';
}
/* La carte Mon Cercle du profil n'ouvrait jamais rien au clic (seuls ses
   deux boutons internes "Inviter"/"+ Ajouter" faisaient quelque chose) —
   ce détail liste les compagnons et permet d'en retirer. */
function openMonCercle(){
  openOverlay('mon-cercle', monCercleView());
}
function monCercleView(){
  const connected = !!localStorage.getItem('sb_token');
  return statusBar() + navbar('Mon Cercle')
    + '<div class="ov-scroll has-foot px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">Compagnons de route</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Mon Cercle</h1>'
    +   '<p class="lede" style="margin-top:10px">Les proches avec qui vous composez vos voyages.</p>'
    +   '<div data-cercle-list style="margin-top:18px">' + _cercleListHTML(window._profCompanions||[], connected) + '</div>'
    + '</div>'
    + '<div class="ov-foot"><button class="btn" onclick="openAddCompanion()">+ Ajouter un compagnon</button></div>';
}
function _cercleListHTML(companions, connected){
  if(!connected) return '<p style="color:var(--sub);font-size:14px;font-style:italic">Connectez-vous pour composer votre Cercle.</p>';
  if(!companions.length) return '<p style="color:var(--sub);font-size:14px;font-style:italic">Aucun compagnon pour l\'instant.</p>';
  const hues = ['#3EA07C','#2E9CC0','#E86B4A','#D4943A','#9B85CC'];
  return companions.map(function(c,i){
    const initials = (c.name||'?').trim().split(/\s+/).map(function(w){ return w[0]||''; }).join('').toUpperCase().slice(0,2) || '?';
    return '<div class="row"><span class="circle-av" style="background:' + hues[i%hues.length] + '">' + esc(initials) + '</span>'
      + '<div class="r-main"><div class="r-t">' + esc(c.name||'') + '</div></div>'
      + '<span class="r-chev" style="cursor:pointer" onclick="_removeCompanionUI(\'' + c.id + '\')" aria-label="Retirer">' + ico('close',18,1.6) + '</span></div>';
  }).join('');
}
async function _removeCompanionUI(id){
  const ok = (typeof removeCompanion === 'function') && await removeCompanion(id);
  if(!ok){ toast('Impossible de retirer ce compagnon'); return; }
  window._profCompanions = (window._profCompanions||[]).filter(function(c){ return String(c.id) !== String(id); });
  const connected = !!localStorage.getItem('sb_token');
  const listEl = document.querySelector('[data-cercle-list]');
  if(listEl) listEl.innerHTML = _cercleListHTML(window._profCompanions, connected);
  const circleEl = document.querySelector('[data-prof-circle]');
  if(circleEl) circleEl.innerHTML = _circleCardHTML(window._profCompanions, connected);
  toast('Compagnon retiré');
}
/* Ajout d'un compagnon — petite bottom-sheet plutôt qu'un prompt() natif,
   pour rester dans la direction visuelle de l'app. */
function openAddCompanion(){
  openOverlay('add-companion', addCompanionView(), {modal:true});
  /* Ne PAS focus() immédiatement : la feuille glisse encore depuis le bas
     (transition transform 0.38s) quand ce code s'exécute. Sur iOS réel, le
     clavier qui apparaît pendant que le parent est encore en cours
     d'animation (position:absolute + transform) fait scroller le contenu
     hors champ  -  l'utilisateur se retrouve devant un écran vide bien que
     le formulaire soit bien là, juste scrollé hors de la zone visible.
     Attendre la fin de la transition avant de déclencher le clavier évite
     ce conflit (invisible en test headless, sans clavier virtuel réel). */
  setTimeout(function(){
    const inp = document.getElementById('companion-name');
    if(inp) inp.focus();
  }, 420);
}
function addCompanionView(){
  return '<div class="ov-scroll px" style="padding-top:28px">'
    +   '<div class="carte-handle-wrap"><div class="carte-handle"></div></div>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:22px;margin-bottom:6px">Ajouter un compagnon</h1>'
    +   '<p style="color:var(--sub);font-size:13px;margin-bottom:18px">Un prénom suffit — retrouvez-le dans votre Cercle.</p>'
    +   '<input id="companion-name" placeholder="Prénom" style="width:100%;padding:14px 16px;border-radius:14px;border:1px solid var(--line);background:var(--surface);font-size:15px;font-family:var(--sans)" onkeydown="if(event.key===\'Enter\'){event.preventDefault();window._submitCompanion()}">'
    +   '<button class="btn" style="width:100%;margin-top:16px" onclick="window._submitCompanion()">Ajouter</button>'
    + '</div>';
}
window._submitCompanion = async function(){
  const inp = document.getElementById('companion-name');
  const name = inp ? inp.value.trim() : '';
  if(!name) return;
  const row = (typeof addCompanion === 'function') ? await addCompanion(name) : null;
  /* addCompanion() a déjà affiché le message d'erreur pertinent (pas connecté,
     échec réseau…) — si l'on ferme la feuille tout de suite dans tous les
     cas, ce toast est détruit avec elle avant d'avoir pu s'afficher : on ne
     ferme donc QUE sur un vrai succès, pour que l'échec reste visible. */
  if(!row) return;
  closeOverlay();
  toast(name + ' a rejoint votre Cercle ✓');
  if(typeof loadProfileTab === 'function') await loadProfileTab();
  const listEl = document.querySelector('[data-cercle-list]');
  if(listEl){
    const connected = !!localStorage.getItem('sb_token');
    listEl.innerHTML = _cercleListHTML(window._profCompanions||[], connected);
  }
  /* Ajout depuis le sélecteur de compagnons d'un voyage (voir
     openTripCompanionsPicker) : le nouveau venu rejoint aussi la sélection
     en cours, pas seulement le Cercle. */
  const tripListEl = document.querySelector('[data-trip-comp-list]');
  if(tripListEl){
    window._tripCompList = (window._tripCompList||[]).concat([row]);
    window._tripCompSelection = (window._tripCompSelection||[]).concat([row.name]);
    tripListEl.innerHTML = _tripCompChecklistHTML(window._tripCompList, window._tripCompSelection);
  }
};
