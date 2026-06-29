/* ── HIC SUNT · Sillage — écrans détail ─────────────────────────────── */

/* ── Carte géographique — redéfinition forcée (remplace features.js) ── */
var GEO_SHAPES_SD = {
  'france':{vb:'0 0 280 200',path:'M4.1,60.7 L66.4,56.2 L143.1,6.7 L155.6,2.2 L170.1,11.2 L248.9,38.2 L273.8,53.9 L259.3,83.1 L244.7,110.1 L248.9,150.6 L238.5,173.0 L217.8,184.3 L186.7,173.0 L165.9,195.5 L134.8,188.8 L66.4,173.0 L66.4,150.6 L51.9,116.9 L10.4,83.1 L4.1,60.7Z',cities:{'Paris':[152.4,52.8],'Lyon':[203.9,122.5],'Marseille':[215.1,177.5],'Bordeaux':[91.7,142.9],'Toulouse':[133.6,170.8],'Nice':[254.5,168.5],'Nantes':[71.6,89.4],'Strasbourg':[264.4,58.9],'Lille':[167.2,12.8],'Biarritz':[71.6,173.5],'Brest':[10.6,63.1],'Montpellier':[184.2,170.6],'Annecy':[230.8,119.1],'Avignon':[203.5,162.9],'Saint-Malo':[61.6,57.3],'Carcassonne':[152.4,179.6],'Chamonix':[246.2,118.7],'Colmar':[256.4,70.1],'Versailles':[147.9,53.9],'Loire':[114.1,85.4],'Dordogne':[114.1,141.6],'Aix-en-Provence':[216.7,172.4],'Normandie':[93.3,47.2],'Bretagne':[31.1,67.4],'Côte d\'Azur':[248.9,171.9],'Alsace':[259.3,62.9],'Périgord':[120.3,137.1]}},
  'espagne':{vb:'0 0 280 200',path:'M10.0,9.6 L30.0,4.8 L110.0,9.6 L154.0,19.3 L200.0,33.7 L250.0,41.0 L256.0,65.1 L230.0,89.2 L194.0,113.3 L180.0,149.4 L200.0,161.4 L210.0,149.4 L190.0,137.3 L170.0,168.7 L160.0,178.3 L140.0,180.7 L90.0,197.6 L60.0,173.5 L40.0,168.7 L10.0,137.3 L0.0,113.3 L20.0,57.8 L30.0,16.9 L10.0,9.6Z',cities:{'Madrid':[116.0,91.1],'Barcelone':[233.0,67.7],'Séville':[70.2,164.1],'Valence':[182.4,114.0],'Bilbao':[131.4,22.7],'Grenade':[118.2,169.2],'Málaga':[101.6,180.2],'Saragosse':[172.4,61.4],'Tolède':[109.4,104.6],'Cordoue':[94.4,152.0],'Saint-Jacques':[19.2,31.8],'Salamanque':[76.8,78.1],'San Sebastián':[150.4,21.2],'Alicante':[180.4,141.0],'Cadix':[64.2,184.8],'Ronda':[86.6,179.5],'Pampelune':[157.2,33.5],'Majorque':[243.0,111.6],'Ibiza':[218.6,127.5],'Tarragone':[215.0,74.2]}},
  'italie':{vb:'0 0 200 260',path:'M2.1,71.1 L21.1,80.9 L42.1,76.0 L52.6,63.8 L63.2,71.1 L126.3,76.0 L157.9,137.4 L189.5,174.2 L200.0,210.9 L189.5,235.5 L183.2,247.7 L193.7,235.5 L210.5,218.3 L216.8,198.7 L210.5,186.4 L200.0,174.2 L189.5,161.9 L168.4,154.5 L157.9,161.9 L178.9,198.7 L189.5,223.2 L178.9,235.5 L157.9,242.8 L136.8,235.5 L126.3,228.1 L115.8,210.9 L105.3,210.9 L94.7,223.2 L84.2,210.9 L90.5,186.4 L63.2,149.6 L42.1,125.1 L21.1,100.6 L2.1,71.1Z M124.2,218.3 L147.4,215.8 L168.4,223.2 L178.9,230.6 L185.3,225.7 L183.2,215.8 L157.9,210.9 L136.8,230.6 L124.2,218.3Z M35.8,144.7 L63.2,137.4 L69.5,154.5 L63.2,174.2 L52.6,193.8 L42.1,203.6 L31.6,198.7 L27.4,174.2 L35.8,144.7Z',cities:{'Rome':[126.3,127.5],'Milan':[56.8,40.0],'Venise':[122.7,40.7],'Florence':[100.0,81.7],'Naples':[163.6,153.3],'Turin':[24.8,49.8],'Bologne':[101.9,64.0],'Gênes':[51.2,66.0],'Bari':[218.3,146.7],'Palerme':[144.4,220.3],'Amalfi':[170.5,158.7],'Positano':[168.0,158.7],'Capri':[162.9,160.7],'Pompéi':[168.2,155.8],'Cinque Terre':[67.8,73.1],'Toscane':[94.7,88.3],'Sienne':[101.7,92.7],'Vérone':[94.5,41.0],'Pise':[82.1,82.9],'Côte Amalfitaine':[170.5,158.2],'Assise':[128.8,98.8],'Taormine':[185.1,226.9],'Pouilles':[210.5,161.9],'Côme':[54.3,31.6],'Alberobello':[226.1,154.8],'Matera':[212.6,157.7]}},
  'grece':{vb:'0 0 260 200',path:'M16.3,11.3 L43.3,2.8 L70.4,11.3 L97.5,16.9 L124.6,11.3 L151.7,25.4 L192.3,19.7 L178.8,39.4 L138.1,53.5 L97.5,39.4 L70.4,31.0 L43.3,39.4 L29.8,67.6 L16.3,87.3 L29.8,123.9 L56.9,138.0 L70.4,129.6 L84.0,143.7 L56.9,152.1 L84.0,152.1 L97.5,138.0 L84.0,123.9 L56.9,95.8 L29.8,95.8 L16.3,67.6 L16.3,11.3Z M111.0,177.5 L138.1,183.1 L165.2,185.9 L178.8,180.3 L151.7,174.6 L124.6,171.8 L111.0,177.5Z M159.8,154.9 L165.2,157.7 L165.2,152.1 L159.8,154.9Z M227.5,154.9 L238.3,160.6 L241.0,152.1 L232.9,146.5 L227.5,154.9Z M8.1,59.2 L16.3,64.8 L19.0,56.3 L13.5,50.7 L8.1,59.2Z',cities:{'Athènes':[117.3,110.4],'Thessalonique':[95.9,35.5],'Santorin':[163.3,155.2],'Mykonos':[160.6,125.4],'Corfou':[14.1,64.2],'Rhodes':[239.1,154.1],'Héraklion':[155.5,184.8],'Météores':[60.4,61.4],'Delphes':[84.0,96.3],'Olympie':[60.4,120.0],'Nauplie':[92.1,122.0],'Sparte':[82.1,136.1],'Paros':[155.7,135.8],'Naxos':[161.7,135.2],'Zakynthos':[40.6,116.1],'Kos':[214.0,141.1],'Kavala':[135.7,25.4],'Ioannina':[39.3,62.8]}},
  'japon':{vb:'0 0 280 260',path:'M38.9,177.6 L62.2,158.5 L85.6,152.2 L93.3,139.5 L108.9,135.7 L124.4,126.8 L140.0,114.1 L155.6,101.5 L178.9,88.8 L194.4,76.1 L210.0,63.4 L205.3,50.7 L194.4,44.4 L178.9,50.7 L171.1,63.4 L163.3,76.1 L147.8,88.8 L132.2,101.5 L116.7,114.1 L101.1,126.8 L85.6,139.5 L70.0,152.2 L54.4,164.9 L38.9,177.6Z M194.4,38.0 L210.0,31.7 L233.3,19.0 L256.7,12.7 L264.4,25.4 L248.9,31.7 L233.3,25.4 L217.8,31.7 L210.0,38.0 L194.4,38.0Z M23.3,183.9 L38.9,177.6 L54.4,164.9 L46.7,152.2 L31.1,152.2 L23.3,164.9 L23.3,183.9Z M70.0,152.2 L85.6,154.7 L101.1,152.2 L93.3,145.9 L77.8,145.9 L70.0,152.2Z M-7.8,241.0 L7.8,243.5 L4.7,238.4 L-7.8,241.0Z',cities:{'Tokyo':[181.8,124.4],'Kyoto':[120.9,132.9],'Osaka':[116.7,137.1],'Hiroshima':[69.4,140.8],'Sapporo':[207.7,30.9],'Nara':[121.8,137.2],'Fukuoka':[37.3,151.1],'Nagasaki':[29.2,161.7],'Kanazawa':[134.2,113.0],'Nikko':[180.8,111.0],'Hakone':[170.8,130.3],'Takayama':[143.9,118.6],'Nagoya':[138.4,130.9],'Kobe':[111.7,137.1],'Sendai':[200.2,91.7],'Kamakura':[179.7,129.1],'Miyajima':[67.2,142.0],'Matsumoto':[155.1,117.4],'Okinawa':[-5.0,244.7],'Beppu':[54.4,155.0]}},
  'thaïlande':{vb:'0 0 160 300',path:'M5.2,39.9 L31.0,57.2 L69.7,39.9 L95.5,22.5 L108.4,5.2 L95.5,22.5 L121.3,13.9 L134.2,39.9 L147.1,57.2 L134.2,74.6 L108.4,91.9 L82.6,109.2 L56.8,126.6 L43.9,143.9 L56.8,161.3 L69.7,169.9 L82.6,161.3 L95.5,169.9 L147.1,161.3 L134.2,178.6 L108.4,187.3 L90.3,196.0 L82.6,213.3 L56.8,230.6 L43.9,248.0 L31.0,256.6 L18.1,265.3 L31.0,274.0 L43.9,265.3 L56.8,256.6 L69.7,248.0 L82.6,230.6 L69.7,213.3 L56.8,196.0 L43.9,178.6 L56.8,161.3 L82.6,143.9 L69.7,126.6 L56.8,109.2 L43.9,91.9 L31.0,74.6 L5.2,57.2 L5.2,39.9Z',cities:{'Bangkok':[83.1,156.9],'Chiang Mai':[43.6,69.5],'Chiang Rai':[65.3,50.3],'Phuket':[28.1,258.6],'Koh Samui':[71.2,230.1],'Ayutthaya':[84.6,146.5],'Pai':[29.4,59.7],'Krabi':[41.8,255.1],'Kanchanaburi':[58.1,152.1],'Sukhothai':[65.0,100.4],'Hua Hin':[68.6,177.4],'Koh Phangan':[71.2,226.5],'Koh Tao':[65.5,220.2],'Mae Hong Son':[17.3,60.7],'Lopburi':[86.5,138.7],'Chiang Dao':[43.6,59.0],'Udon Thani':[141.7,93.5]}},
  'maroc':{vb:'0 0 280 200',path:'M134.0,4.3 L151.2,4.3 L202.7,15.2 L245.6,26.1 L271.4,37.0 L280.0,58.7 L271.4,80.4 L262.8,102.2 L254.2,123.9 L245.6,145.7 L219.9,167.4 L194.1,189.1 L168.3,189.1 L134.0,178.3 L91.0,178.3 L82.5,167.4 L13.7,189.1 L5.2,156.5 L13.7,123.9 L56.7,102.2 L73.9,80.4 L91.0,58.7 L108.2,47.8 L116.8,26.1 L134.0,4.3Z',cities:{'Marrakech':[99.8,99.3],'Casablanca':[106.7,57.2],'Fès':[151.2,47.0],'Rabat':[119.6,48.5],'Tanger':[137.3,9.1],'Agadir':[72.1,125.4],'Essaouira':[69.2,102.0],'Chefchaouen':[146.5,22.4],'Ouarzazate':[118.7,114.8],'Merzouga':[168.2,110.9],'Aït Ben Haddou':[114.6,112.0],'Ifrane':[149.3,58.0],'Dakhla':[-36.6,272.0],'Tiznit':[69.9,141.3],'Taroudant':[84.5,124.6],'Gorges Dadès':[131.1,105.0],'Gorges Todra':[141.0,101.7],'El Jadida':[90.9,64.3],'Meknès':[141.5,50.0],'Safi':[78.5,84.8]}},
  'portugal':{vb:'0 0 140 260',path:'M4.1,9.6 L65.9,0.0 L107.1,9.6 L127.6,57.8 L107.1,105.9 L86.5,154.1 L107.1,178.1 L86.5,226.3 L45.3,250.4 L24.7,226.3 L4.1,178.1 L4.1,130.0 L4.1,81.9 L4.1,9.6Z',cities:{'Lisbonne':[18.9,167.6],'Porto':[40.4,50.6],'Faro':[68.8,249.4],'Évora':[69.6,174.8],'Coimbra':[48.2,95.8],'Braga':[48.2,31.3],'Sintra':[8.6,164.2],'Algarve':[65.9,245.6],'Nazaré':[29.2,125.2],'Óbidos':[18.1,136.7],'Tavira':[80.3,244.6],'Lagos':[38.3,245.6],'Setúbal':[28.8,177.2],'Douro':[86.5,48.1],'Alentejo':[70.0,202.2],'Guimarães':[53.9,36.6],'Aveiro':[39.1,75.1]}},
  'islande':{vb:'0 0 320 200',path:'M8.1,21.6 L75.9,5.4 L184.4,21.6 L306.4,48.6 L320.0,102.7 L292.9,156.8 L252.2,183.8 L211.5,194.6 L130.2,189.2 L75.9,167.6 L21.7,129.7 L8.1,75.7 L8.1,21.6Z',cities:{'Reykjavik':[75.9,149.7],'Akureyri':[182.0,65.9],'Vik':[157.8,188.1],'Jökulsárlón':[233.8,152.4],'Skaftafell':[212.1,157.8],'Kirkjufell':[40.7,105.9],'Snæfellsnes':[27.9,109.7],'Húsavík':[202.3,46.5],'Mývatn':[211.8,70.3],'Dettifoss':[228.3,58.9],'Þórsmörk':[143.5,174.1],'Geysir':[122.0,140.0],'Landmannalaugar':[155.4,157.8],'Blue Lagoon':[63.7,163.2],'Vestmannaeyjar':[122.8,187.0],'Gullfoss':[126.6,138.9]}},
  'perou':{vb:'0 0 220 280',path:'M8.1,86.7 L32.6,80.0 L65.2,73.3 L97.8,66.7 L105.9,53.3 L138.5,40.0 L163.0,26.7 L195.6,6.7 L211.9,33.3 L187.4,60.0 L187.4,86.7 L195.6,113.3 L163.0,140.0 L130.4,166.7 L105.9,193.3 L97.8,220.0 L114.1,246.7 L130.4,253.3 L138.5,233.3 L163.0,220.0 L195.6,226.7 L211.9,246.7 L211.9,266.7 L179.3,266.7 L114.1,240.0 L81.5,220.0 L48.9,140.0 L32.6,113.3 L8.1,86.7Z',cities:{'Lima':[80.8,194.0],'Cusco':[163.3,213.6],'Machu Picchu':[154.2,208.8],'Arequipa':[170.5,252.0],'Puno':[195.2,244.5],'Iquitos':[142.6,83.3],'Trujillo':[48.9,141.5],'Nazca':[115.2,231.1],'Huaraz':[72.8,160.4],'Paracas':[93.7,217.7],'Titicaca':[206.5,244.5],'Colca':[169.0,242.0],'Pisac':[165.4,212.3],'Ollantaytambo':[158.7,210.1],'Aguas Calientes':[154.3,208.7],'Chachapoyas':[67.3,116.4]}},
  'kenya':{vb:'0 0 240 220',path:'M5.9,11.2 L49.8,9.0 L93.7,11.2 L137.6,22.4 L181.5,33.7 L196.1,67.3 L210.7,101.0 L225.4,134.7 L196.1,157.1 L166.8,179.6 L137.6,202.0 L108.3,213.3 L64.4,202.0 L20.5,145.9 L2.9,101.0 L5.9,11.2Z',cities:{'Nairobi':[88.4,141.2],'Mombasa':[171.8,203.2],'Masai Mara':[39.5,145.9],'Amboseli':[101.0,171.7],'Tsavo':[137.6,179.6],'Samburu':[109.8,89.8],'Lamu':[207.8,163.2],'Malindi':[185.0,184.5],'Watamu':[182.3,187.4],'Nakuru':[66.4,118.3],'Kisumu':[28.1,114.5],'Eldoret':[43.0,100.6],'Diani':[168.9,209.4],'Mt Kenya':[102.7,108.9],'Nanyuki':[95.7,112.0],'Laikipia':[90.7,107.8],'Naivasha':[77.0,128.4]}},
  'jordanie':{vb:'0 0 180 200',path:'M46.0,22.7 L84.3,45.5 L141.7,68.2 L160.9,45.5 L180.0,90.9 L84.3,181.8 L65.1,204.5 L7.7,181.8 L7.7,136.4 L26.8,90.9 L26.8,45.5 L46.0,22.7Z',cities:{'Amman':[43.7,70.0],'Pétra':[24.5,144.1],'Wadi Rum':[23.7,178.6],'Aqaba':[7.7,180.5],'Jerash':[41.7,55.5],'Madaba':[37.9,80.9],'Kerak':[34.5,105.5],'Dana':[31.0,127.7],'Azraq':[77.4,76.4],'Mer Morte':[26.4,80.9],'Wadi Mujib':[28.7,93.6],'Umm Qais':[33.7,38.6]}},
  'sardaigne':{vb:'0 0 160 260',path:'M8.9,19.3 L97.8,-9.6 L151.1,38.5 L151.1,86.7 L124.4,134.8 L97.8,183.0 L124.4,231.1 L80.0,250.4 L35.6,240.7 L8.9,183.0 L35.6,134.8 L-8.9,86.7 L8.9,19.3Z',cities:{'Cagliari':[90.7,209.9],'Oristano':[43.6,144.4],'Nuoro':[109.3,104.0],'Sassari':[40.9,64.5],'Alghero':[19.6,80.9],'Olbia':[124.4,46.2],'Villasimius':[125.3,219.6],'Chia':[71.1,238.8],'Barumini':[80.0,163.7],'Bosa':[35.6,105.9],'Palau':[112.9,21.2],'La Maddalena':[116.4,18.3],'Costa Smeralda':[124.4,38.5],'Pula':[80.0,231.1],'Cala Gonone':[136.0,107.9],'Orgosolo':[111.1,116.5],'Porto Cervo':[128.9,27.0],'Carloforte':[17.8,217.6]}},
  'sicile':{vb:'0 0 300 220',path:'M8.8,44.0 L61.8,22.0 L105.9,33.0 L150.0,66.0 L194.1,44.0 L238.2,88.0 L264.7,77.0 L300.0,44.0 L255.9,11.0 L194.1,-22.0 L150.0,11.0 L105.9,99.0 L61.8,121.0 L17.6,99.0 L8.8,44.0Z M194.1,198.0 L238.2,209.0 L264.7,176.0 L220.6,165.0 L194.1,198.0Z',cities:{'Palerme':[93.5,52.8],'Catane':[246.2,119.9],'Messine':[286.8,45.1],'Agrigente':[112.9,140.8],'Siracuse':[263.8,168.3],'Trapani':[19.4,63.8],'Taormine':[263.8,82.5],'Raguse':[214.4,183.7],'Noto':[244.4,188.1],'Cefalù':[151.8,61.6],'Marsala':[11.5,88.0],'Modica':[217.9,191.4],'Érice':[25.6,69.3],'Piazza Armerina':[182.6,134.2]}},
  'corse':{vb:'0 0 160 260',path:'M12.3,27.4 L73.8,27.4 L135.4,82.1 L147.7,164.2 L135.4,232.6 L98.5,246.3 L49.2,246.3 L12.3,205.3 L12.3,136.8 L36.9,68.4 L12.3,27.4Z',cities:{'Ajaccio':[41.8,173.8],'Bastia':[129.2,68.4],'Bonifacio':[92.3,247.7],'Corte':[92.3,123.2],'Porto-Vecchio':[108.3,220.3],'Calvi':[44.3,86.2],'Porto':[36.9,127.3],'Propriano':[61.5,208.0],'Île Rousse':[66.5,78.0],'Sartène':[70.2,216.2]}},
  'malte':{vb:'0 0 200 160',path:'M33.3,80.0 L133.3,106.7 L166.7,160.0 L100.0,160.0 L33.3,106.7 L33.3,80.0Z M33.3,80.0 L0.0,53.3 L66.7,26.7 L133.3,53.3 L33.3,80.0Z',cities:{'La Valette':[136.7,133.3],'Mdina':[100.0,136.0],'Marsaxlokk':[146.7,149.3],'Gozo':[46.7,93.3],'Comino':[80.0,104.0],'Mellieħa':[86.7,117.3],'Birgu':[140.0,136.0]}},
  'sri_lanka':{vb:'0 0 180 260',path:'M15.0,12.1 L67.5,30.2 L105.0,90.7 L142.5,151.2 L165.0,211.6 L142.5,247.9 L105.0,272.1 L67.5,241.9 L15.0,211.6 L7.5,151.2 L30.0,90.7 L15.0,12.1Z',cities:{'Colombo':[19.5,185.6],'Kandy':[78.0,163.9],'Galle':[46.5,238.8],'Sigiriya':[87.0,123.3],'Ella':[108.7,189.3],'Trincomalee':[122.3,86.5],'Anuradhapura':[60.0,100.4],'Polonnaruwa':[105.0,124.6],'Jaffna':[30.8,20.6],'Mirissa':[65.3,244.9],'Tangalle':[90.0,240.7],'Negombo':[18.0,168.7],'Nuwara Eliya':[87.7,183.2],'Yala':[142.5,219.5],'Arugam Bay':[168.0,191.1],'Dambulla':[78.8,128.8],'Pinnawala':[58.5,163.3]}},
  'maldives':{vb:'0 0 100 260',path:'M40.0,6.4 L60.0,9.6 L50.0,12.8 L40.0,6.4Z M30.0,35.3 L50.0,38.5 L40.0,41.7 L30.0,35.3Z M20.0,70.6 L40.0,73.8 L30.0,77.0 L20.0,70.6Z M40.0,99.5 L60.0,102.7 L50.0,105.9 L40.0,99.5Z M50.0,128.4 L70.0,131.6 L60.0,134.8 L50.0,128.4Z M40.0,157.3 L60.0,160.5 L50.0,163.7 L40.0,157.3Z M30.0,186.2 L50.0,189.4 L40.0,192.6 L30.0,186.2Z M40.0,215.1 L60.0,218.3 L50.0,221.5 L40.0,215.1Z M50.0,244.0 L70.0,247.2 L60.0,250.4 L50.0,244.0Z',cities:{'Malé':[101.0,100.1],'Nord-Malé':[100.0,96.3],'Sud-Malé':[100.0,105.9],'Ari':[35.0,109.1],'Baa':[47.0,70.6],'Lhaviyani':[95.0,57.8],'Raa':[43.0,51.4],'Shaviyani':[60.0,38.5]}},
  'vietnam':{vb:'0 0 180 300',path:'M4.8,10.3 L28.8,10.3 L52.8,20.7 L64.8,41.4 L76.8,51.7 L88.8,62.1 L100.8,82.8 L112.8,103.4 L124.8,124.1 L124.8,144.8 L136.8,165.5 L148.8,175.9 L160.8,196.6 L172.8,217.2 L172.8,237.9 L160.8,258.6 L124.8,279.3 L100.8,300.0 L76.8,300.0 L64.8,279.3 L52.8,258.6 L52.8,237.9 L64.8,217.2 L64.8,196.6 L52.8,175.9 L28.8,165.5 L16.8,144.8 L28.8,124.1 L40.8,103.4 L28.8,72.4 L16.8,51.7 L4.8,31.0 L4.8,10.3Z',cities:{'Hanoï':[85.2,40.8],'Hô Chi Minh':[104.6,252.0],'Hôi An':[144.7,147.3],'Hué':[127.2,135.3],'Da Nang':[142.1,143.6],'Ha Long':[117.6,43.4],'Ninh Binh':[88.3,56.9],'Sapa':[37.0,13.7],'Dalat':[146.9,228.8],'Nha Trang':[165.4,222.6],'Phú Quốc':[39.8,264.4],'Mũi Né':[143.5,249.7],'Mékong':[76.8,269.0],'Hội An':[144.7,147.3],'Pleiku':[137.0,186.6],'Huế':[127.2,135.3],'Vũng Tàu':[114.5,261.7]}},
  'cambodge':{vb:'0 0 220 200',path:'M8.1,17.4 L48.9,8.7 L89.6,17.4 L130.4,39.1 L191.5,82.6 L211.9,126.1 L191.5,169.6 L150.7,213.0 L110.0,191.3 L69.3,169.6 L28.5,147.8 L8.1,104.3 L8.1,60.9 L8.1,17.4Z',cities:{'Phnom Penh':[106.7,145.2],'Siem Reap':[63.6,67.0],'Angkor Wat':[64.0,64.8],'Sihanoukville':[50.1,187.0],'Battambang':[36.7,78.3],'Kampot':[76.6,186.5],'Kep':[81.1,192.2],'Mondulkiri':[199.2,106.1],'Koh Rong':[38.3,181.7],'Tonlé Sap':[69.3,104.3],'Kratie':[151.6,104.8]}},
  'laos':{vb:'0 0 200 280',path:'M6.5,6.1 L38.7,6.1 L87.1,36.5 L135.5,67.0 L151.6,97.4 L135.5,127.8 L151.6,158.3 L167.7,188.7 L183.9,219.1 L183.9,249.6 L151.6,280.0 L119.4,264.8 L87.1,249.6 L71.0,219.1 L87.1,188.7 L87.1,158.3 L71.0,127.8 L54.8,97.4 L38.7,67.0 L22.6,36.5 L6.5,6.1Z',cities:{'Vientiane':[90.3,144.0],'Luang Prabang':[75.2,85.5],'Vang Vieng':[85.5,115.0],'Pakse':[193.2,230.7],'Si Phan Don':[193.5,258.7],'Phonsavan':[108.4,98.9],'Sam Neua':[137.1,69.4],'Huay Xai':[20.0,74.0],'Savannakhet':[160.3,186.6],'Nong Khiaw':[90.6,64.8]}},
  'mexique':{vb:'0 0 320 240',path:'M10.2,3.9 L30.5,36.3 L61.0,62.3 L81.3,114.2 L101.6,140.1 L121.9,159.6 L142.2,179.0 L162.5,185.5 L193.0,198.5 L213.3,217.9 L264.1,224.4 L284.4,217.9 L294.6,198.5 L304.8,185.5 L309.8,166.1 L314.9,146.6 L320.0,150.5 L314.9,159.6 L309.8,172.5 L299.7,185.5 L294.6,205.0 L279.4,224.4 L264.1,237.4 L238.7,217.9 L223.5,224.4 L243.8,205.0 L264.1,198.5 L284.4,192.0 L279.4,172.5 L264.1,159.6 L269.2,146.6 L279.4,146.6 L284.4,159.6 L274.3,172.5 L259.0,172.5 L248.9,185.5 L233.7,179.0 L213.3,166.1 L193.0,179.0 L172.7,172.5 L152.4,159.6 L132.1,153.1 L116.8,140.1 L101.6,114.2 L81.3,75.2 L61.0,49.3 L35.6,16.9 L10.2,3.9Z',cities:{'Mexico':[191.7,173.4],'Cancún':[316.1,151.0],'Oaxaca':[216.1,204.1],'San Cristóbal':[257.6,208.3],'Mérida':[288.3,153.5],'Guadalajara':[148.8,157.5],'Tulum':[310.2,163.3],'Guanajuato':[170.1,152.8],'Palenque':[264.3,198.7],'Puerto Vallarta':[129.8,158.1],'Chichen Itza':[299.0,157.2],'Teotihuacan':[194.6,170.1],'Taxco':[186.9,184.7],'Puebla':[201.1,178.4],'Monterrey':[179.6,92.5],'Loreto':[67.6,88.1],'Cabo':[82.3,128.6],'Morelia':[170.8,169.9],'Zacatecas':[157.0,130.1]}},
  'egypte':{vb:'0 0 260 240',path:'M5.0,7.3 L24.8,19.4 L111.4,19.4 L185.7,7.3 L235.2,43.6 L247.6,55.8 L235.2,92.1 L222.9,104.2 L260.0,99.4 L260.0,237.6 L210.5,237.6 L185.7,237.6 L12.4,237.6 L5.0,237.6 L5.0,7.3Z',cities:{'Le Caire':[166.9,42.2],'Assouan':[208.0,186.9],'Louxor':[201.6,147.9],'Alexandrie':[134.2,14.5],'Hurghada':[231.3,110.1],'Charm el-Cheikh':[243.4,94.3],'Siwa':[25.3,63.0],'Dahab':[247.9,80.2],'Abou Simbel':[176.3,229.3],'Gizeh':[164.2,44.4],'Karnak':[202.1,147.4],'Vallée des Rois':[200.6,146.9],'Memphis':[167.1,47.3],'Saqqara':[166.4,46.8]}},
  'turquie':{vb:'0 0 320 180',path:'M3.4,5.6 L37.4,19.7 L71.5,19.7 L105.5,5.6 L139.6,5.6 L173.6,5.6 L207.7,132.2 L241.7,104.1 L275.7,118.1 L309.8,75.9 L318.3,118.1 L309.8,146.2 L292.8,160.3 L258.7,174.4 L224.7,160.3 L190.6,146.2 L165.1,160.3 L139.6,146.2 L105.5,160.3 L71.5,146.2 L37.4,132.2 L11.9,118.1 L3.4,90.0 L3.4,5.6Z',cities:{'Istanbul':[54.1,33.5],'Cappadoce':[153.7,100.1],'Éphèse':[26.2,119.5],'Pamukkale':[56.5,120.1],'Antalya':[83.6,149.1],'Ankara':[120.2,63.8],'Göreme':[153.7,100.1],'Bodrum':[27.7,145.4],'Izmir':[22.8,106.3],'Trabzon':[237.1,33.8],'Kas':[65.4,168.7],'Side':[95.1,152.7],'Alanya':[105.5,159.2],'Fethiye':[56.5,156.9],'Ölüdeniz':[56.5,158.9],'Mardin':[254.1,137.2],'Doğubayazıt':[310.8,74.5],'Selçuk':[26.7,119.5],'Konya':[113.9,121.8],'Gaziantep':[197.1,144.6]}},
  'australie':{vb:'0 0 380 280',path:'M1.8,109.2 L20.3,90.2 L38.7,94.9 L57.2,99.7 L75.6,85.4 L94.1,61.7 L112.5,42.7 L149.4,38.0 L167.9,14.2 L177.1,4.7 L214.0,19.0 L232.4,14.2 L250.9,33.2 L269.3,4.7 L287.8,38.0 L301.6,56.9 L297.0,71.2 L315.4,80.7 L333.9,90.2 L343.1,109.2 L361.6,132.9 L375.4,161.4 L375.4,175.6 L361.6,204.1 L356.9,213.6 L343.1,237.3 L324.7,256.3 L315.4,265.8 L297.0,270.5 L273.9,265.8 L250.9,246.8 L237.0,232.5 L223.2,237.3 L209.4,232.5 L195.5,213.6 L177.1,204.1 L158.6,199.3 L140.2,208.8 L121.7,223.1 L103.3,218.3 L84.9,223.1 L57.2,218.3 L29.5,194.6 L15.7,175.6 L6.5,147.1 L1.8,128.1 L1.8,109.2Z',cities:{'Sydney':[354.3,221.8],'Melbourne':[296.6,259.2],'Brisbane':[371.0,161.1],'Perth':[28.2,203.6],'Adélaïde':[238.0,231.9],'Darwin':[166.4,18.6],'Cairns':[304.1,60.9],'Alice Springs':[194.4,125.3],'Uluru':[168.0,140.9],'Gold Coast':[374.7,166.3],'Hobart':[318.5,307.3],'Canberra':[335.1,235.2],'Kakadu':[181.7,23.7],'Great Barrier Reef':[306.2,71.2],'Blue Mountains':[346.0,220.3],'Whitsundays':[333.5,92.7]}},
  'costa_rica':{vb:'0 0 240 180',path:'M13.3,10.9 L106.7,21.8 L173.3,49.1 L240.0,103.6 L206.7,130.9 L173.3,158.2 L140.0,185.5 L73.3,158.2 L40.0,103.6 L6.7,76.4 L13.3,10.9Z',cities:{'San José':[134.0,80.2],'Manuel Antonio':[128.7,109.6],'Arenal':[93.3,51.3],'Monteverde':[85.3,58.9],'Tortuguero':[172.7,46.9],'Puerto Viejo':[223.3,94.9],'Jacó':[98.0,97.1],'Tamarindo':[17.3,60.0],'Nosara':[30.0,77.5],'Dominical':[149.3,116.7],'Liberia':[44.0,42.0],'Quepos':[129.3,107.5]}},
  'eoliennes':{vb:'0 0 250 160',path:'M136.4,101.8 L159.1,101.8 L181.8,130.9 L159.1,160.0 L136.4,130.9 L136.4,101.8Z M136.4,130.9 L159.1,160.0 L159.1,130.9 L136.4,130.9Z M113.6,72.7 L136.4,72.7 L136.4,101.8 L113.6,101.8 L113.6,72.7Z M204.5,14.5 L227.3,43.6 L204.5,43.6 L204.5,14.5Z M181.8,72.7 L181.8,43.6 L181.8,72.7Z',cities:{'Lipari':[150.0,110.5],'Vulcano':[152.3,130.9],'Stromboli':[209.1,17.5],'Salina':[129.5,84.4],'Panarea':[175.0,61.1],'Filicudi':[61.4,81.5],'Alicudi':[11.4,90.2]}},
  'polynesie':{vb:'0 0 320 180',path:'M216.5,129.4 L254.1,135.0 L272.9,157.5 L244.7,163.1 L216.5,151.9 L216.5,129.4Z M37.6,78.7 L47.1,84.4 L37.6,90.0 L28.2,84.4 L37.6,78.7Z M216.5,140.6 L207.1,146.3 L197.6,140.6 L207.1,135.0 L216.5,140.6Z',cities:{'Papeete':[248.5,142.9],'Bora Bora':[43.3,84.4],'Moorea':[223.1,142.9],'Raiatea':[75.3,97.3],'Huahine':[112.0,97.3],'Tikehau':[373.6,5.6]}},
  'indonesie':{vb:'0 0 400 150',path:'M2.6,4.4 L17.4,10.6 L30.4,19.4 L43.5,30.9 L56.5,44.1 L69.6,57.4 L82.6,70.6 L91.3,83.8 L95.7,97.1 L87.0,102.4 L73.9,99.7 L56.5,88.2 L43.5,75.0 L30.4,66.2 L17.4,57.4 L4.3,44.1 L0.0,30.9 L0.0,17.6 L2.6,4.4Z M87.0,105.0 L104.3,106.8 L121.7,110.3 L139.1,114.7 L156.5,117.4 L173.9,121.8 L178.3,124.4 L165.2,127.1 L147.8,124.4 L130.4,121.8 L113.0,118.2 L95.7,112.9 L87.0,105.0Z M117.4,39.7 L130.4,37.1 L147.8,39.7 L165.2,37.1 L182.6,35.3 L191.3,44.1 L195.7,57.4 L191.3,70.6 L178.3,83.8 L165.2,90.0 L147.8,88.2 L130.4,79.4 L117.4,61.8 L113.0,48.5 L117.4,39.7Z M217.4,48.5 L230.4,44.1 L239.1,52.9 L234.8,66.2 L226.1,79.4 L221.7,88.2 L226.1,97.1 L230.4,88.2 L234.8,79.4 L239.1,70.6 L234.8,88.2 L226.1,97.1 L217.4,92.6 L213.0,83.8 L208.7,79.4 L213.0,70.6 L217.4,61.8 L217.4,48.5Z M168.7,124.4 L173.9,123.5 L180.0,125.3 L180.0,129.7 L174.8,131.5 L169.6,130.6 L168.7,127.9 L168.7,124.4Z M180.9,125.3 L185.2,125.3 L187.0,127.9 L185.2,132.4 L180.9,131.5 L180.0,128.8 L180.9,125.3Z M187.0,126.2 L200.0,125.3 L213.0,130.6 L226.1,132.4 L234.8,136.8 L234.8,130.6 L221.7,127.9 L208.7,125.3 L195.7,123.5 L187.0,126.2Z M313.0,52.9 L330.4,61.8 L347.8,75.0 L365.2,83.8 L382.6,92.6 L395.7,101.5 L391.3,105.9 L373.9,114.7 L356.5,116.5 L339.1,110.3 L321.7,101.5 L313.0,88.2 L313.0,70.6 L313.0,52.9Z',cities:{'Jakarta':[102.6,107.6],'Yogyakarta':[133.9,121.8],'Surabaya':[153.9,117.4],'Bali':[175.7,127.1],'Ubud':[176.5,127.9],'Seminyak':[174.8,129.7],'Kuta':[175.7,129.7],'Lombok':[183.5,128.8],'Gili':[181.7,127.1],'Gili Islands':[181.7,127.1],'Labuan Bajo':[216.5,127.9],'Komodo':[213.0,128.8],'Flores':[226.1,130.6],'Sumbawa':[195.7,129.7],'Raja Ampat':[308.7,57.4],'Manado':[259.1,39.7],'Makassar':[212.2,97.9],'Medan':[32.2,21.2],'Banda Aceh':[2.6,4.4],'Padang':[47.0,60.9],'Amed':[179.1,126.2],'Nusa Penida':[178.3,130.6],'Balikpapan':[189.6,64.4],'Jayapura':[397.4,75.0],'Sorong':[315.7,60.9],'Canggu':[174.8,128.8],'Uluwatu':[174.8,130.6],'Sanur':[176.5,129.7]}},
  'majorque':{'vb':'0 0 280 160','path':'M4.7,86.9 L35.0,75.4 L65.3,64.0 L88.7,50.3 L114.3,38.9 L135.3,29.7 L151.7,22.9 L168.0,16.0 L186.7,11.4 L207.7,0.0 L214.7,16.0 L228.7,34.3 L238.0,52.6 L245.0,73.1 L256.7,91.4 L266.0,109.7 L273.0,155.4 L252.0,155.4 L214.7,153.1 L175.0,148.6 L140.0,144.0 L105.0,137.1 L74.7,130.3 L51.3,132.6 L28.0,118.9 L11.7,107.4 L0.0,93.7 L4.7,86.9Z','cities':{'Palma':[81.7,86.9],'Soller':[98.0,41.1],'Alcudia':[191.3,22.9],'Pollenca':[165.7,16.0],'Port de Pollenca':[182.0,9.1],'Manacor':[212.3,86.9],'Cala d\'Or':[217.0,132.6],'Platja des Trenc':[161.0,137.1],'Magaluf':[53.7,102.9],'Valldemossa':[74.7,54.9],'Deia':[81.7,45.7],'Cala Bona':[249.7,82.3],'Porto Cristo':[242.7,93.7],'Cala Millor':[252.0,82.3],'Cap Formentor':[207.7,0.0],'Andratx':[21.0,86.9]}},
  '_default':{vb:'0 0 120 120',path:'M60,8 C74,8 86,16 94,28 C102,40 104,56 100,70 C96,84 86,94 74,102 C62,110 46,112 34,106 C22,100 12,88 8,74 C4,60 6,44 14,32 C22,20 34,10 48,8 Z',cities:{}}
};

