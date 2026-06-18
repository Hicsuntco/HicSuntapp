/* ── HIC SUNT · Sillage — features : carte, budget, activités, IA… ──── */

/* ── 12 · Carte géographique ─────────────────────────────────────────── */
/* Contours SVG simplifiés des pays + coordonnées relatives des villes clés */
const GEO_SHAPES = {
  'sardaigne': {
    vb:'0 0 100 160',
    path:'M50,8 C58,10 66,14 70,22 C74,30 72,38 74,46 C76,54 80,60 78,70 C76,80 70,84 68,94 C66,104 70,112 66,120 C62,128 54,134 46,138 C38,142 30,138 26,130 C22,122 24,114 22,106 C20,98 16,92 18,82 C20,72 26,66 28,56 C30,46 26,36 30,26 C34,16 42,6 50,8Z',
    /* Coordonnées recalibrées pour être DANS le contour SVG ci-dessus */
    /* centre approximatif de la Sardaigne : x≈46, y≈80 dans le vb 0 0 100 160 */
    cities:{
      'Cagliari':[50,130],       /* sud, centre */
      'Iglesias':[34,118],       /* sud-ouest */
      'Carbonia':[30,124],       /* sud-ouest */
      'Villacidro':[38,110],     /* centre-sud */
      'Oristano':[32,82],        /* centre-ouest */
      'Nuoro':[58,62],           /* centre-est */
      'Dorgali':[64,68],         /* centre-est */
      'Sassari':[36,28],         /* nord-ouest */
      'Alghero':[24,38],         /* nord-ouest côte */
      'Olbia':[72,26],           /* nord-est */
      'Arzachena':[68,18],       /* nord */
      'La Maddalena':[74,12],    /* extrême nord */
      'Palau':[72,16],           /* nord */
      'Porto Cervo':[70,20],     /* nord-est */
      'Siniscola':[68,50],       /* est */
      'Tortolì':[70,80],         /* est */
      'Arbatax':[72,86],         /* est */
      'Villasimius':[68,136],    /* sud-est */
      'Pula':[44,140],           /* sud */
      'Chia':[40,146],           /* sud */
      'Teulada':[36,142],        /* sud-ouest */
      'Sant\'Antioco':[28,134],  /* île sud-ouest */
      'Carloforte':[24,128],     /* île */
      'Macomer':[42,58],         /* centre */
      'Bosa':[24,60],            /* nord-ouest côte */
      'Castelsardo':[46,16],     /* nord */
      'Dolianova':[54,122],      /* sud-est intérieur */
      'Mandas':[52,108],         /* centre-sud */
      'Laconi':[46,88],          /* centre */
      'Sorgono':[52,76],         /* centre */
      'Gavoi':[54,68],           /* centre */
      'Fonni':[58,70],           /* centre-est */
      'Aritzo':[54,82],          /* centre */
      'Barumini':[46,102],       /* centre-sud (Su Nuraxi) */
      'Gesturi':[46,100],        /* centre-sud */
      'Guspini':[34,96],         /* centre-ouest */
      'Gonnosfanadiga':[36,106], /* sud-ouest intérieur */
      'Fluminimaggiore':[28,116],/* sud-ouest */
      'Buggerru':[24,110],       /* côte ouest */
      'Piscinas':[24,104],       /* côte ouest */
      'Arbus':[26,96],           /* centre-ouest */
      'Terralba':[30,90],        /* ouest */
      'Cabras':[28,80],          /* ouest */
      'Putifigari':[30,44],      /* nord-ouest */
      'Thiesi':[40,38],          /* nord-centre */
      'Ozieri':[52,36],          /* nord-centre */
      'Buddusò':[58,44],         /* centre-nord */
      'Bitti':[60,56],           /* centre */
      'Lula':[64,56],            /* centre-est */
    }
  },
  'italie': {
    vb:'0 0 80 200',
    path:'M32,10 C42,8 52,12 56,20 C60,28 56,40 58,52 C60,64 66,72 64,84 C62,96 56,104 54,116 C52,128 56,140 52,150 C48,158 40,160 34,154 C28,148 28,136 24,126 C20,116 14,108 14,96 C12,84 16,72 16,60 C16,48 12,36 16,24 C20,12 24,12 32,10Z M54,150 C60,158 64,170 60,176 C56,182 48,180 44,172 C40,164 42,154 48,148 L54,150Z',
    cities:{'Rome':[40,88],'Milan':[32,24],'Florence':[44,66],'Naples':[50,118],'Venise':[58,20],'Palerme':[38,168]}
  },
  'maroc': {
    vb:'0 0 140 120',
    path:'M20,16 C32,10 50,10 64,14 C78,18 90,26 98,36 C106,46 108,58 106,70 C104,82 96,90 86,96 C76,102 62,104 48,104 C34,104 20,100 12,90 C4,80 4,66 6,54 C8,42 10,28 20,16Z',
    cities:{'Marrakech':[60,74],'Casablanca':[30,48],'Fès':[74,34],'Rabat':[28,36],'Agadir':[36,92],'Essaouira':[22,78],'Tanger':[44,14],'Merzouga':[108,80],'Ouarzazate':[80,84]}
  },
  'sri lanka': {
    vb:'0 0 80 120',
    path:'M40,8 C50,10 58,16 62,26 C66,36 64,48 66,58 C68,68 72,76 70,86 C68,96 60,102 52,108 C44,114 34,116 26,110 C18,104 16,94 14,84 C12,74 14,64 16,54 C18,44 16,34 20,24 C24,14 30,6 40,8Z',
    cities:{'Colombo':[22,66],'Kandy':[40,54],'Galle':[28,96],'Sigiriya':[50,36],'Ella':[52,76],'Trincomalee':[58,24],'Jaffna':[44,10]}
  },
  'thaïlande': {
    vb:'0 0 80 180',
    path:'M44,10 C54,12 62,18 64,28 C66,38 62,50 62,62 C62,74 66,86 62,96 C58,106 50,110 46,120 C42,130 44,142 38,148 C32,154 24,152 20,144 C16,136 18,124 16,114 C14,104 10,94 10,82 C10,70 12,58 14,46 C16,34 14,22 20,14 C26,6 36,8 44,10Z M38,148 C40,158 38,168 32,172 C26,176 20,172 18,162 C16,152 20,144 24,138 L38,148Z',
    cities:{'Bangkok':[40,88],'Chiang Mai':[30,30],'Phuket':[28,158],'Koh Samui':[56,120],'Ayutthaya':[40,70],'Pai':[24,20]}
  },
  'grèce': {
    vb:'0 0 160 120',
    path:'M40,18 C52,12 66,12 78,16 C90,20 100,28 106,40 C112,52 110,64 106,74 C102,84 92,88 82,94 C72,100 58,102 46,98 C34,94 24,86 18,74 C12,62 12,48 16,36 C20,24 28,24 40,18Z M82,94 C88,104 90,114 84,118 C78,122 70,116 68,106 C66,96 70,88 76,84 L82,94Z M46,98 C40,108 36,116 40,120 C44,124 52,120 54,110 C56,100 52,92 48,88 L46,98Z',
    cities:{'Athènes':[72,68],'Thessalonique':[64,22],'Santorin':[90,104],'Mykonos':[100,86],'Rhodes':[132,98],'Crète':[82,112]}
  },
  'portugal': {
    vb:'0 0 60 120',
    path:'M30,8 C38,6 46,10 50,18 C54,26 52,36 52,46 C52,56 54,66 52,76 C50,86 44,92 40,100 C36,108 36,118 30,118 C24,118 22,110 18,102 C14,94 12,82 12,70 C12,58 14,48 14,38 C14,28 10,18 14,10 C18,2 24,10 30,8Z',
    cities:{'Lisbonne':[26,78],'Porto':[22,32],'Faro':[34,110],'Évora':[36,84],'Sintra':[20,74],'Coimbra':[24,52]}
  },
  'japon': {
    vb:'0 0 140 180',
    path:'M80,10 C90,12 98,18 100,28 C102,38 96,50 94,62 C92,74 96,86 90,96 C84,106 74,110 68,120 C62,130 60,142 54,148 C48,154 40,152 34,144 C28,136 28,124 26,112 C24,100 18,90 18,78 C18,66 22,54 26,44 C30,34 28,22 34,14 C40,6 50,6 62,8 L80,10Z M54,148 C56,160 54,172 48,176 C42,180 36,174 34,162 C32,150 36,142 40,136 L54,148Z',
    cities:{'Tokyo':[82,58],'Kyoto':[62,86],'Osaka':[66,94],'Hiroshima':[50,108],'Nara':[64,90],'Hakone':[78,70],'Sapporo':[90,16]}
  },
  'islande': {
    vb:'0 0 200 100',
    path:'M30,50 C36,36 50,26 64,20 C78,14 96,14 110,18 C124,22 136,32 144,44 C152,56 150,68 138,76 C126,84 108,84 92,84 C76,84 60,84 46,76 C32,68 24,64 30,50Z',
    cities:{'Reykjavik':[42,64],'Akureyri':[90,26],'Vik':[76,80],'Jökulsárlón':[116,70],'Landmannalaugar':[78,66],'Húsavík':[104,20]}
  },
  'pérou': {
    vb:'0 0 100 140',
    path:'M28,16 C38,10 52,8 64,12 C76,16 84,26 88,38 C92,50 90,64 88,76 C86,88 88,102 82,112 C76,122 64,126 52,126 C40,126 28,120 20,110 C12,100 10,86 12,74 C14,62 10,48 14,36 C18,24 20,22 28,16Z',
    cities:{'Lima':[20,66],'Cusco':[60,96],'Machu Picchu':[52,100],'Arequipa':[48,112],'Iquitos':[72,36],'Paracas':[22,82]}
  },
  'bali': {
    vb:'0 0 140 70',
    path:'M20,35 C28,22 44,16 60,14 C76,12 90,16 104,24 C118,32 128,42 124,54 C120,66 104,68 88,68 C72,68 56,66 42,58 C28,50 12,48 20,35Z',
    cities:{'Kuta':[38,50],'Ubud':[68,38],'Seminyak':[32,46],'Uluwatu':[50,60],'Amed':[108,30],'Nusa Dua':[58,56]}
  },
  'kenya': {
    vb:'0 0 100 120',
    path:'M28,16 C40,10 56,8 68,12 C80,16 90,26 94,38 C98,50 96,64 92,76 C88,88 88,102 80,110 C72,118 58,120 46,116 C34,112 22,104 16,92 C10,80 8,66 10,54 C12,42 16,30 28,16Z',
    cities:{'Nairobi':[52,72],'Mombasa':[76,104],'Masai Mara':[26,84],'Amboseli':[46,98],'Lac Nakuru':[40,58],'Samburu':[66,38]}
  },
  '_default': {
    vb:'0 0 100 100',
    path:'M50,8 C64,10 76,20 80,34 C84,48 80,62 76,74 C72,86 64,94 52,98 C40,102 28,98 20,88 C12,78 10,64 12,52 C14,40 16,26 24,18 C32,10 38,6 50,8Z',
    cities:{}
  }
};

