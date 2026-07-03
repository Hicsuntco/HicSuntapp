/* ── HIC SUNT · Sillage — features : carte, budget, activités, IA… ──── */


/* ── 13 · Budget ────────────────────────────────────────────────────── */
function budgetView(){
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
  return statusBar() + navbar('Budget du voyage')
    + '<div class="ov-scroll has-foot px">'
    +   '<div class="bud-card">'
    +     '<div class="bud-l">Total estimé · ' + esc(ITINERARY.dest) + '</div>'
    +     '<div class="bud-v">' + eur(b.total) + '</div>'
    +     '<div class="bud-s">' + travelerLabel() + ' · ' + _days() + ' jours · estimation</div>'
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
        + '<button class="btn" onclick="if(window.openAllBookings){openAllBookings()}else{openBooking(\'' + (ITINERARY.accommodations[0]?ITINERARY.accommodations[0].id:'') + '\')}">Voir les hébergements</button>'
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
    +   '<div style="display:flex;align-items:center;justify-content:center;height:140px;background:var(--tile-bg);border-radius:14px;margin-top:14px;color:var(--gold)">' + ico(a.i, 48, 1.2) + '</div>'
    +   '<span class="eyebrow" style="display:block;margin-top:18px">' + esc(a.tag) + ' · Jour ' + a.day + '</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:26px;letter-spacing:-0.4px;margin-top:6px">' + esc(a.n) + '</h1>'
    +   '<div class="book-meta" style="margin-top:4px">' + esc(a.loc) + ' · ' + esc(a.dur) + '</div>'
    +   '<p class="book-desc" style="margin-top:14px">Une suggestion de votre cartographe pour s\'intégrer naturellement à votre journée à ' + esc(a.loc) + '. ' + (a.free || !a.price ? 'En accès libre, aucune réservation nécessaire.' : 'Budget indicatif ~' + eur(a.price) + ' par personne — à organiser sur place ou auprès d\'un prestataire local.') + '</p>'
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
    +   '<div class="cercle-card">'
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
  const sigColor  = sig.c1;
  const sigColor2 = sig.c2;

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
    return '<div class="legend-item"><div class="legend-dot" style="background:'+(palette[c]||sigColor)+'"></div><span style="color:'+(palette[c]||sigColor)+'">'+(CAT_LABEL[c]||c)+'</span></div>';
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

  /* ── pépites cachées ── */
  const gemsHTML = (it.gems && it.gems.length) ? '<section class="leg-section"><div class="leg-head" style="--c:'+(palette.culture||sigColor)+'">'
    + '<div class="leg-num">\u2726</div><div><div class="leg-tag">R\u00E9capitulatif</div><div class="leg-name">Adresses secr\u00E8tes</div></div></div>'
    + '<div class="cards">' + it.gems.map(function(g){
        const color = palette.culture || sigColor;
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
  const budgetHTML = '<section class="leg-section" style="border-bottom:none"><div class="leg-head" style="--c:#8A6526">'
    + '<div class="leg-num" style="font-size:2.4rem">\u20AC</div><div><div class="leg-tag">Estimation</div><div class="leg-name">Budget du voyage</div></div></div>'
    + '<table><tr><th>\u00C9tape</th><th>Nuits</th><th>Type</th><th>Prix/nuit</th><th>Total</th></tr>'
    + stayRows
    + '<tr class="total-row"><td colspan="4">H\u00E9bergement ('+travelerLabel()+')</td><td class="price" style="color:#8A6526">'+eur(stayTotal)+'</td></tr>'
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
    /* ── Hero : fond ivoire avec gradient de couleur thématique très léger ── */
    + '.hero{padding:4.5rem 2.5rem 3rem;position:relative;overflow:hidden;border-bottom:'+PDF_THEME.dividerStyle+'}'
    + '.hero-bg{position:absolute;inset:0;background:'+PDF_THEME.heroBgStyle+'}'
    + '.hero-eyebrow{font-size:.6rem;letter-spacing:.4em;text-transform:uppercase;color:'+sigColor+';margin-bottom:1.2rem;position:relative;z-index:2}'
    + '.hero h1{font-family:Fraunces,serif;font-weight:'+PDF_THEME.heroWeight+';font-size:'+PDF_THEME.heroSize+';line-height:1;margin-bottom:1.4rem;position:relative;z-index:2;color:'+PDF_THEME.ink+'}'
    + '.hero h1 em{font-style:italic;color:'+sigColor+'}'
    + '.hero-pills{display:flex;flex-wrap:wrap;gap:.5rem;position:relative;z-index:2;margin-bottom:1.2rem}'
    + '.pill{font-size:.62rem;letter-spacing:.08em;padding:.3rem .85rem;border-radius:20px;border:1px solid;font-weight:400}'
    + '.hero-meta{font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;color:'+PDF_THEME.sub+';position:relative;z-index:2}'
    + '.hero-tag{font-family:Fraunces,serif;font-style:italic;font-size:1rem;color:'+PDF_THEME.sub+';margin-bottom:1rem;position:relative;z-index:2}'
    /* ── Timeline ── */
    + '.timeline-wrap{background:'+PDF_THEME.panel+';border-top:1px solid '+PDF_THEME.line+';border-bottom:1px solid '+PDF_THEME.line+';padding:1.6rem 1.5rem;overflow-x:auto}'
    + '.tl-label{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:'+PDF_THEME.sub+';margin-bottom:1.2rem}'
    + '.timeline{display:flex;gap:1.4rem;width:max-content}'
    + '.tl-stop{flex:none;min-width:88px;position:relative;padding-top:18px}'
    + '.tl-stop::before{content:"";position:absolute;top:6px;left:-16px;right:-16px;height:1px;background:'+PDF_THEME.line+'}'
    + '.tl-stop.start::before{left:6px}.tl-stop.end::before{right:6px}'
    + '.tl-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--c);background:'+PDF_THEME.bg+';position:absolute;top:0;left:0}'
    + '.tl-city{font-family:Fraunces,serif;font-size:.78rem;color:'+PDF_THEME.ink+';white-space:nowrap;margin-bottom:.1rem}'
    + '.tl-dates{font-size:.54rem;color:var(--c);letter-spacing:.06em;white-space:nowrap}'
    + '.tl-nights{font-size:.5rem;color:'+PDF_THEME.sub+';white-space:nowrap}'
    /* ── Légende catégories ── */
    + '.legend-bar{background:'+PDF_THEME.panel+';border-bottom:1px solid '+PDF_THEME.line+';padding:1rem 2.5rem;display:flex;flex-wrap:wrap;gap:1.1rem}'
    + '.legend-item{display:flex;align-items:center;gap:.4rem;font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;color:'+PDF_THEME.sub+'}'
    + '.legend-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}'
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
    + '.card{border-radius:8px;padding:1rem 1.1rem;border:1px solid var(--b);background:var(--bg)}'
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
    /* ── Footer ── */
    + '.foot{padding:2.6rem 2.5rem;text-align:center;border-top:1px solid '+PDF_THEME.line+'}'
    + '.foot h3{font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:1.5rem;color:'+sigColor+';margin-bottom:.4rem}'
    + '.foot p{font-size:.6rem;color:'+PDF_THEME.sub+';letter-spacing:.2em;text-transform:uppercase}'
    + '.foot-line{width:32px;height:1px;background:'+sigColor+';opacity:.3;margin:.8rem auto}'
    + '@media print{body{background:#fff}}'
    + '@media(min-width:640px){.hero,.timeline-wrap,.legend-bar,.leg-section,.foot{padding-left:4rem;padding-right:4rem}}'
    + '</style></head><body>'
    + '<section class="hero"><div class="hero-bg"></div>'
    + '<div class="hero-eyebrow">Itin\u00E9raire compos\u00E9 \u00B7 Hic Sunt \u00B7 '+esc(it.country||it.dest)+'</div>'
    + '<h1>'+esc(it.dest)+'</h1>'
    + '<div class="hero-tag">'+esc(it.tag)+'</div>'
    + '<div class="hero-pills">'
    + '<span class="pill" style="color:'+sigColor+';border-color:'+hexA(sigColor,0.3)+'">'+esc(it.dates)+'</span>'
    + '<span class="pill" style="color:'+(palette.beach||sigColor2)+';border-color:'+hexA(palette.beach||sigColor2,0.3)+'">'+it.days+' jours</span>'
    + '<span class="pill" style="color:'+(palette.food||sigColor2)+';border-color:'+hexA(palette.food||sigColor2,0.3)+'">'+esc(it.level)+'</span>'
    + '<span class="pill" style="color:'+PDF_THEME.sub+';border-color:'+PDF_THEME.line+'">'+travelerLabel()+'</span>'
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
