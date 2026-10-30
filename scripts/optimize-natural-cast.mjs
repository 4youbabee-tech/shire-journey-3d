// Offline production helper: @gltf-transform/core/functions 4.2.1 + Pillow.
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {prune,dedup,resample} from '@gltf-transform/functions';
import {mkdtemp,writeFile,readFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join,resolve} from 'node:path';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const input=resolve(process.argv[2]),output=resolve(process.argv[3]);await mkdir(output,{recursive:true});const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);const receipts={};
for(const role of ['frodo','sam','bilbo','gandalf']){
 const source=join(input,role+'-natural.glb'),doc=await io.read(source);await doc.transform(resample(),dedup(),prune());
 const alpha=new Set(doc.getRoot().listMaterials().filter(m=>m.getAlphaMode()!=='OPAQUE').map(m=>m.getBaseColorTexture()).filter(Boolean));
 const temp=await mkdtemp(join(tmpdir(),'shire-cast-textures-'));
 try{for(const [i,texture]of doc.getRoot().listTextures().entries()){
  const keepAlpha=alpha.has(texture),size=/Superhero.*Ligh/i.test(texture.getName())?1024:512;
  const from=join(temp,i+'.source'),to=join(temp,i+(keepAlpha?'.png':'.jpg'));await writeFile(from,texture.getImage());execFileSync('python',['scripts/compress-cast-texture.py',from,to,String(size),keepAlpha?'1':'0']);texture.setImage(new Uint8Array(await readFile(to))).setMimeType(keepAlpha?'image/png':'image/jpeg');
 }}finally{await rm(temp,{recursive:true,force:true});}
 await doc.transform(dedup(),prune());const target=join(output,role+'-natural.glb');await io.write(target,doc);const data=await readFile(target);
 receipts[role]={bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),sourceSha256:createHash('sha256').update(await readFile(source)).digest('hex'),textures:doc.getRoot().listTextures().length};console.log(role,JSON.stringify(receipts[role]));
}
await writeFile(join(output,'natural-cast-receipt.json'),JSON.stringify(receipts,null,2)+'\n');
