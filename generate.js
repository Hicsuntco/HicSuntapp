/* ── HIC SUNT · Sillage — moteur de génération IA ──────────────────────
   Connecté à l'Edge Function Supabase (super-endpoint).
   3 passes : ossature → jours détaillés → adresses & highlights        */

const SUPABASE_ENDPOINT = 'https://lucbxwxcismnvcdnctau.supabase.co/functions/v1/super-endpoint';

const GEN_KINDS = ['plane','fork','droplet','wave','peaks','arch','leaf','sun','moon','bed','star','camera','ticket','pin','compass'];
const GEN_SKY   = ['sun','cloud','rain'];
const TAG_MAP   = {
  plane:['plane','Transfert'], fork:['fork','Table'], droplet:['droplet','Détente'],
  wave:['wave','Océan'], peaks:['peaks','Marche'], arch:['arch','Patrimoine'],
  leaf:['leaf','Nature'], sun:['sun','Plein air'], moon:['moon','Soirée'],
  bed:['bed','Repos'], star:['star','Temps fort'], camera:['camera','Photo'],
  ticket:['ticket','Expérience'], pin:['pin','Étape'], compass:['compass','Exploration'],
};

function _clampInt(v, lo, hi, dflt){ const n=Math.round(Number(v)); return isFinite(n)?Math.max(lo,Math.min(hi,n)):dflt; }

/* ── Contrainte géographique dynamique ─────────────────────────────────
   Calcule la zone couvrable selon : taille du pays/île + jours + rythme
   Retourne une directive texte précise pour le prompt               ── */
function _geoConstraintDirective(dest, dc, rythme){
  const d = (dest||'').toLowerCase();
  const r = (rythme||'Équilibré').toLowerCase();

  /* Coefficient de rythme : km/jour selon rythme */
  /* Sur une île, les distances sont courtes et le rythme plus lent */
  const isIsland = /sardaigne|sicile|bali|sri lanka|islande|crète|corse|réunion|martinique|guadeloupe|malte|maldives|chypre/.test(d);
  const rythmeKm = isIsland
    ? {'intensif':50,'équilibré':35,'lent':20,'contemplati':15,'détente':12}
    : {'intensif':120,'équilibré':80,'lent':45,'contemplati':30,'détente':25};
  const kmPerDay = Object.entries(rythmeKm).find(function(e){ return r.includes(e[0]); });
  const kmDay = kmPerDay ? kmPerDay[1] : (isIsland ? 35 : 80);
  const totalKm = dc * kmDay;


  /* Déterminer la contrainte selon km totaux et type de destination */
  let directive = '';
  const zones = Math.max(1, Math.min(dc, Math.round(totalKm / 80)));

  if(isIsland){
    /* Pour les îles : raisonner en km absolus, pas en ratio de l'île entière */
    if(totalKm <= 80){
      const zone = _suggestZone(d, dc, rythme);
      directive = 'CONTRAINTE GÉOGRAPHIQUE STRICTE (île) : avec '+dc+' jours en rythme '+rythme+', rester dans UNE seule zone locale (~'+Math.round(totalKm)+'km max de déplacement). '
        + 'Zone recommandée : '+zone+'. INTERDIT de traverser l\'île. Étapes à moins de 40km les unes des autres.';
    } else if(totalKm <= 160){
      directive = 'CONTRAINTE GÉOGRAPHIQUE (île) : avec '+dc+' jours en rythme '+rythme+', couvrir UNE zone principale + une excursion (~'+Math.round(totalKm)+'km). '
        + 'Ex Sardaigne : rester dans le sud OU le nord. Pas de traversée complète.';
    } else {
      directive = 'CONTRAINTE GÉOGRAPHIQUE (île) : avec '+dc+' jours, traversée possible mais LINÉAIRE (~'+Math.round(totalKm)+'km). '
        + 'Choisir un axe nord→sud OU côte est→côte ouest et s\'y tenir sans retour en arrière.';
    }
  } else {
    const ratio = Math.min(1, totalKm / countrySize);
    if(ratio <= 0.20){
      const zone = _suggestZone(d, dc, rythme);
      directive = 'CONTRAINTE GÉOGRAPHIQUE STRICTE : avec '+dc+' jours en rythme '+rythme+', couvrir UNE seule région (~'+Math.round(totalKm)+'km sur '+countrySize+'km de pays). '
        + 'Zone recommandée : '+zone+'. INTERDIT de traverser tout le pays.';
    } else if(ratio <= 0.45){
      directive = 'CONTRAINTE GÉOGRAPHIQUE : avec '+dc+' jours, couvrir maximum 2 zones adjacentes (~'+Math.round(totalKm)+'km). '
        + 'Axe logique (nord→sud OU est→ouest). Environ '+zones+' étapes. Pas de retour en arrière.';
    } else if(ratio <= 0.70){
      directive = 'CONTRAINTE GÉOGRAPHIQUE : traversée partielle possible (~'+Math.round(totalKm)+'km / '+countrySize+'km). '
        + 'Progression LINÉAIRE sans zigzags. Chaque étape dans la même direction que la précédente.';
    } else {
      directive = 'CONTRAINTE GÉOGRAPHIQUE : circuit complet envisageable (~'+Math.round(totalKm)+'km). '
        + 'Trajet CIRCULAIRE ou LINÉAIRE cohérent. Jamais revenir sur ses pas sauf aéroport départ.';
    }
  }

  return directive;
}

/* Suggère une zone spécifique pour les courts séjours */
function _suggestZone(d, dc, rythme){
  if(d.includes('sardaigne')){
    return dc<=4 ? 'sud (Cagliari, Chia, Villasimius, Teulada) OU nord (Olbia, Costa Smeralda, Palau, La Maddalena)' : 'sud+centre (Cagliari → Oristano) OU nord+centre (Olbia → Nuoro)';
  }
  if(d.includes('thaïlande')||d.includes('bangkok')){
    return dc<=4 ? 'Bangkok et ses environs immédiats (Ayutthaya, Kanchanaburi)' : 'nord (Chiang Mai+Pai) OU sud (îles+plages)';
  }
  if(d.includes('bali')){
    return 'Ubud+Seminyak+Canggu (centre-ouest) OU Ubud+Amed+Sidemen (centre-est)';
  }
  if(d.includes('maroc')){
    return dc<=4 ? 'Marrakech et ses environs (Essaouira, Atlas, vallées)' : 'Marrakech+désert (Ouarzazate+Merzouga)';
  }
  if(d.includes('japon')){
    return dc<=4 ? 'Tokyo et ses environs (Kamakura, Nikko, Hakone)' : 'Tokyo+Kyoto+Osaka (axe Shinkansen)';
  }
  if(d.includes('italie')){
    return dc<=4 ? 'Rome et ses environs OU Toscane uniquement' : 'Rome+Naples+Amalfi OU Florence+Sienne+Cinque Terre';
  }
  if(d.includes('grèce')){
    return dc<=4 ? 'Athènes+une île (Hydra ou Égine)' : 'Athènes+Santorin+Mykonos';
  }
  return 'une région cohérente géographiquement, étapes dans un rayon de 60-80km';
}
function _kind(x){ return GEN_KINDS.includes(x)?x:'pin'; }
function _stayIcon(type){
  const t=(type||'').toLowerCase();
  if(/mer|océan|ocean|plage|beach|front/.test(t)) return 'wave';
  if(/villa|piscine|pool/.test(t)) return 'droplet';
  if(/lodge|jungle|nature|tente|camp|safari|éco|eco/.test(t)) return 'leaf';
  if(/riad|palais|palace|temple|fort|kasbah|ryokan|maison|demeure/.test(t)) return 'arch';
  if(/sommet|montagne|chalet|refuge/.test(t)) return 'peaks';
  return 'bed';
}
function _occasionLabel(id){
  const o=(typeof OCCASIONS!=='undefined')&&OCCASIONS.find(function(x){return x.id===id;});
  return o?o.label:null;
}
function _antiTouristDirective(){
  return 'EXIGENCE ÉDITORIALE HIC SUNT (non négociable, prioritaire sur tout le reste) : Hic Sunt signifie "Beyond the Known" — chaque étape doit éviter le circuit touristique de masse. '
    + 'AUTO-VÉRIFICATION OBLIGATOIRE avant de valider chaque lieu : "Ce nom apparaît-il dans le top 5 des résultats Google Images, TripAdvisor ou Instagram pour cette destination ?" Si oui, c\'est interdit — trouve une alternative réelle et moins connue. '
    + 'Exemples concrets de ce qui est INTERDIT sauf demande explicite du client : Jardin Majorelle à Marrakech, plage de Patong ou Kata à Phuket, Wat Pho/Wat Arun à Bangkok, Ubud central à Bali, Santorin/Oia, Eiffel/Louvre à Paris — et tout équivalent "carte postale" dans n\'importe quelle destination. '
    + 'Remplace systématiquement par l\'alternative la plus secrète et la moins fréquentée de la même région : une crique voisine au lieu de la plage la plus citée, un marché de quartier au lieu du marché central, un village à 20-40 minutes au lieu de la ville-aimant-à-touristes, un riad/maison d\'hôtes tenu par des locaux au lieu de l\'adresse listée partout, un jardin privé ou une plantation discrète au lieu du jardin botanique le plus visité. '
    + 'Si l\'utilisateur mentionne explicitement vouloir éviter la foule/le tourisme de masse, c\'est une contrainte ABSOLUE : aucune plage/site bondé en haute saison, même célèbre, ne doit apparaître, même en filigrane ou en passage rapide. '
    + 'Les hébergements doivent aussi privilégier des adresses indépendantes et discrètes plutôt que les grandes chaînes archi-connues, sauf si le niveau de confort/style du client l\'exige explicitement.';
}

/* ── traduction des réponses du questionnaire en consignes concrètes ── */
const RYTHME_MOMENTS={'Lent':2,'Équilibré':3,'Intense':4};
function _momentsPerDay(){ return RYTHME_MOMENTS[state.rythme] || 3; }
function _rythmeDirective(){
  const r=state.rythme||'Équilibré';
  if(r==='Lent') return 'Rythme LENT : peu d\'étapes par jour, larges plages libres, favoriser un même lieu plusieurs jours, transferts courts.';
  if(r==='Intense') return 'Rythme INTENSE : journées denses, plusieurs activités/lieux par jour, peu de temps mort, maximiser les découvertes.';
  return 'Rythme ÉQUILIBRÉ : alternance activités et temps libre, transferts raisonnables.';
}
function _occasionDirective(){
  const id=state.occasion;
  if(!id) return '';
  const map={
    'lune-de-miel':'OCCASION — Lune de miel : privilégier dîners romantiques en tête-à-tête, hébergements intimistes (vue, terrasse privée, suites), moments à deux (massage en duo, bateau privé, coucher de soleil).',
    'anniversaire':'OCCASION — Anniversaire : prévoir au moins un moment de célébration mémorable (dîner spécial, surprise locale, expérience exclusive le jour J si possible).',
    'evjf':'OCCASION — EVJF : adresses tendance et instagrammables, spas/bien-être, brunchs et rooftops, ambiance festive entre amies.',
    'evg':'OCCASION — EVG : expériences fortes en sensations (sports, sorties nocturnes, activités entre amis), ambiance conviviale et dynamique.',
    'famille':'OCCASION — En famille : activités adaptées à tous âges (pas d\'horaires extrêmes, pas de randonnées trop longues), hébergements avec espace/piscine, rythme doux.',
    'solo':'OCCASION — En solo : favoriser rencontres locales, hébergements conviviaux (guesthouses, petites adresses), activités modulables.',
  };
  return map[id]||'';
}
function _styleDirective(){
  const styles=(state.styles||[]);
  if(!styles.length) return '';
  const lower=styles.join(' ').toLowerCase();
  const notes=[];
  if(lower.includes('luxe'))              notes.push('hébergements haut de gamme, services premium, adresses signature');
  if(lower.includes('nature')||lower.includes('aventure')) notes.push('lodges nature, accès direct sentiers/sites naturels, activités outdoor');
  if(lower.includes('détente')||lower.includes('bien-être')||lower.includes('spa')) notes.push('hébergements avec spa/piscine, massages inclus si possible, journées avec temps libre');
  if(lower.includes('gastro')||lower.includes('culinaire')) notes.push('tables d\'exception locales, marchés producteurs, cours de cuisine');
  if(lower.includes('plage')||lower.includes('mer'))  notes.push('hébergements en front de mer ou accès direct plage/crique, activités nautiques');
  if(lower.includes('art')||lower.includes('architecture')) notes.push('musées, ateliers d\'artistes, quartiers historiques et bâtiments remarquables');
  if(lower.includes('road')||lower.includes('route')) notes.push('itinéraire en voiture/moto, haltes spontanées, hébergements variés le long du trajet');
  if(lower.includes('randonnée'))         notes.push('sentiers de randonnée, hébergements avec accès direct aux trails');
  if(lower.includes('off')||lower.includes('beaten')) notes.push('destinations peu fréquentées, zéro touristique, immersion totale');
  if(lower.includes('oenot')||lower.includes('vin')) notes.push('visites de domaines viticoles, dégustations, tables gastronomiques de vignobles');
  if(lower.includes('surf')||lower.includes('nautisme')) notes.push('spots de surf/kite, locations d\'équipement nautique, hébergements surfers-friendly');
  if(lower.includes('photo'))             notes.push('golden hours programmés, accès aux points de vue secrets, lumière naturelle privilégiée');
  if(lower.includes('nocturn')||lower.includes('nightl')) notes.push('bars locaux, concerts, scène culturelle nocturne authentique');
  if(lower.includes('slow'))              notes.push('rythme très lent, longues haltes, répéter les mêmes lieux pour s\'y ancrer vraiment');
  if(lower.includes('famille'))           notes.push('activités adaptées aux enfants, hébergements spacieux, rythme doux');
  if(lower.includes('culture')||lower.includes('authenticité')) notes.push('rencontres locales, artisans, patrimoine vivant loin des circuits');
  return notes.length ? 'STYLE DE VOYAGE ('+styles.join(', ')+') : '+notes.join(' · ')+'.' : 'Styles : '+styles.join(', ')+'.';
}

