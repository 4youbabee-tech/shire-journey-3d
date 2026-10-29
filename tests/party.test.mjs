import test from 'node:test';
import assert from 'node:assert/strict';
import {PARTY_SECONDS,birthdayBeat} from '../dist/party.mjs';
import {PARTY_TREE,APPLES,act,collect,dialogue,freshState,nearestInteractable,objective,restoreState} from '../dist/simulation.mjs';

const throughPreparations=()=>{
 const s=freshState();
 assert.equal(act(s,'accept'),false);
 assert.equal(act(s,'greet-wizard'),true);assert.equal(act(s,'accept'),true);assert.equal(act(s,'basket'),true);
 for(const apple of APPLES)assert.equal(collect(s,apple.id,apple),true);
 assert.equal(act(s,'thank-sam'),true);assert.equal(act(s,'finish'),true);
 return s;
};
test('original party scene narration is bounded and ordered before departure',()=>{
 assert.equal(PARTY_SECONDS,14);assert.match(birthdayBeat(1),/الأصدقاء/);assert.match(birthdayBeat(5),/الألعاب/);assert.match(birthdayBeat(9),/بيلبو/);assert.match(birthdayBeat(14),/غادر بيلبو/);
});
test('party is gated to F1-01 preparation, can only finalize once and preserves canon',()=>{
 const s=freshState();assert.equal(act(s,'start-party'),false);assert.equal(act(s,'party-finalize'),false);
 const prepared=throughPreparations();assert.equal(prepared.partyStarted,false);
 const near=nearestInteractable(prepared,PARTY_TREE);assert.equal(near.id,PARTY_TREE.id);
 assert.equal(act(prepared,'party-finalize'),false);
 assert.equal(act(prepared,'start-party'),true);assert.equal(act(prepared,'start-party'),false);
 assert.equal(restoreState(JSON.stringify(prepared)).partyStarted,true,'resume intermediate cutscene');
 assert.equal(act(prepared,'party-finalize'),true);
 assert.equal(act(prepared,'party-finalize'),false);
 assert.equal(prepared.partyCompleted,true);assert.equal(prepared.ringPassed,true);assert.equal(prepared.bilboGone,true);
 assert.equal(nearestInteractable(prepared,PARTY_TREE)?.id,undefined);
 assert.ok(!nearestInteractable(prepared,{x:8,z:7}), 'Bilbo is absent after leaving');
 assert.match(dialogue(prepared,'frodo').text,/خاتم/);
 assert.match(objective(prepared),/فرودو/);
 assert.deepEqual(restoreState(JSON.stringify(prepared)),prepared);
});
test('existing 0.4.0 legacy saves remain valid and can attend the birthday party',()=>{
 const old={version:1,stage:5,apples:APPLES.map(a=>a.id),visited:['bilbo','sam'],position:{x:0,z:5},completed:true,insideVisited:true,memories:[]};
 const restored=restoreState(JSON.stringify(old));
 assert.equal(restored.gandalfMet,true);assert.equal(restored.partyStarted,false);
 assert.equal(act(restored,'start-party'),true);assert.equal(act(restored,'party-finalize'),true);
 assert.equal(restored.ringPassed,true);
});
