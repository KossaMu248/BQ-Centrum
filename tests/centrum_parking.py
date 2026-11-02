"""Stage 4: actual route parking, shared state and repeated remount cycles.

Route placement uses the original debug warp solely to shorten cycling travel to
the authored stop. All scene traversal and return-to-bike use production input.
No actor teleport, duplicate game loop, or reward grant is used for navigation.
"""
import functools
import hashlib
import json
import math
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from centrum_network import route, scene, exit_to

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'verification/stage4'
OUT.mkdir(parents=True, exist_ok=True)


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


INSTRUMENT = r"""(() => {
 const evidence=window.__parkingQA={listeners:{},audioContexts:0,audioStarts:0,loopFrames:0,pendingLoops:0,maxPendingLoops:0,frames:[],passengerViolations:[],phaseMaxWeight:{}};
 const add=EventTarget.prototype.addEventListener;
 EventTarget.prototype.addEventListener=function(type,listener,options){
  const important=this===window||this===document||this instanceof Element&&this.closest?.('.square-controls,.square-panel,.ride-utilities,.area-controls,.area-panel,.game-shell');
  if(important){const key=(this===window?'window':this===document?'document':this.id||this.className||this.tagName)+':'+type;evidence.listeners[key]=(evidence.listeners[key]||0)+1;}
  return add.call(this,type,listener,options);
 };
 for(const name of ['AudioContext','webkitAudioContext'])if(window[name]){const Native=window[name];window[name]=new Proxy(Native,{construct(target,args){evidence.audioContexts++;return Reflect.construct(target,args);}});}
 for(const name of ['OscillatorNode','AudioBufferSourceNode'])if(window[name]){const start=window[name].prototype.start;window[name].prototype.start=function(...args){evidence.audioStarts++;return start.apply(this,args);};}
 let drawing=null;const nativeDraw=CanvasRenderingContext2D.prototype.drawImage;
 CanvasRenderingContext2D.prototype.drawImage=function(image,...args){
  if(drawing&&this.canvas.id==='game'&&this.globalAlpha>.015){
   const source=String(image?.dataset?.sourceAsset||image?.src||'').split('/').pop().split('?')[0];
   if(/^(baby_pose_.*\.webp|v151_baby_pose_.*\.png)$/.test(source))drawing.passengers.push({kind:'source-passenger',source,alpha:this.globalAlpha});
   // Transfer sheet poses0/1 have an empty carrier. Later raw sheet draws
   // paint a clipped pouch below the native baby, not a second passenger.
   if(source==='bike-transfer-v7.png')drawing.transferSheetDraws++;
  }
  return nativeDraw.call(this,image,...args);
 };
 const nativeRAF=requestAnimationFrame.bind(window);
 window.requestAnimationFrame=function(fn){
  if(fn.name!=='loop')return nativeRAF(fn);
  evidence.pendingLoops++;evidence.maxPendingLoops=Math.max(evidence.maxPendingLoops,evidence.pendingLoops);
  return nativeRAF(time=>{
   evidence.pendingLoops--;evidence.loopFrames++;
   drawing={at:time,phase:window.BearlyCentrumLink?.audit?.().phase||'unlinked',passengers:[],transferSheetDraws:0};
   try{fn(time);}finally{
    const weight=drawing.passengers.reduce((sum,p)=>sum+p.alpha,0);
    evidence.phaseMaxWeight[drawing.phase]=Math.max(evidence.phaseMaxWeight[drawing.phase]||0,weight);
    if(['riding','exploring','dismount','remount'].includes(drawing.phase)&&weight>1.06&&evidence.passengerViolations.length<30)evidence.passengerViolations.push(drawing);
    if(evidence.frames.length>1800)evidence.frames.shift();evidence.frames.push(drawing);drawing=null;
   }
  });
 };
})();"""


def square(page):
    return page.evaluate('BearlyCentrumSquare.audit()')


def link(page):
    return page.evaluate('BearlyCentrumLink.audit()')


def hold(page, key, milliseconds, touch=False):
    if not touch:
        page.keyboard.down(key)
        page.wait_for_timeout(milliseconds)
        page.keyboard.up(key)
    else:
        directions={'ArrowLeft':'left','ArrowRight':'right','ArrowUp':'up','ArrowDown':'down'}
        box=page.locator(f'.square-controls [data-square-dir="{directions[key]}"]').bounding_box()
        assert box, key
        session=page.context.new_cdp_session(page)
        session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}]})
        page.wait_for_timeout(milliseconds)
        session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
        session.detach()
    page.wait_for_timeout(180)


