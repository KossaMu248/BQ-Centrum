/* Real renderer/control-flow with mocked pixels. Browser pixel proof is separate. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let created=0;
class Context{
 constructor(){this.draws=[];this.globalAlpha=1;this.globalCompositeOperation='source-over';}
 drawImage(image,...args){this.draws.push({image,args,alpha:this.globalAlpha,composite:this.globalCompositeOperation});}
 getImageData(x,y,w,h){return{data:new Uint8ClampedArray(w*h*4)};}
 putImageData(){} fillRect(){} createLinearGradient(){return{addColorStop(){}};}
 save(){} restore(){} translate(){} rotate(){} scale(){} beginPath(){} ellipse(){} fill(){}
}
function canvas(){created++;const c={width:0,height:0,context:new Context()};c.getContext=()=>c.context;return c;}
const window={},context=vm.createContext({window,document:{createElement(name){assert.equal(name,'canvas');return canvas();}},Image:class{constructor(){throw Error('No new image requests');}},setTimeout(){throw Error('No timers');},requestAnimationFrame(){throw Error('No new loop');}});
vm.runInContext(fs.readFileSync('js/illustrated-hero.js','utf8'),context);
const api=window.BearlyHero,image=(file,w=291,h=309)=>({src:file,naturalWidth:w,naturalHeight:h});
const injured=image('http://local/assets/cache/hero-cycling-v19/bear_upper_rightarm_injured.png'),coast=image('http://local/assets/cache/hero-cycling-v19/bear_pose_coast.png');
const before=created,repair=api.sprite(injured,coast);assert.equal(created-before,1,'one native cached surface, no generated frames');assert.equal(repair.width,291);assert.equal(repair.height,309);
assert.equal(repair.context.draws.length,3);assert.equal(repair.context.draws[0].image,injured);assert.equal(repair.context.draws[0].composite,'source-over');
for(const [i,roi]of [[1,[182,42,20,22]],[2,[209,47,7,9]]]){const draw=repair.context.draws[i];assert.equal(draw.image,coast);assert.deepEqual(draw.args,[...roi,...roi]);assert.equal(draw.composite,'destination-over','only existing transparent holes can change');assert.equal(draw.alpha,1);}
assert.equal(repair.context.globalCompositeOperation,'source-over');
for(let i=0;i<500;i++)assert.equal(api.sprite(injured,coast),repair);assert.equal(created-before,1);assert.equal(api.audit().eyeRepairs,1);assert.equal(api.audit().eyeRepairBytes,291*309*4);
assert.equal(api.sprite(coast),coast);assert.equal(api.sprite(coast,injured),coast);assert.equal(api.sprite(injured),injured,'ordinary API keeps its original contract');assert.equal(api.sprite(null,coast),null);
for(const invalid of [null,image('http://local/assets/cache/hero-cycling-v19/bear_pose_coast.png',0,0),image('http://local/assets/cache/hero-cycling-v19/bear_pose_coast.png',290,309),image('http://local/assets/cache/hero-cycling-v19/bear_pose_jump.png')])assert.equal(api.sprite(injured,invalid),injured);
// Original-art/fallback images use the same renderer and are cached once too.
const rawInjured=image('http://local/assets/bear_upper_rightarm_injured.webp?local=1'),rawCoast=image('http://local/assets/bear_pose_coast.webp');
const legacy=api.sprite(rawInjured,rawCoast);assert.equal(api.audit().legacyBuilds,2);assert.equal(legacy.context.draws.length,3);assert.equal(legacy.context.draws[0].composite,'source-over');assert.equal(legacy.context.draws[1].composite,'destination-over');assert.equal(api.sprite(rawInjured,rawCoast),legacy);assert.equal(api.audit().eyeRepairs,2);
// Execute the actual active game function: right-arm damage receives the already
// loaded coast reference. Ordinary hurt retains its existing opaque coast body.
const game=fs.readFileSync('js/game.js','utf8'),fn=game.match(/function bearBodyArt\(pose,phase\)\{[\s\S]*?\n  \}/)[0],ctx=new Context(),lostParts=new Set(['rightArm']);
const images={bear_upper_rightarm_injured:injured,bear_pose_coast:coast,bear_upper:coast};
const calls=[],hero={sprite(...args){calls.push(args);return api.sprite(...args);}};
const draw=vm.runInNewContext('('+fn+')',{window:{BearlyHero:hero},lostParts,bike:{cycle:0},images,ctx});draw('hurt',0);assert.equal(calls.length,1);assert.equal(calls[0][0],injured);assert.equal(calls[0][1],coast);assert.equal(ctx.draws[0].image,repair);
lostParts.clear();calls.length=0;ctx.draws.length=0;draw('hurt',0);assert.equal(calls[0][0],coast);assert.equal(calls[0].length,1);assert.equal(ctx.draws[0].image,coast);
const old=fn.replace('images.bear_upper_rightarm_injured,images.bear_pose_coast','images.bear_upper_rightarm_injured');calls.length=0;ctx.draws.length=0;lostParts.add('rightArm');vm.runInNewContext('('+old+')',{window:{BearlyHero:hero},lostParts,bike:{cycle:0},images,ctx})('hurt',0);assert.notEqual(ctx.draws[0].image,repair,'old missing-reference integration regression is detected');
// The airborne crash torso used to bypass sprite(). Only the selected injured
// torso receives the eye repair; normal/fallback/prone art keeps its raw path.
const thrown=game.match(/function drawBearThrown\(\)\{[\s\S]*?\n  \}/)[0],airborne={bearThrown:{x:300,y:100,angle:.35,vy:0},time:2,motion:{crashAt:0},demo:{active:false},groundAt:()=>null,ART_SCALE:.55,ART_ORIGIN_X:147,ART_ORIGIN_Y:247,Math,window:{BearlyHero:hero},lostParts,images,ctx};
const thrownDraw=vm.runInNewContext('('+thrown+')',airborne);
calls.length=0;ctx.draws.length=0;thrownDraw();assert.equal(calls.length,1);assert.equal(calls[0][0],injured);assert.equal(calls[0][1],coast);assert.equal(ctx.draws[0].image,repair);assert.deepEqual(ctx.draws[0].args,[-127,-233],'unchanged native torso origin');
calls.length=0;ctx.draws.length=0;lostParts.clear();thrownDraw();assert.equal(calls.length,0,'healthy thrown art remains raw, without a new material pass');assert.equal(ctx.draws[0].image,coast);
lostParts.add('rightArm');calls.length=0;ctx.draws.length=0;images.bear_upper_rightarm_injured=image('http://local/assets/cache/hero-cycling-v19/bear_upper_rightarm_injured.png',0,0);thrownDraw();assert.equal(calls.length,0,'missing injured image retains original upright fallback');assert.equal(ctx.draws[0].image,coast);images.bear_upper_rightarm_injured=injured;
const prone=image('http://local/assets/v87_prone_1.webp');images.v87_prone_1=prone;calls.length=0;ctx.draws.length=0;vm.runInNewContext('('+thrown+')',{...airborne,groundAt:()=>130})();assert.equal(calls.length,0,'landed prone art remains original');assert.equal(ctx.draws[0].image,prone);
const oldThrown=thrown.replace("lostParts.has('rightArm')&&art===torso?window.BearlyHero.sprite(art,images.bear_pose_coast):art",'art');assert.notEqual(oldThrown,thrown);calls.length=0;ctx.draws.length=0;vm.runInNewContext('('+oldThrown+')',airborne)();assert.notEqual(ctx.draws[0].image,repair,'old airborne bypass mutation is detected');
console.log(JSON.stringify({passed:true,cachedDraws:500,compiledSurfaceBytes:291*309*4,eyeRegions:2,legacyBuilds:api.audit().legacyBuilds,invalidReferenceCases:4,actualGameBranches:6,ridingBranches:2,thrownBranches:4,oldCallMutationRejected:true,oldThrownBypassRejected:true,scope:'Mocked pixel contract; browser proof separately checks actual source alpha/colours and untouched body pixels.'}));
