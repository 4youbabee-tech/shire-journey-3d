import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {blinkAmount,CHARACTER_HEIGHTS} from '../dist/characters.mjs';
import {gardenerRoutine} from '../dist/life.mjs';
import {arrivalPose,ARRIVAL_DURATION} from '../dist/arrival.mjs';
test('eyelid deformation is short, bounded and staggered across the cast',()=>{
 assert.equal(blinkAmount(.085,0),1);assert.equal(blinkAmount(.5,0),0);
 let different=false;for(let t=0;t<10;t+=.02){const a=blinkAmount(t,1),b=blinkAmount(t,4);assert.ok(a>=0&&a<=1);different||=Math.abs(a-b)>.2;}
 assert.ok(different);assert.ok(CHARACTER_HEIGHTS.gandalf>CHARACTER_HEIGHTS.sam*1.5);assert.ok(CHARACTER_HEIGHTS.gandalf<CHARACTER_HEIGHTS.frodo*1.9,'wizard remains human-scale relative to the hobbits');assert.ok(CHARACTER_HEIGHTS.bilbo<CHARACTER_HEIGHTS.sam);
});
test('a full garden day has work and rest without synchronized actors or jumps',()=>{
 const states=new Set();let different=false;
 for(let t=0;t<144;t+=.02){const a=gardenerRoutine(t,0,1.2),b=gardenerRoutine(t+.02,0,1.2);states.add(a.activity);assert.ok(Math.abs(a.offsetX-b.offsetX)<.04);different||=a.activity!==gardenerRoutine(t,4,1.2).activity;}
 assert.deepEqual([...states].sort(),['Idle','Rest','Socialize','Walk','Work']);assert.ok(different);
});
test('opening preserves reading, rise, run, greeting and boarding order, with stationary greeting cart',()=>{
 assert.equal(arrivalPose(3).frodoMode,'Sit');assert.equal(arrivalPose(6).frodoMode,'Rise');assert.equal(arrivalPose(11).frodoMode,'Run');assert.equal(arrivalPose(18).frodoMode,'Talk');assert.equal(arrivalPose(25).frodoMode,'Ride');
 assert.equal(arrivalPose(18).cartMoving,false);assert.equal(arrivalPose(ARRIVAL_DURATION).cartZ,-10);
 for(let t=0;t<ARRIVAL_DURATION;t+=.01){const a=arrivalPose(t),b=arrivalPose(t+.01);if(t<21&&t+.01<21)assert.ok(Math.hypot(a.frodoX-b.frodoX,a.frodoZ-b.frodoZ)<.06);}
});
test('sampled original soundtrack is the complete reviewed MP3, not a truncated upload',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../scripts/audio-data/manifest.json',import.meta.url)));
 for(const [name,expected] of Object.entries(manifest)){const data=readFileSync(new URL('../dist/assets/audio/'+name,import.meta.url));assert.equal(data.length,expected.bytes);assert.equal(createHash('sha256').update(data).digest('hex'),expected.sha256);assert.equal(data.subarray(0,3).toString(),'ID3');assert.ok(data.length<900000);}
});
