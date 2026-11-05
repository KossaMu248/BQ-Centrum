/* Project street bench. Original autumn palette; independent width and seat height. */
(() => {
  'use strict';
  const width=224,bodyHeight=70,usableSeatWidth=188,seatHeight=26;
  const seatPan=Object.freeze({front:21.4,rear:30.7});
  const ink='#27291f',metal='#637165',highlight='#849080';
  let canvas=null,builds=0,draws=0,lastWidth=0;
  function metrics(size=width){
    const scale=Number.isFinite(size)&&size>0?size/width:1;
    return{width:width*scale,bodyHeight:bodyHeight*scale,usableSeatWidth:usableSeatWidth*scale,
      seatHeight:seatHeight*scale,seatPan:{front:seatPan.front*scale,rear:seatPan.rear*scale},footprintHalf:width*scale*.55};
  }
  function paint(c){
    function line(points,color,weight){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=weight;c.stroke();}
    function polygon(points,fill,weight=1.6){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=ink;c.lineWidth=weight;c.stroke();}
    function wood(y){const g=c.createLinearGradient(-98,y,98,y+7);g.addColorStop(0,'#dfad5e');g.addColorStop(.55,'#bc813e');g.addColorStop(1,'#925c2e');return g;}
    c.save();c.fillStyle='#21382d30';c.beginPath();c.ellipse(1,2,111,5,0,0,Math.PI*2);c.fill();
    c.lineCap='round';c.lineJoin='round';
    // Shared supports reach the floor independently of the wide slat lengths.
    for(const side of [-1,1]){
      const x=side*86;
      line([[x,-65],[x,-26],[x+side*8,-5],[x+side*17,-1]],ink,6);
      line([[x,-64],[x,-26],[x+side*8,-5]],metal,2.3);
      line([[x,-24],[x-side*8,-3],[x-side*14,0]],ink,6);
      line([[x,-23],[x-side*8,-3]],highlight,1.5);
    }
    // Four long, warm wooden back slats preserve the source's outlined style.
    for(let row=0;row<4;row++){
      const y=-68+row*9;
      polygon([[-96,y],[96,y-.5],[97,y+6.5],[-97,y+7]],wood(y),2);
      line([[-93,y+1.5],[93,y+1]],'#f5c37a',1);
      line([[-54+row*17,y+4],[-35+row*17,y+3.5]],'#86552d',.7);
      for(const x of [-86,86]){c.beginPath();c.ellipse(x,y+3.5,1.4,1.4,0,0,Math.PI*2);c.fillStyle=ink;c.fill();}
    }
    // These are the same contact heights returned to the intact seated rig.
    polygon([[-102,-seatPan.rear],[102,-seatPan.rear],[108,-seatPan.front],[-108,-seatPan.front]],wood(-seatHeight),2);
    polygon([[-108,-seatPan.front],[108,-seatPan.front],[108,-16],[-108,-16]],'#8d5a31',1.5);
    line([[-100,-28.5],[100,-28.5]],'#e2b56b',1.1);
    line([[-106,-seatPan.front+1],[106,-seatPan.front+1]],'#d8a45b',.9);
    for(const side of [-1,1]){
      const x=side*103;c.beginPath();c.moveTo(x,-22);c.bezierCurveTo(x+side*8,-36,x+side*7,-45,x-side*1,-44);
      c.strokeStyle=ink;c.lineWidth=5.5;c.stroke();c.strokeStyle=highlight;c.lineWidth=1.5;c.stroke();
    }
    c.restore();
  }
  function prepare(){
    if(canvas)return canvas;
    canvas=document.createElement('canvas');canvas.width=480;canvas.height=184;
    canvas.dataset.sourceAsset='centrum-street-bench';canvas.dataset.artKind='project-vector-environment';
    const c=canvas.getContext('2d');c.scale(2,2);c.translate(120,78);paint(c);builds++;return canvas;
  }
  function draw(c,x,y,size=width){
    if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(size)||size<=0)return false;
    const image=prepare(),scale=size/width;c.save();c.translate(x,y);c.scale(scale,scale);
    c.drawImage(image,-120,-78,240,92);c.restore();draws++;lastWidth=size;return true;
  }
  function audit(){return{...metrics(),builds,draws,lastWidth,cacheBytes:canvas?canvas.width*canvas.height*4:0,
    source:'Project-authored vector bench, original autumn wood/iron palette; no character artwork',seatPolygon:[[-102,-seatPan.rear],[102,-seatPan.rear],[108,-seatPan.front],[-108,-seatPan.front]]};}
  window.BearlyCentrumStreetBench={metrics,draw,audit};
})();
