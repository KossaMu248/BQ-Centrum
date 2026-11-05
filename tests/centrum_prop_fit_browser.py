"""Stage17 actual NPC/prop fit: same authored residents before and after repair.

One original debug route-stop setup per fresh context; native Q, walking, pause,
inventory and contact thereafter. No NPC/health/item/quest grants. Browser probes
only observe render arguments and Canvas matrices. Chromium touch emulation is
not physical-device/Safari evidence. These are functional, not FPS tests.
"""
import argparse,functools,hashlib,json,math,traceback
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
from centrum_stage16_browser import (ROOT,PROBE,Recording,hashes,new_context,start,
    warp_setup,dismount,rest,route,source,street_move,camera_scale,bag,remount_source,
    hold,tap,combat_stats)
from centrum_economy_browser import Quiet
from centrum_standalone import metrics

PROP_PROBE=r'''(()=>{
 const q=window.__propFitQA={npcs:{},props:{},active:null,activeProp:null,order:[]};
 let motion,life,props;
 const clear=CanvasRenderingContext2D.prototype.clearRect;
 CanvasRenderingContext2D.prototype.clearRect=function(...args){if(this.canvas.id==='game')q.order=[];return clear.apply(this,args);};
 const hero=Object.getOwnPropertyDescriptor(window,'BearlyHeroRig');
 Object.defineProperty(window,'BearlyHeroRig',{configurable:true,get:hero.get,set:v=>{hero.set(v);const draw=v.draw;v.draw=function(c,...args){if(c.canvas.id==='game')q.order.push({kind:'player',x:args[0],y:args[1]});return draw.call(this,c,...args);};}});
 Object.defineProperty(window,'BearlyNpcMotion',{configurable:true,get:()=>motion,set:v=>{motion=v;const draw=v.draw;v.draw=function(c,n,x,y,h,scale,...args){
  if(c.canvas.id==='game'){q.active=n.id;q.order.push({kind:'npc',id:n.id});q.npcs[n.id]={id:n.id,variant:n.variant,activity:n.activity,state:n.state,x,y,height:h,scale,prop:n.activityProp?{...n.activityProp}:null,baseMatrix:c.getTransform().toJSON(),draws:[]};}
  try{return draw.call(this,c,n,x,y,h,scale,...args);}finally{if(c.canvas.id==='game'&&q.npcs[n.id])q.npcs[n.id].audit=v.audit();q.active=null;}
 };}});
 Object.defineProperty(window,'BearlyStreetLife',{configurable:true,get:()=>life,set:v=>{life=v;const draw=v.drawProp;v.drawProp=function(c,p,...args){
  if(c.canvas.id==='game'){q.activeProp=p.id;q.order.push({kind:'prop',id:p.id});q.props[p.id]={...p,matrix:c.getTransform().toJSON(),draws:[]};}
  try{return draw.call(this,c,p,...args);}finally{q.activeProp=null;}
 };}});
 Object.defineProperty(window,'BearlyStreetProps',{configurable:true,get:()=>props,set:v=>{props=v;const draw=v.draw;v.draw=function(c,key,x,y,width,...args){if(c.canvas.id==='game'&&q.activeProp)q.props[q.activeProp].draws.push({kind:key,x,y,width,matrix:c.getTransform().toJSON()});return draw.call(this,c,key,x,y,width,...args);};}});
 const image=CanvasRenderingContext2D.prototype.drawImage;
 CanvasRenderingContext2D.prototype.drawImage=function(im,...args){
  if(this.canvas.id==='game'&&q.active&&im?.dataset?.sourceAsset){q.npcs[q.active].draws.push({source:im.dataset.sourceAsset,sourceRect:im.dataset.sourceRect,sourcePose:im.dataset.sourcePose,sourceVariant:im.dataset.sourceVariant,tile:[im.width,im.height],destination:args,matrix:this.getTransform().toJSON()});}
  return image.call(this,im,...args);
 };
})();'''