function _geoShape(dest){
  const d=(dest||'').toLowerCase();
  const keys=Object.keys(GEO_SHAPES).filter(function(k){return k!=='_default';});
  for(let i=0;i<keys.length;i++){ if(d.includes(keys[i])) return {key:keys[i],g:GEO_SHAPES[keys[i]]};  }
  if(/italie|sicile|rome|milan|florence|naples/.test(d)) return {key:'italie',g:GEO_SHAPES.italie};
  if(/grèce|athènes|cyclades|crète|santorin/.test(d)) return {key:'grèce',g:GEO_SHAPES['grèce']};
  if(/thaïlande|bangkok|chiang/.test(d)) return {key:'thaïlande',g:GEO_SHAPES['thaïlande']};
  if(/japon|tokyo|kyoto|osaka/.test(d)) return {key:'japon',g:GEO_SHAPES.japon};
  if(/bali|lombok|java|indonesie/.test(d)) return {key:'bali',g:GEO_SHAPES.bali};
  if(/portugal|lisbonne|porto/.test(d)) return {key:'portugal',g:GEO_SHAPES.portugal};
  if(/pérou|lima|cusco|machu/.test(d)) return {key:'pérou',g:GEO_SHAPES['pérou']};
  if(/kenya|nairobi|safari/.test(d)) return {key:'kenya',g:GEO_SHAPES.kenya};
  if(/islande|reykjavik/.test(d)) return {key:'islande',g:GEO_SHAPES.islande};
  return {key:'_default',g:GEO_SHAPES._default};
}

function _cityPtsOnMap(plan, geo, W, H){
  const vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number);
  const vbW=vbParts[2], vbH=vbParts[3];
  const cities=geo.g.cities||{};

  /* Pré-calculer le centroïde de la forme pour le fallback */
  const cityVals=Object.values(cities);
  let cxCentre=vbW/2, cyCentre=vbH/2;
  if(cityVals.length){
    cxCentre=cityVals.reduce(function(s,c){return s+c[0];},0)/cityVals.length;
    cyCentre=cityVals.reduce(function(s,c){return s+c[1];},0)/cityVals.length;
  }

  /* Matching : plusieurs niveaux de fuzzy */
  function matchCity(loc){
    if(!loc) return null;
    /* Nettoyer : prendre la partie avant "/" et "/" et trimmer */
    const parts=loc.split(/[\/\-,]/);
    const tokens=parts.map(function(p){return p.trim().toLowerCase();}).filter(Boolean);

    for(const city in cities){
      const cl=city.toLowerCase().trim();
      for(let t=0;t<tokens.length;t++){
        const tok=tokens[t];
        if(!tok || tok.length<3) continue;
        /* match exact ou sous-chaîne dans les deux sens */
        if(cl===tok || cl.includes(tok) || tok.includes(cl)){
          return cities[city];
        }
        /* match partiel : les 5 premiers caractères */
        if(tok.length>=5 && cl.length>=5 && (cl.slice(0,5)===tok.slice(0,5))){
          return cities[city];
        }
      }
    }
    return null;
  }

  /* Compter d'abord combien de jours utilisent le fallback pour les disperser */
  const matched=plan.map(function(p){ return matchCity(p.loc||''); });
  const fallbackCount=matched.filter(function(m){return !m;}).length;
  let fallbackIdx=0;

  return plan.map(function(p,i){
    const m=matched[i];
    if(m){
      return {cx:m[0]/vbW*W, cy:m[1]/vbH*H, n:i+1, loc:p.loc, day:p.n};
    }
    /* Fallback : distribuer en cercle autour du centroïde, à l'intérieur du contour */
    const angle=(fallbackIdx/Math.max(1,fallbackCount))*Math.PI*2 - Math.PI/2;
    const radius=Math.min(vbW,vbH)*0.18; /* rayon modeste pour rester dans le contour */
    const fx=(cxCentre+Math.cos(angle)*radius)/vbW*W;
    const fy=(cyCentre+Math.sin(angle)*radius)/vbH*H;
    fallbackIdx++;
    return {cx:fx, cy:fy, n:i+1, loc:p.loc, day:p.n};
  });
}

