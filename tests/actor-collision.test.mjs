import test from 'node:test';import assert from 'node:assert/strict';
import '../dist/vendor/babylon.js';import {addActorCollision} from '../dist/actor-collision.mjs';
const B=globalThis.BABYLON;
test('native movement stops at an active villager and crosses after the villager leaves',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);scene.collisionsEnabled=true;new B.UniversalCamera('camera',new B.Vector3(0,3,-5),scene);
 try{const ground=B.MeshBuilder.CreateGround('ground',{width:20,height:20},scene);ground.checkCollisions=true;
 const root=new B.TransformNode('villager',scene),world={colliders:[]},volume=addActorCollision(B,scene,world,{id:'sam',root},1.48);
 const body=B.MeshBuilder.CreateSphere('player',{diameter:1},scene);body.position.set(0,.72,-2);body.ellipsoid=new B.Vector3(.32,.7,.32);body.checkCollisions=true;let impacts=0;body.onCollide=m=>{if(m===volume)impacts++;};scene.render();
 for(let i=0;i<50;i++){body.moveWithCollisions(new B.Vector3(0,-.04,.08));scene.render();}
 assert.ok(impacts>0,'Real Babylon collision callback must fire');assert.ok(body.position.z<-.55,'Player cannot pass through the body');assert.ok(body.position.z>-.8,'No oversized interaction blockade');
 root.setEnabled(false);for(let i=0;i<20;i++){body.moveWithCollisions(new B.Vector3(0,-.04,.08));scene.render();}assert.ok(body.position.z>.5,'Departed/hidden actors must not leave a ghost collider');
 assert.equal(volume.metadata.cameraBlocker,false);assert.ok(world.colliders.includes(volume));
 }finally{scene.dispose();engine.dispose();}
});
