'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),window={};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/centrum-save.js'),'utf8'),{window});
const api=window.BearlyCentrumSave,KEY='bq-centrum:scene-network:v1';
const ids=['metro-square','shopping-arcade','service-courtyard','food-shop','bicycle-workshop'];
const sceneData=Object.fromEntries(ids.map(id=>[id,{id,floor:{left:0,right:1000,top:200,bottom:800},solids:[{id:'counter',x:450,y:300,w:150,h:70}],anchors:{start:{x:100,y:500,face:1},door:{x:700,y:500,face:-1}}}]));
const scenes={get:id=>sceneData[id]};
const serialize=value=>JSON.parse(JSON.stringify(value));
function memory(seed){
 const data=new Map([['bearBestAutumn','donor-score'],['bearAutumnAdventureV7','donor-adventure']]);
 if(seed!==undefined)data.set(KEY,typeof seed==='string'?seed:JSON.stringify(seed));
 const calls=[];
 return{data,calls,getItem(key){calls.push(['get',key]);return data.get(key)||null;},setItem(key,value){calls.push(['set',key]);data.set(key,value);}};
}
const entry={sceneId:'metro-square',entranceId:'start',x:100,y:500,face:1};
const good={schemaVersion:1,layoutVersion:3,gateOpened:true,discovered:['metro-square','shopping-arcade'],position:{sceneId:'shopping-arcade',entranceId:'door',x:700,y:500,face:-1},inventory:{billys:3}};

// The gate leaf is conditional; its posts remain solid in both states.
sceneData['metro-square'].solids.push(
 {id:'gate-leaf',x:740,y:640,w:100,h:14,gateClosedOnly:true},
 {id:'gate-post',x:855,y:635,w:12,h:35},
);
const inGate={sceneId:'metro-square',entranceId:'start',x:790,y:647,face:1};
const closedGate=api.create(memory({...good,gateOpened:false,position:inGate}),scenes);
assert.deepEqual(serialize(closedGate.loadPosition()),entry,'closed gate rejects a saved leaf position');
const openedGate=api.create(memory({...good,gateOpened:true,position:inGate}),scenes);
assert.deepEqual(serialize(openedGate.loadPosition()),inGate,'opened gate accepts the same saved leaf position');
assert.equal(closedGate.validPosition(inGate),false);
closedGate.openGate();assert.equal(closedGate.validPosition(inGate),true,'unlock changes current-session validation');
for(const gateOpened of [false,true]){
 const inPost={...inGate,x:860,y:650};
 const q=api.create(memory({...good,gateOpened,position:inPost}),scenes);
 assert.deepEqual(serialize(q.loadPosition()),entry,'permanent gate posts always reject saved positions');
}

// Create reads its own key once and does not overwrite a save during parsing.
const storage=memory(),game=api.create(storage,scenes);
assert.deepEqual(storage.calls,[['get',KEY]]);
assert.deepEqual(serialize(game.loadPosition()),entry);
assert.equal(game.snapshot().gateOpened,false);
assert.equal(game.snapshot().inventory.billys,0);
game.discover('shopping-arcade');game.openGate();game.addBilly();
game.setPosition({sceneId:'shopping-arcade',entranceId:'door',x:690,y:510,face:-1});
const saved=serialize(game.snapshot()),reloaded=api.create(storage,scenes);
assert.deepEqual(serialize(reloaded.snapshot()),saved,'position/progress/item count survive reload unchanged');
assert.equal(storage.data.get('bearBestAutumn'),'donor-score');
assert.equal(storage.data.get('bearAutumnAdventureV7'),'donor-adventure');
assert.ok(storage.calls.every(([,key])=>key===KEY),'no legacy reads/writes/clears');

// No caller can mutate the internal snapshot or returned safe position.
const copy=game.snapshot();copy.inventory.billys=88;copy.discovered.length=0;copy.position.x=99999;
assert.equal(game.snapshot().inventory.billys,1);
assert.equal(game.loadPosition().x,690);

