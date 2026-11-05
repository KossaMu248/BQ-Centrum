"""Validate the extracted delivery on clean root and repository-subpath servers.

No donor, deployment or shared browser profile is used. Scene-load fixtures are
sealed by the production save factory and explicitly disclosed; this check does
not claim to replay the native ride/story route tested by centrum_complete_route.
"""
import argparse
import functools
import hashlib
import json
import math
import shutil
import statistics
import subprocess
import zipfile
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification/stage17/standalone'
EXPECTED_BUILD='BQ_CENTRUM_STAGE17'
WORK=OUT/'work'
SCENES=['metro-square','shopping-arcade','service-courtyard','food-shop','bicycle-workshop']
KEY='bq-centrum:scene-network:v1'
INSTRUMENT=r'''(()=>{
 const q=window.__standaloneQA={writes:[],reads:[],listenerCounts:{},loopFrames:0,pending:0,maxPending:0,frameTimes:[],last:null,audioContexts:0};
 const get=Storage.prototype.getItem,set=Storage.prototype.setItem;
 Storage.prototype.getItem=function(k){q.reads.push(k);return get.call(this,k);};
 Storage.prototype.setItem=function(k,v){q.writes.push(k);return set.call(this,k,v);};
 const nativeRAF=requestAnimationFrame.bind(window);
 window.requestAnimationFrame=function(fn){
   if(fn.name!=='loop')return nativeRAF(fn);
   q.pending++;q.maxPending=Math.max(q.maxPending,q.pending);
   return nativeRAF(t=>{q.pending--;q.loopFrames++;if(q.last!==null){q.frameTimes.push(t-q.last);if(q.frameTimes.length>360)q.frameTimes.shift();}q.last=t;return fn(t);});
 };
 const add=EventTarget.prototype.addEventListener;
 EventTarget.prototype.addEventListener=function(type,fn,options){if(this===window||this===document){const k=(this===window?'window':'document')+':'+type;q.listenerCounts[k]=(q.listenerCounts[k]||0)+1;}return add.call(this,type,fn,options);};
 if(window.AudioContext){const Native=window.AudioContext;window.AudioContext=new Proxy(Native,{construct(target,args){q.audioContexts++;return Reflect.construct(target,args);}});}
})();'''


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass


def file_hash(path):
    digest=hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda:stream.read(1024*1024),b''):digest.update(chunk)
    return digest.hexdigest()


def percentile(values,p):
    if not values:return None
    x=sorted(values);return round(x[min(len(x)-1,math.ceil(p*len(x))-1)],3)


def metrics(page):
    q=page.evaluate('window.__standaloneQA')
    values=q.pop('frameTimes');q.pop('last',None)
    q['frameTimeMs']={'samples':len(values),'median':round(statistics.median(values),3) if values else None,'p95':percentile(values,.95),'maximum':round(max(values),3) if values else None}
    q['writes']=sorted(set(q['writes']));q['reads']=sorted(set(q['reads']))
    return q


def ready(page):
    page.wait_for_function('window.BEARLY_STARTUP?.().firstFrameAt!==null&&window.BearlyCentrumInventory?.audit().bound',timeout=60000)


def inventory_layout(page):
    return page.evaluate(r'''()=>{
      const audit=BearlyCentrumInventory.audit(),hud=document.querySelector('.centrum-health-hud'),canvas=document.querySelector('#game'),fit=getComputedStyle(canvas),wallet=document.querySelector('.inventory-wallet');
      return{layout:audit.layout,health:audit.health,food:audit.food,wallet:audit.wallet,quest:BearlyQuests.wrongEntrance.snapshot(),rewardClaims:BearlyCentrumSave.adventure.snapshot().rewardClaims,browsing:audit.browsing,canvasFit:{objectFit:fit.objectFit,objectPosition:fit.objectPosition,rectangle:canvas.getBoundingClientRect().toJSON()},
        sceneDock:hud.hasAttribute('data-scene-dock'),scenePanel:document.querySelector('.centrum-inventory-panel').hasAttribute('data-scene-float'),sceneEating:document.querySelector('.inventory-eating').hasAttribute('data-scene-float'),
        healthRowVisible:!hud.hidden,heartCount:hud.querySelectorAll('.foot-heart').length,oldBagButtons:document.querySelectorAll('#inventoryOpenBtn').length,walletVisible:!!wallet.getBoundingClientRect().width&&!!wallet.getBoundingClientRect().height};
    }''')


