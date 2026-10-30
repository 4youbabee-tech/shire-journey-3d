import test from 'node:test';
import assert from 'node:assert/strict';
import '../dist/vendor/babylon.js';
import {createClipMixer} from '../dist/characters.mjs';
const B=globalThis.BABYLON;
function fixture(){
 const engine=new B.NullEngine(),scene=new B.Scene(engine),target={pose:0};
 function clip(name,value){const a=new B.Animation(name,'pose',30,B.Animation.ANIMATIONTYPE_FLOAT,B.Animation.ANIMATIONLOOPMODE_CYCLE);a.setKeys([{frame:0,value},{frame:30,value}]);const group=new B.AnimationGroup(name,scene);group.addTargetedAnimation(a,target);return group;}
 return {engine,scene,clip,mixer:createClipMixer(),dispose(){scene.dispose();engine.dispose();}};
}
const weight=g=>g.animatables[0]?.weight||0;
test('interrupting walk/talk fades retains the outgoing pose and normalized weights',()=>{
 const f=fixture();try{const idle=f.clip('Idle',0),walk=f.clip('Walk',1),talk=f.clip('Talk',2),m=f.mixer;
 m.select(idle);m.select(walk);m.update(.06);
 assert.ok(Math.abs(weight(idle)-.75)<1e-6);assert.ok(Math.abs(weight(walk)-.25)<1e-6);
 m.select(talk);assert.equal(idle.isPlaying,true,'Interrupted outgoing clip must not abruptly disappear');
 assert.ok(Math.abs(weight(idle)-.75)<1e-6);
 m.update(.06);assert.ok(Math.abs(weight(idle)+weight(walk)+weight(talk)-1)<1e-6);
 m.select(idle);m.update(.24);assert.equal(m.activeCount,1);assert.equal(weight(idle),1);assert.equal(walk.isPlaying,false);assert.equal(talk.isPlaying,false);
 }finally{f.dispose();}
});
test('distance pause resumes one-shot rise without changing its loop setting',()=>{
 const f=fixture();try{const rise=f.clip('Rise',1),m=f.mixer;m.select(rise,{loop:false});
 assert.equal(rise.loopAnimation,false);m.setPaused(true);assert.equal(rise.isPlaying,false);
 m.setPaused(false);assert.equal(rise.isPlaying,true);assert.equal(rise.loopAnimation,false);
 rise.stop();m.setPaused(true);m.setPaused(false);assert.equal(rise.isPlaying,false,'A completed one-shot must remain complete');
 }finally{f.dispose();}
});
test('paused fades remain stable and repeated distance checks do not resume clips',()=>{
 const f=fixture();try{const idle=f.clip('Idle',0),walk=f.clip('Walk',1),m=f.mixer;m.select(idle);m.select(walk);m.update(.08);
 const before=weight(walk);m.setPaused(true);m.setPaused(true);m.update(20);assert.equal(weight(walk),before);assert.equal(walk.isPlaying,false);
 m.setPaused(false);m.update(.16);assert.equal(m.activeCount,1);assert.equal(weight(walk),1);assert.equal(walk.loopAnimation,true);
 }finally{f.dispose();}
});
