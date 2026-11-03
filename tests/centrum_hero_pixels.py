"""Paused renderer laboratory, not gameplay/FPS evidence or character artwork.

Compare first-draw Canvas, settled source ImageBitmap and worker ImageBitmap.
Actual gameplay anatomy/animation has its own real input captures and videos.
"""
import functools
import hashlib
import json
import platform
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
from centrum_performance_review import PIXEL_EQUIVALENCE

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification/stage11/pose-audit/pixel-pairs'
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start()
    errors=[];console=[];http=[]
    result={'scope':__doc__,'conditions':{'platform':platform.platform(),'observedAtUtc':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'viewport':{'width':1280,'height':720},'headless':True,'physicalDevice':False,'fpsBenchmark':False,'mayOverlapFunctionalBrowsers':True},'errors':errors,'consoleErrors':console,'httpFailures':http}
    result['runtimeHashes']={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((ROOT/'js').glob('*.js'))}
    result['runtimeHashes'].update({str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((ROOT/'css').glob('*.css'))})
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        result['conditions']['browser']=browser.version
        page=browser.new_page(viewport={'width':1280,'height':720},device_scale_factor=1)
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
        page.on('response',lambda r:http.append({'url':r.url,'status':r.status}) if r.status>=400 else None)
        page.goto(f'http://127.0.0.1:{server.server_port}/index.html',wait_until='domcontentloaded')
        page.wait_for_function('window.BEARLY_STARTUP?.().firstFrameAt!==null&&window.BearlyHeroRig?.prepareCentrumCache',timeout=90000)
        result['build']=page.evaluate('BEARLY_BUILD_ID')
        assert page.evaluate('BearlyHeroRig.prepareCentrumCache()'),'worker unavailable'
        page.wait_for_function('BearlyHeroRig.ready()',timeout=60000)
        result['comparison']=page.evaluate(PIXEL_EQUIVALENCE,{'settleNative':True,'includePng':True})
        for case in result['comparison']['cases']:
          files={}
          for kind,data in case.pop('pngs',{}).items():
            name=f"{case['heading']}-{str(case['phase']).replace('.','_')}-{kind}.png";path=OUT/name;path.write_bytes(bytes(data))
            files[kind]={'file':name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
          if files:case['files']=files
        result['checks']={'noRuntimeErrors':not errors,'noConsoleErrors':not console,'noHttpFailures':not http,'settledNativeImageBitmap':all(c['nativeKind']=='ImageBitmap' and c['pendingAfterSettle']==0 for c in result['comparison']['cases']),'workerImageBitmap':all(c['workerKind']=='ImageBitmap' for c in result['comparison']['cases']),'sameNumericGeometry':all(c['maxGeometryDelta']<1e-8 for c in result['comparison']['cases']),'rawBytesEqual':all(c['rawByteEqual'] for c in result['comparison']['cases']),'visibleWithinDeclared2Lsb':all(c['visibleWithin8BitTolerance'] for c in result['comparison']['cases'])}
        page.close();browser.close()
    finally:server.shutdown();server.server_close()
    (OUT/'results.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'checks':result['checks'],'cases':[{k:c[k] for k in ['heading','phase','firstKind','nativeKind','workerKind','maxGeometryDelta','differentPixels','maxAlphaDelta','maxPremultipliedDelta','visibleWithin8BitTolerance']} for c in result['comparison']['cases']]},indent=2))

if __name__=='__main__':main()
