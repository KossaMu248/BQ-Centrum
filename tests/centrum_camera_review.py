"""Actual 0.75 camera framing, native movement and original-baby review.

One disclosed debug route-stop setup per desktop/touch context is followed by
native parking, movement, physical doors through all five scenes and same-bike
return. No scene teleport, save fixture, health or item grant follows setup.
Canvas draw matrices independently measure the projected scale; normal PNGs
still require visual review. Chromium touch emulation is not a physical phone.
"""
import argparse
import base64
import functools
import hashlib
import json
import math
import shutil
import subprocess
import traceback
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
import centrum_economy_browser as E
from centrum_standalone import INSTRUMENT, metrics

ROOT = Path(__file__).resolve().parents[1]
PROBE = r'''(()=>{
 const probe=window.__cameraReview={hero:null,baby:null,inHero:false};
 let rig;Object.defineProperty(window,'BearlyHeroRig',{configurable:true,get:()=>rig,set:value=>{
  rig=value;const original=value.draw;value.draw=function(c,x,y,h,face,options){
   probe.hero={at:performance.now(),x,y,h,face,matrix:c.getTransform().toJSON(),canvas:{w:c.canvas.width,h:c.canvas.height}};
   probe.inHero=true;try{return original.apply(this,arguments);}finally{probe.inHero=false;}
  };
 }});
 const original=CanvasRenderingContext2D.prototype.drawImage;
 CanvasRenderingContext2D.prototype.drawImage=function(im,...a){
  if(this.canvas.id==='game'&&probe.inHero&&im?.dataset?.passengerPiece==='continuous-upper-body'){
   const [x,y]=a,m=this.getTransform(),w=im.width,h=im.height;
   probe.baby={at:performance.now(),matrix:m.toJSON(),source:im.dataset.sourceAsset,draw:{x,y,w,h},canvas:{w:this.canvas.width,h:this.canvas.height}};
  }
  return original.call(this,im,...a);
 };
})();'''
MEASURE = r'''()=>{
 const a=BearlyCentrumSquare.audit(),i=BearlyCentrumSquare.inventoryContext(),p=window.__cameraReview,canvas=document.querySelector('#game'),host=document.querySelector('.canvas-wrap'),box=canvas.getBoundingClientRect(),hb=host.getBoundingClientRect(),style=getComputedStyle(canvas);
 const positions=style.objectPosition.split(/\s+/).map(v=>parseFloat(v)/100),fit=style.objectFit;
 let sx=box.width/canvas.width,sy=box.height/canvas.height;if(fit==='cover'||fit==='contain')sx=sy=(fit==='cover'?Math.max:Math.min)(sx,sy);
 const ox=box.left+(box.width-canvas.width*sx)*(positions[0]??.5),oy=box.top+(box.height-canvas.height*sy)*(positions[1]??.5);
 const mapped=(m,x,y)=>({x:ox+(m.a*x+m.c*y+m.e)*sx,y:oy+(m.b*x+m.d*y+m.f)*sy});
 const bounds=points=>({left:Math.min(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),right:Math.max(...points.map(p=>p.x)),bottom:Math.max(...points.map(p=>p.y))});
 const sourceFrame=Object.values(BearlyBabyPassenger.frames()).find(f=>f.file===p.baby.source),head=sourceFrame.head,d=p.baby.draw,m=p.baby.matrix;
 const babyHead=bounds([[head[0],head[1]],[head[0]+head[2],head[1]],[head[0]+head[2],head[1]+head[3]],[head[0],head[1]+head[3]]].map(([x,y])=>mapped(m,d.x+x,d.y+y)));
 const headHeight=Math.hypot(m.c/(p.baby.canvas.w/1160),m.d/(p.baby.canvas.h/640))*head[3];
 const zoomFromHero={x:Math.hypot(p.hero.matrix.a/(p.hero.canvas.w/1160),p.hero.matrix.b/(p.hero.canvas.h/640)),y:Math.hypot(p.hero.matrix.c/(p.hero.canvas.w/1160),p.hero.matrix.d/(p.hero.canvas.h/640))};
 const zoomFromBaby={x:Math.hypot(m.a/(p.baby.canvas.w/1160),m.b/(p.baby.canvas.h/640))/a.hero.babyFace.uniformScale,y:Math.hypot(m.c/(p.baby.canvas.w/1160),m.d/(p.baby.canvas.h/640))/a.hero.babyFace.uniformScale};
 const rect=selector=>{const e=document.querySelector(selector);if(!e||e.hidden)return null;const r=e.getBoundingClientRect();return r.width&&r.height?{left:r.left,top:r.top,right:r.right,bottom:r.bottom}:null;};
 const cstyle=getComputedStyle(canvas),logicalSX=box.width/1160,logicalSY=box.height/640,logicalScale=fit==='contain'?Math.min(logicalSX,logicalSY):Math.max(logicalSX,logicalSY);
 const inventory=BearlyCentrumInventory.audit();
 return {build:BEARLY_BUILD_ID,sceneId:a.sceneId,position:{x:a.x,y:a.y,jump:a.jump},camera:a.camera,height:a.height,hero:a.hero,health:a.health,inventory,context:i,world:a.world,shadow:a.shadow,ownership:BearlyCentrumLink.audit().ownership,fullscreen:BearlyFullscreen.state(),viewport:{w:innerWidth,h:innerHeight},host:hb.toJSON(),fit:cstyle.objectFit,pan:cstyle.objectPosition,babyHead,babyNativeHead:head,headHeightInLogicalCanvas:headHeight,headHeightCss:babyHead.bottom-babyHead.top,zoomFromHero,zoomFromBaby,paintAge:performance.now()-p.baby.at,rects:{hud:rect('.centrum-health-hud'),bag:rect('.centrum-inventory-panel'),dialogue:rect('.centrum-dialogue')},logicalCssScale:logicalScale};
}'''


