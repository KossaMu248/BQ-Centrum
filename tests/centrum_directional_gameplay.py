"""Actual authored-angle gameplay after one disclosed debug route-stop setup.

All current target files are served locally. Native E transfers the original
baby, then ordinary keyboard walking moves to the clear lane and exercises
side/toward/away views. No scene teleports or state grants follow setup.
Screenshots/clip are actual gameplay, not generated asset previews, physical
phone or exclusive performance evidence. There is no baseline runtime overlay.
"""
import argparse,base64,functools,hashlib,json,shutil,subprocess,sys
from pathlib import Path
from http.server import ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
from centrum_economy_browser import Quiet,wait_ready,wait_exploration,close_dialogue,walk_to
ROOT=Path(__file__).resolve().parents[1]
P=argparse.ArgumentParser();P.add_argument('--baseline',action='store_true');P.add_argument('--clip',action='store_true');P.add_argument('--out',default='verification/stage13/gameplay');A=P.parse_args()
OUT=(ROOT/A.out).resolve();assert OUT.is_relative_to(ROOT),'Capture output must stay inside BQ-Centrum';assert not A.baseline,'Use historical Stage12 evidence for baseline';OUT.mkdir(parents=True,exist_ok=True)
BASELINE='e5b0daa58ea5bdbddc866767badea86901169290'
rig=subprocess.check_output(['git','show',BASELINE+':js/hero-rig.js'],cwd=ROOT) if A.baseline else (ROOT/'js/hero-rig.js').read_bytes()
class Recording:
 def __init__(self,page):
  self.active=True;self.frames=[];self.folder=OUT/'.recording-frames';self.folder.mkdir(exist_ok=True);self.session=page.context.new_cdp_session(page)
  self.session.on('Page.screencastFrame',self.frame);self.session.send('Page.startScreencast',{'format':'jpeg','quality':78,'maxWidth':1280,'maxHeight':720,'everyNthFrame':3})
 def frame(self,event):
  if not self.active:return
  p=self.folder/f'{len(self.frames):05d}.jpg';p.write_bytes(base64.b64decode(event['data']));self.frames.append((p,event['metadata']['timestamp']));self.session.send('Page.screencastFrameAck',{'sessionId':event['sessionId']})
 def finish(self):
  self.active=False;self.session.remove_listener('Page.screencastFrame',self.frame)
  self.session.send('Page.stopScreencast');self.session.detach();assert len(self.frames)>20
  lines=[]
  for (p,a),(_,b) in zip(self.frames,self.frames[1:]):lines += [f"file '{p.resolve()}'",f'duration {max(.001,b-a):.6f}']
  lines += [f"file '{self.frames[-1][0].resolve()}'"];listing=self.folder/'frames.txt';listing.write_text('\n'.join(lines)+'\n');dest=OUT/'walking.webm'
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-r','24','-c:v','libvpx-vp9','-cpu-used','4','-threads','2','-crf','33','-b:v','0','-pix_fmt','yuv420p',str(dest)],check=True)
  data={'file':dest.name,'nativeSeconds':self.frames[-1][1]-self.frames[0][1],'playbackSpeed':1,'frames':len(self.frames),'encodingFps':24,'gameFpsClaim':False,'actualGameplay':True,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()};shutil.rmtree(self.folder);return data
result={'disclosure':__doc__,'baselineCommit':BASELINE if A.baseline else None,'heroSha256':hashlib.sha256(rig).hexdigest(),'captures':[],'errors':[],'httpFailures':[]}
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);context=browser.new_context(viewport={'width':1280,'height':720},device_scale_factor=1);page=context.new_page()
  page.route('**/js/hero-rig.js*',lambda route:route.fulfill(status=200,content_type='text/javascript',body=rig))
  page.on('pageerror',lambda e:result['errors'].append(str(e)));page.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
  page.goto(f'http://127.0.0.1:{server.server_port}/index.html');wait_ready(page);page.locator('#introStart').click();page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'");page.evaluate('BEARLY_DEBUG_MENU.warp(7550)');page.wait_for_timeout(300);page.keyboard.press('e');wait_exploration(page);close_dialogue(page)
  walk_to(page,{'x':650,'y':730});page.wait_for_timeout(350)
  result['conditions']={'browser':browser.version,'viewport':page.viewport_size,'physicalDevice':False,'build':page.evaluate('BEARLY_BUILD_ID')}
  def capture(name):
   a=page.evaluate('BearlyCentrumSquare.audit()');f=OUT/(name+'.png');page.screenshot(path=str(f));b=a['hero']['babyFace'];assert a['height']==200 and b['continuousUpperBody'] and b['originalCollar'] and abs(b['uniformScale']-.5710830421929589)<1e-9
   result['captures'].append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'actualGameplay':True,'state':a})
  recording=Recording(page) if A.clip else None
  capture('rest')
  for name,keys in [('right',['ArrowRight']),('left',['ArrowLeft']),('up',['ArrowUp']),('down',['ArrowDown'])]:
   for k in keys:page.keyboard.down(k)
   for n in [1,2,3]:page.wait_for_timeout(330);capture(name+'-'+str(n))
   for k in keys:page.keyboard.up(k)
   page.wait_for_timeout(350)
  for view,key in [('away','ArrowUp'),('toward','ArrowDown')]:
   page.keyboard.down(key);page.wait_for_timeout(550);page.keyboard.up(key);page.wait_for_timeout(1000);a=page.evaluate('BearlyCentrumSquare.audit()');assert a['view']==view and a['hero']['view']==view and a['hero']['authoredView'];capture(view+'-rest')
  result['diagonalStops']=[]
  for name,keys,view in [('south-east',['ArrowRight','ArrowDown'],'toward'),('north-west',['ArrowLeft','ArrowUp'],'away'),('south-west',['ArrowLeft','ArrowDown'],'toward'),('north-east',['ArrowRight','ArrowUp'],'away')]:
   before=page.evaluate('BearlyCentrumSquare.audit()')
   for key in keys:page.keyboard.down(key)
   page.wait_for_timeout(1000);moving=page.evaluate('BearlyCentrumSquare.audit()');assert not moving['hits'] and moving['view']==view and moving['hero']['view']==view and moving['hero']['authoredView']
   for key in keys:page.keyboard.up(key)
   page.wait_for_timeout(550);rest=page.evaluate('BearlyCentrumSquare.audit()');assert abs(rest['vx'])<1e-9 and abs(rest['vy'])<1e-9 and rest['view']==view and rest['hero']['view']==view and rest['hero']['authoredView']
   assert abs(moving['x']-before['x'])>40 and abs(moving['y']-before['y'])>15
   result['diagonalStops'].append({'direction':name,'expectedView':view,'movingDelta':{'x':moving['x']-before['x'],'y':moving['y']-before['y']},'movingHits':moving['hits'],'restView':rest['view'],'passed':True});capture(name+'-rest')
  result['recording']=recording.finish() if recording else None
  result['worker']=page.evaluate('BearlyHeroRig.centrumCacheStats()');result['directional']=page.evaluate('BearlyCentrumDirectionalRig.stats()');assert not result['errors'] and not result['httpFailures'];result['passed']=True;context.close();browser.close()
finally:
 server.shutdown();(OUT/'results.json').write_text(json.dumps(result,indent=2)+'\n')
print('PASS actual authored angle screenshots',len(result['captures']))
