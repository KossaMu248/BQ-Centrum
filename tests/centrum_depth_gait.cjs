/* Optional depth projection: stationary support, existing footprint and source identity. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const window={};
for(const name of ['locomotion','centrum-depth-gait'])vm.runInNewContext(fs.readFileSync('js/'+name+'.js','utf8'),{window});
const native=window.BearlyLocomotion,depth=window.BearlyCentrumDepthGait;
const close=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<e,`${a} differs from ${b}`);
assert.equal(depth.depthScale,.23);assert.equal(depth.depthSpeed,60);
assert.equal(depth.distance(NaN,Infinity),0);assert.equal(depth.distance(3,0),3);
close(depth.distance(0,.23),1);
let cases=0,worstResidual=0,minimumGround=Infinity,maximumGround=-Infinity;
const directions=[[155,0],[-155,0],[0,60],[0,-60],[155/Math.SQRT2,60/Math.SQRT2],[-155/Math.SQRT2,60/Math.SQRT2],[155/Math.SQRT2,-60/Math.SQRT2],[-155/Math.SQRT2,-60/Math.SQRT2]];
for(const height of [145,200,280])for(const [vx,vy]of directions){
  const face=vx<0?-1:1,heading=depth.heading(vx,vy,face),cycle=native.cycleLength(height),d=cycle*.25,dt=1e-5;
  const a=native.pose(d,height,1),b=native.pose(d+heading.metricSpeed*dt,height,1),p=depth.project(a,heading),q=depth.project(b,heading);
  if(!vy){assert.equal(p,a,'horizontal source gait is literally the original object');assert.equal(heading.cacheKey,'horizontal');}
  close(p.phase,a.phase);close(p.bob,a.bob);close(p.sway,a.sway);close(p.roll,a.roll);close(p.pelvisSway,a.pelvisSway);close(p.pelvisRoll,a.pelvisRoll);
  for(const side of ['near','far'])for(const key of ['angle','shinAngle','kneeFlex','contactOffset','stance'])assert.equal(p[side][key],a[side][key],'native boot rotation/support and body dynamics remain unchanged');
  // At near-foot mid stance, source heel/toe contactOffset is zero. Its world
  // ground anchor must cancel actual two-axis actor travel, rather than moonwalk.
  assert.equal(p.near.stance,true);assert.equal(p.near.contactOffset,0);
  const residualX=vx+(q.near.x-p.near.x)/dt*face,residualY=vy+(q.near.y-p.near.y)/dt;
  worstResidual=Math.max(worstResidual,Math.hypot(residualX,residualY));close(residualX,0,2e-5);close(residualY,0,2e-5);cases++;
}
// Actual source front-carrier sole baselines. Canonical 280px baking and accepted
// 200px presentation share this scale; neither changes the body collision data.
for(const height of [145,200,280])for(const face of [-1,1])for(const sign of [-1,1]){
  const heading=depth.heading(0,60*sign,face),cycle=native.cycleLength(height),baseline={near:0,far:-9*height/488},radius=12*height/200;
  for(let step=0;step<=512;step++){
    const source=native.pose(cycle*step/512,height,1),p=depth.project(source,heading);
    for(const side of ['near','far']){
      const ground=baseline[side]+p[side].groundDepth;
      minimumGround=Math.min(minimumGround,ground/height*200);maximumGround=Math.max(maximumGround,ground/height*200);
      assert.ok(Math.abs(ground)<=radius+1e-8,'projected ground contacts stay within the unchanged player depth footprint');
      close(p[side].y-p[side].nativeLift,p[side].groundDepth);
      if(source[side].stance)assert.equal(p[side].nativeLift,0,'stance never invents jump height');
    }
  }
}
const cadence=depth.distance(0,depth.depthSpeed)/native.cycleLength(200);
assert.ok(cadence>1.5&&cadence<2,'short depth steps have a bounded walking cadence, not rapid tapping');
close(minimumGround,-9*200/488-36*.23,1e-7);close(maximumGround,36*.23,1e-7);
console.log(JSON.stringify({passed:true,midStanceCases:cases,worstResidualUnitsPerSecond:worstResidual,contactEnvelopeAtHeight200:[minimumGround,maximumGround],unchangedDepthRadius:12,pureDepthCyclesPerSecond:cadence,depthSpeed:depth.depthSpeed,depthScale:depth.depthScale,horizontalSourceIdentity:true}));