def camera_projection(page):
    sample=page.evaluate(r'''()=>{
      const square=BearlyCentrumSquare.audit();
      return{camera:square.camera,context:BearlyCentrumSquare.inventoryContext(),
        logicalHeight:square.height,heroHeight:square.hero.height,nativeBabyScale:square.hero.babyFace.uniformScale};
    }''')
    camera=sample['camera'];context=sample['context']
    assert context['active'] and sample['logicalHeight']==sample['heroHeight']==context['height']==200,sample
    assert math.isclose(camera['zoom'],.75,abs_tol=1e-9),sample
    assert math.isclose(context['projectionScale'],.75,abs_tol=1e-9),sample
    assert math.isclose(context['projectedHeight'],150,abs_tol=1e-9),sample
    assert math.isclose(sample['nativeBabyScale'],.5710830421929589,rel_tol=1e-9),sample
    assert math.isclose(camera['width']*camera['zoom'],1160,abs_tol=1e-9),sample
    assert math.isclose(camera['height']*camera['zoom'],640,abs_tol=1e-9),sample
    assert math.isclose(context['screenX'],(context['x']-camera['x'])*camera['zoom'],abs_tol=1e-9),sample
    assert math.isclose(context['screenY'],(context['y']-camera['y'])*camera['zoom'],abs_tol=1e-9),sample
    assert math.isclose(context['projectedJump'],context['jump']*camera['zoom'],abs_tol=1e-9),sample
    return sample


def open_bag(page,touch):
    if touch:
        mode=page.evaluate('BearlyCentrumEconomy.context().mode')
        gear='.square-settings' if mode=='centrum' else '.area-settings' if mode=='source-foot' else '.ride-settings'
        page.locator(gear).tap();page.locator('#debugPanel').wait_for(state='visible');page.locator('#inventoryMenuBtn').tap()
    else:page.keyboard.press('i')
    page.wait_for_function('BearlyCentrumInventory.isBrowsing()&&!BEARLY_DEBUG_MENU.isOpen()')


def verify_scene_bag(page,touch):
    arrival=page.evaluate('BearlyCentrumStory.audit().dialogue')
    if arrival['open']:
        # Fresh food-shop arrival intentionally opens the baby's discovery
        # exchange. I must refuse browsing until that exchange is closed.
        assert arrival['target']=='discovery',arrival
        blocked=inventory_layout(page);page.keyboard.press('i')
        assert not page.evaluate('BearlyCentrumInventory.isBrowsing()')
        message=page.locator('.inventory-feedback').inner_text()
        assert message=='Finish the current interaction before opening the bag.',message
        close=page.locator('[data-dialogue-close]');close.tap() if touch else close.click()
        page.wait_for_function('!BearlyCentrumStory.blocking()')
        cleared=inventory_layout(page)
        for key in ['health','food','wallet','quest','rewardClaims']:assert cleared[key]==blocked[key],(key,blocked,cleared)
        arrival={'target':arrival['target'],'blockedUntilNativeClose':True,'notification':message,'stateUnchanged':True}
    else:arrival=None
    before=inventory_layout(page)
    assert before['layout'] and before['layout']['clear'] and before['sceneDock'],before
    assert before['heartCount']==5 and before['oldBagButtons']==0 and not before['walletVisible'],before
    if touch:assert before['canvasFit']['objectFit']=='cover',before
    open_bag(page,touch);opened=inventory_layout(page)
    for key in ['health','food','wallet','quest','rewardClaims']:assert opened[key]==before[key],(key,before,opened)
    assert opened['layout'] and opened['layout']['clear'] and opened['walletVisible'],opened
    close=page.locator('#inventoryCloseBtn');close.tap() if touch else close.click()
    page.wait_for_function('!BearlyCentrumInventory.isBrowsing()');closed=inventory_layout(page)
    for key in ['health','food','wallet','quest','rewardClaims']:assert closed[key]==before[key],(key,before,closed)
    assert closed['layout'] and closed['layout']['clear'] and not closed['walletVisible'],closed
    return{'arrivalDialogue':arrival,'before':before,'opened':opened,'closed':closed,'nativeOpenClose':True,'healthUnchanged':True,'foodUnchanged':True,'questAndRewardsUnchanged':True}


