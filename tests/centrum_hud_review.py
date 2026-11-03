"""Stage 10 actual rendered HUD/character and responsive input review.

Canonical production parking saves prepare scenes. Subsequent movement and UI
actions use normal keys/touch. The before run freezes only the two original UI
responses in memory, so ongoing fixes cannot change a later baseline context.
"""
import argparse
import functools
import hashlib
import json
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from centrum_polish import create_page,prepare_save,snapshot
from centrum_remaining_review import move_axis
from centrum_economy_browser import Quiet,wait_exploration,walk_to,close_dialogue,counter
from centrum_parking import INSTRUMENT as PARKING_INSTRUMENT

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification/stage10/hud'
POINTS={'metro-square':{'x':1380,'y':910},'shopping-arcade':{'x':1060,'y':550},'service-courtyard':{'x':785,'y':625},'food-shop':{'x':880,'y':530},'bicycle-workshop':{'x':810,'y':530}}
UI_FILES=['js/centrum-inventory.js','css/centrum-inventory.css']
INSTRUMENT=r'''(()=>{
  const draw=CanvasRenderingContext2D.prototype.drawImage;
  window.__hudPainted={};
  CanvasRenderingContext2D.prototype.drawImage=function(im,...a){
    if(this.canvas.id==='game'&&im?.dataset&&(im.dataset.passengerPiece==='continuous-upper-body'||im.dataset.sourceTransform==='continuous-surface')){
      let x,y,w,h;if(a.length===2){[x,y]=a;w=im.width;h=im.height;}else if(a.length===4){[x,y,w,h]=a;}else if(a.length===8){[x,y,w,h]=a.slice(4);}
      if([x,y,w,h].every(Number.isFinite)){
        const m=this.getTransform(),corners=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([x,y])=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f}));
        window.__hudPainted[im.dataset.passengerPiece?'baby':'body']={at:performance.now(),corners,canvas:{width:this.canvas.width,height:this.canvas.height},source:im.dataset.sourceAsset};
        if(im.dataset.passengerPiece&&window.__hudProbeActive){
          const host=document.querySelector('.canvas-wrap'),r=this.canvas.getBoundingClientRect(),visible=s=>{const e=document.querySelector(s),b=e.getBoundingClientRect();return !e.hidden&&b.width&&b.height?b.toJSON():null;};
          const style=getComputedStyle(this.canvas);
          window.__hudProbeSamples.push({at:performance.now(),raw:{...window.__hudPainted},canvasBox:r.toJSON(),fit:style.objectFit,position:style.objectPosition,panX:parseFloat(host.style.getPropertyValue('--square-pan'))||0,panY:parseFloat(host.style.getPropertyValue('--square-pan-y'))||0,hud:visible('.centrum-inventory-hud'),panel:visible('.centrum-inventory-panel'),eating:visible('.inventory-eating')});
        }
      }
    }
    return draw.call(this,im,...a);
  };
})();'''
MEASURE=r'''()=>{
  const a=BearlyCentrumSquare.audit(),canvas=document.querySelector('#game'),host=document.querySelector('.canvas-wrap'),box=canvas.getBoundingClientRect();
  const style=getComputedStyle(canvas),position=style.objectPosition.split(' ').map(v=>parseFloat(v)/100),fit=style.objectFit;
  let scaleX=box.width/canvas.width,scaleY=box.height/canvas.height;
  if(fit==='cover'||fit==='contain')scaleX=scaleY=(fit==='cover'?Math.max:Math.min)(scaleX,scaleY);
  const offsetX=(box.width-canvas.width*scaleX)*(Number.isFinite(position[0])?position[0]:.5),offsetY=(box.height-canvas.height*scaleY)*(Number.isFinite(position[1])?position[1]:.5);
  const raw=window.__hudPainted,project=p=>({x:box.left+p.x*scaleX+offsetX,y:box.top+p.y*scaleY+offsetY});
  const painted=Object.fromEntries(Object.entries(raw).map(([key,v])=>{const p=v.corners.map(project);return[key,{left:Math.min(...p.map(p=>p.x)),right:Math.max(...p.map(p=>p.x)),top:Math.min(...p.map(p=>p.y)),bottom:Math.max(...p.map(p=>p.y)),source:v.source,age:performance.now()-v.at}];}));
  if(painted.body)painted.helmet={...painted.body,bottom:painted.body.top+(painted.body.bottom-painted.body.top)*.30};
  const selectors={hud:'.centrum-inventory-hud',bag:'#inventoryOpenBtn',panel:'.centrum-inventory-panel',eating:'.inventory-eating',eat:'#inventoryEatBtn',close:'#inventoryCloseBtn',dialogue:'.centrum-dialogue',pause:'#squarePauseBtn'};
  const rectangles=Object.fromEntries(Object.entries(selectors).map(([id,s])=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return[id,!e.hidden&&r.width>0&&r.height>0?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null];}));
  return {sceneId:a.sceneId,x:a.x,y:a.y,height:a.height,face:a.face,camera:a.camera,health:a.health,baby:a.hero.babyFace,painted,projection:{fit,position:style.objectPosition,scaleX,scaleY},rectangles,layout:BearlyCentrumInventory.audit().layout||null,inventory:BearlyCentrumInventory.audit(),viewport:{width:innerWidth,height:innerHeight},controls:[...document.querySelectorAll('.square-controls button,.square-actions button')].map(e=>({label:e.textContent,disabled:e.disabled,rect:e.getBoundingClientRect().toJSON()}))};
}'''


