/* Optional Square source-pixel anatomy contracts. Canvas is mocked; this tests
   actual affine source quads/triangle orientation, not visual appearance. IK
   metrics are explicitly diagnostic, not painted calf joints. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function context(){const state={globalAlpha:1},stack=[];return new Proxy(state,{get(o,key){if(key==='save')return()=>stack.push({...o});if(key==='restore')return()=>Object.assign(o,stack.pop());return key in o?o[key]:()=>{};},set(o,k,v){o[k]=v;return true;}});}
const window={},sandbox={window,Image:class{naturalWidth=2400;naturalHeight=2400;},Path2D:class{moveTo(){}quadraticCurveTo(){}lineTo(){}closePath(){}},document:{createElement:()=>({width:0,height:0,dataset:{},getContext:context})}};
for(const name of ['locomotion','baby-passenger','centrum-depth-gait','centrum-walk-pose','hero-rig']){let code=fs.readFileSync('js/'+name+'.js','utf8');if(name==='hero-rig')code=code.replace('window.BearlyHeroRig={','window.__anatomyLab={surfacePose,lowerMesh,profiles};window.BearlyHeroRig={');vm.runInNewContext(code,sandbox);}
const rig=window.BearlyHeroRig,walk=window.BearlyCentrumDepthGait,gait=window.BearlyLocomotion;rig.preload();
const report={cases:0,bootRatios:{near:[],far:[]},maxHipShift:0,maxThighError:0,maxShinError:0,sourceTriangles:0,minAreaRatio:Infinity,moods:{}};
for(const [vx,vy]of [[130,0],[0,-52],[0,52],[92,-37],[92,37]])for(let phase=0;phase<32;phase++){
 const direction=walk.heading(vx,vy,1);rig.draw(context(),0,0,200,1,{centrumCache:true,state:{hp:100},weight:1,distance:gait.cycleLength(200)*phase/32,groundMotion:direction});
 const a=rig.audit();assert.equal(a.lowerPose,'idle');assert.equal(a.anatomy.source,'fixed-native-idle');assert.equal(a.anatomy.ikTargetsDiagnosticOnly,true);
 const lab=window.__anatomyLab,profile=lab.profiles.front,pose=lab.surfacePose(profile,200,a.gait,1),mesh=lab.lowerMesh(profile,pose,a.gait,1),area=p=>(p[1].x-p[0].x)*(p[2].y-p[0].y)-(p[1].y-p[0].y)*(p[2].x-p[0].x);
 for(const triangle of mesh.triangles){const sourceArea=area(triangle.map(v=>v.source)),destinationArea=area(triangle.map(v=>v.destination));assert(sourceArea*destinationArea>0,'a painted source triangle cannot reverse/fold');report.minAreaRatio=Math.min(report.minAreaRatio,destinationArea/sourceArea);report.sourceTriangles++;}
 for(const side of ['near','far']){const joint=a.anatomy[side],leg=a.landmarks[side],scale=200/280;
  const thigh=Math.hypot(joint.knee.x-joint.hip.x,joint.knee.y-joint.hip.y),shin=Math.hypot(joint.cuff.x-joint.knee.x,joint.cuff.y-joint.knee.y);
  report.maxThighError=Math.max(report.maxThighError,Math.abs(thigh-joint.thigh)*scale);report.maxShinError=Math.max(report.maxShinError,Math.abs(shin-joint.shin)*scale);
  report.maxHipShift=Math.max(report.maxHipShift,joint.hipShift*scale);report.bootRatios[side].push(leg.bootWidth/(joint.bootWidth*scale));
  assert(a.babyFace.continuousUpperBody&&a.babyFace.originalCollar);assert.equal(leg.rigidShoe,true);
 }
 report.moods[vy<0?'up':vy>0?'down':'horizontal']=a.babyFace.mood;report.cases++;
}
for(const side of ['near','far'])report.bootRatios[side]={min:Math.min(...report.bootRatios[side]),max:Math.max(...report.bootRatios[side])};
console.log(JSON.stringify(report));
for(const bounds of Object.values(report.bootRatios))assert(bounds.min>1-1e-6&&bounds.max<1+1e-6,'actual source mesh keeps the native rigid boot span');
assert(report.maxHipShift<20,'occluded reach correction stays inside the source shorts without changing idle-derived limb lengths');
assert(report.maxThighError<1e-6&&report.maxShinError<1e-6,'two-bone limb lengths stay fixed');
assert.equal(report.moods.up,'leanForward');assert.equal(report.moods.down,'leanBack');
