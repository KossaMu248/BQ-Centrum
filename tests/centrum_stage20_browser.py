"""Stage20 actual walking timings and control/collision acceptance.

Each fresh context uses one disclosed original route-stop helper, followed by
native movement/parking/dismount controls. Simulation-time timings observe the
actual production update; wall time is reported separately, not a device FPS
claim. Chromium CDP touch emulation is not physical-phone/Safari testing.
"""
import argparse,functools,hashlib,json,math,statistics,traceback,subprocess
from pathlib import Path
from http.server import ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
from centrum_economy_browser import Quiet,wait_ready,wait_exploration,close_dialogue,walk_to,use_exit,sq
from centrum_stage16_browser import PROBE as LEGACY_PROBE,warp_setup,dismount,remount_source,route,source,bag,tap,hashes
from centrum_standalone import INSTRUMENT,metrics

ROOT=Path(__file__).resolve().parents[1]
BASELINE='5af70787eff81586dcbf67bc25b208fb7a63d8a5'
PROBE=r'''(()=>{
 const q=window.__move20={squareTime:0,streetTime:0,record:false,samples:[],keys:new Set(),pointers:new Set()};
 addEventListener('keydown',e=>{if(e.key.startsWith('Arrow'))q.keys.add(e.key);},true);
 addEventListener('keyup',e=>q.keys.delete(e.key),true);
 addEventListener('pointerdown',e=>{if(e.target.closest?.('[data-square-dir],[data-direction],[data-depth]'))q.pointers.add(e.pointerId);},true);
 for(const event of ['pointerup','pointercancel'])addEventListener(event,e=>q.pointers.delete(e.pointerId),true);
 let square,visits;
 const sample=(kind,dt)=>{if(!q.record||q.mode!==kind)return;let s;
  if(kind==='square'){s=square.audit();if(!s.active||s.loading||s.paused||s.menuHold||s.mapOpen||s.transition)return;q.squareTime+=Math.min(.05,Math.max(0,dt||0));}
  else{s=visits.audit();if(s.mode!=='street'||s.transition||s.paused)return;q.streetTime=s.combat.time;}
  q.samples.push({t:kind==='square'?q.squareTime:q.streetTime,w:performance.now(),held:q.keys.size+q.pointers.size,x:s.x,y:kind==='square'?s.y:s.depth,vx:kind==='square'?s.vx:s.velocity,vy:kind==='square'?s.vy:null,stride:s.stride??null,hits:s.hits||[]});
 };
 Object.defineProperty(window,'BearlyCentrumSquare',{configurable:true,get:()=>square,set:v=>{square=v;const update=v.update;v.update=function(...args){const r=update.apply(this,args);sample('square',args[0]);return r;};}});
 Object.defineProperty(window,'BearlyVisits',{configurable:true,get:()=>visits,set:v=>{visits=v;const update=v.update;v.update=function(...args){const r=update.apply(this,args);sample('street',args[0]?.dt);return r;};}});
})();'''

def location(page,mode):
 s=sq(page) if mode=='square' else source(page)
 return {'x':s['x'],'y':s['y'] if mode=='square' else s['depth'],'vx':s.get('vx',s.get('velocity')),'vy':s.get('vy'),
         'scene':s.get('sceneId',s.get('mode')),'health':route(page)['health'],'hits':s.get('hits',[])}

def held(page,mode,keys,touch,ms,callback=None):
 session=None
 if touch:
  session=page.context.new_cdp_session(page);points=[]
  for key in keys:
   direction={'ArrowRight':'right','ArrowLeft':'left','ArrowUp':'up','ArrowDown':'down'}[key]
   selector=f'[data-square-dir="{direction}"]' if mode=='square' else ('[data-direction="'+('1' if key=='ArrowRight' else '-1')+'"]' if key in ['ArrowRight','ArrowLeft'] else '[data-depth="'+('-1' if key=='ArrowUp' else '1')+'"]')
   box=page.locator(selector).bounding_box();assert box,selector
   points.append({'id':len(points),'x':box['x']+box['width']/2,'y':box['y']+box['height']/2})
  session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':points})
 else:
  for key in keys:page.keyboard.down(key)
 try:
  page.wait_for_timeout(ms)
  if callback:return callback()
 finally:
  if touch:session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});session.detach()
  else:
   for key in keys:page.keyboard.up(key)