function _geoShapeSD(dest){
  var d=(dest||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  function g(k){return{key:k,g:GEO_SHAPES_SD[k]||GEO_SHAPES_SD._default};}
  if(/indonesie|indonesia|bali|lombok|java|sumatra|flores|komodo|sumbawa|sulawesi|raja ampat|gili|kalimantan|papua/.test(d))return g('indonesie');
  if(/sardaigne|cagliari|nuoro|sassari|alghero|olbia|oristano|bosa|palau|barumini|cala gonone|villasimius/.test(d))return g('sardaigne');
  if(/sicile|palerm|catane|agrigente|siracuse|taormine|messine|noto|raguse|cefalu|erice/.test(d))return g('sicile');
  if(/eolienn|lipari|stromboli|vulcano|salina|panarea|filicudi|alicudi/.test(d))return g('eoliennes');
  if(/corse|ajaccio|bastia|bonifacio|corte|porto vecchio|calvi/.test(d))return g('corse');
  if(/malte|valette|gozo|mdina|comino/.test(d))return g('malte');
  if(/sri lanka|colombo|kandy|galle|sigiriya|ella|trincomalee|anuradhapura|polonnaruwa|jaffna|mirissa|negombo|nuwara|yala|arugam/.test(d))return g('sri_lanka');
  if(/maldive|male|atoll|hulhule|maafushi|thulusdhoo|baa|ari|raa/.test(d))return g('maldives');
  if(/thai|bangkok|phuket|chiang mai|chiang rai|koh samui|koh phangan|koh tao|ayutthaya|pai|krabi|kanchanaburi|mae hong son|hua hin/.test(d))return g('thaïlande');
  if(/grece|athenes|santorin|mykonos|corfou|rhodes|crete|meteores|delphes|olympie|nauplie|sparte|paros|naxos|zakynthos|kos/.test(d))return g('grece');
  if(/japon|tokyo|kyoto|osaka|hiroshima|sapporo|fukuoka|nara|hakone|nikko|kanazawa|nagasaki|takayama|sendai|kamakura|miyajima|okinawa/.test(d))return g('japon');
  if(/maroc|marrakech|casablanca|fes|rabat|tanger|agadir|essaouira|chefchaouen|ouarzazate|merzouga|ait ben haddou|dades|todra|taroudant/.test(d))return g('maroc');
  if(/majorque|mallorca|palma de majorque|palma|soller|alcudia|pollenca|manacor|magaluf|valldemossa/.test(d))return g('majorque');
  if(/espagne|madrid|barcelone|seville|valence|bilbao|grenade|malaga|saragosse|tolede|cordoue|burgos|salamanque|san sebastian|alicante|majorque|ibiza|cadix|ronda|pampelune/.test(d))return g('espagne');
  if(/italie|rome|milan|venise|florence|naples|turin|bologne|genes|amalfi|positano|capri|pompei|cinque terre|toscane|ombrie|verone|pise|sienne|assise|pouilles|calabre|bari|come|alberobello|matera/.test(d))return g('italie');
  if(/portugal|lisbonne|porto|faro|evora|coimbra|braga|algarve|sintra|nazare|obidos|lagos|tavira|douro|aveiro|setubal/.test(d))return g('portugal');
  if(/islande|reykjavik|akureyri|vik|jokulsarlon|skaftafell|kirkjufell|snaefellsnes|husavik|myvatn|dettifoss|geysir|gullfoss|vestmannaeyjar/.test(d))return g('islande');
  if(/perou|lima|cusco|machu picchu|arequipa|puno|iquitos|trujillo|nazca|huaraz|paracas|titicaca|colca|chachapoyas/.test(d))return g('perou');
  if(/kenya|nairobi|mombasa|masai mara|amboseli|tsavo|samburu|lamu|malindi|nakuru|kisumu|diani|mt kenya|nanyuki|laikipia|naivasha/.test(d))return g('kenya');
  if(/jordanie|amman|petra|wadi rum|aqaba|jerash|madaba|kerak|dana|mer morte/.test(d))return g('jordanie');
  if(/france|paris|lyon|marseille|bordeaux|toulouse|nice|nantes|strasbourg|lille|biarritz|brest|montpellier|annecy|avignon|saint-malo|carcassonne|aix|colmar|chamonix|versailles|loire|dordogne|provence|alsace|bretagne|normandie|perigord|cote d azur/.test(d))return g('france');
  if(/vietnam|hanoi|ho chi minh|hoi an|hue|da nang|ha long|ninh binh|sapa|dalat|nha trang|phu quoc|mui ne|mekong|vung tau|pleiku/.test(d))return g('vietnam');
  if(/mexique|mexico|cancun|oaxaca|san cristobal|merida|guadalajara|tulum|guanajuato|palenque|puerto vallarta|chichen itza|teotihuacan|taxco|puebla|cabo|morelia|zacatecas/.test(d))return g('mexique');
  if(/egypte|le caire|assouan|louxor|alexandrie|hurghada|charm el cheikh|siwa|dahab|abou simbel|gizeh|karnak|memphis|saqqara/.test(d))return g('egypte');
  if(/turquie|istanbul|cappadoce|ephese|pamukkale|antalya|ankara|goreme|bodrum|izmir|trabzon|kas|fethiye|olüdeniz|mardin|selcuk|konya|gaziantep/.test(d))return g('turquie');
  if(/cambodge|phnom penh|siem reap|angkor|sihanoukville|battambang|kampot|koh rong|kratie/.test(d))return g('cambodge');
  if(/laos|vientiane|luang prabang|vang vieng|pakse|si phan don|huay xai|savannakhet|phonsavan|nong khiaw/.test(d))return g('laos');
  if(/australie|sydney|melbourne|brisbane|perth|adelaide|darwin|cairns|alice springs|uluru|gold coast|hobart|canberra|kakadu/.test(d))return g('australie');
  if(/costa rica|san jose|manuel antonio|arenal|monteverde|tortuguero|jacó|tamarindo|nosara|dominical|liberia|quepos/.test(d))return g('costa_rica');
  if(/polynesie|tahiti|bora bora|moorea|raiatea|papeete|tikehau|huahine/.test(d))return g('polynesie');
  return g('_default');
}
function _sdMatchCity(loc,cities){
  var parts=(loc||'').split(/[\/\-,]/);
  for(var ci in cities){var cl=ci.toLowerCase();for(var pi=0;pi<parts.length;pi++){var tok=parts[pi].trim().toLowerCase();if(tok.length>=3&&(cl===tok||cl.includes(tok)||tok.includes(cl)))return cities[ci];}}
  return null;
}
function _sdCityPts(plan,geo){
  var vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number);
  var vbW=vbParts[2],vbH=vbParts[3],cities=geo.g.cities||{};
  var matched=plan.map(function(p){return _sdMatchCity(p.loc||'',cities);});
  var fbTotal=matched.filter(function(m){return !m;}).length;
  var fbIdx=0;
  return plan.map(function(p,i){
    var m=matched[i];
    if(m)return{vx:m[0],vy:m[1],n:i+1,loc:p.loc};
    /* Pas de match — distribuer en ligne dans le tiers central du viewBox */
    var t=fbTotal>1?(fbIdx/(fbTotal-1)):0.5;
    fbIdx++;
    return{
      vx:vbW*0.15+t*vbW*0.7,
      vy:vbH*0.35+Math.sin(t*Math.PI)*vbH*0.15,
      n:i+1,loc:p.loc
    };
  });
}
function geoMapSVG(W,H,activeIdx){
  var it=ITINERARY,dest=it.dest||it.destination||'';
  var geo=_geoShapeSD(dest);
  var vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number),vbW=vbParts[2],vbH=vbParts[3];
  var accent=(it.palette&&(it.palette.culture||it.palette.beach))||'#C9A96E';
  var pts=_sdCityPts(it.plan||[],geo);
  var scale=Math.min(W/vbW,H/vbH)*0.88,offX=(W-vbW*scale)/2,offY=(H-vbH*scale)/2;
  var rp='';
  if(pts.length>1){
    rp='M'+pts[0].vx.toFixed(1)+' '+pts[0].vy.toFixed(1);
    for(var ri=1;ri<pts.length;ri++){
      var mx=((pts[ri-1].vx+pts[ri].vx)/2).toFixed(1),my=((pts[ri-1].vy+pts[ri].vy)/2).toFixed(1);
      rp+=' Q'+pts[ri-1].vx.toFixed(1)+' '+pts[ri-1].vy.toFixed(1)+' '+mx+' '+my+' T'+pts[ri].vx.toFixed(1)+' '+pts[ri].vy.toFixed(1);
    }
  }
  var pinR=7/scale,pinRon=10/scale,fs=6/scale,fson=8/scale;
  var pins=pts.map(function(p,i){
    var on=activeIdx===i,r=on?pinRon:pinR;
    return '<g class="mpin'+(on?' on':'')+'"'+(activeIdx!==null?' onclick="mapSelect('+i+')"':'')+' style="animation:none">'
      +'<circle cx="'+p.vx.toFixed(1)+'" cy="'+p.vy.toFixed(1)+'" r="'+r.toFixed(1)+'" style="animation:none"/>'
      +'<text x="'+p.vx.toFixed(1)+'" y="'+(p.vy+r*0.38).toFixed(1)+'" font-size="'+(on?fson:fs).toFixed(1)+'">'+p.n+'</text></g>';
  }).join('');
  return '<svg class="map-svg" viewBox="0 0 '+W+' '+H+'" fill="none" style="animation:none">'
    +'<rect width="'+W+'" height="'+H+'" fill="rgba(246,240,228,0.02)" rx="10" style="animation:none"/>'
    +'<g transform="translate('+offX.toFixed(1)+','+offY.toFixed(1)+') scale('+scale.toFixed(4)+')" style="animation:none">'
    +'<path d="'+geo.g.path+'" fill="'+hexA(accent,0.10)+'" stroke="'+hexA(accent,0.60)+'" stroke-width="'+(1.2/scale).toFixed(2)+'" stroke-linejoin="round" style="animation:none"/>'
    +(rp?'<path d="'+rp+'" stroke="'+hexA(accent,0.85)+'" stroke-width="'+(1.5/scale).toFixed(2)+'" stroke-dasharray="'+(4/scale).toFixed(1)+' '+(3/scale).toFixed(1)+'" fill="none" style="animation:none"/>':'')
    +pins+'</g></svg>';
}
function mapView(){
  var i=state.mapDay||0,p=(ITINERARY.plan||[])[i];
  var dest=ITINERARY.dest||ITINERARY.destination||'';
  var geo=_geoShapeSD(dest);
  var vbParts=(geo.g.vb||'0 0 100 100').split(' ').map(Number),vbW=vbParts[2],vbH=vbParts[3];
  var W=345,H=420,scale=Math.min(W/vbW,H/vbH)*0.88;
  var offX=(W-vbW*scale)/2,offY=(H-vbH*scale)/2;
  var pts=_sdCityPts(ITINERARY.plan||[],geo),pin=pts[i]||{vx:vbW/2,vy:vbH/2};
  var pCx=offX+pin.vx*scale,pCy=offY+pin.vy*scale;
  var popL=Math.max(4,Math.min(pCx/W*100-20,50)),popT=pCy/H>0.58?(pCy/H*100-22):(pCy/H*100+6);
  var wx=p&&Array.isArray(p.wx)?p.wx:['sun','—'];
  var pop=p?'<div class="map-pop" style="left:'+popL.toFixed(1)+'%;top:'+popT.toFixed(1)+'%">'
    +'<div class="mp-k">Jour '+String(p.n).padStart(2,'0')+' · '+esc(p.loc||'')+'</div>'
    +'<div class="mp-t">'+esc(p.title||'')+'</div>'
    +'<div class="mp-m"><span class="mp-wx">'+ico(wx[0],13,1.7)+wx[1]+'</span>'
    +'<span class="mp-l" onclick="openDay('+i+')">Détails ›</span></div></div>':'';
  return statusBar()
    +navbar('Carte du voyage',{right:'<button class="nav-btn" onclick="if(typeof openOffline===\'function\')openOffline()" aria-label="Hors-ligne">'+ico('download',18,1.6)+'</button>'})
    +'<div class="ov-scroll"><div class="bigmap">'
    +'<span class="map-coords">'+esc(ITINERARY.coords||ITINERARY.dest||'')+'</span>'
    +'<span class="map-rose">'+(typeof rose==='function'?rose(26,1.1):'')+'</span>'
    +geoMapSVG(W,H,i)+pop
    +'</div><div class="map-rail">'+(ITINERARY.plan||[]).map(function(d,j){
      return '<button class="map-chip'+(j===i?' on':'')+'" onclick="mapSelect('+j+')">'
        +'<div class="mc-d">Jour '+String(d.n).padStart(2,'0')+'</div><div class="mc-l">'+esc(d.loc||'')+'</div></button>';
    }).join('')+'</div></div>';
}
function mapSelect(i){
  state.mapDay=i;
  var el=ovStack[ovStack.length-1];
  if(el&&el.dataset.ov==='map')el.innerHTML=mapView();
}

