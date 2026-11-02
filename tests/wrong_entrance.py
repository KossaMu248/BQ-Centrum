"""The Wrong Entrance: one complete quest through production gameplay controls.

Only the route-shortening debug warp, non-default health/quest test sentinels and
source civilian-disturbance adapter are test fixtures. Scene travel and quest
progress use ordinary movement, E and visible dialogue choices. No player
teleports or direct quest-state writes occur in the acceptance route.
"""
import base64
import functools
import hashlib
import json
import math
import shutil
import subprocess
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from centrum_network import route, scene, exit_to

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'verification/stage5'
OUT.mkdir(parents=True, exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def square(page):
    return page.evaluate('BearlyCentrumSquare.audit()')

def quest(page):
    return page.evaluate('BearlyWrongEntranceQuest.game.snapshot()')

def hold(page, key, ms):
    page.keyboard.down(key)
    page.wait_for_timeout(ms)
    page.keyboard.up(key)
    page.wait_for_timeout(180)

def move_axis(page, axis, target, tolerance=8):
    for _ in range(15):
        delta = target-square(page)[axis]
        if abs(delta)<=tolerance:
            return
        key = ('ArrowRight' if delta>0 else 'ArrowLeft') if axis=='x' else ('ArrowDown' if delta>0 else 'ArrowUp')
        hold(page, key, min(2400, max(60, abs(delta)/155*1000-80)))
    raise AssertionError(('blocked keyboard waypoint', axis, target, square(page)))

def walk_to(page, target):
    data=scene(page); state=square(page)
    for x,y in route(data,(state['x'],state['y']),(target['x'],target['y'])):
        move_axis(page,'x',x);move_axis(page,'y',y)
    assert math.dist((square(page)['x'],square(page)['y']),(target['x'],target['y']))<38,(target,{'sceneId':square(page)['sceneId'],'x':square(page)['x'],'y':square(page)['y']})

def use_exit(page, destination):
    target=exit_to(page,destination)
    walk_to(page,target);page.keyboard.press('e')
    page.wait_for_function("id=>BearlyCentrumSquare.audit().sceneId===id&&!BearlyCentrumSquare.audit().loading&&!BearlyCentrumSquare.audit().transition",arg=destination,timeout=60000)
    page.wait_for_timeout(300)

def wait_exploration(page):
    page.wait_for_function("window.BearlyCentrumLink?.audit().phase==='exploring'&&BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading",timeout=60000)
    page.wait_for_timeout(300)

def civilian(page, role):
    return page.evaluate('(role)=>BearlyCentrumCivilians.targets(BearlyCentrumSquare.audit().sceneId).find(n=>n.role===role)',role)

def walk_to_civilian(page, role):
    for _ in range(4):
        target=civilian(page,role)
        assert target,role
        walk_to(page,target)
        now=civilian(page,role)
        if math.dist((square(page)['x'],square(page)['y']),(now['x'],now['y']))<65:
            return now
    raise AssertionError(('could not approach civilian',role,civilian(page,role),square(page)))

def dialogue(page):
    return page.locator('.centrum-dialogue')

def dialogue_text(page):
    return dialogue(page).inner_text() if dialogue(page).is_visible() else ''

def close_dialogue(page):
    if dialogue(page).is_visible():
        page.keyboard.press('Escape')
        page.wait_for_timeout(150)

def finish_dialogue(page, limit=20):
    texts=[]
    for _ in range(limit):
        if not dialogue(page).is_visible():
            return texts
        texts.append(dialogue_text(page))
        buttons=dialogue(page).locator('button:visible:not(:disabled)')
        assert buttons.count(),texts[-1]
        # Parent UI uses ordinary Next/choice buttons, with explicit quest acts.
        next_button=dialogue(page).locator('[data-dialogue-next]:visible:not(:disabled),.quest-next:visible:not(:disabled)')
        actions=dialogue(page).locator('[data-quest-action]:visible:not(:disabled)')
        if next_button.count():
            next_button.first.click()
        elif actions.count():
            correct=actions.filter(has_text='B-04')
            (correct.first if correct.count() else actions.first).click()
        else:
            close=dialogue(page).locator('[data-dialogue-close]:visible:not(:disabled)')
            (close.first if close.count() else buttons.last).click()
        page.wait_for_timeout(650)
    raise AssertionError(('dialogue did not finish',texts))

def advance_to_choice(page):
    texts=[]
    for _ in range(14):
        if not dialogue(page).is_visible():return texts
        next_button=dialogue(page).locator('[data-dialogue-next]:visible:not(:disabled),.quest-next:visible:not(:disabled)')
        if not next_button.count():return texts
        texts.append(dialogue_text(page));next_button.first.click();page.wait_for_timeout(650)
    raise AssertionError('Dialogue never reached its choice')

class GameplayRecording:
    """Actual Chromium frames, time-compressed 3× for the complete quest loop."""
    def __init__(self,page):
        self.frames=[];self.folder=OUT/'.quest-recording-frames';self.folder.mkdir(exist_ok=True)
        self.session=page.context.new_cdp_session(page)
        self.session.on('Page.screencastFrame',self.frame)
        self.session.send('Page.startScreencast',{'format':'jpeg','quality':70,'maxWidth':1280,'maxHeight':900,'everyNthFrame':10})
    def frame(self,event):
        path=self.folder/f'{len(self.frames):05d}.jpg';path.write_bytes(base64.b64decode(event['data']))
        self.frames.append((path,event['metadata']['timestamp']))
        self.session.send('Page.screencastFrameAck',{'sessionId':event['sessionId']})
    def finish(self):
        self.session.send('Page.stopScreencast');self.session.detach()
        assert len(self.frames)>20,len(self.frames)
        lines=[]
        for (path,at),(_,next_at) in zip(self.frames,self.frames[1:]):
            lines.extend([f"file '{path.resolve()}'",f'duration {max(.02,min(2,next_at-at)):.6f}'])
        lines.append(f"file '{self.frames[-1][0].resolve()}'")
        listing=self.folder/'frames.txt';listing.write_text('\n'.join(lines)+'\n')
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-vf','setpts=PTS/3','-r','20','-c:v','libvpx-vp9','-crf','36','-b:v','0','-pix_fmt','yuv420p',str(OUT/'wrong-entrance-loop.webm')],check=True)
        result={'file':'wrong-entrance-loop.webm','kind':'actual browser gameplay recording','speed':3,'frames':len(self.frames),'nativeSeconds':self.frames[-1][1]-self.frames[0][1],'reloadWaitGapsCappedSeconds':2,'generatedArtwork':False}
        shutil.rmtree(self.folder);return result

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    errors=[];failures=[];requests=[]
    evidence={'result':'running','environment':'Desktop system Chromium1440×1000, native time; actual keyboard navigation and visible dialogue choices.','fixtures':['Original debug warp shortens route travel only.','Health63 and existing lunch item establish continuity sentinels.','Civilian disturbance adapter exercises the existing source fear/defeat/recovery system.'],'steps':[],'limits':['Physical devices, other browser engines and gamepads are untested.','reward_claimed is reserved for a future inventory adapter, not exposed by this stage UI.']}
    recording=None
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            context=browser.new_context(viewport={'width':1440,'height':1000});page=context.new_page()
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('response',lambda r:failures.append([r.status,r.url]) if r.status>=400 else None)
            page.on('request',lambda r:requests.append(r.url))
            page.goto(base+'/index.html',wait_until='domcontentloaded');page.locator('#introStart').click(timeout=30000)
            page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'")
            page.evaluate("BEARLY_DEBUG_MENU.warp(7550);BearlyVisits.setHealth(63);BearlyQuests.game.act('lunch')")
            page.wait_for_timeout(300)
            source_quest=page.evaluate('BearlyQuests.game.snapshot()');health=63
            page.keyboard.press('e');wait_exploration(page)
            initial_food=square(page)['save']['inventory']['billys']
            def invariant():
                assert page.evaluate('BEARLY_DEBUG().health')==health
                assert page.evaluate('BearlyQuests.game.snapshot()')==source_quest
                s=square(page);assert s['save']['inventory']['billys']==initial_food
                face=s['hero']['babyFace'];assert face['continuousUpperBody'] and face['originalCollar'] and face['headHeight']>=30
                assert s['height']==200
                cargo=quest(page)['parcel'];assert cargo['kind']=='quest-cargo' and cargo['edible'] is False and cargo['carriedByPlayer'] is False
            def log(step,extra=None):
                invariant();evidence['steps'].append({'step':step,'quest':quest(page),'sceneId':square(page)['sceneId'],**(extra or {})})
            def shot(name):
                page.wait_for_timeout(200);page.screenshot(path=str(OUT/name))
            def reload_stage(expected):
                before=quest(page);position=page.evaluate('BearlyCentrumSquare.position()')
                page.reload(wait_until='domcontentloaded');wait_exploration(page)
                assert quest(page)==before,(expected,before,quest(page))
                assert quest(page)['state']==expected
                after=page.evaluate('BearlyCentrumSquare.position()')
                assert after['sceneId']==position['sceneId'] and math.dist((after['x'],after['y']),(position['x'],position['y']))<3
                log('Reload preserves '+expected)

            # Complete route begins at the same linked bicycle parking owner.
            use_exit(page,'shopping-arcade');recording=GameplayRecording(page);use_exit(page,'food-shop')
            page.wait_for_function("BearlyWrongEntranceQuest.game.snapshot().state==='discovered'",timeout=20000)
            shot('01-baby-spots-billys.png');discovery_lines=finish_dialogue(page)
            log('Baby discovers the short task at the food shop',{'dialogue':discovery_lines})
            reload_stage('discovered')

            # A frightened giver must offer no progress and must recover after reload.
            host=walk_to_civilian(page,'shopkeeper')
            page.evaluate("BearlyCentrumCivilians.disturb('food-shop-host','frightened')")
            assert not civilian(page,'shopkeeper')['available']
            page.keyboard.press('e');page.wait_for_timeout(200)
            shot('02-frightened-shopkeeper.png');unavailable_lines=finish_dialogue(page)
            assert quest(page)['state']=='discovered'
            page.reload(wait_until='domcontentloaded');wait_exploration(page)
            assert quest(page)['state']=='discovered'
            page.wait_for_function("BearlyCentrumCivilians.targets('food-shop').find(n=>n.role==='shopkeeper').available",timeout=45000)
            host=walk_to_civilian(page,'shopkeeper');page.keyboard.press('e');page.wait_for_timeout(200)
            slip_lines=advance_to_choice(page);shot('03-ordinary-delivery-slip.png');slip_lines+=finish_dialogue(page)
            assert quest(page)['state']=='slip_received',quest(page)
            log('Source peaceful shopkeeper recovers; ordinary delivery slip received',{'unavailableDialogue':unavailable_lines,'dialogue':slip_lines})
            reload_stage('slip_received')

            # Leave the task mid-flow via the original bicycle; do not award anything.
            use_exit(page,'shopping-arcade');use_exit(page,'metro-square')
            page.keyboard.press('q');page.wait_for_function("BearlyCentrumLink.audit().phase==='riding'",timeout=60000)
            assert quest(page)['state']=='slip_received'
            page.keyboard.press('e');wait_exploration(page)
            assert quest(page)['state']=='slip_received'
            log('Leave mid-task, remount and return with the same slip')
            use_exit(page,'shopping-arcade');use_exit(page,'service-courtyard')
            assert not square(page)['save']['gateOpened'],'The only objective route must not require the shortcut'
            cage=next(a for a in square(page)['world']['interactions'] if a.get('id')=='delivery-cage' or a.get('kind')=='quest-cage' or a.get('target')=='cage')
            walk_to(page,cage);page.keyboard.press('e');page.wait_for_timeout(200)
            cage_lines=advance_to_choice(page);shot('04-labelled-delivery-cage.png');cage_lines+=finish_dialogue(page)
            assert quest(page)['cageInspected']
            log('Inspect the labelled commercial parcel; cargo stays out of food capacity',{'dialogue':cage_lines})

            caretaker=walk_to_civilian(page,'caretaker')
            page.evaluate("BearlyCentrumCivilians.disturb('courtyard-caretaker','unavailable')")
            assert not civilian(page,'caretaker')['available']
            page.keyboard.press('e');page.wait_for_timeout(200);shot('05-caretaker-temporarily-unavailable.png')
            unavailable_lines=finish_dialogue(page);assert quest(page)['state']=='slip_received'
            page.reload(wait_until='domcontentloaded');wait_exploration(page)
            page.wait_for_function("BearlyCentrumCivilians.targets('service-courtyard').find(n=>n.role==='caretaker').available",timeout=45000)
            caretaker=walk_to_civilian(page,'caretaker');page.keyboard.press('e');page.wait_for_timeout(200)
            caretaker_lines=advance_to_choice(page);shot('06-present-slip-to-caretaker.png');caretaker_lines+=finish_dialogue(page)
            assert quest(page)['state']=='slip_received' and quest(page)['slipPresented'],quest(page)
            walk_to(page,cage);page.keyboard.press('e');page.wait_for_timeout(200)
            confirm_lines=advance_to_choice(page);shot('06b-correct-parcel-choice.png')
            wrong=dialogue(page).locator('[data-parcel-id="B-40"]')
            if wrong.count():
                wrong.click();wrong_lines=finish_dialogue(page)
                assert quest(page)['state']=='slip_received' and not quest(page)['cargoMoved']
                log('Wrong parcel B-40 is refused without losing the slip or granting a reward',{'dialogue':wrong_lines})
                page.keyboard.press('e');confirm_lines+=advance_to_choice(page)
            confirm_lines+=finish_dialogue(page)
            page.wait_for_function("BearlyWrongEntranceQuest.game.snapshot().state==='delivery_confirmed'&&BearlyWrongEntranceQuest.game.snapshot().cargoMoved",timeout=20000)
            page.wait_for_timeout(3300)
            shot('07-caretaker-moves-approved-parcel.png')
            log('Caretaker recovers, checks slip and moves the approved parcel',{'unavailableDialogue':unavailable_lines,'dialogue':caretaker_lines,'confirmationDialogue':confirm_lines})
            reload_stage('delivery_confirmed')
            assert not square(page)['save']['gateOpened']
            # The gate opens independently after approval; it was not needed above.
            use_exit(page,'metro-square');assert square(page)['save']['gateOpened']
            log('Optional gate shortcut opens independently of quest objectives')
            use_exit(page,'shopping-arcade');use_exit(page,'food-shop')
            host=walk_to_civilian(page,'shopkeeper');page.keyboard.press('e');page.wait_for_timeout(200)
            report_lines=advance_to_choice(page);shot('08-report-to-shopkeeper.png');report_lines+=finish_dialogue(page)
            assert quest(page)['state']=='reported'
            assert not page.evaluate('BearlyWrongEntranceQuest.game.claimReward()'),'No inventory adapter is installed in this stage'
            ent=quest(page)['entitlement'];assert ent and ent['id']=='wrong-entrance:completion:v1' and ent['status']=='pending'
            shot('09-one-pending-entitlement.png')
            log('Report creates one entitlement, without fake food, healing or reward redemption',{'dialogue':report_lines})
            reload_stage('reported')
            for _ in range(3):
                host=walk_to_civilian(page,'shopkeeper');page.keyboard.press('e');finish_dialogue(page)
                assert quest(page)['state']=='reported' and quest(page)['entitlement']==ent
            shot('10-shopkeeper-revisit.png');log('Repeated conversation and reload cannot duplicate completion entitlement')
            use_exit(page,'shopping-arcade');use_exit(page,'service-courtyard')
            caretaker=walk_to_civilian(page,'caretaker');page.keyboard.press('e');revisit_lines=finish_dialogue(page)
            assert quest(page)['state']=='reported' and quest(page)['entitlement']==ent
            shot('11-caretaker-revisit.png');log('Caretaker remembers approved delivery after visits',{'dialogue':revisit_lines})
            if recording:
                evidence['recording']=recording.finish();recording=None
            assert not errors,errors;assert not failures,failures
            assert all(u.startswith(base+'/') or u.startswith(('blob:','data:')) for u in requests)
            evidence.update({'result':'passed','pageErrors':errors,'httpFailures':failures,'requestCount':len(requests),'finalQuest':quest(page),'foodCount':initial_food,'health':health,'finalSaveSnapshot':page.evaluate("Object.fromEntries(Object.keys(localStorage).filter(k=>k.startsWith('bq-centrum:')).map(k=>[k,localStorage.getItem(k)]))")})
            context.close();browser.close()
    except Exception as e:
        evidence.update({'result':'failed','failure':repr(e),'pageErrors':errors,'httpFailures':failures})
        raise
    finally:
        (OUT/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
        shots=sorted(OUT.glob('*.png'));(OUT/'frames.sha256').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in shots))
        server.shutdown();server.server_close()
    print('PASS: complete short quest, all reload stages, mid-task departure, giver recovery, single pending entitlement, unchanged shared health/food and actual gameplay captures.')

if __name__=='__main__':
    main()
