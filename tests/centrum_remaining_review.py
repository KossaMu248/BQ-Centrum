"""Stage 9 rendered review of the existing five-scene prototype.

Prepared overviews use the production parking record/save factory and named
entrances. Every movement/collision/exit after that setup uses normal controls.
The fully earned, no-debug story/ride path remains the separate stage-8 proof.
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
import centrum_economy_browser as movement_helpers
from centrum_polish import create_page, prepare_save, snapshot, projection
from centrum_economy_browser import Quiet, wait_exploration, walk_to, hold, use_exit, close_dialogue

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification/stage9/gameplay'
SCENES=['metro-square','shopping-arcade','service-courtyard','food-shop','bicycle-workshop']


def move_axis(page,axis,target,touch=False):
    """Use the actual scene's depth speed; no state-changing test adapter."""
    speed=page.evaluate("window.BearlyCentrumDepthGait?.depthSpeed||155") if axis=='y' else 155
    for _ in range(24):
        delta=target-snapshot(page)[axis]
        if abs(delta)<=8:return
        key=('ArrowRight' if delta>0 else 'ArrowLeft') if axis=='x' else ('ArrowDown' if delta>0 else 'ArrowUp')
        hold(page,key,min(2400,max(60,abs(delta)/speed*1000-80)),touch)
    raise AssertionError(('blocked actual movement waypoint',axis,target,compact(snapshot(page))))


movement_helpers.move_axis=move_axis


def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()


def signed_area(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])


def compact(a):
    h=a.get('hero') or {}
    return {k:a.get(k) for k in ['sceneId','x','y','vx','vy','face','jump','stride','weight','height','camera','shadow','hits','groundMotion']}|{
        'hero':{k:h.get(k) for k in ['height','pose','babyFace','landmarks','gait','body','groundMotion']},
        'drawOrder':a.get('drawOrder'), 'gateOpened':a.get('save',{}).get('gateOpened')}


def capture(page,name,result):
    path=OUT/result['phase']/name;path.parent.mkdir(parents=True,exist_ok=True)
    page.screenshot(path=str(path))
    a=snapshot(page);b=a['hero']['babyFace']
    assert a['height']==200 and a['hero']['height']==200
    assert b['continuousUpperBody'] and b['originalCollar'] and not b['headOnly']
    assert math.isclose(b['uniformScale'],.5710830421929589,rel_tol=1e-8)
    item={'file':str(path.relative_to(OUT)),'sha256':sha(path),'actualGameplay':True,'captureIsGeneratedIllustration':False,'environmentArt':'Original source assets plus separately attributed independent scenery PNGs.','viewport':page.viewport_size,'build':page.evaluate('BEARLY_BUILD_ID'),'state':compact(a),
          'scenery':page.evaluate('window.BearlyCentrumScenery?.audit()||null'),'worldArt':page.evaluate('BearlyCentrumSquareWorld.audit()')}
    result['captures'].append(item)
    return item


class Recording:
    def __init__(self,page,phase):
        self.frames=[];self.folder=OUT/'.frames';self.phase=phase
        if self.folder.exists():shutil.rmtree(self.folder)
        self.folder.mkdir(parents=True)
        self.session=page.context.new_cdp_session(page)
        self.session.on('Page.screencastFrame',self.frame)
        self.session.send('Page.startScreencast',{'format':'jpeg','quality':75,'maxWidth':1280,'maxHeight':720,'everyNthFrame':5})
    def frame(self,event):
        path=self.folder/f'{len(self.frames):05d}.jpg'
        path.write_bytes(base64.b64decode(event['data']));self.frames.append((path,event['metadata']['timestamp']))
        self.session.send('Page.screencastFrameAck',{'sessionId':event['sessionId']})
    def finish(self):
        self.session.send('Page.stopScreencast');self.session.detach()
        assert len(self.frames)>20,len(self.frames)
        lines=[]
        for (path,at),(_,later) in zip(self.frames,self.frames[1:]):lines += [f"file '{path.resolve()}'",f'duration {max(.02,min(1,later-at)):.6f}']
        lines.append(f"file '{self.frames[-1][0].resolve()}'")
        listing=self.folder/'frames.txt';listing.write_text('\n'.join(lines)+'\n')
        dest=OUT/self.phase/'walking-review.webm'
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-vf','setpts=PTS/2','-r','20','-c:v','libvpx-vp9','-cpu-used','4','-row-mt','1','-threads','2','-crf','34','-b:v','0','-pix_fmt','yuv420p',str(dest)],check=True)
        result={'file':str(dest.relative_to(OUT)),'sha256':sha(dest),'frames':len(self.frames),'nativeSeconds':self.frames[-1][1]-self.frames[0][1],'speed':2,'actualGameplay':True,'captureIsGeneratedIllustration':False}
        shutil.rmtree(self.folder);return result


