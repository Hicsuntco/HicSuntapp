/* ── HIC SUNT · Sillage — écrans secondaires ────────────────────────── */

/* ── 20 · Préférences ───────────────────────────────────────────────── */
const _prefDraft = {};
function prefsView(){
  _prefDraft.styles = PREFS.styles.slice();
  _prefDraft.budget = PREFS.budget;
  _prefDraft.rythme = PREFS.rythme;
  _prefDraft.transport = PREFS.transport;
  const segRow = function(key, label, opts){
    return '<div class="section-h" style="margin-top:24px"><h2 style="font-size:17px">' + label + '</h2></div>'
      + '<div class="seg">' + opts.map(function(o){
          return '<button class="' + (_prefDraft[key] === o ? 'on' : '') + '" onclick="prefSeg(\'' + key + '\',\'' + o + '\',this)">' + o + '</button>';
        }).join('') + '</div>';
  };
  return statusBar() + navbar('Préférences')
    + '<div class="ov-scroll has-foot px">'
    +   '<div class="section-h" style="margin-top:14px"><h2 style="font-size:17px">Styles favoris</h2></div>'
    +   '<div class="chips">' + TRAVEL_STYLES.slice(0,7).map(function(s){
        return '<button class="chip' + (_prefDraft.styles.indexOf(s) >= 0 ? ' on' : '') + '" onclick="prefStyle(\'' + s.replace(/'/g, "\\'") + '\',this)">' + s + '</button>';
      }).join('') + '</div>'
    +   segRow('budget', 'Budget par défaut', ['Éco','Confort','Luxe','Ultra'])
    +   segRow('rythme', 'Rythme', ['Lent','Équilibré','Intense'])
    +   segRow('transport', 'Transport préféré', ['Train','Privé','Mixte'])
    + '</div>'
    + '<div class="ov-foot"><button class="btn" onclick="savePrefs()">Enregistrer</button></div>';
}
function prefStyle(s, el){ const i=_prefDraft.styles.indexOf(s); if(i>=0)_prefDraft.styles.splice(i,1);else _prefDraft.styles.push(s); el.classList.toggle('on',i<0); }
function prefSeg(key, val, el){ _prefDraft[key]=val; const sib=el.parentNode.children; for(let i=0;i<sib.length;i++) sib[i].classList.toggle('on',sib[i]===el); }
function savePrefs(){ PREFS.styles=_prefDraft.styles.slice();PREFS.budget=_prefDraft.budget;PREFS.rythme=_prefDraft.rythme;PREFS.transport=_prefDraft.transport;toast('Préférences enregistrées');closeOverlay(); }

/* ── 21 · Documents dynamiques ───────────────────────────────────────── */
/* stockage local des documents utilisateur */
if (!window._userDocs) window._userDocs = [];

function documentsView(){
  const dest = ITINERARY.dest || 'votre voyage';
  const allDocs = window._userDocs.slice();
  return statusBar() + navbar('Documents')
    + '<div class="ov-scroll px" style="padding-bottom:100px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">Voyage · ' + esc(dest) + '</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Passeport & documents</h1>'
    +   (allDocs.length === 0
        ? '<p style="color:var(--sub);font-size:14px;margin-top:24px;font-style:italic">Aucun document ajouté. Appuyez sur + pour commencer.</p>'
        : '<div style="margin-top:14px">' + allDocs.map(function(doc, idx){
            return '<div class="row"><span class="r-ico">' + ico(doc.i, 20, 1.5) + '</span>'
              + '<div class="r-main"><div class="r-t">' + esc(doc.n) + '</div><div class="r-s">' + esc(doc.s) + '</div></div>'
              + '<span class="status ' + doc.st[0] + '" style="cursor:pointer" onclick="cycleDocStatus(' + idx + ')">' + esc(doc.st[1]) + '</span></div>';
          }).join('') + '</div>')
    + '</div>'
    + '<button class="fab" onclick="openAddDoc()" aria-label="Ajouter un document">' + ico('plus', 22, 1.7) + '</button>';
}

function cycleDocStatus(idx){
  const statuses = [['ok','À jour'],['prep','À faire'],['draft','Manquant']];
  const doc = window._userDocs[idx];
  if (!doc) return;
  const cur = statuses.findIndex(function(s){ return s[0] === doc.st[0]; });
  doc.st = statuses[(cur + 1) % statuses.length];
  const el = ovStack[ovStack.length - 1];
  if (el) el.innerHTML = documentsView();
}

function openAddDoc(){
  const types = [
    { n:'Passeport', i:'doc', s:'Validité à vérifier' },
    { n:'Visa', i:'doc', s:'Demande à effectuer' },
    { n:'Assurance voyage', i:'shield', s:'À souscrire' },
    { n:'Billets d\'avion', i:'plane', s:'À réserver' },
    { n:'Réservation hôtel', i:'bed', s:'À confirmer' },
    { n:'Carnet de vaccination', i:'shield', s:'À vérifier' },
    { n:'Permis de conduire', i:'doc', s:'International requis ?' },
  ];
  const html = statusBar() + navbar('Ajouter un document')
    + '<div class="ov-scroll px">'
    + '<h1 style="font-family:var(--serif);font-weight:600;font-size:24px;margin-top:14px;margin-bottom:18px">Quel document ?</h1>'
    + types.map(function(t, i){
        return '<div class="row" style="cursor:pointer" onclick="addDoc(' + i + ')">'
          + '<span class="r-ico">' + ico(t.i, 20, 1.5) + '</span>'
          + '<div class="r-main"><div class="r-t">' + esc(t.n) + '</div><div class="r-s">' + esc(t.s) + '</div></div>'
          + '<span class="r-chev">' + ico('plus', 17, 1.6) + '</span></div>';
      }).join('')
    + '</div>';

  openOverlay('add-doc', html);
  /* store type list for access in addDoc */
  window._docTypes = types;
}

function addDoc(idx){
  const t = window._docTypes && window._docTypes[idx];
  if (!t) return;
  window._userDocs.push({ n: t.n, i: t.i, s: t.s, st: ['prep', 'À faire'] });
  closeOverlay(); /* ferme add-doc */
  /* refresh documents overlay */
  const el = ovStack[ovStack.length - 1];
  if (el && el.dataset.ov === 'documents') el.innerHTML = documentsView();
  toast(t.n + ' ajouté');
}

/* ── 23 · Notifications ─────────────────────────────────────────────── */
const NOTIF_KIND_ICON = { itinerary_ready:'compass' };
/* Horodatage relatif, ton simple cohérent avec le reste de l'app — pas de
   librairie de dates pour un besoin aussi ponctuel. */
function _notifRelTime(iso){
  const d = new Date(iso);
  if(isNaN(d)) return '';
  const min = Math.floor((Date.now() - d.getTime()) / 60000);
  if(min < 1) return 'à l\'instant';
  if(min < 60) return 'il y a ' + min + ' min';
  const h = Math.floor(min / 60);
  if(h < 24) return 'il y a ' + h + 'h';
  const j = Math.floor(h / 24);
  if(j < 7) return 'il y a ' + j + 'j';
  return d.toLocaleDateString('fr-FR', {day:'numeric', month:'short'});
}
function notificationsView(){
  /* Différé au tick suivant : notificationsView() n'a pas encore été inséré
     dans le DOM par openOverlay() au moment où cette fonction s'exécute
     (elle ne fait que RETOURNER le HTML, inséré après) — appeler fillNotifs
     tout de suite ferait chercher [data-notifs] avant qu'il n'existe. */
  setTimeout(fillNotifs, 0);
  return statusBar() + navbar('Notifications')
    + '<div class="ov-scroll px"><div data-notifs><div class="notif-load"><i></i></div></div></div>';
}
async function fillNotifs(){
  const host = document.querySelector('[data-notifs]');
  if(!host) return;
  const token = localStorage.getItem('sb_token');
  if(!token){
    host.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--sub);font-size:14px;font-style:italic">Connectez-vous pour recevoir vos notifications.</p>';
    return;
  }
  let rows = [];
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/notifications?select=id,title,body,kind,link,read,created_at&order=created_at.desc&limit=50',{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    if(res.ok) rows = await res.json();
  }catch(e){ rows = []; }
  /* host peut avoir disparu si l'écran a été fermé pendant le fetch */
  const hostNow = document.querySelector('[data-notifs]');
  if(!hostNow) return;
  if(!Array.isArray(rows) || !rows.length){
    hostNow.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--sub);font-size:14px;font-style:italic">Aucune notification pour le moment.</p>';
    return;
  }
  hostNow.innerHTML = rows.map(function(n){
    const action = n.link === 'open-itin' ? 'openItinerary()' : 'void(0)';
    return '<div class="notif" onclick="' + action + '">'
      + '<span class="n-i">' + ico(NOTIF_KIND_ICON[n.kind] || 'bell', 18, 1.5) + '</span>'
      + '<div><div class="n-t">' + esc(n.title) + '</div><div class="n-d">' + esc(n.body) + '</div><div class="n-w">' + esc(_notifRelTime(n.created_at)) + '</div></div>'
      + (!n.read ? '<span class="n-dot"></span>' : '')
      + '</div>';
  }).join('');
  _markNotifsRead(rows);
}
/* Marquage silencieux : une notification vue à l'écran est considérée lue,
   pas besoin d'une action explicite de l'utilisateur pour "l'acquitter". */
