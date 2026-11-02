/* One project-owned parking record. Parsing never grants health or quest rewards. */
(() => {
  'use strict';
  const KEY='bq-centrum:parking:v1',SCHEMA=1;
  const identity={routeId:'autumn-main',routeSceneId:'route:autumn-main',entryId:'centrum-stop',bikeId:'centrum-family-bike'};
  const phases=['riding','dismount','exploring','remount'];
  const booleans=['started','lunch','kit','delivered','repaired','chart','voyage','garden'];
  const clone=value=>value==null?null:JSON.parse(JSON.stringify(value));
  const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const finite=value=>typeof value==='number'&&Number.isFinite(value);

  function adventure(value){
    if(!object(value)||booleans.some(key=>typeof value[key]!=='boolean'))return null;
    if(!['buoys','seeds'].every(key=>Array.isArray(value[key])&&value[key].every(n=>Number.isInteger(n)&&n>=0&&n<=2)))return null;
    const result=Object.fromEntries(booleans.map(key=>[key,value[key]]));
    result.buoys=[...new Set(value.buoys)];result.seeds=[...new Set(value.seeds)];return result;
  }
  function routeProgress(value){
    if(!object(value))return null;
    for(const key of ['score','bonus','seconds'])if(!finite(value[key])||value[key]<0||value[key]>1e9)return null;
    if(!finite(value.maxDist)||value.maxDist<0||value.maxDist>42000||!Number.isInteger(value.checkpoint)||value.checkpoint<0||value.checkpoint>1||!finite(value.panic)||value.panic<0||value.panic>100)return null;
    const pickups=value.collectedPickups,allowedPickups=Array.from({length:12},(_,i)=>'route-pizza-'+i);
    if(!Array.isArray(pickups)||pickups.some(id=>!allowedPickups.includes(id))||new Set(pickups).size!==pickups.length)return null;
    for(const [key,limit]of [['trickHazards',512],['oneTime',256]]){
      const list=value[key];if(!Array.isArray(list)||list.length>limit||list.some(id=>typeof id!=='string'||id.length>100)||new Set(list).size!==list.length)return null;
    }
    const parts=value.lostParts,allowedParts=['rightArm','leftArm','rightLeg','leftLeg','torso','head'];
    if(!Array.isArray(parts)||parts.some(id=>!allowedParts.includes(id))||new Set(parts).size!==parts.length)return null;
    return {collectedPickups:[...pickups],score:value.score,bonus:value.bonus,maxDist:value.maxDist,seconds:value.seconds,
      checkpoint:value.checkpoint,panic:value.panic,trickHazards:[...value.trickHazards],oneTime:[...value.oneTime],lostParts:[...parts]};
  }
  function create(storage,validatePosition){
    function normalized(value){
      if(!object(value)||value.schemaVersion!==SCHEMA||Object.entries(identity).some(([key,id])=>value[key]!==id)||!phases.includes(value.phase))return null;
      if(!finite(value.health)||value.health<0||value.health>100)return null;
      const parked=value.parked;
      // The bridge checks these coordinates against the unchanged terrain too.
      // Restrict this record to the one authored stop, never another district.
      if(!object(parked)||!finite(parked.x)||parked.x<11235||parked.x>11415||!finite(parked.y)||parked.y< -1000||parked.y>3000)return null;
      const remount=value.remount;
      if(!object(remount)||remount.sceneId!=='metro-square'||remount.anchorId!=='bicycle-parking')return null;
      const quest=adventure(value.adventure),route=routeProgress(value.routeProgress);if(!quest||!route)return null;
      let exploration=null;
      if(value.exploration!=null){
        const p=value.exploration;
        if(!object(p)||!finite(p.x)||!finite(p.y)||![1,-1].includes(p.face)||typeof p.sceneId!=='string'||typeof p.entranceId!=='string')return null;
        try{if(typeof validatePosition!=='function'||!validatePosition(p))return null;}catch(_){return null;}
        exploration={sceneId:p.sceneId,entranceId:p.entranceId,x:p.x,y:p.y,face:p.face};
      }
      if(value.phase!=='riding'&&!exploration)return null;
      return {schemaVersion:SCHEMA,...identity,phase:value.phase,parked:{x:parked.x,y:parked.y},
        remount:{sceneId:'metro-square',anchorId:'bicycle-parking'},health:value.health,adventure:quest,routeProgress:route,exploration};
    }
    let state=null;
    try{state=normalized(JSON.parse(storage?.getItem(KEY)||'null'));}catch(_){}
    function snapshot(){return clone(state);}
    function save(record){
      const next=normalized(record);if(!next)return null;
      state=next;try{storage?.setItem(KEY,JSON.stringify(state));}catch(_){}return snapshot();
    }
    return {
      snapshot,valid:record=>!!normalized(record),save,
      load(){
        const restored=snapshot();
        // A reload resumes one stable on-foot owner, not a half-finished blend
        // with both a seat passenger and carrier passenger alive at once.
        if(restored&&['dismount','remount'].includes(restored.phase))restored.phase='exploring';
        return restored;
      },
      finish(health,quest){
        if(!state)return null;
        return save({...state,phase:'riding',health,adventure:quest===undefined?state.adventure:quest});
      },
    };
  }
  window.BearlyCentrumParkingSave={validateProgress:routeProgress,validateAdventure:adventure,create,key:KEY,schemaVersion:SCHEMA,identity:{...identity}};
})();
