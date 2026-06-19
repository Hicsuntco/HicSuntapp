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
    +   '<div class="navbar on-dark"><button class="nav-btn ghost" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +     '<button class="nav-btn ghost" onclick="toast(\'Lien copié\')" aria-label="Partager">' + ico('share',18,1.5) + '</button></div>'
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
    +     '<div class="gen-progress-track"><div class="gen-progress-fill" data-gen-bar style="width:8%"></div></div>'
    +     '<span class="gen-progress-pct" data-gen-pct>8%</span>'
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
function affiliateLink(a){
  const type=(a.type||'').toLowerCase();
  const query=encodeURIComponent((a.n||'')+' '+(a.loc||''));
  if(/villa|appartement|apparthotel|maison|airbnb|guesthouse|gîte|loft/.test(type)){
    return 'https://www.airbnb.fr/s/'+query+'/homes'+(AFFILIATE_TAGS.airbnb?'?af='+AFFILIATE_TAGS.airbnb:'');
  }
  return 'https://www.booking.com/searchresults.html?ss='+query+(AFFILIATE_TAGS.booking?'&aid='+AFFILIATE_TAGS.booking:'');
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
  return '<div class="acc" onclick="openBooking(\'' + a.id + '\')">'
    + '<div class="a-img" style="position:relative;overflow:hidden;height:145px;background:radial-gradient(120% 100% at 15% 0%,'+hexA(accent,0.28)+',transparent 60%),linear-gradient(155deg,#1c1812,#0d0b08 55%,#000)">'
    +   '<svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 345 188" preserveAspectRatio="none" fill="none" stroke="'+hexA(accent,0.4)+'" stroke-width="0.5">'
    +     [0,1,2,3,4,5,6].map(function(i){ return '<line x1="'+(i*57.5)+'" y1="0" x2="'+(i*57.5)+'" y2="188"/>'; }).join('')
    +     [0,1,2,3,4].map(function(i){ return '<line x1="0" y1="'+(i*47)+'" x2="345" y2="'+(i*47)+'"/>'; }).join('')
    +   '</svg>'
    +   '<span style="position:absolute;top:11px;left:11px;z-index:1;font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;background:rgba(15,12,9,0.65);border:1px solid '+hexA(accent,0.4)+';color:rgba(246,240,228,0.92);padding:6px 10px;border-radius:20px">' + esc(a.tag) + '</span>'
    +   '<button class="a-fav" style="position:absolute;top:9px;right:9px;z-index:1;width:34px;height:34px;border-radius:50%;border:none;background:rgba(15,12,9,0.5);color:rgba(246,240,228,0.85);display:flex;align-items:center;justify-content:center;cursor:pointer" onclick="event.stopPropagation();this.classList.toggle(\'on\')" aria-label="Favori">' + ico('heart', 16, 1.6) + '</button>'
    +   '<span style="position:absolute;bottom:14px;right:14px;z-index:1;color:'+hexA(accent,0.9)+';display:flex;opacity:0.95">' + ico(a.i, 24, 1.4) + '</span>'
    +   '<span style="position:absolute;left:14px;right:14px;bottom:13px;height:1px;z-index:0;background:'+hexA(accent,0.25)+'"></span>'
    + '</div>'
    + '<div class="a-body">'
    +   '<div class="a-top"><span class="a-n">' + esc(a.n) + '</span><span class="a-rate">' + ico('star', 11) + a.rate + '</span></div>'
    +   '<div class="a-meta">' + esc(a.type) + ' · ' + esc(a.loc) + '</div>'
    +   '<div class="a-price"><b>' + eur(a.price) + '</b> / nuit · ' + a.nights + ' nuit' + (a.nights > 1 ? 's' : '') + '</div>'
    + '</div></div>';
}

