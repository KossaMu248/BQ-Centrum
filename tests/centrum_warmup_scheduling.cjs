/* Execute the actual source-preparation scheduler against a deterministic clock. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('js/hero-rig.js','utf8'),start=source.indexOf('  let sourceWarmupPromise='),end=source.indexOf('  function cacheStats()',start);assert(start>0&&end>start);
const scheduler=source.slice(start,end),tick=()=>new Promise(resolve=>setImmediate(resolve));
function harness({idle=true,failIndex=null}={}){
 let serial=0,failed=false;const idles=new Map(),timers=new Map(),calls=[],cancelled=[];
 const window={setTimeout(fn,delay){const id=++serial;timers.set(id,{fn,delay});return id;},clearTimeout(id){cancelled.push(['timer',id]);timers.delete(id);}};
 if(idle){window.requestIdleCallback=(fn,options)=>{const id=++serial;idles.set(id,{fn,options});return id;};window.cancelIdleCallback=id=>{cancelled.push(['idle',id]);idles.delete(id);};}
 const context={window,preload:()=>Promise.resolve(),lowerKeys:Array.from({length:5},(_,i)=>i),profiles:{front:{},back:{}},prepareLower(index){if(index===failIndex&&!failed){failed=true;throw Error('temporary prepared-source failure');}calls.push(index);},upperSource(profile,name){calls.push(name);},bodyNow:()=>calls.length};
 vm.createContext(context);vm.runInContext(scheduler+';this.warm=warmupSources;this.stats=()=>({done:sourceWarmupDone,pending:sourceWarmupPending,foreground:sourceWarmupForeground,failure:sourceWarmupFailure,retries:sourceWarmupRetries});',context);
 function run(map){const [id,job]=map.entries().next().value||[];assert(id,'missing scheduled callback');map.delete(id);job.fn({timeRemaining:()=>0,didTimeout:true});}
 return{context,idles,timers,calls,cancelled,runIdle(){run(idles);},runTimer(){run(timers);}};
}
(async()=>{
 const bg=harness(),p=bg.context.warm();assert.equal(bg.context.warm(),p);await tick();assert.equal(bg.idles.size,1);assert.equal(bg.timers.size,0);
 for(let n=0;n<7;n++){assert.equal(bg.idles.size,1);assert.equal(bg.idles.values().next().value.options.timeout,1000);bg.runIdle();}
 await p;assert.deepEqual(bg.calls,[0,1,2,3,4,'front','back']);assert.equal(bg.context.stats().done,7);assert.equal(bg.context.stats().pending,null);assert.equal(bg.idles.size,0);
 const urgent=harness(),up=urgent.context.warm();await tick();urgent.runIdle();urgent.runIdle();
 const stale=urgent.idles.values().next().value.fn;const promoted=urgent.context.warm({foreground:true});assert.equal(promoted,up);assert.equal(urgent.idles.size,0);assert.equal(urgent.timers.size,1);assert.equal(urgent.cancelled.length,1);
 for(let i=0;i<20;i++)assert.equal(urgent.context.warm({foreground:true}),up);assert.equal(urgent.timers.size,1,'repeated promotion never queues duplicate tasks');
 stale({timeRemaining:()=>100,didTimeout:false});assert.equal(urgent.calls.length,2,'a cancelled/stale idle callback cannot prepare again');assert.equal(urgent.timers.size,1);
 while(urgent.timers.size){assert.equal(urgent.timers.size,1);assert.equal(urgent.timers.values().next().value.delay,0);urgent.runTimer();}await up;
 assert.deepEqual(urgent.calls,[0,1,2,3,4,'front','back']);assert.equal(urgent.context.stats().done,7);assert.equal(urgent.context.stats().pending,null);await urgent.context.warm({foreground:true});assert.equal(urgent.timers.size,0);
 const fail=harness({failIndex:2}),fp=fail.context.warm();fp.catch(()=>{});await tick();fail.runIdle();fail.runIdle();fail.runIdle();await assert.rejects(fp,/temporary prepared-source failure/);assert.equal(fail.context.stats().done,2);assert.equal(fail.context.warm(),fp,'ordinary caller retains prior memoized failure');
 const retry=fail.context.warm({foreground:true});assert.notEqual(retry,fp);await tick();while(fail.timers.size)fail.runTimer();await retry;assert.deepEqual(fail.calls,[0,1,2,3,4,'front','back'],'retry does not repeat already prepared pieces');assert.equal(fail.context.stats().retries,1);assert.equal(fail.context.stats().failure,null);
 const fallback=harness({idle:false}),fallbackPromise=fallback.context.warm();await tick();while(fallback.timers.size){assert.equal(fallback.timers.size,1);assert.equal(fallback.timers.values().next().value.delay,32);fallback.runTimer();}await fallbackPromise;assert.equal(fallback.calls.length,7);
 console.log('PASS: native idle/32ms scheduling; seven once-only tasks; foreground coalescing and cancel/stale guards; bounded pending work; partial failure resumes remaining tasks on explicit retry; no added RAF or listeners.');
})().catch(error=>{console.error(error);process.exitCode=1;});
