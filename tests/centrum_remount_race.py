"""Regression for same-task remount re-entry, separate from the native full route.

The existing debug warp only prepares the authored road stop in disposable browser
storage. Parking and both transfer animations are production code. Re-entry is
injected as two same-task DOM clicks or public requests; this is a deliberately
stronger stress than ordinary keyboard events, whose microtasks drain between taps.
"""
import functools
import hashlib
import json
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from centrum_economy_browser import Quiet, wait_ready, wait_exploration
from centrum_parking import INSTRUMENT

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification/stage8/remount-race'
OUT.mkdir(parents=True,exist_ok=True)


def main():
    result={'test':'same-task remount re-entry','fixtureDisclosure':'Disposable fresh storage; existing debug warp prepares stop only. Actual E parks via production transfer. Two same-task requests/DOM clicks deliberately stress re-entry; ordinary separate key events drain microtasks between taps.',
            'conditions':{'engine':'System Chromium /usr/bin/chromium','viewport':[1280,720],'physicalDevice':False},'checks':[],'errors':[],'httpFailures':[]}
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start()
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        for kind in ['requests','DOM-clicks']:
          context=browser.new_context(viewport={'width':1280,'height':720},device_scale_factor=1)
          context.add_init_script(INSTRUMENT)
          page=context.new_page();page.on('pageerror',lambda e:result['errors'].append(str(e)))
          page.on('response',lambda r:result['httpFailures'].append({'url':r.url,'status':r.status}) if r.status>=400 else None)
          page.goto(f'http://127.0.0.1:{server.server_port}/index.html',wait_until='domcontentloaded');wait_ready(page)
          page.click('#introStart');page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'")
          page.evaluate('BEARLY_DEBUG_MENU.warp(7550)');page.wait_for_timeout(250);page.keyboard.press('e');wait_exploration(page)
          before=page.evaluate('({link:BearlyCentrumLink.audit(),square:BearlyCentrumSquare.audit(),listeners:__parkingQA.listeners})')
          assert before['link']['phase']=='exploring' and before['square']['parkingNodeCount']==1
          assert page.evaluate('BearlyCentrumLink.canRemount()')
          if kind=='requests':
            returned=page.evaluate("Promise.all([BearlyCentrumLink.requestRemount({sceneId:'metro-square',anchorId:'bicycle-parking'}),BearlyCentrumLink.requestRemount({sceneId:'metro-square',anchorId:'bicycle-parking'})])")
            assert returned==[True,False],returned
          else:
            returned=None;page.evaluate("(()=>{const button=document.querySelector('.square-interact');button.click();button.click();})()")
          page.wait_for_function("BearlyCentrumLink.audit().phase==='remount'",timeout=5000)
          page.wait_for_timeout(500)
          during=page.evaluate('({link:BearlyCentrumLink.audit().phase,visit:BearlyVisits.audit()})')
          assert during['visit']['transition']=='mount' and 0<during['visit']['phase']<1,during
          page.screenshot(path=str(OUT/(kind+'-production-transfer.png')))
          page.wait_for_function("BearlyCentrumLink.audit().phase==='riding'&&!BearlyVisits.active()&&!BearlyCentrumSquare.active()",timeout=10000)
          page.wait_for_timeout(250)
          after=page.evaluate('({link:BearlyCentrumLink.audit(),qa:__parkingQA})')
          assert after['link']['ownership']['bicycles']==1 and after['link']['ownership']['passengers']==1
          assert after['link']['route']['babyMounted'] and after['link']['route']['health']==before['link']['route']['health']
          assert after['link']['route']['grounded'] and abs(after['link']['route']['speed'])<8
          assert all(abs(w['clearance'])<2 for w in after['link']['route']['wheels'])
          assert after['qa']['listeners']==before['listeners']
          assert after['qa']['maxPendingLoops']==1 and after['qa']['audioContexts']<=1
          assert not after['qa']['passengerViolations'],after['qa']['passengerViolations']
          page.screenshot(path=str(OUT/(kind+'-single-bike-riding.png')))
          result['checks'].append({'name':kind,'passed':True,'returns':returned,'healthBefore':before['link']['route']['health'],'healthAfter':after['link']['route']['health'],'duringTransferPhase':during['visit']['phase'],
            'after':after['link'],'loopMaximum':after['qa']['maxPendingLoops'],'audioContexts':after['qa']['audioContexts'],'listenerCountsUnchanged':True,'passengerDrawViolations':after['qa']['passengerViolations']})
          context.close()
        browser.close()
      assert not result['errors'] and not result['httpFailures'],result
      result['passed']=True
    finally:
      server.shutdown();server.server_close();(OUT/'results.json').write_text(json.dumps(result,indent=2)+'\n')
      (OUT/'frames.sha256').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in sorted(OUT.glob('*.png'))))
    print('PASS: same-task public/DOM remount re-entry; production animated transfer completes; one bicycle/passenger, unchanged health/listeners, one main loop; zero JS/HTTP failures.')


if __name__=='__main__':main()
