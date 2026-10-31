import test from 'node:test';import assert from 'node:assert/strict';
import '../dist/vendor/babylon.js';import {addHomeCollision} from '../dist/home-collision.mjs';
const B=globalThis.BABYLON;
test('mound sides and back stop native movement at the visible surface at every house scale',()=>{
 for(const s of [.67,1,1.2])for(const direction of [[1,0],[-1,0],[0,1]]){
 const engine=new B.NullEngine(),scene=new B.Scene(engine);scene.collisionsEnabled=true;new B.UniversalCamera('camera',new B.Vector3(0,5,-10),scene);
 try{
 const ground=B.MeshBuilder.CreateGround('ground',{width:40,height:40},scene);ground.checkCollisions=true;
 const hull=addHomeCollision(B,scene,{x:0,z:0,s});
 const body=B.MeshBuilder.CreateSphere('player',{diameter:1},scene);body.ellipsoid=new B.Vector3(.32,.7,.32);body.position.set(direction[0]*10,.72,4.6*s+direction[1]*10);let hits=0;body.onCollide=m=>{if(m===hull)hits++;};scene.render();
 for(let i=0;i<180;i++){body.moveWithCollisions(new B.Vector3(-direction[0]*.08,-.04,-direction[1]*.08));scene.render();}
 assert.ok(hits>0,'mound must generate a real collision');
 const distance=direction[0]?Math.abs(body.position.x):body.position.z-4.6*s;
 assert.ok(distance>(direction[0]?4.5:3.6)*s,'player must remain outside the visible green mound');
 assert.equal(scene.meshes.filter(m=>m.name==='hobbit house solid interior').length,1,'one collider draw object per home');
 }finally{scene.dispose();engine.dispose();}
 }
});
