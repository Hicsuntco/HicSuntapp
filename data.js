/* ── HIC SUNT · icons + data ──────────────────────────────────── */
const I = {
  close:'<path d="M18 6 6 18"/><path d="M6 6l12 12"/>',
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
  compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor" stroke="none"/>',
  sparkle:'<path d="M12 2C12.5 6.2 17.8 11.5 22 12C17.8 12.5 12.5 17.8 12 22C11.5 17.8 6.2 12.5 2 12C6.2 11.5 11.5 6.2 12 2Z" fill="currentColor" stroke="none"/>',
  route:'<circle cx="6" cy="7" r="2.4"/><circle cx="18" cy="17" r="2.4"/><path d="M6 9.5v3a3 3 0 0 0 3 3h4.5" stroke-dasharray="1 3"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  person:'<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  chevron:'<path d="M9 6l6 6-6 6"/>',
  back:'<path d="M15 6l-6 6 6 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  cal:'<rect x="4" y="5" width="16" height="16" rx="2.5"/><path d="M4 9h16M9 3v4M15 3v4"/>',
  doc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  bookmark:'<path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4V4z"/>',
  card:'<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M6.5 14.5h3"/>',
  bell:'<path d="M6 9a6 6 0 0 1 12 0c0 4 1.6 5.4 2 5.8H4c0.4-0.4 2-1.8 2-5.8z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.4 2.4 0 0 1 4.6 1c0 1.6-2 2-2 3.4"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/>',
  logout:'<path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"/><path d="M16 8l4 4-4 4M20 12H9"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M16 5.4a3.2 3.2 0 0 1 0 6.2M21 19a6 6 0 0 0-4-5.7"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  star:'<path d="M12 3.5l2.5 5.2 5.7 0.7-4.2 3.9 1.1 5.6L12 16.9l-5.1 2.9 1.1-5.6-4.2-3.9 5.7-0.7z" fill="currentColor" stroke="none"/>',
  heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  share:'<circle cx="6" cy="12" r="2.4"/><circle cx="17" cy="6" r="2.4"/><circle cx="17" cy="18" r="2.4"/><path d="M8.1 11l6.8-4M8.1 13l6.8 4"/>',
  external:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/>',
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
  'Sri Lanka': { r:'Océan Indien', i:'leaf', bg:'#2E9CC0',
    tag:'Là où le thé rencontre l\'océan',
    lede:'Une île-jardin entre plages de cocotiers, plantations de thé en altitude et cités sacrées. Le voyage le plus complet d\'Asie, à taille humaine.',
    best:'Janv. – avril', flight:'≈ 11 h', highlights:[
      ['peaks','Hauts plateaux de thé','Le train panoramique de Kandy à Ella, fenêtres ouvertes sur les plantations.'],
      ['droplet','Côte sud sauvage','Plages de Mirissa et Tangalle, lagunes et observation des baleines bleues.'],
      ['arch','Triangle culturel','Sigiriya, Dambulla et Anuradhapura — temples et palais millénaires.'] ] },
  'Japon': { r:'Asie de l\'Est', i:'torii', bg:'#129A8B',
    tag:'Entre tradition et néons',
    lede:'Des ruelles de Kyoto aux carrefours de Tokyo, un pays d\'extrêmes raffinés où chaque détail est une intention.',
    best:'Mars – mai', flight:'≈ 13 h', highlights:[
      ['arch','Temples de Kyoto','Mille torii vermillon, jardins de mousse et cérémonie du thé.'],
      ['fork','Tables de Tokyo','Du comptoir de sushi au izakaya de quartier, l\'art de la précision.'],
      ['peaks','Alpes japonaises','Villages aux toits de chaume et sources chaudes face au mont Fuji.'] ] },
  'Maroc': { r:'Afrique du Nord', i:'arch', bg:'#E86B4A',
    tag:'Du désert aux médinas',
    lede:'Les souks de Marrakech, les dunes de l\'Erg Chebbi et les kasbahs de l\'Atlas — l\'Orient à portée de Méditerranée.',
    best:'Oct. – avril', flight:'≈ 3 h', highlights:[
      ['arch','Médina de Marrakech','Riads cachés, palais et souks d\'artisans dans la ville rouge.'],
      ['peaks','Atlas & vallées','Randonnées berbères et nuits en kasbah au pied des sommets.'],
      ['droplet','Nuit dans le désert','Bivouac de luxe sous les étoiles dans les dunes de Merzouga.'] ] },
  'Portugal': { r:'Europe du Sud', i:'wave', bg:'#EE8B4C',
    tag:'Atlantique et azulejos',
    lede:'Lisbonne la lumineuse, le Douro et ses vignobles, l\'Algarve et ses falaises dorées. L\'Europe douce et iodée.',
    best:'Mai – sept.', flight:'≈ 2 h 30', highlights:[
      ['wave','Côte de l\'Algarve','Criques secrètes, falaises ocre et villages de pêcheurs.'],
      ['fork','Tables de Lisbonne','Pastéis, fruits de mer et fado dans les ruelles de l\'Alfama.'],
      ['droplet','Vallée du Douro','Croisière et dégustation dans les quintas en terrasses.'] ] },
  'Islande': { r:'Europe du Nord', i:'volcano', bg:'#3E8FA6',
    tag:'Terre de feu et de glace',
    lede:'Volcans fumants, cascades rugissantes, lagons laiteux et aurores boréales. Une île brute aux confins du cercle polaire, façonnée par les éléments.',
    best:'Juin – sept.', flight:'≈ 3 h 30', highlights:[
      ['droplet','Cascades du Sud','Seljalandsfoss et Skógafoss, murs d\'eau au pied des glaciers.'],
      ['volcano','Cercle d\'or','Geysers bouillonnants, faille continentale et chutes de Gullfoss.'],
      ['peaks','Lagon glaciaire','Icebergs dérivants de Jökulsárlón et plage de diamants.'] ] },
  'Pérou': { r:'Amérique du Sud', i:'peaks', bg:'#A66B3E',
    tag:'Sur les pas des Incas',
    lede:'Le Machu Picchu au lever du jour, la vallée sacrée, Cusco la coloniale et l\'Amazonie luxuriante. Des sommets andins à la jungle.',
    best:'Mai – sept.', flight:'≈ 14 h', highlights:[
      ['peaks','Machu Picchu','La cité perdue des Incas émergeant des nuées au lever du jour.'],
      ['arch','Cusco & Vallée sacrée','Ruelles coloniales, marchés andins et terrasses incas.'],
      ['leaf','Amazonie','Lodges au fil de l\'eau et faune foisonnante de la canopée.'] ] },
  'Thaïlande': { r:'Asie du Sud-Est', i:'stupa', bg:'#D4943A',
    tag:'Temples d\'or et îles turquoise',
    lede:'Les temples scintillants de Bangkok, la jungle du Nord à dos d\'éléphant et les eaux cristallines des îles du Sud.',
    best:'Nov. – mars', flight:'≈ 11 h 30', highlights:[
      ['stupa','Temples de Bangkok','Wat Pho, Wat Arun et le Grand Palais au fil du fleuve.'],
      ['leaf','Chiang Mai','Jungle du Nord, sanctuaires d\'éléphants et marchés de nuit.'],
      ['wave','Îles du Sud','Krabi, Phi Phi et lagons émeraude entre les pitons calcaires.'] ] },
  'Kenya': { r:'Afrique de l\'Est', i:'sun', bg:'#54AE6E',
    tag:'Le grand safari',
    lede:'Les plaines du Masai Mara, la grande migration, les éléphants au pied du Kilimandjaro et les plages blanches de l\'océan Indien.',
    best:'Juil. – oct.', flight:'≈ 8 h', highlights:[
      ['sun','Masai Mara','Lions, guépards et la grande migration des gnous.'],
      ['peaks','Amboseli','Troupeaux d\'éléphants face au mont Kilimandjaro.'],
      ['wave','Côte de Diani','Sable blanc et lagons turquoise pour clore le safari.'] ] },
};
const DEST_ORDER = ['Sri Lanka','Japon','Maroc','Portugal','Islande','Pérou','Thaïlande','Kenya'];

