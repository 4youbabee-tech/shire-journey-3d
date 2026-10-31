// A restrained, finger-proportioned One Ring attached to the imported right ring-finger bone.
// The canonical story flag remains the sole owner authority.
export function createOneRing(B,scene,{actorId,parent,nextBone,material}){
 if(!parent)throw new Error('One Ring needs an authored finger bone');
 if(!nextBone)throw new Error('One Ring needs the next authored finger bone to measure its scale');
 const segment=nextBone.position.clone(),segmentLength=segment.length();
 if(!Number.isFinite(segmentLength)||segmentLength<.01)throw new Error('Invalid ring-finger segment length for '+actorId);
 const axis=segment.clone().normalize();
 // The ring should occupy roughly half the proximal finger segment, not half the Hobbit's body.
 const diameter=Math.max(.035,Math.min(.065,segmentLength*.55));
 const thickness=diameter*.16;
 const ring=B.MeshBuilder.CreateTorus(actorId+' heirloom ring',{diameter,thickness,tessellation:24},scene);
 ring.parent=parent;ring.position.copyFrom(segment.scale(.36));
 // Babylon torus geometry is oriented around local Y; align that axis with the finger segment.
 const rotation=new B.Quaternion();B.Quaternion.FromUnitVectorsToRef(B.Vector3.Up(),axis,rotation);ring.rotationQuaternion=rotation;
 ring.material=material;ring.isPickable=false;ring.checkCollisions=false;ring.receiveShadows=false;
 ring.metadata={kind:'one-ring',owner:actorId,attachedBone:parent.name,localDiameter:diameter,localThickness:thickness,fingerSegmentLength:segmentLength};
 ring.setEnabled(false);return ring;
}
export function syncOneRingOwner(characters,ownerId){
 let activeOwner=null;
 for(const actor of characters){const ring=actor.imported?.ring;if(!ring)continue;const enabled=actor.id===ownerId&&actor.root.isEnabled();ring.setEnabled(enabled);if(enabled)activeOwner=actor.id;}
 return activeOwner;
}
