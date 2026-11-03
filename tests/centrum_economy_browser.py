"""Consumable acceptance checks with actual Chromium keyboard/pointer controls.

Each scenario uses a disposable, project-owned save made by the production save
factory. Completed quest/starting supplies/health are explicitly prepared test
fixtures, not proof that this script replayed the earlier delivery campaign.
Navigation, counter transactions, eating, pickup collisions and retry use the
playable UI. No donor save is read, edited, or cleared.
"""
import argparse
import base64
import shutil
import subprocess
import functools
import hashlib
import json
import math
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from centrum_network import route, scene, exit_to

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'verification/stage6'
OUT.mkdir(parents=True, exist_ok=True)
KEY = 'bq-centrum:scene-network:v1'
QUEST_KEY = 'bq-centrum:quest:wrong-entrance:v1'
PARKING_KEY = 'bq-centrum:parking:v1'
SENTINEL = 'bq-centrum:qa-untouched'


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def sq(page):
    return page.evaluate('BearlyCentrumSquare.audit()')


def ui(page):
    return page.evaluate('BearlyCentrumInventory.audit()')


def ledger(page):
    return page.evaluate('BearlyCentrumSave.adventure.snapshot()')


def health(page):
    return page.evaluate('BEARLY_DEBUG().health')


def brief(page):
    s = ledger(page)
    return {'health': health(page), 'wallet': s['wallet'], 'inventory': s['inventory'],
            'collectedIDs': s['collectedIDs'], 'rewardClaims': s['rewardClaims'],
            'quest': page.evaluate('BearlyWrongEntranceQuest.game.snapshot()'),
            'mode': page.evaluate('BearlyCentrumLink.audit().phase'),
            'scene': sq(page)['sceneId'] if sq(page)['active'] else None,
            'revision': s['revision'], 'checkpointReason': s.get('checkpoint', {}).get('reason'),
            'loadStatus': s.get('loadStatus'), 'ui': ui(page)}


def capture(page, name):
    page.screenshot(path=str(OUT / (name + '.png')))


def wait_ready(page):
    page.wait_for_function('window.BearlyCentrumInventory?.audit().bound&&window.BearlyCentrumLink&&window.BEARLY_STARTUP?.().firstFrameAt!==null', timeout=60000)
    page.wait_for_function("window.BearlyCentrumLink.audit().phase!=='restoring'", timeout=60000)
    page.wait_for_timeout(500)


def wait_exploration(page):
    page.wait_for_function("window.BearlyCentrumLink?.audit().phase==='exploring'&&BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading", timeout=60000)
    page.wait_for_timeout(300)


def hold(page, key, ms, touch=False):
    if touch:
        direction = {'ArrowLeft':'left','ArrowRight':'right','ArrowUp':'up','ArrowDown':'down'}[key]
        box = page.locator(f'.square-controls [data-square-dir="{direction}"]').bounding_box()
        assert box, key
        session = page.context.new_cdp_session(page)
        session.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[{'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}]})
        page.wait_for_timeout(ms)
        session.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]})
        session.detach()
    else:
        page.keyboard.down(key)
        page.wait_for_timeout(ms)
        page.keyboard.up(key)
    page.wait_for_timeout(180)


def move_axis(page, axis, target, touch=False):
    speed=page.evaluate("axis=>axis==='y'?(window.BearlyCentrumDepthGait?.depthSpeed||155):155",axis)
    for _ in range(24):
        delta = target-sq(page)[axis]
        if abs(delta) <= 8:
            return
        key = ('ArrowRight' if delta>0 else 'ArrowLeft') if axis=='x' else ('ArrowDown' if delta>0 else 'ArrowUp')
        hold(page, key, min(2400,max(60,abs(delta)/speed*1000-80)), touch)
    raise AssertionError(('blocked walking waypoint', axis, target, sq(page)))


def walk_to(page, target, touch=False):
    data, state = scene(page), sq(page)
    for x,y in route(data,(state['x'],state['y']),(target['x'],target['y'])):
        move_axis(page,'x',x,touch)
        move_axis(page,'y',y,touch)
    assert math.dist((sq(page)['x'],sq(page)['y']),(target['x'],target['y'])) < 40


def use_exit(page, destination, touch=False):
    walk_to(page,exit_to(page,destination),touch)
    page.locator('.square-interact').tap() if touch else page.keyboard.press('e')
    page.wait_for_function('id=>BearlyCentrumSquare.audit().sceneId===id&&!BearlyCentrumSquare.audit().loading&&!BearlyCentrumSquare.audit().transition',arg=destination,timeout=60000)
    page.wait_for_timeout(300)


