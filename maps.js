/* ── HIC SUNT · cartes réelles — Leaflet + tuiles CartoDB (sépia), géocodage Nominatim ── */

function _ensureLeaflet(cb){
  if(window.L){ cb(); return; }
  if(!document.querySelector('link[data-hs-leaflet]')){
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    l.setAttribute('data-hs-leaflet', '1');
    document.head.appendChild(l);
  }
  var s = document.querySelector('script[data-hs-leaflet]');
  if(!s){
    s = document.createElement('script');
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.setAttribute('data-hs-leaflet', '1');
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  } else if(window.L){
    cb();
  } else {
    s.addEventListener('load', cb);
    s.addEventListener('error', cb);
  }
}

/* Code pays (ISO2) pour affiner le géocodage — mêmes clés que _geoShapeSD */
const DEST_ISO2 = {
  france:'fr', espagne:'es', italie:'it', portugal:'pt', grece:'gr', maroc:'ma',
  japon:'jp', 'thaïlande':'th', vietnam:'vn', cambodge:'kh', laos:'la',
  islande:'is', perou:'pe', kenya:'ke', jordanie:'jo', mexique:'mx',
  egypte:'eg', turquie:'tr', australie:'au', costa_rica:'cr', sri_lanka:'lk',
  indonesie:'id', maldives:'mv', cuba:'cu', croatie:'hr', majorque:'es',
  sardaigne:'it', sicile:'it', corse:'fr',
};
/* Centre approximatif du pays — vue de secours tant que le géocodage n'a rien résolu */
const DEST_CENTER = {
  france:[46.6,2.4], espagne:[40.3,-3.7], italie:[42.5,12.5], portugal:[39.5,-8.0],
  grece:[39.0,22.0], maroc:[31.8,-6.5], japon:[36.5,138.2], 'thaïlande':[15.5,101.0],
  vietnam:[16.0,107.8], cambodge:[12.7,104.9], laos:[19.0,102.5], islande:[64.9,-18.6],
  perou:[-9.5,-75.0], kenya:[-0.5,37.8], jordanie:[31.2,36.5], mexique:[23.6,-102.5],
  egypte:[26.5,30.8], turquie:[38.9,35.2], australie:[-25.0,133.0], costa_rica:[9.7,-84.0],
  sri_lanka:[7.5,80.7], indonesie:[-2.5,118.0], maldives:[3.2,73.2], cuba:[21.5,-79.5],
  croatie:[45.1,15.2], majorque:[39.6,2.9], sardaigne:[40.1,9.1], sicile:[37.6,14.0],
  corse:[42.0,9.1],
};

function _geoCacheGet(key){
  try{ var c = JSON.parse(localStorage.getItem('hs_geocache') || '{}'); return c[key] || null; }
  catch(e){ return null; }
}
function _geoCacheSet(key, val){
  try{
    var c = JSON.parse(localStorage.getItem('hs_geocache') || '{}');
    c[key] = val;
    var keys = Object.keys(c);
    if(keys.length > 400) delete c[keys[0]];
    localStorage.setItem('hs_geocache', JSON.stringify(c));
  }catch(e){}
}
/* Géocodage via Nominatim (OpenStreetMap) — résultats mis en cache localement.
   Retourne { pt, cached } pour permettre à l'appelant de ne pas throttle sur cache hit. */
