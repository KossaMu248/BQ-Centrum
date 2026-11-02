/* Authored stops along the ride, with a quiet civilian world behind the collision plane. */
(() => {
  'use strict';
  const A=()=>window.BearlyAtlas;
  // Placed scenes, not a repeating bakery strip. x uses the existing 42,000-unit route.
  const scenes=[
    {x:1500,key:'apartment',w:1040,label:'BACKSTUGEVÄGEN',role:'home'},
    {x:3600,key:'courtyard',w:680,label:'GÅRDEN',role:'home'},
    {x:5600,key:'workshop',w:620,label:'CYKELVERKSTAD',role:'workshop',door:0},
    {x:7700,key:'arcade',w:680,label:'HÄSSELBY CENTRUM',role:'shop'},
    {x:11325,key:'metro',w:900,label:'HÄSSELBY GÅRD',role:'metro'},
    {x:13750,key:'civic-hall',w:540,label:'PÅ TORGET',role:'square'},
    {x:15700,key:'pizzeria',w:680,label:'PIZZA & KEBAB',role:'pizza',door:.14},
    {x:17700,key:'library',w:800,label:'BIBLIOTEKET',role:'library'},
    {x:21400,key:'castle',w:360,label:'SLOTTSVÄGEN',role:'castle'},
    {x:24400,key:'greenhouse',w:540,label:'GRIMSTA TRÄDGÅRD',role:'park'},
    {x:31750,key:'boathouse',w:740,label:'MÄLARENS BÅTHUS',role:'water'},
    {x:35200,key:'cafe',w:735,label:'BAGERI VID VATTNET',role:'cafe',door:.203},
  ];
  const publicRoles=new Set(['shop','workshop','pizza','library','cafe','square','park','castle','water']);
  function entrance(b){return {x:b.x+(b.door||0)*b.w,halfWidth:48};}
  function placement(b,groundAt){
    const left=b.x-b.w*.5,right=b.x+b.w*.5,samples=[];
    for(let i=0;i<=12;i++){const x=left+(right-left)*i/12,y=groundAt(x);if(!Number.isFinite(y))return null;samples.push({x,y:y-99});}
    // A level foundation above the highest part of the slope, with stone down to the lawn.
    return {left,right,foot:Math.min(...samples.map(p=>p.y))-9,samples};
  }
  function foundation(c,p){
    c.save();c.fillStyle='#8d8b72';c.strokeStyle='#5b6652';c.lineWidth=1.3;c.beginPath();
    c.moveTo(p.left,p.foot);c.lineTo(p.right,p.foot);for(const q of [...p.samples].reverse())c.lineTo(q.x,q.y);c.closePath();c.fill();c.stroke();
    c.save();c.clip();c.strokeStyle='#c3b99a';
    for(let y=p.foot+8;y<Math.max(...p.samples.map(q=>q.y));y+=10){c.beginPath();c.moveTo(p.left,y);c.lineTo(p.right,y);c.stroke();}
    for(let x=p.left+20;x<p.right;x+=29){c.beginPath();c.moveTo(x,p.foot);c.lineTo(x,Math.max(...p.samples.map(q=>q.y)));c.stroke();}
    c.restore();c.restore();
  }
  function walkingAt(t,start,end,speed=25,pause=4,phase=0){
    const duration=(end-start)/speed,cycle=duration*2+pause*2;
    let a=((t+phase)%cycle+cycle)%cycle;
    if(a<pause)return {x:start,paused:true,flip:false};a-=pause;
    if(a<duration)return {x:start+a*speed,paused:false,flip:false};a-=duration;
    if(a<pause)return {x:end,paused:true,flip:true};a-=pause;
    return {x:end-a*speed,paused:false,flip:true};
  }
  let civilianTime=0,lastLifeTime=null;
  const residentAudit=new Map();
  function nearScene(x,pad=0){return scenes.some(b=>Math.abs(b.x-x)<b.w*.5+pad);}
  const birds=new Map();let previousX=0;
  const stats={scenes:0,residents:0,birds:0,scattered:0};
  function billboard(c,x,y,text){
    c.save();c.translate(x,y);c.strokeStyle='#5b6045';c.lineWidth=4;c.beginPath();c.moveTo(-49,-2);c.lineTo(-49,22);c.moveTo(49,-2);c.lineTo(49,22);c.stroke();c.fillStyle='#304f3f';c.strokeStyle='#283d2f';c.lineWidth=2;
    c.beginPath();c.roundRect(-68,-26,136,23,3);c.fill();c.stroke();c.fillStyle='#f1dfb3';c.font='900 10px Trebuchet MS';c.textAlign='center';c.fillText(text,0,-11);c.restore();
  }
  function bird(c,x,y,t,fly,seed){
    c.save();c.translate(x,y);if(fly){const flap=Math.sin(t*14+seed)*5;c.fillStyle='#6d7b78';c.strokeStyle='#354b45';c.lineWidth=1;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-9,-9-flap,-16,-2-flap);c.quadraticCurveTo(-9,-1,0,3);c.quadraticCurveTo(9,-1,16,-2-flap);c.quadraticCurveTo(9,-9-flap,0,0);c.fill();c.stroke();}
    c.fillStyle='#788785';c.strokeStyle='#34473e';c.lineWidth=.9;c.beginPath();c.ellipse(0,0,5.5,3.7,-.15,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#546d6d';c.beginPath();c.arc(4,-3,2.6,0,Math.PI*2);c.fill();c.fillStyle='#d4b776';c.beginPath();c.moveTo(6,-4);c.lineTo(9,-3);c.lineTo(6,-2);c.fill();c.fillStyle='#1f3129';c.fillRect(4,-4,1,1);if(!fly){c.strokeStyle='#b58d6e';c.beginPath();c.moveTo(-2,2);c.lineTo(-2,6);c.moveTo(2,2);c.lineTo(2,6);c.stroke();}c.restore();
  }
  function pathBase(s,x){return s.groundAt(x);}
  function steam(c,x,y,t,alpha=.24){
    c.save();c.lineCap='round';c.lineWidth=1.7;c.strokeStyle='#f3e5c7';
    for(let i=0;i<3;i++){const age=(t*.25+i*.33)%1;c.globalAlpha=alpha*(1-age);const yy=y-age*30;c.beginPath();c.moveTo(x+i*5,yy);c.bezierCurveTo(x-6+i*5,yy-7,x+6+i*5,yy-12,x+i*5,yy-18);c.stroke();}c.restore();
  }
  function estateEntrance(c,s,b,p){
    // The manor is a distant hill landmark. Its small painted door is not the
    // player's entrance: the near estate gate has the same 160px clearance as
    // the street's shops, with its own fully supported foreground threshold.
    const rearFoot=p.foot-30;
    c.save();c.fillStyle=window.BearlyWorld.material(c,'grass')||'#68794c';c.strokeStyle='#536345';c.lineWidth=2;c.beginPath();
    c.moveTo(p.left-35,s.groundAt(p.left-35)-105);
    c.quadraticCurveTo(b.x-b.w*.35,rearFoot-25,b.x,rearFoot-8);
    c.quadraticCurveTo(b.x+b.w*.35,rearFoot-25,p.right+35,s.groundAt(p.right+35)-105);
    for(const q of [...p.samples].reverse())c.lineTo(q.x,q.y);c.closePath();c.fill();c.stroke();c.restore();
    A().draw(c,'castle',b.x,rearFoot,b.w);
    const gateX=entrance(b).x,gateY=p.foot;
    c.save();c.translate(gateX,gateY);c.lineJoin='round';
    for(const side of [-1,1]){
      const x=side*89;c.fillStyle=window.BearlyWorld.material(c,'paving')||'#8d9279';c.strokeStyle='#4c5c48';c.lineWidth=2;c.beginPath();c.roundRect(x-12,-178,24,178,2);c.fill();c.stroke();
      c.fillStyle='#c3bea2';c.fillRect(x-15,-183,30,8);c.strokeRect(x-15,-183,30,8);
      c.strokeStyle='#64745b';c.lineWidth=1;for(let y=-158;y<-8;y+=23){c.beginPath();c.moveTo(x-11,y);c.lineTo(x+11,y);c.stroke();}
    }
    c.strokeStyle='#30483b';c.lineWidth=5;c.beginPath();c.moveTo(-77,-160);c.quadraticCurveTo(0,-207,77,-160);c.stroke();
    // Open gate leaves follow the posts, leaving the clear entry unobstructed.
    c.lineWidth=2;for(const side of [-1,1]){c.beginPath();c.moveTo(side*77,-154);c.lineTo(side*60,-141);c.lineTo(side*60,-5);c.lineTo(side*77,-12);c.stroke();for(let y=-125;y<-15;y+=22){c.beginPath();c.moveTo(side*77,y-12);c.lineTo(side*60,y);c.stroke();}}
    c.fillStyle='#304c3d';c.fillRect(-61,-194,122,19);c.fillStyle='#f1dfb3';c.font='bold 10px Trebuchet MS';c.textAlign='center';c.fillText('SLOTTSVÄGEN',0,-181);
    c.fillStyle='#aca58b';c.fillRect(-76,-4,152,5);c.strokeStyle='#777e65';c.lineWidth=1;c.strokeRect(-76,-4,152,5);c.restore();
  }
  function building(c,s,b){
    const p=placement(b,s.groundAt);if(!p)return;
    const foot=p.foot;foundation(c,p);
    if(b.key==='metro'){if(s.metro)window.BearlyWorld.station(c,b.x,foot,b.w);}
    else if(b.key==='cafe')window.BearlyWorld.cafe(c,b.x,foot,b.w);
    else if(b.key==='castle')estateEntrance(c,s,b,p);
    else A().draw(c,b.key,b.x,foot,b.w);
    // Warm open-window/cafe glow stays very restrained and belongs to the facade.
    if(['cafe','shop','pizza','workshop','library'].includes(b.role)){
      const shimmer=s.reducedMotion?1:.92+.08*Math.sin(s.time*1.1+b.x);
      c.save();c.globalAlpha=.035*shimmer;c.fillStyle='#ffd47b';c.beginPath();c.ellipse(b.x,foot-42,b.w*.25,27,0,0,Math.PI*2);c.fill();c.restore();
    }
    if(b.role==='cafe'){
      if(!s.reducedMotion)steam(c,b.x+80,foot-15,s.time,.28);
      const benchX=b.x+b.w*.65;
      if(!window.BearlyStreetLife?.overlaps?.(benchX,53))window.BearlyStreetProps.draw(c,'bench',benchX,foot+18,82,s.time);
    }
    if(b.role==='library'||b.role==='square'){
      billboard(c,b.x+b.w*.38,foot-4,b.role==='library'?'LÄS EN STUND':'VÄLKOMMEN TILL TORGET');
    }
    if(b.role==='water'){
      // A few shoreline ripples make each boathouse stop feel connected to Mälaren.
      c.save();c.strokeStyle='#d5dcc070';c.lineWidth=1.3;
      for(let j=0;j<3;j++){const offset=s.reducedMotion?0:Math.sin(s.time*.6+j)*4;c.beginPath();c.ellipse(b.x+b.w*.55+offset,foot-6-j*4,22+j*7,2.5,0,0,Math.PI);c.stroke();}c.restore();
    }
  }
  window.BearlyNeighbourhood={
    scenes,
    entrance,placement,walkingAt,
    scaleAudit:()=>scenes.map(b=>{const source={apartment:[807,124],courtyard:[682,160],workshop:[854,220],arcade:[765,180],metro:[1513,270],'civic-hall':[754,223],pizzeria:[919,216],library:[722,145],greenhouse:[695,206],boathouse:[739,160],cafe:[1319,287]}[b.key];return{key:b.key,width:b.w,estimatedDoorHeight:b.key==='castle'?160:source[1]*b.w/source[0],foregroundGate:b.key==='castle',bearHeight:145,adultHeight:128,teenHeight:120};}),
    canVisit:b=>publicRoles.has(b.role),
    nearestEntrance(x){return scenes.filter(b=>publicRoles.has(b.role)&&Math.abs(entrance(b).x-x)<=110).sort((a,b)=>Math.abs(entrance(a).x-x)-Math.abs(entrance(b).x-x))[0]||null;},
    entrances(c,s){
      for(const b of scenes){
        if(!publicRoles.has(b.role)||Math.abs(b.x-s.cameraX-s.W/2)>s.W)continue;
        const p=placement(b,s.groundAt),x=entrance(b).x,y=s.groundAt(x);if(!p||y===null)continue;
        c.save();c.fillStyle='#c5b89b';c.strokeStyle='#7b7860';c.lineWidth=2;
        c.beginPath();c.moveTo(x-19,p.foot);c.lineTo(x+19,p.foot);c.lineTo(x+36,y-70);c.lineTo(x-36,y-70);c.closePath();c.fill();c.stroke();
        // Level stair treads join the real door to the sloped pedestrian pavement.
        c.strokeStyle='#e0d3b5';for(let yy=p.foot+9;yy<y-75;yy+=9){c.beginPath();c.moveTo(x-22,yy);c.lineTo(x+22,yy);c.stroke();}
        c.fillStyle='#304f3f';c.fillRect(x+43,y-128,5,48);c.fillStyle='#f5df9d';c.fillRect(x+32,y-132,28,20);
        c.fillStyle='#304f3f';c.font='bold 15px sans-serif';c.textAlign='center';c.fillText('↳',x+46,y-117);c.restore();
      }
    },
    frontage:nearScene,
    fenceEnds:()=>scenes.filter(b=>['shop','workshop','pizza','cafe','square','library','metro','park','castle','water'].includes(b.role)).flatMap(b=>[b.x-b.w*.65-35,b.x+b.w*.65+35]),
    fenceGap:x=>scenes.some(b=>['shop','workshop','pizza','cafe','square','library','metro','park','castle','water'].includes(b.role)&&Math.abs(b.x-x)<b.w*.65+35),
    buildings(c,s){stats.scenes=0;for(const b of scenes){if(b.x+b.w*.7<s.cameraX-250||b.x-b.w*.7>s.cameraX+s.W+250)continue;building(c,s,b);stats.scenes++;}},
    life(c,s){
      stats.residents=0;stats.birds=0;residentAudit.clear();
      for(const n of window.BearlyVisits?.residents?.()||[]){if(n.kind==='gangster'||Math.abs(n.x-s.cameraX-s.W/2)>s.W)continue;stats.residents++;residentAudit.set(n.id,{x:n.x,start:n.home-285,end:n.home+285,paused:!n.moving,flip:n.face<0,role:n.variant,foot:(s.groundAt(n.x)||0)+n.depth});}
      const lifeTime=s.lifeTime??s.time;if(lastLifeTime!==null&&s.playing)civilianTime+=Math.max(0,Math.min(.1,lifeTime-lastLifeTime));lastLifeTime=lifeTime;
      if(s.bikeX<previousX-1000){birds.clear();stats.scattered=0;}previousX=s.bikeX;
      for(let i=0;i<scenes.length;i++){
        const b=scenes[i];if(b.x+650<s.cameraX-200||b.x-650>s.cameraX+s.W+200)continue;
        if(['shop','pizza','workshop','square','library','park','cafe'].includes(b.role)){
          const bx=b.x+b.w*.48,gy=s.groundAt(bx);if(gy===null)continue;
          if(!s.reducedMotion&&s.playing&&Math.abs(s.bikeX-bx)<210&&!birds.has(i)){birds.set(i,s.time);stats.scattered++;}
          const age=birds.has(i)?s.time-birds.get(i):-1,fly=age>=0&&age<6;
          for(let j=0;j<3;j++){const x=bx+(j-1)*15+(fly?age*(20+j*7):0),y=(s.groundAt(x)??gy)-89+(fly?-Math.sin(Math.min(age/6,1)*Math.PI)*70-age*7:0);bird(c,x,y,s.time,fly,i+j);stats.birds++;}
        }
      }
    },
    audit:()=>({...stats,residentTime:civilianTime,residentsOnRoute:[...residentAudit.values()],sceneCount:scenes.length,uniqueBuildingKeys:new Set(scenes.map(s=>s.key)).size,placements:scenes.map(b=>({x:b.x,key:b.key,label:b.label}))})
  };
})();
