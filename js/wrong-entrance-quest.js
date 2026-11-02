/* One small story task. Paper and commercial cargo never become edible inventory. */
(() => {
  'use strict';
  const KEY='bq-centrum:quest:wrong-entrance:v1',ID='wrong-entrance',SCHEMA=1;
  const STATES=['discovered','slip_received','delivery_confirmed','reported','reward_claimed'];
  const ENTITLEMENT='wrong-entrance:completion:v1',PARCEL='B-04';
  const clone=value=>value==null?null:JSON.parse(JSON.stringify(value));
  const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const receiptOK=r=>object(r)&&r.entitlementId===ENTITLEMENT&&r.consumer==='inventory'&&typeof r.receiptId==='string'&&/^[A-Za-z0-9:_.-]{1,120}$/.test(r.receiptId);
  const parcel={id:PARCEL,label:'B-04 · FOOD SHOP · DOOR 7',kind:'quest-cargo',edible:false,carriedByPlayer:false};
  const slip={id:'wrong-entrance-delivery-slip',parcelId:PARCEL,format:'A5',text:'Door 7. Parcel B-04. Signature within rectangle.',kind:'quest-document'};
  const entitlement=status=>({id:ENTITLEMENT,questId:ID,status});

  function create(storage,inventoryAdapter=null){
    let saved={};try{const raw=JSON.parse(storage?.getItem(KEY)||'null');if(object(raw)&&raw.schemaVersion===SCHEMA&&raw.questId===ID)saved=raw;}catch(_){}
    const state={schemaVersion:SCHEMA,questId:ID,state:STATES.includes(saved.state)?saved.state:null,
      cageInspected:saved.cageInspected===true,slipPresented:saved.slipPresented===true,cargoMoved:saved.cargoMoved===true,
      entitlement:null,rewardReceipt:null};
    // Parse a coherent prefix only. Loading never invents completion/rewards.
    if(state.state===null){state.cageInspected=false;state.slipPresented=false;state.cargoMoved=false;}
    if(state.state==='discovered'){state.slipPresented=false;state.cargoMoved=false;}
    if(state.state==='slip_received'){state.slipPresented=state.slipPresented&&state.cageInspected;state.cargoMoved=false;}
    if(['delivery_confirmed','reported','reward_claimed'].includes(state.state)&&!(state.cageInspected&&state.slipPresented)){
      state.state='slip_received';state.slipPresented=state.slipPresented&&state.cageInspected;state.cargoMoved=false;
    }
    if(['reported','reward_claimed'].includes(state.state)&&!state.cargoMoved)state.state='delivery_confirmed';
    if(['reported','reward_claimed'].includes(state.state)){
      const e=saved.entitlement,expected=state.state==='reported'?'pending':'claimed';
      if(object(e)&&e.id===ENTITLEMENT&&e.questId===ID&&e.status===expected&&(expected==='pending'||receiptOK(saved.rewardReceipt))){
        state.entitlement=entitlement(expected);if(expected==='claimed')state.rewardReceipt=clone(saved.rewardReceipt);
      }else state.state='delivery_confirmed';
    }
    let committed=clone(state);
    function objective(){
      if(state.state===null)return 'Visit Billy’s Food Shop with the baby.';
      if(state.state==='discovered')return 'Ask the shopkeeper about the delivery.';
      if(state.state==='slip_received')return !state.cageInspected?'Courtyard: inspect the B-04 delivery cage.':!state.slipPresented?'Show the slip to the courtyard caretaker.':'Confirm parcel B-04 at the delivery cage.';
      if(state.state==='delivery_confirmed')return state.cargoMoved?'Report the delivery at the food-shop counter.':'Let the caretaker move B-04, then report back.';
      if(state.state==='reported')return 'Redeem at the counter. Reserved Billy’s waits for bag space.';
      return 'Delivery complete. The one-time reward is redeemed.';
    }
    function snapshot(){return {...clone(state),objective:objective(),slip:state.state&&state.state!=='discovered'?clone(slip):null,parcel:clone(parcel)};}
    function reload(){
      // The inventory transaction can claim money and food in the same ledger
      // commit. Re-read through this parser rather than retaining an older quest cache.
      const latest=create(storage,inventoryAdapter).snapshot();
      for(const key of Object.keys(state))state[key]=clone(latest[key]);
      committed=clone(state);
      return snapshot();
    }
    function save(){
      try{
        if(typeof storage?.setItem!=='function')throw Error('Adventure storage unavailable');
        storage.setItem(KEY,JSON.stringify(state));committed=clone(state);
      }catch(_){
        // The ledger rejected the transaction. Present only committed progress,
        // including when storage reads are now denied as well as writes.
        try{
          if(typeof storage?.getItem!=='function')throw Error('Adventure storage unavailable');
          storage.getItem(KEY);reload();
        }catch(_){for(const key of Object.keys(state))state[key]=clone(committed[key]);}
      }
      return snapshot();
    }
    function act(action,payload={}){
      let changed=false;
      if(action==='discover'&&state.state===null){state.state='discovered';changed=true;}
      else if(['receive_slip','talk_shopkeeper'].includes(action)&&state.state==='discovered'){state.state='slip_received';changed=true;}
      else if(action==='inspect_cage'&&['discovered','slip_received'].includes(state.state)&&!state.cageInspected){state.cageInspected=true;changed=true;}
      else if(action==='present_slip'&&state.state==='slip_received'&&state.cageInspected&&!state.slipPresented){state.slipPresented=true;changed=true;}
      else if(action==='confirm_parcel'&&state.state==='slip_received'&&state.cageInspected&&state.slipPresented&&payload?.parcelId===PARCEL){state.state='delivery_confirmed';changed=true;}
      else if(action==='cargo_moved'&&state.state==='delivery_confirmed'&&!state.cargoMoved){state.cargoMoved=true;changed=true;}
      else if(action==='report'&&state.state==='delivery_confirmed'&&state.cargoMoved){state.state='reported';state.entitlement=entitlement('pending');changed=true;}
      return changed?save():snapshot();
    }
    function claimReward(){
      // Retain the small legacy adapter contract for isolated quest consumers.
      // Runtime redemption belongs to the atomic adventure inventory ledger.
      if(state.state!=='reported'||state.entitlement?.status!=='pending'||typeof inventoryAdapter?.redeemOneTimeEntitlement!=='function')return false;
      let receipt;try{receipt=inventoryAdapter.redeemOneTimeEntitlement(clone(state.entitlement));}catch(_){return false;}
      if(!receiptOK(receipt))return false;
      state.state='reward_claimed';state.entitlement=entitlement('claimed');state.rewardReceipt=clone(receipt);return save().state==='reward_claimed';
    }
    const line=(speaker,text)=>({speaker,text}),choice=(id,label,action,payload)=>({id,label,action,...(payload?{payload}:{})});
    function dialogue(target,availability={}){
      const label=target==='caretaker'?'CARETAKER':target==='shopkeeper'?'SHOPKEEPER':'BEAR';
      let lines=[],choices=[];
      if(availability.available===false||availability.frightened===true){
        lines=[line(label,availability.frightened?'Just a moment. Let things settle.':'Back in a moment. The paperwork can wait.'),line('BABY','We can be quiet.'),line('BEAR','The form will keep.')];
      }else if(target==='discovery'){
        lines=[line('BABY','Billy’s. We came to the right place.'),line('BEAR','At last, an achievable errand.')];
      }else if(target==='shopkeeper'){
        if(state.state===null)lines=[line('BABY','Billy’s!'),line('SHOPKEEPER','A useful starting point.')];
        else if(state.state==='discovered'){
          lines=[line('SHOPKEEPER','Our latest delivery went to the wrong entrance.'),line('BABY','The pizza has another entrance?'),line('SHOPKEEPER','Take this ordinary slip. Door 7. Parcel B-04. Signature within rectangle.')];
          choices=[choice('receive-slip','Accept the A5 delivery slip','receive_slip')];
        }else if(state.state==='slip_received')lines=[line('SHOPKEEPER','Through the arcade’s side passage. Ask the caretaker in the Service Courtyard.'),line('BABY','Does the pizza need the slip too?'),line('BEAR','We’ll ask the appropriate department.')];
        else if(state.state==='delivery_confirmed'&&!state.cargoMoved)lines=[line('SHOPKEEPER','The caretaker has approved it. Let them finish moving the parcel.'),line('BABY','A short queue. Very autumnal.')];
        else if(state.state==='delivery_confirmed'){
          lines=[line('SHOPKEEPER','B-04 is on its way through the proper improper entrance?'),line('BEAR','The caretaker is moving it. We kept the baby.'),line('BABY','A successful division of labour.')];
          choices=[choice('report-delivery','Report the confirmed delivery','report')];
        }else if(state.state==='reported')lines=[line('SHOPKEEPER',`Your help is recorded. ${window.BearlyCentrumBalance?.rewardKr??40} fictional kronor and one Billy’s, to redeem here at the counter. If the bag is full, the pizza can wait.`),line('BABY','We came here for pizza.'),line('BEAR','And we’ve learned a lot about municipal access routes.')];
        else lines=[line('SHOPKEEPER','All signed off. One reward, one rectangle.'),line('BABY','Finally, a useful form.')];
      }else if(target==='cage'){
        if(state.cargoMoved)lines=[line('BEAR','B-04 has been signed out and moved to the food shop.'),line('BABY','Good. Your arms were already booked.')];
        else if(state.state==='delivery_confirmed')lines=[line('BEAR','B-04 is approved. The caretaker is moving it.'),line('BABY','We can supervise from our existing arrangement.')];
        else if(state.state==='slip_received'&&state.cageInspected&&state.slipPresented){
          lines=[line('BEAR','The slip says B-04. The label says B-04. Food shop, Door 7.'),line('BABY','Two signs. Please choose the one with our pizza.'),line('BEAR','Then the caretaker can move it. Our arms stay as they are.')];
          choices=[choice('confirm-b04','Confirm B-04 · Food shop','confirm_parcel',{parcelId:PARCEL}),choice('confirm-b40','B-40 · Garden hoses','confirm_parcel',{parcelId:'B-40'})];
        }
        else{
          lines=[line('BEAR','Delivery cage: B-04. Food shop. Door 7.'),line('BABY','That sounds like our pizza.'),line('BEAR','It sounds like a very small address.')];
          if(state.state&& !state.cageInspected)choices=[choice('inspect-label','Inspect the delivery label','inspect_cage')];
        }
      }else if(target==='caretaker'){
        if(state.cargoMoved)lines=[line('CARETAKER','B-04 is at the food shop. Moved, signed for, and safely off this form.'),line('BABY','Thank you. We’re already carrying the important passenger.')];
        else if(state.state==='delivery_confirmed')lines=[line('CARETAKER','Approved. I’ll wheel B-04 to the food shop now. Please keep the access route clear.'),line('BABY','We can do ordinary standing still.'),line('BEAR','Our strongest qualification.')];
        else if(state.state!=='slip_received')lines=[line('CARETAKER','Food-shop delivery? You’ll need their slip.'),line('BABY','Even for a box that already has a label?'),line('CARETAKER','Especially then.')];
        else if(!state.cageInspected)lines=[line('CARETAKER','Which parcel? Check the cage label first, please.'),line('BABY','The labelled one?'),line('BEAR','We should probably read it.')];
        else if(!state.slipPresented){
          lines=[line('CARETAKER','Delivery slip?'),line('BEAR','A5. Door 7. Signature contained within rectangle.'),line('BABY','We have become adults.')];
          choices=[choice('present-slip','Present the delivery slip','present_slip')];
        }else{
          lines=[line('CARETAKER','Slip checked. Confirm B-04 at the cage, then I’ll wheel it over.'),line('BABY','Someone with empty arms. Excellent.'),line('BEAR','Wrong entrance, correct division of labour.')];
        }
      }
      return {id:`${ID}:${target}:${state.state||'unknown'}:${state.cageInspected?1:0}:${state.slipPresented?1:0}`,questId:ID,title:'The Wrong Entrance',target,lines,choices,objective:objective()};
    }
    return{snapshot,reload,act,dialogue,claimReward};
  }
  let storage=window.BearlyCentrumSave?.storage;try{storage=storage||window.localStorage;}catch(_){}
  window.BearlyWrongEntranceQuest={create,game:create(storage),key:KEY,id:ID,states:[...STATES],parcelId:PARCEL,rewardEntitlementId:ENTITLEMENT};
})();
