const PATCHES=Object.freeze([
 {id:'sheep-west-meadow',kind:'sheep',x:-46,z:-5,phase:.2,range:1.25},
 {id:'sheep-east-meadow',kind:'sheep',x:-42,z:-5,phase:2.4,range:1.2},
 {id:'rabbit-west-meadow',kind:'rabbit',x:-46,z:-1,phase:1.1,range:1.05},
 {id:'rabbit-east-meadow',kind:'rabbit',x:-42,z:-1,phase:3.2,range:1.1}
]);
export function faunaRoutine(seconds,phase,range,kind='sheep',hour=12){
 const resting=hour<5||hour>=21,pace=resting?.08:kind==='rabbit'?.42:.16,t=seconds*pace+phase,scale=resting?.13:1;
 return {offsetX:Math.sin(t)*range*scale,offsetZ:Math.sin(t*.73+phase)*range*.55*scale,
 heading:Math.atan2(Math.cos(t)*pace*range,Math.cos(t*.73+phase)*pace*range*.4),
 grazing:resting?.16:kind==='sheep'?.5+.5*Math.sin(t*1.65):.12+.12*Math.sin(t*2.1),
 hop:resting||kind!=='rabbit'?0:Math.pow(Math.max(0,Math.sin(t*2.65)),10)*.18,
 bodyBob:kind==='sheep'?Math.sin(t*2)*.018:0,resting,activity:resting?'Rest':kind==='sheep'?'Graze':'Forage'};
}
function paint(B,mesh,hex){const c=B.Color3.FromHexString(hex),count=mesh.getTotalVertices(),colors=new Float32Array(count*4);for(let i=0;i<count;i++){colors[i*4]=c.r;colors[i*4+1]=c.g;colors[i*4+2]=c.b;colors[i*4+3]=1;}mesh.setVerticesData(B.VertexBuffer.ColorKind,colors,false,4);}
export function createAmbientFauna(B,scene,{heightAt=(x,z)=>0,shadows=null,patches=PATCHES}={}){
 const material=new B.StandardMaterial('Shire fauna vertex colours',scene);
 material.diffuseColor=B.Color3.White();material.specularColor=new B.Color3(.025,.025,.025);material.useVertexColors=true;
 function build(kind){
  const parts=[],add=(name,pos,scale,color)=>{const m=B.MeshBuilder.CreateSphere(name,{diameter:1,segments:8},scene);m.position.set(...pos);m.scaling.set(...scale);m.material=material;m.isPickable=false;paint(B,m,color);parts.push(m);};
  const leg=(name,pos,diameter,height,color)=>{const m=B.MeshBuilder.CreateCylinder(name,{diameter,height,tessellation:6},scene);m.position.set(...pos);m.material=material;m.isPickable=false;paint(B,m,color);parts.push(m);};
  if(kind==='sheep'){
   add('sheep fleece body',[0,.47,0],[.88,.58,.62],'#e7dfca');
   for(const [x,y,z] of [[-.34,.68,0],[-.12,.79,-.12],[.15,.78,-.1],[.36,.68,.02],[0,.72,.2],[-.2,.57,-.25]])add('sheep wool curl',[x,y,z],[.32,.3,.32],'#f0e8d6');
   add('sheep head',[.43,.68,0],[.28,.3,.25],'#51473d');add('sheep muzzle',[.56,.57,-.13],[.17,.13,.15],'#8c7964');
   add('sheep ear left',[.29,.77,-.2],[.17,.075,.09],'#51473d');add('sheep ear right',[.29,.77,.2],[.17,.075,.09],'#51473d');
   add('sheep tail',[-.5,.52,0],[.18,.18,.18],'#e7dfca');
   for(const [x,z] of [[-.28,-.2],[-.28,.2],[.28,-.2],[.28,.2]])leg('sheep leg',[x,.16,z],.075,.32,'#51473d');
  }else{
   add('rabbit body',[0,.35,0],[.56,.33,.38],'#96714d');add('rabbit hind haunch',[-.2,.39,.02],[.34,.31,.34],'#a9825b');
   add('rabbit head',[.28,.63,0],[.25,.24,.23],'#96714d');add('rabbit muzzle',[.4,.55,-.12],[.13,.1,.13],'#c4a47c');
   add('rabbit left ear',[.19,.93,-.08],[.09,.36,.075],'#96714d');add('rabbit right ear',[.35,.93,.08],[.09,.36,.075],'#96714d');
   add('rabbit tail',[-.37,.46,0],[.16,.16,.16],'#e7dfca');
   for(const [x,z] of [[-.19,-.15],[-.19,.15],[.2,-.13],[.2,.13]])leg('rabbit leg',[x,.13,z],.07,.24,'#6c503b');
  }
  const mesh=B.Mesh.MergeMeshes(parts,true,true,undefined,false,false);
  if(!mesh)throw Error('Unable to assemble '+kind+' meadow mesh');
  mesh.name='shared '+kind+' meadow mesh';mesh.material=material;mesh.isPickable=false;mesh.receiveShadows=true;mesh.alwaysSelectAsActiveMesh=true;
  return mesh;
 }
 const meshes={sheep:build('sheep'),rabbit:build('rabbit')},groups={sheep:[],rabbit:[]};
 for(const patch of patches)groups[patch.kind].push({...patch,scale:patch.kind==='sheep'?1:.78});
 const animals=[];
 for(const kind of ['sheep','rabbit']){
  const group=groups[kind],mesh=meshes[kind],matrices=new Float32Array(group.length*16);
  group.forEach((p,index)=>{const position=new B.Vector3(p.x,heightAt(p.x,p.z),p.z),matrix=B.Matrix.Compose(new B.Vector3(p.scale,p.scale,p.scale),B.Quaternion.Identity(),position);matrix.copyToArray(matrices,index*16);animals.push({...p,index,mesh,home:{x:p.x,z:p.z},activity:'Idle'});});
  mesh.thinInstanceSetBuffer('matrix',matrices,16,true);mesh.thinInstanceCount=group.length;shadows?.addShadowCaster(mesh);
 }
 function update(poses){for(const animal of animals){const pose=poses.get(animal.id);if(!pose)continue;const x=animal.home.x+pose.offsetX,z=animal.home.z+pose.offsetZ,position=new B.Vector3(x,heightAt(x,z)+pose.bodyBob+pose.hop,z),rotation=B.Quaternion.RotationYawPitchRoll(pose.heading,animal.kind==='sheep'?pose.grazing*.035:pose.hop*.12,0),matrix=B.Matrix.Compose(new B.Vector3(animal.scale,animal.scale,animal.scale),rotation,position);animal.mesh.thinInstanceSetMatrixAt(animal.index,matrix,false);animal.activity=pose.activity;}for(const mesh of Object.values(meshes))mesh.thinInstanceBufferUpdated('matrix');}
 return {meshes:Object.values(meshes),animals,update,dispose(){for(const mesh of Object.values(meshes))mesh.dispose();material.dispose();}};
}