function _interestsDirective(){
  const interests=(state.interests||[]);
  if(!interests.length) return '';
  const lower=interests.join(' ').toLowerCase();
  const notes=[];
  if(lower.includes('randonnée')||lower.includes('hike')) notes.push('planifier des randonnées avec noms des sentiers et niveaux de difficulté');
  if(lower.includes('plage')||lower.includes('crique'))   notes.push('accès à des plages secrètes et criques peu fréquentées');
  if(lower.includes('safari')||lower.includes('faune'))   notes.push('sorties safari avec guides locaux, faune endémique');
  if(lower.includes('temple')||lower.includes('spiritua')) notes.push('sites spirituels authentiques, heures de visite calmes');
  if(lower.includes('marché'))                            notes.push('marchés de producteurs locaux, étals authentiques');
  if(lower.includes('gastro')||lower.includes('cuisine')) notes.push('tables locales réputées, cours de cuisine, spécialités régionales');
  if(lower.includes('photo'))                             notes.push('moments golden hour et blue hour, accès aux belvédères secrets');
  if(lower.includes('architect'))                         notes.push('patrimoine architectural, bâtiments remarquables, quartiers historiques');
  if(lower.includes('vin')||lower.includes('vignoble')||lower.includes('oenot')) notes.push('domaines viticoles et caves à visiter, dégustations producteurs');
  if(lower.includes('bien-être')||lower.includes('spa')||lower.includes('yoga')||lower.includes('médita')) notes.push('spas et centres de bien-être locaux avec noms et tarifs, séances yoga/méditation');
  if(lower.includes('plongée')||lower.includes('snorkel')||lower.includes('sous-marin')||lower.includes('nautique')) notes.push('spots de plongée et snorkeling avec prestataires locaux');
  if(lower.includes('nocturn')||lower.includes('nightl')) notes.push('bars locaux, concerts, scène nocturne authentique et non-touristique');
  if(lower.includes('vélo')||lower.includes('cycl'))      notes.push('pistes cyclables, locations de vélo, itinéraires à deux-roues');
  if(lower.includes('équitat')||lower.includes('cheval')) notes.push('randonnées équestres avec prestataires locaux');
  if(lower.includes('artisan')||lower.includes('craft'))  notes.push('ateliers d\'artisans, coopératives, savoir-faire local');
  if(lower.includes('musée')||lower.includes('galerie'))  notes.push('musées insolites et galeries d\'art contemporain local');
  if(lower.includes('festival')||lower.includes('musique')) notes.push('festivals locaux et concerts si disponibles sur la période');
  if(lower.includes('astrono'))                           notes.push('spots d\'observation astronomique, nuits sous les étoiles');
  if(lower.includes('therme')||lower.includes('bain'))    notes.push('thermes et bains naturels locaux');
  if(lower.includes('ornith')||lower.includes('oiseau'))  notes.push('réserves ornithologiques, sorties observation avec guide');
  return notes.length ? 'INTÉRÊTS PRIORITAIRES ('+interests.join(', ')+') : intégrer dans chaque journée : '+notes.join(' · ')+'.' : '';
}
function _dreamDirective(){
  if(!state.dream) return '';
  const surprise=state.createTab==='surprise';
  return (surprise?'CONTRAINTES / À ÉVITER (impératif) : ':'ENVIE PRIORITAIRE DU CLIENT (à intégrer absolument) : ')+state.dream;
}

/* Extraire une contrainte de zone depuis le dream si mentionnée */
function _zoneFromDream(dest, dream){
  if(!dream) return '';
  const d=dream.toLowerCase(), dest_l=(dest||'').toLowerCase();
  /* Contraintes directionnelles */
  if(/sud\b|south\b|méridional/.test(d)) return '⚠️ ZONE IMPOSÉE PAR LE CLIENT : SUD uniquement. Aucune étape au nord ou au centre.';
  if(/nord\b|north\b|septentrion/.test(d)) return '⚠️ ZONE IMPOSÉE PAR LE CLIENT : NORD uniquement. Aucune étape au sud ou au centre.';
  if(/\best\b|orient/.test(d)) return '⚠️ ZONE IMPOSÉE PAR LE CLIENT : EST uniquement. Côte est.';
  if(/\bouest\b|west\b|occident/.test(d)) return '⚠️ ZONE IMPOSÉE PAR LE CLIENT : OUEST uniquement. Côte ouest.';
  /* Zones nommées Sardaigne */
  if(dest_l.includes('sardaigne')){
    if(/cagliari|chia|villasimius|sulcis|campidano|iglesiente/.test(d)) return '⚠️ ZONE : Extrême SUD Sardaigne (Cagliari, Chia, Villasimius, Sulcis). Aucune étape au-delà de Carbonia/Oristano.';
    if(/alghero|sassari|castelsardo|bosa|nurra/.test(d)) return '⚠️ ZONE : NORD-OUEST Sardaigne (Alghero, Sassari, Bosa). Aucune étape au sud.';
    if(/olbia|costa smeralda|gallura|palau|maddalena/.test(d)) return '⚠️ ZONE : NORD-EST Sardaigne / Gallura (Olbia, Costa Smeralda, Palau). Aucune étape au sud.';
    if(/nuoro|barbagia|ogliastra|oliena|orgosolo/.test(d)) return '⚠️ ZONE : CENTRE-EST Sardaigne (Nuoro, Barbagia, Ogliastra). Pas de côte.';
  }
  return '';
}

/* ── catégories thématiques & palettes adaptatives ───────────────────── */
/* chaque "kind" de moment appartient à une catégorie thématique */
const KIND_CATEGORY={
  peaks:'hike', leaf:'hike', compass:'hike',
  wave:'beach',
  droplet:'spa',
  fork:'food', moon:'food',
  arch:'culture', camera:'culture', star:'culture', ticket:'culture',
  sun:'outdoor',
  plane:'transit', bed:'transit', pin:'culture',
};
const CATEGORY_LABELS={
  hike:'Rando & nature', beach:'Plage & océan', spa:'Bien-être',
  food:'Table & saveurs', culture:'Patrimoine', outdoor:'Plein air', transit:'Transfert',
};

/* ── palettes par pays / région — vraiment distinctes visuellement ────── */
const THEME_PALETTES={
  /* Tropiques Asie (Thaïlande, Bali, Vietnam…) : vert jungle, corail, or temple */
  tropical:    { hike:'#2D9E6B', beach:'#E87A4A', spa:'#F0C060', food:'#D45A30', culture:'#C4803A', outdoor:'#48B89A', transit:'#7DA898' },
  /* Tropiques Océan Indien (Maldives, Réunion, Maurice…) : lagon, rose, sable */
  tropical_io: { hike:'#3AAE8A', beach:'#4AC8E0', spa:'#E87A9A', food:'#E89A4A', culture:'#A87BD4', outdoor:'#60C8B0', transit:'#7DAAB8' },
  /* Désert chaud (Maroc, Jordanie, Égypte…) : ocre, terracotta, bronze */
  desert:      { hike:'#D4943A', beach:'#D9B870', spa:'#E8A070', food:'#D4522A', culture:'#B08A3A', outdoor:'#D4C06A', transit:'#A89572' },
  /* Désert froid / Steppe (Mongolie, Islande intérieur…) : gris bleu, sienne */
  steppe:      { hike:'#7A9E8A', beach:'#5A8AAA', spa:'#B0A0D4', food:'#C0804A', culture:'#8A7A6A', outdoor:'#9ABAC0', transit:'#8A9EA8' },
  /* Alpine Europe (Alpes, Pyrénées, Dolomites…) : vert sapin, bleu glacier */
  alpine:      { hike:'#3A9E7E', beach:'#4A8EC9', spa:'#9B8AD4', food:'#D47A3A', culture:'#6A96B8', outdoor:'#4ABECE', transit:'#8AA4A8' },
  /* Andine / Haute altitude (Pérou, Bolivie, Népal…) : terre, or inca, violet altitude */
  andean:      { hike:'#8A6A3A', beach:'#C0903A', spa:'#A880C0', food:'#D06040', culture:'#C0A040', outdoor:'#6A9860', transit:'#907060' },
  /* Urbain Asie (Japon, Corée, Singapour…) : indigo, cerise, néon doux */
  urban_asia:  { hike:'#4A6AAA', beach:'#4A9FBE', spa:'#E06090', food:'#E05030', culture:'#7A50C0', outdoor:'#D0A030', transit:'#8090A8' },
  /* Urbain Occident (Paris, Londres, NY…) : ardoise, or, bordeaux */
  urban:       { hike:'#5AAE6E', beach:'#4A9FBE', spa:'#C97AC9', food:'#D4854A', culture:'#7A65D4', outdoor:'#D4A84A', transit:'#8A9E8A' },
  /* Méditerranée (Italie, Grèce, Espagne, Sardaigne…) : bleu mer, rouge tomate, or */
  mediterranean:{ hike:'#5A9A5A', beach:'#3A9EC9', spa:'#E8A87A', food:'#D44A2A', culture:'#D4943A', outdoor:'#4ABDB0', transit:'#A89880' },
  /* Afrique savane (Kenya, Tanzanie, Rwanda…) : ocre, rouge latérite, vert acacia */
  savanna:     { hike:'#8AAA3A', beach:'#D0A040', spa:'#E09060', food:'#C05030', culture:'#B07030', outdoor:'#70A850', transit:'#9A8060' },
  /* Caraïbes / Amérique centrale : turquoise, jaune soleil, rose bougainvillier */
  caribbean:   { hike:'#3AAA6A', beach:'#30C0C0', spa:'#E070B0', food:'#E0A030', culture:'#C06030', outdoor:'#60C880', transit:'#70A0A8' },
};

function _themeForDestination(dest, region, country){
  const s=((dest||'')+' '+(region||'')+' '+(country||'')).toLowerCase();
  /* Désert */
  if(/maroc|sahara|jordanie|égypte|namibie|dubai|émirats|oman|tunisie|libye|arabie/.test(s)) return 'desert';
  /* Steppe / Islande */
  if(/islande|mongolie|kirghizstan|kazakhstan/.test(s)) return 'steppe';
  /* Andine / Haute altitude */
  if(/pérou|bolivie|équateur|népal|himalaya|tibet|patagonie|andes/.test(s)) return 'andean';
  /* Alpine Europe */
  if(/alpes|suisse|autriche|dolomites|pyrénées|norvège|écosse|finlande|suède/.test(s)) return 'alpine';
  /* Urbain Asie */
  if(/japon|tokyo|kyoto|corée|séoul|singapour|hong kong|taipei|taiwan/.test(s)) return 'urban_asia';
  /* Urbain Occident */
  if(/paris|londres|berlin|new york|amsterdam|barcelone|madrid|lisbonne.*city/.test(s)) return 'urban';
  /* Méditerranée */
  if(/italie|grèce|espagne|portugal|croatie|sardaigne|sicile|provence|méditerran|malte|chypre/.test(s)) return 'mediterranean';
  /* Savane Afrique */
  if(/kenya|tanzanie|rwanda|ouganda|zimbabwe|botswana|afrique.*sud|namibie|éthiopie|sénégal/.test(s)) return 'savanna';
  /* Caraïbes / Amér. centrale */
  if(/mexique|cuba|jamaïque|martinique|guadeloupe|costa rica|panama|colombie|brésil.*côte|caraïbes/.test(s)) return 'caribbean';
  /* Océan Indien */
  if(/maldives|réunion|maurice|seychelles|madagascar|mozambique/.test(s)) return 'tropical_io';
  /* Tout le reste : tropical Asie du SE */
  return 'tropical';
}

