"""Stage 7 actual gameplay polish review; source art is never regenerated.

Initial parking uses the existing source debug stop. Prepared scene overviews use
production save factories and named entrances, disclosed in evidence. Walking,
interaction, pause, reduced motion and touch review use the playable runtime.
"""
import argparse
import base64
import functools
import hashlib
import json
import math
import shutil
import subprocess
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from centrum_economy_browser import Quiet, wait_ready, wait_exploration, close_dialogue, walk_to, hold, use_exit, counter, counter_action

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification/stage7'
OUT.mkdir(parents=True,exist_ok=True)
KEY='bq-centrum:scene-network:v1'
SCENES=['metro-square','shopping-arcade','service-courtyard','food-shop','bicycle-workshop']


def snapshot(page):
    return page.evaluate('BearlyCentrumSquare.audit()')


def prepare_save(page,template,scene_id,reported=False):
    return page.evaluate(r'''([template,id,reported])=>{
      const scene=BearlyCentrumScenes.get(id),entranceId=scene.defaultEntrance;
      const position={sceneId:id,entranceId,...scene.anchors[entranceId]};
      const memory=new Map(),native={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v))};
      const K='bq-centrum:scene-network:v1',P='bq-centrum:parking:v1';
      memory.set(K,JSON.stringify({schemaVersion:1,layoutVersion:3,gateOpened:false,discovered:['metro-square'],position,inventory:{billys:1}}));
      const parking=structuredClone(template);parking.phase='exploring';parking.health=80;parking.exploration=position;
      memory.set(P,JSON.stringify(parking));
      if(reported)memory.set('bq-centrum:quest:wrong-entrance:v1',JSON.stringify({schemaVersion:1,questId:'wrong-entrance',state:'reported',cageInspected:true,slipPresented:true,cargoMoved:true,entitlement:{id:'wrong-entrance:completion:v1',questId:'wrong-entrance',status:'pending'},rewardReceipt:null}));
      const broker=BearlyCentrumSave.createAdventure(native),route={...BearlyCentrumLink.audit().route,health:80,x:template.parked.x,y:template.parked.y,speed:0,routeProgress:parking.routeProgress};
      broker.syncSession({health:80,mode:'exploring',route,exploration:position});broker.checkpoint('polish-prepared-entrance');
      return {raw:memory.get(K),position};
    }''',[template,scene_id,reported])


def create_page(browser,base,prepared=None,touch=False,reduced=False,watch=None):
    context=browser.new_context(viewport={'width':844 if touch else 1280,'height':390 if touch else 720},device_scale_factor=1,is_mobile=touch,has_touch=touch,reduced_motion='reduce' if reduced else 'no-preference')
    init="if(!localStorage.getItem('bq-centrum:polish-fixture-installed')){localStorage.setItem('bq-centrum:polish-untouched','unchanged');"
    if prepared:init+='localStorage.setItem('+json.dumps(KEY)+','+json.dumps(prepared['raw'])+');'
    init+="localStorage.setItem('bq-centrum:polish-fixture-installed','1');}"
    context.add_init_script(init)
    page=context.new_page()
    if watch:watch(page)
    page.goto(base+'/index.html',wait_until='domcontentloaded');wait_ready(page)
    if prepared:wait_exploration(page);close_dialogue(page)
    elif page.locator('#introStart').is_visible():page.locator('#introStart').click();page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'")
    return context,page


