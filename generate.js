/* ── HIC SUNT · Sillage — moteur de génération IA ──────────────────────
   Connecté à l'Edge Function Supabase (super-endpoint).
   Deux appels séquentiels : ossature puis détail.               */

const SUPABASE_ENDPOINT = 'https://lucbxwxcismnvcdnctau.supabase.co/functions/v1/super-endpoint';

/* ── vocabulaire contraint ─────────────────────────────────────────── */
const GEN_KINDS = ['plane','fork','droplet','wave','peaks','arch','leaf','sun','moon','bed','star','camera','ticket','pin','compass'];
const GEN_SKY = ['sun','cloud','rain'];
const TAG_MAP = {
  plane:['plane','Transfert'], fork:['fork','Table'], droplet:['droplet','Détente'],
  wave:['wave','Océan'], peaks:['peaks','Marche'], arch:['arch','Patrimoine'],
  leaf:['leaf','Nature'], sun:['sun','Plein air'], moon:['moon','Soirée'],
  bed:['bed','Repos'], star:['star','Temps fort'], camera:['camera','Photo'],
  ticket:['ticket','Expérience'], pin:['pin','Étape'], compass:['compass','Exploration'],
};

/* ── helpers ────────────────────────────────────────────────────────── */
function _clampInt(v, lo, hi, dflt) {
  const n = Math.round(Number(v));
  if (!isFinite(n)) return dflt;
  return Math.max(lo, Math.min(hi, n));
}
function _kind(x) { return GEN_KINDS.includes(x) ? x : 'pin'; }
function _stayIcon(type) {
  const t = (type || '').toLowerCase();
  if (/mer|océan|ocean|plage|beach|front/.test(t)) return 'wave';
  if (/villa|piscine|pool/.test(t)) return 'droplet';
  if (/lodge|jungle|nature|tente|camp|safari|éco|eco/.test(t)) return 'leaf';
  if (/riad|palais|palace|temple|fort|kasbah|ryokan|maison|demeure/.test(t)) return 'arch';
  if (/sommet|montagne|chalet|refuge/.test(t)) return 'peaks';
  return 'bed';
}
function _occasionLabel(id) {
  const o = (typeof OCCASIONS !== 'undefined') && OCCASIONS.find(function(x) { return x.id === id; });
  return o ? o.label : null;
}

/* ── brief → prompt ─────────────────────────────────────────────────── */
function buildBrief() {
  const surprise = state.createTab === 'surprise';
  const occ = _occasionLabel(state.occasion);

  /* calcul durée à partir des dates */
  let datesLine = 'Dates : non précisées';
  let durationLine = '';
  if (state.dateFrom && state.dateTo) {
    const from = new Date(state.dateFrom);
    const to   = new Date(state.dateTo);
    const days = Math.round((to - from) / 86400000);
    const fmt  = function(d) { return d.toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }); };
    datesLine    = 'Dates : ' + fmt(from) + ' au ' + fmt(to);
    durationLine = 'Durée : ' + days + ' jour' + (days > 1 ? 's' : '');
  }

  /* vols optionnels */
  const flightsLine = (state.flightOut || state.flightIn)
    ? 'Vols : aller ' + (state.flightOut || 'non renseigné') + ' / retour ' + (state.flightIn || 'non renseigné')
    : '';

  const lines = [
    'Destination souhaitée : ' + (surprise || !state.destination
      ? 'à choisir toi-même pour le client (mode surprise) — propose une destination inattendue mais adaptée'
      : state.destination),
    'Ville de départ : ' + (state.origin || 'Paris'),
    datesLine,
    durationLine,
    'Voyageurs : ' + travelerLabel(),
    'Niveau de confort : ' + (state.budget || 'Confort'),
    'Rythme : ' + (state.rythme || 'Équilibré'),
    'Styles : ' + ((state.styles || []).join(', ') || 'variés'),
    "Centres d'intérêt : " + ((state.interests || []).join(', ') || 'découverte'),
    'Occasion : ' + (occ || 'aucune en particulier'),
    flightsLine,
    (surprise ? 'À éviter / contraintes : ' : 'Souhaits du voyage de rêve : ') + (state.dream || '—'),
  ].filter(Boolean).join('\n');

  return { surprise: surprise, lines: lines };
}