def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def overlap(a,b):return bool(a and b and min(a['right'],b['right'])>max(a['left'],b['left']) and min(a['bottom'],b['bottom'])>max(a['top'],b['top']))


def shot(page,name,result,strict=True):
    page.wait_for_timeout(180);state=page.evaluate(MEASURE)
    path=OUT/result['phase']/(name+'.png');path.parent.mkdir(parents=True,exist_ok=True);page.screenshot(path=str(path))
    h=state['rectangles']['hud'];assert h and state['painted'].get('baby') and state['painted'].get('body')
    hits={key:overlap(h,state['painted'][key]) for key in ['baby','helmet','body']}
    if strict:
        assert not hits['baby'] and not hits['helmet'],(name,hits,state)
        assert state['layout'] and state['layout']['clear'],(name,state['layout'])
        assert h['left']>=0 and h['right']<=state['viewport']['width']+.1 and h['top']>=0 and h['bottom']<=state['viewport']['height']+.1
    b=state['baby'];assert b['continuousUpperBody'] and b['originalCollar'] and not b['headOnly'] and abs(b['uniformScale']-.5710830421929589)<1e-8
    result['captures'].append({'file':str(path.relative_to(OUT)),'sha256':sha(path),'actualGameplay':True,'captureIsGeneratedIllustration':False,'overlap':hits,'state':state})
    return state


def visible_hit(page,selector):
    return page.evaluate('s=>{const e=document.querySelector(s),r=e.getBoundingClientRect(),p=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return !!p&&(p===e||e.contains(p));}',selector)


def stable(page,result,label):
    values=page.evaluate('''async()=>{const out=[];for(let i=0;i<20;i++){const e=document.querySelector('.centrum-inventory-hud'),r=e.getBoundingClientRect();out.push({left:r.left,top:r.top,width:r.width,height:r.height});await new Promise(r=>setTimeout(r,20));}return out;}''')
    assert all(v==values[0] for v in values),(label,values)
    result['checks'].append({'name':label,'passed':True,'stationarySamples':len(values),'rect':values[0]})


def moving_probe(page,result,label):
    page.evaluate('window.__hudProbeSamples=[];window.__hudProbeActive=true')
    page.keyboard.down('ArrowLeft');page.wait_for_timeout(600);page.keyboard.press('Space');page.wait_for_timeout(350);page.keyboard.up('ArrowLeft')
    page.wait_for_timeout(1000);page.keyboard.down('ArrowRight');page.wait_for_timeout(900);page.keyboard.up('ArrowRight');page.wait_for_timeout(500)
    frames=page.evaluate('window.__hudProbeActive=false;window.__hudProbeSamples');assert len(frames)>=10
    violations=[];body_tops=[]
    for f in frames:
      box=f['canvasBox'];canvas=f['raw']['body']['canvas'];sx=box['width']/canvas['width'];sy=box['height']/canvas['height'];fit=f.get('fit','cover')
      if fit in ['cover','contain']:sx=sy=(max if fit=='cover' else min)(sx,sy)
      position=[float(s.rstrip('%'))/100 for s in f.get('position',f"{f['panX']}% {f['panY']}%").split()]
      offsetx=(box['width']-canvas['width']*sx)*position[0];offsety=(box['height']-canvas['height']*sy)*position[1]
      actual={}
      for name,v in f['raw'].items():
        points=[(box['left']+p['x']*sx+offsetx,box['top']+p['y']*sy+offsety) for p in v['corners']]
        actual[name]={'left':min(p[0] for p in points),'right':max(p[0] for p in points),'top':min(p[1] for p in points),'bottom':max(p[1] for p in points)}
      body=actual['body'];actual['helmet']={**body,'bottom':body['top']+(body['bottom']-body['top'])*.30}
      body_tops.append(body['top'])
      for widget in ['hud','panel','eating']:
        for part in ['baby','helmet']:
          if overlap(f.get(widget),actual[part]):violations.append({'at':f['at'],'widget':widget,'part':part,'widgetRect':f[widget],'painted':actual[part]})
    docks=[(f['hud']['left'],f['hud']['top']) for f in frames];changes=sum(a!=b for a,b in zip(docks,docks[1:]));span=max(body_tops)-min(body_tops)
    assert span>20 and changes<=3,(label,span,changes)
    result.setdefault('dynamicProbes',[]).append({'name':label,'actualPaintedFrames':len(frames),'projectedBodyTopSpan':span,'dockChanges':changes,'violations':violations,'samples':frames})
    assert not violations,(label,violations)
    stable(page,result,label+' landed dock stable')


