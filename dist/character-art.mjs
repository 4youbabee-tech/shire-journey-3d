// Original corrective sculpt on the licensed traveller mesh; no extra draw calls.
export const ROLE_SCULPTS=Object.freeze({
 player:{width:.91,depth:.94,height:.87,curl:.018},
 frodo:{width:.86,depth:.91,height:.85,curl:.027},
 sam:{width:.98,depth:.98,height:.88,curl:.022},
 bilbo:{width:.93,depth:.94,height:.84,curl:.017}
});
export function sculptTraveller(positions,uvs,role){
 const p=ROLE_SCULPTS[role];if(!p)throw Error('Unknown traveller role: '+role);
 const result=Float32Array.from(positions);
 for(let i=0;i<result.length/3;i++){
  const x=positions[i*3],y=positions[i*3+1],z=positions[i*3+2];
  let yy=y;
  // Rogue's long side locks become short, irregular hobbit curls.
  const hair=Math.floor(uvs[i*2]*8)===1&&Math.floor(uvs[i*2+1]*4)===0;
  if(hair){yy=Math.max(y,1.48)+(Math.sin(x*29+z*17)+Math.cos(z*31-x*11))*p.curl;}
  const jaw=y<1.55?1-(1.55-y)*.16:1;
  result[i*3]=x*p.width*jaw;
  result[i*3+1]=1.58+(yy-1.58)*p.height;
  result[i*3+2]=z*p.depth;
 }
 return result;
}
export function applyTravellerSculpt(B,scene,meshes,role){
 if(!ROLE_SCULPTS[role])return false;
 const head=meshes.find(m=>m.morphTargetManager?.numTargets&&m.name.endsWith('Rogue_Head'));
 if(!head)throw Error('Missing reviewed traveller head for '+role);
 const positions=head.getVerticesData(B.VertexBuffer.PositionKind),uvs=head.getVerticesData(B.VertexBuffer.UVKind);
 const target=new B.MorphTarget(role+' authored silhouette',1,scene);
 target.setPositions(sculptTraveller(positions,uvs,role));head.morphTargetManager.addTarget(target);
 return true;
}
