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
    +   '<div class="chips">' + TRAVEL_STYLES.slice(0, 7).map(function(s){
        return '<button class="chip' + (_prefDraft.styles.indexOf(s) >= 0 ? ' on' : '') + '" onclick="prefStyle(\'' + s.replace(/'/g, "\\'") + '\',this)">' + s + '</button>';
      }).join('') + '</div>'
    +   segRow('budget', 'Budget par défaut', ['Éco','Confort','Luxe','Ultra'])
    +   segRow('rythme', 'Rythme', ['Lent','Équilibré','Intense'])
    +   segRow('transport', 'Transport préféré', ['Train','Privé','Mixte'])
    + '</div>'
    + '<div class="ov-foot"><button class="btn" onclick="savePrefs()">Enregistrer</button></div>';
}
function prefStyle(s, el){
  const i = _prefDraft.styles.indexOf(s);
  if (i >= 0) _prefDraft.styles.splice(i, 1); else _prefDraft.styles.push(s);
  el.classList.toggle('on', i < 0);
}
function prefSeg(key, val, el){
  _prefDraft[key] = val;
  const sib = el.parentNode.children;
  for (let i = 0; i < sib.length; i++) sib[i].classList.toggle('on', sib[i] === el);
}
function savePrefs(){
  PREFS.styles = _prefDraft.styles.slice();
  PREFS.budget = _prefDraft.budget;
  PREFS.rythme = _prefDraft.rythme;
  PREFS.transport = _prefDraft.transport;
  toast('Préférences enregistrées');
  closeOverlay();
}

/* ── 21 · Documents ─────────────────────────────────────────────────── */
function documentsView(){
  return statusBar() + navbar('Documents')
    + '<div class="ov-scroll px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">Voyage · ' + esc(ITINERARY.dest) + '</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Passeport & documents</h1>'
    +   '<div style="margin-top:14px">'
    +   DOCUMENTS.map(function(doc){
        return '<div class="row" style="cursor:default"><span class="r-ico">' + ico(doc.i, 20, 1.5) + '</span>'
          + '<div class="r-main"><div class="r-t">' + esc(doc.n) + '</div><div class="r-s">' + esc(doc.s) + '</div></div>'
          + '<span class="status ' + doc.st[0] + '">' + esc(doc.st[1]) + '</span></div>';
      }).join('')
    +   '</div>'
    + '</div>'
    + '<button class="fab" onclick="toast(\'Bientôt disponible\')" aria-label="Ajouter un document">' + ico('plus', 22, 1.7) + '</button>';
}

/* ── 23 · Notifications ─────────────────────────────────────────────── */
function notificationsView(){
  setTimeout(fillNotifs, 750);
  return statusBar() + navbar('Notifications')
    + '<div class="ov-scroll px">'
    +   '<div data-notifs><div class="notif-load"><i></i></div></div>'
    + '</div>';
}
function fillNotifs(){
  const host = document.querySelector('[data-notifs]');
  if (!host) return;
  host.innerHTML = NOTIFS.map(function(n){
    const action = n.action === 'open-itin' ? 'openItinerary()'
      : n.action === 'open-concierge' ? "openOverlay('concierge', conciergeView())" : 'void(0)';
    return '<div class="notif" onclick="' + action + '">'
      + '<span class="n-i">' + ico(n.i, 18, 1.5) + '</span>'
      + '<div><div class="n-t">' + esc(n.t) + '</div><div class="n-d">' + esc(n.d) + '</div><div class="n-w">' + esc(n.time) + '</div></div>'
      + (n.unread ? '<span class="n-dot"></span>' : '')
      + '</div>';
  }).join('');
}

/* ── 17 · Conciergerie (Hansa, scripté) ─────────────────────────────── */
function conciergeView(){
  return statusBar()
    + '<div class="chat-nav"><button class="nav-btn ghost" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +   '<div class="chat-id"><span class="chat-av">H<span class="on-dot"></span></span>'
    +   '<span><span class="chat-n">Hansa</span><br><span class="chat-st">Conciergerie · en ligne</span></span></div></div>'
    + '<div class="chat-scroll" data-cc-chat>'
    +   '<span class="day-sep">Votre conciergerie</span>'
    +   MESSAGES.map(function(m){ return '<div class="bub ' + m.who + '">' + esc(m.t) + '</div>'; }).join('')
    + '</div>'
    + '<div class="quick">' + QUICK_REPLIES.map(function(p){
        return '<button class="chip" onclick="sendMessage(\'' + p.replace(/'/g, "\\'") + '\')">' + esc(p) + '</button>';
      }).join('') + '</div>'
    + '<div class="composer">'
    +   '<input data-cc-input placeholder="Écrire à Hansa…" onkeydown="if(event.key===\'Enter\')sendMessage(this.value)">'
    +   '<button class="send-btn" onclick="sendMessage(document.querySelector(\'[data-cc-input]\').value)" aria-label="Envoyer">' + ico('arrowup',18,1.8) + '</button>'
    + '</div>';
}
const _HANSA_REPLIES = [
  'C\'est noté — je m\'en occupe et je reviens vers vous très vite.',
  'Parfait, je vérifie les disponibilités et je vous confirme dans l\'heure.',
  'Bien reçu. Je transmets au cartographe pour ajuster l\'itinéraire.',
  'Avec plaisir — je vous prépare deux options et vous laisse choisir.',
];
let _hansaIdx = 0;
function sendMessage(text){
  text = (text || '').trim();
  if (!text) return;
  const chat = document.querySelector('[data-cc-chat]');
  if (!chat) return;
  const me = document.createElement('div'); me.className = 'bub me'; me.textContent = text; chat.appendChild(me);
  const input = document.querySelector('[data-cc-input]'); if (input) input.value = '';
  chat.scrollTop = chat.scrollHeight;
  const typing = document.createElement('div'); typing.className = 'typing'; typing.innerHTML = '<i></i><i></i><i></i>';
  chat.appendChild(typing); chat.scrollTop = chat.scrollHeight;
  setTimeout(function(){
    typing.remove();
    const b = document.createElement('div'); b.className = 'bub them';
    b.textContent = _HANSA_REPLIES[_hansaIdx++ % _HANSA_REPLIES.length];
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  }, 1400);
}
