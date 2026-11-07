"""Stage25 actual leg-volume/backstroke review.

One disclosed original route-stop helper per fresh context, followed by native
movement, parking, pause/bag and remount controls. Actual HeroRig.draw results
are sampled after painting; no render-pose or foot-position fixture is used.
Before serves this target's pinned Stage24 HTML/JS through read-only Git fulfil.
Normal native screenshots/clips are retained beside clearly labelled enlarged
backstroke crops. Volume/width geometry is tested separately; occlusion is not
mislabelled as loss of limb mass. CDP/frame review is not physical/human/Safari testing.
"""
import argparse,functools,hashlib,json,math,shutil,statistics,subprocess,traceback
from pathlib import Path
from http.server import ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
import centrum_stage23_browser as old
from centrum_economy_browser import Quiet,wait_ready,wait_exploration,close_dialogue,walk_to,sq
from centrum_stage16_browser import warp_setup,route,source,bag,tap,hashes,Recording
from centrum_stage20_browser import held
from centrum_standalone import metrics
ROOT=Path(__file__).resolve().parents[1]
BASELINE='a3a7da89252d75bbdadb06596fc5ff3c589d9153'
old.BASELINE=BASELINE
DRAW_PROBE=r'''()=>{
 const q=window.__stride25={record:false,frames:[]},rig=BearlyHeroRig,draw=rig.draw;
 rig.draw=function(c,x,y,h,face,options){
  const m=c.getTransform(),result=draw.apply(this,arguments);
  if(q.record&&c.canvas.id==='game'){
   const a=rig.audit(),near=a.landmarks?.near,far=a.landmarks?.far,r=c.canvas.getBoundingClientRect(),fit=getComputedStyle(c.canvas).objectFit;
   let sx=r.width/c.canvas.width,sy=r.height/c.canvas.height,ox=0,oy=0;
   if(fit==='cover'||fit==='contain'){const scale=fit==='cover'?Math.max(sx,sy):Math.min(sx,sy);sx=sy=scale;ox=(r.width-c.canvas.width*scale)/2;oy=(r.height-c.canvas.height*scale)/2;}
   const point=l=>l?{x:l.sole.x,y:l.sole.y,hipX:l.hip.x,hipY:l.hip.y,kneeX:l.knee.x,kneeY:l.knee.y,cuffX:l.cuff?.x,cuffY:l.cuff?.y,stance:l.stance,contact:l.contact,bootWidth:l.bootWidth}:null;
   q.frames.push({now:performance.now(),epoch:(performance.timeOrigin+performance.now())/1000,x,y,h,face,carrier:a.carrier,paused:(BearlyCentrumSquare.active()?BearlyCentrumSquare.audit().paused:BearlyVisits.active()?BearlyVisits.audit().paused:false),pose:a.pose,phase:a.gait?.phase,renderedPhase:a.body?.cachePhase??a.gait?.phase,weight:a.raster?.renderedWeight??options?.weight,requestedPhase:a.raster?.requestedPhase,near:point(near),far:point(far),body:a.body?{bob:a.body.bob,roll:a.body.roll}:null,limbAudit:a.anatomy||null,baby:a.babyFace?{source:a.babyFace.source,continuousUpperBody:a.babyFace.continuousUpperBody,originalCollar:a.babyFace.originalCollar,uniformScale:a.babyFace.uniformScale}:null,originScreen:{x:r.x+ox+(m.a*x+m.c*y+m.e)*sx,y:r.y+oy+(m.b*x+m.d*y+m.f)*sy},raster:a.raster||null});
  }
  return result;
 };
}'''
def state(p,mode):return sq(p) if mode=='square' else source(p)
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def cycle_count(frames):
 phases=[x['renderedPhase'] for x in frames if x.get('renderedPhase') is not None];total=0
 for a,b in zip(phases,phases[1:]):
  d=b-a
  if d<-.5:d+=1
  elif d>.5:d-=1
  total+=d
 return total