/* ── coefficient de coût de vie par destination ──────────────────────
   Le niveau de confort (Éco/Confort/Luxe/Ultra) définit une fourchette
   de base en €/pers/jour, calibrée sur un coût de vie "Europe de l'Ouest".
   Ce coefficient l'ajuste à la réalité locale (Asie du SE, Afrique etc.
   sont nettement moins chères ; Japon/Suisse/USA/Émirats plus chères). ── */
function _costOfLivingFactor(dest, region, country){
  const s=((dest||'')+' '+(region||'')+' '+(country||'')).toLowerCase();
  /* zones très onéreuses */
  if(/japon|tokyo|kyoto|suisse|norvège|islande|new york|émirats|dubai|singapour|hong kong/.test(s)) return 1.25;
  /* zones très économiques */
  if(/thaïlande|vietnam|cambodge|laos|indonésie|bali|sri lanka|inde|népal|philippines|maroc|égypte|kenya|tanzanie|madagascar/.test(s)) return 0.55;
  /* zones modérément économiques */
  if(/portugal|grèce|croatie|mexique|pérou|colombie|turquie|géorgie|albanie/.test(s)) return 0.75;
  /* défaut : Europe de l'Ouest / Amérique du Nord */
  return 1;
}

/* ── fourchettes de prix de vols A/R au départ de Paris, par zone ──────
   Calibré sur des moyennes réelles observées (sources : comparateurs de vols,
   moyennes 2026). Volontairement large car les tarifs varient fortement
   selon la saison et le délai de réservation — l'objectif est un budget
   crédible, pas un prix de billet exact. ── */
const FLIGHT_BANDS={
  court:    [80, 320],   /* Maroc, Italie, Espagne, Portugal, Grèce, Croatie... */
  moyen:    [250, 550],  /* Turquie, Égypte, Émirats, Europe de l'Est lointaine... */
  long:     [600, 1050], /* Thaïlande, Bali, Sri Lanka, Kenya, Inde... */
  tresLong: [800, 1450], /* Amérique, Océanie, Japon, Pacifique... */
};
function _flightBand(dest, region, country){
  const s=((dest||'')+' '+(region||'')+' '+(country||'')).toLowerCase();
  if(/maroc|italie|espagne|portugal|grèce|croatie|sardaigne|sicile|provence|méditerran|tunisie|malte|chypre/.test(s)) return 'court';
  if(/turquie|égypte|émirats|dubai|jordanie|géorgie|albanie|israël|liban|arménie/.test(s)) return 'moyen';
  if(/thaïlande|vietnam|cambodge|laos|indonésie|bali|sri lanka|inde|népal|philippines|kenya|tanzanie|madagascar|maldives|birmanie/.test(s)) return 'long';
  if(/japon|corée|chine|singapour|hong kong|australie|nouvelle-zélande|pérou|colombie|mexique|brésil|argentine|chili|états-unis|canada|polynésie|tahiti|fidji/.test(s)) return 'tresLong';
  return 'long';
}
function _flightEstimate(dest, region, country, travelers){
  const band = FLIGHT_BANDS[_flightBand(dest, region, country)];
  const perPerson = Math.round((band[0]+band[1])/2);
  return perPerson * Math.max(1, travelers||1);
}

/* ── brief ───────────────────────────────────────────────────────────── */
function buildBrief(){
  const surprise=state.createTab==='surprise';
  const occ=_occasionLabel(state.occasion);
  let datesLine='Dates : non précisées', durationLine='', daysCount=7;
  if(state.dateFrom&&state.dateTo){
    const from=new Date(state.dateFrom), to=new Date(state.dateTo);
    const days=Math.round((to-from)/86400000);
    const fmt=function(d){return d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});};
    datesLine='Dates : '+fmt(from)+' au '+fmt(to);
    durationLine='Durée : '+days+' jour'+(days>1?'s':'');
    if(days>0) daysCount=days;
  }
  const flightsLine=(state.flightOut||state.flightIn)
    ?'Vols : aller '+(state.flightOut||'non renseigné')+' / retour '+(state.flightIn||'non renseigné'):'';
  const lines=[
    'Destination : '+(state.destination?state.destination:(surprise?'SURPRISE — choisis la destination la plus désirable pour ce profil':'')),
    'Départ : '+(state.origin||'Paris'),
    datesLine, durationLine,
    'Voyageurs : '+travelerLabel(),
    'Confort : '+(state.budget||'Confort'),
    'Rythme : '+(state.rythme||'Équilibré'),
    'Styles : '+((state.styles||[]).join(', ')||'variés'),
    "Intérêts : "+((state.interests||[]).join(', ')||'découverte générale'),
    'Occasion : '+(occ||'aucune'),
    flightsLine,
    (surprise?'Contraintes / à éviter : ':'Rêve du voyage : ')+(state.dream||'—'),
  ].filter(Boolean).join('\n');
  return {surprise:surprise, lines:lines, daysCount:daysCount};
}

/* ── Passe 1 : ossature + étapes (par lots si voyage long) ───────────── */
const SKEL_BATCH_SIZE = 7;
function buildSkeletonPrompt(dc, batchSize, offset){
  const b=buildBrief();
  const isFirst = offset===0;
  const n = Math.min(batchSize, dc-offset);
  const rythme = state.rythme||'Équilibré';
  const dest = state.destination||'';
  const geoConstraint = _geoConstraintDirective(dest, dc, rythme);
  const zoneConstraint = _zoneFromDream(dest, state.dream||'');

  /* Vitesse de déplacement selon rythme */
  const maxKm = rythme.includes('lent')||rythme.includes('déten')?80
    : rythme.includes('intensif')?250 : 150;

  const common=[
    geoConstraint,
    zoneConstraint ? zoneConstraint : '',
    '━━━ RÈGLES LOGISTIQUES ABSOLUES (violations = itinéraire invalide) ━━━',
    '1. TRACÉ LINÉAIRE : chaque étape dans la même direction générale. Visualise la carte — le tracé doit avoir du sens.',
    '2. DISTANCES RÉALISTES : max '+maxKm+'km entre deux étapes consécutives (rythme '+rythme+'). Mentionner le trajet si > 45min.',
    '3. JOURS DE TRANSFERT : si le trajet excède 2h, dédier ce jour au trajet + arrivée. Ne pas charger un jour de transfert avec des activités.',
    '4. FERRIES/BATEAUX : toujours planifier aller ET retour avec dates précises. Jamais quitter le continent pour une île sans prévoir le retour dans le plan.',
    '5. UN HÉBERGEMENT PAR ZONE : ne changer d\'hébergement QUE si on change de zone géographique (>30km). Pas de changement d\'hôtel inutile.',
    '6. COHÉRENCE "night" : le champ "night" de chaque jour = "name" EXACT d\'un hébergement de "stays". Obligatoire.',
    '7. SKY : sun, cloud, ou rain uniquement.',
    '8. JSON valide compact. Zéro texte autour.',
  ];

  if(isFirst){
    const directives=[_antiTouristDirective(),_interestsDirective(),_rythmeDirective(),_occasionDirective(),_styleDirective(),_dreamDirective()].filter(Boolean);
    const destLock = (!b.surprise&&dest)
      ? '⚠️ DESTINATION IMPOSÉE : "'+dest+'". "dest" DOIT être "'+dest+'". Absolument aucune autre destination.' : '';

    return [
      '╔═══════════════════════════════════════════════════════════════╗',
      '║  HIC SUNT · BEYOND THE KNOWN — CARTOGRAPHE SENIOR            ║',
      '║  Standard : directeur d\'une agence de voyage ultra-luxe       ║',
      '║  Exigence : cohérence logistique absolue + authenticité       ║',
      '╚═══════════════════════════════════════════════════════════════╝',
      '',
      destLock,
      zoneConstraint ? zoneConstraint+'\n' : '',
      '━━━ BRIEF CLIENT ━━━',
      b.lines,
      '',
      '━━━ PERSONNALISATION ━━━',
      directives.length?directives.join('\n'):'Confort, ouvert aux découvertes authentiques.',
      '',
      '━━━ PHILOSOPHIE ÉDITORIALE ━━━',
      '• NOMS RÉELS : restaurants, guides, excursions — décris-les précisément. Pour les HÉBERGEMENTS, propose un nom plausible et le bon standing : ils seront ensuite remplacés par de vrais établissements vérifiés.',
      '• STANDING HÉBERGEMENTS : toujours indiquer la classification (Relais & Châteaux / 5⭐ / Boutique 4⭐ / Agriturismo bio / Maison d\'hôtes charme).',
      '• RESTAURANTS : nom exact + quartier + spécialité signature + fourchette de prix + note Google si connue.',
      '• EXCURSIONS : nom du prestataire ou du guide local + contact si disponible.',
      '• ANCRAGE LOCAL : familles, producteurs, artisans. "Trattoria tenue par la même famille depuis 1974."',
      '• HORAIRES PRATIQUES : meilleur moment, réservation conseillée, à éviter si surpeuplé.',
      '• ANTI-TOURISTIQUE : pas de spots Instagram saturés. Penser comme un habitant cultivé, pas comme un guide Lonely Planet.',
      '• LOGISTIQUE RÉALISTE : si le trajet d\'un jour dépasse 2h, c\'est un jour de route — pas de visite intensive ce jour-là.',
      '',
      '━━━ CONSIGNES STRICTES ━━━',
      common.join('\n'),
      '',
      '• "plan" : EXACTEMENT '+n+' entrées numérotées (jours 1→'+n+' sur '+dc+').',
      '• "stays" : couvre les '+dc+' JOURS complets. Max '+Math.min(5,Math.max(1,Math.ceil(dc/4)))+' hébergements (1 par zone géographique distincte > 30km).',
      '• Hébergement J1 = lieu d\'arrivée (aéroport proche). Dernier hébergement = près de l\'aéroport de départ.',
      '• Prix hébergements RÉALISTES et DISTINCTS par type :',
      '  Sardaigne/Corse: agriturismo 65-95€ · boutique 95-145€ · resort 140-210€ · villa/charme 190-380€',
      '  Thaïlande: guesthouse 35-75€ · boutique-hôtel 75-135€ · resort plage 110-200€ · villa privée 180-400€',
      '  Maroc: maison d\'hôtes 55-95€ · riad médina 90-160€ · camp désert 130-230€ · resort Atlas 150-280€',
      '  Japon: ryokan 120-280€ · business hotel 80-130€ · boutique 100-200€',
      '  Ajuster × colFactor selon la destination',
      '• Budget TOTAL réaliste pour '+dc+' jours × TOUS voyageurs (héberg+repas+activités+transport local, hors vols) :',
      '  Éco 60-90€/pers/j · Confort 110-190€/pers/j · Luxe 220-450€/pers/j · Ultra 450€+/pers/j',
      '',
      '━━━ AUTO-VALIDATION AVANT DE RÉPONDRE ━━━',
      'Avant de générer le JSON, vérifier mentalement :',
      '✓ Chaque trajet est-il physiquement possible en 1 journée (< '+maxKm+'km) ?',
      '✓ Si ferry prévu pour une île, le retour est-il dans le plan ?',
      '✓ Les jours lourds en trajet sont-ils allégés en activités ?',
      '✓ Tous les "night" correspondent à un nom exact de "stays" ?',
      '✓ Les hébergements ne changent pas si on reste dans la même zone ?',
      '✓ L\'itinéraire finit logiquement près de l\'aéroport de retour ?',
      '',
      destLock?'Rappel final : dest = "'+dest+'" sans exception.':'',
      '',
      'SCHÉMA (utilise des vraies données à la place des exemples) :',
      '{"dest":"Sardaigne","country":"Italie","tagline":"Criques secrètes et maquis odorant sous le soleil d\'août","level":"Confort","dates":"14-22 août 2026 · '+dc+' jours","days_count":'+dc+',"budget":'+Math.round(dc*140*2)+',"season":"Août chaud, idéal mer — éviter mi-août pour Cagliari","coords":"39°13\'N · 9°07\'E","region":"Sardaigne","stays":['
      +'{"name":"Agriturismo Mandra Edera","type":"Agriturismo bio · charme","loc":"Chia / Extrême Sud","price":88,"nights":4,"blurb":"Crique privée à 800m, production fromagère, couchers de soleil sur l\'archipel"},'
      +'{"name":"Su Gologone","type":"Relais & Châteaux · 4⭐","loc":"Oliena / Nuoro — centre","price":148,"nights":4,"blurb":"Source naturelle, jardins secrets, cuisine barbaricina authentique"}],'
      +'"plan":[{"title":"Arrivée Cagliari — premiers pas dans le sud sauvage","loc":"Cagliari / Aéroport","night":"Agriturismo Mandra Edera","sky":"sun","temp":"29°","hook":"45min de route depuis l\'aéroport : la Sardaigne commence au premier virage côtier."}]}',
    ].filter(Boolean).join('\n');
  }

  /* Batches suivants — contexte complet */
  const staysList=(state._genStays||[]).map(function(s){return '"'+s.name+'" ('+s.type+', '+s.loc+') — '+s.nights+' nuits';}).join('\n');
  const lastSteps=(state._genLastSteps||[]).slice(-2).map(function(p){return p.n+'. '+p.loc+' ('+p.title+')';}).join(' → ');
  return [
    'HIC SUNT — SUITE itinéraire '+dest+', '+dc+'j. Jours '+(offset+1)+'→'+(offset+n)+'.',
    'MÊMES EXIGENCES : noms réels, logistique rigoureuse, ancrage local.',
    '',
    '━━━ BRIEF CLIENT ━━━',
    b.lines,
    '',
    '━━━ CONTEXTE ━━━',
    'Dernières étapes : '+lastSteps,
    'Hébergements établis (utiliser "name" EXACT dans "night") :',
    staysList,
    '',
    common.join('\n'),
    '• EXACTEMENT '+n+' entrées : jours '+(offset+1)+'→'+(offset+n)+'.',
    '• Continuer géographiquement depuis la dernière étape.',
    '• Vérifier : trajet réaliste ? ferry retour prévu ? nuits cohérentes ?',
    '',
    '{"plan":[{"title":"","loc":"ville précise","night":"nom exact stays","sky":"sun","temp":"26°","hook":"phrase évocatrice 10 mots max"}]}',
  ].join('\n');
}