def move_axis(page, axis, target, touch=False, tolerance=7):
    for _ in range(15):
        delta=target-square(page)[axis]
        if abs(delta)<=tolerance:return
        key=('ArrowRight' if delta>0 else 'ArrowLeft') if axis=='x' else ('ArrowDown' if delta>0 else 'ArrowUp')
        hold(page,key,min(2400,max(60,abs(delta)/155*1000-80)),touch)
    raise AssertionError(('blocked waypoint',axis,target,square(page)))


def walk_to(page, target, touch=False):
    data=scene(page);state=square(page)
    for px,py in route(data,(state['x'],state['y']),(target['x'],target['y'])):
        move_axis(page,'x',px,touch);move_axis(page,'y',py,touch)
    assert math.dist((square(page)['x'],square(page)['y']),(target['x'],target['y']))<35


def interact(page,touch=False):
    page.locator('.square-interact').tap() if touch else page.keyboard.press('e')


def use_exit(page,destination,touch=False):
    target=exit_to(page,destination)
    walk_to(page,target,touch);interact(page,touch)
    page.wait_for_function("id=>BearlyCentrumSquare.audit().sceneId===id&&!BearlyCentrumSquare.audit().loading&&!BearlyCentrumSquare.audit().transition",arg=destination,timeout=60000)
    page.wait_for_timeout(250)
    return square(page)


def wait_exploration(page):
    page.wait_for_function("window.BearlyCentrumLink?.audit().phase==='exploring'&&BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading",timeout=60000)
    page.wait_for_timeout(300)


def parked_record(state):
    return state.get('parking') or state.get('record')


def frozen_snapshot(state):
    value=state.get('route') or state.get('cycling') or state.get('bridge') or {}
    return value


def ownership(state):
    return state.get('ownership') or state.get('counts') or {}


def assert_ownership(state):
    owned=ownership(state)
    assert owned.get('bicycles')==1 and owned.get('passengers')==1,('Invalid owner count',state)
    assert owned.get('bikeId')=='centrum-family-bike'


def assert_shared(page,health,quest,billys=None):
    assert page.evaluate('BEARLY_DEBUG().health')==health,('health changed',link(page))
    assert page.evaluate('BearlyQuests.game.snapshot()')==quest,'adventure changed during transfer'
    if square(page)['active'] and not square(page)['loading']:
        hero=square(page)['hero'];face=hero['babyFace']
        assert hero['integratedCarrier'] and face['continuousUpperBody'] and face['originalCollar']
        assert hero['height']==200 and face['headHeight']>=30
    if billys is not None:
        assert square(page)['save']['inventory']['billys']==billys,('Billy reward duplicated',square(page)['save'])


def setup_ride(page,base,health=63):
    page.goto(base+'/index.html',wait_until='domcontentloaded')
    page.locator('#introStart').click(timeout=30000)
    page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'",timeout=30000)
    page.evaluate("BEARLY_DEBUG_MENU.warp(7550);BearlyVisits.setHealth(%d);BearlyQuests.game.act('lunch')"%health)
    page.wait_for_timeout(250)
    assert abs(page.evaluate('BEARLY_TOUCH_STATUS().speed'))<1
    return page.evaluate('BearlyQuests.game.snapshot()')


def park(page,touch=False):
    # The real route interaction must own the transfer, not the sandbox menu.
    if touch:page.locator('#centrumRouteEntryBtn').tap(timeout=30000)
    else:page.keyboard.press('e')
    page.wait_for_function("BearlyCentrumLink.audit().phase==='dismount'",timeout=60000)
    page.wait_for_function("BearlyVisits.audit().transition==='dismount'",timeout=60000)
    page.wait_for_timeout(600)
    page.screenshot(path=str(OUT/('touch-transfer-dismount.png' if touch else '01-production-dismount.png')))
    if not touch:
        page.keyboard.press('p');before=page.evaluate('BearlyVisits.audit().phase');page.wait_for_timeout(350)
        assert page.evaluate('BearlyVisits.audit().paused') and page.evaluate('BearlyVisits.audit().phase')==before,'Production transfer advanced while paused'
        page.keyboard.press('p')
    wait_exploration(page)
    assert square(page)['sceneId']=='metro-square'
    state=link(page);record=parked_record(state)
    assert record and record['routeId']=='autumn-main' and record['routeSceneId']=='route:autumn-main'
    assert record['bikeId']=='centrum-family-bike' and record['remount']=={'sceneId':'metro-square','anchorId':'bicycle-parking'}
    assert abs(record['parked']['x']-11325)<90
    return record


