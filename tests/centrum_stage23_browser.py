"""Stage23 real knee/body-motion gameplay checks.

Fresh contexts use one disclosed original route-stop helper, followed only by
native movement/parking/dismount/menu/interaction controls. The authored gang
combat group similarly uses one route-stop setup, then native proximity/J.
Read-only Stage22 Git fulfil supplies comparison motion; no donor is accessed.
Chromium CDP phone emulation is not physical-phone or Safari testing. Native
screencast timing is preserved; encoding rate is not a game-FPS claim.
"""
import argparse,functools,hashlib,json,math,traceback,subprocess
from pathlib import Path
from http.server import ThreadingHTTPServer
from threading import Thread
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
from centrum_economy_browser import Quiet,wait_ready,wait_exploration,close_dialogue,walk_to,move_axis,use_exit,sq
from centrum_stage16_browser import PROBE,warp_setup,route,source,bag,tap,hashes,Recording,street_move,hold
from centrum_stage20_browser import held,measure,PROBE as MOVE_PROBE
from centrum_standalone import INSTRUMENT,metrics
ROOT=Path(__file__).resolve().parents[1]
BASELINE='c407d16cb167cd00b57d363a9b8d8fb53e74888a'

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
  result['baselineServedHashes']={n:hashlib.sha256(b).hexdigest() for n,b in sorted(baseline.items())}
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

def caches(p):
 data=p.evaluate('({body:BearlyHeroRig.cacheStats(),worker:BearlyHeroRig.centrumCacheStats()})')
 assert data['body']['frames']<=data['body']['frameLimit']==98
 assert data['body']['bytes']<=data['body']['limitBytes']==32*1024*1024
 observed=metrics(p)
 data['mainRAF']={k:observed[k] for k in ['pending','maxPending','loopFrames','frameTimeMs']}
 data['mainRAF']['scope']='Observed main-loop callbacks on shared headless host; not a gameFPS or physical-device claim.'
 return data

def motion(p,out,label,result,mode,touch,expected,clip):
 """Native sequential motion at the accepted camera; no renderer pose fixture.

 Square has sufficient clear floor for2.4s in each cardinal direction. The
 copied street is only155depth units wide, so its vertical samples are shorter
 and explicitly labelled. The recording keeps native timestamp spacing.
 """
 rec=Recording(p,out,label+'-motion') if clip else None
 segments=[]
 for direction,ms in [('right',2400),('left',2400),('up',2400 if mode=='square' else 550),('down',2400 if mode=='square' else 950)]:
  if mode=='square' and direction=='up':
   x=sq(p)['x']
   if not 665<=x<=720:move_axis(p,'x',700,touch)
   assert 665<=sq(p)['x']<=725,sq(p)['x']
  before=sq(p) if mode=='square' else source(p)
  p.evaluate('mode=>{__move20.samples=[];__move20.mode=mode;__move20.record=true}',mode)
  captured={}
  def observed():
   pth=out/(label+'/moving-'+direction+'.jpg');pth.parent.mkdir(parents=True,exist_ok=True)
   p.screenshot(path=str(pth),type='jpeg',quality=78)
   captured['file']=pth.relative_to(out).as_posix();captured['sha256']=hashlib.sha256(pth.read_bytes()).hexdigest()
  after=held(p,mode,['Arrow'+direction.title()],touch,ms,observed)
  samples=p.evaluate('__move20.record=false;__move20.samples')
  after=sq(p) if mode=='square' else source(p)
  captured['projection']=projection(p,mode,expected);captured['hero']=after['hero'];captured['auditSampling']='Immediately after native release; screenshot itself was captured while held.'
  result['captures'].append({'file':captured['file'],'sha256':captured['sha256'],'actualGameplay':True,'capturedWhileHeld':True,'projection':captured['projection'],'auditSampling':captured['auditSampling']})
  p.wait_for_timeout(220)
  assert samples and not any(s['hits'] for s in samples),(label,direction,samples)
  axis='x' if direction in ['left','right'] else 'y' if mode=='square' else 'depth'
  delta=after[axis]-before[axis]
  assert abs(delta)>(90 if mode=='square' and axis=='y' else 20),(label,direction,delta)
  assert (delta>0)==(direction in ['right','down'])
  active=[s for s in samples if s['held']]
  segments.append({'direction':direction,'requestedHeldWallMs':ms,'actualSampleWallSeconds':(samples[-1]['w']-samples[0]['w'])/1000,'actualHeldSampleWallSeconds':(active[-1]['w']-active[0]['w'])/1000,'actualHeldSimulationSeconds':active[-1]['t']-active[0]['t'],'simulationSeconds':samples[-1]['t']-samples[0]['t'],'samples':len(samples),'from':{'x':before['x'],'y':before['y'] if mode=='square' else before['depth']},'to':{'x':after['x'],'y':after['y'] if mode=='square' else after['depth']},'heldFrame':captured})
 if rec:
  record=rec.finish();record['segments']=segments;record['scope']='Native square2.4s/direction; source vertical shorter to respect original155-unit depth floor. No pose fixture.'
  result['recordings'].append(record)
 else:result.setdefault('motionWithoutClip',[]).append({'label':label,'segments':segments})