/* ── Passe 2 : détail éditorial des jours (par lots) ─────────────────── */
function buildDaysPrompt(skel, planSteps, offset){
  const b=buildBrief();
  const nMoments=_momentsPerDay();
  const directives=[_antiTouristDirective(),_interestsDirective(),_rythmeDirective(),_occasionDirective(),_styleDirective(),_dreamDirective()].filter(Boolean);
  const steps=planSteps.map(function(p,i){return (offset+i+1)+'. '+p.title+' — '+p.loc+(p.hook?' ('+p.hook+')':'');}).join('\n');
  return [
    'CARTOGRAPHE SENIOR HICSUNT — Détails éditoriaux pour '+skel.dest+', jours '+(offset+1)+' à '+(offset+planSteps.length)+'.',
    'EXIGENCE : niveau d\'un guide Condé Nast Traveller ou Wallpaper City Guide. Noms RÉELS et VÉRIFIABLES.',
    '',
    '═══ BRIEF CLIENT ═══',
    b.lines,
    '',
    '═══ PERSONNALISATION ═══',
    directives.length?directives.join('\n'):'Standard confort.',
    '',
    'ÉTAPES À DÉTAILLER :',
    steps,
    '',
    '━━━ VÉRIFICATION GÉOGRAPHIQUE OBLIGATOIRE ━━━',
    'Avant chaque moment/restaurant, vérifier : ce lieu existe-t-il RÉELLEMENT dans la zone de l\'étape ?',
    '- Chaque restaurant et activité doit être dans la ville/zone de l\'étape ou à moins de 15km',
    '- Sur une île (San Pietro, Asinara...) : TOUS les lieux DOIVENT être sur cette île',
    '- Ne jamais recommander un restaurant d\'une autre région même si célèbre (ex: Su Gologone près de Nuoro ≠ Chia)',
    '- Si tu n\'es pas certain qu\'un lieu existe dans cette zone exacte : invente un nom plausible local plutôt que de mettre un lieu d\'une autre région',
    '',
    '═══ STANDARDS QUALITATIFS ═══',
    'Pour CHAQUE étape, produire :',
    '- "desc" : 2 phrases narratives (max 30 mots), ton luxe éditorial. Évoquer les sensations, pas les faits.',
    '- "moments" : '+nMoments+' moments RÉELS avec vrais noms :',
    '  · Restaurants : nom exact + quartier + spécialité signature + note Google (ex: "Ristorante Da Tonino, Cagliari — suppa cuata, 4,5⭐")',
    '  · Excursions : nom commercial ou guide local + téléphone si disponible (ex: "Kayak Cala Luna avec Gonario Guides — +39 347 123 456")',
    '  · Sites : heure idéale + conseil pratique (ex: "Nuraghe Su Nuraxi, Barumini — arriver à 8h avant les cars")',
    '  · Spas/massages : nom + prix + type de soin (ex: "Hotelito Desconocido Spa — Massage basalte 90min, 95€")',
    '  · format moment : {t:"heure", k:"icône", ti:"NOM RÉEL précis", d:"détail local 6 mots"}',
    '  · k dans ['+GEN_KINDS.join(',')+']',
    '- "tip" : conseil d\'initié hyper-spécifique à ce lieu ("Éviter les 11h-14h. Mercredi = marché de producteurs à 200m")',
    '- "restaurant" : VRAI restaurant local avec note et avis',
    '  · {"name":"Vrai Nom","type":"spécialité signature","price":"€|€€|€€€","note":"1 raison d\'y aller","rating":"4,3⭐","review":"témoignage type client"}',
    '- "wellness" : si spa/lune de miel dans les intérêts, VRAI établissement avec prix. Sinon null.',
    '  · {"name":"Nom spa réel","type":"type de soin","price":"prix","note":"ambiance"}',
    '',
    'Réponds UNIQUEMENT en JSON compact valide, EXACTEMENT '+planSteps.length+' entrées dans "days" :',
    '{"days":[{"desc":"narrative évocatrice","tip":"conseil expert spécifique","restaurant":{"name":"Sa Cardiga e Su Schironi","type":"Anguille du lac grillée","price":"€€","note":"Institution de 70 ans, clientèle locale","rating":"4,4⭐","review":"Authentique, hors des sentiers"},"wellness":null,"moments":[{"t":"07:30","k":"peaks","ti":"Nuraghe Su Nuraxi, Barumini","d":"Arriver tôt, site Unesco désert"}]}]}',
  ].join('\n');
}

/* ── Passe 3 : adresses, highlights, budget ─────────────────────────── */
function buildHighlightsPrompt(skel, days){
  const b=buildBrief();
  const dest=skel.dest||'';
  const interests=(state.interests||[]).join(', ')||'';
  const directives=[_antiTouristDirective(),_interestsDirective(),_occasionDirective(),_styleDirective(),_dreamDirective()].filter(Boolean);
  const locs=(skel.plan||[]).map(function(p){return p.loc;}).filter(function(v,i,a){return a.indexOf(v)===i;}).join(', ');
  const wantSpa=interests.toLowerCase().includes('spa')||interests.toLowerCase().includes('bien-être')||state.occasion==='lune-de-miel';
  const wantNature=interests.toLowerCase().includes('nature')||interests.toLowerCase().includes('randonn');
  const wantBeach=interests.toLowerCase().includes('plage');
  const wantFood=interests.toLowerCase().includes('gastro')||interests.toLowerCase().includes('cuisine');
  return [
    'Expert voyages Hic Sunt. Destination : '+dest+' · Étapes : '+locs,
    'Intérêts client : '+interests,
    directives.length?directives.join('\n'):'',
    '',
    'Les "gems" (pépites cachées) doivent refléter les directives de personnalisation ci-dessus si présentes (ex: lune de miel → lieu romantique peu connu ; famille → activité adaptée aux enfants).',
    'Génère UNIQUEMENT les sections suivantes. JSON compact valide, aucun texte autour.',
    '',
    '{"gems":[{"name":"vrai nom lieu secret","loc":"ville","desc":"pourquoi y aller en 1 phrase","tip":"conseil pratique"}],"highlights":{"spas":'+
    (wantSpa?'[{"name":"vrai spa local","loc":"ville","type":"ex: Massage ayurvédique","price":"ex: 35€/h","note":"1 phrase"}]':'[]')+
    ',"cascades":'+
    (wantNature?'[{"name":"nom cascade réelle","loc":"ville","desc":"accès et baignade","tip":"meilleur moment"}]':'[]')+
    ',"beaches":'+
    (wantBeach?'[{"name":"nom plage réelle","loc":"ville","desc":"ambiance et accès","tip":"conseil horaire"}]':'[]')+
    ',"restaurants":'+
    (wantFood?'[{"name":"vrai nom resto","loc":"ville","type":"spécialité","price":"fourchette","note":"pourquoi y aller"}]':'[]')+
    '},"essentials":{"transport":["conseil vols","conseil transport local"],"visa":"info visa ressortissants français","bestTime":"'+
    (skel.season||'à définir')+' — raison courte","toKnow":["info pratique 1","info culturelle 2","info sécurité 3"]},"budget_note":"fourchette totale par personne hors vols"}',
  ].filter(Boolean).join('\n');
}

/* ── parsing JSON ────────────────────────────────────────────────────── */
function repairJSON(s){
  const last=s.lastIndexOf('}'); if(last<0) return null;
  let t=s.slice(0,last+1), stack=[], inStr=false, esc2=false;
  for(let i=0;i<t.length;i++){
    const c=t[i];
    if(inStr){if(esc2)esc2=false;else if(c==='\\')esc2=true;else if(c==='"')inStr=false;continue;}
    if(c==='"'){inStr=true;continue;}
    if(c==='{'||c==='[')stack.push(c==='{'?'}':']');
    else if(c==='}'||c===']')stack.pop();
  }
  t=t.replace(/[\s,]*$/,'');
  let suf=''; for(let i=stack.length-1;i>=0;i--)suf+=stack[i];
  try{return JSON.parse(t+suf);}catch(e){return null;}
}
function parseItineraryJSON(text){
  if(!text) return null;
  let s=String(text).trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
  const a=s.indexOf('{'), b=s.lastIndexOf('}');
  const slice=(a>=0&&b>a)?s.slice(a,b+1):s.slice(a>=0?a:0);
  try{return JSON.parse(slice);}catch(e){}
  return repairJSON(s.slice(a>=0?a:0));
}

/* ── appel Supabase ─────────────────────────────────────────────────── */
async function _callSupabase(prompt){
  const res=await fetch(SUPABASE_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt:prompt})});
  if(!res.ok) throw new Error('HTTP '+res.status);
  const data=await res.json();
  if(data.error) throw new Error(data.error);
  return data.result||'';
}
async function _completeJSON(prompt){
  for(let a=0;a<2;a++){
    try{const txt=await _callSupabase(prompt); const j=parseItineraryJSON(txt); if(j) return j;}catch(e){}
  }
  return null;
}

/* ── helpers icônes ─────────────────────────────────────────────────── */
function _momentIcon(ti){
  const s=(ti||'').toLowerCase();
  if(/vol|aéro|transfer|arriv|départ/.test(s)) return 'plane';
  if(/dîner|déjeuner|restaurant|table|cuisine|food/.test(s)) return 'fork';
  if(/temple|palais|musée|patrimoine|fort|cité|ruine/.test(s)) return 'arch';
  if(/plage|mer|océan|baignade|lagune/.test(s)) return 'wave';
  if(/randonn|trek|sommet|montagne|marche/.test(s)) return 'peaks';
  if(/spa|massage|détente|bien-être|piscine/.test(s)) return 'droplet';
  if(/marché|souk|artisan/.test(s)) return 'camera';
  if(/jungle|forêt|nature|cascade/.test(s)) return 'leaf';
  if(/safari|animaux|faune/.test(s)) return 'leaf';
  return 'pin';
}

