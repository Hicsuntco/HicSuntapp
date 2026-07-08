/* ── HIC SUNT · app — Sillage extra data, icons & helpers ────────── */

/* additional icons merged into the global icon set `I` */
Object.assign(I, {
  cloud:'<path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1 .5 6.96z"/>',
  rain:'<path d="M7 15a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 6.5a3.5 3.5 0 0 1 .5 6.96"/><path d="M8 18.5l-1 2M12 18.5l-1 2M16 18.5l-1 2"/>',
  wallet:'<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="16.5" cy="13.5" r="1.3"/>',
  download:'<path d="M12 3v12M8 11l4 4 4-4"/><path d="M5 19h14"/>',
  edit:'<path d="M4 20h4l10-10a2 2 0 0 0-3-3L5 17z"/><path d="M13.5 6.5l3 3"/>',
  ticket:'<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
  camera:'<path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L18 6h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.2"/>',
  link:'<path d="M9 12a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-1.5"/><path d="M15 12a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6h1.5"/>',
  trophy:'<path d="M7 4h10v3a5 5 0 0 1-10 0z"/><path d="M7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3"/><path d="M12 12v4M9 20h6M10 20v-2h4v2"/>',
  gift:'<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M4 13h16M12 9v11"/><path d="M12 9S10 4 8 5.5 9 9 12 9zM12 9s2-5 4-3.5S15 9 12 9z"/>',
  ai:'<path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/><circle cx="18" cy="5" r="1.4"/><circle cx="6" cy="18" r="1.1"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  shield:'<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  flag:'<path d="M6 21V4M6 4h11l-2 4 2 4H6"/>',
  arrowup:'<path d="M12 19V5M6 11l6-6 6 6"/>',
  minus:'<path d="M5 12h14"/>',
  bag:'<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
});

/* ── cartographic helpers ───────────────────────────────────────── */
function rose(size, sw) {
  return '<svg width="'+(size||22)+'" height="'+(size||22)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(sw||1.2)+'" stroke-linejoin="round">'
    + '<circle cx="12" cy="12" r="9"/><path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" fill="currentColor" fill-opacity="0.14"/><path d="M12 3v18M3 12h18"/></svg>';
}
function contour() {
  function fam(cx, cy, max) {
    let s = '';
    for (let r = max; r >= 18; r -= 16) s += '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+r+'" ry="'+(r*0.66).toFixed(0)+'"/>';
    return s;
  }
  return '<svg class="contour" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" fill="none" stroke-width="1.1">'
    + '<g transform="rotate(-15 200 100)">' + fam(150, 96, 150) + fam(300, 70, 96) + '</g></svg>';
}
function graticule(w, h, step) {
  let g = '<svg class="grat" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" fill="none" stroke="#b9a87f" stroke-width="0.6">';
  for (let x=0; x<=w; x+=step) g += '<line x1="'+x+'" y1="0" x2="'+x+'" y2="'+h+'"/>';
  for (let y=0; y<=h; y+=step) g += '<line x1="0" y1="'+y+'" x2="'+w+'" y2="'+y+'"/>';
  return g + '</svg>';
}
function wxChip(w, deg) {
  return '<span class="wx-chip">'+ico(w,14,1.6)+deg+'</span>';
}

/* ── weather woven into the itinerary days ──────────────────────── */
const DAY_WX = [['sun','31°'],['sun','33°'],['cloud','24°'],['cloud','27°'],['sun','30°']];
ITINERARY.plan.forEach((d, i) => { d.wx = DAY_WX[i] || ['sun','30°']; });
ITINERARY.coords = '06°55′N · 79°51′E';
ITINERARY.distance = '412 km';
ITINERARY.budgetTotal = 6240;

/* best-season ribbon (12 months, 1 = ideal) for Sri Lanka */
const SEASON = {
  months: ['J','F','M','A','M','J','J','A','S','O','N','D'],
  score:  [3,3,2,2,1,0,0,0,1,1,2,3], // higher = better; shown as bars
  best: 'Janvier – Avril',
  note: 'Mousson sèche sur la côte sud et l’intérieur. Mer calme, idéale pour les baleines.',
};

/* per-day bookable activities (experiences) */
const ACTIVITIES = [];

const REVIEWS = [
  { who:'Élodie R.', av:'É', when:'Mai 2025', rate:5, t:'Itinéraire taillé sur-mesure, du premier au dernier jour. La conciergerie a tout anticipé — un vrai luxe.' },
  { who:'Marc & Lila', av:'M', when:'Avril 2025', rate:5, t:'Les hébergements choisis étaient une merveille, personnel aux petits soins. Chaque étape avait du sens.' },
  { who:'Thomas V.', av:'T', when:'Mars 2025', rate:4, t:'Voyage très bien rythmé et parfaitement organisé. Une journée de plus sur place n\'aurait pas été de trop.' },
];
const RATING = { score:'4,93', count:128 };

const BUDGET = { total:0, spent:0, lines:[] };

const AI_PROMPTS = [
  'Ajoute un jour de plus',
  'Rends le rythme plus lent',
  'Trouve une option plus économique',
  'Plus de gastronomie locale',
];
const AI_INTRO = 'Je suis votre cartographe. Décrivez un changement — j\'ajuste l\'itinéraire, les étapes et le budget en direct.';
