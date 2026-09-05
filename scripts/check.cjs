const {JSDOM,VirtualConsole}=require('jsdom'),{createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),css=require('css-tree');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),source=fs.readFileSync(path.join(root,'game.js'),'utf8'),art=fs.readFileSync(path.join(root,'art.js'),'utf8');
GlobalFonts.registerFromPath(path.join(root,'assets/caveat.ttf'),'Trazo');GlobalFonts.registerFromPath(path.join(root,'assets/caveat-bold.ttf'),'Trazo');GlobalFonts.registerFromPath(path.join(root,'assets/bangers.ttf'),'Bangers');
const cssErrors=[];css.parse(fs.readFileSync(path.join(root,'style.css'),'utf8'),{onParseError:e=>cssErrors.push(e.message)});assert.deepEqual(cssErrors,[]);
function fixture({reduced=false,storageBlocked=false,dpr=1}={}){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('Could not parse CSS'))errors.push(e.message)});
 const dom=new JSDOM(html,{url:'https://gavilanbe.github.io/trazo/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});const w=dom.window,d=w.document;
 Object.defineProperty(w,'devicePixelRatio',{value:dpr});w.matchMedia=()=>({matches:reduced});w.requestAnimationFrame=()=>1;w.queueMicrotask=fn=>fn();w.HTMLCanvasElement.prototype.setPointerCapture=function(){};
 const native=new WeakMap();w.HTMLCanvasElement.prototype.getContext=function(){if(!native.has(this)){const n=createCanvas(this.width,this.height),c=n.getContext('2d'),draw=c.drawImage.bind(c);c.drawImage=(img,...args)=>draw(native.get(img)?.canvas||img,...args);native.set(this,{canvas:n,context:c})}return native.get(this).context};
 if(storageBlocked)Object.defineProperty(w,'localStorage',{get(){throw new Error('Storage disabled')}});
 const hooks=`window.__test={beginRun,beginIntro,update,render,attack,dash,special,hurt,hit,makeEnemy,nextWave,enemyUpdate,pause,advancePage,endRun,setState,movement,releaseControls,read:()=>({state,player,enemies,spawns,shots,spawnQueue,page,wave,combo,bestCombo,score,kills,won,introTime,runTime,freeze}),set:(values)=>{if(values.enemies)enemies=values.enemies;if(values.shots)shots=values.shots;if(values.page!==undefined)page=values.page;}};`;
 w.eval(art+'\n'+source.replace(/\}\)\(\);\s*$/,hooks+'})();'));
 return {w,d,t:w.__test,errors,native,close:()=>dom.window.close(),step(seconds){for(let i=0;i<Math.ceil(seconds*60);i++)w.__test.update(1/60)},key(code,type='keydown'){w.dispatchEvent(new w.KeyboardEvent(type,{code,bubbles:true,cancelable:true}))}};
}
{
 const f=fixture(),{t,d}=f;t.render();const pixel=f.native.get(d.getElementById('game')).context.getImageData(180,180,1,1).data;assert.ok(pixel[3]>0,'cover renders native pixels');d.getElementById('start').click();assert.equal(t.read().state,'intro');f.step(3);t.render();f.key('KeyJ');assert.equal(t.read().state,'intro','cannot cut before discovering the weapon');f.step(4);t.render();f.step(3.8);t.render();f.step(3.3);t.render();assert.equal(d.getElementById('intro-action').hidden,false,'weapon discovery waits for the player');f.step(3);assert.equal(t.read().state,'intro','weapon reveal does not skip the player action');f.key('KeyJ');f.key('KeyJ','keyup');t.render();f.step(.3);t.render();f.step(1.6);assert.equal(t.read().state,'play','the first cut reaches the actual campaign');t.render();assert.equal(d.getElementById('hud').hidden,false);
 const p=t.read().player,initial=p.x;f.key('KeyD');f.step(.25);f.key('KeyD','keyup');assert.ok(p.x>initial+50,'keyboard movement');f.key('KeyJ');f.key('KeyJ','keyup');assert.ok(p.attackCd>0);f.step(.4);
 const enemy=t.makeEnemy({type:'eraser',x:p.x+57,y:p.y});t.set({enemies:[enemy]});const hp=enemy.hp;f.key('KeyJ');f.key('KeyJ','keyup');assert.ok(enemy.hp<hp,'J hits an enemy in melee range');assert.ok(t.read().combo>0);assert.ok(p.ink>0);t.render();
 const health=p.hp;t.hurt(1,enemy);assert.equal(p.hp,health-1);t.hurt(1,enemy);assert.equal(p.hp,health-1,'damage immunity prevents stacked contact hits');f.step(1.3);t.set({enemies:[]});f.key('Space');assert.ok(p.dash>0&&p.invuln>0);const before=p.hp;t.hurt(2,enemy);assert.equal(p.hp,before,'dash grants invulnerability');
 p.ink=100;t.set({enemies:[t.makeEnemy({type:'clip',x:p.x+100,y:p.y})],shots:[{x:p.x+50,y:p.y,t:3}]});f.key('KeyE');assert.equal(p.ink<100,true);assert.equal(t.read().shots.length,0,'special clears nearby projectiles');assert.ok(t.read().enemies[0].dead,'special damages enemies');t.render();
 f.key('Escape');assert.equal(t.read().state,'pause');const pausedX=p.x;f.key('KeyD');f.step(1);assert.equal(p.x,pausedX);f.key('Escape');assert.equal(t.read().state,'play');assert.equal(d.getElementById('dialog').hidden,true);
 f.w.dispatchEvent(new f.w.Event('blur'));assert.equal(t.read().state,'pause','focus loss pauses');d.getElementById('continue').click();assert.equal(t.read().state,'play');assert.deepEqual(f.errors,[]);f.close();
}
{
 const f=fixture();f.t.beginIntro();f.step(1);f.key('Escape');assert.equal(f.t.read().state,'pause');f.key('Escape');assert.equal(f.t.read().state,'intro');assert.equal(f.d.getElementById('dialog').hidden,true,'intro pause resumes without an overlay');f.d.getElementById('skip').click();assert.equal(f.t.read().state,'play');f.close();
}
{
 const f=fixture();f.t.beginIntro();f.step(14);f.key('Escape');assert.equal(f.t.read().state,'pause');f.key('Escape');f.step(.1);assert.equal(f.d.getElementById('intro-action').hidden,false,'discovery action survives pause');f.d.getElementById('intro-action').click();f.step(2);assert.equal(f.t.read().state,'play','touch/click first-cut action completes the discovery');f.close();
}
{
 const f=fixture({reduced:true,storageBlocked:true});f.d.getElementById('start').click();assert.equal(f.t.read().state,'play','reduced motion starts immediately');f.t.render();f.t.endRun(false);assert.equal(f.t.read().state,'dead');f.d.getElementById('continue').click();assert.equal(f.t.read().state,'play','retry works with unavailable storage');assert.equal(f.t.read().page,0);assert.equal(f.t.read().score,0);f.close();
}
{
 const f=fixture(),{t}=f;t.beginRun();const p=t.read().player;t.set({enemies:[]});p.x=620;p.y=430;
 const pencil=t.makeEnemy({type:'pencil',x:900,y:430});pencil.cool=0;t.set({enemies:[pencil]});t.enemyUpdate(pencil,.016);assert.ok(pencil.wind>0,'ranged attack telegraph');for(let i=0;i<55;i++)t.enemyUpdate(pencil,1/60);assert.ok(t.read().shots.length>0,'pencil fires after telegraph');
 const boss=t.makeEnemy({type:'boss',x:920,y:430});boss.cool=0;t.set({enemies:[boss]});t.enemyUpdate(boss,.016);assert.ok(boss.wind>0);const wind=boss.wind;t.hit(boss,1,200);assert.equal(boss.wind,wind,'boss cannot be permanently interrupted by melee');for(let i=0;i<65;i++)t.enemyUpdate(boss,1/60);assert.ok(boss.charge>0,'boss follows its telegraph with a charge');t.render();f.close();
}
{
 const f=fixture(),{t,d}=f;t.beginRun();let upgrades=0,guard=0;
 while(!['win','dead'].includes(t.read().state)&&guard++<30000){const r=t.read();r.player.invuln=1;for(const e of r.enemies)if(!e.dead)t.hit(e,10000,0);if(r.state==='upgrade'){assert.equal(d.querySelectorAll('.choice').length,3);d.querySelector('.choice').click();upgrades++}t.update(1/60);if(guard%600===0)t.render()}
 assert.equal(t.read().state,'win','all nine waves lead to victory');assert.equal(upgrades,2);assert.equal(t.read().page,2);assert.equal(t.read().wave,3);assert.ok(t.read().kills>=60);assert.ok(t.read().score>0);assert.ok(Number(f.w.localStorage.getItem('trazo-best'))>0);t.render();d.getElementById('continue').click();assert.equal(t.read().state,'play');assert.equal(t.read().player.damage,1,'upgrades reset on replay');assert.deepEqual(f.errors,[]);f.close();
}
{
 const f=fixture(),{d,t}=f;t.beginRun();const stick=d.getElementById('stick');stick.setPointerCapture=()=>{};stick.getBoundingClientRect=()=>({left:0,top:0,width:110,height:110});
 function pointer(el,type,id,x,y){const e=new f.w.Event(type,{bubbles:true,cancelable:true});Object.assign(e,{pointerId:id,clientX:x,clientY:y});el.dispatchEvent(e)}
 pointer(stick,'pointerdown',1,95,55);assert.ok(t.movement().x>.9);pointer(stick,'pointercancel',1,95,55);assert.equal(t.movement().x,0,'touch cancellation releases joystick');const attack=d.getElementById('touch-attack');attack.setPointerCapture=()=>{};pointer(attack,'pointerdown',2,0,0);assert.ok(t.read().player.attackCd>0);pointer(attack,'pointercancel',2,0,0);f.step(1);assert.equal(t.read().player.attackCd,0,'cancelled touch does not keep attacking');f.close();
}
{const f=fixture({dpr:2});f.t.render();const canvas=f.d.getElementById('game');assert.equal(canvas.width,2560);assert.equal(canvas.height,1600);const p=f.native.get(canvas).context.getImageData(2400,1400,1,1).data;assert.ok(p[3]>0,'retina rendering covers the full backing canvas');f.t.beginRun();f.t.render();assert.deepEqual(f.errors,[]);f.close();}
for(const asset of ['assets/caveat.ttf','assets/caveat-bold.ttf','assets/bangers.ttf','assets/Bangers-OFL.txt','assets/OFL.txt','art.js','game.js','style.css'])assert.ok(fs.existsSync(path.join(root,asset)),asset);
console.log('PASS: native and Retina Canvas rendering, interactive weapon discovery, early-input protection, pause and touch first cut, intro skip, movement and combat, combos, invulnerability, dash, special, pause/resume/focus loss, reduced motion, disabled storage, telegraphed enemies and boss, all 9 waves and both upgrades, victory, local record, replay reset, touch controls and cancellation, CSS and local assets.');
