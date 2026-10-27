import assert from 'node:assert/strict';
import test from 'node:test';
import {replyToCharacter,STORY_WINDOW} from '../dist/conversation.mjs';
const fresh=()=>({stage:0,apples:[],completed:false,memories:[]});
test('Arabic character conversations are gated to introductory chapter and are original',()=>{
 assert.equal(STORY_WINDOW.id,'F1-01');
 for(const npc of ['bilbo','sam','gandalf','frodo']){
  const state=fresh();for(const text of ['مرحبا','متى حفلة عيد ميلاد بيلبو','خبرني عن الخاتم','أين الطريق','كيف أساعدكم؟']){
   const response=replyToCharacter(state,npc,text);
   assert.ok(response.text.length>20);assert.equal(response.storyWindow,'F1-01');
   assert.equal(response.provenance,'ORIGINAL-GAME');
  }
  assert.equal(state.memories.length,5);
  const repeat=replyToCharacter(state,npc,'خبرني عن الخاتم');assert.equal(repeat.remembered,true);
  assert.ok(repeat.text.startsWith('كما قلت لك'));
 }
});
test('conversation memory stays small and no private free-text is saved',()=>{
 const state=fresh();for(let i=0;i<35;i++)replyToCharacter(state,'sam','أين الطريق يا صديقي '+i);
 assert.equal(state.memories.length,16);assert.ok(state.memories.every(x=>Object.keys(x).sort().join(',')==='id,topic'));
 assert.equal(replyToCharacter(state,'invalid','hello').topic,'invalid');
});
test('dialogue responds to the actual side-activity stage without touching canon',()=>{
 const state=fresh();state.stage=2;state.apples=['apple-0','apple-1'];
 assert.match(replyToCharacter(state,'sam','أين التفاح؟').text,/2 من ثلاث/);
 assert.equal(state.stage,2);
 assert.equal(replyToCharacter(state,'frodo','الخاتم').storyWindow,'F1-01');
});