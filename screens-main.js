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
    + contour()
    + '<span class="wm">' + ico(d.i, 30, 1.3) + '</span>'
    + '<span class="code">' + (DEST_CODES[key] || '—') + '</span>'
    + '<div class="t-cap"><div class="t-n">' + esc(key) + '</div><div class="t-rule"></div><div class="t-r">' + esc(d.r) + '</div></div>'
    + '</div>';
}
function tripCard(t){
  const action = t.itin ? 'openItinerary()' : (t.s[0] === 'prep' ? "setTab('create')" : 'void(0)');
  return '<div class="trip" onclick="' + action + '">'
    + '<div class="th"><div class="wash" style="position:absolute;inset:0;background:' + t.bg + '"></div>'
    + contour() + '<span class="wm">' + ico(t.i, 34, 1.3) + '</span></div>'
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
    +     '<button class="bell-btn" onclick="openOverlay(\'notifications\', notificationsView())" aria-label="Notifications">' + ico('bell', 19, 1.5) + '<span class="dot"></span></button></div>'
    +   '<hr class="hairline gold" style="margin-top:14px">'
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
    +   TRIPS.upcoming.map(tripCard).join('')
    + '</div>';
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
    +     '<span class="deck-count" data-deck-count>01 / 12</span>'
    +   '</div>'
    + '</div>'
    + '<div id="deck"></div>';
}

/* ── Mes voyages ────────────────────────────────────────────────────── */
const DEST_BG_MAP = {
  'sri lanka':'linear-gradient(135deg,#0C160E,#1A3020)','japon':'linear-gradient(135deg,#0F0F14,#1a1025)',
  'maroc':'linear-gradient(135deg,#140C05,#2a180a)','portugal':'linear-gradient(135deg,#0A0C14,#0d1520)',
  'islande':'linear-gradient(135deg,#080C14,#101828)','pérou':'linear-gradient(135deg,#0A0D08,#111a0e)',
  'thaïlande':'linear-gradient(135deg,#150F05,#221505)','kenya':'linear-gradient(135deg,#110D05,#1e1508)',
  'indonesie':'linear-gradient(135deg,#0D1F0F,#162B18)','bali':'linear-gradient(135deg,#0D1F0F,#162B18)',
  'philippines':'linear-gradient(135deg,#080C14,#0d1a28)','vietnam':'linear-gradient(135deg,#0F1A0D,#172514)',
};
function destBg(name){ const k=(name||'').toLowerCase(); for(const pat in DEST_BG_MAP){ if(k.includes(pat)) return DEST_BG_MAP[pat]; } return 'linear-gradient(135deg,#1a1610,#2a2018)'; }
function destIcon(name){ const k=(name||'').toLowerCase(); if(/japon|tokyo|kyoto/.test(k)) return 'arch'; if(/maroc|marrakech/.test(k)) return 'compass'; if(/islande/.test(k)) return 'peaks'; if(/safari|kenya|afrique/.test(k)) return 'leaf'; if(/bali|indonesie|philippines|thaïlande|vietnam/.test(k)) return 'leaf'; if(/pérou|andes/.test(k)) return 'peaks'; return 'compass'; }
function savedTripCard(it){
  const bg=destBg(it.destination), icon=destIcon(it.destination);
  return '<div class="trip" onclick="loadSavedItinerary(\''+it.id+'\')">'
    +'<div class="th" style="position:relative;overflow:hidden">'
    +'<div style="position:absolute;inset:0;background:'+bg+'"></div>'
    +contour()
    +'<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(246,240,228,0.18)">'+ico(icon,38,1.2)+'</span>'
    +'</div>'
    +'<div><div class="ti-n">'+esc(it.destination)+'</div>'
    +'<div class="ti-d">'+esc(it.dates)+'</div>'
    +'<div class="ti-days">'+it.days+' jour'+(it.days>1?'s':'')+'</div>'
    +'<div class="ti-st"><span class="status ok">Sauvegardé</span></div>'
    +'</div></div>';
}
function voyagesView(){
  const seg = state._voySeg || 'upcoming';
  const labels = [['upcoming','À venir'],['past','Passés'],['draft','Brouillons']];
  return statusBar()
    + '<div class="px">'
    +   '<h1 class="voy-title">Mes voyages</h1>'
    +   '<div class="seg voy-seg">' + labels.map(function(l){
          return '<button class="' + (seg === l[0] ? 'on' : '') + '" onclick="voySeg(\'' + l[0] + '\')">' + l[1] + '</button>';
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
  const rows = [
    ['sliders','Préférences de voyage','Styles · budget · rythme', "openOverlay('prefs', prefsView())"],
    ['doc','Passeport & documents','1 action requise', "openOverlay('documents', documentsView())"],
    ['compass','Cercle Hic Sunt', CERCLE.tier + ' · ' + CERCLE.points + ' pts', "openOverlay('cercle', cercleView())"],
    ['bell','Conciergerie','Hansa · en ligne', "openOverlay('concierge', conciergeView())"],
    ['help','Notifications','2 non lues', "openOverlay('notifications', notificationsView())"],
    ['logout','Déconnexion','', 'logout()'],
  ];
  return statusBar()
    + '<div class="px">'
    +   '<div class="prof-card">' + contour()
    +     '<div class="prof-id"><span class="avatar" style="width:60px;height:60px;font-size:20px">' + USER.initials + '</span>'
    +       '<div><div class="prof-n">' + esc(USER.full) + '</div><div class="prof-m">' + esc(USER.since) + '</div></div></div>'
    +     '<div class="prof-cercle">'
    +       '<div class="prof-tier"><b>' + esc(CERCLE.tier) + '</b><span>' + CERCLE.points + ' pts</span></div>'
    +       '<div class="prog"><i style="width:' + Math.round(CERCLE.progress * 100) + '%"></i></div>'
    +     '</div>'
    +   '</div>'
    +   '<div class="prof-list">' + rows.map(function(r){
          return '<div class="row" onclick="' + r[3] + '">'
            + '<span class="r-ico">' + ico(r[0], 20, 1.5) + '</span>'
            + '<div class="r-main"><div class="r-t">' + r[1] + '</div>' + (r[2] ? '<div class="r-s">' + r[2] + '</div>' : '') + '</div>'
            + '<span class="r-chev">' + ico('chevron', 17, 1.6) + '</span></div>';
        }).join('') + '</div>'
    + '</div>';
}
