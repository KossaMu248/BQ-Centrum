/* Optional source-rig raster cache. One worker, one active job and one latest job;
   no simulation, animation timer, input listener or replacement artwork. */
(() => {
  'use strict';
  const now=()=>typeof performance==='object'?performance.now():Date.now();
  function workerEnvironment(){
    'use strict';
    const BODY_HEIGHT=280,LOWER_HEIGHT=190,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
    const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
    const bodyNow=()=>performance.now(),lowerPrepared=new Map(),upperPrepared=new Map(),bodyScratch=new Map();
    let images={},bodyBuildMs=0,maxBodyBuildMs=0,transientBuilds=0,bodyBitmaps=0,bitmapFailures=0;
    const window={},output=new OffscreenCanvas(1,1);
    output.dataset={};
    const document={createElement:name=>{if(name!=='canvas')throw Error('Unsupported source element');return output;}};
    function prepareLower(index){const result=lowerPrepared.get(index);if(!result)throw Error('Missing prepared lower source '+index);return result;}
    function upperSource(profile,name){const result=upperPrepared.get(name);if(!result)throw Error('Missing prepared upper source '+name);return result;}
    /* SOURCE_RIG_FUNCTIONS */
    self.onmessage=event=>{
      const message=event.data;
      try{
        if(message.type==='init'){
          if(!output.getContext('2d'))throw Error('Worker 2D canvas unavailable');
          images=message.images;
          for(const item of message.lower){const {index,...source}=item;source.norm=([x,y])=>({x:(x-source.key.waist[0])*source.scale,y:(y-source.key.waist[1])*source.scale});lowerPrepared.set(index,source);}
          for(const item of message.upper)upperPrepared.set(item.name,{tile:item.tile,rect:item.rect});
          self.postMessage({type:'ready'});return;
        }
        if(message.type!=='frame')return;
        const started=performance.now(),job=message.job;
        const frame=bakeBody(job.profile,job.name,job.gait,job.weight,!job.steady&&!job.idle);
        const attribution={...frame.canvas.dataset},bitmap=frame.canvas.transferToImageBitmap(),metadata={...frame,attribution,canvas:null,image:null,pending:false,bitmap:true};
        self.postMessage({type:'frame',id:message.id,frame:metadata,bitmap,workerMs:performance.now()-started},[bitmap]);
      }catch(error){self.postMessage({type:'error',id:message.id,message:String(error?.message||error)});}
    };
  }
  function workerSource(functions){
    const names=['surfacePose',...(functions.centrumLowerTargets?['centrumBoot','centrumLowerTargets','centrumLowerMesh']:[]),'lowerTargets','lowerMesh','surfaceTriangle','bakeBody'];
    for(const name of names)if(typeof functions[name]!=='function')throw Error('Missing source rig function '+name);
    return '('+workerEnvironment.toString().replace('/* SOURCE_RIG_FUNCTIONS */',names.map(name=>functions[name].toString()).join('\n'))+')();';
  }
  function supported(){return typeof Worker==='function'&&typeof OffscreenCanvas==='function'&&typeof createImageBitmap==='function';}
  async function create(options){
    if(!options.workerFactory&&!supported())throw Error('Asynchronous source-rig raster unavailable');
    const map=options.cache.frames,prefix='centrum-worker:',waiters=new Map();
    const counts={requests:0,hits:0,fallbacks:0,submitted:0,completed:0,superseded:0,workerBuildMs:0,maxWorkerBuildMs:0,maxPending:0,maxQueued:0};
    let worker,workerURL=null,ready=false,failure=null,pending=null,queued=null,sequence=0,closed=false;
    let readyResolve,readyReject,readyTimeout=null;
    const readyPromise=new Promise((resolve,reject)=>{readyResolve=resolve;readyReject=reject;});
    function finish(job,frame){const list=waiters.get(job.key);if(list){waiters.delete(job.key);for(const resolve of list)resolve(frame);}}
    function fail(error){
      if(failure||closed)return;failure=String(error?.message||error);if(readyTimeout!==null)clearTimeout(readyTimeout);readyReject(new Error(failure));
      if(pending)finish(pending.job,null);if(queued)finish(queued,null);pending=queued=null;
      worker?.terminate();if(workerURL){URL.revokeObjectURL(workerURL);workerURL=null;}
    }
    function slot(job){return prefix+(job.idle?job.name+':idle':job.steady?job.key:job.name+':transient:'+job.heading);}
    function touch(key,frame){map.delete(key);map.set(key,frame);return frame;}
    function exact(job){const key=slot(job),frame=map.get(key);return frame&&!frame.disposed&&frame.centrum?.key===job.key?touch(key,frame):null;}
    function dispose(key,frame){map.delete(key);options.cache.drop(frame);}
    function store(job,frame){
      const key=slot(job),old=map.get(key);if(old)dispose(key,old);
      frame.centrum={key:job.key,name:job.name,heading:job.heading,idle:job.idle,phase:job.gait.phase};
      map.set(key,frame);options.cache.add(frame);
      let examined=0;
      while((map.size>options.cache.limitFrames||options.cache.bytes()>options.cache.limitBytes)&&examined++<map.size+2){
        const oldest=map.keys().next().value,value=map.get(oldest);
        // Keep the two correct native idle fallbacks inside the same byte budget.
        if(value.centrum?.idle&&map.size>2){touch(oldest,value);continue;}dispose(oldest,value);
      }
      return frame;
    }
    function recent(job){
      let idle=null,best=null,cost=Infinity;
      for(const [key,frame]of map){
        const info=frame.centrum;if(frame.disposed||!info||info.name!==job.name)continue;
        if(info.idle){idle={key,frame};continue;}if(info.heading!==job.heading)continue;
        const gap=Math.abs(frame.gait.phase-job.gait.phase),phase=Math.min(gap,1-gap),weight=Math.abs(frame.weight-job.weight);
        if(phase>.125||weight>.45)continue;const score=phase+weight*.15;
        if(score<cost){cost=score;best={key,frame};}
      }
      const match=best||idle;return match?touch(match.key,match.frame):null;
    }
    function submit(job){
      if(!ready||closed||failure)return;pending={id:++sequence,job};counts.submitted++;counts.maxPending=Math.max(counts.maxPending,1);
      worker.postMessage({type:'frame',id:pending.id,job});
    }
    function enqueue(job){
      if(closed||failure)return;
      if(pending?.job.key===job.key||queued?.key===job.key)return;
      if(pending){if(queued){counts.superseded++;finish(queued,null);}queued=job;counts.maxQueued=Math.max(counts.maxQueued,1);}
      else submit(job);
    }
    if(options.workerFactory)worker=options.workerFactory();
    else{workerURL=URL.createObjectURL(new Blob([workerSource(options.functions)],{type:'text/javascript'}));worker=new Worker(workerURL);}
    worker.onmessage=event=>{
      const message=event.data;
      if(message.type==='ready'){ready=true;if(readyTimeout!==null)clearTimeout(readyTimeout);if(workerURL){URL.revokeObjectURL(workerURL);workerURL=null;}readyResolve();return;}
      if(message.type==='error'){fail(message.message);return;}
      if(message.type!=='frame')return;
      if(closed||!pending||message.id!==pending.id){message.bitmap?.close();return;}
      const job=pending.job;pending=null;
      Object.assign(message.bitmap,{dataset:message.frame.attribution||{}});
      const frame={...message.frame,image:message.bitmap,canvas:null,bitmap:true,pending:false,disposed:false};
      counts.completed++;counts.workerBuildMs+=message.workerMs||0;counts.maxWorkerBuildMs=Math.max(counts.maxWorkerBuildMs,message.workerMs||0);
      store(job,frame);finish(job,frame);
      if(queued){const next=queued;queued=null;if(!exact(next))submit(next);else finish(next,exact(next));}
    };
    worker.onerror=event=>fail(event.message||'Source-rig worker failed');
    readyTimeout=setTimeout(()=>fail('Source-rig worker startup timed out'),8000);
    const clone=options.cloneSource||createImageBitmap;
    const bitmaps=[];
    try{
      const lower=[];for(const item of options.lower){const {tile,norm,...metadata}=item,bitmap=await clone(tile);bitmaps.push(bitmap);lower.push({...metadata,tile:bitmap});}
      const upper=[];for(const item of options.upper){const bitmap=await clone(item.tile);bitmaps.push(bitmap);upper.push({name:item.name,rect:item.rect,tile:bitmap});}
      worker.postMessage({type:'init',images:options.images,lower,upper},bitmaps);await readyPromise;
    }catch(error){for(const bitmap of bitmaps)bitmap.close?.();fail(error);throw error;}
    function get(job){
      counts.requests++;const frame=exact(job);if(frame){counts.hits++;return frame;}
      enqueue(job);counts.fallbacks++;return recent(job);
    }
    function ensure(job){if(closed||failure)return Promise.resolve(null);const frame=exact(job);if(frame)return Promise.resolve(frame);return new Promise(resolve=>{const list=waiters.get(job.key)||[];list.push(resolve);waiters.set(job.key,list);enqueue(job);});}
    function close(){if(closed)return;closed=true;worker.terminate();for(const values of waiters.values())for(const resolve of values)resolve(null);waiters.clear();pending=queued=null;}
    return{get,ensure,close,available:()=>ready&&!failure&&!closed,stats:()=>({...counts,ready:ready&&!closed,failure,pending:pending?1:0,queued:queued?1:0,frames:[...map.values()].filter(f=>f.centrum&&!f.disposed).length,bytes:[...map.values()].filter(f=>f.centrum&&!f.disposed).reduce((sum,f)=>sum+f.width*f.height*4,0)})};
  }
  window.BearlyCentrumHeroCache={supported,create,workerSource};
})();
