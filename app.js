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
      if (name === 'discover') v.innerHTML = discoverView();
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
function openItinerary(){ openOverlay('itinerary', itineraryView()); }
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
  USER.name = 'Voyageur'; USER.full = ''; USER.initials = '??';
  closeAllOverlays();
  setTimeout(function(){ openOverlay('onboarding', onboardingView(), { modal:true }); }, 80);
}

/* ── Supabase ── */
const SUPABASE_URL  = 'https://lucbxwxcismnvcdnctau.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Y2J4d3hjaXNtbnZjZG5jdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTc3NzAsImV4cCI6MjA5NDU5Mzc3MH0.G17LlW8K-5UDg_QbkJprkZX-oqlTL_RWUTrwIh408yQ';

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
    toast('Vérifiez vos emails pour confirmer votre compte');
    closeAllOverlays(); setTab('discover');
  }catch(e){ toast(e.message||'Erreur lors de la création du compte'); }
}
function _applyUser(user){
  if (!user) return;
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || user.email.split('@')[0];
  const parts = name.split(' ');
  USER.name = parts[0];
  USER.full = name;
  USER.initials = parts.map(function(p){ return p[0]; }).join('').toUpperCase().slice(0,2);
  USER.since = 'Membre depuis ' + new Date().getFullYear();
}

/* ── Supabase itinéraires ── */
async function saveItinerary(){
  const token = localStorage.getItem('sb_token');
  if(!token) return;
  try{
    await fetch(SUPABASE_URL+'/rest/v1/itineraries',{
      method:'POST',
      headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Prefer':'return=minimal'},
      body:JSON.stringify({destination:ITINERARY.dest,dates:ITINERARY.dates,days:ITINERARY.days,budget:ITINERARY.budgetTotal,data:ITINERARY})
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
    openItinerary();
  }catch(e){ toast('Erreur de chargement'); }
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
    /* récupère les infos utilisateur depuis le token JWT */
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

  if (!loggedIn && !token){
    openOverlay('onboarding', onboardingView(), { modal:true });
  }
}

document.addEventListener('DOMContentLoaded', buildApp);
