/* ── HIC SUNT · icons + data ──────────────────────────────────── */
const I = {
  torii:'<path d="M3 8q9-3 18 0"/><path d="M4 8h16"/><path d="M6 11h12"/><path d="M7 8v11"/><path d="M17 8v11"/>',
  arch:'<path d="M5 20v-7a7 7 0 0 1 7-7 7 7 0 0 1 7 7v7"/><path d="M9 20v-5a3 3 0 0 1 6 0v5"/>',
  leaf:'<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z"/><path d="M5 19 17 7"/>',
  wave:'<path d="M2 11c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3 2-3 4-3"/><path d="M2 16c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3 2-3 4-3"/>',
  peaks:'<path d="M2 20l6-12 4 7 2.5-4L21 20Z"/><path d="M8 8l2 3"/>',
  volcano:'<path d="M3 20h18"/><path d="M8.5 20l3-8h1l3 8"/><path d="M10 9 9 6M14 9l1-3M12 8V4"/>',
  stupa:'<path d="M12 3l2 4h-4z"/><path d="M9 7h6v3H9z"/><path d="M7 10h10v10H7z"/><path d="M10.5 14h3v6h-3z"/>',
  sun:'<circle cx="12" cy="11" r="3.6"/><path d="M12 3v1.4M12 17.6V19M3.8 11h1.4M18.8 11h1.4M6.2 5.2l1 1M16.8 5.2l-1 1"/><path d="M3 20h18"/>',
  fork:'<path d="M7 3v6M5 3v3a2 2 0 0 0 4 0V3M7 9v12"/><path d="M16 3c-1.6 0-2.6 2.5-2.6 6 0 2 1.2 3 2.6 3v9"/>',
  droplet:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/>',
  sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="M15.2 8.8l-2 5.4-4.4 1.6 2-5.4z"/>',
  sparkle:'<path d="M12 3l1.7 6.3L20 11l-6.3 1.7L12 19l-1.7-6.3L4 11l6.3-1.7Z"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  person:'<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  chevron:'<path d="M9 6l6 6-6 6"/>',
  back:'<path d="M15 6l-6 6 6 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  cal:'<rect x="4" y="5" width="16" height="16" rx="2.5"/><path d="M4 9h16M9 3v4M15 3v4"/>',
  doc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  card:'<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M6.5 14.5h3"/>',
  bell:'<path d="M6 9a6 6 0 0 1 12 0c0 4 1.6 5.4 2 5.8H4c0.4-0.4 2-1.8 2-5.8z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.4 2.4 0 0 1 4.6 1c0 1.6-2 2-2 3.4"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/>',
  logout:'<path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"/><path d="M16 8l4 4-4 4M20 12H9"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M16 5.4a3.2 3.2 0 0 1 0 6.2M21 19a6 6 0 0 0-4-5.7"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  star:'<path d="M12 3.5l2.5 5.2 5.7 0.7-4.2 3.9 1.1 5.6L12 16.9l-5.1 2.9 1.1-5.6-4.2-3.9 5.7-0.7z" fill="currentColor" stroke="none"/>',
  heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  share:'<circle cx="6" cy="12" r="2.4"/><circle cx="17" cy="6" r="2.4"/><circle cx="17" cy="18" r="2.4"/><path d="M8.1 11l6.8-4M8.1 13l6.8 4"/>',
  pin:'<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  bed:'<path d="M3 18V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9"/><path d="M3 14h18M3 18v2M21 18v2"/><path d="M7 9V7"/>',
  wifi:'<path d="M2 8.5c5.5-4.5 14.5-4.5 20 0"/><path d="M5 12c4-3.2 10-3.2 14 0"/><path d="M8 15.4c2.4-1.9 5.6-1.9 8 0"/><circle cx="12" cy="18.5" r="0.8" fill="currentColor" stroke="none"/>',
  pool:'<path d="M4 18c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5"/><path d="M7 16V6a2 2 0 0 1 4 0M7 11h4"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  checkbig:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  plane:'<path d="M10.2 3.3c.5-.5 1.3-.5 1.6.2L13 7l5.5 2.5c.7.3.9 1.2.3 1.7L16 13l.4 5.2c0 .6-.7 1-1.2.6L12.5 17l-2.7 1.8c-.5.4-1.2 0-1.2-.6L9 13l-2.8-1.8c-.6-.5-.4-1.4.3-1.7L11 7z"/>',
  apple:'<path d="M15.8 12.6c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7s-1.6-.7-2.6-.7c-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2s1.3-.6 2.5-.6 1.5.6 2.6.6 1.7-1 2.3-1.9c.7-1.1 1-2.1 1-2.2 0 0-1.9-.7-2-2.7z"/><path d="M13.9 6.6c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.2-.5.6-.9 1.5-.8 2.3.9.1 1.8-.4 2.2-1.1z" stroke="none" fill="currentColor"/>',
};
function ico(name, size, sw) {
  return '<svg class="ico" width="'+(size||22)+'" height="'+(size||22)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(sw||1.5)+'" stroke-linecap="round" stroke-linejoin="round">'+(I[name]||I.compass)+'</svg>';
}
function statusBar(dark) {
  return '<div class="statusbar'+(dark?' on-dark':'')+'">'
    + '<span class="sb-time">9:41</span><span class="sb-right">'
    + '<svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4.5" width="3" height="7.5" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35"/></svg>'
    + '<svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M1 4.2c4.2-3.4 10.8-3.4 15 0"/><path d="M3.4 6.8c2.8-2.2 7.4-2.2 10.2 0"/><path d="M5.9 9.3c1.4-1.1 3.8-1.1 5.2 0"/><circle cx="8.5" cy="11" r="0.6" fill="currentColor" stroke="none"/></svg>'
    + '<svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/><rect x="23" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.4"/></svg>'
    + '</span></div>';
}

