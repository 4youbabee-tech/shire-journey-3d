// Match the visible mound surfaces, while retaining one collider per home.
export function addHomeCollision(B,scene,{x,z,s=1}){
 const core=B.MeshBuilder.CreateBox('house core',{width:6*s,height:4*s,depth:6*s},scene);core.position.set(x,2*s,z+2.5*s);
 const mound=B.MeshBuilder.CreateSphere('house mound hull',{diameter:1,segments:18},scene);mound.position.set(x,1.3*s,z+4.6*s);mound.scaling.set(11*s,6*s,9*s);
 const roof=B.MeshBuilder.CreateSphere('house roof hull',{diameter:1,segments:16},scene);roof.position.set(x,2*s,z+2.9*s);roof.scaling.set(8*s,4.8*s,5.5*s);
 const collider=B.Mesh.MergeMeshes([core,mound,roof],true,true);collider.name='hobbit house solid interior';collider.isVisible=false;collider.isPickable=false;collider.checkCollisions=true;collider.metadata={home:{x,z,s}};collider.freezeWorldMatrix();return collider;
}
