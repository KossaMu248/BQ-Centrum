/* Autumn Streets — independent, terrain-aware art direction. No physics changes. */
(() => {
  'use strict';
  const ink='#292d26', TAU=Math.PI*2;
  const noise=(n,s=0)=>{const v=Math.sin(n*127.1+s*311.7)*43758.5453;return v-Math.floor(v);};
  const imageSources=new Map();
  function lazyImage(file){const im=new Image();im.decoding='async';imageSources.set(im,{file,promise:null,decoded:false});return im;}
  function ensureImage(im){const source=imageSources.get(im);if(!source)return Promise.resolve(!!im.naturalWidth);if(!source.promise)source.promise=new Promise(resolve=>{im.onload=async()=>{try{await im.decode?.();source.decoded=true;resolve(true);}catch(_){resolve(false);}};im.onerror=()=>resolve(false);im.src=source.file;});return source.promise;}
  const imageReady=im=>imageSources.has(im)?imageSources.get(im).decoded:im.complete&&im.naturalWidth>0;
  const panorama=lazyImage('assets/art/waterfront.png');
  const town={};for(const key of ['homes','metro','market'])town[key]=lazyImage('assets/v57_pano_'+key+'.webp');
  ensureImage(town.homes);
  const tree=new Image(); // Original is fetched only if a derived texture is unavailable.
  const TREE_SOURCE_WIDTH=1024;
  const verge=lazyImage('assets/art/autumn-verge.png');ensureImage(verge);
  const cafe=lazyImage('assets/art/cafe.png'),metro=lazyImage('assets/art/metro.png'),forest=lazyImage('assets/art/forest.png');
  const tiles={},tileTasks=[],preparation={tilesCached:0,treesCached:0,fallback:0,errors:[]};
  const turn=()=>new Promise(resolve=>setTimeout(resolve,0));
  function cachedImage(file,priority='auto'){return new Promise((resolve,reject)=>{const im=new Image();im.fetchPriority=priority;im.onload=async()=>{try{await im.decode?.();resolve(im);}catch(error){reject(error);}};im.onerror=()=>reject(new Error(file));im.src=file;});}
  function tile(name,base,count,palette){
    // Keep the terrain covered while its tiny texture decodes. No thousands of
    // procedural strokes run synchronously during script evaluation anymore.
    const fallback=document.createElement('canvas');fallback.width=fallback.height=1;const fg=fallback.getContext('2d');fg.fillStyle=base;fg.fillRect(0,0,1,1);tiles[name]=fallback;
    tileTasks.push(cachedImage('assets/cache/tile-v19-'+name+'.png').then(im=>{tiles[name]=im;preparation.tilesCached++;}).catch(async()=>{
      preparation.fallback++;const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,256,256);
      for(let from=0;from<count;from+=160){for(let i=from;i<Math.min(count,from+160);i++){g.fillStyle=palette[i%palette.length];const x=noise(i,3)*256,y=noise(i,7)*256;g.fillRect(x,y,noise(i,5)*2.4+.4,noise(i,6)*1.2+.4);}const pixels=g.getImageData(0,0,256,256);g.clearRect(0,0,256,256);g.putImageData(pixels,0,0);await turn();}
      // Flatten the small fallback so future draws cannot replay its strokes.
      const data=g.getImageData(0,0,256,256);g.clearRect(0,0,256,256);g.putImageData(data,0,0);tiles[name]=c;
    }));
  }
  tile('road','#79766b',12500,['#cec0a31f','#161f1c19','#e9dabb16','#383c351d']);
  tile('wood','#6f7150',4500,['#f4d3911d','#252f2428','#b7ab7130']);
  tile('grass','#647447',6500,['#d4ac5b40','#263c2930','#b6b05d40']);
  tile('paving','#a39b83',5500,['#f0dfbc20','#3a392d1c','#e1cb9c22']);
  function shape(c,pts,fill,stroke=ink,width=2){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
  function rect(c,x,y,w,h,fill,stroke=ink,r=0){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.lineWidth=2;c.strokeStyle=stroke;c.stroke();}}
  function ellipse(c,x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();}
  function line(c,pts,col,width){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=col;c.lineWidth=width;c.stroke();}
  function label(c,text,x,y,size=14,col='#f7e9c6'){c.font=`900 ${size}px 'Trebuchet MS',sans-serif`;c.textAlign='center';c.fillStyle=col;c.fillText(text,x,y);c.textAlign='left';}
  function leaf(c,x,y,size,seed){c.save();c.translate(x,y);c.rotate(noise(seed,9)*6.28);shape(c,[[-size*.7,0],[-size,-size*.65],[-size*.2,-size*.5],[0,-size],[size*.3,-size*.35],[size,-size*.45],[size*.7,.2],[.2,size*.5]],['#c78b2b','#d3a941','#a85c2d','#b6ab4e'][Math.abs(seed)%4],null);line(c,[[0,-size*.65],[0,size*.75]],'#84602d',.7);c.restore();}
  const treeCache=new Map();let originalTree;
  function nativeTree(){if(!originalTree)originalTree=new Promise((resolve,reject)=>{tree.decoding='async';tree.onload=async()=>{try{await tree.decode?.();resolve(tree);}catch(error){reject(error);}};tree.onerror=()=>reject(new Error('autumn-tree.png'));tree.src='assets/art/autumn-tree.png';});return originalTree;}
  async function originalTreeVariant(variant){
    const im=await nativeTree(),scale=Math.min(1,700/im.naturalHeight),out=document.createElement('canvas');out.width=im.naturalWidth*scale;out.height=im.naturalHeight*scale;
    const target=out.getContext('2d'),strip=document.createElement('canvas');strip.width=out.width;
    for(let y=0;y<out.height;y+=24){const rows=Math.min(24,out.height-y);strip.height=rows;const g=strip.getContext('2d',{willReadFrequently:true});g.filter=variant===1?'saturate(.84) hue-rotate(-12deg)':variant===2?'saturate(1.1) hue-rotate(7deg)':'none';g.drawImage(im,0,-y,out.width,out.height);target.putImageData(g.getImageData(0,0,out.width,rows),0,y);await turn();}
    return out;
  }
  const treeTasks=[0,1,2].map(async variant=>{
    try{treeCache.set(variant,await cachedImage('assets/cache/tree-v19-'+variant+'.png',variant?'low':'auto'));preparation.treesCached++;}
    catch(_){preparation.fallback++;try{treeCache.set(variant,await originalTreeVariant(variant));}catch(error){preparation.errors.push(error.message);}}
  });
  const loaded=Promise.all([...tileTasks,...treeTasks]);
  function paintedTree(c,x,foot,height,seed){
    // Filtered, downscaled variants are immutable PNGs: the first visible draw
    // has no canvas filter/readback work and cannot replay a lazy display list.
    const variant=Math.abs(seed)%3,art=treeCache.get(variant)||treeCache.get(0)||(tree.complete&&tree.naturalWidth?tree:null);
    if(art){
      const scale=height/1400,ratio=(art.naturalWidth||art.width)/TREE_SOURCE_WIDTH;
      c.drawImage(art,20*ratio,69*ratio,990*ratio,1400*ratio,x+(20-540)*scale,foot+(69-1462)*scale,990*scale,1400*scale);return;
    }
    // Readable fallback while local art loads.
    c.save();c.translate(x,foot);shape(c,[[-12,0],[-9,-170],[-50,-235],[-42,-240],[0,-190],[30,-247],[36,-240],[12,-167],[17,0]],'#6b5136');
    for(let i=0;i<36;i++){const a=noise(i+seed,2)*TAU,r=Math.sqrt(noise(i+seed,4))*height*.28;ellipse(c,Math.cos(a)*r,-height*.72+Math.sin(a)*r*.7,30,25,['#8f9e3e','#b8a43c','#6b823f','#c8a449'][i%4]);}c.restore();
  }
  function range(s,pad=250){return [Math.max(0,s.cameraX-pad),Math.min(s.finish+1200,s.cameraX+s.W+pad)];}
  function ground(s,x){return s.groundAt(x);}
  function strip(c,s,top,bottom,fill,stroke=null){
    const [lo,hi]=range(s,260);
    for(const seg of s.segments){if(seg[1]<lo||seg[0]>hi)continue;const a=Math.max(lo,seg[0]),b=Math.min(hi,seg[1]);
      // Use the segment itself at shared edges; never coerce missing ground to zero.
      const at=x=>seg[2]+(seg[3]-seg[2])*(x-seg[0])/(seg[1]-seg[0]);
      const ya=at(a),yb=at(b),floor=s.cameraY+s.H+500;
      shape(c,[[a,ya+top],[b,yb+top],[b,bottom>=1000?Math.max(yb+bottom,floor):yb+bottom],[a,bottom>=1000?Math.max(ya+bottom,floor):ya+bottom]],fill,stroke,2);}
  }
  function textureStrip(c,s,top,bottom,name){strip(c,s,top,bottom,c.createPattern(tiles[name],'repeat'));}
  function fenceDirect(c,s){
    const [lo,hi]=range(s);const pitch=22;
    for(let x=Math.floor(lo/88)*88;x<hi;x+=88){
      const gy=ground(s,x),next=ground(s,x+88);if(gy===null||next===null)continue;
      const zone=s.districtAt(x).style;
      if(zone==='forest'){
        shape(c,[[x,gy-143],[x+88,next-143],[x+88,next-103],[x,gy-103]],'#7b8470','#455444',1.4);
        line(c,[[x,gy-142],[x+88,next-142]],'#c0b99a',3);
        for(let j=0;j<4;j++){const xx=x+j*23,yy=ground(s,xx);if(yy!==null)line(c,[[xx,yy-139],[xx-5,yy-123]],'#4d5d4c80',1.2);}
        line(c,[[x,gy-122],[x+88,next-122]],'#4f62504f',1.3);
      }else if(zone==='lake'){
        line(c,[[x,gy-157],[x+88,next-157]],'#344f45',3.4);line(c,[[x,gy-130],[x+88,next-130]],'#607c65',2.1);
        for(let j=0;j<4;j++){const xx=x+j*22,yy=ground(s,xx);if(yy!==null)line(c,[[xx,yy-157],[xx,yy-103]],'#425f4c',j===0?3:1.7);}
      }
    }
    const ends=(window.BearlyNeighbourhood?.fenceEnds()||[]).filter(x=>x>lo&&x<hi);
    const cuts=[lo,...ends,hi].sort((a,b)=>a-b);
    c.save();c.beginPath();for(let i=0;i<cuts.length-1;i++){const a=cuts[i],b=cuts[i+1];if(!window.BearlyNeighbourhood?.fenceGap((a+b)/2))c.rect(a,s.cameraY-1000,b-a,s.H+2000);}c.clip();
    for(let x=Math.floor(lo/pitch)*pitch;x<hi;x+=pitch){const y=ground(s,x),y2=ground(s,x+pitch);if(y==null||y2==null||fenceGap(s,x))continue;
      const top=y-196;shape(c,[[x,top+3],[x+pitch,top+(y2-y)+3],[x+pitch,y2-104],[x,y-104]],c.createPattern(tiles.wood,'repeat'),'#414a37',1.2);
      line(c,[[x+4,top+9],[x+4,y-112]],'#a9a47870',1.3);for(let j=0;j<3;j++)line(c,[[x+9+j*3,top+14+noise(x,j)*20],[x+8+j*3,y-110-noise(x,j+4)*17]],'#333c2c35',.7);
    }
    for(const off of [-185,-121]){
      for(let x=Math.floor(lo/90)*90;x<hi;x+=90){const a=ground(s,x),b=ground(s,x+90);if(a==null||b==null||fenceGap(s,x))continue;shape(c,[[x,a+off],[x+90,b+off],[x+90,b+off+8],[x,a+off+8]],'#727657','#3d4632',1.7);line(c,[[x,a+off],[x+90,b+off]],'#adab7b',2);}
    }
    for(let x=Math.floor(lo/176)*176;x<hi;x+=176){const y=ground(s,x);if(y==null||fenceGap(s,x))continue;rect(c,x-7,y-211,15,110,'#6d7150','#3c4434',2);line(c,[[x-4,y-206],[x-4,y-105]],'#acaa7c',2);rect(c,x-9,y-214,19,6,'#969571','#414832',1);}    c.restore();
    for(const x of ends){const y=ground(s,x);if(y===null||['forest','lake'].includes(s.districtAt(x).style))continue;rect(c,x-6,y-210,12,107,'#737854','#3c4434',2);rect(c,x-8,y-214,16,5,'#999a73','#414832',1);}

  }
  function shrubDirect(c,x,y,w,seed){
    if(imageReady(verge)){
      const width=w*1.3,scale=width/2152;
      c.drawImage(verge,12,38,2152,651,x-width*.5,y-650*scale,width,651*scale);return;
    }
    for(let i=0;i<14;i++){const xx=x+(noise(seed+i,8)-.5)*w;const yy=y-noise(seed+i,9)*15;ellipse(c,xx,yy,5+noise(i,6)*5,5,['#68783c','#9c9b42','#b5a547','#4a663a'][i%4]);}
  }
  function shrub(c,x,y,w,seed){
    const entry=(w===74||w===90)&&imageReady(verge)?requireShrub(w):null;
    if(entry?.ready){touchStatic(entry);const width=w*1.3,scale=width/2152;c.drawImage(entry.image,x-width*.5,y-650*scale,entry.width/CHUNK_SCALE,entry.height/CHUNK_SCALE);return;}
    shrubDirect(c,x,y,w,seed);
  }
  function lamp(c,x,y){c.save();c.translate(x,y);ellipse(c,5,2,22,3,'#27312433');rect(c,-4,-220,8,220,'#38483d',ink,2);line(c,[[0,-214],[15,-235],[42,-235]],ink,7);line(c,[[0,-215],[16,-233],[41,-233]],'#7d8770',3);shape(c,[[27,-236],[51,-236],[47,-220],[32,-220]],'#e8c875');rect(c,29,-240,22,5,'#38483d',ink,2);ellipse(c,39,-224,5,2,'#fff1b2');c.restore();}
  function shop(c,x,y,name,seed,paintWidth=735){
    ensureImage(cafe);
    if(imageReady(cafe)){const w=paintWidth,scale=w/1319;c.drawImage(cafe,63,8,1319,1040,x-w/2,y-1039*scale,w,1040*scale);return;}
    c.save();c.translate(x,y);const width=260;const wall=['#c28e63','#b9a177','#ba8062'][Math.abs(seed)%3];
    ellipse(c,0,4,150,10,'#2d352d30');rect(c,-width/2,-250,width,250,wall,ink,2);
    shape(c,[[-144,-247],[0,-296],[144,-247]],'#64584a');line(c,[[-140,-245],[140,-245]],'#d2b389',5);
    for(let j=0;j<3;j++){const xx=-99+j*77;rect(c,xx,-221,43,58,'#334b4b',ink,1);rect(c,xx+4,-217,34,47,'#81a1a0',null);line(c,[[xx+23,-217],[xx+23,-171]],'#e4d5af',3);line(c,[[xx+4,-192],[xx+37,-192]],'#e4d5af',3);rect(c,xx-3,-163,49,5,'#dbc79d',ink,1);}
    rect(c,-126,-140,252,34,'#28483d',ink,3);label(c,name,0,-117,17);
    for(let j=0;j<10;j++)rect(c,-130+j*26,-105,26,20,j%2?'#ead5a2':'#a55236',ink,1);
    rect(c,-111,-80,137,75,'#314744',ink,1);rect(c,-106,-75,127,62,'#8daca0',null);line(c,[[-49,-75],[-49,-13]],'#d5c5a0',4);line(c,[[-102,-69],[-64,-23]],'#c8d9b46a',2);label(c,'KAFFE & KANELBULLAR',-43,-39,7,'#fff1c9');
    rect(c,42,-83,67,83,'#364e44',ink,1);rect(c,49,-76,53,53,'#78968d',ink,0);ellipse(c,95,-15,2,2,'#f1d393');rect(c,-130,-5,260,7,'#807559',ink,1);
    for(let i=0;i<85;i++){const xx=-124+noise(i,seed)*249,yy=-242+noise(i,seed+2)*91;c.fillStyle='#5b513215';c.fillRect(xx,yy,noise(i,3)*12+2,1);}
    c.restore();
  }
  function station(c,x,y,width=900){
    ensureImage(metro);
    if(imageReady(metro)){const w=width,h=w*678/1513;c.drawImage(metro,11,162,1513,678,x-w/2,y-h+3,w,h);return;}
    c.save();c.translate(x,y);ellipse(c,0,3,180,10,'#25372d30');rect(c,-150,-120,300,120,'#748775',ink,3);rect(c,-155,-135,310,23,'#384f46',ink,3);
    for(let i=0;i<5;i++)rect(c,-140+i*57,-105,48,99,'#80a5a0',ink,1);rect(c,-13,-102,26,98,'#2b4542',ink,1);
    rect(c,-121,-173,242,38,'#254e79',ink,4);label(c,'HÄSSELBY GÅRD',0,-148,17,'#f6ecd0');
    rect(c,163,-231,7,231,'#3e5149',ink,1);ellipse(c,166,-235,24,24,'#eee6cd');c.strokeStyle=ink;c.lineWidth=3;c.stroke();label(c,'T',166,-226,27,'#28619a');
    for(let i=0;i<4;i++){line(c,[[-142+i*85,-100],[-115+i*85,-16]],'#dae8ce50',3);}c.restore();
  }
  function parkSign(c,x,y,text,small){c.save();c.translate(x,y);rect(c,-4,-114,8,114,'#7d7150',ink,1);rect(c,-62,-122,124,40,'#315949',ink,3);label(c,text,0,-104,12);if(small)label(c,small,0,-89,7,'#d7cfaa');c.restore();}
  function frontage(s,x,pad=0){return window.BearlyNeighbourhood?.frontage(x,pad)||false;}
  function fenceGap(s,x){return ['forest','lake'].includes(s.districtAt(x).style)||window.BearlyNeighbourhood?.fenceGap(x);}
  function skylineDirect(c,s){const sky=c.createLinearGradient(0,0,0,640);sky.addColorStop(0,'#75acd0');sky.addColorStop(.6,'#b8d0c9');sky.addColorStop(1,'#e5ca9a');c.fillStyle=sky;c.fillRect(0,0,s.W,s.H);c.fillStyle='#7b9e92';for(let i=-1;i<18;i++){const x=i*93-(s.cameraX*.09)%93;rect(c,x,250-noise(i,4)*70,80,140,'#859c8f',null);}c.fillStyle='#699fa8';c.fillRect(0,310,s.W,330);}
  function skylineFallback(c,s){
    const entry=requireSkyline(s);if(entry.ready&&s.cameraX>=0){touchStatic(entry);c.drawImage(entry.image,-(s.cameraX*.09)%93,0);return;}
    skylineDirect(c,s);
  }
  function skyLight(c,s){const entry=requireSkyLight(s);if(entry.ready){touchStatic(entry);c.drawImage(entry.image,0,0);return;}const light=c.createLinearGradient(0,0,s.W,s.H);light.addColorStop(0,'#f4cd6a00');light.addColorStop(1,'#e4b85a13');c.fillStyle=light;c.fillRect(0,0,s.W,s.H);}
  const ease=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);};
  function backdropAt(x){
    // Match the original BQ district order. Open water first appears only when
    // the actual lake district starts, after the woodland descent.
    const metro=ease(5725,7325,x),market=ease(12175,13775,x),woods=ease(20050,21650,x),water=ease(27450,28850,x);
    return {homes:1-metro,metro:metro*(1-market),market:market*(1-woods),forest:woods*(1-water),waterfront:water};
  }
  function prepareFor(x,pad=2500){
    const wanted=new Set([verge]);
    if(x-pad<=7325)wanted.add(town.homes);
    if(x+pad>=5725&&x-pad<=13775)wanted.add(town.metro);
    if(x+pad>=12175&&x-pad<=21650)wanted.add(town.market);
    if(x+pad>=20050&&x-pad<=28850)wanted.add(forest);
    if(x+pad>=27450)wanted.add(panorama);
    for(const building of window.BearlyNeighbourhood?.scenes||[])if(Math.abs(building.x-x)<pad+building.w*.5){if(building.key==='metro')wanted.add(metro);if(building.key==='cafe')wanted.add(cafe);}
    return Promise.all([...wanted].map(ensureImage));
  }
  const prepareAll=()=>Promise.all([...imageSources.keys()].map(ensureImage));
  let prefetchBucket=null;const prefetchNear=x=>{const bucket=Math.floor(x/500);if(bucket!==prefetchBucket){prefetchBucket=bucket;prepareFor(x);}};
  function backdropBand(c,image,crop,s,alpha,mode){
    if(alpha<.001||!imageReady(image))return;
    const [sx,sy,sw,sh]=crop;
    const h=mode==='town'?s.H*.72:mode==='water'?s.H*.78:s.H,w=h*sw/sh,top=mode==='town'?-15:mode==='water'?-110:0;
    const scroll=s.cameraX*(mode==='forest'?.16:.075),first=Math.floor(scroll/w)-1;
    c.save();c.globalAlpha=alpha;
    for(let i=first;i<first+4;i++){
      const x=i*w-scroll;if(x>s.W||x+w<0)continue;
      c.save();if(i%2){c.translate(x+w,top);c.scale(-1,1);c.drawImage(image,sx,sy,sw,sh,0,0,w,h);}else c.drawImage(image,sx,sy,sw,sh,x,top,w,h);c.restore();
    }
    c.restore();
  }
  function roadDirect(c,s){
      textureStrip(c,s,-66,70,'road');
      const [lo,hi]=range(s,230);
      // Raised rear kerb; each stone is a separate sloped block.
      for(let x=Math.floor(lo/62)*62;x<hi;x+=62){const a=ground(s,x),b=ground(s,x+61);if(a==null||b==null)continue;
        shape(c,[[x,a-72],[x+61,b-72],[x+60,b-59],[x,a-59]],'#888674','#4b5144',1.5);
        line(c,[[x+2,a-72],[x+59,b-72]],'#c6bea0',2.2);
      }
      // Sparse worn paint and cracks, deterministic in world coordinates.
      for(let x=Math.floor(lo/230)*230;x<hi;x+=230){const a=ground(s,x),b=ground(s,x+74);if(a==null||b==null)continue;
        line(c,[[x,a+44],[x+74,b+44]],'#c9bfa270',4);for(let j=0;j<7;j++){const xx=x+noise(j,x)*78;const yy=ground(s,xx);if(yy!=null){c.fillStyle='#79766b';c.fillRect(xx,yy+41,noise(j,6)*5+1,2);}}
      }
      for(let k=Math.floor(lo/170);k<hi/170;k++){const x=k*170+noise(k,4)*90,y=ground(s,x);if(y==null)continue;const yy=y-36+noise(k,6)*83;line(c,[[x,yy],[x+8,yy+3],[x+14,yy-2],[x+24,yy+5]],'#4b4c4148',.8);}
      // Near pavement: bevel, weathered face, and individually joined stones.
      textureStrip(c,s,70,101,'paving');
      for(let x=Math.floor(lo/78)*78;x<hi;x+=78){const a=ground(s,x),b=ground(s,x+77);if(a==null||b==null)continue;
        shape(c,[[x,a+71],[x+77,b+71],[x+70,b+92],[x-5,a+92]],'#a7a08a','#595d4f',1.5);
        line(c,[[x+2,a+72],[x+74,b+72]],'#d4c9aa',3);
        shape(c,[[x-5,a+92],[x+70,b+92],[x+70,b+106],[x-5,a+106]],'#646b5b','#404b3e',1.2);
      }
      for(let k=Math.floor(lo/28);k<hi/28;k++){const x=k*28+noise(k,3)*18,y=ground(s,x);if(y==null)continue;const off=noise(k,8)<.58?(-59+noise(k,5)*16):(55+noise(k,5)*46);leaf(c,x,y+off,3+noise(k,4)*4,k);}
  }
  function foregroundDirect(c,s){
      const [lo,hi]=range(s,160);
      for(let k=Math.floor(lo/115);k<hi/115;k++){
        const x=k*115+noise(k,20)*58,y=ground(s,x);if(y==null)continue;
        shrub(c,x,y+130,90,k+55);
        for(let j=0;j<6;j++){const lx=x+(j-3)*14,ly=ground(s,lx);if(ly!==null)leaf(c,lx,ly+114+noise(k+j,18)*18,4,k+j);}
      }
  }
  // Static paths are painted once at the production world zoom. Dynamic actors,
  // buildings, birds, steam and falling leaves keep their existing live layers.
  const CHUNK_WIDTH=512,CHUNK_PAD=128,CHUNK_SCALE=1.35,CHUNK_LIMIT=40*1024*1024;
  const staticChunks=new Map(),staticQueue=[],staticLayers=['fence','road','foreground'],staticContexts=new WeakMap();let nextStaticContext=0;
  function staticContext(s){let id=staticContexts.get(s.segments);if(!id){id=++nextStaticContext;staticContexts.set(s.segments,id);}return id+':'+s.finish;}
  const staticStats={hits:0,misses:0,builds:0,auxBuilds:0,auxBytes:0,evictions:0,direct:0,bytes:0,peakBytes:0,buildingBytes:0,paintMs:0,maxPaintMs:0,bitmapFailures:0};
  let staticPump=false,staticReady=false,lastStaticRange='';
  loaded.then(()=>{staticReady=true;});
  const staticNow=()=>window.performance?.now?.()??Date.now();
  function closeStatic(entry){if(entry.bitmap)entry.image.close();else if(entry.image){entry.image.width=1;entry.image.height=1;}staticStats.bytes-=entry.bytes||0;if(entry.aux)staticStats.auxBytes-=entry.bytes||0;entry.image=null;entry.ready=false;staticStats.evictions++;}
  function trimStatic(reserve=0){for(const [key,entry]of staticChunks){if(staticStats.bytes+reserve<=CHUNK_LIMIT)break;if(!entry.ready)continue;closeStatic(entry);staticChunks.delete(key);}}
  function staticBounds(s,layer,index){
    const left=index*CHUNK_WIDTH-CHUNK_PAD,right=(index+1)*CHUNK_WIDTH+CHUNK_PAD,heights=[];
    for(const seg of s.segments){if(seg[1]<left-180||seg[0]>right+180)continue;for(const x of [Math.max(left-180,seg[0]),Math.min(right+180,seg[1])])heights.push(seg[2]+(seg[3]-seg[2])*(x-seg[0])/(seg[1]-seg[0]));}
    if(!heights.length)return{left,right,top:0,bottom:1};
    const low=Math.min(...heights),high=Math.max(...heights),margin=layer==='fence'?[-250,-75]:layer==='road'?[-85,116]:[70,165];
    return{left,right,top:Math.floor(low+margin[0]),bottom:Math.ceil(high+margin[1])};
  }
  function paintStatic(c,s,layer){if(layer==='fence')fenceDirect(c,s);else if(layer==='road')roadDirect(c,s);else foregroundDirect(c,s);}
  function flattenStatic(c,canvas){const data=c.getImageData(0,0,canvas.width,canvas.height);c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,canvas.width,canvas.height);c.putImageData(data,0,0);}
  async function buildStatic(entry){
    const {s,layer,index,bounds}=entry,width=Math.max(1,Math.ceil((bounds.right-bounds.left)*CHUNK_SCALE)),height=Math.max(1,Math.ceil((bounds.bottom-bounds.top)*CHUNK_SCALE)),bytes=width*height*4;
    // Reserve the temporary raster/readback/bitmap copy as well as retained
    // chunks. A single unusually tall chunk falls back to live geometry.
    if(bytes*3>CHUNK_LIMIT){entry.failed=true;entry.resolve();return;}
    trimStatic(bytes*3);staticStats.buildingBytes=bytes*3;staticStats.peakBytes=Math.max(staticStats.peakBytes,staticStats.bytes+staticStats.buildingBytes);
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const c=canvas.getContext('2d',{willReadFrequently:true}),before=staticNow();
    c.setTransform(CHUNK_SCALE,0,0,CHUNK_SCALE,-bounds.left*CHUNK_SCALE,-bounds.top*CHUNK_SCALE);
    paintStatic(c,{...s,cameraX:index*CHUNK_WIDTH,cameraY:bounds.top,W:CHUNK_WIDTH,H:bounds.bottom-bounds.top},layer);flattenStatic(c,canvas);
    const elapsed=staticNow()-before;staticStats.paintMs+=elapsed;staticStats.maxPaintMs=Math.max(staticStats.maxPaintMs,elapsed);
    let image=canvas,bitmap=false;
    if(window.createImageBitmap){try{image=await window.createImageBitmap(canvas);bitmap=true;canvas.width=1;canvas.height=1;}catch(_){staticStats.bitmapFailures++;}}
    entry.image=image;entry.bitmap=bitmap;entry.width=width;entry.height=height;entry.bytes=bytes;entry.ready=true;entry.s=null;
    staticStats.buildingBytes=0;staticStats.bytes+=bytes;staticStats.builds++;staticStats.peakBytes=Math.max(staticStats.peakBytes,staticStats.bytes);trimStatic();entry.resolve();
  }
  function pumpStatic(){
    if(staticPump||!staticQueue.length)return;staticPump=true;
    setTimeout(async()=>{const entry=staticQueue.shift();try{if(entry.aux)await buildAux(entry);else await buildStatic(entry);}catch(error){entry.failed=true;entry.resolve();preparation.errors.push('static '+entry.key+': '+error.message);}finally{staticStats.buildingBytes=0;staticPump=false;pumpStatic();}},0);
  }
  function requireStatic(s,layer,index){
    const key=staticContext(s)+':'+layer+':'+index;let entry=staticChunks.get(key);if(entry)return entry;
    let resolve;const promise=new Promise(done=>{resolve=done;});entry={key,layer,index,bounds:staticBounds(s,layer,index),s:{...s},promise,resolve,ready:false,failed:false,bytes:0};staticChunks.set(key,entry);staticQueue.push(entry);pumpStatic();return entry;
  }
  function touchStatic(entry){staticChunks.delete(entry.key);staticChunks.set(entry.key,entry);}
  function requireAux(key,width,height,paint){
    key='aux:'+key;let entry=staticChunks.get(key);if(entry)return entry;let resolve;const promise=new Promise(done=>{resolve=done;});entry={key,aux:true,width,height,paint,promise,resolve,ready:false,failed:false,bytes:0};staticChunks.set(key,entry);staticQueue.push(entry);pumpStatic();return entry;
  }
  function requireShrub(w){const width=w*1.3,height=651*width/2152;return requireAux('shrub:'+w,Math.ceil(width*CHUNK_SCALE),Math.ceil(height*CHUNK_SCALE),c=>{c.scale(CHUNK_SCALE,CHUNK_SCALE);c.drawImage(verge,12,38,2152,651,0,0,width,height);});}
  function requireSkyline(s){return requireAux('skyline:'+s.W+':'+s.H,s.W+93,s.H,c=>skylineDirect(c,{...s,cameraX:0,W:s.W+93}));}
  function requireSkyLight(s){return requireAux('skylight:'+s.W+':'+s.H,s.W,s.H,c=>{const light=c.createLinearGradient(0,0,s.W,s.H);light.addColorStop(0,'#f4cd6a00');light.addColorStop(1,'#e4b85a13');c.fillStyle=light;c.fillRect(0,0,s.W,s.H);});}
  async function buildAux(entry){
    const bytes=entry.width*entry.height*4;if(bytes*3>CHUNK_LIMIT){entry.failed=true;entry.resolve();return;}trimStatic(bytes*3);staticStats.buildingBytes=bytes*3;staticStats.peakBytes=Math.max(staticStats.peakBytes,staticStats.bytes+staticStats.buildingBytes);
    const canvas=document.createElement('canvas');canvas.width=entry.width;canvas.height=entry.height;const c=canvas.getContext('2d',{willReadFrequently:true}),before=staticNow();entry.paint(c);flattenStatic(c,canvas);const elapsed=staticNow()-before;staticStats.paintMs+=elapsed;staticStats.maxPaintMs=Math.max(staticStats.maxPaintMs,elapsed);
    let image=canvas,bitmap=false;if(window.createImageBitmap){try{image=await window.createImageBitmap(canvas);bitmap=true;canvas.width=1;canvas.height=1;}catch(_){staticStats.bitmapFailures++;}}
    entry.image=image;entry.bitmap=bitmap;entry.bytes=bytes;entry.ready=true;entry.paint=null;staticStats.buildingBytes=0;staticStats.bytes+=bytes;staticStats.auxBytes+=bytes;staticStats.auxBuilds++;staticStats.peakBytes=Math.max(staticStats.peakBytes,staticStats.bytes);trimStatic();entry.resolve();
  }
  function visibleStaticIndices(s,pad=250){const [lo,hi]=range(s,pad),first=Math.floor(lo/CHUNK_WIDTH),last=Math.floor(hi/CHUNK_WIDTH);return{first,last};}
  function queueStaticNear(s){
    if(!staticReady)return[];const {first,last}=visibleStaticIndices(s),signature=staticContext(s)+':'+first+':'+last;if(signature===lastStaticRange)return[];lastStaticRange=signature;
    const jobs=[];for(let index=first;index<=last+1;index++)for(const layer of staticLayers)jobs.push(requireStatic(s,layer,index).promise);return jobs;
  }
  async function warmupScene(s){await Promise.all([loaded,prepareFor(s.bikeX??s.cameraX+s.W*.36)]);staticReady=true;await Promise.all([requireShrub(74).promise,requireShrub(90).promise,requireSkyline(s).promise,requireSkyLight(s).promise]);lastStaticRange='';await Promise.all(queueStaticNear(s));return staticCacheStats();}
  function drawStaticLayer(c,s,layer){
    if(!staticReady){paintStatic(c,s,layer);return;}queueStaticNear(s);const {first,last}=visibleStaticIndices(s,layer==='foreground'?160:250);
    for(let index=first;index<=last;index++){
      const entry=requireStatic(s,layer,index),left=index*CHUNK_WIDTH,m=c.getTransform();
      // Adjacent clips meet on one physical pixel boundary. Fractional-alpha
      // rectangle clips would otherwise leave a faint seam between chunks.
      const clipLeft=Math.abs(m.b)+Math.abs(m.c)<1e-8?(Math.round(m.a*left+m.e)-m.e)/m.a:left,clipRight=Math.abs(m.b)+Math.abs(m.c)<1e-8?(Math.round(m.a*(left+CHUNK_WIDTH)+m.e)-m.e)/m.a:left+CHUNK_WIDTH;
      c.save();c.beginPath();c.rect(clipLeft,entry.bounds.top,clipRight-clipLeft,entry.bounds.bottom-entry.bounds.top);c.clip();
      if(entry.ready){staticStats.hits++;staticChunks.delete(entry.key);staticChunks.set(entry.key,entry);c.drawImage(entry.image,entry.bounds.left,entry.bounds.top,entry.width/CHUNK_SCALE,entry.height/CHUNK_SCALE);}
      else{staticStats.misses++;staticStats.direct++;paintStatic(c,s,layer);}c.restore();
    }
  }
  function staticCacheStats(){return{mode:'immutable-raster-chunks',chunkWidth:CHUNK_WIDTH,overscan:CHUNK_PAD,scale:CHUNK_SCALE,limitBytes:CHUNK_LIMIT,...staticStats,entries:staticChunks.size,ready:[...staticChunks.values()].filter(e=>e.ready).length,pending:staticQueue.length+(staticPump?1:0)};}
  window.BearlyWorld={
    loaded,prepareFor,prepareAll,warmupScene,cacheStats:staticCacheStats,audit:()=>({...preparation,staticCache:staticCacheStats(),treeVariants:treeCache.size,requestedImages:[...imageSources.values()].filter(s=>s.promise).map(s=>s.file),mode:preparation.fallback?'cooperative-source':'precompiled'}),station,cafe:(c,x,y,width)=>shop(c,x,y,'FIKA',0,width),backdropAt,material:(c,name)=>tiles[name]?c.createPattern(tiles[name],'repeat'):null,
    sky(c,s){
      skylineFallback(c,s);
      if(!s.backdrop)return;
      const x=s.footActive?s.cameraX+s.W*.36:(s.bikeX??s.cameraX+s.W*.36),weights=backdropAt(x);prefetchNear(x);
      // The original suburban panels include a far lake at their opposite edge;
      // use the complete housing side so early streets stay inside town.
      let weight=0;
      const band=(image,crop,amount,mode)=>{if(amount<.001)return;ensureImage(image);weight+=amount;backdropBand(c,image,crop,s,amount/weight,mode);};
      band(town.homes,[0,0,850,380],weights.homes,'town');
      band(town.metro,[0,0,850,380],weights.metro,'town');
      band(town.market,[850,0,686,380],weights.market,'town');
      band(forest,[0,0,forest.naturalWidth||1536,forest.naturalHeight||1024],weights.forest,'forest');
      band(panorama,[0,0,panorama.naturalWidth||1536,panorama.naturalHeight||1024],weights.waterfront,'water');
      // This lower field is hidden behind the terrain bank; its colour follows
      // the actual district instead of leaving a turquoise water band in town.
      c.save();c.globalAlpha=1;c.fillStyle=weights.waterfront>.5?'#75a7aa':'#778364';c.fillRect(0,s.H*.80,s.W,s.H*.2);c.restore();
      skyLight(c,s);
    },
    backstreet(c,s){
      const [lo,hi]=range(s,400);
      // Terrain beneath the street, including true gaps in the original track.
      // A continuous rear terrain bank supports roots and entire building footprints.
      // The lower edge covers the transformed viewport even late in the descent.
      strip(c,s,-180,1800,c.createPattern(tiles.grass,'repeat'));
      strip(c,s,-125,-99,'#7a805345');
      const style=s.district.style;
      // Trees sit behind the fence, never on the rideable collision surface.
      const step=420;
      for(let k=Math.floor(lo/step)-1;k<hi/step+1;k++){
        const x=k*step+70+noise(k,19)*85,y=ground(s,x);if(y==null||frontage(s,x,75))continue;
        const forest=s.districtAt(x).style==='forest';
        const h=(forest?390:340)+noise(k,20)*95;
        paintedTree(c,x,y-110,h,k+13);
        if(forest){const xx=x+170,yy=ground(s,xx);if(yy!==null&&!frontage(s,xx,75))paintedTree(c,xx,yy-115,340+noise(k,5)*80,k+19);}
      }
      drawStaticLayer(c,s,'fence');
      window.BearlyNeighbourhood.buildings(c,s);
      // Broken-up planted verge at the fence base, then a stone footpath.
      for(let k=Math.floor(lo/65);k<hi/65;k++){const x=k*65,y=ground(s,x);if(y==null)continue;if(!frontage(s,x,30))shrub(c,x,y-106,74,k);}
      textureStrip(c,s,-99,-69,'paving');
      window.BearlyNeighbourhood.entrances(c,s);
      for(let x=Math.floor(lo/62)*62;x<hi;x+=62){const y=ground(s,x);if(y==null)continue;line(c,[[x,y-98],[x-7,y-70]],'#5b5c4a60',1);}
      for(let k=Math.floor(lo/1050);k<hi/1050;k++){const x=k*1050+780,y=ground(s,x);if(y==null||frontage(s,x,30))continue;lamp(c,x,y-91);}
      for(let k=Math.floor(lo/670);k<hi/670;k++){
        const x=k*670+520,y=ground(s,x),type=k%3===0?'bin':'bench',width=type==='bench'?196:68;
        if(y==null||frontage(s,x,width*.5+12))continue;
        // Activity furniture already occupies this sidewalk footprint. Avoid
        // painting a second small bench/bin through its legs and backrest.
        if(window.BearlyStreetLife?.overlaps?.(x,width*.5+12))continue;
        window.BearlyStreetProps?.draw(c,type,x,y-84,width,s.time);
      }
      for(let k=Math.floor(lo/2200);k<hi/2200;k++){const x=k*2200+330,y=ground(s,x);if(y==null||frontage(s,x,95))continue;const zone=s.districtAt(x).style;parkSign(c,x,y-97,zone==='lake'?'MÄLAREN':zone==='forest'?'GRIMSTA':'HÄSSELBY',zone==='lake'?'STRANDPROMENAD':'CYKELVÄG  /  CYCLE ROUTE');}
      window.BearlyNeighbourhood.life(c,s);
    },
    road(c,s){drawStaticLayer(c,s,'road');},
    foreground(c,s){
      drawStaticLayer(c,s,'foreground');const [lo,hi]=range(s,160);
      // Falling leaves are atmospheric, rather than a full-screen effect.
      if(!s.reducedMotion){for(let k=Math.floor(lo/330);k<hi/330;k++){const x=k*330+120+Math.sin(s.time*.5+k)*27,y=ground(s,x);if(y==null)continue;const drift=(s.time*15+k*81)%240;leaf(c,x,y-340+drift,3.4,k);}}
    },
    ready(){return{panorama:imageReady(panorama),tree:treeCache.has(0)||tree.complete&&tree.naturalWidth>0,verge:imageReady(verge),cafe:imageReady(cafe),metro:imageReady(metro),forest:imageReady(forest),town:Object.values(town).every(imageReady)};}
  };
})();
