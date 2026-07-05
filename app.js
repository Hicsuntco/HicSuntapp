/* ── HIC SUNT · Sillage — app: state, routeur, overlays ─────────────── */

const USER = { name:'Voyageur', full:'', initials:'', since:'' };

/* Source de vérité unique pour le nombre de jours */
function _days(it){ it = it||ITINERARY; return (it.plan&&it.plan.length) ? it.plan.length : (Number(it.days)||0); }

const state = {
  createTab:'known',
  destination:'', origin:'',
  dateFrom:'', dateTo:'',
  travelers:2,
  budget:'Confort', rythme:'Équilibré',
  styles:[], interests:[], occasion:null,
  flightOut:'', flightIn:'',
  dream:'',
  /* ── Nouveaux champs sur-mesure ── */
  childrenAges:'',      /* ex: "4 et 8 ans" si famille */
  transport:'Selon les étapes',
  dietary:'',
  alreadyDone:'',
  fitnessLevel:'Modéré',
  accomStyle:'L\'emplacement avant tout',
  deckIndex:0,
  mapDay:0,
  tab:'discover',
};

/* ── Redéfinition forcée des fonctions carte (app.js chargé en dernier) ─
   Écrase l'ancienne mapSVG/mapView de features.js qui utilisait contour()
   et graticule() — responsables de la spirale et des ronds abstraits.    ── */
