"""Source-pose renderer reference boards, not in-game screenshots or animation proof."""
import argparse,functools,hashlib,json
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--out',default='verification/stage16/npc-render/lab');a=p.parse_args();OUT=(ROOT/a.out).resolve();assert OUT.is_relative_to(ROOT);OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
r={'scope':__doc__,'captures':[],'errors':[],'httpFailures':[],'runtimeHashes':{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [ROOT/'js'/n for n in ['npc-motion.js','illustrated-kids.js','brawler-art.js','brawler.js','street-life.js']]}}
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=browser.new_page(viewport={'width':1000,'height':900},device_scale_factor=1)
  page.on('pageerror',lambda e:r['errors'].append(str(e)));page.on('response',lambda response:r['httpFailures'].append([response.status,response.url]) if response.status>=400 else None)
  page.goto(f'http://127.0.0.1:{server.server_port}/index.html');page.evaluate('''async()=>{await Promise.all([BearlyNpcMotion.loaded,BearlyKids.loaded,BearlyHeroRig.preload(),BearlyBrawlArt.prepare()]);await BearlyHeroRig.warmupSources({foreground:true});}''');page.wait_for_function('BearlyBrawlArt.ready()')
  page.evaluate('''()=>{const overlay=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;z-index:99999;background:#ede5d2';const c=document.createElement('canvas');c.id='npc-lab';overlay.append(c);document.body.append(overlay);}''')
  for start in [0,3,6,9]:
   audit=page.evaluate('''start=>{const canvas=document.querySelector('#npc-lab');canvas.width=800;canvas.height=690;const c=canvas.getContext('2d');c.fillStyle='#ede5d2';c.fillRect(0,0,800,690);c.font='13px Arial';c.fillStyle='#28382d';c.fillText('RENDERER REFERENCE · original complete poses · height128 · NOT GAMEPLAY',12,22);const audits=[];for(let row=0;row<3;row++){const variant=start+row;for(let col=0;col<4;col++){const height=128,h=height*(variant===9?1.05:variant===11?.84:1),phase=col/4,x=100+col*195,y=205+row*218;c.strokeStyle='#9a9b86';c.beginPath();c.moveTo(x-80,y);c.lineTo(x+80,y);c.stroke();BearlyBrawlArt.adult(c,{id:'lab-'+variant,kind:'resident',variant,civilian:true,state:'idle',mood:'calm',age:1,activity:'walk',moving:true,distance:BearlyNpcMotion.walkCycleLength(h)*phase,face:1,hp:60},x,y,height);const a=BearlyNpcMotion.audit();c.fillStyle='#28382d';c.fillText('variant'+variant+' · '+a.pose,x-78,y+24);audits.push(a);}}return audits;}''',start)
   f=OUT/f'variants-{start}-{start+2}.png';page.locator('#npc-lab').screenshot(path=str(f));r['captures'].append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'actualGameplay':False,'kind':'production-renderer reference','audit':audit})
  kids=page.evaluate('''()=>{const canvas=document.querySelector('#npc-lab');canvas.width=1000;canvas.height=690;const c=canvas.getContext('2d');c.fillStyle='#ede5d2';c.fillRect(0,0,1000,690);c.font='13px Arial';c.fillStyle='#28382d';c.fillText('RENDERER REFERENCE · teen height94 / adult128 · original art · NOT GAMEPLAY',12,22);const audits=[];for(const[row,item]of ['bottle','rock','firecracker'].entries()){for(let col=0;col<5;col++){const x=100+col*195,y=200+row*218;c.strokeStyle='#9a9b86';c.beginPath();c.moveTo(x-80,y);c.lineTo(x+80,y);c.stroke();BearlyBrawlArt.adult(c,{id:'lab-teen',kind:'gangster',item,state:'idle',age:1,activity:col?'run':'chill',moving:col>0,distance:94*1.08*(col-1)/4,face:1,hp:60},x,y,128);c.fillStyle='#28382d';const a=BearlyKids.audit().drawn[item];c.fillText(item+' · '+a.pose+' · h'+a.height,x-78,y+24);audits.push(a);}}return audits;}''')
  f=OUT/'teen-height94.png';page.locator('#npc-lab').screenshot(path=str(f));r['captures'].append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'actualGameplay':False,'kind':'production-renderer reference','audit':kids})
  r['cacheStats']=page.evaluate('BearlyNpcMotion.cacheStats()');r['browser']=browser.version;r['build']=page.evaluate('BEARLY_BUILD_ID');assert not r['errors'] and not r['httpFailures'];r['passed']=True;browser.close()
finally:
 server.shutdown();(OUT/'results.json').write_text(json.dumps(r,indent=2)+'\n')
print('PASS renderer-reference boards',len(r['captures']))
