"""Exclusive mode/actor profile; not physical-phone or animation acceptance.

Baseline serves every target JS/CSS/HTML/manifest byte from the pinned target
commit, while unchanged local assets are shared. Disclosed debug warps shorten
travel and god mode isolates rendering without granting health or inventory.
All dismount/remount/parking and movement use native keyboard actions. Inclusive
function wrappers overlap; never sum them or read encoded-video FPS into this run.
"""
import argparse,functools,hashlib,json,platform,subprocess,time
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
from centrum_walk_performance import summarize

ROOT=Path(__file__).resolve().parents[1]
BASE='ffec905bf71296b63f2d38fab74a3ac20e2c3875'
FROZEN={}
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
 def do_GET(self):
  name=urlsplit(self.path).path.lstrip('/') or 'index.html'
  if name in FROZEN:
   data=FROZEN[name];self.send_response(200);self.send_header('Content-Type','text/html' if name.endswith('.html') else 'text/css' if name.endswith('.css') else 'application/json' if name.endswith('.json') else 'text/javascript');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
  else:super().do_GET()
INSTRUMENT=r'''(()=>{
 const q=window.__modePerf={phase:'startup',frames:[],calls:{},pending:0,maxPending:0};
 const raf=requestAnimationFrame.bind(window);let previous=null;
 const record=(name,elapsed)=>{const key=q.phase+'::'+name;let d=q.calls[key];if(!d)d=q.calls[key]={n:0,total:0,max:0,samples:[],bytes:0};d.n++;d.total+=elapsed;d.max=Math.max(d.max,elapsed);if(d.samples.length<10000)d.samples.push(elapsed);};
 const wrap=(object,method,name)=>{const fn=object?.[method];if(typeof fn!=='function'||fn.__modeWrapped)return;const replacement=function(...args){const at=performance.now();try{return fn.apply(this,args);}finally{record(name||method,performance.now()-at);}};replacement.__modeWrapped=true;object[method]=replacement;};
 window.requestAnimationFrame=function(fn){if(fn.name!=='loop')return raf(fn);q.pending++;q.maxPending=Math.max(q.maxPending,q.pending);return raf(t=>{q.pending--;const start=performance.now(),phase=q.phase;try{return fn(t);}finally{q.frames.push({phase,at:t,interval:previous===null?null:t-previous,cpu:performance.now()-start});previous=t;}});};
 let brawler;Object.defineProperty(window,'BearlyBrawler',{configurable:true,get:()=>brawler,set:obj=>{brawler=obj;const create=obj.create;obj.create=function(...args){const sim=create.apply(this,args);for(const m of ['enter','update','snapshot'])wrap(sim,m,'Brawler.'+m);return sim;};}});
 q.install=()=>{const targets={BearlyWorld:['sky','backstreet','road','foreground'],BearlyHeroRig:['draw'],BearlyNpcMotion:['draw'],BearlyKids:['draw'],BearlyBrawlArt:['adult','overlay'],BearlyStreetLife:['seeds','drawProp','caption','react'],BearlyVisits:['update','roadPresentation','render','overlay','audit'],BearlyCentrumSquare:['update','render'],BearlyCentrumInventory:['update'],BearlyCentrumEconomy:['update','context','snapshot']};for(const [group,methods]of Object.entries(targets))for(const name of methods)wrap(window[group],name,group+'.'+name);for(const name of ['parse','stringify'])wrap(JSON,name,'JSON.'+name);};
})();'''
CACHE=r'''()=>({hero:BearlyHeroRig.cacheStats(),worker:BearlyHeroRig.centrumCacheStats?.(),npc:BearlyNpcMotion.cacheStats(),world:BearlyWorld.cacheStats(),visits:BearlyVisits.audit(),square:BearlyCentrumSquare.audit(),startup:BEARLY_STARTUP()})'''

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--baseline',action='store_true');p.add_argument('--overlay-file',action='append',default=[],help='Use disclosed current target file over the frozen target baseline.');p.add_argument('--touch',action='store_true');p.add_argument('--cpu',type=float,default=1);p.add_argument('--label',default='results');p.add_argument('--out',type=Path,default=Path('verification/stage16/performance'));a=p.parse_args();out=(ROOT/a.out).resolve();assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
 if a.baseline:
  names=subprocess.check_output(['git','ls-tree','-r','--name-only',BASE],text=True,cwd=ROOT).splitlines()
  for name in names:
   if name.startswith(('js/','css/')) and name.endswith(('.js','.css')) or name in ['index.html','autumn-v19.html','autumn-version.json']:FROZEN[name]=subprocess.check_output(['git','show',BASE+':'+name],cwd=ROOT)
 for name in a.overlay_file:
  target=(ROOT/name).resolve();assert a.baseline and target.is_relative_to(ROOT) and name in FROZEN;FROZEN[name]=target.read_bytes()
 r={'scope':__doc__,'conditions':{'atUtc':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'platform':platform.platform(),'headless':True,'physicalDevice':False,'touchEmulation':a.touch,'cpuThrottle':a.cpu,'screenRecording':False,'instrumentation':'Named function/main RAF wrappers, inclusive/overlapping timings; shared host, no physical-mobile guarantee','godModeForRenderingIsolation':True,'debugWarpSetup':True},'baselineCommit':BASE if a.baseline else None,'overlayFiles':a.overlay_file,'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'instrumentationSHA256':hashlib.sha256(INSTRUMENT.encode()).hexdigest(),'runtimeHashes':{name:hashlib.sha256(data).hexdigest() for name,data in FROZEN.items()} if a.baseline else {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [*sorted((ROOT/'js').glob('*.js')),*sorted((ROOT/'css').glob('*.css')),*[ROOT/x for x in ['index.html','autumn-v19.html','autumn-version.json']]]},'errors':[],'consoleErrors':[],'httpFailures':[],'phases':{},'snapshots':{},'movements':[]}
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);context=browser.new_context(viewport={'width':844,'height':390} if a.touch else {'width':1280,'height':720},device_scale_factor=1,has_touch=a.touch,is_mobile=a.touch);context.add_init_script(INSTRUMENT);page=context.new_page();page.on('pageerror',lambda e:r['errors'].append(str(e)));page.on('console',lambda m:r['consoleErrors'].append(m.text) if m.type=='error' else None);page.on('response',lambda x:r['httpFailures'].append({'status':x.status,'url':x.url}) if x.status>=400 else None)
   if a.cpu!=1:context.new_cdp_session(page).send('Emulation.setCPUThrottlingRate',{'rate':a.cpu})
   r['conditions'].update({'browser':browser.version,'viewport':page.viewport_size});at=time.monotonic();page.goto(f'http://127.0.0.1:{server.server_port}/index.html');page.wait_for_function('window.BearlyCentrumInventory?.audit().bound&&window.BEARLY_STARTUP?.().firstFrameAt!==null',timeout=90000);r['startupWallSeconds']=time.monotonic()-at;r['build']=page.evaluate('BEARLY_BUILD_ID');page.evaluate('__modePerf.install()');page.locator('#introStart').click();page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'");page.evaluate('BEARLY_DEBUG_MENU.settings.godMode=true;BEARLY_DEBUG_MENU.warp(2720)')
   def phase(name,ms=2200,keys=()):
    page.evaluate('x=>__modePerf.phase=x',name);before=page.evaluate(CACHE)
    for key in keys:page.keyboard.down(key)
    page.wait_for_timeout(ms)
    for key in keys:page.keyboard.up(key)
    after=page.evaluate(CACHE);r['snapshots'][name]={'before':before,'after':after}
    if keys:r['movements'].append({'name':name,'keys':keys,'beforeX':before['visits']['x'],'afterX':after['visits']['x'],'beforeDepth':before['visits']['depth'],'afterDepth':after['visits']['depth']})
   phase('ride-idle',2500);phase('ride-pedal',2200,['ArrowUp']);page.evaluate('BEARLY_DEBUG_MENU.warp(2720)');page.wait_for_timeout(180);page.evaluate("__modePerf.phase='street-cold-transfer'");at=time.monotonic();page.keyboard.press('q');page.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition",timeout=90000);r['sourceStreetEntryWallSeconds']=time.monotonic()-at
   phase('street-idle',2200);phase('street-walk-right-cold',2200,['ArrowRight']);phase('street-walk-left-warm',2200,['ArrowLeft']);page.evaluate("__modePerf.phase='street-start-stop'");r['snapshots']['street-start-stop']={'before':page.evaluate(CACHE)}
   for _ in range(7):page.keyboard.down('ArrowRight');page.wait_for_timeout(180);page.keyboard.up('ArrowRight');page.wait_for_timeout(210)
   r['snapshots']['street-start-stop']['after']=page.evaluate(CACHE);phase('street-depth-up',900,['ArrowUp']);phase('street-depth-down',900,['ArrowDown']);phase('street-after-warm',1800)
   page.evaluate("__modePerf.phase='source-remount'");page.keyboard.press('q');page.wait_for_function('!BearlyVisits.active()',timeout=45000);page.evaluate('BEARLY_DEBUG_MENU.warp(7550)');page.wait_for_timeout(150);page.evaluate("__modePerf.phase='centrum-cold-transfer'");at=time.monotonic();page.keyboard.press('e');page.wait_for_function("BearlyCentrumLink.audit().phase==='exploring'&&BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading",timeout=90000);r['centrumEntryWallSeconds']=time.monotonic()-at
   if page.locator('.centrum-dialogue').is_visible():page.keyboard.press('Escape')
   phase('centrum-idle',1800);phase('centrum-side-walk',1700,['ArrowRight']);phase('centrum-away-walk',800,['ArrowUp']);phase('centrum-toward-walk',800,['ArrowDown']);phase('centrum-rest',1200)
   raw=page.evaluate('({frames:__modePerf.frames,calls:__modePerf.calls,maxPending:__modePerf.maxPending,pending:__modePerf.pending})');r['phases']=summarize(raw);r['maxPendingLoops']=raw['maxPending'];r['pendingLoops']=raw['pending'];r['checks']={'noRuntimeErrors':not r['errors'],'noConsoleErrors':not r['consoleErrors'],'noHttpFailures':not r['httpFailures'],'oneLoop':raw['maxPending']==raw['pending']==1};r['passed']=all(r['checks'].values());context.close();browser.close()
 finally:
  server.shutdown();server.server_close();(out/(a.label+'.json')).write_text(json.dumps(r,indent=2)+'\n')
 print(json.dumps({'passed':r.get('passed'),'sourceStreetEntryWallSeconds':r.get('sourceStreetEntryWallSeconds'),'centrumEntryWallSeconds':r.get('centrumEntryWallSeconds'),'phases':{k:{x:v for x,v in p.items() if x!='functions'} for k,p in r['phases'].items()}},indent=2))
 if not r.get('passed'):raise SystemExit(1)
if __name__=='__main__':main()
