import {readFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import './prepare-characters.mjs';
import './prepare-audio.mjs';
import './prepare-environment.mjs';
const require=createRequire(import.meta.url);
const source=require.resolve('babylonjs');
const data=readFileSync(source);
const hash=createHash('sha256').update(data).digest('hex');
if(hash!=="205cf307e8e08e94ad7f2019ac355f25fd0f8b31e7de0945af359bc51582f6a8")throw new Error('Babylon.js engine checksum mismatch');
mkdirSync(new URL('../dist/vendor/',import.meta.url),{recursive:true});
copyFileSync(source,new URL('../dist/vendor/babylon.js',import.meta.url));
console.log('Prepared Babylon.js 9.32.1; SHA256 '+hash);


const loader=require.resolve('babylonjs-loaders');
if(createHash('sha256').update(readFileSync(loader)).digest('hex')!=='9aa6fa5de75bfeb94c8820a7459a80867d7dc6893519ff115c579d7abed9147e')throw Error('GLTF loader checksum mismatch');
copyFileSync(loader,new URL('../dist/vendor/babylonjs.loaders.js',import.meta.url));

