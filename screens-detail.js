/* ── HIC SUNT · Sillage — écrans détail ─────────────────────────────── */

/* ── Carte géographique — redéfinition forcée (remplace features.js) ── */
var GEO_SHAPES_SD = {
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
function _geoShapeSD(dest){
  var d=(dest||'').toLowerCase();
  var keys=Object.keys(GEO_SHAPES_SD).filter(function(k){return k!=='_default';});
  for(var i=0;i<keys.length;i++){if(d.includes(keys[i]))return{key:keys[i],g:GEO_SHAPES_SD[keys[i]]};}
  if(/italie|sicile|rome/.test(d))return{key:'sardaigne',g:GEO_SHAPES_SD.sardaigne};
  if(/thaïlande|bangkok|phuket/.test(d))return{key:'thaïlande',g:GEO_SHAPES_SD['thaïlande']};
  if(/grèce|athènes|santorin/.test(d))return{key:'grèce',g:GEO_SHAPES_SD['grèce']};
  if(/japon|tokyo|kyoto/.test(d))return{key:'japon',g:GEO_SHAPES_SD.japon};
  if(/maroc|marrakech/.test(d))return{key:'maroc',g:GEO_SHAPES_SD.maroc};
  return{key:'_default',g:GEO_SHAPES_SD._default};
}
function _sdMatchCity(loc,cities){
  var parts=(loc||'').split(/[\/\-,]/);
  for(var ci in cities){var cl=ci.toLowerCase();for(var pi=0;pi<parts.length;pi++){var tok=parts[pi].trim().toLowerCase();if(tok.length>=3&&(cl===tok||cl.includes(tok)||tok.includes(cl)))return cities[ci];}}
  return null;
}
function _sdCityPts(plan,geo){
  var vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number);
  var vbW=vbParts[2],vbH=vbParts[3],cities=geo.g.cities||{};
  var cityVals=Object.values(cities),cxC=vbW/2,cyC=vbH/2;
  if(cityVals.length){cxC=cityVals.reduce(function(s,c){return s+c[0];},0)/cityVals.length;cyC=cityVals.reduce(function(s,c){return s+c[1];},0)/cityVals.length;}
  var matched=plan.map(function(p){return _sdMatchCity(p.loc||'',cities);});
  var fbCount=matched.filter(function(m){return !m;}).length,fbIdx=0;
  return plan.map(function(p,i){
    var m=matched[i];
    if(m)return{vx:m[0],vy:m[1],n:i+1,loc:p.loc};
    var angle=(fbIdx/Math.max(1,fbCount))*Math.PI*2-Math.PI/2;fbIdx++;
    return{vx:cxC+Math.cos(angle)*Math.min(vbW,vbH)*0.15,vy:cyC+Math.sin(angle)*Math.min(vbW,vbH)*0.15,n:i+1,loc:p.loc};
  });
}
function geoMapSVG(W,H,activeIdx){
  var it=ITINERARY,dest=it.dest||it.destination||'';
  var geo=_geoShapeSD(dest);
  var vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number),vbW=vbParts[2],vbH=vbParts[3];
  var accent=(it.palette&&(it.palette.culture||it.palette.beach))||'#C9A96E';
  var pts=_sdCityPts(it.plan||[],geo);
  var scale=Math.min(W/vbW,H/vbH)*0.88,offX=(W-vbW*scale)/2,offY=(H-vbH*scale)/2;
  var rp='';
  if(pts.length>1){
    rp='M'+pts[0].vx.toFixed(1)+' '+pts[0].vy.toFixed(1);
    for(var ri=1;ri<pts.length;ri++){
      var mx=((pts[ri-1].vx+pts[ri].vx)/2).toFixed(1),my=((pts[ri-1].vy+pts[ri].vy)/2).toFixed(1);
      rp+=' Q'+pts[ri-1].vx.toFixed(1)+' '+pts[ri-1].vy.toFixed(1)+' '+mx+' '+my+' T'+pts[ri].vx.toFixed(1)+' '+pts[ri].vy.toFixed(1);
    }
  }
  var pinR=7/scale,pinRon=10/scale,fs=6/scale,fson=8/scale;
  var pins=pts.map(function(p,i){
    var on=activeIdx===i,r=on?pinRon:pinR;
    return '<g class="mpin'+(on?' on':'')+'"'+(activeIdx!==null?' onclick="mapSelect('+i+')"':'')+' style="animation:none">'
      +'<circle cx="'+p.vx.toFixed(1)+'" cy="'+p.vy.toFixed(1)+'" r="'+r.toFixed(1)+'" style="animation:none"/>'
      +'<text x="'+p.vx.toFixed(1)+'" y="'+(p.vy+r*0.38).toFixed(1)+'" font-size="'+(on?fson:fs).toFixed(1)+'">'+p.n+'</text></g>';
  }).join('');
  return '<svg class="map-svg" viewBox="0 0 '+W+' '+H+'" fill="none" style="animation:none">'
    +'<rect width="'+W+'" height="'+H+'" fill="rgba(246,240,228,0.02)" rx="10" style="animation:none"/>'
    +'<g transform="translate('+offX.toFixed(1)+','+offY.toFixed(1)+') scale('+scale.toFixed(4)+')" style="animation:none">'
    +'<path d="'+geo.g.path+'" fill="'+hexA(accent,0.10)+'" stroke="'+hexA(accent,0.60)+'" stroke-width="'+(1.2/scale).toFixed(2)+'" stroke-linejoin="round" style="animation:none"/>'
    +(rp?'<path d="'+rp+'" stroke="'+hexA(accent,0.85)+'" stroke-width="'+(1.5/scale).toFixed(2)+'" stroke-dasharray="'+(4/scale).toFixed(1)+' '+(3/scale).toFixed(1)+'" fill="none" style="animation:none"/>':'')
    +pins+'</g></svg>';
}
function mapView(){
  var i=state.mapDay||0,p=(ITINERARY.plan||[])[i];
  var dest=ITINERARY.dest||ITINERARY.destination||'';
  var geo=_geoShapeSD(dest);
  var vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number),vbW=vbParts[2],vbH=vbParts[3];
  var W=345,H=420,scale=Math.min(W/vbW,H/vbH)*0.88;
  var offX=(W-vbW*scale)/2,offY=(H-vbH*scale)/2;
  var pts=_sdCityPts(ITINERARY.plan||[],geo),pin=pts[i]||{vx:vbW/2,vy:vbH/2};
  var pCx=offX+pin.vx*scale,pCy=offY+pin.vy*scale;
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
    +'<span class="map-rose">'+(typeof rose==='function'?rose(26,1.1):'')+'</span>'
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

/* ── 1 · Onboarding ─────────────────────────────────────────────────── */
function onboardingView(){
  return statusBar()
    + '<div class="onb"><div class="onb-rule"></div>'
    +   '<div class="onb-main">'
    +     '<span class="onb-kw">Hic Sunt</span>'
    +     '<h1 class="onb-h">Le monde,<br><em>sur-mesure</em></h1>'
    +     '<p class="onb-s">Des itinéraires composés pour vous, au-delà des sentiers connus. Cartographie, conciergerie, et un assistant qui ajuste tout en direct.</p>'
    +   '</div>'
    +   '<div class="onb-acts">'
    +     '<button class="btn" onclick="openOverlay(\'signup\', signupView())">Commencer</button>'
    +     '<button class="btn-ghost" onclick="openOverlay(\'login\', loginView())">J\'ai déjà un compte</button>'
    +     '<div class="dots"><i class="on"></i><i></i><i></i></div>'
    +   '</div>'
    + '</div>';
}