def temporal_diagnostics(out,result):
 for mode,crop in [('square','140:160:589+126*t:355'),('street','140:160:415:450')]:
  src=out/('desktop-'+mode+'-motion.webm')
  if not src.exists():continue
  dest=out/(('source' if mode=='street' else 'square')+'-native-sequence-diagnostic.png')
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','0.3','-i',str(src),'-vf','fps=5,crop='+crop+',tile=8x1','-frames:v','1',str(dest)],check=True)
  result.setdefault('temporalDiagnostics',[]).append({'file':dest.name,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'sourceVideo':src.name,'sourceVideoSHA256':hashlib.sha256(src.read_bytes()).hexdigest(),'sampleSeconds':[round(.3+i*.2,1) for i in range(8)],'nativeCrop':crop,'scale':1,'scope':'Eight chronological crops from actual native video; no enlargement. Temporal diagnostic, not a full gameplay screenshot.'})

def compact_baseline(out,result):
 keep=[];dropped=[]
 for recording in result['recordings']:
  if '-street-motion.' not in recording['file']:keep.append(recording);continue
  path=out/recording['file'];path.unlink(missing_ok=True)
  dropped.append({**recording,'retained':False,'reason':'Redundant source baseline video payload omitted for compact evidence; its native gameplay stills, temporal crop strip and complete recording metadata remain.'})
 result['recordings']=keep
 if dropped:
  result['unretainedRecordings']=dropped
  result['artifactSelection']='Both native desktop/touch Square baseline clips retained. Redundant source baseline videos deliberately omitted; source stills/temporal diagnostic and recording metadata retained.'

