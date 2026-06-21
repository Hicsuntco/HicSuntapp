/* ── HIC SUNT · Sillage — features : carte, budget, activités, IA… ──── */

/* ── 12 · Carte géographique ─────────────────────────────────────────── */
/* Contours SVG simplifiés des pays + coordonnées relatives des villes clés */
const GEO_SHAPES = {
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

function _geoShape(dest){
  const d=(dest||'').toLowerCase();
  const keys=Object.keys(GEO_SHAPES).filter(function(k){return k!=='_default';});
  /* Test direct sur les clés */
  for(let i=0;i<keys.length;i++){ if(d.includes(keys[i])) return {key:keys[i],g:GEO_SHAPES[keys[i]]};  }
  /* Fallbacks par mots-clés */
  if(/italie|sicile|rome|milan|florence|naples|venise|toscane|amalfi/.test(d)) return {key:'italie',g:GEO_SHAPES.italie};
  if(/sardaigne|cagliari|sassari|nuoro/.test(d)) return {key:'sardaigne',g:GEO_SHAPES.sardaigne};
  if(/grèce|athènes|cyclades|crète|santorin|mykonos|rhodes/.test(d)) return {key:'grèce',g:GEO_SHAPES['grèce']};
  if(/espagne|madrid|barcelone|séville|andalousie|valence/.test(d)) return {key:'espagne',g:GEO_SHAPES.espagne};
  if(/france|paris|provence|bretagne|normandie|bordeaux/.test(d)) return {key:'france',g:GEO_SHAPES.france};
  if(/portugal|lisbonne|porto|algarve/.test(d)) return {key:'portugal',g:GEO_SHAPES.portugal};
  if(/maroc|marrakech|fès|casablanca|sahara/.test(d)) return {key:'maroc',g:GEO_SHAPES.maroc};
  if(/thaïlande|bangkok|chiang|phuket|krabi/.test(d)) return {key:'thaïlande',g:GEO_SHAPES['thaïlande']};
  if(/vietnam|hanoi|ho chi minh|hoi an|da nang/.test(d)) return {key:'vietnam',g:GEO_SHAPES.vietnam};
  if(/cambodge|angkor|phnom penh|siem reap/.test(d)) return {key:'cambodge',g:GEO_SHAPES.cambodge};
  if(/japon|tokyo|kyoto|osaka|hiroshima/.test(d)) return {key:'japon',g:GEO_SHAPES.japon};
  if(/inde|delhi|mumbai|jaipur|agra|rajasthan|kerala|goa/.test(d)) return {key:'inde',g:GEO_SHAPES.inde};
  if(/sri lanka|colombo|kandy/.test(d)) return {key:'sri lanka',g:GEO_SHAPES['sri lanka']};
  if(/bali|lombok|java|indonesie/.test(d)) return {key:'bali',g:GEO_SHAPES.bali};
  if(/pérou|lima|cusco|machu|andes/.test(d)) return {key:'pérou',g:GEO_SHAPES['pérou']};
  if(/mexique|cancún|oaxaca|guadalajara|yucatan/.test(d)) return {key:'mexique',g:GEO_SHAPES.mexique};
  if(/kenya|nairobi|safari|masai mara/.test(d)) return {key:'kenya',g:GEO_SHAPES.kenya};
  if(/tanzanie|serengeti|zanzibar|kilimandjaro/.test(d)) return {key:'tanzanie',g:GEO_SHAPES.tanzanie};
  if(/islande|reykjavik/.test(d)) return {key:'islande',g:GEO_SHAPES.islande};
  return {key:'_default',g:GEO_SHAPES._default};
}

function _cityPtsOnMap(plan, geo){
  /* Retourne des coordonnées dans l'espace viewBox (pas canvas) */
  const vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number);
  const vbW=vbParts[2], vbH=vbParts[3];
  const cities=geo.g.cities||{};

  /* Centroïde pour le fallback */
  const cityVals=Object.values(cities);
  let cxCentre=vbW/2, cyCentre=vbH/2;
  if(cityVals.length){
    cxCentre=cityVals.reduce(function(s,c){return s+c[0];},0)/cityVals.length;
    cyCentre=cityVals.reduce(function(s,c){return s+c[1];},0)/cityVals.length;
  }

  function matchCity(loc){
    if(!loc) return null;
    const parts=loc.split(/[\/\-,]/);
    const tokens=parts.map(function(p){return p.trim().toLowerCase();}).filter(Boolean);
    for(const city in cities){
      const cl=city.toLowerCase().trim();
      for(let t=0;t<tokens.length;t++){
        const tok=tokens[t];
        if(!tok||tok.length<3) continue;
        if(cl===tok||cl.includes(tok)||tok.includes(cl)) return cities[city];
        if(tok.length>=5&&cl.length>=5&&cl.slice(0,5)===tok.slice(0,5)) return cities[city];
      }
    }
    return null;
  }

  const matched=plan.map(function(p){return matchCity(p.loc||'');});
  const fallbackCount=matched.filter(function(m){return !m;}).length;
  let fallbackIdx=0;

  return plan.map(function(p,i){
    const m=matched[i];
    if(m){
      /* coordonnées brutes dans le viewBox */
      return {vx:m[0], vy:m[1], n:i+1, loc:p.loc, day:p.n};
    }
    /* fallback en cercle autour du centroïde, dans le viewBox */
    const angle=(fallbackIdx/Math.max(1,fallbackCount))*Math.PI*2-Math.PI/2;
    const radius=Math.min(vbW,vbH)*0.15;
    fallbackIdx++;
    return {vx:cxCentre+Math.cos(angle)*radius, vy:cyCentre+Math.sin(angle)*radius, n:i+1, loc:p.loc, day:p.n};
  });
}

