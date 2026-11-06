/* Camera geometry and the actual Square.render submitted transform. This is
   not artwork/likeness proof; ordinary-size browser captures cover that. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const forbid=()=>{throw Error('Camera must not own a loop, listener or persistent state');},window={};
vm.runInNewContext(fs.readFileSync('js/centrum-camera.js','utf8'),{window,requestAnimationFrame:forbid,setTimeout:forbid,addEventListener:forbid,localStorage:{setItem:forbid}});
const lens=window.BearlyCentrumCamera,near=(a,b,e=1e-8)=>assert(Math.abs(a-b)<e,`${a} differs from ${b}`);
assert.equal(lens.zoom,.6);assert.equal(lens.frameWidth,1160);assert.equal(lens.frameHeight,640);
const maps=[{width:1500,height:1000,floor:{bottom:930}},{width:1160,height:800,floor:{bottom:750}},{width:1160,height:760,floor:{bottom:710}}],boxes=[{width:1280,height:720},{width:844,height:390},{width:390,height:844},{width:1160,height:640}];
let geometryCases=0,cropCases=0,renderCases=0;
for(const scene of maps)for(const x of [0,60,scene.width*.5,scene.width-60,scene.width])for(const y of [0,scene.height*.5,scene.height]){
 const camera=lens.follow(scene,{x,y});near(camera.width,1160/.6);near(camera.height,640/.6);
 for(const [origin,extent,size,padding]of [[camera.x,scene.width,camera.width,0],[camera.y,scene.height,camera.height,camera.bottomPadding]]){
  if(extent+padding<=size)near(origin,(extent+padding-size)*.5);else assert(origin>=0&&origin<=extent-size+padding);
 }
 const p=lens.project(camera,x,y),back=lens.unproject(camera,p.x,p.y);near(back.x,x);near(back.y,y);geometryCases++;
 for(const box of boxes){const crop=lens.cover(camera,{x,y,jump:0},box);assert(crop.panX>=0&&crop.panX<=100&&crop.panY>=0&&crop.panY<=100);assert(crop.cropX>=0&&crop.cropY>=0);near(crop.visibleWidth*crop.scale,Math.min(box.width,1160*crop.scale));near(crop.visibleHeight*crop.scale,Math.min(box.height,640*crop.scale));cropCases++;}
}
// Every existing compact scene now fits in both axes and stays centered. Rooms have
// matching margins; there is no one-sided empty strip or expanded floor.
for(const scene of maps){const c=lens.follow(scene,{x:60,y:scene.height-70});near(lens.project(c,0,0).x,1160-lens.project(c,scene.width,0).x);near(lens.project(c,0,0).y,640-lens.project(c,0,scene.height+c.bottomPadding).y);assert(c.x<0&&c.y<0);}
// Normal phone-landscape positions can keep both source head and boots clear
// inside the cropped frame, including north/south floor boundaries.
for(const scene of maps)for(const y of [332,500,scene.height-82]){
 const camera=lens.follow(scene,{x:scene.width*.5,y}),p=lens.project(camera,scene.width*.5,y),crop=lens.cover(camera,{x:scene.width*.5,y},boxes[1]);
 assert(p.y-crop.cropY-212*.6>=28-1e-8,'original painted head fits above the phone crop');assert(p.y-crop.cropY<=crop.visibleHeight-76+1e-8,'grounded boots fit above controls');
}
function multiply(m,n){return[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];}
class Context{constructor(){this.m=[1,0,0,1,0,0];this.stack=[];}save(){this.stack.push([...this.m]);}restore(){this.m=this.stack.pop();}scale(x,y){this.m=multiply(this.m,[x,0,0,y,0,0]);}translate(x,y){this.m=multiply(this.m,[1,0,0,1,x,y]);}fillRect(){}beginPath(){}rect(){}clip(){}ellipse(){}fill(){}}
const source=fs.readFileSync('js/centrum-square.js','utf8'),start=source.indexOf('  function render(c,W,H){'),end=source.indexOf("  panel.querySelector('.square-exit')",start);assert(start>=0&&end>start);const renderSource=source.slice(start,end);
for(const scene of maps)for(const jump of [0,40]){
 const x=scene.width*.5,y=scene.height-100,camera=lens.follow(scene,{x,y}),seen={},record=key=>c=>{seen[key]=[...c.m];};
 const context={active:true,sceneId:'fixture',layout:()=>scene,snapshot:()=>({}),camera,x,y,jump,weight:1,groundMotion:{y:1},stride:4,face:1,view:'toward',loading:false,error:null,paused:false,menuHold:false,talking:0,drawOrder:[],shadow:null,
  world:()=>({drawBase:record('floor'),drawables:()=>[{id:'bench',footY:y-30,draw:record('bench')}]}),
  linked:()=>true,link:()=>({health:()=>73,bicycleNode:()=>({id:'parked-player-bicycle',footY:y+20,draw:record('bike')})}),
  hero:()=>({draw(c,px,py,h){seen.player={matrix:[...c.m],x:px,y:py,h};}}),window:{BearlyCentrumAtmosphere:{drawFloor:record('leaves')}}};
 vm.runInNewContext(renderSource,context);const c=new Context();context.render(c,1160,640);
 for(const part of ['floor','bench','bike','leaves']){near(seen[part][0],.6);near(seen[part][3],.6);assert.deepEqual(seen[part],seen.player.matrix,'all scene objects share the same lens');}
 assert.equal(seen.player.h,200,'the logical source rig is never shrunk');assert.equal(seen.player.y,y-jump);assert.equal(context.shadow.y,y,'jump does not move floor shadows');
 const m=seen.player.matrix,p=lens.project(camera,x,y-jump);near(m[0]*x+m[2]*(y-jump)+m[4],p.x);near(m[1]*x+m[3]*(y-jump)+m[5],p.y);assert.deepEqual(c.m,[1,0,0,1,0,0]);assert.equal(c.stack.length,0);renderCases++;
}
console.log(JSON.stringify({passed:true,geometryCases,cropCases,renderCases,zoom:lens.zoom,worldRigHeight:200,projectedRigHeight:200*lens.zoom,sceneGeometryUnchanged:true}));
