import {test} from 'node:test';
import assert from 'node:assert/strict';
import {portraitSVG,PORTRAIT_IDS} from '../dist/portraits.mjs';
test('all four original NPC portraits are complete, distinct, self-contained SVG',()=>{
 assert.deepEqual([...PORTRAIT_IDS].sort(),['bilbo','frodo','gandalf','sam']);
 const results=PORTRAIT_IDS.map(id=>portraitSVG(id));
 for(const svg of results){assert.ok(svg.startsWith('<svg '));assert.ok(svg.includes('viewBox="0 0 120 128"'));assert.ok(svg.length>1300);assert.ok(!/<script|https?:\/\//i.test(svg.replace('xmlns="http://www.w3.org/2000/svg"','')));}
 assert.equal(new Set(results).size,4);
 assert.equal(portraitSVG('__invalid'), '');
});