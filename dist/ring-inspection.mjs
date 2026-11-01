// Original, cancellable hero interaction. A single gold mesh follows the imported
// palm joint; no actor is teleported and no canonical quest flag changes here.
export const RING_INSPECTION_DURATION=8;
export function ringInspectionBeat(seconds){
 const t=Math.max(0,Math.min(RING_INSPECTION_DURATION,seconds));
 return t<2?{id:'draw',caption:'يفتح فرودو جيبه بحذر، والخاتم بين أصابعه.'}:t<5.5?{id:'temptation',caption:'يبدو الذهب ساكناً؛ يطبق فرودو أصابعه قبل أن يمدّه نحو يده.'}:{id:'stow',caption:'يعيد فرودو الخاتم إلى جيبه. يبقى سام قريباً منه.'};
}
export function createRingInspection(B,scene,{onFinish=()=>{}}={}){
 const mesh=B.MeshBuilder.CreateTorus('Frodo inspected Ring',{diameter:.036,thickness:.008,tessellation:24},scene),material=new B.StandardMaterial('Inspected Ring original gold',scene);
 material.diffuseColor=B.Color3.FromHexString('#c89c38');material.specularColor.set(.75,.61,.3);material.emissiveColor.set(.08,.045,.004);mesh.material=material;mesh.isPickable=false;mesh.setEnabled(false);
 let active=false,actor=null,finger=null,elapsed=0,previous=null;
 function followPalm(){if(!active)return;const hand=actor.imported.hand;hand.computeWorldMatrix(true);if(finger){finger.computeWorldMatrix(true);mesh.position.copyFrom(B.Vector3.Lerp(hand.getAbsolutePosition(),finger.getAbsolutePosition(),.7));mesh.position.y+=.015;}else B.Vector3.TransformCoordinatesToRef(new B.Vector3(.015,.025,.015),hand.getWorldMatrix(),mesh.position);}
 const observer=scene.onAfterAnimationsObservable.add(followPalm);
 function restore(){if(!actor||!previous)return;actor.imported.lookTarget=previous.lookTarget;actor.imported.reading=previous.reading;actor=previous=null;}
 function finish(cancelled=false){if(!active)return false;const who=actor.id;active=false;mesh.setEnabled(false);restore();onFinish({actor:who,cancelled,elapsed});return true;}
 function begin(hero){if(active||hero?.id!=='frodo'||!hero.root?.isEnabled()||!hero.imported?.hand)return false;actor=hero;finger=hero.imported.holder?.getChildTransformNodes().find(n=>n.name===hero.id+' middle_01_l')||null;previous={lookTarget:hero.imported.lookTarget,reading:hero.imported.reading};elapsed=0;active=true;update(0);return true;}
 function update(dt,{paused=false}={}){
  if(!active)return;if(!actor.root.isEnabled()){finish(true);return;}if(!paused)elapsed=Math.min(RING_INSPECTION_DURATION,elapsed+Math.max(0,Math.min(.2,dt)));
  followPalm();
  mesh.rotation.set(Math.PI/2,elapsed*.35,0);const beat=ringInspectionBeat(elapsed);mesh.setEnabled(beat.id!=='stow');actor.imported.lookTarget=mesh.position.clone();actor.imported.reading=true;
  if(elapsed>=RING_INSPECTION_DURATION)finish(false);
 }
 return {begin,update,cancel:()=>finish(true),get active(){return active;},get mesh(){return mesh;},get pose(){return active?'Talk':null;},snapshot(){return {active,actor:actor?.id||null,elapsed,beat:active?ringInspectionBeat(elapsed):null};},dispose(){finish(true);scene.onAfterAnimationsObservable.remove(observer);mesh.dispose();material.dispose();}};
}
