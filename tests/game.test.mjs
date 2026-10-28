import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreState,frameDelta,act,collect,dialogue,talk,APPLES,nearestInteractable,objective} from '../dist/simulation.mjs';
import {createWorld} from '../dist/world.mjs';
await import('../dist/vendor/babylon.js');
const B=globalThis.BABYLON;
const sourceParts=c=>c.parts.flatMap(p=>p.metadata?.sourceNames||[p.name]);
test('render-frame time does not artificially slow movement at 5-15 FPS',()=>{assert.equal(frameDelta(200),.2);assert.equal(frameDelta(150),.15);assert.equal(frameDelta(40),.04);assert.equal(frameDelta(4000),.2);assert.equal(frameDelta(-3),0);});
test('complete quest in order; distance, prerequisites and duplicate pickup gates',()=>{
 const s=freshState();assert.equal(act(s,'finish'),false);assert.equal(collect(s,APPLES[0].id,APPLES[0]),false);assert.equal(talk(s,'bilbo'),true);assert.ok(dialogue(s,'bilbo').options.some(o=>o[1]==='accept'));assert.equal(act(s,'accept'),true);assert.equal(act(s,'accept'),false);assert.equal(act(s,'basket'),true);assert.equal(collect(s,APPLES[0].id,{x:0,z:0}),false);
 for(const a of APPLES){assert.equal(collect(s,a.id,a),true);assert.equal(collect(s,a.id,a),false);}assert.equal(s.stage,3);assert.equal(act(s,'finish'),false);assert.equal(act(s,'thank-sam'),true);assert.ok(dialogue(s,'bilbo').options.some(o=>o[1]==='finish'));assert.equal(act(s,'finish'),true);assert.equal(s.stage,5);assert.equal(s.completed,true);assert.equal(objective(s),'استمتع بوقتك في الشاير');
});
test('save round trip and corrupt or inconsistent save recovery',()=>{const s=freshState();act(s,'accept');act(s,'basket');collect(s,APPLES[0].id,APPLES[0]);s.position={x:-17,z:12};assert.deepEqual(restoreState(JSON.stringify(s)),s);for(const raw of ['bad','null','{}',JSON.stringify({...s,stage:99}),JSON.stringify({...s,stage:4}),JSON.stringify({...s,position:{x:null,z:0}}),JSON.stringify({...s,position:{x:999,z:0}})])assert.deepEqual(restoreState(raw),freshState());});
test('nearby interaction and visited character de-duplication',()=>{const s=freshState();assert.equal(nearestInteractable(s,{x:8,z:7}).id,'bilbo');assert.equal(nearestInteractable(s,{x:0,z:-15}),null);talk(s,'bilbo');talk(s,'bilbo');assert.deepEqual(s.visited,['bilbo']);assert.equal(nearestInteractable(s,{x:3,z:-4}).id,'frodo');assert.equal(talk(s,'invented'),false);});
test('all main dialogue stages expose valid original dialogue',()=>{for(let stage=0;stage<=5;stage++)for(const id of ['bilbo','sam','gandalf','frodo']){const d=dialogue({...freshState(),stage},id);assert.ok(d.text.length>20);assert.ok(d.options.length);assert.ok(d.options.every(o=>o.length===2));}});
test('Babylon scene builds and advances native player collisions with houses and boundary',()=>{
 const engine=new B.NullEngine({renderWidth:1280,renderHeight:720});const scene=new B.Scene(engine);new B.UniversalCamera('test camera',new B.Vector3(0,5,-23),scene);const w=createWorld(B,scene,{shadows:false});scene.render();assert.equal(w.characters.length,8);assert.equal(w.workers.length,3);assert.ok(w.leaves.length>=4);assert.equal(w.apples.length,3);assert.ok(w.player.leftLeg&&w.player.rightLeg,'player has articulated feet');assert.ok(sourceParts(w.characters.find(c=>c.id==='sam')).includes('Sam garden trowel blade'));assert.ok(sourceParts(w.characters.find(c=>c.id==='bilbo')).includes('Bilbo hand-bound book'));assert.equal(sourceParts(w.characters.find(c=>c.id==='bilbo')).filter(n=>n==='Bilbo burgundy front coat').length,2);assert.ok(sourceParts(w.characters.find(c=>c.id==='frodo')).includes('Frodo shoulder satchel'));assert.ok(w.stats.staticBatches<45);assert.ok(scene.meshes.every(m=>Number.isFinite(m.position.x)));
 // A head turn must carry every facial feature; rigid batching must preserve joints.
 assert.ok(scene.meshes.length<240,'rigid character batching reduces mesh submission budget');
 for(const c of w.characters){
  const eyes=c.parts.find(p=>(p.metadata?.sourceNames||[p.name]).includes('eye'));
  assert.equal(eyes.parent,c.head);const vertex=B.Vector3.FromArray(eyes.getVerticesData(B.VertexBuffer.PositionKind));const before=B.Vector3.TransformCoordinates(vertex,eyes.computeWorldMatrix(true));
  c.head.rotation.y=.5;eyes.computeWorldMatrix(true);
  assert.ok(B.Vector3.Distance(before,B.Vector3.TransformCoordinates(vertex,eyes.getWorldMatrix()))>.01,'eyes rotate with head');
  assert.ok(c.head.getChildMeshes().some(p=>(p.metadata?.sourceNames||[p.name]).includes('nose')));
  assert.ok(c.left.getChildMeshes().length>0);c.head.rotation.y=0;
 }
 // Walk straight into Bag End's solid front; the same native collision API is used by the game.
 w.body.position.set(11,.72,6);for(let i=0;i<100;i++){w.body.moveWithCollisions(new B.Vector3(0,-.04,.1));scene.render();}const house=w.colliders.find(m=>m.name==='hobbit house solid interior');const front=house.getBoundingInfo().boundingBox.minimumWorld.z;assert.ok(w.body.position.z<=front-w.body.ellipsoid.z+.01,'house wall must stop the full player ellipsoid');assert.ok(w.body.position.z>6,'player moves before hitting wall');assert.ok(w.body.position.y>.65,'player stays above ground');
 w.body.position.set(30,.72,0);for(let i=0;i<80;i++){w.body.moveWithCollisions(new B.Vector3(.1,-.04,0));scene.render();}assert.ok(w.body.position.x<32.5,'boundary must stop player');assert.ok(w.body.position.x>30,'player moves to boundary');console.log(JSON.stringify({sceneMeshes:scene.meshes.length,triangles:scene.meshes.reduce((n,m)=>n+m.getTotalIndices()/3,0),...w.stats}));engine.dispose();
});
test('all HTML local scripts and styles exist; no external runtime asset calls',()=>{const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');for(const path of ['vendor/babylon.js','game.mjs','style.css']){assert.ok(html.includes(path));assert.ok(readFileSync(new URL('../dist/'+path,import.meta.url)).length);}assert.ok(!/https?:\/\//.test(html));});

