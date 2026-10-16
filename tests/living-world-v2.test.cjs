/* Original source tests; run: node tests/living-world-v2.test.cjs */
'use strict';
const assert=require('node:assert/strict');
const world=require('../src/shire-living-v2.js');
let pass=0;
function test(name,fn){fn();pass++;process.stdout.write('PASS '+name+'\n');}
test('Shire start 22 Halimath at 06:00',()=>{
  assert.equal(world.clock(0).day,22);
  assert.equal(world.clock(0).monthName,'Halimath');
  assert.equal(world.clock(0).hour,6);
});
test('24 real minutes advances one Shire day',()=>assert.equal(world.clock(1440).day,23));
test('hour advances in 60 real seconds',()=>assert.equal(world.clock(60).hour,7));
test('month rollover',()=>{
  assert.equal(world.clock(1440*9).day,1);
  assert.equal(world.clock(1440*9).monthName,'Winterfilth');
});
test('afternoon daylight',()=>assert.equal(world.nightLevel(360),0));
test('night darkness',()=>assert.equal(world.nightLevel(960),1));
test('deterministic offline weather',()=>assert.deepEqual(world.weatherAt(2000),world.weatherAt(2000)));
test('weather transitions bounded',()=>{
  for(let t=0;t<10000;t+=50){
    const w=world.weatherAt(t);
    assert.ok(w.intensity>=0&&w.intensity<=1);
    assert.ok(w.visibility>=0&&w.visibility<=1);
  }
});
test('remember conversation and recover after 6 days',()=>{
  const s=world.newWorld();
  assert.equal(world.remember(s,'Sam','story_help',0,7),true);
  assert.equal(world.recall(s,'Sam',1440*6).topic,'story_help');
  assert.equal(s.relationships.Sam.trust,53);
});
test('minor conversations expire',()=>{
  const s=world.newWorld();world.remember(s,'Tansy','story_news',0,3);
  assert.equal(world.recall(s,'Tansy',1440*3),null);
});
test('restored save includes NPC memory',()=>{
  const s=world.newWorld();world.remember(s,'Sam','story_help',0,7);
  assert.equal(world.restoreWorld(JSON.parse(JSON.stringify(s))).memories.Sam.length,1);
});
test('discard unapproved topics in imported saves',()=>{
  const s=world.restoreWorld({memories:{Sam:[{topic:'ring_secret',dayIndex:0,importance:100}]}});
  assert.equal(s.memories.Sam.length,0);
});
test('support 50 independent NPC records',()=>{
  const s=world.newWorld();
  for(let i=0;i<50;i++)world.remember(s,'Villager '+i,'story_news',i*5,3);
  assert.equal(Object.keys(world.restoreWorld(s).memories).length,50);
});
process.stdout.write('RESULT '+pass+'/13 passed\n');
