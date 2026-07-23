/* ── HIC SUNT · Sillage — features : carte, budget, activités, IA… ──── */


/* ── 13 · Budget ────────────────────────────────────────────────────── */
function budgetView(){
  /* Toujours recalculer avant d'afficher : reprend le comportement de
     l'ancien override window.budgetView (app.js), supprimé car il
     court-circuitait silencieusement cette version (chargée après en
     dernier script, il écrasait window.budgetView — la barre de progression,
     les statuts réglé/à régler et les dépenses réelles ci-dessous ne
     s'affichaient donc jamais). */
  if(typeof deriveBudget === 'function'){
    try{
      deriveBudget(
        ITINERARY.accommodations||[], ITINERARY.budgetTotal||0,
        ITINERARY.dest||'', ITINERARY.region||'', ITINERARY.country||'',
        ITINERARY.travelers||state.travelers||2, ITINERARY._flightInfo||null
      );
    }catch(e){ console.warn('deriveBudget', e); }
  }
  const b = BUDGET || {total:0, spent:0, lines:[]};
  if(!b.total && ITINERARY.budgetTotal) b.total = ITINERARY.budgetTotal;
  /* Filet de sécurité : si un ajustement précédent (chat Cartographe) a
     laissé BUDGET.total et ITINERARY.budgetTotal désynchronisés, l'écran
     Itinéraire afficherait un prix différent de celui-ci. BUDGET.total,
     issu de la répartition détaillée, fait foi. */
  if(b.total && ITINERARY.budgetTotal !== b.total) ITINERARY.budgetTotal = b.total;
  if(!b.lines || !b.lines.length) b.lines = [{i:'wallet',n:'Budget estimé',sub:'tout compris',amount:b.total,paid:false}];
  const pct = Math.round(b.spent / b.total * 100);
  const rest = b.total - b.spent;
  const isGen = !!ITINERARY.generated;
  const expTotal = _expensesTotal();
  return statusBar() + navbar('Budget du voyage')
    + '<div class="ov-scroll has-foot px">'
    +   '<div class="bud-card">'
    +     '<div class="bud-l">Total estimé · ' + esc(ITINERARY.dest) + '</div>'
    +     '<div class="bud-v">' + eur(b.total) + '</div>'
    +     '<div class="bud-s">' + travelerLabel(ITINERARY) + ' · ' + _days() + ' jours · estimation</div>'
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
    +   '<div class="section-h"><h2>Dépenses réelles</h2><span class="meta" data-expenses-total>' + eur(expTotal) + '</span></div>'
    +   '<div data-expenses-list>' + _expensesListHTML(ITINERARY.expenses||[]) + '</div>'
    +   '<button class="btn-ghost sm" style="margin-top:8px" onclick="openAddExpense()">+ Ajouter une dépense</button>'
    + '</div>'
    + (isGen
      ? '<div class="ov-foot"><div class="foot-price">'
        + '<div><div class="fp-v">' + eur(b.total) + '</div><div class="fp-l">estimation totale</div></div>'
        + '<button class="btn" onclick="if(window.openAllBookings){openAllBookings()}else{openBooking(\'' + (ITINERARY.accommodations[0]?ITINERARY.accommodations[0].id:'') + '\')}">Voir les hébergements</button>'
        + '</div></div>'
      : '<div class="ov-foot"><div class="foot-price">'
        + '<div><div class="fp-v">' + eur(rest) + '</div><div class="fp-l">solde restant</div></div>'
        + '<button class="btn" onclick="toast(\'Solde réglé — merci\')">Régler le solde</button>'
        + '</div></div>');
}

/* ── 13bis · Dépenses réelles ─────────────────────────────────────────
   Distinct de la répartition estimée ci-dessus : ce que le voyageur a
   vraiment dépensé, saisi à la main pendant/après le voyage. C'est ce
   suivi qui manque face à Stippl (expense tracker). Stocké dans
   ITINERARY.expenses[], persisté via updateSavedItinerary() comme
   companions/plan/accommodations. */
