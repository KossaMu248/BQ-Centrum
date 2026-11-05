"""Stage16 rendered source-route and peaceful-rest acceptance.

Each scenario has one disclosed original debug route-stop setup, then native
controls. No NPC state/mood, health, inventory or quest fixture is injected.
Renderer labs and CPU profiles are separate evidence. Chromium touch emulation
is not physical iPhone/Safari testing; screencast encoding is not game FPS.
"""
import argparse,base64,functools,hashlib,json,math,shutil,subprocess,time,traceback
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
from centrum_economy_browser import Quiet,wait_ready,wait_exploration,close_dialogue,walk_to
from centrum_standalone import INSTRUMENT,metrics
ROOT=Path(__file__).resolve().parents[1]
PROBE=r'''(()=>{
 const q=window.__stage16QA={world:null,hero:null,baby:null,npcs:{},inside:false};
 const matrix=c=>({m:c.getTransform().toJSON(),w:c.canvas.width,h:c.canvas.height});
 for(const [name,method,save]of [['BearlyWorld','backstreet','world'],['BearlyHeroRig','draw','hero'],['BearlyBrawlArt','adult','npc']]){
  let object;Object.defineProperty(window,name,{configurable:true,get:()=>object,set:value=>{object=value;const original=value[method];value[method]=function(c,...args){
   if(save==='world')q.world={...matrix(c),at:performance.now()};
   if(save==='hero'){q.hero={...matrix(c),at:performance.now(),x:args[0],y:args[1],height:args[2]};q.inside=true;}
   if(save==='npc'){const n=args[0];q.npcs[n.id]={...matrix(c),id:n.id,kind:n.kind,variant:n.variant,x:args[1],y:args[2],height:args[3],state:n.state,activity:n.activity};}
   try{return original.apply(this,[c,...args]);}finally{if(save==='hero')q.inside=false;}
  };}});
 }
 const image=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(im,...args){
  if(this.canvas.id==='game'&&q.inside&&im?.dataset?.passengerPiece==='continuous-upper-body')q.baby={...matrix(this),at:performance.now(),source:im.dataset.sourceAsset};
  return image.call(this,im,...args);
 };
})();'''
def hashes():return {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted([*ROOT.glob('*.html'),*ROOT.glob('js/*.js'),*ROOT.glob('css/*.css'),ROOT/'autumn-version.json'])}
def route(page):return page.evaluate('BearlyCentrumLink.audit().route')
def source(page):return page.evaluate('BearlyVisits.audit()')
def combat_stats(page):return {k:v for k,v in source(page)['combat']['stats'].items() if k not in ['arrivals','departures']}
def rest(page):return page.evaluate("BearlyVisits.residents().filter(n=>['civilian-reader','civilian-bench','civilian-smoker'].includes(n.id)).map(n=>({id:n.id,x:n.x,depth:n.depth,activity:n.activity,prop:n.activityProp,state:n.state,hp:n.hp,visible:n.visible,active:n.active,distance:n.distance,speed:n.speed,fearUntil:n.fearUntil}))")
def compact(page):
 return page.evaluate('''()=>{const v=BearlyVisits.audit(),l=BearlyCentrumLink.audit(),q=window.__stage16QA;return{build:BEARLY_BUILD_ID,source:{mode:v.mode,transition:v.transition,place:v.place,x:v.x,depth:v.depth,jump:v.jump,paused:v.paused,parkedAt:v.parkedAt,hero:v.hero,combat:{hp:v.combat.hp,time:v.combat.time,stats:v.combat.stats,shots:v.combat.shots.length}},route:l.route,ownership:l.ownership,linkPhase:l.phase,square:BearlyCentrumSquare.active()?{sceneId:BearlyCentrumSquare.audit().sceneId,camera:BearlyCentrumSquare.audit().camera,hero:BearlyCentrumSquare.audit().hero}:null,projection:q,children:BearlyKids.audit(),npc:BearlyNpcMotion.audit(),heroCache:BearlyHeroRig.cacheStats(),inventory:BearlyCentrumInventory.audit(),fullscreen:BearlyFullscreen.state()};}''')