def motion(page,keys,ms,name,result):
    for key in keys:page.keyboard.down(key)
    samples=page.evaluate('''async ms=>{const out=[],end=performance.now()+ms;while(performance.now()<end){const a=BearlyCentrumSquare.audit(),h=a.hero;out.push({at:performance.now(),x:a.x,y:a.y,vx:a.vx,vy:a.vy,face:a.face,jump:a.jump,stride:a.stride,weight:a.weight,shadow:a.shadow,groundMotion:a.groundMotion,hero:{height:h.height,babyFace:h.babyFace,landmarks:h.landmarks,gait:h.gait,body:h.body,groundMotion:h.groundMotion}});await new Promise(r=>setTimeout(r,25));}return out;}''',ms)
    capture(page,'desktop/walking-'+name.replace(' ','-')+'.png',result)
    for key in keys:page.keyboard.up(key)
    page.wait_for_timeout(250)
    assert len(samples)>5
    for a in samples:
        h=a['hero'];b=h['babyFace'];assert h['height']==200 and b['continuousUpperBody'] and b['originalCollar'] and not b['headOnly']
        assert math.isclose(b['uniformScale'],.5710830421929589,rel_tol=1e-8)
        assert abs(a['shadow']['y']-a['y'])<1e-6
        assert abs(h['body']['roll'])<.04 and h['body']['surfaces']==1 and h['body']['continuous']
        for leg in h['landmarks'].values():
            assert leg['rigidShoe'] and leg['renderedFromSource']
            assert 12<leg['bootWidth']<80
            assert math.dist(tuple(leg['cuff'].values()),tuple(leg['sole'].values()))<50
            source=leg['source'];painted=signed_area(*[tuple(leg[k].values()) for k in ['heel','toe','cuff']])
            original=signed_area(source['heel'],source['toe'],source['cuff'])
            assert original*painted>0 and abs(painted)/(200*200)>.0005
            if result['phase']=='after' and leg['stance']:assert abs(leg['contact']['y'])<=12.000001
    result['movement'].append({'name':name,'keys':keys,'milliseconds':ms,'samples':samples})
    return samples


def metrics(movement):
    result=[]
    for m in movement:
        slips=[];rendered_slips=[];depth=[]
        for a,b in zip(m['samples'],m['samples'][1:]):
            if min(a['weight'],b['weight'])<.995 or a['jump'] or b['jump']:continue
            ha,hb=a['hero'],b['hero'];phase=ha['gait']['phase'];nextphase=hb['gait']['phase']
            for side in ['near','far']:
                p=(phase+(0 if side=='near' else .5))%1;q=(nextphase+(0 if side=='near' else .5))%1
                la,lb=ha['landmarks'][side],hb['landmarks'][side]
                if .2<p<.34 and .2<q<.34 and a['face']==b['face']:
                    dt=(b['at']-a['at'])/1000
                    if dt<=0:continue
                    wa=(a['x']+la['contact']['x']*a['face'],a['y']+la['contact']['y'])
                    wb=(b['x']+lb['contact']['x']*b['face'],b['y']+lb['contact']['y'])
                    slips.append(math.dist(wa,wb)/dt)
                    ra=(a['x']+la['sole']['x']*a['face'],a['y']+la['sole']['y'])
                    rb=(b['x']+lb['sole']['x']*b['face'],b['y']+lb['sole']['y'])
                    rendered_slips.append(math.dist(ra,rb)/dt)
                if la['stance']:depth.append(la['contact']['y'])
        result.append({'name':m['name'],'midstanceSamples':len(slips),'meanContactWorldSlipPxPerSec':sum(slips)/len(slips) if slips else None,
                       'meanRenderedSoleWorldSlipPxPerSec':sum(rendered_slips)/len(rendered_slips) if rendered_slips else None,
                       'stanceContactLocalDepthMin':min(depth) if depth else None,'stanceContactLocalDepthMax':max(depth) if depth else None})
    return result


