"""Firefox and Linux WebKit acceptance; no physical Safari/iPhone claim.

Browser binaries and optional shared libraries are development-only, project-local
under .test-browsers and never part of the game package. Scene/parking fixtures
are sealed through the production ledger. Native keyboard, pointer and touch-tap
inputs perform the interaction/animation checks after those disclosed fixtures.
"""
import argparse
import functools
import hashlib
import json
import math
import os
import statistics
import time
import traceback
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
BROWSERS = ROOT / '.test-browsers'
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', str(BROWSERS))
local_libs = BROWSERS / 'local-libs/usr/lib/x86_64-linux-gnu'
if local_libs.exists():
    os.environ['LD_LIBRARY_PATH'] = str(local_libs) + (':' + os.environ['LD_LIBRARY_PATH'] if os.environ.get('LD_LIBRARY_PATH') else '')
    # GTK-front-end validation cannot see project-local dlopen libraries through
    # ldconfig. Headless WPE is launched and its actual dependencies are resolved.
    os.environ.setdefault('PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS', '1')
from playwright.sync_api import sync_playwright
from centrum_network import route, scene, exit_to
from centrum_standalone import INSTRUMENT, fixture as scene_fixture, metrics

OUT = ROOT / 'verification/stage11/browsers'
SCENES = ['metro-square', 'shopping-arcade', 'service-courtyard', 'food-shop', 'bicycle-workshop']
KEY = 'bq-centrum:scene-network:v1'


def runtime_hashes():
    return {str(path.relative_to(ROOT)):hashlib.sha256(path.read_bytes()).hexdigest() for path in sorted([*ROOT.glob('*.html'),*ROOT.glob('*.css'),*ROOT.glob('js/*.js'),*ROOT.glob('css/*.css')])}


def square(page):
    return page.evaluate('BearlyCentrumSquare.audit()')


def health(page):
    return page.evaluate('BearlyCentrumLink.audit().route.health')


def ledger(page):
    return page.evaluate('BearlyCentrumSave.adventure.snapshot()')


def wait_ready(page):
    page.wait_for_function('window.BEARLY_STARTUP?.().firstFrameAt!==null&&window.BearlyCentrumInventory?.audit().bound', timeout=90000)


def wait_exploration(page):
    page.wait_for_function("BearlyCentrumLink.audit().phase==='exploring'&&BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading", timeout=90000)
    page.wait_for_timeout(160)


def close_dialogue(page):
    if page.locator('.centrum-dialogue').is_visible():
        page.keyboard.press('Escape')
        page.wait_for_timeout(70)


def hold(page, key, ms):
    page.keyboard.down(key)
    page.wait_for_timeout(ms)
    page.keyboard.up(key)
    page.wait_for_timeout(160)


def move_axis(page, axis, target):
    # Poll real displacement rather than assuming a number of frames fits a
    # short wall-clock hold. Cold software WebKit can render infrequently.
    for _ in range(12):
        current=square(page);delta=target-current[axis]
        if abs(delta)<8:return
        sign=1 if delta>0 else -1
        key=('ArrowRight' if sign>0 else 'ArrowLeft') if axis=='x' else ('ArrowDown' if sign>0 else 'ArrowUp')
        margin=min(15 if axis=='x' else 5,abs(delta)*.5)
        threshold=target-sign*margin
        page.keyboard.down(key)
        try:page.wait_for_function('([axis,edge,sign])=>sign*(BearlyCentrumSquare.audit()[axis]-edge)>=0',arg=[axis,threshold,sign],timeout=90000)
        finally:page.keyboard.up(key)
        velocity='vx' if axis=='x' else 'vy'
        page.wait_for_function('axis=>Math.abs(BearlyCentrumSquare.audit()[axis])<1',arg=velocity,timeout=15000)
    raise AssertionError(('Blocked keyboard waypoint',axis,target,square(page)))


