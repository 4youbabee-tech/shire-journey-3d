/* Run: node tests/living-v2.test.js */
'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const life=require('../src/shire-living-v2.js');
test('starts at 22 Halimath TA 3018 06:00',()=>{
 const d=life.clock(0);assert.equal(d.day,22);assert.equal(d.monthName,'Halimath');assert.equal(d.year,3018);assert.equal(d.hour,6);
});
test('day takes 1440 real seconds',()=>{assert.equal(life.clock(60).hour,7);assert.equal(life.clock(1440).day,23);});
test('month rollover',()=>{assert.equal(life.clock(1440*10).monthName,'Winterfilth');assert.equal(life.clock(1440*10).day,2);});
test('dawn and night darkness',()=>{assert.ok(life.nightLevel(0)>.4);assert.equal(life.nightLevel(960),1);});
test('weather seeded and deterministic',()=>assert.deepEqual(life.weatherAt(998),life.weatherAt(998)));
test('world restore',()=>assert.deepEqual(life.restoreWorld(life.newWorld()),life.newWorld()));
test('memory remembers and eventually fades',()=>{
 const world=life.newWorld();assert.ok(life.remember(world,'Sam','story_help',0,7));
 assert.equal(life.recall(world,'Sam',6*1440)?.topic,'story_help');
 assert.equal(life.recall(world,'Sam',8*1440),null);
});
test('invalid save topics ignored',()=>{
 const world=life.restoreWorld({memories:{Sam:[{topic:'invalid_secret',dayIndex:0}]}});
 assert.equal(world.memories.Sam.length,0);
});
