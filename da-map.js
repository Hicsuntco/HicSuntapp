/* ── HIC SUNT — rendu des cartes en pointillé ────────────────────────────
   Décode la trame de da-maps-data.js et place les étapes géocodées avec
   EXACTEMENT la même projection Mercator : l'alignement est garanti par
   construction, pas par calibrage.
   Compatible ES2019 : ni optional chaining ni nullish coalescing. */
(function () {
  'use strict';

  function merc(lon, lat) {
    var l = Math.max(-85, Math.min(85, lat));
    var s = Math.sin(l * Math.PI / 180);
    return { x: (lon + 180) / 360, y: 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI) };
  }

  function b64octets(b64) {
    var bin = atob(b64), n = bin.length, out = new Uint8Array(n);
    for (var i = 0; i < n; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  /* Y a-t-il une carte pour cette destination ? */
  function carte(dest) {
    if (typeof HS_DOTMAPS === 'undefined' || !dest) return null;
    if (HS_DOTMAPS[dest]) return HS_DOTMAPS[dest];
    var cle = String(dest).toLowerCase().split('\u00b7')[0].split(',')[0].trim();
    for (var k in HS_DOTMAPS) {
      if (HS_DOTMAPS.hasOwnProperty(k) && (k.toLowerCase() === cle || cle.indexOf(k.toLowerCase()) >= 0)) {
        return HS_DOTMAPS[k];
      }
    }
    return null;
  }
  window.hsDotMapDispo = function (dest) { return !!carte(dest); };

  /* Projette un point géographique dans le repère de la carte */
  function versSvg(m, lon, lat) {
    var p = merc(lon, lat);
    return {
      x: (p.x - m.x0) / (m.x1 - m.x0) * m.w,
      y: (p.y - m.y0) / (m.y1 - m.y0) * m.h
    };
  }
  window.hsProjeter = function (dest, lon, lat) {
    var m = carte(dest);
    return m ? versSvg(m, lon, lat) : null;
  };

  function pointsSvg(m) {
    var bits = b64octets(m.bits), out = '', i, r, c;
    for (r = 0; r < m.lignes; r++) {
      for (c = 0; c < m.cols; c++) {
        i = r * m.cols + c;
        if (bits[i >> 3] & (1 << (i & 7))) {
          out += '<circle class="hsdm-d" cx="' + ((c + 0.5) * m.pas).toFixed(1)
               + '" cy="' + ((r + 0.5) * m.pas).toFixed(1) + '" r="2"/>';
        }
      }
    }
    return out;
  }

  /* stops : [{ nom, lat, lng }] déjà géocodés */
  window.hsDotMapHTML = function (dest, stops) {
    var m = carte(dest);
    if (!m) return '';
    var pts = [], i;
    stops = stops || [];
    for (i = 0; i < stops.length; i++) {
      if (stops[i] && isFinite(stops[i].lat) && isFinite(stops[i].lng)) {
        var p = versSvg(m, stops[i].lng, stops[i].lat);
        p.nom = stops[i].nom || '';
        pts.push(p);
      }
    }

    /* cadrage : on resserre sur la route quand elle existe */
    var vb = '0 0 ' + m.w + ' ' + m.h;
    if (pts.length > 1) {
      var xs = pts.map(function (p) { return p.x; }), ys = pts.map(function (p) { return p.y; });
      var marge = Math.max(m.w, m.h) * 0.10;
      var vx = Math.max(0, Math.min.apply(null, xs) - marge);
      var vy = Math.max(0, Math.min.apply(null, ys) - marge);
      var vw = Math.min(m.w - vx, Math.max.apply(null, xs) - vx + marge);
      var vh = Math.min(m.h - vy, Math.max.apply(null, ys) - vy + marge);
      /* on garde des proportions lisibles */
      if (vw / vh < 0.9) { var d = vh * 0.9 - vw; vx = Math.max(0, vx - d / 2); vw = Math.min(m.w - vx, vw + d); }
      vb = vx.toFixed(0) + ' ' + vy.toFixed(0) + ' ' + vw.toFixed(0) + ' ' + vh.toFixed(0);
    }

    var route = '';
    for (i = 0; i < pts.length - 1; i++) {
      route += '<path class="hsdm-seg" d="M' + pts[i].x.toFixed(1) + ',' + pts[i].y.toFixed(1)
             + ' L' + pts[i + 1].x.toFixed(1) + ',' + pts[i + 1].y.toFixed(1) + '"/>';
    }
    for (i = 0; i < pts.length; i++) {
      route += '<circle class="hsdm-halo" cx="' + pts[i].x.toFixed(1) + '" cy="' + pts[i].y.toFixed(1) + '" r="14"/>';
    }
    for (i = 0; i < pts.length; i++) {
      route += '<circle class="hsdm-n" cx="' + pts[i].x.toFixed(1) + '" cy="' + pts[i].y.toFixed(1) + '" r="8"/>'
             + '<text class="hsdm-num" x="' + pts[i].x.toFixed(1) + '" y="' + (pts[i].y + 3.4).toFixed(1)
             + '" text-anchor="middle">' + (i + 1) + '</text>';
    }

    return '<svg class="hsdm" viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet">'
         + '<g>' + pointsSvg(m) + '</g><g class="hsdm-route">' + route + '</g></svg>';
  };

  /* Tracé progressif, comme sur l'écran validé */
  window.hsDotMapAnimer = function (hote) {
    if (!hote) return;
    var segs = hote.querySelectorAll('.hsdm-seg');
    var noeuds = hote.querySelectorAll('.hsdm-n, .hsdm-num, .hsdm-halo');
    var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var i;
    for (i = 0; i < noeuds.length; i++) noeuds[i].style.opacity = reduit ? 1 : 0;
    for (i = 0; i < segs.length; i++) {
      var L = segs[i].getTotalLength();
      segs[i].style.transition = 'none';
      segs[i].style.strokeDasharray = L;
      segs[i].style.strokeDashoffset = reduit ? 0 : L;
    }
    if (reduit) return;
    var n = segs.length + 1;
    function allumer(k) {
      var sel = hote.querySelectorAll('.hsdm-n, .hsdm-num, .hsdm-halo');
      var parEtape = sel.length / n;
      for (var j = 0; j < sel.length; j++) {
        if (Math.floor(j % n) === k || (sel.length === 3 * n && (j % n) === k)) sel[j].style.opacity = 1;
      }
    }
    /* on allume par index d'étape : halos puis pastilles puis numéros */
    function etape(k) {
      var halos = hote.querySelectorAll('.hsdm-halo');
      var ronds = hote.querySelectorAll('.hsdm-n');
      var nums  = hote.querySelectorAll('.hsdm-num');
      if (halos[k]) halos[k].style.opacity = 1;
      if (ronds[k]) ronds[k].style.opacity = 1;
      if (nums[k])  nums[k].style.opacity = 1;
    }
    etape(0);
    (function suivant(k) {
      if (k >= segs.length) return;
      setTimeout(function () {
        segs[k].style.transition = 'stroke-dashoffset .62s cubic-bezier(.4,0,.2,1)';
        segs[k].style.strokeDashoffset = '0';
        setTimeout(function () { etape(k + 1); suivant(k + 1); }, 500);
      }, 140);
    })(0);
  };

  /* ── Branchement sur l'app ─────────────────────────────────────────────
     Quand une carte en pointillé existe pour la destination, elle remplace
     Leaflet : le pays s'affiche INSTANTANÉMENT (aucun réseau), puis le tracé
     apparaît à mesure que le géocodage résout les étapes. */
  function rendreDot(elId, opts) {
    var el = document.getElementById(elId);
    if (!el) return;
    var dest = opts.dest;
    el.innerHTML = window.hsDotMapHTML(dest, []);   /* le pays, tout de suite */

    var cacher = function () {
      var l = document.querySelector('[data-map-loading-for="' + elId + '"]');
      if (l) l.classList.add('out');
    };
    cacher();

    var stops = (typeof _dedupPlanLocs === 'function') ? _dedupPlanLocs(opts.plan) : [];
    if (!stops.length || typeof _geocodeWithFallback !== 'function') return;

    var iso2 = (typeof _destIso2 === 'function') ? _destIso2(dest) : '';
    var suffixe = dest ? (', ' + dest) : '';
    var res = [];

    (async function () {
      for (var i = 0; i < stops.length; i++) {
        if (!document.body.contains(el)) return;      /* écran quitté */
        var r = null;
        try { r = await _geocodeWithFallback(stops[i].loc, suffixe, iso2); } catch (e) {}
        if (r && r.pt && isFinite(r.pt.lat) && isFinite(r.pt.lng)) {
          res.push({ nom: stops[i].loc, lat: r.pt.lat, lng: r.pt.lng });
          if (res.length >= 2) el.innerHTML = window.hsDotMapHTML(dest, res);
        }
      }
      if (res.length >= 2) window.hsDotMapAnimer(el);
    })();
  }

  function brancher() {
    if (typeof window.renderHicSuntMap !== 'function') return;
    var _orig = window.renderHicSuntMap;
    window.renderHicSuntMap = function (elId, opts) {
      opts = opts || {};
      /* Leaflet reste pour les cartes manipulables et les destinations
         hors catalogue — on ne remplace que l'aperçu de l'itinéraire. */
      if (!opts.interactive && window.hsDotMapDispo(opts.dest)) {
        try { return rendreDot(elId, opts); } catch (e) { /* repli ci-dessous */ }
      }
      return _orig.apply(this, arguments);
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher);
  else brancher();

})();
