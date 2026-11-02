/* Graph, named entrances, body-clear approach and gate footprint checks. */
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const context=vm.createContext({window:{}});
for(const name of ['centrum-scenes','centrum-square-world'])vm.runInContext(fs.readFileSync(`js/${name}.js`,'utf8'),context);
const {BearlyCentrumScenes:scenes,BearlyCentrumSquareWorld:world}=context.window;
assert.equal(scenes.all().length,5);
for(const scene of scenes.all()){
  assert.equal(scene.heroHeight,200);
  assert.ok(scene.occlusionLayers.length);
  for(const [id,a] of Object.entries(scene.anchors)){
    assert.ok(a.face===1||a.face===-1,`${scene.id}.${id} arrival facing`);
    assert.equal(world.blocked(a.x,a.y,22,12,scene.id),false,`${scene.id}.${id} safe arrival`);
  }
  for(const e of scene.exits){
    const destination=scenes.get(e.toScene);
    assert.ok(destination?.anchors[e.toEntrance],`${scene.id}.${e.id} target anchor`);
    assert.equal(world.blocked(e.x,e.y,22,12,scene.id),false,`${scene.id}.${e.id} approach point`);
    assert.equal(world.approach(scene.id,e.x,e.y+20,e),true,`${e.id} nearby unobstructed approach`);
    assert.equal(world.approach(scene.id,e.x,e.y+e.radius+20,e),false,`${e.id} matching X alone is insufficient`);
  }
}
assert.equal(world.approach('metro-square',500,650,{x:500,y:520,radius:160}),false,'west bench interrupts approach segment');
assert.equal(world.move(500,650,0,-180,'metro-square').y>=592,true,'sweep stops at bench including body radius');
assert.equal(world.move(996,610,0,-100,'shopping-arcade').y>=562,true,'painted passage jamb has a grounded solid footprint');
assert.ok(world.move(1060,610,0,-100,'shopping-arcade').y<530,'the passage opening remains clear');
assert.deepEqual(JSON.parse(JSON.stringify(scenes.get('shopping-arcade').anchors['from-courtyard'])),{x:1048,y:586,face:-1},'named return lands on the clear approach');
for(const [id,x,y,leftX] of [['metro-square',1360,820,1300],['service-courtyard',1025,650,965]]){
  const closed=world.move(x,y,0,-80,id,{gateOpened:false});
  const opened=world.move(x,y,0,-80,id,{gateOpened:true});
  assert.ok(closed.y>opened.y+30,`${id} closed gate solid; opening removes leaf`);
  assert.equal(world.blocked(leftX,id==='metro-square'?790:620,22,12,id,{gateOpened:true}),true,`${id} posts remain solid`);
}
const reached=new Set(['metro-square']),queue=['metro-square'];
while(queue.length){const id=queue.shift();for(const e of scenes.get(id).exits)if(!reached.has(e.toScene)){reached.add(e.toScene);queue.push(e.toScene);}}
assert.equal(reached.size,5,'all five compact scenes connected');
console.log('PASS: scene graph, named safe entrances/facing, occlusion data, body-clear proximity, furniture sweep and closed/open gate/post footprints.');