def capture(page,out,label,result):
 p=out/(label+'.jpg');p.parent.mkdir(parents=True,exist_ok=True);page.screenshot(path=str(p),type='jpeg',quality=94);s=compact(page);result['captures'].append({'file':p.relative_to(out).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'actualGameplay':True,'state':s});return s
class Recording:
 def __init__(self,page,out,name):
  self.active=True;self.frames=[];self.out=out;self.name=name;self.folder=out/('.frames-'+name);self.folder.mkdir();self.session=page.context.new_cdp_session(page);self.session.on('Page.screencastFrame',self.frame);self.session.send('Page.startScreencast',{'format':'jpeg','quality':80,'maxWidth':1280,'maxHeight':720,'everyNthFrame':3})
 def frame(self,event):
  if not self.active:return
  p=self.folder/f'{len(self.frames):05d}.jpg';p.write_bytes(base64.b64decode(event['data']));self.frames.append((p,event['metadata']['timestamp']));self.session.send('Page.screencastFrameAck',{'sessionId':event['sessionId']})
 def finish(self):
  self.active=False;self.session.remove_listener('Page.screencastFrame',self.frame);self.session.send('Page.stopScreencast');self.session.detach();assert len(self.frames)>10
  lines=[]
  for (p,a),(_,b) in zip(self.frames,self.frames[1:]):lines += [f"file '{p.resolve()}'",f'duration {max(.001,b-a):.6f}']
  lines.append(f"file '{self.frames[-1][0].resolve()}'");listing=self.folder/'frames.txt';listing.write_text('\n'.join(lines)+'\n');dest=self.out/(self.name+'.webm');subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-r','24','-c:v','libvpx-vp9','-cpu-used','4','-threads','2','-crf','32','-b:v','0','-pix_fmt','yuv420p',str(dest)],check=True)
  r={'file':dest.relative_to(self.out).as_posix(),'nativeSeconds':self.frames[-1][1]-self.frames[0][1],'samples':len(self.frames),'playbackSpeed':1,'encodingFps':24,'gameFpsClaim':False,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()};shutil.rmtree(self.folder);return r

def hold(page,selector,key,ms,touch):
 if touch:
  b=page.locator(selector).bounding_box();assert b,selector;s=page.context.new_cdp_session(page);s.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':b['x']+b['width']/2,'y':b['y']+b['height']/2}]});page.wait_for_timeout(ms);s.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});s.detach()
 else:page.keyboard.down(key);page.wait_for_timeout(ms);page.keyboard.up(key)
 page.wait_for_timeout(150)
def tap(page,selector,key,touch):
 if touch:page.locator(selector).tap()
 else:page.keyboard.press(key)
def street_move(page,axis,target,touch):
 for _ in range(25):
  a=source(page);d=target-a[axis]
  if abs(d)<6:return
  positive=d>0;key=('ArrowRight' if positive else 'ArrowLeft') if axis=='x' else ('ArrowDown' if positive else 'ArrowUp');selector=f'[data-direction="{1 if positive else -1}"]' if axis=='x' else f'[data-depth="{1 if positive else -1}"]'
  hold(page,selector,key,min(650,max(30,abs(d)/(120 if axis=='x' else 140)*850)),touch)
 raise AssertionError(('source waypoint',axis,target,source(page)))
def camera_scale(page,expected,source_mode=False):
 s=compact(page);p=s['projection']['world'];assert p and math.isclose(p['m']['a']/(p['w']/1160),expected,abs_tol=1e-6),(expected,p)
 if source_mode:
  page.wait_for_function("BearlyVisits.audit().hero.pose==='walking'",timeout=10000);s=compact(page)
  h=s['source']['hero'];b=h['babyFace'];assert h['height']==145 and b['continuousUpperBody'] and b['originalCollar'] and not b['headOnly'];assert math.isclose(b['uniformScale'],85/61*145/488,abs_tol=1e-9)
  assert page.evaluate('BearlyVisits.roadBabyAlpha()===0&&BearlyVisits.hideRoadBaby()'),'sole passenger must be carrier-owned on street'
 return s

