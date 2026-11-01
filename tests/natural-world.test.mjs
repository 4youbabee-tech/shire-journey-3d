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
 assert.ok(scene.meshes.length<240,'maintain original strict mesh draw budget');
 engine.dispose();
});

test('B2 green Shire palette and perimeter grove retain the mobile boot collider budget',()=>{
 const engine=new B.NullEngine({renderWidth:720,renderHeight:480}),scene=new B.Scene(engine);
 const world=createWorld(B,scene,{shadows:false,deferredNature:true,deferredCharacters:true});
 assert.equal(world.stats.treeAnchors,28,'four landmark trees plus twelve original and twelve perimeter grove anchors');
 assert.equal(world.colliders.filter(c=>c.name==='tree trunk collision').length,28,'all 28 tree anchors retain their collision trunks');
 assert.ok(scene.meshes.length<240,'deferred imported foliage does not inflate startup mesh count');
 const meadow=scene.materials.find(m=>m.name==='meadow');
 assert.ok(meadow.diffuseColor.g>meadow.diffuseColor.r*.95,'meadow palette stays green-forward');
 assert.equal(world.ground.checkCollisions,true);
 engine.dispose();
});
