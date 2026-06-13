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
    'Destination : '+(surprise||!state.destination?'SURPRISE — choisis la destination la plus désirable pour ce profil':state.destination),
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

/* ── Passe 1 : ossature + étapes ─────────────────────────────────────── */
function buildSkeletonPrompt(){
  const b=buildBrief();
  const dc=b.daysCount;
  return [
    'Tu es le cartographe senior de Hic Sunt, maison de voyages haut de gamme avec une exigence éditoriale absolue.',
    'Compose l\'OSSATURE d\'un itinéraire RÉEL, DÉSIRABLE et PRÉCIS.',
    '',
    '═══ BRIEF CLIENT ═══',
    b.lines,
    '',
    '═══ CONSIGNES STRICTES ═══',
    '- Étapes RÉELLES dans un ordre logique géographiquement (ne pas sauter d\'un bout à l\'autre du pays).',
    '- "plan" doit avoir EXACTEMENT '+Math.min(dc,10)+' entrées (une par jour'+(dc>10?', le voyage dure '+dc+' jours mais regroupe les jours similaires en étapes':'')+').',
    '- Hébergements VRAIS et plausibles ; gamme et budget adaptés au confort demandé. Pas plus de 5 hébergements différents.',
    '- "budget" = fourchette totale réaliste en euros pour TOUS les voyageurs (hébergements+repas+activités+transport local, hors vols).',
    '  · Éco: 60-100€/pers/j · Confort: 120-220€/pers/j · Luxe: 250-500€/pers/j · Ultra: 500€+/pers/j',
    '- "night" de chaque plan = "name" EXACT d\'un "stays".',
    '- sky dans [sun, cloud, rain].',
    '- Réponds UNIQUEMENT en JSON compact valide, sans texte ni markdown autour.',
    '',
    'SCHÉMA (respecte les types et clés exactement) :',
    '{"dest":"","country":"","tagline":"phrase poétique évocatrice","level":"Éco|Confort|Luxe|Ultra","dates":"ex: Août 2026 · 10 jours","days_count":'+dc+',"budget":0,"season":"meilleure saison courte","coords":"ex: 6°55′N · 79°51′E","region":"région","stays":[{"name":"vrai nom hébergement","type":"ex: Lodge safari","loc":"ville","price":0,"nights":1,"blurb":"max 6 mots évocateurs"}],"plan":[{"title":"titre évocateur","loc":"ville / zone","night":"nom exact stays","sky":"sun","temp":"27°","hook":"accroche 1 phrase narrative"}]}',
  ].join('\n');
}

/* ── Passe 2 : détail éditorial des jours ───────────────────────────── */
function buildDaysPrompt(skel){
  const b=buildBrief();
  const steps=(skel.plan||[]).map(function(p,i){return (i+1)+'. '+p.title+' — '+p.loc+(p.hook?' ('+p.hook+')':'');}).join('\n');
  const interests=(state.interests||[]).join(', ')||'découverte';
  const budget=state.budget||'Confort';
  return [
    'Tu es le cartographe de Hic Sunt. Tu rédiges les détails éditoriaux de chaque étape de cet itinéraire.',
    'Destination : '+skel.dest+' · Pays : '+(skel.country||'')+' · Confort : '+budget+' · Intérêts : '+interests,
    '',
    'ÉTAPES (dans l\'ordre, même ordre dans ta réponse) :',
    steps,
    '',
    '═══ CONSIGNES ÉDITORIALES STRICTES ═══',
    'Pour CHAQUE étape, donne :',
    '- "desc" : 2 phrases narratives et évocatrices (max 25 mots), style guide de voyage haut de gamme',
    '- "moments" : EXACTEMENT 3 moments réels et spécifiques à ce lieu — vrais noms de sites, restaurants, activités',
    '  · moment = {t:"heure", k:"icône", ti:"nom précis du lieu/activité", d:"détail local en 6 mots max"}',
    '  · k dans ['+GEN_KINDS.join(',')+']',
    '  · Inclure 1 repas avec VRAI nom de restaurant local, 1 activité phare, 1 moment contemplatif ou culturel',
    '- "tip" : conseil d\'initié spécifique à cette étape (ex: "arriver avant 7h pour éviter les groupes")',
    '- "restaurant" : {"name":"vrai nom","type":"ex: Rice & curry local","price":"ex: €€","note":"1 phrase"}',
    '- "wellness" : si intérêts incluent spa/bien-être, un vrai spa/massage local avec nom et prix. Sinon null.',
    '',
    'Réponds UNIQUEMENT en JSON compact valide :',
    '{"days":[{"desc":"","tip":"","restaurant":{"name":"","type":"","price":"","note":""},"wellness":null,"moments":[{"t":"07:30","k":"peaks","ti":"nom lieu","d":"détail court"}]}]}',
  ].join('\n');
}