def review(browser,base,fixtures,result,watch):
    context,page=create_page(browser,base,fixtures['metro-square'],watch=watch)
    recording=Recording(page,result['phase'])
    walk_to(page,{'x':300,'y':600})
    capture(page,'desktop/native-baby-at-rest.png',result)
    motion(page,['ArrowDown'],3000,'pure depth down',result)
    motion(page,['ArrowUp'],3000,'pure depth up',result)
    motion(page,['ArrowRight','ArrowDown'],550,'diagonal southeast',result)
    motion(page,['ArrowLeft','ArrowUp'],550,'diagonal northwest',result)
    a=snapshot(page);assert a['face']==-1
    capture(page,'desktop/facing-left-after-diagonal.png',result)
    walk_to(page,{'x':500,'y':530});page.wait_for_timeout(200)
    order=[n['id'] for n in snapshot(page)['drawOrder']];assert order.index('player')<order.index('bench-west')
    capture(page,'desktop/bench-behind.png',result)
    page.keyboard.down('ArrowDown');page.wait_for_timeout(700);a=snapshot(page);page.keyboard.up('ArrowDown')
    assert a['y']<=544.1 and 'bench-west' in a['hits'],a
    result['checks'].append('Actual downward movement is blocked by the west bench footprint.')
    walk_to(page,{'x':500,'y':610});page.wait_for_timeout(200)
    order=[n['id'] for n in snapshot(page)['drawOrder']];assert order.index('player')>order.index('bench-west')
    capture(page,'desktop/bench-front.png',result)
    page.keyboard.press('Space');page.wait_for_timeout(180);a=snapshot(page)
    assert a['jump']>20 and a['shadow']['y']==a['y'] and next(n['footY'] for n in a['drawOrder'] if n['id']=='player')==a['y']
    capture(page,'desktop/jump-ground-sort.png',result);page.wait_for_timeout(700)
    walk_to(page,{'x':820,'y':430});page.wait_for_timeout(150)
    plant=page.evaluate("BearlyCentrumSquareWorld.audit().planters.find(p=>p.id==='planter')")
    assert plant['faded'] and plant['foliageAlpha']==.35 and plant['stoneAlpha']==1
    capture(page,'desktop/planter-baby-overlap.png',result)
    result['recording']=recording.finish()
    clock=page.evaluate('BearlyCentrumAtmosphere.audit().clock');page.wait_for_timeout(200)
    assert page.evaluate('BearlyCentrumAtmosphere.audit().clock')>clock
    page.keyboard.press('p');page.wait_for_timeout(100);a=snapshot(page);clock=page.evaluate('BearlyCentrumAtmosphere.audit().clock');page.wait_for_timeout(300)
    assert page.evaluate('BearlyCentrumAtmosphere.audit().clock')==clock and snapshot(page)['x']==a['x'] and snapshot(page)['y']==a['y']
    page.keyboard.press('p');result['checks'].append('Pause freezes walking and atmosphere; resume works.')
    walk_to(page,{'x':1360,'y':840});page.wait_for_timeout(150)
    capture(page,'desktop/gate-closed.png',result)
    page.keyboard.down('ArrowUp');page.wait_for_timeout(700);a=snapshot(page);page.keyboard.up('ArrowUp')
    assert a['y']>=810.9 and any('gate' in h for h in a['hits']),a
    result['checks'].append('Closed square-side gate leaf physically blocks movement.')
    use_exit(page,'shopping-arcade');walk_to(page,{'x':1045,'y':550});page.wait_for_timeout(150)
    capture(page,'desktop/service-passage-approach.png',result)
    use_exit(page,'service-courtyard');walk_to(page,{'x':785,'y':625});page.wait_for_timeout(150)
    capture(page,'desktop/delivery-cage-closed.png',result)
    use_exit(page,'metro-square');page.wait_for_timeout(150);assert snapshot(page)['save']['gateOpened']
    walk_to(page,{'x':1360,'y':840})
    capture(page,'desktop/gate-open.png',result)
    hold(page,'ArrowUp',1500);assert snapshot(page)['y']<780,snapshot(page)
    walk_to(page,{'x':1300,'y':755});page.keyboard.down('ArrowDown');page.wait_for_timeout(1400);a=snapshot(page);page.keyboard.up('ArrowDown')
    assert a['y']<=771.1 and any('gate' in h for h in a['hits']),compact(a)
    result['checks'].append('Opened gate permits walking through its leaf; permanent left post remains collidable.')
    result['checks'].append('Visible arcade side passage reaches courtyard; courtyard gate opens independently and arrives at named square gate.')
    health=snapshot(page)['health'];page.reload(wait_until='domcontentloaded');wait_exploration(page)
    assert snapshot(page)['save']['gateOpened'] and snapshot(page)['health']==health
    result['checks'].append('Gate remains open on reload without health gain.')
    context.close()
    for scene_id in SCENES:
        for touch in [False,True]:
            print(('Phone' if touch else 'Desktop')+': '+scene_id,flush=True)
            context,page=create_page(browser,base,fixtures[scene_id],touch=touch,watch=watch)
            if scene_id=='shopping-arcade':walk_to(page,{'x':1045,'y':550},touch=touch)
            elif scene_id=='service-courtyard':walk_to(page,{'x':785,'y':625},touch=touch)
            capture(page,('phone-landscape' if touch else 'desktop')+'/'+scene_id+'.png',result)
            if touch and scene_id=='metro-square':
                start=snapshot(page);session=page.context.new_cdp_session(page);points=[]
                for direction in ['right','down']:
                    b=page.locator(f'[data-square-dir="{direction}"]').bounding_box();points.append({'x':b['x']+b['width']/2,'y':b['y']+b['height']/2})
                session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':points});page.wait_for_timeout(750);session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});session.detach();page.wait_for_timeout(150)
                a=snapshot(page);assert a['x']>start['x']+10 and a['y']>start['y']+10
                walk_to(page,{'x':1380,'y':910},touch=True);p=projection(page)
                assert p['head']>=0 and p['foot']<=390,p
                capture(page,'phone-landscape/southeast-boundary.png',result)
                result['checks'].append('Chromium 844x390 touch-emulated two-finger diagonal and boundary keep native baby/feet visible.')
            context.close()


