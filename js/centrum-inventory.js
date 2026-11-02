/* Small bag UI and an interruptible action. The adventure ledger owns all value changes. */
(() => {
  'use strict';
  const defaults={capacity:3,heal:20,maxHealth:100,hearts:5,eatSeconds:1.2};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const number=(n,fallback=0)=>typeof n==='number'&&Number.isFinite(n)?n:fallback;
  function createActionController(adapter,balance={}){
    const config={...defaults,...balance};let action=null,sequence=0,lastOutcome=null;
    const sessionId=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);
    function context(){
      const current=adapter.context?.()||{},saved=adapter.snapshot?.()||{};
      return {...current,food:number(saved.inventory?.billys??saved.food??current.food??current.inventory?.billys),
        wallet:number(saved.wallet?.kr??(typeof saved.wallet==='number'?saved.wallet:undefined)??current.wallet?.kr),health:number(current.health??saved.session?.health,-1)};
    }
    function reason(current){
      if(current.active===false)return 'Start the ride to use the bag.';
      if(current.health<=0)return 'Retry or rest at a safe checkpoint first.';
      if(current.transition)return 'Finish changing areas first.';
      if(current.dialogue||current.blocking||current.menuHold||current.mapOpen)return 'Finish the current interaction first.';
      if(current.paused)return 'Resume before eating.';
      if(current.danger||current.combat)return 'Wait until the danger has passed.';
      if(Math.abs(number(current.speed))>=1||number(current.jump)>1||current.grounded===false)return 'Stop on the ground before eating.';
      if(current.health>=config.maxHealth)return 'Full health — food kept.';
      if(current.food<1)return 'Your bag is empty.';
      return '';
    }
    function cancel(message='Eating interrupted — food kept.'){
      if(!action)return false;
      lastOutcome={status:'cancelled',id:action.id,reason:message};action=null;return true;
    }
    function begin(){
      if(action)return {ok:false,reason:'Already eating.'};
      const c=context(),blocked=reason(c);if(blocked){lastOutcome={status:'blocked',reason:blocked};return{ok:false,reason:blocked};}
      const p=c.position;
      action={id:'eat:'+sessionId+':'+(++sequence),elapsed:0,duration:config.eatSeconds,expectedHealth:c.health,food:c.food,mode:c.mode,sceneId:c.sceneId,
        position:p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?{x:p.x,y:p.y}:null,status:'eating'};
      lastOutcome={status:'started',id:action.id};return{ok:true,id:action.id};
    }
    function update(dt){
      if(!action||action.status!=='eating')return lastOutcome;
      const c=context(),blocked=reason(c);
      if(blocked||c.mode!==action.mode||c.sceneId!==action.sceneId||c.health!==action.expectedHealth||c.food!==action.food||
        action.position&&c.position&&Math.hypot(c.position.x-action.position.x,c.position.y-action.position.y)>1){
        cancel('Eating interrupted — food kept.');return lastOutcome;
      }
      action.elapsed+=clamp(number(dt),0,.1);if(action.elapsed+1e-9<action.duration)return lastOutcome;
      // Commit once, after a final live check, through the atomic adventure transaction.
      const completing=action;completing.status='committing';let result;
      try{result=adapter.commitEat?.(completing.id,completing.expectedHealth);}catch(_){result={ok:false,reason:'Could not save. Food kept.'};}
      action=null;
      lastOutcome=result?.ok?{status:'completed',id:completing.id,healed:result.healed??Math.min(config.heal,config.maxHealth-completing.expectedHealth)}:
        {status:'cancelled',id:completing.id,reason:result?.reason||'Could not finish eating. Food kept.'};
      return lastOutcome;
    }
    return {context,reason,begin,update,cancel,audit:()=>({eating:action?{...action,position:action.position?{...action.position}:null}:null,lastOutcome:lastOutcome?{...lastOutcome}:null})};
  }
  // The controller can be exercised without a DOM; it never writes storage itself.
  if(typeof document==='undefined'){window.BearlyCentrumInventory={createActionController};return;}
  const host=document.querySelector('.canvas-wrap');if(!host)return;
  const hud=document.createElement('div');hud.className='centrum-inventory-hud';hud.hidden=true;
  hud.innerHTML='<div class="inventory-hearts" aria-label="Health"></div><button id="inventoryOpenBtn" type="button" aria-haspopup="dialog" aria-expanded="false"><img src="assets/v142_pizza_wrapper.webp" alt=""/><span class="inventory-count">BAG 0 / 3</span><kbd>I</kbd></button><span class="inventory-wallet" aria-label="Fictional kronor">0 kr</span>';
  const panel=document.createElement('section');panel.className='centrum-inventory-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Billy’s bag');
  panel.innerHTML='<div class="inventory-heading"><strong>BAG</strong><button id="inventoryCloseBtn" type="button" aria-label="Close inventory">✕</button></div><div class="inventory-selected"><img src="assets/v142_pizza_wrapper.webp" alt="Billy’s Original pizza"/><div><strong>BILLY’S</strong><span class="inventory-effect">Restores 1 heart · maximum 5 hearts</span><small class="inventory-selected-count">0 / 3 carried</small></div></div><button id="inventoryEatBtn" type="button">EAT</button><p class="inventory-reason" aria-live="polite"></p><div class="inventory-safe-actions"><button id="inventoryRecoveryBtn" type="button">ABANDON ENCOUNTER &amp; REST</button><small>Resets encounters. No takeaway food.</small><button id="inventoryRetryBtn" class="inventory-retry" type="button">RETRY CHECKPOINT</button></div>';
  const eating=document.createElement('div');eating.className='inventory-eating';eating.hidden=true;eating.setAttribute('role','status');
  eating.innerHTML='<img src="assets/v142_pizza_wrapper.webp" alt=""/><div><span>EATING · STAY STILL</span><div class="inventory-eating-track"><i></i></div></div><button id="inventoryCancelEatBtn" type="button" aria-label="Cancel eating">✕</button>';
  const feedback=document.createElement('p');feedback.className='inventory-feedback';feedback.hidden=true;feedback.setAttribute('aria-live','polite');
  host.append(hud,panel,eating,feedback);
  const heartRow=hud.querySelector('.inventory-hearts');for(let i=0;i<5;i++){const h=document.createElement('span');h.className='foot-heart';h.innerHTML='<i></i>';heartRow.append(h);}
  let adapter=null,controller=null,browsing=false,recovering=false,returnFocus=null,browseMode=null,browseScene=null,noticeTime=0,shownOutcome=null;
  const config=()=>({...defaults,...(window.BearlyCentrumBalance||{})});
  function read(){return controller?.context()||{active:false,health:0,food:0,wallet:0};}
  function notify(message,seconds=3){feedback.textContent=message;feedback.hidden=false;noticeTime=seconds;}
  function align(c){
    let sx=number(c.screenX,371);
    if(c.screenX==null&&window.BearlyCentrumSquare?.active()){const a=window.BearlyCentrumSquare.audit();sx=a.x-a.camera.x;}
    const side=sx>580?'left':'right';panel.dataset.side=side;eating.dataset.side=side;
  }
  function paint(){
    const c=read(),b=config(),state=controller?.audit();hud.hidden=!adapter||c.active===false;panel.hidden=!browsing;eating.hidden=!state?.eating;
    hud.querySelector('.inventory-count').textContent=`BAG ${c.food} / ${b.capacity}`;hud.querySelector('.inventory-wallet').textContent=`${c.wallet} kr`;
    heartRow.setAttribute('aria-label',`Health ${Math.max(0,c.health)} out of ${b.maxHealth}`);
    [...heartRow.children].forEach((h,i)=>{h.firstElementChild.style.width=`${clamp((c.health-i*b.maxHealth/b.hearts)/(b.maxHealth/b.hearts),0,1)*100}%`;});
    const blocked=controller?.reason(c)||'';
    panel.querySelector('.inventory-effect').textContent=`Restores 1 heart (+${b.heal}) · maximum ${b.hearts} hearts`;
    panel.querySelector('.inventory-selected-count').textContent=`${c.food} / ${b.capacity} carried`;
    panel.querySelector('#inventoryEatBtn').disabled=!!blocked||!!state?.eating||recovering;
    panel.querySelector('.inventory-reason').textContent=blocked||'Stop and stay clear of danger until eating finishes.';
    panel.querySelector('#inventoryRecoveryBtn').disabled=!c.recoveryAllowed||recovering;
    panel.querySelector('#inventoryRecoveryBtn').hidden=!c.recoveryAllowed;
    panel.querySelector('.inventory-safe-actions small').hidden=!c.recoveryAllowed;
    panel.querySelector('#inventoryRetryBtn').disabled=recovering||c.retryAllowed===false;
    const action=state?.eating;eating.querySelector('i').style.width=`${action?clamp(action.elapsed/action.duration,0,1)*100:0}%`;
    hud.querySelector('#inventoryOpenBtn').setAttribute('aria-expanded',String(browsing));align(c);
  }
  function close(restoreFocus=true){
    if(!browsing)return;browsing=false;adapter?.setBrowsing?.(false);panel.hidden=true;
    if(restoreFocus&&returnFocus?.isConnected)returnFocus.focus();paint();
  }
  function open(){
    if(!adapter)return false;const c=read();
    if(c.active===false||c.transition||c.dialogue||c.blocking||c.menuHold||c.mapOpen){notify('Finish the current interaction before opening the bag.');return false;}
    if(controller.cancel())notify('Eating cancelled — food kept.');
    returnFocus=document.activeElement;adapter.stopInput?.();browsing=true;browseMode=c.mode;browseScene=c.sceneId;adapter.setBrowsing?.(true);paint();panel.querySelector('#inventoryCloseBtn').focus();return true;
  }
  function cancel(message='Eating interrupted — food kept.'){
    const cancelled=controller?.cancel(message)||false;if(cancelled)notify(message);paint();return cancelled;
  }
  function begin(){
    if(!adapter||controller.audit().eating||recovering)return;
    close(false);adapter.stopInput?.();const result=controller.begin();if(!result.ok)notify(result.reason);else feedback.hidden=true;paint();
  }
  async function safeAction(name){
    if(!adapter||recovering)return;const c=read();if(name==='recover'&&!c.recoveryAllowed)return;
    recovering=true;close(false);cancel();adapter.stopInput?.();paint();
    try{const result=await adapter[name]?.();if(result?.ok===false)notify(result.reason||'Checkpoint unavailable.');}
    catch(_){notify('Could not restore the checkpoint.');}finally{recovering=false;paint();}
  }
  function update(dt){
    if(!controller)return;
    const c=read();if(browsing&&(c.active===false||c.mode!==browseMode||c.sceneId!==browseScene||c.transition||c.dialogue||c.blocking||c.menuHold||c.mapOpen))close(false);
    const outcome=controller.update(dt);
    if(outcome&&outcome!==shownOutcome){shownOutcome=outcome;
      if(outcome.status==='completed')notify(`Billy’s eaten · +${outcome.healed} health`);
      else if(outcome.status==='cancelled')notify(outcome.reason);
    }
    noticeTime=Math.max(0,noticeTime-number(dt));if(noticeTime<=0)feedback.hidden=true;paint();
  }
  hud.querySelector('#inventoryOpenBtn').addEventListener('click',()=>browsing?close():open());
  panel.querySelector('#inventoryCloseBtn').addEventListener('click',()=>close());panel.querySelector('#inventoryEatBtn').addEventListener('click',begin);
  panel.querySelector('#inventoryRecoveryBtn').addEventListener('click',()=>safeAction('recover'));panel.querySelector('#inventoryRetryBtn').addEventListener('click',()=>safeAction('retry'));
  eating.querySelector('#inventoryCancelEatBtn').addEventListener('click',()=>cancel('Eating cancelled — food kept.'));
  const interruptionKeys=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD','Space','KeyE','Enter','KeyM','KeyP','KeyQ','KeyG','KeyJ','KeyR','KeyC']);
  window.addEventListener('keydown',event=>{
    if(!adapter||event.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;
    if(event.code==='KeyI'){
      if(read().active===false)return;event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)browsing?close():open();return;
    }
    const ownButton=event.target?.closest?.('.centrum-inventory-panel button,.inventory-eating button');
    if(ownButton&&['Enter','Space'].includes(event.code)){
      event.preventDefault();event.stopImmediatePropagation();if(!event.repeat&&!ownButton.disabled)ownButton.click();return;
    }
    if(event.code==='Escape'&&(browsing||controller.audit().eating)){
      event.preventDefault();event.stopImmediatePropagation();if(!event.repeat){if(browsing)close();else cancel('Eating cancelled — food kept.');}return;
    }
    if(browsing&&event.code==='Tab'){
      event.preventDefault();event.stopImmediatePropagation();const buttons=[...panel.querySelectorAll('button:not(:disabled):not([hidden])')],i=buttons.indexOf(document.activeElement);
      buttons[(i+(event.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus();return;
    }
    if(interruptionKeys.has(event.code)){if(browsing)close(false);cancel();}
  },true);
  // Let the existing handlers receive the same pointer after releasing the bag hold.
  // This also cancels touch movement attempts before a deliberately held actor can move.
  window.addEventListener('pointerdown',event=>{
    if(!adapter||!event.target?.closest?.('[data-key],[data-square-dir],[data-depth],[data-direction],.square-jump,.square-interact,.area-jump,.area-grab,.area-maul,.area-action,#squareMapBtn,#squarePauseBtn,#mobilePauseBtn,#retryBtn,.square-exit,.square-settings,#debugOpenBtn,#restartBtn,#demoBtn'))return;
    if(browsing)close(false);cancel();
  },true);
  function background(){if(browsing)close(false);cancel('Eating interrupted — food kept.');}
  window.addEventListener('blur',background);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)background();});
  window.BearlyCentrumInventory={createActionController,bind(next){if(adapter)return false;adapter=next;controller=createActionController(adapter,config());paint();return true;},
    update,open,close,cancel,notify,isBrowsing:()=>browsing,isEating:()=>!!controller?.audit().eating,
    audit:()=>({bound:!!adapter,browsing,recovering,...(controller?.audit()||{eating:null,lastOutcome:null}),food:read().food,wallet:read().wallet,health:read().health,disabledReason:controller?.reason(read())||''})};
})();
