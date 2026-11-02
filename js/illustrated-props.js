/* Standalone edition: illustrated street furniture. Drawing only; no physics. */
(() => {
  'use strict';
  const INK = '#27291f', PAPER = '#f8dca0';
  const cache = new Map();
  // Painted art replaces the earlier vector bin in BOTH decoration and hazards.
  const binImage = new Image();
  let binCrop = null;
  const paintedBinLoaded = new Promise(resolve => {
    binImage.onload = () => {
      // Source silhouette bounds of painted-bin.png (transparent margins removed).
      // Authored crop avoids readbacks and also permits direct file-based play.
      binCrop={x:32,y:247,w:1030,h:1105};
      cache.delete('bin');resolve();
    };
    binImage.onerror = () => resolve();
  });
  binImage.src='assets/art/painted-bin.png';
  const utilityImage=new Image();
  const paintedUtilityLoaded=new Promise(resolve=>{
    utilityImage.onload=()=>{cache.delete('utility');resolve();};utilityImage.onerror=resolve;
  });
  utilityImage.src='assets/v98_clean_utility.webp';
  const fraction = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  function gradient(c, a, b, colors) {
    const g = c.createLinearGradient(...a, ...b);
    colors.forEach((color, i) => g.addColorStop(i / (colors.length - 1), color));
    return g;
  }
  function shape(c, points, fill, line = INK, weight = 2.5) {
    c.beginPath();
    points.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p));
    c.closePath(); c.fillStyle = fill; c.fill();
    if (line) { c.lineWidth = weight; c.strokeStyle = line; c.stroke(); }
  }
  function stroke(c, points, color, width = 2) {
    c.beginPath(); points.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p));
    c.strokeStyle = color; c.lineWidth = width; c.stroke();
  }
  function round(c, x, y, w, h, r, fill, line = INK, weight = 2.5) {
    c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = fill; c.fill();
    if (line) { c.strokeStyle = line; c.lineWidth = weight; c.stroke(); }
  }
  function oval(c, x, y, rx, ry, fill, line = null, weight = 2) {
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fillStyle = fill; c.fill();
    if (line) { c.strokeStyle = line; c.lineWidth = weight; c.stroke(); }
  }
  function shadow(c, width, alpha = .25) {
    oval(c, 3, 1, width * .52, Math.max(3, width * .045), `rgba(31,28,24,${alpha})`);
  }
  function scratches(c, x, y, w, h, count, seed, light = '#f8dc9a', dark = '#20291c') {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    for (let i = 0; i < count; i++) {
      const xx = x + fraction(i + seed) * w, yy = y + fraction(i * 3 + seed + 19) * h;
      c.globalAlpha = .13 + fraction(i + 34) * .18;
      stroke(c, [[xx, yy], [xx + 1 + fraction(i + 6) * 6, yy - .6]], i % 3 ? light : dark, .5 + fraction(i + 50));
    }
    c.restore();
  }
  function leaf(c, x, y, s, rotation, color) {
    c.save(); c.translate(x, y); c.rotate(rotation); c.scale(s, s);
    shape(c, [[-6,0],[-3,-2],[-4,-5],[-1,-4],[0,-8],[2,-4],[5,-5],[4,-1],[7,0],[2,2],[1,5],[-1,2],[-6,3]], color, '#745731', .5);
    stroke(c, [[0,4],[0,-5]], '#a27837', .6); c.restore();
  }
  function litter(c, width, seed = 8) {
    for (let i = 0; i < 9; i++) {
      const x = (fraction(i + seed) - .5) * width;
      const y = fraction(i + seed * 2) * 4;
      leaf(c, x, y, .32 + fraction(i + 45) * .20, fraction(i + 1) * 6.28,
        ['#c5832e','#d7a13a','#aa6230','#e1b44e'][i % 4]);
    }
  }
  function bench(c) {
    shadow(c, 170); litter(c, 186);
    // Curved cast-iron feet, raised bolts, and a bank of irregular wooden slats.
    for (const x of [-63, 59]) {
      c.save(); c.translate(x, 0);
      stroke(c, [[-6,-42],[-2,-24],[-8,-3],[-14,0]], INK, 9);
      stroke(c, [[2,-24],[10,-4],[18,-2]], INK, 8);
      stroke(c, [[-6,-42],[-3,-24],[-8,-4]], '#637165', 3);
      oval(c, -2, -26, 5, 5, '#333e32', INK, 1.3);
      c.restore();
    }
    for (let j = 0; j < 4; j++) {
      const y = -70 + j * 8.5;
      shape(c, [[-78,y+1],[76,y-1],[79,y+9],[-78,y+11]], gradient(c, [-65,y], [72,y+8], ['#dfad5e','#bc813e','#925c2e']), INK, 2.1);
      stroke(c, [[-75,y+2],[74,y]], '#f5c37a', 1.2);
      scratches(c, -74, y + 2, 145, 7, 18, 70 + j * 12);
      for (const x of [-63, 62]) oval(c, x, y + 5, 1.6, 1.7, '#50452d');
      stroke(c, [[-33+j*19,y+4],[-13+j*19,y+3]], '#86552d', .7);
    }
    shape(c, [[-81,-39],[78,-40],[88,-28],[-86,-27]], '#c48f4f', INK, 2.5);
    shape(c, [[-86,-27],[88,-28],[88,-22],[-86,-21]], '#8d5a31', INK, 1.8);
    stroke(c, [[-80,-35],[79,-36]], '#e2b56b', 1.3);
    stroke(c, [[-78,-29],[81,-30]], '#6f4d2d', 1.1);
    for (const x of [-75, 75]) {
      c.beginPath(); c.moveTo(x, -29); c.bezierCurveTo(x-14,-44,x-11,-57,x+1,-55);
      c.strokeStyle=INK; c.lineWidth=6; c.stroke();
      c.strokeStyle='#849080'; c.lineWidth=1.5; c.stroke();
    }
  }
  function bin(c) {
    if(!binCrop)return;
    shadow(c, 62); litter(c, 79, 18);
    c.imageSmoothingEnabled=true;
    c.imageSmoothingQuality='high';
    const height=64*binCrop.h/binCrop.w;
    c.drawImage(binImage,binCrop.x,binCrop.y,binCrop.w,binCrop.h,-32,-height,64,height);
  }
  function utility(c){
    if(!utilityImage.naturalWidth)return;
    // The original cabinet is square; preserve its proportions and the whole
    // planted silhouette rather than stretching or clipping it into a tall box.
    const scale=80/120;shadow(c,94,.20);
    c.drawImage(utilityImage,-110*scale,-142*scale,195*scale,142*scale);
  }
  function cone(c, x = 0, y = 0, scale = 1) {
    c.save(); c.translate(x,y); c.scale(scale,scale);
    shadow(c, 43, .19);
    shape(c, [[-23,-6],[-15,-12],[19,-12],[25,-5],[22,0],[-22,1]], '#30352b', INK, 2.1);
    shape(c, [[-16,-7],[-5,-55],[4,-55],[17,-7]], gradient(c, [-10,-46], [18,-4], ['#ffbb56','#e96f2e','#a94420']), INK, 2.6);
    shape(c, [[-11,-29],[10,-29],[13,-20],[-13,-20]], '#f7e6c3', '#c7b799', .6);
    shape(c, [[-7,-46],[6,-46],[8,-39],[-9,-39]], '#f6e7c7', '#c7b799', .6);
    stroke(c, [[-12,-11],[-3,-51]], '#ffcf79', 1.3);
    scratches(c,-14,-52,28,44,18,88,'#ffcf79','#773c29');
    c.restore();
  }
  function barrier(c) {
    shadow(c, 108); litter(c, 119, 28);
    for(const x of [-39,39]) {
      shape(c, [[x-5,-48],[x+4,-48],[x+11,-3],[x-9,-3]], '#676d60', INK, 2.5);
      round(c,x-16,-5,33,6,2,'#3e4539',INK,2);
      stroke(c,[[x,-42],[x+3,-10]],'#bdbaa0',1.5);
    }
    round(c,-53,-66,106,29,3,'#efcc76',INK,3);
    c.save(); c.beginPath(); c.rect(-51,-64,102,25); c.clip();
    for(let i=-80;i<80;i+=28) shape(c,[[i,-38],[i+20,-65],[i+32,-65],[i+13,-38]],'#c55b30',null);
    scratches(c,-51,-64,102,25,40,23);
    c.restore();
    stroke(c,[[-50,-63],[50,-63]],'#ffe9b4',1.8);
    for(const x of [-45,45])oval(c,x,-51,2.2,2.2,'#464b3d','#e7d29e',.6);
    // Amber warning lamp has a substantial mounting bracket.
    round(c,-7,-77,14,10,2,'#535947',INK,1.8);
    oval(c,0,-81,10,10,'#d89525',INK,2.6);
    oval(c,-2,-83,6,6,'#ffc94f'); oval(c,-4,-85,2.7,2.7,'#fff2b7');
  }
  function scooter(c) {
    shadow(c, 105); litter(c, 110, 43);
    for(const [x,y] of [[-36,-9],[41,-8]]){
      oval(c,x,y,11,11,'#292d28',INK,2.5);oval(c,x,y,6,6,'#888c79',INK,1.5);oval(c,x,y,2,2,'#c8c3a6');
    }
    shape(c,[[-38,-20],[24,-19],[28,-12],[-36,-13]],'#719ca0',INK,2.8);
    stroke(c,[[-32,-18],[18,-17]],'#bfd1bd',1.6);
    stroke(c,[[24,-15],[33,-31],[11,-58]],INK,8);
    stroke(c,[[24,-15],[33,-31],[11,-58]],'#6d8e8f',3.8);
    stroke(c,[[11,-58],[-5,-58]],INK,7);
    stroke(c,[[11,-58],[-4,-58]],'#7a8070',2);
    stroke(c,[[31,-28],[43,-13]],'#8ca4a1',2);
    stroke(c,[[28,-36],[22,-33]],'#1d2925',2);
    stroke(c,[[13,-52],[15,-35],[28,-23]],'#303b31',1.2);
    oval(c,24,-16,3,3,'#dfb766',INK,1);
    scratches(c,-30,-19,46,5,15,56);
  }
  function cart(c) {
    shadow(c, 92); litter(c, 104, 26);
    const metal=gradient(c,[-42,-62],[45,0],['#b5b5a0','#737f73','#434f41']);
    stroke(c,[[-39,-60],[-44,-71],[-53,-73]],INK,5);
    stroke(c,[[-39,-60],[-44,-71],[-52,-73]],'#acb7a2',2);
    stroke(c,[[-32,-29],[-24,-12],[33,-12]],INK,6);
    stroke(c,[[-32,-29],[-24,-12],[33,-12]],'#7c8e7b',2.5);
    shape(c,[[-41,-60],[43,-56],[32,-29],[-30,-29]],'#68745c88',INK,3);
    for(let i=0;i<6;i++)stroke(c,[[-35+i*14,-59+i*.65],[-27+i*11,-30]],'#bec1a7',1.4);
    for(let j=0;j<3;j++)stroke(c,[[-38+j*3,-52+j*8],[40-j*3,-49+j*7]],'#acb49b',1.2);
    stroke(c,[[-40,-60],[43,-56],[32,-29],[-30,-29],[-40,-60]],metal,2);
    // Bent takeaway carton and a crumpled bag inside the wire basket.
    shape(c,[[-18,-48],[-16,-67],[3,-65],[7,-46]],'#bd9b62',INK,1.7);
    stroke(c,[[-15,-66],[-6,-71],[3,-65]],'#e1c38e',1.4);
    shape(c,[[6,-39],[3,-54],[17,-58],[27,-44],[21,-34]],'#d7c29a',INK,1.5);
    stroke(c,[[7,-52],[16,-48],[13,-39]],'#ac936c',1.1);
    for(const x of [-25,31]){
      stroke(c,[[x,-12],[x,-5]],'#454e40',3);
      oval(c,x,-4,6,7,'#30392f',INK,1.5);oval(c,x,-4,2,3,'#89977f');
    }
  }
  function glass(c) {
    shadow(c,72,.12);
    for(let i=0;i<14;i++){
      const x=(fraction(i+5)-.5)*74,y=-fraction(i+22)*8;
      c.save();c.translate(x,y);c.rotate(fraction(i+45)*3);
      shape(c,[[-3,1],[-1,-7-fraction(i+9)*9],[6,-2],[3,2]],i%3?'#82a88b':'#c6d7b0','#354e36',.9);
      stroke(c,[[-1,-7],[2,-2]],'#e1ead0',.8);c.restore();
    }
    c.save();c.translate(-4,-6);c.rotate(-.4);
    shape(c,[[-13,0],[-14,-7],[-7,-10],[11,-10],[15,-6],[9,-2],[-2,-2],[-4,1]],'#426b3a',INK,1.5);
    stroke(c,[[-9,-8],[7,-8]],'#b2cf8c',1.2);c.restore();
    for(const x of [-28,23]){stroke(c,[[x,-12],[x,-17]],'#f7edbc',1);stroke(c,[[x-3,-14],[x+3,-14]],'#f7edbc',1);}
  }
  function parcel(c) {
    shadow(c,57);
    shape(c,[[-27,-35],[13,-39],[30,-27],[-9,-21]],'#d5ae70',INK,2.4);
    shape(c,[[-27,-35],[-9,-21],[-8,-1],[-26,-12]],'#956b42',INK,2.5);
    shape(c,[[-9,-21],[30,-27],[29,-7],[-8,-1]],'#bc8e53',INK,2.5);
    shape(c,[[-11,-37],[-2,-37],[14,-25],[5,-23]],'#e7cca0',null);
    shape(c,[[5,-23],[14,-25],[13,-5],[5,-4]],'#d3b180',null);
    round(c,15,-21,9,9,0,'#dfd5b1',null);
    stroke(c,[[17,-18],[22,-19],[17,-16],[22,-17]],'#70694a',.7);
    scratches(c,-8,-22,36,19,22,31);
  }
  function barrel(c) {
    shadow(c,61);litter(c,78,39);
    round(c,-27,-68,54,65,6,gradient(c,[-27,-50],[27,-50],['#a56c36','#ca9954','#6b512f']),INK,3);
    oval(c,0,-67,27,7,'#c3a16a',INK,2.5);
    oval(c,0,-67,22,4,'#7d6846','#d0ae77',1);
    for(const x of [-16,-5,8,19])stroke(c,[[x,-62],[x,-9]],'#75562e',1);
    round(c,-28,-53,56,6,1,'#5c6251',INK,1.4);round(c,-28,-19,56,6,1,'#5c6251',INK,1.4);
    stroke(c,[[-25,-52],[24,-52]],'#b4b29a',1);stroke(c,[[-25,-18],[24,-18]],'#aaa78c',1);
    scratches(c,-24,-59,48,50,38,12);
  }
  function lamp(c) {
    shadow(c,43,.14);
    shape(c,[[-11,0],[-8,-7],[-5,-11],[-4,-188],[3,-188],[5,-11],[9,-7],[11,0]],'#394334',INK,2.5);
    stroke(c,[[-2,-16],[-2,-181]],'#98a184',1.4);
    stroke(c,[[-3,-185],[-3,-209],[4,-218],[21,-218]],INK,7);
    stroke(c,[[-3,-185],[-3,-209],[4,-216],[21,-216]],'#68765a',2.7);
    shape(c,[[9,-216],[30,-216],[34,-205],[7,-205]],'#384633',INK,2.5);
    shape(c,[[10,-204],[31,-204],[28,-198],[13,-198]],'#eed592',INK,1.7);
    oval(c,21,-201,7,2,'#fff2bd');
    for(let i=0;i<3;i++) stroke(c,[[-7+i*6,-8],[-7+i*6,-2]],'#858970',.8);
  }
  const painters = {
    bench: {paint:bench,base:180}, bin: {paint:bin,base:64},utility:{paint:utility,base:80},
    cone: {paint:cone,base:50}, barrier: {paint:barrier,base:110},
    scooter: {paint:scooter,base:106}, cart: {paint:cart,base:106},
    glass: {paint:glass,base:78}, parcel: {paint:parcel,base:60},
    barrel: {paint:barrel,base:60}, lamp: {paint:lamp,base:42}
  };
  function sprite(key) {
    if(cache.has(key))return cache.get(key);
    const item=painters[key];if(!item)return null;
    const cv=document.createElement('canvas');cv.width=480;cv.height=640;
    const c=cv.getContext('2d');c.scale(2,2);c.translate(120,290);
    c.lineJoin='round';c.lineCap='round';item.paint(c);
    const result={canvas:cv,base:item.base};cache.set(key,result);return result;
  }
  function fire(c,time) {
    const t=Number(time)||0;
    const sway=Math.sin(t*3.8)*3.4, curl=Math.sin(t*5.1+1.7)*2.8;
    const flicker=Math.sin(t*7.3)*2+Math.sin(t*11.9)*1.1;
    c.save();c.lineJoin='round';c.lineCap='round';
    const glow=c.createRadialGradient(0,-105,3,0,-105,65);
    glow.addColorStop(0,'#ffae3439');glow.addColorStop(.55,'#ff8a2018');glow.addColorStop(1,'#ff8a2000');
    oval(c,0,-105,65,76,glow);
    // Unequal, overlapping rolls keep the charcoal smoke soft and open at its edges.
    for(let i=0;i<9;i++){
      const age=(t*.19+i*.117)%1, r=8+age*22;
      const x=(fraction(i+31)-.5)*19+Math.sin(t*.7+i*2.1)*6+age*16;
      const y=-109-age*119, a=(1-age)*(.22+fraction(i+9)*.13);
      const smoke=c.createRadialGradient(x-r*.15,y+r*.2,1,x,y,r*1.25);
      smoke.addColorStop(0,`rgba(35,37,31,${a})`);
      smoke.addColorStop(.55,`rgba(49,48,39,${a*.7})`);smoke.addColorStop(1,'rgba(49,48,39,0)');
      c.fillStyle=smoke;c.beginPath();c.moveTo(x-r,y+r*.3);
      c.bezierCurveTo(x-r*1.3,y-r*.12,x-r*.72,y-r*.6,x-r*.35,y-r*.5);
      c.bezierCurveTo(x-r*.43,y-r*1.13,x+r*.45,y-r*1.18,x+r*.65,y-r*.6);
      c.bezierCurveTo(x+r*1.3,y-r*.67,x+r*1.35,y+r*.14,x+r*.73,y+r*.48);
      c.bezierCurveTo(x+r*.57,y+r,x-r*.74,y+r*.95,x-r,y+r*.3);c.fill();
    }
    // A low red bank and two curled rear folds give the fire depth at the mouth.
    c.beginPath();c.moveTo(-27,-82);
    c.bezierCurveTo(-37,-94,-24,-108,-29+curl,-126);
    c.bezierCurveTo(-17,-120,-23,-105,-10,-111);
    c.bezierCurveTo(1,-124,-4+sway,-150,9+sway,-159-flicker);
    c.bezierCurveTo(5,-138,24,-131,19,-113);
    c.bezierCurveTo(29,-121,29+curl,-132,31+curl,-137);
    c.bezierCurveTo(41,-115,25,-106,29,-91);
    c.bezierCurveTo(29,-81,14,-80,-27,-82);c.closePath();
    c.fillStyle=gradient(c,[0,-81],[0,-161],['#973c1c','#d95017','#e47b27']);c.fill();
    const silhouette=()=>{
      c.beginPath();c.moveTo(-27,-82);
      c.bezierCurveTo(-33,-91,-24,-101,-23,-109);
      c.bezierCurveTo(-22,-118,-30+curl,-126,-23+curl,-139-flicker*.4);
      c.bezierCurveTo(-23,-126,-11,-131,-10,-116);
      c.bezierCurveTo(-2,-128,-12+sway,-143,-4+sway,-161-flicker);
      c.bezierCurveTo(-6+sway,-146,9,-144,6,-130);
      c.bezierCurveTo(17,-137,11+curl,-146,20+curl,-151+flicker*.6);
      c.bezierCurveTo(18,-135,31,-128,23,-115);
      c.bezierCurveTo(33,-117,32,-123,33+sway*.4,-127);
      c.bezierCurveTo(39,-112,24,-104,28,-94);
      c.bezierCurveTo(31,-86,22,-81,15,-81);
      c.bezierCurveTo(2,-79,-17,-80,-27,-82);c.closePath();
    };
    silhouette();c.fillStyle=gradient(c,[0,-80],[0,-159],['#e45d17','#f58a1d','#ffad31','#fbaa3c']);c.fill();
    c.strokeStyle='rgba(143,63,24,.5)';c.lineWidth=.85;c.stroke();
    // Broad amber folds flow into one another instead of repeating separate tongues.
    c.beginPath();c.moveTo(-22,-83);
    c.bezierCurveTo(-27,-97,-11,-102,-16+curl*.5,-119);
    c.bezierCurveTo(-7,-114,-11,-101,-3,-106);
    c.bezierCurveTo(5,-118,-3+sway*.7,-132,-2+sway,-145-flicker*.5);
    c.bezierCurveTo(1,-134,15,-122,9,-112);
    c.bezierCurveTo(15,-117,19+curl*.4,-127,19+curl*.4,-133);
    c.bezierCurveTo(29,-119,16,-107,22,-96);
    c.bezierCurveTo(25,-88,19,-82,11,-82);c.closePath();
    c.fillStyle=gradient(c,[0,-82],[0,-145],['#ffd564','#ffbb32','#ffd75a']);c.fill();
    c.beginPath();c.moveTo(-16,-83);
    c.bezierCurveTo(-20,-94,-7,-99,-10,-110+curl);
    c.bezierCurveTo(-3,-107,-5,-98,1,-101);
    c.bezierCurveTo(6,-108,1+sway*.4,-117,5+sway*.4,-126-flicker*.3);
    c.bezierCurveTo(6,-112,18,-104,14,-96);
    c.bezierCurveTo(19,-92,17,-86,15,-82);c.closePath();
    c.fillStyle=gradient(c,[0,-83],[0,-125],['#fff3b4','#ffe68a','#ffdc59']);c.fill();
    // Sparse pigment flecks break up the smooth fills without shimmering each frame.
    c.save();silhouette();c.clip();
    for(let i=0;i<42;i++){
      const x=(fraction(i+71)-.5)*59,y=-85-fraction(i+128)*70;
      c.globalAlpha=.12+fraction(i+201)*.16;
      oval(c,x+Math.sin(t*2+i)*.7,y,.35+fraction(i+91)*1.1,.55+fraction(i+181)*1.7,
        i%3?'#fff0a2':'#b44c1d');
    }
    c.restore();
    // Small detached licks and rising embers follow different paths and lifetimes.
    for(let i=0;i<11;i++){
      const age=(t*(.37+i*.011)+fraction(i+18))%1;
      const x=(fraction(i+8)-.5)*48+Math.sin(age*5+i*2+t*.6)*(3+age*6);
      const y=-99-age*(77+fraction(i+51)*36), size=(1-age)*(.7+fraction(i+24)*1.2);
      c.globalAlpha=(1-age)*.85;
      oval(c,x,y,size*.65,size*(i%3?1.5:2.5),i%3?'#ffd374':'#f78b2e');
    }
    c.globalAlpha=1;
    stroke(c,[[-28,-84],[-19,-82],[-9,-82],[3,-81],[17,-83],[28,-85]],'rgba(43,45,28,.9)',2.6);
    c.restore();
  }
  const aliases={bench_a:'bench',bench_b:'bench',wooden_bench:'bench',trash_bin:'bin',fire_bin:'bin',wheelie_bin:'bin',cones:'cone',roadwork:'barrier',roadblock:'barrier',scooter_broken:'scooter',cart_hazard:'cart',streetlamp:'lamp'};
  function draw(ctx,key,x,groundY,width,time=0) {
    key=aliases[key]||key;
    const painted={scooter:'hazard-scooter',cart:'hazard-cart',barrier:'hazard-barrier',cone:'hazard-cones',glass:'hazard-glass',pothole:'hazard-pothole'}[key];
    if(painted&&window.BearlyAtlas.info(painted)){
      ctx.save();ctx.fillStyle='rgba(34,40,31,.18)';ctx.beginPath();ctx.ellipse(x,groundY+1,width*.42,Math.max(2,width*.035),0,0,Math.PI*2);ctx.fill();ctx.restore();
      if(window.BearlyAtlas.draw(ctx,painted,x,groundY,width))return true;
    }
    const art=sprite(key);if(!art||!Number.isFinite(groundY))return false;
    const scale=(width||art.base)/art.base;
    ctx.save();ctx.translate(x,groundY);ctx.scale(scale,scale);
    ctx.drawImage(art.canvas,-120,-290,240,320);ctx.restore();return true;
  }
  function hazard(ctx,h,groundY,time=0) {
    if(!Number.isFinite(groundY))return false;
    const widths={firebin:64,roadblock:102,roadwork:76,cart:106,scooter:105,glass:78,parcel:60,barrel:60,pothole:70};
    if(!Object.prototype.hasOwnProperty.call(widths,h.type))return false;
    // Widths follow existing obstacle artwork. Physics still owns h.w separately.
    if(h.type==='firebin'){
      const scale=widths.firebin/64;
      ctx.save();ctx.translate(h.x,groundY);ctx.scale(scale,scale);
      const art=sprite('bin');ctx.drawImage(art.canvas,-120,-290,240,320);
      // Match the flame roots to the painted opening, preserving sprite aspect.
      const bodyHeight=binCrop?64*binCrop.h/binCrop.w:91;
      ctx.save();ctx.translate(0,83-bodyHeight*.91);fire(ctx,time+h.x*.0003);ctx.restore();
      ctx.restore();return true;
    }
    const paintedKey={scooter:'hazard-scooter',cart:'hazard-cart',roadblock:'hazard-barrier',roadwork:'hazard-cones',glass:'hazard-glass',pothole:'hazard-pothole'}[h.type];
    const limits={scooter:[94,56],cart:[80,77],roadblock:[94,50],roadwork:[69,57],glass:[78,28],pothole:[(h.w||60)+12,22]}[h.type];
    const info=paintedKey&&window.BearlyAtlas.info(paintedKey);
    if(info&&limits){const scale=Math.min(limits[0]/info.w,limits[1]/info.h);if(window.BearlyAtlas.draw(ctx,paintedKey,h.x+(h.type==='pothole'?(h.w||60)/2:0),groundY,info.w*scale))return true;}
    if(h.type==='roadwork'){draw(ctx,'cone',h.x,groundY,64,time);return true;}
    return draw(ctx,h.type==='roadblock'?'barrier':h.type,h.x,groundY,widths[h.type],time);
  }
  const dimensions=(kind,width)=>{const base=kind==='utility'?80:kind==='bench'?180:64,scale=(width||base)/base;return{width:width||base,bodyHeight:(kind==='utility'?81:kind==='bench'?72:64*1105/1030)*scale,seatHeight:kind==='bench'?35*scale:null,footprintWidth:(kind==='utility'?115:kind==='bench'?180:79)*scale};};
  window.BearlyStreetProps={draw,hazard,dimensions,loaded:Promise.all([paintedBinLoaded,paintedUtilityLoaded]),ready:()=>!!binCrop&&!!utilityImage.naturalWidth};
})();
