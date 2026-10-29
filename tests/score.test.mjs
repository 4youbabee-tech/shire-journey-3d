import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pastoralPhrase} from '../dist/score.mjs';
test('the original score has bounded note count, durations and safe schedule',()=>{
 for(let v=0;v<8;v++){
  const notes=pastoralPhrase(v);
  assert.equal(notes.length,24); // Four bars with bass, octave and four melody notes each.
  assert.ok(notes.every(n=>Number.isFinite(n.frequency)&&n.frequency>100&&n.frequency<1500));
  assert.ok(notes.every(n=>n.at>=0&&n.at<12&&n.at+n.duration<13));
  assert.ok(notes.every(n=>n.volume>0&&n.volume<=.05));
  assert.equal(notes[0].wave,'sine');
 }
 assert.notDeepEqual(pastoralPhrase(0),pastoralPhrase(1));
});
