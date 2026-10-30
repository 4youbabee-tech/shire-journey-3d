import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateGLB} from '../scripts/character-integrity.mjs';
const manifest=JSON.parse(readFileSync(new URL('../scripts/character-data/manifest.json',import.meta.url)));
for(const [name,expected] of Object.entries(manifest))test(name+' has complete binary data, skinning and locomotion clips; truncation fails',()=>{
 const data=readFileSync(new URL('../dist/assets/characters/'+name,import.meta.url));
 validateGLB(data,expected);
 assert.throws(()=>validateGLB(data.subarray(0,786444),expected),/length/);
 const corrupted=Buffer.from(data);corrupted[corrupted.length-1]^=1;
 assert.throws(()=>validateGLB(corrupted,expected),/checksum/);
 const badHeader=Buffer.from(data);badHeader.writeUInt32LE(786444,8);
 assert.throws(()=>validateGLB(badHeader,{...expected,sha256:createHash('sha256').update(badHeader).digest('hex')}),/header/);
});

test('broken animation sampler reference is rejected before the Babylon loader',()=>{
 const name='traveller.glb',data=readFileSync(new URL('../dist/assets/characters/'+name,import.meta.url));
 const n=data.readUInt32LE(12),json=JSON.parse(data.subarray(20,20+n));json.animations[0].channels[0].sampler=99999;
 const raw=Buffer.from(JSON.stringify(json)),padded=Buffer.alloc(Math.ceil(raw.length/4)*4,32);raw.copy(padded);
 const binaryChunks=data.subarray(20+n),header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(20+padded.length+binaryChunks.length,8);header.writeUInt32LE(padded.length,12);header.writeUInt32LE(0x4e4f534a,16);
 const broken=Buffer.concat([header,padded,binaryChunks]);
 assert.throws(()=>validateGLB(broken,{bytes:broken.length,sha256:createHash('sha256').update(broken).digest('hex')}),/animation sampler/);
});
