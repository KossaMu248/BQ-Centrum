"""Stage11 comparative walking profile in disposable Chromium contexts.

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
import subprocess
from urllib.parse import urlsplit
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from centrum_performance_review import PIXEL_EQUIVALENCE

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'verification/stage11/performance'
BASELINE = '69ab19a79736eddb47a2988bb71787c538545cbc'
FROZEN = {}


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        name=urlsplit(self.path).path.lstrip('/') or 'index.html'
        if name in FROZEN:
            body=FROZEN[name];self.send_response(200)
            self.send_header('Content-Type', 'text/html' if name.endswith('.html') else 'text/css' if name.endswith('.css') else 'text/javascript')
            self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
        else:super().do_GET()


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


def main():
    global OUT
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out',type=Path,help='Evidence path within this project; preserve historical runs.')
    parser.add_argument('--label',default='results',help='Evidence filename stem; preserve before/after measurements separately.')
    parser.add_argument('--pixel-equivalence',action='store_true',help='After gameplay timings, compare identical source/worker raster pixels in a paused renderer lab.')
    parser.add_argument('--baseline',action='store_true',help='Serve tracked Stage10 runtime bytes from fixed target commit; target artwork remains local.')
    parser.add_argument('--touch',action='store_true',help='Chromium landscape touch emulation; not a physical phone.')
    args=parser.parse_args()
    if args.out:
        OUT=args.out.resolve()
        if not OUT.is_relative_to(ROOT):parser.error('--out must stay inside BQ-Centrum')
    if args.baseline:
        for folder,ext in [('js','js'),('css','css')]:
            for path in (ROOT/folder).glob('*.'+ext):
                name=str(path.relative_to(ROOT));r=subprocess.run(['git','show',BASELINE+':'+name],cwd=ROOT,capture_output=True)
                if r.returncode==0:FROZEN[name]=r.stdout
        for name in ['index.html','autumn-v19.html','autumn-version.json']:FROZEN[name]=subprocess.check_output(['git','show',BASELINE+':'+name],cwd=ROOT)
    assert args.label.replace('-','').replace('_','').isalnum()
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
        context=browser.new_context(viewport=({'width':844,'height':390} if args.touch else {'width':1280,'height':720}),device_scale_factor=1,has_touch=args.touch,is_mobile=args.touch)
        context.add_init_script(INSTRUMENT);page=context.new_page()
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.on('console',lambda message:console_errors.append(message.text) if message.type=='error' else None)
        page.on('response',lambda response:failed.append({'status':response.status,'url':response.url}) if response.status>=400 else None)
        at=time.monotonic();page.goto(base+'/index.html',wait_until='domcontentloaded')
        page.wait_for_function('window.BearlyCentrumInventory?.audit().bound&&window.BEARLY_STARTUP?.().firstFrameAt!==null',timeout=90000)
        result['coldReadyWallSeconds']=time.monotonic()-at
        result['build']=page.evaluate('BEARLY_BUILD_ID')
        result['conditions']['touchEmulation']=args.touch
        result['conditions']['viewport']=page.viewport_size
        result['baselineCommit']=BASELINE if args.baseline else None
        result['servedRuntimeHashes']={name:hashlib.sha256(body).hexdigest() for name,body in FROZEN.items()}
        result['startup']=page.evaluate('BEARLY_STARTUP()')
        page.locator('#introStart').click();page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'")
        page.evaluate("__perfReview.install();__perfReview.phase='transfer-cold';BEARLY_DEBUG_MENU.warp(7550)")
        page.wait_for_timeout(200);at=time.monotonic();page.keyboard.press('e')
        page.wait_for_function("BearlyCentrumLink.audit().phase==='exploring'&&BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading",timeout=90000)
        result['transferToExplorationWallSeconds']=time.monotonic()-at
        if page.locator('.centrum-dialogue').is_visible():page.keyboard.press('Escape')
        result['beforeCaches']=page.evaluate('({hero:BearlyHeroRig.cacheStats(),npc:BearlyNpcMotion.cacheStats(),world:BearlyWorld.cacheStats(),worker:BearlyHeroRig.centrumCacheStats?.()||null})')
        result['movements']=[]
        phases=[('idle-warm',[],2200),('horizontal-right',['ArrowRight'],1800),('depth-up',['ArrowUp'],1000),('depth-down',['ArrowDown'],1000),('diagonal-right-up',['ArrowRight','ArrowUp'],1200),('diagonal-left-down',['ArrowLeft','ArrowDown'],1200),('idle-after-turns',[],1800)]
        for label,keys,ms in phases:
            page.evaluate('label=>__perfReview.phase=label',label)
            before=page.evaluate('BearlyCentrumSquare.position()')
            cache_before=page.evaluate('BearlyHeroRig.cacheStats()')
            for key in keys:page.keyboard.down(key)
            page.wait_for_timeout(ms)
            for key in keys:page.keyboard.up(key)
            after=page.evaluate('BearlyCentrumSquare.position()')
            pose_review=page.evaluate('({selected:BearlyCentrumSquare.audit().view||"side",painted:BearlyHeroRig.audit().view||"side",authored:!!BearlyHeroRig.audit().authoredView,directional:window.BearlyCentrumDirectionalRig?.stats()||null})')
            result['movements'].append({'poseReview':pose_review,'phase':label,'keys':keys,'requestedMs':ms,'before':before,'after':after,'heroCacheBefore':cache_before,'heroCacheAfter':page.evaluate('BearlyHeroRig.cacheStats()')})
        page.evaluate("__perfReview.phase='readout'")
        result['afterCaches']=page.evaluate('({hero:BearlyHeroRig.cacheStats(),npc:BearlyNpcMotion.cacheStats(),world:BearlyWorld.cacheStats(),worker:BearlyHeroRig.centrumCacheStats?.()||null})')
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
            'workerQueueBounded':not result['afterCaches']['worker'] or (result['afterCaches']['worker']['maxPending']<=1 and result['afterCaches']['worker']['maxQueued']<=1),
            'noNpcRebakesDuringWalk':npc['bakes']==result['beforeCaches']['npc']['bakes'],
            'allRequestedDirectionsMove':all(math.hypot(m['after']['x']-m['before']['x'],m['after']['y']-m['before']['y'])>20 for m in result['movements'] if m['keys']),
        }
        if not args.baseline and page.evaluate('!!window.BearlyCentrumDirectionalRig'):
            result['directional']=page.evaluate('BearlyCentrumDirectionalRig.stats()')
            result['checks']['actualAuthoredAngles']=all(m['poseReview']['authored'] and m['poseReview']['painted']==('away' if m['phase'] in ['depth-up','diagonal-right-up'] else 'toward') for m in result['movements'] if m['phase'] in ['depth-up','depth-down','diagonal-right-up','diagonal-left-down'])
        if not args.baseline:
            worker=result['afterCaches']['worker'] or {}
            result['checks'].update({'workerReady':bool(worker.get('ready')) and not worker.get('failure'),'noLiveMainBodyBakes':hero['buildMs']==result['beforeCaches']['hero']['buildMs']})
        if args.pixel_equivalence:
            page.evaluate("__perfReview.phase='pixel-lab'");page.keyboard.press('p')
            result['pixelEquivalence']=page.evaluate(PIXEL_EQUIVALENCE)
            result['pixelEquivalence']['scope']='Paused renderer laboratory after timed gameplay; not gameplay screenshots.'
            result['checks']['sourceWorkerPixelsEqual']=all(c['differentChannels']==0 for c in result['pixelEquivalence']['cases'])
        result['passed']=all(result['checks'].values())
        context.close();browser.close()
    finally:server.shutdown();server.server_close()
    (OUT/(args.label+'.json')).write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'passed':result['passed'],'coldReadyWallSeconds':result['coldReadyWallSeconds'],'transferToExplorationWallSeconds':result['transferToExplorationWallSeconds'],'phases':{k:{x:v for x,v in phase.items() if x!='functions'} for k,phase in result['phases'].items()}},indent=2))

    if not result['passed']:raise SystemExit(1)


if __name__=='__main__':main()