def passage_review(browser,base,setup,template,result,watch):
    """Fresh rendered proof for the final jamb/arrival repair and stopping."""
    prepared=prepare_save(setup,template,'service-courtyard')
    for touch in [False,True]:
        context,page=create_page(browser,base,prepared,touch=touch,watch=watch)
        use_exit(page,'shopping-arcade',touch=touch);a=snapshot(page)
        assert a['entranceId']=='from-courtyard' and math.dist((a['x'],a['y']),(1048,586))<1e-6 and a['face']==-1
        assert not page.evaluate('([x,y])=>BearlyCentrumSquareWorld.blocked(x,y,22,12,"shopping-arcade",BearlyCentrumSquare.audit().save)',[a['x'],a['y']])
        capture(page,('phone-landscape' if touch else 'desktop')+'/passage-return-clear-arrival.png',result)
        for _ in range(3):
            page.locator('.square-interact').tap() if touch else page.keyboard.press('e')
        page.wait_for_timeout(180);assert snapshot(page)['sceneId']=='shopping-arcade'
        result['checks'].append(('Touch' if touch else 'Keyboard')+' courtyard return reaches clear named front anchor; repeated interact cannot immediately re-enter.')
        walk_to(page,{'x':996.5,'y':586},touch=touch)
        order=[n['id'] for n in snapshot(page)['drawOrder']];assert order.index('player')>order.index('service-passage-jamb')
        capture(page,('phone-landscape' if touch else 'desktop')+'/passage-jamb-in-front.png',result)
        if not touch:
            page.keyboard.down('ArrowUp');page.wait_for_timeout(1400);a=snapshot(page);page.keyboard.up('ArrowUp')
            assert a['y']>=561.9 and 'service-passage-jamb' in a['hits'],compact(a)
            result['checks'].append('Actual keyboard movement collides with the new left jamb footprint at its visible floor base.')
        walk_to(page,{'x':996.5,'y':510},touch=touch)
        order=[n['id'] for n in snapshot(page)['drawOrder']];assert order.index('player')<order.index('service-passage-jamb')
        capture(page,('phone-landscape' if touch else 'desktop')+'/passage-jamb-behind.png',result)
        walk_to(page,{'x':1060,'y':586},touch=touch)
        hold(page,'ArrowUp',850,touch=touch);assert snapshot(page)['y']<550 and 'service-passage-jamb' not in snapshot(page)['hits']
        capture(page,('phone-landscape' if touch else 'desktop')+'/passage-clear-opening.png',result)
        use_exit(page,'service-courtyard',touch=touch);use_exit(page,'shopping-arcade',touch=touch)
        assert snapshot(page)['entranceId']=='from-courtyard'
        result['checks'].append(('Touch' if touch else 'Keyboard')+' walking passes the clear opening; jamb uses foot order on both sides; two-way passage remains usable.')
        context.close()
    context,page=create_page(browser,base,prepare_save(setup,template,'metro-square'),watch=watch)
    walk_to(page,{'x':300,'y':600});page.keyboard.down('ArrowDown');page.wait_for_timeout(1500);page.keyboard.up('ArrowDown')
    samples=page.evaluate('''async()=>{const out=[],end=performance.now()+1800;while(performance.now()<end){const a=BearlyCentrumSquare.audit();out.push({at:performance.now(),x:a.x,y:a.y,vx:a.vx,vy:a.vy,weight:a.weight,groundMotion:a.groundMotion,gait:a.hero.gait,body:a.hero.body,baby:a.hero.babyFace});await new Promise(r=>setTimeout(r,15));}return out;}''')
    stopped=[a for a in samples if abs(a['vx'])+abs(a['vy'])<1e-6 and a['weight']>0]
    assert stopped, samples
    for a in stopped:
        assert a['groundMotion'] and a['groundMotion']['y']>0 and a['gait']['groundMotion']['y']>0
        assert a['baby']['continuousUpperBody'] and a['baby']['originalCollar'] and abs(a['body']['roll'])<.04
    page.wait_for_function('BearlyCentrumSquare.audit().weight===0')
    assert snapshot(page)['groundMotion'] is None
    result['stopSamples']=samples;result['checks'].append('After pure depth movement stops, projected heading persists through source weight easing and clears at zero; baby/torso stay continuous.')
    capture(page,'desktop/depth-stop-settled.png',result);context.close()


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--before',action='store_true');parser.add_argument('--passage-only',action='store_true');args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    result={'phase':'before' if args.before else 'after','captures':[],'checks':[],'movement':[],'errors':[],'httpFailures':[],
            'fixtureDisclosure':'Production parking/save factories and named default entrances prepare scene overviews. Source debug warp 7550 shortens only initial parking preparation; subsequent travel/motion uses normal keys/touch. This is a focused regression review; stage8/full-route supplies the no-debug earned full route.',
            'conditions':{'desktop':[1280,720],'phoneLandscape':[844,390],'phoneKind':'Chromium Linux touch emulation, not physical iPhone or Safari','deviceScaleFactor':1},
            'sourceReference':'references/source/front-carrier-street.png','priorGameplayReference':'verification/stage8/full-route/04-metro-square.png'}
    result['sourceArtwork']=[]
    for line in (ROOT/'references/source/character-assets.sha256').read_text().splitlines():
        digest,name=line.split(None,1);name=name.strip()
        if name in ['js/game.js','js/illustrated-visits.js','js/autumn-quests.js','js/hero-rig.js']:continue
        actual=sha(ROOT/name);assert actual==digest,name;result['sourceArtwork'].append({'file':name,'sha256':actual})
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            result['conditions']['browser']=browser.version
            def watch(page):
                page.on('pageerror',lambda e:result['errors'].append(str(e)))
                page.on('response',lambda r:result['httpFailures'].append({'status':r.status,'url':r.url}) if r.status>=400 else None)
            setup_context,setup=create_page(browser,base,watch=watch)
            setup.evaluate('BEARLY_DEBUG_MENU.warp(7550)');setup.wait_for_timeout(300);setup.keyboard.press('e');wait_exploration(setup)
            template=setup.evaluate('BearlyCentrumLink.audit().parking')
            geometry=setup.evaluate('BearlyCentrumScenes.all().map(s=>({id:s.id,width:s.width,height:s.height,floor:s.floor,solids:s.solids}))')
            expected={'metro-square':(1500,1000,60,1440,320,930),'shopping-arcade':(1160,800,60,1100,320,750),'service-courtyard':(1160,800,60,1100,320,750),'food-shop':(1160,760,70,1090,430,710),'bicycle-workshop':(1160,760,70,1090,430,710)}
            assert [s['id'] for s in geometry]==SCENES
            for g in geometry:
                f=g['floor'];assert (g['width'],g['height'],f['left'],f['right'],f['top'],f['bottom'])==expected[g['id']]
            result['geometry']=geometry;result['checks'].append('The five existing scene IDs, dimensions and walkable floors remain unchanged.')
            fixtures={scene_id:prepare_save(setup,template,scene_id) for scene_id in SCENES}
            if args.passage_only:
                passage_review(browser,base,setup,template,result,watch)
            else:
                review(browser,base,fixtures,result,watch)
            if not args.passage_only:
                context,page=create_page(browser,base,prepare_save(setup,template,'service-courtyard',reported=True),watch=watch)
                walk_to(page,{'x':785,'y':625});capture(page,'desktop/delivery-cage-released.png',result);context.close()
                context,page=create_page(browser,base,fixtures['metro-square'],reduced=True,watch=watch)
                atmosphere=page.evaluate('BearlyCentrumAtmosphere.audit()');assert atmosphere['reducedMotion'] and atmosphere['drawnLeaves']==0 and page.evaluate("BearlyCentrumAtmosphere.wind('metro-square')")==0
                page.wait_for_timeout(300);assert page.evaluate('BearlyCentrumAtmosphere.audit().clock')==atmosphere['clock']
                capture(page,'desktop/reduced-motion.png',result);result['checks'].append('Reduced motion disables leaves and isolated foliage wind.');context.close()
            result['metrics']=metrics(result['movement'])
            result['runtimeHashes']={str(p.relative_to(ROOT)):sha(p) for p in [ROOT/'js/centrum-square.js',ROOT/'js/centrum-square-world.js',ROOT/'js/hero-rig.js',ROOT/'js/centrum-scenery.js',ROOT/'js/centrum-scenes.js']}
            setup_context.close();browser.close()
        assert not result['errors'],result['errors'];assert not result['httpFailures'],result['httpFailures']
        result['passed']=True
    finally:
        result['metrics']=metrics(result['movement'])
        (OUT/('passage-results.json' if args.passage_only else 'before.json' if args.before else 'results.json')).write_text(json.dumps(result,indent=2)+'\n')
        server.shutdown()
    print(json.dumps({'passed':True,'captures':len(result['captures']),'checks':len(result['checks']),'metrics':result['metrics']},indent=2))


if __name__=='__main__':main()
