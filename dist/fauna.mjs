// Low-cost, original Shire fauna. Animals stay in four bounded meadow patches and never own quests or collisions.
const PATCHES=Object.freeze([
 {id:'sheep-west-meadow',kind:'sheep',x:-43,z:-39,phase:.2,range:2.1},
 {id:'sheep-north-meadow',kind:'sheep',x:43,z:45,phase:2.4,range:1.9},
 {id:'rabbit-west-meadow',kind:'rabbit',x:-44,z:34,phase:1.1,range:1.55},
 {id:'rabbit-east-meadow',kind:'rabbit',x:44,z:-40,phase:3.2,range:1.65}
]);
export function faunaRoutine(seconds,phase,range,kind='sheep',hour=12){
 const resting=hour<5||hour>=21,pace=resting?.08:kind==='rabbit'?.42:.16,t=seconds*pace+phase,activityScale=resting?.13:1;
 const offsetX=Math.sin(t)*range*activityScale,offsetZ=Math.sin(t*.73+phase)*range*.55*activityScale;
 const dx=Math.cos(t)*pace*range,dz=Math.cos(t*.73+phase)*pace*range*.4;
 const grazing=resting?.16:kind==='sheep'?.5+.5*Math.sin(t*1.65):.12+.12*Math.sin(t*2.1);
 const hop=resting||kind!=='rabbit'?0:Math.pow(Math.max(0,Math.sin(t*2.65)),10)*.18;
 return {offsetX,offsetZ,heading:Math.atan2(dx,dz),grazing,hop,bodyBob:kind==='sheep'?Math.sin(t*2)*.018:hop,resting,activity:resting?'Rest':kind==='sheep'?'Graze':'Forage'};
}
function sphere(B,scene,name,material,position,scale,segments=8){
 const mesh=B.MeshBuilder.CreateSphere(name,{diameter:1,segments},scene);
 mesh.material=material;mesh.position.set(...position);mesh.scaling.set(...scale);mesh.isPickable=false;mesh.receiveShadows=true;return mesh;
}
function cylinder(B,scene,name,material,position,diameter,height){
 const mesh=B.MeshBuilder.CreateCylinder(name,{diameter,height,tessellation:6},scene);
 mesh.material=material;mesh.position.set(...position);mesh.isPickable=false;mesh.receiveShadows=true;return mesh;
}
function merge(B,parts,parent,name){
 const mesh=parts.length===1?parts[0]:B.Mesh.MergeMeshes(parts,true,true,undefined,false,false);
 if(!mesh)throw Error('Unable to assemble ambient animal: '+name);
 mesh.name=name;mesh.parent=parent;mesh.isPickable=false;mesh.receiveShadows=true;return mesh;
}
export function createAmbientFauna(B,scene,{heightAt=(x,z)=>0,shadows=null,patches=PATCHES}={}){
 const material=(name,hex)=>{const m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(hex);m.specularColor=new B.Color3(.025,.025,.025);return m;};
 const wool=material('Shire sheep warm fleece','#e7dfca'),sheepFace=material('Shire sheep face and legs','#51473d'),rabbitFur=material('Shire rabbit russet fur','#96714d'),rabbitLegs=material('Shire rabbit feet','#6c503b');
 const animals=[];
 for(const patch of patches){
  const root=new B.TransformNode(patch.id+' ambient animal',scene),bodyParts=[],headParts=[],legParts=[];
  const body=(name,mat,pos,scale)=>sphere(B,scene,name,mat,pos,scale,8);
  const leg=(name,mat,pos,diameter,height)=>cylinder(B,scene,name,mat,pos,diameter,height);
  if(patch.kind==='sheep'){
   bodyParts.push(body(patch.id+' fleece body',wool,[0,.48,0],[.92,.58,.62]));
   for(const [x,y,z] of [[-.34,.68,0],[-.12,.79,-.12],[.15,.78,-.1],[.36,.68,.02],[0,.72,.2]])bodyParts.push(body(patch.id+' fleece curl',wool,[x,y,z],[.34,.31,.34]));
   bodyParts.push(body(patch.id+' fleece tail',wool,[-.5,.52,0],[.2,.2,.2]));
   headParts.push(body(patch.id+' sheep head',sheepFace,[0,0,0],[.27,.29,.25]));
   headParts.push(body(patch.id+' sheep muzzle',sheepFace,[.1,-.07,-.14],[.16,.13,.15]));
   headParts.push(body(patch.id+' sheep ear left',sheepFace,[-.2,.09,0],[.13,.075,.08]),body(patch.id+' sheep ear right',sheepFace,[.2,.09,0],[.13,.075,.08]));
   for(const [x,z] of [[-.27,-.2],[-.27,.2],[.27,-.2],[.27,.2]])legParts.push(leg(patch.id+' sheep leg',sheepFace,[x,.16,z],.075,.32));
  }else{
   bodyParts.push(body(patch.id+' rabbit body',rabbitFur,[0,.34,0],[.48,.3,.34]));
   bodyParts.push(body(patch.id+' rabbit tail',rabbitFur,[-.31,.4,.02],[.15,.15,.15]));
   headParts.push(body(patch.id+' rabbit head',rabbitFur,[0,0,0],[.24,.24,.22]));
   headParts.push(body(patch.id+' rabbit muzzle',rabbitFur,[.1,-.07,-.12],[.12,.1,.12]));
   headParts.push(body(patch.id+' rabbit ear left',rabbitFur,[-.09,.25,0],[.085,.29,.07]),body(patch.id+' rabbit ear right',rabbitFur,[.09,.25,0],[.085,.29,.07]));
   for(const [x,z] of [[-.14,-.12],[-.14,.12],[.14,-.12],[.14,.12]])legParts.push(leg(patch.id+' rabbit leg',rabbitLegs,[x,.11,z],.065,.22));
  }
  const bodyMesh=merge(B,bodyParts,root,patch.id+' body');
  const headPivot=new B.TransformNode(patch.id+' head pivot',scene);headPivot.parent=root;headPivot.position.set(patch.kind==='sheep'?.4:.23,patch.kind==='sheep'?.62:.55,0);
  const headMesh=merge(B,headParts,headPivot,patch.id+' head');
  const legsMesh=merge(B,legParts,root,patch.id+' legs');
  root.position.set(patch.x,heightAt(patch.x,patch.z),patch.z);
  for(const mesh of [bodyMesh,headMesh,legsMesh])shadows?.addShadowCaster(mesh);
  animals.push({...patch,root,bodyMesh,headPivot,headMesh,legsMesh,home:{x:patch.x,z:patch.z},activity:'Idle'});
 }
 return {animals,materials:{wool,sheepFace,rabbitFur,rabbitLegs},dispose(){for(const a of animals)a.root.dispose(false,true);for(const m of [wool,sheepFace,rabbitFur,rabbitLegs])m.dispose();}};
}
