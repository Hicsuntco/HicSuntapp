/* ── HIC SUNT · Sillage — app: state, routeur, overlays ─────────────── */

const USER = { name:'Charlotte', full:'Charlotte L.', initials:'CL', since:'Membre depuis 2023' };

const state = {
  createTab:'known',          // 'known' | 'surprise'
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

function travelerLabel(){
  return state.travelers + ' voyageur' + (state.travelers > 1 ? 's' : '');
}
function screenEl(){ return document.querySelector('.screen'); }
function esc(s){
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function eur(n){ return Math.round(n).toLocaleString('fr-FR') + ' €'; }

/* ── overlays ───────────────────────────────────────────────────────── */
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

/* ── toast ──────────────────────────────────────────────────────────── */
let _toastTimer = null;
function toast(msg){
  let t = screenEl().querySelector('.toast');
  if (!t){ t = document.createElement('div'); t.className = 'toast'; screenEl().appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(function(){ t.classList.add('show'); });
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2400);
}

/* ── navbar helper ──────────────────────────────────────────────────── */
function navbar(title, opts){
  opts = opts || {};
  const back = opts.noBack ? '<span class="nav-spacer"></span>'
    : '<button class="nav-btn' + (opts.solidBack ? '' : ' ghost') + '" onclick="closeOverlay()" aria-label="Retour">' + ico('back', 20, 1.7) + '</button>';
  const right = opts.right || '<span class="nav-spacer"></span>';
  return '<div class="navbar' + (opts.dark ? ' on-dark' : '') + '">' + back
    + (title ? '<span class="nav-title">' + esc(title) + '</span>' : '')
    + right + '</div>';
}

/* ── tabs ───────────────────────────────────────────────────────────── */
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
      if (name === 'voyages')  v.innerHTML = voyagesView();
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

/* ── shared openers ─────────────────────────────────────────────────── */
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
  closeAllOverlays();
  setTimeout(function(){ openOverlay('onboarding', onboardingView(), { modal:true }); }, 80);
}

/* ── boot ───────────────────────────────────────────────────────────── */
function buildApp(){
  const s = screenEl();
  s.innerHTML = '<div class="tabs">'
    + '<div class="tabview" data-tab="discover"></div>'
    + '<div class="tabview" data-tab="create"></div>'
    + '<div class="tabview" data-tab="voyages"></div>'
    + '<div class="tabview" data-tab="profile"></div>'
    + '</div>' + tabbarHTML();
  setTab('discover');
  openOverlay('onboarding', onboardingView(), { modal:true });
}
document.addEventListener('DOMContentLoaded', buildApp);
