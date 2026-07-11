/* ── HIC SUNT · Sillage  -  moteur de génération IA ──────────────────────
   Connecté à l'Edge Function Supabase (super-endpoint).
   3 passes : ossature → jours détaillés → adresses & highlights        */

const SUPABASE_ENDPOINT = 'https://lucbxwxcismnvcdnctau.supabase.co/functions/v1/super-endpoint';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Y2J4d3hjaXNtbnZjZG5jdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODc0NDYsImV4cCI6MjA1OTk2MzQ0Nn0.6GPNP_GFoJtJ9vkMX5JJNANaHzUUjIg7kGY3LGc6lqM';
const SUPABASE_HEADERS = {'content-type':'application/json','Authorization':'Bearer '+SUPABASE_ANON_KEY};

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
  const isIsland = ['sardaigne','sicile','bali','sri lanka','islande','crete','corse','reunion','martinique','guadeloupe','malte','maldives','chypre','majorque','minorque','ibiza','capri','sicily','madere','canaries','lanzarote','fuerteventura'].some(function(k){ return d.includes(k); });
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
    /* Taille approximative du pays en km (diagonale) */
    const COUNTRY_KM = {
      france:1000,espagne:1000,italie:1300,allemagne:850,portugal:550,
      maroc:1500,tunisie:750,algérie:2000,égypte:1500,
      jordanie:420,turquie:1600,grèce:700,
      thaïlande:1800,vietnam:1800,cambodge:500,laos:700,
      japon:2400,chine:4000,inde:3000,népal:800,
      pérou:1800,colombie:1800,mexique:2000,brésil:4000,
      kenya:850,tanzanie:950,éthiopie:1600,maroc:1500,
      australie:4000,nouvelle:1600,
    };
    const countrySize = Object.entries(COUNTRY_KM).find(function(e){ return d.includes(e[0]); });
    const csKm = countrySize ? countrySize[1] : 1200;
    const ratio = Math.min(1, totalKm / csKm);
    if(ratio <= 0.20){
      const zone = _suggestZone(d, dc, rythme);
      directive = 'CONTRAINTE GÉOGRAPHIQUE STRICTE : avec '+dc+' jours en rythme '+rythme+', couvrir UNE seule région (~'+Math.round(totalKm)+'km sur '+csKm+'km de pays). '
        + 'Zone recommandée : '+zone+'. INTERDIT de traverser tout le pays.';
    } else if(ratio <= 0.45){
      directive = 'CONTRAINTE GÉOGRAPHIQUE : avec '+dc+' jours, couvrir maximum 2 zones adjacentes (~'+Math.round(totalKm)+'km). '
        + 'Axe logique (nord→sud OU est→ouest). Environ '+zones+' étapes. Pas de retour en arrière.';
    } else if(ratio <= 0.70){
      directive = 'CONTRAINTE GÉOGRAPHIQUE : traversée partielle possible (~'+Math.round(totalKm)+'km / '+csKm+'km). '
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
  return 'EXIGENCE ÉDITORIALE HIC SUNT (non négociable, prioritaire sur tout le reste) : Hic Sunt signifie "Beyond the Known"  -  chaque étape doit éviter le circuit touristique de masse. '
    + 'AUTO-VÉRIFICATION OBLIGATOIRE avant de valider chaque lieu : "Ce nom apparaît-il dans le top 5 des résultats Google Images, TripAdvisor ou Instagram pour cette destination ?" Si oui, c\'est interdit  -  trouve une alternative réelle et moins connue. '
    + 'Exemples concrets de ce qui est INTERDIT sauf demande explicite du client : Jardin Majorelle à Marrakech, plage de Patong ou Kata à Phuket, Wat Pho/Wat Arun à Bangkok, Ubud central à Bali, Santorin/Oia, Eiffel/Louvre à Paris  -  et tout équivalent "carte postale" dans n\'importe quelle destination. '
    + 'Remplace systématiquement par l\'alternative la plus secrète et la moins fréquentée de la même région : une crique voisine au lieu de la plage la plus citée, un marché de quartier au lieu du marché central, un village à 20-40 minutes au lieu de la ville-aimant-à-touristes, un riad/maison d\'hôtes tenu par des locaux au lieu de l\'adresse listée partout, un jardin privé ou une plantation discrète au lieu du jardin botanique le plus visité. '
    + 'Si l\'utilisateur mentionne explicitement vouloir éviter la foule/le tourisme de masse, c\'est une contrainte ABSOLUE : aucune plage/site bondé en haute saison, même célèbre, ne doit apparaître, même en filigrane ou en passage rapide. '
    + 'Les hébergements doivent aussi privilégier des adresses indépendantes et discrètes plutôt que les grandes chaînes archi-connues, sauf si le niveau de confort/style du client l\'exige explicitement.';
}

/* ── traduction des réponses du questionnaire en consignes concrètes ── */
const RYTHME_MOMENTS={'Lent':2,'Équilibré':3,'Intense':4};
function _momentsPerDay(){ return RYTHME_MOMENTS[state.rythme] || 3; }

function _transportDirective(){
  const t=state.transport||'Selon les étapes';
  if(t==='Voiture de location') return 'TRANSPORT  -  Voiture de location : itinéraire 100% réalisable en voiture. Mentionner routes panoramiques, parkings, état des routes.';
  if(t==='Train & transports locaux') return 'TRANSPORT  -  Train et bus locaux : étapes connectées par transport public fiable. Préciser les liaisons (ex: "Trenitalia 08:42, 2h15"). Éviter destinations enclavées.';
  if(t==='Tout organisé') return 'TRANSPORT  -  Guide privé : transferts en véhicule privé, guides locaux pour chaque journée. Proposer prestataires nommés.';
  return 'TRANSPORT  -  Mixte : voiture pour zones rurales, train pour grandes liaisons. Préciser le mode pour chaque transfert.';
}

function _accomStyleDirective(){
  const a=state.accomStyle||'';
  if(!a||a==='L\'emplacement avant tout') return '';
  if(a==='Charme & histoire') return 'HÉBERGEMENT  -  IMPÉRATIF : maisons d\'hôtes, riads, agriturismi, mas, bastides  -  tenus par des locaux, histoire tangible, aucune chaîne.';
  if(a==='Design & contemporain') return 'HÉBERGEMENT  -  IMPÉRATIF : architecture remarquable, design soigné, matériaux nobles, service irréprochable. Boutique-hôtels primés.';
  if(a==='Nature & immersion') return 'HÉBERGEMENT  -  IMPÉRATIF : lodges, glamping luxe, écolodges, cabanes  -  vue directe sur la nature depuis le lit.';
  return '';
}

function _fitnessDirective(){
  const f=state.fitnessLevel||'Modéré';
  if(f==='Tranquille') return 'MOBILITÉ : zéro randonnée, transports confortables, sites accessibles en véhicule, activités assises.';
  if(f==='Sportif') return 'NIVEAU SPORTIF : randonnées réelles (5-15km, dénivelé), vélo, kayak, outdoor exigeant.';
  if(f==='Extrême') return 'NIVEAU EXTRÊME : trails techniques, sommets, via ferrata, expéditions  -  pas de limite physique.';
  return 'NIVEAU MODÉRÉ : quelques heures de marche/jour (3-8km), pas de trek exigeant.';
}

function _rythmeDirective(){
  const r=state.rythme||'Équilibré';
  if(r==='Lent') return 'RYTHME LENT : 1-2 activités/jour max, rester au même endroit plusieurs nuits, transferts <45min. Les après-midis libres sont un luxe, pas un oubli.';
  if(r==='Dense') return 'RYTHME DENSE : 3-4 activités/jour, journées 7h→21h, maximiser les expériences, peu de temps mort.';
  return 'RYTHME ÉQUILIBRÉ : 2-3 activités significatives/jour, matin actif, après-midi libre possible.';
}

function _childrenDirective(){
  if(state.occasion!=='famille'&&state.travelers<3) return '';
  const count=state.childrenCount||1;
  const countLbl=count+(count>1?' enfants':' enfant');
  if(!state.childrenAges) return 'FAMILLE avec '+countLbl+' : hébergements avec piscine et espace, activités adaptées tous âges (marche < 3km, visite < 1h30), rythme doux, sieste possible, restaurants family-friendly.';
  const ages=state.childrenAges;
  const hasToddler=/\b[0-3]\b/.test(ages);
  const hasPrimaire=/\b[4-9]\b|\b1[0-2]\b/.test(ages);
  const hasAdo=/\b1[3-9]\b/.test(ages);
  let d='FAMILLE avec '+countLbl+' (âges : '+ages+')  -  contraintes absolues :';
  if(hasToddler) d+=' BÉBÉ/TOUT-PETIT : lit bébé obligatoire, transferts < 30min, sieste 13h-15h dans le planning, activités sensorielles (animaux, eau, couleurs), chaises hautes et menu enfant au restaurant.';
  if(hasPrimaire) d+=' ENFANTS PRIMAIRE : activités ludo-éducatives (animaux, ateliers, aventure accessible), piscine essentielle, horaires souples coucher.';
  if(hasAdo) d+=' ADOLESCENTS : activités à sensations (snorkeling, quad, accrobranche), lieux cool, wifi hébergement, pas "bébé".';
  d+=' INTERDIT : randonnées > 3km, musées sans espace interactif, restaurants huppés sans ambiance familiale, transferts > 1h avec moins de 5 ans.';
  return d;
}

function _dietaryDirective(){
  if(!state.dietary) return '';
  return 'RÉGIME / ALLERGIES (vérifier CHAQUE restaurant proposé) : '+state.dietary+'. Mentionner explicitement si l\'adresse peut accommoder. Ne jamais proposer de restaurant incompatible.';
}

function _alreadyDoneDirective(){
  if(!state.alreadyDone) return '';
  return 'DÉJÀ VU / À ÉVITER ABSOLUMENT : '+state.alreadyDone+'. Trouver des alternatives inédites. Ne pas répéter ces expériences, destinations ou types d\'activité.';
}

function _occasionDirective(){
  const id=state.occasion;
  if(!id) return '';
  const map={
    'lune-de-miel':[
      '== LUNE DE MIEL  -  CE FILTRE S\'APPLIQUE À CHAQUE DÉCISION DE L\'ITINÉRAIRE ==',
      '* GÉOGRAPHIE : privilégier UNE ou DEUX zones maximum sur tout le séjour (pas de circuit qui change d\'hébergement tous les jours) — s\'installer et profiter, pas cocher des étapes. Un aller-retour lointain ne se justifie que par un séjour sur place d\'au moins 3-4 nuits.',
      '* HÉBERGEMENTS : suites ou chambres avec terrasse/vue privative, lit king, bain ou jacuzzi si possible. Structures intimistes (< 12 chambres) pour le sentiment de cocon. Zéro chambre standard face à un parking.',
      '* REPAS : dîners en tête-à-tête uniquement  -  tables isolées, éclairage tamisé, vue imprenable. Au moins 1 dîner d\'exception (gastronomique, pieds dans le sable, terrasse privée ou expérience unique). Jamais de buffets ou restaurants bruyants le soir.',
      '* MOMENTS ROMANTIQUES OBLIGATOIRES : (1) coucher de soleil structuré  -  en bateau, sur un toit ou depuis un belvédère secret ; (2) massage en duo avec nom du spa, type de soin et prix précis ; (3) expérience exclusive à deux  -  bateau privé, pique-nique sur plage déserte, balade à cheval au coucher du soleil.',
      '* RYTHME : jamais de réveil < 7h30. Après-midis libres pour flâner ensemble. Pas de journée "marathon touristique".',
      '* DÉTAILS QUI COMPTENT : pétales de roses à l\'arrivée si disponible, champagne offert, accès piscine privée, service de chambre romantique, notes de bienvenue.',
      '* PROHIBÉ : auberges, hôtels de chaîne sans âme, buffets, activités de groupe bondées, bus locaux.',
      '==════════════════════════════════════════════════════════════════════════════',
    ].join('\n'),
    'anniversaire':[
      '== ANNIVERSAIRE  -  CÉLÉBRATION AU CŒUR DE L\'ITINÉRAIRE ==',
      '* MOMENT CLÉ : identifier le jour J (milieu du séjour si non précisé) et le rendre inoubliable  -  dîner de gala, expérience exclusive, surprise locale.',
      '* Au moins 1 expérience "première fois" : activité jamais tentée, lieu d\'exception, table impossible à trouver seul.',
      '* Hébergements avec valeur ajoutée : vue, standing, service. Mentionner les formules anniversaire disponibles (gâteau, décoration, chambre surclassée).',
      '* 1 gem cachée réservée au jour J : spot secret, chemin non balisé, crique inaccessible normalement.',
      '* Ton : légèreté, plaisir, spontanéité  -  laisser du vide pour les coups de cœur imprévus.',
      '==════════════════════════════════════════════════════════',
    ].join('\n'),
    'evjf':[
      '== EVJF  -  PROGRAMME ENTRE FILLES, FESTIF DU DÉBUT À LA FIN ==',
      '* GÉOGRAPHIE : UNE seule ville/zone pour tout le séjour, jamais de circuit qui déplace le groupe — s\'installer dans une base festive et rayonner en excursions courtes depuis là.',
      '* HÉBERGEMENT : villa avec piscine privée ou grand appartement  -  espace commun pour soirées de groupe, si possible proche des quartiers de sortie.',
      '* ACTIVITÉS PRIORITAIRES : spa privatisé pour le groupe, cours de cuisine ou atelier local (céramique, cocktails, parfum), sunset rooftop ou bar avec vue, plage/piscine avec service.',
      '* VIE NOCTURNE OBLIGATOIRE (au moins 1 soir sur 2) : restaurants festifs avec ambiance et cocktails, bars/rooftops qui ferment tard, au moins 1 vraie boîte de nuit ou club nommé et réputé sur place  -  jamais une soirée qui se termine avant minuit sauf demande contraire.',
      '* ESTHÉTIQUE : lieux instagrammables mais authentiques  -  pas de kitch. Couleurs, architecture, lumière favorable.',
      '* Éviter : musées ennuyeux, randonnées épuisantes, hôtels formels. Favoriser mouvement, photos, rire, fête.',
      '* Budget repas/soirées : restaurants trendy avec cocktails + entrée boîte de nuit  -  intégrer les boissons et les entrées de club dans l\'estimation.',
      '==═════════════════════════════════',
    ].join('\n'),
    'evg':[
      '== EVG  -  ADRÉNALINE LE JOUR, FESTIF LE SOIR ==',
      '* GÉOGRAPHIE : UNE seule ville/zone pour tout le séjour, jamais de circuit qui déplace le groupe — s\'installer dans une base et rayonner en excursions courtes depuis là.',
      '* ACTIVITÉS JOUR : quad, karting, surf, accrobranche, paintball, plongée, parapente, 4x4  -  au moins 2 activités physiques intenses.',
      '* VIE NOCTURNE OBLIGATOIRE (au moins 1 soir sur 2) : bars à cocktails qui ferment tard, au moins 1 vraie boîte de nuit ou club nommé et réputé sur place (pas un club à touristes), ou une soirée locale authentique  -  jamais une soirée qui se termine avant minuit sauf demande contraire.',
      '* HÉBERGEMENTS : grande villa ou lodge avec espace commun (terrasse, piscine) pour le groupe, si possible proche des quartiers de sortie.',
      '* REPAS : grillades, BBQ, street food de qualité, portions généreuses, au moins 1 tablée conviviale.',
      '* Budget soirées : intégrer les boissons et les entrées de club/bar dans l\'estimation.',
      '* Éviter : gastronomie trop formelle, rythme lent. Chaque jour doit avoir une histoire à raconter.',
      '==═════════════════════════════════════════',
    ].join('\n'),
    'famille':_childrenDirective()||[
      '== EN FAMILLE ==',
      '* Hébergements spacieux avec piscine, espaces verts, activités sur place.',
      '* Activités adaptées tous âges : animaux, eau, découvertes sensorielles.',
      '* Rythme doux, horaires souples, restaurants menu enfant.',
      '* Pas de longues randonnées ni de musées sans espace interactif.',
      '==══════════════',
    ].join('\n'),
    'amis': [
      'ENTRE AMIS : partage, convivialité, expériences communes.',
      '* Hébergements avec espaces communs (villa, appartement, terrasse partagée).',
      '* Repas conviviaux : tablées, barbecue, street food de qualité, marchés.',
      '* Activités en groupe : randonnée, sports nautiques, visite culturelle.',
      '* 1 soirée mémorable par groupe (bar local avec musique live, restaurant festif).',
      '* Liberté individuelle possible dans la journée  -  se retrouver le soir.',
    ].join('\n'),
    'bien-etre': [
      '== RETRAITE BIEN-ÊTRE  -  RESSOURCEMENT ET DÉCONNEXION ==',
      '* GÉOGRAPHIE : UNE seule zone/un seul hébergement pour tout le séjour si possible  -  le ressourcement se construit dans la durée, pas en enchaînant les lieux.',
      '* HÉBERGEMENT : lieu calme et silencieux, isolé si possible, avec spa/piscine naturelle, jamais en zone bruyante ou nocturne.',
      '* RYTHME : très lent, jamais plus de 2 activités/jour, larges plages libres, jamais de réveil avant 8h imposé.',
      '* ACTIVITÉS PRIORITAIRES : soins spa/massage nommés avec prix, yoga ou méditation au lever du soleil, bains thermaux/naturels, alimentation saine et locale, marche douce en nature.',
      '* Éviter absolument : vie nocturne, transferts fréquents, activités à sensations fortes, rythme dense, groupes bruyants.',
      '* Ton : calme, présence, lenteur assumée  -  chaque jour doit laisser du temps ne rien faire.',
    ].join('\n'),
    'solo': [
      'VOYAGE EN SOLO : liberté, rencontres, immersion.',
      '* Hébergements favorisant les rencontres (guesthouses avec table d\'hôtes) sans sacrifier la qualité.',
      '* Activités réalisables seul : excursions avec guides locaux recommandés, petits groupes.',
      '* Tips de sécurité spécifiques à la destination intégrés naturellement.',
      '* Moments libres pour flâner : mercados, cafés de quartier, bibliothèques, parcs.',
      '* Signaler quand une activité est difficile seul et proposer l\'alternative solo-friendly.',
    ].join('\n'),
  };
  return map[id]||'';
}

