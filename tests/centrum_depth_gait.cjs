/* Square-only short-step projection: contact lock, footprint and native opt-out. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const window={};
for(const name of ['locomotion','centrum-depth-gait'])vm.runInNewContext(fs.readFileSync('js/'+name+'.js','utf8'),{window});
const native=window.BearlyLocomotion,depth=window.BearlyCentrumDepthGait;
const close=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<e,`${a} differs from ${b}`);
assert.equal(depth.depthScale,.30);assert.equal(depth.depthSpeed,52);assert.equal(depth.walkSpeed,130);assert.equal(depth.strideScale,.70);
assert.equal(depth.distance(NaN,Infinity),0);assert.equal(depth.distance(3,0),3);
close(depth.distance(0,.30),1);close(depth.strideDistance(.70,0),1);
let cases=0,worstResidual=0,minimumGround=Infinity,maximumGround=-Infinity;
const directions=[[130,0],[-130,0],[0,52],[0,-52],[130/Math.SQRT2,52/Math.SQRT2],[-130/Math.SQRT2,52/Math.SQRT2],[130/Math.SQRT2,-52/Math.SQRT2],[-130/Math.SQRT2,-52/Math.SQRT2]];
for(const height of [145,200,280])for(const [vx,vy]of directions){
  const face=vx<0?-1:1,heading=depth.heading(vx,vy,face),cycle=native.cycleLength(height),d=cycle*.25,dt=1e-5;
  const a=native.pose(d,height,1),b=native.pose(d+depth.strideDistance(vx*dt,vy*dt),height,1),p=depth.project(a,heading),q=depth.project(b,heading);
  assert.equal(depth.project(a,null),a,'source renderer without Square motion remains literally native');
  if(!vy)assert.equal(heading.cacheKey,'horizontal');
  assert.equal(p.centrumWalk,true);close(p.phase,a.phase);
  close(p.bob,a.bob*.5);close(p.sway,a.sway*.5);close(p.roll,a.roll*.55);
  for(const side of ['near','far']){
    assert.equal(p[side].stance,a[side].stance);assert.equal(p[side].kneeFlex,a[side].kneeFlex);
    close(p[side].angle,a[side].angle*.65);close(p[side].shinAngle,a[side].shinAngle*.75);
  }
  // Shortening the stride must shorten its travel cycle equally. Otherwise
  // source contact-lock math would still pass while the actor moonwalked.
  assert.equal(p.near.stance,true);assert.equal(p.near.contactOffset,0);
  const residualX=vx+(q.near.x-p.near.x)/dt*face,residualY=vy+(q.near.y-p.near.y)/dt;
  worstResidual=Math.max(worstResidual,Math.hypot(residualX,residualY));close(residualX,0,2e-5);close(residualY,0,2e-5);cases++;
}
for(const height of [145,200,280])for(const face of [-1,1])for(const sign of [-1,1]){
  const heading=depth.heading(0,52*sign,face),cycle=native.cycleLength(height),baseline={near:0,far:-9*height/488},radius=12*height/200;
  for(let step=0;step<=512;step++){
    const source=native.pose(cycle*step/512,height,1),p=depth.project(source,heading);
    for(const side of ['near','far']){
      const ground=baseline[side]+p[side].groundDepth;
      minimumGround=Math.min(minimumGround,ground/height*200);maximumGround=Math.max(maximumGround,ground/height*200);
      assert.ok(Math.abs(ground)<=radius+1e-8,'ground contacts remain inside the unchanged player depth footprint');
      close(p[side].y-p[side].nativeLift,p[side].groundDepth);
      if(source[side].stance)assert.equal(p[side].nativeLift,0,'stance never invents jump height');
    }
  }
}
const cadence=depth.strideDistance(0,depth.depthSpeed)/native.cycleLength(200),horizontalCadence=depth.strideDistance(depth.walkSpeed,0)/native.cycleLength(200);
assert.ok(cadence>1.5&&cadence<1.8);assert.ok(horizontalCadence>1.2&&horizontalCadence<1.5);
close(minimumGround,-9*200/488-36*.70*.30);close(maximumGround,36*.70*.30);
console.log(JSON.stringify({passed:true,midStanceCases:cases,worstResidualUnitsPerSecond:worstResidual,contactEnvelopeAtHeight200:[minimumGround,maximumGround],unchangedDepthRadius:12,pureDepthCyclesPerSecond:cadence,horizontalCyclesPerSecond:horizontalCadence,nativeOptOutPreserved:true}));