var _GEO = {
  'thaïlande':{vb:'0 0 100 160',path:'M34.9,9.0L37.1,8.4L39.2,10.4L37.9,14.5L39.2,16.5L46.8,16.5L47.6,22.1L45.0,27.3L46.0,30.2L44.0,36.1L46.3,36.5L56.5,29.6L62.6,33.4L66.8,31.3L69.4,27.6L76.6,28.5L86.0,38.4L86.1,46.5L95.0,54.4L93.4,58.3L93.2,65.4L88.8,68.3L85.6,66.4L68.4,67.3L65.3,69.2L61.3,74.6L58.8,75.0L60.8,83.5L63.6,85.9L63.4,89.2L65.5,92.9L61.8,88.1L61.2,89.0L53.6,83.8L43.4,83.7L44.1,76.1L40.2,74.8L33.8,76.9L33.5,88.4L24.5,106.4L24.5,112.1L25.5,116.7L31.8,116.4L33.5,123.2L36.6,126.4L39.5,136.5L36.7,133.4L36.4,131.2L35.3,132.9L38.2,136.9L44.7,140.1L49.9,140.0L56.5,146.1L54.0,150.2L51.9,150.6L50.5,149.4L45.7,152.0L44.3,150.7L45.1,146.1L43.1,146.1L41.8,144.0L37.3,143.1L36.4,141.8L34.9,144.2L30.3,139.9L29.2,135.3L26.6,135.1L19.5,126.5L18.1,125.6L15.7,127.2L14.4,124.9L20.1,103.1L29.4,92.2L27.1,84.7L24.1,80.0L24.2,73.3L14.0,61.1L13.9,58.8L17.9,57.2L18.3,50.6L21.5,47.7L19.0,47.9L16.6,41.6L8.6,33.6L7.8,28.8L5.0,26.6L9.0,25.9L9.8,17.4L12.0,14.6L21.8,14.3L23.5,11.2L28.0,10.7L27.7,8.6L32.4,8.0L34.9,9.0Z',cities:{'Bangkok':[39.0,73.0],'Chiang Mai':[22.0,24.0],'Chiang Rai':[32.0,13.0],'Ayutthaya':[40.0,67.0],'Phuket':[16.0,130.0],'Krabi':[22.0,128.0],'Koh Samui':[34.0,114.0],'Hua Hin':[33.0,84.0],'Pai':[17.0,18.0],'Sukhothai':[32.0,41.0]}},
  'maroc':{vb:'0 0 120 100',path:'M106.2,10.0L109.1,12.2L109.8,21.1L111.4,24.4L114.0,26.3L112.8,27.2L112.9,28.6L101.8,28.8L100.8,30.3L95.7,31.2L95.2,34.2L96.7,35.1L96.4,35.7L87.6,38.8L84.3,42.0L77.3,42.8L76.3,44.4L72.8,44.0L65.2,48.0L62.4,49.8L61.6,59.6L57.4,59.8L54.7,61.3L48.3,60.2L44.0,61.1L44.4,62.6L41.8,65.9L39.5,66.6L37.0,73.8L33.2,76.0L31.0,79.1L27.1,80.9L24.9,89.5L22.1,92.3L21.3,94.5L6.0,95.0L6.5,92.0L10.4,87.7L11.4,84.6L14.2,80.3L12.9,81.0L13.5,79.9L20.2,74.5L21.0,70.2L23.5,65.0L29.2,62.0L33.5,54.6L42.9,52.2L52.1,45.5L55.7,41.0L55.8,38.9L54.3,37.2L54.8,32.8L57.9,28.7L58.6,25.7L63.5,21.5L74.5,17.0L78.2,12.0L81.1,5.7L85.5,5.0L85.6,6.8L89.9,9.3L98.2,9.3L101.1,8.1L102.0,9.8L106.2,10.0Z',cities:{'Marrakech':[67.0,32.0],'Casablanca':[70.0,19.0],'Fès':[87.0,17.0],'Rabat':[75.0,17.0],'Agadir':[56.0,39.0],'Essaouira':[55.0,32.0],'Tanger':[82.0,6.0],'Merzouga':[94.0,35.0],'Ouarzazate':[75.0,36.0],'Chefchaouen':[86.0,10.0]}},
  'sardaigne':{vb:'0 0 80 120',path:'M64.8,21.1L76.0,41.1L68.8,51.8L71.6,63.5L65.2,102.9L42.6,99.5L38.6,112.3L24.4,114.0L14.2,101.1L19.9,71.7L13.7,68.1L16.5,50.7L4.0,34.1L5.5,21.9L21.0,24.9L50.3,6.0L67.5,17.1L64.8,21.1Z',cities:{'Cagliari':[45.0,100.0],'Iglesias':[20.0,96.0],'Oristano':[22.0,68.0],'Nuoro':[55.0,49.0],'Sassari':[20.0,30.0],'Alghero':[10.0,38.0],'Olbia':[62.0,22.0],'Villasimius':[68.0,110.0],'Barumini':[46.0,102.0],'Su Nuraxi':[46.0,102.0],'Gesturi':[46.0,100.0],'Costa Smeralda':[72.0,20.0],'Porto Cervo':[72.0,18.0],'Sinis':[28.0,78.0],'Tharros':[26.0,80.0],'Bosa':[24.0,60.0],'Aggius':[62.0,22.0],'Orgosolo':[58.0,66.0],'Dorgali':[66.0,68.0],'Cala Gonone':[70.0,72.0],'Tortoli':[72.0,84.0],'Arbatax':[74.0,88.0],'Pula':[44.0,112.0],'Chia':[40.0,116.0],'Teulada':[34.0,114.0],'Portoscuso':[26.0,106.0],'Carbonia':[30.0,108.0],'Gonnosfanadiga':[36.0,104.0],'Mandas':[54.0,106.0],'Laconi':[48.0,90.0],'Aritzo':[56.0,84.0],'Fonni':[60.0,72.0],'Gavoi':[56.0,68.0],'Bitti':[62.0,56.0],'Siniscola':[70.0,52.0],'Posada':[72.0,44.0],'Palau':[68.0,16.0],'La Maddalena':[74.0,12.0],'Castelsardo':[42.0,14.0],'Sorso':[36.0,22.0],'Thiesi':[40.0,36.0],'Macomer':[44.0,56.0],'Abbasanta':[44.0,64.0],'Samugheo':[48.0,78.0],'Sorgono':[54.0,76.0],'Jerzu':[70.0,90.0],'Muravera':[66.0,104.0],'Dolianova':[56.0,108.0],'Selargius':[54.0,114.0],'Quartu':[56.0,116.0],'Quartucciu':[58.0,114.0],'Carloforte':[18.0,108.0],'San Pietro':[18.0,108.0],'Isola San Pietro':[18.0,108.0],'Domus de Maria':[40.0,118.0],'Porto Pino':[28.0,114.0],'Calasetta':[22.0,110.0],'Sant Anna Arresi':[26.0,112.0],'Sulcis':[24.0,106.0],'Fluminimaggiore':[16.0,88.0],'Cagliari Elmas':[42.0,98.0],'Elmas':[42.0,98.0]}},
  'japon':{vb:'0 0 100 140',path:'M69.8,41.3L70.9,40.9L70.7,46.5L72.8,50.1L73.8,54.2L73.8,57.2L73.3,59.8L71.4,62.7L70.9,65.6L69.0,66.2L68.2,67.7L68.4,76.3L66.0,83.6L67.7,87.7L65.4,89.5L64.8,92.2L62.0,94.4L61.9,91.3L63.4,88.9L61.9,88.3L60.9,90.4L61.1,92.5L60.0,91.3L58.7,91.4L57.8,95.1L56.5,96.9L56.3,93.9L56.8,93.5L55.8,92.7L52.9,97.1L46.7,97.2L47.8,95.6L46.1,95.1L45.6,95.9L45.8,93.4L45.2,93.3L43.8,96.4L45.7,98.4L45.5,99.3L42.6,100.5L40.4,105.6L39.1,106.2L37.8,105.7L36.0,101.9L35.9,99.6L37.6,96.9L33.9,95.7L31.2,96.1L25.1,99.5L20.5,99.3L19.6,103.3L17.3,101.6L12.8,102.2L12.7,99.8L13.3,98.7L15.2,98.6L23.9,89.5L29.7,89.5L36.3,87.6L37.1,89.4L40.3,88.7L41.3,87.4L41.2,84.5L44.7,79.4L44.8,75.6L45.5,74.1L48.1,72.9L45.8,76.3L46.4,78.6L47.7,79.3L53.6,75.4L56.7,70.3L59.4,68.2L61.8,61.7L63.2,55.6L62.8,53.7L61.4,53.1L62.9,50.3L62.4,47.5L64.4,45.5L64.8,42.5L66.3,42.6L67.0,45.6L68.0,44.7L69.0,45.2L69.7,42.5L67.3,43.1L67.3,42.1L68.0,40.0L69.8,41.3ZM84.6,18.5L89.3,20.0L92.4,16.8L91.1,20.5L91.2,22.2L92.3,25.2L95.0,24.5L90.0,27.7L84.7,28.7L81.8,32.5L80.7,36.0L73.1,31.2L70.6,31.4L68.3,33.1L66.8,31.4L65.5,31.3L64.7,33.5L69.2,37.6L66.5,37.5L64.3,40.5L63.1,40.3L63.5,36.7L62.0,33.7L62.1,31.2L65.2,28.1L65.0,25.2L69.1,26.2L70.4,25.4L70.6,22.4L72.6,15.5L72.7,13.5L71.6,9.9L72.0,7.9L73.5,7.0L79.8,15.0L84.6,18.5ZM15.0,105.5L17.1,105.3L16.2,108.0L18.2,108.1L17.9,109.3L18.8,111.2L16.9,114.6L15.1,123.4L13.7,123.1L13.8,124.6L11.5,126.6L12.0,120.9L10.8,122.1L11.0,125.3L8.6,123.4L9.4,123.0L9.5,121.8L8.8,120.4L8.8,117.7L11.3,113.4L10.5,113.1L10.8,111.6L9.1,108.8L8.5,109.4L8.7,111.5L9.6,111.5L9.6,112.7L8.1,112.1L6.5,113.8L6.8,112.5L6.0,109.7L7.7,111.5L5.4,108.3L11.7,102.6L15.0,105.5ZM29.5,99.1L33.3,100.1L33.9,103.5L31.9,105.2L30.8,108.2L29.6,106.5L27.8,106.0L25.9,107.3L23.6,112.3L22.3,112.2L22.7,111.0L21.5,110.9L21.1,106.7L19.0,107.4L22.3,104.5L23.9,101.2L25.0,102.6L27.5,101.8L27.6,100.0L29.5,99.1Z',cities:{'Tokyo':[61.0,88.0],'Kyoto':[40.0,94.0],'Osaka':[38.0,96.0],'Hiroshima':[21.0,99.0],'Sapporo':[70.0,27.0],'Nara':[40.0,96.0],'Hakone':[57.0,92.0],'Nikko':[61.0,80.0],'Kanazawa':[44.0,81.0]}},
  'grèce':{vb:'0 0 120 100',path:'M87.0,5.0L93.2,6.4L93.8,9.0L90.1,11.2L90.4,14.4L87.3,17.7L74.7,14.4L70.7,16.3L66.8,15.1L61.8,18.0L57.8,17.7L59.1,22.1L63.4,23.3L65.1,25.7L59.7,22.9L57.3,23.3L60.4,26.1L60.1,28.1L56.5,24.7L53.5,24.1L53.6,26.1L56.7,28.2L53.2,27.8L52.1,24.8L46.9,22.3L47.2,19.8L43.5,21.1L43.1,27.2L52.3,38.6L50.1,39.6L50.2,37.5L47.2,36.9L46.8,38.7L49.0,40.4L42.8,42.7L60.4,50.6L61.5,58.1L54.5,53.8L48.6,55.9L54.3,61.7L50.2,63.1L44.7,60.3L50.2,74.9L44.6,70.3L41.0,74.5L36.6,67.2L35.0,67.7L34.3,71.0L32.3,69.4L30.4,66.5L31.6,62.4L24.6,55.7L28.1,51.6L35.0,50.0L47.2,54.8L46.8,53.6L50.5,52.5L40.9,48.4L29.0,50.0L27.2,47.8L25.3,49.7L20.1,42.6L24.4,42.3L24.5,40.6L20.3,40.8L14.2,36.6L10.5,31.5L13.6,31.9L15.3,30.3L14.4,27.9L18.7,26.1L23.4,19.4L22.6,16.4L30.3,16.1L35.5,12.6L41.8,12.8L44.7,12.0L45.5,9.9L61.5,7.4L67.3,7.0L70.5,9.6L76.5,11.1L85.0,10.2L87.6,9.2L87.0,5.0ZM58.9,87.0L62.9,86.2L62.1,87.5L65.2,89.3L82.5,89.5L83.3,92.5L90.0,89.9L88.0,93.9L70.8,95.0L66.6,92.0L55.6,90.7L55.4,87.0L57.5,85.4L58.9,87.0ZM51.4,40.5L54.8,43.4L62.4,45.6L64.2,51.3L67.9,52.3L68.0,54.0L65.3,54.0L61.3,49.1L56.4,48.4L51.4,43.6L46.6,42.7L51.4,40.5ZM91.1,36.6L92.8,41.0L87.9,40.6L89.4,38.3L86.8,39.7L84.0,38.3L88.0,36.0L91.1,36.6Z',cities:{'Athènes':[57.0,55.0],'Thessalonique':[47.0,19.0],'Santorin':[79.0,75.0],'Mykonos':[77.0,62.0],'Rhodes':[114.0,75.0],'Corfou':[9.0,33.0],'Héraklion':[75.0,90.0],'Patras':[32.0,51.0]}},
  'portugal':{vb:'0 0 60 100',path:'M16.1,7.2L23.9,5.0L24.9,10.6L37.3,10.3L41.5,7.7L50.3,8.4L51.5,13.1L57.0,15.6L45.1,24.7L47.1,36.4L43.4,39.5L45.7,42.1L44.4,46.0L35.1,48.4L44.0,59.0L38.3,69.5L42.2,74.4L44.7,74.3L36.6,82.3L37.2,92.0L30.2,95.0L17.5,93.0L10.9,94.5L13.9,87.5L12.8,69.7L16.3,70.1L14.2,68.5L7.3,69.7L6.7,66.0L10.5,64.4L14.3,58.6L8.6,64.5L3.0,64.7L4.6,54.1L13.5,40.4L16.6,24.4L14.9,12.6L12.7,11.5L16.1,7.2Z',cities:{'Lisbonne':[9.0,65.0],'Porto':[17.0,22.0],'Faro':[29.0,95.0],'Évora':[29.0,68.0],'Sintra':[4.0,64.0],'Coimbra':[20.0,39.0],'Braga':[20.0,15.0],'Lagos':[16.0,93.0]}},
  'islande':{vb:'0 0 140 80',path:'M110.2,10.8L121.1,7.3L115.1,13.7L120.0,15.6L118.5,21.5L123.5,21.0L124.4,23.4L122.6,25.9L126.1,24.3L132.4,27.2L130.3,31.0L133.0,37.6L129.7,39.4L127.5,45.2L123.6,45.1L123.0,49.9L120.8,52.7L106.9,58.2L97.5,65.4L83.9,68.9L82.4,73.0L74.3,76.0L56.4,72.6L53.0,69.5L53.9,66.8L51.2,68.4L45.9,63.7L28.1,66.3L27.5,60.4L33.4,61.4L41.8,53.5L35.0,55.0L36.7,53.2L35.6,52.7L36.2,50.4L40.3,47.8L34.4,50.0L30.2,43.9L14.6,45.2L12.2,42.3L36.8,38.1L38.3,35.2L29.7,34.6L37.4,28.9L25.2,25.8L13.7,29.8L7.0,27.1L9.6,25.0L14.2,26.7L11.4,21.2L16.9,23.5L20.8,21.9L14.4,19.6L18.0,18.9L15.1,15.7L19.0,15.5L17.1,13.6L18.8,11.9L23.8,16.5L28.0,15.5L28.5,19.1L30.5,18.2L30.5,14.5L24.7,11.2L30.0,9.9L22.7,8.3L25.3,5.9L30.7,6.1L42.5,15.5L41.2,16.8L43.6,18.5L42.8,22.0L39.5,22.5L42.9,25.8L42.2,28.2L45.7,33.0L49.4,24.5L53.5,26.0L54.6,15.3L56.3,13.8L64.6,21.4L65.8,14.3L72.0,11.8L80.2,22.2L78.4,12.4L82.9,12.8L87.0,16.9L91.6,11.4L99.3,11.6L98.7,5.8L102.0,4.0L105.1,4.2L110.2,10.8Z',cities:{'Reykjavik':[36.0,59.0],'Akureyri':[80.0,23.0],'Vik':[70.0,76.0],'Húsavík':[89.0,17.0],'Egilsstaðir':[123.0,33.0],'Höfn':[114.0,57.0]}},
  'pérou':{vb:'0 0 100 130',path:'M85.9,33.3L85.3,33.9L82.8,32.8L80.0,32.9L78.7,34.0L72.5,35.0L65.1,39.0L64.4,42.3L62.6,45.2L63.3,47.6L58.9,50.4L59.2,53.0L57.4,53.4L57.2,54.5L59.2,56.0L58.8,57.0L60.4,59.6L64.5,63.7L62.8,66.4L68.7,67.0L70.1,70.2L76.8,69.9L81.8,66.6L81.1,76.6L88.6,76.2L95.0,86.1L92.9,88.6L92.2,93.7L93.7,96.8L90.2,100.8L91.5,103.6L89.8,106.2L91.2,109.5L93.9,110.7L88.3,116.2L89.1,118.1L86.7,119.4L87.1,121.2L86.2,122.6L82.7,123.5L76.1,119.3L74.7,116.8L68.1,113.0L59.1,109.8L49.3,104.7L46.3,101.5L43.4,99.8L40.3,94.8L41.1,94.5L41.4,91.7L37.0,85.2L34.8,83.3L34.3,80.8L31.3,78.4L30.6,75.5L27.4,70.7L23.3,61.3L14.5,49.5L6.4,44.9L6.2,43.8L7.9,43.6L8.2,42.3L5.0,36.1L5.7,33.3L12.2,27.9L13.2,31.0L11.0,31.9L11.0,32.9L12.0,33.1L11.1,34.6L13.5,33.7L17.1,34.7L19.3,37.7L21.4,38.0L23.9,35.4L26.3,27.9L27.6,28.4L27.4,27.6L29.7,25.3L38.1,22.6L42.3,19.9L46.0,16.0L47.2,12.1L48.3,12.3L48.2,10.0L45.6,7.0L48.5,6.5L52.8,8.6L55.4,12.4L59.6,14.2L60.8,17.1L62.9,17.9L63.2,20.8L64.7,21.5L69.9,21.6L73.2,20.0L75.7,21.2L78.8,20.3L85.0,23.2L80.4,30.4L83.2,30.6L85.9,33.3Z',cities:{'Lima':[36.0,83.0],'Cusco':[72.0,93.0],'Machu Picchu':[68.0,90.0],'Arequipa':[75.0,111.0],'Iquitos':[63.0,30.0],'Paracas':[41.0,95.0],'Trujillo':[21.0,58.0],'Puno':[86.0,107.0]}},
  'kenya':{vb:'0 0 100 110',path:'M5.0,68.7L5.5,57.3L11.5,48.8L15.1,46.9L17.1,41.7L16.3,34.8L11.1,28.2L11.0,23.4L8.0,21.8L5.8,17.9L20.4,5.5L21.0,6.7L25.8,6.9L26.0,12.2L28.9,15.5L38.9,16.0L52.2,23.4L68.1,25.3L72.0,21.5L82.4,17.4L86.6,20.4L95.0,20.2L84.6,31.6L84.8,67.4L91.0,75.5L88.0,77.9L83.8,78.7L83.9,81.1L81.0,83.7L76.3,85.1L75.1,90.6L66.7,104.0L64.6,104.5L48.9,94.7L46.8,93.0L47.2,88.6L5.0,68.7Z',cities:{'Nairobi':[38.0,72.0],'Mombasa':[70.0,98.0],'Masai Mara':[19.0,74.0],'Amboseli':[43.0,85.0],'Lac Nakuru':[30.0,63.0],'Samburu':[46.0,53.0],'Lamu':[84.0,81.0]}},
  'sri lanka':{vb:'0 0 70 100',path:'M11.4,5.0L19.2,5.4L32.6,15.5L51.9,37.4L66.5,64.3L66.1,73.3L59.6,84.5L33.0,95.0L19.7,94.3L14.6,90.9L7.8,75.0L3.5,43.3L4.6,40.6L5.6,47.1L9.8,26.4L14.8,19.2L14.4,10.5L24.4,12.8L13.2,8.8L11.4,5.0Z',cities:{'Colombo':[8.0,73.0],'Kandy':[31.0,64.0],'Galle':[18.0,94.0],'Sigiriya':[34.0,49.0],'Ella':[42.0,74.0],'Trincomalee':[48.0,34.0],'Jaffna':[12.0,8.0]}},
  'italie':{vb:'0 0 80 120',path:'M6.6,18.2L11.0,18.1L14.9,12.6L15.1,14.7L18.5,18.8L18.4,17.1L20.3,12.1L21.6,14.1L24.1,13.5L25.0,14.9L25.0,11.0L27.1,11.5L27.2,8.3L30.5,9.2L32.1,7.1L37.7,6.0L37.6,7.5L39.0,9.9L47.0,11.8L45.1,14.5L46.6,15.4L45.7,17.4L48.1,21.2L47.1,21.5L46.6,19.6L44.0,19.6L38.3,23.0L38.0,25.1L39.9,28.0L38.2,30.5L39.1,35.7L46.2,42.5L48.9,51.6L52.1,56.3L56.0,59.5L62.0,59.9L60.4,63.9L72.9,72.8L76.0,77.3L75.6,80.6L75.3,81.4L73.7,80.2L72.4,76.7L69.5,76.1L68.2,74.4L66.7,74.8L64.2,82.2L67.8,86.0L68.2,90.0L64.8,92.1L64.3,96.1L61.4,101.0L59.3,101.0L58.8,98.5L59.9,97.2L60.6,93.4L62.2,92.5L62.3,90.6L59.1,79.7L54.6,77.1L54.6,74.7L53.5,72.6L50.9,73.4L51.6,72.0L49.1,71.1L47.2,66.7L43.3,66.7L40.5,64.3L34.5,55.8L31.2,54.5L31.6,53.2L28.8,49.1L27.6,48.8L26.0,39.6L24.8,37.8L17.0,33.6L12.3,39.3L9.2,40.4L10.1,36.3L8.2,36.6L5.6,34.5L5.3,32.7L6.4,30.6L6.2,29.4L4.0,26.9L6.7,25.1L7.2,23.5L4.9,19.5L6.6,18.2ZM58.8,97.6L55.5,106.0L56.7,110.2L55.6,114.0L51.9,112.8L50.4,110.3L40.6,104.6L39.3,102.2L41.1,98.5L42.2,100.0L44.5,98.4L47.6,100.6L58.8,97.6ZM21.8,69.9L23.3,74.4L22.3,76.8L22.7,79.4L21.8,88.3L18.7,87.5L18.2,90.4L16.3,90.7L14.9,87.8L15.6,81.3L14.8,80.4L15.2,76.5L13.5,72.8L13.7,70.1L15.8,70.8L19.8,66.5L22.1,69.0L21.8,69.9Z',cities:{'Rome':[40.0,60.0],'Milan':[20.0,23.0],'Florence':[32.0,40.0],'Naples':[50.0,71.0],'Venise':[39.0,23.0],'Palerme':[45.0,99.0],'Bologne':[33.0,33.0],'Amalfi':[52.0,73.0]}},
  'vietnam':{vb:'0 0 60 140',path:'M46.1,22.7L42.0,24.6L41.6,26.6L40.2,27.5L36.6,27.0L37.1,29.3L35.6,31.1L35.4,33.1L31.5,36.1L28.8,44.4L30.8,48.4L35.3,53.1L35.1,55.1L34.3,54.8L45.1,67.0L46.6,66.9L52.4,75.1L56.0,88.1L55.7,93.0L57.0,98.8L56.2,97.5L55.3,98.4L55.6,104.3L53.6,109.6L40.9,117.6L39.0,115.4L38.6,117.6L36.9,116.4L36.0,117.0L37.0,117.2L37.2,118.5L35.0,118.5L37.4,120.0L36.0,122.2L32.6,119.1L35.8,124.1L34.4,124.8L30.3,121.0L32.7,124.5L32.8,126.2L27.9,128.8L25.0,132.7L22.5,133.0L23.4,131.7L23.1,124.4L24.9,121.5L20.0,117.5L23.1,116.5L24.5,115.0L24.5,113.2L26.5,113.8L29.8,112.6L32.8,114.2L32.8,112.2L30.5,110.0L30.5,107.0L31.6,106.0L34.5,106.6L34.6,104.4L42.7,100.8L42.5,95.1L43.4,91.6L41.4,85.8L42.9,81.3L42.5,78.5L43.8,76.1L40.2,71.4L41.9,69.4L37.9,65.4L36.4,65.5L35.3,61.6L25.0,49.2L25.3,47.1L16.0,41.5L17.3,40.0L17.1,38.4L21.2,38.8L23.7,35.4L23.1,33.9L19.5,31.8L21.1,30.1L17.6,27.5L14.1,29.6L10.2,28.0L8.3,24.8L9.1,21.2L8.1,20.1L6.9,21.3L3.0,15.3L5.5,12.1L9.3,14.7L11.8,11.9L13.1,13.5L14.0,11.8L16.4,13.9L17.9,11.7L19.6,12.5L21.9,11.5L23.2,8.8L26.2,7.0L30.4,10.6L32.7,10.2L37.3,11.8L35.6,14.2L36.5,18.7L38.7,19.1L41.5,21.8L44.6,21.4L46.1,22.7Z',cities:{'Hanoi':[30.0,27.0],'Ho Chi Minh':[36.0,114.0],'Hoi An':[49.0,71.0],'Hue':[43.0,66.0],'Da Nang':[48.0,69.0],'Nha Trang':[55.0,102.0],'Ha Long':[40.0,27.0],'Dalat':[50.0,104.0]}},
  'cambodge':{vb:'0 0 80 70',path:'M74.8,3.5L72.3,12.0L76.0,22.1L74.2,28.1L75.1,36.9L73.1,39.4L70.6,38.7L66.8,42.1L59.8,43.9L59.6,47.8L54.2,46.7L52.1,48.5L52.2,53.5L56.3,57.3L56.4,60.9L50.8,58.0L44.8,60.1L41.1,59.2L41.1,62.2L38.5,64.7L32.7,66.5L25.1,62.9L21.3,64.4L20.6,62.7L23.1,59.5L20.5,55.7L18.1,59.0L15.3,59.1L15.0,51.1L9.7,41.9L9.9,36.9L6.5,33.4L4.0,20.6L7.1,19.9L13.7,10.1L20.7,7.7L37.5,7.6L41.0,10.5L43.0,8.8L45.3,12.2L47.7,11.6L55.0,15.0L55.8,13.1L53.8,8.8L57.2,6.9L61.0,5.4L66.9,9.0L74.8,3.5Z',cities:{'Phnom Penh':[39.0,50.0],'Siem Reap':[25.0,23.0],'Angkor Wat':[25.0,23.0],'Sihanoukville':[20.0,63.0],'Battambang':[16.0,27.0]}},
  'espagne':{vb:'0 0 130 80',path:'M71.0,7.6L74.3,8.9L74.1,10.8L75.2,10.2L86.1,14.0L91.9,14.0L92.5,12.6L98.2,14.0L99.0,16.3L101.3,15.7L103.7,17.1L109.4,17.2L114.3,16.4L115.1,17.7L113.8,18.9L114.6,20.9L104.5,27.0L95.4,29.1L92.7,31.4L94.2,32.3L91.6,33.3L83.6,43.5L84.7,47.7L88.2,50.6L82.0,54.7L79.4,59.8L80.2,61.1L75.0,61.7L72.3,63.3L68.2,69.0L48.7,69.6L46.0,71.5L41.7,72.3L40.1,75.0L37.8,76.0L34.2,74.5L31.2,70.3L32.6,67.7L31.1,68.5L27.0,64.3L22.3,65.3L22.0,60.2L26.2,55.9L24.9,55.9L22.9,53.4L25.9,47.8L21.2,42.2L26.1,40.9L26.8,38.8L25.6,37.5L27.5,35.8L26.5,29.6L32.7,24.8L29.8,23.5L29.2,21.0L24.6,20.6L22.4,22.0L15.9,22.2L15.3,21.4L16.1,20.2L14.9,19.1L9.8,21.1L9.5,19.4L11.2,17.9L10.1,17.8L10.9,16.6L10.2,14.5L8.3,14.9L9.2,13.0L6.5,11.3L7.0,9.5L14.1,7.4L15.0,5.7L19.8,4.0L25.3,6.0L35.8,5.1L47.3,7.2L55.3,6.3L60.1,7.7L61.6,6.9L66.2,8.1L71.0,7.6Z',cities:{'Madrid':[54.0,35.0],'Barcelone':[105.0,26.0],'Séville':[35.0,63.0],'Grenade':[55.0,65.0],'Valence':[83.0,44.0],'Bilbao':[61.0,9.0],'Saint-Jacques':[13.0,12.0],'Malaga':[48.0,70.0]}},
  'france':{vb:'0 0 110 100',path:'M91.1,37.5L86.2,39.3L86.9,40.0L83.1,43.4L79.7,50.2L81.3,50.4L82.9,48.2L85.3,48.5L85.3,50.7L87.0,52.9L85.4,54.6L87.9,57.8L87.4,59.3L84.3,60.9L86.8,63.1L87.1,64.1L85.8,66.0L86.2,67.7L89.1,69.5L91.3,69.2L90.3,72.9L83.9,78.2L80.7,79.4L75.8,77.9L73.4,75.9L71.0,76.6L65.5,74.8L61.0,78.2L59.5,80.8L60.7,85.3L52.5,86.0L50.2,84.6L50.3,83.7L43.7,81.5L42.8,82.9L38.2,82.9L29.4,79.1L28.3,79.6L28.7,77.8L26.0,76.3L28.2,74.8L29.8,65.6L31.0,64.4L30.5,63.7L29.8,64.6L31.0,56.6L32.7,58.0L33.7,60.6L34.6,61.5L33.0,57.2L30.2,54.9L31.3,54.6L30.5,49.3L26.1,47.5L24.2,44.7L24.5,42.6L23.2,41.5L24.4,40.4L26.4,41.0L24.8,40.1L21.1,40.1L21.6,38.6L19.3,38.2L19.2,37.2L8.6,35.3L6.1,33.3L8.5,32.1L6.8,31.0L9.1,30.9L5.5,29.5L7.1,28.0L16.1,25.9L19.8,28.7L21.5,27.7L24.6,28.3L25.3,27.2L28.9,27.7L27.6,26.2L27.5,22.6L25.6,18.1L29.7,18.1L30.6,20.8L37.3,21.7L41.3,20.3L39.3,19.7L39.7,17.9L47.1,15.2L49.5,12.8L50.0,7.0L55.9,5.0L57.5,8.2L59.9,7.9L61.1,10.2L63.3,10.7L64.0,12.3L67.3,12.9L67.3,15.5L69.9,15.5L71.8,13.7L72.1,17.1L76.5,19.7L81.6,19.9L83.6,20.8L85.0,22.9L90.0,23.0L94.7,24.7L91.1,32.2L90.5,36.7L91.1,37.5ZM103.9,80.2L104.5,88.1L102.0,95.0L99.4,93.1L99.9,92.1L98.1,89.9L98.6,88.4L97.7,86.0L99.4,83.7L102.9,82.7L103.2,79.9L103.9,80.2Z',cities:{'Paris':[55.0,26.0],'Lyon':[72.0,55.0],'Marseille':[76.0,77.0],'Bordeaux':[34.0,63.0],'Nice':[89.0,73.0],'Toulouse':[48.0,74.0],'Strasbourg':[92.0,28.0],'Nantes':[28.0,41.0]}},
  'inde':{vb:'0 0 100 130',path:'M5.0,53.9L6.7,53.4L6.9,52.0L10.1,52.6L12.2,51.6L12.9,52.3L13.9,51.7L13.9,50.5L12.7,47.5L12.7,46.5L11.5,46.3L11.0,45.5L11.1,43.1L9.1,42.1L9.2,40.6L11.9,36.9L13.1,38.2L16.4,37.2L17.9,33.9L19.6,32.8L21.1,29.1L22.4,28.5L22.8,28.0L22.7,27.1L25.0,24.7L24.6,24.0L24.7,21.5L27.1,19.9L26.8,19.2L25.1,18.7L25.0,17.6L24.1,17.6L23.9,16.7L23.0,15.9L23.5,14.6L22.9,13.7L23.8,12.8L22.7,12.3L22.9,11.6L22.4,11.0L22.9,9.9L23.9,9.5L28.3,10.5L31.0,9.6L34.7,6.5L35.5,6.6L35.4,7.5L36.4,10.1L38.3,11.4L37.6,12.5L37.8,14.6L38.8,16.0L39.1,18.7L38.2,19.3L37.5,18.3L36.5,18.6L37.6,20.9L37.6,23.5L38.8,23.2L40.0,24.8L42.0,25.7L42.1,26.6L44.6,28.2L42.8,30.0L41.7,33.6L42.8,34.5L43.3,34.4L47.2,37.5L49.8,38.3L49.9,39.0L51.7,39.6L54.1,39.1L55.7,39.9L56.0,40.9L57.7,42.1L58.7,41.7L59.4,42.7L60.0,42.5L62.2,43.4L63.2,42.9L64.0,43.7L66.2,43.6L66.7,42.2L66.1,40.5L66.6,37.2L68.0,36.6L68.7,37.0L68.5,39.0L68.9,39.8L68.5,40.4L68.8,41.2L69.7,41.8L71.6,42.3L73.4,41.5L74.7,42.0L78.5,41.7L78.8,39.9L78.5,39.2L77.3,38.8L77.4,38.0L80.2,37.5L82.4,34.4L84.0,34.0L86.6,31.7L89.0,32.8L91.0,31.1L92.0,31.9L91.3,32.6L91.3,33.3L92.2,32.7L92.7,33.9L91.7,35.3L92.7,35.1L95.0,36.1L95.0,37.3L93.6,38.7L94.3,40.6L93.1,39.7L91.5,40.0L88.2,42.7L88.2,45.0L86.5,47.9L86.9,49.0L85.1,53.8L82.6,53.0L82.8,56.8L82.1,57.2L81.9,58.5L82.1,60.5L81.3,61.5L80.8,60.9L80.3,61.5L79.3,54.6L78.3,54.6L77.8,57.1L77.4,57.4L76.8,56.5L76.4,56.9L76.0,55.0L76.6,52.9L78.2,52.5L78.9,51.6L79.2,49.7L79.9,49.8L80.0,49.4L78.7,48.5L73.7,48.6L71.9,48.0L71.8,45.4L71.4,44.3L71.0,45.1L70.4,45.1L69.3,43.5L69.0,43.6L69.2,44.1L68.8,44.1L67.3,42.9L67.6,43.6L66.5,45.6L69.1,48.2L67.6,48.5L66.3,50.7L68.4,52.2L67.9,54.6L68.4,56.3L69.1,56.6L68.8,57.2L69.4,60.3L69.1,61.7L69.4,62.8L68.8,62.5L68.5,63.1L68.2,60.9L68.0,62.8L67.6,63.0L67.1,62.4L67.0,63.0L66.6,62.9L66.8,60.9L66.0,59.9L66.7,60.9L66.0,62.1L63.4,63.5L62.7,64.5L63.0,66.7L62.3,68.3L61.2,69.5L60.8,69.4L60.7,70.0L58.7,70.8L58.5,70.0L57.7,70.6L57.5,71.2L58.3,71.1L56.2,73.1L54.2,76.5L48.8,81.4L48.5,83.6L47.0,84.5L45.5,84.5L44.5,86.8L43.5,86.3L42.4,87.0L41.7,89.6L42.5,96.1L42.0,95.2L41.7,95.6L42.6,96.6L42.2,99.3L41.1,102.2L40.6,104.9L40.9,104.8L41.0,105.4L41.0,109.0L39.4,109.2L38.2,112.0L38.5,113.0L39.7,113.6L38.4,113.2L36.6,113.9L35.9,114.8L35.5,116.8L33.9,118.1L32.5,117.1L30.9,114.7L30.2,112.5L29.9,110.6L30.6,112.2L30.2,110.6L28.3,104.7L25.9,99.8L24.2,92.0L22.8,89.6L22.4,88.3L22.8,88.3L22.3,87.6L22.5,87.2L22.0,87.0L21.0,84.0L19.5,75.1L19.9,73.6L19.8,73.0L19.4,73.7L19.3,73.3L19.3,72.4L19.9,72.5L19.3,72.2L18.9,70.3L19.6,66.8L19.3,65.0L18.8,64.0L19.1,63.6L18.7,63.6L20.3,62.4L18.5,62.7L19.0,61.5L18.4,61.5L18.5,60.8L19.3,60.5L17.4,60.3L17.7,61.1L16.9,62.1L17.5,62.5L17.6,63.3L16.9,64.9L13.8,66.6L12.2,66.1L7.5,60.2L7.7,59.6L8.4,60.3L11.2,59.1L12.2,57.0L11.7,57.6L9.6,58.3L8.3,58.0L6.5,56.6L5.8,55.0L6.9,53.9L5.2,54.9L5.0,53.9Z',cities:{'New Delhi':[33.0,35.0],'Mumbai':[20.0,73.0],'Jaipur':[29.0,41.0],'Agra':[35.0,40.0],'Varanasi':[51.0,48.0],'Goa':[22.0,88.0],'Kerala':[31.0,110.0],'Chennai':[42.0,98.0]}},
  'tanzanie':{vb:'0 0 100 110',path:'M41.9,85.6L26.2,79.9L21.4,75.8L18.3,75.3L12.2,61.3L8.1,57.4L6.8,54.6L6.3,51.9L7.3,49.1L5.0,41.5L5.6,37.4L8.2,37.4L10.0,36.1L17.0,25.8L16.8,23.8L13.9,22.3L14.8,18.7L17.2,17.9L17.5,16.1L17.0,10.7L14.6,7.4L14.7,6.1L42.6,5.5L72.2,24.4L71.9,28.6L85.0,39.6L81.6,52.4L82.2,54.8L87.6,61.2L85.5,65.7L85.5,68.2L86.6,68.5L86.7,70.3L85.6,74.3L88.4,81.2L89.0,88.7L95.0,93.0L85.8,99.1L79.1,101.8L74.5,100.7L72.9,103.3L70.0,104.5L66.8,103.2L61.4,104.5L58.2,102.1L55.4,103.5L50.5,103.3L47.7,98.7L47.4,90.9L45.4,86.2L42.7,84.0L41.9,85.6Z',cities:{'Dar es Salaam':[85.0,59.0],'Zanzibar':[85.0,53.0],'Serengeti':[49.0,18.0],'Kilimandjaro':[70.0,25.0],'Ngorongoro':[55.0,26.0],'Arusha':[64.0,27.0]}},
  'mexique':{vb:'0 0 130 100',path:'M11.2,5.9L20.1,5.0L19.7,6.0L33.7,11.9L44.1,11.9L44.1,9.6L50.6,9.7L56.3,15.6L58.2,20.6L62.4,23.4L63.7,22.3L64.8,19.7L66.0,19.1L69.1,19.6L71.6,22.5L73.3,26.7L76.2,30.6L76.4,33.0L77.7,36.0L84.1,38.9L84.9,38.5L83.0,46.2L82.4,55.5L82.7,57.6L84.3,60.2L84.0,61.7L84.1,60.2L82.7,57.9L84.8,64.4L87.5,68.6L88.1,71.2L90.0,73.9L89.5,73.8L90.5,74.5L90.2,74.1L92.2,74.4L94.8,77.1L98.2,75.8L100.7,75.6L102.3,74.5L104.0,74.3L104.2,75.3L105.6,75.6L106.6,74.8L106.4,73.4L106.0,73.5L108.6,71.2L108.7,69.3L109.5,68.2L110.0,63.0L112.0,61.7L117.0,60.2L118.7,60.0L121.5,60.8L121.7,60.3L121.0,60.3L121.9,60.0L123.0,60.9L123.2,62.3L122.7,64.1L120.8,66.8L120.7,68.7L119.8,69.8L120.8,70.0L119.9,71.2L120.0,71.7L120.5,71.5L119.4,76.1L119.1,76.5L118.5,75.5L118.4,73.8L117.6,75.5L116.8,75.7L115.7,78.1L114.5,78.0L114.4,78.8L107.7,78.8L107.6,81.6L106.1,81.6L109.8,85.9L109.7,87.4L104.9,87.4L103.2,91.4L103.7,92.4L103.1,95.0L99.6,90.5L96.9,87.5L95.2,86.4L96.5,87.7L94.1,86.8L94.3,86.1L93.6,86.4L93.2,85.7L92.8,86.4L93.6,86.8L87.3,89.5L84.8,88.2L82.7,88.0L79.9,86.3L79.0,85.1L75.5,84.2L71.3,81.8L67.3,78.1L64.4,77.6L61.7,76.3L60.0,73.8L56.2,71.4L54.2,68.1L53.5,66.1L55.0,65.1L54.7,64.3L54.1,64.0L55.1,62.4L55.2,60.6L54.4,60.0L53.6,58.1L53.0,55.0L48.8,48.8L45.7,45.8L46.6,46.4L46.7,45.7L45.1,45.1L43.8,42.8L44.7,42.9L42.3,41.3L42.0,40.6L41.1,40.8L41.6,39.6L40.5,40.3L39.8,39.6L39.6,38.1L40.5,36.8L40.8,37.0L40.2,35.6L39.4,34.7L38.4,34.8L37.7,32.9L35.7,31.7L35.2,30.1L35.5,29.0L33.4,28.5L29.5,23.3L29.3,22.1L28.7,21.7L26.2,15.2L26.3,12.6L24.1,11.8L23.6,10.7L22.9,10.4L22.2,11.0L19.3,9.0L19.8,10.3L19.5,12.7L20.7,18.3L23.6,21.6L24.6,23.8L25.7,24.4L26.1,25.8L26.9,26.3L27.4,29.2L28.9,30.7L30.6,34.9L31.2,35.4L30.9,33.9L31.7,34.8L32.7,39.3L35.0,43.9L35.1,46.5L36.1,47.7L36.5,46.5L39.6,50.7L39.4,52.3L38.2,53.5L37.5,53.6L36.2,50.1L30.8,45.5L29.9,44.0L29.5,38.7L28.7,37.2L26.4,35.4L25.9,33.6L25.4,34.3L24.2,34.7L23.3,33.5L21.1,32.2L20.7,31.2L19.1,29.7L18.9,29.1L21.6,29.0L21.6,29.5L22.5,30.0L21.8,28.7L22.6,26.2L19.3,21.7L16.6,19.7L15.1,14.5L14.3,13.6L14.1,12.5L12.9,10.7L12.7,9.9L13.1,9.3L12.2,8.6L11.2,5.9Z',cities:{'Mexico City':[78.0,71.0],'Cancún':[123.0,62.0],'Oaxaca':[87.0,82.0],'Guadalajara':[62.0,65.0],'San Cristobal':[102.0,84.0],'Tulum':[121.0,67.0],'Puerto Vallarta':[55.0,65.0],'Guanajuato':[70.0,63.0]}},
  'bali':{vb:'0 0 120 60',path:'M83.6,16.0L94.0,28.4L56.3,56.0L50.2,38.8L20.4,26.6L10.6,13.4L42.3,14.7L56.9,7.1L83.6,16.0ZM6.0,30.3L19.2,45.8L18.4,51.1L6.0,47.5L6.0,30.3ZM85.8,53.2L78.9,47.7L84.4,44.8L87.9,47.5L85.8,53.2ZM114.0,57.0L105.2,49.4L114.0,50.7L114.0,57.0Z',cities:{'Kuta':[58.0,48.0],'Ubud':[64.0,35.0],'Seminyak':[57.0,46.0],'Uluwatu':[52.0,55.0],'Amed':[90.0,24.0],'Nusa Dua':[62.0,53.0],'Canggu':[56.0,44.0]}},
  '_default':{vb:'0 0 100 100',path:'M50,8 C64,10 76,20 80,34 C84,48 80,62 76,74 C72,86 64,94 52,98 C40,102 28,98 20,88 C12,78 10,64 12,52 C14,40 16,26 24,18 C32,10 38,6 50,8Z',cities:{}}
};
function _geoGet(dest){
  if(typeof _geoShapeSD==='function'){var r=_geoShapeSD(dest);return r?r.g:_GEO._default;}
  return _GEO._default;
}
function _geoPts(plan,g){
  var vb=(g.vb||'0 0 100 100').split(' ').map(Number),vbW=vb[2],vbH=vb[3],cities=g.cities||{};
  function match(loc){
    var locL=(loc||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    var parts=locL.split(/[\/\-,\(\) ]/);
    /* 1. Match exact / inclusion sur le nom complet */
    for(var ci in cities){
      var cl=ci.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(locL.includes(cl)||cl.includes(locL.split(/[\/\-,]/)[0].trim())) return cities[ci];
    }
    /* 2. Match par token (mot d'au moins 3 lettres) */
    for(var ci2 in cities){
      var cl2=ci2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      for(var pi=0;pi<parts.length;pi++){
        var t=parts[pi].trim();
        if(t.length>=3&&(cl2===t||cl2.startsWith(t)||t.startsWith(cl2))) return cities[ci2];
      }
    }
    return null;
  }
  var matched=plan.map(function(p){return match(p.loc||'');});
  /* Interpolation : les étapes non trouvées prennent une position
     entre les deux étapes connues les plus proches (avant + après) */
  function interp(i){
    var before=null,after=null,bd=0,ad=0;
    for(var j=i-1;j>=0;j--){ if(matched[j]){before=matched[j];bd=i-j;break;} }
    for(var k=i+1;k<matched.length;k++){ if(matched[k]){after=matched[k];ad=k-i;break;} }
    if(before&&after){
      var tt=bd/(bd+ad);
      return [before[0]+(after[0]-before[0])*tt, before[1]+(after[1]-before[1])*tt];
    }
    if(before) return [before[0],before[1]];
    if(after) return [after[0],after[1]];
    return [vbW*0.5,vbH*0.5];
  }
  return plan.map(function(p,i){
    var m=matched[i]||interp(i);
    return{vx:m[0],vy:m[1],n:i+1,loc:p.loc,title:p.title,wx:p.wx,_matched:!!matched[i]};
  });
}

function travelerLabel(){ return state.travelers + ' voyageur' + (state.travelers > 1 ? 's' : ''); }
function screenEl(){ return document.querySelector('.screen'); }
function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function eur(n){ return Math.round(n).toLocaleString('fr-FR') + ' €'; }
function hexA(hex, alpha){
  hex = (hex || '#9c7c44');
  if (hex.indexOf('#') !== 0) return 'rgba(156,124,68,'+alpha+')';
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(function(c){ return c+c; }).join('');
  const r = parseInt(hex.substr(0,2),16), g = parseInt(hex.substr(2,2),16), b = parseInt(hex.substr(4,2),16);
  return 'rgba('+r+','+g+','+b+','+alpha+')';
}

/* ── overlays ── */
const ovStack = [];
function openOverlay(name, html, opts){
  opts = opts || {};
  const el = document.createElement('div');
  el.className = 'ov' + (opts.modal ? ' modal' : '') + (opts.carto ? ' carto' : '');
  el.dataset.ov = name;
  el.innerHTML = html;
  screenEl().appendChild(el);
  ovStack.push(el);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('in'); }); });
  _enableSheetDragToDismiss(el);
  return el;
}
function closeOverlay(){
  const el = ovStack.pop();
  if (!el) return;
  el.classList.remove('in');
  setTimeout(function(){ el.remove(); }, 440);
}
/* Glisser vers le bas pour fermer, sur toute feuille affichant une poignée
   (.carte-handle-wrap)  -  ce petit trait gris suggère visuellement le geste
   natif iOS, mais jusqu'ici ne faisait rien du tout au toucher. Ne s'attache
   qu'à la poignée elle-même (jamais au contenu scrollable de la feuille). */
