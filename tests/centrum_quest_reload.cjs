'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const key='bq-centrum:quest:wrong-entrance:v1',token='wrong-entrance:completion:v1',data=new Map(),calls=[];
const facade={getItem(k){calls.push(['get',k]);return data.get(k)||null;},setItem(k,v){calls.push(['set',k]);data.set(k,v);}};
const window={BearlyCentrumSave:{storage:facade},BearlyCentrumBalance:{rewardKr:40}};
Object.defineProperty(window,'localStorage',{get(){throw Error('Runtime must use its adventure ledger facade');}});
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/wrong-entrance-quest.js'),'utf8'),{window});
const q=window.BearlyWrongEntranceQuest.game;
assert.equal(q.snapshot().state,null);assert.equal(calls.length,1);
for(const [action,payload] of [['discover'],['receive_slip'],['inspect_cage'],['present_slip'],['confirm_parcel',{parcelId:'B-04'}],['cargo_moved'],['report']])q.act(action,payload);
assert.equal(q.snapshot().state,'reported');assert.match(q.snapshot().objective,/counter/);
const claimed=JSON.parse(data.get(key));claimed.state='reward_claimed';claimed.entitlement.status='claimed';claimed.rewardReceipt={entitlementId:token,consumer:'inventory',receiptId:'inventory:'+token};
data.set(key,JSON.stringify(claimed));const before=calls.filter(c=>c[0]==='set').length;
assert.equal(q.snapshot().state,'reported','private cache is refreshed explicitly after atomic broker commits');
assert.equal(q.reload().state,'reward_claimed');assert.equal(q.snapshot().state,'reward_claimed');
assert.equal(q.claimReward(),false,'reload cannot create a second entitlement');assert.equal(calls.filter(c=>c[0]==='set').length,before,'reload only reads');
assert.ok(q.dialogue('shopkeeper').lines.some(l=>l.speaker==='BABY'));
data.set(key,JSON.stringify({...claimed,rewardReceipt:{entitlementId:'forged'}}));
assert.equal(q.reload().state,'delivery_confirmed','reload uses the same coherent-prefix normalization');assert.equal(q.snapshot().entitlement,null);
assert.ok(calls.every(([,k])=>k===key),'no donor or competing inventory keys are read');
{
  const cache=new Map(),readable={getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)},live=window.BearlyWrongEntranceQuest.create(readable);
  live.act('discover');readable.setItem=()=>{throw Error('ledger commit denied');};
  assert.equal(live.act('receive_slip').state,'discovered','failed facade commit reloads the previous committed component');
  assert.equal(live.snapshot().slip,null);
  readable.getItem=()=>{throw Error('storage now denied');};
  assert.equal(live.act('receive_slip').state,'discovered','failed reads retain the last known committed state');
}
{
  const saved=new Map([[key,JSON.stringify({...claimed,state:'reported',entitlement:{id:token,questId:'wrong-entrance',status:'pending'},rewardReceipt:null})]]);
  const failed=window.BearlyWrongEntranceQuest.create({getItem:k=>saved.get(k)||null,setItem(){throw Error('denied');}},
    {redeemOneTimeEntitlement:()=>({entitlementId:token,consumer:'inventory',receiptId:'inventory:test-receipt'})});
  assert.equal(failed.claimReward(),false,'legacy adapter cannot advertise a rejected quest receipt commit');
  assert.equal(failed.snapshot().state,'reported');assert.equal(failed.snapshot().entitlement.status,'pending');
}
console.log('centrum quest facade/reload checks passed');