def overlap(a, b):
    return bool(a and b and min(a['right'], b['right']) > max(a['left'], b['left']) and min(a['bottom'], b['bottom']) > max(a['top'], b['top']))


def measure(page):
    page.wait_for_function('window.__cameraReview?.baby&&window.BearlyCentrumSquare?.active()&&!BearlyCentrumSquare.audit().loading')
    page.wait_for_timeout(110)
    s = page.evaluate(MEASURE)
    assert s['height'] == s['hero']['height'] == 200
    assert math.isclose(s['camera']['zoom'], .75, abs_tol=1e-10), s['camera']
    for result in [s['zoomFromHero'], s['zoomFromBaby']]:
        assert all(math.isclose(v, .75, abs_tol=1e-6) for v in result.values()), result
    b = s['hero']['babyFace']
    assert b['continuousUpperBody'] and b['originalCollar'] and not b['headOnly']
    assert math.isclose(b['uniformScale'], .5710830421929589, abs_tol=1e-9)
    assert math.isclose(s['headHeightInLogicalCanvas'] / b['headHeight'], .75, abs_tol=1e-6)
    assert s['headHeightCss'] >= 17, ('Baby is too small for this review threshold; numeric size is not a visual likeness verdict', s)
    assert s['paintAge'] < 1000
    assert s['inventory']['layout']['clear'] and not overlap(s['babyHead'], s['rects']['hud']), s
    if s['inventory']['browsing']:
        assert not overlap(s['babyHead'], s['rects']['bag']), s
    assert s['shadow']['x'] == s['position']['x'] and s['shadow']['y'] == s['position']['y']
    return s


def capture(page, out, name, report):
    s = measure(page);p = out / (name + '.png');p.parent.mkdir(parents=True, exist_ok=True);page.screenshot(path=str(p))
    report['captures'].append({'file':p.relative_to(out).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'actualGameplay':True,'state':s})
    return s


def tap(page, selector, touch):
    page.locator(selector).tap() if touch else page.locator(selector).click()