const EXPENSE_CATEGORIES = [
  { id:'accommodation', label:'Hébergement', i:'bed' },
  { id:'food',           label:'Repas',       i:'fork' },
  { id:'transport',      label:'Transport',   i:'plane' },
  { id:'activities',     label:'Activités',   i:'ticket' },
  { id:'shopping',       label:'Shopping',    i:'card' },
  { id:'other',          label:'Autre',       i:'wallet' },
];
function _expenseCat(id){
  return EXPENSE_CATEGORIES.find(function(c){ return c.id === id; }) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length-1];
}
function _expensesTotal(){
  return (ITINERARY.expenses||[]).reduce(function(s,e){ return s + (Number(e.amount)||0); }, 0);
}
function _fmtExpenseDate(d){
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d||'');
  return m ? m[3]+'/'+m[2] : '';
}
function _expensesListHTML(list){
  if(!list.length) return '<p style="color:var(--sub);font-size:14px;font-style:italic;padding:8px 0">Aucune dépense enregistrée pour l\'instant.</p>';
  return list.slice().sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); }).map(function(e){
    const cat = _expenseCat(e.category);
    const sub = cat.label + (e.date ? ' · ' + _fmtExpenseDate(e.date) : '');
    return '<div class="bline">' + ico(cat.i, 20, 1.5)
      + '<div class="bl-m"><div class="bl-n">' + esc(e.label || cat.label) + '</div><div class="bl-s">' + esc(sub) + '</div></div>'
      + '<div class="bl-r"><div class="bl-v">' + eur(e.amount) + '</div></div>'
      + '<span class="exp-del" onclick="event.stopPropagation();_deleteExpense(\'' + e.id + '\')" aria-label="Supprimer">' + ico('close',14,1.8) + '</span>'
      + '</div>';
  }).join('');
}
function openAddExpense(){
  window._expCatSel = 'other';
  openOverlay('add-expense', addExpenseView(), { modal:true });
  /* Même précaution que openAddCompanion : ne pas focus() avant la fin de
     la transition de la feuille, sinon le clavier iOS scrolle le contenu
     hors champ pendant l'animation. */
  setTimeout(function(){
    const inp = document.getElementById('expense-amount');
    if(inp) inp.focus();
  }, 420);
}
function _expenseCategoryChipsHTML(sel){
  return EXPENSE_CATEGORIES.map(function(c){
    return '<span class="chip' + (c.id===sel?' on':'') + '" onclick="_selectExpenseCategory(\'' + c.id + '\')">' + esc(c.label) + '</span>';
  }).join('');
}
function _selectExpenseCategory(id){
  window._expCatSel = id;
  const wrap = document.querySelector('[data-exp-cat-chips]');
  if(wrap) wrap.innerHTML = _expenseCategoryChipsHTML(id);
}
function addExpenseView(){
  const today = new Date().toISOString().slice(0,10);
  return '<div class="ov-scroll px" style="padding-top:28px">'
    +   '<div class="carte-handle-wrap"><div class="carte-handle"></div></div>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:22px;margin-bottom:6px">Ajouter une dépense</h1>'
    +   '<p style="color:var(--sub);font-size:13px;margin-bottom:16px">Suivez ce que vous dépensez vraiment sur ce voyage.</p>'
    +   '<div class="chips" data-exp-cat-chips style="margin-bottom:16px">' + _expenseCategoryChipsHTML(window._expCatSel) + '</div>'
    +   '<input id="expense-label" placeholder="Libellé (optionnel)" style="width:100%;padding:14px 16px;border-radius:14px;border:1px solid var(--line);background:var(--surface);font-size:15px;font-family:var(--sans);margin-bottom:10px">'
    +   '<input id="expense-amount" type="number" inputmode="decimal" min="0" step="0.01" placeholder="Montant en €" style="width:100%;padding:14px 16px;border-radius:14px;border:1px solid var(--line);background:var(--surface);font-size:15px;font-family:var(--sans);margin-bottom:10px" onkeydown="if(event.key===\'Enter\'){event.preventDefault();window._submitExpense()}">'
    +   '<input id="expense-date" type="date" value="' + today + '" style="width:100%;padding:14px 16px;border-radius:14px;border:1px solid var(--line);background:var(--surface);font-size:15px;font-family:var(--sans)">'
    +   '<button class="btn" style="width:100%;margin-top:16px" onclick="window._submitExpense()">Ajouter</button>'
    + '</div>';
}
window._submitExpense = async function(){
  const amountInp = document.getElementById('expense-amount');
  const labelInp = document.getElementById('expense-label');
  const dateInp = document.getElementById('expense-date');
  const amount = amountInp ? parseFloat(amountInp.value) : NaN;
  if(!amount || amount <= 0){ toast('Indiquez un montant'); return; }
  const cat = _expenseCat(window._expCatSel);
  const entry = {
    id: 'exp-' + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    category: cat.id,
    label: (labelInp && labelInp.value.trim()) || '',
    amount: Math.round(amount * 100) / 100,
    date: (dateInp && dateInp.value) || new Date().toISOString().slice(0,10),
  };
  ITINERARY.expenses = (ITINERARY.expenses||[]).concat([entry]);
  closeOverlay();
  toast('Dépense ajoutée ✓');
  _refreshExpensesUI();
  if(typeof updateSavedItinerary === 'function') await updateSavedItinerary();
};
function _deleteExpense(id){
  ITINERARY.expenses = (ITINERARY.expenses||[]).filter(function(e){ return e.id !== id; });
  _refreshExpensesUI();
  toast('Dépense supprimée');
  if(typeof updateSavedItinerary === 'function') updateSavedItinerary();
}
function _refreshExpensesUI(){
  const listEl = document.querySelector('[data-expenses-list]');
  if(listEl) listEl.innerHTML = _expensesListHTML(ITINERARY.expenses||[]);
  const totalEl = document.querySelector('[data-expenses-total]');
  if(totalEl) totalEl.textContent = eur(_expensesTotal());
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
    +   '<span class="eyebrow" style="display:block;margin-top:10px">Sélection sur-mesure</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Expériences sur-mesure</h1>'
    +   '<p class="lede" style="margin-top:10px">Des suggestions pour enrichir votre séjour — à organiser sur place ou auprès d\'un prestataire local.</p>'
    +   days.map(function(d){
        return '<div class="act-day">Jour ' + String(d).padStart(2,'0') + '</div>'
          + byDay[d].map(function(a){
            return '<div class="act" onclick="openActivityDetail(\'' + a.id + '\')" style="cursor:pointer">' + '<span class="a-th">' + ico(a.i, 26, 1.3) + '</span>'
              + '<div class="ac-m"><div class="ac-tag">' + esc(a.tag) + '</div><div class="ac-n">' + esc(a.n) + '</div>'
              + '<div class="ac-s">' + esc(a.loc) + ' · ' + esc(a.dur) + '</div></div>'
              + '<div class="ac-r"><span class="ac-p">' + (a.free || !a.price ? 'Gratuit' : '~' + eur(a.price)) + '</span></div></div>';
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
    +   '<div style="display:flex;align-items:center;justify-content:center;height:140px;background:var(--tile-bg);border-radius:14px;margin-top:14px;color:var(--ink)">' + ico(a.i, 48, 1.2) + '</div>'
    +   '<span class="eyebrow" style="display:block;margin-top:18px">' + esc(a.tag) + ' · Jour ' + a.day + '</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:26px;letter-spacing:-0.4px;margin-top:6px">' + esc(a.n) + '</h1>'
    +   '<div class="book-meta" style="margin-top:4px">' + esc(a.loc) + ' · ' + esc(a.dur) + '</div>'
    +   '<p class="book-desc" style="margin-top:14px">Une suggestion sur-mesure pour s\'intégrer naturellement à votre journée à ' + esc(a.loc) + '. ' + (a.free || !a.price ? 'En accès libre, aucune réservation nécessaire.' : 'Budget indicatif ~' + eur(a.price) + ' par personne — à organiser sur place ou auprès d\'un prestataire local.') + '</p>'
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

/* ── 22 · Abonnement Premium ───────────────────────────────────────────
   Reflète le vrai mécanisme de paiement (déblocage à l'itinéraire, valable
   48h — voir _hasActivePremiumStatus/_checkPaymentToken dans generate.js),
   pas un abonnement récurrent ni des paliers/points fabriqués : ce modèle
   n'existe pas côté paiement, et la stratégie de monétisation est en cours
   de refonte. Remplace l'ancien "Cercle Hic Sunt" (points/paliers fictifs,
   jamais connectés à un vrai système). */
function openPremium(){
  openOverlay('premium', premiumView());
}
function premiumView(){
  /* Sur iOS, le paywall Stripe est entièrement contourné (voir
     _isNativeIOSApp/_checkPaymentToken dans generate.js — Guideline 3.1.1,
     pas de lien de paiement externe pour du contenu numérique in-app).
     Afficher quand même les tarifs Stripe ici donnerait l'impression d'une
     fonctionnalité de paiement active alors qu'elle ne l'est jamais dans
     l'app — on adapte le contenu en conséquence plutôt que de laisser un
     écran qui ne correspond pas à ce que fait réellement l'app. */
  const isNativeIOS = (typeof _isNativeIOSApp === 'function') && _isNativeIOSApp();
  const email = (localStorage.getItem('hs_email')||'').toLowerCase().trim();
  const isOwner = email === 'charlottegperret@gmail.com';
  let paid = [];
  try{ paid = JSON.parse(localStorage.getItem('hs_paid_tokens')||'[]'); }catch(e){}
  const now = Date.now();
  const recentPaid = paid.filter(function(t){ return (now - t.ts) < 48*3600*1000; })
    .sort(function(a,b){ return b.ts - a.ts; });
  const labels = (typeof STRIPE_LABELS !== 'undefined') ? STRIPE_LABELS : {};
  const premium = isNativeIOS || ((typeof _hasActivePremiumStatus === 'function') && _hasActivePremiumStatus());

  if(isNativeIOS){
    return statusBar() + navbar('Accès complet')
      + '<div class="ov-scroll px">'
      +   '<div class="cercle-card">'
      +     '<div class="cc-tier">Tout inclus</div>'
      +     '<div class="cc-pts">Aucun paiement requis dans l\'application</div>'
      +   '</div>'
      +   '<div class="section-h"><h2>Comment ça marche</h2></div>'
      +   '<div class="perks" style="margin-top:0">'
      +     '<div class="perk">' + ico('sparkle',19,1.5) + '<div class="p-t">Itinéraires illimités</div><div class="p-d">Chaque voyage composé est intégralement accessible, sans restriction.</div></div>'
      +     '<div class="perk">' + ico('star',19,1.5) + '<div class="p-t">Aucun frais</div><div class="p-d">L\'application ne propose aucun achat.</div></div>'
      +   '</div>'
      + '</div>';
  }

  return statusBar() + navbar('Abonnement Premium')
    + '<div class="ov-scroll px">'
    +   '<div class="cercle-card">'
    +     '<div class="cc-tier">' + (isOwner ? 'Accès propriétaire' : (premium ? 'Premium actif' : 'Aucun déblocage actif')) + '</div>'
    +     '<div class="cc-pts">' + (isOwner ? 'Tous les itinéraires débloqués'
          : recentPaid.length ? recentPaid.length + ' voyage' + (recentPaid.length>1?'s':'') + ' débloqué' + (recentPaid.length>1?'s':'') + ' (48h)'
          : 'Débloqué à la composition d\'un voyage') + '</div>'
    +   '</div>'
    +   '<div class="section-h"><h2>Comment ça marche</h2></div>'
    +   '<div class="perks" style="margin-top:0">'
    +     '<div class="perk">' + ico('sparkle',19,1.5) + '<div class="p-t">Paiement à l\'itinéraire</div><div class="p-d">Chaque voyage composé se débloque séparément — pas d\'abonnement récurrent pour l\'instant.</div></div>'
    +     '<div class="perk">' + ico('star',19,1.5) + '<div class="p-t">Tarif selon la durée</div><div class="p-d">4,99€ (1-7j) · 9,99€ (8-14j) · 17,99€ (15j et plus).</div></div>'
    +     '<div class="perk">' + ico('bell',19,1.5) + '<div class="p-t">Valable 48h</div><div class="p-d">Le temps d\'explorer et d\'ajuster votre itinéraire.</div></div>'
    +   '</div>'
    +   '<div class="section-h"><h2>Historique</h2><span class="meta">Achats récents</span></div>'
    +   (recentPaid.length === 0
        ? '<p style="color:var(--sub);font-size:14px;margin-top:4px;font-style:italic">Composez votre premier voyage pour débloquer l\'itinéraire complet.</p>'
        : recentPaid.map(function(t){
            const label = labels[t.palier] || t.palier || '';
            const when = new Date(t.ts).toLocaleDateString('fr-FR', {day:'numeric', month:'long'});
            return '<div class="hist"><div><div class="hi-n">' + esc(t.dest || label) + '</div><div class="hi-w">' + esc(when) + '</div></div><span class="hi-p">' + esc(label) + '</span></div>';
          }).join(''))
    +   (premium ? '' : '<button class="btn" style="width:100%;margin-top:20px" onclick="closeOverlay();setTab(\'create\')">Composer un voyage</button>')
    + '</div>';
}

/* ── Pépites cachées (itinéraires générés) ──────────────────────────── */
function gemsView(){
  const gems = ITINERARY.gems || [];
  return statusBar() + navbar('Pépites cachées')
    + '<div class="ov-scroll px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">' + esc(ITINERARY.dest) + '</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Adresses secrètes</h1>'
    +   '<p class="lede" style="margin-top:10px">Sélectionnées sur-mesure — loin des sentiers battus.</p>'
    +   (gems.length === 0
        ? '<p style="color:var(--sub);font-size:14px;margin-top:24px;font-style:italic">Aucune pépite pour cette destination.</p>'
        : gems.map(function(g){
            return '<div class="review"><div class="rv-top"><div><div class="rv-n">' + esc(g.name) + '</div><div class="rv-d">' + esc(g.loc||'') + '</div></div></div>'
              + '<p>' + esc(g.desc||'') + '</p>'
              + (g.review ? '<p style="font-style:italic;color:var(--sub);font-size:13px;margin-top:8px;padding-left:10px;border-left:2px solid var(--line)">« ' + esc(g.review) + ' »' + (g.source ? '<span style="display:block;font-style:normal;font-size:11px;color:var(--sub);margin-top:2px;opacity:0.75">— ' + esc(g.source) + '</span>' : '') + '</p>' : '')
              + (g.tip ? '<p style="color:var(--sub);font-size:13px;margin-top:8px;font-style:italic">' + esc(g.tip) + '</p>' : '')
              + '</div>';
          }).join(''))
    + '</div>';
}

async function exportPDF(){
  const it = ITINERARY;

  /* ── Palette ── */
  const themeName = (typeof _themeForDestination === 'function')
    ? _themeForDestination(it.dest||'', it.region||'', it.country||'')
    : (it.theme || 'mediterranean');
  const palette = (typeof THEME_PALETTES !== 'undefined' && THEME_PALETTES[themeName])
    || it.palette
    || {hike:'#3A9E7E',beach:'#3A9EC9',spa:'#E8A87A',food:'#D44A2A',culture:'#D4943A',outdoor:'#4ABDB0',transit:'#A89880'};

  /* ── Couleurs signature étendues à tous les thèmes ── */
  const SIG_PDF = {
    mediterranean: { c1: palette.beach   ||'#3A9EC9', c2: palette.food    ||'#D44A2A' },
    desert:        { c1: palette.culture ||'#D4943A', c2: palette.food    ||'#D4522A' },
    alpine:        { c1: palette.hike    ||'#3A9E7E', c2: palette.outdoor ||'#4ABECE' },
    tropical:      { c1: palette.food    ||'#E87A4A', c2: palette.hike    ||'#2D9E6B' },
    tropical_io:   { c1: palette.beach   ||'#4AC8E0', c2: palette.spa     ||'#E87A9A' },
    steppe:        { c1: palette.beach   ||'#5A8AAA', c2: palette.hike    ||'#7A9E8A' },
    andean:        { c1: palette.culture ||'#C0A040', c2: palette.hike    ||'#8A6A3A' },
    urban_asia:    { c1: palette.culture ||'#7A50C0', c2: palette.food    ||'#E05030' },
    urban:         { c1: palette.culture ||'#7A65D4', c2: palette.food    ||'#D4854A' },
    savanna:       { c1: palette.outdoor ||'#70A850', c2: palette.culture ||'#B07030' },
    caribbean:     { c1: palette.beach   ||'#30C0C0', c2: palette.food    ||'#E0A030' },
  };
  const sig = SIG_PDF[themeName] || SIG_PDF.tropical;
  /* Priorité à la teinte RÉELLE du pays — même dégradé deux tons que les
     cards de l'app (DEST_BG_MAP) — pour que le PDF porte la même identité
     visuelle que "Mes voyages" plutôt qu'un thème générique par famille de
     destination. Fallback sur le thème générique si le pays n'est pas dans
     ce référentiel (destinations composées par l'IA hors catalogue). */
  const destPair = (function(){
    if(typeof DEST_BG_MAP === 'undefined' || typeof _stripAccents !== 'function') return null;
    const k = _stripAccents(it.dest||'');
    for(const pat in DEST_BG_MAP){ if(k.includes(_stripAccents(pat))) return DEST_BG_MAP[pat]; }
    return null;
  })();
  const sigColor  = destPair ? destPair[0] : sig.c1;
  const sigColor2 = destPair ? destPair[1] : sig.c2;

  /* ── Photo de couverture : même photo que les cards de l'app, encodée en
     data-URI. Le PDF peut être ouvert dans une fenêtre d'impression séparée
     ou enregistré comme fichier .html autonome — un chemin relatif n'y
     résoudrait plus, une image encodée s'affiche partout, hors-ligne compris. ── */
  async function _imgToDataURL(url){
    try{
      const res = await fetch(url);
      if(!res.ok) return null;
      const blob = await res.blob();
      return await new Promise(function(resolve){
        const reader = new FileReader();
        reader.onload = function(){ resolve(reader.result); };
        reader.onerror = function(){ resolve(null); };
        reader.readAsDataURL(blob);
      });
    }catch(e){ return null; }
  }
  const heroPhotoPath = (typeof destPhoto === 'function') ? destPhoto(it.dest||'') : null;
  const heroPhotoUrl = heroPhotoPath ? await _imgToDataURL(heroPhotoPath) : null;

  /* Petit emblème boussole — signature graphique réutilisée en couverture et
     en pied de page, à la manière d'un cachet de cire d'une maison de voyage. */
  const MARK_SVG = '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><circle cx="20" cy="20" r="17.5"/><circle cx="20" cy="20" r="12" stroke-dasharray="1 4"/><path d="M20 6v6M20 28v6M6 20h6M28 20h6" stroke-width="1.1"/><path d="M20 11l3.4 8-3.4 8-3.4-8z" fill="currentColor" stroke="none" opacity=".9"/></svg>';

  /* ── PDF layout par thème : fond, typographie, structure ── */
  /* Chaque thème a une identité visuelle distincte */
  const CAT_LABEL = {hike:'Rando & nature',beach:'Plage & océan',spa:'Bien-être',food:'Table & saveurs',culture:'Patrimoine',outdoor:'Plein air',transit:'Transfert'};
  const CAT_EMOJI = {hike:'\u{1F95E}',beach:'\u{1F30A}',spa:'\u{1F9D8}',food:'\u{1F37D}',culture:'\u{1F3DB}',outdoor:'\u2600',transit:'\u2708'};

  const stayById = {};
  (it.accommodations||[]).forEach(function(a){ stayById[a.id] = a; });

  const dayMomentIcon = {plane:'\u2708',fork:'\u25CB',droplet:'\u2740',wave:'\u223C',peaks:'\u25B2',arch:'\u25A0',leaf:'\u2741',sun:'\u2600',moon:'\u263D',bed:'\u25A1',star:'\u2605',camera:'\u25C9',ticket:'\u25C8',pin:'\u25CF',compass:'\u25C7'};

  /* ── timeline du circuit (étapes consécutives regroupées par lieu) ── */
  /* Normaliser le nom de lieu pour regrouper les variantes d'une même ville
     Ex: "Bangkok (Thonburi)" → "Bangkok"
         "Thonburi, Bangkok" → "Bangkok"
         "Chiang Mai - vieille ville" → "Chiang Mai" */
  function normalizeLoc(loc){
    if(!loc) return '';
    let s = loc.split(/[\(\,\/\-–]/)[0].trim();
    /* Cas spécial : "Quartier, Ville" → prendre la ville (deuxième partie) */
    const parts = loc.split(/[\,]/);
    if(parts.length >= 2){
      /* Si la première partie est un quartier connu, prendre la deuxième */
      const last = parts[parts.length-1].trim();
      if(last.length > 2 && last.length < 25) s = last;
    }
    /* Normaliser les grandes villes communes */
    const cityNorm = {
      // Sardaigne nord
      'thonburi':'Bangkok','sukhumvit':'Bangkok','silom':'Bangkok','khao san':'Bangkok',
      'old city':'Chiang Mai','nimman':'Chiang Mai','vieille ville':'Chiang Mai',
      'ao noi':'Krabi','ao nang':'Krabi','railay':'Krabi',
      'patong':'Phuket','kata':'Phuket','karon':'Phuket','kalim':'Phuket',
      'medina':'Marrakech','guéliz':'Marrakech','mellah':'Marrakech',
      'trastevere':'Rome','prati':'Rome','pigneto':'Rome',
      // Sardaigne sud
      'domus de maria':'Chia','su portu':'Chia','cala cipolla':'Chia',
      'isola di san pietro':'Carloforte','isola san pietro':'Carloforte',
      'san pietro':'Carloforte','carloforte':'Carloforte',
      'calasetta':'Calasetta','portoscuso':'Portoscuso',
      'sant anna arresi':'Sant Anna Arresi','porto pino':'Porto Pino',
      'villasimius':'Villasimius','capo carbonara':'Villasimius',
      'cagliari (aéroport)':'Cagliari','cagliari elmas':'Cagliari','elmas':'Cagliari',
      // Sardaigne centre/est
      'nuoro':'Nuoro','oliena':'Nuoro','orgosolo':'Orgosolo',
      'dorgali':'Dorgali','cala gonone':'Cala Gonone',
      // Sardaigne nord
      'baia sardinia':'Costa Smeralda','porto cervo':'Porto Cervo',
      'palau':'Palau','la maddalena':'La Maddalena',
      'costa smeralda nord':'Costa Smeralda','gallura':'Olbia',
    };
    const key = s.toLowerCase().trim();
    return cityNorm[key] || s;
  }

  const stops = [];
  (it.plan||[]).forEach(function(p, i){
    const normLoc = normalizeLoc(p.loc);
    const last = stops[stops.length-1];
    if (last && normalizeLoc(last.loc) === normLoc) { last.nights++; last.endDay = p.n; }
    else { stops.push({ loc:p.loc, normLoc:normLoc, nights:1, startDay:p.n, endDay:p.n, category:p.category }); }
  });
  const timelineHTML = stops.map(function(s, i){
    const color = palette[s.category] || sigColor;
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
    return '<div class="legend-item" style="color:'+(palette[c]||sigColor)+'"><div class="legend-dot"></div><span>'+(CAT_LABEL[c]||c)+'</span></div>';
  }).join('');

  /* ── jours regroupés par étape ── */
  let sectionHTML = '';
  let stopIdx = 0, dayInStop = 0;
  (it.plan||[]).forEach(function(p, i){
    if(!p) return;
    const color = palette[p.category] || sigColor;
    const rgbaBg = hexA(color, 0.07), rgbaB = hexA(color, 0.22);

    if (dayInStop === 0) {
      const s = stops[stopIdx] || {loc:p.loc||'',nights:1,startDay:p.n||i+1,endDay:p.n||i+1};
      sectionHTML += '<section class="leg-section">'
        + '<div class="leg-head" style="--c:'+color+'">'
        + '<div class="leg-num">'+String(stopIdx+1).padStart(2,'0')+'</div>'
        + '<div><div class="leg-tag">Jour '+s.startDay+(s.endDay>s.startDay?'\u2013'+s.endDay:'')+' \u00B7 '+s.nights+' nuit'+(s.nights>1?'s':'')+'</div>'
        + '<div class="leg-name">'+esc(s.loc)+'</div>'
        + (p.desc ? '<div class="leg-hook">'+esc(p.desc)+'</div>' : '')
        + '</div></div>';

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
        cards += '<div class="card" style="--bg:'+hexA(palette.food||sigColor2,0.07)+';--b:'+hexA(palette.food||sigColor2,0.22)+';--c:'+(palette.food||sigColor2)+'">'
          + '<div class="card-label">'+CAT_EMOJI.food+' Table</div>'
          + '<div class="card-name">'+esc(p.restaurant.name||'')+'</div>'
          + '<div class="card-desc">'+esc(p.restaurant.type||'')+(p.restaurant.note?' \u2014 '+esc(p.restaurant.note):'')+'</div>'
          + (p.restaurant.price ? '<div class="card-note">'+esc(p.restaurant.price)+'</div>' : '')
          + '</div>';
      }
      if (p.wellness) {
        cards += '<div class="card" style="--bg:'+hexA(palette.spa||'#E8A87A',0.07)+';--b:'+hexA(palette.spa||'#E8A87A',0.22)+';--c:'+(palette.spa||'#E8A87A')+'">'
          + '<div class="card-label">'+CAT_EMOJI.spa+' Bien-\u00EAtre</div>'
          + '<div class="card-name">'+esc(p.wellness.name||'')+'</div>'
          + '<div class="card-desc">'+esc(p.wellness.type||'')+(p.wellness.note?' \u2014 '+esc(p.wellness.note):'')+'</div>'
          + (p.wellness.price ? '<div class="card-note">'+esc(p.wellness.price)+'</div>' : '')
          + '</div>';
      }
      if (cards) sectionHTML += '<div class="cards">'+cards+'</div>';
    }

    const moments = Array.isArray(p.moments) ? p.moments : [];
    const momentsHTML = moments.map(function(m){
      const glyph = dayMomentIcon[m[1]] || '\u2022';
      return '<div class="moment"><span class="mo-time">'+esc(m[0])+'</span><span class="mo-glyph" style="color:'+color+'">'+glyph+'</span>'
        + '<div class="mo-text"><span class="mo-title">'+esc(m[2]||'')+'</span>'+(m[3]?'<span class="mo-detail">'+esc(m[3])+'</span>':'')+'</div></div>';
    }).join('');
    sectionHTML += '<div class="day">'
      + '<div class="day-head"><span class="day-num" style="color:'+color+'">'+String(p.n||i+1).padStart(2,'0')+'</span>'
      + '<div><h3>'+esc(p.title||'')+'</h3><p class="day-loc">'+esc(p.loc||'')+'</p></div></div>'
      + '<div class="moments">'+momentsHTML+'</div>'
      + (p.tip ? '<p class="day-tip" style="color:'+color+'">'+esc(p.tip)+'</p>' : '')
      + '</div>';

    dayInStop++;
    const curStop = stops[stopIdx];
    if (!curStop || dayInStop >= curStop.nights) { dayInStop = 0; stopIdx++; sectionHTML += '</section>'; }
  });

  /* ── pépites cachées : chapitre à part, traitement sombre "confidentiel" ── */
  const gemsHTML = (it.gems && it.gems.length) ? '<section class="leg-section gems-chapter">'
    + '<div class="gems-eyebrow">\u2726 \u2726 \u2726</div>'
    + '<h2 class="gems-title">Adresses d\u2019initi\u00E9s</h2>'
    + '<p class="gems-sub">Ce que peu de voyageurs d\u00E9couvrent \u2014 r\u00E9serv\u00E9 \u00E0 cet itin\u00E9raire.</p>'
    + '<div class="cards">' + it.gems.map(function(g){
        return '<div class="card" style="--bg:rgba(243,236,221,.05);--b:rgba(243,236,221,.16);--c:'+sigColor+'">'
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
  const budgetHTML = '<section class="leg-section" style="border-bottom:none"><div class="leg-head" style="--c:#8A6526">'
    + '<div class="leg-num" style="font-size:2.4rem">\u20AC</div><div><div class="leg-tag">Estimation</div><div class="leg-name">Budget du voyage</div></div></div>'
    + '<table><tr><th>\u00C9tape</th><th>Nuits</th><th>Type</th><th>Prix/nuit</th><th>Total</th></tr>'
    + stayRows
    + '<tr class="total-row"><td colspan="4">H\u00E9bergement ('+travelerLabel(it)+')</td><td class="price" style="color:#8A6526">'+eur(stayTotal)+'</td></tr>'
    + '<tr class="total-row" style="border-top-color:#8A6526"><td colspan="4"><strong>Total voyage estim\u00E9 (tout compris)</strong></td><td class="price" style="color:#8A6526;font-size:1.05rem;white-space:nowrap"><strong>'+eur(it.budgetTotal)+'</strong></td></tr>'
    + '</table></section>';

  /* ── PDF : fond ivoire clair, encre sombre, accents thématiques ── */
  /* On garde bgTheme uniquement pour les nuances d'accent panel (timeline, légende)
     mais le fond global devient ivoire premium, imprimable */
  const PDF_THEME = {
    bg:      '#F8F4EC',   /* ivoire chaud — imprimable */
    surface: '#FFFFFF',   /* blanc pur pour les cards */
    panel:   '#F1EBE0',   /* ivoire légèrement plus sombre pour timeline/légende */
    ink:     '#1A1610',   /* encre profonde */
    sub:     '#7A6E62',   /* gris chaud */
    line:    'rgba(26,22,16,0.10)',
    line2:   'rgba(26,22,16,0.05)',
  };

  const html = '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
    + '<title>'+esc(it.dest)+' \u2014 Hic Sunt</title>'
    + '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    + '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;1,300;1,500&family=Epilogue:wght@200;300;400;500&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{margin:0;padding:0;box-sizing:border-box}'
    + 'html{scroll-behavior:smooth}'
    + 'body{background:'+PDF_THEME.bg+';color:'+PDF_THEME.ink+';font-family:Epilogue,sans-serif;font-weight:300;line-height:1.7;-webkit-font-smoothing:antialiased}'
    + '.close-btn{position:fixed;top:18px;right:18px;width:38px;height:38px;border-radius:50%;background:'+PDF_THEME.ink+';color:'+PDF_THEME.bg+';border:none;font-size:18px;font-family:Epilogue,sans-serif;cursor:pointer;z-index:99;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.18)}'
    /* ── Hero : photo pleine largeur (même image que les cards de l'app) sous
       un voile sombre teinté couleur pays ; sans photo, dégradé thématique. ── */
    + '.hero{position:relative;min-height:430px;display:flex;flex-direction:column;justify-content:flex-end;padding:3rem 2.5rem 2.4rem;overflow:hidden;color:#F6F0E4}'
    + '.hero-bg{position:absolute;inset:0;background-size:cover;background-position:center}'
    + '.hero.no-photo .hero-bg{background-image:linear-gradient(135deg,'+sigColor+','+sigColor2+')}'
    + '.hero-veil{position:absolute;inset:0;background:linear-gradient(175deg,rgba(12,9,6,.4) 0%,rgba(12,9,6,.52) 45%,rgba(12,9,6,.88) 100%)}'
    + '.hero-mark{position:absolute;top:1.8rem;right:2rem;z-index:2;color:rgba(246,240,228,.75)}'
    + '.hero-eyebrow{font-size:.6rem;letter-spacing:.4em;text-transform:uppercase;color:'+sigColor+';margin-bottom:1rem;position:relative;z-index:2}'
    + '.hero h1{font-family:Fraunces,serif;font-weight:500;font-size:clamp(2.4rem,7vw,3.4rem);line-height:1;margin-bottom:.6rem;position:relative;z-index:2;color:#F6F0E4}'
    + '.hero h1 em{font-style:italic;color:'+sigColor+'}'
    + '.hero-tag{font-family:Fraunces,serif;font-style:italic;font-size:1.05rem;color:rgba(246,240,228,.85);margin-bottom:.9rem;position:relative;z-index:2}'
    + '.hero-meta{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(246,240,228,.65);position:relative;z-index:2;margin-bottom:1.4rem}'
    + '.hero-specs{display:flex;flex-wrap:wrap;gap:.55rem;position:relative;z-index:2}'
    + '.hero-spec{background:rgba(246,240,228,.1);border:1px solid rgba(246,240,228,.24);border-radius:10px;padding:.5rem .9rem}'
    + '.hero-spec-l{font-size:.5rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(246,240,228,.6);margin-bottom:.15rem}'
    + '.hero-spec-v{font-family:Fraunces,serif;font-size:1rem;color:#F6F0E4}'
    /* ── Journey : circuit complet, ligne continue et étapes ── */
    + '.timeline-wrap{background:'+PDF_THEME.panel+';border-top:1px solid '+PDF_THEME.line+';border-bottom:1px solid '+PDF_THEME.line+';padding:1.6rem 1.5rem;overflow-x:auto}'
    + '.tl-label{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:'+PDF_THEME.sub+';margin-bottom:1.4rem}'
    + '.timeline{display:flex;gap:1.4rem;width:max-content;position:relative}'
    + '.timeline::before{content:"";position:absolute;top:6px;left:6px;right:6px;height:1px;background:linear-gradient(to right,'+sigColor+','+sigColor2+')}'
    + '.tl-stop{flex:none;min-width:88px;position:relative;padding-top:18px}'
    + '.tl-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--c);background:'+PDF_THEME.bg+';position:absolute;top:0;left:0;box-shadow:0 0 0 3px '+PDF_THEME.panel+'}'
    + '.tl-stop.start .tl-dot,.tl-stop.end .tl-dot{width:14px;height:14px;top:-1px}'
    + '.tl-city{font-family:Fraunces,serif;font-size:.78rem;color:'+PDF_THEME.ink+';white-space:nowrap;margin-bottom:.1rem}'
    + '.tl-stop.start .tl-city,.tl-stop.end .tl-city{font-style:italic}'
    + '.tl-dates{font-size:.54rem;color:var(--c);letter-spacing:.06em;white-space:nowrap}'
    + '.tl-nights{font-size:.5rem;color:'+PDF_THEME.sub+';white-space:nowrap}'
    /* ── Légende catégories ── */
    + '.legend-bar{background:'+PDF_THEME.panel+';border-bottom:1px solid '+PDF_THEME.line+';padding:1rem 2.5rem;display:flex;flex-wrap:wrap;gap:.6rem}'
    + '.legend-item{display:inline-flex;align-items:center;gap:.4rem;font-size:.58rem;letter-spacing:.08em;text-transform:uppercase;padding:.32rem .8rem;border-radius:100px;border:1px solid currentColor;opacity:.92}'
    + '.legend-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;background:currentColor}'
    /* ── Sections jours ── */
    + '.leg-section{padding:2.6rem 2.5rem;border-bottom:1px solid '+PDF_THEME.line+'}'
    + '.leg-head{display:flex;gap:1.2rem;align-items:flex-start;margin-bottom:1.6rem}'
    + '.leg-num{font-family:Fraunces,serif;font-size:2.6rem;font-weight:300;color:var(--c);opacity:.25;line-height:1;flex-shrink:0}'
    + '.leg-tag{font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;color:var(--c);margin-bottom:.25rem}'
    + '.leg-name{font-family:Fraunces,serif;font-size:1.5rem;font-weight:300;color:'+PDF_THEME.ink+';line-height:1.15;margin-bottom:.25rem}'
    + '.leg-hook{font-family:Fraunces,serif;font-style:italic;font-size:.82rem;color:'+PDF_THEME.sub+'}'
    /* ── Cards hébergement/restaurant ── */
    + '.cards{display:grid;gap:.7rem;margin-bottom:1.6rem}'
    + '@media(min-width:640px){.cards{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}}'
    + '.card{border-radius:10px;padding:1.1rem 1.2rem;border:1px solid var(--b);border-top:3px solid var(--c);background:var(--bg)}'
    + '.card-label{font-size:.55rem;letter-spacing:.25em;text-transform:uppercase;font-weight:500;color:var(--c);margin-bottom:.5rem}'
    + '.card-name{font-family:Fraunces,serif;font-size:.95rem;font-weight:300;color:'+PDF_THEME.ink+';margin-bottom:.3rem;line-height:1.3}'
    + '.card-desc{font-size:.74rem;color:'+PDF_THEME.sub+';line-height:1.6}'
    + '.card-note{margin-top:.4rem;font-size:.68rem;color:'+PDF_THEME.sub+';opacity:.7;font-style:italic}'
    + '.card-price{margin-top:.4rem;font-size:.68rem;font-weight:500}'
    /* ── Jours individuels ── */
    + '.day{margin-bottom:1.1rem;page-break-inside:avoid;background:'+PDF_THEME.surface+';border:1px solid '+PDF_THEME.line+';border-radius:6px;padding:1rem 1.2rem}'
    + '.day:last-child{margin-bottom:0}'
    + '.day-head{display:flex;gap:.9rem;align-items:flex-start;margin-bottom:.5rem}'
    + '.day-num{font-family:Fraunces,serif;font-size:1.5rem;font-weight:300;line-height:1;min-width:38px}'
    + '.day-head h3{font-family:Fraunces,serif;font-weight:300;font-size:1rem;color:'+PDF_THEME.ink+';margin-bottom:.1rem}'
    + '.day-loc{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:'+PDF_THEME.sub+'}'
    + '.moments{margin-left:50px;border-left:1px solid '+PDF_THEME.line+';padding-left:16px}'
    + '.moment{display:flex;align-items:flex-start;gap:10px;padding:5px 0;font-size:.78rem}'
    + '.mo-time{font-size:.62rem;letter-spacing:.06em;color:'+PDF_THEME.sub+';min-width:38px;padding-top:1px}'
    + '.mo-glyph{font-size:.78rem;line-height:1.5;min-width:12px}'
    + '.mo-text{display:flex;flex-direction:column;gap:1px}'
    + '.mo-title{color:'+PDF_THEME.ink+'}'
    + '.mo-detail{color:'+PDF_THEME.sub+';font-size:.68rem}'
    + '.day-tip{margin:.6rem 0 0 50px;font-size:.7rem;font-style:italic;color:var(--c);opacity:.85}'
    /* ── Essentiels / budget ── */
    + '.essentials p{font-size:.78rem;margin-bottom:.5rem;display:flex;gap:.5rem;color:'+PDF_THEME.ink+'}'
    + '.essentials p span{color:'+sigColor+';font-weight:500;text-transform:uppercase;letter-spacing:.08em;font-size:.62rem;min-width:90px;flex-shrink:0}'
    + 'table{width:100%;border-collapse:collapse}'
    + 'th{text-align:left;font-size:.55rem;letter-spacing:.25em;text-transform:uppercase;color:'+sigColor+';font-weight:400;padding:.5rem .6rem;border-bottom:1px solid '+PDF_THEME.line+'}'
    + 'td{padding:.6rem .6rem;font-size:.74rem;color:'+PDF_THEME.sub+';border-bottom:1px solid '+PDF_THEME.line2+'}'
    + 'td.city{color:'+PDF_THEME.ink+'}'
    + 'td.price{color:'+PDF_THEME.ink+';font-weight:500}'
    + '.total-row td{border-top:1px solid '+hexA(sigColor,0.3)+';color:'+PDF_THEME.ink+';font-weight:500;padding-top:1rem}'
    /* ── Chapitre pépites : traitement sombre "confidentiel" ── */
    + '.gems-chapter{background:linear-gradient(160deg,#18130E,#241C14);text-align:center}'
    + '.gems-eyebrow{letter-spacing:.5em;font-size:.6rem;color:'+sigColor+';opacity:.85;margin-bottom:1rem}'
    + '.gems-title{font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:1.9rem;color:#F3ECDD;margin-bottom:.5rem}'
    + '.gems-sub{font-size:.78rem;color:rgba(243,236,221,.6);margin-bottom:2rem}'
    + '.gems-chapter .cards{text-align:left}'
    + '.gems-chapter .card-name{color:#F3ECDD}'
    + '.gems-chapter .card-desc,.gems-chapter .card-note{color:rgba(243,236,221,.62)}'
    /* ── Footer ── */
    + '.foot{padding:2.6rem 2.5rem;text-align:center;border-top:1px solid '+PDF_THEME.line+'}'
    + '.foot-mark{display:flex;justify-content:center;color:'+sigColor+';margin-bottom:.9rem}'
    + '.foot h3{font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:1.5rem;color:'+sigColor+';margin-bottom:.4rem}'
    + '.foot p{font-size:.6rem;color:'+PDF_THEME.sub+';letter-spacing:.2em;text-transform:uppercase}'
    + '.foot-line{width:32px;height:1px;background:'+sigColor+';opacity:.3;margin:.8rem auto}'
    + '@media print{body{background:#fff}.hero{-webkit-print-color-adjust:exact;print-color-adjust:exact}.gems-chapter{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
    + '@media(min-width:640px){.hero,.timeline-wrap,.legend-bar,.leg-section,.foot{padding-left:4rem;padding-right:4rem}}'
    + '</style></head><body>'
    + '<section class="hero'+(heroPhotoUrl?'':' no-photo')+'">'
    + '<div class="hero-bg"'+(heroPhotoUrl?' style="background-image:url(\''+heroPhotoUrl+'\')"':'')+'></div>'
    + '<div class="hero-veil"></div>'
    + '<div class="hero-mark">'+MARK_SVG+'</div>'
    + '<div class="hero-eyebrow">Itin\u00E9raire sur-mesure \u00B7 '+esc(it.country||it.dest)+'</div>'
    + '<h1>'+esc(it.dest)+'</h1>'
    + '<div class="hero-tag">'+esc(it.tag)+'</div>'
    + '<div class="hero-meta">'+esc(it.dates||'')+' \u00B7 '+esc(travelerLabel(it))+(it.coords?' \u00B7 '+esc(it.coords):'')+(it.season?' \u00B7 '+esc(it.season):'')+'</div>'
    + '<div class="hero-specs">'
    +   '<div class="hero-spec"><div class="hero-spec-l">Dur\u00E9e</div><div class="hero-spec-v">'+it.days+' jours</div></div>'
    +   '<div class="hero-spec"><div class="hero-spec-l">\u00C9tapes</div><div class="hero-spec-v">'+stops.length+'</div></div>'
    +   '<div class="hero-spec"><div class="hero-spec-l">Niveau</div><div class="hero-spec-v">'+esc(it.level)+'</div></div>'
    +   '<div class="hero-spec"><div class="hero-spec-l">Budget</div><div class="hero-spec-v">'+eur(it.budgetTotal)+'</div></div>'
    + '</div>'
    + '</section>'
    + '<div class="timeline-wrap"><div class="tl-label">Circuit complet \u00B7 '+stops.length+' \u00E9tape'+(stops.length>1?'s':'')+'</div><div class="timeline">'+timelineHTML+'</div></div>'
    + '<div class="legend-bar">'+legendHTML+'</div>'
    + sectionHTML
    + gemsHTML
    + essentialsHTML
    + budgetHTML
    + '<div class="foot"><div class="foot-mark">'+MARK_SVG+'</div><h3>Beau voyage \u2728</h3><div class="foot-line"></div>'
    + '<p>'+esc(it.dest)+' \u00B7 '+esc(it.dates)+' \u00B7 Hic Sunt \u00B7 Beyond the Known</p></div>'
    + '</body></html>';


  /* ── Overlay PDF ── */
  const pdfOverlay = document.createElement('div');
  pdfOverlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#F8F4EC;overflow:hidden';
  pdfOverlay.setAttribute('data-pdf-ov','');

  const pdfIframe = document.createElement('iframe');
  pdfIframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none';
  pdfIframe.srcdoc = html;

  /* Deux boutons flottants discrets — coin haut droit */
  const top = document.createElement('div');
  const safePad = 'calc(16px + env(safe-area-inset-top,0px))';
  top.style.cssText = 'position:absolute;top:'+safePad+';right:16px;z-index:10;display:flex;align-items:center;gap:8px';

  function mkBtn(content, action){
    const b = document.createElement('button');
    b.innerHTML = content;
    b.style.cssText = [
      'width:36px','height:36px',
      'border-radius:11px',
      'background:rgba(26,22,16,0.55)',
      'backdrop-filter:blur(12px)',
      '-webkit-backdrop-filter:blur(12px)',
      'color:white','border:none',
      'display:flex','align-items:center','justify-content:center',
      'cursor:pointer',
      '-webkit-tap-highlight-color:transparent',
      'font-size:15px',
    ].join(';');
    b.addEventListener('touchend', function(e){ e.preventDefault(); action(); });
    b.addEventListener('click', action);
    return b;
  }

  function doPrint(){
    var w = window.open('', '_blank');
    if(w){ w.document.write(html); w.document.close(); setTimeout(function(){ w.print(); }, 600); }
    else {
      try{
        var blob = new Blob([html],{type:'text/html'});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href=url; a.download=(it.dest||'itineraire').replace(/\s+/g,'-').toLowerCase()+'-hicsunt.html';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function(){ URL.revokeObjectURL(url); },1000);
      }catch(e){ pdfIframe.contentWindow.print(); }
    }
  }

  /* ↓ icône télécharger SVG */
  const dlIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 2v8M5 7l3 3 3-3M3 13h10"/></svg>';
  /* ✕ croix */
  const closeIcon = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>';

  top.appendChild(mkBtn(dlIcon, doPrint));
  top.appendChild(mkBtn(closeIcon, function(){ pdfOverlay.remove(); }));

  pdfOverlay.appendChild(pdfIframe);
  pdfOverlay.appendChild(top);
  document.body.appendChild(pdfOverlay);
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
