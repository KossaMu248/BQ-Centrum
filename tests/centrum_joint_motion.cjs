/* Submitted triangle/Canvas geometry for optional walking articulation. These
   mocked rasters verify joints and attachment, not source pixels or visual appeal. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const heroSource=fs.readFileSync('js/hero-rig.js','utf8');
const helperSource=fs.readFileSync('js/centrum-walk-pose.js','utf8');
const directionalSource=fs.readFileSync('js/centrum-directional-rig.js','utf8');
const copy=v=>JSON.parse(JSON.stringify(v));
const near=(a,b,e=1e-7)=>assert(Math.abs(a-b)<=e,`${a} != ${b}`);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function angle(h,k,c){const a={x:h.x-k.x,y:h.y-k.y},b={x:c.x-k.x,y:c.y-k.y};return Math.acos(Math.max(-1,Math.min(1,(a.x*b.x+a.y*b.y)/(Math.hypot(a.x,a.y)*Math.hypot(b.x,b.y)))))*180/Math.PI;}
function inertContext(){return new Proxy({},{get(o,k){if(k==='getImageData')return()=>({data:new Uint8ClampedArray(4)});return k in o?o[k]:()=>{};},set(o,k,v){o[k]=v;return true;}});}
function rig(code=heroSource,helper=helperSource,capture=false){
 const window={},sandbox={window,Image:class{naturalWidth=2400;naturalHeight=2400;},Path2D:class{moveTo(){}quadraticCurveTo(){}lineTo(){}closePath(){}},document:{createElement:()=>({width:0,height:0,dataset:{},getContext:inertContext})}};
 for(const n of ['locomotion','baby-passenger','centrum-depth-gait'])vm.runInNewContext(fs.readFileSync('js/'+n+'.js','utf8'),sandbox);
 if(helper)vm.runInNewContext(helper,sandbox);
 const marker='  window.BearlyHeroRig={';assert.equal(code.split(marker).length,2);
 if(capture){window.__submitted=[];code=code.replace('function surfaceTriangle(c,image,source,destination){','function surfaceTriangle(c,image,source,destination){window.__submitted.push({image,source,destination});');}
 vm.runInNewContext(code.replace(marker,'  window.__joints={profiles,surfacePose,lowerMesh,prepareLower,centrumBoot,projectGroundGait,upperSource};\n'+marker),sandbox);
 window.BearlyHeroRig.preload();return{...window.__joints,window};
}
const hem=[[170,520],[280,540],[380,580],[490,607.5],[540,620],[650,610],[820,571.75],[850,565],[1010,545],[1191,520]];
function hemAt(x){for(let i=1;i<hem.length;i++)if(x<=hem[i][0])return hem[i-1][1]+(hem[i][1]-hem[i-1][1])*(x-hem[i-1][0])/(hem[i][0]-hem[i-1][0]);return hem.at(-1)[1];}
const area=p=>(p[1].x-p[0].x)*(p[2].y-p[0].y)-(p[1].y-p[0].y)*(p[2].x-p[0].x);
function rawPoint(source,p){return{x:p.x/source.tile.width*source.key.rect[2]+source.key.rect[0],y:p.y/source.tile.height*source.key.rect[3]+source.key.rect[1]};}
function texturePoint(source,p){return{x:(p[0]-source.key.rect[0])/source.key.rect[2]*source.tile.width,y:(p[1]-source.key.rect[1])/source.key.rect[3]*source.tile.height};}
function sample(triangles,p,message){
 for(const t of triangles){const [a,b,c]=t.map(v=>v.source),den=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);if(Math.abs(den)<1e-9)continue;
  const u=((b.y-c.y)*(p.x-c.x)+(c.x-b.x)*(p.y-c.y))/den,v=((c.y-a.y)*(p.x-c.x)+(a.x-c.x)*(p.y-c.y))/den,w=1-u-v;
  if(Math.min(u,v,w)>=-1e-7)return{x:u*t[0].destination.x+v*t[1].destination.x+w*t[2].destination.x,y:u*t[0].destination.y+v*t[1].destination.y+w*t[2].destination.y};
 }
 assert.fail(message||'source landmark must occur in an actual submitted triangle');
}
function submitted(api,name,h,phase,weight,motion){
 const profile=api.profiles[name],native=api.window.BearlyLocomotion,gait=api.projectGroundGait(native.pose(native.cycleLength(h)*phase,h,weight),motion,weight),pose=api.surfacePose(profile,h,gait,weight),mesh=api.lowerMesh(profile,pose,gait,weight),source=api.prepareLower(4);
 const cloth=mesh.triangles.filter(t=>!t.image),pants=cloth.filter(t=>t.material?t.material==='pants':t.some(v=>rawPoint(source,v.source).y<100)),calves=cloth.filter(t=>t.material?t.material==='fur':t.every(v=>rawPoint(source,v.source).y>=100)),joints={};
 for(const side of ['near','far']){const index=side==='near'?1:0,boot=api.centrumBoot(profile,pose,side);
  joints[side]={hip:sample(pants.filter(t=>!t.limb||t.limb===side),texturePoint(source,source.key.hips[index])),knee:sample(calves.filter(t=>!t.limb||t.limb===side),texturePoint(source,source.key.legs[index].knee)),cuff:sample(mesh.triangles.filter(t=>t.image===boot.source.tile),texturePoint(boot.source,boot.leg.cuff),'the rigid boot cuff must be submitted')};
  for(const key of ['knee','cuff'])near(distance(joints[side][key],mesh.rendered[side][key]),0,1e-6);
 }
 return{profile,gait,pose,mesh,source,pants,calves,joints};
}
const horizontal={x:1,y:0,centrumWalk:true},route={sourceWalk:true};
function actualBendContract(api){
 const result=[];
 for(const name of ['front','back'])for(const motion of [horizontal,route])for(const [side,phase]of [['far',.25],['near',.75]]){
  const current=submitted(api,name,200,phase,1,motion),k=current.joints[side],degrees=angle(k.hip,k.knee,k.cuff),support=submitted(api,name,200,phase===.25?.75:.25,1,motion).joints[side],supportDegrees=angle(support.hip,support.knee,support.cuff);
  assert(degrees<166,`${name} ${motion.sourceWalk?'route':'Centrum'} ${side}: peak swing must bend actual submitted geometry (${degrees.toFixed(2)} degrees)`);
  assert(supportDegrees-degrees>12,'the same painted leg must fold more during recovery than support');
  result.push({carrier:name,renderer:motion.sourceWalk?'route':'Centrum',side,degrees,supportDegrees});
 }
 return result;
}
function surfaceContracts(api){
 const reference=rig(heroSource,null),rests=new Map();
 const report={cases:0,triangles:0,calfVertices:0,hemJoins:0,bootCases:0,boneCases:0,worstHemGap:0,worstKneeGap:0,maxBoneLengthError:0,smallestTriangleAreaRatio:Infinity};
 const phases=[...Array.from({length:16},(_,i)=>i/16),23/48,47/48];
 for(const name of ['front','back'])for(const h of [145,200,280])for(const motion of [horizontal,route,{x:.6,y:.8,centrumWalk:true},{x:0,y:-1,centrumWalk:true}])for(const weight of [0,.35,1])for(const phase of phases){
  const a=submitted(api,name,h,phase,weight,motion),footReference=submitted(reference,name,h,phase,weight,motion),restKey=name+':'+h;
  if(!rests.has(restKey))rests.set(restKey,submitted(api,name,h,0,0,motion));const rest=rests.get(restKey);
  for(const t of a.mesh.triangles){const sa=area(t.map(v=>v.source)),da=area(t.map(v=>v.destination));assert(sa*da>0,`articulated source triangles must never fold: ${name} h=${h} phase=${phase} weight=${weight} motion=${JSON.stringify(motion)} sourceArea=${sa} targetArea=${da}`);report.smallestTriangleAreaRatio=Math.min(report.smallestTriangleAreaRatio,da/sa);report.triangles++;}
  assert(a.pants.length&&a.calves.length,'actual mesh contains both source materials');
  for(const t of a.pants)for(const v of t){const p=rawPoint(a.source,v.source);assert(p.y<=hemAt(p.x)+1e-6,'shorts texels must stay above the authored hem');}
  for(const t of a.calves)for(let i=0;i<3;i++){const p=rawPoint(a.source,t[i].source),d=t[i].destination;assert(p.y>=hemAt(p.x)-1e-6,'calf texels must remain below the authored shorts hem');report.calfVertices++;
   if(Math.abs(p.y-hemAt(p.x))>1e-6)continue;
   let gap=Infinity;for(const pants of a.pants){if(t.limb&&pants.limb&&t.limb!==pants.limb)continue;for(let j=0;j<3;j++){const x=rawPoint(a.source,pants[j].source),y=rawPoint(a.source,pants[(j+1)%3].source);if(Math.abs(x.y-hemAt(x.x))>1e-6||Math.abs(y.y-hemAt(y.x))>1e-6||Math.abs(x.x-y.x)<1e-6||p.x<Math.min(x.x,y.x)-1e-6||p.x>Math.max(x.x,y.x)+1e-6)continue;const blend=(p.x-x.x)/(y.x-x.x),A=pants[j].destination,B=pants[(j+1)%3].destination;gap=Math.min(gap,distance(d,{x:A.x+(B.x-A.x)*blend,y:A.y+(B.y-A.y)*blend}));}}
   assert(gap<1e-6,'calf and shorts retain the same submitted moving hem');report.worstHemGap=Math.max(report.worstHemGap,gap);report.hemJoins++;
  }
  for(const side of ['near','far']){
   for(const key of ['cuff','heel','toe','sole'])near(distance(a.mesh.rendered[side][key],footReference.mesh.rendered[side][key]),0);
   for(const key of ['contact','sole','cuff'])near(distance(a.pose.legs[side][key],footReference.pose.legs[side][key]),0);
   const bootA=a.mesh.triangles.filter(t=>t.image),bootB=footReference.mesh.triangles.filter(t=>t.image);assert.deepEqual(copy(bootA.map(t=>t.map(v=>v.destination))),copy(bootB.map(t=>t.map(v=>v.destination))),'walking articulation cannot move rigid boot triangles');report.bootCases++;
   const actual=a.joints[side],original=rest.joints[side];
   for(const [from,to]of [['hip','knee'],['knee','cuff']]){const error=Math.abs(distance(actual[from],actual[to])-distance(original[from],original[to]));near(error,0,1e-6);report.maxBoneLengthError=Math.max(report.maxBoneLengthError,error);}
   if(weight>0){const index=side==='near'?1:0,uv=texturePoint(a.source,a.source.key.legs[index].knee),thigh=a.mesh.triangles.filter(t=>t.limb===side&&t.segment==='thigh'),shin=a.mesh.triangles.filter(t=>t.limb===side&&t.segment==='shin');assert(thigh.length&&shin.length,'walking submits both original rigid source pieces');const k1=sample(thigh,uv),k2=sample(shin,uv),gap=distance(k1,k2);near(gap,0,1e-6);near(distance(actual.knee,k1),0,1e-6);report.worstKneeGap=Math.max(report.worstKneeGap,gap);
    const joint=a.mesh.rigidSegments?.[side];assert(joint,'painted rigid segments expose their calibrated rest/target joints');for(const point of ['hip','knee','cuff'])near(distance(joint[point],actual[point]),0,1e-6);
   }report.boneCases++;
  }
  report.cases++;
 }
 return report;
}
function defaultContracts(api){
 const noHelper=rig(heroSource,null);let cases=0;
 for(const name of ['front','back'])for(const h of [145,200,280])for(const phase of [0,.125,.375,.625,.875])for(const weight of [0,.3,1]){
  const native=api.window.BearlyLocomotion,gait=native.pose(native.cycleLength(h)*phase,h,weight),a=api.projectGroundGait(gait,null,weight),b=noHelper.projectGroundGait(gait,null,weight);
  assert.equal(a.walkPose,undefined,'unopted source renderer bypasses articulation');assert.equal(api.window.BearlyCentrumWalkPose.sample(gait,h,weight),null);
  const p=api.surfacePose(api.profiles[name],h,a,weight),q=noHelper.surfacePose(noHelper.profiles[name],h,b,weight);
  assert.deepEqual(copy(p),copy(q));assert.deepEqual(copy(api.lowerMesh(api.profiles[name],p,a,weight).vertices),copy(noHelper.lowerMesh(noHelper.profiles[name],q,b,weight).vertices));cases++;
 }
 return cases;
}
function multiply(m,n){return[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];}
const mapped=(m,p)=>({x:m[0]*p[0]+m[2]*p[1]+m[4],y:m[1]*p[0]+m[3]*p[1]+m[5]});
class Context{
 constructor(){this.matrix=[1,0,0,1,0,0];this.stack=[];this.draws=[];this.globalAlpha=1;}
 save(){this.stack.push([...this.matrix]);}restore(){this.matrix=this.stack.pop();assert(this.matrix);}
 transform(...m){this.matrix=multiply(this.matrix,m);}setTransform(...m){this.matrix=m;}
 translate(x,y){this.transform(1,0,0,1,x,y);}scale(x,y){this.transform(x,0,0,y,0,0);}rotate(a){this.transform(Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0);}
 beginPath(){}moveTo(){}lineTo(){}closePath(){}clip(){}putImageData(){}clearRect(){}
 getImageData(){return{data:new Uint8ClampedArray(4)};}
 drawImage(image,...args){this.draws.push({image,args,matrix:[...this.matrix]});}
}
function passengerContracts(){
 const report={cases:0,lipPoints:0,worstBodyLipGap:0,worstBabyPouchTransformGap:0};
 for(const h of [145,200,280])for(const weight of [0,.35,1]){
  const api=rig(heroSource,helperSource,true),native=api.window.BearlyBabyPassenger.draw;let passengerMatrix;
  api.window.BearlyBabyPassenger.draw=(c,options)=>{passengerMatrix=[...c.matrix];return native(c,options);};
  for(const name of ['front','back'])for(let phase=0;phase<(weight?8:1);phase++){
   const c=new Proxy(new Context(),{get:(o,k)=>k in o?o[k]:()=>{}});api.window.__submitted.length=0;
   assert.equal(api.window.BearlyHeroRig.draw(c,0,0,h,1,{centrumCache:true,distance:api.window.BearlyLocomotion.cycleLength(h)*phase/8,weight,groundMotion:horizontal,state:{hp:100,baby:name==='back'}}),true);
   const audit=api.window.BearlyHeroRig.audit(),upper=api.upperSource(api.profiles[name],name),triangles=api.window.__submitted.filter(t=>t.image===upper.tile).map(t=>t.source.map((source,i)=>({source,destination:t.destination[i]})));
   assert(triangles.length,'observe the actual submitted upper carrier triangles');const pouchDraw=c.draws.at(-1),pouch=audit.babyFace.pouch;
   for(let i=0;i<6;i++){const gap=Math.abs(passengerMatrix[i]-pouchDraw.matrix[i]);near(gap,0);report.worstBabyPouchTransformGap=Math.max(report.worstBabyPouchTransformGap,gap);}
   near(audit.babyFace.uniformScale,(name==='front'?85:78)/61*h/api.profiles[name].stature);
   for(const p of pouch.lip){const local={x:(p[0]-pouch.origin[0])*pouch.scale,y:(p[1]-pouch.origin[1])*pouch.scale},babyLip=mapped(passengerMatrix,[local.x,local.y]),paint=sample(triangles,{x:p[0]-upper.rect[0],y:p[1]-upper.rect[1]}),bodyLip={x:paint.x*h/280,y:paint.y*h/280},gap=distance(babyLip,bodyLip);
    assert(gap<h*.006,'original pouch/baby attachment remains bounded against submitted parent carrier');report.worstBodyLipGap=Math.max(report.worstBodyLipGap,gap);report.lipPoints++;
   }
   assert.equal(c.stack.length,0);report.cases++;
  }
 }
 return report;
}
async function directional(code=directionalSource){
 class Image{naturalWidth=2400;naturalHeight=2400;set src(v){this.url=v;queueMicrotask(()=>this.onload?.());}get src(){return this.url;}}
 const window={BearlyBabyPassenger:{ready:()=>true},BearlyHeroRig:{ready:()=>true,drawPassengerLayout:()=>({})}},sandbox={window,Image,document:{createElement:()=>({width:0,height:0,getContext:()=>new Context()})}};
 for(const n of ['locomotion','centrum-depth-gait'])vm.runInNewContext(fs.readFileSync('js/'+n+'.js','utf8'),sandbox);vm.runInNewContext(helperSource,sandbox);vm.runInNewContext(code,sandbox);
 const api=window.BearlyCentrumDirectionalRig;assert.equal(await api.preload(),true);return{api,window};
}
function directionalContracts(api,window){
 const report={cases:0,submittedJoints:0,loadingAngles:[],swingAngles:[],restCases:0};
 for(const view of ['toward','away'])for(const h of [145,200,280])for(const face of [-1,1])for(const weight of [0,1])for(let phase=0;phase<16;phase++){
  const c=new Context(),motion=window.BearlyCentrumDepthGait.heading(0,view==='away'?-80:80,face),a=api.draw(c,0,0,h,face,{centrumView:view,state:{hp:100},distance:window.BearlyLocomotion.cycleLength(h)*phase/16,weight,groundMotion:motion}),raw=api.definition().views[view],normal=512/raw.height;
  for(const [index,side]of [[0,'far'],[3,'near']]){const r=raw.legs[side],p=k=>[(r[k][0]-raw.rect[0])*normal,(r[k][1]-raw.rect[1])*normal],hip=mapped(c.draws[index].matrix,p('hip')),knee=mapped(c.draws[index].matrix,p('knee')),cuff=mapped(c.draws[index+1].matrix,p('cuff'));
   near(distance(knee,mapped(c.draws[index+1].matrix,p('knee'))),0);near(distance(cuff,mapped(c.draws[index+2].matrix,p('cuff'))),0);near(knee.x,a.landmarks[side].knee.x*face);near(knee.y,a.landmarks[side].knee.y);report.submittedJoints+=2;
   for(const part of [0,1,2]){const m=c.draws[index+part].matrix;assert((m[0]*m[3]-m[1]*m[2])*face>0,'submitted directional segments must keep positive orientation');}
   const sole=mapped(c.draws[index+2].matrix,p('sole')),f=a.gait[side];near(sole.x,face*((r.sole[0]-raw.ground[0])*normal*h/488+f.x));near(sole.y,(r.sole[1]-raw.ground[1])*normal*h/488+f.y);
   if(weight===0){near(a.landmarks[side].kneeBend,0);report.restCases++;}
   if(weight===1&&h===200&&face===1&&(phase===4||phase===12)){
    const degrees=angle(hip,knee,cuff);if(f.stance){assert(degrees<178&&degrees>150,'support leg must stay softly flexed');report.loadingAngles.push({view,side,degrees});}else{assert(degrees<155,'directional swing must visibly fold');report.swingAngles.push({view,side,degrees});}
   }
  }
  assert.equal(c.stack.length,0);report.cases++;
 }
 assert.equal(report.loadingAngles.length,report.swingAngles.length);for(let i=0;i<report.loadingAngles.length;i++)assert(report.loadingAngles[i].degrees-report.swingAngles[i].degrees>8,'recovery flex must exceed support flex');return report;
}
(async()=>{
 const api=rig();
 const report={scope:'Actual submitted triangles and Canvas transforms with mocked rasterization; no likeness, pixel or visual-quality claim',peakSwing:actualBendContract(api),surface:surfaceContracts(api),defaultSourceCases:defaultContracts(api),passenger:passengerContracts(),rejectedMutations:[]};
 const kneeToken='out=Math.sqrt(Math.max(0,L1*L1-along*along))';assert(heroSource.includes(kneeToken),'find the actual fixed-length knee solve');
 assert.throws(()=>surfaceContracts(rig(heroSource.replace(kneeToken,'out=0'))),assert.AssertionError,'removing solved knee displacement must fail actual joint/bone geometry');report.rejectedMutations.push('zero solved knee displacement');
 const shinToken='shin:p=>rotate(p,K0,K,shinAngle)';assert(heroSource.includes(shinToken),'find actual shin transform');
 assert.throws(()=>surfaceContracts(rig(heroSource.replace(shinToken,'shin:p=>{const q=rotate(p,K0,K,shinAngle);return{x:2*K.x-q.x,y:q.y};}'))),assert.AssertionError,'inverted actual shin must fail submitted orientation');report.rejectedMutations.push('inverted shin transform');
 assert.throws(()=>surfaceContracts(rig(heroSource.replace(shinToken,'shin:p=>rotate(p,K0,{x:K.x+2,y:K.y},shinAngle)'))),assert.AssertionError,'detached actual shin must fail the shared knee');report.rejectedMutations.push('detached shin knee');
 const d=await directional();report.directional=directionalContracts(d.api,d.window);
 const supportToken='wp?Math.min(.021,wp.knees[side]):.016*flex*flex';assert(directionalSource.includes(supportToken),'find real directional support/swing drive');
 const broken=await directional(directionalSource.replace(supportToken,'wp?(f.stance?0:Math.min(.021,wp.knees[side])):.016*flex*flex'));
 assert.throws(()=>directionalContracts(broken.api,broken.window),assert.AssertionError,'rigid support-leg mutant must fail submitted joint geometry');report.rejectedMutations.push('rigid directional support');
 report.passed=true;console.log(JSON.stringify(report));
})().catch(error=>{console.error(error);process.exitCode=1;});
