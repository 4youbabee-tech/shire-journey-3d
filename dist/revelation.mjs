// Original in-engine staging. Film screenplay factual sequence pp33–45; no film dialogue.
import {terrainHeightAt} from './terrain.mjs';
export const REVELATION_SECONDS=60;
export function revelationBeat(t){
 if(t<7)return {id:'archives',caption:'في سجلات ميناس تيريث، يبحث غاندالف عن أثر خاتم قديم وعن اختبار لا يكشفه إلا اللهب.'};
 if(t<12)return {id:'return',caption:'عاد غاندالف إلى باج إند، وطلب من فرودو الظرف الذي حفظه بعيدًا عن العيون.'};
 if(t<16)return {id:'fire',caption:'يلقي الظرف المختوم في المدفأة؛ يحترق الورق ويبقى الخاتم بين الجمر.'};
 if(t<21)return {id:'tongs',caption:'يرفع غاندالف الخاتم بملقط، ثم يضعه في يد فرودو. المعدن بارد رغم النار.'};
 if(t<28)return {id:'writing',caption:'تظهر خطوط مضيئة على الذهب في كف فرودو. لقد كشف اللهب حقيقة الخاتم.'};
 if(t<34)return {id:'danger',caption:'هذا هو الخاتم الواحد، ويرتبط خطره بعودة ساورون. لم تعد الشاير مخبأ آمنًا له.'};
 if(t<41)return {id:'window',caption:'صوت عند النافذة! يكتشف غاندالف سام، الذي سمع حديث الخاتم. سيبقى إلى جانب فرودو.'};
 if(t<46)return {id:'packing',caption:'يُخفى الخاتم في جيب فرودو. يحمل هو وسام الزاد، ويستعدان للخروج بهدوء.'};
 if(t<54)return {id:'field',caption:'قبل الفجر، يعبر فرودو وسام الحقل مع غاندالف وحصانه؛ لن تبدأ الرحلة وحيدًا.'};
 return {id:'farewell',caption:'عند حافة الأشجار، يركب غاندالف حصانه ويمضي. يبقى فرودو وسام معًا على الطريق.'};
}
export function createRevelation(B,scene,world,room,{horse=null,onFire=()=>{},onPacking=()=>{}}={}){
 const V=B.Vector3,M=B.MeshBuilder,cast=Object.fromEntries(world.characters.map(c=>[c.id,c]));
 const gold=new B.StandardMaterial('revealed Ring gold',scene);gold.diffuseColor=B.Color3.FromHexString('#d7aa42');gold.specularColor=new B.Color3(1,.9,.6);gold.specularPower=100;
 const paper=new B.StandardMaterial('burning envelope paper',scene);paper.diffuseColor=B.Color3.FromHexString('#dbc8a5');
 const iron=new B.StandardMaterial('hearth tongs iron',scene);iron.diffuseColor=new B.Color3(.13,.12,.1);
 const wax=new B.StandardMaterial('revelation red wax',scene);wax.diffuseColor=B.Color3.FromHexString('#8c3226');
 const ring=M.CreateTorus('revealed One Ring',{diameter:.036,thickness:.008,tessellation:48},scene);ring.material=gold;
 const envelope=M.CreateBox('sealed envelope before fire',{width:.24,height:.16,depth:.014},scene);envelope.material=paper;
 const seal=M.CreateCylinder('revelation envelope seal',{diameter:.04,height:.008,tessellation:16},scene);seal.material=wax;seal.rotation.x=Math.PI/2;seal.parent=envelope;seal.position.z=.013;
 const tongs=new B.TransformNode('Gandalf actual hearth tongs',scene);
 for(const side of [-1,1]){const rod=M.CreateTube('tongs arm',{path:[new V(side*.025,0,0),new V(side*.035,0,.23),new V(side*.012,0,.32)],radius:.006,tessellation:6},scene);rod.parent=tongs;rod.material=iron;}
 const runeMat=new B.StandardMaterial('original revealed glyph light',scene);runeMat.emissiveColor=new B.Color3(1,.32,.035);runeMat.disableLighting=true;
 // Original abstract strokes, not a reproduction of Tolkien's inscription or its text.
 const glyphs=[];for(let i=0;i<16;i++){const angle=i/16*Math.PI*2,points=[[-.045,-.002],[0,.003],[.04,-.001]].map(([a,y])=>new V(Math.cos(angle+a)*.0225,y,Math.sin(angle+a)*.0225));const glyph=M.CreateTube('original Ring light stroke',{path:points,radius:.0006,tessellation:4},scene);glyph.material=runeMat;glyph.parent=ring;glyphs.push(glyph);}
 const props=[ring,envelope,seal,...tongs.getChildMeshes(),...glyphs];for(const p of props)p.isPickable=false;
 // A bounded archive insert: original shelves/books, not a claim to a playable Gondor region.
 const archive=[];const oak=new B.StandardMaterial('archive old oak',scene);oak.diffuseColor=B.Color3.FromHexString('#5e4832');
 const stone=new B.StandardMaterial('archive warm stone',scene);stone.diffuseColor=B.Color3.FromHexString('#b4a58a');
 function box(name,x,y,z,w,h,d,mat){const m=M.CreateBox(name,{width:w,height:h,depth:d},scene);m.position.set(x,y,z);m.material=mat;m.isPickable=false;archive.push(m);return m;}
 box('archive floor',205,-.12,201,10,.24,9,stone);box('archive wall',205,2.8,204,10,5.6,.3,stone);box('archive reading desk',205,1.13,201.3,2.5,.16,1.4,oak);
 for(const y of [.8,1.7,2.6,3.5]){box('archive book shelf',205,y,203.5,7,.12,.7,oak);for(let i=0;i<14;i++)box('archive bound volume',201.8+i*.46,y+.36,203.4,.24,.6,.48,i%3?oak:stone);}
 const page=box('Isildur account open folio',205,1.24,201.3,.85,.035,.65,stone);page.rotation.y=.12;
 const light=new B.PointLight('archive reading lamp',new V(205,3.6,200),scene);light.diffuse=new B.Color3(1,.74,.42);light.range=10;light.intensity=1.1;
 let active=false,t=0,saved=[],enabled=[],lighting=null,near=.15,fov=.87,fired=false;
 const clamp=x=>Math.max(0,Math.min(1,x)),lerp=(a,b,x)=>V.Lerp(a,b,clamp(x)),nodes=new Map();
 function joint(id,name){const key=id+name;if(!nodes.has(key)){const ns=cast[id].imported.holder.getChildTransformNodes();nodes.set(key,ns.find(n=>n.name===id+' '+name)||ns.find(n=>n.name===id+' hand_r'));}const n=nodes.get(key);n.computeWorldMatrix(true);return n.getAbsolutePosition();}
 const hand=id=>lerp(joint(id,'hand_r'),joint(id,'middle_01_r'),.65).add(new V(0,.015,.025));
 const setArchive=on=>{for(const m of archive)m.setEnabled(on);light.setEnabled(on);};
 const face=(id,target)=>{const p=cast[id].root.position;cast[id].root.rotation.y=Math.atan2(target.x-p.x,target.z-p.z)+Math.PI;};
 function place(id,x,y,z){cast[id].root.position.set(x,y,z);cast[id].root.setEnabled(true);}
 function begin(){
  if(active)return;active=true;t=0;fired=false;saved=world.characters.map(c=>({c,p:c.root.position.clone(),r:c.root.rotation.clone(),on:c.root.isEnabled()}));
  const keep=new Set(['gandalf','frodo','sam'].flatMap(id=>cast[id].root.getChildMeshes()));
  enabled=scene.meshes.filter(m=>m.isEnabled()&&!keep.has(m)&&!props.includes(m)&&!archive.includes(m)&&!room.meshes.includes(m)&&!horse?.root.getChildMeshes().includes(m));for(const m of enabled)m.setEnabled(false);
  for(const c of world.characters)c.root.setEnabled(['gandalf','frodo','sam'].includes(c.id));
  lighting={sun:world.sun.isEnabled(),hemi:world.hemi.intensity};world.sun.setEnabled(false);world.hemi.intensity=.35;near=scene.activeCamera.minZ;fov=scene.activeCamera.fov;scene.activeCamera.minZ=.008;scene.activeCamera.fov=.72;room.setActive(false);setArchive(true);horse?.root.setEnabled(false);update(0);
 }
 function update(seconds){t=Math.max(0,Math.min(REVELATION_SECONDS,seconds));setArchive(t<7);room.setActive(t>=7&&t<46);room.openWindow(t>=34&&t<41);
  if(t<7){place('gandalf',205,0,200.2);face('gandalf',new V(205,1.2,201.3));cast.frodo.root.setEnabled(false);cast.sam.root.setEnabled(false);}
  else if(t<46){place('gandalf',156.7,0,151.55);place('frodo',157.6,0,151.2);cast.sam.root.setEnabled(t>=34);face('gandalf',t<20?new V(156,.7,153):cast.frodo.root.position);face('frodo',t<20?new V(156,.7,153):cast.gandalf.root.position);
   if(t>=34&&t<41){const a=clamp((t-35)/4);place('sam',146.25+3.1*a,.83*(1-a)+1.6*Math.sin(a*Math.PI),149);cast.sam.root.rotation.y=-Math.PI/2;place('gandalf',150.3,0,149.2);face('gandalf',cast.sam.root.position);face('frodo',cast.sam.root.position);}
   else if(t>=41){place('sam',158.8,0,149.8);face('sam',cast.frodo.root.position);}
  }else{
   const z=-5+(t-46)*.72,x=-3;for(const [id,dx,dz]of [['frodo',0,0],['sam',1.15,-.6],['gandalf',-1.7,1]]){const cz=z+dz,cx=x+dx;place(id,cx,terrainHeightAt(cx,cz),cz);cast[id].root.rotation.y=Math.PI;}
   if(horse){horse.root.setEnabled(true);horse.root.position.set(x-2.5,terrainHeightAt(x-2.5,z+1),z+1);horse.setMoving(t<53||t>=56);if(t>=54){const depart=Math.max(0,t-56)*2.2;horse.root.position.z+=depart;place('gandalf',horse.root.position.x,horse.root.position.y+1.35,horse.root.position.z);}}
   world.sun.setEnabled(lighting.sun);world.hemi.intensity=.4;
   for(const m of enabled)if(!m.isDisposed()&&!m.name.includes('collision volume')&&!m.isDescendantOf?.(world.player.root))m.setEnabled(true);
  }
  onPacking(t>=41);
  if(t>=12&&!fired){fired=true;onFire();}
  const modes={gandalf:t<7||t>=28&&t<34?'Talk':t>=54?'Ride':t>=46&&t<53?'Walk':'Idle',frodo:t>=41&&t<44?'Work':t>=46&&t<53?'Walk':'Idle',sam:t>=35&&t<39?'Board':t>=41&&t<44?'Work':t>=46&&t<53?'Walk':'Idle'};
  return {actorModes:modes,actorTargets:{gandalf:t<7?new V(205,1.3,201.3):cast.frodo.root.position.add(new V(0,1.3,0)),frodo:cast.gandalf.root.position.add(new V(0,2.1,0)),sam:cast.frodo.root.position.add(new V(0,1.3,0))},seatY:t>=54&&horse?horse.root.position.y+2:null};
 }
 function frame(){if(!active)return;const g=hand('gandalf'),f=hand('frodo'),ember=new V(156,.56,153.04);ring.setEnabled(t>=14.2&&t<43);envelope.setEnabled(t>=8&&t<15.2);tongs.setEnabled(t>=16&&t<22);for(const m of glyphs)m.setEnabled(t>=22&&t<43);
  paper.diffuseColor=B.Color3.Lerp(B.Color3.FromHexString('#dbc8a5'),new B.Color3(.14,.07,.02),clamp((t-13)/2));envelope.scaling.setAll(1-clamp((t-14)/1.3)*.9);envelope.position.copyFrom(t<12?g:lerp(g,ember,(t-12)/1.6));envelope.rotation.set(.3,t*.3,0);
  const reach=clamp((t-16)/2),pull=clamp((t-18)/2);tongs.position.copyFrom(lerp(g,ember.add(new V(0,.05,-.32)),reach*(1-pull)));tongs.rotation.y=0;tongs.computeWorldMatrix(true);const jaw=V.TransformCoordinates(new V(0,0,.32),tongs.getWorldMatrix());
  ring.position.copyFrom(t<18?ember:t<20?jaw:t<21?lerp(jaw,f,t-20):f);ring.rotation.set(.15,t*.1,0);
  let eye,target;if(t<7){target=new V(205,1.8,200.8);eye=new V(207.2,2.7,199.5);}else if(t<12){target=new V(156.8,1.5,151.7);eye=new V(160,2.5,149.7);}else if(t<20){target=t<16?ember:ring.position;eye=target.add(new V(.8,.6,-1.3));}else if(t<28){target=ring.position;eye=target.add(new V(.1,.1,.24));}else if(t<34){target=new V(157.1,1.65,151.5);eye=new V(160,2.5,149.8);}else if(t<41){target=new V(148.1,2.2,149);eye=new V(152.6,2.6,146.5);}else if(t<46){target=new V(158.1,1.2,150.8);eye=new V(161,2.5,147.4);}else{target=cast.frodo.root.position.add(new V(-.5,1.4,1));eye=target.add(new V(6,2.4,-7));}scene.activeCamera.position.copyFrom(eye);scene.activeCamera.setTarget(target);
 }
 const observer=scene.onAfterAnimationsObservable.add(frame);
 function end(){if(!active)return;active=false;room.openWindow(false);room.setActive(false);setArchive(false);horse?.stop();for(const m of enabled)if(!m.isDisposed())m.setEnabled(true);for(const {c,p,r,on}of saved){c.root.position.copyFrom(p);c.root.rotation.copyFrom(r);c.root.setEnabled(on);}world.sun.setEnabled(lighting.sun);world.hemi.intensity=lighting.hemi;scene.activeCamera.minZ=near;scene.activeCamera.fov=fov;for(const m of [ring,envelope])m.setEnabled(false);tongs.setEnabled(false);}
 for(const m of [ring,envelope])m.setEnabled(false);tongs.setEnabled(false);setArchive(false);horse?.root.setEnabled(false);
 return {begin,update,end,get active(){return active;},get beat(){return revelationBeat(t).id;},dispose(){end();scene.onAfterAnimationsObservable.remove(observer);for(const m of [...props,...archive])if(!m.isDisposed())m.dispose();tongs.dispose();light.dispose();for(const m of [gold,paper,iron,wax,runeMat,oak,stone])m.dispose();}};
}
