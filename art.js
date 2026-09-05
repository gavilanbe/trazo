/* Original, animated Canvas drawings. No image assets or external runtime. */
const Art = (() => {
  let c; const ink='#293b44',paper='#f4efd9',blue='#387f9b',red='#cf625b',gold='#edc54c';
  const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
  function use(ctx){c=ctx;c.lineCap='round';c.lineJoin='round'}
  function line(points,color=ink,width=2,close=false,fill=null){
    c.lineWidth=width;c.strokeStyle=color;
    c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(close)c.closePath();if(fill){c.fillStyle=fill;c.fill()}c.stroke();
    c.save();c.globalAlpha*=.24;c.lineWidth=width*.5;c.beginPath();points.forEach(([x,y],i)=>{const jx=(noise(x+y)-.5)*3,jy=(noise(x-y)-.5)*3;i?c.lineTo(x+jx,y+jy):c.moveTo(x+jx,y+jy)});if(close)c.closePath();c.stroke();c.restore();
  }
  function ellipse(x,y,rx,ry,color=ink,width=2,fill=null){c.beginPath();c.ellipse(x,y,rx,ry,-.05,0,Math.PI*2);c.lineWidth=width;c.strokeStyle=color;if(fill){c.fillStyle=fill;c.fill()}c.stroke();c.globalAlpha*=.5;c.beginPath();c.ellipse(x+1,y-.5,rx+1,ry-.6,.04,.15,6.1);c.lineWidth=.8;c.stroke();c.globalAlpha/= .5}
  function rect(x,y,w,h,fill,stroke=ink,width=2){line([[x,y],[x+w,y-1],[x+w+1,y+h],[x-1,y+h]],stroke,width,true,fill)}
  function text(t,x,y,size=24,color=ink,angle=0,align='center'){c.save();c.translate(x,y);c.rotate(angle);c.font=`700 ${size}px Trazo, "Chalkboard SE", cursive`;c.fillStyle=color;c.textAlign=align;c.fillText(t,0,0);c.restore()}
  function star(x,y,r=15,color=gold,rot=0){c.save();c.translate(x,y);c.rotate(rot);line([[0,-r],[r*.25,-r*.25],[r,0],[r*.25,r*.25],[0,r],[-r*.25,r*.25],[-r,0],[-r*.25,-r*.25]],color,1.5,true,color);c.restore()}
  function pencil(x,y,angle=0,scale=1){c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);line([[-5,-37],[5,-37],[6,28],[0,45],[-6,28]],ink,2,true,gold);line([[-5,-26],[5,-26]],ink,1.5);line([[0,-24],[1,27]],'#b38c2d',1);line([[-6,28],[6,28],[0,45]],ink,1,true,'#d6b288');line([[-2,39],[2,39],[0,45]],ink,1,true,ink);rect(-5,-37,10,10,red);c.restore()}
  function player(x,y,t=0,{angle=0,walk=0,attack=0,dash=0,scale=1,alpha=1,hurt=0}={}){
    c.save();c.translate(x,y);c.scale(scale,scale);c.globalAlpha*=alpha;const bob=Math.sin(t*14)*walk*3;
    c.fillStyle='#24333b12';c.beginPath();c.ellipse(0,18,20,6,0,0,7);c.fill();
    c.translate(0,bob);c.rotate(dash?Math.sin(angle)*.25:Math.sin(t*11)*walk*.07);
    const col=hurt?red:ink;let step=Math.sin(t*15)*walk*13;
    line([[0,-19],[-2,0],[-10+step,15],[-17+step,17]],col,3.6);
    line([[-2,0],[12-step,13],[20-step,14]],col,3.6);
    line([[-1,-17],[-16,-8],[-22,-19]],col,3.1);
    const armAngle=attack?angle+(1-attack)*2.8-1.4:angle;
    const ax=Math.cos(armAngle)*23,ay=Math.sin(armAngle)*18;
    line([[0,-19],[ax*.55,-20+ay*.7],[ax,-21+ay]],col,3.2);
    pencil(ax+Math.cos(armAngle)*21,-21+ay+Math.sin(armAngle)*21,armAngle-Math.PI/2,.92);
    ellipse(0,-35,14.5,14,col,2.8,paper);
    const face=Math.cos(angle)*3;line([[face-6,-36],[face-5,-32]],col,2.6);line([[face+4,-36],[face+5,-32]],col,2.6);line([[face-3,-27],[face+4,-28]],col,1.6);
    // A scarf is the one patch of colour that follows the little doodle.
    line([[-12,-22],[6,-19],[4,-14],[-11,-17]],ink,1,true,gold);
    line([[-10,-19],[-27-Math.sin(t*10)*4,-20],[-18,-13],[-30,-9],[-8,-15]],ink,1,true,gold);
    line([[-8,-49],[-4,-54],[0,-49],[5,-53]],col,1.6);c.restore();
  }
  function enemy(e,t=0){
    c.save();c.translate(e.x,e.y);c.rotate(e.angle||0);const scale=e.type==='boss'?1.65:1;c.scale(scale,scale);if(e.flash>0)c.globalAlpha=.5+Math.sin(e.flash*100)*.3;
    c.fillStyle='#293b4411';c.beginPath();c.ellipse(0,22,24,6,0,0,7);c.fill();
    const bounce=Math.sin(t*9+(e.id||0))*2;c.translate(0,bounce);const wind=e.wind>0;
    if(e.type==='eraser'){
      c.rotate(Math.sin(t*8)*.06);line([[-21,-15],[12,-19],[24,-9],[22,15],[-11,19],[-23,10]],ink,2.6,true,'#e39a96');
      line([[-21,-15],[-11,-6],[24,-9]],ink,1.7);line([[-11,-6],[-11,19]],ink,1.7);line([[2,-17],[2,-7],[3,17]],ink,1.5);
      line([[3,-17],[12,-19],[24,-9],[22,15],[3,17],[2,-7]],ink,1.5,true,'#b7ced5');
      line([[-14,17],[-21,28],[-28,28]],ink,2);line([[13,17],[20,26],[27,24]],ink,2);eyes(-9,1,wind);
    }else if(e.type==='clip'){
      c.rotate(Math.sin(t*9)*.15);c.strokeStyle=blue;c.lineWidth=5;c.beginPath();c.moveTo(11,9);c.lineTo(11,-14);c.bezierCurveTo(11,-32,-15,-32,-15,-13);c.lineTo(-15,13);c.bezierCurveTo(-15,30,7,30,7,12);c.lineTo(7,-10);c.bezierCurveTo(7,-20,-7,-20,-7,-10);c.lineTo(-7,8);c.stroke();
      c.strokeStyle=ink;c.lineWidth=1.2;c.stroke();eyes(-3,-4,wind);line([[-9,23],[-18,29]],ink,2);line([[6,23],[17,27]],ink,2);
    }else if(e.type==='pencil'){
      pencil(0,-4,.35,1);eyes(-3,-8,wind);line([[-6,14],[-18,27],[-24,23]],ink,2);line([[5,19],[14,27],[20,22]],ink,2);line([[6,-8],[25,-2],[20,5]],ink,2);
    }else if(e.type==='boss'){
      const open=e.wind>0?.7:.28+Math.sin(t*4)*.12;
      for(const sign of [-1,1]){c.save();c.rotate(open*sign);line([[0,0],[-7,-60],[0,-84],[8,-57]],ink,2,true,'#b4c4c9');ellipse(0,28,12,20,ink,2.5,red);ellipse(0,28,6,12,ink,1,paper);c.restore()}
      ellipse(0,0,7,7,ink,2,gold);eyes(0,-20,wind);line([[-24,31],[-36,45],[-48,42]],ink,2);line([[24,31],[38,44],[48,41]],ink,2);
    }
    c.restore();
  }
  function eyes(x,y,mad){line([[x-7,y-2],[x-3,y]],ink,2);line([[x+3,y],[x+7,y-2]],ink,2);if(mad)text('!',x,y-16,25,red);else{line([[x-5,y+3],[x-5,y+5]],ink,2);line([[x+5,y+3],[x+5,y+5]],ink,2)}}
  function desk(){
    c.fillStyle='#152c32';c.fillRect(0,0,1280,800);
    for(let i=0;i<45;i++){const y=i*19;c.strokeStyle=i%3?'#24404830':'#091e2438';c.lineWidth=1;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(420,y+noise(i)*20,830,y-20,1280,y+12);c.stroke()}
    const gr=c.createRadialGradient(640,350,100,640,400,830);gr.addColorStop(0,'#40665b24');gr.addColorStop(1,'#07131977');c.fillStyle=gr;c.fillRect(0,0,1280,800);
  }
  function grain(x,y,w,h,count=600){c.fillStyle='#4b4c2920';for(let i=0;i<count;i++){c.globalAlpha=.12+noise(i+8)*.24;c.fillRect(x+noise(i)*w,y+noise(i+3000)*h,.7+noise(i+5),.7+noise(i+7))}c.globalAlpha=1}
  function sheet(){
    desk();c.save();c.shadowColor='#061015a8';c.shadowBlur=30;c.shadowOffsetY=14;rect(58,55,1166,685,'#d2cebc','#aaac94',1);c.shadowBlur=0;c.shadowOffsetY=0;
    rect(56,51,1166,685,'#e4ddc7','#a8aa97',1);rect(54,46,1166,685,paper,'#d4ceb8',1);
    c.strokeStyle='#618da125';c.lineWidth=1;for(let y=90;y<723;y+=29){c.beginPath();c.moveTo(56,y);c.lineTo(1218,y+1);c.stroke()}
    line([[156,47],[154,730]],'#c55c6150',1.5);line([[160,47],[158,730]],'#c55c6120',1);
    const grad=c.createLinearGradient(55,0,116,0);grad.addColorStop(0,'#403e4324');grad.addColorStop(1,'#403e4300');c.fillStyle=grad;c.fillRect(55,47,68,685);
    for(let y=83;y<720;y+=43){ellipse(81,y,7,5,'#aaa68f',1,'#726e6050');c.strokeStyle='#b1b5a7';c.lineWidth=7;c.beginPath();c.ellipse(57,y-2,30,9,-.12,Math.PI*.15,Math.PI*1.93);c.stroke();c.lineWidth=2;c.strokeStyle='#e4e7d7';c.stroke()}
    grain(60,50,1150,677,700);
    c.save();c.translate(1161,700);c.rotate(-.1);line([[0,0],[39,-8],[20,23]],'#b6af96',1,true,'#e3ddc5');c.restore();
    text('no borrar.',90,503,19,'#909583',-Math.PI/2);text('✦',104,672,22,'#a29b76',.3);c.restore();
  }
  function cover(t=0){
    desk();c.save();c.translate(649,393);c.rotate(-.052);
    c.shadowColor='#04151caa';c.shadowBlur=45;c.shadowOffsetY=23;rect(-529,-274,1064,570,'#b1b2a0','#091f28',2);c.shadowBlur=0;c.shadowOffsetY=0;
    for(let i=0;i<5;i++)line([[-520,285-i*2],[530,285-i*2]],'#ebe7d2',1);
    rect(-537,-290,1070,568,'#294a48','#42655b',2);rect(-538,-290,31,568,'#193532','#17302e',1);
    line([[-491,-266],[502,-266],[502,254],[-491,254],[-491,-266]],'#9ba78344',1);grain(-495,-255,987,500,750);
    c.save();c.globalAlpha=.2;for(let i=0;i<24;i++)line([[-530+i*1.2,-286],[-530+i*1.2,276]],'#93a792',.6);c.restore();
    // Doodles scratched into the cover, all drawn by the same renderer as the game.
    c.save();c.translate(241,47);c.rotate(.12);
    c.fillStyle='#e5dec4';c.shadowColor='#102c2b66';c.shadowBlur=10;c.shadowOffsetY=5;c.fillRect(-140,-123,280,268);c.shadowBlur=0;c.shadowOffsetY=0;
    for(let y=-100;y<135;y+=25)line([[-136,y],[136,y]],'#6e969533',1);
    rect(-50,-143,104,30,'#c6c099bb','#c6c09944',0.3);
    player(0,60,t,{angle:-.6,scale:2.5,walk:.07});star(91,-70,15,gold,.2);star(-88,71,11,blue,.4);text('no me borres',0,123,21,'#6c7269',-.04);
    c.restore();
    text('¡Está vivo!',190,-139,27,'#c8d0b0',.09);line([[313,-154],[343,-135],[344,-104]],'#c8d0b0',2);line([[334,-112],[344,-104],[351,-119]],'#c8d0b0',2);
    text('01',455,230,28,'#b3bca2',.06);c.restore();
    pencil(1168,425,-.22,2.55);c.save();c.translate(107,622);c.rotate(-.35);enemy({type:'clip',x:0,y:0,id:1},0);c.restore();
    star(81,181,9,'#d0cfa2',.3);star(1186,146,6,'#d0cfa2',-.1);
  }
  function opening(t){
    sheet();const p=Math.min(1,t/2.3);if(p<1){c.save();c.translate(80,46);c.scale(Math.cos(p*Math.PI/2),1);rect(0,0,1140,686,'#294a48','#527264',2);text('TRAZO.',580,390,190,paper,-.04);text('una pequeña rebelión de tinta',580,440,32,'#d0cfab');c.restore();}
    if(t>2.1){const f=Math.min(1,(t-2.1)/1.2);c.save();c.globalAlpha=f;player(600,435,t,{scale:2,angle:-.2,walk:t>4?.1:0});c.restore();
      if(t<4.5){pencil(620+(1-f)*70,300-f*35,-.5,2*(1-f)+1);text('¿hola?',676,323,38,blue,.08)}
      if(t>4.8){const e=Math.min(1,(t-4.8)/1.2);enemy({type:'eraser',x:1020-e*190,y:421,wind:1},t);enemy({type:'clip',x:315+e*75,y:414},t);text('BORRAR.',817,325,37,red,-.07)}
      if(t>7.4){star(684,387,40,gold,t);text('NI DE BROMA.',650,248,64,ink,-.07);line([[478,264],[792,246]],red,4)}
    }
  }
  return {use,line,ellipse,rect,text,star,pencil,player,enemy,desk,sheet,cover,opening,grain,ink,paper,blue,red,gold};
})();