function _enableSheetDragToDismiss(el){
  const handle = el.querySelector('.carte-handle-wrap');
  if(!handle) return;
  const DISMISS_PX = 90;
  let startY = 0, dy = 0, dragging = false;
  handle.style.touchAction = 'none';
  handle.addEventListener('touchstart', function(e){
    if(!e.touches || e.touches.length !== 1) return;
    startY = e.touches[0].clientY; dy = 0; dragging = true;
    el.style.transition = 'none';
  }, {passive:true});
  handle.addEventListener('touchmove', function(e){
    if(!dragging || !e.touches || !e.touches.length) return;
    dy = Math.max(0, e.touches[0].clientY - startY);
    el.style.transform = 'translateY(' + dy + 'px)';
  }, {passive:true});
  function endDrag(){
    if(!dragging) return;
    dragging = false;
    if(dy > DISMISS_PX){
      /* Poursuivre le geste jusqu'à la fermeture complète depuis la position
         actuelle du doigt, plutôt que de sauter d'abord à "ouvert" puis de
         rejouer l'animation de fermeture habituelle depuis le début. */
      el.style.transition = 'transform 0.28s var(--ease-in-out)';
      el.style.transform = 'translateY(100%)';
      el.classList.remove('in');
      const idx = ovStack.indexOf(el);
      if(idx >= 0) ovStack.splice(idx, 1);
      setTimeout(function(){ el.remove(); }, 300);
    } else {
      el.style.transition = '';
      el.style.transform = '';
    }
  }
  handle.addEventListener('touchend', endDrag);
  handle.addEventListener('touchcancel', endDrag);
}
function closeAllOverlays(){
  while (ovStack.length){
    const el = ovStack.pop();
    el.classList.remove('in');
    (function(e){ setTimeout(function(){ e.remove(); }, 440); })(el);
  }
}

/* ── toast ── */
let _toastTimer = null;
function toast(msg){
  /* Afficher dans l'overlay actif ou le body — pas dans .screen qui reste sous les overlays */
  const container = (ovStack && ovStack.length) ? ovStack[ovStack.length-1] : (screenEl() || document.body);
  let t = container.querySelector('.toast');
  if(!t){ t = document.createElement('div'); t.className = 'toast'; container.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(function(){ t.classList.add('show'); });
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2400);
}

/* ── navbar ── */
function navbar(title, opts){
  opts = opts || {};
  /* Sur fond sombre (photo hero), .ghost retire tout fond au bouton — invisible
     sur une image chargée. Par défaut le bouton retour est "ghost" sur fond
     clair, mais PAS sur fond sombre (sauf demande explicite via opts.ghost). */
  const ghost = opts.solidBack ? false : (opts.ghost !== undefined ? opts.ghost : !opts.dark);
  const back = opts.noBack ? '<span class="nav-spacer"></span>'
    : '<button class="nav-btn' + (ghost ? ' ghost' : '') + '" onclick="closeOverlay()" aria-label="Retour">' + ico('back', 20, 1.7) + '</button>';
  const right = opts.right || '<span class="nav-spacer"></span>';
  return '<div class="navbar' + (opts.dark ? ' on-dark' : '') + '">' + back
    + (title ? '<span class="nav-title">' + esc(title) + '</span>' : '')
    + right + '</div>';
}

