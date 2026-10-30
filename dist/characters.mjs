// KayKit CC0 skinned characters; scene interaction/collision roots remain authoritative.
export async function loadCharacters(B,scene,world){
 const assets={};
 for(const kind of ['traveller','wizard']){
  const asset=await B.SceneLoader.LoadAssetContainerAsync('./assets/characters/',kind+'.glb',scene);
  for(const group of asset.animationGroups)group.stop();assets[kind]=asset;
 }
 const actors=[];
 for(const c of world.characters){
  const kind=c.id==='gandalf'?'wizard':'traveller';
  const instance=assets[kind].instantiateModelsToScene(n=>c.id+' '+n,false,{doNotInstantiate:true});
  const holder=new B.TransformNode(c.id+' imported rig',scene);holder.parent=c.root;
  for(const node of instance.rootNodes)node.parent=holder;
  const meshes=holder.getChildMeshes();
  // Source models stand on y=0; normalize their authored bounding height once.
  let min=Infinity,max=-Infinity;
  for(const m of meshes){m.computeWorldMatrix(true);const box=m.getBoundingInfo().boundingBox;min=Math.min(min,box.minimumWorld.y);max=Math.max(max,box.maximumWorld.y);m.isPickable=false;m.receiveShadows=true;if(world.shadow)world.shadow.addShadowCaster(m);}
  const height=c.id==='gandalf'?3.1:1.8;
  const scale=height/(max-min);holder.scaling.setAll(scale);holder.position.y=-min*scale;holder.rotation.y=Math.PI;
  for(const m of c.parts){world.shadow?.removeShadowCaster(m);m.dispose(false,false);}
  const palette=c.id==='gandalf'?'gandalf':['player','bilbo','sam','frodo'].includes(c.id)?c.id:null;
  if(palette)for(const material of new Set(meshes.map(m=>m.material).filter(m=>m?.albedoTexture))){
   const copy=material.clone(c.id+' costume');copy.albedoTexture=new B.Texture('./assets/characters/'+palette+'.png',scene,false,false);
   for(const m of meshes)if(m.material===material)m.material=copy;
  }
  const clips=new Map(instance.animationGroups.map(g=>[g.name.replace(c.id+' ',''),g]));
  for(const g of instance.animationGroups){g.stop();g.enableBlending=true;g.blendingSpeed=.08;}
  const find=name=>instance.animationGroups.find(g=>g.name.endsWith(name));
  const idle=find('Idle'),walk=find('Walking_A'),run=find('Running_A'),interact=find('Interact'),cheer=find('Cheer');
  if(!idle||!walk||!run)throw Error('Missing locomotion clips for '+c.id);
  let active=null,last=c.root.position.clone();
  function update(dt,{speaking=false,celebrating=false}={}){
   const distance=B.Vector3.Distance(last,c.root.position);last.copyFrom(c.root.position);
   const speed=distance/Math.max(.001,dt);
   const next=celebrating?cheer:speaking?interact:speed>3.6?run:speed>.25?walk:idle;
   if(next!==active){active?.stop();next?.start(true);active=next;}
  }
  c.imported={holder,meshes,clips:instance.animationGroups,update};actors.push(c);
 }
 world.stats.importedCharacters=actors.length;world.stats.characterAssets='KayKit Adventurers CC0';
 return {actors,update(dt,activeNPC,party){for(const c of actors)c.imported.update(dt,{speaking:c.id===activeNPC,celebrating:party});}};
}

