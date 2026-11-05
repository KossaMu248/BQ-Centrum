"""Stage18 native rendered bench and damage-eye acceptance.

One disclosed original route-stop setup per fresh context, then native movement,
personal-space provocation and actual enemy damage. No health/NPC/item grants.
Chromium touch emulation is not physical Safari/device testing. Screenshots and
observed live state/Canvas submissions provide different kinds of evidence.
"""
import argparse,functools,hashlib,json,subprocess,time,traceback
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
from centrum_stage16_browser import ROOT,PROBE,hashes,start,warp_setup,dismount,street_move,route,source,hold,tap,bag,remount_source,combat_stats
from centrum_prop_fit_browser import PROP_PROBE,state,compact_state,same_rest
from centrum_economy_browser import Quiet,wait_ready
from centrum_standalone import INSTRUMENT,metrics

BASELINE_PROJECT_COMMIT='bbf2de3d6c26652cf7ae29faa1c03456c0f533c0'
BENCH_PROBE=r'''(()=>{let bench;Object.defineProperty(window,'BearlyCentrumStreetBench',{configurable:true,get:()=>bench,set:v=>{bench=v;const draw=v.draw;v.draw=function(c,x,y,width,...args){const q=window.__propFitQA;if(c.canvas.id==='game'&&q?.activeProp)q.props[q.activeProp].draws.push({kind:'bench',x,y,width,matrix:c.getTransform().toJSON(),geometry:v.audit()});return draw.call(this,c,x,y,width,...args);};}});})();'''

def compact_hurt(page):
 return page.evaluate('''()=>{const v=BearlyVisits.audit(),r=BearlyCentrumLink.audit().route,h=v.hero;return {build:BEARLY_BUILD_ID,route:{x:r.x,health:r.health,grounded:r.grounded,babyMounted:r.babyMounted},source:{mode:v.mode,x:v.x,depth:v.depth,paused:v.paused,parkedAt:v.parkedAt,combat:{time:v.combat.time,hp:v.combat.hp,hurt:v.combat.hurt,effects:v.combat.effects,stats:v.combat.stats,shots:v.combat.shots},hero:{pose:h.pose,source:h.source,height:h.height,carrier:h.carrier,babyFace:h.babyFace}},nearby:v.combat.npcs.filter(n=>Math.abs(n.x-v.x)<700).map(n=>({id:n.id,kind:n.kind,variant:n.variant,x:n.x,depth:n.depth,state:n.state,hp:n.hp,activity:n.activity,aggressive:n.aggressive})),projection:{hero:__stage16QA.hero,baby:__stage16QA.baby}};}''')

