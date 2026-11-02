/* V18: passive crew pressure, shared health/weapon balance and real cover anchors. */
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const window={},sandbox={window};
for(const file of ['weapon-effects','brawler'])vm.runInNewContext(fs.readFileSync('js/'+file+'.js','utf8'),sandbox);
const make=()=>window.BearlyBrawler.create(),p={x:0,depth:-90,z:0,face:1};
function step(m,seconds,player=p){for(let t=0;t<seconds-.000001;t+=.02)m.update(Math.min(.02,seconds-t),player);}
const by=(m,id)=>m.snapshot().npcs.find(n=>n.id===id);
function until(m,predicate,player=p,limit=10){for(let t=0;t<limit;t+=.02){m.update(.02,player);if(predicate(m.snapshot()))return m.snapshot();}throw Error('Expected state not reached: '+JSON.stringify(m.snapshot()));}
const seed=(id='teen',extra={})=>({id,kind:'gangster',item:'rock',hostile:true,x:350,depth:-102,...extra});

// Legacy hostile flags cannot make the new hangouts attack without a reason.
const chill=make();chill.enter('route',[seed()]);step(chill,10);
assert.equal(chill.snapshot().stats.enemyShots,0);assert.equal(chill.snapshot().hp,100);
assert.equal(by(chill,'teen').hostile,false);assert.equal(by(chill,'teen').aggressive,false);
assert.equal(by(chill,'teen').activity,'chill');assert.equal(by(chill,'teen').x,350);

// Crossing the hangout at normal walking/cycling speed warns without aggression.
for(const [riding,speed,depth]of [[false,120,-90],[true,500,0]]){
 const passing=make();passing.enter('route',[seed()]);
 for(let t=0;t<7;t+=.02)passing.update(.02,{...p,x:t*speed,depth,riding});
 assert.equal(passing.snapshot().stats.enemyShots,0);assert.equal(by(passing,'teen').aggressive,false);
 assert.ok(passing.snapshot().stats.gangWarnings>0);
}
// Road-lane foot traffic does not press teens on the rear pavement.
const road=make();road.enter('route',[seed()]);step(road,4,{...p,x:300,depth:0});assert.equal(by(road,'teen').aggressive,false);

// Stopping close and facing them for1.2s gives a visible warning first, then
// rallies the same crew. It is deliberate sustained pressure, not merely range.
for(const [riding,depth]of [[false,-90],[true,0]]){
 const pressure=make();pressure.enter('route',[seed('teen',{crewId:'a'}),seed('friend',{x:700,crewId:'a'}),seed('other',{x:930,crewId:'b'})]);
 step(pressure,.8,{...p,x:300,depth,riding});assert.equal(by(pressure,'teen').gangAlert,true);assert.equal(by(pressure,'teen').aggressive,false);
 assert.ok(pressure.snapshot().effects.some(e=>e.kind==='gang-warning'));
 step(pressure,.5,{...p,x:300,depth,riding});assert.equal(by(pressure,'teen').aggressive,true);assert.equal(by(pressure,'friend').aggressive,true);assert.equal(by(pressure,'other').aggressive,false);
 assert.equal(pressure.lookup('teen').aggressive,true);
 if(riding){step(pressure,3,{...p,x:200,depth,riding});assert.equal(pressure.snapshot().stats.enemyShots,0,'cycling projectiles have exactly one owner');}
}
const facingAway=make();facingAway.enter('route',[seed()]);step(facingAway,3,{...p,x:275,face:-1});assert.equal(by(facingAway,'teen').aggressive,false);

// Mounted throw cues plant the same physical actor. Pursuit resumes afterward,
// rather than sliding a windup/release picture along the pavement.
const planted=make();planted.enter('route',[seed('runner',{x:700})]);planted.provokeGang('runner',p);
step(planted,.6,{...p,riding:true});const plantedX=by(planted,'runner').x;
step(planted,1,{...p,riding:true,gangPose:()=>({state:'windup'})});
assert.equal(by(planted,'runner').x,plantedX);assert.equal(by(planted,'runner').moving,false);
assert.equal(by(planted,'runner').running,false);assert.equal(by(planted,'runner').activity,'fight');
step(planted,.3,{...p,riding:true});assert.ok(by(planted,'runner').x<plantedX);