/* destinations */
const DESTS = {
  'Sri Lanka': { r:'Océan Indien', i:'leaf', bg:'linear-gradient(160deg,#dfe9df,#cfdccb)',
    tag:'Là où le thé rencontre l\'océan',
    lede:'Une île-jardin entre plages de cocotiers, plantations de thé en altitude et cités sacrées. Le voyage le plus complet d\'Asie, à taille humaine.',
    best:'Janv. – avril', flight:'≈ 11 h', highlights:[
      ['peaks','Hauts plateaux de thé','Le train panoramique de Kandy à Ella, fenêtres ouvertes sur les plantations.'],
      ['droplet','Côte sud sauvage','Plages de Mirissa et Tangalle, lagunes et observation des baleines bleues.'],
      ['arch','Triangle culturel','Sigiriya, Dambulla et Anuradhapura — temples et palais millénaires.'] ] },
  'Japon': { r:'Asie de l\'Est', i:'torii', bg:'linear-gradient(160deg,#ece2da,#ddd0c6)',
    tag:'Entre tradition et néons',
    lede:'Des ruelles de Kyoto aux carrefours de Tokyo, un pays d\'extrêmes raffinés où chaque détail est une intention.',
    best:'Mars – mai', flight:'≈ 13 h', highlights:[
      ['arch','Temples de Kyoto','Mille torii vermillon, jardins de mousse et cérémonie du thé.'],
      ['fork','Tables de Tokyo','Du comptoir de sushi au izakaya de quartier, l\'art de la précision.'],
      ['peaks','Alpes japonaises','Villages aux toits de chaume et sources chaudes face au mont Fuji.'] ] },
  'Maroc': { r:'Afrique du Nord', i:'arch', bg:'linear-gradient(160deg,#f0e4d2,#e6d3b8)',
    tag:'Du désert aux médinas',
    lede:'Les souks de Marrakech, les dunes de l\'Erg Chebbi et les kasbahs de l\'Atlas — l\'Orient à portée de Méditerranée.',
    best:'Oct. – avril', flight:'≈ 3 h', highlights:[
      ['arch','Médina de Marrakech','Riads cachés, palais et souks d\'artisans dans la ville rouge.'],
      ['peaks','Atlas & vallées','Randonnées berbères et nuits en kasbah au pied des sommets.'],
      ['droplet','Nuit dans le désert','Bivouac de luxe sous les étoiles dans les dunes de Merzouga.'] ] },
  'Portugal': { r:'Europe du Sud', i:'wave', bg:'linear-gradient(160deg,#dce6ec,#cbdae4)',
    tag:'Atlantique et azulejos',
    lede:'Lisbonne la lumineuse, le Douro et ses vignobles, l\'Algarve et ses falaises dorées. L\'Europe douce et iodée.',
    best:'Mai – sept.', flight:'≈ 2 h 30', highlights:[
      ['wave','Côte de l\'Algarve','Criques secrètes, falaises ocre et villages de pêcheurs.'],
      ['fork','Tables de Lisbonne','Pastéis, fruits de mer et fado dans les ruelles de l\'Alfama.'],
      ['droplet','Vallée du Douro','Croisière et dégustation dans les quintas en terrasses.'] ] },
  'Islande': { r:'Europe du Nord', i:'volcano', bg:'linear-gradient(160deg,#dde3ee,#cbd6e6)',
    tag:'Terre de feu et de glace',
    lede:'Volcans fumants, cascades rugissantes, lagons laiteux et aurores boréales. Une île brute aux confins du cercle polaire, façonnée par les éléments.',
    best:'Juin – sept.', flight:'≈ 3 h 30', highlights:[
      ['droplet','Cascades du Sud','Seljalandsfoss et Skógafoss, murs d\'eau au pied des glaciers.'],
      ['volcano','Cercle d\'or','Geysers bouillonnants, faille continentale et chutes de Gullfoss.'],
      ['peaks','Lagon glaciaire','Icebergs dérivants de Jökulsárlón et plage de diamants.'] ] },
  'Pérou': { r:'Amérique du Sud', i:'peaks', bg:'linear-gradient(160deg,#ece2d2,#e0d2bb)',
    tag:'Sur les pas des Incas',
    lede:'Le Machu Picchu au lever du jour, la vallée sacrée, Cusco la coloniale et l\'Amazonie luxuriante. Des sommets andins à la jungle.',
    best:'Mai – sept.', flight:'≈ 14 h', highlights:[
      ['peaks','Machu Picchu','La cité perdue des Incas émergeant des nuées au lever du jour.'],
      ['arch','Cusco & Vallée sacrée','Ruelles coloniales, marchés andins et terrasses incas.'],
      ['leaf','Amazonie','Lodges au fil de l\'eau et faune foisonnante de la canopée.'] ] },
  'Thaïlande': { r:'Asie du Sud-Est', i:'stupa', bg:'linear-gradient(160deg,#ece0d4,#ddccba)',
    tag:'Temples d\'or et îles turquoise',
    lede:'Les temples scintillants de Bangkok, la jungle du Nord à dos d\'éléphant et les eaux cristallines des îles du Sud.',
    best:'Nov. – mars', flight:'≈ 11 h 30', highlights:[
      ['stupa','Temples de Bangkok','Wat Pho, Wat Arun et le Grand Palais au fil du fleuve.'],
      ['leaf','Chiang Mai','Jungle du Nord, sanctuaires d\'éléphants et marchés de nuit.'],
      ['wave','Îles du Sud','Krabi, Phi Phi et lagons émeraude entre les pitons calcaires.'] ] },
  'Kenya': { r:'Afrique de l\'Est', i:'sun', bg:'linear-gradient(160deg,#ece8d4,#ddd6bb)',
    tag:'Le grand safari',
    lede:'Les plaines du Masai Mara, la grande migration, les éléphants au pied du Kilimandjaro et les plages blanches de l\'océan Indien.',
    best:'Juil. – oct.', flight:'≈ 8 h', highlights:[
      ['sun','Masai Mara','Lions, guépards et la grande migration des gnous.'],
      ['peaks','Amboseli','Troupeaux d\'éléphants face au mont Kilimandjaro.'],
      ['wave','Côte de Diani','Sable blanc et lagons turquoise pour clore le safari.'] ] },
};
const DEST_ORDER = ['Sri Lanka','Japon','Maroc','Portugal','Islande','Pérou','Thaïlande','Kenya'];

