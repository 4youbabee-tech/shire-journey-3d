import test from 'node:test';import assert from 'node:assert/strict';import '../dist/vendor/babylon.js';
import {createRingInspection,ringInspectionBeat} from '../dist/ring-inspection.mjs';const B=globalThis.BABYLON;
test('Ring inspection follows the transformed palm, pauses, restores gaze and cancels without moving hero',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine),root=new B.TransformNode('Frodo',scene),hand=new B.TransformNode('actual imported palm',scene);hand.parent=root;root.position.set(12,2,5);root.rotation.y=.8;hand.position.set(.4,1.2,.2);let result=null;const originalGaze=new B.Vector3(1,2,3),hero={id:'frodo',root,imported:{hand,lookTarget:originalGaze,reading:false}};
 const interaction=createRingInspection(B,scene,{onFinish:r=>result=r});assert.equal(interaction.begin({...hero,id:'sam'}),false);assert.equal(interaction.begin(hero),true);assert.equal(interaction.begin(hero),false);const initial=root.position.clone();const before=interaction.mesh.position.clone();hand.position.y+=.5;interaction.update(.2);assert.ok(interaction.mesh.position.y>before.y+.49);const elapsed=interaction.snapshot().elapsed;interaction.update(.2,{paused:true});assert.equal(interaction.snapshot().elapsed,elapsed);assert.equal(interaction.cancel(),true);assert.equal(result.cancelled,true);assert.equal(hero.imported.lookTarget,originalGaze);assert.equal(hero.imported.reading,false);assert.ok(root.position.equals(initial));assert.equal(interaction.mesh.isEnabled(),false);
 interaction.begin(hero);for(let i=0;i<41;i++)interaction.update(.2);assert.equal(interaction.active,false);assert.equal(result.cancelled,false);assert.equal(hero.imported.lookTarget,originalGaze);assert.equal(ringInspectionBeat(3).id,'temptation');interaction.dispose();scene.dispose();engine.dispose();
});

import {freshState,restoreState,act} from '../dist/simulation.mjs';
test('saved Ring reflection count is bounded and cannot appear before the bequest',()=>{
 const state=freshState();state.ringInspections=12;assert.equal(restoreState(JSON.stringify(state)).ringInspections,0);
 for(const a of ['greet-wizard','accept','skip-apples','finish','start-party','party-finalize'])assert.equal(act(state,a),true);
 state.ringInspections=4;assert.equal(restoreState(JSON.stringify(state)).ringInspections,4);state.ringInspections=100000;assert.equal(restoreState(JSON.stringify(state)).ringInspections,999);state.ringInspections=-2;assert.equal(restoreState(JSON.stringify(state)).ringInspections,0);state.ringInspections='9';assert.equal(restoreState(JSON.stringify(state)).ringInspections,0);
});
