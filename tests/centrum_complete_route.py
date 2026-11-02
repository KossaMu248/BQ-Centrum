"""Fresh, no-warp acceptance route driven only by ordinary browser controls.

Read-only audits inform keyboard input; no teleport, health, god-mode, quest,
wallet or inventory setter is used. Every primary-path reward is earned.
"""
import argparse
import functools
import hashlib
import json
import math
import time
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
from centrum_economy_browser import Quiet, wait_ready, wait_exploration, walk_to, use_exit, close_dialogue, open_bag, start_eat, counter_action
from centrum_parking import INSTRUMENT, return_and_remount
import wrong_entrance as story

INSTRUMENT=INSTRUMENT.replace('loopFrames:0,','loopFrames:0,frameTimes:[],').replace('evidence.pendingLoops--;evidence.loopFrames++;','evidence.pendingLoops--;evidence.loopFrames++;evidence.frameTimes.push(time);')
INSTRUMENT=INSTRUMENT.replace('phaseMaxWeight:{}}','phaseMaxWeight:{},transferHealthSamples:[]}').replace('const weight=drawing.passengers.reduce', "if(['dismount','remount'].includes(drawing.phase)&&evidence.transferHealthSamples.length<512){const hp=window.BearlyCentrumLink.audit().route.health,node=document.querySelector('.brawl-hp');evidence.transferHealthSamples.push({phase:drawing.phase,hp,visible:!!node?.checkVisibility(),activeTransition:window.BearlyVisits?.audit().transition,aria:node?.getAttribute('aria-label'),widths:node?[...node.children].map(h=>{const value=parseFloat(h.firstElementChild.style.width);return Number.isFinite(value)?value:null;}):[]});}const weight=drawing.passengers.reduce")
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification/stage8/full-route';OUT.mkdir(parents=True,exist_ok=True)

def ride_audit(page):
    return page.evaluate('''()=>{const r=BearlyCentrumLink.audit().route,d=BEARLY_DEBUG(),s=BearlyCentrumSave.adventure.snapshot();return {x:r.x,y:r.y,speed:r.speed,state:r.state,health:r.health,grounded:r.grounded,angle:r.angle,simTime:r.simTime,babyMounted:r.babyMounted,food:s.inventory.billys,collected:s.collectedIDs,reason:d.deathReason,panic:d.panic,lastHit:d.lastHitKind,projectiles:r.projectiles};}''')

def note(result,name,page,extra=None):
    state={'ride':ride_audit(page),'link':page.evaluate('BearlyCentrumLink.audit().phase'),'quest':page.evaluate('BearlyWrongEntranceQuest.game.snapshot()'),'economy':page.evaluate('({food:BearlyCentrumEconomy.snapshot().inventory.billys,money:BearlyCentrumEconomy.snapshot().wallet.kr})')}
    result['steps'].append({'name':name,'state':state,'extra':extra});print(name,json.dumps(state['ride']),flush=True)
    (OUT/'live-progress.json').write_text(json.dumps(result,indent=2)+'\n')

def shot(result,page,name):
    path=OUT/(name+'.png');page.screenshot(path=str(path));result['captures'].append({'file':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'ownership':page.evaluate('BearlyCentrumLink.audit().ownership'),'hero':page.evaluate('BearlyCentrumSquare.active()?BearlyCentrumSquare.audit().hero:null'),'ride':ride_audit(page)})

