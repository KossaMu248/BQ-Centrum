'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/centrum-inventory.js'),'utf8'),sandbox);
const create=sandbox.window.BearlyCentrumInventory.createActionController;
function fixture(health=50,food=2){
  const c={active:true,mode:'centrum',sceneId:'metro-square',health,speed:0,jump:0,grounded:true,danger:false,combat:false,transition:false,paused:false,position:{x:100,y:320}};
  const save={inventory:{billys:food},wallet:{kr:40},session:{health}},calls=[];
  const api={context:()=>c,snapshot:()=>save,commitEat:(id,expectedHealth)=>{
    calls.push({id,expectedHealth});
    if(c.health!==expectedHealth||c.health<=0||c.health>=100||save.inventory.billys<1)return {ok:false,reason:'State changed.'};
    const healed=Math.min(20,100-c.health);save.inventory.billys--;c.health+=healed;save.session.health=c.health;return {ok:true,healed};
  }};
  return {c,save,calls,api,controller:create(api)};
}
const finish=c=>{for(let i=0;i<20;i++)c.update(.1);};
{
  const f=fixture();const start=f.controller.begin();assert.equal(start.ok,true);assert.equal(f.controller.begin().ok,false);
  for(let i=0;i<11;i++)f.controller.update(.1);
  assert.equal(f.calls.length,0,'no healing while the eating action is incomplete');assert.equal(f.save.inventory.billys,2);
  finish(f.controller);assert.equal(f.calls.length,1);assert.equal(f.calls[0].expectedHealth,50);
  assert.equal(f.c.health,70);assert.equal(f.save.inventory.billys,1);assert.equal(f.save.wallet.kr,40);
  assert.equal(f.controller.audit().lastOutcome.status,'completed');finish(f.controller);assert.equal(f.calls.length,1,'duplicate updates cannot complete twice');
}
{
  const f=fixture(95,1);assert.equal(f.controller.begin().ok,true);finish(f.controller);assert.equal(f.c.health,100);assert.equal(f.save.inventory.billys,0);
  assert.equal(f.controller.audit().lastOutcome.healed,5,'health is capped at the fifth heart');
}
const unavailable=[
  ['full health',f=>f.c.health=100],['dead',f=>f.c.health=0],['empty bag',f=>f.save.inventory.billys=0],
  ['moving',f=>f.c.speed=1],['jumping',f=>f.c.jump=2],['airborne',f=>f.c.grounded=false],
  ['combat',f=>f.c.combat=true],['danger',f=>f.c.danger=true],['pause',f=>f.c.paused=true],
  ['transition',f=>f.c.transition=true],['dialogue',f=>f.c.dialogue=true],['map',f=>f.c.mapOpen=true],['inactive',f=>f.c.active=false]
];
for(const [label,change] of unavailable){
  const f=fixture();change(f);assert.equal(f.controller.begin().ok,false,label+' blocks starting');assert.equal(f.calls.length,0,label+' has no transaction');
}
const interruptions=[
  ...unavailable.filter(([label])=>!['full health','empty bag','inactive'].includes(label)),
  ['damage',f=>f.c.health-=1],['healed elsewhere',f=>f.c.health+=1],['mode changed',f=>f.c.mode='riding'],
  ['scene changed',f=>f.c.sceneId='shopping-arcade'],['warp',f=>f.c.position={x:115,y:320}],['food changed',f=>f.save.inventory.billys++]
];
for(const [label,change] of interruptions){
  const f=fixture();assert.equal(f.controller.begin().ok,true);f.controller.update(.5);change(f);const health=f.c.health,food=f.save.inventory.billys;
  finish(f.controller);assert.equal(f.calls.length,0,label+' interrupts before commit');assert.equal(f.c.health,health,label+' grants no healing');assert.equal(f.save.inventory.billys,food,label+' loses no food');
  assert.equal(f.controller.audit().lastOutcome.status,'cancelled',label+' is reported');
}
{
  const f=fixture();f.controller.begin();assert.equal(f.controller.cancel(),true);assert.equal(f.controller.cancel(),false);finish(f.controller);
  assert.equal(f.calls.length,0);assert.equal(f.save.inventory.billys,2);assert.equal(f.c.health,50);
  const first=f.controller.audit().lastOutcome.id;f.controller.begin();const second=f.controller.audit().eating.id;assert.notEqual(first,second,'new action IDs are unique');
  const reloaded=create(f.api);finish(reloaded);assert.equal(reloaded.audit().eating,null);assert.equal(f.calls.length,0,'reload does not resume an unfinished meal');
}
{
  const f=fixture();f.api.commitEat=()=>{throw Error('disk full');};f.controller.begin();finish(f.controller);
  assert.equal(f.c.health,50);assert.equal(f.save.inventory.billys,2);assert.equal(f.controller.audit().lastOutcome.status,'cancelled','failed persistence is not shown as success');
}
{
  const f=fixture();f.api.commitEat=()=>({ok:false,reason:'Stale health.'});f.controller.begin();finish(f.controller);
  assert.equal(f.controller.audit().lastOutcome.reason,'Stale health.');assert.equal(f.c.health,50);assert.equal(f.save.inventory.billys,2);
}
console.log('centrum inventory action checks passed');