/* ── application du JSON → ITINERARY ────────────────────────────────── */
function applyGenerated(skel, daysDetail, hilites, flightInfo){
  const dest=skel.dest||state.destination||'Votre voyage';
  const level=['Éco','Confort','Luxe','Ultra'].includes(skel.level)?skel.level:(state.budget||'Confort');
  const dc=_clampInt(skel.days_count, 1, 60, buildBrief().daysCount);

  /* hébergements */
  const colFactor=_costOfLivingFactor(dest, skel.region, skel.country);
  const ACC_PRICE_RANGE_BASE={'Éco':[25,70],'Confort':[60,140],'Luxe':[150,400],'Ultra':[350,1100]};
  const baseAcc=ACC_PRICE_RANGE_BASE[level]||ACC_PRICE_RANGE_BASE['Confort'];
  const accRange=[Math.round(baseAcc[0]*colFactor), Math.round(baseAcc[1]*colFactor)];
  const stayTags=['Coup de cœur','Adresse rare','Signature Hic Sunt','Pépite locale','Écrin de sérénité'];
  const stayRates=['4,96','4,89','4,92','4,88','4,94'];
  const stays=(Array.isArray(skel.stays)?skel.stays:[]).slice(0,8).map(function(s,i){
    const rawPrice=Math.round(Number(s.price)||0);
    const midAcc=Math.round((accRange[0]+accRange[1])/2);
    let price;
    if(rawPrice>=accRange[0]&&rawPrice<=accRange[1]*1.3){
      price=rawPrice;
    } else {
      const tl=(s.type||'').toLowerCase();
      if(/villa|résidence|privée/.test(tl))            price=Math.round(accRange[1]*0.85);
      else if(/luxe|resort|palace/.test(tl))           price=Math.round(accRange[1]*0.75);
      else if(/lodge|boutique|charme|écolodge/.test(tl))price=Math.round(midAcc*1.15);
      else if(/guesthouse|maison d|homestay/.test(tl)) price=Math.round(accRange[0]*1.3);
      else if(/hostel|auberge/.test(tl))               price=accRange[0];
      else price=midAcc;
      const vary=[1,0.85,1.15,0.92,1.08,0.78,1.22,0.88][i]||1;
      price=Math.max(accRange[0],Math.min(accRange[1],Math.round(price*vary)));
    }
    return {
      id:'a'+(i+1), n:s.name||('Hébergement '+(i+1)), i:_stayIcon(s.type),
      type:s.type||'Hôtel-boutique', loc:s.loc||dest,
      tag:stayTags[i%stayTags.length]||'Sélection', rate:stayRates[i%stayRates.length]||'4,9',
      nights:_clampInt(s.nights,1,21,2), price:price,
      am:['bed','wifi',i%2?'fork':'pool'], blurb:s.blurb||'Une adresse d\'exception.',
    };
  });
  while(stays.length<1) stays.push({id:'a1',n:'Hébergement local',i:'bed',type:'Hôtel-boutique',loc:dest,tag:'Sélection',rate:'4,9',nights:2,price:accRange[0],am:['bed','wifi','pool'],blurb:''});

  const findStay=function(name){
    if(!name) return null;
    const k=String(name).toLowerCase().trim();
    return stays.find(function(s){return s.n.toLowerCase()===k;})
        ||stays.find(function(s){return s.n.toLowerCase().includes(k)||k.includes(s.n.toLowerCase());});
  };

  /* jours enrichis avec le détail éditorial + catégorie thématique */
  const detailDays=(daysDetail&&Array.isArray(daysDetail.days))?daysDetail.days:[];
  const plan=(Array.isArray(skel.plan)?skel.plan:[]).map(function(p,i){
    const dd=detailDays[i]||{};
    const rawMoments=Array.isArray(dd.moments)&&dd.moments.length?dd.moments:[{t:'—',k:_momentIcon(p.title),ti:p.title||'Étape',d:''}];
    const moments=rawMoments.slice(0,_momentsPerDay()).map(function(m){return [m.t||'—',_kind(m.k||_momentIcon(m.ti)),m.ti||'Moment',m.d||''];});
    const tags=[];
    moments.forEach(function(m){if(tags.length<2&&!tags.some(function(t){return t[0]===m[1];}))tags.push(TAG_MAP[m[1]]||TAG_MAP.pin);});
    while(tags.length<2) tags.push(TAG_MAP.pin);
    const stay=findStay(p.night);
    /* catégorie dominante du jour (hors transit) pour la coloration thématique */
    const catCounts={};
    moments.forEach(function(m){
      const cat=KIND_CATEGORY[m[1]]||'culture';
      if(cat==='transit') return;
      catCounts[cat]=(catCounts[cat]||0)+1;
    });
    let category='culture', best=0;
    Object.keys(catCounts).forEach(function(c){ if(catCounts[c]>best){ best=catCounts[c]; category=c; } });
    return {
      n:i+1, title:p.title||('Étape '+(i+1)), loc:p.loc||dest,
      desc:dd.desc||p.hook||'', tip:dd.tip||'',
      tags:tags, category:category,
      wx:[GEN_SKY.includes(p.sky)?p.sky:'sun', p.temp||'28°'],
      night:stay?{acc:stay.id}:{n:p.night||'Nuit sur place',loc:p.loc||dest},
      moments:moments,
      restaurant:dd.restaurant||null,
      wellness:dd.wellness||null,
    };
  });
  if(!plan.length) return false;

  /* budget — calibré sur le niveau de confort, la durée et le nb de voyageurs */
  const PPD_RANGE={'Éco':[60,100],'Confort':[120,220],'Luxe':[250,500],'Ultra':[500,900]};
  const ppd=PPD_RANGE[level]||PPD_RANGE['Confort'];
  const travelers=_clampInt(state.travelers,1,12,2);
  const minBudget=Math.round(ppd[0]*travelers*dc);
  const maxBudget=Math.round(ppd[1]*travelers*dc);
  const stayCost=stays.reduce(function(s,a){return s+a.price*a.nights;},0);
  /* prix de vol : on privilégie la recherche web fraîche si elle a renvoyé un résultat plausible,
     sinon on retombe sur la fourchette statique par zone */
  const staticFlight=_flightEstimate(dest, skel.region, skel.country, travelers);
  const flightFloor=(flightInfo&&flightInfo.amount>0)?flightInfo.amount:staticFlight;
  let budgetTotal=_clampInt(skel.budget, minBudget, maxBudget*1.15, Math.round((minBudget+maxBudget)/2));
  /* le budget doit au moins couvrir l'hébergement et une estimation réaliste des vols */
  const essentialFloor=stayCost+flightFloor;
  if(budgetTotal<essentialFloor) budgetTotal=Math.min(Math.round(essentialFloor*1.25), Math.max(maxBudget*1.15, essentialFloor*1.25));

  /* application */
  ITINERARY.plan.length=0; plan.forEach(function(p){ITINERARY.plan.push(p);});
  ITINERARY.accommodations.length=0; stays.forEach(function(s){ITINERARY.accommodations.push(s);});
  const themeName=_themeForDestination(dest, skel.region, skel.country);
  Object.assign(ITINERARY,{
    dest:dest, country:skel.country||'', tag:skel.tagline||'Itinéraire composé pour vous',
    dates:(function(){
      var raw=skel.dates||'Sur-mesure';
      var realN=plan.length;
      // Corriger le nombre de jours dans la string dates
      raw=raw.replace(/\d+\s*jours?/i, realN+' jours');
      return raw;
    })(), days:plan.length, level:level,
    budgetTotal:budgetTotal, coords:skel.coords||dest, distance:plan.length+' jours',
    region:skel.region||'', season:skel.season||'', generated:true,
    theme:themeName, palette:THEME_PALETTES[themeName],
    dateFrom:state.dateFrom||'', dateTo:state.dateTo||'',
    _flightInfo:flightInfo||null, /* préservé pour recalcul budget après modif IA */
  });

  /* highlights */
  if(hilites){
    ITINERARY.gems=hilites.gems||[];
    ITINERARY.highlights=hilites.highlights||{};
    ITINERARY.essentials=hilites.essentials||{};
    ITINERARY.budget_note=hilites.budget_note||'';
  }

  deriveActivities(plan);
  const finalBudgetTotal=deriveBudget(stays, budgetTotal, dest, skel.region, skel.country, travelers, flightInfo);
  if(finalBudgetTotal && finalBudgetTotal!==budgetTotal) ITINERARY.budgetTotal=finalBudgetTotal;
  if(typeof SEASON!=='undefined'&&skel.season){SEASON.best=skel.season;SEASON.note=skel.season;}
  return true;
}

/* ── activités & budget dérivés ─────────────────────────────────────── */
const ACT_PRICE={peaks:78,arch:55,leaf:62,wave:95,droplet:48,fork:120,sun:52,star:88,camera:60,ticket:70,moon:64,compass:58,pin:50,plane:0,bed:0};
const ACT_DUR=['2 h','3 h','4 h','2 h 30','5 h','3 h 30'];
function deriveActivities(plan){
  if(typeof ACTIVITIES==='undefined') return;
  try{
    const picks=[];
    (Array.isArray(plan)?plan:[]).forEach(function(p){
      (Array.isArray(p.moments)?p.moments:[]).forEach(function(m){
        /* exclure les transferts/déplacements : ce ne sont pas de vraies activités réservables */
        if(m[1]==='plane'||m[1]==='bed'||m[1]==='compass') return;
        picks.push({day:p.n,i:m[1],n:m[2],loc:p.loc,tag:(TAG_MAP[m[1]]||TAG_MAP.pin)[1]});
      });
    });
    ACTIVITIES.length=0;
    picks.forEach(function(a,i){
      const base=ACT_PRICE[a.i]||55;
      ACTIVITIES.push({id:'ac'+(i+1),day:a.day,i:a.i,n:a.n,loc:a.loc,dur:ACT_DUR[i%ACT_DUR.length],rate:['4,9','4,95','4,8','4,88','4,92','4,97'][i%6],price:base+(i%2?7:0),tag:a.tag});
    });
    window._actSource = 'deriveActivities-ok (' + picks.length + ' picks bruts)';
  }catch(e){
    window._actSource = 'deriveActivities-ERREUR: ' + (e&&e.message?e.message:String(e));
    /* on vide quand même la fixture par défaut plutôt que de laisser le Sri Lanka affiché */
    ACTIVITIES.length=0;
  }
}
function deriveBudget(stays, total, dest, region, country, travelers, flightInfo){
  if(typeof BUDGET==='undefined') return;
  total=Number(total)||0;
  travelers=Math.max(1,Number(travelers)||1);
  const stayCost=stays.reduce(function(s,a){return s+(Number(a.price)||0)*(Number(a.nights)||0);},0);
  const nights=stays.reduce(function(s,a){return s+(Number(a.nights)||0);},0);
  const days=Math.max(1,nights);
  const nbAct=(typeof ACTIVITIES!=='undefined')?ACTIVITIES.length:0;
  const colFactor=Number(_costOfLivingFactor(dest, region, country))||1;

  /* plancher réaliste de restauration : ~30€/jour/pers en demi-pension en zone
     "Europe de l'Ouest" (colFactor=1), ajusté au coût de vie réel de la destination.
     C'est un MINIMUM absolu, pas une estimation — en dessous, le budget affiché
     serait simplement faux (ex: 107€ pour une semaine en Sardaigne est intenable). */
  const FOOD_PER_DAY_PER_PERSON=30;
  const foodFloor=Math.round(FOOD_PER_DAY_PER_PERSON*colFactor*travelers*days);
  /* plancher de transferts locaux : ~8€/jour/pers (taxis, locations, essence) */
  const TRANSFER_PER_DAY_PER_PERSON=8;
  const transferFloor=Math.round(TRANSFER_PER_DAY_PER_PERSON*colFactor*travelers*days);

  /* hébergement = coût réel, plafonné pour laisser de la place aux autres postes */
  const accom=Math.min(stayCost, Math.round(total*0.55));
  const remainder=total-accom;
  /* vols = prix issu d'une recherche web fraîche si disponible et plausible (et
     numériquement valide — on se méfie d'une réponse IA mal formée),
     sinon fourchette statique par zone — plafonné à ce que le budget restant peut absorber */
  const flightAmountNum=flightInfo?Number(flightInfo.amount):NaN;
  const hasRealFlight=isFinite(flightAmountNum)&&flightAmountNum>0&&flightAmountNum<20000;
  const flightsRaw=hasRealFlight?flightAmountNum:(Number(_flightEstimate(dest, region, country, travelers))||0);
  const flights=Math.min(flightsRaw, Math.max(0,Math.round(remainder*0.65)));
  let afterFlights=remainder-flights;

  /* si ce qui reste ne couvre même pas les planchers repas+transferts, le budget total
     affiché était sous-évalué pour ce voyage : on relève le total plutôt que d'afficher
     des montants irréalistes (ex: 107€ de repas pour une semaine) */
  const essentialAfterFlights=foodFloor+transferFloor;
  if(afterFlights<essentialAfterFlights){
    const gap=essentialAfterFlights-afterFlights;
    total+=gap;
    afterFlights=essentialAfterFlights;
  }
  /* le reste au-delà des planchers repas/transferts va aux activités */
  const food=foodFloor;
  const transfers=transferFloor;
  const activities=Math.max(0,afterFlights-food-transfers);
  const flightSub=(state.origin||'Paris')+' · aller-retour · '+travelerLabel()+(hasRealFlight&&flightInfo.source?' · estimation '+flightInfo.source:' · estimation')

  BUDGET.total=total; BUDGET.spent=0;
  BUDGET.lines=[
    {i:'bed',n:'Hébergements',sub:nights+' nuit'+(nights>1?'s':'')+' · '+stays.length+' adresse'+(stays.length>1?'s':''),amount:accom,paid:false},
    {i:'plane',n:'Vols',sub:flightSub,amount:flights,paid:false},
    {i:'ticket',n:'Activités & expériences',sub:nbAct+' suggérée'+(nbAct>1?'s':''),amount:activities,paid:false},
    {i:'fork',n:'Restauration',sub:'Estimation · demi-pension',amount:food,paid:false},
    {i:'compass',n:'Transferts & transport local',sub:'Selon votre circuit',amount:Math.max(0,transfers),paid:false},
  ];
  return total;
}

