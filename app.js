/* ── HIC SUNT · Sillage — app: state, routeur, overlays ─────────────── */

const USER = { name:'Charlotte', full:'Charlotte L.', initials:'CL', since:'Membre depuis 2023' };

const state = {
  createTab:'known',
  destination:'', origin:'',
  dateFrom:'', dateTo:'',
  travelers:2,
  budget:'Confort', rythme:'Équilibré',
  styles:[], interests:[], occasion:null,
  flightOut:'', flightIn:'',
  dream:'',
  deckIndex:0,
  mapDay:0,
  tab:'discover',
};

function travelerLabel(){ return state.travelers + ' voyageur' + (state.travelers > 1 ? 's' : ''); }
function screenEl(){ return document.querySelector('.screen'); }
function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function eur(n){ return Math.round(n).toLocaleString('fr-FR') + ' €'; }
function hexA(hex, alpha){
  hex = (hex || '#9c7c44');
  if (hex.indexOf('#') !== 0) return 'rgba(156,124,68,'+alpha+')';
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(function(c){ return c+c; }).join('');
  const r = parseInt(hex.substr(0,2),16), g = parseInt(hex.substr(2,2),16), b = parseInt(hex.substr(4,2),16);
  return 'rgba('+r+','+g+','+b+','+alpha+')';
}

/* ── overlays ── */
const ovStack = [];
function openOverlay(name, html, opts){
  opts = opts || {};
  const el = document.createElement('div');
  el.className = 'ov' + (opts.modal ? ' modal' : '') + (opts.carto ? ' carto' : '');
  el.dataset.ov = name;
  el.innerHTML = html;
  screenEl().appendChild(el);
  ovStack.push(el);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('in'); }); });
  return el;
}
function closeOverlay(){
  const el = ovStack.pop();
  if (!el) return;
  el.classList.remove('in');
  setTimeout(function(){ el.remove(); }, 440);
}
function closeAllOverlays(){
  while (ovStack.length){
    const el = ovStack.pop();
    el.classList.remove('in');
    (function(e){ setTimeout(function(){ e.remove(); }, 440); })(el);
  }
}

/* ── toast ── */
let _toastTimer = null;
function toast(msg){
  let t = screenEl().querySelector('.toast');
  if (!t){ t = document.createElement('div'); t.className = 'toast'; screenEl().appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(function(){ t.classList.add('show'); });
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2400);
}

/* ── navbar ── */
function navbar(title, opts){
  opts = opts || {};
  const back = opts.noBack ? '<span class="nav-spacer"></span>'
    : '<button class="nav-btn' + (opts.solidBack ? '' : ' ghost') + '" onclick="closeOverlay()" aria-label="Retour">' + ico('back', 20, 1.7) + '</button>';
  const right = opts.right || '<span class="nav-spacer"></span>';
  return '<div class="navbar' + (opts.dark ? ' on-dark' : '') + '">' + back
    + (title ? '<span class="nav-title">' + esc(title) + '</span>' : '')
    + right + '</div>';
}

/* ── tabs ── */
const TAB_DEFS = [
  ['discover','compass','Découvrir'],
  ['create','sparkle','Créer'],
  ['voyages','map','Voyages'],
  ['profile','person','Profil'],
];
function tabbarHTML(){
  return '<div class="tabbar">' + TAB_DEFS.map(function(t){
    return '<button class="tab-it" data-tabbtn="' + t[0] + '" onclick="setTab(\'' + t[0] + '\')">'
      + ico(t[1], 21, 1.5) + '<span>' + t[2] + '</span></button>';
  }).join('') + '</div>';
}
function setTab(name){
  state.tab = name;
  const views = screenEl().querySelectorAll('.tabview');
  for (let i = 0; i < views.length; i++){
    const v = views[i];
    const on = v.dataset.tab === name;
    v.classList.toggle('active', on);
    if (on){
      if (name === 'discover') {
        v.innerHTML = discoverView();
        const tiles = v.querySelectorAll('.dest-grid > *');
        requestAnimationFrame(function(){
          tiles.forEach(function(t, i){ t.style.animationDelay = (i * 55) + 'ms'; t.classList.add('tile-in'); });
        });
        loadDiscoverTrips();
      }
      if (name === 'create')   v.innerHTML = createView();
      if (name === 'voyages')  { v.innerHTML = voyagesView(); loadVoyagesTab(); }
      if (name === 'profile')  v.innerHTML = profileView();
      v.scrollTop = 0;
    }
  }
  const btns = screenEl().querySelectorAll('[data-tabbtn]');
  for (let i = 0; i < btns.length; i++) btns[i].classList.toggle('on', btns[i].dataset.tabbtn === name);
  if (name === 'create' && typeof initDeck === 'function') initDeck();
  if (typeof museControl === 'function') museControl(name === 'discover');
}