def bag(page,touch):
 before=route(page)['health']
 if touch:
  selector='.square-settings' if page.evaluate('BearlyCentrumSquare.active()') else '.area-settings' if page.locator('.area-settings').is_visible() else '.ride-settings';page.locator(selector).tap();page.locator('#inventoryMenuBtn').tap()
 else:page.keyboard.press('i')
 page.wait_for_function('BearlyCentrumInventory.audit().browsing');assert page.locator('#centrumInventoryPanel').is_visible();assert route(page)['health']==before
 page.locator('#inventoryCloseBtn').tap() if touch else page.keyboard.press('i');page.wait_for_function('!BearlyCentrumInventory.audit().browsing')
 if page.evaluate('BEARLY_DEBUG_MENU.isOpen()'):page.locator('#debugCloseBtn').tap() if touch else page.keyboard.press('F3')
 assert route(page)['health']==before

def new_context(browser,base,touch,result):
 c=browser.new_context(viewport={'width':844 if touch else 1280,'height':390 if touch else 720},is_mobile=touch,has_touch=touch,device_scale_factor=1);c.add_init_script(INSTRUMENT);c.add_init_script(PROBE);p=c.new_page()
 p.on('pageerror',lambda e:result['errors'].append(str(e)));p.on('console',lambda e:result['consoleErrors'].append(e.text) if e.type=='error' else None);p.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
 p.goto(base+'/index.html');wait_ready(p);return c,p

def start(page,touch):
 camera_scale(page,1.35);page.locator('#introStart').tap() if touch else page.locator('#introStart').click();page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'");page.wait_for_timeout(200);camera_scale(page,1)
def warp_setup(page,raw):
 page.evaluate('raw=>BEARLY_DEBUG_MENU.warp(raw)',raw);page.wait_for_timeout(250)
def dismount(page,touch):
 tap(page,'.dismount-button','q',touch);page.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition",timeout=90000);page.wait_for_timeout(180);camera_scale(page,1,True)
def remount_source(page,touch):
 tap(page,'.area-exit','q',touch);page.wait_for_function('!BearlyVisits.active()',timeout=90000);page.wait_for_timeout(180);r=route(page);assert r['grounded'] and r['babyMounted'];camera_scale(page,1);return r

def ride_to(page,target,touch):
 # Native pedal/brake feedback; no position/state assignment after setup.
 for _ in range(260):
  r=route(page);x=r['x'];v=r['speed'];d=target-x
  assert r['health']>0 and r['babyMounted'],r
  if abs(d)<=75 and abs(v)<8 and r['grounded']:return r
  if d>75:
   braking=v>0 and d<max(105,v*v/2100+80)
   key='ArrowDown' if braking else ('ArrowUp' if v<270 else None)
  else:key='ArrowDown' if d<-75 or v>8 else 'ArrowUp' if v<-8 else None
  if key:hold(page,f'[data-key="{key}"]',key,100 if abs(d)<300 else 200,touch)
  else:page.wait_for_timeout(120)
 raise AssertionError(('native ride could not stop',target,route(page)))

