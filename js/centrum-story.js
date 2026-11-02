/* One short delivery task, using the existing interaction loop and source civilians. */
(() => {
  'use strict';
  const quest=window.BearlyWrongEntranceQuest.game,civ=window.BearlyCentrumCivilians;
  window.BearlyQuests.wrongEntrance=quest;
  const host=document.querySelector('.canvas-wrap');
  const panel=document.createElement('section');panel.className='centrum-dialogue';panel.hidden=true;
  panel.setAttribute('role','dialog');panel.setAttribute('aria-label','The Wrong Entrance dialogue');panel.setAttribute('aria-modal','true');
  panel.innerHTML='<div class="story-title">THE WRONG ENTRANCE</div><div class="story-line" aria-live="polite"><span class="dialogue-name"></span><span class="dialogue-text"></span></div><div class="story-choices"></div><button type="button" data-dialogue-close>CLOSE · ESC</button>';
  const journal=document.createElement('div');journal.className='centrum-story-objective';journal.hidden=true;journal.setAttribute('aria-live','polite');host.append(panel,journal);
  let conversation=null,line=0,prepared=null,currentScene=null,paused=false;
  const knownScenes=new Set(window.BearlyCentrumSave?.adventure?.snapshot()?.discovered||[]);
  let reaction=null;
  function react(kind){reaction={kind,remaining:1.05};}
  function alignDialogue(){
    if(!conversation)return;
    const player=square()?.inventoryContext?.();if(!player)return;
    const box=host.getBoundingClientRect(),scale=Math.max(box.width/1160,box.height/640);
    const overflow=Math.max(0,1160*scale-box.width);
    const rawPan=Number.parseFloat(getComputedStyle(host).getPropertyValue('--square-pan')),pan=Number.isFinite(rawPan)?rawPan:50;
    const screenX=player.screenX*scale-overflow*pan/100;
    const side=screenX>=box.width*.5?'left':'right';
    const room=(side==='left'?screenX:box.width-screenX)-62*scale-26;
    panel.dataset.side=side;
    panel.style.setProperty('--story-width',Math.max(250,Math.min(440,room))+'px');
  }
  const square=()=>window.BearlyCentrumSquare,world=()=>window.BearlyCentrumSquareWorld;
  const state=()=>quest.snapshot();
  const economy=()=>window.BearlyCentrumEconomy;
  const balance=()=>window.BearlyCentrumBalance||{price:20,rewardKr:40,rewardFood:1};
  function describe(target,anchor=null){
    const availability=anchor?.npcId?civ.requestTalk(anchor.npcId):{};
    const descriptor=quest.dialogue(target,{...availability,frightened:availability.fear});
    if(target==='shopkeeper'&&anchor?.npcId&&availability.available&&!availability.fear&&economy()){
      descriptor.choices.push({id:'buy-billys',label:`Buy Billy’s · ${balance().price} kr`,action:'buy_billys'});
      const saved=economy().snapshot?.()||window.BearlyCentrumSave?.adventure?.snapshot(),claim=saved?.rewardClaims?.[window.BearlyWrongEntranceQuest.rewardEntitlementId];
      if(['reported','reward_claimed'].includes(state().state)&&(!claim?.money||!claim?.food)){
        descriptor.choices.push({id:'claim-reward',label:claim?.money?'Collect reserved Billy’s':'Redeem task reward',action:'claim_reward'});
      }
    }
    return descriptor;
  }
  function controls(){
    const a=square()?.audit();if(!a)return;for(const b of host.querySelectorAll('.square-controls button'))b.disabled=!!conversation||a.loading||a.paused||a.menuHold||a.mapOpen;
  }
  function sync(){
    const s=state();journal.hidden=!square()?.active()||!s.state||!!conversation;
    journal.replaceChildren();if(s.state){
      const title=document.createElement('span');title.className='story-objective-title';title.textContent='THE WRONG ENTRANCE';
      const objective=document.createElement('span');objective.className='story-objective-text';objective.textContent=s.objective;journal.append(title,objective);
    }
    panel.hidden=!conversation;controls();
    if(!conversation)return;alignDialogue();
    const text=conversation.descriptor.lines[line]||{speaker:'BEAR',text:'We have the correct form.'};
    panel.querySelector('.dialogue-name').textContent=text.speaker;panel.querySelector('.dialogue-text').textContent=text.text;
    const choices=panel.querySelector('.story-choices');choices.replaceChildren();
    if(line<conversation.descriptor.lines.length-1){
      const next=document.createElement('button');next.type='button';next.dataset.dialogueNext='';next.textContent='CONTINUE · E';next.disabled=paused;choices.append(next);
    }else for(const choice of conversation.descriptor.choices){
      const button=document.createElement('button');button.type='button';button.dataset.questAction=choice.action;button.dataset.questChoice=choice.id;
      if(choice.payload?.parcelId)button.dataset.parcelId=choice.payload.parcelId;
      button.textContent=choice.label;button.disabled=paused;choices.append(button);
    }
  }
  function close(){conversation=null;line=0;civ.endTalk();panel.hidden=true;controls();}
  function targets(sceneId){
    const data=window.BearlyCentrumScenes.get(sceneId);if(!data)return[];
    return data.interactions.filter(a=>a.kind==='story').map(a=>{
      if(!a.npcId)return{...a};
      const person=civ.requestTalk(a.npcId);return{...a,x:person.x,y:person.y,available:person.available};
    });
  }
  function resolve(anchor){
    const p=square()?.position();if(!anchor||!p)return null;
    const current=targets(p.sceneId).find(t=>t.id===anchor.id);
    return current&&anchor.target===current.target&&anchor.npcId===current.npcId?current:null;
  }
  function valid(anchor){
    const p=square()?.position(),a=square()?.audit();if(!p||!a.active||a.loading||a.paused||a.menuHold||a.mapOpen||a.jump>3)return false;
    const current=resolve(anchor);return !!current&&world().approach(p.sceneId,p.x,p.y,current,a.save);
  }
  function open(target,anchor=null){
    close();const availability=anchor?.npcId?civ.requestTalk(anchor.npcId):{};
    const descriptor=describe(target,anchor);
    if(anchor?.npcId&&availability.available)civ.beginTalk(anchor.npcId);
    conversation={target,anchor,descriptor};line=0;sync();panel.querySelector('button')?.focus();
  }
  function interact(anchor){if(!valid(anchor))return false;const current=resolve(anchor);open(current.target,current);return true;}
  function transactionDialogue(target,anchor,action,result){
    const b=balance();let text,baby;
    if(result?.ok&&action==='buy_billys'){
      text=`One Billy’s. ${b.price} fictional kronor. A pleasantly short transaction.`;baby='Finally, a useful receipt.';
    }else if(result?.ok&&result.money&&result.food){
      text=`${result.money} fictional kronor and ${result.food} Billy’s. Your help is now properly thanked.`;baby='Pizza. A very good rectangle.';
    }else if(result?.ok&&result.foodPending){
      text=`${result.money||0} fictional kronor recorded. Bag full: your reward Billy’s is reserved here until there is room.`;baby='A pizza entitlement. We have become very organised.';
    }else if(result?.ok){
      text='Your reserved Billy’s is yours. The money reward is already recorded.';baby='A form with a happy ending.';
    }else if(result?.reason==='bag_full'){
      text=action==='claim_reward'?'Bag full. Your reserved reward Billy’s will wait here.':'Bag full. Make room before buying a Billy’s.';baby='Three is a serious responsibility.';
    }else if(result?.reason==='funds'){
      text=`One Billy’s costs ${b.price} fictional kronor. There is not enough in the wallet yet.`;baby='The price has its own form.';
    }else if(['already_claimed','no_entitlement','duplicate'].includes(result?.reason)){
      text='That reward is already signed off. One delivery, one thank-you.';baby='We kept the useful part.';
    }else{
      text='The counter could not record that transaction. Please try again.';baby='We can wait for the form.';
    }
    close();if(anchor?.npcId&&civ.requestTalk(anchor.npcId).available)civ.beginTalk(anchor.npcId);
    conversation={target,anchor,descriptor:{lines:[{speaker:'SHOPKEEPER',text},{speaker:'BABY',text:baby}],choices:[]}};line=0;sync();panel.querySelector('button')?.focus();
  }
  function choose(id){
    if(!conversation||paused)return;
    const {anchor,descriptor,target}=conversation,choice=descriptor.choices.find(c=>c.id===id);if(!choice)return;
    if(!anchor||!valid(anchor)){close();return;}
    if(anchor.npcId&&!civ.requestTalk(anchor.npcId).available){open(target,anchor);return;}
    // Recompute choices against current persisted state; stale panels cannot award again.
    const live=describe(target,anchor).choices.find(c=>c.id===choice.id);if(!live){open(target,anchor);return;}
    if(['buy_billys','claim_reward'].includes(live.action)){
      // Exact current-scene reachability and the live civilian/choice checks above
      // apply to sales and redemption just as they do to the delivery slip.
      const result=live.action==='buy_billys'?economy()?.purchase():economy()?.claimReward();
      if(result?.ok&&(live.action==='buy_billys'||result.food))react(live.action==='buy_billys'?'billys-purchase':'billys-reward');
      quest.reload();window.BearlyCentrumLink?.onExplorationChanged?.();
      if(live.action==='claim_reward'&&result?.ok)economy()?.checkpoint('wrong-entrance-reward');
      transactionDialogue(target,anchor,live.action,result);return;
    }
    const before=state();quest.act(live.action,live.payload);const after=state();close();
    let moving=false;if(before.state!==after.state&&after.state==='delivery_confirmed')moving=civ.approveDelivery();
    if(live.action==='confirm_parcel'&&before.state===after.state){
      conversation={target,anchor,descriptor:{lines:[{speaker:'CARETAKER',text:'B-40 is garden hoses. A promising number, but the wrong rectangle.'},{speaker:'BABY',text:'We still need the pizza one.'}],choices:[]}};line=0;sync();
    }else if(after.state==='delivery_confirmed'&&!after.cargoMoved){
      conversation={target:'approval',anchor:null,descriptor:{lines:moving?
        [{speaker:'CARETAKER',text:'B-04 approved. I’ll wheel it to the food shop. Keep the access route clear.'},{speaker:'BABY',text:'Someone with empty arms. Excellent.'}]:
        [{speaker:'BEAR',text:'B-04 matches. We’ll wait until the caretaker is ready to move it.'},{speaker:'BABY',text:'We can do ordinary standing still.'}],choices:[]}};line=0;sync();
    }else open(target,anchor);
    window.BearlyCentrumLink?.onExplorationChanged?.();
    if(live.action==='report'&&before.state!==after.state&&after.state==='reported'){react('quest-reported');economy()?.checkpoint('wrong-entrance-reported');}
    sync();
  }
  function prepare(){
    if(!prepared)prepared=civ.prepare().then(()=>{if(state().cargoMoved)civ.settleDelivery();});return prepared;
  }
  function sceneEntered(sceneId){
    close();currentScene=sceneId;
    if(!knownScenes.has(sceneId)){knownScenes.add(sceneId);react('discovered:'+sceneId);}
    if(sceneId==='food-shop'&&state().state===null){quest.act('discover');open('discovery');}
    sync();
  }
  function update(sceneId,dt,player,options={}){
    currentScene=sceneId;const wasPaused=paused;paused=!!options.paused;if(paused!==wasPaused)sync();
    // A few authored moments use the production point expression. No dialogue
    // is queued during movement, and no body/face scale or source artwork changes.
    if(reaction&&!paused&&!conversation){reaction.remaining=Math.max(0,reaction.remaining-dt);if(!reaction.remaining)reaction=null;}
    if(conversation)alignDialogue();
    civ.update(sceneId,dt,player,{paused});
    const s=state(),motion=civ.deliveryMotion();
    if(s.state==='delivery_confirmed'&&!s.cargoMoved){
      if(motion.complete){
        quest.act('cargo_moved');
        if(conversation?.target==='approval'){conversation.descriptor={lines:[{speaker:'CARETAKER',text:'Moved and signed for. Please tell the shop.'},{speaker:'BABY',text:'We can carry that message.'}],choices:[]};line=0;}
        sync();
      }
      else if(!motion.active)civ.approveDelivery();
    }
    journal.hidden=!square()?.active()||!state().state||!!conversation;
  }
  function label(c,text,x,y){c.save();c.font='700 12px Arial';c.textAlign='center';c.fillStyle='#284635';c.fillRect(x-107,y-18,214,25);c.fillStyle='#fff1cc';c.fillText(text,x,y);c.restore();}
  function decorate(sceneId,nodes){
    const list=[...nodes],s=state();list.push(...civ.nodes(sceneId));
    if(sceneId!=='service-courtyard')return list;
    const motion=civ.deliveryMotion(),crate=list.find(n=>n.id==='service-crates');
    if(s.state==='delivery_confirmed'||s.cargoMoved){
      const at=list.findIndex(n=>n.id==='service-crates');if(at>=0)list.splice(at,1);
      if(!s.cargoMoved&&crate){const p=motion.progress;list.push({id:'story-moving-commercial-parcel',footY:575+p*20,draw:c=>{c.save();c.translate(p*200,p*20);crate.draw(c);c.restore();label(c,'CARETAKER · B-04 TO FOOD SHOP',785+p*200,495+p*20);}});}
    }
    list.push({id:'story-delivery-cage',footY:575,draw:c=>{
      c.save();c.strokeStyle='#415047';c.lineWidth=3;c.strokeRect(720,466,130,110);
      if(!s.cargoMoved&&s.state!=='delivery_confirmed')for(let x=735;x<850;x+=19){c.beginPath();c.moveTo(x,466);c.lineTo(x,575);c.stroke();}
      // Source crates are finished artwork; a matching delivery-cage asset is
      // absent, so the functional bar overlay remains explicitly provisional.
      c.fillStyle='#284635e6';c.fillRect(722,558,126,16);c.fillStyle='#fff1cc';c.font='9px Arial';c.textAlign='center';c.fillText('DEV · DELIVERY CAGE',785,569);
      c.restore();label(c,s.cargoMoved?'B-04 · RELEASED TO FOOD SHOP':'B-04 · FOOD SHOP · DOOR 7',785,454);
      if(s.cargoMoved)label(c,'CARETAKER: MOVED AND SIGNED FOR',785,545);
    }});
    return list;
  }
  function handleKey(e){
    if(!conversation)return false;
    if(e.code==='KeyP'||e.code==='F3'||e.code==='KeyF')return false;
    if(e.code==='KeyM'){close();return false;}
    e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return true;
    if(e.code==='Escape'||e.code==='KeyQ'){close();return true;}
    const button=e.target?.closest?.('.centrum-dialogue button');
    if(button&&['Enter','Space'].includes(e.code)){if(!button.disabled)button.click();return true;}
    if(e.code==='Tab'){
      const buttons=[...panel.querySelectorAll('button:not(:disabled)')],i=buttons.indexOf(document.activeElement);
      buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus();return true;
    }
    if(!paused&&['KeyE','Enter','Space'].includes(e.code)&&line<conversation.descriptor.lines.length-1){line++;sync();}
    return true;
  }
  panel.addEventListener('click',e=>{
    if(e.target.closest('[data-dialogue-close]'))close();
    else if(e.target.closest('[data-dialogue-next]')&&conversation&&!paused){line++;sync();}
    else{const choice=e.target.closest('[data-quest-choice]');if(choice)choose(choice.dataset.questChoice);}
  });
  window.BearlyCentrumStory={prepare,sceneEntered,interactions:targets,interact,update,decorate,close,blocking:()=>!!conversation,babySpeaking:()=>!!conversation&&conversation.descriptor.lines[line]?.speaker==='BABY',babyReacting:()=>!!reaction&&!conversation&&!paused,handleKey,sync,
    audit:()=>({quest:state(),dialogue:{open:!!conversation,target:conversation?.target||null,line,descriptor:conversation?.descriptor||null},npc:civ.audit(),cargoMotion:civ.deliveryMotion(),sceneId:currentScene,reaction:reaction?{...reaction}:null})};
})();
