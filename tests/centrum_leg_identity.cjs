/* Regression: anatomical near/far source ownership and painted layer order.
   Canvas raster is mocked, so actual pixel/animation review is separate. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process');
const baselineOrderOnly=process.argv.includes('--baseline-order-only'),baseline=baselineOrderOnly||process.argv.includes('--baseline');
function context(){const state={globalAlpha:1},stack=[];return new Proxy(state,{get(o,key){if(key==='save')return()=>stack.push({...o});if(key==='restore')return()=>Object.assign(o,stack.pop());return key in o?o[key]:()=>{};},set(o,k,v){o[k]=v;return true;}});}
const window={},sandbox={window,Image:class{naturalWidth=2400;naturalHeight=2400;},Path2D:class{moveTo(){}quadraticCurveTo(){}lineTo(){}closePath(){}},document:{createElement:()=>({width:0,height:0,dataset:{},getContext:context})}};
for(const name of ['locomotion','baby-passenger','centrum-depth-gait'])vm.runInNewContext(fs.readFileSync('js/'+name+'.js','utf8'),sandbox);
let source=baseline?cp.execFileSync('git',['show','e5b0daa58ea5bdbddc866767badea86901169290:js/hero-rig.js'],{encoding:'utf8'}):fs.readFileSync('js/hero-rig.js','utf8');const marker='  window.BearlyHeroRig={';assert.equal(source.split(marker).length,2);
source=source.replace(marker,'  window.__legReview={profiles,surfacePose,lowerMesh,prepareLower};\n'+marker);vm.runInNewContext(source,sandbox);
window.BearlyHeroRig.preload();const api=window.__legReview,walk=window.BearlyCentrumDepthGait,native=window.BearlyLocomotion;
const report={cases:0,nearToFarRatio:[],layerCases:0,babyCases:0};
for(const profileName of ['front','back'])for(const h of [145,200,280])for(const [vx,vy]of [[130,0],[0,-52],[0,52],[92,-37],[92,37]])for(let phase=0;phase<8;phase++){
 const profile=api.profiles[profileName],direction=walk.heading(vx,vy,1),gait=walk.project(native.pose(native.cycleLength(h)*phase/8,h,1),direction);
 for(const lifted of [null,'near','far']){
  const planned=lifted?{...gait,[lifted]:{...gait[lifted],y:gait[lifted].y-80}}:gait;
  const pose=api.surfacePose(profile,h,planned,1),mesh=api.lowerMesh(profile,pose,planned,1),parts=mesh.rendered;
  const near=Math.hypot(parts.near.toe.x-parts.near.heel.x,parts.near.toe.y-parts.near.heel.y),far=Math.hypot(parts.far.toe.x-parts.far.heel.x,parts.far.toe.y-parts.far.heel.y);
  const expected=profile.near.boot[2]/profile.far.boot[2];if(!baselineOrderOnly){assert(near>far,'foreground shoe must remain larger than its paired background shoe');assert(Math.abs(near/far-expected)<1e-10,'native profile proportions persist across steps/lift');}
  assert.notDeepEqual(parts.near.source.heel,parts.far.source.heel,'two distinct source boots, not one cloned foot');assert.notDeepEqual(parts.near.source.toe,parts.far.source.toe);
  // Inspect the actual submitted boot triangles. Contact-source near starts at
  // raw x645; far ends at595, so their identity is independently recoverable
  // from source texels rather than an asserted render-order label.
  const prepared=api.prepareLower(0),ids=mesh.triangles.filter(t=>t.image).map(t=>{
   const x=t.reduce((sum,p)=>sum+p.source.x/prepared.tile.width*prepared.key.rect[2]+prepared.key.rect[0],0)/3;
   return x<620?'far':'near';
  });
  assert(ids.includes('near')&&ids.includes('far'));
  assert(ids.lastIndexOf('far')<ids.indexOf('near'),'swing lift cannot flip the actor\'s anatomical near/far paint order');
  const idle=api.prepareLower(4);
  const identity=mesh.triangles.map(t=>{
   const paint=t.image?prepared:idle,raw=t.map(p=>({x:p.source.x/paint.tile.width*paint.key.rect[2]+paint.key.rect[0],y:p.source.y/paint.tile.height*paint.key.rect[3]+paint.key.rect[1]}));
   if(!t.image&&raw.some(p=>p.y<499.999))return {side:'pants',kind:'pants',raw};
   const x=raw.reduce((sum,p)=>sum+p.x,0)/3;
   return {side:x<620?'far':'near',kind:t.image?'boot':'calf',raw};
  });
  if(!baselineOrderOnly){
   const legs=identity.filter(part=>part.side!=='pants'),sides=legs.map(part=>part.side);
   assert(sides.lastIndexOf('far')<sides.indexOf('near'),'complete far calf AND boot must be painted before ANY near calf or boot');
   for(const side of ['far','near']){const kinds=legs.filter(part=>part.side===side).map(part=>part.kind);assert(kinds.includes('calf')&&kinds.includes('boot'));assert(kinds.lastIndexOf('calf')<kinds.indexOf('boot'),'each native boot covers only its own calf cuff');}
   const firstPants=identity.findIndex(part=>part.side==='pants');assert(firstPants>=0&&identity.slice(firstPants).every(part=>part.side==='pants'),'native trousers finish above both complete legs');
   // The extra source orange column starts at x893 around y600 and has no
   // matching boot. Submitted calf texels must stop inside that gap.
   for(const part of legs.filter(part=>part.kind==='calf'))for(const point of part.raw)if(point.y>=580&&point.y<=800)assert(point.x<=892.00001,'unbooted third source-fur column must not be painted as part of the calf');
  }
  assert(parts.near.sole.x===pose.legs.near.sole.x&&parts.far.sole.x===pose.legs.far.sole.x,'each shoe follows its own leg, not the other hip');
  if(!lifted)report.nearToFarRatio.push(near/far);report.layerCases++;
 }
 report.cases++;
}
for(const face of [-1,1])for(const [vx,vy]of [[130,0],[0,-52],[0,52]]){
 window.BearlyHeroRig.draw(context(),0,0,200,face,{centrumCache:true,state:{hp:100},weight:1,distance:30,groundMotion:walk.heading(vx,vy,face)});
 const a=window.BearlyHeroRig.audit();assert(a.babyFace.continuousUpperBody&&a.babyFace.originalCollar&&!a.babyFace.headOnly);assert(Math.abs(a.babyFace.uniformScale-.5710830421929589)<1e-10);assert(a.landmarks.near.bootWidth>a.landmarks.far.bootWidth);report.babyCases++;
}
report.nearToFarRatio={min:Math.min(...report.nearToFarRatio),max:Math.max(...report.nearToFarRatio)};
console.log(JSON.stringify({passed:true,...report}));
