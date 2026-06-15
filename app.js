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
    if (on){
      if (name === 'discover') {
        v.innerHTML = discoverView();
        const tiles = v.querySelectorAll('.dest-grid > *');
        tiles.forEach(function(t, i){ t.style.animationDelay = (i * 55) + 'ms'; t.classList.add('tile-in'); });
      }
      if (name === 'create')   v.innerHTML = createView();
      if (name === 'voyages')  { v.innerHTML = voyagesView(); loadVoyagesTab(); }
      if (name === 'profile')  v.innerHTML = profileView();
      v.scrollTop = 0;
    }
    v.classList.toggle('active', on);
  }
  const btns = screenEl().querySelectorAll('[data-tabbtn]');
  for (let i = 0; i < btns.length; i++) btns[i].classList.toggle('on', btns[i].dataset.tabbtn === name);
  if (name === 'create' && typeof initDeck === 'function') initDeck();
  if (typeof museControl === 'function') museControl(name === 'discover');
}

/* ── openers ── */
function openItinerary(){
  const el = openOverlay('itinerary', itineraryView());
  requestAnimationFrame(function(){ revealOnScroll(el); });
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
function payFlow(){
  const el = openOverlay('confirmation', confirmationView(), { modal:true });
  const c = el.querySelector('.conf');
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ if (c) c.classList.add('show'); }); });
}
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
  if(!token) return [];
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/itineraries?select=*&order=created_at.desc',{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }catch(e){ return []; }
}
async function loadVoyagesTab(){
  const items = await loadItineraries();
  const host = document.querySelector('[data-trips]');
  if(!host) return;
  if(!items||!items.length){
    host.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--sub);font-size:14px;font-style:italic">Aucun voyage sauvegardé.<br>Composez votre premier itinéraire.</p>';
    return;
  }
  host.innerHTML = items.map(savedTripCard).join('');
  const cards = host.querySelectorAll('.trip');
  cards.forEach(function(c, i){
    c.style.animationDelay = (i * 70) + 'ms';
    c.classList.add('trip-in');
  });
}
async function loadSavedItinerary(id){
  const token = localStorage.getItem('sb_token');
  if(!token) return;
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/itineraries?id=eq.'+id,{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    const rows = await res.json();
    if(!rows||!rows.length) return;
    Object.assign(ITINERARY, rows[0].data);
    if(typeof deriveActivities==='function') deriveActivities(ITINERARY.plan||[]);
    if(typeof deriveBudget==='function') deriveBudget(ITINERARY.accommodations||[], ITINERARY.budgetTotal||0);
    openItinerary();
  }catch(e){ toast('Erreur de chargement'); }
}
async function deleteSavedItinerary(id){
  const token = localStorage.getItem('sb_token');
  if(!token) return;
  try{
    await fetch(SUPABASE_URL+'/rest/v1/itineraries?id=eq.'+id,{
      method:'DELETE',
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    toast('Voyage supprimé');
    loadVoyagesTab();
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
    +   '<div class="splash-mark">'
    +     '<span class="splash-word">Hic</span><span class="splash-word splash-em"><em>Sunt</em></span>'
    +   '</div>'
    +   '<div class="splash-rule"></div>'
    +   '<div class="splash-tag">Beyond the Known</div>'
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
  }, 1500);
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