/* generator vocabulary (aligned with hicsunt.com) */
const TRAVEL_STYLES = ['Aventure','Culture','Détente','Gastronomie','Nature','Luxe','Slow travel','Famille'];
const INTERESTS = ['Randonnée','Plages cachées','Safari','Temples & spiritualité','Marchés locaux','Gastronomie locale','Photographie','Architecture','Vin & vignobles','Bien-être & spa','Sous-marin','Vie nocturne'];
const OCCASIONS = [
  { id:'lune-de-miel', label:'Lune de miel',  emoji:'💍', desc:'Romance, intimité, tables aux chandelles' },
  { id:'anniversaire', label:'Anniversaire',  emoji:'✦',  desc:'Célébration mémorable, surprises locales' },
  { id:'evjf',         label:'EVJF',           emoji:'🌸', desc:'Entre filles, spas et adresses tendance' },
  { id:'evg',          label:'EVG',            emoji:'🏆', desc:'Entre amis, adrénaline et expériences fortes' },
  { id:'famille',      label:'En famille',     emoji:'🧸', desc:'Rythme doux, activités pour tous les âges' },
  { id:'solo',         label:'En solo',        emoji:'🧭', desc:'Liberté totale, rencontres et découvertes' },
];

/* itinerary (Sri Lanka) */
const ITINERARY = {
  dest:'Sri Lanka', tag:'Là où le thé rencontre l\'océan',
  dates:'12 – 22 mai 2026', days:10, level:'Confort',
  plan:[
    { n:1, title:'Arrivée à Colombo', loc:'Colombo', desc:'Transfert privé et première nuit en bord de lagune, dîner aux épices.',
      tags:[['fork','Dîner'],['leaf','Détente']], night:{ acc:'a1' },
      moments:[
        ['15:00','plane','Atterrissage','Accueil à l\'aéroport de Bandaranaike et transfert privé vers la lagune de Negombo.'],
        ['17:30','droplet','Lagune de Negombo','Balade en pirogue au coucher du soleil entre les filets de pêche.'],
        ['20:00','fork','Dîner aux épices','Premier dîner sri-lankais, curry de poisson et riz au lait de coco.'] ] },
    { n:2, title:'Triangle culturel', loc:'Sigiriya', desc:'Ascension du rocher du Lion au lever du jour, fresques et jardins royaux.',
      tags:[['arch','Patrimoine'],['peaks','Marche']], night:{ n:'Lodge de Sigiriya', loc:'Sigiriya' },
      moments:[
        ['05:30','peaks','Rocher du Lion','Ascension à l\'aube des 1 200 marches, fresques des Demoiselles et jardins suspendus.'],
        ['11:00','arch','Temple d\'or de Dambulla','Cinq grottes ornées de plus de 150 statues de Bouddha.'],
        ['16:00','leaf','Safari à Minneriya','Rencontre avec les éléphants sauvages dans la réserve.'] ] },
    { n:3, title:'Train pour Ella', loc:'Ella · Hauts plateaux', desc:'Le train mythique à travers les plantations de thé, fenêtres ouvertes.',
      tags:[['peaks','Randonnée'],['droplet','Cascade']], night:{ acc:'a2' },
      moments:[
        ['08:30','arch','Départ de Kandy','Visite du temple de la Dent sacrée avant de rejoindre la gare.'],
        ['09:45','peaks','Train panoramique','Sept heures à travers les plantations — l\'un des plus beaux trajets du monde.'],
        ['17:00','droplet','Cascade de Ravana','Baignade au pied des chutes à l\'arrivée à Ella.'] ] },
    { n:4, title:'Plantations & thé', loc:'Nuwara Eliya', desc:'Visite d\'une fabrique, dégustation et nuit dans un bungalow colonial.',
      tags:[['leaf','Thé'],['fork','Table']], night:{ acc:'a2' },
      moments:[
        ['09:00','leaf','Fabrique de thé','Visite guidée du séchage à la dégustation, secrets du Ceylon.'],
        ['12:30','peaks','Little Adam\'s Peak','Randonnée douce avec vue à 360° sur les vallées.'],
        ['19:30','fork','Table du bungalow','Dîner colonial au coin du feu, produits du potager.'] ] },
    { n:5, title:'Cap au sud', loc:'Mirissa', desc:'Route vers la côte, plage de cocotiers et observation des baleines bleues.',
      tags:[['droplet','Océan'],['leaf','Détente']], night:{ acc:'a3' },
      moments:[
        ['06:00','wave','Baleines bleues','Sortie en mer à l\'aube à la rencontre des plus grands mammifères.'],
        ['12:00','droplet','Plage de Mirissa','Après-midi libre, cocotiers et eaux turquoise.'],
        ['18:30','fork','Poisson grillé','Dîner les pieds dans le sable face au coucher du soleil.'] ] },
  ],
  accommodations:[
    { id:'a1', n:'Villa Lagune', i:'droplet', type:'Villa privée', loc:'Colombo', tag:'Coup de cœur', rate:'4,96', nights:1, price:240, am:['bed','wifi','pool'], blurb:'Villa contemporaine sur la lagune, piscine à débordement et personnel dédié.' },
    { id:'a2', n:'Bungalow du Thé', i:'leaf', type:'Lodge de charme', loc:'Nuwara Eliya', tag:'Vue plantations', rate:'4,88', nights:2, price:185, am:['bed','wifi','fork'], blurb:'Ancien bungalow colonial au cœur des plantations, cheminée et grands jardins.' },
    { id:'a3', n:'Maison de l\'Océan', i:'wave', type:'Hôtel-boutique', loc:'Mirissa', tag:'Front de mer', rate:'4,91', nights:2, price:210, am:['bed','wifi','pool'], blurb:'Sept chambres face à l\'océan, plage privée et table de poisson grillé.' },
  ],
};