def walk_to(page,target):
    current = square(page)
    for x,y in route(scene(page),(current['x'],current['y']),(target['x'],target['y'])):
        move_axis(page,'x',x)
        move_axis(page,'y',y)
    assert math.dist((square(page)['x'],square(page)['y']),(target['x'],target['y'])) < 38


def use_exit(page,destination):
    close_dialogue(page)
    walk_to(page,exit_to(page,destination))
    page.keyboard.press('e')
    page.wait_for_function('id=>BearlyCentrumSquare.audit().sceneId===id&&!BearlyCentrumSquare.audit().loading',arg=destination,timeout=90000)
    page.wait_for_timeout(170)



def verify_authored_angles(page, touch, engine, label, result):
    """Native inputs prove new views and resting retention, not a pose fixture."""
    samples=[]
    page.bring_to_front()
    for key,direction,sign,view in [('ArrowUp','up',-1,'away'),('ArrowDown','down',1,'toward')]:
        before=square(page)
        if touch:
            box=page.locator('[data-square-dir="'+direction+'"]').bounding_box();assert box
            page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);page.mouse.down()
        else:page.keyboard.down(key)
        try:
            page.wait_for_function("([start,sign,view])=>{const a=BearlyCentrumSquare.audit();return (a.y-start)*sign>8&&a.view===view&&a.hero?.view===view&&a.hero?.authoredView===true;}",arg=[before['y'],sign,view],timeout=20000)
            moving=square(page)
        finally:
            if touch:page.mouse.up()
            else:page.keyboard.up(key)
        page.wait_for_function('Math.abs(BearlyCentrumSquare.audit().vx)<1e-8&&Math.abs(BearlyCentrumSquare.audit().vy)<1e-8',timeout=15000)
        page.wait_for_timeout(100)
        rest=square(page);hero=rest['hero'];baby=hero['babyFace'];directional=hero['directional']
        assert rest['view']==view and hero['view']==view and hero['authoredView'],(view,rest)
        assert not moving['hits'] and rest['health']==before['health'],(before,moving,rest)
        assert hero['height']==200 and hero['integratedCarrier'] and baby['continuousUpperBody'] and baby['originalCollar'] and not baby['headOnly'],hero
        assert math.isclose(baby['uniformScale'],.5710830421929589,rel_tol=1e-9),hero
        assert directional['sourceBabyLower']=='assets/art/front-carrier-v7.png' and math.isclose(directional['sourceBabyLowerScale'],200/488,rel_tol=1e-9),hero
        samples.append({'direction':direction,'expectedView':view,'nativeInput':'dpad mouse pointer hold' if touch else 'keyboard hold','displacementY':moving['y']-before['y'],'restView':rest['view'],'health':rest['health'],'hero':hero,'passed':True})
        shot(page,engine,label+'-'+view,result)
    return samples


def target_dialogue(page,target):
    close_dialogue(page)
    anchor=page.evaluate('target=>BearlyCentrumStory.interactions(BearlyCentrumSquare.position().sceneId).find(a=>a.target===target)',target)
    assert anchor,target
    walk_to(page,anchor)
    page.keyboard.press('e')
    page.locator('.centrum-dialogue').wait_for(state='visible',timeout=15000)


def advance(page):
    for _ in range(20):
        nxt=page.locator('[data-dialogue-next]:visible:not(:disabled)')
        if not nxt.count():return
        nxt.first.click();page.wait_for_timeout(55)
    raise AssertionError('Dialogue did not reach choices')


def action(page,target,action_name,parcel=None):
    target_dialogue(page,target);advance(page)
    selector=f'[data-quest-action="{action_name}"]:visible'
    if parcel:selector+=f'[data-parcel-id="{parcel}"]'
    option=page.locator(selector)
    assert option.count(),page.locator('.centrum-dialogue').inner_text()
    option.first.click();page.wait_for_timeout(130);close_dialogue(page)