/* ── Passe 1 : ossature ─────────────────────────────────────────────── */
function buildSkeletonPrompt() {
  const brief = buildBrief();
  /* calcul jours pour les contraintes du prompt */
  let daysCount = 7;
  if (state.dateFrom && state.dateTo) {
    const d = Math.round((new Date(state.dateTo) - new Date(state.dateFrom)) / 86400000);
    if (d > 0) daysCount = d;
  }

  return [
    'Tu es le cartographe de Hic Sunt, maison de voyages sur-mesure haut de gamme.',
    "À partir du brief, compose l'OSSATURE d'un itinéraire réel et désirable.",
    '',
    'BRIEF CLIENT',
    brief.lines,
    '',
    'CONSIGNES',
    '- EXACTEMENT 5 étapes-clés réelles, dans un ordre de déplacement logique.',
    '- Hébergements VRAIS et plausibles ; gamme et budget adaptés au confort et au nombre de voyageurs.',
    "- Français sobre d'agence de luxe. Aucun emoji. Style télégraphique.",
    '- "budget" = coût total en euros, tout le voyage, tous les voyageurs.',
    '- Fourchettes budget RÉALISTES par personne par jour : Éco 80-150€, Confort 150-300€, Luxe 300-600€, Ultra 600€+.',
    '- Pour ' + travelerLabel() + ' en mode ' + (state.budget || 'Confort') + ' sur ' + daysCount + ' jours, le budget total doit être cohérent avec ces fourchettes.',
    '- "night" de chaque étape = "name" EXACT d\'un "stays".',
    '- Réponds UNIQUEMENT en JSON valide compact, sans texte ni balises autour.',
    '',
    'CONTRAINTES : blurb <= 6 mots ; 5 étapes ; 3 hébergements. sky dans [' + GEN_SKY.join(',') + '].',
    'SCHÉMA',
    '{"dest":"","tag":"sous-titre poétique court","level":"Éco|Confort|Luxe|Ultra",'
      + '"dates":"ex: Mars 2026 · " + daysCount + " jours","days_count":" + daysCount + ","budget":0,"season":"meilleure saison courte",'
      + '"stays":[{"name":"","type":"","loc":"","price":0,"nights":1,"blurb":""}],'
      + '"plan":[{"title":"","loc":"","night":"nom exact d\'un stay","sky":"sun","temp":"18°"}]}',
  ].join('\n');
}

/* ── Passe 2 : détail ───────────────────────────────────────────────── */
function buildDetailPrompt(skel) {
  const steps = (skel.plan || []).map(function(p, i) { return (i + 1) + '. ' + (p.title || '') + ' — ' + (p.loc || ''); }).join('\n');
  return [
    'Tu es le cartographe de Hic Sunt. Détaille chaque étape de cet itinéraire.',
    'Destination : ' + (skel.dest || '') + ' · Styles : ' + ((state.styles || []).join(', ') || 'variés') + ' · Rythme : ' + (state.rythme || 'Équilibré') + '.',
    '',
    'ÉTAPES (dans l\'ordre, ne change pas l\'ordre)',
    steps,
    '',
    'Pour CHAQUE étape : une description (<= 10 mots) et EXACTEMENT 2 moments concrets, réels et adaptés au lieu.',
    'Français sobre, télégraphique, aucun emoji. moment.d <= 7 mots.',
    'k (icône) dans [' + GEN_KINDS.join(',') + '].',
    'Réponds UNIQUEMENT en JSON compact, même ordre que les étapes, sans texte autour :',
    '{"days":[{"desc":"","moments":[{"t":"09:00","k":"arch","ti":"titre court","d":"détail court"},{"t":"19:00","k":"fork","ti":"","d":""}]}]}',
  ].join('\n');
}

