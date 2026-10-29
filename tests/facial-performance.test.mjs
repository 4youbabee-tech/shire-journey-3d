import test from 'node:test';
import assert from 'node:assert/strict';
import {facialPose,EXPRESSIVE_IDS} from '../dist/facial-performance.mjs';
import {createWorld} from '../dist/world.mjs';
await import('../dist/vendor/babylon.js');
const B=globalThis.BABYLON;

test('expressions are deterministic, bounded and sensitive to speaking / celebration',()=>{
 for(const id of EXPRESSIVE_IDS){
  const quiet=facialPose(id,2),speaking=facialPose(id,2,{speaking:true});
  const party=facialPose(id,2,{celebrating:true});
  assert.deepEqual(facialPose(id,2),quiet);
  assert.ok(quiet.blink>=0&&quiet.blink<=1);
  assert.ok(speaking.mouth>quiet.mouth);
  assert.ok(party.mouth>quiet.mouth&&party.smile>quiet.smile);
  assert.ok(Array.from({length:150},(_,i)=>facialPose(id,i*.13).blink).some(v=>v>.9),'blink cycle exists');
 }
 assert.equal(facialPose('villager',2).mouth,0);
 assert.deepEqual(facialPose('bilbo',NaN),facialPose('bilbo',0));
});
test('four hero face rigs stay attached to animated necks without breaking world budgets',()=>{
 const engine=new B.NullEngine({renderWidth:1280,renderHeight:720});
 const scene=new B.Scene(engine);new B.UniversalCamera('camera',new B.Vector3(0,5,-23),scene);
 const w=createWorld(B,scene,{shadows:false});scene.render();
 assert.equal(w.stats.expressiveFaces,4);
 for(const id of EXPRESSIVE_IDS){
  const c=w.characters.find(c=>c.id===id);assert.ok(c?.faceRig,id+' rig');
  assert.equal(c.faceRig.meshes.length,5);
  assert.ok(c.faceRig.meshes.every(m=>m.parent===c.head&&!m.isPickable&&m.material));
  const original=c.faceRig.mouth.scaling.y;
  const speaking=c.faceRig.update(2,{speaking:true});
  assert.ok(speaking.mouth>0&&c.faceRig.mouth.scaling.y>original);
  const cheering=c.faceRig.update(2,{celebrating:true});
  assert.ok(cheering.smile>=.9&&c.faceRig.mouth.scaling.x>.105);
  c.head.rotation.y=.35;scene.render();
  assert.ok(c.faceRig.mouth.getWorldMatrix().m.every(Number.isFinite));
 }
 assert.equal(w.characters.find(c=>c.id==='player').faceRig,null);
 assert.ok(scene.meshes.length<240,'facial detail must remain within the fixed mesh budget');
 engine.dispose();
});
