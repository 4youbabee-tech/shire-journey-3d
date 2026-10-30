// Original lightweight trowel mesh, attached to the imported rig's palm frame.
import {dressMaterials} from './surface-art.mjs';
export function createGardenToolRig(B,scene,{parent,hand,middle,index,ring,id}){
 if(!hand||!middle||!index||!ring)throw Error('Missing gardening hand joints: '+id);
 const root=new B.TransformNode(id+' held garden trowel',scene);root.parent=parent;root.rotationQuaternion=B.Quaternion.Identity();
 const wood=new B.StandardMaterial(id+' garden tool worn wood',scene);wood.diffuseColor=B.Color3.FromHexString('#765537');wood.specularColor.set(.07,.06,.04);dressMaterials(B,scene,[wood]);
 const iron=new B.StandardMaterial(id+' garden trowel iron',scene);iron.diffuseColor=B.Color3.FromHexString('#9ba8a4');iron.specularColor.set(.24,.25,.24);
 const handle=B.MeshBuilder.CreateCylinder(id+' trowel wood grip',{height:.16,diameter:.034,tessellation:10},scene);handle.parent=root;handle.rotation.x=Math.PI/2;handle.position.z=-.02;handle.material=wood;
 const paths=[-1,0,1].map(side=>[0,1,2,3].map(i=>new B.Vector3(side*[.022,.054,.049,.005][i],[0,-.005,-.012,-.006][i]-(side===0?.018:0),[.04,.12,.23,.28][i])));
 const blade=B.MeshBuilder.CreateRibbon(id+' concave steel garden blade',{pathArray:paths,sideOrientation:B.Mesh.DOUBLESIDE},scene);blade.parent=root;blade.material=iron;
 const collar=B.MeshBuilder.CreateTorus(id+' trowel collar',{diameter:.039,thickness:.007,tessellation:8},scene);collar.parent=root;collar.rotation.x=Math.PI/2;collar.position.z=.045;collar.material=iron;
 for(const m of [handle,blade,collar]){m.isPickable=false;m.receiveShadows=true;}
 const inverse=B.Matrix.Identity(),h=B.Vector3.Zero(),m=B.Vector3.Zero(),i=B.Vector3.Zero(),r=B.Vector3.Zero(),forward=B.Vector3.Zero(),side=B.Vector3.Zero(),up=B.Vector3.Zero();
 function local(node,out){node.computeWorldMatrix(true);B.Vector3.TransformCoordinatesToRef(node.getAbsolutePosition(),inverse,out);}
 return {root,update(visible=true){root.setEnabled(visible);if(!visible)return;parent.computeWorldMatrix(true);parent.getWorldMatrix().invertToRef(inverse);local(hand,h);local(middle,m);local(index,i);local(ring,r);m.subtractToRef(h,forward);const palmLength=forward.length();if(palmLength<.00001)return;forward.scaleInPlace(1/palmLength);i.subtractToRef(r,side);B.Vector3.CrossToRef(forward,side,up);if(up.lengthSquared()<.000001)return;up.normalize();forward.scaleToRef(palmLength*.6,side);root.position.copyFrom(h).addInPlace(side);forward.negateToRef(side);B.Quaternion.FromLookDirectionLHToRef(side,up,root.rotationQuaternion);}};
}
