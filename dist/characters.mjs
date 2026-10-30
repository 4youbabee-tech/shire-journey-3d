// Reviewed CC0 assets; gameplay roots are the only authority for motion/collision.
export const CHARACTER_HEIGHTS=Object.freeze({player:1.72,bilbo:1.64,sam:1.79,frodo:1.71,gandalf:3.12});
export function blinkAmount(seconds,seed=0){const period=3.7+(seed%5)*.21,t=((seconds+seed*.137)%period+period)%period;return t<.17?Math.sin(t/.17*Math.PI)**2:0;}
export async function loadCharacters(B,scene,world){
 const assets={};
 for(const kind of ['traveller','wizard']){const a=await B.SceneLoader.LoadAssetContainerAsync('./assets/characters/',kind+'.glb',scene);for(const g of a.animationGroups)g.stop();assets[kind]=a;}
 const actors=[];
 for(const c of world.characters){
  const kind=c.id==='gandalf'?'wizard':'traveller',instance=assets[kind].instantiateModelsToScene(n=>c.id+' '+n,false,{doNotInstantiate:true});
  const holder=new B.TransformNode(c.id+' imported rig',scene);holder.parent=c.root;for(const n of instance.rootNodes)n.parent=holder;
  const meshes=holder.getChildMeshes();let min=Infinity,max=-Infinity;
  for(const m of meshes){m.computeWorldMatrix(true);const box=m.getBoundingInfo().boundingBox;if(!m.name.endsWith('2H_Staff')){min=Math.min(min,box.minimumWorld.y);max=Math.max(max,box.maximumWorld.y);}m.isPickable=false;m.receiveShadows=true;world.shadow?.addShadowCaster(m);}
  const scale=(CHARACTER_HEIGHTS[c.id]||1.7)/(max-min);holder.scaling.setAll(scale);holder.position.y=-min*scale;holder.rotation.y=Math.PI;
  for(const m of c.parts){world.shadow?.removeShadowCaster(m);m.dispose(false,false);}
  const palette=c.id==='gandalf'?'gandalf':['player','bilbo','sam','frodo'].includes(c.id)?c.id:null;
  if(palette)for(const material of new Set(meshes.map(m=>m.material).filter(m=>m?.albedoTexture))){const copy=material.clone(c.id+' costume');copy.albedoTexture=new B.Texture('./assets/characters/'+palette+'.png',scene,false,false);for(const m of meshes)if(m.material===material)m.material=copy;}
  for(const g of instance.animationGroups){g.stop();g.enableBlending=false;}
  const find=n=>instance.animationGroups.find(g=>g.name.endsWith(n));
  const clips={Idle:find('Idle'),Walk:find('Walking_A'),Run:find('Running_A'),Talk:find('Interact'),Cheer:find('Cheer'),Work:find('PickUp'),Sit:find('Sit_Floor_Idle'),Rise:find('Sit_Floor_StandUp'),Ride:find('Sit_Chair_Idle')};
  if(!clips.Idle||!clips.Walk||!clips.Run)throw Error('Missing locomotion clips for '+c.id);
  let active=null,previous=null,fade=1,last=c.root.position.clone(),clock=0,paused=false;
  const head=holder.getChildTransformNodes().find(n=>n.name===c.id+' head');
  const staff=meshes.find(m=>m.name.endsWith('2H_Staff')),hand=holder.getChildTransformNodes().find(n=>n.name===c.id+' handslot.l');
  if(staff&&hand){staff.parent=c.root;staff.rotationQuaternion=B.Quaternion.Identity();staff.scaling.setAll(1.25);}
  const blinkMeshes=meshes.filter(m=>m.morphTargetManager?.numTargets);
  const imported={holder,meshes,clips:instance.animationGroups,head,staff,hand,blinkMeshes,mode:'Idle',blink:0,lookYaw:0};
  function update(dt,{speaking=false,celebrating=false,pose=null}={}){
   clock+=dt;const distance=B.Vector3.Distance(last,c.root.position);last.copyFrom(c.root.position);
   const far=B.Vector3.Distance(c.root.getAbsolutePosition(),scene.activeCamera.position)>42;
   if(!c.root.isEnabled()||far){active?.pause();previous?.pause();paused=true;imported.paused=true;return;}
   if(paused){active?.play(true);previous?.play(true);paused=false;}imported.paused=false;
   const speed=distance/Math.max(.001,dt),mode=pose||(celebrating?'Cheer':speaking?'Talk':c.activity==='Work'?'Work':c.activity==='Rest'?'Sit':speed>3.6?'Run':speed>.25?'Walk':'Idle');
   const next=clips[mode==='Socialize'?'Talk':mode]||clips.Idle;imported.mode=mode;imported.reading=pose==='Sit';
   if(next!==active){previous?.stop();previous=active;active=next;fade=previous?0:1;next.start(mode!=='Rise');next.setWeightForAllAnimatables(fade);}
   if(previous){fade=Math.min(1,fade+dt/.24);previous.setWeightForAllAnimatables(1-fade);active.setWeightForAllAnimatables(fade);if(fade>=1){previous.stop();previous=null;}}
   imported.blink=blinkAmount(clock,c.root.uniqueId);
  }
  imported.update=update;c.imported=imported;actors.push(c);
 }
 // Layer gaze and eyelid deformation after skeletal animation, before rendering.
 const observer=scene.onAfterAnimationsObservable.add(()=>{
  for(const c of actors){const a=c.imported;if(!c.root.isEnabled()||a.paused)continue;
   for(const m of a.blinkMeshes)m.morphTargetManager.getTarget(0).influence=a.blink;
   if(a.staff&&a.hand){a.hand.computeWorldMatrix(true);c.root.computeWorldMatrix(true);a.staff.position.copyFrom(B.Vector3.TransformCoordinates(a.hand.getAbsolutePosition(),c.root.getWorldMatrix().clone().invert()));}
   if(!a.head)continue;
   const near=B.Vector3.Distance(c.root.getAbsolutePosition(),world.body.position)<8;
   if(c.id!=='player'&&near){const local=B.Vector3.TransformCoordinates(world.body.position,a.head.getWorldMatrix().clone().invert());const yaw=Math.max(-.28,Math.min(.28,Math.atan2(local.x,local.z)));a.lookYaw+=(yaw-a.lookYaw)*.12;}else a.lookYaw*=.9;
   if(a.head.rotationQuaternion){a.head.rotationQuaternion.multiplyInPlace(B.Quaternion.RotationYawPitchRoll(a.lookYaw,a.reading?.22:0,0));}
  }
 });
 world.stats.importedCharacters=actors.length;world.stats.characterAssets='KayKit CC0, reviewed proportional heads, morph eyelids';
 world.stats.eyelidRigs=actors.filter(c=>c.imported.blinkMeshes.length).length;
 return {actors,update(dt,activeNPC,party,cinema=null){for(const c of actors)c.imported.update(dt,{speaking:c.id===activeNPC,celebrating:party,pose:cinema?(c.id==='frodo'?cinema.frodoMode:c.id==='gandalf'?'Ride':null):null});},dispose(){scene.onAfterAnimationsObservable.remove(observer);}};
}
