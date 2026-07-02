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
    + '<div class="wash" style="background:' + d.bg + '"></div>'
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
    +     '<button class="bell-btn" onclick="openOverlay(\'notifications\', notificationsView())" aria-label="Notifications">' + ico('bell', 19, 1.5) + (NOTIFS.some(function(n){return n.unread;}) ? '<span class="dot"></span>' : '') + '</button></div>'
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
/* Aplats vifs façon carte postale — direction Hic Sunt */
const DEST_BG_MAP = {
  'sri lanka':'#2E9CC0','japon':'#129A8B',
  'maroc':'#E86B4A','portugal':'#EE8B4C',
  'islande':'#3E8FA6','pérou':'#A66B3E',
  'thaïlande':'#D4943A','kenya':'#54AE6E',
  'indonesie':'#3EA07C','bali':'#3EA07C',
  'philippines':'#2E9CC0','vietnam':'#3EA07C',
  'sardaigne':'#E8844A','italie':'#E8844A',
  'sicile':'#E8844A','grèce':'#2878A8',
  'espagne':'#D4943A','croatie':'#2878A8',
};
/* Couleur d'accent thématique par destination — libellés & badges hors aplat */
const DEST_ACCENT_MAP = {
  mediterranean:{ primary:'#E8844A', glow:'rgba(244,238,223,0.22)' },
  desert:       { primary:'#D4943A', glow:'rgba(244,238,223,0.22)' },
  alpine:       { primary:'#3E8FA6', glow:'rgba(244,238,223,0.22)' },
  tropical:     { primary:'#54AE6E', glow:'rgba(244,238,223,0.22)' },
  urban:        { primary:'#9B85CC', glow:'rgba(244,238,223,0.22)' },
};
function destBg(name){ const k=(name||'').toLowerCase(); for(const pat in DEST_BG_MAP){ if(k.includes(pat)) return DEST_BG_MAP[pat]; } return '#A6824A'; }
function destIcon(name){ const k=(name||'').toLowerCase(); if(/japon|tokyo|kyoto/.test(k)) return 'arch'; if(/maroc|marrakech/.test(k)) return 'compass'; if(/islande/.test(k)) return 'peaks'; if(/safari|kenya|afrique/.test(k)) return 'leaf'; if(/bali|indonesie|philippines|thaïlande|vietnam/.test(k)) return 'leaf'; if(/pérou|andes/.test(k)) return 'peaks'; return 'compass'; }
function _destAccent(dest){
  const theme = (typeof _themeForDestination === 'function') ? _themeForDestination(dest, '', '') : 'mediterranean';
  return DEST_ACCENT_MAP[theme] || DEST_ACCENT_MAP.mediterranean;
}
function savedTripCard(it){
  const bg = destBg(it.destination);
  const icon = destIcon(it.destination);
  const accent = _destAccent(it.destination);
  const daysColor = accent.primary;
  const occ = it.occasion || (it.data && it.data.occasion) || '';
  const OCC_LABELS = {
    'lune-de-miel': {label:'Lune de miel', ic:'heart'},
    'evjf':         {label:'EVJF',          ic:'sparkle'},
    'evg':          {label:'EVG',           ic:'star'},
    'famille':      {label:'En famille',    ic:'users'},
    'anniversaire': {label:'Anniversaire',  ic:'heart'},
    'solo':         {label:'Solo',          ic:'compass'},
    'amis':         {label:'Entre amis',    ic:'users'},
    'pro':          {label:'Voyage pro',    ic:'doc'},
  };
  const occInfo = OCC_LABELS[occ];
  return '<div class="trip" style="position:relative" onclick="loadSavedItinerary(\''+it.id+'\')">'
    +'<button class="trip-del" onclick="event.stopPropagation();deleteSavedItinerary(\''+it.id+'\')" aria-label="Supprimer">'+ico('close',14,2)+'</button>'
    +'<div class="th" style="position:relative;overflow:hidden">'
    +'<div style="position:absolute;inset:0;background:'+bg+'"></div>'
    +'<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,15,8,0.5),rgba(20,15,8,0.04) 60%)"></div>'
    +'<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--onink);opacity:0.4">'+ico(icon,36,1.3)+'</span>'
    +(occInfo?'<span style="position:absolute;top:7px;left:7px;display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:100px;background:var(--ink)"><span style="color:var(--gold-bright);display:flex">'+ico(occInfo.ic,11,1.7)+'</span></span>':'')
    +'</div>'
    +'<div style="min-width:0;flex:1">'
    +'<div class="ti-n">'+esc(it.destination)+'</div>'
    +(occInfo?'<div style="font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:'+accent.primary+';margin-bottom:3px">'+occInfo.label+'</div>':'')
    +'<div class="ti-d">'+esc(it.dates)+'</div>'
    +'<div class="ti-days" style="color:'+daysColor+'">'+it.days+' jour'+(it.days>1?'s':'')+'</div>'
    +'<div class="ti-st"><span class="status ok">Sauvegardé</span></div>'
    +'</div></div>';
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

  const rows = [
    ['compass','Mes préférences de voyage','Styles, budget et rythme par défaut', "openOverlay('prefs', prefsView())"],
    ['bell','Notifications', (NOTIFS.filter(function(n){return n.unread;}).length || 'Aucune') + ' non lue' + (NOTIFS.filter(function(n){return n.unread;}).length>1?'s':''), "openOverlay('notifications', notificationsView())"],
  ];
  if(connected) rows.push(['logout','Déconnexion','', 'logout()']);

  return statusBar()
    + '<div class="px">'
    +   '<h1 class="voy-title" style="margin-bottom:20px">Profil</h1>'
    +   '<div class="prof-card">'
    +     '<div class="prof-id">'
    +       '<span class="avatar" style="width:64px;height:64px;font-size:22px">' + (USER.initials || '✦') + '</span>'
    +       '<div><div class="prof-n">' + esc(USER.full || USER.name || 'Voyageur') + '</div>'
    +         '<div class="prof-m">' + (email ? esc(email) : 'Composez votre premier itinéraire') + '</div></div>'
    +     '</div>'
    +   '</div>'
    +   '<div class="prof-cercle-card" onclick="openCercle()">'
    +     '<span class="pcc-ico">' + ico('sparkle', 20, 1.4) + '</span>'
    +     '<div style="flex:1"><div class="pcc-t">Cercle Hic Sunt</div><div class="pcc-s">' + esc(CERCLE.tier) + ' · ' + CERCLE.points + ' points</div></div>'
    +     '<span class="pcc-cta">Voir</span>'
    +   '</div>'
    +   '<div class="prof-list">' + rows.map(function(r){
          return '<div class="row" onclick="' + r[3] + '">'
            + '<span class="r-ico">' + ico(r[0], 20, 1.5) + '</span>'
            + '<div class="r-main"><div class="r-t">' + r[1] + '</div>' + (r[2] ? '<div class="r-s">' + r[2] + '</div>' : '') + '</div>'
            + '<span class="r-chev">' + ico('chevron', 17, 1.6) + '</span></div>';
        }).join('') + '</div>'
    +   (connected ? '' : '<button class="btn" style="width:100%;margin-top:20px" onclick="openOverlay(\'welcome\', welcomeView(), {modal:true})">Se connecter</button>')
    +   '<p style="text-align:center;font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--sub);margin-top:32px">Hic Sunt · Beyond the Known</p>'
    + '</div>';
}
