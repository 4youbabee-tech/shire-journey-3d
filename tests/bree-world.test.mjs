import test from 'node:test';import assert from 'node:assert/strict';import '../dist/vendor/babylon.js';
import {createBree} from '../dist/bree.mjs';import {freshBree,BREE_POINTS as P} from '../dist/bree-state.mjs';
const B=globalThis.BABYLON;
test('Bree town and Pony interior provide colliding walkable geometry and restore their own location',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);scene.collisionsEnabled=true;new B.UniversalCamera('camera',new B.Vector3(0,5,-40),scene);
 const body=B.MeshBuilder.CreateSphere('player',{diameter:1},scene);body.ellipsoid=new B.Vector3(.32,.7,.32);body.isVisible=false;const world={body,shadow:null};let changes=0;
 const bree=createBree(B,scene,world,{onChange:()=>changes++});const saved=freshBree();bree.activate(saved,{fromGate:true});assert.equal(bree.snapshot().buildings,13);assert.equal(bree.snapshot().residents,6);assert.ok(bree.snapshot().activeMeshes<110);
 for(let i=0;i<450;i++){body.moveWithCollisions(new B.Vector3(0,-.03,.105));scene.render();}assert.ok(body.position.z>10&&body.position.z<15,'natural street walking reaches Pony entrance');
 assert.equal(bree.interactable(body.position).id,'bree-enter');assert.equal(bree.interact(),true);assert.equal(saved.location,'inn');assert.equal(world.ground.name,'Pony oak floor');assert.ok(bree.snapshot().activeMeshes<100);
 body.position.set(P.exit.x,.72,P.exit.z);assert.equal(bree.interact(),true);assert.equal(saved.location,'town');assert.equal(world.ground.name,'Bree walkable square');
 saved.location='inn';body.position.set(2,.72,6);bree.activate(saved,{resume:true});assert.equal(body.position.x,2);assert.equal(body.position.z,6);bree.deactivate();assert.equal(bree.active,false);assert.ok(changes>0);bree.dispose();scene.dispose();engine.dispose();
});
