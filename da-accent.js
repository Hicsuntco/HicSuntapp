/* ── HIC SUNT — couleur d'ADN par destination ────────────────────────────
   Pose --accent (et ses dérivés) sur la racine selon la destination
   affichée. C'est ce qui fait changer l'app de peau à chaque voyage.
   Compatible ES2019 : ni optional chaining ni nullish coalescing. */
(function () {
  'use strict';

  /* Couleur par pays / région. Vives, jamais sombres. */
  var ADN = {
    'japon': '#00A78E',
    'maroc': '#E8623C',
    'portugal': '#FF9036',
    'lisbonne': '#FF9036',
    'islande': '#2FA8DA',
    'perou': '#E0A21F',
    'pérou': '#E0A21F',
    'kenya': '#C8552F',
    'chili': '#3FB56B',
    'thailande': '#F2743C',
    'thaïlande': '#F2743C',
    'sri lanka': '#17A6A0',
    'patagonie': '#2E9CC0',
    'argentine': '#2E9CC0',
    'norvege': '#3E7BC4',
    'norvège': '#3E7BC4',
    'grece': '#2BA3C7',
    'grèce': '#2BA3C7',
    'vietnam': '#2FA36B',
    'jordanie': '#D08A3A',
    'italie': '#D9553F',
    'espagne': '#EE8B4C',
    'mexique': '#2FA36B',
    'inde': '#E88A2F'
  };

  /* ── Couleur de saison ────────────────────────────────────────────────
     Sur les écrans sans destination, l'accent suit la saison — et il ne
     saute pas de l'une à l'autre : il DÉRIVE en continu d'un jalon au
     suivant. L'app n'a donc jamais tout à fait la même teinte d'une
     semaine sur l'autre. Repères posés aux solstices et équinoxes
     (hémisphère nord). */
  var SAISONS = [
    { jour: 36,  hex: '#37A08F', nom: 'fin d\'hiver'    },  /* ~5 févr.  */
    { jour: 79,  hex: '#4CB963', nom: 'printemps'      },  /* ~20 mars  */
    { jour: 140, hex: '#8FBE49', nom: 'fin de printemps'}, /* ~20 mai   */
    { jour: 172, hex: '#F2A03D', nom: 'été'            },  /* ~21 juin  */
    { jour: 265, hex: '#D9553F', nom: 'automne'        },  /* ~22 sept. */
    { jour: 309, hex: '#A24E63', nom: 'fin d\'automne'  },  /* ~5 nov.   */
    { jour: 355, hex: '#3E7BC4', nom: 'hiver'          }   /* ~21 déc.  */
  ];

  function hexVersRvb(h) {
    return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)];
  }
  function rvbVersHex(c) {
    var s = '#';
    for (var i = 0; i < 3; i++) {
      var v = Math.max(0, Math.min(255, Math.round(c[i]))).toString(16);
      s += (v.length < 2 ? '0' : '') + v;
    }
    return s;
  }
  /* ── Hémisphère ────────────────────────────────────────────────────
     Au sud de l'équateur les saisons sont inversées : sans ce décalage,
     un voyageur à Sydney verrait de l'ambre d'été en plein hiver austral.
     On se fie au fuseau du téléphone — aucune permission à demander. */
  var ZONES_SUD = [
    'Australia/', 'Antarctica/', 'Indian/',
    'America/Argentina/', 'America/Sao_Paulo', 'America/Santiago',
    'America/Montevideo', 'America/La_Paz', 'America/Asuncion',
    'America/Lima', 'America/Punta_Arenas', 'America/Bahia',
    'America/Fortaleza', 'America/Recife', 'America/Cuiaba',
    'America/Campo_Grande', 'Atlantic/Stanley',
    'Africa/Johannesburg', 'Africa/Maputo', 'Africa/Harare',
    'Africa/Lusaka', 'Africa/Windhoek', 'Africa/Gaborone',
    'Africa/Luanda', 'Africa/Antananarivo', 'Africa/Maseru',
    'Africa/Mbabane', 'Africa/Blantyre', 'Africa/Dar_es_Salaam',
    'Pacific/Auckland', 'Pacific/Chatham', 'Pacific/Fiji',
    'Pacific/Noumea', 'Pacific/Port_Moresby', 'Pacific/Tongatapu',
    'Pacific/Apia', 'Pacific/Norfolk', 'Pacific/Guadalcanal'
  ];
  function estAuSud(zone) {
    if (!zone) return false;
    for (var i = 0; i < ZONES_SUD.length; i++) {
      if (zone.indexOf(ZONES_SUD[i]) === 0) return true;
    }
    return false;
  }
  function zoneCourante() {
    try {
      if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      }
    } catch (e) {}
    return '';
  }
  window.hsEstAuSud = estAuSud;

  function jourDeLAnnee(d) {
    var debut = new Date(d.getFullYear(), 0, 0);
    var j = Math.floor((d - debut) / 86400000);
    /* Hémisphère sud : on décale d'une demi-année pour que la teinte
       corresponde à la saison réellement vécue. */
    if (estAuSud(zoneCourante())) {
      j = ((j + 183 - 1) % 366) + 1;
    }
    return j;
  }
  function couleurSaison(date) {
    var j = jourDeLAnnee(date || new Date());
    var a = null, b = null, span, pos;
    for (var i = 0; i < SAISONS.length; i++) {
      var cour = SAISONS[i];
      var suiv = SAISONS[(i + 1) % SAISONS.length];
      var deb = cour.jour;
      var fin = suiv.jour > deb ? suiv.jour : suiv.jour + 366;
      var jj = j >= deb ? j : j + 366;
      if (jj >= deb && jj < fin) { a = cour; b = suiv; span = fin - deb; pos = (jj - deb) / span; break; }
    }
    if (!a) { a = SAISONS[3]; b = SAISONS[0]; pos = 0; }
    var ca = hexVersRvb(a.hex), cb = hexVersRvb(b.hex);
    /* transition adoucie : la couleur s'attarde près de chaque jalon */
    var t = pos * pos * (3 - 2 * pos);
    return rvbVersHex([ca[0] + (cb[0] - ca[0]) * t, ca[1] + (cb[1] - ca[1]) * t, ca[2] + (cb[2] - ca[2]) * t]);
  }
  window.hsCouleurSaison = couleurSaison;

  /* Repli pour les écrans sans destination : la saison du jour. */
  var DEFAUT = couleurSaison(new Date());

  function normalise(txt) {
    if (!txt) return '';
    var s = String(txt).toLowerCase().trim();
    /* on retire les articles et le superflu : « le Japon », « Japon · Honshū » */
    s = s.replace(/^(le |la |les |l')/, '');
    s = s.split('·')[0].split(',')[0].split('(')[0].trim();
    return s;
  }

  function couleurPour(dest) {
    var cle = normalise(dest);
    if (!cle) return DEFAUT;
    if (ADN[cle]) return ADN[cle];
    /* correspondance partielle : « japon du sud » → japon */
    for (var k in ADN) {
      if (ADN.hasOwnProperty(k) && cle.indexOf(k) >= 0) return ADN[k];
    }
    return DEFAUT;
  }

  var courant = null;
  function poser(hex) {
    if (hex === courant) return;
    courant = hex;
    var r = document.documentElement;
    r.style.setProperty('--accent', hex);
    r.style.setProperty('--accent-tint', hex + '16');
    r.style.setProperty('--accent-soft', hex + '2A');
    r.style.setProperty('--accent-shadow', hex + 'b0');
  }

  function depuisItineraire() {
    if (typeof ITINERARY !== 'undefined' && ITINERARY && ITINERARY.dest) {
      poser(couleurPour(ITINERARY.dest));
    } else {
      poser(couleurSaison(new Date()));
    }
  }

  /* Expose pour un appel manuel si besoin */
  window.hsSetAccent = function (dest) { poser(couleurPour(dest)); };
  window.hsResetAccent = function () { poser(couleurSaison(new Date())); };

  function brancher() {
    poser(couleurSaison(new Date()));

    /* Ouverture d'un itinéraire → couleur du pays */
    if (typeof window.openItinerary === 'function') {
      var _oi = window.openItinerary;
      window.openItinerary = function () {
        depuisItineraire();
        return _oi.apply(this, arguments);
      };
    }

    /* Retour aux onglets → on garde la couleur du voyage en cours s'il y en
       a un, sinon on revient au repli. */
    if (typeof window.setTab === 'function') {
      var _st = window.setTab;
      window.setTab = function (name) {
        var res = _st.apply(this, arguments);
        depuisItineraire();
        return res;
      };
    }

    /* Filet de sécurité : une génération ou un chargement asynchrone peut
       remplir ITINERARY après coup, sans repasser par openItinerary. */
    var n = 0;
    var t = setInterval(function () {
      depuisItineraire();
      n++;
      if (n > 40) clearInterval(t);   /* ~20 s puis on arrête */
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', brancher);
  } else {
    brancher();
  }
})();