/* generator vocabulary (aligned with hicsunt.com) */
const TRAVEL_STYLES = [
  'Partir à l\'aube pour avoir les sites pour soi',
  'Manger chez l\'habitant, jamais dans un hôtel',
  'Trouver le bar que seuls les locaux connaissent',
  'Marcher jusqu\'à l\'épuisement pour une vue',
  'Flâner sans itinéraire, se perdre exprès',
  'Dormir dans des endroits qui ont une histoire',
  'Rapporter des savoirs-faire, pas des souvenirs',
  'Fuir les foules à tout prix',
  'Nager dans des eaux où personne ne va',
  'Voir comment les gens vivent vraiment',
  'Partir léger, revenir changé',
  'Manger le meilleur de chaque ville',
  'Rouler sans savoir où on dort ce soir',
  'Photographier ce que les autres ne voient pas',
  'Faire une seule chose par jour, mais la faire bien',
  'Tester ses limites physiques',
];

const INTERESTS = [
  'Marchés de producteurs au lever du soleil',
  'Criques et plages sans chemin balisé',
  'Restaurants que les guides n\'ont pas encore trouvé',
  'Randonnées avec vue sur quelque chose d\'exceptionnel',
  'Villages perchés et ruelles sans touristes',
  'Couchers de soleil dans des endroits secrets',
  'Faune sauvage et safaris',
  'Temples, mosquées, lieux de spiritualité',
  'Vignobles et caves à visiter',
  'Cours de cuisine avec un chef local',
  'Plongée, snorkeling, fond marin',
  'Architecture remarquable',
  'Spas, soins, bains traditionnels',
  'Musique live et scène culturelle locale',
  'Vélo et routes secondaires',
  'Sources thermales et bains naturels',
  'Activités nautiques',
  'Ateliers artisanaux',
];

