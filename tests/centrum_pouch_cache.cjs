/* Pouch cache lifecycle/source-delegation contracts. Mocked canvas is not visual
   or pixel proof; the separate real-browser comparison owns that evidence. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const canvases=[];
function context(canvas,main=false,transfer=false){return new Proxy({canvas,draws:[],clips:0,globalAlpha:1},{get(o,k){if(k==='drawImage')return(image,...args)=>o.draws.push({image,args});if(k==='clip')return()=>{o.clips++;assert(!main||transfer,'walking passenger must not create a live curved clip on the game canvas');};if(k==='getImageData')return(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h});return k in o?o[k]:()=>{};},set(o,k,v){o[k]=v;return true;}});}
function canvas(){const c={width:0,height:0,dataset:{}};c.ctx=context(c);c.getContext=()=>c.ctx;canvases.push(c);return c;}
const window={},sandbox={window,Image:class{naturalWidth=2400;naturalHeight=2400;},Uint8ClampedArray,document:{createElement(name){assert.equal(name,'canvas');return canvas();}},Path2D:class{moveTo(){}quadraticCurveTo(){}lineTo(){}closePath(){}}};
for(const name of ['locomotion','baby-passenger','hero-rig'])vm.runInNewContext(fs.readFileSync('js/'+name+'.js','utf8'),sandbox);
const api=window.BearlyHeroRig,source={width:2000,height:2000};
function layout(label='fixture',width=66,raise=0){return{name:label,head:{box:[183,173,83,85],neck:[232,255]},upper:{box:[182,172,94,131],waist:[238,298],raise,lip:[[198,294],[226,299],[198+width,291]],source:'fixture-source.png'},rect:[0,0,2000,2000],origin:[179,500]};}
function paint(l=layout(),image=source,options={}){const c=context({id:'game'},true),a=api.drawPassengerLayout(c,image,l,200/488,options);assert(a.continuousUpperBody&&a.originalCollar&&!a.headOnly);assert.equal(a.uniformScale,l.head.box[3]/61*(200/488));assert.equal(c.clips,0);assert.equal(c.draws.filter(d=>d.image.dataset?.passengerPiece==='continuous-upper-body').length,1,'original native baby is still painted each time');const pouch=c.draws.find(d=>d.image.dataset?.passengerPiece!=='continuous-upper-body');assert(pouch);return{a,c,pouch:pouch.image};}
(async()=>{
 await api.preload();
 const first=paint(),afterFirst=canvases.length,firstStats=api.cacheStats().pouch;
 assert.equal(firstStats.builds,1);assert.equal(firstStats.frames,1);assert.equal(canvases.filter(c=>c.ctx.clips).length,2,'one original child clip plus one source pouch clip is prepared');
 const repeated=paint();assert.equal(repeated.pouch,first.pouch);assert.equal(canvases.length,afterFirst,'steady draws allocate no canvases');assert.equal(api.cacheStats().pouch.hits,1);
 const changedImage=paint(layout(),{width:2000,height:2000});assert.notEqual(changedImage.pouch,first.pouch,'actual source image identity separates otherwise equal metadata');
 const changedRect=layout();changedRect.rect=[1,0,1999,2000];assert.notEqual(paint(changedRect).pouch,first.pouch,'source crop rect cannot reuse another texture');
 assert.notEqual(paint(layout('fixture',68)).pouch,first.pouch,'different curved lips cannot share masks');
 assert.notEqual(paint(layout('fixture',66,3)).pouch,first.pouch,'head-dependent raised lip cannot reuse the old cut');
 const textured=layout();textured.upper.texture=[50,40,120,60];const tex=paint(textured);assert.notEqual(tex.pouch,first.pouch);assert.deepEqual(Array.from(tex.a.pouch.textureMap.source),[50,40,120,60]);
 const firstBaby=first.c.draws[0].image;const point=paint(layout(),source,{talking:true});assert.equal(point.a.mood,'point');assert.notEqual(point.c.draws[0].image,firstBaby,'native expression changes independently of pouch reuse');
 let cases=0;for(const transfer of ['front','back'])for(const h of [145,200,280])for(const mood of [{},{talking:true},{jump:20},{state:{held:true}},{state:{hurt:true}},{groundMotion:{centrumWalk:true,y:-1},weight:1},{groundMotion:{centrumWalk:true,y:1},weight:1}]){
  const l=layout('pose-'+transfer);l.head.box[3]=85;const c=context({id:'game'},true);const a=api.drawPassengerLayout(c,source,l,h/488,mood);assert(a.continuousUpperBody&&a.originalCollar);assert.equal(a.uniformScale,85/61*(h/488));assert.equal(c.clips,0);cases++;
 }
 const transferBuilds=api.cacheStats().pouch.builds;for(const name of ['transfer0','transfer1','transfer2','transfer3','boat']){const l=layout(name),c=context({id:'game'},true,true);api.drawPassengerLayout(c,source,l,200/488,{});assert.equal(c.clips,1,'authored transfers/boat retain the exact final-scale source clip');}assert.equal(api.cacheStats().pouch.builds,transferBuilds,'production transfer/boat clips do not populate walking pouch cache');
 // More than48 distinct lawful layouts must evict/dispose old tiny masks.
 for(let i=0;i<70;i++)paint(layout('bounded-'+i));const bounded=api.cacheStats().pouch;assert.equal(bounded.frames,48);assert(bounded.bytes<=bounded.limitBytes);assert(bounded.evictions>0);assert(first.pouch.width===1&&first.pouch.height===1,'evicted source canvases release their backing store');
 // The byte cap is independent of the frame cap; these few wider masks fit the
 // native source bounds but must evict old masks before exceeding2MiB.
 for(let i=0;i<10;i++){const l=layout('wide-'+i,1250);l.head.box[3]=300;paint(l);const d=api.cacheStats().pouch;assert(d.bytes<=d.limitBytes);assert(d.frames<=d.frameLimit);}
 assert(api.cacheStats().pouch.frames<20,'byte pressure evicts even before the48-frame cap');
 const warm=layout('steady-final'),steady=paint(warm).pouch,n=canvases.length,b=api.cacheStats().pouch.builds;for(let i=0;i<64;i++)assert.equal(paint(warm).pouch,steady);assert.equal(canvases.length,n);assert.equal(api.cacheStats().pouch.builds,b);
 console.log(JSON.stringify({passed:true,nativePoseScaleCases:cases,walkingMainCanvasClips:0,productionTransferBoatClips:5,sourceImageAndGeometryIsolation:true,frameAndByteBudgets:true,evictionDisposal:true,steadyDrawsWithoutNewCanvases:64,pouch:api.cacheStats().pouch}));
})().catch(e=>{console.error(e);process.exitCode=1;});