function _styleDirective(){
  const styles=(state.styles||[]);
  if(!styles.length) return '';
  const lower=styles.join(' ').toLowerCase();
  const notes=[];
  if(lower.includes('aube')||lower.includes('lever')) notes.push('sites tôt le matin avant les foules, golden hour planifiée');
  if(lower.includes('habitant')) notes.push('tables d\'hôtes, repas chez l\'habitant, marchés de producteurs');
  if(lower.includes('locaux')||lower.includes('bar que')) notes.push('bars et restaurants exclusivement locaux, zéro touristique');
  if(lower.includes('marcher')||lower.includes('vue')) notes.push('randonnées avec point de vue exceptionnel, effort récompensé');
  if(lower.includes('flâner')||lower.includes('perdre')) notes.push('temps libres non planifiés, quartiers à explorer seul');
  if(lower.includes('histoire')) notes.push('hébergements avec âme et histoire, bâtisses remarquables');
  if(lower.includes('savoirs-faire')||lower.includes('rapporter')) notes.push('ateliers artisanaux, rencontres de producteurs, cours pratiques');
  if(lower.includes('foules')||lower.includes('fuir')) notes.push('destinations et horaires hors-afflux, sites alternatifs aux blockbusters');
  if(lower.includes('nager')||lower.includes('eaux')) notes.push('criques sauvages, spots de baignade non balisés');
  if(lower.includes('vivent')||lower.includes('comment les')) notes.push('quartiers résidentiels, marchés quotidiens, vie locale authentique');
  if(lower.includes('léger')||lower.includes('changé')) notes.push('voyage minimaliste, immersion profonde');
  if(lower.includes('manger le meilleur')) notes.push('meilleures tables locales de chaque étape');
  if(lower.includes('rouler')||lower.includes('road')) notes.push('road trip, haltes spontanées, hébergements variés au fil de la route');
  if(lower.includes('photographier')||lower.includes('photo')) notes.push('golden hours, belvédères secrets, sujets photographiques uniques');
  if(lower.includes('une seule chose')) notes.push('rythme ultra-lent, 1 expérience par jour, approfondissement');
  if(lower.includes('limites')||lower.includes('physiques')) notes.push('activités exigeantes, dépassement de soi');
  return notes.length ? 'MANIÈRE DE VOYAGER  -  intégrer dans chaque journée : '+notes.join(' · ')+'.' : '';
}

function _interestsDirective(){
  const interests=(state.interests||[]);
  if(!interests.length) return '';
  const lower=interests.join(' ').toLowerCase();
  const notes=[];
  if(lower.includes('marchés de producteurs')) notes.push('marchés de producteurs locaux, horaires 7h-12h');
  if(lower.includes('criques')||lower.includes('sans chemin')) notes.push('plages et criques non balisées, accessibles à pied ou en bateau');
  if(lower.includes('restaurants que les guides')) notes.push('tables locales non touristiques, recommandations d\'habitants');
  if(lower.includes('randonnées avec vue')) notes.push('sentiers nommés avec dénivelé, point de vue exceptionnel à l\'arrivée');
  if(lower.includes('villages perchés')) notes.push('villages fortifiés, ruelles médiévales, loin des bus touristiques');
  if(lower.includes('couchers de soleil')) notes.push('belvédères secrets pour coucher de soleil, horaire précis');
  if(lower.includes('faune')||lower.includes('safaris')) notes.push('sorties safari avec guides nommés');
  if(lower.includes('temples')||lower.includes('spiritualité')) notes.push('sites spirituels hors affluence, heures de visite calmes');
  if(lower.includes('vignobles')||lower.includes('caves')) notes.push('domaines viticoles avec dégustation producteur');
  if(lower.includes('cours de cuisine')) notes.push('cours de cuisine chez un habitant ou chef local');
  if(lower.includes('plongée')||lower.includes('snorkeling')) notes.push('spots plongée/snorkeling avec prestataires locaux nommés');
  if(lower.includes('architecture')) notes.push('bâtiments remarquables, quartiers patrimoniaux');
  if(lower.includes('spas')||lower.includes('soins')||lower.includes('bains')) notes.push('spas ou hammams locaux avec noms et tarifs');
  if(lower.includes('musique')||lower.includes('culturelle')) notes.push('concerts live, scène musicale locale');
  if(lower.includes('vélo')||lower.includes('routes secondaires')) notes.push('itinéraires cyclables, location nommée');
  if(lower.includes('sources thermales')||lower.includes('bains naturels')) notes.push('thermes et sources naturelles avec conditions d\'accès');
  if(lower.includes('nautiques')) notes.push('kayak, voile, paddle, jet-ski avec prestataires');
  if(lower.includes('ateliers artisanaux')) notes.push('ateliers artisans locaux, savoir-faire régionaux');
  return notes.length ? 'EXPÉRIENCES PRIORITAIRES  -  au moins 1 par jour : '+notes.join(' · ')+'.' : '';
}

function _dreamDirective(){
  if(!state.dream) return '';
  const surprise=state.createTab==='surprise';
  return (surprise
    ? 'CONTRAINTES / À ÉVITER (respecter impérativement) : '
    : 'ADN DU VOYAGE  -  ce texte définit l\'âme de tout l\'itinéraire, chaque étape doit y répondre : '
  )+state.dream;
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

/* ── palettes par pays / région  -  vraiment distinctes visuellement ────── */
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
   selon la saison et le délai de réservation  -  l'objectif est un budget
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
    'Destination : '+(state.destination?state.destination:(surprise?'SURPRISE  -  choisis la destination la plus désirable pour ce profil':'')),
    'Départ : '+(state.origin||'Paris'),
    datesLine, durationLine,
    'Voyageurs : '+travelerLabel(),
    state.occasion==='famille' ? 'Enfants : '+state.childrenCount+(state.childrenCount>1?' enfants':' enfant')+(state.childrenAges?' (âges : '+state.childrenAges+')':'') : '',
    'Confort : '+(state.budget||'Confort'),
    'Rythme : '+(state.rythme||'Équilibré'),
    'Forme physique : '+(state.fitnessLevel||'Modéré'),
    'Transport préféré : '+(state.transport||'Mixte'),
    state.accomStyle ? 'Style hébergement souhaité : '+state.accomStyle : '',
    'Styles de voyage : '+((state.styles||[]).join(', ')||'variés'),
    'Intérêts : '+((state.interests||[]).join(', ')||'découverte générale'),
    'Occasion : '+(occ||'aucune'),
    state.dietary ? 'Régime / allergies : '+state.dietary : '',
    state.alreadyDone ? 'Déjà fait / à éviter : '+state.alreadyDone : '',
    flightsLine,
    (surprise?'Contraintes / à éviter : ':'Ce voyage représente : ')+(state.dream||' - '),
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

  /* EVJF/EVG/lune de miel/bien-être : l'esprit de ces occasions est de
     s'installer quelque part et d'en profiter, pas d'enchaîner les
     hébergements  -  ça doit contraindre le CIRCUIT dès le squelette, sinon
     la consigne équivalente au niveau du détail des jours (_occasionDirective)
     arrive trop tard : les zones du voyage sont déjà figées. */
  const singleBaseDirective = ['evjf','evg','lune-de-miel','bien-etre'].indexOf(state.occasion)>=0
    ? '=== OCCASION "'+state.occasion.toUpperCase()+'" : BASE UNIQUE ===\nPrivilégier UNE SEULE zone/ville pour tout le séjour (deux maximum si le voyage dépasse 7 jours) — jamais de circuit qui déplace le groupe chaque jour. S\'installer dans une base fixe et rayonner en excursions courtes depuis là plutôt que d\'enchaîner les hébergements.'
    : '';

  const common=[
    singleBaseDirective,
    geoConstraint,
    zoneConstraint ? zoneConstraint : '',
    '=== ITINÉRAIRE GÉOGRAPHIQUEMENT COHÉRENT - RÈGLE ABSOLUE ===',
    'CRITIQUE : Conçois un CIRCUIT LOGIQUE qui ne revient JAMAIS en arrière. Imagine la carte réelle du pays.',
    'Le voyage doit suivre une BOUCLE ou une LIGNE continue : on avance toujours vers la destination suivante la plus proche, jamais de zigzag.',
    'INTERDIT ABSOLU : revenir dans une ville déjà visitée puis repartir (ex: Colombo -> Sud -> Ella -> Kandy -> Negombo -> Kandy -> Ella = INVALIDE car repasse 2x par Kandy et Ella).',
    'BON EXEMPLE (Sri Lanka) : Colombo (arrivée) -> Sigiriya/triangle culturel (nord) -> Kandy -> Ella/montagnes -> Yala (safari sud-est) -> côte sud (Mirissa, Tangalle) -> Negombo/Colombo (départ). Boucle fluide sans retour.',
    'BON EXEMPLE (Maroc) : Marrakech -> Aït Ben Haddou -> Ouarzazate -> Gorges du Dadès -> Merzouga (désert) -> Fès -> Chefchaouen -> retour. Jamais de zigzag.',
    'BON EXEMPLE (Vietnam) : Hanoï (nord) -> Ha Long -> Hué -> Hoi An (centre) -> Da Lat -> Hô Chi Minh (sud). Ligne nord->sud continue.',
    'BON EXEMPLE (Japon) : Tokyo (arrivée) -> Hakone (montagnes/onsen, 1h30 de Tokyo) -> Kanazawa (détour, jardins/vieille ville) -> Kyoto (temples) -> Hiroshima/Miyajima (mémorial) -> retour Tokyo pour le vol international si besoin. Kanazawa se place ENTRE Tokyo et Kyoto (pas après Kyoto) : Kyoto -> Kanazawa -> Hiroshima serait un zigzag INVALIDE (retour vers le nord puis re-descente au sud-ouest).',
    'Adapte ce principe à TOUTE destination : identifie le point d\'arrivée, les zones d\'intérêt, et trace le chemin le plus court qui les relie sans repasser deux fois.',
    'Si le vol retour est dans la même ville que l\'arrivée, organise une BOUCLE qui y revient naturellement à la fin - PAS d\'aller-retours multiples.',
    'Planifie mentalement le trajet AVANT : liste les zones dans l\'ordre géographique optimal, puis répartis les jours.',
    '',
    '=== RÈGLES LOGISTIQUES (violations = itinéraire invalide) ===',
    '1. TRACÉ LINÉAIRE OU BOUCLE : jamais de retour arrière. Chaque étape plus proche de la suivante.',
    '2. DISTANCES RÉALISTES : max '+maxKm+'km entre deux étapes consécutives (rythme '+rythme+'). Mentionner le trajet si > 45min.',
    '3. JOURS DE TRANSFERT : si trajet > 2h, dédier ce jour au trajet + arrivée.',
    '4. FERRIES/BATEAUX : planifier aller ET retour avec dates précises.',
    '5. UN HÉBERGEMENT PAR ZONE : changer d\'hébergement SEULEMENT en changeant de zone (>30km). Regrouper les nuits consécutives au même endroit.',
    '6. COHÉRENCE "night" : champ "night" = "name" EXACT d\'un hébergement de "stays".',
    '7. SKY : sun, cloud, ou rain uniquement.',
    '8. JSON valide compact. Zéro texte autour.',
    '9. JAMAIS de référence de jour dans un champ texte ("J8", "Jour 10", "J10-12", "jours 8 à 10", etc.) — le numéro de jour est déjà déterminé par la position dans "plan", ne JAMAIS l\'écrire dans "title" ni "hook". Ces champs décrivent le LIEU/l\'activité, jamais le calendrier.',
    (dc<=6 ? '10. VOYAGE COURT ('+dc+' jours) : rester dans UNE SEULE région compacte, PAS d\'aller-retour lointain qui sacrifie plusieurs jours au seul trajet. Un transfert de plus de 2h ne se justifie QUE s\'il est suivi d\'au moins 2 nuits sur place — jamais pour une seule nuit isolée avant de repartir. Mieux vaut 2-3 zones proches et bien vécues qu\'une zone lointaine ajoutée juste pour la "cocher".' : '10. RÉPARTITION : plus le voyage est long, plus chaque zone doit avoir un nombre de nuits proportionnel à la distance parcourue pour l\'atteindre — un aller-retour lointain ne se justifie que par un séjour sur place d\'au moins 2-3 nuits.'),
    '11. CHAMP "loc" : toujours un lieu géographique RÉEL et précis (ville, village, hameau, point de repère nommé) que l\'on peut situer sur une carte — jamais un thème de journée, une direction seule, ou une description de trajet. INTERDIT comme "loc" : "Trajets sud-est", "Journée détente", "Balade côtière", "Excursion nature". Si le jour couvre plusieurs lieux, "loc" = celui où se déroule l\'essentiel du jour (ex: "Porto-Vecchio", pas "Trajets sud-est" pour une journée d\'excursions autour de Porto-Vecchio).',
  ];

  if(isFirst){
    const compact2=[];
    if(state.occasion){
      const occMap={'lune-de-miel':'Lune de miel: suites, dîners romantiques, activités à deux, intimité, base unique.','anniversaire':'Anniversaire: 1 moment exceptionnel, gem caché.','evjf':'EVJF: base unique, spa, rooftop, lieux instagrammables, vie nocturne (bars tardifs, boîte de nuit).','evg':'EVG: base unique, activités sportives le jour, vie nocturne le soir (bars tardifs, boîte de nuit).','famille':'Famille (enfants '+state.childrenAges+'): hébergement spacieux, activités tous âges.','solo':'Solo: guesthouses, activités modulables, sécurité.','amis':'Entre amis: hébergement partagé, activités de groupe, 1 soirée mémorable.','bien-etre':'Retraite bien-être: base unique, rythme lent, spa/yoga/nature, jamais de vie nocturne.'};
      if(occMap[state.occasion]) compact2.push(occMap[state.occasion]);
    }
    if(state.dietary)   compact2.push('Régime: '+state.dietary);
    if(state.alreadyDone) compact2.push('Éviter: '+state.alreadyDone);
    if(state.transport&&state.transport!=='Mixte') compact2.push('Transport: '+state.transport);
    if(state.accomStyle&&state.accomStyle!=='Peu importe') compact2.push('Hébergement: '+state.accomStyle);
    if(state.fitnessLevel&&state.fitnessLevel!=='Modéré') compact2.push('Forme: '+state.fitnessLevel);
    const styles2=(state.styles||[]);
    if(styles2.length) compact2.push('Style: '+styles2.join(', '));
    const interests2=(state.interests||[]);
    if(interests2.length) compact2.push('Intérêts: '+interests2.join(', '));
    if(state.dream) compact2.push('Envie: '+state.dream.slice(0,120));
    const destLock = (!b.surprise&&dest)
      ? '⚠️ DESTINATION IMPOSÉE : "'+dest+'". "dest" DOIT être "'+dest+'". Absolument aucune autre destination.' : '';

    return [
      '═══════════════════════════════════════════════════════════════',
      '║  HIC SUNT · BEYOND THE KNOWN  -  CARTOGRAPHE SENIOR            ║',
      '║  Standard : directeur d\'une agence de voyage ultra-luxe       ║',
      '║  Exigence : cohérence logistique absolue + authenticité       ║',
      '==═════════════════════════════════════════════════════════════',
      '',
      destLock,
      zoneConstraint ? zoneConstraint+'\n' : '',
      '━━━ BRIEF CLIENT ━━━',
      b.lines,
      '',
      '━━━ PERSONNALISATION ━━━',
      compact2.length?compact2.join(' | '):'Confort, découvertes authentiques.',
      '',
      '━━━ PHILOSOPHIE ÉDITORIALE ━━━',
      '* NOMS RÉELS : restaurants, guides, excursions  -  décris-les précisément. Pour les HÉBERGEMENTS, propose un nom plausible et le bon standing : ils seront ensuite remplacés par de vrais établissements vérifiés.',
      '* STANDING HÉBERGEMENTS : toujours indiquer la classification (Relais & Châteaux / 5⭐ / Boutique 4⭐ / Agriturismo bio / Maison d\'hôtes charme).',
      '* RESTAURANTS : nom exact + quartier + spécialité signature + fourchette de prix + note Google si connue.',
      '* EXCURSIONS : nom du prestataire ou du guide local + contact si disponible.',
      '* ANCRAGE LOCAL : familles, producteurs, artisans. "Trattoria tenue par la même famille depuis 1974."',
      '* HORAIRES PRATIQUES : meilleur moment, réservation conseillée, à éviter si surpeuplé.',
      '* ANTI-TOURISTIQUE : pas de spots Instagram saturés. Penser comme un habitant cultivé, pas comme un guide Lonely Planet.',
      '* LOGISTIQUE RÉALISTE : si le trajet d\'un jour dépasse 2h, c\'est un jour de route  -  pas de visite intensive ce jour-là.',
      '',
      '━━━ CONSIGNES STRICTES ━━━',
      common.join('\n'),
      '',
      '* "plan" : EXACTEMENT '+n+' entrées numérotées (jours 1→'+n+' sur '+dc+').',
      '* "stays" : couvre les '+dc+' JOURS complets. Max '+Math.min(5,Math.max(1,Math.ceil(dc/4)))+' hébergements (1 par zone géographique distincte > 30km).',
      '* IMPÉRATIF : la somme des "nights" de TOUS les hébergements doit être EXACTEMENT '+dc+' (jamais plus, jamais moins) — sinon le budget affiché au client est faux.',
      '* Hébergement J1 = lieu d\'arrivée (aéroport proche). Dernier hébergement = près de l\'aéroport de départ.',
      '* Prix hébergements RÉALISTES et DISTINCTS par type :',
      '  Sardaigne/Corse: agriturismo 65-95€ · boutique 95-145€ · resort 140-210€ · villa/charme 190-380€',
      '  Thaïlande: guesthouse 35-75€ · boutique-hôtel 75-135€ · resort plage 110-200€ · villa privée 180-400€',
      '  Maroc: maison d\'hôtes 55-95€ · riad médina 90-160€ · camp désert 130-230€ · resort Atlas 150-280€',
      '  Japon: ryokan 120-280€ · business hotel 80-130€ · boutique 100-200€',
      '  Ajuster × colFactor selon la destination',
      '* Budget TOTAL réaliste pour '+dc+' jours × TOUS voyageurs (héberg+repas+activités+transport local, hors vols) :',
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
      '{"dest":"Sardaigne","country":"Italie","tagline":"Criques secrètes et maquis odorant sous le soleil d\'août","level":"Confort","dates":"14-22 août 2026 · '+dc+' jours","days_count":'+dc+',"budget":'+Math.round(dc*140*2)+',"season":"Août chaud, idéal mer  -  éviter mi-août pour Cagliari","coords":"39°13\'N · 9°07\'E","region":"Sardaigne","stays":['
      +'{"name":"Agriturismo Mandra Edera","type":"Agriturismo bio · charme","loc":"Chia / Extrême Sud","price":88,"nights":4,"blurb":"Crique privée à 800m, production fromagère, couchers de soleil sur l\'archipel"},'
      +'{"name":"Su Gologone","type":"Relais & Châteaux · 4⭐","loc":"Oliena / Nuoro  -  centre","price":148,"nights":4,"blurb":"Source naturelle, jardins secrets, cuisine barbaricina authentique"}],'
      +'"plan":[{"title":"Arrivée Cagliari  -  premiers pas dans le sud sauvage","loc":"Cagliari / Aéroport","night":"Agriturismo Mandra Edera","sky":"sun","temp":"29°","hook":"45min de route depuis l\'aéroport : la Sardaigne commence au premier virage côtier."}]}',
    ].filter(Boolean).join('\n');
  }

  /* Batches suivants  -  contexte complet */
  const staysList=(state._genStays||[]).map(function(s){return '"'+s.name+'" ('+s.type+', '+s.loc+')  -  '+s.nights+' nuits';}).join('\n');
  const allVisited=(state._genAllSteps||[]).map(function(p){return p.loc;}).filter(function(v,i,a){return a.indexOf(v)===i;});
  const lastSteps=(state._genLastSteps||[]).slice(-2).map(function(p){return p.n+'. '+p.loc+' ('+p.title+')';}).join(' → ');
  const lastLoc=(state._genLastSteps&&state._genLastSteps.length)?state._genLastSteps[state._genLastSteps.length-1].loc:'';
  return [
    'HIC SUNT  -  SUITE itinéraire '+dest+', '+dc+'j. Jours '+(offset+1)+'→'+(offset+n)+'.',
    'MÊMES EXIGENCES : noms réels, logistique rigoureuse, ancrage local.',
    '',
    '=== BRIEF CLIENT ===',
    b.lines,
    '',
    '=== CONTEXTE GÉOGRAPHIQUE - CRITIQUE ===',
    'Tu es actuellement à : '+lastLoc,
    'Dernières étapes : '+lastSteps,
    'Villes DÉJÀ VISITÉES (ne PAS y retourner sauf si c\'est l\'aéroport de départ final) : '+allVisited.join(', '),
    'RÈGLE ABSOLUE : continue le circuit vers l\'AVANT depuis '+lastLoc+'. Ne reviens PAS dans une ville déjà visitée.',
    'Si ces jours sont les DERNIERS du voyage, dirige-toi progressivement vers l\'aéroport de départ.',
    '',
    'Hébergements établis (utiliser "name" EXACT dans "night") :',
    staysList,
    '',
    common.join('\n'),
    '* EXACTEMENT '+n+' entrées : jours '+(offset+1)+'→'+(offset+n)+'.',
    '* Continuer géographiquement depuis '+lastLoc+' SANS retour arrière.',
    '* Vérifier : trajet réaliste ? ferry retour prévu ? nuits cohérentes ? aucune ville déjà visitée ?',
    '',
    '{"plan":[{"title":"","loc":"ville précise","night":"nom exact stays","sky":"sun","temp":"26°","hook":"phrase évocatrice 10 mots max"}]}',
  ].join('\n');
}

