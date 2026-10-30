// CC0 Quaternius nature. Existing world anchors/colliders remain authoritative.
export async function loadNature(B,scene,world){
 const sources={};
 for(const name of ['maple-a','maple-b','grass','flowers']){
  const source=await B.SceneLoader.LoadAssetContainerAsync('./assets/environment/',name+'.glb',scene);
  sources[name]=source;
  for(const m of source.materials){m.environmentIntensity=.65;m.backFaceCulling=false;}
 }
 let trees=0,patches=0;
 function plant(name,x,z,height,yaw,label){
  const source=sources[name],copy=source.instantiateModelsToScene(n=>label+' '+n,false,{doNotInstantiate:false}),root=new B.TransformNode(label,scene);
  for(const n of copy.rootNodes)n.parent=root;
  let low=Infinity,high=-Infinity;
  for(const m of root.getChildMeshes()){m.computeWorldMatrix(true);const b=m.getBoundingInfo().boundingBox;low=Math.min(low,b.minimumWorld.y);high=Math.max(high,b.maximumWorld.y);m.isPickable=false;m.receiveShadows=true;if(name.startsWith('maple'))world.shadow?.addShadowCaster(m);}
  const scale=height/(high-low);root.scaling.setAll(scale);root.position.set(x,-low*scale,z);root.rotation.y=yaw;
  return root;
 }
 for(const [i,a]of world.treeAnchors.entries()){
  const root=plant(i%2?'maple-b':'maple-a',a.x,a.z,5.4*a.s,i*2.399,'living tree '+i);
  // Small asymmetric sway uses the existing world leaf updater, not a second loop.
  world.leaves.push({root,phase:i*1.73,amplitude:.004+(i%3)*.001});trees++;
  // Sparse understory remains within existing tree bounds, away from village routes.
  for(let j=0;j<5;j++){const angle=j*2.399+i,r=1.1+(j%3)*.32;plant(j%3?'grass':'flowers',a.x+Math.cos(angle)*r,a.z+Math.sin(angle)*r,j%3?.28:.34,angle,'understory '+i+' '+j);patches++;}
 }
 world.stats.nature={trees,patches,source:'Quaternius CC0',textureMax:512};world.stats.animatedCanopies=world.leaves.length;
 return {sources};
}
