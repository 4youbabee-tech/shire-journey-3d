import test from 'node:test';import assert from 'node:assert/strict';import '../dist/vendor/babylon.js';
import {createRingLegacy,legacyBeat,LEGACY_SECONDS} from '../dist/ring-legacy.mjs';const B=globalThis.BABYLON;
test('Ring follows an actual hand, drops on floor, passes through envelope, restores scene on skip and completion',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine);new B.UniversalCamera('camera',new B.Vector3(0,4,-8),scene);
 const sun=new B.DirectionalLight('sun',new B.Vector3(0,-1,0),scene),hemi=new B.HemisphericLight('sky',B.Vector3.Up(),scene);hemi.intensity=.6;
 const characters=['bilbo','gandalf','frodo'].map((id,i)=>{const root=new B.TransformNode(id,scene);root.position.set(i,0,10);root.rotation.y=.4+i;const holder=new B.TransformNode(id+' rig',scene);holder.parent=root;const hand=new B.TransformNode(id+' hand_r',scene);hand.parent=holder;hand.position.set(.4,.9,0);return {id,root,imported:{holder}};});
 const original=characters.map(c=>[c.root.position.asArray(),c.root.rotation.asArray()]);let indoor=false;const room={meshes:[],setActive:on=>indoor=on};let drops=0;const rig=createRingLegacy(B,scene,{characters,sun,hemi},room,{onDrop:()=>drops++});
 try{for(const endAt of [3,LEGACY_SECONDS]){rig.begin();assert.equal(indoor,true);for(const t of [0,6.5,8,12,18,21,24,27]){rig.update(t);scene.render();const ring=scene.getMeshByName('Bilbo plain gold heirloom');assert.ok(Number.isFinite(ring.position.x));if(t===8)assert.ok(Math.abs(ring.position.y-.012)<.001);if(t===24)assert.equal(ring.isEnabled(),false);if(t===27)assert.equal(scene.getMeshByName('red wax seal').isEnabled(),true);}rig.update(endAt);rig.end();assert.equal(indoor,false);assert.deepEqual(characters.map(c=>[c.root.position.asArray(),c.root.rotation.asArray()]),original);assert.equal(hemi.intensity,.6);assert.equal(rig.active,false);}
 assert.equal(drops,2,'one drop cue per playback even across repeated updates');rig.displayEnvelope(true);assert.equal(scene.getMeshByName('Frodo sealed envelope').isEnabled(),true);rig.displayEnvelope(false);
 assert.deepEqual([0,7,10,15,22,27].map(t=>legacyBeat(t).id),['hesitation','release','departure','pickup','envelope','seal']);
 }finally{rig.dispose();scene.dispose();engine.dispose();}
});
