"""Stage8 regression/edge checks in disposable Chromium contexts.

The main no-debug road-to-quest playthrough is a separate test. This focused
suite explicitly prepares supplies, health, parking and fear/defeat states with
production save factories/source QA hooks; actual keyboard/touch input performs
transactions, scene exits, pauses, retry and viewport interaction. Historical
captures stay unchanged. No runtime file or donor save is edited.
"""
import argparse
import functools
import hashlib
import json
import sys
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
import centrum_economy_browser as e

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification/stage8/edges'
OUT.mkdir(parents=True,exist_ok=True)


def prepared_closed(setup,template,scene_id='metro-square'):
    return setup.evaluate(r'''([template,id])=>{
      const K='bq-centrum:scene-network:v1',P='bq-centrum:parking:v1',s=BearlyCentrumScenes.get(id),entranceId=s.defaultEntrance;
      const p={sceneId:id,entranceId,...s.anchors[entranceId]},parking=structuredClone(template);parking.phase='exploring';parking.health=63;parking.exploration=p;
      const values=new Map([[K,JSON.stringify({schemaVersion:1,layoutVersion:3,gateOpened:false,discovered:['metro-square'],position:p,inventory:{billys:0}})],[P,JSON.stringify(parking)]]);
      const native={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v))};
      const b=BearlyCentrumSave.createAdventure(native),route={...BearlyCentrumLink.audit().route,health:63,x:parking.parked.x,y:parking.parked.y,speed:0,routeProgress:parking.routeProgress};
      b.syncSession({health:63,mode:'exploring',route,exploration:p});b.checkpoint('edge-prepared-state');
      return{raw:values.get(K),description:{sceneId:id,food:0,hp:63,gate:false,fixture:true}};
    }''',[template,scene_id])


