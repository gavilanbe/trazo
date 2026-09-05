const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const root=path.join(__dirname,'..');GlobalFonts.registerFromPath(path.join(root,'assets/caveat.ttf'),'Trazo');
const context=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(root,'art.js'),'utf8')+'\nglobalThis.Art=Art;',context);
const canvas=createCanvas(1280,800),ctx=canvas.getContext('2d'),A=context.Art;A.use(ctx);A.cover(0);
ctx.save();ctx.translate(173,240);ctx.rotate(-.052);ctx.fillStyle=A.paper;ctx.textAlign='left';ctx.font='bold 16px monospace';ctx.fillText('UNA PEQUEÑA REBELIÓN DE TINTA',0,-50);ctx.font='bold 181px Trazo';ctx.fillText('TRAZO.',0,91);ctx.font='33px Trazo';ctx.fillText('Solo eras un garabato.',5,153);ctx.fillText('Hasta que intentaron borrarte.',5,188);ctx.fillStyle=A.gold;ctx.fillRect(4,224,307,57);ctx.fillStyle=A.ink;ctx.font='bold 16px monospace';ctx.fillText('ABRIR LA LIBRETA  ↗',23,259);ctx.restore();
ctx.fillStyle='#ffda58';ctx.font='bold 19px monospace';A.star(971,153,8,A.gold);ctx.fillText('ASTRA',988,160);ctx.font='13px monospace';ctx.fillStyle='#dbe3d6';ctx.fillText('GAVILANBE × ASTRA',52,45);
const small=createCanvas(640,400);small.getContext('2d').drawImage(canvas,0,0,640,400);fs.writeFileSync(path.join(root,'assets/cartridge.jpg'),small.toBuffer('image/jpeg',88));
console.log('Created assets/cartridge.jpg (640 × 400) from the original game renderer.');
