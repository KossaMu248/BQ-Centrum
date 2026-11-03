/* Bounded async queue/cache contracts; real source raster equivalence is browser QA. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const sandbox={window:{},performance,Date,setTimeout,clearTimeout,queueMicrotask};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('js/centrum-hero-cache.js','utf8'),sandbox);
const api=sandbox.window.BearlyCentrumHeroCache;
class FakeWorker{
 constructor(){this.messages=[];this.terminated=0;}
 postMessage(message){this.messages.push(message);if(message.type==='init')queueMicrotask(()=>this.onmessage({data:{type:'ready'}}));}
 complete(){const message=this.messages.find(m=>m.type==='frame'&&!m.done);assert(message,'no pending worker message');message.done=true;
  const job=message.job,bitmap={closed:false,close(){this.closed=true;}};
  this.onmessage({data:{type:'frame',id:message.id,bitmap,workerMs:2,frame:{width:20,height:20,left:-10,top:-20,gait:job.gait,weight:job.weight,rendered:{},attribution:{sourceAsset:'front-carrier-v7.png'}}}});return bitmap;
 }
 terminate(){this.terminated++;}
}
(async()=>{
 const worker=new FakeWorker(),frames=new Map();let bytes=0,dropped=0;
 const controller=await api.create({workerFactory:()=>worker,cloneSource:()=>Promise.resolve({close(){}}),lower:[],upper:[],images:{},cache:{frames,limitFrames:4,limitBytes:6400,bytes:()=>bytes,
  add:frame=>{bytes+=frame.width*frame.height*4;},drop:frame=>{frame.disposed=true;frame.image.close();bytes-=frame.width*frame.height*4;dropped++;}}});
 const job=(key,phase=.25,weight=1,heading='up')=>({key,name:'front',heading,gait:{phase,groundMotion:{x:0,y:-1}},weight,steady:weight>=.999,idle:weight<=.0001,profile:{image:'front'}});
 const idle=job('front:idle',0,0,'idle');let promise=controller.ensure(idle);worker.complete();const nativeIdle=await promise;
 assert.equal(nativeIdle.weight,0);assert.equal(nativeIdle.image.dataset.sourceAsset,'front-carrier-v7.png');
 const first=job('up:.25',.25,.8),second=job('up:.30',.30,.8),latest=job('down:.4',.4,1,'down');
 assert.equal(controller.get(first),nativeIdle,'unseen heading uses native idle');
 const cancelled=controller.ensure(second);assert.equal(controller.get(latest),nativeIdle,'another heading never reuses an up body');
 assert.equal(await cancelled,null,'superseded queued wait resolves');
 assert.equal(controller.stats().pending,1);assert.equal(controller.stats().queued,1);
 worker.complete();worker.complete();
 const down=controller.get(latest);assert.equal(down.gait.phase,.4);assert.equal(down.weight,1);assert.equal(down.centrum.heading,'down');
 const lag=controller.get(job('down:.42',.42,.9,'down'));
 assert.equal(lag,down);assert.equal(lag.weight,1,'returned body keeps its actual weight');assert.equal(lag.gait.phase,.4,'returned body keeps its actual phase');
 worker.complete();
 for(let i=0;i<7;i++){promise=controller.ensure(job('steady:'+i,i/8,1,'up'));worker.complete();await promise;assert(frames.size<=4);assert(bytes<=6400);}
 assert([...frames.values()].includes(nativeIdle),'native idle remains inside shared budget');
 assert(dropped>0);assert.equal(controller.stats().maxPending,1);assert.equal(controller.stats().maxQueued,1);
 assert.equal(controller.stats().completed,11);assert.equal(controller.stats().workerBuildMs,22);
 assert.equal(controller.available(),true);worker.onerror({message:'test worker failure'});assert.equal(controller.available(),false);
 assert.equal(await controller.ensure(job('after-failure')),null,'failure never leaves waiters hanging');controller.close();
 assert.equal(controller.stats().pending,0);assert.equal(controller.stats().queued,0);
 console.log('PASS: exact frame metadata, native idle/same-heading fallback, latest-only queue, bounded shared cache, disposal and failure recovery');
})().catch(error=>{console.error(error);process.exitCode=1;});
