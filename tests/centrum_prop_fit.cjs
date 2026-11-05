/* Real NPC source metadata + production seating/street-routine code, mocked Canvas.
   Numeric submitted transforms are separate from real gameplay/visual review. */
'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),vm=require('node:vm');
const source={npc:fs.readFileSync('js/npc-motion.js','utf8'),life:fs.readFileSync('js/street-life.js','utf8'),neighbourhood:fs.readFileSync('js/illustrated-neighbourhood.js','utf8'),brawler:fs.readFileSync('js/brawler.js','utf8')};
const manifest=JSON.parse(fs.readFileSync('assets/cache/actors-v19-manifest.json','utf8'));
for(const [name,hash]of Object.entries(manifest.sourceSHA256))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(name)).digest('hex'),hash,'original character/prop ownership art is unchanged: '+name);
const close=(a,b,tolerance=1e-7)=>assert(Math.abs(a-b)<=tolerance,`${a} differs from ${b}`),plain=x=>JSON.parse(JSON.stringify(x));
const multiply=(m,n)=>[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];
class Context{
 constructor(){this.m=[1,0,0,1,0,0];this.stack=[];this.draws=[];this.globalAlpha=1;}
 save(){this.stack.push({m:[...this.m],alpha:this.globalAlpha});}restore(){const entry=this.stack.pop();assert(entry);this.m=entry.m;this.globalAlpha=entry.alpha;}
 translate(x,y){this.m=multiply(this.m,[1,0,0,1,x,y]);}scale(x,y){this.m=multiply(this.m,[x,0,0,y,0,0]);}rotate(a){this.m=multiply(this.m,[Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]);}
 drawImage(image,...args){this.draws.push({image,args,m:[...this.m]});}
 beginPath(){}rect(){}clip(){}moveTo(){}lineTo(){}stroke(){}ellipse(){}fill(){}fillText(){}bezierCurveTo(){}
 getImageData(){throw Error('Seating must not trigger runtime pixel readback');}
}
async function load(npcCode=source.npc,lifeCode=source.life){
 const counts={canvases:0,timers:0,workers:0};const propDraws=[];
 const makeCanvas=()=>{counts.canvases++;const c={width:0,height:0,dataset:{},context:new Context()};c.getContext=()=>c.context;return c;};
 class ImageMock{constructor(){this.naturalWidth=0;this.naturalHeight=0;}set src(value){this.url=value;this.naturalWidth=2048;this.naturalHeight=1536;queueMicrotask(()=>this.onload?.());}get src(){return this.url||'';}decode(){return Promise.resolve();}}
 const window={BearlyStreetProps:{ready:()=>true,draw:(...args)=>{propDraws.push(args);return true;}}};
 const context=vm.createContext({window,document:{createElement:kind=>{assert.equal(kind,'canvas');return makeCanvas();}},Image:ImageMock,fetch:()=>Promise.resolve({ok:true,json:()=>Promise.resolve(manifest)}),performance:{now:()=>0},setTimeout:()=>{counts.timers++;throw Error('No seating/bank bake timers');},clearTimeout(){},queueMicrotask,URL:{createObjectURL(){throw Error('No worker for seating');}},Blob:class{},Worker:class{constructor(){counts.workers++;throw Error('No worker for seating');}}});
 for(const code of [npcCode,source.neighbourhood,lifeCode,source.brawler])vm.runInContext(code,context);
 await window.BearlyNpcMotion.loaded;await Promise.resolve();
 assert(window.BearlyNpcMotion.ready());
 return{window,counts,propDraws};
}
function tilePoint(draw,frame,x,y){
 const [dx,dy,w,h]=draw.args,local={x:dx+(x-frame.rect[0])*w/draw.image.width,y:dy+(y-frame.rect[1])*h/draw.image.height},m=draw.m;
 return{x:m[0]*local.x+m[2]*local.y+m[4],y:m[1]*local.x+m[3]*local.y+m[5]};
}
async function contract(npcCode=source.npc,lifeCode=source.life){
 const {window,counts,propDraws}=await load(npcCode,lifeCode),npc=window.BearlyNpcMotion,life=window.BearlyStreetLife;
 const initialFrames=plain(npc.frames()),initialCanvases=counts.canvases;
 const seeds=life.seeds(window.BearlyNeighbourhood.scenes,42000,12),audit=plain(life.audit()),benches=audit.props.filter(p=>p.kind==='bench'),props=new Map(audit.props.map(p=>[p.id,p]));
 assert.equal(benches.length,12,'two promenade benches plus ten original later-stop benches');
 const report={scope:'Production VM/original source metadata; mocked Canvas, not visual acceptance',seatedTransformCases:0,opaqueSoleBounds:0,maximumSoleFloorError:0,legacyAndMalformedPanCases:0,benchProps:benches.length,benchRestAssociations:0,smokingAssociations:0};
 const groundAt=x=>410+x*.003;
 for(const bench of benches){
  close(bench.width,140);close(bench.seatHeight,35*140/180);close(bench.seatPan.front,27.5*140/180);close(bench.seatPan.rear,39.5*140/180);close(bench.footprintHalf,77);
  const c=new Context();life.beginFrame();life.drawProp(c,bench,groundAt,8);const submitted=propDraws.at(-1),drawn=life.audit().drawnProps[0];
  assert.equal(submitted[1],'bench');close(submitted[2],bench.x);close(submitted[3],groundAt(bench.x)+bench.depth);close(submitted[4],140);
  close(drawn.seatPanY.front,drawn.foot-bench.seatPan.front);close(drawn.seatPanY.rear,drawn.foot-bench.seatPan.rear);close(drawn.seatY,drawn.foot-bench.seatHeight);
  // The old196/108-width ghost footprint must not reserve now-empty space.
  assert(life.overlaps(bench.x+76));assert(!life.overlaps(bench.x+80));
 }
 for(const bin of audit.props.filter(p=>p.kind==='bin')){
  life.beginFrame();life.drawProp(new Context(),bin,groundAt,8);const submitted=propDraws.at(-1),drawn=life.audit().drawnProps[0];
  assert.equal(submitted[1],'bin');close(submitted[4],68);close(drawn.foot,groundAt(bin.x)+bin.depth);assert.equal(drawn.seatY,null);assert.equal(drawn.seatPanY,null,'non-seating props never invent a seat or NaN');
 }
 for(const seed of seeds)for(const spot of seed.restSpots||[]){
  if(['bench','newspaper'].includes(spot.kind)){
   const prop=props.get(spot.id);assert(prop&&prop.kind==='bench');assert.equal(spot.propKind,'bench');close(spot.propX,prop.x);close(spot.x,prop.x);close(spot.depth,prop.depth);assert.deepEqual(plain(spot.seatPan),prop.seatPan);report.benchRestAssociations++;
  }else if(spot.kind==='smoke'){
   const prop=props.get(spot.id);assert(prop&&prop.kind==='bin');assert.equal(spot.propKind,'bin');close(spot.propX,prop.x);close(spot.x,prop.x-70);close(spot.depth,prop.depth);report.smokingAssociations++;
  }
 }
 assert.equal(report.benchRestAssociations,14);assert.equal(report.smokingAssociations,11);
 const smoker=seeds.find(n=>n.id==='civilian-smoker');close(smoker.x,smoker.restSpots.find(s=>s.kind==='smoke').x);
 const simulation=window.BearlyBrawler.create();simulation.enter('street',seeds);
 const seatedIds=seeds.filter(n=>(n.restSpots||[]).some(s=>['bench','newspaper'].includes(s.kind)&&Math.abs(s.x-n.x)<4)).map(n=>n.id);
 assert.equal(seatedIds.length,12);
 for(const id of seatedIds){const n=simulation.lookup(id);assert(n.active?['sit','read'].includes(n.activity):n.activity==='offstage','existing schedules may keep later residents offstage');assert.deepEqual(plain(n.activityProp.seatPan),props.get(n.activityProp.id).seatPan);}
 assert.equal(simulation.lookup('civilian-smoker').activity,'smoke');close(simulation.lookup('civilian-smoker').x,props.get('promenade-smoke').x-70);
 const sharedSeat=benches[0];
 for(const variant of [9,10,11])for(const pose of ['sit','read'])for(const height of [127.6,128])for(const face of [-1,1])for(const time of [0,.5,1,8,14,63,300]){
  const c=new Context(),floor=groundAt(sharedSeat.x)+sharedSeat.depth,n={id:'seat-contract',variant,state:'idle',civilian:true,activity:pose,face,age:time,hp:60,activityProp:sharedSeat};
  assert(npc.draw(c,n,sharedSeat.x,floor,height,1,{authoredWalk:true}));assert.equal(c.draws.length,1,'one complete original pose');assert.equal(c.stack.length,0);
  const frame=npc.frame(variant,pose),original=manifest.npcSources.flatMap(p=>p.frames).find(f=>f.variant===variant&&f.pose===pose),draw=c.draws[0],a=npc.audit();
  assert.deepEqual(plain(frame.seatPivot),original.seatPivot);close(frame.stature,original.stature);assert.equal(frame.source,original.source);assert.equal(draw.image.dataset.sourcePose,pose);assert.equal(draw.image.dataset.sourceVariant,String(variant));
  close(draw.args[2]/draw.image.width,a.height/original.stature);close(draw.args[3]/draw.image.height,a.height/original.stature);
  const hip=tilePoint(draw,frame,...frame.seatPivot);
  close(hip.x,sharedSeat.x);assert(hip.y>=floor-sharedSeat.seatPan.rear-1e-7&&hip.y<=floor-sharedSeat.seatPan.front+1e-7,'submitted posterior contacts the actual painted seat pan');
  assert.equal(a.details.fitted,true);close(a.details.seatHeight,floor-hip.y);close(Math.hypot(draw.m[0],draw.m[1]),1);assert(Math.abs(Math.hypot(draw.m[2],draw.m[3])-1)<=.0025001,'only existing tiny breathing, no leg stretching');
  // Both opaque bounding-box sole corners include every possible painted sole.
  for(const sx of [frame.core[0],frame.core[0]+frame.core[2]-1]){
   const sole=tilePoint(draw,frame,sx,frame.core[1]+frame.core[3]-1),error=Math.abs(sole.y-floor);assert(error<1,'submitted original sole remains within1worldpixel of the floor, including existing sway');report.maximumSoleFloorError=Math.max(report.maximumSoleFloorError,error);report.opaqueSoleBounds++;
  }
  report.seatedTransformCases++;
 }
 const invalid=[undefined,null,{}, {front:0,rear:30},{front:30,rear:20},{front:'21',rear:31},{front:21,rear:Infinity},{front:NaN,rear:31}];
 for(const seatPan of invalid)for(const explicitHeight of [undefined,38]){
  const c=new Context(),n={variant:11,state:'idle',civilian:true,activity:'sit',face:-1,age:1,hp:60,activityProp:{seatPan,...(explicitHeight===undefined?{}:{seatHeight:explicitHeight})}};
  npc.draw(c,n,100,400,128,1,{authoredWalk:true});const frame=npc.frame(11,'sit'),hip=tilePoint(c.draws[0],frame,...frame.seatPivot),a=npc.audit();
  assert.equal(a.details.fitted,false);close(hip.x,100);close(hip.y,400-(explicitHeight??128*.84*.29));assert.equal(a.details.seatPan,null);report.legacyAndMalformedPanCases++;
 }
 assert.deepEqual(plain(npc.frames()),initialFrames,'no original pose metadata/pivot/stature changes');assert.equal(counts.canvases,initialCanvases,'no new seating/walk rasters');assert.equal(counts.timers,0);assert.equal(counts.workers,0);const cache=npc.cacheStats();assert.equal(cache.bakes,0);assert.equal(cache.bytes,0);assert.deepEqual(plain(cache.requestedVariants),[]);
 report.passed=true;return report;
}
(async()=>{
 const report=await contract();const mutations=[
  {name:'old oversized196bench',which:'life',from:'benchWidth=140',to:'benchWidth=196'},
  {name:'old fixed38hip',which:'npc',from:'if(fitted)seatHeight=clamp(reach,seatPan.front,seatPan.rear);',to:'if(fitted)seatHeight=38;'},
  {name:'missing smoking offset',which:'life',from:"kind==='smoke'&&p.kind==='bin'?70:0",to:"kind==='smoke'&&p.kind==='bin'?0:0"},
 ];
 report.rejectedMutations=[];
 for(const mutation of mutations){assert(source[mutation.which].includes(mutation.from),'mutation applies to actual production code');const changed=source[mutation.which].replace(mutation.from,mutation.to);await assert.rejects(()=>contract(mutation.which==='npc'?changed:source.npc,mutation.which==='life'?changed:source.life),assert.AssertionError,mutation.name+' must fail the contract');report.rejectedMutations.push(mutation.name);}
 console.log(JSON.stringify(report));
})().catch(error=>{console.error(error);process.exitCode=1;});
