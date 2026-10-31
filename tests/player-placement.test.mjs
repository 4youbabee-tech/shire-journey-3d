import test from 'node:test';import assert from 'node:assert/strict';
import '../dist/vendor/babylon.js';import {createWorld} from '../dist/world.mjs';import {terrainHeightAt} from '../dist/terrain.mjs';import {placePlayerOnTerrain} from '../dist/player-placement.mjs';import {addActorCollision} from '../dist/actor-collision.mjs';
const B=globalThis.BABYLON;
test('opening handoff places feet above the actual slope and real forward/backward input remains walkable near Gandalf',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);new B.UniversalCamera('camera',new B.Vector3(0,5,-10),scene);const world=createWorld(B,scene,{shadows:false,deferredNature:true,deferredCharacters:true});
 try{for(const c of world.characters)if(c.id!=='player'){c.root.position.y=terrainHeightAt(c.root.position.x,c.root.position.z);addActorCollision(B,scene,world,c,c.id==='gandalf'?2.5:1.45);}
 placePlayerOnTerrain(world,-2,14.8);assert.ok(world.player.root.position.y>terrainHeightAt(-2,14.8));assert.ok(Math.abs(world.body.position.y-world.player.root.position.y-.7)<1e-8);scene.render();const start=world.body.position.clone();for(let i=0;i<8;i++){world.body.moveWithCollisions(new B.Vector3(0,-.12,.27));scene.render();}assert.ok(world.body.position.z>start.z+.5,'native forward movement after the actual opening handoff');assert.ok(world.body.position.z<16.5,'Gandalf remains a solid body');for(let i=0;i<12;i++){world.body.moveWithCollisions(new B.Vector3(0,-.12,-.14));scene.render();}assert.ok(world.body.position.z<start.z+.1,'the player can turn back without a reset');assert.ok(world.body.position.y>.65);
 }finally{scene.dispose();engine.dispose();}
});
