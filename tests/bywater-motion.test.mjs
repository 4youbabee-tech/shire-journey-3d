import test from 'node:test';
import assert from 'node:assert/strict';
import '../dist/vendor/babylon.js';
import {createWorld} from '../dist/world.mjs';
import {resolveCameraObstruction} from '../dist/camera-obstruction.mjs';
const B=globalThis.BABYLON;
test('Bywater single-mesh residents have independent visible limb skinning',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);new B.UniversalCamera('camera',new B.Vector3(0,4,-10),scene);
 const world=createWorld(B,scene,{shadows:false,deferredNature:true,deferredCharacters:true});
 assert.ok(world.cameraBlockers.some(m=>m.name==='batched hill'),'decorative hills also obstruct the camera');
 const villagers=world.workers.filter(v=>v.simple);assert.equal(villagers.length,2);
 for(const actor of villagers){
  assert.equal(actor.parts.length,1);assert.equal(actor.skeleton.bones.length,6);
  scene.activeCamera.position.copyFrom(actor.root.position.add(new B.Vector3(0,2,-5)));scene.activeCamera.setTarget(actor.root.position.add(new B.Vector3(0,1,0)));
  scene.render();const before=Array.from(actor.skeleton.getTransformMatrices(actor.bodyMesh));
  actor.leftLeg.rotation.x=.6;scene.render();const after=Array.from(actor.skeleton.getTransformMatrices(actor.bodyMesh));
  assert.notDeepEqual(after.slice(64,80),before.slice(64,80),'left leg bone moves');
  assert.deepEqual(after.slice(80,96),before.slice(80,96),'right leg stays independent');
  const indices=actor.bodyMesh.getVerticesData(B.VertexBuffer.MatricesIndicesKind),weights=actor.bodyMesh.getVerticesData(B.VertexBuffer.MatricesWeightsKind);
  assert.ok(indices.includes(4));assert.ok(indices.includes(5));for(let i=0;i<weights.length;i+=4)assert.equal(weights[i],1);
 }
 assert.notEqual(villagers[0].skeleton,villagers[1].skeleton);scene.dispose();engine.dispose();
});
test('camera volume catches edge obstruction missed by center ray and ignores disabled regions',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);
 const wall=B.MeshBuilder.CreateBox('edge wall',{width:.4,height:4,depth:2},scene);wall.position.set(.6,1,-4);wall.isVisible=false;wall.computeWorldMatrix(true);
 const target=new B.Vector3(0,1,0),desired=new B.Vector3(0,1,-7);
 assert.equal(scene.pickWithRay(new B.Ray(target,new B.Vector3(0,0,-1),7),m=>m===wall).hit,false);
 const resolved=resolveCameraObstruction(B,scene,[wall],target,desired);assert.ok(resolved.z>-3);
 wall.setEnabled(false);assert.ok(resolveCameraObstruction(B,scene,[wall],target,desired).equalsWithEpsilon(desired));scene.dispose();engine.dispose();
});
