const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');for(const file of ['art.js','game.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
fs.rmSync(path.join(root,'dist'),{recursive:true,force:true});fs.mkdirSync(path.join(root,'dist'));
for(const file of ['index.html','style.css','art.js','game.js','assets','.nojekyll'])fs.cpSync(path.join(root,file),path.join(root,'dist',file),{recursive:true});
console.log('TRAZO: JavaScript validated; static game packaged in dist/.');
