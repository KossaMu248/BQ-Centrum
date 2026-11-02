/* Sidewalk routes and real street furniture shared by ambient NPC routines. */
(() => {
  'use strict';
  // The old scrolling hedge is cut at its left edge. This complete planted
  // verge has natural alpha edges and the same useful cover height.
  const cover={x:8,y:34,w:2164,h:659,foot:688,width:248},bush=new Image();
  let coverTile=null;
  bush.onload=()=>{
    const tile=document.createElement('canvas'),scale=cover.width*2/cover.w;
    tile.width=cover.width*2;tile.height=Math.ceil(cover.h*scale);
    tile.dataset.sourceAsset='autumn-verge.png';tile.dataset.sourceRect=[cover.x,cover.y,cover.w,cover.h].join(',');
    tile.getContext('2d').drawImage(bush,cover.x,cover.y,cover.w,cover.h,0,0,tile.width,cover.h*scale);
    coverTile=tile;
  };
  bush.src='assets/art/autumn-verge.png';
  let cacheKey='',locals=[],gangLocals=[],furniture=[];
  const painted=new Map(),heard=new Set();let audioRequests=0,lastSoundAt=-99;
  function prepare(scenes,finish,count,gangs=[]){
    const key=finish+':'+count+':'+gangs.map(n=>n.id).join(',');if(cacheKey===key)return;
    cacheKey=key;locals=[];gangLocals=[];furniture=[];
    const safe=x=>Math.max(100,Math.min(finish-100,x));
    function prop(id,kind,x,depth=-82){
      const p={id,kind,x:safe(x),depth,seatHeight:38};furniture.push(p);return p;
    }
    const hide=p=>({id:p.id,kind:p.kind==='bush'?'bush':'bin',x:p.x+(p.kind==='bin'?24:0),depth:p.depth-4,duration:10});
    const rest=(p,kind,duration)=>({...p,kind,duration});
    const west=prop('promenade-bench-west','bench',2220,-84),east=prop('promenade-bench-east','bench',2680,-84);
    const smoke=prop('promenade-smoke','bin',2930,-82),leftBush=prop('promenade-bush-west','bush',1980,-80),rightBush=prop('promenade-bush-east','bush',3190,-80);
    const refuge=[hide(leftBush),hide(rightBush),hide(smoke)];
    locals.push(
      {id:'promenade-walker',variant:0,x:2460,depth:-64,sidewalkDepth:-64,patrol:true,routeMin:2080,routeMax:3360,walkSpeed:56,
        restSpots:[{id:'promenade-pause',kind:'idle',x:2460,depth:-64,duration:4}],hideSpots:refuge},
      {id:'civilian-reader',variant:9,x:east.x,depth:east.depth,sidewalkDepth:-64,patrol:true,civilian:true,routeMin:2300,routeMax:3530,walkSpeed:53,
        restSpots:[rest(east,'newspaper',14),{id:'promenade-east-pause',kind:'idle',x:3410,depth:-64,duration:4}],hideSpots:refuge},
      {id:'civilian-smoker',variant:10,x:smoke.x,depth:smoke.depth,sidewalkDepth:-64,patrol:true,civilian:true,routeMin:2470,routeMax:3760,walkSpeed:48,
        restSpots:[rest(smoke,'smoke',13),rest(east,'bench',9)],hideSpots:refuge,
        schedule:{period:110,on:65,offset:15,entryX:3760,exitX:3760}},
      {id:'civilian-bench',variant:11,x:west.x,depth:west.depth,sidewalkDepth:-64,patrol:true,civilian:true,routeMin:1540,routeMax:2840,walkSpeed:44,
        restSpots:[rest(west,'bench',12),rest(west,'newspaper',11),{id:'promenade-west-pause',kind:'idle',x:1700,depth:-64,duration:6}],hideSpots:refuge}
    );
    // Two local slots per later stop, with occasional older visitors. The first
    // promenade is deliberately small enough to read as an ordinary street.
    scenes.forEach((scene,i)=>{
      if(i<2)return;
      const base=scene.x,depth=-64-(i%2)*4;
      const bench=prop(scene.key+'-life-bench','bench',base+scene.w*.5+120,-84);
      const bin=prop(scene.key+'-life-bin','bin',bench.x+170,-82);
      const shrubs=[prop(scene.key+'-life-bush-left','bush',base-Math.max(700,scene.w*.5+250),-80),prop(scene.key+'-life-bush-right','bush',base+Math.max(850,scene.w*.5+580),-80)];
      const spots=[...shrubs.map(hide),hide(bin)];
      const visitor=9+i%3;
      locals.push({id:'civilian-'+scene.key,variant:visitor,x:bench.x,depth,sidewalkDepth:depth,civilian:true,patrol:true,
        routeMin:safe(base-650),routeMax:safe(base+1000),walkSpeed:visitor===11?44:52,
        restSpots:[rest(bench,i%2?'newspaper':'bench',11+i%4),rest(bin,'smoke',8)],hideSpots:spots,
        schedule:{period:110+i%3*15,on:62,offset:i*17,entryX:safe(base+1000),exitX:safe(base+1000)}});
      locals.push({id:'walker-'+scene.key,variant:i%6,x:safe(base-440),depth,sidewalkDepth:depth,patrol:true,
        routeMin:safe(base-850),routeMax:safe(base+800),walkSpeed:54+i%3*3,hideSpots:spots,
        restSpots:[{id:scene.key+'-door-pause',kind:'idle',x:safe(base-440),depth,duration:3}],
        schedule:{period:100+i%4*12,on:66,offset:i*11,entryX:safe(base-850),exitX:safe(base+800)}});
      if([2,6,10].includes(i)){
        const variant=6+[2,6,10].indexOf(i);
        locals.push({id:'neighbour-'+scene.key,variant,x:safe(base+520),depth,sidewalkDepth:depth,civilian:true,patrol:true,
          routeMin:safe(base-400),routeMax:safe(base+950),walkSpeed:47,hideSpots:spots,
          restSpots:[{id:scene.key+'-neighbour-pause',kind:'idle',x:safe(base+520),depth,duration:8}],
          schedule:{period:135,on:56,offset:i*13,entryX:safe(base+950),exitX:safe(base+950)}});
      }
    });
    // Gang members keep stable IDs and homes. One member of each crew has a
    // real foreground prop to linger behind; other members chat nearby.
    const crews=new Map();
    for(const seed of gangs){const crewId=seed.crewId||String(seed.id).replace(/-\d+$/,'');if(!crews.has(crewId))crews.set(crewId,[]);crews.get(crewId).push(seed);}
    let crewIndex=0;
    for(const [crewId,members]of crews){
      const first=members[0],kind=crewIndex++%2?'utility':'firebin',coverProp=prop(crewId+'-hangout-cover',kind,first.x,-94);
      coverProp.width=kind==='utility'?88:72;coverProp.footprintHalf=kind==='utility'?64:48;
      members.forEach((seed,index)=>{
        const behind=index===0,depth=seed.depth??-102,spot={id:coverProp.id,kind:coverProp.kind,x:coverProp.x,depth:coverProp.depth-8,width:coverProp.width};
        gangLocals.push({...seed,kind:'gangster',crewId,civilian:false,hostile:false,patrol:false,
          face:seed.face||(index%2?-1:1),x:behind?spot.x:seed.x,depth:behind?spot.depth:depth,
          homeHangout:{x:behind?spot.x:seed.x,depth:behind?spot.depth:depth},coverSpots:behind?[spot]:[]});
      });
    }
  }
  function seeds(scenes,finish,count,gangs=[]){prepare(scenes,finish,count,gangs);return [...locals,...gangLocals];}
  function overlaps(x,halfWidth=0){
    return furniture.some(p=>Math.abs(p.x-x)<halfWidth+(p.footprintHalf??(p.kind==='bench'?108:p.kind==='bin'?45:124)));
  }
  function propsNear(cameraX,width=1160){return furniture.filter(p=>p.x>cameraX-260&&p.x<cameraX+width+260);}
  function beginFrame(){painted.clear();}
  function drawProp(c,p,groundAt,time=0){
    const g=groundAt(p.x);if(g==null)return;
    const y=g+p.depth;
    if(p.kind==='bench')window.BearlyStreetProps.draw(c,'bench',p.x,y,196,time);
    else if(p.kind==='bin')window.BearlyStreetProps.draw(c,'bin',p.x,y,68,time);
    else if(p.kind==='utility')window.BearlyStreetProps.draw(c,'utility',p.x,y,p.width||88,time);
    else if(p.kind==='firebin'){
      const scale=(p.width||72)/64;c.save();c.translate(p.x,y);c.scale(scale,scale);window.BearlyStreetProps.hazard(c,{type:'firebin',x:0},0,time);c.restore();
    }
    else if(p.kind==='bush'&&coverTile){
      c.save();c.fillStyle='#19372835';c.beginPath();c.ellipse(p.x,y+1,105,7,0,0,Math.PI*2);c.fill();
      const scale=cover.width/cover.w;
      c.drawImage(coverTile,p.x-cover.width*.5,y+(cover.y-cover.foot)*scale,cover.width,coverTile.height*.5);c.restore();
    }
    painted.set(p.id,{...p,foot:y,seatY:y-p.seatHeight});
  }
  function caption(c,n,x,y,h,time){
    if(n.visible===false||n.active===false)return;
    if(n.screaming){
      c.save();c.font=`600 ${Math.max(13,h*.11)}px Arial, sans-serif`;c.textAlign='center';c.fillStyle='#fff';c.shadowColor='#18241f';c.shadowBlur=4;
      c.fillText('AAH!',x,y-h-10-Math.sin(time*16)*2);c.restore();
    }else if(n.kind==='gangster'&&n.gangAlert&&time<n.warnUntil){
      c.save();c.font=`600 ${Math.max(12,h*.09)}px Arial, sans-serif`;c.textAlign='center';c.fillStyle='#fff';c.shadowColor='#18241f';c.shadowBlur=4;
      c.fillText(n.warningText||'PERSONAL SPACE, FURBALL.',x,y-h-12);c.restore();
    }
  }
  function react(state,playSound){
    for(const e of state.effects||[]){
      if(e.kind!=='scream'||heard.has(e.id))continue;
      heard.add(e.id);
      if(typeof playSound==='function'&&state.time-lastSoundAt>.13){playSound('npc-scream');audioRequests++;lastSoundAt=state.time;}
    }
    if(heard.size>500){const values=[...heard];heard.clear();values.slice(-200).forEach(id=>heard.add(id));}
  }
  function audit(){return {localSlots:locals.length,civilianSlots:locals.filter(n=>n.civilian).length,gangSlots:gangLocals.length,gangCoverSlots:gangLocals.filter(n=>n.coverSpots.length).length,coverSource:{image:'assets/art/autumn-verge.png',rect:[cover.x,cover.y,cover.w,cover.h],width:cover.width,foot:cover.foot},props:furniture.map(p=>({...p})),drawnProps:[...painted.values()],audioRequests};}
  window.BearlyStreetLife={seeds,overlaps,propsNear,beginFrame,drawProp,caption,react,audit,ready:()=>!!coverTile&&!!window.BearlyStreetProps?.ready()};
})();
