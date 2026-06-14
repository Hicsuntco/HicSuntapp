/* ── HIC SUNT · Sillage — features : carte, budget, activités, IA… ──── */

/* ── 12 · Carte ─────────────────────────────────────────────────────── */
/* positions des étapes en % (route stylisée, 5 pins) */
const MAP_PTS = [[16,74],[34,30],[55,52],[72,24],[85,64]];
function mapSVG(w, h, activeIdx){
  const pts = ITINERARY.plan.map(function(p, i){
    const c = MAP_PTS[i % MAP_PTS.length];
    return [c[0] / 100 * w, c[1] / 100 * h];
  });
  let path = '';
  if (pts.length){
    path = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (let i = 1; i < pts.length; i++){
      const mx = ((pts[i-1][0] + pts[i][0]) / 2).toFixed(1);
      path += ' Q' + pts[i-1][0].toFixed(1) + ' ' + pts[i-1][1].toFixed(1) + ' ' + mx + ' ' + ((pts[i-1][1] + pts[i][1]) / 2).toFixed(1);
      path += ' T' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1);
    }
  }
  const pins = pts.map(function(c, i){
    const on = activeIdx === i;
    const r = on ? 14 : 11;
    return '<g class="mpin' + (on ? ' on' : '') + '"' + (activeIdx !== null ? ' style="cursor:pointer" onclick="mapSelect(' + i + ')"' : '') + '>'
      + '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="' + r + '"/>'
      + '<text x="' + c[0].toFixed(1) + '" y="' + (c[1] + (on ? 4.5 : 3.8)).toFixed(1) + '" font-size="' + (on ? 12 : 10) + '">' + (i + 1) + '</text></g>';
  }).join('');
  return graticule(w, h, 40) + contour()
    + '<svg class="map-svg" viewBox="0 0 ' + w + ' ' + h + '"><path class="route" d="' + path + '"/>' + pins + '</svg>';
}
function mapView(){
  const i = state.mapDay || 0;
  const p = ITINERARY.plan[i];
  const c = MAP_PTS[i % MAP_PTS.length];
  const popLeft = Math.max(4, Math.min(c[0] - 26, 40));
  const popTop = c[1] > 50 ? c[1] - 32 : c[1] + 8;
  const pop = p ? '<div class="map-pop" style="left:' + popLeft + '%;top:' + popTop + '%">'
    + '<div class="mp-k">Jour ' + String(p.n).padStart(2,'0') + ' · ' + esc(p.loc) + '</div>'
    + '<div class="mp-t">' + esc(p.title) + '</div>'
    + '<div class="mp-m"><span class="mp-wx">' + ico(p.wx[0],13,1.7) + p.wx[1] + '</span>'
    + '<span class="mp-l" onclick="openDay(' + i + ')">Détails ›</span></div></div>' : '';
  return statusBar()
    + navbar('Carte du voyage', { right:'<button class="nav-btn" onclick="openOffline()" aria-label="Hors-ligne">' + ico('download',18,1.6) + '</button>' })
    + '<div class="ov-scroll">'
    +   '<div class="bigmap">'
    +     '<span class="map-coords">' + esc(ITINERARY.coords || ITINERARY.dest) + '</span>'
    +     '<span class="map-rose">' + rose(26, 1.1) + '</span>'
    +     mapSVG(345, 460, i) + pop
    +   '</div>'
    +   '<div class="map-rail">' + ITINERARY.plan.map(function(d, j){
        return '<button class="map-chip' + (j === i ? ' on' : '') + '" onclick="mapSelect(' + j + ')">'
          + '<div class="mc-d">Jour ' + String(d.n).padStart(2,'0') + '</div><div class="mc-l">' + esc(d.loc) + '</div></button>';
      }).join('') + '</div>'
    + '</div>';
}
function mapSelect(i){
  state.mapDay = i;
  const el = ovStack[ovStack.length - 1];
  if (el && el.dataset.ov === 'map') el.innerHTML = mapView();
}

