"""Stage21 real wider-view gameplay checks.

Fresh contexts use one disclosed original route-stop helper, followed only by
native movement/parking/dismount/menu/interaction controls. The authored gang
combat group similarly uses one route-stop setup, then native proximity/J.
Read-only Stage20 Git fulfil supplies comparison frames; no donor is accessed.
Chromium CDP phone emulation is not physical-phone or Safari testing. Native
screencast timing is preserved; encoding rate is not a game-FPS claim.
"""
import argparse,functools,hashlib,json,math,traceback,subprocess
from pathlib import Path
from http.server import ThreadingHTTPServer
from threading import Thread
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
from centrum_economy_browser import Quiet,wait_ready,wait_exploration,close_dialogue,walk_to,use_exit,sq
from centrum_stage16_browser import PROBE,warp_setup,route,source,bag,tap,hashes,Recording,street_move,hold
from centrum_stage20_browser import held,measure,PROBE as MOVE_PROBE
from centrum_standalone import INSTRUMENT,metrics
ROOT=Path(__file__).resolve().parents[1]
BASELINE='246e0eb7d9ce0dc8af2d594a8a67b40b94cf92fe'

def start(p,touch):
 p.locator('#introStart').tap() if touch else p.locator('#introStart').click()
 p.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'");p.wait_for_timeout(200)

def dismount(p,touch):
 tap(p,'.dismount-button','q',touch)
 p.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition",timeout=90000)
 p.wait_for_timeout(200)

def remount(p,touch):
 tap(p,'.area-exit','q',touch);p.wait_for_function('!BearlyVisits.active()',timeout=90000);p.wait_for_timeout(160)
 r=route(p);assert r['grounded'] and r['babyMounted'];return r

def context(browser,base,touch,result,phase):
 c=browser.new_context(viewport={'width':844 if touch else 1280,'height':390 if touch else 720},is_mobile=touch,has_touch=touch,device_scale_factor=1)
 if phase=='before':
  baseline={}
  for n in ['index.html','autumn-version.json']+[p.relative_to(ROOT).as_posix() for p in ROOT.glob('js/*.js')]:
   old=subprocess.run(['git','show',BASELINE+':'+n],cwd=ROOT,capture_output=True)
   if old.returncode==0:baseline[n]=old.stdout
  def original(r):
   n=urlparse(r.request.url).path.lstrip('/')
   if n in baseline:r.fulfill(body=baseline[n],content_type='text/html' if n.endswith('.html') else 'application/json' if n.endswith('.json') else 'text/javascript')
   else:r.continue_()
  c.route('**/*',original)
 for script in [INSTRUMENT,PROBE,MOVE_PROBE]:c.add_init_script(script)
 p=c.new_page();p.on('pageerror',lambda e:result['errors'].append(str(e)))
 p.on('console',lambda e:result['consoleErrors'].append(e.text) if e.type=='error' else None)
 p.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
 p.goto(base+'/index.html');wait_ready(p);start(p,touch);return c,p