def primary(browser,base,touch,out,result,clip):
 label='phone' if touch else 'desktop';c,p=new_context(browser,base,touch,result);start(p,touch);warp_setup(p,3700);before=route(p);dismount(p,touch);capture(p,out,label+'/street-idle',result)
 rec=Recording(p,out,label+'-source-walking') if clip else None
 for axis,target in [('x',5680),('x',5580),('depth',-60),('depth',20)]:street_move(p,axis,target,touch);camera_scale(p,1,True);capture(p,out,label+'/street-'+axis+'-'+str(target),result)
 if rec:result['recordings'].append(rec.finish())
 hp=route(p)['health'];bag(p,touch);assert route(p)['health']==hp
 tap(p,'#mobilePauseBtn','p',touch);a=source(p);assert a['paused'];p.wait_for_timeout(260);b=source(p);assert a['x']==b['x'] and a['depth']==b['depth'];capture(p,out,label+'/street-pause',result);tap(p,'#mobilePauseBtn','p',touch);assert not source(p)['paused']
 if touch:
  p.set_viewport_size({'width':390,'height':844});p.wait_for_timeout(250);camera_scale(p,1,True);x=source(p)['x'];hold(p,'[data-direction="1"]','ArrowRight',200,True);assert source(p)['x']>x+10;capture(p,out,label+'/street-portrait-movement',result);p.set_viewport_size({'width':844,'height':390});p.wait_for_timeout(250);camera_scale(p,1,True);capture(p,out,label+'/street-landscape-restored',result)
 p.locator('.area-fullscreen').tap() if touch else p.locator('.area-fullscreen').click();p.wait_for_timeout(300);camera_scale(p,1,True);capture(p,out,label+'/street-fullscreen',result);p.locator('.area-fullscreen').tap() if touch else p.locator('.area-fullscreen').click();p.wait_for_timeout(200)
 street_move(p,'x',5600,touch);tap(p,'.area-action','e',touch);p.wait_for_function("BearlyVisits.audit().mode==='room'&&!BearlyVisits.audit().transition",timeout=90000);p.wait_for_timeout(250);capture(p,out,label+'/source-workshop-room',result);room=source(p);assert room['place']=='workshop' and room['hero']['babyFace']['continuousUpperBody'];assert route(p)['health']<=hp
 hold(p,'[data-direction="1"]','ArrowRight',500,touch);assert source(p)['x']>room['x']+20;bag(p,touch);tap(p,'.area-exit','q',touch);p.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition",timeout=90000);camera_scale(p,1,True);parked=source(p)['parkedAt'];r=remount_source(p,touch);assert abs(r['x']-parked)<5;capture(p,out,label+'/source-same-bike-remount',result)
 result['checks'].append({'name':label+' native source ride/Q/walk/interior/return same grounded bicycle; camera/baby/bag/pause/fullscreen','passed':True,'initialStop':3700,'parkedAt':parked,'healthBefore':before['health'],'healthAfter':r['health'],'metrics':metrics(p)})
 # Continue the same owned bicycle along the actual route to the Centrum stop.
 ride_to(p,11325,touch);hp=route(p)['health'];tap(p,'#centrumRouteEntryBtn','e',touch);wait_exploration(p);close_dialogue(p);a=p.evaluate('BearlyCentrumSquare.audit()');assert a['camera']['zoom']==.75 and a['hero']['height']==200 and math.isclose(a['hero']['babyFace']['uniformScale'],.5710830421929589,abs_tol=1e-9);capture(p,out,label+'/centrum-wider-preserved',result)
 walk_to(p,{'x':650,'y':730});bag(p,touch);p.reload();wait_ready(p);wait_exploration(p);close_dialogue(p);a=p.evaluate('BearlyCentrumSquare.audit()');assert a['camera']['zoom']==.75 and route(p)['health']==hp
 tap(p,'.square-exit','q',touch);p.wait_for_function("BearlyCentrumLink.audit().phase==='riding'&&!BearlyVisits.active()",timeout=90000);r=route(p);assert r['grounded'] and r['babyMounted'] and r['health']==hp;capture(p,out,label+'/centrum-same-bike-remount',result)
 m=metrics(p);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes']);result['checks'].append({'name':label+' same actual bike rides to Centrum, native E/.75 view/bag/reload/Qremount, shared health and one loop','passed':True,'health':hp,'metrics':m});c.close()

