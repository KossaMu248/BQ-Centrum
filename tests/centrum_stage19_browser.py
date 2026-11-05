"""Stage19 real seating and street-pacing acceptance.

One disclosed original route stop per fresh context, then native Q/walking/bag,
pause and same-bike return. No NPC/health/item grants or later teleports. The
walk's submitted bench drawings are observed, not inferred from screenshots.
Chromium touch emulation is not physical-device/Safari or FPS evidence.
"""
import argparse,functools,hashlib,json,traceback
from http.server import ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
from centrum_stage16_browser import (ROOT,PROBE,hashes,start,warp_setup,dismount,
    street_move,route,source,bag,tap,remount_source,combat_stats)
from centrum_prop_fit_browser import PROP_PROBE,state
from centrum_economy_browser import Quiet,wait_ready
from centrum_standalone import INSTRUMENT,metrics

DENSITY_PROBE=r'''(()=>{
 const q=window.__stage19QA={recording:false,seen:{},current:[]};
 const clear=CanvasRenderingContext2D.prototype.clearRect;
 CanvasRenderingContext2D.prototype.clearRect=function(...args){if(this.canvas.id==='game')q.current=[];return clear.apply(this,args);};
 const observe=(kind,c,x,y,width,id)=>{
  if(!q.recording||c.canvas.id!=='game')return;
  const key=kind+':'+Math.round(x*100)/100;
  q.seen[key]??={kind,x,y,width,id,submissions:0};q.seen[key].submissions++;
  q.current.push({kind,x,y,width,id});
 };
 let bench;
 Object.defineProperty(window,'BearlyCentrumStreetBench',{configurable:true,get:()=>bench,set:v=>{
  bench=v;const draw=v.draw;v.draw=function(c,x,y,width,...args){
   const p=window.__propFitQA;
   if(c.canvas.id==='game'&&p?.activeProp)p.props[p.activeProp].draws.push({kind:'bench',x,y,width,matrix:c.getTransform().toJSON(),geometry:v.audit()});
   observe('authored',c,x,y,width,p?.activeProp||null);return draw.call(this,c,x,y,width,...args);
  };
 }});
 const descriptor=Object.getOwnPropertyDescriptor(window,'BearlyStreetProps');
 Object.defineProperty(window,'BearlyStreetProps',{configurable:true,get:descriptor.get,set:v=>{
  descriptor.set(v);const draw=v.draw;v.draw=function(c,key,x,y,width,...args){
   if(['bench','bench_a','bench_b','wooden_bench'].includes(key))observe('decorative',c,x,y,width,null);
   return draw.call(this,c,key,x,y,width,...args);
  };
 }});
})();'''

def actors(page):
 return page.evaluate("BearlyVisits.residents().filter(n=>['civilian-reader','civilian-bench','civilian-smoker'].includes(n.id)).map(n=>({id:n.id,x:n.x,depth:n.depth,activity:n.activity,prop:n.activityProp,state:n.state,hp:n.hp,distance:n.distance}))")

def transform(m,x,y):
 return {'x':m['a']*x+m['c']*y+m['e'],'y':m['b']*x+m['d']*y+m['f']}