/* ── tabs ── */
const TAB_DEFS = [
  ['discover','compass','Explorer'],
  ['create','sparkle','Créer'],
  ['voyages','route','Voyages'],
  ['profile','person','Profil'],
];
function tabbarHTML(){
  return '<div class="tabbar">'
    + '<div class="tabbar-pill">'
    + TAB_DEFS.map(function(t){
      return '<button class="tab-it" data-tabbtn="' + t[0] + '" onclick="setTab(\'' + t[0] + '\')">'
        + '<div class="tab-inner">'
        + '<span class="tab-ico">' + ico(t[1], 23, 1.7) + '</span>'
        + '<span class="tab-lbl">' + t[2] + '</span>'
        + '</div>'
        + '</button>';
    }).join('')
    + '</div></div>';
}
function setTab(name){
  state.tab = name;
  const views = screenEl().querySelectorAll('.tabview');
  for (let i = 0; i < views.length; i++){
    const v = views[i];
    const on = v.dataset.tab === name;
    v.classList.toggle('active', on);
    if (on){
      if (name === 'discover') {
        v.innerHTML = discoverView();
        const tiles = v.querySelectorAll('.dest-grid > *');
        requestAnimationFrame(function(){
          tiles.forEach(function(t, i){ t.style.animationDelay = (i * 55) + 'ms'; t.classList.add('tile-in'); });
        });
        loadDiscoverTrips();
      }
      if (name === 'create')   v.innerHTML = createView();
      if (name === 'voyages')  { v.innerHTML = voyagesView(); loadVoyagesTab(); }
      if (name === 'profile')  { v.innerHTML = profileView(); if(typeof loadProfileTab === 'function') loadProfileTab(); }
      v.scrollTop = 0;
    }
  }
  const btns = screenEl().querySelectorAll('[data-tabbtn]');
  for (let i = 0; i < btns.length; i++) btns[i].classList.toggle('on', btns[i].dataset.tabbtn === name);
  if (name === 'create' && typeof initDeck === 'function') initDeck();
  if (typeof museControl === 'function') museControl(name === 'discover');
}

/* ── openers ── */
function openItinerary(){
  const el = openOverlay('itinerary', itineraryView());
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ revealOnScroll(el); }); });
  if(typeof renderHicSuntMap === 'function') renderHicSuntMap('hs-map-mini', { dest: ITINERARY.dest, plan: ITINERARY.plan });
}
/* Ferme le chat et rafraîchit la vue itinéraire sous-jacente (ou l'ouvre) */
function _returnToUpdatedItinerary(){
  closeOverlay(); /* ferme le chat */
  setTimeout(function(){
    /* Chercher un overlay itinéraire déjà ouvert dans la pile */
    var existing = null;
    for(var i=0;i<ovStack.length;i++){
      if(ovStack[i].dataset && ovStack[i].dataset.ov==='itinerary'){ existing = ovStack[i]; break; }
    }
    if(existing){
      /* Rafraîchir son contenu en place */
      existing.innerHTML = itineraryView();
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ revealOnScroll(existing); }); });
      if(typeof renderHicSuntMap === 'function') renderHicSuntMap('hs-map-mini', { dest: ITINERARY.dest, plan: ITINERARY.plan });
    } else {
      openItinerary();
    }
  }, 220);
}
function revealOnScroll(container){
  const rows = container.querySelectorAll('.dayrow');
  if(!rows.length) return;
  rows.forEach(function(r){ r.classList.add('reveal'); });
  const scroller = container.querySelector('.ov-scroll') || container;
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { root: scroller, threshold: 0.12 });
  rows.forEach(function(r){ io.observe(r); });
}
function openDest(key){ openOverlay('destination', destinationView(key)); }
function openDay(i){ openOverlay('day', dayDetailView(i)); }
function openBooking(id){ openOverlay('booking', bookingView(id)); }
function openMapOv(){
  const el = openOverlay('map', mapView());
  if(typeof renderHicSuntMap === 'function') renderHicSuntMap('hs-map-full', { dest: ITINERARY.dest, plan: ITINERARY.plan, activeIdx: state.mapDay||0, interactive:true, padding:72 });
  requestAnimationFrame(function(){
    var chip = el.querySelector('.map-chip.on');
    if(chip) chip.scrollIntoView({ behavior:'auto', block:'nearest', inline:'center' });
  });
}
function composeFromDest(key){
  state.destination = key;
  state.createTab = 'known';
  state.deckIndex = 1;
  closeAllOverlays();
  setTab('create');
}
function composeFree(){
  const inp = screenEl().querySelector('[data-muse]');
  const v = inp ? inp.value.trim() : '';
  state.destination = v;
  state.createTab = 'known';
  state.deckIndex = v ? 2 : 0;
  setTab('create');
}
function logout(){
  localStorage.removeItem('sb_token');
  localStorage.removeItem('hs_profile_done');
  USER.name = 'Voyageur'; USER.full = ''; USER.initials = '??';
  closeAllOverlays();
  setTimeout(function(){ openOverlay('onboarding', onboardingView(), { modal:true }); }, 80);
}

/* ── Supabase ── */
const SUPABASE_URL  = 'https://lucbxwxcismnvcdnctau.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Y2J4d3hjaXNtbnZjZG5jdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTc3NzAsImV4cCI6MjA5NDU5Mzc3MH0.G17LlW8K-5UDg_QbkJprkZX-oqlTL_RWUTrwIh408yQ';

function _getUserId(){
  const token = localStorage.getItem('sb_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch(e) { return null; }
}

function loginGoogle(){
  const redirectTo = 'https://hic-suntapp.vercel.app/';
  window.location.href = SUPABASE_URL + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(redirectTo);
}
async function loginEmail(){
  const scope = (typeof ovStack!=='undefined' && ovStack.length) ? ovStack[ovStack.length-1] : document;
  const emailEl = scope.querySelector('#authEmail') || document.getElementById('authEmail');
  const passEl = scope.querySelector('#authPassword') || document.getElementById('authPassword');
  const email = (emailEl ? emailEl.value : '').trim();
  const password = passEl ? passEl.value : '';
  if (!email || !password){ toast('Email et mot de passe requis'); return; }
  try{
    const res = await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=password',{method:'POST',headers:{'content-type':'application/json','apikey':SUPABASE_ANON},body:JSON.stringify({email,password})});
    const data = await res.json();
    /* Supabase renvoie l'erreur sous plusieurs formes selon le cas */
    if(data.error_description) throw new Error(data.error_description);
    if(data.error) throw new Error((data.error.message)||data.error||'Erreur');
    if(data.msg) throw new Error(data.msg);
    if(!data.access_token) throw new Error('Identifiants incorrects');

    localStorage.setItem('sb_token', data.access_token);
    if(email) localStorage.setItem('hs_email', email.toLowerCase());
    _applyUser(data.user);
    closeAllOverlays(); setTab('discover');
    if(typeof refreshAuthTabs === 'function') refreshAuthTabs();
    toast('Connecté ✓');
    checkProfile().then(function(done){
      if(typeof refreshAuthTabs === 'function') refreshAuthTabs();
      if(!done) openOverlay('welcome', welcomeView(), { modal:true });
    });
  }catch(e){ toast(e.message||'Erreur de connexion'); }
}
async function signupEmail(){
  const scope = (typeof ovStack!=='undefined' && ovStack.length) ? ovStack[ovStack.length-1] : document;
  const emailEl = scope.querySelector('#authEmail') || document.getElementById('authEmail');
  const passEl = scope.querySelector('#authPassword') || document.getElementById('authPassword');
  const email = (emailEl ? emailEl.value : '').trim();
  const password = passEl ? passEl.value : '';
  if (!email || !password){ toast('Email et mot de passe requis'); return; }
  try{
    const res = await fetch(SUPABASE_URL+'/auth/v1/signup',{method:'POST',headers:{'content-type':'application/json','apikey':SUPABASE_ANON},body:JSON.stringify({email,password})});
    const data = await res.json();
    if(data.error) throw new Error(data.error.message||data.error);
    if(data.access_token){
      localStorage.setItem('sb_token', data.access_token);
      if(email) localStorage.setItem('hs_email', email.toLowerCase());
      _applyUser(data.user);
      closeAllOverlays(); setTab('discover');
      if(typeof refreshAuthTabs==='function') refreshAuthTabs();
      openOverlay('welcome', welcomeView(), { modal:true });
    } else {
      /* Confirmation email activée côté Supabase : pas de token immédiat.
         On stocke quand même l'email pour l'exemption de paiement propriétaire. */
      if(email) localStorage.setItem('hs_email', email.toLowerCase());
      toast('Compte créé — vérifiez vos emails pour confirmer la connexion');
      closeAllOverlays(); setTab('discover');
      if(typeof refreshAuthTabs==='function') refreshAuthTabs();
    }
  }catch(e){ toast(e.message||'Erreur lors de la création du compte'); }
}
function _applyUser(user){
  if (!user) return;
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || (user.email ? user.email.split('@')[0] : 'Voyageur');
  const parts = name.split(' ');
  USER.name = parts[0];
  USER.full = name;
  USER.initials = parts.map(function(p){ return p[0] || ''; }).join('').toUpperCase().slice(0,2) || '??';
  USER.since = 'Membre depuis ' + new Date().getFullYear();
}

/* Re-rend les onglets dépendants de l'état connecté (profil, voyages) */
function refreshAuthTabs(){
  const views = screenEl() ? screenEl().querySelectorAll('.tabview') : [];
  for(let i=0;i<views.length;i++){
    const v = views[i];
    const tab = v.dataset.tab;
    if(tab==='profile'){ v.innerHTML = profileView(); }
    if(tab==='voyages'){ v.innerHTML = voyagesView(); if(typeof loadVoyagesTab==='function') loadVoyagesTab(); }
  }
}

/* ── profil voyageur (nom, naissance, adresse) ──────────────────────── */
async function saveWelcomeProfile(){
  const first = document.getElementById('wFirst').value.trim();
  const last = document.getElementById('wLast').value.trim();
  const birth = document.getElementById('wBirth').value;
  const address = document.getElementById('wAddress').value.trim();
  if(!first || !last){ toast('Prénom et nom requis'); return; }

  /* Mise à jour locale immédiate (fonctionne avec ou sans compte) */
  USER.name = first;
  USER.full = first+' '+last;
  USER.initials = (first[0]+last[0]).toUpperCase();
  try{
    localStorage.setItem('hs_profile', JSON.stringify({first_name:first,last_name:last,birth_date:birth||null,address:address||null}));
    localStorage.setItem('hs_profile_done','1');
  }catch(e){}

  /* Sauvegarde cloud si connecté */
  const token = localStorage.getItem('sb_token');
  const userId = _getUserId();
  if(token && userId){
    try{
      await fetch(SUPABASE_URL+'/rest/v1/profiles',{
        method:'POST',
        headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Prefer':'resolution=merge-duplicates'},
        body:JSON.stringify({id:userId,first_name:first,last_name:last,birth_date:birth||null,address:address||null})
      });
    }catch(e){}
  }

  closeAllOverlays(); setTab('discover');
  if(typeof refreshAuthTabs==='function') refreshAuthTabs();
  toast('Bienvenue, '+first+' ✓');
}

async function checkProfile(){
  const token = localStorage.getItem('sb_token');
  const userId = _getUserId();
  if(!token || !userId) return true;

  /* Extraire et stocker l'email depuis le JWT pour la vérification d'exemption */
  try{
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload.email || payload.user_metadata?.email || '';
    if(email) localStorage.setItem('hs_email', email);
  }catch(e){}

  if(localStorage.getItem('hs_profile_done')) return true;
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/profiles?id=eq.'+userId+'&select=first_name,last_name',{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    if(res.status===401){
      /* 401 sur la table profiles = souvent RLS/permissions, PAS forcément
         une session invalide. On garde le token (la session reste valide pour
         le paiement et la génération) et on considère le profil comme complet
         pour ne pas bloquer l'utilisateur. */
      localStorage.setItem('hs_profile_done','1');
      return true;
    }
    const rows = await res.json();
    if(rows&&rows.length&&rows[0].first_name){
      localStorage.setItem('hs_profile_done','1');
      USER.name = rows[0].first_name;
      USER.full = rows[0].first_name+' '+rows[0].last_name;
      USER.initials = (rows[0].first_name[0]+rows[0].last_name[0]).toUpperCase();
      return true;
    }
    return false;
  }catch(e){ return true; }
}

/* ── Supabase itinéraires ── */
/* Demande à l'utilisateur : remplacer l'itinéraire existant ou garder les deux */
function _promptSaveModified(){
  /* Le voyage existe-t-il déjà dans les sauvegardes ? */
  var existing = false;
  try{
    var local = JSON.parse(localStorage.getItem('hs_saved_trips')||'[]');
    existing = local.some(function(t){ return t.dest===ITINERARY.dest && t.dates===ITINERARY.dates; });
  }catch(e){}

  if(!existing){
    /* Premier enregistrement : pas de choix nécessaire */
    saveItinerary();
    return;
  }

  /* Petite modale de choix */
  var ov = document.createElement('div');
  ov.className = 'ov modal in';
  ov.dataset.ov = 'savechoice';
  ov.style.cssText = 'background:rgba(20,16,12,0.4);display:flex;align-items:flex-end;justify-content:center;z-index:300';
  ov.innerHTML = '<div style="background:var(--surface-raised);border-radius:24px 24px 0 0;padding:28px 22px calc(28px + env(safe-area-inset-bottom,0px));width:100%;max-width:520px">'
    + '<div style="font-family:var(--serif);font-size:22px;font-weight:600;color:var(--ink);margin-bottom:6px">Enregistrer les changements</div>'
    + '<div style="font-family:var(--sans);font-size:14px;color:var(--sub);line-height:1.5;margin-bottom:22px">Cet itinéraire est déjà enregistré. Que souhaitez-vous faire ?</div>'
    + '<button onclick="_doSaveModified(\'replace\')" style="width:100%;background:var(--ink);color:var(--bg);border:none;border-radius:14px;padding:15px;font-family:var(--sans);font-size:15px;font-weight:500;cursor:pointer;margin-bottom:10px">Remplacer l\'ancienne version</button>'
    + '<button onclick="_doSaveModified(\'both\')" style="width:100%;background:transparent;color:var(--ink);border:1px solid var(--line);border-radius:14px;padding:15px;font-family:var(--sans);font-size:15px;font-weight:500;cursor:pointer;margin-bottom:10px">Garder les deux versions</button>'
    + '<button onclick="_closeSaveChoice()" style="width:100%;background:transparent;color:var(--sub);border:none;padding:12px;font-family:var(--sans);font-size:14px;cursor:pointer">Annuler</button>'
    + '</div>';
  screenEl().appendChild(ov);
  ovStack.push(ov);
}
function _closeSaveChoice(){
  var ov = ovStack[ovStack.length-1];
  if(ov && ov.dataset.ov==='savechoice'){ ovStack.pop(); ov.remove(); }
}
async function _doSaveModified(mode){
  _closeSaveChoice();
  if(mode==='replace'){
    await updateSavedItinerary();
    toast('Itinéraire mis à jour ✓');
  } else {
    /* Garder les deux : sauvegarder comme nouvelle version datée */
    try{
      var local = JSON.parse(localStorage.getItem('hs_saved_trips')||'[]');
      var label = ITINERARY.dest + ' (modifié)';
      local.unshift({dest:label,dates:ITINERARY.dates,days:_days(),budget:ITINERARY.budgetTotal,data:Object.assign({},ITINERARY,{dest:label}),savedAt:Date.now()});
      localStorage.setItem('hs_saved_trips', JSON.stringify(local.slice(0,50)));
    }catch(e){}
    toast('Nouvelle version enregistrée ✓');
  }
  if(typeof refreshAuthTabs==='function') refreshAuthTabs();
}

/* Persiste l'historique de chat dans la sauvegarde existante (sans doublon, silencieux).
   N'enregistre que si l'itinéraire a déjà été sauvegardé une fois. */
async function saveChatHistory(){
  if(!ITINERARY || !ITINERARY.chatHistory) return;
  /* Local : mettre à jour l'entrée si elle existe */
  try{
    var local = JSON.parse(localStorage.getItem('hs_saved_trips')||'[]');
    var i = local.findIndex(function(t){ return t.dest===ITINERARY.dest && t.dates===ITINERARY.dates; });
    if(i>=0){
      if(!local[i].data) local[i].data = {};
      local[i].data.chatHistory = ITINERARY.chatHistory;
      localStorage.setItem('hs_saved_trips', JSON.stringify(local.slice(0,50)));
    }
  }catch(e){ console.warn('saveChatHistory local:', e); }
  /* Cloud : upsert si connecté ET déjà sauvegardé */
  var token = localStorage.getItem('sb_token');
  var userId = _getUserId();
  if(token && userId){
    try{
      await fetch(SUPABASE_URL+'/rest/v1/itineraries?on_conflict=user_id,destination,dates',{
        method:'POST',
        headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Prefer':'resolution=merge-duplicates,return=minimal'},
        body:JSON.stringify({user_id:userId,destination:ITINERARY.dest,dates:ITINERARY.dates,days:_days(),budget:ITINERARY.budgetTotal,data:ITINERARY})
      });
    }catch(e){}
  }
}

/* Met à jour la sauvegarde existante d'un itinéraire (après modif cartographe)
   sans créer de doublon. Met à jour la copie locale et la copie cloud si connecté. */