function geoMapSVG(W, H, activeIdx){
  const it=ITINERARY;
  const dest=it.dest||it.destination||'';
  const geo=_geoShape(dest);
  const vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number);
  const vbW=vbParts[2], vbH=vbParts[3];
  const accent=(it.palette&&(it.palette.culture||it.palette.beach))||'#C9A96E';
  const pts=_cityPtsOnMap(it.plan||[], geo, W, H);

  const scale=Math.min(W/vbW, H/vbH)*0.88;
  const offX=(W-vbW*scale)/2;
  const offY=(H-vbH*scale)/2;

  let routePath='';
  if(pts.length>1){
    routePath='M'+pts[0].cx.toFixed(1)+' '+pts[0].cy.toFixed(1);
    for(let i=1;i<pts.length;i++){
      const mx=((pts[i-1].cx+pts[i].cx)/2).toFixed(1);
      const my=((pts[i-1].cy+pts[i].cy)/2).toFixed(1);
      routePath+=' Q'+pts[i-1].cx.toFixed(1)+' '+pts[i-1].cy.toFixed(1)+' '+mx+' '+my;
      routePath+=' T'+pts[i].cx.toFixed(1)+' '+pts[i].cy.toFixed(1);
    }
  }

  const pins=pts.map(function(p,i){
    const on=activeIdx===i;
    const r=on?14:10;
    return '<g class="mpin'+(on?' on':'')+'"'+(activeIdx!==null?' style="cursor:pointer" onclick="mapSelect('+i+')"':'')+' >'
      +'<circle cx="'+p.cx.toFixed(1)+'" cy="'+p.cy.toFixed(1)+'" r="'+r+'"/>'
      +'<text x="'+p.cx.toFixed(1)+'" y="'+(p.cy+(on?4.5:3.8)).toFixed(1)+'" font-size="'+(on?12:9)+'">'+p.n+'</text></g>';
  }).join('');

  return '<svg class="map-svg" viewBox="0 0 '+W+' '+H+'" fill="none" xmlns="http://www.w3.org/2000/svg">'
    +'<rect width="'+W+'" height="'+H+'" fill="rgba(246,240,228,0.02)" rx="10"/>'
    +'<g transform="translate('+offX.toFixed(1)+','+offY.toFixed(1)+') scale('+scale.toFixed(4)+')">'
    +'<path d="'+geo.g.path+'" fill="'+hexA(accent,0.10)+'" stroke="'+hexA(accent,0.60)+'" stroke-width="'+(1.4/scale).toFixed(2)+'" stroke-linejoin="round" stroke-linecap="round"/>'
    +'</g>'
    +(routePath?'<path d="'+routePath+'" stroke="'+hexA(accent,0.85)+'" stroke-width="1.4" stroke-dasharray="5 4" fill="none"/>':'')
    +pins
    +'</svg>';
}

function mapView(){
  const i=state.mapDay||0;
  const p=(ITINERARY.plan||[])[i];
  const dest=ITINERARY.dest||ITINERARY.destination||'';
  const geo=_geoShape(dest);
  const pts=_cityPtsOnMap(ITINERARY.plan||[], geo, 345, 420);
  const pin=pts[i]||{cx:172,cy:210};
  const popLeftPct=Math.max(4,Math.min(pin.cx/345*100-20,50));
  const popTopPct=pin.cy/420>0.58?(pin.cy/420*100-22):(pin.cy/420*100+6);
  const pop=p?'<div class="map-pop" style="left:'+popLeftPct.toFixed(1)+'%;top:'+popTopPct.toFixed(1)+'%">'
    +'<div class="mp-k">Jour '+String(p.n).padStart(2,'0')+' · '+esc(p.loc)+'</div>'
    +'<div class="mp-t">'+esc(p.title)+'</div>'
    +'<div class="mp-m"><span class="mp-wx">'+ico(p.wx[0],13,1.7)+p.wx[1]+'</span>'
    +'<span class="mp-l" onclick="openDay('+i+')">Détails ›</span></div></div>':'';
  return statusBar()
    +navbar('Carte du voyage',{right:'<button class="nav-btn" onclick="openOffline()" aria-label="Hors-ligne">'+ico('download',18,1.6)+'</button>'})
    +'<div class="ov-scroll">'
    +'<div class="bigmap">'
    +'<span class="map-coords">'+esc(ITINERARY.coords||ITINERARY.dest)+'</span>'
    +'<span class="map-rose">'+rose(26,1.1)+'</span>'
    +geoMapSVG(345,420,i)+pop
    +'</div>'
    +'<div class="map-rail">'+(ITINERARY.plan||[]).map(function(d,j){
      return '<button class="map-chip'+(j===i?' on':'')+'" onclick="mapSelect('+j+')">'
        +'<div class="mc-d">Jour '+String(d.n).padStart(2,'0')+'</div><div class="mc-l">'+esc(d.loc)+'</div></button>';
    }).join('')+'</div>'
    +'</div>';
}
function mapSelect(i){
  state.mapDay = i;
  const el = ovStack[ovStack.length - 1];
  if (el && el.dataset.ov === 'map') el.innerHTML = mapView();
}

/* ── 13 · Budget ────────────────────────────────────────────────────── */
function budgetView(){
  const b = BUDGET;
  const pct = Math.round(b.spent / b.total * 100);
  const rest = b.total - b.spent;
  const isGen = !!ITINERARY.generated;
  return statusBar() + navbar('Budget du voyage')
    + '<div class="ov-scroll has-foot px">'
    +   '<div class="bud-card">' + contour()
    +     '<div class="bud-l">Total estimé · ' + esc(ITINERARY.dest) + '</div>'
    +     '<div class="bud-v">' + eur(b.total) + '</div>'
    +     '<div class="bud-s">' + travelerLabel() + ' · ' + ITINERARY.days + ' jours · estimation</div>'
    +     (isGen ? '' : '<div class="bud-prog"><i style="width:' + pct + '%"></i></div>'
        + '<div class="bud-leg"><span>Réglé · <b>' + eur(b.spent) + '</b></span><span>Restant · ' + eur(rest) + '</span></div>')
    +   '</div>'
    +   '<div class="section-h"><h2>Répartition</h2><span class="meta">' + (isGen ? 'estimation' : pct + ' % réglé') + '</span></div>'
    +   b.lines.map(function(l){
        return '<div class="bline">' + ico(l.i, 20, 1.5)
          + '<div class="bl-m"><div class="bl-n">' + esc(l.n) + '</div><div class="bl-s">' + esc(l.sub) + '</div></div>'
          + '<div class="bl-r"><div class="bl-v">' + eur(l.amount) + '</div>'
          + (isGen ? '' : '<span class="status ' + (l.paid ? 'ok' : 'prep') + '">' + (l.paid ? 'Réglé' : 'À régler') + '</span>') + '</div></div>';
      }).join('')
    + '</div>'
    + (isGen
      ? '<div class="ov-foot"><div class="foot-price">'
        + '<div><div class="fp-v">' + eur(b.total) + '</div><div class="fp-l">estimation totale</div></div>'
        + '<button class="btn" onclick="openBooking(\'' + (ITINERARY.accommodations[0]?ITINERARY.accommodations[0].id:'') + '\')">Voir les hébergements</button>'
        + '</div></div>'
      : '<div class="ov-foot"><div class="foot-price">'
        + '<div><div class="fp-v">' + eur(rest) + '</div><div class="fp-l">solde restant</div></div>'
        + '<button class="btn" onclick="toast(\'Solde réglé — merci\')">Régler le solde</button>'
        + '</div></div>');
}

