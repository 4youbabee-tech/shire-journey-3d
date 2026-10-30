import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ROLE_SCULPTS,sculptTraveller} from '../dist/character-art.mjs';
// Exercise the actual reviewed mesh, including its interleaved vertex buffers.
const file=readFileSync(new URL('../dist/assets/characters/traveller.glb',import.meta.url)),length=file.readUInt32LE(12),json=JSON.parse(file.subarray(20,20+length)),binary=file.subarray(28+length);
const node=json.nodes.find(n=>n.name==='Rogue_Head'),primitive=json.meshes[node.mesh].primitives[0];
function attribute(name,size){const a=json.accessors[primitive.attributes[name]],v=json.bufferViews[a.bufferView],out=new Float32Array(a.count*size);for(let i=0;i<a.count;i++)for(let k=0;k<size;k++)out[i*size+k]=binary.readFloatLE((v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||size*4)+k*4);return out;}
test('four authored traveller silhouettes retain vertex order, finite bounds and distinct proportions',()=>{
 const p=attribute('POSITION',3),uv=attribute('TEXCOORD_0',2),before=Float32Array.from(p),shapes=[];
 for(const role of Object.keys(ROLE_SCULPTS)){
  const s=sculptTraveller(p,uv,role);assert.equal(s.length,p.length);assert.ok(s.every(Number.isFinite));assert.ok(s.every((v,i)=>Math.abs(v-p[i])<.4));shapes.push(s);
 }
 assert.deepEqual(p,before,'Shared source geometry must remain intact');
 for(let i=0;i<shapes.length;i++)for(let j=i+1;j<shapes.length;j++)assert.notDeepEqual(shapes[i],shapes[j]);
 const eyes=[];for(let i=0;i<uv.length/2;i++)if(Math.floor(uv[i*2]*8)===2&&Math.floor(uv[i*2+1]*4)===0)eyes.push(i);
 assert.ok(eyes.length>0);for(const s of shapes)assert.ok(Math.max(...eyes.map(i=>s[i*3+1]))-Math.min(...eyes.map(i=>s[i*3+1]))>.05,'Sculpt preserves an open eye surface for blink deformation');
});