/* ── icône Google (réutilisée par signup/login) ─────────────────────── */
const GOOGLE_SVG = '<svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>';

/* ── 2 · Inscription ───────────────────────────────────────────────── */
function signupView(){
  return statusBar() + navbar('')
    + '<div class="ov-scroll px">'
    +   '<h1 class="login-h">Créer un compte.</h1>'
    +   '<p class="login-s">Rejoignez Hic Sunt pour composer vos voyages.</p>'
    +   '<button class="apple-btn" onclick="loginGoogle()" style="background:#fff;color:#1b1610;border:1px solid var(--line);gap:12px">'
    +     GOOGLE_SVG + 'Continuer avec Google</button>'
    +   '<div class="sep">ou</div>'
    +   '<div class="field"><label>Email</label><input class="input" type="email" id="authEmail" placeholder="charlotte@exemple.fr"></div>'
    +   '<div class="field"><label>Mot de passe</label><input class="input" type="password" id="authPassword" placeholder="8 caractères minimum"></div>'
    +   '<button class="btn" style="margin-top:6px" onclick="signupEmail()">Créer mon compte</button>'
    +   '<p class="login-link">Déjà un compte ? <b onclick="closeOverlay();openOverlay(\'login\', loginView())">Se connecter</b></p>'
    + '</div>';
}

/* ── 2bis · Connexion ───────────────────────────────────────────────── */
function loginView(){
  return statusBar() + navbar('')
    + '<div class="ov-scroll px">'
    +   '<h1 class="login-h">Bon retour.</h1>'
    +   '<p class="login-s">Connectez-vous pour accéder à vos itinéraires.</p>'
    +   '<button class="apple-btn" onclick="loginGoogle()" style="background:#fff;color:#1b1610;border:1px solid var(--line);gap:12px">'
    +     GOOGLE_SVG + 'Continuer avec Google</button>'
    +   '<div class="sep">ou</div>'
    +   '<div class="field"><label>Email</label><input class="input" type="email" id="authEmail" placeholder="charlotte@exemple.fr"></div>'
    +   '<div class="field"><label>Mot de passe</label><input class="input" type="password" id="authPassword" placeholder="••••••••"></div>'
    +   '<button class="btn" style="margin-top:6px" onclick="loginEmail()">Se connecter</button>'
    +   '<p class="login-link">Première fois ? <b onclick="closeOverlay();openOverlay(\'signup\', signupView())">Créer un compte</b></p>'
    + '</div>';
}
function loginDone(){ closeAllOverlays(); setTab('discover'); }

/* ── 2ter · Bienvenue — informations du voyageur ──────────────────────── */
function welcomeView(){
  return statusBar() + navbar('')
    + '<div class="ov-scroll px">'
    +   '<h1 class="login-h">Bienvenue.</h1>'
    +   '<p class="login-s">Quelques informations pour personnaliser votre expérience.</p>'
    +   '<div class="field"><label>Prénom</label><input class="input" type="text" id="wFirst" placeholder="Charlotte"></div>'
    +   '<div class="field"><label>Nom</label><input class="input" type="text" id="wLast" placeholder="Leroux"></div>'
    +   '<div class="field"><label>Date de naissance</label><input class="input" type="date" id="wBirth"></div>'
    +   '<div class="field"><label>Adresse</label><input class="input" type="text" id="wAddress" placeholder="12 rue de Rivoli, Paris"></div>'
    +   '<button class="btn" style="margin-top:6px" onclick="saveWelcomeProfile()">Continuer</button>'
    + '</div>';
}

/* ── 8 · Destination détail ─────────────────────────────────────────── */
/* rubans de saison par destination (score 0–3 par mois) */
const SEASONS_BY_DEST = {
  'Sri Lanka': [3,3,2,2,1,0,0,0,1,1,2,3],
  'Japon':     [1,1,3,3,3,1,0,0,2,3,3,1],
  'Maroc':     [2,2,3,3,2,1,0,0,2,3,3,2],
  'Portugal':  [0,1,1,2,3,3,3,3,3,2,1,0],
  'Islande':   [0,0,0,1,2,3,3,3,2,1,0,0],
  'Pérou':     [0,0,1,2,3,3,3,3,3,2,1,0],
  'Thaïlande': [3,3,2,1,0,0,0,0,0,1,3,3],
  'Kenya':     [2,2,1,0,0,1,3,3,3,3,1,2],
};
const MONTHS_FR = ['J','F','M','A','M','J','J','A','S','O','N','D'];