/* ── Passe 2 : détail éditorial des jours (par lots) ─────────────────── */
function buildDaysPrompt(skel, planSteps, offset){
  const b=buildBrief();
  const nMoments=_momentsPerDay();
  const occ=state.occasion;

  /* Directives compactes  -  une ligne par contrainte max.
     _occasionDirective/_dietaryDirective/_alreadyDoneDirective/_accomStyleDirective/
     _fitnessDirective/_rythmeDirective/_styleDirective/_interestsDirective traduisent
     chaque réponse du questionnaire en consigne concrète (elles étaient écrites mais
     jamais appelées nulle part  -  les réponses du client n'avaient donc aucun effet
     réel au-delà d'une simple liste de mots-clés recopiée telle quelle). */
  const compact=[];
  const occDirective=_occasionDirective();
  if(occDirective) compact.push(occDirective);
  const dietDirective=_dietaryDirective();
  if(dietDirective) compact.push(dietDirective);
  const avoidDirective=_alreadyDoneDirective();
  if(avoidDirective) compact.push(avoidDirective);
  if(state.transport&&state.transport!=='Mixte') compact.push('TRANSPORT: '+state.transport+'.');
  const accomDirective=_accomStyleDirective();
  if(accomDirective) compact.push(accomDirective);
  compact.push(_fitnessDirective());
  compact.push(_rythmeDirective());
  const styleDirective=_styleDirective();
  if(styleDirective) compact.push(styleDirective);
  const interests=(state.interests||[]);
  if(interests.length){
    compact.push('INTÉRÊTS COCHÉS (au moins 1 par jour) : '+interests.join(', ')+'.');
    const interestsDirective=_interestsDirective();
    if(interestsDirective) compact.push(interestsDirective);
  }
  /* Demande explicite du client : ne pas ajouter d'activité type "randonnée" (ou tout
     autre thème) si ce n'est pas dans les intérêts/style cochés ni justifié par la
     forme physique  -  rester fidèle au questionnaire plutôt que de remplir les jours
     avec des activités génériques non demandées. */
  compact.push('NE PROPOSER un thème d\'activité (randonnée, plongée, spa, vignoble, etc.) QUE s\'il correspond à un intérêt/style coché ci-dessus, à la forme physique indiquée, ou à un incontournable évident et inévitable de la destination elle-même. Sinon, explorer davantage les intérêts réellement sélectionnés plutôt que d\'ajouter une activité générique de remplissage.');
  if(state.dream) compact.push('ADN DU VOYAGE: '+state.dream.slice(0,120));

  const steps=planSteps.map(function(p,i){return (offset+i+1)+'. '+p.title+'  -  '+p.loc+(p.hook?' ('+p.hook+')':'');}).join('\n');

  return [
    'HIC SUNT · CARTOGRAPHE  -  détail jours '+skel.dest+', jours '+(offset+1)+'→'+(offset+planSteps.length),
    'Standard Condé Nast. Noms RÉELS et vérifiables. JSON UNIQUEMENT.',
    '',
    'BRIEF: '+b.lines.replace(/\n/g,' | '),
    compact.length ? 'CONTRAINTES: '+compact.join(' / ') : '',
    '',
    'ÉTAPES:\n'+steps,
    '',
    'RÈGLES:',
    '* Géo stricte: chaque lieu dans la zone de l\'étape (<15km). Sur île: sur cette île uniquement.',
    '* desc: 2 phrases évocatrices max 40 mots (sensations, lumière, atmosphère).',
    '* moments: '+nMoments+' items réels  -  {t:"HH:MM",k:"['+GEN_KINDS.slice(0,8).join('|')+']",ti:"NOM RÉEL",d:"détail 6 mots",free:true|false}',
    '* free: true si l\'activité est en accès libre et non réservable (plage publique, point de vue, photo, balade, marché à parcourir, coucher de soleil, rue/place, église) — false si elle a un coût réel (visite guidée, musée/site payant, spa, excursion, activité nautique encadrée, cours, location).',
    '* tip: conseil initié ultra-spécifique (heure, jour, lieu exact).',
    '* restaurant: {name,type,price:"€/€€/€€€",note,rating:"4,x⭐",review}',
    '* wellness: null ou {name,type,price,note} si spa/lune de miel.',
    '* JAMAIS de numéro/plage de jour du voyage dans un champ texte ("J8", "Jour 10", "J10-12"...) — chaque entrée de "days" correspond déjà à UN jour précis par sa position, ne jamais l\'écrire dans "desc", "tip" ou "moments".',
    '',
    'JSON EXACT  -  '+planSteps.length+' entrées dans "days":',
    '{"days":[{"desc":"","tip":"","restaurant":{"name":"","type":"","price":"€€","note":"","rating":"","review":""},"wellness":null,"moments":[{"t":"","k":"","ti":"","d":"","free":false}]}]}',
  ].filter(Boolean).join('\n');
}

/* ── Passe 3 : adresses, highlights, budget ─────────────────────────── */
function buildHighlightsPrompt(skel, days){
  const dest=skel.dest||'';
  const occ=state.occasion||'';
  const interests=(state.interests||[]).slice(0,5).join(', ')||'';
  const locs=(skel.plan||[]).map(function(p){return p.loc;}).filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,5).join(', ');
  const wantSpa=occ==='lune-de-miel'||interests.toLowerCase().includes('spa')||interests.toLowerCase().includes('bain');
  const wantBeach=interests.toLowerCase().includes('plage')||interests.toLowerCase().includes('crique');
  const wantFood=interests.toLowerCase().includes('cuisine')||interests.toLowerCase().includes('restaurant');
  const compact=[];
  if(occ) compact.push('Occasion: '+occ);
  if(state.dietary) compact.push('Régime: '+state.dietary);
  if(state.dream) compact.push('Envie: '+state.dream.slice(0,80));
  return [
    'Hic Sunt. Destination: '+dest+' | Étapes: '+locs+(compact.length?' | '+compact.join(' | '):''),
    'Génère 4 gems cachées + sections demandées. JSON compact uniquement.',
    '',
    '{"gems":[{"name":"","loc":"","desc":"","tip":""}],"highlights":{'
    +'"spas":'+  (wantSpa?  '[{"name":"","loc":"","type":"","price":"","note":""}]':'[]')
    +',"beaches":'+(wantBeach?'[{"name":"","loc":"","desc":"","tip":""}]':'[]')
    +',"restaurants":'+(wantFood?'[{"name":"","loc":"","type":"","price":"","note":""}]':'[]')
    +'},"essentials":{"visa":"info ressortissants français","bestTime":"saison + raison","toKnow":["x","y","z"]},"budget_note":"fourchette/pers hors vols"}',
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
  const res=await fetch(SUPABASE_ENDPOINT,{method:'POST',headers:SUPABASE_HEADERS,body:JSON.stringify({prompt:prompt})});
  if(!res.ok){
    const body=await res.text().catch(function(){return '';});
    console.error('[_callSupabase] HTTP',res.status,body.slice(0,200));
    throw new Error('HTTP '+res.status+'  -  '+body.slice(0,80));
  }
  const data=await res.json();
  if(data.error) throw new Error(data.error);
  return data.result||'';
}
async function _completeJSON(prompt){
  for(let a=0;a<3;a++){
    if(a>0) await new Promise(function(r){setTimeout(r,a*1500);});
    try{
      const txt=await _callSupabase(prompt);
      const j=parseItineraryJSON(txt);
      if(j) return j;
      console.warn('[_completeJSON] JSON invalide, tentative',a+1);
    }catch(e){
      var msg=String(e&&e.message||e).toLowerCase();
      console.warn('[_completeJSON] tentative',a+1,'echouee:',e&&e.message||e);
      /* Load failed = iOS Safari a coupe le reseau — attendre et reessayer */
      if(msg.indexOf('load failed')>=0||msg.indexOf('network')>=0){
        if(a<2) await new Promise(function(r){setTimeout(r,2000);});
      }
    }
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
/* Un temps de repli ("-", "–", "—"…) n'est pas une vraie heure : à masquer
   à l'affichage plutôt que de montrer un tiret orphelin sans information. */
function _isPlaceholderTime(t){ return /^[\s\-–—_]*$/.test(String(t||'')); }
/* Répare les jours dont les moments sont vides ("— Moment" x2 à l'écran) :
   séquelle d'anciens voyages sauvegardés avant que la génération ne gère
   correctement ce cas, ou d'une réponse IA incomplète pour ce jour. Un
   moment sans titre réel, sans heure et sans détail n'apporte rien —
   autant le retirer plutôt que d'afficher un texte générique cassé. */
function _repairPlanMoments(plan){
  if(!Array.isArray(plan)) return;
  plan.forEach(function(p){
    try{
    if(!p || !Array.isArray(p.moments)) return;
    var real=p.moments.filter(function(m){
      if(!m || typeof m!=='object') return false;
      var title=Array.isArray(m)?m[2]:(m.ti||m.title||'');
      var desc=Array.isArray(m)?m[3]:(m.d||m.desc||'');
      var time=Array.isArray(m)?m[0]:(m.t||'');
      title=String(title||''); desc=String(desc||''); time=String(time||'');
      /* le "vide" a été stocké avec différents caractères de tiret selon la
         version de la génération (-, –, —) ou juste des espaces : les traiter
         tous comme équivalents plutôt que de comparer à un seul caractère. */
      return (title && title!=='Moment') || !!desc.trim() || (!_isPlaceholderTime(time) && !!time.trim());
    });
    p.moments = real.length ? real : [[' - ', _kind(_momentIcon(p.title)), p.title||p.loc||'Étape', '', false]];
    }catch(e){ console.warn('[_repairPlanMoments]', e && e.message || e); try{ if(typeof window!=='undefined' && window.hsDebug) window.hsDebug('[repair] erreur jour '+(p&&p.n)+': '+(e&&e.message||e)); }catch(e2){} }
  });
}
/* Retire une référence de jour éventuellement injectée par l'IA en tête d'un
   champ texte ("J10-12 · Bunaken..." → "Bunaken...", "Jour 8 - Macro..." →
   "Macro...") : le numéro de jour est déjà déterminé par la position dans
   "plan" et ne doit jamais apparaître dans le texte affiché — séquelle
   possible de voyages générés avant l'ajout de la consigne anti-référence
   de jour dans les prompts. Répare aussi les voyages déjà sauvegardés. */
function _stripDayRef(s){
  return String(s||'')
    .replace(/^\s*jours?\s*\d+(?:\s*(?:[-–—à]|au)\s*\d+)?\s*[·:\-–—]\s*/i, '')
    .replace(/^\s*j\d+(?:[-–—]\d+)?\s*[·:\-–—]\s*/i, '');
}
function _repairPlanTitles(plan){
  if(!Array.isArray(plan)) return;
  plan.forEach(function(p){
    if(!p) return;
    try{
      if(p.title) p.title = _stripDayRef(p.title);
      if(p.desc) p.desc = _stripDayRef(p.desc);
    }catch(e){ console.warn('[_repairPlanTitles]', e && e.message || e); }
  });
}
/* Remplace les créneaux de vol inventés par l'IA (heures fictives) par le
   vol réel trouvé sur le web (buildFlightSearchPrompt / _fetchFlightPriceFromWeb).
   S'il n'y a pas de vol réel trouvé (recherche infructueuse = trajet sans vol
   pertinent), on ne force rien : le jour garde ses moments tels quels. */
/* Tronque les moments d'un jour au quota habituel SANS jamais retirer un vol
   réel qu'on vient d'injecter  -  retire en priorité les autres moments,
   en partant de la fin. */
function _trimKeepFlights(moments, cap){
  while(moments.length>cap){
    let idx=-1;
    for(let i=moments.length-1;i>=0;i--){ if(moments[i][1]!=='plane'){ idx=i; break; } }
    if(idx<0) break; /* que des vols  -  rien de plus à retirer */
    moments.splice(idx,1);
  }
}
function _injectFlightMoments(plan, flightInfo, dest){
  if(!Array.isArray(plan) || !plan.length || !flightInfo) return;
  const origin = state.origin || 'Paris';
  const cap = _momentsPerDay();
  const first = plan[0], last = plan[plan.length-1];
  /* voyage d'un seul jour : les deux vols tombent sur le même jour  -  ne
     purger les moments "plane" inventés qu'une fois, avant d'injecter les deux. */
  [first, last].forEach(function(p){ if(!Array.isArray(p.moments)) p.moments=[]; });
  if(flightInfo.outbound || flightInfo.inbound){
    first.moments = first.moments.filter(function(m){return m[1]!=='plane';});
    if(last!==first) last.moments = last.moments.filter(function(m){return m[1]!=='plane';});
  }
  if(flightInfo.outbound){
    const air = flightInfo.outbound.airline ? ('Vol '+flightInfo.outbound.airline) : 'Vol direct';
    first.moments.unshift([flightInfo.outbound.arrTime, 'plane', 'Atterrissage à '+(first.loc||dest), air, false]);
  }
  if(flightInfo.inbound){
    const air = flightInfo.inbound.airline ? ('Vol '+flightInfo.inbound.airline) : 'Vol direct';
    last.moments.push([flightInfo.inbound.depTime, 'plane', 'Envol retour vers '+origin, air, false]);
  }
  _trimKeepFlights(first.moments, cap);
  if(last!==first) _trimKeepFlights(last.moments, cap);
}

/* ── application du JSON → ITINERARY ────────────────────────────────── */
/* Format compact et TOUJOURS cohérent d'une plage de dates (indépendant du
   texte libre généré par l'IA, qui variait d'un voyage à l'autre — parfois
   "4 septembre – 26 septembre 2026" au lieu de "4–26 septembre 2026",
   provoquant un retour à la ligne sur les cartes voyage). */
function _fmtDateRangeCompact(dateFromISO, dateToISO){
  if(!dateFromISO || !dateToISO) return '';
  const from = new Date(dateFromISO), to = new Date(dateToISO);
  if(isNaN(from) || isNaN(to)) return '';
  const monthYear = function(d){ return d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}); };
  const full = function(d){ return d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}); };
  if(monthYear(from) === monthYear(to)){
    return from.getDate()+'–'+full(to);
  }
  if(from.getFullYear() === to.getFullYear()){
    return from.toLocaleDateString('fr-FR',{day:'numeric',month:'long'})+' – '+full(to);
  }
  return full(from)+' – '+full(to);
}
/* Garde-fou réutilisable (génération + rechargement d'un voyage sauvegardé) :
   la somme des nuits par hébergement DOIT correspondre à la durée réelle du
   voyage (dc jours). Sans ça, le coût d'hébergement total et les planchers
   repas/transferts (calculés sur ce nombre de nuits) sont faussés — ex: 3
   hébergements totalisant 10 nuits pour un voyage de 5 jours, doublant le
   budget affiché. Mute "stays" en place. */
