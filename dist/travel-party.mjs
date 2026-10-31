// The actual Frodo rig becomes the controlled actor; Sam follows travelled breadcrumbs.
import {terrainHeightAt} from './terrain.mjs';
export function createTravelParty(B,scene,world){
 const frodo=world.characters.find(c=>c.id==='frodo'),sam=world.characters.find(c=>c.id==='sam'),visitor=world.player;
 const proxy=B.MeshBuilder.CreateSphere('Sam travelling collision proxy',{diameter:1,segments:4},scene);proxy.isVisible=false;proxy.isPickable=false;proxy.ellipsoid=new B.Vector3(.32,.7,.32);proxy.checkCollisions=false;let active=false,trail=[];
 const packs=[frodo,sam].map(c=>{const root=new B.TransformNode(c.id+' journey knapsack',scene);root.parent=c.root;root.position.set(0,.94,.2);const cloth=new B.StandardMaterial(c.id+' travel canvas',scene);cloth.diffuseColor=B.Color3.FromHexString(c.id==='sam'?'#857852':'#756b48');const leather=new B.StandardMaterial(c.id+' travel straps',scene);leather.diffuseColor=B.Color3.FromHexString('#58402c');const bag=B.MeshBuilder.CreateCapsule(c.id+' packed canvas bag',{height:.43,radius:.16,tessellation:12,subdivisions:2},scene);bag.scaling.z=.66;bag.parent=root;bag.material=cloth;const roll=B.MeshBuilder.CreateCylinder(c.id+' rolled bedroll',{height:.4,diameter:.14,tessellation:12},scene);roll.parent=root;roll.position.y=.24;roll.rotation.z=Math.PI/2;roll.material=cloth;for(const x of [-.11,.11]){const strap=B.MeshBuilder.CreateBox(c.id+' knapsack leather strap',{width:.035,height:.4,depth:.018},scene);strap.parent=root;strap.position.set(x,0,.105);strap.material=leather;}for(const m of root.getChildMeshes())m.isPickable=false;root.setEnabled(false);return root;});
 const showPacks=on=>packs.forEach(p=>p.setEnabled(on));
 function placeFollower(){
  trail=[];const p=world.body.position;proxy.position.set(p.x+.9,.72+terrainHeightAt(p.x+.9,p.z-1.1),p.z-1.1);
  sam.root.position.set(proxy.position.x,terrainHeightAt(proxy.position.x,proxy.position.z),proxy.position.z);sam.activity='Idle';
 }
 const ownCollider=id=>scene.getMeshByName(id+' collision volume');
 function setActive(on){active=on;showPacks(on);visitor.root.setEnabled(!on);ownCollider('frodo').checkCollisions=!on;ownCollider('sam').checkCollisions=!on;frodo.controlled=on;sam.travelling=on;trail=[];if(!on){sam.root.position.set(-6,0,1);frodo.root.position.set(3,0,-4);}if(on){frodo.root.setEnabled(true);sam.root.setEnabled(true);placeFollower();}}
 function update(dt,{inside=false}={}){if(!active)return;frodo.root.position.copyFrom(visitor.root.position);frodo.root.rotation.y=visitor.root.rotation.y;visitor.root.setEnabled(false);ownCollider('frodo').checkCollisions=false;ownCollider('sam').checkCollisions=false;if(inside){sam.activity='Idle';return;}
  const p=world.body.position,last=trail.at(-1);if(!last||B.Vector3.DistanceSquared(last,p)>.45*.45)trail.push(p.clone());if(trail.length>180)trail.shift();
  let target=trail[0];if(!target)return;let remaining=0;for(let i=1;i<trail.length;i++)remaining+=B.Vector3.Distance(trail[i-1],trail[i]);
  if(remaining<1.5){sam.activity='Idle';return;}
  if(B.Vector3.DistanceSquared(proxy.position,target)<.35*.35){trail.shift();target=trail[0]||p;}
  const delta=target.subtract(proxy.position);delta.y=0;const distance=delta.length();if(distance<.08){sam.activity='Idle';return;}delta.scaleInPlace(1/distance);const step=Math.min(distance,(remaining>4?2.5:1.65)*dt);proxy.moveWithCollisions(new B.Vector3(delta.x*step,-.12,delta.z*step));proxy.position.y=.72+terrainHeightAt(proxy.position.x,proxy.position.z);sam.root.position.set(proxy.position.x,terrainHeightAt(proxy.position.x,proxy.position.z),proxy.position.z);sam.root.rotation.y=Math.atan2(delta.x,delta.z)+Math.PI;sam.activity='Walk';
 }
 return {setActive,update,showPacks,resetFollower(){if(active)placeFollower();},get active(){return active;},dispose(){proxy.dispose();}};
}
