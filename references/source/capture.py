"""Capture the pinned donor in Chromium; write evidence only to the independent project.
Run from BQ-Centrum while .baseline/source is available. No image generation/editing.
"""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
import functools,hashlib,json
from playwright.sync_api import sync_playwright

OUT=Path(__file__).resolve().parent
ROOT=OUT.parents[1]
SOURCE=ROOT/'.baseline/source'
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(SOURCE)))
Thread(target=server.serve_forever,daemon=True).start()
report={'donor_commit':'da109213fdf24947c2ac0b85de900214cc72e44f','entry':'autumn-v19.html','errors':[],'http_failures':[],'frames':{}}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':1440,'height':1000})
  page.clock.install()
  page.on('pageerror',lambda error:report['errors'].append(str(error)))
  page.on('response',lambda response:report['http_failures'].append({'status':response.status,'url':response.url}) if response.status>=400 else None)
  page.goto(f'http://127.0.0.1:{server.server_port}/autumn-v19.html')
  page.wait_for_function('window.BEARLY_STARTUP?.().ready',timeout=60000)
  report['build_id']=page.evaluate('BEARLY_BUILD_ID')
  page.evaluate('BearlyVisits.prepareAll()')
  page.wait_for_function('BearlyHeroRig.ready() && BearlyVisits.assetState().footPrepared',timeout=60000)
  page.clock.pause_at(page.evaluate('Date.now()+1000')/1000)
  page.locator('#introStart').click()
  page.evaluate('BEARLY_DEBUG_MENU.settings.godMode=true;BEARLY_DEBUG_MENU.warp(2500/1.5)')
  page.clock.run_for(150)
  def capture(name):
   page.locator('.canvas-wrap').screenshot(path=str(OUT/(name+'.png')))
   report['frames'][name]={'kind':'actual donor in-game screenshot','game':page.evaluate('BEARLY_DEBUG()'),'visits':page.evaluate('BearlyVisits.audit()')}
  capture('ride')
  page.keyboard.press('q')
  page.clock.run_for(750)
  capture('dismount')
  page.clock.run_for(2500)
  capture('front-carrier-street')
  assert page.evaluate('BearlyVisits.audit().mode')=='street'
  page.keyboard.down('ArrowRight');page.clock.run_for(420);page.keyboard.up('ArrowRight')
  capture('front-carrier-walk')
  page.evaluate('''() => {
   const board=document.createElement('canvas');board.id='character-reference';board.width=1400;board.height=850;
   board.style.cssText='position:fixed;top:0;left:0;z-index:999999;width:1400px;height:850px;';document.body.append(board);
   const c=board.getContext('2d');c.fillStyle='#f1e6cc';c.fillRect(0,0,1400,850);c.fillStyle='#222';c.font='24px sans-serif';c.fillText('PINNED DONOR RENDERER REFERENCE — not a gameplay screenshot',30,38);
   window.__referenceRig=[];
   for(const [i,pose] of ['front idle','front walking','back walking','back grab'].entries()){
    const x=170+i*345; c.fillStyle='#222';c.font='22px sans-serif';c.fillText(pose,x-130,80);
    BearlyHeroRig.draw(c,x,480,330,1,{distance:pose==='front idle'?0:95,weight:pose==='front idle'?0:1,state:{hp:100,baby:pose.startsWith('back'),held:pose==='back grab'?'reference':null}});
    __referenceRig.push(BearlyHeroRig.audit());
   }
   for(const [i,mood] of ['idle','laugh','brace','terror','leanBack','leanForward','point','sick','excited'].entries()){
    const x=60+i*152; c.fillStyle='#222';c.font='17px sans-serif';c.fillText(mood,x,565);
    BearlyBabyPassenger.draw(c,{mood,x:x+60,y:790,scale:2});
   }
  }''')
  page.locator('#character-reference').screenshot(path=str(OUT/'renderer-reference-board.png'))
  report['frames']['renderer-reference-board']={'kind':'direct donor canvas renderer reference board; not an in-game screenshot','rig':page.evaluate('__referenceRig'),'passenger_frames':page.evaluate('BearlyBabyPassenger.frames()')}
  browser.close()
 report['sha256']={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.glob('*.png'))}
 (OUT/'capture-report.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'build_id':report['build_id'],'frames':list(report['frames']),'errors':report['errors'],'http_failures':report['http_failures']},indent=2))
finally:server.shutdown()