def state(page):
 return page.evaluate('''()=>{const v=BearlyVisits.audit();return {build:BEARLY_BUILD_ID,source:{mode:v.mode,x:v.x,depth:v.depth,paused:v.paused,parkedAt:v.parkedAt,hero:v.hero},route:BearlyCentrumLink.audit().route,residents:BearlyVisits.residents().filter(n=>['civilian-reader','civilian-bench','civilian-smoker'].includes(n.id)).map(n=>({id:n.id,variant:n.variant,x:n.x,depth:n.depth,activity:n.activity,prop:n.activityProp,state:n.state,hp:n.hp,distance:n.distance,face:n.face})),streetLife:BearlyStreetLife.audit(),render:__propFitQA,npcFrames:[9,10,11].map(v=>({variant:v,sit:BearlyNpcMotion.frame(v,'sit'),read:BearlyNpcMotion.frame(v,'read'),idle:BearlyNpcMotion.frame(v,'idle'),smoke:BearlyNpcMotion.frame(v,'smoke')})),metrics:null};}''')

def compact_state(snap):
 """Keep actual relevant observations without duplicating unrelated scene data."""
 ids={'civilian-reader','civilian-bench','civilian-smoker'}
 propids={'promenade-bench-east','promenade-bench-west','promenade-smoke'}
 hero=snap['source']['hero'];baby=hero['babyFace']
 return {'build':snap['build'],'source':{k:v for k,v in snap['source'].items() if k!='hero'},
  'hero':{k:hero.get(k) for k in ['pose','height','source','lowerPose','authoredLowerBody']},
  'baby':{k:baby.get(k) for k in ['source','mood','continuousUpperBody','originalCollar','headOnly','uniformScale','pose']},
  'route':{k:snap['route'].get(k) for k in ['routeId','x','health','grounded','babyMounted','simTime','lifeTime']},
  'residents':snap['residents'],'props':[p for p in snap['streetLife']['drawnProps'] if p['id'] in propids],
  'render':{'npcs':{k:v for k,v in snap['render']['npcs'].items() if k in ids},'props':{k:v for k,v in snap['render']['props'].items() if k in propids},'order':snap['render']['order']}}

