"""Actual production enemy attacks, combat/defeated Eat refusal and coherent retry.

Secondary disclosed fixture: production adventure factory prepares20HP/one pizza
at the normal road start; the existing practice entry supplies nonessential source
NPCs. After that, only real J/I/C/pointer input changes combat: no health setter,
hit/death helper or state mutation forces damage or defeat.
"""
import base64
import functools
import hashlib
import json
import shutil
import subprocess
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from centrum_economy_browser import Quiet, wait_ready

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification/stage8/combat'
OUT.mkdir(parents=True,exist_ok=True)
KEY='bq-centrum:scene-network:v1'


class Recording:
    def __init__(self,page):
        self.folder=OUT/'.frames';self.folder.mkdir(exist_ok=True);self.frames=[]
        self.session=page.context.new_cdp_session(page);self.session.on('Page.screencastFrame',self.frame)
        self.session.send('Page.startScreencast',{'format':'jpeg','quality':70,'maxWidth':1280,'maxHeight':720,'everyNthFrame':4})
    def frame(self,event):
        p=self.folder/f'{len(self.frames):05d}.jpg';p.write_bytes(base64.b64decode(event['data']));self.frames.append((p,event['metadata']['timestamp']))
        self.session.send('Page.screencastFrameAck',{'sessionId':event['sessionId']})
    def finish(self):
        self.session.send('Page.stopScreencast');self.session.detach();assert len(self.frames)>10,len(self.frames)
        listing=[]
        for (p,t),(_,next_t) in zip(self.frames,self.frames[1:]):listing.extend([f"file '{p.resolve()}'",f'duration {max(.02,min(1,next_t-t)):.6f}'])
        listing.append(f"file '{self.frames[-1][0].resolve()}'");f=self.folder/'frames.txt';f.write_text('\n'.join(listing)+'\n')
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(f),'-vf','setpts=PTS/2','-r','20','-c:v','libvpx-vp9','-cpu-used','4','-row-mt','1','-threads','2','-crf','36','-b:v','0','-pix_fmt','yuv420p',str(OUT/'real-enemy-defeat.webm')],check=True)
        result={'file':'real-enemy-defeat.webm','kind':'actual browser gameplay','speed':2,'frames':len(self.frames),'nativeSeconds':self.frames[-1][1]-self.frames[0][1],'captureWaitGapCapSeconds':1,'generatedArtwork':False}
        shutil.rmtree(self.folder);return result


def audit(page):
    return page.evaluate('({health:BEARLY_DEBUG().health,visit:BearlyVisits.audit(),bag:BearlyCentrumInventory.audit(),save:BearlyCentrumSave.adventure.snapshot()})')


def capture(page,name):page.screenshot(path=str(OUT/(name+'.png')))


