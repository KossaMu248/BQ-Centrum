/* Pure normalized articulation against the real native/projected walk phases.
   These numeric contracts do not claim visual quality or device performance. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const forbidden=()=>{throw Error('Walking pose must not own timers, listeners, storage or artwork');};
const window={},sandbox={window,setTimeout:forbidden,setInterval:forbidden,requestAnimationFrame:forbidden,addEventListener:forbidden,
 localStorage:new Proxy({},{get:()=>forbidden}),Image:forbidden,document:new Proxy({},{get:()=>forbidden})};
for(const name of ['locomotion','centrum-depth-gait','centrum-walk-pose'])vm.runInNewContext(fs.readFileSync('js/'+name+'.js','utf8'),sandbox);
const native=window.BearlyLocomotion,depth=window.BearlyCentrumDepthGait,{sample}=window.BearlyCentrumWalkPose;
const copy=value=>JSON.parse(JSON.stringify(value)),values=p=>[p.chestLean,p.chestBob,p.chestSway,p.pelvisRoll,p.pelvisDrop,p.shoulderTurn,p.headNod,p.knees.near,p.knees.far];
const near=(a,b,tolerance=1e-10)=>assert(Math.abs(a-b)<=tolerance,`${a} differs from ${b}`);
const equalPose=(a,b)=>values(a).forEach((value,i)=>near(value,values(b)[i]));
const report={realGaitCases:0,phaseBoundaryCases:0,weightCases:0,invalidInputCases:0,legacyCases:0};
assert.equal(native.stanceDuty,.5,'sampler support/recovery timing matches production locomotion');
for(const gait of [null,undefined,{},native.pose(25,200,1),{phase:.4,centrumWalk:false,sourceWalk:false}]){
 assert.equal(sample(gait,200,1),null,'the original default renderer has no new pose');report.legacyCases++;
}
const headings=[{x:1,y:0,centrumWalk:true},{x:0,y:1,centrumWalk:true},{x:0,y:-1,centrumWalk:true},{x:.6,y:.8,centrumWalk:true},{x:.6,y:-.8,centrumWalk:true}];
for(const height of [90,145,200,280,500])for(let tick=0;tick<96;tick++)for(const weight of [0,.15,.5,1]){
 const phase=tick/96,gait=native.pose(native.cycleLength(height)*phase,height,weight);
 for(const projected of [...headings.map(heading=>depth.project(gait,heading)),depth.projectSource(gait)]){
  const before=copy(projected),p=sample(projected,height,weight),canonical=sample({...projected,phase},280,weight);
  assert.deepEqual(copy(projected),before,'articulation must not alter planted soles, source lift, toe roll or gait state');
  equalPose(p,canonical);equalPose(p,sample(projected,height*2,weight));
  assert(values(p).every(Number.isFinite),'every normalized component stays finite');
  assert(p.chestLean>=.023*weight-1e-12&&p.chestLean<=.041*weight+1e-12);
  assert(Math.abs(p.chestBob)<=.012*weight+1e-12&&Math.abs(p.chestSway)<=.006*weight+1e-12);
  assert(Math.abs(p.pelvisRoll)<=.022*weight+1e-12&&p.pelvisDrop>=0&&p.pelvisDrop<=.004*weight+1e-12);
  assert(Math.abs(p.shoulderTurn)<=.028*weight+1e-12&&Math.abs(p.headNod)<=.012*weight+1e-12);
  for(const side of ['near','far']){
   const bend=p.knees[side];assert(bend>=0&&bend<=.031*weight+1e-12,'bends are bounded fractions of height');
   if(projected[side].stance)assert(bend<=.007*weight+1e-12,'supporting knee remains lightly flexed');
  }
  if(!weight)assert(values(p).every(value=>Object.is(value,0)),'idle is exactly the source pose, including no negative zero');
  report.realGaitCases++;
 }
}
// Recovery folds the correct knee, with the opposite leg carrying the body.
for(const [phase,swing,support] of [[.25,'far','near'],[.75,'near','far']]){
 const g=depth.projectSource(native.pose(native.cycleLength(200)*phase,200,1)),p=sample(g,200,1);
 assert.equal(g[swing].stance,false);assert.equal(g[support].stance,true);
 assert(p.knees[swing]>=.03&&p.knees[support]<=.007+1e-12);assert(p.knees[swing]>p.knees[support]*4);
}
for(let tick=0;tick<96;tick++){
 const phase=tick/96,p=sample({phase,centrumWalk:true},200,1),half=sample({phase:phase+.5,centrumWalk:true},200,1);
 near(p.knees.near,half.knees.far);near(p.knees.far,half.knees.near);
 near(p.pelvisRoll,-half.pelvisRoll);near(p.shoulderTurn,-half.shoulderTurn);
 near(p.chestBob,half.chestBob);near(p.headNod,half.headNod);
 assert(p.pelvisRoll*p.shoulderTurn<=1e-15,'shoulders counter the pelvis rather than moving as one rigid figure');
 for(const weight of [.01,.2,.5,.85]){
  const weighted=sample({phase,sourceWalk:true},200,weight);
  values(weighted).forEach((value,i)=>near(value,values(p)[i]*weight));report.weightCases++;
 }
}
// Position and velocity agree across heel strike, toe-off and wrapped phases.
const epsilon=1e-6;
for(const boundary of [-1,-.5,0,.5,1,1.5,2])for(const weight of [.2,1]){
 const a=sample({phase:boundary-epsilon,centrumWalk:true},200,weight),b=sample({phase:boundary,centrumWalk:true},200,weight),c=sample({phase:boundary+epsilon,centrumWalk:true},200,weight);
 values(a).forEach((value,i)=>{
  assert(Math.abs(values(c)[i]-value)<1e-5,'phase boundaries do not jump');
  near((values(b)[i]-value)/epsilon,(values(c)[i]-values(b)[i])/epsilon,2e-5);
 });report.phaseBoundaryCases++;
}
for(const phase of [-123.75,-.2,0,.2,17.25]){
 equalPose(sample({phase,sourceWalk:true},200,1),sample({phase:phase+1,sourceWalk:true},200,1));
}
// Chest vertical travel, pelvis rotation and shoulders have distinct paths.
const quarter=sample({phase:.25,centrumWalk:true},200,1),start=sample({phase:0,centrumWalk:true},200,1);
assert(start.chestBob>0&&quarter.chestBob<0&&quarter.pelvisDrop<1e-12);
assert(Math.abs(quarter.pelvisRoll)>.02&&Math.abs(quarter.shoulderTurn)>.025&&Math.abs(quarter.chestSway)>.005);
assert(quarter.chestLean>0&&quarter.knees.near!==quarter.knees.far,'torso and both legs have independent stride responses');
for(const phase of [NaN,Infinity,-Infinity,undefined,null,'0.5',{},Number.MAX_VALUE,-Number.MAX_VALUE])for(const weight of [NaN,Infinity,-Infinity,null,'1',{},-20,0,.5,20]){
 const p=sample({phase,centrumWalk:true},NaN,weight);assert(values(p).every(Number.isFinite));
 assert(values(p).every(value=>Math.abs(value)<=.05),'malformed inputs remain bounded');report.invalidInputCases++;
}
equalPose(sample({phase:.2,sourceWalk:true},Infinity),sample({phase:.2,sourceWalk:true},200,1));
equalPose(sample({phase:.2,sourceWalk:true},200,20),sample({phase:.2,sourceWalk:true},200,1));
const mutable={phase:.32,sourceWalk:true},first=sample(mutable,200,1),expected=copy(first);first.knees.near=999;
assert.deepEqual(copy(sample(mutable,200,1)),expected,'returned objects cannot contaminate later samples');
report.passed=true;report.units='height fractions for chestBob/chestSway/pelvisDrop/knees; radians for chestLean/pelvisRoll/shoulderTurn/headNod';
console.log(JSON.stringify(report));
