/* The existing adventure ledger is the only owner of food, kronor and checkpoints.
   This adapter shares source health and the one game loop; it creates no simulation. */
(() => {
  'use strict';
  const ledger=window.BearlyCentrumSave.adventure,balance=window.BearlyCentrumBalance;
  const PARK='bq-centrum:parking:v1';
  let bridge=null,booted=false,started=false,reloading=false,age=0,lastHealth=null,pendingCheckpoint=null,lastNotice='',noticeAge=0;
  const clone=value=>value==null?null:JSON.parse(JSON.stringify(value));
  const inventory=()=>window.BearlyCentrumInventory,link=()=>window.BearlyCentrumLink,square=()=>window.BearlyCentrumSquare;
  const snapshot=()=>ledger.snapshot();
  function context(){
    const source=bridge?.inventoryContext()||{active:false,health:100},s=square()?.inventoryContext();
    const state=snapshot(),inSquare=!!s?.active;
    const current=inSquare?{...source,active:true,mode:'centrum',sceneId:s.sceneId,position:{x:s.x,y:s.y},speed:Math.hypot(s.vx,s.vy),jump:s.jump,grounded:s.jump<=1,
      screenX:s.screenX,paused:s.paused||s.menuHold||s.mapOpen||!!source.debugOpen,menuHold:s.menuHold,mapOpen:s.mapOpen,transition:s.loading||!!s.transition,
      danger:false,combat:false,dialogue:!!window.BearlyCentrumStory?.blocking()}:source;
    if(link()?.holding()&&!link().isExploring())current.transition=true;
    current.recoveryAllowed=current.active&&state.wallet.kr===0&&state.inventory.billys===0&&current.health<balance.recoveryHealth&&!current.transition;
    current.retryAllowed=!!state.checkpoint&&booted;return current;
  }
  function session(){
    if(!bridge)return null;const route=bridge.snapshot();if(!route.introHidden)return null;
    const p=square()?.active()?square().position():link()?.parking()?.exploration;
    return{health:route.health,mode:link()?.holding()||square()?.active()?'exploring':'riding',route,exploration:p||null};
  }
  function sync(){
    if(!booted||reloading)return{ok:false,reason:'not_ready'};
    const current=session();if(!current)return{ok:false,reason:'not_started'};
    lastHealth=current.health;age=0;return ledger.syncSession(current);
  }
  function notify(text){inventory()?.notify(text);}
  function bind(next){
    if(bridge)return;bridge=next;
    // Session is authoritative on retry/recovery, even if an older parking cache
    // describes another room. Normalize that cache before Link reads it.
    const state=snapshot(),saved=state.components[PARK];
    if(saved){
      const p=state.session.exploration,route=state.session.route;
      const normalized={...clone(saved),health:state.session.health};
      if(route&&window.BearlyCentrumParkingSave.validateProgress(route.routeProgress)&&window.BearlyCentrumParkingSave.validateAdventure(route.adventure)){normalized.routeProgress=clone(route.routeProgress);normalized.adventure=clone(route.adventure);}
      if(state.session.mode==='riding')normalized.phase='riding';
      else if(p){normalized.phase='exploring';const positions=window.BearlyCentrumSave.create(window.BearlyCentrumSave.storage,window.BearlyCentrumScenes);normalized.exploration=positions.validPosition(p)?clone(p):positions.loadPosition();}
      try{window.BearlyCentrumSave.storage.setItem(PARK,JSON.stringify(normalized));}catch(_){}
    }
    inventory()?.bind({context,snapshot,stopInput:()=>bridge.clearInput(),setBrowsing:()=>{},commitEat,recover,retry});
  }
  async function bootstrap(){
    if(booted)return;booted=true;const state=snapshot(),saved=state.session;
    if(saved.route){
      const route={...clone(saved.route),health:saved.health,adventure:clone(state.components['bq-centrum:adventure:v1']||saved.route.adventure)};
      if(route.routeProgress)route.routeProgress.collectedPickups=state.collectedIDs;
      try{started=bridge.restoreSession(route);}catch(_){started=false;}
      if(!started){const safe=bridge.snapshot();safe.health=saved.health;started=bridge.restoreSession(safe);notify('Invalid saved route: safe entry loaded.');}
    }
    if(!started&&state.components[PARK]&&saved.mode==='exploring')started=true; // Existing project save upgrade; Link validates terrain/anchors.
    bridge.setHealth(saved.health);bridge.applyCollected(state.collectedIDs);
    if(state.loadStatus==='checkpoint_recovery')notify('Save recovered from the complete checkpoint.');
    else if(state.loadStatus==='invalid_save_recovery')notify('Incompatible save: safe entry loaded.');
  }
  function afterReset(playing){
    if(!bridge||!booted)return;
    const state=snapshot();bridge.setHealth(state.session.health);bridge.applyCollected(state.collectedIDs);
    if(playing){started=true;pendingCheckpoint='adventure-start';}
  }
  function interceptReset(playing){if(playing&&booted&&started){retry();return true;}return false;}
  function commitEat(actionId,expectedHealth){
    const c=context();
    if(!c.active||c.health<=0||c.health>=balance.maxHealth||c.health!==expectedHealth||c.paused||c.transition||c.dialogue||c.menuHold||c.mapOpen||c.danger||c.combat||Math.abs(c.speed)>=1||c.jump>1||c.grounded===false)return{ok:false,reason:'Eating interrupted — food kept.'};
    const synced=sync();if(!synced.ok)return synced;
    const result=ledger.eatCommit(actionId,expectedHealth);
    if(result.ok){bridge.setHealth(result.state.session.health);lastHealth=result.state.session.health;}
    else if(result.reason==='save_unavailable')return{...result,reason:'Could not save. Food kept.'};return result;
  }
  function collect(id){
    const synced=sync();if(!synced.ok)return synced;
    const result=ledger.collect(id);
    if(result.ok)notify('Billy’s added to bag · I to eat');
    else if(result.reason==='bag_full'&&(lastNotice!==id||noticeAge<=0)){notify('Bag full');lastNotice=id;noticeAge=2;}
    return result;
  }
  function purchase(){const synced=sync();return synced.ok?ledger.purchase():synced;}
  function claimReward(){const synced=sync();return synced.ok?ledger.claimWrongEntrance():synced;}
  function checkpoint(reason){const synced=sync();return synced.ok?ledger.checkpoint(reason):synced;}
  function reloadAfter(result){
    if(result.ok){reloading=true;inventory()?.cancel();location.reload();}return result;
  }
  function retry(){if(reloading)return{ok:false,reason:'Restoring checkpoint.'};return reloadAfter(ledger.retry());}
  function recover(){
    if(reloading)return{ok:false,reason:'Restoring checkpoint.'};
    const c=context();if(!c.recoveryAllowed)return{ok:false,reason:'Rest is available with no money or food below two hearts.'};
    const synced=sync();if(!synced.ok)return synced;
    // Whole-world reload discards every damaged enemy/encounter. No safe-menu
    // refill can retain damage dealt, and no takeaway item is ever granted.
    return reloadAfter(ledger.recover('rest:'+Date.now().toString(36)));
  }
  function update(dt){
    if(!booted||reloading)return;age+=dt;noticeAge=Math.max(0,noticeAge-dt);
    const current=bridge.snapshot();
    if(current.introHidden&&!started){started=true;pendingCheckpoint='adventure-start';}
    if(current.introHidden&&(age>=.5||current.health!==lastHealth||pendingCheckpoint)){
      const result=sync();if(result.ok&&pendingCheckpoint){ledger.checkpoint(pendingCheckpoint);pendingCheckpoint=null;}
    }
  }
  window.addEventListener('pagehide',()=>{if(!reloading)sync();});
  window.BearlyCentrumEconomy={bind,bootstrap,update,context,snapshot,sync,purchase,claimReward,collect,checkpoint,commitEat,retry,recover,afterReset,interceptReset,
    scheduleCheckpoint:reason=>{pendingCheckpoint=reason;},ready:()=>booted&&started,restoring:()=>reloading,
    audit:()=>({ready:booted&&started,reloading,context:context(),inventory:inventory()?.audit(),state:snapshot(),loops:0})};
})();