/* ── openers ── */
function openItinerary(){
  const el = openOverlay('itinerary', itineraryView());
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ revealOnScroll(el); }); });
}
function revealOnScroll(container){
  const rows = container.querySelectorAll('.dayrow');
  if(!rows.length) return;
  rows.forEach(function(r){ r.classList.add('reveal'); });
  const scroller = container.querySelector('.ov-scroll') || container;
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { root: scroller, threshold: 0.12 });
  rows.forEach(function(r){ io.observe(r); });
}
function openDest(key){ openOverlay('destination', destinationView(key)); }
function openDay(i){ openOverlay('day', dayDetailView(i)); }
function openBooking(id){ openOverlay('booking', bookingView(id)); }
function openAI(){ const el = openOverlay('ai', aiView()); requestAnimationFrame(function(){ aiScroll(); }); }
function openMapOv(){ openOverlay('map', mapView()); }
function composeFromDest(key){
  state.destination = key;
  state.createTab = 'known';
  state.deckIndex = 1;
  closeAllOverlays();
  setTab('create');
}
function composeFree(){
  const inp = screenEl().querySelector('[data-muse]');
  const v = inp ? inp.value.trim() : '';
  state.destination = v;
  state.createTab = 'known';
  state.deckIndex = v ? 2 : 0;
  setTab('create');
}
function logout(){
  localStorage.removeItem('sb_token');
  localStorage.removeItem('hs_profile_done');
  USER.name = 'Voyageur'; USER.full = ''; USER.initials = '??';
  closeAllOverlays();
  setTimeout(function(){ openOverlay('onboarding', onboardingView(), { modal:true }); }, 80);
}

/* ── Supabase ── */
const SUPABASE_URL  = 'https://lucbxwxcismnvcdnctau.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Y2J4d3hjaXNtbnZjZG5jdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTc3NzAsImV4cCI6MjA5NDU5Mzc3MH0.G17LlW8K-5UDg_QbkJprkZX-oqlTL_RWUTrwIh408yQ';

function _getUserId(){
  const token = localStorage.getItem('sb_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch(e) { return null; }
}

function loginGoogle(){
  const redirectTo = 'https://hic-suntapp.vercel.app/';
  window.location.href = SUPABASE_URL + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(redirectTo);
}
async function loginEmail(){
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  if (!email || !password){ toast('Email et mot de passe requis'); return; }
  try{
    const res = await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=password',{method:'POST',headers:{'content-type':'application/json','apikey':SUPABASE_ANON},body:JSON.stringify({email,password})});
    const data = await res.json();
    if(data.error_description) throw new Error(data.error_description);
    localStorage.setItem('sb_token', data.access_token);
    _applyUser(data.user);
    closeAllOverlays(); setTab('discover');
    checkProfile().then(function(done){ if(!done) openOverlay('welcome', welcomeView(), { modal:true }); });
  }catch(e){ toast(e.message||'Erreur de connexion'); }
}
async function signupEmail(){
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  if (!email || !password){ toast('Email et mot de passe requis'); return; }
  try{
    const res = await fetch(SUPABASE_URL+'/auth/v1/signup',{method:'POST',headers:{'content-type':'application/json','apikey':SUPABASE_ANON},body:JSON.stringify({email,password})});
    const data = await res.json();
    if(data.error) throw new Error(data.error.message||data.error);
    if(data.access_token){
      localStorage.setItem('sb_token', data.access_token);
      _applyUser(data.user);
      closeAllOverlays(); setTab('discover');
      openOverlay('welcome', welcomeView(), { modal:true });
    } else {
      toast('Vérifiez vos emails pour confirmer votre compte');
      closeAllOverlays(); setTab('discover');
    }
  }catch(e){ toast(e.message||'Erreur lors de la création du compte'); }
}
function _applyUser(user){
  if (!user) return;
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || (user.email ? user.email.split('@')[0] : 'Voyageur');
  const parts = name.split(' ');
  USER.name = parts[0];
  USER.full = name;
  USER.initials = parts.map(function(p){ return p[0] || ''; }).join('').toUpperCase().slice(0,2) || '??';
  USER.since = 'Membre depuis ' + new Date().getFullYear();
}

/* ── profil voyageur (nom, naissance, adresse) ──────────────────────── */
async function saveWelcomeProfile(){
  const first = document.getElementById('wFirst').value.trim();
  const last = document.getElementById('wLast').value.trim();
  const birth = document.getElementById('wBirth').value;
  const address = document.getElementById('wAddress').value.trim();
  if(!first || !last){ toast('Prénom et nom requis'); return; }
  const token = localStorage.getItem('sb_token');
  const userId = _getUserId();
  if(!token || !userId){ toast('Erreur de session'); return; }
  try{
    await fetch(SUPABASE_URL+'/rest/v1/profiles',{
      method:'POST',
      headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Prefer':'resolution=merge-duplicates'},
      body:JSON.stringify({id:userId,first_name:first,last_name:last,birth_date:birth||null,address:address||null})
    });
    USER.name = first;
    USER.full = first+' '+last;
    USER.initials = (first[0]+last[0]).toUpperCase();
    localStorage.setItem('hs_profile_done','1');
    closeAllOverlays(); setTab('discover');
  }catch(e){ toast('Erreur de sauvegarde'); }
}

async function checkProfile(){
  const token = localStorage.getItem('sb_token');
  const userId = _getUserId();
  if(!token || !userId) return true;
  if(localStorage.getItem('hs_profile_done')) return true;
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/profiles?id=eq.'+userId+'&select=first_name,last_name',{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    if(res.status===401){
      /* token expiré : on déconnecte proprement plutôt que de boucler sur "Bienvenue" */
      localStorage.removeItem('sb_token');
      localStorage.removeItem('hs_profile_done');
      return true;
    }
    const rows = await res.json();
    if(rows&&rows.length&&rows[0].first_name){
      localStorage.setItem('hs_profile_done','1');
      USER.name = rows[0].first_name;
      USER.full = rows[0].first_name+' '+rows[0].last_name;
      USER.initials = (rows[0].first_name[0]+rows[0].last_name[0]).toUpperCase();
      return true;
    }
    return false;
  }catch(e){ return true; }
}