def capture(page,out,label,result):
 path=out/(label+'.jpg');path.parent.mkdir(parents=True,exist_ok=True)
 page.screenshot(path=str(path),type='jpeg',quality=90)
 snap=state(page);result['captures'].append({'file':path.relative_to(out).as_posix(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'actualGameplay':True,'state':compact_state(snap)});return snap

def same_rest(initial,current):
 for n in current:
  old=next(x for x in initial if x['id']==n['id'])
  assert n['activity']==old['activity'] and n['prop']['id']==old['prop']['id'] and n['x']==old['x'] and n['depth']==old['depth'] and n['hp']==old['hp'] and n['distance']==old['distance'],(old,n)

def scenario(browser,base,touch,out,result,phase,clip):
 label='phone' if touch else 'desktop';c=browser.new_context(viewport={'width':844 if touch else 1280,'height':390 if touch else 720},is_mobile=touch,has_touch=touch,device_scale_factor=1)
 from centrum_standalone import INSTRUMENT
 c.add_init_script(INSTRUMENT);c.add_init_script(PROBE);c.add_init_script(PROP_PROBE)
 p=c.new_page();p.on('pageerror',lambda e:result['errors'].append(str(e)));p.on('console',lambda e:result['consoleErrors'].append(e.text) if e.type=='error' else None);p.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
 from centrum_economy_browser import wait_ready
 p.goto(base+'/index.html');wait_ready(p);start(p,touch);warp_setup(p,1600);dismount(p,touch)
 initial=rest(p);assert len(initial)==3
 assert {n['id']:n['activity'] for n in initial}=={'civilian-reader':'read','civilian-smoker':'smoke','civilian-bench':'sit'}
 capture(p,out,label+'/resting-prop-fit',result)
 p.wait_for_timeout(1100);same_rest(initial,rest(p))
 if phase=='before':capture(p,out,label+'/resting-prop-fit-quiet',result)
 if phase=='after':
  # Functional acceptance is extended once the final shared fit API is frozen.
  verify_after(p,touch,out,result,label,initial,clip)
 else:
  result['checks'].append({'name':label+' Stage16 baseline actual authored benches/reader/smoker','passed':True,'initialSetup':1600,'residents':initial,'metrics':metrics(p)})
 c.close()

def verify_after(page,touch,out,result,label,initial,clip):
 snap=state(page);fits=[]
 for ident in ['civilian-reader','civilian-bench']:
  n=snap['render']['npcs'][ident];pose='read' if ident=='civilian-reader' else 'sit'
  frame=next(f for f in snap['npcFrames'] if f['variant']==n['variant'])[pose]
  d=next(d for d in n['draws'] if d['sourcePose']==pose)
  prop=snap['render']['props'][n['prop']['id']];pd=next(x for x in prop['draws'] if x['kind']=='bench')
  def transform(m,x,y):return {'x':m['a']*x+m['c']*y+m['e'],'y':m['b']*x+m['d']*y+m['f']}
  def point(x,y):
   sx,sy,sw,sh=map(float,d['sourceRect'].split(','));dx,dy,dw,dh=d['destination'];return transform(d['matrix'],dx+(x-sx)*dw/sw,dy+(y-sy)*dh/sh)
  hip=point(*frame['seatPivot']);sole=point(frame['anchor'][0],frame['core'][1]+frame['core'][3]-1)
  floor=transform(pd['matrix'],pd['x'],pd['y']);ownFloor=transform(n['baseMatrix'],n['x'],n['y'])
  benchScale=pd['width']/180;surface=transform(pd['matrix'],pd['x'],pd['y']-35*benchScale)
  # This existing painted seat is sloped: the actual pan runs from native
  # y=-39.5 rear to-27.5 front, rather than being a single nominal35-height line.
  seatRear=transform(pd['matrix'],pd['x'],pd['y']-39.5*benchScale);seatFront=transform(pd['matrix'],pd['x'],pd['y']-27.5*benchScale)
  fit={'id':ident,'variant':n['variant'],'source':d['source'],'pose':pose,'sourceSeatPivot':frame['seatPivot'],'sourceOpaqueSoleY':frame['core'][1]+frame['core'][3]-1,'benchWidth':pd['width'],'benchSeatHeight':35*benchScale,'hipCanvas':hip,'seatCanvas':surface,'seatPanCanvas':{'rear':seatRear,'front':seatFront},'opaqueSoleCanvas':sole,'benchFloorCanvas':floor,'ownGroundCanvas':ownFloor,'hipSeatGap':hip['y']-surface['y'],'soleFloorGap':sole['y']-floor['y'],'soleOwnGroundGap':sole['y']-ownFloor['y'],'imageAspect':(d['destination'][2]/d['tile'][0])/(d['destination'][3]/d['tile'][1]),'renderAudit':n.get('audit')}
  # Two independent source/art contacts: original opaque sole to floor, and
  # original authored hip to the existing painted seat. No image is stretched.
  assert abs(fit['soleFloorGap'])<=2,fit
  assert seatRear['y']-1<=hip['y']<=seatFront['y']+1,fit
  assert abs(fit['imageAspect']-1)<=1e-9,fit
  fits.append(fit)
 result.setdefault('fitMeasurements',[]).append({'platform':label,'fits':fits})
 smoker=snap['render']['npcs']['civilian-smoker'];smokeProp=snap['render']['props'][smoker['prop']['id']];smokeDraw=next(d for d in smokeProp['draws'] if d['kind']=='bin')
 smokeFit={'platform':label,'id':'civilian-smoker','anchorX':smoker['x'],'binX':smokeDraw['x'],'binWidth':smokeDraw['width'],'horizontalSeparation':abs(smoker['x']-smokeDraw['x'])}
 assert smokeFit['horizontalSeparation']>=smokeFit['binWidth']/2+20,smokeFit
 result.setdefault('smokingPropMeasurements',[]).append(smokeFit)
 quietTime=page.evaluate('BearlyVisits.lifeTime()')
 page.wait_for_function('t=>BearlyVisits.lifeTime()>=t',arg=quietTime+5,timeout=30000);same_rest(initial,rest(page))
 hp=route(page)['health'];stats=combat_stats(page);bench=next(x for x in initial if x['id']=='civilian-bench')
 rec=Recording(page,out,label+'-seating-contact-walk') if clip and not touch else None
 # Stay in front of the bench while approaching; this is a quiet near-pass.
 street_move(page,'depth',-30,touch);street_move(page,'x',bench['x'],touch)
 same_rest(initial,rest(page));front=state(page)
 order=front['render']['order'];pi=next(i for i,e in enumerate(order) if e['kind']=='player');bi=next(i for i,e in enumerate(order) if e.get('id')==bench['prop']['id'] and e['kind']=='prop');assert pi>bi,order
 # Move clear horizontally before entering the seat's actual contact lane.
 street_move(page,'x',bench['x']+55,touch);street_move(page,'depth',bench['depth'],touch);street_move(page,'x',bench['x']+20,touch)
 page.wait_for_timeout(300);now=next(x for x in rest(page) if x['id']==bench['id']);assert now['activity']!='sit' and now['prop'] is None and now['hp']==bench['hp'],now
 capture(page,out,label+'/contact-stands-and-walks',result)
 page.wait_for_timeout(700);street_move(page,'depth',-90,touch);street_move(page,'x',bench['x'],touch)
 behind=capture(page,out,label+'/walk-behind-empty-bench',result);order=behind['render']['order'];pi=next(i for i,e in enumerate(order) if e['kind']=='player');bi=next(i for i,e in enumerate(order) if e.get('id')==bench['prop']['id'] and e['kind']=='prop');assert pi<bi,order
 if rec:result['recordings'].append(rec.finish())
 assert route(page)['health']==hp and combat_stats(page)==stats
 bag(page,touch);tap(page,'#mobilePauseBtn','p',touch);paused=source(page);assert paused['paused'];page.wait_for_timeout(200);assert source(page)['x']==paused['x'] and source(page)['depth']==paused['depth'];tap(page,'#mobilePauseBtn','p',touch)
 parked=source(page)['parkedAt'];mounted=remount_source(page,touch);assert mounted['grounded'] and mounted['babyMounted'] and abs(mounted['x']-parked)<5 and mounted['health']==hp
 m=metrics(page);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
 result['checks'].append({'name':label+' original seated art/feet fit bench; quiet rest, front/behind sorting, contact stand/walk, bag/pause/same-bike return','passed':True,'initialSetup':1600,'quietSimulationSeconds':5,'frontRenderOrder':front['render']['order'],'behindRenderOrder':behind['render']['order'],'afterContact':now,'health':hp,'combatStatsBefore':stats,'combatStatsAfter':combat_stats(page),'metrics':m})

def main():
 a=argparse.ArgumentParser();a.add_argument('--phase',choices=['before','after'],required=True);a.add_argument('--platform',choices=['both','desktop','phone'],default='both');a.add_argument('--out',default='verification/stage17/browser');a.add_argument('--clip',action='store_true');args=a.parse_args();out=(ROOT/args.out/args.phase).resolve();assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
 result={'scope':__doc__,'phase':args.phase,'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'runtimeHashes':hashes(),'conditions':{'headless':True,'physicalDevicesTested':False,'desktop':[1280,720],'touchEmulation':[844,390],'deviceScaleFactor':1,'jpegQuality':90,'setup':'one original debug route stop per fresh context, then native controls; no state grants'},'checks':[],'captures':[],'recordings':[],'errors':[],'consoleErrors':[],'httpFailures':[]}
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);result['browser']=browser.version
   for touch in ([False,True] if args.platform=='both' else [args.platform=='phone']):scenario(browser,f'http://127.0.0.1:{server.server_port}',touch,out,result,args.phase,args.clip)
   browser.close()
  result['runtimeHashesAfter']=hashes();result['changedRuntimeFiles']=[name for name,h in result['runtimeHashes'].items() if result['runtimeHashesAfter'].get(name)!=h];assert not result['changedRuntimeFiles'];assert not result['errors'] and not result['consoleErrors'] and not result['httpFailures'];result['passed']=True
 except BaseException as error:result['passed']=False;result['failure']=repr(error);result['traceback']=traceback.format_exc();raise
 finally:server.shutdown();(out/'results.json').write_text(json.dumps(result,indent=2)+'\n')
 print('PASS Stage17',args.phase,len(result['checks']),'groups',len(result['captures']),'real screenshots',flush=True)

if __name__=='__main__':main()