// Direct attack provokes immediately; unrelated civilians flee and never join.
const provoked=make();provoked.enter('route',[seed('teen',{x:60,depth:-90,crewId:'a'}),seed('friend',{x:220,depth:-90,crewId:'a'}),{id:'civilian',x:260,depth:-90,civilian:true,hideSpots:[{id:'bush',kind:'bush',x:900,depth:-94}]}]);
assert.ok(provoked.maul(p));assert.equal(by(provoked,'teen').hp,38);assert.equal(by(provoked,'friend').aggressive,true);
assert.equal(by(provoked,'civilian').mood,'scared');step(provoked,2);assert.equal(by(provoked,'civilian').angryUntil,0);assert.equal(by(provoked,'civilian').punching,false);
provoked.enter('room',[]);provoked.enter('route',[]);assert.equal(by(provoked,'teen').hp,38);assert.equal(by(provoked,'teen').crewId,'a');
step(provoked,25,{...p,x:10000});assert.equal(by(provoked,'teen').aggressive,false,'distant crews eventually calm and return');

// The assigned cover is a real prop anchor behind which the teen rests and
// returns after being provoked, rather than a size-changing disappearing trick.
const cover=make(),coverSpot={id:'utility',kind:'utility',x:350,depth:-102,width:88};
cover.enter('route',[seed('covered',{coverSpots:[coverSpot]})]);step(cover,1);
assert.equal(by(cover,'covered').activity,'cover');assert.equal(by(cover,'covered').behindCover,true);assert.equal(by(cover,'covered').depth,-102);
assert.ok(cover.provokeGang('covered',p));step(cover,1.5);assert.equal(by(cover,'covered').behindCover,true);assert.ok(cover.snapshot().stats.enemyShots>0);
assert.equal(by(cover,'covered').coverTarget.id,'utility');

// Each actual projectile contact applies one shared-table amount and retains
// a durable audit even when its visible effect expires.
for(const [kind,damage]of [['rock',10],['bottle',30],['firecracker',20],['molotov',30]]){
 const weapons=make();weapons.enter('route',[seed('thrower',{item:kind,depth:-90})]);weapons.provokeGang('thrower',p);
 const impact=until(weapons,s=>s.contacts.some(c=>c.target==='bear'));
 const c=impact.contacts.find(c=>c.target==='bear');assert.equal(c.appliedDamage,damage);assert.equal(c.hpBefore,100);assert.equal(c.hpAfter,100-damage);assert.equal(c.hit,true);assert.equal(impact.hp,100-damage);
 const fx=impact.effects.find(e=>e.kind==='weapon-impact');assert.equal(fx.weapon,window.BearlyWeapons.normalize(kind));assert.equal(fx.target,'bear');assert.equal(fx.appliedDamage,damage);
 assert.ok(Number.isFinite(c.z)&&c.z>0);assert.ok(c.ownerId==='thrower');
 const previousHp=impact.hp;step(weapons,1.1,{...p,x:10000});assert.equal(weapons.snapshot().hp,previousHp,'fire does not charge extra damage ticks');assert.ok(weapons.snapshot().contacts.length>0);
}
const protectedBear=make();protectedBear.enter('route',[seed()]);protectedBear.provokeGang('teen',p);
const blocked=until(protectedBear,s=>s.contacts.length,{...p,godMode:true}).contacts[0];assert.equal(blocked.target,'bear');assert.equal(blocked.appliedDamage,0);assert.equal(blocked.hpBefore,blocked.hpAfter);
const miss=make();miss.enter('route',[seed('molotov',{item:'bottle',depth:-90})]);miss.provokeGang('molotov',p);
until(miss,s=>s.shots.length);const missState=until(miss,s=>s.contacts.some(c=>c.target==='ground'),{...p,x:10000});
assert.equal(missState.contacts[0].appliedDamage,0);assert.equal(missState.contacts[0].z,0);
step(miss,1.3,{...p,x:10000});assert.ok(miss.snapshot().effects.some(e=>e.kind==='weapon-impact'&&e.weapon==='bottle'&&e.target==='ground'),'ground fire lives for the shared2.4s visual duration');
const history=make();history.enter('route',[seed()]);history.provokeGang('teen',p);step(history,200,{...p,godMode:true});assert.equal(history.snapshot().contacts.length,60);