class Recording:
    def __init__(self,page,out):
        self.active=True;self.frames=[];self.out=out;self.folder=out/'.phone-frames';self.folder.mkdir(exist_ok=True);self.session=page.context.new_cdp_session(page)
        self.session.on('Page.screencastFrame',self.frame);self.session.send('Page.startScreencast',{'format':'jpeg','quality':82,'maxWidth':844,'maxHeight':390,'everyNthFrame':2})
    def frame(self,event):
        if not self.active:return
        p=self.folder/f'{len(self.frames):05d}.jpg';p.write_bytes(base64.b64decode(event['data']));self.frames.append((p,event['metadata']['timestamp']));self.session.send('Page.screencastFrameAck',{'sessionId':event['sessionId']})
    def finish(self):
        self.active=False;self.session.remove_listener('Page.screencastFrame',self.frame);self.session.send('Page.stopScreencast');self.session.detach();assert len(self.frames)>20
        lines=[]
        for (p,a),(_,b) in zip(self.frames,self.frames[1:]):lines += [f"file '{p.resolve()}'",f'duration {max(.001,b-a):.6f}']
        lines.append(f"file '{self.frames[-1][0].resolve()}'");listing=self.folder/'frames.txt';listing.write_text('\n'.join(lines)+'\n');dest=self.out/'phone-native-walking.webm'
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-r','24','-c:v','libvpx-vp9','-cpu-used','4','-threads','2','-crf','30','-b:v','0','-pix_fmt','yuv420p',str(dest)],check=True)
        result={'file':dest.name,'nativeSeconds':self.frames[-1][1]-self.frames[0][1],'frames':len(self.frames),'playbackSpeed':1,'encodingFps':24,'gameFpsClaim':False,'actualGameplay':True,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()};shutil.rmtree(self.folder);return result


def held_sample(page, key, direction, ms, touch, capture_held=None):
    if touch:
        session=page.context.new_cdp_session(page);b=page.locator('[data-square-dir="'+direction+'"]').bounding_box()
        session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':b['x']+b['width']/2,'y':b['y']+b['height']/2}]})
    else:page.keyboard.down(key)
    try:
        page.wait_for_timeout(ms)
        if capture_held:capture_held()
        return E.sq(page)
    finally:
        if touch:session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});session.detach()
        else:page.keyboard.up(key)


def square_geometry(page, touch, out, label, report):
    samples=[]
    for name,point in [('east-crossing',{'x':1370,'y':890}),('west-crossing',{'x':110,'y':890})]:
        E.walk_to(page,point,touch);s=capture(page,out,label+'/'+name,report);bounds=s['camera']['bounds']
        assert bounds['left']-1e-8<=s['camera']['x']<=bounds['right']+1e-8 and bounds['top']-1e-8<=s['camera']['y']<=bounds['bottom']+1e-8
        samples.append({'name':name,'position':s['position'],'camera':s['camera']})
    assert samples[0]['position']['x']-samples[1]['position']['x']>1200
    E.walk_to(page,{'x':500,'y':530},touch);behind=capture(page,out,label+'/behind-bench',report);order=E.sq(page)['drawOrder'];ids=[n['id'] for n in order];assert ids.index('player')<ids.index('bench-west')
    blocked=held_sample(page,'ArrowDown','down',850,touch);assert blocked['y']<=544.1 and 'bench-west' in blocked['hits'],blocked
    page.wait_for_timeout(200);E.walk_to(page,{'x':500,'y':625},touch);front=capture(page,out,label+'/front-of-bench',report);ids=[n['id'] for n in E.sq(page)['drawOrder']];assert ids.index('player')>ids.index('bench-west')
    tap(page,'.square-jump',True) if touch else page.keyboard.press('Space');page.wait_for_timeout(170);air=capture(page,out,label+'/jump-shadow',report);assert air['position']['jump']>20 and air['shadow']['y']==air['position']['y'];assert next(n['footY'] for n in E.sq(page)['drawOrder'] if n['id']=='player')==air['position']['y'];page.wait_for_timeout(750)
    report['checks'].append({'name':label+' full square crossings, bounded camera, solid bench, front/behind order and jump-floor anchor','passed':True,'crossings':samples,'collision':{k:blocked[k] for k in ['x','y','hits']},'beforeY':behind['position']['y'],'frontY':front['position']['y']})