async function _markNotifsRead(rows){
  const token = localStorage.getItem('sb_token');
  const unreadIds = (rows||[]).filter(function(n){return !n.read;}).map(function(n){return n.id;});
  if(!token || !unreadIds.length) return;
  try{
    await fetch(SUPABASE_URL+'/rest/v1/notifications?id=in.(' + unreadIds.join(',') + ')',{
      method:'PATCH',
      headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Prefer':'return=minimal'},
      body: JSON.stringify({read:true})
    });
  }catch(e){}
}

/* ── 17 · Conciergerie Hansa — IA contextualisée ───────────────────── */
function conciergeView(){
  const dest = ITINERARY.dest || 'votre destination';
  const intro = 'Bonjour ' + USER.name + ' ! Je suis Hansa, votre conciergère pour ' + dest + '. '
    + 'Je connais votre itinéraire dans le détail. Comment puis-je vous aider ?';

  /* suggestions de questions contextuelles */
  const suggestions = _conciergeQuickReplies(dest);

  return statusBar()
    + '<div class="chat-nav"><button class="nav-btn ghost" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +   '<div class="chat-id"><span class="chat-av">H<span class="on-dot"></span></span>'
    +   '<span><span class="chat-n">Hansa</span><br><span class="chat-st">Conciergerie · ' + esc(dest) + '</span></span></div></div>'
    + '<div class="chat-scroll" data-cc-chat>'
    +   '<span class="day-sep">Votre conciergerie</span>'
    +   '<div class="bub them">' + esc(intro) + '</div>'
    + '</div>'
    + '<div class="quick">' + suggestions.map(function(p){
        return '<button class="chip" onclick="sendMessage(\'' + p.replace(/'/g, "\\'") + '\')">' + esc(p) + '</button>';
      }).join('') + '</div>'
    + '<div class="composer">'
    +   '<input data-cc-input placeholder="Écrire à Hansa…" onkeydown="if(event.key===\'Enter\')sendMessage(this.value)">'
    +   '<button class="send-btn" onclick="sendMessage(document.querySelector(\'[data-cc-input]\').value)" aria-label="Envoyer">' + ico('arrowup',18,1.8) + '</button>'
    + '</div>';
}

function _conciergeQuickReplies(dest){
  /* suggestions contextuelles selon la destination et les étapes */
  const base = ['Meilleur restaurant sur place', 'Transport depuis l\'aéroport', 'Que mettre dans ma valise ?'];
  const plan = ITINERARY.plan || [];
  if (plan.length) {
    base.unshift('Réserver le jour ' + plan[0].n + ' à ' + plan[0].loc);
  }
  const interests = (state.interests || []);
  if (interests.includes('Spa & Bien-être')) base.push('Meilleur spa à ' + dest);
  if (interests.includes('Gastronomie locale')) base.push('Table d\'exception sur l\'itinéraire');
  return base.slice(0, 4);
}

/* Hansa IA — répond via Supabase, contextualisée sur la destination */
async function sendMessage(text){
  text = (text || '').trim(); if (!text) return;
  const chat = document.querySelector('[data-cc-chat]'); if (!chat) return;
  const me = document.createElement('div'); me.className = 'bub me'; me.textContent = text; chat.appendChild(me);
  const input = document.querySelector('[data-cc-input]'); if (input) input.value = '';
  chat.scrollTop = chat.scrollHeight;
  const typing = document.createElement('div'); typing.className = 'typing'; typing.innerHTML = '<i></i><i></i><i></i>';
  chat.appendChild(typing); chat.scrollTop = chat.scrollHeight;

  /* appel IA contextualisé */
  let reply = await _hansaReply(text);
  if (!reply) {
    const fallbacks = [
      'Je m\'en occupe immédiatement et je reviens vers vous dans l\'heure.',
      'Parfait — je contacte nos partenaires sur place pour vous confirmer.',
      'Bien noté. Je vérifie les disponibilités et vous propose deux options.',
      'C\'est arrangé. Vous recevrez la confirmation dans vos documents.',
    ];
    reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  typing.remove();
  const b = document.createElement('div'); b.className = 'bub them'; b.textContent = reply; chat.appendChild(b);
  chat.scrollTop = chat.scrollHeight;
}

async function _hansaReply(text){
  const dest = ITINERARY.dest || 'la destination';
  const plan = (ITINERARY.plan || []).map(function(p){ return 'J' + p.n + ' ' + p.loc + ' : ' + p.title; }).join(', ');
  const prompt = [
    'Tu es Hansa, conciergère experte de Hic Sunt, maison de voyages haut de gamme.',
    'Tu connais parfaitement la destination : ' + dest + (ITINERARY.country ? ' (' + ITINERARY.country + ')' : '') + '.',
    'Itinéraire du client : ' + plan,
    'Saison : ' + (ITINERARY.season || 'non précisée'),
    '',
    'Le voyageur dit : "' + text + '"',
    '',
    'Réponds en français, ton chaleureux et professionnel, avec des informations SPÉCIFIQUES à ' + dest + '.',
    'Donne de vrais noms de restaurants, spas, transports, activités locales si pertinent.',
    '2-3 phrases max. Aucun emoji. Renvoie UNIQUEMENT le texte de la réponse, sans JSON ni balises.',
  ].join('\n');
  try {
    const txt = await _callSupabase(prompt);
    return (txt || '').trim().replace(/^["']|["']$/g, '');
  } catch(e) { return null; }
}
