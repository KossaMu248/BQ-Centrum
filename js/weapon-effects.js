/* Shared five-heart weapon balance and bounded, cosmetic contact animations. */
(() => {
  'use strict';
  const TAU=Math.PI*2,clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const table=Object.freeze({
    rock:Object.freeze({kind:'rock',label:'ROCK',damage:10,hearts:.5,groundDuration:.65,bearDuration:.55}),
    bottle:Object.freeze({kind:'bottle',label:'MOLOTOV',damage:30,hearts:1.5,groundDuration:2.4,bearDuration:1.15}),
    firecracker:Object.freeze({kind:'firecracker',label:'FIRECRACKER',damage:20,hearts:1,groundDuration:1.3,bearDuration:.9})
  });
  function normalize(kind){
    const name=String(kind||'rock').toLowerCase();
    return name==='molotov'?'bottle':name==='dynamite'?'firecracker':table[name]?name:'rock';
  }
  const profile=kind=>table[normalize(kind)];
  const targetName=target=>target==='ground'?'ground':'bear';
  const duration=(kind,target='ground')=>profile(kind)[targetName(target)==='ground'?'groundDuration':'bearDuration'];
  let lastDraw=null;
  const noise=(seed,n)=>{const q=Math.sin(seed*17.17+n*71.13)*43758.5453;return q-Math.floor(q);};
  function oval(c,x,y,rx,ry,color,alpha=1){
    c.globalAlpha=alpha;c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();
  }
  function flame(c,x,y,height,width,wind,alpha){
    c.globalAlpha=alpha;c.fillStyle='#e96723';c.strokeStyle='#8a3a24';c.lineWidth=.8;
    c.beginPath();c.moveTo(x-width*.6,y);
    c.bezierCurveTo(x-width,y-height*.36,x+width*.1+wind,y-height*.65,x+wind,y-height);
    c.bezierCurveTo(x+width*.7+wind,y-height*.55,x+width,y-height*.25,x+width*.55,y);
    c.closePath();c.fill();c.stroke();
    c.fillStyle='#ffc45a';c.beginPath();c.moveTo(x-width*.34,y-1);
    c.quadraticCurveTo(x-width*.48,y-height*.27,x+wind*.4,y-height*.62);
    c.quadraticCurveTo(x+width*.5,y-height*.23,x+width*.29,y-1);c.fill();
    c.fillStyle='#ffedab';c.beginPath();c.ellipse(x,y-height*.11,width*.16,height*.12,0,0,TAU);c.fill();
  }
  function smoke(c,age,life,seed,count,spread,reduced){
    for(let i=0;i<count;i++){
      const p=clamp((age-i*.06)/Math.max(.2,life-.2),0,1);if(!p||p===1)continue;
      const drift=(noise(seed,i)-.5)*spread*(reduced?.12:p),y=-5-p*(reduced?15:42+i*5);
      oval(c,drift,y,5+p*(8+i),4+p*(6+i*.7),'#53594e',Math.sin(p*Math.PI)*.28);
    }
  }
  function shards(c,age,life,seed,count,ground,reduced,glass){
    const fade=clamp(1-age/life,0,1);if(!fade)return 0;
    for(let i=0;i<count;i++){
      const a=ground?-Math.PI+(i+.5)/count*Math.PI:TAU*(i+.25)/count;
      const v=(glass?45:25)+noise(seed,i+20)*(glass?65:38),travel=reduced?Math.min(age,.08):age;
      const x=Math.cos(a)*v*travel,y=Math.sin(a)*v*travel+travel*travel*95;
      c.save();c.translate(x,ground?Math.min(-1,y):y);c.rotate(i*1.9+travel*(i%2?7:-9));
      c.globalAlpha=fade;c.fillStyle=glass?['#4a7754','#9ab982','#c8d5a9'][i%3]:['#6a6656','#a99d82','#716e61'][i%3];
      c.strokeStyle=glass?'#31583f':'#4b4e42';c.lineWidth=.6;
      const r=1.3+noise(seed,i+60)*1.7;c.beginPath();c.moveTo(-r,-r*.25);c.lineTo(r*.7,-r);c.lineTo(r,r*.6);c.lineTo(-r*.35,r*.8);c.closePath();c.fill();c.stroke();c.restore();
    }
    return count;
  }
  function burst(c,x,y,radius,alpha,reduced){
    c.globalAlpha=alpha*(reduced?.22:.8);c.fillStyle='#ffe7a0';c.beginPath();
    for(let i=0;i<20;i++){const a=i*Math.PI/10,r=radius*(i%2?.42:1);i?c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r):c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}
    c.closePath();c.fill();
  }
  function molotov(c,age,seed,ground,reduced,metrics){
    if(ground){
      const burn=clamp(1-age/2.4,0,1),spread=32+Math.min(age,.3)*44;
      oval(c,0,1,spread+9,7,'#332f26',burn*.38);
      oval(c,0,-1,spread,4,'#a95123',burn*.55);
      // Flame tongues persist on the road; this residue is visual, never damage.
      const envelope=Math.min(1,age*13+.35)*burn;
      const count=reduced?4:8;
      for(let i=0;i<count;i++){
        const t=count===1?0:i/(count-1),x=(t-.5)*spread*1.75;
        const flicker=reduced?1:.87+.13*Math.sin(age*13+i*2.7),h=(30+noise(seed,i+100)*28)*envelope*flicker;
        if(h>1){flame(c,x,0,h,7+noise(seed,i)*3,reduced?0:Math.sin(age*9+i)*3,Math.min(1,burn*1.8));metrics.flames++;}
      }
      if(age<.2)burst(c,0,-9,24,1-age/.2,reduced);
      smoke(c,age,2.4,seed,reduced?2:4,58,reduced);
    }else{
      const flare=clamp(1-age/.7,0,1),count=reduced?3:5;
      if(age<.14)burst(c,0,0,22,1-age/.14,reduced);
      for(let i=0;i<count;i++){
        const x=(i-(count-1)/2)*7,y=(i%2)*6;
        const h=(18+noise(seed,i+110)*16)*flare;
        if(h>1){c.save();c.translate(x,y);c.rotate((i-(count-1)/2)*.24);flame(c,0,0,h,6+noise(seed,i+120)*2,reduced?0:Math.sin(age*10+i)*3,flare*.9);c.restore();metrics.flames++;}
      }
      // Short dark smudges remain near the actual torso contact, not a road pool.
      c.globalAlpha=clamp(1-age/1.15,0,1)*.5;c.strokeStyle='#49463b';c.lineWidth=2;
      for(let i=0;i<3;i++){c.beginPath();c.moveTo(-9+i*8,3);c.lineTo(-5+i*8,11-i*2);c.stroke();}
      smoke(c,age,1.15,seed,reduced?1:2,25,reduced);
    }
    metrics.fragments=shards(c,age,.65,seed,reduced?3:10,ground,reduced,true);
  }
  function firecracker(c,age,seed,ground,reduced,direction,metrics){
    const life=ground?1.3:.9,flash=clamp(1-age/.13,0,1);
    if(ground){
      oval(c,0,1,19+Math.min(age,.3)*21,4,'#39372e',clamp(1-age/1.3,0,1)*.47);
      if(age<.35){c.globalAlpha=(1-age/.35)*.6;c.strokeStyle='#dfa85a';c.lineWidth=1.7;c.beginPath();c.ellipse(0,0,8+age*115,3+age*29,0,0,TAU);c.stroke();}
      if(flash)burst(c,0,-3,25+Math.min(age,.1)*80,flash,reduced);
    }else{
      if(flash)burst(c,-direction*3,0,18+Math.min(age,.1)*50,flash,reduced);
      // Directional contact/recoil ticks distinguish a hit from a road detonation.
      if(age<.28){
        c.globalAlpha=1-age/.28;c.strokeStyle='#eac888';c.lineWidth=2;
        for(let i=0;i<3;i++){const yy=(i-1)*12,offset=age*(reduced?8:35);c.beginPath();c.moveTo(direction*(13+offset),yy);c.lineTo(direction*(22+offset),yy+(i-1)*3);c.stroke();}
      }
    }
    const count=age<.48?(reduced?4:ground?14:8):0;metrics.sparks=count;
    for(let i=0;i<count;i++){
      const a=ground?i/count*TAU+seed*.1:-Math.PI*.9+i/count*Math.PI*1.35;
      const t=reduced?Math.min(age,.06):age,v=ground?48+noise(seed,i)*55:34+noise(seed,i)*36;
      const x=Math.cos(a)*v*t*(ground?1:direction),y=Math.sin(a)*v*t+t*t*35;
      c.globalAlpha=clamp(1-age/.48,0,1);c.strokeStyle=i%3?'#ee9b3d':'#ffe19a';c.lineWidth=i%3?1.1:1.8;
      c.beginPath();c.moveTo(x-Math.cos(a)*4,y-Math.sin(a)*4);c.lineTo(x,y);c.stroke();
    }
    smoke(c,age,life,seed,reduced?1:ground?4:2,ground?42:22,reduced);
    metrics.fragments=age<.75?(reduced?2:ground?6:4):0;
    for(let i=0;i<metrics.fragments;i++){
      const t=reduced?Math.min(age,.07):age,a=-Math.PI+i*.51,x=Math.cos(a)*t*(25+i*6),y=Math.sin(a)*t*43+t*t*65;
      c.save();c.translate(x,ground?Math.min(-1,y):y);c.rotate(i+t*8);c.globalAlpha=clamp(1-age/.75,0,1);c.fillStyle=i%2?'#a23d2f':'#cfaa6a';c.fillRect(-1.6,-1.1,3.2,2.2);c.restore();
    }
  }
  function rock(c,age,seed,ground,reduced,metrics){
    const fade=clamp(1-age/.55,0,1);
    if(!ground&&age<.18){c.globalAlpha=(1-age/.18)*.85;c.strokeStyle='#dfc185';c.lineWidth=1.6;for(let i=0;i<5;i++){const a=i*TAU/5;c.beginPath();c.moveTo(Math.cos(a)*6,Math.sin(a)*6);c.lineTo(Math.cos(a)*13,Math.sin(a)*13);c.stroke();}}
    if(ground)oval(c,0,1,8+age*16,2,'#5a5848',fade*.25);
    const count=reduced?1:ground?3:2;
    for(let i=0;i<count;i++)oval(c,(i-(count-1)/2)*(4+age*12),-age*(reduced?5:15),3+age*11,2+age*8,'#9a8970',fade*.35);
    metrics.fragments=shards(c,age,.55,seed,reduced?2:ground?6:4,ground,reduced,false);
  }
  function draw(c,e,x,y,options={}){
    if(!e)return false;const kind=normalize(e.weapon||e.kind),target=targetName(e.target??(e.groundHit===false?'bear':'ground')),life=duration(kind,target),age=Number(e.age)||0;
    if(age<0||age>=life)return false;
    const scale=Number.isFinite(options.scale)?clamp(options.scale,.1,5):1,reduced=!!options.reducedMotion,seed=Number.isFinite(e.seed)?e.seed:(Number(e.id)||1),direction=e.direction<0?-1:1;
    const metrics={weapon:kind,target,age,duration:life,flames:0,sparks:0,fragments:0,reducedMotion:reduced};
    c.save();c.translate(x,y);c.scale(scale,scale);c.lineCap='round';c.lineJoin='round';
    if(kind==='bottle')molotov(c,age,seed,target==='ground',reduced,metrics);
    else if(kind==='firecracker')firecracker(c,age,seed,target==='ground',reduced,direction,metrics);
    else rock(c,age,seed,target==='ground',reduced,metrics);
    c.restore();lastDraw=metrics;return true;
  }
  function createPool({maxEffects=16}={}){
    const limit=clamp(Math.floor(maxEffects)||16,1,32);let time=0,serial=0,effects=[];
    return {
      impact(kind,target,x,y,options={}){const weapon=normalize(kind),e={id:++serial,kind:weapon,weapon,target:targetName(target),x,y,seed:options.seed??serial,direction:options.direction??1,at:time,duration:duration(weapon,target)};effects.push(e);if(effects.length>limit)effects.shift();return e.id;},
      update(dt){time+=Number.isFinite(dt)?Math.max(0,dt):0;effects=effects.filter(e=>time-e.at<e.duration);},
      draw(c,project=null,options={}){for(const e of effects){const p=project?project(e):e;if(p)draw(c,{...e,age:time-e.at},p.x,p.y,{...options,scale:p.scale??options.scale});}},
      snapshot(){return effects.map(e=>({...e,age:time-e.at}));},
      clear(){effects=[];},
      stats(){return {count:effects.length,limit,time};}
    };
  }
  window.BearlyWeapons=Object.freeze({table,normalize,profile,damage:kind=>profile(kind).damage,hearts:kind=>profile(kind).hearts,heartHP:20,totalHearts:5});
  window.BearlyWeaponEffects=Object.freeze({draw,duration,createPool,audit:()=>lastDraw?{...lastDraw}:null});
})();