def close_dialogue(page):
    panel=page.locator('.centrum-dialogue')
    if panel.is_visible():
        page.keyboard.press('Escape')
        page.wait_for_timeout(150)


def counter(page):
    close_dialogue(page)
    if ui(page)['browsing']:
        page.keyboard.press('Escape')
    for _ in range(4):
        target=page.evaluate("BearlyCentrumCivilians.targets('food-shop').find(n=>n.role==='shopkeeper')")
        assert target
        walk_to(page,target)
        latest=page.evaluate("BearlyCentrumCivilians.targets('food-shop').find(n=>n.role==='shopkeeper')")
        if math.dist((sq(page)['x'],sq(page)['y']),(latest['x'],latest['y']))<65:
            break
    page.keyboard.press('e')
    page.locator('.centrum-dialogue').wait_for(state='visible')
    for _ in range(15):
        nxt=page.locator('.centrum-dialogue [data-dialogue-next]:visible:not(:disabled)')
        if not nxt.count():
            return
        nxt.first.click()
        page.wait_for_timeout(80)
    raise AssertionError('counter dialogue did not reach choices')


def counter_action(page, action):
    counter(page)
    selector=page.locator(f'.centrum-dialogue [data-quest-action="{action}"]:visible')
    assert selector.count(),page.locator('.centrum-dialogue').inner_text()
    selector.first.click()
    page.wait_for_timeout(300)
    text=page.locator('.centrum-dialogue').inner_text()
    close_dialogue(page)
    return text


def open_bag(page,touch=False):
    close_dialogue(page)
    if not ui(page)['browsing']:
        if touch:
            mode=page.evaluate('BearlyCentrumEconomy.context().mode')
            gear='.square-settings' if mode=='centrum' else '.area-settings' if mode=='source-foot' else '.ride-settings'
            page.locator(gear).tap();page.locator('#debugPanel').wait_for(state='visible');page.locator('#inventoryMenuBtn').tap()
        else:page.keyboard.press('i')
    page.wait_for_function('BearlyCentrumInventory.isBrowsing()&&!BEARLY_DEBUG_MENU.isOpen()')
    page.locator('.centrum-inventory-panel').wait_for(state='visible')
    assert ui(page)['browsing']


def start_eat(page,touch=False,spam=False):
    open_bag(page,touch)
    btn=page.locator('#inventoryEatBtn')
    assert btn.is_enabled(),ui(page)
    btn.tap() if touch else btn.click(click_count=3 if spam else 1,delay=20 if spam else 0)
    page.wait_for_function('BearlyCentrumInventory.audit().eating!==null')
    assert not ui(page)['browsing']


def finish_eat(page):
    page.wait_for_function('BearlyCentrumInventory.audit().eating===null',timeout=6000)
    page.wait_for_timeout(150)


def fixture(page, template, *, food=0, hp=60, scene_id='food-shop', reported=True, claimed=False, kr=0, checkpoint=True):
    """Prepare fixtures through production factory; factory writes its checksum."""
    return page.evaluate(r'''([template,food,hp,sceneId,reported,claimed,kr,checkpoint])=>{
      const K='bq-centrum:scene-network:v1',P='bq-centrum:parking:v1',Q='bq-centrum:quest:wrong-entrance:v1';
      const anchors={'food-shop':{entranceId:'from-arcade',x:190,y:600},'metro-square':{entranceId:'from-cycle-route',x:248,y:730},'shopping-arcade':{entranceId:'from-square',x:180,y:650}};
      const pos={sceneId,...(anchors[sceneId]||anchors['food-shop']),face:1};
      const parking=JSON.parse(JSON.stringify(template));parking.phase=sceneId==='riding'?'riding':'exploring';parking.health=hp;parking.exploration=sceneId==='riding'?null:pos;
      parking.routeProgress.collectedPickups=[];
      const memory=new Map();const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
      memory.set(K,JSON.stringify({schemaVersion:1,layoutVersion:3,gateOpened:true,discovered:['metro-square','shopping-arcade','service-courtyard','food-shop','bicycle-workshop'],position:pos,inventory:{billys:food}}));
      memory.set(P,JSON.stringify(parking));
      if(reported)memory.set(Q,JSON.stringify({schemaVersion:1,questId:'wrong-entrance',state:'reported',cageInspected:true,slipPresented:true,cargoMoved:true,entitlement:{id:'wrong-entrance:completion:v1',questId:'wrong-entrance',status:'pending'},rewardReceipt:null}));
      const broker=BearlyCentrumSave.createAdventure(storage);
      broker.syncSession({health:hp,mode:sceneId==='riding'?'riding':'exploring',route:{...BearlyCentrumLink.audit().route,health:hp,x:template.parked.x,y:template.parked.y,speed:0,routeProgress:parking.routeProgress},exploration:sceneId==='riding'?null:pos});
      if(claimed||kr){broker.claimWrongEntrance('fixture-reward');if(!claimed)throw new Error('fixture kr requires a completed reward');}
      if(checkpoint)broker.checkpoint('qa-prepared-state');
      return {raw:memory.get(K),snapshot:broker.snapshot(),description:{food,hp,sceneId,reported,claimed,kr,checkpoint}};
    }''',[template,food,hp,scene_id,reported,claimed,kr,checkpoint])


