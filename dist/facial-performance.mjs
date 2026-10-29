// Original tiny facial-rig layer for the four story characters.
// It reuses the existing skin/hair materials, creates no colliders or external assets,
// and does not claim film-likeness, skinning or speech-accurate lip synchronization.
export const EXPRESSIVE_IDS=Object.freeze(['bilbo','sam','gandalf','frodo']);
const PERSONALITIES=Object.freeze({
 bilbo:{seed:1,smile:.7},sam:{seed:2,smile:.55},
 gandalf:{seed:3,smile:.22},frodo:{seed:4,smile:.45}
});
export function facialPose(id,seconds,{speaking=false,celebrating=false}={}){
 const personality=PERSONALITIES[id];
 if(!personality)return {blink:0,mouth:0,smile:0,brow:0};
 const t=Number.isFinite(seconds)?Math.max(0,seconds):0;
 const cycle=3.2+personality.seed*.28;
 const phase=(t+personality.seed*.71)%cycle;
 const narrow=Math.max(0,1-Math.abs(phase-.14)/.14);
 const blink=narrow*narrow*(3-2*narrow);
 const chatter=speaking?.23+.55*(.5+.5*Math.sin(t*12+personality.seed)):0;
 return {blink,mouth:celebrating?.55:chatter,
  smile:celebrating?.95:personality.smile,
  brow:celebrating?.03:speaking?.017:0};
}
export function attachFacialRig(B,scene,{id,head,height,skin,brow,ink}){
 if(!EXPRESSIVE_IDS.includes(id))return null;
 const eyeY=.05*height,browY=.145*height,mouthY=-.17*height;
 function ornament(name,material,x,y,z,sx,sy,sz){
  const mesh=B.MeshBuilder.CreateSphere(id+' '+name,{diameter:1,segments:8},scene);
  mesh.material=material;mesh.parent=head;mesh.position.set(x,y,z);
  mesh.scaling.set(sx,sy,sz);mesh.isPickable=false;mesh.receiveShadows=false;
  return mesh;
 }
 const brows=[-1,1].map(side=>ornament('expressive eyebrow',brow,side*.12,browY,-.255,.105,.027,.026));
 const eyelids=[-1,1].map(side=>ornament('blink eyelid',skin,side*.11,eyeY,-.287,.063,.004,.039));
 const mouth=ornament('expressive mouth',ink,0,mouthY,id==='gandalf'?-.405:-.274,.07,.013,.029);
 const meshes=[...brows,...eyelids,mouth];
 function update(seconds,options={}){
  const pose=facialPose(id,seconds,options);
  for(const lid of eyelids)lid.scaling.y=.004+pose.blink*.077;
  for(const browMesh of brows)browMesh.position.y=browY+pose.brow;
  mouth.scaling.y=.013+.062*pose.mouth;
  mouth.scaling.x=.063+.055*pose.smile;
  mouth.position.y=mouthY+pose.smile*.011;
  return pose;
 }
 update(0);
 return {id,brows,eyelids,mouth,meshes,update};
}