async function updateSavedItinerary(){
  /* Local : retrouver l'entrée par destination + dates et la remplacer */
  try{
    var local = JSON.parse(localStorage.getItem('hs_saved_trips')||'[]');
    var i = local.findIndex(function(t){ return t.dest===ITINERARY.dest && t.dates===ITINERARY.dates; });
    var entry = {dest:ITINERARY.dest,dates:ITINERARY.dates,days:_days(),budget:ITINERARY.budgetTotal,data:ITINERARY,savedAt:Date.now()};
    if(i>=0){ local[i]=entry; } else { local.unshift(entry); }
    localStorage.setItem('hs_saved_trips', JSON.stringify(local.slice(0,50)));
  }catch(e){}
  /* Cloud : upsert si connecté */
  var token = localStorage.getItem('sb_token');
  var userId = _getUserId();
  if(token && userId){
    try{
      await fetch(SUPABASE_URL+'/rest/v1/itineraries?on_conflict=user_id,destination,dates',{
        method:'POST',
        headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Prefer':'resolution=merge-duplicates,return=minimal'},
        body:JSON.stringify({user_id:userId,destination:ITINERARY.dest,dates:ITINERARY.dates,days:_days(),budget:ITINERARY.budgetTotal,data:ITINERARY})
      });
    }catch(e){}
  }
}

async function saveItinerary(){
  /* Vérifier que l'itinéraire est complet (moments chargés) */
  var hasDetails = ITINERARY.plan && ITINERARY.plan.length > 0
    && ITINERARY.plan.some(function(p){ return p && p.moments && p.moments.length > 0; });
  if(!hasDetails){
    toast('Itinéraire en cours de chargement, réessayez dans un instant');
    return;
  }
  const token = localStorage.getItem('sb_token');
  const userId = _getUserId();
  /* Sauvegarde locale systématique (fonctionne sans compte) */
  try{
    const local = JSON.parse(localStorage.getItem('hs_saved_trips')||'[]');
    const exists = local.some(function(t){ return t.dest===ITINERARY.dest && t.dates===ITINERARY.dates; });
    if(!exists){
      /* Copie profonde pour éviter les problèmes de référence */
      const snapshot = JSON.parse(JSON.stringify(ITINERARY));
      snapshot.occasion = snapshot.occasion || state.occasion || '';
      local.unshift({dest:ITINERARY.dest,dates:ITINERARY.dates,days:_days(),budget:ITINERARY.budgetTotal,occasion:state.occasion||'',data:snapshot,savedAt:Date.now()});
      localStorage.setItem('hs_saved_trips', JSON.stringify(local.slice(0,50)));
    } else {
      /* Mettre à jour si existe déjà */
      const snapshot = JSON.parse(JSON.stringify(ITINERARY));
      const idx = local.findIndex(function(t){ return t.dest===ITINERARY.dest && t.dates===ITINERARY.dates; });
      if(idx>=0){ local[idx].data = snapshot; local[idx].savedAt = Date.now(); }
      localStorage.setItem('hs_saved_trips', JSON.stringify(local.slice(0,50)));
    }
  }catch(e){ console.warn('saveItinerary local error:', e); }
  /* Sauvegarde cloud si connecté */
  if(token && userId){
    try{
      await fetch(SUPABASE_URL+'/rest/v1/itineraries',{
        method:'POST',
        headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'Prefer':'return=minimal'},
        body:JSON.stringify({user_id:userId,destination:ITINERARY.dest,dates:ITINERARY.dates,days:_days(),budget:ITINERARY.budgetTotal,data:ITINERARY})
      });
    }catch(e){}
  }
  toast('Voyage enregistré ✓');
}
async function loadItineraries(){
  /* Voyages locaux (sauvegardés sans compte) */
  var localTrips = [];
  try{
    var raw = JSON.parse(localStorage.getItem('hs_saved_trips')||'[]');
    localTrips = raw.map(function(t){
      return {
        id: 'local-'+(t.savedAt||Math.random()),
        destination: t.dest, dates: t.dates, days: t.days,
        budget: t.budget, data: t.data || t, created_at: new Date(t.savedAt||Date.now()).toISOString(),
        _local: true
      };
    });
  }catch(e){}

  /* Voyages cloud si connecté */
  const token = localStorage.getItem('sb_token');
  if(token){
    try{
      const res = await fetch(SUPABASE_URL+'/rest/v1/itineraries?select=*&order=created_at.desc',{
        headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
      });
      if(res.ok){
        const data = await res.json();
        if(Array.isArray(data)){
          /* Fusionner : cloud + local, en évitant les doublons (même dest+dates) */
          var merged = data.slice();
          localTrips.forEach(function(lt){
            var dup = merged.some(function(c){ return c.destination===lt.destination && c.dates===lt.dates; });
            if(!dup) merged.push(lt);
          });
          return merged;
        }
      }
    }catch(e){}
  }

  /* Pas de cloud : renvoyer les locaux (ou tableau vide, jamais null si on a du local) */
  return localTrips.length ? localTrips : (token ? [] : null);
}

/* ── Mon Cercle · compagnons de route (table Supabase "travel_companions") ──
   Liste personnelle (pas de mécanisme d'acceptation mutuelle — chacun compose
   son propre cercle) : nécessite la table ci-dessous, à créer une fois dans
   l'éditeur SQL Supabase du projet (voir NOTES_MON_CERCLE.sql à la racine du
   repo pour le script complet). Sans compte connecté, la fonctionnalité est
   simplement indisponible (pas de repli localStorage : un cercle est une
   donnée de compte, pas un brouillon local). */
async function loadCompanions(){
  const token = localStorage.getItem('sb_token');
  if(!token) return [];
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/travel_companions?select=*&order=created_at.asc',{
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    if(!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }catch(e){ return []; }
}
async function addCompanion(name){
  const token = localStorage.getItem('sb_token');
  const userId = _getUserId();
  if(!token || !userId) { toast('Connectez-vous pour composer votre Cercle'); return null; }
  name = (name||'').trim();
  if(!name) return null;
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/travel_companions',{
      method:'POST',
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token,'content-type':'application/json','Prefer':'return=representation'},
      body:JSON.stringify({user_id:userId, name:name})
    });
    if(!res.ok) { toast('Impossible d\'ajouter ce compagnon'); return null; }
    const rows = await res.json();
    return Array.isArray(rows) ? rows[0] : null;
  }catch(e){ toast('Impossible d\'ajouter ce compagnon'); return null; }
}
async function removeCompanion(id){
  const token = localStorage.getItem('sb_token');
  if(!token) return false;
  try{
    const res = await fetch(SUPABASE_URL+'/rest/v1/travel_companions?id=eq.'+encodeURIComponent(id),{
      method:'DELETE',
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    return res.ok;
  }catch(e){ return false; }
}
/* Invite un proche à rejoindre Hic Sunt — partage un lien, ne modifie pas
   le Cercle : ajouter quelqu'un à son Cercle se fait par son prénom (voir
   addCompanion), séparément de l'invitation à télécharger l'app. */
async function inviteCompanion(){
  const url = 'https://hic-suntapp.vercel.app/?ref=cercle';
  const text = 'Rejoins-moi sur Hic Sunt pour composer des itinéraires de voyage sur-mesure : ' + url;
  if(navigator.share){
    try{ await navigator.share({ title:'Hic Sunt', text:text, url:url }); return; }
    catch(e){ return; }
  }
  try{ await navigator.clipboard.writeText(text); toast('Lien copié — collez-le dans Messages'); }
  catch(e){ toast('Partage indisponible sur ce navigateur'); }
}

/* ── Filtrage des itinéraires par onglet ─────────────────────────────── */
function _classifyItinerary(it){
  const data = it.data || {};
  /* Les voyages locaux stockent les dates dans data.dateFrom/dateTo */
  const dateFrom = it.date_from || data.dateFrom || it.dateFrom || '';
  const dateTo   = it.date_to   || data.dateTo   || it.dateTo   || '';
  const today = new Date(); today.setHours(0,0,0,0);

  /* Brouillon = généré sans dates précises */
  if(!dateFrom && !dateTo){
    /* Si le titre des dates contient une vraie date on essaie de parser */
    const datesStr = it.dates || data.dates || '';
    const match = datesStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/i);
    if(!match) return 'draft';
  }

  if(dateFrom){
    const from = new Date(dateFrom); from.setHours(0,0,0,0);
    const to   = dateTo ? new Date(dateTo) : new Date(from.getTime() + (_days(it)||7)*86400000);
    to.setHours(23,59,59,999);
    if(to < today) return 'past';
    return 'upcoming';
  }

  /* Fallback sur la colonne created_at pour estimer si passé */
  if(it.created_at){
    const created = new Date(it.created_at);
    const daysAgo = (today - created) / 86400000;
    if(daysAgo > 90) return 'past';
  }
  return 'draft';
}

async function loadVoyagesTab(){
  const seg = state._voySeg || 'upcoming';
  const items = await loadItineraries();
  const host = document.querySelector('[data-trips]');
  if(!host) return;

  if(items===null){
    /* Non connecté ET aucun voyage local — inviter à se connecter */
    const token = localStorage.getItem('sb_token');
    const email = localStorage.getItem('hs_email');
    if(!token && !email){
      host.innerHTML = '<div style="text-align:center;padding:60px 24px">'
        + '<div style="color:var(--gold);margin-bottom:16px;display:flex;justify-content:center">' + ico('sparkle',32,1.2) + '</div>'
        + '<p style="font-family:var(--serif);font-size:20px;font-weight:600;color:var(--ink);margin-bottom:8px">Vos voyages vous attendent</p>'
        + '<p style="color:var(--sub);font-size:14px;line-height:1.6;margin-bottom:24px">Composez votre premier itinéraire — il apparaîtra ici dès que vous l\'aurez enregistré.</p>'
        + '<button onclick="setTab(\'create\')" style="background:var(--ink);color:var(--onink);border:none;border-radius:14px;padding:14px 28px;font-family:var(--sans);font-size:15px;font-weight:500;cursor:pointer">Composer un itinéraire</button>'
        + '</div>';
    } else {
      host.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--sub);font-size:14px;font-style:italic">Aucun voyage enregistré pour le moment.</p>';
    }
    return;
  }

  /* Filtrer par segment */
  const filtered = items.filter(function(it){ return _classifyItinerary(it) === seg; });

  const emptyMessages = {
    upcoming: 'Aucun voyage à venir.<br>Composez votre prochain itinéraire.',
    past:     'Aucun voyage passé enregistré.',
    draft:    'Aucun brouillon sauvegardé.',
  };

  if(!filtered.length){
    host.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--sub);font-size:14px;font-style:italic">'+(emptyMessages[seg]||'Aucun voyage.')+'</p>';
    return;
  }

  host.innerHTML = filtered.map(savedTripCard).join('');
  const cards = host.querySelectorAll('.trip');
  requestAnimationFrame(function(){
    cards.forEach(function(c, i){
      c.style.animationDelay = (i * 70) + 'ms';
      c.classList.add('trip-in');
    });
  });
}

async function loadSavedItinerary(id){
  var saved = null;

  /* Voyage local */
  if(id && id.indexOf('local-')===0){
    try{
      var local = JSON.parse(localStorage.getItem('hs_saved_trips')||'[]');
      var match = local.find(function(t){ return ('local-'+(t.savedAt||''))===id; });
      if(match) saved = {data: match.data||match, destination:match.dest, dates:match.dates};
    }catch(e){}
    if(!saved){ toast('Itinéraire introuvable'); return; }
  } else {
    /* Voyage cloud */
    const token = localStorage.getItem('sb_token');
    if(!token){ toast('Connexion requise'); return; }
    try{
      const res = await fetch(SUPABASE_URL+'/rest/v1/itineraries?id=eq.'+id,{
        headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
      });
      if(!res.ok) throw new Error('HTTP '+res.status);
      const rows = await res.json();
      if(!rows||!rows.length){ toast('Itinéraire introuvable'); return; }
      saved = rows[0];
    }catch(e){ toast('Erreur de chargement'); return; }
  }

  const data = saved.data || {};

    /* ── 2. Reset propre de l'ITINERARY avant de remplir ── */
    /* On vide d'abord pour éviter des résidus d'un itinéraire précédent */
    const keys = Object.keys(ITINERARY);
    keys.forEach(function(k){ delete ITINERARY[k]; });
    Object.assign(ITINERARY, data);

    /* ── 3. Champs critiques avec fallbacks ── */
    if(!ITINERARY.dest)         ITINERARY.dest         = saved.destination || 'Destination';
    if(!ITINERARY.dates)        ITINERARY.dates        = saved.dates || '';
    if(!_days())         ITINERARY.days = saved.days || (ITINERARY.plan||[]).length || 7;
    /* Synchroniser toujours days avec plan.length — source de vérité */
    if(ITINERARY.plan && ITINERARY.plan.length) ITINERARY.days = ITINERARY.plan.length;
    if(!ITINERARY.budgetTotal)  ITINERARY.budgetTotal  = saved.budget || 0;
    if(!ITINERARY.level)        ITINERARY.level        = saved.level || 'Confort';
    if(!ITINERARY.tag)          ITINERARY.tag          = '';
    if(!ITINERARY.coords)       ITINERARY.coords       = '';
    if(!ITINERARY.distance)     ITINERARY.distance     = '';
    if(!Array.isArray(ITINERARY.plan))          ITINERARY.plan          = [];
    if(!Array.isArray(ITINERARY.accommodations)) ITINERARY.accommodations = [];
    if(!Array.isArray(ITINERARY.gems))           ITINERARY.gems           = [];

    /* Normaliser chaque jour du plan */
    ITINERARY.plan = ITINERARY.plan.map(function(p, i){
      if(!p || typeof p !== 'object') return null;
      return {
        n:        p.n || (i+1),
        loc:      p.loc || '',
        title:    p.title || '',
        desc:     p.desc || '',
        category: p.category || 'culture',
        wx:       Array.isArray(p.wx) ? p.wx : ['sun','—'],
        tags:     Array.isArray(p.tags) ? p.tags : [],
        moments:  Array.isArray(p.moments) ? p.moments : [],
        tip:      p.tip || '',
        night:    p.night || null,
        restaurant: p.restaurant || null,
        wellness:   p.wellness || null,
      };
    }).filter(Boolean);
    if(typeof _repairPlanMoments==='function') _repairPlanMoments(ITINERARY.plan);
    if(typeof _repairPlanTitles==='function') _repairPlanTitles(ITINERARY.plan);

    /* Normaliser les hébergements */
    ITINERARY.accommodations = ITINERARY.accommodations.map(function(a){
      if(!a || typeof a !== 'object') return null;
      return {
        id:     a.id || ('acc-'+Math.random().toString(36).slice(2)),
        n:      a.n || a.name || 'Hébergement',
        type:   a.type || '',
        loc:    a.loc || a.location || '',
        price:  Number(a.price) || 0,
        nights: Number(a.nights) || 1,
        blurb:  a.blurb || '',
        i:      a.i || 'bed',
        url:    a.url || '',
      };
    }).filter(Boolean);

    /* ── 3bis. Recalculer les prix hébergements si tous identiques (bug ancien) ── */
    if(ITINERARY.accommodations && ITINERARY.accommodations.length > 1){
      const prices = ITINERARY.accommodations.map(function(a){ return a.price||0; });
      const allSame = prices.every(function(p){ return p === prices[0]; });
      if(allSame){
        const level = ITINERARY.level || 'Confort';
        const colFactor = (typeof _costOfLivingFactor==='function')
          ? _costOfLivingFactor(ITINERARY.dest||'', ITINERARY.region||'', ITINERARY.country||'')
          : 0.7;
        const baseRanges = {'Éco':[25,70],'Confort':[60,140],'Luxe':[150,400],'Ultra':[350,1100]};
        const base = baseRanges[level] || baseRanges['Confort'];
        const lo = Math.round(base[0]*colFactor), hi = Math.round(base[1]*colFactor);
        const mid = Math.round((lo+hi)/2);
        const vary = [1, 0.85, 1.15, 0.92, 1.08, 0.78, 1.22, 0.88];
        ITINERARY.accommodations = ITINERARY.accommodations.map(function(a, i){
          const tl = (a.type||'').toLowerCase();
          let price;
          if(/villa|résidence|privée/.test(tl))             price = Math.round(hi*0.85);
          else if(/luxe|resort|palace/.test(tl))            price = Math.round(hi*0.75);
          else if(/lodge|boutique|charme|écolodge/.test(tl))price = Math.round(mid*1.15);
          else if(/guesthouse|maison d|homestay/.test(tl))  price = Math.round(lo*1.3);
          else if(/hostel|auberge/.test(tl))                price = lo;
          else price = mid;
          price = Math.max(lo, Math.min(hi, Math.round(price*(vary[i%vary.length]||1))));
          return Object.assign({}, a, {price: price});
        });
      }
    }
    if(typeof _themeForDestination === 'function'){
      const themeName = _themeForDestination(
        ITINERARY.dest, ITINERARY.region||'', ITINERARY.country||''
      );
      ITINERARY.theme   = themeName;
      ITINERARY.palette = (typeof THEME_PALETTES!=='undefined' && THEME_PALETTES[themeName])
        || THEME_PALETTES && THEME_PALETTES.mediterranean
        || {};
    }

    /* ── 4bis. Vérifier que les nuits d'hébergement correspondent à la durée
       réelle du voyage — un voyage sauvegardé avant ce correctif peut avoir
       des hébergements dont la somme des nuits ne correspond pas au nombre
       de jours du plan, faussant le budget (hébergement + planchers repas/
       transferts) à chaque rechargement. ── */
    if(typeof _normalizeStayNights === 'function'){
      try{ _normalizeStayNights(ITINERARY.accommodations, (ITINERARY.plan||[]).length); }catch(e){}
    }

    /* ── 5. Rebuild ACTIVITIES depuis le plan (avant le budget : deriveBudget
       affiche le nombre d'activités suggérées dans sa répartition) ── */
    if(typeof deriveActivities === 'function'){
      try{ deriveActivities(ITINERARY.plan, ITINERARY.dest, ITINERARY.region, ITINERARY.country); }catch(e){ console.warn('deriveActivities',e); }
    } else if(typeof ACTIVITIES !== 'undefined'){
      ACTIVITIES.length = 0;
      (ITINERARY.plan||[]).forEach(function(p){
        (p.moments||[]).forEach(function(m,mi){
          ACTIVITIES.push({id:'a'+p.n+'_'+mi,day:p.n,n:m[2]||'',tag:m[3]||'',loc:p.loc||'',dur:'~2h',price:0,i:m[1]||'pin'});
        });
      });
    }

    /* ── 6. Rebuild BUDGET global depuis ITINERARY ──
       Recalculer via deriveBudget() (mêmes planchers repas/transferts réalistes
       qu'à la génération) plutôt qu'une reconstruction simplifiée qui se contente
       de recopier ITINERARY.budgetTotal tel quel : sinon un voyage sauvegardé
       avant ce correctif rechargeait indéfiniment un montant obsolète, différent
       de celui recalculé ailleurs (écran Itinéraire ≠ écran Budget). */
    if(typeof deriveBudget === 'function'){
      try{
        var _reloadedBudget = deriveBudget(
          ITINERARY.accommodations||[], ITINERARY.budgetTotal||0,
          ITINERARY.dest||'', ITINERARY.region||'', ITINERARY.country||'',
          state.travelers||2, ITINERARY._flightInfo||null
        );
        if(_reloadedBudget) ITINERARY.budgetTotal = _reloadedBudget;
      }catch(e){ console.warn('deriveBudget on load:', e); }
    } else if(typeof BUDGET !== 'undefined'){
      BUDGET.total = ITINERARY.budgetTotal || 0;
      BUDGET.spent = 0;
      BUDGET.lines = (ITINERARY.accommodations||[]).map(function(a){
        return {i:a.i||'bed', n:a.n||'Hébergement', sub:a.loc||'', amount:(a.price||0)*(a.nights||1), paid:false};
      });
      if(!BUDGET.lines.length) BUDGET.lines = [{i:'wallet',n:'Budget estimé',sub:'tout compris',amount:ITINERARY.budgetTotal||0,paid:false}];
    }

    /* ── 6. Ouverture de l'écran ── */
    try{
      openItinerary();
    }catch(e2){
      console.error('[itineraryView] crash:', e2.message, e2.stack);
      toast('Vue : ' + (e2.message||'?').slice(0,80));
    }
}
async function deleteSavedItinerary(id){
  if(!id || typeof id !== 'string' || !id.trim()){
    toast('Erreur : voyage non identifié');
    return;
  }

  /* Voyage local (id commence par "local-") */
  if(id.indexOf('local-')===0){
    try{
      var local = JSON.parse(localStorage.getItem('hs_saved_trips')||'[]');
      local = local.filter(function(t){ return ('local-'+(t.savedAt||'')) !== id; });
      localStorage.setItem('hs_saved_trips', JSON.stringify(local));
    }catch(e){}
    toast('Voyage supprimé');
    if(document.querySelector('[data-trips]')) loadVoyagesTab();
    if(document.querySelector('[data-disc-trips]')) loadDiscoverTrips();
    return;
  }

  /* Voyage cloud */
  const token = localStorage.getItem('sb_token');
  if(!token){ toast('Voyage supprimé'); return; }
  try{
    await fetch(SUPABASE_URL+'/rest/v1/itineraries?id=eq.'+encodeURIComponent(id),{
      method:'DELETE',
      headers:{'apikey':SUPABASE_ANON,'Authorization':'Bearer '+token}
    });
    toast('Voyage supprimé');
    if(document.querySelector('[data-trips]')) loadVoyagesTab();
    if(document.querySelector('[data-disc-trips]')) loadDiscoverTrips();
  }catch(e){ toast('Erreur de suppression'); }
}