def make_context(browser, base, prepared=None, touch=False, record=False, watch=None, portrait=False):
    context=browser.new_context(viewport={'width':390 if portrait else 844 if touch else 1280,'height':844 if portrait else 390 if touch else 720},device_scale_factor=1,is_mobile=touch,has_touch=touch,
                                )
    init="if(!localStorage.getItem('bq-centrum:qa-fixture-installed')){localStorage.setItem('bq-centrum:qa-untouched','unchanged');"
    if prepared:
        init+=f"localStorage.setItem({json.dumps(KEY)},{json.dumps(prepared['raw'])});"
    init+="localStorage.setItem('bq-centrum:qa-fixture-installed','1');}"
    context.add_init_script(init)
    page=context.new_page()
    if watch:watch(page)
    page.goto(base+'/index.html',wait_until='domcontentloaded')
    wait_ready(page)
    if prepared and prepared['description']['sceneId']!='riding':
        wait_exploration(page)
    elif page.locator('#introStart').is_visible():
        page.locator('#introStart').click()
        page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'")
    return context,page


def reload_latest(page):
    page.reload(wait_until='domcontentloaded')
    wait_ready(page)
    if page.evaluate("BearlyCentrumLink.audit().phase==='exploring'"):
        wait_exploration(page)
    assert page.evaluate(f"localStorage.getItem({json.dumps(SENTINEL)})")=='unchanged'




class GameplayRecording:
    def __init__(self,page):
        self.frames=[];self.folder=OUT/'.economy-recording-frames'
        if self.folder.exists():shutil.rmtree(self.folder)
        self.folder.mkdir()
        self.session=page.context.new_cdp_session(page)
        self.session.on('Page.screencastFrame',self.frame)
        self.session.send('Page.startScreencast',{'format':'jpeg','quality':70,'maxWidth':1280,'maxHeight':720,'everyNthFrame':8})
    def frame(self,event):
        path=self.folder/f'{len(self.frames):05d}.jpg'
        path.write_bytes(base64.b64decode(event['data']))
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
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-vf','setpts=PTS/2','-r','20','-c:v','libvpx-vp9','-cpu-used','4','-row-mt','1','-threads','2','-crf','36','-b:v','0','-pix_fmt','yuv420p',str(OUT/'consumable-loop.webm')],check=True)
        evidence={'file':'consumable-loop.webm','kind':'actual browser gameplay recording','speed':2,'frames':len(self.frames),'nativeSeconds':self.frames[-1][1]-self.frames[0][1],'reloadWaitGapsCappedSeconds':2,'generatedArtwork':False}
        shutil.rmtree(self.folder);return evidence

