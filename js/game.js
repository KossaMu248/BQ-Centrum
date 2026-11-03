/* Bearly Qualified — Autumn Ride standalone.
   Original simulation and character rig, independent illustrated environment. */

(() => {
  'use strict';
  window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE13';
  /* v10.58 — original-size, original-clothes actor art; only prop pixels + portraits. */
  window.BEARLY_ASSETS['v158_firecracker_hoodie_0_0']='assets/v158_firecracker_hoodie_0_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_0_3']='assets/v158_firecracker_hoodie_0_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_1_0']='assets/v158_firecracker_hoodie_1_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_1_3']='assets/v158_firecracker_hoodie_1_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_2_0']='assets/v158_firecracker_hoodie_2_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_2_3']='assets/v158_firecracker_hoodie_2_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_3_0']='assets/v158_firecracker_hoodie_3_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_3_3']='assets/v158_firecracker_hoodie_3_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_4_0']='assets/v158_firecracker_hoodie_4_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_4_3']='assets/v158_firecracker_hoodie_4_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_5_0']='assets/v158_firecracker_hoodie_5_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_hoodie_5_3']='assets/v158_firecracker_hoodie_5_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_0_0']='assets/v158_firecracker_video_0_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_0_3']='assets/v158_firecracker_video_0_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_1_0']='assets/v158_firecracker_video_1_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_1_3']='assets/v158_firecracker_video_1_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_2_0']='assets/v158_firecracker_video_2_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_2_3']='assets/v158_firecracker_video_2_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_3_0']='assets/v158_firecracker_video_3_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_3_3']='assets/v158_firecracker_video_3_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_4_0']='assets/v158_firecracker_video_4_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_4_3']='assets/v158_firecracker_video_4_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_5_0']='assets/v158_firecracker_video_5_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_video_5_3']='assets/v158_firecracker_video_5_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_0_0']='assets/v158_firecracker_toll_0_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_0_3']='assets/v158_firecracker_toll_0_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_1_0']='assets/v158_firecracker_toll_1_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_1_3']='assets/v158_firecracker_toll_1_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_2_0']='assets/v158_firecracker_toll_2_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_2_3']='assets/v158_firecracker_toll_2_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_3_0']='assets/v158_firecracker_toll_3_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_3_3']='assets/v158_firecracker_toll_3_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_4_0']='assets/v158_firecracker_toll_4_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_4_3']='assets/v158_firecracker_toll_4_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_5_0']='assets/v158_firecracker_toll_5_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_toll_5_3']='assets/v158_firecracker_toll_5_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_scooter_0_0']='assets/v158_firecracker_scooter_0_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_scooter_1_0']='assets/v158_firecracker_scooter_1_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_scooter_1_3']='assets/v158_firecracker_scooter_1_3.webp';
  window.BEARLY_ASSETS['v158_firecracker_scooter_2_0']='assets/v158_firecracker_scooter_2_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_scooter_3_0']='assets/v158_firecracker_scooter_3_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_scooter_4_0']='assets/v158_firecracker_scooter_4_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_scooter_5_0']='assets/v158_firecracker_scooter_5_0.webp';
  window.BEARLY_ASSETS['v158_firecracker_scooter_5_3']='assets/v158_firecracker_scooter_5_3.webp';
  window.BEARLY_ASSETS['v158_hud_happy']='assets/v158_hud_happy.png';
  window.BEARLY_ASSETS['v158_hud_terrified']='assets/v158_hud_terrified.png';
  window.BEARLY_ASSETS['v158_hud_angry']='assets/v158_hud_angry.png';
  window.BEARLY_ASSETS['v158_hud_laughing']='assets/v158_hud_laughing.png';
  window.BEARLY_ASSETS['v158_hud_crying']='assets/v158_hud_crying.png';
  window.BEARLY_ASSETS['v158_hud_knocked']='assets/v158_hud_knocked.png';
  window.BEARLY_ASSETS['v158_hud_excited']='assets/v158_hud_excited.png';
  window.BEARLY_ASSETS['v158_hud_sick']='assets/v158_hud_sick.png';

  window.BEARLY_ASSETS['v153_hud_happy']='assets/v153_hud_happy.png';
  window.BEARLY_ASSETS['v153_hud_terrified']='assets/v153_hud_terrified.png';
  window.BEARLY_ASSETS['v153_hud_angry']='assets/v153_hud_angry.png';
  window.BEARLY_ASSETS['v153_hud_laughing']='assets/v153_hud_happy.png';
  window.BEARLY_ASSETS['v153_hud_crying']='assets/v153_hud_crying.png';
  window.BEARLY_ASSETS['v153_hud_knocked']='assets/v153_hud_knocked.png';
  window.BEARLY_ASSETS['v153_hud_excited']='assets/v153_hud_excited.png';
  window.BEARLY_ASSETS['v153_hud_sick']='assets/v153_hud_sick.png';

/* V10.54: standardized head-only HUD portraits. */
window.BEARLY_ASSETS['v153_hud_happy']='assets/v153_hud_happy_2.png';
window.BEARLY_ASSETS['v153_hud_excited']='assets/v153_hud_excited_2.png';
window.BEARLY_ASSETS['v153_hud_terrified']='assets/v153_hud_terrified_2.png';
window.BEARLY_ASSETS['v153_hud_angry']='assets/v153_hud_angry_2.png';
window.BEARLY_ASSETS['v153_hud_laughing']='assets/v153_hud_laughing.png';
window.BEARLY_ASSETS['v153_hud_crying']='assets/v153_hud_crying_2.png';
window.BEARLY_ASSETS['v153_hud_sick']='assets/v153_hud_sick_2.png';
window.BEARLY_ASSETS['v153_hud_knocked']='assets/v153_hud_knocked_2.png';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', {alpha:false});
  // Game-world scroll units are faster than real metres; the HUD uses an independent bicycle-speed scale.
  const W = canvas.width, H = canvas.height, WORLD_STRETCH=1.50, stretchX=x=>Math.round(x*WORLD_STRETCH), FINISH=stretchX(28000), MAX_SPEED=700, SAFE_FINISH_SPEED=195, BRAKE_ZONE=1450, REVERSE_MAX=220, KMH_PER_SPEED=.072, PUKE_SPEED_RATIO=.95, TERROR_SPEED_RATIO=.86;
  const $ = id => document.getElementById(id);
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const rand=(a,b)=>a+Math.random()*(b-a);
  const choose=(arr)=>arr[Math.floor(Math.random()*arr.length)];
  // Continuous atmosphere interpolation; no sudden blue-to-purple flip.
  function blendHex(a,b,t){
    t=clamp(t,0,1);const aa=a.replace('#',''),bb=b.replace('#','');
    return '#'+[0,2,4].map(i=>Math.round(parseInt(aa.slice(i,i+2),16)*(1-t)+parseInt(bb.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
  }
  // All drawing dimensions below use the coordinates of the original 291x309 artwork.
  // Physics and art share ONE scale / ONE set of wheel anchors. No baked-in bike overlay.
  const ART_SCALE=.48, ART_ORIGIN_X=174, ART_ORIGIN_Y=190;
  const REAR_X=73, FRONT_X=246, WHEEL_Y=267, WHEEL_RADIUS=39;
  const TIRE_R=WHEEL_RADIUS*ART_SCALE;
  const riderX=(x)=>(x-ART_ORIGIN_X)*ART_SCALE;
  const riderY=(y)=>(y-ART_ORIGIN_Y)*ART_SCALE;
  const imagePaths=new Map(),imageSources=new Map(),imageRecords=Object.create(null);
  const rendering={scale:1,adaptive:window.matchMedia('(pointer: coarse)').matches,samples:0,slow:0,total:0};
  const startup={beganAt:performance.now(),ready:false,requested:false,readyAt:null,firstFrameAt:null,errors:[]};
  const images=new Proxy(imageRecords,{get(target,key){if(typeof key==='string'&&!target[key]&&imagePaths.has(key))requestGameImage(key);return target[key];}});
  function requestGameImage(name,priority='low'){
    const original=imagePaths.get(name);if(!original)return Promise.resolve();
    const material=/^(bear_pose_|bear_pedal_|bear_upper(?:_|$))/.test(name),url=material?(window.BearlyHero?.source(original)||original):original;
    let entry=imageSources.get(url);
    if(!entry){
      const image=new Image();image.decoding='async';image.fetchPriority=priority;
      const ready=new Promise(resolve=>{image.onload=async()=>{try{await image.decode?.();}catch(_){}resolve(image);};image.onerror=()=>{startup.errors.push(name);resolve(image);};});
      entry={image,ready};imageSources.set(url,entry);image.src=url;
    }
    imageRecords[name]=entry.image;return entry.ready;
  }
  window.BEARLY_STARTUP=()=>({...startup,state,x:bike.x,speed:bike.vx,renderScale:rendering.scale,backingWidth:canvas.width,backingHeight:canvas.height,requestedImages:imageSources.size,registeredImages:imagePaths.size,readyImages:[...imageSources.values()].filter(e=>e.image.naturalWidth>0).length});
  const scenicImage=new Image(); // Archival backdrop is not part of the active painted world.

  const keys = new Set();
  const debugSettings={foreground:true,backdrop:true,metro:true,particles:true,hitboxes:false,miniStats:false,godMode:false,hideHud:false};
  let debugOpen=false;
  const debugPerf={fps:0,drawMs:0,steps:0,frames:0,lastSample:0,lastUi:0};
  let state='menu', muted=false, cameraX=0, cameraY=0, time=0, last=0, acc=0, popUntil=0, popMessage='', winAt=0, deathAt=0;
  let seconds=0, bonus=0, numStars=0, panic=0, maxDist=0;
  let panicHighTime=0, panicEpisodeUntil=0, panicEpisodeCooldown=0, panicReliefUntil=0, panicEpisodeType="", panicShock=0, panicEvents=0, pukeWheelSlipUntil=0;
  let score=0, checkpoint=0, checkpointLabel='START', landingCount=0, airTime=0, airborne=false, perfectLandings=0;
  let babyHead=0,babyHeadV=0, jumpBuffer=0, lastContactAt=-100,hasEverGrounded=false, cameraShake=0, triggerCooldown=0, trickToastUntil=0;
  let dialogueActive=null, dialogueQueue=[], dialogueUntil=0, dialogueCooldown=0, deathReason='', nextBarkAt=0, barkCount=0;
  let sessionBest=0;try {sessionBest=Number((window.BearlyCentrumSave?.storage||localStorage).getItem('bq-centrum:best-score:v1')||0);}catch(e){}
  // Exactly one midway save point for the full-level ride.
  const checkpoints=[{x:14000,label:'GRIMSTA MIDPOINT'}]
    .map(o=>({...o,x:stretchX(o.x)}));
  const episodes=[
    {x:320,who:'NARRATOR',line:'HÄSSELBY SUNSET CRUISE. ONE BEAR. ZERO DRIVING LESSONS.',duration:3.2},
    {x:1650,who:'BABY',line:'NICE NEIGHBOURHOOD. TERRIBLE TRANSPORT PLAN.',duration:2.8},
    {x:3650,who:'BEAR',line:'THIS ISN’T A GANG. IT’S A SCOOTER FAN CLUB.',duration:2.9},
    {x:4870,who:'BABY',line:'WHY ARE THEY FILMING A DRILL VIDEO WITH NO DRILL?',duration:3},
    {x:7050,who:'NARRATOR',line:'THE LOCAL TOLL BOOTH IS NOT RECOGNISED BY THE MUNICIPALITY.',duration:3.4},
    {x:8860,who:'BABY',line:'I WOULD LIKE TO REJOIN THE TAX-PAYING WORLD.',duration:2.9},
    {x:10800,who:'BEAR',line:'VÄLLINGBY SENT US A NOISE COMPLAINT. WE ACCEPT.',duration:2.8},
    {x:12250,who:'BABY',line:'IS THAT A MUSIC VIDEO OR A PARKING VIOLATION?',duration:3},
    {x:14350,who:'NARRATOR',line:'GRIMSTA: LEAFY TREES, SKETCHY BUSINESS MODELS.',duration:3},
    {x:15900,who:'BABY',line:'THE MYSTERY PACKAGE SAYS "DEFINITELY CONFETTI".',duration:3},
    {x:18000,who:'BEAR',line:'THE GANG OF DELIVERY SCOOTERS HAS NO DELIVERY.',duration:3},
    {x:24050,who:'BABY',line:'AT LEAST MÄLAREN HAS A GREAT VIEW OF OUR MISTAKES.',duration:3.2},
    {x:26100,who:'NARRATOR',line:'MÄLAREN AHEAD. THESE ARE REAL BRAKES. PLEASE USE THEM.',duration:3},
    {x:27320,who:'BABY',line:'BRAKE! I SAID BRAKE, NOT ACCELERATE INTO RETIREMENT!',duration:3}
  ].map(o=>({...o,x:stretchX(o.x)}));
  const awkwardLines=[
    ['BABY','I CAN FEEL MY PERSONALITY LEAVING MY BODY.'],
    ['BEAR','THE BIKE IS MAKING A NOISE. THAT MEANS IT WORKS.'],
    ['BABY','THIS IS WHY I DON’T TRUST ANIMALS WITH INSURANCE.'],
    ['BEAR','NO, I HAVE NEVER FAILED A DRIVING TEST.'],
    ['BABY','YOU HAVE NEVER TAKEN ONE!']
  ];
  const babyBarks=[
    'THIS IS A BIKE. WHY DOES IT NEED A HELMET AND A LAWYER?',
    'I HAVE A MORTGAGE AND A TINY PAIR OF SOCKS.',
    'YOU ARE NOT LICENSED TO BE A BEAR.',
    'WE SHOULD HAVE TAKEN THE BUS. EVEN THE BAD BUS.',
    'I CAN HEAR THE INSURANCE COMPANY LAUGHING.',
    'WHAT PART OF THIS COUNTS AS TRANSPORT?',
    'I THOUGHT THAT SIGN SAID FREE ICE CREAM.',
    'I AM REPORTING THIS TO MY OTHER PARENTS.',
    'MY DIAPER JUST FILED A COMPLAINT.',
    'WHY ARE YOU PEDALING LIKE THAT?'
  ];
  const airBarks=['OH GOOD. THE EARTH IS LEAVING.', 'THAT IS A LOT OF AIR FOR A BICYCLE.',
    'I HAVE NEVER FELT SO UNEMPLOYED.', 'WE ARE NOT A BIRD. WE ARE TWO IDIOTS.'];
  const stressBarks=['MY TEETH ARE TRYING TO ESCAPE.', 'I CAN FEEL TOMORROW HURTING.',
    'I AM GOING TO TURN THIS WHOLE TRIP AROUND.', 'THIS IS WHY MY DAD IS A POTATO.'];
  let baby=null, bearThrown=null, seatThrown=null, babyHitAt=-99, recentHitPart='none', collisionTestCounter=0;
  const pukeDrops=[],pukeSplatters=[];let pukeEmissionCount=0,pukeWaveStart=-99,pukeWaveEnd=-99,pukeNextWave=0,pukeWaveCount=0,pukeEmitAccumulator=0;
  const cryingTears=[],babyPeeDrops=[],babyPeeMarks=[];let cryingNextSound=0,cryingStartedAt=-99,babyPeeUntil=-99,cryTearsEmitted=0;
  let sparks=[], groundDust=[], blood=[], fragments=[], oneTime=new Set(), bike, speechUntil=0, speech='';
  let health=100, pukeExposure=0, pukeDamageTotal=0, pizzaHealingTotal=0, lostParts=new Set(), damageCooldown=0, stainMarks=[], hazardHits=new Map(), peakSpeed=0;
  let landingPoseUntil=0, bumpPoseUntil=0, damagePoseUntil=0, airtimeStartedAt=0;
  let flipGroundImpactLatched=false; // One injury per genuinely inverted landing, not per physics tick.
  // Visual-only stunt animator. Physics stays authoritative; artwork never breaks apart.
  const motion={wheelie:0,air:0,launchAt:-99,landAt:-99,landPower:0,
    impactAt:-99,impactPower:0,crashAt:-99,demoWheelieUntil:-99,pose:'idle',previousPose:'idle',poseAt:0,
    extraPitch:0,recoil:0,legKick:0,squash:0,stunt:'ride'};
  const easeOut=t=>1-Math.pow(1-clamp(t,0,1),3);
  const smooth=(a,b,t)=>{t=clamp((t-a)/(b-a),0,1);return t*t*(3-2*t);};
  // Keep tricks separate from physics, hit boxes and character artwork.
  const demo={active:false,startAt:0,crashed:false,stage:'',stageIndex:-1};
  const demoStages=[
    {at:0,name:'RIDE',text:'WHEELS & PEDALS MOVING'},
    {at:1.35,name:'WHEELIE',text:'REAR WHEEL PIVOT · FRONT WHEEL LIFT'},
    {at:2.95,name:'JUMP',text:'TAKEOFF → AIRTIME → DESCENT'},
    {at:4.55,name:'LANDING',text:'SQUASH → REBOUND'},
    {at:5.50,name:'CRASH',text:'IMPACT · EJECTION'},
    {at:6.35,name:'AFTERSHOCK',text:'CHILD STAYS BUCKLED · SEAT BOUNCES'},
    {at:7.40,name:'SETTLE',text:'BIKE & SEAT SETTLE TOGETHER'},
    {at:9.0,name:'RECOVER',text:'GRAVITY HAS FINISHED ITS REVIEW'}
  ];
  const tricks={wheelieSeconds:0,wheelieMeters:0,combo:0,total:0,bestCombo:0,
    lastTrickAt:-99,title:'',detail:'',showUntil:-99,lastWheelie:false,
    hazardsPassed:new Set(),comboResetAt:0,crashReason:''};
  const trickQuips=[
    'THAT IS NOT A LEGAL STUNT, SIR.',
    'WE ARE GOING TO OWE GRAVITY MONEY.',
    'IF YOU DO THAT AGAIN I AM MOVING OUT.',
    'I WAS PROMISED A NORMAL CHILDHOOD.'
  ];

  // One-shot animation triggers, separate from the continuous panic meter.
  let throttleStartedAt=-99, wasPedaling=false, hazardReactUntil=-99, hazardReacted=new Set();
  let dialogueStartedAt=-99, landingWasHard=false;
  // Long, gently descending, *fictionalized* Stockholm-suburb course. Broad cruising
  // zones intentionally separate the comedy set pieces; smooth transitions between downhill sections.
  const segments=[
    [0,850,446,500],[850,1750,500,602],[1750,3100,602,665],
    [3100,4350,665,880],[4350,5450,880,930],
    [5450,6650,930,1120],[6650,7900,1120,1280],[7900,8500,1280,1325],[8500,8650,1325,1350],
    [8650,9670,1350,1460],[9670,10900,1460,1515],
    [10900,12000,1515,1620],[12000,13300,1620,1810],
    [13300,14600,1810,1905],[14600,14745,1905,1930],
    [14745,16250,1930,2100],[16250,17750,2100,2235],
    [17750,19300,2235,2350],[19300,19445,2350,2375],
    [19445,20850,2375,2505],[20850,24600,2505,2890],[24600,28300,2890,3185],
    [28300,30100,3185,3195]
  ].map(s=>[stretchX(s[0]),stretchX(s[1]),s[2],s[3]]);
  const ramps=[]; // Decorative ramps removed; jumping still works normally with Space.
  // v10.53: Fewer, deliberately spaced health pickups, leaving long unassisted stretches.
  const stars=[
    1700,4200,6500,8850,11280,13900,
    16600,18800,20900,23100,25000,27100
  ].map(x=>({x:stretchX(x),y:0,got:false}));
  // Five distinct districts with authored landmarks, clear cruising spans and
  // occasional fictional cartoon troublemakers. Residents are not enemies.
  const districts=[
    {start:0,end:4350,name:'BACKSTUGEVÄGEN · RESIDENTIAL',style:'homes',accent:'#f1bf81'},
    {start:4350,end:8650,name:'GÅRDEN · METRO & COURTYARDS',style:'metro',accent:'#eac08e'},
    {start:8650,end:13900,name:'TORGET · MARKET STREETS',style:'square',accent:'#eda9a1'},
    {start:13900,end:18300,name:'GRIMSTA · FOREST DESCENT',style:'forest',accent:'#9dc6a7'},
    {start:18300,end:28001,name:'STRANDEN · SUNSET FINISH',style:'lake',accent:'#91c6c9'}
  ].map(d=>({...d,start:stretchX(d.start),end:stretchX(d.end)}));
  const districtAt=x=>districts.find(d=>x>=d.start&&x<d.end)||districts[districts.length-1];
  // Only four fixed objects block the road. Other conflict comes from readable,
  // dodgeable projectiles launched by off-road NPCs.
  const hazards=[
    {type:'scooter',x:3400,w:64},
    {type:'firebin',x:6850,w:58},
    {type:'cart',x:10910,w:68},
    {type:'glass',x:16440,w:66},
    {type:'firebin',x:21400,w:58},
    {type:'roadblock',x:27180,w:78}
  ].map(o=>({...o,x:stretchX(o.x)}));
  // Real, clearly marked collision obstacles, interspersed among harmless props.
  for(const [n,type] of [[1910,'pothole'],[4660,'glass'],[5980,'scooter'],[10050,'roadwork'],
    [14550,'cart'],[18000,'glass'],[20240,'pothole'],[23200,'scooter'],[26050,'glass']]){
    const x=stretchX(n);hazards.push({x,type,w:type==='glass'?70:type==='cart'?68:60});
  }
  const gangCrews=[
    {x:2720,count:2,kind:'hoodie',name:'STREET EXECUTIVES',quip:'NO BUSINESS. MANY BUSINESS PLANS.',item:'bottle',district:0},
    {x:5030,count:3,kind:'video',name:'LOW BUDGET DRILL CREW',quip:'BUDGET: 12 KR. ATTITUDE: UNLIMITED.',item:'rock',district:1},
    {x:7820,count:2,kind:'toll',name:'THE ZERO KR TOLL',quip:'WE ONLY ACCEPT BAD DECISIONS.',item:'firecracker',district:1},
    {x:12400,count:3,kind:'hoodie',name:'BENCH BOARD OF DIRECTORS',quip:'THE BENCH IS UNDER NEW MANAGEMENT.',item:'bottle',district:2},
    {x:16000,count:2,kind:'video',name:'GRIMSTA CAMERA CLUB',quip:'WE ARE LIVE TO NINE PEOPLE.',item:'rock',district:3},
    {x:18900,count:3,kind:'scooter',name:'SCOOTER HIGH COMMAND',quip:'OUR BATTERIES REQUIRE UNION BREAKS.',item:'firecracker',district:4},
    {x:24300,count:2,kind:'hoodie',name:'THE LAKESIDE TOUGH GUYS',quip:'WE ARE AFRAID OF THE WATER.',item:'bottle',district:4}
  ].map(o=>({...o,x:stretchX(o.x)}));
  const crewState=new Map(), projectiles=[];
  const projectileImpactFX=[];
  let projectileFootTime=0,roadsideSuspended=false;
  const projectileClock=()=>time+projectileFootTime;
  let thrownCount=0, dodgedCount=0, hitCount=0;
  // V6.1 visual-only feedback: warning -> projectile -> impact -> breathing room.
  // No new enemies or physics changes; the long scenic stretches remain untouched.
  let impactCues=[], encounterHeat=0, lastHitKind='none';
  let reactionCount=0;
  const projectileLabels={bottle:'MOLOTOV',rock:'ROCK',firecracker:'FIRECRACKER'};
  function carriedPropFor(crew,i){
    if(i===null||i===undefined)return crew.item;
    const palette=['bottle','rock','firecracker'];
    return i%3===0?crew.item:palette[(palette.indexOf(crew.item)+i)%3];
  }
  // Each person is assigned a true painted clothing + complexion sprite sheet.
  // The palette is natural, stable through movement and independent of the crew role.
  const wardrobeNames=['Black puffer','Olive shell','Navy tracksuit','Charcoal hoodie','Brown jacket','Dark techwear'];
  function makeCrewProfiles(crew){
    const seed=Math.floor(crew.x/117);
    const order=[0,4,2,5,1,3];
    return Array.from({length:crew.count},(_,i)=>({
      variant:order[(Math.floor(crew.x/2500)+i+seed%3)%order.length],
      scale:.68 + ((seed+i*3)%4)*.022,
      xJitter:((seed+i*7)%5-2)*3,
      yJitter:0,
      reactionLag:.08 + ((seed+i*3)%4)*.075
    }));
  }
  function ensureCrewState(crew,c){
    if(!c.profiles)c.profiles=makeCrewProfiles(crew);
    if(!c.members)c.members=Array.from({length:crew.count},(_,i)=>({phase:'idle',since:time,
      nextReadyAt:time + .18 + i*.78 + (sceneryHash(Math.floor(crew.x/20)+i,55)*.66), throwCount:0}));
    if(c.throwerIndex===undefined)c.throwerIndex=0;
    return c;
  }
  function crewMemberLocalX(crew,i){
    const c=crewState.get(crew.x);
    const profile=c?.profiles?.[i];
    return (i-(crew.count-1)/2)*100 + (profile?.xJitter||0);
  }
  const throwingHandX=(crew,i=null)=>{
    const idx=i===null?(crewState.get(crew.x)?.throwerIndex||0):i;
    const resident=window.BearlyVisits?.gangStatus('gang-'+crew.x+'-'+idx);
    if(resident&&Number.isFinite(resident.x)){const hand=window.BearlyKids.projectileOrigin(carriedPropFor(crew,idx));return resident.x+(bike.x>resident.x?1:-1)*hand.x;}
    const c=crewState.get(crew.x),m=c?.members?.[idx];
    const motion=patrolMotion(crew,idx);
    const shift=m?.phase && m.phase!=='idle'
      ? (m.patrolOrigin??motion.x)*(1-smooth(0,.42,time-m.since)) : motion.x;
    const anchor=crew.x + crewMemberLocalX(crew,idx)+shift;
    const facing=bike.x>anchor?1:-1;
    return anchor + 16*facing;
  };
  const throwingHandY=(crew,i=null)=>{const idx=i===null?(crewState.get(crew.x)?.throwerIndex||0):i,n=window.BearlyVisits?.gangStatus('gang-'+crew.x+'-'+idx),hand=window.BearlyKids.projectileOrigin(carriedPropFor(crew,idx));return(groundAt(n?.x??throwingHandX(crew,idx))??bike.y)+(n?.depth??-102)-hand.z;};
  // Independent, bounded two-way patrols: characters walk, pause, and turn around.
  // We animate the torso but keep every shadow and shoe grounded on the raised sidewalk.
  function patrolMotion(crew,i,t=time){
    // v10.53: individual sidewalk walks. Different starting phases, lengths,
    // speeds and pause intervals prevent the whole group from marching in sync.
    const key=Math.floor(crew.x/67)+i*13;
    const period=4.1+sceneryHash(key,77)*3.9;
    const phase=(t/period+sceneryHash(key,31))%1;
    const range=30+sceneryHash(key,80)*24;
    // 13% pause at each end, with grounded walking in between.
    const travel=phase<.42?phase/.42:phase<.50?1:phase<.92?1-(phase-.50)/.42:0;
    const pos=-range+2*range*travel;
    const walking=(phase<.42||phase>=.50&&phase<.92);
    const dir=phase<.50?1:-1;
    const step=walking?Math.sin(t*(6.2+sceneryHash(key,62)*3.2)+i*2.7):0;
    return {x:pos, pace:walking?1:0, dir, step};
  }
  function memberPosePhase(crew,c,i){
    const m=c.members?.[i];
    if(!m)return 'idle';
    if(m.phase!=='idle')return m.phase;
    const others=c.members.some((o,j)=>j!==i&&(o.phase==='warn'||o.phase==='throw'));
    if(others&&Math.sin(time*1.5+i*2.2)>.45)return 'notice';
    return 'idle';
  }
  function reactionForCrew(owner,result){
    const c=crewState.get(owner);
    if(!c)return;
    c.result=result;c.resultAt=time;
  }
  function spawnImpactCue(x,y,kind='bear'){
    impactCues.push({x,y,kind,at:time});
    if(impactCues.length>8)impactCues.shift();
    lastHitKind=kind;
  }
  function currentEncounter(){
    let best=null,score=0;
    for(const crew of gangCrews){
      const c=crewState.get(crew.x);
      if(!c||c.phase==='idle')continue;
      const dx=crew.x-bike.x;
      if(dx < -450 || dx > 1100)continue;
      const priority=c.phase==='warn'?3:c.phase==='throw'?2:c.phase==='recover'?1:0;
      if(priority>score){best={crew,c};score=priority;}
    }
    return best;
  }
  function updateEncounterFeeling(dt){
    const encounter=currentEncounter();
    let target=0;
    if(encounter)target=encounter.c.phase==='warn'?.86:encounter.c.phase==='throw'?.72:.25;
    if(projectiles.some(p=>p.x>bike.x-330&&p.x<bike.x+940))target=Math.max(target,.85);
    if(hazards.some(h=>h.x-bike.x>-40 && h.x-bike.x<330))target=Math.max(target,.33);
    if(impactCues.some(c=>time-c.at<.32))target=1;
    const rate=target>encounterHeat?5.8:1.15;
    encounterHeat=lerp(encounterHeat,target,1-Math.exp(-rate*dt));
    impactCues=impactCues.filter(c=>time-c.at<.8);
    for(let i=projectileImpactFX.length-1;i>=0;i--)if(projectileClock()-projectileImpactFX[i].at>projectileImpactFX[i].duration)projectileImpactFX.splice(i,1);
  }
  const landmarks=[
    {x:7550,kind:'metro',name:'HÄSSELBY GÅRD T-BANA'},
    {x:11700,kind:'square',name:'HÄSSELBY TORG'},
    {x:14250,kind:'castle',name:'HÄSSELBY SLOTT'},
    {x:17850,kind:'strand',name:'HÄSSELBY STRAND T-BANA'},
    {x:20500,kind:'bathing',name:'STRANDBADET · MÄLAREN'}, {x:25400,kind:'bathing',name:'MÄLAREN · SUNSET PROMENADE'}
  ].map(o=>({...o,x:stretchX(o.x)}));
  const setPieces=[
    {x:1150,kind:'playground',label:'PLAYGROUND'},
    {x:7700,kind:'metro',label:'HÄSSELBY GÅRD'},
    {x:10050,kind:'shop',label:'TORGET'},
    {x:19200,kind:'waterfront',label:'MÄLAREN'},
    {x:25800,kind:'waterfront',label:'SUNSET VIEW'}
  ].map(o=>({...o,x:stretchX(o.x)}));
  const expressionNames=['original_photo','smile','happy','excited','terrified','confused','angry','derp','sick','hurt','knocked'];
  const babyFrameNames=['idle','laugh','terror','leanBack','leanForward','point','brace','sick'];
  const babyFrameAnchors={"idle": [49, 133], "laugh": [57, 141], "terror": [70, 141], "leanBack": [80, 129], "leanForward": [49, 139], "point": [54, 129], "brace": [52, 131], "sick": [40, 132]};

  // V131: sprite sources cleaned of baked-in gravel, plus new pre-rendered pose variations.
  window.BEARLY_ASSETS['baby_crash_drag']='assets/baby_crash_drag_2.png';
  window.BEARLY_ASSETS['baby_crash_falling']='assets/baby_crash_falling_2.png';
  window.BEARLY_ASSETS['baby_crash_impact']='assets/baby_crash_impact_2.png';
  window.BEARLY_ASSETS['baby_crash_ragdoll']='assets/baby_crash_ragdoll_2.png';
  window.BEARLY_ASSETS['v125_baby_flail']='assets/v125_baby_flail_2.png';
  window.BEARLY_ASSETS['v125_baby_roll']='assets/v125_baby_roll_2.png';
  window.BEARLY_ASSETS['v125_baby_skid']='assets/v125_baby_skid_2.png';
  window.BEARLY_ASSETS['v125_baby_cry_wet']='assets/v125_baby_cry_wet_2.png';
  window.BEARLY_ASSETS['v131_baby_launch']='assets/v131_baby_launch.png';
  window.BEARLY_ASSETS['v131_baby_reach']='assets/v131_baby_reach.png';
  window.BEARLY_ASSETS['v131_baby_curl']='assets/v131_baby_curl.png';
  window.BEARLY_ASSETS['v131_baby_twist']='assets/v131_baby_twist.png';
  window.BEARLY_ASSETS['v131_baby_brace']='assets/v131_baby_brace.png';
  window.BEARLY_ASSETS['v131_baby_side_slide']='assets/v131_baby_side_slide.png';
  window.BEARLY_ASSETS['v131_baby_final_turn']='assets/v131_baby_final_turn.png';

  // V132 replaces damaged source cels with fully bounded clean silhouettes.
  window.BEARLY_ASSETS['baby_crash_drag']='assets/baby_crash_drag_3.png';
  window.BEARLY_ASSETS['baby_crash_falling']='assets/baby_crash_falling_3.png';
  window.BEARLY_ASSETS['baby_crash_impact']='assets/baby_crash_impact_3.png';
  window.BEARLY_ASSETS['baby_crash_ragdoll']='assets/baby_crash_ragdoll_3.png';
  window.BEARLY_ASSETS['v125_baby_flail']='assets/v125_baby_flail_3.png';
  window.BEARLY_ASSETS['v125_baby_roll']='assets/v125_baby_roll_3.png';
  window.BEARLY_ASSETS['v125_baby_skid']='assets/v125_baby_skid_3.png';
  window.BEARLY_ASSETS['v125_baby_cry_wet']='assets/baby_crash_drag_3.png';
  window.BEARLY_ASSETS['v131_baby_launch']='assets/v131_baby_launch_2.png';
  window.BEARLY_ASSETS['v131_baby_reach']='assets/v131_baby_reach_2.png';
  window.BEARLY_ASSETS['v131_baby_curl']='assets/v131_baby_curl_2.png';
  window.BEARLY_ASSETS['v131_baby_twist']='assets/v131_baby_twist_2.png';
  window.BEARLY_ASSETS['v131_baby_brace']='assets/v131_baby_brace_2.png';
  window.BEARLY_ASSETS['v131_baby_side_slide']='assets/v131_baby_side_slide_2.png';
  window.BEARLY_ASSETS['v131_baby_final_turn']='assets/v131_baby_final_turn_2.png';
  const babyCrashFrames=['falling','ragdoll','impact','drag'];
  const v125CrashCels=['v125_baby_flail','v125_baby_roll','v125_baby_skid','v125_baby_cry_wet'];
  const v131CrashCels=['v131_baby_launch','v131_baby_reach','v131_baby_curl','v131_baby_twist','v131_baby_brace','v131_baby_side_slide','v131_baby_final_turn'];
  let previewPose=null, previewBearPose=null, referenceStyle=false;
  const referenceAnchors={"ride":{"rear":[39,60],"front":[117,59]},"wheelie":{"rear":[27,64],"front":[107,24]},"jump":{"rear":[25,62],"front":[105,7]},"land":{"rear":[35,64],"front":[96,28]},"recover":{"rear":[21,65],"front":[106,60]}};

  // True reference-sheet poses. Coordinates are measured in the original 1500px-wide
  // action strip, before each extracted transparent image was upscaled 3x.
  const SHEET_SCALE=1.28;
  const sheetArt={
    ride:{rear:[38,83],front:[102,82],baseAngle:0},
    wheelie:{rear:[39,84],front:[109,53],baseAngle:-.41},
    jump:{rear:[47,83],front:[109,30],baseAngle:-.62},
    landing:{rear:[40,88],front:[95,57],baseAngle:-.43},
    crash:{rear:[39,88],front:[100,83],baseAngle:0},
    recover:{rear:[18,85],front:[103,82],baseAngle:0}
  };
  function selectedSheetPose(){
    // v8.1: Do not swap to oversized archival bike/child cutouts during wheelies,
    // jumps, landing, crash, or the demonstration. Every pose uses the same rig.
    return null;
  }
  function drawSheetPose(name,p){
    const img=images['sheet_pose_'+name];
    if(!img?.naturalWidth)return false;
    const s=SHEET_SCALE/3;
    if(name==='flyoff'||name==='drag'){
      const gr=groundAt(p.x)||447;
      const width=img.naturalWidth*s,height=img.naturalHeight*s;
      ctx.save();ctx.globalAlpha=1;
      ctx.drawImage(img,p.x-width*.44,gr-height+7,width,height);
      ctx.restore();return true;
    }
    const a=sheetArt[name];
    if(!a)return false;
    // Rear wheel is the permanent mount point. Never align by image corners:
    // differing crop sizes caused the giant jumps and floating wheels in v1.9.
    const rearWorldX=p.x+riderX(REAR_X),rearWorldY=p.y+riderY(WHEEL_Y);
    const demoMode=demo.active;
    let visualAngle=0;
    if(name==='ride'||name==='crash'||name==='recover')visualAngle=demoMode?0:p.a;
    if(name==='wheelie'){
      const visualPitch=demoMode ? -.41 : Math.min(-.26, p.a+motion.extraPitch);
      visualAngle=visualPitch-a.baseAngle;
    }
    if(name==='jump'){
      const visualPitch=demoMode?-.55:p.a+motion.extraPitch;
      visualAngle=clamp(visualPitch-a.baseAngle,-.5,.5);
    }
    if(name==='landing'){
      const visualPitch=demoMode?-.27:p.a-.16;
      visualAngle=clamp(visualPitch-a.baseAngle,-.12,.5);
    }
    const pivotX=a.rear[0]*SHEET_SCALE,pivotY=a.rear[1]*SHEET_SCALE;
    ctx.save();ctx.translate(rearWorldX,rearWorldY-3);
    ctx.rotate(visualAngle);ctx.translate(-pivotX,-pivotY);
    ctx.drawImage(img,0,0,img.naturalWidth*s,img.naturalHeight*s);
    // Rotating spoke accents are clipped to the inner wheel circles, preserving
    // the source's actual illustrated tires instead of drawing new wheel discs.
    const spin=p.cycle;
    for(const hub of [a.rear,a.front]){
      if(!hub)continue;
      const x=hub[0]*SHEET_SCALE,y=hub[1]*SHEET_SCALE;
      ctx.save();ctx.translate(x,y);ctx.rotate(spin);
      ctx.globalAlpha=.55;ctx.strokeStyle='#bcc5cc';ctx.lineWidth=1.3;
      for(let i=0;i<6;i++){
        const th=i*Math.PI/3;
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(th)*11,Math.sin(th)*11);ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();return true;
  }
  function load(){
    const files=[...Object.keys(window.BEARLY_ASSETS||{}).filter(n=>n.startsWith('v105_')||n.startsWith('v149_')||n.startsWith('v151_')||n.startsWith('v153_hud_')),...['bear_pose_brake','bear_pose_coast','bear_pose_hurt','bear_pose_idle','bear_pose_jump','bear_pose_land','bear_pose_pedal','bear_pose_wheelie',...Array.from({length:4},(_,i)=>'bear_pedal_'+i)].flatMap(k=>Array.from({length:5},(_,i)=>`v77_${k}_face_${i}`)),...['hoodie','video','toll','scooter'].flatMap(k=>Array.from({length:6},(_,j)=>Array.from({length:6},(_,i)=>`v72_${k}_${j}_${i}`)).flat()),...['hoodie','video','toll','scooter'].flatMap(k=>Array.from({length:6},(_,j)=>[0,3].map(f=>`v158_firecracker_${k}_${j}_${f}`))).flat(),...['happy','terrified','angry','laughing','crying','knocked','excited','sick'].map(n=>'v158_hud_'+n),...['istanbul','corner','cafe','piccola'].map(n=>'v96_shop_'+n),...Array.from({length:6},(_,i)=>'v96_civilian_'+i),'v60_fire_bin',...['utility','lamp','bike_rack','trash_bin','planter','guardrail','market_crates'].map(n=>'v98_clean_'+n),'v95_stone_border','v95_rockbed','v95_garden_screen','v95_noticeboard', ...['bench_a','bench_b','planter','market_crates','courtyard_fence','bike_rack','lamp','bollards','guardrail','swings','playground','utility','bus_shelter','trash_bin','barrier','scooter_broken','cart_hazard','glass','rocks','scrap','sign_debris','fireworks','construction','tree'].map(n=>'v60_'+n),...Array.from({length:6},(_,i)=>'v162_firebin_'+i),...['bottle','rock','firecracker'].map(n=>'v162_projectile_'+n),...Array.from({length:6},(_,i)=>'v59_fire_'+i),...['bottle','rock','firecracker'].flatMap(k=>Array.from({length:6},(_,i)=>'v59_enemy_'+k+'_'+i)),...['scooter_broken','bench_a','bench_b','bus_shelter','bike_rack','trash_bin','planter','courtyard_fence','balcony','guardrail','lamp','bollards','utility','market_crates','playground','swings','metro_entrance','metro_signs','direction','barrier','glass','cart_hazard','construction','scrap','fireworks','rocks','sign_debris','tree'].map(n=>'v59_'+n),...['ride','wheelie','jump','landing','crash','flyoff','drag','recover'].map(n=>'sheet_pose_'+n),...['ride','wheelie','jump','land','recover'].map(n=>'bear_sheet_'+n),...['idle','pedal','coast','brake','wheelie','jump','land','hurt'].map(n=>'bear_pose_'+n),...['0','1','2','3'].map(n=>'bear_pedal_'+n),'v142_pizza_wrapper','v85_bear_prone_crash','v89_metro_station','v115_metro_complete','v116_metro_clean','v118_metro_complete','v118_close_tree','v118_close_bush_0','v118_close_bush_1','v118_close_bush_2','metro_option_logos','metro_option_panel','v89_bike_crashed','v91_nearfoliage_0','v91_nearfoliage_1','v91_nearfoliage_2','v92_near_branch',...Array.from({length:6},(_,i)=>'v99_front_'+i),'v99_front_canopy',...Array.from({length:8},(_,i)=>'v102_lens_'+i),...Array.from({length:8},(_,i)=>'v102_close_'+i),...Array.from({length:9},(_,i)=>'v103_bank_'+i),...Array.from({length:9},(_,i)=>'v104_shrub_'+i),...Array.from({length:4},(_,i)=>'v104_close_'+i),...Array.from({length:4},(_,i)=>'v103_bloom_'+i),...Array.from({length:16},(_,i)=>'v87_prone_'+i),'bear_upper','bear_upper_rightarm_injured','bear_leg_original','bear_leg_clean','bear_glove_part','bear_body','bear_head','bear_arm','bear_boot',...expressionNames.map(x=>'face_'+x),...babyFrameNames.map(x=>'baby_pose_'+x),...babyCrashFrames.map(x=>'baby_crash_'+x),...v125CrashCels,...v131CrashCels,...['castle_hill','apartment_terrace','metro_gard','metro_strand','waterfront','park_props','swedish_sign','flower_rocks','lakeside_dock','road_slope','road_arched','road_bridge'].map(x=>'env_'+x),...['hoodie','scooter','filmmaker','fireworks','kiosk','metro_kiosk','mailboxes','props_cart','props_cones','props_bins','props_barricade','street_signs'].map(x=>'v53_'+x),...['hoodie_night','hoodie_olive','filmmaker_charcoal','filmmaker_ink','scooter_night','scooter_olive','fireworks_burgundy','fireworks_dark'].map(x=>'v56_'+x),...['homes','metro','market','forest','lake'].flatMap((z)=>Array.from({length:({homes:4,metro:3,market:3,forest:4,lake:4})[z]},(_,i)=>`v57_scene_${z}_${i}`)),...['homes','metro','market','forest','lake'].map(z=>'v57_pano_'+z)];
    for(const name of files)if(!name.startsWith('v57_scene_')&&!/^v158_firecracker_scooter_[0234]_3$/.test(name))imagePaths.set(name,(window.BEARLY_V163_ASSETS&&window.BEARLY_V163_ASSETS[name])||(window.BEARLY_ASSETS&&window.BEARLY_ASSETS[name])||`assets/${name}.png`);
    // Only the native riding cast and first collectible are needed to start.
    // Archive/debug assets are requested lazily at their actual point of use.
    const critical=[...bearPoseNames.map(n=>'bear_pose_'+n),...Array.from({length:4},(_,i)=>'bear_pedal_'+i),...babyFrameNames.map(n=>'baby_pose_'+n),'v151_baby_pose_excited','v151_baby_pose_sick','v142_pizza_wrapper','bear_leg_original'];
    return Promise.all(critical.map(name=>requestGameImage(name,'high')));
  }
  function prepareRideReactions(){
    const names=['bear_upper','bear_upper_rightarm_injured','bear_leg_original','bear_glove_part','v89_bike_crashed','v85_bear_prone_crash',...expressionNames.map(n=>'face_'+n),...babyCrashFrames.map(n=>'baby_crash_'+n),...v125CrashCels,...v131CrashCels,...Array.from({length:16},(_,i)=>'v87_prone_'+i),...['bottle','rock','firecracker'].map(n=>'v162_projectile_'+n)];
    let index=0;const next=()=>{if(index>=names.length)return;requestGameImage(names[index++]);if(window.requestIdleCallback)requestIdleCallback(next,{timeout:1200});else setTimeout(next,32);};
    if(window.requestIdleCallback)requestIdleCallback(next,{timeout:1200});else setTimeout(next,32);
  }

  function groundAt(x) {
    for(const seg of segments) if(x>=seg[0]&&x<=seg[1])return lerp(seg[2],seg[3],(x-seg[0])/(seg[1]-seg[0]));
    return null;
  }
  for(const cp of checkpoints)cp.y=groundAt(cp.x)??500;
  for(const st of stars)st.y=(groundAt(st.x)??500)-124;
  function fallReference(x){
    const y=groundAt(x);if(y!==null)return y;
    let before=null,after=null;
    for(const seg of segments){if(seg[1]<x)before=seg;else if(seg[0]>x){after=seg;break;}}
    if(before&&after)return lerp(before[3],after[2],clamp((x-before[1])/(after[0]-before[1]),0,1));
    return before?before[3]:after?after[2]:447;
  }
  function slopeAt(x){const r=groundAt(x-40),f=groundAt(x+40);return r===null||f===null?0:Math.atan2(f-r,80);}
  function reset(startPlaying=true){
    if(window.BearlyCentrumEconomy?.interceptReset(startPlaying))return;
    window.BearlyCentrumLink?.cancel();
    window.BearlyCentrumSquare?.close();
    window.BearlyVisits?.close();
    demo.active=false;demo.stageIndex=-1;demo.crashed=false;
    const cue=$('demoCue');if(cue)cue.classList.remove('visible');
    const btn=$('demoBtn');if(btn)btn.textContent='▶ STUNT DEMO';
    bike={x:210,y:360,vx:0,vy:0,a:0,va:0,contact:false,cycle:0,expression:'original_photo',broken:false,lean:0};
    Object.assign(motion,{wheelie:0,air:0,launchAt:-99,landAt:-99,landPower:0,impactAt:-99,impactPower:0,crashAt:-99,demoWheelieUntil:-99,pose:'idle',previousPose:'idle',poseAt:0,extraPitch:0,recoil:0,legKick:0,squash:0,stunt:'ride'});
    Object.assign(tricks,{wheelieSeconds:0,wheelieMeters:0,combo:0,total:0,bestCombo:0,lastTrickAt:-99,
      title:'',detail:'',showUntil:-99,lastWheelie:false,hazardsPassed:new Set(),comboResetAt:0,crashReason:''});
    $('stuntHud').classList.remove('active');
    previewPose=null;previewBearPose=null;throttleStartedAt=-99;wasPedaling=false;hazardReactUntil=-99;hazardReacted=new Set();dialogueStartedAt=-99;landingWasHard=false;
    panicHighTime=0;panicEpisodeUntil=0;panicEpisodeCooldown=0;panicReliefUntil=0;panicEpisodeType='';panicShock=0;panicEvents=0;pukeWheelSlipUntil=0;
    projectileImpactFX.length=0;impactCues=[];encounterHeat=0;lastHitKind='none';reactionCount=0;baby=null;bearThrown=null;seatThrown=null;pukeDrops.length=0;pukeSplatters.length=0;pukeEmissionCount=0;pukeWaveStart=-99;pukeWaveEnd=-99;pukeNextWave=0;pukeWaveCount=0;pukeEmitAccumulator=0;cryingTears.length=0;babyPeeDrops.length=0;babyPeeMarks.length=0;cryingStartedAt=-99;cryingNextSound=0;babyPeeUntil=-99;cryTearsEmitted=0;v126PeeEmission=0;babyHitAt=-99;recentHitPart='none';stars.forEach(s=>s.got=false);keys.clear();sparks=[];groundDust=[];blood=[];fragments=[];stainMarks=[];hazardHits=new Map();lostParts=new Set();health=100;pukeExposure=0;pukeDamageTotal=0;pizzaHealingTotal=0;damageCooldown=0;crewState.clear();projectiles.length=0;thrownCount=0;dodgedCount=0;hitCount=0;landingPoseUntil=0;bumpPoseUntil=0;damagePoseUntil=0;airtimeStartedAt=0;flipGroundImpactLatched=false;
    time=0;seconds=0;panic=0;maxDist=0;numStars=0;bonus=0;score=0;checkpoint=0;checkpointLabel='START';
    landingCount=0;airTime=0;airborne=false;perfectLandings=0;babyHead=0;babyHeadV=0;jumpBuffer=0;lastContactAt=-100;hasEverGrounded=false;cameraShake=0;nextBarkAt=4;barkCount=0;
    cameraX=0;cameraY=0;deathAt=0;winAt=0;oneTime.clear();dialogueQueue=[];dialogueActive=null;dialogueUntil=0;dialogueCooldown=0;deathReason='';
    state=startPlaying?'playing':'menu';$('overlay').hidden=startPlaying;
    $('starsCount').textContent='0 / '+stars.length;$('scoreCount').textContent='0';$('checkpointLabel').textContent='NO CHECKPOINT';
    $('statusLine').textContent='METRO C • BILLY’S TO BAG · I TO EAT · PUKE DRAINS HP';$('dialogue').classList.remove('active');$('gameoverRestart').hidden=true;
    if(startPlaying){// v10.53: quiet level entry, no narration card or area banner.
      }
    window.BearlyCentrumEconomy?.afterReset(startPlaying);
    updateHud();
  }
  function overlay(title,desc,button){$('overlay').hidden=false;$('overlay').classList.toggle('crash-review',state==='dead'||state==='dead_end');$('overlayTitle').innerHTML=title;$('overlayDesc').textContent=desc;$('startBtn').innerHTML=`${button} <span>→</span>`;
    $('gameoverRestart').hidden=!(state==='dead'||state==='dead_end'||state==='won'||state==='won_end');}
  function talk(who,line,duration=2.8,important=false){
    const item={who,line,duration};
    if(important){dialogueQueue.length=0;dialogueActive=item;dialogueStartedAt=time;dialogueUntil=time+duration;renderDialogue();}
    else {if(dialogueActive || time<dialogueCooldown){if(dialogueQueue.length<2)dialogueQueue.push(item);}else{dialogueActive=item;dialogueStartedAt=time;dialogueUntil=time+duration;renderDialogue();}}
  }
  function renderDialogue(){
    const item=dialogueActive;if(!item){$('dialogue').classList.remove('active');return;}
    $('dialogueName').textContent=item.who;$('dialogueText').textContent=item.line;
    $('dialogue').dataset.who=item.who.toLowerCase();$('dialogue').classList.add('active');
  }
  function dialogueTick(){
    if(dialogueActive&&time>=dialogueUntil){dialogueActive=null;dialogueCooldown=time+.32;renderDialogue();}
    if(!dialogueActive && dialogueQueue.length && time>=dialogueCooldown){
      dialogueActive=dialogueQueue.shift();dialogueStartedAt=time;dialogueUntil=time+dialogueActive.duration;renderDialogue();
    }
  }
  function checkpointRespawn(){
    if(window.BearlyCentrumEconomy?.ready()){window.BearlyCentrumEconomy.retry();return;}
    if(!checkpoint){reset(true);return;}
    const spot=checkpoints[checkpoint-1];
    bike={x:spot.x+34,y:spot.y-95,vx:45,vy:0,a:0,va:0,contact:false,cycle:0,expression:'original_photo',broken:false,lean:0};
    Object.assign(motion,{wheelie:0,air:0,launchAt:-99,landAt:-99,landPower:0,impactAt:-99,impactPower:0,crashAt:-99,demoWheelieUntil:-99,pose:'idle',previousPose:'idle',poseAt:time,extraPitch:0,recoil:0,legKick:0,squash:0,stunt:'ride'});
    throttleStartedAt=-99;wasPedaling=false;hazardReactUntil=-99;hazardReacted=new Set();dialogueStartedAt=-99;landingWasHard=false;
    projectileImpactFX.length=0;impactCues=[];encounterHeat=0;lastHitKind='none';reactionCount=0;baby=null;bearThrown=null;seatThrown=null;pukeDrops.length=0;pukeSplatters.length=0;pukeEmissionCount=0;pukeWaveStart=-99;pukeWaveEnd=-99;pukeNextWave=0;pukeWaveCount=0;pukeEmitAccumulator=0;cryingTears.length=0;babyPeeDrops.length=0;babyPeeMarks.length=0;cryingStartedAt=-99;cryingNextSound=0;babyPeeUntil=-99;cryTearsEmitted=0;v126PeeEmission=0;babyHitAt=-99;recentHitPart='none';blood=[];fragments=[];stainMarks=[];lostParts=new Set();health=100;pukeExposure=0;pukeDamageTotal=0;pizzaHealingTotal=0;damageCooldown=0;hazardHits=new Map();crewState.clear();projectiles.length=0;panic=15;panicHighTime=0;panicEpisodeUntil=0;panicEpisodeCooldown=0;panicReliefUntil=0;panicEpisodeType='';panicShock=0;panicEvents=0;pukeWheelSlipUntil=0;airTime=0;airborne=false;deathAt=0;deathReason='';babyHead=0;babyHeadV=0;cameraShake=0;hasEverGrounded=true;nextBarkAt=time+3;landingPoseUntil=0;bumpPoseUntil=0;damagePoseUntil=0;airtimeStartedAt=0;flipGroundImpactLatched=false;
    oneTime.delete('crashed');dialogueQueue=[];dialogueActive=null;dialogueCooldown=time+.3;
    tricks.wheelieSeconds=0;tricks.wheelieMeters=0;tricks.lastWheelie=false;
    tricks.combo=0;tricks.lastTrickAt=-99;tricks.hazardsPassed=new Set();
    tricks.showUntil=-99;$('stuntHud').classList.remove('active');
    state='playing';$('overlay').hidden=true;$('gameoverRestart').hidden=true;
    banner('REWINDING TO YOUR LAST POOR DECISION',1.9);
    talk('BABY','GREAT. NOW I REMEMBER EVERYTHING.',2.7,true);
    $('statusLine').textContent='CHECKPOINT RETRY · DISTRICT RELOADED';
  }
  function banner(message,duration=1.5){
    const raw=String(message);
    // Only vital momentary feedback; chapter/area and joke banners are removed.
    if(districts.some(d=>d.name===raw)|| /^(HÄSSELBY 2.5D|SPACE = HOP|LAUNCH RAMP|TURBO DOWNHILL|ONE CONSISTENT BIKE)/.test(raw))return;
    let short=raw;
    if(raw.startsWith('BILLYS PAN PIZZA'))short='BILLY’S +16 HP';
    else if(raw.startsWith('CHECKPOINT:'))short='CHECKPOINT SAVED';
    else if(raw.startsWith('BABY MELTDOWN'))short='BABY PANIC!';
    else if(raw.startsWith('MÄLAREN BRAKING ZONE'))short='BRAKE FOR THE FINISH';
    else if(raw.startsWith('SLOW TO 14 KM/H'))short='SLOW DOWN';
    else if(raw.includes(' HIT · BEAR '))short='BEAR HIT';
    else if(raw.startsWith('MÄLAREN FINISH'))short='FINISH!';
    if(raw===short && !/^(BEAR POSE|BABY POSE|UNSCHEDULED|GRAVITY HAS|PHYSICS:|PASSENGER SURVIVED|REWINDING)/.test(raw))return;
    popMessage=short;popUntil=time+Math.min(duration,1.4);$('toast').textContent=short;$('toast').hidden=false;
  }
  function say(message,duration=2){speech=message;speechUntil=time+duration;$('bubbleText').textContent=message;$('bubble').classList.add('show');}
  let audio;
  function sound(type){
    if(muted)return;
    try {
      audio=audio||new (window.AudioContext||window.webkitAudioContext)(); if(audio.state==='suspended')audio.resume();
      if(type==='pizza-kiss'){
        // Two close-mic lip-smack sounds, synthesized once at collection time.
        // No external audio file or loop is required; honor the game's mute state.
        const t=audio.currentTime, sr=audio.sampleRate;
        const buf=audio.createBuffer(1,Math.ceil(sr*.095),sr),data=buf.getChannelData(0);
        for(let i=0;i<data.length;i++){
          const f=i/data.length;
          data[i]=(Math.random()*2-1)*(.68*Math.exp(-f*16)+.32*Math.exp(-Math.pow((f-.25)*10,2)));
        }
        for(const [n,delay] of [[0,0],[1,.135]]){
          const at=t+delay,noise=audio.createBufferSource();noise.buffer=buf;
          const filter=audio.createBiquadFilter();filter.type='lowpass';
          filter.frequency.setValueAtTime(n?1250:980,at);
          const g=audio.createGain();g.gain.setValueAtTime(.0001,at);
          g.gain.exponentialRampToValueAtTime(.085,at+.009);
          g.gain.exponentialRampToValueAtTime(.0001,at+.085);
          noise.connect(filter);filter.connect(g);g.connect(audio.destination);
          noise.start(at);noise.stop(at+.09);
          const lip=audio.createOscillator(),tone=audio.createGain();lip.type='sine';
          lip.frequency.setValueAtTime(n?400:330,at);
          lip.frequency.exponentialRampToValueAtTime(n?235:175,at+.078);
          tone.gain.setValueAtTime(.0001,at);
          tone.gain.exponentialRampToValueAtTime(.041,at+.013);
          tone.gain.exponentialRampToValueAtTime(.0001,at+.083);
          lip.connect(tone);tone.connect(audio.destination);
          lip.start(at);lip.stop(at+.09);
        }
        return;
      }
      if(type==='npc-scream'){
        const t=audio.currentTime,voice=audio.createOscillator(),formant=audio.createBiquadFilter(),gain=audio.createGain();
        voice.type='sawtooth';voice.frequency.setValueAtTime(430,t);voice.frequency.exponentialRampToValueAtTime(690,t+.07);voice.frequency.exponentialRampToValueAtTime(205,t+.42);
        formant.type='bandpass';formant.frequency.setValueAtTime(1450,t);formant.frequency.exponentialRampToValueAtTime(790,t+.42);formant.Q.value=.8;
        gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.07,t+.035);gain.gain.exponentialRampToValueAtTime(.0001,t+.44);
        voice.connect(formant);formant.connect(gain);gain.connect(audio.destination);voice.start(t);voice.stop(t+.46);return;
      }
      const osc=audio.createOscillator(),gain=audio.createGain();
      const t=audio.currentTime;
      const presets={'rock-impact':[145,75,.11,'triangle'],'molotov-impact':[210,45,.38,'sawtooth'],'firecracker-impact':[740,50,.18,'square'],jump:[310,540,.18,'square'],star:[670,1150,.25,'sine'],crash:[160,33,.6,'sawtooth'],bounce:[180,115,.12,'triangle'],finish:[560,950,.55,'sine'],checkpoint:[360,720,.30,'triangle'],panic:[250,125,.11,'square'],cry:[310,170,.4,'triangle'],trick:[460,810,.15,'sine']};
      const [from,to,len,wave]=presets[type]||presets.bounce;
      osc.type=wave;osc.frequency.setValueAtTime(from,t);osc.frequency.exponentialRampToValueAtTime(to,t+len);
      gain.gain.setValueAtTime(type==='cry'?.021:.055,t);gain.gain.exponentialRampToValueAtTime(.001,t+len);
      osc.connect(gain);gain.connect(audio.destination);osc.start(t);osc.stop(t+len+.01);
    }catch(e){}
  }
  function wheelPos(localX){
    const ly=riderY(WHEEL_Y),c=Math.cos(bike.a),s=Math.sin(bike.a);
    return {x:bike.x+localX*c-ly*s,y:bike.y+localX*s+ly*c};
  }
  function childSeatPos(){
    const x=riderX(38),y=riderY(143),c=Math.cos(bike.a),s=Math.sin(bike.a);
    return{x:bike.x+x*c-y*s,y:bike.y+x*s+y*c};
  }
  // Collision proxy skeleton only. Riding ART stays locked to the bike to prevent
  // wandering elbows, knee stretching, and the dangling baby seen in v0.8.
  function partPos(ax,ay){
    const x=riderX(ax),y=riderY(ay),c=Math.cos(bike.a),s=Math.sin(bike.a);
    return {x:bike.x+x*c-y*s,y:bike.y+x*s+y*c};
  }
  const V146_PIZZA_W=64, V146_PIZZA_H=37;
  function v146PizzaTouched(pizza){
    // Sprite includes a 4px vertical bob; allow a narrow forgiveness margin.
    const centerY=pizza.y+Math.sin(time*2.8+pizza.x)*4+Math.sin(time*3+pizza.x)*5;
    const halfW=V146_PIZZA_W*.5+5, halfH=V146_PIZZA_H*.5+6;
    const x0=pizza.x-halfW,x1=pizza.x+halfW;
    const y0=centerY-halfH,y1=centerY+halfH;
    for(const part of mountedParts()){
      const nearestX=clamp(part.x,x0,x1),nearestY=clamp(part.y,y0,y1);
      if((nearestX-part.x)**2+(nearestY-part.y)**2 <= (part.r+3)**2)return true;
    }
    // The player's on-bike hands/handlebars are also a legitimate contact point.
    const bar=partPos(225,175), reach=10;
    const px=clamp(bar.x,x0,x1),py=clamp(bar.y,y0,y1);
    return Math.hypot(bar.x-px,bar.y-py)<=reach;
  }
  window.BEARLY_V146_PIZZA_TEST=()=>({count:stars.length,remaining:stars.filter(p=>!p.got).length,
    size:[V146_PIZZA_W,V146_PIZZA_H],hit:stars.filter(p=>!p.got&&v146PizzaTouched(p)).length});
  function mountedParts(){
    const out=[];
    function add(who,part,x,y,r){
      const p=partPos(x,y);out.push({who,part,x:p.x,y:p.y,r:r*ART_SCALE});
    }
    add('bear','head',170,81,30);
    add('bear','torso',147,155,36);
    if(!lostParts.has('leftArm'))add('bear','leftArm',107,157,19);
    if(!lostParts.has('rightArm'))add('bear','rightArm',233,153,18);
    const crank=bike.cycle*.44;
    if(!lostParts.has('leftLeg'))add('bear','leftLeg',162+15*Math.cos(crank),245+10*Math.sin(crank),19);
    if(!lostParts.has('rightLeg'))add('bear','rightLeg',162+15*Math.cos(crank+Math.PI),245+10*Math.sin(crank+Math.PI),19);
    if(!baby){
      add('baby','head',39,106,28);
      add('baby','body',43,165,23);
    }
    return out;
  }
  function intersectsHazard(c,h){
    const gy=groundAt(h.x)??420;
    if(h.type==='saw')return Math.hypot(c.x-h.x,c.y-h.y)<c.r+46;
    let l=h.x,r=h.x+h.w,t=gy-39,b=gy;
    if(h.type==='barrel'){l=h.x-21;r=h.x+21;t=gy-63;}
    if(h.type==='cart'){l=h.x-32;r=h.x+32;t=gy-74;}
    if(h.type==='brokenlamp'){l=h.x-34;r=h.x+35;t=gy-76;}
    if(h.type==='scooter'){l=h.x-28;r=h.x+48;t=gy-46;}
    if(h.type==='roadwork'){t=gy-65;}
    if(h.type==='filmcrew'){l=h.x-40;r=h.x+48;t=gy-69;}
    if(h.type==='roadblock'){l=h.x-39;r=h.x+39;t=gy-45;}
    if(h.type==='boombox'){l=h.x-25;r=h.x+26;t=gy-38;}
    if(h.type==='parcel'){l=h.x-25;r=h.x+25;t=gy-33;}
    if(h.type==='pothole'){t=gy-17;}
    if(h.type==='glass'){l=h.x-h.w/2;r=h.x+h.w/2;t=gy-24;}
    if(h.type==='firebin'){l=h.x-25;r=h.x+25;t=gy-92;}
    const x=clamp(c.x,l,r),y=clamp(c.y,t,b);
    return (c.x-x)**2+(c.y-y)**2 <=c.r*c.r;
  }
  function hitBabyInSeat(h){
    if(debugSettings.godMode||state!=='playing'||time<damageCooldown)return false;
    // Nonfatal collisions do NOT release the child seat. The harness stays on.
    babyHitAt=time;panic=100;cameraShake=Math.max(8,cameraShake);bumpPoseUntil=time+0.4;damagePoseUntil=time+0.58;
    if(time>=damageCooldown){
      const n=projectileDamage(h.type); // The child-seat harness stays intact, but hits count against the same health pool.
      health=clamp(health-n,0,100);damageCooldown=time+.62;
      if(health<=0){crash('roadside projectile knocked out the team');}
    }
    const seat=childSeatPos();spawnImpactCue(seat.x,seat.y,'passenger');
    say(choose(['THE SEAT HAS A WARRANTY. I DO NOT.','I AM STILL IN THE CHAIR. THIS IS WORSE.','THIS IS A VERY BAD FAMILY HOLIDAY.']),2.3);
    banner('PASSENGER SURVIVED · HARNESS HELD',1.8);
    sound('panic');return true;
  }
  function projectileDamage(kind){return ['rock','bottle','molotov','firecracker','dynamite'].includes(kind)?window.BearlyWeapons.damage(kind):53;}
  // Compact artwork matches the hand-sized props carried by the illustrated crews.
  const projectileArtSpec={bottle:{w:32,h:18,r:6.8},rock:{w:16,h:10,r:6.2},firecracker:{w:29,h:16,r:6.0}};
  const projectileImpactHistory=[];
  let projectileImpactSequence=0;
  function projectileGroundContact(p){
    const gap=t=>{const x=lerp(p.px,p.x,t),gy=groundAt(x);return gy===null?null:lerp(p.py,p.y,t)+p.r*.7-gy;};
    let before=0;
    for(let j=0;j<=8;j++){
      const after=j/8,value=gap(after);
      if(value!==null&&value>=0){
        let lo=before,hi=after;
        for(let n=0;n<9;n++){const mid=(lo+hi)*.5,v=gap(mid);if(v!==null&&v>=0)hi=mid;else lo=mid;}
        const x=lerp(p.px,p.x,hi);return {t:hi,x,y:groundAt(x)};
      }
      before=after;
    }
    return null;
  }
  function projectileRiderContact(p,parts,dx,dy){
    let contact=null;
    for(const part of parts){
      const ax=p.px-(part.x-dx),ay=p.py-(part.y-dy);
      const vx=(p.x-part.x)-ax,vy=(p.y-part.y)-ay,R=part.r+p.r*.86;
      const a=vx*vx+vy*vy,b=2*(ax*vx+ay*vy),c=ax*ax+ay*ay-R*R;
      let t=null;
      if(c<=0)t=0;
      else if(a>.000001){const disc=b*b-4*a*c;if(disc>=0){const entry=(-b-Math.sqrt(disc))/(2*a);if(entry>=0&&entry<=1)t=entry;}}
      if(t===null||(contact&&contact.t<=t))continue;
      const cx=part.x-dx*(1-t),cy=part.y-dy*(1-t);
      const px=lerp(p.px,p.x,t),py=lerp(p.py,p.y,t),len=Math.hypot(px-cx,py-cy)||1;
      contact={t,part,x:cx+(px-cx)*part.r/len,y:cy+(py-cy)*part.r/len};
    }
    return contact;
  }
  function spawnThrownItem(crew,memberIndex=null){
    const x=throwingHandX(crew,memberIndex), y=throwingHandY(crew,memberIndex);
    const speed=Math.max(0,bike.vx);
    // At high speeds a 520 px/s projectile could never reach the rider.
    // Aim at a physical future intercept, with a slight vertical aim difference
    // between members. Braking and hopping still let the player dodge.
    const t=clamp(.80-Math.max(0,speed-260)*.00018,.48,.80);
    const targetX=bike.x+speed*t+12;
    const targetY=bike.y-34+(memberIndex===null?0:(memberIndex%3-1)*10);
    const gravity=510;
    const kind=carriedPropFor(crew,memberIndex);
    projectiles.push({x,y,px:x,py:y,vx:clamp((targetX-x)/t,-2050,2050),
      vy:clamp((targetY-y-gravity*t*t*.5)/t,-820,640),g:gravity,
      kind,owner:crew.x,angle:0,spin:kind==='rock'?4.3:kind==='firecracker'?5.5:3.5,
      r:projectileArtSpec[kind].r,life:3.3,alive:true});
    thrownCount++;
    // Audio/voice caption matches the actual object, not legacy placeholder items.
    const lines={bottle:'A BOTTLE. VERY MATURE.',rock:'HE IS THROWING ACTUAL ROCKS!',firecracker:'THAT HAS A LIT FUSE!'};
    if(time>dialogueCooldown+.1 && !dialogueActive)talk('BABY',lines[kind],1.75);
  }
  function updateRoadsideEncounters(dt,bikeOldX=bike.x,bikeOldY=bike.y){
    if(state!=='playing')return;
    for(const crew of gangCrews){
      const roster=Array.from({length:crew.count},(_,i)=>window.BearlyVisits?.gangStatus('gang-'+crew.x+'-'+i)).filter(Boolean);
      const closest=roster.reduce((best,n)=>Math.abs(n.x-bike.x)<Math.abs(best-bike.x)?n.x:best,roster[0]?.x??crew.x);
      const d=closest-bike.x;
      let c=crewState.get(crew.x);
      // Fully disengage when out of sight; no delayed throws from an old warning.
      if(d < -320 || d > 980){
        if(c){
          ensureCrewState(crew,c);
          for(const member of c.members){
            if(member.phase!=='idle'){
              member.phase='idle';member.since=time;
              member.nextReadyAt=time+0.65;
            }
          }
          c.phase='idle';c.since=time;c.idleReturnAt=time;
        }
        continue;
      }
      if(!c){c={phase:'idle',since:time,result:null};crewState.set(crew.x,c);}
      ensureCrewState(crew,c);
      // Warning range follows the resident's current position and bike speed.
      for(let i=0;i<crew.count;i++){
        const m=c.members[i],resident=window.BearlyVisits?.gangStatus('gang-'+crew.x+'-'+i);
        if(!resident?.aggressive||resident.hiding||['hide','cover','cower'].includes(resident.activity)){
          m.phase='idle';m.since=time;m.nextReadyAt=Math.max(m.nextReadyAt,time+.25);continue;
        }
        if(resident&&['held','screen','stagger','down','fall','dead','rise'].includes(resident.state)){m.phase='idle';m.nextReadyAt=time+.7;continue;}
        const actorDX=(resident?.x??crew.x)-bike.x,withinRange=actorDX>-520&&actorDX<Math.max(500,Math.min(940,Math.max(0,bike.vx)*1.25+150));
        if(m.phase==='idle'&&withinRange&&time>=m.nextReadyAt){
          m.phase='warn';m.since=time;
          m.patrolOrigin=patrolMotion(crew,i).x;
          hazardReactUntil=Math.max(hazardReactUntil,time+.58);
          if(!dialogueActive&&time>dialogueCooldown+.15&&i===0)
            talk('BABY','INCOMING! WATCH THE SIDEWALK!',1.0);
        }
        if(m.phase==='warn'&&time-m.since>=(clamp(.92-Math.max(0,bike.vx-300)*.00048,.38,.92)+(i%3)*.115)){
          m.phase='throw';m.since=time;m.throwCount++;
          if(!bike.broken)spawnThrownItem(crew,i);
          const ground=groundAt(throwingHandX(crew,i));
          if(ground!==null)for(let k=0;k<3;k++)groundDust.push({
            x:throwingHandX(crew,i)+rand(-7,7),y:ground-101,
            vx:rand(-25,32),vy:rand(-25,-8),life:rand(.16,.3),r:rand(1.2,2.1)
          });
        }
        if(m.phase==='throw'&&time-m.since>=.30){m.phase='recover';m.since=time;}
        if(m.phase==='recover'&&time-m.since>=.58){
          m.phase='idle';m.since=time;
          m.nextReadyAt=time+1.05+i*.42+rand(.30,1.05);
          c.idleReturnAt=time;
        }
      }
      // Backward-compatible group state for warning HUD and debug tools.
      const active=c.members.map((m,i)=>({m,i})).filter(x=>x.m.phase==='warn'||x.m.phase==='throw'||x.m.phase==='recover');
      const primary=active.find(x=>x.m.phase==='warn')||active.find(x=>x.m.phase==='throw')||active[0];
      if(primary){
        c.phase=primary.m.phase;c.since=primary.m.since;c.throwerIndex=primary.i;
        c.patrolOrigins=c.members.map((m,j)=>m.patrolOrigin??patrolMotion(crew,j).x);
      }else{c.phase='idle';}
    }
    advanceThrownItems(dt,bikeOldX,bikeOldY);
  }
  function advanceThrownItems(dt,bikeOldX=bike.x,bikeOldY=bike.y,hitRider=true){
    const parts=hitRider?mountedParts():null,bikeDX=bike.x-bikeOldX,bikeDY=bike.y-bikeOldY;
    for(let i=projectiles.length-1;i>=0;i--){
      const p=projectiles[i];
      p.px=p.x;p.py=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;
      p.angle+=p.spin*dt;p.life-=dt;
      if(p.life<=0){projectiles.splice(i,1);dodgedCount++;reactionForCrew(p.owner,'miss');reactionCount++;continue;}
      const floor=projectileGroundContact(p),body=hitRider?projectileRiderContact(p,parts,bikeDX,bikeDY):null;
      if(body&&(!floor||body.t<floor.t)){
        const point={x:body.x,y:body.y};
        projectiles.splice(i,1);hitCount++;reactionForCrew(p.owner,'hit');reactionCount++;
        const hpBefore=health;
        if(body.part.who==='baby')hitBabyInSeat({type:p.kind});
        else if(time>=damageCooldown)injure(projectileDamage(p.kind),'thrown '+p.kind,false,body.part.part,point);
        else {sound('bounce');cameraShake=Math.max(cameraShake,1.4);}
        addProjectileImpact({...p,...point},false,{hpBefore,hpAfter:health,appliedDamage:hpBefore-health,actor:body.part.who,part:body.part.part});
        for(let k=0;k<7;k++)sparks.push({x:point.x,y:point.y,vx:rand(-105,100),vy:rand(-105,45),life:rand(.18,.4),r:rand(.8,2.2),color:p.kind==='firecracker'?'#ffbc63':p.kind==='bottle'?'#a8d6a0':'#d9c1a0'});
      }else if(floor){
        projectiles.splice(i,1);dodgedCount++;reactionForCrew(p.owner,'miss');reactionCount++;
        // Every real ground collision gets its own effect, including stones.
        addProjectileImpact({...p,x:floor.x,y:floor.y},true,{hpBefore:health,hpAfter:health,appliedDamage:0});
        if(debugSettings.particles)for(let k=0;k<5;k++)groundDust.push({x:floor.x,y:floor.y-2,vx:rand(-60,60),vy:rand(-65,-20),life:rand(.2,.4),r:rand(1.2,2.4)});
      }
    }
  }
  function drawThrownItems(){
    for(const p of projectiles){
      if(p.x<cameraX-60||p.x>cameraX+W+60)continue;
      const spec=projectileArtSpec[p.kind]||projectileArtSpec.rock;
      const speed=Math.hypot(p.vx,p.vy)||1,ux=p.vx/speed,uy=p.vy/speed;
      if(debugSettings.particles){
        ctx.save();ctx.strokeStyle=p.kind==='firecracker'?'#f4bf7277':p.kind==='bottle'?'#b6e3c75c':'#bea99a55';ctx.lineWidth=1.2;ctx.lineCap='round';
        ctx.beginPath();ctx.moveTo(p.x-ux*13,p.y-uy*13);ctx.lineTo(p.x-ux*22,p.y-uy*22);ctx.stroke();ctx.restore();
      }
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.imageSmoothingEnabled=true;
      const im=images['v162_projectile_'+p.kind];
      if(im?.naturalWidth)ctx.drawImage(im,-spec.w/2,-spec.h/2,spec.w,spec.h);
      else{
        ctx.fillStyle=p.kind==='bottle'?'#41845b':p.kind==='firecracker'?'#bb4033':'#7b7569';
        ctx.strokeStyle='#2b302b';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(-spec.w*.45,-spec.h*.4,spec.w*.9,spec.h*.8,2);ctx.fill();ctx.stroke();
      }
      if(p.kind==='bottle'||p.kind==='firecracker'){
        const tipX=spec.w*.37,tipY=-spec.h*.24,pulse=.6+.4*Math.sin(time*25+p.owner*.002);
        if(p.kind==='bottle'){
          // A visible burning cloth silhouette identifies the Molotov at speed.
          ctx.strokeStyle='#302c23';ctx.lineWidth=3.5;ctx.lineCap='round';
          ctx.beginPath();ctx.moveTo(tipX-1,tipY);ctx.quadraticCurveTo(tipX+3,tipY-5,tipX+5,tipY-5);ctx.stroke();
          ctx.strokeStyle='#e6d3a1';ctx.lineWidth=2;ctx.stroke();
          const x=tipX+5,y=tipY-5,h=7+pulse*3;
          ctx.fillStyle='#ef7a29';ctx.beginPath();ctx.moveTo(x-3,y+1);ctx.bezierCurveTo(x-6,y-3,x+2,y-h*.6,x+1,y-h);ctx.bezierCurveTo(x+6,y-3,x+5,y+1,x-3,y+1);ctx.fill();
          ctx.fillStyle='#ffe997';ctx.beginPath();ctx.ellipse(x+1,y-2,1.6,3+pulse,0,0,Math.PI*2);ctx.fill();
        }else{
          const glow=ctx.createRadialGradient(tipX,tipY,0,tipX,tipY,5.5);
          glow.addColorStop(0,'#fff3b3c0');glow.addColorStop(1,'#ff9b2e00');ctx.fillStyle=glow;ctx.fillRect(tipX-6,tipY-6,12,12);
          ctx.strokeStyle='#ffdb84';ctx.lineWidth=1.2;
          for(let k=0;k<3;k++){const a=time*6+k*2.09;ctx.beginPath();ctx.moveTo(tipX,tipY);ctx.lineTo(tipX+Math.cos(a)*(3+pulse),tipY+Math.sin(a)*(3+pulse));ctx.stroke();}
          ctx.fillStyle='#fff3b3';ctx.beginPath();ctx.arc(tipX,tipY,1.3+pulse*.5,0,Math.PI*2);ctx.fill();
        }
      }
      ctx.restore();
    }
  }
  function addProjectileImpact(p,groundHit=false,contact={}){
    const duration=window.BearlyWeaponEffects.duration(p.kind,groundHit?'ground':'bear');
    const fx={id:++projectileImpactSequence,x:p.x,y:p.y,kind:p.kind,direction:Math.sign(p.vx)||1,at:projectileClock(),groundHit,duration,seed:(p.x*.17+p.y*.13)%37};
    projectileImpactFX.push(fx);
    if(projectileImpactFX.length>20)projectileImpactFX.shift();
    projectileImpactHistory.push({id:fx.id,x:fx.x,y:fx.y,kind:fx.kind,weapon:fx.kind,at:fx.at,contact:groundHit?'ground':'rider',target:groundHit?'ground':'bear',appliedDamage:0,...contact});
    sound(fx.kind==='bottle'?'molotov-impact':fx.kind==='firecracker'?'firecracker-impact':'rock-impact');
    if(projectileImpactHistory.length>60)projectileImpactHistory.shift();
  }
  // Impact animations are cosmetic: they never apply a second damage pulse.
  function drawProjectileImpactFX(){
    const reduced=!debugSettings.particles||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for(const fx of projectileImpactFX){
      const age=projectileClock()-fx.at;if(age<0||age>=fx.duration)continue;
      window.BearlyWeaponEffects.draw(ctx,{weapon:fx.kind,target:fx.groundHit?'ground':'bear',age,seed:fx.seed,direction:fx.direction},fx.x,fx.y,{scale:1,reducedMotion:reduced});
    }
  }
  // Developer-only probes exercise the real projectile simulation and contacts.
  window.BEARLY_PROJECTILE_QA={
    state(){return {time,health,particles:debugSettings.particles,spec:projectileArtSpec,
      projectiles:projectiles.map(p=>({kind:p.kind,x:p.x,y:p.y,r:p.r})),
      impacts:projectileImpactFX.map(f=>({id:f.id,kind:f.kind,contact:f.groundHit?'ground':'rider',x:f.x,y:f.y,age:projectileClock()-f.at,duration:f.duration})),history:projectileImpactHistory.slice()};},
    clear(){projectiles.length=0;projectileImpactFX.length=0;projectileImpactHistory.length=0;},
    spawn(kind='bottle',target='ground'){
      if(!projectileArtSpec[kind])throw new Error('Unknown projectile kind');
      const part=mountedParts().find(p=>p.who==='bear'&&p.part==='head');
      const x=target==='rider'?part.x+140:bike.x+180;
      const y=target==='rider'?part.y:(groundAt(x)??bike.y)-90;
      projectiles.push({x,y,px:x,py:y,vx:target==='rider'?-500:0,vy:target==='rider'?0:180,g:target==='rider'?0:510,kind,owner:-1,angle:0,spin:5,r:projectileArtSpec[kind].r,life:3.3,alive:true});
      return {kind,target,x,y};
    },
    preview(kind='bottle',groundHit=true){const x=bike.x+160,y=groundHit?(groundAt(x)??bike.y):bike.y-35;addProjectileImpact({x,y,kind},groundHit);render();return this.state();},
    step(seconds=.1){for(let n=0;n<Math.ceil(seconds*120);n++){time+=1/120;updateRoadsideEncounters(1/120,bike.x,bike.y);updateEncounterFeeling(1/120);}render();return this.state();}
  };
  function partHazards(){
    if(state!=='playing')return;
    const parts=mountedParts();
    for(const h of hazards){
      if(Math.abs(bike.x-h.x)>175)continue;
      const candidates=parts.filter(p=>intersectsHazard(p,h));
      if(!candidates.length)continue;
      // A single hazard must not inflict ten hits in one physics frame.
      const id=h.type+':'+h.x;
      if(time<(hazardHits.get(id)||0))continue;
      // Bear collisions are handled before passenger; this also avoids baby-first
      // ejection caused by treating the child as an unrestrained ragdoll.
      const c=candidates.find(p=>p.who==='bear')||candidates[0];
      hazardHits.set(id,time+1.35);
      if(c.who==='baby')hitBabyInSeat(h);
      else {
        const dmg=h.type==='saw'?c.part==='head'?48:35 : h.type==='spikes'?c.part==='head'?35:26 : h.type==='glass'?19 : h.type==='firebin'?24 : h.type==='pothole'?13 : h.type==='scooter'?17 : h.type==='filmcrew'?15 : h.type==='boombox'?12 : h.type==='parcel'?14 : h.type==='roadblock'?16 : c.part==='head'?25:17;
        injure(dmg,h.type,h.type==='saw',c.part,c);
      }
    }
  }
  function hop(){
    if(state!=='playing')return;
    jumpBuffer=.14;
    if(bike.contact||time-lastContactAt<.13)doHop();
  }
  function doHop(){
    if(state!=='playing'||jumpBuffer<=0)return;
    bike.vy=Math.min(bike.vy,-605);bike.y-=12;bike.contact=false;airborne=true;airTime=0;
    bike.va+=bike.vx*.00024;jumpBuffer=0;lastContactAt=-999;
    motion.launchAt=time;motion.legKick=1;motion.stunt='takeoff';
    sound('jump');if(!oneTime.has('hopReaction')){talk('BABY','WHY DOES THE GROUND KEEP LEAVING?',2.6);oneTime.add('hopReaction');}
  }
  function awardTrick(label,points,kind='air'){
    if(state!=='playing'||bike.broken)return;
    const chained=time-tricks.lastTrickAt<7.5;
    tricks.combo=chained?Math.min(4,tricks.combo+1):1;
    tricks.bestCombo=Math.max(tricks.bestCombo,tricks.combo);
    tricks.lastTrickAt=time;
    const actual=points*tricks.combo;
    tricks.total+=actual;score+=actual;bonus+=actual;
    tricks.title=label;tricks.detail=`+${actual} POINTS  ·  x${tricks.combo} COMBO`;
    tricks.showUntil=time+2.5;
    sound('trick');banner(`${label} +${actual}`,1.55);
    if(tricks.combo===3 && !oneTime.has('comboRoast')){
      talk('BABY',choose(trickQuips),2.3);oneTime.add('comboRoast');
    }
  }
  function updateTricks(dt){
    if(state!=='playing'||bike.broken)return;
    const p=bike;
    const localSlope=p.contact?slopeAt(p.x+24):0;
    // A real wheelie must lift the front end relative to the current slope;
    // merely holding the lean button does not earn points.
    const wheeling=p.contact&&p.vx>MAX_SPEED*.20&&(p.a-localSlope)<-.15;
    if(wheeling){
      tricks.wheelieSeconds+=dt;
      tricks.wheelieMeters+=Math.max(0,p.vx)*dt/10;
    }else if(tricks.lastWheelie){
      if(tricks.wheelieSeconds>.42 && tricks.wheelieMeters>2.4){
        const pts=Math.min(300,Math.round(20+tricks.wheelieSeconds*63+tricks.wheelieMeters*2));
        awardTrick(tricks.wheelieSeconds>1.4?'BEARLY A WHEELIE':'ACCIDENTAL WHEELIE',pts,'wheelie');
      }
      tricks.wheelieSeconds=0;tricks.wheelieMeters=0;
    }
    tricks.lastWheelie=wheeling;
    // A close pass only scores once per hazard, and a collision disqualifies it.
    for(const h of hazards){
      const key=h.type+':'+h.x;
      if(tricks.hazardsPassed.has(key)||p.x<h.x+23)continue;
      tricks.hazardsPassed.add(key);
      const gy=groundAt(h.x)??420;
      const nearEnough=(p.y>gy-195 && p.y<gy-38) || (h.type==='saw'&&Math.abs(p.y-h.y)<120);
      if(nearEnough && p.vx>MAX_SPEED*.64 && !hazardHits.has(key) && time>damageCooldown+.5)
        awardTrick('THAT WAS TOO CLOSE',85,'near');
    }
    if(tricks.combo && time-tricks.lastTrickAt>8.0)tricks.combo=0;
  }
  function updateStuntHud(){
    const visible=state==='playing' && (tricks.lastWheelie||time<tricks.showUntil);
    const element=$('stuntHud'); element.classList.toggle('active',visible);
    if(!visible)return;
    if(tricks.lastWheelie){
      $('stuntTitle').textContent='WHEELIE IN PROGRESS';
      $('stuntDetail').textContent=`${tricks.wheelieSeconds.toFixed(1)} SEC  ·  ${tricks.wheelieMeters.toFixed(1)} M`;
      $('stuntFill').style.width=`${Math.min(100,tricks.wheelieSeconds/2*100)}%`;
    }else{
      $('stuntTitle').textContent=tricks.title;
      $('stuntDetail').textContent=tricks.detail;
      $('stuntFill').style.width=`${Math.min(100,100*Math.max(0,tricks.showUntil-time)/2.5)}%`;
    }
  }
  // Sustained injuries are not terminal. Only a fatal head/body impact ends a run.
  function splatter(x,y,vx=0,vy=0,amount=24){
    // Independent cartoon-red physics particles; never embedded in any sprite.
    const n=Math.min(260,Math.round(amount*2.9));
    for(let i=0;i<n;i++)blood.push({x:x+rand(-12,12),y:y+rand(-12,12),
      vx:vx+rand(-380,380),vy:vy+rand(-570,150),life:rand(.8,3.5),
      r:rand(1.5,7.8),color:choose(['#aa0b19','#cd1425','#ef3943','#ff5454','#760918'])});
    for(let i=0;i<12;i++)stainMarks.push({x:x+rand(-55,55),y:y+rand(-15,15),r:rand(4,18),alpha:rand(.48,.85)});
    if(stainMarks.length>670)stainMarks.splice(0,stainMarks.length-670);
    if(blood.length>1400)blood.splice(0,blood.length-1400);
  }
  // Continuous loss from each detached limb. Added to the actual gameplay
  // update as a defined function (v8.3 accidentally called a missing helper).
  function lostLimbStump(part){
    if(bike.broken && bearThrown){
      const floor=groundAt(bearThrown.x);
      const landed=floor!==null && bearThrown.y+29>=floor-12;
      if(landed){
        const m={leftArm:[163,125],rightArm:[370,110],leftLeg:[101,103],rightLeg:[128,112]};
        const p=m[part]||[235,100],s=.285;
        return {x:bearThrown.x+(p[0]-235)*s,y:floor+(p[1]-148)*s};
      }
      const m={leftArm:[-22,-15],rightArm:[21,-11],leftLeg:[-12,20],rightLeg:[14,20]};
      const v=m[part]||[0,0],c=Math.cos(bearThrown.angle),ss=Math.sin(bearThrown.angle);
      return {x:bearThrown.x+v[0]*c-v[1]*ss,y:bearThrown.y+v[0]*ss+v[1]*c};
    }
    const map={leftArm:[121,159],rightArm:[216,158],leftLeg:[143,213],rightLeg:[174,215]};
    const pos=map[part]||[149,159];
    return partPos(pos[0],pos[1]);
  }
  function bleedDetachedLimbs(dt){
    if(lostParts.size===0)return;
    const intensity=(state==='dead'||bike.broken)?1.45:1;
    const boost=1+(lostParts.size-1)*.44;
    for(const name of lostParts){
      const pt=lostLimbStump(name);
      // Fractional-rate emission stays smooth regardless of frame rate.
      const count=Math.max(1,Math.floor(dt*100*boost*intensity+Math.random()));
      for(let k=0;k<count;k++){
        blood.push({x:pt.x+rand(-3,3),y:pt.y+rand(-3,3),
          vx:bike.vx*.12+rand(-120,140),vy:rand(-190,-30),
          life:rand(.45,1.4),r:rand(2.0,4.9),
          color:Math.random()<.22?'#7c0d17':'#bf1724'});
      }
    }
    if(blood.length>1700)blood.splice(0,blood.length-1700);
  }
  function detachPart(name){
    if(lostParts.has(name))return false;
    lostParts.add(name);
    const shift={leftArm:[-25,-26],rightArm:[21,-19],leftLeg:[-18,24],rightLeg:[21,24]};
    const [dx,dy]=shift[name]||[0,0];
    fragments.push({kind:name,x:bike.x+dx,y:bike.y+dy,vx:bike.vx+rand(-160,210),vy:bike.vy-rand(190,370),angle:0,va:rand(-10,10)});
    splatter(bike.x+dx,bike.y+dy,bike.vx*.25,-100,28);
    return true;
  }
  function injure(amount,kind='impact',severe=false,part='torso',point=null){
    if(debugSettings.godMode || state!=='playing'||time<damageCooldown)return false;
    damageCooldown=time+(kind==='saw'?.72:1.04);damagePoseUntil=time+0.42;bumpPoseUntil=time+0.28;
    health=clamp(health-amount,0,100);recentHitPart=part;
    const impact=point||partPos(part==='head'?165:145,part==='head'?90:150);
    spawnImpactCue(impact.x,impact.y,'bear');
    // Detach only the actual hit limb; never randomly remove an unrelated leg.
    const limb=['leftArm','rightArm','leftLeg','rightLeg'].includes(part)?part:null;
    if(limb && (severe || health<48))detachPart(limb);
    splatter(impact.x,impact.y,bike.vx*.24,-90,severe?85:45);
    cameraShake=severe?18:10;panic=clamp(panic+25,0,100);sound('crash');
    motion.impactAt=time;motion.impactPower=severe?1:0.6;
    bike.vx*=severe?.79:.89;bike.vy-=severe?125:65;bike.va+=rand(-.48,.48);
    banner(`${part.toUpperCase()} HIT · BEAR ${Math.round(health)}%`,1.65);
    talk('BEAR',choose(kind==='thrown bottle'?['THAT IS NOT A HEATED SEAT.','MY INSURANCE EXCLUDES AMBIENCE.']:kind==='thrown firecracker'?['THE SAFETY DEMONSTRATION FOUND US.','FESTIVE. LEGALLY QUESTIONABLE.']:kind==='thrown rock'?['GRAVITY HAS A COMPLAINTS DEPARTMENT.','WAS THAT LOCALLY SOURCED?']:['I THINK THAT WAS AN IMPORTANT BIT.','DO WE HAVE SPARE LEGS?','THERE WAS A SPEED BUMP WITH TEETH.']),2.15,true);
    $('statusLine').textContent=`BEAR ${Math.round(health)}% · TARGET: ${part.toUpperCase()} · ${lostParts.size} PARTS LOST`;
    if(health<=0)crash('unrecoverable bear-related incident');
    return true;
  }
  function crash(reason){
    if(debugSettings.godMode||bike.broken||state!=='playing')return;
    bike.broken=true;state='dead';deathAt=time;deathReason=reason;cameraShake=26;sound('crash');
    motion.crashAt=time;motion.impactAt=time;motion.impactPower=1;motion.stunt='crash';
    tricks.crashReason=reason;tricks.wheelieSeconds=0;tricks.wheelieMeters=0;tricks.lastWheelie=false;
    tricks.combo=0;$('stuntHud').classList.remove('active');
    // A smaller crash burst: old 120-particle opaque spray hid the ejected
    // baby for several frames and amplified the apparent disappearance.
    splatter(bike.x,bike.y-32,bike.vx*.3,-170,25+10*lostParts.size);
    // Preserve existing wounds and missing limbs across the ragdoll and ground pose.
    const lines=['THIS IS GOING ON YOUR PERFORMANCE REVIEW.','A VERY NORMAL THING TO HAPPEN.','I WOULD LIKE TO SPEAK TO THE BIKE MANAGER.','SOMEONE PLEASE CALL AN ADULT. NOT ME.'];
    talk('BABY',lines[Math.floor(Math.random()*lines.length)],2.9,true);
    banner(['UNSCHEDULED DISMOUNT','GRAVITY HAS FILED A COMPLAINT','PHYSICS: 1 · BEAR: 0'][Math.floor(Math.random()*3)],2.4);
    // Animated passenger ejection: airborne flail, visible tumble, skid, crying rest.
    const child=partPos(41,120);
    baby={x:child.x,y:child.y,vx:clamp(Math.abs(bike.vx)*.20-10,25,145),
      vy:clamp(bike.vy*.10-590,-660,-520),angle:bike.a-.24,va:(Math.random()<.5?-1:1)*rand(.85,5.0),
      grounded:false,expr:'terrified',bounces:0,landedAt:-1,restAt:-1,crashPhase:'eject',
      // Preserve the ACTUAL impact orientation. The crying cel must not snap
      // upright or always face right when the baby touches the road.
      landingFacing:1,landingTilt:0,landingAngle:0,
      peeCentre:0,peeBorn:-1};
    seatThrown=null;
    const rider=partPos(153,160);
    bearThrown={x:rider.x,y:rider.y,vx:clamp(bike.vx*.48+150,180,430),vy:clamp(bike.vy*.15-240,-340,-100),angle:bike.a,va:rand(-4,-1.2)};
    // A short sideways skid, not multiple backflips with a child on board.
    bike.va=clamp(bike.va+rand(-.3,.3),-.50,.50);bike.vy-=65;bike.vx*=.18;
    for(let i=0;i<40;i++)sparks.push({x:bike.x+rand(-30,30),y:bike.y+65,vx:rand(-340,340),vy:rand(-480,100),life:rand(.35,1.4),color:['#ebb961','#ec663f','#d8c3a6','#527486'][i%4],r:rand(2,8)});
    say('I REQUEST AN IMMEDIATE REFUND OF MY CHILDHOOD.',2.4); $('statusLine').textContent=`CRASH • ${reason.toUpperCase()}`;
  }
  function win(){if(state!=='playing')return;state='won';winAt=time;bike.x=FINISH-140;bike.vx=0;bike.vy=0;bike.va=0;bike.a=0;bike.contact=true;sound('finish');
    score+=Math.max(0,Math.round(420-seconds*1.3));sessionBest=Math.max(sessionBest,score);
    try{(window.BearlyCentrumSave?.storage||localStorage).setItem('bq-centrum:best-score:v1',String(sessionBest));}catch(e){}
    talk('BABY','I SURVIVED HÄSSELBY. THE BIKE DID NOT.',3.6,true);banner('MÄLAREN FINISH! · VICTORY DANCE!',3.2);
    $('statusLine').textContent='MÄLAREN REACHED · INSURANCE STILL PENDING';}
  function runStuntDemo(){
    reset(true);
    state='demo';demo.active=true;demo.startAt=time;demo.crashed=false;demo.stageIndex=-1;demo.stage='RIDE';
    keys.clear();$('overlay').hidden=true;
    dialogueActive=null;dialogueQueue=[];renderDialogue();popUntil=0;speechUntil=0;
    $('toast').hidden=true;$('bubble').classList.remove('show');
    $('demoBtn').textContent='■ END DEMO';
    const cue=$('demoCue');cue.classList.add('visible');cue.querySelector('.stage').textContent='RIDE';
    cue.querySelector('.detail').textContent='WATCH THE ACTUAL MOVE SEQUENCE';
  }
  function updateDemo(dt){
    const age=time-demo.startAt;
    let index=0;for(let i=0;i<demoStages.length;i++)if(age>=demoStages[i].at)index=i;
    index=Math.min(index,demoStages.length-1);
    if(index!==demo.stageIndex){
      demo.stageIndex=index;demo.stage=demoStages[index].name;
      const cue=$('demoCue');cue.querySelector('.stage').textContent=demo.stage;
      cue.querySelector('.detail').textContent=demoStages[index].text;
    }
    const prog=Math.min(100,age/11.2*100);
    $('demoProgress').style.width=prog+'%';
    // Keep the bicycle in exactly one local coordinate system throughout the act.
    const p=bike;
    if(age<5.5){
      const x=440+age*125;
      const gy=groundAt(x+riderX(REAR_X))??447;
      const groundedY=gy-TIRE_R-riderY(WHEEL_Y);
      p.x=x;p.vx=125+12*Math.sin(age*2);p.cycle+=p.vx*.03*dt;
      p.broken=false;hasEverGrounded=true;
      motion.recoil=0;motion.squash=0;motion.wheelie=0;motion.air=0;
      if(age<1.35){
        p.a=0;p.y=groundedY;p.contact=true;motion.extraPitch=0;
      }else if(age<2.95){
        const w=Math.sin(Math.PI*Math.min(1,(age-1.35)/1.6));
        p.a=0;p.y=groundedY;p.contact=true;
        motion.wheelie=w;motion.extraPitch=-.46*w;
      }else if(age<4.55){
        const t=Math.min(1,(age-2.95)/1.6), arc=Math.sin(Math.PI*t);
        p.y=groundedY-138*arc;p.contact=false;
        p.a=-.18*Math.cos(Math.PI*t);p.vy=-138*Math.PI/1.6*Math.cos(Math.PI*t);
        airTime=.2+t;motion.air=1;motion.legKick=arc;motion.extraPitch=-.12*Math.cos(Math.PI*t);
      }else{
        const t=age-4.55;const bounce=Math.exp(-t*5)*Math.sin(t*19);
        p.y=groundedY+3*bounce;p.a=.04*Math.exp(-t*6);p.vy=0;p.contact=true;
        motion.landAt=time-t;motion.landPower=1;
        motion.squash=Math.exp(-t*6)*Math.abs(Math.cos(t*15));
        motion.recoil=8*bounce;motion.extraPitch=.035*Math.exp(-t*5);
      }
    }else if(age>=9){
      // A deliberately staged cartoon recovery, not an automatic resurrection in the real level.
      const t=smooth(9,9.65,age);
      p.broken=false;p.contact=true;p.va=0;p.vy=0;
      p.x=1370+Math.max(0,age-9)*52;p.vx=65*t;
      const gy=groundAt(p.x+riderX(REAR_X))??420;
      p.y=gy-TIRE_R-riderY(WHEEL_Y)-34*(1-t);
      p.a=-.15*(1-t);p.cycle+=Math.max(25,p.vx)*.03*dt;
      lostParts.clear();motion.wheelie=0;motion.air=0;
      motion.extraPitch=-.11*(1-t);motion.recoil=0;
      motion.squash=.24*Math.sin(Math.PI*t);motion.stunt='recover';
    }else{
      // Demonstration now uses the same attached child seat as real gameplay.
      if(!demo.crashed){
        demo.crashed=true;state='playing';crash('demo crash');state='demo';
        // Demo stage labels replace story subtitles so the art stays visible.
        dialogueActive=null;dialogueQueue=[];renderDialogue();popUntil=0;speechUntil=0;
        $('toast').hidden=true;$('bubble').classList.remove('show');
        // The bear tumbles separately, while the baby stays in the rear seat.
        if(baby){baby.vx=p.vx+42;baby.vy=-390;baby.va=-3.6;}
        if(bearThrown){bearThrown.vx=p.vx+16;bearThrown.vy=-330;bearThrown.va=-2.7;}
        if(seatThrown){seatThrown.vx=p.vx+26;seatThrown.vy=-310;seatThrown.va=4.4;}
        motion.crashAt=time;demo.startAt=time-5.5;
      }
      p.cycle+=Math.max(0,p.vx)*.03*dt;
      p.vy+=1240*dt;p.y+=p.vy*dt;p.x+=p.vx*dt;p.a+=p.va*dt;p.va*=.992;
      const gy=groundAt(p.x);
      if(gy!==null&&p.y+55>gy){p.y=gy-55;p.vy=-Math.abs(p.vy)*.27;p.vx*=.97;p.va*=.90;}
      for(const obj of [bearThrown,baby,seatThrown]){
        if(!obj)continue;
        obj.vy+=1400*dt;obj.x+=obj.vx*dt;obj.y+=obj.vy*dt;
        obj.angle+=obj.va*dt;obj.va*=.992;
        const yg=groundAt(obj.x);const foot=obj===baby?34:obj===seatThrown?18:26;
        if(yg!==null&&obj.y+foot>yg){
          obj.y=yg-foot;const impact=Math.abs(obj.vy);
          obj.vy=impact>90?-impact*.25:0;obj.vx*=Math.exp(-1.3*dt);obj.va*=.85;
          obj.grounded=true;
        }
      }
    }
    const ageCrash=Math.max(0,time-motion.crashAt);
    // Unlike ordinary gameplay, demo holds on the aftermath for inspection.
    if(demo.crashed && age<9){motion.stunt=crashSequenceStage();motion.extraPitch=0;motion.squash=0;motion.recoil=0;}
    cameraX=clamp(p.x-W*.37,0,FINISH-W*.43);
    cameraY=lerp(cameraY,clamp(p.y-H*.54,-70,1530),.08);
    for(const list of [sparks,blood,groundDust])for(let i=list.length-1;i>=0;i--){
      list[i].life-=dt;if(list[i].life<=0)list.splice(i,1);
    }
    if(age>11.2){
      const cue=$('demoCue');cue.querySelector('.stage').textContent='DEMO COMPLETE';
      cue.querySelector('.detail').textContent='PRESS END DEMO OR R TO PLAY';
    }
  }
  // Continuous animated puke: sprayed from the baby, catches the wheel, falls
  // onto the street and leaves short-lived green splashes (not a static sprite).
  // Puking is a timed heave, not a nonstop garden hose. Emission starts from
  // the original sick-face's actual mouth (sprite local ~x64,y74).
  function updatePukeAnimation(dt){
    // Holding pedal to 95% of max always causes vomiting, without relying on a random panic episode.
    const atSpeed=state==='playing'&&!baby&&bike.vx>=MAX_SPEED*PUKE_SPEED_RATIO;
    const forced=state==='playing'&&!baby&&time<panicEpisodeUntil&&panicEpisodeType==='PUKE ATTACK';
    const triggered=atSpeed||forced;
    if(triggered && time>=pukeNextWave && time>=pukeWaveEnd){
      pukeWaveStart=time;
      pukeWaveEnd=time+rand(.66,.94);
      pukeNextWave=pukeWaveEnd+rand(.12,.22);
      pukeWaveCount++;
    }
    const active=triggered&&time<pukeWaveEnd;
    // Consecutive vomiting waves build sickness; braking stops the waves and
    // slowly eases nausea. HP does not regenerate by itself: Billys pickups heal it.
    if(state==='playing' && !baby){
      if(active){
        const dose=clamp((bike.vx-MAX_SPEED*.90)/(MAX_SPEED*.10),.5,1);
        pukeExposure=clamp(pukeExposure+dt*(.55+.95*dose),0,1);
        // Continuous full throttle is dangerous: only the visible heaves drain HP.
        const loss=dt*(30+32*pukeExposure)*(.65+.35*dose);
        health=clamp(health-loss,0,100);
        pukeDamageTotal+=loss;
        if(health<=0){crash('baby sickness overwhelmed the bear');}
      }else{
        pukeExposure=Math.max(0,pukeExposure-dt*(bike.vx<MAX_SPEED*.80?.30:.10));
      }
    }
    if(active && state==='playing'){
      const intensity=clamp((bike.vx-MAX_SPEED*.93)/(MAX_SPEED*.07),.22,1);
      const t=clamp((time-pukeWaveStart)/Math.max(.1,pukeWaveEnd-pukeWaveStart),0,1);
      const heave=Math.sin(t*Math.PI); // naturally tapers at either end of each burst
      const mouth=partPos(43+(60-49)*1.08,207+(72-134)*1.08); // v87: real sick-sprite lip, SAME bike-local transform as the seat
      pukeEmitAccumulator+=dt*(36+50*intensity)*(0.35+heave*.85);
      const count=Math.min(6,Math.floor(pukeEmitAccumulator));pukeEmitAccumulator-=count;
      for(let i=0;i<count;i++){
        pukeEmissionCount++;
        pukeDrops.push({x:mouth.x+rand(-1.2,1.2),y:mouth.y+rand(-1.5,1.5),
          vx:bike.vx+95+heave*80+rand(-25,25),vy:rand(55,115)+heave*105,
          r:rand(2.7,4.9),life:rand(.72,1.25),tail:rand(7,12),touchedWheel:false});
      }
      if(atSpeed)pukeWheelSlipUntil=Math.max(pukeWheelSlipUntil,time+.22);
    }else pukeEmitAccumulator=0;
    for(let i=pukeDrops.length-1;i>=0;i--){
      const d=pukeDrops[i];d.vy+=1050*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.life-=dt;
      const wheel=partPos(REAR_X,WHEEL_Y);
      if(!d.touchedWheel && Math.hypot(d.x-wheel.x,d.y-wheel.y)<40){
        d.touchedWheel=true;
        for(let j=0;j<2;j++)pukeDrops.push({x:d.x,y:d.y,vx:d.vx+rand(-95,100),vy:rand(-145,55),r:rand(1.3,2.7),life:.48,tail:5,touchedWheel:true});
      }
      const ground=groundAt(d.x);
      if(d.life<=0||(ground!==null&&d.y>=ground-3)){
        if(ground!==null&&d.y>=ground-9){
          pukeSplatters.push({x:d.x,y:ground-1,r:rand(3,9),born:time});
          if(pukeSplatters.length>150)pukeSplatters.shift();
        }
        pukeDrops.splice(i,1);
      }
    }
    for(let i=pukeSplatters.length-1;i>=0;i--)if(time-pukeSplatters[i].born>10)pukeSplatters.splice(i,1);
    if(pukeDrops.length>180)pukeDrops.splice(0,pukeDrops.length-180);
  }
  function drawPukeSplashes(){
    ctx.save();
    for(const p of pukeSplatters){
      const alpha=Math.max(0,Math.min(.87,(10-(time-p.born))/4.4));
      ctx.globalAlpha=alpha;ctx.fillStyle='#779c38';ctx.beginPath();ctx.ellipse(p.x,p.y,p.r,2.0+p.r*.14,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(202,233,100,.7)';ctx.beginPath();ctx.ellipse(p.x-p.r*.27,p.y-1,p.r*.39,1.2,0,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  function drawPukeFlow(){
    ctx.save();ctx.lineCap='round';
    // A short LIVE connection makes it unmistakable that each wave begins
    // at the baby's actual sick-sprite mouth, not from the bear or rear wheel.
    if(state==='playing'&&!baby&&time<pukeWaveEnd &&
        (bike.vx>=MAX_SPEED*PUKE_SPEED_RATIO||panicEpisodeType==='PUKE ATTACK')){
      const mouth=partPos(43+(60-49)*1.08,207+(72-134)*1.08);
      const progress=clamp((time-pukeWaveStart)/Math.max(.1,pukeWaveEnd-pukeWaveStart),0,1);
      const pulse=Math.max(.08,Math.sin(progress*Math.PI));
      const sw=Math.sin(time*24)*3;
      ctx.globalAlpha=.75*pulse;ctx.strokeStyle='#9fc34e';ctx.lineWidth=3.0+2.8*pulse;
      ctx.beginPath();ctx.moveTo(mouth.x,mouth.y);
      ctx.bezierCurveTo(mouth.x+11,mouth.y+8+sw,mouth.x+22,mouth.y+21+sw,mouth.x+35+5*pulse,mouth.y+44+sw);
      ctx.stroke();
      ctx.globalAlpha=.85*pulse;ctx.fillStyle='#c8e378';ctx.beginPath();ctx.arc(mouth.x,mouth.y,2.4,0,Math.PI*2);ctx.fill();
    }
    for(const d of pukeDrops){
      const alpha=Math.max(0,Math.min(1,d.life));
      ctx.globalAlpha=alpha;
      ctx.strokeStyle=d.touchedWheel?'#7ea032':'#97c33e';
      ctx.lineWidth=d.r*1.25;
      ctx.beginPath();ctx.moveTo(d.x-d.vx*.015,d.y-d.vy*.015);ctx.lineTo(d.x,d.y);ctx.stroke();
      ctx.fillStyle='#c5ea6f';ctx.beginPath();ctx.arc(d.x,d.y,Math.max(1.6,d.r*.74),0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  function updateBabyPanicEvent(dt){
    if(state!=='playing')return;
    // Speed-induced panic follows the deterministic vomit threshold, not a random meltdown.
    if(bike.vx>=MAX_SPEED*.82)panicHighTime=0;
    else if(panic>=94 && !bike.broken)panicHighTime+=dt;
    else panicHighTime=Math.max(0,panicHighTime-dt*1.8);
    if(time<panicEpisodeUntil){
      panicShock=Math.max(0,(panicEpisodeUntil-time)/2.4);
      if(panicEpisodeType==='GRAB BRAKES'){
        bike.vx=Math.max(0,bike.vx-180*dt);
      }else if(panicEpisodeType==='PANIC WOBBLE'){
        bike.va+=Math.sin(time*14)*.65*dt;
      }else if(panicEpisodeType==='PUKE ATTACK'){
        // Wet wheel: steering impulse goes through angular velocity, never
        // a direct angle teleport. The rider keeps control and can recover.
        bike.va+=(Math.sin(time*13.5)*2.15+Math.sin(time*26.5)*.5)*dt;
        bike.vx=Math.max(0,bike.vx-18*dt);
      }
      return;
    }
    panicShock=Math.max(0,panicShock-dt*2);
    if(panicHighTime<3.6 || time<panicEpisodeCooldown)return;
    panicEvents++;
    panicEpisodeType=choose(['GRAB BRAKES','PANIC WOBBLE','SCREAMING FIT']);
    panicEpisodeUntil=time+2.1;
    panicEpisodeCooldown=time+rand(10,15);
    panicReliefUntil=time+5.5;
    panicHighTime=0;
    panicShock=1;
    panic=clamp(panic-39,0,100);
    bumpPoseUntil=Math.max(bumpPoseUntil,time+.5);
    if(panicEpisodeType==='PUKE ATTACK'){
      pukeWheelSlipUntil=time+3.4; talk('BABY','THAT SPEED JUST REVERSED MY LUNCH.',2.3,true);
    }else if(panicEpisodeType==='GRAB BRAKES'){
      talk('BABY','I AM APPLYING THE EMERGENCY BABY BRAKES!',2.3,true);
    }else if(panicEpisodeType==='PANIC WOBBLE'){
      talk('BABY','MY LEGS ARE STEERING NOW! THAT IS A PROBLEM!',2.3,true);
    }else{
      talk('BABY','AAAAAAAAAA! WE NEED A DIFFERENT DRIVER!',2.3,true);
    }
    banner('BABY MELTDOWN · '+panicEpisodeType,2.2);
    cameraShake=Math.max(cameraShake,4);
    sound('panic');
  }
  function update(dt){
    time+=dt;
    if(demo.active){updateDemo(dt);return;}
    if(state==='menu'||state==='paused'||state==='won_end')return;
    // A real DKC-style finish hold: stop the physics and let the bear and baby
    // celebrate on screen before opening the results overlay.
    if(state==='won'){
      const age=time-winAt;
      bike.vx=0;bike.vy=0;bike.va=0;bike.contact=true;
      bike.cycle+=11*dt;
      if(age>=5.5){
        overlay('AGAINST ALL<br/><em>REASON...</em>',`FINISHED IN ${seconds.toFixed(1)}s • SCORE ${score} • BEST ${sessionBest}. Collected ${numStars}/${stars.length} Billys pizzas. The baby is still filing a complaint.`, 'DO IT WORSE NEXT TIME');
        state='won_end';
      }
      updateHud();
      return;
    }
    seconds+=dt;dialogueTick();jumpBuffer=Math.max(0,jumpBuffer-dt);
    if(state==='playing' && jumpBuffer>0 && (bike.contact||time-lastContactAt<.13))doHop();
    let steer=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0);
    let gas=keys.has('ArrowUp')||keys.has('KeyW');
    let brake=keys.has('ArrowDown')||keys.has('KeyS');
    if(state==='playing' && gas && !wasPedaling)throttleStartedAt=time;
    wasPedaling=state==='playing' && gas;
    const p=bike;
    const bikeOldX=p.x,bikeOldY=p.y;
    const ground=p.contact;
    if(state==='playing'){
      // Brake first, then reverse while held once the bike has stopped.
      if(brake) p.vx=p.vx>0?Math.max(0,p.vx-1050*dt):Math.max(-REVERSE_MAX,p.vx-(p.contact?400:160)*dt);
      else if(gas) p.vx+=(p.contact?(p.vx<420?140:p.vx<590?90:55):130)*(lostParts.has('leftLeg')||lostParts.has('rightLeg')?0.72:1)*dt;
      // Keep momentum while coasting; at high speed the rider must actually brake.
      if(!gas&&!brake)p.vx*=Math.exp(-(p.contact?.16:.065)*dt);
      if(p.contact && p.vx>8)p.vx+=clamp(slopeAt(p.x+24),-.7,.75)*245*dt;
      p.vx=clamp(p.vx,-REVERSE_MAX,MAX_SPEED);peakSpeed=Math.max(peakSpeed,p.vx);
      p.va+=steer*(ground?3.15:6.2)*dt;
    }else p.vx*=Math.exp(-2.1*dt);
    if(state==='playing'&&!steer){
      // Gentle no-input stabilization keeps the bike ride fluid but still lets players flip intentionally.
      const normalized=((p.a+Math.PI*3)%(Math.PI*2))-Math.PI;
      p.va-=normalized*(ground?5.5:2.6)*dt;
    }
    p.va*=Math.exp(-(ground?3.6:1.2)*dt);
    p.vy+=1420*dt;
    p.x=Math.max(110,p.x+p.vx*dt); // Keep reversing inside the drivable world's start boundary.
    if(p.x===110 && p.vx<0)p.vx=0;
    p.y+=p.vy*dt;
    p.a+=p.va*dt;
    p.cycle+=p.vx/Math.max(1,TIRE_R)*dt;
    let touch=[], hit=0, normalY=0;
    for(const wx of [riderX(REAR_X),riderX(FRONT_X)]){
      const point=wheelPos(wx),gy=groundAt(point.x);
      if(gy===null)continue;
      const penetration=point.y+TIRE_R-gy;
      if(penetration>-1.5){touch.push({wx,penetration,gy});if(penetration>hit)hit=penetration;normalY=gy;}
    }
    const wasOnGround=p.contact;
    p.contact=touch.length>0;
    if(p.contact){lastContactAt=time;hasEverGrounded=true;}
    if(!p.contact){if(wasOnGround)airtimeStartedAt=time;airTime+=dt;airborne=true;}
    if(p.contact&&!wasOnGround&&airborne){
      const landingSpeed=p.vy;
      if(airTime>.28&&p.a>-0.5&&p.a<.55&&state==='playing'){
        const pts=airTime>1.2?150:airTime>.65?80:40;
        awardTrick(airTime>1.2?'GOLD-PLATED BAD DECISION':airTime>.65?'SURPRISINGLY CLEAN LANDING':'ALMOST PROFESSIONAL',pts,'landing');
        perfectLandings++;
      }
      // Small wheel-ground corrections are not a landing animation.
      if(airTime>0.20 && time>0.9 && time-motion.launchAt<3.0){
        landingWasHard=landingSpeed>345;
        landingPoseUntil=time+(landingWasHard?0.52:0.28);
        motion.landAt=time;motion.landPower=clamp(landingSpeed/570,0.18,1);motion.stunt='landing';
        // A single radial dust burst on the instant of landing (not each wheel correction).
        for(const local of [riderX(REAR_X),riderX(FRONT_X)]){
          const w=wheelPos(local), gy=groundAt(w.x);
          if(gy!==null)for(let j=0;j<8;j++)groundDust.push({x:w.x+rand(-7,7),y:gy-2,
            vx:rand(-155,155),vy:rand(-130,-25),life:rand(.24,.63),r:rand(2.3,5.8)});
        }
        if(landingSpeed>215)bumpPoseUntil=time+0.19;
      }
      if(landingSpeed>390 && airTime>.30){cameraShake=Math.min(5,landingSpeed/125);panic=clamp(panic+3,0,100);}
      airTime=0;airborne=false;
    }
    if(p.contact){
      if(hit>0){p.y-=hit*.99;if(p.vy>0){if(p.vy>360)sound('bounce');p.vy=-Math.min(60,p.vy*.12);}}
      if(touch.length>=1 && !p.broken){
        const target=clamp(slopeAt(p.x+24),-.58,.58);
        const diff=((target-p.a+Math.PI*3)%(Math.PI*2))-Math.PI;
        const correcting=!(keys.has('ArrowLeft')||keys.has('KeyA')||keys.has('ArrowRight')||keys.has('KeyD'));
        if(correcting){p.a+=diff*clamp(dt*18,0,1);p.va*=Math.exp(-7.5*dt);}
        else p.va+=diff*7*dt;
      }else if(!p.broken){
        p.va+=(p.a>0?-.3:.3)*dt;
      }
    }
    if(p.contact && !p.broken){
      // A completed 360-degree flip is upright again; compare the wrapped angle to road slope.
      const relativeAngle=Math.atan2(Math.sin(p.a-slopeAt(p.x+24)),Math.cos(p.a-slopeAt(p.x+24)));
      if(Math.abs(relativeAngle)<1.25)flipGroundImpactLatched=false;
      else if(!flipGroundImpactLatched && Math.abs(relativeAngle)>2.25 &&
        (Math.abs(p.vx)>120 || Math.abs(relativeAngle)>2.85)){
        flipGroundImpactLatched=true;
        injure(35,'flip',true);
      }
    }
    if(state==='playing'){
      const d=districtAt(p.x);const districtCode='district:'+d.style;
      if(p.x>450&&!oneTime.has(districtCode)){oneTime.add(districtCode);banner(d.name,2.7);}
      for(let i=0;i<episodes.length;i++){
        const ev=episodes[i];const code='episode'+i;
        if(p.x>ev.x&&!oneTime.has(code)){talk(ev.who,ev.line,ev.duration);oneTime.add(code);}
      }
      for(let i=0;i<checkpoints.length;i++){
        const cp=checkpoints[i];if(p.x>=cp.x && checkpoint<=i){
          checkpoint=i+1;checkpointLabel=cp.label;sound('checkpoint');banner('CHECKPOINT: '+cp.label,2.6);
          $('checkpointLabel').textContent=`CP ${checkpoint} / ${checkpoints.length}`;score+=175;
          window.BearlyCentrumEconomy?.scheduleCheckpoint('route-checkpoint-'+checkpoint);
        }
      }
      if(p.x>750&&!oneTime.has('tutorialJump')){banner('SPACE = HOP • ARROWS = LEAN',2.7);oneTime.add('tutorialJump');}
      if(p.x>2140&&!oneTime.has('safetyCouncil')){
        talk('NARRATOR','THE SAFETY COUNCIL HAS RESIGNED.',2.7);oneTime.add('safetyCouncil');
      }
      partHazards();
      for(const ramp of ramps){
        const id='ramp:'+ramp.x;
        if(p.contact && p.vx>85 && keys.has('Space') && Math.abs(p.x-ramp.x)<11 && !oneTime.has(id)){
          oneTime.add(id);p.vy=-ramp.boost; p.y-=11;p.contact=false;
          airborne=true;airTime=0;motion.launchAt=time;motion.stunt='takeoff';
          sound('jump');banner('LAUNCH RAMP · '+ramp.label,1.8);
          for(let j=0;j<12;j++)groundDust.push({x:p.x+rand(-25,25),y:groundAt(p.x)??p.y+80,vx:rand(-130,120),vy:rand(-180,-35),life:rand(.3,.8),r:rand(2,6)});
        }
      }
      // Trigger a short, single anticipatory brace near each actual hazard.
      // Holding ↑ must never continuously retrigger a frightened pose.
      if(p.vx>55 && p.contact){
        for(const h of hazards){
          const hazardId=h.type+':'+h.x;
          const d=h.x-p.x;
          const threshold=clamp(p.vx*0.34,65,120);
          if(d>18 && d<threshold && !hazardReacted.has(hazardId)){
            hazardReacted.add(hazardId);
            hazardReactUntil=time+0.46;
          }
        }
      }
      if(p.y>fallReference(p.x)+435)crash('gravity wins again');
      // Pickup hit testing uses visible rider and passenger geometry, not the
      // bicycle's internal center. The small wrapper should collect if the bear
      // really touches it during ordinary cycling, without a forced hop.
      for(const [pickupIndex,star] of stars.entries()) if(!star.got&&v146PizzaTouched(star)){
        const collected=window.BearlyCentrumEconomy?.collect('route-pizza-'+pickupIndex);
        if(collected?.ok){
          star.got=true;numStars++;bonus+=100;score+=100;sound('pizza-kiss');
          $('starsCount').textContent=`${numStars} / ${stars.length}`;
        }
      }
      const distanceToFinish=FINISH-p.x;
      if(distanceToFinish<BRAKE_ZONE && !oneTime.has('brake-zone')){
        oneTime.add('brake-zone');banner('MÄLAREN BRAKING ZONE · HOLD ↓ / S',3.1);
        talk('BABY','THIS IS NOT A FERRY RAMP! BRAKE, YOU FURRY IDIOT!',3.4,true);
      }
      if(distanceToFinish<1050 && p.vx>SAFE_FINISH_SPEED && !oneTime.has('brake-last')){
        oneTime.add('brake-last');banner('SLOW TO 14 KM/H OR LESS AT FINISH!',2.7);
      }
      if(p.x>=FINISH-90 && p.vx<=SAFE_FINISH_SPEED && p.contact){win();}
      else if(p.x>=FINISH && p.vx>SAFE_FINISH_SPEED){
        // Overshooting a short lakeside stop zone is a real penalty, not free victory.
        splatter(p.x,p.y,p.vx*.2,-100,10);
        crash('forgot the brakes at Mälaren');
      }
      const airStress=!p.contact ? 18:0;
      // Fear builds in stages: cruising is fine, 86%+ is terrifying, 95%+ makes the baby sick.
      const speedRatio=clamp(Math.max(0,p.vx)/MAX_SPEED,0,1);
      const speedPanic=clamp((speedRatio-.60)/(.94-.60)*100,0,100);
      let danger=0;
      for(const h of hazards)if(h.x>p.x&&h.x<p.x+260)danger=Math.max(danger,(260-(h.x-p.x))*.14);
      let pitAhead=groundAt(p.x+120)===null?17:0;
      const isSickNow=time<pukeWaveEnd && (p.vx>=MAX_SPEED*PUKE_SPEED_RATIO||panicEpisodeType==='PUKE ATTACK');
      const target=clamp(Math.max(isSickNow?100:4,speedPanic,(Math.abs(p.va)*15+airStress+Math.abs(p.a)*19+danger+pitAhead)*1.45),3,100);
      const easedPanic=time<panicReliefUntil&&!isSickNow&&speedRatio<.82?Math.min(target,55):target;
      // Baby reacts quickly enough to be visibly terrified before the puke threshold.
      panic=lerp(panic,easedPanic,clamp(dt*(easedPanic>panic?(speedRatio>=.82?4.2:2.1):1.22),0,1));
      updateBabyPanicEvent(dt);
      const mood=(panic<11?'original_photo':panic<22?'happy':panic<37?'confused':panic<53?'excited':panic<70?'derp':panic<84?'terrified':panic<95?'sick':'terrified');
      p.expression=mood;
      maxDist=Math.max(maxDist,p.x);
      if(p.contact && Math.abs(p.a)>.22 && Math.abs(p.a)<1.2 && p.vx>MAX_SPEED*.70 && p.va<1.2){
        if(!oneTime.has('wheelieFunny')&&p.x>1100){talk('BABY','I CAN SEE MY CREDIT SCORE FROM HERE.',2.7);oneTime.add('wheelieFunny');}
      }
      if(panic>85&&!oneTime.has('panicEpisode')){talk('BABY','YOU ARE A BEAR! YOU CANNOT DRIVE!',3);oneTime.add('panicEpisode');}
      // Ambient quips appear intermittently, not every frame and not on top of scripted dialogue.
      if(time>nextBarkAt && !dialogueActive && time>dialogueCooldown+.35){
        const pool=!p.contact ? airBarks : panic>65?stressBarks:babyBarks;
        const line=choose(pool);say(line,2.0);barkCount++;
        if(barkCount%2===0)talk('BABY',line,2.35);
        nextBarkAt=time+rand(5.2,8.0);
      }
      const headTarget=clamp(p.va*.07 + p.vy*.00015 + (p.contact ? Math.sin(time*12)*(p.vx/9000) : -.07),-.16,.16);
      babyHeadV+=(headTarget-babyHead)*27*dt;babyHeadV*=Math.exp(-8*dt);babyHead+=babyHeadV;

      if(time<pukeWheelSlipUntil && p.contact && !p.broken){
        const slip=Math.max(0,(pukeWheelSlipUntil-time)/3.4);
        p.va+=(Math.sin(time*11.8)*2.1+Math.sin(time*22.0)*.45)*slip*dt;
        p.vx=Math.max(0,p.vx-14*slip*dt);
      }

      if(p.contact&&Math.abs(p.vx)>100&&Math.random()<.21){const pt=wheelPos(riderX(REAR_X));groundDust.push({x:pt.x,y:pt.y+TIRE_R,vx:rand(-110,-30),vy:rand(-100,-5),life:rand(.3,.7),r:rand(2,5)});}
    }
    // Continue the already-emitted fluid simulation through crashes and
    // the results screen; otherwise the stream freezes in midair on death.
    updatePukeAnimation(dt);
    updateBabyCrying(dt);
    if(bearThrown){
      bearThrown.vy+=1420*dt;bearThrown.x+=bearThrown.vx*dt;bearThrown.y+=bearThrown.vy*dt;
      bearThrown.angle+=bearThrown.va*dt;bearThrown.va*=.993;
      const gy=groundAt(bearThrown.x);
      if(gy!==null&&bearThrown.y+26>gy){bearThrown.y=gy-26;bearThrown.vy=-Math.abs(bearThrown.vy)*.22;bearThrown.vx*=.89;bearThrown.va*=.84;}
    }
    if(baby){
      const crashAge=time-motion.crashAt;
      // A true rising-and-falling arc before landing, not a ground-level roll.
      baby.vy+=960*dt;baby.x+=baby.vx*dt;baby.y+=baby.vy*dt;
      baby.angle+=baby.va*dt;
      baby.x=clamp(baby.x,0,FINISH+1800); // Crash trajectory independent of fallen bike.
      const gy=groundAt(baby.x);
      // Resting baby has a different sprite's visible contact height from the
      // tumbling collision capsule; place the crying pose at the asphalt, not above it.
      const visualFoot=baby.restAt>=0?21:27;
      if(gy!==null&&baby.y+visualFoot>=gy-.05){
        baby.y=gy-visualFoot;
        const impact=Math.abs(baby.vy);
        if(baby.landedAt<0){
          baby.landedAt=time;baby.bounces=1;baby.vx*=.45;
          // Derive which side touches down from the final airborne rotation.
          // Different crash timing produces different left/right landings.
          const impactAngle=Math.atan2(Math.sin(baby.angle),Math.cos(baby.angle));
          baby.landingAngle=impactAngle;
          baby.landingFacing=Math.cos(impactAngle)<0?-1:1;
          const faceRelative=impactAngle-(baby.landingFacing<0?Math.PI:0);
          baby.landingTilt=clamp(Math.atan2(Math.sin(faceRelative),Math.cos(faceRelative))*.38,-.44,.44);
        }
        // AIRTIME ends on ground contact. Show a brief impact, then go
        // straight into crying and pee instead of a long forced skid pose.
        baby.vy=0;baby.grounded=true;
        if(baby.restAt<0 && time-baby.landedAt>=.18){baby.restAt=time;baby.vx=0;}
        baby.crashPhase=baby.restAt>=0?'cry':'impact';
        baby.va=0; // Keep the landed side / angle, do NOT ease toward zero.
        baby.vx*=Math.exp(-(baby.restAt>=0?12.0:6.0)*dt);
        baby.expr='knocked';
      }else{
        baby.grounded=false;
        baby.crashPhase=crashAge<.26?'eject':'tumble';
        baby.va*=Math.exp(-1.25*dt);
      }
      if(baby.restAt>=0 && time-baby.restAt>.3)baby.vx*=Math.exp(-11*dt);
      else if(!baby.grounded)baby.vx*=Math.exp(-.55*dt);
    }
    if(seatThrown){
      seatThrown.vy+=1380*dt;seatThrown.x+=seatThrown.vx*dt;seatThrown.y+=seatThrown.vy*dt;seatThrown.angle+=seatThrown.va*dt;seatThrown.va*=.995;
      const gy=groundAt(seatThrown.x);
      if(gy!==null&&seatThrown.y+18>gy){
        seatThrown.y=gy-18;
        const impact=Math.abs(seatThrown.vy);
        if(impact>80){seatThrown.vy=-impact*.24;seatThrown.vx*=.93;seatThrown.va*=.78;}
        else {seatThrown.vy=0;seatThrown.vx*=Math.exp(-1.0*dt);seatThrown.va*=Math.exp(-1.8*dt);}
        seatThrown.grounded=true;
      }
    }
    for(const f of fragments){
      f.vy+=1420*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.angle+=f.va*dt;f.va*=.993;
      const gy=groundAt(f.x);
      if(gy!==null && f.y+14>gy){f.y=gy-14;f.vy=-Math.abs(f.vy)*.24;f.vx*=.91;f.va*=.83;}
    }
    updateRoadsideEncounters(dt,bikeOldX,bikeOldY);updateEncounterFeeling(dt);updateStuntMotion(dt);updateTricks(dt);
    bleedDetachedLimbs(dt);
    for(let i=blood.length-1;i>=0;i--){const b=blood[i];b.vy+=700*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
      const gy=groundAt(b.x);if(gy!==null&&b.y>=gy){if(Math.random()<.84){stainMarks.push({x:b.x,y:gy,r:b.r*rand(1,3.6),alpha:rand(.45,.95)});if(stainMarks.length>670)stainMarks.shift();}blood.splice(i,1);continue;}
      if(b.life<=0)blood.splice(i,1);
    }
    if(state==='dead'&&time-deathAt>4.5 && (!baby || baby.restAt>=0 || time-deathAt>6.5)) {
      const distance=Math.max(0,Math.round((maxDist-200)/10));
      overlay('RIDE OVER',`${distance} m · Score ${score} · ${checkpoint?'Checkpoint saved':'No checkpoint'}`, checkpoint?'RETRY CHECKPOINT':'TRY AGAIN');
      $('toast').hidden=true;$('bubble').classList.remove('show');$('dialogue').classList.remove('active');
      state='dead_end';
    }
    updateParticles(sparks,dt);updateParticles(groundDust,dt);
    // Look slightly ahead at high speed and during a jump, without sudden snaps.
    const lead=clamp((Math.max(0,p.vx)-70)*0.34,0,180)+(!p.contact?28:0);
    const targetCam=clamp(p.x-W*.34+lead,0,FINISH-W*.43);
    cameraX=lerp(cameraX,targetCam,1-Math.exp(-dt*3.6));
    // Keep an ejected baby inside the playable frame for the ENTIRE arc.
    // The prior camera tracked the broken bike only, so the baby disappeared
    // above the upper edge at the apex and popped back during descent.
    let yLook=p.y-330;
    if(baby && (state==='dead'||state==='dead_end'||(demo.active&&demo.crashed))){
      if(!baby.grounded){
        yLook=Math.min(yLook,baby.y-155);
      } else {
        yLook=Math.min(yLook,baby.y-250);
      }
    }
    const yTarget=clamp(yLook,-160,groundAt(FINISH)-245);
    const camSmoothing=baby&&!baby.grounded?4.8:1.8;
    cameraY=lerp(cameraY,yTarget,1-Math.exp(-dt*camSmoothing));cameraShake=Math.max(0,cameraShake-dt*22);
    if(time>popUntil)$('toast').hidden=true;
    if(time>speechUntil)$('bubble').classList.remove('show');
    updateHud();updateStuntHud();
  }
  function updateParticles(array,dt){for(let i=array.length-1;i>=0;i--){const p=array[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.life-=dt;if(p.life<=0)array.splice(i,1);}}
  // V10.51: the original V10.48 baby riding art and proportions are authoritative.
  // Only the HUD expression changes, based on the specific mounted cel now shown.
  // Never choose AIRTIME while the baby is still strapped to the bicycle.
  function v149Emotion(){
    if(baby){
      if(baby.restAt>=0 || (baby.grounded && baby.landedAt>=0))return 'crying';
      if((state==='dead'||state==='dead_end') && baby.landedAt<0
          && time-motion.crashAt<.48)return 'airtime';
      return 'knocked';
    }
    if(state==='dead'||state==='dead_end')return 'knocked';
    if(state==='won')return 'laughing';
    if(state==='playing' && (time<pukeWaveEnd || mountedBabyAnim().pose==='sick'))return 'sick';
    const anim=mountedBabyAnim();
    const cel=mountedBabyCelName(anim.pose);
    // Reflect the *visible original cel's* mouth/eye expression rather than an
    // unrelated panic threshold; position and proportions are left untouched.
    const emotionByCel={
      idle:'happy',laugh:'laughing',terror:'terrified',leanBack:'excited',
      leanForward:'angry',point:'happy',brace:'angry',sick:'sick'
    };
    // Force hit reaction and hard landings to correspond to the terrified old cel.
    if(anim.pose==='bump' || anim.pose==='airtime' || anim.pose==='landing')return 'terrified';
    if(anim.pose==='brace' && (anim.reason==='danger'||anim.reason==='normal riding hop'))return 'terrified';
    return emotionByCel[cel]||'happy';
  }
  function updateHud(){
    $('distance').innerHTML=`${String(Math.max(0,Math.round((bike.x-200)/10))).padStart(4,'0')} <small>m</small>`;
    $('progressFill').style.width=`${clamp((bike.x-200)/(FINISH-200)*100,0,100)}%`;
    const kph=Math.round(Math.abs(bike.vx)*KMH_PER_SPEED);
    $('speedValue').textContent=(bike.vx<-.5?'R ':'')+kph+' KM/H';
    $('speedValue').style.color= bike.x>FINISH-BRAKE_ZONE&&bike.vx>SAFE_FINISH_SPEED?'#ff826d':bike.vx>=MAX_SPEED*PUKE_SPEED_RATIO?'#ff826d':bike.vx>=MAX_SPEED*TERROR_SPEED_RATIO?'#ffe08b':'#c6fff6';
    const left=Math.max(0,Math.round((FINISH-bike.x)/10));
    const stopLabel=$('brakeAlert');
    stopLabel.textContent= bike.x>FINISH-BRAKE_ZONE ? (bike.vx>SAFE_FINISH_SPEED?'BRAKE':'STOP AHEAD') : '';
    stopLabel.classList.toggle('danger',bike.x>FINISH-BRAKE_ZONE&&bike.vx>SAFE_FINISH_SPEED);
    if(stopLabel.classList.contains('danger'))stopLabel.textContent='BRAKE!';
    $('panicFill').style.width=`${clamp(panic,0,100).toFixed(0)}%`;
    $('panicFill').style.boxShadow=panic>=87?'0 0 15px rgba(255,104,83,.84)':'none';
    $('panicFill').style.transform=panic>=87?`scaleY(${(1+.12*Math.sin(time*13)).toFixed(3)})`:'scaleY(1)';
    $('panicNumber').textContent=`${Math.round(panic)}%`;
    const label=time<panicEpisodeUntil?'MELTDOWN · '+panicEpisodeType:panic<15?'SUSPICIOUSLY HAPPY':panic<32?'ENJOYING THE RIDE':panic<48?'STARTING TO QUESTION THINGS':panic<67?'CONCERNED ADULT INFANT':panic<83?'SCREAMING INTERNALLY':'FULL EXISTENTIAL CRISIS';
    const expressiveMood=baby
      ? (baby.restAt>=0||baby.grounded?'CRYING · DEFINITELY NOT OKAY':
        time-motion.crashAt<.55?'AIRTIME · BAD IDEA':'CRASHED · STILL FALLING')
      : (time<pukeWaveEnd && state==='playing'?'PUKING · PANIC '+Math.round(panic)+'%':label);
    $('moodText').textContent=baby ? (baby.grounded?'CRYING':'AIRTIME') :
      (time<pukeWaveEnd?'PUKING':v149Emotion().toUpperCase().replace('_',' '));
    $('healthFill').style.width=`${clamp(health,0,100).toFixed(1)}%`;
    $('healthNumber').textContent=Math.ceil(health)+'%';
    $('healthFill').style.background=health<25?'#eb5652':health<55?'#edb94c':'#65caa2';
    $('scoreCount').textContent=String(score + Math.max(0,Math.round((maxDist-210)/10)));
    // User selections: new HUD ONLY for Excited and Sick; all other moods
    // return to pre-V149 portraits, chosen by the actual visible baby pose.
    const emotion=v149Emotion();
    const oldFace={happy:'happy',terrified:'terrified',angry:'angry',laughing:'laughing',
      crying:'crying',knocked:'knocked',airtime:'terrified'}[emotion]||'happy';
    // Each portrait is a 128x128 standardized crop. Only expression changes;
    // the frame, face center, head scale, and crop rectangle never move.
    const portraitKey='v158_hud_'+((emotion==='excited'||emotion==='sick')?emotion:oldFace);
    if($('babyReaction').dataset.face!==portraitKey){
      $('babyReaction').dataset.face=portraitKey;
      $('babyReaction').src=window.BEARLY_ASSETS[portraitKey]||window.BEARLY_ASSETS['face_happy'];
    }
    $('babyReaction').dataset.pose=emotion;
    window.BEARLY_V151_PORTRAIT=portraitKey;
    window.BEARLY_V149_EMOTION=emotion;
    const region=(districts.indexOf(districtAt(bike.x))+1)+' · '+districtAt(bike.x).name;
    $('regionLabel').textContent=region;
  }
  // v5.7: painted skyline panels crossfade with the actual current district.
  // This is a distant layer, so it slides more slowly than buildings and road.
  function paintDistantHasselby(){
    const zones=['homes','metro','market','forest','lake'];
    // A continuous sinusoidal drift replaces the old modulo wrap, which
    // teleported the panorama 210 pixels in one frame every few kilometers.
    const drift=95*Math.sin(cameraX/9000);
    const transitions=districts.slice(0,-1).map(d=>smooth(d.end-1600,d.end+1600,bike.x));
    function band(zone,opacity){
      const im=images['v57_pano_'+zone];if(!im?.naturalWidth||opacity<.002)return;
      ctx.save();ctx.globalAlpha=opacity;
      ctx.drawImage(im,-310-drift,165,W+680,H*.43);
      ctx.restore();
    }
    zones.forEach((zone,i)=>{
      const left=i===0?1:transitions[i-1];
      const right=i===zones.length-1?1:1-transitions[i];
      band(zone,.53*left*right);
    });
  }
  function sky(){
    const g=ctx.createLinearGradient(0,0,0,H);const dusk=smooth(2800,16500,cameraX);
    g.addColorStop(0,blendHex('#6c9acc','#8979b4',dusk));
    g.addColorStop(.35,blendHex('#b6a6c3','#dc8d9e',dusk));
    g.addColorStop(.70,blendHex('#f4c38c','#f9b86f',dusk));
    g.addColorStop(1,'#ffe3a7');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    if(debugSettings.backdrop)paintDistantHasselby();
    ctx.save();ctx.translate(-cameraX*.08,-cameraY*.07);
    ctx.fillStyle='#ffe3c894';
    for(let i=0;i<13;i++)cloud(130+i*330,85+(i%4)*43, .7+(i%3)*.22);
    ctx.restore();
    ctx.save();ctx.translate(-cameraX*.23,-cameraY*.22);
    ctx.globalAlpha=.30;ctx.fillStyle=blendHex('#9ebcb9','#c19a9b',dusk);ctx.beginPath();ctx.moveTo(-350,560);
    for(let x=-350;x<FINISH+1300;x+=170)ctx.lineTo(x,300+Math.sin(x*.006)*53+Math.cos(x*.014)*22);
    ctx.lineTo(FINISH+1600,900);ctx.lineTo(-350,900);ctx.fill();ctx.restore();
    ctx.save();ctx.translate(-cameraX*.43,-cameraY*.35);ctx.globalAlpha=.21;ctx.fillStyle=blendHex('#79aa97','#7d9b8b',dusk);ctx.beginPath();ctx.moveTo(-350,640);
    for(let x=-350;x<FINISH+1300;x+=120)ctx.lineTo(x,375+Math.sin(x*.011)*32+Math.sin(x*.005)*19);
    ctx.lineTo(FINISH+1600,940);ctx.lineTo(-350,940);ctx.fill();ctx.restore();
    // Mälaren is already painted into the smoothly blended lakeside panorama.
    // The old separately drawn 12,000px turquoise rectangle hovered above the
    // road and caused a visible artificial strip, so it is intentionally gone.
    // Sunset disc and broad gold halo borrow the feeling of the original
    // Hässelby concept artwork, without pasting a duplicate bear into the map.
    const sunX=W*0.85-dusk*85, sunY=135+dusk*42;
    const halo=ctx.createRadialGradient(sunX,sunY,8,sunX,sunY,240);
    halo.addColorStop(0,'#ffe8a0b3');halo.addColorStop(.55,'#fbd18c44');halo.addColorStop(1,'#fbd18c00');
    ctx.fillStyle=halo;ctx.fillRect(sunX-250,sunY-250,500,500);
    ctx.fillStyle='#fff1b6';ctx.beginPath();ctx.arc(sunX,sunY,24,0,7);ctx.fill();
    if(debugSettings.backdrop)drawTown();
    if(debugSettings.metro){v108DrawCourtyardTrees();v110DrawMidDistance();}
    // All close buildings and plantings are authored as connected illustrated
    // neighborhood sections rather than procedural floating-house fillers.
    // Put full illustrated landmarks in front of the old low-detail parallax silhouettes.
    if(debugSettings.metro)illustratedScenery();
  }

  // Production scenery assets cut from the Hässelby sunset concept artwork.
  // Draw these BEFORE the road and playable characters, never on the collision layer.
  // V116 station: original concept entrance with cleaned matte and terrain contact.
  // Background collections, houses, game mechanics and level geometry stay at V110.
  const V116_METRO={x:stretchX(7550),w:455,h:300};
  function v116MetroAnchor(){
    const x=V116_METRO.x,ground=groundAt(x);
    if(!Number.isFinite(ground))return null;
    const rearSidewalk=ground-102;
    // Sink the station slightly deeper into the terrain so the side bases stop
    // reading as a floating cutout against the level ground.
    const bottom=rearSidewalk+26;
    return {x,ground,rearSidewalk,bottom,style:'concept-station-ground-contact'};
  }
  // V117. The approved backdrop is deliberately not touched. This metro
  // district gets ONE authored forecourt: three staggered back/far railings,
  // one lamp, a bike rack, pavement connection, and connected planters.
  // All assets are transparent, illustrated project originals, not new houses.
  const V117_FORECOURT={railingSections:4,lamps:1,bikeRacks:1,planters:5};
  const v117DrawArt=(key,x,y,w,alpha=1,filter='none')=>{
    const im=images[key];if(!im?.naturalWidth)return false;
    const h=w*im.naturalHeight/im.naturalWidth;
    ctx.save();ctx.globalAlpha=alpha;ctx.filter=filter;
    ctx.drawImage(im,x-w*.5,y-h,w,h);ctx.restore();return true;
  };
  function v117RearFoot(x){return (groundAt(x)??0)-102;}
  function v117DrawWalkway(x){
    // Station is cut from concept artwork: its bottom is translucent in the
    // stair opening. Lay down a narrow, terrain-following landing *behind*
    // that image, not a horizontal slab obscuring it.
    const left=x-325,right=x+327;
    ctx.save();
    const pad=ctx.createLinearGradient(0,v117RearFoot(x)-17,0,v117RearFoot(x)+16);
    pad.addColorStop(0,'#d8c5a7');pad.addColorStop(.68,'#b9ae9d');pad.addColorStop(1,'#a3a297');
    ctx.fillStyle=pad;ctx.beginPath();
    for(let i=0;i<=48;i++){
      const px=left+(right-left)*i/48,py=v117RearFoot(px)-13;
      if(!i)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    for(let i=48;i>=0;i--){
      const px=left+(right-left)*i/48;ctx.lineTo(px,v117RearFoot(px)+7);
    }
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(251,231,196,.57)';ctx.lineWidth=1.5;ctx.beginPath();
    for(let i=0;i<=48;i++){
      const px=left+(right-left)*i/48,py=v117RearFoot(px)+1;
      if(!i)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }ctx.stroke();ctx.restore();
  }
  function v117DrawBehindStation(x){
    if(x+800<cameraX||x-840>cameraX+W)return;
    // V10.30: the station image ALREADY contains the metal railings and planted
    // sides. The extra v59 fences and v99 front beds were stacked over the same
    // curb and looked like floating copies. Preserve only its continuous,
    // terrain-following paved landing, behind the station artwork.
    v117DrawWalkway(x);
  }
  function v117DrawInFrontStation(x){
    // V10.37: lightly cover the station sidewalls so the lower edges blend
    // back into the level without introducing heavy new scenery. Keep the
    // center entrance readable; only add low shrubs at the far left and right.
    if(x+520<cameraX||x-520>cameraX+W)return;
    const clusters=[
      {x:x-190,span:118,h:30,variant:2,flip:false,shade:'rgba(78,98,75,.28)'},
      {x:x-152,span:86,h:24,variant:6,flip:true,shade:'rgba(94,112,78,.22)'},
      {x:x+154,span:88,h:24,variant:3,flip:false,shade:'rgba(94,112,78,.22)'},
      {x:x+192,span:122,h:31,variant:7,flip:true,shade:'rgba(78,98,75,.28)'}
    ];
    ctx.save();
    for(const c of clusters){
      const foot=groundAt(c.x)-99;
      if(!Number.isFinite(foot))continue;
      // Soft planted base that tracks the same rear pavement grade.
      ctx.save();ctx.fillStyle=c.shade;ctx.beginPath();
      ctx.moveTo(c.x-c.span*.55,foot+4);
      ctx.quadraticCurveTo(c.x-c.span*.18,foot-c.h*.80,c.x,foot-c.h*.55);
      ctx.quadraticCurveTo(c.x+c.span*.18,foot-c.h*.84,c.x+c.span*.55,foot+4);
      ctx.lineTo(c.x+c.span*.42,foot+9);ctx.lineTo(c.x-c.span*.42,foot+9);
      ctx.closePath();ctx.fill();ctx.restore();
      const im=images['v105_metro_rear_'+c.variant];
      if(im?.naturalWidth){
        const artH=38+c.h,artW=artH*im.naturalWidth/im.naturalHeight;
        ctx.save();ctx.translate(c.x,foot+2);ctx.transform(1,v107GroundGrade(c.x,artW),0,1,0,0);
        if(c.flip)ctx.scale(-1,1);
        ctx.globalAlpha=.96;ctx.filter='saturate(.98) contrast(1.02)';
        ctx.drawImage(im,-artW/2,-artH,artW,artH);ctx.restore();
      }
    }
    ctx.restore();
  }
  window.BEARLY_V130_OVERLAP_AUDIT=()=>({
    metroX:V116_METRO.x,
    formerlyDuplicatedTreeX:10760,
    oldFencesDrawn:false,
    oldTreeDrawn:false,
    existingStationRailingInArtwork:true,
    backdropModified:false
  });
  function illustratedScenery(){
    const im=images.v118_metro_complete,a=v116MetroAnchor();
    ctx.save();ctx.translate(-cameraX,-cameraY);
    if(a) v117DrawBehindStation(a.x);
    if(a && im?.naturalWidth && a.x+V116_METRO.w*.65>=cameraX-160 && a.x-V116_METRO.w*.65<=cameraX+W+160){
      const {x,rearSidewalk,bottom}=a,{w,h}=V116_METRO;
      const left=x-w*.34,right=x+w*.34;
      const l=groundAt(left)-102,r=groundAt(right)-102;
             // V10.33: repaired facade contains its own paved landing.
       // Keep the existing terrain-following walkway below, not a second dark apron.
// One complete, clean station image. The roof, T sign, stairwell and
      // embedded flowerboxes are part of this source, with no layered doubles.
      ctx.drawImage(im,x-w*.5,bottom-h,w,h);
      // Blend the isolated lower side walls back into the painted level ground.
      ctx.save();
      const leftBase=x-w*.33,rightBase=x+w*.33;
      const leftOuter=x-w*.50,rightOuter=x+w*.50;
      ctx.fillStyle='rgba(122,145,106,.22)';
      ctx.beginPath();
      ctx.moveTo(leftBase,groundAt(leftBase)-98);
      ctx.quadraticCurveTo(x-w*.40,groundAt(x-w*.40)-93,leftOuter,groundAt(leftOuter)-79);
      ctx.lineTo(x-w*.35,groundAt(x-w*.35)-77);
      ctx.quadraticCurveTo(leftBase-10,groundAt(leftBase)-88,leftBase,groundAt(leftBase)-98);
      ctx.closePath();ctx.fill();
      ctx.beginPath();
      ctx.moveTo(rightBase,groundAt(rightBase)-98);
      ctx.quadraticCurveTo(x+w*.40,groundAt(x+w*.40)-93,rightOuter,groundAt(rightOuter)-79);
      ctx.lineTo(x+w*.35,groundAt(x+w*.35)-77);
      ctx.quadraticCurveTo(rightBase+10,groundAt(rightBase)-88,rightBase,groundAt(rightBase)-98);
      ctx.closePath();ctx.fill();
      ctx.restore();
      // Hairline contact following the rear sidewalk, partly in front of the
      // sprite's natural bottom edge, prevents an apparent floating stairwell.
      ctx.save();ctx.strokeStyle='rgba(230,213,183,.72)';ctx.lineWidth=2.2;
      ctx.beginPath();for(let i=0;i<=24;i++){
        const px=x-w*.34+(w*.68)*(i/24),py=groundAt(px)-99;
        if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }ctx.stroke();
      ctx.strokeStyle='rgba(78,94,83,.26)';ctx.lineWidth=3.2;ctx.beginPath();
      for(let i=0;i<=24;i++){
        const px=x-w*.37+(w*.74)*(i/24),py=groundAt(px)-95;
        if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }ctx.stroke();ctx.restore();
    }
    // Draw connected forecourt objects IN FRONT of the station, but BELOW the
    // actual roadway; don't build houses, change the skyline, or touch physics.
    if(a) v117DrawInFrontStation(a.x);
    // Everything else remains sourced from the earlier, approved level.
    ctx.save();ctx.globalAlpha=1;ctx.filter='none';drawPublicPlaces();ctx.restore();
    ctx.restore();
  }
  // v9.7: One CONTINUOUS illustrated Hässelby Gård frontage, not isolated
  // floating storefront props. Every facade is anchored to the sloping
  // rear pavement, and the 3 shops are embedded in shared building blocks.
  // The scene is a fictionalized route illustration, not a literal map.
  const v96PublicSites=[
    {x:stretchX(6150),key:'istanbul',name:'NYA ISTANBUL',zone:'metro',people:[[-104,0,0],[111,3,1]]},
    {x:stretchX(6530),key:'cafe',name:'CAFÉ NICE',zone:'metro',people:[[-101,5,2],[104,1,3]]},
    {x:stretchX(8110),key:'corner',name:'THE CORNER',zone:'metro',people:[[-118,4,4],[112,2,5]]}
  ];
  // V9.9 C: two compact shop clusters; keep the illustrated panoramic backdrop
  // unobstructed through the quiet homes-to-metro approach and station plaza.
  const gardFacadePlan=[
    [5900,244,171,'stone',null,1],
    [6150,242,184,'warm','istanbul',3],
    [6360,205,171,'olive',null,4],
    [6530,205,180,'sage','cafe',5],
    [7910,208,165,'sage',null,9],
    [8110,220,185,'stone','corner',10]
  ].map(([x,w,h,tone,shop,variant])=>({x:stretchX(x),w,h,tone,shop,variant}));
  const gardTones={
    warm:['#c1ac9a','#d4bda5','#8b827c'],
    stone:['#a8a9a5','#bfc0b3','#777f7b'],
    sage:['#a8b6aa','#c5c8b2','#718b86'],
    olive:['#b3b3a0','#d0c7ac','#838879'],
    peach:['#c3aba0','#d9c1a9','#967f79']
  };
  function gardSeed(i,s){return (Math.sin((i+1)*14.237+s*32.331)*43758.54)%1;}
  // Connected rear sidewalk follows the actual hillside with no artificial
  // parallel roadway and no collision, in front of the facades but behind bike.
  function drawGardPavement(a,b){
    const lo=Math.max(a,cameraX-160),hi=Math.min(b,cameraX+W+160);
    if(hi<=lo)return;
    const points=[];
    for(let x=lo;x<=hi+18;x+=18){const y=groundAt(x);if(y!=null)points.push([x,y]);}
    if(points.length<2)return;
    const grad=ctx.createLinearGradient(0,points[0][1]-160,0,points[0][1]-72);
    grad.addColorStop(0,'#9eaaa1');grad.addColorStop(.45,'#c5beb0');grad.addColorStop(1,'#c6b5a1');
    ctx.save();ctx.globalAlpha=.59;ctx.fillStyle=grad;ctx.beginPath();
    for(let i=0;i<points.length;i++){const [x,y]=points[i];i?ctx.lineTo(x,y-145):ctx.moveTo(x,y-145);}
    for(let i=points.length-1;i>=0;i--){const [x,y]=points[i];ctx.lineTo(x,y-100);}
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(247,232,210,.64)';ctx.lineWidth=2.4;ctx.beginPath();
    points.forEach(([x,y],i)=>i?ctx.lineTo(x,y-102):ctx.moveTo(x,y-102));ctx.stroke();
    // Cobble joints are continuous across facades; scale remains constant.
    ctx.strokeStyle='rgba(92,96,89,.12)';ctx.lineWidth=.8;
    for(let x=Math.ceil(lo/94)*94;x<hi;x+=94){const y=groundAt(x);if(y==null)continue;
      ctx.beginPath();ctx.moveTo(x-8,y-138);ctx.lineTo(x+5,y-103);ctx.stroke();}
    ctx.restore();
  }
  function gardWindow(cx,cy,w,h,seed,lit=false){
    ctx.save();
    ctx.fillStyle='rgba(72,85,85,.62)';ctx.fillRect(cx-w*.5-3,cy-h*.5-3,w+6,h+6);
    const glass=ctx.createLinearGradient(cx-w*.5,cy-h*.5,cx+w*.5,cy+h*.5);
    glass.addColorStop(0,lit?'#dfc5a0':'#8ca9a8');glass.addColorStop(.65,lit?'#c8b18c':'#a5b8ad');glass.addColorStop(1,'#637e82');
    ctx.fillStyle=glass;ctx.fillRect(cx-w*.5,cy-h*.5,w,h);
    ctx.fillStyle='rgba(240,240,214,.28)';ctx.beginPath();ctx.moveTo(cx-w*.5+2,cy-h*.5+2);
    ctx.lineTo(cx+w*.17,cy-h*.5+2);ctx.lineTo(cx-w*.04,cy+h*.5-2);ctx.lineTo(cx-w*.5+2,cy+h*.5-2);ctx.fill();
    ctx.strokeStyle='rgba(226,214,191,.56)';ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(cx,cy-h*.5);ctx.lineTo(cx,cy+h*.5);ctx.stroke();
    ctx.fillStyle='#b0aba0';ctx.fillRect(cx-w*.5-7,cy+h*.5,w+14,4);
    if(seed%3===0){ctx.strokeStyle='rgba(70,77,69,.55)';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(cx-w*.58,cy+h*.5+4);ctx.lineTo(cx-w*.58,cy+h*.5+18);
      ctx.lineTo(cx+w*.58,cy+h*.5+18);ctx.lineTo(cx+w*.58,cy+h*.5+4);ctx.stroke();}
    ctx.restore();
  }
  function drawGardFacade(f){
    const x=f.x,w=f.w,h=f.h;
    if(x+w*.52<cameraX-170||x-w*.52>cameraX+W+170)return;
    const gy=groundAt(x);if(gy==null)return;
    const palette=gardTones[f.tone],y=gy-116;
    ctx.save();ctx.translate(x,y);
    // Gentle spatial fade at the two ends of this authored streetscape, avoiding
    // the abrupt transition from connected building block to the empty pano.
    const enter=smooth(stretchX(5420),stretchX(5740),x);
    const exit=1-smooth(stretchX(8240),stretchX(8510),x);
    ctx.globalAlpha=clamp(enter*exit,.12,1);
    // Grounding, not a separate rectangular sticker shadow.
    const shadow=ctx.createRadialGradient(0,1,3,0,1,w*.64);
    shadow.addColorStop(0,'rgba(63,74,72,.28)');shadow.addColorStop(.64,'rgba(63,74,72,.095)');shadow.addColorStop(1,'rgba(63,74,72,0)');
    ctx.fillStyle=shadow;ctx.beginPath();ctx.ellipse(0,1,w*.62,12,0,0,7);ctx.fill();
    // Shared plaster and masonry colors, coordinated with the neighborhood pano.
    const wall=ctx.createLinearGradient(-w*.5,-h,w*.5,0);
    wall.addColorStop(0,palette[1]);wall.addColorStop(.65,palette[0]);wall.addColorStop(1,palette[2]);
    ctx.fillStyle=wall;ctx.fillRect(-w*.5,-h,w,h);
    const upper=ctx.createLinearGradient(0,-h,0,-h*.47);
    upper.addColorStop(0,'rgba(244,230,206,.19)');upper.addColorStop(1,'rgba(104,113,103,0)');
    ctx.fillStyle=upper;ctx.fillRect(-w*.5,-h,w,h*.55);
    // Subtle weathering grain; no new unnaturally clean colors.
    for(let j=0;j<58;j++){
      const u=((j*71+f.variant*29)%101)/101,v=((j*47+f.variant*13)%97)/97;
      ctx.fillStyle=j%3===0?'rgba(247,230,204,.12)':'rgba(66,80,76,.065)';
      ctx.fillRect(-w*.5+8+u*(w-16),-h+8+v*(h-15),2+(j%4),1.1+(j%2));
    }
    // Thin cornice and neighboring party-wall seams join the buildings.
    ctx.fillStyle=palette[2];ctx.fillRect(-w*.5-2,-h,w+4,7);
    ctx.fillStyle='rgba(245,225,198,.43)';ctx.fillRect(-w*.5,-h+7,w,3);
    ctx.fillStyle='rgba(76,87,85,.21)';ctx.fillRect(w*.5-3,-h+8,4,h-8);
    const floors=f.shop?1:2;
    for(let floor=0;floor<floors;floor++){
      const yy=-h+47+floor*70, count=f.shop?3:Math.max(2,Math.floor(w/86));
      const spacing=(w-48)/count;
      for(let n=0;n<count;n++){
        const wx=-w*.5+24+spacing*(n+.5),width=Math.min(43,spacing*.63);
        gardWindow(wx,yy,width,39,f.variant+n+floor*2,(f.variant+n+floor)%4===0);
      }
    }
    if(f.shop){
      // Lower-storey original illustrated storefront is preserved; the colored
      // masonry above and beside it is what makes it part of a real building.
      const im=images['v96_shop_'+f.shop];
      if(im?.naturalWidth){
        ctx.save();ctx.globalAlpha=.88;ctx.filter='saturate(.70) contrast(.91) brightness(1.01)';
        const sw=w*.94,sh=sw*(im.naturalHeight/im.naturalWidth);
        ctx.drawImage(im,-sw*.5,-sh+14,sw,sh);ctx.restore();
      }
    }else{
      const shop=ctx.createLinearGradient(0,-83,0,0);
      shop.addColorStop(0,'rgba(64,83,83,.48)');shop.addColorStop(1,'rgba(75,90,85,.64)');
      ctx.fillStyle=shop;ctx.fillRect(-w*.5+12,-73,w-24,72);
      const divisions=3;
      for(let k=0;k<divisions;k++){
        const bx=-w*.5+22+k*(w-43)/divisions, bw=(w-43)/divisions-8;
        ctx.fillStyle=k===1?'rgba(178,194,184,.71)':'rgba(145,165,165,.72)';
        ctx.fillRect(bx,-60,bw,53);
        ctx.fillStyle='rgba(237,230,207,.19)';ctx.beginPath();ctx.moveTo(bx+3,-56);
        ctx.lineTo(bx+bw*.52,-56);ctx.lineTo(bx+bw*.28,-9);ctx.lineTo(bx+3,-9);ctx.fill();
      }
      // A shared modest street-level awning; only occasional shops are signed.
      ctx.fillStyle='rgba(80,94,91,.67)';ctx.fillRect(-w*.5+8,-77,w-16,8);
      if(f.variant%3===0){ctx.fillStyle='rgba(222,206,171,.75)';ctx.fillRect(-w*.5+25,-87,w*.46,5);}
    }
    // Sidewalk contact and facade step hide thin white silhouette gaps.
    // Low plaster foundation follows the actual hillside under either edge.
    // This is the local rear pavement, not an unsupported floating rectangle.
    const leftGround=groundAt(x-w*.49)??gy,rightGround=groundAt(x+w*.49)??gy;
    ctx.fillStyle=palette[2];ctx.globalAlpha*=.72;
    ctx.beginPath();ctx.moveTo(-w*.5,-4);ctx.lineTo(w*.5,-4);
    ctx.lineTo(w*.5,Math.max(5,rightGround-gy+18));
    ctx.lineTo(-w*.5,Math.max(5,leftGround-gy+18));ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(73,80,74,.11)';ctx.fillRect(-w*.5,-1,w,3);
    ctx.restore();
  }
  function drawGardStreetLife(){
    // Understated planted borders at shop junctions. Every root is fixed to
    // world terrain, and greenery shares the illustrated area's grey-olive hues.
    const plantings=[[5880,23,1],[6320,24,2],[6670,26,3],[7870,26,4],[8230,23,5]];
    for(const [pos,size,seed] of plantings){
      const x=stretchX(pos);if(x<cameraX-size*3||x>cameraX+W+size*3)continue;
      const gy=groundAt(x);if(gy==null)continue;
      const ground=gy-130;
      ctx.save();
      const soil=ctx.createRadialGradient(x,ground-1,2,x,ground,size*1.65);
      soil.addColorStop(0,'rgba(76,95,78,.25)');soil.addColorStop(1,'rgba(76,95,78,0)');
      ctx.fillStyle=soil;ctx.beginPath();ctx.ellipse(x,ground,size*1.7,9,0,0,7);ctx.fill();
      const tones=['#718d7d','#90a38c','#83988a','#a0ae91'];
      for(let k=0;k<8;k++){
        const j=(k*5+seed*3)%11;
        const xx=x+(k-3.5)*size*.21, yy=ground-8-(j%4)*3.4;
        const rr=size*(.36+(k%3)*.075);
        const gg=ctx.createRadialGradient(xx-rr*.16,yy-rr*.14,1,xx,yy,rr*1.35);
        gg.addColorStop(0,tones[(k+seed)%4]);gg.addColorStop(1,'rgba(79,104,87,.12)');
        ctx.globalAlpha=.47;ctx.fillStyle=gg;ctx.beginPath();ctx.ellipse(xx,yy,rr,rr*.69,0,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=.50;ctx.strokeStyle='#a2a593';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(x-size*1.0,ground+2);
      ctx.lineTo(x+size*1.0,ground+2);ctx.stroke();ctx.restore();
    }
    // People stand in small social clusters, close to shops and a transit hub.
    const people=[
      [6085,0,1],[6190,2,2],[6478,1,3],[6587,5,4],
      [7902,1,7],[8116,4,8],[8221,2,9]
    ];
    for(const [pos,variant,seed] of people){
      const x=stretchX(pos);if(x<cameraX-65||x>cameraX+W+65)continue;
      const im=images['v96_civilian_'+variant];if(!im?.naturalWidth)continue;
      const gy=groundAt(x);if(gy==null)continue;
      const w=26+variant%3*2,h=w*im.naturalHeight/im.naturalWidth;
      const bob=Math.sin(time*(.78+(seed%3)*.1)+seed*1.5)*.75;
      ctx.save();ctx.globalAlpha=.73;ctx.filter='saturate(.73) contrast(.92) blur(.25px)';
      ctx.drawImage(im,x-w/2,gy-126-h+bob,w,h);ctx.restore();
    }
    // A handful of contextual accents, not free-floating benches every 100m.
    for(const [pos,key,w] of [[5835,'bike_rack',58],[6300,'trash_bin',35],
      [6668,'shrub_b',61],[7215,'utility',42],[7290,'shrub_a',68],
      [7840,'shrub_c',64],[8280,'bike_rack',58]]){
      const x=stretchX(pos),gy=groundAt(x);
      if(gy==null||x<cameraX-90||x>cameraX+W+90)continue;
      drawIllustratedProp(key,x,gy-116,w,'far');
    }
  }
  function drawGardConnectors(){
    // No isolated fence fragments. The background already has continuous
    // painted terrace rails; extra two-post segments looked cut off and big.
    // Two subdued curbside shrubs tie the station's planting into the road.
    for(const [pos,w] of [[5740,49],[8300,54]]){
      const x=stretchX(pos),gy=groundAt(x);
      if(gy==null||x<cameraX-130||x>cameraX+W+130)continue;
      drawIllustratedProp('shrub_a',x,gy-104,w,'far');
    }
  }
  function drawGardConnectedWorld(){
    const min=stretchX(5420),max=stretchX(8490);
    if(max<cameraX-300||min>cameraX+W+300)return;
    ctx.save();
    // No hard horizontal banner overlays: each layer shares the painted palette.
    ctx.globalAlpha=.83;
    // Leave open backdrop and green station approaches between compact blocks.
    drawGardPavement(stretchX(5790),stretchX(6720));
    drawGardPavement(stretchX(7805),stretchX(8270));
    for(const f of gardFacadePlan)drawGardFacade(f);
    ctx.restore();
    drawGardConnectors();
    drawGardStreetLife();
  }
  function drawPublicPlaces(){
    // This replaces ALL four isolated v9.7 storefronts with ONE connected
    // Hässelby Gård test streetscape. No free-standing shops elsewhere.
    drawGardConnectedWorld();
  }
  function cloud(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.beginPath();ctx.ellipse(0,0,45,16,0,0,7);ctx.ellipse(-22,-8,20,19,0,0,7);ctx.ellipse(10,-18,29,24,0,0,7);ctx.ellipse(34,-6,23,19,0,0,7);ctx.fill();ctx.restore();}
  function tree(x,y,s){
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    // Asymmetric, layered broadleaf canopy. Avoid rows of identical lollipop spheres.
    const seed=Math.floor((x*11+y*7)/19),warm=(seed%4===0);
    if(Math.abs(seed)%4===1){
      // A differently shaded spruce, not another identical round lollipop tree.
      ctx.strokeStyle='#655b4e';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(0,18);ctx.lineTo(0,-145);ctx.stroke();
      for(let k=0;k<4;k++){
        const yy=-192+k*34,r=25+k*11;
        const g=ctx.createLinearGradient(-r,yy,r,yy+70);
        g.addColorStop(0,'#87a786');g.addColorStop(1,'#28584e');ctx.fillStyle=g;
        ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(-r,yy+66);ctx.quadraticCurveTo(0,yy+55,r,yy+66);ctx.closePath();ctx.fill();
      }
      ctx.restore();return;
    }
    ctx.strokeStyle='#78604f';ctx.lineWidth=10;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(0,17);ctx.lineTo(0,-81);ctx.moveTo(0,-59);ctx.lineTo(-21,-91);ctx.moveTo(0,-68);ctx.lineTo(23,-101);ctx.stroke();
    const clusters=[[-29,-78,21],[5,-112,29],[36,-82,24],[-9,-127,24],[-40,-110,20],[27,-125,24],[-10,-89,25]];
    for(let i=0;i<clusters.length;i++){
      const [xx,yy,rr]=clusters[i],dx=xx+((seed+i*11)%7)-3,dy=yy+((seed+i*5)%7)-3;
      const grad=ctx.createRadialGradient(dx-rr*.38,dy-rr*.40,3,dx,dy,rr*1.04);
      grad.addColorStop(0,warm?'#d6ca7d':'#a5cb84');grad.addColorStop(.57,warm?'#869858':'#578a6b');grad.addColorStop(1,warm?'#556648':'#326756');
      ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(dx,dy,rr*1.14,rr*.9,(seed%7-3)*.10,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  function gradientRect(x,y,w,h,c1,c2){const g=ctx.createLinearGradient(x,y,x+w*.38,y+h);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.fillRect(x,y,w,h);}

  function shade(c,a){return c;}
  function fillStroke(fill,stroke,line=2){ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.fill();ctx.stroke();}
  function drawBlobShadowLocal(w=60,h=8,alpha=.18,dx=0,dy=0){ctx.fillStyle=`rgba(29,40,47,${alpha})`;ctx.beginPath();ctx.ellipse(dx,dy,w,h,0,0,Math.PI*2);ctx.fill();}
  // v7.2: all main enemy features share one continuous illustrated silhouette.
  // No pasted sprite alpha fringe, disconnected heads, or stick-like arms.
  function drawProceduralTroublemaker(itemKind,phase,width,elapsed,i,crew,frame=0){
    const t=Math.max(0,elapsed||0), crewKind=crew?.kind||'hoodie';
    const palette=({
      hoodie:{cloth:'#4d5d6a',shade:'#2c3945',light:'#7e92a3',trim:'#d7a77f',pant:'#28323a',pantHi:'#4a5a67'},
      video:{cloth:'#53525a',shade:'#2f3036',light:'#7c7d86',trim:'#d39a74',pant:'#2a2d33',pantHi:'#525964'},
      toll:{cloth:'#655146',shade:'#41322d',light:'#917768',trim:'#efc86d',pant:'#2d2a28',pantHi:'#5c5652'},
      scooter:{cloth:'#476071',shade:'#2b3947',light:'#7591a5',trim:'#88d6d1',pant:'#28343d',pantHi:'#50616c'}
    })[crewKind]||{cloth:'#4d5d6a',shade:'#2c3945',light:'#7e92a3',trim:'#d7a77f',pant:'#28323a',pantHi:'#4a5a67'};
    const skin=[['#efc9a8','#c7926f','#8b5f4a'],['#c38562','#955f46','#684032'],['#dcae92','#a87459','#764c3b']][Math.abs((Math.floor((crew?.x||0)/48)+i))%3];
    const f=frame|0;
    const poseTable=[
      {lean:0, lift:0, kneeA:.01, kneeB:-.01, footA:.02, footB:-.015, armA:[-.23,-.50], handA:[-.20,-.34], armB:[.23,-.55], handB:[.24,-.36], head:0, open:0},
      {lean:-.03, lift:0, kneeA:-.03, kneeB:.03, footA:-.04, footB:.03, armA:[-.25,-.54], handA:[-.22,-.39], armB:[.22,-.50], handB:[.20,-.32], head:-.02, open:0},
      {lean:-.06, lift:0, kneeA:-.02, kneeB:.02, footA:-.02, footB:.02, armA:[-.30,-.70], handA:[-.37,-.86], armB:[.24,-.50], handB:[.24,-.34], head:-.03, open:1},
      {lean:-.09, lift:.008, kneeA:.01, kneeB:.01, footA:.01, footB:0, armA:[-.34,-.78], handA:[-.45,-.96], armB:[.25,-.49], handB:[.24,-.33], head:-.04, open:1},
      {lean:-.10, lift:.015, kneeA:.04, kneeB:0, footA:.05, footB:-.01, armA:[-.33,-.76], handA:[-.60,-.78], armB:[.27,-.53], handB:[.30,-.36], head:-.02, open:1},
      {lean:.04, lift:0, kneeA:.02, kneeB:-.03, footA:.01, footB:-.02, armA:[-.18,-.47], handA:[-.10,-.22], armB:[.30,-.78], handB:[.36,-.99], head:.02, open:1}
    ];
    const p=poseTable[Math.max(0,Math.min(poseTable.length-1,f))];
    const engaged=phase!=='idle';
    const notice=phase==='warn'||phase==='notice';
    const release=phase==='throw';
    const react=phase==='react';
    const flinch=phase==='flinch';
    const cheer=react&&t<.72;
    const idleBob=!engaged?Math.sin(time*4.2+i*.8)*.012:0;
    const bodyLift=p.lift + (notice?Math.sin(Math.min(1,t/.92)*Math.PI)*.018:0) + (cheer?Math.abs(Math.sin(t*8))*0.015:0) + idleBob;
    const torsoLean=p.lean + (flinch?.03:0) + (cheer?.04:0);
    const headTilt=p.head + (flinch?.05:0);
    const nearArmTarget=release?{elbow:[-.34,-.76],hand:[-.61,-.79]}:notice?{elbow:p.armA,hand:p.handA}:cheer?{elbow:[-.18,-.48],hand:[-.08,-.22]}:flinch?{elbow:[-.18,-.60],hand:[-.06,-.78]}:{elbow:p.armA,hand:p.handA};
    // During hold / wind-up / release the rear arm should tuck behind the torso,
    // otherwise it reads like the same throwing arm appearing in two places.
    const farArmTarget=cheer?{elbow:[.31,-.80],hand:[.37,-1.00]}:
      release?{elbow:[.15,-.59],hand:[.06,-.43]}:
      notice?{elbow:[.16,-.57],hand:[.08,-.46]}:
      flinch?{elbow:[.19,-.58],hand:[.11,-.68]}:
      {elbow:p.armB,hand:p.handB};

    ctx.save();
    ctx.scale(width,width);
    ctx.lineJoin='round';ctx.lineCap='round';
    const poly=(fill,pts,stroke=null,lw=.012)=>{ctx.beginPath();pts.forEach(([x,y],n)=>n?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}};
    const strokeLimb=(pts,w1,w2,col1,col2)=>{ctx.strokeStyle=col1;ctx.lineWidth=w1;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let j=1;j<pts.length;j++)ctx.lineTo(pts[j][0],pts[j][1]);ctx.stroke();ctx.strokeStyle=col2;ctx.lineWidth=w2;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let j=1;j<pts.length;j++)ctx.lineTo(pts[j][0],pts[j][1]);ctx.stroke();};

    // floor shadow / grounding
    ctx.fillStyle='rgba(28,38,44,.12)';ctx.beginPath();ctx.ellipse(0,.006,.265,.034,0,0,Math.PI*2);ctx.fill();
    ctx.translate(0,-bodyLift);
    ctx.rotate(torsoLean);

    // legs: fuller silhouette with knees and calves
    const legs=[
      {side:-1,knee:p.kneeA,foot:p.footA},{side:1,knee:p.kneeB,foot:p.footB}
    ];
    for(const leg of legs){
      const s=leg.side, hip=s*.102, kneeX=s*.125+leg.knee*.52, footX=s*.155+leg.foot;
      poly(palette.pant,[[hip-.086,-.322],[hip+.074,-.317],[kneeX+.062,-.150],[footX+.055,-.040],[footX-.060,-.040],[kneeX-.064,-.145]],palette.shade,.012);
      ctx.strokeStyle=palette.pantHi;ctx.lineWidth=.013;ctx.beginPath();ctx.moveTo(kneeX+.02*s,-.18);ctx.lineTo(footX+.01*s,-.065);ctx.stroke();
      ctx.fillStyle='#efe6d5';ctx.beginPath();ctx.roundRect(footX-.090,-.048,.15,.055,.02);ctx.fill();
      ctx.fillStyle='#5a6973';ctx.beginPath();ctx.roundRect(footX-.088,-.046,.148,.038,.016);ctx.fill();
      ctx.fillStyle='#c0c7ca';ctx.fillRect(footX-.03,-.048,.032,.012);
    }

    // torso / jacket body, chunkier and more sprite-like
    poly(palette.shade,[[-.17,-.73],[-.23,-.66],[-.25,-.52],[-.23,-.34],[-.11,-.27],[.13,-.27],[.24,-.35],[.25,-.54],[.22,-.67],[.15,-.74],[.02,-.78],[-.10,-.77]],'#202933',.018);
    poly(palette.cloth,[[-.19,-.70],[-.05,-.73],[.15,-.69],[.18,-.36],[.10,-.28],[-.12,-.29],[-.20,-.38]],palette.shade,.014);
    ctx.fillStyle=palette.light;ctx.beginPath();ctx.moveTo(-.055,-.70);ctx.lineTo(.005,-.58);ctx.lineTo(.07,-.70);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(15,22,28,.16)';ctx.beginPath();ctx.roundRect(-.13,-.43,.265,.11,.036);ctx.fill();
    ctx.strokeStyle='rgba(248,227,188,.18)';ctx.lineWidth=.012;ctx.beginPath();ctx.moveTo(-.13,-.38);ctx.lineTo(.11,-.38);ctx.stroke();
    ctx.strokeStyle=palette.shade;ctx.lineWidth=.013;ctx.beginPath();ctx.moveTo(.0,-.57);ctx.lineTo(.0,-.31);ctx.stroke();
    // pocket / accessory detail by crew
    if(crewKind==='video'){
      ctx.strokeStyle='#7d6a59';ctx.lineWidth=.019;ctx.beginPath();ctx.moveTo(.11,-.67);ctx.lineTo(-.08,-.29);ctx.stroke();
      poly('#2a3039',[[.02,-.46],[.14,-.46],[.14,-.33],[.00,-.33]],'#58626e',.012);
    }else if(crewKind==='toll'){
      ctx.fillStyle='#e0bf64';ctx.fillRect(-.08,-.61,.16,.035);ctx.fillStyle='rgba(255,245,196,.15)';ctx.fillRect(-.07,-.60,.14,.012);
    }else if(crewKind==='scooter'){
      ctx.fillStyle='rgba(122,220,213,.12)';ctx.fillRect(-.10,-.60,.20,.05);
    }else{
      ctx.fillStyle='rgba(255,255,255,.07)';ctx.beginPath();ctx.arc(.09,-.46,.03,0,Math.PI*2);ctx.fill();
    }

    // neck
    ctx.fillStyle=skin[1];ctx.beginPath();ctx.roundRect(-.055,-.82,.11,.15,.032);ctx.fill();

    // arms
    const drawArm=(side,target,back=false)=>{
      const shoulder=[side*.165,-.66];
      const elbow=target.elbow, hand=target.hand;
      const baseShade=back?palette.shade:'#25323c';
      const baseCloth=back?palette.cloth:palette.cloth;
      const prevAlpha=ctx.globalAlpha;
      if(back)ctx.globalAlpha*=0.58;
      strokeLimb([shoulder,elbow,hand],back?.108:.120,back?.080:.094,baseShade,baseCloth);
      ctx.strokeStyle=back?'rgba(232,214,180,.08)':'rgba(246,224,186,.16)';ctx.lineWidth=.012;ctx.beginPath();ctx.moveTo(shoulder[0]-.012,shoulder[1]+.01);ctx.lineTo(elbow[0]-.01,elbow[1]+.01);ctx.stroke();
      ctx.fillStyle=back?skin[1]:skin[0];ctx.beginPath();ctx.ellipse(hand[0],hand[1],back?.038:.045,back?.035:.041,0,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=prevAlpha;
      return hand;
    };
    const farHand=drawArm(1,farArmTarget,true);
    const nearHand=drawArm(-1,nearArmTarget,false);

    // held object on near hand
    if(itemKind){
      ctx.save();ctx.translate(nearHand[0],nearHand[1]);
      if(itemKind==='bottle'){
        ctx.rotate(-.36);ctx.fillStyle='#83b0ae';ctx.beginPath();ctx.roundRect(-.024,-.112,.052,.113,.016);ctx.fill();
        ctx.fillStyle='#e6d8a4';ctx.fillRect(-.012,-.135,.026,.028);ctx.strokeStyle='rgba(237,252,247,.85)';ctx.lineWidth=.010;ctx.beginPath();ctx.moveTo(-.010,-.090);ctx.lineTo(-.010,-.034);ctx.stroke();
      }else if(itemKind==='rock'){
        poly('#8d8b84',[[-.050,-.020],[-.032,-.070],[.027,-.080],[.059,-.018],[.024,.027],[-.038,.024]],'#565860',.014);
      }else{
        ctx.rotate(-.45);ctx.fillStyle='#b34f46';ctx.beginPath();ctx.roundRect(-.026,-.098,.052,.113,.014);ctx.fill();ctx.strokeStyle='#efc26e';ctx.lineWidth=.012;ctx.beginPath();ctx.moveTo(.009,-.100);ctx.lineTo(.03,-.136);ctx.stroke();
      }
      ctx.restore();
    }

    // head base
    ctx.save();
    ctx.translate(0,-.875);
    ctx.rotate(headTilt);
    ctx.fillStyle=skin[1];ctx.beginPath();ctx.ellipse(0,.01,.13,.16,-.03,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=skin[0];ctx.beginPath();ctx.ellipse(-.004,0,.122,.148,-.05,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(246,213,184,.27)';ctx.beginPath();ctx.ellipse(-.060,-.03,.037,.060,0,0,Math.PI*2);ctx.fill();

    // headwear / silhouette
    if(crewKind==='hoodie'){
      ctx.fillStyle=palette.shade;ctx.beginPath();ctx.moveTo(-.145,.01);ctx.bezierCurveTo(-.18,-.23,.17,-.23,.145,.02);ctx.lineTo(.09,-.04);ctx.quadraticCurveTo(0,-.18,-.11,-.05);ctx.closePath();ctx.fill();
    }else if(crewKind==='video'){
      ctx.fillStyle='#28303a';ctx.beginPath();ctx.ellipse(0,-.12,.14,.080,0,Math.PI,Math.PI*2);ctx.lineTo(.145,-.09);ctx.lineTo(-.14,-.09);ctx.closePath();ctx.fill();
      ctx.fillStyle=palette.trim;ctx.fillRect(-.03,-.175,.085,.02);
      ctx.strokeStyle='#2a333e';ctx.lineWidth=.024;ctx.beginPath();ctx.moveTo(-.09,.00);ctx.lineTo(.10,.00);ctx.stroke();
    }else if(crewKind==='toll'){
      ctx.fillStyle='#352d29';ctx.beginPath();ctx.ellipse(0,-.115,.138,.085,0,Math.PI,Math.PI*2);ctx.lineTo(.133,-.09);ctx.lineTo(-.127,-.09);ctx.fill();
      ctx.fillStyle=palette.trim;ctx.fillRect(-.09,-.157,.18,.026);
    }else{
      ctx.fillStyle='#1c2731';ctx.beginPath();ctx.ellipse(0,-.006,.145,.154,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#9bd0c7';ctx.beginPath();ctx.roundRect(-.090,-.062,.182,.080,.022);ctx.fill();
      ctx.fillStyle='#254955';ctx.beginPath();ctx.roundRect(-.071,-.046,.142,.039,.012);ctx.fill();
    }

    // face details
    if(crewKind!=='scooter'){
      const brow=notice?-.020:release?-.028:cheer?.010:0;
      ctx.strokeStyle='#46312c';ctx.lineWidth=.014;ctx.beginPath();
      ctx.moveTo(-.085,-.04+brow);ctx.lineTo(-.025,-.048+brow);ctx.moveTo(.017,-.048+brow);ctx.lineTo(.078,-.040+brow);ctx.stroke();
      ctx.fillStyle='#28272a';for(const xx of [-.052,.042]){ctx.beginPath();ctx.arc(xx,-.017,.012,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle='#9d6950';ctx.lineWidth=.012;ctx.beginPath();ctx.moveTo(.002,-.003);ctx.lineTo(.017,.021);ctx.stroke();
      ctx.strokeStyle='#6d3e38';ctx.lineWidth=.017;ctx.beginPath();
      if(notice||release||p.open){ctx.ellipse(.003,.050,.023,.030,0,0,Math.PI*2);}else if(cheer){ctx.moveTo(-.032,.047);ctx.quadraticCurveTo(0,.070,.034,.046);}else{ctx.moveTo(-.030,.043);ctx.quadraticCurveTo(0,.030,.031,.041);}ctx.stroke();
      ctx.fillStyle='rgba(201,95,90,.22)';ctx.beginPath();ctx.arc(-.075,.030,.018,0,Math.PI*2);ctx.arc(.073,.030,.018,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();

    // sprite-like highlight passes
    ctx.strokeStyle='rgba(255,234,196,.16)';ctx.lineWidth=.012;ctx.beginPath();ctx.moveTo(-.18,-.62);ctx.lineTo(-.16,-.48);ctx.moveTo(-.12,-.39);ctx.lineTo(.12,-.39);ctx.stroke();
    ctx.restore();
  }
  function drawProceduralRoadProp(key,x,contact,w){
    const supported=new Set(['bike_rack','bench_a','bench_b','planter','bollards','guardrail','courtyard_fence','utility','lamp','trash_bin','market_crates','tree','bus_shelter','playground','swings']);
    if(!supported.has(key))return false;
    const h={bike_rack:w*.68,bench_a:w*.60,bench_b:w*.60,planter:w*.82,bollards:w*.95,guardrail:w*.40,courtyard_fence:w*.55,utility:w*1.10,lamp:w*1.65,trash_bin:w*.95,market_crates:w*.72,tree:w*1.38,bus_shelter:w*.95,playground:w*.95,swings:w*.95}[key]||w*.8;
    const zone=districtAt(x).style;
    ctx.save();
    drawBlobShadowLocal(w*.35,6,.14,x-8,contact+4);
    // little verge details anchor the object into the scene
    for(let k=0;k<3;k++){
      const gx=x+(-.26+k*.24)*w, gy=contact+1;
      ctx.fillStyle=zone==='forest'?'rgba(88,122,77,.9)':'rgba(118,140,86,.86)';
      ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx-4,gy-8-(k%2)*3);ctx.lineTo(gx+1,gy-3);ctx.lineTo(gx+4,gy-10);ctx.lineTo(gx+3,gy);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(120,104,87,.7)';ctx.beginPath();ctx.arc(gx+6,gy-1,1.3+k*.4,0,Math.PI*2);ctx.fill();
    }
    ctx.translate(x,contact);
    if(key==='bike_rack'){
      ctx.strokeStyle='#69737a';ctx.lineWidth=3.5;
      for(let k=-1;k<=1;k++){ctx.beginPath();ctx.arc(k*w*.18,-h*.28,w*.11,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.moveTo(k*w*.18-w*.11,0);ctx.lineTo(k*w*.18-w*.11,-h*.28);ctx.moveTo(k*w*.18+w*.11,0);ctx.lineTo(k*w*.18+w*.11,-h*.28);ctx.stroke();}
    } else if(key==='bench_a' || key==='bench_b'){
      const wood1=key==='bench_b'?'#9a6744':'#8e5f40', wood2=key==='bench_b'?'#b87d58':'#a66f4d';
      ctx.strokeStyle='#556067';ctx.lineWidth=4; for(const lx of [-w*.24,w*.24]){ctx.beginPath();ctx.moveTo(lx,-h*.32);ctx.lineTo(lx,0);ctx.stroke();}
      for(let i=0;i<4;i++){const yy=-h*.46+i*h*.08;ctx.fillStyle=i%2?wood1:wood2;ctx.beginPath();ctx.roundRect(-w*.34,yy,w*.68,h*.05,h*.015);ctx.fill();}
      ctx.fillStyle=wood1;ctx.beginPath();ctx.roundRect(-w*.30,-h*.63,w*.60,h*.06,h*.02);ctx.fill();
    } else if(key==='planter'){
      ctx.fillStyle='#7f6760';ctx.beginPath();ctx.roundRect(-w*.22,-h*.30,w*.44,h*.30,h*.05);ctx.fill();
      ctx.fillStyle='#5f473f';ctx.fillRect(-w*.18,-h*.12,w*.36,h*.12);
      for(let k=-2;k<=2;k++){const px=k*w*.05;ctx.fillStyle='#5d8b57';ctx.beginPath();ctx.arc(px,-h*.42,w*.10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#7ead6d';ctx.beginPath();ctx.arc(px+w*.02,-h*.45,w*.06,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle='#557a4f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-h*.18);ctx.lineTo(0,-h*.47);ctx.stroke();
    } else if(key==='bollards'){
      for(let k=-1;k<=1;k++){const bx=k*w*.17;ctx.fillStyle='#6a7276';ctx.beginPath();ctx.roundRect(bx-w*.045,-h*.56,w*.09,h*.56,w*.03);ctx.fill();ctx.fillStyle='#e2c775';ctx.fillRect(bx-w*.045,-h*.42,w*.09,h*.09);}      
    } else if(key==='guardrail'){
      ctx.strokeStyle='#8a908f';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-w*.45,-h*.20);ctx.lineTo(w*.45,-h*.20);ctx.stroke();
      ctx.strokeStyle='#6a7070';ctx.lineWidth=3;for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(k*w*.18,-h*.20);ctx.lineTo(k*w*.18,0);ctx.stroke();}
    } else if(key==='courtyard_fence'){
      ctx.strokeStyle='#ab9a8f';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-w*.47,-h*.28);ctx.lineTo(w*.47,-h*.28);ctx.stroke();
      ctx.strokeStyle='#907d73';ctx.lineWidth=2.5;for(let k=-4;k<=4;k++){ctx.beginPath();ctx.moveTo(k*w*.10,-h*.28);ctx.lineTo(k*w*.10,0);ctx.stroke();}
    } else if(key==='utility'){
      const g=ctx.createLinearGradient(-w*.18,-h,w*.18,0);g.addColorStop(0,'#688995');g.addColorStop(1,'#415762');ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(-w*.18,-h,w*.36,h,w*.04);ctx.fill();
      ctx.fillStyle='#a5c0ca';ctx.fillRect(-w*.11,-h*.78,w*.22,h*.10);ctx.fillStyle='#35505c';ctx.fillRect(-w*.11,-h*.48,w*.22,h*.07);
    } else if(key==='lamp'){
      ctx.strokeStyle='#5e666c';ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-h*.85);ctx.quadraticCurveTo(0,-h,w*.11,-h);ctx.stroke();
      ctx.fillStyle='#f0d492';ctx.beginPath();ctx.roundRect(w*.09,-h*.995,w*.18,h*.095,w*.03);ctx.fill();ctx.strokeStyle='#7b7459';ctx.lineWidth=2;ctx.strokeRect(w*.09,-h*.995,w*.18,h*.095);
      const lampGlow=ctx.createRadialGradient(w*.18,-h*.91,2,w*.18,-h*.91,w*.8);
      lampGlow.addColorStop(0,'rgba(255,219,128,.23)');lampGlow.addColorStop(1,'rgba(255,219,128,0)');ctx.fillStyle=lampGlow;ctx.fillRect(-w*.6,-h*1.5,w*1.65,h*1.35);
    } else if(key==='trash_bin'){
      ctx.fillStyle='#54625d';ctx.beginPath();ctx.roundRect(-w*.16,-h*.56,w*.32,h*.56,w*.05);ctx.fill();ctx.fillStyle='#82948e';ctx.fillRect(-w*.10,-h*.48,w*.20,h*.04);ctx.fillStyle='#3d4a45';ctx.fillRect(-w*.08,-h*.18,w*.16,h*.14);
    } else if(key==='market_crates'){
      for(const [dx,dy,s] of [[-w*.16,-h*.22,1],[w*.08,-h*.14,.88],[-w*.02,-h*.40,.94]]){ctx.save();ctx.translate(dx,dy);ctx.rotate((dx+dy)*.002);ctx.fillStyle='#9a6c48';ctx.beginPath();ctx.roundRect(-w*.16*s,-h*.18*s,w*.32*s,h*.18*s,w*.03*s);ctx.fill();ctx.strokeStyle='#6d4b34';ctx.lineWidth=2;ctx.strokeRect(-w*.16*s,-h*.18*s,w*.32*s,h*.18*s);ctx.strokeStyle='#c89365';ctx.beginPath();ctx.moveTo(-w*.12*s,-h*.10*s);ctx.lineTo(w*.12*s,-h*.10*s);ctx.moveTo(-w*.12*s,-h*.04*s);ctx.lineTo(w*.12*s,-h*.04*s);ctx.stroke();ctx.restore();}
    } else if(key==='tree'){
      // Asymmetric painted canopy; avoids the four identical circles / lollipop silhouette.
      ctx.fillStyle='#735642';ctx.beginPath();ctx.moveTo(-w*.052,0);ctx.bezierCurveTo(-w*.06,-h*.34,-w*.09,-h*.49,-w*.115,-h*.64);ctx.lineTo(-w*.03,-h*.70);ctx.bezierCurveTo(w*.04,-h*.46,w*.052,-h*.29,w*.055,0);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#785b43';ctx.lineWidth=w*.023;ctx.beginPath();ctx.moveTo(0,-h*.45);ctx.lineTo(-w*.24,-h*.71);ctx.moveTo(w*.005,-h*.53);ctx.lineTo(w*.23,-h*.75);ctx.stroke();
      const shades=['#587955','#779868','#9aae76','#527c5d','#87a273','#66885f','#6e925f'];
      const parts=[[-.19,-.66,.17,.19],[-.25,-.86,.20,.17],[-.04,-.94,.23,.22],[.21,-.88,.19,.21],[.26,-.67,.17,.17],[.02,-.73,.21,.20],[-.08,-1.07,.15,.15]];
      for(let k=0;k<parts.length;k++){
        const [ox,oy,rx,ry]=parts[k],g=ctx.createRadialGradient(ox*w-rx*w*.35,oy*h-ry*w*.30,2,ox*w,oy*h,rx*w*1.1);
        g.addColorStop(0,shades[(k+2)%7]);g.addColorStop(1,shades[k]);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(ox*w,oy*h,rx*w,ry*w,k*.13,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle='rgba(232,223,144,.18)';for(let j=0;j<13;j++){const px=Math.sin(j*19.3)*w*.26,py=-h*.62-(j%5)*w*.08;ctx.beginPath();ctx.ellipse(px,py,w*.016,w*.009,j*.4,0,Math.PI*2);ctx.fill();}
    } else if(key==='bus_shelter'){
      ctx.strokeStyle='#57656c';ctx.lineWidth=4;ctx.strokeRect(-w*.28,-h*.68,w*.56,h*.68);ctx.strokeStyle='#92afb7';ctx.lineWidth=2;ctx.strokeRect(-w*.22,-h*.56,w*.20,h*.42);ctx.strokeRect(w*.02,-h*.56,w*.20,h*.42);ctx.fillStyle='rgba(170,206,217,.15)';ctx.fillRect(-w*.22,-h*.56,w*.20,h*.42);ctx.fillRect(w*.02,-h*.56,w*.20,h*.42);ctx.fillStyle='#647980';ctx.fillRect(-w*.32,-h*.70,w*.64,h*.08);
    } else if(key==='playground'){
      ctx.strokeStyle='#ad5f50';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-w*.22,0);ctx.lineTo(-w*.22,-h*.65);ctx.lineTo(0,-h*.82);ctx.lineTo(w*.22,-h*.65);ctx.lineTo(w*.22,0);ctx.stroke();ctx.strokeStyle='#7b8790';ctx.beginPath();ctx.moveTo(-w*.08,-h*.47);ctx.lineTo(-w*.08,-h*.16);ctx.moveTo(w*.08,-h*.47);ctx.lineTo(w*.08,-h*.16);ctx.stroke();ctx.fillStyle='#c48c4b';ctx.beginPath();ctx.roundRect(-w*.13,-h*.15,w*.26,h*.04,w*.01);ctx.fill();
    } else if(key==='swings'){
      ctx.strokeStyle='#67747b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-w*.22,0);ctx.lineTo(-w*.12,-h*.70);ctx.lineTo(w*.12,-h*.70);ctx.lineTo(w*.22,0);ctx.stroke();ctx.strokeStyle='#818e95';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-w*.05,-h*.68);ctx.lineTo(-w*.05,-h*.26);ctx.moveTo(w*.05,-h*.68);ctx.lineTo(w*.05,-h*.26);ctx.stroke();ctx.fillStyle='#a96d45';ctx.beginPath();ctx.roundRect(-w*.09,-h*.24,w*.18,h*.035,w*.01);ctx.fill();
    }
    // global painted rim light
    ctx.strokeStyle='rgba(250,234,205,.15)';ctx.lineWidth=1.15;ctx.beginPath();ctx.moveTo(-w*.20,-h*.76);ctx.quadraticCurveTo(0,-h*.94,w*.18,-h*.76);ctx.stroke();
    ctx.restore();
    return true;
  }
  // Illustrated NPCs extracted from the approved suburban art sheet, not stick figures.
  // They stay decorative until a separately defined hazard is reached.
  function drawGangFigureSprite(name,x,y,w,bounceSeed=0,flip=false){
    const im=images['v56_'+name]||images['v53_'+name];if(!im?.naturalWidth)return;
    const h=w*im.naturalHeight/im.naturalWidth;
    const bob=Math.sin(time*3.0+bounceSeed)*3;
    const lean=Math.sin(time*1.9+bounceSeed)*.035;
    ctx.save();ctx.translate(x,y+bob);ctx.scale(flip?-1:1,1);ctx.rotate(lean);
    ctx.globalAlpha=.19;ctx.fillStyle='#1f3142';ctx.beginPath();ctx.ellipse(0,0,w*.40,5,0,0,7);ctx.fill();ctx.globalAlpha=1;
    ctx.drawImage(im,-w/2,-h+6,w,h);
    ctx.restore();
  }
  // The old v7.4 wardrobe overlay painted crude rectangular bags and coats
  // directly over the artwork. Use the six actual color-corrected sprite outfits
  // with their transparent edges untouched instead.
  // Roadside crews are on rear-curb sidewalk strips, never on the
  // bike's collision line. The painted sidewalk is an environmental layer.
  function drawAnimatedTroublemaker(kind,phase,x,y,crew,i){
    const c=crewState.get(crew.x)||{phase:'idle',since:time};
    const member=c.members?.[i];
    const elapsed=Math.max(0,time-(member?.since??c.since));
    const visualKind=kind||'bottle',walk=patrolMotion(crew,i);
    const near=Math.abs(bike.x-crew.x)<960;
    const engaged=phase!=='idle';
    const wind=smooth(0,.42,elapsed),release=smooth(0,.56,elapsed);
    // A walk becomes a planted stance over 0.42 seconds, without foot teleporting.
    const origin=member?.patrolOrigin??walk.x;
    let shift=engaged?origin*(1-wind):walk.x;
    if(!engaged && c.idleReturnAt!==undefined){
      const returnWeight=smooth(0,.72,time-c.idleReturnAt);
      shift=walk.x*returnWeight;
    }
    const reactionAge=time-(c.resultAt??-999);
    const cheering=reactionAge>=0&&reactionAge<.76;
    const walking=!engaged&&walk.pace>.22&&(!c.idleReturnAt||time-c.idleReturnAt>.65);
    // six poses, synced to the actual warning / launch / recovery rather than a
    // generic looping cycle. The non-throwers react too, each with a slight delay.
    let frame=0;
    const warningDuration=clamp(.92-Math.max(0,bike.vx-300)*.00048,.38,.92)+(i%3)*.115;
    const warningProgress=clamp(elapsed/warningDuration,0,1);
    if(phase==='warn')frame=warningProgress<.30?1:warningProgress<.66?2:3;
    else if(phase==='throw')frame=elapsed<.20?4:5;
    else if(phase==='recover')frame=elapsed<.48?5:1;
    else if(phase==='notice')frame=elapsed<.24+i*.075?1:2;
    else if(phase==='flinch')frame=elapsed<.22+i*.07?3:2;
    else if(phase==='react')frame=cheering?(c.result==='hit'?5:3):1;
    else frame=walking?(walk.step>0?1:0):0;
    const profile=(c.profiles&&c.profiles[i])||{variant:i%6,scale:.76,xJitter:0,yJitter:0};
    const width=(visualKind==='rock'?62:60)*(profile.scale||.76), h=width*1.20;
    const heelLift=walking?Math.pow(Math.abs(walk.step),2)*1.8:0;
    const recoil=phase==='throw'?Math.sin(smooth(0,.40,elapsed)*Math.PI)*7:0;
    const crouch=phase==='warn'?Math.sin(smooth(0,.95,elapsed)*Math.PI)*3.4:0;
    const celebrate=cheering&&phase!=='warn'?(c.result==='hit'?5:2)*Math.abs(Math.sin(reactionAge*14+i)):0;
    const actorTilt=phase==='throw'?-0.075*Math.sin(smooth(0,.35,elapsed)*Math.PI):
      phase==='warn'?-0.025:walking?walk.dir*.025:0;
    // The NPC body bounces UP from the contact edge; never DOWN through the walk.
    // Local slope correction is important on the long downhill segments.
    // The sneaker edge belongs on the curb itself, not at handrail height.
    const actualX=crew.x+x+shift;
    const gradeOffset=(groundAt(actualX)??groundAt(crew.x))-(groundAt(crew.x)??0);
    ctx.save();ctx.translate(x+shift+(profile.xJitter||0)*0.15,y+gradeOffset+(profile.yJitter||0));
    ctx.fillStyle='rgba(29,40,47,.21)';ctx.beginPath();
    ctx.ellipse(-7,3,width*(walking?.37:.42),6.0,-.05,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(177,135,97,.15)';ctx.beginPath();ctx.ellipse(0,0,width*.24,3,0,0,Math.PI*2);ctx.fill();
    ctx.translate(0,-heelLift-recoil-crouch-celebrate);
    ctx.rotate(actorTilt);
    // Hero thrower always faces the road. Patrollers turn around at both ends.
    const face=engaged?(bike.x>actualX?1:-1):walk.dir;
    ctx.scale(face<0?-1:1,1);
    const breathe=1+.006*Math.sin(time*2.6+i*1.7);
    ctx.scale(1/breathe,breathe);
    // v7.2: ACTUAL cleaned, alpha-safe illustrated sprite frames. Render the
    // same character artwork at gameplay size, not a separately drawn stick figure.
    // All 6 poses share a 162 px foot baseline; individual image widths may differ.
    const variant=(profile.variant??(i%6));
    const originalKey=`v72_${crew.kind}_${variant}_${frame}`;
    const propKey=`v158_firecracker_${crew.kind}_${variant}_${frame}`;
    const art=visualKind==='firecracker'?(images[propKey]||images[originalKey]):images[originalKey];
    const paintedHeight=window.BearlyKids.worldHeight?.()||120;
    if(window.BearlyKids.draw(ctx,{kind:visualKind,frame,height:paintedHeight})){
      // Poses and prop visibility come from the actual wind-up/release state.
    }else if(art?.naturalWidth){
      const spriteH=(crew.kind==='video'?82:crew.kind==='toll'?78:80)*(profile.scale||.76);
      const scale=spriteH/art.naturalHeight;
      const leftAnchor=[59,68,71,77,90,90][frame] || 70;
      // All skin and wardrobe shading is authored in each painted frame. No hue filters.
      ctx.filter='none';
      ctx.drawImage(art,-leftAnchor*scale,-spriteH+2,art.naturalWidth*scale,spriteH);
      if(visualKind==='firecracker' && phase==='warn' && frame===3)drawV158Fuse(scale,leftAnchor,spriteH,i);
      ctx.filter='none';
    }else{
      drawProceduralTroublemaker(visualKind,phase,width,elapsed,i,crew,frame);
    }
    ctx.restore();
  }
  // V10.55: richer illustration with contained, independent fire and smoke layers.
  // Drawn at the original hazard origin; no change to collision footprint.
  function drawFireBinLegacy(h){
    const gy=groundAt(h.x);if(gy===null)return;
    const seed=h.x*.0031, t=time, flicker=.90+.10*Math.sin(t*12+seed);
    ctx.save();ctx.translate(h.x,gy);ctx.lineJoin='round';
    // Ground footprint and warm reflected light are painted under the bin.
    ctx.fillStyle='rgba(28,37,38,.34)';ctx.beginPath();ctx.ellipse(0,2,42,9,0,0,Math.PI*2);ctx.fill();
    const asphalt=ctx.createRadialGradient(0,-9,3,0,-9,82);
    asphalt.addColorStop(0,'rgba(252,157,59,.22)');asphalt.addColorStop(1,'rgba(252,157,59,0)');
    ctx.fillStyle=asphalt;ctx.fillRect(-86,-43,172,88);
    // Smoke is behind the flame and bin, not a semi-transparent rectangle pasted on top.
    for(let i=0;i<7;i++){
      const phase=(t*.24+i/7+seed)%1;
      const sx=Math.sin(i*7.7+t*.59)*10+phase*21-6;
      const sy=-91-phase*104;
      const r=7+phase*17+(i%3)*1.5;
      ctx.fillStyle=`rgba(${Math.round(61+phase*45)},${Math.round(63+phase*41)},${Math.round(67+phase*36)},${(.23*(1-phase)*(1-phase)).toFixed(3)})`;
      ctx.beginPath();ctx.arc(sx,sy,r,0,Math.PI*2);ctx.fill();
    }
    // Three stable layered flame colors, with independently oscillating tips.
    const flames=[[-23,35,0],[-12,44,1],[0,51,2],[12,42,3],[23,35,4],[-2,37,5]];
    for(const [dx,height,k] of flames){
      const wave=Math.sin(t*(6.0+k*.63)+seed+k*1.7),tip=height*(.87+.16*wave);
      ctx.save();ctx.translate(dx,-70);ctx.rotate(wave*.10);
      ctx.fillStyle='#a93824';ctx.beginPath();ctx.moveTo(-11,5);ctx.bezierCurveTo(-18,-tip*.27,-3,-tip*.60,1,-tip);
      ctx.bezierCurveTo(9,-tip*.55,16,-tip*.25,11,5);ctx.closePath();ctx.fill();
      ctx.fillStyle='#f16c2d';ctx.beginPath();ctx.moveTo(-8,4);ctx.quadraticCurveTo(-11,-tip*.43,1,-tip*.85);
      ctx.quadraticCurveTo(9,-tip*.41,8,4);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ffc356';ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-5,-tip*.35,1,-tip*.61);
      ctx.quadraticCurveTo(5,-tip*.20,5,3);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(255,242,155,.86)';ctx.beginPath();ctx.ellipse(0,-6,3.4,9,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    // Rounded metal shell with more painterly dimensional panels and crisp contour.
    const shell=ctx.createLinearGradient(-35,-35,34,-35);
    shell.addColorStop(0,'#263f43');shell.addColorStop(.22,'#48716a');shell.addColorStop(.49,'#607e74');
    shell.addColorStop(.78,'#355a55');shell.addColorStop(1,'#203d42');
    ctx.fillStyle=shell;ctx.strokeStyle='#24343d';ctx.lineWidth=3.4;
    ctx.beginPath();ctx.moveTo(-31,-73);ctx.lineTo(31,-73);ctx.lineTo(27,-13);ctx.quadraticCurveTo(27,-4,19,-4);
    ctx.lineTo(-19,-4);ctx.quadraticCurveTo(-27,-4,-27,-13);ctx.closePath();ctx.fill();ctx.stroke();
    // Grooves, hot metal highlights and slight everyday wear.
    ctx.strokeStyle='rgba(195,215,201,.42)';ctx.lineWidth=2.4;
    for(const x of [-22,-10,10,22]){ctx.beginPath();ctx.moveTo(x,-65);ctx.lineTo(x*.93,-15);ctx.stroke();}
    ctx.strokeStyle='rgba(27,50,51,.55)';ctx.lineWidth=1.3;
    for(const x of [-16,16]){ctx.beginPath();ctx.moveTo(x,-60);ctx.lineTo(x*.95,-19);ctx.stroke();}
    ctx.fillStyle='#263c41';ctx.beginPath();ctx.ellipse(0,-74,33,8,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#869087';ctx.lineWidth=3.2;ctx.beginPath();ctx.ellipse(0,-74,33,8,0,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle=`rgba(255,185,84,${(.45+.28*flicker).toFixed(2)})`;ctx.lineWidth=2.4;
    ctx.beginPath();ctx.ellipse(0,-74,30,5,0,0,Math.PI);ctx.stroke();
    // Small stamped yellow animal icon on the bin, no unreadable tiny text.
    ctx.fillStyle='#e3bd70';ctx.strokeStyle='#38545a';ctx.lineWidth=1.7;
    ctx.beginPath();ctx.roundRect(-15,-50,30,24,5);ctx.fill();ctx.stroke();
    ctx.fillStyle='#6a553c';ctx.beginPath();ctx.arc(-8,-42,4,0,7);ctx.arc(8,-42,4,0,7);ctx.fill();
    ctx.fillStyle='#8d6541';ctx.beginPath();ctx.ellipse(0,-39,10,9,0,0,7);ctx.fill();
    ctx.fillStyle='#2c3e3d';ctx.beginPath();ctx.arc(-4,-41,1.4,0,7);ctx.arc(4,-41,1.4,0,7);ctx.ellipse(0,-36,2.1,1.5,0,0,7);ctx.fill();
    // Embers are sparse and travel upward. No expensive texture layer.
    for(let i=0;i<7;i++){
      const age=(t*(.65+(i%3)*.14)+i*.271+seed)%1;
      const ex=(i%2?1:-1)*(5+i*4)+Math.sin(t*1.9+i)*4, ey=-80-age*89;
      ctx.fillStyle=`rgba(255,${Math.round(155+age*75)},78,${(.85*(1-age)).toFixed(3)})`;
      ctx.beginPath();ctx.ellipse(ex,ey,1.6+(i%3)*.35,2.5,0,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }

  // The six V163 frame keys all refer to the same static picture.
  // Preserve its painted metal body while the flames, smoke and embers move.
  let fireBinSource=null, fireBinCrop=null;
  function fireBinImageCrop(im){
    if(im===fireBinSource)return fireBinCrop;
    fireBinSource=im;fireBinCrop=null;
    try{
      const sc=Math.min(1,512/Math.max(im.naturalWidth,im.naturalHeight));
      const w=Math.max(1,Math.round(im.naturalWidth*sc));
      const h=Math.max(1,Math.round(im.naturalHeight*sc));
      const work=document.createElement('canvas');work.width=w;work.height=h;
      const c=work.getContext('2d',{willReadFrequently:true});
      c.drawImage(im,0,0,w,h);
      const pixels=c.getImageData(0,0,w,h).data;
      let left=w,top=h,right=-1,bottom=-1,visible=0;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        if(pixels[(y*w+x)*4+3]<18)continue;
        visible++;
        if(x<left)left=x;if(x>right)right=x;
        if(y<top)top=y;if(y>bottom)bottom=y;
      }
      // Don't draw an opaque white image background onto the street.
      if(!visible||visible>w*h*.97)return null;
      left=Math.max(0,left-2);top=Math.max(0,top-2);
      right=Math.min(w-1,right+2);bottom=Math.min(h-1,bottom+2);
      fireBinCrop={sx:left/sc,sy:top/sc,sw:(right-left+1)/sc,sh:(bottom-top+1)/sc};
    }catch(_){fireBinCrop={sx:0,sy:0,sw:im.naturalWidth,sh:im.naturalHeight};}
    return fireBinCrop;
  }
  function drawFireBin(h){
    const gy=groundAt(h.x);if(gy===null)return;
    const im=images.v162_firebin_0;
    if(!im?.naturalWidth){drawFireBinLegacy(h);return;}
    const crop=fireBinImageCrop(im);
    if(!crop){drawFireBinLegacy(h);return;}
    const t=time+h.x*.00053;
    ctx.save();ctx.translate(h.x,gy);
    ctx.fillStyle='rgba(29,34,36,.25)';
    ctx.beginPath();ctx.ellipse(0,1,35,6,0,0,Math.PI*2);ctx.fill();
    const glow=ctx.createRadialGradient(0,-67,3,0,-67,76);
    glow.addColorStop(0,'rgba(255,123,40,.20)');
    glow.addColorStop(1,'rgba(255,123,40,0)');
    ctx.fillStyle=glow;ctx.fillRect(-77,-126,154,126);
    // Only a few translucent wisps, behind the bin. No detached smoke cloud.
    for(let i=0;i<4;i++){
      const age=(t*(.26+i*.024)+i*.25)%1;
      const x=Math.sin(t*.67+i*1.9)*5+age*12-5,y=-98-age*55,r=5+age*11;
      const haze=ctx.createRadialGradient(x,y,1,x,y,r);
      haze.addColorStop(0,'rgba(70,66,65,'+(.17*(1-age)).toFixed(3)+')');
      haze.addColorStop(1,'rgba(70,66,65,0)');
      ctx.fillStyle=haze;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
    // Alpha-trim the existing illustrated sprite; its foot stays at groundAt(x).
    const width=Math.min(99,144*crop.sw/crop.sh),height=144;
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    ctx.drawImage(im,crop.sx,crop.sy,crop.sw,crop.sh,-width*.5,-height,width,height);
    // Five flame tongues whose shapes and tips actually change every frame.
    // Their roots stay tucked into the same bin opening.
    for(const [x,hgt,i] of [[-21,35,0],[-11,52,1],[2,62,2],[15,46,3],[23,30,4]]){
      const wave=Math.sin(t*(7+i*.61)+i*2.1);
      const sway=Math.sin(t*(4.2+i*.36)+i)*5;
      const height=hgt*(.83+.17*wave);
      ctx.save();ctx.translate(x,-77);
      const outer=ctx.createLinearGradient(0,4,sway,-height);
      outer.addColorStop(0,'rgba(173,47,20,.90)');
      outer.addColorStop(.5,'rgba(242,92,27,.96)');
      outer.addColorStop(1,'rgba(255,179,56,.92)');
      ctx.fillStyle=outer;ctx.beginPath();ctx.moveTo(-11,5);
      ctx.bezierCurveTo(-16,-height*.30,sway-8,-height*.70,sway,-height);
      ctx.bezierCurveTo(sway+9,-height*.65,15,-height*.27,11,5);
      ctx.closePath();ctx.fill();
      const inner=ctx.createLinearGradient(0,3,sway,-height*.73);
      inner.addColorStop(0,'#ff8a2c');inner.addColorStop(.53,'#ffd25d');
      inner.addColorStop(1,'#fff0a1');
      ctx.fillStyle=inner;ctx.beginPath();ctx.moveTo(-5,4);
      ctx.quadraticCurveTo(-8,-height*.36,sway,-height*.72);
      ctx.quadraticCurveTo(sway+5,-height*.33,6,4);
      ctx.closePath();ctx.fill();ctx.restore();
    }
    // Draw a dark rolled rim over the flame roots: no floating fire.
    ctx.fillStyle='rgba(28,38,40,.78)';
    ctx.beginPath();ctx.ellipse(0,-74,27,4.9,0,0,Math.PI);ctx.fill();
    ctx.strokeStyle='rgba(203,160,113,.72)';ctx.lineWidth=1.8;
    ctx.beginPath();ctx.ellipse(0,-75,28,5.2,0,0,Math.PI);ctx.stroke();
    for(let i=0;i<6;i++){
      const age=(t*(.80+i*.07)+i*.181)%1;
      const x=(i%2?-1:1)*(5+i*3)+Math.sin(t*1.7+i)*4;
      const y=-87-age*70;
      ctx.globalAlpha=.72*(1-age);
      ctx.fillStyle=i%3?'#ffad43':'#ffe49a';
      ctx.beginPath();ctx.arc(x,y,1.2+(i%3)*.36,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }

  // V10.59 – world-sized illustrated hazard details, grounded on the asphalt.
  // Draw only. DO NOT change actor scales, collision geometry, locations, or AI.
  function drawProceduralHazard(kind,w){
    const outline='#273c48',metal='#405d67',shine='#a9b8ae';
    const curve=(pts)=>{
      ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
      for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);
      ctx.closePath();
    };
    if(kind==='scooter'){
      // A small battered rental kick-scooter, not a miniature bicycle frame.
      // All dimensions are locked to the earlier 111-pixel asset width.
      ctx.save();ctx.scale(w/111,w/111);ctx.lineJoin='round';ctx.lineCap='round';
      // Contact shadow and small rubber scrape: these are on the road, never hovering.
      ctx.fillStyle='rgba(24,36,44,.25)';ctx.beginPath();ctx.ellipse(0,0,48,5,0,0,7);ctx.fill();
      ctx.strokeStyle='rgba(37,44,46,.23)';ctx.lineWidth=2.0;
      ctx.beginPath();ctx.moveTo(-48,-2);ctx.quadraticCurveTo(-57,-6,-61,-4);ctx.stroke();
      // Two rubber scooter wheels, weighted rims and actual hubs.
      for(const wx of [-34,28]){
        const wy=-9;
        ctx.fillStyle='#25343e';ctx.strokeStyle='#1e333d';ctx.lineWidth=2.1;
        ctx.beginPath();ctx.arc(wx,wy,11,0,7);ctx.fill();ctx.stroke();
        ctx.strokeStyle='#6a8588';ctx.lineWidth=1.7;ctx.beginPath();ctx.arc(wx,wy,7,0,7);ctx.stroke();
        ctx.fillStyle='#a6b1a9';ctx.beginPath();ctx.arc(wx,wy,3.2,0,7);ctx.fill();
        ctx.fillStyle='#37464f';ctx.beginPath();ctx.arc(wx,wy,1.3,0,7);ctx.fill();
      }
      // Low deck has thickness and front/side faces instead of three thin lines.
      const hull=ctx.createLinearGradient(0,-29,0,-10);
      hull.addColorStop(0,'#7f9b99');hull.addColorStop(.43,'#496f78');hull.addColorStop(1,'#263f4b');
      ctx.fillStyle=hull;ctx.strokeStyle=outline;ctx.lineWidth=2.6;
      curve([[-32,-20],[11,-23],[28,-18],[24,-12],[-31,-13]]);ctx.fill();ctx.stroke();
      ctx.fillStyle='#293e46';ctx.beginPath();ctx.roundRect(-25,-23,43,4.5,2);ctx.fill();
      ctx.strokeStyle='rgba(196,204,185,.52)';ctx.lineWidth=.85;
      for(let k=0;k<6;k++){const x=-19+k*6;ctx.beginPath();ctx.moveTo(x,-21.6);ctx.lineTo(x+3,-21.6);ctx.stroke();}
      // Rear fender with little orange reflector.
      ctx.strokeStyle='#344e58';ctx.lineWidth=3;ctx.beginPath();ctx.arc(-34,-10,13,3.5,5.63);ctx.stroke();
      ctx.fillStyle='#c98a56';ctx.beginPath();ctx.roundRect(-46,-17,6,3,1);ctx.fill();
      // Angled, slightly damaged stem mounted to front of deck. No bike triangle.
      ctx.strokeStyle='#263b46';ctx.lineWidth=7.6;ctx.beginPath();ctx.moveTo(25,-17);ctx.lineTo(13,-48);ctx.stroke();
      ctx.strokeStyle='#6f9999';ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(24,-20);ctx.lineTo(13,-45);ctx.stroke();
      ctx.fillStyle='#304b56';ctx.strokeStyle='#203742';ctx.lineWidth=1.6;
      ctx.beginPath();ctx.arc(13,-46,4.6,0,7);ctx.fill();ctx.stroke();
      // Crooked upper shaft, clearly bent at a hinge rather than randomly floating.
      ctx.strokeStyle='#2b424d';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(11,-46);ctx.lineTo(-4,-66);ctx.stroke();
      ctx.strokeStyle='#6c9192';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(10,-48);ctx.lineTo(-3,-63);ctx.stroke();
      ctx.strokeStyle='#233843';ctx.lineWidth=5.5;ctx.beginPath();ctx.moveTo(-20,-67);ctx.lineTo(14,-67);ctx.stroke();
      ctx.strokeStyle='#8fa6a1';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-13,-69);ctx.lineTo(6,-69);ctx.stroke();
      for(const x of [-18,12]){
        ctx.strokeStyle='#1d313a';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-2,-67);ctx.lineTo(x+3,-67);ctx.stroke();
      }
      // Frayed cable follows shaft and ends at hinge, not in mid-air.
      ctx.strokeStyle='rgba(38,57,63,.9)';ctx.lineWidth=1.1;
      ctx.beginPath();ctx.moveTo(-6,-61);ctx.bezierCurveTo(-16,-50,-1,-46,9,-43);ctx.stroke();
      ctx.fillStyle='#de9a60';ctx.beginPath();ctx.roundRect(9,-44,6,3,1);ctx.fill();
      // Shallow painted abrasion and tiny fasteners, still within original footprint.
      ctx.strokeStyle='rgba(245,223,181,.60)';ctx.lineWidth=1.2;
      ctx.beginPath();ctx.moveTo(-8,-15.5);ctx.lineTo(7,-16.4);ctx.stroke();
      ctx.fillStyle='#c6c5aa';ctx.beginPath();ctx.arc(24,-16.5,1.4,0,7);ctx.fill();
      ctx.restore();return true;
    }
    if(kind==='cart'){
      // A worn low market/utility cart: wood cargo bed + steel frame + push handle.
      // Drawn in slight 3/4 perspective, exactly where the prior cart stood.
      ctx.save();ctx.scale(w/118,w/118);ctx.lineJoin='round';ctx.lineCap='round';
      ctx.fillStyle='rgba(23,34,40,.26)';ctx.beginPath();ctx.ellipse(0,1,55,6,0,0,7);ctx.fill();
      // Load-bearing rear underframe and handle drawn BEHIND cart body.
      ctx.strokeStyle='#314c56';ctx.lineWidth=4.1;
      ctx.beginPath();ctx.moveTo(-35,-20);ctx.lineTo(-31,-6);ctx.lineTo(29,-6);ctx.lineTo(35,-22);ctx.stroke();
      ctx.beginPath();ctx.moveTo(34,-25);ctx.lineTo(45,-76);ctx.lineTo(34,-78);ctx.stroke();
      ctx.strokeStyle='#7c9691';ctx.lineWidth=1.45;ctx.beginPath();ctx.moveTo(37,-30);ctx.lineTo(47,-74);ctx.stroke();
      ctx.strokeStyle='#293f49';ctx.lineWidth=5.5;ctx.beginPath();ctx.moveTo(28,-79);ctx.lineTo(45,-79);ctx.stroke();
      ctx.fillStyle='#e2be8e';ctx.beginPath();ctx.arc(35,-27,3,0,7);ctx.fill();
      // Four low casters; rear ones more visible. Still a hazard, not a new vehicle.
      for(const [wx,wy,r] of [[-37,-5,9],[30,-5,9],[-13,-2,5.7]]){
        ctx.fillStyle='#283942';ctx.strokeStyle='#1f333c';ctx.lineWidth=1.8;
        ctx.beginPath();ctx.arc(wx,wy,r,0,7);ctx.fill();ctx.stroke();
        ctx.fillStyle='#6a8184';ctx.beginPath();ctx.arc(wx,wy,r*.58,0,7);ctx.fill();
        ctx.fillStyle='#b7c4b3';ctx.beginPath();ctx.arc(wx,wy,r*.23,0,7);ctx.fill();
      }
      // Slightly tilted wooden side wall, not a bland flat UI rectangle.
      const side=ctx.createLinearGradient(-37,-59,30,-12);
      side.addColorStop(0,'#e4cda6');side.addColorStop(.48,'#c69f73');side.addColorStop(1,'#946e53');
      ctx.fillStyle=side;ctx.strokeStyle='#344c53';ctx.lineWidth=3;
      curve([[-42,-55],[33,-51],[38,-21],[-39,-23]]);ctx.fill();ctx.stroke();
      // Side wall planks separated by natural seams and offset grain.
      ctx.strokeStyle='rgba(82,71,57,.52)';ctx.lineWidth=1.45;
      for(const y of [-45,-35]){ctx.beginPath();ctx.moveTo(-39,y);ctx.lineTo(35,y+3);ctx.stroke();}
      ctx.strokeStyle='rgba(252,235,194,.62)';ctx.lineWidth=1.25;
      ctx.beginPath();ctx.moveTo(-37,-52);ctx.lineTo(29,-48);ctx.moveTo(-34,-41);ctx.lineTo(16,-39);ctx.stroke();
      // Dark blue steel corner bars and screws keep the body dimensional.
      ctx.strokeStyle='#45636c';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(-40,-54);ctx.lineTo(-38,-23);ctx.moveTo(34,-50);ctx.lineTo(37,-22);ctx.stroke();
      ctx.fillStyle='#d4be97';for(const [x,y] of [[-37,-49],[32,-46],[-36,-29],[35,-26]]){
        ctx.beginPath();ctx.arc(x,y,1.8,0,7);ctx.fill();
      }
      // Cargo opening has an actual near/far edge and a visible inner floor.
      ctx.fillStyle='#667774';ctx.strokeStyle='#2e464e';ctx.lineWidth=2.4;
      curve([[-45,-57],[-27,-68],[37,-59],[34,-50]]);ctx.fill();ctx.stroke();
      ctx.fillStyle='#b28f6b';curve([[-39,-58],[-25,-64],[30,-56],[29,-53]]);ctx.fill();
      // Two small worn cardboard packages nestled INSIDE the cart, not floating.
      const pack=ctx.createLinearGradient(0,-83,0,-51);
      pack.addColorStop(0,'#e1c498');pack.addColorStop(1,'#ac805b');
      ctx.fillStyle=pack;ctx.strokeStyle='#526069';ctx.lineWidth=1.7;
      curve([[-23,-60],[-25,-77],[3,-78],[7,-57]]);ctx.fill();ctx.stroke();
      curve([[7,-58],[6,-72],[26,-71],[25,-55]]);ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(244,230,198,.65)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(-20,-75);ctx.lineTo(-19,-59);ctx.moveTo(10,-69);ctx.lineTo(10,-57);ctx.stroke();
      ctx.fillStyle='#56737a';ctx.beginPath();ctx.roundRect(-5,-79,9,5,1);ctx.fill();
      // Front mouth rail and dangling metal tie.
      ctx.strokeStyle='#283e48';ctx.lineWidth=3.5;
      ctx.beginPath();ctx.moveTo(-43,-56);ctx.lineTo(35,-51);ctx.stroke();
      ctx.strokeStyle='rgba(246,228,190,.61)';ctx.lineWidth=1.1;
      ctx.beginPath();ctx.moveTo(-39,-58);ctx.lineTo(25,-54);ctx.stroke();
      ctx.strokeStyle='#41545a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-6,-50);ctx.lineTo(-2,-45);ctx.stroke();
      ctx.restore();return true;
    }
    if(kind==='glass'){
      // Irregular grounded shards from a smashed bottle, not jewel-like confetti.
      ctx.save();ctx.scale(w/91,(w/91)*.86);ctx.lineJoin='round';
      ctx.fillStyle='rgba(28,48,51,.13)';ctx.beginPath();ctx.ellipse(0,1,48,4.8,0,0,7);ctx.fill();
      const fragments=[
        {p:[[-46,-3],[-35,-16],[-29,-4],[-36,0]],a:.65},
        {p:[[-30,-2],[-25,-25],[-9,-8],[-16,0]],a:.78},
        {p:[[-15,-5],[-3,-27],[6,-16],[11,-2]],a:.82},
        {p:[[8,-2],[22,-20],[31,-8],[23,0]],a:.67},
        {p:[[29,-3],[37,-17],[46,-6],[42,1]],a:.74},
        {p:[[-8,-4],[11,-13],[17,-4],[4,1]],a:.60},
        {p:[[20,-6],[32,-14],[38,-5],[30,-1]],a:.54}
      ];
      for(let i=0;i<fragments.length;i++){
        const sh=fragments[i];
        ctx.fillStyle=`rgba(153,209,206,${sh.a})`;
        ctx.strokeStyle='rgba(51,101,107,.87)';ctx.lineWidth=1.65;
        curve(sh.p);ctx.fill();ctx.stroke();
        ctx.strokeStyle='rgba(237,246,228,.88)';ctx.lineWidth=.95;
        ctx.beginPath();ctx.moveTo(sh.p[0][0]+1,sh.p[0][1]);
        ctx.lineTo(sh.p[1][0],sh.p[1][1]+2);ctx.stroke();
        ctx.fillStyle='rgba(73,143,153,.19)';
        ctx.beginPath();ctx.moveTo(sh.p[1][0],sh.p[1][1]);
        ctx.lineTo(sh.p[2][0],sh.p[2][1]);ctx.lineTo(sh.p[3][0],sh.p[3][1]);ctx.closePath();ctx.fill();
      }
      // Broken, greenish bottle neck laid flat on asphalt (source of the shards).
      ctx.save();ctx.translate(-25,-5);ctx.rotate(-.31);
      ctx.fillStyle='rgba(76,130,126,.72)';ctx.strokeStyle='#3b6d72';ctx.lineWidth=1.6;
      ctx.beginPath();ctx.roundRect(-16,-5,18,9,3);ctx.fill();ctx.stroke();
      ctx.strokeStyle='#c0dad2';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-9,-4);ctx.lineTo(-9,3);ctx.stroke();
      ctx.strokeStyle='#618a82';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(1,0,3,5,0,0,7);ctx.stroke();
      ctx.restore();
      // Micro pieces fill gaps but stay touching the road plane.
      for(const [x,y,r] of [[-39,-1,2],[-19,1,2.3],[-3,1,1.8],[17,0,2.1],[40,-1,2]]){
        ctx.fillStyle='rgba(188,226,223,.72)';ctx.beginPath();ctx.moveTo(x-r,y);
        ctx.lineTo(x+1,y-r*.9);ctx.lineTo(x+r,y+1);ctx.closePath();ctx.fill();
      }
      // One tiny reflection tied to a shard edge, never a free-floating sparkle.
      const flick=.65+.35*Math.sin(time*2.6+2.1);
      ctx.strokeStyle=`rgba(247,243,203,${(.45+.33*flick).toFixed(3)})`;ctx.lineWidth=1.15;
      ctx.beginPath();ctx.moveTo(-2,-23);ctx.lineTo(1,-18);ctx.stroke();
      ctx.restore();return true;
    }
    if(kind==='roadblock'){
      // Existing barrier is drawn with the dedicated detailed renderer elsewhere.
      return false;
    }
    return false;
  }
  function drawHazardApproach(h){
    // V10.41: No generic road warning triangles. Small road-level traces tell
    // the story of the ACTUAL upcoming obstacle instead of repeating one sign.
    const x=h.x-164, gy=groundAt(x);
    if(gy==null||x<cameraX-155||x>cameraX+W+155)return;
    const family=({scooter:'rubber',cart:'rubber',pothole:'crack',glass:'shards',
      roadwork:'work',roadblock:'work',firebin:'embers'})[h.type];
    if(!family)return;
    ctx.save();ctx.translate(x,gy-19);ctx.lineCap='round';ctx.lineJoin='round';
    if(family==='rubber'){
      // Light tire marks, asymmetrical and following the asphalt.
      ctx.strokeStyle='rgba(42,45,51,.24)';ctx.lineWidth=2.5;
      for(let i=0;i<2;i++){
        ctx.beginPath();ctx.moveTo(-43,i*11);ctx.bezierCurveTo(-24,-9+i*11,4,12+i*11,36,1+i*11);ctx.stroke();
      }
      ctx.fillStyle='rgba(82,80,74,.20)';ctx.beginPath();ctx.ellipse(43,13,10,3,0,0,Math.PI*2);ctx.fill();
    }else if(family==='shards'){
      const bits=[[-31,3,9],[-9,-6,7],[16,8,11],[36,-2,6]];
      for(const [dx,dy,r] of bits){
        ctx.fillStyle='rgba(168,219,220,.52)';ctx.strokeStyle='rgba(227,243,237,.78)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(dx-r,dy+3);ctx.lineTo(dx-1,dy-r*.7);
        ctx.lineTo(dx+r*.5,dy);ctx.lineTo(dx+2,dy+5);ctx.closePath();ctx.fill();ctx.stroke();
      }
    }else if(family==='embers'){
      ctx.fillStyle='rgba(64,51,47,.26)';ctx.beginPath();ctx.ellipse(-5,10,37,6,-.05,0,Math.PI*2);ctx.fill();
      for(const [dx,dy] of [[-29,6],[-14,-4],[12,5],[33,-3]]){
        ctx.fillStyle='rgba(219,118,61,.57)';ctx.beginPath();ctx.arc(dx,dy,2.6,0,Math.PI*2);ctx.fill();
      }
    }else if(family==='work'){
      // Short diagonal work-zone paint on the road, not a freestanding sign.
      ctx.strokeStyle='rgba(227,190,112,.55)';ctx.lineWidth=4;
      for(let i=0;i<3;i++){
        const dx=-28+i*26;ctx.beginPath();ctx.moveTo(dx-7,-3);ctx.lineTo(dx+7,9);ctx.stroke();
      }
    }else if(family==='crack'){
      ctx.strokeStyle='rgba(53,53,57,.32)';ctx.lineWidth=2.2;
      ctx.beginPath();ctx.moveTo(-28,4);ctx.lineTo(-8,-3);ctx.lineTo(10,4);ctx.lineTo(31,-7);
      ctx.moveTo(-8,-3);ctx.lineTo(-4,-15);ctx.moveTo(10,4);ctx.lineTo(19,15);ctx.stroke();
    }
    ctx.restore();
  }
  // The same illustrated hazard language as the projectiles and road props.
  function v146DrawMaintenanceBarrier(x,gy){
    ctx.save();ctx.translate(x,gy);ctx.lineJoin='round';
    drawDangerSurfaceLocal(104);
    ctx.fillStyle='rgba(28,40,43,.31)';ctx.beginPath();ctx.ellipse(0,3,57,7,0,0,7);ctx.fill();
    // Solid ballasted A-frame feet, no disconnected thin legs.
    for(const px of [-39,39]){
      ctx.fillStyle='#485a61';ctx.strokeStyle='#263944';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(px-16,1);ctx.lineTo(px+17,1);ctx.lineTo(px+10,-9);ctx.lineTo(px-10,-9);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#79817b';ctx.beginPath();ctx.roundRect(px-4,-58,8,50,2);ctx.fill();
      ctx.strokeStyle='#c6c9b0';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(px-1,-54);ctx.lineTo(px-1,-14);ctx.stroke();
    }
    const board=ctx.createLinearGradient(0,-66,0,-32);
    board.addColorStop(0,'#e2c59e');board.addColorStop(.5,'#cfab7c');board.addColorStop(1,'#a77e59');
    ctx.fillStyle=board;ctx.strokeStyle='#2b404b';ctx.lineWidth=3.4;
    ctx.beginPath();ctx.roundRect(-52,-65,104,34,5);ctx.fill();ctx.stroke();
    // Clipped diagonal reflective panels: consistent with the finish barrier.
    ctx.save();ctx.beginPath();ctx.roundRect(-49,-62,98,28,3);ctx.clip();
    for(let i=-1;i<6;i++){
      ctx.fillStyle=i%2?'#a95449':'#f3e4bd';ctx.beginPath();
      const xx=-50+i*23;ctx.moveTo(xx-2,-32);ctx.lineTo(xx+15,-32);ctx.lineTo(xx+35,-62);ctx.lineTo(xx+19,-62);ctx.closePath();ctx.fill();
    }
    ctx.restore();
    ctx.strokeStyle='rgba(255,245,207,.78)';ctx.lineWidth=1.7;
    ctx.beginPath();ctx.moveTo(-46,-61);ctx.lineTo(45,-61);ctx.stroke();
    for(const px of [-44,44]){
      ctx.fillStyle='#374b54';ctx.beginPath();ctx.arc(px,-48,2.6,0,7);ctx.fill();
      ctx.fillStyle='#f5d28e';ctx.beginPath();ctx.arc(px-.65,-48.6,1,0,7);ctx.fill();
    }
    ctx.restore();
  }

  // V10.60: AI-illustrated, hand-cleaned alpha sprites. Draw only: physics untouched.
  const V160_SPRITES = {};
  for(const [name,src] of Object.entries({"scooter":"assets/scooter.png","cart":"assets/cart.png","glass":"assets/glass.png","roadblock":"assets/roadblock.png"})){
    const sprite=new Image();sprite.src=src;V160_SPRITES[name]=sprite;
  }
  function drawV160Sprite(name,width,height){
    const im=V160_SPRITES[name];
    if(!im || !im.complete || im.naturalWidth===0)return false;
    ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    ctx.drawImage(im,-width*.5,-height,width,height);ctx.restore();return true;
  }
  function drawV160WorldSprite(name,x,y,width,height){
    ctx.save();ctx.translate(x,y);
    drawDangerSurfaceLocal(width);
    const ok=drawV160Sprite(name,width,height);
    ctx.restore();return ok;
  }
  function drawRoadsideHazard(h){
    const gy=groundAt(h.x);if(gy===null)return false;
    if(h.type==='firebin'){drawFireBin(h);return true;}
    if(h.type==='roadblock'){if(!drawV160WorldSprite('roadblock',h.x,gy,104,69))v146DrawMaintenanceBarrier(h.x,gy);return true;}
    if(!['scooter','cart','glass'].includes(h.type))return false;
    const kind={scooter:'scooter_broken',cart:'cart_hazard',glass:'glass'}[h.type];
    const im=images['v60_'+kind]||images['v59_'+kind];
    const width={scooter:111,cart:118,glass:91}[h.type];
    const height=im?.naturalWidth?width*im.naturalHeight/im.naturalWidth:width*.72;
    ctx.save();ctx.translate(h.x,gy);
    drawDangerSurfaceLocal(width);
    ctx.fillStyle='rgba(24,35,44,.35)';ctx.beginPath();ctx.ellipse(0,0,width*.39,8,0,0,Math.PI*2);ctx.fill();
    const wobble=0; // A resting hazard should not wobble like an animated sticker.
    ctx.rotate(wobble);
    let drew=drawV160Sprite(h.type,width,({scooter:72,cart:86,glass:36})[h.type]);
    if(!drew)drew=drawProceduralHazard(h.type,width);
    if(!drew&&im?.naturalWidth){
      ctx.filter='saturate(.92) contrast(1.02)';ctx.globalAlpha=1;
      ctx.drawImage(im,-width*.5,-height+1,width,height);ctx.filter='none';ctx.globalAlpha=1;
      ctx.strokeStyle='rgba(248,235,213,.14)';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-width*.24,-height*.82);ctx.quadraticCurveTo(0,-height*.95,width*.18,-height*.82);ctx.stroke();
    }
    ctx.restore();return true;
  }
  function drawDangerSurfaceLocal(w){
    // Faint local asphalt wear, no flashing UI-orange strip underneath hazards.
    ctx.fillStyle='rgba(44,54,55,.19)';ctx.beginPath();
    ctx.ellipse(0,3,w*.53,5,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(203,185,153,.32)';ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(-w*.45,1);ctx.lineTo(-w*.25,-1);
    ctx.moveTo(w*.10,2);ctx.lineTo(w*.35,0);ctx.stroke();
  }

  function drawDangerSurface(x,y,w){ctx.save();ctx.translate(x,y);drawDangerSurfaceLocal(w);ctx.restore();}

  // Flame lives on the original raised-hand bottle tip, scaled using original art.
  // No enlargement or recoloring of any character, and no world-space floating spark.
  function drawV158Fuse(scale,leftAnchor,spriteH,i){
    const fx=(44-leftAnchor)*scale,fy=-spriteH+2+29*scale;
    const flicker=.62+.38*Math.sin(time*25+i*4.2);
    ctx.save();
    const r=3.8+1.9*flicker;
    const grad=ctx.createRadialGradient(fx,fy,0,fx,fy,r);
    grad.addColorStop(0,'rgba(255,247,184,.95)');
    grad.addColorStop(.46,'rgba(255,170,83,.62)');
    grad.addColorStop(1,'rgba(255,108,40,0)');
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(fx,fy,r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(255,203,103,.88)';ctx.lineWidth=.8;
    for(let j=0;j<3;j++){
      const theta=time*(8+j)+i*3+j*2.09,len=3.2+2.2*flicker;
      ctx.beginPath();ctx.moveTo(fx+Math.cos(theta)*1.7,fy+Math.sin(theta)*1.7);
      ctx.lineTo(fx+Math.cos(theta)*len,fy+Math.sin(theta)*len);ctx.stroke();
    }
    ctx.restore();
  }
  function drawGangCrews(){
    if(window.BearlyVisits?.footActive())return;
    const casts={
      hoodie:['hoodie_night','hoodie_olive','filmmaker_ink'],
      video:['filmmaker_charcoal','hoodie_night','fireworks_dark'],
      toll:['hoodie_olive','filmmaker_ink','scooter_night'],
      scooter:['scooter_night','hoodie_night','scooter_olive']
    };
    for(const crew of gangCrews){
      if(crew.x<cameraX-280||crew.x>cameraX+W+280)continue;
      const gy=groundAt(crew.x);if(gy===null)continue;
      const c=crewState.get(crew.x)||{phase:'idle',since:time,used:false};
      ctx.save();ctx.translate(crew.x,gy);
      // Stone border is a continuous WORLD feature now. These faint local details
      // blend each crew into the same terrace without an extra floating platform.
      ctx.strokeStyle='rgba(92,90,76,.19)';ctx.lineWidth=1.4;
      for(let k=-2;k<=2;k++){
        const xx=k*61,yy=(groundAt(crew.x+xx)??gy)-gy-92;
        ctx.beginPath();ctx.moveTo(xx,yy-9);ctx.lineTo(xx-12,yy+7);ctx.stroke();
      }
      // Postured groups in dark clothing. All feet rest ON the upper sidewalk.
      const roster=casts[crew.kind]||casts.hoodie;
      const count=crew.count;
      for(let i=0;i<count;i++){
        const resident=window.BearlyVisits?.gangStatus('gang-'+crew.x+'-'+i);if(resident&&['held','screen','stagger','down','fall','dead','rise'].includes(resident.state))continue;
        const prop=carriedPropFor(crew,i);
        const px=crewMemberLocalX(crew,i);
        const acted=memberPosePhase(crew,c,i);
        drawAnimatedTroublemaker(prop,acted,px,-102,crew,i);
      }
      if(c.phase==='throw'&&time-c.since<.18){
        const t=clamp((time-c.since)/.18,0,1);
        const bx=throwingHandX(crew)-crew.x,by=throwingHandY(crew)-gy;
        ctx.save();ctx.translate(bx,by);ctx.globalAlpha=(1-t)*.7;
        ctx.strokeStyle='#fff0c9';ctx.lineWidth=2.5;
        for(let k=0;k<4;k++){const ang=k*Math.PI/2+Math.PI/4;
          ctx.beginPath();ctx.moveTo(Math.cos(ang)*(9+t*9),Math.sin(ang)*(9+t*9));
          ctx.lineTo(Math.cos(ang)*(22+t*9),Math.sin(ang)*(22+t*9));ctx.stroke();}
        ctx.restore();
      }
      if(crew.kind==='video'){
        ctx.strokeStyle='#ffe0a4';ctx.lineWidth=4;ctx.beginPath();ctx.arc(157,-237,16,0,7);ctx.stroke();
        ctx.strokeStyle='#4f5d65';ctx.beginPath();ctx.moveTo(157,-219);ctx.lineTo(157,-145);ctx.stroke();
      }
      // Keep the toll encounter, but not the obsolete 0 KR placard.
      // 1.05 s anticipation with a *counting down* ring and an approximate arc.
      // The arc is suggestive, not a lock-on aim line: movement can dodge the throw.
      if(c.phase==='warn'){
        const a=time-c.since, progress=clamp(a/.91,0,1);
        const handX=throwingHandX(crew)-crew.x, handY=throwingHandY(crew)-gy;
        const flight=.74, destX=clamp(bike.x+bike.vx*flight-crew.x,-880,-45);
        const destY=bike.y-gy-31;
        ctx.save();ctx.globalAlpha=(.40+.33*Math.sin(progress*Math.PI));
        ctx.strokeStyle=progress>.66?'#ff8a65':'#ffdf89';ctx.lineWidth=3.6;
        ctx.setLineDash([8,9]);ctx.beginPath();ctx.moveTo(handX,handY);
        ctx.quadraticCurveTo((handX+destX)*.48,Math.min(handY,destY)-92,destX,destY);
        ctx.stroke();ctx.setLineDash([]);ctx.restore();
        // No floating warning sign above the enemy. Readability comes from the
        // raised throwing arm, the incoming arc and a compact glow at the hand.
        ctx.save();ctx.translate(handX,handY);
        ctx.globalAlpha=.25+.5*progress;
        ctx.strokeStyle=progress>.66?'#ffb06d':'#f8e1a6';ctx.lineWidth=2.5;
        ctx.beginPath();ctx.arc(0,0,6+progress*8,0,Math.PI*2);ctx.stroke();
        ctx.restore();
      }
      const reactionAge=time-(c.resultAt??-999);
      const reacts=reactionAge>=0&&reactionAge<1.05;
      if((reacts||(c.phase==='idle'&&Math.abs(bike.x-crew.x)<185))&&state==='playing'){
        const text=reacts?(c.result==='hit'?'DID THAT ACTUALLY HIT?!':'ABSOLUTE AIRBALL.'):c.phase==='warn'?'HE SAW US. KEEP THROWING.':crew.quip;
        const by=reacts?-290:-276;
        const width=Math.min(294,Math.max(175,ctx.measureText(text).width+28));
        ctx.save();ctx.globalAlpha=reacts?Math.min(1,(1.05-reactionAge)*3.7):1;
        ctx.fillStyle=reacts?'#f6e4b8':'#fff1d9';ctx.strokeStyle='#8d6852';ctx.lineWidth=2;
        ctx.beginPath();ctx.roundRect(-width/2,by,width,28,9);ctx.fill();ctx.stroke();
        ctx.fillStyle='#253b49';ctx.textAlign='center';ctx.font='bold 11px system-ui,sans-serif';ctx.fillText(text,0,by+19,width-15);
        ctx.restore();
      }
      ctx.restore();
    }
  }
  function drawLandmarks(){
    for(const l of landmarks){if(l.x<cameraX-620||l.x>cameraX+W+620)continue;
      if(l.kind==='square')continue; // Illustrated market buildings supply the square instead.
      if((l.kind==='castle'&&images.env_castle_hill?.naturalWidth)||(l.kind==='metro'&&images.env_metro_gard?.naturalWidth)||(l.kind==='strand'&&images.env_metro_strand?.naturalWidth)||(l.kind==='bathing'&&images.env_waterfront?.naturalWidth))continue;
      const gy=groundAt(l.x);if(gy===null)continue;
      ctx.save();ctx.translate(l.x,gy+12);ctx.lineJoin='round';
      if(l.kind==='castle'){
        // Two-story pale-pink 17th-century manor, side wings and domed pavilion.
        gradientRect(-190,-235,380,235,'#ffe4c7','#d5a49b');
        for(const x of [-250,190])gradientRect(x,-165,70,165,'#e8bdab','#c38d82');
        ctx.fillStyle='#41515b';ctx.beginPath();ctx.moveTo(-200,-235);ctx.lineTo(0,-274);ctx.lineTo(200,-235);ctx.closePath();ctx.fill();
        ctx.fillStyle='#3f505b';for(const bx of [-250,190]){ctx.beginPath();ctx.ellipse(bx+35,-173,42,48,0,Math.PI,Math.PI*2);ctx.fill();}
        for(let row=0;row<2;row++)for(let col=0;col<9;col++){ctx.fillStyle='#658a91';ctx.fillRect(-158+col*36,-195+row*83,15,32);ctx.strokeStyle='#f7e9d2';ctx.strokeRect(-158+col*36,-195+row*83,15,32);}
        ctx.fillStyle='#3f5561';ctx.fillRect(-24,-82,49,82);ctx.fillStyle='#d3ac8c';ctx.fillRect(-12,-73,12,72);
        ctx.fillStyle='#f9e2a2';ctx.beginPath();ctx.arc(0,-243,11,0,7);ctx.fill();ctx.strokeStyle='#49616a';ctx.stroke();
        gradientRect(-235,-13,470,13,'#e6bc9d','#ae8779');
      }else if(l.kind==='metro'||l.kind==='strand'){
        const w=l.kind==='strand'?435:365;
        gradientRect(-w/2,-135,w,126,'#e2d6c7','#a2b6be');
        gradientRect(-w/2-21,-150,w+42,20,'#719db2','#346b90');
        for(let i=0;i<7;i++){const xx=-w/2+24+i*(w-50)/6;ctx.fillStyle='#4c748c';ctx.fillRect(xx,-119,36,61);ctx.fillStyle='#d0e1dc';ctx.fillRect(xx+5,-115,21,50);}
        ctx.fillStyle='#27597e';ctx.fillRect(-155,-36,310,34);ctx.fillStyle='#f4edc9';ctx.font='bold 19px sans-serif';ctx.textAlign='center';ctx.fillText(l.kind==='metro'?'HÄSSELBY GÅRD':'HÄSSELBY STRAND',0,-14);
        ctx.fillStyle='#f4fbff';ctx.beginPath();ctx.arc(-w/2+9,-200,34,0,7);ctx.fill();ctx.strokeStyle='#2a6f96';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#2976a0';ctx.font='bold 39px sans-serif';ctx.fillText('T',-w/2+9,-186);
        for(let p=-1;p<=1;p++){ctx.strokeStyle='#5f7881';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p*140,-9);ctx.lineTo(p*135,6);ctx.stroke();}
      }else if(l.kind==='square'){
        gradientRect(-210,-185,420,185,'#e3bd96','#ad8f8b');
        for(let k=0;k<5;k++){gradientRect(-198+k*79,-114,68,102,'#6ca1b6','#345b72');ctx.fillStyle='#f9d6a1';ctx.fillRect(-195+k*79,-114,4,102);}
        ctx.fillStyle='#274c68';ctx.fillRect(-216,-187,433,41);ctx.fillStyle='#fae4a6';ctx.textAlign='center';ctx.font='bold 27px sans-serif';ctx.fillText('HÄSSELBY TORG',0,-158);
        for(let k=-1;k<2;k++){ctx.fillStyle='#667d5b';ctx.beginPath();ctx.arc(k*175,-50,34,0,7);ctx.fill();}
      }else if(l.kind==='bathing'){
        gradientRect(-260,-65,510,65,'#d0bb94','#8b9c96');
        ctx.strokeStyle='#e6d5b3';ctx.lineWidth=6;for(let k=-210;k<231;k+=55){ctx.beginPath();ctx.moveTo(k,0);ctx.lineTo(k,-92);ctx.stroke();}
        ctx.beginPath();ctx.moveTo(-230,-90);ctx.lineTo(245,-90);ctx.stroke();
        ctx.fillStyle='#4d9cae';ctx.beginPath();ctx.ellipse(170,0,95,13,0,0,7);ctx.fill();
        ctx.fillStyle='#ffe0a5';ctx.font='bold 23px sans-serif';ctx.textAlign='center';ctx.fillText('STRANDBADET',0,-119);
      }
      ctx.fillStyle='#183a4c';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.restore();
    }
  }
  function drawFinishBrakingZone(){
    const begin=FINISH-BRAKE_ZONE;
    if(begin>cameraX+W+250||FINISH<cameraX-200)return;
    // Muted, street-level rumble bands give the driver a deceleration cue
    // without five identical giant billboards hanging over the scenery.
    for(const dd of [170,410,665,930,1200,1450]){
      const x=begin+dd;
      if(x<cameraX-110||x>cameraX+W+110)continue;
      const y=groundAt(x);if(y==null)continue;
      ctx.save();ctx.translate(x,y);
      ctx.strokeStyle='rgba(234,213,171,.50)';ctx.lineWidth=3.5;ctx.lineCap='round';
      for(const j of [-1,0,1]){
        const dx=j*11;
        ctx.beginPath();ctx.moveTo(dx-5,-48);ctx.lineTo(dx+5,-32);ctx.stroke();
      }
      ctx.restore();
    }
    // Only two prepare-to-stop signs: keep the braking cue clean and readable.
    for(const spec of [{x:begin+270,words:['SÄNK','FARTEN'],w:104,theme:'warn'},
                       {x:FINISH-620,words:['MÄLAREN','STOPP'],w:120,theme:'warn'}]){
      const x=spec.x,gy=groundAt(x);
      if(gy==null||x<cameraX-180||x>cameraX+W+180)continue;
      ctx.save();ctx.translate(x,gy-82);
      drawRoadSignBoard(spec.words,spec.w,spec.theme,false);
      ctx.restore();
    }
    // The finish is a restrained road-maintenance barricade. No cartoon post or
    // floating warning board; the feet and ballast rest on the asphalt.
    const ground=groundAt(FINISH);if(ground==null)return;
    window.BearlyStreetProps.draw(ctx,'barrier',FINISH,ground,162,time);
  }

  // 2.5D scenery: shared ground elevation, but multiple projected depth layers.
  // This DOES NOT alter the side-scrolling collision plane or world coordinates.
  const branchStreets=[3700,7660,11300,14600,18220,20140].map(stretchX);
  function drawRecedingStreets(){
    // v5.7: The old giant trapezoid junctions clashed with the illustrated
    // landscape. Side streets now exist only as authored scenery imagery.
  }
  function drawRoadDeck(){
    // The rider's wheels remain on groundAt(x); the visible road extends BEHIND and in front.
    const lo=Math.max(0,Math.floor((cameraX-95)/18)*18),hi=Math.min(FINISH+1600,cameraX+W+115);
    if(hi<=lo)return;
    const points=[];for(let x=lo;x<=hi;x+=18){const y=groundAt(x);if(y!==null)points.push([x,y]);}
    if(points.length<2)return;
    const surface=ctx.createLinearGradient(0,points[0][1]-85,0,points[0][1]+65);
    surface.addColorStop(0,'#cfc0ae');surface.addColorStop(.43,'#b7aaa1');surface.addColorStop(.78,'#867e7a');surface.addColorStop(1,'#5e6770');
    ctx.fillStyle=surface;ctx.beginPath();for(let i=0;i<points.length;i++){const [x,y]=points[i];i===0?ctx.moveTo(x,y-77):ctx.lineTo(x,y-77);}
    for(let i=points.length-1;i>=0;i--){const [x,y]=points[i];ctx.lineTo(x,y+33);}ctx.closePath();ctx.fill();
    // Vertical thickness on near face: world-projected cobbles instead of a flat line.
    const lip=ctx.createLinearGradient(0,points[0][1]+25,0,points[0][1]+85);
    lip.addColorStop(0,'#a48c78');lip.addColorStop(1,'#625d58');ctx.fillStyle=lip;ctx.beginPath();
    for(let i=0;i<points.length;i++){const [x,y]=points[i];i===0?ctx.moveTo(x,y+34):ctx.lineTo(x,y+34);}
    for(let i=points.length-1;i>=0;i--){const [x,y]=points[i];ctx.lineTo(x,y+70);}ctx.closePath();ctx.fill();
    for(const [depth,width,color] of [[-78,5,'#ece1c9'],[-65,2,'#e1c6a7'],[32,6,'#debd98'],[69,3,'#564f4e']]){
      ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();for(let i=0;i<points.length;i++){
        const [x,y]=points[i];i===0?ctx.moveTo(x,y+depth):ctx.lineTo(x,y+depth);
      }ctx.stroke();
    }
    // Road markings slant parallel to road grade, no repetitive flat horizontal strips.
    ctx.strokeStyle='#f8e5bb';ctx.lineWidth=4;for(let x=Math.floor(lo/200)*200;x<hi;x+=200){
      const a=groundAt(x),b=groundAt(x+70);if(a==null||b==null)continue;
      ctx.beginPath();ctx.moveTo(x,a-29);ctx.lineTo(x+70,b-29);ctx.stroke();
    }
    // Surface seams on the near curb create a sense of material thickness.
    ctx.strokeStyle='#544a4944';ctx.lineWidth=2;for(let x=Math.floor(lo/95)*95;x<hi;x+=95){
      const y=groundAt(x);if(y==null)continue;ctx.beginPath();ctx.moveTo(x,y+36);ctx.lineTo(x-11,y+69);ctx.stroke();
    }
  }
  function v129LeftMetroApproach(x){
    const metroX=stretchX(7550);
    // Widen the protected metro corridor so alternating grass/fence passes
    // cannot stack over the same curb positions just left of the station.
    return x>metroX-1580 && x<metroX+90;
  }
  function v129MetroBuffer(x,pad=0){
    return Math.abs(x-V116_METRO.x)<V116_METRO.w*.72+pad;
  }

  function drawFarRailings(){
    // Railings belong to short stretches, not every 160px for 42 kilometres.
    const first=Math.floor((cameraX-320)/1630)-1;
    for(let section=first;section<first+4;section++){
      if(sceneryHash(section,92)<.48)continue;
      const base=section*1630+120+sceneryHash(section,12)*240;
      const posts=3+Math.floor(sceneryHash(section,7)*3),step=123;
      for(let k=0;k<posts;k++){
        const x=base+k*step;if(x<0||x>FINISH||x<cameraX-220||x>cameraX+W+220)continue;
        if(x>stretchX(5460)&&x<stretchX(8470))continue;
        if(v129LeftMetroApproach(x) || v129MetroBuffer(x,240))continue;
        const y=groundAt(x),ny=groundAt(x+step);if(y===null)continue;
        ctx.save();ctx.globalAlpha=.53;ctx.strokeStyle='#75807a';ctx.lineWidth=5;
        ctx.beginPath();ctx.moveTo(x,y-77);ctx.lineTo(x,y-131);ctx.stroke();
        if(k<posts-1&&ny!==null){ctx.strokeStyle='#c5c6b9';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(x,y-130);ctx.lineTo(x+step,ny-130);ctx.moveTo(x,y-105);ctx.lineTo(x+step,ny-105);ctx.stroke();}
        ctx.restore();
      }
    }
  }
  // v10.53: Shadow/contact alignment. The former wide, pooled oval was
  // centred 14px below the road contact and looked like the bike hovered.
  // Ground shadows track both actual tire positions; flight gets a subtler
  // single projected shadow. No physics, wheel rig or road geometry changes.
  function drawGroundedBikeShadow(){
    if(!bike || bike.broken)return; // The crashed-bike art has its own road shadow.
    const wheels=[wheelPos(riderX(REAR_X)),wheelPos(riderX(FRONT_X))];
    const feet=[];
    for(const w of wheels){
      const ground=groundAt(w.x);
      if(ground===null)continue;
      feet.push({x:w.x,y:ground,gap:Math.max(0,ground-(w.y+TIRE_R))});
    }
    if(!feet.length)return;
    const clearance=Math.min(...feet.map(w=>w.gap));
    const onRoad=bike.contact && clearance<10;
    ctx.save();ctx.fillStyle='#202a32';
    if(onRoad){
      // Individual tyre contact patches, aligned with the sloping asphalt.
      for(const foot of feet){
        const strength=clamp((10-foot.gap)/10,0,1);
        if(strength<=0)continue;
        ctx.save();ctx.translate(foot.x,foot.y+1.7);ctx.rotate(slopeAt(foot.x));
        ctx.globalAlpha=.23*strength;
        ctx.beginPath();ctx.ellipse(0,0,21,3.2,0,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=.12*strength;
        ctx.beginPath();ctx.ellipse(0,1,29,5.7,0,0,Math.PI*2);ctx.fill();
        ctx.restore();
      }
      // A restrained ambient shade connects the tires without a black pool.
      if(feet.length===2){
        const centerX=(feet[0].x+feet[1].x)*.5;
        const centerY=(feet[0].y+feet[1].y)*.5;
        ctx.save();ctx.translate(centerX,centerY+3);ctx.rotate(slopeAt(centerX));
        ctx.globalAlpha=.055;
        ctx.beginPath();ctx.ellipse(0,0,48,5.5,0,0,Math.PI*2);ctx.fill();
        ctx.restore();
      }
    }else{
      const centerX=(feet[0].x+feet[feet.length-1].x)*.5;
      const baseY=feet.reduce((n,w)=>n+w.y,0)/feet.length;
      const spread=clamp(clearance,0,190);
      ctx.save();ctx.translate(centerX,baseY+3);ctx.rotate(slopeAt(centerX));
      ctx.globalAlpha=.11*clamp(1-spread/240,.18,1);
      ctx.beginPath();ctx.ellipse(0,0,43+spread*.14,6+spread*.035,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // V10.9 • ENVIRONMENT COMPOSITION • depth restored from the concept art.
  // Every decorative element has a persistent world coordinate and a terrain foot.
  // No screen-edge scaling, repeated full-width background image or floating planters.
  const v108Audits={trees:0,fencePosts:0,nearBeds:0,lensBeds:0,invalidFoot:0,nearSizeErrors:0};
  const v108TreeSprites=[];
  const v108TreeHomes=[];
  function v108Rng(seed){let n=(seed>>>0)||1;return ()=>{n^=n<<13;n^=n>>>17;n^=n<<5;return (n>>>0)/4294967296;};}
  // V10.9 tree artwork: solid painterly crowns, readable fine leaves,
  // asymmetric branch architecture, warm rim light. Draw once to offscreen sprites.
  function v108BuildTree(variant){
    const random=v108Rng(0xA7C83+variant*98763);
    const cv=document.createElement('canvas');cv.width=440;cv.height=480;
    const c=cv.getContext('2d'), warm=variant===1||variant===3||variant===5;
    const greens=warm?['#3e644e','#57734b','#7f874f','#9f995b','#c8b576','#e1ca82']:
      ['#355c50','#426c54','#5e7e60','#799975','#a6b17c','#ddc982'];
    const crownX=217+(random()-.5)*40, crownY=185+(random()-.5)*17;
    const shapeW=139+random()*31, shapeH=137+random()*20;
    const slant=(random()-.5)*14;
    // Branch geometry uses visible forks and trunk-root taper.
    c.lineCap='round';
    c.strokeStyle='#494b3d';c.lineWidth=18;
    c.beginPath();c.moveTo(219,471);c.bezierCurveTo(211,364,212+slant,258,crownX,129);c.stroke();
    c.strokeStyle='#97775c';c.lineWidth=5;c.beginPath();c.moveTo(215,462);c.quadraticCurveTo(209,297,crownX-2,130);c.stroke();
    for(let i=0;i<12;i++){
      const ang=i*2.399+random()*.24,rx=Math.cos(ang)*130,ry=Math.sin(ang)*112;
      const x=crownX+rx,y=crownY+ry;
      c.strokeStyle=i%3===0?'#786e4c':'#555842';c.lineWidth=3+random()*5;
      c.beginPath();c.moveTo(214,340+random()*42);c.quadraticCurveTo(crownX+rx*.27,crownY+90,x,y);c.stroke();
      c.strokeStyle='#8d8664';c.lineWidth=1.3;c.beginPath();c.moveTo(crownX+rx*.45,crownY+60);c.lineTo(x,y);c.stroke();
    }
    // True asymmetric canopy lobes (one solid silhouette, not overlapping bubbles).
    const bumps=[.96,1.01,.90,.83,.88,1.10,1.05,.95,1.08,.91,1.04,.90];
    c.beginPath();
    for(let i=0;i<160;i++){
      const a=2*Math.PI*i/160,sector=Math.floor(i/160*bumps.length);
      const r=bumps[sector]+.065*Math.sin(a*11+variant)+.04*Math.sin(a*19+variant*.9)+.045*(random()-.5);
      const xx=crownX+shapeW*Math.cos(a)*r,yy=crownY+shapeH*Math.sin(a)*r;
      i?c.lineTo(xx,yy):c.moveTo(xx,yy);
    }
    c.closePath();
    const fill=c.createLinearGradient(crownX-130,crownY-150,crownX+125,crownY+125);
    fill.addColorStop(0,greens[4]);fill.addColorStop(.27,greens[3]);fill.addColorStop(.62,greens[2]);fill.addColorStop(1,greens[0]);
    c.fillStyle=fill;c.fill();
    // Thousands of micro leaves: richer, brighter sun-side clusters and
    // darker internal gaps, not translucent circular overlapping canopies.
    for(let i=0;i<4400;i++){
      const theta=random()*6.2832, r=Math.sqrt(random());
      const px=crownX+Math.cos(theta)*shapeW*r*.96,py=crownY+Math.sin(theta)*shapeH*r*.96;
      const left=(crownX-px)/shapeW,top=(crownY-py)/shapeH;
      let tint=Math.max(0,Math.min(5,Math.floor(1.3+1.5*left+1.0*top+random()*2.4)));
      if(i%9===0)tint=Math.max(0,tint-1);
      c.globalAlpha=.41+random()*.54;c.fillStyle=greens[tint];
      const width=1.25+random()*4.0,height=.8+random()*2.2;
      c.save();c.translate(px,py);c.rotate(-.8+random()*1.7);
      c.beginPath();c.ellipse(0,0,width,height,0,0,6.2832);c.fill();c.restore();
    }
    // Irregular lit wisps around edges make the treetop feel botanical rather
    // than like a flat clipped object.
    for(let i=0;i<850;i++){
      const a=random()*Math.PI*2,r=.88+random()*.23;
      const px=crownX+Math.cos(a)*shapeW*r,py=crownY+Math.sin(a)*shapeH*r;
      const tint=(px<crownX&&py<crownY)?4:Math.floor(random()*4);
      c.globalAlpha=.35+random()*.45;c.fillStyle=greens[tint];
      c.beginPath();c.ellipse(px,py,1+random()*3,.6+random()*2,a+.3,0,6.2832);c.fill();
    }
    c.globalAlpha=1;
    // Soft roots and occasional tiny highlights ground the tree.
    c.fillStyle='#52634c';c.globalAlpha=.65;
    c.beginPath();c.ellipse(217,473,24,4,0,0,6.283);c.fill();c.globalAlpha=1;
    return cv;
  }
  // The active painted world supplies its own trees. Build archived V108
  // micro-leaf sprites only if an archived drawing path actually requests one.
  function v108TreeSprite(variant){return v108TreeSprites[variant]||(v108TreeSprites[variant]=v108BuildTree(variant));}
  // Orchard/courtyard groups are assigned once, not at a repeating camera interval.
  // Clear the Hässelby Gård station's sightline and the major shopfronts.
  for(let n=0,x=270;x<FINISH-420;n++){
    const zone=v105DistrictAt(x),chance=v105Seed(73,n);
    const busy=(x>stretchX(7050)&&x<stretchX(8050))||
      (x>stretchX(5560)&&x<stretchX(6800))||
      (x>stretchX(8050)&&x<stretchX(8560));
    if(!busy&&chance>.20){
      const h=204+v105Seed(33,n)*94;
      v108TreeHomes.push({x:x+v105Seed(35,n)*96,h,zone,variant:Math.floor(v105Seed(49,n)*6),
        alpha:zone==='forest'?.95:zone==='lake'?.83:.92,
        crown:v105Seed(19,n)});
    }
    x+=280+v105Seed(47,n)*260+(zone==='lake'?210:0);
  }
  // Painted trees just behind the rear kerb and in FRONT of the far city panorama.
  // Rendered under the sidewalk, station and gameplay; can never obscure the rider.
  function v108DrawCourtyardTrees(){
    v108Audits.trees=0;
    ctx.save();ctx.translate(-cameraX,-cameraY);
    for(const p of v108TreeHomes){
      const width=p.h*.93;
      if(p.x+width<cameraX-100||p.x-width>cameraX+W+100)continue;
      if(v129LeftMetroApproach(p.x) || v129MetroBuffer(p.x,270))continue;
      const gy=groundAt(p.x);if(!Number.isFinite(gy)){v108Audits.invalidFoot++;continue;}
      // Tree roots are always embedded behind the far pavement at gy-102.
      const img=v108TreeSprite(p.variant);
      ctx.save();ctx.translate(p.x,gy-104);
      ctx.globalAlpha=p.alpha;
      ctx.filter=p.zone==='forest'?'saturate(.92) contrast(1.02)':'saturate(.89) contrast(1.02)';
      const a=(p.crown>.51?-1:1);ctx.scale(a,1);
      ctx.drawImage(img,-width*.5,-p.h,width,p.h);
      ctx.restore();v108Audits.trees++;
    }
    ctx.restore();
  }
  function v108RearGardenStructures(){
    // Courtyard railings are local, hand-curated passages, not a continuous fence.
    v108Audits.fencePosts=0;
    for(let sector=0;sector<Math.ceil(FINISH/1250);sector++){
      if(v105Seed(63,sector)<.43)continue;
      const zone=v105DistrictAt(sector*1250);
      if(zone==='forest'||zone==='lake')continue;
      const begin=sector*1250+195+v105Seed(62,sector)*180;
      const end=begin+360+v105Seed(64,sector)*190;
      if(end<cameraX-60||begin>cameraX+W+60)continue;
      if(v129LeftMetroApproach(begin)||v129LeftMetroApproach((begin+end)*.5)||v129LeftMetroApproach(end)
        || v129MetroBuffer(begin,250) || v129MetroBuffer((begin+end)*.5,250) || v129MetroBuffer(end,250))continue;
      if((begin<stretchX(8000)&&end>stretchX(6900))||
         (begin<stretchX(6770)&&end>stretchX(5700)))continue;
      ctx.save();ctx.strokeStyle='#52605b';ctx.lineCap='round';
      for(let x=begin;x<=end;x+=47){
        const gy=groundAt(x);if(gy===null)continue;
        const base=gy-103;
        ctx.globalAlpha=.68;
        ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,base);ctx.lineTo(x,base-52);ctx.stroke();
        ctx.fillStyle='#435e5c';ctx.beginPath();ctx.arc(x,base-53,2.5,0,7);ctx.fill();
        v108Audits.fencePosts++;
      }
      for(const offset of [18,45]){
        ctx.strokeStyle=offset===18?'#71867c':'#536c68';ctx.lineWidth=3;
        ctx.beginPath();for(let x=begin;x<=end;x+=16){
          const gy=groundAt(x);if(gy===null)continue;
          const y=gy-103-offset;
          if(x===begin)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }ctx.stroke();
      }
      ctx.restore();
    }
  }
  // Soft world-locked contours/flower dots remove the sterile solid-green apron.
  // They are painted on the same ground mesh as the front kerb (not HUD strips).
  function v108MeadowMaterial(){
    ctx.save();
    for(let n=Math.floor((cameraX-270)/92);n<Math.ceil((cameraX+W+270)/92);n++){
      const x=n*92+v105Seed(31,n)*45;
      const gy=groundAt(x);if(gy===null)continue;
      const patch=67+v105Seed(30,n)*325;
      const r=v105Seed(32,n);
      ctx.globalAlpha=.05+.06*r;
      ctx.fillStyle=r>.57?'#f6d9a6':'#304f43';
      ctx.beginPath();ctx.ellipse(x,gy+patch,9+r*18,1.2+r*2,0,0,Math.PI*2);ctx.fill();
      // three tiny, softly graded grass stems in each curated 92-unit world cell.
      if(v105Seed(34,n)>.35){
        ctx.globalAlpha=.20;ctx.strokeStyle=r>.55?'#b1b486':'#3f755a';ctx.lineWidth=1.2;
        const sy=gy+88+v105Seed(37,n)*275;
        ctx.beginPath();ctx.moveTo(x,sy);ctx.quadraticCurveTo(x-5,sy-8,x-7,sy-12);
        ctx.moveTo(x,sy);ctx.quadraticCurveTo(x+4,sy-10,x+7,sy-15);ctx.stroke();
      }
    }
    ctx.restore();
  }
  function v108PaintNearGardenBeds(){
    // An intermediate continuous *rhythm* of picture-quality painted hedges.
    // Not tiles: intentionally intermittent and composed of varied original art.
    v108Audits.nearBeds=0;
    const project=(x,d)=>cameraX+W*.46+(x-cameraX-W*.46)*d;
    for(let n=0,x=130;x<FINISH-200;n++){
      const sx=project(x,1.11),base=envGroundAtDrawnX(sx,x);
      const variant=(n*3+Math.floor(v105Seed(84,n)*5))%6;
      const im=images['v99_front_'+variant];
      const width=240+v105Seed(85,n)*132;
      const height=width*im?.naturalHeight/im?.naturalWidth;
      if(im?.naturalWidth&&base!==null&&sx>cameraX-width&&sx<cameraX+W+width){
        const foot=base+151;
        // The top edge never crosses the road's front lip (gy+69).
        const h=Math.min(height,foot-(base+77));
        const w=h*im.naturalWidth/im.naturalHeight;
        ctx.save();ctx.globalAlpha=.80;
        ctx.fillStyle='rgba(37,64,51,.13)';ctx.beginPath();ctx.ellipse(sx,foot-2,w*.38,6,0,0,7);ctx.fill();
        ctx.drawImage(im,sx-w*.5,foot-h,w,h);
        ctx.restore();v108Audits.nearBeds++;
      }
      // Relaxed uneven spacing and rest areas, based on world units.
      x+=440+v105Seed(86,n)*360;
    }
  }
  function v108NearLensFlowers(){
    // Lens-side shrubs appear at the bottom of the frame and are intentionally
    // CLIPPED by the viewport; the world base is stable even on the steepest hill.
    v108Audits.lensBeds=0;
    const project=(x,d)=>cameraX+W*.46+(x-cameraX-W*.46)*d;
    for(let n=0,x=340;x<FINISH-200;n++){
      const sx=project(x,2.48),gy=envGroundAtDrawnX(sx,x);
      const variant=(n*5+Math.floor(v105Seed(91,n)*6))%12;
      const zone=v105DistrictAt(x);
      const im=images['v105_'+zone+'_verge_'+variant];
      if(im?.naturalWidth&&gy!==null){
        const h=119+v105Seed(92,n)*57;
        const w=h*im.naturalWidth/im.naturalHeight;
        if(sx+w*.5>cameraX-75&&sx-w*.5<cameraX+W+75){
          ctx.save();ctx.globalAlpha=.93;
          ctx.drawImage(im,sx-w*.5,gy+440-h,w,h);ctx.restore();
          v108Audits.lensBeds++;
        }
      }
      x+=430+v105Seed(93,n)*430;
    }
  }

  // V10.10: GARDEN-TO-RESIDENTIAL DEPTH / STATION COURTYARD.
  // Designed compositions at fixed WORLD anchors, not a repeating viewport strip.
  // Each planting group shares actual grade with the ground/curb at its own x.
  const v110MetroX=stretchX(7550);
  const v110CourtyardPlan=[
    [380,360,0],[1240,400,2],[2240,440,1],[3170,300,0],
    [4210,450,2],[5120,270,1],[6520,300,0],
    [8350,330,1],[9060,410,0],[10470,460,2],[11920,325,1],
    [13360,450,0],[15100,305,2],[17660,360,1],[19050,405,0],
    [21300,375,1],[23500,390,0],[25370,445,2]
  ].map(([xx,ww,mood],i)=>({x:stretchX(xx),w:ww*(.90+.18*v105Seed(240,i)),mood,i}));
  const v110MetroGrove=[
    {x:v110MetroX-860,h:142,kind:'maple',variant:2},
    {x:v110MetroX-475,h:240,kind:'maple',variant:5},
    {x:v110MetroX+470,h:244,kind:'maple',variant:0},
    {x:v110MetroX+890,h:146,kind:'maple',variant:3}
  ];
  const v110Audit={courtyards:0,frontFlowers:0,groveTrees:0,midShrubs:0,invalidGround:0,entranceClear:true};
  function v110GradePath(x0,x1,offset){
    ctx.beginPath();for(let i=0;i<=22;i++){
      const x=x0+(x1-x0)*i/22,y=groundAt(x);
      if(!Number.isFinite(y)){v110Audit.invalidGround++;continue;}
      if(i)ctx.lineTo(x,y+offset);else ctx.moveTo(x,y+offset);
    }
  }
  // Soft planted terrain beds: anchored on the REAR side of the pavement.
  // Distinct patches and paths, each with a different silhouette and negative space.
  function v110DrawMidDistance(){
    v110Audit.courtyards=0;v110Audit.groveTrees=0;v110Audit.midShrubs=0;
    ctx.save();ctx.translate(-cameraX,-cameraY);
    for(const g of v110CourtyardPlan){
      if(g.x+g.w<cameraX-220||g.x>cameraX+W+220)continue;
      if(Math.abs(g.x-v110MetroX)<425)continue;
      const z=v105DistrictAt(g.x),begin=g.x,end=g.x+g.w;
      if(z==='forest')continue;
      v110Audit.courtyards++;
      // The shallow, irregular retaining terrace is visibly ATTACHED to slope.
      ctx.save();
      const earth=ctx.createLinearGradient(0,(groundAt(g.x)??420)-230,0,(groundAt(g.x)??420)-108);
      earth.addColorStop(0,'rgba(130,145,113,0)');
      earth.addColorStop(.48,'rgba(111,139,99,.18)');
      earth.addColorStop(1,'rgba(63,95,71,.32)');
      ctx.beginPath();
      for(let k=0;k<=24;k++){
        const x=begin+(end-begin)*k/24,gy=groundAt(x);
        if(!Number.isFinite(gy))continue;
        const taper=Math.pow(Math.sin(Math.PI*k/24),.8);
        k?ctx.lineTo(x,gy-126-24*taper):ctx.moveTo(x,gy-126);
      }
      for(let k=24;k>=0;k--){const x=begin+(end-begin)*k/24,gy=groundAt(x);
        if(Number.isFinite(gy))ctx.lineTo(x,gy-103);}
      ctx.closePath();ctx.fillStyle=earth;ctx.fill();
      // Thin retaining-stone edges are discontinuous so the level never has a
      // tiled stone wall running from one district into the next.
      if(g.mood!==2){
        v110GradePath(begin+17,end-18,-121);
        ctx.lineWidth=3;ctx.strokeStyle='rgba(197,173,139,.49)';ctx.stroke();
        v110GradePath(begin+19,end-20,-116);
        ctx.lineWidth=2;ctx.strokeStyle='rgba(73,81,71,.24)';ctx.stroke();
        for(let n=1;n<=3;n++){
          const xx=begin+g.w*n/4,yy=groundAt(xx);
          if(!Number.isFinite(yy))continue;
          ctx.strokeStyle='rgba(82,84,74,.22)';ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(xx,yy-121);ctx.lineTo(xx-2,yy-108);ctx.stroke();
        }
      }
      // Tiny garden partition in selected pockets: short, broken metal lattice
      // with occasional climbers, unlike a continuous row of identical railings.
      if(g.mood===1){
        const from=begin+25,to=begin+g.w*.62;
        ctx.strokeStyle='rgba(76,89,78,.47)';ctx.lineWidth=2;
        for(let t=0;t<2;t++){
          ctx.beginPath();for(let k=0;k<=16;k++){
            const xx=from+(to-from)*k/16,yy=groundAt(xx);
            if(!Number.isFinite(yy))continue;
            k?ctx.lineTo(xx,yy-145-t*23):ctx.moveTo(xx,yy-145-t*23);
          }ctx.stroke();
        }
        for(let k=0;k<=5;k++){
          const xx=from+(to-from)*k/5,yy=groundAt(xx);
          if(!Number.isFinite(yy))continue;
          ctx.beginPath();ctx.moveTo(xx,yy-121);ctx.lineTo(xx,yy-170);ctx.stroke();
          if(k===1||k===4){
            ctx.fillStyle='rgba(138,161,97,.47)';
            for(let leaf=0;leaf<3;leaf++){
              ctx.beginPath();ctx.ellipse(xx+5+leaf*2,yy-129-leaf*12,6,3,.46,0,Math.PI*2);ctx.fill();
            }
          }
        }
      }
      // Individual tall accent shrubs behind the already-planted garden.
      // Mixed heights, generous spaces and genuine sprite proportions.
      const count=4+(g.mood===2?1:0);
      for(let j=0;j<count;j++){
        const u=(j+.42+.17*v105Seed(243,j,g.i))/count;
        const xx=begin+u*g.w,gy=groundAt(xx);
        if(!Number.isFinite(gy)){v110Audit.invalidGround++;continue;}
        const variant=Math.floor(v105Seed(244,j,g.i)*10),art=images['v105_'+z+'_rear_'+variant];
        if(!art?.naturalWidth)continue;
        const taper=.70+.3*Math.sin(Math.PI*u);
        const h=(48+v105Seed(245,j,g.i)*40)*taper;
        const w=h*art.naturalWidth/art.naturalHeight;
        // Actual curb-root is ground-103, not ground-125. Old offset made
        // the flowers float through the top half of the rear fence.
        ctx.save();ctx.translate(xx,gy-95);ctx.globalAlpha=.89;
        ctx.filter='saturate(.92) contrast(.99)';
        if(v105Seed(246,j,g.i)>.51)ctx.scale(-1,1);
        ctx.drawImage(art,-w/2,-h,w,h);
        ctx.restore();v110Audit.midShrubs++;
      }
      // Only some courtyards gain a smaller tree between housing and gardens;
      // others stay open, preserving sky, windows and residential views.
      if(g.mood!==1){
        const xx=begin+g.w*(g.mood===0?.26:.72),gy=groundAt(xx);
        if(Number.isFinite(gy)){
          const im=v108TreeSprite((g.i+2)%6),h=119+v105Seed(247,g.i)*50,w=h*.93;
          ctx.save();ctx.translate(xx,gy-102);ctx.globalAlpha=.86;
          ctx.filter='saturate(.81) contrast(.98)';
          if(g.i%2)ctx.scale(-1,1);
          ctx.drawImage(im,-w*.5,-h,w,h);ctx.restore();
        }
      }
      ctx.restore();
    }
    // The METRO GROVE is composed as two side groups. Tree centers and their
    // canopy edges stay clear of the sign and below the main T symbol.
    for(const t of v110MetroGrove){
      if(t.x+t.h<cameraX-120||t.x-t.h>cameraX+W+120)continue;
      const gy=groundAt(t.x);
      if(!Number.isFinite(gy)){v110Audit.invalidGround++;continue;}
      const im=v108TreeSprite(t.variant),width=t.h*.93;
      ctx.save();ctx.translate(t.x,gy-110);ctx.globalAlpha=.93;
      ctx.filter='saturate(.88) contrast(1.01)';
      if(t.x>v110MetroX)ctx.scale(-1,1);
      // A natural contact shadow, never a large pale round disk.
      ctx.fillStyle='rgba(47,72,58,.21)';ctx.beginPath();ctx.ellipse(0,0,width*.3,5,0,0,Math.PI*2);ctx.fill();
      ctx.drawImage(im,-width/2,-t.h,width,t.h);
      ctx.restore();v110Audit.groveTrees++;
    }
    ctx.restore();
  }
  // A few flowering banks directly outside the station plaza. These sit BEHIND
  // the sidewalk and do not paint over the entrance or across the near curb.
  const v110MetroBorders=[
    {x:v110MetroX-730,w:230,seed:11},
    {x:v110MetroX-423,w:125,seed:19},
    {x:v110MetroX+422,w:123,seed:23},
    {x:v110MetroX+740,w:240,seed:29}
  ];
  function v110DrawMetroBorders(){
    v110Audit.frontFlowers=0;
    for(const p of v110MetroBorders){
      if(p.x+p.w<cameraX-140||p.x-p.w>cameraX+W+140)continue;
      const left=p.x-p.w*.5,right=p.x+p.w*.5;
      // Planting bed is tapered at either end and tracks the grade closely.
      ctx.save();ctx.beginPath();
      for(let j=0;j<=18;j++){
        const xx=left+(right-left)*j/18,gy=groundAt(xx);
        if(!Number.isFinite(gy))continue;
        j?ctx.lineTo(xx,gy-112-5*Math.sin(Math.PI*j/18)):ctx.moveTo(xx,gy-119);
      }
      for(let j=18;j>=0;j--){const xx=left+(right-left)*j/18,gy=groundAt(xx);
        if(Number.isFinite(gy))ctx.lineTo(xx,gy-98);}
      ctx.closePath();ctx.fillStyle='rgba(60,87,65,.32)';ctx.fill();
      const pieces=p.w>200?4:2;
      for(let j=0;j<pieces;j++){
        const u=(j+.48)/pieces,xx=left+p.w*u,gy=groundAt(xx);
        if(!Number.isFinite(gy)){v110Audit.invalidGround++;continue;}
        const z='metro',variant=Math.floor(v105Seed(252,p.seed,j)*10);
        const im=images['v105_'+z+'_rear_'+variant];
        if(!im?.naturalWidth)continue;
        const h=39+v105Seed(254,p.seed,j)*30,w=h*im.naturalWidth/im.naturalHeight;
        ctx.save();ctx.translate(xx,gy-98);ctx.transform(1,v107GroundGrade(xx,w),0,1,0,0);
        ctx.globalAlpha=.95;ctx.filter='saturate(1.04) contrast(1.03)';
        if(j%2)ctx.scale(-1,1);
        ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();v110Audit.frontFlowers++;
      }
      ctx.restore();
    }
  }
  // QA can assert that foliage buffers do not invade the station's central
  // sign corridor, while the original landmark remains at its approved anchor.
  v110Audit.entranceClear=v110MetroGrove.every(t=>Math.abs(t.x-v110MetroX)-t.h*.47>325)
    &&v110MetroBorders.every(b=>Math.abs(b.x-v110MetroX)-b.w*.5>325);
  // V10.9: garden composition pass — distinct planted COURTYARDS rather than
  // scattered isolated bushes or a repeating full-width hedge strip.
  // World geometry is created once; all stems, retaining edges, and companions
  // share local curb grade and stable world coordinates at any camera position.
  const v109Gardens=[];
  const v109Audit={visibleGardens:0,visiblePlants:0,visibleSaplings:0,frontTufts:0,invalidFeet:0,stationExclusions:0};
  function v109ProtectedCorridor(x){
    return (x>stretchX(7060)&&x<stretchX(8030)) ||
      (x>stretchX(5650)&&x<stretchX(6770)) ||
      (x>stretchX(8070)&&x<stretchX(8470));
  }
  // Contrasting spacious and dense pockets. Each has a distinct named visual beat:
  // tended flower garden, untidy hedge, or open courtyard with accent tree.
  for(let sector=0,x=90;x<FINISH-230;sector++){
    const zone=v105DistrictAt(x);
    const roll=v105Seed(121,sector),size=700+v105Seed(122,sector)*380;
    if(!v109ProtectedCorridor(x+300) &&
       !(zone==='lake'&&roll<.62) &&
       !(zone==='forest'&&roll<.34) && roll>.19){
      const width=roll>.77?475+v105Seed(123,sector)*200:250+v105Seed(124,sector)*230;
      const start=x+v105Seed(125,sector)*105;
      const type=(sector+Math.floor(v105Seed(126,sector)*3))%3;
      if(!v109ProtectedCorridor(start+width*.5)){
        const plants=[];
        // Overlap foliage inside islands; edges taper to short plants.
        let curr=start+26,pi=0;
        while(curr<start+width-20){
          const u=(curr-start)/width;
          const edge=Math.pow(Math.sin(Math.PI*u),.5);
          const h=(type===1?44:37)+edge*(42+v105Seed(127,pi,sector)*29);
          const w=h*(2.1+v105Seed(128,pi,sector)*.9);
          const variant=(Math.floor(v105Seed(129,pi,sector)*10)+(type===0?3:0))%10;
          plants.push({x:curr,w,h,variant,flip:v105Seed(130,pi,sector)>.5,zone});
          curr+=67+v105Seed(131,pi,sector)*41;pi++;
        }
        v109Gardens.push({start,end:start+width,zone,sector,type,plants,
          bloom:v105Seed(132,sector),hasSapling:type!==2&&v105Seed(133,sector)>.43});
      }else v109Audit.stationExclusions++;
    }
    x+=size;
  }
  function v109GardenPaths(){
    v109Audit.visibleGardens=0;v109Audit.visiblePlants=0;v109Audit.visibleSaplings=0;
    for(const g of v109Gardens){
      if(g.end<cameraX-250||g.start>cameraX+W+250)continue;
      v109Audit.visibleGardens++;
      // A shallow connected bed is tapered at both ends and follows the
      // natural foot of the FAR curb; it never jumps through slope changes.
      ctx.save();
      ctx.beginPath();
      for(let i=0;i<=32;i++){
        const x=g.start+(g.end-g.start)*i/32,gy=groundAt(x);
        if(!Number.isFinite(gy)){v109Audit.invalidFeet++;continue;}
        const edge=Math.sin(Math.PI*i/32);
        i?ctx.lineTo(x,gy-107-2*edge):ctx.moveTo(x,gy-114);
      }
      for(let i=32;i>=0;i--){
        const x=g.start+(g.end-g.start)*i/32,gy=groundAt(x);
        if(!Number.isFinite(gy)){v109Audit.invalidFeet++;continue;}
        const edge=Math.sin(Math.PI*i/32);
        ctx.lineTo(x,gy-96+6*edge);
      }
      ctx.closePath();
      ctx.fillStyle=g.type===0?'rgba(80,89,59,.31)':g.type===1?'rgba(66,88,60,.37)':'rgba(95,92,66,.27)';ctx.fill();
      // A broken and very fine stone lip, visually behind the painted sidewalk.
      if(g.type===0){
        ctx.strokeStyle='rgba(161,143,110,.52)';ctx.lineWidth=1.4;
        ctx.beginPath();
        for(let i=0;i<=32;i++){
          const x=g.start+(g.end-g.start)*i/32,gy=groundAt(x);
          i?ctx.lineTo(x,gy-97):ctx.moveTo(x,gy-97);
        }ctx.stroke();
      }
      // Visual filler plants have full alpha and preserved aspect ratio.
      // Grouped on the same bed, they connect to each other, not just to a dot.
      for(let pi=0;pi<g.plants.length;pi++){
        const q=g.plants[pi],gy=groundAt(q.x);
        if(!Number.isFinite(gy)){v109Audit.invalidFeet++;continue;}
        const im=images['v105_'+g.zone+'_rear_'+q.variant];
        if(!im?.naturalWidth)continue;
        const iw=q.h*im.naturalWidth/im.naturalHeight;
        ctx.save();ctx.translate(q.x,gy-98);ctx.transform(1,v107GroundGrade(q.x,iw),0,1,0,0);
        if(q.flip)ctx.scale(-1,1);
        ctx.globalAlpha=.94;ctx.filter='saturate(.95) contrast(1.01)';
        ctx.drawImage(im,-iw/2,-q.h,iw,q.h);ctx.restore();
        v109Audit.visiblePlants++;
      }
      // Accent saplings break height uniformity; some entrances remain visible.
      if(g.hasSapling){
        const x=g.start+(g.end-g.start)*(.32+.32*g.bloom),gy=groundAt(x);
        const canopy=images['v99_front_canopy'];
        if(Number.isFinite(gy)){
          // Reuse a fully illustrated smaller tree, not procedural leaf rings.
          const sprite=v108TreeSprite((g.sector+g.type)%6);
          const height=98+g.bloom*52,width=height*.93;
          ctx.save();ctx.translate(x,gy-101);
          if(g.sector%2)ctx.scale(-1,1);
          ctx.globalAlpha=.89;ctx.filter='saturate(.92) contrast(.99)';
          ctx.drawImage(sprite,-width/2,-height,width,height);
          ctx.restore();v109Audit.visibleSaplings++;
        }
      }
      ctx.restore();
    }
  }
  function v109FrontEdgeGroundcover(){
    // Short low groundcover at the back edge of the near verge; never crosses
    // the asphalt. Open gaps are deliberate and fully deterministic.
    v109Audit.frontTufts=0;
    const first=Math.floor((cameraX-250)/125)-1,last=Math.ceil((cameraX+W+250)/125)+1;
    for(let n=first;n<=last;n++){
      if(n<0||v105Seed(136,n)<.66)continue;
      // Tiny group runs, interrupted so the verge never becomes a hedge wall.
      const group=Math.floor(n/7);if(v105Seed(137,group)<.45)continue;
      const x=n*125+v105Seed(138,n)*83,gy=groundAt(x);
      if(!Number.isFinite(gy))continue;
      const variant=Math.floor(v105Seed(139,n)*6);
      const im=images['v99_front_'+variant];
      if(!im?.naturalWidth)continue;
      const h=18+v105Seed(140,n)*18,w=h*im.naturalWidth/im.naturalHeight;
      // the foot rests behind the main front garden patches, but BELOW kerb.
      ctx.save();ctx.globalAlpha=.56;ctx.drawImage(im,x-w/2,gy+106-h,w,h);ctx.restore();
      v109Audit.frontTufts++;
    }
  }
  // V10.9: CURATED WORLD SCENES. No alpha strips, per-screen opacity bands, ghost overlays,
  // or repeating grid. Every scene has an individually seeded identity and biome.
  const v105Rear=[], v105Verge=[], v105Close=[];
  const v105Rules={
    homes:{rear:10,verge:12,close:9,gap:425},
    metro:{rear:10,verge:12,close:9,gap:380},
    square:{rear:10,verge:12,close:9,gap:370},
    forest:{rear:10,verge:12,close:9,gap:315},
    lake:{rear:10,verge:12,close:9,gap:465}
  };
  function v105Seed(k,n,z){return sceneryHash(n*17+(z||0)*131,k*19+33);}
  function v105DistrictAt(x){return districtAt(Math.max(0,Math.min(FINISH-1,x))).style;}
  // Biome scene progression with *irregular* quiet/dense beats. Adjacent scenes
  // cannot reuse the same asset or the same width/height/spacing signature.
  for(let i=0,x=190;x<FINISH-150;i++){
    const zone=v105DistrictAt(x),cfg=v105Rules[zone]||v105Rules.homes;
    const beat=v105Seed(1,i),group=Math.floor(v105Seed(17,i)*cfg.rear);
    const width=220+v105Seed(2,i)*200;
    if(beat>.10 && (x<stretchX(7230)||x>stretchX(7850))){
      v105Rear.push({x:x+v105Seed(9,i)*95,zone,variant:group,w:width,
        h:45+v105Seed(11,i)*31,flip:beat>.56});
      // Support cluster, sometimes, but never a duplicate of the main sprite.
      if(v105Seed(12,i)>.55) v105Rear.push({x:x+width*.58,zone,
        variant:(group+3+Math.floor(v105Seed(13,i)*5))%cfg.rear,
        w:110+v105Seed(14,i)*90,h:34+v105Seed(15,i)*20,flip:true});
    }
    // Vegetation on camera-side verge: below the curb, not the road surface.
    if(v105Seed(3,i)>.19){v105Verge.push({x:x+40+v105Seed(7,i)*140,zone,
      variant:(group+Math.floor(v105Seed(8,i)*8))%cfg.verge,
      w:225+v105Seed(5,i)*135,h:90+v105Seed(6,i)*43,
      flip:v105Seed(23,i)>.5});}
    // Natural visual rhythm: light, medium, dense, open (not repetitive 1-2-3).
    const rest=v105Seed(16,i)>.77?230+v105Seed(29,i)*175:0;
    x+=cfg.gap*.68+v105Seed(4,i)*cfg.gap*.83+rest;
  }
  // Truly close foreground: occasional distinct bouquets and leafy forms.
  // World positions, not viewport pins: the bear's jump never changes their Y.
  for(let i=0,x=650;x<FINISH-300;i++){
    const zone=v105DistrictAt(x),cfg=v105Rules[zone]||v105Rules.homes;
    const wave=v105Seed(49,i);
    if(wave>.26) v105Close.push({x:x+v105Seed(50,i)*160,zone,
      variant:Math.floor(v105Seed(51,i)*cfg.close),
      w:370+v105Seed(53,i)*190,h:260+v105Seed(54,i)*90,
      flip:v105Seed(55,i)>.5});
    x+=335+v105Seed(56,i)*380;
  }
  // V10.9 production placement checks. All world scenery has a physical foot
  // and must be aligned to the terrain at its final RENDERED x coordinate.
  // Previous builds used groundAt(unprojected x), leaving bushes airborne on slopes.
  const envAudit={frames:0,rejected:0,anchorsChecked:0,corrections:0,metroContactPx:0,visibleNear:0,visibleClose:0,lastVisible:[]};
  function envGroundAtDrawnX(px,worldX){
    if(!Number.isFinite(px)||!Number.isFinite(worldX)){envAudit.rejected++;return null;}
    const y=groundAt(Math.max(0,Math.min(FINISH,px)));
    if(!Number.isFinite(y)){envAudit.rejected++;return null;}
    const previous=groundAt(worldX);
    if(Number.isFinite(previous)&&Math.abs(previous-y)>5)envAudit.corrections++;
    envAudit.anchorsChecked++;
    return y;
  }
  // Use the curb's actual grade across the sprite's footprint. A vertical
  // shear follows hills without stretching the painting or tilting its stems.
  function v107GroundGrade(x,span){
    const half=Math.max(18,Math.min(220,span*.37));
    const left=Math.max(0,x-half), right=Math.min(FINISH,x+half);
    const a=groundAt(left),b=groundAt(right);
    if(a===null||b===null||right<=left)return 0;
    return clamp((b-a)/(right-left),-.31,.31);
  }
  function v105DrawAsset(kind,p,px,foot,alpha=1){
    const img=images['v105_'+p.zone+'_'+kind+'_'+p.variant];
    if(!img?.naturalWidth)return false;
    if(!Number.isFinite(px)||!Number.isFinite(foot)||!Number.isFinite(p.w)||!Number.isFinite(p.h)||p.w<50||p.h<30){envAudit.rejected++;return false;}
    if(px+p.w*.6<cameraX-80||px-p.w*.6>cameraX+W+80)return false;
    const ground=groundAt(Math.max(0,Math.min(FINISH,px)));
    if(!Number.isFinite(ground)){envAudit.rejected++;return false;}
    const grade=kind==='rear'?v107GroundGrade(px,p.w):0;
    ctx.save();
    ctx.translate(px,foot);
    if(grade)ctx.transform(1,grade,0,1,0,0);
    // Contact shadow and artwork share one terrain-following basis.
    ctx.globalAlpha=.15;ctx.fillStyle='#3c5547';
    ctx.beginPath();ctx.ellipse(0,-1,Math.max(14,p.w*.26),Math.max(3,p.h*.033),0,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=alpha;
    if(p.flip)ctx.scale(-1,1);
    // Most source PNGs contain a small transparent lower margin; compensate
    // before applying the existing world-space anchor.
    const footPad=kind==='rear'?2.2:kind==='verge'?2.1:2.5;
    ctx.drawImage(img,-p.w*.5,-p.h+footPad,p.w,p.h);
    ctx.restore();
    return true;
  }
  // Validate the authored inventory once: no impossible anchors, duplicate
  // lookalikes too close, or lone bushes among otherwise coherent groupings.
  const v106PlacementIssues=[];
  function v106CheckPlacements(items,kind,minGap){
    const sorted=[...items].sort((a,b)=>a.x-b.x);
    let last=null;
    for(const p of sorted){
      const g=groundAt(p.x);
      if(!Number.isFinite(g)||p.x<0||p.x>FINISH||!Number.isFinite(p.w)||!Number.isFinite(p.h)){
        v106PlacementIssues.push(kind+' invalid position: '+p.x);continue;
      }
      if(last && p.variant===last.variant && p.zone===last.zone && p.x-last.x<minGap)
        v106PlacementIssues.push(kind+' adjacent duplicate at '+Math.round(p.x));
      last=p;
    }
  }
  v106CheckPlacements(v105Rear,'rear',170);
  v106CheckPlacements(v105Verge,'verge',230);
  v106CheckPlacements(v105Close,'close',510);
  window.BEARLY_ENV_TEST={
    close:()=>v105Close.slice(0,22),rearCount:v105Rear.length,vergeCount:v105Verge.length,
    closeCount:v105Close.length,sanity:()=>({issues:v106PlacementIssues.slice(),...envAudit}),
    curbAt:(x)=>({x,back:groundAt(x)-102,near:groundAt(x)+28,grade:v107GroundGrade(x,320)}),
    curbAudit:()=>{
      let worst=0,checked=0;const mismatches=[];
      for(const p of v105Rear){
        const middle=groundAt(p.x),grade=v107GroundGrade(p.x,p.w);
        if(middle===null)continue;
        for(const t of [-.37,0,.37]){
          const x=p.x+t*p.w,target=groundAt(x);
          if(target===null)continue;
          // The images' bottom alpha ends ~2px above the canvas foot.
          const displayed=middle-100+grade*(x-p.x);
          const delta=Math.abs(displayed-(target-102));
          checked++;worst=Math.max(worst,delta);
          if(delta>10)mismatches.push({x:Math.round(p.x),delta:+delta.toFixed(2)});
        }
      }
      return {checked,maxDeviation:+worst.toFixed(2),mismatches:mismatches.slice(0,20)};
    },
    metro:()=>{const x=stretchX(7550),w=650;const g=groundAt(x);
      return {anchor:x,centre:g,left:groundAt(x-w*.39),right:groundAt(x+w*.39),
        imageBottom:Math.max(g,groundAt(x-w*.39),groundAt(x+w*.39))-72};}
  };
  // V116 foreground: three depth planes with generous, irregular gaps.
  // Purposefully uses the game's original botanical assets; no new city art.
  const v116Foreground=[];
  for(let lane=0;lane<3;lane++){
    const gap=[360,485,610][lane];
    for(let n=0,x=120+lane*170;x<FINISH-240;n++){
      const rand=v105Seed(501+lane*3,n);
      if(rand> [.25,.31,.26][lane]){
        const species=(n*7+lane*3+Math.floor(v105Seed(510+lane,n)*6))%6;
        v116Foreground.push({x:x+v105Seed(514+lane,n)*120,lane,species,
          width:[310,500,715][lane]*(.80+v105Seed(518+lane,n)*.45),
          alpha:[.66,.76,.86][lane],flip:v105Seed(522+lane,n)>.5});
      }
      x+=gap*(.78+.54*v105Seed(530+lane,n));
    }
  }
  // Additional world-anchored planting for the metro descent: designed gaps,
  // not a screen overlay or a single repeating wallpaper strip.
  v116Foreground.push(
    {x:10950,lane:2,species:0,width:750,alpha:.89,flip:false},
    {x:11180,lane:2,species:0,width:790,alpha:.88,flip:true},
    {x:11320,lane:2,species:2,width:740,alpha:.84,flip:false},
    {x:11400,lane:2,species:5,width:665,alpha:.82,flip:true},
    {x:11820,lane:2,species:2,width:730,alpha:.91,flip:false}
  );
  const v116ForegroundAudit={visible:[0,0,0],badAnchors:0};
  const v136CloseScreens=[]; // rendered near-camera placements, not a new scenery layer
  function drawV116Foreground(){
    v116ForegroundAudit.visible=[0,0,0];
    const focus=cameraX+W*.46;
    for(let lane=0;lane<3;lane++){
      for(const p of v116Foreground){
        if(p.lane!==lane)continue;
        const factor=[1.15,1.70,2.42][lane];
        const wx=focus+(p.x-focus)*factor;
        if(wx<cameraX-p.width||wx>cameraX+W+p.width)continue;
        // Do not paste a second giant grass group directly on top of an existing
        // close foreground plant. The earlier overlapping transparent alpha
        // created an apparent grass mass floating behind other scenery.
        if(lane===2&&v136CloseScreens.some(q=>Math.abs(wx-q.x)<(p.width+q.w)*.29))continue;
        const ground=envGroundAtDrawnX(wx,p.x);
        if(!Number.isFinite(ground)){v116ForegroundAudit.badAnchors++;continue;}
        const img=images['v99_front_'+p.species];if(!img?.naturalWidth)continue;
        const ww=p.width;
        // Preserve image's exact aspect ratio: no squashing or edge-stretching.
        const hh=ww*img.naturalHeight/img.naturalWidth;
        const foot=ground+[207,316,355][lane];
        ctx.save();ctx.globalAlpha=p.alpha;
        // Ground-contact mulch tone under each isolated illustrated planting.
        // No grass carpet, extra sprites, or per-frame image filters required.
        const soilY=foot-hh*.08;
        ctx.fillStyle='rgba(39,66,51,.19)';
        ctx.beginPath();ctx.ellipse(wx,soilY,ww*.27,Math.max(3,ww*.014),0,0,Math.PI*2);ctx.fill();
        // Keep the natural botanical silhouette. The old rectangular clipping
        // plane produced straight cut-off grass tops at certain road slopes.
        ctx.filter=['saturate(1.06) brightness(1.03)',
           'saturate(1.12) contrast(1.03) blur(.6px)',
           'saturate(1.18) blur(1.8px)'][lane];
        if(p.flip){ctx.translate(wx,0);ctx.scale(-1,1);ctx.drawImage(img,-ww*.5,foot-hh,ww,hh);}
        else ctx.drawImage(img,wx-ww*.5,foot-hh,ww,hh);
        ctx.restore();v116ForegroundAudit.visible[lane]++;
      }
    }
  }
  // V118: exactly ONE tree and THREE flower groupings near the lens in the
  // Hässelby Gård concept location. No extra town/background trees.
  // Art is moved by REAL world-space parallax; dimensions are constant.
  const v118CloseArt=[
    {kind:'bush',asset:'v118_close_bush_0',x:11010,w:660,depth:2.10,footOffset:310},
    {kind:'bush',asset:'v118_close_bush_1',x:11240,w:700,depth:2.10,footOffset:312},
    {kind:'bush',asset:'v118_close_bush_2',x:11475,w:670,depth:2.10,footOffset:308}
  ];
  const v118CloseQA={treeVisible:false,bushesVisible:0,badAnchors:0};
  function drawV118CloseConceptArt(){
    v118CloseQA.treeVisible=false;v118CloseQA.bushesVisible=0;
    const focus=cameraX+W*.46;
    // V10.30: the huge near-lens tree used to start at x=10760, exactly over
    // the metro left-hand fence x=station-568 (10757). Its drawing started
    // hundreds of pixels above its terrain root, producing the floating tree
    // and hiding the fence/flowers. Do not draw that duplicate in this zone.
    // The original grounded courtyard trees remain unchanged.
    for(const b of v118CloseArt){
      const x=focus+(b.x-focus)*b.depth;
      if(x+b.w*.5<cameraX-100||x-b.w*.5>cameraX+W+100)continue;
      const ground=envGroundAtDrawnX(x,b.x),img=images[b.asset];
      if(!Number.isFinite(ground)){v118CloseQA.badAnchors++;continue;}
      if(!img?.naturalWidth)continue;
      const h=b.w*img.naturalHeight/img.naturalWidth;
      ctx.save();ctx.globalAlpha=.93;ctx.filter='saturate(1.02) contrast(1.03)';
      ctx.fillStyle='rgba(43,65,49,.18)';
      ctx.beginPath();ctx.ellipse(x,ground+b.footOffset-h*.055,b.w*.27,5,0,0,Math.PI*2);ctx.fill();
      ctx.drawImage(img,x-b.w*.5,ground+b.footOffset-h,b.w,h);
      ctx.restore();v118CloseQA.bushesVisible++;
    }
  }
  function drawFrontDepth(){
    // World-space parallax: advance plant x with the road, and derive its root
    // from the terrain at the *rendered* x. NO size change at screen edges.
    envAudit.frames++;envAudit.lastVisible=[];
    v136CloseScreens.length=0;
    v109FrontEdgeGroundcover();
    v108PaintNearGardenBeds();
    let count=0,close=0;
    const project=(x,depth)=>cameraX+W*.46+(x-cameraX-W*.46)*depth;
    for(const p of v105Verge){
      const px=project(p.x,1.20);
      if(px+p.w*.6<cameraX-80||px-p.w*.6>cameraX+W+80)continue;
      const gy=envGroundAtDrawnX(px,p.x);if(gy===null)continue;
      // Mid-foreground beds rooted below the near kerb, never in the road.
      const foot=gy+224;
      const maxH=foot-(gy+44);
      const img=images['v105_'+p.zone+'_verge_'+p.variant];
      if(!img?.naturalWidth)continue;
      const height=Math.min(p.h,maxH);
      const q={...p,h:height,w:height*img.naturalWidth/img.naturalHeight};
      if(v105DrawAsset('verge',q,px,foot,1)){
        count++;envAudit.lastVisible.push({kind:'verge',x:Math.round(px-cameraX),foot:Math.round(foot-cameraY),road:Math.round(gy-cameraY),w:Math.round(q.w),h:Math.round(q.h)});
      }
    }
    // These are *near-lens* bushes: their roots are well below the roadside.
    // Source image aspect ratio stays exact, and one bush keeps the same size
    // when it travels from the left edge to the centre and out to the right.
    for(const p of v105Close){
      const px=project(p.x,2.18);
      if(px+p.w*.75<cameraX-100||px-p.w*.75>cameraX+W+100)continue;
      const gy=envGroundAtDrawnX(px,p.x);if(gy===null)continue;
      const img=images['v105_'+p.zone+'_close_'+p.variant];
      if(!img?.naturalWidth)continue;
      const foot=gy+295;
      const height=Math.min(p.h*.91,foot-(gy+18));
      const width=height*img.naturalWidth/img.naturalHeight;
      const q={...p,w:width,h:height};
      if(v105DrawAsset('close',q,px,foot,1)){
        close++;count++;v136CloseScreens.push({x:px,w:width});
        envAudit.lastVisible.push({kind:'close',x:Math.round(px-cameraX),foot:Math.round(foot-cameraY),road:Math.round(gy-cameraY),w:Math.round(width),h:Math.round(height),aspectError:Math.abs(width/height-img.naturalWidth/img.naturalHeight)});
      }
      // Small lower companion follows its own exact patch of verge terrain.
      // It appears in the middle too: no arbitrary edge-only bouquets.
      const direction=p.flip?-1:1;
      const sx=px+direction*width*.33,sy=envGroundAtDrawnX(sx,p.x);
      if(sy!==null){
        const variant=(p.variant+3)%v105Rules[p.zone].verge;
        const support=images['v105_'+p.zone+'_verge_'+variant];
        if(support?.naturalWidth){
          const h=61+v105Seed(91,p.variant)*16;
          const companion={...p,variant,w:h*support.naturalWidth/support.naturalHeight,h,flip:!p.flip};
          if(v105DrawAsset('verge',companion,sx,sy+236,1))count++;
        }
      }
    }
    // V10.33: removed the old hovering v99_front_canopy sprites entirely.
    // They were inserted hundreds of pixels above the ground with no attached trunk.
    v108NearLensFlowers();
    drawV116Foreground();
    drawV118CloseConceptArt();
    window.BEARLY_FRONT_DEPTH_COUNT=count;
    window.BEARLY_CLOSE_FOREGROUND_COUNT=close;
    window.BEARLY_FOREGROUND_WORLD_LOCKED=true;
    envAudit.visibleNear=count-close;envAudit.visibleClose=close;
  }
  function drawVergeGrain(){
    // Sparse soil-tone flecks, only on the land BELOW the front curb.
    ctx.save();
    for(let cell=Math.floor((cameraX-150)/485)-1;cell<Math.ceil((cameraX+W+200)/485);cell++){
      if(sceneryHash(cell,56)<.56)continue;
      const x=cell*485+sceneryHash(cell,22)*170;
      const gy=groundAt(x);if(gy===null)continue;
      ctx.fillStyle='rgba(73,96,80,.075)';
      ctx.beginPath();ctx.ellipse(x,gy+156,38+sceneryHash(cell,88)*20,3,0,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  function illustratedState(){
    return {W,H,cameraX,cameraY,time,groundAt,segments,finish:FINISH,
      district:districtAt(bike.x),districtAt,bikeX:bike.x,bikeSpeed:bike.vx,bikeGroundY:bike.y+riderY(WHEEL_Y)*Math.cos(bike.a)+TIRE_R,playing:state==='playing',lifeTime:window.BearlyVisits?.lifeTime(),crewXs:gangCrews.map(c=>c.x),footActive:window.BearlyVisits?.footActive(),backdrop:debugSettings.backdrop,metro:debugSettings.metro,reducedMotion:window.matchMedia('(prefers-reduced-motion: reduce)').matches};
  }
  function groundDraw(){
    const scene=illustratedState();
    window.BearlyWorld.backstreet(ctx,scene);
    if(!window.BearlyVisits)drawGangCrews();
    window.BearlyWorld.road(ctx,scene);
    drawFinishBrakingZone();
    for(const r of ramps)if(r.x>cameraX-100&&r.x<cameraX+W+100)drawRamp(r);
    for(const h of hazards){
      if(h.x<cameraX-200||h.x>cameraX+W+200)continue;
      const gy=groundAt(h.x);
      if(gy!==null&&!window.BearlyStreetProps.hazard(ctx,h,gy,time))drawHazard(h);
    }
    for(let i=0;i<checkpoints.length;i++)drawCheckpoint(checkpoints[i],i);
    for(const star of stars)if(!star.got&&star.x>cameraX-100&&star.x<cameraX+W+100)drawStar(star.x,star.y+Math.sin(time*3+star.x)*5);
    drawFinish();
  }
  function drawCheckpoint(cp,i){
    ctx.save();ctx.translate(cp.x,cp.y);const achieved=checkpoint>i;
    ctx.strokeStyle='#263842';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-133);ctx.stroke();
    ctx.fillStyle=achieved?'#67d29e':'#ffcc53';ctx.strokeStyle='#263842';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(4,-128);ctx.lineTo(85,-128);ctx.lineTo(66,-104);ctx.lineTo(85,-81);ctx.lineTo(4,-81);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#152c38';ctx.font='900 18px Impact, sans-serif';ctx.fillText('CP '+(i+1),17,-99);ctx.restore();
  }
  // Hand-curated building spacing and proportions. Empty gaps leave room for
  // playgrounds, squares, forest views and the lakeside skyline.
  const townBuildingPlan=[
    [260,154,288],[540,230,180],[920,112,260],[1330,238,185],[1910,115,305],[2300,230,181],[2860,232,172],[3700,108,274],
    [4420,220,180],[4910,110,286],[5480,230,180],[6040,120,275],[6680,242,178],[7530,105,255],[8150,224,170],
    [9050,235,173],[9410,112,270],[9890,237,173],[10640,225,171],[11350,102,278],[11980,247,172],[12900,225,168],
    [14120,108,258],[15140,165,158],[16350,110,242],[17790,220,176],[18840,232,186],[19730,108,253],[20820,210,164]
  ].map(s=>[stretchX(s[0]),s[1],s[2]]);
  // V57: Grounded residential terraces with a consistent physical foundation.
  // Buildings use REAL world x/y; only far hills and the skyline are parallax.
  // The foot of every block is on a stepped courtyard and connects to a visible retaining wall.
  const homeClusters=[
    {x:300,n:3,kind:'homes',w:195}, {x:1960,n:2,kind:'homes',w:220},
    {x:3750,n:2,kind:'homes',w:183}, {x:5520,n:3,kind:'metro',w:177}, {x:7220,n:2,kind:'metro',w:205},
    {x:9280,n:2,kind:'market',w:214},{x:11000,n:3,kind:'market',w:170}, {x:11800,n:2,kind:'market',w:188},
    {x:13400,n:2,kind:'market',w:175},{x:18450,n:2,kind:'lake',w:170},
    {x:21400,n:2,kind:'lake',w:212},{x:22600,n:2,kind:'lake',w:166},{x:25300,n:2,kind:'lake',w:195}
  ].map(o=>({...o,x:stretchX(o.x)}));
  function buildingFace(x,base,w,h,id,zone){
    const colors={homes:['#fad7a0','#bc826f'],metro:['#f4c4b3','#ae8291'],market:['#f1c0a3','#bc7880'],lake:['#e6d6ac','#a3968e']};
    const pal=colors[zone]||colors.homes;
    const depth=20+(id%3)*8;
    ctx.fillStyle='#766c70';ctx.beginPath();ctx.moveTo(x+w,base-h);ctx.lineTo(x+w+depth,base-h-18);ctx.lineTo(x+w+depth,base-20);ctx.lineTo(x+w,base);ctx.closePath();ctx.fill();
    const wall=ctx.createLinearGradient(x,base-h,x+w,base);wall.addColorStop(0,pal[0]);wall.addColorStop(.57,pal[0]);wall.addColorStop(1,pal[1]);
    ctx.fillStyle=wall;ctx.fillRect(x,base-h,w,h);
    ctx.fillStyle='#785961';ctx.beginPath();ctx.moveTo(x-8,base-h);ctx.lineTo(x+depth,base-h-16);ctx.lineTo(x+w+depth,base-h-16);ctx.lineTo(x+w+8,base-h);ctx.closePath();ctx.fill();
    const floors=Math.max(3,Math.floor(h/40)),cols=Math.max(2,Math.floor(w/37));
    for(let row=0;row<floors;row++)for(let col=0;col<cols;col++){
      const bx=x+13+col*(w-23)/cols,by=base-h+23+row*(h-36)/floors;
      const win=ctx.createLinearGradient(bx,by,bx+18,by+18);win.addColorStop(0,(col+row+id)%6===0?'#ffeba2':'#a5c1c5');win.addColorStop(1,'#477486');
      ctx.fillStyle=win;ctx.fillRect(bx,by,Math.min(20,w/cols-9),20);ctx.strokeStyle='#faedcf';ctx.lineWidth=1.7;ctx.strokeRect(bx,by,Math.min(20,w/cols-9),20);
      if((col+row+id)%3===0){ctx.fillStyle='#5b7180';ctx.fillRect(bx-5,by+22,28,5);ctx.fillStyle='#658a60';ctx.fillRect(bx-3,by+17,22,5);}
    }
    ctx.fillStyle='#5c7383';ctx.fillRect(x+w*.40,base-31,w*.15,31);
    ctx.fillStyle='#e5c19e';ctx.fillRect(x+w*.43,base-26,w*.06,25);
    ctx.fillStyle='#3b5159';ctx.fillRect(x+w-8,base-h+4,8,h-4);
  }
  // v7.7: the picture background has its own continuous, slower-moving track.
  // The old panel centers followed groundAt(), causing inconsistent gaps and
  // large altitude jumps whenever one house strip replaced another.
  function sceneryHash(n,seed=0){
    const v=Math.sin((n+seed*67.193)*127.1+78.233)*43758.5453123;
    return v-Math.floor(v);
  }
  function zonePaletteAt(x){
    const tones={homes:'#aab5a0',metro:'#9faeac',square:'#b6a69b',forest:'#91a997',lake:'#9bb8b3'};
    let idx=Math.max(0,districts.findIndex(d=>x>=d.start&&x<d.end));
    if(idx<0)idx=districts.length-1;
    const d=districts[idx],a=tones[d.style]||tones.homes;
    // Cross-fade ambient colour at the *world position* of the prop.
    if(idx<districts.length-1 && x>d.end-1900)
      return blendHex(a,tones[districts[idx+1].style],smooth(d.end-1900,d.end+1900,x)*.6);
    if(idx>0 && x<d.start+1900)
      return blendHex(tones[districts[idx-1].style],a,.42+.58*smooth(d.start-1900,d.start+1900,x));
    return a;
  }
  const NEIGHBORHOOD_PARALLAX=.49;
  const BACKGROUND_PANEL_WIDTH=1470; // wider illustrated passages: fewer identical skylines
  const BACKGROUND_PANEL_PITCH=1190; // generous overlap without an 870px copy/paste loop
  const BACKGROUND_TRANSITION=3400;
  // Data driven: future levels can extend this list, without changing drawTown().
  // These are distinct compositions, not a three-image loop. Each zone keeps
  // its identity, with a few transitional illustrations shared at its margins.
  const backgroundCollections={
    homes:['v58_unique_00','v58_unique_01','v58_unique_05','v58_unique_02','v58_unique_06'],
    metro:['v58_unique_03','v58_unique_05','v58_unique_04','v58_unique_07','v58_unique_06'],
    square:['v58_unique_06','v58_unique_08','v58_unique_07','v58_unique_04','v58_unique_05'],
    forest:['v58_unique_09','v58_unique_11','v58_unique_10','v58_unique_13','v58_unique_12'],
    lake:['v58_unique_12','v58_unique_15','v58_unique_14','v58_unique_13','v58_unique_08']
  };
  const neighborhoodPanels=districts.flatMap((district,z)=>{
    const choices=backgroundCollections[district.style]||backgroundCollections.homes;
    const start=district.start*NEIGHBORHOOD_PARALLAX-BACKGROUND_PANEL_WIDTH*.85;
    const end=district.end*NEIGHBORHOOD_PARALLAX+BACKGROUND_PANEL_WIDTH*.85;
    const panels=[];let n=0,previousIndex=-1;
    for(let x=start;x<end;x+=BACKGROUND_PANEL_PITCH){
      const styleVariant=sceneryHash(n+z*31,13);
      // A deterministic, nonrepeating tour through an area's illustration pool.
      // Each panel is also cropped independently within its painted source.
      let idx=(n+z*2+Math.floor(sceneryHash(z,51)*choices.length))%choices.length;
      if(idx===previousIndex)idx=(idx+1)%choices.length;
      previousIndex=idx;
      panels.push({x:x+(styleVariant-.5)*92,img:choices[idx],zone:district.style,
        w:BACKGROUND_PANEL_WIDTH*(.96+styleVariant*.07),districtIndex:z,variant:styleVariant,
        crop:sceneryHash(n+z*17,124)});
      n++;
    }
    return panels;
  });
  function backgroundDistrictWeight(d){
    const a=d.start<=0?1:smooth(d.start-BACKGROUND_TRANSITION,d.start+BACKGROUND_TRANSITION,bike.x);
    const b=d.end>=FINISH?1:1-smooth(d.end-BACKGROUND_TRANSITION,d.end+BACKGROUND_TRANSITION,bike.x);
    return a*b;
  }
  const softBackgroundPanelCache=new Map();
  function softPanelImage(im,key){
    if(softBackgroundPanelCache.has(key))return softBackgroundPanelCache.get(key);
    if(!im?.naturalWidth)return im;
    const cv=document.createElement('canvas');cv.width=im.naturalWidth;cv.height=im.naturalHeight;
    const cc=cv.getContext('2d');cc.drawImage(im,0,0);
    const edge=Math.max(32,Math.round(cv.width*.12));
    const grad=cc.createLinearGradient(0,0,cv.width,0);
    grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(edge/cv.width,'rgba(255,255,255,1)');
    grad.addColorStop(1-edge/cv.width,'rgba(255,255,255,1)');grad.addColorStop(1,'rgba(255,255,255,0)');
    cc.globalCompositeOperation='destination-in';cc.fillStyle=grad;cc.fillRect(0,0,cv.width,cv.height);
    softBackgroundPanelCache.set(key,cv);return cv;
  }
  function drawTown(){
    // Canvas screen space. Stable horizon lets distant buildings survive hills,
    // while the road and foreground still follow real terrain coordinates.
    const scroll=cameraX*NEIGHBORHOOD_PARALLAX;
    const baseY=H*.775 + clamp((cameraY-375)*-.025,-17,17);
    for(let z=0;z<districts.length;z++){
      const opacity=backgroundDistrictWeight(districts[z]);
      if(opacity<.005)continue;
      ctx.save();ctx.globalAlpha=.97;ctx.filter='saturate(.84) contrast(.97)';
      for(const p of neighborhoodPanels){
        if(p.districtIndex!==z)continue;
        const x=p.x-scroll;
        if(x>W+160 || x+p.w< -160)continue;
        const im=images[p.img];if(!im?.naturalWidth)continue;
        const h=p.w*im.naturalHeight/im.naturalWidth*1.16;
        ctx.save();ctx.globalAlpha=opacity*(.91+p.variant*.07);
        // Subtle framing shift breaks the identical-building silhouette.
        // Reuse the painted pixels; never stretch individual buildings/shrubs.
        const src=softPanelImage(im,p.img),cut=src.width*.065;
        ctx.drawImage(src,cut*p.crop,0,src.width-cut,src.height,
          x,baseY-h+19+(p.variant-.5)*9,p.w,h);ctx.restore();
      }
      ctx.restore();
    }
  }
  function drawFinish(){const y=groundAt(FINISH)||420;ctx.lineWidth=7;ctx.strokeStyle='#192b31';ctx.beginPath();ctx.moveTo(FINISH,y);ctx.lineTo(FINISH,y-247);ctx.stroke();ctx.fillStyle='#fff';for(let row=0;row<4;row++)for(let col=0;col<5;col++){ctx.fillStyle=(row+col)%2?'#142c35':'#f5f8f5';ctx.fillRect(FINISH+4+col*13,y-242+row*13,13,13);}ctx.font='bold 21px Impact,sans-serif';ctx.fillStyle='#122f39';ctx.fillText('FINISH',FINISH-33,y-257);}
  function drawRamp(r){
    const y=groundAt(r.x);if(y===null)return;
    ctx.save();ctx.translate(r.x,y);ctx.fillStyle='#e8a83f';ctx.strokeStyle='#453c37';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(-43,0);ctx.lineTo(7,-22);ctx.lineTo(43,-19);ctx.lineTo(43,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#fff4c3';ctx.lineWidth=3;for(let k=-28;k<26;k+=16){ctx.beginPath();ctx.moveTo(k,-8-k*.21);ctx.lineTo(k+11,-8-k*.21);ctx.stroke();}
    ctx.font='900 13px sans-serif';ctx.fillStyle='#ffe69c';ctx.fillText('JUMP',-17,-34);ctx.restore();
  }
  // Each roadside prop has a real contact point. They are authored in small
  // neighborhood groups; visual-only props cannot inflict collision damage.
  // [worldX, spriteName, width]. No isolated station sign is repeated elsewhere.
  // v9.7: curated district-specific scenery. Every group matches the real site
  // identity, none is a generic oversized bench/log/sticker. All these are visual.
  // Positions in the authoring table are un-stretched and are converted once.
  // V9.9 C illustrated support clusters. The backdrop is the main character.
  // Utility cabinets, quiet shrubs and lamps are visually secondary and paired
  // with their appropriate surroundings; avoid benches and giant cutouts.
  const districtPropBlueprints=[
    {zone:'homes',items:[[610,'utility',53],[667,'shrub_a',72],
      [1520,'lamp',47],[1588,'shrub_b',61],
      [3190,'garden_screen',106],[3264,'shrub_c',65],
      [3980,'utility',48],[4045,'shrub_a',69]]},
    {zone:'metro',items:[[4530,'lamp',47],[4593,'shrub_b',68],
      [5200,'bike_rack',68],[5274,'shrub_c',72],
      [7230,'utility',46],[7306,'shrub_a',71],
      [8470,'lamp',49],[8528,'shrub_b',64]]},
    {zone:'square',items:[[9160,'trash_bin',41],[9235,'shrub_c',68],
      [10600,'utility',50],[10675,'shrub_a',69],
      [12550,'bike_rack',68],[12620,'shrub_b',61]]},
    {zone:'forest',items:[[14320,'shrub_a',82],[14385,'shrub_b',73],
      [15825,'stone_border',106],[15917,'shrub_c',77],
      [17330,'rockbed',90],[17422,'shrub_a',82]]},
    {zone:'lake',items:[[18750,'lamp',49],[18822,'shrub_c',72],
      [20190,'utility',48],[20260,'shrub_a',68],
      [22700,'bike_rack',71],[22783,'shrub_b',79],
      [25200,'lamp',49],[25274,'shrub_a',74],
      [27310,'utility',50],[27388,'shrub_c',72]]}
  ];
  const propClusters=districtPropBlueprints.map(g=>({zone:g.zone,
    items:g.items.map(([x,key,w])=>[stretchX(x),key,w])}));
  // Each scene is an intentional pair, not periodic filler based on random seeds.
  const extraProps=[];
  const propRhythm=[{x:0,span:FINISH,count:0,scene:'curated pairs',zone:'all'}];
  const integratedProps=propClusters.flatMap(g=>g.items);
  // Prevent unsupported/mislabeled decoration from slipping back into future passes.
  const propEligibleZones={
    utility:['homes','metro','square','lake'],lamp:['homes','metro','square','lake'],
    bike_rack:['homes','metro','square','lake'],trash_bin:['homes','metro','square','lake'],
    garden_screen:['homes'],stone_border:['forest'],rockbed:['forest'],
    shrub_a:['homes','metro','square','forest','lake'],
    shrub_b:['homes','metro','square','forest','lake'],
    shrub_c:['homes','metro','square','forest','lake']
  };
  // v10.53 – Rear-curb placement: fence sections and planted beds take priority.
  // Earlier a separate grass sprite was drawn OVER each fence and the pavement,
  // so alternating grass/fence objects looked like they were suspended in air.
  const v136FenceRanges=[];
  for(let sector=0;sector<Math.ceil(FINISH/1250);sector++){
    if(v105Seed(63,sector)<.43)continue;
    const zone=v105DistrictAt(sector*1250);
    if(zone==='forest'||zone==='lake')continue;
    const from=sector*1250+195+v105Seed(62,sector)*180;
    const to=from+360+v105Seed(64,sector)*190;
    if((from<stretchX(8000)&&to>stretchX(6900))||
       (from<stretchX(6770)&&to>stretchX(5700)))continue;
    if(v129LeftMetroApproach(from)||v129LeftMetroApproach((from+to)*.5)||v129LeftMetroApproach(to))continue;
    v136FenceRanges.push([from,to]);
  }
  for(let section=-1;section<Math.ceil(FINISH/1630)+1;section++){
    if(sceneryHash(section,92)<.48)continue;
    const base=section*1630+120+sceneryHash(section,12)*240;
    const posts=3+Math.floor(sceneryHash(section,7)*3),step=123;
    const from=base,to=base+(posts-1)*step;
    if(to<0||from>FINISH)continue;
    if(to>stretchX(5460)&&from<stretchX(8470))continue;
    if(v129LeftMetroApproach(from)||v129MetroBuffer(from,240))continue;
    v136FenceRanges.push([from,to]);
  }
  const v136RearCurbQA={checked:0,blockedFence:0,blockedGarden:0,blockedProp:0,drawn:0,missingGround:0};
  function v136RearBlocked(p){
    const left=p.x-p.w*.38,right=p.x+p.w*.38;
    if(v136FenceRanges.some(r=>left<r[1]+18&&right>r[0]-18)){
      v136RearCurbQA.blockedFence++;return true;
    }
    if(v109Gardens.some(g=>left<g.end+12&&right>g.start-12)){
      v136RearCurbQA.blockedGarden++;return true;
    }
    if(integratedProps.some(q=>{
      const qx=q[0], key=q[1], qw=q[2]||54;
      if(/^shrub_/.test(key))return false;
      return Math.abs(qx-p.x) < (qw*.54 + p.w*.33 + 14);
    })){
      v136RearCurbQA.blockedProp++;return true;
    }
    return false;
  }
  function v136DrawPlantedFoot(p){
    // Lower planted base so the hedge visually hugs the rear curb instead of hovering.
    const a=Math.max(0,p.x-p.w*.39),b=Math.min(FINISH,p.x+p.w*.39);
    ctx.save();ctx.fillStyle='rgba(70,94,69,.34)';ctx.beginPath();
    for(let i=0;i<=12;i++){
      const x=a+(b-a)*i/12,gy=groundAt(x);if(!Number.isFinite(gy))continue;
      const taper=Math.sin(Math.PI*i/12);
      if(i===0)ctx.moveTo(x,gy-99);else ctx.lineTo(x,gy-99-4*taper);
    }
    for(let i=12;i>=0;i--){
      const x=a+(b-a)*i/12,gy=groundAt(x);if(Number.isFinite(gy))ctx.lineTo(x,gy-87);
    }
    ctx.closePath();ctx.fill();ctx.restore();
  }
  function drawRearCurbFoliage(){
    v136RearCurbQA.checked=0;v136RearCurbQA.drawn=0;
    v136RearCurbQA.blockedFence=0;v136RearCurbQA.blockedGarden=0;v136RearCurbQA.blockedProp=0;
    v136RearCurbQA.missingGround=0;
    for(const p of v105Rear){
      if(p.x+p.w<cameraX-130||p.x-p.w>cameraX+W+130)continue;
      if(v129LeftMetroApproach(p.x) || v129MetroBuffer(p.x,260))continue;
      v136RearCurbQA.checked++;
      if(v136RearBlocked(p))continue;
      const gy=groundAt(p.x);
      if(!Number.isFinite(gy)){v136RearCurbQA.missingGround++;continue;}
      v136DrawPlantedFoot(p);
      if(v105DrawAsset('rear',p,p.x,gy-93,1))v136RearCurbQA.drawn++;
    }
  }
  window.BEARLY_V136_REAR_CURB=()=>({ ...v136RearCurbQA, fenceSpans:v136FenceRanges.length });

  const roadSigns=[
    [1530,'HÄSSELBY','right'],[5670,'HÄSSELBY GÅRD','right'],
    [10000,'JOHANNELUND','right'],[15450,'GRIMSTA','right'],
    [19020,'HÄSSELBY STRAND','right'],[24700,'MÄLAREN','right'],
    [26380,'MÄLAREN · 500 m','right']
  ].map(s=>[stretchX(s[0]),s[1],s[2]]);
  // Preserve the painted prop models, soften only their rectangular image crops.
  const softenedPropCache=new WeakMap();
  function softenedPropSource(im,station=false){
    if(!im?.naturalWidth)return im;
    const existing=softenedPropCache.get(im);
    if(existing&&existing.station===station)return existing.canvas;
    const cv=document.createElement('canvas');cv.width=im.naturalWidth;cv.height=im.naturalHeight;
    const c=cv.getContext('2d');c.drawImage(im,0,0);
    c.globalCompositeOperation='destination-in';
    const fade=c.createLinearGradient(0,0,cv.width,0);
    const edge=station?.065:.11;
    fade.addColorStop(0,'rgba(255,255,255,0)');fade.addColorStop(edge,'white');
    fade.addColorStop(1-edge,'white');fade.addColorStop(1,'rgba(255,255,255,0)');
    c.fillStyle=fade;c.fillRect(0,0,cv.width,cv.height);
    const vertical=c.createLinearGradient(0,0,0,cv.height);
    vertical.addColorStop(0,'rgba(255,255,255,.5)');
    vertical.addColorStop(station?.11:.085,'white');
    // Keep opaque feet and a grounded bottom edge. The former 17% alpha fade
    // literally erased prop bases and made benches/bins float over the pavement.
    vertical.addColorStop(station?.95:.96,'white');
    vertical.addColorStop(1,'rgba(255,255,255,.93)');
    c.fillStyle=vertical;c.fillRect(0,0,cv.width,cv.height);
    c.globalCompositeOperation='source-over';
    softenedPropCache.set(im,{station,canvas:cv});return cv;
  }
  function drawPropGrounding(x,contact,w,depth){
    // Soft soil/ambient contact, shared by each prop rather than loose fake grass.
    ctx.save();
    const g=ctx.createRadialGradient(x,contact-4,1,x,contact-4,w*.65);
    g.addColorStop(0,depth==='far'?'rgba(57,73,66,.14)':'rgba(57,73,66,.23)');
    g.addColorStop(.56,'rgba(79,98,79,.08)');g.addColorStop(1,'rgba(79,98,79,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,contact-3,w*.67,Math.max(7,w*.14),0,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=.12;ctx.fillStyle=zonePaletteAt(x);
    ctx.beginPath();ctx.ellipse(x,contact-1,w*.44,3,0,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  const atmospherePropCache=new WeakMap();
  function harmonizedPropImage(im,zone){
    if(!im?.naturalWidth)return im;
    let tones=atmospherePropCache.get(im);
    if(!tones){tones=new Map();atmospherePropCache.set(im,tones);}
    if(tones.has(zone))return tones.get(zone);
    const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;
    const t=c.getContext('2d');t.drawImage(softenedPropSource(im),0,0);
    // Re-light artwork using the neighborhood's ambient color instead of
    // adding rectangular overlays or changing the original model itself.
    const palette={homes:'#b1ac96',metro:'#9aa5a4',square:'#b9a396',forest:'#8da89a',lake:'#9bb8ae'};
    t.globalCompositeOperation='source-atop';t.globalAlpha=.21;
    t.fillStyle=palette[zone]||palette.homes;t.fillRect(0,0,c.width,c.height);
    t.globalCompositeOperation='source-over';t.globalAlpha=1;
    tones.set(zone,c);return c;
  }
  function drawIllustratedProp(key,x,contact,w,depth='mid'){
    const shrub={shrub_a:'v91_nearfoliage_0',shrub_b:'v91_nearfoliage_1',shrub_c:'v91_nearfoliage_2'};
    const im=images[shrub[key]]||images['v95_'+key]||images['v98_clean_'+key]||images['v60_'+key]||images['v59_'+key]||images['v53_'+key];
    if(!im?.naturalWidth)return false;
    const hh=w*im.naturalHeight/im.naturalWidth;
    const zone=districtAt(x).style;
    ctx.save();drawPropGrounding(x,contact,w,depth);
    const danger=depth==='danger';
    ctx.filter=danger?'saturate(.82) contrast(.98) brightness(.98)':
      depth==='far'?'saturate(.51) contrast(.87) brightness(.97) blur(.42px)':
      'saturate(.57) contrast(.91) brightness(.98) blur(.22px)';
    ctx.globalAlpha=danger?1:depth==='far'?.77:.88;
    const source=danger?softenedPropSource(im):harmonizedPropImage(im,zone);
    if(key.startsWith('shrub_')){
      ctx.translate(x,contact);ctx.transform(1,v107GroundGrade(x,w),0,1,0,0);
      ctx.drawImage(source,-w*.5,-hh+2,w,hh);
    }else ctx.drawImage(source,x-w*.5,contact-hh+2,w,hh);
    ctx.restore();return true;
  }
  function drawRoadsideWalkway(a,b){
    a=Math.max(0,a);b=Math.min(FINISH+1600,b);
    if(b<=a)return;
    const p=[];for(let x=a;x<=b;x+=18){const y=groundAt(x);if(y!==null)p.push([x,y]);}
    const e=groundAt(b);if(e!==null)p.push([b,e]);
    if(p.length<2)return;
    ctx.save();
    const sidewalk=ctx.createLinearGradient(0,cameraY+160,0,cameraY+H+200);
    sidewalk.addColorStop(0,'#d6c0a7');sidewalk.addColorStop(1,'#9e8e83');
    ctx.fillStyle=sidewalk;ctx.beginPath();
    for(let i=0;i<p.length;i++)i?ctx.lineTo(p[i][0],p[i][1]-102):ctx.moveTo(p[i][0],p[i][1]-102);
    for(let i=p.length-1;i>=0;i--)ctx.lineTo(p[i][0],p[i][1]-75);
    ctx.closePath();ctx.fill();
    // Perspective material: a fine rear-edge highlight, soft inner joint line.
    ctx.strokeStyle='rgba(244,225,191,.61)';ctx.lineWidth=3;ctx.beginPath();
    for(let i=0;i<p.length;i++)i?ctx.lineTo(p[i][0],p[i][1]-102):ctx.moveTo(p[i][0],p[i][1]-102);
    ctx.stroke();
    ctx.strokeStyle='rgba(88,79,76,.22)';ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<p.length;i++)i?ctx.lineTo(p[i][0],p[i][1]-76):ctx.moveTo(p[i][0],p[i][1]-76);
    ctx.stroke();
    // Sparse rectangular stone joins use the same global phase in every district.
    ctx.strokeStyle='rgba(68,74,72,.16)';ctx.lineWidth=1.5;
    for(let x=Math.ceil(a/172)*172;x<b;x+=172){const y=groundAt(x);if(y===null)continue;
      ctx.beginPath();ctx.moveTo(x,y-101);ctx.lineTo(x-7,y-77);ctx.stroke();
    }
    ctx.restore();
  }
  function drawDistrictTransitionHaze(){
    ctx.save();
    for(let i=1;i<districts.length;i++){
      const x=districts[i].start;
      if(x<cameraX-330||x>cameraX+W+330)continue;
      const gy=groundAt(x)??groundAt(x-60)??420;
      ctx.save();ctx.translate(x,gy-170);ctx.scale(1.5,.65);
      const haze=ctx.createRadialGradient(0,0,6,0,0,235);
      haze.addColorStop(0,'rgba(251,231,201,.20)');
      haze.addColorStop(.6,'rgba(248,226,198,.065)');
      haze.addColorStop(1,'rgba(248,226,198,0)');
      ctx.fillStyle=haze;ctx.beginPath();ctx.arc(0,0,235,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    ctx.restore();
  }
  function drawForegroundDepth(){
    // The fake grass drawn in the middle of the road has been removed.
    // Camera-side vegetation belongs exclusively to drawFrontDepth().
  }
  // V10.55: cohesive Scandinavian street signs with legible, matte lettering.
  function drawRoadSignBoard(lines,width,theme='blue',arrow=false){
    const t=theme==='warn'
      ? {a:'#e8b54e',b:'#bd7644',text:'#273642',rim:'#f4e8cb'}
      : {a:'#3878a7',b:'#235278',text:'#f9f1dc',rim:'#f5eddb'};
    ctx.lineJoin='round';
    ctx.fillStyle='rgba(31,45,48,.21)';ctx.beginPath();ctx.ellipse(0,2,23,5,0,0,7);ctx.fill();
    // Fixed pole with mounting clamps, consistent world contact.
    ctx.fillStyle='#4c5d61';ctx.beginPath();ctx.roundRect(-4,-111,8,110,2);ctx.fill();
    ctx.fillStyle='#a1a7a0';ctx.fillRect(-1,-108,2,102);
    for(const cy of [-113,-81]){ctx.fillStyle='#9fa79e';ctx.fillRect(-8,cy,16,3);}
    const panel=ctx.createLinearGradient(-width/2,-125,width/2,-74);
    panel.addColorStop(0,t.a);panel.addColorStop(1,t.b);
    ctx.fillStyle=panel;ctx.strokeStyle='#293f4a';ctx.lineWidth=4;
    ctx.beginPath();ctx.roundRect(-width/2,-130,width,55,6);ctx.fill();ctx.stroke();
    ctx.strokeStyle=t.rim;ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(-width/2+3,-127,width-6,49,4);ctx.stroke();
    ctx.strokeStyle='rgba(248,240,212,.28)';ctx.lineWidth=1.3;ctx.beginPath();
    ctx.moveTo(-width/2+11,-120);ctx.lineTo(width/2-11,-120);ctx.stroke();
    for(const px of [-width/2+10,width/2-10]){ctx.fillStyle='#e7dac0';ctx.beginPath();ctx.arc(px,-103,1.7,0,7);ctx.fill();}
    ctx.textBaseline='middle';ctx.textAlign='center';ctx.fillStyle=t.text;
    if(lines.length===1){ctx.font='800 15px system-ui,sans-serif';ctx.fillText(lines[0],arrow?-9:0,-103,width-(arrow?49:21));}
    else {ctx.font='800 13px system-ui,sans-serif';ctx.fillText(lines[0],0,-112,width-18);
      ctx.font='900 15px system-ui,sans-serif';ctx.fillText(lines[1],0,-94,width-18);}
    if(arrow){
      ctx.strokeStyle=t.text;ctx.lineWidth=2.6;ctx.lineCap='round';
      const xx=width*.39;
      ctx.beginPath();ctx.moveTo(xx-10,-103);ctx.lineTo(xx+5,-103);ctx.lineTo(xx,-108);ctx.moveTo(xx+5,-103);ctx.lineTo(xx,-98);ctx.stroke();
    }
    ctx.textBaseline='alphabetic';
  }
  function drawDirectionSign(x,ground,label,warning=false){
    ctx.save();ctx.translate(x,ground);
    ctx.shadowColor='#152e3c55';ctx.shadowBlur=8;ctx.shadowOffsetY=3;
    const width=warning?156:Math.max(126,Math.min(238,label.length*11.6+56));
    drawRoadSignBoard([label],width,warning?'warn':'blue',!warning);
    ctx.restore();
  }
  function drawStreetScenery(){
    for(const group of propClusters){
      const visible=group.items.filter(([x])=>x>cameraX-240&&x<cameraX+W+240);
      if(!visible.length)continue;
      for(const [x,key,w] of visible){
        if(v129LeftMetroApproach(x) || v129MetroBuffer(x,240))continue;
        const gy=groundAt(x);if(gy===null)continue;
        if(v129MetroBuffer(x,235))continue;
        // Contact on the rear curb at y = groundAt(x)-103. Previous v5.9
        // hard-coded -132, leaving every asset visibly hovering above it.
        const offset=100;
        if(!propEligibleZones[key]||!propEligibleZones[key].includes(districtAt(x).style))continue;
        if(x>=stretchX(5780)&&x<=stretchX(6725))continue; // embedded shopfront cluster
        if(x>=stretchX(7800)&&x<=stretchX(8275))continue; // small pub cluster
        if(!key.startsWith('shrub_') && hazards.some(h=>Math.abs(h.x-x)<135))continue;
        // Anchor toward downhill edge of the actual sloped pavement. This
        // prevents broad props from hovering on steep descents.
        const shrub=key.startsWith('shrub_');
        if(shrub&&v136FenceRanges.some(r=>x+w*.38>r[0]-10 && x-w*.38<r[1]+10))continue;
        const foot=shrub?gy:(groundAt(x+Math.min(w*.24,42))??gy);
        drawIllustratedProp(key,x,(shrub?gy:Math.max(gy,foot))-(shrub?100:offset),w,
          (key==='playground'||key.startsWith('shrub_'))?'far':'mid');
      }
    }
    for(const [x,label,type] of roadSigns){
      if(x<cameraX-240||x>cameraX+W+240)continue;
      const gy=groundAt(x);if(gy!=null)drawDirectionSign(x,gy-79,label,type==='warning');
    }
    drawMetroForecourt();
  }
  function drawMetroForecourt(){
    // V117: moved the metro forecourt into the illustrated station pass so
    // fences/planters/rack receive one correct sidewalk depth, not duplicates.
  }

  function drawSetPieces(){
    for(const e of setPieces){
      if(e.kind==='flag'||e.kind==='metro'||e.kind==='shop'||e.kind==='graffiti'||e.kind==='streetart')continue; // No placeholder roadside signs; use real illustrated station.
      if(e.x<cameraX-300||e.x>cameraX+W+300)continue;
      const gy=groundAt(e.x);if(gy===null)continue;
      ctx.save();ctx.translate(e.x,gy);
      if(e.kind==='flag'){
        ctx.fillStyle='#515b62';ctx.fillRect(-3,-145,6,145);
        ctx.fillStyle='#2373ba';ctx.fillRect(3,-144,72,49);
        ctx.fillStyle='#f8d54d';ctx.fillRect(23,-144,12,49);ctx.fillRect(3,-126,72,11);
      }else if(e.kind==='playground'){
        ctx.strokeStyle='#d47d4f';ctx.lineWidth=7;
        ctx.beginPath();ctx.moveTo(-65,0);ctx.lineTo(-25,-90);ctx.lineTo(10,0);ctx.stroke();
        ctx.strokeStyle='#e7cc9f';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-40,-60);ctx.lineTo(-40,-14);ctx.moveTo(-18,-65);ctx.lineTo(-18,-14);ctx.stroke();
        ctx.fillStyle='#42a8bf';ctx.fillRect(-51,-14,43,8);
        ctx.fillStyle='#ee975a';ctx.beginPath();ctx.moveTo(23,-104);ctx.lineTo(60,-15);ctx.lineTo(20,-15);ctx.closePath();ctx.fill();
      }else if(e.kind==='drill'){
        // Harmless, clearly fake low-budget 'gangster' music video shoot.
        ctx.fillStyle='#253840';ctx.fillRect(-73,-21,148,23);
        ctx.fillStyle='#f1bd64';ctx.font='900 14px sans-serif';ctx.fillText('DRILL SHOOT',-58,-28);
        ctx.strokeStyle='#35444c';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-30,-22);ctx.lineTo(-23,-105);ctx.lineTo(-52,-145);ctx.moveTo(-23,-105);ctx.lineTo(5,-144);ctx.stroke();
        ctx.fillStyle='#293644';ctx.fillRect(-60,-163,62,35);
        ctx.fillStyle='#f2c24a';ctx.fillRect(-41,-152,16,12);
        ctx.fillStyle='#ffe0ad';ctx.font='bold 12px sans-serif';ctx.fillText('TAKE 69',-36,-185);
      }else if(e.kind==='scootercrew'){
        for(let k=0;k<3;k++){
          const xx=(k-1)*40;
          ctx.strokeStyle='#283944';ctx.lineWidth=4;ctx.beginPath();ctx.arc(xx-11,-7,7,0,7);ctx.arc(xx+20,-7,7,0,7);ctx.stroke();
          ctx.strokeStyle=['#6bd0bf','#ffc15d','#ed7f68'][k];ctx.beginPath();ctx.moveTo(xx-11,-17);ctx.lineTo(xx+14,-17);ctx.lineTo(xx+10,-72);ctx.lineTo(xx+25,-72);ctx.stroke();
        }
        ctx.fillStyle='#233c4a';ctx.fillRect(-97,-126,197,32);ctx.fillStyle='#fee19b';ctx.font='bold 13px sans-serif';ctx.fillText('THE SCOOTER SYNDICATE',-89,-105);
      }else if(e.kind==='metro'){
        ctx.fillStyle='#376e8b';ctx.fillRect(-93,-190,190,52);
        ctx.fillStyle='#f5eff0';ctx.font='900 25px sans-serif';ctx.fillText('T   HÄSSELBY',-80,-155);
        ctx.strokeStyle='#475b62';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-92,-137);ctx.lineTo(-92,0);ctx.moveTo(94,-137);ctx.lineTo(94,0);ctx.stroke();
      }else if(e.kind==='shop'){
        ctx.fillStyle='#d2a174';ctx.fillRect(-100,-108,195,108);
        ctx.fillStyle='#2c6b7c';ctx.fillRect(-105,-111,207,26);
        ctx.fillStyle='#fff7d3';ctx.font='900 21px sans-serif';ctx.fillText('TORGET',-60,-89);
        for(let k=0;k<3;k++){ctx.fillStyle='#6ca2ab';ctx.fillRect(-89+k*58,-76,46,56);ctx.strokeStyle='#efdbad';ctx.strokeRect(-89+k*58,-76,46,56);}
      }else if(e.kind==='graffiti'||e.kind==='streetart'){
        ctx.fillStyle='#bba18c';ctx.fillRect(-105,-79,215,80);
        ctx.fillStyle='#ef657f';ctx.font='italic 900 25px sans-serif';ctx.fillText(e.kind==='graffiti'?'TOUGH GUYS':'CERTIFIED',-95,-47);
        ctx.fillStyle='#237e99';ctx.font='italic 900 21px sans-serif';ctx.fillText(e.kind==='graffiti'?'SOFT PRICES':'MENACE INTERN',-90,-17);
      }else if(e.kind==='waterfront'){
        ctx.fillStyle='#7bc0c7';ctx.fillRect(-160,-20,330,22);
        ctx.strokeStyle='#edcf91';ctx.lineWidth=4;
        for(let xx=-125;xx<130;xx+=62){ctx.beginPath();ctx.moveTo(xx,0);ctx.lineTo(xx,-56);ctx.stroke();}
        ctx.strokeStyle='#eedbb5';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-135,-53);ctx.lineTo(152,-53);ctx.stroke();
        ctx.fillStyle='#346d8d';ctx.font='bold 15px sans-serif';ctx.fillText('MÄLAREN',-42,-64);
      }
      ctx.restore();
    }
  }
  function drawHazard(h){
    if(drawRoadsideHazard(h))return;
    if(h.type==='roadwork'){
      const roadGy=groundAt(h.x);
      if(roadGy!==null && drawV160WorldSprite('roadblock',h.x,roadGy,76,62))return;
      const y=groundAt(h.x);if(y==null)return;
      ctx.save();ctx.translate(h.x,y);drawDangerSurfaceLocal(76);
      ctx.fillStyle='rgba(48,54,56,.28)';ctx.beginPath();ctx.ellipse(0,0,40,5,0,0,7);ctx.fill();
      for(const [px,scale] of [[-19,.92],[24,.74]]){
        ctx.save();ctx.translate(px,0);ctx.scale(scale,scale);
        ctx.fillStyle='#6d7470';ctx.beginPath();ctx.roundRect(-14,-7,28,8,2);ctx.fill();
        ctx.fillStyle='#d8b98e';ctx.strokeStyle='#31424d';ctx.lineWidth=2.8;
        ctx.beginPath();ctx.moveTo(-11,-7);ctx.lineTo(-4,-44);ctx.lineTo(5,-44);ctx.lineTo(12,-7);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.fillStyle='#f3e6c7';ctx.beginPath();ctx.moveTo(-7,-22);ctx.lineTo(8,-22);ctx.lineTo(6,-17);ctx.lineTo(-8,-17);ctx.closePath();ctx.fill();
        ctx.strokeStyle='rgba(249,237,205,.65)';ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(-7,-9);ctx.lineTo(-2,-38);ctx.stroke();
        ctx.fillStyle='rgba(50,64,68,.35)';ctx.beginPath();ctx.ellipse(0,-6,11,3.2,0,0,7);ctx.fill();
        ctx.restore();
      }
      ctx.restore();return;
    }
    const y=groundAt(h.x)??420;
    // Keep original collision dimensions; upgrade only rendered assets.
    const mapped={cart:['props_cart',117],scooter:['scooter',114],filmcrew:['filmmaker',114],roadblock:['props_cones',114],parcel:['props_cones',98]};
    const entry=mapped[h.type];
    if(entry&&images['v53_'+entry[0]]?.naturalWidth){
      ctx.save();const y=groundAt(h.x)??420;
      drawIllustratedProp(entry[0],h.x,y,entry[1],'danger');
      ctx.restore();return;
    }
    if(h.type==='filmcrew'){
      ctx.save();ctx.translate(h.x,y);
      ctx.strokeStyle='#263b45';ctx.lineWidth=5;
      ctx.beginPath();ctx.moveTo(-21,0);ctx.lineTo(-22,-66);ctx.lineTo(-45,-91);ctx.moveTo(-22,-66);ctx.lineTo(5,-92);ctx.stroke();
      ctx.fillStyle='#283741';ctx.fillRect(-61,-101,62,36);ctx.fillStyle='#f7b851';ctx.beginPath();ctx.arc(-36,-84,9,0,7);ctx.fill();
      ctx.fillStyle='#f3ae5f';ctx.fillRect(7,-33,29,33);ctx.fillStyle='#293a46';ctx.font='bold 11px sans-serif';ctx.fillText('TAKE 69',-19,-106);
      ctx.restore();
    }else if(h.type==='roadblock'){
      ctx.save();ctx.translate(h.x,y);ctx.fillStyle='#e5b06d';ctx.fillRect(-38,-40,76,40);
      ctx.fillStyle='#374b57';ctx.fillRect(-34,-36,68,28);ctx.fillStyle='#fff0bb';ctx.font='bold 11px sans-serif';ctx.fillText('TOLL',-25,-20);ctx.restore();
    }else if(h.type==='boombox'){
      ctx.save();ctx.translate(h.x,y);ctx.fillStyle='#293943';ctx.fillRect(-26,-42,56,42);
      ctx.fillStyle='#61a4a8';for(const xx of [-11,15]){ctx.beginPath();ctx.arc(xx,-22,12,0,7);ctx.fill();ctx.fillStyle='#21313e';ctx.beginPath();ctx.arc(xx,-22,5,0,7);ctx.fill();ctx.fillStyle='#61a4a8';}
      ctx.fillStyle='#e1c668';ctx.fillRect(-12,-47,26,5);ctx.restore();
    }else if(h.type==='parcel'){
      ctx.save();ctx.translate(h.x,y);ctx.fillStyle='#bb906b';ctx.fillRect(-26,-37,52,37);
      ctx.strokeStyle='#f3cf7e';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-26,-18);ctx.lineTo(26,-18);ctx.moveTo(0,-37);ctx.lineTo(0,0);ctx.stroke();
      ctx.fillStyle='#244653';ctx.font='bold 12px sans-serif';ctx.fillText('???',-13,-7);ctx.restore();
    }else if(h.type==='spikes'){
      ctx.fillStyle='#d35a3c';ctx.fillRect(h.x,y-11,h.w,12);
      ctx.fillStyle='#c3d1d2';ctx.strokeStyle='#2c444b';ctx.lineWidth=2;
      for(let x=h.x;x<h.x+h.w-7;x+=15){ctx.beginPath();ctx.moveTo(x,y-10);ctx.lineTo(x+7,y-42);ctx.lineTo(x+14,y-10);ctx.closePath();ctx.fill();ctx.stroke();}
    }else if(h.type==='barrel'||h.type==='roadwork'){
      ctx.fillStyle=h.type==='barrel'?'#d85142':'#ec8a2d';ctx.strokeStyle='#46322d';ctx.lineWidth=3;
      ctx.beginPath();ctx.roundRect(h.x-22,y-60,44,60,5);ctx.fill();ctx.stroke();
      ctx.fillStyle='#fff2cf';for(let j=0;j<2;j++)ctx.fillRect(h.x-20,y-47+j*25,40,8);
      ctx.fillStyle='#283b46';ctx.font='900 16px sans-serif';ctx.fillText(h.type==='barrel'?'!':'ARBETE',h.x-(h.type==='barrel'?4:30),y-16);
    }else if(h.type==='glass'){
      ctx.strokeStyle='#2d4650';ctx.fillStyle='#bbecf1';ctx.lineWidth=1.8;
      for(let j=0;j<7;j++){let x=h.x+j*8;ctx.beginPath();ctx.moveTo(x,y-1);ctx.lineTo(x+3,y-15-j%3*3);ctx.lineTo(x+10,y-2);ctx.closePath();ctx.fill();ctx.stroke();}
    }else if(h.type==='pothole'){
      ctx.fillStyle='#2c3a46';ctx.strokeStyle='#e4dcc4';ctx.lineWidth=3.2;ctx.beginPath();ctx.ellipse(h.x+h.w/2,y-3,h.w/2,16,-.04,0,7);ctx.fill();ctx.stroke();
      ctx.strokeStyle='#18222b';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(h.x-13,y-8);ctx.lineTo(h.x-2,y-5);ctx.lineTo(h.x+10,y-7);ctx.moveTo(h.x-1,y-5);ctx.lineTo(h.x+3,y-13);ctx.stroke();
      ctx.fillStyle='rgba(20,31,38,.55)';ctx.beginPath();ctx.ellipse(h.x+h.w/2,y+1,h.w*.34,7,0,0,7);ctx.fill();
      ctx.strokeStyle='rgba(228,210,180,.45)';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(h.x+h.w/2,y-4,h.w*.43,Math.PI*1.11,Math.PI*1.85);ctx.stroke();
    }else if(h.type==='scooter'){
      ctx.save();ctx.translate(h.x,y);ctx.strokeStyle='#31424a';ctx.lineWidth=5;
      for(const dx of [-24,33]){ctx.beginPath();ctx.arc(dx,-9,9,0,7);ctx.stroke();}
      ctx.strokeStyle='#54bac7';ctx.beginPath();ctx.moveTo(-24,-15);ctx.lineTo(27,-15);ctx.lineTo(18,-56);ctx.lineTo(42,-56);ctx.stroke();
      ctx.fillStyle='#ea8456';ctx.fillRect(-15,-26,22,10);ctx.restore();
    }else if(h.type==='cart'){
      ctx.save();ctx.translate(h.x,y);ctx.strokeStyle='#415461';ctx.lineWidth=4;ctx.fillStyle='#c3cad0';
      ctx.beginPath();ctx.moveTo(-27,-70);ctx.lineTo(20,-70);ctx.lineTo(13,-29);ctx.lineTo(-15,-29);ctx.closePath();ctx.fill();ctx.stroke();
      for(let j=-1;j<=1;j++){ctx.beginPath();ctx.moveTo(-17+j*12,-63);ctx.lineTo(-13+j*10,-33);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(-27,-70);ctx.lineTo(-39,-88);ctx.stroke();
      for(const dx of [-11,16]){ctx.fillStyle='#263845';ctx.beginPath();ctx.arc(dx,-13,9,0,7);ctx.fill();}ctx.restore();
    }else if(h.type==='brokenlamp'){
      ctx.save();ctx.translate(h.x,y);ctx.strokeStyle='#3a4d57';ctx.lineWidth=8;
      ctx.beginPath();ctx.moveTo(-34,0);ctx.lineTo(20,-71);ctx.lineTo(42,-71);ctx.stroke();
      ctx.fillStyle='#f1d87f';ctx.fillRect(20,-78,22,11);ctx.restore();
    }else if(h.type==='saw'){
      const x=h.x,yy=h.y;ctx.save();ctx.translate(x,yy);ctx.rotate(time*7);ctx.fillStyle='#82949c';ctx.strokeStyle='#2a3d46';ctx.lineWidth=4;
      for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.beginPath();ctx.moveTo(-12,-45);ctx.lineTo(0,-59);ctx.lineTo(12,-45);ctx.closePath();ctx.fill();ctx.stroke();}
      ctx.beginPath();ctx.arc(0,0,47,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#273b44';ctx.beginPath();ctx.arc(0,0,10,0,7);ctx.fill();ctx.restore();
      const base=groundAt(h.x)??yy+100;ctx.fillStyle='#293e48';ctx.fillRect(h.x-9,yy+46,18,Math.max(0,base-yy-45));
    }
  }
  window.BEARLY_ASSETS["v142_pizza_wrapper"]="assets/v142_pizza_wrapper.webp";
  // v10.53: actual Billy's Original rectangular pan pizza package reference.
  // The wrapper, logo and square pan pizza are one preloaded sprite, not a
  // round pizza painted into a separate cutout window.
  function drawStar(x,y){
    const art=images.v142_pizza_wrapper;
    if(!art?.naturalWidth)return;
    ctx.save();ctx.translate(x,y+Math.sin(time*2.8+x)*4);
    ctx.rotate(-.07+Math.sin(time*1.6+x*.001)*.06);
    ctx.shadowColor='rgba(255,207,105,.30)';ctx.shadowBlur=6;
    // Preserve the package's natural 704:403 shape instead of stretching it.
    ctx.drawImage(art,-V146_PIZZA_W/2,-V146_PIZZA_H/2,V146_PIZZA_W,V146_PIZZA_H);
    ctx.restore();
  }

  // Actual component-based rider: free-spinning wheels, bicycle frame, pedaling legs,
  // original BEAR illustration cut at the waist, and one detachable baby. No old
  // photo is present in the underlying bear sprite, so expression swaps cannot ghost.
  function inkLine(points,color,width,edge=0){
    ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
    for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
    if(edge){ctx.strokeStyle='#17222a';ctx.lineWidth=width+edge*2;ctx.stroke();}
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  }
  // v10.53 - Refined, slightly worn Swedish commuter bicycle. Artwork-only.
  // All geometry uses the unchanged local rider coordinate system and wheel hubs.
  // No wear state, damage animation, new particles, or gameplay variables.
  function commuterTube(a,b,width=9,paint='#287fb4',lit='#78bed6'){
    const dx=b[0]-a[0],dy=b[1]-a[1],ln=Math.hypot(dx,dy)||1;
    const nx=-dy/ln,ny=dx/ln;
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    const enamel=ctx.createLinearGradient(a[0]-4,a[1]-9,b[0]+5,b[1]+10);
    enamel.addColorStop(0,paint);enamel.addColorStop(.45,'#307b96');enamel.addColorStop(1,'#234b5e');
    for(const [w,col] of [[width+3,'#222d29'],[width+1,'#28474d'],[width,enamel]]){
      ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();
    }
    ctx.strokeStyle=lit;ctx.globalAlpha=.76;ctx.lineWidth=Math.max(1.2,width*.21);
    ctx.beginPath();ctx.moveTo(a[0]+nx*width*.21,a[1]+ny*width*.21);
    ctx.lineTo(b[0]+nx*width*.21,b[1]+ny*width*.21);ctx.stroke();
    // A few tiny, fixed chips in the enamel. They NEVER change as the bike is used.
    ctx.globalAlpha=.85;
    for(const t of [.26,.72]){
      const px=a[0]+dx*t+nx*width*.31,py=a[1]+dy*t+ny*width*.31;
      ctx.strokeStyle=t<.5?'#c7a484':'#8b9e9e';ctx.lineWidth=1.3;
      ctx.beginPath();ctx.moveTo(px-1.5,py);ctx.lineTo(px+1.5,py-.75);ctx.stroke();
    }
    ctx.restore();
  }
  function wheel(cx,cy,phase){
    // Original wheel radius/centre unchanged: the grounding and collision rig stays intact.
    ctx.save();ctx.translate(cx,cy);
    const r=WHEEL_RADIUS;
    // Rubber annulus with true open space between spokes; no opaque grey disc.
    const rubber=ctx.createLinearGradient(-r,-r,r,r);
    rubber.addColorStop(0,'#414940');rubber.addColorStop(.35,'#1e2826');rubber.addColorStop(1,'#111d1c');
    ctx.fillStyle=rubber;ctx.strokeStyle='#18221f';ctx.lineWidth=2.4;
    ctx.beginPath();ctx.arc(0,0,r+1,0,Math.PI*2);ctx.arc(0,0,r-7,0,Math.PI*2,true);ctx.fill('evenodd');ctx.stroke();
    const metal=ctx.createLinearGradient(-r,-r,r,r);metal.addColorStop(0,'#e7dbb8');metal.addColorStop(.35,'#9bafa8');metal.addColorStop(.66,'#536c69');metal.addColorStop(1,'#c4c6a9');
    ctx.strokeStyle=metal;ctx.lineWidth=3.4;ctx.beginPath();ctx.arc(0,0,r-9,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#324c49';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,r-12,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#a6a58c55';ctx.lineWidth=.8;
    for(let i=0;i<30;i++){const a=i*Math.PI*2/30+phase;ctx.beginPath();ctx.moveTo(Math.cos(a)*(r-2),Math.sin(a)*(r-2));ctx.lineTo(Math.cos(a+.025)*(r-4.5),Math.sin(a+.025)*(r-4.5));ctx.stroke();}
    // Fine spoke pattern rotates with existing wheel phase.
    ctx.save();ctx.rotate(phase);
    const spokes=16, spokeR=r-12;
    ctx.lineWidth=1.18;
    for(let i=0;i<spokes;i++){
      const a=i*2*Math.PI/spokes;
      ctx.strokeStyle=i%2?'#7e98a6':'#5f7886';
      ctx.beginPath();ctx.moveTo(Math.cos(a+.18)*4,Math.sin(a+.18)*4);
      ctx.lineTo(Math.cos(a)*spokeR,Math.sin(a)*spokeR);ctx.stroke();
    }
    // Fixed amber reflector turns with spokes, no animation allocations.
    ctx.rotate(.45);ctx.fillStyle='#e6a455';ctx.strokeStyle='#724a31';ctx.lineWidth=1;
    ctx.beginPath();ctx.roundRect(spokeR-5,-3.3,11,6.6,2);ctx.fill();ctx.stroke();
    ctx.restore();
    ctx.fillStyle='#283c47';ctx.strokeStyle='#aebdc2';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,6.3,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#d9dfd9';ctx.beginPath();ctx.arc(0,0,2.5,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  function frame(){
    // Matte chrome mudguards; slim enough not to alter either tire silhouette.
    ctx.save();ctx.lineCap='round';
    for(const cx of [REAR_X,FRONT_X]){
      ctx.strokeStyle='#273944';ctx.lineWidth=7;
      ctx.beginPath();ctx.arc(cx,WHEEL_Y,WHEEL_RADIUS+5,-Math.PI+.19,-.08);ctx.stroke();
      ctx.strokeStyle='#91a2a7';ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(cx,WHEEL_Y,WHEEL_RADIUS+5,-Math.PI+.20,-.09);ctx.stroke();
      ctx.strokeStyle='#d0c7ae';ctx.globalAlpha=.65;ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(cx,WHEEL_Y,WHEEL_RADIUS+3,-Math.PI+.3,-.2);ctx.stroke();
      ctx.globalAlpha=1;
    }
    // Visible rear rack and bracing behind the rider / child seat.
    inkLine([[38,209],[115,210]],'#394954',5,1.4);
    inkLine([[43,208],[74,269]],'#71858f',2.8,1);
    inkLine([[111,210],[74,267]],'#71858f',2.8,1);
    inkLine([[37,205],[102,206]],'#a4b1ac',1.8);
    // The familiar, unchanged blue city-bike geometry. Subtle scuffs are permanent.
    commuterTube([73,267],[124,209],9,'#1c79ae','#75b8d3');
    commuterTube([124,209],[164,266],10,'#1e83bb','#7fc2dc');
    commuterTube([164,266],[73,267],8,'#166b9f','#71a9c7');
    commuterTube([124,209],[221,209],9,'#2b8fc3','#8bc9e0');
    commuterTube([221,209],[164,266],9,'#1b78b1','#80bed9');
    commuterTube([221,209],[246,267],9,'#308dbe','#a0cbd6');
    // Reinforced old metal joints and hub, with small aged lugs.
    for(const [x,y] of [[124,209],[221,209],[164,266]]){
      ctx.fillStyle='#234b62';ctx.strokeStyle='#83a3aa';ctx.lineWidth=1.2;
      ctx.beginPath();ctx.arc(x,y,6.1,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#b2bdb7';ctx.beginPath();ctx.arc(x-1,y-1,1.65,0,Math.PI*2);ctx.fill();
    }
    // Seatpost, saddle, handlebar stem, textured grips and curved brake cable.
    inkLine([[124,209],[118,191]],'#515f64',5,1.3);
    ctx.fillStyle='#3b342e';ctx.strokeStyle='#151f24';ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(105,190);ctx.quadraticCurveTo(117,184,140,190);
    ctx.quadraticCurveTo(137,195,114,195);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#a08a74';ctx.globalAlpha=.65;ctx.lineWidth=1.1;
    ctx.beginPath();ctx.moveTo(111,190);ctx.lineTo(131,190);ctx.stroke();ctx.globalAlpha=1;
    inkLine([[221,209],[211,181],[234,176]],'#485159',6.5,1.4);
    inkLine([[216,185],[231,180]],'#a5b3b7',2);
    ctx.strokeStyle='#2c3537';ctx.lineWidth=6;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(228,176);ctx.lineTo(240,178);ctx.stroke();
    ctx.strokeStyle='#c1af8e';ctx.lineWidth=1.5;
    for(let i=0;i<3;i++){
      ctx.beginPath();ctx.moveTo(230+i*3,175);ctx.lineTo(229+i*3,180);ctx.stroke();
    }
    ctx.strokeStyle='#454e52';ctx.lineWidth=1.8;
    ctx.beginPath();ctx.moveTo(229,181);ctx.bezierCurveTo(257,193,261,210,249,235);ctx.stroke();
    ctx.strokeStyle='#b9c2c0';ctx.lineWidth=1.1;
    ctx.beginPath();ctx.moveTo(225,183);ctx.lineTo(233,184);ctx.stroke();
    // Two small wheel-mount nuts: no dynamic part loss.
    for(const x of [REAR_X,FRONT_X]){
      ctx.fillStyle='#aebec2';ctx.strokeStyle='#293944';ctx.lineWidth=1.4;
      ctx.beginPath();ctx.arc(x,WHEEL_Y,4.5,0,Math.PI*2);ctx.fill();ctx.stroke();
    }
    // Rear red safety reflector and a mellow silver front lamp.
    ctx.fillStyle='#aa443e';ctx.strokeStyle='#3a4144';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.roundRect(24,206,8,11,2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#cdd5c9';ctx.beginPath();ctx.roundRect(236,213,9,10,3);ctx.fill();
    ctx.restore();
  }
  function childSeat(){
    ctx.save();ctx.lineJoin='round';
    ctx.fillStyle='#465560';ctx.strokeStyle='#20313e';ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(10,128);ctx.quadraticCurveTo(5,135,7,152);ctx.lineTo(9,185);
    ctx.quadraticCurveTo(13,206,37,208);ctx.lineTo(65,207);ctx.quadraticCurveTo(78,205,80,191);
    ctx.lineTo(77,142);ctx.quadraticCurveTo(72,127,61,127);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#6b7f90';ctx.beginPath();ctx.roundRect(14,136,48,55,11);ctx.fill();
    ctx.strokeStyle='#9cb8c9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(15,148);ctx.lineTo(15,185);ctx.stroke();
    inkLine([[70,207],[105,218]],'#465b6d',5,2);
    // Permanent rubbed edges, mounting bolts and seat-shell texture.
    ctx.strokeStyle='#a1a8a4';ctx.globalAlpha=.64;ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(15,140);ctx.lineTo(12,159);
    ctx.moveTo(69,151);ctx.lineTo(71,175);ctx.stroke();ctx.globalAlpha=1;
    for(const [x,y] of [[17,202],[70,202],[75,189]]){
      ctx.fillStyle='#aab6b5';ctx.strokeStyle='#2d444d';ctx.lineWidth=1.2;
      ctx.beginPath();ctx.arc(x,y,3.1,0,Math.PI*2);ctx.fill();ctx.stroke();
    }
    ctx.restore();
  }

  function nearestHazardAhead(range=180){
    let d=1e9, found=null;
    for(const h of hazards){
      const hx=h.x+(h.w||0)*0.5;
      if(hx>=bike.x && hx<=bike.x+range && hx-bike.x<d){d=hx-bike.x;found=h;}
    }
    return found?{hazard:found,dist:d}:null;
  }
  function mountedBabyAnim(){
    if(state==='won')return {pose:(Math.floor((time-winAt)*3)%2===0?'laugh':'point'),expr:'happy',reason:'victory dance'};
    if(demo.active){
      const st=demo.stage;
      const map={RIDE:'laugh',WHEELIE:'leanBack',JUMP:'brace',LANDING:'landing',CRASH:'brace'};
      const pose=map[st]||'idle';
      return {pose,expr:pose==='brace'?'terrified':'happy',reason:'stunt demo'};
    }
    // Pose selection is event-driven. The panic meter affects the face/lines,
    // but cannot keep the physical baby bracing through ordinary cruising.
    const speed=Math.abs(bike.vx);
    const accelerating=keys.has('ArrowUp')||keys.has('KeyW');
    const braking=keys.has('ArrowDown')||keys.has('KeyS');
    const replyActive=dialogueActive && dialogueActive.who==='BABY'
      && time-dialogueStartedAt<0.65;
    const settle={pose:'idle',expr:'original_photo',reason:'not riding'};
    if(state!=='playing')return settle;
    if(time<pukeWaveEnd && (speed>=MAX_SPEED*PUKE_SPEED_RATIO||(panicEpisodeType==='PUKE ATTACK'&&time<panicEpisodeUntil)))return {pose:'sick',expr:'sick',reason:'puke heave'};
    if(time<damagePoseUntil)return {pose:'bump',expr:'terrified',reason:'impact'};
    if(!bike.contact && airTime>.18)return {pose:'brace',expr:'terrified',reason:'normal riding hop'};
    if(time<landingPoseUntil)return landingWasHard?{pose:'brace',expr:'terrified',reason:'hard landing'}:{pose:'leanForward',expr:'confused',reason:'soft landing'};
    if(time<hazardReactUntil || time<bumpPoseUntil)return {pose:'brace',expr:'terrified',reason:'danger'};
    if(braking && speed>24)return {pose:'leanForward',expr:'confused',reason:'braking'};
    if(motion.wheelie>.19 || (accelerating&&speed>35&&time-throttleStartedAt<.78))return {pose:'leanBack',expr:panic>65?'terrified':'excited',reason:'wheelie/acceleration'};
    if(replyActive&&speed>20)return {pose:'point',expr:'happy',reason:'baby reply'};
    if(panic>76 || speed>MAX_SPEED*TERROR_SPEED_RATIO)return {pose:'brace',expr:'terrified',reason:'speed panic'};
    if(panic>43)return {pose:'leanForward',expr:'confused',reason:'uneasy riding'};
    if(speed>MAX_SPEED*.39)return {pose:'laugh',expr:'happy',reason:'enjoying cruise'};
    if(speed>MAX_SPEED*.10)return {pose:'idle',expr:'happy',reason:'easy roll'};
    return {pose:'idle',expr:'original_photo',reason:'stopped'};
  }
  function crashSequenceStage(){
    if(state!=='dead'&&state!=='dead_end')return 'none';
    const age=time-motion.crashAt;
    if(age<0.18)return 'crash';
    const babyFlying=!!baby && (!baby.grounded || Math.abs(baby.vy)>70);
    const bearGrounded=!!bearThrown && groundAt(bearThrown.x)!==null && bearThrown.y+26>=groundAt(bearThrown.x)-1;
    const bearSliding=!!bearThrown && bearGrounded && Math.abs(bearThrown.vx)>55;
    const babySliding=!!baby && baby.grounded && Math.abs(baby.vx)>65;
    if(age<0.72 || babyFlying || (!bearGrounded && !!bearThrown))return 'flyoff';
    if(bearSliding || babySliding)return 'drag';
    return 'recover';
  }
  function thrownBearStage(){
    if(!bearThrown)return 'flyoff';
    const stage=crashSequenceStage();
    if(stage==='crash')return 'crash';
    if(stage==='flyoff')return 'flyoff';
    if(stage==='drag')return 'drag';
    return 'recover';
  }
  function thrownBabyPose(){
    if(!baby)return 'falling';
    const age=Math.max(0,time-motion.crashAt);
    if(baby.restAt>=0)return 'cry_wet';
    // Use one consistent airborne sprite family to avoid apparent popping,
    // clipping and head-size changes during the ejection arc.
    // Ground CONTACT, not elapsed time, ends the AIRTIME art. The death
    // animation must not become a grounded tumble while still in the sky.
    if(baby.landedAt<0 || !baby.grounded)return 'airtime';
    // Contact determines the state, not how long the camera has been following.
    if(time-baby.landedAt<.18)return 'impact';
    return 'cry_wet';
  }
  function childSeatFront(){
    // Side-profile front details and harness, not camera-facing rails.
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    // rear rim behind baby head and shoulder
    inkLine([[13,150],[12,179],[20,196]],'#425363',7,2);
    // front torso/waist guard in profile
    inkLine([[62,166],[72,173],[71,188]],'#425363',7,2);
    // shoulder straps and center buckle
    inkLine([[30,151],[42,170]],'#26394c',5,1);
    inkLine([[49,152],[43,170]],'#26394c',5,1);
    inkLine([[43,169],[43,188]],'#26394c',5,1);
    ctx.fillStyle='#f3c84b';ctx.strokeStyle='#1c303f';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(37,165,11,10,3);ctx.fill();ctx.stroke();
    // narrow lap bar seen from the side
    ctx.fillStyle='#647c8d';ctx.strokeStyle='#253c4b';ctx.lineWidth=3;
    ctx.beginPath();ctx.roundRect(28,183,34,10,5);ctx.fill();ctx.stroke();
    // front foot/leg strap area
    ctx.fillStyle='#445665';ctx.beginPath();ctx.roundRect(58,187,12,7,3);ctx.fill();
    ctx.restore();
  }

  function drawBabyReactionMarks(pose){
    // Simple readable acting accent, drawn relative to the *fixed seat*.
    // No physical motion is applied to the baby, seat or bear body.
    const urgent=pose==='airtime'||pose==='brace'||pose==='landing'||pose==='bump';
    if(!urgent)return;
    ctx.save(); ctx.translate(26,70);
    const jig=Math.sin(time*16)*2;
    ctx.rotate(-.12);ctx.textAlign='center';
    ctx.font='900 29px sans-serif';ctx.lineWidth=4;
    ctx.strokeStyle='#1d3040';ctx.fillStyle=pose==='airtime'?'#ffdc5e':'#ffffff';
    const mark=pose==='airtime'?'!!':pose==='brace'?'?!':pose==='landing'?'!':'?';
    ctx.strokeText(mark,jig,0);ctx.fillText(mark,jig,0);
    ctx.restore();
  }
function babyFigure(expr, thrown=false, pose='idle'){
  // Side-view baby actor matched closer to the reference sheet.
  const rideKick=Math.sin(bike.cycle*.42);
  let torso={x:28,y:145,w:28,h:38,rot:-0.08};
  let headX=41, headY=130, headRot=thrown?0:babyHead;
  let faceX=-33, faceY=-61, faceW=70, faceH=76;
  let backLeg=[[34,176],[42,186],[48,196]], frontLeg=[[39,175],[50,185],[58,196]];
  let backArm=[[32,154],[44,161]], frontArm=[[39,156],[53,164]];
  if(thrown){ headX=0; headY=0; faceX=6; faceY=72; torso={x:22,y:145,w:28,h:38,rot:-0.08}; }
  switch(pose){
    case 'laugh':
      torso.y=142; torso.rot=-0.18; headRot-=0.08; backArm=[[31,152],[43,149]]; frontArm=[[39,154],[58,151]];
      backLeg=[[34,176],[41,186],[47,196]]; frontLeg=[[39,175],[51,184],[60,194]]; expr='happy';
      break;
    case 'leanBack':
      torso.x=24; torso.y=144; torso.rot=-0.28; headRot-=0.16; headX=38; backArm=[[30,154],[39,163]]; frontArm=[[36,156],[49,167]];
      backLeg=[[34,176],[40,188],[47,201]]; frontLeg=[[39,175],[45,188],[49,201]];
      break;
    case 'leanForward':
      torso.x=33; torso.y=146; torso.rot=0.18; headRot+=0.12; headX=45; backArm=[[34,156],[47,164]]; frontArm=[[41,158],[61,168]];
      backLeg=[[35,176],[46,186],[56,197]]; frontLeg=[[40,176],[54,186],[67,197]];
      break;
    case 'point':
      torso.x=30; torso.rot=-0.06; headRot-=0.05; backArm=[[32,155],[43,164]]; frontArm=[[40,156],[69,151]];
      break;
    case 'brace':
      torso.x=30; torso.y=149; torso.rot=0.08; headRot+=0.18; backArm=[[31,157],[25,168]]; frontArm=[[40,158],[58,168]];
      backLeg=[[35,176],[44,187],[52,199]]; frontLeg=[[40,176],[51,187],[60,199]];
      break;
    case 'airtime':
      torso.x=28; torso.y=137; torso.rot=-0.14; headY=124; headRot-=0.12; backArm=[[31,152],[19,141]]; frontArm=[[40,153],[61,142]];
      backLeg=[[34,175],[44,182],[54,188]]; frontLeg=[[39,174],[56,180],[70,188]]; expr=panic>55?'terrified':'excited';
      break;
    case 'landing':
      torso.x=31; torso.y=151; torso.rot=0.14; headY=134; headRot+=0.12; backArm=[[32,158],[28,167]]; frontArm=[[41,159],[56,169]];
      backLeg=[[35,176],[45,188],[54,201]]; frontLeg=[[40,176],[53,188],[63,201]];
      break;
    case 'bump':
      torso.x=29; torso.y=147; torso.rot=-0.16; headRot-=0.15; backArm=[[31,154],[24,163]]; frontArm=[[40,156],[56,171]];
      backLeg=[[34,176],[43,188],[51,201]]; frontLeg=[[39,176],[52,184],[64,196]];
      break;
    case 'sick':
      torso.x=33; torso.y=151; torso.rot=0.18; headX=46; headY=136; headRot+=0.26; backArm=[[33,157],[31,168]]; frontArm=[[41,159],[46,171]];
      backLeg=[[35,176],[46,188],[55,201]]; frontLeg=[[40,176],[52,188],[62,201]]; expr='sick';
      break;
    case 'falling':
      torso.x=24; torso.y=145; torso.rot=-0.26; headRot-=0.24; backArm=[[28,154],[13,147]]; frontArm=[[36,156],[59,145]];
      backLeg=[[31,176],[42,185],[51,192]]; frontLeg=[[36,175],[55,181],[72,188]]; expr='terrified';
      break;
    case 'ragdoll':
      torso.x=26; torso.y=149; torso.rot=0.34; headRot=0.22; backArm=[[30,156],[20,174]]; frontArm=[[38,158],[59,171]];
      backLeg=[[33,177],[42,193],[46,208]]; frontLeg=[[39,176],[54,191],[67,205]]; expr='knocked';
      break;
    case 'drag':
      torso.x=25; torso.y=151; torso.rot=0.46; headRot=0.28; backArm=[[29,157],[21,173]]; frontArm=[[37,159],[47,174]];
      backLeg=[[33,177],[39,194],[38,210]]; frontLeg=[[39,176],[48,194],[51,211]]; expr='knocked';
      break;
    case 'impact':
      torso.x=29; torso.y=153; torso.rot=0.24; headRot=0.18; backArm=[[31,158],[22,165]]; frontArm=[[40,160],[54,165]];
      backLeg=[[34,177],[43,192],[48,207]]; frontLeg=[[39,176],[52,191],[62,206]]; expr='knocked';
      break;
    case 'pedal':
    default:
      backLeg=[[34,176],[42+rideKick*1.1,186],[48+rideKick*1.9,197]];
      frontLeg=[[39,175],[50+rideKick*1.7,185],[58+rideKick*2.5,196]];
      backArm=[[32,154],[44+rideKick*0.6,161]]; frontArm=[[39,156],[53+rideKick*1.0,164]];
      break;
  }
  function drawLimb(points,color,width,outline=1.4,alpha=1){
    ctx.save();ctx.globalAlpha=alpha; inkLine(points,color,width,outline); ctx.restore();
  }
  function drawBoot(x,y,alpha=1){
    ctx.save();ctx.globalAlpha=alpha; ctx.fillStyle='#244d68';ctx.strokeStyle='#1e3542';ctx.lineWidth=3;
    ctx.beginPath();ctx.roundRect(x,y,18,11,5);ctx.fill();ctx.stroke(); ctx.restore();
  }
  ctx.save();ctx.lineJoin='round';
  // rear limbs slightly faded for side-view depth
  drawLimb(backLeg,'#4b95bf',10,2,0.75); drawLimb(frontLeg,'#56a2d0',12,2,1);
  drawBoot(backLeg[2][0]-3, backLeg[2][1]-3, 0.8); drawBoot(frontLeg[2][0]-5, frontLeg[2][1]-3, 1);
  // torso side-view
  ctx.save();
  ctx.translate(torso.x+torso.w/2,torso.y+torso.h/2); ctx.rotate(torso.rot); ctx.translate(-(torso.x+torso.w/2),-(torso.y+torso.h/2));
  ctx.fillStyle='#62b6e9';ctx.strokeStyle='#173949';ctx.lineWidth=3;
  ctx.beginPath();ctx.roundRect(torso.x,torso.y,torso.w,torso.h,11);ctx.fill();ctx.stroke();
  // side body fold and chest emblem hint
  inkLine([[torso.x+7,torso.y+7],[torso.x+20,torso.y+23]],'#243b50',4);
  inkLine([[torso.x+18,torso.y+6],[torso.x+8,torso.y+28]],'#243b50',3);
  ctx.fillStyle='#f9cf4b';ctx.beginPath();ctx.arc(torso.x+19,torso.y+24,4.5,0,7);ctx.fill();
  ctx.restore();
  drawLimb(backArm,'#d8a88f',8,1.2,0.72); drawLimb(frontArm,'#e0b098',10,1.4,1);
  if(!thrown){ ctx.save();ctx.translate(headX,headY);ctx.rotate(headRot); face(expr,faceX,faceY,faceW,faceH);ctx.restore(); }
  else { face(expr,faceX,faceY,faceW,faceH); }
  ctx.restore();
}
// Art-matched leg sprite cut from the ORIGINAL illustrated bear. The animation
  // moves the whole illustrated boot around a small pedal orbit; no vector rods
  // or circles are drawn over the bear's body or face.
  function pedalLeg(phase,far=false,intensity=1,offsetY=0){
    const art=images.bear_leg_original;
    if(!art || !art.complete || !art.naturalWidth)return;
    // The original illustrated boot remains tucked under the thigh through the
    // entire cycle. An exaggerated orbit made it detach from the body in v1.1.
    const ampX=9+Math.min(3,intensity*1.1), ampY=4+Math.min(2,intensity*.7);
    const footX=162+ampX*Math.cos(phase), footY=248+ampY*Math.sin(phase)+offsetY;
    ctx.save();
    ctx.translate(footX,footY);
    ctx.rotate(.045*Math.sin(phase)+.013*Math.sin(phase*2));
    if(far)ctx.globalAlpha=.85;
    // This PNG was cropped from original coordinates x=101..184, y=202..271.
    // Its natural foot pivot is roughly (148,248) in the original art.
    ctx.drawImage(art,101-148,202-248);
    ctx.restore();
  }
  // One source of truth for the on-bike sprite and the panic-meter portrait.
  function mountedBabyCelName(pose){
    if(previewPose && babyFrameNames.includes(previewPose))return previewPose;
    if(time<pukeWaveEnd && (bike.vx>=MAX_SPEED*PUKE_SPEED_RATIO||(panicEpisodeType==='PUKE ATTACK'&&time<panicEpisodeUntil)))return 'sick';
    if(pose==='sick')return 'sick';
    if(pose==='airtime'||pose==='bump')return 'terror';
    if(pose==='landing')return 'leanForward';
    if(pose==='pedal'||pose==='laugh')return 'laugh';
    if(['leanBack','leanForward','point','brace'].includes(pose))return pose;
    return 'idle';
  }
  // V10.51: exact pre-V149 visual rig, shape, head size and seat mount.
  function mountedBabyFrame(pose,expr='happy'){
    // Two face swaps; identical underlying original chair/body and old anchors.
    // ALL other emotions render unmodified v10.48 mounted artwork.
    const emotion=v149Emotion();
    const selected=emotion==='excited'?'excited':emotion==='sick'?'sick':null;
    let f=mountedBabyCelName(pose);
    if(emotion==='terrified' && (f==='brace'||pose==='landing'||pose==='bump'))f='terror';
    const im=(selected&&images['v151_baby_pose_'+selected]?.naturalWidth
        ?images['v151_baby_pose_'+selected]:images['baby_pose_'+f])||images.baby_pose_idle;
    const base=selected==='excited'?'leanBack':selected==='sick'?'sick':f;
    window.BEARLY_FRAME_STATS={f:selected?'v151_'+selected:f,exists:!!im,complete:!!im?.complete,
      naturalWidth:im?.naturalWidth||0,pose,anchor:base};
    if(!im?.complete||!im.naturalWidth)return;
    const anchor=babyFrameAnchors[base]||babyFrameAnchors.idle;
    // Lock the SAME visible mounting bolt (not each sprite canvas centre) to the rack.
    // Align to one rear rack mount AND one visual seated height. Historical
    // pose cutouts used different capture sizes, especially terror/lean-back.
    // Normalizing the distance from crown to rack removes sudden size jumps.
    const scale=1.08; // Every chair shares the same rack mount and physical scale.
    const ax=43,ay=207;
    ctx.drawImage(im,ax-anchor[0]*scale,ay-anchor[1]*scale,im.naturalWidth*scale,im.naturalHeight*scale);
    // A continuous understated lower attachment to the bike's rear rack.
    ctx.strokeStyle='rgba(34,53,66,.9)';ctx.lineWidth=3;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(40,208);ctx.lineTo(71,216);ctx.stroke();
  }
  function crashBabyFrame(pose){
    const k={airtime:'v149_airtime',falling:'baby_crash_falling',flail:'v125_baby_flail',roll:'v125_baby_roll',
      ragdoll:'baby_crash_ragdoll',skid:'v125_baby_skid',impact:'baby_crash_impact',
      drag:'baby_crash_drag',cry_wet:'v125_baby_cry_wet',
      launch:'v131_baby_launch',reach:'v131_baby_reach',curl:'v131_baby_curl',
      twist:'v131_baby_twist',brace:'v131_baby_brace',side_slide:'v131_baby_side_slide',
      final_turn:'v131_baby_final_turn'}[pose]||'baby_crash_impact';
    const im=images[k];if(!im?.naturalWidth)return false;
    // Author-new variants have slightly larger transparent bounds. Normalize
    // their perceived width while preserving original anatomy and proportions.
    // Different cels include very different transparent padding: normalize
    // by the visible head, not the bitmap dimensions. Launched baby now
    // matches the size of the baby just before leaving the rear seat.
    const scale={falling:1.04,flail:1.08,roll:1.08,ragdoll:1.02,skid:1.00,
      impact:1.02,drag:1.02,cry_wet:1.03,
      airtime:.88,launch:1.23,reach:1.23,curl:1.22,twist:1.24,brace:1.10,
      side_slide:1.04,final_turn:1.05}[pose]||1.03;
    ctx.drawImage(im,-im.naturalWidth*scale*.5,-im.naturalHeight*scale*.51,
      im.naturalWidth*scale,im.naturalHeight*scale);
    return true;
  }

  const bearPoseNames=['idle','pedal','coast','brake','wheelie','jump','land','hurt'];
  function mountedBearPose(){
    if(state==='won'){
      const age=time-winAt;
      if(age<.80)return 'brake';
      // A three-beat pose sequence: lean up, dance/pedal, final fist-pump lift.
      if(age<1.65)return 'wheelie';
      if(age<2.40)return 'jump';
      if(age<3.2)return 'pedal';
      if(age<4.25)return 'wheelie';
      return 'jump';
    }
    if(demo.active){const pose={RIDE:'pedal',WHEELIE:'wheelie',JUMP:'jump',LANDING:'land',CRASH:'hurt'}[demo.stage];if(pose)return pose;}
    if(previewBearPose)return previewBearPose;
    if(state==='dead'||state==='dead_end')return 'hurt';
    if(time<damagePoseUntil)return 'hurt';
    if(!bike.contact && airTime>0.075 && hasEverGrounded)return 'jump';
    if(time<landingPoseUntil)return 'land';
    const localSlope=bike.contact ? slopeAt(bike.x+24) : 0;
    if(bike.contact && (bike.a-localSlope<-.25 || motion.wheelie>.38) && Math.abs(bike.vx)>45)return 'wheelie';
    if((keys.has('ArrowDown')||keys.has('KeyS')) && Math.abs(bike.vx)>20)return 'brake';
    if(Math.abs(bike.vx)>23 && (keys.has('ArrowUp')||keys.has('KeyW')))return 'pedal';
    if(Math.abs(bike.vx)>23)return 'coast';
    return 'idle';
  }
  function bearPoseAngles(pose,phase){
    switch(pose){
      case 'pedal': return {head:-.025+.045*Math.sin(phase),arm:.039*Math.sin(phase+.5)};
      case 'coast': return {head:-.012+.022*Math.sin(time*2.4),arm:-.019};
      case 'brake': return {head:.083,arm:.067};
      case 'wheelie': return {head:.096,arm:-.075};
      case 'jump': return {head:.082,arm:-.068};
      case 'land': return {head:-.090,arm:.077};
      case 'hurt': return {head:-.092,arm:.065};
      default: return {head:.008*Math.sin(time*2.4),arm:0};
    }
  }
  // Dedicated illustrated pose cels preserve the bear's overall anatomy. They
  // replace the unstable practice of moving torso/head/arm independently in-frame.
  function bearSpeedFaceStage(){
    if(state==='won')return 3;
    if(state==='dead'||state==='dead_end'||bike.broken)return 1;
    const speed=Math.max(0,bike.vx);
    return speed<MAX_SPEED*.22?0:speed<MAX_SPEED*.43?1:speed<MAX_SPEED*.66?2:speed<MAX_SPEED*.84?3:4;
  }
  // v7.7: every riding pose now contains its own painted face for each speed.
  // The face_* artwork in the archive belongs to the BABY, not the bear.
  function bearBodyArt(pose,phase){
    const noRightArm=lostParts.has('rightArm');
    const pedalIndex=Math.floor((((bike.cycle*.44)%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI/2))%4;
    // Keep the fully colored face and opaque hockey jersey on damage.
    // The hurt reaction is expressed with bike recoil, not a faded sprite.
    const safePose=pose==='hurt'?'coast':pose;
    const original=(safePose==='pedal'&&!noRightArm)?(images['bear_pedal_'+pedalIndex]||images.bear_pose_pedal):images['bear_pose_'+safePose];
    if(noRightArm && images.bear_upper_rightarm_injured?.naturalWidth){
      ctx.drawImage(window.BearlyHero.sprite(images.bear_upper_rightarm_injured),0,0);
    }else if(original?.naturalWidth){ctx.drawImage(window.BearlyHero.sprite(original),0,0);}
    else if(images.bear_upper?.naturalWidth){ctx.drawImage(window.BearlyHero.sprite(images.bear_upper),0,0);}
  }
  function drawRiderWounds(){
    const severity=clamp((100-health)/95,0,1);
    if(severity<.09 && !lostParts.size)return;
    ctx.save();
    // Small shaded scrapes on the hockey kit, progressively stronger, never on the face.
    const scars=[[140,158],[120,180],[174,185],[139,202],[154,130],[160,168]];
    const visible=Math.max(lostParts.size,Math.ceil(severity*5));
    for(let i=0;i<visible;i++){
      const [x,y]=scars[i%scars.length];ctx.strokeStyle='rgba(119,14,22,'+(0.35+severity*.45)+')';
      ctx.lineWidth=1.7+severity;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(x-5,y-2);ctx.lineTo(x+4,y+1);ctx.moveTo(x-1,y+2);ctx.lineTo(x+6,y+4);ctx.stroke();
    }
    ctx.restore();
  }
  // The bear's original facial artwork is left completely untouched.
  function bicycleDrive(phase, speed){
    // Chain, chainring, crank arms and foot pedals share one gear phase.
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    inkLine([[81,254],[163,249]],'#26353b',3.5,1);
    inkLine([[82,280],[164,283]],'#26353b',3.5,1);
    // A moving bright link every ~9 px makes chain motion readable at normal speed.
    ctx.strokeStyle='#d7a951';ctx.lineWidth=1.7;
    const progress=((phase*15)%10+10)%10;
    for(let x=86+progress;x<162;x+=10){
      ctx.beginPath();ctx.moveTo(x,250.5);ctx.lineTo(x+4,250.3);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x,281.8);ctx.lineTo(x+4,281.9);ctx.stroke();
    }
    ctx.fillStyle='#132633';ctx.strokeStyle='#a5b2b8';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(164,266,16,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.save();ctx.translate(164,266);ctx.rotate(phase);
    ctx.strokeStyle='#91a6af';ctx.lineWidth=3.5;
    for(let i=0;i<5;i++){const a=i*2*Math.PI/5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(12*Math.cos(a),12*Math.sin(a));ctx.stroke();}
    ctx.restore();
    for(const angle of [phase,phase+Math.PI]){
      const px=164+18*Math.cos(angle),py=266+18*Math.sin(angle);
      inkLine([[164,266],[px,py]],'#9caeb6',4,1);
      ctx.save();ctx.translate(px,py);ctx.rotate(angle*.22);
      ctx.fillStyle='#1c2b32';ctx.strokeStyle='#9caab0';ctx.lineWidth=2;
      ctx.beginPath();ctx.roundRect(-12,-4,24,8,3);ctx.fill();ctx.stroke();ctx.restore();
    }
    ctx.restore();
  }
  // Single coherent illustrated leg.
  // Single coherent illustrated leg. Unlike the old vector IK, the knee and boot
  // are ONE artwork piece and cannot turn into disconnected rods/circles.
  function drawPedalLeg(phase,far=false,pose='pedal'){
    if((far && lostParts.has('leftLeg')) || (!far && lostParts.has('rightLeg')))return;
    const im=images.bear_leg_clean||images.bear_leg_original;
    if(!im?.naturalWidth)return;
    const orbitX=pose==='jump'?6.0:pose==='land'?7.0:9.0;
    const orbitY=pose==='jump'?3.0:4.5;
    const x=(far?156:162)+orbitX*Math.cos(phase);
    const y=(far?246:248)+orbitY*Math.sin(phase)+(pose==='land'?1.5:0);
    // Position from original cutout pivot (source x=148,y=248).
    // Paint full fur-to-boot art so the upper leg overlaps the hip naturally.
    ctx.save();ctx.globalAlpha=far?.76:1;
    ctx.translate(x,y);ctx.rotate(0.036*Math.sin(phase));
    ctx.drawImage(window.BearlyHero.sprite(im),-47,-46);
    ctx.restore();
  }
  function drawSpeedWheels(p){
    const speed=Math.abs(p.vx);if(speed<MAX_SPEED*.58)return;
    const alpha=clamp((speed-MAX_SPEED*.58)/(MAX_SPEED*.42)*.4,0,.4);
    ctx.save();ctx.strokeStyle='rgba(236,249,255,'+alpha.toFixed(3)+')';ctx.lineWidth=4;
    for(const wx of [REAR_X,FRONT_X]){
      ctx.beginPath();ctx.arc(wx,WHEEL_Y,35,p.cycle+.3,p.cycle+1.7);ctx.stroke();
      ctx.beginPath();ctx.arc(wx,WHEEL_Y,27,p.cycle+2,p.cycle+3.1);ctx.stroke();
    }
    ctx.restore();
  }

  // Illustration-cel mode. Frames here are CUT FROM THE USER'S ACTUAL REFERENCE SHEET,
  // not simulated rotations of the old bear_upper picture. The entire rider/seat/bike
  // silhouette changes for wheelies, jumps and landings. Normal pedaling still uses
  // the rigged drivetrain so feet and chain stay responsive.
  function sheetPoseFor(pose,p){
    // Archived reference poses are not production-ready: their wheelbase, tire
    // radii and lower image bounds do not align with the physics rig. Switching
    // in/out created a scale jump and floating duplicate wheel centers.
    // Only the one correctly aligned animated bike is rendered in gameplay.
    return null;
  }
  function drawReferenceAction(name,phase){
    const im=images['bear_sheet_'+name],m=referenceAnchors[name];
    if(!im?.naturalWidth||!m)return;
    // Reference source was upscaled 3x when extracted. Reference point: rear hub.
    // Keep the wheel contact anchor and player physics position constant across poses.
    const scale=2.05/3;
    const x=REAR_X-m.rear[0]*3*scale, y=WHEEL_Y-m.rear[1]*3*scale;
    ctx.drawImage(im,x,y,im.naturalWidth*scale,im.naturalHeight*scale);
    // Animated inner wheel discs replace the frozen-looking spokes in the sheet.
    // Original illustrated tires / wheel outlines remain untouched.
    for(const hub of [m.rear,m.front]){
      const cx=x+hub[0]*3*scale,cy=y+hub[1]*3*scale;
      const radius=12.4*3*scale;
      ctx.save();ctx.translate(cx,cy);ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);
      ctx.fillStyle='rgba(223,231,233,.95)';ctx.fill();
      ctx.strokeStyle='#728a96';ctx.lineWidth=2.0;ctx.stroke();
      ctx.rotate(phase);ctx.strokeStyle='#9ba9b3';ctx.lineWidth=1.45;
      for(let j=0;j<12;j++){const a=j*Math.PI/6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*(radius-2),Math.sin(a)*(radius-2));ctx.stroke();}
      ctx.fillStyle='#314650';ctx.beginPath();ctx.arc(0,0,4.6,0,Math.PI*2);ctx.fill();ctx.restore();
    }
  }

  function updateStuntMotion(dt){
    // Layered, critically damped signals—not free joints while riding.
    const p=bike;
    const slope=p.contact?slopeAt(p.x+24):0;
    const leanBack=(keys.has('ArrowLeft')||keys.has('KeyA'))&&p.vx>95&&p.contact;
    const wheelieGoal=(state==='playing'&&p.contact&&Math.abs(p.vx)>35)?
      Math.max(smooth(.12,.4,-(p.a-slope)),leanBack?.95:0,time<motion.demoWheelieUntil?1:0):0;
    const airGoal=(state==='playing'&&!p.contact&&hasEverGrounded&&time-motion.launchAt<2.5&&airTime>.12)?1:0;
    motion.wheelie=lerp(motion.wheelie,wheelieGoal,1-Math.exp(-dt*9));
    motion.air=lerp(motion.air,airGoal,1-Math.exp(-dt*13));
    const landAge=time-motion.landAt;
    const impactAge=time-motion.impactAt;
    const hopAge=time-motion.launchAt;
    const land=(landAge>=0&&landAge<1.1)?motion.landPower*Math.exp(-landAge*8)*Math.sin(landAge*29):0;
    const impact=(impactAge>=0&&impactAge<.52)?motion.impactPower*Math.exp(-impactAge*11)*Math.sin(impactAge*23):0;
    motion.recoil=clamp(7.5*land + 2.4*impact,-8,8);
    const landPulse=(landAge>=0&&landAge<.68)?motion.landPower*Math.exp(-landAge*7)*Math.abs(Math.cos(landAge*17)):0;
    motion.squash=clamp(landPulse,0,1);
    const airTilt=motion.air*(-.09+clamp(p.vy/600,-1,1)*.16);
    const release=(hopAge>=0&&hopAge<.65)?Math.sin(Math.PI*smooth(0,.65,hopAge))*.045:0;
    // Extra pitch is applied to the entire bicycle about the rear wheel hub.
    // The pivot is why the rear tire remains on the ground in a wheelie.
    motion.extraPitch=clamp(-.36*motion.wheelie + airTilt - release + land*.045 + impact*.02,-.49,.19);
    motion.legKick=(hopAge>=0&&hopAge<.7)?Math.sin(Math.PI*smooth(0,.7,hopAge)):0;
    if(p.broken){
      const stage=crashSequenceStage();
      const age=Math.max(0,time-motion.crashAt);
      const snap=smooth(0,.16,age), settle=smooth(.18,1.15,age);
      motion.extraPitch=clamp(.15+.27*snap-.18*settle,-.12,.34);
      motion.recoil+=Math.sin(age*30)*Math.exp(-age*5)*2.2;
      motion.legKick=Math.max(0,Math.sin(age*10))*Math.exp(-age*1.6);
      motion.stunt=stage;
      return;
    }
    motion.stunt=motion.air>.6?'jump':motion.wheelie>.46?'wheelie':
      landAge>=0&&landAge<.45?'landing':'ride';
  }

  function drawActionLines(p,pose){
    // Sparse hand-drawn motion trails in the SAME local frame as the bicycle.
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    const speed=clamp(Math.abs(p.vx)/250,0,1);
    if(motion.air>.3 || motion.legKick>.3){
      const strength=Math.max(motion.air,motion.legKick);
      ctx.globalAlpha=.35+.47*strength;
      ctx.strokeStyle='#fff9d9';ctx.lineWidth=3.2;
      for(let i=0;i<3;i++){
        const off=(time*70+i*19)%28;
        ctx.beginPath();ctx.moveTo(25-off,184+i*22);ctx.lineTo(-4-off,190+i*22);ctx.stroke();
      }
      ctx.strokeStyle='#f7c45b';ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(REAR_X,WHEEL_Y,51,Math.PI*.85,Math.PI*1.35);ctx.stroke();
    }
    if(motion.wheelie>.22){
      ctx.globalAlpha=.25+.65*motion.wheelie;ctx.strokeStyle='#f5ce76';ctx.lineWidth=3.8;
      const flick=Math.sin(time*19)*5;
      for(let i=0;i<3;i++){
        ctx.beginPath();ctx.moveTo(12+i*9,298+i*3+flick);
        ctx.lineTo(-8+i*8,312+i*3+flick);ctx.stroke();
      }
    }
    const age=time-motion.landAt;
    if(age>=0&&age<.40){
      const t=age/.4;
      ctx.globalAlpha=(1-t)*(.32+motion.landPower*.58);
      ctx.strokeStyle='#fef8d5';ctx.lineWidth=3.8;
      for(const x of [REAR_X,FRONT_X]){
        const r=34+24*easeOut(t);
        ctx.beginPath();ctx.arc(x,WHEEL_Y+WHEEL_RADIUS,r,Math.PI*1.12,Math.PI*1.91);ctx.stroke();
      }
    }
    if(speed>.65 && p.contact){
      ctx.globalAlpha=.28*speed;ctx.strokeStyle='#f6fcff';ctx.lineWidth=2.3;
      for(let i=0;i<2;i++){
        const drift=(time*80+i*32)%37;
        ctx.beginPath();ctx.moveTo(5-drift,209+i*44);ctx.lineTo(-15-drift,209+i*44);ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawPukeWheelResidue(){
    if(time>=pukeWheelSlipUntil || state!=='playing')return;
    const fade=Math.max(0,Math.min(1,(pukeWheelSlipUntil-time)/2.5));
    ctx.save();ctx.globalAlpha=.72*fade;
    for(let k=0;k<5;k++){
      const a=2.45+k*.32+bike.cycle*.04;
      const x=REAR_X+(WHEEL_RADIUS-2)*Math.cos(a);
      const y=WHEEL_Y+(WHEEL_RADIUS-2)*Math.sin(a);
      ctx.fillStyle=k%2?'#a0c75a':'#81ae4b';
      ctx.beginPath();ctx.ellipse(x,y,2.3+k%2,3.4,0,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  function drawCrashedBike(){
    if(!bike.broken)return false;
    const age=time-motion.crashAt;
    if(age<.58)return false; // first impact uses ordinary rotating bike
    const im=images.v89_bike_crashed;
    if(!im?.naturalWidth)return false;
    const floor=groundAt(bike.x);
    if(floor===null)return false;
    ctx.save();ctx.translate(bike.x+95,floor);
    // The actual bent bicycle artwork, grounded against the SAME road surface.
    const w=133,h=w*im.naturalHeight/im.naturalWidth;
    ctx.fillStyle='rgba(28,37,42,.20)';ctx.beginPath();ctx.ellipse(0,-3,67,6,0,0,Math.PI*2);ctx.fill();
    ctx.drawImage(im,-61,-h+5,w,h);
    // Keep empty rear child seat attached to the fallen bike.
    ctx.save();ctx.translate(-45,-71);ctx.rotate(-.32);ctx.scale(.31,.31);
    childSeat();childSeatFront();ctx.restore();
    ctx.restore();return true;
  }
  function drawBike(){
    if(drawCrashedBike())return;
    const p=bike;if(p.x<cameraX-420||p.x>cameraX+W+420)return;
    const actualSheet=selectedSheetPose();
    if(actualSheet && drawSheetPose(actualSheet,p))return;
    const babyAnim=mountedBabyAnim();let bearPose=mountedBearPose();
    if(bearPose==='jump' && state!=='won' && (bike.contact||time-motion.launchAt>=2.5||airTime<.15))bearPose='pedal';
    if(bearPose==='land' && time-motion.launchAt>=2.9)bearPose='pedal';
    const crashAge=time-motion.crashAt;
    const crashLocked=p.broken && crashAge<0.18;
    const bikePose=crashLocked?'hurt':bearPose;
    const sheetPose=sheetPoseFor(bikePose,p);
    if(sheetPose){
      const demoLift=previewBearPose==='jump'?55:previewBearPose==='wheelie'?10:0;
      ctx.save();ctx.translate(p.x,p.y-demoLift);
      if(sheetPose==='ride'||sheetPose==='recover')ctx.rotate(p.a);
      ctx.scale(ART_SCALE,ART_SCALE);ctx.translate(-ART_ORIGIN_X,-ART_ORIGIN_Y);
      drawReferenceAction(sheetPose,p.cycle);ctx.restore();return;
    }
    // One coherent drivetrain phase — pedals, bear feet, crank, wheel rotations.
    const crankPhase=p.cycle*.44;
    if(bikePose!==motion.pose){motion.previousPose=motion.pose;motion.pose=bikePose;motion.poseAt=time;}
    const recoil=motion.recoil;
    // The pose-preview key also demonstrates the complete bicycle action.
    // Rotate and lift the WHOLE assembly: no loose torso or detached baby.
    const demoAngles={wheelie:-.39,jump:-.12,land:.075,brake:.035,hurt:.11};
    const demoLift=previewBearPose==='jump'?62:previewBearPose==='wheelie'?12:0;
    const demoAngle=previewBearPose?(demoAngles[previewBearPose]||0):0;
    const crashDive=crashLocked?lerp(.12,.52,smooth(0,.18,crashAge)):0;
    const victoryAge=state==='won'?time-winAt:-1;
    const victoryHop=victoryAge>.65 ? Math.pow(Math.max(0,Math.sin((victoryAge-.65)*Math.PI*2*1.55)),1.15)*23:0;
    const victoryTilt=victoryAge>.65 ? .075*Math.sin((victoryAge-.65)*9.8):0;
    ctx.save();ctx.translate(p.x,p.y+recoil-demoLift-victoryHop-(crashLocked?10*smooth(0,.18,crashAge):0));ctx.rotate(p.a+demoAngle+crashDive+victoryTilt);
    ctx.scale(ART_SCALE,ART_SCALE);ctx.translate(-ART_ORIGIN_X,-ART_ORIGIN_Y);
    // Local rear-hub pivot keeps both tires, all limbs, and the child seat together.
    const extra=(previewBearPose?0:motion.extraPitch)+(crashLocked?0.06:0);
    ctx.translate(REAR_X,WHEEL_Y);ctx.rotate(extra);ctx.translate(-REAR_X,-WHEEL_Y);
    // Impact compression affects the entire assembly, never isolated bear limbs.
    const squash=clamp(motion.squash||0,0,1);
    if(squash){ctx.translate(164,WHEEL_Y+WHEEL_RADIUS);ctx.scale(1+0.055*squash,1-0.105*squash);ctx.translate(-164,-(WHEEL_Y+WHEEL_RADIUS));}
    // The same fixed bike coordinate frame keeps feet, wheels, head and passenger aligned.
    inkLine([[40,210],[74,215],[122,209]],'#344a59',7,2);
    inkLine([[43,216],[77,222],[118,216]],'#738b9c',3,1);
    inkLine([[76,260],[76,220]],'#344a59',5,2);
    wheel(REAR_X,WHEEL_Y,p.cycle);wheel(FRONT_X,WHEEL_Y,p.cycle);
    if((!p.broken||crashLocked) && !lostParts.has('leftLeg'))drawPedalLeg(crankPhase+Math.PI,true,bikePose);
    frame();
    bicycleDrive(crankPhase,p.vx);
    if((!p.broken||crashLocked) && !lostParts.has('rightLeg'))drawPedalLeg(crankPhase,false,bikePose);
    if(!p.broken||crashLocked){bearBodyArt(bikePose,crankPhase);drawRiderWounds();}
    // Seat frame is bolted onto the bike rack, in the same transform as BOTH wheels.
    // It is never independently moved, scaled, or rotated by the baby's reaction.
    ctx.save();ctx.lineCap='round';ctx.strokeStyle='#263d4d';ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(29,204);ctx.lineTo(76,214);ctx.lineTo(85,223);
    ctx.moveTo(46,204);ctx.lineTo(80,224);ctx.stroke();ctx.restore();
    if(!baby){mountedBabyFrame(p.broken?'brace':babyAnim.pose,p.broken?'terrified':babyAnim.expr);}
    else { // Only during a real crash, after the baby has bounced free.
      childSeat();childSeatFront();
    }
    drawPukeWheelResidue();
    drawSpeedWheels(p);
    if(!p.broken||crashLocked)drawActionLines(p,bikePose);
    if((bearPose==='jump'||bearPose==='wheelie') && p.vx>90){
      ctx.save();ctx.strokeStyle='rgba(255,255,255,.74)';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.moveTo(87,305);ctx.lineTo(106,319);ctx.moveTo(109,301);ctx.lineTo(125,312);ctx.stroke();ctx.restore();
    }
    if(p.vx>MAX_SPEED*.55){
      ctx.save();ctx.strokeStyle='rgba(238,251,255,.75)';ctx.lineWidth=2.5;ctx.lineCap='round';
      for(let i=0;i<3;i++){
        const yy=177+i*27,shift=(time*(p.vx/6)+i*29)%56;
        ctx.beginPath();ctx.moveTo(-13-shift,yy);ctx.lineTo(12-shift,yy);ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }
  function face(expression,x,y,w,h){
    const img=images['face_'+expression]||images.face_original_photo;
    if(!img||!img.complete||!img.naturalWidth)return;
    ctx.save();ctx.shadowColor='#101a2155';ctx.shadowBlur=1.6;ctx.drawImage(img,x,y,w,h);ctx.restore();
  }
  function drawBearThrown(){
    if(!bearThrown || time-motion.crashAt<.18 || (demo.active&&demo.stage==='RECOVER'))return;
    const b=bearThrown, upright=images.bear_upper;
    const floor=groundAt(b.x);
    const landed=floor!==null && (b.y+29>=floor-12 || (time-motion.crashAt>1.0 && Math.abs(b.vy)<160));
    if(landed){
      const bits=(lostParts.has('rightArm')?1:0)|(lostParts.has('leftArm')?2:0)|
                 (lostParts.has('leftLeg')?4:0)|(lostParts.has('rightLeg')?8:0);
      const prone=images['v87_prone_'+bits] || images.v85_bear_prone_crash;
      if(prone?.naturalWidth){
        // Actual crash art, matching the bike character size (v8.5 used .43 and grew too large).
        const s=.285, px=b.x-235*s, py=floor-148*s;
        ctx.save();ctx.translate(px,py);ctx.drawImage(prone,0,0,prone.naturalWidth*s,prone.naturalHeight*s);
        // Progressive visible wounds remain on the physical body, NOT the abandoned bike.
        const marks={rightArm:[370,110],leftArm:[163,125],leftLeg:[101,103],rightLeg:[128,112]};
        for(const limb of lostParts){
          const at=marks[limb]; if(!at)continue;
          ctx.fillStyle='rgba(118,11,18,.72)';ctx.beginPath();ctx.ellipse(at[0]*s,at[1]*s,5,3,0,0,Math.PI*2);ctx.fill();
        }
        ctx.restore();return;
      }
    }
    if(!upright?.naturalWidth)return;
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle);ctx.scale(ART_SCALE,ART_SCALE);
    const leg=images.bear_leg_clean||images.bear_leg_original;
    if(leg?.naturalWidth){
      for(let i=0;i<2;i++){
        if(lostParts.has(i?'rightLeg':'leftLeg'))continue;
        ctx.save();ctx.translate(-10+i*19,22);ctx.rotate((i?-.22:.16)+Math.sin(time*6+i*2)*.15);
        ctx.drawImage(leg,-37,-13);ctx.restore();
      }
    }
    // Use the amputated right-arm pose whenever needed; never regrow it mid-tumble.
    const torso=lostParts.has('rightArm')?images.bear_upper_rightarm_injured:upright;
    ctx.drawImage(torso?.naturalWidth?torso:upright,-ART_ORIGIN_X+20,-ART_ORIGIN_Y+14);
    ctx.restore();
  }
  function drawSeatThrown(){
    if(!seatThrown || time-motion.crashAt<0.18 || (demo.active&&demo.stage==='RECOVER'))return;
    ctx.save();ctx.translate(seatThrown.x,seatThrown.y);ctx.rotate(seatThrown.angle);ctx.scale(ART_SCALE*0.9,ART_SCALE*0.9);ctx.translate(-45,-170);
    childSeat();childSeatFront();
    ctx.restore();
  }
  function v131DrawBabyCrashDust(){
    if(!baby || baby.landedAt<0 || !(state==='dead'||state==='dead_end'||demo.crashed))return;
    const age=time-baby.landedAt;
    if(age<0||age>1.15)return;
    const ground=groundAt(baby.x);if(ground==null)return;
    ctx.save();ctx.globalCompositeOperation='source-over';
    // Dust is a few warm, soft puffs, anchored to the ROAD collision point.
    const spread=clamp(age/.8,0,1), fade=Math.pow(1-clamp(age/1.15,0,1),1.6);
    for(let i=0;i<5;i++){
      const sign=i%2?-1:1, magnitude=9+i*9;
      const x=baby.x+sign*magnitude*(.6+spread), y=ground-3-(i%3)*5-age*(14+i*7);
      const radius=(8+i*2)*(1+spread*.45);
      const puff=ctx.createRadialGradient(x,y,1,x,y,radius);
      puff.addColorStop(0,'rgba(203,214,216,'+(fade*.24)+')');
      puff.addColorStop(1,'rgba(203,214,216,0)');
      ctx.fillStyle=puff;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
    }
    // Contact and skid follow asphalt grade. No floating rectangular gravel patch.
    ctx.globalAlpha=fade*.26;ctx.strokeStyle='#9ea7a9';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(baby.x-38*(1-spread),ground-2);ctx.lineTo(baby.x+10,ground-2);ctx.stroke();
    ctx.restore();
  }
  function v131DrawAirMotion(){
    if(!baby || baby.landedAt>=0 || !(state==='dead'||state==='dead_end'||demo.crashed))return;
    const age=time-motion.crashAt;
    if(age<.06||age>.82)return;
    ctx.save();ctx.strokeStyle='rgba(255,232,188,.55)';ctx.lineCap='round';
    for(let i=0;i<3;i++){
      const dx=32+i*13,dy=15+i*12;
      ctx.globalAlpha=.44*(1-clamp(age/.85,0,1));ctx.lineWidth=1.7-i*.24;
      ctx.beginPath();ctx.moveTo(baby.x-dx,baby.y+dy);ctx.quadraticCurveTo(baby.x-dx-12,baby.y+dy-8,baby.x-dx-23,baby.y+dy-3);ctx.stroke();
    }
    ctx.restore();
  }
  function drawBaby(){
    if(!baby || (demo.active&&demo.stage==='RECOVER'))return;
    if(debugSettings.particles){v131DrawBabyCrashDust();v131DrawAirMotion();}
    ctx.save();ctx.translate(baby.x,baby.y);
    // Hold the original airborne angle until impact. Once on the road, use
    // the REAL landing side and tilt, not one universal right-facing angle.
    const landedRotation=baby.landingTilt||0;
    ctx.rotate(baby.restAt>=0?landedRotation:baby.grounded?landedRotation:baby.angle*.46);
    if(baby.restAt>=0 && baby.landingFacing<0)ctx.scale(-1,1);
    ctx.scale(ART_SCALE,ART_SCALE); // all crash cels centred on local mass
    const crying=state==='dead'||state==='dead_end'||(demo.active&&demo.crashed);
    const pose=(crying && baby.restAt>=0)?'cry_wet':thrownBabyPose();
    // A short transition occurs only AFTER physical road contact.
    // The airborne artwork remains fully visible for the complete flight.
    const contactAge=baby.landedAt<0?-1:time-baby.landedAt;
    const blend=(state==='dead'||state==='dead_end') && baby.grounded
      && contactAge>=0 && contactAge<.17 && baby.restAt<0;
    if(blend){
      const t=smooth(0,.17,contactAge);
      ctx.save();ctx.globalAlpha=1-t;crashBabyFrame('airtime');ctx.restore();
      ctx.save();ctx.globalAlpha=t;crashBabyFrame('impact');ctx.restore();
    }else if(!crashBabyFrame(pose)){
      ctx.translate(-39,-145);babyFigure(baby.expr,true,pose);
    }
    ctx.restore();
    if((state==='dead'||state==='dead_end'||demo.crashed) && baby.grounded && baby.restAt>=0){
      drawBabyUrineFront();
      drawBabyCrying();
    }
  }
  // The final crying sprite is 153x88 and is rendered by crashBabyFrame() at
  // ART_SCALE * 1.06 about its own centre. These source-image positions map to
  // the two closed eyes and the front of the romper/diaper respectively.
  // Apply the EXACT same sprite rotation as drawBaby(), so the effects never
  // detach if the baby shifts while finishing the skid.
  function babySpriteAnchor(which){
    if(!baby)return null;
    const img=images.v125_baby_cry_wet || images.baby_crash_drag;
    if(!img?.naturalWidth)return null;
    // New padded cel is the old complete pose shifted 21px right / 6px down.
    const anchors={eyeUpper:[117,58],eyeLower:[132,69],diaper:[64,68]};
    const a=anchors[which];if(!a)return null;
    const scale=ART_SCALE*1.03;
    const dx=(a[0]-img.naturalWidth*.5)*scale;
    const dy=(a[1]-img.naturalHeight*.51)*scale;
    const rotation=baby.restAt>=0?(baby.landingTilt||0):baby.angle*.46;
    const facing=baby.restAt>=0?(baby.landingFacing||1):1;
    const co=Math.cos(rotation),si=Math.sin(rotation);
    return {x:baby.x+(dx*facing)*co-dy*si,y:baby.y+(dx*facing)*si+dy*co};
  }
  var v126PeeEmission=0;
  function updateBabyCrying(dt){
    const crying=!!baby&&(state==='dead'||state==='dead_end'||(demo.active&&demo.crashed))&&baby.grounded&&baby.restAt>=0;
    if(crying){
      if(cryingStartedAt<0){
        cryingStartedAt=time;babyPeeUntil=time+2.5;
        const outlet=babySpriteAnchor('diaper');
        baby.peeBorn=time;
        baby.peeCentre=outlet?outlet.x+5:baby.x-14;
      }
      if(time>cryingNextSound){sound('cry');cryingNextSound=time+rand(2.5,3.3);}
      // A pair of small visible tears begin at the eyelids, not at the torso.
      if(Math.random()<dt*17){
        const source=babySpriteAnchor(Math.random()<.5?'eyeUpper':'eyeLower');
        if(source){
          cryTearsEmitted++;
          cryingTears.push({x:source.x,y:source.y,
            vx:rand(4,16),vy:rand(13,28),life:rand(.52,.88),r:rand(1.55,2.5)});
        }
      }
      // Accumulate real-time emission, not Math.ceil(dt*n): the latter created
      // 120 tiny drops per second at the fixed 120Hz simulation rate.
      if(time<babyPeeUntil){
        v126PeeEmission+=dt*24;
        const source=babySpriteAnchor('diaper');
        while(v126PeeEmission>=1 && source){
          v126PeeEmission-=1;
          babyPeeDrops.push({x:source.x+rand(-1.3,1.3),y:source.y+rand(-.8,.8),
            vx:rand(-3,13),vy:rand(24,43),life:.9,r:rand(1.25,2.05)});
        }
      }
    }
    for(const d of cryingTears){
      d.x+=d.vx*dt;d.y+=d.vy*dt;d.vy+=115*dt;d.life-=dt;
    }
    for(let i=cryingTears.length-1;i>=0;i--)if(cryingTears[i].life<=0)cryingTears.splice(i,1);
    for(let i=babyPeeDrops.length-1;i>=0;i--){
      const d=babyPeeDrops[i];d.vy+=580*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.life-=dt;
      const g=groundAt(d.x);
      if(d.life<=0 || (g!==null&&d.y>=g-2)){
        if(g!==null&&d.y>=g-4){
          babyPeeMarks.push({x:d.x,y:g-1,born:time,r:rand(1.5,2.8)});
          if(babyPeeMarks.length>22)babyPeeMarks.shift();
        }
        babyPeeDrops.splice(i,1);
      }
    }
    for(let i=babyPeeMarks.length-1;i>=0;i--)if(time-babyPeeMarks[i].born>10)babyPeeMarks.splice(i,1);
    if(cryingTears.length>30)cryingTears.splice(0,cryingTears.length-30);
    if(babyPeeDrops.length>45)babyPeeDrops.splice(0,babyPeeDrops.length-45);
  }
  function drawBabyCrying(){
    if(!baby||baby.restAt<0)return;
    ctx.save();ctx.lineCap='round';
    // Two short translucent streaks connect the effect to the actual eyelids.
    for(const eye of ['eyeUpper','eyeLower']){
      const p=babySpriteAnchor(eye);if(!p)continue;
      const wobble=Math.sin(time*6+(eye==='eyeUpper'?0:1.3))*1.0;
      ctx.strokeStyle='rgba(85,207,252,.80)';ctx.lineWidth=1.65;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.quadraticCurveTo(p.x+2,p.y+4,p.x+3+wobble,p.y+8);ctx.stroke();
      ctx.fillStyle='rgba(185,239,255,.91)';ctx.beginPath();ctx.arc(p.x+3+wobble,p.y+8,1.9,0,Math.PI*2);ctx.fill();
    }
    for(const d of cryingTears){
      ctx.globalAlpha=clamp(d.life*1.45,0,.92);ctx.fillStyle='#83d9f9';
      ctx.beginPath();ctx.ellipse(d.x,d.y,d.r*.85,d.r*1.48,.14,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(239,255,255,.85)';ctx.beginPath();ctx.arc(d.x-.45,d.y-.65,.57,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  function drawBabyPee(){
    ctx.save();
    // One pooled wet patch in world space. It grows only while emission occurs,
    // stays at the collision surface, and survives the transparent retry panel.
    if(baby && baby.peeBorn>=0){
      const age=Math.max(0,time-baby.peeBorn);
      const wet=clamp(age/2.0,0,1);
      const x=baby.peeCentre;
      const y=groundAt(x);
      if(y!==null && wet>0){
        const w=(6+25*wet),h=(2.1+5.2*wet);
        ctx.globalAlpha=.29+.25*wet;
        ctx.fillStyle='#ae9b4c';ctx.beginPath();ctx.ellipse(x+2,y-1,w+5,h+2,-.035,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=.62;
        ctx.fillStyle='#dfc86d';ctx.beginPath();ctx.ellipse(x,y-1,w,h,-.035,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=.52;ctx.strokeStyle='#f8e1a0';ctx.lineWidth=1.25;
        ctx.beginPath();ctx.ellipse(x-3,y-2,w*.70,h*.62,-.035,Math.PI*.97,Math.PI*1.93);ctx.stroke();
        ctx.globalAlpha=.25;ctx.fillStyle='#fff0b7';ctx.beginPath();ctx.ellipse(x-8,y-2,Math.max(3,w*.36),Math.max(1,h*.18),0,0,Math.PI*2);ctx.fill();
      }
    }
    // Small landing droplets connect the falling stream to the puddle.
    for(const d of babyPeeMarks){
      ctx.globalAlpha=clamp((10-(time-d.born))/10,0,.46);ctx.fillStyle='#e2ca72';
      ctx.beginPath();ctx.ellipse(d.x,d.y,d.r*1.25,Math.max(.7,d.r*.30),0,0,Math.PI*2);ctx.fill();
    }
    for(const d of babyPeeDrops){
      ctx.globalAlpha=clamp(d.life*1.6,0,.87);ctx.fillStyle='#f3d87c';
      ctx.beginPath();ctx.ellipse(d.x,d.y,d.r*.78,d.r*1.35,0,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  function drawBabyUrineFront(){
    // A tiny visible source and falling arc emerge in front of the baby's
    // diaper region; the pre-existing puddle is still drawn behind the sprite.
    if(!baby || baby.peeBorn<0 || time>=babyPeeUntil)return;
    const origin=babySpriteAnchor('diaper');
    if(!origin)return;
    const ground=groundAt(baby.peeCentre);
    if(ground===null)return;
    ctx.save();ctx.globalAlpha=.79;ctx.lineCap='round';
    ctx.strokeStyle='#e6c65a';ctx.lineWidth=1.75;
    ctx.beginPath();ctx.moveTo(origin.x,origin.y);
    ctx.quadraticCurveTo(origin.x+8,origin.y+4,baby.peeCentre,ground-2);ctx.stroke();
    ctx.fillStyle='#ffed9c';ctx.beginPath();ctx.arc(origin.x,origin.y,1.75,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  function drawFragments(){
    if(demo.active&&demo.stage==='RECOVER')return;
    for(const f of fragments){
      const isArm=f.kind.includes('Arm');
      const art=images[isArm?'bear_glove_part':'bear_leg_original'];
      if(!art||!art.complete||!art.naturalWidth)continue;
      ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.angle);
      // The original illustrated assets, not oversized vector clubs.
      const scale=isArm?.43:.39;
      ctx.scale(scale,scale);
      ctx.drawImage(art,-art.naturalWidth*.5,-art.naturalHeight*.5);
      ctx.restore();
    }
  }
  function drawImpactCues(){
    for(const cue of impactCues){
      const age=time-cue.at,life=clamp(1-age/.77,0,1);
      if(life<=0)continue;
      const r=15+age*145, passenger=cue.kind==='passenger';
      ctx.save();ctx.translate(cue.x,cue.y);ctx.globalAlpha=life;
      ctx.strokeStyle=passenger?'#a6e9ff':'#ffe5a3';ctx.lineWidth=3.5*life+1;
      ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=passenger?'#69d5f6':'#ffa358';ctx.lineWidth=3.5;
      for(let i=0;i<7;i++){const a=i*Math.PI*2/7+age*1.3;
        ctx.beginPath();ctx.moveTo(Math.cos(a)*(r+4),Math.sin(a)*(r+4));
        ctx.lineTo(Math.cos(a)*(r+12+10*life),Math.sin(a)*(r+12+10*life));ctx.stroke();}
      // Impact feedback is purely visual; no labels above characters.
      ctx.restore();
    }
  }
  function drawEncounterAtmosphere(){
    if(state==='dead'||state==='dead_end')return;
    if(encounterHeat<.015)return;
    // Gentle coloured edges rise around an encounter and ease out as the street goes calm.
    const alpha=(encounterHeat*.15).toFixed(3),edge=ctx.createLinearGradient(0,0,W,0);
    edge.addColorStop(0,`rgba(190,83,41,${alpha})`);
    edge.addColorStop(.21,'rgba(255,166,88,0)');edge.addColorStop(.79,'rgba(255,166,88,0)');
    edge.addColorStop(1,`rgba(190,83,41,${alpha})`);
    ctx.fillStyle=edge;ctx.fillRect(0,0,W,H);
    const warning=currentEncounter();
    const active=warning&&warning.c.phase==='warn';
    const flying=projectiles.find(p=>p.x>bike.x-230&&p.x<bike.x+840);
    if(!active&&!flying)return;
    const label=active?'DODGE · '+projectileLabels[warning.crew.item]+' IN '+Math.max(0,.91-(time-warning.c.since)).toFixed(1)+'s'
      :'DODGE · '+projectileLabels[flying.kind]+' IN FLIGHT';
    ctx.save();ctx.textAlign='center';ctx.font='900 15px Impact, sans-serif';
    const tw=ctx.measureText(label).width+52, bx=(W-tw)/2,by=99;
    ctx.fillStyle='rgba(30,48,56,.83)';ctx.strokeStyle=active?'#fbd286':'#ffae7f';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(bx,by,tw,39,11);ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff0cc';ctx.fillText(label,W/2,by+26);
    if(active){const progress=clamp((time-warning.c.since)/1.05,0,1);
      ctx.fillStyle='#ffb75a';ctx.fillRect(bx+10,by+34,(tw-20)*(1-progress),3);}
    ctx.restore();
  }
  function drawEffects(){
    for(const stain of stainMarks){ctx.globalAlpha=stain.alpha;ctx.fillStyle='#a91d27';ctx.beginPath();ctx.ellipse(stain.x,stain.y,stain.r,Math.max(2,stain.r*.28),0,0,7);ctx.fill();}
    for(const b of blood){ctx.globalAlpha=Math.min(1,b.life);ctx.fillStyle=b.color;ctx.beginPath();ctx.ellipse(b.x,b.y,b.r*1.35,b.r*.76,(b.vx||0)*.003,0,7);ctx.fill();}
    for(const p of groundDust){ctx.globalAlpha=clamp(p.life*1.4,0,.5);ctx.fillStyle='#f0ede2';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();}
    for(const p of sparks){ctx.globalAlpha=clamp(p.life,0,1);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();}
    ctx.globalAlpha=1;
  }
  function drawVictoryCelebration(){
    if(state!=='won')return;
    const age=time-winAt;
    if(age<.4)return;
    const x=bike.x,y=bike.y-142;
    ctx.save();
    ctx.textAlign='center';
    // Timed star/confetti showers, deterministic so particles don't flicker.
    const colors=['#ffe48c','#f4b57e','#a7d7ce','#f2d7da','#ffffff'];
    for(let n=0;n<46;n++){
      const seed=n*2.399963;
      const wave=(age-.4)*.52+n*.127;
      const dx=Math.sin(seed)* (34+(n%9)*14)+Math.sin(age*2+n)*10;
      const dy=-Math.abs(Math.cos(seed*1.7))*(46+(n%8)*16)+(wave%2.6)*67;
      const alpha=Math.max(0,Math.min(1,(age-.35)*2.2))*(.4+.45*Math.abs(Math.sin(age*4+n)));
      ctx.fillStyle=colors[n%colors.length];ctx.globalAlpha=alpha;
      ctx.save();ctx.translate(x+dx,y+dy);ctx.rotate(age*4+(n%6));
      const r=2+(n%3)*1.05;
      if(n%5===0){ctx.beginPath();for(let k=0;k<8;k++){const a=k*Math.PI/4,rr=k%2?r:r*2.1;k?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();}
      else ctx.fillRect(-r*.7,-r*.7,r*1.4,r*1.4);
      ctx.restore();
    }
    // Victory title deliberately appears AFTER the rider brakes, and stays
    // above the actors without covering the face or the bicycle.
    const rise=Math.min(1,(age-.4)*2.1);
    ctx.globalAlpha=rise;
    ctx.translate(x,y-110-6*Math.sin(age*3));
    ctx.font='900 25px Impact, system-ui, sans-serif';
    ctx.lineJoin='round';ctx.lineWidth=5;ctx.strokeStyle='#213842';
    ctx.strokeText('BEARLY QUALIFIED!',0,0);
    ctx.fillStyle='#ffe59e';ctx.fillText('BEARLY QUALIFIED!',0,0);
    if(age>2.3){ctx.globalAlpha=Math.min(1,(age-2.3)*2);ctx.font='bold 14px system-ui,sans-serif';ctx.lineWidth=3;ctx.strokeText('MÄLAREN CLEARED · PARTY TIME',0,24);ctx.fillStyle='#fff4de';ctx.fillText('MÄLAREN CLEARED · PARTY TIME',0,24);}
    ctx.restore();
  }
  function drawParkedBike(){
    ctx.save();ctx.translate(bike.x,bike.y);ctx.rotate(bike.a);ctx.scale(ART_SCALE,ART_SCALE);ctx.translate(-ART_ORIGIN_X,-ART_ORIGIN_Y);
    wheel(REAR_X,WHEEL_Y,bike.cycle);wheel(FRONT_X,WHEEL_Y,bike.cycle);frame();bicycleDrive(bike.cycle*.44,0);childSeat();const babyAlpha=window.BearlyVisits?.roadBabyAlpha()??1;if(babyAlpha>0){ctx.save();ctx.globalAlpha*=babyAlpha;const a=mountedBabyAnim();mountedBabyFrame(a.pose,a.expr);ctx.restore();}
    inkLine([[164,267],[149,305]],'#53675e',3,1);ctx.restore();
  }
  function autumnBikePresentation(){
    if(window.BearlyVisits?.roadPresentation(ctx,illustratedState(),bike,drawBike,drawParkedBike))return;
    if(!$('introOverlay').hidden){
      // Title composition is visual only: place our original duo beside the title.
      const shift=490;
      const target=groundAt(bike.x+shift)??groundAt(bike.x)??446;
      const lift=target-bike.y-riderY(WHEEL_Y)-TIRE_R;
      ctx.save();ctx.fillStyle='rgba(30,35,24,.27)';ctx.beginPath();ctx.ellipse(bike.x+shift-7,target+2,66,7,0,0,Math.PI*2);ctx.fill();ctx.translate(shift,lift);drawBike();ctx.restore();
    }else drawBike();
  }
  function render(){
    ctx.setTransform(rendering.scale,0,0,rendering.scale,0,0);
    if(window.BearlyCentrumSquare?.render(ctx,W,H))return;
    if(window.BearlyVisits?.render(ctx,W,H))return;
    ctx.clearRect(0,0,W,H);window.BearlyWorld.sky(ctx,illustratedState());
    ctx.save();ctx.translate(W*.32,H*.22);ctx.scale(1.35,1.35);ctx.translate(-W*.32,-H*.22);ctx.translate(-cameraX+(cameraShake?(Math.random()-.5)*cameraShake:0),-cameraY+(cameraShake?(Math.random()-.5)*cameraShake*.6:0));
    groundDraw();window.BearlyCentrumLink?.renderRouteMarker(ctx,groundAt);if($('introOverlay').hidden)drawGroundedBikeShadow();if(debugSettings.particles){drawPukeSplashes();drawEffects();drawBabyPee();}autumnBikePresentation();if(debugSettings.particles)drawPukeFlow();drawVictoryCelebration();drawThrownItems();if(debugSettings.particles)drawImpactCues();drawProjectileImpactFX();
    const compositeSheet=demo.active && !!selectedSheetPose();
    if(!compositeSheet){drawBearThrown();drawSeatThrown();if(!window.BearlyVisits?.hideRoadBaby())drawBaby();drawFragments();}
    if(debugSettings.foreground)window.BearlyWorld.foreground(ctx,illustratedState());
    if(debugSettings.hitboxes)debugDrawHitboxes();
    ctx.restore();
    window.BearlyVisits?.overlay(ctx,W,H,{cameraX,cameraY,groundAt});
    const underpass=smooth(3550,3850,bike.x)*(1-smooth(4520,4850,bike.x));
    if(underpass>0){ctx.fillStyle=`rgba(18,31,43,${(underpass*.16).toFixed(3)})`;ctx.fillRect(0,0,W,H);}
    if(debugSettings.particles)drawEncounterAtmosphere();
    // Film-grain-light vignette and subtle top/bottom matte.
    const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#23394613');grad.addColorStop(.5,'#ffffff00');grad.addColorStop(1,'#18303920');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
    if(state==='paused'){ctx.fillStyle='#192f3a99';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';ctx.font='900 70px Impact, sans-serif';ctx.textAlign='center';ctx.fillText('PAUSED',W/2,H/2);ctx.textAlign='left';}
  }
  function debugDrawHitboxes(){
    ctx.save();ctx.lineWidth=2;ctx.strokeStyle='#ff654d';ctx.fillStyle='#ff654d24';
    for(const h of hazards){if(h.x<cameraX-120||h.x>cameraX+W+120)continue;
      const gy=groundAt(h.x);if(!Number.isFinite(gy))continue;
      const hw=(h.w||60);ctx.fillRect(h.x-hw*.5,gy-65,hw,65);ctx.strokeRect(h.x-hw*.5,gy-65,hw,65);
    }
    ctx.strokeStyle='#5bebff';ctx.fillStyle='#5bebff18';ctx.fillRect(bike.x-42,bike.y-72,84,87);ctx.strokeRect(bike.x-42,bike.y-72,84,87);
    ctx.restore();
  }
  function debugWarpTo(x){
    window.BearlyCentrumLink?.cancel();
    window.BearlyCentrumSquare?.close();
    window.BearlyVisits?.close();
    const position=clamp(Math.round(Number(x)||0),0,28000);
    if(state!=='playing' && state!=='paused')reset(true);
    const target=clamp(stretchX(position),210,FINISH-80),gy=groundAt(target)??fallReference(target);
    bike.x=target;bike.y=gy-43;bike.vx=0;bike.vy=0;bike.a=0;bike.va=0;bike.contact=true;bike.broken=false;
    cameraX=Math.max(0,target-W*.36);cameraY=gy-395;cameraShake=0;
    state='playing';$('overlay').hidden=true;
    demo.active=false;baby=null;bearThrown=null;seatThrown=null;
    keys.clear();health=Math.max(health,40);damageCooldown=time+2.5;
    const before=checkpoints.filter(c=>c.x<=target).length;
    checkpoint=before;checkpointLabel=before?checkpoints[before-1].label:'START';
    $('debugWarpMeters').value=String(position);
    updateHud();debugRefresh(true);return position;
  }
  let debugReturnFocus=null;
  function debugOpenMenu(next){
    if(next&&!debugOpen)debugReturnFocus=document.activeElement;
    debugOpen=!!next;keys.clear();
    clearMobileControls();
    $('debugPanel').hidden=!debugOpen;
    $('debugOpenBtn').setAttribute('aria-expanded',String(debugOpen));
    document.querySelector('.ride-settings')?.setAttribute('aria-expanded',String(debugOpen));
    if(debugOpen){debugRefresh(true);$('debugCloseBtn').focus();}
    else {if(debugReturnFocus?.isConnected)debugReturnFocus.focus();last=performance.now();acc=0;}
  }
  function debugRefresh(force=false){
    if(!debugOpen&&!debugSettings.miniStats)return;
    const now=performance.now();if(!force&&now-debugPerf.lastUi<350)return;debugPerf.lastUi=now;
    const x=Math.round(bike.x/WORLD_STRETCH), cy=Math.round(cameraY),ground=groundAt(bike.x);
    if(debugOpen){
      $('debugFps').textContent=debugPerf.fps?String(debugPerf.fps):'--';
      $('debugMs').textContent=debugPerf.drawMs?debugPerf.drawMs.toFixed(1):'--';
      $('debugSim').textContent=String(debugPerf.steps);
      const area=window.BearlyVisits?.audit(),q=area?.quest,walkCache=window.BearlyNpcMotion?.cacheStats?.(),heroCache=window.BearlyHeroRig?.cacheStats?.();
      $('debugReadout').textContent=`BUILD       ${window.BEARLY_BUILD_ID}
AREA        ${area?.mode||'cycling'}${area?.place?' · '+area.place:''}
TRANSITION  ${area?.transition||'none'}${area?.phase!=null?' '+Math.round(area.phase*100)+'%':''}
LOCAL X   ${area?.mode?Math.round(area.x):'—'}
DEPTH/JUMP  ${Math.round(area?.depth||0)} / ${Math.round(area?.jump||0)}
HERO        ${area?.mode&&area.mode!=='water'?(area.hero?.pose||'ready')+' · '+(area.hero?.carrier||'front')+' carrier':'—'}
HERO DRAW   ${heroCache?`${heroCache.frames} cached poses · ${(heroCache.bytes/1048576).toFixed(1)} MB`:'preparing'}
BABY FACE   ${area?.mode&&area.hero?.babyFace?.source?'original · '+area.hero.babyFace.source.split('/').pop().replace('.webp',''):'original riding art'}
BABY MOOD   ${area?.mode?(area.hero?.babyFace?.mood||'idle'):'bike expressions'}
NPC STYLE   ${window.BearlyBrawlArt.wardrobeCount} outfits · streetwear / civilian
NPC DRAW    ${walkCache?`${walkCache.frameCount}/${walkCache.capacity} cached poses · ${(walkCache.bytes/1048576).toFixed(1)} MB`:'preparing'}
NPC LIFE    ${area?.combat?.population?.active??0} active · ${area?.combat?.population?.offstage??0} offstage
CIVILIANS   ${area?.combat?.population?.civilian??0} peaceful · ${area?.combat?.population?.fleeing??0} fleeing · ${area?.combat?.population?.hiding??0} hiding
ROUTINES    ${area?.combat?.population?.resting??0} sitting / reading / smoking
GANGS       ${area?.combat?.population?.gangChilling??0} chilling · ${area?.combat?.population?.gangAggressive??0} aggressive · ${area?.combat?.population?.gangCover??0} in cover
WEAPONS     rock ½ ♥ · Molotov 1½ ♥ · firecracker 1 ♥
SCALE       bear 145 · adults 128 · teens 120
MASKS       2 balaclava looks
APEX PRIMAL ${area?.combat?.phase==='madness'?'Madness Mauling Bear':area?.combat?.phase==='apex'?'Apex Primal':'cute'} ${Math.round(area?.combat?.heat||0)}% · HP ${area?.combat?.hp??100}
BOAT QUEST  ${q?.boatReady?'ready':q?.started?'in progress':'not started'} · buoys ${q?.buoys.length||0}/3
GARDEN      ${q?.seeds.length||0}/3${q?.garden?' returned':''}
SCREEN      ${window.BearlyFullscreen?.state()||'window'}
RENDER      ${canvas.width} × ${canvas.height}${rendering.scale<1?' · automatic phone performance':''}
STATE       ${state}${debugOpen?' · MENU HOLD':''}\nDISTRICT    ${districtAt(bike.x).name}\nMAP X       ${x} / 28000\nCAMERA      ${Math.round(cameraX)}, ${cy}\nBIKE        ${Math.round(bike.x)}, ${Math.round(bike.y)}\nSPEED       ${Math.round(bike.vx*KMH_PER_SPEED)} km/h\nHEALTH      ${Math.round(health)}%    PANIC ${Math.round(panic)}%\nGROUND Y    ${ground==null?'none':Math.round(ground)}\nENEMIES     ${gangCrews.length} crews  ·  ${hazards.length} hazards`;
    }
    $('debugMini').hidden=!debugSettings.miniStats;
    if(debugSettings.miniStats)$('debugMini').textContent=`${debugPerf.fps||'--'} FPS · ${debugPerf.drawMs.toFixed(1)} ms\nX ${x} · ${Math.round(bike.vx*KMH_PER_SPEED)} km/h · HP ${Math.round(health)}`;
  }
  function debugInit(){
    $('centrumSquareBtn').addEventListener('click',()=>{if(!window.BearlyCentrumLink?.holding())debugWarpTo(11325/WORLD_STRETCH);debugOpenMenu(false);});
    $('debugOpenBtn').addEventListener('click',()=>debugOpenMenu(!debugOpen));
    $('debugCloseBtn').addEventListener('click',()=>debugOpenMenu(false));
    $('debugResumeBtn').addEventListener('click',()=>debugOpenMenu(false));
    for(const input of document.querySelectorAll('[data-dbg-setting]')){
      const setting=input.dataset.dbgSetting;
      input.checked=debugSettings[setting];
      input.addEventListener('change',()=>{
        debugSettings[setting]=input.checked;
        if(setting==='miniStats')$('debugMini').hidden=!input.checked;
        if(setting==='hideHud')document.querySelector('.game-hud').style.display=input.checked?'none':'';
        debugRefresh(true);
      });
    }
    for(const btn of document.querySelectorAll('[data-dbg-warp]'))btn.addEventListener('click',()=>debugWarpTo(btn.dataset.dbgWarp));
    for(const b of document.querySelectorAll('[data-dbg-place]'))b.addEventListener('click',()=>{const scene=window.BearlyNeighbourhood.scenes.find(s=>s.key===b.dataset.dbgPlace);if(scene){debugWarpTo(window.BearlyNeighbourhood.entrance(scene).x/WORLD_STRETCH);debugRefresh(true);}});
    $('debugEntryBtn').addEventListener('click',()=>{debugWarpTo(window.BearlyNeighbourhood.entrance(window.BearlyNeighbourhood.scenes.find(b=>b.key==='pizzeria')).x/WORLD_STRETCH);debugOpenMenu(false);window.BearlyVisits.requestEntry();});
    $('debugBoatBtn').addEventListener('click',()=>{for(const action of ['lunch','deliver','kit','repair'])window.BearlyQuests.game.act(action);debugRefresh(true);});
    $('debugBrawlBtn').addEventListener('click',()=>{window.BearlyCentrumLink?.cancel();window.BearlyCentrumSquare?.close();debugOpenMenu(false);window.BearlyVisits.practice();});
    $('debugLifeBtn')?.addEventListener('click',()=>{debugWarpTo(2500/WORLD_STRETCH);debugOpenMenu(false);requestAnimationFrame(()=>document.querySelector('.dismount-button')?.click());});
    $('debugFullscreenBtn').addEventListener('click',()=>window.BearlyFullscreen.toggle());
    $('debugWarpBtn').addEventListener('click',()=>debugWarpTo($('debugWarpMeters').value));
    $('debugWarpMeters').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();debugWarpTo(e.currentTarget.value);}});
    $('debugHealBtn').addEventListener('click',()=>{health=100;window.BearlyVisits?.setHealth(100);panic=0;damageCooldown=time+3;updateHud();debugRefresh(true);});
    $('debugSpeedBtn').addEventListener('click',()=>{bike.vx=Math.min(730,MAX_SPEED);debugRefresh(true);});
    $('debugCrashBtn').addEventListener('click',()=>{window.BearlyCentrumLink?.cancel();window.BearlyCentrumSquare?.close();if(state!=='playing')reset(true);const wasGod=debugSettings.godMode;debugSettings.godMode=false;bike.vx=390;crash('debug crash test');debugSettings.godMode=wasGod;debugOpenMenu(false);});
    $('debugRestartBtn').addEventListener('click',()=>{reset(true);debugRefresh(true);});
    window.BEARLY_DEBUG_MENU={toggle:debugOpenMenu,warp:debugWarpTo,settings:debugSettings,stats:()=>({...debugPerf}),isOpen:()=>debugOpen};
  }
  function cyclingGangPose(id){
    for(const crew of gangCrews)for(let i=0;i<crew.count;i++)if(id==='gang-'+crew.x+'-'+i){
      const m=crewState.get(crew.x)?.members?.[i];if(!m||m.phase==='idle')return null;
      return {state:m.phase==='warn'?'windup':m.phase==='throw'?'release':'recover',age:Math.max(0,time-m.since),activity:'fight'};
    }
    return null;
  }
  // Narrow bridge: parking uses the existing rig and terrain, never another simulation.
  function centrumGroundPose(px,route=false){
    if(!Number.isFinite(px)||px<(route?110:11235)||px>(route?FINISH-100:11415))return null;
    const lx=[riderX(REAR_X),riderX(FRONT_X)],ly=riderY(WHEEL_Y);let a=0,grounds=[];
    for(let i=0;i<6;i++){
      grounds=lx.map(dx=>groundAt(px+dx*Math.cos(a)-ly*Math.sin(a)));
      if(grounds.some(g=>!Number.isFinite(g)))return null;
      a=Math.asin(clamp((grounds[1]-grounds[0])/(lx[1]-lx[0]),-.6,.6));
    }
    const ys=lx.map((dx,i)=>grounds[i]-TIRE_R-dx*Math.sin(a)-ly*Math.cos(a));
    return{x:px,y:(ys[0]+ys[1])/2,a};
  }
  function centrumClearInput(){keys.clear();clearMobileControls();jumpBuffer=0;acc=0;last=performance.now();}
  function centrumApplyPose(pose){
    Object.assign(bike,pose,{vx:0,vy:0,va:0,contact:true});hasEverGrounded=true;lastContactAt=time;
    cameraX=Math.max(0,bike.x-W*.36);cameraY=(groundAt(bike.x)??420)-395;cameraShake=0;centrumClearInput();
  }
  const centrumCycleBridge={
    snapshot:()=>({routeId:'autumn-main',routeSceneId:'route:autumn-main',x:bike.x,y:bike.y,speed:bike.vx,angle:bike.a,grounded:bike.contact,
      state,introHidden:introOverlay.hidden,debugOpen,demo:demo.active,health,bikeFrame:{...bike},adventure:window.BearlyQuests.game.snapshot(),simTime:time,
      projectiles:projectiles.length,projectilePositions:projectiles.map(p=>[p.x,p.y]),lifeTime:window.BearlyVisits?.lifeTime(),
      babyMounted:!baby&&!seatThrown&&!bearThrown&&!bike.broken,
      routeProgress:{collectedPickups:stars.flatMap((s,i)=>s.got?['route-pizza-'+i]:[]),score,bonus,maxDist,seconds,checkpoint,panic,trickHazards:[...tricks.hazardsPassed],oneTime:[...oneTime],lostParts:[...lostParts]},
      wheels:[riderX(REAR_X),riderX(FRONT_X)].map(wx=>{const p=wheelPos(wx);return{...p,clearance:(groundAt(p.x)??p.y+TIRE_R)-(p.y+TIRE_R)};})}),
    setHealth:value=>{health=clamp(value,0,100);if(window.BearlyVisits?.active())window.BearlyVisits.setHealth(health);updateHud();},
    clearInput:()=>{centrumClearInput();window.BearlyCentrumSquare?.clearInput();},
    applyCollected:ids=>{stars.forEach((star,i)=>{star.got=ids.includes('route-pizza-'+i);});numStars=stars.filter(star=>star.got).length;$('starsCount').textContent=`${numStars} / ${stars.length}`;},
    inventoryContext:()=>{
      const v=window.BearlyVisits?.active()?window.BearlyVisits.audit():null;
      const residents=v?.combat?.npcs||window.BearlyVisits?.residents()||[];
      const actorX=v?.x??bike.x,actorDepth=v?.depth??0;
      const combat=residents.some(n=>n.active!==false&&n.hp>0&&(n.aggressive||n.gangAggressive||n.hostile)&&Math.abs(n.x-actorX)<500&&Math.abs((n.depth||0)-actorDepth)<180)||!!v&&(!!v.combat.held||v.combat.attack||['apex','madness'].includes(v.combat.phase)||v.combat.shots.length>0);
      const danger=projectiles.some(p=>Math.abs(p.x-actorX)<900)||[...crewState.values()].some(c=>['warn','throw','windup'].includes(c.phase));
      return {active:introOverlay.hidden,state,debugOpen,paused:state!=='playing'||debugOpen||!!v?.paused,danger,combat,speed:v?.velocity??bike.vx,jump:v?.jump??0,grounded:v?!(v.jump>1):bike.contact,transition:!!v?.transition,
        mode:v?'source-foot':'riding',sceneId:v?('source:'+v.mode+':'+(v.place||'street')):'route:autumn-main',health,position:{x:actorX,y:v?.depth??bike.y},screenX:actorX-cameraX};
    },
    restoreSession:saved=>{
      if(!saved||!Number.isFinite(saved.health)||saved.health<0||saved.health>100)return false;
      const pose=centrumGroundPose(saved.x,true),progress=window.BearlyCentrumParkingSave.validateProgress(saved.routeProgress),adventure=window.BearlyCentrumParkingSave.validateAdventure(saved.adventure);
      if(!pose||!progress||!adventure||saved.routeId!=='autumn-main'||saved.routeSceneId!=='route:autumn-main'||!Number.isFinite(saved.simTime)||saved.simTime<0||saved.simTime>1e9)return false;
      centrumApplyPose(pose);health=saved.health;window.BearlyQuests.game.restore(adventure);
      ({score,bonus,maxDist,seconds,checkpoint,panic}=progress);checkpointLabel=checkpoint?checkpoints[checkpoint-1].label:'START';
      tricks.hazardsPassed=new Set(progress.trickHazards||[]);oneTime.clear();(progress.oneTime||[]).forEach(id=>oneTime.add(id));lostParts.clear();(progress.lostParts||[]).forEach(id=>lostParts.add(id));
      centrumCycleBridge.applyCollected(progress.collectedPickups);time=Number.isFinite(saved.simTime)?Math.max(0,saved.simTime):0;
      state=health<=0||['dead','dead_end'].includes(saved.state)?'dead_end':'playing';introOverlay.hidden=true;introRunning=false;$('overlay').hidden=true;
      if(state==='dead_end')overlay('TRY AGAIN','Retry restores the complete adventure checkpoint.','RETRY CHECKPOINT');
      $('checkpointLabel').textContent=checkpoint?`CP ${checkpoint} / ${checkpoints.length}`:'NO CHECKPOINT';updateHud();return true;
    },
    park:()=>{const pose=centrumGroundPose(bike.x);if(!pose)return null;centrumApplyPose(pose);return{x:pose.x,y:pose.y};},
    restoreParking:record=>{
      const pose=centrumGroundPose(record.parked.x);if(!pose||Math.abs(pose.y-record.parked.y)>2)return false;
      centrumApplyPose(pose);health=record.health;window.BearlyQuests.game.restore(record.adventure);
      const progress=record.routeProgress;
      stars.forEach((s,i)=>{s.got=progress.collectedPickups.includes('route-pizza-'+i);});numStars=stars.filter(s=>s.got).length;
      ({score,bonus,maxDist,seconds,checkpoint,panic}=progress);checkpointLabel=checkpoint?checkpoints[checkpoint-1].label:'START';
      tricks.hazardsPassed=new Set(progress.trickHazards);oneTime.clear();progress.oneTime.forEach(id=>oneTime.add(id));
      lostParts.clear();progress.lostParts.forEach(id=>lostParts.add(id));$('starsCount').textContent=`${numStars} / ${stars.length}`;
      $('checkpointLabel').textContent=checkpoint?`CP ${checkpoint} / ${checkpoints.length}`:'NO CHECKPOINT';
      state='playing';introOverlay.hidden=true;introRunning=false;$('overlay').hidden=true;updateHud();return true;
    },
    resume:record=>{const pose=centrumGroundPose(record.parked.x);if(pose)centrumApplyPose(pose);state='playing';$('overlay').hidden=true;updateHud();},
    visitContext:centrumVisitContext,
    drawEmptyBicycle:(target,px,py,height)=>{
      const scale=ART_SCALE*(height/145);target.save();target.translate(px,py);target.scale(scale,scale);target.translate(-ART_ORIGIN_X,-WHEEL_Y-WHEEL_RADIUS);
      // Existing source drawing functions use the original game context.
      ctx.save();const transform=target.getTransform();ctx.setTransform(transform);
      wheel(REAR_X,WHEEL_Y,bike.cycle);wheel(FRONT_X,WHEEL_Y,bike.cycle);frame();bicycleDrive(bike.cycle*.44,0);childSeat();
      inkLine([[164,267],[149,305]],'#53675e',3,1);ctx.restore();target.restore();
    }
  };
  function centrumVisitContext(dt){
    return {dt,debugOpen,playSound:sound,godMode:debugSettings.godMode,gangs:gangCrews.flatMap(crew=>Array.from({length:crew.count},(_,i)=>({id:'gang-'+crew.x+'-'+i,x:crew.x+crewMemberLocalX(crew,i),depth:-102,variant:i%3,crewId:'crew-'+crew.x,kind:'gangster',hostile:false,item:carriedPropFor(crew,i)}))),gangPose:cyclingGangPose,health,readHealth:()=>health,storeHealth:value=>{const next=clamp(value,0,100);if(next!==health){health=next;updateHud();}},hurtRider:amount=>{const before=health;injure(amount,'provoked resident');return before-health;},road:{groundAt,finish:FINISH,cameraX,cameraY},brakeToStop:()=>{keys.clear();clearMobileControls();if(!bike.contact)return false;bike.vx*=Math.exp(-dt*9);if(Math.abs(bike.vx)<8){bike.vx=0;return true;}return false;},followFoot:(fx)=>{const gy=groundAt(fx);if(gy!==null){const blend=1-Math.exp(-dt*7);cameraX=lerp(cameraX,Math.max(0,fx-W*.36),blend);cameraY=lerp(cameraY,gy-395,blend);}},x:bike.x,speed:bike.vx,grounded:bike.contact,playing:state==='playing'&&!debugOpen&&!demo.active&&introOverlay.hidden,clearInput:()=>{keys.clear();clearMobileControls();}};
  }
  function loop(now){
    // The opaque title does not need a second animated street behind it.
    if(!introOverlay.hidden&&startup.firstFrameAt!==null&&!window.BearlyCentrumSquare?.active()&&!window.BearlyCentrumLink?.holding()){last=now;acc=0;requestAnimationFrame(loop);return;}
    const frameMs=now-last;
    if(rendering.adaptive&&rendering.scale>.675&&state==='playing'&&!debugOpen&&!document.hidden&&frameMs>0){
      rendering.samples++;rendering.slow+=frameMs>(rendering.scale===1?50:70)?1:0;rendering.total+=Math.min(250,frameMs);
      if(rendering.samples>=6){
        if(rendering.slow>=4&&rendering.total/rendering.samples>(rendering.scale===1?50:70)){
          // Logical world coordinates and every control stay at 1160×640.
          // Only a persistently slow touch device uses a smaller backing store.
          rendering.scale=rendering.scale===1?.75:.675;canvas.width=Math.round(W*rendering.scale);canvas.height=Math.round(H*rendering.scale);
        }
        rendering.samples=0;rendering.slow=0;rendering.total=0;
      }
    }
    let dt=Math.min(.04,(now-last)/1000||0);last=now;
    let iter=0;
    window.BearlyVisits?.centrumContext(centrumVisitContext(dt));
    if(!window.BearlyCentrumInventory?.isBrowsing())window.BearlyCentrumLink?.update(dt,debugOpen);
    // Independent prototype holds the existing ride and visits without mutating them.
    if(window.BearlyCentrumInventory?.isBrowsing()){acc=0;}
    else if(window.BearlyCentrumLink?.holding()){acc=0;}
    else if(window.BearlyCentrumSquare?.active()){acc=0;window.BearlyCentrumSquare.update(dt,debugOpen);}
    else {
    const exploring=!!window.BearlyVisits?.active();
    if(exploring&&!roadsideSuspended){impactCues=[];blood=[];for(const c of crewState.values()){c.phase='idle';c.since=time;for(const m of c.members||[]){m.phase='idle';m.since=time;m.nextReadyAt=Math.max(m.nextReadyAt,time+.7);}}}
    roadsideSuspended=exploring;
    if(exploring&&!debugOpen&&state==='playing'&&!window.BearlyVisits?.paused()){
      // Existing throws finish their flight after the rider leaves the seat.
      // The parked bicycle is not an invisible hurtbox for the walking bear.
      projectileFootTime+=dt;advanceThrownItems(dt,bike.x,bike.y,false);
      for(let i=projectileImpactFX.length-1;i>=0;i--)if(projectileClock()-projectileImpactFX[i].at>projectileImpactFX[i].duration)projectileImpactFX.splice(i,1);
      updateParticles(sparks,dt);updateParticles(groundDust,dt);
    }
    if(!debugOpen&&!window.BearlyVisits?.active()){acc+=dt;while(acc>=1/120&&iter++<6){update(1/120);acc-=1/120;}}
    else acc=0;
    window.BearlyVisits?.update(centrumVisitContext(dt));
    }
    window.BearlyCentrumEconomy?.update(dt);
    window.BearlyCentrumInventory?.update(dt);
    const t0=performance.now();render();const took=performance.now()-t0;
    debugPerf.drawMs=debugPerf.drawMs?debugPerf.drawMs*.88+took*.12:took;
    debugPerf.steps=iter;
    if(!debugPerf.lastSample)debugPerf.lastSample=now;
    debugPerf.frames++;
    if(now-debugPerf.lastSample>=550){debugPerf.fps=Math.round(debugPerf.frames*1000/(now-debugPerf.lastSample));debugPerf.frames=0;debugPerf.lastSample=now;}
    debugRefresh();requestAnimationFrame(loop);
  }
  function start(){
    if(state==='dead_end'&&checkpoint){checkpointRespawn();return;}
    reset(true);
  }
  function unlockMobileAudio(){
    // Audio on mobile must first be resumed directly in a user gesture.
    if(muted)return;
    try{
      const Ctx=window.AudioContext||window.webkitAudioContext;
      if(!Ctx)return;
      audio=audio||new Ctx();
      if(audio.state==='suspended')audio.resume().catch(()=>{});
    }catch(_){}
  }
  const mobilePauseBtn=$('mobilePauseBtn');
  function mobilePause(){
    if(debugOpen||window.BearlyCentrumLink?.holding())return;
    if(state==='playing'){state='paused';clearMobileControls();}
    else if(state==='paused')state='playing';
    mobilePauseBtn.textContent=state==='paused'?'▶ RESUME':'Ⅱ PAUSE';
    mobilePauseBtn.setAttribute('aria-label',state==='paused'?'Resume game':'Pause game');
  }
  mobilePauseBtn.addEventListener('click',()=>{unlockMobileAudio();mobilePause();});


  // v10.61 animated intro integration
  const introOverlay=$('introOverlay');
  const introStill=$('introStill');
  const introCanvas=$('introMotion');
  const introBtn=$('introStart');
  let introRunning=true;
  let introReady=introStill.complete && introStill.naturalWidth>0;
  introStill.onload=()=>{introReady=true;};
  const introReduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ictx=introCanvas.getContext('2d',{alpha:true});
  const IW=1672, IH=941;
  function sizeIntro(){const box=introCanvas.getBoundingClientRect(),density=Math.min(1.5,window.devicePixelRatio||1),width=Math.max(1,Math.min(IW,Math.ceil(box.width*density))),height=Math.max(1,Math.min(IH,Math.ceil(box.height*density)));if(introCanvas.width!==width||introCanvas.height!==height){introCanvas.width=width;introCanvas.height=height;}ictx.setTransform(width/IW,0,0,height/IH,0,0);}
  sizeIntro();new ResizeObserver(sizeIntro).observe(introCanvas);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden && !introOverlay.hidden) introRunning=true;});
  let introSeed=325621;
  function irand(){introSeed=(Math.imul(introSeed,1664525)+1013904223)>>>0;return introSeed/4294967296;}
  const introLeaves=[];
  for(let i=0;i<65;i++)introLeaves.push({x:irand()*(IW+200)-100,y:80+irand()*760,phase:irand()*6.28,size:2.5+irand()*6,drift:9+irand()*35,fall:5+irand()*11,tint:Math.floor(irand()*4)});
  const introCanopy=[{x:65,y:173,rx:94,ry:65},{x:350,y:206,rx:94,ry:88},{x:498,y:272,rx:118,ry:105}];
  const introColors=['#d7a04d','#eabf62','#7e8f58','#b26c3b'];
  function introGlow(x,y,r,rgba,alpha){
    let gr=ictx.createRadialGradient(x,y,0,x,y,r);
    gr.addColorStop(0,`rgba(${rgba},${alpha})`);
    gr.addColorStop(.28,`rgba(${rgba},${alpha*.52})`);
    gr.addColorStop(1,`rgba(${rgba},0)`);
    ictx.fillStyle=gr;ictx.fillRect(x-r,y-r,r*2,r*2);
  }
  function introFoliageDraw(t){
    ictx.save();
    for(let j=0;j<introCanopy.length;j++){
      const c=introCanopy[j];
      for(let i=0;i<26;i++){
        const theta=(i*2.3999+j*1.3), rad=Math.sqrt((i+.5)/26),
        dx=Math.cos(theta)*c.rx*rad,dy=Math.sin(theta)*c.ry*rad;
        const sx=4*Math.sin(t*.83+theta*.2+j*.7);
        const sy=2*Math.cos(t*.71+theta*.4);
        ictx.globalAlpha=.23;
        ictx.fillStyle=introColors[(i+j)%4];
        ictx.save();ictx.translate(c.x+dx+sx,c.y+dy+sy);
        ictx.rotate(theta*.2+t*.11);
        ictx.beginPath();ictx.ellipse(0,0,3.8+((i%4)*.9),1.8,0,0,Math.PI*2);ictx.fill();ictx.restore();
      }
    }
    ictx.restore();
  }
  function introWindDraw(t){
    for(const leaf of introLeaves){
      let x=(leaf.x+t*leaf.drift+170)%(IW+340)-170;
      let y=(leaf.y+t*leaf.fall+8*Math.sin(t*.9+leaf.phase))%(IH+70);
      ictx.save();ictx.translate(x,y);ictx.rotate(t*.82+leaf.phase);
      ictx.globalAlpha=.23+.13*Math.sin(t*.6+leaf.phase);
      ictx.fillStyle=introColors[leaf.tint];ictx.beginPath();
      ictx.ellipse(0,0,leaf.size,leaf.size*.36,0,0,2*Math.PI);ictx.fill();ictx.restore();
    }
  }
  function introSunDraw(t){
    const a=.17+.06*Math.sin(t*.82);
    introGlow(1396,205,165,'255,199,106',a);
    introGlow(1396,205,73,'255,240,181',.16+.04*Math.sin(t*.65));
    ictx.save();ictx.translate(1396,205);ictx.rotate(t*.04);
    for(let i=0;i<14;i++){
      const angle=i*Math.PI*2/14;
      ictx.save();ictx.rotate(angle);ictx.strokeStyle='rgba(255,224,159,.055)';ictx.lineWidth=2.5;
      ictx.beginPath();ictx.moveTo(47,0);ictx.lineTo(92+6*Math.sin(t+angle),0);ictx.stroke();ictx.restore();
    }
    ictx.restore();
  }
  function introLampsDraw(t){
    const p=[[613,390,27],[1218,480,35],[1601,554,40],[279,228,28]];
    for(let i=0;i<p.length;i++)introGlow(p[i][0],p[i][1],p[i][2]*1.6,'255,196,105',.22+.07*Math.sin(t*1.2+i*.9));
  }
  function introPulseDraw(t){
    const a=.05+.10*(.5+.5*Math.sin(t*1.6));
    ictx.fillStyle=`rgba(255,249,222,${a})`;
    ictx.fillRect(667,758,312,27);
  }
  function introAnim(ms){
    if(introOverlay.hidden || !introRunning)return;
    requestAnimationFrame(introAnim);
    if(introReduce || !introReady)return;
    const t=ms/1000;
    ictx.clearRect(0,0,IW,IH);
    introSunDraw(t); introLampsDraw(t); introFoliageDraw(t); introWindDraw(t); introPulseDraw(t);
  }
  if(!introReduce)requestAnimationFrame(introAnim);
  function enterReadyRide(){introOverlay.hidden=true;introRunning=false;introBtn.removeAttribute('aria-busy');start();}
  window.BEARLY_ENTER_GAME=function(){
    unlockMobileAudio();startup.requested=true;introRunning=false;
    if(!startup.ready){introBtn.textContent='GETTING READY…';introBtn.setAttribute('aria-busy','true');return;}
    enterReadyRide();
  };
  introBtn.addEventListener('click',()=>window.BEARLY_ENTER_GAME());

  $('startBtn').addEventListener('click',()=>{unlockMobileAudio();start();});
  $('demoBtn').addEventListener('click',()=>{if(demo.active){reset(false);}else runStuntDemo();});
  $('restartBtn').addEventListener('click',()=>reset(true));
  $('gameoverRestart').addEventListener('click',()=>reset(true));
  $('retryBtn').addEventListener('click',()=>checkpointRespawn());
  $('soundBtn').addEventListener('click',()=>{muted=!muted;$('soundBtn').textContent=muted?'♪ OFF':'♪ ON';});
  window.addEventListener('keydown',e=>{
    if(e.code==='F3'||(debugOpen&&e.code==='Escape')){e.preventDefault();debugOpenMenu(!debugOpen);return;}
    if(debugOpen || e.target?.closest?.('#debugPanel')){
      if(debugOpen&&e.code==='Tab'){
        const nodes=[...$('debugPanel').querySelectorAll('button:not(:disabled),input:not(:disabled)')],first=nodes[0],lastNode=nodes[nodes.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();lastNode.focus();}
        else if(!e.shiftKey&&document.activeElement===lastNode){e.preventDefault();first.focus();}
      }
      return;
    }
    if(window.BearlyCentrumLink?.holding()){e.preventDefault();return;}
    if(!introOverlay.hidden){
      if(e.code==='Enter' || e.code==='Space'){e.preventDefault();window.BEARLY_ENTER_GAME();}
      return;
    }
    if(e.code==='KeyG'){e.preventDefault();if(demo.active)reset(false);else runStuntDemo();return;}
    const isGameKey=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','KeyW','KeyA','KeyS','KeyD','KeyP','KeyR','KeyC','Enter'].includes(e.code);
    if(isGameKey)e.preventDefault();
    if(e.code==='KeyT'){banner('ONE CONSISTENT BIKE · REFERENCE CUTOUTS ARCHIVED',2.2);return;}
    if(e.code==='KeyN'){if(demo.active)return;const i=bearPoseNames.indexOf(previewBearPose);previewBearPose=bearPoseNames[(i+1)%bearPoseNames.length];banner('BEAR POSE: '+previewBearPose.toUpperCase(),1.3);return;}
    if(e.code==='KeyM'){previewBearPose=null;banner('BEAR: AUTO REACTIONS',1.1);return;}
    if(e.code==='KeyV'){const i=babyFrameNames.indexOf(previewPose);previewPose=babyFrameNames[(i+1)%babyFrameNames.length];banner('BABY POSE: '+previewPose.toUpperCase(),1.2);return;}
    if(e.code==='KeyB'){previewPose=null;banner('BABY: AUTO REACTIONS',1);return;}
    if(e.code==='KeyH'){const parts=['rightArm','leftLeg','leftArm','rightLeg','torso'];injure(25,'debug',true,parts[collisionTestCounter++%parts.length]);return;}
    if(e.code==='KeyR'){reset(true);return;}
    if(e.code==='KeyC'){checkpointRespawn();return;}
    if(e.code==='KeyP'){if(state==='playing')state='paused';else if(state==='paused')state='playing';return;}
    if(e.code==='Enter' && (state==='menu'||state==='dead_end'||state==='won_end')){start();return;}
    if(e.code==='Space'&&!keys.has('Space'))hop();
    keys.add(e.code);
  });
  window.addEventListener('keyup',e=>keys.delete(e.code));
  window.addEventListener('blur',()=>{keys.clear();if(state==='playing'&&!window.BearlyVisits?.active()&&!window.BearlyCentrumSquare?.active()&&!window.BearlyCentrumLink?.holding())state='paused';});
  // v10.53 — multiple real touches, independent holds and reliable release.
  // Never make a button depend on setPointerCapture succeeding (it can fail on
  // iOS webviews or synthetic/replayed pointer events).
  window.addEventListener('centrum-square-change',()=>{keys.clear();clearMobileControls();last=performance.now();acc=0;});
  const mobileContacts=new Map(); // button -> Set of pointer/touch identifiers
  function syncMobileKeys(){
    for(const b of document.querySelectorAll('.touch-controls button[data-key]')){
      const set=mobileContacts.get(b), active=!!set?.size, k=b.dataset.key;
      if(active)keys.add(k);else keys.delete(k);
      b.classList.toggle('held',active);
      b.setAttribute('aria-pressed',active?'true':'false');
    }
  }
  function clearMobileControls(){mobileContacts.clear();syncMobileKeys();}
  function touchHold(button,id){
    if(debugOpen||window.BearlyCentrumLink?.holding())return;
    unlockMobileAudio();
    let set=mobileContacts.get(button);
    if(!set){set=new Set();mobileContacts.set(button,set);}
    const first=set.size===0;
    set.add(id);
    if(first && button.dataset.key==='Space' && state==='playing')hop();
    syncMobileKeys();
  }
  function touchRelease(button,id){
    const set=mobileContacts.get(button);if(!set)return;
    set.delete(id);if(!set.size)mobileContacts.delete(button);
    syncMobileKeys();
  }
  for(const b of document.querySelectorAll('.touch-controls button[data-key]')){
    b.addEventListener('pointerdown',e=>{
      if(e.cancelable)e.preventDefault();
      touchHold(b,'p:'+e.pointerId);
      if(b.setPointerCapture){try{b.setPointerCapture(e.pointerId)}catch(_){}}
    },{passive:false});
    const releasePointer=e=>touchRelease(b,'p:'+e.pointerId);
    for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,releasePointer);
    // TouchEvent fallback for embedded iOS browsers, including when PointerEvent
    // is present but pointer capture is unreliable. Separate IDs prevent races.
    b.addEventListener('touchstart',e=>{
      if(e.cancelable)e.preventDefault();
      for(const t of e.changedTouches)touchHold(b,'t:'+t.identifier);
    },{passive:false});
    for(const ev of ['touchend','touchcancel'])b.addEventListener(ev,e=>{
      if(e.cancelable)e.preventDefault();
      for(const t of e.changedTouches)touchRelease(b,'t:'+t.identifier);
    },{passive:false});
    // If a gesture is interrupted outside a button, release on window too.
    b.addEventListener('contextmenu',e=>e.preventDefault());
  }
  window.addEventListener('pointerup',e=>{
    for(const b of mobileContacts.keys())touchRelease(b,'p:'+e.pointerId);
  });
  window.addEventListener('pointercancel',e=>{
    for(const b of mobileContacts.keys())touchRelease(b,'p:'+e.pointerId);
  });
  window.addEventListener('touchend',e=>{
    for(const b of mobileContacts.keys())for(const t of e.changedTouches)touchRelease(b,'t:'+t.identifier);
  },{passive:true});
  window.addEventListener('touchcancel',e=>{
    for(const b of mobileContacts.keys())for(const t of e.changedTouches)touchRelease(b,'t:'+t.identifier);
  },{passive:true});
  window.addEventListener('blur',clearMobileControls);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearMobileControls();if(state==='playing')state='paused';}});
  window.BEARLY_TOUCH_STATUS=()=>({pressed:[...keys],contacts:[...mobileContacts.entries()].map(([b,v])=>({key:b.dataset.key,count:v.size})),state, speed:bike.vx,x:bike.x,y:bike.y,contact:bike.contact,canvas:canvas.getBoundingClientRect().toJSON(),viewport:[innerWidth,innerHeight]});
  // A read-only snapshot for debugging and tuning the ride (no developer tools required).
  window.BEARLY_PANIC_TEST={max(){panic=100;panicHighTime=3.7;panicEpisodeCooldown=0;return true;},state(){return {panic,panicHighTime,panicEpisodeType,panicEvents,pukeWheelSlipUntil}}};
  window.BEARLY_V89_TEST={pizza(){const s=stars.find(x=>!x.got);if(!s)return false;bike.x=s.x;bike.y=s.y;return true;},crew(i=0){const c=gangCrews[i];bike.x=c.x-260;bike.y=(groundAt(bike.x)??440)-94;bike.vx=MAX_SPEED*.85;return c.name;},health(v=50){health=clamp(v,0,100);return health;},panic(v=100){panic=clamp(v,0,100);return panic;},faster(){bike.vx=MAX_SPEED;return bike.vx;}};
  window.BEARLY_V118_AUDIT=()=>({metro:v116MetroAnchor(),cleanStation:!!imageRecords.v118_metro_complete?.naturalWidth,treeLoaded:!!imageRecords.v118_close_tree?.naturalWidth,bushAssets:[0,1,2].map(i=>!!imageRecords['v118_close_bush_'+i]?.naturalWidth),near:{...v118CloseQA},backdropUnchanged:true});
  window.BEARLY_V117_AUDIT=()=>({forecourt:{...V117_FORECOURT},metro:v116MetroAnchor(),assets:['v59_courtyard_fence','v98_clean_lamp','v98_clean_bike_rack','v98_clean_planter'].map(k=>({key:k,loaded:!!imageRecords[k]?.naturalWidth})),restoredBackdrop:true});
  window.BEARLY_V116_AUDIT=()=>({station:v116MetroAnchor(),stationLoaded:!!imageRecords.v116_metro_clean?.naturalWidth,foreground:{...v116ForegroundAudit},background:'restored v110'});
  window.BEARLY_CAPTURE_METRO=(cx=10620,cy=440)=>{cameraX=cx;cameraY=cy;render();return canvas.toDataURL('image/png');};
  window.BEARLY_V110_TEST=()=>({version:'10.10',planCount:v110CourtyardPlan.length,metroX:v110MetroX,groveCount:v110MetroGrove.length,borders:v110MetroBorders.length,visible:{...v110Audit},metroCentreClear:v110Audit.entranceClear,metroFeet:v110MetroGrove.map(t=>({x:Math.round(t.x),height:t.h,foot:Number((groundAt(t.x)-110).toFixed(1))}))});
  window.BEARLY_V109_TEST=()=>({version:'10.10',gardens:v109Gardens.length,visible:{...v109Audit},treeCount:v108TreeHomes.length,metroClear:v109Gardens.every(g=>g.end<stretchX(7060)||g.start>stretchX(8030))});
  window.BEARLY_V108_TEST=()=>({version:'10.8',treesInView:v108Audits.trees,fencePosts:v108Audits.fencePosts,midgardenBeds:v108Audits.nearBeds,lensFlowers:v108Audits.lensBeds,invalidFoot:v108Audits.invalidFoot,worldTrees:v108TreeHomes.length});
  window.BEARLY_V126_EFFECTS=()=>({eyes:['eyeUpper','eyeLower'].map(k=>babySpriteAnchor(k)),
    diaper:babySpriteAnchor('diaper'),pool:baby?.peeBorn>=0?{x:baby.peeCentre,y:groundAt(baby.peeCentre),age:time-baby.peeBorn}:null,
    tears:cryingTears.length,peeDrops:babyPeeDrops.length,peeMarks:babyPeeMarks.length,started:cryingStartedAt});
  window.BEARLY_V154_QA=()=>({portrait:$('babyReaction').dataset.face,
    displayedMood:v149Emotion(),portraitLayout:'128x128 head only – fixed center',
    baby:baby?{grounded:baby.grounded,landedAt:baby.landedAt,
      restAt:baby.restAt,angle:baby.angle,landingAngle:baby.landingAngle,
      landingTilt:baby.landingTilt,landingFacing:baby.landingFacing,
      pose:thrownBabyPose(),peeBorn:baby.peeBorn}:null});
  window.BEARLY_V132_FLIGHT=()=>baby?{age:time-motion.crashAt,y:baby.y,
    ground:groundAt(baby.x),clearance:(groundAt(baby.x)??baby.y)-(baby.y+27),
    vy:baby.vy,grounded:baby.grounded,landedAt:baby.landedAt,restAt:baby.restAt,
    pose:thrownBabyPose()}:null;
  window.BEARLY_V131_QA=()=>({pose:thrownBabyPose(),loaded:v131CrashCels.filter(k=>!!imageRecords[k]?.naturalWidth).length,
    originalTerrainEmbedded:false,lastMetroOverlapRemoved:true});
  window.BEARLY_V125_QA_CRASH=()=>{if(state!=='playing')reset(true);bike.vx=390;crash('debug crash test');return {state,crashAt:motion.crashAt,baby:!!baby};};
  window.BEARLY_V125_QA_STEP=(dt=1)=>{for(let k=0;k<Math.ceil(dt*120);k++)update(1/120);return {time,age:time-motion.crashAt,baby: baby?{x:baby.x,y:baby.y,vx:baby.vx,vy:baby.vy,phase:baby.crashPhase,landedAt:baby.landedAt,restAt:baby.restAt,peeBorn:baby.peeBorn,clearance:(groundAt(baby.x)??baby.y)-(baby.y+27),pose:thrownBabyPose()}:null,overlay:!$('overlay').hidden, state};};
  window.BEARLY_DEBUG=()=>({artDirector:'V110 planted residential courtyards + metro grove and flower borders; V108 layered planted city / courtyard trees / far railings / near kerb flowerbeds + V107 uniform natural-proportion close vegetation and hillside-following rear curb; V106 validated terrain anchors and approved C metro base; V105 composed opaque biome clusters and natural full-frame foreground without screen bands; V104 substantial depth rebuild: painted cropped shrub forms on both sides of road, truly lens-close blooms, world-anchored tree canopy; V103 terrain anchored, staged near-side flora, no road haze; V102 actual near-lens layered flowerbeds and soft passing branches; terrain-locked foreground that does not follow bicycle jumps, larger curated verge flowerbeds, no screen-space masks; removed orphan railings; approved metro option C; V98 airy skyline + smaller clustered props + edge-cleaned illustrations; V97 Gard scene with authored connected shop row and shared sloped pavement; V96 grounded prop feet and rear-curb supports, restored raised metro lighting, four local public street scenes with ambient civilians; V95 scene-appropriate authored props, scaled-down benches, park stone details, no fake logs/road-sign rocks; V94 continuous foreground parallax; V93 edge-integrated preserved prop models; V92 coherent illustrated depth: non-repeating neighborhood panoramas, camera-side world-parallax near verge, rare clipped canopy framing, no placeholders in road; V89 gameplay retained',sceneryPanelCount:neighborhoodPanels.length,backgroundParallax:NEIGHBORHOOD_PARALLAX,backgroundPanelWidth:BACKGROUND_PANEL_WIDTH,roadProps:integratedProps.length,publicPlaces:v96PublicSites.map(s=>s.name),civilianCount:9,sceneryRhythmBeats:propRhythm.length,foregroundParallax:2.18,nearVergeObjects:v105Verge.length,veryNearObjects:v105Close.length,foregroundAnchorMode:window.BEARLY_FOREGROUND_WORLD_LOCKED?'terrain':'pending',passingTrees:0,drawnForeground:window.BEARLY_FRONT_DEPTH_COUNT||0,closeForeground:window.BEARLY_CLOSE_FOREGROUND_COUNT||0,visualSaturation:.65,transitionSpan:BACKGROUND_TRANSITION,metroArtLoaded:!!imageRecords.v89_metro_station?.naturalWidth,crashBikeArtLoaded:!!imageRecords.v89_bike_crashed?.naturalWidth,roadsideClusters:propClusters.length,animatedHazards:hazards.filter(h=>h.type==='firebin').length,enemyAnimations:true,npcPatrols:true,crewReactions:reactionCount,encounterHeat:Number(encounterHeat.toFixed(2)),activeWarning:currentEncounter()?.c.phase||null,impactCues:impactCues.length,lastHitKind,maxSpeed:MAX_SPEED,peakSpeed,pukeExposure:Number(pukeExposure.toFixed(3)),pukeDamageTotal:Number(pukeDamageTotal.toFixed(2)),pizzaHealingTotal:Number(pizzaHealingTotal.toFixed(2)),panicEvents,panicHighTime:Number(panicHighTime.toFixed(2)),panicReliefUntil,panicEpisodeType,panicEpisodeUntil,pukeWheelSlipUntil,pukeDrops:pukeDrops.length,pukeSplatters:pukeSplatters.length,pukeWaves:pukeWaveCount,pukeWaveActive:time<pukeWaveEnd,cryingTears:cryingTears.length,cryTearsEmitted,babyPeeDrops:babyPeeDrops.length,babyPeeMarks:babyPeeMarks.length,crying:!!baby && baby.grounded && baby.bounces>0,ramps:ramps.length,flags:setPieces.filter(p=>p.kind==='flag').length,safeFinishSpeed:SAFE_FINISH_SPEED,brakeZone:BRAKE_ZONE,gangCrews:gangCrews.length,district:districtAt(bike.x).name,districtCount:districts.length,projectiles:projectiles.map(p=>({x:Math.round(p.x),y:Math.round(p.y),kind:p.kind})),thrownCount,dodgedCount,hitCount,landmarks:landmarks.length,distanceToFinish:Math.max(0,FINISH-bike.x),demo:{active:demo.active,stage:demo.stage,age:demo.active?time-demo.startAt:0},tricks:{wheelieSeconds:tricks.wheelieSeconds,wheelieMeters:tricks.wheelieMeters,combo:tricks.combo,bestCombo:tricks.bestCombo,total:tricks.total,lastTrickAt:tricks.lastTrickAt,title:tricks.title,visible:time<tricks.showUntil||tricks.lastWheelie},motion:{...motion},cameraX,cameraY,bearPose:mountedBearPose(),bearFaceStage:bearSpeedFaceStage(),referenceSheetPose:selectedSheetPose(),referenceMode:referenceStyle,bearCelLoaded:!!imageRecords["bear_pose_"+mountedBearPose()]?.naturalWidth, visiblePedalFrame:mountedBearPose()==='pedal'?Math.floor((((bike.cycle*.44)%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI/2))%4:null,bearPoseForced:previewBearPose,babyPose:mountedBabyAnim().pose,babyPoseReason:mountedBabyAnim().reason,hazardBraceRemaining:Math.max(0,hazardReactUntil-time),health,lostParts:[...lostParts],babyVisibleOnBike:!baby||(demo.active&&demo.stage==='RECOVER'),babySeated:!baby||(demo.active&&demo.stage==='RECOVER'),babyEjected:!!baby&&!(demo.active&&demo.stage==='RECOVER'),seatEjected:!!seatThrown&&!(demo.active&&demo.stage==='RECOVER'),bearEjected:!!bearThrown&&!(demo.active&&demo.stage==='RECOVER'),lastPartHit:recentHitPart,bloodParticles:blood.length,artScale:ART_SCALE,spin:Number(bike.cycle.toFixed(2)),barks:barkCount,state,x:Math.round(bike.x),y:Math.round(bike.y),speed:Math.round(bike.vx),angle:Number(bike.a.toFixed(2)),contact:bike.contact,panic:Math.round(panic),score,checkpoint,deathReason,expression:bike.expression});
  window.BEARLY_REFERENCE={set(v){referenceStyle=false;},get(){return false;},pose(){return null;}};
  window.BEARLY_BEAR_POSES={set(name){previewBearPose=bearPoseNames.includes(name)?name:null;},current(){return mountedBearPose();},all:()=>bearPoseNames.slice()};
  window.BEARLY_POSES={set(name){previewPose=babyFrameNames.includes(name)?name:null;}, current(){return previewPose||mountedBabyAnim().pose;}, all:()=>babyFrameNames.slice()};
  window.BEARLY_V150_TEST=()=>({emotion:v149Emotion(),mountedPose:mountedBabyAnim().pose,
    mountedCel:mountedBabyCelName(mountedBabyAnim().pose),mountedStyle:'original_v148',
    airtimeLoaded:!!imageRecords.v149_airtime?.naturalWidth,
    fatalAirOnly:!!baby&&(state==='dead'||state==='dead_end')&&baby.landedAt<0&&thrownBabyPose()==='airtime',
    crashPose:baby?thrownBabyPose():null,onBike:!baby});
  window.BEARLY_V151_TEST=()=>({emotion:v149Emotion(),portrait:window.BEARLY_V151_PORTRAIT,
    riding:window.BEARLY_FRAME_STATS?.f,mountAnchor:window.BEARLY_FRAME_STATS?.anchor,
    crashPose:baby?thrownBabyPose():null, fatalAir:!!baby&&(state==='dead'||state==='dead_end')&&baby.landedAt<0,
    v151ExcitedLoaded:!!imageRecords.v151_baby_pose_excited?.naturalWidth,
    v151SickLoaded:!!imageRecords.v151_baby_pose_sick?.naturalWidth});
  window.BEARLY_V158_QA=()=>({build:window.BEARLY_BUILD_ID,crews:gangCrews.map(c=>({x:c.x,item:c.item,props:Array.from({length:c.count},(_,i)=>carriedPropFor(c,i))})),portrait:$('babyReaction').dataset.face,faceWidth:Math.round($('babyReaction').getBoundingClientRect().width),cam:cameraX,viewWidth:W,crewGround:gangCrews.map(c=>[c.x,groundAt(c.x)]),propAssetsReady:['hoodie','video','toll','scooter'].flatMap(k=>Array.from({length:6},(_,j)=>[0,3].map(f=>`v158_firecracker_${k}_${j}_${f}`))).flat().filter(k=>imageRecords[k]?.naturalWidth).length,sampleAsset:{present:!!window.BEARLY_ASSETS['v158_firecracker_toll_0_0'],imagePresent:!!imageRecords['v158_firecracker_toll_0_0'],complete:imageRecords['v158_firecracker_toll_0_0']?.complete,url:imageRecords['v158_firecracker_toll_0_0']?.src?.slice(0,32),naturalWidth:imageRecords['v158_firecracker_toll_0_0']?.naturalWidth},origImage:imageRecords['v72_toll_0_0']?.naturalWidth});
  window.BEARLY_CREW_DETAILS=()=>gangCrews.map(crew=>{const c=crewState.get(crew.x);return {x:crew.x,wardrobe:Array.from({length:crew.count},(_,i)=>window.BearlyKids.outfit(carriedPropFor(crew,i))),members:(c?.members||[]).map(m=>({phase:m.phase,shots:m.throwCount}))};});
  window.BEARLY_TEST={
    award(label='TEST STUNT',points=40){awardTrick(label,points);return {score,combo:tricks.combo,total:tricks.total};},
    stunt(name){
      const p=bike;
      if(baby||bearThrown||p.broken){reset(true);}
      if(name!=='wheelie')motion.demoWheelieUntil=-99;
      if(name!=='crash'){p.broken=false;motion.crashAt=-99;} 
      if(name==='wheelie'){p.x=425;p.vx=155;p.a=-.03;p.va=0;p.vy=0;p.contact=true;hasEverGrounded=true;const back=wheelPos(riderX(REAR_X)), gy=groundAt(back.x)||447;p.y+=gy-TIRE_R-back.y+0.6;motion.demoWheelieUntil=time+1.5;}
      if(name==='airtime'){p.x=430;p.y=210;p.vx=170;p.vy=-130;p.a=-.08;p.va=0;p.contact=false;hasEverGrounded=true;airTime=.35;}
      if(name==='landing'){p.x=430;p.vx=150;p.vy=0;p.a=0;p.va=0;p.contact=true;hasEverGrounded=true;const back=wheelPos(riderX(REAR_X)),gy=groundAt(back.x)||447;p.y+=gy-TIRE_R-back.y+0.6;motion.landAt=time;motion.landPower=.85;landingPoseUntil=time+.35;}
      if(name==='crash'){crash('stunt preview');}
      return motion.stunt;
    },
    setCrank(angle){bike.cycle=angle/.44;},
    encounter(x){const crew=gangCrews.find(c=>c.x===x)||gangCrews[0];crewState.set(crew.x,{phase:'throw',since:time,used:true});spawnThrownItem(crew);return {crew:crew.name,projectiles:projectiles.length};},
    warn(x){const crew=gangCrews.find(c=>c.x===x)||gangCrews[0];crewState.set(crew.x,{phase:'warn',since:time,used:false,patrolOrigins:Array.from({length:crew.count},(_,i)=>patrolMotion(crew,i).x)});return {crew:crew.name,phase:'warn'};},
    crewStates(){return gangCrews.map(crew=>({name:crew.name,phase:crewState.get(crew.x)?.phase||'idle',result:crewState.get(crew.x)?.result||null,x:crew.x}));},
    reset(){reset(true);},
    teleport(x,speed=0){bike.x=x;bike.y=(groundAt(x)??420)-92;bike.vx=speed;bike.vy=0;bike.a=0;bike.va=0;state='playing';$('overlay').hidden=true;},
    victory(){if(state==='menu'||state==='won_end')reset(true);state='playing';win();return {state,winAt:time,x:bike.x};},
    hit(part='rightArm',amount=25){return injure(amount,'debug',true,part,partPos(part==='head'?169:147,part==='head'?85:156));},
    babyImpact(){hitBabyInSeat({type:'barrel'});},
    crash(){crash('test crash');},
    puke(){panic=90;panicHighTime=0;panicEpisodeType='PUKE ATTACK';panicEpisodeUntil=time+2.1;panicEpisodeCooldown=time+12;pukeWheelSlipUntil=time+3.4;panicEvents++;return true;},
    parts(){return mountedParts();}
  };
  window.BEARLY_V163_QA=()=>({
    newAssets:Object.fromEntries([...Array.from({length:6},(_,i)=>'v162_firebin_'+i),
      ...['bottle','rock','firecracker'].map(n=>'v162_projectile_'+n)].map(n=>
      [n,!!imageRecords[n]?.naturalWidth])),
    hazards:hazards.filter(h=>h.type==='firebin').map(h=>({type:h.type,x:h.x,w:h.w})),
    projectileTypes:['bottle','rock','firecracker'],
    projectileCount:projectiles.length,
    introVisible:!document.getElementById('introOverlay').hidden
  });
  debugInit();
  reset(false);$('overlay').hidden=true;
  window.BearlyCentrumEconomy?.bind(centrumCycleBridge);
  window.BearlyCentrumLink?.bind(centrumCycleBridge);
  Promise.all([load(),window.BearlyStreetProps.loaded,window.BearlyKids.loaded,window.BearlyNpcMotion.loaded,window.BearlyAtlas.loaded,window.BearlyWorld.loaded,window.BearlyWorld.prepareFor?.(210)]).then(async()=>{
    await window.BearlyWorld.warmupScene?.(illustratedState());
    startup.ready=true;startup.readyAt=performance.now();last=performance.now();acc=0;
    await window.BearlyCentrumEconomy?.bootstrap();
    await window.BearlyCentrumLink?.bootstrap();
    if(startup.requested&&!window.BearlyCentrumLink?.holding()&&!window.BearlyCentrumEconomy?.ready())enterReadyRide();
    requestAnimationFrame(now=>{loop(now);startup.firstFrameAt=performance.now();requestAnimationFrame(()=>{prepareRideReactions();});});
  });
})();