/* ── Supabase itinéraires ── */
async function saveItinerary(){
  const token = localStorage.getItem('sb_token');
  const userId = _getUserId();
  if(!token || !userId) return;
  try{
    await fetch(SUPABASE_URL+'/rest/v1/itineraries',{
      method:'POST',
      headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Prefer':'return=minimal'},
      body:JSON.stringify({user_id:userId,destination:ITINERARY.dest,dates:ITINERARY.dates,days:ITINERARY.days,budget:ITINERARY.budgetTotal,data:ITINERARY})
    });
    toast('Voyage sauvegardé');
  }catch(e){ toast('Erreur de sauvegarde'); }
}
async function loadItineraries(){
  const token = localStorage.getItem('sb_token');
  if(!token) return null;
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/itineraries?select=*&order=created_at.desc',{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    if(!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  }catch(e){ return null; }
}
/* ── Filtrage des itinéraires par onglet ─────────────────────────────── */
function _classifyItinerary(it){
  /* Classifie un itinéraire selon ses dates en : upcoming / past / draft */
  const data = it.data || {};
  const dateFrom = data.dateFrom || it.date_from || '';
  const dateTo   = data.dateTo   || it.date_to   || '';
  const today = new Date(); today.setHours(0,0,0,0);

  /* Brouillon = généré sans dates précises */
  if(!dateFrom && !dateTo){
    /* Si le titre des dates contient une vraie date on essaie de parser */
    const datesStr = it.dates || data.dates || '';
    const match = datesStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/i);
    if(!match) return 'draft';
  }

  if(dateFrom){
    const from = new Date(dateFrom); from.setHours(0,0,0,0);
    const to   = dateTo ? new Date(dateTo) : new Date(from.getTime() + (it.days||7)*86400000);
    to.setHours(23,59,59,999);
    if(to < today) return 'past';
    return 'upcoming';
  }

  /* Fallback sur la colonne created_at pour estimer si passé */
  if(it.created_at){
    const created = new Date(it.created_at);
    const daysAgo = (today - created) / 86400000;
    if(daysAgo > 90) return 'past';
  }
  return 'draft';
}

async function loadVoyagesTab(){
  const seg = state._voySeg || 'upcoming';
  const items = await loadItineraries();
  const host = document.querySelector('[data-trips]');
  if(!host) return;

  if(items===null){
    host.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--sub);font-size:14px;font-style:italic">Erreur de chargement. Réessayez.</p>';
    return;
  }

  /* Filtrer par segment */
  const filtered = items.filter(function(it){ return _classifyItinerary(it) === seg; });

  const emptyMessages = {
    upcoming: 'Aucun voyage à venir.<br>Composez votre prochain itinéraire.',
    past:     'Aucun voyage passé enregistré.',
    draft:    'Aucun brouillon sauvegardé.',
  };

  if(!filtered.length){
    host.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--sub);font-size:14px;font-style:italic">'+(emptyMessages[seg]||'Aucun voyage.')+'</p>';
    return;
  }

  host.innerHTML = filtered.map(savedTripCard).join('');
  const cards = host.querySelectorAll('.trip');
  requestAnimationFrame(function(){
    cards.forEach(function(c, i){
      c.style.animationDelay = (i * 70) + 'ms';
      c.classList.add('trip-in');
    });
  });
}