def economy_scenario(browser,base,setup,template,result,watch):
    prepared=fixture(setup,template,food=3,hp=60)
    context,page=make_context(browser,base,prepared,watch=watch)
    recording=GameplayRecording(page)
    assert sq(page)['sceneId']=='food-shop' and health(page)==60
    assert ledger(page)['inventory']['billys']==3 and ledger(page)['wallet']['kr']==0
    result['fixtures']=result.get('fixtures',[])+[prepared['description']]
    counter_action(page,'claim_reward')
    s=ledger(page)
    assert s['wallet']['kr']==40 and s['inventory']['billys']==3,s
    assert s['rewardClaims']['wrong-entrance:completion:v1']=={'money':True,'food':False}
    assert health(page)==60
    result['checks'].append({'name':'full bag claims 40 kr once and keeps pizza entitlement','state':brief(page)})
    capture(page,'01-money-claimed-food-pending')
    feedback=counter_action(page,'buy_billys')
    assert ledger(page)['wallet']['kr']==40 and ledger(page)['inventory']['billys']==3
    assert 'full' in feedback.lower(),feedback
    result['checks'].append({'name':'full bag purchase leaves wallet and bag untouched','state':brief(page)})
    open_bag(page)
    capture(page,'02-compact-bag')
    assert page.locator('.centrum-inventory-panel img').evaluate('(img)=>img.complete&&img.naturalWidth>0&&img.src.includes("v142_pizza_wrapper.webp")')
    start_eat(page,spam=True)
    capture(page,'03-eating-live-gameplay')
    assert health(page)==60 and ledger(page)['inventory']['billys']==3,'healed before eating completed'
    # Triple pointer activation cannot start a competing completion.
    finish_eat(page)
    assert health(page)==80 and ledger(page)['inventory']['billys']==2,brief(page)
    result['checks'].append({'name':'one live eating action consumes one pizza and heals one heart','state':brief(page)})
    counter_action(page,'claim_reward')
    assert ledger(page)['wallet']['kr']==40 and ledger(page)['inventory']['billys']==3
    assert page.evaluate('BearlyWrongEntranceQuest.game.snapshot().state')=='reward_claimed'
    result['checks'].append({'name':'pending pizza redeemed independently and task completes','state':brief(page)})
    reload_latest(page)
    assert ledger(page)['wallet']['kr']==40 and ledger(page)['inventory']['billys']==3 and health(page)==80
    counter(page)
    repeated=page.locator('.centrum-dialogue [data-quest-action="claim_reward"]:visible')
    if repeated.count():repeated.first.click();page.wait_for_timeout(100)
    close_dialogue(page)
    assert ledger(page)['wallet']['kr']==40 and ledger(page)['inventory']['billys']==3
    start_eat(page);finish_eat(page)
    assert health(page)==100 and ledger(page)['inventory']['billys']==2
    open_bag(page)
    assert page.locator('#inventoryEatBtn').is_disabled()
    capture(page,'04-full-health-food-preserved')
    page.keyboard.press('Escape')
    counter_action(page,'buy_billys')
    assert ledger(page)['wallet']['kr']==20 and ledger(page)['inventory']['billys']==3
    result['checks'].append({'name':'purchase atomically spends 20 kr for one Billys; full health blocks waste','state':brief(page)})
    use_exit(page,'shopping-arcade')
    before=brief(page)
    reload_latest(page)
    after=brief(page)
    assert (after['health'],after['wallet'],after['inventory'],after['quest']['state'],after['scene'])==(100,{'kr':20},{'billys':3},'reward_claimed','shopping-arcade'),(before,after)
    capture(page,'05-latest-state-after-reload')
    result['checks'].append({'name':'latest reload preserves purchased food, money, health and scene','state':after})
    result['recording']=recording.finish()
    context.close()