function geoMapSVG(W, H, activeIdx){
  const it=ITINERARY;
  const dest=it.dest||it.destination||'';
  const geo=_geoShape(dest);
  const vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number);
  const vbW=vbParts[2], vbH=vbParts[3];
  const accent=(it.palette&&(it.palette.culture||it.palette.beach))||'#C9A96E';

  /* Dédupliquer le plan par lieu — on ne montre qu'une étape par ville */
  const fullPlan = it.plan||[];
  const seenLocs = {};
  const dedupPlan = [];
  fullPlan.forEach(function(p){
    const key = (p.loc||'').split(/[\/\-,]/)[0].trim().toLowerCase();
    if(!seenLocs[key]){ seenLocs[key]=true; dedupPlan.push(p); }
  });
  /* Limiter à 8 pins max sur la minimap */
  const displayPlan = dedupPlan.slice(0,8).map(function(p,i){return Object.assign({},p,{n:i+1});});

  const pts=_cityPtsOnMap(displayPlan, geo);

  const scale=Math.min(W/vbW, H/vbH)*0.88;
  const offX=(W-vbW*scale)/2;
  const offY=(H-vbH*scale)/2;

  /* Route pointillée — en coords viewBox, dans le même transform */
  let routePath='';
  if(pts.length>1){
    routePath='M'+pts[0].vx.toFixed(1)+' '+pts[0].vy.toFixed(1);
    for(let i=1;i<pts.length;i++){
      const mx=((pts[i-1].vx+pts[i].vx)/2).toFixed(1);
      const my=((pts[i-1].vy+pts[i].vy)/2).toFixed(1);
      routePath+=' Q'+pts[i-1].vx.toFixed(1)+' '+pts[i-1].vy.toFixed(1)+' '+mx+' '+my;
      routePath+=' T'+pts[i].vx.toFixed(1)+' '+pts[i].vy.toFixed(1);
    }
  }

  /* Taille des pins en unités viewBox (inversement proportionnelle au scale) */
  const pinR=Math.round(7/scale*10)/10;
  const pinRon=Math.round(10/scale*10)/10;
  const fontSize=Math.round(6/scale*10)/10;
  const fontSizeOn=Math.round(8/scale*10)/10;

  const pins=pts.map(function(p,i){
    const on=activeIdx===i;
    const r=on?pinRon:pinR;
    const fs=on?fontSizeOn:fontSize;
    return '<g class="mpin'+(on?' on':'')+'"'+(activeIdx!==null?' style="cursor:pointer" onclick="mapSelect('+i+')"':'')+' >'
      +'<circle cx="'+p.vx.toFixed(1)+'" cy="'+p.vy.toFixed(1)+'" r="'+r+'"/>'
      +'<text x="'+p.vx.toFixed(1)+'" y="'+(p.vy+r*0.38).toFixed(1)+'" font-size="'+fs+'">'+p.n+'</text></g>';
  }).join('');

  /* Tout dans le même <g transform> — path + route + pins parfaitement alignés */
  return '<svg class="map-svg" viewBox="0 0 '+W+' '+H+'" fill="none" xmlns="http://www.w3.org/2000/svg">'
    +'<rect width="'+W+'" height="'+H+'" fill="rgba(246,240,228,0.02)" rx="10"/>'
    +'<g transform="translate('+offX.toFixed(1)+','+offY.toFixed(1)+') scale('+scale.toFixed(4)+')">'
    +'<path d="'+geo.g.path+'" fill="'+hexA(accent,0.10)+'" stroke="'+hexA(accent,0.60)+'" stroke-width="'+(1.2/scale).toFixed(2)+'" stroke-linejoin="round" stroke-linecap="round"/>'
    +(routePath?'<path class="geo-route" d="'+routePath+'" stroke="'+hexA(accent,0.85)+'" stroke-width="'+(1.5/scale).toFixed(2)+'" stroke-dasharray="'+(4/scale).toFixed(1)+' '+(3/scale).toFixed(1)+'" fill="none" style="animation:none !important;stroke-dashoffset:0 !important"/>':'')
    +pins
    +'</g>'
    +'</svg>';
}

function mapView(){
  const i=state.mapDay||0;
  const p=(ITINERARY.plan||[])[i];
  const dest=ITINERARY.dest||ITINERARY.destination||'';
  const geo=_geoShape(dest);
  const vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number);
  const vbW=vbParts[2], vbH=vbParts[3];
  const W=345, H=420;
  const scale=Math.min(W/vbW,H/vbH)*0.88;
  const offX=(W-vbW*scale)/2;
  const offY=(H-vbH*scale)/2;

  /* Convertir coords viewBox → canvas pour la popup */
  const pts=_cityPtsOnMap(ITINERARY.plan||[], geo);
  const pin=pts[i]||{vx:vbW/2,vy:vbH/2};
  const pinCanvasX=offX+pin.vx*scale;
  const pinCanvasY=offY+pin.vy*scale;
  const popLeftPct=Math.max(4,Math.min(pinCanvasX/W*100-20,50));
  const popTopPct=pinCanvasY/H>0.58?(pinCanvasY/H*100-22):(pinCanvasY/H*100+6);

  const pop=p?'<div class="map-pop" style="left:'+popLeftPct.toFixed(1)+'%;top:'+popTopPct.toFixed(1)+'%">'
    +'<div class="mp-k">Jour '+String(p.n).padStart(2,'0')+' · '+esc(p.loc)+'</div>'
    +'<div class="mp-t">'+esc(p.title)+'</div>'
    +'<div class="mp-m"><span class="mp-wx">'+ico(p.wx[0],13,1.7)+p.wx[1]+'</span>'
    +'<span class="mp-l" onclick="openDay('+i+')">Détails ›</span></div></div>':'';
  return statusBar()
    +navbar('Carte du voyage',{right:'<button class="nav-btn" onclick="openOffline()" aria-label="Hors-ligne">'+ico('download',18,1.6)+'</button>'})
    +'<div class="ov-scroll">'
    +'<div class="bigmap">'
    +'<span class="map-coords">'+esc(ITINERARY.coords||ITINERARY.dest)+'</span>'
    +'<span class="map-rose">'+rose(26,1.1)+'</span>'
    +geoMapSVG(W,H,i)+pop
    +'</div>'
    +'<div class="map-rail">'+(ITINERARY.plan||[]).map(function(d,j){
      return '<button class="map-chip'+(j===i?' on':'')+'" onclick="mapSelect('+j+')">'
        +'<div class="mc-d">Jour '+String(d.n).padStart(2,'0')+'</div><div class="mc-l">'+esc(d.loc)+'</div></button>';
    }).join('')+'</div>'
    +'</div>';
}
function mapSelect(i){
  state.mapDay = i;
  const el = ovStack[ovStack.length - 1];
  if (el && el.dataset.ov === 'map') el.innerHTML = mapView();
}

