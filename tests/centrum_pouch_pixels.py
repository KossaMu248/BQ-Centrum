"""Original passenger/pouch renderer comparison, not in-game screenshots.

Two production HeroRig instances share unchanged source artwork. The legacy
instance is the target's pinned Stage15 source; current is the target workspace.
Only native-expression resolve/draw selection is overridden consistently for
this laboratory. No runtime file is modified. Native1x pouch raster comparison
allows4RGB/A levels for premultiplication; scaled boundary differences are
reported separately and are not silently claimed pixel-identical. Opaque original
face/chin/neck/collar/torso probes must match within4/255 at both scales.
The strict native4/255 comparison remains a separate diagnostic failure if it
exceeds its original tolerance; opaque-autumn composites are also reported.
"""
import base64,functools,hashlib,json,subprocess
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'verification/stage16/pouch';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
legacy=subprocess.check_output(['git','show','ffec905bf71296b63f2d38fab74a3ac20e2c3875:js/hero-rig.js'],cwd=ROOT).decode();legacy=legacy.replace('window.BearlyHeroRig={','window.BearlyHeroRig={labDefinitions:()=>({heads,upperBodies,backgrounds,actions,profiles,imageFiles,images}),')
LAB=r'''async()=>{
 const current=window.__pouchCurrent,old=window.__pouchLegacy;await Promise.all([current.preload(),old.preload()]);
 const defs=old.labDefinitions(),frames=BearlyBabyPassenger.frames(),moods=['idle','laugh','point','terror','brace','excited','leanForward','leanBack','sick'];
 const image=new Image();image.src='assets/art/boat-passengers-v8.png';await image.decode();
 const transfer=new Image();transfer.src='assets/art/bike-transfer-v7.png';await transfer.decode();
 const originalResolve=BearlyBabyPassenger.resolve,originalDraw=BearlyBabyPassenger.draw,originalImage=CanvasRenderingContext2D.prototype.drawImage;let forced='idle',lastChild=null;
 BearlyBabyPassenger.resolve=()=>forced;BearlyBabyPassenger.draw=(c,o)=>originalDraw(c,{...o,mood:forced});
 CanvasRenderingContext2D.prototype.drawImage=function(im,...a){if(im?.dataset?.passengerPiece==='continuous-upper-body')lastChild={image:im,args:a,matrix:this.getTransform()};return originalImage.call(this,im,...a);};
 const board=document.createElement('canvas');board.width=600;board.height=moods.length*140;const bc=board.getContext('2d');bc.fillStyle='#ddd3b9';bc.fillRect(0,0,board.width,board.height);
 const result={cases:[],sourceTargetCommit:'ffec905bf71296b63f2d38fab74a3ac20e2c3875',nativeRasterTolerance:4,protectedProbeTolerance:4,protectedProbes:0,maxProtectedDelta:0,rawNativeFailures:[],protectedFailures:[],compositeBackground:[205,190,159],errors:[],label:'Renderer references, not gameplay',moods};
 try{
  for(const name of Object.keys(defs.heads))for(const mood of moods)for(const s of [1,200/488]){
   forced=mood;const head=defs.heads[name],upper=defs.upperBodies[name],imageKey=defs.profiles[name]?.image||defs.actions[name]?.image;
   const source=name==='boat'?image:name.startsWith('transfer')?transfer:defs.images[imageKey||'front'];
   const layout={name,head,upper,origin:upper.waist,rect:[0,0,source.naturalWidth,source.naturalHeight]};const canvases=[],audits=[],children=[];
   for(const rig of [old,current]){const cv=document.createElement('canvas');cv.width=cv.height=512;const c=cv.getContext('2d',{willReadFrequently:true});c.translate(256,300);lastChild=null;const a=rig.drawPassengerLayout(c,source,layout,s,{state:{hp:100}});if(!a.continuousUpperBody||!a.originalCollar||a.headOnly||a.mood!==mood)throw Error('Native child continuity/mood failure');if(Math.abs(a.uniformScale-head.box[3]/61*s)>1e-12)throw Error('Native child scale changed');canvases.push(cv);audits.push(a);children.push(lastChild);}
   const pixels=canvases.map(cv=>cv.getContext('2d').getImageData(0,0,512,512).data);let changed=0,maxDelta=0,opaqueChanges=0,maxOpaqueDelta=0,maxHighAlphaDelta=0,maxAlphaDelta=0,worstAlpha=null,maxPremultipliedDelta=0,maxAutumnCompositeDelta=0,compositeChanged=0,compositeOver4=0,compositeAbsoluteError=0;
   for(let n=0;n<pixels[0].length;n+=4){let delta=0;for(let k=0;k<4;k++)delta=Math.max(delta,Math.abs(pixels[0][n+k]-pixels[1][n+k]));maxAlphaDelta=Math.max(maxAlphaDelta,Math.abs(pixels[0][n+3]-pixels[1][n+3]));let compositeDelta=0;for(let k=0;k<3;k++){const pa=pixels[0][n+k]*pixels[0][n+3]/255,pb=pixels[1][n+k]*pixels[1][n+3]/255;maxPremultipliedDelta=Math.max(maxPremultipliedDelta,Math.abs(Math.round(pa)-Math.round(pb)));const ca=Math.round(pa+result.compositeBackground[k]*(1-pixels[0][n+3]/255)),cb=Math.round(pb+result.compositeBackground[k]*(1-pixels[1][n+3]/255));compositeDelta=Math.max(compositeDelta,Math.abs(ca-cb));compositeAbsoluteError+=Math.abs(ca-cb);}maxPremultipliedDelta=Math.max(maxPremultipliedDelta,Math.abs(pixels[0][n+3]-pixels[1][n+3]));maxAutumnCompositeDelta=Math.max(maxAutumnCompositeDelta,compositeDelta);if(compositeDelta)compositeChanged++;if(compositeDelta>4)compositeOver4++;if(delta){changed++;if(delta>maxDelta){maxDelta=delta;worstAlpha=[pixels[0][n+3],pixels[1][n+3]];}if(pixels[0][n+3]>=245&&pixels[1][n+3]>=245)maxHighAlphaDelta=Math.max(maxHighAlphaDelta,delta);if(pixels[0][n+3]===255&&pixels[1][n+3]===255){opaqueChanges++;maxOpaqueDelta=Math.max(maxOpaqueDelta,delta);}}}
   const sourcePixels=children[0].image.getContext('2d').getImageData(0,0,children[0].image.width,children[0].image.height).data,points=frames[mood].protected;let probes=0,protectedDelta=0;
   for(const category of ['face','chin','neck','collar','torso'])for(const [sx,sy]of points[category]||[]){if(sourcePixels[(sy*children[0].image.width+sx)*4+3]<245)continue;const [dx,dy]=children[0].args,m=children[0].matrix,x=Math.floor(m.a*(dx+sx)+m.c*(dy+sy)+m.e),y=Math.floor(m.b*(dx+sx)+m.d*(dy+sy)+m.f);if(x<0||y<0||x>=512||y>=512)continue;let delta=0;for(let k=0;k<4;k++)delta=Math.max(delta,Math.abs(pixels[0][(y*512+x)*4+k]-pixels[1][(y*512+x)*4+k]));protectedDelta=Math.max(protectedDelta,delta);probes++;}
   result.protectedProbes+=probes;result.maxProtectedDelta=Math.max(result.maxProtectedDelta,protectedDelta);if(protectedDelta>4)result.protectedFailures.push('Protected original child pixels changed '+name+'/'+mood+'/'+s+':'+protectedDelta);
   if(s===1&&maxDelta>4)result.rawNativeFailures.push('Native source pouch pixels exceed4/255 '+name+'/'+mood+':'+maxDelta);
   result.cases.push({name,mood,scale:s,changedPixels:changed,maxDelta,opaqueChanges,maxOpaqueDelta,maxHighAlphaDelta,maxAlphaDelta,worstAlpha,maxPremultipliedDelta,maxAutumnCompositeDelta,compositeChanged,compositeOver4,compositeAbsoluteError,protectedProbes:probes,maxProtectedDelta:protectedDelta,nativeRaster:s===1});
   if(s!==1&&['front','back'].includes(name)){const col=name==='front'?0:2,row=moods.indexOf(mood);for(let i=0;i<2;i++){bc.fillStyle='#263c30';bc.font='11px Arial';bc.fillText((i?'cached ':'legacy ')+name+' '+mood,(col+i)*150+4,row*140+14);bc.drawImage(canvases[i],181,216,150,124,(col+i)*150,row*140+16,150,124);}}
  }
 }finally{BearlyBabyPassenger.resolve=originalResolve;BearlyBabyPassenger.draw=originalDraw;CanvasRenderingContext2D.prototype.drawImage=originalImage;}
 result.pouch=current.cacheStats().pouch;result.protectedPassed=!result.protectedFailures.length;result.strictNativePassed=!result.rawNativeFailures.length;result.passed=result.protectedPassed&&result.strictNativePassed&&!result.errors.length;result.referencePng=board.toDataURL('image/png');return result;
}'''
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();result={'scope':__doc__,'pageErrors':[],'consoleErrors':[],'httpFailures':[]}
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':1280,'height':720});page=c.new_page();page.on('pageerror',lambda e:result['pageErrors'].append(str(e)));page.on('console',lambda m:result['consoleErrors'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None);page.goto(f'http://127.0.0.1:{server.server_port}/index.html');page.wait_for_function('window.BearlyHeroRig&&window.BearlyCentrumInventory?.audit().bound&&window.BEARLY_STARTUP?.().firstFrameAt!==null',timeout=90000);page.evaluate('window.__pouchCurrent=BearlyHeroRig');page.add_script_tag(content=legacy);page.evaluate('window.__pouchLegacy=BearlyHeroRig;window.BearlyHeroRig=__pouchCurrent');data=page.evaluate(LAB);png=data.pop('referencePng');(OUT/'passenger-pouch-normal200-reference.png').write_bytes(base64.b64decode(png.split(',')[1]));result.update(data);result['browser']=b.version;result['build']=page.evaluate('BEARLY_BUILD_ID');result['harnessSHA256']=hashlib.sha256(Path(__file__).read_bytes()).hexdigest();result['heroSHA256']=hashlib.sha256((ROOT/'js/hero-rig.js').read_bytes()).hexdigest();assert not result['pageErrors'] and not result['errors'] and not result['consoleErrors'] and not result['httpFailures'];c.close();b.close()
finally:server.shutdown();server.server_close();(OUT/'pixels.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'passed':result.get('passed'),'cases':len(result.get('cases',[])),'protectedProbes':result.get('protectedProbes'),'maxProtectedDelta':result.get('maxProtectedDelta'),'nativeMaxDelta':max((c['maxDelta'] for c in result.get('cases',[]) if c['nativeRaster']),default=None),'scaledMaxDelta':max((c['maxDelta'] for c in result.get('cases',[]) if not c['nativeRaster']),default=None)},indent=2))

if not result.get('passed'):raise SystemExit(1)