def interruptions_scenario(browser,base,setup,template,result,watch):
    prepared=fixture(setup,template,food=3,hp=60,scene_id='metro-square',reported=False)
    context,page=make_context(browser,base,prepared,watch=watch)
    result['fixtures']=result.get('fixtures',[])+[prepared['description']]
    for action in ['movement','pause','cancel']:
        start_eat(page)
        if action=='movement':hold(page,'ArrowRight',140)
        elif action=='pause':page.keyboard.press('p');page.wait_for_timeout(250);page.keyboard.press('p')
        else:page.locator('#inventoryCancelEatBtn').click()
        finish_eat(page)
        assert health(page)==60 and ledger(page)['inventory']['billys']==3,(action,brief(page))
        result['checks'].append({'name':'eating interrupted by '+action+' grants neither healing nor loss','state':brief(page)})
    start_eat(page)
    page.evaluate("window.dispatchEvent(new Event('blur'))")
    finish_eat(page)
    assert health(page)==60 and ledger(page)['inventory']['billys']==3
    result['checks'].append({'name':'window focus loss cancels eating without item loss or healing','state':brief(page)})
    # Existing focus-loss handling also pauses. Resume explicitly, as the UI asks.
    if 'resume' in ui(page)['disabledReason'].lower():
        page.keyboard.press('p');page.wait_for_timeout(150)
    start_eat(page)
    page.evaluate('BearlyVisits.setHealth(56)')
    finish_eat(page)
    assert health(page)==56 and ledger(page)['inventory']['billys']==3,brief(page)
    result['checks'].append({'name':'health change interrupts eating with food untouched','state':brief(page)})
    start_eat(page)
    reload_latest(page)
    assert health(page)==56 and ledger(page)['inventory']['billys']==3
    assert not ui(page)['eating']
    result['checks'].append({'name':'reload during eating does not commit unfinished action','state':brief(page)})
    capture(page,'06-cancelled-eating-no-loss')
    context.close()
    prepared=fixture(setup,template,food=2,hp=60,reported=False)
    context,page=make_context(browser,base,prepared,watch=watch)
    start_eat(page)
    page.keyboard.press('e')
    page.wait_for_function("BearlyCentrumSquare.audit().sceneId==='shopping-arcade'&&!BearlyCentrumSquare.audit().transition",timeout=60000)
    finish_eat(page)
    assert health(page)==60 and ledger(page)['inventory']['billys']==2
    result['checks'].append({'name':'real door scene change interrupts eating without item loss or healing','state':brief(page)})
    context.close()
    # A partial heart heals only up to the original five-heart maximum.
    prepared=fixture(setup,template,food=1,hp=90,reported=False)
    context,page=make_context(browser,base,prepared,watch=watch)
    start_eat(page);finish_eat(page)
    assert health(page)==100 and ledger(page)['inventory']['billys']==0
    result['checks'].append({'name':'healing caps at five hearts','state':brief(page)})
    feedback=counter_action(page,'buy_billys')
    assert ledger(page)['wallet']['kr']==0 and ledger(page)['inventory']['billys']==0
    assert any(word in feedback.lower() for word in ['money','fund','kronor']),feedback
    result['checks'].append({'name':'insufficient funds purchase is atomic','state':brief(page)})
    context.close()



def pickups_scenario(browser,base,setup,template,result,watch):
    prepared=fixture(setup,template,food=3,hp=60,scene_id='riding',reported=False)
    context,page=make_context(browser,base,prepared,watch=watch)
    result['fixtures']=result.get('fixtures',[])+[prepared['description']]
    assert health(page)==60 and ledger(page)['inventory']['billys']==3,brief(page)
    before=page.evaluate('BEARLY_V146_PIZZA_TEST()')
    assert page.evaluate('BEARLY_V89_TEST.pizza()')
    page.wait_for_timeout(220)
    assert page.evaluate('BEARLY_V146_PIZZA_TEST().remaining')==before['remaining']
    assert ledger(page)['inventory']['billys']==3 and ledger(page)['collectedIDs']==[]
    assert health(page)==60,brief(page)
    assert 'full' in page.locator('.inventory-feedback').inner_text().lower()
    result['checks'].append({'name':'full bag leaves authored pickup untouched and grants no healing','state':brief(page)})
    page.evaluate('BEARLY_DEBUG_MENU.warp(7550)');page.wait_for_timeout(250)
    open_bag(page)
    clock=page.evaluate('BearlyCentrumLink.audit().route.simTime')
    page.wait_for_timeout(220)
    browse_clock=page.evaluate('BearlyCentrumLink.audit().route.simTime')
    start_eat(page)
    page.wait_for_timeout(200)
    assert page.evaluate('BearlyCentrumLink.audit().route.simTime')>browse_clock,'eating remained safely frozen'
    assert health(page)==60 and ledger(page)['inventory']['billys']==3
    finish_eat(page)
    assert health(page)==80 and ledger(page)['inventory']['billys']==2
    result['checks'].append({'name':'Eat resumes the live cycling simulation before completion','browsingPaused':clock==browse_clock})
    # Source debug placement shortens travel only. Collection itself is the
    # ordinary production star/bicycle collision on the next live frame.
    assert page.evaluate('BEARLY_V89_TEST.pizza()')
    page.wait_for_timeout(220)
    assert ledger(page)['inventory']['billys']==3 and ledger(page)['collectedIDs']==['route-pizza-0'],brief(page)
    assert health(page)==80
    capture(page,'07-persistent-pickup-in-bag')
    result['checks'].append({'name':'wild pickup enters bag once by collision, without healing','state':brief(page)})
    # Reproduce an eager real click before asynchronous restored startup is done.
    page.add_init_script("document.addEventListener('DOMContentLoaded',()=>document.getElementById('introStart')?.click(),{once:true});")
    reload_latest(page)
    assert ledger(page)['collectedIDs']==['route-pizza-0'] and ledger(page)['inventory']['billys']==3 and health(page)==80
    assert page.evaluate('BEARLY_V146_PIZZA_TEST().remaining')==before['remaining']-1
    result['checks'].append({'name':'early Start click preserves latest restored health and pickup rather than retrying checkpoint','state':brief(page)})
    page.evaluate('BEARLY_DEBUG_MENU.warp(7550)');page.wait_for_timeout(250)
    page.keyboard.press('e');wait_exploration(page)
    assert ledger(page)['collectedIDs']==['route-pizza-0'] and ledger(page)['inventory']['billys']==3 and health(page)==80
    page.keyboard.press('q')
    page.wait_for_function("BearlyCentrumLink.audit().phase==='remount'",timeout=60000)
    page.wait_for_function("BearlyCentrumLink.audit().phase==='riding'",timeout=60000)
    page.wait_for_timeout(200)
    page.evaluate('BEARLY_DEBUG_MENU.warp(1700)');page.wait_for_timeout(250)
    assert page.evaluate('BEARLY_V146_PIZZA_TEST().remaining')==before['remaining']-1
    assert ledger(page)['inventory']['billys']==3 and health(page)==80
    result['checks'].append({'name':'pickup does not respawn after reload, building ownership transfer or return','state':brief(page)})
    page.evaluate('BEARLY_DEBUG_MENU.warp(7550)');page.wait_for_timeout(250)
    page.evaluate("BEARLY_PROJECTILE_QA.spawn('bottle','ground')")
    open_bag(page)
    assert page.locator('#inventoryEatBtn').is_disabled(),ui(page)
    assert 'danger' in ui(page)['disabledReason'].lower(),ui(page)
    page.keyboard.press('Escape')
    page.evaluate('BEARLY_PROJECTILE_QA.clear()')
    result['checks'].append({'name':'live projectile danger blocks eating before it starts','state':brief(page)})
    open_bag(page);page.locator('#inventoryRetryBtn').click()
    page.wait_for_timeout(700);wait_ready(page)
    assert ledger(page)['collectedIDs']==[] and ledger(page)['inventory']['billys']==3 and health(page)==60,brief(page)
    assert page.evaluate('BEARLY_V146_PIZZA_TEST().remaining')==before['remaining']
    result['checks'].append({'name':'retry rolls pickup ID and supplies back together without retaining the awarded food','state':brief(page)})
    context.close()