/* ── 1 · Onboarding ─────────────────────────────────────────────────── */
function onboardingView(){
  return statusBar()
    + '<div class="onb"><div class="onb-rule"></div>'
    +   '<div class="onb-main">'
    +     '<span class="onb-kw">Hic Sunt</span>'
    +     '<h1 class="onb-h">Le monde,<br><em>sur-mesure</em></h1>'
    +     '<p class="onb-s">Des itinéraires composés pour vous, au-delà des sentiers connus. Cartographie, conciergerie, et un assistant qui ajuste tout en direct.</p>'
    +   '</div>'
    +   '<div class="onb-acts">'
    +     '<button class="btn" onclick="openOverlay(\'signup\', signupView())">Commencer</button>'
    +     '<button class="btn-ghost" onclick="openOverlay(\'login\', loginView())">J\'ai déjà un compte</button>'
    +     '<div class="dots"><i class="on"></i><i></i><i></i></div>'
    +   '</div>'
    + '</div>';
}

/* ── icône Google (réutilisée par signup/login) ─────────────────────── */
const GOOGLE_SVG = '<svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>';

/* ── 2 · Inscription ───────────────────────────────────────────────── */
function signupView(){
  return statusBar() + navbar('')
    + '<div class="ov-scroll px">'
    +   '<h1 class="login-h">Créer un compte.</h1>'
    +   '<p class="login-s">Rejoignez Hic Sunt pour composer vos voyages.</p>'
    +   '<button class="apple-btn" onclick="loginGoogle()" style="background:#fff;color:#1b1610;border:1px solid var(--line);gap:12px">'
    +     GOOGLE_SVG + 'Continuer avec Google</button>'
    +   '<div class="sep">ou</div>'
    +   '<div class="field"><label>Email</label><input class="input" type="email" id="authEmail" placeholder="charlotte@exemple.fr"></div>'
    +   '<div class="field"><label>Mot de passe</label><input class="input" type="password" id="authPassword" placeholder="8 caractères minimum"></div>'
    +   '<button class="btn" style="margin-top:6px" onclick="signupEmail()">Créer mon compte</button>'
    +   '<p class="login-link">Déjà un compte ? <b onclick="closeOverlay();openOverlay(\'login\', loginView())">Se connecter</b></p>'
    + '</div>';
}

