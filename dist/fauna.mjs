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
 const sourceParts=[],animals=[];
 function primitive(name,position,scale,color,kindParts){const m=B.MeshBuilder.CreateSphere(name,{diameter:1,segments:8},scene);m.position.set(...position);m.scaling.set(...scale);m.material=material;m.isPickable=false;paint(B,m,color);kindParts.push(m);sourceParts.push(m);}
 function cylinder(name,position,diameter,height,color,kindParts){const m=B.MeshBuilder.CreateCylinder(name,{diameter,height,tessellation:6},scene);m.position.set(...position);m.material=material;m.isPickable=false;paint(B,m,color);kindParts.push(m);sourceParts.push(m);}
 for(const p of patches){
  const groupParts=[],baseY=heightAt(p.x,p.z);
  const add=(name,pos,scale,color)=>primitive(p.id+' '+name,[p.x+pos[0],baseY+pos[1],p.z+pos[2]],scale,color,groupParts);
  const leg=(name,pos,diameter,height,color)=>cylinder(p.id+' '+name,[p.x+pos[0],baseY+pos[1],p.z+pos[2]],diameter,height,color,groupParts);
  if(p.kind==='sheep'){
   add('fleece body',[0,.47,0],[.88,.58,.62],'#e7dfca');
   for(const [x,y,z] of [[-.34,.68,0],[-.12,.79,-.12],[.15,.78,-.1],[.36,.68,.02],[0,.72,.2],[-.2,.57,-.25]])add('wool curl',[x,y,z],[.32,.3,.32],'#f0e8d6');
   add('head',[.43,.68,0],[.28,.3,.25],'#51473d');add('muzzle',[.56,.57,-.13],[.17,.13,.15],'#8c7964');
   add('ear left',[.29,.77,-.2],[.17,.075,.09],'#51473d');add('ear right',[.29,.77,.2],[.17,.075,.09],'#51473d');
   add('tail',[-.5,.52,0],[.18,.18,.18],'#e7dfca');
   for(const [x,z] of [[-.28,-.2],[-.28,.2],[.28,-.2],[.28,.2]])leg('leg',[x,.16,z],.075,.32,'#51473d');
  }else{
   add('body',[0,.35,0],[.56,.33,.38],'#96714d');add('hind haunch',[-.2,.39,.02],[.34,.31,.34],'#a9825b');
   add('head',[.28,.63,0],[.25,.24,.23],'#96714d');add('muzzle',[.4,.55,-.12],[.13,.1,.13],'#c4a47c');
   add('left ear',[.19,.93,-.08],[.09,.36,.075],'#96714d');add('right ear',[.35,.93,.08],[.09,.36,.075],'#96714d');
   add('tail',[-.37,.46,0],[.16,.16,.16],'#e7dfca');
   for(const [x,z] of [[-.19,-.15],[-.19,.15],[.2,-.13],[.2,.13]])leg('leg',[x,.13,z],.07,.24,'#6c503b');
  }
  const vertexCount=groupParts.reduce((n,m)=>n+m.getTotalVertices(),0);
  animals.push({...p,home:{x:p.x,z:p.z},baseY,startVertex:sourceParts.slice(0,-groupParts.length).reduce((n,m)=>n+m.getTotalVertices(),0),vertexCount,activity:'Idle'});
 }
 const mesh=B.Mesh.MergeMeshes(sourceParts,true,true,undefined,false,false);
 if(!mesh)throw Error('Unable to merge Shire fauna into one draw call');
 mesh.name='single draw-call Shire meadow fauna';mesh.material=material;mesh.isPickable=false;mesh.receiveShadows=true;mesh.alwaysSelectAsActiveMesh=true;shadows?.addShadowCaster(mesh);
 const basePositions=mesh.getVerticesData(B.VertexBuffer.PositionKind).slice(),baseNormals=mesh.getVerticesData(B.VertexBuffer.NormalKind).slice();
 const positions=basePositions.slice(),normals=baseNormals.slice();
 mesh.setVerticesData(B.VertexBuffer.PositionKind,positions,true,false);mesh.setVerticesData(B.VertexBuffer.NormalKind,normals,true,false);
 function update(poses){
  for(const animal of animals){
   const pose=poses.get(animal.id);if(!pose)continue;
   const x=animal.home.x+pose.offsetX,z=animal.home.z+pose.offsetZ,y=heightAt(x,z)+pose.bodyBob+pose.hop;
   const c=Math.cos(pose.heading),s=Math.sin(pose.heading),scale=animal.kind==='sheep'?1:.78;
   const start=animal.startVertex,end=start+animal.vertexCount;
   for(let i=start;i<end;i++){
    const k=i*3,bx=basePositions[k]-animal.home.x,bz=basePositions[k+2]-animal.home.z,by=basePositions[k+1]-animal.baseY;
    positions[k]=x+(bx*c+bz*s)*scale;positions[k+1]=y+by*scale;positions[k+2]=z+(-bx*s+bz*c)*scale;
    const nx=baseNormals[k],nz=baseNormals[k+2];normals[k]=nx*c+nz*s;normals[k+1]=baseNormals[k+1];normals[k+2]=-nx*s+nz*c;
   }
   animal.activity=pose.activity;
  }
  mesh.updateVerticesData(B.VertexBuffer.PositionKind,positions,false,false);
  mesh.updateVerticesData(B.VertexBuffer.NormalKind,normals,false,false);
 }
 return {mesh,animals,update,dispose(){mesh.dispose();material.dispose();}};
}