const OCCASIONS = [
  { id:'lune-de-miel', label:'Lune de miel',   ic:'heart',   desc:'Intimité, romance, adresses d\'exception' },
  { id:'anniversaire', label:'Anniversaire',   ic:'star',    desc:'Un moment qui restera gravé' },
  { id:'evjf',         label:'EVJF',            ic:'sparkle', desc:'Entre filles — spas, fêtes, adresses tendance' },
  { id:'evg',          label:'EVG',             ic:'star',    desc:'Entre amis — adrénaline, fêtes, expériences fortes' },
  { id:'famille',      label:'En famille',      ic:'users',   desc:'Rythme doux, plaisir pour tous les âges' },
  { id:'solo',         label:'En solo',         ic:'compass', desc:'Liberté totale, rencontres, immersion' },
  { id:'amis',         label:'Entre amis',      ic:'users',   desc:'Partager, explorer, créer des souvenirs communs' },
  { id:'bien-etre',    label:'Retraite bien-être', ic:'droplet', desc:'Ressourcement, spa, yoga, déconnexion' },
];

/* itinerary — vide par défaut, chargé depuis Supabase */
const ITINERARY = {
  dest:'', tag:'', dates:'', days:0, level:'Confort',
  plan:[], accommodations:[], gems:[], theme:'mediterranean', palette:{},
  budgetTotal:0, coords:'', distance:'', season:'', region:'', country:'',
};

/* trips — alimenté dynamiquement depuis Supabase */
const TRIPS = { upcoming:[], past:[], draft:[] };

const AM_LABEL = { bed:'Chambres', wifi:'Wi-Fi', pool:'Piscine', fork:'Table' };

/* notifications — vide par défaut, alimenté plus tard par de vrais événements */
const NOTIFS = [];

/* travel preferences */
const PREFS = {
  styles:['Aventure','Gastronomie','Nature'],
  budget:'Confort',
  rythme:'Équilibré',
  transport:'Privé',
};

/* documents */
const DOCUMENTS = [
  { i:'doc', n:'Passeport', s:'', st:['draft','À vérifier'] },
  { i:'card', n:'Assurance voyage', s:'Cercle Hic Sunt · incluse', st:['ok','Active'] },
  { i:'plane', n:'Billets d\'avion', s:'Non renseignés', st:['draft','Manquant'] },
];

/* concierge thread */
const MESSAGES = [];
const QUICK_REPLIES = ['Merci !', 'Une question sur les vols', 'Modifier une étape'];
