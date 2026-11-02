'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const window={};vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../js/wrong-entrance-quest.js'),'utf8'),{window});
const api=window.BearlyWrongEntranceQuest,KEY=api.key,plain=v=>JSON.parse(JSON.stringify(v));
function memory(initial){const data=new Map([['bearAutumnAdventureV7','donor'],['bq-centrum:scene-network:v1','food inventory'],['bq-centrum:adventure:v1','source quest']]);if(initial!==undefined)data.set(KEY,typeof initial==='string'?initial:JSON.stringify(initial));const calls=[];return{data,calls,getItem(k){calls.push(['get',k]);return data.get(k)||null;},setItem(k,v){calls.push(['set',k]);data.set(k,v);}};}
const store=memory(),q=api.create(store);
assert.equal(q.snapshot().state,null);assert.equal(store.calls.length,1,'one read and no automatic load write');
for(const action of ['report','confirm_parcel','present_slip','receive_slip'])assert.equal(q.act(action,{parcelId:'B-04'}).state,null);
assert.equal(q.act('discover').state,'discovered');
assert.equal(q.dialogue('shopkeeper').choices[0].action,'receive_slip');
assert.equal(q.claimReward(),false);
let after=q.act('receive_slip');assert.equal(after.state,'slip_received');assert.equal(after.slip.format,'A5');assert.equal(after.slip.kind,'quest-document');
assert.equal(q.act('confirm_parcel',{parcelId:'B-04'}).state,'slip_received');
assert.equal(q.act('present_slip').slipPresented,false);
q.act('inspect_cage');assert.equal(q.snapshot().cageInspected,true);assert.equal(q.dialogue('caretaker').choices[0].action,'present_slip');
q.act('present_slip');assert.equal(q.dialogue('caretaker').choices.length,0);assert.equal(q.dialogue('cage').choices[0].action,'confirm_parcel');
assert.equal(q.act('confirm_parcel',{parcelId:'B-40'}).cargoMoved,false);
after=q.act('confirm_parcel',{parcelId:'B-04'});assert.equal(after.state,'delivery_confirmed');assert.equal(after.cargoMoved,false);
assert.equal(after.entitlement,null,'delivery itself is not a reward');assert.equal(after.parcel.edible,false);assert.equal(after.parcel.carriedByPlayer,false);
assert.equal(q.dialogue('shopkeeper').choices.length,0,'wait for visible cargo movement before reporting');
assert.equal(q.act('report').state,'delivery_confirmed','approval cannot report before caretaker movement acknowledgement');
const storedAtConfirmed=store.data.get(KEY),restored=api.create(store);assert.equal(restored.snapshot().state,'delivery_confirmed');
assert.equal(restored.snapshot().cargoMoved,false,'reload keeps approved duty pending without replaying a reward');
restored.act('cargo_moved');assert.equal(restored.snapshot().cargoMoved,true);
assert.equal(restored.dialogue('shopkeeper').choices[0].action,'report');
after=restored.act('report');assert.equal(after.state,'reported');assert.equal(after.entitlement.id,api.rewardEntitlementId);assert.equal(after.entitlement.status,'pending');
assert.equal(restored.claimReward(),false,'no inventory adapter exists in this stage');
for(let i=0;i<6;i++)for(const action of ['discover','receive_slip','inspect_cage','present_slip','confirm_parcel','report'])restored.act(action,{parcelId:'B-04'});
assert.deepEqual(plain(api.create(store).snapshot()),plain(restored.snapshot()),'revisits and reload preserve one entitlement');
assert.equal(restored.dialogue('shopkeeper').choices.length,0);assert.ok(restored.dialogue('shopkeeper').lines.some(l=>l.speaker==='BABY'));
const unchanged=plain(restored.snapshot());restored.dialogue('shopkeeper',{available:false});restored.dialogue('caretaker',{frightened:true});assert.deepEqual(plain(restored.snapshot()),unchanged,'unavailable/fear dialogue cannot mutate progress');
assert.equal(store.data.get('bearAutumnAdventureV7'),'donor');assert.equal(store.data.get('bq-centrum:scene-network:v1'),'food inventory');assert.equal(store.data.get('bq-centrum:adventure:v1'),'source quest');assert.ok(store.calls.every(([,k])=>k===KEY));
const collected=new Map(),adapter={redeemOneTimeEntitlement(e){if(!collected.has(e.id))collected.set(e.id,{entitlementId:e.id,consumer:'inventory',receiptId:'inventory:receipt:1'});return collected.get(e.id);}};
const nextStage=api.create(store,adapter);assert.equal(nextStage.claimReward(),true);assert.equal(nextStage.snapshot().state,'reward_claimed');assert.equal(nextStage.claimReward(),false);assert.equal(api.create(store,adapter).claimReward(),false);assert.equal(collected.size,1,'future adapter is idempotent by entitlement ID');
const blocked=api.create(memory(JSON.parse(storedAtConfirmed)),{redeemOneTimeEntitlement(){throw Error('inventory unavailable');}});blocked.act('cargo_moved');blocked.act('report');assert.equal(blocked.claimReward(),false);assert.equal(blocked.snapshot().state,'reported');
const denied=api.create({getItem(){throw Error('denied');},setItem(){throw Error('denied');}});assert.equal(denied.act('discover').state,null);assert.equal(denied.act('receive_slip').state,null,'denied storage cannot advertise uncommitted progress');
const stagesStore=memory();let staged=api.create(stagesStore);
for(const [action,payload]of [['discover'],['receive_slip'],['inspect_cage'],['present_slip'],['confirm_parcel',{parcelId:'B-04'}],['cargo_moved'],['report']]){
 staged.act(action,payload);const before=plain(staged.snapshot());staged=api.create(stagesStore);assert.deepEqual(plain(staged.snapshot()),before,'leave/reload preserves every stable state and supporting fact');
}
for(const bad of ['{broken',JSON.stringify({schemaVersion:999,state:'reported'}),JSON.stringify({schemaVersion:1,questId:'wrong-entrance',state:'reported',cageInspected:true,slipPresented:true,cargoMoved:true,entitlement:{id:'forged',questId:'wrong-entrance',status:'pending'}})]){
 const parsed=api.create(memory(bad));assert.equal(parsed.snapshot().entitlement,null,'corrupt save does not create a reward');assert.notEqual(parsed.snapshot().state,'reported');assert.equal(parsed.claimReward(),false);
}
console.log('PASS: Wrong Entrance ordered states, slip/label/parcel prerequisites, persistent one-time entitlement, future-only idempotent redemption, corruption/unavailability and no food/health/source-save writes.');