/* ── 13 · Budget ────────────────────────────────────────────────────── */
function budgetView(){
  const b = BUDGET || {total:0, spent:0, lines:[]};
  if(!b.total && ITINERARY.budgetTotal) b.total = ITINERARY.budgetTotal;
  if(!b.lines || !b.lines.length) b.lines = [{i:'wallet',n:'Budget estimé',sub:'tout compris',amount:b.total,paid:false}];
  const pct = Math.round(b.spent / b.total * 100);
  const rest = b.total - b.spent;
  const isGen = !!ITINERARY.generated;
  return statusBar() + navbar('Budget du voyage')
    + '<div class="ov-scroll has-foot px">'
    +   '<div class="bud-card">'
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
        + '<button class="btn" onclick="openBooking(\'' + (ITINERARY.accommodations[0]?ITINERARY.accommodations[0].id:'') + '\')">Voir les hébergements</button>'
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
  return statusBar() + navbar('Activités & expériences')
    + '<div class="ov-scroll px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">Sélection du cartographe</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Expériences sur-mesure</h1>'
    +   '<p class="lede" style="margin-top:10px">Des suggestions pour enrichir votre séjour — à organiser sur place ou auprès d\'un prestataire local.</p>'
    +   days.map(function(d){
        return '<div class="act-day">Jour ' + String(d).padStart(2,'0') + '</div>'
          + byDay[d].map(function(a){
            return '<div class="act" onclick="openActivityDetail(\'' + a.id + '\')" style="cursor:pointer">' + '<span class="a-th">' + ico(a.i, 26, 1.3) + '</span>'
              + '<div class="ac-m"><div class="ac-tag">' + esc(a.tag) + '</div><div class="ac-n">' + esc(a.n) + '</div>'
              + '<div class="ac-s">' + esc(a.loc) + ' · ' + esc(a.dur) + '</div></div>'
              + '<div class="ac-r"><span class="ac-p">~' + eur(a.price) + '</span></div></div>';
          }).join('');
      }).join('')
    + '</div>';
}
function _actById(id){ return ACTIVITIES.find(function(a){ return a.id === id; }); }
function openActivityDetail(id){
  const a = _actById(id);
  if (!a) return;
  const html = statusBar() + navbar('Activité')
    + '<div class="ov-scroll px">'
    +   '<div style="display:flex;align-items:center;justify-content:center;height:140px;background:var(--tile-bg);border-radius:14px;margin-top:14px;color:var(--gold)">' + ico(a.i, 48, 1.2) + '</div>'
    +   '<span class="eyebrow" style="display:block;margin-top:18px">' + esc(a.tag) + ' · Jour ' + a.day + '</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:26px;letter-spacing:-0.4px;margin-top:6px">' + esc(a.n) + '</h1>'
    +   '<div class="book-meta" style="margin-top:4px">' + esc(a.loc) + ' · ' + esc(a.dur) + '</div>'
    +   '<p class="book-desc" style="margin-top:14px">Une suggestion de votre cartographe pour s\'intégrer naturellement à votre journée à ' + esc(a.loc) + '. Budget indicatif ~' + eur(a.price) + ' par personne — à organiser sur place ou auprès d\'un prestataire local.</p>'
    + '</div>';
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
function openCercle(){
  const el = openOverlay('cercle', cercleView());
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      const bar = el.querySelector('[data-cc-prog]');
      if(bar) bar.style.width = bar.dataset.target + '%';
    });
  });
}
function cercleView(){
  const pct = Math.round(CERCLE.progress * 100);
  return statusBar() + navbar('Cercle Hic Sunt')
    + '<div class="ov-scroll px">'
    +   '<div class="cercle-card">'
    +     '<div class="cc-tier">' + esc(CERCLE.tier) + '</div>'
    +     '<div class="cc-pts">' + CERCLE.points + ' points</div>'
    +     '<div class="cc-prog"><i data-cc-prog style="width:0%" data-target="' + pct + '"></i></div>'
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

  /* ── Palette ── */
  const themeName = (typeof _themeForDestination === 'function')
    ? _themeForDestination(it.dest||'', it.region||'', it.country||'')
    : (it.theme || 'mediterranean');
  const palette = (typeof THEME_PALETTES !== 'undefined' && THEME_PALETTES[themeName])
    || it.palette
    || {hike:'#3A9E7E',beach:'#3A9EC9',spa:'#E8A87A',food:'#D44A2A',culture:'#D4943A',outdoor:'#4ABDB0',transit:'#A89880'};

  /* ── Couleurs signature étendues à tous les thèmes ── */
  const SIG_PDF = {
    mediterranean: { c1: palette.beach   ||'#3A9EC9', c2: palette.food    ||'#D44A2A' },
    desert:        { c1: palette.culture ||'#D4943A', c2: palette.food    ||'#D4522A' },
    alpine:        { c1: palette.hike    ||'#3A9E7E', c2: palette.outdoor ||'#4ABECE' },
    tropical:      { c1: palette.food    ||'#E87A4A', c2: palette.hike    ||'#2D9E6B' },
    tropical_io:   { c1: palette.beach   ||'#4AC8E0', c2: palette.spa     ||'#E87A9A' },
    steppe:        { c1: palette.beach   ||'#5A8AAA', c2: palette.hike    ||'#7A9E8A' },
    andean:        { c1: palette.culture ||'#C0A040', c2: palette.hike    ||'#8A6A3A' },
    urban_asia:    { c1: palette.culture ||'#7A50C0', c2: palette.food    ||'#E05030' },
    urban:         { c1: palette.culture ||'#7A65D4', c2: palette.food    ||'#D4854A' },
    savanna:       { c1: palette.outdoor ||'#70A850', c2: palette.culture ||'#B07030' },
    caribbean:     { c1: palette.beach   ||'#30C0C0', c2: palette.food    ||'#E0A030' },
  };
  const sig = SIG_PDF[themeName] || SIG_PDF.tropical;
  const sigColor  = sig.c1;
  const sigColor2 = sig.c2;

  /* ── PDF layout par thème : fond, typographie, structure ── */
  /* Chaque thème a une identité visuelle distincte */
  const CAT_LABEL = {hike:'Rando & nature',beach:'Plage & océan',spa:'Bien-être',food:'Table & saveurs',culture:'Patrimoine',outdoor:'Plein air',transit:'Transfert'};
  const CAT_EMOJI = {hike:'\u{1F95E}',beach:'\u{1F30A}',spa:'\u{1F9D8}',food:'\u{1F37D}',culture:'\u{1F3DB}',outdoor:'\u2600',transit:'\u2708'};

  const stayById = {};
  (it.accommodations||[]).forEach(function(a){ stayById[a.id] = a; });

  const dayMomentIcon = {plane:'\u2708',fork:'\u25CB',droplet:'\u2740',wave:'\u223C',peaks:'\u25B2',arch:'\u25A0',leaf:'\u2741',sun:'\u2600',moon:'\u263D',bed:'\u25A1',star:'\u2605',camera:'\u25C9',ticket:'\u25C8',pin:'\u25CF',compass:'\u25C7'};

  /* ── timeline du circuit (étapes consécutives regroupées par lieu) ── */
  /* Normaliser le nom de lieu pour regrouper les variantes d'une même ville
     Ex: "Bangkok (Thonburi)" → "Bangkok"
         "Thonburi, Bangkok" → "Bangkok"
         "Chiang Mai - vieille ville" → "Chiang Mai" */
  function normalizeLoc(loc){
    if(!loc) return '';
    let s = loc.split(/[\(\,\/\-–]/)[0].trim();
    /* Cas spécial : "Quartier, Ville" → prendre la ville (deuxième partie) */
    const parts = loc.split(/[\,]/);
    if(parts.length >= 2){
      /* Si la première partie est un quartier connu, prendre la deuxième */
      const last = parts[parts.length-1].trim();
      if(last.length > 2 && last.length < 25) s = last;
    }
    /* Normaliser les grandes villes communes */
    const cityNorm = {
      // Sardaigne nord
      'thonburi':'Bangkok','sukhumvit':'Bangkok','silom':'Bangkok','khao san':'Bangkok',
      'old city':'Chiang Mai','nimman':'Chiang Mai','vieille ville':'Chiang Mai',
      'ao noi':'Krabi','ao nang':'Krabi','railay':'Krabi',
      'patong':'Phuket','kata':'Phuket','karon':'Phuket','kalim':'Phuket',
      'medina':'Marrakech','guéliz':'Marrakech','mellah':'Marrakech',
      'trastevere':'Rome','prati':'Rome','pigneto':'Rome',
      // Sardaigne sud
      'domus de maria':'Chia','su portu':'Chia','cala cipolla':'Chia',
      'isola di san pietro':'Carloforte','isola san pietro':'Carloforte',
      'san pietro':'Carloforte','carloforte':'Carloforte',
      'calasetta':'Calasetta','portoscuso':'Portoscuso',
      'sant anna arresi':'Sant Anna Arresi','porto pino':'Porto Pino',
      'villasimius':'Villasimius','capo carbonara':'Villasimius',
      'cagliari (aéroport)':'Cagliari','cagliari elmas':'Cagliari','elmas':'Cagliari',
      // Sardaigne centre/est
      'nuoro':'Nuoro','oliena':'Nuoro','orgosolo':'Orgosolo',
      'dorgali':'Dorgali','cala gonone':'Cala Gonone',
      // Sardaigne nord
      'baia sardinia':'Costa Smeralda','porto cervo':'Porto Cervo',
      'palau':'Palau','la maddalena':'La Maddalena',
      'costa smeralda nord':'Costa Smeralda','gallura':'Olbia',
    };
    const key = s.toLowerCase().trim();
    return cityNorm[key] || s;
  }

  const stops = [];
  (it.plan||[]).forEach(function(p, i){
    const normLoc = normalizeLoc(p.loc);
    const last = stops[stops.length-1];
    if (last && normalizeLoc(last.loc) === normLoc) { last.nights++; last.endDay = p.n; }
    else { stops.push({ loc:p.loc, normLoc:normLoc, nights:1, startDay:p.n, endDay:p.n, category:p.category }); }
  });
  const timelineHTML = stops.map(function(s, i){
    const color = palette[s.category] || sigColor;
    const cls = i===0 ? 'start' : (i===stops.length-1 ? 'end' : '');
    return '<div class="tl-stop '+cls+'" style="--c:'+color+'">'
      + '<div class="tl-dot"></div>'
      + '<div class="tl-city">'+esc(s.loc)+'</div>'
      + '<div class="tl-dates">Jour '+s.startDay+(s.endDay>s.startDay?'\u2013'+s.endDay:'')+'</div>'
      + '<div class="tl-nights">'+s.nights+' nuit'+(s.nights>1?'s':'')+'</div>'
      + '</div>';
  }).join('');

  /* ── légende des catégories présentes ── */
  const usedCats = {};
  it.plan.forEach(function(p){ usedCats[p.category] = true; });
  (it.gems||[]).length && (usedCats.culture = true);
  const legendHTML = Object.keys(usedCats).map(function(c){
    return '<div class="legend-item"><div class="legend-dot" style="background:'+(palette[c]||sigColor)+'"></div><span style="color:'+(palette[c]||sigColor)+'">'+(CAT_LABEL[c]||c)+'</span></div>';
  }).join('');

  /* ── jours regroupés par étape ── */
  let sectionHTML = '';
  let stopIdx = 0, dayInStop = 0;
  (it.plan||[]).forEach(function(p, i){
    if(!p) return;
    const color = palette[p.category] || sigColor;
    const rgbaBg = hexA(color, 0.07), rgbaB = hexA(color, 0.22);

    if (dayInStop === 0) {
      const s = stops[stopIdx] || {loc:p.loc||'',nights:1,startDay:p.n||i+1,endDay:p.n||i+1};
      sectionHTML += '<section class="leg-section">'
        + '<div class="leg-head" style="--c:'+color+'">'
        + '<div class="leg-num">'+String(stopIdx+1).padStart(2,'0')+'</div>'
        + '<div><div class="leg-tag">Jour '+s.startDay+(s.endDay>s.startDay?'\u2013'+s.endDay:'')+' \u00B7 '+s.nights+' nuit'+(s.nights>1?'s':'')+'</div>'
        + '<div class="leg-name">'+esc(s.loc)+'</div>'
        + (p.desc ? '<div class="leg-hook">'+esc(p.desc)+'</div>' : '')
        + '</div></div>';

      let cards = '';
      if (p.night && p.night.acc && stayById[p.night.acc]) {
        const a = stayById[p.night.acc];
        cards += '<div class="card" style="--bg:'+rgbaBg+';--b:'+rgbaB+';--c:'+color+'">'
          + '<div class="card-label">\u{1F3E1} H\u00E9bergement</div>'
          + '<div class="card-name">'+esc(a.n)+'</div>'
          + '<div class="card-desc">'+esc(a.type)+' \u00B7 '+esc(a.loc)+(a.blurb?' \u2014 '+esc(a.blurb):'')+'</div>'
          + '<div class="card-price" style="color:'+color+'">'+eur(a.price)+' / nuit \u00B7 '+a.nights+' nuit'+(a.nights>1?'s':'')+'</div>'
          + '</div>';
      }
      if (p.restaurant) {
        cards += '<div class="card" style="--bg:'+hexA(palette.food||sigColor2,0.07)+';--b:'+hexA(palette.food||sigColor2,0.22)+';--c:'+(palette.food||sigColor2)+'">'
          + '<div class="card-label">'+CAT_EMOJI.food+' Table</div>'
          + '<div class="card-name">'+esc(p.restaurant.name||'')+'</div>'
          + '<div class="card-desc">'+esc(p.restaurant.type||'')+(p.restaurant.note?' \u2014 '+esc(p.restaurant.note):'')+'</div>'
          + (p.restaurant.price ? '<div class="card-note">'+esc(p.restaurant.price)+'</div>' : '')
          + '</div>';
      }
      if (p.wellness) {
        cards += '<div class="card" style="--bg:'+hexA(palette.spa||'#E8A87A',0.07)+';--b:'+hexA(palette.spa||'#E8A87A',0.22)+';--c:'+(palette.spa||'#E8A87A')+'">'
          + '<div class="card-label">'+CAT_EMOJI.spa+' Bien-\u00EAtre</div>'
          + '<div class="card-name">'+esc(p.wellness.name||'')+'</div>'
          + '<div class="card-desc">'+esc(p.wellness.type||'')+(p.wellness.note?' \u2014 '+esc(p.wellness.note):'')+'</div>'
          + (p.wellness.price ? '<div class="card-note">'+esc(p.wellness.price)+'</div>' : '')
          + '</div>';
      }
      if (cards) sectionHTML += '<div class="cards">'+cards+'</div>';
    }

    const moments = Array.isArray(p.moments) ? p.moments : [];
    const momentsHTML = moments.map(function(m){
      const glyph = dayMomentIcon[m[1]] || '\u2022';
      return '<div class="moment"><span class="mo-time">'+esc(m[0])+'</span><span class="mo-glyph" style="color:'+color+'">'+glyph+'</span>'
        + '<div class="mo-text"><span class="mo-title">'+esc(m[2]||'')+'</span>'+(m[3]?'<span class="mo-detail">'+esc(m[3])+'</span>':'')+'</div></div>';
    }).join('');
    sectionHTML += '<div class="day">'
      + '<div class="day-head"><span class="day-num" style="color:'+color+'">'+String(p.n||i+1).padStart(2,'0')+'</span>'
      + '<div><h3>'+esc(p.title||'')+'</h3><p class="day-loc">'+esc(p.loc||'')+'</p></div></div>'
      + '<div class="moments">'+momentsHTML+'</div>'
      + (p.tip ? '<p class="day-tip" style="color:'+color+'">'+esc(p.tip)+'</p>' : '')
      + '</div>';

    dayInStop++;
    const curStop = stops[stopIdx];
    if (!curStop || dayInStop >= curStop.nights) { dayInStop = 0; stopIdx++; sectionHTML += '</section>'; }
  });

  /* ── pépites cachées ── */
  const gemsHTML = (it.gems && it.gems.length) ? '<section class="leg-section"><div class="leg-head" style="--c:'+(palette.culture||sigColor)+'">'
    + '<div class="leg-num">\u2726</div><div><div class="leg-tag">R\u00E9capitulatif</div><div class="leg-name">Adresses secr\u00E8tes</div></div></div>'
    + '<div class="cards">' + it.gems.map(function(g){
        const color = palette.culture || sigColor;
        return '<div class="card" style="--bg:'+hexA(color,0.07)+';--b:'+hexA(color,0.22)+';--c:'+color+'">'
          + '<div class="card-label">\u2726 Pépite</div>'
          + '<div class="card-name">'+esc(g.name)+'</div>'
          + (g.loc ? '<div class="card-note" style="margin-top:0">'+esc(g.loc)+'</div>' : '')
          + (g.desc ? '<div class="card-desc">'+esc(g.desc)+'</div>' : '')
          + (g.tip ? '<div class="card-note">'+esc(g.tip)+'</div>' : '')
          + '</div>';
      }).join('') + '</div></section>' : '';

  /* ── informations pratiques ── */
  const essentials = it.essentials || {};
  const essentialsHTML = (essentials.toKnow || essentials.bestTime || essentials.visa) ? '<section class="leg-section"><div class="leg-head" style="--c:#9c7c44">'
    + '<div class="leg-num">\u2139</div><div><div class="leg-tag">Pratique</div><div class="leg-name">Informations essentielles</div></div></div>'
    + '<div class="essentials">'
    + (essentials.bestTime ? '<p><span>P\u00E9riode</span>'+esc(essentials.bestTime)+'</p>' : '')
    + (essentials.visa ? '<p><span>Visa</span>'+esc(essentials.visa)+'</p>' : '')
    + (essentials.toKnow ? essentials.toKnow.map(function(t){ return '<p><span>\u2022</span>'+esc(t)+'</p>'; }).join('') : '')
    + '</div></section>' : '';

  /* ── budget ── */
  const stayRows = it.accommodations.map(function(a){
    return '<tr><td class="city">'+esc(a.loc)+'</td><td>'+a.nights+'</td><td>'+esc(a.type)+'</td><td class="price">'+eur(a.price)+' / nuit</td><td class="price">'+eur(a.price*a.nights)+'</td></tr>';
  }).join('');
  const stayTotal = it.accommodations.reduce(function(s,a){return s+a.price*a.nights;},0);
  const budgetHTML = '<section class="leg-section" style="border-bottom:none"><div class="leg-head" style="--c:#C9965A">'
    + '<div class="leg-num" style="font-size:2.4rem">\u20AC</div><div><div class="leg-tag">Estimation</div><div class="leg-name">Budget du voyage</div></div></div>'
    + '<table><tr><th>\u00C9tape</th><th>Nuits</th><th>Type</th><th>Prix/nuit</th><th>Total</th></tr>'
    + stayRows
    + '<tr class="total-row"><td colspan="4">H\u00E9bergement ('+travelerLabel()+')</td><td class="price" style="color:#C9965A">'+eur(stayTotal)+'</td></tr>'
    + '<tr class="total-row" style="border-top-color:#C9965A"><td colspan="4"><strong>Total voyage estim\u00E9 (tout compris)</strong></td><td class="price" style="color:#C9965A;font-size:1.05rem;white-space:nowrap"><strong>'+eur(it.budgetTotal)+'</strong></td></tr>'
    + '</table></section>';

  /* ── PDF : fond ivoire clair, encre sombre, accents thématiques ── */
  /* On garde bgTheme uniquement pour les nuances d'accent panel (timeline, légende)
     mais le fond global devient ivoire premium, imprimable */
  const PDF_THEME = {
    bg:      '#F8F4EC',   /* ivoire chaud — imprimable */
    surface: '#FFFFFF',   /* blanc pur pour les cards */
    panel:   '#F1EBE0',   /* ivoire légèrement plus sombre pour timeline/légende */
    ink:     '#1A1610',   /* encre profonde */
    sub:     '#7A6E62',   /* gris chaud */
    line:    'rgba(26,22,16,0.10)',
    line2:   'rgba(26,22,16,0.05)',
  };

  const html = '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
    + '<title>'+esc(it.dest)+' \u2014 Hic Sunt</title>'
    + '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    + '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;1,300;1,500&family=Epilogue:wght@200;300;400;500&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{margin:0;padding:0;box-sizing:border-box}'
    + 'html{scroll-behavior:smooth}'
    + 'body{background:'+PDF_THEME.bg+';color:'+PDF_THEME.ink+';font-family:Epilogue,sans-serif;font-weight:300;line-height:1.7;-webkit-font-smoothing:antialiased}'
    + '.close-btn{position:fixed;top:18px;right:18px;width:38px;height:38px;border-radius:50%;background:'+PDF_THEME.ink+';color:'+PDF_THEME.bg+';border:none;font-size:18px;font-family:Epilogue,sans-serif;cursor:pointer;z-index:99;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.18)}'
    /* ── Hero : fond ivoire avec gradient de couleur thématique très léger ── */
    + '.hero{padding:4.5rem 2.5rem 3rem;position:relative;overflow:hidden;border-bottom:'+PDF_THEME.dividerStyle+'}'
    + '.hero-bg{position:absolute;inset:0;background:'+PDF_THEME.heroBgStyle+'}'
    + '.hero-eyebrow{font-size:.6rem;letter-spacing:.4em;text-transform:uppercase;color:'+sigColor+';margin-bottom:1.2rem;position:relative;z-index:2}'
    + '.hero h1{font-family:Fraunces,serif;font-weight:'+PDF_THEME.heroWeight+';font-size:'+PDF_THEME.heroSize+';line-height:1;margin-bottom:1.4rem;position:relative;z-index:2;color:'+PDF_THEME.ink+'}'
    + '.hero h1 em{font-style:italic;color:'+sigColor+'}'
    + '.hero-pills{display:flex;flex-wrap:wrap;gap:.5rem;position:relative;z-index:2;margin-bottom:1.2rem}'
    + '.pill{font-size:.62rem;letter-spacing:.08em;padding:.3rem .85rem;border-radius:20px;border:1px solid;font-weight:400}'
    + '.hero-meta{font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;color:'+PDF_THEME.sub+';position:relative;z-index:2}'
    + '.hero-tag{font-family:Fraunces,serif;font-style:italic;font-size:1rem;color:'+PDF_THEME.sub+';margin-bottom:1rem;position:relative;z-index:2}'
    /* ── Timeline ── */
    + '.timeline-wrap{background:'+PDF_THEME.panel+';border-top:1px solid '+PDF_THEME.line+';border-bottom:1px solid '+PDF_THEME.line+';padding:1.6rem 1.5rem;overflow-x:auto}'
    + '.tl-label{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:'+PDF_THEME.sub+';margin-bottom:1.2rem}'
    + '.timeline{display:flex;gap:1.4rem;width:max-content}'
    + '.tl-stop{flex:none;min-width:88px;position:relative;padding-top:18px}'
    + '.tl-stop::before{content:"";position:absolute;top:6px;left:-16px;right:-16px;height:1px;background:'+PDF_THEME.line+'}'
    + '.tl-stop.start::before{left:6px}.tl-stop.end::before{right:6px}'
    + '.tl-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--c);background:'+PDF_THEME.bg+';position:absolute;top:0;left:0}'
    + '.tl-city{font-family:Fraunces,serif;font-size:.78rem;color:'+PDF_THEME.ink+';white-space:nowrap;margin-bottom:.1rem}'
    + '.tl-dates{font-size:.54rem;color:var(--c);letter-spacing:.06em;white-space:nowrap}'
    + '.tl-nights{font-size:.5rem;color:'+PDF_THEME.sub+';white-space:nowrap}'
    /* ── Légende catégories ── */
    + '.legend-bar{background:'+PDF_THEME.panel+';border-bottom:1px solid '+PDF_THEME.line+';padding:1rem 2.5rem;display:flex;flex-wrap:wrap;gap:1.1rem}'
    + '.legend-item{display:flex;align-items:center;gap:.4rem;font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;color:'+PDF_THEME.sub+'}'
    + '.legend-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}'
    /* ── Sections jours ── */
    + '.leg-section{padding:2.6rem 2.5rem;border-bottom:1px solid '+PDF_THEME.line+'}'
    + '.leg-head{display:flex;gap:1.2rem;align-items:flex-start;margin-bottom:1.6rem}'
    + '.leg-num{font-family:Fraunces,serif;font-size:2.6rem;font-weight:300;color:var(--c);opacity:.25;line-height:1;flex-shrink:0}'
    + '.leg-tag{font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;color:var(--c);margin-bottom:.25rem}'
    + '.leg-name{font-family:Fraunces,serif;font-size:1.5rem;font-weight:300;color:'+PDF_THEME.ink+';line-height:1.15;margin-bottom:.25rem}'
    + '.leg-hook{font-family:Fraunces,serif;font-style:italic;font-size:.82rem;color:'+PDF_THEME.sub+'}'
    /* ── Cards hébergement/restaurant ── */
    + '.cards{display:grid;gap:.7rem;margin-bottom:1.6rem}'
    + '@media(min-width:640px){.cards{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}}'
    + '.card{border-radius:8px;padding:1rem 1.1rem;border:1px solid var(--b);background:var(--bg)}'
    + '.card-label{font-size:.55rem;letter-spacing:.25em;text-transform:uppercase;font-weight:500;color:var(--c);margin-bottom:.5rem}'
    + '.card-name{font-family:Fraunces,serif;font-size:.95rem;font-weight:300;color:'+PDF_THEME.ink+';margin-bottom:.3rem;line-height:1.3}'
    + '.card-desc{font-size:.74rem;color:'+PDF_THEME.sub+';line-height:1.6}'
    + '.card-note{margin-top:.4rem;font-size:.68rem;color:'+PDF_THEME.sub+';opacity:.7;font-style:italic}'
    + '.card-price{margin-top:.4rem;font-size:.68rem;font-weight:500}'
    /* ── Jours individuels ── */
    + '.day{margin-bottom:1.1rem;page-break-inside:avoid;background:'+PDF_THEME.surface+';border:1px solid '+PDF_THEME.line+';border-radius:6px;padding:1rem 1.2rem}'
    + '.day:last-child{margin-bottom:0}'
    + '.day-head{display:flex;gap:.9rem;align-items:flex-start;margin-bottom:.5rem}'
    + '.day-num{font-family:Fraunces,serif;font-size:1.5rem;font-weight:300;line-height:1;min-width:38px}'
    + '.day-head h3{font-family:Fraunces,serif;font-weight:300;font-size:1rem;color:'+PDF_THEME.ink+';margin-bottom:.1rem}'
    + '.day-loc{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:'+PDF_THEME.sub+'}'
    + '.moments{margin-left:50px;border-left:1px solid '+PDF_THEME.line+';padding-left:16px}'
    + '.moment{display:flex;align-items:flex-start;gap:10px;padding:5px 0;font-size:.78rem}'
    + '.mo-time{font-size:.62rem;letter-spacing:.06em;color:'+PDF_THEME.sub+';min-width:38px;padding-top:1px}'
    + '.mo-glyph{font-size:.78rem;line-height:1.5;min-width:12px}'
    + '.mo-text{display:flex;flex-direction:column;gap:1px}'
    + '.mo-title{color:'+PDF_THEME.ink+'}'
    + '.mo-detail{color:'+PDF_THEME.sub+';font-size:.68rem}'
    + '.day-tip{margin:.6rem 0 0 50px;font-size:.7rem;font-style:italic;color:var(--c);opacity:.85}'
    /* ── Essentiels / budget ── */
    + '.essentials p{font-size:.78rem;margin-bottom:.5rem;display:flex;gap:.5rem;color:'+PDF_THEME.ink+'}'
    + '.essentials p span{color:'+sigColor+';font-weight:500;text-transform:uppercase;letter-spacing:.08em;font-size:.62rem;min-width:90px;flex-shrink:0}'
    + 'table{width:100%;border-collapse:collapse}'
    + 'th{text-align:left;font-size:.55rem;letter-spacing:.25em;text-transform:uppercase;color:'+sigColor+';font-weight:400;padding:.5rem .6rem;border-bottom:1px solid '+PDF_THEME.line+'}'
    + 'td{padding:.6rem .6rem;font-size:.74rem;color:'+PDF_THEME.sub+';border-bottom:1px solid '+PDF_THEME.line2+'}'
    + 'td.city{color:'+PDF_THEME.ink+'}'
    + 'td.price{color:'+PDF_THEME.ink+';font-weight:500}'
    + '.total-row td{border-top:1px solid '+hexA(sigColor,0.3)+';color:'+PDF_THEME.ink+';font-weight:500;padding-top:1rem}'
    /* ── Footer ── */
    + '.foot{padding:2.6rem 2.5rem;text-align:center;border-top:1px solid '+PDF_THEME.line+'}'
    + '.foot h3{font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:1.5rem;color:'+sigColor+';margin-bottom:.4rem}'
    + '.foot p{font-size:.6rem;color:'+PDF_THEME.sub+';letter-spacing:.2em;text-transform:uppercase}'
    + '.foot-line{width:32px;height:1px;background:'+sigColor+';opacity:.3;margin:.8rem auto}'
    + '@media print{body{background:#fff}}'
    + '@media(min-width:640px){.hero,.timeline-wrap,.legend-bar,.leg-section,.foot{padding-left:4rem;padding-right:4rem}}'
    + '</style></head><body>'
    + '<section class="hero"><div class="hero-bg"></div>'
    + '<div class="hero-eyebrow">Itin\u00E9raire compos\u00E9 \u00B7 Hic Sunt \u00B7 '+esc(it.country||it.dest)+'</div>'
    + '<h1>'+esc(it.dest)+'</h1>'
    + '<div class="hero-tag">'+esc(it.tag)+'</div>'
    + '<div class="hero-pills">'
    + '<span class="pill" style="color:'+sigColor+';border-color:'+hexA(sigColor,0.3)+'">'+esc(it.dates)+'</span>'
    + '<span class="pill" style="color:'+(palette.beach||sigColor2)+';border-color:'+hexA(palette.beach||sigColor2,0.3)+'">'+it.days+' jours</span>'
    + '<span class="pill" style="color:'+(palette.food||sigColor2)+';border-color:'+hexA(palette.food||sigColor2,0.3)+'">'+esc(it.level)+'</span>'
    + '<span class="pill" style="color:'+PDF_THEME.sub+';border-color:'+PDF_THEME.line+'">'+travelerLabel()+'</span>'
    + '</div>'
    + '<div class="hero-meta">'+esc(it.coords||'')+(it.season?' \u00B7 '+esc(it.season):'')+'</div>'
    + '</section>'
    + '<div class="timeline-wrap"><div class="tl-label">Circuit complet</div><div class="timeline">'+timelineHTML+'</div></div>'
    + '<div class="legend-bar">'+legendHTML+'</div>'
    + sectionHTML
    + gemsHTML
    + essentialsHTML
    + budgetHTML
    + '<div class="foot"><h3>Beau voyage \u2728</h3><div class="foot-line"></div>'
    + '<p>'+esc(it.dest)+' \u00B7 '+esc(it.dates)+' \u00B7 Hic Sunt \u00B7 Beyond the Known</p></div>'
    + '</body></html>';


  /* ── Overlay PDF ── */
  const pdfOverlay = document.createElement('div');
  pdfOverlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#F8F4EC;overflow:hidden';
  pdfOverlay.setAttribute('data-pdf-ov','');

  const pdfIframe = document.createElement('iframe');
  pdfIframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none';
  pdfIframe.srcdoc = html;

  /* Deux boutons flottants discrets — coin haut droit */
  const top = document.createElement('div');
  const safePad = 'calc(16px + env(safe-area-inset-top,0px))';
  top.style.cssText = 'position:absolute;top:'+safePad+';right:16px;z-index:10;display:flex;align-items:center;gap:8px';

  function mkBtn(content, action){
    const b = document.createElement('button');
    b.innerHTML = content;
    b.style.cssText = [
      'width:36px','height:36px',
      'border-radius:50%',
      'background:rgba(26,22,16,0.55)',
      'backdrop-filter:blur(12px)',
      '-webkit-backdrop-filter:blur(12px)',
      'color:white','border:none',
      'display:flex','align-items:center','justify-content:center',
      'cursor:pointer',
      '-webkit-tap-highlight-color:transparent',
      'font-size:15px',
    ].join(';');
    b.addEventListener('touchend', function(e){ e.preventDefault(); action(); });
    b.addEventListener('click', action);
    return b;
  }

  function doPrint(){
    var w = window.open('', '_blank');
    if(w){ w.document.write(html); w.document.close(); setTimeout(function(){ w.print(); }, 600); }
    else {
      try{
        var blob = new Blob([html],{type:'text/html'});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href=url; a.download=(it.dest||'itineraire').replace(/\s+/g,'-').toLowerCase()+'-hicsunt.html';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function(){ URL.revokeObjectURL(url); },1000);
      }catch(e){ pdfIframe.contentWindow.print(); }
    }
  }

  /* ↓ icône télécharger SVG */
  const dlIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 2v8M5 7l3 3 3-3M3 13h10"/></svg>';
  /* ✕ croix */
  const closeIcon = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>';

  top.appendChild(mkBtn(dlIcon, doPrint));
  top.appendChild(mkBtn(closeIcon, function(){ pdfOverlay.remove(); }));

  pdfOverlay.appendChild(pdfIframe);
  pdfOverlay.appendChild(top);
  document.body.appendChild(pdfOverlay);
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
  return statusBar() + navbar('Partager le voyage')
    + '<div class="ov-scroll px">'
    +   '<span class="eyebrow" style="display:block;margin-top:10px">' + esc(it.dest) + ' · ' + it.days + ' jours</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:28px;letter-spacing:-0.4px;margin-top:8px">Partager ce voyage</h1>'
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
