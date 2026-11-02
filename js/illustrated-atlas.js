/* Shared painted scene sprites. Source files remain intact; transparent noise is cleared once. */
(() => {
  'use strict';
  const files={centrum:'centrum-buildings-v5.png',neighbourhood:'neighbourhood-buildings-v5.png',hazards:'painted-hazards-v5.png',residents:'residents-v5.png',castle:'slott-manor-v5.png',shops:'workshop-pizzeria-v6.png'};
  const items={"corner-shop":{"file":"centrum","x":789,"y":516,"w":737,"h":437,"footX":1157.5,"footY":952},"arcade":{"file":"centrum","x":19,"y":51,"w":765,"h":384,"footX":401.5,"footY":434},"civic-hall":{"file":"centrum","x":18,"y":436,"w":754,"h":501,"footX":395.0,"footY":936},"library":{"file":"centrum","x":802,"y":58,"w":722,"h":379,"footX":1163.0,"footY":436},"apartment":{"file":"neighbourhood","x":16,"y":10,"w":807,"h":524,"footX":419.5,"footY":533},"courtyard":{"file":"neighbourhood","x":835,"y":58,"w":682,"h":471,"footX":1176.0,"footY":528},"boathouse":{"file":"neighbourhood","x":772,"y":554,"w":739,"h":410,"footX":1141.5,"footY":963},"greenhouse":{"file":"neighbourhood","x":41,"y":534,"w":695,"h":427,"footX":388.5,"footY":960},"castle":{"file":"castle","x":68,"y":9,"w":1404,"h":977,"footX":770.0,"footY":985},"resident-2":{"file":"residents","x":1020,"y":11,"w":475,"h":491,"footX":1257.5,"footY":501},"resident-3":{"file":"residents","x":28,"y":513,"w":467,"h":483,"footX":261.5,"footY":995},"resident-1":{"file":"residents","x":579,"y":19,"w":270,"h":478,"footX":714.0,"footY":496},"resident-5":{"file":"residents","x":1068,"y":516,"w":436,"h":476,"footX":1286.0,"footY":991},"resident-4":{"file":"residents","x":566,"y":514,"w":413,"h":477,"footX":772.5,"footY":990},"resident-0":{"file":"residents","x":124,"y":19,"w":227,"h":478,"footX":237.5,"footY":496},"hazard-scooter":{"file":"hazards","x":25,"y":208,"w":499,"h":377,"footX":274.5,"footY":584},"hazard-cart":{"file":"hazards","x":555,"y":143,"w":433,"h":434,"footX":771.5,"footY":576},"hazard-barrier":{"file":"hazards","x":1046,"y":211,"w":471,"h":362,"footX":1281.5,"footY":572},"hazard-cones":{"file":"hazards","x":16,"y":611,"w":534,"h":359,"footX":283.0,"footY":969},"hazard-glass":{"file":"hazards","x":583,"y":833,"w":403,"h":129,"footX":784.5,"footY":961},"hazard-pothole":{"file":"hazards","x":1017,"y":760,"w":502,"h":215,"footX":1268.0,"footY":974}}; // Authored source crops and ground anchors, populated after art inspection.
  items.workshop={file:'shops',x:39,y:1,w:854,h:752,footX:466,footY:751};
  items.pizzeria={file:'shops',x:1040,y:5,w:919,h:756,footX:1499.5,footY:759};
  const textures={},preparation={cached:0,fallback:0,errors:[]};
  const turn=()=>new Promise(resolve=>setTimeout(resolve,0));
  // The normal path decodes immutable, lossless outputs of this same renderer.
  // Original source files and their authored crop/ground coordinates are intact.
  function image(file,priority='auto'){return new Promise((resolve,reject)=>{const im=new Image();im.decoding='async';im.fetchPriority=priority;im.onload=async()=>{try{await im.decode?.();resolve(im);}catch(error){reject(error);}};im.onerror=()=>reject(new Error(file));im.src=file;});}
  async function originalTexture(id,file){
    const im=await image('assets/art/'+file),raw=document.createElement('canvas');raw.width=im.naturalWidth;raw.height=im.naturalHeight;
    const target=raw.getContext('2d'),strip=document.createElement('canvas');strip.width=raw.width;
    // A missing derived cache must not restore the old full-sheet onload stall.
    // Clip the same draw into short strips, then yield between exact alpha edits.
    for(let y=0;y<raw.height;y+=24){
      const rows=Math.min(24,raw.height-y);strip.height=rows;const g=strip.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,-y);
      const data=g.getImageData(0,0,strip.width,rows);for(let i=3;i<data.data.length;i+=4)if(data.data[i]<25)data.data[i]=0;target.putImageData(data,0,y);await turn();
    }
    const scale=id==='hazards'||id==='residents'?0.5:1;if(scale===1)return{image:raw,scale};
    const small=document.createElement('canvas');small.width=raw.width*scale;small.height=raw.height*scale;const smallContext=small.getContext('2d');strip.width=small.width;
    for(let y=0;y<small.height;y+=24){const rows=Math.min(24,small.height-y);strip.height=rows;const g=strip.getContext('2d',{willReadFrequently:true});g.drawImage(raw,0,-y,small.width,small.height);smallContext.putImageData(g.getImageData(0,0,strip.width,rows),0,y);await turn();}
    return{image:small,scale};
  }
  const loaded=Promise.all(Object.entries(files).map(async([id,file])=>{
    try{const im=await image('assets/cache/scene-v19-'+id+'.png',id==='neighbourhood'?'high':'low');textures[id]={image:im,scale:id==='hazards'||id==='residents'?0.5:1};preparation.cached++;}
    catch(_){preparation.fallback++;try{textures[id]=await originalTexture(id,file);}catch(error){preparation.errors.push(error.message);}}
  }));
  function draw(c,key,x,y,width,options={}){
    const f=items[key],t=f&&textures[f.file];if(!t)return false;
    const sc=width/f.w;
    c.save();c.translate(x,y);if(options.flip)c.scale(-1,1);if(options.alpha!==undefined)c.globalAlpha*=options.alpha;
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    c.drawImage(t.image,f.x*t.scale,f.y*t.scale,f.w*t.scale,f.h*t.scale,(f.x-f.footX)*sc,(f.y-f.footY)*sc,f.w*sc,f.h*sc);
    c.restore();return true;
  }
  window.BearlyAtlas={draw,loaded,info:key=>items[key],ready:()=>Object.keys(files).every(k=>textures[k])&&Object.keys(items).length>=21,audit:()=>({...preparation,textures:Object.keys(textures),mode:preparation.fallback?'cooperative-source':'precompiled'})};
})();
