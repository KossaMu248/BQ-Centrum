"""Stage11: real I/menu bag input across ride, copied source-foot and Centrum.

Starting health/supplies/quest receipt use the existing production save fixture.
After setup, normal Q/E transfers and native keyboard/pointer input perform work.
This review does not replace the earlier earned full story acceptance.
"""
import argparse
import functools
import hashlib
import json
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from centrum_polish import create_page
from centrum_economy_browser import Quiet,wait_exploration,fixture,make_context,ui,ledger,health,use_exit,counter,close_dialogue

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification/stage11/inventory'


def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()


def mode(page):return page.evaluate('BearlyCentrumEconomy.context().mode')


def capture(page,name,result):
    page.wait_for_timeout(100);p=OUT/(name+'.png');p.parent.mkdir(parents=True,exist_ok=True);page.screenshot(path=str(p))
    state=page.evaluate('''()=>({build:BEARLY_BUILD_ID,inventory:BearlyCentrumInventory.audit(),context:BearlyCentrumEconomy.context(),menuOpen:BEARLY_DEBUG_MENU.isOpen(),square:BearlyCentrumSquare.active()?{position:BearlyCentrumSquare.position(),height:BearlyCentrumSquare.audit().height,baby:BearlyCentrumSquare.audit().hero.babyFace}:null,healthRowVisible:!document.querySelector('.centrum-health-hud').hidden,heartCount:document.querySelectorAll('.centrum-health-hud .foot-heart').length,oldFloatingButtonCount:document.querySelectorAll('#inventoryOpenBtn').length,walletVisible:!!document.querySelector('.inventory-wallet').getBoundingClientRect().width&&!!document.querySelector('.inventory-wallet').getBoundingClientRect().height})''')
    assert state['oldFloatingButtonCount']==0 and state['heartCount']==5
    if not state['inventory']['browsing']:assert not state['walletVisible']
    if state['square']:
        b=state['square']['baby'];assert state['square']['height']==200 and b['continuousUpperBody'] and b['originalCollar'] and abs(b['uniformScale']-.5710830421929589)<1e-8
    result['captures'].append({'file':str(p.relative_to(OUT)),'sha256':sha(p),'actualGameplay':True,'captureIsGeneratedIllustration':False,'viewport':page.viewport_size,'state':state})
    return state


def wait_bag(page):page.wait_for_function('BearlyCentrumInventory.isBrowsing()&&!BEARLY_DEBUG_MENU.isOpen()&&BearlyCentrumInventory.audit().pendingOpen===null',timeout=8000)


def no_inventory_overlay(page):
    assert not ui(page)['browsing'] and not page.locator('.centrum-inventory-panel').is_visible()
    assert not page.locator('.inventory-wallet').is_visible() and page.locator('#inventoryOpenBtn').count()==0
    assert page.locator('.centrum-health-hud button,.centrum-health-hud .inventory-wallet,.centrum-health-hud .inventory-count').count()==0


def current_gear(page):
    return '.square-settings' if mode(page)=='centrum' else '.area-settings' if mode(page)=='source-foot' else '.ride-settings'


def click(page,selector,touch):page.locator(selector).tap() if touch else page.locator(selector).click()


