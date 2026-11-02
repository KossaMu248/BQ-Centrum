const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const window={};vm.runInNewContext(fs.readFileSync('js/brawler.js','utf8'),{window});
const make=()=>window.BearlyBrawler.create(),player={x:0,depth:-70,z:0,face:1,godMode:true};
function step(model,seconds,p=player){for(let elapsed=0;elapsed<seconds-.0001;elapsed+=.02)model.update(Math.min(.02,seconds-elapsed),p);}
const by=(m,id)=>m.snapshot().npcs.find(n=>n.id===id);

// Peace-only residents do not inherit aggression, even if a caller also marks
// them hostile. A direct hit produces an audible/visible alarm and escape.
const direct=make();
direct.enter('street',[{id:'civilian',x:60,depth:-70,civilian:true,hostile:true,patrol:true,routeMin:-200,routeMax:1200,
  hideSpots:[{id:'near-threat',kind:'bin',x:100,depth:-70},{id:'safe-bush',kind:'bush',x:620,depth:-76}]}]);
assert.equal(direct.maul(player),true);
let civ=by(direct,'civilian');assert.equal(civ.hp,38);assert.equal(civ.angryUntil,0);assert.equal(civ.hostile,false);assert.equal(civ.mood,'scared');assert.equal(civ.screaming,true);
assert.ok(direct.snapshot().effects.some(e=>e.kind==='scream'&&e.actorId==='civilian'));
assert.equal(civ.hideTarget.id,'safe-bush','escape chooses a prop farther from the attacker');
step(direct,.8);civ=by(direct,'civilian');assert.equal(civ.activity,'flee');assert.equal(civ.running,true);assert.ok(civ.x>100);
step(direct,3);civ=by(direct,'civilian');assert.equal(civ.hiding,true);assert.equal(civ.activity,'hide');assert.equal(civ.activityProp.id,'safe-bush');
assert.ok(Math.abs(civ.depth+76)<1);assert.equal(direct.snapshot().stats.enemyShots,0);assert.equal(direct.snapshot().hp,100);
step(direct,18);civ=by(direct,'civilian');assert.equal(civ.mood,'calm');assert.equal(civ.hiding,false);assert.equal(civ.angryUntil,0);
assert.equal(direct.snapshot().stats.enemyShots,0);assert.equal(direct.snapshot().hp,100,'a frightened civilian never counters after recovering');

// A nearby witness flees, while a distant pedestrian keeps their own routine.
const witnesses=make();
witnesses.enter('street',[{id:'target',x:60,depth:-70},{id:'close',x:245,depth:-70,civilian:true,hideSpots:[{id:'cover',kind:'bush',x:900,depth:-80}]},
  {id:'far',x:850,depth:-70,civilian:true,patrol:true,routeMin:700,routeMax:1800}]);
assert.ok(witnesses.maul(player));assert.equal(by(witnesses,'target').mood,'aggressive');assert.equal(by(witnesses,'close').mood,'scared');assert.equal(by(witnesses,'far').mood,'calm');
step(witnesses,.4);assert.equal(by(witnesses,'close').activity,'flee');assert.equal(by(witnesses,'far').activity,'walk');
assert.ok(witnesses.snapshot().stats.witnesses>=1);

// Long explicit routes stay on the sidewalk, visit props, pause there, then
// continue over a much larger range than the former short back-and-forth route.
const route=make();route.enter('street',[{id:'reader',x:600,depth:0,civilian:true,patrol:true,routeMin:100,routeMax:1500,walkSpeed:65,
  restSpots:[{id:'reading-bench',kind:'newspaper',x:600,depth:-70,duration:2}]}]);
assert.equal(by(route,'reader').activity,'read');assert.equal(by(route,'reader').depth,-70);
step(route,1);assert.equal(by(route,'reader').activity,'read');assert.equal(by(route,'reader').x,600);assert.equal(by(route,'reader').speed,0);
step(route,2);assert.equal(by(route,'reader').activity,'walk');
let min=Infinity,max=-Infinity;for(let i=0;i<2600;i++){route.update(.02,{...player,x:4000});const n=by(route,'reader');min=Math.min(min,n.x);max=Math.max(max,n.x);assert.equal(n.depth,-70);}
assert.ok(max-min>1100,{min,max});assert.ok(by(route,'reader').distance>1800);

// Each adult rest mode has an actual prop association rather than a combat pose.
for(const [kind,activity]of [['bench','sit'],['newspaper','read'],['smoke','smoke']]){
 const rest=make();rest.enter('rest',[{id:kind,x:300,patrol:true,civilian:true,routeMin:0,routeMax:1200,restSpots:[{id:'prop-'+kind,kind,x:300,depth:-72,duration:4}]}]);
 step(rest,1,{...player,x:4000});const n=by(rest,kind);assert.equal(n.activity,activity);assert.equal(n.activityProp.id,'prop-'+kind);assert.equal(n.moving,false);
}
// An initial bench may sit behind the walking lane. Its authored depth applies
// while resting; departure returns to the sidewalk without changing homeDepth.
const behind=make();behind.enter('street',[{id:'bench-reader',x:400,patrol:true,civilian:true,sidewalkDepth:-64,routeMin:100,routeMax:1400,
 restSpots:[{id:'rear-bench',kind:'newspaper',x:400,depth:-84,duration:2}]}]);
