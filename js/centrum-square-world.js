/* Scene floors, solids and source artwork. Character projection stays unchanged. */
(() => {
  'use strict';
  const TAU=Math.PI*2,art={},jobs=new Map();let error=null,lastPlanters=[];
  const get=id=>window.BearlyCentrumScenes.get(id||'metro-square');
  function hits(x,y,rx=22,ry=12,id='metro-square',state={}){
    const scene=get(id);if(!scene)return ['unknown-scene'];const f=scene.floor,found=[];
    if(x-rx<f.left)found.push('floor-west');if(x+rx>f.right)found.push('floor-east');
    if(y-ry<f.top)found.push('floor-north');if(y+ry>f.bottom)found.push('floor-south');
    for(const s of scene.solids)if(s.collidable!==false&&!(s.gateClosedOnly&&state.gateOpened)&&x+rx>s.x&&x-rx<s.x+s.w&&y+ry>s.y&&y-ry<s.y+s.h)found.push(s.id);
    return found;
  }
  function move(x,y,dx,dy,id='metro-square',state={}){
    const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/4)),hit=new Set();
    for(let i=0;i<steps;i++){
      const ax=x+dx/steps,bx=hits(ax,y,22,12,id,state);if(!bx.length)x=ax;else bx.forEach(k=>hit.add(k));
      const ay=y+dy/steps,by=hits(x,ay,22,12,id,state);if(!by.length)y=ay;else by.forEach(k=>hit.add(k));
    }return{x,y,hit:[...hit]};
  }
  function approach(id,x,y,a,state={}){
    if(!a||Math.hypot(x-a.x,y-a.y)>(a.radius||68))return false;
    const steps=Math.max(1,Math.ceil(Math.hypot(x-a.x,y-a.y)/4));
    for(let i=0;i<=steps;i++)if(hits(x+(a.x-x)*i/steps,y+(a.y-y)*i/steps,22,12,id,state).length)return false;
    return true;
  }
  const files={planter:'assets/v98_clean_planter.webp',metro:'assets/art/metro.png',food:'assets/art/pizzeria-walkable-v7.png',workshop:'assets/art/workshop-interior-v7.png',billys:'assets/v142_pizza_wrapper.webp',utility:'assets/v98_clean_utility.webp',crates:'assets/v98_clean_market_crates.webp',fence:'assets/v60_courtyard_fence.webp'};
  function load(key){
    if(!jobs.has(key))jobs.set(key,new Promise((resolve,reject)=>{const im=new Image();im.decoding='async';im.onload=async()=>{try{await im.decode?.();art[key]=im;resolve();}catch(e){reject(e);}};im.onerror=()=>reject(new Error(files[key]));im.src=files[key];}));
    return jobs.get(key);
  }
  function prepare(id='metro-square'){
    const scene=get(id);if(!scene)return Promise.reject(new Error('Unknown scene '+id));
    const keys=scene.kind==='room'?[scene.roomArt,...(id==='food-shop'?['billys']:[])]:id==='metro-square'?['planter','metro']:id==='shopping-arcade'?['planter']:['utility','crates','fence'];
    return Promise.all([window.BearlyAtlas.loaded,window.BearlyWorld.loaded,window.BearlyStreetProps.loaded,window.BearlyCentrumScenery?.prepare(id),...keys.map(load)]).catch(e=>{error=String(e);throw e;});
  }
  function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
  function text(c,value,x,y,size=14,color='#435044'){
    c.save();c.font=`700 ${size}px Trebuchet MS,sans-serif`;c.textAlign='center';c.fillStyle=color;c.fillText(value,x,y);c.restore();
  }
  function sign(c,value,x,y,w=190){
    c.save();c.fillStyle='#304c3eea';c.fillRect(x-w/2,y-18,w,27);c.strokeStyle='#bba77990';c.lineWidth=1;c.strokeRect(x-w/2+.5,y-17.5,w-1,26);text(c,value,x,y,12,'#f2ddb4');c.restore();
  }
  function development(c,value,x,y){c.save();const label='DEV PLACEHOLDER · '+value,w=label.length*5.2+10;c.fillStyle='#2d473edd';c.fillRect(x-w/2,y-10,w,14);text(c,label,x,y,9,'#f3e2b9');c.restore();}
  function threshold(c,x,y,width=76){
    // A narrow ground seam gives the interact anchor a visible point of approach.
    c.save();c.strokeStyle='#6a624a';c.lineWidth=3;c.beginPath();c.moveTo(x-width/2,y-3);c.lineTo(x+width/2,y-3);c.stroke();c.strokeStyle='#dfcfaa';c.lineWidth=1;c.beginPath();c.moveTo(x-width/2,y-1);c.lineTo(x+width/2,y-1);c.stroke();c.restore();
  }
  function drawBase(c,id='metro-square',state={}){
    const s=get(id),f=s.floor;
    if(s.kind==='room'){
      c.fillStyle='#78684f';c.fillRect(0,0,s.width,s.height);
      if(art[s.roomArt])c.drawImage(art[s.roomArt],0,0,1160,640);
      if(art[s.roomArt]){const im=art[s.roomArt];c.drawImage(im,0,im.naturalHeight-170,im.naturalWidth,170,0,640,1160,s.height-640);}
      // The foreground is an actual depth-walk floor, not an image/purchase overlay.
      c.save();c.strokeStyle='#4b422d55';for(let y=640;y<s.height;y+=30){c.beginPath();c.moveTo(0,y);c.lineTo(1160,y);c.stroke();}c.restore();
      sign(c,'← ARCADE',125,386,120);threshold(c,125,568,78);
      if(id==='food-shop'){sign(c,"BILLY’S · FOOD SHOP",800,300,230);if(art.billys)for(const x of [735,800,865])c.drawImage(art.billys,x-27,319,54,30);}
      return;
    }
    c.fillStyle='#c0bd9a';c.fillRect(0,0,s.width,s.height);
    const sky=c.createLinearGradient(0,0,0,330);sky.addColorStop(0,'#b6c6ba');sky.addColorStop(1,'#dfcca4');c.fillStyle=sky;c.fillRect(0,0,s.width,330);
    c.fillStyle=window.BearlyWorld.material(c,'grass')||'#747e4b';c.fillRect(0,320,s.width,s.height-320);
    c.fillStyle='#696f59';c.fillRect(f.left-12,f.top-10,f.right-f.left+24,f.bottom-f.top+22);
    c.fillStyle=window.BearlyWorld.material(c,'paving')||'#a39b83';c.fillRect(f.left,f.top,f.right-f.left,f.bottom-f.top);
    c.save();c.strokeStyle='#706f5b40';c.lineWidth=1;
    for(let y=f.top+16,row=0;y<f.bottom;y+=32,row++){
      c.beginPath();c.moveTo(f.left,y);c.lineTo(f.right,y);c.stroke();
      for(let x=f.left+(row%2?32:0);x<f.right;x+=64){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+32);c.stroke();}
    }
    c.strokeStyle='#d4c39a';c.lineWidth=6;c.strokeRect(f.left+18,f.top+62,f.right-f.left-36,f.bottom-f.top-80);
    c.strokeStyle='#65735c80';c.lineWidth=3;c.strokeRect(f.left+25,f.top+69,f.right-f.left-50,f.bottom-f.top-94);c.restore();
    c.save();for(let i=0;i<130;i++){
      const x=f.left+8+(i*139.19)%(f.right-f.left-16),y=i%3===0?f.bottom-10-(i%7)*2:f.top+30+(i*83.7)%(f.bottom-f.top-60);
      if(i%3!==0&&x>f.left+50&&x<f.right-50)continue;
      c.save();c.fillStyle=['#b78537','#cba153','#a86635','#dbc182'][i%4];c.translate(x,y);c.rotate(i*2.17);c.beginPath();c.ellipse(0,0,3.5,1.8,0,0,TAU);c.fill();c.restore();
    }c.restore();
    for(const e of s.exits){
      if(e.kind==='gate')continue;
      if(e.y<420){c.fillStyle='#c1b492';c.fillRect(e.x-40,e.y-32,80,44);c.strokeStyle='#e4d6ad';c.lineWidth=2;c.beginPath();c.moveTo(e.x-39,e.y+5);c.lineTo(e.x+39,e.y+5);c.stroke();}
    }
    if(id==='metro-square'){text(c,'T · METRO ↑',752,826,23,'#405b588c');text(c,'SHOPPING ARCADE ↑',340,426,12,'#4c5b4e');}
    if(id==='shopping-arcade'){
      const passageDrawn=window.BearlyCentrumScenery?.drawPassage(c,969,196,180,354)===true;
      if(!passageDrawn){
        // Honest fallback while a sprite is unavailable; never call this finished art.
        c.fillStyle='#465046';c.fillRect(995,405,105,200);c.fillStyle='#aa9f7f';c.fillRect(1006,420,94,185);
        const shade=c.createLinearGradient(1006,420,1006,605);shade.addColorStop(0,'#41504470');shade.addColorStop(1,'#c7b99412');c.fillStyle=shade;c.fillRect(1006,420,94,185);
        c.strokeStyle='#716d58';c.lineWidth=2;for(let y=435;y<605;y+=22){c.beginPath();c.moveTo(1006,y);c.lineTo(1100,y);c.stroke();}
        development(c,'PASSAGE',1047,466);
      }
      threshold(c,1060,550,90);sign(c,'DELIVERIES · DOOR 7 →',893,405,232);
      text(c,'Courtyard · caretaker',893,434,11,'#f0dbb6');
      sign(c,'← METRO SQUARE',165,660,190);
    }
    if(id==='service-courtyard'){
      // Source illustrated fence stays on the rear boundary, outside the floor.
      if(art.fence)for(const x of [50,910])c.drawImage(art.fence,x,320-205*art.fence.naturalHeight/art.fence.naturalWidth,205,205*art.fence.naturalHeight/art.fence.naturalWidth);
      sign(c,'← SHOPPING ARCADE',166,650,210);text(c,'SERVICEGÅRD · LEVERANSER',560,710,20,'#5b624c80');
      text(c,'DOOR 7 · DELIVERY CHECK-IN',580,390,12,'#435345');
    }
  }
  function drawBuilding(c,b){
    c.fillStyle='#485848';c.fillRect(b.x,b.footY-13,b.w,16);
    if(b.key==='metro'&&art.metro)c.drawImage(art.metro,11,162,1513,678,b.x,b.footY-b.w*678/1513+3,b.w,b.w*678/1513);
    else window.BearlyAtlas.draw(c,b.key,b.x+b.w/2,b.footY,b.w);
    if(b.id==='food-front')sign(c,"BILLY’S · MATBUTIK",b.x+b.w*.5,b.footY-110,205);
  }
  function drawFurniture(c,p,sceneId,options={}){
    if(p.kind==='bench')window.BearlyStreetProps.draw(c,'bench',p.anchorX,p.footY,p.artWidth,0);
    else{
      const key=p.kind==='planter'?'planter':p.kind==='utility'?'utility':'crates',im=art[key];ellipse(c,p.anchorX,p.footY+1,p.artWidth*.41,8,'#28392b35');
      if(!im)return;
      const scale=p.artWidth/im.naturalWidth,px=p.anchorX-p.artWidth/2,top=p.footY-im.naturalHeight*scale;
      if(p.kind!=='planter'){c.drawImage(im,px,top,p.artWidth,im.naturalHeight*scale);return;}
      const cut=80,leafHeight=cut*scale,bottom=top+leafHeight,player=options.player;
      // Only the upper source foliage may fade or sway. The stone planter and
      // its collision footprint remain fully opaque, fixed and ground-sorted.
      const babyY=player?player.y-(player.jump||0)-105:0;
      const fade=!!player&&player.y<p.footY&&Math.abs(player.x-p.anchorX)<p.artWidth*.5+34&&babyY+38>top&&babyY-38<bottom;
      c.drawImage(im,0,cut,im.naturalWidth,im.naturalHeight-cut,px,bottom,p.artWidth,(im.naturalHeight-cut)*scale);
      c.save();if(fade)c.globalAlpha*=.35;
      const sway=(window.BearlyCentrumAtmosphere?.wind(sceneId)||0)*.014;lastPlanters.push({id:p.id,faded:fade,foliageAlpha:fade?.35:1,stoneAlpha:1,swayPx:Math.abs(leafHeight*sway)});c.transform(1,0,sway,1,-bottom*sway,0);
      c.drawImage(im,0,0,im.naturalWidth,cut,px,top,p.artWidth,leafHeight);c.restore();
    }
  }
  function gate(c,id,state){
    const square=id==='metro-square',x=square?1360:1025,y=square?795:625,w=112;
    const gateDrawn=window.BearlyCentrumScenery?.drawGate(c,x,y+8,state.gateOpened)===true;
    if(!gateDrawn){
      c.save();c.translate(x,y);c.fillStyle='#707362';c.fillRect(-66,-110,14,118);c.fillRect(52,-110,14,118);
      c.strokeStyle='#2c463c';c.lineWidth=4;
      if(state.gateOpened){for(const side of [-1,1]){c.beginPath();c.moveTo(side*50,-102);c.lineTo(side*70,-75);c.lineTo(side*70,2);c.lineTo(side*50,2);c.stroke();}}
      else{c.strokeRect(-50,-104,100,106);for(let xx=-40;xx<=40;xx+=16){c.beginPath();c.moveTo(xx,-100);c.lineTo(xx,0);c.stroke();}c.fillStyle='#d8bc6c';c.fillRect(-9,-42,18,17);}
      c.restore();development(c,'GATE',x,y-95);
    }
    sign(c,state.gateOpened?(square?'COURTYARD ↗':'METRO SQUARE ↗'):(square?'GATE LOCKED · LATCH INSIDE':'GATE LATCH · OPEN TO SQUARE'),x,y-122,square?242:256);
  }
  function drawables(id='metro-square',state={},options={}){
    lastPlanters=[];const s=get(id),list=[...s.buildings.map(b=>({id:b.id,kind:b.kind,x:b.x+b.w/2,y:b.footY,footY:b.footY,draw:c=>drawBuilding(c,b)})),...s.furniture.map(p=>({id:p.id,kind:p.kind,x:p.anchorX,y:p.footY,footY:p.footY,foliageOnlyOcclusion:p.kind==='planter',draw:c=>drawFurniture(c,p,id,options)}))];
    if(id==='metro-square'||id==='service-courtyard')list.push({id:'service-gate',kind:'gate',x:id==='metro-square'?1360:1025,footY:id==='metro-square'?803:633,draw:c=>gate(c,id,state)});
    if(id==='shopping-arcade')list.push({id:'service-passage-jamb',kind:'post',x:996.5,footY:550,draw:c=>window.BearlyCentrumScenery?.drawPassageJamb(c)});
    return list;
  }
  function sceneryGaps(){
    const files=window.BearlyCentrumScenery?.audit().files||{};
    return [['gate','functional service gate','matched open/closed service-gate leaves and posts'],['passage','navigable side passage','matched side-passage doorway facade'],['cage','B-04 delivery cage overlay','matched B-04 delivery cage front/open states']].filter(([kind])=>!files[kind]?.reviewed);
  }
  window.BearlyCentrumSquareWorld={layout:get,blocked:(x,y,rx=22,ry=12,id='metro-square',state={})=>!!hits(x,y,rx,ry,id,state).length,move,approach,prepare,drawBase,drawables,audit:()=>({error,loaded:Object.keys(art),art:'original source environments/rooms plus an independent illustrated Centrum scenery kit',canopies:'source planter foliage only; stone remains opaque',developmentPlaceholders:sceneryGaps().map(g=>g[1]),missingArt:sceneryGaps().map(g=>g[2]),scenery:window.BearlyCentrumScenery?.audit()||null,foliageCut:{asset:files.planter,sourceY:80},wind:'isolated planter foliage; floor leaves only',planters:lastPlanters.map(p=>({...p}))})};
})();