def review_mode(page,touch,result,successful_eat=False):
    label=('touch' if touch else 'desktop')+'/'+mode(page);start=ui(page);no_inventory_overlay(page)
    capture(page,label+'-ordinary',result)
    # A held physical I emits repeat events, which must not toggle twice.
    page.keyboard.down('i');page.keyboard.down('i');wait_bag(page);assert ui(page)['browsing'];page.keyboard.up('i')
    opened=capture(page,label+'-i-open',result)
    assert page.locator('.inventory-wallet').inner_text()==f"{start['wallet']} kr"
    assert page.locator('.inventory-selected-count').inner_text().startswith(str(start['food']))
    page.keyboard.press('i');no_inventory_overlay(page)
    # I while Settings is open closes that menu first, then opens exactly once.
    click(page,current_gear(page),touch);page.locator('#debugPanel').wait_for(state='visible');page.keyboard.press('i');wait_bag(page)
    assert ui(page)['pendingOpen'] is None;page.keyboard.press('i');no_inventory_overlay(page)
    # The touch equivalent lives in Settings; no floating bag button is restored.
    click(page,current_gear(page),touch);page.locator('#debugPanel').wait_for(state='visible')
    assert page.locator('#inventoryMenuBtn').is_enabled();click(page,'#inventoryMenuBtn',touch);wait_bag(page)
    capture(page,label+'-menu-open',result);click(page,'#inventoryCloseBtn',touch);no_inventory_overlay(page)
    assert page.evaluate("document.activeElement?.matches('.ride-settings,.area-settings,.square-settings,#debugOpenBtn')")
    # Explicit P pause is not silently cleared by opening or closing the bag.
    page.keyboard.press('p');page.keyboard.press('i');wait_bag(page)
    assert page.locator('#inventoryEatBtn').is_disabled() and 'Resume' in ui(page)['disabledReason']
    page.keyboard.press('i');assert page.evaluate('BearlyCentrumEconomy.context().paused');page.keyboard.press('p')
    assert not page.evaluate('BearlyCentrumEconomy.context().paused')
    # Eat remains a live action; cancellation costs neither food nor health.
    page.keyboard.press('i');wait_bag(page);assert page.locator('#inventoryEatBtn').is_enabled(),ui(page)
    click(page,'#inventoryEatBtn',touch);page.wait_for_function('BearlyCentrumInventory.isEating()')
    assert not ui(page)['browsing'];capture(page,label+'-live-eat',result);click(page,'#inventoryCancelEatBtn',touch)
    assert ui(page)['food']==start['food'] and ui(page)['health']==start['health'] and ui(page)['wallet']==start['wallet']
    if successful_eat:
        page.keyboard.press('i');wait_bag(page);click(page,'#inventoryEatBtn',touch)
        page.wait_for_function("BearlyCentrumInventory.audit().lastOutcome?.status==='completed'",timeout=7000)
        assert ui(page)['food']==start['food']-1 and ui(page)['health']==min(100,start['health']+20) and ui(page)['wallet']==start['wallet']
        no_inventory_overlay(page)
    result['checks'].append({'name':label+' I repeat/toggle, Settings-I, native menu Bag, visible focus return, paused browsing, live Eat/cancel'+('/complete' if successful_eat else ''),'passed':True,'before':start,'after':ui(page)})


