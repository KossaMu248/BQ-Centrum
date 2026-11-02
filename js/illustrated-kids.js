/* Older-teen street cast: one physical scale through chilling, chasing and combat. */
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
  const WORLD_HEIGHT=120,ADULT_HEIGHT=128,TAU=Math.PI*2;
  const cast={
    bottle:{file:'teen-molotov-poses-v18.png',oppositeUnits:1.15,releaseHand:[940,452],outfit:'Burgundy cap · black puffer gilet and hoodie · black tracksuit · sling bag · burgundy trainers'},
    rock:{file:'teen-rock-poses-v18.png',oppositeUnits:1.12,releaseHand:[940,488],outfit:'Blue cap · olive technical jacket · charcoal cargos · sling bag · gray trainers'},
    firecracker:{file:'teen-firecracker-poses-v18.png',oppositeUnits:1.08,releaseHand:[942,467],outfit:'Red cap · navy puffer and tracksuit · sling bag · red/navy trainers'}
  };
  const poseNames=['idle','phone','lean','warn','cover','ready','windup','release','recover','hurt','runA','runB','runC','runD','prone'];
  const banks={},sources={},drawn={},problems=[];let finished=false;
  const make=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  // A pose may extend across an ideal grid edge. Opaque body ownership, rather
  // than a rectangular grid crop, keeps whole shoes/hands and excludes its neighbour.
  async function prepare(image,file,rows,cols,assign){
    const c=make(image.naturalWidth,image.naturalHeight),g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);
    const pixels=g.getImageData(0,0,c.width,c.height),rgba=pixels.data,w=c.width,h=c.height,n=w*h,labels=new Uint16Array(n),seen=new Uint8Array(n),queue=new Int32Array(n),components=[];
    for(let seed=0;seed<n;seed++){
      if((seed&65535)===0)await yieldPreparation();
      if(seen[seed]||rgba[seed*4+3]<160)continue;
      let head=0,tail=1,sumX=0,sumY=0;queue[0]=seed;seen[seed]=1;
      while(head<tail){if((head&2047)===0)await yieldPreparation();const at=queue[head++],x=at%w,y=Math.floor(at/w);sumX+=x;sumY+=y;
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
          const xx=x+dx,yy=y+dy;if(xx<0||xx>=w||yy<0||yy>=h)continue;const next=yy*w+xx;
          if(seen[next]||rgba[next*4+3]<160)continue;seen[next]=1;queue[tail++]=next;
        }
      }
      if(tail>=500)components.push({points:queue.slice(0,tail),x:sumX/tail,y:sumY/tail});
    }
    const cells=Array.from({length:rows*cols},()=>[]);
    for(const body of components){const col=clamp(Math.floor(body.x/(w/cols)),0,cols-1),row=clamp(Math.floor(body.y/(h/rows)),0,rows-1);cells[row*cols+col].push(body);}
    if(cells.some(cell=>cell.length!==1))throw Error('Expected one complete teen per cell: '+file);
    let head=0,tail=0;for(let i=0;i<cells.length;i++)for(const body of cells[i])for(const at of body.points){labels[at]=i+1;queue[tail++]=at;}
    while(head<tail){if((head&2047)===0)await yieldPreparation();const at=queue[head++],x=at%w,y=Math.floor(at/w),owner=labels[at];
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        const xx=x+dx,yy=y+dy;if(xx<0||xx>=w||yy<0||yy>=h)continue;const next=yy*w+xx;
        if(labels[next]||rgba[next*4+3]<25)continue;labels[next]=owner;queue[tail++]=next;
      }
    }
    // Small disconnected details (a dazed cartoon star/fuse spark) belong to
    // their own pose. Barely visible alpha speckles are omitted once at load.
    for(let at=0;at<n;at++){if((at&65535)===0)await yieldPreparation();if(rgba[at*4+3]>=25&&!labels[at]){
      const col=clamp(Math.floor((at%w)/(w/cols)),0,cols-1),row=clamp(Math.floor(Math.floor(at/w)/(h/rows)),0,rows-1);labels[at]=row*cols+col+1;
    }}
    const bounds=cells.map(()=>[w,h,-1,-1]),cores=cells.map(()=>[w,h,-1,-1]);
    for(let at=0;at<n;at++){if((at&65535)===0)await yieldPreparation();if(labels[at]){
      const x=at%w,y=Math.floor(at/w),b=bounds[labels[at]-1];b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x);b[3]=Math.max(b[3],y);
      if(rgba[at*4+3]>=160){const q=cores[labels[at]-1];q[0]=Math.min(q[0],x);q[1]=Math.min(q[1],y);q[2]=Math.max(q[2],x);q[3]=Math.max(q[3],y);}
    }}
    const frames=[];
    for(let index=0;index<cells.length;index++){
      await yieldPreparation();
      const b=bounds[index],core=cores[index],rect=[b[0],b[1],b[2]-b[0]+1,b[3]-b[1]+1],tile=make(rect[2],rect[3]),tg=tile.getContext('2d'),out=tg.createImageData(rect[2],rect[3]);
      for(let y=b[1];y<=b[3];y++)for(let x=b[0];x<=b[2];x++){
        const at=y*w+x;if(labels[at]!==index+1)continue;const to=((y-b[1])*rect[2]+x-b[0])*4;for(let k=0;k<4;k++)out.data[to+k]=rgba[at*4+k];
      }
      tg.putImageData(out,0,0);const info=assign(index),box=[core[0],core[1],core[2]-core[0]+1,core[3]-core[1]+1];
      let xSum=0,count=0;const start=core[1]+box[3]*.43,end=core[1]+box[3]*.64;
      for(const at of cells[index][0].points){const y=Math.floor(at/w);if(y>=start&&y<=end){xSum+=at%w;count++;}}
      const anchor=[count?xSum/count:(core[0]+core[2])*.5,core[3]];
      Object.assign(tile.dataset,{sourceAsset:file,sourceRect:rect.join(','),sourcePose:info.pose,sourceVariant:info.kind,sourceTransform:'teen-source-tile'});
      const frame={...info,source:'assets/art/'+file,rect,core:box,anchor,stature:box[3]-1,tile};frames.push(frame);
    }
    sources[file]={rows,cols,components:components.length,frames};return frames;
  }
  function loadLegacy(){return Promise.all([
    ...Object.entries(cast).map(([kind,info])=>new Promise(resolve=>{
      const image=new Image();image.onload=async()=>{try{
        const list=await renderCache.prepare(()=>prepare(image,info.file,3,5,index=>({kind,pose:poseNames[index]}))),stature=list[0].stature;
        banks[kind]={stature,frames:Object.fromEntries(list.map(f=>[f.pose,{...f,stature}]))};
      }catch(error){problems.push(String(error));}resolve();};image.onerror=()=>{problems.push('Missing '+info.file);resolve();};image.src='assets/art/'+info.file;
    })),
    new Promise(resolve=>{const image=new Image();image.onload=async()=>{try{
      const list=await renderCache.prepare(()=>prepare(image,'teen-screen-v18.png',2,3,index=>({kind:['bottle','rock','firecracker'][index%3],pose:index<3?'screen':'screenDamaged'})));
      for(const frame of list){if(!banks[frame.kind])banks[frame.kind]={frames:{}};banks[frame.kind].frames[frame.pose]=frame;}
    }catch(error){problems.push(String(error));}resolve();};image.onerror=()=>{problems.push('Missing teen-screen-v18.png');resolve();};image.src='assets/art/teen-screen-v18.png';})
    ,new Promise(resolve=>{const image=new Image();image.onload=async()=>{try{
      await renderCache.prepare(()=>prepare(image,'teen-run-opposites-v18.png',3,2,index=>({kind:['bottle','rock','firecracker'][Math.floor(index/2)],pose:index%2?'runD':'runC'})));
    }catch(error){problems.push(String(error));}resolve();};image.onerror=()=>{problems.push('Missing teen-run-opposites-v18.png');resolve();};image.src='assets/art/teen-run-opposites-v18.png';})
  ]).then(()=>{
    // Images may complete in any order: merge the screen frames after every
    // standing bank is available, without replacing the common physical scale.
    for(const frame of sources['teen-screen-v18.png']?.frames||[])banks[frame.kind].frames[frame.pose]=frame;
    // The separately authored opposite keys use larger source drawing units.
    // Calibrate their head/hat and shoulder units to A/B, rather than using
    // their crouched bounding height (which would make the person pulse in size).
    for(const frame of sources['teen-run-opposites-v18.png']?.frames||[]){
      const referenceStature=banks[frame.kind].stature,sourceUnits=cast[frame.kind].oppositeUnits;
      banks[frame.kind].frames[frame.pose]={...frame,referenceStature,sourceUnits,stature:referenceStature*sourceUnits};
    }
    finished=true;
  });}
  let preparationMode='compiled',cacheFailure=null;
  async function loadCompiled(){
    const manifest=await renderCache.manifest;if(manifest.format!==1)throw Error('Unsupported actor cache');
    const tiles=new Map();let slice=performance.now();const pending=manifest.teenSources.map(pack=>renderCache.image(pack.file));
    for(const [index,pack]of manifest.teenSources.entries()){const image=await pending[index],frames=[];
      for(const info of pack.frames){const [x,y,w,h]=info.cacheRect,tile=make(w,h),g=tile.getContext('2d');g.drawImage(image,x,y,w,h,0,0,w,h);
        Object.assign(tile.dataset,{sourceAsset:pack.source,sourceRect:info.rect.join(','),sourcePose:info.pose,sourceVariant:info.kind,sourceTransform:'teen-source-tile'});
        const {cacheRect,pixelSHA256,...metadata}=info,frame={...metadata,tile};frames.push(frame);tiles.set(info.source+'|'+info.kind+'|'+info.pose,tile);
        if(performance.now()-slice>2){await renderCache.yieldTask();slice=performance.now();}
      }sources[pack.source]={rows:pack.rows,cols:pack.cols,components:pack.components,frames};
    }
    for(const [kind,bank]of Object.entries(manifest.kidsBanks)){banks[kind]={stature:bank.stature,frames:{}};for(const [pose,metadata]of Object.entries(bank.frames))banks[kind].frames[pose]={...metadata,tile:tiles.get(metadata.source+'|'+kind+'|'+pose)};}
    finished=true;
  }
  const loaded=(window.__BEARLY_BUILD_RENDER_CACHE?loadLegacy():loadCompiled().catch(error=>{preparationMode='cooperative-fallback';cacheFailure=String(error);return loadLegacy();}));
  function ready(){return finished&&problems.length===0&&Object.keys(cast).every(kind=>banks[kind]?.frames.idle&&banks[kind]?.frames.screenDamaged);}
  function frameFor(kind,pose){return banks[kind]?.frames[pose]||banks[kind]?.frames.idle;}
  function publicFrame(frame){if(!frame)return null;const {tile,...metadata}=frame;return JSON.parse(JSON.stringify(metadata));}
  function source(kind,pose){const f=frameFor(kind,pose);return f?{image:f.tile,rect:[0,0,f.tile.width,f.tile.height],source:f.source,sourceRect:f.rect,anchor:[f.anchor[0]-f.rect[0],f.anchor[1]-f.rect[1]],stature:f.stature,kind:f.kind,pose:f.pose}:null;}
  // Offsets from the shared foot anchor, measured at the open release hand.
  // x points in the actor's facing direction; z is height above the pavement.
  function projectileOrigin(kind,height=WORLD_HEIGHT){
    kind=cast[kind]?kind:'rock';const frame=frameFor(kind,'release');if(!frame)return{x:height*.56,z:height*.64};
    const hand=cast[kind].releaseHand,s=height/frame.stature;return{x:(hand[0]-frame.anchor[0])*s,z:(frame.anchor[1]-hand[1])*s};
  }
  function paint(ctx,kind,pose,height,options={}){
    const frame=frameFor(kind,pose);if(!frame)return false;
    const s=height/frame.stature,[sx,sy]=frame.rect,[ax,ay]=frame.anchor;
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.save();
    if(options.flight)ctx.translate(0,options.flight);if(options.lean)ctx.rotate(options.lean);
    if(options.breathing)ctx.scale(1,options.breathing);
    ctx.drawImage(frame.tile,(sx-ax)*s,(sy-ay)*s,frame.tile.width*s,frame.tile.height*s);ctx.restore();
    drawn[kind]={pose,height,physicalScale:s,outfit:cast[kind].outfit,source:frame.source,sourceRect:frame.rect,stature:frame.stature,anchor:frame.anchor,core:frame.core};return true;
  }
  const legacy=['idle','ready','windup','windup','release','recover'];
  function draw(ctx,{kind='bottle',frame=0,height=WORLD_HEIGHT}){return paint(ctx,kind,legacy[clamp(frame|0,0,5)],height);}
  function drawState(ctx,n,height=WORLD_HEIGHT){
    const kind=cast[n.item]?n.item:'rock',age=n.age||0,activity=n.activity||'chill';let pose='idle',flight=0,lean=0,breathing=1;
    if(['dead','down'].includes(n.state))pose='prone';
    else if(n.state==='fall')pose=age<.25?'hurt':'prone';
    else if(n.state==='rise')pose=age<.25?'prone':'hurt';
    else if(n.state==='held')pose='hurt';
    else if(n.state==='stagger')pose='hurt';
    else if(n.state==='windup')pose=age<.17?'ready':'windup';
    else if(n.state==='release')pose='release';
    else if(n.state==='recover')pose='recover';
    else if(activity==='cover'||activity==='hide'||n.behindCover||n.hiding)pose='cover';
    else if(activity==='run'||activity==='flee'||n.running||n.moving){
      const phase=(n.distance||0)/(height*1.08),index=Math.floor(((phase%1)+1)%1*4);pose=['runA','runB','runC','runD'][index];
      flight=-(Math.sin(((phase%1)+1)%1*TAU)**2)*height*.035;lean=.025;
    }else if(activity==='warn'||n.gangAlert)pose='warn';
    else if(activity==='fight'||n.gangAggressive||n.mood==='aggressive'||n.mood==='hostile')pose=age<.25?'recover':'ready';
    else{
      const id=String(n.id||kind),variation=[...id].reduce((total,char)=>total+char.charCodeAt(0),0)%3;pose=['idle','phone','lean'][variation];
      if(n.activityProp&&['utility','bin','burning-bin','canister'].includes(n.activityProp.kind))pose='lean';
      breathing=1+.004*Math.sin(age*1.8+variation);
    }
    if(n.state==='stagger')lean=Math.sin(age*30)*.08;
    if(n.state==='held')lean=-.18;
    return paint(ctx,kind,pose,height,{flight,lean,breathing});
  }
  window.BearlyKids={draw,drawState,loaded,ready,source,screenSource:(kind,damaged)=>source(kind,damaged?'screenDamaged':'screen'),
    worldHeight:()=>WORLD_HEIGHT,heightFor:(adultHeight=ADULT_HEIGHT)=>adultHeight*WORLD_HEIGHT/ADULT_HEIGHT,
    projectileOrigin,
    outfit:kind=>cast[kind]?.outfit||cast.bottle.outfit,
    frames:()=>Object.values(banks).flatMap(bank=>Object.values(bank.frames).map(publicFrame)),
    sourceFrames:()=>Object.values(sources).flatMap(sheet=>sheet.frames.map(frame=>({...publicFrame(frame),active:frameFor(frame.kind,frame.pose)?.source===frame.source}))),
    audit:()=>({ready:ready(),preparationMode,cacheFailure,drawn:JSON.parse(JSON.stringify(drawn)),types:Object.keys(cast),worldHeight:WORLD_HEIGHT,adultReferenceHeight:ADULT_HEIGHT,problems:[...problems]})};
})();
