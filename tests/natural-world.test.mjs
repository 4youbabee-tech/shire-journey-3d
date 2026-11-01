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

test('B3 Hobbiton homes gain distinct facade, threshold and garden art without changing collision budgets',()=>{
 const engine=new B.NullEngine({renderWidth:720,renderHeight:480}),scene=new B.Scene(engine);
 const world=createWorld(B,scene,{shadows:false,deferredNature:true,deferredCharacters:true});
 const art=world.stats.homesteadDetails;
 assert.equal(art.homes,17,'every original home is dressed in place');
 assert.deepEqual(art.styles,['bag-end','orchard','flower','woodland']);
 assert.equal(art.shutters,68,'four shutters per home frame existing round windows');
 assert.equal(art.doorHardware,51,'existing doors gain two hinges and one escutcheon');
 assert.equal(art.gardenBeds,34,'two garden beds per home stay clear of the entrance');
 assert.equal(art.steppingStones,51,'three walk stones per threshold');
 assert.ok(art.roofAccents>=14,'roof accents and Bag End lintel remain present');
 assert.equal(world.stats.houses,17);
 assert.equal(world.stats.treeAnchors,28,'B2 tree layout remains untouched');
 assert.equal(world.colliders.filter(c=>c.name==='tree trunk collision').length,28);
 assert.equal(world.stats.roads,12,'B3 must not move roads');
 assert.ok(scene.meshes.length<240,'batched static art stays inside startup mesh budget');
 engine.dispose();
});