def movement(page, touch, report, out, label):
    samples=[]
    for key,direction,axis,sign,view in [('ArrowRight','right','x',1,None),('ArrowLeft','left','x',-1,None),('ArrowUp','up','y',-1,'away'),('ArrowDown','down','y',1,'toward')]:
        def held_view():
            if view:
                s=capture(page,out,label+'/moving-'+view,report);assert s['hero']['babyFace']['mood']==('leanForward' if view=='away' else 'leanBack') and s['hero']['gait']['weight']>.9 if 'weight' in s['hero']['gait'] else s['hero']['babyFace']['mood']==('leanForward' if view=='away' else 'leanBack')
        before=E.sq(page);moving=held_sample(page,key,direction,500,touch,held_view);page.wait_for_timeout(180);after=E.sq(page)
        assert (after[axis]-before[axis])*sign>8 and not after['hits'],(direction,before,after)
        if view:assert after['view']==after['hero']['view']==view and after['hero']['authoredView']
        samples.append({'direction':direction,'before':{k:before[k] for k in ['x','y']},'after':{k:after[k] for k in ['x','y','view']}})
    before=E.sq(page)
    if touch:
        session=page.context.new_cdp_session(page);points=[]
        for direction in ['right','down']:
            b=page.locator('[data-square-dir="'+direction+'"]').bounding_box();points.append({'x':b['x']+b['width']/2,'y':b['y']+b['height']/2,'id':len(points)})
        session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':points});page.wait_for_timeout(500);session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});session.detach()
    else:
        page.keyboard.down('ArrowRight');page.keyboard.down('ArrowDown');page.wait_for_timeout(500);page.keyboard.up('ArrowRight');page.keyboard.up('ArrowDown')
    page.wait_for_timeout(350);after=E.sq(page);assert after['x']>before['x']+12 and after['y']>before['y']+6 and not after['hits']
    assert after['view']==after['hero']['view']=='toward'
    report['checks'].append({'name':('CDP touch' if touch else 'keyboard')+' cardinal/diagonal motion and retained authored views','passed':True,'samples':samples,'diagonal':{'dx':after['x']-before['x'],'dy':after['y']-before['y']}})


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--out',default='verification/stage15/camera');parser.add_argument('--touch-only',action='store_true');parser.add_argument('--desktop-only',action='store_true');args=parser.parse_args()
    out=(ROOT/args.out).resolve();assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
    runtime_paths=sorted([*ROOT.glob('*.html'),ROOT/'autumn-version.json',*ROOT.glob('js/*.js'),*ROOT.glob('css/*.css')]);hashes=lambda:{p.relative_to(ROOT).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in runtime_paths}
    report={'scope':__doc__,'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'runtimeHashes':hashes(),'conditions':{'headless':True,'physicalDevice':False,'desktop':[1280,720],'phoneLandscapeEmulation':[844,390],'deviceScaleFactor':1,'pixelMeasurement':'Actual production Hero draw and original tagged baby Canvas affine matrices; no generated illustrations. Canvas matrix scale tolerance1e-6 covers observed float32 rounding (~3.5e-8); logical/native JS invariants remain strict.','fixture':'One original debug route stop per context, then actual native parking/movement/doors/return; fresh health100 does not establish absence of a capped heal.'},'checks':[],'captures':[],'errors':[],'consoleErrors':[],'httpFailures':[],'recordings':[]}
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(E.Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);report['browser']=browser.version
            for touch in ([True] if args.touch_only else [False] if args.desktop_only else [False,True]):
                label='phone-landscape' if touch else 'desktop';size={'width':844,'height':390} if touch else {'width':1280,'height':720}
                context=browser.new_context(viewport=size,is_mobile=touch,has_touch=touch,device_scale_factor=1);context.add_init_script(INSTRUMENT);context.add_init_script(PROBE)
                page=context.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)));page.on('console',lambda m:report['consoleErrors'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:report['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
                page.goto(f'http://127.0.0.1:{server.server_port}/index.html');E.wait_ready(page);tap(page,'#introStart',touch);page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'")
                page.evaluate('BEARLY_DEBUG_MENU.warp(7550)');page.wait_for_timeout(300)
                if touch:page.locator('#centrumRouteEntryBtn').wait_for(state='visible');page.locator('#centrumRouteEntryBtn').tap()
                else:page.keyboard.press('e')
                E.wait_exploration(page);E.close_dialogue(page)
                parked=page.evaluate('BearlyCentrumLink.audit().parking');start_health=E.health(page);capture(page,out,label+'/square-arrival',report)
                recording=Recording(page,out) if touch else None
                movement(page,touch,report,out,label)
                if recording:report['recordings'].append(recording.finish())
                capture(page,out,label+'/square-toward',report);square_geometry(page,touch,out,label,report)
                # I/menu browsing stays an on-demand panel clear of the original face.
                E.open_bag(page,touch);capture(page,out,label+'/bag',report);tap(page,'#inventoryCloseBtn',touch)
                tap(page,'#squarePauseBtn',touch);before=E.sq(page);E.hold(page,'ArrowRight',260,touch);assert E.sq(page)['x']==before['x']
                tap(page,'#squareFullscreenBtn',touch);page.wait_for_function("BearlyFullscreen.state()!=='window'");capture(page,out,label+'/paused-fullscreen',report)
                assert E.sq(page)['paused'];tap(page,'#squarePauseBtn',touch);tap(page,'#squareFullscreenBtn',touch);page.wait_for_function("BearlyFullscreen.state()==='window'")
                if touch:
                    page.set_viewport_size({'width':390,'height':844});capture(page,out,label+'/portrait-resize',report);E.open_bag(page,True);capture(page,out,label+'/portrait-bag',report);tap(page,'#inventoryCloseBtn',True);page.set_viewport_size(size);capture(page,out,label+'/landscape-return',report)
                report['checks'].append({'name':label+' actual0.75 Hero/baby draw scale, native200/child scale, pause/fullscreen/bag'+('/portrait resize' if touch else ''),'passed':True})
                # Actual doors only: enter both rooms and open the independent shortcut.
                visited=['metro-square']
                for destination in ['shopping-arcade','food-shop','shopping-arcade','bicycle-workshop','shopping-arcade','service-courtyard','metro-square']:
                    E.use_exit(page,destination,touch)
                    if destination=='food-shop' and page.locator('.centrum-dialogue').is_visible():
                        natural=capture(page,out,label+'/natural-billys-discovery',report);assert natural['hero']['babyFace']['mood']=='point'
                    E.close_dialogue(page);visited.append(destination);capture(page,out,label+'/'+str(len(visited))+'-'+destination,report)
                    assert E.health(page)==start_health
                assert E.sq(page)['save']['gateOpened'];assert page.evaluate('BearlyCentrumLink.audit().parking.parked')==parked['parked']
                report['checks'].append({'name':label+' native doors through all five existing scenes and courtyard shortcut','passed':True,'visited':visited,'health':start_health})
                if touch:tap(page,'.square-exit',True)
                else:page.keyboard.press('q')
                page.wait_for_function("BearlyCentrumLink.audit().phase==='riding'&&!BearlyCentrumSquare.active()",timeout=90000)
                a=page.evaluate('BearlyCentrumLink.audit()');assert a['ownership']['bicycles']==a['ownership']['passengers']==1 and a['route']['babyMounted'] and a['route']['grounded'] and all(abs(w['clearance'])<2 for w in a['route']['wheels'])
                assert E.health(page)==start_health and page.evaluate('BearlyCentrumInventory.audit().layout') is None
                q=metrics(page);assert q['maxPending']<=1 and all(k.startswith('bq-centrum:') for k in q['reads']+q['writes'])
                report['checks'].append({'name':label+' same-bike native remount/source UI reset, grounded wheels, one passenger/loop, namespaced storage','passed':True,'metrics':q,'route':a['route'],'ownership':a['ownership']});context.close()
            browser.close()
        assert not any(report[k] for k in ['errors','consoleErrors','httpFailures']),report
        report['passed']=True
    except BaseException as error:
        report['passed']=False;report['failure']=repr(error);report['traceback']=traceback.format_exc();raise
    finally:
        server.shutdown();report['runtimeHashesAfter']=hashes();report['changedRuntimeFiles']=[p for p,h in report['runtimeHashes'].items() if report['runtimeHashesAfter'].get(p)!=h];assert not report['changedRuntimeFiles'];(out/'results.json').write_text(json.dumps(report,indent=2)+'\n')
    print('PASS camera review',len(report['checks']),'groups',len(report['captures']),'actual captures')


if __name__=='__main__':main()
