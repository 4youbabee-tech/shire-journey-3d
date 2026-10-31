// Original staging and Arabic captions; factual order checked against F1 screenplay pp27–32.
export const LEGACY_SECONDS=28;
export function legacyBeat(t){
 if(t<6)return {id:'hesitation',caption:'في هدوء باج إند، يتردد بيلبو أمام الخاتم الذي رافقه طويلًا.'};
 if(t<9)return {id:'release',caption:'يفتح يده أخيرًا. يستقر الخاتم الذهبي على ألواح الأرض.'};
 if(t<14)return {id:'departure',caption:'يترك بيلبو البيت خلفه، وغاندالف يبقى قرب الباب.'};
 if(t<20)return {id:'pickup',caption:'يصل فرودو، فيلمح الخاتم عند قدميه ويلتقطه.'};
 if(t<25)return {id:'envelope',caption:'بإشارة من غاندالف، يضع فرودو الخاتم في ظرف.'};
 return {id:'seal',caption:'يغلق غاندالف الظرف بالشمع ويعيده إلى فرودو. تبدأ مسؤولية جديدة.'};
}
export function createRingLegacy(B,scene,world,room,{onDrop=()=>{}}={}){
 const V=B.Vector3,actors=Object.fromEntries(world.characters.map(c=>[c.id,c]));
 const ring=B.MeshBuilder.CreateTorus('Bilbo plain gold heirloom',{diameter:.036,thickness:.008,tessellation:40},scene);
 const gold=new B.StandardMaterial('heirloom polished gold',scene);gold.diffuseColor=B.Color3.FromHexString('#dcad45');gold.specularColor=new B.Color3(1,.87,.5);gold.specularPower=72;gold.emissiveColor=new B.Color3(.12,.065,.008);ring.material=gold;ring.isPickable=false;
 const envelope=B.MeshBuilder.CreateBox('Frodo sealed envelope',{width:.24,height:.16,depth:.014},scene);const paper=new B.StandardMaterial('folded parchment',scene);paper.diffuseColor=B.Color3.FromHexString('#ddc79a');envelope.material=paper;envelope.isPickable=false;
 const seal=B.MeshBuilder.CreateCylinder('red wax seal',{diameter:.04,height:.008,tessellation:16},scene);const wax=new B.StandardMaterial('red sealing wax',scene);wax.diffuseColor=B.Color3.FromHexString('#8e3327');seal.material=wax;seal.rotation.x=Math.PI/2;seal.parent=envelope;seal.position.set(0,0,.013);seal.isPickable=false;
 const fold=B.MeshBuilder.CreateLines('envelope folded flap',{points:[new V(-.115,.075,.009),new V(0,-.015,.009),new V(.115,.075,.009)]},scene);fold.parent=envelope;fold.color=B.Color3.FromHexString('#a58b64');fold.isPickable=false;
 let enabled=[],saved=[],light=null,active=false,elapsed=0,oldNear=.15,oldFov=.87,dropped=false,partyTime=null;
 const clamp=t=>Math.max(0,Math.min(1,t)),mix=(a,b,t)=>V.Lerp(a,b,clamp(t));
 function joint(id,name){const nodes=actors[id].imported.holder.getChildTransformNodes();return nodes.find(n=>n.name===id+' '+name)||nodes.find(n=>n.name===id+' hand_r');}
 function hand(id){const wrist=joint(id,'hand_r'),finger=joint(id,'middle_01_r');wrist.computeWorldMatrix(true);finger.computeWorldMatrix(true);return V.Lerp(wrist.getAbsolutePosition(),finger.getAbsolutePosition(),.65).add(new V(0,.015,.025));}
 function farewell(t){partyTime=t;ring.setEnabled(t>=9&&t<11);}

 function begin(){
  active=true;elapsed=0;dropped=false;partyTime=null;saved=world.characters.map(c=>({c,p:c.root.position.clone(),r:c.root.rotation.clone(),on:c.root.isEnabled()}));
  const keep=new Set(['bilbo','frodo','gandalf'].flatMap(id=>actors[id].root.getChildMeshes()));
  enabled=scene.meshes.filter(m=>m.isEnabled()&&!room.meshes.includes(m)&&!keep.has(m)&&![ring,envelope,seal,fold].includes(m));for(const m of enabled)m.setEnabled(false);
  light={sun:world.sun.isEnabled(),hemi:world.hemi.intensity};world.sun.setEnabled(false);world.hemi.intensity=.48;room.setActive(true);
  for(const [id,x,z]of [['bilbo',160,136.8],['gandalf',161.7,138.1],['frodo',160,132.4]]){actors[id].root.setEnabled(true);actors[id].root.position.set(x,0,z);actors[id].root.rotation.y=Math.PI;}
  envelope.rotation.set(0,0,0);ring.rotationQuaternion=null;oldNear=scene.activeCamera.minZ;oldFov=scene.activeCamera.fov;scene.activeCamera.minZ=.015;scene.activeCamera.fov=.72;ring.setEnabled(true);envelope.setEnabled(false);seal.setEnabled(false);
 }
 const floor=new V(160,.012,136.5);
 function update(t){elapsed=Math.min(LEGACY_SECONDS,Math.max(0,t));if(t>=7&&!dropped){dropped=true;onDrop();}const bilbo=actors.bilbo,frodo=actors.frodo;
  bilbo.root.setEnabled(t<12);bilbo.root.position.z=136.8-Math.max(0,t-9)*.8;
  frodo.root.setEnabled(t>=13);frodo.root.position.z=132.4+clamp((t-13)/3.5)*3.6;
  const modes={bilbo:t<6?'Talk':'Idle',gandalf:t>=20?'Talk':'Idle',frodo:t<16.5?'Walk':t<19?'Work':'Idle'};
  return {actorModes:modes};
 }
 function frame(){if(!active){if(partyTime!==null&&partyTime>=9&&partyTime<11){const finger=joint('bilbo','index_02_r');finger.computeWorldMatrix(true);ring.position.copyFrom(finger.getAbsolutePosition());const tip=joint('bilbo','index_03_r');tip.computeWorldMatrix(true);const axis=tip.getAbsolutePosition().subtract(finger.getAbsolutePosition());if(axis.lengthSquared()>.000001){ring.rotationQuaternion=B.Quaternion.FromUnitVectorsToRef(V.Up(),axis.normalize(),ring.rotationQuaternion||B.Quaternion.Identity());}}return;}const t=elapsed,b=hand('bilbo'),f=hand('frodo'),g=hand('gandalf').add(new V(0,.06,.085));
  ring.setEnabled(t<23.5);ring.rotation.set(t>=7&&t<17.5?0:.2,t*.2,0);
  if(t<6)ring.position.copyFrom(b);else if(t<7)ring.position.copyFrom(mix(b,floor,(t-6)**2));else if(t<17.5)ring.position.copyFrom(floor);else if(t<19)ring.position.copyFrom(mix(floor,f,(t-17.5)/1.5));else if(t<22)ring.position.copyFrom(f);else ring.position.copyFrom(mix(f,g,(t-22)/1.5));
  envelope.setEnabled(t>=20);seal.setEnabled(t>=25);envelope.position.copyFrom(t<25?g:mix(g,f,(t-25)/2));
  let eye,target;
  if(t<2.5){target=new V(160.45,1.35,137);eye=new V(162.5,1.9,140);}
  else if(t<6){target=ring.position;eye=target.add(new V(.15,.1,.28));}
  else if(t<9){target=ring.position;eye=target.add(new V(.24,.24,.42));}
  else if(t<14){target=new V(160,1.1,135.5);eye=new V(163,2.1,140);}
  else if(t<19){target=ring.position;eye=target.add(new V(.32,.35,.58));}
  else{target=t<24?ring.position:envelope.position;eye=target.add(new V(.28,.21,.48));}
  scene.activeCamera.position.copyFrom(eye);scene.activeCamera.setTarget(target);
 }
 const observer=scene.onAfterAnimationsObservable.add(frame);
 function end(){partyTime=null;if(!active){ring.setEnabled(false);envelope.setEnabled(false);return;}active=false;room.setActive(false);for(const m of enabled)if(!m.isDisposed())m.setEnabled(true);for(const {c,p,r,on}of saved){c.root.position.copyFrom(p);c.root.rotation.copyFrom(r);c.root.setEnabled(on);}world.sun.setEnabled(light.sun);world.hemi.intensity=light.hemi;scene.activeCamera.minZ=oldNear;scene.activeCamera.fov=oldFov;ring.setEnabled(false);envelope.setEnabled(false);}
 ring.setEnabled(false);envelope.setEnabled(false);
 function displayEnvelope(on){if(active)return;envelope.position.set(154,1.15,147.4);envelope.rotation.set(-Math.PI/2,0,0);envelope.setEnabled(on);seal.setEnabled(on);}
 return {begin,update,end,displayEnvelope,farewell,get active(){return active;},get beat(){return legacyBeat(elapsed).id;},dispose(){end();scene.onAfterAnimationsObservable.remove(observer);ring.dispose();fold.dispose();envelope.dispose();gold.dispose();paper.dispose();wax.dispose();}};
}