def stride_summary(frames):
 f=[x for x in frames if x['pose']=='walking' and not x.get('paused',False) and (x.get('weight')or 0)>=.999 and x['near'] and x['far']]
 assert len(f)>15,'Actual steady painted walking frames are required'
 separation=[x['near']['x']-x['far']['x'] for x in f]
 ranges={}
 for side in ['near','far']:
  local=[x[side]['x']-(x['near']['hipX']+x['far']['hipX'])/2 for x in f]
  stance=[(a,b) for a,b in zip(f,f[1:]) if a[side]['stance'] and b[side]['stance'] and 0<b['epoch']-a['epoch']<.15]
  backward=[b[side]['x']-a[side]['x'] for a,b in stance]
  ranges[side]={'relativeToCommonHipMin':min(local),'relativeToCommonHipMax':max(local),'soleLocalMin':min(x[side]['x'] for x in f),'soleLocalMax':max(x[side]['x'] for x in f),'paintedStancePairCount':len(stance),'paintedStanceBackwardPairs':sum(d<-.02 for d in backward),'stanceMedianLocalDelta':statistics.median(backward) if backward else None}
 return{'actualPaintedFrames':len(f),'renderedCycles':cycle_count(f),'nearMinusFarMin':min(separation),'nearMinusFarMax':max(separation),'footOrderingSwaps':sum(a*b<0 for a,b in zip(separation,separation[1:])), 'bothFeetTakeTheLead':min(separation)<-1 and max(separation)>1,'leadSpanBalanceRatio':min(abs(min(separation)),abs(max(separation)))/max(abs(min(separation)),abs(max(separation))),'feet':ranges}

def painted_segment_lengths(frames):
 rows=[f for f in frames if f['pose']=='walking' and not f.get('paused') and (f.get('weight')or 0)>=.999 and f.get('near') and f.get('far')]
 report={}
 for side in ['near','far']:
  thigh=[];shin=[];expected_errors=[]
  for f in rows:
   p=f[side];thigh.append(math.hypot(p['hipX']-p['kneeX'],p['hipY']-p['kneeY']));shin.append(math.hypot(p['kneeX']-p['cuffX'],p['kneeY']-p['cuffY']))
   segment=(f.get('limbAudit')or{}).get('segments',{}).get(side)
   assert segment,('Missing production rigid-segment audit',f['pose'],side)
   scale=f['h']/280
   expected_errors.extend([abs(thigh[-1]-segment['thigh']*scale),abs(shin[-1]-segment['shin']*scale)])
  assert thigh and shin
  report[side]={'actualPaintedSamples':len(thigh),'thighMin':min(thigh),'thighMax':max(thigh),'shinMin':min(shin),'shinMax':max(shin),'thighRelativeSpread':max(thigh)/min(thigh)-1,'shinRelativeSpread':max(shin)/min(shin)-1,'maximumRestLengthError':max(expected_errors)}
  assert report[side]['thighRelativeSpread']<.005 and report[side]['shinRelativeSpread']<.005,('Painted leg changes length through stride',side,report[side])
  assert report[side]['maximumRestLengthError']<1e-4,('Painted joints disagree with canonical rigid-segment lengths',side,report[side])
 return report

