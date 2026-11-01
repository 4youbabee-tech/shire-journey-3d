import {createHandPerformance,fingerGrip} from './hand-performance.mjs';
// Original face-led staging and captions. Keep the visible bequest in the canonical order.
export const LEGACY_SECONDS=28;
export function legacyBeat(t){
 if(t<6)return {id:'hesitation',caption:'بيلبو يتردد. في هذه القطعة الصغيرة، شيء لا يسهل تركه.'};
 if(t<9)return {id:'release',caption:'يفتح يده. يسقط الخاتم، ويبقى صوته في هدوء البيت.'};
 if(t<14)return {id:'departure',caption:'نظرة أخيرة إلى البيت… ثم يختار بيلبو الطريق.'};
 if(t<20)return {id:'pickup',caption:'يدخل فرودو. ما تركه بيلبو صار الآن بين يديه.'};
 if(t<25)return {id:'envelope',caption:'غاندالف قريب منه. يحفظان الخاتم في ظرف، بعيدًا عن الأنظار.'};
 return {id:'seal',caption:'ينتقل الظرف إلى فرودو. يبقى دفء البيت… ويتغيّر معنى الأمان.'};
}
export function createRingLegacy(B,scene,world,room,{onDrop=()=>{}}={}){
 const V=B.Vector3,actors=Object.fromEntries(world.characters.map(c=>[c.id,c])),performance=createHandPerformance(B,scene),gripCache=new Map();
 const ring=B.MeshBuilder.CreateTorus('Bilbo plain gold heirloom',{diameter:.026,thickness:.0045,tessellation:40},scene),gold=new B.StandardMaterial('heirloom polished gold',scene);gold.diffuseColor=B.Color3.FromHexString('#d7ad55');gold.specularColor=new B.Color3(1,.9,.65);gold.specularPower=86;gold.emissiveColor.set(.04,.018,.002);ring.material=gold;ring.isPickable=false;
 const envelope=B.MeshBuilder.CreateBox('Frodo sealed envelope',{width:.24,height:.16,depth:.014},scene),paper=new B.StandardMaterial('folded parchment',scene);paper.diffuseColor=B.Color3.FromHexString('#dfcfad');envelope.material=paper;envelope.isPickable=false;
 const seal=B.MeshBuilder.CreateCylinder('red wax seal',{diameter:.034,height:.005,tessellation:16},scene),wax=new B.StandardMaterial('red sealing wax',scene);wax.diffuseColor=B.Color3.FromHexString('#873e30');seal.material=wax;seal.rotation.x=Math.PI/2;seal.parent=envelope;seal.position.set(0,0,.011);seal.isPickable=false;
 const fold=B.MeshBuilder.CreateLines('envelope folded flap',{points:[new V(-.115,.075,.009),new V(0,-.015,.009),new V(.115,.075,.009)]},scene);fold.parent=envelope;fold.color=B.Color3.FromHexString('#b6a080');fold.isPickable=false;
 let enabled=[],saved=[],light=null,active=false,elapsed=0,oldNear=.15,oldFov=.87,dropped=false,partyTime=null;
 const clamp=t=>Math.max(0,Math.min(1,t)),smooth=t=>{t=clamp(t);return t*t*(3-2*t);},mix=(a,b,t)=>V.Lerp(a,b,clamp(t));
 const grip=id=>fingerGrip(B,actors[id],gripCache),hand=id=>grip(id).position,face=id=>{const head=actors[id].imported.head||actors[id].root;head.computeWorldMatrix(true);return head.getAbsolutePosition().add(new V(0,actors[id].imported.head?.06:1.15,0));};
 const floor=new V(160,.012,136.8),surface=room.bequestSurface?new V(room.bequestSurface.x,room.bequestSurface.y,room.bequestSurface.z):new V(162.25,.84,138.5);
 function farewell(t){partyTime=t;ring.setEnabled(t>=9&&t<11);}
 function begin(){
  active=true;elapsed=0;dropped=false;partyTime=null;saved=world.characters.map(c=>({c,p:c.root.position.clone(),r:c.root.rotation.clone(),on:c.root.isEnabled()}));
  const keep=new Set(['bilbo','frodo','gandalf'].flatMap(id=>actors[id].root.getChildMeshes()));enabled=scene.meshes.filter(m=>m.isEnabled()&&!room.meshes.includes(m)&&!keep.has(m)&&![ring,envelope,seal,fold].includes(m));for(const m of enabled)m.setEnabled(false);
  light={sun:world.sun.isEnabled(),hemi:world.hemi.intensity};world.sun.setEnabled(false);world.hemi.intensity=.34;room.setActive(true);room.setDoorOpen?.(false);
  for(const [id,x,z]of [['bilbo',160,138.4],['gandalf',162.1,140.0],['frodo',160,132.4]]){actors[id].root.setEnabled(true);actors[id].root.position.set(x,0,z);actors[id].root.rotation.y=Math.PI;}
  oldNear=scene.activeCamera.minZ;oldFov=scene.activeCamera.fov;scene.activeCamera.minZ=.04;scene.activeCamera.fov=.84;ring.setEnabled(true);envelope.setEnabled(false);seal.setEnabled(false);
 }
 function update(t){elapsed=Math.min(LEGACY_SECONDS,Math.max(0,t));if(t>=7&&!dropped){dropped=true;onDrop();}const bilbo=actors.bilbo,frodo=actors.frodo;
  bilbo.root.setEnabled(t<12);bilbo.root.position.z=138.4-Math.max(0,t-9)*1.85;room.setDoorOpen?.(t>=9&&t<17);
  frodo.root.setEnabled(t>=13);frodo.root.position.set(160+2.1*smooth((t-19)/3),0,132.4+4.0*smooth((t-13)/3.5)+1.35*smooth((t-19)/3));
  const modes={bilbo:t<4.4?'Talk':t>=9&&t<12?'Walk':'Idle',gandalf:t>=24&&t<25.3?'Talk':'Idle',frodo:t<16.5?'Walk':t<19?'Work':t<22?'Walk':'Idle'};
  const partner=t<13?'bilbo':'frodo',targets={bilbo:face('gandalf'),gandalf:t>=22?surface:face(partner),frodo:t<19?floor:t<25?surface:face('gandalf')};
  for(const id of ['bilbo','gandalf',...(t>=19?['frodo']:[])]){const p=actors[id].root.position,target=targets[id];if(id==='bilbo'&&t>=9){actors[id].root.rotation.y=0;continue;}actors[id].root.rotation.y=Math.atan2(target.x-p.x,target.z-p.z)+Math.PI;}
  return {actorModes:modes,actorTargets:targets};
 }
 function frame(){
  if(!active){if(partyTime!==null&&partyTime>=9&&partyTime<11){const p=grip('bilbo');ring.position.copyFrom(p.position);ring.rotationQuaternion=B.Quaternion.FromUnitVectorsToRef(V.Up(),p.normal,ring.rotationQuaternion||B.Quaternion.Identity());}return;}
  const t=elapsed;if(t>=21.4&&t<27.1){const weight=smooth((t-21.4)/.7)*(1-smooth((t-25.5)/1.5));performance.solve(actors.frodo,surface.add(new V(0,.025,0)),()=>hand('frodo'),weight);}
  const b=grip('bilbo'),f=grip('frodo');ring.setEnabled(t<23.5);
  if(t<6)ring.position.copyFrom(b.position);else if(t<7)ring.position.copyFrom(mix(b.position,floor,(t-6)**2));else if(t<17.5)ring.position.copyFrom(floor);else if(t<19)ring.position.copyFrom(mix(floor,f.position,(t-17.5)/1.5));else ring.position.copyFrom(f.position);
  const normal=t>=7&&t<17.5?V.Up():t<6?b.normal:f.normal;ring.rotationQuaternion=B.Quaternion.FromUnitVectorsToRef(V.Up(),normal,ring.rotationQuaternion||B.Quaternion.Identity());
  envelope.setEnabled(t>=20);seal.setEnabled(t>=25);envelope.position.copyFrom(t<25.3?surface:hand('frodo'));envelope.rotation.set(t<25.3?Math.PI/2:Math.PI/2*(1-smooth((t-25.3)/1.5)),0,0);
  const camera=scene.activeCamera,aspect=scene.getEngine().getRenderWidth()/scene.getEngine().getRenderHeight(),portrait=aspect<.85;let target,eye;
  // People and reactions carry the scene. Short object inserts never fill the phone with a wrist.
  if(t<4.6){target=face('bilbo').add(new V(.12,-.08,0));eye=target.add(portrait?new V(-.55,.18,-1.55):new V(-1.9,.45,-2.5));}
  else if(t<6){target=ring.position;eye=target.add(b.normal.scale(.32)).add(new V(.08,.15,-.2));}
  else if(t<9){target=floor.add(new V(0,.04,0));eye=target.add(new V(-.35,.38,-.65));}
  else if(t<13.8){target=new V(160.5,1.15,136.7);eye=portrait?new V(157.9,2.1,132.1):new V(155.4,2.5,132.8);}
  else if(t<19){target=face('frodo').add(new V(0,-.3,0));eye=target.add(portrait?new V(-.3,.14,-1.8):new V(-1.7,.55,-2.2));}
  else if(t<22){target=face('frodo').add(new V(0,-.07,0));eye=target.add(portrait?new V(-.55,.2,-1.6):new V(-1.7,.5,-2.0));}
  else if(t<25.5){target=surface.add(new V(0,.03,0));eye=target.add(portrait?new V(-.45,.6,-1.05):new V(-1.1,.8,-1.4));}
  else{target=face('frodo').add(new V(.1,-.22,0));eye=target.add(portrait?new V(-.6,.2,-1.8):new V(-2.0,.7,-2.5));}
  camera.position.copyFrom(eye);camera.setTarget(target);
 }
 const observer=scene.onAfterAnimationsObservable.add(frame);
 function end(){partyTime=null;performance.restore();if(!active){ring.setEnabled(false);envelope.setEnabled(false);return;}active=false;room.setDoorOpen?.(false);room.setActive(false);for(const m of enabled)if(!m.isDisposed())m.setEnabled(true);for(const {c,p,r,on}of saved){c.root.position.copyFrom(p);c.root.rotation.copyFrom(r);c.root.setEnabled(on);}world.sun.setEnabled(light.sun);world.hemi.intensity=light.hemi;scene.activeCamera.minZ=oldNear;scene.activeCamera.fov=oldFov;ring.setEnabled(false);envelope.setEnabled(false);}
 ring.setEnabled(false);envelope.setEnabled(false);
 function displayEnvelope(on){if(active)return;envelope.position.set(154,1.15,147.4);envelope.rotation.set(-Math.PI/2,0,0);envelope.setEnabled(on);seal.setEnabled(on);}
 return {begin,update,end,displayEnvelope,farewell,get active(){return active;},get beat(){return legacyBeat(elapsed).id;},dispose(){end();performance.dispose();scene.onAfterAnimationsObservable.remove(observer);ring.dispose();fold.dispose();envelope.dispose();gold.dispose();paper.dispose();wax.dispose();}};
}