/* ── parsing tolérant ───────────────────────────────────────────────── */
function repairTruncatedJSON(s) {
  const last = s.lastIndexOf('}');
  if (last < 0) return null;
  let t = s.slice(0, last + 1);
  let stack = [], inStr = false, esc = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') { inStr = true; continue; }
    if (c === '{' || c === '[') stack.push(c === '{' ? '}' : ']');
    else if (c === '}' || c === ']') stack.pop();
  }
  t = t.replace(/[\s,]*$/, '');
  let suffix = '';
  for (let i = stack.length - 1; i >= 0; i--) suffix += stack[i];
  try { return JSON.parse(t + suffix); } catch (e) { return null; }
}
function parseItineraryJSON(text) {
  if (!text) return null;
  let s = String(text).trim();
  s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  const slice = (a >= 0 && b > a) ? s.slice(a, b + 1) : s.slice(a >= 0 ? a : 0);
  try { return JSON.parse(slice); } catch (e) { /* tente réparation */ }
  return repairTruncatedJSON(s.slice(a >= 0 ? a : 0));
}

/* ── appel Supabase ─────────────────────────────────────────────────── */
async function _callSupabase(prompt) {
  const res = await fetch(SUPABASE_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: prompt }),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result || '';
}

/* ── appel modèle en 2 passes avec repli ───────────────────────────── */
async function _completeJSON(prompt) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const txt = await _callSupabase(prompt);
      const json = parseItineraryJSON(txt);
      if (json) return json;
    } catch (e) { /* on retente une fois */ }
  }
  return null;
}

function _momentIconFromTitle(t) {
  const s = (t || '').toLowerCase();
  if (/vol|aéro|aero|transfer|arriv|départ|depart/.test(s)) return 'plane';
  if (/dîner|diner|déjeuner|dejeuner|table|restaurant|gastro|cuisine/.test(s)) return 'fork';
  if (/temple|palais|musée|musee|patrimoine|fort|cité|cite|ruine/.test(s)) return 'arch';
  if (/plage|mer|océan|ocean|baignade|lagune|baleine/.test(s)) return 'wave';
  if (/randonn|trek|sommet|montagne|ascension|marche/.test(s)) return 'peaks';
  if (/spa|détente|detente|repos|bien-être|bien-etre|piscine/.test(s)) return 'droplet';
  if (/marché|marche|souk|artisan/.test(s)) return 'camera';
  return 'pin';
}