def capture(page,out,label,result,sample):
 path=out/(label+'.jpg');path.parent.mkdir(parents=True,exist_ok=True)
 page.screenshot(path=str(path),type='jpeg',quality=result['conditions']['jpegQuality'])
 result['captures'].append({'file':path.relative_to(out).as_posix(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'actualGameplay':True,'state':sample})

def context(browser,base,touch,result):
 c=browser.new_context(viewport={'width':844 if touch else 1280,'height':390 if touch else 720},is_mobile=touch,has_touch=touch,device_scale_factor=1)
 c.add_init_script(INSTRUMENT);c.add_init_script(PROBE);c.add_init_script(PROP_PROBE);c.add_init_script(BENCH_PROBE)
 p=c.new_page();p.on('pageerror',lambda e:result['errors'].append(str(e)));p.on('console',lambda e:result['consoleErrors'].append(e.text) if e.type=='error' else None);p.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
 p.goto(base+'/index.html');wait_ready(p);start(p,touch);return c,p

def native_hurt(browser,base,touch,out,result,phase):
 label='phone' if touch else 'desktop';c,p=context(browser,base,touch,result)
 warp_setup(p,2720);dismount(p,touch)
 before=compact_hurt(p)
 enemies=p.evaluate("()=>{const v=BearlyVisits.audit();return v.combat.npcs.filter(n=>n.kind==='gangster'&&n.active!==false&&n.visible!==false).sort((a,b)=>Math.abs(a.x-v.x)-Math.abs(b.x-v.x)).map(n=>({id:n.id,x:n.x,depth:n.depth}));}")
 assert enemies,'authored child crew must exist'
 enemy=enemies[0]
 # Native movement into personal space triggers the unchanged warning/anger
 # rules; no test-only provoke/hit call is used.
 street_move(p,'depth',enemy['depth'],touch);street_move(p,'x',enemy['x']+30,touch)
 hp=route(p)['health']
 p.wait_for_function('hp=>{const v=BearlyVisits.audit();return v.combat.hp<hp&&v.combat.hurt&&/Hurt$/.test(v.hero.pose);}',arg=hp,timeout=45000,polling='raf')
 hit=compact_hurt(p);assert hit['source']['combat']['hp']<hp and hit['source']['combat']['hurt'];assert hit['source']['hero']['pose'] in ['frontHurt','backHurt']
 if phase=='before' or touch:capture(p,out,label+'/actual-enemy-hurt',result,hit)
 # Observe a real subsequent moving frame rather than treating one image as
 # proof that the hurt state actually clears.
 hold(p,'[data-direction="-1"]','ArrowLeft',450,touch)
 p.wait_for_function("!BearlyVisits.audit().combat.hurt&&BearlyVisits.audit().hero.pose==='walking'",timeout=15000,polling='raf')
 recovered=compact_hurt(p);assert recovered['route']['health']<=hp and recovered['source']['hero']['pose']=='walking'
 m=metrics(p);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
 result['checks'].append({'name':label+' actual authored enemy damage and recovery use native controls','passed':True,'setupStop':2720,'targetEnemy':enemy,'beforeHealth':before['route']['health'],'healthImmediatelyBeforeHitWait':hp,'hurt':hit,'recovered':recovered,'metrics':m})
 c.close()

def riding_arm_fixture(browser,base,touch,out,result,phase,crash=False):
 """Explicit secondary renderer fixture, separate from earned native damage."""
 label='phone' if touch else 'desktop'
 c=browser.new_context(viewport={'width':844 if touch else 1280,'height':390 if touch else 720},is_mobile=touch,has_touch=touch,device_scale_factor=1)
 c.add_init_script(INSTRUMENT);c.add_init_script(PROBE)
 serving={'mode':'current-worktree'}
 if phase=='before':
  original=subprocess.check_output(['git','show',BASELINE_PROJECT_COMMIT+':js/illustrated-hero.js'],cwd=ROOT)
  serving={'mode':'read-only Playwright route fulfilment of pinned target baseline module; no disk rollback','projectCommit':BASELINE_PROJECT_COMMIT,'file':'js/illustrated-hero.js','sha256':hashlib.sha256(original).hexdigest()}
  c.route('**/js/illustrated-hero.js*',lambda route:route.fulfill(status=200,content_type='application/javascript',body=original))
 c.add_init_script('''(()=>{let hero,lastSprite=null;window.__stage18Injured={samples:[],last:null,pixels:null,gameDraws:[]};const drawImage=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(im,...args){const value=drawImage.call(this,im,...args);if(this.canvas.id==='game'&&im===lastSprite){const q=window.__stage18Injured;q.gameDraws.push({destination:args,matrix:this.getTransform().toJSON(),globalAlpha:this.globalAlpha,composite:this.globalCompositeOperation,at:performance.now()});if(q.gameDraws.length>20)q.gameDraws.shift();}return value;};Object.defineProperty(window,'BearlyHero',{configurable:true,get:()=>hero,set:v=>{hero=v;const sprite=v.sprite;v.sprite=function(im,...args){const out=sprite.call(this,im,...args);if(String(im?.src).includes('bear_upper_rightarm_injured')){lastSprite=out;const observed=window.__stage18Injured;if(!observed.pixels){const tile=document.createElement('canvas');tile.width=291;tile.height=309;const c=tile.getContext('2d',{willReadFrequently:true}),at=[[190,49],[212,51]];c.drawImage(im,0,0);const original=at.map(([x,y])=>[...c.getImageData(x,y,1,1).data]);c.clearRect(0,0,291,309);c.drawImage(out,0,0);const actual=at.map(([x,y])=>[...c.getImageData(x,y,1,1).data]);observed.pixels={coordinates:at,original,actual,scope:'One read-only sample of actual sprite return used by live game; not a game-frame alpha claim.'};}const q={source:im.src,sourceSize:[im.naturalWidth,im.naturalHeight],resultType:out.tagName||out.constructor.name,resultSize:[out.width||out.naturalWidth,out.height||out.naturalHeight]};observed.last=q;if(observed.samples.length<2)observed.samples.push(q);}return out;};}});})();''')
 p=c.new_page();p.on('pageerror',lambda e:result['errors'].append(str(e)));p.on('console',lambda e:result['consoleErrors'].append(e.text) if e.type=='error' else None);p.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
 p.goto(base+'/index.html');wait_ready(p);start(p,touch);warp_setup(p,3700)
 # The existing debug stop protects the rider for2.5 simulation seconds.
 # Let that real timer expire; do not alter invulnerability/health in the test.
 goal=route(p)['simTime']+2.7
 p.wait_for_function('t=>BearlyCentrumLink.audit().route.simTime>=t',arg=goal,timeout=15000)
 before=p.evaluate('BEARLY_DEBUG()');assert not before['lostParts'] and before['health']==100,before
 # injure() returnsundefined on success; the changed live state is the proof.
 p.evaluate("BEARLY_TEST.hit('rightArm',25)")
 p.wait_for_timeout(620)
 observed=p.evaluate('({debug:BEARLY_DEBUG(),image:__stage18Injured,heroAudit:BearlyHero.audit(),route:BearlyCentrumLink.audit().route})')
 assert observed['debug']['lostParts']==['rightArm'] and 0<observed['debug']['health']<=75
 assert observed['image']['last'] and observed['image']['last']['source'].endswith('bear_upper_rightarm_injured.png')
 if phase=='after':
  pixels=observed['image']['pixels'];assert [p[3] for p in pixels['original']]==[0,42],pixels
  assert [p[3] for p in pixels['actual']]==[255,255],pixels
 fixture={'explicitSecondaryFixture':True,'fixture':'existing BEARLY_TEST.hit(rightArm,25), severe original damage; no healing/reward grants','moduleServing':serving,'before':{k:before[k] for k in ['health','lostParts','state','x','speed','bearPose']},'after':{k:observed['debug'][k] for k in ['health','lostParts','state','x','speed','bearPose']},'image':observed['image'],'heroAudit':observed['heroAudit']}
 if not crash and (phase=='before' or not touch):capture(p,out,label+'/right-arm-injured-cycling',result,fixture)
 if crash:
  p.evaluate('BEARLY_TEST.crash()')
  p.wait_for_function("BEARLY_DEBUG().bearEjected&&__stage18Injured.gameDraws.some(d=>d.destination[0]===-154&&d.destination[1]===-176)",timeout=10000,polling='raf')
  thrown=p.evaluate('({debug:BEARLY_DEBUG(),image:__stage18Injured,heroAudit:BearlyHero.audit()})')
  draw=next(d for d in reversed(thrown['image']['gameDraws']) if d['destination']==[-154,-176]);assert draw['globalAlpha']==1 and draw['composite']=='source-over',draw
  assert thrown['debug']['bearEjected'] and thrown['debug']['lostParts']==['rightArm'] and thrown['debug']['health']<=observed['debug']['health']
  assert [v[3] for v in thrown['image']['pixels']['actual']]==[255,255]
  fixture['crash']={'helper':'BEARLY_TEST.crash(), explicit secondary crash fixture','after':{k:thrown['debug'][k] for k in ['health','lostParts','state','x','speed','bearPose','bearEjected','babyEjected']},'actualAirborneSpriteDraw':draw,'eyePixels':thrown['image']['pixels'],'heroAudit':thrown['heroAudit']}
  if not touch:capture(p,out,label+'/right-arm-injured-airborne',result,fixture)
 m=metrics(p);assert m['maxPending']<=1
 result['checks'].append({'name':label+(' explicit right-arm injury and actual airborne crash renderer fixture' if crash else ' explicitly prepared original severe right-arm injury renderer fixture'),'passed':True,'secondaryFixture':True,'fixture':fixture,'moduleServing':serving,'damageHelper':'BEARLY_TEST.hit(rightArm,25)','healthBefore':before['health'],'healthAfter':observed['debug']['health'],'lostParts':observed['debug']['lostParts'],'metrics':m});c.close()

def bench_scene(browser,base,touch,out,result):
 label='phone' if touch else 'desktop';c,p=context(browser,base,touch,result)
 warp_setup(p,1600);dismount(p,touch);initial=p.evaluate("BearlyVisits.residents().filter(n=>['civilian-reader','civilian-bench','civilian-smoker'].includes(n.id)).map(n=>({id:n.id,x:n.x,depth:n.depth,activity:n.activity,prop:n.activityProp,state:n.state,hp:n.hp,distance:n.distance}))")
 snap=state(p);capture(p,out,label+'/shared-bench-seating',result,compact_state(snap))
 fits=[]
 def transform(m,x,y):return {'x':m['a']*x+m['c']*y+m['e'],'y':m['b']*x+m['d']*y+m['f']}
 for ident in ['civilian-reader','civilian-bench']:
  n=snap['render']['npcs'][ident];pose='read' if ident=='civilian-reader' else 'sit';frame=next(f for f in snap['npcFrames'] if f['variant']==n['variant'])[pose];d=next(x for x in n['draws'] if x['sourcePose']==pose);prop=snap['render']['props'][n['prop']['id']];pd=next(x for x in prop['draws'] if x['kind']=='bench');geometry=pd['geometry']
  sx,sy,sw,sh=map(float,d['sourceRect'].split(','));dx,dy,dw,dh=d['destination']
  def point(x,y):return transform(d['matrix'],dx+(x-sx)*dw/sw,dy+(y-sy)*dh/sh)
  hip=point(*frame['seatPivot']);sole=point(frame['anchor'][0],frame['core'][1]+frame['core'][3]-1);floor=transform(pd['matrix'],pd['x'],pd['y']);scale=pd['width']/geometry['width'];front=transform(pd['matrix'],pd['x'],pd['y']-geometry['seatPan']['front']*scale);rear=transform(pd['matrix'],pd['x'],pd['y']-geometry['seatPan']['rear']*scale)
  opaqueBodyWidth=frame['core'][2]*dw/sw;aspect=(dw/d['tile'][0])/(dh/d['tile'][1]);fit={'id':ident,'variant':n['variant'],'source':d['source'],'pose':pose,'hipCanvas':hip,'opaqueSoleCanvas':sole,'benchFloorCanvas':floor,'seatPanCanvas':{'front':front,'rear':rear},'soleFloorGap':sole['y']-floor['y'],'aspect':aspect,'actualSubmittedBenchWidth':pd['width'],'geometry':geometry,'opaqueBodyWidth':opaqueBodyWidth,'usableSeatToBodyWidths':geometry['usableSeatWidth']/opaqueBodyWidth}
  assert pd['width']==224 and geometry['usableSeatWidth']==188 and fit['usableSeatToBodyWidths']>2,fit
  assert abs(fit['soleFloorGap'])<1.0 and rear['y']-1<=hip['y']<=front['y']+1 and abs(aspect-1)<1e-9,fit
  fits.append(fit)
 result.setdefault('benchMeasurements',[]).append({'platform':label,'fits':fits})
 p.wait_for_timeout(1500);now=p.evaluate("BearlyVisits.residents().filter(n=>['civilian-reader','civilian-bench','civilian-smoker'].includes(n.id)).map(n=>({id:n.id,x:n.x,depth:n.depth,activity:n.activity,prop:n.activityProp,state:n.state,hp:n.hp,distance:n.distance}))");same_rest(initial,now)
 hp=route(p)['health'];bag(p,touch);tap(p,'#mobilePauseBtn','p',touch);assert source(p)['paused'];p.wait_for_timeout(150);tap(p,'#mobilePauseBtn','p',touch)
 parked=source(p)['parkedAt'];r=remount_source(p,touch);assert abs(r['x']-parked)<5 and r['health']==hp and r['grounded'] and r['babyMounted'];m=metrics(p);assert m['maxPending']<=1
 result['checks'].append({'name':label+' authored shared-bench quiet seating, bag/pause/same-bike return','passed':True,'setupStop':1600,'initial':initial,'afterQuiet':now,'health':hp,'metrics':m});c.close()

def occupancy_scene(browser,base,out,result):
 """Final-Brawler native seat bypass/release/reuse; no extra screenshot."""
 c,p=context(browser,base,False,result);warp_setup(p,1600);dismount(p,False)
 def actors():
  return p.evaluate("BearlyVisits.residents().filter(n=>['civilian-reader','civilian-bench','civilian-smoker'].includes(n.id)).map(n=>({id:n.id,x:n.x,depth:n.depth,activity:n.activity,prop:n.activityProp,state:n.state,hp:n.hp,distance:n.distance,speed:n.speed}))")
 def find(rows,ident):return next(n for n in rows if n['id']==ident)
 def claims(rows):
  seats=[n['prop']['id'] for n in rows if n['activity'] in ['sit','read'] and n['prop']]
  assert len(seats)==len(set(seats)),rows
  return seats
 initial=actors();claims(initial);hp=route(p)['health'];stats=combat_stats(p);smoker=find(initial,'civilian-smoker');reader=find(initial,'civilian-reader');older=find(initial,'civilian-bench');east=reader['prop']['id'];life=p.evaluate('BearlyVisits.lifeTime()')
 street_move(p,'depth',-30,False);street_move(p,'x',smoker['x']+55,False);street_move(p,'depth',smoker['depth'],False);street_move(p,'x',smoker['x']+20,False)
 bumped=actors();assert find(bumped,'civilian-smoker')['prop'] is None
 p.wait_for_function("x=>{const n=BearlyVisits.residents().find(n=>n.id==='civilian-smoker');return n.x<x-10&&n.activity==='walk'&&!n.activityProp;}",arg=reader['x'],timeout=20000,polling='raf')
 bypassed=actors();claims(bypassed);assert find(bypassed,'civilian-reader')['activity']=='read' and find(bypassed,'civilian-reader')['prop']['id']==east
 assert find(bypassed,'civilian-bench')['x']==older['x'] and find(bypassed,'civilian-bench')['activity']=='sit'
 street_move(p,'depth',-30,False);street_move(p,'x',reader['x']+55,False);street_move(p,'depth',reader['depth'],False);street_move(p,'x',reader['x']+20,False)
 released=actors();claims(released);assert find(released,'civilian-reader')['prop'] is None
 street_move(p,'depth',-30,False)
 p.wait_for_function("id=>{const n=BearlyVisits.residents().find(n=>n.id==='civilian-smoker');return n.activity==='sit'&&n.activityProp?.id===id;}",arg=east,timeout=35000,polling='raf')
 p.wait_for_timeout(100);reused=actors();claims(reused);new=find(reused,'civilian-smoker');assert new['prop']['id']==east and new['activity']=='sit' and new['hp']==smoker['hp']
 assert find(reused,'civilian-reader')['prop'] is None or find(reused,'civilian-reader')['prop']['id']!=east
 assert find(reused,'civilian-bench')['x']==older['x'] and find(reused,'civilian-bench')['activity']=='sit'
 assert route(p)['health']==hp and combat_stats(p)==stats
 render=state(p)['render']['npcs']['civilian-smoker'];assert render['activity']=='sit' and any(d['sourcePose']=='sit' for d in render['draws'])
 m=metrics(p);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
 result['checks'].append({'name':'desktop final Brawler actual occupied-bench bypass, contact release and later normal reuse','passed':True,'setupStop':1600,'simulationSeconds':p.evaluate('BearlyVisits.lifeTime()')-life,'initial':initial,'afterSmokerContact':bumped,'bypassedOccupiedBench':bypassed,'afterReaderContact':released,'reusedBySmoker':reused,'actualNewSeatedDraw':render,'health':hp,'combatStatsBefore':stats,'combatStatsAfter':combat_stats(p),'metrics':m});c.close()

def main():
 a=argparse.ArgumentParser();a.add_argument('--phase',choices=['before','after'],required=True);a.add_argument('--part',choices=['hurt','bench','arm-fixture','crash-fixture','occupancy','all'],default='all');a.add_argument('--platform',choices=['both','desktop','phone'],default='both');a.add_argument('--out',default='verification/stage18/browser');args=a.parse_args();out=(ROOT/args.out/args.phase).resolve();assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
 result={'scope':__doc__,'phase':args.phase,'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'runtimeHashes':hashes(),'conditions':{'headless':True,'physicalDevicesTested':False,'desktop':[1280,720],'touchEmulation':[844,390],'deviceScaleFactor':1,'jpegQuality':82 if args.phase=='before' else 76,'setup':'one original debug route stop per fresh context; no NPC/health/item grants in primary scenarios; native movement and existing personal-space aggression. The separately labelled right-arm renderer fixture uses the existing severe damage helper.'},'checks':[],'captures':[],'errors':[],'consoleErrors':[],'httpFailures':[]}
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);result['browser']=b.version
   for touch in ([False,True] if args.platform=='both' else [args.platform=='phone']):
    if args.part in ['hurt','all']:native_hurt(b,f'http://127.0.0.1:{server.server_port}',touch,out,result,args.phase)
    if args.part in ['arm-fixture','all']:riding_arm_fixture(b,f'http://127.0.0.1:{server.server_port}',touch,out,result,args.phase)
    if args.part=='crash-fixture':riding_arm_fixture(b,f'http://127.0.0.1:{server.server_port}',touch,out,result,args.phase,True)
    if args.part=='occupancy' and not touch:occupancy_scene(b,f'http://127.0.0.1:{server.server_port}',out,result)
    if args.part in ['bench','all'] and args.phase=='after':bench_scene(b,f'http://127.0.0.1:{server.server_port}',touch,out,result)
   b.close()
  result['runtimeHashesAfter']=hashes();result['changedRuntimeFiles']=[n for n,h in result['runtimeHashes'].items() if result['runtimeHashesAfter'].get(n)!=h]
  if args.phase=='before' and args.part=='arm-fixture':result['runtimeDriftInterpretation']='Secondary component fixture serves exact Git HEAD illustrated-hero.js read-only; unrelated concurrent bench/version edits are recorded, not hidden.'
  else:assert not result['changedRuntimeFiles']
  assert not result['errors'] and not result['consoleErrors'] and not result['httpFailures'];result['passed']=True
 except BaseException as error:result['passed']=False;result['failure']=repr(error);result['traceback']=traceback.format_exc();raise
 finally:server.shutdown();(out/'results.json').write_text(json.dumps(result,indent=2)+'\n')
 print('PASS Stage18',args.phase,len(result['checks']),'groups',len(result['captures']),'actual JPEGs',flush=True)

if __name__=='__main__':main()
