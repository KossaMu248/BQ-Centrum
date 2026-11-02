/* Small, independent adventure save. Cycling health, physics and scores stay separate. */
(() => {
  'use strict';
  const KEY='bq-centrum:adventure:v1';
  function create(storage){
    const defaults={started:false,lunch:false,kit:false,delivered:false,repaired:false,chart:false,buoys:[],voyage:false,seeds:[],garden:false};
    let saved={};try{saved=JSON.parse(storage?.getItem(KEY)||'{}')||{};}catch(_){}
    const state={...defaults};
    for(const k of Object.keys(defaults))if(typeof defaults[k]==='boolean')state[k]=saved[k]===true;
    state.buoys=Array.isArray(saved.buoys)?[...new Set(saved.buoys.filter(n=>[0,1,2].includes(n)))]:[];
    state.seeds=Array.isArray(saved.seeds)?[...new Set(saved.seeds.filter(n=>[0,1,2].includes(n)))]:[];
    function save(){try{storage?.setItem(KEY,JSON.stringify(state));}catch(_){}return snapshot();}
    function snapshot(){return {...state,buoys:[...state.buoys],seeds:[...state.seeds],boatReady:state.delivered&&state.repaired};}
    function act(action,index){
      switch(action){
        case 'start':state.started=true;break;
        case 'lunch':state.started=true;if(!state.delivered)state.lunch=true;break;
        case 'kit':state.started=true;if(!state.repaired)state.kit=true;break;
        case 'deliver':if(state.lunch){state.lunch=false;state.delivered=true;}break;
        case 'repair':if(state.kit){state.kit=false;state.repaired=true;}break;
        case 'chart':state.chart=true;break;
        case 'buoy':if(state.delivered&&state.repaired&&[0,1,2].includes(index)&&!state.buoys.includes(index))state.buoys.push(index);break;
        case 'return':if(state.delivered&&state.repaired&&state.buoys.length===3)state.voyage=true;break;
        case 'seed':if([0,1,2].includes(index)&&!state.seeds.includes(index))state.seeds.push(index);break;
        case 'garden':if(state.seeds.length===3)state.garden=true;break;
      }
      return save();
    }
    function restore(saved){
      if(!saved||typeof saved!=='object')return false;
      for(const k of Object.keys(defaults))if(typeof defaults[k]==='boolean')state[k]=saved[k]===true;
      for(const k of ['buoys','seeds'])state[k]=Array.isArray(saved[k])?[...new Set(saved[k].filter(n=>[0,1,2].includes(n)))]:[];
      save();return true;
    }
    return {snapshot,act,restore};
  }
  let storage;try{storage=window.BearlyCentrumSave?.storage||window.localStorage;}catch(_){}
  window.BearlyQuests={create,game:create(storage)};
})();
