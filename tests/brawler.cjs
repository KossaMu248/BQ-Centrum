const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const window={};vm.runInNewContext(fs.readFileSync('js/brawler.js','utf8'),{window});
const make=()=>window.BearlyBrawler.create(),p={x:0,depth:0,z:0,face:1};
function step(c,seconds,player=p){for(let t=0;t<seconds;t+=.02)c.update(.02,player)}
const range=make();range.enter('a',[{id:'far-depth',x:40,depth:55}]);assert.equal(range.grab(p),false);assert.equal(range.maul(p),false);
range.enter('b',[{id:'near',x:50,depth:0}]);assert.equal(range.grab({...p,z:30}),false);assert.equal(range.maul({...p,z:40}),false);
assert.ok(range.grab(p));assert.equal(range.snapshot().baby.position,'back','baby remains attached in a back carrier');assert.ok(range.throwAtScreen(p));
assert.equal(range.snapshot().npcs[0].lastDamage,32);step(range,.8);assert.equal(range.snapshot().npcs[0].state,'screen');assert.equal(range.snapshot().stats.screenImpacts,1,'throw reaches a held face-first impact');
step(range,.9);assert.equal(range.snapshot().npcs[0].state,'down');step(range,3.4);assert.equal(range.snapshot().npcs[0].state,'idle');
const weak=make();weak.enter('weak',[{id:'weak',x:50,depth:0,hp:6}]);assert.ok(weak.grab(p));assert.ok(weak.throwAtScreen(p));assert.equal(weak.snapshot().npcs[0].lastDamage,6,'damage text reports actual remaining health lost');
const social=make();social.enter('route',[{id:'victim',x:60,depth:0},{id:'witness',x:230,depth:0},{id:'distant',x:900,depth:0}]);
assert.ok(social.maul(p));let ns=social.snapshot().npcs;assert.equal(ns[0].mood,'aggressive');assert.equal(ns[1].mood,'aggressive');assert.equal(ns[2].mood,'calm');assert.equal(social.snapshot().stats.witnesses,1);
social.cancel();social.enter('room',[]);social.enter('route',[{id:'replacement',x:0}]);assert.equal(social.snapshot().npcs[0].hp,38,'returning to the street retains the same damaged actor');assert.equal(social.snapshot().npcs[1].mood,'aggressive','remounting does not erase witness aggression');
const dead=make();dead.enter('arena',[{id:'adult',x:60,depth:0}]);for(let i=0;i<3;i++){const n=dead.snapshot().npcs[0];assert.ok(dead.maul({...p,x:n.x-50}));if(i<2)step(dead,.44);}
assert.equal(dead.snapshot().npcs[0].state,'fall');step(dead,.8);assert.equal(dead.snapshot().npcs[0].state,'dead');step(dead,12.6);assert.equal(dead.snapshot().npcs[0].state,'idle');assert.equal(dead.snapshot().npcs[0].hp,60);
const hostile=make();hostile.enter('street',[{id:'gang',kind:'gangster',hostile:true,item:'rock',x:350,depth:-65}]);step(hostile,3.1);assert.equal(hostile.snapshot().stats.enemyShots,0,'gangsters chill until pressed or provoked');assert.ok(hostile.provokeGang('gang',p));step(hostile,3.1);assert.ok(hostile.snapshot().stats.enemyShots>0,'provoked gangsters retaliate');assert.ok(hostile.snapshot().hp<100,'hostile projectiles damage the bear');
const riding=make();riding.enter('street',[{id:'gang',kind:'gangster',hostile:true,item:'rock',x:350,depth:-65}]);step(riding,4,{...p,riding:true});assert.equal(riding.snapshot().stats.enemyShots,0,'cycling keeps the original hostile encounter owner');
// Changing clothes must not change the existing patrol speeds or endpoint pauses.
const wardrobe=make();wardrobe.enter('wardrobe',Array.from({length:9},(_,variant)=>({id:'outfit-'+variant,x:variant*2000,variant,patrol:true})));
step(wardrobe,5);let dressed=wardrobe.snapshot().npcs;
assert.deepEqual(dressed.map(n=>n.variant),[0,1,2,3,4,5,6,7,8]);
for(let i=3;i<9;i++)assert.ok(Math.abs((dressed[i].x-dressed[i].home)-(dressed[i%3].x-dressed[i%3].home))<1e-8,'outfit selection preserves the original three patrol timings');
const timed=make();timed.enter('timed',[{id:'timed',x:0,variant:8,patrolVariant:0,patrol:true}]);step(timed,5);
assert.ok(Math.abs(timed.snapshot().npcs[0].x-(dressed[0].x-dressed[0].home))<1e-8,'an explicit patrol timing survives a different appearance');
const c=make();c.enter('practice',[{id:'a',x:60,depth:0},{id:'b',x:70,depth:0},{id:'c',x:80,depth:0}]);assert.ok(c.grab(p));assert.ok(c.throwAtScreen(p));assert.equal(c.snapshot().phase,'apex');
assert.ok(c.maul(p));assert.equal(c.maul(p),false);step(c,.44);assert.ok(c.maul(p));step(c,.44);assert.ok(c.grab(p));assert.ok(c.throwAtScreen(p));assert.equal(c.snapshot().phase,'madness');
const hp=c.snapshot().hp;assert.equal(c.hit(99),false);step(c,8.1);assert.ok(c.snapshot().stats.frenzyMauls>0);assert.equal(c.snapshot().phase,'cute');assert.equal(c.snapshot().heat,0);assert.equal(c.hit(8),true);assert.equal(c.snapshot().hp,hp-8);
step(c,6);assert.equal(c.snapshot().baby,null);const snap=c.snapshot();snap.npcs.length=0;assert.ok(c.snapshot().npcs.length>0);
const ko=make();assert.ok(ko.hit(100));step(ko,.7);assert.equal(ko.snapshot().hp,0);assert.equal(ko.snapshot().baby.position,'back');assert.ok(ko.snapshot().defeatAge>.65,'bear defeat is animated before respawn');ko.recover();assert.equal(ko.snapshot().hp,100);
console.log('Brawler checks passed: persistent residents, witness aggression, hostile throws, staged screen impact, damage/death/recovery, attached baby and timed Apex/Madness states.');