def context(browser,engine,url,watch,prepared=None,touch=False,record=False):
    options={'viewport':{'width':844 if touch else 1280,'height':390 if touch else 720},'has_touch':touch,'device_scale_factor':1}
    if engine!='firefox':options['is_mobile']=touch
    if record:
        folder=OUT/engine/'recordings';folder.mkdir(parents=True,exist_ok=True)
        options.update(record_video_dir=str(folder),record_video_size={'width':1280,'height':720})
    ctx=browser.new_context(**options);ctx.add_init_script(INSTRUMENT)
    if prepared:
        # Install once so a real reload reads the latest gameplay transaction.
        ctx.add_init_script("if(!localStorage.getItem('bq-centrum:cross-browser-fixture')){localStorage.setItem("+json.dumps(KEY)+','+json.dumps(prepared['raw'])+");localStorage.setItem('bq-centrum:cross-browser-fixture','1');}")
    page=ctx.new_page();watch(page);page.goto(url,wait_until='domcontentloaded');wait_ready(page)
    if prepared:wait_exploration(page)
    return ctx,page


def shot(page,engine,name,result):
    target=OUT/engine/result.get('suite','legacy')/(name+'.png');target.parent.mkdir(parents=True,exist_ok=True);page.screenshot(path=str(target))
    result['captures'].append({'file':str(target.relative_to(OUT)),'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})


def check_bag_control(page,touch):
    """Use Settings→Bag and verify native browsing leaves shared health intact."""
    mode=page.evaluate('BearlyCentrumEconomy.context().mode')
    gear='.square-settings' if mode=='centrum' else '.area-settings' if mode=='source-foot' else '.ride-settings'
    opener=page.locator(gear);opener.tap() if touch else opener.click()
    page.locator('#debugPanel').wait_for(state='visible')
    button=page.locator('#inventoryMenuBtn');box=button.bounding_box();assert box
    viewport=page.evaluate('({width:innerWidth,height:innerHeight})')
    assert 0<box['x']+box['width']/2<viewport['width'] and 0<box['y']+box['height']/2<viewport['height'],box
    assert button.evaluate('(button)=>{const b=button.getBoundingClientRect(),hit=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return !!hit&&(hit===button||button.contains(hit));}'),'Bag menu button is covered'
    before=health(page)
    if touch:button.tap()
    else:button.click()
    page.wait_for_function('BearlyCentrumInventory.isBrowsing()&&!BEARLY_DEBUG_MENU.isOpen()')
    panel=page.locator('.centrum-inventory-panel');panel.wait_for(state='visible')
    panel_box=panel.bounding_box()
    close=page.locator('#inventoryCloseBtn')
    if touch:close.tap()
    else:close.click()
    panel.wait_for(state='hidden')
    assert health(page)==before
    return {'input':'native touch tap' if touch else 'native pointer click','initiallyVisibleWithoutScroll':True,'button':box,'panel':panel_box,'healthBefore':before,'healthAfter':health(page),'inventoryAudit':page.evaluate('BearlyCentrumInventory.audit()')}


def note(result,name,page,data=None):
    worker=page.evaluate('''()=>({supported:!!window.BearlyCentrumHeroCache?.supported?.(),sceneActive:!!window.BearlyCentrumSquare?.active(),status:window.BearlyHeroRig?.centrumCacheStats?.()||null,raster:window.BearlyHeroRig?.audit?.()?.raster||null})''')
    result.setdefault('workerSamples',[]).append({'step':name,**worker})
    result['checks'].append({'name':name,'passed':True,'data':data})
    (OUT/(result['engine']+'-results.json')).write_text(json.dumps(result,indent=2)+'\n')
    print(result['engine']+': '+name,flush=True)


def gameplay_fixture(page,scene_id='metro-square'):
    prepared=scene_fixture(page,scene_id)
    return page.evaluate('raw=>{const K="bq-centrum:scene-network:v1",m=new Map([[K,raw]]),storage={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v))};const broker=BearlyCentrumSave.createAdventure(storage),s=broker.snapshot();broker.syncSession({...s.session,health:60});broker.collect("route-pizza-8");broker.checkpoint("cross-browser-network-fixture");return{raw:m.get(K)};}',prepared['raw'])


def wait_for_remount(page,engine,result):
    """Observe native progress for at most120seconds; preserve the live page on failure."""
    samples=[];start=time.monotonic();last_report=-10
    try:
        while page.evaluate('BearlyCentrumLink.audit().phase')!='riding':
            a=square(page);samples.append({'elapsed':round(time.monotonic()-start,2),'x':a['x'],'y':a['y'],'stride':a['stride'],'returning':a['returning'],'paused':a['paused'],'phase':page.evaluate('BearlyCentrumLink.audit().phase')})
            if time.monotonic()-start-last_report>=10:
                last_report=time.monotonic()-start;print(engine+' Q progress '+json.dumps(samples[-1]),flush=True)
            if time.monotonic()-start>120:raise AssertionError(('Q return did not complete in120seconds',samples[-12:]))
            page.wait_for_timeout(500)
    except BaseException:
        result['returnFailureAudit']={'samples':samples,'link':page.evaluate('BearlyCentrumLink.audit()'),'square':square(page),'metrics':metrics(page)}
        shot(page,engine,'live-return-failure',result)
        raise
    return samples


def functional_flow(browser,engine,base,watch,result,prepared):
    ctx,page=context(browser,engine,base+'/index.html',watch,prepared,record=True);close_dialogue(page)
    video=page.video
    start=square(page);hold(page,'ArrowRight',280);assert square(page)['x']>start['x']+10
    page.keyboard.press('p');before=page.evaluate('BearlyCentrumLink.audit().route.simTime');page.set_viewport_size({'width':900,'height':500});page.wait_for_timeout(250)
    assert square(page)['paused'] and page.evaluate('BearlyCentrumLink.audit().route.simTime')==before
    page.set_viewport_size({'width':1280,'height':720});page.keyboard.press('p')
    note(result,'Native walking and pause/resize/resume hold the source road',page)
    use_exit(page,'shopping-arcade');use_exit(page,'food-shop');close_dialogue(page)
    action(page,'shopkeeper','receive_slip')
    assert page.evaluate('BearlyWrongEntranceQuest.game.snapshot().state')=='slip_received'
    page.reload(wait_until='domcontentloaded');wait_ready(page);wait_exploration(page)
    assert page.evaluate('BearlyWrongEntranceQuest.game.snapshot().state')=='slip_received' and health(page)==60
    note(result,'Actual shop dialogue accepts slip; reload retains state/health',page)
    use_exit(page,'shopping-arcade');use_exit(page,'service-courtyard')
    action(page,'cage','inspect_cage');action(page,'caretaker','present_slip');action(page,'cage','confirm_parcel','B-04')
    page.wait_for_function('BearlyWrongEntranceQuest.game.snapshot().cargoMoved',timeout=30000);close_dialogue(page)
    shot(page,engine,'courtyard-delivery',result)
    note(result,'Native passage/inspection/approval completes production delivery movement',page)
    use_exit(page,'metro-square');assert square(page)['save']['gateOpened']
    use_exit(page,'shopping-arcade');use_exit(page,'bicycle-workshop');shot(page,engine,'workshop-native-arrival',result)
    use_exit(page,'shopping-arcade');use_exit(page,'food-shop')
    action(page,'shopkeeper','report');action(page,'shopkeeper','claim_reward');action(page,'shopkeeper','buy_billys')
    state=ledger(page);assert state['wallet']['kr']==20 and state['inventory']['billys']==3 and health(page)==60
    note(result,'Report/reward/purchase commit once through real counter choices',page)
    page.keyboard.press('i');page.locator('#inventoryEatBtn').click();page.wait_for_function('BearlyCentrumInventory.audit().eating!==null')
    page.wait_for_function('BearlyCentrumInventory.audit().eating===null',timeout=10000)
    assert health(page)==80 and ledger(page)['inventory']['billys']==2
    page.keyboard.press('i');page.locator('#inventoryEatBtn').click();page.wait_for_function('BearlyCentrumInventory.audit().eating!==null');hold(page,'ArrowLeft',90)
    assert health(page)==80 and ledger(page)['inventory']['billys']==2 and page.evaluate('BearlyCentrumInventory.audit().eating') is None
    note(result,'Live Eat heals atomically; movement interrupts the next action without loss',page)
    page.reload(wait_until='domcontentloaded');wait_ready(page);wait_exploration(page)
    state=ledger(page);assert state['wallet']['kr']==20 and state['inventory']['billys']==2 and health(page)==80 and state['gateOpened']
    assert page.evaluate('BearlyWrongEntranceQuest.game.snapshot().state')=='reward_claimed'
    shot(page,engine,'food-reload-native-baby',result)
    note(result,'Latest reload preserves food/wallet/claims/gate/health coherently',page)
    use_exit(page,'shopping-arcade');use_exit(page,'service-courtyard');use_exit(page,'metro-square')
    page.keyboard.press('q');result['returnProgress']=wait_for_remount(page,engine,result)
    ride=page.evaluate('BearlyCentrumLink.audit().route');assert ride['babyMounted'] and ride['grounded'] and health(page)==80
    shot(page,engine,'remounted-original-bike',result)
    note(result,'Actual Q walks to same bike, production remount completes grounded',page,{'x':ride['x'],'health':ride['health'],'wheels':ride['wheels']})
    riding_bag=check_bag_control(page,False)
    assert riding_bag['inventoryAudit']['layout'] is None and page.locator('.centrum-inventory-hud').get_attribute('data-scene-dock') is None
    audit=metrics(page);assert audit['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in audit['reads']+audit['writes'])
    note(result,'One main loop and project-only storage after complete interaction flow',page,{**audit,'ridingBagControl':riding_bag})
    # A separate source-foot regression follows the completed centrum flow.
    # Native Q uses the copied production street transfer, not a new scene.
    page.keyboard.press('q')
    page.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition",timeout=90000)
    assert not page.evaluate('BearlyCentrumSquare.active()')
    source_bag=check_bag_control(page,False)
    assert source_bag['inventoryAudit']['layout'] is None and page.locator('.centrum-inventory-hud').get_attribute('data-scene-dock') is None
    source_audit=page.evaluate('BearlyVisits.audit()')
    shot(page,engine,'source-foot-cleared-scene-hud',result)
    page.keyboard.press('q');page.wait_for_function('!BearlyVisits.active()',timeout=90000)
    assert page.evaluate("BearlyCentrumLink.audit().phase==='riding'&&BearlyCentrumLink.audit().route.babyMounted")
    assert health(page)<=80 and ledger(page)['inventory']['billys']==2 and ledger(page)['wallet']['kr']==20
    note(result,'Native source-foot visit and bag retain cleared scene HUD after remount',page,{'bagControl':source_bag,'sourceMode':source_audit['mode'],'healthAfter':health(page),'metrics':metrics(page)})
    ctx.close()
    if video:
        original=Path(video.path());target=OUT/engine/'native-network-loop.webm';original.replace(target)
        result['recording']={'file':str(target.relative_to(OUT)),'kind':'Actual browser video: native network interaction flow after disclosed parking/health/food fixture','timeScale':1}



def final_geometry(browser,engine,base,watch,result,prepared):
    ctx,page=context(browser,engine,base+'/index.html',watch,prepared)
    close_dialogue(page);use_exit(page,'shopping-arcade')
    a=square(page);assert a['entranceId']=='from-courtyard' and abs(a['x']-1048)<3 and abs(a['y']-586)<3
    assert not page.evaluate('p=>BearlyCentrumSquareWorld.blocked(p.x,p.y,22,12,p.sceneId,BearlyCentrumSquare.audit().save)',page.evaluate('BearlyCentrumSquare.position()'))
    note(result,'Final illustrated side-passage return uses clear1048,586 named arrival',page)
    walk_to(page,{'x':990,'y':590});page.keyboard.down('ArrowUp')
    try:page.wait_for_function("BearlyCentrumSquare.audit().hits.includes('service-passage-jamb')",timeout=30000)
    finally:page.keyboard.up('ArrowUp')
    a=square(page);assert a['y']>=561.9
    shot(page,engine,'final-passage-jamb-collision',result)
    note(result,'Final illustrated jamb blocks native movement at its ground footprint',page,{'x':a['x'],'y':a['y'],'hero':a['hero']})
    ctx.close()



def postquest_fixture(page):
    prepared=scene_fixture(page,'metro-square')
    return page.evaluate(r'''raw=>{
      const K='bq-centrum:scene-network:v1',P='bq-centrum:parking:v1',Q='bq-centrum:quest:wrong-entrance:v1',m=new Map([[K,raw]]),store={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v))};
      const broker=BearlyCentrumSave.createAdventure(store),s=broker.snapshot(),position={sceneId:'metro-square',entranceId:'from-courtyard-gate',...BearlyCentrumScenes.get('metro-square').anchors['from-courtyard-gate']};
      broker.syncSession({...s.session,health:60,exploration:position});
      broker.storage.setItem(P,JSON.stringify({...s.components[P],health:60,exploration:position}));
      broker.storage.setItem(Q,JSON.stringify({schemaVersion:1,questId:'wrong-entrance',state:'reported',cageInspected:true,slipPresented:true,cargoMoved:true,entitlement:{id:'wrong-entrance:completion:v1',questId:'wrong-entrance',status:'pending'},rewardReceipt:null}));
      broker.collect('route-pizza-8');broker.claimWrongEntrance();broker.purchase();broker.eatCommit('cross-browser-prepared-eat',60);broker.checkpoint('cross-browser-post-quest-return-fixture');
      return{raw:m.get(K)};
    }''',prepared['raw'])


def focused_return(browser,engine,base,watch,result,prepared):
    ctx,page=context(browser,engine,base+'/index.html',watch,prepared)
    close_dialogue(page);page.keyboard.press('q');samples=wait_for_remount(page,engine,result)
    riding=page.evaluate('BearlyCentrumLink.audit().route');assert riding['babyMounted'] and riding['grounded'] and health(page)==80
    shot(page,engine,'final-q-return-remounted',result)
    note(result,'Bounded native Q from1300,820 post-quest fixture reaches original bike/remount',page,{'samples':samples,'health':health(page),'metrics':metrics(page),'fixtureDisclosure':'Post-quest80HP/food2/20kr prepared through production ledger, same source parking/arrival as the timed first flow. No mid-walk teleport/fast-forward.'})
    ctx.close()


def run(engine,p,servers,args):
    started=time.monotonic();active_page=None
    result={'engine':engine,'checks':[],'captures':[],'suite':('last-steps' if args.last_steps_only else 'geometry' if args.final_geometry_only else 'smoke' if args.smoke_only else 'functional' if args.functional_only else 'complete'),'errors':[],'consoleErrors':[],'httpFailures':[],'externalRequests':[],'outsidePrefixRequests':[],
      'runtimeHashes':runtime_hashes(),'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
      'conditions':{'headless':True,'OS':'Linux Debian13','physicalDevice':False,'fixtureDisclosure':'Production factory prepares only valid parking/scene starting positions and60HP/onefood for the functional flow; walking, quest steps, transactions and remount use actual controls. This is separate from the Chromium fresh native road acceptance.','touchLimits':'Firefox has no Playwright is_mobile emulation; phone viewport+has_touch are tested. Sustained dpad input uses native mouse pointer holds; touch menus use native tap where supported. No physical Safari/iPhone claim.'}}
    try:
        browser=getattr(p,engine).launch(headless=True);result['version']=browser.version
        for subpath in ([False] if args.functional_only or args.final_geometry_only or args.last_steps_only else [False,True]):
            prefix='/BQ-Centrum/' if subpath else '/';directory=ROOT.parent if subpath else ROOT
            class Handler(SimpleHTTPRequestHandler):
                def log_message(self,*a):pass
                def copyfile(self,source,outputfile):
                    try:return super().copyfile(source,outputfile)
                    except (BrokenPipeError,ConnectionResetError):pass
                def log_request(self,code='-',size='-'):
                    if isinstance(code,int) and code>=400:result.setdefault('serverHttpFailures',[]).append({'status':code,'path':self.path})
            server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(directory)));Thread(target=server.serve_forever,daemon=True).start();servers.append(server)
            base=f'http://127.0.0.1:{server.server_port}';url=base+prefix+'index.html'
            def watch(page):
                nonlocal active_page
                active_page=page
                page.on('pageerror',lambda e:result['errors'].append(str(e)))
                page.on('console',lambda m:result['consoleErrors'].append({'text':m.text,'location':m.location}) if m.type=='error' else None)
                page.on('response',lambda r:result['httpFailures'].append({'status':r.status,'url':r.url}) if r.status>=400 else None)
                def request(req):
                    if not req.url.startswith(('http:','https:')):return
                    if not req.url.startswith(base+'/'):result['externalRequests'].append(req.url)
                    elif not urlparse(req.url).path.startswith(prefix):result['outsidePrefixRequests'].append(req.url)
                page.on('request',request)
            for touch in ([False] if args.functional_only or args.final_geometry_only or args.last_steps_only else [False,True]):
                label=('subpath' if subpath else 'root')+'-'+('touch-viewport' if touch else 'desktop')
                ctx,page=context(browser,engine,url,watch,touch=touch);page.locator('#introStart').click();page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'",timeout=60000)
                page.wait_for_function('BearlyCentrumLink.audit().route.grounded',timeout=60000);start=page.evaluate('BEARLY_TOUCH_STATUS().x');hold(page,'ArrowUp',1000);assert page.evaluate('BEARLY_TOUCH_STATUS().x')>start+1,{'before':start,'after':page.evaluate('BEARLY_TOUCH_STATUS()'),'startup':page.evaluate('BEARLY_STARTUP()')}
                prepared={scene_id:scene_fixture(page,scene_id) for scene_id in SCENES}
                if not subpath and not touch:network=gameplay_fixture(page)
                if args.last_steps_only:late_fixture=postquest_fixture(page)
                note(result,label+' fresh startup and actual ride input',page,{'startup':page.evaluate('BEARLY_STARTUP()'),'metrics':metrics(page)})
                if not touch:shot(page,engine,label+'-ride',result)
                ctx.close()
                for scene_id in ([] if args.last_steps_only else SCENES):
                    ctx,page=context(browser,engine,url,watch,prepared[scene_id],touch);close_dialogue(page)
                    a=square(page);assert a['sceneId']==scene_id and a['height']==200 and a['health']==73
                    assert a['hero']['babyFace']['continuousUpperBody'] and a['hero']['babyFace']['originalCollar'] and not a['hero']['babyFace']['headOnly']
                    before=a['x'];page.bring_to_front();page.keyboard.down('ArrowRight');page.wait_for_function('x=>BearlyCentrumSquare.audit().x>x+4',arg=before,timeout=15000);page.keyboard.up('ArrowRight');page.wait_for_timeout(150);assert square(page)['x']>before+3,{'before':before,'after':square(page),'metrics':metrics(page)}
                    authored=verify_authored_angles(page,touch,engine,label,result) if scene_id=='metro-square' else None
                    if touch and scene_id=='metro-square':
                        # Real PointerEvent input from mouse driver; cross-engine
                        # Playwright touchscreen API only exposes instantaneous tap.
                        b=page.locator('[data-square-dir="down"]').bounding_box();old=square(page)['y'];page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2);page.mouse.down();page.wait_for_function('y=>BearlyCentrumSquare.audit().y>y+4',arg=old,timeout=15000);page.mouse.up();page.wait_for_timeout(150);assert square(page)['y']>old+3
                        bag_control=check_bag_control(page,touch)
                        note(result,label+' native dpad pointer hold and bag touch tap',page,{'bagControl':bag_control})
                    else:bag_control=check_bag_control(page,touch)
                    a=square(page);q=metrics(page);assert q['maxPending']<=1
                    note(result,label+' '+scene_id+' rendered scene and movement',page,{'health':a['health'],'hero':a['hero'],'bagControl':bag_control,'authoredWalking':authored,'metrics':q})
                    if scene_id in ['metro-square','food-shop']:shot(page,engine,label+'-'+scene_id,result)
                    ctx.close()
                ctx,page=context(browser,engine,base+prefix+'autumn-v19.html',watch,touch=touch);assert page.evaluate('BEARLY_BUILD_ID')
                note(result,label+' active alias entry',page);ctx.close()
            if not subpath and not args.smoke_only and not args.final_geometry_only and not args.last_steps_only:functional_flow(browser,engine,base,watch,result,network)
            if args.last_steps_only:focused_return(browser,engine,base,watch,result,late_fixture)
            if args.final_geometry_only or args.last_steps_only:final_geometry(browser,engine,base,watch,result,prepared['service-courtyard'])
        browser.close()
        assert not result['errors'] and not result['consoleErrors'] and not result['httpFailures'] and not result.get('serverHttpFailures') and not result['externalRequests'] and not result['outsidePrefixRequests'],result
        result['passed']=True
    except BaseException as e:
        result['passed']=False;result['failure']=repr(e);result['traceback']=traceback.format_exc();
        try:
            failure_page=active_page if active_page and not active_page.is_closed() else page
            result['failureAudit']={'square':square(failure_page),'link':failure_page.evaluate('BearlyCentrumLink.audit()'),'visits':failure_page.evaluate('BearlyVisits.audit()'),'metrics':metrics(failure_page)}
            shot(failure_page,engine,'failure-render',result)
            failure_video=failure_page.video;failure_page.context.close()
            if failure_video:
                target=OUT/engine/'native-network-failed.webm';Path(failure_video.path()).replace(target)
                result['recording']={'file':str(target.relative_to(OUT)),'kind':'Actual failed flow recording; see failure/audit, not a completed acceptance','timeScale':1}
        except Exception:pass
        try:browser.close()
        except Exception:pass
        print(engine+' FAILURE '+result['traceback'],flush=True)
    result['elapsedSeconds']=round(time.monotonic()-started,3)
    result['runtimeHashesAfter']=runtime_hashes()
    result['changedRuntimeFiles']=[name for name,sha in result['runtimeHashes'].items() if result['runtimeHashesAfter'].get(name)!=sha]
    (OUT/(engine+'-results.json')).write_text(json.dumps(result,indent=2)+'\n')
    return result


