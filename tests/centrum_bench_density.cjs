/* Actual route furniture/routine definitions, not rendered appearance evidence. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source={bench:fs.readFileSync('js/centrum-street-bench.js','utf8'),life:fs.readFileSync('js/street-life.js','utf8'),neighbourhood:fs.readFileSync('js/illustrated-neighbourhood.js','utf8'),world:fs.readFileSync('js/illustrated-world.js','utf8')};
const plain=value=>JSON.parse(JSON.stringify(value));
function world(lifeCode=source.life,neighbourhoodCode=source.neighbourhood){
 const draws=[],window={BearlyAtlas:{draw(){return true;}},BearlyWorld:{cafe(){},material(){return null;}},BearlyStreetProps:{draw:(...args)=>{draws.push({type:args[1],x:args[2],width:args[4]});return true;},ready:()=>true}};
 const context={window,Image:class{}};for(const code of [source.bench,neighbourhoodCode,lifeCode])vm.runInNewContext(code,context);
 const scenes=window.BearlyNeighbourhood.scenes,seeds=plain(window.BearlyStreetLife.seeds(scenes,42000,12));return{window,scenes,seeds,props:plain(window.BearlyStreetLife.audit().props),draws};
}
function ambient(code=source.world){
 // Execute the actual production furniture loop, keeping bin coordinates and
 // removing only repeated generic bench decoration. Terrain/occlusion are open
 // here so hidden candidates cannot make a repeating bench bug pass by chance.
 const start=code.indexOf('for(let k=Math.floor(lo/670)'),end=code.indexOf('for(let k=Math.floor(lo/2200)',start);assert(start>=0&&end>start,'the tested source furniture section is present');
 const draws=[],window={BearlyStreetLife:{overlaps:()=>false},BearlyStreetProps:{draw:(c,type,x,y,width)=>draws.push({type,x,y,width})}};
 vm.runInNewContext(code.slice(start,end),{lo:0,hi:42000,c:{},s:{time:2},ground:(s,x)=>x>=0&&x<=42000?400:null,frontage:()=>false,window});
 assert(draws.every(d=>d.type==='bin'),'generic repeated route slots never paint benches');
 assert.deepEqual(draws.map(d=>d.x),Array.from({length:21},(_,i)=>520+i*2010),'original bin cadence and world anchors are preserved');
 assert(draws.every(d=>d.width===68&&d.y===316),'bin height/grounding remain unchanged');return draws;
}
const actual=world(),benchIds=actual.props.filter(p=>p.kind==='bench').map(p=>p.id).sort();
assert.deepEqual(benchIds,['promenade-bench-west','promenade-bench-east','library-life-bench','greenhouse-life-bench','boathouse-life-bench'].sort());
const later=actual.scenes.slice(2),seatingKeys=new Set(['library','greenhouse','boathouse']);
const required=['promenade-walker','civilian-reader','civilian-smoker','civilian-bench'];
for(const scene of later){required.push('civilian-'+scene.key,'walker-'+scene.key);if([2,6,10].includes(actual.scenes.indexOf(scene)))required.push('neighbour-'+scene.key);}
assert.deepEqual(actual.seeds.map(n=>n.id).sort(),required.sort(),'sparser furniture retains every authored peaceful resident identity');
let standingReplacements=0;
for(const scene of later){
 const n=actual.seeds.find(n=>n.id==='civilian-'+scene.key),oldCentre=scene.x+scene.w*.5+120;
 assert(n&&n.x===oldCentre&&n.patrol&&n.civilian&&n.hostile!==true);
 assert.equal(n.routeMin,Math.max(100,Math.min(41900,scene.x-650)));assert.equal(n.routeMax,Math.max(100,Math.min(41900,scene.x+1000)));assert(n.schedule);
 const [pause,smoke]=n.restSpots;assert.equal(smoke.kind,'smoke');assert.equal(smoke.id,scene.key+'-life-bin');assert.equal(smoke.x,oldCentre+150);
 if(seatingKeys.has(scene.key))assert(['bench','newspaper'].includes(pause.kind)&&pause.id===scene.key+'-life-bench');
 else{assert.equal(pause.kind,'idle','a removed bench becomes a real standing pause, never floating sitting');assert.equal(pause.id,scene.key+'-life-pause');assert.equal(pause.x,oldCentre);assert(!pause.seatPan,'standing actors do not retain a phantom seat');standingReplacements++;}
}
assert.equal(standingReplacements,7);
ambient();
function cafe(neighbourhoodCode=source.neighbourhood){
 const current=world(source.life,neighbourhoodCode),ctx=new Proxy({},{get:(target,key)=>key in target?target[key]:(()=>{}),set:(target,key,value)=>(target[key]=value,true)});
 current.window.BearlyNeighbourhood.buildings(ctx,{cameraX:34700,W:1160,time:1,reducedMotion:true,groundAt:()=>400,metro:true});
 assert(!current.draws.some(d=>d.type==='bench'),'the cafe does not add another small decorative bench');
}
cafe();
// Reintroduce each independent cause of the old repetition into the actual
// source sections: a bench at every authored stop, repeated generic benches,
// and an extra cafe bench. None can hide behind terrain or frontage culling.
const selection="new Set(['library','greenhouse','boathouse'])";
assert(source.life.includes(selection));
const allStops=source.life.replace(selection,'new Set('+JSON.stringify(later.map(s=>s.key))+')');
assert.throws(()=>assert.equal(world(allStops).props.filter(p=>p.kind==='bench').length,5),assert.AssertionError,'restoring a bench at every later stop fails');
assert(source.world.includes('if(k%3!==0)continue;'));
const repeated=source.world.replace('if(k%3!==0)continue;','').replace("draw(c,'bin',x,y-84,width,s.time)","draw(c,k%3===0?'bin':'bench',x,y-84,width,s.time)");
assert.throws(()=>ambient(repeated),assert.AssertionError,'restoring generic route benches fails');
assert(source.neighbourhood.includes("if(b.role==='cafe'){"));
const extraCafe=source.neighbourhood.replace("if(b.role==='cafe'){","if(b.role==='cafe'){window.BearlyStreetProps.draw(c,'bench',b.x+b.w*.65,foot+18,82,s.time);");
assert.throws(()=>cafe(extraCafe),assert.AssertionError,'restoring the extra cafe bench fails');
console.log(JSON.stringify({passed:true,authoredBenchCount:benchIds.length,benchIds,peacefulResidentsRetained:required.length,standingReplacements,genericRouteBenches:0,originalGenericBins:21,cafeBench:0,rejectedDensityRegressions:3,scope:'Production VM route data and actual painter-loop submissions; no pixel/gameplay claim'}));
