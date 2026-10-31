import test from 'node:test';import assert from 'node:assert/strict';import {createVillageFoley,VILLAGE_CLIPS} from '../dist/village-foley.mjs';
test('recorded world foley requires a gesture, reuses buffers, varies creaks and bounds simultaneous voices',async()=>{
 const old=globalThis.fetch,played=[];let fetches=0,decoded=0;class Node{gain={value:0};playbackRate={value:1};connect(){}disconnect(){}start(){played.push(this)}stop(){this.onended?.()}}
 const context={state:'suspended',createGain:()=>new Node(),createBufferSource:()=>new Node(),decodeAudioData:async()=>({id:decoded++})};globalThis.fetch=async()=>{fetches++;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(4)}};
 try{const f=createVillageFoley(context,{});await f.load();assert.equal(fetches,0);assert.equal(f.cue('door-open'),false);context.state='running';await f.load();await f.load();assert.equal(fetches,VILLAGE_CLIPS.length);assert.equal(decoded,9);assert.equal(f.snapshot.status,'decoded');
 assert.equal(f.cue('cart-creak'),true);assert.equal(f.cue('cart-creak'),true);assert.notEqual(played[0].buffer,played[1].buffer);f.cue('leather');f.cue('door-open');assert.equal(f.cue('book-page'),false,'voice count is capped');assert.equal(f.snapshot.voices,4);f.stop();assert.equal(f.snapshot.voices,0);assert.equal(f.cue('book-page'),true);assert.equal(decoded,9,'events reuse decoded samples');context.state='suspended';assert.equal(f.cue('door-close'),false);
 }finally{globalThis.fetch=old;}
});
