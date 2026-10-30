// Babylon mesh attached to the imported right ring-finger bone.
// The existing story outcome is the sole source of ownership.
export function createOneRing(B,scene,{actorId,parent,nextBone,material}){
 if(!parent)throw new Error('One Ring needs an authored finger bone');
 const segment=nextBone?.position?.clone?.()||new B.Vector3(0,.02,0),axis=segment.lengthSquared()>1e-8?segment.clone().normalize():new B.Vector3(0,1,0);
 const ring=B.MeshBuilder.CreateTorus(actorId+' heirloom ring',{diameter:1.5,thickness:.22,tessellation:24},scene);ring.parent=parent;ring.position.copyFrom(segment.scale(.36));
 const rotation=new B.Quaternion();B.Quaternion.FromUnitVectorsToRef(B.Vector3.Up(),axis,rotation);ring.rotationQuaternion=rotation;
 ring.material=material;ring.isPickable=false;ring.checkCollisions=false;ring.receiveShadows=false;ring.metadata={kind:'one-ring',owner:actorId,attachedBone:parent.name};ring.setEnabled(false);return ring;
}
export function syncOneRingOwner(characters,ownerId){let activeOwner=null;for(const actor of characters){const ring=actor.imported?.ring;if(!ring)continue;const enabled=actor.id===ownerId&&actor.root.isEnabled();ring.setEnabled(enabled);if(enabled)activeOwner=actor.id;}return activeOwner;}