def main():
    global OUT
    parser=argparse.ArgumentParser();parser.add_argument('--out',type=Path,default=OUT,help='Evidence directory inside this project (default:verification/stage11/browsers)');parser.add_argument('--engine',choices=['all','firefox','webkit'],default='all');parser.add_argument('--smoke-only',action='store_true');parser.add_argument('--functional-only',action='store_true');parser.add_argument('--final-geometry-only',action='store_true');parser.add_argument('--last-steps-only',action='store_true');args=parser.parse_args()
    OUT=args.out.resolve()
    if not OUT.is_relative_to(ROOT):parser.error('--out must stay inside BQ-Centrum')
    OUT.mkdir(parents=True,exist_ok=True);servers=[];results=[]
    with sync_playwright() as p:
        for engine in ['firefox','webkit'] if args.engine=='all' else [args.engine]:results.append(run(engine,p,servers,args))
    for server in servers:server.shutdown()
    combined={'scope':'Actual Firefox and Linux WebKit, not physical Safari/iPhone','results':results,'passed':all(r.get('passed') for r in results)}
    (OUT/'results.json').write_text(json.dumps(combined,indent=2)+'\n')
    (OUT/'frames.sha256').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(OUT)}\n' for p in sorted(OUT.rglob('*.png'))))
    print('RESULT',combined['passed'],[(r['engine'],r.get('version'),len(r['checks'])) for r in results],flush=True)
    if not combined['passed']:raise SystemExit(1)


if __name__=='__main__':main()
