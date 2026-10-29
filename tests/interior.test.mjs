import test from 'node:test';
import assert from 'node:assert/strict';
import {nearBagDoor,BAG_DOOR,createBagEndInterior} from '../dist/interior.mjs';
import {freshState,restoreState} from '../dist/simulation.mjs';
await import('../dist/vendor/babylon.js');
const B=globalThis.BABYLON;
test('Bag End room is real, furnished, gated and safe for mobile world collision',()=>{
 const engine=new B.NullEngine({renderWidth:800,renderHeight:600}),scene=new B.Scene(engine);
 new B.UniversalCamera('room camera',new B.Vector3(160,3,132),scene);
 const room=createBagEndInterior(B,scene);
 assert.ok(room.stats.decor>=30);assert.equal(room.stats.lights,2);
 assert.ok(room.colliders.length>=5);assert.equal(room.meshes.some(m=>m.isEnabled()),false);
 assert.equal(nearBagDoor(BAG_DOOR),true);assert.equal(nearBagDoor({x:0,z:0}),false);
 room.setActive(true);assert.equal(room.meshes.every(m=>m.isEnabled()),true);
 assert.equal(room.nearby({x:160,z:136}).id,'exit-house');
 assert.equal(room.nearby({x:154,z:151}).id,'diary');
 room.setActive(false);assert.equal(room.meshes.some(m=>m.isEnabled()),false);
 engine.dispose();
});
test('old save files still recover after new indoor and sound functionality',()=>{
 const legacy={version:1,stage:0,apples:[],visited:[],position:{x:0,z:-15},completed:false,memories:[]};
 const state=restoreState(JSON.stringify(legacy));
 assert.equal(state.stage,0);assert.deepEqual(state.position,legacy.position);
 assert.deepEqual(state,freshState());
});