def road_to_stop(page,result):
    # Ride the authored road normally and allow its actual fixed hazards to
    # apply source damage. No health setter is used. Genuine injuries let the
    # selected supplies be eaten after parking before earning reward/purchase.
    keys=set();fired=set();samples=[];last_report=-1;started=time.monotonic()
    targets=[]
    def controls(wanted):
        nonlocal keys
        for k in keys-wanted:page.keyboard.up(k)
        for k in wanted-keys:page.keyboard.down(k)
        keys=set(wanted)
    try:
      for _ in range(1400):
        r=ride_audit(page);samples.append(r)
        if r['state']!='playing':raise AssertionError(('Road ride stopped',r))
        if time.monotonic()-started>240:raise AssertionError(('Road timeout',r))
        x,v=r['x'],r['speed'];band=int(x//1000)
        if band!=last_report:
            last_report=band;print('Riding',json.dumps(r),flush=True)
        if x>=11285 and abs(v)<8 and r['grounded']:
            controls(set());break
        nearest=next(((name,at,skip) for name,at,skip in targets if name not in fired and x<at+120),None)
        skip=nearest and nearest[2] and 0<nearest[1]-x<700
        goal=350 if skip else 245
        if x>10900:goal=min(goal,max(28,(11325-x)*1.3))
        wanted={'ArrowUp'} if v<goal-15 else {'ArrowDown'} if v>goal+18 else set()
        if x>11285 and v>0:wanted={'ArrowDown'}
        controls(wanted)
        if nearest:
            name,at,is_skip=nearest
            start=180 if is_skip else max(140,v*.45)
            if 0<at-x<start and r['grounded']:
                page.keyboard.press('Space');fired.add(name);print('Jump',name,round(x),round(v),flush=True)
        page.wait_for_timeout(90)
      else:raise AssertionError('Road sample budget exhausted')
    finally:controls(set())
    result['roadSamples']=samples
    # Braking changes into reverse on the next source physics step. A sampled
    # release can straddle a frame, so coast normally inside the stop radius.
    for _ in range(100):
        r=ride_audit(page)
        if abs(r['speed'])<7:break
        page.wait_for_timeout(100)
    r=ride_audit(page)
    assert r['x']>=11235 and r['x']<=11415 and abs(r['speed'])<8 and r['babyMounted'],r
    assert r['health']>0,r
    return r

def instrumentation(page):
    return page.evaluate('({listeners:__parkingQA.listeners,audioContexts:__parkingQA.audioContexts,maxPendingLoops:__parkingQA.maxPendingLoops,passengerViolations:__parkingQA.passengerViolations,phaseMaxWeight:__parkingQA.phaseMaxWeight,frameTimes:__parkingQA.frameTimes,transferHealthSamples:__parkingQA.transferHealthSamples})')

def finish_words(page):
    for _ in range(15):
        if not page.locator('.centrum-dialogue').is_visible():return
        nxt=page.locator('.centrum-dialogue [data-dialogue-next]:visible:not(:disabled)')
        if nxt.count():nxt.first.click();page.wait_for_timeout(120)
        else:close_dialogue(page);return
    raise AssertionError('Dialogue failed to finish')

def quest_interact(page,role=None,target=None,action=None,parcel=None):
    if role:story.walk_to_civilian(page,role)
    else:walk_to(page,target)
    page.keyboard.press('e');page.locator('.centrum-dialogue').wait_for(state='visible')
    story.advance_to_choice(page)
    if action:
        button=page.locator('.centrum-dialogue [data-quest-action="'+action+'"]'+('[data-parcel-id="'+parcel+'"]' if parcel else '')+':visible')
        assert button.count(),page.locator('.centrum-dialogue').inner_text()
        button.click();page.wait_for_timeout(200)
    finish_words(page)

def route_exit(page,destination):
    hp=ride_audit(page)['health'];food=page.evaluate('BearlyCentrumEconomy.snapshot().inventory.billys')
    use_exit(page,destination)
    assert ride_audit(page)['health']==hp and page.evaluate('BearlyCentrumEconomy.snapshot().inventory.billys')==food,'Transition granted health or inventory'
    assert page.evaluate('BearlyCentrumLink.audit().ownership.bicycles===1&&BearlyCentrumLink.audit().ownership.passengers===1')

def eat(page,result,name):
    before=ride_audit(page);start_eat(page,spam=True)
    begin=page.evaluate('BearlyCentrumInventory.audit().eating');assert begin
    page.wait_for_function('BearlyCentrumInventory.audit().eating===null',timeout=6000)
    after=ride_audit(page);assert after['food']==before['food']-1 and after['health']==min(100,before['health']+20),(before,after)
    note(result,name,page,{'actionId':begin['id'],'elapsedRequired':begin['duration']})

def reload_check(page,result,name):
    before=page.evaluate('({q:BearlyWrongEntranceQuest.game.snapshot(),s:BearlyCentrumEconomy.snapshot(),p:BearlyCentrumLink.audit().parking})')
    result.setdefault('instrumentationByVisit',[]).append(instrumentation(page))
    page.reload(wait_until='domcontentloaded');wait_ready(page);wait_exploration(page)
    after=page.evaluate('({q:BearlyWrongEntranceQuest.game.snapshot(),s:BearlyCentrumEconomy.snapshot(),p:BearlyCentrumLink.audit().parking})')
    for key in ['wallet','inventory','collectedIDs','rewardClaims']:assert before['s'][key]==after['s'][key],(name,key)
    assert before['q']['state']==after['q']['state'] and before['s']['session']['health']==after['s']['session']['health'],name
    assert before['p']['parked']==after['p']['parked'] and before['p']['bikeId']==after['p']['bikeId'],name
    note(result,name,page)

def complete_centrum(page,result):
    road=ride_audit(page);page.keyboard.press('e')
    page.wait_for_function("BearlyCentrumLink.audit().phase==='dismount'&&BearlyVisits.audit().transition==='dismount'",timeout=60000)
    phases=[]
    for _ in range(70):
        v=page.evaluate('BearlyVisits.audit()');phases.append({'phase':v['phase'],'owner':v['passengerOwner']})
        if len(phases)==3:
            assert page.locator('.brawl-hp').get_attribute('aria-label')==f"Health {road['health']} out of 100",'Transfer HUD is stale'
            shot(result,page,'03-production-dismount')
        if page.evaluate("BearlyCentrumLink.audit().phase==='exploring'"):break
        page.wait_for_timeout(80)
    wait_exploration(page);parking=page.evaluate('BearlyCentrumLink.audit().parking');result['originalParking']=parking
    assert ride_audit(page)['health']==road['health'],'Park granted health'
    assert page.evaluate('BearlyCentrumSquare.audit().parkingNodeCount')==1
    note(result,'Original dismount parked one bicycle and transferred one baby',page,phases);shot(result,page,'04-metro-square')
    # Three real route wrappers were collected. Real road wounds allow two
    # legitimate selected consumptions, leaving capacity for reward then purchase.
    eat(page,result,'Eat first genuinely collected road pizza after road injuries')
    if ride_audit(page)['health']<100:eat(page,result,'Eat second road pizza without menu-frozen healing')
    assert ride_audit(page)['food']==1 and ride_audit(page)['health']<100,ride_audit(page)
    route_exit(page,'shopping-arcade');route_exit(page,'food-shop');finish_words(page)
    quest_interact(page,role='shopkeeper',action='receive_slip')
    assert page.evaluate('BearlyWrongEntranceQuest.game.snapshot().state')=='slip_received'
    note(result,'Food shop gave the ordinary delivery slip via actual talk',page);shot(result,page,'05-accepted-task')
    reload_check(page,result,'Reload retained the earned slip, health, food and parked bicycle')
    route_exit(page,'shopping-arcade');route_exit(page,'service-courtyard')
    cage=page.evaluate("BearlyCentrumScenes.get('service-courtyard').interactions.find(a=>a.id==='delivery-cage')")
    quest_interact(page,target=cage,action='inspect_cage');quest_interact(page,role='caretaker',action='present_slip')
    quest_interact(page,target=cage,action='confirm_parcel',parcel='B-04')
    page.wait_for_function('BearlyWrongEntranceQuest.game.snapshot().cargoMoved',timeout=30000)
    finish_words(page);note(result,'Caretaker approved and visibly moved correct parcel B-04',page);shot(result,page,'06-caretaker-delivery')
    route_exit(page,'metro-square');assert page.evaluate('BearlyCentrumEconomy.snapshot().gateOpened')
    note(result,'Courtyard opened the independent shortcut back to the same square',page);shot(result,page,'07-open-shortcut')
    reload_check(page,result,'Reload retained the opened shortcut and approved delivery')
    route_exit(page,'shopping-arcade');route_exit(page,'food-shop')
    quest_interact(page,role='shopkeeper',action='report');assert page.evaluate('BearlyWrongEntranceQuest.game.snapshot().state')=='reported'
    before=ride_audit(page);counter_action(page,'claim_reward')
    assert page.evaluate('BearlyWrongEntranceQuest.game.snapshot().state')=='reward_claimed'
    assert ride_audit(page)['food']==before['food']+1 and page.evaluate('BearlyCentrumEconomy.snapshot().wallet.kr')==40
    counter_action(page,'buy_billys');assert ride_audit(page)['food']==3 and page.evaluate('BearlyCentrumEconomy.snapshot().wallet.kr')==20
    note(result,'Reported, redeemed one-time40kr plus Billy’s and bought pizza for20kr',page);shot(result,page,'08-bought-pizza')
    reload_check(page,result,'Reload retained reward receipt, purchase and full inventory')
    eat(page,result,'Selected and ate purchased supplies safely with one atomic heal')
    shot(result,page,'09-selected-and-ate-safe')
    route_exit(page,'shopping-arcade');route_exit(page,'metro-square')
    now=page.evaluate('BearlyCentrumLink.audit().parking');assert now['parked']==parking['parked'] and now['bikeId']==parking['bikeId']
    prior=ride_audit(page)['health'];path,riding=return_and_remount(page)
    assert ride_audit(page)['health']==prior and page.evaluate('BEARLY_DEBUG().babySeated')
    note(result,'Remounted the original parked bicycle with grounded wheels',page,{'pathSamples':path,'grounded':riding});shot(result,page,'10-remounted-original-bike')
    x=ride_audit(page)['x'];page.keyboard.down('ArrowUp');page.wait_for_timeout(1200);page.keyboard.up('ArrowUp');assert ride_audit(page)['x']>x+30
    note(result,'Riding resumed after the complete earned Centrum path',page);shot(result,page,'11-ride-resumed')

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--road-only',action='store_true');args=parser.parse_args()
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    result={'result':'running','environment':'Headless system Chromium1280x720, fresh disposable storage, native time and ordinary keyboard/browser controls','noDebugTeleportOrSetters':True,'steps':[],'captures':[],'pageErrors':[],'httpFailures':[],'requests':0}
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);context=browser.new_context(viewport={'width':1280,'height':720});context.add_init_script(INSTRUMENT);page=context.new_page()
        page.on('pageerror',lambda e:result['pageErrors'].append(str(e)))
        page.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
        def request(_):result['requests']+=1
        page.on('request',request)
        import centrum_parking
        centrum_parking.OUT=OUT
        story.OUT=OUT
        recording=story.GameplayRecording(page)
        page.goto(base+'/index.html',wait_until='domcontentloaded');wait_ready(page);page.click('#introStart');page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'")
        result['build']=page.evaluate('BEARLY_BUILD_ID')
        note(result,'Fresh ride begins without any debug or save fixture',page);shot(result,page,'01-fresh-ride')
        road_to_stop(page,result);note(result,'Ride reached marked Centrum stop through actual road controls',page);shot(result,page,'02-rode-to-stop')
        if not args.road_only:
            complete_centrum(page,result)
        result['instrumentation']=instrumentation(page)
        assert result['instrumentation']['maxPendingLoops']==1 and not result['instrumentation']['passengerViolations']
        visits=result.get('instrumentationByVisit',[])+[result['instrumentation']]
        assert all(v['maxPendingLoops']==1 and not v['passengerViolations'] for v in visits)
        assert all(v['listeners']==visits[0]['listeners'] for v in visits),'Input listeners duplicated across reloads'
        transfers=[s for v in visits for s in v['transferHealthSamples'] if s.get('visible') and s.get('activeTransition')]
        assert transfers and all(s['aria']==f"Health {s['hp']} out of 100" for s in transfers),'Transfer HUD health disagrees with shared health'
        assert all(all(math.isclose(width,max(0,min(1,(s['hp']-i*20)/20))*100,abs_tol=.01) for i,width in enumerate(s['widths'])) for s in transfers),'Transfer heart fill disagrees with shared health'
        result['transferHudVerification']={'samples':len(transfers),'phases':sorted(set(s['phase'] for s in transfers)),'allAriaAndFiveHeartFillsMatchSharedHealth':True}
        deltas=sorted(b-a for v in visits for a,b in zip(v['frameTimes'],v['frameTimes'][1:]) if b>a)
        percentile=lambda p:deltas[min(len(deltas)-1,round((len(deltas)-1)*p))]
        result['frameTiming']={'sampleCount':len(deltas),'medianMs':percentile(.5),'p95Ms':percentile(.95),'p99Ms':percentile(.99),'maxMs':max(deltas),'scope':'Named main-loop frames across fresh ride and all reload lifetimes, including loading and scene changes under shared-container test work.'}
        result['instrumentationSummary']={'pageLifetimes':len(visits),'maxPendingMainLoops':max(v['maxPendingLoops'] for v in visits),'passengerDuplicationViolations':sum(len(v['passengerViolations']) for v in visits),'listenerRegistrationShapeIdenticalAcrossReloads':True,'audioContextsPerPage':[v['audioContexts'] for v in visits]}
        assert not result['pageErrors'] and not result['httpFailures'],result
        result['recording']=recording.finish()
        result['result']='passed';browser.close()
    except Exception as exc:
        result['failure']=str(exc);raise
    finally:
        server.shutdown();(OUT/'results.json').write_text(json.dumps(result,indent=2)+'\n')
        shots=sorted(OUT.glob('*.png'));(OUT/'frames.sha256').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in shots))
        if result.get('result')=='passed':(OUT/'live-progress.json').unlink(missing_ok=True)
if __name__=='__main__':main()
