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
    /* Sans crossorigin, une erreur survenant DANS ce script externe (unpkg.com)
       remonte comme "Script error." muet (ni message, ni fichier, ni ligne) —
       le navigateur masque le détail par sécurité pour les scripts cross-origin
       sans CORS explicite. Ça rend le diagnostic impossible en cas de souci. */
    s.crossOrigin = 'anonymous';
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
   Retourne { pt, cached } pour permettre à l'appelant de ne pas throttle sur cache hit.
   Délai d'expiration explicite (AbortController) : sur un réseau lent/instable,
   fetch() peut mettre plus de 10s à échouer de lui-même — sans ce filet, un
   itinéraire à plusieurs étapes qui échouent toutes pourrait laisser la carte
   (et son indicateur de chargement) bloquée près d'une minute avant d'abandonner. */
const GEOCODE_TIMEOUT_MS = 6000;
async function _geocode(query, iso2){
  const cacheKey = (query || '').toLowerCase() + '|' + (iso2 || '');
  const cached = _geoCacheGet(cacheKey);
  if(cached) return { pt: cached, cached: true };
  const controller = new AbortController();
  const timer = setTimeout(function(){ controller.abort(); }, GEOCODE_TIMEOUT_MS);
  try{
    const params = new URLSearchParams({ format:'json', q:query, limit:'1' });
    if(iso2) params.set('countrycodes', iso2);
    const res = await fetch('https://nominatim.openstreetmap.org/search?' + params.toString(), {
      headers: { 'Accept-Language':'fr' }, signal: controller.signal
    });
    if(!res.ok) return null;
    const rows = await res.json();
    if(!rows || !rows.length) return null;
    const pt = { lat: parseFloat(rows[0].lat), lng: parseFloat(rows[0].lon) };
    if(isNaN(pt.lat) || isNaN(pt.lng)) return null;
    _geoCacheSet(cacheKey, pt);
    return { pt: pt, cached: false };
  }catch(e){ return null; }
  finally{ clearTimeout(timer); }
}
/* Certains lieux générés par l'IA sont préfixés d'un mot générique
   ("Aéroport Manado Sam Ratulangi", "Gare de X"...) que Nominatim ne
   reconnaît pas tel quel — contrairement à "Manado Sam Ratulangi" ou
   "Manado" seul, qui résolvent très bien. Sans repli, ce genre de libellé
   fait échouer le géocodage silencieusement : le marqueur et le recentrage
   de la carte sur cette étape n'ont jamais lieu (la carte reste bloquée sur
   la vue de secours très large, comme si elle "ne s'adaptait plus"). */