def peaceful_rest(browser,base,touch,out,result):
 label='phone' if touch else 'desktop';c,p=new_context(browser,base,touch,result);start(p,touch);warp_setup(p,1600);dismount(p,touch);initial=rest(p);assert len(initial)==3
 expected={'civilian-reader':'read','civilian-smoker':'smoke','civilian-bench':'sit'}
 for n in initial:assert n['activity']==expected[n['id']] and n['prop'],n
 capture(p,out,label+'/peaceful-before',result);t=p.evaluate('BearlyVisits.lifeTime()');seconds=18 if touch else 32
 p.wait_for_function('goal=>BearlyVisits.lifeTime()>=goal',arg=t+seconds,timeout=90000);after=rest(p)
 for n in after:
  old=next(a for a in initial if a['id']==n['id']);assert n['activity']==old['activity'] and n['prop']['id']==old['prop']['id'] and n['x']==old['x'] and n['depth']==old['depth'] and n['hp']==old['hp'] and n['distance']==old['distance'],(old,n)
 capture(p,out,label+'/peaceful-after-'+str(seconds)+'s',result);bench=next(n for n in after if n['id']=='civilian-bench');hp=route(p)['health'];stats=combat_stats(p);street_move(p,'x',bench['x']+48,touch);street_move(p,'depth',bench['depth'],touch);near=next(n for n in rest(p) if n['id']==bench['id']);assert near['activity']=='sit','mere nearby pass must not disturb the seat'
 capture(p,out,label+'/peaceful-near-pass',result);street_move(p,'x',bench['x']+20,touch);p.wait_for_timeout(200);bumped=next(n for n in rest(p) if n['id']==bench['id']);capture(p,out,label+'/peaceful-actual-bump',result);result.setdefault('restDiagnostics',[]).append({'platform':label,'beforeHealth':hp,'afterHealth':route(p)['health'],'beforeCombatStats':stats,'afterCombatStats':combat_stats(p),'afterBump':bumped});assert bumped['activity']!='sit' and bumped['prop'] is None and bumped['hp']==bench['hp'];assert route(p)['health']==hp and combat_stats(p)==stats
 result['checks'].append({'name':label+' authored reader/smoker/bench remain peacefully resting past timers; real foot contact wakes without damage/reward','passed':True,'quietSimulationSeconds':seconds,'combatStatsBefore':stats,'combatStatsAfter':combat_stats(p),'initial':initial,'afterQuiet':after,'afterNearby':near,'afterBump':bumped,'health':hp,'metrics':metrics(p)});remount_source(p,touch);c.close()

def hint_clearance(page):
 return page.evaluate("""()=>{const h=BearlyVisits.audit().hero.babyFace,q=__stage16QA.baby,c=document.getElementById('game'),r=c.getBoundingClientRect(),msg=document.querySelector('.area-message'),b=msg.getBoundingClientRect(),style=getComputedStyle(c),f=style.objectFit==='cover'?Math.max(r.width/c.width,r.height/c.height):Math.min(r.width/c.width,r.height/c.height),ox=r.left+(r.width-c.width*f)/2,oy=r.top+(r.height-c.height*f)/2,[x,y,w,z]=h.head,[px,py]=h.pivot,m=q.m,points=[[x-px,y-py],[x+w-px,y-py],[x-px,y+z-py],[x+w-px,y+z-py]].map(([a,d])=>({x:ox+(m.a*a+m.c*d+m.e)*f,y:oy+(m.b*a+m.d*d+m.f)*f})),xs=points.map(p=>p.x),ys=points.map(p=>p.y),head={left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)},visible=!msg.hidden&&b.width>0&&b.height>0,overlap=Math.max(0,Math.min(head.right,b.right)-Math.max(head.left,b.left))*Math.max(0,Math.min(head.bottom,b.bottom)-Math.max(head.top,b.top));return {visible,side:msg.dataset.side,panelMode:document.querySelector('.area-panel').dataset.mode,text:msg.textContent,head,headSource:q.source,headSourceRect:h.head,message:b.toJSON(),objectFit:style.objectFit,contentScale:f,overlapCssPixels:overlap,routeStyleLoaded:[...document.styleSheets].some(s=>s.href?.includes('centrum-route.css'))};}""")

def transfer_supplement(browser,base,touch,out,result):
 label='phone' if touch else 'desktop';c,p=new_context(browser,base,touch,result);start(p,touch);warp_setup(p,3700);before=route(p)
 tap(p,'.dismount-button','q',touch);p.wait_for_function("BearlyVisits.audit().transition==='dismount'&&BearlyVisits.audit().phase>=.4",timeout=90000);capture(p,out,label+'/native-transfer-to-carrier',result)
 p.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition",timeout=90000);camera_scale(p,1,True);hold(p,'[data-direction="1"]','ArrowRight',300,touch);camera_scale(p,1,True);capture(p,out,label+'/native-carrier-walk',result);clearance=hint_clearance(p);assert clearance['visible'] and clearance['routeStyleLoaded'] and clearance['panelMode']=='street' and clearance['overlapCssPixels']==0,clearance;result.setdefault('hintClearance',[]).append({'platform':label,**clearance});bag(p,touch)
 tap(p,'.area-exit','q',touch);p.wait_for_function("BearlyVisits.audit().transition==='mount'&&BearlyVisits.audit().phase>=.4",timeout=90000);capture(p,out,label+'/native-transfer-to-chair',result)
 p.wait_for_function('!BearlyVisits.active()',timeout=90000);after=route(p);camera_scale(p,1);capture(p,out,label+'/native-same-bike-remounted',result);assert abs(after['x']-before['x'])<5 and after['grounded'] and after['babyMounted'] and after['health']==before['health'];m=metrics(p);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
 result['checks'].append({'name':label+' final Hero transfer-clip repair native Q/carrier walk/bag/same-bike grounded remount','passed':True,'initialStop':3700,'before':before,'after':after,'metrics':m});c.close()

