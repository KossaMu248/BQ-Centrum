"""Focused final object-fit/fullscreen regression; prepared scenes, actual inputs.

The full quest/economy flows remain frozen in the preceding evidence. This suite
checks only projection, actor scale, unchanged movement/bag handlers and outside
scene reset. The explicitly forced fallback removes requestFullscreen from this
page's shell; it is a capability fixture, not a claim about a physical browser.
"""
import argparse
import functools
import hashlib
import json
import time
import traceback
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

import centrum_cross_browser as C
from playwright.sync_api import sync_playwright

ROOT=C.ROOT
DEFAULT_OUT=ROOT/'verification/stage10/browsers/fullscreen-final'
CASES=[('phone-landscape',844,390,True,s) for s in C.SCENES]+[('phone-portrait',390,844,True,'metro-square'),('phone-portrait',390,844,True,'shopping-arcade'),('desktop-letterbox',1280,900,False,'metro-square')]


def sample(page):
    """Independently project the fixed native canvas into its painted CSS box."""
    return page.evaluate(r'''()=>{
      const canvas=document.querySelector('#game'),host=document.querySelector('.canvas-wrap'),r=canvas.getBoundingClientRect(),h=host.getBoundingClientRect(),s=getComputedStyle(canvas),a=BearlyCentrumSquare.inventoryContext(),l=BearlyCentrumInventory.audit().layout;
      const logicalWidth=1160,logicalHeight=640,fit=s.objectFit,common=fit==='contain'?Math.min(r.width/logicalWidth,r.height/logicalHeight):Math.max(r.width/logicalWidth,r.height/logicalHeight);
      const sx=fit==='fill'?r.width/logicalWidth:common,sy=fit==='fill'?r.height/logicalHeight:common;
      const values=s.objectPosition.split(/\s+/),position=v=>v?.endsWith('%')?parseFloat(v)/100:.5;
      const px=position(values[0]),py=position(values[1]||values[0]);
      const ox=r.left-h.left+(r.width-logicalWidth*sx)*px,oy=r.top-h.top+(r.height-logicalHeight*sy)*py;
      const expected={x:ox+(a.screenX-70)*sx,y:oy+(a.screenY-a.jump-(a.height+12))*sy,w:140*sx,h:(a.height+20)*sy};
      return {fullscreen:BearlyFullscreen.state(),nativeEnabled:document.fullscreenEnabled,nativeElement:document.fullscreenElement?.className||null,viewport:{width:innerWidth,height:innerHeight},canvas:{backingWidth:canvas.width,backingHeight:canvas.height,logicalWidth,logicalHeight,box:{x:r.x,y:r.y,w:r.width,h:r.height},objectFit:fit,objectPosition:s.objectPosition,scaleX:sx,scaleY:sy,offsetX:ox,offsetY:oy},host:{x:h.x,y:h.y,w:h.width,h:h.height},expectedActor:expected,paintedActorHeight:a.height*sy,layout:l,square:BearlyCentrumSquare.audit(),sceneDock:document.querySelector('.centrum-inventory-hud').dataset.sceneDock||null};
    }''')


def assert_scene(p,view):
    l=p['layout'];assert l is not None and l['clear'],(view,p)
    actual=l['actor'];expected=p['expectedActor']
    for key in ['x','y','w','h']:
        assert abs(actual[key]-expected[key])<2,(view,key,actual,expected,p['canvas'])
    baby=p['square']['hero']['babyFace'];assert baby['continuousUpperBody'] and baby['originalCollar'] and not baby['headOnly']
    assert p['square']['height']==200 and p['square']['health']==73
    actual_phone=p['viewport']['width']<=700 or p['viewport']['height']<=500 and p['viewport']['width']>p['viewport']['height']
    if actual_phone and p['fullscreen']!='window':assert p['canvas']['objectFit']=='cover',(view,p['canvas'])


def move_and_bag(page,touch):
    start=C.square(page)['x'];page.keyboard.down('ArrowRight')
    try:page.wait_for_function('x=>BearlyCentrumSquare.audit().x>x+4',arg=start,timeout=20000)
    finally:page.keyboard.up('ArrowRight')
    page.wait_for_function('Math.abs(BearlyCentrumSquare.audit().vx)<1',timeout=20000)
    control=C.check_bag_control(page,touch)
    assert C.square(page)['x']>start+3
    return control


