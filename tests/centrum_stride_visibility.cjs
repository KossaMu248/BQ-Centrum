/* Submitted original-boot geometry for alternating walking. Rasterization is
   mocked: silhouette visibility is separately measured with real source alpha. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const source=fs.readFileSync('js/hero-rig.js','utf8'),copy=v=>JSON.parse(JSON.stringify(v));
const near=(a,b,epsilon=1e-7)=>assert(Math.abs(a-b)<=epsilon,`${a} != ${b}`);
function context(){return new Proxy({},{get(o,k){if(k==='getImageData')return()=>({data:new Uint8ClampedArray(4)});return k in o?o[k]:()=>{};},set(o,k,v){o[k]=v;return true;}});}
function rig(code=source){
 const window={},sandbox={window,Image:class{naturalWidth=2400;naturalHeight=2400;},Path2D:class{moveTo(){}quadraticCurveTo(){}lineTo(){}closePath(){}},document:{createElement:()=>({width:0,height:0,dataset:{},getContext:context})}};
 for(const n of ['locomotion','baby-passenger','centrum-depth-gait','centrum-walk-pose'])vm.runInNewContext(fs.readFileSync('js/'+n+'.js','utf8'),sandbox);
 const marker='  window.BearlyHeroRig={';assert.equal(code.split(marker).length,2);
 vm.runInNewContext(code.replace(marker,'  window.__stride={profiles,projectGroundGait,surfacePose,lowerMesh,prepareLower};\n'+marker),sandbox);window.BearlyHeroRig.preload();return{...window.__stride,window};
}
function sample(triangles,p){
 for(const t of triangles){const[a,b,c]=t.map(v=>v.source),den=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);if(Math.abs(den)<1e-9)continue;
  const u=((b.y-c.y)*(p.x-c.x)+(c.x-b.x)*(p.y-c.y))/den,v=((c.y-a.y)*(p.x-c.x)+(a.x-c.x)*(p.y-c.y))/den,w=1-u-v;
  if(Math.min(u,v,w)>=-1e-7)return{x:t[0].destination.x*u+t[1].destination.x*v+t[2].destination.x*w,y:t[0].destination.y*u+t[1].destination.y*v+t[2].destination.y*w};
 }
 assert.fail('original boot landmark must lie in an actual submitted triangle');
}
function painted(api,name,h,phase,weight,motion){
 const native=api.window.BearlyLocomotion,profile=api.profiles[name],gait=api.projectGroundGait(native.pose(native.cycleLength(h)*phase,h,weight),motion,weight),pose=api.surfacePose(profile,h,gait,weight),mesh=api.lowerMesh(profile,pose,gait,weight),boot=api.prepareLower(0),triangles=mesh.triangles.filter(t=>t.image===boot.tile),points={};
 for(const[side,index]of [['near',0],['far',1]]){const leg=boot.key.legs[index];points[side]={};for(const key of ['sole','heel','toe']){const raw=leg[key],p={x:(raw[0]-boot.key.rect[0])/boot.key.rect[2]*boot.tile.width,y:(raw[1]-boot.key.rect[1])/boot.key.rect[3]*boot.tile.height};points[side][key]=sample(triangles,p);}}
 return{gait,pose,mesh,points};
}
const families=[{name:'Centrum',motion:{x:1,y:0,centrumWalk:true},scale:.70,speed:200},{name:'route',motion:{sourceWalk:true},scale:.85,speed:180}];
function leadContract(api){
 const rows=[];
 for(const name of ['front','back'])for(const h of [145,200,280])for(const family of families){
  const a=painted(api,name,h,0,1,family.motion),b=painted(api,name,h,.5,1,family.motion),lead=x=>x.points.near.sole.x-x.points.far.sole.x,toe=x=>x.points.near.toe.x-x.points.far.toe.x;
  assert(lead(a)>h*.24&&lead(b)<-h*.24,'both physical feet must alternately lead by a full half-step');near(lead(a)+lead(b),0);
  assert(toe(a)>h*.1&&toe(b)<-h*.1,'both original boot toes must visibly lead on their opposite contact frames');
  rows.push({carrier:name,height:h,family:family.name,nearContactLead:lead(a),farContactLead:lead(b),nearToeLead:toe(a),farToeLead:toe(b)});
 }
 return rows;
}
function cycleContracts(api,previous){
 const report={cases:0,weightBlends:0,stanceRetreat:0,idleCases:0,defaultCases:0,maximumHalfCycleContactResidual:0};
 for(const name of ['front','back'])for(const h of [145,200,280])for(const family of families)for(const weight of [0,.25,.5,.75,1]){
  const profile=api.profiles[name],s=h/profile.stature,standingGap=(profile.far.sole[0]-profile.near.sole[0])*s;
  for(let index=0;index<12;index++){
   const phase=index/24,a=painted(api,name,h,phase,weight,family.motion),b=painted(api,name,h,phase+.5,weight,family.motion),gap=x=>x.points.near.sole.x-x.points.far.sole.x,mid=(gap(a)+gap(b))*.5;
   near(mid,standingGap*(1-weight));report.weightBlends++;
   if(weight===1){const residual=Math.abs(gap(a)+gap(b));assert(residual<1e-7,'full walking cannot retain a front/back rest-foot stagger');report.maximumHalfCycleContactResidual=Math.max(report.maximumHalfCycleContactResidual,residual);}
   if(weight===0){const old=painted(previous,name,h,phase,weight,family.motion);assert.deepEqual(copy(a.pose),copy(old.pose),'standing pose is unaffected by the rest-width expression');assert.deepEqual(copy(a.mesh.vertices),copy(old.mesh.vertices),'standing mesh is unaffected by the rest-width expression');report.idleCases++;}
   report.cases+=2;
  }
  if(weight===1){
   const dt=1e-6,native=api.window.BearlyLocomotion;
   for(const[side,phase]of [['near',.25],['far',.75]]){
    const step=family.speed*dt/(native.cycleLength(h)*family.scale),a=painted(api,name,h,phase,1,family.motion),b=painted(api,name,h,phase+step,1,family.motion);
    near((b.points[side].sole.x-a.points[side].sole.x)/dt,-family.speed,2e-5);near((b.points[side].sole.y-a.points[side].sole.y)/dt,0);report.stanceRetreat++;
   }
  }
 }
 for(const name of ['front','back'])for(const h of [145,200,280])for(const weight of [0,.3,1])for(const phase of [0,.125,.375,.625,.875]){
  const native=api.window.BearlyLocomotion,g=native.pose(native.cycleLength(h)*phase,h,weight),p=api.surfacePose(api.profiles[name],h,g,weight),q=previous.surfacePose(previous.profiles[name],h,g,weight);
  assert.deepEqual(copy(p),copy(q),'unopted source pose is exact');assert.deepEqual(copy(api.lowerMesh(api.profiles[name],p,g,weight).vertices),copy(previous.lowerMesh(previous.profiles[name],q,g,weight).vertices),'unopted source geometry stays exact');report.defaultCases++;
 }
 return report;
}
function headingContracts(api){
 let cases=0;
 for(const name of ['front','back'])for(const h of [145,200,280])for(const weight of [0,.5,1]){
  const profile=api.profiles[name],standing=(profile.far.sole[0]-profile.near.sole[0])*h/profile.stature,means=[];
  for(const [x,y]of [[0,1],[0,-1],[.6,.8],[-.6,-.8]]){
   const motion={x,y,centrumWalk:true},a=painted(api,name,h,0,weight,motion),b=painted(api,name,h,.5,weight,motion),gap=v=>v.points.near.sole.x-v.points.far.sole.x,mean=(gap(a)+gap(b))*.5;
   if(x===0)near(mean,standing);
   else {assert(mean>=-1e-7&&mean<=standing+1e-7,'diagonal depth track stays bounded');means.push(mean);}
   cases++;
  }
  near(means[0],means[1]);
 }
 return cases;
}
const token="*.5*(name==='near'?1:-1)*(1-weight*Math.abs(gait.sourceWalk?1:(gait.groundMotion?.x??1)))",old="*.5*(name==='near'?1:-1)*(1-.1*weight)";assert.equal(source.split(token).length,2,'find the actual walking-only rest-width blend');
const oldStagger=source.replace(token,old),api=rig(),previous=rig(oldStagger),report={scope:'Actual submitted boot triangles under mocked rasterization; not a pixel, likeness, gameplay or device-performance claim',contacts:leadContract(api),cycle:cycleContracts(api,previous),headingCases:headingContracts(api),rejectedRegressions:[]};
for(const[name,before,after]of [
 ['persistent old rest-foot stagger',token,old],
 ['static far leg','leg=profile[name],f=gait[name],footAngle',"leg=profile[name],f=name==='far'?{...gait.far,x:0,y:0}:gait[name],footAngle"],
 ['both legs reuse the near phase','leg=profile[name],f=gait[name],footAngle','leg=profile[name],f=gait.near,footAngle']]){
 assert(source.includes(before),name);assert.throws(()=>leadContract(rig(source.replace(before,after))),assert.AssertionError,name+' must fail actual submitted geometry');report.rejectedRegressions.push(name);
}
const noDepth=rig(source.replace(token,"*.5*(name==='near'?1:-1)*(1-weight)"));
assert.throws(()=>headingContracts(noDepth),assert.AssertionError,'collapsing depth stance must fail submitted geometry');report.rejectedRegressions.push('collapsed depth stance');
const inverse='references/source/stage24-source-integration.json';
assert(fs.existsSync(inverse),'reviewed inverse is required to reject the actual previous published renderer');
report.previousPublishedDefectRejected=false;
{
 const spec=JSON.parse(fs.readFileSync(inverse,'utf8')).files['js/hero-rig.js'];assert(spec,'reviewed current source inverse includes walking renderer');let restored=source;
 assert.equal(crypto.createHash('sha256').update(restored).digest('hex'),spec.currentSha256,'new renderer matches reviewed inverse');
 for(const edit of [...spec.changes].reverse()){assert.equal(restored.split(edit.current).length,2);restored=restored.replace(edit.current,edit.previous);}
 assert.equal(crypto.createHash('sha256').update(restored).digest('hex'),spec.previousSha256);
 const published=rig(restored);
 assert.throws(()=>leadContract(published),assert.AssertionError,'the actual previous published renderer must expose its asymmetric stepping');report.previousPublishedDefectRejected=true;
 report.publishedDefaultCases=0;report.publishedIdleContactCases=0;
 for(const name of ['front','back'])for(const h of [145,200,280])for(const phase of [0,.125,.375,.625,.875])for(const weight of [0,.3,1]){
  const native=api.window.BearlyLocomotion,g=native.pose(native.cycleLength(h)*phase,h,weight),a=api.surfacePose(api.profiles[name],h,g,weight),b=published.surfacePose(published.profiles[name],h,g,weight);
  assert.deepEqual(copy(a),copy(b));assert.deepEqual(copy(api.lowerMesh(api.profiles[name],a,g,weight).vertices),copy(published.lowerMesh(published.profiles[name],b,g,weight).vertices));report.publishedDefaultCases++;
 }
 for(const name of ['front','back'])for(const h of [145,200,280])for(const family of families)for(const phase of [0,.25,.5,.75]){
  const a=painted(api,name,h,phase,0,family.motion),b=painted(published,name,h,phase,0,family.motion);assert.deepEqual(copy(a.pose),copy(b.pose));assert.deepEqual(copy(a.points),copy(b.points));report.publishedIdleContactCases++;
 }
}
report.passed=true;console.log(JSON.stringify(report));
