/* Project-owned scene progress. Never imports, clears or migrates another game's save. */
(() => {
  'use strict';
  const KEY='bq-centrum:scene-network:v1',SCHEMA=1,LAYOUT=3;
  const IDS=['metro-square','shopping-arcade','service-courtyard','food-shop','bicycle-workshop'];
  const clone=value=>JSON.parse(JSON.stringify(value));
  const finite=value=>typeof value==='number'&&Number.isFinite(value);
  const own=(object,key)=>object&&Object.prototype.hasOwnProperty.call(object,key);
  const ledgers=new WeakMap();

  // One durable document extends this existing scene save. The compatibility
  // facade lets established quest/parking modules keep their interfaces while
  // all of their writes join the same atomic commit and checkpoint.
  function createAdventure(native){
    const balance=window.BearlyCentrumBalance||{maxHealth:100,hearts:5,capacity:3,heal:20,price:20,rewardKr:40,rewardFood:1,eatSeconds:1.2,recoveryHealth:40};
    const QUEST='bq-centrum:quest:wrong-entrance:v1',PARK='bq-centrum:parking:v1',CIV='bq-centrum:civilians:v1',OLD='bq-centrum:adventure:v1',BEST='bq-centrum:best-score:v1';
    const COMPONENTS=[OLD,QUEST,PARK,CIV,BEST],REWARD='wrong-entrance:completion:v1';
    const PICKUPS=Array.from({length:12},(_,i)=>'route-pizza-'+i),SCHEMA_VERSION=2;
    const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
    const integer=(v,max=1e9)=>Number.isInteger(v)&&v>=0&&v<=max;
    const safeString=v=>typeof v==='string'&&/^[A-Za-z0-9:_.-]{1,120}$/.test(v);
    const position=p=>object(p)&&IDS.includes(p.sceneId)&&finite(p.x)&&finite(p.y)&&[1,-1].includes(p.face)&&typeof p.entranceId==='string'&&p.entranceId.length<=80&&p.x>=0&&p.x<=1500&&p.y>=0&&p.y<=1000;
    const entry=()=>({sceneId:'metro-square',entranceId:'start',x:260,y:540,face:1});
    const jsonSafe=value=>{
      try{const text=JSON.stringify(value);if(text===undefined||text.length>120000)return false;return !/"(?:__proto__|prototype|constructor)"\s*:/.test(text);}catch(_){return false;}
    };
    function hash(value){
      const text=JSON.stringify(value);let n=2166136261;
      for(let i=0;i<text.length;i++){n^=text.charCodeAt(i);n=Math.imul(n,16777619);}
      return(n>>>0).toString(16).padStart(8,'0');
    }
    function componentOK(key,value){
      if(!COMPONENTS.includes(key)||!jsonSafe(value))return false;
      if(key===BEST)return integer(value);
      if(!object(value))return false;
      if(key===OLD)return ['started','lunch','kit','delivered','repaired','chart','voyage','garden'].every(k=>typeof value[k]==='boolean')&&['buoys','seeds'].every(k=>Array.isArray(value[k])&&value[k].length<=3&&value[k].every(n=>integer(n,2)));
      if(key===QUEST){
        if(value.schemaVersion!==1||value.questId!=='wrong-entrance'||![null,'discovered','slip_received','delivery_confirmed','reported','reward_claimed'].includes(value.state)||!['cageInspected','slipPresented','cargoMoved'].every(k=>typeof value[k]==='boolean'))return false;
        if(['delivery_confirmed','reported','reward_claimed'].includes(value.state)&&!(value.cageInspected&&value.slipPresented))return false;
        if(['reported','reward_claimed'].includes(value.state)){
          const e=value.entitlement,claimed=value.state==='reward_claimed',r=value.rewardReceipt;
          if(!value.cargoMoved||e?.id!==REWARD||e.questId!=='wrong-entrance'||e.status!==(claimed?'claimed':'pending'))return false;
          if(claimed&&(!object(r)||r.entitlementId!==REWARD||r.consumer!=='inventory'||!safeString(r.receiptId)))return false;
        }
        return true;
      }
      if(key===PARK)return value.schemaVersion===1&&['riding','dismount','exploring','remount'].includes(value.phase)&&finite(value.health)&&value.health>=0&&value.health<=balance.maxHealth&&value.routeId==='autumn-main'&&value.routeSceneId==='route:autumn-main'&&value.entryId==='centrum-stop'&&value.bikeId==='centrum-family-bike'&&object(value.parked)&&finite(value.parked.x)&&value.parked.x>=11235&&value.parked.x<=11415&&finite(value.parked.y)&&value.remount?.sceneId==='metro-square'&&value.remount?.anchorId==='bicycle-parking'&&object(value.adventure)&&object(value.routeProgress)&&(value.exploration==null||position(value.exploration));
      return value.schemaVersion===1&&object(value.actors)&&typeof value.deliveryComplete==='boolean';
    }
    function blank(){return{schemaVersion:SCHEMA_VERSION,layoutVersion:LAYOUT,revision:0,gateOpened:false,discovered:['metro-square'],position:entry(),inventory:{billys:0},wallet:{kr:0},collectedIDs:[],rewardClaims:{},components:{},session:{health:balance.maxHealth,mode:'riding',route:null,exploration:null},committedActions:[]};}
    function body(value){
      if(!object(value)||value.schemaVersion!==SCHEMA_VERSION||value.layoutVersion!==LAYOUT||!integer(value.revision)||typeof value.gateOpened!=='boolean'||!position(value.position))return false;
      if(!Array.isArray(value.discovered)||value.discovered.some(id=>!IDS.includes(id))||new Set(value.discovered).size!==value.discovered.length)return false;
      if(!object(value.inventory)||!integer(value.inventory.billys,balance.capacity)||!object(value.wallet)||!integer(value.wallet.kr,1000000))return false;
      if(!Array.isArray(value.collectedIDs)||value.collectedIDs.some(id=>!PICKUPS.includes(id))||new Set(value.collectedIDs).size!==value.collectedIDs.length)return false;
      if(!object(value.rewardClaims)||Object.keys(value.rewardClaims).some(id=>id!==REWARD))return false;
      const claim=value.rewardClaims[REWARD];if(claim&&(!object(claim)||typeof claim.money!=='boolean'||typeof claim.food!=='boolean'))return false;
      if(!object(value.components)||Object.entries(value.components).some(([key,v])=>!componentOK(key,v)))return false;
      const s=value.session;if(!object(s)||!finite(s.health)||s.health<0||s.health>balance.maxHealth||!['riding','exploring'].includes(s.mode)||(s.route!==null&&(!object(s.route)||!jsonSafe(s.route)))||(s.exploration!==null&&!position(s.exploration)))return false;
      if(!Array.isArray(value.committedActions)||value.committedActions.length>128||value.committedActions.some(id=>!safeString(id))||new Set(value.committedActions).size!==value.committedActions.length)return false;
      return true;
    }
    function withoutCheckpoint(value){const result=clone(value);delete result.checkpoint;delete result.checksum;return result;}
    function checkedPayload(cp){return object(cp)&&typeof cp.reason==='string'&&object(cp.payload)&&body(cp.payload)&&cp.checksum===hash(cp.payload);}
    function seal(value,checkpoint){const result=clone(value);result.checkpoint=checkpoint;result.checksum=hash(result);return result;}
    function checkpointFor(value,reason){const payload=withoutCheckpoint(value);return{reason:String(reason).slice(0,100),payload,checksum:hash(payload)};}
    let loadStatus='new',raw=null,parsed=null,state;
    try{raw=native?.getItem(KEY)??null;parsed=raw===null?null:JSON.parse(raw);}catch(_){}
    if(object(parsed)&&parsed.schemaVersion===SCHEMA_VERSION){
      const unsigned=clone(parsed);delete unsigned.checksum;
      if(body(withoutCheckpoint(parsed))&&checkedPayload(parsed.checkpoint)&&parsed.checksum===hash(unsigned)){state=parsed;loadStatus='latest';}
      else if(checkedPayload(parsed.checkpoint)){state=seal(parsed.checkpoint.payload,clone(parsed.checkpoint));loadStatus='checkpoint_recovery';}
    }else if(raw===null||object(parsed)&&parsed.schemaVersion===1){
      state=blank();loadStatus=raw===null?'new':'upgraded';
      if(object(parsed)){
        state.gateOpened=parsed.gateOpened===true;
        state.discovered=Array.isArray(parsed.discovered)?[...new Set(['metro-square',...parsed.discovered.filter(id=>IDS.includes(id))])]:['metro-square'];
        if(position(parsed.position))state.position=clone(parsed.position);
        if(integer(parsed.inventory?.billys))state.inventory.billys=Math.min(balance.capacity,parsed.inventory.billys);
      }
      // Import only this project's known old keys once. Never read or clear donors.
      for(const key of COMPONENTS){try{const text=native?.getItem(key);if(text!=null){const value=JSON.parse(text);if(componentOK(key,value))state.components[key]=value;}}catch(_){} }
      const parking=state.components[PARK];
      if(parking){state.session.health=parking.health;if(parking.phase!=='riding'){state.session.mode='exploring';state.session.exploration=clone(parking.exploration);}}
      const collected=parking?.routeProgress?.collectedPickups;
      if(Array.isArray(collected))state.collectedIDs=[...new Set(collected.filter(id=>PICKUPS.includes(id)))];
      if(state.components[QUEST]?.state==='reward_claimed')state.rewardClaims[REWARD]={money:true,food:true};
      state=seal(state,checkpointFor(state,'adventure-start'));
    }
    if(!state){const fresh=blank();state=seal(fresh,checkpointFor(fresh,'safe-empty-recovery'));loadStatus='invalid_save_recovery';}
    let error=null;
    function snapshot(){return{...clone(state),loadStatus,error};}
    function result(ok,reason,extra={}){return{ok,reason,state:snapshot(),...extra};}
    function commit(change,checkpointReason=null){
      const next=withoutCheckpoint(state),out=change(next)||{};
      if(out.reason)return result(false,out.reason,out);
      next.revision=state.revision+1;
      if(!body(next))return result(false,'invalid_state');
      const cp=checkpointReason?checkpointFor(next,checkpointReason):clone(state.checkpoint);
      const document=seal(next,cp);
      try{if(!native?.setItem)throw Error('Storage unavailable');native.setItem(KEY,JSON.stringify(document));}
      catch(e){error='save_unavailable';return result(false,'save_unavailable');}
      state=document;error=null;return result(true,null,out);
    }
    function remember(d,id){if(!safeString(id))return false;if(d.committedActions.includes(id))return false;d.committedActions.push(id);if(d.committedActions.length>128)d.committedActions.shift();return true;}
    function setHealth(d,hp){
      d.session.health=hp;
      if(object(d.session.route))d.session.route.health=hp;
      if(object(d.components[PARK]))d.components[PARK].health=hp;
    }
    function protectQuest(d){
      const claim=d.rewardClaims[REWARD],q=d.components[QUEST];
      if(q&&claim?.money&&claim?.food){q.state='reward_claimed';q.entitlement={id:REWARD,questId:'wrong-entrance',status:'claimed'};q.rewardReceipt={entitlementId:REWARD,consumer:'inventory',receiptId:'inventory:'+REWARD};}
    }
    const storage={
      getItem(key){
        if(key===KEY){const d=state;return JSON.stringify({schemaVersion:1,layoutVersion:LAYOUT,gateOpened:d.gateOpened,discovered:d.discovered,position:d.position,inventory:d.inventory,wallet:d.wallet});}
        if(!COMPONENTS.includes(key))throw Error('Unknown adventure save key');
        return own(state.components,key)?JSON.stringify(state.components[key]):null;
      },
      setItem(key,text){
        let value;try{value=JSON.parse(String(text));}catch(_){throw Error('Invalid save JSON');}
        if(key===KEY){
          const reason=!state.gateOpened&&value?.gateOpened===true?'shortcut-opened':null;
          const saved=commit(d=>{
            if(!object(value))return{reason:'invalid_state'};
            d.gateOpened=d.gateOpened||value.gateOpened===true;
            d.discovered=Array.isArray(value.discovered)?[...new Set([...d.discovered,...value.discovered.filter(id=>IDS.includes(id))])]:d.discovered;
            if(position(value.position))d.position=clone(value.position);
            // Inventory and wallet are owned by atomic operations below, never a stale scene cache.
          },reason);if(!saved.ok)throw Error(saved.reason);return;
        }
        if(!COMPONENTS.includes(key)||!componentOK(key,value))throw Error('Invalid adventure component');
        const old=state.components[key],durable=key===QUEST&&['reported','reward_claimed'].includes(value.state)&&old?.state!==value.state||key===OLD&&['voyage','garden','delivered','repaired'].some(k=>value[k]&&!old?.[k]);
        const saved=commit(d=>{d.components[key]=clone(value);protectQuest(d);},durable?'quest-completion':null);if(!saved.ok)throw Error(saved.reason);
      },
    };
    ledgers.set(storage,snapshot);
    return{
      storage,snapshot,
      syncSession(partial){
        if(!object(partial))return result(false,'invalid_session');
        const current=state.session,next={...clone(current),...clone(partial)};
        if(!finite(next.health)||next.health<0||next.health>balance.maxHealth||!['riding','exploring'].includes(next.mode)||(next.route!==null&&(!object(next.route)||!jsonSafe(next.route)))||(next.exploration!==null&&!position(next.exploration)))return result(false,'invalid_session');
        if(JSON.stringify(next)===JSON.stringify(current))return result(true,null,{unchanged:true});
        return commit(d=>{d.session=next;setHealth(d,next.health);});
      },
      purchase(actionId){return commit(d=>{
        if(actionId&&d.committedActions.includes(actionId))return{reason:'duplicate'};
        if(d.inventory.billys>=balance.capacity)return{reason:'bag_full'};
        if(d.wallet.kr<balance.price)return{reason:'funds'};
        if(actionId&&!remember(d,actionId))return{reason:'invalid_action'};
        d.wallet.kr-=balance.price;d.inventory.billys++;return{spent:balance.price};
      });},
      collect(id){return commit(d=>{
        if(!PICKUPS.includes(id))return{reason:'invalid_pickup'};
        if(d.collectedIDs.includes(id))return{reason:'already_collected'};
        if(d.inventory.billys>=balance.capacity)return{reason:'bag_full'};
        d.collectedIDs.push(id);d.inventory.billys++;
        const p=d.components[PARK]?.routeProgress;if(p)p.collectedPickups=[...d.collectedIDs];
        if(d.session.route?.routeProgress)d.session.route.routeProgress.collectedPickups=[...d.collectedIDs];
        return{pickupId:id};
      });},
      claimWrongEntrance(){return commit(d=>{
        const q=d.components[QUEST];
        if(!q||!['reported','reward_claimed'].includes(q.state)||!q.cageInspected||!q.slipPresented||!q.cargoMoved||q.entitlement?.id!==REWARD||q.entitlement.questId!=='wrong-entrance'||!['pending','claimed'].includes(q.entitlement.status))return{reason:'no_entitlement'};
        const claim=d.rewardClaims[REWARD]||(d.rewardClaims[REWARD]={money:false,food:false});
        if(claim.money&&claim.food)return{reason:'already_claimed'};
        let money=0,food=0;
        if(!claim.money){d.wallet.kr+=balance.rewardKr;claim.money=true;money=balance.rewardKr;}
        if(!claim.food&&d.inventory.billys+balance.rewardFood<=balance.capacity){d.inventory.billys+=balance.rewardFood;claim.food=true;food=balance.rewardFood;}
        if(!money&&!food)return{reason:'bag_full'};
        protectQuest(d);return{money,food,foodPending:!claim.food,entitlementId:REWARD};
      },'quest-reward');},
      eatCommit(actionId,expectedHealth){return commit(d=>{
        if(!safeString(actionId))return{reason:'invalid_action'};
        if(d.committedActions.includes(actionId))return{reason:'duplicate'};
        if(expectedHealth!==undefined&&expectedHealth!==d.session.health)return{reason:'stale'};
        if(d.session.health>=balance.maxHealth)return{reason:'full_health'};
        if(d.session.health<=0)return{reason:'incapacitated'};
        if(d.inventory.billys<=0)return{reason:'empty'};
        remember(d,actionId);const before=d.session.health;d.inventory.billys--;setHealth(d,Math.min(balance.maxHealth,before+balance.heal));return{healed:d.session.health-before};
      });},
      checkpoint(reason='checkpoint'){return commit(()=>{},reason);},
      retry(){
        if(!checkedPayload(state.checkpoint))return result(false,'no_checkpoint');
        const checkpoint=clone(state.checkpoint),payload=clone(checkpoint.payload);payload.revision=state.revision+1;
        const document=seal(payload,checkpoint);
        try{if(!native?.setItem)throw Error('Storage unavailable');native.setItem(KEY,JSON.stringify(document));}catch(_){error='save_unavailable';return result(false,'save_unavailable');}
        state=document;error=null;return result(true,null,{retry:true});
      },
      recover(actionId){return commit(d=>{
        if(actionId&&d.committedActions.includes(actionId))return{reason:'duplicate'};
        if(d.wallet.kr!==0||d.inventory.billys!==0||d.session.health>=balance.recoveryHealth)return{reason:'not_needed'};
        if(actionId&&!remember(d,actionId))return{reason:'invalid_action'};
        const safe=state.checkpoint?.payload?.session;
        if(safe)d.session=clone(safe);
        if(d.session.mode==='exploring'&&position(d.session.exploration))d.position=clone(d.session.exploration);
        if(object(d.session.route)){
          if(d.components[OLD])d.session.route.adventure=clone(d.components[OLD]);
          if(object(d.session.route.routeProgress))d.session.route.routeProgress.collectedPickups=[...d.collectedIDs];
        }
        setHealth(d,balance.recoveryHealth);
        const civilians=d.components[CIV];if(civilians)civilians.actors={};
        return{recovered:true,resetEncounter:true};
      },'safe-recovery');},
    };
  }

  function create(storage,scenes){
    const scene=id=>IDS.includes(id)?scenes?.get?.(id):null;
    let openedGate=false;
    function validPosition(position){
      if(!position||typeof position!=='object'||!finite(position.x)||!finite(position.y)||![1,-1].includes(position.face))return false;
      const s=scene(position.sceneId),floor=s?.floor;if(!floor)return false;
      if(position.entranceId!=null&&(!own(s.anchors,position.entranceId)||typeof position.entranceId!=='string'))return false;
      const rx=s.radiusX||22,ry=s.radiusY||12;
      if(position.x-rx<floor.left||position.x+rx>floor.right||position.y-ry<floor.top||position.y+ry>floor.bottom)return false;
      return !(s.solids||[]).some(solid=>solid.collidable!==false&&!(solid.gateClosedOnly&&openedGate)&&position.x+rx>solid.x&&position.x-rx<solid.x+solid.w&&position.y+ry>solid.y&&position.y-ry<solid.y+solid.h);
    }
    function safeEntry(){
      const s=scene('metro-square');
      // Named author-owned entrance anchors, rather than a copied road coordinate.
      const names=['start',...Object.keys(s?.anchors||{}).filter(id=>id!=='start')];
      for(const entranceId of names){
        const anchor=s?.anchors?.[entranceId];
        if(anchor){const position={sceneId:'metro-square',entranceId,x:anchor.x,y:anchor.y,face:anchor.face};if(validPosition(position))return position;}
      }
      throw Error('Metro Square needs a valid named safe entrance');
    }
    let saved={};try{const value=JSON.parse(storage?.getItem(KEY)||'{}');if(value&&typeof value==='object'&&!Array.isArray(value))saved=value;}catch(_){}
    // Resolve the gate before validating position; an opened leaf is no longer
    // a solid, but its permanent posts still reject an unsafe stored position.
    openedGate=saved.gateOpened===true;
    const compatible=saved.schemaVersion===SCHEMA&&saved.layoutVersion===LAYOUT;
    const discovered=Array.isArray(saved.discovered)?[...new Set(saved.discovered.filter(id=>!!scene(id)))]:[];
    const billys=saved.inventory?.billys;
    const state={schemaVersion:SCHEMA,layoutVersion:LAYOUT,gateOpened:openedGate,
      discovered:discovered.includes('metro-square')?discovered:['metro-square',...discovered],
      position:compatible&&validPosition(saved.position)?clone(saved.position):safeEntry(),
      inventory:{billys:Number.isInteger(billys)&&billys>=0?Math.min(3,billys):0}};
    if(!state.discovered.includes(state.position.sceneId))state.discovered.push(state.position.sceneId);
    function snapshot(){
      const result=clone(state),read=ledgers.get(storage);if(read){const live=read();result.inventory=live.inventory;result.wallet=live.wallet;result.rewardClaims=live.rewardClaims;}return result;
    }
    function save(){try{storage?.setItem(KEY,JSON.stringify(state));}catch(_){}return snapshot();}
    return {
      snapshot,loadPosition:()=>clone(state.position),validPosition,
      discover(id){if(scene(id)&&!state.discovered.includes(id)){state.discovered.push(id);return save();}return snapshot();},
      openGate(){if(!state.gateOpened){openedGate=state.gateOpened=true;return save();}return snapshot();},
      setPosition(position){
        // A bad caller cannot persist an unsafe coordinate. Keep progress and
        // inventory, returning to the same named safe entrance used on load.
        state.position=validPosition(position)?clone(position):safeEntry();
        if(!state.discovered.includes(state.position.sceneId))state.discovered.push(state.position.sceneId);
        return save();
      },
      addBilly(amount=1){
        if(Number.isInteger(amount)&&amount>0){state.inventory.billys=Math.min(3,state.inventory.billys+amount);return save();}
        return snapshot();
      },
    };
  }
  let native;try{native=window.localStorage;}catch(_){}
  const runtime=createAdventure(native);
  window.BearlyCentrumSave={create,createAdventure,key:KEY,schemaVersion:SCHEMA,layoutVersion:LAYOUT,adventure:runtime,storage:runtime.storage};
})();