function _normalizeStayNights(stays, dc){
  if(!Array.isArray(stays) || !stays.length || !(dc>0)) return;
  if(stays.length>dc) stays.length=Math.max(1,dc);
  const sum=stays.reduce(function(s,a){return s+(Number(a.nights)||0);},0);
  if(sum===dc) return;
  let running=0;
  stays.forEach(function(a,i){
    if(i===stays.length-1){ a.nights=Math.max(1,dc-running); }
    else{ a.nights=Math.max(1,Math.round((Number(a.nights)||1)*(dc/Math.max(1,sum)))); running+=a.nights; }
  });
}
function applyGenerated(skel, daysDetail, hilites, flightInfo, heroPhoto){
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
    /* Un hébergement "verified" a un prix trouvé par recherche web réelle
       (voir _mergeRealStays) — un vrai tarif de haute saison sur une île
       touristique dépasse souvent la fourchette générique du niveau de
       confort, et c'est LÉGITIME : le rejeter pour revenir à une estimation
       synthétique moins précise défait tout l'intérêt de la recherche
       réelle. On ne garde le garde-fou de fourchette que pour les prix non
       vérifiés (estimation de l'IA sans recherche), avec juste un plafond
       large pour écarter une valeur aberrante (ex: erreur de parsing). */
    const isVerified = s.verified !== false;
    let price;
    if(isVerified && rawPrice>0 && rawPrice<=accRange[1]*8){
      price=rawPrice;
    } else if(rawPrice>=accRange[0]&&rawPrice<=accRange[1]*1.3){
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
      /* String(...) : l'IA renvoie parfois "name" comme un nombre nu plutôt
         qu'une chaîne — sans coercion, le nombre reste tel quel (truthy) et
         casse tout code qui appelle .trim()/.toLowerCase() sur "n" plus loin. */
      id:'a'+(i+1), n:String(s.name||('Hébergement '+(i+1))), i:_stayIcon(s.type),
      type:s.type||'Hôtel-boutique', loc:s.loc||dest,
      tag:stayTags[i%stayTags.length]||'Sélection', rate:stayRates[i%stayRates.length]||'4,9',
      nights:_clampInt(s.nights,1,21,2), price:price,
      am:['bed','wifi',i%2?'fork':'pool'], blurb:s.blurb||'Une adresse d\'exception.',
      photo: _validStayPhoto(s.photo),
      photoPage: _validPhotoPage(s.photoPage),
      source: /^(booking|airbnb|hotels|officiel)$/i.test(String(s.source||'').trim()) ? String(s.source).trim().toLowerCase() : '',
      /* false = la recherche web anti-hallucination n'a pas pu confirmer cet
         établissement précis (voir _mergeRealStays) — l'app doit le signaler
         plutôt que de présenter un nom potentiellement inventé comme certain. */
      verified: s.verified !== false,
    };
  });
  while(stays.length<1) stays.push({id:'a1',n:'Hébergement local',i:'bed',type:'Hôtel-boutique',loc:dest,tag:'Sélection',rate:'4,9',nights:2,price:accRange[0],am:['bed','wifi','pool'],blurb:'',verified:false});

  _normalizeStayNights(stays, dc);

  const findStay=function(name){
    if(!name) return null;
    const k=String(name).toLowerCase().trim();
    return stays.find(function(s){return String(s.n||'').toLowerCase()===k;})
        ||stays.find(function(s){var sn=String(s.n||'').toLowerCase(); return sn.includes(k)||k.includes(sn);});
  };

  /* jours enrichis avec le détail éditorial + catégorie thématique */
  const detailDays=(daysDetail&&Array.isArray(daysDetail.days))?daysDetail.days:[];
  let _lastRealLoc=dest;
  const plan=(Array.isArray(skel.plan)?skel.plan:[]).map(function(p,i){
    const dd=detailDays[i]||{};
    const rawMoments=Array.isArray(dd.moments)&&dd.moments.length?dd.moments:[{t:' - ',k:_momentIcon(p.title),ti:p.title||'Étape',d:''}];
    const moments=rawMoments.slice(0,_momentsPerDay()).map(function(m){return [m.t||' - ',_kind(m.k||_momentIcon(m.ti)),m.ti||'Moment',m.d||'',!!m.free];});
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
    /* p.loc peut contenir l'intitulé complet d'un jour de transfert plutôt
       qu'un lieu simple (ex: "Hiroshima → Narita") — voir _actLocLabel,
       déjà utilisé pour les activités pour la même raison. Sans ce
       nettoyage ICI aussi, la mini-carte (maps.js, _dedupPlanLocs) affiche
       ce trajet complet comme étiquette de ville, illisible et superposé
       à ses voisines. */
    let cleanLoc=_actLocLabel(p.loc, dest);
    /* "loc" invalide (thème de journée type "Trajets sud-est" plutôt qu'un
       vrai lieu) malgré la consigne de prompt : on retombe sur l'hébergement
       du jour, DÉJÀ un vrai lieu établi ailleurs dans la même réponse IA
       (stays[].loc), plutôt que de laisser passer une valeur non géocodable. */
    if(!_isPlaceLikeLoc(cleanLoc)){
      const stayLoc=stay&&stay.loc?_actLocLabel(stay.loc, ''):'';
      cleanLoc=stayLoc||_lastRealLoc||dest;
    }
    _lastRealLoc=cleanLoc;
    return {
      n:i+1, title:p.title||('Étape '+(i+1)), loc:cleanLoc,
      desc:dd.desc||p.hook||'', tip:dd.tip||'',
      tags:tags, category:category,
      wx:[GEN_SKY.includes(p.sky)?p.sky:'sun', p.temp||'28°'],
      night:stay?{acc:stay.id}:{n:p.night||'Nuit sur place',loc:cleanLoc},
      moments:moments,
      restaurant:dd.restaurant||null,
      wellness:dd.wellness||null,
    };
  });
  if(!plan.length) return false;
  /* dc (nombre de jours générés) correspond aux nuits d'hébergement, pas
     forcément à la vraie plage de dates choisie : un séjour du 15 au 22
     août compte 7 nuits d'hôtel MAIS couvre 8 jours calendaires en
     incluant le jour du retour (on ne dort plus sur place, mais on y
     passe la matinée avant le vol). Sans ce filet, ce dernier jour
     calendaire — et le vol retour qui va avec — disparaissait purement
     et simplement de l'itinéraire. On n'ajoute ce jour QUE quand l'écart
     réel le justifie exactement (jamais inventé sans dates précises). */
  if(state.dateFrom && state.dateTo){
    const fromD = new Date(state.dateFrom), toD = new Date(state.dateTo);
    if(!isNaN(fromD) && !isNaN(toD)){
      const calendarDays = Math.round((toD - fromD) / 86400000) + 1;
      if(calendarDays === plan.length + 1){
        const lastDay = plan[plan.length - 1];
        plan.push({
          n: plan.length + 1, title: 'Retour', loc: lastDay ? lastDay.loc : dest,
          desc: 'Dernières heures avant le départ.', tip: '',
          tags: [TAG_MAP.plane, TAG_MAP.pin], category: 'transit',
          wx: (lastDay && Array.isArray(lastDay.wx)) ? lastDay.wx : ['sun', '—'],
          night: null,
          moments: [],
          restaurant: null, wellness: null,
        });
      }
    }
  }
  _injectFlightMoments(plan, flightInfo, dest);
  _repairPlanMoments(plan);
  _repairPlanTitles(plan);

  /* budget  -  calibré sur le niveau de confort, la durée et le nb de voyageurs */
  /* fourchettes calibrées sur l'Europe de l'Ouest (colFactor=1)  -  ajustées
     au coût de vie réel de la destination : sans ça, un Confort en
     Indonésie (colFactor 0.55) était budgété au même prix/jour qu'en
     Suisse, gonflant artificiellement le total affiché. */
  const PPD_RANGE={'Éco':[60,100],'Confort':[120,220],'Luxe':[250,500],'Ultra':[500,900]};
  const ppd=(PPD_RANGE[level]||PPD_RANGE['Confort']).map(function(v){return Math.round(v*colFactor);});
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
      var realN=plan.length;
      var compact=_fmtDateRangeCompact(state.dateFrom, state.dateTo);
      if(compact) return compact+' · '+realN+' jour'+(realN>1?'s':'');
      // Repli : pas de dates précisées par le client, on garde le texte de l'IA
      // (nombre de jours corrigé) plutôt que rien.
      var raw=skel.dates||'Sur-mesure';
      raw=raw.replace(/\d+\s*jours?/i, realN+' jours');
      return raw;
    })(), days:plan.length, level:level,
    budgetTotal:budgetTotal, coords:skel.coords||dest, distance:plan.length+' jours',
    region:skel.region||'', season:skel.season||'', generated:true,
    theme:themeName, palette:THEME_PALETTES[themeName],
    dateFrom:state.dateFrom||'', dateTo:state.dateTo||'',
    _flightInfo:flightInfo||null, /* préservé pour recalcul budget après modif IA */
    heroPhoto:heroPhoto||'',
    /* Nombre de voyageurs RÉELLEMENT utilisé pour générer ce voyage précis —
       state.travelers est une valeur de questionnaire "vivante" qui change
       dès qu'on compose un nouveau voyage (ou revient à sa valeur par défaut
       au rechargement de l'app) : sans ce champ propre à l'itinéraire, rouvrir
       un voyage sauvegardé (ou juste rafraîchir son budget) affichait le
       nombre de voyageurs du QUESTIONNAIRE ACTUEL plutôt que celui du voyage. */
    travelers:travelers,
  });

  /* highlights */
  if(hilites){
    ITINERARY.gems=hilites.gems||[];
    ITINERARY.highlights=hilites.highlights||{};
    ITINERARY.essentials=hilites.essentials||{};
    ITINERARY.budget_note=hilites.budget_note||'';
  }

  deriveActivities(plan, dest, skel.region, skel.country);
  const finalBudgetTotal=deriveBudget(stays, budgetTotal, dest, skel.region, skel.country, travelers, flightInfo);
  if(finalBudgetTotal && finalBudgetTotal!==budgetTotal) ITINERARY.budgetTotal=finalBudgetTotal;
  if(typeof SEASON!=='undefined'&&skel.season){SEASON.best=skel.season;SEASON.note=skel.season;}
  return true;
}

/* ── activités & budget dérivés ─────────────────────────────────────── */
const ACT_PRICE={peaks:78,arch:55,leaf:62,wave:95,droplet:48,fork:120,sun:52,star:88,camera:60,ticket:70,moon:64,compass:58,pin:50,plane:0,bed:0};
const ACT_DUR=['2 h','3 h','4 h','2 h 30','5 h','3 h 30'];
/* Filet de sécurité si l'IA n'a pas correctement rempli "free" : mots-clés
   d'activités en accès libre, non réservables (plage publique, point de vue,
   photo, balade, marché à parcourir…). */
const FREE_ACT_RX=/plage|point de vue|belvédère|vue panoramique|photo|coucher de soleil|lever de soleil|balade|promenade|marché|flânerie|rue|place|église|jardin public|front de mer|quartier/i;
function _isFreeActivity(m){
  if(m[4]===true) return true;
  if(m[4]===false) return false;
  return FREE_ACT_RX.test((m[2]||'')+' '+(m[3]||''));
}
/* Un moment "transit" (ferry, vol, transfert, arrivée/départ terminal/port…)
   n'est pas une activité réservable, même quand l'IA lui a attribué à tort
   une icône thématique (ex: "Ternate port arrivée" en "arch") : sans ce
   filtre textuel, ces créneaux de déplacement se retrouvent listés comme
   de vraies expériences sur l'écran Activités. */
const TRANSIT_ACT_RX=/\bvols?\b|aéro|ferry|traversée|transfert|embarquement|débarquement|\barriv[ée]e?\b|\bdépart\b|terminal|\bport\b/i;
/* L'IA réutilise parfois pour "loc" le libellé du jour entier plutôt qu'un
   lieu précis, notamment sur les jours de transfert ("Manado → Togian
   Islands (320km)")  -  toutes les activités du jour héritaient alors du
   MÊME trajet complet en sous-titre. On n'en garde que la destination. */