def native_stills(rec,frames,out,label,direction,result):
 # Pick each quarter of a late full actual rendered cycle, then copy the closest
 # screencast JPEG without resizing or compositing it. These are game frames.
 valid=[x for x in frames if x['pose']=='walking' and x['near'] and x.get('weight',0)>=.999]
 assert valid
 start=valid[0]['epoch']+.55;valid=[x for x in valid if x['epoch']>=start]
 selected=[]
 for target in [0,.125,.25,.375,.5,.625,.75,.875]:
  candidates=[x for x in valid if abs(((x['renderedPhase']-target+.5)%1)-.5)<=1/48+1e-6]
  assert candidates
  choices=[(f,*min(rec.frames,key=lambda item:abs(item[1]-f['epoch']))) for f in candidates]
  f,p,t=min(choices,key=lambda row:(abs(row[2]-row[0]['epoch']),abs(((row[0]['renderedPhase']-target+.5)%1)-.5)))
  assert abs(t-f['epoch'])<.15,('Screencast/game-clock mismatch',t,f['epoch'])
  dest=out/(label+'/'+direction+'-phase-'+str(target)+'.jpg');dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dest)
  entry={'file':dest.relative_to(out).as_posix(),'sha256':digest(dest),'scope':'Unmodified normal-size native CDP gameplay JPEG, selected by actual painted phase; not a generated illustration.','targetPhase':target,'paintedFrame':f,'screencastTimestamp':t,'timestampGapSeconds':abs(t-f['epoch'])}
  result['captures'].append(entry);selected.append(entry)
 return selected

def hold_stride(p,mode,touch,direction,rec,out,label,result,args):
 before=state(p,mode);start=before['x'];hp=route(p)['health']
 p.evaluate('()=>{__stride25.frames=[];__stride25.record=true;__move20.samples=[];__move20.mode='+json.dumps(mode)+';__move20.record=true}')
 held(p,mode,['ArrowRight' if direction=='right' else 'ArrowLeft'],touch,2600)
 p.evaluate('()=>{__stride25.record=false;__move20.record=false}')
 frames=p.evaluate('__stride25.frames');samples=p.evaluate('__move20.samples');after=state(p,mode)
 assert route(p)['health']==hp and not any(x.get('hits') for x in samples)
 assert (after['x']-start)*(1 if direction=='right' else -1)>250
 summary=stride_summary(frames);assert summary['renderedCycles']>=3,summary
 if args.phase=='after':summary['paintedSegmentLengths']=painted_segment_lengths(frames)
 for f in frames:
  if f['pose']=='walking':assert f['baby']['continuousUpperBody'] and f['baby']['originalCollar']
 captures=native_stills(rec,frames,out,label,direction,result)
 result['segments'].append({'label':label,'mode':mode,'direction':direction,'requestedHoldMs':2600,'fromX':start,'toX':after['x'],'health':hp,'summary':summary,'frames':frames,'movementSamples':samples,'captures':[x['file'] for x in captures]})
 if args.phase=='after' and args.require_alternation:
  assert summary['bothFeetTakeTheLead'],(label,direction,'Actual painted feet never exchange the lead',summary)
  assert summary['leadSpanBalanceRatio']>=.8,(label,direction,'One half-cycle still dominates the opposite visible step',summary)
  for side in ['near','far']:
   f=summary['feet'][side];assert f['relativeToCommonHipMin']<-1 and f['relativeToCommonHipMax']>1,(label,direction,side,'Must pass behind and ahead of common hip',f)
 p.wait_for_timeout(220)


