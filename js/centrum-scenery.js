/* Independent Centrum environmental sprites. Original character/source art is
   untouched; these images add no simulation, input listeners or animation loop. */
(() => {
  'use strict';
  const specifications={
    gate:{file:'assets/centrum/service-gate.png',frames:{closed:{x:91,y:140,w:764,h:556},open:{x:1024,y:140,w:764,h:556}}},
    passage:{file:'assets/centrum/service-passage.png',frames:{open:{x:60,y:55,w:790,h:1550}}},
    cage:{file:'assets/centrum/delivery-cage.png',frames:{closed:{x:0,y:0,w:1000,h:724,pivotX:483.5,pivotY:683},open:{x:1014,y:0,w:1158,h:724,pivotX:483.75,pivotY:683}},frontPostSpan:678.5},
  };
  const images={},jobs=new Map(),errors=new Map();let lastDraws=[];
  const required=id=>id==='metro-square'?['gate']:id==='shopping-arcade'?['passage']:id==='service-courtyard'?['gate','cage']:[];
  function load(kind){
    if(!jobs.has(kind))jobs.set(kind,new Promise((resolve,reject)=>{
      const im=new Image();im.decoding='async';
      const failed=error=>{errors.set(kind,String(error));jobs.delete(kind);reject(error);};
      im.onerror=()=>failed(new Error('Centrum scenery unavailable: '+specifications[kind].file));
      im.onload=async()=>{try{await im.decode?.();images[kind]=im;errors.delete(kind);resolve();}catch(error){failed(error);}};
      im.src=specifications[kind].file;
    }));
    return jobs.get(kind);
  }
  function ready(kind){
    const spec=specifications[kind],im=images[kind];
    return !!im&&!!spec?.frames&&Object.values(spec.frames).every(r=>r&&r.w>0&&r.h>0&&r.x>=0&&r.y>=0&&r.x+r.w<=im.naturalWidth&&r.y+r.h<=im.naturalHeight);
  }
  function prepare(sceneId){return Promise.all(required(sceneId).map(load));}
  function paint(c,kind,state,x,y,w,h){
    if(!ready(kind))return false;const spec=specifications[kind],r=spec.frames[state];if(!r)return false;
    const scale=Math.min(w/r.w,h/r.h),width=r.w*scale,height=r.h*scale,left=x+(w-width)*.5,top=y+h-height;
    c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(images[kind],r.x,r.y,r.w,r.h,left,top,width,height);c.restore();
    lastDraws.push({kind,state,x:left,y:top,w:width,h:height,uniformScale:scale});if(lastDraws.length>12)lastDraws.shift();return true;
  }
  function drawGate(c,x,footY,opened){return paint(c,'gate',opened?'open':'closed',x-66,footY-118,132,118);}
  function drawPassage(c,x=969,y=196,w=180,h=354){return paint(c,'passage','open',x,y,w,h);}
  function drawPassageJamb(c){
    if(!ready('passage'))return false;
    // Repaint only the grounded lower jamb in foot order. Its upper facade
    // remains behind the source passenger, keeping the baby visible.
    const r=specifications.passage.frames.open,scale=180/r.w,top=550-r.h*scale;
    const sx=90,sy=1220,sw=165,sh=385;
    c.drawImage(images.passage,sx,sy,sw,sh,969+(sx-r.x)*scale,top+(sy-r.y)*scale,sw*scale,sh*scale);
    return true;
  }
  function drawCage(c,x,footY,opened){
    if(!ready('cage'))return false;
    const state=opened?'open':'closed',spec=specifications.cage,r=spec.frames[state],scale=130/spec.frontPostSpan;
    // Both states use the same measured front-post scale/pivot. The open door
    // may extend rightward; fitting its whole alpha bbox would shrink the cage.
    const left=x-r.pivotX*scale,top=footY-r.pivotY*scale;
    c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(images.cage,r.x,r.y,r.w,r.h,left,top,r.w*scale,r.h*scale);c.restore();
    lastDraws.push({kind:'cage',state,x:left,y:top,w:r.w*scale,h:r.h*scale,uniformScale:scale,frontPostWidth:130,footY});if(lastDraws.length>12)lastDraws.shift();return true;
  }
  window.BearlyCentrumScenery={prepare,ready,drawGate,drawPassage,drawPassageJamb,drawCage,audit:()=>({
    provenance:'New independent BQ-Centrum environment artwork, generated to match the pinned source palette/view; no character replacements.',
    files:Object.fromEntries(Object.entries(specifications).map(([kind,spec])=>[kind,{file:spec.file,reviewed:!!spec.frames,decoded:!!images[kind],ready:ready(kind)}])),
    errors:Object.fromEntries(errors),lastDraws:lastDraws.map(d=>({...d})),loops:0,
  })};
})();
