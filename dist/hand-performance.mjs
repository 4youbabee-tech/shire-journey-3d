// Bounded arm posing on the real rig. Original clip transforms are restored before evaluation.
export function createHandPerformance(B,scene){
 const saved=new Map(),cache=new Map();
 function restore(){for(const [joint,q]of saved)joint.rotationQuaternion.copyFrom(q);saved.clear();}
 const observer=scene.onBeforeAnimationsObservable.add(restore);
 function solve(actor,target,getGrip,weight=1){
  if(weight<=0||!actor?.imported?.holder)return null;
  let joints=cache.get(actor.id);if(!joints){const nodes=actor.imported.holder.getChildTransformNodes();joints=['lowerarm_r','upperarm_r'].map(name=>nodes.find(n=>n.name===actor.id+' '+name));cache.set(actor.id,joints);}
  if(joints.some(j=>!j?.rotationQuaternion))return null;
  for(const j of joints)if(!saved.has(j))saved.set(j,j.rotationQuaternion.clone());
  const origin=getGrip(),goal=B.Vector3.Lerp(origin,target,Math.max(0,Math.min(1,weight)));
  for(let i=0;i<7;i++)for(const joint of joints){joint.computeWorldMatrix(true);const at=joint.getAbsolutePosition(),tip=getGrip(),from=tip.subtract(at),to=goal.subtract(at);if(from.lengthSquared()<1e-8||to.lengthSquared()<1e-8)continue;joint.parent.computeWorldMatrix(true);const inverse=joint.parent.getWorldMatrix().clone().invert(),a=B.Vector3.TransformNormal(from,inverse).normalize(),b=B.Vector3.TransformNormal(to,inverse).normalize(),delta=B.Quaternion.FromUnitVectorsToRef(a,b,new B.Quaternion());const safe=B.Quaternion.Slerp(B.Quaternion.Identity(),delta,.72);joint.rotationQuaternion.copyFrom(safe.multiply(joint.rotationQuaternion));joint.computeWorldMatrix(true);}
  return B.Vector3.Distance(getGrip(),goal);
 }
 return {solve,restore,dispose(){restore();scene.onBeforeAnimationsObservable.remove(observer);}};
}
export function fingerGrip(B,actor,cache=new Map()){
 const holder=actor.imported.holder,key=actor.id;let nodes=cache.get(key);if(!nodes){const all=holder.getChildTransformNodes(),find=n=>all.find(v=>v.name===actor.id+' '+n);nodes={hand:find('hand_r'),index:find('index_03_r'),thumb:find('thumb_03_r'),middle:find('middle_03_r')};cache.set(key,nodes);}
 for(const n of Object.values(nodes))n?.computeWorldMatrix(true);const wrist=nodes.hand.getAbsolutePosition();if(!nodes.index||!nodes.thumb)return {position:wrist.clone(),normal:B.Vector3.Forward()};
 const index=nodes.index.getAbsolutePosition(),thumb=nodes.thumb.getAbsolutePosition(),middle=nodes.middle?.getAbsolutePosition()||index.add(new B.Vector3(.01,0,0));let normal=B.Vector3.Cross(index.subtract(wrist),middle.subtract(wrist));if(normal.lengthSquared()<1e-7)normal=B.Vector3.Forward();else normal.normalize();return {position:B.Vector3.Lerp(index,thumb,.5),normal};
}