def corrupted_scenario(browser,base,setup,template,result,watch):
    prepared=fixture(setup,template,food=1,hp=60,claimed=True)
    context,page=make_context(browser,base,prepared,watch=watch)
    # Completing an action changes latest while the prepared/reward checkpoint
    # remains coherent. Corrupt only latest, preserving its embedded checkpoint.
    start_eat(page);finish_eat(page)
    latest=brief(page)
    expected=ledger(page)['checkpoint']['payload']
    page.add_init_script("if(!sessionStorage.getItem('bq-centrum:qa-corrupt-latest')){sessionStorage.setItem('bq-centrum:qa-corrupt-latest','1');const k='bq-centrum:scene-network:v1',d=JSON.parse(localStorage.getItem(k));d.wallet.kr=999999;localStorage.setItem(k,JSON.stringify(d));}")
    reload_latest(page)
    recovered=brief(page)
    assert recovered['wallet']==expected['wallet'] and recovered['inventory']==expected['inventory'] and recovered['health']==expected['session']['health'],(latest,recovered,expected)
    assert recovered['loadStatus']=='checkpoint_recovery',recovered
    result['checks'].append({'name':'invalid latest document restores one complete checksummed checkpoint','state':recovered})
    # A completely unreadable canonical document must not reimport stale own
    # legacy keys, let alone read donor keys.
    page.add_init_script("if(!sessionStorage.getItem('bq-centrum:qa-corrupt-whole')){sessionStorage.setItem('bq-centrum:qa-corrupt-whole','1');localStorage.setItem('bq-centrum:quest:wrong-entrance:v1',JSON.stringify({schemaVersion:1,questId:'wrong-entrance',state:'reported',cageInspected:true,slipPresented:true,cargoMoved:true,entitlement:{id:'wrong-entrance:completion:v1',questId:'wrong-entrance',status:'pending'}}));localStorage.setItem('bq-centrum:parking:v1',JSON.stringify({schemaVersion:1,phase:'exploring',health:1}));localStorage.setItem('bq-centrum:scene-network:v1','{broken');}")
    reload_latest(page)
    recovered=brief(page)
    assert recovered['wallet']['kr']==0 and recovered['inventory']['billys']==0 and recovered['collectedIDs']==[] and not recovered['rewardClaims'],recovered
    assert recovered['quest']['state'] is None and recovered['loadStatus']=='invalid_save_recovery',recovered
    assert recovered['mode']=='riding'
    capture(page,'11-corrupt-save-safe-entry')
    result['checks'].append({'name':'unreadable canonical save falls back safely without importing stale legacy rewards','state':recovered})
    context.close()


