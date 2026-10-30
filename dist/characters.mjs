// Authored Shire cast, based on reviewed Quaternius CC0 humanoids.
export const CHARACTER_HEIGHTS=Object.freeze({player:1.48,bilbo:1.36,sam:1.48,frodo:1.42,gandalf:3.12});
export function blinkAmount(seconds,seed=0){const period=3.7+(seed%5)*.21,t=((seconds+seed*.137)%period+period)%period;return t<.17?Math.sin(t/.17*Math.PI)**2:0;}
const roleFor=id=>['frodo','sam','bilbo','gandalf'].includes(id)?id:'sam';
const seedFor=id=>[...id].reduce((n,c)=>((n*31+c.charCodeAt(0))%997),1);
export function createClipMixer({fadeSeconds=.24}={}){
 const live=new Map();let selected=null,paused=false;
 function select(group,{loop=true,phase=0}={}){
  if(group===selected)return;selected=group;
  if(!group)return;
  if(!live.has(group)){group.start(loop);if(loop&&phase)group.goToFrame(group.from+(group.to-group.from)*phase);group.setWeightForAllAnimatables(live.size?0:1);live.set(group,{weight:live.size?0:1,from:live.size?0:1,target:1,elapsed:0,resume:false});}
  for(const [clip,s]of live){s.from=s.weight;s.target=clip===group?1:0;s.elapsed=0;}
  if(paused){group.pause();live.get(group).resume=true;}
 }
 function update(dt){
  if(paused)return;
  for(const [group,s]of live){s.elapsed+=Math.max(0,dt);const t=Math.min(1,s.elapsed/fadeSeconds);s.weight=s.from+(s.target-s.from)*t;group.setWeightForAllAnimatables(s.weight);if(t===1&&s.target===0){group.stop();live.delete(group);}}
 }
 function setPaused(value){
  if(value===paused)return;paused=value;
  for(const [group,s]of live){if(value){s.resume=group.isPlaying;if(s.resume)group.pause();}else if(s.resume){group.play();s.resume=false;}}
 }
 return {select,update,setPaused,get activeCount(){return live.size;}};
}
export async function loadCharacters(B,scene,world){
 const assets={};
 for(const role of ['frodo','sam','bilbo','gandalf']){const a=await B.SceneLoader.LoadAssetContainerAsync('./assets/characters/',role+'-natural.glb',scene);for(const g of a.animationGroups)g.stop();assets[role]=a;}
 const actors=[];
 for(const c of world.characters){
  const role=roleFor(c.id),instance=assets[role].instantiateModelsToScene(n=>c.id+' '+n,false,{doNotInstantiate:true});
  const holder=new B.TransformNode(c.id+' imported rig',scene);holder.parent=c.root;for(const n of instance.rootNodes)n.parent=holder;
  const meshes=holder.getChildMeshes();let low=Infinity,high=-Infinity;
  if(role==='gandalf'){const wool=assets.gandalf.materials.find(m=>m.name.includes('weathered grey woven wool'));if(!wool)throw Error('Missing wizard wool material');for(const m of meshes)if(m.material?.name.includes('MI_Peasant'))m.material=wool;}
  for(const m of meshes){m.computeWorldMatrix(true);const box=m.getBoundingInfo().boundingBox;if(!m.name.endsWith('walking staff')){low=Math.min(low,box.minimumWorld.y);high=Math.max(high,box.maximumWorld.y);}m.isPickable=false;m.receiveShadows=true;world.shadow?.addShadowCaster(m);}
  if(!(high>low))throw Error('Invalid character bounds: '+c.id);
  const scale=(CHARACTER_HEIGHTS[c.id]||1.45)/(high-low);holder.scaling.setAll(scale);holder.position.y=-low*scale;holder.rotation.y=Math.PI;
  for(const m of c.parts){world.shadow?.removeShadowCaster(m);m.dispose(false,false);}
  if(role==='sam'&&c.id!=='sam')for(const material of new Set(meshes.map(m=>m.material).filter(m=>m?.name.includes('waistcoat')))){
   const copy=material.clone(c.id+' waistcoat');copy.albedoColor=new B.Color3(...(c.id==='player'?[.65,.9,.7]:c.id==='farmer-berin'?[.9,.68,.55]:[.75,.8,.65]));for(const m of meshes)if(m.material===material)m.material=copy;
  }
  for(const g of instance.animationGroups){g.stop();g.enableBlending=false;}
  const find=n=>instance.animationGroups.find(g=>g.name.endsWith(n));
  const clips={Idle:find('Idle'),Walk:find('Walking_A'),Run:find('Running_A'),Talk:find('Interact'),Cheer:find('Cheer'),Work:find('PickUp'),Sit:find('Sit_Floor_Idle'),Rise:find('Sit_Floor_StandUp'),Ride:find('Sit_Chair_Idle'),RideTalk:find('Sit_Chair_Talk'),Board:find('Board')};
  for(const name of ['Idle','Walk','Run','Talk','Sit','Rise','Ride','RideTalk','Board'])if(!clips[name])throw Error('Missing '+name+' for '+c.id);
  const nodes=holder.getChildTransformNodes(),head=nodes.find(n=>n.name===c.id+' Head'),pelvis=nodes.find(n=>n.name===c.id+' pelvis'),hand=nodes.find(n=>n.name===c.id+' hand_l'),staff=meshes.find(m=>m.name.endsWith('walking staff'));
  if(!head||!pelvis)throw Error('Missing natural head/pelvis rig: '+c.id);
  if(staff){staff.parent=holder;staff.rotationQuaternion=B.Quaternion.Identity();staff.scaling.setAll(1);}
  const morphs={blink:[],smile:[],attention:[],seated:[],left:[],right:[],down:[],up:[]};
  const names={blink:'Blink',smile:'Smile',attention:'Attention',seated:'SeatedDrape',left:'LookLeft',right:'LookRight',down:'LookDown',up:'LookUp'};
  for(const m of meshes)if(m.morphTargetManager){m.morphTargetManager.optimizeInfluencers=false;m.morphTargetManager.numMaxInfluencers=m.morphTargetManager.numTargets;}
  for(const m of meshes)if(m.morphTargetManager)for(let i=0;i<m.morphTargetManager.numTargets;i++){
   const target=m.morphTargetManager.getTarget(i);for(const [key,name]of Object.entries(names))if(target.name.endsWith(name))morphs[key].push(target);
  }
  if(morphs.blink.length<2)throw Error('Missing skin/eye blink controls: '+c.id);
  const mixer=createClipMixer(),seed=seedFor(c.id);let last=c.root.position.clone(),clock=seed*.137,previousMode=null,modeTime=0;
  const imported={holder,meshes,clips:instance.animationGroups,head,pelvis,hand,staff,morphs,mode:'Idle',blink:0,lookYaw:0,lookPitch:0,dt:0,paused:false,seatY:null,reading:false,lookTarget:null,smile:0,drape:0,gazeDelta:B.Quaternion.Identity(),inverseGaze:B.Quaternion.Identity(),matrix:B.Matrix.Identity(),localTarget:B.Vector3.Zero()};
  function update(dt,{speaking=false,celebrating=false,pose=null,seatY=null,lookTarget=null}={}){
   clock+=dt;imported.dt=dt;const distance=B.Vector3.Distance(last,c.root.position);last.copyFrom(c.root.position);
   imported.paused=!c.root.isEnabled()||B.Vector3.DistanceSquared(c.root.getAbsolutePosition(),scene.activeCamera.position)>42*42;mixer.setPaused(imported.paused);if(imported.paused)return;
   const speed=distance>Math.max(2,dt*10)?0:distance/Math.max(.001,dt);
   const mode=pose||(celebrating?'Cheer':speaking?'Talk':c.activity==='Work'?'Work':c.activity==='Rest'?'Sit':c.activity==='Socialize'?'Talk':speed>2.2?'Run':c.activity==='Walk'||speed>.12?'Walk':'Idle');
   const next=clips[mode]||clips.Idle;imported.mode=mode;if(mode!==previousMode){previousMode=mode;modeTime=0;}else modeTime+=dt;
   mixer.select(next,{loop:!['Rise','Board'].includes(mode),phase:mode==='Idle'?seed/997:0});
   if(mode==='Walk'||mode==='Run'){const nominal=role==='gandalf'?(mode==='Run'?5.5:1.4):(mode==='Run'?3.4:.7);next.speedRatio=Math.max(mode==='Walk'?.2:.4,Math.min(2.6,speed/nominal));}else next.speedRatio=1;
   mixer.update(dt);imported.blink=blinkAmount(clock,seed);imported.reading=pose==='Sit';imported.seatY=['Ride','RideTalk'].includes(mode)?seatY:null;imported.lookTarget=lookTarget;
   const response=1-Math.exp(-dt*7);imported.smile+=((speaking||celebrating?.45:.1)-imported.smile)*response;
   const drape=mode==='Sit'||mode==='Ride'||mode==='RideTalk'?1:mode==='Rise'?Math.max(0,1-modeTime/1.2):0;imported.drape+=(drape-imported.drape)*response;
  }
  imported.update=update;c.imported=imported;actors.push(c);
 }
 // Undo only our last additive gaze before animation evaluation. This prevents
 // head drift on clips whose optimizer retained no varying head rotation keys.
 const before=scene.onBeforeAnimationsObservable.add(()=>{for(const c of actors){const a=c.imported;if(a.head.rotationQuaternion){a.gazeDelta.conjugateToRef(a.inverseGaze);a.head.rotationQuaternion.multiplyInPlace(a.inverseGaze);a.gazeDelta.copyFromFloats(0,0,0,1);}}});
 const after=scene.onAfterAnimationsObservable.add(()=>{
  for(const c of actors){const a=c.imported;if(!c.root.isEnabled()||a.paused)continue;
   if(a.seatY!==null){a.pelvis.computeWorldMatrix(true);const delta=a.seatY-a.pelvis.getAbsolutePosition().y;const parentScale=c.root.parent?B.Vector3.TransformNormal(B.Vector3.Up(),c.root.parent.getWorldMatrix()).y:1;c.root.position.y+=delta/parentScale;c.root.computeWorldMatrix(true);}
   for(const t of a.morphs.blink)t.influence=a.blink;for(const t of a.morphs.smile)t.influence=a.smile;for(const t of a.morphs.seated)t.influence=a.drape;
   let yaw=0,pitch=a.reading?.5:0;
   if(a.lookTarget){a.head.computeWorldMatrix(true);a.head.getWorldMatrix().invertToRef(a.matrix);B.Vector3.TransformCoordinatesToRef(a.lookTarget,a.matrix,a.localTarget);yaw=Math.max(-.35,Math.min(.35,Math.atan2(a.localTarget.x,a.localTarget.z)));pitch=Math.max(-.18,Math.min(.35,-Math.atan2(a.localTarget.y,Math.hypot(a.localTarget.x,a.localTarget.z))));}
   const response=1-Math.exp(-7.5*a.dt);a.lookYaw+=(yaw-a.lookYaw)*response;a.lookPitch+=(pitch-a.lookPitch)*response;
   for(const t of a.morphs.attention)t.influence=a.lookTarget?.35:.05;
   const eyeFactor=1-a.blink;for(const [key,value]of Object.entries({left:Math.max(0,a.lookYaw/.35),right:Math.max(0,-a.lookYaw/.35),down:a.reading?.85:Math.max(0,a.lookPitch/.35),up:Math.max(0,-a.lookPitch/.18)}))for(const t of a.morphs[key])t.influence=Math.min(1,value)*eyeFactor;
   if(a.head.rotationQuaternion){B.Quaternion.RotationYawPitchRollToRef(a.lookYaw,a.lookPitch,0,a.gazeDelta);a.head.rotationQuaternion.multiplyInPlace(a.gazeDelta);}
   if(a.staff&&a.hand){a.hand.computeWorldMatrix(true);a.holder.computeWorldMatrix(true);a.holder.getWorldMatrix().invertToRef(a.matrix);B.Vector3.TransformCoordinatesToRef(a.hand.getAbsolutePosition(),a.matrix,a.staff.position);}
  }
 });
 world.stats.importedCharacters=actors.length;world.stats.characterAssets='Quaternius CC0; authored natural Shire cast';world.stats.naturalCastRoles=4;world.stats.eyelidRigs=actors.filter(c=>c.imported.morphs.blink.length>=2).length;
 const focus=B.Vector3.Zero();
 return {actors,update(dt,activeNPC,party,cinema=null){for(const c of actors){let pose=null,target=null;
  if(cinema){pose=c.id==='frodo'?cinema.frodoMode:c.id==='gandalf'?(['Talk','Board'].includes(cinema.frodoMode)?'RideTalk':'Ride'):null;if(['Talk','Board'].includes(cinema.frodoMode)&&['frodo','gandalf'].includes(c.id)){const other=actors.find(a=>a.id===(c.id==='frodo'?'gandalf':'frodo'));other.imported.head.computeWorldMatrix(true);target=other.imported.head.getAbsolutePosition().add(new B.Vector3(0,CHARACTER_HEIGHTS[other.id]*.06,0));}}
  else if(c.id!=='player'&&B.Vector3.DistanceSquared(c.root.getAbsolutePosition(),world.body.position)<64){focus.copyFrom(world.body.position);focus.y+=.55;target=focus;}
  c.imported.update(dt,{speaking:c.id===activeNPC,celebrating:party,pose,seatY:cinema?.seatY??null,lookTarget:target?.clone()||null});
 }},dispose(){scene.onBeforeAnimationsObservable.remove(before);scene.onAfterAnimationsObservable.remove(after);}};
}
