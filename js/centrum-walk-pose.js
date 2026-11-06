/* Optional source-art walking articulation. Distances are fractions of actor
   height; rotations are radians. This sampler never changes the foot paths. */
(() => {
  'use strict';
  const TAU=Math.PI*2,DUTY=.5;
  const finite=value=>typeof value==='number'&&Number.isFinite(value)?value:0;
  const wrap=value=>((finite(value)%1)+1)%1;
  function knee(phase){
    const p=wrap(phase),stance=p<DUTY,t=stance?p/DUTY:(p-DUTY)/(1-DUTY);
    // Both boundaries have zero slope. A supporting knee stays lightly flexed;
    // its opposite leg folds clearly during recovery, without moving the boot.
    const arc=Math.sin(Math.PI*t)**2;
    return .003+(stance?.004:.028)*arc;
  }
  function sample(gait,height,weight=1){
    if(!gait||!(gait.centrumWalk||gait.sourceWalk))return null;
    // Height is accepted for the renderer contract, but all output is normalized
    // so canonical worker rasters and actual actor sizes share the same pose.
    const w=Math.max(0,Math.min(1,finite(weight)));
    if(w===0)return{chestLean:0,chestBob:0,chestSway:0,pelvisRoll:0,pelvisDrop:0,shoulderTurn:0,headNod:0,knees:{near:0,far:0}};
    const phase=wrap(gait.phase),step=phase*TAU,stride=Math.sin(step),transfer=Math.sin(step*2),settle=Math.cos(step*2);
    return{
      chestLean:(.032+.009*transfer)*w,
      chestBob:.012*settle*w,
      chestSway:.006*stride*w,
      pelvisRoll:.022*stride*w,
      pelvisDrop:.002*(1+settle)*w,
      shoulderTurn:-.028*stride*w,
      headNod:.012*transfer*w,
      // Positive lateral bend follows the authored forward direction (+x in
      // the unmirrored rig). Consumers scale by height, then apply facing.
      knees:{near:knee(phase)*w,far:knee(phase+.5)*w}
    };
  }
  window.BearlyCentrumWalkPose=Object.freeze({sample});
})();
