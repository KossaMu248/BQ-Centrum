/* Authored Centrum viewing angles. Source riding/transfers/side view stay in
   HeroRig; this module owns only fixed art pieces and no animation/input loop. */
(() => {
  'use strict';
  const STATURE=488,PAINTED_HEIGHT=512,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const point=(x,y)=>({x,y}),copy=value=>JSON.parse(JSON.stringify(value));
  const LOWER_BABY={source:'assets/art/front-carrier-v7.png',waist:[238,298],paths:[
    [[242,296],[245,295],[248,296],[253,298],[257,303],[259,310],[260,318],[259,322],[263,325],[270,328],[277,332],[282,337],[283,343],[281,347],[276,351],[269,354],[261,357],[253,357],[246,355],[243,354],[241,351],[240,347],[239,344],[240,338],[241,334],[239,330],[237,324],[235,316],[234,308],[235,302],[238,297]],
    [[266,303],[268,304],[270,309],[270,316],[270,321],[274,323],[280,326],[284,329],[287,334],[287,339],[285,343],[281,346],[275,345],[269,342],[263,336],[261,330],[262,324],[263,319],[265,313],[265,308]]
  ]};
  // Metadata is measured against the actual approved source sheet, not guessed
  // from a requested image size. configure() is also useful for renderer labs.
  let definition=null,prepared={},preparing=null,failure=null,lastAudit=null,lowerBaby=null;
  let counts={preparations:0,draws:0,drawCalls:0,partBytes:0};
  function viewForMotion(motion,previous='side'){
    if(!motion||!Number.isFinite(motion.y)||(motion.metricSpeed??1)<1e-7)return previous;
    const amount=Math.abs(motion.y),threshold=previous==='side'?.55:.35;
    return amount>threshold?(motion.y<0?'away':'toward'):'side';
  }
  function configure(value){
    if(preparing)throw Error('Directional art is already preparing');
    definition=copy(value);prepared={};failure=null;return true;
  }
  function image(url){return new Promise((resolve,reject)=>{const im=new Image();im.decoding='async';im.onload=()=>im.decode?im.decode().then(()=>resolve(im),reject):resolve(im);im.onerror=()=>reject(Error('Unable to load directional art '+url));im.src=url;});}
  function trace(c,polygon){c.beginPath();polygon.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();}
  function part(source,polygon){
    const left=Math.floor(Math.min(...polygon.map(p=>p[0])))-1,top=Math.floor(Math.min(...polygon.map(p=>p[1])))-1;
    const right=Math.ceil(Math.max(...polygon.map(p=>p[0])))+1,bottom=Math.ceil(Math.max(...polygon.map(p=>p[1])))+1;
    const canvas=document.createElement('canvas');canvas.width=right-left;canvas.height=bottom-top;
    const c=canvas.getContext('2d');c.translate(-left,-top);trace(c,polygon);c.clip();c.drawImage(source,0,0);
    // Store pixels once rather than retaining a clipped draw display list.
    const pixels=c.getImageData(0,0,canvas.width,canvas.height);c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,canvas.width,canvas.height);c.putImageData(pixels,0,0);
    counts.partBytes+=canvas.width*canvas.height*4;
    return{image:canvas,left,top,width:canvas.width,height:canvas.height};
  }
  function prepareView(source,raw,name){
    const [sx,sy,sw,sh]=raw.rect,normal=PAINTED_HEIGHT/raw.height;
    const canvas=document.createElement('canvas');canvas.width=Math.ceil(sw*normal);canvas.height=Math.ceil(sh*normal);
    const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(source,sx,sy,sw,sh,0,0,sw*normal,sh*normal);
    // Generated background fringe has alpha1; it is not part of the parent.
    // This bounded preparation touches only new parent art, never baby pixels.
    const pixels=c.getImageData(0,0,canvas.width,canvas.height);for(let i=3;i<pixels.data.length;i+=4)if(pixels.data[i]<8)pixels.data[i]=0;c.putImageData(pixels,0,0);
    const P=([x,y])=>[(x-sx)*normal,(y-sy)*normal],poly=p=>p.map(P),origin=P(raw.ground),legs={};
    for(const side of ['far','near']){
      const l=raw.legs[side];legs[side]={hip:P(l.hip),knee:P(l.knee),cuff:P(l.cuff),sole:P(l.sole),
        pants:part(canvas,poly(l.pants)),calf:part(canvas,poly(l.calf)),boot:part(canvas,poly(l.boot))};
    }
    const middleHip=(legs.near.hip[0]+legs.far.hip[0])*.5;
    for(const l of Object.values(legs)){
      const dx=l.cuff[0]-l.hip[0],dy=l.cuff[1]-l.hip[1],length=Math.hypot(dx,dy)||1,kx=l.knee[0]-l.hip[0],ky=l.knee[1]-l.hip[1];
      l.kneeAlong=clamp((kx*dx+ky*dy)/(length*length),.25,.75);
      l.kneeAcross=(kx*dy-ky*dx)/length;l.bendSign=Math.sign(l.hip[0]-middleHip)||1;
    }
    const lip=poly(raw.lip),middle=[(lip[0][0]+2*lip[1][0]+lip[2][0])/4,(lip[0][1]+2*lip[1][1]+lip[2][1])/4];
    const waist=[middle[0]+9.5,middle[1]+8.25],head={box:[waist[0]-55,waist[1]-125,83,85],neck:[waist[0]-6,waist[1]-43],angle:0};
    const layout={name:'centrum-'+name,head,upper:{box:[waist[0]-56,waist[1]-126,94,131],waist,lip,source:definition.image},rect:[0,0,canvas.width,canvas.height],origin};
    return{name,source:canvas,origin,normal,raw,body:part(canvas,poly(raw.body)),belt:raw.belt?part(canvas,poly(raw.belt)):null,legs,layout,waist,
      frontMasks:(raw.frontMasks||[]).map(p=>part(canvas,poly(p))),sourceAsset:definition.image};
  }
  async function preload(){
    if(preparing)return preparing;
    if(!definition||!definition.views?.toward||!definition.views?.away)return false;
    failure=null;
    preparing=(async()=>{
      const [sheet,child]=await Promise.all([image(definition.image),image(LOWER_BABY.source)]);
      const lowerCanvas=document.createElement('canvas');lowerCanvas.width=child.naturalWidth;lowerCanvas.height=child.naturalHeight;
      const c=lowerCanvas.getContext('2d');c.beginPath();for(const path of LOWER_BABY.paths){path.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();}c.clip();c.drawImage(child,0,0);
      lowerBaby=part(lowerCanvas,[[232,293],[289,293],[289,359],[232,359]]);
      for(const name of ['toward','away'])prepared[name]=prepareView(sheet,definition.views[name],name);
      counts.preparations++;return true;
    })().catch(error=>{
      failure=String(error?.message||error);
      // A failed explicit scene entry can be retried. draw() never starts loads.
      const release=p=>{if(p?.image){p.image.width=1;p.image.height=1;}};
      for(const view of Object.values(prepared)){release(view.body);release(view.belt);for(const p of view.frontMasks)release(p);for(const leg of Object.values(view.legs))for(const key of ['pants','calf','boot'])release(leg[key]);view.source.width=1;view.source.height=1;}
      release(lowerBaby);prepared={};lowerBaby=null;counts.partBytes=0;preparing=null;return false;
    });
    return preparing;
  }
  function drawPart(c,p,map){
    if(!map){c.drawImage(p.image,p.left,p.top);return;}
    // Each part has one affine transform; no grid can fold between the legs.
    const a=map(point(0,0)),b=map(point(1,0)),d=map(point(0,1));
    c.save();c.transform(b.x-a.x,b.y-a.y,d.x-a.x,d.y-a.y,a.x,a.y);c.drawImage(p.image,p.left,p.top);c.restore();
  }
  function segmentMap(a,b,A,B){
    const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1,ux=dx/length,uy=dy/length,tx=B.x-A.x,ty=B.y-A.y,target=Math.hypot(tx,ty)||1;
    return p=>{const along=((p.x-a[0])*ux+(p.y-a[1])*uy)/length,across=(p.x-a[0])*uy-(p.y-a[1])*ux;return{x:A.x+tx*along+ty/target*across,y:A.y+ty*along-tx/target*across};};
  }
  function draw(c,px,py,h,face,options={}){
    const view=prepared[options.centrumView],state=options.state||{};
    if(!view||!lowerBaby||!window.BearlyBabyPassenger?.ready()||!window.BearlyHeroRig?.ready()||state.baby||state.hp===0||state.hurt||state.attack||state.held)return false;
    const scale=h/STATURE,weight=clamp(options.weight||0,0,1),native=window.BearlyLocomotion.pose(options.distance||0,h,weight),gait=window.BearlyCentrumDepthGait?.project(native,options.groundMotion)||native;
    const bob=(gait.bob||0)*.65,roll=(gait.roll||0)*.55,sway=(gait.sway||0)*.55,legs={};let drawCalls=0;
    const pivot={x:view.origin[0],y:(view.legs.near.hip[1]+view.legs.far.hip[1])*.5},br=Math.cos(roll),bs=Math.sin(roll);
    const bodyMap=p=>({x:pivot.x+(p.x-pivot.x)*br-(p.y-pivot.y)*bs+sway/scale,y:pivot.y+(p.x-pivot.x)*bs+(p.y-pivot.y)*br+bob/scale});
    c.save();c.translate(px,py);if(face<0)c.scale(-1,1);
    c.save();c.scale(scale,scale);c.translate(-view.origin[0],-view.origin[1]);
    for(const side of ['far','near']){
      const l=view.legs[side],f=gait[side],dx=f.x/scale,dy=f.y/scale,turn=clamp((f.angle||0)*.35,-.05,.05),cs=Math.cos(turn),sn=Math.sin(turn),sole=point(l.sole[0]+dx,l.sole[1]+dy);
      const rigid=p=>{const x=p.x-l.sole[0],y=p.y-l.sole[1];return{x:sole.x+x*cs-y*sn,y:sole.y+x*sn+y*cs};};
      const cuff=rigid(point(...l.cuff)),hip=bodyMap(point(...l.hip)),dxBone=cuff.x-hip.x,dyBone=cuff.y-hip.y,boneLength=Math.hypot(dxBone,dyBone)||1;
      // Keep the authored rest knee and a small outward swing bend. Squaring
      // native flex makes its added velocity zero at toe-off and landing.
      // Feet stay in their existing floor frame; no shoe scaling or leg IK.
      const flex=clamp(f.kneeFlex||0,0,1),kneeBend=l.bendSign*STATURE*.016*flex*flex,across=l.kneeAcross+kneeBend;
      const knee=point(hip.x+dxBone*l.kneeAlong+dyBone/boneLength*across,hip.y+dyBone*l.kneeAlong-dxBone/boneLength*across);
      drawPart(c,l.pants,segmentMap(l.hip,l.knee,hip,knee));drawPart(c,l.calf,segmentMap(l.knee,l.cuff,knee,cuff));drawPart(c,l.boot,rigid);drawCalls+=3;
      legs[side]={hip,knee,cuff,sole,contact:point(l.sole[0]+dx,l.sole[1]+(f.groundDepth||0)/scale),stance:f.stance,sourceFoot:side,kneeBend:kneeBend*scale};
    }
    drawPart(c,view.body,bodyMap);drawCalls++;if(view.belt){drawPart(c,view.belt,bodyMap);drawCalls++;}
    drawPart(c,lowerBaby,p=>bodyMap({x:p.x+view.waist[0]-LOWER_BABY.waist[0],y:p.y+view.waist[1]-LOWER_BABY.waist[1]}));drawCalls++;
    c.restore();
    const pivotX=(pivot.x-view.origin[0])*scale,pivotY=(pivot.y-view.origin[1])*scale;
    c.save();c.translate(pivotX+sway,pivotY+bob);c.rotate(roll);c.translate(-pivotX,-pivotY);
    const babyFace=window.BearlyHeroRig.drawPassengerLayout(c,view.source,view.layout,scale,{...options,weight});drawCalls+=2;
    c.restore();
    c.save();c.scale(scale,scale);c.translate(-view.origin[0],-view.origin[1]);
    for(const p of view.frontMasks){drawPart(c,p,bodyMap);drawCalls++;}
    c.restore();c.restore();counts.draws++;counts.drawCalls=drawCalls;
    const world=v=>({x:(v.x-view.origin[0])*scale,y:(v.y-view.origin[1])*scale}),landmarks={};
    for(const side of ['far','near'])landmarks[side]={...Object.fromEntries(['hip','knee','cuff','sole','contact'].map(k=>[k,world(legs[side][k])])),stance:legs[side].stance,sourceFoot:side,rigidShoe:true,kneeBend:legs[side].kneeBend};
    lastAudit={pose:'walking',view:view.name,authoredView:true,sourceAsset:view.sourceAsset,source:view.sourceAsset,carrier:'front',integratedCarrier:true,height:h,babyFace,
      landmarks,gait,body:{continuous:true,surfaces:1,roll,bob,sway,authoredViewingAngle:true},directional:{view:view.name,asset:view.sourceAsset,framePhase:gait.phase,drawCalls,preparedParts:Object.keys(prepared).length,sourceBabyLower:LOWER_BABY.source,sourceBabyLowerScale:scale,sourceBabyOriginalScale:85/61*scale,groundAnchor:{x:px,y:py+(options.jump||0)}}};
    return lastAudit;
  }
  configure({image:'assets/centrum/actors/bear-directions.png',views:{
    toward:{rect:[108,10,566,992],height:983,ground:[383,998],
      body:[[108,10],[678,10],[678,652],[585,657],[526,677],[390,680],[251,674],[171,659],[108,650]],
      belt:[[342,661],[424,664],[430,740],[406,752],[385,754],[353,741]],
      lip:[[352,563],[438,588],[530,561]],
      legs:{
        far:{hip:[480,670],knee:[480,758],cuff:[480,835],sole:[494,995],
          pants:[[385,665],[565,661],[584,738],[553,755],[486,768],[412,757],[390,738]],
          calf:[[414,748],[480,764],[550,746],[565,777],[558,807],[547,832],[508,844],[455,838],[416,824],[401,799],[403,769]],
          boot:[[420,825],[448,820],[498,819],[537,825],[551,845],[553,878],[559,912],[577,952],[578,975],[552,989],[503,998],[454,994],[419,981],[402,970],[403,945],[414,907],[418,869]]},
        near:{hip:[282,669],knee:[280,757],cuff:[277,835],sole:[271,995],
          pants:[[197,660],[405,667],[404,743],[376,759],[291,763],[221,751],[188,733]],
          calf:[[215,744],[256,754],[340,760],[360,752],[357,784],[348,813],[337,832],[293,840],[242,831],[214,815],[194,787],[196,763]],
          boot:[[214,824],[239,818],[296,819],[334,826],[343,851],[337,882],[350,914],[361,949],[355,975],[326,992],[271,998],[219,990],[189,979],[185,960],[197,925],[207,888],[208,855]]}
      }},
    away:{rect:[866,14,482,990],height:980,ground:[1068,999],
      body:[[866,14],[1348,14],[1348,643],[1260,658],[1190,678],[1070,675],[962,662],[885,634],[866,600]],
      belt:[[1004,655],[1068,664],[1091,752],[1050,761],[1015,747]],
      lip:[[1230,545],[1280,561],[1330,540]],
      legs:{
        far:{hip:[972,669],knee:[966,759],cuff:[962,833],sole:[967,983],
          pants:[[915,654],[1037,667],[1069,750],[1015,771],[929,758],[900,741]],
          calf:[[906,745],[946,759],[1019,763],[1024,784],[1010,813],[997,833],[974,841],[936,838],[909,828],[892,804],[894,773]],
          boot:[[899,821],[938,829],[987,825],[1007,837],[1007,872],[1036,896],[1055,920],[1067,938],[1061,958],[1034,974],[980,984],[925,975],[885,961],[870,947],[878,915],[892,881]]},
        near:{hip:[1133,674],knee:[1137,769],cuff:[1137,849],sole:[1168,997],
          pants:[[1032,660],[1228,658],[1241,737],[1205,763],[1143,774],[1071,771],[1031,752]],
          calf:[[1070,758],[1137,775],[1206,759],[1215,783],[1211,814],[1202,839],[1172,852],[1104,849],[1076,838],[1059,813],[1057,788]],
          boot:[[1063,841],[1120,850],[1184,835],[1211,845],[1211,881],[1247,905],[1289,928],[1298,949],[1291,978],[1252,994],[1170,999],[1104,986],[1065,972],[1050,953],[1060,917]]}
      }}
  }});
  window.BearlyCentrumDirectionalRig={configure,preload,draw,viewForMotion,ready:()=>!!prepared.toward&&!!prepared.away,
    audit:()=>lastAudit?copy(lastAudit):null,stats:()=>({...counts,sourceBytes:Object.values(prepared).reduce((sum,view)=>sum+view.source.width*view.source.height*4,0),ready:!!prepared.toward&&!!prepared.away,failure,views:Object.keys(prepared),hasOwnAnimationLoop:false,hasOwnInputListeners:false}),definition:()=>definition?copy(definition):null};
})();
