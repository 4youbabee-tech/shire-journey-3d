// Sweep a small camera volume, including the near-plane margins. Resolve AFTER
// smoothing so interpolation cannot put the camera back inside a wall or roof.
export function resolveCameraObstruction(B,scene,colliders,target,desired,{radius=.55,padding=.28}={}){
 const delta=desired.subtract(target),length=delta.length();if(length<.001)return desired.clone();
 const direction=delta.scale(1/length),right=B.Vector3.Cross(B.Vector3.Up(),direction).normalize(),up=B.Vector3.Cross(direction,right).normalize();
 let safe=length;
 const eligible=new Set(colliders.filter(m=>m.isEnabled()&&m.metadata?.cameraBlocker!==false));
 for(const [x,y] of [[0,0],[-1,-1],[-1,1],[1,-1],[1,1]]){
  const offset=right.scale(x*radius).add(up.scale(y*radius));
  const hit=scene.pickWithRay(new B.Ray(target.add(offset),direction,length),m=>eligible.has(m));
  if(hit?.hit&&hit.distance>.05)safe=Math.min(safe,Math.max(.3,hit.distance-padding));
 }
 return target.add(direction.scale(safe));
}