def retry_recovery_scenario(browser,base,setup,template,result,watch):
    prepared=fixture(setup,template,food=1,hp=60,claimed=True)
    context,page=make_context(browser,base,prepared,watch=watch)
    expected=ledger(page)['checkpoint']['payload']
    start_eat(page);finish_eat(page)
    counter_action(page,'buy_billys')
    use_exit(page,'shopping-arcade')
    assert ledger(page)['wallet']['kr']==20 and health(page)==80
    open_bag(page);page.locator('#inventoryRetryBtn').click()
    page.wait_for_timeout(700);wait_ready(page);wait_exploration(page)
    after=ledger(page)
    for field in ['wallet','inventory','collectedIDs','rewardClaims','gateOpened','discovered']:
        assert after[field]==expected[field],(field,after[field],expected[field])
    assert health(page)==expected['session']['health'] and sq(page)['sceneId']==expected['session']['exploration']['sceneId'],brief(page)
    assert page.evaluate('BearlyWrongEntranceQuest.game.snapshot().state')==expected['components'][QUEST_KEY]['state']
    result['checks'].append({'name':'retry restores one coherent checkpoint including money, food, pickups, reward flags, health and location','state':brief(page)})
    context.close()
    prepared=fixture(setup,template,food=1,hp=60,scene_id='riding',reported=False)
    context,page=make_context(browser,base,prepared,watch=watch)
    expected=ledger(page)['checkpoint']['payload']
    page.evaluate("BEARLY_TEST.hit('torso',200)")
    page.wait_for_timeout(400)
    assert health(page)==0,brief(page)
    page.keyboard.press('c')
    page.wait_for_timeout(700);wait_ready(page)
    assert health(page)==expected['session']['health']
    assert ledger(page)['inventory']==expected['inventory'] and ledger(page)['wallet']==expected['wallet']
    capture(page,'08-coherent-retry-after-death')
    result['checks'].append({'name':'actual source riding death and original retry key preserve coherent checkpoint supplies','state':brief(page)})
    context.close()
    prepared=fixture(setup,template,food=0,hp=12,scene_id='riding',reported=False)
    context,page=make_context(browser,base,prepared,watch=watch)
    page.evaluate('BearlyVisits.practice()')
    page.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition&&BearlyVisits.audit().combat.npcs.some(n=>n.id==='practice-a')",timeout=60000)
    page.keyboard.press('j');page.wait_for_timeout(300)
    damaged=page.evaluate("BearlyVisits.audit().combat.npcs.find(n=>n.id==='practice-a')")
    assert damaged and damaged['hp']<damaged['maxHp'],damaged
    page.evaluate('BearlyVisits.setHealth(0)')
    page.wait_for_timeout(2250)
    assert health(page)==0 and ledger(page)['inventory']['billys']==0,'defeat auto-healed while preserving damage dealt'
    result['checks'].append({'name':'source on-foot defeat does not auto-heal after its old recovery delay','state':brief(page)})
    open_bag(page)
    assert page.locator('#inventoryRecoveryBtn').is_visible() and page.locator('#inventoryRecoveryBtn').is_enabled(),ui(page)
    capture(page,'12-rest-abandons-encounter')
    page.locator('#inventoryRecoveryBtn').click()
    page.wait_for_timeout(700);wait_ready(page)
    assert health(page)==40 and ledger(page)['inventory']['billys']==0 and ledger(page)['wallet']['kr']==0,brief(page)
    assert page.evaluate("!BearlyVisits.active()&&BearlyVisits.audit().combat.npcs.every(n=>!n.id.startsWith('practice-'))")
    assert not ui(page)['eating']
    result['checks'].append({'name':'safe recovery gives no takeaway and discards the unfinished encounter with its dealt damage','damagedNPC':damaged,'state':brief(page)})
    reload_latest(page)
    assert health(page)==40 and ledger(page)['inventory']['billys']==0 and ledger(page)['wallet']['kr']==0
    result['checks'].append({'name':'recovery is durable and cannot be farmed for food or money','state':brief(page)})
    context.close()

