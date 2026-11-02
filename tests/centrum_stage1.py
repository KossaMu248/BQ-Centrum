"""BQ-Centrum stage 1: native-time browser cycle and save isolation.

Run from any directory: python3 tests/centrum_stage1.py
Uses installed Python Playwright and system Chromium. No npm/runtime dependencies.
Debug warp shortens the route to the pizzeria; debug victory exercises the real
win/save function, and is not evidence of completing the full cycling route.
"""
import functools
import hashlib
import json
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'verification/stage1'
OUT.mkdir(parents=True, exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

INSTRUMENT = r"""(() => {
 const proto=Storage.prototype;
 const original={getItem:proto.getItem,setItem:proto.setItem,removeItem:proto.removeItem,clear:proto.clear};
 const donors={bearBest:'314159',bearBestAutumn:'271828',bearAutumnAdventureV7:'{"started":true,"lunch":true,"kit":true,"delivered":true,"repaired":true,"chart":true,"buoys":[0,1,2],"voyage":true,"seeds":[0,1,2],"garden":true}'};
 for(const [key,value] of Object.entries(donors))if(original.getItem.call(localStorage,key)===null)original.setItem.call(localStorage,key,value);
 window.__centrumStorage={operations:[],donors,read:key=>original.getItem.call(localStorage,key),all:()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,original.getItem.call(localStorage,k)]))};
 for(const name of Object.keys(original))proto[name]=function(...args){window.__centrumStorage.operations.push({operation:name,key:args[0]??null});return original[name].apply(this,args);};
 window.__centrumFrames=0;const frame=()=>{window.__centrumFrames++;requestAnimationFrame(frame);};requestAnimationFrame(frame);
})();"""

def audit(page):
    return page.evaluate('BearlyVisits.audit()')

def move_to(page, target, tolerance=17):
    for _ in range(8):
        delta=target-audit(page)['x']
        if abs(delta)<=tolerance:
            return
        key='ArrowRight' if delta>0 else 'ArrowLeft'
        page.keyboard.down(key)
        page.wait_for_timeout(min(2200,max(80,abs(delta)/120*1000-60)))
        page.keyboard.up(key)
        page.wait_for_timeout(220)
    assert abs(target-audit(page)['x'])<=tolerance, (target,audit(page)['x'])

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    evidence={'result':'running','environment':'Headless system Chromium, desktop 1440×1000, native time throughout; browser context starts with empty project storage.','shortcuts':['BEARLY_DEBUG_MENU.warp positions near pizzeria after real startup ride.','Debug godMode isolates visit flow from hostile NPC damage; damage balance is not tested.','BEARLY_TEST.victory calls production win() only to exercise score persistence; full route completion is not claimed.'],'steps':[]}
    errors=[];failures=[];requests=[]
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            context=browser.new_context(viewport={'width':1440,'height':1000})
            page=context.new_page();page.add_init_script(INSTRUMENT)
            page.on('pageerror',lambda error:errors.append(str(error)))
            page.on('response',lambda response:failures.append({'status':response.status,'url':response.url}) if response.status>=400 else None)
            page.on('request',lambda request:requests.append(request.url))
            start=time.monotonic();page.goto(base+'/index.html',wait_until='domcontentloaded')
            page.locator('#introStart').click(timeout=30000)
            page.wait_for_function("document.getElementById('introOverlay').hidden&&BEARLY_TOUCH_STATUS().state==='playing'",timeout=30000)
            first=time.monotonic()-start
            assert page.evaluate('BEARLY_BUILD_ID')==json.loads((ROOT/'autumn-version.json').read_text())['edition']
            assert page.evaluate('BearlyQuests.game.snapshot().lunch') is False,'Donor adventure must not load'
            before=page.evaluate('BEARLY_TOUCH_STATUS().x')
            page.keyboard.down('ArrowUp');page.wait_for_timeout(3000);page.keyboard.up('ArrowUp')
            after=page.evaluate('BEARLY_TOUCH_STATUS().x')
            assert after>before+120,(before,after)
            assert page.evaluate('window.__centrumFrames')>20
            page.screenshot(path=str(OUT/'01-startup-ride.png'))
            evidence['steps'].append({'step':'cold startup and actual pedal input','secondsToPlaying':round(first,3),'distance':after-before,'state':page.evaluate('BEARLY_TOUCH_STATUS()')})
            page.evaluate('BEARLY_DEBUG_MENU.settings.godMode=true')
            shop=page.evaluate("BearlyNeighbourhood.entrance(BearlyNeighbourhood.scenes.find(b=>b.key==='pizzeria')).x")
            page.evaluate('(x)=>BEARLY_DEBUG_MENU.warp(x/1.5)',shop-330)
            page.wait_for_timeout(500)
            page.keyboard.down('ArrowUp');page.wait_for_timeout(450);page.keyboard.up('ArrowUp')
            dismount_x=page.evaluate('BEARLY_TOUCH_STATUS().x');dismount_speed=page.evaluate('BEARLY_TOUCH_STATUS().speed')
            assert dismount_speed>1
            page.keyboard.press('q')
            page.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition",timeout=40000)
            state=audit(page);parked=state['parkedAt']
            assert parked>=dismount_x and parked-dismount_x<400,(dismount_x,parked)
            assert state['baby']=='front-carrier'
            assert state['hero'].get('integratedCarrier'),state['hero']
            page.screenshot(path=str(OUT/'02-dismounted.png'))
            evidence['steps'].append({'step':'Q while moving, deceleration, dismount and front carrier','requestedAt':dismount_x,'speedAtRequest':dismount_speed,'parkedAt':parked,'audit':state})
            move_to(page,shop)
            page.keyboard.press('e')
            page.wait_for_function("BearlyVisits.audit().mode==='room'&&!BearlyVisits.audit().transition",timeout=30000)
            assert audit(page)['place']=='pizzeria'
            page.wait_for_timeout(500)
            page.screenshot(path=str(OUT/'03-pizzeria-interior.png'))
            evidence['steps'].append({'step':'Walk to pizzeria and E enters room','audit':audit(page)})
            move_to(page,740)
            page.keyboard.press('e');page.wait_for_timeout(250)
            assert page.evaluate('BearlyQuests.game.snapshot().lunch') is True
            evidence['steps'].append({'step':'Walk to cook and E collects lunch','quest':page.evaluate('BearlyQuests.game.snapshot()')})
            page.keyboard.press('Escape')
            page.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition",timeout=20000)
            assert audit(page)['parkedAt']==parked
            page.screenshot(path=str(OUT/'04-return-outside.png'))
            evidence['steps'].append({'step':'Escape returns outside; parked bike stays in place','audit':audit(page)})
            page.keyboard.press('q')
            page.wait_for_function('!BearlyVisits.active()',timeout=30000)
            remounted=page.evaluate('BEARLY_TOUCH_STATUS().x')
            assert abs(remounted-parked)<3,(remounted,parked)
            assert page.evaluate('BEARLY_DEBUG().babySeated') is True
            page.keyboard.down('ArrowUp');page.wait_for_timeout(1500);page.keyboard.up('ArrowUp')
            resumed=page.evaluate('BEARLY_TOUCH_STATUS().x')
            assert resumed>remounted+40,(remounted,resumed)
            page.screenshot(path=str(OUT/'05-remounted-ride.png'))
            evidence['steps'].append({'step':'Q walks back, remounts same bike; pedal resumes ride','parkedAt':parked,'remountedAt':remounted,'resumedAt':resumed})
            page.evaluate('BEARLY_TEST.victory()')
            score=page.evaluate("__centrumStorage.read('bq-centrum:best-score:v1')")
            assert score is not None and float(score)>=0
            evidence['steps'].append({'step':'Debug victory invokes actual win/save path','projectBestScore':score})
            operations=page.evaluate('__centrumStorage.operations')
            for operation in operations:
                assert operation['operation'] in ['getItem','setItem'],operation
                assert operation['key'].startswith('bq-centrum:'),operation
            stored=page.evaluate('__centrumStorage.all()')
            donors=page.evaluate('__centrumStorage.donors')
            for key,value in donors.items():assert stored[key]==value,(key,stored[key],value)
            evidence['storageBeforeReload']={'operations':operations,'values':stored}
            page.reload(wait_until='domcontentloaded')
            page.wait_for_function('window.BearlyQuests&&window.BEARLY_BUILD_ID')
            assert page.evaluate('BearlyQuests.game.snapshot().lunch') is True
            assert page.evaluate("__centrumStorage.read('bq-centrum:best-score:v1')")==score
            reloaded=page.evaluate('__centrumStorage.all()')
            for key,value in donors.items():assert reloaded[key]==value
            reload_ops=page.evaluate('__centrumStorage.operations')
            for operation in reload_ops:assert operation['key'].startswith('bq-centrum:'),operation
            evidence['steps'].append({'step':'Reload retains project lunch and score, leaves donor sentinels unchanged','operations':reload_ops})
            assert not errors,errors
            assert not failures,failures
            external=[url for url in requests if urlsplit(url).scheme in ['http','https'] and not url.startswith(base+'/')]
            assert not external,external
            assert not any('.baseline' in url for url in requests)
            evidence.update({'result':'passed','pageErrors':errors,'httpFailures':failures,'requestCount':len(requests),'externalRequests':external,'runtimeSourceSHA256':{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [ROOT/'index.html',*sorted((ROOT/'js').glob('*.js')),*sorted((ROOT/'css').glob('*.css'))]}})
            context.close();browser.close()
    except Exception as error:
        evidence.update({'result':'failed','failure':repr(error),'pageErrors':errors,'httpFailures':failures})
        raise
    finally:
        (OUT/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
        server.shutdown();server.server_close()
    print('PASS: cold startup/pedal, moving Q dismount, pizzeria entry/lunch, outside/same-bike return, resumed ride, namespaced score and quest reload; donor saves untouched; zero page/HTTP/external-request errors.')

if __name__=='__main__':main()
