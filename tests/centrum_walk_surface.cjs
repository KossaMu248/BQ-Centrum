/* Actual submitted source triangles: cloth ownership, continuous trouser hems,
   a moving pelvis, and repair/default-cache isolation. No pixel/FPS claim. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const current=fs.readFileSync('js/hero-rig.js','utf8');
function rig(code=current){
 function context(){return new Proxy({},{get(o,k){if(k==='getImageData')return()=>({data:new Uint8ClampedArray(4)});return k in o?o[k]:()=>{};},set(o,k,v){o[k]=v;return true;}});}
 const window={},sandbox={window,Image:class{naturalWidth=2400;naturalHeight=2400;},Path2D:class{moveTo(){}quadraticCurveTo(){}lineTo(){}closePath(){}},document:{createElement:()=>({width:0,height:0,dataset:{},getContext:context})}};
 for(const n of ['locomotion','baby-passenger','centrum-depth-gait','centrum-walk-pose'])vm.runInNewContext(fs.readFileSync('js/'+n+'.js','utf8'),sandbox);
 const marker='  window.BearlyHeroRig={';assert.equal(code.split(marker).length,2);
 vm.runInNewContext(code.replace(marker,'  window.__surface={profiles,surfacePose,lowerMesh,prepareLower,projectGroundGait,centrumJob,bodyFrame};\n'+marker),sandbox);window.BearlyHeroRig.preload();return{...window.__surface,window,context};
}
const hem=[[170,520],[280,540],[380,580],[490,607.5],[540,620],[650,610],[820,571.75],[850,565],[1010,545],[1191,520]];
const hemAt=x=>{for(let i=1;i<hem.length;i++)if(x<=hem[i][0])return hem[i-1][1]+(hem[i][1]-hem[i-1][1])*(x-hem[i-1][0])/(hem[i][0]-hem[i-1][0]);return hem.at(-1)[1];};
const near=(a,b,e=1e-6)=>assert(Math.abs(a-b)<=e,`${a} != ${b}`);
function submitted(api,profile,h,phase,weight,motion){const gait=api.projectGroundGait(api.window.BearlyLocomotion.pose(api.window.BearlyLocomotion.cycleLength(h)*phase,h,weight),motion,weight),pose=api.surfacePose(profile,h,gait,weight),mesh=api.lowerMesh(profile,pose,gait,weight),source=api.prepareLower(4);
 const raw=v=>({x:v.source.x/source.tile.width*source.key.rect[2]+source.key.rect[0],y:v.source.y/source.tile.height*source.key.rect[3]+source.key.rect[1]});
 const parts=mesh.triangles.filter(t=>!t.image).map(t=>({t,raw:t.map(raw)}));return{gait,pose,mesh,source,parts};}
function contract(code=current,dense=false){const api=rig(code),r={cases:0,calfVertices:0,hemJoins:0,worstSeamResidual:0,pelvisCases:0,sourceCases:0,cacheCases:0};
 for(const name of ['front','back'])for(const h of [145,200,280])for(const phase of (dense?Array.from({length:48},(_,i)=>i/48):[0,.125,.25,.5,.75]))for(const weight of (dense?[0,.25,1]:[1]))for(const motion of [{x:1,y:0,centrumWalk:true},...(dense?[{x:0,y:-1,centrumWalk:true},{x:0,y:1,centrumWalk:true},{x:.6,y:.8,centrumWalk:true},{x:.6,y:-.8,centrumWalk:true}]:[]),{sourceWalk:true}]){
  const profile=api.profiles[name],v=submitted(api,profile,h,phase,weight,motion),area=p=>(p[1].x-p[0].x)*(p[2].y-p[0].y)-(p[1].y-p[0].y)*(p[2].x-p[0].x);for(const t of v.mesh.triangles)assert(area(t.map(p=>p.source))*area(t.map(p=>p.destination))>0,'repaired source surface never folds');const pants=v.parts.filter(p=>p.raw.some(q=>q.y<100)),calves=v.parts.filter(p=>p.raw.every(q=>q.y>=100));assert(pants.length&&calves.length);
  for(const part of calves)for(let i=0;i<3;i++){const p=part.raw[i],d=part.t[i].destination;assert(p.y>=hemAt(p.x)-1e-6,'moving calf must never repaint shorts texels');assert(Number.isFinite(d.x)&&Number.isFinite(d.y));r.calfVertices++;
   if(Math.abs(p.y-hemAt(p.x))>1e-6)continue;
   const matches=[];for(const c of pants)for(let j=0;j<3;j++){const a=c.raw[j],b=c.raw[(j+1)%3];if(Math.abs(a.y-hemAt(a.x))>1e-6||Math.abs(b.y-hemAt(b.x))>1e-6||Math.abs(a.x-b.x)<1e-6||p.x<Math.min(a.x,b.x)-1e-6||p.x>Math.max(a.x,b.x)+1e-6)continue;const t=(p.x-a.x)/(b.x-a.x),A=c.t[j].destination,B=c.t[(j+1)%3].destination;matches.push({x:A.x+(B.x-A.x)*t,y:A.y+(B.y-A.y)*t});}
   assert(matches.length,'every calf root has an actual submitted pants hem');const gap=Math.min(...matches.map(q=>Math.hypot(q.x-d.x,q.y-d.y)));r.worstSeamResidual=Math.max(r.worstSeamResidual,gap);assert(gap<1e-6,'calf and pants must share their moving boundary');r.hemJoins++;
  }
  const topology=v.source.clothPolygons;assert(topology?.far&&topology?.near);const again=submitted(api,profile,h,phase+.01,weight,motion);assert.equal(again.source.clothPolygons,topology,'source topology is cached rather than clipped every frame');
  const top=pants.flatMap(p=>p.raw.map((q,i)=>({q,d:p.t[i].destination}))).find(p=>p.q.y<100);assert(top);const n=v.source.norm([top.q.x,top.q.y]),base=v.pose.pelvisPoint(v.pose.pivot.x+n.x*v.pose.s,(profile.pelvisY-10-v.pose.oy+n.y)*v.pose.s);near(top.d.x,base.x);near(top.d.y,base.y);
  if(weight===1&&phase===0){let moved=false;for(const p of pants)for(let i=0;i<3;i++){const q=p.raw[i];if(q.y<500)continue;const n=v.source.norm([q.x,q.y]),base=v.pose.pelvisPoint(v.pose.pivot.x+n.x*v.pose.s,(profile.pelvisY-10-v.pose.oy+n.y)*v.pose.s);if(Math.hypot(p.t[i].destination.x-base.x,p.t[i].destination.y-base.y)>.1)moved=true;}assert(moved,'trousers follow the upper legs while their waist stays attached');r.pelvisCases++;}
  r.cases++;
 }
 for(const weight of [0,1]){const job=api.centrumJob(api.profiles.front,'front',30,200,weight,{sourceWalk:true});assert(job.gait.sourceWalk);assert(job.key.startsWith('route:'),'repaired route frames have their own cache keys');r.sourceCases++;}
 const a=api.bodyFrame(api.profiles.front,'front',33,200,1,null),b=api.bodyFrame(api.profiles.front,'front',33,200,1,{sourceWalk:true});assert(!a.gait.sourceWalk&&b.gait.sourceWalk,'legacy and repaired fallback frames cannot contaminate each other');assert.notEqual(a,b);assert.equal(api.bodyFrame(api.profiles.front,'front',33,200,1,null),a);r.cacheCases++;
 api.window.BearlyHeroRig.draw(api.context(),0,0,200,1,{routeCache:true,distance:33,weight:1,state:{hp:100}});assert(api.window.BearlyHeroRig.audit().gait.sourceWalk,'actual on-foot route drawing opts into the repair');r.sourceCases++;
 return r;
}
const report=contract(current,true);report.rejectedRegressions=[];
for(const [name,from,to]of [
 ['duplicate shorts','polygons.push(...clipHem([[left0,y0],[right0,y0],[right1,y1],[left1,y1]]))','polygons.push([[left0,y0],[right0,y0],[right1,y1],[left1,y1]])'],
 ['detached calf','blend=clamp((raw[1]-hemY)/Math.max(1,bottom-hemY),0,1)','blend=1'],
 ['rigid trousers','.24*hemWeight','.0*hemWeight'],
 ['fallback frame mixing',"groundMotion?.sourceWalk?':source-anatomy':''","groundMotion?.sourceWalk?'':''"],
 ['unrepaired route',"options.routeCache?{...options.groundMotion,sourceWalk:true}:options.groundMotion","options.routeCache?options.groundMotion:options.groundMotion"]]){
 assert(current.includes(from),name);assert.throws(()=>contract(current.replace(from,to)),assert.AssertionError,name);report.rejectedRegressions.push(name);
}
// Rejected source-domain regression also applies to the actual previous game.
const baseline=JSON.parse(fs.readFileSync('references/source/stage22-source-integration.json','utf8')).files['js/hero-rig.js'];let old=current;
const stage23=JSON.parse(fs.readFileSync('references/source/stage23-source-integration.json','utf8')).files['js/hero-rig.js'];
assert.equal(crypto.createHash('sha256').update(old).digest('hex'),stage23.currentSha256,'reviewed Stage23 renderer');
for(const change of [...stage23.changes].reverse()){assert(old.includes(change.current));old=old.replace(change.current,change.previous);}
assert.equal(crypto.createHash('sha256').update(old).digest('hex'),stage23.previousSha256,'exact Stage22 renderer before older inverse');
for(const change of [...baseline.changes].reverse()){assert(old.includes(change.current));old=old.replace(change.current,change.previous);}
assert.equal(crypto.createHash('sha256').update(old).digest('hex'),baseline.previousSha256,'exact previous renderer comes from the reviewed inverse, without Git or a donor');
assert.throws(()=>contract(old),assert.AssertionError,'previous published renderer must expose the defect');report.previousPublishedDefectRejected=true;
const api=rig(),legacy=rig(old);report.unchangedDefaultCases=0;report.sourceContactCases=0;
for(const name of ['front','back'])for(const h of [145,200,280])for(const phase of [0,.125,.375,.625,.875])for(const weight of [0,.3,1]){
 const g=api.window.BearlyLocomotion.pose(api.window.BearlyLocomotion.cycleLength(h)*phase,h,weight),p=api.surfacePose(api.profiles[name],h,g,weight),q=legacy.surfacePose(legacy.profiles[name],h,g,weight);
 assert.deepEqual(JSON.parse(JSON.stringify(p)),JSON.parse(JSON.stringify(q)),'default source pose stays exact');
 const a=api.lowerMesh(api.profiles[name],p,g,weight),b=legacy.lowerMesh(legacy.profiles[name],q,g,weight);assert.deepEqual(JSON.parse(JSON.stringify(a.vertices)),JSON.parse(JSON.stringify(b.vertices)),'default source mesh stays exact');report.unchangedDefaultCases++;
}
for(const name of ['front','back'])for(const h of [145,200,280]){
 const depth=api.window.BearlyCentrumDepthGait,native=api.window.BearlyLocomotion,dist=native.cycleLength(h)*.25*depth.sourceStrideScale,dt=1e-6,speed=180;
 const a=api.surfacePose(api.profiles[name],h,depth.projectSource(native.pose(dist/depth.sourceStrideScale,h,1)),1),b=api.surfacePose(api.profiles[name],h,depth.projectSource(native.pose((dist+speed*dt)/depth.sourceStrideScale,h,1)),1);
 near((b.legs.near.contact.x-a.legs.near.contact.x)/dt,-speed,1e-5);near((b.legs.near.contact.y-a.legs.near.contact.y)/dt,0);report.sourceContactCases++;
}
report.passed=true;console.log(JSON.stringify(report));
