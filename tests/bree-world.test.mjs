import test from 'node:test';import assert from 'node:assert/strict';import '../dist/vendor/babylon.js';
import {createBree} from '../dist/bree.mjs';import {freshBree,BREE_POINTS as P} from '../dist/bree-state.mjs';
const B=globalThis.BABYLON;
test('Bree town and Pony interior provide colliding walkable geometry and restore their own location',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);scene.collisionsEnabled=true;new B.UniversalCamera('camera',new B.Vector3(0,5,-40),scene);
 const body=B.MeshBuilder.CreateSphere('player',{diameter:1},scene);body.ellipsoid=new B.Vector3(.32,.7,.32);body.isVisible=false;const world={body,shadow:null};let changes=0,transitions=0;
 const bree=createBree(B,scene,world,{onChange:()=>changes++,onTransition:()=>transitions++});const saved=freshBree();bree.activate(saved,{fromGate:true});assert.equal(bree.snapshot().buildings,13);assert.equal(bree.snapshot().residents,6);assert.ok(bree.snapshot().activeMeshes<110);
 for(let i=0;i<450;i++){body.moveWithCollisions(new B.Vector3(0,-.03,.105));scene.render();}assert.ok(body.position.z>10&&body.position.z<15,'natural street walking reaches Pony entrance');
 assert.equal(bree.interactable(body.position).id,'bree-enter');assert.equal(bree.interact(),true);assert.equal(saved.location,'inn');assert.equal(world.ground.name,'Pony oak floor');assert.ok(bree.snapshot().activeMeshes<100);
 const transitionCount=transitions;body.position.set(P.keeper.x,.72,P.keeper.z);bree.interact();assert.equal(transitions,transitionCount,'dialogue progress does not reset camera/party');body.position.set(P.exit.x,.72,P.exit.z);assert.equal(bree.interact(),true);assert.equal(saved.location,'town');assert.equal(world.ground.name,'Bree walkable square');
 saved.location='inn';body.position.set(2,.72,6);bree.activate(saved,{resume:true});assert.equal(body.position.x,2);assert.equal(body.position.z,6);bree.deactivate();assert.equal(bree.active,false);assert.ok(changes>0);bree.dispose();scene.dispose();engine.dispose();
});

import {createWorld} from '../dist/world.mjs';
import {createShireRoad} from '../dist/shire-road.mjs';
import {restoreRoad,ROAD_POINTS} from '../dist/road-state.mjs';
test('road gate enters Bree lazily, saves the interior, resumes it and restores the village',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);new B.UniversalCamera('camera',new B.Vector3(0,4,-20),scene);const world=createWorld(B,scene,{shadows:false,deferredNature:true,deferredCharacters:true});const village=world.ground;const region=createShireRoad(B,scene,world);const road={step:'bree'};
 region.activate(road);world.body.position.set(ROAD_POINTS.gate.x,.72,ROAD_POINTS.gate.z);assert.equal(region.interact(),true);assert.equal(road.bree.location,'town');assert.equal(world.ground.name,'Bree walkable square');world.body.position.set(P.inn.x,.72,P.inn.z);assert.equal(region.interact(),true);assert.equal(road.bree.location,'inn');const restored=restoreRoad(JSON.parse(JSON.stringify(road)),'roads');assert.deepEqual(restored,road);assert.equal(restoreRoad(road,'birthday').bree,undefined);
 const count=scene.meshes.length;world.body.position.set(P.exit.x,.72,P.exit.z);region.interact();world.body.position.set(P.gate.x,.72,P.gate.z);region.interact();assert.equal(road.bree,undefined);assert.equal(world.ground,region.ground);world.body.position.set(ROAD_POINTS.gate.x,.72,ROAD_POINTS.gate.z);region.interact();assert.equal(scene.meshes.length,count,'return visit reuses streamed resources');region.deactivate();assert.equal(world.ground,village);assert.equal(world.ground.isEnabled(),true);world.body.position.set(-4,.72,12);region.activate(restored,{resume:true});assert.equal(region.snapshot().bree.location,'inn');assert.equal(world.body.position.x,-4);assert.equal(world.body.position.z,12);region.deactivate();scene.dispose();engine.dispose();
});
