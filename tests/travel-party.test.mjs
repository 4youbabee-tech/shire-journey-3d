import test from 'node:test';
import assert from 'node:assert/strict';
import '../dist/vendor/babylon.js';
import {createTravelParty} from '../dist/travel-party.mjs';
import {terrainHeightAt,shapeTerrain} from '../dist/terrain.mjs';
const B=globalThis.BABYLON;
test('Sam starts and resets on his own terrain height, follows the hill, and rests indoors',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);scene.collisionsEnabled=true;
 new B.UniversalCamera('camera',new B.Vector3(0,8,-10),scene);
 const ground=B.MeshBuilder.CreateGround('terrain',{width:100,height:100,subdivisions:160,updatable:true},scene);shapeTerrain(B,ground);ground.checkCollisions=true;
 const characters=['frodo','sam'].map(id=>{const root=new B.TransformNode(id,scene);const collider=B.MeshBuilder.CreateSphere(id+' collision volume',{diameter:.5},scene);collider.parent=root;return {id,root};});
 const player={root:new B.TransformNode('player',scene)},body=B.MeshBuilder.CreateSphere('body',{diameter:.5},scene),world={characters,player,body};
 const party=createTravelParty(B,scene,world),sam=characters[1];
 const at=(x,z)=>{body.position.set(x,.72+terrainHeightAt(x,z),z);player.root.position.set(x,terrainHeightAt(x,z),z);};
 const grounded=()=>assert.ok(Math.abs(sam.root.position.y-terrainHeightAt(sam.root.position.x,sam.root.position.z))<1e-5,'Sam feet must meet his terrain, including after a door transition');
 try{
  at(11,9);party.setActive(true);grounded();
  const start=sam.root.position.clone();
  for(let i=0;i<150;i++){at(11,9+i*.035);party.update(1/60);scene.render();grounded();}
  assert.ok(B.Vector3.Distance(sam.root.position,start)>.5,'the companion must actually move');
  assert.equal(sam.activity,'Walk');party.update(1/60,{inside:true});assert.equal(sam.activity,'Idle');
  at(-20,-12);party.resetFollower();grounded();assert.ok(B.Vector3.Distance(sam.root.position,player.root.position)<2,'door exit must move the visible rig immediately');
  assert.equal(sam.activity,'Idle');party.setActive(false);assert.equal(player.root.isEnabled(),true);
 }finally{party.dispose();scene.dispose();engine.dispose();}
});