def projection(p,mode,expected):
 s=sq(p) if mode=='square' else source(p)
 h=s['hero'];q=p.evaluate('__stage16QA');hero=q['hero'];a=hero['m'];backing=hero['w']/1160
 actual=math.hypot(a['a'],a['b'])/backing
 assert math.isclose(actual,expected,abs_tol=1e-6),(mode,expected,hero)
 native_height=200 if mode=='square' else 145
 assert h['height']==native_height
 b=h['babyFace'];assert b['continuousUpperBody'] and b['originalCollar'] and not b['headOnly']
 if h['pose']=='walking':
  native_scale=(78/61*native_height/507) if h['carrier']=='back' else (85/61*native_height/488)
  assert math.isclose(b['uniformScale'],native_scale,abs_tol=1e-9)
 else:assert b['uniformScale']>0  # Original action-specific stature/head calibration.
 head=p.evaluate("""mode=>{const s=mode==='square'?BearlyCentrumSquare.audit():BearlyVisits.audit(),h=s.hero.babyFace,q=__stage16QA.baby,c=document.getElementById('game'),r=c.getBoundingClientRect(),fit=getComputedStyle(c).objectFit,f=fit==='cover'?Math.max(r.width/c.width,r.height/c.height):Math.min(r.width/c.width,r.height/c.height),[x,y,w,z]=h.head,[px,py]=h.pivot,m=q.m,pts=[[x-px,y-py],[x+w-px,y-py],[x-px,y+z-py],[x+w-px,y+z-py]].map(([a,b])=>({x:(m.a*a+m.c*b+m.e)*f,y:(m.b*a+m.d*b+m.f)*f}));return {width:Math.max(...pts.map(p=>p.x))-Math.min(...pts.map(p=>p.x)),height:Math.max(...pts.map(p=>p.y))-Math.min(...pts.map(p=>p.y)),source:q.source,sourceRect:h.head,canvas:r.toJSON(),objectFit:fit};}""",mode)
 return {'uniformZoom':actual,'nativeHeight':native_height,'projectedLogicalHeight':native_height*actual,'carrier':h.get('carrier'),'babyNativeScale':b['uniformScale'],'babySource':b.get('source'),'babyExpression':b.get('expression'),'babyHeadCss':head,'view':s.get('view'),'face':s.get('face'),'x':s['x'],'y':s['y'] if mode=='square' else s['depth'],'health':route(p)['health']}

def capture(p,out,name,result,mode,expected):
 pth=out/(name+'.jpg');pth.parent.mkdir(parents=True,exist_ok=True);p.screenshot(path=str(pth),type='jpeg',quality=78)
 info=projection(p,mode,expected);result['captures'].append({'file':pth.relative_to(out).as_posix(),'sha256':hashlib.sha256(pth.read_bytes()).hexdigest(),'actualGameplay':True,'projection':info});return info

