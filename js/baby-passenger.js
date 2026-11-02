/* Original bike passenger: one continuous head, neck, shirt and upper torso. */
(() => {
  'use strict';
  const REFERENCE_HEAD_HEIGHT=61;
  const definitions={
    idle:{file:'baby_pose_idle.webp',size:[82,146],head:[15,9,57,62],pivot:[52,94],waist:[48,104],seamY:94,occludeFrom:90,
      polygon:[[0,0],[82,0],[82,76],[68,76],[70,79],[69,83],[67,85],[64,87],[60,87],[58,90],[57,92],[53,94],[48,93],[44,92],[39,91],[35,89],[31,87],[29,83],[28,78],[27,74],[27,70],[27,66],[25,64],[23,60],[20,57],[18,53],[17,50],[14,47],[13,44],[0,43]],
      protected:{face:[[52,35],[66,36],[66,43],[60,52]],chin:[[62,63],[60,64],[57,66],[54,67],[51,68]],neck:[[48,69],[48,70]],collar:[[36,72],[43,77],[53,77]],torso:[[40,82],[49,84]],chair:[[16,52],[17,58],[22,70],[25,75],[30,99],[47,103]]}},
    laugh:{file:'baby_pose_laugh.webp',size:[88,154],head:[8,14,65,65],pivot:[57,103],waist:[57,111],seamY:103,occludeFrom:97,
      polygon:[[0,0],[88,0],[88,87],[77,87],[78,91],[76,94],[72,96],[67,96],[64,99],[61,101],[57,103],[51,101],[47,99],[43,96],[40,91],[38,86],[35,82],[34,78],[32,74],[29,71],[25,69],[22,66],[18,63],[17,60],[14,57],[11,54],[0,53]],
      protected:{face:[[51,39],[64,39],[66,48],[61,59]],chin:[[64,71],[59,74],[51,75]],neck:[[43,73]],collar:[[44,79],[54,83],[61,83]],torso:[[49,89]],chair:[[15,70],[23,86],[34,105],[49,115]]}},
    brace:{file:'baby_pose_brace.webp',size:[98,143],head:[12,5,68,71],pivot:[59,101],waist:[62,104],seamY:101,occludeFrom:95,
      polygon:[[0,0],[98,0],[98,88],[84,88],[79,87],[73,88],[70,91],[68,95],[64,99],[59,101],[54,98],[49,95],[44,92],[39,90],[35,87],[32,83],[30,78],[29,73],[29,69],[27,66],[25,63],[22,59],[20,55],[18,53],[15,50],[13,47],[0,46]],
      protected:{face:[[55,39],[70,40],[73,49],[65,60]],chin:[[64,70],[56,72],[49,72]],neck:[[42,72]],collar:[[44,76],[53,82]],torso:[[49,86]],chair:[[14,65],[23,83],[35,99],[48,109]]}},
    terror:{file:'baby_pose_terror.webp',size:[99,155],head:[18,7,72,70],pivot:[64,104],waist:[67,112],seamY:104,occludeFrom:97,
      polygon:[[0,0],[99,0],[99,86],[88,86],[86,89],[82,92],[77,94],[72,95],[69,98],[66,102],[62,104],[57,102],[52,100],[47,97],[43,94],[39,90],[36,86],[34,81],[33,77],[32,73],[30,70],[27,67],[24,64],[22,61],[20,58],[18,55],[0,54]],
      protected:{face:[[55,31],[77,31],[77,43],[67,59]],chin:[[76,69],[68,74],[56,75]],neck:[[44,72]],collar:[[46,79],[58,84]],torso:[[52,90]],chair:[[14,70],[26,91],[37,107],[58,119]]}},
    leanBack:{file:'baby_pose_leanBack.webp',size:[106,140],head:[17,9,77,63],pivot:[65,92],waist:[65,99],seamY:92,occludeFrom:87,
      polygon:[[0,0],[106,0],[106,67],[97,67],[101,74],[100,79],[87,80],[80,81],[80,86],[77,86],[76,90],[70,91],[67,90],[53,90],[48,87],[47,83],[46,78],[47,73],[44,70],[40,69],[37,67],[33,64],[28,59],[23,57],[18,55],[17,54],[0,53]],
      protected:{face:[[48,20],[74,42]],chin:[[72,64]],neck:[[45,68]],collar:[[69,72]],torso:[[52,78]],hand:[[70,86]],chair:[[18,63],[38,87],[57,94]]}},
    leanForward:{file:'baby_pose_leanForward.webp',size:[88,153],head:[30,14,52,77],pivot:[43,109],waist:[46,110],seamY:109,occludeFrom:102,
      polygon:[[0,0],[88,0],[88,74],[80,77],[77,82],[74,87],[67,91],[60,91],[58,99],[52,100],[49,104],[47,108],[40,109],[37,106],[36,103],[32,100],[29,97],[27,93],[27,87],[29,81],[30,77],[33,74],[32,72],[30,70],[30,65],[31,61],[31,57],[29,57],[0,57]],
      protected:{face:[[59,25],[68,48]],chin:[[67,86]],neck:[[37,68]],collar:[[33,70],[52,89]],torso:[[34,85]],hand:[[42,104]],chair:[[14,66],[22,88],[25,105]]}},
    point:{file:'baby_pose_point.webp',size:[97,142],head:[24,6,54,70],pivot:[56,92],waist:[54,99],seamY:92,occludeFrom:88,
      polygon:[[0,0],[97,0],[97,78],[80,78],[81,81],[81,87],[74,87],[71,87],[69,89],[64,92],[58,92],[54,90],[49,89],[45,87],[42,84],[40,81],[40,77],[39,74],[40,70],[40,68],[38,66],[34,65],[32,61],[31,58],[31,56],[29,54],[27,53],[26,51],[25,49],[24,47],[0,46]],
      protected:{face:[[50,20],[64,42]],chin:[[66,70]],neck:[[40,65]],collar:[[59,77]],torso:[[45,76]],hand:[[62,86]],chair:[[23,59],[35,84],[50,94]]}},
    sick:{file:'v151_baby_pose_sick.png',size:[99,145],head:[9,8,58,77],pivot:[44,101],waist:[38,105],seamY:101,occludeFrom:95,
      polygon:[[0,0],[99,0],[99,65],[67,65],[65,68],[59,69],[54,69],[54,71],[58,73],[58,78],[55,81],[49,83],[45,84],[43,85],[44,88],[48,90],[51,89],[53,87],[56,87],[59,91],[59,94],[57,97],[53,99],[49,101],[42,101],[37,99],[32,96],[28,93],[25,89],[24,84],[24,80],[26,76],[25,74],[23,72],[21,68],[20,63],[19,59],[16,57],[12,54],[10,49],[0,47]],
      protected:{face:[[42,25],[47,49]],chin:[[49,80]],neck:[[27,68]],collar:[[39,84]],torso:[[28,82]],hand:[[52,94]],chair:[[8,60],[18,84],[30,102]]}}
  };
  // These two face expressions are the same explicit overrides used by the bike.
  definitions.excited={...definitions.leanBack,file:'v151_baby_pose_excited.png'};
  definitions.sickLegacy={...definitions.sick,file:'baby_pose_sick.webp'};
  const aliases={happy:'idle',calm:'idle',walking:'laugh',laughing:'laugh',alert:'brace',scared:'terror',terrified:'terror',curious:'point',hurt:'terror',jump:'terror'};
  const images={},textures={};let lastAudit=null;
  for(const [name,frame] of Object.entries(definitions)){const im=new Image();im.src='assets/'+frame.file;images[name]=im;}
  function ready(){return Object.values(images).every(im=>im.naturalWidth>0);}
  function resolve(mood){const name=aliases[mood]||mood;return definitions[name]?name:'idle';}
  function texture(name){
    if(textures[name])return textures[name];
    const frame=definitions[name],tile=document.createElement('canvas');tile.width=frame.size[0];tile.height=frame.seamY+1;
    tile.dataset.sourceAsset=frame.file;tile.dataset.sourceRect=`0,0,${tile.width},${tile.height}`;
    tile.dataset.passengerPiece='continuous-upper-body';tile.dataset.seamY=String(frame.seamY);
    const c=tile.getContext('2d');c.beginPath();frame.polygon.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.clip();c.drawImage(images[name],0,0);
    return textures[name]=tile;
  }
  function draw(c,options={}){
    const name=resolve(options.mood),frame=definitions[name];if(!images[name].naturalWidth)return false;
    const x=options.x||0,y=options.y||0,angle=options.angle||0,flip=options.flip===true||options.flip<0?-1:1;
    const scale=options.scale??(options.headHeight!=null?options.headHeight/REFERENCE_HEAD_HEIGHT:options.height!=null?options.height/(frame.seamY-frame.head[1]):1);
    const alpha=Math.max(0,Math.min(1,options.alpha??1)),tile=texture(name),[px,py]=frame.pivot;
    c.save();c.translate(x,y);c.rotate(angle);c.scale(scale*flip,scale);c.globalAlpha*=alpha;c.drawImage(tile,-px,-py);c.restore();
    const cs=Math.cos(angle),sn=Math.sin(angle),point=([sx,sy])=>({x:x+(sx-px)*scale*flip*cs-(sy-py)*scale*sn,y:y+(sx-px)*scale*flip*sn+(sy-py)*scale*cs});
    lastAudit={mood:name,source:'assets/'+frame.file,continuousUpperBody:true,originalCollar:true,headOnly:false,uniformScale:scale,angle,flip,alpha,
      pivot:[...frame.pivot],anatomicalWaist:[...frame.waist],waist:{x,y},headHeight:frame.head[3]*scale,referenceHeadHeight:REFERENCE_HEAD_HEIGHT,
      sourceRect:[0,0,tile.width,tile.height],sourceBounds:[0,0,...frame.size],seamY:frame.seamY,occludeFrom:frame.occludeFrom,
      seam:{start:point([px-10,frame.seamY]),end:point([px+10,frame.seamY]),occludeFrom:point([px,frame.occludeFrom])},
      head:frame.head,chin:(frame.protected.chin||[]).map(point),neck:(frame.protected.neck||[]).map(point),collar:(frame.protected.collar||[]).map(point)};
    return JSON.parse(JSON.stringify(lastAudit));
  }
  function frames(){return JSON.parse(JSON.stringify(definitions));}
  window.BearlyBabyPassenger={ready,draw,frames,resolve,audit:()=>lastAudit?JSON.parse(JSON.stringify(lastAudit)):null,referenceHeadHeight:REFERENCE_HEAD_HEIGHT};
})();
