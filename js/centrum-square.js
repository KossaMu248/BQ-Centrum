/* Compact scene network. The copied ride/visits remain suspended intact. */
(() => {
  'use strict';
  const world=()=>window.BearlyCentrumSquareWorld,hero=()=>window.BearlyHeroRig;
  const host=document.querySelector('.canvas-wrap'),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const panel=document.createElement('section');panel.className='square-panel';panel.hidden=true;
  panel.setAttribute('aria-label','BQ-Centrum scene network');
  panel.innerHTML='<div class="square-heading"><div><strong><b class="square-title">METRO SQUARE</b> <span>· PROTOTYPE</span></strong><small class="square-subtitle">Stylised Hässelby-inspired places</small></div><div class="square-actions"><button id="squareMapBtn" type="button">MAP · M</button><button id="squarePauseBtn" type="button">Ⅱ PAUSE</button><button id="squareFullscreenBtn" type="button" aria-label="Toggle fullscreen">⛶</button><button class="square-settings" type="button" aria-label="Open settings">⚙</button><button class="square-exit" type="button">RETURN TO RIDE ↗</button></div></div><p class="square-message" aria-live="polite"></p>';
  const controls=document.createElement('div');controls.className='square-controls';controls.hidden=true;
  controls.innerHTML='<div class="square-dpad"><button data-square-dir="up" type="button" aria-label="Walk up">↑</button><button data-square-dir="left" type="button" aria-label="Walk left">←</button><button data-square-dir="down" type="button" aria-label="Walk down">↓</button><button data-square-dir="right" type="button" aria-label="Walk right">→</button></div><div class="square-moves"><button class="square-jump" type="button">JUMP · SPACE</button><button class="square-interact" type="button">LOOK · E</button></div>';
  host.append(panel,controls);
  const mapPanel=document.createElement('section');mapPanel.className='square-map';mapPanel.hidden=true;
  mapPanel.setAttribute('role','dialog');mapPanel.setAttribute('aria-modal','true');mapPanel.setAttribute('aria-label','Discovered area map');
  mapPanel.innerHTML='<div class="square-map-card"><h2>Places discovered</h2><p>Stylised Hässelby-inspired connections · walk between places.</p><div class="square-map-graph"></div><p class="square-map-gate"></p><p class="square-map-bag"></p><button type="button" class="square-map-close">BACK TO WALKING · M</button></div>';host.append(mapPanel);
  const messageEl=panel.querySelector('.square-message'),pauseBtn=panel.querySelector('#squarePauseBtn');
  const held=new Set(),touch=new Map();
  const camera={x:0,y:0,width:1160,height:640};
  let active=false,loading=false,paused=false,menuHold=false,mapOpen=false,prepareJob=null,returnFocus=null;
  let sceneId='metro-square',entranceId='start',progress=null,transition=null,session=0,exitGuard=0,saveTimer=0;
  let returning=null,routeHint='';
  let x=0,y=0,vx=0,vy=0,face=1,jump=0,jumpVelocity=0,stride=0,weight=0,talking=0,messageTime=0;
  let groundMotion=null;
  let drawOrder=[],shadow={x,y},hits=[],error=null;
  const keyDirections={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down'};
  const layout=()=>world().layout(sceneId),snapshot=()=>progress?.snapshot()||{};
  const link=()=>window.BearlyCentrumLink,linked=()=>!!link()?.isExploring?.();
  const position=()=>({sceneId,entranceId,x,y,face});
  function notifyLink(){if(linked())link().onExplorationChanged?.({position:position(),network:snapshot()});}
  function ensureProgress(){if(!progress){let storage;try{storage=window.BearlyCentrumSave?.storage||window.localStorage;}catch(_){}progress=window.BearlyCentrumSave.create(storage,window.BearlyCentrumScenes);}return progress;}
  function savePosition(){
    if(window.BearlyCentrumEconomy?.restoring()||!progress||loading||error)return;
    const old=progress.loadPosition();
    if(old.sceneId!==sceneId||Math.hypot(old.x-x,old.y-y)>1||old.face!==face||old.entranceId!==entranceId)
      progress.setPosition({sceneId,entranceId,x,y,face});
    notifyLink();
  }
  function clear(){held.clear();touch.clear();for(const b of controls.querySelectorAll('button'))b.classList.remove('held');vx=0;vy=0;}
  function has(dir){return held.has(dir)||[...touch.values()].includes(dir);}
  function say(text,seconds=6){messageEl.textContent=text;messageTime=seconds;messageEl.hidden=false;}
  function sync(){
    panel.hidden=controls.hidden=!active;
    mapPanel.hidden=!active||!mapOpen;
    panel.querySelector('.square-title').textContent=layout().title||layout().label||'METRO SQUARE';
    panel.querySelector('.square-subtitle').textContent='Stylised Hässelby-inspired places';
    panel.querySelector('.square-exit').textContent=linked()?'BACK TO BIKE · Q':'RETURN TO RIDE ↗';
    pauseBtn.textContent=paused?'▶ RESUME':'Ⅱ PAUSE';pauseBtn.setAttribute('aria-pressed',String(paused));
    for(const b of controls.querySelectorAll('button'))b.disabled=loading||paused||menuHold||mapOpen||!!window.BearlyCentrumStory?.blocking();
  }
  function setPaused(next){paused=!!next;clear();sync();}
  function follow(){
    const map=layout();camera.x=clamp(x-camera.width*.5,0,Math.max(0,map.width-camera.width));
    camera.y=clamp(y-camera.height*.66,0,Math.max(0,map.height-camera.height));
    // Portrait crops the same fixed-scale frame; pan that crop to the passenger.
    const box=host.getBoundingClientRect(),scale=Math.max(box.width/1160,box.height/640),visible=box.width/scale,visibleHeight=box.height/scale;
    host.style.setProperty('--square-pan',`${visible<1159?clamp((x-camera.x-visible*.5)/(1160-visible),0,1)*100:50}%`);
    // Keep the accepted camera/scale. Only the phone's cover crop can slide
    // within this same frame, protecting the head and boots at its boundaries.
    const overflow=Math.max(0,640-visibleHeight),center=overflow*.5,foot=y-camera.y;
    let crop=center;if(foot-center>visibleHeight-76)crop=foot-visibleHeight+76;
    if(foot-200-crop<28)crop=foot-200-28;
    host.style.setProperty('--square-pan-y',`${overflow?clamp(crop/overflow,0,1)*100:50}%`);
  }
  async function open(explicitPosition=null){
    if(active)return;const token=++session;returnFocus=document.activeElement;active=true;loading=true;paused=false;mapOpen=false;transition=null;error=null;clear();
    ensureProgress();
    const saved=explicitPosition&&progress.validPosition(explicitPosition)?explicitPosition:progress.loadPosition();
    ({sceneId,entranceId,x,y,face}=saved);if(explicitPosition)progress.setPosition(saved);
    jump=jumpVelocity=stride=weight=talking=0;groundMotion=null;hits=[];exitGuard=0;returning=null;routeHint='';
    document.body.classList.add('centrum-square-active');window.dispatchEvent(new CustomEvent('centrum-square-change'));follow();sync();
    say('Preparing the original bear and baby…',60);
    try{
      if(!prepareJob)prepareJob=hero().preload().then(()=>hero().prepareCentrumCache());
      await Promise.all([prepareJob,world().prepare(sceneId),window.BearlyCentrumStory?.prepare()]);if(!active||token!==session)return;
      if(!hero().ready())throw Error('Original character artwork is unavailable');
      loading=false;progress.discover(sceneId);say(linked()?'Arrows / WASD walk · E at doors · M map · Q returns to the parked bicycle.':'Arrows / WASD walk · E at a door or passage · M map · P pause · Q returns to the ride.',9);sync();notifyLink();window.BearlyCentrumStory?.sceneEntered(sceneId);
    }catch(e){if(token!==session)return;prepareJob=null;error=String(e);loading=false;say('This place could not load. Return to the ride and try again.',60);sync();}
  }
  function close(){
    if(!active)return;window.BearlyCentrumStory?.close();savePosition();session++;active=false;mapOpen=false;transition=null;returning=null;clear();document.body.classList.remove('centrum-square-active');
    window.dispatchEvent(new CustomEvent('centrum-square-change'));sync();if(returnFocus?.isConnected)returnFocus.focus();
  }
  function leap(){if(active&&!loading&&!paused&&!menuHold&&!mapOpen&&!window.BearlyCentrumStory?.blocking()&&jump<=0){jumpVelocity=355;}}
  function candidate(){
    const scene=layout(),entries=[...(scene.exits||[]),...(scene.interactions||[]).filter(a=>a.kind!=='story'),...(window.BearlyCentrumStory?.interactions(sceneId)||[])];
    const bike=bicycleTarget();if(bike)entries.push(bike);
    return entries.filter(a=>world().approach(sceneId,x,y,a,snapshot())).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0]||null;
  }
  async function travel(exit){
    const destination=window.BearlyCentrumScenes.get(exit.toScene),arrival=destination?.anchors?.[exit.toEntrance];
    if(!arrival||![1,-1].includes(arrival.face)||world().blocked(arrival.x,arrival.y,22,12,exit.toScene,snapshot())){say('This entrance is unavailable. Please use another route.');return;}
    const token=session;savePosition();returning=null;routeHint='';clear();loading=true;transition={from:sceneId,to:exit.toScene,exit:exit.id,entrance:exit.toEntrance};sync();
    try{
      await world().prepare(exit.toScene);if(!active||token!==session)return;
      // One named destination anchor is the only place scene transfers set position.
      sceneId=exit.toScene;entranceId=exit.toEntrance;({x,y,face}=arrival);jump=jumpVelocity=weight=0;groundMotion=null;
      exitGuard=35;loading=false;transition=null;progress.discover(sceneId);savePosition();follow();sync();window.BearlyCentrumStory?.sceneEntered(sceneId);
      say(`${destination.title||destination.label} · ${exit.gateSide==='courtyard'?'Gate opened from the courtyard. ':''}Walk clear of the entrance, then E to use a door or passage.`,5);
    }catch(e){if(token!==session)return;loading=false;transition=null;say('The next place could not load. Your current place is still available.');sync();}
  }
  function inspect(){
    if(loading||paused||menuHold||mapOpen||window.BearlyCentrumStory?.blocking()||jump>3)return;
    const anchor=candidate();
    if(!anchor){say('Move close to a doorway, passage or counter with a clear approach.');return;}
    if(anchor.kind==='remount'){attemptRemount(anchor);return;}
    if(anchor.kind==='story'){clear();weight=0;window.BearlyCentrumStory.interact(anchor);return;}
    if(!anchor.toScene){talking=.9;say(anchor.label||'Baby: Billy’s after our walk?');return;}
    if(exitGuard>0){say('Walk clear of the arrival threshold before using another exit.',3);return;}
    if(anchor.gateSide==='square'&&!snapshot().gateOpened){say('Gate locked on this side. Open it from the Service Courtyard.',5);return;}
    if(anchor.gateSide==='courtyard'){progress.openGate();notifyLink();window.BearlyCentrumEconomy?.checkpoint('shortcut-opened');}
    travel(anchor);
  }
  function refreshMap(){
    const state=snapshot(),all=window.BearlyCentrumScenes.all(),seen=state.discovered||[];
    const points={'metro-square':[145,55],'shopping-arcade':[395,55],'service-courtyard':[145,180],'food-shop':[395,180],'bicycle-workshop':[645,55]};
    const links=new Map();
    for(const s of all)for(const e of s.exits||[])if(points[e.toScene]){
      const key=[s.id,e.toScene].sort().join('|');if(!links.has(key))links.set(key,{a:s.id,b:e.toScene,gate:!!e.gateSide});
    }
    const lines=[...links.values()].map(({a,b,gate})=>`<line x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}" class="${gate&&!state.gateOpened?'map-locked':''}"/>`).join('');
    const nodes=all.map(s=>{const [px,py]=points[s.id],known=seen.includes(s.id);return `<g class="${known?'map-discovered':''} ${sceneId===s.id?'map-current':''}"><rect x="${px-108}" y="${py-27}" width="216" height="54" rx="6"/><text x="${px}" y="${py-2}">${known?(s.title||s.label):'Undiscovered'}</text><text x="${px}" y="${py+17}" class="map-detail">${sceneId===s.id?'You are here':known?'Discovered':'Explore on foot'}</text></g>`;}).join('');
    mapPanel.querySelector('.square-map-graph').innerHTML=`<svg viewBox="0 0 790 235" role="img" aria-label="Walking connections between discovered areas">${lines}${nodes}</svg>`;
    mapPanel.querySelector('.square-map-gate').textContent=state.gateOpened?'Courtyard gate ↔ Metro Square: open both ways.':'Courtyard → Metro Square: open the gate from the courtyard first.';
    mapPanel.querySelector('.square-map-bag').textContent=`No fast travel.${linked()?' Bicycle parked in Metro Square.':''}${routeHint?' '+routeHint:''}`;
  }
  function toggleMap(next=!mapOpen){
    if(!active||loading)return;savePosition();clear();mapOpen=next;if(next)refreshMap();sync();
    if(next)mapPanel.querySelector('button').focus();else panel.querySelector('#squareMapBtn').focus();
  }
  function bicycleTarget(){
    if(!linked())return null;
    const parking=link().parking?.(),target=parking?.remount;
    if(target?.sceneId!==sceneId||target.anchorId!=='bicycle-parking')return null;
    const anchor=layout().anchors?.[target.anchorId];if(!anchor)return null;
    return{id:'parked-player-bicycle',kind:'remount',label:'Back to bike',anchorId:target.anchorId,sceneId:target.sceneId,x:anchor.x,y:anchor.y,radius:42};
  }
  function attemptRemount(target=bicycleTarget()){
    if(!target||!linked()||target.sceneId!==sceneId||loading||paused||menuHold||mapOpen||jump>3)return false;
    if(!world().approach(sceneId,x,y,target,snapshot())||!link().canRemount?.())return false;
    returning=null;clear();savePosition();
    return link().requestRemount?.({sceneId:target.sceneId,anchorId:target.anchorId})!==false;
  }
  function routeHome(){
    const destination=link()?.parking?.()?.remount?.sceneId;if(!destination)return null;
    const pending=[[sceneId]],seen=new Set([sceneId]),state=snapshot();
    while(pending.length){
      const path=pending.shift(),last=path[path.length-1];if(last===destination)return path;
      for(const exit of window.BearlyCentrumScenes.get(last)?.exits||[]){
        if(exit.gateSide==='square'&&!state.gateOpened||seen.has(exit.toScene))continue;
        seen.add(exit.toScene);pending.push([...path,exit.toScene]);
      }
    }
    return null;
  }
  function pathTo(target){
    const step=26,state=snapshot(),clearSegment=(a,b)=>{
      const count=Math.max(1,Math.ceil(Math.hypot(a.x-b.x,a.y-b.y)/5));
      for(let i=0;i<=count;i++)if(world().blocked(a.x+(b.x-a.x)*i/count,a.y+(b.y-a.y)*i/count,22,12,sceneId,state))return false;
      return true;
    };
    if(clearSegment({x,y},target))return[{x:target.x,y:target.y}];
    const origin={x,y},key=(i,j)=>i+','+j,nodes=new Map(),closed=new Set(),open=[];
    const first={i:0,j:0,x,y,g:0,parent:null};first.f=Math.hypot(target.x-x,target.y-y);nodes.set('0,0',first);open.push(first);
    const directions=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
    for(let loops=0;open.length&&loops<5000;loops++){
      open.sort((a,b)=>a.f-b.f);const node=open.shift(),id=key(node.i,node.j);if(closed.has(id))continue;closed.add(id);
      if(Math.hypot(node.x-target.x,node.y-target.y)<step&&clearSegment(node,target)){
        const path=[{x:target.x,y:target.y}];let current=node;
        while(current.parent){path.push({x:current.x,y:current.y});current=current.parent;}return path.reverse();
      }
      for(const [di,dj] of directions){
        const i=node.i+di,j=node.j+dj,id=key(i,j);if(closed.has(id))continue;
        const point={x:origin.x+i*step,y:origin.y+j*step},g=node.g+Math.hypot(di,dj)*step;
        if(nodes.has(id)&&nodes.get(id).g<=g||!clearSegment(node,point))continue;
        const next={...point,i,j,g,f:g+Math.hypot(point.x-target.x,point.y-target.y),parent:node};nodes.set(id,next);open.push(next);
      }
    }
    return null;
  }
  function backToBike(){
    if(window.BearlyCentrumStory?.blocking()){window.BearlyCentrumStory.close();return;}
    if(!linked()){close();return;}
    if(loading||transition||jump>3)return;
    if(paused||menuHold){say('Resume walking before returning to the bicycle.');return;}
    const target=bicycleTarget();
    if(!target){
      returning=null;clear();const path=routeHome();
      routeHint=path?'Walk back: '+path.map(id=>{const s=window.BearlyCentrumScenes.get(id);return s?.title||s?.label||id;}).join(' → '):'The bicycle is in another scene. Follow the walking connections back.';
      say(routeHint,12);toggleMap(true);return;
    }
    if(attemptRemount(target))return;
    const destination=layout().anchors?.['from-cycle-route']||target,path=pathTo(destination);
    if(!path){say('No clear walking path to the bicycle. Walk around the obstruction and try again.',6);return;}
    clear();returning={sceneId,anchorId:target.anchorId,path};say('Walking back to the parked bicycle. A direction button cancels.',6);
  }
  function openFromBicycle(restoredPosition=null){
    ensureProgress();const arrival=window.BearlyCentrumScenes.get('metro-square')?.anchors?.['from-cycle-route'];
    const fallback={sceneId:'metro-square',entranceId:'from-cycle-route',...arrival};
    return open(restoredPosition&&progress.validPosition(restoredPosition)?restoredPosition:fallback);
  }
  function update(dt,debugOpen=false){
    if(!active)return;dt=clamp(dt,0,.04);
    if(menuHold!==debugOpen){menuHold=debugOpen;clear();sync();}
    const environmentPaused=paused||menuHold||loading||!!error||mapOpen;
    if(!environmentPaused)talking=Math.max(0,talking-dt);
    window.BearlyCentrumStory?.update(sceneId,dt,{x,y,face,jump,speed:Math.hypot(vx,vy)},{paused:environmentPaused});
    window.BearlyCentrumAtmosphere?.update(dt,sceneId,{paused:environmentPaused||!!window.BearlyCentrumStory?.blocking()});
    if(paused||menuHold||loading||error||mapOpen||window.BearlyCentrumStory?.blocking())return;
    messageTime-=dt;if(messageTime<=0)messageEl.hidden=true;
    let dx=Number(has('right'))-Number(has('left')),dy=Number(has('down'))-Number(has('up'));
    if(returning){
      if(dx||dy||returning.sceneId!==sceneId){returning=null;}
      else{
        if(attemptRemount())return;
        while(returning?.path.length>1&&Math.hypot(returning.path[0].x-x,returning.path[0].y-y)<10)returning.path.shift();
        const goal=returning?.path[0];
        if(!goal){returning=null;say('Walk beside the bicycle and press E to remount.');}
        else{dx=goal.x-x;dy=goal.y-y;}
      }
    }
    const length=Math.hypot(dx,dy);if(length){dx/=length;dy/=length;}
    // Same depth-walk starting point as visits: ease toward direction velocity.
    // Preserve side/front facing during vertical travel; never rotate the artwork.
    const depthGait=window.BearlyCentrumDepthGait,acceleration=1000*dt;
    vx+=clamp(dx*(depthGait?.walkSpeed||155)-vx,-acceleration,acceleration);vy+=clamp(dy*(depthGait?.depthSpeed||155)-vy,-acceleration,acceleration);
    if(dx)face=Math.sign(dx);
    const moved=world().move(x,y,vx*dt,vy*dt,sceneId,snapshot());hits=moved.hit;
    const travelX=moved.x-x,travelY=moved.y-y,distance=Math.hypot(travelX,travelY),gaitDistance=depthGait?.distance(travelX,travelY)??distance;
    if(gaitDistance>1e-8)groundMotion=depthGait?.heading(travelX/Math.max(.001,dt),travelY/Math.max(.001,dt),face)||null;
    else if(groundMotion)groundMotion={...groundMotion,metricSpeed:0};
    x=moved.x;y=moved.y;stride+=depthGait?.strideDistance(travelX,travelY)??gaitDistance;
    exitGuard=Math.max(0,exitGuard-distance);saveTimer+=dt;if(saveTimer>=1){savePosition();saveTimer=0;}
    weight+=(Math.min(1,gaitDistance/Math.max(.001,dt)/120)-weight)*(1-Math.exp(-16*dt));
    if(weight>.999)weight=1;if(weight<.0001){weight=0;groundMotion=null;}
    if(jump>0||jumpVelocity>0){jump+=jumpVelocity*dt;jumpVelocity-=1050*dt;if(jump<=0){jump=0;jumpVelocity=0;}}
    follow();
    const nearby=candidate();controls.querySelector('.square-interact').textContent=nearby?`${nearby.label} · E`:'LOOK · E';
  }
  function render(c,W,H){
    if(!active)return false;
    c.save();c.scale(W/1160,H/640);c.fillStyle='#626b51';c.fillRect(0,0,1160,640);
    c.save();c.translate(-camera.x,-camera.y);world().drawBase(c,sceneId,snapshot());
    window.BearlyCentrumAtmosphere?.drawFloor(c,sceneId,snapshot(),{player:{x,y,jump,height:200}});
    shadow={x,y};
    // All shadows stay on the floor. Jump affects only the painted actor.
    c.fillStyle='#23372738';c.beginPath();c.ellipse(x,y,37,8+4*Math.abs(groundMotion?.y||0)*weight,0,0,Math.PI*2);c.fill();
    const base=world().drawables(sceneId,snapshot(),{player:{x,y,jump,height:200,face}}).map(o=>({...o}));
    const list=window.BearlyCentrumStory?.decorate(sceneId,base)||base;
    const bicycle=linked()?link().bicycleNode?.(sceneId):null;if(bicycle)list.push(bicycle);
    list.push({id:'player',footY:y,draw:()=>{
      if(!loading&&!error)hero().draw(c,x,y-jump,200,face,{centrumCache:true,distance:stride,weight,groundMotion,jump,talking:talking>0||window.BearlyCentrumStory?.babySpeaking()||window.BearlyCentrumStory?.babyReacting?.()||!!window.BearlyCentrumInventory?.isEating(),mode:'square',state:{hp:link()?.health()??100,baby:false}});
    }});
    list.sort((a,b)=>a.footY-b.footY||a.id.localeCompare(b.id));
    drawOrder=list.map(o=>({id:o.id,footY:o.footY}));for(const o of list)o.draw(c,{time:stride/155});
    c.restore();
    if(paused||menuHold||loading||error){
      c.fillStyle='#15251b80';c.fillRect(0,0,1160,640);c.fillStyle='#fff4d9';c.textAlign='center';c.font='600 26px Arial';
      c.fillText(error?'ARTWORK UNAVAILABLE':transition?'WALKING THROUGH…':loading?'PREPARING THE NEIGHBOURHOOD…':menuHold?'SETTINGS OPEN':'PAUSED · P TO RESUME',580,320);
    }
    c.restore();return true;
  }
  panel.querySelector('.square-exit').addEventListener('click',backToBike);
  pauseBtn.addEventListener('click',()=>setPaused(!paused));
  panel.querySelector('#squareMapBtn').addEventListener('click',()=>toggleMap());
  mapPanel.querySelector('.square-map-close').addEventListener('click',()=>toggleMap(false));
  panel.querySelector('#squareFullscreenBtn').addEventListener('click',()=>window.BearlyFullscreen.toggle());
  panel.querySelector('.square-settings').addEventListener('click',()=>{clear();window.BEARLY_DEBUG_MENU.toggle(true);});
  controls.querySelector('.square-jump').addEventListener('click',leap);controls.querySelector('.square-interact').addEventListener('click',inspect);
  for(const b of controls.querySelectorAll('[data-square-dir]')){
    b.addEventListener('pointerdown',e=>{if(paused||loading||menuHold||mapOpen||window.BearlyCentrumStory?.blocking())return;e.preventDefault();touch.set(e.pointerId,b.dataset.squareDir);b.classList.add('held');try{b.setPointerCapture(e.pointerId);}catch(_){}});
    const release=e=>{touch.delete(e.pointerId);b.classList.remove('held');};
    for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,release);
  }
  window.addEventListener('keydown',e=>{
    if(!active||e.code==='F3'||window.BEARLY_DEBUG_MENU?.isOpen()||e.code==='KeyF'||e.target?.closest?.('input,textarea,select'))return;
    if(window.BearlyCentrumStory?.handleKey(e))return;
    // Activate here before the held ride/visit handlers can consume Enter/Space.
    const button=e.target?.closest?.('.square-panel button,.square-controls button,.square-map button');
    if(button&&['Enter','Space'].includes(e.code)){
      e.preventDefault();e.stopImmediatePropagation();if(!e.repeat&&!button.disabled)button.click();return;
    }
    if(e.code==='Tab'){if(mapOpen){e.preventDefault();e.stopImmediatePropagation();mapPanel.querySelector('button').focus();}return;}
    e.preventDefault();e.stopImmediatePropagation();
    if(e.code==='KeyM'||mapOpen&&['Escape','KeyQ'].includes(e.code)){if(!e.repeat)toggleMap();return;}
    if(mapOpen)return;
    if(keyDirections[e.code]&&!paused&&!loading)held.add(keyDirections[e.code]);
    if(e.repeat)return;
    if(e.code==='KeyC'){window.BearlyCentrumEconomy?.retry();return;}
    if(e.code==='Space')leap();if(e.code==='KeyP')setPaused(!paused);
    if(e.code==='KeyE'||e.code==='Enter')inspect();
    if(e.code==='Escape'||e.code==='KeyQ')backToBike();
  },true);
  window.addEventListener('keyup',e=>{if(!active)return;if(keyDirections[e.code])held.delete(keyDirections[e.code]);if(e.code!=='F3'&&e.code!=='KeyF'){e.stopImmediatePropagation();}},true);
  window.addEventListener('blur',()=>{if(active)setPaused(true);});
  document.addEventListener('visibilitychange',()=>{if(active&&document.hidden)setPaused(true);});
  window.addEventListener('pagehide',()=>{if(active)savePosition();});
  // Resize/fullscreen also recomputes the bounded crop while paused.
  new ResizeObserver(()=>{if(active)follow();}).observe(host);
  document.getElementById('mobilePauseBtn').addEventListener('click',e=>{if(active){e.stopImmediatePropagation();setPaused(!paused);}},true);
  window.BearlyCentrumSquare={clearInput:clear,inventoryContext:()=>({active,loading,paused,menuHold,mapOpen,transition,sceneId,x,y,vx,vy,jump,screenX:x-camera.x,screenY:y-camera.y,height:200}),open,close,openFromBicycle,resumeLinked:openFromBicycle,position,requestBackToBike:backToBike,active:()=>active,update,render,audit:()=>({active,loading,paused,menuHold,mapOpen,error,sceneId,sceneTitle:layout().title||layout().label,entranceId,transition,exitGuard,returning:returning?{sceneId:returning.sceneId,anchorId:returning.anchorId,waypoints:returning.path.length}:null,parkingNodeCount:drawOrder.filter(n=>n.id==='parked-player-bicycle').length,story:window.BearlyCentrumStory?.audit(),save:snapshot(),health:linked()?link().health():window.BEARLY_DEBUG?.().health,x,y,vx,vy,face,jump,stride,weight,groundMotion:groundMotion?{...groundMotion}:null,camera:{...camera},height:200,hero:hero()?.audit(),drawOrder,shadow:{...shadow},hits:[...hits],world:layout()})};
})();
