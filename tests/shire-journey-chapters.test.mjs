import test from 'node:test';
import assert from 'node:assert/strict';
import {act,freshState,restoreState,talk,objective,nearestInteractable} from '../dist/simulation.mjs';
function partyReady(){const s=freshState();act(s,'greet-wizard');act(s,'accept');act(s,'skip-apples');act(s,'finish');act(s,'start-party');assert.equal(act(s,'party-finalize'),true);return s;}
test('F1-02 Ring investigation, Gandalf explanation, Sam supplies and Shire departure are ordered and saved',()=>{
 const s=partyReady();assert.equal(s.storyChapterId,'F1-02');assert.equal(s.canonicalOutcomeFlags.ringPassed,true);
 assert.equal(act(s,'explain-ring'),false);assert.equal(act(s,'pack-supplies'),false);
 assert.equal(act(s,'investigate-ring'),true);assert.equal(act(s,'explain-ring'),true);assert.equal(act(s,'pack-supplies'),true);
 assert.match(objective(s),/البوابة الشرقية/);assert.equal(act(s,'depart-shire'),true);assert.equal(s.storyChapterId,'F1-03');
 assert.equal(s.canonicalOutcomeFlags.frodoDeparted,true);assert.equal(restoreState(JSON.stringify(s)).storyChapterId,'F1-03');
});
test('F1-03 unlocks Buckland friends, ferry crossing and Bree in canonical order',()=>{
 const s=partyReady();act(s,'investigate-ring');act(s,'explain-ring');act(s,'pack-supplies');act(s,'depart-shire');
 assert.equal(talk(s,'merry'),true);assert.equal(s.companionsJoined,false);assert.equal(talk(s,'pippin'),true);assert.equal(s.companionsJoined,true);
 assert.equal(nearestInteractable(s,{x:94,z:-8})?.id,'brandywine-ferry');assert.equal(act(s,'reach-bree'),false);
 s.ferryCrossed=true;assert.equal(nearestInteractable(s,{x:142,z:-8})?.id,'bree-gate');assert.equal(act(s,'reach-bree'),true);
 assert.equal(s.storyChapterId,'F1-04');assert.equal(s.canonicalOutcomeFlags.hobbitsReachedBree,true);
 assert.equal(talk(s,'aragorn'),true);assert.equal(s.aragornMet,true);
 const restored=restoreState(JSON.stringify(s));assert.equal(restored.storyChapterId,'F1-04');assert.equal(restored.aragornMet,true);
});
test('Ring and party flags cannot be fabricated by skipping chapter transitions',()=>{
 const s=freshState();assert.equal(act(s,'depart-shire'),false);assert.equal(act(s,'reach-bree'),false);
 const corrupted={...s,storyChapterId:'F1-04',partyCompleted:true,frodoDeparted:true,companionsJoined:true,ferryCrossed:true,canonicalOutcomeFlags:{ringPassed:true,frodoDeparted:true,hobbitsReachedBree:false}};
 assert.equal(restoreState(JSON.stringify(corrupted)).storyChapterId,'F1-01');
});