/* trips (Voyages) */
const TRIPS = {
  upcoming:[
    { n:'Sri Lanka', i:'leaf', bg:'linear-gradient(160deg,#dfe9df,#cfdccb)', d:'12 – 22 mai 2026', s:['ok','Confirmé'], days:'10 jours', itin:true },
    { n:'Maroc', i:'arch', bg:'linear-gradient(160deg,#f0e4d2,#e6d3b8)', d:'Mars 2026', s:['prep','En préparation'], days:'8 jours' },
  ],
  past:[
    { n:'Japon', i:'torii', bg:'linear-gradient(160deg,#ece2da,#ddd0c6)', d:'Avril 2024', s:['ok','Terminé'], days:'14 jours' },
    { n:'Portugal', i:'wave', bg:'linear-gradient(160deg,#dce6ec,#cbdae4)', d:'Sept. 2023', s:['ok','Terminé'], days:'7 jours' },
  ],
  draft:[
    { n:'Islande', i:'droplet', bg:'linear-gradient(160deg,#dfe4e8,#cdd6dc)', d:'Sans date', s:['draft','Brouillon'], days:'6 jours' },
  ],
};

const AM_LABEL = { bed:'Chambres', wifi:'Wi-Fi', pool:'Piscine', fork:'Table' };

/* notifications */
const NOTIFS = [
  { i:'sparkle', t:'Votre itinéraire est prêt', d:'Sri Lanka · 10 jours a été composé. Découvrez le jour par jour.', time:'Il y a 5 min', unread:true, action:'open-itin' },
  { i:'bell', t:'Conciergerie', d:'Hansa : « J\'ai réservé votre table à Mirissa pour le soir 5. »', time:'Il y a 2 h', unread:true, action:'open-concierge' },
  { i:'check', t:'Réservation confirmée', d:'Villa Lagune, Colombo — référence HS-4827-LK.', time:'Hier', unread:false },
  { i:'plane', t:'Pensez à votre vol', d:'Les meilleurs tarifs CDG → CMB pour mai sont disponibles.', time:'Il y a 2 j', unread:false },
  { i:'leaf', t:'Inspiration', d:'5 lodges de thé d\'exception sélectionnés pour vous.', time:'Il y a 4 j', unread:false },
];

