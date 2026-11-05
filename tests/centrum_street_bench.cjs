/* Actual project bench painting and cached Canvas submissions, mocked pixels.
   This verifies geometry/cache contracts; normal-size gameplay is separate. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('js/centrum-street-bench.js','utf8');
const manifest=JSON.parse(fs.readFileSync('assets/cache/actors-v19-manifest.json','utf8'));
const close=(a,b,tolerance=1e-7)=>assert(Math.abs(a-b)<=tolerance,`${a} differs from ${b}`);
const plain=value=>JSON.parse(JSON.stringify(value));
const multiply=(m,n)=>[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];
const point=(m,x,y)=>({x:m[0]*x+m[2]*y+m[4],y:m[1]*x+m[3]*y+m[5]});
class Context{
 constructor(canvas){this.canvas=canvas;this.m=[1,0,0,1,0,0];this.stack=[];this.draws=[];this.fills=[];this.path=[];this.globalAlpha=1;}
 save(){this.stack.push({m:[...this.m],alpha:this.globalAlpha,fillStyle:this.fillStyle,lineWidth:this.lineWidth});}
 restore(){const saved=this.stack.pop();assert(saved,'balanced Canvas save/restore');Object.assign(this,{m:saved.m,globalAlpha:saved.alpha,fillStyle:saved.fillStyle,lineWidth:saved.lineWidth});}
 translate(x,y){this.m=multiply(this.m,[1,0,0,1,x,y]);}
 scale(x,y){this.m=multiply(this.m,[x,0,0,y,0,0]);}
 rotate(angle){this.m=multiply(this.m,[Math.cos(angle),Math.sin(angle),-Math.sin(angle),Math.cos(angle),0,0]);}
 setTransform(...m){this.m=m.length===1?[m[0].a,m[0].b,m[0].c,m[0].d,m[0].e,m[0].f]:m;}
 resetTransform(){this.m=[1,0,0,1,0,0];}
 beginPath(){this.path=[];}
 moveTo(x,y){this.path.push(point(this.m,x,y));}
 lineTo(x,y){this.path.push(point(this.m,x,y));}
 rect(x,y,w,h){for(const p of [[x,y],[x+w,y],[x+w,y+h],[x,y+h]])this.path.push(point(this.m,...p));}
 roundRect(x,y,w,h){this.rect(x,y,w,h);}
 ellipse(x,y,rx,ry){this.path.push(point(this.m,x-rx,y),point(this.m,x+rx,y),point(this.m,x,y-ry),point(this.m,x,y+ry));}
 arc(x,y,r){this.ellipse(x,y,r,r);}
 bezierCurveTo(...coordinates){for(let i=0;i<coordinates.length;i+=2)this.path.push(point(this.m,coordinates[i],coordinates[i+1]));}
 quadraticCurveTo(...coordinates){this.bezierCurveTo(...coordinates);}
 closePath(){}stroke(){}clip(){}clearRect(){}fillText(){}
 fill(){this.fills.push({style:this.fillStyle,alpha:this.globalAlpha,points:this.path.map(p=>({...p}))});}
 fillRect(x,y,w,h){this.beginPath();this.rect(x,y,w,h);this.fill();}
 drawImage(image,...args){this.draws.push({image,args,m:[...this.m],alpha:this.globalAlpha});}
 createLinearGradient(){return{addColorStop(){}};}
 createRadialGradient(){return{addColorStop(){}};}
 getImageData(){throw Error('A vector bench must not read pixels on draw');}
}
function load(code=source){
 const counts={canvases:0,timers:0,loops:0,listeners:0},canvases=[];
 function canvas(){counts.canvases++;const tile={width:0,height:0,dataset:{}};tile.context=new Context(tile);tile.getContext=kind=>{assert.equal(kind,'2d');return tile.context;};canvases.push(tile);return tile;}
 const forbidden=kind=>()=>{counts[kind]++;throw Error('Bench rendering must not own '+kind);};
 const window={};
 vm.runInNewContext(code,{window,document:{createElement:kind=>{assert.equal(kind,'canvas');return canvas();}},OffscreenCanvas:class{constructor(width,height){const tile=canvas();tile.width=width;tile.height=height;return tile;}},performance:{now:()=>0},requestAnimationFrame:forbidden('loops'),setTimeout:forbidden('timers'),addEventListener:forbidden('listeners'),Image:class{constructor(){throw Error('Project bench needs no external image');}}});
 const api=window.BearlyCentrumStreetBench;assert(api&&typeof api.metrics==='function'&&typeof api.draw==='function'&&typeof api.audit==='function');return{api,counts,canvases};
}
function cachedPoint(draw,p){
 let sx=0,sy=0,sw=draw.image.width,sh=draw.image.height,dx,dy,dw,dh;
 if(draw.args.length===2){[dx,dy]=draw.args;dw=sw;dh=sh;}
 else if(draw.args.length===4)[dx,dy,dw,dh]=draw.args;
 else if(draw.args.length===8)[sx,sy,sw,sh,dx,dy,dw,dh]=draw.args;
 else assert.fail('Expected ordinary cached canvas drawImage submission');
 return point(draw.m,dx+(p.x-sx)*dw/sw,dy+(p.y-sy)*dh/sh);
}
function assertFinite(value){
 if(typeof value==='number')assert(Number.isFinite(value),'finite audit/metric values');
 else if(value&&typeof value==='object')for(const entry of Object.values(value))assertFinite(entry);
}
function contract(code=source){
 const {api,counts,canvases}=load(code),metrics=plain(api.metrics());
 close(metrics.width,224);close(metrics.bodyHeight,70);close(metrics.seatHeight,26);close(metrics.seatPan.front,21.4);close(metrics.seatPan.rear,30.7);close(metrics.usableSeatWidth,188);close(metrics.footprintHalf,224*.55);
 const bodies=manifest.npcSources.flatMap(pack=>pack.frames).filter(frame=>[9,10,11].includes(frame.variant)&&['sit','read'].includes(frame.pose)).map(frame=>({variant:frame.variant,pose:frame.pose,width:frame.core[2]*128*(frame.variant===9?1.05:frame.variant===11?.84:1)/frame.stature}));
 assert.equal(bodies.length,6);const largest=Math.max(...bodies.map(body=>body.width)),gap=12;
 assert(metrics.usableSeatWidth>=largest*2+gap,'shared seat fits two largest original seated bodies with a real gap');
 for(const centre of [-(largest+gap)/2,(largest+gap)/2])assert(Math.abs(centre)+largest/2<=metrics.usableSeatWidth/2,'both full opaque bodies fit between arm rails');
 const report={scope:'Production vector paths/cached Canvas transforms and original NPC metadata, not pixel or gameplay acceptance',largestOpaqueSeatedWidth:largest,twoBodyGap:gap,usableSeatWidth:metrics.usableSeatWidth,paintedSeatCases:0,cachedDrawCases:0,invalidDrawCases:0};
 for(const args of [[NaN,400,224],[Infinity,400,224],[500,NaN,224],[500,400,0],[500,400,-1],[500,400,Infinity],[500,400,NaN]]){
  const c=new Context({width:1160,height:640});assert.equal(api.draw(c,...args),false);assert.equal(c.draws.length,0);assert.equal(c.stack.length,0);assert.deepEqual(c.m,[1,0,0,1,0,0]);report.invalidDrawCases++;
 }
 assert.equal(counts.canvases,0,'invalid draws never allocate a prepared sprite');
 let afterFirst=null;
 for(const width of [224,140,280,224]){
  const scale=width/224,measure=plain(api.metrics(width));assertFinite(measure);
  for(const key of ['width','bodyHeight','seatHeight','usableSeatWidth','footprintHalf'])close(measure[key],metrics[key]*scale);
  close(measure.seatPan.front,metrics.seatPan.front*scale);close(measure.seatPan.rear,metrics.seatPan.rear*scale);
  const target=new Context({width:1160,height:640});target.translate(18,23);target.scale(.75,.75);const before=[...target.m];
  assert.notEqual(api.draw(target,500,400,width),false);assert.deepEqual(target.m,before);assert.equal(target.stack.length,0);assert.equal(target.draws.length,1,'one cached bench submission');
  const draw=target.draws[0];assert(draw.image.context,'draw uses its prepared local canvas');
  const expectedRear=point(before,500,400-measure.seatPan.rear).y,expectedFront=point(before,500,400-measure.seatPan.front).y;
  const filled=draw.image.context.fills.map(shape=>({...shape,world:shape.points.map(p=>cachedPoint(draw,p))}));
  const seat=filled.find(shape=>{
   if(shape.world.length!==4)return false;const ys=shape.world.map(p=>p.y),xs=shape.world.map(p=>p.x);
   return Math.abs(Math.min(...ys)-expectedRear)<1e-6&&Math.abs(Math.max(...ys)-expectedFront)<1e-6&&Math.max(...xs)-Math.min(...xs)>=measure.usableSeatWidth*.75;
  });
  assert(seat,'actual cached painted seat pan agrees with contact metrics, through the real image transform');report.paintedSeatCases++;
  const highestPaintedPoint=Math.min(...filled.flatMap(shape=>shape.world.map(p=>p.y))),floor=point(before,500,400).y;
  assert(highestPaintedPoint>=floor-measure.bodyHeight*.75-1e-7,'painted back stays within the stated body height');
  assert(highestPaintedPoint<=floor-(measure.bodyHeight-2*scale)*.75+1e-7,'the actual tall back is painted, not only reported in metadata');
  assertFinite(api.audit());
  if(!afterFirst)afterFirst={canvases:counts.canvases,paintedPaths:canvases.reduce((n,c)=>n+c.context.fills.length,0)};
  assert.equal(counts.canvases,afterFirst.canvases,'different output widths reuse the same prepared picture');
 }
 assert.equal(counts.canvases,1,'one bounded two-times-resolution bench canvas');
 assert(canvases[0].width*canvases[0].height*4<=1024*1024,'fixed cached artwork is bounded below1MiB');
 assert.equal(canvases[0].context.stack.length,0,'painter also balances Canvas state');
 for(let frame=0;frame<240;frame++){
  const c=new Context({width:1160,height:640});api.draw(c,500+frame,400,frame%2?224:280);assert.equal(c.stack.length,0);assert.equal(c.draws.length,1);report.cachedDrawCases++;
 }
 assert.equal(counts.canvases,afterFirst.canvases);assert.equal(canvases.reduce((n,c)=>n+c.context.fills.length,0),afterFirst.paintedPaths,'no per-frame vector repaint/raster work');
 assert.equal(counts.timers,0);assert.equal(counts.loops,0);assert.equal(counts.listeners,0);report.cacheCanvases=counts.canvases;report.cacheBytes=canvases[0].width*canvases[0].height*4;
 const audit=plain(api.audit());assert.equal(audit.builds,1);assert.equal(audit.draws,report.cachedDrawCases+report.paintedSeatCases);assert.equal(audit.cacheBytes,report.cacheBytes);assert.equal(audit.lastWidth,224);
 report.passed=true;return report;
}
const report=contract();
const mutations=[
 {name:'old tiny140 default bench',from:'const width=224,',to:'const width=140,'},
 {name:'old uniformly scaled196-unit seat pan',from:'{front:21.4,rear:30.7}',to:'{front:27.5*196/180,rear:39.5*196/180}'},
 {name:'per-draw vector rebuild',from:'if(canvas)return canvas;',to:'if(false)return canvas;'},
];
report.rejectedMutations=[];
for(const mutation of mutations){assert(source.includes(mutation.from),'mutation applies to actual final production source');const changed=source.replace(mutation.from,mutation.to);assert.throws(()=>contract(changed),assert.AssertionError,mutation.name+' must fail');report.rejectedMutations.push(mutation.name);}
console.log(JSON.stringify(report));