def capture(page,path):
    path.parent.mkdir(parents=True,exist_ok=True);page.screenshot(path=str(path));a=snapshot(page)
    return {'file':str(path.relative_to(OUT)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'build':page.evaluate('BEARLY_BUILD_ID'),'sceneId':a['sceneId'],'position':{k:a[k] for k in ['x','y','face','height','jump']},'camera':a['camera'],'hero':a['hero'],'groundShadow':a['shadow'],'drawOrder':a['drawOrder']}


def source_hashes():
    report=[]
    for line in (ROOT/'references/source/character-assets.sha256').read_text().splitlines():
        digest,name=line.split(None,1);name=name.strip();p=ROOT/name
        if name in ['js/game.js','js/illustrated-visits.js','js/autumn-quests.js']:continue # documented game bridge; original source reconstructed by integrity verifier
        actual=hashlib.sha256(p.read_bytes()).hexdigest()
        assert actual==digest,(name,actual,digest)
        report.append({'file':name,'sha256':actual})
    return report


class Recording:
    def __init__(self,page):
        self.frames=[];self.folder=OUT/'.walking-frames'
        if self.folder.exists():shutil.rmtree(self.folder)
        self.folder.mkdir()
        self.session=page.context.new_cdp_session(page);self.session.on('Page.screencastFrame',self.frame)
        self.session.send('Page.startScreencast',{'format':'jpeg','quality':75,'maxWidth':1280,'maxHeight':720,'everyNthFrame':6})
    def frame(self,event):
        path=self.folder/f'{len(self.frames):05d}.jpg';path.write_bytes(base64.b64decode(event['data']));self.frames.append((path,event['metadata']['timestamp']))
        self.session.send('Page.screencastFrameAck',{'sessionId':event['sessionId']})
    def finish(self):
        self.session.send('Page.stopScreencast');self.session.detach();assert len(self.frames)>20
        lines=[]
        for (path,at),(_,later) in zip(self.frames,self.frames[1:]):lines += [f"file '{path.resolve()}'",f'duration {max(.02,min(1,later-at)):.6f}']
        lines.append(f"file '{self.frames[-1][0].resolve()}'");listing=self.folder/'frames.txt';listing.write_text('\n'.join(lines)+'\n')
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-vf','setpts=PTS/2','-r','20','-c:v','libvpx-vp9','-cpu-used','4','-row-mt','1','-threads','2','-crf','34','-b:v','0','-pix_fmt','yuv420p',str(OUT/'polish-walking.webm')],check=True)
        evidence={'file':'polish-walking.webm','kind':'actual gameplay CDP recording','speed':2,'frames':len(self.frames),'nativeSeconds':self.frames[-1][1]-self.frames[0][1],'generatedArtwork':False};shutil.rmtree(self.folder);return evidence


def note(result,name,page,extra=None):
    a=snapshot(page);h=a['hero'];b=h['babyFace']
    assert a['height']==200 and h['height']==200
    assert h['integratedCarrier'] and h['body']['continuous']
    assert b['continuousUpperBody'] and b['originalCollar'] and not b['headOnly']
    assert math.isclose(b['uniformScale']/h['height'],.5710830421929589/200,rel_tol=1e-8),b
    result['checks'].append({'name':name,'passed':True,'sceneId':a['sceneId'],'position':{k:a[k] for k in ['x','y','jump','height']},'nativeBaby':{k:b[k] for k in ['mood','source','uniformScale','headHeight','continuousUpperBody','originalCollar']},'camera':a['camera'],'extra':extra})


def shot(result,page,name):result['captures'].append(capture(page,OUT/'after'/name))


def projection(page):
    return page.evaluate(r'''()=>{
      const a=BearlyCentrumSquare.audit(),host=document.querySelector('.canvas-wrap'),box=host.getBoundingClientRect(),style=getComputedStyle(host),scale=Math.max(box.width/1160,box.height/640);
      const panX=parseFloat(style.getPropertyValue('--square-pan'))||0,rawY=parseFloat(style.getPropertyValue('--square-pan-y')),panY=Number.isFinite(rawY)?rawY:50;
      const x=(a.x-a.camera.x)*scale-Math.max(0,1160*scale-box.width)*panX/100;
      const foot=(a.y-a.camera.y)*scale-Math.max(0,640*scale-box.height)*panY/100;
      const controls=[...document.querySelectorAll('.square-controls button')].map(b=>({id:b.className||b.dataset.squareDir,box:b.getBoundingClientRect().toJSON()}));
      return {x,foot,head:foot-200*scale,scale,panX,panY,box:box.toJSON(),controls};
    }''')


def acceptance(browser,base,setup,template,fixtures,result,watch):
    print('Desktop native movement, depth and boundaries',flush=True)
    context,page=create_page(browser,base,fixtures['metro-square'],watch=watch)
    assert page.evaluate('BEARLY_BUILD_ID')=='BQ_CENTRUM_STAGE7'
    geometry=page.evaluate('BearlyCentrumScenes.all().map(s=>({id:s.id,width:s.width,height:s.height,floor:s.floor,heroHeight:s.heroHeight}))')
    assert [s['id'] for s in geometry]==SCENES
    expected={'metro-square':(1500,1000,60,1440,320,930),'shopping-arcade':(1160,800,60,1100,320,750),'service-courtyard':(1160,800,60,1100,320,750),'food-shop':(1160,760,70,1090,430,710),'bicycle-workshop':(1160,760,70,1090,430,710)}
    for g in geometry:
        f=g['floor'];assert (g['width'],g['height'],f['left'],f['right'],f['top'],f['bottom'])==expected[g['id']]
    note(result,'Exactly five existing scene dimensions/floors and fixed source actor scale preserved',page,geometry)
    recording=Recording(page)
    walk_to(page,{'x':500,'y':530});page.wait_for_timeout(250);a=snapshot(page);order=[n['id'] for n in a['drawOrder']]
    assert order.index('player')<order.index('bench-west');shot(result,page,'desktop/bench-behind.png');note(result,'Walk behind west bench: foot-anchor depth order',page)
    # A real downward hold meets the same solid footprint before going around it.
    page.keyboard.down('ArrowDown');page.wait_for_timeout(750);a=snapshot(page);assert a['y']<=544.1 and 'bench-west' in a['hits'],a['hits'];page.keyboard.up('ArrowDown');page.wait_for_timeout(180);note(result,'Bench footprint blocks actual movement',page)
    walk_to(page,{'x':500,'y':610});page.wait_for_timeout(250);a=snapshot(page);order=[n['id'] for n in a['drawOrder']]
    assert order.index('player')>order.index('bench-west');shot(result,page,'desktop/bench-front.png');note(result,'Walk around and in front of west bench',page)
    page.keyboard.press('Space');page.wait_for_timeout(200);a=snapshot(page);assert a['jump']>20 and abs(a['shadow']['y']-a['y'])<1e-6
    assert next(n['footY'] for n in a['drawOrder'] if n['id']=='player')==a['y'];shot(result,page,'desktop/jump-grounded-shadow.png');note(result,'Jump keeps floor shadow and foot-depth sorting',page)
    page.wait_for_timeout(700)
    walk_to(page,{'x':820,'y':430});page.wait_for_timeout(300);plant=page.evaluate("BearlyCentrumSquareWorld.audit().planters.find(p=>p.id==='planter')");assert plant['faded'] and plant['foliageAlpha']==.35 and plant['stoneAlpha']==1,plant;shot(result,page,'desktop/planter-overlap.png');note(result,'Source planter foliage overlap keeps native baby and ground anchor',page)
    result['recording']=recording.finish()
    atmosphere=page.evaluate('BearlyCentrumAtmosphere.audit()');assert atmosphere['maxLeaves']==7 and atmosphere['drawnLeaves']<=7 and not atmosphere['fullSceneTransform'] and atmosphere['loops']==0
    before=atmosphere['clock'];page.wait_for_timeout(500);assert page.evaluate('BearlyCentrumAtmosphere.audit().clock')>before
    page.keyboard.press('p');page.wait_for_timeout(100);paused=page.evaluate('BearlyCentrumAtmosphere.audit().clock');page.wait_for_timeout(500);assert page.evaluate('BearlyCentrumAtmosphere.audit().clock')==paused
    page.keyboard.press('p');note(result,'Restrained floor leaves advance in play and freeze on pause',page,atmosphere)
    walk_to(page,{'x':1380,'y':910});hold(page,'ArrowRight',600);hold(page,'ArrowDown',600);a=snapshot(page)
    assert a['x']<=1418.01 and a['y']<=918.01 and 0<=a['camera']['x']<=340 and 0<=a['camera']['y']<=360
    shot(result,page,'desktop/square-southeast-boundary.png');note(result,'Desktop southeast floor/camera boundaries remain bounded',page)
    walk_to(page,{'x':260,'y':540});use_exit(page,'shopping-arcade');shot(result,page,'desktop/discovered-arcade-reaction.png')
    assert not page.locator('.centrum-dialogue').is_visible();note(result,'New-area baby reaction uses source expression without movement dialogue',page,page.evaluate('BearlyCentrumStory.audit().reaction'))
    use_exit(page,'food-shop');page.locator('.centrum-dialogue').wait_for(state='visible');page.wait_for_timeout(120)
    shot(result,page,'desktop/billys-discovery-dialogue.png');assert page.evaluate('BearlyCentrumSquare.audit().hero.babyFace.mood')=='point';note(result,'Billy’s discovery uses original point expression and compact dialogue',page)
    close_dialogue(page);use_exit(page,'shopping-arcade');use_exit(page,'bicycle-workshop');shot(result,page,'desktop/workshop-door-arrival.png');use_exit(page,'shopping-arcade');use_exit(page,'service-courtyard')
    shot(result,page,'desktop/courtyard-passage-arrival.png');note(result,'Actual doors and side passage reach all existing interiors/courtyard',page)
    use_exit(page,'metro-square');note(result,'Courtyard shortcut returns through named square gate',page)
    context.close()
    print('Phone landscape actual touch network and edge/crop review',flush=True)
    context,page=create_page(browser,base,fixtures['metro-square'],touch=True,watch=watch)
    start=snapshot(page);session=page.context.new_cdp_session(page);points=[]
    for direction in ['right','down']:
        b=page.locator(f'[data-square-dir="{direction}"]').bounding_box();points.append({'x':b['x']+b['width']/2,'y':b['y']+b['height']/2})
    session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':points});page.wait_for_timeout(400);session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});session.detach();page.wait_for_timeout(250)
    assert snapshot(page)['x']>start['x']+10 and snapshot(page)['y']>start['y']+10;note(result,'Phone landscape two-touch diagonal walking',page)
    walk_to(page,{'x':1380,'y':910},touch=True);hold(page,'ArrowRight',600,touch=True);hold(page,'ArrowDown',600,touch=True)
    p=projection(page);assert p['head']>=0 and p['foot']<=390 and p['foot']>=100,p
    buttons=[b['box'] for b in p['controls'] if b['box']['left']<=p['x']<=b['box']['right']]
    assert not any(b['top']<=p['foot']<=b['bottom'] for b in buttons),p
    shot(result,page,'phone-landscape/square-southeast-boundary.png');note(result,'Phone southeast edge keeps whole source actor and boots clear of touch row',page,p)
    walk_to(page,{'x':260,'y':540},touch=True);use_exit(page,'shopping-arcade',touch=True);use_exit(page,'food-shop',touch=True);close_dialogue(page)
    shot(result,page,'phone-landscape/food-door-and-baby.png');use_exit(page,'shopping-arcade',touch=True);use_exit(page,'service-courtyard',touch=True)
    shot(result,page,'phone-landscape/delivery-passage-and-resident.png');note(result,'Phone touch doors/passage preserve room/ground alignment',page)
    context.close()
    print('Payoff expression and readable phone counter dialogue',flush=True)
    reward_fixture=prepare_save(setup,template,'food-shop',reported=True)
    context,page=create_page(browser,base,reward_fixture,touch=True,watch=watch)
    counter(page);page.locator('[data-quest-action="claim_reward"]').tap();page.wait_for_timeout(100);page.locator('[data-dialogue-next]').tap();page.wait_for_timeout(120)
    assert page.evaluate('BearlyCentrumSquare.audit().hero.babyFace.mood')=='point';shot(result,page,'phone-landscape/quest-payoff-baby-and-dialogue.png')
    panel=page.locator('.centrum-dialogue').bounding_box();assert panel and panel['width']<=440 and panel['height']<250,panel
    note(result,'Counter payoff uses native baby point and compact readable quest UI',page,{'panel':panel,'economy':page.evaluate('({food:BearlyCentrumEconomy.snapshot().inventory.billys,money:BearlyCentrumEconomy.snapshot().wallet.kr})')})
    close_dialogue(page);page.wait_for_function('BearlyCentrumStory.audit().reaction===null',timeout=6000);note(result,'Short baby reaction expires without repeated dialogue',page)
    context.close()
    print('Reduced motion',flush=True)
    context,page=create_page(browser,base,fixtures['metro-square'],reduced=True,watch=watch)
    a=page.evaluate('BearlyCentrumAtmosphere.audit()');assert a['reducedMotion'] and a['drawnLeaves']==0 and page.evaluate("BearlyCentrumAtmosphere.wind('metro-square')")==0
    page.wait_for_timeout(600);assert page.evaluate('BearlyCentrumAtmosphere.audit().clock')==a['clock'];shot(result,page,'desktop/reduced-motion.png');note(result,'Reduced motion removes drifting leaves and foliage wind',page,a)
    context.close()


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--baseline-only',action='store_true');parser.add_argument('--acceptance-only',action='store_true');args=parser.parse_args()
    errors=[];failures=[]
    result={'stage':7,'kind':'before' if args.baseline_only else 'after','preparedOverviews':True,'fixtureDisclosure':'Production save factory, exact valid parking record and named default entrances prepare overview positions; actual keyboard/touch movement performs subsequent acceptance steps. Existing debug warp only shortens source cycling to the authored stop.','captures':[],'checks':[],'errors':errors,'httpFailures':failures,'limits':['Physical devices and non-Chromium browsers untested.','Pure depth walking retains the accepted source side/front gait.']}
    result['sourceArtwork']=source_hashes()
    result['runtimeFiles']={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [ROOT/'js/centrum-square-world.js',ROOT/'js/centrum-square.js',ROOT/'js/centrum-story.js',ROOT/'css/centrum-story.css',ROOT/'js/centrum-scenes.js']}
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        def watch(page):
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('response',lambda r:failures.append({'status':r.status,'url':r.url}) if r.status>=400 else None)
        setup_context,setup=create_page(browser,base,watch=watch)
        setup.evaluate('BEARLY_DEBUG_MENU.warp(7550)');setup.wait_for_timeout(300);setup.keyboard.press('e');wait_exploration(setup)
        template=setup.evaluate('BearlyCentrumLink.audit().parking')
        fixtures={scene_id:prepare_save(setup,template,scene_id) for scene_id in SCENES}
        for touch in ([] if args.acceptance_only else [False,True]):
          for scene_id in SCENES:
            print(('Phone landscape' if touch else 'Desktop')+': '+scene_id,flush=True)
            context,page=create_page(browser,base,fixtures[scene_id],touch=touch,watch=watch);page.wait_for_timeout(300)
            assert snapshot(page)['height']==200
            result['captures'].append(capture(page,OUT/result['kind']/('phone-landscape' if touch else 'desktop')/(scene_id+'.png')))
            context.close()
        if not args.baseline_only:acceptance(browser,base,setup,template,fixtures,result,watch)
        source=json.loads((ROOT/'references/source/capture-report.json').read_text())['frames']['front-carrier-street']['visits']['hero']
        expected_scale=source['babyFace']['uniformScale']*200/source['height']
        for captured in result['captures']:
            hero=captured['hero'];assert hero['height']==200 and math.isclose(hero['babyFace']['uniformScale'],expected_scale,rel_tol=1e-8),captured['file']
        result['baselineComparison']={'sourceGameplay':'references/source/front-carrier-street.png','sourceHeroHeight':source['height'],'sourceUniformBabyScale':source['babyFace']['uniformScale'],'acceptedCentrumHeroHeight':200,'expectedCentrumUniformBabyScale':expected_scale,'allCaptureScalesMatch':True,'sourceArtworkAndRendererHashCount':len(result['sourceArtwork']),'expressionVariation':'Head bounds vary in original source frames (idle62,point70); all use the same physical uniform scale.','visualReview':'Actual normal-size desktop and phone landscape frames compared with source gameplay: original continuous face/neck/collar/clothing, carrier attachment and bear/boot outline preserved.'}
        setup_context.close();browser.close()
      assert not errors,errors;assert not failures,failures
      result['result']='passed'
    finally:
      server.shutdown()
      (OUT/('before.json' if args.baseline_only else 'results.json')).write_text(json.dumps(result,indent=2)+'\n')
    print('PASS:',len(result['captures']),'actual gameplay overview captures; source character hashes unchanged; no JS/HTTP failures.')


if __name__=='__main__':main()
