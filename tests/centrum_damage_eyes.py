"""Native-pixel renderer proof, not a gameplay/physical-device/FPS test.

The original injured-arm cel contains eye-alpha holes. Exercise the active
renderer with the original and immutable compiled source images, preserving
every pixel outside the two eyes, including the missing-arm silhouette.
"""
import argparse, functools, hashlib, json, traceback
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
class Quiet(__import__('http.server',fromlist=['SimpleHTTPRequestHandler']).SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

TEST=r'''async()=>{
 const assert=(ok,message)=>{if(!ok)throw Error(message);},W=291,H=309,rois=[[182,42,20,22],[209,47,7,9]],results=[];
 const inside=(x,y)=>rois.some(([rx,ry,rw,rh])=>x>=rx&&x<rx+rw&&y>=ry&&y<ry+rh);
 const load=async path=>{const im=new Image();im.src=path;await im.decode();return im;};
 const render=(image,background=null)=>{const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d',{willReadFrequently:true});if(background){g.fillStyle=background;g.fillRect(0,0,W,H);}g.drawImage(image,0,0);return g.getImageData(0,0,W,H).data;};
 for(const family of ['compiled','original']){
  const base=family==='compiled'?'assets/cache/hero-cycling-v19/':'assets/',ext=family==='compiled'?'.png':'.webp';
  const [injured,coast]=await Promise.all([load(base+'bear_upper_rightarm_injured'+ext),load(base+'bear_pose_coast'+ext)]);
  const beforeSurface=BearlyHero.sprite(injured),referenceSurface=BearlyHero.sprite(coast),before=render(beforeSurface),reference=render(referenceSurface),repairsBefore=BearlyHero.audit().eyeRepairs;
  const repaired=BearlyHero.sprite(injured,coast),after=render(repaired),report={family,width:W,height:H,outsidePixels:0,changedOutsidePixels:0,originalOpaquePixels:0,changedOriginalOpaquePixels:0,opaqueEyePixels:0,sourceEyeHolePixels:0,changedEyePixels:0,missingArmPixels:0,backgroundDependentEyePixels:0,samples:[]};
  const paleBefore=render(beforeSurface,'#f5dbab'),darkBefore=render(beforeSurface,'#17394a'),pale=render(repaired,'#f5dbab'),dark=render(repaired,'#17394a');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
   const at=(y*W+x)*4,diff=[0,1,2,3].some(k=>before[at+k]!==after[at+k]);
   if(!inside(x,y)){report.outsidePixels++;if(diff)report.changedOutsidePixels++;}
   if(before[at+3]===255){report.originalOpaquePixels++;if(diff)report.changedOriginalOpaquePixels++;}
   if(inside(x,y)){
    if(diff)report.changedEyePixels++;
    if(reference[at+3]===255){report.opaqueEyePixels++;assert(after[at+3]===255, family+' eye remains translucent');assert([0,1,2].every(k=>pale[at+k]===dark[at+k]),family+' eye colour leaks background');}
    if(before[at+3]===0&&reference[at+3]===255&&Math.min(reference[at],reference[at+1],reference[at+2])>150){
     report.sourceEyeHolePixels++;assert([0,1,2,3].every(k=>after[at+k]===reference[at+k]),family+' original intact eye pixels changed');if([0,1,2].some(k=>paleBefore[at+k]!==darkBefore[at+k]))report.backgroundDependentEyePixels++;
     if(report.samples.length<8)report.samples.push({x,y,before:[...before.slice(at,at+4)],after:[...after.slice(at,at+4)],intact:[...reference.slice(at,at+4)]});
    }
   }
   if(x>215&&y>130&&y<205&&before[at+3]===0&&reference[at+3]===255){report.missingArmPixels++;assert(after[at+3]===0,family+' missing arm restored accidentally');}
  }
  assert(report.changedOutsidePixels===0,family+' unrelated body pixels changed');assert(report.changedOriginalOpaquePixels===0,family+' original opaque pixels changed');assert(report.sourceEyeHolePixels>100,family+' failed to reproduce original eye holes');assert(report.changedEyePixels>100,family+' repair not applied');assert(report.missingArmPixels>100,family+' missing-arm preservation not exercised');
  for(let i=0;i<60;i++)assert(BearlyHero.sprite(injured,coast)===repaired,'per-frame surface recreation');assert(BearlyHero.audit().eyeRepairs===repairsBefore+1,'cache rebuilt');
  report.probes=[[190,49],[212,51]].map(([x,y])=>{const at=(y*W+x)*4;return{x,y,before:[...before.slice(at,at+4)],after:[...after.slice(at,at+4)],intact:[...reference.slice(at,at+4)]};});
  report.passed=true;results.push(report);
 }
 return{passed:true,cases:results,eyeRegions:rois,backgrounds:['#f5dbab','#17394a'],audit:BearlyHero.audit(),scope:'Original/compiled native-size pixel renderer lab; not gameplay.'};
}'''

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--out',default='verification/stage18/eyes');args=parser.parse_args();out=(ROOT/args.out).resolve();assert out.is_relative_to(ROOT);out.mkdir(parents=True,exist_ok=True)
    files=['js/illustrated-hero.js','assets/bear_upper_rightarm_injured.webp','assets/bear_pose_coast.webp','assets/cache/hero-cycling-v19/bear_upper_rightarm_injured.png','assets/cache/hero-cycling-v19/bear_pose_coast.png']
    hashes=lambda:{f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in files}
    result={'scope':__doc__,'componentHashes':hashes(),'harnessSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'physicalDevicesTested':False,'pageErrors':[],'consoleErrors':[],'httpFailures':[]}
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);result['browser']=browser.version;page=browser.new_page()
            page.on('pageerror',lambda e:result['pageErrors'].append(str(e)));page.on('console',lambda e:result['consoleErrors'].append(e.text) if e.type=='error' else None);page.on('response',lambda r:result['httpFailures'].append([r.status,r.url]) if r.status>=400 else None)
            page.route('**/damage-eyes-lab.html',lambda route:route.fulfill(body='<!doctype html><title>Native renderer pixel reference</title><script src="js/illustrated-hero.js"></script>',content_type='text/html'))
            page.goto(f'http://127.0.0.1:{server.server_port}/damage-eyes-lab.html');result.update(page.evaluate(TEST));browser.close()
        result['componentHashesAfter']=hashes();assert result['componentHashes']==result['componentHashesAfter'];assert not result['pageErrors'] and not result['consoleErrors'] and not result['httpFailures'];result['passed']=True
    except BaseException as error:
        result['passed']=False;result['failure']=repr(error);result['traceback']=traceback.format_exc();raise
    finally:
        server.shutdown();(out/'pixels.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'passed':True,'cases':[(r['family'],r['sourceEyeHolePixels'],r['changedEyePixels'],r['changedOutsidePixels'],r['missingArmPixels']) for r in result['cases']]}))

if __name__=='__main__':main()
