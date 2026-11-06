/* Shared source/centrum worker lifecycle and geometry-family isolation. Actual
   pixels/likeness/performance are verified separately in browser evidence. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
class FakeWorker{
 constructor(){this.messages=[];this.closed=false;}
 postMessage(message){this.messages.push(message);if(message.type==='init')queueMicrotask(()=>this.onmessage({data:{type:'ready'}}));}
 complete(){const m=this.messages.find(x=>x.type==='frame'&&!x.done);assert(m);m.done=true;this.onmessage({data:{type:'frame',id:m.id,workerMs:1,bitmap:{close(){this.closed=true;}},frame:{width:20,height:20,left:0,top:0,gait:m.job.gait,weight:m.job.weight,attribution:{}}}});}
 terminate(){this.closed=true;}
}
(async()=>{
 const world={window:{},performance,setTimeout,clearTimeout};vm.runInNewContext(fs.readFileSync('js/centrum-hero-cache.js','utf8'),world);const api=world.window.BearlyCentrumHeroCache,w=new FakeWorker(),frames=new Map();let bytes=0;
 const manager=await api.create({workerFactory:()=>w,cloneSource:()=>Promise.resolve({close(){}}),lower:[],upper:[],images:{},cache:{frames,limitFrames:6,limitBytes:9600,bytes:()=>bytes,add:f=>bytes+=f.width*f.height*4,drop:f=>{f.disposed=true;f.image.close();bytes-=f.width*f.height*4;}}});
 const job=(family,phase=0,weight=0)=>({key:family+':'+phase+':'+weight,name:'front',heading:'horizontal',idle:weight===0,steady:weight===1,weight,gait:{phase,...(family==='square'?{centrumWalk:true}:{})},profile:{image:'front'}});
 const nativeIdle=job('native'),squareIdle=job('square'),ni=manager.ensure(nativeIdle);w.complete();const N=await ni;
 const si=manager.ensure(squareIdle);w.complete();const S=await si;assert.notEqual(N,S);assert.equal(N.centrum.family,'native');assert.equal(S.centrum.family,'square');assert.equal(manager.get(nativeIdle),N);assert.equal(manager.get(squareIdle),S);
 const sq=job('square',.25,1),sqP=manager.ensure(sq);w.complete();const SQ=await sqP;
 const nat=job('native',.25,1);assert.equal(manager.get(nat),N,'source walk cannot borrow nearby square geometry');w.complete();const NAT=manager.get(nat);assert.notEqual(NAT,SQ);assert.equal(NAT.centrum.family,'native');
 assert.equal(manager.get(job('square',.28,1)),SQ,'square walk cannot borrow nearer native geometry');w.complete();
 for(let i=0;i<16;i++){const task=manager.ensure(job(i%2?'native':'square',i/17,1));w.complete();await task;assert(frames.size<=6&&bytes<=9600);}
 assert([...frames.values()].includes(N)&&[...frames.values()].includes(S),'both original families keep their correct idle inside the hard budget');assert.equal(manager.stats().maxPending,1);assert.equal(manager.stats().maxQueued,0);manager.close();
 // Run the real Hero preparation APIs with a fake transport. The source
 // preparation and job generation are real; no renderer state is fabricated.
 const jobs=[];let creations=0,support=true;
 function context(){return new Proxy({draws:[],globalAlpha:1},{get(o,k){if(k==='getImageData')return(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)});if(k==='drawImage')return(...a)=>o.draws.push(a);return k in o?o[k]:()=>{};},set(o,k,v){o[k]=v;return true;}});}
 const win={setTimeout:(fn)=>setTimeout(fn,0),clearTimeout,BearlyCentrumHeroCache:{supported:()=>support,create:async options=>{creations++;assert.equal(options.cache.limitFrames,98);assert.equal(options.cache.limitBytes,32*1024*1024);return{available:()=>true,ensure:async j=>{jobs.push(j);return{};},stats:()=>({ready:true}),close(){}};}}};
 const sandbox={window:win,Image:class{naturalWidth=2400;naturalHeight=2400;},Uint8ClampedArray,document:{createElement:()=>({width:0,height:0,dataset:{},getContext:()=>context()})},Path2D:class{moveTo(){}quadraticCurveTo(){}lineTo(){}closePath(){}}};
 for(const n of ['locomotion','centrum-depth-gait','baby-passenger','hero-rig'])vm.runInNewContext(fs.readFileSync('js/'+n+'.js','utf8'),sandbox);
 const rig=win.BearlyHeroRig,route=rig.prepareRouteCache(),square=rig.prepareCentrumCache();assert.equal(rig.prepareRouteCache(),route);assert.equal(rig.prepareCentrumCache(),square);assert(await route);assert(await square);assert.equal(creations,1,'source and Centrum create one shared worker manager');assert.equal(jobs.length,100,'two idle carriers and48 front phases prepared for each family');
 const families=jobs.map(j=>j.gait.centrumWalk?'square':j.gait.sourceWalk?'route':'native');assert(families.slice(0,50).every(f=>f==='route')&&families.slice(50).every(f=>f==='square'),'family warmups serialize instead of superseding each other');
 for(const j of jobs.filter(j=>!j.gait.centrumWalk)){
  assert(j.gait.sourceWalk,'the route warmup opts into the explicit walking repair');
  const original=win.BearlyCentrumDepthGait.projectSource(win.BearlyLocomotion.pose(win.BearlyLocomotion.cycleLength(280)*j.gait.phase,280,j.weight));for(const side of ['near','far'])for(const p of ['x','y','angle','shinAngle','kneeFlex','contactOffset'])assert(Math.abs(j.gait[side][p]-original[side][p])<1e-10,'route geometry matches the same projected source gait used by the live renderer');
 }
 assert.equal(rig.cacheStats().sourceWarmup.prepared,7);assert.equal(rig.cacheStats().sourceWarmup.pending,0);assert.equal(rig.cacheStats().sourceWarmup.foreground,true);
 console.log(JSON.stringify({passed:true,separateGeometryFamilies:true,hardSharedFrameAndByteBudget:true,sourceAndSquareManagerCreations:creations,serialPreparedJobs:jobs.length,sourceGeometryJobs:50,squareGeometryJobs:50,sourcePreparationOnce:true,sourceStrideScale:win.BearlyCentrumDepthGait.sourceStrideScale}));
})().catch(e=>{console.error(e);process.exitCode=1;});
