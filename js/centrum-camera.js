/* Pure scene framing. World geometry/actors remain in their original units. */
(() => {
  'use strict';
  const frameWidth=1160,frameHeight=640,zoom=.75,routeZoom=1,legacyRouteZoom=1.35;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const finite=(v,fallback)=>Number.isFinite(v)?v:fallback;
  function axis(focus,extent,visible,fraction,padding=0){
    return extent<=visible?(extent-visible)*.5:clamp(focus-visible*fraction,0,extent-visible+padding);
  }
  function follow(scene,player){
    const width=frameWidth/zoom,height=frameHeight/zoom;
    // At the south edge, preserve a small clear band above touch controls.
    // This is bounded camera matte beyond the art edge, never extra floor.
    const bottomPadding=scene.floor?Math.max(0,scene.floor.bottom-(scene.radiusY||12)+80/zoom-scene.height):0;
    const bounds={left:Math.min(0,(scene.width-width)*.5),right:Math.max(0,scene.width-width),top:Math.min(0,(scene.height-height)*.5),bottom:Math.max(0,scene.height-height+bottomPadding)};
    return{x:axis(finite(player.x,0),scene.width,width,.5),y:axis(finite(player.y,0),scene.height,height,.66,bottomPadding),
      width,height,zoom,frameWidth,frameHeight,bottomPadding,bounds};
  }
  function project(camera,x,y){return{x:(x-camera.x)*camera.zoom,y:(y-camera.y)*camera.zoom};}
  function unproject(camera,x,y){return{x:x/camera.zoom+camera.x,y:y/camera.zoom+camera.y};}
  function routeFrame(width=frameWidth,height=frameHeight,intro=false){
    const scale=intro?legacyRouteZoom:routeZoom,focusX=width*.32,focusY=height*.22;
    // Keep the established road/foot anchor while revealing more surroundings.
    // This affects projection only; the simulation camera and terrain stay put.
    return{zoom:scale,focusX,focusY,shiftY:(legacyRouteZoom-scale)*(395-focusY)};
  }
  function projectRoute(frame,x,y){
    const p=routeFrame(frame.width??frameWidth,frame.height??frameHeight,!!frame.intro);
    return{x:p.focusX+p.zoom*(x-frame.cameraX-p.focusX),y:p.focusY+p.shiftY+p.zoom*(y-frame.cameraY-p.focusY)};
  }
  function cover(camera,player,box){
    const scale=Math.max(finite(box.width,frameWidth)/frameWidth,finite(box.height,frameHeight)/frameHeight),
      visibleWidth=Math.min(frameWidth,box.width/scale),visibleHeight=Math.min(frameHeight,box.height/scale),
      foot=project(camera,player.x,player.y-(player.jump||0)),paintedHeight=(player.paintedHeight||212)*camera.zoom;
    const overflowX=Math.max(0,frameWidth-visibleWidth),overflowY=Math.max(0,frameHeight-visibleHeight);
    const cropX=overflowX?clamp(foot.x-visibleWidth*.5,0,overflowX):0;
    let cropY=overflowY*.5;
    if(foot.y-cropY>visibleHeight-76)cropY=foot.y-visibleHeight+76;
    if(foot.y-paintedHeight-cropY<28)cropY=foot.y-paintedHeight-28;
    cropY=clamp(cropY,0,overflowY);
    return{panX:overflowX?cropX/overflowX*100:50,panY:overflowY?cropY/overflowY*100:50,
      cropX,cropY,visibleWidth,visibleHeight,scale};
  }
  window.BearlyCentrumCamera=Object.freeze({zoom,routeZoom,frameWidth,frameHeight,follow,project,unproject,routeFrame,projectRoute,cover});
})();
