/* Execute the real source render/overlay projection with inert drawing services.
   This checks presentation only, not pixels, NPC anatomy or cycling physics. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const window={};vm.runInNewContext(fs.readFileSync('js/centrum-camera.js','utf8'),{window});const lens=window.BearlyCentrumCamera;
const close=(a,b,e=1e-8)=>assert(Math.abs(a-b)<e,`${a} differs from ${b}`);
function mul(a,b){return[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];}
class Context{constructor(){this.m=[1,0,0,1,0,0];this.stack=[];}setTransform(...m){this.m=m;}save(){this.stack.push([...this.m]);}restore(){this.m=this.stack.pop();}translate(x,y){this.m=mul(this.m,[1,0,0,1,x,y]);}scale(x,y){this.m=mul(this.m,[x,0,0,y,0,0]);}clearRect(){}fillRect(){}createLinearGradient(){return{addColorStop(){}};}fillText(){}}
const game=fs.readFileSync('js/game.js','utf8'),begin=game.indexOf('  function render(){'),end=game.indexOf('  function debugDrawHitboxes()',begin);assert(begin>=0&&end>begin);const actualRender=game.slice(begin,end);
let projections=0,renderCases=0,overlays=0;
for(const [W,H]of [[1160,640],[1280,720]])for(const [cx,cy]of [[0,0],[4100,205],[12000,850]])for(const [x,y]of [[450,395],[4750,600]]){
 const p=lens.projectRoute({width:W,height:H,cameraX:cx,cameraY:cy},x,y),frame=lens.routeFrame(W,H);
 close(p.x,frame.focusX+frame.zoom*(x-cx-frame.focusX));close(p.y,frame.focusY+frame.shiftY+frame.zoom*(y-cy-frame.focusY));
 const road=lens.projectRoute({width:W,height:H,cameraX:cx,cameraY:cy},x,cy+395);close(road.y,H*.22+1.35*(395-H*.22));projections++;
}
for(const intro of [false,true])for(const backing of [.675,.75,1])for(const shake of [0,9]){
 const ctx=new Context(),seen=[],record=()=>seen.push([...ctx.m]),noop=()=>{},W=1160,H=640,cameraX=4100,cameraY=205;
 const services={BearlyCentrumCamera:lens,BearlyCentrumSquare:{render:()=>false},BearlyVisits:{render:()=>false,hideRoadBaby:()=>false,overlay:noop},BearlyWorld:{sky:noop,foreground:record},BearlyCentrumLink:{renderRouteMarker:record}};
 const context={ctx,W,H,cameraX,cameraY,cameraShake:shake,rendering:{scale:backing},window:services,$:()=>({hidden:!intro}),Math:{...Math,random:()=>.5},illustratedState:()=>({}),groundAt:()=>600,smooth:()=>0,bike:{x:4500},state:'playing',debugSettings:{particles:false,foreground:true,hitboxes:false},demo:{active:false},groundDraw:record,drawGroundedBikeShadow:record,autumnBikePresentation:record,drawVictoryCelebration:record,drawThrownItems:record,drawProjectileImpactFX:record,drawBearThrown:record,drawSeatThrown:record,drawBaby:record,drawFragments:record};
 vm.runInNewContext(actualRender,context);context.render();assert(seen.length>=10);
 for(const m of seen){close(m[0]/backing,intro?1.35:.8);close(m[3]/backing,intro?1.35:.8);const p=lens.projectRoute({width:W,height:H,cameraX,cameraY,intro},4500,600);close((m[0]*4500+m[2]*600+m[4])/backing,p.x);close((m[1]*4500+m[3]*600+m[5])/backing,p.y);}
 assert.equal(ctx.stack.length,0);renderCases++;
}
const visits=fs.readFileSync('js/illustrated-visits.js','utf8'),a=visits.indexOf('  function overlay(c,W,H,road=null){'),b=visits.indexOf('  function drawRoom(c)',a);assert(a>=0&&b>a);
for(const [cx,cy]of [[0,0],[4100,205],[12000,850]]){
 let projection;const context={land:()=>true,transition:null,mode:'street',x:4500,depth:0,combatState:{},reduced:()=>false,matchMedia:()=>({matches:false}),viewport:{width:1160,height:640},host:{style:{getPropertyValue:()=>50}},window:{BearlyCentrumCamera:lens,BearlyBrawlArt:{overlay(c,s,W,H,project){projection=project(4700,-25);}}}};
 vm.runInNewContext(visits.slice(a,b),context);context.overlay({},1160,640,{cameraX:cx,cameraY:cy,groundAt:()=>600});const p=lens.projectRoute({cameraX:cx,cameraY:cy},4700,575);close(projection.x,p.x);close(projection.y,p.y);close(projection.height,145*.88*.8);overlays++;
}
assert.equal(lens.zoom,.6,'Centrum uses the newly requested wider camera');assert.equal(lens.routeZoom,.8);assert(lens.routeFrame(1160,640,true).shiftY===0,'source title composition must remain unchanged');
console.log(JSON.stringify({passed:true,projections,renderCases,overlays,routeZoom:lens.routeZoom,previousRouteZoom:1.35,centumZoom:lens.zoom,titleZoom:1.35,roadAnchorPreserved:true,physicsExecuted:false}));