/* ── callback Google OAuth ── */
function handleAuthCallback(){
  try{
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) return false;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    if (!token) return false;
    localStorage.setItem('sb_token', token);
    try{
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.user_metadata){
        _applyUser({ user_metadata: payload.user_metadata, email: payload.email || '' });
      }
    }catch(e){}
    window.history.replaceState({}, '', window.location.pathname);
    return true;
  }catch(e){ return false; }
}

/* ── splash de lancement ─────────────────────────────────────────────── */
function splashHTML(){
  return '<div class="splash" data-splash>'
    + '<svg class="splash-grid" viewBox="0 0 393 852" preserveAspectRatio="none" fill="none" stroke="rgba(156,124,68,0.08)" stroke-width="0.5">'
    +   [0,1,2,3,4,5,6].map(function(i){ return '<line class="sg-line" x1="'+(i*65.5)+'" y1="0" x2="'+(i*65.5)+'" y2="852"/>'; }).join('')
    +   [0,1,2,3,4,5,6,7,8,9,10,11,12].map(function(i){ return '<line class="sg-line" x1="0" y1="'+(i*71)+'" x2="393" y2="'+(i*71)+'"/>'; }).join('')
    + '</svg>'
    + '<div class="splash-core">'
    +   '<svg class="splash-globe" viewBox="0 0 120 120" fill="none">'
    +     '<circle class="sg-ring" cx="60" cy="60" r="54"/>'
    +     '<ellipse class="sg-mer" cx="60" cy="60" rx="22" ry="54"/>'
    +     '<ellipse class="sg-mer sg-mer2" cx="60" cy="60" rx="44" ry="54"/>'
    +     '<line class="sg-eq" x1="6" y1="60" x2="114" y2="60"/>'
    +     '<line class="sg-eq" x1="6" y1="38" x2="114" y2="38" style="stroke-width:0.3;stroke-dasharray:200;stroke-dashoffset:200"/>'
    +     '<line class="sg-eq" x1="6" y1="82" x2="114" y2="82" style="stroke-width:0.3;stroke-dasharray:200;stroke-dashoffset:200"/>'
    +     '<line class="sg-tick" x1="60" y1="2" x2="60" y2="12"/>'
    +     '<line class="sg-tick" x1="60" y1="108" x2="60" y2="118"/>'
    +     '<line class="sg-tick" x1="2" y1="60" x2="12" y2="60"/>'
    +     '<line class="sg-tick" x1="108" y1="60" x2="118" y2="60"/>'
    +   '</svg>'
    +   '<div class="splash-h"><span>H</span></div>'
    +   '<div class="splash-rule"></div>'
    +   '<div class="splash-tag">Beyond the Known</div>'
    + '</div>'
    + '<div class="splash-coords">48°51\'N · 2°21\'E — Cartographe personnel</div>'
    + '</div>';
}
function playSplash(next){
  const s = screenEl();
  const el = document.createElement('div');
  el.innerHTML = splashHTML();
  const splash = el.firstElementChild;
  s.appendChild(splash);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ if (splash.parentNode) splash.classList.add('run'); }); });
  setTimeout(function(){
    if (splash.parentNode) splash.classList.add('out');
    setTimeout(function(){
      if (splash.parentNode) splash.parentNode.removeChild(splash);
      next();
    }, 900);
  }, 3200);
}

/* ── boot ── */
function buildApp(){
  const s = screenEl();
  s.innerHTML = '<div class="tabs">'
    + '<div class="tabview" data-tab="discover"></div>'
    + '<div class="tabview" data-tab="create"></div>'
    + '<div class="tabview" data-tab="voyages"></div>'
    + '<div class="tabview" data-tab="profile"></div>'
    + '</div>' + tabbarHTML();

  const loggedIn = handleAuthCallback();
  const token = localStorage.getItem('sb_token');
  const hasEmail = !!localStorage.getItem('hs_email');
  const onboarded = localStorage.getItem('hs_onboarded') === '1';

  /* Charger le profil local (nom) s'il existe */
  try{
    const lp = JSON.parse(localStorage.getItem('hs_profile')||'null');
    if(lp && lp.first_name){
      USER.name = lp.first_name;
      USER.full = lp.first_name + ' ' + (lp.last_name||'');
      USER.initials = ((lp.first_name[0]||'') + (lp.last_name?lp.last_name[0]:'')).toUpperCase() || '✦';
    }
  }catch(e){}

  setTab('discover');

  if (loggedIn || token) {
    checkProfile().then(function(done){
      if (!done && !onboarded) openOverlay('welcome', welcomeView(), { modal:true });
    });
  } else if (!onboarded && !hasEmail) {
    /* Onboarding uniquement au tout premier lancement, jamais après */
    localStorage.setItem('hs_onboarded','1');
    openOverlay('onboarding', onboardingView(), { modal:true });
  }
}

/* ── Verrouillage du zoom natif de la page (Safari iOS ignore parfois
   user-scalable=no hors PWA installée) — un pincer sur la carte doit
   zoomer la carte Leaflet elle-même, jamais la page entière, sous
   peine de faire disparaître la barre du haut et la feuille du bas. */
document.addEventListener('gesturestart', function(e){ e.preventDefault(); });
document.addEventListener('gesturechange', function(e){ e.preventDefault(); });

