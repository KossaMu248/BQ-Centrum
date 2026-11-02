/* Native fullscreen, with a viewport mode for browsers that do not expose it. */
(() => {
  'use strict';
  const shell=document.querySelector('.game-shell'),main=document.getElementById('fullscreenBtn');
  const tools=document.createElement('div');tools.className='fullscreen-tools';tools.hidden=true;
  tools.innerHTML='<button type="button" class="fullscreen-settings" aria-label="Open settings">⚙ SETTINGS</button><button type="button" class="fullscreen-exit" aria-label="Exit fullscreen">↙ EXIT FULLSCREEN</button>';
  shell.append(tools);
  // Keeping the menu inside the fullscreen element makes it available in either mode.
  shell.append(document.getElementById('debugPanel'));
  let viewport=false,scrollY=0,returnFocus=null;
  const active=()=>document.fullscreenElement===shell||viewport;
  function sync(){
    shell.classList.toggle('is-expanded',active());document.body.classList.toggle('viewport-fullscreen',viewport);
    tools.hidden=!active();main.setAttribute('aria-pressed',String(active()));main.setAttribute('aria-label',active()?'Exit fullscreen':'Enter fullscreen');
    main.title=active()?'Exit fullscreen (F or Escape)':'Fullscreen (F)';
  }
  async function exit(){
    viewport=false;
    if(document.fullscreenElement===shell){try{await document.exitFullscreen();}catch(_){}}
    sync();window.scrollTo(0,scrollY);if(returnFocus?.isConnected)returnFocus.focus();
  }
  async function toggle(){
    if(active()){await exit();return;}
    scrollY=window.scrollY;returnFocus=document.activeElement;
    if(shell.requestFullscreen){try{await shell.requestFullscreen();sync();return;}catch(_){}}
    viewport=true;sync();tools.querySelector('.fullscreen-exit').focus();
  }
  main.addEventListener('click',toggle);tools.querySelector('.fullscreen-exit').addEventListener('click',exit);
  tools.querySelector('.fullscreen-settings').addEventListener('click',()=>window.BEARLY_DEBUG_MENU?.toggle(true));
  document.addEventListener('fullscreenchange',sync);
  window.addEventListener('keydown',e=>{
    if(e.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;
    if(e.code==='KeyF'&&!e.repeat){e.preventDefault();e.stopImmediatePropagation();toggle();}
    if(e.code==='Escape'&&active()&&!window.BEARLY_DEBUG_MENU?.isOpen()){e.preventDefault();e.stopImmediatePropagation();exit();}
  },true);
  window.BearlyFullscreen={toggle,exit,state:()=>document.fullscreenElement===shell?'native':viewport?'viewport':'window'};
  sync();
})();
