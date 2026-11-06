/* Execute production camera/frustum and the real render-only culling paths.
   No simulation, physics, collision, damage, AI or inventory runs here. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const window={};vm.runInNewContext(fs.readFileSync('js/centrum-camera.js','utf8'),{window});
const lens=window.BearlyCentrumCamera,close=(a,b)=>assert(Math.abs(a-b)<1e-7,`${a} differs from ${b}`),plain=v=>JSON.parse(JSON.stringify(v));
const game=fs.readFileSync('js/game.js','utf8'),world=fs.readFileSync('js/illustrated-world.js','utf8');
function section(source,start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert(a>=0&&b>a,'tested production section remains present');return source.slice(a,b);}
const groundCode=section(game,'  function groundDraw(){','  function drawCheckpoint('),thrownCode=section(game,'  function drawThrownItems(){','  function addProjectileImpact('),rangeCode=section(world,'  function range(','  function ground(');
let cornerCases=0,rangeCases=0,groundCases=0,thrownCases=0;
for(const [width,height]of [[1160,640],[1280,720],[1920,1080]])for(const [cameraX,cameraY]of [[0,0],[4100,205],[12000,850]])for(const intro of [false,true])for(const padding of [0,60,200]){
 const frame={width,height,cameraX,cameraY,intro},b=lens.routeBounds(frame,padding),z=lens.routeFrame(width,height,intro).zoom;
 assert(b.left<b.right&&b.top<b.bottom);close(b.right-b.left,width/z+2*padding);close(b.bottom-b.top,height/z+2*padding);
 for(const [x,y,expectedX,expectedY]of [[b.left,b.top,-padding*z,-padding*z],[b.right,b.top,width+padding*z,-padding*z],[b.left,b.bottom,-padding*z,height+padding*z],[b.right,b.bottom,width+padding*z,height+padding*z]]){
  const p=lens.projectRoute(frame,x,y);close(p.x,expectedX);close(p.y,expectedY);cornerCases++;
 }
}
const defaults=lens.routeBounds();assert(Object.values(defaults).every(Number.isFinite));close(defaults.right-defaults.left,1160/.8);
function rangeContract(code=rangeCode){
 const context={window:{BearlyCentrumCamera:lens}};vm.runInNewContext(code,context);
 for(const [W,H]of [[1160,640],[1280,720],[1920,1080]])for(const cameraX of [0,4100,41990])for(const pad of [0,160,250]){
  const s={W,H,cameraX,cameraY:205,finish:42000},view=lens.routeBounds({width:W,height:H,cameraX,cameraY:s.cameraY}),[left,right]=context.range(s,pad);
  close(left,Math.max(0,Math.min(cameraX-pad,view.left-32)));close(right,Math.min(43200,Math.max(cameraX+W+pad,view.right+32)));
  assert(left>=0&&right<=43200&&right>left);rangeCases++;
 }
 // Isolated/archived callers without the project camera retain old behaviour.
 const fallback={window:{}};vm.runInNewContext(code,fallback);assert.deepEqual(plain(fallback.range({cameraX:4100,W:1160,finish:42000},160)),[3940,5420]);
}
rangeContract();
function groundContract(code=groundCode){
 for(const [W,H]of [[1160,640],[1280,720],[1920,1080]])for(const cameraX of [0,4100]){
  const cameraY=205,frame={width:W,height:H,cameraX,cameraY},b=lens.routeBounds(frame),v=lens.routeBounds(frame,100),h=lens.routeBounds(frame,200),draws={ramps:[],stars:[],hazards:[],fallback:[],layers:[],checkpoints:[]},noop=()=>{};
  const ramps=[{id:'left',x:b.left+2},{id:'right',x:b.right-2},{id:'near-padding',x:v.right-1},{id:'far',x:v.right+1}],stars=ramps.map(r=>({...r,y:400,got:false}));stars.push({id:'already-collected',x:b.right-3,y:400,got:true});
  const hazards=[{id:'left',x:b.left+2},{id:'right',x:b.right-2},{id:'near-padding',x:h.right-1},{id:'far',x:h.right+1},{id:'null-ground',x:cameraX+401},{id:'fallback',x:cameraX+402}];
  const before=JSON.stringify({ramps,stars,hazards}),context={W,H,cameraX,cameraY,time:4,ramps,stars,hazards,checkpoints:[{id:'checkpoint'}],ctx:{},illustratedState:()=>({W,H,cameraX,cameraY}),groundAt:x=>x===cameraX+401?null:500,drawGangCrews:()=>{throw Error('Legacy crew path must stay skipped when Visits owns residents');},drawFinishBrakingZone:noop,drawFinish:noop,drawRamp:r=>draws.ramps.push(r.id),drawStar:x=>draws.stars.push(stars.find(s=>s.x===x).id),drawCheckpoint:cp=>draws.checkpoints.push(cp.id),drawHazard:r=>draws.fallback.push(r.id),window:{BearlyCentrumCamera:lens,BearlyVisits:{},BearlyWorld:{backstreet:()=>draws.layers.push('backstreet'),road:()=>draws.layers.push('road')},BearlyStreetProps:{hazard(c,r){draws.hazards.push(r.id);return r.id!=='fallback';}}}};
  vm.runInNewContext(code,context);context.groundDraw();
  assert.deepEqual(draws.ramps,['left','right','near-padding']);assert.deepEqual(draws.stars,['left','right','near-padding']);assert.deepEqual(draws.hazards,['left','right','near-padding','fallback']);assert.deepEqual(draws.fallback,['fallback']);assert.deepEqual(draws.layers,['backstreet','road']);assert.deepEqual(draws.checkpoints,['checkpoint']);assert.equal(JSON.stringify({ramps,stars,hazards}),before,'draw culling does not alter gameplay objects');groundCases++;
 }
}
groundContract();
function thrownContract(code=thrownCode){
 for(const [W,H]of [[1160,640],[1280,720],[1920,1080]]){
  const cameraX=4100,cameraY=205,b=lens.routeBounds({width:W,height:H,cameraX,cameraY}),v=lens.routeBounds({width:W,height:H,cameraX,cameraY},60),projectiles=[b.left+2,b.right-2,v.right-1,v.right+1].map(x=>({x,y:400,vx:12,vy:16,angle:.5,kind:'rock'})),before=JSON.stringify(projectiles),draws=[];
  const ctx=new Proxy({translate(x,y){draws.push({x,y});}},{get:(target,key)=>target[key]??(()=>{})});
  const context={W,H,cameraX,cameraY,projectiles,projectileArtSpec:{rock:{w:12,h:10}},images:{v162_projectile_rock:{naturalWidth:12}},debugSettings:{particles:false},ctx,time:4,window:{BearlyCentrumCamera:lens}};
  vm.runInNewContext(code,context);context.drawThrownItems();assert.deepEqual(draws,projectiles.slice(0,3).map(p=>({x:p.x,y:p.y})));assert.equal(JSON.stringify(projectiles),before,'draw culling does not advance projectiles or apply damage');thrownCases++;
 }
}
thrownContract();
let rejectedMutations=0;
function reject(fn){assert.throws(fn,assert.AssertionError,'the old clipping bug must fail the production contract');rejectedMutations++;}
reject(()=>rangeContract('function range(s,pad=250){return [Math.max(0,s.cameraX-pad),Math.min(s.finish+1200,s.cameraX+s.W+pad)];}'));
const oldGround=groundCode.replaceAll('r.x>visible.left&&r.x<visible.right','r.x>cameraX-100&&r.x<cameraX+W+100').replaceAll('star.x>visible.left&&star.x<visible.right','star.x>cameraX-100&&star.x<cameraX+W+100');assert.notEqual(oldGround,groundCode);reject(()=>groundContract(oldGround));
const oldThrown=thrownCode.replace('p.x<visible.left||p.x>visible.right','p.x<cameraX-60||p.x>cameraX+W+60');assert.notEqual(oldThrown,thrownCode);reject(()=>thrownContract(oldThrown));
console.log(JSON.stringify({passed:true,cornerCases,rangeCases,groundCases,thrownCases,rejectedMutations,routeZoom:lens.routeZoom,simulationExecuted:false}));
