// Quaternius Ultimate Stylized Nature, CC0; local source preparation, never runtime downloads.
// Input glTFs have reviewed alpha-test leaves and resized 512/256px textures; heavy normal maps removed.
import {NodeIO} from '@gltf-transform/core';import {prune,dedup} from '@gltf-transform/functions';
import {mkdir} from 'node:fs/promises';
await mkdir('dist/assets/environment',{recursive:true});const io=new NodeIO();
for(const [src,name]of [['MapleTree_1','maple-a'],['MapleTree_3','maple-b'],['Grass_Small','grass'],['Flower_2_Clump','flowers']]){const d=await io.read('/tmp/shire-nature-source/'+src+'-reviewed.gltf');await d.transform(prune(),dedup());await io.write('dist/assets/environment/'+name+'.glb',d);}
