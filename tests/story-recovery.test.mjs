import test from 'node:test';
import assert from 'node:assert/strict';
import {APPLES,PARTY_TREE,act,collect,dialogue,freshState,restoreState,objective,nearestInteractable} from '../dist/simulation.mjs';
const begin=()=>{const s=freshState();assert.equal(act(s,'accept'),false);assert.equal(act(s,'greet-wizard'),true);assert.equal(act(s,'accept'),true);return s;};
test('Gandalf opens the story and the orchard is optional',()=>{
 const s=begin();
 assert.ok(dialogue(s,'sam').options.some(([,id])=>id==='skip-apples'));
 assert.equal(act(s,'skip-apples'),true);assert.equal(s.stage,4);assert.equal(s.applesSkipped,true);assert.equal(s.apples.length,0);
 assert.deepEqual(restoreState(JSON.stringify(s)),s,'optional story choice survives reload');
 assert.equal(act(s,'finish'),true);assert.equal(nearestInteractable(s,PARTY_TREE)?.id,'party-tree');
 assert.equal(act(s,'start-party'),true);assert.equal(act(s,'party-finalize'),true);
 assert.equal(s.partyCompleted,true);assert.equal(s.ringPassed,true);assert.equal(s.bilboGone,true);
 assert.deepEqual(restoreState(JSON.stringify(s)),s);
});
test('real legacy stage-two save remains playable without being forced into apple mission',()=>{
 const old={version:1,stage:2,apples:[],visited:['bilbo','sam'],position:{x:3,z:4},completed:false};
 const saved=restoreState(JSON.stringify(old));
 assert.equal(saved.stage,2);assert.equal(saved.gandalfMet,true);
 assert.match(objective(saved),/اختياري/);
 assert.ok(dialogue(saved,'sam').options.some(([,id])=>id==='skip-apples'));
 assert.equal(act(saved,'skip-apples'),true);assert.equal(saved.stage,4);assert.equal(saved.applesSkipped,true);
 assert.match(dialogue(saved,'bilbo').text,/الحفلة/);
 assert.deepEqual(restoreState(JSON.stringify(saved)),saved);
 assert.equal(act(saved,'finish'),true);
});
test('original apple side errand still works and requires all three apples',()=>{
 const s=begin();assert.equal(act(s,'basket'),true);
 for(const apple of APPLES)assert.equal(collect(s,apple.id,apple),true);
 assert.equal(s.stage,3);assert.equal(s.applesSkipped,false);
 assert.equal(act(s,'thank-sam'),true);assert.equal(s.stage,4);
 assert.match(dialogue(s,'bilbo').text,/التفّاح/);
 assert.deepEqual(restoreState(JSON.stringify(s)),s);
});
test('corrupted skipped saves are rejected if skip flag is missing',()=>{
 const s=begin();assert.equal(act(s,'skip-apples'),true);
 const broken={...s,applesSkipped:false};
 assert.deepEqual(restoreState(JSON.stringify(broken)),freshState());
});
