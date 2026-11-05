/* Peaceful source rest is interrupted by contact/danger, not a clock.
   Executes the actual Brawler and StreetLife data without a DOM/browser. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const live=fs.readFileSync('js/brawler.js','utf8');
const plain=value=>JSON.parse(JSON.stringify(value));
function make(source=live){const window={};vm.runInNewContext(source,{window});return window.BearlyBrawler.create();}
const far={x:9000,depth:0,z:0,speed:0,face:1};
function step(sim,seconds,p=far){for(let left=seconds;left>1e-8;left-=.05)sim.update(Math.min(.05,left),p);}
const seats=['bench','newspaper','smoke'].map((kind,i)=>({id:kind,variant:9+i,x:i*1000+500,depth:-84,sidewalkDepth:-64,patrol:true,civilian:true,routeMin:i*1000+200,routeMax:i*1000+800,walkSpeed:50,
 restSpots:[{id:'rest-'+kind,kind,x:i*1000+500,depth:-84,duration:1.5}],...(kind==='smoke'?{schedule:{period:4,on:2,offset:0,entryX:i*1000+800,exitX:i*1000+800}}:{})}));
const report={scope:'Actual simulation/data unit contracts; not rendered appearance or physical-device evidence',quietSeconds:300,quietKinds:['sit','read','smoke'],noncontactCases:0,passed:false};
function quietContract(source){
 const sim=make(source);sim.enter('street',seats);step(sim,300);
 for(const [i,seed]of seats.entries()){
  const n=sim.lookup(seed.id);assert.equal(n.x,seed.x,'elapsed timers/schedule cannot move a peaceful resting NPC');assert.equal(n.depth,-84);
  assert.equal(n.activity,report.quietKinds[i]);assert.equal(n.activityProp.id,'rest-'+seed.id);assert.equal(n.speed,0);assert.equal(n.distance,0);assert.equal(n.moving,false);assert.equal(n.active,true);assert.equal(n.visible,true);assert.equal(n.hp,60);
 }
 return sim;
}
const quiet=quietContract(live);
// In-memory mutation recreates the old timer-only behavior. The quiet contract
// must reject it; no source file or donor is changed by this control.
const mutation=live.replace('function resting(n){return','function resting(n){return false&&');assert.notEqual(mutation,live);
assert.throws(()=>quietContract(mutation),/elapsed timers\/schedule/);report.timerOnlyMutationRejected=true;

// A view/arena change retains the same actors and prop identity despite time.
quiet.enter('room',[{id:'room-resident',x:40,depth:0}]);step(quiet,120);quiet.enter('street',[{id:'replacement',x:0}]);step(quiet,1);
assert.equal(quiet.lookup('bench').activity,'sit');assert.equal(quiet.lookup('bench').activityProp.id,'rest-bench');assert.equal(quiet.snapshot('street').npcs.length,3);report.offSceneSeconds=120;
const saved=plain(quiet.snapshot('street'));assert(saved.npcs.every(n=>Number.isFinite(n.restUntil)),'JSON retains finite ordinary timer values, not Infinity/null hacks');
// Existing seed fields already contain restSpots/activity/prop identity; no new
// persistence document or save key is required for an authored-rest roundtrip.
const reentered=make();reentered.enter('street',saved.npcs);step(reentered,35);
for(const seed of seats){const n=reentered.lookup(seed.id);assert.equal(n.activityProp.id,'rest-'+seed.id);assert.equal(n.x,seed.x);}
report.finiteJSONSeedRoundtrip=true;

for(const p of [
 {x:500,depth:-84,z:0,speed:0}, // stationary overlap is not ongoing interference
 {x:550,depth:-84,z:0,speed:40}, // merely passing nearby
 {x:500,depth:-50,z:0,speed:40}, // another ground-depth lane
 {x:500,depth:-84,z:70,speed:40}, // jumping above the footprint
 {x:500,z:0,speed:40}, // omitted depth means the road, not the rear bench
 {depth:-84,z:0,speed:40}, // invalid player x cannot produce a contact
]){const sim=make();sim.enter('street',[seats[0]]);step(sim,12,p);assert.equal(sim.lookup('bench').activity,'sit','quiet/proximity without moving foot overlap must not wake a resident');report.noncontactCases++;}
const bumped=make();bumped.enter('street',[seats[0]]);bumped.update(.05,{x:508,depth:-84,z:0,speed:40,face:1});const n=bumped.lookup('bench');
assert.equal(n.activityProp,null);assert.notEqual(n.activity,'sit');assert(n.distance>0);assert.equal(n.hp,60);assert.equal(bumped.snapshot().heat,0);assert.equal(bumped.snapshot().stats.defeats,0);assert.equal(bumped.snapshot().stats.enemyShots,0);report.movingContactWakesWithoutDamage=true;

const attacked=make();attacked.enter('street',[seats[0]]);assert(attacked.maul({x:480,depth:-84,z:0,face:1}));assert.equal(attacked.lookup('bench').hp,38,'source 22 damage is unchanged');assert(attacked.lookup('bench').fearUntil>0);assert.notEqual(attacked.lookup('bench').activity,'sit');
const witness=make();witness.enter('street',[seats[0],{id:'target',x:600,depth:-84}]);witness.maul({x:590,depth:-84,z:0,face:1});witness.update(.05,far);assert(witness.lookup('bench').fearUntil>0);assert.notEqual(witness.lookup('bench').activity,'sit');report.existingAttackAndNearbyFightWake=true;

// Combat knocked-down/dead recovery remains exactly the native behavior.
// Disable only our rest helper for the baseline; every combat line is shared.
function combatTrace(source){const sim=make(source);sim.enter('fight',[{id:'target',x:100,depth:0,civilian:true,hp:1}]);sim.maul({x:80,depth:0,z:0,face:1});const states=[];for(let i=0;i<285;i++){sim.update(.05,far);if([0,14,15,254,255,264,265,284].includes(i)){const n=sim.lookup('target');states.push([i,n.state,n.hp,n.age]);}}return states;}
assert.deepEqual(combatTrace(live),combatTrace(mutation));report.combatRecoveryTraceUnchanged=true;

// Exercise the actual authored promenade identities/rest props, including the
// smoker's schedule. Non-rest idle waypoints still resume normal walking.
const world={};class Image{};
for(const name of ['centrum-street-bench','street-life'])vm.runInNewContext(fs.readFileSync('js/'+name+'.js','utf8'),{window:world,Image});
const actual=make();actual.enter('route',world.BearlyStreetLife.seeds([],6000,4));step(actual,180);
for(const [id,activity,prop]of [['civilian-reader','read','promenade-bench-east'],['civilian-smoker','smoke','promenade-smoke'],['civilian-bench','sit','promenade-bench-west']]){
 const n=actual.lookup(id);assert.equal(n.activity,activity);assert.equal(n.activityProp.id,prop);assert.equal(n.distance,0);assert(n.active&&n.visible);
}
assert(actual.lookup('promenade-walker').distance>100,'ordinary finite idle waypoint pauses keep their native patrol');report.authoredPromenadeIdentities=3;report.ordinaryIdlePatrolPreserved=true;
report.passed=true;console.log(JSON.stringify(report));
