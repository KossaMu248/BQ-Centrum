/* Actual submitted source-material geometry for walking limb volume.
   Mocked rasterization proves transforms/attachment, not pixels or likeness. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const current=fs.readFileSync('js/hero-rig.js','utf8');
const copy=x=>JSON.parse(JSON.stringify(x));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const near=(a,b,e=1e-6,message='geometry must agree')=>assert(Math.abs(a-b)<=e,`${message}: ${a} != ${b}`);
function rig(code=current,mutant=null){
 const noop=()=>{},window={},ctx=new Proxy({},{get(o,k){return k==='getImageData'?()=>({data:new Uint8ClampedArray(4)}):k in o?o[k]:noop;},set(o,k,v){o[k]=v;return true;}});
 const sandbox={window,Image:class{naturalWidth=2400;naturalHeight=2400;},Path2D:class{moveTo(){}quadraticCurveTo(){}lineTo(){}closePath(){}},document:{createElement:()=>({width:0,height:0,dataset:{},getContext:()=>ctx})}};
 for(const name of ['locomotion','baby-passenger','centrum-depth-gait','centrum-walk-pose'])vm.runInNewContext(fs.readFileSync('js/'+name+'.js','utf8'),sandbox);
 const marker='  window.BearlyHeroRig={';assert.equal(code.split(marker).length,2,'find original IIFE export, without evaluating a donor');
 let injected='  window.__volume={profiles,surfacePose,lowerMesh,prepareLower,projectGroundGait};\n';
 if(mutant)injected+=`  const originalVolumeMesh=window.__volume.lowerMesh;window.__volume.lowerMesh=function(...args){const mesh=originalVolumeMesh(...args);if(args[3]>.9&&args[2].near.x<0){const seen=new Set();for(const t of mesh.triangles){if(t.segment!=='${mutant.segment}')continue;for(const v of t){if(seen.has(v.destination))continue;seen.add(v.destination);${mutant.transform}}}}return mesh;};\n`;
 vm.runInNewContext(code.replace(marker,injected+marker),sandbox);window.BearlyHeroRig.preload();return{...window.__volume,window};
}
function texture(source,p){return{x:(p[0]-source.key.rect[0])/source.key.rect[2]*source.tile.width,y:(p[1]-source.key.rect[1])/source.key.rect[3]*source.tile.height};}
function sample(triangles,p,message){
 for(const t of triangles){const[a,b,c]=t.map(v=>v.source),D=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);if(Math.abs(D)<1e-10)continue;
  const u=((b.y-c.y)*(p.x-c.x)+(c.x-b.x)*(p.y-c.y))/D,v=((c.y-a.y)*(p.x-c.x)+(a.x-c.x)*(p.y-c.y))/D,w=1-u-v;
  if(Math.min(u,v,w)>=-1e-7)return{x:u*t[0].destination.x+v*t[1].destination.x+w*t[2].destination.x,y:u*t[0].destination.y+v*t[1].destination.y+w*t[2].destination.y};
 }assert.fail(message||'material point must be present in actual submitted triangles');
}
function submit(api,name,h,phase,weight,motion){
 const profile=api.profiles[name],native=api.window.BearlyLocomotion,gait=api.projectGroundGait(native.pose(native.cycleLength(h)*phase,h,weight),motion,weight),pose=api.surfacePose(profile,h,gait,weight),mesh=api.lowerMesh(profile,pose,gait,weight),source=api.prepareLower(4);
 return{profile,gait,pose,mesh,source,weight};
}
const patches=[
 {side:'far',segment:'thigh',raw:[450,430]},{side:'far',segment:'thigh',raw:[450,500]},
 {side:'near',segment:'thigh',raw:[835,430]},{side:'near',segment:'thigh',raw:[835,500]},
 {side:'far',segment:'shin',raw:[430,710]},{side:'near',segment:'shin',raw:[790,750]}
];
function materialTriangles(v,side,segment,tagged){
 if(tagged){const selected=v.mesh.triangles.filter(t=>t.segment===segment&&t.limb===side);if(v.weight>0)assert(selected.length,'nonzero walking must submit tagged '+side+' '+segment+' geometry');if(selected.length)return selected;}
 return v.mesh.triangles.filter(t=>!t.image||t.image===v.source.tile);
}
function patch(v,definition,tagged){
 const triangles=materialTriangles(v,definition.side,definition.segment,tagged),[x,y]=definition.raw;
 const p=(dx,dy)=>sample(triangles,texture(v.source,[x+dx,y+dy]),`${definition.side} ${definition.segment} shaft must submit its original material patch (${x+dx},${y+dy})`);
 const a=p(-1,0),b=p(1,0),c=p(0,-1),d=p(0,1),J=[(b.x-a.x)/2,(b.y-a.y)/2,(d.x-c.x)/2,(d.y-c.y)/2],L=Math.hypot(J[2],J[3]);
 assert(L>1e-9,'shaft centreline tangent must not collapse');
 return{J,normalWidth:Math.abs(J[0]*J[3]-J[1]*J[2])/L,sourcePoint:p(0,0)};
}
function relative(a,b){const D=b[0]*b[3]-b[1]*b[2];assert(Math.abs(D)>1e-12,'the rest material must have nonzero area');const i=[b[3]/D,-b[1]/D,-b[2]/D,b[0]/D];return[a[0]*i[0]+a[2]*i[1],a[1]*i[0]+a[3]*i[1],a[0]*i[2]+a[2]*i[3],a[1]*i[2]+a[3]*i[3]];}
function checkRotation(m,message){
 const x=m[0]*m[0]+m[1]*m[1],y=m[2]*m[2]+m[3]*m[3],dot=m[0]*m[2]+m[1]*m[3],D=m[0]*m[3]-m[1]*m[2];
 near(x,1,2e-6,message+' lateral material scale');near(y,1,2e-6,message+' longitudinal material scale');near(dot,0,2e-6,message+' material shear');near(D,1,2e-6,message+' signed material area');
 const disc=Math.sqrt(Math.max(0,(x-y)*(x-y)+4*dot*dot));return{minSingular:Math.sqrt((x+y-disc)/2),maxSingular:Math.sqrt((x+y+disc)/2),area:D};
}
function actualJoints(api,v,side,tagged){
 const index=side==='near'?1:0,key=v.source.key,thigh=materialTriangles(v,side,'thigh',tagged),shin=materialTriangles(v,side,'shin',tagged);
 const H=sample(thigh,texture(v.source,key.hips[index]),'the painted thigh hip must be submitted'),K=sample(thigh,texture(v.source,key.legs[index].knee),'the painted thigh knee must be submitted'),S=sample(shin,texture(v.source,key.legs[index].knee),'the painted shin knee must be submitted');
 const boot=api.prepareLower(0),j=side==='near'?0:1,triangles=tagged&&v.mesh.triangles.some(t=>t.segment==='boot'&&t.limb===side)?v.mesh.triangles.filter(t=>t.segment==='boot'&&t.limb===side):v.mesh.triangles.filter(t=>t.image===boot.tile),C=sample(triangles,texture(boot,boot.key.legs[j].cuff),'the rigid original boot cuff must be submitted');
 return{hip:H,knee:K,shinKnee:S,cuff:C};
}
function normalizedPoints(record){const p=record||{};return{hip:p.hip||p.H,knee:p.knee||p.K,cuff:p.cuff||p.C};}
function volumeContract(api,{dense=true,tagged=true,checkJoints=true}={}){
 const report={cases:0,shaftPatches:0,normalWidthMin:Infinity,normalWidthMax:-Infinity,minimumRelativeSingular:Infinity,maximumRelativeSingular:0,maximumAreaResidual:0,boneCases:0,maximumBoneLengthResidual:0,maximumKneeSeam:0,metadataCrossChecks:0};
 const phases=dense?Array.from({length:24},(_,i)=>i/24):[0,.125,.375,.5,.625,.875],heights=dense?[145,200,280]:[200],weights=dense?[0,.35,1]:[1],motions=dense?[{x:1,y:0,centrumWalk:true},{sourceWalk:true},{x:.6,y:.8,centrumWalk:true},{x:0,y:-1,centrumWalk:true}]:[{x:1,y:0,centrumWalk:true},{sourceWalk:true}];
 for(const name of ['front','back'])for(const h of heights)for(const motion of motions){
  const rest=submit(api,name,h,0,0,motion),references=patches.map(p=>patch(rest,p,tagged)),restJoints=checkJoints?Object.fromEntries(['near','far'].map(side=>[side,actualJoints(api,rest,side,tagged)])):null;
  for(const weight of weights)for(const phase of phases){const v=submit(api,name,h,phase,weight,motion);
   for(const[i,definition]of patches.entries()){const measured=patch(v,definition,tagged),base=references[i],ratio=measured.normalWidth/base.normalWidth,label=`${name} h${h} ${definition.side}/${definition.segment} phase${phase} weight${weight}`;
    const r=checkRotation(relative(measured.J,base.J),label);near(ratio,1,2e-6,label+' normal shaft width');report.normalWidthMin=Math.min(report.normalWidthMin,ratio);report.normalWidthMax=Math.max(report.normalWidthMax,ratio);report.minimumRelativeSingular=Math.min(report.minimumRelativeSingular,r.minSingular);report.maximumRelativeSingular=Math.max(report.maximumRelativeSingular,r.maxSingular);report.maximumAreaResidual=Math.max(report.maximumAreaResidual,Math.abs(r.area-1));report.shaftPatches++;
   }
   if(checkJoints)for(const side of ['near','far']){const actual=actualJoints(api,v,side,tagged),original=restJoints[side];
    const thigh=distance(actual.hip,actual.knee),shin=distance(actual.shinKnee,actual.cuff),restThigh=distance(original.hip,original.knee),restShin=distance(original.shinKnee,original.cuff),gap=distance(actual.knee,actual.shinKnee);
    near(thigh,restThigh,1e-6,'painted thigh length stays fixed');near(shin,restShin,1e-6,'painted shin length stays fixed');near(gap,0,1e-6,'submitted thigh/shin meet at the same knee');report.maximumBoneLengthResidual=Math.max(report.maximumBoneLengthResidual,Math.abs(thigh-restThigh),Math.abs(shin-restShin));report.maximumKneeSeam=Math.max(report.maximumKneeSeam,gap);report.boneCases++;
    const record=v.mesh.rigidSegments?.[side];if(weight===0&&!record)continue;assert(record,'actual rigid leg metadata must be present after geometry checks');const target=normalizedPoints(record.target||record),source=normalizedPoints(record.rest);
    for(const point of ['hip','knee','cuff']){assert(target[point]&&source[point],'metadata names actual rest/target joints');near(distance(target[point],actual[point]),0,1e-6,'metadata matches submitted '+point);near(distance(source[point],original[point]),0,1e-6,'metadata rest matches submitted '+point);report.metadataCrossChecks+=2;}
   }
   report.cases++;
  }
 }
 return report;
}
const api=rig();
const report={scope:'Actual submitted material geometry with mocked rasterization; no pixel/likeness/visual-performance claim',volume:volumeContract(api),rejectedMutations:[]};
for(const mutant of [
 {name:'shin lateral collapse',segment:'shin',transform:'v.destination.x*=.5;'},
 {name:'thigh lateral collapse',segment:'thigh',transform:'v.destination.x*=.5;'},
 {name:'area-preserving shin shear',segment:'shin',transform:'v.destination.x+=.45*v.destination.y;'},
 {name:'shin longitudinal collapse',segment:'shin',transform:'v.destination.y*=.7;'}
]){assert.throws(()=>volumeContract(rig(current,mutant),{dense:false,checkJoints:false}),assert.AssertionError,mutant.name+' must fail actual material geometry');report.rejectedMutations.push(mutant.name);}
// Reconstruct this target's own published baseline without Git or donor access.
const inversePath='references/source/stage25-source-integration.json';assert(fs.existsSync(inversePath),'reviewed Stage25 inverse is required for the real old-defect regression');const inverse=JSON.parse(fs.readFileSync(inversePath,'utf8')).files['js/hero-rig.js'];let old=current;
assert.equal(crypto.createHash('sha256').update(old).digest('hex'),inverse.currentSha256);for(const edit of [...inverse.changes].reverse()){assert(old.includes(edit.current));old=old.replace(edit.current,edit.previous);}assert.equal(crypto.createHash('sha256').update(old).digest('hex'),inverse.previousSha256);
assert.throws(()=>volumeContract(rig(old),{dense:false,tagged:false,checkJoints:false}),assert.AssertionError,'the actual published thinning renderer must fail volume preservation');report.previousPublishedDefectRejected=true;
report.passed=true;console.log(JSON.stringify(report));