function _actLocLabel(loc, fallback){
  const s=String(loc||'').replace(/\(.*?\)/g,'').trim();
  const parts=s.split(/→|->/);
  const picked=(parts.length>1?parts[parts.length-1]:s).trim();
  return picked || fallback || '';
}
/* Malgré la consigne de prompt ("loc":"ville précise"), l'IA renvoie parfois
   un thème de journée à la place d'un lieu réel (ex: "Trajets sud-est" pour
   une journée d'excursions) — un rappel de plus dans le prompt ne suffit pas
   à garantir 100% de conformité. Cette valeur n'est pas géocodable : la
   carte perd son marqueur pour ce jour et le tracé se coupe. Plutôt que de
   faire confiance à l'IA, on vérifie et on retombe sur un lieu DÉJÀ réel et
   établi ailleurs dans la même réponse (l'hébergement du jour, cf. "stays")
   au lieu d'un thème inventé. */
const _NON_PLACE_LOC_RX=/^(trajets?|journ[ée]e?s?|excursions?|balades?|circuits?|d[ée]tente|d[ée]couverte(s)?|visite libre|route(s)?\s+(vers|pour)|direction|environs|alentours|repos|libre)\b/i;
function _isPlaceLikeLoc(loc){
  const s=String(loc||'').trim();
  return !!s && !_NON_PLACE_LOC_RX.test(s);
}
function deriveActivities(plan, dest, region, country){
  if(typeof ACTIVITIES==='undefined') return;
  try{
    const colFactor=Number(_costOfLivingFactor(dest, region, country))||1;
    const picks=[];
    (Array.isArray(plan)?plan:[]).forEach(function(p){
      (Array.isArray(p.moments)?p.moments:[]).forEach(function(m){
        /* exclure les transferts/déplacements : ce ne sont pas de vraies activités réservables */
        if(m[1]==='plane'||m[1]==='bed'||m[1]==='compass') return;
        if(TRANSIT_ACT_RX.test((m[2]||'')+' '+(m[3]||''))) return;
        picks.push({day:p.n,i:m[1],n:m[2],loc:_actLocLabel(p.loc, dest),tag:(TAG_MAP[m[1]]||TAG_MAP.pin)[1],free:_isFreeActivity(m)});
      });
    });
    ACTIVITIES.length=0;
    picks.forEach(function(a,i){
      const base=a.free?0:Math.round(((ACT_PRICE[a.i]||55)+(i%2?7:0))*colFactor);
      ACTIVITIES.push({id:'ac'+(i+1),day:a.day,i:a.i,n:a.n,loc:a.loc,dur:ACT_DUR[i%ACT_DUR.length],rate:['4,9','4,95','4,8','4,88','4,92','4,97'][i%6],price:base,tag:a.tag,free:a.free});
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
     C'est un MINIMUM absolu, pas une estimation  -  en dessous, le budget affiché
     serait simplement faux (ex: 107€ pour une semaine en Sardaigne est intenable). */
  const FOOD_PER_DAY_PER_PERSON=30;
  const foodFloor=Math.round(FOOD_PER_DAY_PER_PERSON*colFactor*travelers*days);
  /* plancher de transferts locaux : ~8€/jour/pers (taxis, locations, essence) */
  const TRANSFER_PER_DAY_PER_PERSON=8;
  const transferFloor=Math.round(TRANSFER_PER_DAY_PER_PERSON*colFactor*travelers*days);

  /* vols = prix issu d'une recherche web fraîche si disponible et plausible (et
     numériquement valide  -  on se méfie d'une réponse IA mal formée),
     sinon fourchette statique par zone */
  const flightAmountNum=flightInfo?Number(flightInfo.amount):NaN;
  const hasRealFlight=isFinite(flightAmountNum)&&flightAmountNum>0&&flightAmountNum<20000;
  const flightsRaw=hasRealFlight?flightAmountNum:(Number(_flightEstimate(dest, region, country, travelers))||0);

  /* Plancher réaliste calculé UNIQUEMENT à partir de coûts réels/invariants
     (hébergement réel, vols réel/estimé, planchers repas+transferts) — jamais
     à partir du total précédent. C'est essentiel : deriveBudget() est rappelée
     à chaque ouverture d'un voyage sauvegardé (avec le total déjà recalculé la
     fois précédente en entrée). Si ce plancher dépendait du total reçu, il
     grossirait indéfiniment à chaque rappel au lieu de se stabiliser. */
  const minTotal=stayCost+flightsRaw+foodFloor+transferFloor;
  total=Math.max(total, minTotal);

  const accom=stayCost;
  const flights=flightsRaw;
  const food=foodFloor;
  const transfers=transferFloor;
  /* le reste au-delà des coûts réels et planchers va aux activités */
  const activities=Math.max(0, total-accom-flights-food-transfers);
  const travelersLbl=travelers+' voyageur'+(travelers>1?'s':'');
  const flightSub=(state.origin||'Paris')+' · aller-retour · '+travelersLbl+(hasRealFlight&&flightInfo.source?' · estimation '+flightInfo.source:' · estimation')

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
  const excludeLine=(excluded&&excluded.length)?('Ne propose AUCUNE des destinations déjà suggérées et refusées : '+excluded.join(', ')+'.'):'';
  const days = b.daysCount || 7;
  const origin = state.origin || 'Paris';

  /* ── Directive destination selon l'occasion ── */
  const occ = state.occasion;
  const occasionDest = {
    'evjf': [
      'OCCASION  -  EVJF : la destination DOIT offrir impérativement :',
      '* Une scène de bien-être (spas, hammams, soins privatisables pour le groupe)',
      '* Une vie nocturne ou des terrasses/rooftops de qualité (couchers de soleil mémorables)',
      '* Des lieux photogéniques authentiques (architecture, nature, marchés colorés)',
      '* Des ateliers locaux (céramique, cocktails, cuisine, parfum)',
      '* Des restaurants festifs avec ambiance',
      'DESTINATIONS IDÉALES EVJF : Marrakech, Lisbonne, Porto, Séville, Barcelone, Valence, Côte d\'Azur, îles grecques (Santorin, Mykonos), Ibiza hors saison, Dubrovnik, Istanbul, Bali.',
      'ÉVITER : destinations sans vie sociale, zones trop isolées, destinations à fort jet-lag pour un court séjour.',
    ].join('\n'),
    'evg': [
      'OCCASION  -  EVG : la destination DOIT offrir impérativement :',
      '* Des activités sportives et à sensations (surf, quad, karting, paintball, accrobranche, jet ski)',
      '* Une vie nocturne authentique (bars locaux, concerts, soirées)',
      '* Des options de restauration conviviales (grillades, street food premium)',
      '* Des espaces pour le groupe (villas, terrasses)',
      'DESTINATIONS IDÉALES EVG : Lisbonne, Porto, Madrid, Barcelone, Budapest, Prague, Riga, Tallinn, Marrakech, Agadir, îles Canaries, Lagos (Portugal), Algarve, Malte.',
      'ÉVITER : destinations trop luxe/calmes sans activités physiques, zones rurales sans vie sociale.',
    ].join('\n'),
    'lune-de-miel': [
      'OCCASION  -  LUNE DE MIEL : la destination DOIT offrir :',
      '* Des hôtels avec suites ou villas privées (piscine privée, terrasse, vue mer ou nature)',
      '* Une scène gastronomique de qualité avec dîners romantiques',
      '* Des paysages à couper le souffle (couchers de soleil, nature préservée)',
      '* Une atmosphère intime et hors des sentiers touristiques de masse',
      'DESTINATIONS IDÉALES LUNE DE MIEL : Maldives, Bora Bora, Seychelles, Bali, Sri Lanka, Santorin (hors saison), Côte Amalfitaine, Sicile sud, Madère, Jordanie (Pétra+Wadi Rum), îles Éoliennes, Lanzarote.',
    ].join('\n'),
    'famille': [
      'OCCASION  -  EN FAMILLE : la destination DOIT offrir :',
      '* Sécurité et accessibilité (hôpitaux, routes correctes, eau potable)',
      '* Des activités pour tous les âges (plage, animaux, aventure douce)',
      '* Des hébergements spacieux avec piscine et espace enfants',
      '* Une gastronomie accessible aux enfants',
      'DESTINATIONS IDÉALES FAMILLE : Portugal (Algarve), Grèce (Rhodes, Crète), Îles Canaries, Sicile, Sardaigne, Costa Rica, Thaïlande (Chiang Mai + plages), Maroc (Marrakech + Essaouira), Jordanie, Maurice.',
    ].join('\n'),
    'anniversaire': [
      'OCCASION  -  ANNIVERSAIRE : destination qui offre une expérience mémorable et unique :',
      '* Un lieu d\'exception rarement visité (destination "wow")',
      '* Au moins une expérience hors du commun possible (safari, trekking, plongée, temple isolé)',
      '* Une gastronomie marquante',
      'DESTINATIONS IDÉALES ANNIVERSAIRE : Kenya (safari), Islande, Pérou (Machu Picchu), Japon, Éthiopie, Oman, Géorgie, Albanie côtière, îles Féroé.',
    ].join('\n'),
    'solo': [
      'OCCASION  -  VOYAGE SOLO : destination sûre et propice aux rencontres :',
      '* Infrastructure touristique développée (transports, hébergements variés)',
      '* Culture locale riche et habitants accueillants',
      '* Communauté de voyageurs solo présente',
      '* Sécurité correcte (éviter zones à risque)',
      'DESTINATIONS IDÉALES SOLO : Japon, Portugal, Thaïlande, Géorgie, Vietnam, Colombie (Medellin+Cartagena), Maroc, Islande, Nouvelle-Zélande.',
    ].join('\n'),
  };

  var distConstraint = '';
  if(days <= 4){
    distConstraint = 'CONTRAINTE ABSOLUE : séjour '+days+'j. Vol max 3h depuis '+origin+'. Europe occidentale et Méditerranée uniquement. INTERDIT : Asie, Amériques, Afrique sub-saharienne.';
  } else if(days <= 7){
    distConstraint = 'CONTRAINTE ABSOLUE : séjour '+days+'j. Vol max 5h depuis '+origin+'. Europe, Méditerranée, Maghreb, Canaries, Turquie, Jordanie, Égypte. INTERDIT : Asie du Sud-Est, Amériques.';
  } else if(days <= 10){
    distConstraint = 'CONTRAINTE : séjour '+days+'j. Vol max 8h. Europe, Maghreb, Afrique de l\'Est, Moyen-Orient, Inde, Sri Lanka, Océan Indien, Asie centrale.';
  } else if(days <= 14){
    distConstraint = 'CONTRAINTE : séjour '+days+'j. Vol max 12h. Toutes destinations sauf Océanie et Pacifique Sud lointain.';
  }

  const compact=[];
  if(state.styles&&state.styles.length) compact.push('Style: '+state.styles.join(', '));
  if(state.interests&&state.interests.length) compact.push('Intérêts: '+state.interests.join(', '));
  if(state.dream) compact.push('Envie: '+state.dream.slice(0,100));
  if(state.dietary) compact.push('Régime: '+state.dietary);
  if(state.alreadyDone) compact.push('Éviter: '+state.alreadyDone);

  return [
    'Tu es le cartographe senior de Hic Sunt, maison de voyages haut de gamme spécialisée dans les destinations hors des sentiers battus.',
    'Propose UNE SEULE destination parfaitement adaptée à ce profil.',
    '',
    '═══ BRIEF CLIENT ═══',
    b.lines,
    compact.length ? ('Préférences: '+compact.join(' | ')) : '',
    '',
    occ && occasionDest[occ] ? ('═══ CRITÈRES DESTINATION SELON L\'OCCASION ═══\n'+occasionDest[occ]+'\n') : '',
    distConstraint ? ('═══ CONTRAINTE DISTANCE  -  RESPECTE IMPÉRATIVEMENT ═══\n'+distConstraint+'\n') : '',
    excludeLine,
    distConstraint ? ('RAPPEL FINAL  -  CONTRAINTE RÉDHIBITOIRE : '+distConstraint.split('.')[0]+'.') : '',
    '',
    'Réponds UNIQUEMENT en JSON compact :',
    '{"dest":"nom du pays/région","country":"pays","tagline":"phrase poétique évocatrice max 12 mots","teaser":"2 phrases qui donnent envie en lien avec l\'occasion et le brief max 35 mots","coords":"ex: 6°55′N · 79°51′E"}',
  ].filter(Boolean).join('\n');
}
async function suggestDestination(excluded){
  /* 3 tentatives max pour obtenir une destination cohérente avec la durée */
  const days = buildBrief().daysCount || 7;
  for(var attempt=0; attempt<3; attempt++){
    const result = await _completeJSON(buildDestinationSuggestPrompt(excluded));
    if(!result || !result.dest) continue;
    /* Valider la distance selon les jours */
    if(_isDestinationValid(result.dest, result.country, days)){
      return result;
    }
    /* Destination invalide : on retire de la liste et on réessaie */
    excluded = (excluded||[]).concat([result.dest]);
  }
  return await _completeJSON(buildDestinationSuggestPrompt(excluded));
}

/* Vérifie que la destination est atteignable depuis Paris pour la durée donnée */
function _isDestinationValid(dest, country, days){
  if(days > 10) return true; /* Pas de restriction pour les longs séjours */
  const tooFar5 = ['yémen','yemen','oman','arabie','pakistan','inde','sri lanka',
    'thaïlande','vietnam','cambodge','laos','myanmar','birmanie','malaisie',
    'indonésie','philippines','japon','corée','chine','mongolie',
    'australie','nouvelle-zélande','afrique du sud','mozambique','tanzanie',
    'kenya','éthiopie','mexique','cuba','états-unis','canada','brésil',
    'pérou','colombie','argentine','chili','équateur','bolivia','paraguay','uruguay'];
  const tooFar8 = ['japon','corée','chine','mongolie','australie','nouvelle-zélande',
    'indonésie','philippines','mexique','cuba','brésil','pérou','colombie',
    'argentine','chili','équateur'];
  const d = ((dest||'')+(country||'')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if(days <= 7 && tooFar5.some(function(c){ return d.indexOf(c)>=0; })) return false;
  if(days <= 10 && tooFar8.some(function(c){ return d.indexOf(c)>=0; })) return false;
  return true;
}

/* ── recherche web du prix + horaires de vol réels (avec fallback statique) ── */
function buildFlightSearchPrompt(dest, country, dateFrom, dateTo, travelers){
  const origin = state.origin || 'Paris';
  const period = (dateFrom && dateTo) ? ('le '+dateFrom+' (aller) et le '+dateTo+' (retour)') : 'pour les prochains mois';
  return [
    'Cherche sur le web un vol aller-retour réaliste et actuel en classe économique de '+origin+' vers '+(dest||'')+' ('+(country||'')+'), '+period+'.',
    'Base-toi sur des comparateurs de vols fiables (Google Flights, Kayak, Skyscanner, sites de compagnies aériennes) pour le prix ET les horaires (compagnie, heures de départ/arrivée réalistes pour cette liaison, avec éventuelle escale).',
    'Réponds UNIQUEMENT en JSON compact, sans texte ni markdown autour, au format exact :',
    '{"perPersonMin":0,"perPersonMax":0,"source":"nom du comparateur utilisé",'
    +'"outbound":{"airline":"","depTime":"HH:MM","arrTime":"HH:MM"},'
    +'"inbound":{"airline":"","depTime":"HH:MM","arrTime":"HH:MM"}}',
    '"outbound" = vol aller (départ '+origin+', arrivée près de '+(dest||'')+') le jour '+(dateFrom||'du début du séjour')+'.',
    '"inbound" = vol retour (départ près de '+(dest||'')+', arrivée '+origin+') le jour '+(dateTo||'de fin du séjour')+'.',
    'Les prix sont en euros, par personne, aller-retour. Si tu ne trouves rien de fiable, réponds {"perPersonMin":0,"perPersonMax":0,"source":"","outbound":null,"inbound":null}.',
  ].join('\n');
}
function _validFlightLeg(leg){
  return !!(leg && typeof leg==='object' && /^\d{1,2}:\d{2}$/.test(leg.depTime||'') && /^\d{1,2}:\d{2}$/.test(leg.arrTime||''));
}
async function _fetchFlightPriceFromWeb(dest, country, dateFrom, dateTo, travelers){
  try{
    const prompt = buildFlightSearchPrompt(dest, country, dateFrom, dateTo, travelers);
    const res = await fetch(SUPABASE_ENDPOINT,{
      method:'POST',
      headers:SUPABASE_HEADERS,
      body:JSON.stringify({prompt:prompt, webSearch:true})
    });
    if(!res.ok) return null;
    const data = await res.json();
    if(data.error) return null;
    const j = parseItineraryJSON(data.result||'');
    if(!j || !j.perPersonMin || !j.perPersonMax) return null;
    const perPerson = Math.round((j.perPersonMin+j.perPersonMax)/2);
    if(!isFinite(perPerson) || perPerson<=0) return null;
    return {
      amount: perPerson*Math.max(1,travelers||1), source: j.source||'',
      outbound: _validFlightLeg(j.outbound)?j.outbound:null,
      inbound: _validFlightLeg(j.inbound)?j.inbound:null,
    };
  }catch(e){ return null; }
}

/* ── recherche web de VRAIS hébergements par zone (anti-hallucination) ── */
/* Dates réelles d'arrivée/de départ de CHAQUE hébergement (positionnel,
   cumul des nuits dans l'ordre des zones)  -  pour que la recherche web du
   prix cible le tarif RÉEL sur les VRAIES dates du séjour plutôt qu'une
   moyenne générique déconnectée du calendrier, incohérente avec le budget
   affiché. */
function _computeStayDateRanges(stays, dateFromISO){
  if(!dateFromISO || !Array.isArray(stays)) return (stays||[]).map(function(){ return null; });
  const from = new Date(dateFromISO);
  if(isNaN(from)) return stays.map(function(){ return null; });
  let offset = 0;
  const fmt = function(d){ return d.toISOString().slice(0,10); };
  return stays.map(function(s){
    const nights = Math.max(1, Number(s.nights)||1);
    const checkinD = new Date(from.getTime() + offset*86400000);
    const checkoutD = new Date(checkinD.getTime() + nights*86400000);
    offset += nights;
    return { checkin: fmt(checkinD), checkout: fmt(checkoutD), nights: nights };
  });
}
/* Le web search de l'IA ne peut pas naviguer dans les pages dynamiques
   Booking/Airbnb : il ne peut que citer une URL déjà vue dans un extrait de
   recherche. Le risque n'est pas seulement une URL hors-sujet mais une URL
   *inventée* qui ressemble à un vrai pattern (ex: "q-xx.bstatic.com/xdata/
   [photo_id]") — d'où la double validation : domaine attendu ET absence de
   marqueurs de placeholder qu'un vrai extrait de recherche ne contiendrait
   jamais. */
/* Fusionne une liste d'hébergements "ossature" (potentiellement inventés par
   l'IA pour donner du style au JSON) avec les résultats de la recherche web
   anti-hallucination, matchés par zone plutôt que par index brut (l'IA peut
   omettre/vider une entrée sans respecter l'ordre). Marque "verified:false"
   quand aucun nom réel n'a pu être confirmé, plutôt que de garder le nom
   inventé sans distinction — l'app doit pouvoir signaler ce cas à l'écran. */
function _mergeRealStays(origList, zonesList, realStays){
  const normS=function(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[^\x00-\x7F]/g,'').trim();};
  const usedStay={};
  return origList.map(function(orig, i){
    const zone = zonesList[i];
    let real = null;
    if(Array.isArray(realStays)){
      for(let m=0; m<realStays.length; m++){
        if(usedStay[m]) continue;
        const rz = normS(realStays[m] && realStays[m].zone);
        if(rz && (rz===normS(zone) || rz.indexOf(normS(zone))>=0 || normS(zone).indexOf(rz)>=0)){
          real = realStays[m]; usedStay[m]=true; break;
        }
      }
      if(!real && realStays[i] && !usedStay[i]){ real = realStays[i]; usedStay[i]=true; }
    }
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
        photo: _validStayPhoto(real.photo),
        photoPage: _validPhotoPage(real.photo_page),
        source: /^(booking|airbnb|hotels|officiel)$/i.test(String(real.source||'').trim()) ? String(real.source).trim().toLowerCase() : '',
        verified: true,
      };
    }
    return Object.assign({}, orig, { verified: false });
  });
}
/* Domaines acceptés : CDN connus et légitimes de photos d'hébergement que
   la recherche web peut réellement citer (vus tels quels dans un extrait
   de résultat) — élargi au-delà de Booking/Airbnb/Wikimedia pour couvrir
   TripAdvisor et les photos Google Maps/Business (lh3/lh5.googleusercontent),
   deux sources très fréquentes pour un hôtel quelconque. Ces URLs
   contiennent des identifiants longs et non-devinables : un modèle ne peut
   pas les "construire" par hasard, seulement les avoir vues. */
function _validStayPhoto(url){
  if(typeof url!=='string') return '';
  const u=url.trim();
  if(!/^https:\/\/([a-z0-9-]+\.)?(bstatic\.com|muscache\.com)\/.+\.(jpe?g|png|webp)(\?.*)?$/i.test(u)
     && !/^https:\/\/upload\.wikimedia\.org\/.+\.(jpe?g|png)$/i.test(u)
     && !/^https:\/\/(dynamic-media-cdn|media-cdn)\.tripadvisor\.com\/.+\.(jpe?g|png|webp)(\?.*)?$/i.test(u)
     && !/^https:\/\/lh[3-6]\.googleusercontent\.com\/.+$/i.test(u)) return '';
  if(/\[|\]|xdata\/x|photo_?id|example\.com|placeholder/i.test(u)) return '';
  return u;
}
/* Contrairement à _validStayPhoto (embarquée en <img>, doit être une image
   directe et fiable), "photo_page" n'est qu'un lien externe cliquable — le
   risque d'un mauvais lien est bien moindre qu'une image cassée, donc la
   validation reste légère (domaine plausible + pas de marqueur fictif). */
function _validPhotoPage(url){
  if(typeof url!=='string') return '';
  const u=url.trim();
  if(!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\//i.test(u)) return '';
  if(/\[|\]|example\.com|placeholder/i.test(u)) return '';
  return u;
}
function buildStaySearchPrompt(dest, zones, level, dateRanges){
  const lvl = (level||'Confort');
  const lvlGuide = lvl.indexOf('Éco')>=0?'auberges, guesthouses, agriturismi simples'
    : (lvl.indexOf('Luxe')>=0||lvl.indexOf('Ultra')>=0)?'hôtels 4-5 étoiles, Relais & Châteaux, villas de luxe, boutique-hôtels haut de gamme'
    : 'boutique-hôtels, agriturismi de charme, maisons d\'hôtes 3-4 étoiles';
  const hasDates = Array.isArray(dateRanges) && dateRanges.some(Boolean);
  return [
    'Cherche sur le web des hébergements RÉELS et ACTUELLEMENT EN ACTIVITÉ pour un séjour à '+(dest||'')+'.',
    'Pour chacune de ces zones, trouve 1 hébergement réel et vérifiable ('+lvlGuide+') :',
    zones.map(function(z,i){
      const dr = dateRanges && dateRanges[i];
      const dateInfo = dr ? (' — séjour du '+dr.checkin+' au '+dr.checkout+' ('+dr.nights+' nuit'+(dr.nights>1?'s':'')+')') : '';
      return (i+1)+'. '+z+dateInfo;
    }).join('\n'),
    '',
    'EXIGENCES STRICTES :',
    '- Uniquement des établissements qui EXISTENT VRAIMENT (vérifiables sur Booking, Google Maps, ou leur site officiel).',
    '- Nom EXACT tel qu il apparait en ligne. Aucune invention, aucune approximation.',
    '- EXCLUSION ABSOLUE ET PRIORITAIRE : si tes résultats de recherche indiquent, même une seule fois, que l\'établissement est "définitivement fermé"/"permanently closed"/"closed down"/"fermé"/"n\'existe plus"/"a fermé ses portes" (peu importe qu\'il ait été réel et réputé), tu DOIS l\'exclure et chercher un autre établissement réel et actuellement ouvert pour cette zone — ne le propose sous aucun prétexte, même si aucune alternative n\'est trouvée (mets alors "name":"").',
    '- Si tu n es pas certain qu un établissement existe dans une zone, ou si son statut d\'ouverture actuel est incertain, mets "name":"" pour cette zone plutôt que de risquer un établissement fermé.',
    '- IMPORTANT — ne confonds pas deux niveaux d\'exigence différents : "name" exige une certitude forte (l\'établissement existe et n\'est pas fermé) ; "price" n\'exige qu\'une ESTIMATION raisonnable, jamais une certitude. Si tu as trouvé un établissement réel et ouvert mais que tu ne peux pas confirmer son tarif exact pour des dates lointaines (plus de quelques mois), tu DOIS quand même renseigner "name" avec ce vrai nom et donner une fourchette de prix réaliste pour ce type d\'établissement — ne mets JAMAIS "name":"" simplement parce que le prix précis est incertain, ce sont deux champs indépendants.',
    hasDates
      ? '- Prix : cherche le tarif RÉEL actuellement affiché (Booking, site officiel) pour CES dates précises indiquées ci-dessus, pas une moyenne générique — c\'est ce prix qui sert de base au budget affiché au client. Si le tarif exact pour ces dates n\'est pas trouvable (dates lointaines, pas encore ouvertes à la réservation...), donne la fourchette actuelle la plus réaliste pour ce type d\'établissement à cette période de l\'année — un prix estimé reste bien plus utile qu\'un champ vide.'
      : '- Prix indicatif par nuit réaliste en euros pour 2 personnes.',
    '- "source" : indique sur quelle plateforme tu as vérifié l\'existence de cet établissement dans tes résultats de recherche : "booking", "airbnb", "hotels" ou "officiel" (site propre à l\'établissement). Laisse vide si tu n\'es pas sûr.',
    '- "photo" : cherche activement une vraie photo de cet établissement précis (page Booking/Airbnb, fiche TripAdvisor, fiche Google Maps/Business) et regarde si l\'URL complète de l\'image apparaît littéralement dans tes résultats de recherche — c\'est fréquent, ne t\'en prive pas si elle y est. La seule règle est de ne JAMAIS inventer ou reconstruire une URL à partir d\'un pattern connu (ex: "q-xx.bstatic.com/...", des identifiants entre crochets) : uniquement une URL que tu as VUE mot pour mot, telle quelle, dans un extrait/snippet de recherche. Si tu ne l\'as pas vue ainsi, laisse "photo" VIDE plutôt que de risquer une URL fictive qui cassera l\'affichage.',
    '- "photo_page" (différent de "photo") : si tu as trouvé une PAGE web réelle qui contient des photos de cet établissement (fiche TripAdvisor, fiche Google Maps, page galerie du site officiel) sans pouvoir en extraire l\'URL d\'image directe, indique l\'URL de cette page ici — l\'utilisateur pourra cliquer pour voir les photos lui-même. Cette URL doit aussi avoir été VUE littéralement dans tes résultats, jamais construite.',
    '',
    'Réponds UNIQUEMENT en JSON compact valide, sans texte autour :',
    '{"stays":[{"zone":"nom de la zone","name":"nom exact reel","type":"type/standing","price":0,"photo":"","photo_page":"","source":"","blurb":"description courte basee sur des infos reelles"}]}',
  ].join('\n');
}
async function _fetchRealStays(dest, zones, level, dateRanges){
  for(var attempt=0; attempt<2; attempt++){
    if(attempt>0){ await new Promise(function(r){ setTimeout(r, 1500); }); }
    try{
      const res = await fetch(SUPABASE_ENDPOINT,{
        method:'POST',
        headers:SUPABASE_HEADERS,
        body:JSON.stringify({prompt:buildStaySearchPrompt(dest, zones, level, dateRanges), webSearch:true})
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
      return j.stays; /* ne pas filtrer : la correspondance par index avec `zones` doit rester intacte */
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
    '- EXCLUSION ABSOLUE ET PRIORITAIRE : si tes résultats de recherche indiquent, même une seule fois, que l\'établissement est "définitivement fermé"/"permanently closed"/"closed down"/"fermé"/"n\'existe plus"/"a fermé ses portes" (peu importe qu\'il ait été réel et réputé), tu DOIS l\'exclure et chercher une autre adresse réelle et actuellement ouverte pour ce lieu — ne le propose sous aucun prétexte, même si aucune alternative n\'est trouvée (mets alors "name":"").',
    '- Si tu n es pas certain pour un lieu, ou si le statut d\'ouverture actuel est incertain, mets "name":"" pour ce lieu plutôt que de risquer une adresse fermée.',
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
        headers:SUPABASE_HEADERS,
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

/* ── recherche web de VRAIES pépites + avis voyageurs (anti-hallucination) ──
   Jusqu'ici les "pépites cachées" étaient entièrement inventées par l'IA sans
   recherche web (contrairement aux hébergements/restaurants/vols) : ni le lieu
   ni le "commentaire de voyageur" cité n'étaient garantis réels. On recherche
   maintenant sur le web les avis/forums/blogs réels pour ancrer chaque pépite
   dans un vrai retour d'expérience  -  ce qu'aucun générateur purement génératif
   ne fait. */
function buildGemsSearchPrompt(dest, country, region, interests){
  const interestsLine = (interests && interests.length)
    ? 'Centres d\'intérêt du voyageur, à privilégier dans le choix des pépites : '+interests.join(', ')+'.'
    : '';
  return [
    'Cherche sur le web (avis Google Maps, TripAdvisor, forums de voyage type Routard/Reddit, blogs de voyageurs) les pépites les MOINS connues et les plus mémorables pour un séjour à '+(dest||'')+' ('+(country||region||'')+'), celles que les guides touristiques classiques ne mentionnent jamais.',
    interestsLine,
    'Pour chaque pépite trouvée, rapporte fidèlement ce qu\'un vrai avis/commentaire de voyageur en dit (paraphrase honnête d\'un avis réellement trouvé en ligne, jamais un commentaire inventé de toutes pièces).',
    'EXIGENCES STRICTES :',
    '- Uniquement des lieux RÉELS, vérifiables, actuellement accessibles.',
    '- EXCLUSION ABSOLUE ET PRIORITAIRE : si tes résultats de recherche indiquent, même une seule fois, que le lieu est "définitivement fermé"/"permanently closed"/"closed down"/"fermé"/"n\'existe plus", tu DOIS l\'exclure entièrement — ne le propose sous aucun prétexte, préfère en renvoyer moins.',
    '- Le commentaire cité doit correspondre au contenu d\'un vrai avis trouvé en ligne (paraphrase fidèle, pas une citation mot pour mot si tu n\'es pas sûr du texte exact).',
    '- Si tu ne trouves rien de fiable pour compléter 4 pépites, renvoie-en moins plutôt que d\'inventer.',
    'Réponds UNIQUEMENT en JSON compact, sans texte autour :',
    '{"gems":[{"name":"nom réel","loc":"lieu précis","desc":"description 2 phrases évocatrices","tip":"conseil pratique (horaire, accès, réservation)","review":"paraphrase fidèle d\'un vrai avis de voyageur","source":"type de source (ex: avis Google, forum Routard, blog voyage)"}]}',
  ].filter(Boolean).join('\n');
}
async function _fetchRealGems(dest, country, region, interests){
  for(var attempt=0; attempt<2; attempt++){
    if(attempt>0){ await new Promise(function(r){ setTimeout(r, 1500); }); }
    try{
      const res = await fetch(SUPABASE_ENDPOINT,{
        method:'POST',
        headers:SUPABASE_HEADERS,
        body:JSON.stringify({prompt:buildGemsSearchPrompt(dest, country, region, interests), webSearch:true})
      });
      if(!res.ok) continue;
      const data = await res.json();
      if(data.error) continue;
      const raw = data.result || '';
      if(!raw) continue;
      let j = parseItineraryJSON(raw);
      if(!j || !Array.isArray(j.gems)){
        const m = raw.match(/\{[^]*"gems"[^]*\}/);
        if(m){ try{ j = JSON.parse(m[0]); }catch(e){} }
      }
      if(!j || !Array.isArray(j.gems)) continue;
      const valid = j.gems.filter(function(g){
        return g && g.name && typeof g.name==='string'
          && g.name.trim().length>=3 && !/^\d+$/.test(g.name.trim());
      });
      if(valid.length) return valid;
    }catch(e){}
  }
  return null;
}

/* ── recherche web d'une VRAIE photo de destination (anti-hallucination) ──
   Seules 17 destinations ont une photo pré-illustrée localement (destPhoto,
   screens-main.js) — la plupart des destinations générées (villes/régions
   précises comme "Palma de Majorque") n'en ont aucune et retombent sur un
   simple dégradé de couleur. On cherche une vraie photo sur Wikimedia
   Commons (licence libre, lien direct fiable — contrairement à Booking/
   Airbnb qui bloquent le hotlink) plutôt que d'inventer une URL. */
function buildDestPhotoSearchPrompt(dest, country, region){
  return [
    'Cherche activement une VRAIE photo (paysage, ville ou monument emblématique, pas un plan rapproché de personnes) de la destination : '+(dest||'')+' ('+(country||region||'')+').',
    'Regarde en priorité Wikimedia Commons, mais aussi TripAdvisor ou une fiche Google Maps/Business si l\'URL d\'image directe y apparaît — c\'est fréquent, ne t\'en prive pas si elle y est.',
    'EXIGENCES STRICTES :',
    '- UNIQUEMENT une URL d\'image DIRECTE (se terminant par .jpg/.jpeg/.png/.webp, ou une URL Google Maps/Business photo), jamais une page Wikipedia/TripAdvisor ou un lien vers une galerie.',
    '- La seule règle qui compte : ne JAMAIS inventer ou reconstruire une URL à partir d\'un pattern connu — uniquement une URL que tu as VUE mot pour mot, telle quelle, dans un extrait/snippet de recherche. Si tu ne l\'as pas vue ainsi, réponds "photo":"" plutôt que de risquer une URL fictive.',
    'Réponds UNIQUEMENT en JSON compact, sans texte autour :',
    '{"photo":""}',
  ].join('\n');
}
/* Domaines acceptés : mêmes principes que _validStayPhoto (generate.js,
   validation des photos d'hébergement) — élargi au-delà de Wikimedia pour
   couvrir TripAdvisor et les photos Google Maps/Business, deux sources
   réelles très fréquentes avec des identifiants longs non-devinables. */
function _validDestPhoto(url){
  if(typeof url!=='string') return '';
  const u=url.trim();
  if(!/^https:\/\/upload\.wikimedia\.org\/.+\.(jpe?g|png)$/i.test(u)
     && !/^https:\/\/(dynamic-media-cdn|media-cdn)\.tripadvisor\.com\/.+\.(jpe?g|png|webp)(\?.*)?$/i.test(u)
     && !/^https:\/\/lh[3-6]\.googleusercontent\.com\/.+$/i.test(u)) return '';
  if(/\[|\]|example\.com|placeholder/i.test(u)) return '';
  return u;
}
async function _fetchRealDestPhoto(dest, country, region){
  try{
    const res = await fetch(SUPABASE_ENDPOINT,{
      method:'POST',
      headers:SUPABASE_HEADERS,
      body:JSON.stringify({prompt:buildDestPhotoSearchPrompt(dest, country, region), webSearch:true})
    });
    if(!res.ok) return '';
    const data = await res.json();
    if(data.error) return '';
    const raw = data.result || '';
    if(!raw) return '';
    let j = parseItineraryJSON(raw);
    if(!j){
      const m = raw.match(/\{[^]*"photo"[^]*\}/);
      if(m){ try{ j = JSON.parse(m[0]); }catch(e){} }
    }
    const photo = j && typeof j.photo==='string' ? j.photo.trim() : '';
    return _validDestPhoto(photo);
  }catch(e){ return ''; }
}

/* ── photo de destination via les API publiques Wikimedia (déterministe) ──
   Contrairement à la recherche IA ci-dessus (qui dépend d'une URL "vue" par
   hasard dans un extrait de résultat, souvent vide), ces API REST officielles
   renvoient directement l'image d'en-tête d'un article existant — aucune IA
   impliquée, donc aucun risque d'invention, gratuites, sans clé, et sans
   consommer de crédit d'API.
   Wikivoyage (guide de voyage collaboratif, même famille Wikimedia) est
   interrogé EN PREMIER : ses images sont choisies pour donner envie de
   visiter (paysages, monuments), alors que l'image d'en-tête d'un article
   Wikipedia de pays/région est presque toujours un drapeau, un blason ou
   une carte de localisation — inutilisable comme photo de voyage. Wikipedia
   ne sert qu'en repli (utile pour une ville/un lieu précis, où son image
   d'en-tête est généralement une vraie photo). _fetchRealDestPhoto
   (recherche IA) reste le tout dernier recours. */
function _wikiExtractImage(data){
  if(!data || data.type === 'disambiguation') return '';
  const raw = (data.originalimage && data.originalimage.source) || (data.thumbnail && data.thumbnail.source) || '';
  const img = raw.split('?')[0]; /* retire les paramètres de tracking (utm_*) */
  return /^https:\/\/upload\.wikimedia\.org\/.+\.(jpe?g|png)$/i.test(img) ? img : '';
}
/* Écarte les images d'en-tête non "scéniques" — drapeaux, blasons, cartes
   de localisation, projections, images satellite — reconnaissables à leur
   nom de fichier ou à leur origine SVG (les drapeaux/cartes vectorielles
   sont systématiquement dérivés d'un .svg, jamais une vraie photo). */
const _WIKI_NON_SCENIC_RX = /\.svg[/.]|flag[_-]of|coat[_-]of[_-]arms|blason|locator|orthographic|projection|landsat|satellite|photosat|cloud-free|\blocation[_-]|\bmap\b|_map\.|administrative|topographic|logo/i;
function _isLikelyScenicWikiImage(url){
  return !!url && !_WIKI_NON_SCENIC_RX.test(url);
}
async function _wikiResolveTitle(host, name){
  try{
    const res = await fetch('https://'+host+'/w/api.php?action=query&list=search&format=json&origin=*&srlimit=1&srsearch='+encodeURIComponent(name));
    if(!res.ok) return '';
    const data = await res.json();
    const hit = data && data.query && data.query.search && data.query.search[0];
    return hit ? hit.title : '';
  }catch(e){ return ''; }
}
async function _wikiPageImage(host, title){
  try{
    const res = await fetch('https://'+host+'/api/rest_v1/page/summary/'+encodeURIComponent(title), {
      headers:{'Accept':'application/json'}
    });
    if(!res.ok) return '';
    const img = _wikiExtractImage(await res.json());
    return _isLikelyScenicWikiImage(img) ? img : '';
  }catch(e){ return ''; }
}
async function _wikiSitePhoto(host, name){
  if(!name) return '';
  /* Essai direct (le nom de destination correspond souvent déjà au titre
     exact de l'article), sinon recherche du titre le plus proche. */
  let photo = await _wikiPageImage(host, name);
  if(photo) return photo;
  const resolved = await _wikiResolveTitle(host, name);
  if(!resolved || resolved.toLowerCase() === String(name).toLowerCase()) return '';
  return await _wikiPageImage(host, resolved);
}
/* Point d'entrée unique pour la photo de destination : Wikivoyage d'abord
   (dest précise, puis pays/région en repli), Wikipedia ensuite (même
   ordre), recherche IA en tout dernier recours. */
async function _fetchDestPhoto(dest, country, region){
  const hosts = ['fr.wikivoyage.org', 'fr.wikipedia.org'];
  for(let i=0; i<hosts.length; i++){
    const fromDest = await _wikiSitePhoto(hosts[i], dest);
    if(fromDest) return fromDest;
    const fromCountry = await _wikiSitePhoto(hosts[i], country || region);
    if(fromCountry) return fromCountry;
  }
  return await _fetchRealDestPhoto(dest, country, region);
}

/* ── validation : la destination renvoyee correspond-elle a celle demandee ? ──
   Comparaison volontairement souple (accents/casse ignorés, sous-chaîne dans
   un sens ou l'autre) car le client peut taper "Sardaigne" et l'IA répondre
   "Sardaigne, Italie" ou l'inverse  -  ce n'est pas une erreur. ── */
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

/* ── callCartographe() avec reprise complète ──────────────────────────
   _completeJSON() ne retente qu'un seul appel API à la fois (3 tentatives) ;
   si un souci réseau plus large survient au milieu de l'orchestration
   (ossature OK mais jours en échec, par ex.), callCartographe() entier
   peut échouer. Demande explicite du client : la génération doit réussir
   quoi qu'il arrive plutôt que d'abandonner après un seul essai complet —
   on retente donc TOUT le pipeline depuis le début, jusqu'à 3 fois, avant
   de renoncer réellement. ── */
async function _callCartographeWithRetry(maxAttempts, onRetry){
  let lastErr=null;
  for(let attempt=0; attempt<maxAttempts; attempt++){
    if(attempt>0){
      if(onRetry) onRetry(attempt);
      await new Promise(function(r){ setTimeout(r, 1500); });
    }
    try{
      const result=await callCartographe();
      if(result && result.skel && Array.isArray(result.skel.plan) && result.skel.plan.length) return result;
      lastErr=new Error('résultat vide ou incomplet');
      console.warn('[_callCartographeWithRetry] tentative',attempt+1,'résultat invalide');
    }catch(e){
      lastErr=e;
      console.warn('[_callCartographeWithRetry] tentative',attempt+1,'échouée:', e&&e.message||e);
    }
  }
  throw lastErr||new Error('échec de génération après plusieurs tentatives');
}

/* ── orchestration des 3 passes (ossature, jours, highlights) ─────────── */
async function callCartographe(){
  const b=buildBrief();
  const dc=b.daysCount;

  /* Passe 1  -  ossature, par lots de 7 jours pour les longs voyages */
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
          /* la 2e tentative a échoué aussi sur la destination  -  on force quand même
             le nom demandé par le client plutôt que d'afficher une destination différente */
          skel=retryResult;
          skel.dest=state.destination;
        } else {
          skel.dest=state.destination;
        }
      }
      state._genStays=skel.stays||[];
      state._genLastSteps=skel.plan.slice(-2); /* contexte pour batches suivants */
      state._genAllSteps=skel.plan.slice(); /* toutes les étapes pour anti-retour */
    } else {
      const morePlan=(batchResult&&Array.isArray(batchResult.plan))?batchResult.plan:[];
      skel.plan=skel.plan.concat(morePlan);
      state._genLastSteps=skel.plan.slice(-2);
      state._genAllSteps=skel.plan.slice();
    }
  }
  /* sécurité : si la génération par lots n'atteint pas dc, on tronque proprement */
  if(skel.plan.length>dc) skel.plan=skel.plan.slice(0,dc);
  skel.days_count=skel.plan.length;

  /* recherche web du prix de vol  -  lancée en parallèle, dès que la destination est connue */
  const flightPromise=_fetchFlightPriceFromWeb(skel.dest, skel.country, state.dateFrom, state.dateTo, state.travelers);
  /* photo de destination — Wikipedia d'abord (déterministe), recherche IA
     en repli — lancée en parallèle aussi */
  const heroPhotoPromise=_fetchDestPhoto(skel.dest, skel.country, skel.region);

  /* recherche web de VRAIS hébergements  -  remplace les noms potentiellement inventés.
     Si la vérification échoue pour une zone (île reculée, adresse peu indexée...),
     une 2e passe ciblée est tentée uniquement sur les zones en échec avant
     d'abandonner  -  et le nom fictif de l'ossature n'est alors jamais affiché
     avec la même confiance qu'un nom vérifié (voir "verified" dans applyGenerated). */
  if(Array.isArray(skel.stays) && skel.stays.length){
    const zones = skel.stays.map(function(s){ return s.loc || s.zone || skel.dest; });
    const dateRanges = _computeStayDateRanges(skel.stays, state.dateFrom);
    const realStays = await _fetchRealStays(skel.dest, zones, skel.level, dateRanges);
    skel.stays = _mergeRealStays(skel.stays, zones, realStays);

    const failedIdx = skel.stays.map(function(s,i){ return s.verified?-1:i; }).filter(function(i){ return i>=0; });
    if(failedIdx.length){
      const failedZones = failedIdx.map(function(i){ return zones[i]; });
      const failedRanges = failedIdx.map(function(i){ return dateRanges[i]; });
      const retryStays = await _fetchRealStays(skel.dest, failedZones, skel.level, failedRanges);
      const merged = _mergeRealStays(failedIdx.map(function(i){ return skel.stays[i]; }), failedZones, retryStays);
      failedIdx.forEach(function(i, k){ skel.stays[i] = merged[k]; });
    }

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

  /* Passe 2  -  détail éditorial des jours, par lots de 7 pour les longs voyages */
  const allDays=[];
  for(let offset=0; offset<skel.plan.length; offset+=DAYS_BATCH_SIZE){
    const batch=skel.plan.slice(offset, offset+DAYS_BATCH_SIZE);
    const batchResult=await _completeJSON(buildDaysPrompt(skel, batch, offset));
    const batchDays=(batchResult&&Array.isArray(batchResult.days))?batchResult.days:[];
    for(let i=0;i<batch.length;i++){ allDays.push(batchDays[i]||null); }
  }
  const daysDetail={days:allDays};

  /* Passe 2.5  -  vérification web des restaurants (anti-hallucination, premium) */
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

  /* Passe 3  -  adresses, gems, highlights (optionnelle — ne bloque pas) */
  let hilites = null;
  try {
    hilites = await _completeJSON(buildHighlightsPrompt(skel, daysDetail));
  } catch(e) {
    console.warn('[Passe3] Ignorée:', e && e.message);
  }

  /* Passe 3.5  -  pépites + avis voyageurs RÉELS trouvés sur le web  -  remplace
     les pépites purement inventées par l'IA quand la recherche aboutit. */
  try{
    const realGems = await _fetchRealGems(skel.dest, skel.country, skel.region, state.interests);
    if(realGems && realGems.length){
      if(!hilites) hilites = {};
      hilites.gems = realGems;
    }
  }catch(e){ console.warn('[gems] exception', e); }

  /* le prix du vol a eu tout ce temps pour revenir ; sinon on retombe sur l'estimation statique */
  let flightInfo=null;
  try{ flightInfo=await flightPromise; }catch(e){ flightInfo=null; }
  let heroPhoto='';
  try{ heroPhoto=await heroPhotoPromise; }catch(e){ heroPhoto=''; }

  return {skel:skel, days:daysDetail, hilites:hilites, flightInfo:flightInfo, heroPhoto:heroPhoto};
}

/* ── flux de génération ─────────────────────────────────────────────── */
async function runGeneration(){
  if(state.createTab==='surprise' && !state.destination){
    await runDestinationSuggestion([]);
    return;
  }
  /* Génération asynchrone côté serveur (Partie C) réservée aux comptes
     réels : un job "generation_jobs" a besoin d'un user_id pour exister et
     pour recevoir la notification de fin — impossible pour un accès
     anonyme/propriétaire par email seul (voir _sbEnsureFreshToken). Ces
     utilisateurs gardent le chemin synchrone existant, inchangé. */
  const token = (typeof _sbEnsureFreshToken==='function') ? await _sbEnsureFreshToken() : null;
  if(token && typeof _startAsyncGeneration==='function'){
    await _startAsyncGeneration();
  } else {
    await runFullGeneration();
  }
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
    toast('Connexion limitée  -  réessayez');
    closeOverlay();
    return;
  }
  state._suggested=suggestion;
  state._suggestedExcluded=excluded;
  setTimeout(function(){
    el.innerHTML = destinationSuggestView(suggestion);
    const newGen=el.querySelector('.gen');
    requestAnimationFrame(function(){requestAnimationFrame(function(){if(newGen) newGen.classList.add('run');});});
  },280);
}
async function retrySuggestion(){
  const excluded=(state._suggestedExcluded||[]).concat(state._suggested?[state._suggested.dest]:[]);
  await runDestinationSuggestion(excluded);
}
async function confirmSuggestedDestination(){
  const s=state._suggested;
  if(!s){ toast('Erreur: pas de destination suggérée'); return; }
  state.destination=s.dest;
  state.createTab='known';
  state._suggestedTagline=s.tagline||'';
  /* Fermer l'overlay suggest, puis lancer la génération depuis un contexte propre.
     Même bascule synchrone/asynchrone que runGeneration() — un utilisateur
     connecté qui choisit une destination "surprise" doit aussi profiter de
     la génération en arrière-plan. */
  closeAllOverlays();
  setTimeout(async function(){
    const token = (typeof _sbEnsureFreshToken==='function') ? await _sbEnsureFreshToken() : null;
    if(token && typeof _startAsyncGeneration==='function'){
      await _startAsyncGeneration();
    } else {
      runFullGeneration(false);
    }
  }, 320);
}

/* Met à jour l'état (fait / en cours / à venir) des 4 items de la checklist de génération */
function _updateGenChecklist(el, pct){
  const items = el.querySelectorAll('[data-gen-check]');
  let activeSet = false;
  for(let i = 0; i < items.length; i++){
    const until = parseFloat(items[i].getAttribute('data-gen-until'));
    items[i].classList.remove('done', 'active');
    if(pct >= until){
      items[i].classList.add('done');
    } else if(!activeSet){
      items[i].classList.add('active');
      activeSet = true;
    }
  }
}

/* ── Étape 2 : génération complète de l'itinéraire ────────────────────── */
async function runFullGeneration(overlayAlreadyOpen){
  /* Annuler toute animation de génération précédente encore active */
  if(window._genRafId){ cancelAnimationFrame(window._genRafId); window._genRafId=null; }
  window._genDone=false;
  /* Session ID unique : toute boucle tick d'une session précédente est ignorée */
  const sessionId = (window._genSessionId=(window._genSessionId||0)+1);
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
  const EST_DURATION = 16000; /* ms  -  durée estimée totale */
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
    if(window._genDone) return;
    const elapsed = Date.now() - startTime;
    /* Courbe easing : progresse vite au début, ralentit vers 90% */
    const linear = Math.min(elapsed / EST_DURATION, 1);
    /* Fonction : rapide→90% en ~70% du temps, puis très lent jusqu'à 93% */
    let target;
    if(linear < 0.70) target = (linear / 0.70) * 90;
    else target = 90 + ((linear - 0.70) / 0.30) * 3; /* max 93% tant que pas fini */

    /* Progression fluide  -  jamais en arrière */
    if(target > currentPct) currentPct = Math.min(target, 93);

    const barI = el.querySelector('[data-gen-bar]');
    const barPct = el.querySelector('[data-gen-pct]');
    const timeLeft = el.querySelector('[data-gen-time]');

    if(barI) barI.style.width = currentPct.toFixed(1) + '%';
    if(barPct) barPct.textContent = Math.round(currentPct) + '%';
    _updateGenChecklist(el, currentPct);

    /* Temps restant estimé */
    if(timeLeft){
      const remaining = Math.max(0, EST_DURATION - elapsed);
      const secs = Math.ceil(remaining / 1000);
      timeLeft.textContent = currentPct >= 90 ? 'Finalisation…' : secs + 's';
    }

    /* Label  -  mise à jour fluide sans flash */
    const newLabel = getLabel(currentPct);
    if(newLabel !== lastLabel){
      lastLabel = newLabel;
      if(statusEl){
        if(window._genLabelTimeout) clearTimeout(window._genLabelTimeout);
        statusEl.style.transition='opacity 0.15s';
        statusEl.style.opacity=0;
        var capturedLabel=newLabel;
        window._genLabelTimeout=setTimeout(function(){
          if(!window._genDone){
            statusEl.textContent=capturedLabel;
            statusEl.style.opacity=1;
          }
        },160);
      }
    }

    rafId = requestAnimationFrame(tick);
    window._genRafId = rafId;
  }

  /* Initialisation */
  if(statusEl){ statusEl.textContent='Lecture de vos envies…'; statusEl.style.opacity=1; }
  const barI0=el.querySelector('[data-gen-bar]');
  if(barI0){ barI0.style.transition='none'; barI0.style.width='2%'; }
  rafId = requestAnimationFrame(tick);

  const minShow=new Promise(function(r){setTimeout(r,2200);});
  let result=null;
  try{
    const res=await Promise.all([_callCartographeWithRetry(3, function(){
      if(statusEl){ statusEl.textContent='Nouvelle tentative…'; statusEl.style.opacity=1; }
    }),minShow]);
    result=res[0];
    console.log('[runFullGen] result=',result?'OK plan='+((result.skel&&result.skel.plan)||[]).length+' days='+((result.days&&result.days.days)||[]).length:'NULL');
  }catch(e){
    console.error('[runFullGen] exception callCartographe:',e&&e.message||e);
    var errMsg = String(e&&e.message||e);
    /* "Load failed" = iOS Safari a coupé le réseau après 60s */
    if(errMsg.toLowerCase().indexOf('load failed')>=0 || errMsg.toLowerCase().indexOf('network')>=0){
      toast('Connexion interrompue - relancez la generation');
    } else {
      toast('Erreur: '+errMsg.slice(0,55));
    }
    await minShow;
  }

  /* Fin réelle  -  compléter à 100% */
  done = true;
  window._genDone = true;
  if(rafId) cancelAnimationFrame(rafId);
  if(window._genRafId){ cancelAnimationFrame(window._genRafId); window._genRafId=null; }

  const barI=el.querySelector('[data-gen-bar]');
  const barPct=el.querySelector('[data-gen-pct]');
  const timeLeft=el.querySelector('[data-gen-time]');
  if(barI){ barI.style.transition='width 0.6s cubic-bezier(0.4,0,0.2,1)'; barI.style.width='100%'; }
  if(barPct) barPct.textContent='100%';
  if(timeLeft) timeLeft.textContent='';
  _updateGenChecklist(el, 100);
  if(statusEl){statusEl.style.opacity=0;setTimeout(function(){statusEl.textContent='Votre voyage est prêt ✦';statusEl.style.opacity=1;},250);}

  let ok=false;
  if(result){try{ok=applyGenerated(result.skel,result.days,result.hilites,result.flightInfo,result.heroPhoto);}catch(e){
    console.error('[applyGenerated]', e);
    ok=false;
  }}
  /* Aucun itinéraire de secours n'existe réellement : si la génération a
     échoué, ITINERARY reste vide (dest/plan/accommodations à zéro). Montrer
     quand même le paywall dans ce cas revenait à demander 4,99€ pour un
     voyage à "0 jours" et une destination vide — pire que ne rien montrer.
     On ferme l'écran de génération et on laisse l'utilisateur relancer. */
  if(!ok || !ITINERARY.dest || !ITINERARY.plan || !ITINERARY.plan.length){
    toast('Génération impossible  -  vérifiez votre connexion et réessayez');
    const gi0=ovStack.findIndex(function(o){return o.dataset&&o.dataset.ov==='generating';});
    if(gi0>=0){const g0=ovStack.splice(gi0,1)[0];g0.remove();}
    return;
  }

  /* Notification "voyage prêt" — indépendante du paywall : l'itinéraire
     est réellement généré à ce stade, que l'utilisateur le débloque tout
     de suite ou plus tard. Best-effort (silencieuse si pas connecté). */
  if(typeof _createNotification==='function'){
    _createNotification(
      'Votre voyage est prêt',
      ITINERARY.dest ? ('Votre itinéraire pour '+ITINERARY.dest+' vient d\'être généré.') : 'Votre itinéraire vient d\'être généré.',
      'itinerary_ready'
    );
  }

  /* ── PAYWALL ── */
  setTimeout(function(){
    try{
      const days = (ITINERARY.plan&&ITINERARY.plan.length) ? ITINERARY.plan.length : (ITINERARY.days || 0);
      const alreadyPaid = _checkPaymentToken(ITINERARY.dest, days);
      if(alreadyPaid){
        _openItineraryAndSave();
      } else {
        _showPaywall(el, days);
      }
    }catch(e){
      console.error('[paywall/open]', e);
      /* En cas d'erreur, fermer quand même l'écran de génération */
      const gi=ovStack.findIndex(function(o){return o.dataset&&o.dataset.ov==='generating';});
      if(gi>=0){const g=ovStack.splice(gi,1)[0];g.remove();}
      toast('Erreur : '+String(e.message||e).slice(0,60));
    }
  },620);
}

/* ── Génération asynchrone côté serveur (Partie C) ──────────────────────
   iOS Safari ne peut pas exécuter de JS en arrière-plan : fermer l'app
   pendant runFullGeneration() interromprait la génération en cours. Pour
   un compte connecté, on confie donc tout le pipeline à l'Edge Function
   "generate-itinerary" (voir supabase-functions/generate-itinerary.ts),
   qui continue même app fermée et écrit directement le voyage terminé
   dans "itineraries" + une notification "voyage prêt" (déjà gérée par
   l'écran Notifications, Partie A). Si l'app reste ouverte, on affiche une
   progression RÉELLE (pas simulée) en interrogeant "generation_jobs". */
const GENERATION_JOB_ENDPOINT = 'https://lucbxwxcismnvcdnctau.supabase.co/functions/v1/generate-itinerary';
/* Même liste de champs que STATE_FIELDS côté serveur (supabase-functions/
   generate-itinerary.ts) — ne pas en ajouter un ici sans l'ajouter aussi
   là-bas, sinon le serveur ignorera silencieusement le nouveau champ. */
function _asyncGenStateSnapshot(){
  return {
    createTab: state.createTab, destination: state.destination, origin: state.origin,
    dateFrom: state.dateFrom, dateTo: state.dateTo, travelers: state.travelers,
    budget: state.budget, rythme: state.rythme, styles: state.styles, interests: state.interests,
    occasion: state.occasion, flightOut: state.flightOut, flightIn: state.flightIn, dream: state.dream,
    childrenCount: state.childrenCount, childrenAges: state.childrenAges, transport: state.transport,
    dietary: state.dietary, alreadyDone: state.alreadyDone, fitnessLevel: state.fitnessLevel,
    accomStyle: state.accomStyle,
  };
}
async function _startAsyncGeneration(){
  const el = openOverlay('generating', generationView(), {modal:true, carto:true});
  const gen = el.querySelector('.gen');
  requestAnimationFrame(function(){ gen.classList.add('run'); });
  const statusEl = el.querySelector('[data-gen-status]');

  const token = await _sbEnsureFreshToken();
  if(!token){
    toast('Connexion requise');
    const gi=ovStack.findIndex(function(o){return o.dataset&&o.dataset.ov==='generating';});
    if(gi>=0){const g=ovStack.splice(gi,1)[0];g.remove();}
    return;
  }

  let jobId=null;
  try{
    const res = await fetch(GENERATION_JOB_ENDPOINT, {
      method:'POST',
      headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token},
      body: JSON.stringify({state:_asyncGenStateSnapshot()}),
    });
    const data = await res.json().catch(function(){ return {}; });
    if(!res.ok || !data.jobId) throw new Error(data.error||('HTTP '+res.status));
    jobId = data.jobId;
  }catch(e){
    /* La fonction serveur "generate-itinerary" doit être déployée
       manuellement côté Supabase (voir NOTES_GENERATION_JOBS.sql et
       supabase-functions/generate-itinerary.ts) — tant que ce n'est pas
       fait, ou en cas de souci réseau ponctuel, on ne doit JAMAIS bloquer
       la génération : on retombe sur le chemin synchrone existant, qui
       reste le comportement garanti pour tout le monde. L'écran de
       génération déjà ouvert est réutilisé tel quel (overlayAlreadyOpen). */
    console.warn('[_startAsyncGeneration] repli sur le chemin synchrone:', e&&e.message||e);
    await runFullGeneration(true);
    return;
  }

  try{ localStorage.setItem('hs_active_job', JSON.stringify({jobId:jobId, startedAt:Date.now()})); }catch(e){}
  if(statusEl){ statusEl.textContent='Composition du circuit…'; statusEl.style.opacity=1; }
  _pollGenerationJob(jobId, el);
}
function _stopGenerationPoll(){
  if(window._genPollId){ clearInterval(window._genPollId); window._genPollId=null; }
}
function _pollGenerationJob(jobId, el){
  _stopGenerationPoll();
  const statusEl = el.querySelector('[data-gen-status]');
  window._genPollId = setInterval(async function(){
    /* L'écran de génération a pu être fermé (navigation ailleurs pendant
       que ça tourne) — la génération continue côté serveur quoi qu'il
       arrive, seul le polling client doit s'arrêter : inutile d'interroger
       un écran qui n'existe plus. */
    if(!document.body.contains(el)){ _stopGenerationPoll(); return; }
    const token = await _sbEnsureFreshToken();
    if(!token){ _stopGenerationPoll(); return; }
    try{
      const res = await fetch(SUPABASE_URL+'/rest/v1/generation_jobs?id=eq.'+jobId+'&select=status,progress,phase,result_itinerary_id,error', {
        headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token},
      });
      if(!res.ok) return;
      const rows = await res.json();
      const row = Array.isArray(rows) && rows[0];
      if(!row) return;

      const pct = Math.max(2, Math.min(99, Number(row.progress)||0));
      const barI = el.querySelector('[data-gen-bar]');
      const barPct = el.querySelector('[data-gen-pct]');
      if(barI){ barI.style.transition='width 0.5s ease'; barI.style.width=pct+'%'; }
      if(barPct) barPct.textContent = Math.round(pct)+'%';
      if(typeof _updateGenChecklist==='function') _updateGenChecklist(el, pct);
      if(statusEl && row.phase && statusEl.textContent!==row.phase){ statusEl.textContent=row.phase; statusEl.style.opacity=1; }

      if(row.status==='done' && row.result_itinerary_id){
        _stopGenerationPoll();
        try{ localStorage.removeItem('hs_active_job'); }catch(e){}
        if(barI) barI.style.width='100%';
        if(barPct) barPct.textContent='100%';
        if(typeof _updateGenChecklist==='function') _updateGenChecklist(el, 100);
        if(statusEl) statusEl.textContent='Votre voyage est prêt ✦';
        await _completeAsyncGeneration(row.result_itinerary_id, el);
      } else if(row.status==='error'){
        _stopGenerationPoll();
        try{ localStorage.removeItem('hs_active_job'); }catch(e){}
        toast('Génération échouée  -  '+(row.error?String(row.error).slice(0,60):'réessayez'));
        const gi=ovStack.findIndex(function(o){return o.dataset&&o.dataset.ov==='generating';});
        if(gi>=0){const g=ovStack.splice(gi,1)[0];g.remove();}
      }
    }catch(e){}
  }, 2500);
}
/* Le voyage a déjà été inséré dans "itineraries" par l'Edge Function : on
   ne rappelle jamais saveItinerary() ici tel quel (créerait un doublon
   cloud), on charge juste ce qui vient d'être généré pour décider paywall
   ou ouverture directe — exactement le même embranchement que la fin de
   runFullGeneration(), moins la ré-écriture déjà faite côté serveur. */
