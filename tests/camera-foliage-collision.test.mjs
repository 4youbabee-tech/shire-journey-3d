import test from 'node:test';import assert from 'node:assert/strict';import {createWorld} from '../dist/world.mjs';
await import('../dist/vendor/babylon.js');
const B=globalThis.BABYLON;
test('tree and hedge collision hulls remain invisible while participating in camera ray tests',()=>{
 const engine=new B.NullEngine({renderWidth:640,renderHeight:360}),scene=new B.Scene(engine),world=createWorld(B,scene,{shadows:false,deferredNature:true,deferredCharacters:true});
 const blockers=world.colliders.filter(m=>m.metadata?.cameraBlocker===true);assert.ok(blockers.length>=30,'Tree trunks and merged hedges must provide camera obstruction hulls');
 for(const m of blockers){assert.equal(m.isVisible,true,'Invisible-by-alpha mesh remains pickable');assert.equal(m.visibility,0);assert.equal(m.isPickable,true);assert.equal(m.checkCollisions,true);}
 const tree=blockers.find(m=>m.name==='tree trunk collision');assert.ok(tree);tree.computeWorldMatrix(true);const origin=new B.Vector3(tree.position.x,tree.position.y,tree.position.z-8),ray=new B.Ray(origin,new B.Vector3(0,0,1),16);const hit=scene.pickWithRay(ray,m=>world.colliders.includes(m)&&m.metadata?.cameraBlocker!==false);assert.equal(hit?.pickedMesh,tree,'Camera ray must hit the trunk before entering canopy');
 const hedge=blockers.find(m=>m.name==='solid village hedges');assert.ok(hedge,'Merged hedge hull is retained');const before=world.colliders.length;assert.ok(before>=blockers.length);engine.dispose();
});
