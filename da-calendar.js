/* ── HIC SUNT — calendrier de sélection des dates ─────────────────────────
   Remplace les deux champs date natifs du questionnaire par un calendrier
   compact : un mois à la fois, sélection d'une plage, décompte en nuits.
   Écrit dans state.dateFrom / state.dateTo au format ISO (AAAA-MM-JJ).
   Compatible ES2019 : ni optional chaining ni nullish coalescing. */
(function () {
  'use strict';

  var MOIS = ['janvier','f\u00e9vrier','mars','avril','mai','juin','juillet',
              'ao\u00fbt','septembre','octobre','novembre','d\u00e9cembre'];
  var ABR  = ['janv.','f\u00e9vr.','mars','avr.','mai','juin','juil.',
              'ao\u00fbt','sept.','oct.','nov.','d\u00e9c.'];

  function minuit(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function iso(d) {
    var m = d.getMonth() + 1, j = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (j < 10 ? '0' : '') + j;
  }
  function depuisIso(s) {
    if (!s) return null;
    var p = String(s).split('-');
    if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d.getTime()) ? null : d;
  }
  function decalage(a, m) { var j = new Date(a, m, 1).getDay(); return (j + 6) % 7; }

  var AUJ = minuit(new Date());
  var vueAnnee = AUJ.getFullYear(), vueMois = AUJ.getMonth();

  function bornes() {
    var st = (typeof state !== 'undefined' && state) ? state : {};
    return { d: depuisIso(st.dateFrom), f: depuisIso(st.dateTo) };
  }
  function poser(d, f) {
    if (typeof state === 'undefined' || !state) return;
    state.dateFrom = d ? iso(d) : '';
    state.dateTo   = f ? iso(f) : '';
  }

  /* Conteneur inséré par le questionnaire */
  window.hsCalHTML = function () {
    return '<div class="hscal" id="hs-cal"></div>';
  };

  function grille() {
    var b = bornes(), deb = b.d, fin = b.f;
    var nb = new Date(vueAnnee, vueMois + 1, 0).getDate();
    var off = decalage(vueAnnee, vueMois);
    var h = '<div class="hscal-nav">'
          + '<button type="button" class="hscal-b' + ((vueAnnee === AUJ.getFullYear() && vueMois === AUJ.getMonth()) ? ' off' : '') + '" data-cal="prev">'
          + '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>'
          + '<span class="hscal-t">' + MOIS[vueMois] + ' ' + vueAnnee + '</span>'
          + '<button type="button" class="hscal-b" data-cal="next">'
          + '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div>'
          + '<div class="hscal-wk"><span>lun</span><span>mar</span><span>mer</span><span>jeu</span>'
          + '<span>ven</span><span>sam</span><span>dim</span></div><div class="hscal-g">';
    for (var i = 0; i < off; i++) h += '<div class="hscal-c vide"></div>';
    for (var jour = 1; jour <= nb; jour++) {
      var cur = new Date(vueAnnee, vueMois, jour);
      var passe = cur < AUJ;
      var cls = 'hscal-c' + (passe ? ' passe' : '');
      if (deb && cur.getTime() === deb.getTime()) cls += ' deb';
      if (fin && cur.getTime() === fin.getTime()) cls += ' fin';
      if (deb && fin && cur > deb && cur < fin) cls += ' dans';
      h += '<div class="' + cls + '" data-jour="' + vueAnnee + '-' + vueMois + '-' + jour + '">'
         + '<span class="hscal-band"></span><span class="hscal-n">' + jour + '</span>'
         + (cur.getTime() === AUJ.getTime() ? '<span class="hscal-auj">auj.</span>' : '')
         + '</div>';
    }
    h += '</div>';

    /* Récapitulatif */
    var r = '';
    if (deb && fin) {
      var n = Math.round((fin - deb) / 86400000);
      r = '<b>' + deb.getDate() + ' ' + ABR[deb.getMonth()] + ' \u2192 '
        + fin.getDate() + ' ' + ABR[fin.getMonth()] + '</b> \u00b7 '
        + n + (n > 1 ? ' nuits' : ' nuit');
    } else if (deb) {
      r = '<b>' + deb.getDate() + ' ' + MOIS[deb.getMonth()] + '</b> \u2014 choisissez le retour';
    } else {
      r = 'Choisissez une date de d\u00e9part';
    }
    h += '<div class="hscal-r">' + r + '</div>';
    return h;
  }

  window.hsCalMount = function () {
    var el = document.getElementById('hs-cal');
    if (!el) return;
    el.innerHTML = grille();
  };

  /* Délégation : survit aux re-rendus du deck */
  document.addEventListener('click', function (e) {
    var el = document.getElementById('hs-cal');
    if (!el) return;
    var t = e.target;

    var nav = t.closest ? t.closest('[data-cal]') : null;
    if (nav && el.contains(nav)) {
      e.preventDefault();
      if (nav.className.indexOf('off') >= 0) return;
      var pas = nav.getAttribute('data-cal') === 'next' ? 1 : -1;
      var d = new Date(vueAnnee, vueMois + pas, 1);
      vueAnnee = d.getFullYear(); vueMois = d.getMonth();
      window.hsCalMount();
      return;
    }

    var c = t.closest ? t.closest('[data-jour]') : null;
    if (c && el.contains(c)) {
      e.preventDefault();
      if (c.className.indexOf('passe') >= 0) return;
      var p = c.getAttribute('data-jour').split('-');
      var choisi = new Date(+p[0], +p[1], +p[2]);
      var b = bornes();
      if (!b.d || (b.d && b.f)) poser(choisi, null);
      else if (choisi.getTime() === b.d.getTime()) return;
      else if (choisi < b.d) poser(choisi, b.d);
      else poser(b.d, choisi);
      window.hsCalMount();
    }
  });

  /* Le questionnaire se re-rend entièrement : on remonte le calendrier après. */
  function brancher() {
    if (typeof window.initDeck === 'function') {
      var _id = window.initDeck;
      window.initDeck = function () {
        var r = _id.apply(this, arguments);
        setTimeout(window.hsCalMount, 0);
        return r;
      };
    }
    setTimeout(window.hsCalMount, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher);
  else brancher();
})();