def fullscreen_review(browser,base,prepared,result,watch):
    context,page=create_page(browser,base,prepared,watch=watch);walk_to(page,POINTS['shopping-arcade'])
    before=snapshot(page);page.keyboard.press('p');assert snapshot(page)['paused']
    page.locator('#squareFullscreenBtn').click();page.wait_for_function("BearlyFullscreen.state()!=='window'")
    kind=page.evaluate('BearlyFullscreen.state()');entered=shot(page,'fullscreen/paused-'+kind,result)
    assert snapshot(page)['paused'] and entered['camera']==before['camera'] and entered['height']==before['height']
    assert (snapshot(page)['x'],snapshot(page)['y'])==(before['x'],before['y'])
    page.keyboard.press('p');assert not snapshot(page)['paused']
    page.keyboard.down('ArrowLeft');page.wait_for_timeout(300);page.keyboard.up('ArrowLeft');page.wait_for_timeout(200)
    assert snapshot(page)['x']<before['x'] and snapshot(page)['health']==before['health']
    assert visible_hit(page,'.fullscreen-exit');page.locator('.fullscreen-exit').click();page.wait_for_function("BearlyFullscreen.state()==='window'")
    shot(page,'fullscreen/window-after-exit',result)
    assert snapshot(page)['height']==200 and snapshot(page)['health']==before['health']
    result['checks'].append({'name':'Existing fullscreen button, pause/resume and visible exit preserve fixed actor/camera on entry and shared health.','passed':True,'fullscreenImplementation':kind})
    context.close()


def phone_fullscreen_probe(browser,base,prepared,result,watch,accept_scale=False):
    for mode,size in [('phone-landscape',{'width':844,'height':390}),('phone-portrait',{'width':390,'height':844})]:
        context,page=create_page(browser,base,prepared,touch=True,watch=watch);page.set_viewport_size(size);walk_to(page,POINTS['shopping-arcade'],touch=True)
        page.wait_for_function('BearlyCentrumSquare.audit().weight===0')
        before=shot(page,'mobile-fullscreen/'+mode+'-window',result);position=snapshot(page)
        page.locator('#squarePauseBtn').tap();page.locator('#squareFullscreenBtn').tap();page.wait_for_function("BearlyFullscreen.state()!=='window'")
        kind=page.evaluate('BearlyFullscreen.state()');entered=shot(page,'mobile-fullscreen/'+mode+'-'+kind,result)
        assert snapshot(page)['camera']==position['camera'] and snapshot(page)['height']==200 and snapshot(page)['paused']
        if accept_scale:
            for selector in ['#squarePauseBtn','#squareMapBtn','#squareFullscreenBtn','.square-exit','#inventoryOpenBtn']:assert visible_hit(page,selector),(mode,selector)
            assert not page.locator('.fullscreen-tools').is_visible()
        page.locator('#squarePauseBtn').tap();assert not snapshot(page)['paused']
        if accept_scale:
            page.locator('#inventoryOpenBtn').tap();opened=shot(page,'mobile-fullscreen/'+mode+'-native-bag',result)
            assert not overlap(opened['rectangles']['panel'],opened['painted']['baby']) and not overlap(opened['rectangles']['panel'],opened['painted']['helmet'])
            assert visible_hit(page,'#inventoryCloseBtn') and visible_hit(page,'#inventoryEatBtn');page.locator('#inventoryCloseBtn').tap()
        page.locator('#squareFullscreenBtn').tap();page.wait_for_function("BearlyFullscreen.state()==='window'")
        returned=shot(page,'mobile-fullscreen/'+mode+'-returned',result)
        pixels=lambda s:s['painted']['body']['bottom']-s['painted']['body']['top']
        ratio=pixels(entered)/pixels(before)
        result.setdefault('phoneFullscreen',[]).append({'mode':mode,'implementation':kind,'beforeFit':before['projection']['fit'],'fullscreenFit':entered['projection']['fit'],'beforePaintedActorHeight':pixels(before),'fullscreenPaintedActorHeight':pixels(entered),'returnedPaintedActorHeight':pixels(returned),'fullscreenScaleRatio':ratio,'scalePreserved':abs(ratio-1)<.05,'cameraUnchanged':True})
        if accept_scale:
            assert abs(ratio-1)<.05 and entered['projection']['fit']=='cover'
            result['checks'].append({'name':mode+' native fullscreen preserves painted actor scale, camera, touch controls and baby/helmet clearance; visible Square toggle exits.','passed':True,'actorScaleRatio':ratio})
        context.close()


