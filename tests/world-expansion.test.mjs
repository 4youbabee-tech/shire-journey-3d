import test from 'node:test';
import assert from 'node:assert/strict';
import {HOMES,ROADS,LANDMARKS,MAP_BOUNDS} from '../dist/village-layout.mjs';
import {arrivalPose,arrivalBeat,createArrival,ARRIVAL_DURATION} from '../dist/arrival.mjs';
import {createWorld} from '../dist/world.mjs';
await import('../dist/vendor/babylon.js');
const B=globalThis.BABYLON;
test('expanded village has connected practical road network and spatially valid named homes',()=>{
 assert.ok(HOMES.length>=16);assert.ok(ROADS.length>=10);assert.ok(LANDMARKS.length>=5);
 for(const house of HOMES){assert.ok(house.x>MAP_BOUNDS.minX+4&&house.x<MAP_BOUNDS.maxX-4);assert.ok(house.z>MAP_BOUNDS.minZ+4&&house.z<MAP_BOUNDS.maxZ-4);}
 for(const road of ROADS)for(const [x,z] of road.points){assert.ok(x>MAP_BOUNDS.minX&&x<MAP_BOUNDS.maxX);assert.ok(z>MAP_BOUNDS.minZ&&z<MAP_BOUNDS.maxZ);}
});
test('original pony cart arrival has timed visuals and restores state without collision or character damage',()=>{
 assert.match(arrivalBeat(2),/يقرأ/);assert.match(arrivalBeat(8),/عربة/);assert.match(arrivalBeat(12),/فرودو/);assert.equal(arrivalPose(2).frodoMode,'Sit');assert.equal(arrivalPose(6).frodoMode,'Rise');
 assert.equal(arrivalPose(11).boarded,false);assert.equal(arrivalPose(22).boarded,true);
 const engine=new B.NullEngine({renderWidth:1280,renderHeight:720}),scene=new B.Scene(engine);
 const camera=new B.UniversalCamera('camera',new B.Vector3(0,5,-20),scene);
 const world=createWorld(B,scene,{shadows:false}),colliders=world.colliders.length;
 const body=world.body.position.clone(),gandalf=world.characters.find(x=>x.id==='gandalf'),frodo=world.characters.find(x=>x.id==='frodo');
 const intro=createArrival(B,scene,world);
 intro.begin(camera);assert.ok(camera.position.x<0,'opening starts at Frodo under the existing west tree');assert.equal(gandalf.root.parent,intro.root);assert.equal(world.player.root.isEnabled(),false);
 for(const t of [0,2,7,12,17,22,ARRIVAL_DURATION]){intro.update(t,camera);scene.render();}
 intro.end();assert.equal(intro.active,false);assert.equal(gandalf.root.parent,null);
 assert.equal(gandalf.root.position.z,17);assert.equal(frodo.root.position.z,-4);
 assert.equal(world.colliders.length,colliders);assert.ok(body.equalsWithEpsilon(world.body.position));
 assert.equal(world.player.root.isEnabled(),true);
 engine.dispose();
});

