/* Actual source metadata and submitted Canvas transforms, with mocked pixels.
   This does not certify visual quality; source-pose lab/gameplay review is separate. */
'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),vm=require('node:vm');
const manifest=JSON.parse(fs.readFileSync('assets/cache/actors-v19-manifest.json','utf8'));
for(const [file,hash]of Object.entries(manifest.sourceSHA256))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),hash,'original NPC/teen artwork remains untouched: '+file);
const close=(a,b,e=1e-7)=>assert(Math.abs(a-b)<=e,`${a} differs from ${b}`),plain=x=>JSON.parse(JSON.stringify(x));
const multiply=(m,n)=>[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];
let canvases=0,pixelReads=0,timers=0,workers=0;
class Context{
 constructor(){this.m=[1,0,0,1,0,0];this.stack=[];this.draws=[];this.globalAlpha=1;}
 save(){this.stack.push({m:[...this.m],alpha:this.globalAlpha});} restore(){const s=this.stack.pop();assert(s);this.m=s.m;this.globalAlpha=s.alpha;}
 translate(x,y){this.m=multiply(this.m,[1,0,0,1,x,y]);}scale(x,y){this.m=multiply(this.m,[x,0,0,y,0,0]);}rotate(a){this.m=multiply(this.m,[Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]);}
 drawImage(image,...args){this.draws.push({image,args,m:[...this.m]});}getImageData(){pixelReads++;throw Error('authored target draw must not read pixels');}
 beginPath(){}rect(){}clip(){}moveTo(){}lineTo(){}stroke(){}fillText(){}bezierCurveTo(){}
}
function canvas(){canvases++;const c={width:0,height:0,dataset:{},context:new Context()};c.getContext=()=>c.context;return c;}
class MockImage{constructor(){this.naturalWidth=0;this.naturalHeight=0;this.complete=false;}set src(v){this.url=v;this.naturalWidth=2048;this.naturalHeight=1536;this.complete=true;queueMicrotask(()=>this.onload?.());}get src(){return this.url||'';}decode(){return Promise.resolve();}}
const window={BearlyHeroRig:{ready:()=>true}};
const context=vm.createContext({window,document:{createElement:kind=>{assert.equal(kind,'canvas');return canvas();}},Image:MockImage,fetch:()=>Promise.resolve({ok:true,json:()=>Promise.resolve(manifest)}),performance:{now:()=>0},setTimeout:()=>{timers++;throw Error('target authored render must not schedule a bake');},clearTimeout(){},queueMicrotask,URL:{createObjectURL(){throw Error('target authored render must not create a worker URL');}},Blob:class{},Worker:class{constructor(){workers++;throw Error('target authored render must not start a worker');}}});
for(const name of ['npc-motion','illustrated-kids','brawler-art','brawler'])vm.runInContext(fs.readFileSync('js/'+name+'.js','utf8'),context);
const api=window.BearlyNpcMotion,kids=window.BearlyKids,art=window.BearlyBrawlArt;
(async()=>{
 await Promise.all([api.loaded,kids.loaded,art.prepare()]);assert(api.ready()&&kids.ready()&&art.ready());
 const report={scope:'Mocked Canvas/real source metadata; no pixel/visual claim',authoredWalkCases:0,groundedSoles:0,childPoseCases:0,contactLockCases:0,projectileOriginCases:0};
 assert.equal(kids.worldHeight(),94);close(kids.heightFor(128),94);close(kids.heightFor(198),198*94/128);
 const baseCanvases=canvases;assert.deepEqual(plain(await api.preloadVariants([0,9,11,9],{authoredWalk:true})),[true,true,true]);
 for(const variant of Array.from({length:12},(_,i)=>i))for(const height of [90,128,198])for(const face of [-1,1])for(const phase of [0,.125,.25,.375,.5,.625,.75,.875]){
  const h=height*(variant===9?1.05:variant===11?.84:1),c=new Context(),n={id:'adult-'+variant,kind:'resident',variant,civilian:true,state:'idle',mood:'calm',age:1,activity:'walk',moving:true,distance:api.walkCycleLength(h)*phase,face,hp:60};
  art.adult(c,n,330,260,height);const a=api.audit(),keys=variant>=9?['walkA','walkB']:['walkA','idle','walkB','idle'],pose=keys[Math.floor(phase*keys.length)];
  assert.equal(a.pose,pose);assert.equal(a.details.authored,true);assert.equal(a.details.completePose,true);assert.equal(a.details.drawCalls,1);close(a.height,h);assert.equal(c.draws.length,1,'one whole source person, not mirrored leg fragments/overlaid bodies');assert.equal(c.stack.length,0);
  const f=api.frame(variant,pose),d=c.draws[0],coreBottom=f.core[1]+f.core[3]-1-f.rect[1],dy=d.args[1],dh=d.args[3],tileH=d.image.height;
  const localY=dy+coreBottom*dh/tileH;close(d.m[3]*localY+d.m[5],260);report.groundedSoles++;
  close(Math.hypot(d.m[0],d.m[1]),1);close(Math.hypot(d.m[2],d.m[3]),1);close(d.args[2]/d.image.width,h/f.stature);close(d.args[3]/d.image.height,h/f.stature);assert.equal(d.image.dataset.sourcePose,pose);report.authoredWalkCases++;
 }
 const stats=api.cacheStats();assert.equal(stats.frameCount,0);assert.equal(stats.bytes,0);assert.deepEqual(plain(stats.requestedVariants),[]);assert.equal(canvases,baseCanvases,'authored movement creates no canvases');assert.equal(pixelReads,0);assert.equal(timers,0);assert.equal(workers,0);
 for(const kind of ['bottle','rock','firecracker'])for(const state of ['idle','stagger','fall','down','rise','held','windup','release','recover'])for(const face of [-1,1]){
  const c=new Context(),n={id:'teen-'+kind,kind:'gangster',item:kind,state,age:.3,activity:'chill',face,hp:60};art.adult(c,n,0,0,128);const d=kids.audit().drawn[kind];assert.equal(d.height,94,'all child poses share one shorter physical height');assert(d.source.startsWith('assets/art/teen-'));assert.equal(c.draws.length,1);report.childPoseCases++;
 }
 // Native source-cache compatibility remains explicit and available; the target
 // opted-in renderer above must not have prepared it as a side effect.
 await api.preloadVariants([0]);assert.equal(api.cacheStats().frameCount,48);assert.equal(api.cacheStats().requestedVariants.length,1);assert.equal(api.cacheStats().requestedVariants[0],0);
 const footSource=fs.readFileSync('js/npc-motion.js','utf8').match(/function foot\(phase,h,half\)\{[^\n]+\}/)[0];const foot=vm.runInNewContext('('+footSource+')');
 for(const h of [90,128,198])for(const phase of [.05,.2,.4]){const cycle=api.walkCycleLength(h),epsilon=1e-5,a=foot(phase,h,h*.17),b=foot(phase+epsilon/cycle,h,h*.17);assert(a.stance&&b.stance);close(epsilon+b.x-a.x,0,1e-6);report.contactLockCases++;}
 for(const item of ['bottle','rock','firecracker']){
  const game=window.BearlyBrawler.create(),player={x:0,depth:0,z:0,face:1};game.enter('street',[{id:'gang',kind:'gangster',hostile:true,item,x:250,depth:0}]);assert(game.provokeGang('gang',player));let shot;
  for(let i=0;i<500&&!shot;i++){game.update(.02,player);shot=game.snapshot().shots[0];}
  assert(shot,'provoked child eventually throws');close(shot.fromZ,kids.projectileOrigin(item,94).z);report.projectileOriginCases++;
 }
 report.authoredFramesAllocated=0;report.authoredWalkCacheBytes=0;report.legacyVariantFrames=48;report.passed=true;console.log(JSON.stringify(report));
})().catch(error=>{console.error(error);process.exitCode=1;});
