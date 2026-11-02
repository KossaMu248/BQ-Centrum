/* Relaxed street locomotion and civilian activities. Source pixels stay authored;
   a connected texture mesh supplies continuous opposing steps and relaxed arms. */
(() => {
  'use strict';
  // Lossless build caches contain the exact approved prepared source pixels.
  // Fetch/decode once; small sprite installs yield rather than flood-fill sheets
  // on the input/render thread (including browsers without OffscreenCanvas).
  const renderCache=window.BearlyActorRenderCache||(window.BearlyActorRenderCache=(()=>{
    let preparation=Promise.resolve();const prepare=task=>{const next=preparation.then(task);preparation=next.catch(()=>{});return next;};
    const images=new Map(),manifest=typeof fetch==='function'?fetch('assets/cache/actors-v19-manifest.json').then(r=>{if(!r.ok)throw Error('Actor render cache '+r.status);return r.json();}):Promise.reject(Error('No render-cache fetch'));
    const yieldTask=()=>new Promise(resolve=>setTimeout(resolve,0));
    const image=file=>{if(images.has(file))return images.get(file);const pending=new Promise((resolve,reject)=>{const im=new Image();im.decoding='async';im.fetchPriority='low';im.onload=async()=>{try{await im.decode?.();}catch{}resolve(im);};im.onerror=()=>reject(Error('Missing '+file));im.src=file;});images.set(file,pending);return pending;};
    return{manifest,image,yieldTask,prepare};
  })());
  const yieldPreparation=()=>window.__BEARLY_BUILD_RENDER_CACHE?Promise.resolve():renderCache.yieldTask();
  const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),atlases={},profiles=Array.from({length:12},(_,variant)=>({variant,poses:{},heightScale:variant===9?1.05:variant===11?.84:1}));
  let lastAudit=null;
  const WALK_PHASES=48,CACHE_LIMIT=48*1024*1024,walkBanks=new Map();
  let cacheWorker=null,cacheWorkerURL=null,workerJob=null;
  const cacheState={height:144,started:false,scheduled:false,complete:false,mode:'idle',startedAt:0,completedMs:0,bytes:0,hits:0,misses:0,bakes:0,buildMs:0,maxBuildMs:0,mainBuildMs:0,maxMainBuildMs:0};
  const phaseOrder=[0,24,12,36,6,30,18,42,3,27,15,39,9,33,21,45,...Array.from({length:48},(_,i)=>i).filter(i=>i%3)];
  const specifications=[
    ...['a','b','c'].map((pack,index)=>({file:`npc-motion-${pack}-v16.png`,rows:3,cols:5,variants:[index*3,index*3+1,index*3+2],poses:['idle','walkA','walkB','runA','runB']})),
    {file:'civilian-standing-v16.png',rows:1,cols:3,variants:[9,10,11],poses:['idle'],standing:true},
    {file:'civilian-motion-v16.png',rows:3,cols:4,variants:[9,10,11],poses:['walkA','walkB','runA','runB']},
    {file:'civilian-rest-v16.png',rows:3,cols:4,variants:[9,10,11],poses:['sit','read','smoke','hide']},
    {file:'civilian-reactions-v16.png',rows:3,cols:5,variants:[9,10,11],poses:['hurt','fall','prone','screen','screenDamaged']}
  ];
  const sourceFacing=variant=>variant===0||variant===3?-1:1;
  const make=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};

  // Resolve ownership from the opaque authored bodies, then grow into their
  // translucent edges. This keeps whole toes/hoods even when the atlas is not a
  // mathematically perfect grid, without importing the neighbour's silhouette.
  async function prepare(spec,image){
    const source=make(image.naturalWidth,image.naturalHeight),g=source.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);
    const rgba=g.getImageData(0,0,source.width,source.height).data,w=source.width,h=source.height,size=w*h,cw=w/spec.cols,ch=h/spec.rows;
    for(const at of [0,w-1,(h-1)*w,size-1])if(rgba[at*4+3]>1)throw Error('Motion atlas must have transparent corners: '+spec.file);
    const labels=new Int16Array(size),seen=new Uint8Array(size),queue=new Int32Array(size),components=[];
    for(let seed=0;seed<size;seed++){
      if((seed&65535)===0)await yieldPreparation();
      if(seen[seed]||rgba[seed*4+3]<160)continue;
      let head=0,tail=1,sumX=0,sumY=0;queue[0]=seed;seen[seed]=1;
      while(head<tail){if((head&2047)===0)await yieldPreparation();const at=queue[head++],x=at%w,y=Math.floor(at/w);sumX+=x;sumY+=y;
        for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){
          const xx=x+ox,yy=y+oy;if(xx<0||xx>=w||yy<0||yy>=h)continue;
          const next=yy*w+xx;if(seen[next]||rgba[next*4+3]<160)continue;seen[next]=1;queue[tail++]=next;
        }
      }
      if(tail>1500)components.push({pixels:queue.slice(0,tail),x:sumX/tail,y:sumY/tail,count:tail});
    }
    const cells=Array.from({length:spec.rows*spec.cols},()=>[]);
    for(const body of components){const col=clamp(Math.floor(body.x/cw),0,spec.cols-1),row=clamp(Math.floor(body.y/ch),0,spec.rows-1);cells[row*spec.cols+col].push(body);}
    if(cells.some(v=>!v.length))throw Error('Missing complete motion pose: '+spec.file);
    // Large disconnected props such as a newspaper belong to the same pose.
    let head=0,tail=0;for(let i=0;i<cells.length;i++)for(const body of cells[i])for(const at of body.pixels){labels[at]=i+1;queue[tail++]=at;}
    while(head<tail){if((head&2047)===0)await yieldPreparation();const at=queue[head++],x=at%w,y=Math.floor(at/w),label=labels[at];
      for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){
        const xx=x+ox,yy=y+oy;if(xx<0||xx>=w||yy<0||yy>=h)continue;const next=yy*w+xx;
        if(labels[next]||!rgba[next*4+3])continue;labels[next]=label;queue[tail++]=next;
      }
    }
    // Isolated smoke/soft ink has no opaque bridge. Keep it in its own cell.
    for(let at=0;at<size;at++){if((at&65535)===0)await yieldPreparation();if(rgba[at*4+3]&&!labels[at])labels[at]=clamp(Math.floor(Math.floor(at/w)/ch),0,spec.rows-1)*spec.cols+clamp(Math.floor((at%w)/cw),0,spec.cols-1)+1;}
    const bounds=cells.map(()=>[w,h,-1,-1]),cores=cells.map(()=>[w,h,-1,-1]);
    for(let at=0;at<size;at++){if((at&65535)===0)await yieldPreparation();if(labels[at]){const b=bounds[labels[at]-1],x=at%w,y=Math.floor(at/w);b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x);b[3]=Math.max(b[3],y);
      if(rgba[at*4+3]>=160){const q=cores[labels[at]-1];q[0]=Math.min(q[0],x);q[1]=Math.min(q[1],y);q[2]=Math.max(q[2],x);q[3]=Math.max(q[3],y);}}}
    for(let index=0;index<cells.length;index++){
      await yieldPreparation();
      const row=Math.floor(index/spec.cols),col=index%spec.cols,variant=spec.standing?spec.variants[col]:spec.variants[row],pose=spec.standing?'idle':spec.poses[col];
      const [x0,y0,x1,y1]=bounds[index],rect=[x0,y0,x1-x0+1,y1-y0+1],tile=make(rect[2],rect[3]),tg=tile.getContext('2d'),pixels=tg.createImageData(rect[2],rect[3]);
      for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const at=y*w+x;if(labels[at]!==index+1)continue;const d=((y-y0)*rect[2]+x-x0)*4;for(let k=0;k<4;k++)pixels.data[d+k]=rgba[at*4+k];}
      tg.putImageData(pixels,0,0);tile.dataset.sourceAsset=spec.file;tile.dataset.sourceRect=rect.join(',');tile.dataset.sourcePose=pose;tile.dataset.sourceVariant=String(variant);
      const core=cores[index],frame={variant,pose,source:'assets/art/'+spec.file,rect,core:[core[0],core[1],core[2]-core[0]+1,core[3]-core[1]+1],anchor:[(core[0]+core[2])*.5,core[3]],stature:core[3]-core[1],sourceFace:sourceFacing(variant),tile};
      profiles[variant].poses[pose]=frame;
    }
  }
  function finalize(){
    for(const profile of profiles){
      const idle=profile.poses.idle;if(!idle)continue;
      const base=idle.stature;profile.stature=base;
      for(const frame of Object.values(profile.poses)){
        if(frame.pose==='idle')continue;
        const family=frame.source.split('/').pop();
        if(family.startsWith('npc-motion-')){
          frame.stature=base;
          // These cells share one physical scale and floor within their row.
          const atlas=atlases[family],col=specifications.find(s=>s.file===family).poses.indexOf(frame.pose),cellW=atlas.image.naturalWidth/5;
          frame.anchor=[idle.anchor[0]+col*cellW,idle.anchor[1]];
        }else if(family==='civilian-motion-v16.png'){
          const walk=[profile.poses.walkA,profile.poses.walkB];frame.stature=Math.max(...walk.map(f=>f.core[3]));
        }else if(family==='civilian-rest-v16.png'){
          const smoke=profile.poses.smoke;frame.stature=smoke.core[3];
          if(['sit','read','hide'].includes(frame.pose))frame.stature*=1.18;
        }else if(family==='civilian-reactions-v16.png'){
          frame.stature=profile.poses.hurt.core[3];
        }
      }
      // Measured buttock contact points in the authored seated paintings.
      if(profile.variant>=9){
        const pivots=[[[170,265],[548,265]],[[160,614],[541,614]],[[185,946],[565,945]]][profile.variant-9];
        for(const [i,pose]of ['sit','read'].entries())if(profile.poses[pose])profile.poses[pose].seatPivot=pivots[i];
      }
    }
  }
  function loadLegacy(){return Promise.all(specifications.map(spec=>new Promise(resolve=>{const image=new Image(),entry={image,ready:false,error:null};atlases[spec.file]=entry;
    image.onload=async()=>{try{await renderCache.prepare(()=>prepare(spec,image));finalize();entry.ready=true;entry.error=null;if(ready())startWalkCache();}catch(e){entry.error=String(e);}resolve();};image.onerror=()=>{entry.error='Missing '+spec.file;resolve();};image.src='assets/art/'+spec.file;
  })));}
  let preparedManifest=null,preparationMode='compiled',cacheFailure=null;
  async function loadCompiled(){
    const manifest=await renderCache.manifest;if(manifest.format!==1)throw Error('Unsupported actor cache');preparedManifest=manifest;
    let slice=performance.now();const pending=manifest.npcSources.map(pack=>renderCache.image(pack.file));
    for(const [index,pack]of manifest.npcSources.entries()){const entry=atlases[pack.source]={image:null,ready:false,error:null},image=await pending[index];
      for(const info of pack.frames){const [x,y,w,h]=info.cacheRect,tile=make(w,h);tile.getContext('2d').drawImage(image,x,y,w,h,0,0,w,h);
        Object.assign(tile.dataset,{sourceAsset:pack.source,sourceRect:info.rect.join(','),sourcePose:info.pose,sourceVariant:String(info.variant)});
        const {cacheRect,pixelSHA256,...metadata}=info;profiles[info.variant].poses[info.pose]={...metadata,tile};
        if(performance.now()-slice>2){await renderCache.yieldTask();slice=performance.now();}
      }entry.ready=true;
    }
    startWalkCache();
  }
  for(const spec of specifications)atlases[spec.file]={image:null,ready:false,error:null};
  const loaded=window.__BEARLY_BUILD_RENDER_CACHE?loadLegacy():loadCompiled().catch(error=>{preparationMode='cooperative-fallback';cacheFailure=String(error);return loadLegacy();});
  function ready(){return Object.values(atlases).every(a=>a.ready)&&profiles.every(p=>p.poses.idle);}
  function publicFrame(frame){const {tile,feet,legSplit,...data}=frame;return JSON.parse(JSON.stringify({...data,heightScale:profiles[frame.variant].heightScale}));}
  function frames(){return profiles.flatMap(p=>Object.values(p.poses).map(publicFrame));}
  function get(variant,pose='idle'){const profile=profiles[((variant%12)+12)%12];return profile?.poses[pose]||profile?.poses.idle;}
  function raw(c,frame,x,y,height,face=1,alpha=1){
    const s=height/frame.stature,flip=face*frame.sourceFace<0?-1:1,[sx,sy]=frame.rect,[ax,ay]=frame.anchor;
    c.save();c.translate(x,y);c.scale(flip,1);c.globalAlpha*=alpha;c.drawImage(frame.tile,(sx-ax)*s,(sy-ay)*s,frame.tile.width*s,frame.tile.height*s);c.restore();
  }
  function drawPose(c,{variant=0,pose='idle',x=0,y=0,height=130,face=1,alpha=1}={}){const frame=get(variant,pose);if(!frame)return false;raw(c,frame,x,y,height,face,alpha);return true;}
  function source(variant,pose){const frame=get(variant,pose);return frame?{image:frame.tile,rect:[0,0,frame.tile.width,frame.tile.height],original:publicFrame(frame)}:null;}

  function foot(phase,h,half){const p=((phase%1)+1)%1,duty=.62;if(p<duty)return{x:half*(1-2*p/duty),y:0,angle:p>duty-.12?(p-duty+.12)*.65:0,stance:true};const t=(p-duty)/(1-duty);return{x:-half*Math.cos(Math.PI*t),y:-h*.070*Math.sin(Math.PI*t),angle:-.19*Math.sin(Math.PI*t),stance:false};}
  function triangle(c,image,source,destination){
    const [a,b,d]=source,[p,q,r]=destination,den=a.x*(b.y-d.y)+b.x*(d.y-a.y)+d.x*(a.y-b.y);if(Math.abs(den)<.0001)return;
    const A=(p.x*(b.y-d.y)+q.x*(d.y-a.y)+r.x*(a.y-b.y))/den,B=(p.y*(b.y-d.y)+q.y*(d.y-a.y)+r.y*(a.y-b.y))/den;
    const C=(p.x*(d.x-b.x)+q.x*(a.x-d.x)+r.x*(b.x-a.x))/den,D=(p.y*(d.x-b.x)+q.y*(a.x-d.x)+r.y*(b.x-a.x))/den;
    const E=(p.x*(b.x*d.y-d.x*b.y)+q.x*(d.x*a.y-a.x*d.y)+r.x*(a.x*b.y-b.x*a.y))/den,F=(p.y*(b.x*d.y-d.x*b.y)+q.y*(d.x*a.y-a.x*d.y)+r.y*(a.x*b.y-b.x*a.y))/den;
    const center={x:(p.x+q.x+r.x)/3,y:(p.y+q.y+r.y)/3};
    c.save();c.beginPath();destination.forEach((v,i)=>{const dx=v.x-center.x,dy=v.y-center.y,length=Math.hypot(dx,dy)||1,x=v.x+dx/length*.65,y=v.y+dy/length*.65;i?c.lineTo(x,y):c.moveTo(x,y);});c.closePath();c.clip();c.transform(A,B,C,D,E,F);c.drawImage(image,0,0);c.restore();
  }
  function rig(c,frame,phase,h,face){
    const s=h/frame.stature,[rx,ry]=frame.rect,[cx,cy,cw,ch]=frame.core,ax=frame.anchor[0]-rx,ay=frame.anchor[1]-ry,top=cy-ry,left=cx-rx;
    const flip=face*frame.sourceFace<0?-1:1,front=frame.sourceFace,half=h*.17,bodyX=h*.007*Math.sin(phase*TAU),bob=-h*.005*(1-Math.cos(phase*TAU*2)),sway=.008*Math.sin(phase*TAU);
    if(!frame.feet){
      const w=frame.tile.width,hh=frame.tile.height,rgba=frame.tile.getContext('2d').getImageData(0,0,w,hh).data,visited=new Uint8Array(w*hh),bodies=[],start=Math.floor(top+ch*.90);
      for(let y=start;y<hh;y++)for(let x=0;x<w;x++){const seed=y*w+x;if(visited[seed]||rgba[seed*4+3]<160)continue;const queue=[seed];visited[seed]=1;let head=0,xx=0,count=0,x0=w,x1=0,y1=0;
        while(head<queue.length){const at=queue[head++],px=at%w,py=Math.floor(at/w);xx+=px;count++;x0=Math.min(x0,px);x1=Math.max(x1,px);y1=Math.max(y1,py);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=px+dx,ny=py+dy,next=ny*w+nx;if(nx<0||nx>=w||ny<start||ny>=hh||visited[next]||rgba[next*4+3]<160)continue;visited[next]=1;queue.push(next);}}
        if(count>50)bodies.push({x:xx/count,y:y1,x0,x1,count});
      }
      bodies.sort((a,b)=>b.count-a.count);const pair=bodies.slice(0,2).sort((a,b)=>a.x-b.x);
      frame.feet=pair.length===2?pair:[{x:left+cw*.25,y:ay,x1:left+cw*.49},{x:left+cw*.75,y:ay,x0:left+cw*.51}];frame.legSplit=(frame.feet[0].x1+frame.feet[1].x0)/2;
    }
    const point=(x,y)=>{const xx=(x-ax)*s,yy=(y-ay)*s;return{x:xx*Math.cos(sway)-yy*Math.sin(sway)+bodyX,y:xx*Math.sin(sway)+yy*Math.cos(sway)+bob};};
    const feet=frame.feet.map((p,i)=>{const f=foot(phase+i*.5,h,half),base=point(p.x,p.y),sole={x:front*f.x+(i?1:-1)*h*.012,y:f.y};return{source:p,sole,delta:{x:sole.x-base.x,y:sole.y-base.y},stance:f.stance,angle:f.angle};});
    const map=(x,y,legSide)=>{
      const u=(x-left)/cw,v=(y-top)/ch,side=Math.sign(u-.5),outer=clamp((Math.abs(u-.5)-.20)/.28,0,1),armDown=clamp((v-.21)/.40,0,1),armStop=1-clamp((v-.66)/.07,0,1),base=point(x,y);
      // Each pixel belongs to one continuous surface. The outer sleeves and
      // hands retain torso motion; only the inner trouser branches follow feet.
      const protectHands=1-clamp((Math.abs(u-.5)-.24)/.16,0,1)*(1-clamp((v-.66)/.08,0,1));
      const legT=clamp((v-.51)/.40,0,1),weight=legT*legT*(3-2*legT)*protectHands,leg=feet[legSide];
      const arm=side*front*Math.cos(phase*TAU)*h*.046*outer*armDown*armStop;
      return{x:base.x+leg.delta.x*weight+arm,y:base.y+leg.delta.y*weight-h*.006*Math.sin(phase*TAU)**2*outer*armDown*armStop};
    };
    c.save();c.scale(flip,1);
    // Keep each shoe rigid and plant it at its measured source sole. The mesh
    // overlaps only its ankle; it cannot stretch a trainer into a flat wedge.
    for(const i of [1,0]){const f=feet[i],x0=i?frame.legSplit:0,x1=i?frame.tile.width:frame.legSplit;c.save();c.translate(f.sole.x,f.sole.y);c.rotate(front*f.angle);c.scale(s,s);c.translate(-f.source.x,-f.source.y);c.beginPath();c.rect(x0,top+ch*.89,x1-x0,frame.tile.height);c.clip();c.drawImage(frame.tile,0,0);c.restore();}
    const nx=5,ny=17,end=top+ch*.91;
    for(let side=0;side<2;side++)for(let row=0;row<ny;row++)for(let col=0;col<nx;col++){
      const leftEdge=side?frame.legSplit:0,rightEdge=side?frame.tile.width:frame.legSplit,x0=leftEdge+(rightEdge-leftEdge)*col/nx,x1=leftEdge+(rightEdge-leftEdge)*(col+1)/nx,y0=end*row/ny,y1=end*(row+1)/ny;
      const a={x:x0,y:y0},b={x:x1,y:y0},d={x:x1,y:y1},e={x:x0,y:y1};triangle(c,frame.tile,[a,b,d],[map(x0,y0,side),map(x1,y0,side),map(x1,y1,side)]);triangle(c,frame.tile,[a,d,e],[map(x0,y0,side),map(x1,y1,side),map(x0,y1,side)]);
    }
    c.restore();return{phase,landmarks:{near:{sole:feet[0].sole,stance:feet[0].stance},far:{sole:feet[1].sole,stance:feet[1].stance}},bodyShift:bodyX,bob,sway,halfStride:half,armSwing:h*.046,connectedMesh:true};
  }
  // Bake the approved deformation once. Gameplay submits one small sprite per
  // walker, independent of its height, heading or number of times it is drawn.
  // Work yields between poses, and an unseen phase never tessellates in draw().
  function startWalkCache(){
    if(cacheState.started||(!preparedManifest&&!ready()))return;cacheState.started=true;cacheState.startedAt=performance.now();
    if(preparedManifest){cacheState.mode='compiled';for(const item of preparedManifest.walks)walkBanks.set(item.variant,{...item,frames:Array(WALK_PHASES).fill(null),cursor:0,built:0,hits:0,misses:0,activeUntil:0,workerReady:false,requested:false,loading:null});return;}
    const layout=height=>profiles.map(profile=>{const f=profile.poses.idle,width=Math.ceil(Math.max(.72,f.core[2]/f.stature+.16)*height)+12,heightPx=Math.ceil(height*1.10)+12;return{variant:profile.variant,width,height:heightPx,x:width/2,y:height+8};});
    let layouts=layout(cacheState.height);
    if(layouts.reduce((sum,p)=>sum+p.width*p.height*4*WALK_PHASES,0)>CACHE_LIMIT){cacheState.height=128;layouts=layout(cacheState.height);}
    const priority=[0,9,11,10,1,2,3,4,5,6,7,8];
    for(const variant of priority){const geometry=layouts[variant];walkBanks.set(variant,{...geometry,frames:Array(WALK_PHASES).fill(null),cursor:0,built:0,hits:0,misses:0,activeUntil:0,workerReady:false,requested:!!window.__BEARLY_BUILD_RENDER_CACHE,loading:null});}
    if(window.__BEARLY_BUILD_RENDER_CACHE){startCacheWorker();scheduleWalkCache();}
  }
  function warmVariant(variant){
    startWalkCache();const bank=walkBanks.get(variant);if(!bank)return Promise.resolve();bank.requested=true;
    if(bank.loading)return bank.loading;
    if(!preparedManifest){if(!cacheWorker)startCacheWorker();scheduleWalkCache();return Promise.resolve();}
    bank.loading=(async()=>{const image=await renderCache.image(bank.file);let slice=performance.now();
      for(const frame of bank.framesMeta||preparedManifest.walks.find(p=>p.variant===variant).frames){const index=frame.index;if(bank.frames[index])continue;const x=index%bank.columns*bank.width,y=Math.floor(index/bank.columns)*bank.height,started=performance.now();let tile;
        if(window.createImageBitmap)tile=await createImageBitmap(image,x,y,bank.width,bank.height);
        else{tile=make(bank.width,bank.height);tile.getContext('2d').drawImage(image,x,y,bank.width,bank.height,0,0,bank.width,bank.height);}
        acceptPose(bank,index,tile,frame.details,performance.now()-started,false);
        if(performance.now()-slice>2){await renderCache.yieldTask();slice=performance.now();}
      }
      if([...walkBanks.values()].every(b=>b.built===WALK_PHASES))finishCache();
    })().catch(error=>{bank.error=String(error);cacheState.mode='compiled-with-cooperative-fallback';if(!cacheWorker)startCacheWorker();scheduleWalkCache();});
    return bank.loading;
  }
  function preloadAll(){startWalkCache();return Promise.all([...walkBanks.keys()].map(warmVariant));}
  function finishCache(){
    cacheState.complete=true;cacheState.completedMs=performance.now()-cacheState.startedAt;
    if(cacheWorker){cacheWorker.terminate();cacheWorker=null;}
    if(cacheWorkerURL){URL.revokeObjectURL(cacheWorkerURL);cacheWorkerURL=null;}
  }
  function acceptPose(bank,index,image,details,elapsed,onMain){
    const frame=profiles[bank.variant].poses.idle;
    const attribution={sourceAsset:frame.source.split('/').pop(),sourceRect:frame.rect.join(','),sourcePose:frame.pose,sourceVariant:String(frame.variant),sourceTransform:'walk-cache',sourcePhase:String(index/WALK_PHASES)};
    // ImageBitmap and Canvas draws carry the same original-source attribution.
    if(image.dataset)Object.assign(image.dataset,attribution);else image.dataset=attribution;
    bank.frames[index]={canvas:image,details,index};bank.built++;cacheState.bytes+=bank.width*bank.height*4;cacheState.bakes++;
    cacheState.buildMs+=elapsed;cacheState.maxBuildMs=Math.max(cacheState.maxBuildMs,elapsed);
    if(onMain){cacheState.mainBuildMs+=elapsed;cacheState.maxMainBuildMs=Math.max(cacheState.maxMainBuildMs,elapsed);}
  }
  function startCacheWorker(){
    if(!window.Worker||!window.OffscreenCanvas||!window.createImageBitmap)return;
    try{
      const source=`'use strict';const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),frames=new Map();let output=null;
${foot.toString()}
${triangle.toString()}
${rig.toString()}
onmessage=event=>{const m=event.data;if(m.type==='source'){const tile=new OffscreenCanvas(m.bitmap.width,m.bitmap.height);tile.getContext('2d',{willReadFrequently:true}).drawImage(m.bitmap,0,0);m.bitmap.close();frames.set(m.variant,{...m.frame,tile});return;}const started=performance.now();if(!output||output.width!==m.width||output.height!==m.height)output=new OffscreenCanvas(m.width,m.height);const g=output.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,m.width,m.height);g.translate(m.x,m.y);const details=rig(g,frames.get(m.variant),m.index/m.phaseCount,m.heightScale,frames.get(m.variant).sourceFace),bitmap=output.transferToImageBitmap();postMessage({variant:m.variant,index:m.index,details,elapsed:performance.now()-started,bitmap},[bitmap]);};`;
      cacheWorkerURL=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));cacheWorker=new Worker(cacheWorkerURL);cacheState.mode='worker';
      cacheWorker.onmessage=event=>{const m=event.data,bank=walkBanks.get(m.variant);workerJob=null;acceptPose(bank,m.index,m.bitmap,m.details,m.elapsed,false);scheduleWalkCache();};
      cacheWorker.onerror=()=>{if(cacheWorker)cacheWorker.terminate();cacheWorker=null;cacheState.mode='idle';if(workerJob){workerJob.bank.cursor--;workerJob=null;}scheduleWalkCache();};
      for(const bank of walkBanks.values()){const frame=profiles[bank.variant].poses.idle;createImageBitmap(frame.tile).then(bitmap=>{if(!cacheWorker){bitmap.close();return;}cacheWorker.postMessage({type:'source',variant:bank.variant,frame:publicFrame(frame),bitmap},[bitmap]);bank.workerReady=true;scheduleWalkCache();}).catch(()=>{cacheWorker?.terminate();cacheWorker=null;cacheState.mode='idle';if(workerJob){workerJob.bank.cursor--;workerJob=null;}scheduleWalkCache();});}
    }catch{cacheWorker=null;cacheState.mode='idle';}
  }
  function scheduleWalkCache(){
    if(cacheState.scheduled||cacheState.complete||workerJob)return;
    const pending=[...walkBanks.values()].filter(bank=>bank.requested&&bank.built<WALK_PHASES);
    if(!pending.length){if([...walkBanks.values()].every(b=>b.built===WALK_PHASES))finishCache();return;}
    const now=performance.now(),eligible=cacheWorker?pending.filter(b=>b.workerReady):pending;
    if(!eligible.length)return;
    const bank=eligible.find(b=>b.activeUntil>now)||eligible[0];while(bank.frames[phaseOrder[bank.cursor]])bank.cursor++;const index=phaseOrder[bank.cursor++];
    if(cacheWorker){workerJob={bank,index};cacheWorker.postMessage({type:'bake',variant:bank.variant,index,phaseCount:WALK_PHASES,heightScale:cacheState.height,width:bank.width,height:bank.height,x:bank.x,y:bank.y});return;}
    cacheState.scheduled=true;
    const next=deadline=>{cacheState.scheduled=false;if(!window.__BEARLY_BUILD_RENDER_CACHE&&deadline&&deadline.timeRemaining()<12){setTimeout(scheduleWalkCache,100);return;}const frame=profiles[bank.variant].poses.idle,canvas=make(bank.width,bank.height),g=canvas.getContext('2d'),started=performance.now();
      g.translate(bank.x,bank.y);const details=rig(g,frame,index/WALK_PHASES,cacheState.height,frame.sourceFace);
      g.getImageData(0,0,bank.width,bank.height);acceptPose(bank,index,canvas,details,performance.now()-started,true);scheduleWalkCache();
    };
    if(window.requestIdleCallback)requestIdleCallback(next);else setTimeout(()=>next(null),32);
  }
  function cachedWalk(c,frame,phase,h,face){
    warmVariant(frame.variant);const bank=walkBanks.get(frame.variant),normalized=((phase%1)+1)%1,index=Math.round(normalized*WALK_PHASES)%WALK_PHASES;
    if(!bank){raw(c,get(frame.variant,normalized<.5?'walkA':'walkB')||frame,0,0,h,face);return null;}
    bank.activeUntil=performance.now()+2500;let entry=bank.frames[index];
    if(entry){cacheState.hits++;bank.hits++;}else{
      cacheState.misses++;bank.misses++;let distance=WALK_PHASES;
      for(let i=0;!preparedManifest&&i<WALK_PHASES;i++)if(bank.frames[i]){const gap=Math.min(Math.abs(i-index),WALK_PHASES-Math.abs(i-index));if(gap<distance){entry=bank.frames[i];distance=gap;}}
    }
    if(!entry){const authored=get(frame.variant,normalized<.5?'walkA':'walkB')||frame;raw(c,authored,0,0,h,face);return null;}
    const scale=h/cacheState.height,flip=face*frame.sourceFace<0?-1:1;c.save();c.scale(flip,1);c.drawImage(entry.canvas,-bank.x*scale,-bank.y*scale,bank.width*scale,bank.height*scale);c.restore();return{cacheEntry:entry,scale};
  }
  function motionAudit(){
    if(!lastAudit)return null;let details=lastAudit.details;
    if(details?.cacheEntry){const {cacheEntry,scale}=details,d=cacheEntry.details,point=p=>({x:p.x*scale,y:p.y*scale});details={...d,landmarks:Object.fromEntries(Object.entries(d.landmarks).map(([key,foot])=>[key,{...foot,sole:point(foot.sole)}])),bodyShift:d.bodyShift*scale,bob:d.bob*scale,halfStride:d.halfStride*scale,armSwing:d.armSwing*scale,cached:true,phaseIndex:cacheEntry.index,phaseCount:WALK_PHASES};}
    return JSON.parse(JSON.stringify({...lastAudit,details}));
  }
  function cacheStats(){return{preparationMode,cacheFailure,onDemand:!!preparedManifest,visibleComplete:[...walkBanks.values()].filter(b=>b.requested).every(b=>b.built===WALK_PHASES),requestedVariants:[...walkBanks.values()].filter(b=>b.requested).map(b=>b.variant),phaseCount:WALK_PHASES,canonicalHeight:cacheState.height,frameCount:cacheState.bakes,capacity:profiles.length*WALK_PHASES,bytes:cacheState.bytes,limitBytes:CACHE_LIMIT,hits:cacheState.hits,misses:cacheState.misses,bakes:cacheState.bakes,buildMs:cacheState.buildMs,maxBuildMs:cacheState.maxBuildMs,mainBuildMs:cacheState.mainBuildMs,maxMainBuildMs:cacheState.maxMainBuildMs,mode:cacheState.mode,warmupMs:cacheState.completedMs||performance.now()-cacheState.startedAt,complete:cacheState.complete,variants:[...walkBanks.values()].map(b=>({variant:b.variant,frames:b.built,width:b.width,height:b.height,bytes:b.built*b.width*b.height*4,hits:b.hits,misses:b.misses}))};}
  function seated(c,frame,x,y,h,face,seatHeight,t=0,reading=false){
    const s=h/frame.stature,flip=face*frame.sourceFace<0?-1:1,[px,py]=frame.seatPivot||frame.anchor,[sx,sy]=frame.rect;
    c.save();c.translate(x,y-seatHeight);c.rotate(Math.sin(t*.75+frame.variant)* (reading?.0035:.0018));c.scale(flip,1+.0025*Math.sin(t*1.6+frame.variant));c.drawImage(frame.tile,(sx-px)*s,(sy-py)*s,frame.tile.width*s,frame.tile.height*s);c.restore();
  }
  function draw(c,n,x,y,height=130,scale=1){
    if(n.active===false||n.visible===false)return true;
    const variant=Number.isFinite(n.variant)?((n.variant%12)+12)%12:0,profile=profiles[variant],reaction=['stagger','fall','dead','down','rise'].includes(n.state);
    if(!profile?.poses.idle)return false;
    warmVariant(variant);
    if(variant<9&&(reaction||n.state==='held'))return false;
    const moving=!!n.moving,aggressive=n.hostile||n.mood==='hostile'||n.mood==='aggressive',activity=n.activity||(moving?(aggressive?'run':'walk'):'idle'),face=n.face||1,h=height*profile.heightScale,t=n.age||0;
    let pose='idle',mode=activity,phase=0,details=null;
    if(variant>=9&&reaction)pose=n.state==='stagger'?'hurt':n.state==='fall'?(n.age<.4?'fall':'prone'):n.state==='rise'?(n.age<.25?'prone':'hurt'):'prone';
    else if(n.state==='held')pose=variant>=9?'hurt':'idle';
    else if(['sit','read','smoke','hide'].includes(activity))pose=profile.poses[activity]?activity:'idle';
    else if(['run','flee'].includes(activity)||n.running){phase=(n.distance||0)/(h*1.05);pose=((phase%1)+1)%1<.5?'runA':'runB';}
    else if(moving||activity==='walk'){phase=(n.distance||0)/(h*.72);pose='idle';mode='walk';}
    else if(aggressive&&variant<9)return false;
    const frame=get(variant,pose);if(!frame)return false;
    c.save();c.translate(x,y);c.scale(scale,scale);
    if(mode==='walk'&&!reaction){details=cachedWalk(c,frame,phase,h,face);}
    else if(!reaction&&(['run','flee'].includes(activity)||n.running)){
      const flight=-(Math.sin(((phase%1)+1)%1*Math.PI*2)**2)*h*.035,lean=(face>0?1:-1)*.055;
      c.save();c.translate(0,flight);c.rotate(lean);raw(c,frame,0,0,h,face);c.restore();
    }else if(['sit','read'].includes(pose)&&frame.seatPivot){seated(c,frame,0,0,h,face,n.activityProp?.seatHeight??h*.29,t,pose==='read');}
    else if(activity==='hide'&&variant<9){c.save();c.scale(1,.65);raw(c,frame,0,0,h,face);c.restore();}
    else{const breathing=!reaction&&n.state!=='held'?1+.004*Math.sin(t*1.8+variant):1;c.save();c.scale(1,breathing);raw(c,frame,0,0,h,face);c.restore();}
    if(activity==='smoke'&&!reaction){
      // The painted cigarette stays in its authored hand; soft wisps rise and
      // drift independently instead of remaining a frozen part of the pose.
      c.save();c.translate(face*h*.14,-h*.68);c.strokeStyle='rgba(230,236,230,.22)';c.lineWidth=Math.max(.6,h*.005);
      for(let i=0;i<3;i++){const p=((t*.22+i/3)%1+1)%1,drift=Math.sin(t*.7+i)*h*.018,yy=-p*h*.20;c.globalAlpha=Math.sin(p*Math.PI)*.65;c.beginPath();c.moveTo(drift,yy);c.bezierCurveTo(drift+h*.016,yy-h*.022,drift-h*.014,yy-h*.035,drift+h*.007,yy-h*.055);c.stroke();}c.restore();
    }
    if(n.state==='held'){/* Supporting hands/throw motion is provided by the bear rig. */}
    c.restore();lastAudit={variant,activity,pose,phase,source:frame.source,sourceRect:frame.rect,height:h,heightScale:profile.heightScale,civilian:n.civilian===true,details};return true;
  }
  window.BearlyNpcMotion={ready,loaded,preloadAll,frames,frame:(variant,pose)=>{const f=get(variant,pose);return f?publicFrame(f):null;},source,drawPose,draw,audit:motionAudit,cacheStats,diagnostics:()=>Object.fromEntries(Object.entries(atlases).map(([k,v])=>[k,{ready:v.ready,error:v.error}]))};
})();