/* ── 3 passes de génération ─────────────────────────────────────────── */
const DAYS_BATCH_SIZE = 7;
/* ── Mode "Surprenez-moi" : suggestion légère avant génération complète ── */
function buildDestinationSuggestPrompt(excluded){
  const b=buildBrief();
  const directives=[_antiTouristDirective(),_interestsDirective(),_rythmeDirective(),_occasionDirective(),_styleDirective(),_dreamDirective()].filter(Boolean);
  const excludeLine=(excluded&&excluded.length)?('Ne propose AUCUNE des destinations déjà suggérées et refusées : '+excluded.join(', ')+'.'):'';
  return [
    'Tu es le cartographe senior de Hic Sunt, maison de voyages haut de gamme spécialisée dans les destinations hors des sentiers battus.',
    'Propose UNE SEULE destination (pays ou région), la plus désirable et la plus adaptée à ce profil.',
    '',
    '═══ BRIEF CLIENT ═══',
    b.lines,
    '',
    '═══ DIRECTIVES ═══',
    directives.length?directives.join('\n'):'Aucune contrainte spécifique au-delà du brief ci-dessus.',
    excludeLine,
    '',
    'Réponds UNIQUEMENT en JSON compact valide :',
    '{"dest":"nom du pays/région","country":"pays","tagline":"phrase poétique évocatrice (max 12 mots)","teaser":"2 phrases qui donnent envie, en lien avec le brief (max 35 mots)","coords":"ex: 6°55′N · 79°51′E"}',
  ].join('\n');
}
async function suggestDestination(excluded){
  return await _completeJSON(buildDestinationSuggestPrompt(excluded));
}

/* ── recherche web du prix de vol (appel séparé, avec fallback statique) ── */
function buildFlightSearchPrompt(dest, country, dateFrom, dateTo, travelers){
  const origin = state.origin || 'Paris';
  const period = (dateFrom && dateTo) ? ('autour des dates '+dateFrom+' au '+dateTo) : 'pour les prochains mois';
  return [
    'Cherche sur le web une fourchette de prix réaliste et actuelle pour un vol aller-retour en classe économique de '+origin+' vers '+(dest||'')+' ('+(country||'')+'), '+period+'.',
    'Base-toi sur des comparateurs de vols fiables (Google Flights, Kayak, Skyscanner, sites de compagnies aériennes).',
    'Réponds UNIQUEMENT en JSON compact, sans texte ni markdown autour, au format exact :',
    '{"perPersonMin":0,"perPersonMax":0,"source":"nom du comparateur utilisé"}',
    'Les deux valeurs sont en euros, par personne, aller-retour. Si tu ne trouves rien de fiable, réponds {"perPersonMin":0,"perPersonMax":0,"source":""}.',
  ].join('\n');
}
async function _fetchFlightPriceFromWeb(dest, country, dateFrom, dateTo, travelers){
  try{
    const prompt = buildFlightSearchPrompt(dest, country, dateFrom, dateTo, travelers);
    const res = await fetch(SUPABASE_ENDPOINT,{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({prompt:prompt, webSearch:true})
    });
    if(!res.ok) return null;
    const data = await res.json();
    if(data.error) return null;
    const j = parseItineraryJSON(data.result||'');
    if(!j || !j.perPersonMin || !j.perPersonMax) return null;
    const perPerson = Math.round((j.perPersonMin+j.perPersonMax)/2);
    if(!isFinite(perPerson) || perPerson<=0) return null;
    return { amount: perPerson*Math.max(1,travelers||1), source: j.source||'' };
  }catch(e){ return null; }
}

/* ── recherche web de VRAIS hébergements par zone (anti-hallucination) ── */
function buildStaySearchPrompt(dest, zones, level){
  const lvl = (level||'Confort');
  const lvlGuide = lvl.indexOf('Éco')>=0?'auberges, guesthouses, agriturismi simples'
    : (lvl.indexOf('Luxe')>=0||lvl.indexOf('Ultra')>=0)?'hôtels 4-5 étoiles, Relais & Châteaux, villas de luxe, boutique-hôtels haut de gamme'
    : 'boutique-hôtels, agriturismi de charme, maisons d\'hôtes 3-4 étoiles';
  return [
    'Cherche sur le web des hébergements RÉELS et ACTUELLEMENT EN ACTIVITÉ pour un séjour à '+(dest||'')+'.',
    'Pour chacune de ces zones, trouve 1 hébergement réel et vérifiable ('+lvlGuide+') :',
    zones.map(function(z,i){return (i+1)+'. '+z;}).join('\n'),
    '',
    'EXIGENCES STRICTES :',
    '- Uniquement des établissements qui EXISTENT VRAIMENT (vérifiables sur Booking, Google Maps, ou leur site officiel).',
    '- Nom EXACT tel qu il apparait en ligne. Aucune invention, aucune approximation.',
    '- Si tu n es pas certain qu un établissement existe dans une zone, mets "name":"" pour cette zone.',
    '- Prix indicatif par nuit réaliste en euros pour 2 personnes.',
    '',
    'Réponds UNIQUEMENT en JSON compact valide, sans texte autour :',
    '{"stays":[{"zone":"nom de la zone","name":"nom exact reel","type":"type/standing","price":0,"blurb":"description courte basee sur des infos reelles"}]}',
  ].join('\n');
}
async function _fetchRealStays(dest, zones, level){
  for(var attempt=0; attempt<2; attempt++){
    if(attempt>0){ await new Promise(function(r){ setTimeout(r, 1500); }); }
    try{
      const res = await fetch(SUPABASE_ENDPOINT,{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({prompt:buildStaySearchPrompt(dest, zones, level), webSearch:true})
      });
      if(!res.ok) continue;
      const data = await res.json();
      if(data.error) continue;
      const raw = data.result || '';
      if(!raw) continue;
      let j = parseItineraryJSON(raw);
      if(!j || !Array.isArray(j.stays)){
        const m = raw.match(/\{[^]*"stays"[^]*\}/);
        if(m){ try{ j = JSON.parse(m[0]); }catch(e){} }
      }
      if(!j || !Array.isArray(j.stays)) continue;
      return j.stays.filter(function(s){ return s.name && s.name.trim(); });
    }catch(e){}
  }
  return null;
}

/* ── recherche web de VRAIS restaurants par lieu (anti-hallucination) ── */
function buildRestoSearchPrompt(dest, places, level){
  const lvl=(level||'Confort');
  const guide = lvl.indexOf('Éco')>=0?'trattorias familiales, tables locales authentiques, bon rapport qualité-prix'
    : (lvl.indexOf('Luxe')>=0||lvl.indexOf('Ultra')>=0)?'tables gastronomiques, restaurants étoilés ou réputés, chefs reconnus'
    : 'bonnes tables locales, cuisine régionale soignée, adresses appréciées';
  return [
    'Cherche sur le web de VRAIS restaurants actuellement en activité à '+(dest||'')+'.',
    'Pour chacun de ces lieux/étapes, trouve 1 restaurant réel et vérifiable ('+guide+') :',
    places.map(function(p,i){return (i+1)+'. '+p;}).join('\n'),
    '',
    'EXIGENCES STRICTES :',
    '- Uniquement des restaurants qui EXISTENT VRAIMENT (vérifiables sur Google Maps, TheFork, TripAdvisor).',
    '- Nom EXACT tel qu il apparait en ligne. Aucune invention.',
    '- Si tu n es pas certain pour un lieu, mets "name":"" pour ce lieu.',
    '- Indique une spécialité réelle et une fourchette de prix (€, €€, €€€).',
    '',
    'Réponds UNIQUEMENT en JSON compact valide, sans texte autour :',
    '{"restos":[{"place":"nom du lieu","name":"nom exact reel","type":"specialite/cuisine","price":"€€","note":"detail reel court","review":"ce qui rend ce lieu special"}]}',
  ].join('\n');
}
async function _fetchRealRestos(dest, places, level){
  /* 2 tentatives : la recherche web échoue parfois (rate limit/timeout transitoire) */
  for(var attempt=0; attempt<2; attempt++){
    if(attempt>0){ await new Promise(function(r){ setTimeout(r, 1500); }); }
    try{
      const res = await fetch(SUPABASE_ENDPOINT,{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({prompt:buildRestoSearchPrompt(dest, places, level), webSearch:true})
      });
      if(!res.ok){ window._restoErr='HTTP '+res.status+(attempt?' (2e essai)':''); continue; }
      const data = await res.json();
      if(data.error){ window._restoErr=String(data.error).slice(0,120); continue; }
      const raw = data.result || '';
      if(!raw){ window._restoErr='réponse vide'; continue; }
      let j = parseItineraryJSON(raw);
      if(!j || !Array.isArray(j.restos)){
        const m = raw.match(/\{[^]*"restos"[^]*\}/);
        if(m){ try{ j = JSON.parse(m[0]); }catch(e){} }
      }
      if(!j || !Array.isArray(j.restos)){ window._restoErr='JSON sans restos'; continue; }
      window._restoErr=null;
      return j.restos;
    }catch(e){ window._restoErr='exception: '+(e&&e.message||e); }
  }
  return null;
}

/* ── validation : la destination renvoyee correspond-elle a celle demandee ? ──
   Comparaison volontairement souple (accents/casse ignorés, sous-chaîne dans
   un sens ou l'autre) car le client peut taper "Sardaigne" et l'IA répondre
   "Sardaigne, Italie" ou l'inverse — ce n'est pas une erreur. ── */
