// Shire Journey 3D — Node 22 regression tests for the v2 offline living-world addon.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const system=require('../src/shire-living-v2.js');
const root=path.resolve(__dirname,'..');
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('Shire clock starts 22 Halimath 3018 at 06:00',()=>{
 const c=system.clock(0);
 assert.equal(c.year,3018);assert.equal(c.day,22);
 assert.equal(c.monthName,'Halimath');assert.equal(c.hour,6);
});
test('24 real minutes equals a Shire day',()=>{
 assert.equal(system.clock(60).hour,7);
 assert.equal(system.clock(1440).day,23);
 assert.equal(system.clock(10*1440).monthName,'Winterfilth');
 assert.equal(system.clock(10*1440).day,2);
});
test('Dawn, sunset and night transitions',()=>{
 assert(system.nightLevel(0)>.4&&system.nightLevel(0)<.6);
 assert.equal(system.nightLevel(360),0);
 assert.equal(system.nightLevel(960),1);
});
test('Weather is deterministic, bounded and interpolated',()=>{
 const a=system.weatherAt(1501);
 assert.deepEqual(a,system.weatherAt(1501));
 assert(a.intensity>=0&&a.intensity<=1);
 assert(a.visibility>=.28&&a.visibility<=1);
 assert(a.blend>=0&&a.blend<=1);
});
test('NPC memory recall and age-based decay',()=>{
 const world=system.newWorld();
 assert(system.remember(world,'Sam','story_help',0,7));
 assert.equal(system.recall(world,'Sam',6*1440)?.topic,'story_help');
 assert.equal(system.recall(world,'Sam',8*1440),null);
 assert.equal(world.relationships.Sam.trust,53);
});
test('Memory persistence, sanitization and 55 NPCs',()=>{
 const world=system.newWorld();
 for(let i=0;i<55;i++)system.remember(world,'Villager '+i,'story_news',0,7);
 const saved=system.restoreWorld(JSON.parse(JSON.stringify(world)));
 assert.equal(Object.keys(saved.memories).length,55);
 saved.memories.Sam=[{topic:'restricted_ring_fact',dayIndex:0,importance:100}];
 assert.equal(system.restoreWorld(saved).memories.Sam.length,0);
});
test('Memory records bounded to 32 entries per NPC',()=>{
 const world=system.newWorld();
 for(let day=0;day<50;day++)
   system.remember(world,'Sam',day%2?'story_help':'story_news',day*1440,7);
 assert.equal(world.memories.Sam.length,32);
});
test('Runtime integrates with existing renderer and keeps story flags',()=>{
 let timer,walked=false;
 const game={state:{stage:0,played:0,zone:'outside',livingWorld:null},
  mode:'play',renderer:{night:0,fog:[.7,.8,.7],render(){return 42;}},save(){}};
 const root={__SHIRE__:game,setInterval(fn){timer=fn;return 1;},clearInterval(){},
  ambientNightLevel(){return .1;},livingPeriod(){return 'day';},
  villageRoutine(){return false;},approach(){walked=true;},
  freshState(){return {version:1,stage:0};},
  validateSave(raw){return {...raw};},loadState(s){game.state=s;return s;}};
 const doc={body:{appendChild(){}},createElement(){
  return {style:{},setAttribute(){},remove(){},textContent:''};
 },querySelector(){return null;}};
 system.attach(root,doc);
 assert(game.state.livingWorld);
 assert.equal(root.freshState().livingWorld.version,2);
 const normalized=root.validateSave({stage:0,played:90,version:1});
 assert.equal(normalized.livingWorld.version,2);
 const weatherTime=Array.from({length:100},(_,i)=>i*300+200)
   .find(t=>system.weatherAt(t).shelter);
 assert.notEqual(weatherTime,undefined);
 game.state.played=weatherTime;
 const npc={name:'Rowan',home:[0,0,0],pos:[8,0,9],activity:'walking'};
 root.villageRoutine(npc,.1);
 assert(walked,'rain changes real NPC navigation');
 const initialStage=game.state.stage;
 assert.equal(game.renderer.render([],0,false),42);
 assert.equal(game.state.stage,initialStage,'no canonical story flags modified');
 game.mode='dialogue';timer();
 assert(root.__SHIRE_LIVING_V2__.clock());
 root.__SHIRE_LIVING_V2__.stop();
});
test('Complete playable HTML embeds addon with no remote JS',()=>{
 const file=path.join(root,'builds','Shire-Journey-v2-Living-World.html');
 const html=fs.readFileSync(file,'utf8');
 assert(html.length>4000000,'existing detailed playable assets retained');
 assert(html.includes('const LIVING_DAY_SECONDS'),'existing NPC simulation retained');
 assert(html.includes('function npcStorySelect'),'existing dialogue system retained');
 assert(html.includes('ShireLivingV2'),'new extension included');
 assert(!/<script[^>]+\bsrc\s*=/.test(html),'no remote script dependency');
 let count=0;
 for(const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)){
   new vm.Script(match[1]);count++;
 }
 assert(count>=14);
});
console.log('ALL PASS: '+passed+' Shire World checks.');
