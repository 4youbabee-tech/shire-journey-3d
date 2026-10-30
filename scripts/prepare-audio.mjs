import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const source=new URL('./audio-data/',import.meta.url),target=new URL('../dist/assets/audio/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',source)));
mkdirSync(target,{recursive:true});
for(const [name,entry]of Object.entries(manifest)){
 const data=gunzipSync(Buffer.from(entry.parts.map(p=>readFileSync(new URL(p,source),'utf8').trim()).join(''),'base64'));
 if(data.length!==entry.bytes||createHash('sha256').update(data).digest('hex')!==entry.sha256)throw Error('Reviewed audio checksum mismatch: '+name);
 if(data.subarray(0,3).toString()!=='ID3'&&!(data[0]===255&&(data[1]&224)===224))throw Error('Invalid MP3 header');
 writeFileSync(new URL(name,target),data);console.log('Verified packaged audio: '+name+' '+data.length+' bytes');
}