/* ── 13 · Budget ────────────────────────────────────────────────────── */
function budgetView(){
  const b = BUDGET;
  const pct = Math.round(b.spent / b.total * 100);
  const rest = b.total - b.spent;
  const isGen = !!ITINERARY.generated;
  return statusBar() + navbar('Budget du voyage')
    + '<div class="ov-scroll has-foot px">'
    +   '<div class="bud-card">' + contour()
    +     '<div class="bud-l">Total estimé · ' + esc(ITINERARY.dest) + '</div>'
    +     '<div class="bud-v">' + eur(b.total) + '</div>'
    +     '<div class="bud-s">' + travelerLabel() + ' · ' + ITINERARY.days + ' jours · estimation</div>'
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
        + '<button class="btn" onclick="openBooking(\'' + (ITINERARY.accommodations[0]?ITINERARY.accommodations[0].id:'') + '\')">Réserver les étapes</button>'
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
  let total = 0, count = 0;
  ACTIVITIES.forEach(function(a){ if (actSel[a.id]){ total += a.price; count++; } });
  return statusBar() + navbar('Activités & expériences')
    + '<div class="ov-scroll has-foot px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">Sélection du cartographe</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Expériences sur-mesure</h1>'
    +   '<p class="lede" style="margin-top:10px">Réservables en un geste — chacune s\'insère dans votre jour par jour.</p>'
    +   days.map(function(d){
        return '<div class="act-day">Jour ' + String(d).padStart(2,'0') + '</div>'
          + byDay[d].map(function(a){
            const on = !!actSel[a.id];
            return '<div class="act" onclick="openActivityDetail(\'' + a.id + '\')" style="cursor:pointer">' + '<span class="a-th">' + ico(a.i, 26, 1.3) + '</span>'
              + '<div class="ac-m"><div class="ac-tag">' + esc(a.tag) + '</div><div class="ac-n">' + esc(a.n) + '</div>'
              + '<div class="ac-s">' + esc(a.loc) + ' · ' + esc(a.dur) + ' · ' + ico('star',10) + a.rate + '</div></div>'
              + '<div class="ac-r"><span class="ac-p">' + eur(a.price) + '</span>'
              + '<button class="act-add' + (on ? ' on' : '') + '" onclick="event.stopPropagation();toggleAct(\'' + a.id + '\')" aria-label="Ajouter">' + ico(on ? 'check' : 'plus', 17, 1.8) + '</button></div></div>';
          }).join('');
      }).join('')
    + '</div>'
    + '<div class="ov-foot"><div class="foot-price">'
    +   '<div><div class="fp-v">' + eur(total) + '</div><div class="fp-l">' + count + ' expérience' + (count > 1 ? 's' : '') + ' sélectionnée' + (count > 1 ? 's' : '') + '</div></div>'
    +   '<button class="btn" onclick="addActs()">Ajouter à l\'itinéraire</button>'
    + '</div></div>';
}
function toggleAct(id){
  actSel[id] = !actSel[id];
  const el = ovStack[ovStack.length - 1];
  if (el && el.dataset.ov === 'activities'){ const st = el.querySelector('.ov-scroll').scrollTop; el.innerHTML = activitiesView(); el.querySelector('.ov-scroll').scrollTop = st; }
}
function addActs(){
  let count = 0;
  ACTIVITIES.forEach(function(a){ if (actSel[a.id]) count++; });
  toast(count ? count + ' expérience' + (count>1?'s':'') + ' ajoutée' + (count>1?'s':'') + ' à l\'itinéraire' : 'Sélectionnez au moins une expérience');
  if (count) closeOverlay();
}
function _actById(id){ return ACTIVITIES.find(function(a){ return a.id === id; }); }
function openActivityDetail(id){
  const a = _actById(id);
  if (!a) return;
  const on = !!actSel[a.id];
  const html = statusBar() + navbar('Activité')
    + '<div class="ov-scroll has-foot px">'
    +   '<div style="display:flex;align-items:center;justify-content:center;height:140px;background:var(--tile-bg);border-radius:14px;margin-top:14px;color:var(--gold)">' + ico(a.i, 48, 1.2) + '</div>'
    +   '<span class="eyebrow" style="display:block;margin-top:18px">' + esc(a.tag) + ' · Jour ' + a.day + '</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:26px;letter-spacing:-0.4px;margin-top:6px">' + esc(a.n) + '</h1>'
    +   '<div class="book-meta" style="margin-top:4px">' + esc(a.loc) + ' · ' + esc(a.dur) + ' · ' + ico('star',12) + ' ' + a.rate + '</div>'
    +   '<p class="book-desc" style="margin-top:14px">Une expérience sélectionnée par votre cartographe pour s\'intégrer naturellement à votre journée à ' + esc(a.loc) + '. Réservation flexible, annulation possible jusqu\'à 24h avant.</p>'
    + '</div>'
    + '<div class="ov-foot"><div class="foot-price">'
    +   '<div><div class="fp-v">' + eur(a.price) + '</div><div class="fp-l">par personne</div></div>'
    +   '<button class="btn' + (on?' gold':'') + '" onclick="toggleAct(\'' + a.id + '\');closeOverlay()">' + (on ? 'Retirer' : 'Ajouter à l\'itinéraire') + '</button>'
    + '</div></div>';
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

/* ── 16 · Cartographe IA ────────────────────────────────────────────── */
function aiView(){
  return statusBar()
    + '<div class="chat-nav"><button class="nav-btn ghost" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +   '<div class="chat-id"><span class="chat-av">' + ico('sparkle',18,1.6) + '<span class="on-dot"></span></span>'
    +   '<span><span class="chat-n">Cartographe</span><br><span class="chat-st">Assistant · en ligne</span></span></div></div>'
    + '<div class="chat-scroll" data-ai-chat>'
    +   '<span class="day-sep">Assistant d\'itinéraire</span>'
    +   '<div class="bub them">' + esc(AI_INTRO) + '</div>'
    + '</div>'
    + '<div class="quick">' + AI_PROMPTS.map(function(p){
        return '<button class="chip" onclick="aiSend(\'' + p.replace(/'/g, "\\'") + '\')">' + esc(p) + '</button>';
      }).join('') + '</div>'
    + '<div class="composer">'
    +   '<input data-ai-input placeholder="Décrivez un changement…" onkeydown="if(event.key===\'Enter\')aiSend(this.value)">'
    +   '<button class="send-btn" onclick="aiSend(document.querySelector(\'[data-ai-input]\').value)" aria-label="Envoyer">' + ico('arrowup',18,1.8) + '</button>'
    + '</div>';
}
function aiScroll(){
  const c = document.querySelector('[data-ai-chat]');
  if (c) c.scrollTop = c.scrollHeight;
}

/* ── 22 · Cercle Hic Sunt ───────────────────────────────────────────── */
function cercleView(){
  return statusBar() + navbar('Cercle Hic Sunt')
    + '<div class="ov-scroll px">'
    +   '<div class="cercle-card">' + contour()
    +     '<div class="cc-tier">' + esc(CERCLE.tier) + '</div>'
    +     '<div class="cc-pts">' + CERCLE.points + ' points</div>'
    +     '<div class="cc-prog"><i style="width:' + Math.round(CERCLE.progress * 100) + '%"></i></div>'
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
  const win = window.open('', '_blank');
  if (!win){ toast('Autorisez les pop-ups pour exporter'); return; }
  const stayById = {};
  it.accommodations.forEach(function(a){ stayById[a.id] = a; });
  const daysHTML = it.plan.map(function(p){
    const nightLabel = (p.night && p.night.acc && stayById[p.night.acc]) ? stayById[p.night.acc].n : (p.night ? p.night.n : '');
    const moments = p.moments.map(function(m){
      return '<li><b>'+esc(m[0])+'</b> — '+esc(m[2])+(m[3]?' · '+esc(m[3]):'')+'</li>';
    }).join('');
    return '<div style="margin-bottom:22px;page-break-inside:avoid">'
      + '<h3 style="font-family:Georgia,serif;margin:0 0 4px">Jour '+p.n+' — '+esc(p.title)+'</h3>'
      + '<p style="margin:0 0 6px;color:#666;font-size:13px">'+esc(p.loc)+'</p>'
      + '<p style="margin:0 0 8px;font-style:italic">'+esc(p.desc)+'</p>'
      + '<ul style="margin:0 0 8px;padding-left:18px;font-size:14px">'+moments+'</ul>'
      + (nightLabel ? '<p style="margin:0;font-size:13px;color:#666">Nuit : '+esc(nightLabel)+'</p>' : '')
      + (p.tip ? '<p style="margin:4px 0 0;font-size:13px;color:#9c7c44"><i>Conseil : '+esc(p.tip)+'</i></p>' : '')
      + '</div>';
  }).join('');
  const accHTML = it.accommodations.map(function(a){
    return '<div style="margin-bottom:14px;page-break-inside:avoid">'
      + '<h4 style="font-family:Georgia,serif;margin:0 0 2px">'+esc(a.n)+'</h4>'
      + '<p style="margin:0;font-size:13px;color:#666">'+esc(a.type)+' · '+esc(a.loc)+'</p>'
      + '<p style="margin:2px 0 0;font-size:13px">'+eur(a.price)+' / nuit · '+a.nights+' nuit'+(a.nights>1?'s':'')+'</p>'
      + (a.blurb ? '<p style="margin:4px 0 0;font-size:13px;font-style:italic">'+esc(a.blurb)+'</p>' : '')
      + '</div>';
  }).join('');
  const html = '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>'+esc(it.dest)+' — Itinéraire Hic Sunt</title>'
    + '<style>body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1b1610;max-width:680px;margin:40px auto;padding:0 24px;line-height:1.5}'
    + 'h1{font-family:Georgia,serif;font-size:32px;margin:0 0 4px}'
    + '.tag{font-style:italic;color:#9c7c44;margin:0 0 18px}'
    + '.meta{font-size:13px;color:#666;margin:0 0 28px;letter-spacing:.05em;text-transform:uppercase}'
    + 'h2{font-family:Georgia,serif;font-size:20px;border-bottom:1px solid #ddd;padding-bottom:6px;margin:32px 0 16px}'
    + '@media print{body{margin:0;padding:24px}}</style></head><body>'
    + '<h1>'+esc(it.dest)+'</h1>'
    + '<p class="tag">'+esc(it.tag)+'</p>'
    + '<p class="meta">'+esc(it.dates)+' · '+it.days+' jours · '+esc(it.level)+' · '+eur(it.budgetTotal)+' tout compris</p>'
    + '<h2>Jour par jour</h2>' + daysHTML
    + '<h2>Hébergements</h2>' + accHTML
    + '</body></html>';
  win.document.write(html);
  win.document.close();
  setTimeout(function(){ win.print(); }, 300);
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
  if (it.generated) {
    return statusBar() + navbar('Partager le voyage')
      + '<div class="ov-scroll px">'
      +   '<span class="eyebrow" style="display:block;margin-top:10px">' + esc(it.dest) + ' · ' + it.days + ' jours</span>'
      +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Partager ce voyage</h1>'
      +   '<div class="row" onclick="copyShareLink()"><span class="r-ico">' + ico('link',19,1.5) + '</span><div class="r-main"><div class="r-t">Copier le lien</div><div class="r-s">Lecture seule</div></div><span class="r-chev">' + ico('chevron',17,1.6) + '</span></div>'
      +   '<div class="row" onclick="sendShareLink()"><span class="r-ico">' + ico('share',18,1.5) + '</span><div class="r-main"><div class="r-t">Envoyer par message</div><div class="r-s">iMessage · WhatsApp</div></div><span class="r-chev">' + ico('chevron',17,1.6) + '</span></div>'
      +   '<div class="row" onclick="exportPDF()"><span class="r-ico">' + ico('doc',19,1.5) + '</span><div class="r-main"><div class="r-t">Exporter en PDF</div><div class="r-s">Itinéraire complet</div></div><span class="r-chev">' + ico('chevron',17,1.6) + '</span></div>'
      + '</div>';
  }
  return statusBar() + navbar('Partager le voyage')
    + '<div class="ov-scroll px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">' + esc(ITINERARY.dest) + ' · ' + ITINERARY.days + ' jours</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Voyager à plusieurs</h1>'
    +   '<div class="section-h"><h2>Co-voyageurs</h2><span class="meta">' + CONTRIBUTORS.length + '</span></div>'
    +   CONTRIBUTORS.map(function(c){
        return '<div class="contrib"><span class="avatar" style="width:40px;height:40px;font-size:13px;background:' + c.color + '">' + esc(c.av) + '</span>'
          + '<div><div class="c-n">' + esc(c.n) + '</div><div class="c-r">' + esc(c.role) + '</div></div>'
          + (c.you ? '<span class="c-you">Vous</span>' : '') + '</div>';
      }).join('')
    +   '<button class="btn-ghost sm" style="margin-top:16px" onclick="sendShareLink()">' + ico('plus',16,1.8) + 'Inviter un voyageur</button>'
    +   '<div class="section-h"><h2>Partager</h2></div>'
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