const positions=[
 null,{sceneId:'unknown',x:100,y:500,face:1},{sceneId:'__proto__',x:100,y:500,face:1},
 {...entry,x:-1},{...entry,x:Infinity},{...entry,x:'100'},{...entry,y:190},
 {...entry,x:999},{...entry,x:500,y:340},{...entry,x:440,y:340},
 {...entry,face:0},{...entry,face:'1'},{...entry,entranceId:'missing'},
 {...entry,entranceId:'__proto__'},
];
for(const position of positions){
 const save=memory({...good,position});const q=api.create(save,scenes);
 assert.deepEqual(serialize(q.loadPosition()),entry,'unsafe position uses named safe entrance');
 assert.equal(q.snapshot().gateOpened,true);assert.equal(q.snapshot().inventory.billys,3);
 assert.ok(q.snapshot().discovered.includes('shopping-arcade'));
 assert.deepEqual(save.calls,[['get',KEY]],'invalid save is not automatically overwritten');
}
for(const override of [{schemaVersion:0},{layoutVersion:2},{schemaVersion:99}]){
 const q=api.create(memory({...good,...override}),scenes);
 assert.deepEqual(serialize(q.loadPosition()),entry,'incompatible layout/schema invalidates only position');
 assert.equal(q.snapshot().gateOpened,true);assert.equal(q.snapshot().inventory.billys,3);
}
for(const invalid of ['{bad json','null','[]','12'])assert.deepEqual(serialize(api.create(memory(invalid),scenes).loadPosition()),entry);
const sanitized=api.create(memory({...good,gateOpened:'true',discovered:['unknown','__proto__','food-shop','food-shop'],inventory:{billys:1000}}),scenes);
assert.equal(sanitized.snapshot().gateOpened,false);
assert.equal(sanitized.snapshot().inventory.billys,3);
assert.deepEqual(serialize(sanitized.snapshot().discovered),['metro-square','food-shop','shopping-arcade']);
game.addBilly(1000);assert.equal(game.snapshot().inventory.billys,3);
game.addBilly(-2);assert.equal(game.snapshot().inventory.billys,3);
game.discover('__proto__');assert.ok(!game.snapshot().discovered.includes('__proto__'));
game.setPosition({...entry,x:500,y:340});assert.deepEqual(serialize(game.loadPosition()),entry);

// Unavailable browser storage still allows the whole session to play.
const blocked=api.create({getItem(){throw Error('denied');},setItem(){throw Error('denied');}},scenes);
blocked.openGate();blocked.discover('service-courtyard');blocked.addBilly(2);
assert.equal(blocked.snapshot().gateOpened,true);assert.equal(blocked.snapshot().inventory.billys,2);
assert.ok(blocked.snapshot().discovered.includes('service-courtyard'));

// The real authored entrance set must satisfy the save validator too.
const realWindow={};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/centrum-scenes.js'),'utf8'),{window:realWindow});
const realScenes=realWindow.BearlyCentrumScenes,realSave=api.create(null,realScenes);
for(const s of realScenes.all())for(const [entranceId,anchor]of Object.entries(s.anchors)){
 assert.ok(realSave.validPosition({sceneId:s.id,entranceId,...anchor}),`unsafe real entrance ${s.id}.${entranceId}`);
}
const oldPassageArrival={sceneId:'shopping-arcade',entranceId:'from-courtyard',x:985,y:550,face:-1};
assert.equal(realSave.validPosition(oldPassageArrival),false,'old painted-jamb position is now rejected');
const passageRecovery=api.create(memory({...good,position:oldPassageArrival}),realScenes);
assert.deepEqual(serialize(passageRecovery.loadPosition()),{sceneId:'metro-square',entranceId:'start',x:260,y:540,face:1},'an old jamb save uses the existing safe fallback');
assert.equal(passageRecovery.snapshot().inventory.billys,3,'geometry repair preserves saved supplies');
assert.equal(passageRecovery.snapshot().gateOpened,true,'geometry repair preserves shortcut progress');
console.log('PASS: namespaced scene persistence, gate/discovery/inventory continuity, safe named fallback, schema/layout/position validation and denied storage.');
