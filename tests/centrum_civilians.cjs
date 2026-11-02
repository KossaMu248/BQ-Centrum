'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const window={},context=vm.createContext({window});
for(const file of ['centrum-scenes','centrum-square-world','brawler','centrum-civilians'])vm.runInContext(fs.readFileSync(`js/${file}.js`,'utf8'),context);
const KEY='bq-centrum:civilians:v1',data=new Map(),calls=[];
const storage={getItem(k){calls.push(['get',k]);return data.get(k)||null;},setItem(k,v){calls.push(['set',k]);data.set(k,v);}};
const create=()=>window.BearlyCentrumCivilians.create(storage);
let game=create();
assert.equal(game.targets('food-shop').length,1);assert.equal(game.targets('service-courtyard').length,1);assert.equal(game.targets('shopping-arcade').length,1);
assert.equal(game.targets('metro-square').length,0);assert.equal(game.targets('bicycle-workshop').length,0);
for(const n of game.audit().residents){assert.equal(n.civilian,true);assert.equal(n.hostile,false);assert.equal(n.available,true);}
const update=(g,seconds)=>{for(let t=0;t<seconds;t+=.05)g.update('service-courtyard',.05,{x:100,y:650,face:1});};
const host='food-shop-host',caretaker='courtyard-caretaker';
assert.equal(game.disturb(host,'frightened'),true);assert.equal(game.requestTalk(host).available,false);assert.equal(game.requestTalk(host).fear,true);
update(game,4);assert.equal(game.requestTalk(host).available,false);
game=create();assert.equal(game.requestTalk(host).available,false,'reload preserves remaining source fear');
update(game,18);assert.equal(game.requestTalk(host).available,true,'frightened quest giver returns');
assert.equal(game.requestTalk(host).bodyClear,true,'reloaded frightened shopkeeper is on a reachable room floor');
for(const n of game.audit().residents)if(n.available)assert.equal(window.BearlyCentrumSquareWorld.blocked(n.x,n.y,22,12,n.sceneId,{gateOpened:true}),false,`${n.id} available only on valid floor`);
// A changed/blocked quiet spot must never leave an essential target outside
// navigable space when source fear ends (source lookup intentionally returns copies).
const sourceBlocked=window.BearlyCentrumSquareWorld.blocked;
window.BearlyCentrumSquareWorld.blocked=(x,y,rx,ry,id,state)=>id==='food-shop'&&x>920||sourceBlocked(x,y,rx,ry,id,state);
assert.equal(game.disturb(host,'frightened'),true);update(game,18);
assert.equal(game.requestTalk(host).available,true,'offstage calm essential target resumes its safe source home routine');
assert.equal(game.requestTalk(host).bodyClear,true);
window.BearlyCentrumSquareWorld.blocked=sourceBlocked;
assert.equal(game.disturb(caretaker,'unavailable'),true);assert.equal(game.requestTalk(caretaker).available,false);assert.equal(game.requestTalk(caretaker).hp,0);
update(game,3);game=create();assert.equal(game.requestTalk(caretaker).available,false,'defeat remains transient across reload');
update(game,18);assert.equal(game.requestTalk(caretaker).available,true,'source recovery restores essential target');
assert.equal(game.requestTalk(caretaker).civilian,true);assert.equal(game.requestTalk(caretaker).hostile,false);
assert.equal(game.beginTalk(caretaker),true);const before=game.requestTalk(caretaker);update(game,2);assert.equal(game.requestTalk(caretaker).x,before.x);game.endTalk();
assert.equal(game.approveDelivery(),true);assert.equal(game.approveDelivery(),false,'no duplicate delivery duty');assert.equal(game.requestTalk(caretaker).available,false);
update(game,4);assert.equal(game.deliveryMotion().complete,true);assert.equal(game.deliveryMotion().progress,1);assert.equal(game.requestTalk(caretaker).available,true);
game=create();assert.equal(game.deliveryMotion().complete,true,'cargo completion survives reload');assert.equal(game.approveDelivery(),false,'revisit never replays duty');
assert.ok(calls.every(([,key])=>key===KEY));assert.equal(data.size,1,'no quest/inventory/health key touched');
const denied=window.BearlyCentrumCivilians.create({getItem(){throw Error('denied');},setItem(){throw Error('denied');}});assert.equal(denied.requestTalk(host).available,true);assert.equal(denied.disturb(host,'frightened'),true);update(denied,18);assert.equal(denied.requestTalk(host).available,true);
const bad=window.BearlyCentrumCivilians.create({getItem(){return '{"schemaVersion":1,"actors":{"food-shop-host":{"event":"frightened","elapsed":999999999}}}';}});assert.equal(bad.requestTalk(host).available,true);
console.log('PASS: sparse source civilians, fear/defeat/reload recovery, peaceful identities, held dialogue, one-time delivery walk and namespaced/denied storage.');