def touch_scenario(browser,base,setup,template,result,watch):
    prepared=fixture(setup,template,food=2,hp=60,scene_id='metro-square',reported=False)
    context,page=make_context(browser,base,prepared,touch=True,watch=watch)
    open_bag(page,True)
    capture(page,'09-touch-bag')
    start_eat(page,True);finish_eat(page)
    assert health(page)==80 and ledger(page)['inventory']['billys']==1
    start_eat(page,True)
    hold(page,'ArrowRight',220,True)
    finish_eat(page)
    assert health(page)==80 and ledger(page)['inventory']['billys']==1
    capture(page,'10-touch-gameplay')
    result['checks'].append({'name':'emulated touch bag, eating and movement cancellation','state':brief(page)})
    context.close()
    context,page=make_context(browser,base,prepared,touch=True,portrait=True,watch=watch)
    open_bag(page,True)
    capture(page,'13-portrait-bag-character-review')
    start_eat(page,True);finish_eat(page)
    assert health(page)==80 and ledger(page)['inventory']['billys']==1
    result['checks'].append({'name':'emulated portrait inventory and eating','state':brief(page)})
    context.close()

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--scenario',default='all',choices=['all','economy','interruptions','pickups','corrupted','retry-recovery','touch'])
    args=parser.parse_args()
    result={'stage':6,'scenario':args.scenario,'preparedFixtures':True,'checks':[],'errors':[],'httpFailures':[],
            'limits':['Desktop Chromium and emulated touch Chromium only; physical devices and other browsers untested.','Delivery completion is an explicit prepared reported-save fixture; stage 5 separately records the full campaign.']}
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        def watch(page):
            page.on('pageerror',lambda e:result['errors'].append(str(e)))
            page.on('response',lambda r:result['httpFailures'].append({'status':r.status,'url':r.url}) if r.status>=400 else None)
        setup_context,setup=make_context(browser,base,watch=watch)
        setup.evaluate('BEARLY_DEBUG_MENU.warp(7550);BearlyVisits.setHealth(60)')
        setup.wait_for_timeout(300)
        setup.keyboard.press('e')
        wait_exploration(setup)
        template=setup.evaluate('BearlyCentrumLink.audit().parking')
        assert template and template['phase']=='exploring'
        result['parkingTemplate']={'parked':template['parked'],'remount':template['remount'],'health':template['health']}
        # Scenario bodies are deliberately independent; each starts from a
        # named, validated entrance and a coherent production-generated save.
        scenarios=[('economy',economy_scenario),('interruptions',interruptions_scenario),('pickups',pickups_scenario),('corrupted',corrupted_scenario),('retry-recovery',retry_recovery_scenario),('touch',touch_scenario)]
        for name,fn in scenarios:
            if args.scenario not in ('all',name):continue
            print('Running '+name,flush=True)
            first_check=len(result['checks']);first_error=len(result['errors']);first_http=len(result['httpFailures'])
            fn(browser,base,setup,template,result,watch)
            part={'stage':6,'scenario':name,'preparedFixtures':True,'checks':result['checks'][first_check:],'errors':result['errors'][first_error:],'httpFailures':result['httpFailures'][first_http:],'passed':True,'limits':result['limits']}
            if name=='economy':part['recording']=result.get('recording')
            (OUT/('results-'+name+'.json')).write_text(json.dumps(part,indent=2))
            print('Passed '+name,flush=True)
        setup_context.close()
        browser.close()
      assert not result['errors'],result['errors']
      assert not result['httpFailures'],result['httpFailures']
      result['passed']=True
    except Exception as exc:
      result['passed']=False;result['failure']=repr(exc)
      raise
    finally:
      server.shutdown()
      (OUT/'results.json').write_text(json.dumps(result,indent=2))
      (OUT/('results-'+args.scenario+'.json')).write_text(json.dumps(result,indent=2))
      frames=[p for p in OUT.glob('*.png')]
      (OUT/'frames.sha256').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in sorted(frames)))
    print(json.dumps({'passed':result['passed'],'checks':len(result['checks']),'errors':len(result['errors']),'httpFailures':len(result['httpFailures'])}))

if __name__=='__main__':main()
