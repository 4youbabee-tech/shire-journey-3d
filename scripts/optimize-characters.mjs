// Reproduction helper, requires @gltf-transform/core and functions 4.2.1.
import {NodeIO} from '@gltf-transform/core';
import {prune,dedup,resample} from '@gltf-transform/functions';
const io=new NodeIO();
const keep=new Set(['Idle','Walking_A','Running_A','Interact','Cheer','Sit_Floor_Idle','Sit_Floor_Down','Sit_Floor_StandUp','PickUp']);
for(const [source,target] of [['Rogue','traveller'],['Mage','wizard']]){
 const doc=await io.read('/tmp/shire-'+source+'.glb');
 for(const a of doc.getRoot().listAnimations())if(!keep.has(a.getName()))a.dispose();
 for(const n of doc.getRoot().listNodes())if(/Knife|Crossbow|Throwable|Spellbook|Wand|2H_Staff/.test(n.getName()))n.dispose();
 if(source==='Mage'){
  // A continuous tapered beard surface attached to the authored head joint.
  // Follows all imported skeletal clips, never a detached runtime primitive.
  const positions=[],normals=[],indices=[],cols=12,rows=9;
  for(let row=0;row<=rows;row++){
   const t=row/rows,width=.265*(1-t)+.018;
   for(let col=0;col<=cols;col++){
    const u=col/cols*2-1;
    positions.push(u*width,.16-t*.73,.26+Math.sqrt(1-u*u)*(.13+.03*Math.sin(t*Math.PI)));
    normals.push(u*.35,0,1);
    if(row<rows&&col<cols){const a=row*(cols+1)+col,b=a+cols+1;indices.push(a,b,a+1,a+1,b,b+1);}
   }
  }
  const buffer=doc.getRoot().listBuffers()[0];
  const accessor=(type,array)=>doc.createAccessor().setType(type).setArray(array).setBuffer(buffer);
  const material=doc.createMaterial('silver grey beard').setBaseColorFactor([.66,.68,.61,1]).setRoughnessFactor(1).setMetallicFactor(0).setDoubleSided(true);
  const primitive=doc.createPrimitive().setAttribute('POSITION',accessor('VEC3',new Float32Array(positions))).setAttribute('NORMAL',accessor('VEC3',new Float32Array(normals))).setIndices(accessor('SCALAR',new Uint16Array(indices))).setMaterial(material);
  const beard=doc.createNode('Gandalf tapered silver beard').setMesh(doc.createMesh('beard surface').addPrimitive(primitive));
  doc.getRoot().listNodes().find(n=>n.getName()==='head').addChild(beard);
  const clothPositions=[],clothNormals=[],clothIndices=[],segments=24;
  for(let row=0;row<=4;row++)for(let col=0;col<=segments;col++){
   const t=row/4,a=col/segments*Math.PI*2,fold=1+.025*Math.cos(a*8);
   clothPositions.push(Math.cos(a)*(.43+t*.11)*fold,.46-t*.78,Math.sin(a)*(.36+t*.06)*fold);
   clothNormals.push(Math.cos(a),.12,Math.sin(a));
   if(row<4&&col<segments){const i=row*(segments+1)+col,j=i+segments+1;clothIndices.push(i,j,i+1,i+1,j,j+1);}
  }
  const cloth=doc.createPrimitive().setAttribute('POSITION',accessor('VEC3',new Float32Array(clothPositions))).setAttribute('NORMAL',accessor('VEC3',new Float32Array(clothNormals))).setIndices(accessor('SCALAR',new Uint16Array(clothIndices))).setMaterial(doc.createMaterial('weathered grey robe').setBaseColorFactor([.25,.29,.29,1]).setRoughnessFactor(1).setMetallicFactor(0).setDoubleSided(true));
  doc.getRoot().listNodes().find(n=>n.getName()==='hips').addChild(doc.createNode('Gandalf long folded robe').setMesh(doc.createMesh('robe surface').addPrimitive(cloth)));
 }
 await doc.transform(resample(),dedup(),prune());
 await io.write('dist/assets/characters/'+target+'.glb',doc);
}