def scenario(browser,base,touch,out,result,args,mode):
 label=('phone' if touch else 'desktop')+'-'+mode;c,p=context(browser,base,touch,result,args.phase)
 expected=args.zoom if mode=='square' else args.route_zoom
 warp_setup(p,7550 if mode=='square' else 1600)
 if mode=='square':tap(p,'#centrumRouteEntryBtn','e',touch);wait_exploration(p);close_dialogue(p)
 else:dismount(p,touch)
 if mode=='square':walk_to(p,{'x':720,'y':650},touch)
 parked=p.evaluate('BearlyCentrumLink.audit().parking') if mode=='square' else source(p)['parkedAt'];hp=route(p)['health']
 initial=capture(p,out,label+'/initial',result,mode,expected)
 cache={'beforeMotion':caches(p)}
 motion(p,out,label,result,mode,touch,expected,args.clip)
 cache['afterMotion']=caches(p)
 cache['motionDeltas']={**{key:cache['afterMotion']['body'][key]-cache['beforeMotion']['body'][key] for key in ['misses','transientBuilds','bitmapFailures']},'workerFallbacks':cache['afterMotion']['worker'].get('fallbacks',0)-cache['beforeMotion']['worker'].get('fallbacks',0),'sourceWarmupForeground':cache['afterMotion']['body']['sourceWarmup']['foreground']-cache['beforeMotion']['body']['sourceWarmup']['foreground']}
 measurements=[]
 for keys,ms in [(['ArrowRight'],650),(['ArrowLeft'],650),(['ArrowUp'],700 if mode=='square' else 300),(['ArrowDown'],700 if mode=='square' else 300),(['ArrowRight','ArrowUp'],450 if mode=='square' else 300),(['ArrowLeft','ArrowDown'],450 if mode=='square' else 300)]:
  m=measure(p,mode,keys,touch,ms);m['projectedLogicalVx']=m['medianSteadyVx']*expected;m['projectedLogicalVy']=m['medianSteadyVy']*expected;measurements.append(m)
 for m in measurements:assert not m['hits'],(label,m)
 for m,(vx,vy) in zip(measurements,[(200 if mode=='square' else 180,0),(-200 if mode=='square' else -180,0),(0,-80 if mode=='square' else -140),(0,80 if mode=='square' else 140)]):
  assert math.isclose(m['medianSteadyVx'],vx,abs_tol=1e-5) and math.isclose(m['medianSteadyVy'],vy,abs_tol=1e-5),(label,m,vx,vy)
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
 p.wait_for_function('()=>{const c=BearlyHeroRig.centrumCacheStats(),b=BearlyHeroRig.cacheStats();return !c.pending&&!c.queued&&!b.pendingBitmaps;}',timeout=15000)
 cache['afterChecksAndReturn']=caches(p)
 m=metrics(p);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
 result['checks'].append({'name':label,'passed':True,'setup':'one original route stop; then native controls, no later teleport/state grant. Square uses native walk_to720/650 for normal-size motion and native safe-column correction before up when needed.','initial':initial,'measurements':measurements,'cache':cache,'extra':extra,'health':hp,'parked':parked,'return':{k:r[k] for k in ['x','health','grounded','babyMounted']},'pendingRAF':m['pending'],'maxPendingRAF':m['maxPending']})
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
 recovered=source(p);assert recovered['combat']['hp']<=hp and recovered['hero']['pose']=='walking';assert recovered['hero']['gait'].get('sourceWalk') and recovered['hero']['anatomy']['skinning']=='knee-driven-single-owner-surface'
 back_start=recovered['hero']['carrier'];assert back_start=='back'
 rec=Recording(p,out,label+'-combat-back-carrier-motion') if args.clip else None
 held(p,'street',['ArrowLeft'],touch,2400,lambda:capture(p,out,label+'-combat/recovered-back-carrier-walk',result,'street',args.route_zoom))
 if rec:
  # Export must not leave an unobserved, stationary hero exposed to attacks.
  # This is the normal P/touch pause AFTER the requested native motion, not a
  # pose fixture or an injected combat-state hold during the recorded walk.
  tap(p,'#mobilePauseBtn','p',touch);assert source(p)['paused']
  clip=rec.finish();clip['scope']='Native hit/recovery and continued left walk starting in original back carrier; incoming attacks and natural return to front remain enabled. Normal P/touch pause entered only after the held motion for export, then resumed. No state assignment.';clip['carrierAtStart']=back_start;clip['nativeExportPauseAfterHeldMotion']=True;result['recordings'].append(clip)
  tap(p,'#mobilePauseBtn','p',touch);assert not source(p)['paused']
 for _ in range(12):
  recovered=source(p)
  assert recovered['combat']['hp']>0,recovered['combat']['hp']
  if recovered['hero'].get('pose')=='walking' and not recovered['combat']['hurt']:break
  held(p,'street',['ArrowLeft'],touch,120)
 else:raise AssertionError('Native post-export directional recovery did not reach walking')
 assert recovered['hero']['gait'].get('sourceWalk') and recovered['hero']['anatomy']['skinning']=='knee-driven-single-owner-surface'
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
 a=argparse.ArgumentParser();a.add_argument('--phase',choices=['before','after'],required=True);a.add_argument('--out',default='verification/stage23/browser');a.add_argument('--platform',choices=['both','desktop','phone'],default='both');a.add_argument('--zoom',type=float,default=.6);a.add_argument('--route-zoom',type=float,default=.8);a.add_argument('--clip',action='store_true');a.add_argument('--only-square',action='store_true');a.add_argument('--only-combat',action='store_true');a.add_argument('--only-south',action='store_true');args=a.parse_args()
 out=(ROOT/args.out/args.phase).resolve();assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
 result={'scope':__doc__,'phase':args.phase,'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'runtimeHashes':hashes(),'conditions':{'headless':True,'physicalDevice':False,'desktop':[1280,720],'ChromiumCDPTouch':[844,390],'deviceScaleFactor':1,'JPEGQuality':78,'zoom':args.zoom,'routeZoom':args.route_zoom},'checks':[],'captures':[],'recordings':[],'errors':[],'consoleErrors':[],'httpFailures':[]}
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);result['browser']=browser.version
   if args.only_south:south_edge(browser,f'http://127.0.0.1:{server.server_port}',out,result,args)
   for touch in ([] if args.only_south else [False,True] if args.platform=='both' else [args.platform=='phone']):
    if not args.only_combat:
     for mode in (['square'] if args.only_square else ['square','street']):scenario(browser,f'http://127.0.0.1:{server.server_port}',touch,out,result,args,mode)
    if args.phase=='after' and not args.only_square:combat(browser,f'http://127.0.0.1:{server.server_port}',touch,out,result,args)
   browser.close()
  temporal_diagnostics(out,result)
  if args.phase=='before':compact_baseline(out,result)
  result['runtimeHashesAfter']=hashes();result['changedRuntimeFiles']=[n for n,h in result['runtimeHashes'].items() if result['runtimeHashesAfter'].get(n)!=h]
  if args.phase=='after':assert not result['changedRuntimeFiles']
  else:result['baselineSource']={'commit':BASELINE,'mode':'Read-only Git HTML/JS/manifest fulfil; original assets unchanged'}
  assert not result['errors'] and not result['consoleErrors'] and not result['httpFailures'];result['passed']=True
 except BaseException as error:result['passed']=False;result['failure']=repr(error);result['traceback']=traceback.format_exc();raise
 finally:server.shutdown();(out/'results.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
 print('PASS',args.phase,len(result['checks']),'actual contexts;',len(result['captures']),'screenshots;',len(result['recordings']),'clips',flush=True)
if __name__=='__main__':main()
