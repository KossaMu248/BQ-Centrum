/* Stage 8: adversarial graph, footprint, canonical transaction and checkpoint checks. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),window={};
for(const file of ['centrum-balance','centrum-scenes','centrum-square-world','centrum-save','centrum-parking-save','wrong-entrance-quest'])vm.runInNewContext(fs.readFileSync(path.join(root,'js',file+'.js'),'utf8'),{window});
const plain=v=>JSON.parse(JSON.stringify(v)),SC=window.BearlyCentrumScenes,W=window.BearlyCentrumSquareWorld,S=window.BearlyCentrumSave;
const KEY=S.key,Q=window.BearlyWrongEntranceQuest.key,P=window.BearlyCentrumParkingSave.key,TOKEN=window.BearlyWrongEntranceQuest.rewardEntitlementId;
const checks=[];function test(name,fn){fn();checks.push(name);}
function memory(){const data=new Map(),calls=[];return{data,calls,denied:false,getItem(k){calls.push(['get',k]);return data.get(k)??null;},setItem(k,v){calls.push(['set',k]);if(this.denied)throw Error('denied');data.set(k,String(v));}};}
function stripped(s){s=plain(s);for(const k of ['revision','checksum','checkpoint','loadStatus','error'])delete s[k];return s;}

test('every exit and named arrival is body-clear in both gate states',()=>{
 const ids=SC.all().map(s=>s.id);assert.equal(new Set(ids).size,5);
 for(const scene of SC.all())for(const exit of scene.exits){
  const to=SC.get(exit.toScene),a=to?.anchors[exit.toEntrance];assert.ok(a,scene.id+':'+exit.id);assert.ok([1,-1].includes(a.face));
  for(const gateOpened of [false,true]){
   assert.equal(W.blocked(exit.x,exit.y,22,12,scene.id,{gateOpened}),false,exit.id+' has valid source anchor');
   assert.equal(W.blocked(a.x,a.y,22,12,to.id,{gateOpened}),false,exit.id+' has valid destination entrance');
   assert.equal(W.approach(scene.id,exit.x,exit.y,exit,{gateOpened}),true);
   assert.equal(W.approach(scene.id,exit.x,exit.y+exit.radius+1,exit,{gateOpened}),false,'matching X cannot exit remotely');
  }
 }
});
test('locked shortcut never isolates a task, room or bicycle',()=>{
 for(const start of SC.all()){
  const seen=new Set([start.id]),queue=[start.id];
  while(queue.length){const id=queue.shift();for(const exit of SC.get(id).exits){if(exit.gateSide)continue;if(!seen.has(exit.toScene)){seen.add(exit.toScene);queue.push(exit.toScene);}}}
  assert.equal(seen.size,5,start.id+' still reaches all scenes without either gate traversal');
 }
 assert.deepEqual(plain(SC.get('metro-square').anchors['bicycle-parking']),{x:220,y:730,face:1});
});
test('sweeps cannot tunnel through furniture, floors or closed gate; opened posts stay solid',()=>{
 for(const s of SC.all()){
  const start=s.anchors[s.defaultEntrance];
  for(const [dx,dy]of [[10000,0],[-10000,0],[0,10000],[0,-10000],[10000,10000],[-10000,-10000]]){
   const m=W.move(start.x,start.y,dx,dy,s.id,{gateOpened:false});assert.equal(W.blocked(m.x,m.y,22,12,s.id,{gateOpened:false}),false,s.id+' large sweep');
  }
  for(const solid of s.solids){
   if(solid.collidable===false)continue;
   const cx=solid.x+solid.w/2,cy=solid.y+solid.h/2;
   assert.equal(W.blocked(cx,cy,1,1,s.id,{gateOpened:false}),true,solid.id+' footprint solid');
   if(solid.kind==='post')assert.equal(W.blocked(cx,cy,1,1,s.id,{gateOpened:true}),true,solid.id+' persists after opening');
  }
 }
 assert.equal(W.approach('metro-square',500,650,{x:500,y:520,radius:200}),false,'bench interrupts line of approach');
});
test('furniture/gate occlusion anchors follow floor footprints, not actor jumps',()=>{
 for(const scene of SC.all()){
  const nodes=W.drawables(scene.id,{gateOpened:false});
  for(const f of scene.furniture){const n=nodes.find(n=>n.id===f.id);assert.equal(n.footY,f.y+f.h,f.id);}
  const gate=nodes.find(n=>n.id==='service-gate');if(gate){const posts=scene.extraSolids.filter(s=>s.kind==='post');assert.equal(gate.footY,Math.max(...posts.map(s=>s.y+s.h)));}
 }
});
test('each stable story prefix reloads through the canonical ledger and denied progress rolls back',()=>{
 const native=memory(),b=S.createAdventure(native),q=window.BearlyWrongEntranceQuest.create(b.storage);
 const path=[['discover'],['receive_slip'],['inspect_cage'],['present_slip'],['confirm_parcel',{parcelId:'B-04'}],['cargo_moved'],['report']];
 for(const [act,payload]of path){q.act(act,payload);assert.deepEqual(plain(window.BearlyWrongEntranceQuest.create(S.createAdventure(native).storage).snapshot()),plain(q.snapshot()));}
 assert.equal(q.snapshot().state,'reported');assert.equal(q.snapshot().entitlement.id,TOKEN);
 const snap=stripped(b.snapshot());native.denied=true;assert.equal(b.claimWrongEntrance().ok,false);assert.deepEqual(stripped(b.snapshot()),snap);
 native.denied=false;b.claimWrongEntrance();q.reload();assert.equal(q.snapshot().state,'reward_claimed');
 for(let i=0;i<20;i++){q.act('report');assert.equal(b.claimWrongEntrance().reason,'already_claimed');}
 assert.equal(b.snapshot().wallet.kr,40);assert.equal(b.snapshot().inventory.billys,1);
});
test('transaction model: random purchases/pickups/eat/damage/reload/retry preserve one coherent state',()=>{
 const native=memory();let b=S.createAdventure(native),q=window.BearlyWrongEntranceQuest.create(b.storage);
 for(const [a,p]of [['discover'],['receive_slip'],['inspect_cage'],['present_slip'],['confirm_parcel',{parcelId:'B-04'}],['cargo_moved'],['report']])q.act(a,p);
 let seed=98143;const rand=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
 for(let i=0;i<500;i++){
  const before=b.snapshot(),op=rand(8),id='stage8:'+i;let result;
  if(op===0){result=b.purchase(id);if(result.ok){assert.equal(result.state.wallet.kr,before.wallet.kr-20);assert.equal(result.state.inventory.billys,before.inventory.billys+1);}}
  if(op===1){const pickup='route-pizza-'+rand(12);result=b.collect(pickup);if(result.ok){assert.ok(!before.collectedIDs.includes(pickup));assert.equal(result.state.inventory.billys,before.inventory.billys+1);assert.equal(result.state.session.health,before.session.health);}}
  if(op===2){result=b.eatCommit(id,before.session.health);if(result.ok){assert.equal(result.state.inventory.billys,before.inventory.billys-1);assert.equal(result.state.session.health,Math.min(100,before.session.health+20));assert.equal(b.eatCommit(id).reason,'duplicate');}}
  if(op===3){result=b.claimWrongEntrance();if(result.ok){assert.equal(result.state.wallet.kr,before.wallet.kr+result.money);assert.equal(result.state.inventory.billys,before.inventory.billys+result.food);}}
  if(op===4)result=b.syncSession({health:rand(101)});
  if(op===5){const prior=stripped(b.snapshot());b=S.createAdventure(native);assert.deepEqual(stripped(b.snapshot()),prior);}
  if(op===6){b.checkpoint('model:'+i);assert.deepEqual(stripped(b.snapshot()),stripped(b.snapshot().checkpoint.payload));}
  if(op===7){const checkpoint=stripped(before.checkpoint.payload);result=b.retry();assert.ok(result.ok);assert.deepEqual(stripped(result.state),checkpoint);}
  if(result&&!result.ok)assert.deepEqual(stripped(b.snapshot()),stripped(before),'failed operation cannot partially mutate values');
  const s=b.snapshot();assert.ok(Number.isInteger(s.wallet.kr)&&s.wallet.kr>=0);assert.ok(Number.isInteger(s.inventory.billys)&&s.inventory.billys>=0&&s.inventory.billys<=3);assert.ok(s.session.health>=0&&s.session.health<=100);assert.equal(new Set(s.collectedIDs).size,s.collectedIDs.length);
  assert.ok(native.calls.every(([,key])=>key.startsWith('bq-centrum:')));
 }
});
test('stale scene and quest component saves cannot erase paid rewards or resurrect food',()=>{
 const n=memory(),b=S.createAdventure(n),q=window.BearlyWrongEntranceQuest.create(b.storage);
 for(const [a,p]of [['discover'],['receive_slip'],['inspect_cage'],['present_slip'],['confirm_parcel',{parcelId:'B-04'}],['cargo_moved'],['report']])q.act(a,p);
 const oldQuest=JSON.parse(b.storage.getItem(Q)),oldNetwork=JSON.parse(b.storage.getItem(KEY));b.claimWrongEntrance();b.syncSession({health:50});b.eatCommit('stale:eat',50);
 b.storage.setItem(Q,JSON.stringify(oldQuest));b.storage.setItem(KEY,JSON.stringify({...oldNetwork,inventory:{billys:3},wallet:{kr:999}}));
 const s=S.createAdventure(n).snapshot();assert.equal(s.inventory.billys,0);assert.equal(s.wallet.kr,40);assert.equal(s.session.health,70);assert.equal(s.components[Q].state,'reward_claimed');
});
console.log('PASS: '+checks.length+' stage8 validation groups: '+checks.join('; '));
