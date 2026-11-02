/* Restrained ground-level autumn detail. Shares the existing scene clock; no RAF,
   timers, scene-wide filters or character transforms. */
(() => {
  'use strict';
  const TAU=Math.PI*2,clock=new Map(),outdoors=['metro-square','shopping-arcade','service-courtyard'];
  const motion=typeof window.matchMedia==='function'?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  const reduced=()=>!!motion?.matches;
  let current=null,drawn=0;
  function update(dt,id,options={}){
    current=id;if(options.paused||reduced()||!outdoors.includes(id))return;
    clock.set(id,(clock.get(id)||0)+Math.min(.05,Math.max(0,Number(dt)||0)));
  }
  function wind(id){return reduced()?0:Math.sin((clock.get(id)||0)*.58)*.65+Math.sin((clock.get(id)||0)*.91)*.22;}
  function leaf(c,x,y,size,angle,index){
    // Same small pointed leaf motif and ochre/russet family as illustrated-world.
    c.save();c.translate(x,y);c.rotate(angle);c.scale(size,size);
    c.beginPath();[[-.7,0],[-1,-.65],[-.2,-.5],[0,-1],[.3,-.35],[1,-.45],[.7,.2],[.2,.5]].forEach(([px,py],i)=>i?c.lineTo(px,py):c.moveTo(px,py));
    c.closePath();c.fillStyle=['#bf842e','#cfa14c','#a86736','#b5a34f'][index%4];c.fill();
    c.strokeStyle='#805f35';c.lineWidth=.13;c.beginPath();c.moveTo(0,-.65);c.lineTo(0,.75);c.stroke();c.restore();
  }
  function drawFloor(c,id,state={},options={}){
    drawn=0;if(reduced()||!outdoors.includes(id))return;
    const s=window.BearlyCentrumScenes?.get(id),f=s?.floor;if(!f)return;
    const t=clock.get(id)||0,w=f.right-f.left-100,h=f.bottom-f.top-100;
    c.save();c.beginPath();c.rect(f.left+25,f.top+30,f.right-f.left-50,f.bottom-f.top-55);c.clip();
    for(let i=0;i<7;i++){
      const drift=t*(4.4+i*.31),x=f.left+45+((i*167.3+drift)%w),y=f.top+65+((i*79.7+t*(1.0+i*.08))%h)+Math.sin(t*.65+i)*2;
      c.globalAlpha=.68;leaf(c,x,y,3.0+(i%3)*.55,i*2.17+Math.sin(t*.7+i)*.17,i);drawn++;
    }
    c.restore();
  }
  window.BearlyCentrumAtmosphere={update,drawFloor,wind,audit:()=>({sceneId:current,reducedMotion:reduced(),clock:clock.get(current)||0,drawnLeaves:drawn,maxLeaves:7,layer:'floor-before-foot-sorted-objects-and-actors',fullSceneTransform:false,loops:0})};
})();