def near_bike_save(page,template):
    return page.evaluate(r'''template=>{
      const id='metro-square',entranceId='from-cycle-route',position={sceneId:id,entranceId,...BearlyCentrumScenes.get(id).anchors[entranceId]};
      const memory=new Map(),native={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v))},K='bq-centrum:scene-network:v1';
      memory.set(K,JSON.stringify({schemaVersion:1,layoutVersion:3,gateOpened:false,discovered:[id],position,inventory:{billys:1}}));
      const parking=structuredClone(template);parking.phase='exploring';parking.health=80;parking.exploration=position;memory.set('bq-centrum:parking:v1',JSON.stringify(parking));
      const broker=BearlyCentrumSave.createAdventure(native),route={...BearlyCentrumLink.audit().route,health:80,x:template.parked.x,y:template.parked.y,speed:0,routeProgress:parking.routeProgress};
      broker.syncSession({health:80,mode:'exploring',route,exploration:position});broker.checkpoint('hud-valid-near-bike-fixture');return{raw:memory.get(K),position};
    }''',template)


def fullscreen_scope_review(browser,base,prepared,result,watch):
    def scope_watch(page):watch(page);page.add_init_script(PARKING_INSTRUMENT)
    context,page=create_page(browser,base,prepared,touch=True,watch=scope_watch)
    original=page.evaluate('BearlyCentrumLink.audit()');food=page.evaluate('BearlyCentrumInventory.audit().food')
    page.locator('#squareFullscreenBtn').tap();page.wait_for_function("BearlyFullscreen.state()!=='window'")
    assert not page.locator('.fullscreen-tools').is_visible();shot(page,'mobile-fullscreen/near-bike-scene',result)
    page.locator('.square-exit').tap()
    samples=[]
    for _ in range(300):
        a=page.evaluate('BearlyCentrumLink.audit()');samples.append({'phase':a['phase'],'ownership':a['ownership'],'health':a['route']['health']})
        assert a['ownership']['bicycles']==1 and a['ownership']['passengers']==1 and a['route']['health']==80
        if a['phase']=='riding':break
        page.wait_for_timeout(100)
    else:raise AssertionError(('Fullscreen remount did not finish',samples[-1]))
    page.wait_for_function('!BearlyVisits.active()&&!BearlyCentrumSquare.active()')
    riding=page.evaluate('BearlyCentrumLink.audit()');assert riding['ownership']['passenger']=='chair' and abs(riding['route']['x']-original['parking']['parked']['x'])<3
    assert page.evaluate('BEARLY_DEBUG().babySeated') and page.evaluate('BearlyCentrumInventory.audit().food')==food
    assert riding['route']['grounded'] and abs(riding['route']['speed'])<=45 and all(abs(w['clearance'])<2 for w in riding['route']['wheels'])
    assert not page.evaluate('__parkingQA.passengerViolations') and page.locator('.fullscreen-tools').is_visible() and visible_hit(page,'.fullscreen-exit')
    assert page.evaluate('BearlyCentrumInventory.audit().layout') is None
    path=OUT/'after/mobile-fullscreen/original-route-tools-restored.png';path.parent.mkdir(parents=True,exist_ok=True);page.screenshot(path=str(path))
    result['captures'].append({'file':str(path.relative_to(OUT)),'sha256':sha(path),'actualGameplay':True,'captureIsGeneratedIllustration':False,'sourceRoute':riding})
    page.locator('.fullscreen-exit').tap();page.wait_for_function("BearlyFullscreen.state()==='window'")
    assert page.evaluate('BearlyCentrumLink.audit().route.health')==80
    result['checks'].append({'name':'Prepared valid near-bike anchor: phone fullscreen→normal Q return/remount→one original bicycle/passenger, grounded wheels, unchanged80HP/food and source fullscreen-tools restored/exit works.','passed':True,'samples':samples,'fixture':prepared['position'],'riding':riding})
    context.close()


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--before',action='store_true');parser.add_argument('--quick',action='store_true');parser.add_argument('--fullscreen-only',action='store_true');parser.add_argument('--phone-fullscreen-probe',action='store_true');parser.add_argument('--phone-fullscreen-acceptance',action='store_true');args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    baseline={name:(ROOT/name).read_text() for name in UI_FILES}
    result={'phase':'before' if args.before else 'after','captures':[],'checks':[],'errors':[],'httpFailures':[],
            'fixtureDisclosure':'Production parking/save factory and named entrances prepare scenes. Existing source debug stop only shortens setup. All approach movement, UI interactions and viewport changes use live runtime controls. Before freezes original inventory JS/CSS responses in memory at run start.',
            'uiHashes':{name:sha(ROOT/name) for name in UI_FILES},'physicalDeviceTesting':False}
    result['runtimeHashes']={name:sha(ROOT/name) for name in UI_FILES+['css/centrum-square.css','js/centrum-square.js','js/hero-rig.js','js/baby-passenger.js']}
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);result['browser']=browser.version
        def watch(page):
            page.add_init_script(INSTRUMENT)
            page.on('pageerror',lambda e:result['errors'].append(str(e)))
            page.on('response',lambda r:result['httpFailures'].append({'status':r.status,'url':r.url}) if r.status>=400 else None)
            if args.before:
                for name,body in baseline.items():
                    page.route('**/'+name+'*',lambda route,request,body=body,name=name:route.fulfill(body=body,content_type='text/css' if name.endswith('.css') else 'text/javascript'))
        setup_context,setup=create_page(browser,base,watch=watch)
        setup.evaluate('BEARLY_DEBUG_MENU.warp(7550)');setup.wait_for_timeout(300);setup.keyboard.press('e');wait_exploration(setup)
        template=setup.evaluate('BearlyCentrumLink.audit().parking');fixtures={id:prepare_save(setup,template,id) for id in POINTS}
        if args.fullscreen_only:fullscreen_review(browser,base,fixtures['shopping-arcade'],result,watch)
        if args.phone_fullscreen_probe:phone_fullscreen_probe(browser,base,fixtures['shopping-arcade'],result,watch)
        if args.phone_fullscreen_acceptance:
            phone_fullscreen_probe(browser,base,fixtures['shopping-arcade'],result,watch,accept_scale=True)
            fullscreen_scope_review(browser,base,near_bike_save(setup,template),result,watch)
        modes=[] if args.fullscreen_only or args.phone_fullscreen_probe or args.phone_fullscreen_acceptance else ['phone-landscape'] if args.before else ['phone-portrait'] if args.quick else ['desktop','phone-landscape','phone-portrait']
        for mode in modes:
          for id,target in POINTS.items():
            if args.quick and id!='metro-square':continue
            print(mode+': '+id,flush=True)
            context,page=create_page(browser,base,fixtures[id],touch=mode!='desktop',watch=watch)
            if mode=='phone-portrait':page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(150)
            walk_to(page,target,touch=mode!='desktop');close_dialogue(page)
            s=shot(page,mode+'/'+id,result,strict=not args.before)
            if not args.before:
                assert visible_hit(page,'#inventoryOpenBtn')
                for selector in (['[data-square-dir="up"]','[data-square-dir="right"]','.square-interact','#squarePauseBtn'] if mode!='desktop' else ['#squarePauseBtn']):
                    assert visible_hit(page,selector),(mode,id,selector)
                stable(page,result,mode+' '+id+' stationary dock')
                page.locator('#inventoryOpenBtn').tap() if mode!='desktop' else page.locator('#inventoryOpenBtn').click()
                assert page.evaluate('BearlyCentrumInventory.isBrowsing()')
                assert visible_hit(page,'#inventoryCloseBtn') and visible_hit(page,'#inventoryEatBtn')
                opened=shot(page,mode+'/'+id+'-bag',result)
                assert not overlap(opened['rectangles']['panel'],opened['painted']['baby']) and not overlap(opened['rectangles']['panel'],opened['painted']['helmet']),(mode,id,opened)
                stable(page,result,mode+' '+id+' bag dock')
                page.locator('#inventoryEatBtn').tap() if mode!='desktop' else page.locator('#inventoryEatBtn').click()
                assert page.evaluate('BearlyCentrumInventory.isEating()')
                action=shot(page,mode+'/'+id+'-eating',result)
                assert not overlap(action['rectangles']['eating'],action['painted']['baby']) and not overlap(action['rectangles']['eating'],action['painted']['helmet'])
                assert visible_hit(page,'#inventoryCancelEatBtn')
                page.locator('#inventoryCancelEatBtn').tap() if mode!='desktop' else page.locator('#inventoryCancelEatBtn').click()
                assert snapshot(page)['health']==s['health'] and page.evaluate('BearlyCentrumInventory.audit().food')==1
                page.locator('#inventoryOpenBtn').tap() if mode!='desktop' else page.locator('#inventoryOpenBtn').click()
                page.locator('#inventoryCloseBtn').tap() if mode!='desktop' else page.locator('#inventoryCloseBtn').click()
                assert not page.evaluate('BearlyCentrumInventory.isBrowsing()') and snapshot(page)['health']==s['health']
            context.close()
        # The original overlap and the portrait northern boundary are explicit comparisons.
        boundary_cases=[('desktop','shopping-arcade',POINTS['shopping-arcade']),('phone-portrait','metro-square',{'x':760,'y':332})]
        if not args.before:boundary_cases.append(('phone-landscape','shopping-arcade',POINTS['shopping-arcade']))
        if args.quick:boundary_cases=[c for c in boundary_cases if c[0]!='desktop']
        if args.fullscreen_only or args.phone_fullscreen_probe or args.phone_fullscreen_acceptance:boundary_cases=[]
        for mode,id,target in boundary_cases:
            context,page=create_page(browser,base,fixtures[id],touch=mode!='desktop',watch=watch)
            if mode=='phone-portrait':page.set_viewport_size({'width':390,'height':844})
            walk_to(page,target,touch=mode!='desktop');shot(page,mode+'/boundary-comparison',result,strict=not args.before)
            if not args.before:
                if mode!='desktop':moving_probe(page,result,mode+' live movement-jump-landing')
                page.keyboard.press('p');shot(page,mode+'/paused',result);stable(page,result,mode+' paused viewport dock')
                for size in [{'width':844,'height':390},{'width':390,'height':844},{'width':1280,'height':720}]:
                    page.set_viewport_size(size);shot(page,mode+'/paused-resize-'+str(size['width']),result)
                    assert snapshot(page)['paused']
                page.keyboard.press('p');assert not snapshot(page)['paused']
            context.close()
        if not args.before and not args.fullscreen_only and not args.phone_fullscreen_probe and not args.phone_fullscreen_acceptance:
            context,page=create_page(browser,base,fixtures['food-shop'],touch=True,watch=watch)
            counter(page);shot(page,'phone-landscape/shop-dialogue',result);stable(page,result,'Dialogue keeps stable safe HUD')
            close_dialogue(page);page.set_viewport_size({'width':390,'height':844});counter(page);shot(page,'phone-portrait/shop-dialogue',result);close_dialogue(page)
            context.close()
        setup_context.close();browser.close()
      assert not result['errors'] and not result['httpFailures'],result
      result['passed']=True
    finally:
      (OUT/('before.json' if args.before else 'phone-fullscreen-results.json' if args.phone_fullscreen_acceptance else 'phone-fullscreen-probe.json' if args.phone_fullscreen_probe else 'fullscreen-results.json' if args.fullscreen_only else 'quick-results.json' if args.quick else 'results.json')).write_text(json.dumps(result,indent=2)+'\n');server.shutdown()
    print(json.dumps({'passed':True,'captures':len(result['captures']),'checks':len(result['checks']),'beforeOverlapCount':sum(c.get('overlap',{}).get('helmet',False) or c.get('overlap',{}).get('baby',False) for c in result['captures'])},indent=2))


if __name__=='__main__':main()