async function _geocode(query, iso2){
  const cacheKey = (query || '').toLowerCase() + '|' + (iso2 || '');
  const cached = _geoCacheGet(cacheKey);
  if(cached) return { pt: cached, cached: true };
  try{
    const params = new URLSearchParams({ format:'json', q:query, limit:'1' });
    if(iso2) params.set('countrycodes', iso2);
    const res = await fetch('https://nominatim.openstreetmap.org/search?' + params.toString(), {
      headers: { 'Accept-Language':'fr' }
    });
    if(!res.ok) return null;
    const rows = await res.json();
    if(!rows || !rows.length) return null;
    const pt = { lat: parseFloat(rows[0].lat), lng: parseFloat(rows[0].lon) };
    if(isNaN(pt.lat) || isNaN(pt.lng)) return null;
    _geoCacheSet(cacheKey, pt);
    return { pt: pt, cached: false };
  }catch(e){ return null; }
}
function _destIso2(dest){
  const shape = (typeof _geoShapeSD === 'function') ? _geoShapeSD(dest) : null;
  return (shape && DEST_ISO2[shape.key]) || '';
}
function _destCenter(dest){
  const shape = (typeof _geoShapeSD === 'function') ? _geoShapeSD(dest) : null;
  return (shape && DEST_CENTER[shape.key]) || [20, 10];
}
/* Étapes dédupliquées par lieu, dans l'ordre du plan (comme geoMapSVG) */
function _dedupPlanLocs(plan){
  const seen = {}, out = [];
  (plan || []).forEach(function(p, i){
    const raw = (p && p.loc) || '';
    const k = raw.split(/[\/(,]/)[0].trim().toLowerCase();
    if(k && !seen[k]){ seen[k] = true; out.push({ loc: raw.split(/[\/(,]/)[0].trim(), idx: i }); }
  });
  return out.slice(0, 10);
}

const HS_TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
function _hsTileLayer(){
  return L.tileLayer(HS_TILE_URL, { subdomains:'abcd', maxZoom:18, attribution:'&copy; OpenStreetMap &amp; CARTO' });
}
function _hsMarkerIcon(active){
  const html = active
    ? '<div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:#221E18;box-shadow:0 3px 8px rgba(0,0,0,.45)"><span style="width:9px;height:9px;border-radius:50%;background:#E8C98C"></span></div>'
    : '<div style="width:14px;height:14px;border-radius:50%;background:#A6824A;border:2px solid #FCFAF3;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>';
  return L.divIcon({ html:html, className:'', iconSize:[1,1], iconAnchor: active ? [13,13] : [7,7] });
}

/* Registre des cartes actives (par id d'élément) pour pouvoir les nettoyer avant reconstruction */
window._hsMaps = window._hsMaps || {};

/**
 * Construit (ou reconstruit) une carte Hic Sunt réelle dans #elId.
 * opts: { dest, plan, activeIdx, interactive }
 */
function renderHicSuntMap(elId, opts){
  opts = opts || {};
  _ensureLeaflet(function(){
    const el = document.getElementById(elId);
    if(!el || !window.L) return;

    if(window._hsMaps[elId]){
      try{ window._hsMaps[elId].remove(); }catch(e){}
      delete window._hsMaps[elId];
    }

    const center = _destCenter(opts.dest);
    const map = L.map(elId, {
      zoomControl:false, attributionControl:false,
      dragging: !!opts.interactive, scrollWheelZoom: !!opts.interactive,
      doubleClickZoom: !!opts.interactive, boxZoom: !!opts.interactive,
      keyboard: !!opts.interactive, touchZoom: !!opts.interactive, tap: !!opts.interactive,
    }).setView(center, 6);
    window._hsMaps[elId] = map;

    _hsTileLayer().addTo(map);
    map.getContainer().style.background = '#ECE3D0';
    if(map.getPane('tilePane')){
      map.getPane('tilePane').style.filter = 'sepia(.4) saturate(.82) brightness(1.04) hue-rotate(-6deg)';
    }

    const stops = _dedupPlanLocs(opts.plan);
    if(!stops.length) return;
    const iso2 = _destIso2(opts.dest);
    const destSuffix = opts.dest ? (', ' + opts.dest) : '';

    (async function(){
      const pts = [];
      for(let i=0; i<stops.length; i++){
        if(!window._hsMaps[elId]) return; /* la carte a été détruite entretemps */
        const result = await _geocode(stops[i].loc + destSuffix, iso2);
        if(result && result.pt){
          const g = result.pt;
          pts.push({ lat:g.lat, lng:g.lng, idx: stops[i].idx });
          const isActive = opts.activeIdx != null && stops[i].idx === opts.activeIdx;
          L.marker([g.lat, g.lng], { icon: _hsMarkerIcon(isActive) }).addTo(map);
          if(pts.length > 1){
            const prev = pts[pts.length - 2];
            L.polyline([[prev.lat, prev.lng], [g.lat, g.lng]], { color:'#221E18', weight:2, opacity:.5, dashArray:'2 8', lineCap:'round' }).addTo(map);
          }
          map.invalidateSize();
          const latlngs = pts.map(function(p){ return [p.lat, p.lng]; });
          if(latlngs.length > 1) map.fitBounds(latlngs, { padding:[opts.padding || 40, opts.padding || 40] });
          else map.setView(latlngs[0], 12);
        }
        /* Respecter la limite Nominatim (≈1 req/s) seulement pour les vrais appels réseau */
        if(i < stops.length - 1 && (!result || !result.cached)) await new Promise(function(r){ setTimeout(r, 1100); });
      }
    })();
  });
}

/**
 * Rend la feuille inférieure de l'écran Carte glissable : on peut la tirer
 * vers le bas (poignée) pour libérer de l'espace et voir la carte en dessous.
 *
 * Écouteurs de mouvement/relâchement liés une seule fois sur `window` (pas
 * de fuite : ils ne font rien tant qu'aucun drag n'est en cours) plutôt que
 * Pointer Events + setPointerCapture, dont le pointerup peut ne pas se
 * déclencher de façon fiable sur mobile Safari — un pointerup manqué
 * laissait la feuille bloquée à la position du dernier mouvement, y
 * compris repliée après un simple tap.
 */
let _carteSheetDrag = null;
function _carteSheetMove(clientY){
  if(!_carteSheetDrag) return;
  const d = _carteSheetDrag;
  const delta = clientY - d.startY;
  d.moved = Math.max(d.moved, Math.abs(delta));
  const next = Math.min(d.maxTranslate, Math.max(0, d.startTranslate + delta));
  d.sheet.style.transform = 'translateY(' + next + 'px)';
}
function _carteSheetEnd(){
  if(!_carteSheetDrag) return;
  const d = _carteSheetDrag;
  d.sheet.style.transition = 'transform 0.32s cubic-bezier(0.22,1,0.36,1)';
  /* Un tap (déplacement négligeable) revient toujours à l'état déplié */
  if(d.moved < 6){
    d.sheet.style.transform = 'translateY(' + d.startTranslate + 'px)';
  } else {
    const m = getComputedStyle(d.sheet).transform;
    let cur = 0;
    if(m && m !== 'none'){
      const match = /matrix\(([^)]+)\)/.exec(m);
      if(match) cur = parseFloat(match[1].split(',')[5]) || 0;
    }
    d.sheet.style.transform = 'translateY(' + (cur > d.maxTranslate / 2 ? d.maxTranslate : 0) + 'px)';
  }
  _carteSheetDrag = null;
}
if(!window._hsCarteSheetBound){
  window._hsCarteSheetBound = true;
  window.addEventListener('touchmove', function(e){ if(_carteSheetDrag && e.touches[0]) _carteSheetMove(e.touches[0].clientY); }, { passive:true });
  window.addEventListener('touchend', _carteSheetEnd);
  window.addEventListener('touchcancel', _carteSheetEnd);
  window.addEventListener('mousemove', function(e){ if(_carteSheetDrag) _carteSheetMove(e.clientY); });
  window.addEventListener('mouseup', _carteSheetEnd);
}
function initCarteSheetDrag(){
  const sheet = document.querySelector('.carte-sheet');
  const handle = sheet && sheet.querySelector('.carte-handle-wrap');
  if(!sheet || !handle) return;
  const peekPx = 118; /* hauteur visible une fois repliée : poignée + jours */
  function currentTranslate(){
    const m = getComputedStyle(sheet).transform;
    if(!m || m === 'none') return 0;
    const match = /matrix\(([^)]+)\)/.exec(m);
    return match ? (parseFloat(match[1].split(',')[5]) || 0) : 0;
  }
  function start(clientY){
    _carteSheetDrag = {
      sheet: sheet, startY: clientY, moved: 0,
      startTranslate: currentTranslate(),
      maxTranslate: Math.max(0, sheet.offsetHeight - peekPx),
    };
    sheet.style.transition = 'none';
  }
  handle.addEventListener('touchstart', function(e){ if(e.touches[0]) start(e.touches[0].clientY); }, { passive:true });
  handle.addEventListener('mousedown', function(e){ start(e.clientY); e.preventDefault(); });
}
