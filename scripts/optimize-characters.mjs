// Reproduction helper, requires @gltf-transform/core and functions 4.2.1.
import {NodeIO} from '@gltf-transform/core';
import {prune,dedup,resample} from '@gltf-transform/functions';
const io=new NodeIO();
const keep=new Set(['Idle','Walking_A','Running_A','Interact','Cheer','Sit_Floor_Idle','Sit_Floor_Down','Sit_Floor_StandUp','Sit_Chair_Idle','PickUp']);
for(const [source,target] of [['Rogue','traveller'],['Mage','wizard']]){
 const doc=await io.read('/tmp/shire-'+source+'.glb');
 for(const a of doc.getRoot().listAnimations())if(!keep.has(a.getName()))a.dispose();
 for(const n of doc.getRoot().listNodes())if(/Knife|Crossbow|Throwable|Spellbook|Wand/.test(n.getName()))n.dispose();
 const head=doc.getRoot().listNodes().find(n=>n.getName()==='head');
 const headScale=source==='Mage'?.82:.83;head.setScale([headScale,headScale,headScale]);
 for(const animation of doc.getRoot().listAnimations())for(const channel of animation.listChannels())if(channel.getTargetNode()===head&&channel.getTargetPath()==='scale'){
  const sampler=channel.getSampler(),output=sampler.getOutput(),copy=sampler.clone().setOutput(output.clone().setArray(Float32Array.from(output.getArray(),v=>v*headScale)));animation.addSampler(copy);channel.setSampler(copy);
 }
 const headMesh=doc.getRoot().listNodes().find(n=>n.getName().endsWith('_Head'))?.getMesh();
 if(headMesh){
  for(const primitive of headMesh.listPrimitives()){
   const p=primitive.getAttribute('POSITION'),uv=primitive.getAttribute('TEXCOORD_0');if(!uv)continue;
   const a=p.getArray(),t=uv.getArray(),delta=new Float32Array(a.length),eyes=[];
   for(let i=0;i<p.getCount();i++)if(Math.floor(t[i*2]*8)===2&&Math.floor(t[i*2+1]*4)===0)eyes.push(i);
   for(const side of [-1,1]){const ids=eyes.filter(i=>a[i*3]*side>=0),center=ids.reduce((sum,i)=>sum+a[i*3+1],0)/Math.max(1,ids.length);for(const i of ids)delta[i*3+1]=(center-a[i*3+1])*.94;}
   const target=doc.createPrimitiveTarget('blink').setAttribute('POSITION',doc.createAccessor('eyelid closure').setType('VEC3').setArray(delta).setBuffer(doc.getRoot().listBuffers()[0]));
   primitive.addTarget(target);
  }
  headMesh.setWeights([0]);headMesh.setExtras({targetNames:['blink']});
 }
 if(source==='Mage'){
  const staffNode=doc.getRoot().listNodes().find(n=>n.getName()==='2H_Staff');
  if(staffNode){
   const positions=[],normals=[],indices=[],sides=8,segments=20;
   for(let i=0;i<=segments;i++){const t=i/segments,y=-.9+t*2.15,r=.04-.018*t,cx=.025*Math.sin(t*8)+(t>.83?(t-.83)*.45:0),cz=.025*Math.sin(t*5);for(let j=0;j<=sides;j++){const angle=j/sides*Math.PI*2;positions.push(cx+Math.cos(angle)*r,y,cz+Math.sin(angle)*r);normals.push(Math.cos(angle),0,Math.sin(angle));if(i<segments&&j<sides){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,b,a+1,a+1,b,b+1);}}}
   const buffer=doc.getRoot().listBuffers()[0],access=(type,array)=>doc.createAccessor().setType(type).setArray(array).setBuffer(buffer);
   const primitive=doc.createPrimitive().setAttribute('POSITION',access('VEC3',new Float32Array(positions))).setAttribute('NORMAL',access('VEC3',new Float32Array(normals))).setIndices(access('SCALAR',new Uint16Array(indices))).setMaterial(doc.createMaterial('natural crooked wooden staff').setBaseColorFactor([.24,.15,.075,1]).setRoughnessFactor(.98).setMetallicFactor(0));
   staffNode.setMesh(doc.createMesh('crooked wooden staff').addPrimitive(primitive));
  }
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