/* ── 14 · Activités ─────────────────────────────────────────────────── */
const actSel = {};
function openActivities(){ openOverlay('activities', activitiesView()); }
function activitiesView(){
  const byDay = {};
  ACTIVITIES.forEach(function(a){ (byDay[a.day] = byDay[a.day] || []).push(a); });
  const days = Object.keys(byDay).sort(function(a,b){ return a - b; });
  return statusBar() + navbar('Activités & expériences')
    + '<div class="ov-scroll px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">Sélection du cartographe</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Expériences sur-mesure</h1>'
    +   '<p class="lede" style="margin-top:10px">Des suggestions pour enrichir votre séjour — à organiser sur place ou auprès d\'un prestataire local.</p>'
    +   days.map(function(d){
        return '<div class="act-day">Jour ' + String(d).padStart(2,'0') + '</div>'
          + byDay[d].map(function(a){
            return '<div class="act" onclick="openActivityDetail(\'' + a.id + '\')" style="cursor:pointer">' + '<span class="a-th">' + ico(a.i, 26, 1.3) + '</span>'
              + '<div class="ac-m"><div class="ac-tag">' + esc(a.tag) + '</div><div class="ac-n">' + esc(a.n) + '</div>'
              + '<div class="ac-s">' + esc(a.loc) + ' · ' + esc(a.dur) + '</div></div>'
              + '<div class="ac-r"><span class="ac-p">~' + eur(a.price) + '</span></div></div>';
          }).join('');
      }).join('')
    + '</div>';
}
function _actById(id){ return ACTIVITIES.find(function(a){ return a.id === id; }); }
function openActivityDetail(id){
  const a = _actById(id);
  if (!a) return;
  const html = statusBar() + navbar('Activité')
    + '<div class="ov-scroll px">'
    +   '<div style="display:flex;align-items:center;justify-content:center;height:140px;background:var(--tile-bg);border-radius:14px;margin-top:14px;color:var(--gold)">' + ico(a.i, 48, 1.2) + '</div>'
    +   '<span class="eyebrow" style="display:block;margin-top:18px">' + esc(a.tag) + ' · Jour ' + a.day + '</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:26px;letter-spacing:-0.4px;margin-top:6px">' + esc(a.n) + '</h1>'
    +   '<div class="book-meta" style="margin-top:4px">' + esc(a.loc) + ' · ' + esc(a.dur) + '</div>'
    +   '<p class="book-desc" style="margin-top:14px">Une suggestion de votre cartographe pour s\'intégrer naturellement à votre journée à ' + esc(a.loc) + '. Budget indicatif ~' + eur(a.price) + ' par personne — à organiser sur place ou auprès d\'un prestataire local.</p>'
    + '</div>';
  openOverlay('activity-detail', html);
}

/* ── 15 · Avis ──────────────────────────────────────────────────────── */
function starRow(n, size){
  let s = '';
  for (let i = 0; i < 5; i++) s += '<span style="opacity:' + (i < n ? 1 : 0.25) + '">' + ico('star', size || 13) + '</span>';
  return s;
}
function reviewsView(){
  const dist = [86, 32, 7, 2, 1];
  const max = 86;
  return statusBar() + navbar('Avis voyageurs')
    + '<div class="ov-scroll px">'
    +   '<div class="rev-head">'
    +     '<div class="rev-score"><div class="rs-v">' + RATING.score + '</div><div class="rev-stars">' + starRow(5, 12) + '</div><div class="rs-c">' + RATING.count + ' avis</div></div>'
    +     '<div class="rev-bars">' + dist.map(function(v, i){
          return '<div class="rbar"><span>' + (5 - i) + '</span><div class="rb"><i style="width:' + Math.round(v / max * 100) + '%"></i></div></div>';
        }).join('') + '</div>'
    +   '</div>'
    +   '<div class="section-h"><h2>Ils sont partis</h2><span class="meta">Voyages Hic Sunt</span></div>'
    +   REVIEWS.map(function(r){
        return '<div class="review"><div class="rv-top">'
          + '<span class="avatar" style="width:36px;height:36px;font-size:14px">' + esc(r.av) + '</span>'
          + '<div><div class="rv-n">' + esc(r.who) + '</div><div class="rv-d">' + esc(r.when) + '</div></div>'
          + '<span class="rv-st">' + starRow(r.rate, 11) + '</span></div>'
          + '<p>' + esc(r.t) + '</p></div>';
      }).join('')
    + '</div>';
}

/* ── 16 · Cartographe IA ────────────────────────────────────────────── */
function aiView(){
  return statusBar()
    + '<div class="chat-nav"><button class="nav-btn ghost" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +   '<div class="chat-id"><span class="chat-av">' + ico('sparkle',18,1.6) + '<span class="on-dot"></span></span>'
    +   '<span><span class="chat-n">Cartographe</span><br><span class="chat-st">Assistant · en ligne</span></span></div></div>'
    + '<div class="chat-scroll" data-ai-chat>'
    +   '<span class="day-sep">Assistant d\'itinéraire</span>'
    +   '<div class="bub them">' + esc(AI_INTRO) + '</div>'
    + '</div>'
    + '<div class="quick">' + AI_PROMPTS.map(function(p){
        return '<button class="chip" onclick="aiSend(\'' + p.replace(/'/g, "\\'") + '\')">' + esc(p) + '</button>';
      }).join('') + '</div>'
    + '<div class="composer">'
    +   '<input data-ai-input placeholder="Décrivez un changement…" onkeydown="if(event.key===\'Enter\')aiSend(this.value)">'
    +   '<button class="send-btn" onclick="aiSend(document.querySelector(\'[data-ai-input]\').value)" aria-label="Envoyer">' + ico('arrowup',18,1.8) + '</button>'
    + '</div>';
}
function aiScroll(){
  const c = document.querySelector('[data-ai-chat]');
  if (c) c.scrollTop = c.scrollHeight;
}

/* ── 22 · Cercle Hic Sunt ───────────────────────────────────────────── */
function openCercle(){
  const el = openOverlay('cercle', cercleView());
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      const bar = el.querySelector('[data-cc-prog]');
      if(bar) bar.style.width = bar.dataset.target + '%';
    });
  });
}
function cercleView(){
  const pct = Math.round(CERCLE.progress * 100);
  return statusBar() + navbar('Cercle Hic Sunt')
    + '<div class="ov-scroll px">'
    +   '<div class="cercle-card">' + contour()
    +     '<div class="cc-tier">' + esc(CERCLE.tier) + '</div>'
    +     '<div class="cc-pts">' + CERCLE.points + ' points</div>'
    +     '<div class="cc-prog"><i data-cc-prog style="width:0%" data-target="' + pct + '"></i></div>'
    +     '<div class="cc-next">' + CERCLE.toNext + ' pts avant ' + esc(CERCLE.next) + '</div>'
    +   '</div>'
    +   '<div class="section-h"><h2>Vos avantages</h2></div>'
    +   '<div class="perks" style="margin-top:0">' + CERCLE.perks.map(function(p){
        return '<div class="perk">' + ico(p.i, 19, 1.5) + '<div class="p-t">' + esc(p.n) + '</div><div class="p-d">' + esc(p.d) + '</div></div>';
      }).join('') + '</div>'
    +   '<div class="section-h"><h2>Historique</h2><span class="meta">Points</span></div>'
    +   (CERCLE.history.length === 0
        ? '<p style="color:var(--sub);font-size:14px;margin-top:4px;font-style:italic">Réservez votre premier voyage pour commencer à cumuler des points.</p>'
        : CERCLE.history.map(function(h){
            return '<div class="hist"><div><div class="hi-n">' + esc(h.n) + '</div><div class="hi-w">' + esc(h.when) + '</div></div><span class="hi-p">' + esc(h.pts) + '</span></div>';
          }).join(''))
    + '</div>';
}

