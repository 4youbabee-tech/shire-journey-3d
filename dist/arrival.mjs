// Original low-poly arrival vignette, with independent meshes and no film dialogue.
const ease=x=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};
export function arrivalBeat(t){
 if(t<5)return 'على طريق الشاير القديم، تقترب عربة ضيف عزيز…';
 if(t<10)return 'يلمح فرودو العربة فيلوّح، ثم يهرع عبر العشب للقاء غاندالف.';
 return 'تتابع العربة طريقها بين البيوت والحدائق، ويبدأ صباح جديد.';
}
export function arrivalPose(t){
 const s=Math.max(0,Math.min(17,Number.isFinite(t)?t:0)),travel=ease(s/15),run=ease((s-5)/6);
 return {cartX:-1.2+.3*travel,cartZ:-23+13*travel,frodoX:2.8-2.5*run,frodoZ:-6-7*run,
  boarded:s>=12,step:s>=15?0:Math.sin(s*10)*.42};
}
export function createArrival(B,scene,world){
 const V=B.Vector3,M=B.MeshBuilder,root=new B.TransformNode('opening pony and cart',scene);
 function mat(name,hex){const m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(hex);m.specularColor=new B.Color3(.05,.05,.05);return m;}
 const brown=mat('pony coat','#866844'),dark=mat('leather and iron','#42372a'),wood=mat('cart timber','#87643c'),cream=mat('pony blaze','#e8d5a7'),linen=mat('travel sacks','#b5a17c');
 function sphere(name,material,x,y,z,sx,sy,sz,parent=root){const a=M.CreateSphere(name,{diameter:1,segments:8},scene);a.material=material;a.parent=parent;a.position.set(x,y,z);a.scaling.set(sx,sy,sz);a.isPickable=false;return a;}
 function box(name,material,x,y,z,w,h,d,parent=root){const a=M.CreateBox(name,{width:w,height:h,depth:d},scene);a.material=material;a.parent=parent;a.position.set(x,y,z);a.isPickable=false;return a;}
 sphere('pony torso',brown,0,1.05,1.5,.72,.87,1.45);
 sphere('pony neck',brown,0,1.48,2,.46,.93,.52);
 sphere('pony head',brown,0,1.89,2.34,.5,.55,.68);
 sphere('pony white muzzle',cream,0,1.65,2.67,.36,.3,.43);
 sphere('pony mane',dark,0,2,1.93,.32,.52,.5);
 sphere('pony tail',dark,0,1.17,.67,.2,.55,.23);
 for(const side of [-1,1]){sphere('pony ears',brown,side*.19,2.25,2.21,.17,.36,.17);
  sphere('pony eyes',dark,side*.25,1.87,2.5,.1,.09,.06);}
 const legs=[];
 for(const x of [-.22,.22])for(const z of [1.05,2.05]){
  const pivot=new B.TransformNode('pony articulated leg',scene);pivot.parent=root;pivot.position.set(x,.83,z);
  sphere('pony leg',brown,0,-.3,0,.18,.66,.19,pivot);
  sphere('pony hoof',dark,0,-.65,.02,.24,.13,.26,pivot);legs.push(pivot);
 }
 box('oak cart bed',wood,0,.78,-1.14,1.5,.16,2.4);
 box('cart rear wall',wood,0,1.04,-2.25,1.52,.5,.14);
 box('cart seat',wood,0,1.12,-1.55,1.4,.16,.49);
 for(const x of [-.74,.74]){box('cart side rail',wood,x,1.12,-1.15,.1,.62,2.3);
  box('pony cart shaft',wood,x*.86,.68,.76,.085,.095,3.35);}
 sphere('travel bag',linen,.45,1.06,-.36,.47,.45,.52);
 const wheels=[];
 for(const x of [-.92,.92]){
  const joint=new B.TransformNode('cart wheel joint',scene);joint.parent=root;joint.position.set(x,.58,-1.3);
  const torus=M.CreateTorus('cart spoked wheel outline',{diameter:1,thickness:.12,tessellation:16},scene);
  torus.material=dark;torus.parent=joint;torus.rotation.y=Math.PI/2;
  sphere('cart wheel hub',wood,0,0,0,.17,.17,.17,joint);
  wheels.push(joint);
 }
 const gandalf=world.characters.find(c=>c.id==='gandalf'),frodo=world.characters.find(c=>c.id==='frodo');
 if(!gandalf||!frodo)throw Error('Opening characters not found');
 root.setEnabled(false);let active=false;
 function begin(){
  if(active)return;active=true;root.setEnabled(true);
  world.player.root.setEnabled(false);
  gandalf.root.parent=root;gandalf.root.position.set(-.26,.86,-1.62);gandalf.root.scaling.setAll(.82);
  frodo.root.position.set(2.8,0,-6);update(0);
 }
 function update(time,camera){
  const pose=arrivalPose(time);if(!active)return pose;
  root.position.set(pose.cartX,.012*Math.sin(time*8),pose.cartZ);
  for(let i=0;i<legs.length;i++)legs[i].rotation.x=pose.step*(i%2?-1:1);
  for(const wheel of wheels)wheel.rotation.x=-time*1.3;
  frodo.root.position.set(pose.boarded?pose.cartX+.45:pose.frodoX,pose.boarded?.84:0,pose.boarded?pose.cartZ-1.4:pose.frodoZ);
  frodo.root.rotation.y=Math.PI;
  if(camera){
   const at=time<5?new V(6,3.7,pose.cartZ+1):time<11?new V(5,3.3,-9):new V(6,4,pose.cartZ+2);
   const look=time<5?new V(-1,1.4,pose.cartZ+1):time<11?new V(0,1.3,-11):new V(-1,1.7,pose.cartZ-.5);
   camera.position.copyFrom(V.Lerp(camera.position,at,.18));camera.setTarget(look);
  }
  return pose;
 }
 function end(){
  if(!active)return;
  gandalf.root.parent=null;gandalf.root.position.set(-2,0,17);gandalf.root.rotation.y=Math.PI;gandalf.root.scaling.setAll(1);
  frodo.root.position.set(3,0,-4);frodo.root.scaling.setAll(.95);
  world.player.root.setEnabled(true);root.setEnabled(false);active=false;
 }
 return {begin,update,end,root,get active(){return active;}};
}