def scenario(browser,base,touch,out,result,args,mode):
 label=('phone' if touch else 'desktop')+'-'+mode;c,p=context(browser,base,touch,result,args.phase)
 expected=(.75 if mode=='square' else 1) if args.phase=='before' else (args.zoom if mode=='square' else args.route_zoom)
 warp_setup(p,7550 if mode=='square' else 1600)
 if mode=='square':tap(p,'#centrumRouteEntryBtn','e',touch);wait_exploration(p);close_dialogue(p)
 else:dismount(p,touch)
 parked=p.evaluate('BearlyCentrumLink.audit().parking') if mode=='square' else source(p)['parkedAt'];hp=route(p)['health']
 initial=capture(p,out,label+'/initial',result,mode,expected)
 rec=Recording(p,out,label+'-walking') if args.clip and args.phase=='after' and mode=='square' and not touch else None
 measurements=[]
 for keys,ms in [(['ArrowRight'],650),(['ArrowLeft'],650),(['ArrowUp'],700 if mode=='square' else 300),(['ArrowDown'],700 if mode=='square' else 300),(['ArrowRight','ArrowUp'],450 if mode=='square' else 300),(['ArrowLeft','ArrowDown'],450 if mode=='square' else 300)]:
  m=measure(p,mode,keys,touch,ms);m['projectedLogicalVx']=m['medianSteadyVx']*expected;m['projectedLogicalVy']=m['medianSteadyVy']*expected;measurements.append(m)
 if rec:result['recordings'].append(rec.finish())
 for m in measurements:assert not m['hits'],(label,m)
 assert measurements[0]['medianSteadyVx']>20 and measurements[1]['medianSteadyVx']<-20
 assert measurements[2]['medianSteadyVy']<-10 and measurements[3]['medianSteadyVy']>10
 assert measurements[4]['medianSteadyVx']>10 and measurements[4]['medianSteadyVy']<-10
 extra={}
 if args.phase=='after':
  # Observe actual held directional frames, not only idle screenshots.
  for direction in ['up','down']:
   key='ArrowUp' if direction=='up' else 'ArrowDown'
   held(p,mode,[key],touch,350 if mode=='square' else 160,lambda:capture(p,out,label+'/'+direction,result,mode,expected))
   p.wait_for_timeout(200)
  bag(p,touch);tap(p,'#squarePauseBtn' if mode=='square' else '#mobilePauseBtn','p',touch)
  paused=sq(p) if mode=='square' else source(p);held(p,mode,['ArrowRight'],touch,220)
  after=sq(p) if mode=='square' else source(p);assert paused['x']==after['x'];tap(p,'#squarePauseBtn' if mode=='square' else '#mobilePauseBtn','p',touch)
  if mode=='square':
   walk_to(p,{'x':500,'y':525},touch);blocked=held(p,mode,['ArrowDown'],touch,900,lambda:sq(p))
   assert blocked['y']<=544.2 and 'bench-west' in blocked['hits'];extra['collision']={k:blocked[k] for k in ['x','y','hits']}
   walk_to(p,{'x':650,'y':650},touch);capture(p,out,label+'/cross-square',result,mode,expected)
   p.reload();wait_ready(p);wait_exploration(p);close_dialogue(p);assert route(p)['health']==hp;projection(p,mode,expected)
   walk_to(p,{'x':340,'y':420},touch);use_exit(p,'shopping-arcade',touch);capture(p,out,label+'/arcade',result,mode,expected)
   use_exit(p,'food-shop',touch);capture(p,out,label+'/food-shop',result,mode,expected);close_dialogue(p);use_exit(p,'shopping-arcade',touch);use_exit(p,'metro-square',touch)
   extra['doorReturn']={'scene':sq(p)['sceneId'],'entranceId':sq(p)['entranceId']}
   if touch:
    walk_to(p,{'x':650,'y':918},touch)
    clearance=p.evaluate("""()=>{const s=BearlyCentrumSquare.audit(),box=document.querySelector('.canvas-wrap').getBoundingClientRect(),crop=BearlyCentrumCamera.cover(s.camera,{x:s.x,y:s.y,jump:0},box),p=BearlyCentrumCamera.project(s.camera,s.x,s.y);return {foot:p.y-crop.cropY,head:p.y-212*s.camera.zoom-crop.cropY,visibleHeight:crop.visibleHeight,crop,camera:s.camera,x:s.x,y:s.y};}""")
    assert clearance['head']>=28-1e-6 and clearance['foot']<=clearance['visibleHeight']-76+1e-6,clearance
    extra['southPhoneClearance']=clearance;capture(p,out,label+'/south-edge',result,mode,expected)
    p.set_viewport_size({'width':390,'height':844});p.wait_for_timeout(200);projection(p,mode,expected);p.set_viewport_size({'width':844,'height':390});p.wait_for_timeout(200);projection(p,mode,expected)
   button='#squareFullscreenBtn';p.locator(button).tap() if touch else p.locator(button).click();p.wait_for_timeout(200);projection(p,mode,expected);p.locator(button).tap() if touch else p.locator(button).click();p.wait_for_timeout(200)
  assert route(p)['health']==hp
 if mode=='square':
  tap(p,'.square-exit','q',touch);p.wait_for_function("BearlyCentrumLink.audit().phase==='riding'&&!BearlyCentrumSquare.active()",timeout=90000);r=route(p)
 else:r=remount(p,touch)
 assert r['health']==hp and r['grounded'] and r['babyMounted']
 m=metrics(p);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
 result['checks'].append({'name':label,'passed':True,'setup':'one original route stop; then native controls, no later teleport/state grant','initial':initial,'measurements':measurements,'extra':extra,'health':hp,'parked':parked,'return':{k:r[k] for k in ['x','health','grounded','babyMounted']},'pendingRAF':m['pending'],'maxPendingRAF':m['maxPending']})
 c.close()