/* ── Pépites cachées (itinéraires générés) ──────────────────────────── */
function gemsView(){
  const gems = ITINERARY.gems || [];
  return statusBar() + navbar('Pépites cachées')
    + '<div class="ov-scroll px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">' + esc(ITINERARY.dest) + '</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Adresses secrètes</h1>'
    +   '<p class="lede" style="margin-top:10px">Sélectionnées par votre cartographe — loin des sentiers battus.</p>'
    +   (gems.length === 0
        ? '<p style="color:var(--sub);font-size:14px;margin-top:24px;font-style:italic">Aucune pépite pour cette destination.</p>'
        : gems.map(function(g){
            return '<div class="review"><div class="rv-top"><div><div class="rv-n">' + esc(g.name) + '</div><div class="rv-d">' + esc(g.loc||'') + '</div></div></div>'
              + '<p>' + esc(g.desc||'') + '</p>'
              + (g.tip ? '<p style="color:var(--gold);font-size:13px;margin-top:4px;font-style:italic">' + esc(g.tip) + '</p>' : '')
              + '</div>';
          }).join(''))
    + '</div>';
}

async function exportPDF(){
  const it = ITINERARY;
  const win = window.open('', '_blank');
  if (!win){ toast('Autorisez les pop-ups pour exporter'); return; }

  const palette = it.palette || {hike:'#7BAE6E',beach:'#5B9FBE',spa:'#E8A0A0',food:'#C98A52',culture:'#B07EB0',outdoor:'#C9A853',transit:'#8A9E88'};
  const BG_THEMES = {
    tropical:     { bg:'#0C160E', panel:'#1A2419', ink:'#EEE8D8', sub:'#8A9E88' },
    desert:       { bg:'#1A1308', panel:'#2A2014', ink:'#F5E8D6', sub:'#B59A6E' },
    alpine:       { bg:'#0C1620', panel:'#16242F', ink:'#E6EEF2', sub:'#7E96A3' },
    urban:        { bg:'#120E18', panel:'#1E1726', ink:'#EDE6F2', sub:'#9A87B0' },
    mediterranean:{ bg:'#170F08', panel:'#261A0E', ink:'#F2E8D6', sub:'#B59868' },
  };
  const bgTheme = BG_THEMES[it.theme] || BG_THEMES.tropical;
  const CAT_LABEL = {hike:'Rando & nature',beach:'Plage & océan',spa:'Bien-être',food:'Table & saveurs',culture:'Patrimoine',outdoor:'Plein air',transit:'Transfert'};
  const CAT_EMOJI = {hike:'\u{1F95E}',beach:'\u{1F30A}',spa:'\u{1F9D8}',food:'\u{1F37D}',culture:'\u{1F3DB}',outdoor:'\u2600',transit:'\u2708'};

  const stayById = {};
  it.accommodations.forEach(function(a){ stayById[a.id] = a; });

  const dayMomentIcon = {plane:'\u2708',fork:'\u25CB',droplet:'\u2740',wave:'\u223C',peaks:'\u25B2',arch:'\u25A0',leaf:'\u2741',sun:'\u2600',moon:'\u263D',bed:'\u25A1',star:'\u2605',camera:'\u25C9',ticket:'\u25C8',pin:'\u25CF',compass:'\u25C7'};

  /* ── timeline du circuit (étapes consécutives regroupées par lieu) ── */
  const stops = [];
  it.plan.forEach(function(p, i){
    const last = stops[stops.length-1];
    if (last && last.loc === p.loc) { last.nights++; last.endDay = p.n; }
    else { stops.push({ loc:p.loc, nights:1, startDay:p.n, endDay:p.n, category:p.category }); }
  });
  const timelineHTML = stops.map(function(s, i){
    const color = palette[s.category] || '#9c7c44';
    const cls = i===0 ? 'start' : (i===stops.length-1 ? 'end' : '');
    return '<div class="tl-stop '+cls+'" style="--c:'+color+'">'
      + '<div class="tl-dot"></div>'
      + '<div class="tl-city">'+esc(s.loc)+'</div>'
      + '<div class="tl-dates">Jour '+s.startDay+(s.endDay>s.startDay?'\u2013'+s.endDay:'')+'</div>'
      + '<div class="tl-nights">'+s.nights+' nuit'+(s.nights>1?'s':'')+'</div>'
      + '</div>';
  }).join('');

  /* ── légende des catégories présentes ── */
  const usedCats = {};
  it.plan.forEach(function(p){ usedCats[p.category] = true; });
  (it.gems||[]).length && (usedCats.culture = true);
  const legendHTML = Object.keys(usedCats).map(function(c){
    return '<div class="legend-item"><div class="legend-dot" style="background:'+(palette[c]||'#9c7c44')+'"></div><span style="color:'+(palette[c]||'#9c7c44')+'">'+(CAT_LABEL[c]||c)+'</span></div>';
  }).join('');

  /* ── jours regroupés par étape (comme le hero Sri Lanka) ── */
  let sectionHTML = '';
  let stopIdx = 0, dayInStop = 0;
  let curStop = stops[0];
  it.plan.forEach(function(p, i){
    const color = palette[p.category] || '#9c7c44';
    const rgbaBg = hexA(color, 0.07), rgbaB = hexA(color, 0.22);

    /* nouvelle section si on entre dans une nouvelle étape */
    if (dayInStop === 0) {
      const s = stops[stopIdx];
      sectionHTML += '<section class="leg-section">'
        + '<div class="leg-head" style="--c:'+color+'">'
        + '<div class="leg-num">'+String(stopIdx+1).padStart(2,'0')+'</div>'
        + '<div><div class="leg-tag">Jour '+s.startDay+(s.endDay>s.startDay?'\u2013'+s.endDay:'')+' \u00B7 '+s.nights+' nuit'+(s.nights>1?'s':'')+'</div>'
        + '<div class="leg-name">'+esc(s.loc)+'</div>'
        + (p.desc ? '<div class="leg-hook">'+esc(p.desc)+'</div>' : '')
        + '</div></div>';

      /* cartes hébergement + restaurant/wellness si présents sur le premier jour de l'étape */
      let cards = '';
      if (p.night && p.night.acc && stayById[p.night.acc]) {
        const a = stayById[p.night.acc];
        cards += '<div class="card" style="--bg:'+rgbaBg+';--b:'+rgbaB+';--c:'+color+'">'
          + '<div class="card-label">\u{1F3E1} H\u00E9bergement</div>'
          + '<div class="card-name">'+esc(a.n)+'</div>'
          + '<div class="card-desc">'+esc(a.type)+' \u00B7 '+esc(a.loc)+(a.blurb?' \u2014 '+esc(a.blurb):'')+'</div>'
          + '<div class="card-price" style="color:'+color+'">'+eur(a.price)+' / nuit \u00B7 '+a.nights+' nuit'+(a.nights>1?'s':'')+'</div>'
          + '</div>';
      }
      if (p.restaurant) {
        cards += '<div class="card" style="--bg:'+hexA(palette.food||'#C98A52',0.07)+';--b:'+hexA(palette.food||'#C98A52',0.22)+';--c:'+(palette.food||'#C98A52')+'">'
          + '<div class="card-label">'+CAT_EMOJI.food+' Table</div>'
          + '<div class="card-name">'+esc(p.restaurant.name)+'</div>'
          + '<div class="card-desc">'+esc(p.restaurant.type||'')+(p.restaurant.note?' \u2014 '+esc(p.restaurant.note):'')+'</div>'
          + (p.restaurant.price ? '<div class="card-note">'+esc(p.restaurant.price)+'</div>' : '')
          + '</div>';
      }
      if (p.wellness) {
        cards += '<div class="card" style="--bg:'+hexA(palette.spa||'#E8A0A0',0.07)+';--b:'+hexA(palette.spa||'#E8A0A0',0.22)+';--c:'+(palette.spa||'#E8A0A0')+'">'
          + '<div class="card-label">'+CAT_EMOJI.spa+' Bien-\u00EAtre</div>'
          + '<div class="card-name">'+esc(p.wellness.name)+'</div>'
          + '<div class="card-desc">'+esc(p.wellness.type||'')+(p.wellness.note?' \u2014 '+esc(p.wellness.note):'')+'</div>'
          + (p.wellness.price ? '<div class="card-note">'+esc(p.wellness.price)+'</div>' : '')
          + '</div>';
      }
      if (cards) sectionHTML += '<div class="cards">'+cards+'</div>';
    }

    /* jour individuel */
    const moments = p.moments.map(function(m){
      const glyph = dayMomentIcon[m[1]] || '\u2022';
      return '<div class="moment"><span class="mo-time">'+esc(m[0])+'</span><span class="mo-glyph" style="color:'+color+'">'+glyph+'</span>'
        + '<div class="mo-text"><span class="mo-title">'+esc(m[2])+'</span>'+(m[3]?'<span class="mo-detail">'+esc(m[3])+'</span>':'')+'</div></div>';
    }).join('');
    sectionHTML += '<div class="day">'
      + '<div class="day-head"><span class="day-num" style="color:'+color+'">'+String(p.n).padStart(2,'0')+'</span>'
      + '<div><h3>'+esc(p.title)+'</h3><p class="day-loc">'+esc(p.loc)+'</p></div></div>'
      + '<div class="moments">'+moments+'</div>'
      + (p.tip ? '<p class="day-tip" style="color:'+color+'">'+esc(p.tip)+'</p>' : '')
      + '</div>';

    /* fin d'étape ? */
    dayInStop++;
    if (dayInStop >= stops[stopIdx].nights) { dayInStop = 0; stopIdx++; sectionHTML += '</section>'; }
  });

  /* ── pépites cachées ── */
  const gemsHTML = (it.gems && it.gems.length) ? '<section class="leg-section"><div class="leg-head" style="--c:'+(palette.culture||'#B07EB0')+'">'
    + '<div class="leg-num">\u2726</div><div><div class="leg-tag">R\u00E9capitulatif</div><div class="leg-name">Adresses secr\u00E8tes</div></div></div>'
    + '<div class="cards">' + it.gems.map(function(g){
        const color = palette.culture || '#B07EB0';
        return '<div class="card" style="--bg:'+hexA(color,0.07)+';--b:'+hexA(color,0.22)+';--c:'+color+'">'
          + '<div class="card-label">\u2726 Pépite</div>'
          + '<div class="card-name">'+esc(g.name)+'</div>'
          + (g.loc ? '<div class="card-note" style="margin-top:0">'+esc(g.loc)+'</div>' : '')
          + (g.desc ? '<div class="card-desc">'+esc(g.desc)+'</div>' : '')
          + (g.tip ? '<div class="card-note">'+esc(g.tip)+'</div>' : '')
          + '</div>';
      }).join('') + '</div></section>' : '';

  /* ── informations pratiques ── */
  const essentials = it.essentials || {};
  const essentialsHTML = (essentials.toKnow || essentials.bestTime || essentials.visa) ? '<section class="leg-section"><div class="leg-head" style="--c:#9c7c44">'
    + '<div class="leg-num">\u2139</div><div><div class="leg-tag">Pratique</div><div class="leg-name">Informations essentielles</div></div></div>'
    + '<div class="essentials">'
    + (essentials.bestTime ? '<p><span>P\u00E9riode</span>'+esc(essentials.bestTime)+'</p>' : '')
    + (essentials.visa ? '<p><span>Visa</span>'+esc(essentials.visa)+'</p>' : '')
    + (essentials.toKnow ? essentials.toKnow.map(function(t){ return '<p><span>\u2022</span>'+esc(t)+'</p>'; }).join('') : '')
    + '</div></section>' : '';

  /* ── budget ── */
  const stayRows = it.accommodations.map(function(a){
    return '<tr><td class="city">'+esc(a.loc)+'</td><td>'+a.nights+'</td><td>'+esc(a.type)+'</td><td class="price">'+eur(a.price)+' / nuit</td><td class="price">'+eur(a.price*a.nights)+'</td></tr>';
  }).join('');
  const stayTotal = it.accommodations.reduce(function(s,a){return s+a.price*a.nights;},0);
  const budgetHTML = '<section class="leg-section" style="border-bottom:none"><div class="leg-head" style="--c:#C9965A">'
    + '<div class="leg-num" style="font-size:2.4rem">\u20AC</div><div><div class="leg-tag">Estimation</div><div class="leg-name">Budget du voyage</div></div></div>'
    + '<table><tr><th>\u00C9tape</th><th>Nuits</th><th>Type</th><th>Prix/nuit</th><th>Total</th></tr>'
    + stayRows
    + '<tr class="total-row"><td colspan="4">H\u00E9bergement ('+travelerLabel()+')</td><td class="price" style="color:#C9965A">'+eur(stayTotal)+'</td></tr>'
    + '<tr class="total-row" style="border-top-color:#C9965A"><td colspan="4"><strong>Total voyage estim\u00E9 (tout compris)</strong></td><td class="price" style="color:#C9965A;font-size:1.05rem"><strong>'+eur(it.budgetTotal)+'</strong></td></tr>'
    + '</table></section>';

  const html = '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
    + '<title>'+esc(it.dest)+' \u2014 Hic Sunt</title>'
    + '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    + '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;1,300;1,500&family=Epilogue:wght@200;300;400;500&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{margin:0;padding:0;box-sizing:border-box}'
    + 'html{scroll-behavior:smooth}'
    + 'body{background:'+bgTheme.bg+';color:'+bgTheme.ink+';font-family:Epilogue,sans-serif;font-weight:300;line-height:1.7;-webkit-font-smoothing:antialiased}'
    + '.close-btn{position:fixed;top:18px;right:18px;width:38px;height:38px;border-radius:50%;background:'+bgTheme.ink+';color:'+bgTheme.bg+';border:none;font-size:18px;font-family:Epilogue,sans-serif;cursor:pointer;z-index:99;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.3)}'
    + '.hero{padding:4.5rem 2.5rem 3rem;position:relative;overflow:hidden}'
    + '.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 55% at 20% 15%, '+hexA(palette.hike||'#7BAE6E',0.14)+' 0%, transparent 60%),radial-gradient(ellipse 55% 75% at 80% 65%, '+hexA(palette.beach||'#5B9FBE',0.1)+' 0%, transparent 55%)}'
    + '.hero-eyebrow{font-size:.6rem;letter-spacing:.4em;text-transform:uppercase;color:'+(palette.hike||'#7BAE6E')+';margin-bottom:1.2rem;position:relative;z-index:2}'
    + '.hero h1{font-family:Fraunces,serif;font-weight:300;font-size:clamp(2.6rem,9vw,4.2rem);line-height:1;margin-bottom:1.4rem;position:relative;z-index:2}'
    + '.hero h1 em{font-style:italic;color:'+(palette.hike||'#7BAE6E')+'}'
    + '.hero-pills{display:flex;flex-wrap:wrap;gap:.5rem;position:relative;z-index:2;margin-bottom:1.2rem}'
    + '.pill{font-size:.62rem;letter-spacing:.08em;padding:.3rem .85rem;border-radius:20px;border:1px solid;font-weight:400}'
    + '.hero-meta{font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;color:'+bgTheme.sub+';position:relative;z-index:2}'
    + '.hero-tag{font-family:Fraunces,serif;font-style:italic;font-size:1rem;color:'+(palette.hike||'#7BAE6E')+';margin-bottom:1rem;position:relative;z-index:2}'
    + '.timeline-wrap{background:'+bgTheme.panel+';border-top:1px solid rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.04);padding:1.6rem 1.5rem;overflow-x:auto}'
    + '.tl-label{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:'+bgTheme.sub+';margin-bottom:1.2rem}'
    + '.timeline{display:flex;gap:1.4rem;width:max-content}'
    + '.tl-stop{flex:none;min-width:88px;position:relative;padding-top:18px}'
    + '.tl-stop::before{content:"";position:absolute;top:6px;left:-16px;right:-16px;height:1px;background:rgba(255,255,255,.08)}'
    + '.tl-stop.start::before{left:6px}.tl-stop.end::before{right:6px}'
    + '.tl-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--c);background:'+bgTheme.bg+';position:absolute;top:0;left:0}'
    + '.tl-city{font-family:Fraunces,serif;font-size:.78rem;color:'+bgTheme.ink+';white-space:nowrap;margin-bottom:.1rem}'
    + '.tl-dates{font-size:.54rem;color:var(--c);letter-spacing:.06em;white-space:nowrap}'
    + '.tl-nights{font-size:.5rem;color:'+bgTheme.sub+';white-space:nowrap}'
    + '.legend-bar{background:'+bgTheme.panel+';border-bottom:1px solid rgba(255,255,255,.04);padding:1rem 2.5rem;display:flex;flex-wrap:wrap;gap:1.1rem}'
    + '.legend-item{display:flex;align-items:center;gap:.4rem;font-size:.6rem;letter-spacing:.08em;text-transform:uppercase}'
    + '.legend-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}'
    + '.leg-section{padding:2.6rem 2.5rem;border-bottom:1px solid rgba(255,255,255,.05)}'
    + '.leg-head{display:flex;gap:1.2rem;align-items:flex-start;margin-bottom:1.6rem}'
    + '.leg-num{font-family:Fraunces,serif;font-size:2.6rem;font-weight:300;color:var(--c);opacity:.35;line-height:1;flex-shrink:0}'
    + '.leg-tag{font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;color:var(--c);margin-bottom:.25rem}'
    + '.leg-name{font-family:Fraunces,serif;font-size:1.5rem;font-weight:300;color:'+bgTheme.ink+';line-height:1.15;margin-bottom:.25rem}'
    + '.leg-hook{font-family:Fraunces,serif;font-style:italic;font-size:.82rem;color:'+bgTheme.sub+'}'
    + '.cards{display:grid;gap:.7rem;margin-bottom:1.6rem}'
    + '@media(min-width:640px){.cards{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}}'
    + '.card{border-radius:8px;padding:1rem 1.1rem;border:1px solid var(--b);background:var(--bg)}'
    + '.card-label{font-size:.55rem;letter-spacing:.25em;text-transform:uppercase;font-weight:500;color:var(--c);margin-bottom:.5rem}'
    + '.card-name{font-family:Fraunces,serif;font-size:.95rem;font-weight:300;color:'+bgTheme.ink+';margin-bottom:.3rem;line-height:1.3}'
    + '.card-desc{font-size:.74rem;color:'+bgTheme.sub+';line-height:1.6}'
    + '.card-note{margin-top:.4rem;font-size:.68rem;color:#D4C9A8;opacity:.75;font-style:italic}'
    + '.card-price{margin-top:.4rem;font-size:.68rem;font-weight:500}'
    + '.day{margin-bottom:1.1rem;page-break-inside:avoid;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.04);border-radius:6px;padding:1rem 1.2rem}'
    + '.day:last-child{margin-bottom:0}'
    + '.day-head{display:flex;gap:.9rem;align-items:flex-start;margin-bottom:.5rem}'
    + '.day-num{font-family:Fraunces,serif;font-size:1.5rem;font-weight:300;line-height:1;min-width:38px}'
    + '.day-head h3{font-family:Fraunces,serif;font-weight:300;font-size:1rem;color:'+bgTheme.ink+';margin-bottom:.1rem}'
    + '.day-loc{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:'+bgTheme.sub+'}'
    + '.moments{margin-left:50px;border-left:1px solid rgba(255,255,255,.06);padding-left:16px}'
    + '.moment{display:flex;align-items:flex-start;gap:10px;padding:5px 0;font-size:.78rem}'
    + '.mo-time{font-size:.62rem;letter-spacing:.06em;color:'+bgTheme.sub+';min-width:38px;padding-top:1px}'
    + '.mo-glyph{font-size:.78rem;line-height:1.5;min-width:12px}'
    + '.mo-text{display:flex;flex-direction:column;gap:1px}'
    + '.mo-title{color:'+bgTheme.ink+'}'
    + '.mo-detail{color:'+bgTheme.sub+';font-size:.68rem}'
    + '.day-tip{margin:.6rem 0 0 50px;font-size:.7rem;font-style:italic;opacity:.85}'
    + '.essentials p{font-size:.78rem;margin-bottom:.5rem;display:flex;gap:.5rem;color:#D4C9A8}'
    + '.essentials p span{color:#9c7c44;font-weight:500;text-transform:uppercase;letter-spacing:.08em;font-size:.62rem;min-width:90px;flex-shrink:0}'
    + 'table{width:100%;border-collapse:collapse}'
    + 'th{text-align:left;font-size:.55rem;letter-spacing:.25em;text-transform:uppercase;color:#9c7c44;font-weight:400;padding:.5rem .6rem;border-bottom:1px solid rgba(255,255,255,.06)}'
    + 'td{padding:.6rem .6rem;font-size:.74rem;color:'+bgTheme.sub+';border-bottom:1px solid rgba(255,255,255,.03)}'
    + 'td.city{color:'+bgTheme.ink+'}'
    + 'td.price{color:'+bgTheme.ink+';font-weight:500}'
    + '.total-row td{border-top:1px solid rgba(201,150,90,.3);color:'+bgTheme.ink+';font-weight:500;padding-top:1rem}'
    + '.foot{padding:2.6rem 2.5rem;text-align:center;border-top:1px solid rgba(255,255,255,.04)}'
    + '.foot h3{font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:1.5rem;color:'+(palette.hike||'#7BAE6E')+';margin-bottom:.4rem}'
    + '.foot p{font-size:.6rem;color:'+bgTheme.sub+';letter-spacing:.2em;text-transform:uppercase}'
    + '.foot-line{width:32px;height:1px;background:'+(palette.hike||'#7BAE6E')+';opacity:.3;margin:.8rem auto}'
    + '@media print{.close-btn{display:none}}'
    + '@media(min-width:640px){.hero,.timeline-wrap,.legend-bar,.leg-section,.foot{padding-left:4rem;padding-right:4rem}}'
    + '</style></head><body>'
    + '<button class="close-btn" onclick="window.close()" aria-label="Fermer">\u2715</button>'
    + '<section class="hero"><div class="hero-bg"></div>'
    + '<div class="hero-eyebrow">Itin\u00E9raire compos\u00E9 \u00B7 Hic Sunt \u00B7 '+esc(it.country||it.dest)+'</div>'
    + '<h1>'+esc(it.dest)+'</h1>'
    + '<div class="hero-tag">'+esc(it.tag)+'</div>'
    + '<div class="hero-pills">'
    + '<span class="pill" style="color:'+(palette.hike||'#7BAE6E')+';border-color:'+hexA(palette.hike||'#7BAE6E',0.25)+'">'+esc(it.dates)+'</span>'
    + '<span class="pill" style="color:'+(palette.beach||'#5B9FBE')+';border-color:'+hexA(palette.beach||'#5B9FBE',0.25)+'">'+it.days+' jours</span>'
    + '<span class="pill" style="color:'+(palette.food||'#C98A52')+';border-color:'+hexA(palette.food||'#C98A52',0.25)+'">'+esc(it.level)+'</span>'
    + '<span class="pill" style="color:#D4C9A8;border-color:rgba(212,201,168,.25)">'+travelerLabel()+'</span>'
    + '</div>'
    + '<div class="hero-meta">'+esc(it.coords||'')+(it.season?' \u00B7 '+esc(it.season):'')+'</div>'
    + '</section>'
    + '<div class="timeline-wrap"><div class="tl-label">Circuit complet</div><div class="timeline">'+timelineHTML+'</div></div>'
    + '<div class="legend-bar">'+legendHTML+'</div>'
    + sectionHTML
    + gemsHTML
    + essentialsHTML
    + budgetHTML
    + '<div class="foot"><h3>Beau voyage \u2728</h3><div class="foot-line"></div>'
    + '<p>'+esc(it.dest)+' \u00B7 '+esc(it.dates)+' \u00B7 Hic Sunt \u00B7 Beyond the Known</p></div>'
    + '</body></html>';

  win.document.write(html);
  win.document.close();
}

