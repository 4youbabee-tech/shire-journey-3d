import test from 'node:test';import assert from 'node:assert/strict';import '../dist/vendor/babylon.js';import {terrainHeightAt,shapeTerrain} from '../dist/terrain.mjs';
const B=globalThis.BABYLON;
test('Bag End terrace rises above the party meadow and remains reachable with native movement',()=>{
 assert.ok(terrainHeightAt(11,8.2)>1.5);assert.equal(terrainHeightAt(-2,22),0);assert.equal(terrainHeightAt(-1.2,-20),0);
 const engine=new B.NullEngine(),scene=new B.Scene(engine);scene.collisionsEnabled=true;new B.UniversalCamera('camera',new B.Vector3(0,5,-10),scene);
 try{const ground=B.MeshBuilder.CreateGround('sculpted ground',{width:80,height:80,subdivisions:80},scene);shapeTerrain(B,ground);ground.checkCollisions=true;
 const body=B.MeshBuilder.CreateSphere('walker',{diameter:1},scene);body.ellipsoid=new B.Vector3(.32,.7,.32);body.position.set(11,.72,-5);scene.render();
 for(let i=0;i<160;i++){body.moveWithCollisions(new B.Vector3(0,-.12,.09));scene.render();}
 assert.ok(body.position.z>7,'the slope must not trap the player');assert.ok(body.position.y>2.2,'native collision must raise the player onto the hill');assert.ok(Math.abs(body.position.y-.7-terrainHeightAt(body.position.x,body.position.z))<.16,'feet follow the terrain instead of floating');
 }finally{scene.dispose();engine.dispose();}
});

import {createWorld} from '../dist/world.mjs';import {nearBagDoor} from '../dist/interior.mjs';
test('the actual village route reaches Bag End and backtracks down the hill without resetting the walker',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);new B.UniversalCamera('camera',new B.Vector3(0,5,-10),scene);
 try{const world=createWorld(B,scene,{shadows:false,deferredNature:true,deferredCharacters:true});world.body.position.set(11,.72,-5);scene.render();
 for(let i=0;i<162;i++){world.body.moveWithCollisions(new B.Vector3(0,-.12,.08));scene.render();}
 assert.equal(nearBagDoor(world.body.position),true,'walked route must reach the real door interaction');assert.ok(world.body.position.y>2.2,'entry route is visibly raised');
 for(let i=0;i<170;i++){world.body.moveWithCollisions(new B.Vector3(0,-.12,-.08));scene.render();}
 assert.ok(world.body.position.z<-4,'walk down again using the same native collision body');assert.ok(world.body.position.y>.65,'no falling through the sculpted ground');
 }finally{scene.dispose();engine.dispose();}
});