def combat(browser,base,touch,out,result,args):
 label='phone' if touch else 'desktop';c,p=context(browser,base,touch,result,'after');warp_setup(p,2720);dismount(p,touch)
 enemies=p.evaluate("()=>{const v=BearlyVisits.audit();return v.combat.npcs.filter(n=>n.kind==='gangster'&&n.active!==false&&n.visible!==false).sort((a,b)=>Math.abs(a.x-v.x)-Math.abs(b.x-v.x)).map(n=>({id:n.id,x:n.x,depth:n.depth}));}")
 assert enemies;enemy=enemies[0]
 # Use the current ordinary180u/s pace and a physically sufficient18u approach
 # tolerance. The inherited120u/s helper can oscillate around a moving enemy.
 for axis,target in [('depth',enemy['depth']),('x',enemy['x']+30)]:
  for _ in range(14):
   state=source(p);delta=target-state[axis]
   assert state['combat']['hp']>0,{'axis':axis,'target':target,'x':state['x'],'depth':state['depth'],'hp':state['combat']['hp']}
   if abs(delta)<(18 if axis=='x' else 7):break
   positive=delta>0
   key=('ArrowRight' if positive else 'ArrowLeft') if axis=='x' else ('ArrowDown' if positive else 'ArrowUp')
   selector=f'[data-direction="{1 if positive else -1}"]' if axis=='x' else f'[data-depth="{1 if positive else -1}"]'
   hold(p,selector,key,min(500,max(30,(abs(delta)-7)/(180 if axis=='x' else 140)*1000)),touch)
  else:raise AssertionError(('combat approach',axis,target,source(p)['x'],source(p)['depth']))
 hp=route(p)['health']
 p.wait_for_function('hp=>BearlyVisits.audit().combat.hp<hp&&BearlyVisits.audit().combat.hurt',arg=hp,timeout=45000,polling='raf')
 damaged=source(p);assert damaged['combat']['hp']<hp;capture(p,out,label+'-combat/native-hit',result,'street',args.route_zoom)
 mauls=damaged['combat']['stats']['mauls'];before={n['id']:n['hp'] for n in damaged['combat']['npcs']}
 # Same unchanged native close-range attack and original touch equivalent.
 if touch:
  b=p.locator('.area-maul').bounding_box();session=c.new_cdp_session(p);session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':b['x']+b['width']/2,'y':b['y']+b['height']/2}]});p.wait_for_timeout(210);session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});session.detach()
 else:p.keyboard.press('j');p.wait_for_timeout(180)
 after=source(p);assert after['combat']['stats']['mauls']>mauls
 struck=[{'id':n['id'],'before':before[n['id']],'after':n['hp']} for n in after['combat']['npcs'] if n['hp']<before[n['id']]];assert struck
 capture(p,out,label+'-combat/native-maul',result,'street',args.route_zoom)
 hold(p,'[data-direction="-1"]','ArrowLeft',550,touch);p.wait_for_function("!BearlyVisits.audit().combat.hurt&&BearlyVisits.audit().hero.pose==='walking'",timeout=15000,polling='raf')
 recovered=source(p);assert recovered['combat']['hp']<=hp and recovered['hero']['pose']=='walking'
 m=metrics(p);assert m['maxPending']<=1
 result['checks'].append({'name':label+' native authored gang warning/hit/Jattack/recovery at wider route view','passed':True,'setupStop':2720,'enemy':enemy,'healthBefore':hp,'healthAfter':route(p)['health'],'maulsBefore':mauls,'maulsAfter':after['combat']['stats']['mauls'],'struck':struck,'babyAfterHit':damaged['hero']['babyFace'],'maxPendingRAF':m['maxPending']})
 c.close()

