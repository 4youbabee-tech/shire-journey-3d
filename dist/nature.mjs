import {ROADS,HOMES} from './village-layout.mjs';
// CC0 Quaternius nature. Existing world anchors/colliders remain authoritative.
export async function loadNature(B,scene,world){
 const sources={};
 for(const name of ['maple-a','maple-b','grass','flowers']){
  const source=await B.SceneLoader.LoadAssetContainerAsync('./assets/environment/',name+'.glb',scene);
  sources[name]=source;
  for(const m of source.materials){m.environmentIntensity=.65;m.backFaceCulling=false;}
 }
 let trees=0,patches=0;
 function plant(name,x,z,height,yaw,label,lift=0){
  const source=sources[name],copy=source.instantiateModelsToScene(n=>label+' '+n,false,{doNotInstantiate:false}),root=new B.TransformNode(label,scene);
  for(const n of copy.rootNodes)n.parent=root;
  let low=Infinity,high=-Infinity;
  for(const m of root.getChildMeshes()){m.computeWorldMatrix(true);const b=m.getBoundingInfo().boundingBox;low=Math.min(low,b.minimumWorld.y);high=Math.max(high,b.maximumWorld.y);m.isPickable=false;m.receiveShadows=true;if(name.startsWith('maple'))world.shadow?.addShadowCaster(m);}
  const scale=height/(high-low);root.scaling.setAll(scale);root.position.set(x,-low*scale+lift,z);root.rotation.y=yaw;
  if(!name.startsWith('maple')){root.computeWorldMatrix(true);root.freezeWorldMatrix();for(const m of root.getChildMeshes()){m.computeWorldMatrix(true);m.freezeWorldMatrix();}}
  return root;
 }
 for(const [i,a]of world.treeAnchors.entries()){
  const root=plant(i%2?'maple-b':'maple-a',a.x,a.z,5.4*a.s,i*2.399,'living tree '+i);
  // Small asymmetric sway uses the existing world leaf updater, not a second loop.
  world.leaves.push({root,phase:i*1.73,amplitude:.004+(i%3)*.001});trees++;
  // Sparse understory remains within existing tree bounds, away from village routes.
  for(let j=0;j<5;j++){const angle=j*2.399+i,r=1.1+(j%3)*.32;plant(j%3?'grass':'flowers',a.x+Math.cos(angle)*r,a.z+Math.sin(angle)*r,j%3?.28:.34,angle,'understory '+i+' '+j);patches++;}
 }
 // Real textured leaf/flower clusters replace the former smooth green balls.
 for(const [i,a]of (world.hedgeAnchors||[]).entries())for(let j=0;j<3;j++){
  const angle=j*2.399+i,spread=j? .24:0;
  plant(j===2?'flowers':'grass',a.x+Math.cos(angle)*spread,a.z+Math.sin(angle)*spread,a.sy*(j===2?.62:.8),angle,'garden shrub '+i+' '+j);patches++;
 }
 for(const [i,h]of HOMES.entries())for(const side of [-1,1]){
  plant('flowers',h.x+side*1.92*h.s,h.z-.8*h.s,.43*h.s,i*1.73+side,'window planter '+i+' '+side,.82*h.s);patches++;
 }
 // Shared instances soften existing path shoulders without changing walkable roads.
 const placementBounds=world.colliders.filter(c=>!c.metadata?.vegetation).map(c=>{c.computeWorldMatrix(true);const b=c.getBoundingInfo().boundingBox;return {minX:b.minimumWorld.x-.22,maxX:b.maximumWorld.x+.22,minZ:b.minimumWorld.z-.22,maxZ:b.maximumWorld.z+.22};});
 let roadside=0;
 for(const [ri,road]of ROADS.entries()){
  const points=B.Curve3.CreateCatmullRomSpline(road.points.map(([x,z])=>new B.Vector3(x,0,z)),10,false).getPoints();
  for(let i=2;i<points.length-2&&roadside<220;i+=2)for(const side of [-1,1]){
   if(roadside>=220)break;
   const tangent=points[i+1].subtract(points[i-1]).normalize(),normal=new B.Vector3(tangent.z,0,-tangent.x),seed=ri*173+i*29+side*7;
   const distance=road.width/2+.36+(Math.sin(seed*1.73)+1)*.22,p=points[i].add(normal.scale(distance*side));
   if(world.characters.some(c=>B.Vector3.DistanceSquared(c.root.position,p)<2.25))continue;
   const obstructed=placementBounds.some(b=>p.x>b.minX&&p.x<b.maxX&&p.z>b.minZ&&p.z<b.maxZ);
   if(obstructed)continue;
   plant(seed%3===0?'flowers':'grass',p.x,p.z,.22+(Math.sin(seed)+1)*.055,seed*2.399,'roadside meadow '+roadside);roadside++;patches++;
  }
 }
 world.stats.nature={trees,patches,roadside,source:'Quaternius CC0',textureMax:512};world.stats.animatedCanopies=world.leaves.length;
 return {sources};
}