def measure(page,mode,keys,touch,ms):
 page.wait_for_timeout(240);before=location(page,mode)
 page.evaluate('mode=>{__move20.samples=[];__move20.mode=mode;__move20.record=true}',mode)
 held(page,mode,keys,touch,ms)
 data=page.evaluate('__move20.record=false;__move20.samples');assert len(data)>3
 after=location(page,mode);page.wait_for_timeout(230);stopped=location(page,mode)
 active=[s for s in data if s.get('held',0)>=len(keys)];assert active,('no actual held input observed',keys)
 active_start=active[0]['t']
 pairs=[(a,b) for a,b in zip(data,data[1:]) if b['t']>a['t'] and a.get('held',0)>=len(keys) and b.get('held',0)>=len(keys) and b['t']-active_start>.15]
 assert pairs
 vx=[(b['x']-a['x'])/(b['t']-a['t']) for a,b in pairs];vy=[(b['y']-a['y'])/(b['t']-a['t']) for a,b in pairs]
 result={'keys':keys,'heldWallRequestedMs':ms,'sampleCount':len(data),'simulationSeconds':data[-1]['t']-data[0]['t'],
  'wallSeconds':(data[-1]['w']-data[0]['w'])/1000,'actualHeldSimSeconds':active[-1]['t']-active[0]['t'],'before':before,'afterHeld':after,'afterRelease':stopped,
  'medianSteadyVx':statistics.median(vx),'medianSteadyVy':statistics.median(vy),
  'projectedLogicalVx':statistics.median(vx)*(.75 if mode=='square' else 1),
  'projectedLogicalVy':statistics.median(vy)*(.75 if mode=='square' else 1),
  'releaseTravel':math.hypot(stopped['x']-after['x'],stopped['y']-after['y']),
  'hits':sorted({h for p in data for h in p['hits']})}
 assert before['health']==after['health']==stopped['health']
 assert abs(stopped['vx'])<.1,(keys,stopped)
 if mode=='square':assert abs(stopped['vy'])<.1
 return result

