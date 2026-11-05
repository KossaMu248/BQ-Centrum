/* A light material/ink pass over the familiar bear art. Rig and silhouette stay intact. */
(() => {
  'use strict';
  const cache=new WeakMap(),compiled={"bear_pedal_3.webp":"assets/cache/hero-cycling-v19/bear_pedal_3.png","bear_pose_pedal.webp":"assets/cache/hero-cycling-v19/bear_pose_pedal.png","bear_pose_coast.webp":"assets/cache/hero-cycling-v19/bear_pose_coast.png","bear_pose_brake.webp":"assets/cache/hero-cycling-v19/bear_pose_brake.png","bear_pose_wheelie.webp":"assets/cache/hero-cycling-v19/bear_pose_wheelie.png","bear_pose_jump.webp":"assets/cache/hero-cycling-v19/bear_pose_jump.png","bear_pose_land.webp":"assets/cache/hero-cycling-v19/bear_pose_land.png","bear_pose_hurt.webp":"assets/cache/hero-cycling-v19/bear_pose_hurt.png","bear_pedal_0.webp":"assets/cache/hero-cycling-v19/bear_pedal_0.png","bear_pedal_1.webp":"assets/cache/hero-cycling-v19/bear_pedal_1.png","bear_pedal_2.webp":"assets/cache/hero-cycling-v19/bear_pedal_2.png","bear_upper.webp":"assets/cache/hero-cycling-v19/bear_upper.png","bear_upper_rightarm_injured.webp":"assets/cache/hero-cycling-v19/bear_upper_rightarm_injured.png","bear_leg_clean.webp":"assets/cache/hero-cycling-v19/bear_leg_clean.png","bear_leg_original.webp":"assets/cache/hero-cycling-v19/bear_leg_original.png"};
  const stats={compiledDraws:0,legacyBuilds:0,legacyLargeBuilds:0,legacyPixels:0,eyeRepairs:0,eyeRepairBytes:0};
  const eyeCache=new WeakMap(),eyeRegions=[[182,42,20,22],[209,47,7,9]];
  const filename=im=>String(im?.src||'').split('/').pop().split('?')[0];
  function intactEyes(im,reference){
    // The original injured-arm cel has transparent holes in both eye whites.
    // Reuse only the matching intact coast cel's native eye pixels underneath;
    // keep the authored injured body, missing arm and every other alpha intact.
    const saved=eyeCache.get(im);if(saved?.reference===reference)return saved.canvas;
    const body=sprite(im),eyes=sprite(reference),canvas=document.createElement('canvas');canvas.width=291;canvas.height=309;
    const g=canvas.getContext('2d');g.drawImage(body,0,0);g.globalCompositeOperation='destination-over';
    for(const rect of eyeRegions)g.drawImage(eyes,...rect,...rect);
    g.globalCompositeOperation='source-over';eyeCache.set(im,{reference,canvas});stats.eyeRepairs++;stats.eyeRepairBytes+=canvas.width*canvas.height*4;return canvas;
  }
  function source(url){const name=String(url||'').split('/').pop().split('?')[0];return compiled[name]||url;}
  function prepared(im){return String(im?.src||'').includes('/assets/cache/hero-cycling-v19/');}
  function sprite(im,reference=null){
    if(!im?.naturalWidth)return im;
    if(/^bear_upper_rightarm_injured\.(?:png|webp)$/.test(filename(im))&&/^bear_pose_coast\.(?:png|webp)$/.test(filename(reference))&&im.naturalWidth===291&&im.naturalHeight===309&&reference?.naturalWidth===291&&reference.naturalHeight===309)return intactEyes(im,reference);
    if(prepared(im)){stats.compiledDraws++;return im;}
    if(cache.has(im))return cache.get(im);
    try{
      stats.legacyBuilds++;stats.legacyPixels+=im.naturalWidth*im.naturalHeight;if(im.naturalWidth*im.naturalHeight>10000)stats.legacyLargeBuilds++;
      const layer=document.createElement('canvas');layer.width=im.naturalWidth;layer.height=im.naturalHeight;
      const g=layer.getContext('2d',{willReadFrequently:true});
      g.filter='contrast(1.045) saturate(1.06)';g.drawImage(im,0,0);g.filter='none';
      const pixels=g.getImageData(0,0,layer.width,layer.height);
      for(let i=3;i<pixels.data.length;i+=4)if(pixels.data[i]<25)pixels.data[i]=0;
      g.putImageData(pixels,0,0);
      g.globalCompositeOperation='source-atop';
      const light=g.createLinearGradient(0,0,layer.width,layer.height);
      light.addColorStop(0,'#ffc97116');light.addColorStop(.5,'#eac58104');light.addColorStop(1,'#3446320b');
      g.fillStyle=light;g.fillRect(0,0,layer.width,layer.height);g.globalCompositeOperation='source-over';
      const ink=document.createElement('canvas');ink.width=layer.width;ink.height=layer.height;
      const ic=ink.getContext('2d');ic.drawImage(layer,0,0);ic.globalCompositeOperation='source-in';ic.fillStyle='#272b22';ic.fillRect(0,0,ink.width,ink.height);
      const result=document.createElement('canvas');result.width=layer.width;result.height=layer.height;
      const out=result.getContext('2d');out.globalAlpha=.78;
      for(const [x,y] of [[-1,0],[1,0],[0,-1],[0,1]])out.drawImage(ink,x,y);
      out.globalAlpha=1;out.drawImage(layer,0,0);cache.set(im,result);return result;
    }catch(_){cache.set(im,im);return im;}
  }
  window.BearlyHero={sprite,source,audit:()=>({...stats,compiledSources:Object.keys(compiled).length})};
})();
