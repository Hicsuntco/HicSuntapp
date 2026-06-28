/* ── HIC SUNT · Sillage — écrans détail ─────────────────────────────── */

/* ── Carte géographique — redéfinition forcée (remplace features.js) ── */
var GEO_SHAPES_SD = {
  'france':{vb:'0 0 180 200',path:'M60,8 C70,6 82,8 90,14 C98,20 102,28 108,32 C116,36 126,34 132,40 C138,46 136,54 138,62 C140,70 146,76 144,86 C142,96 136,102 132,110 C128,118 128,128 122,136 C116,144 108,148 100,154 C92,160 86,166 78,170 C70,174 60,174 52,168 C44,162 40,154 36,146 C32,138 28,130 26,120 C24,110 22,100 24,90 C26,80 30,72 32,62 C34,52 32,42 36,34 C40,26 50,10 60,8Z',cities:{'Paris':[88,88],'Lyon':[108,124],'Marseille':[104,154],'Bordeaux':[56,136],'Toulouse':[72,158],'Nice':[130,152],'Nantes':[52,108],'Strasbourg':[138,72],'Lille':[90,32],'Biarritz':[42,158],'Brest':[20,80],'Montpellier':[96,156],'Annecy':[124,132],'Avignon':[108,150],'Saint-Malo':[48,72],'Carcassonne':[84,162],'Aix-en-Provence':[110,154],'Colmar':[136,80],'Chamonix':[128,128],'Versailles':[86,90],'Loire':[72,100],'Dordogne':[64,128],'Provence':[108,148],'Alsace':[136,76],'Bretagne':[30,80],'Normandie':[72,60],'Côte d\'Azur':[128,154],'Périgord':[68,130]}},
  'italie':{vb:'0 0 120 260',path:'M42,8 C52,6 62,10 68,18 C74,26 72,36 70,46 C68,56 66,64 64,74 C62,84 60,92 58,102 C56,112 54,122 52,132 C50,142 48,152 46,162 C44,172 42,182 44,190 C46,198 52,204 54,210 C56,216 54,222 50,224 C46,226 40,222 36,216 C32,210 30,202 30,194 C30,186 32,178 34,170 C36,162 38,152 38,142 C38,132 36,122 36,112 C36,102 36,92 36,82 C36,72 34,62 34,52 C34,42 34,32 38,22 C40,14 36,10 42,8Z M58,214 C64,210 72,212 76,218 C80,224 78,232 72,236 C66,240 58,236 56,230 C54,224 52,218 58,214Z',cities:{'Rome':[52,148],'Milan':[38,32],'Venise':[72,44],'Florence':[48,102],'Naples':[58,184],'Turin':[24,36],'Bologne':[56,76],'Gênes':[26,58],'Bari':[80,172],'Palerme':[36,244],'Amalfi':[56,196],'Positano':[54,194],'Capri':[58,202],'Pompéi':[58,190],'Cinque Terre':[28,68],'Toscane':[46,96],'Ombrie':[52,120],'Sicile':[40,244],'Sardaigne':[8,140],'Vérone':[56,50],'Pise':[40,90],'Sienne':[46,106],'Assise':[52,118],'Côte Amalfitaine':[56,194],'Pouilles':[80,166],'Calabre':[64,212]}},
  'espagne':{vb:'0 0 220 180',path:'M16,40 C24,28 36,18 52,14 C68,10 86,10 102,12 C118,14 132,18 146,22 C160,26 172,32 182,40 C192,48 198,58 200,70 C202,82 198,94 192,104 C186,114 176,122 164,130 C152,138 138,144 122,148 C106,152 88,154 72,152 C56,150 40,144 28,136 C16,128 6,118 4,106 C2,94 4,82 6,70 C8,58 8,52 16,40Z',cities:{'Madrid':[110,84],'Barcelone':[178,42],'Séville':[52,120],'Valence':[162,80],'Bilbao':[100,22],'Grenade':[94,130],'Málaga':[84,140],'Saragosse':[144,44],'Tolède':[100,96],'Saint-Jacques':[22,40],'Cordoue':[86,116],'Burgos':[110,36],'Salamanque':[76,76],'San Sebastián':[118,18],'Alicante':[164,98],'Majorque':[196,80],'Ibiza':[184,88],'Cadix':[44,136],'Ronda':[72,132],'Tarragone':[170,54],'Pampelune':[132,24],'Andalousie':[80,128],'Catalogne':[178,38],'Pays Basque':[108,20],'Castille':[100,72],'Galice':[24,36]}},
  'portugal':{vb:'0 0 60 130',path:'M30,6 C38,4 46,8 50,16 C54,24 52,34 52,44 C52,54 54,64 52,74 C50,84 46,92 42,100 C38,108 36,116 30,120 C24,124 16,120 12,112 C8,104 8,92 8,80 C8,68 10,56 10,44 C10,32 8,20 14,12 C20,4 22,8 30,6Z',cities:{'Lisbonne':[24,82],'Porto':[18,28],'Faro':[32,116],'Évora':[34,86],'Coimbra':[20,50],'Braga':[16,20],'Algarve':[30,118],'Sintra':[14,80],'Cascais':[12,82],'Nazaré':[14,60],'Óbidos':[16,66],'Guimarães':[18,22],'Tavira':[38,118],'Lagos':[22,120],'Setúbal':[16,88],'Douro':[28,28],'Alentejo':[32,94]}},
  'maroc':{vb:'0 0 170 150',path:'M20,14 C32,8 50,8 66,10 C82,12 96,18 108,26 C120,34 128,44 132,56 C136,68 134,80 130,90 C126,100 118,108 108,114 C98,120 86,124 72,126 C58,128 44,126 32,120 C20,114 10,104 6,92 C2,80 2,66 4,54 C6,42 10,30 20,14Z',cities:{'Marrakech':[72,84],'Casablanca':[36,50],'Fès':[88,34],'Rabat':[42,38],'Tanger':[46,12],'Agadir':[34,106],'Essaouira':[24,78],'Chefchaouen':[62,16],'Ouarzazate':[88,96],'Merzouga':[118,88],'Aït Ben Haddou':[82,92],'Ifrane':[80,52],'El Jadida':[30,62],'Meknès':[72,36],'Volubilis':[74,34],'Vallée Drâa':[80,102],'Sahara':[120,90],'Gorges du Dadès':[94,90]}},
  'grece':{vb:'0 0 180 160',path:'M44,14 C58,8 74,8 88,12 C102,16 112,24 118,36 C124,48 122,62 116,74 C110,86 100,94 90,102 C80,110 70,116 58,120 C46,124 34,122 24,114 C14,106 8,94 6,82 C4,70 6,56 10,44 C14,32 20,22 34,14 Z M92,118 C98,114 106,116 110,122 C114,128 112,136 106,140 C100,144 92,140 90,134 C88,128 86,122 92,118Z M130,100 C136,96 144,98 148,104 C152,110 150,118 144,122 C138,126 130,122 128,116 C126,110 124,104 130,100Z M152,80 C158,76 166,78 168,86 C170,94 164,100 158,100 C152,100 146,96 146,88 C146,82 146,84 152,80Z',cities:{'Athènes':[82,96],'Thessalonique':[84,20],'Santorin':[116,132],'Mykonos':[122,106],'Corfou':[14,72],'Rhodes':[162,110],'Crète':[100,148],'Météores':[62,44],'Delphes':[60,80],'Olympie':[44,108],'Épidaure':[80,106],'Nauplie':[74,108],'Sparte':[72,118],'Kavala':[112,12],'Ioannina':[32,52],'Heraklion':[104,150],'Paros':[108,116],'Naxos':[112,118],'Zakynthos':[26,108],'Kos':[148,114]}},
  'japon':{vb:'0 0 180 240',path:'M100,10 C112,6 124,10 132,18 C140,26 140,38 136,50 C132,62 124,72 118,84 C112,96 108,110 102,122 C96,134 90,146 84,158 C78,170 72,182 68,192 C64,202 62,212 58,220 C54,228 48,232 42,228 C36,224 34,216 34,206 C34,196 38,186 42,176 C46,166 50,156 54,146 C58,136 60,124 64,114 C68,104 72,94 76,84 C80,74 82,62 84,52 C86,42 86,30 92,20 Z M138,8 C148,4 160,8 166,16 C172,24 170,36 164,44 C158,52 148,54 140,48 C132,42 128,32 130,22 C132,12 128,12 138,8Z M42,218 C50,212 60,214 64,222 C68,230 64,238 56,240 C48,242 40,236 38,228 C36,220 34,224 42,218Z',cities:{'Tokyo':[96,108],'Kyoto':[76,140],'Osaka':[72,146],'Hiroshima':[56,158],'Nara':[76,144],'Sapporo':[148,18],'Fukuoka':[44,176],'Nagasaki':[38,180],'Kanazawa':[80,112],'Nikko':[100,100],'Hakone':[90,118],'Takayama':[82,110],'Nagoya':[82,128],'Kobe':[70,144],'Sendai':[110,84],'Kamakura':[94,114],'Miyajima':[54,160],'Matsumoto':[86,112],'Beppu':[50,168],'Yakushima':[42,200]}},
  'thaïlande':{vb:'0 0 110 230',path:'M28,8 C38,4 54,4 66,8 C78,12 86,20 88,32 C90,44 84,56 82,68 C80,80 82,92 78,102 C74,112 66,118 62,126 C58,134 58,142 54,150 C50,158 46,164 42,172 C38,180 36,188 34,196 C32,204 32,212 30,218 L28,222 C26,218 24,212 26,204 C28,196 30,188 32,182 C34,176 36,168 38,160 C40,152 42,144 44,136 C46,128 50,120 52,112 C54,104 54,96 56,88 C58,80 62,74 64,66 C66,58 64,48 66,38 C68,28 72,18 66,12 C60,6 50,8 40,8 Z',cities:{'Bangkok':[62,96],'Chiang Mai':[36,24],'Chiang Rai':[40,12],'Phuket':[34,184],'Koh Samui':[52,154],'Ayutthaya':[58,82],'Pai':[30,16],'Krabi':[38,172],'Kanchanaburi':[44,100],'Sukhothai':[44,58],'Lopburi':[56,78],'Phetchaburi':[50,118],'Hua Hin':[48,122],'Koh Lanta':[40,176],'Koh Phangan':[50,148],'Mae Hong Son':[22,20],'Lampang':[38,36],'Nan':[52,30],'Udon Thani':[70,54],'Koh Tao':[48,142]}},
  'indonesie':{vb:'0 0 400 160',path:'M2.6,4.7 L13.0,7.5 L21.8,11.3 L30.4,20.7 L39.1,30.1 L47.8,39.5 L56.5,48.9 L65.2,58.3 L73.9,67.7 L82.6,77.1 L91.3,86.5 L95.7,94.0 L95.7,103.4 L91.3,108.1 L82.6,109.0 L73.9,106.2 L65.2,101.5 L56.5,94.0 L47.8,86.5 L39.1,79.9 L30.4,73.3 L21.8,67.7 L13.0,61.1 L4.3,51.7 L0.0,42.3 L0.0,32.9 L0.0,23.5 L1.7,14.1 L2.6,4.7Z M87.0,110.9 L100.0,112.8 L113.1,117.5 L126.1,120.3 L139.2,122.2 L152.2,124.1 L165.3,126.9 L174.0,131.6 L169.6,136.3 L156.6,134.4 L143.5,131.6 L130.5,129.7 L117.4,126.9 L104.4,124.1 L91.3,117.5 L87.0,110.9Z M117.4,42.3 L126.1,39.5 L134.8,42.3 L143.5,45.1 L152.2,47.0 L160.9,45.1 L169.6,39.5 L178.3,37.6 L187.0,42.3 L191.4,51.7 L195.7,61.1 L195.7,70.5 L187.0,79.9 L178.3,89.3 L169.6,94.0 L160.9,95.9 L152.2,94.0 L143.5,89.3 L134.8,79.9 L126.1,70.5 L117.4,61.1 L113.1,51.7 L117.4,42.3Z M217.5,51.7 L226.2,47.0 L234.9,48.9 L239.2,56.4 L234.9,63.9 L226.2,70.5 L221.8,79.9 L217.5,89.3 L221.8,94.0 L226.2,98.7 L230.5,94.0 L234.9,89.3 L239.2,84.6 L234.9,98.7 L230.5,108.1 L224.5,103.4 L217.5,94.0 L213.1,89.3 L208.8,84.6 L213.1,75.2 L217.5,65.8 L217.5,51.7Z M169.6,132.5 L174.0,131.6 L178.3,133.5 L180.1,138.2 L175.7,140.1 L171.4,139.1 L168.8,136.3 L169.6,132.5Z M181.0,133.5 L184.4,133.5 L187.0,136.3 L185.3,140.1 L181.8,140.1 L180.1,137.2 L181.0,133.5Z M187.0,134.4 L195.7,135.4 L204.4,139.1 L213.1,141.0 L221.8,145.7 L230.5,148.5 L234.9,145.7 L226.2,141.0 L217.5,139.1 L208.8,136.3 L200.1,132.5 L191.4,130.7 L187.0,134.4Z M313.2,56.4 L321.9,61.1 L330.6,65.8 L339.3,73.3 L348.0,79.9 L356.7,84.6 L365.4,89.3 L374.1,94.0 L382.8,98.7 L391.5,103.4 L395.8,108.1 L391.5,112.8 L382.8,117.5 L374.1,122.2 L365.4,126.9 L356.7,124.1 L348.0,120.3 L339.3,117.5 L330.6,112.8 L321.9,108.1 L317.5,103.4 L313.2,94.0 L313.2,75.2 L313.2,56.4Z',cities:{'Jakarta':[102.7,114.7],'Yogyakarta':[134.0,129.7],'Surabaya':[154.0,125.0],'Bali':[175.7,135.4],'Ubud':[176.6,136.3],'Seminyak':[174.9,138.2],'Lombok':[183.6,137.2],'Labuan Bajo':[216.6,136.3],'Komodo':[213.1,137.2],'Flores':[226.2,139.1],'Raja Ampat':[308.8,61.1],'Manado':[259.3,42.3],'Makassar':[212.3,104.3],'Medan':[32.2,22.6],'Banda Aceh':[2.6,4.7],'Padang':[47.0,64.9],'Palembang':[84.4,84.6],'Balikpapan':[189.7,68.6],'Jayapura':[397.6,79.9],'Sorong':[315.8,64.9],'Gili':[182.7,135.4],'Amed':[179.2,134.4],'Sumbawa':[195.7,138.2],'Nusa Penida':[178.3,139.1]}},
  'bali':{vb:'0 0 160 90',path:'M12,45 C16,30 28,20 44,16 C60,12 78,14 94,20 C110,26 122,36 126,48 C130,60 124,72 112,78 C100,84 84,84 68,80 C52,76 36,68 22,58 C8,48 8,60 12,45Z',cities:{'Ubud':[82,46],'Seminyak':[38,54],'Canggu':[30,50],'Kuta':[40,60],'Sanur':[60,62],'Nusa Dua':[58,70],'Amed':[128,38],'Candidasa':[116,48],'Lovina':[36,24],'Bedugul':[56,28],'Munduk':[42,30],'Uluwatu':[52,72],'Jimbaran':[48,64],'Denpasar':[56,58],'Padang Bai':[108,50],'Nusa Penida':[80,78]}},
  'sri_lanka':{vb:'0 0 80 120',path:'M40,6 C50,6 60,12 66,22 C72,32 72,44 70,56 C68,68 64,80 58,90 C52,100 46,108 40,112 C34,116 26,112 20,104 C14,96 12,84 12,72 C12,60 14,48 18,38 C22,28 24,18 30,12 C36,6 30,6 40,6Z',cities:{'Colombo':[18,72],'Kandy':[44,54],'Galle':[28,104],'Sigiriya':[50,38],'Ella':[56,78],'Trincomalee':[66,28],'Anuradhapura':[40,28],'Polonnaruwa':[56,42],'Jaffna':[38,8],'Mirissa':[36,108],'Tangalle':[42,110],'Negombo':[16,62],'Nuwara Eliya':[48,68],'Yala':[54,100],'Arugam Bay':[70,72],'Dambulla':[46,44],'Pinnawala':[32,58]}},
  'maldives':{vb:'0 0 50 190',path:'M25,8 C29,5 33,9 31,15 C29,21 23,21 21,15 C19,9 21,11 25,8Z M24,36 C28,31 34,33 34,39 C34,45 28,49 24,45 C20,41 20,41 24,36Z M26,62 C30,57 36,59 36,65 C36,71 30,75 26,71 C22,67 22,67 26,62Z M23,88 C28,83 34,87 32,93 C30,99 24,99 22,93 C20,87 18,93 23,88Z M25,114 C30,109 36,113 34,119 C32,125 26,125 24,119 C22,113 20,119 25,114Z M24,140 C29,135 35,139 33,145 C31,151 25,151 23,145 C21,139 19,145 24,140Z M25,166 C29,161 35,165 33,171 C31,177 25,177 23,171 C21,165 21,171 25,166Z',cities:{'Malé':[26,88],'Hulhumalé':[26,80],'Maafushi':[26,100],'Thulusdhoo':[26,72],'Rasdhoo':[26,62],'Reethi Beach':[26,52],'Baros':[26,82],'Soneva Fushi':[26,42]}},
  'perou':{vb:'0 0 120 150',path:'M18,14 C28,6 44,4 58,8 C72,12 84,22 90,36 C96,50 94,66 90,80 C86,94 78,106 72,118 C66,130 62,140 54,144 C46,148 36,144 28,136 C20,128 16,116 14,104 C12,92 12,78 14,66 C16,54 14,40 14,28 Z',cities:{'Lima':[14,80],'Cusco':[64,108],'Machu Picchu':[54,100],'Arequipa':[34,120],'Puno':[72,116],'Iquitos':[94,42],'Trujillo':[16,48],'Nazca':[22,108],'Huaraz':[28,58],'Paracas':[16,92],'Titicaca':[72,118],'Colca':[36,116],'Pisac':[60,104],'Ollantaytambo':[58,104],'Aguas Calientes':[54,102],'Chachapoyas':[44,42]}},
  'kenya':{vb:'0 0 120 130',path:'M22,10 C36,4 54,4 68,8 C82,12 92,22 98,36 C104,50 102,66 98,80 C94,94 84,104 70,110 C56,116 40,116 26,110 C12,104 4,92 4,78 C4,64 8,50 10,36 C12,22 8,16 22,10Z',cities:{'Nairobi':[54,68],'Mombasa':[86,100],'Masai Mara':[26,80],'Amboseli':[56,96],'Tsavo':[70,90],'Samburu':[68,36],'Lamu':[96,40],'Malindi':[94,62],'Watamu':[92,58],'Nakuru':[38,60],'Kisumu':[24,66],'Eldoret':[24,46],'Diani':[86,104],'Hell\'s Gate':[40,64],'Mt Kenya':[60,50]}},
  'islande':{vb:'0 0 230 120',path:'M22,58 C18,44 24,30 38,20 C52,10 68,6 86,6 C104,6 122,10 138,16 C154,22 166,32 174,46 C182,60 182,76 174,88 C166,100 152,108 136,112 C120,116 102,116 84,112 C66,108 48,102 34,92 C20,82 14,72 10,60 C14,56 18,60 22,58Z',cities:{'Reykjavik':[38,86],'Akureyri':[100,18],'Vik':[96,106],'Jökulsárlón':[152,90],'Skaftafell':[136,96],'Kirkjufell':[28,44],'Snæfellsnes':[22,58],'Landmannalaugar':[96,88],'Húsavík':[110,12],'Mývatn':[116,20],'Dettifoss':[126,18],'Þórsmörk':[86,94],'Geysir':[72,86],'Gullfoss':[76,84],'Blue Lagoon':[32,90],'Vestmannaeyjar':[66,108]}},
  'jordanie':{vb:'0 0 100 120',path:'M48,8 C60,8 72,14 80,24 C88,34 90,48 88,62 C86,76 78,88 68,96 C58,104 44,108 32,104 C20,100 10,90 8,78 C6,66 10,52 16,40 C22,28 26,16 36,10 C46,4 36,8 48,8Z',cities:{'Amman':[48,44],'Pétra':[38,84],'Wadi Rum':[44,100],'Aqaba':[36,110],'Jerash':[44,32],'Madaba':[42,52],'Kerak':[40,66],'Dana':[36,72],'Azraq':[68,38],'Umm Qais':[28,20],'Mer Morte':[30,56],'Wadi Mujib':[32,64]}},
  'sardaigne':{vb:'0 0 100 160',path:'M50,6 C56,6 63,9 68,14 C73,19 75,26 76,33 C77,40 74,46 76,53 C78,60 82,65 80,73 C78,81 73,86 70,93 C67,100 67,108 63,116 C59,124 53,130 46,134 C39,138 31,136 25,130 C19,124 17,116 17,108 C17,100 20,93 20,85 C20,77 16,70 17,62 C18,54 23,48 25,40 C27,32 25,23 29,16 C33,9 42,6 50,6Z',cities:{'Cagliari':[46,128],'Oristano':[28,82],'Nuoro':[58,64],'Sassari':[32,24],'Alghero':[20,34],'Olbia':[68,22],'Villasimius':[66,132],'Chia':[36,140],'Barumini':[46,104],'Bosa':[22,60],'Palau':[68,14],'La Maddalena':[72,10],'Costa Smeralda':[70,16],'Pula':[44,136],'Arbatax':[72,100],'Cala Gonone':[68,76],'Orgosolo':[56,76],'Fonni':[54,76]}},
  'sicile':{vb:'0 0 200 130',path:'M8,75 C12,58 20,42 34,30 C48,18 64,10 82,8 C100,6 118,10 134,18 C150,26 162,38 170,52 C178,66 178,82 172,94 C166,106 154,114 140,118 C126,122 110,120 94,116 C78,112 62,104 48,96 C34,88 18,94 10,88 C2,82 4,92 8,75Z',cities:{'Palerme':[52,28],'Catane':[148,82],'Messine':[174,38],'Agrigente':[76,104],'Siracuse':[162,96],'Trapani':[18,42],'Taormine':[162,70],'Raguse':[138,106],'Noto':[150,100],'Cefalù':[86,20],'Marsala':[20,70],'Modica':[140,108],'Piazza Armerina':[110,90],'Érice':[24,36],'Ustica':[42,10]}},
  'corse':{vb:'0 0 70 140',path:'M36,6 C42,6 50,10 55,18 C60,26 60,36 58,46 C56,56 60,64 58,74 C56,84 50,90 48,100 C46,110 48,120 44,128 C40,136 32,138 26,132 C20,126 18,116 18,106 C18,96 20,86 20,76 C20,66 16,56 16,46 C16,36 18,26 22,18 C26,10 30,6 36,6Z',cities:{'Ajaccio':[22,90],'Bastia':[54,22],'Bonifacio':[40,132],'Corte':[40,64],'Porto-Vecchio':[50,120],'Calvi':[20,28],'Porto':[14,52],'Propriano':[28,108],'Île Rousse':[26,22],'Sartène':[30,112],'Solenzara':[54,100],'Aléria':[52,72]}},
  'portugal_iles':{vb:'0 0 55 130',path:'M28,6 C36,4 44,8 48,16 C52,24 50,34 50,44 C50,54 52,64 50,74 C48,84 44,92 40,100 C36,108 34,116 28,118 C22,120 16,114 12,106 C8,98 8,86 8,74 C8,62 10,50 10,38 C10,26 8,14 14,8 C20,2 20,8 28,6Z',cities:{'Lisbonne':[24,80],'Porto':[22,28],'Faro':[36,112],'Évora':[36,82],'Coimbra':[22,50],'Braga':[16,20],'Sintra':[14,78],'Algarve':[32,116],'Óbidos':[16,64],'Nazaré':[14,60],'Tavira':[38,116],'Lagos':[22,118]}},
  'vietnam':{vb:'0 0 80 240',path:'M50,8 C58,6 66,10 70,18 C74,26 72,36 68,46 C64,56 58,64 54,74 C50,84 48,96 44,108 C40,120 36,132 34,144 C32,156 32,168 34,178 C36,188 40,196 38,204 C36,212 30,216 24,212 C18,208 14,200 12,192 C10,184 10,174 12,164 C14,154 18,144 20,134 C22,124 22,114 24,104 C26,94 28,84 30,74 C32,64 32,54 34,44 C36,34 36,22 42,14 Z',cities:{'Hanoï':[44,46],'Hô Chi Minh':[26,204],'Hôi An':[36,134],'Hué':[34,120],'Da Nang':[36,128],'Ha Long':[58,34],'Ninh Binh':[40,64],'Sapa':[32,24],'Dalat':[30,174],'Nha Trang':[28,186],'Phú Quốc':[14,212],'Mũi Né':[26,192],'Hội An':[36,134],'Mékong':[22,210]}},
  'mexique':{vb:'0 0 210 180',path:'M14,40 C22,26 36,16 54,12 C72,8 92,8 110,12 C128,16 144,24 156,34 C168,44 174,56 176,70 C178,84 172,96 164,106 C156,116 144,124 130,130 C116,136 100,140 84,140 C68,140 52,136 38,128 C24,120 12,108 8,94 C4,80 4,64 8,52 Z M152,90 C158,84 168,82 176,88 C184,94 184,104 178,110 C172,116 162,114 158,108 C154,102 146,96 152,90Z',cities:{'Mexico':[100,88],'Cancún':[176,96],'Oaxaca':[96,120],'San Cristóbal':[102,136],'Mérida':[152,82],'Guadalajara':[54,86],'Tulum':[178,104],'Guanajuato':[74,82],'Palenque':[118,122],'Puerto Vallarta':[44,92],'Chichen Itza':[154,86],'Teotihuacan':[106,82],'Taxco':[96,100],'Puebla':[108,96],'Monterrey':[96,44],'Loreto':[26,68],'Cabo':[20,108],'Morelia':[78,94]}},
  'egypte':{vb:'0 0 150 170',path:'M40,8 C54,4 70,4 84,8 C98,12 108,22 114,34 C120,46 118,60 112,72 C106,84 96,92 84,98 C72,104 58,106 46,102 C34,98 22,90 14,78 C6,66 4,52 6,38 C8,24 12,14 26,8 Z M60,102 C60,102 70,140 76,152 C82,164 74,170 66,168 C58,166 52,156 48,144 C44,132 50,102 60,102Z',cities:{'Le Caire':[74,60],'Assouan':[68,148],'Louxor':[70,132],'Alexandrie':[54,12],'Hurghada':[104,90],'Charm el-Cheikh':[112,110],'Siwa':[16,52],'Dahab':[116,102],'Abou Simbel':[62,162],'Dakhla':[36,88],'Vallée des Rois':[68,130],'Memphis':[68,70],'Gizeh':[72,62],'Saqqara':[70,68],'Karnak':[70,132]}},
  'turquie':{vb:'0 0 240 150',path:'M18,50 C26,34 40,22 58,16 C76,10 96,8 116,10 C136,12 154,18 168,28 C182,38 190,50 194,64 C198,78 194,92 186,104 C178,116 166,124 152,130 C138,136 122,138 106,136 C90,134 74,128 60,120 C46,112 34,102 24,90 C14,78 10,64 14,52 Z M192,62 C198,56 208,54 214,60 C220,66 220,76 214,82 C208,88 198,86 194,80 C190,74 186,68 192,62Z',cities:{'Istanbul':[38,34],'Cappadoce':[140,78],'Éphèse':[62,90],'Pamukkale':[84,96],'Antalya':[120,114],'Ankara':[130,56],'Göreme':[142,78],'Bodrum':[72,106],'Izmir':[58,88],'Trabzon':[168,28],'Kas':[104,118],'Side':[126,114],'Alanya':[134,116],'Fethiye':[88,110],'Ölüdeniz':[84,110],'Doğubayazıt':[210,64],'Mardin':[188,86]}},
  'cambodge':{vb:'0 0 120 110',path:'M24,14 C36,8 52,6 66,10 C80,14 90,22 96,34 C102,46 100,60 96,72 C92,84 82,92 70,98 C58,104 44,104 32,98 C20,92 10,82 6,68 C2,54 4,40 8,28 Z',cities:{'Phnom Penh':[62,72],'Siem Reap':[44,36],'Angkor Wat':[42,34],'Sihanoukville':[36,92],'Battambang':[28,40],'Kampot':[44,96],'Kep':[50,98],'Mondulkiri':[92,60],'Koh Rong':[30,96],'Tonlé Sap':[50,54],'Kratie':[82,50]}},
  'laos':{vb:'0 0 90 200',path:'M38,8 C46,4 56,6 62,14 C68,22 66,32 62,42 C58,52 52,60 48,70 C44,80 42,90 40,102 C38,114 36,126 36,138 C36,150 36,162 38,172 C40,182 42,190 40,196 C38,202 32,204 26,198 C20,192 18,182 18,172 C18,162 20,150 22,138 C24,126 26,114 26,102 C26,90 24,78 26,68 C28,58 32,48 34,38 C36,28 30,18 38,8Z',cities:{'Vientiane':[34,142],'Luang Prabang':[36,68],'Vang Vieng':[32,104],'Pakse':[36,178],'Si Phan Don':[34,188],'Phonsavan':[54,80],'Sam Neua':[56,40],'Huay Xai':[16,52],'Savannakhet':[40,162],'Nong Khiaw':[38,56]}},
  'maroc_detaille':{vb:'0 0 170 150',path:'M20,14 C32,8 50,8 66,10 C82,12 96,18 108,26 C120,34 128,44 132,56 C136,68 134,80 130,90 C126,100 118,108 108,114 C98,120 86,124 72,126 C58,128 44,126 32,120 C20,114 10,104 6,92 C2,80 2,66 4,54 C6,42 10,30 20,14Z',cities:{'Marrakech':[72,84],'Casablanca':[36,50],'Fès':[88,34],'Rabat':[42,38],'Tanger':[46,12],'Agadir':[34,106],'Essaouira':[24,78],'Chefchaouen':[62,16],'Ouarzazate':[88,96],'Merzouga':[118,88],'Aït Ben Haddou':[82,92],'Ifrane':[80,52],'Gorges Dadès':[94,90],'Gorges Todra':[100,88],'Taroudant':[52,102],'Tiznit':[44,112],'Guelmim':[34,118],'Midelt':[88,60]}},
  'australie':{vb:'0 0 260 240',path:'M30,60 C40,40 56,24 76,16 C96,8 118,8 138,12 C158,16 176,24 190,36 C204,48 212,64 216,80 C220,96 218,114 212,130 C206,146 194,160 180,172 C166,184 150,192 132,196 C114,200 94,200 76,196 C58,192 40,184 26,172 C12,160 2,144 2,126 C2,108 4,92 10,76 C16,60 20,80 30,60Z M60,170 C68,168 76,172 80,178 C84,184 82,192 76,196 C70,200 62,196 58,190 C54,184 52,172 60,170Z',cities:{'Sydney':[210,142],'Melbourne':[192,168],'Brisbane':[220,114],'Perth':[42,138],'Adélaïde':[160,160],'Darwin':[106,32],'Cairns':[196,68],'Alice Springs':[130,106],'Uluru':[118,118],'Gold Coast':[218,120],'Hobart':[200,188],'Canberra':[204,158],'Great Barrier Reef':[206,76],'Kakadu':[106,28]}},
  'costa_rica':{vb:'0 0 110 80',path:'M10,40 C16,26 28,16 44,12 C60,8 76,10 88,18 C100,26 106,38 104,52 C102,66 90,74 76,76 C62,78 46,74 32,66 C18,58 4,52 10,40Z',cities:{'San José':[58,44],'Manuel Antonio':[36,58],'Arenal':[40,34],'Monteverde':[34,36],'Tortuguero':[82,30],'Puerto Viejo':[88,56],'Jacó':[40,50],'La Fortuna':[42,32],'Quepos':[36,56],'Tamarindo':[18,34],'Nosara':[18,44],'Dominical':[34,60]}},
  'eoliennes':{vb:'0 0 180 120',path:'M58,52 C64,44 74,40 82,44 C90,48 92,58 88,66 C84,74 74,78 66,74 C58,70 52,60 58,52Z M30,72 C35,62 46,58 54,62 C62,66 62,78 56,84 C50,90 38,88 32,82 C26,76 25,82 30,72Z M140,22 C146,16 156,16 162,22 C168,28 166,38 160,42 C154,46 144,44 140,38 C136,32 134,28 140,22Z M100,68 C104,62 112,62 116,68 C120,74 118,82 112,84 C106,86 100,82 98,76 C96,70 96,74 100,68Z M76,14 C80,10 86,10 90,14 C94,18 92,26 88,28 C84,30 78,28 76,22 C74,16 72,18 76,14Z',cities:{'Lipari':[74,58],'Vulcano':[42,78],'Stromboli':[150,30],'Salina':[106,74],'Panarea':[83,20],'Filicudi':[28,68],'Alicudi':[8,64]}},
  'malte':{vb:'0 0 80 60',path:'M8,30 C12,18 24,10 38,8 C52,6 66,12 72,24 C78,36 74,50 62,56 C50,62 34,60 22,54 C10,48 4,42 8,30Z',cities:{'La Valette':[48,28],'Mdina':[34,30],'Marsaxlokk':[54,46],'Gozo':[14,18],'Comino':[28,14],'Mellieħa':[20,12],'Birgu':[52,36],'Sliema':[46,24]}},
  '_default':{vb:'0 0 120 120',path:'M60,8 C74,8 86,16 94,28 C102,40 104,56 100,70 C96,84 86,94 74,102 C62,110 46,112 34,106 C22,100 12,88 8,74 C4,60 6,44 14,32 C22,20 34,10 48,8 Z',cities:{}},
};