/* ── normalisation : réponse modèle → ITINERARY + dérivés ───────────── */
function applyGenerated(d) {
  const dest = d.dest || state.destination || 'Votre voyage';
  const level = ['Éco','Confort','Luxe','Ultra'].includes(d.level) ? d.level : (state.budget || 'Confort');

  const stayTags = ['Coup de coeur','Adresse rare','Signature Hic Sunt'];
  const stayRates = ['4,96','4,89','4,92'];
  const stays = (Array.isArray(d.stays) ? d.stays : []).slice(0, 3).map(function(s, i) {
    return {
      id: 'a' + (i + 1),
      n: s.name || ('Hébergement ' + (i + 1)),
      i: _stayIcon(s.type),
      type: s.type || 'Hôtel-boutique',
      loc: s.loc || dest,
      tag: stayTags[i] || 'Sélection',
      rate: stayRates[i] || '4,9',
      nights: _clampInt(s.nights, 1, 9, 2),
      price: _clampInt(s.price, 40, 4000, 220),
      am: ['bed', 'wifi', i % 2 ? 'fork' : 'pool'],
      blurb: s.blurb || 'Une adresse choisie pour son emplacement et son service.',
    };
  });
  while (stays.length < 1) stays.push({ id:'a1', n:'Hébergement local', i:'bed', type:'Hôtel-boutique', loc:dest, tag:'Sélection', rate:'4,9', nights:2, price:200, am:['bed','wifi','pool'], blurb:'' });

  const findStay = function(name) {
    if (!name) return null;
    const k = String(name).toLowerCase().trim();
    return stays.find(function(s) { return s.n.toLowerCase() === k; })
        || stays.find(function(s) { return s.n.toLowerCase().includes(k) || k.includes(s.n.toLowerCase()); });
  };

  const plan = (Array.isArray(d.plan) ? d.plan : []).slice(0, 5).map(function(p, i) {
    const moments = (Array.isArray(p.moments) ? p.moments : []).slice(0, 3).map(function(m) {
      return [m.t || '—', _kind(m.k), m.ti || 'Moment', m.d || ''];
    });
    if (!moments.length) moments.push(['—', 'pin', p.title || 'Étape', '']);
    const tags = [];
    moments.forEach(function(m) { if (tags.length < 2 && !tags.some(function(t) { return t[0] === m[1]; })) tags.push(TAG_MAP[m[1]] || TAG_MAP.pin); });
    while (tags.length < 2) tags.push(TAG_MAP.pin);
    const stay = findStay(p.night);
    return {
      n: i + 1,
      title: p.title || ('Étape ' + (i + 1)),
      loc: p.loc || dest,
      desc: p.desc || '',
      tags: tags,
      wx: [GEN_SKY.includes(p.sky) ? p.sky : 'sun', p.temp || '26°'],
      night: stay ? { acc: stay.id } : { n: p.night || 'Nuit sur place', loc: p.loc || dest },
      moments: moments,
    };
  });
  if (!plan.length) return false;

  const stayCost = stays.reduce(function(s, a) { return s + a.price * a.nights; }, 0);
  let budgetTotal = _clampInt(d.budget, stayCost, 80000, Math.round(stayCost * 2.4));
  if (budgetTotal < stayCost) budgetTotal = Math.round(stayCost * 2.2);

  ITINERARY.plan.length = 0; plan.forEach(function(p) { ITINERARY.plan.push(p); });
  ITINERARY.accommodations.length = 0; stays.forEach(function(s) { ITINERARY.accommodations.push(s); });
  Object.assign(ITINERARY, {
    dest: dest,
    tag: d.tag || 'Itinéraire composé pour vous',
    dates: d.dates || (state.destination ? 'Sur-mesure' : 'À définir'),
    days: _clampInt(d.days_count, plan.length, 40, plan.length),
    level: level,
    budgetTotal: budgetTotal,
    region: d.region || '',
    coords: d.region || dest,
    distance: (_clampInt(d.days_count, plan.length, 40, plan.length)) + ' jours',
  });

  deriveActivities(plan);
  deriveBudget(stays, budgetTotal);
  if (typeof SEASON !== 'undefined' && d.season) { SEASON.best = d.season; SEASON.note = d.season; }
  return true;
}

const ACT_PRICE = { peaks:78, arch:55, leaf:62, wave:95, droplet:48, fork:120, sun:52, star:88, camera:60, ticket:70, moon:64, compass:58, pin:50, plane:0, bed:0 };
const ACT_DUR = ['2 h','3 h','4 h','2 h 30','5 h','3 h 30'];
function deriveActivities(plan) {
  if (typeof ACTIVITIES === 'undefined') return;
  const picks = [];
  plan.forEach(function(p) {
    p.moments.forEach(function(m) {
      if (m[1] === 'plane' || m[1] === 'bed') return;
      picks.push({ day:p.n, i:m[1], n:m[2], loc:p.loc, tag:(TAG_MAP[m[1]] || TAG_MAP.pin)[1] });
    });
  });
  const sel = picks.slice(0, 6);
  ACTIVITIES.length = 0;
  sel.forEach(function(a, i) {
    const base = ACT_PRICE[a.i] || 55;
    ACTIVITIES.push({
      id:'ac' + (i + 1), day:a.day, i:a.i, n:a.n, loc:a.loc,
      dur:ACT_DUR[i % ACT_DUR.length],
      rate:['4,9','4,95','4,8','4,88','4,92','4,97'][i % 6],
      price:base + (i % 2 ? 7 : 0),
      tag:a.tag,
    });
  });
}

