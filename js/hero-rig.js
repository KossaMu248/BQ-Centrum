/* One opaque on-foot figure: original cloth/fur, rigid authored shoes and native passenger. */
(() => {
  'use strict';
  const images={},clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const imageFiles={nearContact:'bear-near-contact-v18.png',nearSupport:'bear-near-support-v18.png',farPoses:'bear-far-poses-v18.png',lowerIdle:'bear-idle-lower-v18.png',front:'front-carrier-v7.png',back:'back-carrier-v11.png',reactions:'carrier-reactions-v11.png',parts:'matched-legs-v11.png',frontBackground:'front-background-v11-2.png',backBackground:'back-background-v11-2.png',reactionBackground:'reaction-background-v11-2.png',boatBackground:'boat-background-v11-2.png',transferBackground:'transfer-background-v11-2.png'};
  const decodedImages=new Set();let preloadPromise=null,preloadStarted=false;
  // Walking/carrier artwork is optional while riding. Start these requests only
  // after the critical cycling scene can draw, or when a visit requests them.
  for(const key of Object.keys(imageFiles))images[key]=new Image();
  function preload(){
    if(preloadPromise)return preloadPromise;preloadStarted=true;
    preloadPromise=Promise.all(Object.entries(imageFiles).map(([key,file])=>new Promise((resolve,reject)=>{
      const im=images[key];let finished=false;
      const finish=()=>{if(finished)return;finished=true;decodedImages.add(key);resolve();};
      im.decoding='async';im.fetchPriority='low';
      im.onload=()=>{if(typeof im.decode==='function')im.decode().then(finish,reject);else finish();};
      im.onerror=()=>reject(new Error('Unable to load carrier artwork: '+file));
      im.src='assets/art/'+file;
      if(im.naturalWidth>0&&typeof im.decode!=='function')finish();
    })));
    return preloadPromise;
  }
  const heads={
    front:{box:[183,173,83,85],neck:[232,255],angle:0},
    back:{box:[270,79,84,78],neck:[320,154],angle:-.08},
    grab:{box:[940,70,84,82],neck:[990,149],angle:-.06},
    maul:{box:[360,544,82,80],neck:[399,620],angle:.06},
    backHurt:{box:[955,541,83,78],neck:[1003,616],angle:-.08},
    frontHurt:{box:[358,204,111,109],neck:[421,309],angle:-.06},
    collapse:{box:[966,108,128,116],neck:[1053,221],angle:-.14},
    defeated:{box:[1814,178,115,111],neck:[1880,286],angle:-.06},
    boat:{box:[471,464,199,198],neck:[592,658],angle:0},
    transfer2:{box:[1332,140,92,85],neck:[1366,222],angle:0,flip:-1},
    transfer3:{box:[366,628,90,82],neck:[405,705],angle:0,flip:-1},
    transfer4:{box:[772,678,87,82],neck:[824,757],angle:0},
    transfer5:{box:[1267,678,88,85],neck:[1320,760],angle:0}
  };
  const backgrounds={front:'frontBackground',back:'backBackground',grab:'backBackground',maul:'backBackground',backHurt:'backBackground',frontHurt:'reactionBackground',collapse:'reactionBackground',defeated:'reactionBackground',boat:'boatBackground',transfer2:'transferBackground',transfer3:'transferBackground',transfer4:'transferBackground',transfer5:'transferBackground'};
  // All landmarks are measured in the SAME source coordinates as the carrier torso.
  // Image-left is the near leg in these right-facing three-quarter paintings.
  const profiles={
    front:{image:'front',stature:488,origin:[179,500],torso:[51,13,256,377],waist:365,pelvisY:335,near:{hip:[137,386],sole:[155,500],cuff:[131,420],furWidth:84,boot:[85,418,125,84]},far:{hip:[207,384],sole:[220,491],cuff:[202,418],furWidth:65,boot:[164,414,108,78]}},
    back:{image:'back',stature:507,origin:[414,516],torso:[252,4,310,398],waist:370,pelvisY:345,near:{hip:[363,397],sole:[373,516],cuff:[351,436],furWidth:86,boot:[305,429,134,88]},far:{hip:[451,395],sole:[483,506],cuff:[445,433],furWidth:68,boot:[408,427,127,80]}}
  };
  // Complete painted figures: baby, fabric seat, shoulder straps, waist belt and arms stay together.
  const actions={
    backIdle:{image:'back',rect:[252,4,310,516],origin:[404,516],stature:507},
    grab:{image:'back',rect:[817,8,564,504],origin:[1061,506],stature:507},
    maul:{image:'back',rect:[146,531,635,456],origin:[440,981],stature:507},
    backHurt:{image:'back',rect:[933,503,479,510],origin:[1174,1008],stature:507},
    frontHurt:{image:'reactions',rect:[61,7,515,705],origin:[315,705],stature:696},
    collapse:{image:'reactions',rect:[747,102,664,604],origin:[1085,704],stature:696},
    defeated:{image:'reactions',rect:[1528,173,592,530],origin:[1835,701],stature:696}
  };
  let parts=null,lastAudit={},nativeFrames=null;
  const preparedBodies=new Map();
  const upperBodies={
    front:{box:[182,172,94,131],waist:[238,298],raise:6,lip:[[198,294],[226,299],[264,291]]},
    back:{box:[269,78,88,139],waist:[302,212],raise:20,lip:[[276,208],[302,216],[328,203]]},
    grab:{box:[939,69,89,149],waist:[962,214],raise:20,lip:[[922,211],[959,220],[984,204]]},
    maul:{box:[330,542,114,136],waist:[344,670],raise:20,lip:[[313,667],[344,680],[376,653]]},
    backHurt:{box:[952,539,94,154],waist:[994,691],raise:16,lip:[[974,679],[994,697],[1020,677]]},
    frontHurt:{box:[357,202,113,174],waist:[409,373],source:'reactions',lip:[[361,361],[402,379],[446,360]]},
    collapse:{box:[941,106,158,191],waist:[973,291],raise:18,source:'reactions',texture:[944,215,20,24],lip:[[924,285],[962,300],[1003,274]]},
    defeated:{box:[1768,176,160,165],waist:[1800,338],raise:18,source:'reactions',texture:[1800,270,20,24],lip:[[1743,323],[1789,342],[1832,319]]},
    boat:{box:[470,463,222,310],waist:[614,770],raise:15,source:'boatOriginal',texture:[543,792,50,30],lip:[[500,747],[551,765],[684,747]]},
    transfer2:{box:[1289,138,138,145],waist:[1344,278],lip:[[1308,266],[1342,282],[1375,266]]},
    transfer3:{box:[351,627,108,143],waist:[378,764],lip:[[350,753],[379,768],[409,750]]},
    transfer4:{box:[771,676,111,132],waist:[829,803],lip:[[791,792],[829,807],[866,789]]},
    transfer5:{box:[1265,676,102,135],waist:[1327,806],lip:[[1288,794],[1325,810],[1362,791]]}
  };
  function ready(){return preloadStarted&&Object.keys(imageFiles).every(key=>images[key].naturalWidth>0&&(typeof images[key].decode!=='function'||decodedImages.has(key)))&&!!window.BearlyBabyPassenger?.ready();}
  function babyMood(options={}){
    const state=options.state||{};
    const startled=(state.effects||[]).some(e=>e.kind==='throw'&&e.age<.65||e.kind==='screen-smack'&&e.age<.3);
    if(state.hp===0||state.hurt||state.attack||state.phase==='madness'||startled)return 'terror';
    if(state.held)return 'brace';
    if((options.jump||0)>8)return 'terror';
    if(options.talking)return 'point';
    if(options.transfer)return 'brace';
    if(options.mode==='water'&&Math.abs(options.speed||0)>20)return 'excited';
    if((options.weight||0)>.4)return 'laugh';
    return 'idle';
  }
  function carrierBody(image,rect,name){
    const key=name+':'+rect.join(',');if(preparedBodies.has(key))return preparedBodies.get(key);
    const [sx,sy,sw,sh]=rect,head=heads[name],[hx,hy,hw,hh]=head.box,upper=upperBodies[name],[ux,uy,uw,uh]=upper.box;
    const tile=document.createElement('canvas');tile.width=sw;tile.height=sh;
    const c=tile.getContext('2d');c.drawImage(image,sx,sy,sw,sh,0,0,sw,sh);
    const mask=document.createElement('canvas');mask.width=sw;mask.height=sh;const m=mask.getContext('2d');m.translate(-sx,-sy);m.fillStyle='#fff';
    const H=x=>head.flip<0?hx+hw-(x-hx):x;
    // Remove the former painted head and upper child as one union. The clean
    // backing restores the bear, straps and empty carrier behind the passenger.
    m.beginPath();m.moveTo(H(hx+hw*.3),hy+hh+3);
    m.bezierCurveTo(H(hx-hw*.04),hy+hh*.96,H(hx-3),hy+hh*.7,H(hx-3),hy+hh*.43);
    m.bezierCurveTo(H(hx-3),hy+hh*.12,H(hx+hw*.2),hy-3,H(hx+hw*.5),hy-3);
    m.bezierCurveTo(H(hx+hw*.91),hy-3,H(hx+hw+3),hy+hh*.25,H(hx+hw+3),hy+hh*.5);
    m.bezierCurveTo(H(hx+hw+5),hy+hh*.68,H(hx+hw+1),hy+hh*.97,H(hx+hw*.7),hy+hh+3);m.closePath();m.fill();
    const left=Math.min(ux,upper.waist[0]-25*hh/85),right=Math.max(ux+uw,upper.waist[0]+25*hh/85);
    m.beginPath();m.moveTo(head.neck[0]-30*hh/85,hy+hh-10);m.lineTo(head.neck[0]+36*hh/85,hy+hh-10);
    m.lineTo(right,head.neck[1]+20*hh/85);m.lineTo(right,uy+uh);m.lineTo(left,uy+uh);m.lineTo(left,head.neck[1]+27*hh/85);m.closePath();m.fill();
    c.globalCompositeOperation='destination-out';c.drawImage(mask,0,0);
    const patch=document.createElement('canvas');patch.width=sw;patch.height=sh;const g=patch.getContext('2d');
    g.drawImage(images[backgrounds[name]],sx,sy,sw,sh,0,0,sw,sh);g.globalCompositeOperation='destination-in';g.drawImage(mask,0,0);
    c.globalCompositeOperation='source-over';c.drawImage(patch,0,0);preparedBodies.set(key,tile);return tile;
  }
  function paintCarrierBody(c,image,rect,origin,s,name,bob=0){
    const [sx,sy,sw,sh]=rect;c.drawImage(carrierBody(image,rect,name),(sx-origin[0])*s,(sy-origin[1])*s+bob,sw*s,sh*s);
  }
  function paintPassenger(c,image,rect,origin,s,name,options={},bob=0){
    const head=heads[name],upper=upperBodies[name],u=head.box[3]/85;
    const lip=upper.lip.map(([x,y])=>[x,y-(upper.raise||0)*u]),[a,q,b]=lip;
    const middle=[(a[0]+2*q[0]+b[0])/4,(a[1]+2*q[1]+b[1])/4];
    const angle=clamp(Math.atan2(head.neck[0]-upper.waist[0],upper.waist[1]-head.neck[1]),-.2,.2);
    const X=x=>(x-origin[0])*s,Y=y=>(y-origin[1])*s+bob;
    const mood=babyMood({...options,transfer:options.transfer||name.startsWith('transfer')});
    if(!nativeFrames)nativeFrames=window.BearlyBabyPassenger.frames();
    const native=nativeFrames[window.BearlyBabyPassenger.resolve(mood)],scale=head.box[3]/61,flip=head.flip||1;
    const lipAt=x=>{let lo=0,hi=1;for(let i=0;i<18;i++){const t=(lo+hi)/2,xx=(1-t)*(1-t)*a[0]+2*(1-t)*t*q[0]+t*t*b[0];if(xx<x)lo=t;else hi=t;}const t=(lo+hi)/2;return(1-t)*(1-t)*a[1]+2*(1-t)*t*q[1]+t*t*b[1];};
    // Fit the native clothing cut edge behind the curved pouch. Open-jaw and
    // leaning frames keep the SAME physical scale, with enough fabric overlap.
    let padding=8*u;const cs=Math.cos(angle),sn=Math.sin(angle);
    for(const [px,py]of native.polygon.filter(point=>point[1]>=native.occludeFrom)){
      const dx=(px-native.pivot[0])*scale*flip,dy=(py-native.pivot[1])*scale;
      const rx=dx*cs-dy*sn,ry=dx*sn+dy*cs;
      padding=Math.max(padding,lipAt(middle[0]+rx)-middle[1]-ry+3*u);
    }
    const seam=[middle[0],middle[1]+padding];
    const passenger=window.BearlyBabyPassenger.draw(c,{mood,x:X(seam[0]),y:Y(seam[1]),scale:scale*s,angle,flip});
    // The original neck and shirt remain continuous. Only the lower torso cut
    // disappears behind the front of the actual carrier pouch, below the face.
    const depth=Math.max(32*u,padding+14*u),foreground=new Path2D();foreground.moveTo(X(a[0]),Y(a[1]));foreground.quadraticCurveTo(X(q[0]),Y(q[1]),X(b[0]),Y(b[1]));
    foreground.lineTo(X(b[0]),Y(b[1]+depth));foreground.quadraticCurveTo(X(q[0]),Y(q[1]+depth),X(a[0]),Y(a[1]+depth));foreground.closePath();
    c.save();c.clip(foreground);const [sx,sy,sw,sh]=rect;let textureMap=null;
    if(upper.texture){
      const top=Math.min(a[1],q[1],b[1]),bottom=Math.max(a[1],q[1],b[1])+depth,destination=[a[0],top,b[0]-a[0],bottom-top];
      c.drawImage(image,...upper.texture,X(destination[0]),Y(destination[1]),destination[2]*s,destination[3]*s);textureMap={source:upper.texture,destination};
    }else c.drawImage(upper.source?image:images[backgrounds[name]],sx,sy,sw,sh,X(sx),Y(sy),sw*s,sh*s);
    c.restore();
    c.save();c.strokeStyle='#274b60';c.lineWidth=1.8*s;c.beginPath();c.moveTo(X(a[0]),Y(a[1]));c.quadraticCurveTo(X(q[0]),Y(q[1]),X(b[0]),Y(b[1]));c.stroke();c.restore();
    return {...passenger,pose:name,pouch:{lip,depth,seam,origin,scale:s,bob,source:upper.source||backgrounds[name],textureMap,padding}};
  }
  function drawCarrier(c,image,rect,origin,s,name,options={},bob=0){paintCarrierBody(c,image,rect,origin,s,name,bob);return paintPassenger(c,image,rect,origin,s,name,options,bob);}
  function prepareParts(){
    if(parts)return parts;
    function tile(rect){const [x,y,w,h]=rect,c=document.createElement('canvas');c.width=w;c.height=h;c.dataset.sourceAsset='matched-legs-v11.png';c.getContext('2d').drawImage(images.parts,x,y,w,h,0,0,w,h);return c;}
    parts={near:{boot:tile([160,370,712,433])},far:{boot:tile([1077,372,642,421])}};return parts;
  }
  function fullPose(c,name,h,options={}){
    const f=actions[name],[sx,sy,sw,sh]=f.rect,s=h/f.stature;
    // The staggered sheet is not a regular grid: exclude adjacent helmet/boot tips.
    const outline=name==='grab'?[[817,8],[1381,8],[1381,502],[960,502],[960,512],[817,512]]:
      name==='backHurt'?[[944,503],[1412,503],[1412,1013],[933,1013],[933,516],[944,516]]:null;
    c.save();
    if(outline){c.beginPath();for(const [i,[x,y]] of outline.entries())i?c.lineTo((x-f.origin[0])*s,(y-f.origin[1])*s):c.moveTo((x-f.origin[0])*s,(y-f.origin[1])*s);c.closePath();c.clip();}
    const likeness=drawCarrier(c,images[f.image],f.rect,f.origin,s,name==='backIdle'?'back':name,options);c.restore();return likeness;
  }
  const BODY_HEIGHT=280,BODY_PHASES=48,bodyFrames=new Map(),bodyScratch=new Map();
  const BODY_CACHE_LIMIT=32*1024*1024;let bodyCacheHits=0,bodyCacheMisses=0,bodyCacheBytes=0,bodyBuildMs=0,maxBodyBuildMs=0,transientBuilds=0,bodyBitmaps=0,bitmapFailures=0;const bodyNow=()=>typeof performance==='object'?performance.now():Date.now();
  const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
  function bodySource(profile,name){
    const [x,y,w]=profile.torso,rect=[x,y,w,profile.origin[1]+3-y];
    return {rect,tile:carrierBody(images[profile.image],rect,name)};
  }
  function surfacePose(profile,h,gait,weight){
    const s=h/profile.stature,ox=profile.origin[0],oy=profile.origin[1],pivot={x:((profile.near.hip[0]+profile.far.hip[0])*.5-ox)*s,y:(profile.pelvisY-oy)*s};
    const angle=gait.roll,cs=Math.cos(angle),sn=Math.sin(angle),shift={x:gait.sway,y:gait.bob+h*.012*weight-(LOWER_HEIGHT-(oy-profile.pelvisY))*s};
    const bodyPoint=(x,y)=>({x:pivot.x+(x-pivot.x)*cs-(y-pivot.y)*sn+shift.x,y:pivot.y+(x-pivot.x)*sn+(y-pivot.y)*cs+shift.y});
    const transform=c=>{c.translate(pivot.x+shift.x,pivot.y+shift.y);c.rotate(angle);c.translate(-pivot.x,-pivot.y);};
    const pelvisPoint=(x,y)=>{const blend=smooth((y/s+oy-(profile.pelvisY-45))/45),a=gait.pelvisRoll||0,dx=x-pivot.x,dy=y-pivot.y,xx=pivot.x+dx*Math.cos(a)-dy*Math.sin(a)+(gait.pelvisSway||0),yy=pivot.y+dx*Math.sin(a)+dy*Math.cos(a);return bodyPoint(x+(xx-x)*blend,y+(yy-y)*blend);};
    const track=(profile.near.sole[0]+profile.far.sole[0])*.5,legs={};
    for(const name of ['near','far']){
      const leg=profile[name],f=gait[name],ca=Math.cos(f.angle),sa=Math.sin(f.angle),offset=f.contactOffset||0,sole={x:(track-ox+(leg.sole[0]-track)*(1-.10*weight))*s+f.x+offset*(1-ca),y:(leg.sole[1]-oy)*s+f.y-offset*sa};
      const rigid=(x,y)=>{const xx=(x-leg.sole[0])*s,yy=(y-leg.sole[1])*s;return{x:sole.x+xx*ca-yy*sa,y:sole.y+xx*sa+yy*ca};};
      const heel=rigid(leg.sole[0]-(name==='near'?60:48),leg.sole[1]),toe=rigid(leg.sole[0]+(name==='near'?52:48),leg.sole[1]),cuff=rigid(leg.sole[0]-(name==='near'?16:13),leg.sole[1]-(name==='near'?62:58)),shinAngle=f.shinAngle||0,sc=Math.cos(shinAngle),ss=Math.sin(shinAngle),calfRigid=(x,y)=>{const xx=(x-leg.cuff[0])*s,yy=(y-leg.cuff[1])*s;return{x:cuff.x+xx*sc-yy*ss,y:cuff.y+xx*ss+yy*sc};};
      legs[name]={sole,angle:f.angle,stance:f.stance,rigid,cuff,heel,toe,calfRigid,shinAngle,kneeFlex:f.kneeFlex||0,contact:{x:sole.x+offset*ca,y:sole.y+offset*sa}};
    }
    return {s,ox,oy,pivot,angle,shift,bodyPoint,pelvisPoint,transform,legs};
  }
  function sourceSplit(profile,y){
    const points=profile.image==='front'?[[13,190],[330,190],[365,195],[383,192],[398,183],[418,178],[440,179],[468,202],[490,213],[503,213]]:[[4,440],[345,440],[380,440],[395,420],[405,409],[420,407],[433,410],[463,440],[492,441],[519,441]];
    for(let i=1;i<points.length;i++)if(y<=points[i][0]){const [a,x]=points[i-1],[b,z]=points[i];return x+(z-x)*clamp((y-a)/(b-a),0,1);}return points.at(-1)[1];
  }
  function surfacePoint(profile,pose,gait,weight,x,y,side){
    const s=pose.s,base=pose.pelvisPoint((x-pose.ox)*s,(y-pose.oy)*s),leg=profile[side],target=pose.legs[side].calfRigid(x,y);
    // One original cloth/fur surface flows from the pelvis to each rigid shoe.
    // Adjacent crotch vertices share their upper attachment; the split follows
    // the painted overlap between the boots instead of cutting through a toe.
    const kneeY=leg.hip[1]-4;let t=smooth((y-(profile.pelvisY-9))/(kneeY-(profile.pelvisY-9)));
    const crotch=profile.image==='front'?391:405,branch=smooth((y-(crotch-8))/18),edge=smooth(Math.abs(x-sourceSplit(profile,y))/18);
    if(y<leg.hip[1]-2)t*=branch+(1-branch)*edge;
    const result={x:base.x+(target.x-base.x)*t,y:base.y+(target.y-base.y)*t};
    // The front arms continue supporting the pouch. The back-carrier hands
    // counter-swing a little more, with the continuous sleeve bending above.
    const arm=profile.image==='front'?{x:132,y:278,rx:59,ry:77,amount:0}:{x:367,y:291,rx:74,ry:91,amount:.055};
    const sleeve=Math.exp(-(((x-arm.x)/arm.rx)**4)-((y-arm.y)/arm.ry)**4)*smooth((y-180)/85)*(1-smooth((y-(profile.pelvisY-15))/42));
    const phase=gait.phase*Math.PI*2;result.x+=Math.cos(phase)*gait.cycleLength*arm.amount*sleeve*weight;result.y+=Math.sin(phase)*gait.cycleLength*.007*sleeve*weight;
    return result;
  }
  function surfaceTriangle(c,image,source,destination){
    const [a,b,d]=source,[p,q,r]=destination,den=a.x*(b.y-d.y)+b.x*(d.y-a.y)+d.x*(a.y-b.y);if(Math.abs(den)<.0001)return;
    const A=(p.x*(b.y-d.y)+q.x*(d.y-a.y)+r.x*(a.y-b.y))/den,B=(p.y*(b.y-d.y)+q.y*(d.y-a.y)+r.y*(a.y-b.y))/den,C=(p.x*(d.x-b.x)+q.x*(a.x-d.x)+r.x*(b.x-a.x))/den,D=(p.y*(d.x-b.x)+q.y*(a.x-d.x)+r.y*(b.x-a.x))/den,E=(p.x*(b.x*d.y-d.x*b.y)+q.x*(d.x*a.y-a.x*d.y)+r.x*(a.x*b.y-b.x*a.y))/den,F=(p.y*(b.x*d.y-d.x*b.y)+q.y*(d.x*a.y-a.x*d.y)+r.y*(a.x*b.y-b.x*a.y))/den;
    const center={x:(p.x+q.x+r.x)/3,y:(p.y+q.y+r.y)/3};c.save();c.beginPath();destination.forEach((v,i)=>{const dx=v.x-center.x,dy=v.y-center.y,length=Math.hypot(dx,dy)||1,x=v.x+dx/length*.6,y=v.y+dy/length*.6;i?c.lineTo(x,y):c.moveTo(x,y);});c.closePath();c.clip();c.transform(A,B,C,D,E,F);c.drawImage(image,0,0);c.restore();
  }
  const LOWER_HEIGHT=190,lowerPrepared=new Map(),upperPrepared=new Map();
  const lowerKeys=[
    {name:'near-contact',image:'nearContact',rect:[52,62,1224,1117],waist:[655,115],floor:1179,width:590,crotch:[620,610],hips:[[510,285],[780,270]],legs:[{knee:[790,635],half:150,cuff:[862,835],heel:[710,1110],toe:[1240,1155],sole:[970,1160]},{knee:[390,580],half:110,cuff:[315,745],heel:[100,820],toe:[550,1030],sole:[360,1035]}]},
    {name:'near-support',image:'nearSupport',rect:[1225,115,314,471],waist:[1395,140],floor:586,width:285,crotch:[1395,314],hips:[[1330,230],[1450,230]],legs:[{knee:[1315,369],half:83,cuff:[1290,430],heel:[1240,550],toe:[1480,577],sole:[1350,580]},{knee:[1480,340],half:51,cuff:[1460,395],heel:[1410,425],toe:[1530,462],sole:[1470,465]}]},
    {name:'far-contact',image:'farPoses',rect:[6,122,428,326],waist:[205,139],floor:448,width:205,crotch:[205,268],hips:[[150,220],[270,215]],legs:[{knee:[125,300],half:58,cuff:[100,340],heel:[30,350],toe:[150,420],sole:[85,423]},{knee:[285,310],half:51,cuff:[310,350],heel:[275,420],toe:[430,400],sole:[350,430]}]},
    {name:'far-support',image:'farPoses',rect:[449,113,306,331],waist:[600,130],floor:444,width:205,crotch:[588,270],hips:[[550,215],[655,215]],legs:[{knee:[515,267],half:38,cuff:[480,290],heel:[455,280],toe:[550,380],sole:[510,365]},{knee:[635,320],half:54,cuff:[620,355],heel:[580,435],toe:[750,425],sole:[670,440]}]},
    {name:'idle',image:'lowerIdle',rect:[170,94,1021,1085],waist:[650,145],floor:1179,width:590,crotch:[650,595],hips:[[510,315],[835,315]],legs:[{knee:[430,650],half:130,cuff:[405,790],heel:[205,1010],toe:[635,1080],sole:[470,1083]},{knee:[790,690],half:145,cuff:[820,850],heel:[650,1110],toe:[1180,1150],sole:[940,1155]}]}
  ];
  const radial=(x,y)=>{const r=x*x+y*y;return r? r*Math.log(r):0;};
  function invert(matrix){const n=matrix.length,a=matrix.map((row,i)=>[...row,...Array.from({length:n},(_,j)=>i===j?1:0)]);for(let col=0;col<n;col++){let pivot=col;for(let row=col+1;row<n;row++)if(Math.abs(a[row][col])>Math.abs(a[pivot][col]))pivot=row;[a[col],a[pivot]]=[a[pivot],a[col]];const d=a[col][col]||1e-12;for(let j=0;j<n*2;j++)a[col][j]/=d;for(let row=0;row<n;row++)if(row!==col){const f=a[row][col];for(let j=0;j<n*2;j++)a[row][j]-=f*a[col][j];}}return a.map(row=>row.slice(n));}
  function prepareLower(index){
    if(lowerPrepared.has(index))return lowerPrepared.get(index);const key=lowerKeys[index],scale=(LOWER_HEIGHT+10)/(key.floor-key.waist[1]),norm=([x,y])=>({x:(x-key.waist[0])*scale,y:(y-key.waist[1])*scale}),[sx,sy,sw,sh]=key.rect;
    const points=[norm([key.waist[0]-key.width*.5,key.waist[1]]),norm(key.waist),norm([key.waist[0]+key.width*.5,key.waist[1]]),...key.hips.map(norm),norm(key.crotch)];
    for(const leg of key.legs)points.push(norm([leg.knee[0]-leg.half,leg.knee[1]]),norm(leg.knee),norm([leg.knee[0]+leg.half,leg.knee[1]]),norm(leg.cuff),norm(leg.heel),norm(leg.toe));
    const n=points.length,m=Array.from({length:n+3},()=>Array(n+3).fill(0));for(let i=0;i<n;i++){for(let j=0;j<n;j++)m[i][j]=radial(points[i].x-points[j].x,points[i].y-points[j].y)+(i===j?.001:0);m[i][n]=m[n][i]=1;m[i][n+1]=m[n+1][i]=points[i].x;m[i][n+2]=m[n+2][i]=points[i].y;}
    const tile=document.createElement('canvas');tile.width=Math.ceil(sw*scale);tile.height=Math.ceil(sh*scale);const c=tile.getContext('2d');c.drawImage(images[key.image],sx,sy,sw,sh,0,0,tile.width,tile.height);const pixels=c.getImageData(0,0,tile.width,tile.height);c.putImageData(pixels,0,0);
    const mesh=[],nx=10,ny=14;for(let row=0;row<=ny;row++)for(let col=0;col<=nx;col++){const x=(sx+sw*col/nx-key.waist[0])*scale,y=(sy+sh*row/ny-key.waist[1])*scale;mesh.push({source:{x:tile.width*col/nx,y:tile.height*row/ny},basis:[...points.map(p=>radial(x-p.x,y-p.y)),1,x,y]});}
    const result={key,scale,norm,tile,points,inverse:invert(m),mesh,nx,ny};lowerPrepared.set(index,result);return result;
  }
  function lowerTargets(profile,pose,gait,weight){
    const phases=[0,.25,.5,.68,1],i=phases.findIndex((v,j)=>j<4&&gait.phase>=v&&gait.phase<phases[j+1]),t=(gait.phase-phases[i])/(phases[i+1]-phases[i]),a=prepareLower(i),b=prepareLower((i+1)%4),idle=prepareLower(4),mix=(v,w)=>({x:v.x+(w.x-v.x)*t,y:v.y+(w.y-v.y)*t}),samplePoint=(j)=>{const v=mix(a.points[j],b.points[j]),z=idle.points[j];return{x:z.x+(v.x-z.x)*weight,y:z.y+(v.y-z.y)*weight};},sampleSole=(j)=>{const v=mix(a.norm(a.key.legs[j].sole),b.norm(b.key.legs[j].sole)),z=idle.norm(idle.key.legs[j].sole);return{x:z.x+(v.x-z.x)*weight,y:z.y+(v.y-z.y)*weight};};
    const s=pose.s,point=({x,y})=>pose.pelvisPoint(pose.pivot.x+x*s,(profile.pelvisY-10-pose.oy+y)*s),targets=a.points.map((_,j)=>point(samplePoint(j))),knees={};
    for(const [j,side]of ['near','far'].entries()){
      const f=pose.legs[side],base=6+j*6,rawSole=point(sampleSole(j)),delta={x:f.sole.x-rawSole.x,y:f.sole.y-rawSole.y},heel=targets[base+4],toe=targets[base+5],rawAngle=Math.atan2(toe.y-heel.y,toe.x-heel.x),angle=clamp(f.angle-rawAngle,-.25,.25),cs=Math.cos(angle),sn=Math.sin(angle);
      for(let k=0;k<3;k++){targets[base+k].x+=delta.x*.75;targets[base+k].y+=delta.y*.75;}
      for(let k=3;k<6;k++){const v=targets[base+k],x=v.x-rawSole.x,y=v.y-rawSole.y;targets[base+k]={x:f.sole.x+x*cs-y*sn,y:f.sole.y+x*sn+y*cs};}
      knees[side]=targets[base+1];
    }
    return {targets,knees,key:weight<.45?4:(t<.5?i:(i+1)%4)};
  }
  function lowerMesh(profile,pose,gait,weight){const {targets,knees,key:index}=lowerTargets(profile,pose,gait,weight),source=prepareLower(index),n=source.points.length,tx=[...targets.map(p=>p.x),0,0,0],ty=[...targets.map(p=>p.y),0,0,0],cx=source.inverse.map(row=>row.reduce((v,a,i)=>v+a*tx[i],0)),cy=source.inverse.map(row=>row.reduce((v,a,i)=>v+a*ty[i],0));
    const shoes=source.key.legs.map((leg,j)=>{const heel=source.norm(leg.heel),toe=source.norm(leg.toe),cuff=source.norm(leg.cuff),sole=source.norm(leg.sole),dx=toe.x-heel.x,dy=toe.y-heel.y,length=Math.hypot(dx,dy),u={x:dx/length,y:dy/length},v={x:dy/length,y:-dx/length},height=(cuff.x-heel.x)*v.x+(cuff.y-heel.y)*v.y,foot=pose.legs[j?'far':'near'],turn=clamp(foot.angle-Math.atan2(dy,dx),-.45,.45);return{heel,sole,u,v,length,height,foot,cs:Math.cos(turn),sn:Math.sin(turn)};});
    const vertices=source.mesh.map(vertex=>{const b=vertex.basis,x=b.at(-2),y=b.at(-1);let destination={x:b.reduce((sum,a,i)=>sum+a*cx[i],0),y:b.reduce((sum,a,i)=>sum+a*cy[i],0)},best=null;
      for(const shoe of shoes){const dx=x-shoe.heel.x,dy=y-shoe.heel.y,along=(dx*shoe.u.x+dy*shoe.u.y)/shoe.length,above=(dx*shoe.v.x+dy*shoe.v.y)/(shoe.height||1),edge=smooth((along+.22)/.16)*(1-smooth((along-1.04)/.18)),blend=edge*(1-smooth((above-.74)/.60));if(above<-.22||above>1.34||blend<=0)continue;const score=blend-Math.abs(above-.4)*.01;if(!best||score>best.score)best={shoe,blend,score};}
      if(best){const {shoe,blend}=best,dx=(x-shoe.sole.x)*pose.s,dy=(y-shoe.sole.y)*pose.s,target={x:shoe.foot.sole.x+dx*shoe.cs-dy*shoe.sn,y:shoe.foot.sole.y+dx*shoe.sn+dy*shoe.cs};destination={x:destination.x+(target.x-destination.x)*blend,y:destination.y+(target.y-destination.y)*blend};}
      return{source:vertex.source,destination};}),triangles=[];
    for(let row=0;row<source.ny;row++)for(let col=0;col<source.nx;col++){const a=row*(source.nx+1)+col,b=a+1,d=a+source.nx+2,e=a+source.nx+1;triangles.push([vertices[a],vertices[b],vertices[d]],[vertices[a],vertices[d],vertices[e]]);}
    // Sample the same affine triangles actually painted, not the motion plan.
    const sample=raw=>{const [x,y,w,h]=source.key.rect,u=clamp((raw[0]-x)/w*source.nx,0,source.nx-1e-6),v=clamp((raw[1]-y)/h*source.ny,0,source.ny-1e-6),col=Math.floor(u),row=Math.floor(v),a=row*(source.nx+1)+col,b=a+1,d=a+source.nx+2,e=a+source.nx+1,xx=u-col,yy=v-row,ids=yy<=xx?[a,b,d]:[a,d,e],weights=yy<=xx?[1-xx,xx-yy,yy]:[1-yy,xx,yy-xx];return{x:ids.reduce((s,id,i)=>s+vertices[id].destination.x*weights[i],0),y:ids.reduce((s,id,i)=>s+vertices[id].destination.y*weights[i],0)};},rendered={};
    for(const [j,side]of ['near','far'].entries()){const leg=source.key.legs[j];rendered[side]={hip:sample(source.key.hips[j]),knee:sample(leg.knee),cuff:sample(leg.cuff),heel:sample(leg.heel),toe:sample(leg.toe),sole:sample(leg.sole),source:{image:images[source.key.image].src.split('/').pop(),pose:source.key.name,hip:source.key.hips[j],knee:leg.knee,cuff:leg.cuff,heel:leg.heel,toe:leg.toe,sole:leg.sole},renderedFromSource:true};}return{source,vertices,triangles,knees,rendered};
  }
  function upperSource(profile,name){if(upperPrepared.has(name))return upperPrepared.get(name);const [sx,sy,sw,sh]=profile.torso,tile=document.createElement('canvas');tile.width=sw;tile.height=sh;const c=tile.getContext('2d');c.drawImage(carrierBody(images[profile.image],profile.torso,name),0,0);c.globalCompositeOperation='destination-in';c.beginPath();const outline=name==='front'?[[51,13],[307,13],[307,367],[269,367],[240,348],[235,337],[198,342],[143,340],[76,330],[51,320]]:[[252,4],[562,4],[562,340],[494,344],[440,350],[400,350],[319,339],[252,326]];for(const [i,[x,y]]of outline.entries())i?c.lineTo(x-sx,y-sy):c.moveTo(x-sx,y-sy);c.closePath();c.fill();c.globalCompositeOperation='source-over';const image=c.getImageData(0,0,sw,sh);c.putImageData(image,0,0);const result={tile,rect:profile.torso};upperPrepared.set(name,result);return result;}
  function bakeBody(profile,name,gait,weight,scratch=false){
    const buildStart=bodyNow();if(scratch)transientBuilds++;const pose=surfacePose(profile,BODY_HEIGHT,gait,weight),lower=lowerMesh(profile,pose,gait,weight),upper=upperSource(profile,name),[sx,sy,sw,sh]=upper.rect,triangles=[...lower.triangles],points=lower.vertices.map(v=>v.destination),upperTriangles=[];
    const upperPoint=(x,y)=>{const point=pose.bodyPoint((x-pose.ox)*pose.s,(y-pose.oy)*pose.s);if(name==='back'){const sleeve=Math.exp(-(((x-367)/74)**4)-((y-291)/91)**4)*smooth((y-180)/85),phase=gait.phase*Math.PI*2;point.x+=Math.cos(phase)*gait.cycleLength*.055*sleeve*weight;point.y+=Math.sin(phase)*gait.cycleLength*.007*sleeve*weight;}return point;};
    for(let row=0;row<10;row++)for(let col=0;col<6;col++){const x0=sw*col/6,x1=sw*(col+1)/6,y0=sh*row/10,y1=sh*(row+1)/10,v=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(([x,y])=>({source:{x,y},destination:upperPoint(sx+x,sy+y)}));for(const order of [[0,1,2],[0,2,3]]){const t=order.map(i=>v[i]);upperTriangles.push(t);points.push(...t.map(p=>p.destination));}}
    const left=Math.floor(Math.min(...points.map(p=>p.x)))-2,top=Math.floor(Math.min(...points.map(p=>p.y)))-2,right=Math.ceil(Math.max(...points.map(p=>p.x)))+2,bottom=Math.ceil(Math.max(...points.map(p=>p.y)))+2,canvas=scratch?(bodyScratch.get(name)||document.createElement('canvas')):document.createElement('canvas');if(scratch)bodyScratch.set(name,canvas);canvas.width=right-left;canvas.height=bottom-top;
    canvas.dataset.sourceAsset=profile.image==='front'?'front-carrier-v7.png':'back-carrier-v11.png';canvas.dataset.sourceRect=upper.rect.join(',');canvas.dataset.sourcePose=name;canvas.dataset.sourceTransform='continuous-surface';canvas.dataset.sourceAssets=JSON.stringify([canvas.dataset.sourceAsset,images[lower.source.key.image].src.split('/').pop()]);canvas.dataset.lowerPose=lower.source.key.name;
    const c=canvas.getContext('2d');c.translate(-left,-top);for(const t of triangles)surfaceTriangle(c,lower.source.tile,t.map(v=>v.source),t.map(v=>v.destination));for(const t of upperTriangles)surfaceTriangle(c,upper.tile,t.map(v=>v.source),t.map(v=>v.destination));
    // Flatten the recorded mesh into pixels once. Reusing a canvas whose display
    // list still contains every clipped triangle can replay that work on draw.
    const pixels=c.getImageData(0,0,canvas.width,canvas.height);c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,canvas.width,canvas.height);c.putImageData(pixels,0,0);
    const frame={canvas,image:canvas,width:canvas.width,height:canvas.height,left,top,gait,weight,triangles:triangles.length+upperTriangles.length,rect:upper.rect,lowerPose:lower.source.key.name,lowerRect:lower.source.key.rect,knees:lower.knees,rendered:lower.rendered,disposed:false,pending:false,bitmap:false};
    if(!scratch&&window.createImageBitmap){frame.pending=true;const attribution={...canvas.dataset};window.createImageBitmap(canvas).then(bitmap=>{frame.pending=false;if(frame.disposed){bitmap.close();return;}bitmap.dataset=attribution;frame.image=bitmap;frame.bitmap=true;bodyBitmaps++;canvas.width=1;canvas.height=1;frame.canvas=null;}).catch(()=>{frame.pending=false;bitmapFailures++;});}
    const buildMs=bodyNow()-buildStart;bodyBuildMs+=buildMs;maxBodyBuildMs=Math.max(maxBodyBuildMs,buildMs);return frame;
  }
  function bodyFrame(profile,name,distance,h,weight){
    const phase=((distance/window.BearlyLocomotion.cycleLength(h))%1+1)%1,index=Math.round(phase*BODY_PHASES)%BODY_PHASES,steady=weight>=.999,idle=weight<=.0001,key=name+':'+(idle?'idle':index);
    if((steady||idle)&&bodyFrames.has(key)){bodyCacheHits++;const frame=bodyFrames.get(key);bodyFrames.delete(key);bodyFrames.set(key,frame);return frame;}
    const effectivePhase=steady?index/BODY_PHASES:phase,gait=window.BearlyLocomotion.pose(window.BearlyLocomotion.cycleLength(BODY_HEIGHT)*effectivePhase,BODY_HEIGHT,weight),frame=bakeBody(profile,name,gait,weight,!steady&&!idle);bodyCacheMisses++;
    if(steady||idle){bodyFrames.set(key,frame);bodyCacheBytes+=frame.width*frame.height*4;while(bodyCacheBytes>BODY_CACHE_LIMIT||bodyFrames.size>98){const oldest=bodyFrames.keys().next().value,evicted=bodyFrames.get(oldest);bodyCacheBytes-=evicted.width*evicted.height*4;evicted.disposed=true;if(evicted.bitmap){evicted.image.close();bodyBitmaps--;}if(evicted.canvas){evicted.canvas.width=1;evicted.canvas.height=1;}bodyFrames.delete(oldest);}}return frame;
  }
  function draw(c,px,py,h,face,options={}){
    if(!ready())return false;const state=options.state||{},back=!!state.baby,name=back?'back':'front',profile=profiles[name],s=h/profile.stature,weight=clamp(options.weight||0,0,1);
    c.save();c.translate(px,py);if(face<0)c.scale(-1,1);
    const action=state.hp===0?(state.defeatAge<.55?'collapse':'defeated'):state.hurt?(back?'backHurt':'frontHurt'):state.attack?'maul':state.held?'grab':null;
    if(action){const babyFace=fullPose(c,action,h,options);lastAudit={pose:action,carrier:action==='frontHurt'?'front':'back',integratedCarrier:true,babyFace,height:h,source:actions[action].image};c.restore();return true;}
    let slope=0;if(options.groundAt){const a=options.groundAt(px-18),b=options.groundAt(px+18);if(a!=null&&b!=null)slope=Math.atan2(b-a,36)*face;}c.rotate(slope);
    const frame=bodyFrame(profile,name,options.distance||0,h,weight),scale=h/BODY_HEIGHT;c.drawImage(frame.image,frame.left*scale,frame.top*scale,frame.width*scale,frame.height*scale);
    const gait=window.BearlyLocomotion.pose(frame.gait.phase*window.BearlyLocomotion.cycleLength(h),h,weight),pose=surfacePose(profile,h,gait,weight);c.save();pose.transform(c);const babyFace=paintPassenger(c,images[profile.image],profile.torso,profile.origin,s,name,options);c.restore();
    const landmarks={};for(const side of ['near','far']){const f=pose.legs[side],r=frame.rendered[side],point=v=>({x:v.x*scale,y:v.y*scale});landmarks[side]={...Object.fromEntries(['hip','knee','cuff','heel','toe','sole'].map(k=>[k,point(r[k])])),renderedFromSource:true,source:r.source,plannedSole:f.sole,plannedCuff:f.cuff,angle:f.angle,stance:f.stance,kneeFlex:f.kneeFlex,contact:f.contact,bootWidth:Math.hypot(r.toe.x-r.heel.x,r.toe.y-r.heel.y)*scale,rigidShoe:true};}
    lastAudit={pose:'walking',carrier:name,integratedCarrier:true,babyFace,height:h,source:profile.image,sourceRect:frame.rect,lowerPose:frame.lowerPose,lowerSourceRect:frame.lowerRect,authoredLowerBody:true,stature:profile.stature,landmarks,gait,body:{pivot:pose.pivot,sway:pose.shift.x,bob:pose.shift.y,roll:pose.angle,pelvisSway:gait.pelvisSway,pelvisRoll:gait.pelvisRoll,slope,opaque:true,surfaces:1,continuous:true,triangles:frame.triangles,canonicalHeight:BODY_HEIGHT,lowerHeight:LOWER_HEIGHT,cachePhase:frame.gait.phase},cache:{frames:bodyFrames.size,hits:bodyCacheHits,misses:bodyCacheMisses}};c.restore();return true;
  }
  let sourceWarmupPromise=null,sourceWarmupDone=0,sourceWarmupMs=0,sourceWarmupMaxMs=0;
  function warmupSources(){
    if(sourceWarmupPromise)return sourceWarmupPromise;
    sourceWarmupPromise=preload().then(()=>new Promise((resolve,reject)=>{
      const tasks=[...lowerKeys.map((_,index)=>()=>prepareLower(index)),()=>upperSource(profiles.front,'front'),()=>upperSource(profiles.back,'back')];
      const schedule=()=>{if(typeof window.requestIdleCallback==='function')window.requestIdleCallback(run,{timeout:1000});else window.setTimeout(()=>run(null),32);};
      const run=deadline=>{
        // Make progress even when a busy device only grants tiny idle windows.
        // Rescheduling a fresh deadline here can starve every requested visit.
        // Each callback prepares exactly one source piece, never the full rig.
        const began=bodyNow();try{tasks.shift()();}catch(error){reject(error);return;}const elapsed=bodyNow()-began;sourceWarmupDone++;sourceWarmupMs+=elapsed;sourceWarmupMaxMs=Math.max(sourceWarmupMaxMs,elapsed);
        if(tasks.length)schedule();else resolve();
      };
      schedule();
    }));
    return sourceWarmupPromise;
  }
  function cacheStats(){return {frames:bodyFrames.size,bytes:bodyCacheBytes,limitBytes:BODY_CACHE_LIMIT,frameLimit:98,phases:BODY_PHASES,canonicalHeight:BODY_HEIGHT,hits:bodyCacheHits,misses:bodyCacheMisses,transientBuilds,bitmapFrames:bodyBitmaps,bitmapFailures,mode:window.createImageBitmap?'bitmap':'raster-canvas',pendingBitmaps:[...bodyFrames.values()].filter(f=>f.pending).length,buildMs:bodyBuildMs,maxBuildMs:maxBodyBuildMs,scratchBytes:[...bodyScratch.values()].reduce((n,c)=>n+c.width*c.height*4,0),sourceWarmup:{prepared:sourceWarmupDone,total:7,complete:sourceWarmupDone===7,buildMs:sourceWarmupMs,maxTaskMs:sourceWarmupMaxMs}};}
  function drawAuthored(c,image,rect,origin,scale,pose,options={}){
    if(!ready()||!heads[pose])return false;
    const babyFace=drawCarrier(c,image,rect,origin,scale,pose,options);
    lastAudit={pose,carrier:'front',integratedCarrier:true,babyFace};return true;
  }
  window.BearlyHeroRig={ready,preload,warmupSources,draw,drawAuthored,babyMood,cacheStats,layout:()=>JSON.parse(JSON.stringify(upperBodies)),audit:()=>JSON.parse(JSON.stringify(lastAudit)),profiles:()=>JSON.parse(JSON.stringify(profiles))};
})();