function destinationView(key){
  const d = DESTS[key];
  const scores = SEASONS_BY_DEST[key] || [1,1,1,2,2,2,2,2,2,1,1,1];
  const k = key.replace(/'/g, "\\'");
  return '<div class="dest-hero">'
    +   '<div class="wash" style="background:' + d.bg + '"></div>' + contour()
    +   '<div class="wm">' + ico(d.i, 132, 1) + '</div>'
    +   '<div class="veil"></div>'
    +   '<div class="navbar on-dark" style="position:absolute;top:0;left:0;right:0;z-index:10">'
    +     '<button class="nav-btn" style="background:rgba(0,0,0,0.35);border-color:rgba(255,255,255,0.2);color:#fff;backdrop-filter:blur(8px)" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +     '<button class="nav-btn" style="background:rgba(0,0,0,0.35);border-color:rgba(255,255,255,0.2);color:#fff;backdrop-filter:blur(8px)" onclick="toast(\'Lien copié\')" aria-label="Partager">' + ico('share',18,1.5) + '</button>'
    +   '</div>'
    +   '<div class="dest-cap"><span class="eyebrow">' + esc(d.r) + '</span><h1>' + esc(key) + '</h1>'
    +     '<div class="dest-pills"><span class="pill">' + esc(d.best) + '</span><span class="pill">Vol ' + esc(d.flight) + '</span></div></div>'
    + '</div>'
    + '<div class="ov-scroll has-foot px">'
    +   '<p class="lede">' + esc(d.lede) + '</p>'
    +   '<div class="info-grid">'
    +     '<div class="info-card"><div class="ic-l">Meilleure saison</div><div class="ic-v">' + esc(d.best) + '</div></div>'
    +     '<div class="info-card"><div class="ic-l">Vol direct</div><div class="ic-v">' + esc(d.flight) + '</div></div>'
    +   '</div>'
    +   '<div class="section-h"><h2>Points forts</h2></div>'
    +   d.highlights.map(function(h){
        return '<div class="hl">' + ico(h[0],20,1.5) + '<div><div class="h-t">' + esc(h[1]) + '</div><div class="h-d">' + esc(h[2]) + '</div></div></div>';
      }).join('')
    +   '<div class="section-h"><h2>Quand partir</h2><span class="meta">' + esc(d.best) + '</span></div>'
    +   '<div class="season">' + scores.map(function(s, i){
        return '<div class="m' + (s === 3 ? ' best' : '') + '"><i style="height:' + (10 + s * 14) + 'px"></i><span>' + MONTHS_FR[i] + '</span></div>';
      }).join('') + '</div>'
    +   '<p class="season-note">' + esc(d.tag) + ' — les meilleurs mois sont indiqués en or.</p>'
    + '</div>'
    + '<div class="ov-foot"><button class="btn" onclick="composeFromDest(\'' + k + '\')">' + ico('sparkle',18,1.7) + 'Composer un <em>voyage</em> ici</button></div>';
}

/* ── 5 · Génération (modal sombre) ──────────────────────────────────── */
function generationView(){
  const route = '<svg class="gen-route" viewBox="0 0 220 220" fill="none">'
    + '<path d="M34 176 Q66 120 96 132 T148 84 Q170 64 188 42"/>'
    + '<circle cx="34" cy="176" r="4"/><circle cx="96" cy="132" r="4"/><circle cx="148" cy="84" r="4"/><circle cx="188" cy="42" r="4"/></svg>';
  return '<div class="gen">' + statusBar(true)
    + '<div class="gen-body">'
    +   '<div class="gen-logo">Hic <em>Sunt</em></div>'
    +   '<div class="gen-map">' + graticule(220, 220, 40) + route + '</div>'
    +   '<p class="gen-status" data-gen-status>Lecture de vos envies…</p>'
    +   '<div class="gen-progress">'
    +     '<div class="gen-progress-track"><div class="gen-progress-fill" data-gen-bar style="width:2%;transition:none"></div></div>'
    +     '<div style="display:flex;align-items:center;gap:8px">'
    +     '<span class="gen-progress-pct" data-gen-pct>0%</span>'
    +     '<span class="gen-progress-time" data-gen-time>~16s</span>'
    +     '</div>'
    +   '</div>'
    + '</div></div>';
}

/* ── Suggestion de destination (mode "Surprenez-moi") ────────────────── */
function destinationSuggestView(s){
  return '<div class="gen suggest">' + statusBar(true)
    + '<div class="gen-body">'
    +   '<span class="eyebrow" style="color:var(--gold-soft)">Destination suggérée</span>'
    +   '<h1 class="sugg-dest">' + esc(s.dest||'') + '</h1>'
    +   '<p class="sugg-tag">' + esc(s.tagline||'') + '</p>'
    +   '<p class="sugg-teaser">' + esc(s.teaser||'') + '</p>'
    +   (s.coords?'<div class="sugg-coords">'+esc(s.coords)+'</div>':'')
    +   '<div class="sugg-acts">'
    +     '<button class="btn gold" onclick="confirmSuggestedDestination()">' + ico('sparkle',18,1.7) + 'Composer cet itinéraire</button>'
    +     '<button class="btn-ghost on-dark" onclick="retrySuggestion()">Proposer une autre destination</button>'
    +   '</div>'
    + '</div></div>';
}

/* ── gradients par type d'hébergement, teintés par la palette destination ── */
const ACC_TYPE_GRADIENT={
  wave:['#5B9FBE','#3d7a96'], droplet:['#E8A0A0','#c97a7a'], leaf:['#7BAE6E','#5a8a4f'],
  arch:['#C9965A','#a3753f'], peaks:['#9BA7B5','#6f7c8a'], bed:['#B07EB0','#8a5d8c'],
};
function accGradient(a, it){
  const palette = (it && it.palette) || null;
  const cat = palette ? (KIND_CATEGORY[a.i] || 'culture') : null;
  if(palette && cat && palette[cat]){
    const c = palette[cat];
    return 'linear-gradient(135deg, '+hexA(c,0.85)+', '+hexA(c,0.45)+'), linear-gradient(135deg,#1a1610,#2a2018)';
  }
  const g = ACC_TYPE_GRADIENT[a.i] || ['#9c7c44','#7a5f33'];
  return 'linear-gradient(135deg, '+g[0]+', '+g[1]+')';
}

/* ── liens d'affiliation ──────────────────────────────────────────────
   Pas de réservation directe : l'utilisateur est redirigé vers le
   partenaire (Booking.com ou Airbnb) avec le nom + ville pré-remplis.
   Remplacer AFFILIATE_TAGS par les vrais identifiants d'affiliation
   une fois les programmes Booking.com / Airbnb actifs. ── */
const AFFILIATE_TAGS = { booking:'', airbnb:'' };
function affiliateLink(a, platform){
  const it = ITINERARY;
  /* Nom de l'hébergement — encodé pour une recherche précise */
  const nameRaw  = a.n || '';
  const cityRaw  = a.loc || it.dest || '';
  const nameQ    = encodeURIComponent(nameRaw);
  const cityQ    = encodeURIComponent(cityRaw);
  /* Pour Booking : chercher "Nom de l'hébergement, Ville" */
  const fullQ    = encodeURIComponent(nameRaw + ', ' + cityRaw);
  const checkin  = it.dateFrom  || '';
  const checkout = it.dateTo    || '';
  const guests   = (typeof state !== 'undefined' && state.travelers) || 2;
  const affB     = typeof AFFILIATE_TAGS !== 'undefined' && AFFILIATE_TAGS.booking ? '&aid=' + AFFILIATE_TAGS.booking : '';
  const affA     = typeof AFFILIATE_TAGS !== 'undefined' && AFFILIATE_TAGS.airbnb  ? '?af=' + AFFILIATE_TAGS.airbnb  : '';

  const isAirbnb = /villa|appartement|apparthotel|maison|airbnb|guesthouse|gîte|loft/.test((a.type||'').toLowerCase());

  /* Booking.com — recherche par nom exact + ville, dates, voyageurs */
  const bookingUrl = 'https://www.booking.com/searchresults.html'
    + '?ss=' + fullQ
    + '&lang=fr'
    + (checkin  ? '&checkin='  + checkin  : '')
    + (checkout ? '&checkout=' + checkout : '')
    + '&group_adults=' + guests + '&no_rooms=1'
    + '&sb_travel_purpose=leisure'
    + affB;

  /* Airbnb — recherche dans la ville avec le nom en query */
  const airbnbUrl = 'https://www.airbnb.fr/s/' + cityQ + '/homes'
    + '?query=' + nameQ
    + '&adults=' + guests
    + (checkin  ? '&checkin='  + checkin  : '')
    + (checkout ? '&checkout=' + checkout : '');

  /* Hotels.com — recherche par nom + ville */
  const hotelsUrl = 'https://fr.hotels.com/search.do'
    + '?q-destination=' + fullQ
    + '&q-rooms=1&q-room-0-adults=' + guests
    + (checkin  ? '&q-check-in='  + checkin  : '')
    + (checkout ? '&q-check-out=' + checkout : '');

  if (platform === 'airbnb' || isAirbnb) return airbnbUrl;
  if (platform === 'hotels') return hotelsUrl;
  return bookingUrl;
}
function openAffiliate(accId){
  const a = _accById(accId);
  if(!a) return;
  window.open(affiliateLink(a), '_blank');
}

/* ── composant accCard ──────────────────────────────────────────────── */
function accThemeAccent(a, it){
  const palette = (it && it.palette) || null;
  const cat = palette ? (KIND_CATEGORY[a.i] || 'culture') : null;
  return (palette && cat && palette[cat]) ? palette[cat] : '#9c7c44';
}
function accCard(a){
  const it = ITINERARY;
  const accent = accThemeAccent(a, it);
  const price = Number(a.price)||0;
  const nights = Number(a.nights)||1;
  const rate = a.rate||'';
  const rateNum = rate ? parseFloat(rate.replace(',','.')) : 0;

  /* Nom propre : si a.n est vide ou un simple numéro, tenter d'extraire
     le vrai nom depuis le blurb (souvent "Nom — description"), sinon fallback. */
  var dispName = (a.n||'').trim();
  if(!dispName || /^\d+$/.test(dispName)){
    var fromBlurb = (a.blurb||'').split(/[—–\-,]/)[0].trim();
    dispName = (fromBlurb && fromBlurb.length>2 && !/^\d+$/.test(fromBlurb)) ? fromBlurb : (a.type||'Hébergement');
  }

  /* Étoiles de notation */
  function stars(n){
    const full = Math.floor(n), half = n%1>=0.3?1:0;
    let s='';
    for(var i=0;i<full;i++) s+='<span style="color:var(--gold)">★</span>';
    if(half) s+='<span style="color:var(--gold);opacity:0.5">★</span>';
    return s;
  }

  /* Couleur de fond selon type */
  const typeLower=(a.type||'').toLowerCase();
  const bgColor = /villa|luxe|relais|palace/.test(typeLower) ? hexA(accent,0.10)
    : /resort|boutique/.test(typeLower) ? hexA(accent,0.07)
    : 'var(--surface)';

  return '<div class="acc" onclick="openBooking(\'' + a.id + '\')" style="background:var(--surface-raised,#fff);border:1px solid var(--line);border-radius:18px;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent">'
    /* Header coloré avec icône */
    + '<div style="background:'+bgColor+';padding:20px 20px 16px;display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid var(--line2)">'
    +   '<div style="flex:1;min-width:0">'
    +     '<div style="font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:'+accent+';margin-bottom:6px">' + esc(a.type||'Hébergement') + '</div>'
    +     '<div style="font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink);line-height:1.2;margin-bottom:4px">' + esc(dispName) + '</div>'
    +     '<div style="font-family:var(--mono);font-size:9.5px;letter-spacing:0.5px;text-transform:uppercase;color:var(--sub)">' + esc(a.loc||'') + '</div>'
    +   '</div>'
    +   '<div style="width:48px;height:48px;border-radius:14px;background:'+hexA(accent,0.14)+';display:flex;align-items:center;justify-content:center;flex:none;margin-left:12px;color:'+accent+'">' + ico(a.i||'bed', 22, 1.3) + '</div>'
    + '</div>'
    /* Body — prix + étoiles + nuits */
    + '<div style="padding:14px 20px;display:flex;align-items:center;justify-content:space-between">'
    +   '<div>'
    +     '<div style="font-family:var(--serif);font-size:22px;font-weight:600;color:var(--ink);letter-spacing:-0.3px">' + eur(price) + '<span style="font-size:13px;font-weight:400;color:var(--sub);margin-left:3px">/ nuit</span></div>'
    +     '<div style="font-size:12px;color:var(--sub);margin-top:2px">' + nights + ' nuit' + (nights>1?'s':'') + (a.blurb?' · '+esc(a.blurb.slice(0,32)):'') + '</div>'
    +   '</div>'
    +   '<div style="text-align:right">'
    +     (rateNum>0 ? '<div style="font-size:13px;line-height:1">'+stars(rateNum)+'</div><div style="font-family:var(--mono);font-size:9px;font-weight:700;color:var(--sub);margin-top:3px">'+esc(rate)+'</div>' : '')
    +   '</div>'
    + '</div>'
    /* Footer CTA — handler explicite pour fiabilité */
    + '<div onclick="event.stopPropagation();openBooking(\'' + a.id + '\')" style="margin:0 16px 14px;background:var(--ink);border-radius:12px;padding:11px 16px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer">'
    +   '<span style="font-family:var(--sans);font-size:13px;font-weight:600;color:var(--bg)">Voir les disponibilités</span>'
    +   '<span style="color:var(--bg);opacity:0.7">' + ico('chevron',12,1.5) + '</span>'
    + '</div>'
    + '</div>';
}

/* ── 6 · Itinéraire ─────────────────────────────────────────────────── */
function itineraryView(){
  const it = ITINERARY;
  const wx1 = it.plan[0] ? it.plan[0].wx : ['sun','30°'];

  const palette = it.palette || {};
  const theme = it.theme || 'mediterranean';
  const SIG = {
    mediterranean: { c1: palette.beach   || '#3A9EC9', c2: palette.food    || '#D44A2A', bg:'#0D1A24', motif:'waves' },
    desert:        { c1: palette.culture || '#D4943A', c2: palette.food    || '#D4522A', bg:'#1A1008', motif:'dunes' },
    alpine:        { c1: palette.hike    || '#3A9E7E', c2: palette.outdoor || '#4ABECE', bg:'#0A1614', motif:'peaks' },
    tropical:      { c1: palette.food    || '#E87A4A', c2: palette.hike    || '#2D9E6B', bg:'#0C160E', motif:'jungle' },
    tropical_io:   { c1: palette.beach   || '#4AC8E0', c2: palette.spa     || '#E87A9A', bg:'#081820', motif:'waves' },
    steppe:        { c1: palette.beach   || '#5A8AAA', c2: palette.hike    || '#7A9E8A', bg:'#0C1218', motif:'steppe' },
    andean:        { c1: palette.culture || '#C0A040', c2: palette.hike    || '#8A6A3A', bg:'#100E08', motif:'peaks' },
    urban_asia:    { c1: palette.culture || '#C040A0', c2: palette.food    || '#E05030', bg:'#0C0818', motif:'grid' },
    urban:         { c1: palette.culture || '#7A65D4', c2: palette.food    || '#D4854A', bg:'#100E18', motif:'grid' },
    savanna:       { c1: palette.outdoor || '#A0C840', c2: palette.culture || '#B07030', bg:'#100E04', motif:'savanna' },
    caribbean:     { c1: palette.beach   || '#30C0C0', c2: palette.food    || '#E0A030', bg:'#081C18', motif:'waves' },
  };
  const sig = SIG[theme] || SIG.tropical;
  const c1 = sig.c1, c2 = sig.c2, heroBg = sig.bg;

  /* ── Motifs SVG par thème ── */
  function heroMotif(motif, c1, c2){
    const op = 'opacity:0.18;';
    if(motif==='waves') return '<svg style="position:absolute;inset:0;width:100%;height:100%;'+op+'" viewBox="0 0 390 260" preserveAspectRatio="none" fill="none">'
      +'<path d="M0 80 Q48 60 97 80 T195 80 T293 80 T390 80" stroke="'+c1+'" stroke-width="1.2"/>'
      +'<path d="M0 110 Q48 90 97 110 T195 110 T293 110 T390 110" stroke="'+c1+'" stroke-width="0.8"/>'
      +'<path d="M0 140 Q48 120 97 140 T195 140 T293 140 T390 140" stroke="'+c2+'" stroke-width="1"/>'
      +'<path d="M0 170 Q65 150 130 170 T260 170 T390 170" stroke="'+c2+'" stroke-width="0.6"/>'
      +'<circle cx="320" cy="50" r="60" stroke="'+c1+'" stroke-width="0.5"/>'
      +'<circle cx="320" cy="50" r="38" stroke="'+c1+'" stroke-width="0.4"/>'
      +'</svg>';
    if(motif==='dunes') return '<svg style="position:absolute;inset:0;width:100%;height:100%;'+op+'" viewBox="0 0 390 260" preserveAspectRatio="none" fill="none">'
      +'<path d="M-10 200 Q80 140 180 180 T390 170" stroke="'+c1+'" stroke-width="1.5"/>'
      +'<path d="M-10 220 Q100 165 200 200 T390 190" stroke="'+c2+'" stroke-width="1"/>'
      +'<path d="M-10 240 Q120 185 220 215 T390 210" stroke="'+c1+'" stroke-width="0.7"/>'
      +'<circle cx="300" cy="45" r="48" stroke="'+c2+'" stroke-width="0.8"/>'
      +'<line x1="0" y1="260" x2="390" y2="100" stroke="'+c1+'" stroke-width="0.4" stroke-dasharray="4 8"/>'
      +'</svg>';
    if(motif==='peaks') return '<svg style="position:absolute;inset:0;width:100%;height:100%;'+op+'" viewBox="0 0 390 260" preserveAspectRatio="none" fill="none">'
      +'<polyline points="0,260 60,120 120,180 190,60 260,150 320,80 390,130 390,260" stroke="'+c1+'" stroke-width="1.2"/>'
      +'<polyline points="0,260 80,160 150,200 230,100 300,160 390,100 390,260" stroke="'+c2+'" stroke-width="0.7" opacity="0.6"/>'
      +'<line x1="0" y1="220" x2="390" y2="220" stroke="'+c1+'" stroke-width="0.4"/>'
      +'</svg>';
    if(motif==='jungle') return '<svg style="position:absolute;inset:0;width:100%;height:100%;'+op+'" viewBox="0 0 390 260" preserveAspectRatio="none" fill="none">'
      +'<path d="M40 260 Q30 180 60 120 Q80 80 70 20" stroke="'+c1+'" stroke-width="1.2"/>'
      +'<path d="M70 20 Q120 60 60 120" stroke="'+c1+'" stroke-width="0.8"/>'
      +'<path d="M70 20 Q20 50 60 120" stroke="'+c1+'" stroke-width="0.8"/>'
      +'<path d="M140 260 Q130 200 155 140 Q175 100 165 30" stroke="'+c2+'" stroke-width="1"/>'
      +'<path d="M165 30 Q210 70 155 140" stroke="'+c2+'" stroke-width="0.7"/>'
      +'<path d="M165 30 Q120 65 155 140" stroke="'+c2+'" stroke-width="0.7"/>'
      +'<path d="M280 260 Q270 190 300 130 Q320 85 310 15" stroke="'+c1+'" stroke-width="1.1"/>'
      +'<path d="M310 15 Q350 55 300 130" stroke="'+c1+'" stroke-width="0.7"/>'
      +'<path d="M310 15 Q265 50 300 130" stroke="'+c1+'" stroke-width="0.7"/>'
      +'</svg>';
    if(motif==='grid') return '<svg style="position:absolute;inset:0;width:100%;height:100%;'+op+'" viewBox="0 0 390 260" preserveAspectRatio="none" fill="none">'
      +[0,1,2,3,4,5,6].map(function(i){ return '<line x1="'+(i*65)+'" y1="0" x2="'+(i*65)+'" y2="260" stroke="'+c1+'" stroke-width="0.4"/>'; }).join('')
      +[0,1,2,3,4].map(function(i){ return '<line x1="0" y1="'+(i*65)+'" x2="390" y2="'+(i*65)+'" stroke="'+c1+'" stroke-width="0.4"/>'; }).join('')
      +'<rect x="280" y="20" width="80" height="80" stroke="'+c2+'" stroke-width="1.2"/>'
      +'<rect x="295" y="35" width="50" height="50" stroke="'+c2+'" stroke-width="0.6"/>'
      +'</svg>';
    if(motif==='savanna') return '<svg style="position:absolute;inset:0;width:100%;height:100%;'+op+'" viewBox="0 0 390 260" preserveAspectRatio="none" fill="none">'
      +'<line x1="0" y1="190" x2="390" y2="190" stroke="'+c1+'" stroke-width="1"/>'
      +'<path d="M60 190 Q65 150 70 100 Q72 75 68 50" stroke="'+c2+'" stroke-width="1.5"/>'
      +'<path d="M68 50 Q55 75 70 100" stroke="'+c2+'" stroke-width="1.2"/><path d="M68 50 Q80 72 70 100" stroke="'+c2+'" stroke-width="1.2"/>'
      +'<path d="M200 190 Q205 160 210 120 Q212 95 208 70" stroke="'+c1+'" stroke-width="1.2"/>'
      +'<path d="M208 70 Q195 92 210 120" stroke="'+c1+'" stroke-width="1"/><path d="M208 70 Q220 90 210 120" stroke="'+c1+'" stroke-width="1"/>'
      +'<circle cx="310" cy="45" r="36" stroke="'+c2+'" stroke-width="1"/>'
      +'</svg>';
    /* steppe — default */
    return '<svg style="position:absolute;inset:0;width:100%;height:100%;'+op+'" viewBox="0 0 390 260" preserveAspectRatio="none" fill="none">'
      +'<path d="M0 180 Q100 160 200 175 T390 165" stroke="'+c1+'" stroke-width="1"/>'
      +'<path d="M0 200 Q130 180 260 195 T390 185" stroke="'+c2+'" stroke-width="0.7"/>'
      +'<circle cx="300" cy="55" r="42" stroke="'+c1+'" stroke-width="0.8"/>'
      +'</svg>';
  }

  /* ── Hero label thématique ── */
  const THEME_LABEL = {
    mediterranean:'Méditerranée', desert:'Désert', alpine:'Montagne', tropical:'Tropiques',
    tropical_io:'Océan Indien', steppe:'Grand Nord', andean:'Andes', urban_asia:'Asie urbaine',
    urban:'Métropole', savanna:'Savane', caribbean:'Caraïbes',
  };
  const themeLabel = THEME_LABEL[theme] || 'Sur-mesure';

  const minimapBg = 'linear-gradient(135deg,' + hexA(c1,0.09) + ' 0%,' + hexA(c2,0.05) + ' 100%),var(--surface)';
  const nDays = it.plan && it.plan.length ? it.plan.length : _days(it);

  /* statusBar intégré dans le hero pour que tout le fond sombre couvre
     y compris la zone de la status bar */
  return '<div style="position:relative;overflow:hidden;background:'+heroBg+';padding:0 0 28px">'
    +   statusBar(true)   /* true = texte clair pour fond sombre */
    +   heroMotif(sig.motif, c1, c2)
    +   '<div style="position:absolute;bottom:0;left:0;right:0;height:60px;background:linear-gradient(to bottom,transparent,'+heroBg+')"></div>'
    +   '<div style="position:relative;z-index:2">'
    +     '<div class="navbar" style="background:transparent">'
    +       '<button class="nav-btn" style="color:rgba(246,240,228,0.85)" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +       '<button class="nav-btn" style="color:rgba(246,240,228,0.85)" onclick="openOverlay(\'share\', shareView())" aria-label="Partager">' + ico('share',18,1.5) + '</button>'
    +     '</div>'
    +     '<div style="padding:8px 20px 0">'
    +       '<span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:'+c1+';display:block;margin-bottom:10px">Itinéraire · '+esc(themeLabel)+'</span>'
    +       '<h1 style="font-family:var(--serif);font-weight:600;font-size:42px;letter-spacing:-1px;color:#F6F0E4;line-height:1.04;margin:0 0 8px">' + esc(it.dest) + '</h1>'
    +       '<p style="font-family:var(--serif);font-style:italic;font-size:15px;color:rgba(246,240,228,0.7);line-height:1.5;margin:0 0 16px">' + esc(it.tag) + '</p>'
    +       '<div style="display:flex;flex-wrap:wrap;gap:7px">'
    +         '<span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;padding:6px 13px;border-radius:20px;border:1px solid '+hexA(c1,0.4)+';color:'+c1+';background:'+hexA(c1,0.1)+'">' + esc(it.dates) + '</span>'
    +         '<span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;padding:6px 13px;border-radius:20px;border:1px solid rgba(246,240,228,0.2);color:rgba(246,240,228,0.8)">' + nDays + ' jours</span>'
    +         '<span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;padding:6px 13px;border-radius:20px;border:1px solid rgba(246,240,228,0.2);color:rgba(246,240,228,0.8)">' + esc(it.level) + '</span>'
    +       '</div>'
    +     '</div>'
    +   '</div>'
    + '</div>'
    + '<div class="ov-scroll has-foot px" style="padding-top:16px">'
    +   '<div class="minimap" style="background:'+minimapBg+'" onclick="openMapOv()">' + geoMapSVG(345, 188, null) + wxChip(wx1[0], wx1[1])
    +     '<span class="mm-cap">' + esc(it.coords || it.dest) + ' · ' + esc(it.distance || '') + '</span></div>'
    +   '<div class="tools">'
    +     '<button class="tool" onclick="openOverlay(\'budget\', budgetView())">' + ico('wallet',20,1.5) + '<div class="tl-t">Budget</div><div class="tl-s">' + eur(it.budgetTotal) + ' · estimation</div></button>'
    +     '<button class="tool" onclick="openActivities()">' + ico('ticket',20,1.5) + '<div class="tl-t">Activités</div><div class="tl-s">' + ACTIVITIES.length + ' expériences</div></button>'
    +     (it.generated
      ? '<button class="tool" onclick="openOverlay(\'gems\', gemsView())">' + ico('star',18,1.5) + '<div class="tl-t">Pépites</div><div class="tl-s">' + ((it.gems||[]).length) + ' adresses secrètes</div></button>'
        + '<button class="tool" onclick="openOverlay(\'share\', shareView())">' + ico('share',19,1.5) + '<div class="tl-t">Partager</div><div class="tl-s">Copier le lien</div></button>'
      : '<button class="tool" onclick="openOverlay(\'share\', shareView())">' + ico('share',19,1.5) + '<div class="tl-t">Partager</div><div class="tl-s">Copier le lien</div></button>'
        + '<button class="tool" onclick="openOverlay(\'gems\', gemsView())">' + ico('star',18,1.5) + '<div class="tl-t">Pépites</div><div class="tl-s">' + ((it.gems||[]).length) + ' adresses</div></button>')
    +   '</div>'
    +   '<div class="ai-banner" onclick="openAI()" style="border-color:'+hexA(c1,0.28)+';background:'+hexA(c1,0.06)+'">'
    +     '<span class="ai-av" style="background:'+hexA(c1,0.15)+';color:'+c1+'">' + ico('sparkle',22,1.6) + '</span>'
    +     '<span><span class="ab-k">Cartographe · assistant</span><br><span class="ab-t">Modifier l\'itinéraire</span></span>'
    +     '<span class="ico chev">' + ico('chevron',20,1.7) + '</span>'
    +   '</div>'
    +   '<div class="section-h"><h2>Jour par jour</h2><span class="meta">' + nDays + ' jours</span></div>'
    +   it.plan.map(function(p, i){
      if(!p) return '';
      const catColor = (palette[p.category]) || c1;
      const tags = Array.isArray(p.tags) ? p.tags : [];
      const wx = Array.isArray(p.wx) ? p.wx : ['sun','—'];
      return '<div class="dayrow" onclick="openDay(' + i + ')">'
        + '<div class="dr-rail"><span class="dr-pin" style="background:'+catColor+';border-color:'+catColor+'">' + p.n + '</span><span class="dr-line" style="background:'+hexA(catColor,0.2)+'"></span></div>'
        + '<div class="dr-main"><div class="dr-top"><div><div class="dr-t">' + esc(p.title||'') + '</div><div class="dr-l">' + esc(p.loc||'') + '</div></div>'
        + wxChip(wx[0], wx[1]) + '</div>'
        + '<div class="dr-d">' + esc(p.desc||'') + '</div>'
        + '<div class="dr-tags">' + tags.map(function(t){ return '<span class="mini-tag" style="color:'+catColor+';border-color:'+hexA(catColor,0.3)+';background:'+hexA(catColor,0.08)+'">' + ico(t[0],12,1.7) + t[1] + '</span>'; }).join('') + '</div>'
        + '</div></div>';
    }).join('')
    +   '<div class="section-h"><h2>Hébergements</h2><span class="meta">' + it.accommodations.length + ' étapes</span></div>'
    +   it.accommodations.map(accCard).join('')
    + '</div>'
    + '<div class="ov-foot"><div class="foot-price">'
    +   '<div><div class="fp-v">' + eur(it.budgetTotal) + '</div><div class="fp-l">tout compris · ' + travelerLabel() + '</div></div>'
    +   '<div class="foot-actions">'
    +     '<button class="fa-btn" onclick="saveItinerary()" aria-label="Enregistrer"><span>' + ico('bookmark',20,1.6) + '</span><i>Garder</i></button>'
    +     '<button class="fa-btn" onclick="window.triggerPDF&&window.triggerPDF()" aria-label="Exporter"><span>' + ico('doc',20,1.6) + '</span><i>PDF</i></button>'
    +   '</div>'
    + '</div></div>';
}

/* ── 7 · Détail d'un jour ───────────────────────────────────────────── */
function dayDetailView(idx){
  const it = ITINERARY;
  const p = it.plan[idx];
  if (!p) return statusBar() + navbar('Jour');
  const num = 'Jour ' + String(p.n).padStart(2,'0');
  const palette = it.palette || {};
  const theme = it.theme || 'mediterranean';

  /* Couleur principale du jour = couleur de sa catégorie */
  const catColor = (p.category && palette[p.category]) || '#9c7c44';
  const catLabel = (typeof CATEGORY_LABELS !== 'undefined' && p.category && CATEGORY_LABELS[p.category]) || '';

  /* Couleur secondaire = catégorie du moment dominant différente */
  const categories = (p.moments||[]).map(function(m){
    var k = Array.isArray(m) ? m[1] : (m && m.k);
    return (typeof KIND_CATEGORY!=='undefined' && k && KIND_CATEGORY[k]) || 'culture';
  });
  const secCat = categories.find(function(c){ return c !== p.category && c !== 'transit'; }) || p.category || 'culture';
  const secColor = (secCat && palette[secCat]) || catColor;

  /* Fond sombre du hero du jour, légèrement différent du hero principal */
  const DAY_BG = {
    mediterranean:'#0A1520', desert:'#160E06', alpine:'#081410', tropical:'#0A1409',
    tropical_io:'#061620', steppe:'#0A1018', andean:'#0E0C06', urban_asia:'#0A0616',
    urban:'#0C0A16', savanna:'#0E0C04', caribbean:'#061814',
  };
  const heroBg = DAY_BG[theme] || '#0A1020';

  let nightHTML = '';
  if (p.night && p.night.acc){
    let found = null;
    for (let i = 0; i < it.accommodations.length; i++) if (it.accommodations[i].id === p.night.acc) found = it.accommodations[i];
    nightHTML = found ? accCard(found)
      : '<div class="row"><span class="r-ico">' + ico('bed',20,1.5) + '</span><div class="r-main"><div class="r-t">Nuit sur place</div></div></div>';
  } else if (p.night){
    nightHTML = '<div class="row" style="cursor:default"><span class="r-ico">' + ico('bed',20,1.5) + '</span>'
      + '<div class="r-main"><div class="r-t">' + esc(p.night.n) + '</div><div class="r-s">' + esc(p.night.loc) + '</div></div></div>';
  }
  const prev = idx > 0
    ? '<button class="btn-ghost" onclick="swapDay(' + (idx-1) + ')">' + ico('back',16,1.8) + 'Jour ' + idx + '</button>' : '';
  const next = idx < it.plan.length - 1
    ? '<button class="btn" onclick="swapDay(' + (idx+1) + ')">Jour ' + (idx+2) + ico('chevron',16,1.8) + '</button>'
    : '<button class="btn" onclick="closeOverlay()">Retour à l\'itinéraire</button>';

  const restaurantHTML = p.restaurant ? '<div class="section-h"><h2>À table</h2></div>'
    + '<div class="row" style="cursor:default;align-items:flex-start"><span class="r-ico" style="color:'+catColor+'">' + ico('fork',19,1.5) + '</span>'
    + '<div class="r-main"><div class="r-t"><a href="https://www.google.com/search?q='+encodeURIComponent((p.restaurant.name||'')+' '+(p.loc||ITINERARY.dest||'')+' restaurant')+'" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:5px">' + esc(p.restaurant.name||'') + '<span style="color:'+catColor+';display:inline-flex;flex:none">'+ico('external',11,1.6)+'</span></a>' + (p.restaurant.rating?' <span style="font-size:11px;font-weight:400;color:'+catColor+'">'+esc(p.restaurant.rating)+'</span>':'') + '</div>'
    + '<div class="r-s">' + esc(p.restaurant.type||'') + (p.restaurant.price?' · '+esc(p.restaurant.price):'') + '</div>'
    + (p.restaurant.note?'<div class="r-s" style="margin-top:2px;font-style:italic">'+esc(p.restaurant.note)+'</div>':'')
    + (p.restaurant.review?'<div class="r-s" style="margin-top:4px;color:var(--sub);font-size:11px">"'+esc(p.restaurant.review)+'"</div>':'')
    + '</div></div>' : '';

  const wellnessHTML = p.wellness ? '<div class="section-h"><h2>Bien-être</h2></div>'
    + '<div class="row" style="cursor:default;align-items:flex-start"><span class="r-ico" style="color:'+(palette.spa||catColor)+'">' + ico('droplet',19,1.5) + '</span>'
    + '<div class="r-main"><div class="r-t">' + esc(p.wellness.name||'') + '</div>'
    + '<div class="r-s">' + esc(p.wellness.type||'') + (p.wellness.price?' · '+esc(p.wellness.price):'') + '</div>'
    + (p.wellness.note?'<div class="r-s" style="margin-top:2px;font-style:italic">'+esc(p.wellness.note)+'</div>':'')
    + '</div></div>' : '';

  const tipHTML = p.tip ? '<div style="border-left:3px solid '+catColor+';background:'+hexA(catColor,0.07)+';border-radius:0 10px 10px 0;padding:12px 16px;margin-top:16px;margin-bottom:4px">'
    + '<span style="color:'+catColor+';font-family:var(--mono);font-weight:700;font-style:normal;text-transform:uppercase;letter-spacing:.1em;font-size:9px;display:block;margin-bottom:5px">Conseil d\'initié</span>'
    + '<span style="font-size:13.5px;font-style:italic;color:var(--ink);line-height:1.5">'+esc(p.tip)+'</span></div>' : '';

  /* Hero du jour */
  const wxBadge = p.wx && p.wx[0] ? wxChip(p.wx[0], p.wx[1]) : '';

  return /* Hero thématique du jour */
    '<div style="position:relative;overflow:hidden;background:'+heroBg+';padding-bottom:24px">'
    + statusBar(true)
    + '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 80% 20%,'+hexA(catColor,0.20)+',transparent 65%),radial-gradient(ellipse at 20% 80%,'+hexA(secColor,0.12)+',transparent 50%)"></div>'
    + '<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.10" viewBox="0 0 390 180" preserveAspectRatio="none" fill="none">'
    +   [0,1,2,3,4,5,6].map(function(i){ return '<line x1="'+(i*65)+'" y1="0" x2="'+(i*65)+'" y2="180" stroke="'+catColor+'" stroke-width="0.5"/>'; }).join('')
    +   [0,1,2,3].map(function(i){ return '<line x1="0" y1="'+(i*60)+'" x2="390" y2="'+(i*60)+'" stroke="'+catColor+'" stroke-width="0.5"/>'; }).join('')
    + '</svg>'
    + '<div style="position:absolute;bottom:0;left:0;right:0;height:40px;background:linear-gradient(to bottom,transparent,'+heroBg+')"></div>'
    + '<div style="position:relative;z-index:2">'
    +   '<div class="navbar" style="background:transparent">'
    +     '<button class="nav-btn" style="color:rgba(246,240,228,0.85)" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +     (idx < it.plan.length-1
          ? '<button class="nav-btn" style="color:rgba(246,240,228,0.85)" onclick="swapDay('+(idx+1)+')" aria-label="Suivant">'+ico('chevron',20,1.7)+'</button>'
          : '<span class="nav-spacer"></span>')
    +   '</div>'
    +   '<div style="padding:4px 20px 0">'
    +     '<span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:'+catColor+';display:block;margin-bottom:8px">'
    +       num + (catLabel ? ' · ' + catLabel : '') + ' · ' + esc(p.loc)
    +     '</span>'
    +     '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;color:#F6F0E4;line-height:1.12;margin:0 0 10px">' + esc(p.title) + '</h1>'
    +     '<div style="display:flex;align-items:center;gap:8px">'
    +       (p.wx && p.wx[1] ? '<span style="font-family:var(--mono);font-size:10px;color:rgba(246,240,228,0.7)">'+esc(p.wx[1])+'</span>' : '')
    +       '<span style="font-family:var(--mono);font-size:9px;padding:4px 10px;border-radius:12px;border:1px solid '+hexA(catColor,0.4)+';color:'+catColor+';background:'+hexA(catColor,0.12)+'">'+(catLabel||'Découverte')+'</span>'
    +     '</div>'
    +   '</div>'
    + '</div>'
    + '</div>'
    /* Corps scrollable */
    + '<div class="ov-scroll has-foot px" style="padding-top:16px">'
    +   '<p style="font-size:15px;color:var(--ink);line-height:1.65;font-family:var(--serif);font-style:italic;margin:0 0 4px">' + esc(p.desc) + '</p>'
    +   tipHTML
    +   '<div class="section-h" style="margin-top:20px"><h2>Le programme</h2><span class="meta">' + p.moments.length + ' moments</span></div>'
    +   p.moments.map(function(m){
        /* Support des deux formats : tableau [t,k,ti,d] et objet {t,k,ti,d} */
        var mt = Array.isArray(m) ? m[0] : (m && m.t) || '—';
        var mk = Array.isArray(m) ? m[1] : (m && m.k) || 'pin';
        var mti = Array.isArray(m) ? m[2] : (m && m.ti) || '';
        var md = Array.isArray(m) ? m[3] : (m && m.d) || '';
        var mCat = (typeof KIND_CATEGORY!=='undefined' && mk && KIND_CATEGORY[mk]) || 'culture';
        var mColor = (mCat && palette[mCat]) || catColor;
        return '<div class="moment">'
          + '<span class="mo-t">' + esc(mt) + '</span>'
          + '<span class="mo-i" style="color:'+mColor+'">' + ico(mk,15,1.6) + '</span>'
          + '<div><div class="mo-ti">' + esc(mti) + '</div>' + (md ? '<div class="mo-d">' + esc(md) + '</div>' : '') + '</div>'
          + '</div>';
      }).join('')
    +   restaurantHTML
    +   wellnessHTML
    +   '<div class="section-h"><h2>La nuit</h2></div>' + nightHTML
    + '</div>'
    + '<div class="ov-foot"><div class="day-nav">' + prev + next + '</div></div>';
}
function swapDay(idx){
  const el = ovStack[ovStack.length - 1];
  if (el && el.dataset.ov === 'day'){ el.innerHTML = dayDetailView(idx); }
  else openDay(idx);
}