def actual_kids(browser,base,touch,out,result):
 label='phone' if touch else 'desktop';c,p=new_context(browser,base,touch,result);start(p,touch);warp_setup(p,2720);p.wait_for_timeout(300);s=capture(p,out,label+'/route-smaller-children',result);assert s['children']['worldHeight']==94 and s['children']['adultReferenceHeight']==128
 drawn=s['children']['drawn'];assert drawn,'actual route must draw the nearby child gang cast'
 for d in drawn.values():assert math.isclose(d['height'],94,abs_tol=1e-6),d
 dismount(p,touch);hold(p,'[data-direction="1"]','ArrowRight',300,touch);s=capture(p,out,label+'/street-smaller-children',result);assert s['children']['drawn'];assert s['source']['hero']['height']==145
 for d in s['children']['drawn'].values():assert math.isclose(d['height'],145*.88*94/128,abs_tol=1e-6),d
 result['checks'].append({'name':label+' actual route and source-street child identities use94/128 physical proportion with original sprite sources','passed':True,'children':s['children'],'npcs':s['projection']['npcs']});c.close()

def main():
 a=argparse.ArgumentParser();a.add_argument('--out',default='verification/stage16/browser');a.add_argument('--platform',choices=['both','desktop','phone'],default='both');a.add_argument('--part',choices=['all','primary','rest','kids','transfer'],default='all');a.add_argument('--clip',action='store_true');args=a.parse_args();out=(ROOT/args.out).resolve();assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
 r={'scope':__doc__,'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'runtimeHashes':hashes(),'conditions':{'headless':True,'physicalDevice':False,'desktop':[1280,720],'phoneChromiumTouchEmulation':[844,390],'deviceScaleFactor':1,'initialSetups':'one original debug stop per scenario/context; no further state or health grants','timing':'functional/recording, not exclusive performance'},'checks':[],'captures':[],'recordings':[],'errors':[],'consoleErrors':[],'httpFailures':[]}
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);r['browser']=b.version
   for touch in ([False,True] if args.platform=='both' else [args.platform=='phone']):
    if args.part in ['all','primary']:primary(b,f'http://127.0.0.1:{server.server_port}',touch,out,r,args.clip)
    if args.part in ['all','rest']:peaceful_rest(b,f'http://127.0.0.1:{server.server_port}',touch,out,r)
    if args.part in ['all','transfer']:transfer_supplement(b,f'http://127.0.0.1:{server.server_port}',touch,out,r)
    if args.part in ['all','kids']:actual_kids(b,f'http://127.0.0.1:{server.server_port}',touch,out,r)
   b.close()
  assert not r['errors'] and not r['consoleErrors'] and not r['httpFailures'];r['runtimeHashesAfter']=hashes();r['changedRuntimeFiles']=[p for p,h in r['runtimeHashes'].items() if r['runtimeHashesAfter'].get(p)!=h];assert not r['changedRuntimeFiles'];r['passed']=True
 except BaseException as error:r['passed']=False;r['failure']=repr(error);r['traceback']=traceback.format_exc();raise
 finally:server.shutdown();(out/'results.json').write_text(json.dumps(r,indent=2)+'\n')
 print('PASS Stage16 real gameplay:',len(r['checks']),'groups',len(r['captures']),'normal captures',flush=True)
if __name__=='__main__':main()
