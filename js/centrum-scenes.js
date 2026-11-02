/* Compact, stylised Hässelby-inspired network. Connections are authored data. */
(() => {
  'use strict';
  const rect=(id,kind,x,y,w,h,extra={})=>({id,kind,x,y,w,h,footY:y+h,...extra});
  const anchor=(x,y,face=1)=>({x,y,face});
  const exit=(id,label,x,y,toScene,toEntrance,extra={})=>({id,kind:'exit',label,x,y,radius:68,toScene,toEntrance,...extra});
  const scenes={
    'metro-square':{
      id:'metro-square',label:'Metro Square',kind:'outdoor',landmark:'The single Hässelby metro entrance',width:1500,height:1000,
      floor:{left:60,right:1440,top:320,bottom:930},defaultEntrance:'start',
      anchors:{start:anchor(260,540),'from-arcade':anchor(340,440),'from-courtyard-gate':anchor(1300,820,-1),'bicycle-parking':anchor(220,730),'from-cycle-route':anchor(248,730)},
      buildings:[rect('front-arcade','building',60,0,485,350,{key:'arcade',label:'SHOPPING ARCADE',doorX:340}),rect('front-metro','building',545,0,460,320,{key:'metro',label:'METRO',doorX:765}),rect('front-pizzeria','building',1005,0,435,350,{key:'pizzeria',label:'PIZZA & KEBAB',doorX:1220})],
      furniture:[rect('bench-west','bench',402,556,196,24,{anchorX:500,artWidth:210}),rect('bench-east','bench',982,711,196,24,{anchorX:1080,artWidth:210}),rect('planter','planter',754,448,132,42,{anchorX:820,artWidth:190})],
      extraSolids:[rect('square-gate-post-left','post',1294,783,14,20),rect('square-gate-post-right','post',1412,783,14,20),rect('square-gate-leaf','gate',1310,785,100,14,{gateClosedOnly:true})],
      exits:[exit('to-arcade','Enter shopping arcade',340,382,'shopping-arcade','from-square'),exit('square-gate','Service courtyard gate',1360,820,'service-courtyard','from-square-gate',{kind:'gate',gateSide:'square'})],
      interactions:[],occlusionLayers:[{id:'facades',type:'foot-sorted'},{id:'furniture',type:'foot-sorted'},{id:'gate',type:'foot-sorted'}],
    },
    'shopping-arcade':{
      id:'shopping-arcade',label:'Shopping Arcade',kind:'outdoor',landmark:'Covered arcade and its visible service side passage',width:1160,height:800,
      floor:{left:60,right:1100,top:320,bottom:750},defaultEntrance:'from-square',
      anchors:{'from-square':anchor(165,650),'from-courtyard':anchor(1048,586,-1),'from-food-shop':anchor(235,440),'from-workshop':anchor(760,440,-1)},
      buildings:[rect('food-front','building',70,0,430,350,{key:'corner-shop',doorX:235,label:"BILLY’S · MATBUTIK"}),rect('workshop-front','building',550,0,430,350,{key:'workshop',doorX:760,label:'CYKELVERKSTAD'})],
      furniture:[rect('arcade-planter','planter',490,650,100,35,{anchorX:540,artWidth:120})],
      extraSolids:[rect('service-passage-jamb','post',979,537,35,13)],
      exits:[exit('to-square','Back to Metro Square',105,650,'metro-square','from-arcade'),exit('courtyard-passage','Side passage to service courtyard',1060,550,'service-courtyard','from-arcade'),exit('food-door',"Enter Billy’s food shop",235,382,'food-shop','from-arcade'),exit('workshop-door','Enter bicycle workshop',760,382,'bicycle-workshop','from-arcade')],
      interactions:[],occlusionLayers:[{id:'facades',type:'foot-sorted'},{id:'planter',type:'foot-sorted'},{id:'service-passage-jamb',type:'foot-sorted'},{id:'awning',type:'background'}],
    },
    'service-courtyard':{
      id:'service-courtyard',label:'Service Courtyard',kind:'outdoor',landmark:'Utility courtyard and the latch on the square gate',width:1160,height:800,
      floor:{left:60,right:1100,top:320,bottom:750},defaultEntrance:'from-arcade',
      anchors:{'from-arcade':anchor(165,640),'from-square-gate':anchor(950,650,-1)},
      buildings:[rect('courtyard-front','building',250,0,660,350,{key:'courtyard',label:'SERVICE COURTYARD'})],
      furniture:[rect('utility-box','utility',486,480,110,45,{anchorX:540,artWidth:115}),rect('service-crates','crates',730,535,110,40,{anchorX:785,artWidth:125})],
      extraSolids:[rect('courtyard-gate-post-left','post',959,613,14,20),rect('courtyard-gate-post-right','post',1077,613,14,20),rect('courtyard-gate-leaf','gate',975,615,100,14,{gateClosedOnly:true})],
      exits:[exit('to-arcade','Side passage to shopping arcade',100,640,'shopping-arcade','from-courtyard'),exit('courtyard-gate','Open gate to Metro Square',1025,650,'metro-square','from-courtyard-gate',{kind:'gate',gateSide:'courtyard'})],
      interactions:[{id:'delivery-cage',kind:'story',target:'cage',label:'Inspect delivery cage B-04',x:785,y:620,radius:75},{id:'caretaker-talk',kind:'story',target:'caretaker',npcId:'courtyard-caretaker',label:'Talk to caretaker',x:650,y:600,radius:78}],occlusionLayers:[{id:'rear-housing',type:'foot-sorted'},{id:'utility',type:'foot-sorted'},{id:'gate',type:'foot-sorted'}],
    },
    'food-shop':{
      id:'food-shop',label:"Billy’s Food Shop",kind:'room',landmark:"Warm food counter with Billy’s packs",width:1160,height:760,
      floor:{left:70,right:1090,top:430,bottom:710},defaultEntrance:'from-arcade',roomArt:'food',
      anchors:{'from-arcade':anchor(190,600)},
      buildings:[],furniture:[],
      extraSolids:[rect('food-counter','counter',560,425,510,58),rect('food-wall','wall',70,0,1020,430)],
      exits:[exit('food-out','Door to shopping arcade',125,600,'shopping-arcade','from-food-shop')],
      interactions:[{id:'shopkeeper-talk',kind:'story',target:'shopkeeper',npcId:'food-shop-host',label:'Talk to shopkeeper',x:880,y:530,radius:78}],
      occlusionLayers:[{id:'food-room',type:'background',asset:'assets/art/pizzeria-walkable-v7.png'},{id:'billys-packs',type:'foot-sorted',footY:483}],
    },
    'bicycle-workshop':{
      id:'bicycle-workshop',label:'Bicycle Workshop',kind:'room',landmark:'Repair bench and the painted bicycle display',width:1160,height:760,
      floor:{left:70,right:1090,top:430,bottom:710},defaultEntrance:'from-arcade',roomArt:'workshop',
      anchors:{'from-arcade':anchor(190,600)},
      buildings:[],furniture:[],
      extraSolids:[rect('repair-bench','counter',580,425,490,62),rect('workshop-wall','wall',70,0,1020,430)],
      exits:[exit('workshop-out','Door to shopping arcade',125,600,'shopping-arcade','from-workshop')],
      interactions:[{id:'repair-counter',kind:'look',label:'Mechanic · bicycle repairs',x:810,y:530,radius:75}],
      occlusionLayers:[{id:'workshop-room',type:'background',asset:'assets/art/workshop-interior-v7.png'}],
    },
  };
  for(const scene of Object.values(scenes)){
    scene.heroHeight=200;scene.radiusX=22;scene.radiusY=12;
    scene.solids=[...scene.buildings,...scene.furniture,...(scene.extraSolids||[])];
    scene.spawn={...scene.anchors[scene.defaultEntrance]};
    scene.doors=scene.exits.map(e=>({id:e.id,label:e.label,x:e.x,y:e.y}));
  }
  const clone=value=>JSON.parse(JSON.stringify(value));
  window.BearlyCentrumScenes={all:()=>clone(Object.values(scenes)),get:id=>scenes[id]?clone(scenes[id]):null};
})();
