/* ── HIC SUNT · Sillage — écrans détail ─────────────────────────────── */

/* ── Carte géographique — redéfinition forcée (remplace features.js) ── */
var GEO_SHAPES_SD = {
  'sardaigne':{vb:'0 0 100 160',path:'M50,6 C56,6 63,9 68,14 C73,19 75,26 76,33 C77,40 74,46 76,53 C78,60 82,65 80,73 C78,81 73,86 70,93 C67,100 67,108 63,116 C59,124 53,130 46,134 C39,138 31,136 25,130 C19,124 17,116 17,108 C17,100 20,93 20,85 C20,77 16,70 17,62 C18,54 23,48 25,40 C27,32 25,23 29,16 C33,9 42,6 50,6Z',cities:{'Cagliari':[46,126],'Oristano':[28,80],'Nuoro':[58,62],'Sassari':[32,24],'Alghero':[20,34],'Olbia':[68,22],'Villasimius':[66,130],'Chia':[36,138],'Barumini':[46,102]}},
  'sicile':{vb:'0 0 200 130',path:'M8,75 C12,58 20,42 34,30 C48,18 64,10 82,8 C100,6 118,10 134,18 C150,26 162,38 170,52 C178,66 178,82 172,94 C166,106 154,114 140,118 C126,122 110,120 94,116 C78,112 62,104 48,96 C34,88 18,94 10,88 C2,82 4,92 8,75Z',cities:{'Palerme':[52,28],'Catane':[148,82],'Messine':[174,38],'Agrigente':[76,104],'Siracuse':[162,96],'Trapani':[18,42]}},
  'éoliennes':{vb:'0 0 180 120',path:'M58,52 C64,44 74,40 82,44 C90,48 92,58 88,66 C84,74 74,78 66,74 C58,70 52,60 58,52Z M30,72 C35,62 46,58 54,62 C62,66 62,78 56,84 C50,90 38,88 32,82 C26,76 25,82 30,72Z M140,22 C146,16 156,16 162,22 C168,28 166,38 160,42 C154,46 144,44 140,38 C136,32 134,28 140,22Z M100,68 C104,62 112,62 116,68 C120,74 118,82 112,84 C106,86 100,82 98,76 C96,70 96,74 100,68Z M76,14 C80,10 86,10 90,14 C94,18 92,26 88,28 C84,30 78,28 76,22 C74,16 72,18 76,14Z',cities:{'Lipari':[74,58],'Vulcano':[42,78],'Stromboli':[150,30],'Salina':[106,74],'Panarea':[83,20]}},
  'corse':{vb:'0 0 70 140',path:'M36,6 C42,6 50,10 55,18 C60,26 60,36 58,46 C56,56 60,64 58,74 C56,84 50,90 48,100 C46,110 48,120 44,128 C40,136 32,138 26,132 C20,126 18,116 18,106 C18,96 20,86 20,76 C20,66 16,56 16,46 C16,36 18,26 22,18 C26,10 30,6 36,6Z',cities:{'Ajaccio':[22,88],'Bastia':[54,22],'Bonifacio':[40,132],'Corte':[40,64]}},
  'malte':{vb:'0 0 80 60',path:'M8,30 C12,18 24,10 38,8 C52,6 66,12 72,24 C78,36 74,50 62,56 C50,62 34,60 22,54 C10,48 4,42 8,30Z',cities:{'La Valette':[48,28]}},
  'thaïlande':{vb:'0 0 110 220',path:'M28,8 C38,4 54,4 66,8 C78,12 86,20 88,32 C90,44 84,56 82,68 C80,78 82,88 78,96 C74,102 66,104 62,110 C58,116 58,122 56,128 C54,134 50,138 48,144 C46,150 46,156 44,162 C42,168 40,174 38,180 C36,186 34,192 32,198 C30,204 30,210 28,214 L26,216 C24,212 24,206 26,200 C28,194 30,188 32,182 C34,176 34,170 36,164 C38,158 40,152 42,146 C44,140 44,134 46,128 C48,122 52,116 54,110 C56,104 60,98 62,92 C64,86 62,78 64,70 C66,62 70,54 72,44 C74,34 72,22 66,14 C60,6 48,6 40,8 L28,8Z',cities:{'Bangkok':[60,96],'Chiang Mai':[36,22],'Phuket':[34,180],'Koh Samui':[52,148],'Ayutthaya':[58,78],'Pai':[32,14],'Krabi':[38,168]}},
  'maroc':{vb:'0 0 150 130',path:'M18,14 C30,8 48,8 64,10 C80,12 94,18 104,28 C114,38 118,52 116,66 C114,80 106,90 96,98 C86,106 72,110 58,112 C44,114 30,110 18,102 C6,94 2,80 2,66 C2,52 6,36 10,26 C14,16 6,20 18,14Z',cities:{'Marrakech':[64,80],'Casablanca':[28,46],'Fès':[80,32],'Agadir':[28,100],'Essaouira':[14,72],'Chefchaouen':[56,16],'Merzouga':[120,82]}},
  'portugal':{vb:'0 0 55 120',path:'M28,6 C36,4 44,8 48,16 C52,24 50,34 50,44 C50,54 52,64 50,74 C48,84 44,92 40,100 C36,108 34,116 28,118 C22,120 16,114 12,106 C8,98 8,86 8,74 C8,62 10,50 10,38 C10,26 8,14 14,8 C20,2 20,8 28,6Z',cities:{'Lisbonne':[24,80],'Porto':[22,28],'Faro':[36,112],'Évora':[36,82],'Coimbra':[22,50]}},
  'espagne':{vb:'0 0 200 160',path:'M16,60 C20,40 32,22 50,14 C68,6 90,4 112,6 C134,8 154,14 168,26 C182,38 188,54 186,70 C184,86 174,100 162,110 C150,120 134,126 116,130 C98,134 78,134 60,128 C42,122 26,112 16,98 C6,84 12,80 16,60Z',cities:{'Madrid':[96,70],'Barcelone':[162,38],'Séville':[44,108],'Grenade':[90,118],'Valence':[150,70]}},
  'italie':{vb:'0 0 110 220',path:'M30,8 C40,4 52,6 60,12 C68,18 70,28 68,38 C66,48 60,54 58,64 C56,74 58,84 56,94 C54,104 50,112 48,122 C46,132 44,142 42,152 C40,162 38,170 40,178 C42,186 48,192 48,198 C48,204 44,208 40,206 C36,204 34,198 32,192 C30,186 28,178 30,170 C32,162 36,154 38,146 C40,138 40,128 42,118 C44,108 46,98 46,88 C46,78 44,68 44,58 C44,48 42,38 40,28 C38,18 28,14 28,8Z M56,198 C62,194 70,196 74,202 C78,208 74,214 68,216 C62,218 56,214 54,208 C52,202 50,202 56,198Z',cities:{'Rome':[46,122],'Milan':[34,28],'Florence':[44,82],'Naples':[56,148],'Venise':[62,44],'Bari':[72,148]}},
  'grèce':{vb:'0 0 160 140',path:'M40,14 C54,8 70,8 84,12 C98,16 108,24 114,36 C120,48 118,62 112,74 C106,82 96,86 88,94 C80,102 76,112 68,118 C60,124 50,124 42,118 C34,112 28,102 28,92 C28,82 32,72 30,62 C28,52 22,44 22,34 C22,24 26,20 40,14Z M82,114 C88,110 96,112 100,118 C104,124 102,132 96,136 C90,140 82,138 78,132 C74,126 76,118 82,114Z M116,90 C122,86 130,88 134,96 C138,104 134,112 128,114 C122,116 114,112 112,104 C110,96 110,94 116,90Z',cities:{'Athènes':[74,86],'Thessalonique':[80,18],'Santorin':[118,104],'Mykonos':[120,82],'Corfou':[18,52],'Rhodes':[144,106]}},
  'islande':{vb:'0 0 220 110',path:'M20,60 C18,46 24,32 36,22 C48,12 64,8 82,6 C100,4 118,8 134,14 C150,20 162,30 170,44 C178,58 178,74 170,86 C162,98 148,104 132,108 C116,112 98,110 80,108 C62,106 44,100 30,90 C16,80 14,70 10,62 C14,58 18,62 20,60Z',cities:{'Reykjavik':[36,82],'Akureyri':[98,18],'Vik':[94,98]}},
  'pérou':{vb:'0 0 110 150',path:'M18,14 C28,6 44,4 58,8 C72,12 84,22 90,36 C96,50 94,66 90,80 C86,94 78,106 72,118 C66,130 62,140 54,144 C46,148 36,144 28,136 C20,128 16,116 14,104 C12,92 12,78 14,66 C16,54 14,40 14,28 C14,22 12,22 18,14Z',cities:{'Lima':[14,78],'Cusco':[64,108],'Machu Picchu':[54,98],'Arequipa':[34,120]}},
  'kenya':{vb:'0 0 110 120',path:'M22,10 C36,4 54,4 68,8 C82,12 92,22 98,36 C104,50 102,66 98,80 C94,94 84,104 70,110 C56,116 40,116 26,110 C12,104 4,92 4,78 C4,64 8,50 10,36 C12,22 8,16 22,10Z',cities:{'Nairobi':[54,68],'Mombasa':[86,100],'Masai Mara':[26,80],'Amboseli':[56,96]}},
  'bali':{vb:'0 0 150 80',path:'M14,40 C18,24 32,14 50,10 C68,6 88,8 106,14 C124,20 136,30 140,44 C144,58 136,68 122,72 C108,76 90,74 72,72 C54,70 36,66 22,58 C8,50 10,56 14,40Z',cities:{'Ubud':[78,42],'Seminyak':[36,50],'Canggu':[28,44],'Amed':[126,36]}},
  'sri lanka':{vb:'0 0 80 120',path:'M40,6 C50,6 60,12 66,22 C72,32 72,44 70,56 C68,68 64,80 58,90 C52,100 46,108 40,112 C34,116 26,112 20,104 C14,96 12,84 12,72 C12,60 14,48 18,38 C22,28 24,18 30,12 C36,6 30,6 40,6Z',cities:{'Colombo':[18,72],'Kandy':[44,54],'Galle':[28,104],'Sigiriya':[50,38],'Ella':[56,78]}},
  'maldives':{vb:'0 0 50 180',path:'M25,8 C29,6 33,10 31,16 C29,22 23,22 21,16 C19,10 21,10 25,8Z M24,36 C28,32 34,34 34,40 C34,46 28,50 24,46 C20,42 20,40 24,36Z M26,64 C31,60 37,64 35,70 C33,76 27,76 25,70 C23,64 21,68 26,64Z M23,92 C28,88 34,92 32,98 C30,104 24,104 22,98 C20,92 18,96 23,92Z M25,118 C30,114 36,118 34,124 C32,130 26,130 24,124 C22,118 20,122 25,118Z M24,146 C29,142 35,146 33,152 C31,158 25,158 23,152 C21,146 19,150 24,146Z',cities:{'Malé':[26,94]}},
  'japon':{vb:'0 0 160 200',path:'M90,10 C100,8 110,12 116,20 C122,28 120,40 116,52 C112,64 106,74 102,86 C98,98 96,112 90,122 C84,132 76,138 70,148 C64,158 60,168 54,176 C48,184 40,188 34,184 C28,180 26,170 28,160 C30,150 36,142 40,132 C44,122 46,110 50,100 C54,90 58,80 60,70 C62,60 60,50 62,40 C64,30 70,22 80,14 L90,10Z M118,8 C128,4 140,8 148,16 C156,24 156,38 150,46 C144,54 134,56 126,50 C118,44 114,34 116,24 C118,14 108,12 118,8Z M30,170 C36,162 46,160 52,166 C58,172 56,184 50,188 C44,192 34,190 30,182 C26,174 24,178 30,170Z',cities:{'Tokyo':[88,92],'Kyoto':[68,122],'Osaka':[64,128],'Hiroshima':[48,138],'Sapporo':[130,20],'Fukuoka':[36,166]}},
  'jordanie':{vb:'0 0 100 120',path:'M48,8 C60,8 72,14 80,24 C88,34 90,48 88,62 C86,76 78,88 68,96 C58,104 44,108 32,104 C20,100 10,90 8,78 C6,66 10,52 16,40 C22,28 26,16 36,10 C46,4 36,8 48,8Z',cities:{'Amman':[48,44],'Pétra':[38,84],'Wadi Rum':[44,100],'Aqaba':[36,108]}},
  '_default':{vb:'0 0 120 120',path:'M60,8 C74,8 86,16 94,28 C102,40 104,56 100,70 C96,84 86,94 74,102 C62,110 46,112 34,106 C22,100 12,88 8,74 C4,60 6,44 14,32 C22,20 34,10 48,8 Z',cities:{}}
};
function _geoShapeSD(dest){
  var d=(dest||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  var keys=Object.keys(GEO_SHAPES_SD).filter(function(k){return k!=='_default';});
  for(var i=0;i<keys.length;i++){
    var kn=keys[i].normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(d.includes(kn))return{key:keys[i],g:GEO_SHAPES_SD[keys[i]]};
  }
  /* Aliases étendus */
  if(/eolienn|lipari|stromboli|vulcano/.test(d))return{key:'éoliennes',g:GEO_SHAPES_SD['éoliennes']};
  if(/sicil|palerm|catane|agrigente/.test(d))return{key:'sicile',g:GEO_SHAPES_SD.sicile};
  if(/corse|ajaccio|bastia/.test(d))return{key:'corse',g:GEO_SHAPES_SD.corse};
  if(/malte|valette/.test(d))return{key:'malte',g:GEO_SHAPES_SD.malte};
  if(/sri lanka|colombo|kandy|galle/.test(d))return{key:'sri lanka',g:GEO_SHAPES_SD['sri lanka']};
  if(/maldiv|male|atoll/.test(d))return{key:'maldives',g:GEO_SHAPES_SD.maldives};
  if(/thaïlande|thai|bangkok|phuket|chiang/.test(d))return{key:'thaïlande',g:GEO_SHAPES_SD['thaïlande']};
  if(/grece|athenes|santorin|mykonos|corfou|rhodes/.test(d))return{key:'grèce',g:GEO_SHAPES_SD['grèce']};
  if(/japon|tokyo|kyoto|osaka|hiroshima|sapporo/.test(d))return{key:'japon',g:GEO_SHAPES_SD.japon};
  if(/maroc|marrakech|casablanca|fes|agadir|tanger/.test(d))return{key:'maroc',g:GEO_SHAPES_SD.maroc};
  if(/espagne|madrid|barcelone|seville|anda|catalogne/.test(d))return{key:'espagne',g:GEO_SHAPES_SD.espagne};
  if(/italie|rome|milan|florence|naples|toscane|amalfi|pouilles|venise|ombrie/.test(d))return{key:'italie',g:GEO_SHAPES_SD.italie};
  if(/portugal|lisbonne|porto|algarve|douro/.test(d))return{key:'portugal',g:GEO_SHAPES_SD.portugal};
  if(/islande|reykjavik/.test(d))return{key:'islande',g:GEO_SHAPES_SD.islande};
  if(/perou|lima|cusco|machu/.test(d))return{key:'pérou',g:GEO_SHAPES_SD['pérou']};
  if(/kenya|nairobi|masai|safari/.test(d))return{key:'kenya',g:GEO_SHAPES_SD.kenya};
  if(/bali|ubud|seminyak|lombok/.test(d))return{key:'bali',g:GEO_SHAPES_SD.bali};
  if(/jordanie|amman|petra|wadi/.test(d))return{key:'jordanie',g:GEO_SHAPES_SD.jordanie};
  if(/sardaigne|cagliari|nuoro|sassari|olbia/.test(d))return{key:'sardaigne',g:GEO_SHAPES_SD.sardaigne};
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
    +   '<div class="wash" style="background:' + d.bg + '"></div>'
    +   '<div class="wm">' + ico(d.i, 132, 1) + '</div>'
    +   '<div class="veil"></div>'
    +   '<div class="navbar on-dark" style="position:absolute;top:0;left:0;right:0;z-index:10">'
    +     '<button class="nav-btn ghost" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +     '<button class="nav-btn ghost" onclick="toast(\'Lien copié\')" aria-label="Partager">' + ico('share',18,1.5) + '</button>'
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
  /* Globe animé centré — même identité que le splash */
  const globe = '<svg class="gen-globe" viewBox="0 0 120 120" fill="none">'
    + '<circle class="sg-ring" cx="60" cy="60" r="54"/>'
    + '<ellipse class="sg-mer" cx="60" cy="60" rx="22" ry="54"/>'
    + '<ellipse class="sg-mer sg-mer2" cx="60" cy="60" rx="44" ry="54"/>'
    + '<line class="sg-eq" x1="6" y1="60" x2="114" y2="60"/>'
    + '<line class="sg-tick" x1="60" y1="2" x2="60" y2="12"/>'
    + '<line class="sg-tick" x1="60" y1="108" x2="60" y2="118"/>'
    + '<line class="sg-tick" x1="2" y1="60" x2="12" y2="60"/>'
    + '<line class="sg-tick" x1="108" y1="60" x2="118" y2="60"/>'
    + '</svg>';

  /* Route qui se trace — plus grande, 4 villes */
  const route = '<svg class="gen-route" viewBox="0 0 220 220" fill="none">'
    + '<path d="M28 188 Q55 148 88 142 Q118 136 140 108 Q162 80 192 36"/>'
    + '<circle cx="28" cy="188" r="3.5"/>'
    + '<circle cx="88" cy="142" r="3.5"/>'
    + '<circle cx="140" cy="108" r="3.5"/>'
    + '<circle cx="192" cy="36" r="3.5"/>'
    + '</svg>';

  return '<div class="gen">' + statusBar(true)
    + '<div class="gen-body">'
    /* Logo discret en haut */
    +   '<div class="gen-logo">Hic <em>Sunt</em></div>'
    /* Globe + carte superposés */
    +   '<div class="gen-visual">'
    +     '<div class="gen-globe-wrap">' + globe + '</div>'
    +     '<div class="gen-map">' + graticule(220, 220, 40) + route + '</div>'
    +   '</div>'
    /* Statut en grand italic Spectral */
    +   '<p class="gen-status" data-gen-status>Lecture de vos envies…</p>'
    /* Barre de progression ultra-fine */
    +   '<div class="gen-progress">'
    +     '<div class="gen-progress-track"><div class="gen-progress-fill" data-gen-bar style="width:2%;transition:none"></div></div>'
    +     '<div class="gen-progress-nums">'
    +     '<span class="gen-progress-pct" data-gen-pct>0%</span>'
    +     '<span class="gen-progress-time" data-gen-time>~16s</span>'
    +     '</div>'
    +   '</div>'
    + '</div></div>';
}

/* ── Suggestion de destination (mode "Surprenez-moi") ────────────────── */
function destinationSuggestView(s){
  return '<div class="gen suggest">' + statusBar()
    + '<div class="gen-body">'
    +   '<span style="font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:3.5px;text-transform:uppercase;color:var(--gold-deep)">Destination suggérée</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:48px;letter-spacing:-1.5px;color:var(--ink);line-height:1.0;margin:12px 0 4px;text-align:center">' + esc(s.dest||'') + '</h1>'
    +   '<p style="font-family:var(--serif);font-style:italic;font-size:18px;color:var(--gold-deep);line-height:1.45;margin:0 0 16px;text-align:center">' + esc(s.tagline||'') + '</p>'
    +   '<p style="font-family:var(--serif);font-size:14px;color:var(--ink-soft);line-height:1.6;text-align:center;max-width:280px;margin:0 auto 8px">' + esc(s.teaser||'') + '</p>'
    +   (s.coords?'<div style="font-family:var(--mono);font-size:8px;letter-spacing:2px;color:var(--sub);text-align:center;margin-bottom:24px">'+esc(s.coords)+'</div>':'')
    +   '<div class="sugg-acts">'
    +     '<button class="btn gold" onclick="confirmSuggestedDestination()">' + ico('sparkle',18,1.7) + 'Composer cet itinéraire</button>'
    +     '<button class="btn" style="background:transparent;border:1px solid var(--line);color:var(--ink-soft)" onclick="retrySuggestion()">Proposer une autre destination</button>'
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
  const nDays = it.plan && it.plan.length ? it.plan.length : _days(it);

  /* Couleur accentuée par thème — sobre, une seule couleur vive */
  const ACCENT = {
    mediterranean:'#2878A8', desert:'#B86A28', alpine:'#2A8E68',
    tropical:'#C05020', tropical_io:'#1898B8', steppe:'#4A6E90',
    andean:'#987830', urban_asia:'#8828A0', urban:'#4A48B8',
    savanna:'#6A9828', caribbean:'#1898A0',
  };
  const THEME_LABEL = {
    mediterranean:'Méditerranée', desert:'Désert', alpine:'Montagne',
    tropical:'Tropiques', tropical_io:'Océan Indien', steppe:'Grand Nord',
    andean:'Andes', urban_asia:'Asie', urban:'Métropole',
    savanna:'Savane', caribbean:'Caraïbes',
  };
  const ac = ACCENT[theme] || '#9c7c44';
  const c1 = (palette && palette.beach) || (palette && palette.culture) || ac;
  const themeLabel = THEME_LABEL[theme] || 'Sur-mesure';
  const minimapBg = 'linear-gradient(135deg,' + hexA(ac,0.06) + ' 0%,var(--surface) 100%)';

  return (
    /* ── Navbar ── */
    navbar(it.dest, {
      right: '<button class="nav-btn" onclick="openOverlay(\'share\', shareView())" aria-label="Partager">' + ico('share',18,1.5) + '</button>'
    })

    /* ── Hero éditorial fond clair ── */
    + '<div style="flex:none;padding:0 20px 28px;border-bottom:1px solid var(--line2)">'
    /* Eyebrow thème + coordonnées */
    +   '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">'
    +     '<span style="font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:' + ac + '">' + esc(themeLabel) + '</span>'
    +     '<span style="font-family:var(--mono);font-size:8px;letter-spacing:1.5px;color:var(--sub)">' + esc(it.coords||'') + '</span>'
    +   '</div>'
    /* Titre */
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:44px;letter-spacing:-1.2px;color:var(--ink);line-height:1;margin:0 0 10px">' + esc(it.dest) + '</h1>'
    /* Trait couleur sous le titre */
    +   '<div style="width:48px;height:3px;background:' + ac + ';border-radius:2px;margin-bottom:12px"></div>'
    /* Tagline */
    +   '<p style="font-family:var(--serif);font-style:italic;font-size:14px;color:var(--sub);line-height:1.6;margin:0 0 20px;max-width:280px">' + esc(it.tag) + '</p>'
    /* Pills */
    +   '<div style="display:flex;flex-wrap:wrap;gap:7px">'
    +     '<span style="font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:7px 14px;border-radius:20px;background:' + hexA(ac,0.1) + ';color:' + ac + ';border:1px solid ' + hexA(ac,0.25) + '">' + esc(it.dates) + '</span>'
    +     '<span style="font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:7px 14px;border-radius:20px;background:var(--surface);color:var(--ink-soft);border:1px solid var(--line)">' + esc(it.level) + '</span>'
    +   '</div>'
    + '</div>'

    /* ── Contenu scrollable ── */
    + '<div class="ov-scroll has-foot px">'

    /* Carte */
    + '<div class="minimap" style="margin-top:16px;background:' + minimapBg + '" onclick="openMapOv()">'
    +   geoMapSVG(345, 140, null) + wxChip(wx1[0], wx1[1])
    +   '<span class="mm-cap">' + esc(it.coords || it.dest) + '</span>'
    + '</div>'

    /* Actions */
    + '<div class="tools" style="margin-top:16px">'
    +   '<button class="tool" onclick="openOverlay(\'budget\', budgetView())">'
    +     ico('wallet',20,1.5) + '<div class="tl-t">Budget</div><div class="tl-s">' + eur(it.budgetTotal) + '</div>'
    +   '</button>'
    +   '<button class="tool" onclick="openActivities()">'
    +     ico('ticket',20,1.5) + '<div class="tl-t">Activités</div><div class="tl-s">' + ACTIVITIES.length + ' exp.</div>'
    +   '</button>'
    +   '<button class="tool" onclick="openOverlay(\'gems\', gemsView())">'
    +     ico('star',18,1.5) + '<div class="tl-t">Pépites</div><div class="tl-s">' + ((it.gems||[]).length) + ' adresses</div>'
    +   '</button>'
    +   '<button class="tool" onclick="openAI()">'
    +     ico('sparkle',18,1.5) + '<div class="tl-t">Modifier</div><div class="tl-s">Cartographe</div>'
    +   '</button>'
    + '</div>'

    /* Jours */
    + '<div class="section-h" style="margin-top:8px"><h2>Jour par jour</h2><span class="meta">' + nDays + ' jours</span></div>'
    + it.plan.map(function(p, i){
        if(!p) return '';
        const cc = (p.category && palette[p.category]) || ac;
        const tags = Array.isArray(p.tags) ? p.tags : [];
        const wx = Array.isArray(p.wx) ? p.wx : ['sun','—'];
        return '<div class="dayrow" onclick="openDay(' + i + ')">'
          + '<div class="dr-rail">'
          +   '<span class="dr-pin" style="background:' + cc + ';border-color:' + cc + '">' + p.n + '</span>'
          +   '<span class="dr-line" style="background:' + hexA(cc,0.18) + '"></span>'
          + '</div>'
          + '<div class="dr-main">'
          +   '<div class="dr-top">'
          +     '<div><div class="dr-t">' + esc(p.title||'') + '</div><div class="dr-l">' + esc(p.loc||'') + '</div></div>'
          +     wxChip(wx[0], wx[1])
          +   '</div>'
          +   (p.desc ? '<div class="dr-d">' + esc(p.desc) + '</div>' : '')
          +   (tags.length ? '<div class="dr-tags">' + tags.map(function(t){
                return '<span class="mini-tag" style="color:' + cc + ';border-color:' + hexA(cc,0.25) + ';background:' + hexA(cc,0.07) + '">' + ico(t[0],12,1.7) + t[1] + '</span>';
              }).join('') + '</div>' : '')
          + '</div></div>';
      }).join('')

    /* Hébergements */
    + '<div class="section-h" style="margin-top:8px"><h2>Hébergements</h2><span class="meta">' + it.accommodations.length + ' sélections</span></div>'
    + it.accommodations.map(accCard).join('')
    + '</div>'

    /* Footer */
    + '<div class="ov-foot"><div class="foot-price">'
    +   '<div><div class="fp-v">' + eur(it.budgetTotal) + '</div><div class="fp-l">tout compris · ' + travelerLabel() + '</div></div>'
    +   '<div class="foot-actions">'
    +     '<button class="fa-btn" onclick="saveItinerary()"><span>' + ico('bookmark',20,1.6) + '</span><i>Garder</i></button>'
    +     '<button class="fa-btn" onclick="window.triggerPDF&&window.triggerPDF()"><span>' + ico('doc',20,1.6) + '</span><i>PDF</i></button>'
    +   '</div>'
    + '</div></div>'
  );
}

/* ── 7 · Détail d'un jour ───────────────────────────────────────────── */
function dayDetailView(idx){
  const it = ITINERARY;
  const p = it.plan[idx];
  if (!p) return statusBar() + navbar('Jour');
  /* DEBUG temporaire */
  try{ console.log('[dayDetail] p=', JSON.stringify({n:p.n,title:p.title,category:p.category,hasDesc:!!p.desc,hasMoments:!!(p.moments&&p.moments.length),hasTip:!!p.tip,theme:it.theme,palette:JSON.stringify(it.palette)})); }catch(e){}
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

  /* Hero du jour — fond clair, bande colorée */
  const navRight = idx < it.plan.length-1
    ? '<button class="nav-btn" onclick="swapDay('+(idx+1)+')" aria-label="Suivant">'+ico('chevron',20,1.7)+'</button>'
    : '<span class="nav-spacer"></span>';

  return navbar(num, { right: navRight })
    /* Bande couleur fine + infos jour */
    + '<div style="flex:none;padding:0 20px 24px;border-bottom:1px solid var(--line2)">'
    +   '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">'
    +     '<span style="width:4px;height:4px;border-radius:50%;background:'+catColor+';display:block"></span>'
    +     '<span style="font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:'+catColor+'">'
    +       (catLabel || 'Découverte') + ' · ' + esc(p.loc)
    +     '</span>'
    +     (p.wx && p.wx[1] ? '<span style="margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--sub)">'+esc(p.wx[1])+'</span>' : '')
    +   '</div>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:30px;letter-spacing:-0.5px;color:var(--ink);line-height:1.1;margin:0 0 10px">' + esc(p.title) + '</h1>'
    +   '<div style="width:36px;height:3px;background:'+catColor+';border-radius:2px"></div>'
    + '</div>'
    /* Corps scrollable */
    + '<div class="ov-scroll has-foot px" style="padding-top:16px">'
    +   (p.desc ? '<p style="font-size:15px;color:var(--ink);line-height:1.65;font-family:var(--serif);font-style:italic;margin:0 0 4px">' + esc(p.desc) + '</p>' : '')
    +   tipHTML
    +   '<div class="section-h" style="margin-top:20px"><h2>Le programme</h2><span class="meta">' + (p.moments ? p.moments.length : 0) + ' moments</span></div>'
    +   (p.moments || []).map(function(m){
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
    +   '<span style="position:absolute;bottom:20px;right:24px;z-index:1;color:'+hexA(accent,0.9)+';display:flex;opacity:0.95">' + ico(a.i, 32, 1.3) + '</span>'
    +   '<span style="position:absolute;left:24px;right:24px;bottom:19px;height:1px;z-index:0;background:'+hexA(accent,0.25)+'"></span>'
    +   '<div class="navbar on-dark" style="position:absolute;top:0;left:0;right:0;z-index:1"><button class="nav-btn ghost" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +   '<button class="nav-btn ghost" onclick="this.classList.toggle(\'on\');" aria-label="Favori">' + ico('heart',18,1.6) + '</button></div>'
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