def presentation_check(page,result):
    footer=page.evaluate('''()=>{const e=document.getElementById('starsCount'),p=e.parentElement,r=p.getBoundingClientRect();return{nodeRetained:!!e,hidden:p.hidden,display:getComputedStyle(p).display,width:r.width,height:r.height};}''')
    assert footer['nodeRetained'] and footer['hidden'] and footer['display']=='none' and footer['width']==footer['height']==0
    capture(page,'presentation/ride-no-persistent-inventory',result)
    # Secondary unlinked prototype fixture only for the exact presentation check;
    # the complete report above uses normal E parking and all production transfers.
    page.evaluate('BearlyCentrumSquare.open()');page.wait_for_function('BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading');page.wait_for_timeout(150)
    subtitle=page.locator('.square-subtitle').inner_text();assert 'Billy' not in subtitle and 'BAG' not in subtitle.upper()
    page.keyboard.press('m');map_text=page.locator('.square-map-bag').inner_text();assert 'Billy' not in map_text and 'your bag' not in map_text
    capture(page,'presentation/map-no-bag-count',result);page.keyboard.press('m')
    page.keyboard.press('i');wait_bag(page);assert page.locator('#inventoryEatBtn').is_disabled() and 'Full health' in ui(page)['disabledReason']
    capture(page,'presentation/current-build-i-bag',result);page.keyboard.press('i');no_inventory_overlay(page)
    result['checks'].append({'name':'Final current-build footer/subtitle/map presentation; retained source footer node is truly hidden; I bag/full-health rule works.','passed':True,'footer':footer,'subtitle':subtitle,'mapParagraph':map_text,'fixture':'Secondary public Square.open prototype entry for presentation only.'})


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--presentation-only',action='store_true');args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    result={'captures':[],'checks':[],'errors':[],'httpFailures':[],'physicalDeviceTesting':False,'fixtureDisclosure':'Production ledger factory prepares a completed receipt,2food/40kr/60HP at a valid parked-route position. Existing source debug stop only shortens setup. Subsequent Q/source-foot/Q/E/Centrum and all inventory controls are native input; no scene teleports after loading the fixture.','runtimeHashes':{name:sha(ROOT/name) for name in ['js/centrum-inventory.js','css/centrum-inventory.css','index.html','autumn-v19.html']}}
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);result['browser']=browser.version
        def watch(page):
            page.on('pageerror',lambda e:result['errors'].append(str(e)))
            page.on('response',lambda r:result['httpFailures'].append({'status':r.status,'url':r.url}) if r.status>=400 else None)
        setup_context,setup=create_page(browser,base,watch=watch)
        if args.presentation_only:
          result['fixtureDisclosure']='Fresh source ride at default state, followed by public Square.open prototype entry solely for a secondary presentation check. This does not claim normal cycling/parking travel; the complete report uses production transfers.'
          presentation_check(setup,result)
        else:
          setup.evaluate('BEARLY_DEBUG_MENU.warp(7550)');setup.wait_for_timeout(300);setup.keyboard.press('e');wait_exploration(setup)
          prepared=fixture(setup,setup.evaluate('BearlyCentrumLink.audit().parking'),food=1,hp=60,scene_id='riding',reported=True,claimed=True,kr=40)
        for touch in ([] if args.presentation_only else [False,True]):
            print(('Touch' if touch else 'Desktop')+' ride/source-foot/Centrum cycle',flush=True)
            context,page=make_context(browser,base,prepared,touch=touch,watch=watch)
            assert mode(page)=='riding';review_mode(page,touch,result,successful_eat=True)
            page.keyboard.press('q');page.wait_for_function("BearlyVisits.audit().mode==='street'&&!BearlyVisits.audit().transition",timeout=60000)
            assert mode(page)=='source-foot' and ui(page)['health']==80 and ui(page)['food']==1 and ui(page)['wallet']==40;review_mode(page,touch,result)
            page.keyboard.press('q');page.wait_for_function('!BearlyVisits.active()',timeout=60000)
            assert mode(page)=='riding' and ui(page)['health']==80 and ui(page)['food']==1;page.keyboard.press('e');wait_exploration(page)
            assert mode(page)=='centrum' and ui(page)['health']==80 and ui(page)['food']==1 and ui(page)['wallet']==40;review_mode(page,touch,result)
            # A blocked map/dialogue never queues an unexpected later bag.
            page.keyboard.press('m');page.keyboard.press('i');assert not ui(page)['browsing'] and ui(page)['pendingOpen'] is None
            page.keyboard.press('m');page.wait_for_timeout(100);no_inventory_overlay(page)
            use_exit(page,'shopping-arcade',touch=touch);use_exit(page,'food-shop',touch=touch);close_dialogue(page);counter(page)
            page.keyboard.press('i');assert not ui(page)['browsing'] and ui(page)['pendingOpen'] is None
            close_dialogue(page);page.wait_for_timeout(100);no_inventory_overlay(page)
            result['checks'].append({'name':('touch' if touch else 'desktop')+' blocked map/dialogue leave no pending bag; original controls still travel normally','passed':True})
            context.close()
        setup_context.close();browser.close()
      assert not result['errors'] and not result['httpFailures'],result
      result['passed']=True
    finally:
      (OUT/('presentation-results.json' if args.presentation_only else 'results.json')).write_text(json.dumps(result,indent=2)+'\n');server.shutdown()
    print(json.dumps({'passed':True,'captures':len(result['captures']),'groups':len(result['checks'])},indent=2))


if __name__=='__main__':main()
