import test from 'node:test';import assert from 'node:assert/strict';import {decodeRecorderDataURL} from './live-av.mjs';
test('recorded WebM bytes survive MIME codec lists containing a comma',()=>{
 const bytes=Buffer.from([0x1a,0x45,0xdf,0xa3,0,1,2,255]);
 for(const type of ['video/webm','video/webm;codecs=vp8,opus'])assert.deepEqual(decodeRecorderDataURL('data:'+type+';base64,'+bytes.toString('base64')),bytes);
 assert.throws(()=>decodeRecorderDataURL('data:video/webm,invalid'),/boundary/);
});
