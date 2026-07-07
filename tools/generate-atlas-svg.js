#!/usr/bin/env node
/* ── HIC SUNT · Atlas Vivant — génération de la carte SVG (one-shot) ─────
   Ne tourne JAMAIS au runtime de l'app : ce script Node est exécuté à la
   main, une fois (ou à chaque mise à jour souhaitée de la carte), et son
   résultat (atlas-map-data.js) est commité dans le repo comme un simple
   fichier statique chargé par index.html.

   Pourquoi pas de projection/dessin à la volée dans le navigateur ?
   Charger le GeoJSON Natural Earth + une lib de projection (d3-geo) au
   runtime et projeter/simplifier à chaque ouverture de l'écran Atlas est
   lent et gourmand en mémoire sur Safari iOS. Ici, tout le travail lourd
   (téléchargement, projection Robinson, simplification topologique,
   réduction de précision) est fait une fois hors-ligne ; le runtime se
   contente d'injecter une chaîne SVG déjà prête et de basculer des classes
   CSS sur les <path> — zéro calcul géométrique dans l'app.

   Usage :
     cd tools && npm install d3-geo d3-geo-projection topojson-server \
       topojson-simplify topojson-client
     node generate-atlas-svg.js
   → écrit atlas-map-data.js à la racine du repo (chargé par index.html).

   Dépendances : uniquement utilisées ici, jamais ajoutées au runtime de
   l'app (pas de package.json/bundler dans Hic Sunt — vanilla JS assumé).
   ─────────────────────────────────────────────────────────────────────── */
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');

/* Résolution 50m plutôt que 110m : la résolution 110m OMET purement et
   simplement une vingtaine de micro-États/petites îles (Malte, Maldives,
   Singapour, Monaco...) qui font pourtant partie du catalogue de
   destinations Hic Sunt existant — inacceptable pour un atlas censé
   couvrir 195 territoires. Le 50m les inclut quasiment tous ; seul le
   Kosovo (frontières disputées, souvent fusionné avec la Serbie dans
   Natural Earth) reste sans tracé indépendant — un unlock reste enregistré
   correctement en base, simplement sans pays à illuminer sur la carte. */
