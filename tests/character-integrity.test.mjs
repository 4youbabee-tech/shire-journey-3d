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
