import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {validateGLB} from '../scripts/character-integrity.mjs';
const manifest=JSON.parse(readFileSync(new URL('../scripts/environment-data/manifest.json',import.meta.url)));
test('reviewed nature ships self-contained alpha-tested textures within the mobile texture budget',()=>{
 let bytes=0;
 for(const [name,expected]of Object.entries(manifest)){
  const data=readFileSync(new URL('../dist/assets/environment/'+name,import.meta.url)),j=validateGLB(data,expected);bytes+=data.length;
  assert.ok(j.images.every(i=>!i.uri&&Number.isInteger(i.bufferView)));
  assert.ok(j.materials.every(m=>m.alphaMode!=='BLEND'&&!m.normalTexture));
  assert.throws(()=>validateGLB(data.subarray(0,data.length-4),expected),/length/);
 }
 assert.ok(bytes<800000);
});
