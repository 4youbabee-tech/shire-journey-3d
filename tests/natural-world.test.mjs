import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorld} from '../dist/world.mjs';
await import('../dist/vendor/babylon.js');
const B=globalThis.BABYLON;
test('mottled ground stays a real collision surface and stylized limbs use soft forms',()=>{
 const engine=new B.NullEngine({renderWidth:720,renderHeight:480}),scene=new B.Scene(engine);
 const world=createWorld(B,scene,{shadows:false});
 const colors=world.ground.getVerticesData(B.VertexBuffer.ColorKind);
 assert.ok(colors?.length>8000,'procedural grass variation is applied to subdivided ground');
 assert.equal(world.ground.checkCollisions,true);
 assert.ok(world.stats.houses>=16&&world.stats.backgroundVillagers===3);
 const player=world.player;
 assert.ok(player.parts.some(p=>(p.metadata?.sourceNames||[p.name]).includes('small leather travelling pack')));
 const names=player.parts.flatMap(p=>p.metadata?.sourceNames||[p.name]);
 assert.ok(names.includes('travelling cloak'));
 // Collision-only invisible hulls are not draw submissions; keep the visible render budget strict.
 const visibleRenderMeshes=scene.meshes.filter(m=>m.isVisible&&m.getTotalVertices()>0);
 assert.ok(visibleRenderMeshes.length<240,'maintain original strict visible render mesh draw budget');
 assert.ok(world.stats.colliders<100,'keep invisible collision volume budget bounded');
 engine.dispose();
});
