/* Offline test: node tests/test_shire_living_v2.js */
'use strict';
const assert=require('node:assert/strict');
const s=require('../src/shire-living-v2.js');
const cases=[
 ['start date',()=>assert.deepEqual([s.clock(0).day,s.clock(0).monthName,s.clock(0).hour],[22,'Halimath',6])],
 ['60 real seconds',()=>assert.equal(s.clock(60).hour,7)],
 ['24 real minutes',()=>assert.equal(s.clock(1440).day,23)],
 ['month rollover',()=>assert.deepEqual([s.clock(1440*10).monthName,s.clock(1440*10).day],['Winterfilth',2])],
 ['dawn interpolation',()=>assert.ok(s.nightLevel(0)>.4&&s.nightLevel(0)<.6)],
 ['weather deterministic',()=>assert.deepEqual(s.weatherAt(1300),s.weatherAt(1300))],
 ['memory recording',()=>{const w=s.newWorld();assert.equal(s.remember(w,'Sam','story_help',0,7),true)}],
 ['memory recall',()=>{const w=s.newWorld();s.remember(w,'Sam','story_help',0,7);assert.equal(s.recall(w,'Sam',1440*6).topic,'story_help')}],
 ['memory expiry',()=>{const w=s.newWorld();s.remember(w,'Sam','story_help',0,7);assert.equal(s.recall(w,'Sam',1440*8),null)}],
 ['save roundtrip',()=>{const w=s.newWorld();s.remember(w,'Sam','story_help',0,7);assert.equal(s.restoreWorld(JSON.parse(JSON.stringify(w))).memories.Sam.length,1)}],
 ['malformed save topic dropped',()=>assert.deepEqual(s.restoreWorld({memories:{Sam:[{topic:'evil',dayIndex:0}]}}).memories.Sam,[])]
];
let passed=0;
for(const [title,fn] of cases){try{fn();console.log('PASS '+title);passed++}catch(error){console.error('FAIL '+title,error.message);process.exitCode=1}}
console.log(passed+'/'+cases.length+' passed');