def scenario(browser,base,out,touch,mode,result,args):
 label=('phone' if touch else 'desktop')+'-'+mode
 c,p=old.context(browser,base,touch,result,args.phase)
 p.evaluate(DRAW_PROBE)
 warp_setup(p,7550 if mode=='square' else 1600)
 if mode=='square':tap(p,'#centrumRouteEntryBtn','e',touch);wait_exploration(p);close_dialogue(p);walk_to(p,{'x':500,'y':650},touch)
 else:old.dismount(p,touch)
 if args.phase=='after':p.wait_for_timeout(350)  # Native released controls settle before the first recorded step.
 assert p.evaluate('BEARLY_BUILD_ID')==('BQ_CENTRUM_STAGE24' if args.phase=='before' else args.expect_build)
 expected=.6 if mode=='square' else .8;old.projection(p,mode,expected)
 initial=state(p,mode);hp=route(p)['health'];cacheBefore=old.caches(p)
 if args.phase=='after':assert cacheBefore['worker']['ready'] and not cacheBefore['worker']['failure'],cacheBefore['worker']
 rec=Recording(p,out,label+'-stride')
 hold_stride(p,mode,touch,'right',rec,out,label,result,args)
 hold_stride(p,mode,touch,'left',rec,out,label,result,args)
 # Pause through the native interface only after recorded movement. Blocking
 # encoding must not advance an unobserved source encounter behind the export.
 tap(p,'#squarePauseBtn' if mode=='square' else '#mobilePauseBtn','p',touch);assert state(p,mode)['paused']
 clip=rec.finish();clip['scope']='Native right and left holds, each covering at least3 actual rendered stride cycles. Normal pause only after captured movement for export.';result['recordings'].append(clip)
 tap(p,'#squarePauseBtn' if mode=='square' else '#mobilePauseBtn','p',touch);assert not state(p,mode)['paused']
 if args.phase=='after':
  for direction in ['up','down']:
   held(p,mode,['ArrowUp' if direction=='up' else 'ArrowDown'],touch,450 if mode=='square' else 260,lambda:old.capture(p,out,label+'/'+direction,result,mode,expected))
   p.wait_for_timeout(180)
  bag(p,touch)
 if mode=='square':
  tap(p,'.square-exit','q',touch);p.wait_for_function("BearlyCentrumLink.audit().phase==='riding'&&!BearlyCentrumSquare.active()",timeout=90000)
 else:old.remount(p,touch)
 r=route(p);assert r['health']==hp and r['grounded'] and r['babyMounted']
 p.wait_for_function('()=>{const c=BearlyHeroRig.centrumCacheStats(),b=BearlyHeroRig.cacheStats();return !c.pending&&!c.queued&&!b.pendingBitmaps;}',timeout=15000)
 cacheAfter=old.caches(p);assert cacheAfter['worker']['ready'] and not cacheAfter['worker']['failure'],cacheAfter['worker'];m=metrics(p);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
 result['checks'].append({'name':label,'passed':True,'setup':'One original route-stop helper, then native parking/dismount/movement and same-bike return. Square open-floor walk_to500/650 is native. No pose/state/health grant.','initialX':initial['x'],'healthBefore':hp,'return':{k:r[k] for k in ['x','health','grounded','babyMounted']},'cacheBefore':cacheBefore,'cacheAfter':cacheAfter,'metrics':m})
 c.close()