def activate_fullscreen(page,touch):
    control=page.locator('#squareFullscreenBtn')
    if touch:control.tap()
    else:control.click()
    page.wait_for_function("BearlyFullscreen.state()!=='window'",timeout=20000)
    page.wait_for_timeout(180)


def exit_fullscreen(page,touch):
    control=page.locator('#squareFullscreenBtn') if page.evaluate('BearlyCentrumSquare.active()') else page.locator('.fullscreen-exit')
    if control.is_visible():
        if touch:control.tap()
        else:control.click()
    else:page.keyboard.press('f')
    page.wait_for_function("BearlyFullscreen.state()==='window'",timeout=20000)
    page.wait_for_timeout(180)


def force_fallback(page):
    page.evaluate(r'''()=>{const el=document.querySelector('.game-shell');window.__presentationFSOwn=Object.getOwnPropertyDescriptor(el,'requestFullscreen');Object.defineProperty(el,'requestFullscreen',{configurable:true,value:undefined});}''')


def restore_native_api(page):
    page.evaluate(r'''()=>{const el=document.querySelector('.game-shell');if(window.__presentationFSOwn)Object.defineProperty(el,'requestFullscreen',window.__presentationFSOwn);else delete el.requestFullscreen;delete window.__presentationFSOwn;}''')