/* ── 2bis · Connexion ───────────────────────────────────────────────── */
function loginView(){
  return statusBar() + navbar('')
    + '<div class="ov-scroll px">'
    +   '<h1 class="login-h">Bon retour.</h1>'
    +   '<p class="login-s">Connectez-vous pour accéder à vos itinéraires.</p>'
    +   '<button class="apple-btn" onclick="loginGoogle()" style="background:#fff;color:#1b1610;border:1px solid var(--line);gap:12px">'
    +     GOOGLE_SVG + 'Continuer avec Google</button>'
    +   '<div class="sep">ou</div>'
    +   '<div class="field"><label>Email</label><input class="input" type="email" id="authEmail" placeholder="charlotte@exemple.fr"></div>'
    +   '<div class="field"><label>Mot de passe</label><input class="input" type="password" id="authPassword" placeholder="••••••••"></div>'
    +   '<button class="btn" style="margin-top:6px" onclick="loginEmail()">Se connecter</button>'
    +   '<p class="login-link">Première fois ? <b onclick="closeOverlay();openOverlay(\'signup\', signupView())">Créer un compte</b></p>'
    + '</div>';
}
function loginDone(){ closeAllOverlays(); setTab('discover'); }

/* ── 2ter · Bienvenue — informations du voyageur ──────────────────────── */
function welcomeView(){
  return statusBar() + navbar('')
    + '<div class="ov-scroll px">'
    +   '<h1 class="login-h">Bienvenue.</h1>'
    +   '<p class="login-s">Quelques informations pour personnaliser votre expérience.</p>'
    +   '<div class="field"><label>Prénom</label><input class="input" type="text" id="wFirst" placeholder="Charlotte"></div>'
    +   '<div class="field"><label>Nom</label><input class="input" type="text" id="wLast" placeholder="Leroux"></div>'
    +   '<div class="field"><label>Date de naissance</label><input class="input" type="date" id="wBirth"></div>'
    +   '<div class="field"><label>Adresse</label><input class="input" type="text" id="wAddress" placeholder="12 rue de Rivoli, Paris"></div>'
    +   '<button class="btn" style="margin-top:6px" onclick="saveWelcomeProfile()">Continuer</button>'
    + '</div>';
}

