// Invisible native Babylon collision volumes follow the narrative actor root.
export function addActorCollision(B,scene,world,actor,height){
 if(actor.id==='player')return null;
 const mesh=B.MeshBuilder.CreateCylinder(actor.id+' collision volume',{height:height*.9,diameter:actor.id==='gandalf'?.76:.64,tessellation:8},scene);
 mesh.parent=actor.root;mesh.position.y=height*.45;mesh.isVisible=false;mesh.isPickable=false;mesh.checkCollisions=true;mesh.metadata={cameraBlocker:false,actorId:actor.id};world.colliders.push(mesh);return mesh;
}
