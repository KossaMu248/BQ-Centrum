/* Shared damage and contact-specific visual behavior, independent of gameplay. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const window={};vm.runInNewContext(fs.readFileSync('js/weapon-effects.js','utf8'),{window});
const weapons=window.BearlyWeapons,fx=window.BearlyWeaponEffects;
for(const [kind,hp,hearts]of [['rock',10,.5],['bottle',30,1.5],['molotov',30,1.5],['firecracker',20,1],['dynamite',20,1]]){
  assert.equal(weapons.damage(kind),hp);assert.equal(weapons.hearts(kind),hearts);assert.equal(hp,weapons.heartHP*hearts);
}
assert.equal(weapons.totalHearts*weapons.heartHP,100);
assert.equal(weapons.profile('molotov'),weapons.profile('bottle'));
assert.equal(weapons.profile('dynamite'),weapons.profile('firecracker'));
assert.ok(Object.isFrozen(weapons)&&Object.isFrozen(weapons.table)&&Object.isFrozen(weapons.table.bottle));

function canvas(){
  const trace=[],stack=[],state={globalAlpha:.7,fillStyle:'original',strokeStyle:'original',lineWidth:2,lineCap:'butt',lineJoin:'miter'};
  const context=new Proxy(state,{get(object,key){
    if(key==='save')return()=>{stack.push({...object});trace.push(['save']);};
    if(key==='restore')return()=>{Object.assign(object,stack.pop());trace.push(['restore']);};
    if(key in object)return object[key];
    return(...args)=>trace.push([key,...args.map(v=>typeof v==='number'?Number(v.toFixed(6)):v)]);
  },set(object,key,value){object[key]=value;trace.push([key,typeof value==='number'?Number(value.toFixed(6)):value]);return true;}});
  return {context,trace,state,stack};
}
function render(kind,target,age,reduced=false){
  const c=canvas(),before={...c.state};
  const visible=fx.draw(c.context,{kind,target,age,seed:9},220,140,{reducedMotion:reduced});
  assert.deepEqual(c.state,before,'effect rendering restores the caller canvas state');assert.equal(c.stack.length,0);
  for(const command of c.trace)for(const n of command.slice(1))if(typeof n==='number')assert.ok(Number.isFinite(n));
  return {visible,trace:c.trace,audit:fx.audit()};
}
let cases=0;
for(const kind of ['rock','bottle','firecracker'])for(const target of ['bear','ground'])for(const reduced of [false,true]){
  const life=fx.duration(kind,target);
  assert.equal(render(kind,target,-.01,reduced).visible,false);
  assert.equal(render(kind,target,life,reduced).visible,false);
  for(let n=0;n<16;n++){
    const age=life*n/16,a=render(kind,target,age,reduced),b=render(kind,target,age,reduced);
    assert.ok(a.visible);assert.deepEqual(a.trace,b.trace,'identical age/seed must not depend on render frame count');
    assert.equal(a.audit.weapon,kind);assert.equal(a.audit.target,target);assert.equal(a.audit.duration,life);
    assert.ok(a.audit.flames<=8&&a.audit.sparks<=14&&a.audit.fragments<=10,'per-effect work is bounded');cases++;
  }
  assert.notDeepEqual(render(kind,'bear',.08,reduced).trace,render(kind,'ground',.08,reduced).trace,'bear and road contacts must have different animation');
}
assert.ok(render('bottle','ground',1.4).audit.flames>0,'Molotov visibly burns on the road after its initial splash');
assert.equal(render('bottle','bear',1.4).visible,false,'body flare finishes earlier than the road fire');
assert.equal(render('firecracker','ground',.8).audit.flames,0,'firecracker keeps a pop/smoke identity instead of Molotov flames');
assert.equal(render('rock','ground',.08).audit.sparks,0,'rock impact stays a small chip/dust hit');
for(const kind of ['rock','bottle','firecracker'])for(const target of ['bear','ground']){
  assert.ok(render(kind,target,.1,true).trace.length<render(kind,target,.1,false).trace.length,'reduced motion reduces drawing and travel');
}

const pool=fx.createPool({maxEffects:16});for(let n=0;n<1000;n++)pool.impact(['rock','bottle','firecracker'][n%3],n%2?'bear':'ground',n,n);
assert.equal(pool.stats().count,16);assert.equal(pool.snapshot()[0].id,985,'oldest cosmetic impacts are discarded');
const stateBefore=JSON.stringify(pool.snapshot()),c=canvas();pool.draw(c.context);pool.draw(c.context);
assert.equal(JSON.stringify(pool.snapshot()),stateBefore,'drawing is cosmetic and does not mutate lifetimes or health');
pool.update(2.5);assert.equal(pool.stats().count,0,'all impact particles/residue expire, including Molotov road fire');
const bounded=fx.createPool({maxEffects:1000});for(let i=0;i<100;i++)bounded.impact('molotov','ground',0,0);assert.equal(bounded.stats().count,32);
const one=fx.createPool(),many=fx.createPool();one.impact('bottle','ground',0,0);many.impact('molotov','ground',0,0);one.update(.5);for(let i=0;i<30;i++)many.update(1/60);
assert.ok(Math.abs(one.snapshot()[0].age-many.snapshot()[0].age)<1e-12,'age advances independently of update frequency');
assert.equal(one.snapshot()[0].duration,many.snapshot()[0].duration);
assert.equal(weapons.damage('bottle'),30,'cosmetic fire never modifies configured contact damage');
console.log(JSON.stringify({result:'passed',renderCases:cases,damage:{rock:10,molotov:30,firecracker:20},heartHP:20,maxEffects:32}));
