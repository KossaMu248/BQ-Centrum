/* Single owner for route parking, transfer and exploration. Driven by the game loop. */
(() => {
  'use strict';
  const ENTRY={id:'centrum-stop',routeId:'autumn-main',routeSceneId:'route:autumn-main',x:11325,radius:90};
  const host=document.querySelector('.canvas-wrap'),button=document.createElement('button');
  button.id='centrumRouteEntryBtn';button.type='button';button.hidden=true;button.textContent='CENTRUM · STOP TO PARK';host.append(button);
  let bridge=null,store=null,record=null,phase='riding',started=false,busy=false,failed=null,lastPersist='',saveAge=0,generation=0;
  const clone=v=>v==null?null:JSON.parse(JSON.stringify(v));
  const square=()=>window.BearlyCentrumSquare,visits=()=>window.BearlyVisits;
  const identity=()=>window.BearlyCentrumParkingSave.identity;
  function holding(){return phase!=='riding';}
  function current(){return bridge?.snapshot();}
  function health(){return current()?.health??record?.health??0;}
  function position(){return square()?.position?.()||record?.exploration;}
  function persist(nextPhase=phase){
    if(window.BearlyCentrumEconomy?.restoring()||!record||!store)return;
    const route=current();if(!route)return;
    const p=phase==='exploring'?position():record.exploration;
    const next={...record,phase:['dismount','remount','exploring'].includes(nextPhase)?nextPhase:'riding',health:route.health,adventure:route.adventure,routeProgress:route.routeProgress,exploration:p};
    const encoded=JSON.stringify(next);if(encoded!==lastPersist){const saved=store.save(next);if(saved){record=saved;lastPersist=encoded;}}
  }
  function bind(next){
    if(bridge)return;bridge=next;let storage;try{storage=window.BearlyCentrumSave?.storage||window.localStorage;}catch(_){}
    store=window.BearlyCentrumParkingSave.create(storage,p=>window.BearlyCentrumSave.create(storage,window.BearlyCentrumScenes).validPosition(p));record=store.load();
    if(record&&record.phase!=='riding')phase='restoring';
    document.getElementById('centrumSquareBtn').disabled=!bridge.snapshot().introHidden;
  }
  async function bootstrap(){
    if(started)return;started=true;if(phase!=='restoring'||!record)return;
    const token=++generation;busy=true;
    try{
      if(!bridge.restoreParking(record))throw Error('Saved parking does not match the route terrain');
      visits().centrumContext(bridge.visitContext(0));
      if(!await visits().restoreCentrumStreet(token))throw Error('Could not restore the production carrier');
      if(token!==generation)return;phase='exploring';await square().resumeLinked(record.exploration);if(token===generation)persist();
    }catch(e){if(token===generation){failed=String(e);phase='riding';visits()?.close();square()?.close();record=null;}}
    finally{if(token===generation)busy=false;}
  }
  function eligible(){
    const r=current();return !!r&&r.state==='playing'&&r.introHidden&&!r.debugOpen&&!r.demo&&r.health>0&&r.babyMounted&&r.grounded&&Math.abs(r.speed)<8&&Math.abs(r.x-ENTRY.x)<=ENTRY.radius&&!square()?.active()&&!visits()?.active();
  }
  async function enter(){
    if(holding()||busy||!eligible())return false;
    const token=++generation;const parked=bridge.park();if(!parked)return false;
    const anchor=window.BearlyCentrumScenes.get('metro-square').anchors['from-cycle-route'];
    record={schemaVersion:1,...identity(),phase:'dismount',parked,remount:{sceneId:'metro-square',anchorId:'bicycle-parking'},health:health(),adventure:current().adventure,routeProgress:current().routeProgress,
      exploration:{sceneId:'metro-square',entranceId:'from-cycle-route',...anchor}};
    phase='dismount';busy=true;failed=null;persist();button.hidden=true;
    visits().centrumContext(bridge.visitContext(0));
    try{
      const ok=await visits().centrumTransfer('dismount',token);if(token!==generation)return false;if(!ok)throw Error('Stop with grounded wheels before parking');
      return true;
    }catch(e){if(token===generation){failed=String(e);phase='riding';visits().close();persist('riding');}return false;}
    finally{if(token===generation)busy=false;}
  }
  function canTransfer(kind,token){
    return token===generation&&!!record&&(kind==='restore'?phase==='restoring':kind==='dismount'?phase==='dismount':false);
  }
  function canRemount(){
    if(phase!=='exploring'||busy||!record||health()<=0||!square()?.active())return false;
    // A first request starts the production transfer before its promise settles.
    // Repeated input must not invalidate that owner with a second generation.
    const transfer=visits()?.audit();if(transfer?.transition||transfer?.mode!=='street')return false;
    const a=square().audit(),p=square().position();if(a.paused||a.mapOpen||a.loading||a.transition||a.jump>1||p.sceneId!==record.remount.sceneId)return false;
    const anchor=window.BearlyCentrumScenes.get(record.remount.sceneId).anchors[record.remount.anchorId];
    return Math.hypot(p.x-anchor.x,p.y-anchor.y)<=42&&window.BearlyCentrumSquareWorld.approach(p.sceneId,p.x,p.y,{...anchor,radius:42},a.save);
  }
  async function requestRemount(target){
    if(target?.sceneId!==record?.remount.sceneId||target?.anchorId!==record?.remount.anchorId||!canRemount())return false;
    const token=++generation;const ok=await visits().centrumTransfer('mount',token);if(token!==generation||!ok)return false;
    phase='remount';persist();square().close();return true;
  }
  function update(dt,debugOpen){
    const r=current();if(!r)return;
    document.getElementById('centrumSquareBtn').disabled=!r.introHidden;
    button.hidden=holding()||square()?.active()||visits()?.active()||!r.introHidden||r.debugOpen||r.state!=='playing'||Math.abs(r.x-ENTRY.x)>ENTRY.radius;
    if(!button.hidden){button.disabled=!eligible();button.textContent=eligible()?'CENTRUM · PARK & ENTER · E':'CENTRUM · STOP TO PARK';}
    if(!holding()||busy)return;
    if(phase==='exploring'){
      square().update(dt,debugOpen);saveAge+=dt;if(saveAge>=1){persist();saveAge=0;}return;
    }
    if(phase==='dismount'||phase==='remount'){
      // Only the established transfer advances; road physics, combat and audio do not.
      if(visits().audit().transition)visits().update(bridge.visitContext(dt));
      if(phase==='dismount'&&visits().audit().mode==='street'&&!visits().audit().transition){
        phase='exploring';busy=true;const token=generation;
        square().openFromBicycle(record.exploration).then(()=>{if(token===generation){busy=false;persist();}}).catch(e=>{if(token===generation){busy=false;failed=String(e);}});
      }else if(phase==='remount'&&!visits().active()){
        bridge.resume(record);phase='riding';persist('riding');
      }
    }
  }
  function onExplorationChanged(){if(phase==='exploring')persist();}
  function bicycleNode(sceneId){
    if(phase!=='exploring'||sceneId!==record?.remount.sceneId)return null;
    const a=window.BearlyCentrumScenes.get(sceneId).anchors[record.remount.anchorId];
    return{id:'parked-player-bicycle',footY:a.y,draw:c=>bridge.drawEmptyBicycle(c,a.x,a.y,200)};
  }
  function marker(c,groundAt){
    if(holding())return;const gy=groundAt(ENTRY.x);if(!Number.isFinite(gy))return;
    c.save();c.translate(ENTRY.x,gy);c.fillStyle='#3a5143';c.fillRect(-4,-179,8,179);c.fillStyle='#213d30';c.strokeStyle='#f0cf87';c.lineWidth=2;c.fillRect(-116,-178,232,54);c.strokeRect(-116,-178,232,54);c.fillStyle='#fff0c8';c.textAlign='center';c.font='700 17px Arial';c.fillText('CENTRUM · PARK HERE',0,-155);c.font='12px Arial';c.fillText('STOP · E · BABY CARRIER',0,-135);c.restore();
  }
  function cancel(){
    if(!holding())return;generation++;persist('riding');phase='riding';busy=false;record=null;button.hidden=true;square()?.close();visits()?.close();
  }
  button.addEventListener('click',enter);
  window.addEventListener('keydown',e=>{
    if(phase==='riding'&&e.code==='KeyE'&&!e.repeat&&eligible()){e.preventDefault();e.stopImmediatePropagation();enter();}
  },true);
  window.addEventListener('pagehide',()=>{if(holding())persist();});
  window.BearlyCentrumLink={bind,bootstrap,update,holding,isExploring:()=>phase==='exploring',parking:()=>holding()?clone(record):null,health,canTransfer,canRemount,requestRemount,onExplorationChanged,bicycleNode,renderRouteMarker:marker,enter,cancel,
    audit:()=>({phase,holding:holding(),busy,error:failed,entry:{...ENTRY},parking:clone(record),route:current(),ownership:{bikeId:'centrum-family-bike',bicycles:1,passengers:1,passenger:phase==='exploring'?'carrier':holding()?(visits()?.audit().passengerOwner||'chair'):'chair'},listeners:3,loops:0})};
})();
