/* Directional-view math/lifecycle contracts. Canvas and production passenger
   calls are mocked; this does NOT certify source pixels, likeness or animation.
   Actual normal-size browser evidence is required separately. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const SOURCE_CHILD='assets/art/front-carrier-v7.png';
const SOURCE_CHILD_SHA='3ebe5734b486736887c674f4676eb69f24aad260a94c26457b57688676c5ebd6';
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(SOURCE_CHILD)).digest('hex'),SOURCE_CHILD_SHA,'original source child lower artwork must remain untouched');
const near=(a,b,e=1e-8)=>assert(Math.abs(a-b)<=e,`${a} differs from ${b}`);
const value=v=>JSON.parse(JSON.stringify(v));
function multiply(m,n){return[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];}
function mapped(m,p){return{x:m[0]*p[0]+m[2]*p[1]+m[4],y:m[1]*p[0]+m[3]*p[1]+m[5]};}
const canvases=[],images=[],nativeCalls=[];let nativeReady=true,heroReady=true;
class Context{
 constructor(canvas){this.canvas=canvas;this.matrix=[1,0,0,1,0,0];this.stack=[];this.draws=[];this.paths=[];this.clips=[];this.globalAlpha=1;}
 save(){this.stack.push({matrix:[...this.matrix],alpha:this.globalAlpha});}
 restore(){const s=this.stack.pop();assert(s,'balanced canvas restore');this.matrix=s.matrix;this.globalAlpha=s.alpha;}
 transform(...n){this.matrix=multiply(this.matrix,n);}
 setTransform(...n){this.matrix=[...n];}
 translate(x,y){this.transform(1,0,0,1,x,y);}
 scale(x,y){this.transform(x,0,0,y,0,0);}
 rotate(a){this.transform(Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0);}
 beginPath(){this.paths=[];}
 moveTo(x,y){this.paths.push([[x,y]]);}
 lineTo(x,y){this.paths.at(-1).push([x,y]);}
 closePath(){}
 clip(){this.clips.push(value(this.paths));}
 drawImage(image,...args){this.draws.push({image,args,matrix:[...this.matrix],alpha:this.globalAlpha});}
 getImageData(x,y,w,h){return{data:new Uint8ClampedArray(w*h*4),width:w,height:h};}
 putImageData(){}
 clearRect(){}
}
function canvas(){const c={id:canvases.length+1,width:0,height:0};c.context=new Context(c);c.getContext=()=>c.context;canvases.push(c);return c;}
class MockImage{
 constructor(){this.naturalWidth=1536;this.naturalHeight=1024;images.push(this);}
 set src(v){this.url=v;queueMicrotask(()=>this.onload?.());}
 get src(){return this.url;}
 decode(){return Promise.resolve();}
}
const forbidden=()=>{throw Error('Directional art must not create an animation timer or input listener');};
const window={requestAnimationFrame:forbidden,setTimeout:forbidden,setInterval:forbidden,addEventListener:forbidden,
 BearlyBabyPassenger:{ready:()=>nativeReady},
 BearlyHeroRig:{ready:()=>heroReady,drawPassengerLayout(c,image,layout,scale,options){nativeCalls.push({image,layout:value(layout),scale,options:value(options),matrix:[...c.matrix]});return{uniformScale:85/61*scale,continuousUpperBody:true,originalCollar:true,headOnly:false,source:'assets/baby_pose_idle.webp',pose:layout.name};}}};
const sandbox={window,Image:MockImage,Uint8ClampedArray,document:{createElement:n=>{assert.equal(n,'canvas');return canvas();}},requestAnimationFrame:forbidden,setInterval:forbidden,setTimeout:forbidden,addEventListener:forbidden};
for(const name of ['locomotion','centrum-depth-gait','centrum-directional-rig'])vm.runInNewContext(fs.readFileSync('js/'+name+'.js','utf8'),sandbox);
const api=window.BearlyCentrumDirectionalRig,gait=window.BearlyLocomotion,depth=window.BearlyCentrumDepthGait;
const report={scope:'Mocked Canvas transforms, lifecycle and native passenger delegation; no pixel or visual proof',headingCases:0,drawCases:0,guardCases:0,actualSoleTransformCases:0,contactCases:0,sourceChildSha256:SOURCE_CHILD_SHA};
// Run the real complete Square.update body, with only its scene/DOM services
// replaced by inert adapters. This catches the damped-velocity transition that
// a pure heading helper test cannot exercise. No production test hook is added.
function squareBrakingRegression(updateSource){
 let diagonalCases=0,brakingSamples=0,blockedSlideCases=0,autoReturnCases=0;
 function scene(){
  const held=new Set(),motion={blockDepth:false},control={textContent:''};
  const context={active:true,paused:false,menuHold:false,loading:false,error:null,mapOpen:false,talking:0,messageTime:100,messageEl:{hidden:false},
   x:600,y:700,vx:0,vy:0,face:1,jump:0,jumpVelocity:0,stride:0,weight:0,groundMotion:null,view:'side',returning:null,sceneId:'metro-square',hits:[],exitGuard:0,saveTimer:0,
   clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),has:key=>held.has(key),clear(){held.clear();context.vx=context.vy=0;},sync(){},snapshot:()=>({}),savePosition(){},follow(){},candidate:()=>null,say(){},attemptRemount:()=>false,controls:{querySelector:()=>control},
   world:()=>({move(x,y,dx,dy){return{x:x+dx,y:y+(motion.blockDepth?0:dy),hit:motion.blockDepth?['depth-wall']:[]};}}),
   window:{BearlyCentrumDepthGait:depth,BearlyCentrumDirectionalRig:api,BearlyCentrumStory:{update(){},blocking:()=>false},BearlyCentrumAtmosphere:{update(){}}}};
  vm.runInNewContext(updateSource,context);return{context,held,motion,step:(frames=1)=>{for(let i=0;i<frames;i++)context.update(.016,false);}};
 }
 for(const [horizontal,vertical,expected]of [['right','up','away'],['left','up','away'],['right','down','toward'],['left','down','toward']]){
  const s=scene();s.held.add(horizontal);s.held.add(vertical);s.step(32);assert.equal(s.context.view,expected,'active diagonal selects the actual authored view');assert(Math.abs(s.context.vx)>90&&Math.abs(s.context.vy)>36,'actual Square.update reaches unequal horizontal/depth walking velocities');
  s.held.clear();let horizontalTail=false;
  for(let i=0;i<40;i++){s.step();if(Math.abs(s.context.vx)>1&&Math.abs(s.context.vy)<1){horizontalTail=true;assert(Math.abs(s.context.groundMotion?.y||0)<1e-10,'ground motion still reports real horizontal braking');}assert.equal(s.context.view,expected,'released diagonal must keep its authored view while the remaining horizontal velocity brakes');brakingSamples++;}
  assert(horizontalTail,'the real asymmetric braking tail was exercised');assert.equal(s.context.vx,0);assert.equal(s.context.vy,0);diagonalCases++;
  // The fix must not freeze a view during genuine active sliding along a wall.
  const wall=scene();wall.held.add(horizontal);wall.held.add(vertical);wall.step(32);wall.motion.blockDepth=true;wall.step(4);assert.equal(wall.context.view,'side','active blocked-depth diagonal updates to actual horizontal wall sliding');blockedSlideCases++;
 }
 for(const [gx,gy,expected]of [[800,500,'away'],[400,500,'away'],[800,900,'toward'],[400,900,'toward']]){
  const s=scene();s.context.returning={sceneId:'metro-square',path:[{x:gx,y:gy}]};s.step(24);assert.equal(s.held.size,0);assert.equal(s.context.view,expected,'auto-return path travel remains an actively driven movement');autoReturnCases++;
 }
 return{diagonalCases,brakingSamples,blockedSlideCases,autoReturnCases};
}
const squareSource=fs.readFileSync('js/centrum-square.js','utf8'),updateStart=squareSource.indexOf('  function update(dt,debugOpen=false){'),updateEnd=squareSource.indexOf('  function render(',updateStart);assert(updateStart>=0&&updateEnd>updateStart);
const realSquareUpdate=squareSource.slice(updateStart,updateEnd);
report.squareUpdate=squareBrakingRegression(realSquareUpdate);
// Mutation control: removing the intent gate must reproduce the reported bug.
const guarded=/if\(length>1e-8\)\s*view=/;assert(guarded.test(realSquareUpdate),'actual Square view update is guarded by current driven movement');
assert.throws(()=>squareBrakingRegression(realSquareUpdate.replace(guarded,'view=')),/released diagonal must keep/,'unguarded real Square.update must fail this braking regression');
report.squareUpdate.unguardedMutationRejected=true;

for(const [motion,previous,expected]of [[null,'side','side'],[null,'away','away'],[{y:NaN},'toward','toward'],[{y:Infinity},'away','away'],[{y:-1,metricSpeed:0},'toward','toward'],[{y:-.6,metricSpeed:5},'side','away'],[{y:.6},'side','toward'],[{y:.5},'side','side'],[{y:-.5},'away','away'],[{y:.4},'away','toward'],[{y:.3},'away','side'],[{y:0},'toward','side']]){assert.equal(api.viewForMotion(motion,previous),expected);report.headingCases++;}
const definition=api.definition();assert(definition.views.toward&&definition.views.away);assert(definition.image.startsWith('assets/centrum/actors/'),'new parent art is a local project asset, not a donor or website dependency');definition.image='mutated-outside.png';assert.notEqual(api.definition().image,definition.image,'definition snapshots cannot mutate live source URL');
const first=canvas().context;assert.equal(api.draw(first,100,200,200,1,{centrumView:'toward',state:{hp:100}}),false);assert.equal(nativeCalls.length,0);assert.equal(first.draws.length,0);
(async()=>{
 const preparation=api.preload(),repeatPreparation=api.preload();assert.equal(await preparation,true);assert.equal(await repeatPreparation,true);assert(api.ready());
 const preparedCount=canvases.length,stats=api.stats(),raw=api.definition();assert.equal(stats.preparations,1);assert.deepEqual(value(stats.views),['toward','away']);assert(stats.partBytes>0&&stats.partBytes<4*1024*1024,'two prepared view pieces stay compact');
 assert.equal(images.filter(im=>im.src===SOURCE_CHILD).length,1,'one original lower-child source is shared by both angles');
 const childCanvas=canvases.find(c=>c.context.draws.some(d=>d.image.src===SOURCE_CHILD));assert(childCanvas);const lowerPiece=canvases.find(c=>c.context.draws.some(d=>d.image===childCanvas));assert(lowerPiece);const sourceMasks=JSON.parse(fs.readFileSync('verification/stage13/baby-legs/source-masks.json','utf8'));assert(childCanvas.context.clips.some(paths=>JSON.stringify(paths)===JSON.stringify([sourceMasks.paths.near,sourceMasks.paths.far])),'the measured original near/far leg/shoe paths are clipped as one union before one source draw');assert.equal(childCanvas.context.draws.filter(d=>d.image.src===SOURCE_CHILD).length,1,'no duplicate original shoe compositing');
 for(const state of [{hp:0},{hp:100,baby:true},{hp:100,hurt:1},{hp:100,held:true},{hp:100,attack:true}]){const c=canvas().context,n=nativeCalls.length;assert.equal(api.draw(c,0,0,200,1,{centrumView:'toward',state}),false);assert.equal(nativeCalls.length,n);assert.equal(c.draws.length,0);report.guardCases++;}
 for(const [flag,set]of [['baby',v=>nativeReady=v],['hero',v=>heroReady=v]]){set(false);assert.equal(api.draw(canvas().context,0,0,200,1,{centrumView:'toward',state:{hp:100}}),false,flag);set(true);report.guardCases++;}
 assert.equal(api.draw(canvas().context,0,0,200,1,{centrumView:'side',state:{hp:100}}),false,'horizontal view remains delegated to the unchanged source renderer');
 const beforeDrawCanvases=canvases.length;
 for(const view of ['toward','away'])for(const h of [145,200,280])for(const face of [-1,1])for(const phase of [0,.125,.25,.375,.5,.625,.75,.875]){
  const c=new Context({id:'draw-only'}),motion=depth.heading(0,view==='away'?-52:52,face),options={centrumView:view,state:{hp:100,baby:false},distance:gait.cycleLength(h)*phase,weight:1,groundMotion:motion,jump:17};
  const a=api.draw(c,305,418,h,face,options);assert(a&&a.authoredView&&a.body.authoredViewingAngle);assert.equal(a.view,view);assert.equal(a.carrier,'front');assert.equal(a.height,h);near(a.babyFace.uniformScale,85/61*h/488);
  const delegated=nativeCalls.at(-1);near(delegated.scale,h/488);assert.equal(delegated.layout.head.box[3],85);assert.equal(delegated.layout.name,'centrum-'+view);assert.deepEqual(value(delegated.options.groundMotion),value(motion),'the original production baby mood receives the real movement context');
  assert.equal(c.stack.length,0,'draw restores all canvas state');assert.deepEqual(c.matrix,[1,0,0,1,0,0]);assert.equal(c.draws.length+2,a.directional.drawCalls,'mock passenger delegates the two native image draws without rasterising them');assert(c.draws.length<=14,'piece drawing cannot grow with frame count');assert.equal(a.directional.groundAnchor.y,435,'jump is removed from floor anchor');
  // Inspect the submitted affine boot draw transforms. Map the measured source
  // sole through the actual Canvas matrix, rather than trusting the audit alone.
  const source=raw.views[view],normal=512/source.height;
  for(const [index,side]of [[2,'far'],[5,'near']]){const sole=source.legs[side].sole,p=[(sole[0]-source.rect[0])*normal,(sole[1]-source.rect[1])*normal],paint=mapped(c.draws[index].matrix,p),audit=a.landmarks[side].sole;
   near(paint.x,305+face*audit.x);near(paint.y,418+audit.y);report.actualSoleTransformCases++;
  }
  assert.notEqual(c.draws[2].image,c.draws[5].image,'near and far shoes are distinct prepared source pieces');
  // Source child lower legs stay in one rigid, uniformly scaled parent transform.
  const lowerCalls=c.draws.filter(d=>d.image===lowerPiece);assert.equal(lowerCalls.length,1);const lower=lowerCalls[0].matrix;near(Math.hypot(lower[0],lower[1]),h/488);near(Math.hypot(lower[2],lower[3]),h/488);near(lower[0]*lower[2]+lower[1]*lower[3],0);near(Math.abs(lower[0]*lower[3]-lower[1]*lower[2]),(h/488)**2);
  report.drawCases++;
 }
 assert.equal(canvases.length,beforeDrawCanvases,'walking does not allocate part canvases per frame');assert.equal(api.stats().partBytes,stats.partBytes);assert.equal(api.stats().preparations,1);assert.equal(api.stats().hasOwnAnimationLoop,false);assert.equal(api.stats().hasOwnInputListeners,false);
 const contacts={};for(const phase of [.25,.75]){const c=new Context({id:'contact'}),a=api.draw(c,0,0,200,1,{centrumView:'toward',state:{hp:100},distance:gait.cycleLength(200)*phase,weight:1,groundMotion:depth.heading(0,52,1)});contacts[phase]=a;}
 for(const side of ['near','far']){const a=contacts[.25].landmarks[side],b=contacts[.75].landmarks[side];near(a.contact.x,b.contact.x);near(a.contact.y,b.contact.y);assert(Math.abs(a.sole.y-b.sole.y)>8,'the swing foot lifts while the ground contact remains on the floor');report.contactCases++;}
 const originalPose=gait.pose;gait.pose=(...args)=>({...originalPose(...args),bob:90,roll:.3,sway:80});const altered=api.draw(new Context({id:'bob'}),0,0,200,1,{centrumView:'toward',state:{hp:100},distance:gait.cycleLength(200)*.25,weight:1,groundMotion:depth.heading(0,52,1)});gait.pose=originalPose;
 for(const side of ['near','far']){near(altered.landmarks[side].contact.x,contacts[.25].landmarks[side].contact.x);near(altered.landmarks[side].contact.y,contacts[.25].landmarks[side].contact.y);report.contactCases++;}
 assert.throws(()=>api.configure(raw),/already preparing/,'live configuration cannot leak another prepared source set');
 // A missing optional parent sheet must fail once and leave source rendering
 // eligible; it cannot leak repeated loads or produce a made-up child/pose.
 let parentMissing=true;class MissingSheet extends MockImage{set src(v){this.url=v;queueMicrotask(()=>v!==SOURCE_CHILD&&parentMissing?this.onerror?.():this.onload?.());}get src(){return this.url;}}
 const fallbackWindow={BearlyBabyPassenger:window.BearlyBabyPassenger,BearlyHeroRig:window.BearlyHeroRig,BearlyLocomotion:gait,BearlyCentrumDepthGait:depth};
 const fallbackSandbox={...sandbox,window:fallbackWindow,Image:MissingSheet};vm.runInNewContext(fs.readFileSync('js/centrum-directional-rig.js','utf8'),fallbackSandbox);
 const fallback=fallbackWindow.BearlyCentrumDirectionalRig,loadsBefore=images.length;assert.equal(await fallback.preload(),false);assert.equal(fallback.ready(),false);assert.match(fallback.stats().failure,/Unable to load directional art/);assert.equal(images.length-loadsBefore,2);for(let i=0;i<8;i++)assert.equal(fallback.draw(new Context({id:'fallback'}),0,0,200,1,{centrumView:'toward',state:{hp:100}}),false,'missing optional art returns control to original renderer');assert.equal(images.length-loadsBefore,2,'draw never retries a failed optional asset or allocates replacement art');assert.equal(fallback.stats().partBytes,0);parentMissing=false;const retry=fallback.preload(),repeatedRetry=fallback.preload();assert.equal(await retry,true,'an explicit scene-entry retry can recover after a transient asset error');assert.equal(await repeatedRetry,true);assert(fallback.ready());assert.equal(fallback.stats().failure,null);assert.equal(fallback.stats().preparations,1);assert.deepEqual(value(fallback.stats().views),['toward','away']);assert.equal(images.length-loadsBefore,4,'one explicit retry shares its two requests');const recoveredBytes=fallback.stats().partBytes;assert(recoveredBytes>0&&recoveredBytes<4*1024*1024);assert.equal(await fallback.preload(),true);assert.equal(images.length-loadsBefore,4,'a recovered cache is reused');
 report.failedAssetFallbackCases=4;report.explicitAssetRecoveryCases=3;report.preparedPartBytes=stats.partBytes;report.preparedViews=2;report.passed=true;console.log(JSON.stringify(report));
})().catch(error=>{console.error(error);process.exitCode=1;});