// Health changes are shared explicitly; old in-flight foot shots can contact a
// mounted bear and report the exact cycling pool delta without a second hit.
const shared=make();shared.setHealth(43);assert.equal(shared.snapshot().hp,43);
let riderHp=43;
shared.enter('route',[seed('thrower',{depth:-90})]);shared.provokeGang('thrower',p);until(shared,s=>s.shots.length);
const riding={...p,riding:true,health:riderHp,readHealth:()=>riderHp,hurtRider:damage=>{const before=riderHp;riderHp=Math.max(0,riderHp-damage);return before-riderHp;}};
until(shared,s=>s.contacts.length,riding);const ridingHit=shared.snapshot().contacts[0];assert.equal(riderHp,33);assert.equal(ridingHit.hpBefore,43);assert.equal(ridingHit.hpAfter,33);assert.equal(shared.snapshot().hp,33);
riderHp=71;step(shared,.1,riding);assert.equal(shared.snapshot().hp,71,'riding healing is authoritative');
shared.setHealth(0);assert.equal(shared.snapshot().hp,0);shared.setHealth(100);assert.equal(shared.snapshot().hp,100);
const stored=make();let storedHp=null;assert.ok(stored.hit(10,{...p,storeHealth:hp=>storedHp=hp}));assert.equal(storedHp,90);

// Street seed cover entries dispatch real prop renderers and retain depth order.
const calls=[],c={save(){},restore(){},translate(){},scale(){}},streetWindow={BearlyStreetProps:{draw:(...args)=>calls.push(['draw',args[1],args[4]]),hazard:(ctx,h)=>calls.push(['hazard',h.type]),ready:()=>true}};
vm.runInNewContext(fs.readFileSync('js/street-life.js','utf8'),{window:streetWindow,Image:class{set src(value){this.url=value;}},document:{createElement:()=>({getContext:()=>({drawImage(){}})})}});
const seeds=streetWindow.BearlyStreetLife.seeds([],42000,12,[seed('gang-4000-0',{x:3900}),seed('gang-4000-1',{x:4050}),seed('gang-8000-0',{x:8000})]);
const gangSeeds=seeds.filter(n=>n.kind==='gangster');assert.equal(gangSeeds.length,3);assert.equal(gangSeeds.filter(n=>n.coverSpots.length).length,2);assert.ok(gangSeeds.every(n=>!n.hostile));
const audit=streetWindow.BearlyStreetLife.audit(),coverProps=audit.props.filter(q=>['firebin','utility'].includes(q.kind));assert.equal(coverProps.length,2);
for(const prop of coverProps){const actor=gangSeeds.find(n=>n.coverSpots.some(q=>q.id===prop.id));assert.ok(actor.depth<prop.depth);streetWindow.BearlyStreetLife.drawProp(c,prop,()=>500,1);}
assert.ok(calls.some(q=>q[0]==='hazard'&&q[1]==='firebin'));assert.ok(calls.some(q=>q[0]==='draw'&&q[1]==='utility'&&q[2]===88));
console.log('Gang encounters passed: calm hangouts, warning/pressure, crew provocation, real cover, cycling ownership, exact weapon contacts, fire duration, shared health and bounded history.');