const _GEO_GENERIC_PREFIX = /^(l['’]\s*)?(a[eé]roport(?:\s+(?:de|international)?)?|gare(?:\s+de)?|port(?:\s+de)?|ville\s+de|centre[- ]ville\s+de)\s+/i;
function _geoQueryVariants(loc){
  const base = (loc || '').trim();
  const variants = [base];
  const stripped = base.replace(_GEO_GENERIC_PREFIX, '').trim();
  if(stripped && stripped.toLowerCase() !== base.toLowerCase()) variants.push(stripped);
  const words = base.split(/\s+/).filter(Boolean);
  if(words.length > 2){
    const lastTwo = words.slice(-2).join(' ');
    if(!variants.some(function(v){ return v.toLowerCase() === lastTwo.toLowerCase(); })) variants.push(lastTwo);
  }
  return variants;
}
async function _geocodeWithFallback(loc, destSuffix, iso2){
  const variants = _geoQueryVariants(loc);
  let result = null;
  for(let i=0; i<variants.length; i++){
    result = await _geocode(variants[i] + destSuffix, iso2);
    if(result && result.pt) return result;
    if(i < variants.length - 1) await new Promise(function(r){ setTimeout(r, 1100); });
  }
  return null;
}
function _destIso2(dest){
  const shape = (typeof _geoShapeSD === 'function') ? _geoShapeSD(dest) : null;
  return (shape && DEST_ISO2[shape.key]) || '';
}
function _destCenter(dest){
  const shape = (typeof _geoShapeSD === 'function') ? _geoShapeSD(dest) : null;
  return (shape && DEST_CENTER[shape.key]) || [20, 10];
}
/* Étapes dédupliquées par lieu, dans l'ordre du plan. Ne fusionne que les
   jours CONSÉCUTIFS au même endroit (une même "étape" de plusieurs nuits) —
   un lieu déjà visité mais quitté puis retrouvé plus tard (ex. retour à la
   ville d'arrivée pour le vol retour, ou un hub revisité entre deux
   excursions) doit rester une entrée à part entière, sinon le tracé de la
   carte n'affiche jamais les étapes revisitées du voyage.
   Le plafond est volontairement large (30, pas 10) : un itinéraire qui
   revient plusieurs fois sur un même hub (ex. voyage plongée avec base
   fixe entre les sorties) peut légitimement compter plus de 10 entrées
   même sur un voyage de 2-3 semaines — un plafond trop bas tronquait la
   carte bien avant la fin du voyage dès qu'un hub était revisité. */
function _dedupPlanLocs(plan){
  const out = [];
  (plan || []).forEach(function(p, i){
    const raw = (p && p.loc) || '';
    const k = raw.split(/[\/(,]/)[0].trim().toLowerCase();
    if(!k) return;
    const last = out[out.length - 1];
    if(last && last.key === k) return; /* même étape que le jour précédent */
    out.push({ loc: raw.split(/[\/(,]/)[0].trim(), key: k, idx: i });
  });
  return out.slice(0, 30);
}

function _routeCacheGet(key){
  try{ var c = JSON.parse(localStorage.getItem('hs_routecache') || '{}'); return Object.prototype.hasOwnProperty.call(c, key) ? c[key] : undefined; }
  catch(e){ return undefined; }
}
function _routeCacheSet(key, val){
  try{
    var c = JSON.parse(localStorage.getItem('hs_routecache') || '{}');
    c[key] = val;
    var keys = Object.keys(c);
    if(keys.length > 150) delete c[keys[0]];
    localStorage.setItem('hs_routecache', JSON.stringify(c));
  }catch(e){}
}
function _haversineKm(a, b){
  const R = 6371, toRad = function(d){ return d * Math.PI / 180; };
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
/* Trajet réel (routes/ferries mappés dans OpenStreetMap, via l'API publique
   OSRM) entre deux étapes consécutives, au lieu d'une ligne droite qui
   traverse la mer ou coupe à travers le relief sans suivre aucune route
   réelle. Au-delà de ROUTE_MAX_KM (probablement un vol, pas un trajet
   routier) ou si le détour routier est disproportionné par rapport à la
   ligne droite (aucune route/ferry direct mappé), on renvoie null et
   l'appelant retombe sur la ligne droite  -  jamais pire qu'avant. */
const ROUTE_MAX_KM = 400;
async function _fetchRoute(pa, pb){
  const straight = _haversineKm(pa, pb);
  if(straight > ROUTE_MAX_KM) return null;
  const key = pa.lat.toFixed(3) + ',' + pa.lng.toFixed(3) + '|' + pb.lat.toFixed(3) + ',' + pb.lng.toFixed(3);
  const cached = _routeCacheGet(key);
  if(cached !== undefined) return cached;
  try{
    const url = 'https://router.project-osrm.org/route/v1/driving/'
      + pa.lng + ',' + pa.lat + ';' + pb.lng + ',' + pb.lat + '?overview=simplified&geometries=geojson';
    const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    const t = ctrl ? setTimeout(function(){ ctrl.abort(); }, 6000) : null;
    const res = await fetch(url, ctrl ? { signal: ctrl.signal } : {});
    if(t) clearTimeout(t);
    if(!res.ok){ _routeCacheSet(key, null); return null; }
    const data = await res.json();
    if(data.code !== 'Ok' || !data.routes || !data.routes.length){ _routeCacheSet(key, null); return null; }
    const route = data.routes[0];
    if(route.distance / 1000 > straight * 2.8){ _routeCacheSet(key, null); return null; }
    const pts = route.geometry.coordinates.map(function(c){ return [c[1], c[0]]; });
    _routeCacheSet(key, pts);
    return pts;
  }catch(e){ _routeCacheSet(key, null); return null; }
}

const HS_TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
function _hsTileLayer(){
  return L.tileLayer(HS_TILE_URL, { subdomains:'abcd', maxZoom:18, attribution:'&copy; OpenStreetMap &amp; CARTO' });
}
/* kind: 'active' (jour consulté) · 'end' (première/dernière étape) · 'mid' (étape intermédiaire) */
function _hsMarkerIcon(kind, label){
  const shadow = '0 1px 3px #F1E9D9, 0 0 2px #F1E9D9';
  const escFn = typeof esc === 'function' ? esc : function(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  const name = label ? escFn(label) : '';
  let html;
  if(kind === 'active'){
    html = '<div style="display:flex;align-items:center;gap:6px;transform:translate(-13px,-13px)">'
      + '<span style="width:26px;height:26px;border-radius:50%;background:#221E18;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,.45)"><span style="width:9px;height:9px;border-radius:50%;background:#E8C98C"></span></span>'
      + (name ? '<span style="font-family:\'Playfair Display\',serif;font-weight:600;font-size:14px;color:#221D16;white-space:nowrap;text-shadow:' + shadow + '">' + name + '</span>' : '')
      + '</div>';
  } else if(kind === 'end'){
    html = '<div style="display:flex;align-items:center;gap:5px;transform:translate(-8px,-8px)">'
      + '<span style="width:16px;height:16px;border-radius:50%;background:#FCFAF3;border:3px solid #A6824A;box-shadow:0 1px 4px rgba(0,0,0,.3)"></span>'
      + (name ? '<span style="font-family:\'Spline Sans Mono\',monospace;font-weight:600;font-size:11px;color:#3F3729;white-space:nowrap;text-shadow:' + shadow + '">' + name + '</span>' : '')
      + '</div>';
  } else {
    html = '<div style="display:flex;align-items:center;gap:5px;transform:translate(-7px,-7px)">'
      + '<span style="width:14px;height:14px;border-radius:50%;background:#A6824A;border:2px solid #FCFAF3;box-shadow:0 1px 4px rgba(0,0,0,.3)"></span>'
      + (name ? '<span style="font-family:\'Spline Sans Mono\',monospace;font-weight:600;font-size:11px;color:#3F3729;white-space:nowrap;text-shadow:' + shadow + '">' + name + '</span>' : '')
      + '</div>';
  }
  return L.divIcon({ html:html, className:'', iconSize:[1,1], iconAnchor:[0,0] });
}

/* Registre des cartes actives (par id d'élément) pour pouvoir les nettoyer avant reconstruction */
window._hsMaps = window._hsMaps || {};

/**
 * Construit (ou reconstruit) une carte Hic Sunt réelle dans #elId.
 * opts: { dest, plan, activeIdx, interactive }
 */
function renderHicSuntMap(elId, opts){
  opts = opts || {};
  /* Le géocodage (Nominatim, 1 req/s) prend un instant avant que la carte ne
     quitte sa vue de secours (tout le pays, zoom 6) pour se recentrer sur les
     vraies étapes — sans cet indicateur, cette attente ressemblait à une
     carte figée/cassée plutôt qu'à un chargement en cours. Masqué dès le
     premier point résolu, ou immédiatement en cas d'échec/absence d'étapes. */
  const loadingEl = document.querySelector('[data-map-loading-for="'+elId+'"]');
  const hideLoading = function(){ if(loadingEl) loadingEl.classList.add('out'); };
  if(loadingEl) loadingEl.classList.remove('out');
  _ensureLeaflet(function(){
    try{
      const el = document.getElementById(elId);
      if(!el){ console.warn('[renderHicSuntMap] élément introuvable:', elId); hideLoading(); return; }
      if(!window.L){ console.warn('[renderHicSuntMap] Leaflet non chargé (CDN bloqué ?)'); hideLoading(); return; }

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
      if(!stops.length){ hideLoading(); return; }
      const iso2 = _destIso2(opts.dest);
      const destSuffix = opts.dest ? (', ' + opts.dest) : '';

      /* Position (dans stops[]) de l'étape du jour actif : la dernière étape
         dont l'index de plan précède ou égale le jour consulté. */
      let activePos = -1;
      if(opts.activeIdx != null){
        activePos = 0;
        for(let k=0; k<stops.length; k++){ if(stops[k].idx <= opts.activeIdx) activePos = k; }
      }

      /* Ordre de géocodage : si un jour est actif, on part de son étape et on
         alterne vers les voisins, pour que la carte se centre vite sur le
         jour consulté au lieu d'attendre le géocodage séquentiel de tout le
         voyage (un itinéraire qui traverse tout un archipel peut prendre
         plusieurs dizaines de secondes en séquentiel). Sinon (aperçu global,
         sans jour actif) on garde l'ordre naturel du voyage. */
      const order = [];
      if(activePos >= 0){
        order.push(activePos);
        for(let d=1; d<stops.length; d++){
          if(activePos + d < stops.length) order.push(activePos + d);
          if(activePos - d >= 0) order.push(activePos - d);
        }
      } else {
        for(let k=0; k<stops.length; k++) order.push(k);
      }

      const resolved = new Array(stops.length).fill(null);
      let focusBounds = null; /* limité au jour actif ± voisins immédiats */
      let allBounds = null; /* aperçu global (pas de jour actif) */

      (async function(){
        try{
          for(let oi=0; oi<order.length; oi++){
            const pos = order[oi];
            if(window._hsMaps[elId] !== map) return; /* cette carte a été détruite ou remplacée entretemps */
            const result = await _geocodeWithFallback(stops[pos].loc, destSuffix, iso2);
            if(window._hsMaps[elId] !== map) return; /* détruite/remplacée pendant le géocodage */
            if(result && result.pt){
              const g = result.pt;
              resolved[pos] = g;
              const isActive = pos === activePos;
              const kind = isActive ? 'active' : (pos === 0 || pos === stops.length - 1 ? 'end' : 'mid');
              L.marker([g.lat, g.lng], { icon: _hsMarkerIcon(kind, stops[pos].loc) }).addTo(map);

              map.invalidateSize();
              hideLoading();
              if(activePos >= 0){
                /* Vue centrée sur le jour actif : n'inclure que son étape et
                   ses voisins immédiats déjà résolus, jamais tout le voyage —
                   sinon un itinéraire étalé sur tout un archipel force un
                   zoom arrière qui ne montre plus rien de précis. */
                if(pos >= activePos - 1 && pos <= activePos + 1){
                  const ll = L.latLng(g.lat, g.lng);
                  focusBounds = focusBounds ? focusBounds.extend(ll) : L.latLngBounds(ll, ll);
                  if(focusBounds.getNorthEast().equals(focusBounds.getSouthWest())) map.setView(focusBounds.getCenter(), 11);
                  else map.fitBounds(focusBounds, { padding:[opts.padding || 40, opts.padding || 40], maxZoom:12 });
                }
              } else {
                /* Aperçu global : on garde le comportement historique (tout inclure). */
                const ll = L.latLng(g.lat, g.lng);
                allBounds = allBounds ? allBounds.extend(ll) : L.latLngBounds(ll, ll);
                if(allBounds.getNorthEast().equals(allBounds.getSouthWest())) map.setView(allBounds.getCenter(), 12);
                else map.fitBounds(allBounds, { padding:[opts.padding || 40, opts.padding || 40] });
              }
            }
            /* Respecter la limite Nominatim (≈1 req/s) seulement pour les vrais appels réseau */
            if(oi < order.length - 1 && (!result || !result.cached)) await new Promise(function(r){ setTimeout(r, 1100); });
          }

          /* Tracés reliant les étapes RÉSOLUES consécutives, dans l'ordre réel
             du voyage — en sautant une étape dont le géocodage a échoué
             plutôt que de laisser un vide définitif dans le tracé. Avant, un
             seul hameau non reconnu par Nominatim coupait la carte en deux :
             tout ce qui suivait restait visuellement déconnecté du reste, même
             quand ces étapes suivantes se géocodaient très bien elles-mêmes.
             Volontairement fait en repasse APRÈS le géocodage complet (pas au
             fil de l'eau) : impossible de savoir si une étape encore en
             attente va finir par réussir avant que tout le monde ait essayé. */
          let prevPos = -1;
          for(let pos=0; pos<resolved.length; pos++){
            if(!resolved[pos]) continue;
            if(prevPos >= 0){
              const pa = resolved[prevPos], pb = resolved[pos];
              const routePts = await _fetchRoute(pa, pb);
              if(window._hsMaps[elId] !== map) return; /* détruite/remplacée pendant la requête de tracé */
              const latlngs = (routePts && routePts.length) ? routePts : [[pa.lat, pa.lng], [pb.lat, pb.lng]];
              L.polyline(latlngs, { color:'#221E18', weight:2, opacity:.38, dashArray:'2 8', lineCap:'round' }).addTo(map);
              if(prevPos === activePos || pos === activePos){
                L.polyline(latlngs, { color:'#A6824A', weight:4, lineCap:'round' }).addTo(map);
              }
            }
            prevPos = pos;
          }
        }catch(err){
          console.error('[renderHicSuntMap] géocodage:', err);
          if(typeof toast === 'function') toast('Carte : ' + (err && err.message || 'erreur de géocodage'));
        }
        /* Filet de sécurité : si AUCUNE étape n'a pu être géocodée (toutes
           échouées — lieu introuvable, réseau, rate-limit...), la carte
           reste sur sa vue de secours tout-pays — mieux vaut la montrer
           franchement que masquer indéfiniment derrière l'indicateur. */
        hideLoading();
      })();
    }catch(err){
      console.error('[renderHicSuntMap] init:', err);
      if(typeof toast === 'function') toast('Carte : ' + (err && err.message || 'erreur d\'initialisation'));
      hideLoading();
    }
  });
}