def back_carrier(browser,base,out,result,args,touch):
 label='phone' if touch else 'desktop';c,p=old.context(browser,base,touch,result,'after');p.evaluate(DRAW_PROBE)
 warp_setup(p,2720);old.dismount(p,touch)
 enemies=p.evaluate("()=>{const v=BearlyVisits.audit();return v.combat.npcs.filter(n=>n.kind==='gangster'&&n.active!==false&&n.visible!==false).sort((a,b)=>Math.abs(a.x-v.x)-Math.abs(b.x-v.x)).map(n=>({id:n.id,x:n.x,depth:n.depth}));}")
 assert enemies;enemy=enemies[0]
 for axis,target in [('depth',enemy['depth']),('x',enemy['x']+30)]:
  for _ in range(14):
   a=source(p);delta=target-a[axis];assert a['combat']['hp']>0
   if abs(delta)<(18 if axis=='x' else 7):break
   key=('ArrowRight' if delta>0 else 'ArrowLeft') if axis=='x' else ('ArrowDown' if delta>0 else 'ArrowUp')
   held(p,'street',[key],touch,min(500,max(30,(abs(delta)-7)/(180 if axis=='x' else 140)*1000)))
  else:raise AssertionError(('Native combat approach',axis,target,source(p)))
 hp=route(p)['health'];p.wait_for_function('hp=>BearlyVisits.audit().combat.hp<hp&&BearlyVisits.audit().combat.hurt',arg=hp,timeout=45000,polling='raf')
 damaged=source(p);assert damaged['combat']['hp']<hp;old.capture(p,out,label+'-back/native-hit',result,'street',.8)
 mauls=damaged['combat']['stats']['mauls'];before={n['id']:n['hp'] for n in damaged['combat']['npcs']}
 if touch:
  box=p.locator('.area-maul').bounding_box();session=c.new_cdp_session(p);session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}]});p.wait_for_timeout(210);session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});session.detach()
 else:p.keyboard.press('j');p.wait_for_timeout(180)
 a=source(p);assert a['combat']['stats']['mauls']>mauls
 struck=[{'id':n['id'],'before':before[n['id']],'after':n['hp']} for n in a['combat']['npcs'] if n['hp']<before[n['id']]];assert struck
 held(p,'street',['ArrowLeft'],touch,550);p.wait_for_function("!BearlyVisits.audit().combat.hurt&&BearlyVisits.audit().hero.pose==='walking'",timeout=15000,polling='raf')
 a=source(p);assert a['hero']['carrier']=='back' and a['hero']['anatomy']['skinning']=='rigid-rest-art-segments'
 rec=Recording(p,out,label+'-back-volume');p.evaluate('__stride25.frames=[];__stride25.record=true')
 held(p,'street',['ArrowLeft'],touch,2400,lambda:old.capture(p,out,label+'-back/walking',result,'street',.8))
 p.evaluate('__stride25.record=false');frames=p.evaluate('__stride25.frames')
 tap(p,'#mobilePauseBtn','p',touch);assert source(p)['paused'];clip=rec.finish();clip['scope']='Actual native back-carrier walking after gang hit/J/recovery, with natural front return enabled. Export pause only after captured motion. No state/health/carrier grant.';result['recordings'].append(clip)
 tap(p,'#mobilePauseBtn','p',touch);assert not source(p)['paused']
 for _ in range(12):
  a=source(p);assert a['combat']['hp']>0
  if a['hero'].get('pose')=='walking' and not a['combat']['hurt']:break
  held(p,'street',['ArrowLeft'],touch,120)
 else:raise AssertionError('Native post-export walking recovery failed')
 back=[f for f in frames if f.get('carrier')=='back' and f['pose']=='walking' and not f.get('paused') and (f.get('weight')or 0)>=.999]
 summary=stride_summary(back);summary['paintedSegmentLengths']=painted_segment_lengths(back)
 assert summary['renderedCycles']>=1 and summary['leadSpanBalanceRatio']>=.8,summary
 cache=old.caches(p);assert cache['worker']['ready'] and not cache['worker']['failure'];m=metrics(p);assert m['maxPending']<=1
 result['backCarrier']={'summary':summary,'frames':back,'scope':'One complete naturally available back-carrier stride; automatic return to front is preserved.'}
 result['checks'].append({'name':label+' native gang/J/back-volume/recovery','passed':True,'setup':'One original route stop, then native approach/hit/J/walking/pause/recovery. No state grants.','enemy':enemy,'healthBefore':hp,'healthAfter':route(p)['health'],'struck':struck,'cache':cache,'metrics':m})
 c.close()

