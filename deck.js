/* ── HIC SUNT · Sillage — deck : questionnaire card-deck ────────────── */

/* définitions de questions ; chaque builder rend le corps de la carte  */
function deckQuestions(){
  const surprise = state.createTab === 'surprise';
  const q = [];

  /* Q1 — Mode */
  q.push({ id:'mode', t:'Par où <em>commençons</em>-nous ?', s:'Deux façons de composer votre voyage.',
    body: function(){
      return '<button class="mode-btn" onclick="deckMode(\'known\')"><span class="m-i">' + ico('pin',22,1.5) + '</span>'
        + '<span><span class="m-t">Je sais où je vais</span><br><span class="m-d">Une destination en tête — nous composons le reste.</span></span></button>'
        + '<button class="mode-btn" onclick="deckMode(\'surprise\')"><span class="m-i">' + ico('sparkle',22,1.5) + '</span>'
        + '<span><span class="m-t">Surprenez-moi</span><br><span class="m-d">Le cartographe choisit une destination inattendue, taillée pour vous.</span></span></button>';
    }, noFoot:true });

  /* Q2 — Destination */
  if(!surprise) q.push({ id:'destination', t:'Quelle <em>destination</em> vous appelle ?', s:'Un pays, une région, une île — même vague, c\'est bien.',
    body: function(){
      return '<div class="field"><label>Destination</label>'
        + '<input class="input italic" placeholder="Sardaigne, Japon, Maroc…" value="' + esc(state.destination) + '" oninput="state.destination=this.value"></div>';
    }});

  /* Q3 — Dates + durée sur une même carte */
  q.push({ id:'dates', t:'Quand <em>partez</em>-vous ?', s:'Les dates cadrent la saison, les durées et les prix.',
    body: function(){
      return '<div class="field"><label>Départ</label><input class="input" type="date" value="' + esc(state.dateFrom) + '" onchange="state.dateFrom=this.value"></div>'
        + '<div class="field"><label>Retour</label><input class="input" type="date" value="' + esc(state.dateTo) + '" onchange="state.dateTo=this.value"></div>'
        + '<div class="field"><label>Ville de départ</label><input class="input" placeholder="Paris, Lyon, Bordeaux…" value="' + esc(state.origin) + '" oninput="state.origin=this.value"></div>';
    }});

  /* Q4 — Voyageurs */
  q.push({ id:'travelers', t:'Qui <em>voyage</em> ?', s:'Le nombre ajuste hébergements, activités et budget.',
    body: function(){
      return '<div class="stepper">'
        + '<button onclick="stepTravelers(-1)" aria-label="Moins">' + ico('minus',20,1.7) + '</button>'
        + '<div class="st-v"><div class="st-n" data-trav-n>' + state.travelers + '</div><div class="st-l" data-trav-l>' + travelerLabel().replace(/^\d+\s/,'') + '</div></div>'
        + '<button onclick="stepTravelers(1)" aria-label="Plus">' + ico('plus',20,1.7) + '</button>'
        + '</div>';
    }});

  /* Q5 — Occasion */
  q.push({ id:'occasion', t:'Une <em>occasion</em> particulière ?', s:'Facultatif — nous soignons chaque détail qui compte.',
    body: function(){
      return '<div class="occ-grid">' + OCCASIONS.map(function(o){
        const on = state.occasion === o.id;
        return '<button class="occ' + (on?' on':'') + '" onclick="deckOccasion(\'' + o.id + '\')">'
          + '<span class="o-e">' + o.emoji + '</span><div class="o-t">' + o.label + '</div><div class="o-d">' + o.desc + '</div></button>';
      }).join('') + '</div>';
    }, footLabel:'Passer' });

  /* Q6 — Budget */
  q.push({ id:'budget', t:'Quel <em>niveau</em> de confort ?', s:'Calibre les adresses, les expériences et le standing.',
    body: function(){
      const opts = [['Éco','L\'essentiel, bien choisi'],['Confort','Belles adresses, sans excès'],['Luxe','Adresses d\'exception'],['Ultra','Sans aucune limite']];
      return opts.map(function(o){
        const on = state.budget === o[0];
        return '<button class="radio-it' + (on?' on':'') + '" onclick="deckRadio(\'budget\',\'' + o[0] + '\')">'
          + '<span><span class="ra-t">' + o[0] + '</span><br><span class="ra-d">' + o[1] + '</span></span><span class="ra-dot"></span></button>';
      }).join('');
    }, noFoot:false, footLabel:'Passer' });

  /* Q7 — Rythme */
  q.push({ id:'rythme', t:'À quel <em>rythme</em> ?', s:'Le tempo des journées, des transferts, des pauses.',
    body: function(){
      const opts = [
        ['Lent','Peu d\'étapes, du temps partout, s\'imprégner'],
        ['Équilibré','Alternance activités et temps libre'],
        ['Intense','Voir le maximum, journées denses'],
      ];
      return opts.map(function(o){
        const on = state.rythme === o[0];
        return '<button class="radio-it' + (on?' on':'') + '" onclick="deckRadio(\'rythme\',\'' + o[0] + '\')">'
          + '<span><span class="ra-t">' + o[0] + '</span><br><span class="ra-d">' + o[1] + '</span></span><span class="ra-dot"></span></button>';
      }).join('');
    }, noFoot:false, footLabel:'Passer' });

  /* Q8 — Styles */
  q.push({ id:'styles', t:'Votre <em>style</em> de voyage ?', s:'Choisissez-en autant que vous voulez.',
    body: function(){
      return '<div class="chips">' + TRAVEL_STYLES.map(function(s){
        return '<button class="chip' + (state.styles.indexOf(s)>=0?' on':'') + '" onclick="deckToggle(\'styles\',\'' + s.replace(/'/g,"\\'") + '\',this)">' + s + '</button>';
      }).join('') + '</div>';
    }});

  /* Q9 — Intérêts */
  q.push({ id:'interests', t:'Vos <em>envies</em> sur place ?', s:'Ce qui doit absolument figurer dans l\'itinéraire.',
    body: function(){
      return '<div class="chips">' + INTERESTS.map(function(s){
        return '<button class="chip' + (state.interests.indexOf(s)>=0?' on':'') + '" onclick="deckToggle(\'interests\',\'' + s.replace(/'/g,"\\'") + '\',this)">' + s + '</button>';
      }).join('') + '</div>';
    }});

  /* Q10 — Transport */
  q.push({ id:'transport', t:'Comment aimez-vous vous <em>déplacer</em> ?', s:'Nous organisons la logistique en conséquence.',
    body: function(){
      const opts = [
        ['Voiture de location','Liberté totale, haltes spontanées'],
        ['Transports en commun','Train, bus, local et authentique'],
        ['Avec un guide','Tout organisé, privé ou en groupe'],
        ['Mixte','Combiner selon les étapes'],
      ];
      return opts.map(function(o){
        const on = state.transport === o[0];
        return '<button class="radio-it' + (on?' on':'') + '" onclick="deckRadio(\'transport\',\'' + o[0].replace(/'/g,"\\'") + '\')">'
          + '<span><span class="ra-t">' + o[0] + '</span><br><span class="ra-d">' + o[1] + '</span></span><span class="ra-dot"></span></button>';
      }).join('');
    }, noFoot:false, footLabel:'Passer' });

  /* Q11 — Style hébergement */
  q.push({ id:'accomStyle', t:'Quel type d\'<em>hébergement</em> vous ressemble ?', s:'Le cadre de vos nuits est aussi important que vos journées.',
    body: function(){
      const opts = [
        ['Charme & caractère','Maisons d\'hôtes, riads, agriturismi — âme locale garantie'],
        ['Design & contemporain','Architecture, esthétique, service irréprochable'],
        ['Nature & immersion','Lodges, tentes de luxe, écolodges, vue directe sur le sauvage'],
        ['Peu importe','L\'emplacement prime sur le style'],
      ];
      return opts.map(function(o){
        const on = state.accomStyle === o[0];
        return '<button class="radio-it' + (on?' on':'') + '" onclick="deckRadio(\'accomStyle\',\'' + o[0].replace(/'/g,"\\'") + '\')">'
          + '<span><span class="ra-t">' + o[0] + '</span><br><span class="ra-d">' + o[1] + '</span></span><span class="ra-dot"></span></button>';
      }).join('');
    }, noFoot:false, footLabel:'Passer' });

  /* Q12 — Forme physique */
  q.push({ id:'fitnessLevel', t:'Votre <em>forme physique</em> pour ce voyage ?', s:'Pour calibrer les randonnées, visites et rythme de marche.',
    body: function(){
      const opts = [
        ['Sédentaire','Peu ou pas de marche prolongée, accessibilité PMR bienvenue'],
        ['Modéré','Promenades tranquilles, quelques escaliers — pas de trek'],
        ['Sportif','Randonnées, vélo, activités physiques — j\'adore ça'],
        ['Extrême','Expéditions, sommets, défis physiques — plus c\'est dur, mieux c\'est'],
      ];
      return opts.map(function(o){
        const on = state.fitnessLevel === o[0];
        return '<button class="radio-it' + (on?' on':'') + '" onclick="deckRadio(\'fitnessLevel\',\'' + o[0] + '\')">'
          + '<span><span class="ra-t">' + o[0] + '</span><br><span class="ra-d">' + o[1] + '</span></span><span class="ra-dot"></span></button>';
      }).join('');
    }, noFoot:false, footLabel:'Passer' });

  /* Q13 — Infos spéciales (enfants, régime, déjà fait) — contextuelle */
  q.push({ id:'special', t:'Des <em>précisions</em> pour un voyage parfait ?', s:'Facultatif mais précieux — chaque détail compte.',
    body: function(){
      const showChildren = state.occasion === 'famille' || state.travelers >= 3;
      return (showChildren
        ? '<div class="field"><label>Âge des enfants</label>'
          + '<input class="input" placeholder="ex : 5 et 9 ans" value="' + esc(state.childrenAges) + '" oninput="state.childrenAges=this.value"></div>'
        : '')
        + '<div class="field"><label>Régime alimentaire ou allergies</label>'
        + '<input class="input" placeholder="ex : végétarien, sans gluten, allergie fruits de mer…" value="' + esc(state.dietary) + '" oninput="state.dietary=this.value"></div>'
        + '<div class="field"><label>Ce que vous avez déjà fait et ne souhaitez pas revoir</label>'
        + '<input class="input" placeholder="ex : j\'ai déjà fait Marrakech, pas de circuits en groupe…" value="' + esc(state.alreadyDone) + '" oninput="state.alreadyDone=this.value"></div>';
    }});

  /* Q14 — Rêve (libre, toujours en dernier) */
  q.push({ id:'dream', surprise:surprise,
    t: surprise ? 'À <em>éviter</em> absolument ?' : 'Ce voyage, c\'est quoi pour vous ?',
    s: surprise ? 'Destinations déjà vues, contraintes, saisons à fuir.' : 'Une phrase, une image, une envie — le cartographe lit tout et le met au cœur de l\'itinéraire.',
    body: function(){
      return '<div class="field"><label>' + (surprise ? 'Vos contraintes' : 'Décrivez librement') + '</label>'
        + '<textarea class="input" rows="5" placeholder="' + (surprise
          ? 'ex : pas d\'Asie, éviter la haute saison, on a horreur des visites guidées…'
          : 'ex : on veut se lever tôt pour avoir les plages pour nous, manger local même dans les petits villages, éviter absolument les buffets d\'hôtel, et trouver au moins un coucher de soleil mémorable…'
        ) + '" oninput="state.dream=this.value">' + esc(state.dream) + '</textarea></div>';
    },
    footHTML: function(){
      return '<button class="btn gold" onclick="runGeneration()">' + ico('sparkle',18,1.7)
        + (surprise ? 'Révéler ma <em>destination</em>' : 'Composer mon <em>itinéraire</em>') + '</button>';
    }});

  return q;
}

let _deckQ = [];
function initDeck(){
  const host = document.getElementById('deck');
  if (!host) return;
  _deckQ = deckQuestions();
  if (state.deckIndex >= _deckQ.length) state.deckIndex = 0;
  host.innerHTML = _deckQ.map(function(qd, i){
    const foot = qd.footHTML ? qd.footHTML()
      : (qd.noFoot ? '' : '<button class="btn sm" onclick="deckNext()">' + (qd.footLabel || 'Continuer') + '</button>');
    return '<div class="dcard" data-card="' + i + '">'
      + '<div class="d-num">Question ' + String(i+1).padStart(2,'0') + '</div>'
      + '<div class="d-q">' + qd.t + '</div>'
      + '<div class="d-s">' + qd.s + '</div>'
      + '<div class="d-body">' + qd.body() + '</div>'
      + (foot ? '<div class="d-foot">' + foot + '</div>' : '')
      + '</div>';
  }).join('');
  positionDeck();
}

/* transitions de pile — valeurs du handoff */
function positionDeck(){
  const cards = document.querySelectorAll('#deck .dcard');
  for (let i = 0; i < cards.length; i++){
    const rel = i - state.deckIndex, el = cards[i];
    let tf = '', op = 1, z = 10;
    if (rel < 0){ tf = 'translateY(-128%) rotate(-5deg)'; op = 0; z = 60; }
    else if (rel === 0){ tf = 'translateY(0) scale(1)'; op = 1; z = 40; }
    else if (rel === 1){ tf = 'translateY(22px) scale(0.95)'; op = 1; z = 30; }
    else if (rel === 2){ tf = 'translateY(40px) scale(0.905)'; op = 0.6; z = 20; }
    else { tf = 'translateY(52px) scale(0.88)'; op = 0; z = 10; }
    el.style.transform = tf; el.style.opacity = op; el.style.zIndex = z;
    el.style.pointerEvents = rel === 0 ? 'auto' : 'none';
  }
  const fill = document.querySelector('[data-deck-fill]');
  const count = document.querySelector('[data-deck-count]');
  const back = document.querySelector('[data-deck-back]');
  const n = _deckQ.length;
  if (fill) fill.style.width = Math.round(((state.deckIndex + 1) / n) * 100) + '%';
  if (count) count.textContent = String(state.deckIndex + 1).padStart(2,'0') + ' / ' + String(n).padStart(2,'0');
  if (back){ if (state.deckIndex === 0) back.setAttribute('disabled',''); else back.removeAttribute('disabled'); }
}
function deckNext(){
  if (state.deckIndex < _deckQ.length - 1){ state.deckIndex++; positionDeck(); }
}
function deckBack(){
  if (state.deckIndex > 0){ state.deckIndex--; positionDeck(); }
}
function deckMode(mode){
  state.createTab = mode;
  state.deckIndex = 1;
  initDeck();
}
function deckRadio(field, val){
  state[field] = val;
  const card = document.querySelector('#deck .dcard[data-card="' + state.deckIndex + '"]');
  if (card){
    const its = card.querySelectorAll('.radio-it');
    for (let i = 0; i < its.length; i++){
      const t = its[i].querySelector('.ra-t');
      its[i].classList.toggle('on', t && t.textContent === val);
    }
  }
  setTimeout(deckNext, 520);
}
function deckToggle(field, val, el){
  const arr = state[field];
  const i = arr.indexOf(val);
  if (i >= 0) arr.splice(i, 1); else arr.push(val);
  if (el) el.classList.toggle('on', i < 0);
}
function deckOccasion(id){
  state.occasion = state.occasion === id ? null : id;
  const card = document.querySelector('#deck .dcard[data-card="' + state.deckIndex + '"]');
  if (card){
    const its = card.querySelectorAll('.occ');
    for (let i = 0; i < its.length; i++) its[i].classList.toggle('on', state.occasion === OCCASIONS[i].id);
  }
  if (state.occasion) setTimeout(deckNext, 520);
}
function stepTravelers(d){
  state.travelers = Math.max(1, Math.min(12, state.travelers + d));
  const n = document.querySelector('[data-trav-n]'), l = document.querySelector('[data-trav-l]');
  if (n) n.textContent = state.travelers;
  if (l) l.textContent = state.travelers > 1 ? 'voyageurs' : 'voyageur';
}