function _geoShapeSD(dest){
  var d=(dest||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  function g(k){return{key:k,g:GEO_SHAPES_SD[k]||GEO_SHAPES_SD._default};}
  if(/indonesie|indonesia|bali|lombok|java|sumatra|flores|komodo|sumbawa|sulawesi|raja ampat|gili/.test(d))return g('indonesie');
  if(/sardaigne|cagliari|nuoro|sassari|alghero|olbia|oristano|bosa|palau|barumini|cala gonone/.test(d))return g('sardaigne');
  if(/sicile|palerm|catane|agrigente|siracuse|taormine|messine|noto|raguse|cefalu|erice/.test(d))return g('sicile');
  if(/eolienn|lipari|stromboli|vulcano|salina|panarea|filicudi|alicudi/.test(d))return g('eoliennes');
  if(/corse|ajaccio|bastia|bonifacio|corte|porto vecchio|calvi/.test(d))return g('corse');
  if(/malte|valette|gozo|mdina|comino/.test(d))return g('malte');
  if(/sri lanka|colombo|kandy|galle|sigiriya|ella|trincomalee|anuradhapura|polonnaruwa|jaffna|mirissa|negombo|nuwara|yala|arugam/.test(d))return g('sri_lanka');
  if(/maldive|male|atoll|hulhule|maafushi|thulusdhoo/.test(d))return g('maldives');
  if(/thai|bangkok|phuket|chiang mai|chiang rai|koh samui|koh phangan|koh tao|ayutthaya|pai|krabi|kanchanaburi|mae hong son|hua hin/.test(d))return g('thaïlande');
  if(/grece|athenes|santorin|mykonos|corfou|rhodes|crete|meteores|delphes|olympie|nauplie|sparte|paros|naxos|zakynthos|kos/.test(d))return g('grece');
  if(/japon|tokyo|kyoto|osaka|hiroshima|sapporo|fukuoka|nara|hakone|nikko|kanazawa|nagasaki|takayama|sendai|kamakura|miyajima|okinawa/.test(d))return g('japon');
  if(/maroc|marrakech|casablanca|fes|rabat|tanger|agadir|essaouira|chefchaouen|ouarzazate|merzouga|ait ben haddou|dades|todra/.test(d))return g('maroc');
  if(/espagne|madrid|barcelone|seville|valence|bilbao|grenade|malaga|saragosse|tolede|cordoue|burgos|salamanque|san sebastian|alicante|majorque|ibiza|cadix|ronda|pampelune/.test(d))return g('espagne');
  if(/italie|rome|milan|venise|florence|naples|turin|bologne|genes|amalfi|positano|capri|pompei|cinque terre|toscane|ombrie|verone|pise|sienne|assise|pouilles|calabre|bari/.test(d))return g('italie');
  if(/portugal|lisbonne|porto|faro|evora|coimbra|braga|algarve|sintra|nazare|obidos|lagos|tavira|douro/.test(d))return g('portugal');
  if(/islande|reykjavik|akureyri|vik|jokulsarlon|skaftafell|kirkjufell|snaefellsnes|husavik|myvatn|dettifoss|geysir|gullfoss/.test(d))return g('islande');
  if(/perou|lima|cusco|machu picchu|arequipa|puno|iquitos|trujillo|nazca|huaraz|paracas|titicaca|colca/.test(d))return g('perou');
  if(/kenya|nairobi|mombasa|masai mara|amboseli|tsavo|samburu|lamu|malindi|nakuru|kisumu|diani/.test(d))return g('kenya');
  if(/jordanie|amman|petra|wadi rum|aqaba|jerash|madaba|kerak|dana|mer morte/.test(d))return g('jordanie');
  if(/france|paris|lyon|marseille|bordeaux|toulouse|nice|nantes|strasbourg|lille|biarritz|brest|montpellier|annecy|avignon|saint-malo|carcassonne|aix|colmar|chamonix|versailles|loire|dordogne|provence|alsace|bretagne|normandie|perigord/.test(d))return g('france');
  if(/vietnam|hanoi|ho chi minh|hoi an|hue|da nang|ha long|ninh binh|sapa|dalat|nha trang|phu quoc|mui ne|mekong/.test(d))return g('vietnam');
  if(/mexique|mexico|cancun|oaxaca|san cristobal|merida|guadalajara|tulum|guanajuato|palenque|puerto vallarta|chichen itza|teotihuacan|taxco|puebla|cabo/.test(d))return g('mexique');
  if(/egypte|le caire|assouan|louxor|alexandrie|hurghada|charm el cheikh|siwa|dahab|abou simbel|gizeh/.test(d))return g('egypte');
  if(/turquie|istanbul|cappadoce|ephese|pamukkale|antalya|ankara|goreme|bodrum|izmir|trabzon|kas|fethiye|olüdeniz/.test(d))return g('turquie');
  if(/cambodge|phnom penh|siem reap|angkor|sihanoukville|battambang|kampot|koh rong/.test(d))return g('cambodge');
  if(/laos|vientiane|luang prabang|vang vieng|pakse|si phan don|huay xai/.test(d))return g('laos');
  if(/australie|sydney|melbourne|brisbane|perth|adelaide|darwin|cairns|alice springs|uluru|gold coast|hobart/.test(d))return g('australie');
  if(/costa rica|san jose|manuel antonio|arenal|monteverde|tortuguero|tamarindo/.test(d))return g('costa_rica');
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