function deriveBudget(stays, total) {
  if (typeof BUDGET === 'undefined') return;
  const stayCost = stays.reduce(function(s, a) { return s + a.price * a.nights; }, 0);
  const actCost = (typeof ACTIVITIES !== 'undefined') ? ACTIVITIES.reduce(function(s, a) { return s + a.price; }, 0) : 0;
  const flights = Math.round(total * 0.32);
  const food = Math.round(total * 0.12);
  let transfers = total - stayCost - actCost - flights - food;
  if (transfers < 0) transfers = Math.round(total * 0.06);
  const nights = stays.reduce(function(s, a) { return s + a.nights; }, 0);
  const lines = [
    { i:'bed',     n:'Hébergements', sub:nights + ' nuit' + (nights > 1 ? 's' : '') + ' · ' + stays.length + ' adresse' + (stays.length > 1 ? 's' : ''), amount:stayCost, paid:true },
    { i:'plane',   n:'Vols',         sub:(state.origin || 'Paris') + ' · aller-retour · ' + travelerLabel(), amount:flights, paid:true },
    { i:'ticket',  n:'Activités & expériences', sub:(typeof ACTIVITIES !== 'undefined' ? ACTIVITIES.length : 0) + ' sélectionnées', amount:actCost, paid:false },
    { i:'fork',    n:'Restauration', sub:'Estimation · demi-pension', amount:food, paid:false },
    { i:'compass', n:'Transferts privés', sub:'Chauffeur dédié', amount:Math.max(0, transfers), paid:true },
  ];
  const spent = lines.filter(function(l) { return l.paid; }).reduce(function(s, l) { return s + l.amount; }, 0);
  Object.assign(BUDGET, { total:total, spent:spent, lines:lines });
}

/* ── appel cartographe en 2 passes ─────────────────────────────────── */
async function callCartographe() {
  /* passe 1 : ossature */
  const skel = await _completeJSON(buildSkeletonPrompt());
  if (!skel || !Array.isArray(skel.plan) || !skel.plan.length) return null;
  skel.plan = skel.plan.slice(0, 5);

  /* passe 2 : détail des étapes */
  const detail = await _completeJSON(buildDetailPrompt(skel));
  const days = detail && Array.isArray(detail.days) ? detail.days : [];
  skel.plan.forEach(function(p, i) {
    const d = days[i];
    if (d && Array.isArray(d.moments) && d.moments.length) {
      p.desc = d.desc || p.desc || '';
      p.moments = d.moments.slice(0, 3);
    } else {
      p.desc = p.desc || '';
      p.moments = [{ t:'—', k:_momentIconFromTitle(p.title), ti:p.title || 'Étape', d:'' }];
    }
  });
  return skel;
}