document.addEventListener('DOMContentLoaded', function(){
  /* ── Déblocage propriétaire (tests) : ?hs=carto-perret-2026 ──
     Stocke l'email exempté. À usage personnel uniquement. */
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('hs') === 'carto-perret-2026'){
    localStorage.setItem('hs_email', 'charlottegperret@gmail.com');
    window.history.replaceState({}, '', window.location.pathname);
    if(typeof toast === 'function') setTimeout(function(){ toast('Accès propriétaire activé ✓'); }, 600);
  }

  /* ── Vérification retour paiement Stripe ── */
  if(urlParams.get('paid') === 'true'){
    const pending = JSON.parse(localStorage.getItem('hs_pending_ref') || 'null');
    if(pending && typeof _grantPayment === 'function'){
      _grantPayment(pending.dest, pending.days);
      localStorage.removeItem('hs_pending_ref');
    }
    window.history.replaceState({}, '', window.location.pathname);
    toast('Paiement confirmé — votre itinéraire est débloqué ✓');
  }

  /* ── Code promo staff ── */
  /* Code promo — Stripe gère les réductions directement sur le Payment Link.
     Le code HICSUNT-STAFF ne peut être activé que depuis la console Supabase,
     pas depuis le front-end accessible au public. */
  window.applyPromoCode = function(code){
    toast('Les codes promo s\'appliquent directement sur la page de paiement Stripe.');
  };
  window.mapView = function(){
    /* Filet de sécurité : répare les jours vides même si ce voyage était déjà
       chargé en mémoire avant le déploiement du correctif (session en cours,
       PWA non relancée) — pas seulement au chargement depuis Mes voyages. */
    if(typeof _repairPlanMoments==='function') _repairPlanMoments(ITINERARY.plan);
    if(typeof _repairPlanTitles==='function') _repairPlanTitles(ITINERARY.plan);
    var i=state.mapDay||0,p=(ITINERARY.plan||[])[i];
    var g=_geoGet(ITINERARY.dest||ITINERARY.destination||'');
    var vb=g.vb.split(' ').map(Number),vbW=vb[2],vbH=vb[3];
    var W=390,H=514,sc=Math.min(W/vbW,H/vbH)*0.88;
    var ox=(W-vbW*sc)/2,oy=(H-vbH*sc)/2;
    var pts=_geoPts(ITINERARY.plan||[],g),pin=pts[i]||{vx:vbW/2,vy:vbH/2};
    var pCx=ox+pin.vx*sc,pCy=oy+pin.vy*sc;
    var popL=Math.max(4,Math.min(pCx/W*100-20,50)),popT=pCy/H>0.58?(pCy/H*100-22):(pCy/H*100+6);
    var wx=p&&Array.isArray(p.wx)?p.wx:['sun','—'];
    var pop=p?'<div class="map-pop" style="left:'+popL.toFixed(1)+'%;top:'+popT.toFixed(1)+'%">'
      +'<div class="mp-k">Jour '+String(p.n).padStart(2,'0')+' · '+esc(p.loc||'')+'</div>'
      +'<div class="mp-t">'+esc(p.title||'')+'</div>'
      +'<div class="mp-m"><span class="mp-wx">'+ico(wx[0],13,1.7)+wx[1]+'</span>'
      +'<span class="mp-l" onclick="openDay('+i+')">Détails ›</span></div></div>':'';

    var nDays=(ITINERARY.plan||[]).length;
    var moments=p&&Array.isArray(p.moments)?p.moments:[];
    var agenda=moments.length?moments.map(function(m){
      var time=Array.isArray(m)?m[0]:m.t;
      var title=Array.isArray(m)?m[2]:(m.ti||m.title);
      var desc=Array.isArray(m)?m[3]:(m.d||m.desc);
      var showTime=time && !(typeof _isPlaceholderTime==='function' && _isPlaceholderTime(time));
      return '<div class="carte-mo"><div class="carte-mo-rail"><span class="carte-mo-dot"></span><span class="carte-mo-line"></span></div>'
        +'<div class="carte-mo-b">'+(showTime?'<span class="mono">'+esc(time)+'</span>':'')+'<div class="carte-mo-t">'+esc(title||'')+'</div>'
        +(desc?'<div class="carte-mo-d">'+esc(desc)+'</div>':'')+'</div></div>';
    }).join('') : '<p style="font-size:13px;color:var(--sub);padding:8px 0">Aucun programme détaillé pour ce jour.</p>';

    return '<div class="carte-full">'
      +'<div class="carte-map-bg"><div id="hs-map-full" class="carte-map-real"></div></div>'
      +'<div class="carte-top">'
      +  '<button class="carte-pill" onclick="closeOverlay()">'+ico('back',16,2)+'<span class="serif">'+esc(ITINERARY.dest||'')+'</span>'+(nDays?'<span class="mono">· '+nDays+'J</span>':'')+'</button>'
      +  '<button class="carte-round" onclick="if(typeof openOffline===\'function\')openOffline()" aria-label="Hors-ligne">'+ico('download',18,1.7)+'</button>'
      +'</div>'
      +'<div class="carte-sheet">'
      +  '<div class="carte-handle-wrap"><div class="carte-handle"></div></div>'
      +  '<div class="hs-scroll carte-daychips">'+(ITINERARY.plan||[]).map(function(d,j){
          return '<button class="map-chip'+(j===i?' on':'')+'" onclick="mapSelect('+j+')"><span class="mono">J'+d.n+'</span><span class="serif">'+d.n+'</span></button>';
        }).join('')+'</div>'
      +  (p?'<div class="carte-daytitle"><span class="serif">Jour '+p.n+' · <em>'+esc(p.loc||'')+'</em></span><span class="mono">'+moments.length+' escale'+(moments.length>1?'s':'')+'</span></div>':'')
      +  '<div class="carte-agenda">'+agenda+'</div>'
      +'</div>'
      +'</div>';
  };
  window.mapSelect = function(i){
    state.mapDay=i;
    var el=ovStack[ovStack.length-1];
    if(el&&el.dataset.ov==='map'){
      el.innerHTML=window.mapView();
      if(typeof renderHicSuntMap === 'function') renderHicSuntMap('hs-map-full', { dest: ITINERARY.dest, plan: ITINERARY.plan, activeIdx: i, interactive:true, padding:72 });
      _hsScrollChipIntoView(el);
    }
  };
  /* Fait défiler le rail des jours pour garder la puce sélectionnée visible —
     sans ça, choisir un jour hors du cadre visible (ex. J9) change le contenu
     mais laisse le rail affiché sur les puces précédentes, sans puce active visible. */
  function _hsScrollChipIntoView(container){
    requestAnimationFrame(function(){
      var chip = container.querySelector('.map-chip.on');
      if(chip) chip.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
    });
  }

  window.shareView = function(){
    var it=ITINERARY;
    return statusBar()+navbar('Partager le voyage')
      +'<div class="ov-scroll px">'
      +'<span class="eyebrow" style="display:block;margin-top:10px">'+esc(it.dest||'')+' · '+(_days(it)||'')+' jours</span>'
      +'<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Partager ce voyage</h1>'
      +'<div class="row" onclick="window.copyShareLink&&window.copyShareLink()"><span class="r-ico">'+ico('link',19,1.5)+'</span><div class="r-main"><div class="r-t">Copier le lien</div><div class="r-s">Lecture seule</div></div><span class="r-chev">'+ico('chevron',17,1.6)+'</span></div>'
      +'<div class="row" onclick="window.sendShareLink&&window.sendShareLink()"><span class="r-ico">'+ico('share',18,1.5)+'</span><div class="r-main"><div class="r-t">Envoyer par message</div><div class="r-s">iMessage · WhatsApp</div></div><span class="r-chev">'+ico('chevron',17,1.6)+'</span></div>'
      +'<div class="row" onclick="window.triggerPDF&&window.triggerPDF()"><span class="r-ico">'+ico('doc',19,1.5)+'</span><div class="r-main"><div class="r-t">Exporter en PDF</div><div class="r-s">Itinéraire complet</div></div><span class="r-chev">'+ico('chevron',17,1.6)+'</span></div>'
      +'</div>';
  };
  if(typeof copyShareLink==='undefined'||true){
    window.copyShareLink = async function(){
      try{ await navigator.clipboard.writeText('https://hic-suntapp.vercel.app/?voyage='+encodeURIComponent((ITINERARY.dest||'').toLowerCase().replace(/\s+/g,'-'))); toast('Lien copié'); }
      catch(e){ toast('Impossible de copier'); }
    };
    window.sendShareLink = async function(){
      var it=ITINERARY;
      var url='https://hic-suntapp.vercel.app/?voyage='+encodeURIComponent((it.dest||'').toLowerCase().replace(/\s+/g,'-'));
      var txt='Découvre cet itinéraire '+(it.dest||'')+' composé par Hic Sunt : '+url;
      if(navigator.share){try{await navigator.share({title:'Hic Sunt · '+(it.dest||''),text:txt,url:url});}catch(e){}}
      else{try{await navigator.clipboard.writeText(txt);toast('Lien copié');}catch(e){toast('Partage indisponible');}}
    };
  }

  /* Overrides robustes pour Budget, Activités, Pépites — résistent aux données manquantes */
  window.budgetView = function(){
    var it=ITINERARY;
    var total=it.budgetTotal||0;
    /* Toujours recalculer le budget complet avant d'afficher */
    if(typeof deriveBudget==='function'){
      try{
        deriveBudget(
          it.accommodations||[], total,
          it.dest||'', it.region||'', it.country||'',
          state.travelers||2, it.flightInfo||null
        );
      }catch(e){ console.warn('deriveBudget',e); }
    }
    var b=(typeof BUDGET!=='undefined')?BUDGET:{total:total,spent:0,lines:[]};
    if(!b.lines||!b.lines.length){
      b.lines=[{i:'wallet',n:'Budget estimé',sub:'tout compris',amount:total,paid:false}];
    }
    var displayTotal=b.total||total;
    return statusBar()+navbar('Budget du voyage')
      +'<div class="ov-scroll has-foot px">'
      +'<div class="bud-card">'
      +'<div class="bud-l">Total estimé · '+esc(it.dest||'')+'</div>'
      +'<div class="bud-v">'+eur(displayTotal)+'</div>'
      +'<div class="bud-s">'+travelerLabel()+' · '+(_days(it)||'')+' jours · estimation</div>'
      +'</div>'
      +'<div class="section-h"><h2>Répartition</h2><span class="meta">estimation</span></div>'
      +b.lines.map(function(l){return '<div class="bline">'+ico(l.i,20,1.5)
        +'<div class="bl-m"><div class="bl-n">'+esc(l.n)+'</div><div class="bl-s">'+esc(l.sub||'')+'</div></div>'
        +'<div class="bl-r"><div class="bl-v">'+eur(l.amount)+'</div></div></div>';}).join('')
      +'</div>'
      +'<div class="ov-foot"><div class="foot-price">'
      +'<div><div class="fp-v">'+eur(displayTotal)+'</div><div class="fp-l">estimation totale</div></div>'
      +'<button class="btn" onclick="openAllBookings()">Voir les hébergements</button>'
      +'</div></div>';
  };

  window.activitiesView = function(){
    var it=ITINERARY;
    var acts=[];
    (it.plan||[]).forEach(function(p){
      (p.moments||[]).forEach(function(m,mi){
        acts.push({id:'a'+p.n+'_'+mi,day:p.n,n:m[2]||'Expérience',tag:m[3]||'',loc:p.loc||'',dur:'~2h',price:0,i:m[1]||'pin'});
      });
    });
    /* Fallback si ACTIVITIES global est plus complet */
    if(typeof ACTIVITIES!=='undefined'&&ACTIVITIES.length>acts.length) acts=ACTIVITIES;
    if(!acts.length) return statusBar()+navbar('Activités')+'<div class="ov-scroll px"><p style="padding:40px 0;text-align:center;color:var(--sub)">Aucune activité dans cet itinéraire.</p></div>';
    var byDay={};
    acts.forEach(function(a){(byDay[a.day]=byDay[a.day]||[]).push(a);});
    var days=Object.keys(byDay).sort(function(a,b){return a-b;});
    return statusBar()+navbar('Activités & expériences')
      +'<div class="ov-scroll px">'
      +'<span class="eyebrow" style="display:block;margin-top:10px">Sélection du cartographe</span>'
      +'<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;margin-top:8px">Expériences sur-mesure</h1>'
      +days.map(function(d){return '<div class="act-day">Jour '+String(d).padStart(2,'0')+'</div>'
        +byDay[d].map(function(a){return '<div class="act" onclick="toast(\''+esc(a.n)+'\')" style="cursor:pointer">'
          +'<span class="a-th">'+ico(a.i,26,1.3)+'</span>'
          +'<div class="ac-m"><div class="ac-tag">'+esc(a.tag)+'</div><div class="ac-n">'+esc(a.n)+'</div>'
          +'<div class="ac-s">'+esc(a.loc)+' · '+esc(a.dur)+'</div></div>'
          +'<div class="ac-r"><span class="ac-p">~'+eur(a.price)+'</span></div></div>';}).join('');}).join('')
      +'</div>';
  };

  window.gemsView = function(){
    var it=ITINERARY;
    var gems=it.gems||[];
    if(!gems.length) return statusBar()+navbar('Adresses secrètes')+'<div class="ov-scroll px"><p style="padding:40px 0;text-align:center;color:var(--sub)">Les pépites seront disponibles après génération.</p></div>';
    var accent=(it.palette&&it.palette.culture)||'#D4943A';
    return statusBar()+navbar('Adresses secrètes')
      +'<div class="ov-scroll px">'
      +'<span class="eyebrow" style="display:block;margin-top:10px;color:'+accent+'">Sélection exclusive</span>'
      +'<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;margin-top:8px">Pépites cachées</h1>'
      +gems.map(function(g){return '<div class="gem-card" style="margin-top:14px;padding:16px;background:var(--surface);border:1px solid var(--line);border-radius:14px">'
        +'<div style="font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:'+accent+';margin-bottom:6px">★ Pépite</div>'
        +'<div style="font-family:var(--serif);font-size:18px;font-weight:600;margin-bottom:4px">'+esc(g.name||'')+'</div>'
        +(g.loc?'<div style="font-size:12px;color:var(--sub)">'+esc(g.loc)+'</div>':'')
        +(g.desc?'<div style="font-size:14px;margin-top:8px;color:var(--ink-soft)">'+esc(g.desc)+'</div>':'')
        +(g.tip?'<div style="font-size:12px;font-style:italic;margin-top:6px;color:'+accent+'">'+esc(g.tip)+'</div>':'')
        +'</div>';}).join('')
      +'</div>';
  };

  /* ── Voir les hébergements — version robuste ── */
  window.bookingView = function(accId){
    var it=ITINERARY;
    var a=null;
    (it.accommodations||[]).forEach(function(acc){ if(acc.id===accId) a=acc; });
    if(!a&&it.accommodations&&it.accommodations.length) a=it.accommodations[0];
    if(!a) return statusBar()+navbar('Hébergement')+'<div class="ov-scroll px"><p style="padding:40px 0;text-align:center;color:var(--sub)">Hébergement introuvable.</p></div>';

    var price=Number(a.price)||0, nights=Number(a.nights)||1, total=price*nights;
    var accent=(it.palette&&(it.palette.culture||it.palette.beach))||'#C9A96E';
    var guests=(state&&state.travelers)||2;
    var _r0=(typeof _stayDateRange==='function')?_stayDateRange(a):{checkin:it.dateFrom||'',checkout:it.dateTo||''};
    var checkin=_r0.checkin;
    var checkout=_r0.checkout;
    var name=String(a.n||'').trim();
    var loc=(a.loc||it.dest||'').trim();
    var nameQ=encodeURIComponent(name);
    var cityQ=encodeURIComponent(loc);
    var fullQ=encodeURIComponent(name+(loc?', '+loc:''));
    var nameLoc=encodeURIComponent(name+(loc?' '+loc:''));

    /* Liens recherche pré-remplie nom + ville + dates */
    var bookingUrl='https://www.booking.com/searchresults.html?ss='+fullQ+'&ssne='+cityQ+'&ssne_untouched='+cityQ
      +'&dest_type=hotel&lang=fr&group_adults='+guests+'&no_rooms=1&sb_travel_purpose=leisure'
      +(checkin?'&checkin='+checkin:'')+(checkout?'&checkout='+checkout:'')
      +(typeof AFFILIATE_TAGS!=='undefined'&&AFFILIATE_TAGS.booking?'&aid='+AFFILIATE_TAGS.booking:'');
    var airbnbUrl='https://www.airbnb.fr/s/'+cityQ+'/homes?query='+nameLoc+'&adults='+guests+'&search_type=autocomplete_click'
      +(checkin?'&checkin='+checkin:'')+(checkout?'&checkout='+checkout:'');
    var hotelsUrl='https://fr.hotels.com/search.do?q-destination='+fullQ+'&q-rooms=1&q-room-0-adults='+guests
      +(checkin?'&q-check-in='+checkin:'')+(checkout?'&q-check-out='+checkout:'');

    function platformRow(url, logo, color, title, subtitle){
      return '<a href="'+url+'" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:14px;padding:16px;background:var(--surface);border:1px solid var(--line);border-radius:14px;margin-bottom:10px;text-decoration:none;cursor:pointer">'
        +'<div style="width:42px;height:42px;border-radius:12px;background:'+color+';display:flex;align-items:center;justify-content:center;flex:none">'+logo+'</div>'
        +'<div style="flex:1"><div style="font-size:15px;font-weight:500;color:var(--ink)">'+title+'</div><div style="font-size:12px;color:var(--sub)">'+subtitle+'</div></div>'
        +'<span style="font-size:13px;font-weight:600;color:'+accent+'">Voir →</span></a>';
    }

    return '<div class="book-hero" style="position:relative;overflow:hidden;height:200px;background:linear-gradient(155deg,#1c1812,#0d0b08)">'
      +'<div style="position:absolute;inset:0;background:radial-gradient(120% 100% at 15% 0%,'+hexA(accent,0.25)+',transparent 60%)"></div>'
      +'<div class="navbar" style="position:absolute;top:54px;left:0;right:0;z-index:1"><button class="nav-btn" onclick="closeOverlay()" aria-label="Retour">'+ico('back',20,1.7)+'</button></div>'
      +'<span style="position:absolute;bottom:20px;right:24px;color:'+hexA(accent,0.9)+'">'+ico(a.i||'bed',32,1.3)+'</span>'
      +'</div>'
      +'<div class="ov-scroll px">'
      +'<div class="book-h" style="margin-top:16px;font-family:var(--serif);font-size:22px;font-weight:600">'+esc(a.n||'Hébergement')+'</div>'
      +'<div class="book-meta">'+esc(a.type||'')+' · '+esc(a.loc||'')+'</div>'
      +(a.blurb?'<p class="book-desc" style="margin-top:8px">'+esc(a.blurb)+'</p>':'')
      +'<div class="section-h" style="margin-top:20px"><h2>Votre séjour</h2></div>'
      +'<div class="stay-row">'+ico('cal',18,1.5)+'<span class="sr-l">'+esc((checkin&&checkout&&typeof _fmtDateRangeCompact==='function')?_fmtDateRangeCompact(checkin,checkout):(it.dates||''))+' · '+nights+' nuit'+(nights>1?'s':'')+'</span></div>'
      +'<div class="stay-row">'+ico('users',18,1.5)+'<span class="sr-l">'+guests+' voyageur'+(guests>1?'s':'')+'</span></div>'
      +'<div class="price-l" style="margin-top:12px"><span>'+eur(price)+' / nuit × '+nights+'</span><span style="font-weight:600;color:var(--ink)">'+eur(total)+'</span></div>'
      /* Comparateur */
      +'<div class="section-h" style="margin-top:24px"><h2>Réserver en ligne</h2><span class="meta">Dates pré-remplies</span></div>'
      +'<p style="font-size:13px;color:var(--sub);margin-bottom:16px;line-height:1.5">Cliquez pour voir les disponibilités et les vrais prix sur vos dates — choisissez la plateforme la moins chère.</p>'
      +platformRow(bookingUrl,'<span style="color:white;font-weight:900;font-size:13px;font-family:sans-serif">B.</span>','#003580','Booking.com','Hôtels · remboursement gratuit')
      +platformRow(airbnbUrl,'<span style="color:white;font-size:18px">✦</span>','#FF5A5F','Airbnb','Maisons · appartements · villas')
      +platformRow(hotelsUrl,'<span style="color:white;font-size:9px;font-weight:700;font-family:sans-serif;text-align:center;line-height:1.2">HOTELS<br>.COM</span>','#CC0000','Hotels.com','Prix exclusifs membres')
      +'</div>';
  };

  /* ── Modifier l'itinéraire (IA) — version robuste ── */
  window._chatBubble = function(role, text){
    return '<div class="bub '+(role==='user'?'me':'them')+'">'+esc(text)+'</div>';
  };
  window.openAI = function(){
    var intro = typeof AI_INTRO !== 'undefined' ? AI_INTRO : "Je suis votre cartographe. Décrivez un changement — j'ajuste l'itinéraire, les étapes et le budget en direct.";
    var prompts = typeof AI_PROMPTS !== 'undefined' ? AI_PROMPTS : ['Ajoute un jour','Rythme plus lent','Budget réduit','Plus de gastronomie'];
    /* Restaurer l'historique de conversation propre à cet itinéraire */
    var history = (ITINERARY.chatHistory && Array.isArray(ITINERARY.chatHistory)) ? ITINERARY.chatHistory : [];
    var historyHtml = history.length
      ? history.map(function(m){ return window._chatBubble(m.role, m.text); }).join('')
      : '<span class="day-sep">Assistant d\'itinéraire</span><div class="bub them">'+esc(intro)+'</div>';
    var dayCount = (ITINERARY.plan||[]).length || ITINERARY.days || 0;
    var chatHtml = statusBar()
      +'<div class="chat-nav"><button class="nav-btn ghost" onclick="closeOverlay()" aria-label="Retour">'+ico('back',20,1.7)+'</button>'
      +  '<div class="chat-id"><span class="chat-av">'+ico('sparkle',18,1.6)+'<span class="on-dot"></span></span>'
      +  '<span><span class="chat-n">Le cartographe</span><br><span class="chat-st">Compose votre sillage</span></span></div>'
      +  (history.length?'<button onclick="window._clearChat()" style="font-family:var(--mono);font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--sub);background:none;border:none;cursor:pointer;padding:6px;flex:none">Effacer</button>':'')
      +'</div>'
      +  (ITINERARY.dest ? '<div class="chat-context">'+esc(ITINERARY.dest)+(dayCount?' · '+dayCount+' jour'+(dayCount>1?'s':''):'')+'</div>' : '')
      +'<div data-ai-chat class="chat-scroll">'
      +  historyHtml
      +'</div>'
      +'<div class="quick">'+prompts.map(function(p){
        return '<button class="chip" onclick="window._aiSend(\'' + p.replace(/'/g,"\\'") + '\')">'+esc(p)+'</button>';
      }).join('')+'</div>'
      +'<div class="composer">'
      +  '<input id="ai-fb" data-ai-input placeholder="Décrivez un changement…" onkeydown="if(event.key===\'Enter\'){event.preventDefault();window._aiSend(this.value)}">'
      +  '<button class="send-btn" onclick="var i=document.getElementById(\'ai-fb\');window._aiSend(i.value)" aria-label="Envoyer">'+ico('arrowup',18,1.8)+'</button>'
      +'</div>';
    openOverlay('ai', chatHtml);
    /* Scroll en bas pour voir les derniers messages */
    requestAnimationFrame(function(){
      var c=document.querySelector('[data-ai-chat]');
      if(c) c.scrollTop=c.scrollHeight;
    });
  };
  window._clearChat = function(){
    if(ITINERARY) ITINERARY.chatHistory = [];
    try{ if(ITINERARY._dirty===false||ITINERARY.id) saveChatHistory(); }catch(e){}
    window.openAI();
  };
  window._aiSend = async function(msg){
    if(!msg||!msg.trim()) return;
    msg = msg.trim();

    /* Repères avant modification — pour afficher un delta réel (jours,
       budget) dans la carte de confirmation, plutôt qu'un texte vague. */
    var beforeDayCount = (ITINERARY.plan||[]).length;
    var beforeBudget = ITINERARY.budgetTotal || 0;

    /* Initialiser et enregistrer dans l'historique de cet itinéraire */
    if(!ITINERARY.chatHistory || !Array.isArray(ITINERARY.chatHistory)) ITINERARY.chatHistory = [];
    ITINERARY.chatHistory.push({role:'user', text:msg, at:Date.now()});

    /* Afficher le message utilisateur */
    var chat = document.querySelector('[data-ai-chat]');
    var inp = document.getElementById('ai-fb') || document.querySelector('[data-ai-input]');
    if(!chat) return;
    if(inp) inp.value = '';
    chat.innerHTML += '<div class="bub me">'+esc(msg)+'</div>';
    /* Indicateur de typing */
    var typingId = 'typing-'+Date.now();
    chat.innerHTML += '<div id="'+typingId+'" class="typing"><i></i><i></i><i></i></div>';
    chat.scrollTop = chat.scrollHeight;

    try{
      var it = ITINERARY;
      /* Résumé compact de l'itinéraire pour le contexte */
      var itSummary = JSON.stringify({
        dest: it.dest, days: it.days, level: it.level,
        plan: (it.plan||[]).map(function(p){ return {n:p.n, loc:p.loc, title:p.title, category:p.category}; }),
        stays: (it.accommodations||[]).map(function(a){ return {id:a.id, n:a.n, loc:a.loc, nights:a.nights, price:a.price}; }),
        budget: it.budgetTotal,
      });

      /* Contexte conversationnel : derniers échanges de cet itinéraire */
      var convo = (ITINERARY.chatHistory||[]).slice(-8,-1).map(function(m){
        return (m.role==='user'?'Voyageur':'Cartographe')+': '+m.text;
      }).join('\n');

      var prompt = [
        'Tu es le cartographe de Hic Sunt — assistant d\'itinéraire de voyage de luxe.',
        '',
        'ITINÉRAIRE ACTUEL (JSON résumé) :',
        itSummary,
        '',
        convo ? ('CONVERSATION PRÉCÉDENTE (pour continuité, tiens-en compte) :\n'+convo+'\n') : '',
        'DEMANDE DU VOYAGEUR : "'+msg+'"',
        '',
        'Réponds en JSON UNIQUEMENT avec les modifications à appliquer :',
        '{',
        '  "reply": "Message naturel et élégant expliquant les changements (1-2 phrases, ton cartographe)",',
        '  "changes": {',
        '    "plan": [jours modifiés — inclure UNIQUEMENT les champs qui changent (n est obligatoire, le reste est fusionné avec l\'existant) : {n, loc?, title?, category?, desc?, wx?, tags?, moments?, tip?}] ou null si aucun changement de plan,',
        '    "stays": [hébergements modifiés {id, n, type, loc, price, nights, blurb}] ou null,',
        '    "budgetTotal": nouveau budget total ou null,',
        '    "days": nouveau nombre de jours ou null',
        '  }',
        '}',
        '',
        'RÈGLES :',
        '- Ne retourner dans "plan" que les jours réellement modifiés (pas tous les jours), et seulement les champs qui changent — pas besoin de tout réécrire.',
        '- Si on ajoute un jour, l\'ajouter à la fin avec n = dernier_jour + 1',
        '- Respecter la cohérence géographique — pas d\'allers-retours',
        '- Les hébergements doivent avoir des prix réalistes et distincts',
        '- IMPÉRATIF : si "reply" affirme un changement déjà fait ("je réorganise", "nous remplaçons", "voici votre itinéraire mis à jour"…), "changes" DOIT contenir les données correspondantes. N\'annonce jamais un changement sans le fournir — dans ce cas, formule plutôt "reply" comme une proposition ("Voulez-vous que je...", "Je peux...") et laisse "changes" à null.',
        '- Répondre UNIQUEMENT en JSON valide, sans markdown',
      ].join('\n');

      var result = await _callSupabase(prompt);
      var parsed = parseItineraryJSON(result);

      /* Supprimer le typing */
      var typingEl = document.getElementById(typingId);
      if(typingEl) typingEl.remove();

      if(!parsed || !parsed.reply){
        chat.innerHTML += '<div class="bub them">Je n\'ai pas pu traiter cette demande. Pouvez-vous reformuler ?</div>';
        chat.scrollTop = chat.scrollHeight;
        return;
      }

      /* Afficher la réponse — les mentions "Jour N …" sont mises en valeur
         (échappées d'abord, la mise en forme est ajoutée après coup : aucun
         balisage venant de la réponse elle-même n'est jamais interprété). */
      var replyHtml = esc(parsed.reply).replace(/(Jour\s+\d+[^.,;!?]*)/g, '<em class="chat-hl">$1</em>');
      chat.innerHTML += '<div class="bub them">'+replyHtml+'</div>';
      /* Enregistrer dans l'historique de cet itinéraire et persister */
      ITINERARY.chatHistory.push({role:'assistant', text:parsed.reply, at:Date.now()});
      try{ saveChatHistory(); }catch(e){ console.warn('saveChatHistory:', e); }

      /* Appliquer les changements à ITINERARY en préservant les données existantes */
      var changes = parsed.changes || {};
      var changed = false;

      if(changes.days && typeof changes.days === 'number'){
        ITINERARY.days = changes.days; changed = true;
      }
      if(changes.budgetTotal && typeof changes.budgetTotal === 'number'){
        ITINERARY.budgetTotal = changes.budgetTotal; changed = true;
      }
      if(Array.isArray(changes.stays) && changes.stays.length){
        changes.stays.forEach(function(newStay){
          /* Normaliser : l'IA retourne {name, type, loc, price, nights} → on veut {n, type, loc, price, nights} */
          if(newStay.name && !newStay.n) newStay.n = newStay.name;
          if(!newStay.id) newStay.id = 'a'+(ITINERARY.accommodations||[]).length+1;
          if(!newStay.i) newStay.i = 'bed';
          if(!newStay.tag) newStay.tag = 'Sélection';
          if(!newStay.rate) newStay.rate = '4,9';
          if(!newStay.blurb) newStay.blurb = '';
          var idx = (ITINERARY.accommodations||[]).findIndex(function(a){
            return a.id===newStay.id || a.n===newStay.n || a.n===newStay.name;
          });
          if(idx >= 0) Object.assign(ITINERARY.accommodations[idx], newStay);
          else{ ITINERARY.accommodations = ITINERARY.accommodations||[]; ITINERARY.accommodations.push(newStay); }
        });
        changed = true;
      }
      if(Array.isArray(changes.plan) && changes.plan.length){
        changes.plan.forEach(function(newDay){
          var idx = (ITINERARY.plan||[]).findIndex(function(p){ return p.n===newDay.n; });
          /* Normaliser les moments : accepter {t,k,ti,d} ou [t,k,ti,d] */
          if(Array.isArray(newDay.moments)){
            newDay.moments = newDay.moments.map(function(m){
              if(Array.isArray(m)) return m;
              return [m.t||'—', m.k||m.icon||'pin', m.ti||m.title||'Moment', m.d||m.desc||''];
            });
          }
          if(idx >= 0){
            Object.assign(ITINERARY.plan[idx], newDay);
          } else {
            ITINERARY.plan = ITINERARY.plan||[];
            ITINERARY.plan.push(newDay);
          }
        });
        ITINERARY.plan.sort(function(a,b){ return (a.n||0)-(b.n||0); });
        changed = true;
      }

      /* Recalculer le budget en préservant les vols. deriveBudget() peut
         relever le total (planchers repas/transferts réalistes) — il faut
         récupérer cette valeur de retour, sinon ITINERARY.budgetTotal reste
         à l'ancien montant pendant que BUDGET.total (écran Budget) affiche
         le nouveau : les deux écrans montrent alors un prix différent pour
         le même voyage. */
      if(changed && typeof deriveBudget === 'function'){
        try{
          var recalcedBudget = deriveBudget(
            ITINERARY.accommodations||[], ITINERARY.budgetTotal||0,
            ITINERARY.dest||'', ITINERARY.region||'', ITINERARY.country||'',
            state.travelers||2,
            ITINERARY._flightInfo||null /* préserver les vols */
          );
          if(recalcedBudget) ITINERARY.budgetTotal = recalcedBudget;
        }catch(e){ console.warn('deriveBudget after AI change:', e); }
      }

      if(changed){
        ITINERARY._dirty = true;

        /* Carte de confirmation façon "réservation" — jour touché + delta
           réel de jours/budget, jamais un chiffre inventé. */
        var afterDayCount = (ITINERARY.plan||[]).length;
        var dayDelta = afterDayCount - beforeDayCount;
        var budgetDelta = (ITINERARY.budgetTotal||0) - beforeBudget;
        var touchedN = Array.isArray(changes.plan) && changes.plan.length ? changes.plan[changes.plan.length-1].n : null;
        var touchedDay = touchedN != null ? (ITINERARY.plan||[]).find(function(p){ return p.n === touchedN; }) : null;
        if(touchedDay || dayDelta || budgetDelta){
          var cccTitle = touchedDay
            ? ('Jour '+touchedDay.n+(dayDelta>0?' ajouté':' modifié')+(touchedDay.loc?' · '+esc(touchedDay.loc):''))
            : 'Itinéraire mis à jour';
          var cccParts = [];
          if(dayDelta) cccParts.push((dayDelta>0?'+':'')+dayDelta+' jour'+(Math.abs(dayDelta)>1?'s':''));
          if(budgetDelta) cccParts.push('budget '+(budgetDelta>0?'+':'-')+eur(Math.abs(budgetDelta)));
          chat.innerHTML += '<div class="chat-change-card"><span class="ccc-ico">'+ico('cal',18,1.6)+'</span>'
            + '<div><div class="ccc-t">'+cccTitle+'</div>'
            + (cccParts.length ? '<div class="ccc-s">'+cccParts.join(' · ')+'</div>' : '')
            + '</div></div>';
        }

        /* Bloc d'actions : voir + enregistrer (avec choix remplacer/garder les deux) */
        var actionsHTML = '<div style="margin:10px 0 4px 40px;display:flex;flex-direction:column;gap:8px;align-items:flex-start">'
          + '<button onclick="_returnToUpdatedItinerary()" style="background:var(--ink);color:var(--bg);border:none;border-radius:12px;padding:10px 16px;font-family:var(--sans);font-size:13px;font-weight:500;cursor:pointer">Voir l\'itinéraire mis à jour →</button>'
          + '<button onclick="_promptSaveModified()" style="background:transparent;color:var(--gold-deep);border:1px solid var(--gold-soft);border-radius:12px;padding:9px 16px;font-family:var(--sans);font-size:13px;font-weight:500;cursor:pointer">Enregistrer les changements</button>'
          + '</div>';
        chat.innerHTML += actionsHTML;
      } else {
        /* Transparence : le voyageur ne doit jamais se demander si un
           changement a réellement eu lieu. S'il n'y en a pas, on le dit
           clairement plutôt que de laisser une réponse ambiguë sans suite. */
        chat.innerHTML += '<div style="margin:2px 0 4px 4px;font-size:11.5px;color:var(--sub);font-style:italic">Aucune modification appliquée à l\'itinéraire.</div>';
      }

      chat.scrollTop = chat.scrollHeight;

    }catch(err){
      var typingEl2 = document.getElementById(typingId);
      if(typingEl2) typingEl2.remove();
      console.error('aiSend error:', err);
      chat.innerHTML += '<div class="bub them">Une erreur est survenue. Réessayez dans un instant.</div>';
      chat.scrollTop = chat.scrollHeight;
    }
  };

  /* Alias pour compatibilité features.js */
  window.aiSend = window._aiSend;

  /* ── Export PDF ── */
  window.triggerPDF = function(){
    if(typeof exportPDF==='function'){
      try{ exportPDF(); return; }
      catch(e){ console.error('exportPDF:',e.message); toast('Erreur PDF : '+e.message.slice(0,60)); return; }
    }
    toast('Export PDF indisponible — rechargez la page');
  };

  /* ── Activités avec prix estimés ── */
  window.activitiesView = function(){
    var it=ITINERARY;
    var acts=[];
    /* Utiliser ACTIVITIES si disponible et riche */
    if(typeof ACTIVITIES!=='undefined'&&ACTIVITIES.length>0){
      acts=ACTIVITIES;
    } else {
      /* Extraire depuis les moments du plan */
      var colFactor=(typeof _costOfLivingFactor==='function')?_costOfLivingFactor(it.dest||'',it.region||'',it.country||''):1;
      var priceMap={hike:25,beach:0,spa:80,food:45,culture:20,outdoor:30,transit:15};
      (it.plan||[]).forEach(function(p){
        (p.moments||[]).forEach(function(m,mi){
          var basePrice=(priceMap[p.category]||20)*colFactor;
          acts.push({id:'a'+p.n+'_'+mi,day:p.n,n:m[2]||'Expérience',tag:m[3]||p.category||'',loc:p.loc||'',dur:'~2h',price:Math.round(basePrice),i:m[1]||p.category||'pin'});
        });
      });
    }
    if(!acts.length) return statusBar()+navbar('Activités')+'<div class="ov-scroll px"><p style="padding:40px 0;text-align:center;color:var(--sub)">Aucune activité disponible.</p></div>';
    var byDay={};
    acts.forEach(function(a){(byDay[a.day]=byDay[a.day]||[]).push(a);});
    var days=Object.keys(byDay).sort(function(a,b){return Number(a)-Number(b);});
    return statusBar()+navbar('Activités & expériences')
      +'<div class="ov-scroll px">'
      +'<span class="eyebrow" style="display:block;margin-top:10px">Sélection du cartographe</span>'
      +'<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;margin-top:8px">Expériences sur-mesure</h1>'
      +days.map(function(d){return '<div class="act-day">Jour '+String(d).padStart(2,'0')+'</div>'
        +byDay[d].map(function(a){return '<div class="act" style="cursor:pointer">'
          +'<span class="a-th">'+ico(a.i,26,1.3)+'</span>'
          +'<div class="ac-m"><div class="ac-tag">'+esc(a.tag)+'</div><div class="ac-n">'+esc(a.n)+'</div>'
          +'<div class="ac-s">'+esc(a.loc)+' · '+esc(a.dur)+'</div></div>'
          +'<div class="ac-r"><span class="ac-p">~'+eur(a.price)+'</span></div></div>';}).join('');}).join('')
      +'</div>';
  };
  /* ── Tous les hébergements avec comparateur ── */
  window.openAllBookings = function(){
    var it=ITINERARY;
    var accs=it.accommodations||[];
    if(!accs.length){ toast('Aucun hébergement dans cet itinéraire'); return; }
    var guests=(state&&state.travelers)||2;
    var accent=(it.palette&&(it.palette.culture||it.palette.beach))||'#C9A96E';

    function platformBtn(url, label, color){
      return '<a href="'+url+'" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;padding:10px 8px;border-radius:10px;background:'+color+';color:white;font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:0.5px;text-decoration:none;text-align:center">'+label+'</a>';
    }

    var html = statusBar()+navbar('Hébergements du voyage')
      +'<div class="ov-scroll px" style="padding-top:8px">'
      +'<p style="font-size:13px;color:var(--sub);margin-bottom:20px;line-height:1.5">Cliquez sur une plateforme pour voir les disponibilités avec vos dates pré-remplies — réservez directement au meilleur prix.</p>';

    accs.forEach(function(a){
      var price=Number(a.price)||0, nights=Number(a.nights)||1;
      var name=String(a.n||'').trim();
      var loc=(a.loc||it.dest||'').trim();
      var fullQ=encodeURIComponent(name+(loc?', '+loc:''));
      var nameLoc=encodeURIComponent(name+(loc?' '+loc:''));
      var cityQ=encodeURIComponent(loc);
      var _r1=(typeof _stayDateRange==='function')?_stayDateRange(a):{checkin:it.dateFrom||'',checkout:it.dateTo||''};
      var checkin=_r1.checkin;
      var checkout=_r1.checkout;

      /* Booking : ss = nom + ville, dest_type=hotel pour cibler l'établissement,
         ac_click_type pousse la résolution directe vers la fiche si elle existe */
      var bookingUrl='https://www.booking.com/searchresults.html?ss='+fullQ+'&ssne='+cityQ+'&ssne_untouched='+cityQ
        +'&dest_type=hotel&lang=fr&group_adults='+guests+'&no_rooms=1&sb_travel_purpose=leisure'
        +(checkin?'&checkin='+checkin:'')+(checkout?'&checkout='+checkout:'')
        +(typeof AFFILIATE_TAGS!=='undefined'&&AFFILIATE_TAGS.booking?'&aid='+AFFILIATE_TAGS.booking:'');
      /* Airbnb : recherche nom + ville dans la query pour cibler le bon logement */
      var airbnbUrl='https://www.airbnb.fr/s/'+cityQ+'/homes?query='+nameLoc+'&adults='+guests+'&search_type=autocomplete_click'
        +(checkin?'&checkin='+checkin:'')+(checkout?'&checkout='+checkout:'');
      /* Hotels.com : destination = nom + ville */
      var hotelsUrl='https://fr.hotels.com/search.do?q-destination='+fullQ+'&q-rooms=1&q-room-0-adults='+guests
        +(checkin?'&q-check-in='+checkin:'')+(checkout?'&q-check-out='+checkout:'');

      var googleQ=encodeURIComponent((a.n||'')+' '+(a.loc||it.dest||''));
      var googleUrl='https://www.google.com/search?q='+googleQ;

      html += '<div style="background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:16px;margin-bottom:14px">'
        /* En-tête hébergement */
        +'<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">'
        +'<div style="width:38px;height:38px;border-radius:10px;background:'+hexA(accent,0.12)+';display:flex;align-items:center;justify-content:center;flex:none;color:'+accent+'">'+ico(a.i||'bed',20,1.3)+'</div>'
        +'<div style="flex:1">'
        +'<a href="'+googleUrl+'" target="_blank" rel="noopener" style="font-family:var(--serif);font-size:16px;font-weight:600;color:var(--ink);display:inline-flex;align-items:center;gap:5px;text-decoration:none">'
          +esc(a.n||'Hébergement')
          +'<span style="color:var(--gold);display:inline-flex;flex:none">'+ico('external',12,1.6)+'</span>'
        +'</a>'
        +'<div style="font-family:var(--mono);font-size:9px;letter-spacing:0.8px;text-transform:uppercase;color:var(--sub);margin-top:3px">'+esc(a.type||'')+' · '+esc(a.loc||'')+'</div>'
        +'</div>'
        +'<div style="text-align:right;flex:none">'
        +'<div style="font-size:15px;font-weight:600;color:var(--ink)">'+eur(price)+'/nuit</div>'
        +'<div style="font-family:var(--mono);font-size:9px;color:var(--sub)">'+nights+' nuit'+(nights>1?'s':'')+'</div>'
        +'</div>'
        +'</div>'
        +(a.blurb?'<p style="font-size:13px;color:var(--ink-soft);margin-bottom:12px;line-height:1.5">'+esc(a.blurb)+'</p>':'')
        /* 3 boutons plateformes */
        +'<div style="display:flex;gap:8px">'
        +platformBtn(bookingUrl,'Booking.com','#003580')
        +platformBtn(airbnbUrl,'Airbnb','#FF5A5F')
        +platformBtn(hotelsUrl,'Hotels.com','#CC0000')
        +'</div>'
        +'</div>';
    });

    html += '</div>';
    openOverlay('allbookings', html);
  };

  playSplash(buildApp);
});
