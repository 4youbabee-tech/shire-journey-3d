import {createHearthFire} from './hearth-fire.mjs';
// Distinct original Hobbit-hole room; mesh and lamp visibility are disabled outdoors.
import {dressMaterials} from './surface-art.mjs';
export const BAG_DOOR=Object.freeze({x:11,z:8.2});
export const nearBagDoor=p=>Math.hypot(p.x-BAG_DOOR.x,p.z-BAG_DOOR.z)<2.65;
export function createBagEndInterior(B,scene){
 const M=B.MeshBuilder,V=B.Vector3,meshes=[],colliders=[];
 const mat=(id,color,emit=0)=>{const m=new B.StandardMaterial('Bag End '+id,scene);m.diffuseColor=B.Color3.FromHexString(color);m.specularColor=new B.Color3(.06,.06,.04);if(emit)m.emissiveColor=m.diffuseColor.scale(emit);return m;};
 const wall=mat('plaster','#dfc9a1'),oak=mat('oak timber','#886440'),floor=mat('floor','#af8452'),linen=mat('linen','#eaddbf'),green=mat('door','#507250'),rug=mat('rug','#9e6550'),brass=mat('brass','#d6af68',.2),book=mat('books','#564333'),fire=mat('warm embers','#ffaa5b',.85);
 function use(mesh,m,x,y,z,solid=false){mesh.material=m;mesh.position.set(x,y,z);mesh.isPickable=false;mesh.receiveShadows=true;if(solid){mesh.checkCollisions=true;colliders.push(mesh);}meshes.push(mesh);return mesh;}
 const bx=(name,x,y,z,w,h,d,m,solid=false)=>use(M.CreateBox(name,{width:w,height:h,depth:d},scene),m,x,y,z,solid);
 const cy=(name,x,y,z,d,h,m)=>use(M.CreateCylinder(name,{diameter:d,height:h,tessellation:12},scene),m,x,y,z);
 const sp=(name,x,y,z,sx,sy,sz,m)=>{const a=use(M.CreateSphere(name,{diameter:1,segments:8},scene),m,x,y,z);a.scaling.set(sx,sy,sz);return a;};
 bx('Bag End indoor walkable floor',160,-.12,145,25,.25,28,floor,true);
 bx('back lime wall',160,3.1,159,25,6.2,.4,wall,true);
 bx('front lime wall',160,3.1,131,25,6.2,.4,wall,true);
 const leftWall=bx('left lime wall',147.5,3.1,145,.4,6.2,28,wall,true);
 // Cut real openings once during lazy construction, never per frame.
 let cut=B.CSG.FromMesh(leftWall);for(const z of [140,149]){const hole=M.CreateCylinder('window cutter',{diameter:2.36,height:1.2,tessellation:32},scene);hole.position.set(147.5,3.1,z);hole.rotation.z=Math.PI/2;hole.computeWorldMatrix(true);cut=cut.subtract(B.CSG.FromMesh(hole));hole.dispose();}
 const perforated=cut.toMesh('left lime wall with open round windows',wall,scene);perforated.checkCollisions=true;perforated.isPickable=false;meshes[meshes.indexOf(leftWall)]=perforated;colliders[colliders.indexOf(leftWall)]=perforated;leftWall.dispose();
 bx('garden beyond Bag End windows',144,-.1,145,6,.2,27,green);
 bx('distant garden hedge',141.3,1.3,145,.3,2.6,27,green);
 bx('right lime wall',172.5,3.1,145,.4,6.2,28,wall,true);
 bx('handmade ceiling',160,6.2,145,25,.3,28,oak);
 for(const z of [134,141,148,155])bx('ceiling beam',160,5.96,z,24,.25,.34,oak);
 for(const z of [133,139,145,151,157]){
  const path=Array.from({length:25},(_,i)=>new V(160+12.05*Math.cos(i/24*Math.PI),3.5+2.45*Math.sin(i/24*Math.PI),z));
  use(M.CreateTube('curved oak ceiling rib',{path,radius:.115,tessellation:7},scene),oak,0,0,0);
 }
 bx('woven patterned carpet',160,.03,146,9,.04,5.5,rug);
 bx('hearth surround',156,1.45,158.55,3.9,2.9,.65,oak);
 bx('fireplace recess',156,.77,158.17,2.3,1.1,.15,book);
 for(const x of [155.4,156.1,156.7])sp('firelit ember',x,.5,158.08,.43,.58,.28,fire);
 bx('carved mantel',156,2.32,158.1,4.4,.29,.85,oak);
 bx('dining table',158,.96,146,4.5,.2,2.2,oak,true);
 for(const x of [156.4,159.6])for(const z of [145.4,146.6])bx('dining table legs',x,.44,z,.24,.85,.24,oak);
 for(const x of [154.4,161.6]){bx('oak chair',x,.62,146,1.3,.18,1.1,oak);bx('chair back',x,1.12,146.45,1.3,1.2,.19,oak);for(const dx of [-.43,.43])for(const dz of [-.34,.34])bx('chair legs',x+dx,.28,146+dz,.12,.56,.12,oak);}
 for(const x of [156.8,158,159.2])cy('glazed plate',x,1.07,146,.68,.06,linen);
 sp('bright fruit',159,1.14,146,.32,.33,.32,rug);
 bx('old writing desk',154,.95,151,2.7,.2,1.4,oak);
 for(const dx of [-1.05,1.05])for(const dz of [-.45,.45])bx('writing desk legs',154+dx,.43,151+dz,.16,.86,.16,oak);
 bx('Bilbo journal',154,1.1,151,.8,.08,.9,book);
 for(const x of [166.8,169.7])bx('bookcase upright',x,2.1,154,.19,4,1.2,oak);
 for(const y of [.7,1.55,2.4,3.25])bx('bookcase shelf',168.2,y,154,3.1,.18,1.28,oak);
 for(let i=0;i<16;i++)bx('bound book',167+(i%8)*.3,1.98+Math.floor(i/8)*.84,154,.19,.59,.55,i%3===0?green:i%3===1?rug:book);
 const door=cy('green round inner door',160,2.8,131.4,4.75,.12,green);door.rotation.x=Math.PI/2;
 const rim=use(M.CreateTorus('round oak doorframe',{diameter:4.95,thickness:.23,tessellation:28},scene),oak,160,2.8,131.25);rim.rotation.x=Math.PI/2;
 sp('door brass handle',161,2.58,131.14,.19,.19,.14,brass);
 // Pull the sitting and work areas closer to the entrance; this is a cozy Hobbit home, not an empty hall.
 const nearFurniture=new Set(['woven patterned carpet','dining table','dining table legs','oak chair','chair back','chair legs','writing desk legs','glazed plate','bright fruit','old writing desk','Bilbo journal','bookcase upright','bookcase shelf','bound book']);
 const hearthFurniture=new Set(['hearth surround','fireplace recess','firelit ember','carved mantel']);
 for(const m of meshes){if(nearFurniture.has(m.name))m.position.z-=3.6;else if(hearthFurniture.has(m.name))m.position.z-=5.0;}
 // Warm foreground details and softened domestic silhouettes.
 for(const [x,z] of [[153,139],[168,138]]){cy('glazed flower pot',x,.45,z,.8,.75,rug);sp('potted kitchen herb',x,.95,z,.75,.9,.75,green);}
 for(const [x,z] of [[151,143],[170,143]]){cy('small candle stand',x,1.2,z,.3,2.4,oak);sp('candle flame',x,2.48,z,.3,.45,.3,fire);}
 for(const [x,z] of [[163,139],[165,140]]){bx('leather luggage',x,.4,z,1.1,.8,.64,book);bx('rolled blanket',x,.86,z,.85,.13,.58,linen);}
 for(const z of [140,149]){
  const window=use(M.CreateDisc('round garden window',{radius:1.18,tessellation:32,sideOrientation:B.Mesh.DOUBLESIDE},scene),linen,147.76,3.1,z);window.rotation.y=Math.PI/2;window.visibility=.16;
  const rim=use(M.CreateTorus('round garden window oak rim',{diameter:2.5,thickness:.19,tessellation:32},scene),oak,147.8,3.1,z);rim.rotation.z=Math.PI/2;
  bx('window mullion',147.88,3.1,z,.15,2.3,.085,oak);bx('window crosspiece',147.88,3.1,z,.15,.085,2.3,oak);
  bx('deep garden window sill',148.05,1.93,z,.68,.13,2.7,oak);
 }
 // Real table setting, glowing hearth and visible timber give the room a domestic scale.
 cy('ceramic tea pot',158.6,1.29,142.6,.42,.37,green);sp('tea pot lid',158.6,1.51,142.6,.43,.07,.43,green);
 for(const x of [157.2,159.1]){cy('tea cup',x,1.23,142.9,.24,.24,linen);cy('tea saucer',x,1.105,142.9,.42,.025,linen);}
 const lights=[new B.PointLight('Bag End hearth light',new V(156,2,153),scene),new B.PointLight('Bag End ceiling light',new V(160,4.5,145),scene)];
 lights[0].diffuse=B.Color3.FromHexString('#ffc186');lights[0].intensity=1.0;lights[0].range=12;
 lights[1].diffuse=B.Color3.FromHexString('#ffe8bc');lights[1].intensity=.85;lights[1].range=22;
 const livingFire=createHearthFire(B,scene,new V(156,.7,153.02));meshes.push(...livingFire.meshes);lights[0].dispose();lights[0]=livingFire.lamp;
 const windowParts=meshes.filter(m=>['round garden window','window mullion','window crosspiece'].includes(m.name)&&m.position.z===149);
 const openWindow=on=>{for(const m of windowParts)m.setEnabled(!on);};
 const setActive=on=>{for(const m of meshes)m.setEnabled(on);for(const l of lights)l.setEnabled(on);};
 const nearby=p=>Math.hypot(p.x-160,p.z-135.5)<3?{id:'exit-house',name:'اخرج إلى الشاير'}:Math.hypot(p.x-154,p.z-147.4)<2.3?{id:'diary',name:'اقرأ دفتر بيلبو'}:Math.hypot(p.x-156,p.z-151.1)<2.5?{id:'fire',name:'تأمّل المدفأة'}:null;
 dressMaterials(B,scene,[wall,oak,floor,linen,green,rug,book]);setActive(false);
 return {meshes,colliders,nearby,setActive,openWindow,spawn:{x:160,y:.72,z:137.9},stats:{decor:meshes.length,lights:lights.length}};
}