async function loadSavedItinerary(id){
  const token = localStorage.getItem('sb_token');
  if(!token) return;
  try{
    /* ── 1. Fetch depuis Supabase ── */
    const res = await fetch(SUPABASE_URL+'/rest/v1/itineraries?id=eq.'+id,{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    if(!res.ok) throw new Error('HTTP '+res.status);
    const rows = await res.json();
    if(!rows||!rows.length){ toast('Itinéraire introuvable'); return; }
    const saved = rows[0];
    const data = saved.data || {};

    /* ── 2. Reset propre de l'ITINERARY avant de remplir ── */
    /* On vide d'abord pour éviter des résidus d'un itinéraire précédent */
    const keys = Object.keys(ITINERARY);
    keys.forEach(function(k){ delete ITINERARY[k]; });
    Object.assign(ITINERARY, data);

    /* ── 3. Champs critiques avec fallbacks ── */
    if(!ITINERARY.dest)         ITINERARY.dest         = saved.destination || 'Destination';
    if(!ITINERARY.dates)        ITINERARY.dates        = saved.dates || '';
    if(!ITINERARY.days)         ITINERARY.days         = saved.days || (ITINERARY.plan||[]).length || 7;
    if(!ITINERARY.budgetTotal)  ITINERARY.budgetTotal  = saved.budget || 0;
    if(!ITINERARY.level)        ITINERARY.level        = saved.level || 'Confort';
    if(!ITINERARY.tag)          ITINERARY.tag          = '';
    if(!ITINERARY.coords)       ITINERARY.coords       = '';
    if(!ITINERARY.distance)     ITINERARY.distance     = '';
    if(!Array.isArray(ITINERARY.plan))          ITINERARY.plan          = [];
    if(!Array.isArray(ITINERARY.accommodations)) ITINERARY.accommodations = [];
    if(!Array.isArray(ITINERARY.gems))           ITINERARY.gems           = [];

    /* Normaliser chaque jour du plan */
    ITINERARY.plan = ITINERARY.plan.map(function(p, i){
      if(!p || typeof p !== 'object') return null;
      return {
        n:        p.n || (i+1),
        loc:      p.loc || '',
        title:    p.title || '',
        desc:     p.desc || '',
        category: p.category || 'culture',
        wx:       Array.isArray(p.wx) ? p.wx : ['sun','—'],
        tags:     Array.isArray(p.tags) ? p.tags : [],
        moments:  Array.isArray(p.moments) ? p.moments : [],
        tip:      p.tip || '',
        night:    p.night || null,
        restaurant: p.restaurant || null,
        wellness:   p.wellness || null,
      };
    }).filter(Boolean);

    /* Normaliser les hébergements */
    ITINERARY.accommodations = ITINERARY.accommodations.map(function(a){
      if(!a || typeof a !== 'object') return null;
      return {
        id:     a.id || ('acc-'+Math.random().toString(36).slice(2)),
        n:      a.n || a.name || 'Hébergement',
        type:   a.type || '',
        loc:    a.loc || a.location || '',
        price:  Number(a.price) || 0,
        nights: Number(a.nights) || 1,
        blurb:  a.blurb || '',
        i:      a.i || 'bed',
        url:    a.url || '',
      };
    }).filter(Boolean);

    /* ── 4. Reconstruction theme + palette ── */
    if(typeof _themeForDestination === 'function'){
      const themeName = _themeForDestination(
        ITINERARY.dest, ITINERARY.region||'', ITINERARY.country||''
      );
      ITINERARY.theme   = themeName;
      ITINERARY.palette = (typeof THEME_PALETTES!=='undefined' && THEME_PALETTES[themeName])
        || THEME_PALETTES && THEME_PALETTES.mediterranean
        || {};
    }

    /* ── 5. Dérivés ── */
    if(typeof deriveActivities==='function') try{ deriveActivities(ITINERARY.plan); }catch(e){ console.warn('deriveActivities',e); }
    if(typeof deriveBudget==='function') try{
      deriveBudget(ITINERARY.accommodations, ITINERARY.budgetTotal, ITINERARY.dest, ITINERARY.region||'', ITINERARY.country||'', state.travelers||2, null);
    }catch(e){ console.warn('deriveBudget',e); }

    /* ── 6. Ouverture de l'écran ── */
    openItinerary();

  }catch(e){
    console.error('[loadSavedItinerary] crash:', e.message, e.stack);
    toast('Erreur de chargement');
  }
}
async function deleteSavedItinerary(id){
  const token = localStorage.getItem('sb_token');
  if(!token) return;
  if(!id || typeof id !== 'string' || !id.trim()){
    toast('Erreur : voyage non identifié');
    return;
  }
  try{
    await fetch(SUPABASE_URL+'/rest/v1/itineraries?id=eq.'+encodeURIComponent(id),{
      method:'DELETE',
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    toast('Voyage supprimé');
    if(document.querySelector('[data-trips]')) loadVoyagesTab();
    if(document.querySelector('[data-disc-trips]')) loadDiscoverTrips();
  }catch(e){ toast('Erreur de suppression'); }
}

/* ── callback Google OAuth ── */
function handleAuthCallback(){
  try{
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) return false;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    if (!token) return false;
    localStorage.setItem('sb_token', token);
    try{
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.user_metadata){
        _applyUser({ user_metadata: payload.user_metadata, email: payload.email || '' });
      }
    }catch(e){}
    window.history.replaceState({}, '', window.location.pathname);
    return true;
  }catch(e){ return false; }
}

/* ── splash de lancement ─────────────────────────────────────────────── */
function splashHTML(){
  return '<div class="splash" data-splash>'
    +   '<svg class="splash-grid" viewBox="0 0 393 852" preserveAspectRatio="none" fill="none">'
    +     [0,1,2,3,4,5,6].map(function(i){ return '<line class="sg-line" x1="'+(i*65.5)+'" y1="0" x2="'+(i*65.5)+'" y2="852"/>'; }).join('')
    +     [0,1,2,3,4,5,6,7,8,9,10,11,12].map(function(i){ return '<line class="sg-line" x1="0" y1="'+(i*71)+'" x2="393" y2="'+(i*71)+'"/>'; }).join('')
    +   '</svg>'
    +   '<svg class="splash-compass" viewBox="0 0 120 120" fill="none">'
    +     '<circle class="sc-ring" cx="60" cy="60" r="46"/>'
    +     '<circle class="sc-ring sc-ring2" cx="60" cy="60" r="58"/>'
    +     '<g class="sc-needle"><path d="M60 18 L67 60 L60 102 L53 60 Z"/></g>'
    +     '<text class="sc-n" x="60" y="11" text-anchor="middle">N</text>'
    +   '</svg>'
    +   '<span class="splash-coord splash-coord-1">48°51′N</span>'
    +   '<span class="splash-coord splash-coord-2">2°21′E</span>'
    +   '<div class="splash-core">'
    +     '<div class="splash-mark">'
    +       '<span class="splash-word">Hic</span><span class="splash-word splash-em"><em>Sunt</em></span>'
    +     '</div>'
    +     '<div class="splash-rule"></div>'
    +     '<div class="splash-tag">Beyond the Known</div>'
    +   '</div>'
    + '</div>';
}
function playSplash(next){
  const s = screenEl();
  const el = document.createElement('div');
  el.innerHTML = splashHTML();
  const splash = el.firstElementChild;
  s.appendChild(splash);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ if (splash.parentNode) splash.classList.add('run'); }); });
  setTimeout(function(){
    if (splash.parentNode) splash.classList.add('out');
    setTimeout(function(){
      if (splash.parentNode) splash.parentNode.removeChild(splash);
      next();
    }, 480);
  }, 2000);
}

/* ── boot ── */
function buildApp(){
  const s = screenEl();
  s.innerHTML = '<div class="tabs">'
    + '<div class="tabview" data-tab="discover"></div>'
    + '<div class="tabview" data-tab="create"></div>'
    + '<div class="tabview" data-tab="voyages"></div>'
    + '<div class="tabview" data-tab="profile"></div>'
    + '</div>' + tabbarHTML();

  const loggedIn = handleAuthCallback();
  const token = localStorage.getItem('sb_token');

  setTab('discover');

  if (loggedIn || token) {
    checkProfile().then(function(done){
      if (!done) openOverlay('welcome', welcomeView(), { modal:true });
    });
  } else {
    openOverlay('onboarding', onboardingView(), { modal:true });
  }
}

document.addEventListener('DOMContentLoaded', function(){
  playSplash(buildApp);
});
