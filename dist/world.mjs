import {terrainHeightAt,shapeTerrain} from './terrain.mjs';
// All art here is original procedural stylized geometry, not imported film assets.
import {HOMES,ROADS,MAP_BOUNDS} from './village-layout.mjs';
import {addHomeCollision} from './home-collision.mjs';
import {enhanceHero} from './hero-art.mjs';
import {dressMaterials} from './surface-art.mjs';
import {createAmbientFauna} from './fauna.mjs';
export function createWorld(B,scene,{shadows=true,deferredNature=false,deferredCharacters=false}={}){
 const V=B.Vector3, M=B.MeshBuilder;let seed=7349;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 let houseBase=null;const elevation=(x,z)=>houseBase??terrainHeightAt(x,z);
 const mats={},statics=[],colliders=[],characters=[],apples=[],birds=[],leaves=[],workers=[],treeAnchors=[],hedgeAnchors=[],cameraBlockers=[];
 function mat(name,hex,emission=0){const m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(hex);m.specularColor=new B.Color3(.03,.03,.03);if(emission)m.emissiveColor=m.diffuseColor.scale(emission);mats[name]=m;return m;}
 const grass=mat('meadow','#739b51'),hill=mat('hill','#638b4a'),hill2=mat('distant hills','#8eae78'),cream=mat('lime plaster','#e8d3a0'),wood=mat('oak timber','#715034'),dark=mat('dark timber','#493d2c'),pathmat=mat('warm gravel','#b7a27a'),bark=mat('bark','#6d5338'),leaf=mat('summer leaves','#719d50'),leaf2=mat('sunlit leaves','#b2ca78'),leaf3=mat('deep leaves','#456f43'),door=mat('bag end green','#355f47'),brass=mat('warm brass','#dcac4e'),glass=mat('warm windows','#f4ca75',.3),stone=mat('path stone','#9d9a7b'),white=mat('cream cloth','#eee3c0'),red=mat('rust bunting','#b97151'),blue=mat('sky bunting','#7a9a9b'),yellow=mat('wildflower gold','#e8bc53'),pink=mat('wildflower pink','#d48c8f'),skin=mat('hobbit skin','#e5b18a'),hair=mat('brown curls','#65412b'),bilboHair=mat('Bilbo silver-brown hair','#76634d'),samHair=mat('Sam sandy curls','#8b693e'),frodoHair=mat('Frodo dark curls','#47372c'),bookLeather=mat('Bilbo book leather','#54382d'),trousers=mat('trousers','#685a3b'),feetmat=mat('bare feet','#dca77c'),eye=mat('eyes','#27372b'),rosy=mat('warm skin midtones','#d7a18b'),lip=mat('soft lip shadow','#a86d60'),shirt=mat('cream shirt','#f5e6bc'),vest=mat('player vest','#99704a'),cloak=mat('green cloak','#506950'),samvest=mat('sam waistcoat','#a78e56'),bilbovest=mat('bilbo waistcoat','#a9664b'),bilboCoat=mat('Bilbo burgundy coat','#663c4e'),frodoVest=mat('Frodo blue waistcoat','#426b70'),grey=mat('grey robes','#969e9a'),hatmat=mat('blue grey hat','#7c8f94'),beard=mat('grey beard','#d8d9cb'),applemat=mat('red apples','#ce6941');
 const turf=mat('mossy turf roof','#7e985c');
 const sun=new B.DirectionalLight('warm morning sunlight',new V(-.8,-1.6,.65),scene);sun.position=new V(35,55,-30);sun.intensity=1.04;sun.diffuse=new B.Color3(1,.94,.79);const hemi=new B.HemisphericLight('sky fill',new V(0,1,0),scene);hemi.intensity=.68;hemi.groundColor=B.Color3.FromHexString('#708a50');
 scene.clearColor=B.Color4.FromHexString('#b8ddf6ff');scene.fogMode=B.Scene.FOGMODE_LINEAR;scene.fogStart=95;scene.fogEnd=220;scene.fogColor=B.Color3.FromHexString('#c3ddcf');scene.ambientColor=new B.Color3(.14,.13,.10);scene.imageProcessingConfiguration.toneMappingEnabled=true;scene.imageProcessingConfiguration.toneMappingType=B.ImageProcessingConfiguration.TONEMAPPING_ACES;scene.imageProcessingConfiguration.contrast=1.12;scene.imageProcessingConfiguration.exposure=1.045;scene.collisionsEnabled=true;scene.skipPointerMovePicking=true;
 const shadow=shadows?new B.ShadowGenerator(1024,sun):null;if(shadow){shadow.usePercentageCloserFiltering=true;shadow.filteringQuality=B.ShadowGenerator.QUALITY_LOW;shadow.bias=.005;shadow.normalBias=.3;shadow.darkness=.22;}
 function finish(mesh,material,x,y,z,staticMesh=true,parent=null){mesh.material=material;mesh.position.set(x,y+(parent?0:elevation(x,z)),z);mesh.isPickable=false;if(parent)mesh.parent=parent;else if(staticMesh)statics.push(mesh);mesh.receiveShadows=true;return mesh;}
 function sphere(name,x,y,z,sx,sy,sz,material,staticMesh=true,parent=null,segments=10){const m=M.CreateSphere(name,{diameter:1,segments},scene);m.scaling.set(sx,sy,sz);return finish(m,material,x,y,z,staticMesh,parent);}
 function cyl(name,x,y,z,diameter,height,material,staticMesh=true,parent=null,top=null,tessellation=12){const m=M.CreateCylinder(name,{diameter,height,diameterTop:top??diameter,tessellation},scene);return finish(m,material,x,y,z,staticMesh,parent);}
 function beam(a,b,r,material,name='timber',staticMesh=true,parent=null){const av=new V(...a),bv=new V(...b);if(!parent){av.y+=elevation(av.x,av.z);bv.y+=elevation(bv.x,bv.z);}const mid=av.add(bv).scale(.5),delta=bv.subtract(av);const m=cyl(name,mid.x,mid.y-(parent?0:elevation(mid.x,mid.z)),mid.z,r,delta.length(),material,staticMesh,parent);m.rotationQuaternion=B.Quaternion.FromUnitVectorsToRef(V.Up(),delta.normalize(),new B.Quaternion());return m;}
 function ring(name,x,y,z,d,t,material){const m=M.CreateTorus(name,{diameter:d,thickness:t,tessellation:28},scene);m.rotation.x=Math.PI/2;return finish(m,material,x,y,z);}
 function blocker(name,x,y,z,sx,sy,sz){const m=M.CreateBox(name,{width:sx,height:sy,depth:sz},scene);m.position.set(x,y+elevation(x,z),z);m.isVisible=false;m.checkCollisions=true;m.isPickable=false;colliders.push(m);return m;}
 const ground=M.CreateGround('village walkable ground',{width:180,height:180,subdivisions:80},scene);shapeTerrain(B,ground);ground.material=grass;ground.receiveShadows=true;ground.checkCollisions=true;
 // Soft deterministic ground mottling provides a lived-in meadow without textures/network.
 const terrainVertices=ground.getVerticesData(B.VertexBuffer.PositionKind),terrainColors=[];
 for(let i=0;i<terrainVertices.length;i+=3){
  const x=terrainVertices[i],z=terrainVertices[i+2];
  const n=Math.sin(x*.17)*Math.cos(z*.12)*.068+Math.sin(x*.43+z*.35)*.022;
  terrainColors.push(.92+n*.48,.97+n*.55,.81+n*.4,1);
 }
 ground.setVerticesData(B.VertexBuffer.ColorKind,new Float32Array(terrainColors));
 // A broad, quiet horizon gives the village a real landscape silhouette.
 for(let i=0;i<16;i++){const angle=i/16*Math.PI*2;const r=110+random()*20;sphere('rolling distant hill',Math.cos(angle)*r,-3+random()*2,Math.sin(angle)*r,37+random()*20,14+random()*16,35+random()*18,i%2?hill2:hill);}
 function path(points,width=2.5){const p=B.Curve3.CreateCatmullRomSpline(points.map(([x,z])=>new V(x,.035,z)),10,false).getPoints();const left=[],right=[];for(let i=0;i<p.length;i++){const t=p[Math.min(i+1,p.length-1)].subtract(p[Math.max(i-1,0)]).normalize(),n=new V(t.z,0,-t.x);const l=p[i].add(n.scale(width/2)),r=p[i].subtract(n.scale(width/2));l.y=terrainHeightAt(l.x,l.z)+.065;r.y=terrainHeightAt(r.x,r.z)+.065;left.push(l);right.push(r);}const m=M.CreateRibbon('winding village path',{pathArray:[left,right],sideOrientation:B.Mesh.DOUBLESIDE},scene);m.material=pathmat;m.receiveShadows=true;statics.push(m);}
 for(const road of ROADS)path(road.points,road.width);
 function tree(x,z,s=1,kind='normal'){
  treeAnchors.push({x,z,s,kind});
  if(deferredNature){blocker('tree trunk collision',x,1.5*s,z,.65*s,3*s,.65*s);return;}
  cyl('tapering trunk',x,1.5*s,z,.55*s,3*s,bark,true,null,.3*s,8);blocker('tree trunk collision',x,1.5*s,z,.65*s,3*s,.65*s);
  beam([x,1.6*s,z],[x-.8*s,3*s,z],.2*s,bark);beam([x,1.8*s,z],[x+.9*s,3.2*s,z+.3*s],.2*s,bark);
  for(let j=0;j<5;j++){const a=j/5*6.28;sphere('rounded tree crown',x+Math.cos(a)*1.1*s,3.7*s+(j%2)*.6*s,z+Math.sin(a)*.9*s,2.7*s,2.7*s,2.5*s,j%3===0?leaf2:j%3===1?leaf:leaf3);}
  if(leaves.length<11){const canopy=new B.TransformNode('gentle wind in tree leaves',scene);canopy.position.set(x,3.4*s+terrainHeightAt(x,z),z);const crown=sphere('swaying upper foliage',0,.45*s,0,2.2*s,1.8*s,2*s,kind==='apple'?leaf2:leaf,false,canopy,8);crown.receiveShadows=true;leaves.push({root:canopy,phase:x*.14+z*.2,amplitude:.025+.008*(leaves.length%3)});}
   if(kind==='apple')for(let j=0;j<9;j++){const a=j*2.4;sphere('apples in tree',x+Math.cos(a)*1.7*s,2.7*s+(j%3)*.55*s,z+Math.sin(a)*1.3*s,.2,.23,.2,applemat);}
 }
 tree(-2,22,2.2);tree(-20,13,1.15,'apple');tree(-17,19,1,'apple');tree(-23,19,1.2,'apple');
 // Additional perimeter grove anchors use the same licensed maple GLBs loaded by loadNature.
 // They deliberately avoid house approaches and the main walkable road corridors.
 for(const [x,z,s] of [[-45,-38,1.15],[-32,-43,1.0],[-18,-43,1.1],[19,-43,1.1],[34,-40,1.0],[46,-27,1.2],[46,-2,1.15],[46,20,1.15],[44,45,1.2],[25,48,1.0],[-17,48,1.0],[-44,40,1.1]]){treeAnchors.push({x,z,s,kind:'perimeter'});blocker('tree trunk collision',x,1.5*s,z,.65*s,3*s,.65*s);}
 [[-25,-8,1.3],[-28,4,1.8],[24,14,1.5],[29,1,1.2],[17,27,1.7],[-27,28,1.5],[-13,-14,1.3],[19,-15,1.4],[-30,-18,1.6],[31,-18,1.2],[-30,18,1.1],[29,25,1.8]].forEach(p=>tree(...p));
 function house(x,z,s=1,frontColor=door){houseBase=terrainHeightAt(x,z-1.6*s);
  sphere('grass covered hobbit mound',x,1.3*s,z+4.6*s,11*s,6*s,9*s,hill,true,null,18);sphere('golden roof edge',x,2*s,z+2.9*s,8*s,4.8*s,5.5*s,turf,true,null,16);
  // A grounded plaster frontage under a turf arch, rather than a freestanding disc.
  const outline=[[-3.2,0],[3.2,0]];
  for(let i=0;i<=24;i++){const a=i/24*Math.PI;outline.push([Math.cos(a)*3.2,.6+Math.sin(a)*2.7]);}
  const positions=[],indices=[],uvs=[],normals=[];
  const triangle=(a,b,c)=>{const offset=positions.length/3;for(const p of [a,b,c]){positions.push(p[0]*s,p[1]*s,p[2]*s);uvs.push(.5+p[0]/6.4,p[1]/3.3);}indices.push(offset,offset+1,offset+2);};
  const pt=(i,depth)=>[...outline[i],depth];
  for(let i=1;i<outline.length-1;i++){triangle(pt(0,-.275),pt(i,-.275),pt(i+1,-.275));triangle(pt(0,.275),pt(i+1,.275),pt(i,.275));}
  for(let i=0;i<outline.length;i++){const j=(i+1)%outline.length;triangle(pt(i,-.275),pt(j,.275),pt(j,-.275));triangle(pt(i,-.275),pt(i,.275),pt(j,.275));}
  const facade=new B.Mesh('arched plaster frontage',scene),data=new B.VertexData();B.VertexData.ComputeNormals(positions,indices,normals);Object.assign(data,{positions,indices,normals,uvs});data.applyToMesh(facade);finish(facade,cream,x,0,z);
  for(let i=2;i<outline.length-1;i++){const a=outline[i],b=outline[i+1];beam([x+a[0]*s,a[1]*s,z-.31*s],[x+b[0]*s,b[1]*s,z-.31*s],.13*s,wood,'curved roof timber');}
  for(const side of [-1,1])beam([x+side*3.2*s,0,z-.31*s],[x+side*3.2*s,.6*s,z-.31*s],.15*s,wood,'frontage jamb');
  const d=cyl('painted round hobbit door',x,1.35*s,z-.34*s,2.35*s,.17*s,frontColor);d.rotation.x=Math.PI/2;ring('door arch',x,1.35*s,z-.46*s,2.48*s,.16*s,dark);
  for(let i=-3;i<=3;i++){const xx=i*.25*s,hh=Math.sqrt(Math.max(0,1.08*1.08-i*.25*i*.25))*s;beam([x+xx,1.35*s-hh,z-.44*s],[x+xx,1.35*s+hh,z-.44*s],.025*s,wood);}
  sphere('round brass doorknob',x+.13*s,1.35*s,z-.55*s,.16*s,.16*s,.12*s,brass);
  for(const side of [-1,1]){const wx=x+side*1.92*s;const w=cyl('glowing round window',wx,1.9*s,z-.36*s,.92*s,.13*s,glass);w.rotation.x=Math.PI/2;ring('round window frame',wx,1.9*s,z-.45*s,1*s,.12*s,wood);beam([wx-.4*s,1.9*s,z-.49*s],[wx+.4*s,1.9*s,z-.49*s],.06*s,wood);beam([wx,1.5*s,z-.49*s],[wx,2.3*s,z-.49*s],.06*s,wood);cyl('flowerpot',wx,.25*s,z-.8*s,.55*s,.5*s,red);if(!deferredNature)sphere('window flowers',wx,.7*s,z-.8*s,.8*s,.5*s,.6*s,leaf2);}
  cyl('stone doorstep',x,.09,z-1.1*s,2.5*s,.18,stone);cyl('chimney',x+1.7*s,4.6*s,z+2*s,.7*s,2*s,stone,true,null,.65*s,6);cyl('chimney cap',x+1.7*s,5.6*s,z+2*s,1*s,.2*s,cream);
  colliders.push(addHomeCollision(B,scene,{x,z,s,y:houseBase}));houseBase=null;
 }
 // B3 / architecture pass: each home keeps its surveyed position, collision hull,
 // round-door interaction and save identity. Only lightweight decorative art changes.
 // The four coherent facade treatments reuse existing materials and static batching.
 const homesteadStyles=['bag-end','orchard','flower','woodland'];
 const homesteadDetails={homes:0,shutters:0,doorHardware:0,gardenBeds:0,steppingStones:0,roofAccents:0,styles:homesteadStyles};
 function homesteadArt(home,index){
  const {x,z,s}=home,style=index===0?0:1+(index%3),accent=[door,red,blue,wood][style];
  homesteadDetails.homes++;
  // Paired oak shutters sit *outside* the glazed round windows.
  for(const side of [-1,1])for(const outer of [-1,1]){
   const wx=x+side*1.92*s+outer*.63*s;
   const plank=M.CreateBox('B3 cottage timber window shutter',{width:.17*s,height:.82*s,depth:.12*s},scene);
   finish(plank,style===2?red:wood,wx,1.9*s,z-.49*s);homesteadDetails.shutters++;
  }
  // Raised hardware and varied painted wood give the round entrances identity.
  for(const y of [.9,1.8]){
   sphere('B3 door forged hinge',x-.92*s,y*s,z-.53*s,.13*s,.075*s,.075*s,dark,true,null,6);
   homesteadDetails.doorHardware++;
  }
  sphere('B3 door brass escutcheon',x+.13*s,1.35*s,z-.58*s,.24*s,.24*s,.07*s,brass,true,null,8);
  homesteadDetails.doorHardware++;
  // Garden beds are set to either side of the threshold, not across the path.
  for(const side of [-1,1]){
   const gx=x+side*2.78*s,gz=z-1.42*s;
   const border=M.CreateBox('B3 raised herb bed',{width:.9*s,height:.2*s,depth:.75*s},scene);
   finish(border,style===3?stone:wood,gx,.14*s,gz);
   homesteadDetails.gardenBeds++;
   for(let j=0;j<2;j++){
    const fx=gx+(j? .18:-.18)*s,fz=gz+(j?-.12:.12)*s;
    sphere('B3 kitchen garden herb',fx,.42*s,fz,.33*s,.36*s,.3*s,j%2?leaf2:leaf3,true,null,6);
    sphere('B3 cottage flower',fx,.69*s,fz,.15*s,.11*s,.15*s,style===2?pink:style===1?yellow:white,true,null,6);
   }
  }
  // Flat stepping stones visually join existing walkable roads without new collision.
  for(let j=0;j<3;j++){
   const slab=M.CreateBox('B3 front walk stepping stone',{width:(1.05+j*.09)*s,height:.055*s,depth:.36*s},scene);
   finish(slab,stone,x,.035*s,z-(1.48+j*.44)*s);
   homesteadDetails.steppingStones++;
  }
  if(index===0){
   // Bag End's warm, recognisable front entrance has a hand-crafted oak lintel.
   beam([x-1.55*s,2.9*s,z-.63*s],[x+1.55*s,2.9*s,z-.63*s],.09*s,wood,'B3 Bag End carved oak lintel');
   homesteadDetails.roofAccents++;
  }
 }
 for(const [index,home] of HOMES.entries()){
  house(home.x,home.z,home.s,home.color==='rust'?red:home.color==='blue'?blue:door);
  homesteadArt(home,index);
 }
 // B4 / Bywater: make the existing southern home a recognisable village inn.
 // No house/road positions, player spawn, story triggers or collision hulls change.
 const bywaterDetails={inn:'Green Dragon',home:'Bywater Road',signs:0,lanterns:0,barrels:0,seats:0,flowerBoxes:0,residents:0};
 const inn=HOMES.find(h=>h.name==='Bywater Road');
 if(inn){
  const ix=inn.x,iz=inn.z,is=inn.s,signX=ix,signY=3.15*is,signZ=iz-.95*is;
  // Readable timber sign, original dragon silhouette and raised gold lettering.
  beam([ix-.95*is,3.62*is,signZ+.08*is],[ix-.95*is,3.18*is,signZ+.08*is],.08*is,wood,'B4 left sign bracket');
  beam([ix+.95*is,3.62*is,signZ+.08*is],[ix+.95*is,3.18*is,signZ+.08*is],.08*is,wood,'B4 right sign bracket');
  const sign=M.CreateBox('B4 Green Dragon wall sign',{width:2.5*is,height:.95*is,depth:.13*is},scene);
  finish(sign,door,signX,signY,signZ);
  sphere('B4 green dragon body',signX-.68*is,signY,signZ-.09*is,.56*is,.22*is,.065*is,leaf2,true,null,6);
  sphere('B4 green dragon head',signX-.34*is,signY+.11*is,signZ-.105*is,.2*is,.18*is,.07*is,leaf2,true,null,6);
  beam([signX-.91*is,signY-.02*is,signZ-.13*is],[signX-1.08*is,signY+.13*is,signZ-.13*is],.045*is,leaf2,'B4 dragon curled tail');
  beam([signX-.43*is,signY+.19*is,signZ-.13*is],[signX-.38*is,signY+.31*is,signZ-.13*is],.035*is,leaf2,'B4 dragon horn');
  beam([signX-.26*is,signY+.18*is,signZ-.13*is],[signX-.19*is,signY+.29*is,signZ-.13*is],.035*is,leaf2,'B4 dragon horn');
  beam([signX-.75*is,signY-.12*is,signZ-.13*is],[signX-.78*is,signY-.27*is,signZ-.13*is],.045*is,leaf2,'B4 dragon hind leg');
  beam([signX-.49*is,signY-.12*is,signZ-.13*is],[signX-.45*is,signY-.27*is,signZ-.13*is],.045*is,leaf2,'B4 dragon foreleg');
  const wing=M.CreateDisc('B4 dragon wing',{radius:.28*is,tessellation:3,sideOrientation:B.Mesh.DOUBLESIDE},scene);
  finish(wing,leaf2,signX-.76*is,signY+.17*is,signZ-.15*is);wing.rotation.z=-.38;
  sphere('B4 dragon eye',signX-.27*is,signY+.13*is,signZ-.18*is,.055*is,.055*is,.035*is,brass,true,null,6);
  const glyphs={G:['01110','10000','10000','10111','10001','10001','01110'],R:['11110','10001','10001','11110','10100','10010','10001'],E:['11111','10000','10000','11110','10000','10000','11111'],N:['10001','11001','10101','10011','10001','10001','10001'],D:['11110','10001','10001','10001','10001','10001','11110'],A:['01110','10001','10001','11111','10001','10001','10001'],O:['01110','10001','10001','10001','10001','10001','01110']};
  const drawSignWord=(word,centerY)=>{const cw=.03*is,ch=.05*is,gx=.005*is,gy=.008*is,gap=.012*is,letterWidth=5*cw+4*gx,total=word.length*letterWidth+(word.length-1)*gap;let cursor=signX+.58*is-total/2;for(const char of word){const pattern=glyphs[char];for(let row=0;row<7;row++)for(let col=0;col<5;col++)if(pattern[row][col]==='1'){const mark=M.CreateBox('B4 raised Green Dragon lettering',{width:cw*.9,height:ch*.9,depth:.035*is},scene);finish(mark,brass,cursor+col*(cw+gx)+cw/2,centerY+(3-row)*(ch+gy),signZ-.095*is);}cursor+=letterWidth+gap;}};
  drawSignWord('GREEN',signY+.255*is);drawSignWord('DRAGON',signY-.255*is);bywaterDetails.signs++;
  for(const dx of [-1.8,1.8]){const lx=ix+dx*is,lz=iz-1.45*is;cyl('B4 inn lantern bracket',lx,1.8*is,lz,.09,.48*is,dark);sphere('B4 inn amber lantern',lx,1.52*is,lz,.32*is,.42*is,.32*is,glass,true,null,6);bywaterDetails.lanterns++;}
  for(const dx of [-2.65,2.65]){const bx=ix+dx*is,bz=iz-2.05*is;cyl('B4 tavern rain barrel',bx,.42*is,bz,.72*is,.84*is,wood,true,null,null,8);cyl('B4 barrel lid',bx,.86*is,bz,.78*is,.09*is,dark,true,null,null,8);bywaterDetails.barrels++;}
  for(const dx of [-1.5,1.5]){const bx=ix+dx*is,bz=iz-2.65*is;const seat=M.CreateBox('B4 inn porch seat',{width:1.05*is,height:.16*is,depth:.42*is},scene);finish(seat,wood,bx,.55*is,bz);for(const offset of [-.38,.38])cyl('B4 porch bench leg',bx+offset*is,.27*is,bz,.11*is,.54*is,dark);bywaterDetails.seats++;}
  for(const dx of [-1.95,1.95]){const bx=ix+dx*is,bz=iz-.9*is;const box=M.CreateBox('B4 tavern flower box',{width:.65*is,height:.27*is,depth:.38*is},scene);finish(box,wood,bx,.39*is,bz);for(const offset of [-.17,.17])sphere('B4 flower box bloom',bx+offset*is,.66*is,bz,.23*is,.25*is,.23*is,offset<0?yellow:pink,true,null,6);bywaterDetails.flowerBoxes++;}
 }
 function fence(points){for(let i=0;i<points.length;i++){const [x,z]=points[i];cyl('fence post',x,.55,z,.16,1.1,wood,true,null,.1,6);if(i){const [px,pz]=points[i-1];beam([x,.4,z],[px,.4,pz],.09,wood);beam([x,.8,z],[px,.8,pz],.09,wood);}}}
 fence([[-15,0],[-13,0],[-11,0],[-9,0],[-8,-1]]);fence([[-17,8],[-19,8],[-21,8],[-23,8],[-25,10],[-25,12]]);fence([[15,7],[17,7],[19,7],[21,7]]);fence([[-7,25],[-7,27],[-7,29]]);
 // Village dressing uses shared materials and static batching; no moving story anchors.
 function bench(x,z,angle=0){
  const group=new B.TransformNode('village bench frame',scene);group.position.set(x,0,z);group.rotation.y=angle;
  for(const dx of [-.7,.7]){const leg=cyl('bench supports',dx,.36,0,.12,.72,wood,false,group);statics.push(leg);}
  const seat=M.CreateBox('oak bench seat',{width:1.85,height:.15,depth:.56},scene);finish(seat,wood,0,.75,0,false,group);statics.push(seat);
  const back=M.CreateBox('oak bench back',{width:1.85,height:.65,depth:.13},scene);finish(back,wood,0,1.12,.25,false,group);statics.push(back);
 }
 for(const [x,z,angle] of [[-26,-12,0],[-4,-29,.4],[21,-18,.8],[30,29,-.4],[-21,30,.2],[-34,3,1]])bench(x,z,angle);
 for(const [x,z] of [[-30,-14],[10,-26],[29,-13],[35,22],[-27,35],[0,38],[20,17],[-14,0]]){
  cyl('oak lamp post',x,1.5,z,.14,3,wood,true,null,.12,7);
  sphere('warm lantern glass',x,3.12,z,.5,.6,.5,glass);
  const cap=M.CreateCylinder('lantern roof',{diameter:1,height:.16,tessellation:6},scene);finish(cap,dark,x,3.51,z);
 }
 const hedgeVolumes=[];
 for(let i=0;i<45;i++){const x=-44+random()*88,z=-41+random()*89;
  if(Math.abs(x)<9&&z>-21&&z<19)continue;
  const sx=.75+random()*.6,sy=.8+random()*.45,sz=.8+random()*.6;hedgeAnchors.push({x,z,sx,sy,sz});
  if(!deferredNature)sphere('wild hedge bush',x,.32,z,sx,sy,sz,i%3?leaf3:leaf2,true,null,7);
  const volume=M.CreateSphere('hedge collision part',{diameter:1,segments:7},scene);volume.position.set(x,.32+terrainHeightAt(x,z),z);volume.scaling.set(sx,sy,sz);hedgeVolumes.push(volume);
 }
 if(hedgeVolumes.length){const hedge=B.Mesh.MergeMeshes(hedgeVolumes,true,true);hedge.name='solid village hedges';hedge.metadata={vegetation:true};hedge.isVisible=false;hedge.isPickable=false;hedge.checkCollisions=true;hedge.freezeWorldMatrix();colliders.push(hedge);}
 for(const [x,z] of [[-29,-15],[27,-8]]){
  cyl('stone well base',x,.5,z,2.15,1,stone,true,null,null,14);
  ring('well rim',x,1.05,z,2.3,.25,cream);
  for(const side of [-.82,.82])cyl('well support',x+side,2,z,.15,2,wood);
  const roof=M.CreateCylinder('well timber canopy',{diameter:2.6,height:.3,tessellation:4},scene);finish(roof,wood,x,3.05,z);
 }
 // The village square, produce stalls, barrels and baskets make roads feel inhabited.
 for(const [x,z] of [[23,-12],[29,-16],[25,-21]]){
  const stall=M.CreateBox('market produce stall',{width:2.2,height:.16,depth:1.15},scene);finish(stall,wood,x,1,z);
  for(const dx of [-.93,.93])for(const dz of [-.48,.48])cyl('market table post',x+dx,.5,z+dz,.13,.98,wood);
  const awning=M.CreateBox('striped canvas stall roof',{width:2.65,height:.18,depth:1.6},scene);finish(awning,(Math.round(x)%2)?red:blue,x,2.53,z);
  for(const dx of [-.9,.9])for(const dz of [-.44,.44])cyl('market canopy pole',x+dx,1.8,z+dz,.09,1.5,wood);
  for(let j=0;j<5;j++){sphere('market produce',x-.85+j*.42,1.18,z,.25,.23,.3,j%2?yellow:applemat,true,null,8);}
 }
 // Garden beds, pumpkins and flowers make the homes feel inhabited.
 for(let row=0;row<3;row++){path([[-15+row,-1],[-15+row,-5]],.5);for(let j=0;j<5;j++){sphere('cabbage',-15+row,.22,-1-j*.8,.43,.42,.43,leaf3);}}
 for(let i=0;i<7;i++)sphere('pumpkin',-9+random()*2,.24,3+random(),.5,.43,.48,i%2?red:yellow);
 for(let i=0;i<260;i++){const x=random()*62-31,z=random()*52-20;if(Math.abs(x)<4|| (x>6&&x<16&&z>7&&z<18)|| (x<-8&&x>-16&&z>3&&z<12))continue;const color=i%4===0?pink:i%3===0?white:yellow;const h=.18+random()*.20;cyl('flower stalk',x,h/2,z,.019,h,leaf3,true,null,null,4);sphere('meadow flower',x,h,z,.11,.048,.11,color,true,null,5);}
 // Pond with stepping stones and reeds, away from the main footpath.
 const water=mat('pond water','#72b4b1',.12);water.alpha=.92;const pond=cyl('quiet pond',21,.065,-2,10,.08,water,true,null,null,48);pond.scaling.z=.62;ring('pond bank',21,.04,-2,10,.4,hill).rotation.x=0;
 for(let i=0;i<20;i++){const a=i/20*Math.PI*2,x=21+Math.cos(a)*5,z=-2+Math.sin(a)*3.3;beam([x,0,z],[x+.1,.7+random()*.6,z],.045,leaf3);}
 for(let i=0;i<10;i++)sphere('bank stone',16+random()*10,.1,-5+random(),.6,.25,.4,stone);
 // Bunting curves between poles beside the party tree.
 for(const x of [-7,7])cyl('party pole',x,2.7,19,.13,5.4,wood);
 for(let i=0;i<15;i++){const x=-7+i;const y=5.2-Math.sin(i/14*Math.PI)*1.2;beam([x,y,19],[x+1,5.2-Math.sin((i+1)/14*Math.PI)*1.2,19],.025,white);if(i<14){const flag=M.CreateDisc('bunting flag',{radius:.3,tessellation:3,sideOrientation:B.Mesh.DOUBLESIDE},scene);flag.rotation.z=Math.PI;finish(flag,[red,white,blue,yellow][i%4],x+.5,y-.23,19);}}
 function table(x,z){const top=M.CreateBox('party table',{width:2.4,height:.12,depth:1},scene);finish(top,wood,x,.85,z);for(const dx of [-.9,.9])for(const dz of [-.3,.3])cyl('table leg',x+dx,.4,z+dz,.12,.8,wood);const cloth=M.CreateBox('tablecloth',{width:2.2,height:.03,depth:1.05},scene);finish(cloth,white,x,.94,z);for(let i=0;i<3;i++)cyl('party plate',x-.7+i*.7,.98,z,.35,.03,brass);blocker('table collision',x,.5,z,2.4,1,1);}
 table(4,21);table(5,25);cyl('barrel',7,.55,23,.85,1.1,wood);ring('barrel band',7,.8,23,.87,.08,dark).rotation.x=0;ring('barrel band',7,.25,23,.87,.08,dark).rotation.x=0;
 for(let i=0;i<12;i++){const x=-5+random()*9,z=20+random()*7;if(x<2)continue;sphere('picnic cushion',x,.16,z,.7,.24,.6,[red,blue,yellow][i%3]);}
 // Clouds share the sky's palette; birds animate separately.
 const cloud=mat('clouds','#edf0df',.2);for(let i=0;i<9;i++){const x=-70+i*17,z=45+random()*35;for(let j=0;j<3;j++)sphere('soft cloud',x+j*3,23+Math.sin(i)*3,z,9,2.1,4,cloud);}
 for(let i=0;i<5;i++){const root=new B.TransformNode('swallow',scene);const wingL=beam([0,0,0],[-.35,.08,.08],.045,dark,'bird wing',false,root);const wingR=beam([0,0,0],[.35,.08,.08],.045,dark,'bird wing',false,root);birds.push({root,wingL,wingR,phase:i*1.2});}
 // Expanded village bounds leave walkable routes behind the original village center.
 blocker('west boundary',MAP_BOUNDS.minX,3,2.5,1,6,MAP_BOUNDS.maxZ-MAP_BOUNDS.minZ);blocker('east boundary',MAP_BOUNDS.maxX,3,2.5,1,6,MAP_BOUNDS.maxZ-MAP_BOUNDS.minZ);blocker('south boundary',0,3,MAP_BOUNDS.minZ,MAP_BOUNDS.maxX-MAP_BOUNDS.minX,6,1);blocker('north boundary',0,3,MAP_BOUNDS.maxZ,MAP_BOUNDS.maxX-MAP_BOUNDS.minX,6,1);
 function character(id,x,z,{wizard=false,waistcoat=vest,player=false}={}){
  const root=new B.TransformNode(id,scene);root.position.set(x,terrainHeightAt(x,z),z);const parts=[];
  // The shipped runtime loads authored GLBs; retain only the authoritative roots.
  if(deferredCharacters){
   const height=wizard?1.45:1,joint=(name,px,py,pz)=>{const n=new B.TransformNode(name,scene);n.parent=root;n.position.set(px,py,pz);return n;};
   const left=joint('left arm pivot',-.36,1.12*height,0),right=joint('right arm pivot',.36,1.12*height,0),head=joint(id+' neck pivot',0,1.46*height,0);left.rotation.z=-.13;right.rotation.z=.13;
   const leftLeg=wizard?null:joint('left leg pivot',-.19,.63,0),rightLeg=wizard?null:joint('right leg pivot',.19,.63,0);
   root.rotation.y=Math.PI;if(id==='bilbo')root.scaling.setAll(1.04);if(id==='sam')root.scaling.setAll(.98);if(id==='frodo')root.scaling.setAll(.95);
   const obj={id,root,left,right,leftLeg,rightLeg,head,parts,wizard,visualArt:null};characters.push(obj);return obj;
  }
  const S=(name,px,py,pz,sx,sy,sz,mt,segments=10)=>{const m=sphere(name,px,py,pz,sx,sy,sz,mt,false,root,segments);parts.push(m);return m;};const C=(name,px,py,pz,d,h,mt,top=null)=>{const m=cyl(name,px,py,pz,d,h,mt,false,root,top);parts.push(m);return m;};
  const height=wizard?1.45:1;const torso=S('waistcoat',0,.87*height,0,.68, .8*height,.42,wizard?grey:waistcoat);S('shirt collar',0,1.18*height,-.02,.47,.18,.4,shirt);
  const face=S('face',0,1.46*height,0,.46,.61,.45,skin,18);S('nose',0,1.43*height,-.259,.094,.14,.11,skin);for(const side of [-1,1]){S('ear',side*.24,1.47*height,0,.11,.18,.10,skin,12);S('eye',side*.114,1.51*height,-.245,.045,.042,.023,eye,10);}
  if(wizard){C('robe skirt',0,.5,0,.92,1,grey,.6);for(let i=0;i<7;i++){const a=i/7*Math.PI*2;S('grey hair',Math.cos(a)*.27,2.05,Math.sin(a)*.2,.23,.48,.19,beard);}S('long beard',0,1.7,-.27,.44,.7,.24,beard);C('hat brim',0,2.46,0,1.15,.065,hatmat);const cap=C('pointed hat',-.06,2.85,0,.75,.82,hatmat,0);cap.rotation.z=.12;C('wizard staff',.64,1.15,-.06,.075,2.3,bark);S('staff top',.64,2.28,-.06,.13,.25,.15,wood);}
  else {for(let i=0;i<18;i++){const a=i/18*Math.PI*2;S('layered hobbit hair locks',Math.cos(a)*.215,1.68+Math.sin(i*.97)*.046,Math.sin(a)*.17,.125,.145,.131,id==='bilbo'?bilboHair:id==='sam'?samHair:id==='frodo'?frodoHair:hair,10);}S('curly hair crown',0,1.76,.03,.45,.15,.40,id==='bilbo'?bilboHair:id==='sam'?samHair:id==='frodo'?frodoHair:hair,12);for(let i=0;i<3;i++)S('waistcoat button',0,.75+i*.14,-.25,.044,.044,.035,brass,8);}
  let leftLeg=null,rightLeg=null;
  if(!wizard)for(const side of [-1,1]){const leg=new B.TransformNode(side<0?'left leg pivot':'right leg pivot',scene);leg.parent=root;leg.position.set(side*.19,.63,0);const t=sphere('trouser leg',0,-.26,0,.255,.57,.255,trousers,false,leg,10),f=sphere('bare hobbit foot',0,-.52,-.13,.3,.2,.52,feetmat,false,leg);parts.push(t,f);if(side<0)leftLeg=leg;else rightLeg=leg;}
  const left=new B.TransformNode('left arm pivot',scene);left.parent=root;left.position.set(-.36,1.12*height,0);const right=new B.TransformNode('right arm pivot',scene);right.parent=root;right.position.set(.36,1.12*height,0);
  for(const [pivot,side] of [[left,-1],[right,1]]){const a=sphere('shirt sleeve',0,-.23*height,0,.215,.50*height,.22,wizard?grey:shirt,false,pivot,10);const hand=sphere('hand',0,-.49*height,0,.15,.18,.15,skin,false,pivot);parts.push(a,hand);pivot.rotation.z=side*.13;}
  if(id==='bilbo'){for(const side of [-1,1]){const panel=S('Bilbo burgundy front coat',side*.33,.88,-.015,.28,.95,.3,bilboCoat,12);panel.rotation.z=side*.07;S('Bilbo burgundy coat tail',side*.23,.45,.19,.34,.63,.25,bilboCoat,12);S('Bilbo linen lapel',side*.19,1.18,-.21,.12,.25,.08,shirt,12);S('Bilbo silver side curls',side*.3,1.58,-.03,.12,.28,.15,bilboHair,10);}const book=M.CreateBox('Bilbo hand-bound book',{width:.28,height:.37,depth:.1},scene);finish(book,bookLeather,0,-.62,-.12,false,left);parts.push(book);}
  if(id==='sam'){const handle=cyl('Sam garden trowel handle',0,-.63,-.08,.045,.4,wood,false,right),blade=sphere('Sam garden trowel blade',0,-.89,-.08,.19,.3,.07,stone,false,right);parts.push(handle,blade);}
  if(id==='frodo'){S('Frodo shoulder satchel',.29,.78,.21,.26,.35,.2,bookLeather);}
  if(player){const cape=S('travelling cloak',0,.94,.18,.66,.88,.155,cloak);cape.rotation.x=-.10;S('small leather travelling pack',0,.87,.32,.30,.36,.16,bookLeather);S('cloak folded collar',0,1.23,.13,.49,.20,.24,cloak);}
  // Facial features and hair must follow the same neck pivot, never the skull alone.
  const head=new B.TransformNode(id+' neck pivot',scene);head.parent=root;head.position.set(0,1.46*height,0);
  const headNames=new Set(['face','nose','ear','eye','grey hair','long beard','hat brim','pointed hat','layered hobbit hair locks','curly hair crown','Bilbo silver side curls']);
  const headParts=parts.filter(p=>headNames.has(p.name));
  for(const part of headParts){part.parent=head;part.position.subtractInPlace(head.position);}
   const visualArt=enhanceHero({id,height,root,head,parts,sphere,materials:{skin,shirt,eye,brass,rosy,lip,wood,trousers,waistcoat,grey,hatmat,hair,bilboHair,frodoHair,samHair,beard}});
  // Batch rigid pieces only within their existing material AND animated parent.
  // Merge in parent-local coordinates so joints keep their original pivots.
  const buckets=new Map();
  for(const part of parts){const key=part.parent.uniqueId+':'+part.material.uniqueId;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(part);}
  const renderParts=[];
  for(const group of buckets.values()){
   if(group.length===1){renderParts.push(group[0]);continue;}
   const parent=group[0].parent,sourceNames=group.map(p=>p.name);
   for(const part of group){part.parent=null;part.computeWorldMatrix(true);}
   const merged=B.Mesh.MergeMeshes(group,true,true,undefined,false,false);
   merged.parent=parent;merged.name=id+' '+merged.material.name;merged.metadata={sourceNames};merged.isPickable=false;merged.receiveShadows=true;renderParts.push(merged);
  }
  root.rotation.y=Math.PI;if(id==='bilbo')root.scaling.setAll(1.04);if(id==='sam')root.scaling.setAll(.98);if(id==='frodo')root.scaling.setAll(.95);if(shadow)for(const part of renderParts)shadow.addShadowCaster(part);const obj={id,root,left,right,leftLeg,rightLeg,head,parts:renderParts,wizard,visualArt};characters.push(obj);return obj;
 }
 const player=character('player',0,-15,{waistcoat:frodoVest,player:true});character('bilbo',8,7,{waistcoat:bilbovest});character('sam',-6,1,{waistcoat:samvest});character('gandalf',-2,17,{wizard:true});character('frodo',3,-4,{waistcoat:frodoVest});
  // Background-only original villagers; they do not alter quests or NPC dialogue owners.
  for(const [id,x,z,material,range,phase] of [['farmer-ada',-12,-3,samvest,1.2,0],['farmer-berin',17,-7,vest,1.5,2],['gardener-nell',-16,23,frodoVest,1,4]]){const v=character(id,x,z,{waistcoat:material});v.home={x,z};v.range=range;v.phase=phase;v.root.rotation.y=.3+phase;workers.push(v);}
 // Two Bywater residents share one vertex-coloured mesh each instead of a full 65-bone GLB rig.
 const residentMaterial=new B.StandardMaterial('Bywater resident vertex colours',scene);residentMaterial.diffuseColor=B.Color3.White();residentMaterial.specularColor=new B.Color3(.025,.025,.025);residentMaterial.useVertexColors=true;
 function bywaterResident(id,x,z,{coat,apron,shirt:shirtColor,skin:skinColor,hair:hairColor,trousers:trouserColor,boots:bootColor,range,phase}){
  const root=new B.TransformNode(id,scene);root.position.set(x,terrainHeightAt(x,z),z);const source=[],skinGroups=[];
  function tint(mesh,color,px,py,pz){const c=B.Color3.FromHexString(color),count=mesh.getTotalVertices(),colors=new Float32Array(count*4);for(let i=0;i<count;i++){colors[i*4]=c.r;colors[i*4+1]=c.g;colors[i*4+2]=c.b;colors[i*4+3]=1;}mesh.material=residentMaterial;mesh.setVerticesData(B.VertexBuffer.ColorKind,colors,false,4);mesh.position.set(px,py,pz);mesh.isPickable=false;mesh.receiveShadows=true;source.push(mesh);const part=mesh.name;skinGroups.push({count,bone:/face|hair|eye/.test(part)?1:/sleeve left/.test(part)?2:/sleeve right/.test(part)?3:/trousers left|boots left/.test(part)?4:/trousers right|boots right/.test(part)?5:0});}
  const box=(name,w,h,d,px,py,pz,color)=>{const mesh=M.CreateBox(name,{width:w,height:h,depth:d},scene);tint(mesh,color,px,py,pz);};
  const ball=(name,sx,sy,sz,px,py,pz,color)=>{const mesh=M.CreateSphere(name,{diameter:1,segments:8},scene);mesh.scaling.set(sx,sy,sz);tint(mesh,color,px,py,pz);};
  box(id+' tunic',.58,.76,.36,0,.98,0,coat);box(id+' apron',.38,.53,.035,0,.92,-.2,apron);ball(id+' face',.33,.4,.33,0,1.58,0,skinColor);ball(id+' hair',.38,.19,.37,0,1.77,.015,hairColor);ball(id+' left eye',.04,.04,.025,-.07,1.61,-.17,'#35271f');ball(id+' right eye',.04,.04,.025,.07,1.61,-.17,'#35271f');
  box(id+' shirt sleeve left',.18,.62,.19,-.38,1.02,0,shirtColor);box(id+' shirt sleeve right',.18,.62,.19,.38,1.02,0,shirtColor);box(id+' trousers left',.21,.68,.22,-.16,.37,0,trouserColor);box(id+' trousers right',.21,.68,.22,.16,.37,0,trouserColor);box(id+' boots left',.23,.12,.34,-.16,.055,-.07,bootColor);box(id+' boots right',.23,.12,.34,.16,.055,-.07,bootColor);
  const bodyMesh=B.Mesh.MergeMeshes(source,true,true,undefined,false,false);if(!bodyMesh)throw new Error('Unable to merge low-cost Bywater resident: '+id);bodyMesh.name=id+' single-mesh resident';bodyMesh.parent=root;bodyMesh.position.set(0,0,0);bodyMesh.isPickable=false;bodyMesh.receiveShadows=true;if(shadow)shadow.addShadowCaster(bodyMesh);
  const joint=(name,px,py,pz)=>{const node=new B.TransformNode(id+' '+name,scene);node.parent=root;node.position.set(px,py,pz);return node;};
  const resident={id,root,left:joint('left arm pivot',-.36,1.05,0),right:joint('right arm pivot',.36,1.05,0),head:joint('head pivot',0,1.58,0),leftLeg:joint('left leg pivot',-.16,.37,0),rightLeg:joint('right leg pivot',.16,.37,0),parts:[bodyMesh],bodyMesh,simple:true,visualArt:{detailTag:'bywater-single-mesh-v1'},home:{x,z},range,phase,activity:'Idle',routineTime:0};
  // Rigid skinning retains one draw/mesh while making the existing joints visible.
  const skeleton=new B.Skeleton(id+' lightweight skeleton',id+' skeleton',scene);
  const baseBone=new B.Bone(id+' torso',skeleton,null,B.Matrix.Identity());
  for(const [name,node] of [['head',resident.head],['left arm',resident.left],['right arm',resident.right],['left leg',resident.leftLeg],['right leg',resident.rightLeg]]){
   const bone=new B.Bone(id+' '+name,skeleton,baseBone,B.Matrix.Translation(node.position.x,node.position.y,node.position.z));bone.linkTransformNode(node);
  }
  const indices=new Float32Array(bodyMesh.getTotalVertices()*4),weights=new Float32Array(indices.length);let vertex=0;
  for(const group of skinGroups)for(let i=0;i<group.count;i++,vertex++){indices[vertex*4]=group.bone;weights[vertex*4]=1;}
  bodyMesh.setVerticesData(B.VertexBuffer.MatricesIndicesKind,indices);bodyMesh.setVerticesData(B.VertexBuffer.MatricesWeightsKind,weights);bodyMesh.skeleton=skeleton;bodyMesh.numBoneInfluencers=1;resident.skeleton=skeleton;
  root.rotation.y=0;root.scaling.setAll(.78);characters.push(resident);workers.push(resident);bywaterDetails.residents++;return resident;
 }
 bywaterResident('bywater-innkeeper',26.6,-33.2,{coat:'#4d684d',apron:'#d6c7a6',shirt:'#f5e6bc',skin:'#e5b18a',hair:'#47372c',trousers:'#685a3b',boots:'#493d2c',range:.45,phase:1});
 bywaterResident('bywater-baker',31.4,-33.2,{coat:'#a9664b',apron:'#eee3c0',shirt:'#f5e6bc',skin:'#d7a18b',hair:'#65412b',trousers:'#685a3b',boots:'#493d2c',range:.45,phase:3});
 const fauna=createAmbientFauna(B,scene,{heightAt:terrainHeightAt,shadows:shadow});
 const applePositions=[[-18,12],[-17,17],[-21,15]];for(let i=0;i<3;i++){const [x,z]=applePositions[i];const root=new B.TransformNode('collectible apple '+i,scene);root.position.set(x,.4,z);sphere('collectible red apple',0,0,0,.42,.4,.42,applemat,false,root);cyl('apple stalk',0,.22,0,.035,.13,bark,false,root);sphere('apple leaf',.11,.24,0,.22,.05,.1,leaf2,false,root);const halo=M.CreateTorus('apple glow',{diameter:.75,thickness:.035,tessellation:20},scene);halo.material=brass;halo.parent=root;halo.position.y=-.22;apples.push({id:'apple-'+i,root,halo});}
 // Merge static geometry by material: a few dozen draws, rather than hundreds.
 const groups=new Map();for(const mesh of statics){const key=mesh.material.uniqueId;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mesh);}let mergedCount=0;for(const group of groups.values()){const m=B.Mesh.MergeMeshes(group,true,true,undefined,false,false);if(m){m.name='batched '+m.material.name;if([hill,hill2,turf].includes(m.material))cameraBlockers.push(m);m.receiveShadows=true;m.freezeWorldMatrix();if(shadow&& !['warm gravel','clouds','pond water'].includes(m.material.name))shadow.addShadowCaster(m);mergedCount++;}}
 const body=M.CreateSphere('player collision ellipsoid',{diameter:1,segments:6},scene);body.position.set(0,.72,-15);body.isVisible=false;body.isPickable=false;body.ellipsoid=new V(.32,.7,.32);body.checkCollisions=true;
 dressMaterials(B,scene,Object.values(mats));
 return {player,body,characters,workers,fauna,faunaMeshes:fauna.meshes,animals:fauna.animals,leaves,treeAnchors,hedgeAnchors,apples,birds,sun,hemi,shadow,colliders,cameraBlockers,ground,water,stats:{staticBatches:mergedCount,houses:HOMES.length,homesteadDetails,bywaterDetails,roads:ROADS.length,colliders:colliders.length,characters:characters.length,backgroundVillagers:workers.length,simpleResidents:workers.filter(c=>c.simple).length,fauna:fauna.animals.length,animatedCanopies:leaves.length,treeAnchors:treeAnchors.length,hedgeAnchors:hedgeAnchors.length,engine:'Babylon.js 9.32.1'},dispose(){scene.dispose();}};
}


