import test from 'node:test';import assert from 'node:assert/strict';import '../dist/vendor/babylon.js';import {createBagEndInterior} from '../dist/interior.mjs';const B=globalThis.BABYLON;
test('Bag End supports real room walking, stops at the dining table and returns to the exit',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);scene.collisionsEnabled=true;new B.UniversalCamera('camera',new B.Vector3(160,4,132),scene);
 try{const room=createBagEndInterior(B,scene);room.setActive(true);const body=B.MeshBuilder.CreateSphere('walker',{diameter:1},scene);body.ellipsoid=new B.Vector3(.32,.7,.32);body.position.set(room.spawn.x,room.spawn.y,room.spawn.z);let tableHits=0;body.onCollide=m=>{if(m.name==='dining table')tableHits++;};scene.render();
 for(let i=0;i<45;i++){body.moveWithCollisions(new B.Vector3(0,-.12,.08));scene.render();}
 assert.ok(body.position.z>140&&body.position.z<141.1,'walk into the room without crossing the table');assert.ok(tableHits>0,'actual furniture collision must fire');assert.ok(body.position.y>.65,'feet remain over the real floor');
 for(let i=0;i<45;i++){body.moveWithCollisions(new B.Vector3(0,-.12,-.08));scene.render();}
 assert.equal(room.nearby(body.position)?.id,'exit-house','same body walks back to the doorway');
 }finally{scene.dispose();engine.dispose();}
});
