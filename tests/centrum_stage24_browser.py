"""Stage24 actual alternating-stride review.

One disclosed original route-stop helper per fresh context, followed by native
movement, parking, pause/bag and remount controls. Actual HeroRig.draw results
are sampled after painting; no render-pose or foot-position fixture is used.
Before serves this target's pinned Stage23 HTML/JS through read-only Git fulfil.
CDP touch emulation/decoded frame review is not physical/human/Safari testing.
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
BASELINE='89f996a9d506f2dca2aab50903d61eee70bb0e04'
old.BASELINE=BASELINE
DRAW_PROBE=r'''()=>{
 const q=window.__stride24={record:false,frames:[]},rig=BearlyHeroRig,draw=rig.draw;
 rig.draw=function(c,x,y,h,face,options){
  const m=c.getTransform(),result=draw.apply(this,arguments);
  if(q.record&&c.canvas.id==='game'){
   const a=rig.audit(),near=a.landmarks?.near,far=a.landmarks?.far,r=c.canvas.getBoundingClientRect(),fit=getComputedStyle(c.canvas).objectFit;
   let sx=r.width/c.canvas.width,sy=r.height/c.canvas.height,ox=0,oy=0;
   if(fit==='cover'||fit==='contain'){const scale=fit==='cover'?Math.max(sx,sy):Math.min(sx,sy);sx=sy=scale;ox=(r.width-c.canvas.width*scale)/2;oy=(r.height-c.canvas.height*scale)/2;}
   const point=l=>l?{x:l.sole.x,y:l.sole.y,hipX:l.hip.x,hipY:l.hip.y,kneeX:l.knee.x,kneeY:l.knee.y,stance:l.stance,contact:l.contact,bootWidth:l.bootWidth}:null;
   q.frames.push({now:performance.now(),epoch:(performance.timeOrigin+performance.now())/1000,x,y,h,face,carrier:a.carrier,paused:(BearlyCentrumSquare.active()?BearlyCentrumSquare.audit().paused:BearlyVisits.active()?BearlyVisits.audit().paused:false),pose:a.pose,phase:a.gait?.phase,renderedPhase:a.body?.cachePhase??a.gait?.phase,weight:a.raster?.renderedWeight??options?.weight,requestedPhase:a.raster?.requestedPhase,near:point(near),far:point(far),body:a.body?{bob:a.body.bob,roll:a.body.roll}:null,baby:a.babyFace?{source:a.babyFace.source,continuousUpperBody:a.babyFace.continuousUpperBody,originalCollar:a.babyFace.originalCollar,uniformScale:a.babyFace.uniformScale}:null,originScreen:{x:r.x+ox+(m.a*x+m.c*y+m.e)*sx,y:r.y+oy+(m.b*x+m.d*y+m.f)*sy},raster:a.raster||null});
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

def native_stills(rec,frames,out,label,direction,result):
 # Pick each quarter of a late full actual rendered cycle, then copy the closest
 # screencast JPEG without resizing or compositing it. These are game frames.
 valid=[x for x in frames if x['pose']=='walking' and x['near'] and x.get('weight',0)>=.999]
 assert valid
 start=valid[0]['epoch']+.55;valid=[x for x in valid if x['epoch']>=start]
 selected=[]
 for target in [.125,.375,.625,.875]:
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
 p.evaluate('()=>{__stride24.frames=[];__stride24.record=true;__move20.samples=[];__move20.mode='+json.dumps(mode)+';__move20.record=true}')
 held(p,mode,['ArrowRight' if direction=='right' else 'ArrowLeft'],touch,2600)
 p.evaluate('()=>{__stride24.record=false;__move20.record=false}')
 frames=p.evaluate('__stride24.frames');samples=p.evaluate('__move20.samples');after=state(p,mode)
 assert route(p)['health']==hp and not any(x.get('hits') for x in samples)
 assert (after['x']-start)*(1 if direction=='right' else -1)>250
 summary=stride_summary(frames);assert summary['renderedCycles']>=3,summary
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
 assert p.evaluate('BEARLY_BUILD_ID')==('BQ_CENTRUM_STAGE23' if args.phase=='before' else args.expect_build)
 expected=.6 if mode=='square' else .8;old.projection(p,mode,expected)
 initial=state(p,mode);hp=route(p)['health'];cacheBefore=old.caches(p)
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
 cacheAfter=old.caches(p);m=metrics(p);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
 result['checks'].append({'name':label,'passed':True,'setup':'One original route-stop helper, then native parking/dismount/movement and same-bike return. Square open-floor walk_to500/650 is native. No pose/state/health grant.','initialX':initial['x'],'healthBefore':hp,'return':{k:r[k] for k in ['x','health','grounded','babyMounted']},'cacheBefore':cacheBefore,'cacheAfter':cacheAfter,'metrics':m})
 c.close()



def back_carrier(browser,base,out,result,args,touch):
 original_context=old.context
 def monitored_context(*a,**kw):
  c,p=original_context(*a,**kw);p.evaluate(DRAW_PROBE);p.evaluate('__stride24.record=true')
  close=c.close
  def observed_close(*ca,**ck):
   frames=p.evaluate('__stride24.record=false;__stride24.frames')
   back=[f for f in frames if f.get('carrier')=='back' and f['pose']=='walking' and not f.get('paused',False)]
   summary=stride_summary(back)
   result.setdefault('backCarrier',[]).append({'scope':'Actual production back walking after native gang hit/J recovery. One complete back-carrier stride is required within its natural availability window; no carrier/state assignment or held back pose. Normal front return remains enabled. Paused export frames excluded.','touch':touch,'summary':summary,'frames':back})
   assert summary['renderedCycles']>=1 and summary['leadSpanBalanceRatio']>=.8,summary
   return close(*ca,**ck)
  c.close=observed_close
  return c,p
 old.context=monitored_context
 args.clip=True;args.route_zoom=.8
 try:old.combat(browser,base,touch,out,result,args)
 finally:old.context=original_context


def main():
 a=argparse.ArgumentParser();a.add_argument('--phase',choices=['before','after'],required=True);a.add_argument('--out',default='verification/stage24/browser');a.add_argument('--platform',choices=['both','desktop','phone'],default='both');a.add_argument('--mode',choices=['both','square','street'],default='both');a.add_argument('--require-alternation',action='store_true');a.add_argument('--back-carrier',action='store_true');a.add_argument('--expect-build',default='BQ_CENTRUM_STAGE24');args=a.parse_args()
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
  result['runtimeHashesAfter']=hashes()
  if args.phase=='after':assert result['runtimeHashesAfter']==result['runtimeHashes'],'Runtime changed during final browser checks'
  assert not result['errors'] and not result['consoleErrors'] and not result['httpFailures'];result['passed']=True
 except BaseException as error:result['passed']=False;result['failure']=repr(error);result['traceback']=traceback.format_exc();raise
 finally:server.shutdown();(out/'results.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
 print(json.dumps({'phase':args.phase,'passed':result['passed'],'contexts':len(result['checks']),'segments':len(result['segments']),'captures':len(result['captures']),'clips':len(result['recordings'])}),flush=True)
if __name__=='__main__':main()
