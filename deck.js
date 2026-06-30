/* ── HIC SUNT · Sillage — deck : questionnaire card-deck ────────────── */

function deckQuestions(){
  const surprise = state.createTab === 'surprise';
  const q = [];

  /* Q1 — Mode */
  q.push({ id:'mode', t:'Par où <em>commençons</em>-nous ?', s:'Deux façons de composer votre voyage.',
    body: function(){
      return '<button class="mode-btn" onclick="deckMode(\'known\')"><span class="m-i">' + ico('pin',22,1.5) + '</span>'
        + '<span><span class="m-t">Je sais où je vais</span><br><span class="m-d">Une destination en tête — nous composons le reste.</span></span></button>'
        + '<button class="mode-btn" onclick="deckMode(\'surprise\')"><span class="m-i">' + ico('sparkle',22,1.5) + '</span>'
        + '<span><span class="m-t">Surprenez-moi</span><br><span class="m-d">Le cartographe choisit la destination parfaite pour votre profil.</span></span></button>';
    }, noFoot:true });

  /* Q2 — Destination (mode connu seulement) */
  if(!surprise) q.push({ id:'destination', t:'Quelle <em>destination</em> vous appelle ?', s:'Un pays, une région, une ville — même vague, c\'est bien.',
    body: function(){
      return '<div class="field"><label>Destination</label>'
        + '<input class="input italic" placeholder="Sardaigne, Japon, Maroc, côte amalfitaine…" value="' + esc(state.destination) + '" oninput="state.destination=this.value"></div>';
    }});

  /* Q3 — Dates + départ */
  q.push({ id:'dates', t:'Quand <em>partez</em>-vous ?', s:'Les dates précisent la saison, les disponibilités et la durée.',
    body: function(){
      return '<div class="field"><label>Date de départ</label><input class="input" type="date" value="' + esc(state.dateFrom) + '" onchange="state.dateFrom=this.value"></div>'
        + '<div class="field"><label>Date de retour</label><input class="input" type="date" value="' + esc(state.dateTo) + '" onchange="state.dateTo=this.value"></div>'
        + '<div class="field"><label>Ville de départ</label><input class="input" placeholder="Paris, Lyon, Bordeaux…" value="' + esc(state.origin) + '" oninput="state.origin=this.value"></div>';
    }});

  /* Q4 — Voyageurs */
  q.push({ id:'travelers', t:'Vous voyagez <em>à combien</em> ?', s:'Pour calibrer les hébergements, activités et budget total.',
    body: function(){
      return '<div class="stepper">'
        + '<button onclick="stepTravelers(-1)" aria-label="Moins">' + ico('minus',20,1.7) + '</button>'
        + '<div class="st-v"><div class="st-n" data-trav-n>' + state.travelers + '</div><div class="st-l" data-trav-l>' + (state.travelers > 1 ? 'voyageurs' : 'voyageur') + '</div></div>'
        + '<button onclick="stepTravelers(1)" aria-label="Plus">' + ico('plus',20,1.7) + '</button>'
        + '</div>';
    }});

  /* Q5 — Occasion */
  q.push({ id:'occasion', t:'C\'est un voyage <em>particulier</em> ?', s:'Facultatif — précisez pour que chaque détail soit pensé en conséquence.',
    body: function(){
      return '<div class="occ-grid">' + OCCASIONS.map(function(o){
        const on = state.occasion === o.id;
        return '<button class="occ' + (on?' on':'') + '" onclick="deckOccasion(\'' + o.id + '\')">'
          + '<span class="o-e">' + ico(o.ic||'compass',22,1.4) + '</span><div class="o-t">' + o.label + '</div><div class="o-d">' + o.desc + '</div></button>';
      }).join('') + '</div>';
    }, footLabel:'Pas d\'occasion particulière' });

  /* Q5b — Sous-question enfants UNIQUEMENT si famille */
  q.push({ id:'children', t:'Quel âge ont <em>vos enfants</em> ?', s:'Pour adapter chaque activité, restaurant et rythme de journée.',
    _show: function(){ return state.occasion === 'famille'; },
    body: function(){
      return '<div class="field"><label>Âge des enfants</label>'
        + '<input class="input" placeholder="ex : 3, 7 et 11 ans" value="' + esc(state.childrenAges) + '" oninput="state.childrenAges=this.value"></div>'
        + '<div style="font-size:13px;color:var(--sub);margin-top:12px;line-height:1.5">Bébé (0-2 ans), maternelle (3-5 ans), primaire (6-11 ans), ados (12-17 ans) — chaque tranche a ses contraintes propres.</div>';
    }});

  /* Q6 — Budget */
  q.push({ id:'budget', t:'Quel niveau de <em>confort</em> ?', s:'Calibre les adresses, les expériences et le standing des hébergements.',
    body: function(){
      const opts = [
        ['Éco','L\'essentiel bien choisi — auberges de charme, street food de qualité'],
        ['Confort','Belles adresses, restaurants soignés, sans excès'],
        ['Luxe','Adresses d\'exception, restaurants gastronomiques, services premium'],
        ['Ultra','Sans aucune limite — le meilleur de chaque étape'],
      ];
      return opts.map(function(o){
        const on = state.budget === o[0];
        return '<button class="radio-it' + (on?' on':'') + '" onclick="deckRadio(\'budget\',\'' + o[0] + '\')">'
          + '<span><span class="ra-t">' + o[0] + '</span><br><span class="ra-d">' + o[1] + '</span></span><span class="ra-dot"></span></button>';
      }).join('');
    }, footLabel:'Passer' });

  /* Q7 — Transport */
  q.push({ id:'transport', t:'Comment aimez-vous vous <em>déplacer</em> ?', s:'Nous construisons la logistique en conséquence.',
    body: function(){
      const opts = [
        ['Voiture de location','Liberté totale — haltes spontanées, routes de campagne'],
        ['Train & transports locaux','Authentique, local, sans se soucier du stationnement'],
        ['Tout organisé','Guide privé, transferts inclus — on ne pense à rien'],
        ['Selon les étapes','Un mix selon ce que chaque partie du voyage demande'],
      ];
      return opts.map(function(o){
        const on = state.transport === o[0];
        return '<button class="radio-it' + (on?' on':'') + '" onclick="deckRadio(\'transport\',\'' + o[0].replace(/'/g,"\\'") + '\')">'
          + '<span><span class="ra-t">' + o[0] + '</span><br><span class="ra-d">' + o[1] + '</span></span><span class="ra-dot"></span></button>';
      }).join('');
    }, footLabel:'Passer' });

  /* Q8 — Hébergement */
  q.push({ id:'accomStyle', t:'Où aimez-vous <em>dormir</em> ?', s:'Le cadre de vos nuits compte autant que celui de vos journées.',
    body: function(){
      const opts = [
        ['Charme & histoire','Maisons d\'hôtes, riads, agriturismi — des adresses qui ont une âme'],
        ['Design & contemporain','Architecture soignée, matières nobles, service irréprochable'],
        ['Nature & immersion','Lodges, écolodges, tentes de luxe — la nature à portée de lit'],
        ['L\'emplacement avant tout','Peu importe le style — je veux être au meilleur endroit'],
      ];
      return opts.map(function(o){
        const on = state.accomStyle === o[0];
        return '<button class="radio-it' + (on?' on':'') + '" onclick="deckRadio(\'accomStyle\',\'' + o[0].replace(/'/g,"\\'") + '\')">'
          + '<span><span class="ra-t">' + o[0] + '</span><br><span class="ra-d">' + o[1] + '</span></span><span class="ra-dot"></span></button>';
      }).join('');
    }, footLabel:'Passer' });

  /* Q9 — Rythme (masqué si l'occasion impose un rythme) */
  q.push({ id:'rythme', t:'Votre <em>rythme</em> idéal ?', s:'Chaque journée sera construite autour de ce tempo.',
    _show: function(){
      /* Lune de miel → toujours lent, EVG → toujours dense : inutile de demander */
      return state.occasion !== 'lune-de-miel' && state.occasion !== 'evg';
    },
    body: function(){
      const opts = [
        ['Lent','Peu d\'étapes — s\'imprégner, rester, revenir. Le luxe du temps.'],
        ['Équilibré','Matin actif, après-midi libre. Voir sans se précipiter.'],
        ['Dense','Voir le maximum. Chaque heure compte, on dort peu.'],
      ];
      return opts.map(function(o){
        const on = state.rythme === o[0];
        return '<button class="radio-it' + (on?' on':'') + '" onclick="deckRadio(\'rythme\',\'' + o[0] + '\')">'
          + '<span><span class="ra-t">' + o[0] + '</span><br><span class="ra-d">' + o[1] + '</span></span><span class="ra-dot"></span></button>';
      }).join('');
    }, footLabel:'Passer' });

  /* Q10 — Forme physique */
  q.push({ id:'fitnessLevel', t:'Votre <em>condition physique</em> pour ce voyage ?', s:'Pour calibrer les randonnées, la marche et les activités proposées.',
    body: function(){
      const opts = [
        ['Tranquille','Peu de marche prolongée — confort et accessibilité avant tout'],
        ['Modéré','Quelques heures de marche par jour, pas de trek exigeant'],
        ['Sportif','Randonnées, vélo, activités physiques — j\'adore ça'],
        ['Extrême','Sommets, trails techniques, défis — plus c\'est dur, mieux c\'est'],
      ];
      return opts.map(function(o){
        const on = state.fitnessLevel === o[0];
        return '<button class="radio-it' + (on?' on':'') + '" onclick="deckRadio(\'fitnessLevel\',\'' + o[0] + '\')">'
          + '<span><span class="ra-t">' + o[0] + '</span><br><span class="ra-d">' + o[1] + '</span></span><span class="ra-dot"></span></button>';
      }).join('');
    }, footLabel:'Passer' });

  /* Q11 — Ce que vous voulez absolument vivre (adapté à l'occasion) */
  q.push({ id:'interests', t:'Ce que vous voulez <em>absolument</em> vivre ?', s:'Cochez tout ce qui doit figurer dans votre itinéraire.',
    body: function(){
      const occ = state.occasion;
      let list = INTERESTS;
      if(occ === 'lune-de-miel') list = [
        'Un coucher de soleil mémorable en tête-à-tête',
        'Un dîner gastronomique avec vue exceptionnelle',
        'Un massage en duo dans un spa d\'exception',
        'Une journée sur un bateau privé',
        'Une plage déserte rien que pour nous',
        'Un hébergement avec piscine ou baignoire privée',
        'Une expérience culinaire locale intime',
        'Des criques cachées accessibles à la nage',
        'Une promenade à cheval au coucher du soleil',
        'Un marché local au lever du soleil',
        'Des couchers de soleil depuis un belvédère secret',
        'Un dîner les pieds dans le sable',
      ];
      else if(occ === 'evjf') list = [
        'Un spa privatisé pour le groupe',
        'Un atelier local (céramique, cocktails, parfum, cuisine)',
        'Un rooftop ou bar avec vue au coucher du soleil',
        'Un dîner festif dans un endroit mémorable',
        'Des lieux photogéniques et authentiques',
        'Une plage ou piscine avec service',
        'Un cours de cuisine ou dégustation en groupe',
        'Une activité outdoor légère (vélo, balade, kayak)',
        'Un marché coloré à explorer ensemble',
        'Des spots instagrammables mais pas kitch',
        'Un hammam ou bain traditionnel',
        'Une soirée dans un bar à musique live locale',
      ];
      else if(occ === 'evg') list = [
        'Une activité à sensations fortes (quad, karting, surf, parapente)',
        'Une soirée dans un bar local authentique',
        'Un repas convivial (BBQ, tablée, street food)',
        'Un défi sportif en groupe',
        'Une excursion en 4x4 ou hors des sentiers',
        'Une activité nautique (jet ski, kayak, plongée)',
        'Un concert live ou scène locale',
        'Un accrobranche ou aventure nature',
        'Une visite de distillerie ou brasserie locale',
        'Une randonnée avec vue imprenable',
        'Un karting ou paintball',
        'Un match ou événement sportif local',
      ];
      else if(occ === 'famille') list = [
        'Une plage calme avec eau peu profonde',
        'Un parc naturel avec animaux à observer',
        'Un safari pour voir des animaux sauvages',
        'Un atelier créatif pour enfants',
        'Une randonnée accessible avec récompense (vue, cascade)',
        'Un marché local animé',
        'Un musée interactif ou écomusée',
        'Une activité nautique douce (pédalo, kayak de mer)',
        'Une ferme ou exploitation à visiter',
        'Un village médiéval ou château à explorer',
        'Une baignade en rivière ou cascade',
        'Un spectacle ou animation locale',
        'Un cours de cuisine familial',
      ];
      else if(occ === 'solo') list = [
        'Un café local pour écrire ou lire le matin',
        'Une randonnée en solitaire avec vue',
        'Un cours ou atelier pour rencontrer des gens',
        'Un marché où acheter et goûter',
        'Un bar ou restaurant avec comptoir (pour parler aux locaux)',
        'Un musée ou galerie hors des sentiers',
        'Une excursion en petit groupe organisée',
        'Un safari ou observation de la faune sauvage',
        'Un coucher de soleil dans un endroit secret',
        'Une journée vélo sur des routes secondaires',
        'Un temple ou lieu de spiritualité au lever du soleil',
        'Un bain thermal ou source naturelle',
        'Une soirée musique live locale',
      ];
      else if(occ === 'amis') list = [
        'Un repas convivial dans un endroit mémorable',
        'Une randonnée avec pique-nique au sommet',
        'Un tour en bateau ou excursion en groupe',
        'Un safari pour observer la faune sauvage',
        'Un atelier culinaire ou dégustation ensemble',
        'Un coucher de soleil depuis un belvédère',
        'Une activité sportive ou nautique en groupe',
        'Une soirée bar ou concert live local',
        'Un marché local à explorer ensemble',
        'Une plage ou piscine naturelle cachée',
        'Un village ou quartier à explorer à pied',
        'Un défi ou jeu collectif (escape game local, rallye)',
        'Un feu de camp ou barbecue dans la nature',
      ];
      return '<div class="chips">' + list.map(function(s){
        return '<button class="chip' + (state.interests.indexOf(s)>=0?' on':'') + '" onclick="deckToggle(\'interests\',\'' + s.replace(/'/g,"\\'") + '\',this)">' + s + '</button>';
      }).join('') + '</div>';
    }});

  /* Q12 — Comment vous voyagez (adapté à l'occasion) */
  q.push({ id:'styles', t:'Comment voyagez-<em>vous</em> ?', s:'Votre manière de vivre le voyage — cochez tout ce qui vous ressemble.',
    _show: function(){ return !state.occasion || ['anniversaire','pro','famille'].indexOf(state.occasion) >= 0 || !state.occasion; },
    body: function(){
      return '<div class="chips">' + TRAVEL_STYLES.map(function(s){
        return '<button class="chip' + (state.styles.indexOf(s)>=0?' on':'') + '" onclick="deckToggle(\'styles\',\'' + s.replace(/'/g,"\\'") + '\',this)">' + s + '</button>';
      }).join('') + '</div>';
    }});

  /* Q13 — Contraintes & précisions */
  q.push({ id:'special', t:'Des <em>contraintes</em> à connaître ?', s:'Facultatif — mais chaque précision améliore l\'itinéraire.',
    body: function(){
      return '<div class="field"><label>Régime alimentaire ou allergies</label>'
        + '<input class="input" placeholder="végétarien, sans gluten, allergie aux crustacés…" value="' + esc(state.dietary) + '" oninput="state.dietary=this.value"></div>'
        + '<div class="field"><label>Ce que vous avez déjà fait et ne voulez pas revoir</label>'
        + '<input class="input" placeholder="j\'ai déjà fait Marrakech, pas de visites guidées en groupe…" value="' + esc(state.alreadyDone) + '" oninput="state.alreadyDone=this.value"></div>';
    }});

  /* Q14 — La phrase qui change tout (adaptée à l'occasion) */
  const occFinal = state.occasion;
  const dreamTitle = occFinal === 'lune-de-miel' ? 'Décrivez votre idée du voyage <em>parfait</em> à deux.'
    : occFinal === 'evjf' ? 'Ce que vous voulez que cette EVJF <em>reste dans les mémoires</em>.'
    : occFinal === 'evg'  ? 'Ce que vous voulez que cet EVG <em>reste dans les mémoires</em>.'
    : occFinal === 'famille' ? 'Ce que vous voulez que vos enfants <em>n\'oublient jamais</em>.'
    : occFinal === 'anniversaire' ? 'Quel doit être le <em>moment clé</em> de ce voyage ?'
    : surprise ? 'Y a-t-il quelque chose à <em>éviter absolument</em> ?'
    : 'Quelle est la chose que vous voulez qu\'on <em>ne puisse pas faire</em> sans cet itinéraire ?';

  const dreamPH = occFinal === 'lune-de-miel'
    ? 'ex : on rêve de se réveiller face à la mer, dîner les pieds dans le sable, trouver un endroit où on est vraiment seuls au monde…'
    : occFinal === 'evjf'
    ? 'ex : une nuit qu\'on n\'oubliera pas, un endroit tellement beau qu\'on ne pouvait pas y aller sans ça, une chose qu\'aucune de nous n\'a jamais faite…'
    : occFinal === 'evg'
    ? 'ex : une activité physiquement dingue, une soirée mémorable, un endroit dont on n\'aurait jamais entendu parler sans vous…'
    : occFinal === 'famille'
    ? 'ex : qu\'ils voient des animaux sauvages pour la première fois, qu\'on mange comme des locaux, qu\'ils rentrent en disant c\'était le meilleur voyage de leur vie…'
    : occFinal === 'anniversaire'
    ? 'ex : une surprise au dîner, un lieu accessible uniquement à pied, un moment où on réalise qu\'on ne pouvait pas faire ça sans vous…'
    : surprise
    ? 'ex : pas d\'Asie du Sud-Est, éviter juillet-août, on déteste les hôtels de chaîne…'
    : 'ex : on veut se lever avant tout le monde pour avoir les sites pour nous, manger dans des endroits que les touristes ne trouvent pas, trouver au moins une heure seuls face à quelque chose de beau…';

  q.push({ id:'dream', surprise:surprise,
    t: dreamTitle,
    s: 'Une phrase suffit. Le cartographe en fait l\'ADN de votre voyage.',
    body: function(){
      return '<div class="field">'
        + '<textarea class="input" rows="5" placeholder="' + dreamPH + '" oninput="state.dream=this.value">' + esc(state.dream) + '</textarea></div>';
    },
    footHTML: function(){
      return '<button class="btn gold" onclick="runGeneration()">' + ico('sparkle',18,1.7)
        + (surprise ? 'Révéler ma <em>destination</em>' : 'Composer mon <em>itinéraire</em>') + '</button>';
    }});

  /* Filtrer les questions contextuelles */
  return q.filter(function(card){ return !card._show || card._show(); });
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

/* Fix bug clic : on enregistre l'état before le timeout
   et on vérifie que le deckIndex n'a pas changé entre temps */
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
  const idxAtClick = state.deckIndex;
  setTimeout(function(){
    /* N'avancer que si l'utilisateur est toujours sur la même carte */
    if (state.deckIndex === idxAtClick) deckNext();
  }, 620);
}

function deckToggle(field, val, el){
  const arr = state[field];
  const i = arr.indexOf(val);
  if (i >= 0) arr.splice(i, 1); else arr.push(val);
  if (el) el.classList.toggle('on', i < 0);
}

function deckOccasion(id){
  state.occasion = state.occasion === id ? null : id;
  /* Forcer le rythme selon l'occasion */
  if(state.occasion === 'lune-de-miel') state.rythme = 'Lent';
  else if(state.occasion === 'evg') state.rythme = 'Dense';
  const card = document.querySelector('#deck .dcard[data-card="' + state.deckIndex + '"]');
  if (card){
    const its = card.querySelectorAll('.occ');
    for (let i = 0; i < its.length; i++) its[i].classList.toggle('on', state.occasion === OCCASIONS[i].id);
  }
  /* Reconstruire le deck car les questions contextuelles peuvent changer */
  const idxAtClick = state.deckIndex;
  initDeck();
  state.deckIndex = idxAtClick;
  positionDeck();
  if (state.occasion) setTimeout(function(){
    if (state.deckIndex === idxAtClick) deckNext();
  }, 620);
}

function stepTravelers(d){
  state.travelers = Math.max(1, Math.min(20, state.travelers + d));
  const n = document.querySelector('[data-trav-n]'), l = document.querySelector('[data-trav-l]');
  if (n) n.textContent = state.travelers;
  if (l) l.textContent = state.travelers > 1 ? 'voyageurs' : 'voyageur';
  /* Réinitialiser le deck si on passe à 3+ (question enfants peut apparaître) */
  const prev = _deckQ.length;
  _deckQ = deckQuestions();
  if (_deckQ.length !== prev) initDeck();
}
