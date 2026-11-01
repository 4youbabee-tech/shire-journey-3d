import {terrainHeightAt} from './terrain.mjs';
// Original neighbours: social routes and deliveries, separate from film quest characters.
export const RESIDENT_ROUTES=Object.freeze([
 {id:'resident-elsie',points:[[27,-8],[23,-5],[13,-6],[23,-5]],activity:'Socialize'},
 {id:'resident-rowan',points:[[11,7],[8,7],[4,6],[1,1],[4,6],[8,7]],activity:'Work'}
]);
export function addResidentRoots(B,scene,world){
 if(world.residents)return world.residents;
 world.residents=RESIDENT_ROUTES.map(route=>{const root=new B.TransformNode(route.id,scene);root.position.set(route.points[0][0],terrainHeightAt(...route.points[0]),route.points[0][1]);const joint=name=>new B.TransformNode(route.id+' placeholder '+name,scene),c={id:route.id,root,left:joint('left'),right:joint('right'),leftLeg:joint('left leg'),rightLeg:joint('right leg'),head:joint('head'),parts:[],route,activity:'Idle'};for(const n of [c.left,c.right,c.leftLeg,c.rightLeg,c.head])n.parent=root;world.characters.push(c);return c;});return world.residents;
}
export function createResidentLife(B,scene,world){
 const agents=(world.residents||[]).map((c,i)=>{const proxy=B.MeshBuilder.CreateSphere(c.id+' native walking proxy',{diameter:.4,segments:4},scene);proxy.isVisible=false;proxy.isPickable=false;proxy.ellipsoid=new B.Vector3(.3,.7,.3);proxy.position.copyFrom(c.root.position).addInPlace(new B.Vector3(0,.72,0));return {c,proxy,index:1,pause:i*2.5,last:c.root.position.clone()};});
 function update(dt,{paused=false}={}){for(const a of agents){const {c,proxy}=a;if(paused||!c.root.isEnabled()){c.activity='Idle';continue;}if(a.pause>0){a.pause-=dt;c.activity=a.pause>1.4?c.route.activity:'Idle';continue;}const [x,z]=c.route.points[a.index],dx=x-proxy.position.x,dz=z-proxy.position.z,d=Math.hypot(dx,dz);if(d<.25){a.index=(a.index+1)%c.route.points.length;a.pause=3.5;c.activity=c.route.activity;continue;}const step=Math.min(d,dt*.88),collider=scene.getMeshByName(c.id+' collision volume');if(collider)collider.checkCollisions=false;proxy.moveWithCollisions(new B.Vector3(dx/d*step,-.12,dz/d*step));if(collider)collider.checkCollisions=true;const moved=B.Vector3.DistanceSquared(c.root.position,a.last);a.last.copyFrom(c.root.position);c.root.position.set(proxy.position.x,terrainHeightAt(proxy.position.x,proxy.position.z),proxy.position.z);proxy.position.y=c.root.position.y+.72;const desired=Math.atan2(dx,dz)+Math.PI,diff=Math.atan2(Math.sin(desired-c.root.rotation.y),Math.cos(desired-c.root.rotation.y));c.root.rotation.y+=diff*(1-Math.exp(-dt*4));c.activity=moved>.00001?'Walk':'Idle';}}
 return {update,dispose(){agents.forEach(a=>a.proxy.dispose());}};
}
