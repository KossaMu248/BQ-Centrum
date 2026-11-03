/* Sparse, peaceful source residents. Existing civilian routines own fear/recovery.
   This adapter adds no combat controls, rewards, audio loop or animation loop. */
(() => {
  'use strict';
  const KEY='bq-centrum:civilians:v1',HEIGHT=176,clone=v=>JSON.parse(JSON.stringify(v));
  const definitions=[
    {id:'food-shop-host',role:'shopkeeper',label:'SHOPKEEPER',sceneId:'food-shop',variant:8,x:880,y:530,routeMin:858,routeMax:894,walkSpeed:28,hide:{x:1040,y:650}},
    {id:'courtyard-caretaker',role:'caretaker',label:'CARETAKER',sceneId:'service-courtyard',variant:6,x:650,y:600,routeMin:630,routeMax:670,walkSpeed:28,hide:{x:850,y:700}},
    {id:'arcade-student',role:'resident',label:'NEIGHBOUR',sceneId:'shopping-arcade',variant:9,x:375,y:570,routeMin:350,routeMax:440,walkSpeed:36,hide:{x:750,y:690}},
  ];
  const byId=id=>definitions.find(n=>n.id===id);
  const safeEvent=raw=>raw&&['frightened','unavailable'].includes(raw.event)&&Number.isFinite(raw.elapsed)&&raw.elapsed>=0&&raw.elapsed<=30?{event:raw.event,elapsed:raw.elapsed}:{event:null,elapsed:0};
  function create(storage){
    let saved={};try{const value=JSON.parse(storage?.getItem(KEY)||'{}');if(value?.schemaVersion===1)saved=value;}catch(_){}
    const actors=new Map(),facts=Object.fromEntries(definitions.map(d=>[d.id,safeEvent(saved.actors?.[d.id])])),dirty=new Set();
    const scenePreparations=new Map(),preparedScenes=new Set();
    let held=null,tick=0,prepared=null,ready=false,delivery={active:false,progress:saved.deliveryComplete===true?1:0,complete:saved.deliveryComplete===true};
    function seed(d,extra={}){return{id:d.id,variant:d.variant,civilian:true,hostile:false,patrol:true,face:d.variant===6?-1:1,x:d.x,depth:d.y,sidewalkDepth:d.y,patrolVariant:d.variant%3,
      routeMin:d.routeMin,routeMax:d.routeMax,walkSpeed:d.walkSpeed,fleeSpeed:130,
      restSpots:[{id:d.id+'-pause',kind:'idle',x:d.x,depth:d.y,duration:4}],
      hideSpots:[{id:d.id+'-quiet-space',kind:'bush',x:d.hide.x,depth:d.hide.y,duration:3}],...extra};}
    function player(n){return{x:n.x-120,depth:n.depth,face:1,z:0,speed:0,populationViewRadius:1100};}
    function advance(actor,seconds){
      for(let remaining=Math.max(0,Math.min(30,seconds));remaining>0;){const dt=Math.min(.05,remaining),n=actor.sim.lookup(actor.def.id);actor.sim.update(dt,player(n));remaining-=dt;}
    }
    function apply(actor,event){
      let n=actor.sim.lookup(actor.def.id);
      if(event==='frightened'){
        actor.sim.hit(0,player(n));actor.sim.update(.01,player(n));
      }else if(event==='unavailable'){
        for(let i=0;i<3;i++){
          n=actor.sim.lookup(actor.def.id);actor.sim.maul({x:n.x-35,depth:n.depth,face:1,z:0});if(i<2)advance(actor,.5);
        }
        actor.sim.cancel();
      }
    }
    function make(d,extra={}){
      const sim=window.BearlyBrawler.create();sim.enter('centrum:'+d.id,[seed(d,extra)]);return{def:d,sim};
    }
    function ensure(){
      if(actors.size)return;
      for(const d of definitions){const a=make(d);actors.set(d.id,a);const f=facts[d.id];if(f.event){apply(a,f.event);advance(a,f.elapsed);}}
    }
    function persist(){
      try{storage?.setItem(KEY,JSON.stringify({schemaVersion:1,actors:facts,deliveryComplete:delivery.complete}));}catch(_){}
      dirty.clear();
    }
    function source(id){ensure();return actors.get(id)?.sim.lookup(id);}
    function bodyClear(d,n){return !!n&&(!window.BearlyCentrumSquareWorld?.blocked||!window.BearlyCentrumSquareWorld.blocked(n.x,n.depth,22,12,d.sceneId,{gateOpened:true}));}
    function target(d){
      const n=source(d.id),fear=n?.fearUntil>actors.get(d.id).sim.snapshot().time;
      const duty=d.id==='courtyard-caretaker'&&delivery.active;
      const inside=bodyClear(d,n);
      const available=inside&&!!n&&n.active!==false&&n.visible!==false&&n.hp>0&&n.state==='idle'&&!fear&&!n.hiding&&!duty;
      const recovering=!inside||!n||n.hp<=0||n.active===false||n.visible===false||n.state!=='idle';
      const reason=duty?'The caretaker is moving the approved delivery.':recovering?'They are temporarily unavailable and will recover.':fear?'They need a quiet moment. Step back and give them time.':!available?'They need a quiet moment.':'Ready to talk.';
      return{id:d.id,role:d.role,label:d.label,sceneId:d.sceneId,x:n?.x??d.x,y:n?.depth??d.y,radius:78,available,reason,state:n?.state||'unavailable',variant:d.variant,civilian:true,hostile:false,fear:!!fear,activity:n?.activity||'idle',hp:n?.hp??0,bodyClear:inside};
    }
    function prepare(sceneId){
      ensure();
      if(!prepared)prepared=Promise.all([window.BearlyBrawlArt.prepare(),window.BearlyNpcMotion.loaded]).catch(error=>{prepared=null;throw error;});
      const key=typeof sceneId==='string'?sceneId:'*';
      if(!scenePreparations.has(key)){
        const variants=[...new Set(definitions.filter(d=>key==='*'||d.sceneId===key).map(d=>d.variant))];
        const task=prepared.then(()=>variants.length?(window.BearlyNpcMotion.preloadVariants?.(variants)||window.BearlyNpcMotion.preloadAll()):null)
          .then(()=>{preparedScenes.add(key);ready=true;})
          .catch(error=>{scenePreparations.delete(key);throw error;});
        scenePreparations.set(key,task);
      }
      return scenePreparations.get(key);
    }
    function update(sceneId,dt,actor={},options={}){
      ensure();if(options.paused)return;dt=Math.max(0,Math.min(.05,Number(dt)||0));if(!dt)return;
      for(const [id,a]of actors){
        if(held===id)continue;
        const n=a.sim.lookup(id);a.sim.update(dt,{x:actor.x??n.x-300,depth:actor.y??actor.depth??n.depth,z:actor.jump||0,face:actor.face||1,speed:actor.speed||0,populationViewRadius:1100});
        const current=a.sim.lookup(id),time=a.sim.snapshot().time;
        // Source civilians may choose an offstage escape. They stay unavailable
        // there, then resume their authored safe home routine once calm/recovered.
        // Never repair this by teleporting the player or altering quest progress.
        if(!bodyClear(a.def,current)&&current.hp>0&&current.state==='idle'&&current.fearUntil<=time){
          actors.set(id,make(a.def,{hp:current.hp}));facts[id]={event:null,elapsed:0};persist();continue;
        }
        const f=facts[id];if(f.event){f.elapsed+=dt;dirty.add(id);const t=target(a.def);if(t.available&&f.elapsed>1){f.event=null;f.elapsed=0;persist();}}
      }
      if(delivery.active){
        const n=source('courtyard-caretaker');delivery.progress=Math.max(delivery.progress,Math.max(0,Math.min(1,(n.x-(delivery.startX??650))/(850-(delivery.startX??650)))));
        if(delivery.progress>=.985){
          delivery={active:false,progress:1,complete:true};
          actors.set('courtyard-caretaker',make(byId('courtyard-caretaker'),{x:n.x,depth:600,sidewalkDepth:600,hp:n.hp,restSpots:[]}));persist();
        }
      }
      tick+=dt;if(tick>=1){tick=0;if(dirty.size)persist();}
    }
    function nodes(sceneId){
      ensure();return definitions.filter(d=>d.sceneId===sceneId).map(d=>{
        const n=source(d.id),a=actors.get(d.id),state=a.sim.snapshot(),visible=n.active!==false&&n.visible!==false&&bodyClear(d,n);
        return{id:'civilian:'+d.id,kind:'civilian',footY:n.depth,draw:c=>{
          if(!ready||!visible)return;
          const shown=state.npcs.find(item=>item.id===d.id)||n;
          c.save();c.fillStyle='#22392d32';c.beginPath();c.ellipse(n.x,n.depth,27,6,0,0,Math.PI*2);c.fill();c.restore();
          window.BearlyBrawlArt.adult(c,shown,n.x,n.depth,HEIGHT);
          window.BearlyStreetLife.caption(c,shown,n.x,n.depth,HEIGHT,state.time);
        }};
      });
    }
    function targets(sceneId){ensure();return definitions.filter(d=>d.sceneId===sceneId).map(target);}
    function requestTalk(id){const d=byId(id);return d?target(d):{id,available:false,reason:'No resident is here.'};}
    function disturb(id,kind){
      ensure();const a=actors.get(id),event=kind==='frightened'||kind==='scared'?'frightened':kind==='unavailable'||kind==='down'?'unavailable':null;
      if(!a||!event||!target(a.def).available)return false;
      held=null;if(id==='courtyard-caretaker'&&delivery.active)return false;
      apply(a,event);facts[id]={event,elapsed:0};dirty.add(id);persist();return true;
    }
    function beginTalk(id){const t=requestTalk(id);if(t.available){held=id;return true;}return false;}
    function endTalk(){held=null;}
    function approveDelivery(){
      ensure();if(delivery.active||delivery.complete)return false;
      const d=byId('courtyard-caretaker'),t=target(d);if(!t.available)return false;
      held=null;actors.set(d.id,make(d,{x:t.x,depth:t.y,sidewalkDepth:t.y,hp:t.hp,routeMin:t.x,routeMax:850,walkSpeed:90,restSpots:[]}));
      delivery={active:true,progress:0,complete:false,startX:t.x};persist();return true;
    }
    function settleDelivery(){if(delivery.complete&&!delivery.active)return false;delivery={active:false,progress:1,complete:true};persist();return true;}
    function deliveryMotion(){return{...delivery};}
    function audit(){ensure();return{ready,preparedScenes:[...preparedScenes],key:KEY,height:HEIGHT,talking:held,delivery:deliveryMotion(),residents:definitions.map(target),facts:clone(facts),sourceStats:Object.fromEntries([...actors].map(([id,a])=>[id,a.sim.snapshot().stats]))};}
    return{prepare,update,nodes,targets,requestTalk,disturb,beginTalk,endTalk,approveDelivery,settleDelivery,deliveryMotion,audit};
  }
  let runtime=null;
  function instance(){if(!runtime){let storage;try{storage=window.BearlyCentrumSave?.storage||window.localStorage;}catch(_){}runtime=create(storage);}return runtime;}
  const api={create,key:KEY};
  for(const name of ['prepare','update','nodes','targets','requestTalk','disturb','beginTalk','endTalk','approveDelivery','settleDelivery','deliveryMotion','audit'])api[name]=(...args)=>instance()[name](...args);
  window.BearlyCentrumCivilians=api;
})();