/* ── Passe 3 : adresses, highlights, budget ─────────────────────────── */
function buildHighlightsPrompt(skel, days){
  const b=buildBrief();
  const dest=skel.dest||'';
  const interests=(state.interests||[]).join(', ')||'';
  const locs=(skel.plan||[]).map(function(p){return p.loc;}).filter(function(v,i,a){return a.indexOf(v)===i;}).join(', ');
  const wantSpa=interests.toLowerCase().includes('spa')||interests.toLowerCase().includes('bien-être');
  const wantNature=interests.toLowerCase().includes('nature')||interests.toLowerCase().includes('randonn');
  const wantBeach=interests.toLowerCase().includes('plage');
  const wantFood=interests.toLowerCase().includes('gastro')||interests.toLowerCase().includes('cuisine');
  return [
    'Expert voyages. Destination : '+dest+' · Étapes : '+locs,
    'Intérêts client : '+interests,
    '',
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
  ].join('\n');
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
function applyGenerated(skel, daysDetail, hilites){
  const dest=skel.dest||state.destination||'Votre voyage';
  const level=['Éco','Confort','Luxe','Ultra'].includes(skel.level)?skel.level:(state.budget||'Confort');
  const dc=_clampInt(skel.days_count, 1, 60, buildBrief().daysCount);

  /* hébergements */
  const ACC_PRICE_RANGE={'Éco':[30,90],'Confort':[80,200],'Luxe':[180,450],'Ultra':[400,1200]};
  const accRange=ACC_PRICE_RANGE[level]||ACC_PRICE_RANGE['Confort'];
  const stayTags=['Coup de cœur','Adresse rare','Signature Hic Sunt','Pépite locale','Écrin de sérénité'];
  const stayRates=['4,96','4,89','4,92','4,88','4,94'];
  const stays=(Array.isArray(skel.stays)?skel.stays:[]).slice(0,5).map(function(s,i){
    return {
      id:'a'+(i+1), n:s.name||('Hébergement '+(i+1)), i:_stayIcon(s.type),
      type:s.type||'Hôtel-boutique', loc:s.loc||dest,
      tag:stayTags[i]||'Sélection', rate:stayRates[i]||'4,9',
      nights:_clampInt(s.nights,1,14,2), price:_clampInt(s.price,accRange[0],accRange[1],Math.round((accRange[0]+accRange[1])/2)),
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

  /* jours enrichis avec le détail éditorial */
  const detailDays=(daysDetail&&Array.isArray(daysDetail.days))?daysDetail.days:[];
  const plan=(Array.isArray(skel.plan)?skel.plan:[]).map(function(p,i){
    const dd=detailDays[i]||{};
    const rawMoments=Array.isArray(dd.moments)&&dd.moments.length?dd.moments:[{t:'—',k:_momentIcon(p.title),ti:p.title||'Étape',d:''}];
    const moments=rawMoments.slice(0,3).map(function(m){return [m.t||'—',_kind(m.k||_momentIcon(m.ti)),m.ti||'Moment',m.d||''];});
    const tags=[];
    moments.forEach(function(m){if(tags.length<2&&!tags.some(function(t){return t[0]===m[1];}))tags.push(TAG_MAP[m[1]]||TAG_MAP.pin);});
    while(tags.length<2) tags.push(TAG_MAP.pin);
    const stay=findStay(p.night);
    return {
      n:i+1, title:p.title||('Étape '+(i+1)), loc:p.loc||dest,
      desc:dd.desc||p.hook||'', tip:dd.tip||'',
      tags:tags,
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
  let budgetTotal=_clampInt(skel.budget, minBudget, maxBudget*1.15, Math.round((minBudget+maxBudget)/2));
  /* le budget doit au moins couvrir l'hébergement */
  if(budgetTotal<stayCost) budgetTotal=Math.min(Math.round(stayCost*1.5), maxBudget*1.15);

  /* application */
  ITINERARY.plan.length=0; plan.forEach(function(p){ITINERARY.plan.push(p);});
  ITINERARY.accommodations.length=0; stays.forEach(function(s){ITINERARY.accommodations.push(s);});
  Object.assign(ITINERARY,{
    dest:dest, country:skel.country||'', tag:skel.tagline||'Itinéraire composé pour vous',
    dates:skel.dates||'Sur-mesure', days:plan.length, level:level,
    budgetTotal:budgetTotal, coords:skel.coords||dest, distance:plan.length+' jours',
    region:skel.region||'', season:skel.season||'', generated:true,
  });

  /* highlights */
  if(hilites){
    ITINERARY.gems=hilites.gems||[];
    ITINERARY.highlights=hilites.highlights||{};
    ITINERARY.essentials=hilites.essentials||{};
    ITINERARY.budget_note=hilites.budget_note||'';
  }

  deriveActivities(plan);
  deriveBudget(stays, budgetTotal);
  if(typeof SEASON!=='undefined'&&skel.season){SEASON.best=skel.season;SEASON.note=skel.season;}
  return true;
}

/* ── activités & budget dérivés ─────────────────────────────────────── */
const ACT_PRICE={peaks:78,arch:55,leaf:62,wave:95,droplet:48,fork:120,sun:52,star:88,camera:60,ticket:70,moon:64,compass:58,pin:50,plane:0,bed:0};
const ACT_DUR=['2 h','3 h','4 h','2 h 30','5 h','3 h 30'];
function deriveActivities(plan){
  if(typeof ACTIVITIES==='undefined') return;
  const picks=[];
  plan.forEach(function(p){p.moments.forEach(function(m){if(m[1]==='plane'||m[1]==='bed') return; picks.push({day:p.n,i:m[1],n:m[2],loc:p.loc,tag:(TAG_MAP[m[1]]||TAG_MAP.pin)[1]});});});
  const sel=picks.slice(0,6);
  ACTIVITIES.length=0;
  sel.forEach(function(a,i){
    const base=ACT_PRICE[a.i]||55;
    ACTIVITIES.push({id:'ac'+(i+1),day:a.day,i:a.i,n:a.n,loc:a.loc,dur:ACT_DUR[i%ACT_DUR.length],rate:['4,9','4,95','4,8','4,88','4,92','4,97'][i%6],price:base+(i%2?7:0),tag:a.tag});
  });
}
function deriveBudget(stays, total){
  if(typeof BUDGET==='undefined') return;
  const stayCost=stays.reduce(function(s,a){return s+a.price*a.nights;},0);
  const actCost=(typeof ACTIVITIES!=='undefined')?ACTIVITIES.reduce(function(s,a){return s+a.price;},0):0;
  const flights=Math.round(total*0.32);
  const food=Math.round(total*0.12);
  let transfers=total-stayCost-actCost-flights-food;
  if(transfers<0) transfers=Math.round(total*0.06);
  const nights=stays.reduce(function(s,a){return s+a.nights;},0);
  BUDGET.total=total; BUDGET.spent=0;
  BUDGET.lines=[
    {i:'bed',n:'Hébergements',sub:nights+' nuit'+(nights>1?'s':'')+' · '+stays.length+' adresse'+(stays.length>1?'s':''),amount:stayCost,paid:false},
    {i:'plane',n:'Vols',sub:(state.origin||'Paris')+' · aller-retour · '+travelerLabel(),amount:flights,paid:false},
    {i:'ticket',n:'Activités & expériences',sub:(typeof ACTIVITIES!=='undefined'?ACTIVITIES.length:0)+' sélectionnées',amount:actCost,paid:false},
    {i:'fork',n:'Restauration',sub:'Estimation · demi-pension',amount:food,paid:false},
    {i:'compass',n:'Transferts & transport local',sub:'Selon votre circuit',amount:Math.max(0,transfers),paid:false},
  ];
}

/* ── 3 passes de génération ─────────────────────────────────────────── */
async function callCartographe(){
  /* Passe 1 — ossature */
  const skel=await _completeJSON(buildSkeletonPrompt());
  if(!skel||!Array.isArray(skel.plan)||!skel.plan.length) return null;
  skel.plan=skel.plan.slice(0, Math.min(skel.plan.length, 10));

  /* Passe 2 — détail éditorial des jours */
  const daysDetail=await _completeJSON(buildDaysPrompt(skel));

  /* Passe 3 — adresses, gems, highlights */
  const hilites=await _completeJSON(buildHighlightsPrompt(skel, daysDetail));

  return {skel:skel, days:daysDetail, hilites:hilites};
}

/* ── flux de génération ─────────────────────────────────────────────── */
async function runGeneration(){
  const el=openOverlay('generating',generationView(),{modal:true,carto:true});
  const gen=el.querySelector('.gen');
  requestAnimationFrame(function(){gen.classList.add('run');});
  const statusEl=el.querySelector('[data-gen-status]');
  const steps=[
    'Lecture de vos envies…','Choix des étapes…',"Tracé de l'itinéraire…",
    'Sélection des adresses locales…','Recherche des pépites cachées…',
    'Calibrage du budget…','Derniers ajustements…',
  ];
  let si=0;
  const cycle=setInterval(function(){
    si=(si+1)%steps.length;
    if(statusEl){statusEl.style.opacity=0;setTimeout(function(){statusEl.textContent=steps[si];statusEl.style.opacity=1;},240);}
  },1300);
  const minShow=new Promise(function(r){setTimeout(r,2200);});
  let result=null;
  try{const res=await Promise.all([callCartographe(),minShow]);result=res[0];}catch(e){await minShow;}
  clearInterval(cycle);
  let ok=false;
  if(result){try{ok=applyGenerated(result.skel,result.days,result.hilites);}catch(e){ok=false;}}
  if(!ok) toast('Connexion limitée — itinéraire de démonstration');
  if(statusEl){statusEl.style.opacity=0;setTimeout(function(){statusEl.textContent='Votre voyage est prêt.';statusEl.style.opacity=1;},200);}
  setTimeout(function(){
    openItinerary();
    saveItinerary();
    state.deckIndex=0;
    if(typeof initDeck==='function') initDeck();
    setTimeout(function(){
      const gi=ovStack.findIndex(function(o){return o.dataset.ov==='generating';});
      if(gi>=0){const g=ovStack.splice(gi,1)[0];g.remove();}
    },460);
  },620);
}

/* ── Cartographe IA — contextuel à la destination ───────────────────── */
function aiItinerarySummary(){
  const it=ITINERARY;
  const days=it.plan.map(function(p){return 'J'+p.n+' '+p.loc+' : '+p.title;}).join(' · ');
  return it.dest+' · '+it.days+' jours · '+it.level+' · budget ~'+it.budgetTotal+'€ — '+days;
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