def return_and_remount(page,touch=False):
    assert square(page)['sceneId']=='metro-square'
    if touch:page.locator('.square-exit').tap()
    else:page.keyboard.press('q')
    # Back-to-bike may only traverse the current scene; poll actual footprints.
    samples=[]
    for _ in range(200):
        state=link(page)
        if state['phase']=='remount':break
        assert state['phase']=='exploring',state
        s=square(page);samples.append({'x':s['x'],'y':s['y']})
        assert s['sceneId']=='metro-square'
        assert not page.evaluate('(p)=>BearlyCentrumSquareWorld.blocked(p.x,p.y,22,12,p.sceneId,p.save)',s)
        page.wait_for_timeout(100)
    else:raise AssertionError(('Back to bike did not reach the parking anchor',link(page),square(page)))
    page.wait_for_timeout(550)
    page.screenshot(path=str(OUT/('touch-transfer-remount.png' if touch else '07-production-remount.png')))
    page.wait_for_function("BearlyCentrumLink.audit().phase==='riding'&&!BearlyVisits.active()&&!BearlyCentrumSquare.active()",timeout=30000)
    route_state=page.evaluate('BEARLY_TOUCH_STATUS()')
    assert route_state['contact'] and abs(route_state['speed'])<=45,route_state
    wheels=link(page)['route']['wheels']
    assert len(wheels)==2 and all(math.isfinite(w['clearance']) and abs(w['clearance'])<2 for w in wheels),('Remount wheels do not meet the terrain',wheels)
    route_state['measuredGroundedWheels']=wheels
    assert page.evaluate('BEARLY_DEBUG().babySeated')
    return samples,route_state