const NE_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';
const CACHE_DIR = path.join(__dirname, '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'ne_50m_admin_0_countries.geojson');
const OUTPUT_FILE = path.join(__dirname, '..', 'atlas-map-data.js');

const WIDTH = 980, HEIGHT = 520;
/* Poids minimal (Visvalingam) sous lequel un point est retiré lors de la
   simplification topologique — choisi empiriquement : assez agressif pour
   rester sous ~150 Ko, assez fin pour garder les petites îles/pays
   reconnaissables à l'échelle mobile. À ajuster si la carte est régénérée
   avec une résolution Natural Earth différente (110m/10m). */
const MIN_WEIGHT = 0.1;

function fetchGeojson(){
  return new Promise(function(resolve, reject){
    if(fs.existsSync(CACHE_FILE)){
      console.log('[atlas-svg] cache trouvé:', CACHE_FILE);
      resolve(JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')));
      return;
    }
    console.log('[atlas-svg] téléchargement Natural Earth 50m…');
    https.get(NE_URL, function(res){
      if(res.statusCode !== 200){ reject(new Error('HTTP '+res.statusCode)); return; }
      var chunks = [];
      res.on('data', function(c){ chunks.push(c); });
      res.on('end', function(){
        var body = Buffer.concat(chunks).toString('utf8');
        try{
          if(!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
          fs.writeFileSync(CACHE_FILE, body);
        }catch(e){ /* cache best-effort, pas bloquant */ }
        resolve(JSON.parse(body));
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

/* ISO_A3 vaut parfois "-99" (bug connu Natural Earth, ex. France, Norvège,
   Kosovo) : on retombe alors sur les champs de repli disponibles. */
function isoOf(props){
  var candidates = [props.ISO_A3, props.ISO_A3_EH, props.ADM0_A3, props.SOV_A3];
  for(var i=0; i<candidates.length; i++){
    var c = candidates[i];
    if(c && c !== '-99') return c;
  }
  return null;
}

/* d3.geoPath produit des coordonnées à 6+ décimales (précision GPS) —
   inutile pour un viewBox de 980x520 affiché sur mobile. Arrondir au
   dixième d'unité SVG réduit le poids du fichier d'environ moitié, sans
   perte visible. */
function roundPathPrecision(d){
  return d.replace(/-?\d+\.\d+/g, function(n){ return String(Math.round(parseFloat(n) * 10) / 10); });
}

async function main(){
  var d3geo, d3geoProjection, topojsonServer, topojsonSimplify, topojsonClient;
  try{
    d3geo = require('d3-geo');
    d3geoProjection = require('d3-geo-projection');
    topojsonServer = require('topojson-server');
    topojsonSimplify = require('topojson-simplify');
    topojsonClient = require('topojson-client');
  }catch(e){
    console.error('[atlas-svg] dépendances manquantes. Lancez d\'abord :');
    console.error('  npm install d3-geo d3-geo-projection topojson-server topojson-simplify topojson-client');
    process.exit(1);
  }

  var raw = await fetchGeojson();

  /* Antarctique hors-sujet pour un atlas de voyage — et déforme l'échelle
     verticale de la projection pour rien. */
  raw.features = raw.features.filter(function(f){
    return f.properties && f.properties.CONTINENT !== 'Antarctica';
  });

  var missingIso = [];
  raw.features.forEach(function(f){
    var iso = isoOf(f.properties);
    if(!iso) missingIso.push(f.properties.NAME || f.properties.ADMIN);
    f.properties._iso = iso;
  });
  if(missingIso.length){
    console.warn('[atlas-svg] ATTENTION — pays sans ISO résolu (exclus):', missingIso.join(', '));
    raw.features = raw.features.filter(function(f){ return f.properties._iso; });
  }

  /* Topologie + simplification : partage les arcs entre pays frontaliers
     pour que la simplification ne crée pas de trous aux frontières
     communes (contrairement à une simplification géométrie-par-géométrie). */
  var topology = topojsonServer.topology({ countries: raw });
  var presimplified = topojsonSimplify.presimplify(topology);
  var simplified = topojsonSimplify.simplify(presimplified, MIN_WEIGHT);
  var geojson = topojsonClient.feature(simplified, simplified.objects.countries);

  /* Robinson : projection pseudo-cylindrique ovale, l'esthétique "atlas
     ancien" classique — contrairement à l'équirectangulaire (grille plate,
     très étirée aux pôles) ou Mercator (distord grossièrement les surfaces). */
  var projection = d3geoProjection.geoRobinson().fitSize([WIDTH, HEIGHT], geojson);
  var pathGen = d3geo.geoPath(projection);

  var labels = {}; /* ISO3 -> nom français (source Natural Earth NAME_FR) */
  var paths = geojson.features.map(function(f){
    var d = pathGen(f);
    if(!d) return '';
    var iso = f.properties._iso;
    if(f.properties.NAME_FR) labels[iso] = f.properties.NAME_FR;
    return '<path data-iso="' + iso + '" d="' + roundPathPrecision(d) + '"/>';
  }).filter(Boolean).join('');

  var svg = '<svg viewBox="0 0 ' + WIDTH + ' ' + HEIGHT + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Carte du monde">'
    + '<g class="atlas-countries">' + paths + '</g>'
    + '</svg>';

  var kb = (Buffer.byteLength(svg) / 1024).toFixed(1);
  console.log('[atlas-svg] '+geojson.features.length+' pays, '+kb+' Ko');
  if(Number(kb) > 150) console.warn('[atlas-svg] ATTENTION — dépasse 150 Ko, augmentez MIN_WEIGHT.');

  /* Sortie en fichier JS (pas .svg brut) pour un chargement <script> simple
     et un embarquement inline direct (innerHTML) sans requête réseau
     supplémentaire ni souci de CORS/type MIME. ATLAS_COUNTRY_LABELS
     accompagne la carte (nom FR par ISO3, pour le sceau de dévoilement) —
     directement issu des données Natural Earth, pas retapé à la main. */
  var js = '/* Généré par tools/generate-atlas-svg.js — ne pas éditer à la main.\n'
    + '   Régénérer : cd tools && node generate-atlas-svg.js */\n'
    + 'const ATLAS_MAP_SVG = ' + JSON.stringify(svg) + ';\n'
    + 'const ATLAS_COUNTRY_LABELS = ' + JSON.stringify(labels) + ';\n';
  fs.writeFileSync(OUTPUT_FILE, js);
  console.log('[atlas-svg] écrit:', OUTPUT_FILE, '('+Object.keys(labels).length+' libellés)');
}

main().catch(function(e){ console.error('[atlas-svg] échec:', e); process.exit(1); });