/* ── 24 · Partage ───────────────────────────────────────────────────── */
function shareLink(){
  const it = ITINERARY;
  return 'https://hic-suntapp.vercel.app/?voyage=' + encodeURIComponent((it.dest||'').toLowerCase().replace(/\s+/g,'-'));
}
async function copyShareLink(){
  try{
    await navigator.clipboard.writeText(shareLink());
    toast('Lien copié');
  }catch(e){ toast('Impossible de copier le lien'); }
}
async function sendShareLink(){
  const it = ITINERARY;
  const text = 'Découvre cet itinéraire ' + (it.dest||'') + ' composé par Hic Sunt : ' + shareLink();
  if (navigator.share){
    try{ await navigator.share({ title:'Hic Sunt · '+(it.dest||''), text:text, url:shareLink() }); }
    catch(e){ /* annulé par l'utilisateur */ }
  } else {
    try{ await navigator.clipboard.writeText(text); toast('Lien copié — collez-le dans Messages'); }
    catch(e){ toast('Partage indisponible sur ce navigateur'); }
  }
}
function shareView(){
  const it = ITINERARY;
  return statusBar() + navbar('Partager le voyage')
    + '<div class="ov-scroll px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">' + esc(it.dest) + ' · ' + it.days + ' jours</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Partager ce voyage</h1>'
    +   '<div class="row" onclick="copyShareLink()"><span class="r-ico">' + ico('link',19,1.5) + '</span><div class="r-main"><div class="r-t">Copier le lien</div><div class="r-s">Lecture seule</div></div><span class="r-chev">' + ico('chevron',17,1.6) + '</span></div>'
    +   '<div class="row" onclick="sendShareLink()"><span class="r-ico">' + ico('share',18,1.5) + '</span><div class="r-main"><div class="r-t">Envoyer par message</div><div class="r-s">iMessage · WhatsApp</div></div><span class="r-chev">' + ico('chevron',17,1.6) + '</span></div>'
    +   '<div class="row" onclick="exportPDF()"><span class="r-ico">' + ico('doc',19,1.5) + '</span><div class="r-main"><div class="r-t">Exporter en PDF</div><div class="r-s">Itinéraire complet</div></div><span class="r-chev">' + ico('chevron',17,1.6) + '</span></div>'
    + '</div>';
}