def fits(page,expected_width):
 snap=state(page);result=[]
 for person in snap['residents']:
  if person['activity'] not in ['sit','read']:continue
  n=snap['render']['npcs'][person['id']];pose=person['activity']
  frame=next(f for f in snap['npcFrames'] if f['variant']==n['variant'])[pose]
  d=next(d for d in n['draws'] if d['sourcePose']==pose)
  prop=snap['render']['props'][n['prop']['id']];pd=next(p for p in prop['draws'] if p['kind']=='bench');g=pd['geometry']
  sx,sy,sw,sh=map(float,d['sourceRect'].split(','));dx,dy,dw,dh=d['destination']
  def point(x,y):return transform(d['matrix'],dx+(x-sx)*dw/sw,dy+(y-sy)*dh/sh)
  hip=point(*frame['seatPivot']);sole=point(frame['anchor'][0],frame['core'][1]+frame['core'][3]-1)
  floor=transform(pd['matrix'],pd['x'],pd['y']);scale=pd['width']/g['width']
  front=transform(pd['matrix'],pd['x'],pd['y']-g['seatPan']['front']*scale)
  rear=transform(pd['matrix'],pd['x'],pd['y']-g['seatPan']['rear']*scale)
  aspect=(dw/d['tile'][0])/(dh/d['tile'][1]);body_width=frame['core'][2]*dw/sw
  fit={'id':person['id'],'pose':pose,'source':d['source'],'sourcePivot':frame['seatPivot'],
       'width':pd['width'],'usableWidth':g['usableSeatWidth'],'bodyHeight':g['bodyHeight'],
       'seatPan':g['seatPan'],'opaqueBodyWidth':body_width,'wholePoseWidth':dw,
       'hipCanvas':hip,'panCanvas':{'front':front,'rear':rear},'soleFloorGap':sole['y']-floor['y'],'aspect':aspect}
  assert pd['width']==expected_width and g['width']==expected_width,fit
  assert g['usableSeatWidth']==132 and g['bodyHeight']==70,fit
  assert g['seatPan']=={'front':21.4,'rear':30.7},fit
  assert g['usableSeatWidth']>body_width+15 and abs(aspect-1)<1e-9,fit
  assert abs(fit['soleFloorGap'])<1 and rear['y']-1<=hip['y']<=front['y']+1,fit
  result.append(fit)
 assert result,'at least one authored promenade resident must still be sitting'
 baby=snap['source']['hero']['babyFace'];assert baby['continuousUpperBody'] and baby['originalCollar'] and not baby['headOnly']
 return result

def checkpoint(page):
 a=source(page)
 return {'x':round(a['x'],2),'depth':round(a['depth'],2),'simulationTime':round(a['combat']['time'],3),
         'health':a['combat']['hp'],'drawnBenches':page.evaluate('__stage19QA.current')}

def same_seated(initial,current):
 for n in initial:
  if n['activity'] not in ['sit','read']:continue
  actual=next(c for c in current if c['id']==n['id'])
  assert all(actual[k]==n[k] for k in ['x','depth','activity','hp','distance']),[n,actual]
  assert actual['prop']['id']==n['prop']['id']