def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    evidence={'result':'running','environment':'Headless system Chromium desktop1440×1000 and emulated touch landscape844×390; native time.',
              'setup':'Original debug warp shortens route travel to the one authored stop. Existing debug setHealth63 and lunch establish continuity sentinels. All park/scene/remount actions are real keyboard or touch input.',
              'limits':['Physical devices, other browsers and sustained hardware performance untested.'],'steps':[]}
    errors=[];failures=[];requests=[]
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            context=browser.new_context(viewport={'width':1440,'height':1000});page=context.new_page();page.add_init_script(INSTRUMENT)
            def watch(p):
                p.on('pageerror',lambda e:errors.append(str(e)))
                p.on('response',lambda r:failures.append([r.status,r.url]) if r.status>=400 else None)
                p.on('request',lambda r:requests.append(r.url))
            watch(page);quest=setup_ride(page,base);health=63
            initial_listeners=None;initial_audio_contexts=None
            for cycle in range(2):
                if cycle:
                    page.evaluate('BEARLY_DEBUG_MENU.warp(7550)');page.wait_for_timeout(200)
                record=park(page);assert_shared(page,health,quest)
                assert_ownership(link(page))
                assert square(page)['parkingNodeCount']==1
                page.screenshot(path=str(OUT/f'02-cycle{cycle+1}-parked-metro.png'))
                if initial_listeners is None:
                    initial_listeners=page.evaluate('__parkingQA.listeners');initial_audio_contexts=page.evaluate('__parkingQA.audioContexts')
                before=link(page);audio_before=page.evaluate('__parkingQA.audioStarts');page.wait_for_timeout(650)
                after=link(page)
                assert frozen_snapshot(before) and 'simTime' in frozen_snapshot(before), 'Missing actual cycling snapshot'
                assert frozen_snapshot(before)==frozen_snapshot(after),('Cycling snapshot advanced while exploring',before,after)
                assert page.evaluate('__parkingQA.audioStarts')==audio_before,'Background audio kept firing'
                use_exit(page,'shopping-arcade');use_exit(page,'food-shop')
                billys=square(page)['save']['inventory']['billys']
                if cycle==0:
                    counter=next(i for i in scene(page)['interactions'] if i['kind']=='billys')
                    walk_to(page,counter);interact(page);billys+=1;assert_shared(page,health,quest,billys)
                    page.screenshot(path=str(OUT/'03-shop-single-passenger.png'))
                    before_position=(square(page)['x'],square(page)['y'])
                    page.keyboard.press('q');page.wait_for_timeout(700)
                    assert square(page)['sceneId']=='food-shop' and math.dist(before_position,(square(page)['x'],square(page)['y']))<.1
                    assert not page.evaluate("BearlyCentrumLink.requestRemount({sceneId:'food-shop',anchorId:'bicycle-parking'})"),'Cross-scene remount accepted'
                    page.screenshot(path=str(OUT/'04-shop-route-back.png'))
                    if square(page).get('mapOpen'):page.keyboard.press('m')
                    assert square(page)['parkingNodeCount']==0,'Player bicycle duplicated inside food shop'
                    assert not page.evaluate('__parkingQA.passengerViolations'),page.evaluate('__parkingQA.passengerViolations')
                    evidence['beforeReloadInstrumentation']={k:page.evaluate(f'__parkingQA.{k}') for k in ['audioContexts','maxPendingLoops','phaseMaxWeight']}
                    page.reload(wait_until='domcontentloaded');wait_exploration(page)
                    assert square(page)['sceneId']=='food-shop'
                    assert_shared(page,health,quest,billys)
                    restored=parked_record(link(page));assert restored['parked']==record['parked']
                    page.screenshot(path=str(OUT/'05-reloaded-shop-parking.png'))
                    initial_listeners=page.evaluate('__parkingQA.listeners');initial_audio_contexts=page.evaluate('__parkingQA.audioContexts')
                else:assert_shared(page,health,quest,billys)
                use_exit(page,'shopping-arcade');use_exit(page,'service-courtyard');use_exit(page,'metro-square')
                assert_shared(page,health,quest,billys)
                assert parked_record(link(page))['parked']==record['parked']
                page.screenshot(path=str(OUT/'06-shortcut-same-bicycle.png'))
                page.keyboard.press('p');paused=square(page);page.wait_for_timeout(450)
                assert square(page)['paused'] and square(page)['x']==paused['x'] and square(page)['y']==paused['y']
                page.keyboard.press('p')
                samples,riding=return_and_remount(page)
                assert_ownership(link(page))
                assert_shared(page,health,quest,billys)
                assert abs(riding['x']-record['parked']['x'])<3
                assert page.evaluate('__parkingQA.listeners')==initial_listeners,'Listeners accumulated across a cycle'
                audio_contexts=page.evaluate('__parkingQA.audioContexts')
                assert audio_contexts<=1 and (initial_audio_contexts==0 or audio_contexts==initial_audio_contexts),'Duplicate audio context created'
                evidence['steps'].append({'cycle':cycle+1,'parking':record,'returnPath':samples,'riding':riding,'ownership':ownership(link(page))})
                # Existing pedal control resumes the original cycling simulation.
                before_x=riding['x'];hold(page,'ArrowUp',350)
                assert page.evaluate('BEARLY_TOUCH_STATUS().x')>before_x+1
            frames=page.evaluate('__parkingQA.frames')
            violations=page.evaluate('__parkingQA.passengerViolations')
            assert not violations,('Passenger artwork duplicated',violations[:4])
            assert page.evaluate('__parkingQA.maxPendingLoops')<=1,'Duplicate game animation loop'
            evidence['instrumentation']={k:page.evaluate(f'__parkingQA.{k}') for k in ['listeners','audioContexts','maxPendingLoops','loopFrames','phaseMaxWeight']}
            evidence['passengerFrameSamples']=frames[-240:]
            context.close()

            # A complete second context exercises current touch movement and transfer controls.
            context=browser.new_context(viewport={'width':844,'height':390},is_mobile=True,has_touch=True)
            page=context.new_page();watch(page);page.add_init_script(INSTRUMENT)
            quest=setup_ride(page,base,57);record=park(page,True)
            use_exit(page,'shopping-arcade',True);use_exit(page,'food-shop',True)
            assert_shared(page,57,quest,0)
            page.locator('.square-exit').tap();page.wait_for_timeout(300)
            assert square(page)['sceneId']=='food-shop'
            if square(page).get('mapOpen'):page.locator('.square-map-close').tap()
            page.locator('#squarePauseBtn').tap();assert square(page)['paused'];page.locator('#squarePauseBtn').tap()
            use_exit(page,'shopping-arcade',True);use_exit(page,'service-courtyard',True);use_exit(page,'metro-square',True)
            page.screenshot(path=str(OUT/'08-emulated-touch-shortcut.png'))
            _,riding=return_and_remount(page,True);assert_shared(page,57,quest,0)
            assert abs(riding['x']-record['parked']['x'])<3
            evidence['touch']={'result':'passed','parking':record,'riding':riding}
            context.close();browser.close()
        assert not errors and not failures,(errors,failures)
        assert all(url.startswith(base+'/') or url.startswith(('blob:','data:')) for url in requests)
        evidence.update({'result':'passed','pageErrors':errors,'httpFailures':failures,'requestCount':len(requests)})
    except Exception as error:
        evidence.update({'result':'failed','failure':repr(error),'pageErrors':errors,'httpFailures':failures});raise
    finally:
        (OUT/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n');server.shutdown();server.server_close()
    hashes={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in OUT.glob('*.png')}
    (OUT/'frames.sha256').write_text(''.join(f'{value}  {name}\n' for name,value in sorted(hashes.items())))
    print('PASS: repeated ride/park/shop/shortcut/remount with reload, pause, touch, frozen simulation and health/inventory/ownership continuity.')


def entry_only():
    """Focused denial while moving, actual stop, and reload in both transfers."""
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    evidence={'result':'running','environment':'Headless system Chromium desktop1440×1000, native time.',
              'setup':'Original debug warp shortens travel only. Actual pedal/brake/E establishes a noncanonical stop position; reload fixtures are produced by production transitions, not storage writes.'}
    errors=[];failures=[]
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            page=browser.new_page(viewport={'width':1440,'height':1000});page.add_init_script(INSTRUMENT)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('response',lambda r:failures.append([r.status,r.url]) if r.status>=400 else None)
            quest=setup_ride(page,base,63)
            remaining=page.evaluate('BEARLY_V146_PIZZA_TEST().remaining')
            assert page.evaluate('BEARLY_V89_TEST.pizza()')
            page.wait_for_function('remaining=>BEARLY_V146_PIZZA_TEST().remaining<remaining',arg=remaining,timeout=5000)
            collected_remaining=page.evaluate('BEARLY_V146_PIZZA_TEST().remaining')
            assert collected_remaining==remaining-1
            # Real source pickup collision awards the source pizza once. Restore
            # only the non-full HP test sentinel before parking, never its flag.
            page.evaluate('BEARLY_DEBUG_MENU.warp(7590);BearlyVisits.setHealth(63)')
            page.wait_for_timeout(150)
            page.keyboard.down('ArrowUp');page.wait_for_timeout(400);page.keyboard.up('ArrowUp')
            assert abs(page.evaluate('BEARLY_TOUCH_STATUS().speed'))>8
            assert page.locator('#centrumRouteEntryBtn').is_disabled()
            page.keyboard.press('e');page.wait_for_timeout(100)
            assert link(page)['phase']=='riding','Moving ride entered without stopping'
            page.keyboard.down('ArrowDown')
            # Holding this original control past zero intentionally reverses.
            # Release at the first forward-stop crossing, then let the tiny
            # residual coast settle rather than holding into a reverse ride.
            page.wait_for_function("""() => {
              if(BEARLY_TOUCH_STATUS().speed>8)return false;
              // Release through the ordinary input listener on this browser
              // frame; cross-process test latency must not hold into reverse.
              window.dispatchEvent(new KeyboardEvent('keyup',{key:'ArrowDown',code:'ArrowDown',bubbles:true}));return true;
            }""",polling='raf',timeout=5000)
            page.keyboard.up('ArrowDown')
            page.wait_for_function('Math.abs(BEARLY_TOUCH_STATUS().speed)<8',timeout=15000)
            page.wait_for_timeout(60)
            stopped=page.evaluate('BEARLY_TOUCH_STATUS()')
            assert stopped['contact'] and abs(stopped['speed'])<8 and 11235<=stopped['x']<=11415,stopped
            page.screenshot(path=str(OUT/'09-moving-stop-marker.png'))
            at_entry=page.evaluate('BEARLY_TOUCH_STATUS()')
            page.keyboard.press('e')
            page.wait_for_function("BearlyCentrumLink.audit().phase==='dismount'&&BearlyVisits.audit().transition==='dismount'",timeout=60000)
            page.wait_for_timeout(400)
            record=parked_record(link(page))
            assert abs(record['parked']['x']-at_entry['x'])<2 and abs(record['parked']['x']-11325)>1,(record['parked'],at_entry)
            assert 'routeProgress' in record,'Parking must persist collected route rewards'
            reward_state={'remaining':page.evaluate('BEARLY_V146_PIZZA_TEST().remaining'),'score':page.evaluate('BEARLY_DEBUG().score')}
            assert reward_state['remaining']==collected_remaining
            assert not page.evaluate('__parkingQA.passengerViolations')
            evidence['movingDeniedThenParked']={'stopped':stopped,'atEntry':at_entry,'parking':record}
            page.reload(wait_until='domcontentloaded');wait_exploration(page)
            assert square(page)['sceneId']=='metro-square';assert_shared(page,63,quest,0);assert_ownership(link(page))
            assert parked_record(link(page))['parked']==record['parked']
            assert parked_record(link(page))['routeProgress']==record['routeProgress']
            assert page.evaluate('BEARLY_V146_PIZZA_TEST().remaining')==reward_state['remaining']
            assert page.evaluate('BEARLY_DEBUG().score')==reward_state['score']
            page.screenshot(path=str(OUT/'10-reload-during-dismount.png'))
            evidence['reloadDuringDismount']={'state':link(page),'position':square(page)['save']['position']}
            page.keyboard.press('q')
            page.wait_for_function("BearlyCentrumLink.audit().phase==='remount'",timeout=30000)
            page.wait_for_timeout(400)
            assert not page.evaluate('__parkingQA.passengerViolations')
            page.reload(wait_until='domcontentloaded');wait_exploration(page)
            assert_shared(page,63,quest,0);assert_ownership(link(page))
            assert parked_record(link(page))['parked']==record['parked']
            assert parked_record(link(page))['routeProgress']==record['routeProgress']
            assert page.evaluate('BEARLY_V146_PIZZA_TEST().remaining')==reward_state['remaining']
            assert page.evaluate('BEARLY_DEBUG().score')==reward_state['score']
            page.screenshot(path=str(OUT/'11-reload-during-remount.png'))
            evidence['reloadDuringRemount']={'state':link(page),'position':square(page)['save']['position']}
            _,riding=return_and_remount(page)
            assert_shared(page,63,quest,0)
            assert abs(riding['x']-record['parked']['x'])<3
            assert page.evaluate('BEARLY_V146_PIZZA_TEST().remaining')==reward_state['remaining']
            assert not page.evaluate('__parkingQA.passengerViolations')
            assert page.evaluate('__parkingQA.maxPendingLoops')<=1
            assert not errors and not failures,(errors,failures)
            evidence.update({'result':'passed','riding':riding,'pageErrors':errors,'httpFailures':failures,
                             'phaseMaxPassengerWeight':page.evaluate('__parkingQA.phaseMaxWeight')})
            browser.close()
    except Exception as error:
        evidence.update({'result':'failed','failure':repr(error),'pageErrors':errors,'httpFailures':failures});raise
    finally:
        (OUT/'entry-evidence.json').write_text(json.dumps(evidence,indent=2)+'\n');server.shutdown();server.server_close()
    print('PASS: moving entry rejected; real stopped position preserved; reload during dismount/remount restores one valid on-foot owner and remounts without healing.')


def workshop_only():
    """Fresh-code coverage for linked workshop ownership and forged targets."""
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    evidence={'result':'running','environment':'Headless system Chromium desktop1440×1000, native keyboard traversal.'}
    errors=[];failures=[]
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            page=browser.new_page(viewport={'width':1440,'height':1000});page.add_init_script(INSTRUMENT)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('response',lambda r:failures.append([r.status,r.url]) if r.status>=400 else None)
            quest=setup_ride(page,base,63);record=park(page)
            use_exit(page,'shopping-arcade');use_exit(page,'bicycle-workshop')
            assert_shared(page,63,quest,0);assert_ownership(link(page))
            assert square(page)['parkingNodeCount']==0
            before=(square(page)['x'],square(page)['y'])
            page.keyboard.press('q');page.wait_for_timeout(500)
            assert square(page)['sceneId']=='bicycle-workshop' and math.dist(before,(square(page)['x'],square(page)['y']))<.1
            if square(page).get('mapOpen'):page.keyboard.press('m')
            assert not page.evaluate("BearlyCentrumLink.requestRemount({sceneId:'metro-square',anchorId:'bicycle-parking'})"),'Forged matching target bypassed actual workshop location'
            page.screenshot(path=str(OUT/'12-workshop-bicycle-outside.png'))
            evidence['workshop']={'link':link(page),'position':square(page)['save']['position']}
            use_exit(page,'shopping-arcade');use_exit(page,'metro-square')
            _,riding=return_and_remount(page);assert_shared(page,63,quest,0)
            assert abs(riding['x']-record['parked']['x'])<3
            assert not page.evaluate('__parkingQA.passengerViolations')
            assert not errors and not failures,(errors,failures)
            evidence.update({'result':'passed','riding':riding,'pageErrors':errors,'httpFailures':failures,
                             'phaseMaxPassengerWeight':page.evaluate('__parkingQA.phaseMaxWeight')})
            browser.close()
    except Exception as error:
        evidence.update({'result':'failed','failure':repr(error),'pageErrors':errors,'httpFailures':failures});raise
    finally:
        (OUT/'workshop-evidence.json').write_text(json.dumps(evidence,indent=2)+'\n');server.shutdown();server.server_close()
    print('PASS: linked workshop roundtrip preserves parked bike, health/items and rejects a forged cross-scene remount target.')


def shortcut_only():
    """The debug menu selects the route stop; E still owns parking/transfer."""
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    evidence={'result':'running','environment':'Headless system Chromium desktop1440×1000, native time.'}
    errors=[];failures=[]
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            page=browser.new_page(viewport={'width':1440,'height':1000});page.add_init_script(INSTRUMENT)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('response',lambda r:failures.append([r.status,r.url]) if r.status>=400 else None)
            quest=setup_ride(page,base,63)
            page.evaluate('BEARLY_DEBUG_MENU.warp(7300)')
            page.keyboard.press('F3');page.locator('#centrumSquareBtn').click();page.wait_for_timeout(180)
            assert link(page)['phase']=='riding' and not square(page)['active']
            assert abs(page.evaluate('BEARLY_TOUCH_STATUS().x')-11325)<1
            before_entry=link(page)
            record=park(page)
            position=square(page)['save']['position'];page.keyboard.press('F3');page.locator('#centrumSquareBtn').click();page.wait_for_timeout(200)
            assert link(page)['phase']=='exploring' and square(page)['active']
            assert parked_record(link(page))['parked']==record['parked']
            assert square(page)['save']['position']==position
            _,riding=return_and_remount(page);assert_shared(page,63,quest,0)
            assert not page.evaluate('__parkingQA.passengerViolations')
            assert not errors and not failures,(errors,failures)
            evidence.update({'result':'passed','beforeRealEntry':before_entry,'parking':record,'riding':riding,'pageErrors':errors,'httpFailures':failures})
            browser.close()
    except Exception as error:
        evidence.update({'result':'failed','failure':repr(error),'pageErrors':errors,'httpFailures':failures});raise
    finally:
        (OUT/'shortcut-evidence.json').write_text(json.dumps(evidence,indent=2)+'\n');server.shutdown();server.server_close()
    print('PASS: debug shortcut selects route stop without bypassing transfer; while exploring it preserves the same parking owner.')


if __name__=='__main__':
    if '--entry-only' in sys.argv:entry_only()
    elif '--workshop-only' in sys.argv:workshop_only()
    elif '--shortcut-only' in sys.argv:shortcut_only()
    else:main()
    # Focused modes refresh shared capture names too; hash only after the
    # selected complete flow has stopped writing its actual screenshots.
    (OUT/'frames.sha256').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in sorted(OUT.glob('*.png'))))