/* ── flux de génération ─────────────────────────────────────────────── */
async function runGeneration() {
  const el = openOverlay('generating', generationView(), { modal:true, carto:true });
  const gen = el.querySelector('.gen');
  requestAnimationFrame(function() { gen.classList.add('run'); });
  const statusEl = el.querySelector('[data-gen-status]');
  const steps = [
    'Lecture de vos envies…',
    'Choix des étapes…',
    "Tracé de l'itinéraire…",
    'Sélection des hébergements…',
    'Calibrage du budget…',
    'Derniers ajustements…',
  ];
  let si = 0;
  const cycle = setInterval(function() {
    si = (si + 1) % steps.length;
    if (statusEl) {
      statusEl.style.opacity = 0;
      setTimeout(function() { statusEl.textContent = steps[si]; statusEl.style.opacity = 1; }, 240);
    }
  }, 1100);

  const minShow = new Promise(function(r) { setTimeout(r, 1900); });
  let json = null;
  try { const results = await Promise.all([callCartographe(), minShow]); json = results[0]; }
  catch (e) { await minShow; }

  clearInterval(cycle);

  let ok = false;
  if (json) { try { ok = applyGenerated(json); } catch (e) { ok = false; } }
  if (!ok) toast('Connexion limitée — itinéraire de démonstration');

  if (statusEl) {
    statusEl.style.opacity = 0;
    setTimeout(function() { statusEl.textContent = 'Votre voyage est prêt.'; statusEl.style.opacity = 1; }, 200);
  }

  setTimeout(function() {
    openItinerary();
    saveItinerary();
    state.deckIndex = 0;
    if (typeof initDeck === 'function') initDeck();
    setTimeout(function() {
      const gi = ovStack.findIndex(function(o) { return o.dataset.ov === 'generating'; });
      if (gi >= 0) { const g = ovStack.splice(gi, 1)[0]; g.remove(); }
    }, 460);
  }, 620);
}

/* ── assistant Cartographe IA ───────────────────────────────────────── */
function aiItinerarySummary() {
  const it = ITINERARY;
  const days = it.plan.map(function(p) { return 'J' + p.n + ' ' + p.loc + ' : ' + p.title; }).join(' · ');
  return it.dest + ' · ' + it.days + ' jours · ' + it.level + ' · budget ~' + it.budgetTotal + ' € — ' + days;
}

async function aiCartographeReply(text) {
  const prompt = [
    "Tu es le cartographe de Hic Sunt, assistant d'édition d'itinéraire haut de gamme.",
    'Itinéraire actuel : ' + aiItinerarySummary(),
    '',
    'Le voyageur demande : "' + text + '"',
    '',
    "Réponds en français, ton sobre et concret, à la 1re personne (tu ajustes l'itinéraire).",
    '2 phrases maximum, précises (étape concernée, impact nuits/budget si pertinent). Aucun emoji.',
    'Renvoie UNIQUEMENT du JSON : {"reply":"...","chip":"étiquette courte ex: Jour 6 ajouté · +210 €"}',
  ].join('\n');
  try {
    const txt = await _callSupabase(prompt);
    let s = String(txt || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    const a = s.indexOf('{'), b = s.lastIndexOf('}');
    if (a >= 0 && b > a) s = s.slice(a, b + 1);
    const j = JSON.parse(s);
    if (j && j.reply) return { t:String(j.reply), chip:j.chip ? String(j.chip) : '' };
  } catch (e) { /* repli scripté */ }
  return null;
}

async function aiSend(text) {
  text = (text || '').trim();
  if (!text) return;
  const chat = document.querySelector('[data-ai-chat]');
  if (!chat) return;
  const me = document.createElement('div'); me.className = 'bub me'; me.textContent = text; chat.appendChild(me);
  const input = document.querySelector('[data-ai-input]'); if (input) input.value = '';
  aiScroll();
  const typing = document.createElement('div'); typing.className = 'typing'; typing.innerHTML = '<i></i><i></i><i></i>'; chat.appendChild(typing); aiScroll();

  let r = await aiCartographeReply(text);
  if (!r) r = (typeof aiReply === 'function') ? aiReply(text) : { t: "J'ajuste l'itinéraire en conséquence.", chip:'Itinéraire mis à jour' };

  typing.remove();
  const b = document.createElement('div'); b.className = 'bub them'; b.textContent = r.t; chat.appendChild(b);
  if (r.chip) {
    const c = document.createElement('div');
    c.style.cssText = 'align-self:flex-start;margin-top:2px';
    c.innerHTML = '<span class="status prep" style="display:inline-flex;align-items:center;gap:6px;padding:7px 11px">' + ico('check', 12, 2) + r.chip + '</span>';
    chat.appendChild(c);
  }
  aiScroll();
}