def verify_square_walk(page,touch):
    samples=[]
    for key,direction,axis,sign in [('ArrowRight','right','x',1),('ArrowLeft','left','x',-1),('ArrowUp','up','y',-1),('ArrowDown','down','y',1)]:
        before=page.evaluate('BearlyCentrumSquare.audit()')
        if touch:
            button=page.locator('[data-square-dir="'+direction+'"]');box=button.bounding_box();assert box
            session=page.context.new_cdp_session(page)
            session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}]})
        else:page.keyboard.down(key)
        page.wait_for_timeout(450);moving=page.evaluate('BearlyCentrumSquare.audit()')
        if touch:session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});session.detach()
        else:page.keyboard.up(key)
        assert (moving[axis]-before[axis])*sign>4,(direction,before,moving)
        hero=moving['hero'];assert hero['height']==200 and hero['integratedCarrier'] and hero['babyFace']['continuousUpperBody'] and hero['babyFace']['originalCollar']
        if direction in ['up','down']:
            expected='away' if direction=='up' else 'toward'
            assert hero.get('view')==expected and hero.get('authoredView') is True,(direction,hero)
            assert 'assets/centrum/actors/' in hero.get('sourceAsset',''),hero
            directional=hero.get('directional',{})
            assert directional.get('sourceBabyLower')=='assets/art/front-carrier-v7.png',hero
            assert math.isclose(directional.get('sourceBabyLowerScale',0),200/488,rel_tol=1e-9),hero
            assert math.isclose(directional.get('sourceBabyOriginalScale',0),.5710830421929589,rel_tol=1e-9),hero
            assert math.isclose(hero['babyFace']['uniformScale'],.5710830421929589,rel_tol=1e-9),hero
        assert moving['health']==73 and page.evaluate('BearlyCentrumLink.audit().ownership.bicycles')==1
        samples.append({'direction':direction,'nativeInput':'touch hold' if touch else 'keyboard hold','position':{k:moving[k] for k in ['x','y','face','weight','groundMotion']},'hero':hero,'cameraProjection':camera_projection(page),'raster':page.evaluate('BearlyHeroRig.centrumCacheStats()')})
        page.wait_for_timeout(180)
    return samples


def fixture(page,scene_id):
    return page.evaluate(r'''id=>{
      const K='bq-centrum:scene-network:v1',P='bq-centrum:parking:v1';
      const scene=BearlyCentrumScenes.get(id),entranceId=scene.defaultEntrance,position={sceneId:id,entranceId,...scene.anchors[entranceId]};
      const adventure={started:false,lunch:false,kit:false,delivered:false,repaired:false,chart:false,voyage:false,garden:false,buoys:[],seeds:[]};
      const progress={collectedPickups:[],score:0,bonus:0,maxDist:11407.047949269978,seconds:0,checkpoint:0,panic:0,trickHazards:[],oneTime:[],lostParts:[]};
      // Recorded valid terrain anchor from prior actual production parking.
      const parked={x:11407.047949269978,y:1186.387101835366};
      const parking={schemaVersion:1,routeId:'autumn-main',routeSceneId:'route:autumn-main',entryId:'centrum-stop',bikeId:'centrum-family-bike',phase:'exploring',parked,
        remount:{sceneId:'metro-square',anchorId:'bicycle-parking'},health:73,adventure,routeProgress:progress,exploration:position};
      const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
      data.set(K,JSON.stringify({schemaVersion:1,layoutVersion:3,gateOpened:false,discovered:['metro-square'],position,inventory:{billys:0}}));data.set(P,JSON.stringify(parking));
      const broker=BearlyCentrumSave.createAdventure(storage),route={...BearlyCentrumLink.audit().route,x:parked.x,y:parked.y,speed:0,grounded:true,health:73,adventure,routeProgress:progress};
      const result=broker.syncSession({health:73,mode:'exploring',route,exploration:position});if(!result.ok)throw Error(result.reason);broker.checkpoint('standalone-scene-load-fixture');
      return{raw:data.get(K),position};
    }''',scene_id)