def phase_diagnostics(out,result):
 from PIL import Image,ImageDraw
 reports=[]
 for segment in result['segments']:
  entries=[x for x in result['captures'] if x['file'] in segment['captures']]
  if len(entries)!=8:continue
  tiles=[];sources=[]
  for item in entries:
   im=Image.open(out/item['file']).convert('RGB');p=item['paintedFrame']['originScreen']
   box=(round(p['x']-60),round(p['y']-85),round(p['x']+60),round(p['y']+15))
   tiles.append(im.crop(box));sources.append({'file':item['file'],'sha256':item['sha256'],'box':list(box),'paintedPhase':item['paintedFrame']['renderedPhase'],'targetPhase':item['targetPhase']})
  for scale,label in [(1,'native'),(3,'enlarged')]:
   w,h=120*scale,100*scale;canvas=Image.new('RGB',(w*4,(h+24)*2+36),'#e9e1ce');draw=ImageDraw.Draw(canvas)
   draw.text((8,5),('NATIVE CROP DIAGNOSTIC — no enlargement' if scale==1 else 'ENLARGED 3x GAME-FRAME CROP — diagnostic, not gameplay size'),fill='#263528')
   for i,(tile,item) in enumerate(zip(tiles,entries)):
    x=(i%4)*w;y=36+(i//4)*(h+24)
    if scale!=1:tile=tile.resize((w,h),Image.Resampling.NEAREST)
    canvas.paste(tile,(x,y));draw.text((x+5,y+h+4),'phase '+str(item['targetPhase']),fill='#263528')
   name=segment['label']+'-'+segment['direction']+'-'+label+'-leg-volume-diagnostic.png';canvas.save(out/name)
   reports.append({'file':name,'sha256':digest(out/name),'scope':'Eight crops from unmodified actual gameplay JPEGs, phase selected after painting. '+('Native scale.' if scale==1 else 'Nearest-neighbour3x enlargement, not gameplay scale or generated art.'),'sourceFrames':sources,'cropScale':scale})
 result['diagnostics']=reports
 (out/'phase-diagnostics.json').write_text(json.dumps(reports,indent=2)+'\n')


def main():
 a=argparse.ArgumentParser();a.add_argument('--phase',choices=['before','after'],required=True);a.add_argument('--out',default='verification/stage25/browser');a.add_argument('--platform',choices=['both','desktop','phone'],default='both');a.add_argument('--mode',choices=['both','square','street'],default='both');a.add_argument('--require-alternation',action='store_true');a.add_argument('--back-carrier',action='store_true');a.add_argument('--expect-build',default='BQ_CENTRUM_STAGE25');args=a.parse_args()
 out=(ROOT/args.out/args.phase).resolve();assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
 result={'scope':__doc__,'phase':args.phase,'harnessSHA256':digest(Path(__file__)),'runtimeHashes':hashes(),'baselineCommit':BASELINE if args.phase=='before' else None,'conditions':{'browser':'Linux headless system Chromium','desktop':[1280,720],'CDPTouch':[844,390],'deviceScaleFactor':1,'physicalDevice':False,'humanVideoPlaybackReview':False,'cameraSquare':.6,'cameraStreet':.8,'scriptInstrumentation':'Draw-wrapper observes production audit after actual paint. No independent loop or movement/pose writes.'},'checks':[],'segments':[],'captures':[],'recordings':[],'errors':[],'consoleErrors':[],'httpFailures':[]}
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);result['browserVersion']=browser.version
   for touch in ([False,True] if args.platform=='both' else [args.platform=='phone']):
    if args.back_carrier:back_carrier(browser,f'http://127.0.0.1:{server.server_port}',out,result,args,touch)
    else:
     for mode in (['square','street'] if args.mode=='both' else [args.mode]):scenario(browser,f'http://127.0.0.1:{server.server_port}',out,touch,mode,result,args)
   browser.close()
  phase_diagnostics(out,result)
  result['runtimeHashesAfter']=hashes()
  if args.phase=='after':assert result['runtimeHashesAfter']==result['runtimeHashes'],'Runtime changed during final browser checks'
  assert not result['errors'] and not result['consoleErrors'] and not result['httpFailures'];result['passed']=True
 except BaseException as error:result['passed']=False;result['failure']=repr(error);result['traceback']=traceback.format_exc();raise
 finally:server.shutdown();(out/'results.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
 print(json.dumps({'phase':args.phase,'passed':result['passed'],'contexts':len(result['checks']),'segments':len(result['segments']),'captures':len(result['captures']),'clips':len(result['recordings'])}),flush=True)
if __name__=='__main__':main()
