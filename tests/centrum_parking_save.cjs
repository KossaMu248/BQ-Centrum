'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),window={};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/centrum-parking-save.js'),'utf8'),{window});
const api=window.BearlyCentrumParkingSave,KEY='bq-centrum:parking:v1';
const plain=value=>value==null?null:JSON.parse(JSON.stringify(value));
const quest={started:true,lunch:true,kit:false,delivered:false,repaired:false,chart:true,buoys:[],voyage:false,seeds:[1],garden:false};
const route={collectedPickups:['route-pizza-0','route-pizza-2'],score:4321,bonus:320,maxDist:11325,seconds:47.5,checkpoint:0,panic:21,trickHazards:['hazard-38'],oneTime:['pizza-dialogue','arrived-metro'],lostParts:['leftArm']};
const position={sceneId:'metro-square',entranceId:'bicycle-parking',x:248,y:730,face:1};
const good={schemaVersion:1,routeId:'autumn-main',routeSceneId:'route:autumn-main',entryId:'centrum-stop',bikeId:'centrum-family-bike',phase:'exploring',parked:{x:11320.25,y:431.5},remount:{sceneId:'metro-square',anchorId:'bicycle-parking'},health:63,adventure:quest,routeProgress:route,exploration:position};
const validate=p=>['metro-square','shopping-arcade','service-courtyard','food-shop','bicycle-workshop'].includes(p.sceneId)&&['bicycle-parking','start','from-arcade'].includes(p.entranceId)&&p.x>=90&&p.x<=1080&&p.y>=400&&p.y<=920;
function memory(value){
 const data=new Map([['bearBestAutumn','donor score'],['bearAutumnAdventureV7','donor quest'],['bq-centrum:scene-network:v1','independent network inventory']]);
 if(value!==undefined)data.set(KEY,typeof value==='string'?value:JSON.stringify(value));const calls=[];
 return {data,calls,getItem(k){calls.push(['get',k]);return data.get(k)||null;},setItem(k,v){calls.push(['set',k]);data.set(k,v);}};
}

const store=memory(),game=api.create(store,validate);
assert.equal(game.load(),null);assert.deepEqual(store.calls,[['get',KEY]],'no automatic writes or legacy-key reads');
assert.deepEqual(plain(game.save(good)),good);
assert.deepEqual(plain(api.create(store,validate).load()),good,'exact route and shared health/quest preserved');
const returned=game.load();returned.health=100;returned.adventure.lunch=false;returned.parked.x=11240;
returned.routeProgress.collectedPickups.length=0;returned.routeProgress.score=99999;
assert.equal(game.load().health,63);assert.equal(game.load().adventure.lunch,true);assert.equal(game.load().parked.x,11320.25);
assert.deepEqual(plain(game.load().routeProgress),route,'reward and pickup state is defensive and exact');

// Transitional reloads recover one stable exploration owner, without healing.
for(const phase of ['dismount','remount']){
 const save=memory({...good,phase}),loaded=api.create(save,validate).load();
 assert.equal(loaded.phase,'exploring');assert.equal(loaded.health,63);
 assert.deepEqual(plain(loaded.adventure),quest);assert.deepEqual(save.calls,[['get',KEY]]);
 assert.deepEqual(plain(loaded.routeProgress),route,'a transfer reload never respawns pickups or recalculates rewards');
}
for(const override of [
 {schemaVersion:0},{routeId:'other'},{routeSceneId:'food-shop'},{entryId:'unknown'},{bikeId:'other-bike'},
 {phase:'flying'},{health:NaN},{health:-1},{health:101},{health:'63'},
 {parked:{x:100,y:431}},{parked:{x:11416,y:431}},{parked:{x:11325,y:Infinity}},
 {remount:{sceneId:'food-shop',anchorId:'bicycle-parking'}},{remount:{sceneId:'metro-square',anchorId:'counter'}},
 {adventure:{...quest,lunch:'true'}},{adventure:{...quest,seeds:[9]}},
 {routeProgress:undefined},{routeProgress:null},{routeProgress:{...route,collectedPickups:['route-pizza-12']}},
 {routeProgress:{...route,collectedPickups:['route-pizza-0','route-pizza-0']}},
 {routeProgress:{...route,score:-1}},{routeProgress:{...route,score:1e9+1}},
 {routeProgress:{...route,bonus:Infinity}},{routeProgress:{...route,maxDist:42001}},
 {routeProgress:{...route,seconds:'47'}},{routeProgress:{...route,checkpoint:2}},
 {routeProgress:{...route,checkpoint:.5}},{routeProgress:{...route,panic:101}},
 {routeProgress:{...route,trickHazards:['x'.repeat(101)]}},{routeProgress:{...route,trickHazards:Array.from({length:513},(_,i)=>'hazard-'+i)}},
 {routeProgress:{...route,oneTime:Array.from({length:257},(_,i)=>'once-'+i)}},
 {routeProgress:{...route,oneTime:[3]}},{routeProgress:{...route,lostParts:['spareArm']}},
 {exploration:null},{exploration:{...position,sceneId:'route:autumn-main'}},
 {exploration:{...position,entranceId:'missing'}},{exploration:{...position,x:0}},
 {exploration:{...position,face:0}},
]){
 const raw={...good,...override},saved=memory(raw),q=api.create(saved,validate);
 assert.equal(q.load(),null,'reject impossible/incompatible record instead of defaulting health');
 assert.equal(q.save(raw),null);assert.deepEqual(saved.calls,[['get',KEY]],'invalid records do not replace storage');
}
for(const bad of ['{bad','null','[]','3'])assert.equal(api.create(memory(bad),validate).load(),null);

// Finishing transfers changes ownership only. It does not increment a reward,
// read network inventory, heal, duplicate quest items or clear another save.
const before=plain(game.load());
for(let i=0;i<4;i++){
 const result=game.finish(63);assert.equal(result.phase,'riding');assert.equal(result.health,63);
 assert.deepEqual(plain(result.adventure),before.adventure);
 assert.deepEqual(plain(result.routeProgress),route,'finish carries the exact stored reward ledger without granting it again');
 game.save({...result,phase:'dismount',exploration:position});
 game.save({...result,phase:'exploring',exploration:position});
}
assert.equal(store.data.get('bq-centrum:scene-network:v1'),'independent network inventory');
assert.equal(store.data.get('bearBestAutumn'),'donor score');assert.equal(store.data.get('bearAutumnAdventureV7'),'donor quest');
assert.ok(store.calls.every(([,k])=>k===KEY));
const denied=api.create({getItem(){throw Error('denied');},setItem(){throw Error('denied');}},validate);
assert.equal(denied.load(),null);assert.equal(denied.save(good).health,63);assert.equal(denied.finish(63).phase,'riding');
console.log('PASS: single namespaced parking record, exact route/health/quest/reward ledger, stable transfer reload, impossible-target rejection and no duplicated reward writes.');
