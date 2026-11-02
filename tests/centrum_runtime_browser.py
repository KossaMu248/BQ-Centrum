"""Stage 6: production-checksummed malformed sessions and early-start reload.

Only disposable browser storage is written. Fixtures come from the production
adventure factory; malformed nested route/entrance values intentionally exercise
runtime validation beyond the document checksum. No donor checkout is read.
"""
import functools
import json
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from centrum_economy_browser import Quiet, fixture, make_context, wait_ready, wait_exploration

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'verification/stage6/runtime-validation.json'
KEY = 'bq-centrum:scene-network:v1'


def mutate_fixture(page, prepared, kind):
    return page.evaluate(r'''([raw,kind])=>{
      const K='bq-centrum:scene-network:v1',data=new Map([[K,raw]]);
      const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
      const broker=BearlyCentrumSave.createAdventure(storage),s=broker.snapshot();
      if(kind==='fractional_checkpoint')s.session.route.routeProgress.checkpoint=.5;
      if(kind==='wrong_route_id')s.session.route.routeId='a-different-route';
      if(kind==='non_array_progress')s.session.route.routeProgress.oneTime={unexpected:true};
      if(kind==='off_floor')s.session.exploration={...s.session.exploration,x:100,y:50};
      if(kind==='unknown_entrance')s.session.exploration={...s.session.exploration,entranceId:'not-an-authored-entrance'};
      const result=broker.syncSession(s.session);if(!result.ok)throw Error('Fixture rejected: '+result.reason);
      return {raw:data.get(K),snapshot:broker.snapshot()};
    }''', [prepared['raw'], kind])


def open_fixture(browser, base, prepared, watch, early=False):
    context=browser.new_context(viewport={'width':1280,'height':720},device_scale_factor=1)
    context.add_init_script('localStorage.setItem('+json.dumps(KEY)+','+json.dumps(prepared['raw'])+');localStorage.setItem("DONOR_QA_UNTOUCHED","unchanged");')
    if early:
        context.add_init_script(r'''Object.defineProperty(window,'BEARLY_ENTER_GAME',{configurable:true,set(fn){
          Object.defineProperty(window,'BEARLY_ENTER_GAME',{value:fn,writable:true,configurable:true});
          queueMicrotask(()=>{window.__earlyIntroClick={readyBefore:BEARLY_STARTUP().ready};document.getElementById('introStart').click();window.__earlyIntroClick.requestedAfter=BEARLY_STARTUP().requested;});
        }});''')
    page=context.new_page();watch(page)
    page.goto(base+'/index.html',wait_until='domcontentloaded')
    wait_ready(page)
    page.wait_for_function('BearlyCentrumEconomy.ready()&&BEARLY_STARTUP().firstFrameAt!==null',timeout=60000)
    return context,page


def audit(page):
    return page.evaluate(r'''()=>{
      const a=BearlyCentrumSave.adventure.snapshot(),r=BearlyCentrumLink.audit().route,p=BearlyCentrumSquare.active()?BearlyCentrumSquare.position():null;
      return {health:BEARLY_DEBUG().health,wallet:a.wallet,food:a.inventory.billys,collectedIDs:a.collectedIDs,routeX:r.x,routeId:r.routeId,grounded:r.grounded,
        wheels:r.wheels,scene:p,validPosition:p?BearlyCentrumSave.create(BearlyCentrumSave.storage,BearlyCentrumScenes).validPosition(p):null,
        ready:BearlyCentrumEconomy.ready(),linkPhase:BearlyCentrumLink.audit().phase,sourceState:r.state,checkpointReason:a.checkpoint.reason,
        earlyClick:window.__earlyIntroClick||null,donorSentinel:localStorage.getItem('DONOR_QA_UNTOUCHED')};
    }''')


def main():
    result={'stage':6,'browser':'Chromium /usr/bin/chromium','fixtureMethod':'production createAdventure + syncSession checksums','checks':[], 'errors':[], 'httpFailures':[],
            'limits':['Desktop Chromium only; physical devices and other browsers untested.','Malformed nested session values are prepared fixtures, not naturally earned gameplay.']}
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
        setup.evaluate('BEARLY_DEBUG_MENU.warp(7550);BearlyVisits.setHealth(57)')
        setup.wait_for_timeout(300);setup.keyboard.press('e');wait_exploration(setup)
        template=setup.evaluate('BearlyCentrumLink.audit().parking')
        riding=fixture(setup,template,food=1,hp=57,scene_id='riding',reported=False)
        exploring=fixture(setup,template,food=1,hp=57,scene_id='food-shop',reported=False)
        for kind in ['fractional_checkpoint','wrong_route_id','non_array_progress','off_floor','unknown_entrance']:
            print('Runtime validation: '+kind,flush=True)
            source=exploring if kind in ['off_floor','unknown_entrance'] else riding
            prepared=mutate_fixture(setup,source,kind)
            context,page=open_fixture(browser,base,prepared,watch)
            if source is exploring:wait_exploration(page)
            state=audit(page)
            assert state['health']==57 and state['food']==1 and state['wallet']=={'kr':0},(kind,state)
            assert state['donorSentinel']=='unchanged',state
            if source is exploring:
                assert state['scene']['sceneId']=='food-shop' and state['validPosition'],(kind,state)
                assert state['scene']['entranceId']=='from-arcade',state
            else:
                assert state['linkPhase']=='riding' and state['sourceState']=='playing' and abs(state['routeX']-210)<2,(kind,state)
                assert state['grounded'] and all(abs(w['clearance'])<2 for w in state['wheels']),(kind,state)
            result['checks'].append({'name':kind,'passed':True,'state':state})
            context.close()
        # The earlier checkpoint differs visibly from the latest committed save.
        early=setup.evaluate(r'''raw=>{
          const K='bq-centrum:scene-network:v1',data=new Map([[K,raw]]),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
          const broker=BearlyCentrumSave.createAdventure(storage),s=broker.snapshot(),r=s.session.route;
          broker.syncSession({health:83,mode:'riding',route:{...r,health:83,x:210},exploration:null});broker.checkpoint('qa-earlier-checkpoint');
          broker.collect('route-pizza-8');broker.syncSession({health:57,route:{...r,health:57,x:11325}});
          return {raw:data.get(K),snapshot:broker.snapshot()};
        }''',riding['raw'])
        context,page=open_fixture(browser,base,early,watch,early=True)
        state=audit(page)
        assert state['earlyClick']=={'readyBefore':False,'requestedAfter':True},state
        assert state['health']==57 and state['food']==2 and state['collectedIDs']==['route-pizza-8'],state
        assert abs(state['routeX']-11325)<2 and state['checkpointReason']=='qa-earlier-checkpoint',state
        result['checks'].append({'name':'early_intro_click_preserves_latest_committed_session','passed':True,'state':state})
        context.close();setup_context.close();browser.close()
        assert not result['errors'] and not result['httpFailures'],result
        result['passed']=True
    except BaseException as error:
        result['passed']=False;result['failure']=repr(error)
        raise
    finally:
        server.shutdown();OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(result,indent=2)+'\n')
    print(f'PASS: {len(result["checks"])} runtime validation cases; zero JS/HTTP failures.',flush=True)


if __name__=='__main__':main()
