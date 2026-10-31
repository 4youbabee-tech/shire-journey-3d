import test from 'node:test';import assert from 'node:assert/strict';import {freshState,dialogue,loreForState} from '../dist/simulation.mjs';
test('after-party choices and lore do not send the player to departed Bilbo or prepare a finished birthday',()=>{
 const s={...freshState(),stage:5,completed:true,partyCompleted:true,bilboGone:true,ringPassed:true};
 assert.doesNotMatch(dialogue(s,'sam').text,/هل زرت بيلبو|التحضيرات/);
 assert.match(loreForState(s,'frodo-lore'),/سافر/);assert.doesNotMatch(loreForState(s,'frodo-lore'),/نحضّر/);
 assert.doesNotMatch(loreForState(s,'gandalf-lore'),/فرحة الاحتفال/);assert.match(loreForState(s,'gandalf-lore'),/ما زال فرودو هنا/);
});