def scenario(browser,base,touch,mode,phase,result):
 label=('touch' if touch else 'desktop')+'-'+mode
 context=browser.new_context(viewport={'width':844 if touch else 1280,'height':390 if touch else 720},is_mobile=touch,has_touch=touch,device_scale_factor=1)
 if phase=='before':
  from urllib.parse import urlparse
  baseline_files={}
  for name in ['index.html','autumn-version.json']+[p.relative_to(ROOT).as_posix() for p in ROOT.glob('js/*.js')]:
   old=subprocess.run(['git','show',BASELINE+':'+name],cwd=ROOT,capture_output=True)
   if old.returncode==0:baseline_files[name]=old.stdout
  def original(request_route):
   name=urlparse(request_route.request.url).path.lstrip('/')
   if name in baseline_files:request_route.fulfill(body=baseline_files[name],content_type='text/html' if name.endswith('.html') else 'application/json' if name.endswith('.json') else 'text/javascript')
   else:request_route.continue_()
  context.route('**/*',original)
 context.add_init_script(INSTRUMENT);context.add_init_script(LEGACY_PROBE);context.add_init_script(PROBE)
 page=context.new_page();page.on('pageerror',lambda e:result['errors'].append(str(e)));page.on('console',lambda e:result['consoleErrors'].append(e.text) if e.type=='error' else None);page.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
 page.goto(base+'/index.html');wait_ready(page)
 page.locator('#introStart').tap() if touch else page.locator('#introStart').click()
 page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'");page.wait_for_timeout(200)
 if mode=='street':warp_setup(page,1600);dismount(page,touch)
 else:
  page.evaluate('BEARLY_DEBUG_MENU.warp(7550)');page.wait_for_timeout(300)
  if touch:page.locator('#centrumRouteEntryBtn').wait_for(state='visible');page.locator('#centrumRouteEntryBtn').tap()
  else:page.keyboard.press('e')
  wait_exploration(page);close_dialogue(page)
 health=route(page)['health'];parked=page.evaluate('BearlyCentrumLink.audit().parking') if mode=='square' else source(page)['parkedAt']
 measurements=[]
 duration=650 if mode=='square' else 700
 for keys,ms in [(['ArrowRight'],duration),(['ArrowLeft'],duration),(['ArrowUp'],650 if mode=='square' else 350),(['ArrowDown'],650 if mode=='square' else 350),(['ArrowRight','ArrowUp'],450 if mode=='square' else 300),(['ArrowLeft','ArrowDown'],450 if mode=='square' else 300)]:
  measurements.append(measure(page,mode,keys,touch,ms))
 for m in measurements:assert not m['hits'],(label,m)
 assert measurements[0]['medianSteadyVx']>20 and measurements[1]['medianSteadyVx']<-20
 assert measurements[2]['medianSteadyVy']<-10 and measurements[3]['medianSteadyVy']>10
 assert measurements[4]['medianSteadyVx']>10 and measurements[4]['medianSteadyVy']<-10
 assert measurements[5]['medianSteadyVx']<-10 and measurements[5]['medianSteadyVy']>10
 extra={}
 if phase=='after':
  bag(page,touch)
  pause='#squarePauseBtn' if mode=='square' else '#mobilePauseBtn';tap(page,pause,'p',touch);paused=location(page,mode);held(page,mode,['ArrowRight'],touch,200);assert location(page,mode)['x']==paused['x'];tap(page,pause,'p',touch)
  if mode=='square':
   walk_to(page,{'x':500,'y':525},touch);blocked=held(page,mode,['ArrowDown'],touch,1100,lambda:sq(page))
   assert blocked['y']<=544.2 and 'bench-west' in blocked['hits'],{k:blocked[k] for k in ['x','y','vx','vy','hits']}
   extra['collision']={k:blocked[k] for k in ['x','y','hits']}
   walk_to(page,{'x':340,'y':420},touch);use_exit(page,'shopping-arcade',touch);assert sq(page)['sceneId']=='shopping-arcade';use_exit(page,'metro-square',touch)
   extra['doorReturn']={'scene':sq(page)['sceneId'],'entranceId':sq(page)['entranceId']}
  extra['healthAfterControls']=route(page)['health'];assert extra['healthAfterControls']==health
 if mode=='street':remounted=remount_source(page,touch)
 else:
  tap(page,'.square-exit','q',touch);page.wait_for_function("BearlyCentrumLink.audit().phase==='riding'&&!BearlyCentrumSquare.active()",timeout=90000);remounted=route(page)
 assert remounted['health']==health and remounted['grounded'] and remounted['babyMounted']
 m=metrics(page);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
 result['checks'].append({'name':label,'passed':True,'setup':'one original route stop; no later teleport/state grant','measurements':measurements,'extra':extra,'health':health,'parked':parked,'return':{'x':remounted['x'],'health':remounted['health'],'grounded':remounted['grounded'],'babyMounted':remounted['babyMounted']},'pendingRAF':m['pending'],'maxPendingRAF':m['maxPending']})
 context.close()

def main():
 a=argparse.ArgumentParser();a.add_argument('--phase',choices=['before','after'],required=True);a.add_argument('--out',default='verification/stage20/browser');a.add_argument('--platform',choices=['both','desktop','touch'],default='both');args=a.parse_args()
 out=(ROOT/args.out/args.phase).resolve();assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
 result={'scope':__doc__,'phase':args.phase,'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'runtimeHashes':hashes(),'conditions':{'headless':True,'physicalDevice':False,'desktop':[1280,720],'CDPTouch':[844,390],'deviceScaleFactor':1,'noVideoOrScreenshot':True,'timing':'Observed production update simulation time, wall times separate; not FPS measurement'},'checks':[],'errors':[],'consoleErrors':[],'httpFailures':[]}
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);result['browser']=browser.version
   for touch in ([False,True] if args.platform=='both' else [args.platform=='touch']):
    for mode in ['street','square']:scenario(browser,f'http://127.0.0.1:{server.server_port}',touch,mode,args.phase,result)
   browser.close()
  result['runtimeHashesAfter']=hashes();result['changedRuntimeFiles']=[n for n,h in result['runtimeHashes'].items() if result['runtimeHashesAfter'].get(n)!=h]
  if args.phase=='after':assert not result['changedRuntimeFiles']
  else:result['baselineSource']={'commit':BASELINE,'mode':'Read-only Git HTML/JS/manifest fulfil; concurrent target edits do not change served baseline. Original assets unchanged.'}
  assert not result['errors'] and not result['consoleErrors'] and not result['httpFailures'];result['passed']=True
 except BaseException as error:result['passed']=False;result['failure']=repr(error);result['traceback']=traceback.format_exc();raise
 finally:server.shutdown();(out/'results.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
 print('PASS',args.phase,len(result['checks']),'actual movement contexts; no captures',flush=True)

if __name__=='__main__':main()
