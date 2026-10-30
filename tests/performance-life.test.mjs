import test from 'node:test';
import assert from 'node:assert/strict';
import {createAdaptiveQuality} from '../dist/adaptive-quality.mjs';
import {gardenerRoutine} from '../dist/life.mjs';
const feed=(q,fps,s)=>{let changes=0;for(let i=0;i<s*2;i++)if(q.sample(fps,.5))changes++;return changes;};
test('adaptive quality uses a sustained FPS window and slowly recovers',()=>{
 const q=createAdaptiveQuality();
 assert.equal(q.snapshot().scale,1);assert.equal(q.snapshot().shadows,true);
 assert.equal(feed(q,12,7.5),0);assert.equal(feed(q,12,8),1);
 assert.equal(q.snapshot().scale,1);assert.equal(q.snapshot().shadows,false);assert.equal(feed(q,12,10),0);
 assert.equal(feed(q,55,21),1);assert.equal(q.snapshot().scale,1);assert.equal(q.snapshot().shadows,true);
});
test('moderate slowdown scales gradually while severe slowdown removes shadows first',()=>{
 const moderate=createAdaptiveQuality();assert.equal(feed(moderate,24,16),1);
 assert.equal(moderate.snapshot().scale,1.25);assert.equal(moderate.snapshot().shadows,true);
 const severe=createAdaptiveQuality();feed(severe,15,16);
 assert.equal(severe.snapshot().scale,1);assert.equal(severe.snapshot().shadows,false);
 feed(severe,15,20);assert.equal(severe.snapshot().scale,1.25);assert.equal(severe.snapshot().shadows,false);
 // A short hitch must not lower a stable scene's quality.
 const hitch=createAdaptiveQuality();feed(hitch,60,8);feed(hitch,8,1);feed(hitch,60,5);
 assert.equal(hitch.snapshot().scale,1);assert.equal(hitch.snapshot().shadows,true);
});
test('manual modes do not react to frame rate and mobile starts light',()=>{
 const q=createAdaptiveQuality({coarse:true});
 assert.equal(q.snapshot().scale,1.5);assert.equal(q.snapshot().shadows,false);
 q.setMode('quality');assert.equal(q.snapshot().scale,1);assert.equal(q.snapshot().shadows,true);
 assert.equal(feed(q,5,60),0);
 q.setMode('light');assert.equal(q.snapshot().scale,1.75);
 assert.equal(q.snapshot().shadows,false);assert.equal(feed(q,90,60),0);
 q.setMode('auto');assert.equal(q.snapshot().scale,1.5);
 assert.equal(q.sample(NaN,.5),false);assert.equal(q.sample(25,.5,false),false);
});
test('gardeners pause for tending, turn and remain within their assigned plots',()=>{
 for(const phase of [0,2,4])for(let t=0;t<120;t+=.125){
  const a=gardenerRoutine(t,phase,1.5),b=gardenerRoutine(t+.01,phase,1.5);
  assert.ok(Number.isFinite(a.heading));assert.ok(Math.abs(a.offsetX)<=1.50001);
  assert.ok(Math.abs(a.offsetZ)<=.121);assert.ok(a.tending>=0&&a.tending<=1);
  assert.ok(Math.abs(b.offsetX-a.offsetX)<.05);
 }
 assert.equal(gardenerRoutine(10,0,1).walking,false);
 assert.ok(gardenerRoutine(10,0,1).tending>.8);
 assert.equal(gardenerRoutine(5,0,1).walking,true);
});
