/* TRAZO / original animated ink drawings. One visual language, from the cover to combat. */
const Art=(()=>{
 let c;const ink='#222c46',paper='#f7f1df',blue='#437ca0',red='#df6555',gold='#f3c84a',TAU=Math.PI*2;
 const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)},clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>1-Math.pow(1-clamp(n),3);
 function use(ctx){c=ctx;c.lineCap='round';c.lineJoin='round'}
 function line(points,color=ink,width=2,close=false,fill=null){c.lineWidth=width;c.strokeStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(close)c.closePath();if(fill){c.fillStyle=fill;c.fill()}c.stroke();c.save();c.globalAlpha*=.22;c.lineWidth=Math.max(.6,width*.4);c.beginPath();points.forEach(([x,y],i)=>{const dx=(noise(x+y)-.5)*2.4,dy=(noise(x-y)-.5)*2.4;i?c.lineTo(x+dx,y+dy):c.moveTo(x+dx,y+dy)});if(close)c.closePath();c.stroke();c.restore()}
 function ellipse(x,y,rx,ry,color=ink,width=2,fill=null){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),-.04,0,TAU);c.lineWidth=width;c.strokeStyle=color;if(fill){c.fillStyle=fill;c.fill()}c.stroke();c.save();c.globalAlpha*=.3;c.beginPath();c.ellipse(x+.6,y-.4,rx+.7,Math.max(.1,ry-.3),.04,.1,6.1);c.lineWidth=.7;c.stroke();c.restore()}
 function rect(x,y,w,h,fill,stroke=ink,width=2){line([[x,y],[x+w,y-1],[x+w+1,y+h],[x-1,y+h]],stroke,width,true,fill)}
 function text(t,x,y,size=24,color=ink,angle=0,align='center',font='Trazo'){c.save();c.translate(x,y);c.rotate(angle);c.font=`${font==='Trazo'?700:400} ${size}px ${font}, "Chalkboard SE", cursive`;c.fillStyle=color;c.textAlign=align;c.fillText(t,0,0);c.restore()}
 function star(x,y,r=15,color=gold,rot=0){c.save();c.translate(x,y);c.rotate(rot);line([[0,-r],[r*.23,-r*.25],[r,0],[r*.23,r*.23],[0,r],[-r*.25,r*.25],[-r,0],[-r*.25,-r*.25]],ink,Math.max(.8,r*.08),true,color);c.restore()}
 function burstShape(x,y,r=50,color=gold,points=15){const p=[];for(let i=0;i<points*2;i++){const a=i*Math.PI/points,v=i%2?r*.7:r*(.85+noise(i)*.3);p.push([x+Math.cos(a)*v,y+Math.sin(a)*v*.78])}line(p,ink,2,true,color)}
 function hatch(x,y,w,h,color=ink,gap=6){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();for(let i=-h;i<w+h;i+=gap)line([[x+i,y+h],[x+i+h,y]],color,.7);c.restore()}
 function ground(x,y,w=25){c.save();c.fillStyle='#222c4613';c.beginPath();c.ellipse(x,y,w,w*.21,0,0,TAU);c.fill();c.restore()}
 function pencil(x,y,angle=0,scale=1){c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);
  line([[-7,-48],[6,-48],[7,35],[0,60],[-8,34]],ink,2.2,true,gold);line([[-7,-36],[6,-36],[7,-26],[-7,-26]],ink,1.4,true,'#a0b2b6');line([[-5,-33],[5,-33]],paper,1.2);
  line([[-7,-48],[6,-48],[6,-36],[-7,-36]],ink,1.5,true,red);line([[1,-23],[2,32]],'#c18b30',1.2);line([[-4,-22],[-3,31]],'#fff0a1',1.4);
  line([[-8,34],[-4,36],[-1,32],[3,36],[7,35],[0,60]],ink,1.3,true,'#dbac76');line([[-2.6,50],[2.6,50],[0,60]],ink,1,true,ink);
  c.save();c.rotate(-Math.PI/2);text('Nº 2',-4,3,7,ink,0,'center','Arial');c.restore();c.restore();
 }
 function shoe(x,y,flip=1){c.save();c.translate(x,y);c.scale(flip,1);line([[-7,-4],[7,-5],[12,-1],[14,5],[-9,6],[-10,1]],ink,2,true,paper);line([[-8,3],[12,2]],ink,1);line([[-2,-3],[2,0],[5,-3]],ink,1.2);c.restore()}
 function hand(x,y,r=5){ellipse(x,y,r,r*.85,ink,1.6,paper);line([[x+1,y-3],[x+1,y+1]],ink,.7)}
 function player(x,y,t=0,opts={}){
  const {angle=-.5,walk=0,attack=0,dash=0,scale=1,alpha=1,hurt=0,weapon=true,mood='idle',pose='idle'}=opts;
  c.save();c.translate(x,y);c.scale(scale,scale);c.globalAlpha*=alpha;ground(0,19,29);
  const step=Math.sin(t*15)*walk*11,bob=Math.sin(t*15)*walk*2+Math.sin(t*3)*.7;
  c.translate(0,bob);if(pose==='pull'){c.rotate(-.17-Math.sin(t*18)*.055);c.scale(1.04,1+Math.sin(t*18)*.025)}else c.rotate(dash?.18:Math.sin(t*15)*walk*.055);
  line([[-8,-4],[-12+step,8],[-19+step,16]],ink,5);line([[7,-4],[11-step,9],[20-step,15]],ink,5);shoe(-22+step,16,1);shoe(24-step,15,-1);
  // An ink-drop body and a white paper face give the tiny hero a readable silhouette.
  c.fillStyle=ink;c.strokeStyle=ink;c.lineWidth=2;c.beginPath();c.moveTo(-11,-26);c.bezierCurveTo(-23,-14,-13,4,0,4);c.bezierCurveTo(16,4,18,-15,10,-26);c.closePath();c.fill();c.stroke();
  line([[-8,-10],[-3,-6]],'#697087',1.5);ellipse(4,-9,1.6,1.6,paper,.5,paper);
  let aa=attack?angle+(1-attack)*3-1.5:angle;
  let hx=Math.cos(aa)*27,hy=-22+Math.sin(aa)*20;
  if(!weapon){hx=pose==='pull'?24:mood==='startled'?23:19;hy=pose==='pull'?-21:mood==='startled'?-41:-12}
  line([[-9,-23],[-23,-15],[-28,-23+(weapon?0:8)]],ink,4.8);hand(-28,-23+(weapon?0:8));
  line([[9,-23],[hx*.62,-24+(hy+24)*.35],[hx,hy]],ink,5);
  if(weapon)pencil(hx+Math.cos(aa)*32,hy+Math.sin(aa)*32,aa-Math.PI/2,.9);
  hand(hx,hy);if(pose==='pull'){line([[-10,-23],[7,-13],[29,-18]],ink,4);hand(29,-18)}
  c.save();c.translate(0,-44);c.rotate(hurt?-.17:mood==='curious'?.14:mood==='strain'?-.12:Math.sin(t*2.2)*.025);
  // Ragged crown, chunky ink contour, off-centre mask.
  line([[-23,1],[-25,-13],[-19,-18],[-23,-27],[-11,-23],[-6,-32],[2,-24],[14,-29],[14,-20],[23,-17],[25,-2],[20,14],[8,20],[-9,18],[-21,11]],ink,2.2,true,ink);
  c.beginPath();c.moveTo(-19,-8);c.bezierCurveTo(-8,-18,18,-14,20,-3);c.bezierCurveTo(24,14,8,20,-6,14);c.bezierCurveTo(-17,13,-23,5,-19,-8);c.fillStyle=paper;c.fill();c.strokeStyle=ink;c.lineWidth=1.5;c.stroke();
  const px=Math.cos(angle)*2,blink=(t%4.1>3.92)&&mood==='idle';
  if(mood==='sleep'||blink){line([[-13,0],[-5,2]],ink,2);line([[5,2],[13,0]],ink,2)}
  else if(hurt||mood==='strain'){line([[-13,-2],[-6,2],[-13,5]],ink,2);line([[13,-2],[6,2],[13,5]],ink,2)}
  else{const surprise=mood==='startled';ellipse(-9,0,4.5,surprise?8:6,ink,1,paper);ellipse(9,0,4.5,surprise?8:7,ink,1,paper);ellipse(-9+px,1,2.1,3.3,ink,.5,ink);ellipse(9+px,1,2.1,3.3,ink,.5,ink);line([[-15,-11],[-6,-8]],ink,2.3);line([[5,-8],[15,-11+(mood==='curious'?5:0)]],ink,2.3)}
  if(mood==='startled')ellipse(1,11,3.8,4.4,ink,1,ink);else if(mood==='grin'||attack){line([[-7,8],[8,7],[5,13],[-2,14]],ink,1.2,true,paper);line([[0,8],[0,12]],ink,.8)}else if(mood==='strain')line([[-5,11],[5,10]],ink,2);else line([[-4,10],[1,12],[6,9]],ink,1.7);
  line([[-18,6],[-15,7]],red,1.5);line([[15,7],[18,6]],red,1.5);c.restore();
  // Long, elastic bandana. It leads motion and snaps behind every dash.
  const tail=weapon?Math.sin(t*9)*5:Math.sin(t*5)*3;
  line([[-13,-26],[-39-tail,-29],[-31-tail,-20],[-46-tail,-17],[-28,-13],[-7,-21]],ink,1.6,true,gold);
  line([[-17,-26],[9,-22],[8,-16],[-12,-20]],ink,1.6,true,gold);line([[-33,-23],[-18,-22]],'#b78b2c',1);c.restore();
 }
 function angryEyes(x,y,scale=1,wide=false){c.save();c.translate(x,y);c.scale(scale,scale);for(const side of [-1,1]){ellipse(side*10,0,7,wide?9:6,ink,1.5,paper);ellipse(side*9,1,2.5,3.4,ink,.6,ink);line([[side*18,-10],[side*3,-5]],ink,3)}c.restore()}
 function enemy(e,t=0){
  c.save();c.translate(e.x,e.y);const boss=e.type==='boss';const born=e.born>0?1-Math.pow(e.born/.32,2):1;c.scale((boss?1.6:1.13)*born,(boss?1.6:1.13)*born);const wind=e.wind>0,charge=e.charge>0;
  if(e.flash>0){c.globalAlpha=.65+Math.sin(e.flash*100)*.25;c.rotate(Math.sin(e.flash*60)*.075)}ground(0,23,boss?45:31);
  const walk=Math.sin(t*(charge?24:9)+(e.id||0));c.translate(0,charge?0:walk*1.6);
  if(e.type==='eraser'){
   c.rotate(wind?-walk*.035:charge?-.15:walk*.035);line([[-20,9],[-23,21],[-31,22]],ink,4);line([[16,10],[22,19],[30,21]],ink,4);shoe(-28,22);shoe(28,22,-1);
   line([[-32,-14],[-21,-31],[18,-29],[32,-17],[30,11],[20,19],[-21,19],[-31,10],[-26,4],[-32,0]],ink,2.8,true,'#ed9682');
   line([[-21,-31],[-14,-19],[32,-17]],ink,1.8);line([[8,-30],[12,-19],[10,17],[21,18],[30,11],[32,-17],[18,-29]],ink,1.3,true,'#f8deaa');
   hatch(13,-14,16,26,'#b29278',5);text('GOMA',-10,-20,7,ink,0,'center','Arial');angryEyes(-5,-7,.85,wind);
   line([[-20,7],[-15,3],[3,3],[10,8],[5,14],[-14,14]],ink,1.5,true,ink);line([[-15,4],[-8,4],[-9,10],[-14,9]],ink,.8,true,paper);line([[0,4],[6,6],[3,11],[-1,9]],ink,.8,true,paper);
   line([[-28,-8],[-41,-2],[-44,8]],ink,4);ellipse(-44,9,6,5,ink,1.7,'#ed9682');line([[28,-8],[38,-1],[40,8]],ink,4);ellipse(40,9,6,5,ink,1.7,'#ed9682');
   for(let i=0;i<3;i++)line([[-23+i*7,24],[-25+i*8,27]],red,1.3);
  }else if(e.type==='clip'){
   for(const side of [-1,1]){line([[side*13,7],[side*(25+walk*2),4],[side*36,18],[side*43,17]],ink,2.5);line([[side*10,17],[side*20,24],[side*(30-walk*2),32]],ink,2.5)}
   c.rotate(wind?.14:walk*.085);c.save();c.scale(wind?1.2:1,wind?.76:1);
   c.strokeStyle=ink;c.lineWidth=8;c.beginPath();c.moveTo(13,10);c.lineTo(13,-21);c.bezierCurveTo(13,-42,-16,-42,-16,-20);c.lineTo(-16,16);c.bezierCurveTo(-16,39,11,39,11,15);c.lineTo(11,-15);c.bezierCurveTo(11,-28,-6,-28,-6,-14);c.lineTo(-6,10);c.stroke();c.strokeStyle='#8fb8c4';c.lineWidth=4.3;c.stroke();
   line([[-11,-29],[-21,-38],[-26,-34]],ink,2);line([[11,-28],[24,-34],[28,-30]],ink,2);angryEyes(-2,-5,.9,wind);line([[-8,10],[-2,6],[5,9],[0,17]],ink,1.6,true,ink);c.restore();
  }else if(e.type==='pencil'){
   c.rotate(wind?-.17:walk*.04);line([[-5,13],[-17,27],[-25,27]],ink,3);line([[7,15],[18,27],[28,23]],ink,3);shoe(-25,25);shoe(27,23,-1);
   pencil(0,-10,.04,.85);line([[-8,-24],[-17,-20],[-10,-12],[-17,-7],[-6,-5],[0,-9],[11,-5],[18,-9],[10,-15],[16,-22],[7,-24]],ink,1.5,true,'#e4b07a');
   ellipse(0,-35,13,11,ink,2,'#ed9587');line([[-12,-40],[10,-45],[13,-41]],ink,2.3);angryEyes(-1,-30,.8,wind);
   line([[-12,-21],[-4,-18],[0,-22],[5,-18],[13,-22]],ink,2.4);line([[-6,-10],[-21,-2],[-30,-12]],ink,3);hand(-30,-12,4);line([[6,-10],[21,-17],[28,-9]],ink,3);hand(28,-9,4);pencil(30,-2,-.65,.35);
  }else if(boss){
   const rage=e.hp!==undefined&&e.hp<e.maxHp*.5,open=wind?.66:charge?.12:.3+Math.sin(t*3)*.08;
   for(const side of [-1,1]){line([[side*13,12],[side*39,25],[side*48,42],[side*61,40]],ink,3.2);line([[side*10,20],[side*24,44],[side*34,52]],ink,2.6);c.save();c.rotate(open*side);
    line([[-5,-3],[-13,-60],[-10,-97],[-1,-120],[8,-91],[10,-57],[6,0]],ink,2.4,true,'#bdcbd0');line([[0,-110],[3,-10]],paper,2.5);hatch(-8,-87,9,67,'#7d919f',7);
    ellipse(0,32,19,28,ink,3.2,rage?red:'#ee9470');ellipse(0,33,10,17,ink,2,paper);line([[-13,16],[-7,9]],paper,2);c.restore()}
   line([[-13,-9],[-9,-34],[2,-42],[14,-31],[12,-9],[0,1]],ink,2,true,ink);angryEyes(0,-23,.77,wind);ellipse(0,-5,8,8,ink,1.6,gold);line([[-3,-9],[3,-2]],ink,1.4);
   if(rage){for(const side of [-1,1]){line([[side*21,-19],[side*30,-30],[side*38,-26]],red,2);star(side*35,-42,7,red,t)}}
  }
  if(wind&&!boss){text('!',0,-63,26,red,walk*.03,'center','Bangers')}
  c.restore();
 }
 function grain(x,y,w,h,count=500){c.save();c.fillStyle=ink;for(let i=0;i<count;i++){c.globalAlpha=.035+noise(i+8)*.065;c.fillRect(x+noise(i)*w,y+noise(i+3000)*h,.6+noise(i+5),.6+noise(i+7))}c.restore()}
 function desk(){c.fillStyle='#202c3c';c.fillRect(0,0,1280,800);for(let i=0;i<52;i++)line([[0,i*18],[440,i*18+noise(i)*8],[1280,i*18-7]],'#7689970c',1);const g=c.createRadialGradient(680,370,100,660,400,850);g.addColorStop(0,'#7c8a8930');g.addColorStop(1,'#111c3077');c.fillStyle=g;c.fillRect(0,0,1280,800)}
 function sheet(){desk();c.save();c.shadowColor='#09112499';c.shadowBlur=25;c.shadowOffsetY=12;rect(53,46,1173,693,'#d7ccaf','#a49a83',1);c.shadowBlur=0;c.shadowOffsetY=0;for(let i=0;i<4;i++)line([[70,733-i*2],[1220,733-i*2]],paper,1);rect(52,42,1173,683,paper,'#e0d7bd',1);
  for(let y=75;y<724;y+=28)line([[54,y],[1222,y+1]],'#7397ae27',1);line([[160,43],[159,724]],'#df655556',1.7);line([[164,43],[163,724]],'#df65551d',1);
  const g=c.createLinearGradient(56,0,117,0);g.addColorStop(0,'#42425224');g.addColorStop(1,'#42425200');c.fillStyle=g;c.fillRect(56,44,69,680);
  for(let y=81;y<720;y+=43){ellipse(80,y,7,5,'#aaa18a',1,'#2a33494d');c.strokeStyle='#89939d';c.lineWidth=7;c.beginPath();c.ellipse(54,y-2,30,9,-.1,Math.PI*.14,Math.PI*1.94);c.stroke();c.strokeStyle='#dde1d9';c.lineWidth=2;c.stroke()}
  text('NO BORRAR',108,462,18,'#8b94a0',-Math.PI/2,'center','Bangers');star(106,581,13,'#d6b951',.1);line([[95,611],[111,620],[98,632],[111,641]],'#909bae',1.4);
  grain(70,53,1145,658,850);line([[1183,725],[1224,683],[1223,725]],'#c4b99b',1,true,'#e8dec1');line([[1183,725],[1195,686],[1224,683]],'#c4b99b',1,true,'#fffaec');c.restore();
 }
 function tapedNote(x,y,w,h,angle=0){c.save();c.translate(x,y);c.rotate(angle);c.shadowColor='#16243c33';c.shadowOffsetY=5;c.shadowBlur=7;rect(-w/2,-h/2,w,h,paper,ink,1.4);c.shadowBlur=0;c.shadowOffsetY=0;rect(-w*.2,-h/2-8,w*.4,21,'#f6edc7b0','#d8ca9b77',.6);c.restore()}
 function cover(t=0){
  desk();c.save();c.translate(645,401);c.rotate(-.025);c.shadowColor='#071326aa';c.shadowOffsetY=24;c.shadowBlur=37;rect(-553,-302,1098,621,'#c2ac74',ink,2);c.shadowBlur=0;c.shadowOffsetY=0;
  for(let i=0;i<5;i++)line([[-533,310-i*3],[543,310-i*3]],'#f8efce',1.5);rect(-555,-318,1098,620,'#edc04a',ink,3);rect(-555,-318,43,620,ink,ink,1);hatch(-549,-305,20,590,'#59606d',7);
  line([[-490,-288],[514,-288],[514,270],[-490,270]],'#9d793e',1);line([[-486,-284],[510,-284],[510,266],[-486,266]],'#fff1af99',1);grain(-501,-292,1020,560,1800);
  // Cover illustration: the same animated hero and monsters that inhabit the pages.
  c.save();c.translate(243,38);c.rotate(.05);burstShape(5,0,193,'#f8e6a6',22);c.save();c.globalAlpha=.14;for(let i=0;i<20;i++){const a=i*TAU/20;line([[Math.cos(a)*105,Math.sin(a)*100],[Math.cos(a)*190,Math.sin(a)*160]],ink,2)}c.restore();
  player(1,44,t,{scale:2.35,angle:-.75,mood:'grin',walk:.12});
  c.save();c.translate(-122,115);c.rotate(-.18);enemy({x:0,y:0,type:'eraser',id:1},t*.6);c.restore();c.save();c.translate(140,130);c.rotate(.18);enemy({x:0,y:0,type:'clip',id:2},t*.6);c.restore();
  star(-136,-110,14,paper,-.2);star(132,-92,16,red,.2);text('¡NO ME BORRES!',0,198,25,ink,-.035,'center','Bangers');line([[-125,206],[113,204]],ink,2);c.restore();
  text('propiedad de nadie',291,-194,24,ink,.07);line([[362,-181],[377,-157],[354,-146]],ink,1.6);line([[359,-154],[354,-146],[365,-144]],ink,1.6);
  text('vol. 01',454,252,21,ink,-.04,'center','Bangers');c.restore();
  pencil(1231,366,-.17,2.9);c.save();c.translate(49,585);c.rotate(-.28);enemy({type:'clip',x:0,y:0,id:5},0);c.restore();
 }
 function bubble(words,x,y,size=29,tail=1){c.save();c.font=`700 ${size}px Trazo`;const w=c.measureText(words).width+32;ellipse(x,y-8,w/2,26,ink,1.7,paper);line([[x+tail*9,y+15],[x+tail*24,y+33],[x+tail*25,y+11]],ink,1.5,true,paper);text(words,x,y+1,size,ink);c.restore()}
 function rays(x,y,t,inner=90,outer=350,color=gold){c.save();c.globalAlpha=.55;for(let i=0;i<24;i++){const a=i*TAU/24+t*.1;line([[x+Math.cos(a)*inner,y+Math.sin(a)*inner],[x+Math.cos(a)*(outer+Math.sin(i*5)*30),y+Math.sin(a)*outer]],color,i%3===0?4:1.2)}c.restore()}
 function opening(t,{strike=-1}={}){
  sheet();if(t<2){const p=ease(t/2);c.save();c.translate(79,43);c.scale(Math.max(.005,Math.cos(p*Math.PI/2)),1);rect(0,0,1146,682,gold,ink,3);text('TRAZO',574,340,177,ink,-.03,'center','Bangers');text('el primer trazo nunca se olvida.',574,395,31,ink);c.restore();return}
  // A continuous, staged camera move: paper -> waking -> stuck pencil -> the first cut.
  const pull=clamp((t-6)/3),reveal=ease((t-9)/1.4);let zoom=t<5?1.18:t<9?1.25:t<12?1.25+reveal*.17:1.22;
  c.save();c.translate(650,440);c.scale(zoom,zoom);c.translate(-650,-440);
  line([[252,502],[1075,502]],'#8994a23b',1.3);text('un martes cualquiera.',320,278,24,'#8d94a0',-.04);
  if(t<4){const a=clamp((t-2)/1.4);c.save();c.beginPath();c.rect(380,306,180,200*a);c.clip();player(475,487,t,{scale:1.6,weapon:false,mood:t<3.4?'sleep':'curious'});c.restore();if(t>3.1)bubble('¿yo?',530,352,27,-1);line([[437,514],[507,516]],ink,1.3)}
  else if(t<6){const p=ease((t-4)/2);player(475+p*163,487,t,{scale:1.6,weapon:false,mood:'startled',walk:1,angle:0});enemy({type:'eraser',x:305+p*105,y:474,wind:1,id:5},t);bubble('Te sobra existir.',365,355,26);pencil(782,415,.35,1.35);star(804,368,13,gold,t*.4);text('¿y eso?',737,330,25,blue,.09);}
  else if(t<9){const tug=Math.sin((t-6)*10);player(680-tug*5,487,t,{scale:1.65,weapon:false,mood:'strain',pose:'pull',angle:0});pencil(744+tug*2,431,.1+tug*.025,1.6);ellipse(747,516,37,8,'#7e8597',1);line([[747,508],[741,532],[753,548]],ink,1.7);bubble(t<7.4?'venga…':'¡VENGA!',677,326,t<7.4?27:34);if(t>7.2){line([[725,522],[714,541],[723,548]],ink,1.4);line([[759,522],[775,535]],ink,1.4)}enemy({type:'eraser',x:360+(t-6)*21,y:474,id:5},t);}
  else if(t<12){const p=ease((t-9)/1.1);rays(684,395,t,60,310);star(712,364,65*(1-p)+8,gold,t);player(682,487-Math.sin(p*Math.PI)*48,t,{scale:1.75,weapon:true,mood:'grin',angle:-1.16});ellipse(747,516,37,8,ink,1.6);for(let i=0;i<12;i++){const a=i*2.4;line([[746+Math.cos(a)*p*95,500+Math.sin(a)*p*80],[751+Math.cos(a)*p*95,505+Math.sin(a)*p*80]],ink,2)}enemy({type:'eraser',x:418,y:474,wind:1,id:5},t);text('¡SHINK!',855,302,57,red,.15,'center','Bangers');}
  else{
   const hit=strike>=0;const p=hit?ease(strike/.22):0;
   if(!hit){rays(657,409,t,115,310,'#dab345');player(657,486,t,{scale:1.85,angle:-.6,mood:'grin'});enemy({type:'eraser',x:859,y:474,wind:.5,id:5},t);bubble('ahora sí.',591,320,27,-1)}
   else{player(657+p*45,486,t,{scale:1.85,angle:0,mood:'grin',attack:Math.max(0,1-strike/.45)});c.save();c.translate(692,456);c.rotate(-.4);c.strokeStyle=gold;c.lineWidth=23;c.beginPath();c.arc(0,0,183,-1.1+p*.8,1.15+p*.8);c.stroke();c.strokeStyle=paper;c.lineWidth=6;c.stroke();c.restore();
    if(strike<.25)enemy({type:'eraser',x:859+p*20,y:474,flash:.1,id:5},t);else for(let i=0;i<25;i++){const a=i*2.4,v=30+noise(i)*140;const xx=872+Math.cos(a)*v*Math.min(strike*2,2),yy=452+Math.sin(a)*v*Math.min(strike*2,2)+strike*20;rect(xx,yy,4+i%4,3+i%5,i%3===0?paper:red,ink,.7)}
    burstShape(873,372,111,gold,13);text('¡ZAS!',877,399,77,ink,-.1,'center','Bangers');
   }
  }
  c.restore();
  if(t>=10.3&&t<13.4){c.save();const a=Math.min(ease((t-10.3)/.4),clamp((13.4-t)/.4));c.globalAlpha=a;c.translate(630,158);c.rotate(-.035);rect(-288,-36,576,82,ink,ink,2);text('EL LEGENDARIO Nº 2',0,7,49,paper,0,'center','Bangers');text('grafito corriente. intenciones extraordinarias.',0,35,20,gold);c.restore()}
 }
 function chapterBanner(title,chapter,wave,progress){c.save();c.globalAlpha=Math.min(1,progress*3,(2.5-progress)*2);c.translate(651,347);c.rotate(-.025);line([[-397,-46],[389,-40],[412,37],[-418,42]],ink,2,true,ink);text(title,0,11,title.length>24?40:51,paper,0,'center','Bangers');text(`CAPÍTULO ${chapter}  /  OLEADA ${wave}`,0,70,21,ink,.018);line([[-135,77],[150,75]],gold,5);c.restore()}
 function portrait(ctx,mood='idle',t=0){const old=c;use(ctx);ctx.clearRect(0,0,150,150);ctx.save();ctx.translate(75,108);player(0,0,t,{scale:1.45,weapon:false,mood});ctx.restore();use(old)}
 function upgradeIcon(ctx,type){const old=c;use(ctx);ctx.clearRect(0,0,160,100);ctx.save();ctx.translate(80,50);if(type===0){burstShape(0,0,47,gold,12);pencil(0,0,.62,.8)}else if(type===1){rect(-35,-27,63,61,paper,ink,2);for(let y=-14;y<28;y+=10)line([[-28,y],[19,y]],'#7397ae60',1);text('♥',0,17,51,red)}else{rect(-23,-16,47,44,blue,ink,2.5);rect(-15,-27,31,12,ink,ink,1);star(1,6,13,paper,.1);star(39,-23,10,gold,.1)}ctx.restore();use(old)}
 return{use,line,ellipse,rect,text,star,burstShape,hatch,pencil,player,enemy,desk,sheet,cover,opening,grain,bubble,chapterBanner,portrait,upgradeIcon,ink,paper,blue,red,gold};
})();