def south_edge(browser,base,out,result,args):
 c,p=context(browser,base,True,result,'after');warp_setup(p,7550)
 tap(p,'#centrumRouteEntryBtn','e',True);wait_exploration(p);close_dialogue(p)
 held(p,'square',['ArrowDown'],True,3500);p.wait_for_timeout(220)
 state=sq(p);assert abs(state['y']-918)<.05,state['y']  # Swept valid floor stops just inside the boundary.
 clearance=p.evaluate("""()=>{const s=BearlyCentrumSquare.audit(),box=document.querySelector('.canvas-wrap').getBoundingClientRect(),crop=BearlyCentrumCamera.cover(s.camera,{x:s.x,y:s.y,jump:0},box),p=BearlyCentrumCamera.project(s.camera,s.x,s.y);return {foot:p.y-crop.cropY,head:p.y-212*s.camera.zoom-crop.cropY,visibleHeight:crop.visibleHeight,crop,camera:s.camera,x:s.x,y:s.y};}""")
 assert clearance['head']>=28-1e-6 and clearance['foot']<=clearance['visibleHeight']-76+1e-6,clearance
 capture(p,out,'phone-square/exact-south-boundary',result,'square',args.zoom)
 hp=route(p)['health'];tap(p,'.square-exit','q',True)
 p.wait_for_function("BearlyCentrumLink.audit().phase==='riding'&&!BearlyCentrumSquare.active()",timeout=90000)
 r=route(p);assert r['health']==hp and r['grounded'] and r['babyMounted'] and r['x']==11325
 result['checks'].append({'name':'phone actual south floor clamp918 and head/feet clearance, samebike native return','passed':True,'setup':'one original7550route stop then nativeE/touchDown/Q','clearance':clearance,'return':{k:r[k] for k in ['x','health','grounded','babyMounted']},'metrics':metrics(p)})
 c.close()

def main():
 a=argparse.ArgumentParser();a.add_argument('--phase',choices=['before','after'],required=True);a.add_argument('--out',default='verification/stage21/browser');a.add_argument('--platform',choices=['both','desktop','phone'],default='both');a.add_argument('--zoom',type=float,default=.6);a.add_argument('--route-zoom',type=float,default=.8);a.add_argument('--clip',action='store_true');a.add_argument('--only-combat',action='store_true');a.add_argument('--only-south',action='store_true');args=a.parse_args()
 out=(ROOT/args.out/args.phase).resolve();assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
 result={'scope':__doc__,'phase':args.phase,'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'runtimeHashes':hashes(),'conditions':{'headless':True,'physicalDevice':False,'desktop':[1280,720],'ChromiumCDPTouch':[844,390],'deviceScaleFactor':1,'JPEGQuality':78,'zoom':args.zoom,'routeZoom':args.route_zoom},'checks':[],'captures':[],'recordings':[],'errors':[],'consoleErrors':[],'httpFailures':[]}
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);result['browser']=browser.version
   if args.only_south:south_edge(browser,f'http://127.0.0.1:{server.server_port}',out,result,args)
   for touch in ([] if args.only_south else [False,True] if args.platform=='both' else [args.platform=='phone']):
    if not args.only_combat:
     for mode in ['square','street']:scenario(browser,f'http://127.0.0.1:{server.server_port}',touch,out,result,args,mode)
    if args.phase=='after':combat(browser,f'http://127.0.0.1:{server.server_port}',touch,out,result,args)
   browser.close()
  result['runtimeHashesAfter']=hashes();result['changedRuntimeFiles']=[n for n,h in result['runtimeHashes'].items() if result['runtimeHashesAfter'].get(n)!=h]
  if args.phase=='after':assert not result['changedRuntimeFiles']
  else:result['baselineSource']={'commit':BASELINE,'mode':'Read-only Git HTML/JS/manifest fulfil; original assets unchanged'}
  assert not result['errors'] and not result['consoleErrors'] and not result['httpFailures'];result['passed']=True
 except BaseException as error:result['passed']=False;result['failure']=repr(error);result['traceback']=traceback.format_exc();raise
 finally:server.shutdown();(out/'results.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
 print('PASS',args.phase,len(result['checks']),'actual contexts;',len(result['captures']),'screenshots;',len(result['recordings']),'clips',flush=True)
if __name__=='__main__':main()
