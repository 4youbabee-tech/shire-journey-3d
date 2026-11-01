import test from 'node:test';import assert from 'node:assert/strict';
import {BREE_POINTS as P,freshBree,restoreBree,breeInteraction,actBree} from '../dist/bree-state.mjs';
test('Bree lodging and warning require the physical route, original dialogue order and safe room',()=>{
 const s=freshBree();assert.equal(actBree(s,'bree-rest',P.room),false);assert.equal(actBree(s,'bree-enter',P.gate),false);
 assert.equal(actBree(s,'bree-enter',P.inn),true);assert.equal(actBree(s,'bree-strider',P.strider),false);
 assert.equal(actBree(s,'bree-keeper',P.keeper),true);assert.equal(actBree(s,'bree-strider',P.strider),true);assert.equal(actBree(s,'bree-rest',P.room),true);
 assert.equal(s.task,'rested');assert.equal(actBree(s,'bree-rest',P.room),false);assert.deepEqual(restoreBree(JSON.parse(JSON.stringify(s))),s);
 assert.equal(actBree(s,'bree-exit',P.exit),true);assert.equal(breeInteraction(s,P.east).id,'bree-east');
});
test('corrupt Bree locations and stages cannot bypass saved progression',()=>{for(const v of [null,{}, {location:'moria',task:'rested'},{location:'inn',task:'complete'}])assert.equal(restoreBree(v),null);});