/* ── 6 · Itinéraire ─────────────────────────────────────────────────── */
function itineraryView(){
  const it = ITINERARY;
  const wx1 = it.plan[0] ? it.plan[0].wx : ['sun','30°'];

  /* Couleur primaire du thème — utilisée partout dans l'écran */
  const palette = it.palette || {};
  const theme = it.theme || 'mediterranean';
  const SIG = {
    mediterranean: { c1: palette.beach   || '#3A9EC9', c2: palette.food    || '#D44A2A' },
    desert:        { c1: palette.culture || '#D4943A', c2: palette.food    || '#D4522A' },
    alpine:        { c1: palette.hike    || '#3A9E7E', c2: palette.outdoor || '#4ABECE' },
    tropical:      { c1: palette.food    || '#E87A4A', c2: palette.hike    || '#2D9E6B' },
    tropical_io:   { c1: palette.beach   || '#4AC8E0', c2: palette.spa     || '#E87A9A' },
    steppe:        { c1: palette.beach   || '#5A8AAA', c2: palette.hike    || '#7A9E8A' },
    andean:        { c1: palette.culture || '#C0A040', c2: palette.hike    || '#8A6A3A' },
    urban_asia:    { c1: palette.culture || '#7A50C0', c2: palette.food    || '#E05030' },
    urban:         { c1: palette.culture || '#7A65D4', c2: palette.food    || '#D4854A' },
    savanna:       { c1: palette.outdoor || '#70A850', c2: palette.culture || '#B07030' },
    caribbean:     { c1: palette.beach   || '#30C0C0', c2: palette.food    || '#E0A030' },
  };
  const sig = SIG[theme] || SIG.tropical;
  const primaryColor = sig.c1;
  const secondColor  = sig.c2;

  /* Fond du minimap : légère teinte de la couleur primaire */
  const minimapBg = 'linear-gradient(135deg,'
    + hexA(primaryColor,0.08) + ' 0%,'
    + hexA(secondColor,0.05) + ' 100%),'
    + 'var(--surface)';

  return statusBar()
    + navbar(it.dest, { right:'<button class="nav-btn" onclick="openOverlay(\'share\', shareView())" aria-label="Partager">' + ico('share',18,1.5) + '</button>' })
    + '<div class="ov-scroll has-foot px">'
    +   '<div class="itin-hero">'
    +     '<span class="eyebrow" style="color:'+primaryColor+'">Itinéraire composé · ' + esc(it.theme ? it.theme.charAt(0).toUpperCase()+it.theme.slice(1) : 'Sur-mesure') + '</span>'
    +     '<h1>' + esc(it.dest) + '</h1>'
    +     '<div class="itin-tag">' + esc(it.tag) + '</div>'
    +     '<div class="itin-pills">'
    +       '<span class="pill" style="color:'+primaryColor+';border-color:'+hexA(primaryColor,0.3)+';background:'+hexA(primaryColor,0.07)+'">' + esc(it.dates) + '</span>'
    +       '<span class="pill">' + it.days + ' jours</span>'
    +       '<span class="pill">' + esc(it.level) + '</span>'
    +     '</div>'
    +   '</div>'
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
    +   '<div class="ai-banner" onclick="openAI()" style="border-color:'+hexA(primaryColor,0.25)+';background:'+hexA(primaryColor,0.05)+'">'
    +     '<span class="ai-av" style="background:'+hexA(primaryColor,0.15)+';color:'+primaryColor+'">' + ico('sparkle',22,1.6) + '</span>'
    +     '<span><span class="ab-k">Cartographe · assistant</span><br><span class="ab-t">Modifier l\'itinéraire</span></span>'
    +     '<span class="ico chev">' + ico('chevron',20,1.7) + '</span>'
    +   '</div>'
    +   '<div class="section-h"><h2>Jour par jour</h2><span class="meta">' + it.days + ' jours</span></div>'
    +   it.plan.map(function(p, i){
        if(!p) return '';
        const catColor = (palette[p.category]) || primaryColor;
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
    +   '<button class="btn" onclick="openBooking(\'' + (it.accommodations[0]?it.accommodations[0].id:'') + '\')">Voir les hébergements</button>'
    + '</div></div>';
}

/* ── 7 · Détail d'un jour ───────────────────────────────────────────── */
function dayDetailView(idx){
  const it = ITINERARY;
  const p = it.plan[idx];
  if (!p) return statusBar() + navbar('Jour');
  const num = 'Jour ' + String(p.n).padStart(2,'0');
  const palette = it.palette || {};
  const catColor = palette[p.category] || 'var(--gold)';
  const catLabel = (typeof CATEGORY_LABELS !== 'undefined' && CATEGORY_LABELS[p.category]) || '';
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
    + '<div class="row" style="cursor:default"><span class="r-ico">' + ico('fork',19,1.5) + '</span>'
    + '<div class="r-main"><div class="r-t">' + esc(p.restaurant.name) + '</div>'
    + '<div class="r-s">' + esc(p.restaurant.type||'') + (p.restaurant.price ? ' · ' + esc(p.restaurant.price) : '') + '</div>'
    + (p.restaurant.note ? '<div class="r-s" style="margin-top:2px;font-style:italic">' + esc(p.restaurant.note) + '</div>' : '')
    + '</div></div>' : '';

  const wellnessHTML = p.wellness ? '<div class="section-h"><h2>Bien-être</h2></div>'
    + '<div class="row" style="cursor:default"><span class="r-ico">' + ico('droplet',19,1.5) + '</span>'
    + '<div class="r-main"><div class="r-t">' + esc(p.wellness.name) + '</div>'
    + '<div class="r-s">' + esc(p.wellness.type||'') + (p.wellness.price ? ' · ' + esc(p.wellness.price) : '') + '</div>'
    + (p.wellness.note ? '<div class="r-s" style="margin-top:2px;font-style:italic">' + esc(p.wellness.note) + '</div>' : '')
    + '</div></div>' : '';

  const tipHTML = p.tip ? '<div class="day-tip" style="border-left:3px solid '+catColor+';background:'+hexA(catColor,0.08)+';border-radius:0 8px 8px 0;padding:12px 14px;margin-top:14px;font-size:13.5px;font-style:italic;color:var(--ink)">'
    + '<span style="color:'+catColor+';font-weight:600;font-style:normal;text-transform:uppercase;letter-spacing:.08em;font-size:10px;display:block;margin-bottom:4px">Conseil d\'initié</span>'
    + esc(p.tip) + '</div>' : '';

  return statusBar() + navbar(num)
    + '<div class="ov-scroll has-foot px">'
    +   '<span class="eyebrow" style="color:'+catColor+'">' + num + ' · ' + esc(p.loc) + (catLabel ? ' · ' + catLabel : '') + '</span>'
    +   '<h1 class="dayd-h">' + esc(p.title) + '</h1>'
    +   '<p class="dayd-s">' + esc(p.desc) + '</p>'
    +   tipHTML
    +   '<div class="section-h"><h2>Le programme</h2><span class="meta">' + p.moments.length + ' moments</span></div>'
    +   p.moments.map(function(m){
        return '<div class="moment"><span class="mo-t">' + esc(m[0]) + '</span><span class="mo-i" style="color:'+catColor+'">' + ico(m[1],15,1.6) + '</span>'
          + '<div><div class="mo-ti">' + esc(m[2]) + '</div>' + (m[3] ? '<div class="mo-d">' + esc(m[3]) + '</div>' : '') + '</div></div>';
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
    +   '<div class="book-h"><span>' + esc(a.n) + '</span><span class="a-rate" style="font-family:var(--mono);font-size:11px;display:inline-flex;align-items:center;gap:4px">' + ico('star',12) + a.rate + '</span></div>'
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

