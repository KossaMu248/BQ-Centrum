"""Read-only runtime profiling in a disposable Chromium desktop context.

A source debug warp shortens travel to the existing cycling stop. E still performs
production transfer. Thereafter only ordinary keyboard movement is sent. Function
wrappers preserve arguments/results and private state; all saves are disposable.
Do not run concurrently with another browser acceptance test on the shared host.
"""
import argparse
import functools
import hashlib
import json
import math
import platform
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'verification/stage10/performance'


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


INSTRUMENT = r'''(() => {
  const qa=window.__perfReview={phase:'cold',frames:[],calls:{},pending:0,maxPending:0};
  const raf=window.requestAnimationFrame.bind(window);let previous=null;
  window.requestAnimationFrame=function(fn){
    if(fn.name!=='loop')return raf(fn);
    qa.pending++;qa.maxPending=Math.max(qa.maxPending,qa.pending);
    return raf(t=>{qa.pending--;const start=performance.now(),label=qa.phase;
      try{return fn(t);}finally{qa.frames.push({phase:label,at:t,interval:previous===null?null:t-previous,cpu:performance.now()-start});previous=t;}
    });
  };
  qa.install=()=>{
    const targets={
      BearlyCentrumSquare:['render','update'],BearlyCentrumSquareWorld:['drawBase','drawables'],
      BearlyCentrumScenes:['get'],BearlyCentrumStory:['update','decorate'],
      BearlyHeroRig:['draw'],BearlyNpcMotion:['draw'],
      BearlyCentrumEconomy:['update','context','snapshot'],
      BearlyCentrumInventory:['update'],BearlyVisits:['audit'],
    };
    const record=(name,elapsed,size)=>{const key=qa.phase+'::'+name;let r=qa.calls[key];
      if(!r)r=qa.calls[key]={n:0,total:0,max:0,samples:[],bytes:0};
      r.n++;r.total+=elapsed;r.max=Math.max(r.max,elapsed);if(r.samples.length<20000)r.samples.push(elapsed);if(size)r.bytes+=size;
    };
    for(const [group,methods]of Object.entries(targets))for(const name of methods){
      const obj=window[group],original=obj?.[name];if(typeof original!=='function')continue;
      obj[name]=function(...args){const at=performance.now();try{return original.apply(this,args);}finally{record(group+'.'+name,performance.now()-at);}};
    }
    for(const name of ['parse','stringify']){const original=JSON[name];
      JSON[name]=function(...args){const at=performance.now();let output;
        try{return output=original.apply(this,args);}finally{record('JSON.'+name,performance.now()-at,name==='stringify'?output?.length:args[0]?.length);}
      };
    }
    qa.installedAt=performance.now();
  };
})();'''


def percentile(values, fraction):
    values=sorted(values)
    return values[min(len(values)-1,int((len(values)-1)*fraction))] if values else None


def summarize(raw):
    phases={}
    for phase in dict.fromkeys(f['phase'] for f in raw['frames']):
        rows=[f for f in raw['frames'] if f['phase']==phase]
        intervals=[f['interval'] for f in rows if f['interval'] is not None]
        cpu=[f['cpu'] for f in rows]
        phases[phase]={'frames':len(rows),'intervalMs':{'median':percentile(intervals,.5),'p95':percentile(intervals,.95),'max':max(intervals,default=0)},'mainLoopCpuMs':{'median':percentile(cpu,.5),'p95':percentile(cpu,.95),'max':max(cpu,default=0)},'functions':{}}
    for key,data in raw['calls'].items():
        phase,name=key.split('::',1);row={k:v for k,v in data.items() if k!='samples'}
        row.update({'meanMs':data['total']/data['n'],'medianMs':percentile(data['samples'],.5),'p95Ms':percentile(data['samples'],.95),'perFrame':data['n']/max(1,phases.get(phase,{}).get('frames',0))})
        phases.setdefault(phase,{'functions':{}})['functions'][name]=row
    return phases



