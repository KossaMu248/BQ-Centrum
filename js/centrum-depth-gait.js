/* Optional shallow-ground projection for the existing source leg gait.
   It does not rotate or scale the actor, replace artwork, own a timer or move
   gameplay state. Original horizontal rendering can bypass this module. */
(() => {
  'use strict';
  const depthScale=.30,depthSpeed=52,walkSpeed=130,strideScale=.70,epsilon=1e-8;
  const finite=value=>typeof value==='number'&&Number.isFinite(value)?value:0;
  function distance(dx,dy){return Math.hypot(finite(dx),finite(dy)/depthScale);}
  function heading(vx,vy,face=1){
    vx=finite(vx);vy=finite(vy);const metricSpeed=distance(vx,vy);
    if(metricSpeed<epsilon||Math.abs(vy)<epsilon)return{x:1,y:0,metricSpeed,cacheKey:'horizontal',centrumWalk:true};
    const x=vx*(face<0?-1:1)/metricSpeed,y=vy/(depthScale*metricSpeed);
    // A bounded renderer cache may group these headings. Projection itself is
    // exact; nearby headings differ by at most half a pixel at a 200px actor.
    return{x,y,metricSpeed,cacheKey:'depth:'+Math.round(x*32)+':'+Math.round(y*32),centrumWalk:true};
  }
  function project(gait,direction){
    if(!gait||!direction||(!direction.centrumWalk&&Math.abs(finite(direction.y))<epsilon))return gait;
    const x=finite(direction.x),y=finite(direction.y),walk=!!direction.centrumWalk,stepScale=walk?strideScale:1;
    function foot(source){
      // Native Hermite swing recovery slightly overshoots its lateral half-step.
      // Bound only this added ground-depth component; the source lift/boot
      // recovery stays intact and every stance sample remains an exact projection.
      const halfStep=gait.cycleLength*.25,stride=Math.max(-halfStep,Math.min(halfStep,source.x));
      const groundDepth=stride*stepScale*depthScale*y;
      const lift=source.y*(walk?.75:1);
      return{...source,x:source.x*stepScale*x,y:lift+groundDepth,
        angle:source.angle*(walk?.65:1),shinAngle:source.shinAngle*(walk?.75:1),contactOffset:source.contactOffset*stepScale,
        groundDepth,nativeLift:lift};
    }
    return{...gait,near:foot(gait.near),far:foot(gait.far),
      bob:gait.bob*(walk?.5:1),sway:gait.sway*(walk?.5:1),roll:gait.roll*(walk?.55:1),
      pelvisSway:gait.pelvisSway*(walk?.55:1),pelvisRoll:gait.pelvisRoll*(walk?.55:1),
      centrumWalk:walk,groundMotion:{x,y,depthScale,cacheKey:direction.cacheKey,centrumWalk:walk},depthProjected:true};
  }
  window.BearlyCentrumDepthGait=Object.freeze({depthScale,depthSpeed,walkSpeed,strideScale,distance,strideDistance:(dx,dy)=>distance(dx,dy)/strideScale,metricDistance:distance,heading,project});
})();
