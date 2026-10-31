import test from 'node:test';
import assert from 'node:assert/strict';
import '../dist/vendor/babylon.js';
import {createOneRing,syncOneRingOwner} from '../dist/ring-prop.mjs';
const B=globalThis.BABYLON;
test('One Ring is finger-proportioned, attached to the real finger bone, and transfers from Bilbo to Frodo',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);
 try{
  const material=new B.StandardMaterial('gold',scene);
  const bilboRoot=new B.TransformNode('bilbo',scene),frodoRoot=new B.TransformNode('frodo',scene);
  const bilboFinger=new B.TransformNode('bilbo ring_01_r',scene),bilboNext=new B.TransformNode('bilbo ring_02_r',scene);
  const frodoFinger=new B.TransformNode('frodo ring_01_r',scene),frodoNext=new B.TransformNode('frodo ring_02_r',scene);
  bilboFinger.parent=bilboRoot;bilboNext.parent=bilboFinger;bilboNext.position.set(.08,.04,0);
  frodoFinger.parent=frodoRoot;frodoNext.parent=frodoFinger;frodoNext.position.set(.08,.04,0);
  const bilboRing=createOneRing(B,scene,{actorId:'bilbo',parent:bilboFinger,nextBone:bilboNext,material});
  const frodoRing=createOneRing(B,scene,{actorId:'frodo',parent:frodoFinger,nextBone:frodoNext,material});
  for(const ring of [bilboRing,frodoRing]){
   assert.ok(ring.getTotalVertices()>0);
   assert.ok(ring.metadata.localDiameter>=.035&&ring.metadata.localDiameter<=.065,'ring diameter must stay finger-sized');
   assert.ok(ring.metadata.localThickness/ring.metadata.localDiameter<=.17,'ring band must remain delicate');
   ring.computeWorldMatrix(true);
   const box=ring.getBoundingInfo().boundingBox,size=box.maximumWorld.subtract(box.minimumWorld);
   assert.ok(Math.max(size.x,size.y,size.z)<.08,'ring must not exceed a small fraction of the character');
  }
  assert.equal(bilboRing.parent,bilboFinger);assert.equal(frodoRing.parent,frodoFinger);
  assert.equal(bilboRing.metadata.attachedBone,'bilbo ring_01_r');
  assert.equal(frodoRing.metadata.attachedBone,'frodo ring_01_r');
  const actors=[{id:'bilbo',root:bilboRoot,imported:{ring:bilboRing}},{id:'frodo',root:frodoRoot,imported:{ring:frodoRing}}];
  assert.equal(syncOneRingOwner(actors,'bilbo'),'bilbo');assert.ok(bilboRing.isEnabled());assert.ok(!frodoRing.isEnabled());
  bilboRoot.setEnabled(false);
  assert.equal(syncOneRingOwner(actors,'frodo'),'frodo');assert.ok(!bilboRing.isEnabled());assert.ok(frodoRing.isEnabled());
 }finally{scene.dispose();engine.dispose();}
});