PIXEL_EQUIVALENCE = r"""async(config={})=>{
  const png=canvas=>new Promise(resolve=>canvas.toBlob(async blob=>resolve([...new Uint8Array(await blob.arrayBuffer())]),'image/png'));
  const cases=[],cycle=BearlyLocomotion.cycleLength(200),hash=async data=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',data))].map(v=>v.toString(16).padStart(2,'0')).join('');
  for(const [heading,motion]of [['horizontal',{x:1,y:0,cacheKey:'horizontal',centrumWalk:true}],['up',{x:0,y:-1,cacheKey:'depth:0:-32',centrumWalk:true}],['down',{x:0,y:1,cacheKey:'depth:0:32',centrumWalk:true}]])for(const phase of [0,.25,.5,.75]){
    const native=document.createElement('canvas'),worker=document.createElement('canvas');native.width=worker.width=320;native.height=worker.height=300;
    const options={state:{hp:100},weight:1,distance:cycle*phase,groundMotion:motion},nc=native.getContext('2d'),wc=worker.getContext('2d');
    let nativeKind=null,workerKind=null;const nd=nc.drawImage.bind(nc),wd=wc.drawImage.bind(wc);
    nc.drawImage=(img,...args)=>{if(img.dataset?.sourceTransform==='continuous-surface')nativeKind=img.constructor.name;return nd(img,...args);};
    wc.drawImage=(img,...args)=>{if(img.dataset?.sourceTransform==='continuous-surface')workerKind=img.constructor.name;return wd(img,...args);};
    BearlyHeroRig.draw(nc,160,250,200,1,options);let nativeAudit=BearlyHeroRig.audit();
    const firstKind=nativeKind,pendingAtFirst=BearlyHeroRig.cacheStats().pendingBitmaps,firstRgbaSha256=await hash(nc.getImageData(0,0,320,300).data),save=config.includePng&&((heading==='horizontal'&&phase===0)||(heading!=='horizontal'&&phase===.25)),nativeFirstPng=save?await png(native):null;
    if(config.settleNative){for(let attempt=0;attempt<80&&BearlyHeroRig.cacheStats().pendingBitmaps>0;attempt++)await new Promise(resolve=>setTimeout(resolve,10));nc.clearRect(0,0,320,300);BearlyHeroRig.draw(nc,160,250,200,1,options);nativeAudit=BearlyHeroRig.audit();}
    const pendingAfterSettle=BearlyHeroRig.cacheStats().pendingBitmaps;
    let actual=null;for(let attempt=0;attempt<30;attempt++){
      const c=worker.getContext('2d');c.clearRect(0,0,320,300);BearlyHeroRig.draw(c,160,250,200,1,{...options,centrumCache:true});actual=BearlyHeroRig.audit();
      if(actual.raster?.mode==='worker'&&actual.raster.renderedPhase===phase&&actual.raster.renderedWeight===1&&actual.raster.heading===motion.cacheKey)break;
      await new Promise(resolve=>setTimeout(resolve,25));
    }
    if(!actual?.raster||actual.raster.renderedPhase!==phase||actual.raster.renderedWeight!==1)throw Error('Exact worker laboratory pose unavailable '+heading+':'+phase);
    const a=native.getContext('2d').getImageData(0,0,320,300).data,b=worker.getContext('2d').getImageData(0,0,320,300).data;
    let differentChannels=0,differentPixels=0,maxChannelDelta=0,totalDelta=0,paintedPixels=0,maxAlphaDelta=0,totalAlphaDelta=0,maxPremultipliedDelta=0,opaquePixels=0,opaqueMaxRgbDelta=0;
    const mattes=[{name:'black',rgb:[0,0,0]},{name:'white',rgb:[255,255,255]},{name:'autumn-floor',rgb:[181,179,144]}].map(m=>({...m,maxDelta:0,totalDelta:0,channelsOver2:0}));
    for(let i=0;i<a.length;i+=4){let different=false;const aa=a[i+3],ab=b[i+3],painted=aa>0||ab>0,alphaDelta=Math.abs(aa-ab);if(painted)paintedPixels++;if(aa===255&&ab===255)opaquePixels++;
      maxAlphaDelta=Math.max(maxAlphaDelta,alphaDelta);totalAlphaDelta+=alphaDelta;
      for(let j=0;j<4;j++){const delta=Math.abs(a[i+j]-b[i+j]);if(delta){differentChannels++;different=true;}maxChannelDelta=Math.max(maxChannelDelta,delta);totalDelta+=delta;}
      for(let j=0;j<3;j++){if(aa===255&&ab===255)opaqueMaxRgbDelta=Math.max(opaqueMaxRgbDelta,Math.abs(a[i+j]-b[i+j]));const pa=Math.round(a[i+j]*aa/255),pb=Math.round(b[i+j]*ab/255);maxPremultipliedDelta=Math.max(maxPremultipliedDelta,Math.abs(pa-pb));
        for(const matte of mattes){const ca=Math.round(a[i+j]*aa/255+matte.rgb[j]*(1-aa/255)),cb=Math.round(b[i+j]*ab/255+matte.rgb[j]*(1-ab/255)),delta=Math.abs(ca-cb);matte.maxDelta=Math.max(matte.maxDelta,delta);matte.totalDelta+=delta;if(delta>2)matte.channelsOver2++;}}
      if(different)differentPixels++;
    }
    for(const matte of mattes)matte.meanPaintedChannelDelta=matte.totalDelta/Math.max(1,paintedPixels*3);
    const visibleWithin8BitTolerance=maxAlphaDelta<=2&&maxPremultipliedDelta<=2&&opaqueMaxRgbDelta<=2&&mattes.every(m=>m.maxDelta<=2);
    let maxGeometryDelta=0;const compare=(x,y)=>{if(typeof x==='number'&&typeof y==='number')maxGeometryDelta=Math.max(maxGeometryDelta,Math.abs(x-y));else if(x&&y&&typeof x==='object'&&typeof y==='object')for(const key of Object.keys(x))if(key in y)compare(x[key],y[key]);};
    for(const key of ['gait','body','landmarks','babyFace'])compare(nativeAudit[key],actual[key]);
    const pngs={};if(save){pngs['native-first']=nativeFirstPng;pngs['native-settled']=await png(native);pngs.worker=await png(worker);
      const difference=document.createElement('canvas');difference.width=320;difference.height=300;const dc=difference.getContext('2d'),pixels=dc.createImageData(320,300),matte=[181,179,144];
      for(let i=0;i<a.length;i+=4){for(let j=0;j<3;j++){const ca=Math.round(a[i+j]*a[i+3]/255+matte[j]*(1-a[i+3]/255)),cb=Math.round(b[i+j]*b[i+3]/255+matte[j]*(1-b[i+3]/255));pixels.data[i+j]=Math.min(255,Math.abs(ca-cb)*4);}pixels.data[i+3]=255;}
      dc.putImageData(pixels,0,0);pngs['autumn-matte-diff-x4']=await png(difference);}
    cases.push({heading,phase,firstKind,nativeKind,workerKind,pendingAtFirst,pendingAfterSettle,firstRgbaSha256,maxGeometryDelta,pngs,differentPixels,differentChannels,maxChannelDelta,meanAbsoluteChannelDelta:totalDelta/a.length,paintedPixels,opaquePixels,maxAlphaDelta,meanPaintedAlphaDelta:totalAlphaDelta/Math.max(1,paintedPixels),maxPremultipliedDelta,opaqueMaxRgbDelta,mattes,rawByteEqual:differentChannels===0,visibleWithin8BitTolerance,nativeRgbaSha256:await hash(a),workerRgbaSha256:await hash(b),baby:actual.babyFace,anatomy:actual.anatomy});
  }
  return{width:320,height:300,heightLogical:200,comparisonPolicy:{nativePath:config.settleNative?'ready cached ImageBitmap after pendingBitmaps settles':'first native draw (possibly Canvas before bitmap conversion)',rawRgbaEquality:'reported, not assumed across DOMCanvas and OffscreenCanvas bitmap paths',visible:'8-bit premultiplied RGB plus alpha, and source-over black/white/autumn-floor mattes',maxChannelTolerance:2,toleranceReason:'at most two 8-bit quantization steps for source tile bitmap transfer and raster snapshot; transparent RGB is not visible',scope:'backend raster equivalence only; does not certify anatomy or animation'},cases};
}"""


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--label',default='results',help='Evidence filename stem; preserve before/after measurements separately.')
    parser.add_argument('--out',type=Path,help='Evidence directory inside this project.')
    parser.add_argument('--require-worker',action='store_true',help='Require ready bounded worker and zero live main-thread body bakes.')
    parser.add_argument('--pixel-equivalence',action='store_true',help='After timing, compare source synchronous and worker raster pixels in a paused renderer lab.')
    args=parser.parse_args();assert args.label.replace('-','').replace('_','').isalnum()
    global OUT
    if args.out:
        OUT=args.out.resolve();assert OUT.is_relative_to(ROOT.resolve())
    OUT.mkdir(parents=True,exist_ok=True)
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    errors=[];console_errors=[];failed=[];result={'scope':'read-only Chromium Linux desktop profiling; source debug warp to stop, native E transfer and keyboard walking','conditions':{'platform':platform.platform(),'observedAtUtc':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'viewport':{'width':1280,'height':720},'deviceScaleFactor':1,'headless':True,'physicalDevice':False,'cpuThrottle':None,'sharedHost':True,'screenRecording':False,'instrumentation':'named main RAF/function timings and JSON clones; inclusive overlapping totals; not CPU trace or thermal benchmark'},'errors':errors,'consoleErrors':console_errors,'httpFailures':failed}
    result['runtimeHashes']={str(path.relative_to(ROOT)):hashlib.sha256(path.read_bytes()).hexdigest() for path in sorted((ROOT/'js').glob('*.js'))}
    result['runtimeHashes'].update({str(path.relative_to(ROOT)):hashlib.sha256(path.read_bytes()).hexdigest() for path in sorted((ROOT/'css').glob('*.css'))})
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        result['conditions']['browser']=browser.version
        context=browser.new_context(viewport={'width':1280,'height':720},device_scale_factor=1)
        context.add_init_script(INSTRUMENT);page=context.new_page()
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.on('console',lambda message:console_errors.append(message.text) if message.type=='error' else None)
        page.on('response',lambda response:failed.append({'status':response.status,'url':response.url}) if response.status>=400 else None)
        at=time.monotonic();page.goto(base+'/index.html',wait_until='domcontentloaded')
        page.wait_for_function('window.BearlyCentrumInventory?.audit().bound&&window.BEARLY_STARTUP?.().firstFrameAt!==null',timeout=90000)
        result['coldReadyWallSeconds']=time.monotonic()-at
        result['build']=page.evaluate('BEARLY_BUILD_ID')
        result['startup']=page.evaluate('BEARLY_STARTUP()')
        page.locator('#introStart').click();page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'")
        page.evaluate("__perfReview.install();__perfReview.phase='transfer-cold';BEARLY_DEBUG_MENU.warp(7550)")
        page.wait_for_timeout(200);at=time.monotonic();page.keyboard.press('e')
        page.wait_for_function("BearlyCentrumLink.audit().phase==='exploring'&&BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading",timeout=90000)
        result['transferToExplorationWallSeconds']=time.monotonic()-at
        if page.locator('.centrum-dialogue').is_visible():page.keyboard.press('Escape')
        result['beforeCaches']=page.evaluate('({hero:BearlyHeroRig.cacheStats(),worker:BearlyHeroRig.centrumCacheStats?.()||null,npc:BearlyNpcMotion.cacheStats(),world:BearlyWorld.cacheStats()})')
        result['movements']=[]
        phases=[('idle-warm',[],2200),('horizontal-right',['ArrowRight'],1800),('depth-up',['ArrowUp'],1000),('depth-down',['ArrowDown'],1000),('diagonal-right-up',['ArrowRight','ArrowUp'],1200),('diagonal-left-down',['ArrowLeft','ArrowDown'],1200),('idle-after-turns',[],1800)]
        for label,keys,ms in phases:
            page.evaluate('label=>__perfReview.phase=label',label)
            before=page.evaluate('BearlyCentrumSquare.position()')
            cache_before=page.evaluate('BearlyHeroRig.cacheStats()')
            worker_before=page.evaluate('BearlyHeroRig.centrumCacheStats?.()||null')
            for key in keys:page.keyboard.down(key)
            page.wait_for_timeout(ms)
            for key in keys:page.keyboard.up(key)
            after=page.evaluate('BearlyCentrumSquare.position()')
            result['movements'].append({'phase':label,'keys':keys,'requestedMs':ms,'before':before,'after':after,'heroCacheBefore':cache_before,'heroCacheAfter':page.evaluate('BearlyHeroRig.cacheStats()'),'workerCacheBefore':worker_before,'workerCacheAfter':page.evaluate('BearlyHeroRig.centrumCacheStats?.()||null'),'renderedPose':page.evaluate('BearlyHeroRig.audit().raster||null')})
        page.evaluate("__perfReview.phase='readout'")
        result['afterCaches']=page.evaluate('({hero:BearlyHeroRig.cacheStats(),worker:BearlyHeroRig.centrumCacheStats?.()||null,npc:BearlyNpcMotion.cacheStats(),world:BearlyWorld.cacheStats()})')
        result['stats']=page.evaluate('BEARLY_DEBUG_MENU.stats()')
        raw=page.evaluate('({frames:__perfReview.frames,calls:__perfReview.calls,maxPending:__perfReview.maxPending,pending:__perfReview.pending})')
        result['phases']=summarize(raw);result['maxPendingLoops']=raw['maxPending'];result['pendingLoops']=raw['pending']
        result['timingLimits']='Function/JSON wrappers add instrumentation cost. Inclusive timings overlap and must not be summed. Shared host/headless scheduling and cache cold-start stalls cannot be translated into phone frame rate.'
        hero=result['afterCaches']['hero'];npc=result['afterCaches']['npc']
        result['checks']={
            'noRuntimeErrors':not errors,'noConsoleErrors':not console_errors,'noHttpFailures':not failed,
            'oneMainLoop':raw['maxPending']==1 and raw['pending']==1,
            'heroCacheBounded':hero['bytes']<=hero['limitBytes'] and hero['frames']<=hero['frameLimit'],
            'npcCacheBounded':npc['bytes']<=npc['limitBytes'],
            'noNpcRebakesDuringWalk':npc['bakes']==result['beforeCaches']['npc']['bakes'],
            'allRequestedDirectionsMove':all(math.hypot(m['after']['x']-m['before']['x'],m['after']['y']-m['before']['y'])>20 for m in result['movements'] if m['keys']),
        }
        if args.require_worker:
            worker=result['afterCaches']['worker'] or {}
            result['checks'].update({'workerReady':bool(worker.get('ready')) and not worker.get('failure'),'workerQueueBounded':worker.get('maxPending',999)<=1 and worker.get('maxQueued',999)<=1,'noLiveMainBodyBakes':hero['buildMs']==result['beforeCaches']['hero']['buildMs']})
        if args.pixel_equivalence:
            page.evaluate("__perfReview.phase='pixel-lab'")
            page.keyboard.press('p')
            result['pixelEquivalence']=page.evaluate(PIXEL_EQUIVALENCE)
            result['pixelEquivalence']['scope']='Paused source renderer laboratory frames after timed gameplay; not in-game screenshots or additional artwork.'
            result['checks']['sourceWorkerVisiblePixelsEquivalent']=all(c['visibleWithin8BitTolerance'] for c in result['pixelEquivalence']['cases'])
        result['passed']=all(result['checks'].values())
        context.close();browser.close()
    finally:server.shutdown();server.server_close()
    (OUT/(args.label+'.json')).write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'passed':result['passed'],'coldReadyWallSeconds':result['coldReadyWallSeconds'],'transferToExplorationWallSeconds':result['transferToExplorationWallSeconds'],'phases':{k:{x:v for x,v in phase.items() if x!='functions'} for k,phase in result['phases'].items()}},indent=2))

    if not result['passed']:raise SystemExit(1)


if __name__=='__main__':main()