assert.equal(by(behind,'bench-reader').depth,-84);assert.equal(by(behind,'bench-reader').homeDepth,-64);
step(behind,1,{...player,x:4000});assert.equal(by(behind,'bench-reader').activity,'read');assert.equal(by(behind,'bench-reader').depth,-84);
step(behind,2,{...player,x:4000});assert.equal(by(behind,'bench-reader').activity,'walk');assert.equal(by(behind,'bench-reader').depth,-64);
assert.equal(by(behind,'bench-reader').homeDepth,-64);assert.equal(by(behind,'bench-reader').sidewalkDepth,-64);

// Provoked adults run fast enough to close a gap on a walking player. They
// return to their passive pose after aggression expires; gang cycling remains
// owned by the original cycling encounter.
const chase=make();chase.enter('street',[{id:'runner',x:70,depth:-70}]);assert.ok(chase.maul(player));
step(chase,.7);let simulatedX=-180,smallest=Infinity,sawRun=false;
for(let i=0;i<450;i++){simulatedX-=200*.02;chase.update(.02,{...player,x:simulatedX});const n=by(chase,'runner');smallest=Math.min(smallest,Math.abs(n.x-simulatedX));sawRun||=n.activity==='run'&&n.running;}
assert.equal(sawRun,true);assert.ok(smallest<72,smallest);
const cycle=make();cycle.enter('street',[{id:'crew',x:350,depth:-65,hostile:true,kind:'gangster',item:'rock'}]);step(cycle,4,{...player,riding:true});assert.equal(cycle.snapshot().stats.enemyShots,0);
const projectileWitness=make();projectileWitness.enter('street',[{id:'crew',x:350,depth:-70,hostile:true,kind:'gangster',item:'rock'},
 {id:'bystander',x:540,depth:-70,civilian:true,schedule:{period:20,on:1,exitX:540},hideSpots:[{id:'distant-bush',kind:'bush',x:1100,depth:-76}]}]);
assert.ok(projectileWitness.provokeGang('crew',player));step(projectileWitness,3,player);assert.ok(projectileWitness.snapshot().stats.enemyShots>0);
assert.equal(by(projectileWitness,'bystander').mood,'scared');assert.equal(by(projectileWitness,'bystander').hp,60,'seeing a projectile fight is enough to flee without being hit');

// A schedule stages people instead of spawning every identity simultaneously.
// Visibility changes happen away from the player and IDs/health survive absence.
const scheduled=make();scheduled.enter('street',[{id:'scheduled',x:1000,depth:-70,hp:41,patrol:true,routeMin:900,routeMax:1100,
  schedule:{period:12,on:5,offset:0,entryX:1000,exitX:1000}}]);
assert.equal(by(scheduled,'scheduled').active,true);step(scheduled,7,{...player,x:0});
let absent=by(scheduled,'scheduled');assert.equal(absent.active,false);assert.equal(absent.visible,false);assert.equal(absent.hp,41);
assert.equal(scheduled.maul({...player,x:absent.x}),false,'offstage actors cannot be attacked');
step(scheduled,7,{...player,x:0});let returned=by(scheduled,'scheduled');assert.equal(returned.active,true);assert.equal(returned.id,'scheduled');assert.equal(returned.hp,41);
const near=make();near.enter('street',[{id:'near',x:70,depth:-70,patrol:true,routeMin:70,routeMax:1200,schedule:{period:20,on:.1,entryX:70,exitX:70}}]);
assert.ok(near.grab(player));step(near,.8);assert.equal(by(near,'near').state,'held');assert.equal(by(near,'near').visible,true,'held actors never disappear with schedule');
assert.ok(near.throwAtScreen(player));step(near,.8);assert.equal(by(near,'near').state,'screen');assert.equal(by(near,'near').visible,true);
const deferred=make();deferred.enter('street',[{id:'deferred',x:50,schedule:{period:10,on:4,offset:5,entryX:50},civilian:true}]);assert.equal(by(deferred,'deferred').visible,false);
// An on-window cannot materialise directly alongside the player.
step(deferred,5.5,{...player,x:50});assert.equal(by(deferred,'deferred').visible,false);
step(deferred,.1,{...player,x:2000});assert.equal(by(deferred,'deferred').visible,true);
deferred.enter('other',[]);deferred.enter('street',[]);assert.equal(by(deferred,'deferred').id,'deferred');

// Population state and fear survive changing arenas rather than replacing IDs.
direct.enter('room',[]);direct.enter('street',[{id:'replacement',x:0}]);assert.equal(by(direct,'civilian').hp,38);
const snap=direct.snapshot();snap.npcs.length=0;assert.equal(direct.snapshot().npcs.length,1);
console.log('NPC life checks passed: peaceful fear/flee/hide, witness safety, sidewalk routes, prop rests, running pursuit, schedules, stable IDs/health and combat visibility.');
