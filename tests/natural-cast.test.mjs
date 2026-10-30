import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import '../dist/vendor/babylon.js';
const B=globalThis.BABYLON;
for(const role of ['frodo','sam','bilbo','gandalf'])test(role+' ships its own skin, face controls, continuous boarding and embedded textures',()=>{
 const b=readFileSync(new URL('../dist/assets/characters/'+role+'-natural.glb',import.meta.url)),j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)));
 assert.ok(b.length<2100000);assert.equal(j.skins.length,1);assert.equal(j.skins[0].joints.length,65);assert.ok(j.meshes.length<=5);assert.ok(j.images.every(i=>Number.isInteger(i.bufferView)));
 const names=j.meshes.flatMap(m=>m.extras?.targetNames||[]);for(const name of ['Blink','Smile','Attention','LookLeft','LookRight','LookDown','LookUp'])assert.ok(names.includes(name),name);
 for(const name of ['Idle','Walking_A','Running_A','Interact','Sit_Floor_Idle','Sit_Floor_StandUp','Sit_Chair_Idle','Sit_Chair_Talk','Board'])assert.ok(j.animations.some(a=>a.name===name),name);
 assert.ok(j.nodes.some(n=>n.name==='Head'));assert.ok(j.nodes.some(n=>n.name==='pelvis'));
});
test('face shader influence capacity remains constant across a full blink',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);try{const m=new B.MorphTargetManager(scene);m.useTextureToStoreTargets=true;m.optimizeInfluencers=false;
 for(const name of ['Blink','Smile','LookLeft']){const t=new B.MorphTarget(name,0,scene);t.setPositions(new Float32Array([0,0,0,1,0,0,0,1,0]));m.addTarget(t);}m.numMaxInfluencers=m.numTargets;
 for(const blink of [0,.5,1,0]){m.getTarget(0).influence=blink;m.synchronize();assert.equal(m.numInfluencers,3);assert.equal(m.numMaxInfluencers,3);}
 }finally{scene.dispose();engine.dispose();}
});