/* travel preferences */
const PREFS = {
  styles:['Aventure','Gastronomie','Nature'],
  budget:'Confort',
  rythme:'Équilibré',
  transport:'Privé',
};

/* documents */
const DOCUMENTS = [
  { i:'doc', n:'Passeport', s:'Valide jusqu\'en 2031', st:['ok','À jour'] },
  { i:'doc', n:'Visa électronique Sri Lanka', s:'Demande à effectuer', st:['prep','À faire'] },
  { i:'card', n:'Assurance voyage', s:'Cercle Hic Sunt · incluse', st:['ok','Active'] },
  { i:'plane', n:'Billets d\'avion', s:'Non renseignés', st:['draft','Manquant'] },
];

/* concierge thread */
const MESSAGES = [
  { who:'them', t:'Bonjour Charlotte ! Je suis Hansa, votre conciergère pour le Sri Lanka. Ravie de préparer ce voyage avec vous.' },
  { who:'them', t:'J\'ai noté votre goût pour la gastronomie et les trains panoramiques. Souhaitez-vous que je réserve une table d\'exception à Ella ?' },
  { who:'me', t:'Oui, avec plaisir — quelque chose avec vue sur les plantations.' },
  { who:'them', t:'Parfait. Je vous propose une table privée au coucher du soleil. Je m\'en occupe et reviens vers vous.' },
];
const QUICK_REPLIES = ['Merci !', 'Une question sur les vols', 'Modifier une étape'];