def extra():
    folder=OUT/'interaction-edges';folder.mkdir(exist_ok=True)
    result={'stage':8,'scenario':'interaction-edges','preparedFixtures':True,'checks':[],'errors':[],'httpFailures':[],
        'conditions':['System Chromium /usr/bin/chromium, desktop1280x720 and844x390 touch emulation.','Supplies/health/named-spawn/temporary fear are explicit fixtures. Traversal, pause, resizing, talking and retries use real UI input.','No physical iPhone/Safari test is claimed.']}
    def note(name,page,details=None):
        result['checks'].append({'name':name,'passed':True,'details':details,'state':e.brief(page)});print('Passed '+name,flush=True)
    def shot(page,name):page.screenshot(path=str(folder/(name+'.png')))
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(e.Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        def watch(page):
            page.on('pageerror',lambda error:result['errors'].append(str(error)))
            page.on('response',lambda response:result['httpFailures'].append({'status':response.status,'url':response.url}) if response.status>=400 else None)
        base=f'http://127.0.0.1:{server.server_port}'
        setup_context,setup=e.make_context(browser,base,watch=watch)
        setup.evaluate('BEARLY_DEBUG_MENU.warp(7550);BearlyVisits.setHealth(63)');setup.wait_for_timeout(300);setup.keyboard.press('e');e.wait_exploration(setup)
        template=setup.evaluate('BearlyCentrumLink.audit().parking');prepared=prepared_closed(setup,template)
        context,page=e.make_context(browser,base,prepared,watch=watch)
        e.walk_to(page,{'x':1360,'y':820});before=e.brief(page)
        for _ in range(8):page.keyboard.press('e');page.wait_for_timeout(70)
        assert e.sq(page)['sceneId']=='metro-square' and not e.ledger(page)['gateOpened']
        assert (e.health(page),e.ledger(page)['wallet'],e.ledger(page)['inventory'])==(63,{'kr':0},{'billys':0})
        shot(page,'01-locked-exit-refused');note('Repeated native E cannot use the square-side locked gate or change health/supplies',page)
        e.walk_to(page,{'x':820,'y':700})
        for _ in range(3):page.keyboard.press('e')
        assert e.sq(page)['sceneId']=='metro-square' and not page.locator('.centrum-dialogue').is_visible()
        note('Remote interaction cannot activate an exit or essential target',page)
        # Frozen route data and position do not advance during a held scene.
        before=page.evaluate('({route:BearlyCentrumLink.audit().route,player:BearlyCentrumSquare.position(),npc:BearlyCentrumCivilians.audit().residents})')
        page.keyboard.press('p');page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(150)
        page.keyboard.down('ArrowRight');page.wait_for_timeout(350);page.keyboard.up('ArrowRight');after=e.sq(page)
        assert abs(after['x']-before['player']['x'])<1 and abs(after['y']-before['player']['y'])<1
        assert e.health(page)==63 and after['paused']
        page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(150);page.set_viewport_size({'width':1280,'height':720});page.wait_for_timeout(150)
        page.keyboard.press('p');e.hold(page,'ArrowLeft',220);assert e.sq(page)['x']<before['player']['x']-10
        assert page.evaluate('BearlyCentrumLink.audit().route.simTime')==before['route']['simTime']
        shot(page,'02-resize-pause-resume');note('Pause and landscape/portrait/desktop resize preserve state; movement resumes and road simulation stays held',page)
        e.use_exit(page,'shopping-arcade');e.use_exit(page,'food-shop');e.close_dialogue(page)
        quest_before=page.evaluate('BearlyWrongEntranceQuest.game.snapshot()')
        rejected=page.evaluate("BearlyCentrumStory.interact({id:'shopkeeper-talk',kind:'story',target:'shopkeeper',npcId:'food-shop-host',x:BearlyCentrumSquare.position().x,y:BearlyCentrumSquare.position().y,radius:9999})")
        assert rejected is False and page.evaluate('BearlyWrongEntranceQuest.game.snapshot()')==quest_before
        note('Forged target coordinates cannot bypass canonical counter approach',page)
        # Temporary giver failure is injected via the source civilian system,
        # not a new game rule. Availability/recovery itself advances live.
        assert page.evaluate("BearlyCentrumCivilians.disturb('food-shop-host','frightened')")
        e.reload_latest(page)
        assert page.evaluate('BearlyWrongEntranceQuest.game.snapshot().state')=='discovered'
        assert not page.evaluate("BearlyCentrumCivilians.requestTalk('food-shop-host').available")
        note('Temporary frightened essential resident persists through reload without advancing the task',page)
        page.wait_for_function("BearlyCentrumCivilians.requestTalk('food-shop-host').available",timeout=45000)
        e.counter_action(page,'receive_slip')
        assert page.evaluate('BearlyWrongEntranceQuest.game.snapshot().state')=='slip_received'
        assert e.health(page)==63
        shot(page,'03-essential-target-recovered');note('Recovered quest giver becomes reachable and the existing slip interaction works',page)
        # A remount request from a remote room must not silently teleport.
        parking=page.evaluate('BearlyCentrumLink.audit().parking');denied=page.evaluate("BearlyCentrumLink.requestRemount({sceneId:'food-shop',anchorId:'bicycle-parking'})")
        assert denied is False and page.evaluate('BearlyCentrumLink.audit().phase')=='exploring'
        page.keyboard.press('q');page.wait_for_timeout(150)
        assert e.sq(page)['mapOpen'] and e.sq(page)['sceneId']=='food-shop'
        assert page.evaluate('BearlyCentrumLink.audit().parking.parked')==parking['parked']
        shot(page,'04-remote-bike-route-only');note('Impossible cross-scene remount is refused; Q shows a route rather than teleporting',page)
        page.keyboard.press('m');context.close()
        # Fresh emulated-touch context; no physical device/browser claim.
        context,page=e.make_context(browser,base,prepared,touch=True,watch=watch)
        start=e.sq(page);e.hold(page,'ArrowRight',300,True);assert e.sq(page)['x']>start['x']+10
        page.locator('#squarePauseBtn').tap();frozen=e.sq(page);page.set_viewport_size({'width':932,'height':430});page.wait_for_timeout(200)
        page.locator('#squarePauseBtn').tap();e.hold(page,'ArrowRight',300,True);assert e.sq(page)['x']>frozen['x']+10
        assert e.health(page)==63 and e.ledger(page)['inventory']['billys']==0
        shot(page,'05-touch-resize-resume');note('Touch-emulated movement, pause/resume and viewport changes retain controls and shared state',page)
        context.close();setup_context.close();browser.close()
      assert not result['errors'] and not result['httpFailures'],result
      result['passed']=True
    except Exception as exc:
      result['passed']=False;result['failure']=repr(exc);raise
    finally:
      server.shutdown();(folder/'results.json').write_text(json.dumps(result,indent=2)+'\n')
      (folder/'frames.sha256').write_text(''.join(f'{hashlib.sha256(f.read_bytes()).hexdigest()}  {f.name}\n' for f in sorted(folder.glob('*.png'))))
    return result


def occlusion():
    """Native walking/jumping prove floor anchors in the rendered runtime."""
    folder=OUT/'occlusion';folder.mkdir(exist_ok=True)
    result={'stage':8,'scenario':'occlusion','preparedFixtures':True,'checks':[],'errors':[],'httpFailures':[]}
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(e.Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
    def add(name,page,details=None):result['checks'].append({'name':name,'passed':True,'details':details,'state':e.brief(page)})
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        def watch(page):
            page.on('pageerror',lambda error:result['errors'].append(str(error)))
            page.on('response',lambda response:result['httpFailures'].append({'status':response.status,'url':response.url}) if response.status>=400 else None)
        base=f'http://127.0.0.1:{server.server_port}';sc,setup=e.make_context(browser,base,watch=watch)
        setup.evaluate('BEARLY_DEBUG_MENU.warp(7550);BearlyVisits.setHealth(63)');setup.wait_for_timeout(300);setup.keyboard.press('e');e.wait_exploration(setup)
        prepared=prepared_closed(setup,setup.evaluate('BearlyCentrumLink.audit().parking'));context,page=e.make_context(browser,base,prepared,watch=watch)
        e.walk_to(page,{'x':500,'y':530});a=e.sq(page);order=[n['id'] for n in a['drawOrder']]
        assert order.index('player')<order.index('bench-west') and a['shadow']['y']==a['y'];page.screenshot(path=str(folder/'01-behind-bench.png'));add('Native approach behind bench uses ground foot depth and grounded shadow',page,{'depth':a['y'],'order':order})
        page.keyboard.press('Space');page.wait_for_function('BearlyCentrumSquare.audit().jump>30');j=e.sq(page);order=[n['id'] for n in j['drawOrder']]
        assert j['jump']>30 and abs(j['y']-a['y'])<1 and j['shadow']['y']==j['y'];assert order.index('player')<order.index('bench-west')
        baby=j['hero']['babyFace'];assert baby['continuousUpperBody'] and baby['originalCollar'] and not baby['headOnly'];assert abs(baby['uniformScale']-.5710830421929589)<1e-8
        page.screenshot(path=str(folder/'02-live-jump-grounded-shadow.png'));add('Live jump changes actor height while shadow/sort stay on floor and native baby stays continuous',page,{'jump':j['jump'],'shadow':j['shadow'],'baby':baby})
        page.wait_for_function('BearlyCentrumSquare.audit().jump===0');e.hold(page,'ArrowDown',700);blocked=e.sq(page);assert blocked['y']<=544.1
        e.walk_to(page,{'x':500,'y':630});a=e.sq(page);order=[n['id'] for n in a['drawOrder']];assert order.index('player')>order.index('bench-west')
        page.screenshot(path=str(folder/'03-around-front-bench.png'));add('Bench collision refuses crossing; walking around reaches front sorting',page,{'blockedY':blocked['y'],'frontY':a['y'],'order':order})
        e.walk_to(page,{'x':820,'y':430});page.wait_for_timeout(150);plant=page.evaluate("BearlyCentrumSquareWorld.audit().planters.find(p=>p.id==='planter')")
        assert plant['faded'] and plant['foliageAlpha']==.35 and plant['stoneAlpha']==1;assert not page.evaluate('(p)=>BearlyCentrumSquareWorld.blocked(p.x,p.y,22,12,p.sceneId)',page.evaluate('BearlyCentrumSquare.position()'))
        page.screenshot(path=str(folder/'04-foliage-only-fade.png'));add('Planter foliage fades for baby; opaque collidable stone and actual floor remain fixed',page,plant)
        context.close();sc.close();browser.close()
      assert not result['errors'] and not result['httpFailures'],result;result['passed']=True
    except Exception as exc:result['passed']=False;result['failure']=repr(exc);raise
    finally:
      server.shutdown();(folder/'results.json').write_text(json.dumps(result,indent=2)+'\n');(folder/'frames.sha256').write_text(''.join(f'{hashlib.sha256(f.read_bytes()).hexdigest()}  {f.name}\n' for f in sorted(folder.glob('*.png'))))
    return result


def parking_transfers():
    """Reuse the native Stage4 transfer test with the authorized food destination."""
    import centrum_parking as parking
    folder=OUT/'parking-transfers';folder.mkdir(exist_ok=True);parking.OUT=folder
    original=parking.assert_shared
    def current_shared(page,health,quest,billys=None):
        original(page,health,quest,None)
        if billys is not None:
            assert page.evaluate('BearlyCentrumSave.adventure.snapshot().inventory.billys')==1,'The one actual pickup must remain in the current bag.'
    parking.assert_shared=current_shared
    parking.entry_only()
    evidence=json.loads((folder/'entry-evidence.json').read_text())
    evidence['currentFoodExpectation']='The one source pickup enters inventory (1), rather than old immediate healing. All transfers preserve that one food.'
    evidence['fixtureDisclosure']='Source debug placement/health/legacy quest flag are prepared sentinels; actual pedal/brake/E, reload during both animated transfers, Q/remount and grounded wheels use live input. Separate from the primary no-debug route.'
    evidence['stage']=8
    (folder/'entry-evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
    (folder/'frames.sha256').write_text(''.join(f'{hashlib.sha256(f.read_bytes()).hexdigest()}  {f.name}\n' for f in sorted(folder.glob('*.png'))))
    return evidence


def consolidate():
    result={'stage':8,'passed':True,'scenarios':[],'checks':[],'errors':[],'httpFailures':[],'fixtureDisclosure':__doc__,
        'execution':'Focused scenarios may run separately; this summary merges only their completed, passing saved results. No historical evidence is overwritten.'}
    for name in ['consumables','interaction-edges','occlusion']:
        f=OUT/name/'results.json'
        if not f.exists():continue
        part=json.loads(f.read_text());assert part.get('passed'),(name,part.get('failure'))
        result['scenarios'].append(name);result['checks']+=part['checks'];result['errors']+=part['errors'];result['httpFailures']+=part['httpFailures']
    f=OUT/'parking-transfers/entry-evidence.json'
    if f.exists():
        part=json.loads(f.read_text());assert part['result']=='passed',part
        result['scenarios'].append('parking-transfers');result['checks'].append({'name':'Moving park denial, reload during dismount/remount, one baby/bike, current food persistence and grounded remount','passed':True,'evidence':'parking-transfers/entry-evidence.json'});result['errors']+=part['pageErrors'];result['httpFailures']+=part['httpFailures']
    assert not result['errors'] and not result['httpFailures'],result
    (OUT/'results.json').write_text(json.dumps(result,indent=2)+'\n');return result


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--scenario',default='all',choices=['all','regression','interaction-edges','parking-transfers','occlusion']);args=parser.parse_args()
    result={'stage':8,'passed':False,'scenarios':[],'checks':[],'errors':[],'httpFailures':[],'fixtureDisclosure':__doc__}
    if args.scenario in ['all','regression']:
        e.OUT=OUT/'consumables';e.OUT.mkdir(exist_ok=True);old=sys.argv;sys.argv=[old[0],'--scenario','all']
        try:e.main()
        finally:sys.argv=old
        part=json.loads((e.OUT/'results.json').read_text());result['scenarios'].append('consumables');result['checks']+=part['checks'];result['errors']+=part['errors'];result['httpFailures']+=part['httpFailures']
    if args.scenario in ['all','interaction-edges']:
        part=extra();result['scenarios'].append('interaction-edges');result['checks']+=part['checks'];result['errors']+=part['errors'];result['httpFailures']+=part['httpFailures']
    if args.scenario in ['all','occlusion']:
        part=occlusion();result['scenarios'].append('occlusion');result['checks']+=part['checks'];result['errors']+=part['errors'];result['httpFailures']+=part['httpFailures']
    if args.scenario in ['all','parking-transfers']:
        part=parking_transfers();result['scenarios'].append('parking-transfers');result['checks'].append({'name':'Moving park denial, both transfer reloads, one baby/bike, current food persistence and grounded remount','passed':part['result']=='passed'});result['errors']+=part['pageErrors'];result['httpFailures']+=part['httpFailures']
    result=consolidate()
    print('PASS:',len(result['checks']),'Stage8 browser edge/regression checks; fixtures disclosed; no JS/HTTP failures.')

if __name__=='__main__':main()