async function _completeAsyncGeneration(itinId, el){
  const token = await _sbEnsureFreshToken();
  if(!token){ toast('Connexion requise'); return; }
  let saved=null;
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/itineraries?id=eq.'+itinId, {
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token},
    });
    const rows = await res.json();
    saved = Array.isArray(rows) && rows[0];
  }catch(e){}
  if(!saved){
    toast('Voyage introuvable  -  retrouvez-le dans "Mes voyages"');
    const gi=ovStack.findIndex(function(o){return o.dataset&&o.dataset.ov==='generating';});
    if(gi>=0){const g=ovStack.splice(gi,1)[0];g.remove();}
    return;
  }
  /* Empêche un futur appel à saveItinerary() (ex: depuis _openItineraryAndSave
     via le flux paywall) de réinsérer ce même voyage côté cloud. */
  window._asyncItinAlreadySaved = true;
  Object.assign(ITINERARY, saved.data||{});
  if(!ITINERARY.dest) ITINERARY.dest = saved.destination||'';

  setTimeout(function(){
    try{
      const days = (ITINERARY.plan&&ITINERARY.plan.length) ? ITINERARY.plan.length : (saved.days||0);
      const alreadyPaid = _checkPaymentToken(ITINERARY.dest, days);
      if(alreadyPaid){
        loadSavedItinerary(itinId);
        const gi=ovStack.findIndex(function(o){return o.dataset&&o.dataset.ov==='generating';});
        if(gi>=0){const g=ovStack.splice(gi,1)[0];g.remove();}
      } else {
        _showPaywall(el, days);
      }
    }catch(e){
      console.error('[paywall/open async]', e);
      const gi=ovStack.findIndex(function(o){return o.dataset&&o.dataset.ov==='generating';});
      if(gi>=0){const g=ovStack.splice(gi,1)[0];g.remove();}
      toast('Erreur : '+String(e.message||e).slice(0,60));
    }
  }, 500);
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