def open_page(browser,url,touch,watch,prepared=None):
    context=browser.new_context(viewport={'width':844 if touch else 1280,'height':390 if touch else 720},is_mobile=touch,has_touch=touch,device_scale_factor=1)
    context.add_init_script(INSTRUMENT)
    if prepared:context.add_init_script('localStorage.setItem('+json.dumps(KEY)+','+json.dumps(prepared['raw'])+');')
    page=context.new_page();watch(page)
    page.goto(url,wait_until='domcontentloaded');ready(page)
    if prepared:page.wait_for_function("BearlyCentrumLink.audit().phase==='exploring'&&BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading",timeout=60000)
    return context,page


def extract_package(package):
    if WORK.exists():shutil.rmtree(WORK)
    WORK.mkdir(parents=True)
    with zipfile.ZipFile(package) as archive:
        for member in archive.infolist():
            path=Path(member.filename)
            assert not path.is_absolute() and '..' not in path.parts,member.filename
            assert not any(p in {'.git','.baseline','__pycache__','node_modules'} or p.startswith('.') and p!='.nojekyll' for p in path.parts),member.filename
        archive.extractall(WORK)
    runtime=WORK/'BQ-Centrum'
    manifest=json.loads((runtime/'PACKAGE_MANIFEST.json').read_text())
    with zipfile.ZipFile(package) as archive:
        expected={'BQ-Centrum/'+name for name in manifest['files']}|{'BQ-Centrum/PACKAGE_MANIFEST.json','BQ-Centrum/PACKAGE_CONTENTS.md'}
        assert set(archive.namelist())==expected,'Unlisted or missing archive payload'
    for name,digest in manifest['files'].items():assert hashlib.sha256((runtime/name).read_bytes()).hexdigest()==digest,name
    assert (runtime/'index.html').read_bytes()==(runtime/'autumn-v19.html').read_bytes()
    assert all((runtime/p).exists() for p in ['assets','css','js','SOURCE_BASELINE.md','README.md'])
    assert len(list(runtime.glob('*.html')))==2
    return runtime,manifest


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--package',default='delivery/BQ-Centrum-validated.zip');parser.add_argument('--keep-extracted',action='store_true');args=parser.parse_args()
    package=(ROOT/args.package).resolve();assert package.is_relative_to(ROOT)
    OUT.mkdir(parents=True,exist_ok=True)
    result={'scope':'Extracted standalone delivery, clean local root and /BQ-Centrum/ repository subpath','conditions':{'browser':'system Chromium /usr/bin/chromium, headless','desktopViewport':[1280,720],'phoneEmulationViewport':[844,390],'physicalDevices':False,'sceneFixtures':'Production-factory sealed named-entrance/parking fixtures; primary native route is a separate test.'},'checks':[],'errors':[],'consoleErrors':[],'httpFailures':[],'serverHttpFailures':[],'serverOutsideSubpathRequests':[],'externalRequests':[],'outsideSubpathRequests':[],'limits':['Chromium emulation is not physical iPhone/Safari testing.','Frame times were sampled on this shared container and are not physical-device performance promises.']}
    result['testedArchiveSha256']=file_hash(package)
    runtime,manifest=extract_package(package)
    assert json.loads((runtime/'autumn-version.json').read_text())['edition']==EXPECTED_BUILD,'Archive is not the intended Stage17 build'
    assert (runtime/'css/centrum-route.css').is_file(),'Copied-street hint stylesheet is missing'
    for entry in ['index.html','autumn-v19.html']:
        assert 'css/centrum-route.css?edition=centrum-stage16' in (runtime/entry).read_text(),'Alias omitted current route stylesheet'
    integrity=subprocess.run(['python3','tools/verify-source-integrity.py'],cwd=runtime,capture_output=True,text=True)
    assert integrity.returncode==0,integrity.stdout+integrity.stderr
    result['extractedSourceIntegrity']=integrity.stdout.strip()
    result['packageFilesVerified']=len(manifest['files']);result['runtimeHashes']={k:v for k,v in manifest['files'].items() if k.startswith(('js/','css/','assets/')) or k in ['index.html','autumn-v19.html','autumn-version.json']}
    servers=[]
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        result['conditions']['browserVersion']=browser.version
        result['conditions']['systemPathFirefoxExecutable']=shutil.which('firefox')
        result['conditions']['engineScope']='This archive run uses system Chromium only; Firefox and Linux WebKit evidence is separate.'
        for subpath in [False,True]:
          directory=WORK if subpath else runtime;prefix='/BQ-Centrum/' if subpath else '/'
          class RecordedHandler(Quiet):
            expected_prefix=prefix
            def log_request(self,code='-',size='-'):
              if isinstance(code,int) and code>=400:result['serverHttpFailures'].append({'path':self.path,'status':code})
              if not urlparse(self.path).path.startswith(self.expected_prefix):result['serverOutsideSubpathRequests'].append(self.path)
          server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(RecordedHandler,directory=str(directory)));Thread(target=server.serve_forever,daemon=True).start();servers.append(server)
          base=f'http://127.0.0.1:{server.server_port}'
          request_urls=[]
          def watch(page):
            page.on('pageerror',lambda e:result['errors'].append(str(e)))
            page.on('console',lambda message:result['consoleErrors'].append({'text':message.text,'location':message.location}) if message.type=='error' else None)
            page.on('response',lambda r:result['httpFailures'].append({'status':r.status,'url':r.url}) if r.status>=400 else None)
            def requested(request):
              url=request.url
              if url.startswith(('data:','blob:')):return
              request_urls.append(url)
              if not url.startswith(base+'/'):result['externalRequests'].append(url)
              elif not urlparse(url).path.startswith(prefix):result['outsideSubpathRequests'].append(url)
            page.on('request',requested)
          for touch in [False,True]:
            label=('subpath' if subpath else 'root')+'-'+('phone-emulation' if touch else 'desktop')
            print('Standalone '+label,flush=True)
            context,page=open_page(browser,base+prefix+'index.html',touch,watch)
            page.locator('#introStart').click();page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'",timeout=60000)
            assert page.evaluate("BearlyCentrumCamera.routeZoom===1&&BearlyCentrumCamera.routeFrame(1160,640,true).zoom===1.35&&[...document.styleSheets].some(s=>s.href?.includes('/css/centrum-route.css?edition=centrum-stage16'))"),'Current route camera/stylesheet failed to load'
            page.wait_for_timeout(700);start=page.evaluate('BEARLY_TOUCH_STATUS().x')
            if touch:
              button=page.locator('.touch-controls [data-key="ArrowUp"]');box=button.bounding_box();assert box
              session=context.new_cdp_session(page);session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}]});page.wait_for_timeout(650);session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});session.detach()
            else:page.keyboard.down('ArrowUp');page.wait_for_timeout(650);page.keyboard.up('ArrowUp')
            assert page.evaluate('BEARLY_TOUCH_STATUS().x')>start+1
            page.keyboard.down('ArrowDown');page.wait_for_timeout(500);page.keyboard.up('ArrowDown');page.wait_for_timeout(700)
            riding_layout=inventory_layout(page)
            assert riding_layout['layout'] is None and not any(riding_layout[k] for k in ['sceneDock','scenePanel','sceneEating']),riding_layout
            assert riding_layout['heartCount']==5 and riding_layout['oldBagButtons']==0 and not riding_layout['walletVisible'],riding_layout
            open_bag(page,touch);page.keyboard.press('i');assert not page.evaluate('BearlyCentrumInventory.isBrowsing()')
            templates={scene_id:fixture(page,scene_id) for scene_id in SCENES}
            sample=metrics(page);assert sample['maxPending']<=1 and sample['loopFrames']>10,sample
            assert all(k.startswith('bq-centrum:') for k in sample['reads']+sample['writes']),sample
            page.screenshot(path=str(OUT/(label+'-ride.jpg')),type='jpeg',quality=94)
            result['checks'].append({'name':label+' fresh startup and actual pedal input','passed':True,'startup':page.evaluate('BEARLY_STARTUP()'),'ridingInventoryLayout':riding_layout,'metrics':sample})
            context.close()
            for scene_id in SCENES:
              context,page=open_page(browser,base+prefix+'index.html',touch,watch,templates[scene_id]);page.wait_for_timeout(700)
              a=page.evaluate('BearlyCentrumSquare.audit()');assert a['sceneId']==scene_id and a['height']==200 and a['health']==73,a
              assert a['hero']['babyFace']['continuousUpperBody'] and a['hero']['babyFace']['originalCollar'] and not a['hero']['babyFace']['headOnly']
              projection=camera_projection(page)
              assert page.evaluate('BearlyCentrumLink.audit().ownership.bicycles')==1
              scenery=page.evaluate('window.BearlyCentrumScenery?.audit()||null')
              assert scenery and not scenery['errors'] and scenery['loops']==0,scenery
              required={'metro-square':['gate'],'shopping-arcade':['passage'],'service-courtyard':['gate','cage']}.get(scene_id,[])
              for kind in required:assert scenery['files'][kind]['ready'],(scene_id,kind,scenery)
              bag=verify_scene_bag(page,touch)
              walking=verify_square_walk(page,touch) if scene_id=='metro-square' else None
              sample=metrics(page);assert sample['maxPending']<=1 and sample['loopFrames']>5
              assert all(k.startswith('bq-centrum:') for k in sample['reads']+sample['writes']),sample
              result['checks'].append({'name':label+' '+scene_id+' scene load and native bag interaction','passed':True,'health':a['health'],'hero':a['hero'],'cameraProjection':projection,'scenery':scenery,'inventory':bag,'walking':walking,'metrics':sample})
              if scene_id in ['metro-square','food-shop']:page.screenshot(path=str(OUT/(label+'-'+scene_id+'.jpg')),type='jpeg',quality=94)
              context.close()
            # Active alias entry is tested separately without borrowed browser state.
            context,page=open_page(browser,base+prefix+'autumn-v19.html',touch,watch)
            assert page.evaluate('BEARLY_BUILD_ID')==EXPECTED_BUILD
            result['checks'].append({'name':label+' active manifest HTML alias','passed':True});context.close()
          result.setdefault('requestCounts',{})['subpath' if subpath else 'root']=len(request_urls)
        browser.close()
      assert not result['errors'],result['errors'];assert not result['consoleErrors'],result['consoleErrors'];assert not result['httpFailures'],result['httpFailures'];assert not result['serverHttpFailures'],result['serverHttpFailures'];assert not result['serverOutsideSubpathRequests'],result['serverOutsideSubpathRequests'];assert not result['externalRequests'],result['externalRequests'];assert not result['outsideSubpathRequests'],result['outsideSubpathRequests']
      result['passed']=True
    except BaseException as error:
      result['passed']=False;result['failure']=repr(error);raise
    finally:
      for server in servers:server.shutdown()
      (OUT/'results.json').write_text(json.dumps(result,indent=2)+'\n')
      if result.get('passed'):
        audit=json.loads((OUT/'package-audit.json').read_text())
        assert audit['sha256']==result['testedArchiveSha256']==file_hash(package),'Archive changed during validation'
        certificate={'package':audit,'standaloneValidation':result,'certificateScope':'External certificate for the delivered ZIP; no stale certificate is embedded in the archive itself.'}
        (ROOT/'delivery/BQ-Centrum-validated.validation.json').write_text(json.dumps(certificate,indent=2)+'\n')
      (OUT/'frames.sha256').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in sorted(OUT.glob('*.jpg'))))
      if not args.keep_extracted:shutil.rmtree(WORK)
    print('PASS:',len(result['checks']),'extracted package root/subpath checks; no JS/HTTP/external-path errors.',flush=True)


if __name__=='__main__':main()
