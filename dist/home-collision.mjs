// Match the visible mound surfaces, while retaining one collider per home.
export function addHomeCollision(B,scene,{x,z,s=1}){
 const core=B.MeshBuilder.CreateBox('house core',{width:6*s,height:4*s,depth:6*s},scene);core.position.set(x,2*s,z+2.5*s);
 const mound=B.MeshBuilder.CreateSphere('house mound hull',{diameter:1,segments:18},scene);mound.position.set(x,1.3*s,z+4.6*s);mound.scaling.set(11*s,6*s,9*s);
 const roof=B.MeshBuilder.CreateSphere('house roof hull',{diameter:1,segments:16},scene);roof.position.set(x,2*s,z+2.9*s);roof.scaling.set(8*s,4.8*s,5.5*s);
 const collider=B.Mesh.MergeMeshes([core,mound,roof],true,true);collider.name='hobbit house solid interior';collider.isVisible=false;collider.isPickable=false;collider.checkCollisions=true;collider.metadata={home:{x,z,s}};collider.freezeWorldMatrix();return collider;
}
// Legacy saves can have been written inside the old, undersized collision box.
// Recover only embedded positions, retaining every story flag and clear position.
export function insideHomeFootprint(p,{x,z,s=1}){
 const dx=p.x-x,dz=p.z-z,margin=.36;
 if(Math.abs(dx)<3*s+margin&&dz>-.5*s-margin&&dz<5.5*s+margin)return true;
 for(const [cx,cz,rx,ry,rz]of [[0,4.6,5.5,3,4.5],[0,2.9,4,2.4,2.75]]){
  const height=ry===3?1.3:2,section=Math.sqrt(Math.max(0,1-((.72-height*s)/(ry*s))**2));
  if(((dx-cx*s)/(rx*s*section+margin))**2+((dz-cz*s)/(rz*s*section+margin))**2<1)return true;
 }
 return false;
}
export function recoverHomePosition(p,homes){
 if(!homes.some(h=>insideHomeFootprint(p,h)))return {...p};
 for(let r=.5;r<16;r+=.5)for(let i=0;i<48;i++){
  const angle=i/48*Math.PI*2,q={x:p.x+Math.sin(angle)*r,z:p.z+Math.cos(angle)*r};
  if(q.x>-47&&q.x<47&&q.z>-45&&q.z<50&&!homes.some(h=>insideHomeFootprint(q,h)))return q;
 }
 return {x:0,z:-15};
}
