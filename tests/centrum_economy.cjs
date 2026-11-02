'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const window={},root=path.resolve(__dirname,'..');
for(const name of ['centrum-balance.js','centrum-save.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'js',name),'utf8'),{window});
const api=window.BearlyCentrumSave,KEY=api.key,QUEST='bq-centrum:quest:wrong-entrance:v1',OLD='bq-centrum:adventure:v1',CIV='bq-centrum:civilians:v1',PARK='bq-centrum:parking:v1',REWARD='wrong-entrance:completion:v1';
const plain=v=>JSON.parse(JSON.stringify(v));
const pos={sceneId:'metro-square',entranceId:'start',x:260,y:540,face:1};
const sourceQuest={started:false,lunch:false,kit:false,delivered:false,repaired:false,chart:false,voyage:false,garden:false,buoys:[],seeds:[]};
const reported={schemaVersion:1,questId:'wrong-entrance',state:'reported',cageInspected:true,slipPresented:true,cargoMoved:true,entitlement:{id:REWARD,questId:'wrong-entrance',status:'pending'},rewardReceipt:null};
const legacy=(food=0)=>({schemaVersion:1,layoutVersion:3,gateOpened:false,discovered:['metro-square'],position:pos,inventory:{billys:food}});
function memory(seed={}){
  const data=new Map(Object.entries({'bearBestAutumn':'donor score','bearAutumnAdventureV7':'donor progress',...seed}).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)])),calls=[];
  return{data,calls,denied:false,getItem(key){calls.push(['get',key]);return data.get(key)??null;},setItem(key,value){calls.push(['set',key]);if(this.denied)throw Error('denied');data.set(key,value);}};
}
function state(b){const s=plain(b.snapshot());delete s.loadStatus;delete s.error;return s;}
let checks=0;
function check(label,fn){fn();checks++;}