/* État premium affiché sur le profil : propriétaire toujours actif, sinon
   au moins un déblocage payant encore valide (48h) — jamais un abonnement
   récurrent fabriqué, puisque ce modèle n'existe pas côté paiement. */
function _hasActivePremiumStatus(){
  const email = (localStorage.getItem('hs_email')||'').toLowerCase().trim();
  if(email==='charlottegperret@gmail.com') return true;
  try{
    const paid = JSON.parse(localStorage.getItem('hs_paid_tokens')||'[]');
    const now = Date.now();
    return paid.some(function(t){ return (now - t.ts) < 48*3600*1000; });
  }catch(e){ return false; }
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
  try{ openItinerary(); }catch(e){
    console.error('[openItinerary]', e);
    toast('Erreur affichage : '+String(e.message||e).slice(0,60));
  }
  try{ saveItinerary(); }catch(e){}
  state.deckIndex=0;
  state._suggested=null; state._suggestedExcluded=null;
  if(typeof initDeck==='function') try{ initDeck(); }catch(e){}
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

  /* Preview  -  J1 visible, reste flou */
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
    + '<p style="font-size:13px;color:var(--sub);line-height:1.5;margin:0">Activités, hébergements, restaurants secrets, pépites locales et budget détaillé  -  tout est prêt.</p>'
    + '</div></div>'
    /* Stats */
    + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:0 20px 20px">'
    + _pwStat(days+' jours','planifiés')
    + _pwStat((it.accommodations||[]).length+' héberg.','sélectionnés')
    + _pwStat((it.gems||[]).length+' pépites','cachées')
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
    + '<a id="pw-pay" href="'+stripeUrl+'" target="_blank" rel="noopener" style="display:block;width:100%;padding:16px;background:var(--ink);color:var(--bg);border:none;border-radius:16px;font-family:var(--sans);font-size:16px;font-weight:600;text-align:center;text-decoration:none;cursor:pointer;box-sizing:border-box">Débloquer mon itinéraire  -  '+price+'</a>'
    + '<p style="text-align:center;font-size:11px;color:var(--sub);margin-top:10px">Paiement sécurisé · Stripe · Accès immédiat après paiement</p>'
    + '</div>';

  document.body.appendChild(pw);

  /* Event listeners natifs  -  évite les problèmes de sanitisation innerHTML */
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

