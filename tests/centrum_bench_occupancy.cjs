/* Actual source routines: occupied seating is skipped, without moving its user.
   These are simulation contracts, not rendered seating or animation evidence. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const code=fs.readFileSync('js/brawler.js','utf8'),plain=x=>JSON.parse(JSON.stringify(x));
const far={x:9000,depth:0,z:0,speed:0,face:1};
function make(source=code){const window={};vm.runInNewContext(source,{window});return window.BearlyBrawler.create();}
function step(sim,seconds,check=()=>{},player=far){for(let left=seconds;left>1e-8;left-=.05){sim.update(Math.min(.05,left),player);check();}}
const spot={id:'shared-bench',kind:'bench',x:500,depth:-84,duration:1};
function seed(id,x,extra={}){return{id,variant:9,civilian:true,patrol:true,x,depth:-64,sidewalkDepth:-64,routeMin:100,routeMax:900,walkSpeed:60,restSpots:[{...spot}],...extra};}
function occupants(sim){return sim.snapshot().npcs.filter(n=>['sit','read'].includes(n.activity)&&n.activityProp?.id===spot.id);}
let checks=0;
function skipContract(source){
 for(const [x,direction]of [[300,1],[700,-1]]){
  const sim=make(source);sim.enter('street',[seed('reader',500,{restSpots:[{...spot,kind:'newspaper'}]}),seed('visitor',x,{routeDirection:direction})]);
  const before=plain(sim.lookup('reader')),hp=sim.snapshot().hp,stats=plain(sim.snapshot().stats);
  step(sim,15,()=>{assert.equal(occupants(sim).length,1,'a visitor cannot sit inside a calm existing user');assert.equal(sim.lookup('reader').x,before.x);assert.equal(sim.lookup('reader').depth,before.depth);assert.equal(sim.lookup('reader').activity,'read');assert.notEqual(sim.lookup('visitor').activityProp?.id,spot.id);});
  assert(sim.lookup('visitor').distance>50,'the skipped visitor continues an ordinary route');assert.equal(sim.snapshot().hp,hp);assert.deepEqual(plain(sim.snapshot().stats),stats);checks++;
 }
}
skipContract(code);
// Both walkers initially select a free seat. Whichever arrives first keeps it;
// the other must revalidate the point it selected on a previous frame.
const race=make();race.enter('race',[seed('first',480,{routeDirection:1,walkSpeed:60}),seed('second',540,{routeDirection:-1,walkSpeed:40})]);
let sawTargetTogether=false,sawClaim=false;
step(race,12,()=>{
 const a=race.lookup('first'),b=race.lookup('second');
 sawTargetTogether||=a.routeIndex!=null&&b.routeIndex!=null&&a.routePoints[a.routeIndex].id===spot.id&&b.routePoints[b.routeIndex].id===spot.id;
 sawClaim||=occupants(race).length===1;assert(occupants(race).length<=1,'arrival race must not create two overlapping seated bodies');
});
assert(sawTargetTogether&&sawClaim,'the test exercises a selected point becoming occupied while approached');checks++;
// Contact releases the old user; the same stable point becomes available again.
const freed=make();freed.enter('free',[seed('reader',500),seed('visitor',700,{routeDirection:-1})]);
freed.update(.05,{x:500,depth:-84,z:0,speed:25,face:1});assert.notEqual(freed.lookup('reader').activity,'sit');
step(freed,8);assert.equal(freed.lookup('visitor').activity,'sit');assert.equal(freed.lookup('visitor').activityProp.id,spot.id);checks++;
// Non-seating idle/smoke routines retain their old shared-stop semantics.
for(const kind of ['idle','smoke']){
 const sim=make();sim.enter(kind,[seed('one',500,{restSpots:[{...spot,kind,duration:100}]}),seed('two',700,{routeDirection:-1,restSpots:[{...spot,kind,duration:100}]})]);step(sim,8);
 assert.equal(sim.lookup('two').activityProp.id,spot.id,'the change is limited to bench/newspaper use');checks++;
}
// Use actual authored promenade identities and the same real contact trigger.
const window={};for(const name of ['centrum-street-bench','street-life'])vm.runInNewContext(fs.readFileSync('js/'+name+'.js','utf8'),{window,Image:class{}});
const actual=make();actual.enter('route',window.BearlyStreetLife.seeds([],6000,4));const reader=plain(actual.lookup('civilian-reader')),smoker=actual.lookup('civilian-smoker'),stats=plain(actual.snapshot().stats);
actual.update(.05,{x:smoker.x,depth:smoker.depth,z:0,speed:25,face:1});assert.notEqual(actual.lookup('civilian-smoker').activity,'smoke');
step(actual,15,()=>{assert.equal(actual.lookup('civilian-reader').activity,'read');assert.equal(actual.lookup('civilian-reader').x,reader.x);assert.notEqual(actual.lookup('civilian-smoker').activityProp?.id,'promenade-bench-east');});
assert.deepEqual(plain(actual.snapshot().stats),stats);assert.equal(actual.lookup('civilian-reader').hp,reader.hp);checks++;
const old=code.replace("return !['bench','newspaper'].includes(point?.kind)","return true||!['bench','newspaper'].includes(point?.kind)");assert.notEqual(old,code);assert.throws(()=>skipContract(old),assert.AssertionError,'the old overlapping-arrival behaviour must fail');
console.log(JSON.stringify({passed:true,simulationCases:checks,occupiedBenchDirections:2,approachRace:true,freedBenchReusable:true,nonSeatingKindsUnchanged:['idle','smoke'],authoredPromenade:true,overlapMutationRejected:true,newReservationsOrSaveFields:false}));
