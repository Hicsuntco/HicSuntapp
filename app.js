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

/* ── Redéfinition forcée des fonctions carte (app.js chargé en dernier) ─
   Écrase l'ancienne mapSVG/mapView de features.js qui utilisait contour()
   et graticule() — responsables de la spirale et des ronds abstraits.    ── */
var _GEO = {
  'sardaigne':{vb:'0 0 100 160',path:'M50,8 C58,10 66,14 70,22 C74,30 72,38 74,46 C76,54 80,60 78,70 C76,80 70,84 68,94 C66,104 70,112 66,120 C62,128 54,134 46,138 C38,142 30,138 26,130 C22,122 24,114 22,106 C20,98 16,92 18,82 C20,72 26,66 28,56 C30,46 26,36 30,26 C34,16 42,6 50,8Z',cities:{'Cagliari':[50,130],'Iglesias':[34,118],'Oristano':[32,82],'Nuoro':[58,62],'Sassari':[36,28],'Alghero':[24,38],'Olbia':[72,26],'Villasimius':[68,136],'Chia':[40,146],'Barumini':[46,102]}},
  'thaïlande':{vb:'0 0 120 220',path:'M30,10 C38,6 50,6 62,10 C74,14 84,20 90,30 C96,40 94,52 92,62 C90,72 86,80 84,88 C82,96 84,104 80,110 C76,116 68,118 64,124 C60,130 58,136 56,142 C54,148 50,152 48,158 C46,164 46,170 44,176 C42,182 40,188 38,194 C36,200 34,206 32,212 C30,216 28,218 28,218 L26,218 C25,214 24,208 26,202 C28,196 30,190 32,184 C34,178 34,172 36,166 C38,160 40,154 42,148 C44,142 44,136 46,130 C48,124 52,120 54,114 C56,108 56,102 58,96 C60,90 64,86 66,80 C68,74 66,66 68,58 C70,50 76,44 78,36 C80,28 76,18 70,12 C64,6 52,8 44,10 L30,10Z',cities:{'Chiang Mai':[40,28],'Bangkok':[62,88],'Phuket':[32,164],'Koh Samui':[50,138],'Ayutthaya':[56,76],'Pai':[32,22],'Krabi':[36,158]}},
  'maroc':{vb:'0 0 140 120',path:'M20,16 C32,10 50,10 64,14 C78,18 90,26 98,36 C106,46 108,58 106,70 C104,82 96,90 86,96 C76,102 62,104 48,104 C34,104 20,100 12,90 C4,80 4,66 6,54 C8,42 10,28 20,16Z',cities:{'Marrakech':[60,74],'Casablanca':[30,48],'Fès':[74,34],'Agadir':[36,92],'Essaouira':[22,78]}},
  'japon':{vb:'0 0 140 180',path:'M80,10 C90,12 98,18 100,28 C102,38 96,50 94,62 C92,74 96,86 90,96 C84,106 74,110 68,120 C62,130 60,142 54,148 C48,154 40,152 34,144 C28,136 28,124 26,112 C24,100 18,90 18,78 C18,66 22,54 26,44 C30,34 28,22 34,14 C40,6 50,6 62,8 L80,10Z',cities:{'Tokyo':[82,58],'Kyoto':[62,86],'Osaka':[66,94],'Hiroshima':[50,108]}},
  'grèce':{vb:'0 0 160 120',path:'M40,18 C52,12 66,12 78,16 C90,20 100,28 106,40 C112,52 110,64 106,74 C102,84 92,88 82,94 C72,100 58,102 46,98 C34,94 24,86 18,74 C12,62 12,48 16,36 C20,24 28,24 40,18Z',cities:{'Athènes':[72,68],'Santorin':[90,104],'Mykonos':[100,86]}},
  'portugal':{vb:'0 0 60 120',path:'M30,8 C38,6 46,10 50,18 C54,26 52,36 52,46 C52,56 54,66 52,76 C50,86 44,92 40,100 C36,108 36,118 30,118 C24,118 22,110 18,102 C14,94 12,82 12,70 C12,58 14,48 14,38 C14,28 10,18 14,10 C18,2 24,10 30,8Z',cities:{'Lisbonne':[26,78],'Porto':[22,32],'Faro':[34,110]}},
  'islande':{vb:'0 0 200 100',path:'M30,50 C36,36 50,26 64,20 C78,14 96,14 110,18 C124,22 136,32 144,44 C152,56 150,68 138,76 C126,84 108,84 92,84 C76,84 60,84 46,76 C32,68 24,64 30,50Z',cities:{'Reykjavik':[42,64],'Akureyri':[90,26]}},
  'pérou':{vb:'0 0 100 140',path:'M28,16 C38,10 52,8 64,12 C76,16 84,26 88,38 C92,50 90,64 88,76 C86,88 88,102 82,112 C76,122 64,126 52,126 C40,126 28,120 20,110 C12,100 10,86 12,74 C14,62 10,48 14,36 C18,24 20,22 28,16Z',cities:{'Lima':[20,66],'Cusco':[60,96],'Machu Picchu':[52,100]}},
  'kenya':{vb:'0 0 100 120',path:'M28,16 C40,10 56,8 68,12 C80,16 90,26 94,38 C98,50 96,64 92,76 C88,88 88,102 80,110 C72,118 58,120 46,116 C34,112 22,104 16,92 C10,80 8,66 10,54 C12,42 16,30 28,16Z',cities:{'Nairobi':[52,72],'Mombasa':[76,104],'Masai Mara':[26,84]}},
  'bali':{vb:'0 0 140 70',path:'M20,35 C28,22 44,16 60,14 C76,12 90,16 104,24 C118,32 128,42 124,54 C120,66 104,68 88,68 C72,68 56,66 42,58 C28,50 12,48 20,35Z',cities:{'Ubud':[68,38],'Kuta':[38,50],'Seminyak':[32,46]}},
  '_default':{vb:'0 0 100 100',path:'M50,8 C64,10 76,20 80,34 C84,48 80,62 76,74 C72,86 64,94 52,98 C40,102 28,98 20,88 C12,78 10,64 12,52 C14,40 16,26 24,18 C32,10 38,6 50,8Z',cities:{}}
};
function _geoGet(dest){
  var d=(dest||'').toLowerCase();
  var keys=Object.keys(_GEO).filter(function(k){return k!=='_default';});
  for(var i=0;i<keys.length;i++){if(d.includes(keys[i]))return _GEO[keys[i]];}
  if(/thaïlande|bangkok|phuket|chiang/.test(d))return _GEO['thaïlande'];
  if(/italie|sicile|rome|sardaigne/.test(d))return _GEO.sardaigne;
  if(/grèce|athènes|santorin/.test(d))return _GEO['grèce'];
  if(/japon|tokyo|kyoto/.test(d))return _GEO.japon;
  if(/maroc|marrakech/.test(d))return _GEO.maroc;
  return _GEO._default;
}
function _geoPts(plan,g){
  var vb=g.vb.split(' ').map(Number),vbW=vb[2],vbH=vb[3],cities=g.cities||{};
  var cv=Object.values(cities),cxC=vbW/2,cyC=vbH/2;
  if(cv.length){cxC=cv.reduce(function(s,c){return s+c[0];},0)/cv.length;cyC=cv.reduce(function(s,c){return s+c[1];},0)/cv.length;}
  function match(loc){
    var parts=(loc||'').split(/[\/\-,]/);
    for(var ci in cities){var cl=ci.toLowerCase();for(var pi=0;pi<parts.length;pi++){var t=parts[pi].trim().toLowerCase();if(t.length>=3&&(cl===t||cl.includes(t)||t.includes(cl)))return cities[ci];}}
    return null;
  }
  var matched=plan.map(function(p){return match(p.loc||'');});
  var fc=matched.filter(function(m){return !m;}).length,fi=0;
  return plan.map(function(p,i){
    var m=matched[i];
    if(m)return{vx:m[0],vy:m[1],n:i+1,loc:p.loc,title:p.title,wx:p.wx};
    var a=(fi/Math.max(1,fc))*Math.PI*2-Math.PI/2;fi++;
    return{vx:cxC+Math.cos(a)*Math.min(vbW,vbH)*0.15,vy:cyC+Math.sin(a)*Math.min(vbW,vbH)*0.15,n:i+1,loc:p.loc,title:p.title,wx:p.wx};
  });
}
function geoMapSVG(W,H,activeIdx){
  var it=ITINERARY,dest=it.dest||it.destination||'';
  var g=_geoGet(dest);
  var vb=g.vb.split(' ').map(Number),vbW=vb[2],vbH=vb[3];
  var accent=(it.palette&&(it.palette.culture||it.palette.beach))||'#C9A96E';
  var pts=_geoPts(it.plan||[],g);
  var sc=Math.min(W/vbW,H/vbH)*0.88,ox=(W-vbW*sc)/2,oy=(H-vbH*sc)/2;
  var rp='';
  if(pts.length>1){
    rp='M'+pts[0].vx.toFixed(1)+' '+pts[0].vy.toFixed(1);
    for(var ri=1;ri<pts.length;ri++){
      var mx=((pts[ri-1].vx+pts[ri].vx)/2).toFixed(1),my=((pts[ri-1].vy+pts[ri].vy)/2).toFixed(1);
      rp+=' Q'+pts[ri-1].vx.toFixed(1)+' '+pts[ri-1].vy.toFixed(1)+' '+mx+' '+my+' T'+pts[ri].vx.toFixed(1)+' '+pts[ri].vy.toFixed(1);
    }
  }
  var pr=7/sc,pro=10/sc,fs=6/sc,fso=8/sc;
  var pins=pts.map(function(p,i){
    var on=activeIdx===i,r=on?pro:pr;
    return '<g class="mpin'+(on?' on':'')+'"'+(activeIdx!==null?' onclick="mapSelect('+i+')"':'')+' >'
      +'<circle cx="'+p.vx.toFixed(1)+'" cy="'+p.vy.toFixed(1)+'" r="'+r.toFixed(1)+'"/>'
      +'<text x="'+p.vx.toFixed(1)+'" y="'+(p.vy+r*0.38).toFixed(1)+'" font-size="'+(on?fso:fs).toFixed(1)+'">'+p.n+'</text></g>';
  }).join('');
  return '<svg class="map-svg" viewBox="0 0 '+W+' '+H+'" fill="none">'
    +'<rect width="'+W+'" height="'+H+'" fill="rgba(246,240,228,0.02)" rx="10"/>'
    +'<g transform="translate('+ox.toFixed(1)+','+oy.toFixed(1)+') scale('+sc.toFixed(4)+')">'
    +'<path d="'+g.path+'" fill="'+hexA(accent,0.10)+'" stroke="'+hexA(accent,0.60)+'" stroke-width="'+(1.2/sc).toFixed(2)+'" stroke-linejoin="round" stroke-linecap="round"/>'
    +(rp?'<path d="'+rp+'" stroke="'+hexA(accent,0.85)+'" stroke-width="'+(1.5/sc).toFixed(2)+'" stroke-dasharray="'+(4/sc).toFixed(1)+' '+(3/sc).toFixed(1)+'" fill="none" style="animation:none !important;stroke-dashoffset:0 !important"/>':'')
    +pins+'</g></svg>';
}
function mapView(){
  var i=state.mapDay||0,p=(ITINERARY.plan||[])[i];
  var g=_geoGet(ITINERARY.dest||ITINERARY.destination||'');
  var vb=g.vb.split(' ').map(Number),vbW=vb[2],vbH=vb[3];
  var W=345,H=420,sc=Math.min(W/vbW,H/vbH)*0.88;
  var ox=(W-vbW*sc)/2,oy=(H-vbH*sc)/2;
  var pts=_geoPts(ITINERARY.plan||[],g),pin=pts[i]||{vx:vbW/2,vy:vbH/2};
  var pCx=ox+pin.vx*sc,pCy=oy+pin.vy*sc;
  var popL=Math.max(4,Math.min(pCx/W*100-20,50)),popT=pCy/H>0.58?(pCy/H*100-22):(pCy/H*100+6);
  var wx=p&&Array.isArray(p.wx)?p.wx:['sun','—'];
  var pop=p?'<div class="map-pop" style="left:'+popL.toFixed(1)+'%;top:'+popT.toFixed(1)+'%">'
    +'<div class="mp-k">Jour '+String(p.n).padStart(2,'0')+' · '+esc(p.loc||'')+'</div>'
    +'<div class="mp-t">'+esc(p.title||'')+'</div>'
    +'<div class="mp-m"><span class="mp-wx">'+ico(wx[0],13,1.7)+wx[1]+'</span>'
    +'<span class="mp-l" onclick="openDay('+i+')">Détails ›</span></div></div>':'';
  return statusBar()
    +navbar('Carte du voyage',{right:'<button class="nav-btn" onclick="if(typeof openOffline===\'function\')openOffline()" aria-label="Hors-ligne">'+ico('download',18,1.6)+'</button>'})
    +'<div class="ov-scroll"><div class="bigmap">'
    +'<span class="map-coords">'+esc(ITINERARY.coords||ITINERARY.dest||'')+'</span>'
    +'<span class="map-rose">'+rose(26,1.1)+'</span>'
    +geoMapSVG(W,H,i)+pop
    +'</div><div class="map-rail">'+(ITINERARY.plan||[]).map(function(d,j){
      return '<button class="map-chip'+(j===i?' on':'')+'" onclick="mapSelect('+j+')">'
        +'<div class="mc-d">Jour '+String(d.n).padStart(2,'0')+'</div><div class="mc-l">'+esc(d.loc||'')+'</div></button>';
    }).join('')+'</div></div>';
}
function mapSelect(i){
  state.mapDay=i;
  var el=ovStack[ovStack.length-1];
  if(el&&el.dataset.ov==='map')el.innerHTML=mapView();
}

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

    /* ── 5. Rebuild BUDGET global depuis ITINERARY ── */
    if(typeof BUDGET !== 'undefined'){
      BUDGET.total = ITINERARY.budgetTotal || 0;
      BUDGET.spent = 0;
      BUDGET.lines = (ITINERARY.accommodations||[]).map(function(a){
        return {i:a.i||'bed', n:a.n||'Hébergement', sub:a.loc||'', amount:(a.price||0)*(a.nights||1), paid:false};
      });
      if(!BUDGET.lines.length) BUDGET.lines = [{i:'wallet',n:'Budget estimé',sub:'tout compris',amount:ITINERARY.budgetTotal||0,paid:false}];
    }

    /* ── 6. Rebuild ACTIVITIES depuis le plan ── */
    if(typeof deriveActivities === 'function'){
      try{ deriveActivities(ITINERARY.plan); }catch(e){ console.warn('deriveActivities',e); }
    } else if(typeof ACTIVITIES !== 'undefined'){
      ACTIVITIES.length = 0;
      (ITINERARY.plan||[]).forEach(function(p){
        (p.moments||[]).forEach(function(m,mi){
          ACTIVITIES.push({id:'a'+p.n+'_'+mi,day:p.n,n:m[2]||'',tag:m[3]||'',loc:p.loc||'',dur:'~2h',price:0,i:m[1]||'pin'});
        });
      });
    }

    /* ── 6. Ouverture de l'écran ── */
    try{
      openItinerary();
    }catch(e2){
      console.error('[itineraryView] crash:', e2.message, e2.stack);
      toast('Vue : ' + (e2.message||'?').slice(0,80));
    }

  }catch(e){
    console.error('[loadSavedItinerary] crash:', e.message, e.stack);
    const msg = e && e.message ? e.message.slice(0, 80) : 'inconnue';
    toast('Fetch : ' + msg);
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
  /* ── Réassignation forcée post-chargement de tous les scripts ──
     features.js (chargé avant app.js) définit mapSVG/mapView avec contour()
     et graticule() — les ronds abstraits et la spirale. On les écrase ici,
     après que tous les <script> ont été exécutés.                        ── */
  window.geoMapSVG = function(W,H,activeIdx){
    var it=ITINERARY,dest=it.dest||it.destination||'';
    var g=_geoGet(dest);
    var vb=g.vb.split(' ').map(Number),vbW=vb[2],vbH=vb[3];
    var accent=(it.palette&&(it.palette.culture||it.palette.beach))||'#C9A96E';
    /* Dédupliquer par lieu + max 8 pins */
    var seen={},dedup=[];
    (it.plan||[]).forEach(function(p){var k=(p.loc||'').split(/[\/\-,]/)[0].trim().toLowerCase();if(!seen[k]){seen[k]=true;dedup.push(p);}});
    var disp=dedup.slice(0,8).map(function(p,i){return Object.assign({},p,{n:i+1});});
    var pts=_geoPts(disp,g);
    var sc=Math.min(W/vbW,H/vbH)*0.88,ox=(W-vbW*sc)/2,oy=(H-vbH*sc)/2;
    var rp='';
    if(pts.length>1){
      rp='M'+pts[0].vx.toFixed(1)+' '+pts[0].vy.toFixed(1);
      for(var ri=1;ri<pts.length;ri++){
        var mx=((pts[ri-1].vx+pts[ri].vx)/2).toFixed(1),my=((pts[ri-1].vy+pts[ri].vy)/2).toFixed(1);
        rp+=' Q'+pts[ri-1].vx.toFixed(1)+' '+pts[ri-1].vy.toFixed(1)+' '+mx+' '+my+' T'+pts[ri].vx.toFixed(1)+' '+pts[ri].vy.toFixed(1);
      }
    }
    var pr=7/sc,pro=10/sc,fs=6/sc,fso=8/sc;
    var pins=pts.map(function(p,i){
      var on=activeIdx===i,r=on?pro:pr;
      return '<g class="mpin'+(on?' on':'')+'"'+(activeIdx!==null?' onclick="mapSelect('+i+')"':'')+' >'
        +'<circle cx="'+p.vx.toFixed(1)+'" cy="'+p.vy.toFixed(1)+'" r="'+r.toFixed(1)+'"/>'
        +'<text x="'+p.vx.toFixed(1)+'" y="'+(p.vy+r*0.38).toFixed(1)+'" font-size="'+(on?fso:fs).toFixed(1)+'">'+p.n+'</text></g>';
    }).join('');
    return '<svg class="map-svg" viewBox="0 0 '+W+' '+H+'" fill="none">'
      +'<rect width="'+W+'" height="'+H+'" fill="rgba(246,240,228,0.02)" rx="10"/>'
      +'<g transform="translate('+ox.toFixed(1)+','+oy.toFixed(1)+') scale('+sc.toFixed(4)+')">'
      +'<path d="'+g.path+'" fill="'+hexA(accent,0.10)+'" stroke="'+hexA(accent,0.60)+'" stroke-width="'+(1.2/sc).toFixed(2)+'" stroke-linejoin="round" stroke-linecap="round"/>'
      +(rp?'<path d="'+rp+'" stroke="'+hexA(accent,0.85)+'" stroke-width="'+(1.5/sc).toFixed(2)+'" stroke-dasharray="'+(4/sc).toFixed(1)+' '+(3/sc).toFixed(1)+'" fill="none" style="animation:none !important;stroke-dashoffset:0 !important"/>':'')
      +pins+'</g></svg>';
  };
  window.mapView = function(){
    var i=state.mapDay||0,p=(ITINERARY.plan||[])[i];
    var g=_geoGet(ITINERARY.dest||ITINERARY.destination||'');
    var vb=g.vb.split(' ').map(Number),vbW=vb[2],vbH=vb[3];
    var W=345,H=420,sc=Math.min(W/vbW,H/vbH)*0.88;
    var ox=(W-vbW*sc)/2,oy=(H-vbH*sc)/2;
    var pts=_geoPts(ITINERARY.plan||[],g),pin=pts[i]||{vx:vbW/2,vy:vbH/2};
    var pCx=ox+pin.vx*sc,pCy=oy+pin.vy*sc;
    var popL=Math.max(4,Math.min(pCx/W*100-20,50)),popT=pCy/H>0.58?(pCy/H*100-22):(pCy/H*100+6);
    var wx=p&&Array.isArray(p.wx)?p.wx:['sun','—'];
    var pop=p?'<div class="map-pop" style="left:'+popL.toFixed(1)+'%;top:'+popT.toFixed(1)+'%">'
      +'<div class="mp-k">Jour '+String(p.n).padStart(2,'0')+' · '+esc(p.loc||'')+'</div>'
      +'<div class="mp-t">'+esc(p.title||'')+'</div>'
      +'<div class="mp-m"><span class="mp-wx">'+ico(wx[0],13,1.7)+wx[1]+'</span>'
      +'<span class="mp-l" onclick="openDay('+i+')">Détails ›</span></div></div>':'';
    return statusBar()
      +navbar('Carte du voyage',{right:'<button class="nav-btn" onclick="if(typeof openOffline===\'function\')openOffline()" aria-label="Hors-ligne">'+ico('download',18,1.6)+'</button>'})
      +'<div class="ov-scroll"><div class="bigmap">'
      +'<span class="map-coords">'+esc(ITINERARY.coords||ITINERARY.dest||'')+'</span>'
      +'<span class="map-rose">'+rose(26,1.1)+'</span>'
      +window.geoMapSVG(W,H,i)+pop
      +'</div><div class="map-rail">'+(ITINERARY.plan||[]).map(function(d,j){
        return '<button class="map-chip'+(j===i?' on':'')+'" onclick="mapSelect('+j+')">'
          +'<div class="mc-d">Jour '+String(d.n).padStart(2,'0')+'</div><div class="mc-l">'+esc(d.loc||'')+'</div></button>';
      }).join('')+'</div></div>';
  };
  window.mapSelect = function(i){
    state.mapDay=i;
    var el=ovStack[ovStack.length-1];
    if(el&&el.dataset.ov==='map')el.innerHTML=window.mapView();
  };

  window.shareView = function(){
    var it=ITINERARY;
    return statusBar()+navbar('Partager le voyage')
      +'<div class="ov-scroll px">'
      +'<span class="eyebrow" style="display:block;margin-top:10px">'+esc(it.dest||'')+' · '+(it.days||'')+ ' jours</span>'
      +'<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Partager ce voyage</h1>'
      +'<div class="row" onclick="copyShareLink()"><span class="r-ico">'+ico('link',19,1.5)+'</span><div class="r-main"><div class="r-t">Copier le lien</div><div class="r-s">Lecture seule</div></div><span class="r-chev">'+ico('chevron',17,1.6)+'</span></div>'
      +'<div class="row" onclick="sendShareLink()"><span class="r-ico">'+ico('share',18,1.5)+'</span><div class="r-main"><div class="r-t">Envoyer par message</div><div class="r-s">iMessage · WhatsApp</div></div><span class="r-chev">'+ico('chevron',17,1.6)+'</span></div>'
      +'<div class="row" onclick="exportPDF&&exportPDF()"><span class="r-ico">'+ico('doc',19,1.5)+'</span><div class="r-main"><div class="r-t">Exporter en PDF</div><div class="r-s">Itinéraire complet</div></div><span class="r-chev">'+ico('chevron',17,1.6)+'</span></div>'
      +'</div>';
  };
  if(typeof copyShareLink==='undefined'||true){
    window.copyShareLink = async function(){
      try{ await navigator.clipboard.writeText('https://hic-suntapp.vercel.app/?voyage='+encodeURIComponent((ITINERARY.dest||'').toLowerCase().replace(/\s+/g,'-'))); toast('Lien copié'); }
      catch(e){ toast('Impossible de copier'); }
    };
    window.sendShareLink = async function(){
      var it=ITINERARY;
      var url='https://hic-suntapp.vercel.app/?voyage='+encodeURIComponent((it.dest||'').toLowerCase().replace(/\s+/g,'-'));
      var txt='Découvre cet itinéraire '+(it.dest||'')+' composé par Hic Sunt : '+url;
      if(navigator.share){try{await navigator.share({title:'Hic Sunt · '+(it.dest||''),text:txt,url:url});}catch(e){}}
      else{try{await navigator.clipboard.writeText(txt);toast('Lien copié');}catch(e){toast('Partage indisponible');}}
    };
  }

  playSplash(buildApp);
});