def check(engine,p,out,selected_case=None,skip_source=False,source_only=False):
    started=time.monotonic();active=None;browser=None
    result={'engine':engine,'suite':'presentation','checks':[],'captures':[],'errors':[],'consoleErrors':[],'httpFailures':[],'externalRequests':[],'runtimeHashes':C.runtime_hashes(),'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'sharedHelperSHA256':hashlib.sha256(Path(C.__file__).read_bytes()).hexdigest(),'conditions':{'headless':True,'physicalDevice':False,'OS':'Linux Debian13','scope':'Geometry-only final refinement. Full native quest/economy flow was completed on the prior explicitly pinned pre-refinement runtime; no full quest repeat here.','fixtures':'Production-factory current scene/parking saves. Actual movement, bag, fullscreen/exit and original remount/source-foot controls follow each prepared start. Explicit fallback capability fixture removes only the shell requestFullscreen method.','timing':'Shared cloud host; functional checks, not an isolated performance benchmark.'}}
    class Handler(SimpleHTTPRequestHandler):
        def log_message(self,*a):pass
        def copyfile(self,source,outputfile):
            try:return super().copyfile(source,outputfile)
            except (BrokenPipeError,ConnectionResetError):pass
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}';url=base+'/index.html'
    def watch(page):
        nonlocal active
        active=page
        page.add_init_script(r'''(()=>{const log=window.__presentationEvents=[];for(const name of ['pointerdown','pointerup','click','focus','blur','visibilitychange','keydown'])window.addEventListener(name,e=>{log.push({at:Math.round(performance.now()),type:e.type,key:e.code||null,target:e.target?.id||e.target?.className||e.target?.nodeName||null,x:e.clientX??null,y:e.clientY??null,focus:document.hasFocus(),visibility:document.visibilityState,browsing:window.BearlyCentrumInventory?.isBrowsing?.(),fullscreen:window.BearlyFullscreen?.state?.()});if(log.length>200)log.shift();},false);})();''')
        page.on('pageerror',lambda e:result['errors'].append(str(e)))
        page.on('console',lambda m:result['consoleErrors'].append(m.text) if m.type=='error' else None)
        page.on('response',lambda r:result['httpFailures'].append({'status':r.status,'url':r.url}) if r.status>=400 else None)
        page.on('request',lambda r:result['externalRequests'].append(r.url) if r.url.startswith(('http:','https:')) and not r.url.startswith(base+'/') else None)
    try:
        browser=getattr(p,engine).launch(headless=True);result['version']=browser.version
        ctx,page=C.context(browser,engine,url,watch);page.locator('#introStart').click();page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'",timeout=60000);page.wait_for_function('BearlyCentrumLink.audit().route.grounded',timeout=60000)
        prepared={s:C.scene_fixture(page,s) for s in C.SCENES}
        near_bike=page.evaluate(r'''raw=>{const K='bq-centrum:scene-network:v1',P='bq-centrum:parking:v1',m=new Map([[K,raw]]),store={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v))},b=BearlyCentrumSave.createAdventure(store),s=b.snapshot(),position={sceneId:'metro-square',entranceId:'from-cycle-route',...BearlyCentrumScenes.get('metro-square').anchors['from-cycle-route']};b.syncSession({...s.session,exploration:position});b.storage.setItem(P,JSON.stringify({...s.components[P],exploration:position}));b.checkpoint('presentation-near-bike-fixture');return{raw:m.get(K)};}''',prepared['metro-square']['raw'])
        C.note(result,'Fresh startup prepares only disclosed valid scene/parking saves',page,{'startup':page.evaluate('BEARLY_STARTUP()')});ctx.close()
        for view,width,height,touch,scene_id in ([] if source_only else [c for c in CASES if not selected_case or selected_case==c[0]+':'+c[4]]):
            ctx,page=C.context(browser,engine,url,watch,prepared[scene_id],touch);page.set_viewport_size({'width':width,'height':height});C.close_dialogue(page);page.wait_for_timeout(240)
            window=sample(page);assert_scene(window,view);modes=[{'mode':'window-scale-reference','sample':window}]
            page.bring_to_front();activate_fullscreen(page,touch);native_control=move_and_bag(page,touch);expanded=sample(page);assert_scene(expanded,view)
            if view.startswith('phone') and expanded['viewport']==window['viewport']:assert expanded['paintedActorHeight']>=window['paintedActorHeight']*.9,(view,window,expanded)
            modes.append({'mode':'native-request','actualMode':expanded['fullscreen'],'sample':expanded,'bagControl':native_control})
            C.shot(page,engine,view+'-'+scene_id+'-native-request',result)
            exit_fullscreen(page,touch)
            if view=='phone-portrait' and scene_id=='metro-square':
                force_fallback(page);activate_fullscreen(page,touch)
                fallback_control=move_and_bag(page,touch);fallback=sample(page);assert fallback['fullscreen']=='viewport';assert_scene(fallback,view)
                assert fallback['paintedActorHeight']>=window['paintedActorHeight']*.9,(view,window,fallback)
                modes.append({'mode':'forced-capability-fallback','sample':fallback,'bagControl':fallback_control})
                C.shot(page,engine,view+'-'+scene_id+'-viewport-fallback',result)
                exit_fullscreen(page,touch);restore_native_api(page)
            m=C.metrics(page);assert m['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in m['reads']+m['writes'])
            C.note(result,view+' '+scene_id+' fullscreen projection, scale, movement and bag',page,{'modes':modes,'metrics':m});ctx.close()
        if not skip_source:
            # Retain expanded portrait mode through the existing remount and source
            # street transfer, proving scene-only positioning/cover does not leak.
            source_view={'width':390,'height':844} if engine=='firefox' else {'width':844,'height':390}
            ctx,page=C.context(browser,engine,url,watch,near_bike,True);page.set_viewport_size(source_view);C.close_dialogue(page);page.bring_to_front();activate_fullscreen(page,True)
            page.keyboard.press('q');C.wait_for_remount(page,engine,result)
            ride=C.check_bag_control(page,True);assert ride['inventoryAudit']['layout'] is None and page.locator('.centrum-inventory-hud').get_attribute('data-scene-dock') is None
            riding=page.evaluate('BearlyCentrumLink.audit()');assert riding['route']['babyMounted'] and riding['route']['grounded'] and riding['ownership']['bicycles']==riding['ownership']['passengers']==1
            page.keyboard.press('q');page.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition",timeout=90000)
            hit=page.evaluate('''()=>{const e=document.querySelector('#inventoryOpenBtn'),r=e.getBoundingClientRect(),t=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2),tools=document.querySelector('.fullscreen-tools').getBoundingClientRect();return{target:t?.closest('button')?.id||t?.className,bag:{x:r.x,y:r.y,w:r.width,h:r.height},tools:{x:tools.x,y:tools.y,w:tools.width,h:tools.height},viewport:{width:innerWidth,height:innerHeight}};}''');assert hit['target']=='inventoryOpenBtn',hit
            source=C.check_bag_control(page,True);assert source['inventoryAudit']['layout'] is None and page.locator('.centrum-inventory-hud').get_attribute('data-scene-dock') is None
            passenger=page.evaluate('({hideRoadBaby:BearlyVisits.hideRoadBaby(),chairAlpha:BearlyVisits.roadBabyAlpha(),carrier:BearlyVisits.audit().baby,parkedAt:BearlyVisits.audit().parkedAt})');assert passenger['hideRoadBaby'] and passenger['chairAlpha']==0
            C.shot(page,engine,'expanded-source-foot-reset',result)
            page.keyboard.press('q');page.wait_for_function('!BearlyVisits.active()',timeout=90000)
            after=page.evaluate('BearlyCentrumLink.audit()');assert C.health(page)==73 and C.ledger(page)['inventory']['billys']==0 and C.ledger(page)['wallet']['kr']==0
            assert after['route']['babyMounted'] and after['route']['grounded'] and abs(after['route']['x']-riding['route']['x'])<3 and after['ownership']['bicycles']==after['ownership']['passengers']==1
            C.note(result,'Expanded source HUD resets; bag hit, same bike/passenger, supplies and source exit remain valid',page,{'requestedView':source_view,'actualViewport':hit['viewport'],'ridingBag':ride,'sourceBag':source,'sourceHit':hit,'sourcePassenger':passenger,'after':{'health':C.health(page),'food':C.ledger(page)['inventory']['billys'],'wallet':C.ledger(page)['wallet']['kr'],'route':after['route'],'ownership':after['ownership']},'fullscreenState':page.evaluate('BearlyFullscreen.state()'),'metrics':C.metrics(page)})
            exit_fullscreen(page,True);ctx.close()
        browser.close()
        assert not any(result[k] for k in ['errors','consoleErrors','httpFailures','externalRequests']),result
        result['passed']=True
    except BaseException as e:
        result['passed']=False;result['failure']=repr(e);result['traceback']=traceback.format_exc()
        try:result['failureAudit']={'inventory':active.evaluate('BearlyCentrumInventory.audit()'),'domEvents':active.evaluate('window.__presentationEvents'),'sample':sample(active),'link':active.evaluate('BearlyCentrumLink.audit()'),'visits':active.evaluate('BearlyVisits.audit()'),'metrics':C.metrics(active)};C.shot(active,engine,'failure-render',result)
        except Exception:pass
        print(engine+' FAILURE '+result['traceback'],flush=True)
        try:browser.close()
        except Exception:pass
    finally:server.shutdown()
    result['elapsedSeconds']=round(time.monotonic()-started,3);result['runtimeHashesAfter']=C.runtime_hashes();result['changedRuntimeFiles']=[name for name,sha in result['runtimeHashes'].items() if result['runtimeHashesAfter'].get(name)!=sha]
    assert not result['changedRuntimeFiles'],result['changedRuntimeFiles']
    (out/(engine+'-results.json')).write_text(json.dumps(result,indent=2)+'\n');return result


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--engine',choices=['all','firefox','webkit'],default='all');parser.add_argument('--out',type=Path,default=DEFAULT_OUT);parser.add_argument('--case',choices=[c[0]+':'+c[4] for c in CASES]);parser.add_argument('--skip-source',action='store_true');parser.add_argument('--source-only',action='store_true');args=parser.parse_args();out=args.out.resolve()
    if not out.is_relative_to(ROOT):parser.error('--out must stay inside BQ-Centrum')
    out.mkdir(parents=True,exist_ok=True);C.OUT=out
    with sync_playwright() as p:results=[check(e,p,out,args.case,args.skip_source,args.source_only) for e in (['firefox','webkit'] if args.engine=='all' else [args.engine])]
    combined={'scope':'Final fullscreen/object-fit geometry only, actual Firefox/LinuxWebKit, not physical devices or Safari','passed':all(r['passed'] for r in results),'results':results}
    (out/'results.json').write_text(json.dumps(combined,indent=2)+'\n');(out/'frames.sha256').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(out)}\n' for p in sorted(out.rglob('*.png'))))
    print('RESULT',combined['passed'],[(r['engine'],r.get('version'),len(r['checks'])) for r in results],flush=True)
    if not combined['passed']:raise SystemExit(1)


if __name__=='__main__':main()
