"""Paused production-renderer diagnostic, NOT normal-size gameplay evidence."""
import sys,functools,json,base64
from pathlib import Path
from threading import Thread
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'tests'))
from centrum_economy_browser import Quiet,wait_ready
out=ROOT/'verification/stage22/render-lab/after';out.mkdir(parents=True,exist_ok=True)
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':1280,'height':720});page.goto(f'http://127.0.0.1:{server.server_port}/index.html');wait_ready(page)
  page.evaluate('async()=>{await BearlyHeroRig.preload();await BearlyHeroRig.warmupSources({foreground:true});await BearlyCentrumDirectionalRig.preload();}')
  cases=[]
  for view in ['side','toward','away','source']:
   item=page.evaluate('''view=>{let canvas=document.createElement('canvas');canvas.width=1200;canvas.height=880;let c=canvas.getContext('2d'),states=[];c.fillStyle='#c9c7b9';c.fillRect(0,0,1200,880);c.fillStyle='#23372b';c.font='18px Arial';c.fillText('RENDERER DIAGNOSTIC — '+view+' — enlarged h=320, not gameplay',16,24);
    for(let i=0;i<8;i++){let px=150+(i%4)*300,py=420+Math.floor(i/4)*430; c.fillStyle='#4c615544';c.fillRect(px-110,py,220,1);let v=view==='source'?null:BearlyCentrumDepthGait.heading(view==='side'?200:0,view==='away'?-80:view==='toward'?80:0,1),opts={centrumView:view==='source'?'side':view,centrumCache:view!=='source',routeCache:view==='source',state:{hp:100,baby:false},weight:1,distance:BearlyLocomotion.cycleLength(320)*i/8*(view==='source'?BearlyCentrumDepthGait.sourceStrideScale:1),groundMotion:v};BearlyHeroRig.draw(c,px,py,320,1,opts);states.push(BearlyHeroRig.audit());c.fillStyle='#23372b';c.fillText('phase '+i+'/8',px-100,py+26);}
    return{png:canvas.toDataURL('image/png').split(',')[1],states};}''',view)
   (out/(view+'.png')).write_bytes(base64.b64decode(item.pop('png')));cases.append({'view':view,**item})
  (out/'results.json').write_text(json.dumps({'scope':__doc__,'cases':cases},indent=2)+'\n');b.close()
finally:server.shutdown()
print('Stage22 paused renderer diagnostic PASS')