check('balance and exact project namespace',()=>{
 assert.deepEqual(plain(window.BearlyCentrumBalance),{maxHealth:100,hearts:5,capacity:3,heal:20,price:20,rewardKr:40,rewardFood:1,eatSeconds:1.2,recoveryHealth:40});
 const s=memory(),b=api.createAdventure(s);b.collect('route-pizza-0');
 assert.ok(s.calls.every(([,key])=>key.startsWith('bq-centrum:')));assert.equal(s.data.get('bearBestAutumn'),'donor score');
 assert.throws(()=>b.storage.getItem('bearBestAutumn'));assert.throws(()=>b.storage.setItem('bearBestAutumn','22'));
});
check('upgrade only once and clamp the old food count',()=>{
 const s=memory({[KEY]:legacy(99),[QUEST]:reported,[OLD]:sourceQuest}),b=api.createAdventure(s);
 assert.equal(b.snapshot().inventory.billys,3);assert.equal(b.snapshot().loadStatus,'upgraded');b.checkpoint('upgrade');
 s.data.set(QUEST,JSON.stringify({...reported,state:'discovered'}));s.data.set(OLD,JSON.stringify({...sourceQuest,garden:true}));
 const loaded=api.createAdventure(s);assert.equal(JSON.parse(loaded.storage.getItem(QUEST)).state,'reported');assert.equal(JSON.parse(loaded.storage.getItem(OLD)).garden,false);
});
check('full bag leaves each stable pickup untouched; visits and reload never respawn',()=>{
 const s=memory(),b=api.createAdventure(s);
 for(let i=0;i<3;i++)assert.equal(b.collect('route-pizza-'+i).ok,true);
 const full=state(b);assert.equal(b.collect('route-pizza-3').reason,'bag_full');assert.deepEqual(state(b),full);
 assert.equal(b.collect('route-pizza-0').reason,'already_collected');assert.equal(b.collect('unknown').reason,'invalid_pickup');
 b.storage.setItem(KEY,JSON.stringify({...legacy(0),position:{...pos,x:300},discovered:['food-shop']}));
 const loaded=api.createAdventure(s);assert.equal(loaded.snapshot().inventory.billys,3);assert.deepEqual(plain(loaded.snapshot().collectedIDs),['route-pizza-0','route-pizza-1','route-pizza-2']);
});
check('quest money and pizza claim independently with stable one-time receipt',()=>{
 const s=memory({[KEY]:legacy(3),[QUEST]:reported}),b=api.createAdventure(s);
 const first=b.claimWrongEntrance();assert.equal(first.ok,true);assert.equal(first.money,40);assert.equal(first.food,0);assert.equal(first.foodPending,true);
 assert.equal(JSON.parse(b.storage.getItem(QUEST)).state,'reported');assert.equal(b.claimWrongEntrance().reason,'bag_full');
 b.syncSession({health:60});assert.equal(b.eatCommit('eat:reward-slot',60).healed,20);
 const second=b.claimWrongEntrance();assert.equal(second.money,0);assert.equal(second.food,1);assert.equal(b.snapshot().wallet.kr,40);assert.equal(b.snapshot().inventory.billys,3);
 const q=JSON.parse(b.storage.getItem(QUEST));assert.equal(q.state,'reward_claimed');assert.equal(q.entitlement.status,'claimed');assert.equal(q.rewardReceipt.consumer,'inventory');
 assert.equal(api.createAdventure(s).claimWrongEntrance().reason,'already_claimed');
 b.storage.setItem(QUEST,JSON.stringify(reported));assert.equal(JSON.parse(b.storage.getItem(QUEST)).state,'reward_claimed','a stale quest module cannot erase the receipt');
});
check('incomplete tasks and invalid entitlement cannot mint currency',()=>{
 for(const q of [{...reported,state:'slip_received'},{...reported,cargoMoved:false},{...reported,entitlement:{...reported.entitlement,id:'other'}},{...reported,entitlement:{...reported.entitlement,status:'invalid'}}]){
  const b=api.createAdventure(memory({[QUEST]:q}));assert.equal(b.claimWrongEntrance().reason,'no_entitlement');assert.equal(b.snapshot().wallet.kr,0);
 }
});
check('shop checks capacity/funds and commits both sides once',()=>{
 const b=api.createAdventure(memory({[QUEST]:reported}));assert.equal(b.purchase('buy:poor').reason,'funds');b.claimWrongEntrance();
 assert.equal(b.purchase('buy:1').ok,true);assert.equal(b.snapshot().wallet.kr,20);assert.equal(b.snapshot().inventory.billys,2);
 assert.equal(b.purchase('buy:1').reason,'duplicate');assert.equal(b.purchase('buy:2').ok,true);assert.equal(b.snapshot().wallet.kr,0);assert.equal(b.snapshot().inventory.billys,3);
 const full=state(b);assert.equal(b.purchase('buy:3').reason,'bag_full');assert.deepEqual(state(b),full);
});
check('eating conserves food at full/dead/stale health and commits once with cap',()=>{
 const b=api.createAdventure(memory({[KEY]:legacy(3)}));assert.equal(b.eatCommit('eat:full',100).reason,'full_health');assert.equal(b.snapshot().inventory.billys,3);
 b.syncSession({health:0});assert.equal(b.eatCommit('eat:dead',0).reason,'incapacitated');b.syncSession({health:91});
 assert.equal(b.eatCommit('eat:stale',90).reason,'stale');assert.equal(b.eatCommit('eat:cap',91).healed,9);assert.equal(b.snapshot().session.health,100);assert.equal(b.snapshot().inventory.billys,2);
 assert.equal(b.eatCommit('eat:cap',100).reason,'duplicate');assert.equal(b.eatCommit('bad action id',100).reason,'invalid_action');
});
check('denied commits lose neither money, food nor health',()=>{
 const s=memory({[KEY]:legacy(1),[QUEST]:reported}),b=api.createAdventure(s);b.claimWrongEntrance();b.syncSession({health:50});const before=state(b);s.denied=true;
 for(const result of [b.purchase('buy:denied'),b.eatCommit('eat:denied',50),b.collect('route-pizza-9'),b.checkpoint('denied'),b.retry()]){assert.equal(result.ok,false);assert.equal(result.reason,'save_unavailable');assert.deepEqual(state(b),before);}
 s.denied=false;assert.equal(b.eatCommit('eat:denied',50).ok,true,'failed writes never consume an action ID');
});
check('normal reload latest, retry one complete checkpoint',()=>{
 const s=memory({[QUEST]:reported,[OLD]:sourceQuest}),b=api.createAdventure(s);b.claimWrongEntrance();b.syncSession({health:63,mode:'exploring',exploration:pos,route:{health:63,adventure:sourceQuest,routeProgress:{collectedPickups:[]},x:11320,y:420}});b.checkpoint('whole-session');
 const checkpoint=plain(b.snapshot().checkpoint.payload);b.purchase('buy:checkpoint');b.collect('route-pizza-5');b.syncSession({health:23,exploration:{...pos,x:600}});b.storage.setItem(CIV,JSON.stringify({schemaVersion:1,actors:{'food-shop-host':{fear:3}},deliveryComplete:true}));
 const latest=api.createAdventure(s);assert.equal(latest.snapshot().session.health,23);assert.equal(latest.snapshot().wallet.kr,20);assert.ok(latest.snapshot().collectedIDs.includes('route-pizza-5'));
 assert.equal(latest.retry().ok,true);const restored=state(latest);delete restored.checksum;delete restored.checkpoint;delete restored.revision;delete checkpoint.revision;assert.deepEqual(restored,checkpoint,'all rewards/pickups/health/location/encounter facts restore together');
});
check('shortcut and durable quest automatically advance a complete checkpoint',()=>{
 const b=api.createAdventure(memory());b.syncSession({health:68});b.collect('route-pizza-7');b.storage.setItem(KEY,JSON.stringify({...legacy(0),gateOpened:true,discovered:['service-courtyard']}));
 assert.equal(b.snapshot().checkpoint.payload.gateOpened,true);assert.equal(b.snapshot().checkpoint.payload.inventory.billys,1);
 b.storage.setItem(KEY,JSON.stringify(legacy(0)));assert.equal(b.snapshot().gateOpened,true,'stale scene writes never relock a shortcut');assert.ok(b.snapshot().discovered.includes('service-courtyard'));
 b.storage.setItem(QUEST,JSON.stringify(reported));assert.equal(b.snapshot().checkpoint.payload.components[QUEST].state,'reported');assert.equal(b.snapshot().session.health,68);
});
check('recovery gives no supplies, preserves durable state, resets the encounter',()=>{
 const s=memory({[QUEST]:reported,[OLD]:sourceQuest}),b=api.createAdventure(s);b.claimWrongEntrance();b.syncSession({health:60,route:{health:60,adventure:sourceQuest,routeProgress:{collectedPickups:[]},x:11320,y:420},mode:'exploring',exploration:pos});b.checkpoint('safe');
 b.purchase('buy:recovery1');b.purchase('buy:recovery2');for(let i=0;i<3;i++){b.syncSession({health:1});b.eatCommit('eat:recovery'+i,1);}b.syncSession({health:1,exploration:{...pos,x:800}});
 b.storage.setItem(OLD,JSON.stringify({...sourceQuest,lunch:true}));b.storage.setItem(CIV,JSON.stringify({schemaVersion:1,actors:{'food-shop-host':{fear:9}},deliveryComplete:true}));
 const collected=plain(b.snapshot().collectedIDs),claims=plain(b.snapshot().rewardClaims);assert.equal(b.recover('recovery:1').ok,true);
 const saved=b.snapshot();assert.equal(saved.session.health,40);assert.equal(saved.wallet.kr,0);assert.equal(saved.inventory.billys,0);assert.deepEqual(plain(saved.collectedIDs),collected);assert.deepEqual(plain(saved.rewardClaims),claims);assert.equal(saved.components[OLD].lunch,true);assert.equal(saved.session.route.adventure.lunch,true);assert.deepEqual(plain(saved.components[CIV].actors),{});assert.equal(saved.session.exploration.x,pos.x);
 assert.equal(b.recover('recovery:1').reason,'duplicate');assert.equal(b.recover('recovery:2').reason,'not_needed');
});
check('corruption falls back coherently, never reimports stale legacy balances',()=>{
 const s=memory({[QUEST]:reported}),b=api.createAdventure(s);b.claimWrongEntrance();b.syncSession({health:42});b.checkpoint('corruption-safe');b.purchase('buy:late');
 const raw=JSON.parse(s.data.get(KEY));raw.wallet.kr=90000;s.data.set(KEY,JSON.stringify(raw));s.data.set(QUEST,JSON.stringify(reported));
 const recovered=api.createAdventure(s);assert.equal(recovered.snapshot().loadStatus,'checkpoint_recovery');assert.equal(recovered.snapshot().wallet.kr,40);assert.equal(recovered.snapshot().inventory.billys,1);assert.equal(recovered.snapshot().session.health,42);
 const bad=JSON.parse(s.data.get(KEY));bad.checkpoint.payload.inventory.billys=99;s.data.set(KEY,JSON.stringify(bad));const empty=api.createAdventure(s);assert.equal(empty.snapshot().loadStatus,'invalid_save_recovery');assert.equal(empty.snapshot().wallet.kr,0);assert.equal(empty.snapshot().inventory.billys,0);assert.equal(empty.storage.getItem(QUEST),null);
 s.data.set(KEY,'{truncated');assert.equal(api.createAdventure(s).snapshot().inventory.billys,0);
});
check('compatibility facade writes never replace canonical economy with stale cache',()=>{
 const s=memory({[QUEST]:reported}),b=api.createAdventure(s);b.claimWrongEntrance();const stale=JSON.parse(b.storage.getItem(KEY));stale.inventory.billys=0;stale.wallet.kr=999;b.storage.setItem(KEY,JSON.stringify(stale));
 assert.equal(b.snapshot().inventory.billys,1);assert.equal(b.snapshot().wallet.kr,40);assert.equal(JSON.parse(s.data.get(KEY)).schemaVersion,2);
 const scenes={get:id=>({id,anchors:{start:pos},floor:{left:60,right:1440,top:320,bottom:930},solids:[]})},network=api.create(b.storage,scenes);
 b.collect('route-pizza-8');assert.equal(network.snapshot().inventory.billys,2,'existing network snapshots read the live shared bag');
 network.discover('shopping-arcade');assert.equal(b.snapshot().inventory.billys,2,'a stale network save cannot restore an old bag count');
});
check('claimed stage-five receipts are not paid retrospectively on upgrade',()=>{
 const claimed={...reported,state:'reward_claimed',entitlement:{...reported.entitlement,status:'claimed'},rewardReceipt:{entitlementId:REWARD,consumer:'inventory',receiptId:'old-consumer'}};
 const b=api.createAdventure(memory({[QUEST]:claimed}));assert.equal(b.claimWrongEntrance().reason,'already_claimed');assert.equal(b.snapshot().wallet.kr,0);assert.equal(b.snapshot().inventory.billys,0);
});
check('snapshots and source session objects cannot mutate committed data',()=>{
 const b=api.createAdventure(memory()),route={health:32,routeProgress:{collectedPickups:[]}};b.syncSession({health:32,route});route.health=99;const s=b.snapshot();s.session.health=99;s.inventory.billys=99;s.checkpoint.payload.wallet.kr=99;
 assert.equal(b.snapshot().session.health,32);assert.equal(b.snapshot().inventory.billys,0);assert.equal(b.snapshot().checkpoint.payload.wallet.kr,0);
});
console.log(`PASS: ${checks} economy cases; atomic values, one-time rewards/pickups, coherent latest/checkpoint recovery, safe recovery and donor isolation.`);