/* ── 25 · Hors-ligne ────────────────────────────────────────────────── */
const OFFLINE_ASSETS = [
  ['map','Cartes hors-ligne','24 Mo'],
  ['doc','Itinéraire & documents','3 Mo'],
  ['ticket','Réservations','1 Mo'],
  ['camera','Médias des étapes','58 Mo'],
];
function offlineView(){
  return statusBar() + navbar('Hors-ligne')
    + '<div class="ov-scroll px">'
    +   '<div class="dl-ring"><div class="dl-pct" data-dl-pct>0 %</div>'
    +   '<div class="dl-l" data-dl-label>Préparation…</div>'
    +   '<div class="dl-bar"><i data-dl-bar></i></div></div>'
    +   '<div class="section-h"><h2>Contenu du voyage</h2><span class="meta">86 Mo</span></div>'
    +   OFFLINE_ASSETS.map(function(a, i){
        return '<div class="asset" data-asset="' + i + '">' + ico(a[0], 19, 1.5)
          + '<span class="as-n">' + a[1] + '</span><span class="as-s">' + a[2] + '</span>'
          + '<span class="as-ok">' + ico('check', 16, 2) + '</span></div>';
      }).join('')
    + '</div>';
}
function runDownload(el){
  let pct = 0;
  const t = setInterval(function(){
    if (!el.isConnected){ clearInterval(t); return; }
    pct = Math.min(100, pct + 3 + Math.round(Math.random() * 4));
    const p = el.querySelector('[data-dl-pct]'), b = el.querySelector('[data-dl-bar]'), l = el.querySelector('[data-dl-label]');
    if (p) p.textContent = pct + ' %';
    if (b) b.style.width = pct + '%';
    const done = Math.floor(pct / 100 * OFFLINE_ASSETS.length);
    for (let i = 0; i < done; i++){
      const a = el.querySelector('[data-asset="' + i + '"]');
      if (a) a.classList.add('done');
    }
    if (pct >= 100){
      clearInterval(t);
      const as = el.querySelectorAll('.asset');
      for (let i = 0; i < as.length; i++) as[i].classList.add('done');
      if (l) l.textContent = 'Disponible hors-ligne';
    }
  }, 200);
}
/* lancement auto à l'ouverture de l'overlay offline */
function openOffline(){
  const el = openOverlay('offline', offlineView());
  setTimeout(function(){ runDownload(el); }, 480);
}
