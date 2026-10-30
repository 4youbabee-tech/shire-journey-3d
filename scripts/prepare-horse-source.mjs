// Source: Quaternius Ultimate Animated Animals, Horse.gltf, explicit CC0 license.
import {NodeIO} from '@gltf-transform/core';import {prune,dedup,resample} from '@gltf-transform/functions';
const io=new NodeIO(),doc=await io.read('/tmp/shire-Horse.gltf');
for(const a of doc.getRoot().listAnimations())if(!['Idle','Walk','Eating'].includes(a.getName()))a.dispose();
await doc.transform(resample(),dedup(),prune());await io.write('dist/assets/characters/horse.glb',doc);
