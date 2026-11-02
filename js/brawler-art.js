/* Painted NPC cast, reactions and staged full-body foreground screen impacts. */
(() => {
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),images={},sourceImages={};
  const files={
    adultsA:'assets/art/adult-cast-a-v15.png',reactionsA:'assets/art/cast-reactions-a-v15.png',screenA:'assets/art/cast-screen-a-v15.png',
    adultsB:'assets/art/adult-cast-b-v15.png',reactionsB:'assets/art/cast-reactions-b-v15.png',screenB:'assets/art/cast-screen-b-v15.png',
    adultsC:'assets/art/adult-cast-c-v15.png',reactionsC:'assets/art/cast-reactions-c-v15.png',screenC:'assets/art/cast-screen-c-v15.png',
    bottle:'assets/v162_projectile_bottle.png',rock:'assets/v162_projectile_rock.png',firecracker:'assets/v162_projectile_firecracker.png'
  };
  let preparing=null;
  for(const [id,path] of Object.entries(files)){const im=new Image();im.decoding='async';images[id]=im;sourceImages[path]=im;if(['bottle','rock','firecracker'].includes(id))im.src=path;}
  // Reactions and screen throws are needed after leaving the bicycle. Starting
  // the ride does not decode nine offscreen combat sheets on a phone.
  function prepare(){
    if(preparing)return preparing;
    preparing=Promise.all(Object.entries(files).map(([id,path])=>new Promise(resolve=>{const im=images[id];if(im.naturalWidth){resolve();return;}im.onload=async()=>{try{await im.decode?.();}catch{}resolve();};im.onerror=()=>resolve();if(!im.src||(im.complete&&!im.naturalWidth))im.src=path;})));
    return preparing;
  }
  // Each wardrobe carries its own measured source geometry. Clothing selection
  // never changes with aggression, damage, transport or the screen-throw state.
  const wardrobes=[];
  function addWardrobe(label,pack,standing,reactions,screen,age,sourceFace){
    wardrobes.push({variant:wardrobes.length,label,character:{ageGroup:pack==='C'?'older-adult':'young-adult',age,civilian:wardrobes.length>=6,faceCovered:[2,5].includes(wardrobes.length)},standing:{image:files['adults'+pack],rect:standing,face:sourceFace,split:pack==='B'&&wardrobes.length%3===2?.76:.58},
      reactions:{image:files['reactions'+pack],...reactions},screen:{image:files['screen'+pack],frames:screen}});
  }
  const frame=(rect,anchor,outline)=>({rect,anchor,...(outline?{outline}:{})});
  // Fresh V15 anatomy is measured from each authored cast sheet. No frame
  // geometry is shared with the earlier faces, bodies or tactical layers.
  const newReactionsA=[
    {stature:378,frames:[frame([45,50,345,396],[216.5,436]),frame([415,123,379,305],[606,419]),frame([816,293,412,147],[1023,430])]},
    {stature:367,frames:[frame([65,459,301,379],[215.5,834]),frame([413,528,398,294],[616.5,810]),frame([826,685,416,143],[1033.5,820])]},
    {stature:382,frames:[frame([32,838,348,395],[206,1225]),frame([419,895,379,313],[610,1195]),frame([818,1071,411,157],[1025.5,1214])]}
  ];
  const newReactionsB=[
    {stature:301,frames:[frame([98,30,355,326],[277.5,342]),frame([575,78,408,278],[781,345]),frame([1039,151,408,207],[1244.5,346])]},
    {stature:304,frames:[frame([107,375,387,319],[303.5,687],[[107,375],[494,375],[494,694],[400,694],[400,687],[107,687]]),frame([586,397,411,265],[787,654]),frame([1053,445,399,247],[1255,677])]},
    {stature:287,frames:[frame([109,683,394,301],[309.5,978],[[109,683],[400,683],[400,690],[503,690],[503,984],[109,984]]),frame([572,693,413,280],[778.5,964]),frame([1064,754,388,228],[1257.5,975])]}
  ];
  const newReactionsC=[
    {stature:258,frames:[frame([111,116,254,274],[239.5,382]),frame([513,151,261,216],[645,358]),frame([910,251,278,139],[1049,379])]},
    {stature:262,frames:[frame([109,497,271,279],[247.5,767]),frame([521,527,244,218],[642,737]),frame([912,612,269,161],[1048.5,765])]},
    {stature:263,frames:[frame([108,873,285,285],[251,1145]),frame([530,898,249,227],[658.5,1115]),frame([895,1019,297,145],[1044,1157])]}
  ];
  const newScreenA=[
    [{rect:[57,11,449,509]},{rect:[58,522,460,502]}],
    [{rect:[603,20,395,501]},{rect:[602,531,396,493]}],
    [{rect:[1109,1,382,527],outline:[[1109,1],[1491,1],[1491,528],[1320,528],[1320,520],[1109,520]]},
      {rect:[1118,520,384,504],outline:[[1118,520],[1320,520],[1320,528],[1502,528],[1502,1024],[1118,1024]]}]
  ];
  const newScreenB=[
    [{rect:[81,20,397,504],outline:[[81,20],[478,20],[478,524],[380,524],[380,511],[200,511],[200,524],[81,524]]},
      {rect:[77,511,403,498],outline:[[77,524],[200,524],[200,511],[380,511],[380,524],[480,524],[480,1009],[77,1009]]}],
    [{rect:[590,37,371,484]},{rect:[591,533,374,475]}],
    [{rect:[1103,30,353,497],outline:[[1103,30],[1456,30],[1456,527],[1320,527],[1320,526],[1103,526]]},
      {rect:[1101,526,355,482],outline:[[1101,526],[1320,526],[1320,527],[1456,527],[1456,1008],[1101,1008]]}]
  ];
  const newScreenC=[
    [{rect:[38,167,320,575]},{rect:[38,860,332,572]}],
    [{rect:[391,171,301,571]},{rect:[390,861,302,571]}],
    [{rect:[697,171,298,576]},{rect:[701,861,293,572]}]
  ];
  const namesA=[
    'Black quilted puffer · black hoodie and loose nylon trousers · black performance runners · black cap and sling',
    'Charcoal technical fleece set · black tapered joggers · black low-top trainers · black cap · black athletic sling',
    'Black tactical field jacket · black hoodie and utility chest rig · black cargo trousers · black runners · black balaclava'
  ];
  const namesB=[
    'Black utility vest · black heavyweight hoodie · dark tactical cargos · dark runners · black beanie and sling',
    'Black technical hooded jacket · black nylon joggers · dark performance runners · black cap · black athletic sling',
    'Long black technical parka · hooded layer · charcoal trousers · black runners · black balaclava'
  ];
  const standingA=[[13,0,649,818],[699,28,563,793],[1328,0,553,825]],standingB=[[71,93,498,669],[739,120,478,643],[1372,108,437,662]];
  for(let i=0;i<3;i++)addWardrobe(namesA[i],'A',standingA[i],newReactionsA[i],newScreenA[i],[20,21,22][i],[-1,1,1][i]);
  for(let i=0;i<3;i++)addWardrobe(namesB[i],'B',standingB[i],newReactionsB[i],newScreenB[i],[21,20,20][i],[-1,1,1][i]);
  const casualNames=[
    'Black work jacket · dark knit · charcoal relaxed denim · black boots · black beanie',
    'Midnight autumn coat · deep-plum scarf · black trousers · black boots · tied hair',
    'Black quilted bomber · dark scarf · deep-olive trousers · black trainers · black beanie'
  ];
  const standingC=[[49,182,417,672],[607,196,388,660],[1081,186,393,680]];
  for(let i=0;i<3;i++)addWardrobe(casualNames[i],'C',standingC[i],newReactionsC[i],newScreenC[i],[52,42,55][i],[1,1,1][i]);
  for(const [i,label]of ['Peaceful student · navy hoodie · blue jeans · canvas backpack · gray trainers','Peaceful stocky neighbour · tan windbreaker · burgundy knit · dark jeans · brown shoes','Peaceful older neighbour · teal cardigan · plum scarf · charcoal trousers · canvas tote'].entries()){
    wardrobes.push({variant:9+i,label,character:{ageGroup:i===0?'young-adult':'older-adult',age:[24,46,68][i],civilian:true,faceCovered:false,heightScale:[1.05,1,.84][i]},standing:{image:'assets/art/civilian-standing-v16.png',rect:[0,0,1,1],face:1},reactions:{image:'assets/art/civilian-reactions-v16.png',stature:1,frames:[]},screen:{image:'assets/art/civilian-reactions-v16.png',frames:[]}});
  }
  let civilianGeometryReady=false;
  function syncCivilians(){
    if(civilianGeometryReady||!window.BearlyNpcMotion?.ready())return;
    for(let variant=9;variant<12;variant++){
      const p=wardrobes[variant],idle=window.BearlyNpcMotion.frame(variant,'idle');p.standing.rect=idle.rect;p.standing.stature=idle.stature;
      p.reactions.frames=['hurt','fall','prone'].map(pose=>{const f=window.BearlyNpcMotion.frame(variant,pose);return{rect:f.rect,anchor:f.anchor};});p.reactions.stature=window.BearlyNpcMotion.frame(variant,'hurt').stature;
      p.screen.frames=['screen','screenDamaged'].map(pose=>({rect:window.BearlyNpcMotion.frame(variant,pose).rect}));
    }
    civilianGeometryReady=true;
  }
  function wardrobe(n){const variant=Number.isFinite(n.variant)?Math.trunc(n.variant):0;return wardrobes[(variant%wardrobes.length+wardrobes.length)%wardrobes.length];}
  function reaction(c,n,col,h){
    const profile=wardrobe(n).reactions,im=sourceImages[profile.image],f=profile.frames[col],sc=h/profile.stature;
    const [sx,sy,sw,sh]=f.rect,[ax,ay]=f.anchor;
    c.save();
    const outline=f.outline;
    if(outline){c.beginPath();for(const [i,[x,y]]of outline.entries())i?c.lineTo((x-ax)*sc,(y-ay)*sc):c.moveTo((x-ax)*sc,(y-ay)*sc);c.closePath();c.clip();}
    c.drawImage(im,sx,sy,sw,sh,(sx-ax)*sc,(sy-ay)*sc,sw*sc,sh*sc);c.restore();
  }
  function gang(c,n,h){
    return window.BearlyKids.drawState(c,n,h);
  }
  function adult(c,n,x,y,h=130,scale=1){
    if(n.active===false||n.visible===false)return;
    if(n.kind!=='gangster'){
      if(window.BearlyNpcMotion?.draw(c,n,x,y,h,scale))return;
      if((n.variant||0)>=9)return;
      const passive=!n.hostile&&!['aggressive','hostile'].includes(n.mood)&&!['stagger','fall','dead','down','rise','held'].includes(n.state);
      if(passive&&!window.BearlyNpcMotion?.ready())return;
    }
    const profile=wardrobe(n),im=sourceImages[profile.standing.image];if(n.kind!=='gangster'&&!im.naturalWidth){prepare();window.BearlyNpcMotion?.drawPose(c,{variant:n.variant||0,pose:'idle',x,y,height:h,face:n.face||1});return;}
    if(n.kind==='gangster')h=window.BearlyKids.heightFor(h);
    c.save();c.translate(x,y);c.scale(scale,scale);
    const sourceFace=n.kind==='gangster'?1:profile.standing.face,flip=(n.face||1)*sourceFace<0;if(flip)c.scale(-1,1);
    if(n.kind==='gangster'){gang(c,n,h);c.restore();return;}
    const reactionState=['stagger','fall','dead','down','rise'].includes(n.state);
    if(reactionState&&sourceImages[profile.reactions.image].naturalWidth){
      const col=['dead','down'].includes(n.state)?2:n.state==='fall'?(n.age<.4?1:2):n.state==='rise'?(n.age<.25?2:0):0;
      if(n.state==='stagger')c.translate(Math.sin(n.age*35)*h*.018,0);
      reaction(c,n,col,h);c.restore();return;
    }
    const [sx,sy,sw,sh]=profile.standing.rect,sc=h/sh,w=sw*sc,phase=(n.distance||0)/27;
    const moving=n.moving;
    if(n.state==='held')c.rotate(-.22);
    if(n.punching)c.rotate(.12);
    if(moving){
      const split=profile.standing.split,cut=sh*split,overlap=sh*.06,legY=sy+cut-overlap;
      for(let i=0;i<2;i++){
        // Each source half pivots around its own attachment. Its zero-phase
        // position exactly matches the standing painting, with no outward gap.
        const pivot=(i?1:-1)*w*.25;
        c.save();c.translate(pivot,-h*(1-split));c.rotate(Math.sin(phase+i*Math.PI)*.085);
        c.drawImage(im,sx+i*sw/2,legY,sw/2,sh-cut+overlap,-w*.25,-overlap*sc,w*.5,(sh-cut+overlap)*sc);c.restore();
      }
      // A continuous band of the authored upper body covers both moving joints.
      // The longer parka keeps its hem in this intact foreground section.
      const upperHeight=Math.min(sh,cut+overlap*.55);
      c.drawImage(im,sx,sy,sw,upperHeight,-w*.5,-h,w,upperHeight*sc);
    }else c.drawImage(im,sx,sy,sw,sh,-w*.5,-h,w,h);
    if(n.mood!=='calm'){
      c.strokeStyle='#c44c3c';c.lineWidth=2;c.beginPath();c.moveTo(-5,-h-8);c.lineTo(5,-h-8);c.moveTo(0,-h-13);c.lineTo(0,-h-3);c.stroke();
    }
    c.restore();
  }
  function projectile(c,q,x,y){
    const im=images[q.kind];if(!im?.naturalWidth)return;const w=q.kind==='rock'?16:q.kind==='bottle'?32:29,h=q.kind==='rock'?10:q.kind==='bottle'?18:16;
    c.save();c.translate(x,y);c.rotate(q.age*3);c.drawImage(im,-w/2,-h/2,w,h);c.restore();
  }
  function impact(c,e,x,y,h=145,reduced=false){
    const age=e.age,t=Math.max(0,1-age/.85),claws=e.kind==='claws';
    c.save();c.translate(x,y-h*.45);c.globalAlpha=t;
    if(claws){
      c.fillStyle='#e2d1a9';for(let i=0;i<5;i++){const a=i*2.399;c.beginPath();c.ellipse(Math.cos(a)*h*.14,Math.sin(a)*h*.12,h*.20,h*.12,a,0,Math.PI*2);c.fill();}
      c.strokeStyle='#a53a36';c.lineWidth=3;
      for(let i=0;i<3;i++){c.beginPath();c.moveTo(-h*.2+i*9,-h*.2);c.quadraticCurveTo(i*10,h*.02,h*.16+i*5,h*.22);c.stroke();}
    }
    for(let i=0;i<10;i++){
      const a=i*2.399,spread=reduced?8:10+age*105,px=Math.cos(a)*spread,py=Math.sin(a)*spread-age*30;
      c.fillStyle=claws&&i<3?'#9d3a34':['#edce7e','#dfdfc0','#a8744f'][i%3];c.fillRect(px,py,claws&&i<3?3:5,claws&&i<3?4:3);
    }
    c.restore();
  }
  function screenSource(n,damaged){
    if(n.kind==='gangster'){
      return window.BearlyKids.screenSource(n.item||'rock',damaged);
    }
    if((n.variant||0)>=9)return window.BearlyNpcMotion.source(n.variant,damaged?'screenDamaged':'screen');
    const profile=wardrobe(n).screen;return {image:sourceImages[profile.image],...profile.frames[damaged?1:0]};
  }
  function screenBody(c,n,w,h,damaged){
    const source=screenSource(n,damaged),[sx,sy,sw,sh]=source.rect;c.save();
    if(source.outline){c.beginPath();for(const[i,[x,y]]of source.outline.entries()){
      const dx=-w*.5+(x-sx)*w/sw,dy=-h*.5+(y-sy)*h/sh;i?c.lineTo(dx,dy):c.moveTo(dx,dy);
    }c.closePath();c.clip();}
    c.drawImage(source.image,...source.rect,-w*.5,-h*.5,w,h);c.restore();
  }
  function overlay(c,state,W,H,project,reduced,view={left:0,width:W}){
    const center=view.left+view.width*.5;
    for(const n of state.npcs.filter(n=>n.state==='screen')){
      const age=n.age,source=screenSource(n,age>=.74);if(!source?.image||!(source.image.naturalWidth||source.image.width))continue;
      const aspect=source.rect[2]/source.rect[3],arrival=clamp(age/.64,0,1),ease=arrival*arrival*(3-2*arrival),start=project(n.startX,n.startDepth);
      const targetH=Math.min(H*.70,view.width*.78/aspect),initialH=Math.min(targetH,n.kind==='gangster'?window.BearlyKids.heightFor(start.height):start.height);
      const hit=Math.max(0,age-.64),slide=clamp((hit-.42)/.59,0,1),squash=!reduced&&age>=.64&&hit<.14?Math.sin(hit/.14*Math.PI)*.10:0;
      let h=(initialH+(targetH-initialH)*ease)*(1-squash*.65),w=h*aspect*(1+squash),rotation=reduced||age>=.64?0:Math.sin(arrival*Math.PI)*.08;
      // Fit the transformed WHOLE cel, including both boots, within the visible camera crop.
      const cosine=Math.abs(Math.cos(rotation)),sine=Math.abs(Math.sin(rotation));
      let bw=w*cosine+h*sine,bh=h*cosine+w*sine;
      const fit=Math.min(1,(view.width-16)/bw,(H-24)/bh);w*=fit;h*=fit;bw*=fit;bh*=fit;
      const rawX=start.x+(center-start.x)*ease,rawY=(start.y-initialH*.5)+(H*.45-(start.y-initialH*.5))*ease-(reduced?0:Math.sin(arrival*Math.PI)*28);
      const cx=clamp(rawX,view.left+bw*.5+8,view.left+view.width-bw*.5-8),cy=slide>0?H*.45+slide*slide*H*.9:clamp(rawY,bh*.5+12,H-bh*.5-12);
      c.save();c.translate(cx,cy);c.rotate(rotation);c.globalAlpha=1-slide*.8;
      screenBody(c,n,w,h,age>=.74);
      if(age>=.64&&hit<.5){
        const faceY=-h*.30,r=Math.min(w*.45,h*.15);
        c.strokeStyle='#ffffffa0';c.lineWidth=1.4;
        for(let i=0;i<7;i++){const a=i*Math.PI*2/7+.2,rr=r*(.8+(i%3)*.12);c.beginPath();c.moveTo(Math.cos(a)*rr*.45,faceY+Math.sin(a)*rr*.45);c.lineTo(Math.cos(a)*rr,faceY+Math.sin(a)*rr);c.lineTo(Math.cos(a+.12)*rr*1.16,faceY+Math.sin(a+.12)*rr*1.16);c.stroke();}
        c.shadowColor='#000';c.shadowBlur=4;c.textAlign='center';c.font=`600 ${Math.min(24,view.width*.075)}px Arial, sans-serif`;c.fillStyle='#fff';if(view.width>=W*.8)c.fillText('SMACK!',0,-h*.5-10);
        c.font=`600 ${Math.min(23,view.width*.075)}px Arial, sans-serif`;c.fillStyle='#f2a28e';c.fillText('−'+(n.lastDamage??32),w*.23,-h*.03);
        if(n.hp===0){c.fillStyle='#fff';c.font='600 15px Arial, sans-serif';c.fillText('KO',w*.23,h*.05);}
      }
      c.restore();
    }
  }
  window.BearlyBrawlArt={prepare,ready:()=>{syncCivilians();return Object.values(images).every(im=>im.naturalWidth>0)&&wardrobes.every(w=>w.reactions.frames?.length===3&&w.screen.frames?.length===2)&&window.BearlyHeroRig.ready()&&!!window.BearlyNpcMotion?.ready()&&!!window.BearlyKids?.ready();},adult,projectile,impact,overlay,
    outfit:n=>n.kind==='gangster'?window.BearlyKids.outfit(n.item||'rock'):wardrobe(n).label,
    wardrobeCount:wardrobes.length,motionReady:()=>!!window.BearlyNpcMotion?.ready(),wardrobe:()=>{syncCivilians();return JSON.parse(JSON.stringify(wardrobes));}};
})();
