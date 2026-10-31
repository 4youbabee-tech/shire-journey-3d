// Original in-world shot sequence, checked against the supplied screenplay; no copied dialogue.
import {dressMaterials} from './surface-art.mjs';
const ease=x=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};
export const ARRIVAL_DURATION=27;
export function arrivalBeat(t){
 if(t<5.4)return 'صباح هادئ تحت الشجرة؛ فرودو يقرأ، والشاير تستيقظ من حوله.';
 if(t<9)return 'من الطريق البعيد يقترب وقع الحوافر وصرير عربة خشبية…';
 if(t<15.5)return 'يعرف فرودو الضيف، فيركض عبر العشب إلى الطريق.';
 if(t<21)return 'لقاء قديم يعيد الدفء إلى الصباح؛ ولدى بيلبو الكثير ليحكيه.';
 return 'تتابع العربة طريقها نحو هوبيتون، ويبدأ يوم الاحتفال.';
}
export function arrivalPose(t){
 const s=Math.max(0,Math.min(ARRIVAL_DURATION,Number.isFinite(t)?t:0));
 const run=ease((s-7.2)/8.3),approach=ease((s-3)/12.5),ride=ease((s-22.6)/4.4),boarding=ease((s-20.4)/2.2);
 const cartZ=-25+6.5*approach+8.5*ride,boarded=s>=22.6,cartMoving=(s>3&&s<15.5)||s>22.6;
 const groundX=-10.9+11.5*run,groundZ=-14-5*run,cartY=cartMoving?.006*Math.sin(s*8):0;
 return {cartX:-1.2,cartZ,cartY,seatY:1.27+cartY,frodoX:groundX+(-.74-groundX)*boarding,frodoZ:groundZ+(cartZ-.2-groundZ)*boarding,
  frodoY:boarded?.95:.95*boarding+.25*Math.sin(Math.PI*boarding),boarding,boarded,step:cartMoving?Math.sin(s*10)*.42:0,
  frodoMode:s<5.4?'Sit':s<7.2?'Rise':s<15.5?'Run':s<20.4?'Talk':s<22.6?'Board':'Ride',
  book:s<5.4,cartMoving};
}
const angleMix=(a,b,t)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*t;
export function arrivalHeading(t,pose=arrivalPose(t)){
 const guest=Math.atan2(pose.cartX-pose.frodoX,pose.cartZ-pose.frodoZ)+Math.PI,travel=Math.atan2(11.5,-5)+Math.PI;
 if(t<7.2)return guest;
 const towardRoad=angleMix(guest,travel,ease((t-7.2)/.35));
 const greeting=angleMix(towardRoad,guest,ease((t-14.2)/1.3));
 return angleMix(greeting,Math.PI,pose.boarding);
}
export function createArrival(B,scene,world){
 const V=B.Vector3,M=B.MeshBuilder,root=new B.TransformNode('opening pony and cart',scene);
 function mat(name,hex){const m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(hex);m.specularColor=new B.Color3(.05,.05,.05);return m;}
 const brown=mat('pony coat','#866844'),dark=mat('leather and iron','#42372a'),wood=mat('cart timber','#87643c'),cream=mat('pony blaze','#e8d5a7'),linen=mat('travel sacks','#b5a17c');
 function sphere(name,material,x,y,z,sx,sy,sz,parent=root){const a=M.CreateSphere(name,{diameter:1,segments:8},scene);a.material=material;a.parent=parent;a.position.set(x,y,z);a.scaling.set(sx,sy,sz);a.isPickable=false;return a;}
 function box(name,material,x,y,z,w,h,d,parent=root){const a=M.CreateBox(name,{width:w,height:h,depth:d},scene);a.material=material;a.parent=parent;a.position.set(x,y,z);a.isPickable=false;return a;}
 sphere('pony torso',brown,0,1.05,1.5,.77,.86,1.38);
 sphere('pony neck',brown,0,1.39,2.05,.44,.74,.49);
 sphere('pony head',brown,0,1.72,2.36,.49,.48,.52);
 sphere('pony white muzzle',cream,0,1.54,2.61,.34,.23,.3);
 sphere('pony mane',dark,0,1.92,1.98,.3,.36,.37);
 sphere('pony tail',dark,0,1.17,.67,.2,.55,.23);
 for(const side of [-1,1]){sphere('pony ears',brown,side*.18,2.07,2.31,.12,.25,.12);
  sphere('pony eyes',dark,side*.245,1.74,2.53,.062,.066,.04);}
 const legs=[];
 for(const x of [-.22,.22])for(const z of [1.05,2.05]){
  const pivot=new B.TransformNode('pony articulated leg',scene);pivot.parent=root;pivot.position.set(x,.83,z);
  sphere('pony leg',brown,0,-.3,0,.18,.66,.19,pivot);
  sphere('pony hoof',dark,0,-.65,.02,.24,.13,.26,pivot);legs.push(pivot);
 }
 box('oak cart bed',wood,0,.78,-1.14,1.5,.16,2.4);
 box('cart rear wall',wood,0,1.04,-2.25,1.52,.5,.14);
 box('cart seat',wood,0,1.12,-.15,1.4,.16,.49);
 for(const x of [-.74,.74]){box('cart side rail',wood,x,1.12,-1.15,.1,.62,2.3);
  box('pony cart shaft',wood,x*.86,.68,.76,.085,.095,3.35);}
 sphere('travel bag',linen,.45,1.06,-.36,.47,.45,.52);
 box('cart front footboard',wood,0,.64,.44,1.25,.09,.42);
 const leather=[];
 function strap(name,points,radius){const path=B.Curve3.CreateCatmullRomSpline(points.map(p=>new V(...p)),8,false).getPoints();const mesh=M.CreateTube(name,{path,radius,tessellation:6},scene);mesh.material=dark;mesh.parent=root;mesh.isPickable=false;leather.push(mesh);}
 const girth=[];for(let i=0;i<=16;i++){const a=i/16*Math.PI*2;girth.push([Math.cos(a)*.34,1.12+Math.sin(a)*.36,1.75]);}strap('pony leather belly girth',girth,.018);
 for(const side of [-1,1]){strap('pony shaft trace',[[side*.31,1.12,1.75],[side*.53,.94,1.3],[side*.64,.7,.7]],.014);strap('driver leather rein',[[side*.21,1.46,2.55],[side*.39,1.26,1.7],[side*.36,1.34,.65],[side*.2,1.73,-.13]],.009);}
 const harness=B.Mesh.MergeMeshes(leather,true,true,undefined,false,false);if(harness){harness.name='cart leather harness and reins';harness.parent=root;harness.isPickable=false;}

 const wheels=[];
 for(const x of [-.92,.92]){
  const joint=new B.TransformNode('cart wheel joint',scene);joint.parent=root;joint.position.set(x,.58,-1.3);
  const torus=M.CreateTorus('cart spoked wheel outline',{diameter:1,thickness:.12,tessellation:16},scene);
  torus.material=dark;torus.parent=joint;torus.rotation.z=Math.PI/2;
  sphere('cart wheel hub',wood,0,0,0,.17,.17,.17,joint);
  for(let i=0;i<3;i++){const spoke=box('wooden wheel spoke',wood,0,0,0,.075,.92,.065,joint);spoke.rotation.x=i*Math.PI/3;}
  wheels.push(joint);
 }
 const gandalf=world.characters.find(c=>c.id==='gandalf'),frodo=world.characters.find(c=>c.id==='frodo');
 if(!gandalf||!frodo)throw Error('Opening characters not found');
 const book=new B.TransformNode('Frodo open reading book',scene);book.parent=frodo.root;book.position.set(0,.47,-.36);box('book leather cover',dark,0,0,0,.47,.035,.33,book);for(const side of [-1,1]){const page=box('open book pages',linen,side*.115,.04,0,.23,.025,.30,book);page.rotation.z=side*.18;}book.setEnabled(false);
 dressMaterials(B,scene,[wood,linen]);
 root.setEnabled(false);let active=false,horse=null,lastCartZ=null,wheelAngle=0;
 function begin(camera){
  if(active)return;active=true;lastCartZ=null;wheelAngle=0;root.setEnabled(true);
  world.player.root.setEnabled(false);
  gandalf.root.parent=root;gandalf.root.position.set(-.36,.16,-.2);gandalf.root.scaling.setAll(1);
  frodo.root.position.set(-10.9,0,-14);
  if(camera){camera.position.set(-7.7,2.1,-19);camera.setTarget(new V(-10.9,.9,-14));}
  update(0,camera);
 }
 function update(time,camera){
  const pose=arrivalPose(time);if(!active)return pose;horse?.setMoving(pose.cartMoving);
  root.position.set(pose.cartX,pose.cartY,pose.cartZ);
  if(lastCartZ!==null)wheelAngle+=(pose.cartZ-lastCartZ)/.5;lastCartZ=pose.cartZ;
  for(let i=0;i<legs.length;i++)legs[i].rotation.x=pose.step*(i%2?-1:1);
  for(const wheel of wheels)wheel.rotation.x=wheelAngle;
  frodo.root.position.set(pose.frodoX,pose.frodoY,pose.frodoZ);
  frodo.root.rotation.y=arrivalHeading(time,pose);
  book.setEnabled(pose.book);
  if(camera){
   const t=Math.max(0,Math.min(ARRIVAL_DURATION,time));let position,target;
   if(t<6){position=new V(-7.7-ease(t/6)*.5,2.1,-19);target=new V(-10.9,.9,-14);}
   else if(t<9){position=new V(9,4.3,pose.cartZ+3);target=new V(-1,1.5,pose.cartZ-.3);}
   else if(t<15.5){position=new V(pose.frodoX+5,2.5,pose.frodoZ-5.5);target=new V(pose.frodoX,1,pose.frodoZ);}
   else if(t<21){position=new V(5.7,2.7,-22.5);target=new V(-.8,1.6,-18);}
   else{position=new V(8.5,3.8,pose.cartZ+4.8);target=new V(-1,1.6,pose.cartZ-.5);}
   camera.position.copyFrom(position);camera.setTarget(target);
  }
  return pose;
 }
 function end(){
  if(!active)return;
  book.setEnabled(false);gandalf.root.parent=null;gandalf.root.position.set(-2,0,17);gandalf.root.rotation.y=Math.PI;gandalf.root.scaling.setAll(1);
  frodo.root.position.set(3,0,-4);frodo.root.scaling.setAll(.95);
  world.player.root.setEnabled(true);root.setEnabled(false);active=false;
 }
 return {begin,update,end,root,setHorse(value){horse=value;},get active(){return active;}};
}
export async function loadArrivalHorse(B,scene,arrival){
 const container=await B.SceneLoader.LoadAssetContainerAsync('./assets/characters/','horse.glb',scene);
 const instance=container.instantiateModelsToScene(n=>'arrival horse '+n,false,{doNotInstantiate:true});
 const holder=new B.TransformNode('reviewed skinned cart horse',scene);holder.parent=arrival.root;
 for(const node of instance.rootNodes)node.parent=holder;
 let min=Infinity,max=-Infinity;for(const m of holder.getChildMeshes()){m.computeWorldMatrix(true);const box=m.getBoundingInfo().boundingBox;min=Math.min(min,box.minimumWorld.y);max=Math.max(max,box.maximumWorld.y);m.isPickable=false;m.receiveShadows=true;}
 const scale=2.12/(max-min);holder.scaling.setAll(scale);holder.position.set(0,-min*scale,1.65);holder.rotation.y=0;
 for(const m of arrival.root.getChildMeshes())if(/^pony (torso|neck|head|white|mane|tail|ears|eyes|leg|hoof)/.test(m.name))m.dispose();
 for(const group of instance.animationGroups)group.stop();
 const idle=instance.animationGroups.find(g=>g.name.endsWith('Idle')),walk=instance.animationGroups.find(g=>g.name.endsWith('Walk'));if(!idle||!walk)throw Error('Horse locomotion clips missing');
 let last=null;
 arrival.setHorse({holder,setMoving(moving){const next=moving?walk:idle;if(next!==last){last?.stop();next.start(true);last=next;}}});
 arrival.horse={skinnedMeshes:holder.getChildMeshes().filter(m=>m.skeleton).length,clips:instance.animationGroups.length};
}