def scenario(browser,base,touch,out,result,args):
 label='phone' if touch else 'desktop'
 c=browser.new_context(viewport={'width':844 if touch else 1280,'height':390 if touch else 720},
                       is_mobile=touch,has_touch=touch,device_scale_factor=1)
 for script in [INSTRUMENT,PROBE,PROP_PROBE,DENSITY_PROBE]:c.add_init_script(script)
 p=c.new_page();p.on('pageerror',lambda e:result['errors'].append(str(e)))
 p.on('console',lambda e:result['consoleErrors'].append(e.text) if e.type=='error' else None)
 p.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
 p.goto(base+'/index.html');wait_ready(p);start(p,touch);warp_setup(p,1600);dismount(p,touch)
 initial=actors(p);health=route(p)['health'];stats=combat_stats(p)
 geometry=fits(p,args.bench_width)
 definition=p.evaluate("()=>{const a=BearlyStreetLife.audit();return{localSlots:a.localSlots,civilianSlots:a.civilianSlots,benches:a.props.filter(p=>p.kind==='bench').map(p=>({id:p.id,x:p.x,width:p.width,seatPan:p.seatPan})),renderer:BearlyCentrumStreetBench.audit()};}")
 assert len(definition['benches'])==args.max_benches,definition
 assert {p['id'] for p in definition['benches']}=={'promenade-bench-west','promenade-bench-east','library-life-bench','greenhouse-life-bench','boathouse-life-bench'},definition
 path=out/(label+'/compact-sparse-seating.jpg');path.parent.mkdir(parents=True,exist_ok=True)
 p.screenshot(path=str(path),type='jpeg',quality=70)
 result['captures'].append({'file':path.relative_to(out).as_posix(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'actualGameplay':True})
 quiet=p.evaluate('BearlyVisits.lifeTime()');p.wait_for_function('t=>BearlyVisits.lifeTime()>=t',arg=quiet+2,timeout=30000)
 same_seated(initial,actors(p));bag(p,touch)
 tap(p,'#mobilePauseBtn','p',touch);paused=source(p);assert paused['paused'];p.wait_for_timeout(150)
 assert source(p)['x']==paused['x'] and source(p)['depth']==paused['depth'];tap(p,'#mobilePauseBtn','p',touch)
 p.evaluate('__stage19QA.recording=true');samples=[checkpoint(p)]
 street_move(p,'depth',20,touch)
 targets=[2600,3600,4600,5600] if touch else [2600,3600,4600,5600,6600,7700,8700,9400]
 for x in targets:
  street_move(p,'x',x,touch);samples.append(checkpoint(p));assert route(p)['health']==health
 seen=p.evaluate('Object.values(__stage19QA.seen)');p.evaluate('__stage19QA.recording=false')
 decorative=[x for x in seen if x['kind']=='decorative']
 assert not decorative,decorative
 authored=[x for x in seen if x['kind']=='authored']
 expected=[p for p in definition['benches'] if 1600<=p['x']<=targets[-1]]
 seen_x={round(x['x'],2) for x in authored}
 assert all(round(p['x'],2) in seen_x for p in expected),(expected,authored)
 assert len(authored)<=args.max_benches,(definition,seen)
 assert source(p)['x']>=targets[-1]-6 and route(p)['health']==health and combat_stats(p)==stats
 parked=source(p)['parkedAt'];mounted=remount_source(p,touch)
 assert mounted['grounded'] and mounted['babyMounted'] and abs(mounted['x']-parked)<5 and mounted['health']==health
 m=metrics(p);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
 result['checks'].append({'name':label+' compact seating plus native street pacing and same-bike return','passed':True,
   'initialSetupStop':1600,'initialActors':initial,'fit':geometry,'placement':definition,'nativeWalkSamples':samples,
   'observedBenches':seen,'health':health,'combatStatsBefore':stats,'combatStatsAfter':combat_stats(p),
   'return':{k:mounted[k] for k in ['x','health','grounded','babyMounted']},'metrics':m})
 c.close()

def main():
 a=argparse.ArgumentParser();a.add_argument('--out',default='verification/stage19/browser')
 a.add_argument('--platform',choices=['both','desktop','phone'],default='both');a.add_argument('--bench-width',type=float,default=168)
 a.add_argument('--max-benches',type=int,default=5);args=a.parse_args();out=(ROOT/args.out).resolve()
 assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
 result={'scope':__doc__,'harnessSHA256':hashlib.sha256(__import__('pathlib').Path(__file__).read_bytes()).hexdigest(),
  'runtimeHashes':hashes(),'conditions':{'headless':True,'physicalDevicesTested':False,'desktop':[1280,720],
  'phoneChromiumTouchEmulation':[844,390],'deviceScaleFactor':1,'jpegQuality':70,'setup':'one original route stop1600 per context, then native controls only'},
  'checks':[],'captures':[],'errors':[],'consoleErrors':[],'httpFailures':[]}
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
 Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);result['browser']=browser.version
   for touch in ([False,True] if args.platform=='both' else [args.platform=='phone']):
    scenario(browser,f'http://127.0.0.1:{server.server_port}',touch,out,result,args)
   browser.close()
  result['runtimeHashesAfter']=hashes();result['changedRuntimeFiles']=[n for n,h in result['runtimeHashes'].items() if result['runtimeHashesAfter'].get(n)!=h]
  assert not result['changedRuntimeFiles'];assert not result['errors'] and not result['consoleErrors'] and not result['httpFailures'];result['passed']=True
 except BaseException as error:
  result['passed']=False;result['failure']=repr(error);result['traceback']=traceback.format_exc();raise
 finally:
  server.shutdown();(out/'results.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
 print('PASS Stage19',len(result['checks']),'native contexts',len(result['captures']),'actual JPEGs',flush=True)

if __name__=='__main__':main()