/* ── 9 · Réservation ────────────────────────────────────────────────── */
let _bookId = null;
function _accById(id){
  for (let i = 0; i < ITINERARY.accommodations.length; i++)
    if (ITINERARY.accommodations[i].id === id) return ITINERARY.accommodations[i];
  return ITINERARY.accommodations[0];
}
function bookingView(accId){
  _bookId = accId;
  const a = _accById(accId);
  const total = a.price * a.nights;
  const accent = accThemeAccent(a, ITINERARY);
  const isAirbnb = /villa|appartement|apparthotel|maison|airbnb|guesthouse|gîte|loft/.test((a.type||'').toLowerCase());
  return '<div class="book-hero" style="position:relative;overflow:hidden;height:245px;background:radial-gradient(120% 100% at 15% 0%,'+hexA(accent,0.28)+',transparent 60%),linear-gradient(155deg,#1c1812,#0d0b08 55%,#000)">'
    +   '<svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 393 280" preserveAspectRatio="none" fill="none" stroke="'+hexA(accent,0.4)+'" stroke-width="0.5">'
    +     [0,1,2,3,4,5,6].map(function(i){ return '<line x1="'+(i*65.5)+'" y1="0" x2="'+(i*65.5)+'" y2="280"/>'; }).join('')
    +     [0,1,2,3,4,5,6].map(function(i){ return '<line x1="0" y1="'+(i*46.6)+'" x2="393" y2="'+(i*46.6)+'"/>'; }).join('')
    +   '</svg>'
    +   '<span style="position:absolute;bottom:20px;right:24px;z-index:1;color:'+hexA(accent,0.9)+';display:flex;opacity:0.95">' + ico(a.i, 32, 1.3) + '</span>'
    +   '<span style="position:absolute;left:24px;right:24px;bottom:19px;height:1px;z-index:0;background:'+hexA(accent,0.25)+'"></span>'
    +   '<div class="navbar" style="position:absolute;top:54px;left:0;right:0;z-index:1"><button class="nav-btn" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +   '<button class="nav-btn" onclick="this.classList.toggle(\'on\');" aria-label="Favori">' + ico('heart',18,1.6) + '</button></div>'
    + '</div>'
    + '<div class="ov-scroll has-foot px">'
    +   '<span class="eyebrow" style="display:block;margin-top:16px">' + esc(a.tag) + '</span>'
    +   '<div class="book-h"><a href="https://www.google.com/search?q='+encodeURIComponent((a.n||'')+' '+(a.loc||''))+'" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:6px">' + esc(a.n) + '<span style="color:var(--gold);display:inline-flex;flex:none">'+ico('external',15,1.6)+'</span></a><span class="a-rate" style="font-family:var(--mono);font-size:11px;display:inline-flex;align-items:center;gap:4px">' + ico('star',12) + a.rate + '</span></div>'
    +   '<div class="book-meta">' + esc(a.type) + ' · ' + esc(a.loc) + '</div>'
    +   '<p class="book-desc">' + esc(a.blurb) + '</p>'
    +   '<div class="chips" style="margin-top:16px">' + a.am.map(function(k){
        return '<span class="chip" style="cursor:default">' + ico(k,14,1.6) + (AM_LABEL[k] || k) + '</span>';
      }).join('') + '</div>'
    +   '<div class="section-h"><h2>Votre séjour</h2></div>'
    +   '<div class="stay-row">' + ico('cal',18,1.5) + '<span class="sr-l">' + esc(ITINERARY.dates) + '</span><span class="sr-v">' + a.nights + ' nuit' + (a.nights>1?'s':'') + '</span></div>'
    +   '<div class="stay-row">' + ico('users',18,1.5) + '<span class="sr-l">Voyageurs</span><span class="sr-v">' + travelerLabel() + '</span></div>'
    +   '<div class="section-h"><h2>Estimation</h2></div>'
    +   '<div class="price-l"><span>' + eur(a.price) + ' × ' + a.nights + ' nuit' + (a.nights>1?'s':'') + '</span><span>' + eur(total) + '</span></div>'
    +   '<p class="book-desc" style="margin-top:8px;color:var(--sub)">Prix indicatif. La disponibilité et le tarif définitif sont confirmés sur ' + (isAirbnb?'Airbnb':'Booking.com') + '.</p>'
    + '</div>'
    + '<div class="ov-foot"><div class="foot-price">'
    +   '<div><div class="fp-v">' + eur(total) + '</div><div class="fp-l">' + a.nights + ' nuit' + (a.nights>1?'s':'') + ' · estimation</div></div>'
    +   '<button class="btn" onclick="openAffiliate(\'' + a.id + '\')">Voir sur ' + (isAirbnb?'Airbnb':'Booking.com') + '</button>'
    + '</div></div>';
}