def main():
    result={'test':'real source combat defeat and coherent retry','conditions':{'browser':'Chromium /usr/bin/chromium','viewport':[1280,720],'physicalDevice':False},
      'fixtureDisclosure':'Secondary isolated factory save: health20, one pizza,0kr, normal road start. Existing BearlyVisits.practice supplies nonessential source NPCs. After setup actual keyboard/pointer input provokes attacks; no health setter/forced hit/death creates defeat. This is not the separate fresh native complete route.',
      'checks':[],'damageSamples':[],'errors':[],'httpFailures':[]}
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        context=browser.new_context(viewport={'width':1280,'height':720});page=context.new_page()
        page.goto(f'http://127.0.0.1:{server.server_port}/index.html');wait_ready(page);page.click('#introStart');page.wait_for_timeout(300)
        prepared=page.evaluate(r'''()=>{
          const K='bq-centrum:scene-network:v1',memory=new Map([[K,JSON.stringify({schemaVersion:1,layoutVersion:3,gateOpened:false,discovered:['metro-square'],position:{sceneId:'metro-square',entranceId:'start',x:260,y:540,face:1},inventory:{billys:1}})]]);
          const native={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v))};const broker=BearlyCentrumSave.createAdventure(native);
          const route=BearlyCentrumLink.audit().route;const synced=broker.syncSession({health:20,mode:'riding',route:{...route,health:20},exploration:null});if(!synced.ok)throw Error(synced.reason);
          broker.checkpoint('combat-prepared-checkpoint');return {raw:memory.get(K),expected:broker.snapshot().checkpoint.payload};
        }''')
        context.close();context=browser.new_context(viewport={'width':1280,'height':720})
        context.add_init_script("if(!sessionStorage.getItem('bq-centrum:combat-fixture-installed')){localStorage.setItem("+json.dumps(KEY)+','+json.dumps(prepared['raw'])+");sessionStorage.setItem('bq-centrum:combat-fixture-installed','1');}")
        page=context.new_page();page.on('pageerror',lambda e:result['errors'].append(str(e)));page.on('response',lambda r:result['httpFailures'].append({'url':r.url,'status':r.status}) if r.status>=400 else None)
        page.goto(f'http://127.0.0.1:{server.server_port}/index.html');wait_ready(page)
        initial=audit(page);assert initial['health']==20 and initial['save']['inventory']['billys']==1
        recording=Recording(page)
        page.evaluate('BearlyVisits.practice()')
        page.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition&&BearlyVisits.audit().combat.npcs.some(n=>n.id==='practice-a')",timeout=60000)
        page.wait_for_timeout(120)
        page.keyboard.press('j');page.wait_for_timeout(100);page.keyboard.press('j')
        provoked=audit(page);victims=[n for n in provoked['visit']['combat']['npcs'] if n['hp']<n['maxHp']]
        assert victims and any(n['aggressive'] for n in provoked['visit']['combat']['npcs']),provoked
        assert provoked['visit']['combat']['stats']['mauls']>=1
        result['checks'].append({'name':'actual J and repeated J provoke/damage source NPCs and real aggression','passed':True,'damagedNPCs':victims,'stats':provoked['visit']['combat']['stats']})
        page.keyboard.press('i');page.wait_for_timeout(120)
        assert page.locator('.centrum-inventory-panel').is_visible() and page.locator('#inventoryEatBtn').is_disabled()
        danger=audit(page);assert 'danger' in danger['bag']['disabledReason'].lower(),danger['bag']
        box=page.locator('#inventoryEatBtn').bounding_box()
        for _ in range(3):page.mouse.click(box['x']+box['width']/2,box['y']+box['height']/2)
        page.wait_for_timeout(250);blocked=audit(page)
        assert blocked['health']==danger['health'] and blocked['save']['inventory']['billys']==1 and not blocked['bag']['eating'],blocked
        capture(page,'01-combat-eat-disabled')
        result['checks'].append({'name':'combat Eat is disabled; repeated real pointer attempts grant no health or item loss','passed':True,'health':blocked['health'],'food':1,'reason':blocked['bag']['disabledReason']})
        page.keyboard.press('i')
        last_hp=None
        for _ in range(230):
          sample=audit(page);c=sample['visit']['combat']
          if sample['health']!=last_hp:
            result['damageSamples'].append({'health':sample['health'],'combatTime':c['time'],'hurt':c['hurt'],'effects':c['effects'],'npcs':[{'id':n['id'],'hp':n['hp'],'state':n['state'],'aggressive':n['aggressive'],'punching':n['punching']} for n in c['npcs']]});last_hp=sample['health']
          if sample['health']==0:break
          page.wait_for_timeout(90)
        else:raise AssertionError(('production attacks did not defeat player',audit(page)))
        assert len(result['damageSamples'])>=3 and result['damageSamples'][0]['health']<=20 and result['damageSamples'][-1]['health']==0,result['damageSamples']
        assert any(any(e['kind'] in ['hurt','counter','faint'] for e in sample['effects']) for sample in result['damageSamples']),result['damageSamples']
        defeated=audit(page);assert defeated['save']['inventory']['billys']==1
        capture(page,'02-production-attacks-defeat')
        page.wait_for_timeout(2200);assert audit(page)['health']==0,'old automatic defeat refill returned'
        result['checks'].append({'name':'production NPC attacks cause sampled health loss to zero; old defeat delay grants no health','passed':True,'damageHealthSequence':[s['health'] for s in result['damageSamples']],'damagedNPCsPersistUntilRetry':[{'id':n['id'],'hp':n['hp']} for n in defeated['visit']['combat']['npcs']]})
        page.keyboard.press('i');page.wait_for_timeout(100);assert page.locator('#inventoryEatBtn').is_disabled()
        dead=audit(page);assert 'retry' in dead['bag']['disabledReason'].lower()
        box=page.locator('#inventoryEatBtn').bounding_box()
        for _ in range(3):page.mouse.click(box['x']+box['width']/2,box['y']+box['height']/2)
        assert audit(page)['health']==0 and audit(page)['save']['inventory']['billys']==1
        capture(page,'03-defeated-food-kept')
        result['checks'].append({'name':'defeated Eat/spam refuses healing and keeps food','passed':True,'reason':dead['bag']['disabledReason']})
        result['recording']=recording.finish()
        page.keyboard.press('c');page.wait_for_timeout(600);wait_ready(page)
        after=audit(page);expected=prepared['expected']
        assert after['health']==20 and not page.evaluate('BearlyVisits.active()')
        for field in ['wallet','inventory','collectedIDs','rewardClaims','gateOpened','discovered']:assert after['save'][field]==expected[field],(field,after['save'][field],expected[field])
        assert not any(n['id'].startswith('practice-') for n in after['visit']['combat']['npcs'])
        assert after['save']['session']['health']==expected['session']['health'] and after['save']['session']['mode']=='riding'
        capture(page,'04-coherent-retry-fight-reset')
        result['checks'].append({'name':'C restores complete checkpoint health/supplies/flags and discards damaged fight','passed':True,'health':after['health'],'inventory':after['save']['inventory'],'wallet':after['save']['wallet'],'collectedIDs':after['save']['collectedIDs'],'questClaims':after['save']['rewardClaims'],'sourceNPCsAfterRetry':[n['id'] for n in after['visit']['combat']['npcs']]})
        context.close();browser.close()
      assert not result['errors'] and not result['httpFailures'],result
      result['passed']=True
    except Exception as e:
      result['passed']=False;result['failure']=repr(e);raise
    finally:
      server.shutdown();server.server_close();(OUT/'results.json').write_text(json.dumps(result,indent=2)+'\n')
      (OUT/'frames.sha256').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in sorted(OUT.glob('*.png'))))
    print('PASS: actual J provocation, production enemy attacks to defeat, combat/dead Eat refusal, complete retry with fight damage reset; zero JS/HTTP failures.')


if __name__=='__main__':main()
