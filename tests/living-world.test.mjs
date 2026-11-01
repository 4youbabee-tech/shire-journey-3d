import test from 'node:test';import assert from 'node:assert/strict';import '../dist/vendor/babylon.js';
import {faunaRoutine,createAmbientFauna} from '../dist/fauna.mjs';
import {sampleDayCycle,createDayCycle} from '../dist/day-cycle.mjs';
const B=globalThis.BABYLON;
test('fauna follows bounded, asynchronous meadow routines and rests at night',()=>{
 const sheep=faunaRoutine(30,.2,2.1,'sheep',12),rabbit=faunaRoutine(30,1.1,1.55,'rabbit',12),night=faunaRoutine(30,.2,2.1,'sheep',23);
 for(const p of [sheep,rabbit,night]){assert.ok(Math.abs(p.offsetX)<=2.1);assert.ok(Math.abs(p.offsetZ)<=2.1);assert.ok(Number.isFinite(p.heading));}
 assert.equal(night.resting,true);assert.equal(night.activity,'Rest');assert.equal(night.hop,0);assert.notEqual(sheep.offsetX,rabbit.offsetX);
});
test('day cycle transitions through morning, noon, sunset and night without discontinuities',()=>{
 const morning=sampleDayCycle(0),noon=sampleDayCycle(120),sunset=sampleDayCycle(330),night=sampleDayCycle(480);
 assert.equal(morning.hour,8);assert.equal(morning.label,'الصباح');assert.ok(noon.daylight>morning.daylight);assert.ok(noon.sunIntensity>night.sunIntensity);assert.equal(sunset.label,'الغروب');assert.equal(night.label,'ليل هادئ');
 const a=sampleDayCycle(719),b=sampleDayCycle(720);assert.ok(Math.abs(a.hour-b.hour)<.04);assert.ok(Math.abs(a.sky[0]-b.sky[0])<.01);
});
test('day-cycle controller applies smooth colors and advances the actual scene lights',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine),sun=new B.DirectionalLight('sun',new B.Vector3(0,-1,0),scene),hemi=new B.HemisphericLight('hemi',B.Vector3.Up(),scene);
 scene.imageProcessingConfiguration.exposure=1;const world={sun,hemi},cycle=createDayCycle(B,scene,world);
 const morning=cycle.snapshot();cycle.advance(120);const noon=cycle.snapshot();assert.ok(noon.daylight>morning.daylight);assert.ok(sun.intensity>0);assert.ok(hemi.intensity>morning.hemiIntensity-.001);cycle.advance(360);assert.equal(cycle.snapshot().label,'ليل هادئ');assert.ok(sun.intensity<.2);cycle.dispose();scene.dispose();engine.dispose();
});
test('four low-poly animals use bounded patches and no gameplay colliders',()=>{
 const engine=new B.NullEngine(),scene=new B.Scene(engine),fauna=createAmbientFauna(B,scene,{heightAt:()=>.2});
 assert.equal(fauna.animals.length,4);assert.equal(new Set(fauna.animals.map(a=>a.id)).size,4);
 assert.deepEqual(fauna.animals.map(a=>a.kind).sort(),['rabbit','rabbit','sheep','sheep']);
 for(const animal of fauna.animals){assert.ok(animal.root.position.x>=-49&&animal.root.position.x<=49);assert.ok(animal.root.position.z>=-47&&animal.root.position.z<=52);assert.ok(animal.bodyMesh&&animal.headMesh&&animal.legsMesh);assert.equal(animal.root.getChildMeshes().length,3);}
 fauna.dispose();scene.dispose();engine.dispose();
});