function _normDest(s){
  return (s||'').toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function _destinationMatches(requested, gotDest, gotCountry){
  const req=_normDest(requested);
  if(!req) return true;
  const got=_normDest((gotDest||'')+' '+(gotCountry||''));
  if(!got) return false;
  if(got.indexOf(req)!==-1 || req.indexOf(got)!==-1) return true;
  /* comparaison mot à mot : si un mot significatif du nom demandé (4+ lettres) apparaît, on accepte */
  const reqWords=req.split(' ').filter(function(w){return w.length>=4;});
  if(!reqWords.length) return got.indexOf(req)!==-1;
  return reqWords.some(function(w){return got.indexOf(w)!==-1;});
}

/* ── orchestration des 3 passes (ossature, jours, highlights) ─────────── */
async function callCartographe(){
  const b=buildBrief();
  const dc=b.daysCount;

  /* Passe 1 — ossature, par lots de 7 jours pour les longs voyages */
  let skel=null;
  for(let offset=0; offset<dc; offset+=SKEL_BATCH_SIZE){
    let batchResult=await _completeJSON(buildSkeletonPrompt(dc, SKEL_BATCH_SIZE, offset));
    if(offset===0){
      skel=batchResult;
      if(!skel||!Array.isArray(skel.plan)||!skel.plan.length) return null;
      /* garde-fou : si une destination précise a été demandée, vérifie qu'elle a été respectée */
      if(state.destination && !_destinationMatches(state.destination, skel.dest, skel.country)){
        const retryResult=await _completeJSON(buildSkeletonPrompt(dc, SKEL_BATCH_SIZE, offset));
        if(retryResult && Array.isArray(retryResult.plan) && retryResult.plan.length && _destinationMatches(state.destination, retryResult.dest, retryResult.country)){
          skel=retryResult;
        } else if(retryResult && Array.isArray(retryResult.plan) && retryResult.plan.length){
          /* la 2e tentative a échoué aussi sur la destination — on force quand même
             le nom demandé par le client plutôt que d'afficher une destination différente */
          skel=retryResult;
          skel.dest=state.destination;
        } else {
          skel.dest=state.destination;
        }
      }
      state._genStays=skel.stays||[];
      state._genLastSteps=skel.plan.slice(-2); /* contexte pour batches suivants */
    } else {
      const morePlan=(batchResult&&Array.isArray(batchResult.plan))?batchResult.plan:[];
      skel.plan=skel.plan.concat(morePlan);
      state._genLastSteps=skel.plan.slice(-2);
    }
  }
  /* sécurité : si la génération par lots n'atteint pas dc, on tronque proprement */
  if(skel.plan.length>dc) skel.plan=skel.plan.slice(0,dc);
  skel.days_count=skel.plan.length;

  /* recherche web du prix de vol — lancée en parallèle, dès que la destination est connue */
  const flightPromise=_fetchFlightPriceFromWeb(skel.dest, skel.country, state.dateFrom, state.dateTo, state.travelers);

  /* recherche web de VRAIS hébergements — remplace les noms potentiellement inventés */
  if(Array.isArray(skel.stays) && skel.stays.length){
    const zones = skel.stays.map(function(s){ return s.loc || s.zone || skel.dest; });
    const realStays = await _fetchRealStays(skel.dest, zones, skel.level);
    if(realStays && realStays.length){
      /* remplacer chaque hébergement par le vrai trouvé pour la même zone (ordre) */
      skel.stays = skel.stays.map(function(orig, i){
        const real = realStays[i];
        /* Valider que le nom réel est exploitable : non vide, pas un simple nombre,
           au moins 3 caractères. Sinon on garde l'original. */
        const validName = real && real.name && typeof real.name === 'string'
          && real.name.trim().length >= 3
          && !/^\d+$/.test(real.name.trim());
        if(validName){
          return {
            name: real.name.trim(),
            type: real.type || orig.type,
            loc: orig.loc || real.zone,
            price: (typeof real.price==='number' && real.price>0) ? real.price : orig.price,
            nights: orig.nights,
            blurb: (real.blurb && real.blurb.length>5) ? real.blurb : orig.blurb,
          };
        }
        return orig; /* garder l'original si pas de vrai nom valide */
      });
      /* mettre à jour les "night" du plan pour pointer vers les nouveaux noms */
      const nameMap = {};
      (state._genStays||[]).forEach(function(old, i){
        if(skel.stays[i]) nameMap[old.name] = skel.stays[i].name;
      });
      skel.plan.forEach(function(p){
        if(p && p.night && nameMap[p.night]) p.night = nameMap[p.night];
      });
      state._genStays = skel.stays;
    }
  }

  /* Passe 2 — détail éditorial des jours, par lots de 7 pour les longs voyages */
  const allDays=[];
  for(let offset=0; offset<skel.plan.length; offset+=DAYS_BATCH_SIZE){
    const batch=skel.plan.slice(offset, offset+DAYS_BATCH_SIZE);
    const batchResult=await _completeJSON(buildDaysPrompt(skel, batch, offset));
    const batchDays=(batchResult&&Array.isArray(batchResult.days))?batchResult.days:[];
    for(let i=0;i<batch.length;i++){ allDays.push(batchDays[i]||null); }
  }
  const daysDetail={days:allDays};

  /* Passe 2.5 — vérification web des restaurants (anti-hallucination, premium) */
  try{
    const restoIdx=[]; const places=[];
    allDays.forEach(function(dd, i){
      if(dd && dd.restaurant && dd.restaurant.name){
        const place = (skel.plan[i] && skel.plan[i].loc) || skel.dest;
        restoIdx.push(i); places.push(place);
      }
    });
    if(places.length){
      const realRestos = await _fetchRealRestos(skel.dest, places, skel.level);
      if(realRestos && realRestos.length){
        /* normaliser pour matcher par lieu */
        var norm=function(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();};
        var used={};
        restoIdx.forEach(function(dayI, k){
          var place = places[k];
          /* 1) chercher un resto dont le "place" correspond au lieu, non déjà utilisé */
          var real = null;
          for(var m=0;m<realRestos.length;m++){
            if(used[m]) continue;
            var rp = norm(realRestos[m].place);
            if(rp && (rp===norm(place) || rp.indexOf(norm(place))>=0 || norm(place).indexOf(rp)>=0)){
              real = realRestos[m]; used[m]=true; break;
            }
          }
          /* 2) fallback : même index si pas de match par lieu */
          if(!real && realRestos[k] && !used[k]){ real = realRestos[k]; used[k]=true; }
          var validName = real && real.name && typeof real.name==='string'
            && real.name.trim().length>=3 && !/^\d+$/.test(real.name.trim());
          if(validName && allDays[dayI] && allDays[dayI].restaurant){
            var r = allDays[dayI].restaurant;
            r.name = real.name.trim();
            if(real.type) r.type = real.type;
            if(real.price) r.price = real.price;
            if(real.note && real.note.length>4) r.note = real.note;
            if(real.review && real.review.length>4) r.review = real.review;
          }
        });
      }
    }
  }catch(e){ console.warn('[restos] exception', e); }

  /* Passe 3 — adresses, gems, highlights */
  const hilites=await _completeJSON(buildHighlightsPrompt(skel, daysDetail));

  /* le prix du vol a eu tout ce temps pour revenir ; sinon on retombe sur l'estimation statique */
  let flightInfo=null;
  try{ flightInfo=await flightPromise; }catch(e){ flightInfo=null; }

  return {skel:skel, days:daysDetail, hilites:hilites, flightInfo:flightInfo};
}

/* ── flux de génération ─────────────────────────────────────────────── */
async function runGeneration(){
  if(state.createTab==='surprise' && !state.destination){
    await runDestinationSuggestion([]);
    return;
  }
  await runFullGeneration();
}

/* ── Étape 1 (mode Surprenez-moi) : suggestion de destination ────────── */
async function runDestinationSuggestion(excluded){
  const el=openOverlay('generating',generationView(),{modal:true,carto:true});
  const gen=el.querySelector('.gen');
  requestAnimationFrame(function(){gen.classList.add('run');});
  const statusEl=el.querySelector('[data-gen-status]');
  if(statusEl) statusEl.textContent='Lecture de vos envies…';
  const minShow=new Promise(function(r){setTimeout(r,1400);});
  let suggestion=null;
  try{const res=await Promise.all([suggestDestination(excluded),minShow]);suggestion=res[0];}catch(e){await minShow;}
  if(!suggestion||!suggestion.dest){
    toast('Connexion limitée — réessayez');
    closeOverlay();
    return;
  }
  state._suggested=suggestion;
  state._suggestedExcluded=excluded;
  gen.classList.remove('run');
  setTimeout(function(){
    gen.outerHTML = destinationSuggestView(suggestion);
    const newGen=el.querySelector('.gen');
    requestAnimationFrame(function(){requestAnimationFrame(function(){newGen.classList.add('run');});});
  },280);
}
async function retrySuggestion(){
  const excluded=(state._suggestedExcluded||[]).concat(state._suggested?[state._suggested.dest]:[]);
  await runDestinationSuggestion(excluded);
}
async function confirmSuggestedDestination(){
  const s=state._suggested;
  if(!s) return;
  state.destination=s.dest;
  state._suggestedTagline=s.tagline||'';
  const el=document.querySelector('.ov[data-ov="generating"] .gen');
  if(el){
    el.classList.remove('run');
    setTimeout(function(){
      el.outerHTML = generationView();
      const newGen=document.querySelector('.ov[data-ov="generating"] .gen');
      requestAnimationFrame(function(){requestAnimationFrame(function(){newGen.classList.add('run');});});
      runFullGeneration(true);
    },280);
  } else {
    runFullGeneration(true);
  }
}

/* ── Étape 2 : génération complète de l'itinéraire ────────────────────── */
async function runFullGeneration(overlayAlreadyOpen){
  const el = overlayAlreadyOpen
    ? document.querySelector('.ov[data-ov="generating"]')
    : openOverlay('generating',generationView(),{modal:true,carto:true});
  const gen=el.querySelector('.gen');
  if(!overlayAlreadyOpen) requestAnimationFrame(function(){gen.classList.add('run');});
  const statusEl=el.querySelector('[data-gen-status]');

  /* ── Barre de progression basée sur le temps réel ──
     Durée moyenne mesurée : ~15s (3 passes API + traitement)
     On progresse de façon continue avec ralentissement vers 90%
     pour toujours attendre la vraie fin avant d'afficher 100%  ── */
  const EST_DURATION = 16000; /* ms — durée estimée totale */
  const startTime = Date.now();
  let currentPct = 0;
  let rafId = null;
  let done = false;

  const PHASES = [
    { until: 0.08, label: 'Lecture de vos envies…' },
    { until: 0.20, label: 'Composition du circuit…' },
    { until: 0.38, label: "Tracé de l'itinéraire…" },
    { until: 0.52, label: 'Rédaction des étapes…' },
    { until: 0.65, label: 'Sélection des hébergements…' },
    { until: 0.76, label: 'Recherche des pépites cachées…' },
    { until: 0.86, label: 'Estimation du budget…' },
    { until: 0.93, label: 'Derniers ajustements…' },
    { until: 1.00, label: 'Finalisation…' },
  ];

  function getLabel(pct){
    const p = pct / 100;
    for(var i=0;i<PHASES.length;i++){
      if(p <= PHASES[i].until) return PHASES[i].label;
    }
    return PHASES[PHASES.length-1].label;
  }

  let lastLabel = '';
  function tick(){
    if(done) return;
    const elapsed = Date.now() - startTime;
    /* Courbe easing : progresse vite au début, ralentit vers 90% */
    const linear = Math.min(elapsed / EST_DURATION, 1);
    /* Fonction : rapide→90% en ~70% du temps, puis très lent jusqu'à 93% */
    let target;
    if(linear < 0.70) target = (linear / 0.70) * 90;
    else target = 90 + ((linear - 0.70) / 0.30) * 3; /* max 93% tant que pas fini */

    /* Progression fluide — jamais en arrière */
    if(target > currentPct) currentPct = Math.min(target, 93);

    const barI = el.querySelector('[data-gen-bar]');
    const barPct = el.querySelector('[data-gen-pct]');
    const timeLeft = el.querySelector('[data-gen-time]');

    if(barI) barI.style.width = currentPct.toFixed(1) + '%';
    if(barPct) barPct.textContent = Math.round(currentPct) + '%';

    /* Temps restant estimé */
    if(timeLeft){
      const remaining = Math.max(0, EST_DURATION - elapsed);
      const secs = Math.ceil(remaining / 1000);
      timeLeft.textContent = currentPct >= 90 ? 'Finalisation…' : secs + 's';
    }

    /* Label — mise à jour fluide sans flash */
    const newLabel = getLabel(currentPct);
    if(newLabel !== lastLabel){
      lastLabel = newLabel;
      if(statusEl){
        statusEl.style.opacity=0;
        setTimeout(function(){ if(!done){ statusEl.textContent=newLabel; statusEl.style.opacity=1; } },180);
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  /* Initialisation */
  if(statusEl){ statusEl.textContent='Lecture de vos envies…'; statusEl.style.opacity=1; }
  const barI0=el.querySelector('[data-gen-bar]');
  if(barI0){ barI0.style.transition='none'; barI0.style.width='2%'; }
  rafId = requestAnimationFrame(tick);

  const minShow=new Promise(function(r){setTimeout(r,2200);});
  let result=null;
  try{const res=await Promise.all([callCartographe(),minShow]);result=res[0];}catch(e){await minShow;}

  /* Fin réelle — compléter à 100% */
  done = true;
  if(rafId) cancelAnimationFrame(rafId);

  const barI=el.querySelector('[data-gen-bar]');
  const barPct=el.querySelector('[data-gen-pct]');
  const timeLeft=el.querySelector('[data-gen-time]');
  if(barI){ barI.style.transition='width 0.6s cubic-bezier(0.4,0,0.2,1)'; barI.style.width='100%'; }
  if(barPct) barPct.textContent='100%';
  if(timeLeft) timeLeft.textContent='';
  if(statusEl){statusEl.style.opacity=0;setTimeout(function(){statusEl.textContent='Votre voyage est prêt ✦';statusEl.style.opacity=1;},250);}

  let ok=false;
  if(result){try{ok=applyGenerated(result.skel,result.days,result.hilites,result.flightInfo);}catch(e){ok=false;}}
  if(!ok) toast('Connexion limitée — itinéraire de démonstration');

  /* ── PAYWALL ── Vérifier si l'utilisateur a déjà payé ou a un code ── */
  setTimeout(function(){
    const days = (ITINERARY.plan&&ITINERARY.plan.length) ? ITINERARY.plan.length : (ITINERARY.days || 0);
    const alreadyPaid = _checkPaymentToken(ITINERARY.dest, days);

    if(alreadyPaid){
      /* Déjà payé — ouvrir directement */
      _openItineraryAndSave();
    } else {
      /* Afficher le paywall */
      _showPaywall(el, days);
    }
  },620);
}

/* ── Paliers tarifaires ── */
const STRIPE_LINKS = {
  escapade: 'https://buy.stripe.com/5kQfZi3eIfDB8RTepE5EY03', /* 1-7j : 4,99€ */
  voyage:   'https://buy.stripe.com/eVq7sM9D69fd9VX6Xc5EY04', /* 8-14j : 9,99€ */
  expedition:'https://buy.stripe.com/fZucN6cPidvt0ln4P45EY05', /* 15+j : 17,99€ */
};
const STRIPE_PRICES = { escapade:'4,99€', voyage:'9,99€', expedition:'17,99€' };
const STRIPE_LABELS = { escapade:'Escapade', voyage:'Voyage', expedition:'Expédition' };

function _getPalier(days){
  if(days <= 7)  return 'escapade';
  if(days <= 14) return 'voyage';
  return 'expedition';
}

/* ── Vérification du token de paiement (localStorage) ── */
function _checkPaymentToken(dest, days){
  /* Seule exemption : email propriétaire (insensible à la casse) */
  const email = (localStorage.getItem('hs_email')||'').toLowerCase().trim();
  if(email==='charlottegperret@gmail.com') return true;

  /* Token Stripe valide 48h */
  const paid=JSON.parse(localStorage.getItem('hs_paid_tokens')||'[]');
  const palier=_getPalier(days), now=Date.now();
  return paid.some(function(t){
    return t.palier===palier
      && (t.dest===''||t.dest===dest)
      && (now-t.ts)<48*3600*1000;
  });
}

function _grantPayment(dest, days){
  const palier = _getPalier(days);
  const paid = JSON.parse(localStorage.getItem('hs_paid_tokens') || '[]');
  paid.push({ palier:palier, dest:dest, ts:Date.now() });
  /* Garder seulement les 20 derniers tokens */
  if(paid.length > 20) paid.splice(0, paid.length - 20);
  localStorage.setItem('hs_paid_tokens', JSON.stringify(paid));
}

function _openItineraryAndSave(){
  openItinerary();
  saveItinerary();
  state.deckIndex=0;
  state._suggested=null; state._suggestedExcluded=null;
  if(typeof initDeck==='function') initDeck();
  setTimeout(function(){
    const gi=ovStack.findIndex(function(o){return o.dataset.ov==='generating';});
    if(gi>=0){const g=ovStack.splice(gi,1)[0];g.remove();}
  },460);
}

function _showPaywall(genEl, days){
  const palier = _getPalier(days);
  const price = STRIPE_PRICES[palier];
  const label = STRIPE_LABELS[palier];
  const it = ITINERARY;

  /* Construire l'URL Stripe avec pré-remplissage */
  const userId = (typeof USER !== 'undefined' && USER.full) ? USER.full : '';
  const userEmail = localStorage.getItem('hs_email') || '';
  let stripeUrl = STRIPE_LINKS[palier];
  const params = [];
  if(userEmail) params.push('prefilled_email='+encodeURIComponent(userEmail));
  /* client_reference_id pour identifier le paiement côté Stripe */
  const refId = 'hs_'+(Date.now().toString(36))+'_'+palier;
  params.push('client_reference_id='+refId);
  if(params.length) stripeUrl += '?' + params.join('&');

  /* Stocker le refId pour vérification au retour */
  localStorage.setItem('hs_pending_ref', JSON.stringify({refId:refId, dest:it.dest, days:days, palier:palier, ts:Date.now()}));

  /* Preview — J1 visible, reste flou */
  const previewDay = (it.plan && it.plan[0]) ? it.plan[0] : null;
  const previewHtml = previewDay
    ? '<div style="padding:16px 20px;border-bottom:1px solid var(--line)">'
      + '<div style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--sub);margin-bottom:6px">Jour 01 · Aperçu</div>'
      + '<div style="font-size:16px;font-weight:500;color:var(--ink);margin-bottom:4px">'+esc(previewDay.title||'')+'</div>'
      + '<div style="font-family:var(--mono);font-size:10px;color:var(--sub);text-transform:uppercase;letter-spacing:0.8px">'+esc(previewDay.loc||'')+'</div>'
      + '</div>'
      + '<div style="padding:12px 20px;filter:blur(4px);opacity:0.5;pointer-events:none;user-select:none">'
      + '<div style="height:14px;background:var(--line2);border-radius:4px;margin-bottom:8px;width:80%"></div>'
      + '<div style="height:14px;background:var(--line2);border-radius:4px;margin-bottom:8px;width:60%"></div>'
      + '<div style="height:14px;background:var(--line2);border-radius:4px;width:70%"></div>'
      + '</div>'
    : '';

  const accent = (it.palette && it.palette.beach) || '#3A9EC9';

  /* Overlay paywall */
  const pw = document.createElement('div');
  pw.style.cssText = 'position:fixed;inset:0;z-index:9998;display:flex;flex-direction:column;background:var(--bg)';
  pw.setAttribute('data-paywall','');

  pw.innerHTML = '<div style="flex:1;overflow-y:auto;padding-bottom:180px">'
    /* Hero */
    + '<div style="padding:calc(20px + env(safe-area-inset-top,0px)) 20px 0">'
    + '<span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:'+accent+'">Itinéraire composé · '+esc(it.dest||'')+'</span>'
    + '<h1 style="font-family:var(--serif);font-weight:600;font-size:32px;letter-spacing:-0.5px;margin-top:8px;margin-bottom:4px">'+esc(it.dest||'')+'</h1>'
    + '<p style="font-family:var(--serif);font-style:italic;font-size:15px;color:var(--sub);line-height:1.5">'+esc(it.tag||'')+'</p>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">'
    + '<span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;padding:6px 12px;border-radius:20px;border:1px solid '+hexA(accent,0.3)+';color:'+accent+';background:'+hexA(accent,0.07)+'">'+esc(it.dates||'')+'</span>'
    + '<span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;padding:6px 12px;border-radius:20px;border:1px solid var(--line);color:var(--sub)">'+days+' jours</span>'
    + '<span style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;padding:6px 12px;border-radius:20px;border:1px solid var(--line);color:var(--sub)">'+esc(it.level||'')+'</span>'
    + '</div></div>'
    /* Aperçu J1 + flou */
    + '<div style="margin:20px;border-radius:16px;border:1px solid var(--line);background:var(--surface);overflow:hidden">'
    + previewHtml
    + '<div style="padding:16px 20px;background:'+hexA(accent,0.04)+';border-top:1px solid var(--line)">'
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'
    + '<span style="font-size:16px">✦</span>'
    + '<span style="font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:'+accent+'">'+days+' jours d\'itinéraire complet</span>'
    + '</div>'
    + '<p style="font-size:13px;color:var(--sub);line-height:1.5;margin:0">Activités, hébergements, restaurants secrets, pépites locales et budget détaillé — tout est prêt.</p>'
    + '</div></div>'
    /* Stats */
    + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:0 20px 20px">'
    + _pwStat(days+' jours','planifiés')
    + _pwStat((it.accommodations||[]).length+' héberg.','sélectionnés')
    + _pwStat(((it.gems||[]).length||'6')+' pépites','cachées')
    + '</div>'
    + '</div>'
    /* Footer */
    + '<div id="pw-footer" style="position:absolute;bottom:0;left:0;right:0;padding:20px;padding-bottom:calc(20px + env(safe-area-inset-bottom,0px));background:linear-gradient(to top, var(--bg) 85%, transparent)">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">'
    + '<div>'
    + '<div style="font-family:var(--serif);font-weight:600;font-size:26px;letter-spacing:-0.5px">'+price+'</div>'
    + '<div style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--sub)">Itinéraire '+label+' · accès définitif</div>'
    + '</div>'
    + '<button id="pw-close" style="width:36px;height:36px;border-radius:50%;background:var(--surface);border:1px solid var(--line);color:var(--sub);font-size:14px;cursor:pointer;-webkit-tap-highlight-color:transparent">✕</button>'
    + '</div>'
    + '<a id="pw-pay" href="'+stripeUrl+'" target="_blank" rel="noopener" style="display:block;width:100%;padding:16px;background:var(--ink);color:var(--bg);border:none;border-radius:16px;font-family:var(--sans);font-size:16px;font-weight:600;text-align:center;text-decoration:none;cursor:pointer;box-sizing:border-box">Débloquer mon itinéraire — '+price+'</a>'
    + '<p style="text-align:center;font-size:11px;color:var(--sub);margin-top:10px">Paiement sécurisé · Stripe · Accès immédiat après paiement</p>'
    + '</div>';

  document.body.appendChild(pw);

  /* Event listeners natifs — évite les problèmes de sanitisation innerHTML */
  function closePw(){
    pw.remove();
    /* Fermer aussi l'overlay de génération pour revenir à l'écran principal */
    const genOv = document.querySelector('.ov[data-ov="generating"]');
    if(genOv){ genOv.classList.remove('in'); setTimeout(function(){ genOv.remove(); }, 380); }
    /* Retirer du stack d'overlays */
    if(typeof ovStack !== 'undefined'){
      var gi = ovStack.findIndex(function(o){ return o.dataset&&o.dataset.ov==='generating'; });
      if(gi >= 0) ovStack.splice(gi, 1);
    }
  }
  const closeBtn = document.getElementById('pw-close');
  const alreadyBtn = document.getElementById('pw-already');
  if(closeBtn){
    closeBtn.addEventListener('click', closePw);
    closeBtn.addEventListener('touchend', function(e){ e.preventDefault(); closePw(); });
  }

  function checkAlreadyPaid(){
    const pending = JSON.parse(localStorage.getItem('hs_pending_ref') || 'null');
    if(pending && (Date.now() - pending.ts) < 60*60*1000){
      _grantPayment(pending.dest, pending.days);
      localStorage.removeItem('hs_pending_ref');
      pw.remove();
      _openItineraryAndSave();
    } else {
      toast('Paiement non détecté. Contactez-nous si vous avez été débité.');
    }
  }
  if(alreadyBtn){
    alreadyBtn.addEventListener('click', checkAlreadyPaid);
    alreadyBtn.addEventListener('touchend', function(e){ e.preventDefault(); checkAlreadyPaid(); });
  }

  /* Vérifier retour Stripe via URL */
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('paid') === 'true'){
    const pending = JSON.parse(localStorage.getItem('hs_pending_ref') || 'null');
    if(pending){ _grantPayment(pending.dest, pending.days); localStorage.removeItem('hs_pending_ref'); }
    pw.remove();
    _openItineraryAndSave();
    window.history.replaceState({}, '', window.location.pathname);
  }
}

function _pwStat(val, label){
  return '<div style="background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px;text-align:center">'
    + '<div style="font-family:var(--serif);font-weight:600;font-size:16px;color:var(--ink)">'+val+'</div>'
    + '<div style="font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:var(--sub);margin-top:2px">'+label+'</div>'
    + '</div>';
}

function _openItineraryFallback(){
  openItinerary();
  saveItinerary();
  state.deckIndex=0;
  state._suggested=null; state._suggestedExcluded=null;
  if(typeof initDeck==='function') initDeck();
  setTimeout(function(){
    const gi=ovStack.findIndex(function(o){return o.dataset.ov==='generating';});
    if(gi>=0){const g=ovStack.splice(gi,1)[0];g.remove();}
  },460);
}

/* ── Cartographe IA — contextuel à la destination ───────────────────── */
function aiItinerarySummary(){
  const it=ITINERARY;
  const days=it.plan.map(function(p){return 'J'+p.n+' '+p.loc+' : '+p.title;}).join(' · ');
  return it.dest+' · '+_days(it)+' jours · '+it.level+' · budget ~'+it.budgetTotal+'€ — '+days;
}
async function aiCartographeReply(text){
  const prompt=[
    'Tu es le cartographe de Hic Sunt, assistant voyage expert sur la destination.',
    'Itinéraire actuel : '+aiItinerarySummary(),
    'Destination : '+ITINERARY.dest+(ITINERARY.country?' ('+ITINERARY.country+')':''),
    'Saison : '+(ITINERARY.season||'non précisée'),
    '',
    'Le voyageur demande : "'+text+'"',
    '',
    'Réponds avec des conseils SPÉCIFIQUES à '+ITINERARY.dest+' — vrais noms de lieux, restaurants, activités locales.',
    'Ton sobre et expert, 2-3 phrases max. Aucun emoji.',
    'JSON : {"reply":"...","chip":"étiquette courte ex: Jour 3 modifié · +150 €"}',
  ].join('\n');
  try{
    const txt=await _callSupabase(prompt);
    let s=String(txt||'').trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
    const a=s.indexOf('{'), b=s.lastIndexOf('}');
    if(a>=0&&b>a) s=s.slice(a,b+1);
    const j=JSON.parse(s);
    if(j&&j.reply) return {t:String(j.reply),chip:j.chip?String(j.chip):''};
  }catch(e){}
  return null;
}
async function aiSend(text){
  text=(text||'').trim(); if(!text) return;
  const chat=document.querySelector('[data-ai-chat]'); if(!chat) return;
  const me=document.createElement('div'); me.className='bub me'; me.textContent=text; chat.appendChild(me);
  const input=document.querySelector('[data-ai-input]'); if(input) input.value='';
  aiScroll();
  const typing=document.createElement('div'); typing.className='typing'; typing.innerHTML='<i></i><i></i><i></i>'; chat.appendChild(typing); aiScroll();
  let r=await aiCartographeReply(text);
  if(!r) r=(typeof aiReply==='function')?aiReply(text):{t:"J'ajuste l'itinéraire en conséquence.",chip:'Itinéraire mis à jour'};
  typing.remove();
  const b=document.createElement('div'); b.className='bub them'; b.textContent=r.t; chat.appendChild(b);
  if(r.chip){
    const c=document.createElement('div'); c.style.cssText='align-self:flex-start;margin-top:2px';
    c.innerHTML='<span class="status prep" style="display:inline-flex;align-items:center;gap:6px;padding:7px 11px">'+ico('check',12,2)+r.chip+'</span>';
    chat.appendChild(c);
  }
  aiScroll();
}