/* ── 8 · Destination détail ─────────────────────────────────────────── */
/* rubans de saison par destination (score 0–3 par mois) */
const SEASONS_BY_DEST = {
  'Sri Lanka': [3,3,2,2,1,0,0,0,1,1,2,3],
  'Japon':     [1,1,3,3,3,1,0,0,2,3,3,1],
  'Maroc':     [2,2,3,3,2,1,0,0,2,3,3,2],
  'Portugal':  [0,1,1,2,3,3,3,3,3,2,1,0],
  'Islande':   [0,0,0,1,2,3,3,3,2,1,0,0],
  'Pérou':     [0,0,1,2,3,3,3,3,3,2,1,0],
  'Thaïlande': [3,3,2,1,0,0,0,0,0,1,3,3],
  'Kenya':     [2,2,1,0,0,1,3,3,3,3,1,2],
};
const MONTHS_FR = ['J','F','M','A','M','J','J','A','S','O','N','D'];

function destinationView(key){
  const d = DESTS[key];
  const scores = SEASONS_BY_DEST[key] || [1,1,1,2,2,2,2,2,2,1,1,1];
  const k = key.replace(/'/g, "\\'");
  return '<div class="dest-hero">'
    +   '<div class="wash" style="background:' + d.bg + '"></div>'
    +   '<div class="wm">' + ico(d.i, 132, 1) + '</div>'
    +   '<div class="veil"></div>'
    +   '<div class="navbar on-dark" style="position:absolute;top:0;left:0;right:0;z-index:10">'
    +     '<button class="nav-btn ghost" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +     '<button class="nav-btn ghost" onclick="toast(\'Lien copié\')" aria-label="Partager">' + ico('share',18,1.5) + '</button>'
    +   '</div>'
    +   '<div class="dest-cap"><span class="eyebrow">' + esc(d.r) + '</span><h1>' + esc(key) + '</h1>'
    +     '<div class="dest-pills"><span class="pill">' + esc(d.best) + '</span><span class="pill">Vol ' + esc(d.flight) + '</span></div></div>'
    + '</div>'
    + '<div class="ov-scroll has-foot px">'
    +   '<p class="lede">' + esc(d.lede) + '</p>'
    +   '<div class="info-grid">'
    +     '<div class="info-card"><div class="ic-l">Meilleure saison</div><div class="ic-v">' + esc(d.best) + '</div></div>'
    +     '<div class="info-card"><div class="ic-l">Vol direct</div><div class="ic-v">' + esc(d.flight) + '</div></div>'
    +   '</div>'
    +   '<div class="section-h"><h2>Points forts</h2></div>'
    +   d.highlights.map(function(h){
        return '<div class="hl">' + ico(h[0],20,1.5) + '<div><div class="h-t">' + esc(h[1]) + '</div><div class="h-d">' + esc(h[2]) + '</div></div></div>';
      }).join('')
    +   '<div class="section-h"><h2>Quand partir</h2><span class="meta">' + esc(d.best) + '</span></div>'
    +   '<div class="season">' + scores.map(function(s, i){
        return '<div class="m' + (s === 3 ? ' best' : '') + '"><i style="height:' + (10 + s * 14) + 'px"></i><span>' + MONTHS_FR[i] + '</span></div>';
      }).join('') + '</div>'
    +   '<p class="season-note">' + esc(d.tag) + ' — les meilleurs mois sont indiqués en or.</p>'
    + '</div>'
    + '<div class="ov-foot"><button class="btn" onclick="composeFromDest(\'' + k + '\')">' + ico('sparkle',18,1.7) + 'Composer un <em>voyage</em> ici</button></div>';
}

/* ── 5 · Génération (modal sombre) ──────────────────────────────────── */
function generationView(){
  /* Globe animé centré — même identité que le splash */
  const globe = '<svg class="gen-globe" viewBox="0 0 120 120" fill="none">'
    + '<circle class="sg-ring" cx="60" cy="60" r="54"/>'
    + '<ellipse class="sg-mer" cx="60" cy="60" rx="22" ry="54"/>'
    + '<ellipse class="sg-mer sg-mer2" cx="60" cy="60" rx="44" ry="54"/>'
    + '<line class="sg-eq" x1="6" y1="60" x2="114" y2="60"/>'
    + '<line class="sg-tick" x1="60" y1="2" x2="60" y2="12"/>'
    + '<line class="sg-tick" x1="60" y1="108" x2="60" y2="118"/>'
    + '<line class="sg-tick" x1="2" y1="60" x2="12" y2="60"/>'
    + '<line class="sg-tick" x1="108" y1="60" x2="118" y2="60"/>'
    + '</svg>';

  /* Route qui se trace — plus grande, 4 villes */
  const route = '<svg class="gen-route" viewBox="0 0 220 220" fill="none">'
    + '<path d="M28 188 Q55 148 88 142 Q118 136 140 108 Q162 80 192 36"/>'
    + '<circle cx="28" cy="188" r="3.5"/>'
    + '<circle cx="88" cy="142" r="3.5"/>'
    + '<circle cx="140" cy="108" r="3.5"/>'
    + '<circle cx="192" cy="36" r="3.5"/>'
    + '</svg>';

  return '<div class="gen">' + statusBar(true)
    + '<div class="gen-body">'
    /* Logo discret en haut */
    +   '<div class="gen-logo">Hic <em>Sunt</em></div>'
    /* Globe + carte superposés */
    +   '<div class="gen-visual">'
    +     '<div class="gen-globe-wrap">' + globe + '</div>'
    +     '<div class="gen-map">' + graticule(220, 220, 40) + route + '</div>'
    +   '</div>'
    /* Statut en grand italic Spectral */
    +   '<p class="gen-status" data-gen-status>Lecture de vos envies…</p>'
    /* Barre de progression ultra-fine */
    +   '<div class="gen-progress">'
    +     '<div class="gen-progress-track"><div class="gen-progress-fill" data-gen-bar style="width:2%;transition:none"></div></div>'
    +     '<div class="gen-progress-nums">'
    +     '<span class="gen-progress-pct" data-gen-pct>0%</span>'
    +     '<span class="gen-progress-time" data-gen-time>~16s</span>'
    +     '</div>'
    +   '</div>'
    + '</div></div>';
}

/* ── Suggestion de destination (mode "Surprenez-moi") ────────────────── */
function destinationSuggestView(s){
  return '<div class="gen suggest">' + statusBar()
    + '<div class="gen-body">'
    +   '<span style="font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:3.5px;text-transform:uppercase;color:var(--gold-deep)">Destination suggérée</span>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:48px;letter-spacing:-1.5px;color:var(--ink);line-height:1.0;margin:12px 0 4px;text-align:center">' + esc(s.dest||'') + '</h1>'
    +   '<p style="font-family:var(--serif);font-style:italic;font-size:18px;color:var(--gold-deep);line-height:1.45;margin:0 0 16px;text-align:center">' + esc(s.tagline||'') + '</p>'
    +   '<p style="font-family:var(--serif);font-size:14px;color:var(--ink-soft);line-height:1.6;text-align:center;max-width:280px;margin:0 auto 8px">' + esc(s.teaser||'') + '</p>'
    +   (s.coords?'<div style="font-family:var(--mono);font-size:8px;letter-spacing:2px;color:var(--sub);text-align:center;margin-bottom:24px">'+esc(s.coords)+'</div>':'')
    +   '<div class="sugg-acts">'
    +     '<button class="btn gold" onclick="confirmSuggestedDestination()">' + ico('sparkle',18,1.7) + 'Composer cet itinéraire</button>'
    +     '<button class="btn" style="background:transparent;border:1px solid var(--line);color:var(--ink-soft)" onclick="retrySuggestion()">Proposer une autre destination</button>'
    +   '</div>'
    + '</div></div>';
}

/* ── gradients par type d'hébergement, teintés par la palette destination ── */
const ACC_TYPE_GRADIENT={
  wave:['#5B9FBE','#3d7a96'], droplet:['#E8A0A0','#c97a7a'], leaf:['#7BAE6E','#5a8a4f'],
  arch:['#C9965A','#a3753f'], peaks:['#9BA7B5','#6f7c8a'], bed:['#B07EB0','#8a5d8c'],
};
function accGradient(a, it){
  const palette = (it && it.palette) || null;
  const cat = palette ? (KIND_CATEGORY[a.i] || 'culture') : null;
  if(palette && cat && palette[cat]){
    const c = palette[cat];
    return 'linear-gradient(135deg, '+hexA(c,0.85)+', '+hexA(c,0.45)+'), linear-gradient(135deg,#1a1610,#2a2018)';
  }
  const g = ACC_TYPE_GRADIENT[a.i] || ['#9c7c44','#7a5f33'];
  return 'linear-gradient(135deg, '+g[0]+', '+g[1]+')';
}

/* ── liens d'affiliation ──────────────────────────────────────────────
   Pas de réservation directe : l'utilisateur est redirigé vers le
   partenaire (Booking.com ou Airbnb) avec le nom + ville pré-remplis.
   Remplacer AFFILIATE_TAGS par les vrais identifiants d'affiliation
   une fois les programmes Booking.com / Airbnb actifs. ── */
const AFFILIATE_TAGS = { booking:'', airbnb:'' };
function affiliateLink(a, platform){
  const it = ITINERARY;
  /* Nom de l'hébergement — encodé pour une recherche précise */
  const nameRaw  = a.n || '';
  const cityRaw  = a.loc || it.dest || '';
  const nameQ    = encodeURIComponent(nameRaw);
  const cityQ    = encodeURIComponent(cityRaw);
  /* Pour Booking : chercher "Nom de l'hébergement, Ville" */
  const fullQ    = encodeURIComponent(nameRaw + ', ' + cityRaw);
  const checkin  = it.dateFrom  || '';
  const checkout = it.dateTo    || '';
  const guests   = (typeof state !== 'undefined' && state.travelers) || 2;
  const affB     = typeof AFFILIATE_TAGS !== 'undefined' && AFFILIATE_TAGS.booking ? '&aid=' + AFFILIATE_TAGS.booking : '';
  const affA     = typeof AFFILIATE_TAGS !== 'undefined' && AFFILIATE_TAGS.airbnb  ? '?af=' + AFFILIATE_TAGS.airbnb  : '';

  const isAirbnb = /villa|appartement|apparthotel|maison|airbnb|guesthouse|gîte|loft/.test((a.type||'').toLowerCase());

  /* Booking.com — recherche par nom exact + ville, dates, voyageurs */
  const bookingUrl = 'https://www.booking.com/searchresults.html'
    + '?ss=' + fullQ
    + '&lang=fr'
    + (checkin  ? '&checkin='  + checkin  : '')
    + (checkout ? '&checkout=' + checkout : '')
    + '&group_adults=' + guests + '&no_rooms=1'
    + '&sb_travel_purpose=leisure'
    + affB;

  /* Airbnb — recherche dans la ville avec le nom en query */
  const airbnbUrl = 'https://www.airbnb.fr/s/' + cityQ + '/homes'
    + '?query=' + nameQ
    + '&adults=' + guests
    + (checkin  ? '&checkin='  + checkin  : '')
    + (checkout ? '&checkout=' + checkout : '');

  /* Hotels.com — recherche par nom + ville */
  const hotelsUrl = 'https://fr.hotels.com/search.do'
    + '?q-destination=' + fullQ
    + '&q-rooms=1&q-room-0-adults=' + guests
    + (checkin  ? '&q-check-in='  + checkin  : '')
    + (checkout ? '&q-check-out=' + checkout : '');

  if (platform === 'airbnb' || isAirbnb) return airbnbUrl;
  if (platform === 'hotels') return hotelsUrl;
  return bookingUrl;
}
function openAffiliate(accId){
  const a = _accById(accId);
  if(!a) return;
  window.open(affiliateLink(a), '_blank');
}

/* ── composant accCard ──────────────────────────────────────────────── */
function accThemeAccent(a, it){
  const palette = (it && it.palette) || null;
  const cat = palette ? (KIND_CATEGORY[a.i] || 'culture') : null;
  return (palette && cat && palette[cat]) ? palette[cat] : '#9c7c44';
}
function accCard(a){
  const it = ITINERARY;
  const accent = accThemeAccent(a, it);
  const price = Number(a.price)||0;
  const nights = Number(a.nights)||1;
  const rate = a.rate||'';
  const rateNum = rate ? parseFloat(rate.replace(',','.')) : 0;

  /* Nom propre : si a.n est vide ou un simple numéro, tenter d'extraire
     le vrai nom depuis le blurb (souvent "Nom — description"), sinon fallback. */
  var dispName = (a.n||'').trim();
  if(!dispName || /^\d+$/.test(dispName)){
    var fromBlurb = (a.blurb||'').split(/[—–\-,]/)[0].trim();
    dispName = (fromBlurb && fromBlurb.length>2 && !/^\d+$/.test(fromBlurb)) ? fromBlurb : (a.type||'Hébergement');
  }

  /* Étoiles de notation */
  function stars(n){
    const full = Math.floor(n), half = n%1>=0.3?1:0;
    let s='';
    for(var i=0;i<full;i++) s+='<span style="color:var(--gold)">★</span>';
    if(half) s+='<span style="color:var(--gold);opacity:0.5">★</span>';
    return s;
  }

  /* Couleur de fond selon type */
  const typeLower=(a.type||'').toLowerCase();
  const bgColor = /villa|luxe|relais|palace/.test(typeLower) ? hexA(accent,0.10)
    : /resort|boutique/.test(typeLower) ? hexA(accent,0.07)
    : 'var(--surface)';

  return '<div class="acc" onclick="openBooking(\'' + a.id + '\')" style="background:var(--surface-raised,#fff);border:1px solid var(--line);border-radius:18px;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent">'
    /* Header coloré avec icône */
    + '<div style="background:'+bgColor+';padding:20px 20px 16px;display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid var(--line2)">'
    +   '<div style="flex:1;min-width:0">'
    +     '<div style="font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:'+accent+';margin-bottom:6px">' + esc(a.type||'Hébergement') + '</div>'
    +     '<div style="font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink);line-height:1.2;margin-bottom:4px">' + esc(dispName) + '</div>'
    +     '<div style="font-family:var(--mono);font-size:9.5px;letter-spacing:0.5px;text-transform:uppercase;color:var(--sub)">' + esc(a.loc||'') + '</div>'
    +   '</div>'
    +   '<div style="width:48px;height:48px;border-radius:14px;background:'+hexA(accent,0.14)+';display:flex;align-items:center;justify-content:center;flex:none;margin-left:12px;color:'+accent+'">' + ico(a.i||'bed', 22, 1.3) + '</div>'
    + '</div>'
    /* Body — prix + étoiles + nuits */
    + '<div style="padding:14px 20px;display:flex;align-items:center;justify-content:space-between">'
    +   '<div>'
    +     '<div style="font-family:var(--serif);font-size:22px;font-weight:600;color:var(--ink);letter-spacing:-0.3px">' + eur(price) + '<span style="font-size:13px;font-weight:400;color:var(--sub);margin-left:3px">/ nuit</span></div>'
    +     '<div style="font-size:12px;color:var(--sub);margin-top:2px">' + nights + ' nuit' + (nights>1?'s':'') + (a.blurb?' · '+esc(a.blurb.slice(0,32)):'') + '</div>'
    +   '</div>'
    +   '<div style="text-align:right">'
    +     (rateNum>0 ? '<div style="font-size:13px;line-height:1">'+stars(rateNum)+'</div><div style="font-family:var(--mono);font-size:9px;font-weight:700;color:var(--sub);margin-top:3px">'+esc(rate)+'</div>' : '')
    +   '</div>'
    + '</div>'
    /* Footer CTA — handler explicite pour fiabilité */
    + '<div onclick="event.stopPropagation();openBooking(\'' + a.id + '\')" style="margin:0 16px 14px;background:var(--ink);border-radius:12px;padding:11px 16px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer">'
    +   '<span style="font-family:var(--sans);font-size:13px;font-weight:600;color:var(--bg)">Voir les disponibilités</span>'
    +   '<span style="color:var(--bg);opacity:0.7">' + ico('chevron',12,1.5) + '</span>'
    + '</div>'
    + '</div>';
}

/* ── 6 · Itinéraire ─────────────────────────────────────────────────── */
function itineraryView(){
  const it = ITINERARY;
  const wx1 = it.plan[0] ? it.plan[0].wx : ['sun','30°'];
  const palette = it.palette || {};
  const theme = it.theme || 'mediterranean';
  const nDays = it.plan && it.plan.length ? it.plan.length : _days(it);

  /* Couleur accentuée par thème — sobre, une seule couleur vive */
  const ACCENT = {
    mediterranean:'#2878A8', desert:'#B86A28', alpine:'#2A8E68',
    tropical:'#C05020', tropical_io:'#1898B8', steppe:'#4A6E90',
    andean:'#987830', urban_asia:'#8828A0', urban:'#4A48B8',
    savanna:'#6A9828', caribbean:'#1898A0',
  };
  const THEME_LABEL = {
    mediterranean:'Méditerranée', desert:'Désert', alpine:'Montagne',
    tropical:'Tropiques', tropical_io:'Océan Indien', steppe:'Grand Nord',
    andean:'Andes', urban_asia:'Asie', urban:'Métropole',
    savanna:'Savane', caribbean:'Caraïbes',
  };
  const ac = ACCENT[theme] || '#9c7c44';
  const c1 = (palette && palette.beach) || (palette && palette.culture) || ac;
  const themeLabel = THEME_LABEL[theme] || 'Sur-mesure';
  const minimapBg = 'linear-gradient(135deg,' + hexA(ac,0.06) + ' 0%,var(--surface) 100%)';

  return (
    /* ── Navbar ── */
    navbar(it.dest, {
      right: '<button class="nav-btn" onclick="openOverlay(\'share\', shareView())" aria-label="Partager">' + ico('share',18,1.5) + '</button>'
    })

    /* ── Hero éditorial fond clair ── */
    + '<div style="flex:none;padding:0 20px 28px;border-bottom:1px solid var(--line2)">'
    /* Eyebrow thème + coordonnées */
    +   '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">'
    +     '<span style="font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:' + ac + '">' + esc(themeLabel) + '</span>'
    +     '<span style="font-family:var(--mono);font-size:8px;letter-spacing:1.5px;color:var(--sub)">' + esc(it.coords||'') + '</span>'
    +   '</div>'
    /* Titre */
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:44px;letter-spacing:-1.2px;color:var(--ink);line-height:1;margin:0 0 10px">' + esc(it.dest) + '</h1>'
    /* Trait couleur sous le titre */
    +   '<div style="width:48px;height:3px;background:' + ac + ';border-radius:2px;margin-bottom:12px"></div>'
    /* Tagline */
    +   '<p style="font-family:var(--serif);font-style:italic;font-size:14px;color:var(--sub);line-height:1.6;margin:0 0 20px;max-width:280px">' + esc(it.tag) + '</p>'
    /* Pills */
    +   '<div style="display:flex;flex-wrap:wrap;gap:7px">'
    +     '<span style="font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:7px 14px;border-radius:20px;background:' + hexA(ac,0.1) + ';color:' + ac + ';border:1px solid ' + hexA(ac,0.25) + '">' + esc(it.dates) + '</span>'
    +     '<span style="font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:7px 14px;border-radius:20px;background:var(--surface);color:var(--ink-soft);border:1px solid var(--line)">' + esc(it.level) + '</span>'
    +   '</div>'
    + '</div>'

    /* ── Contenu scrollable ── */
    + '<div class="ov-scroll has-foot px">'

    /* Carte */
    + '<div class="minimap" style="margin-top:16px;background:' + minimapBg + '" onclick="openMapOv()">'
    +   geoMapSVG(345, 140, null) + wxChip(wx1[0], wx1[1])
    +   '<span class="mm-cap">' + esc(it.coords || it.dest) + '</span>'
    + '</div>'

    /* Actions */
    + '<div class="tools" style="margin-top:16px">'
    +   '<button class="tool" onclick="openOverlay(\'budget\', budgetView())">'
    +     ico('wallet',20,1.5) + '<div class="tl-t">Budget</div><div class="tl-s">' + eur(it.budgetTotal) + '</div>'
    +   '</button>'
    +   '<button class="tool" onclick="openActivities()">'
    +     ico('ticket',20,1.5) + '<div class="tl-t">Activités</div><div class="tl-s">' + ACTIVITIES.length + ' exp.</div>'
    +   '</button>'
    +   '<button class="tool" onclick="openOverlay(\'gems\', gemsView())">'
    +     ico('star',18,1.5) + '<div class="tl-t">Pépites</div><div class="tl-s">' + ((it.gems||[]).length) + ' adresses</div>'
    +   '</button>'
    +   '<button class="tool" onclick="openAI()">'
    +     ico('sparkle',18,1.5) + '<div class="tl-t">Modifier</div><div class="tl-s">Cartographe</div>'
    +   '</button>'
    + '</div>'

    /* Jours */
    + '<div class="section-h" style="margin-top:8px"><h2>Jour par jour</h2><span class="meta">' + nDays + ' jours</span></div>'
    + it.plan.map(function(p, i){
        if(!p) return '';
        const cc = (p.category && palette[p.category]) || ac;
        const tags = Array.isArray(p.tags) ? p.tags : [];
        const wx = Array.isArray(p.wx) ? p.wx : ['sun','—'];
        return '<div class="dayrow" onclick="openDay(' + i + ')">'
          + '<div class="dr-rail">'
          +   '<span class="dr-pin" style="background:' + cc + ';border-color:' + cc + '">' + p.n + '</span>'
          +   '<span class="dr-line" style="background:' + hexA(cc,0.18) + '"></span>'
          + '</div>'
          + '<div class="dr-main">'
          +   '<div class="dr-top">'
          +     '<div><div class="dr-t">' + esc(p.title||'') + '</div><div class="dr-l">' + esc(p.loc||'') + '</div></div>'
          +     wxChip(wx[0], wx[1])
          +   '</div>'
          +   (p.desc ? '<div class="dr-d">' + esc(p.desc) + '</div>' : '')
          +   (tags.length ? '<div class="dr-tags">' + tags.map(function(t){
                return '<span class="mini-tag" style="color:' + cc + ';border-color:' + hexA(cc,0.25) + ';background:' + hexA(cc,0.07) + '">' + ico(t[0],12,1.7) + t[1] + '</span>';
              }).join('') + '</div>' : '')
          + '</div></div>';
      }).join('')

    /* Hébergements */
    + '<div class="section-h" style="margin-top:8px"><h2>Hébergements</h2><span class="meta">' + it.accommodations.length + ' sélections</span></div>'
    + it.accommodations.map(accCard).join('')
    + '</div>'

    /* Footer */
    + '<div class="ov-foot"><div class="foot-price">'
    +   '<div><div class="fp-v">' + eur(it.budgetTotal) + '</div><div class="fp-l">tout compris · ' + travelerLabel() + '</div></div>'
    +   '<div class="foot-actions">'
    +     '<button class="fa-btn" onclick="saveItinerary()"><span>' + ico('bookmark',20,1.6) + '</span><i>Garder</i></button>'
    +     '<button class="fa-btn" onclick="window.triggerPDF&&window.triggerPDF()"><span>' + ico('doc',20,1.6) + '</span><i>PDF</i></button>'
    +   '</div>'
    + '</div></div>'
  );
}

/* ── 7 · Détail d'un jour ───────────────────────────────────────────── */
function dayDetailView(idx){
  const it = ITINERARY;
  const p = it.plan[idx];
  if (!p) return statusBar() + navbar('Jour');
  /* DEBUG temporaire */
  try{ console.log('[dayDetail] p=', JSON.stringify({n:p.n,title:p.title,category:p.category,hasDesc:!!p.desc,hasMoments:!!(p.moments&&p.moments.length),hasTip:!!p.tip,theme:it.theme,palette:JSON.stringify(it.palette)})); }catch(e){}
  const num = 'Jour ' + String(p.n).padStart(2,'0');
  const palette = it.palette || {};
  const theme = it.theme || 'mediterranean';

  /* Couleur principale du jour = couleur de sa catégorie */
  const catColor = (p.category && palette[p.category]) || '#9c7c44';
  const catLabel = (typeof CATEGORY_LABELS !== 'undefined' && p.category && CATEGORY_LABELS[p.category]) || '';

  /* Couleur secondaire = catégorie du moment dominant différente */
  const categories = (p.moments||[]).map(function(m){
    var k = Array.isArray(m) ? m[1] : (m && m.k);
    return (typeof KIND_CATEGORY!=='undefined' && k && KIND_CATEGORY[k]) || 'culture';
  });
  const secCat = categories.find(function(c){ return c !== p.category && c !== 'transit'; }) || p.category || 'culture';
  const secColor = (secCat && palette[secCat]) || catColor;

  let nightHTML = '';
  if (p.night && p.night.acc){
    let found = null;
    for (let i = 0; i < it.accommodations.length; i++) if (it.accommodations[i].id === p.night.acc) found = it.accommodations[i];
    nightHTML = found ? accCard(found)
      : '<div class="row"><span class="r-ico">' + ico('bed',20,1.5) + '</span><div class="r-main"><div class="r-t">Nuit sur place</div></div></div>';
  } else if (p.night){
    nightHTML = '<div class="row" style="cursor:default"><span class="r-ico">' + ico('bed',20,1.5) + '</span>'
      + '<div class="r-main"><div class="r-t">' + esc(p.night.n) + '</div><div class="r-s">' + esc(p.night.loc) + '</div></div></div>';
  }
  const prev = idx > 0
    ? '<button class="btn-ghost" onclick="swapDay(' + (idx-1) + ')">' + ico('back',16,1.8) + 'Jour ' + idx + '</button>' : '';
  const next = idx < it.plan.length - 1
    ? '<button class="btn" onclick="swapDay(' + (idx+1) + ')">Jour ' + (idx+2) + ico('chevron',16,1.8) + '</button>'
    : '<button class="btn" onclick="closeOverlay()">Retour à l\'itinéraire</button>';

  const restaurantHTML = p.restaurant ? '<div class="section-h"><h2>À table</h2></div>'
    + '<div class="row" style="cursor:default;align-items:flex-start"><span class="r-ico" style="color:'+catColor+'">' + ico('fork',19,1.5) + '</span>'
    + '<div class="r-main"><div class="r-t"><a href="https://www.google.com/search?q='+encodeURIComponent((p.restaurant.name||'')+' '+(p.loc||ITINERARY.dest||'')+' restaurant')+'" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:5px">' + esc(p.restaurant.name||'') + '<span style="color:'+catColor+';display:inline-flex;flex:none">'+ico('external',11,1.6)+'</span></a>' + (p.restaurant.rating?' <span style="font-size:11px;font-weight:400;color:'+catColor+'">'+esc(p.restaurant.rating)+'</span>':'') + '</div>'
    + '<div class="r-s">' + esc(p.restaurant.type||'') + (p.restaurant.price?' · '+esc(p.restaurant.price):'') + '</div>'
    + (p.restaurant.note?'<div class="r-s" style="margin-top:2px;font-style:italic">'+esc(p.restaurant.note)+'</div>':'')
    + (p.restaurant.review?'<div class="r-s" style="margin-top:4px;color:var(--sub);font-size:11px">"'+esc(p.restaurant.review)+'"</div>':'')
    + '</div></div>' : '';

  const wellnessHTML = p.wellness ? '<div class="section-h"><h2>Bien-être</h2></div>'
    + '<div class="row" style="cursor:default;align-items:flex-start"><span class="r-ico" style="color:'+(palette.spa||catColor)+'">' + ico('droplet',19,1.5) + '</span>'
    + '<div class="r-main"><div class="r-t">' + esc(p.wellness.name||'') + '</div>'
    + '<div class="r-s">' + esc(p.wellness.type||'') + (p.wellness.price?' · '+esc(p.wellness.price):'') + '</div>'
    + (p.wellness.note?'<div class="r-s" style="margin-top:2px;font-style:italic">'+esc(p.wellness.note)+'</div>':'')
    + '</div></div>' : '';

  const tipHTML = p.tip ? '<div style="border-left:3px solid '+catColor+';background:'+hexA(catColor,0.07)+';border-radius:0 10px 10px 0;padding:12px 16px;margin-top:16px;margin-bottom:4px">'
    + '<span style="color:'+catColor+';font-family:var(--mono);font-weight:700;font-style:normal;text-transform:uppercase;letter-spacing:.1em;font-size:9px;display:block;margin-bottom:5px">Conseil d\'initié</span>'
    + '<span style="font-size:13.5px;font-style:italic;color:var(--ink);line-height:1.5">'+esc(p.tip)+'</span></div>' : '';

  /* Hero du jour — fond clair, bande colorée */
  const navRight = idx < it.plan.length-1
    ? '<button class="nav-btn" onclick="swapDay('+(idx+1)+')" aria-label="Suivant">'+ico('chevron',20,1.7)+'</button>'
    : '<span class="nav-spacer"></span>';

  return navbar(num, { right: navRight })
    /* Bande couleur fine + infos jour */
    + '<div style="flex:none;padding:0 20px 24px;border-bottom:1px solid var(--line2)">'
    +   '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">'
    +     '<span style="width:4px;height:4px;border-radius:50%;background:'+catColor+';display:block"></span>'
    +     '<span style="font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:'+catColor+'">'
    +       (catLabel || 'Découverte') + ' · ' + esc(p.loc)
    +     '</span>'
    +     (p.wx && p.wx[1] ? '<span style="margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--sub)">'+esc(p.wx[1])+'</span>' : '')
    +   '</div>'
    +   '<h1 style="font-family:var(--serif);font-weight:600;font-size:30px;letter-spacing:-0.5px;color:var(--ink);line-height:1.1;margin:0 0 10px">' + esc(p.title) + '</h1>'
    +   '<div style="width:36px;height:3px;background:'+catColor+';border-radius:2px"></div>'
    + '</div>'
    /* Corps scrollable */
    + '<div class="ov-scroll has-foot px" style="padding-top:16px">'
    +   (p.desc ? '<p style="font-size:15px;color:var(--ink);line-height:1.65;font-family:var(--serif);font-style:italic;margin:0 0 4px">' + esc(p.desc) + '</p>' : '')
    +   tipHTML
    +   '<div class="section-h" style="margin-top:20px"><h2>Le programme</h2><span class="meta">' + (p.moments ? p.moments.length : 0) + ' moments</span></div>'
    +   (p.moments || []).map(function(m){
        /* Support des deux formats : tableau [t,k,ti,d] et objet {t,k,ti,d} */
        var mt = Array.isArray(m) ? m[0] : (m && m.t) || '—';
        var mk = Array.isArray(m) ? m[1] : (m && m.k) || 'pin';
        var mti = Array.isArray(m) ? m[2] : (m && m.ti) || '';
        var md = Array.isArray(m) ? m[3] : (m && m.d) || '';
        var mCat = (typeof KIND_CATEGORY!=='undefined' && mk && KIND_CATEGORY[mk]) || 'culture';
        var mColor = (mCat && palette[mCat]) || catColor;
        return '<div class="moment">'
          + '<span class="mo-t">' + esc(mt) + '</span>'
          + '<span class="mo-i" style="color:'+mColor+'">' + ico(mk,15,1.6) + '</span>'
          + '<div><div class="mo-ti">' + esc(mti) + '</div>' + (md ? '<div class="mo-d">' + esc(md) + '</div>' : '') + '</div>'
          + '</div>';
      }).join('')
    +   restaurantHTML
    +   wellnessHTML
    +   '<div class="section-h"><h2>La nuit</h2></div>' + nightHTML
    + '</div>'
    + '<div class="ov-foot"><div class="day-nav">' + prev + next + '</div></div>';
}
function swapDay(idx){
  const el = ovStack[ovStack.length - 1];
  if (el && el.dataset.ov === 'day'){ el.innerHTML = dayDetailView(idx); }
  else openDay(idx);
}

/* ── 9 · Réservation ────────────────────────────────────────────────── */
let _bookId = null;
function _accById(id){
  for (let i = 0; i < ITINERARY.accommodations.length; i++)
    if (ITINERARY.accommodations[i].id === id) return ITINERARY.accommodations[i];
  return ITINERARY.accommodations[0];
}
function bookingView(accId){
  _bookId = accId;
  const a = _accById(accId);
  const total = a.price * a.nights;
  const accent = accThemeAccent(a, ITINERARY);
  const isAirbnb = /villa|appartement|apparthotel|maison|airbnb|guesthouse|gîte|loft/.test((a.type||'').toLowerCase());
  return '<div class="book-hero" style="position:relative;overflow:hidden;height:245px;background:radial-gradient(120% 100% at 15% 0%,'+hexA(accent,0.28)+',transparent 60%),linear-gradient(155deg,#1c1812,#0d0b08 55%,#000)">'
    +   '<span style="position:absolute;bottom:20px;right:24px;z-index:1;color:'+hexA(accent,0.9)+';display:flex;opacity:0.95">' + ico(a.i, 32, 1.3) + '</span>'
    +   '<span style="position:absolute;left:24px;right:24px;bottom:19px;height:1px;z-index:0;background:'+hexA(accent,0.25)+'"></span>'
    +   '<div class="navbar on-dark" style="position:absolute;top:0;left:0;right:0;z-index:1"><button class="nav-btn ghost" onclick="closeOverlay()" aria-label="Retour">' + ico('back',20,1.7) + '</button>'
    +   '<button class="nav-btn ghost" onclick="this.classList.toggle(\'on\');" aria-label="Favori">' + ico('heart',18,1.6) + '</button></div>'
    + '</div>'
    + '<div class="ov-scroll has-foot px">'
    +   '<span class="eyebrow" style="display:block;margin-top:16px">' + esc(a.tag) + '</span>'
    +   '<div class="book-h"><a href="https://www.google.com/search?q='+encodeURIComponent((a.n||'')+' '+(a.loc||''))+'" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:6px">' + esc(a.n) + '<span style="color:var(--gold);display:inline-flex;flex:none">'+ico('external',15,1.6)+'</span></a><span class="a-rate" style="font-family:var(--mono);font-size:11px;display:inline-flex;align-items:center;gap:4px">' + ico('star',12) + a.rate + '</span></div>'
    +   '<div class="book-meta">' + esc(a.type) + ' · ' + esc(a.loc) + '</div>'
    +   '<p class="book-desc">' + esc(a.blurb) + '</p>'
    +   '<div class="chips" style="margin-top:16px">' + a.am.map(function(k){
        return '<span class="chip" style="cursor:default">' + ico(k,14,1.6) + (AM_LABEL[k] || k) + '</span>';
      }).join('') + '</div>'
    +   '<div class="section-h"><h2>Votre séjour</h2></div>'
    +   '<div class="stay-row">' + ico('cal',18,1.5) + '<span class="sr-l">' + esc(ITINERARY.dates) + '</span><span class="sr-v">' + a.nights + ' nuit' + (a.nights>1?'s':'') + '</span></div>'
    +   '<div class="stay-row">' + ico('users',18,1.5) + '<span class="sr-l">Voyageurs</span><span class="sr-v">' + travelerLabel() + '</span></div>'
    +   '<div class="section-h"><h2>Estimation</h2></div>'
    +   '<div class="price-l"><span>' + eur(a.price) + ' × ' + a.nights + ' nuit' + (a.nights>1?'s':'') + '</span><span>' + eur(total) + '</span></div>'
    +   '<p class="book-desc" style="margin-top:8px;color:var(--sub)">Prix indicatif. La disponibilité et le tarif définitif sont confirmés sur ' + (isAirbnb?'Airbnb':'Booking.com') + '.</p>'
    + '</div>'
    + '<div class="ov-foot"><div class="foot-price">'
    +   '<div><div class="fp-v">' + eur(total) + '</div><div class="fp-l">' + a.nights + ' nuit' + (a.nights>1?'s':'') + ' · estimation</div></div>'
    +   '<button class="btn" onclick="openAffiliate(\'' + a.id + '\')">Voir sur ' + (isAirbnb?'Airbnb':'Booking.com') + '</button>'
    + '</div></div>';
}

