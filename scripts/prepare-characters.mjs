// Lossless repository payload chunks avoid the connector's per-request binary size limit.
// No runtime or build-time third-party download: reconstruct, then fail closed on integrity.
import {readFileSync,writeFileSync,mkdirSync,renameSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {validateGLB} from './character-integrity.mjs';
const source=new URL('./character-data/',import.meta.url),target=new URL('../dist/assets/characters/',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('manifest.json',source),'utf8'));
mkdirSync(target,{recursive:true});
for(const [name,expected] of Object.entries(manifest)){
 const encoded=expected.parts.map(part=>readFileSync(new URL(part,source),'utf8').trim()).join('');
 const data=gunzipSync(Buffer.from(encoded,'base64'));
 validateGLB(data,expected);
 const temporary=new URL(name+'.tmp',target),file=new URL(name,target);
 writeFileSync(temporary,data);renameSync(temporary,file);
 console.log('Verified '+name+': '+data.length+' bytes, SHA256 '+expected.sha256);
}
