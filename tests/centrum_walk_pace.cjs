/* Actual controller functions and production collision sweeps in a VM.
   Numeric input/position contracts are not a browser animation/FPS claim. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=name=>fs.readFileSync('js/'+name+'.js','utf8');
const gaitCode=read('centrum-depth-gait'),squareCode=read('centrum-square'),sourceCode=read('illustrated-visits');
const near=(a,b,e=1e-7)=>assert(Math.abs(a-b)<=e,`${a} differs from ${b}`),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const forbid=()=>{throw Error('Movement contract cannot create a timer/listener/loop or storage write');};
function extract(code,start,end){const a=code.indexOf(start),b=code.indexOf(end,a);assert(a>=0&&b>a);return code.slice(a,b);}
const squareFunction=extract(squareCode,'  function update(dt,debugOpen=false){','  function render(c,W,H){');
const sourceFunction=extract(sourceCode,'  function update(s){','  function bindHold(');
function config(code=gaitCode){const window={};vm.runInNewContext(code,{window});return window.BearlyCentrumDepthGait;}
function collisionWorld(){const window={};for(const name of ['centrum-scenes','centrum-square-world'])vm.runInNewContext(read(name),{window});return window.BearlyCentrumSquareWorld;}
function square(options={}){
 const keys=new Set(),depth=config(options.gaitCode),window={BearlyCentrumDepthGait:depth,BearlyCentrumStory:{update(){},blocking:()=>false},BearlyCentrumAtmosphere:{update(){}}};
 const free={move:(x,y,dx,dy)=>({x:x+dx,y:y+dy,hit:[]})},actual=options.world||free;
 const c={window,active:true,paused:false,menuHold:false,loading:false,error:null,mapOpen:false,talking:0,messageTime:0,messageEl:{},returning:null,
  sceneId:'metro-square',x:options.x??2000,y:options.y??2000,vx:0,vy:0,face:1,jump:0,jumpVelocity:0,stride:0,weight:0,groundMotion:null,view:'side',hits:[],exitGuard:80,saveTimer:0,
  clamp,has:key=>keys.has(key),world:()=>actual,snapshot:()=>({gateOpened:false}),follow(){},candidate:()=>null,controls:{querySelector:()=>({})},
  clear(){keys.clear();c.vx=c.vy=0;},sync(){},savePosition(){},attemptRemount:()=>false,say(){},requestAnimationFrame:forbid,setTimeout:forbid,addEventListener:forbid,localStorage:{setItem:forbid}};
 vm.createContext(c);vm.runInContext(options.squareFunction||squareFunction,c);return{c,keys,tick:(dt=1/30,debug=false)=>c.update(dt,debug),depth};
}
function source(options={}){
 const keys=new Set(),state={hp:options.hp??100,phase:options.phase||'cute',hitStop:0,defeatAge:0},window={BearlyCentrumDepthGait:config(options.gaitCode),BearlyStreetLife:{react(){}}};
 const c={window,clamp,context:null,mode:options.mode||'street',transition:null,paused:false,waitingDoor:null,rideTools:{},quests:{snapshot:()=>({})},journal:{},
  messageRemaining:0,messageEl:{},held:keys,contacts:new Map(),combatState:state,clock:0,fade:0,returning:false,x:options.x??500,depth:0,velocity:0,depthVelocity:0,
  face:1,stride:0,jumpZ:0,jumpVelocity:0,walkWeight:0,syncViewport(){},clear(){keys.clear();},refresh(){},reactWeaponContacts(){},maul:forbid,
  combat:{update(){},snapshot:()=>state,cancel(){}},player:()=>({}),buoys:[],setMessage(){},stepTransition:forbid,
  requestAnimationFrame:forbid,setTimeout:forbid,addEventListener:forbid,localStorage:{setItem:forbid}};
 vm.createContext(c);vm.runInContext(options.sourceFunction||sourceFunction,c);
 const s={playing:true,dt:1/30,road:{finish:42000,groundAt:options.groundAt||(()=>400)},followFoot(){},storeHealth:value=>assert.equal(value,state.hp)};
 return{c,keys,tick:(dt=1/30)=>{s.dt=dt;c.update(s);},state};
}
function hold(run,keys,frames=45){run.keys.clear();for(const key of keys)run.keys.add(key);for(let i=0;i<frames;i++)run.tick();}
function contract(gait=gaitCode){
 const report={squareSteadyCases:0,sourceSteadyCases:0,stopCases:0,pauseCases:0,collisionCases:0,preservedSourceModes:0};
 const directions=[['right'],['left'],['down'],['up'],['right','down'],['left','down'],['right','up'],['left','up']];
 for(const keys of directions){
  const r=square({gaitCode:gait});hold(r,keys);const dx=Number(keys.includes('right'))-Number(keys.includes('left')),dy=Number(keys.includes('down'))-Number(keys.includes('up')),n=Math.hypot(dx,dy);
  near(r.c.vx,dx/n*200);near(r.c.vy,dy/n*80);near(Math.hypot(r.c.vx/200,r.c.vy/80),1);
  for(const [travel,target]of [[r.c.x-2000,dx/n*200],[r.c.y-2000,dy/n*80]])if(target){const fraction=travel/(target*1.5);assert(fraction>.93&&fraction<=1.01,'actual displacement follows faster target after bounded acceleration');}
  assert(r.c.stride>0);assert(r.c.exitGuard<80);report.squareSteadyCases++;
 }
 for(const keys of [['right'],['down']]){
  const r=square({gaitCode:gait});hold(r,keys);const p={x:r.c.x,y:r.c.y};r.keys.clear();for(let i=0;i<5;i++)r.tick();
  near(r.c.vx,0);near(r.c.vy,0);assert(Math.abs(r.c.x-p.x)<=9,'fast walking stops inside the previous practical arrival margin');assert(Math.abs(r.c.y-p.y)<=2);report.stopCases++;
 }
 // Configuration must be used by the live controller, not copied constants.
 const custom=square({gaitCode:gait.replace('walkSpeed=200','walkSpeed=220').replace('depthSpeed=80','depthSpeed=90')});hold(custom,['right']);near(custom.c.vx,220);hold(custom,['up']);near(custom.c.vy,-90);
 const world=collisionWorld();
 for(const [x,y,key,limit,axis]of [[350,568,'right',380,'x'],[500,640,'up',592,'y'],[1380,850,'right',1418,'x']]){
  const r=square({gaitCode:gait,world,x,y});hold(r,[key],120);assert(r.c.hits.length);assert(!world.blocked(r.c.x,r.c.y,22,12,'metro-square',{}),'fast input never enters furniture/bounds');
  if(axis==='x')assert(r.c.x<=limit+1e-7);else assert(r.c.y>=limit-1e-7);
  const stride=r.c.stride;hold(r,[key],30);near(r.c.stride,stride);assert(r.c.weight<=.0001,'blocked motion does not spin the source gait');report.collisionCases++;
 }
 // Exercise the actual sweep with a frame-sized and much larger movement.
 for(const dx of [200*.04,600]){const moved=world.move(350,568,dx,0,'metro-square',{});assert(moved.x<=380);assert(!world.blocked(moved.x,moved.y));report.collisionCases++;}
 for(const mode of ['paused','mapOpen','loading']){const r=square({gaitCode:gait});r.c[mode]=true;hold(r,['right'],30);near(r.c.x,2000);near(r.c.vx,0);report.pauseCases++;}
 const debug=square({gaitCode:gait});debug.keys.add('right');debug.tick(1/30,true);near(debug.c.x,2000);near(debug.c.vx,0);assert.equal(debug.keys.size,0);report.pauseCases++;
 for(const keys of [['right'],['left'],['right','down']]){
  const r=source({gaitCode:gait});hold(r,keys);near(r.c.velocity,(keys.includes('left')?-1:1)*180*(keys.includes('down')?Math.SQRT1_2:1));
  const fraction=(r.c.x-500)/(r.c.velocity*1.5);assert(fraction>.93&&fraction<=1.01,'source position, not only its velocity audit, advances at the new pace');
  if(keys.includes('down'))near(r.c.depthVelocity,140*Math.SQRT1_2);report.sourceSteadyCases++;
 }
 const sr=source({gaitCode:gait});hold(sr,['right']);const sx=sr.c.x;sr.keys.clear();for(let i=0;i<4;i++)sr.tick();near(sr.c.velocity,0);assert(sr.c.x-sx<=7);report.stopCases++;
 const sp=source({gaitCode:gait});sp.c.paused=true;hold(sp,['right']);near(sp.c.x,500);near(sp.c.velocity,0);report.pauseCases++;
 const hit=source({gaitCode:gait});hit.state.hitStop=1;hold(hit,['right','up'],3);near(hit.c.x,500);near(hit.c.depth,0);near(hit.c.stride,0);report.pauseCases++;
 const edge=source({gaitCode:gait,groundAt:()=>null});hold(edge,['right']);near(edge.c.x,500);near(edge.c.velocity,0);report.collisionCases++;
 for(const [phase,speed]of [['apex',235],['madness',300]]){const r=source({gaitCode:gait,phase});r.keys.add('right');r.tick();near(r.c.velocity,1200/30);hold(r,['right']);near(r.c.velocity,speed);r.keys.clear();r.tick();near(r.c.velocity,speed-1600/30);report.preservedSourceModes++;}
 const dead=source({gaitCode:gait,hp:0});hold(dead,['right','down']);near(dead.c.x,500);near(dead.c.depth,0);near(dead.c.velocity,0);near(dead.c.depthVelocity,0);report.preservedSourceModes++;
 const water=source({gaitCode:gait,mode:'water'});hold(water,['right']);assert(water.c.velocity>250&&water.c.velocity<260);hold(water,['up']);near(water.c.depthVelocity,-95);report.preservedSourceModes++;
 const room=source({gaitCode:gait,mode:'room',x:1000});hold(room,['right']);near(room.c.x,1040);report.preservedSourceModes++;
 const override=source({gaitCode:gait.replace('sourceWalkSpeed=180','sourceWalkSpeed=190')});hold(override,['right']);near(override.c.velocity,190);
 return report;
}
const report=contract();report.rejectedRegressions=[];
for(const [name,from,to]of [['old town pace','walkSpeed=200','walkSpeed=130'],['old street pace','sourceWalkSpeed=180','sourceWalkSpeed=120'],['long stopping slide','walkBraking=2400','walkBraking=400']]){
 assert(gaitCode.includes(from),'regression applies to actual production config');assert.throws(()=>contract(gaitCode.replace(from,to)),assert.AssertionError,name);report.rejectedRegressions.push(name);
}
report.passed=true;report.scope='Actual production controller functions/collision module with VM state and inputs; not visual/device performance evidence';console.log(JSON.stringify(report));
