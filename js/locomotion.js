/* Continuous two-leg locomotion. A planted sole moves back at ground speed. */
(() => {
  'use strict';
  const TAU=Math.PI*2,DUTY=.5,EXCURSION=.18,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
  const cycleLength=(height=225)=>height*EXCURSION*2/DUTY;
  function keyed(t,points){for(let i=1;i<points.length;i++)if(t<=points[i][0]){const [a,x]=points[i-1],[b,y]=points[i];return x+(y-x)*ease((t-a)/(b-a));}return points.at(-1)[1];}
  function foot(phase,height=225,weight=1){
    const p=((phase%1)+1)%1,half=height*EXCURSION;
    if(p<DUTY)return {x:half*(1-2*p/DUTY)*weight,y:0,angle:(-.13*(1-ease(p/.12))+.34*ease((p-(DUTY-.16))/.16))*weight,shinAngle:(-.22+.45*ease(p/DUTY))*weight,kneeFlex:0,contactOffset:(p<.18?-height*.075:p>DUTY-.16?height*.10:0)*weight,stance:true};
    const t=(p-DUTY)/(1-DUTY),t2=t*t,t3=t2*t;
    // Match ground-relative velocity at toe-off and heel strike. A rounded
    // vertical arc also reaches the floor at zero vertical speed.
    const tangent=-2*half*(1-DUTY)/DUTY;
    const x=(2*t3-3*t2+1)*-half+(t3-2*t2+t)*tangent+(-2*t3+3*t2)*half+(t3-t2)*tangent;
    return {x:x*weight,y:-height*.062*16*t2*(1-t)*(1-t)*weight,angle:keyed(t,[[0,.34],[.18,.48],[.65,-.04],[1,-.13]])*weight,shinAngle:keyed(t,[[0,.23],[.32,.92],[.6,.55],[1,-.22]])*weight,kneeFlex:Math.sin(Math.PI*t)*weight,contactOffset:height*(.10*(1-ease(t/.28))-.075*ease((t-.78)/.22))*weight,stance:false};
  }
  function pose(distance,height=225,weight=1){
    weight=clamp(weight,0,1);
    // Two planted excursions per complete cycle, rather than short rapid taps.
    const cycle=cycleLength(height),phase=distance/cycle;
    const far=foot(phase+.5,height,weight),near=foot(phase,height,weight);
    return {far,near,phase:((phase%1)+1)%1,cycleLength:cycle,
      bob:height*.011*Math.cos(phase*TAU*2)*weight,
      sway:height*.014*Math.sin(phase*TAU+.20)*weight,
      roll:(.014-.018*Math.sin(phase*TAU+.30))*weight,
      pelvisSway:-height*.012*Math.sin(phase*TAU)*weight,
      pelvisRoll:.024*Math.sin(phase*TAU)*weight};
  }
  function knee(hip,ankle,thigh,shin){
    const dx=ankle.x-hip.x,dy=ankle.y-hip.y,actual=Math.max(.01,Math.hypot(dx,dy)),d=clamp(actual,Math.abs(thigh-shin)+.001,thigh+shin-.001);
    const along=(thigh*thigh-shin*shin+d*d)/(2*d),out=Math.sqrt(Math.max(0,thigh*thigh-along*along));
    return {x:hip.x+dx/actual*along+dy/actual*out,y:hip.y+dy/actual*along-dx/actual*out};
  }
  window.BearlyLocomotion={pose,knee,cycleLength,stanceDuty:DUTY,excursion:EXCURSION};
})();
