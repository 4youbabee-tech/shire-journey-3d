// All art here is original procedural stylized geometry, not imported film assets.
import {HOMES,ROADS,MAP_BOUNDS} from './village-layout.mjs';
import {enhanceHero} from './hero-art.mjs';
import {dressMaterials} from './surface-art.mjs';
export function createWorld(B,scene,{shadows=true,deferredNature=false}={}){
 const V=B.Vector3, M=B.MeshBuilder;let seed=7349;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const mats={},statics=[],colliders=[],characters=[],apples=[],birds=[],leaves=[],workers=[],treeAnchors=[];
 function mat(name,hex,emission=0){const m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(hex);m.specularColor=new B.Color3(.03,.03,.03);if(emission)m.emissiveColor=m.diffuseColor.scale(emission);mats[name]=m;return m;}
 const grass=mat('meadow','#81966c'),hill=mat('hill','#6e8b59'),hill2=mat('distant hills','#7c9b7a'),cream=mat('lime plaster','#e8d3a0'),wood=mat('oak timber','#715034'),dark=mat('dark timber','#493d2c'),pathmat=mat('warm gravel','#c5ac7a'),bark=mat('bark','#6d5338'),leaf=mat('summer leaves','#688c55'),leaf2=mat('sunlit leaves','#91ab68'),leaf3=mat('deep leaves','#4f7650'),door=mat('bag end green','#355f47'),brass=mat('warm brass','#dcac4e'),glass=mat('warm windows','#f4ca75',.3),stone=mat('path stone','#9d9a7b'),white=mat('cream cloth','#eee3c0'),red=mat('rust bunting','#b97151'),blue=mat('sky bunting','#7a9a9b'),yellow=mat('wildflower gold','#e8bc53'),pink=mat('wildflower pink','#d48c8f'),skin=mat('hobbit skin','#e5b18a'),hair=mat('brown curls','#65412b'),bilboHair=mat('Bilbo silver-brown hair','#76634d'),samHair=mat('Sam sandy curls','#8b693e'),frodoHair=mat('Frodo dark curls','#47372c'),bookLeather=mat('Bilbo book leather','#54382d'),trousers=mat('trousers','#685a3b'),feetmat=mat('bare feet','#dca77c'),eye=mat('eyes','#27372b'),rosy=mat('warm skin midtones','#d7a18b'),lip=mat('soft lip shadow','#a86d60'),shirt=mat('cream shirt','#f5e6bc'),vest=mat('player vest','#99704a'),cloak=mat('green cloak','#506950'),samvest=mat('sam waistcoat','#a78e56'),bilbovest=mat('bilbo waistcoat','#a9664b'),bilboCoat=mat('Bilbo burgundy coat','#663c4e'),frodoVest=mat('Frodo blue waistcoat','#426b70'),grey=mat('grey robes','#969e9a'),hatmat=mat('blue grey hat','#7c8f94'),beard=mat('grey beard','#d8d9cb'),applemat=mat('red apples','#ce6941');
 const sun=new B.DirectionalLight('warm morning sunlight',new V(-.8,-1.6,.65),scene);sun.position=new V(35,55,-30);sun.intensity=.95;sun.diffuse=new B.Color3(1,.91,.73);const hemi=new B.HemisphericLight('sky fill',new V(0,1,0),scene);hemi.intensity=.6;hemi.groundColor=B.Color3.FromHexString('#66794c');
 scene.clearColor=B.Color4.FromHexString('#bcd9dfff');scene.fogMode=B.Scene.FOGMODE_LINEAR;scene.fogStart=70;scene.fogEnd=190;scene.fogColor=B.Color3.FromHexString('#bcd9df');scene.ambientColor=new B.Color3(.12,.11,.09);scene.imageProcessingConfiguration.contrast=1.09;scene.imageProcessingConfiguration.exposure=1.005;scene.collisionsEnabled=true;scene.skipPointerMovePicking=true;
 const shadow=shadows?new B.ShadowGenerator(1024,sun):null;if(shadow){shadow.usePercentageCloserFiltering=true;shadow.filteringQuality=B.ShadowGenerator.QUALITY_LOW;shadow.bias=.005;shadow.normalBias=.3;shadow.darkness=.22;}
 function finish(mesh,material,x,y,z,staticMesh=true,parent=null){mesh.material=material;mesh.position.set(x,y,z);mesh.isPickable=false;if(parent)mesh.parent=parent;else if(staticMesh)statics.push(mesh);mesh.receiveShadows=true;return mesh;}
 function sphere(name,x,y,z,sx,sy,sz,material,staticMesh=true,parent=null,segments=10){const m=M.CreateSphere(name,{diameter:1,segments},scene);m.scaling.set(sx,sy,sz);return finish(m,material,x,y,z,staticMesh,parent);}
 function cyl(name,x,y,z,diameter,height,material,staticMesh=true,parent=null,top=null,tessellation=12){const m=M.CreateCylinder(name,{diameter,height,diameterTop:top??diameter,tessellation},scene);return finish(m,material,x,y,z,staticMesh,parent);}
 function beam(a,b,r,material,name='timber',staticMesh=true,parent=null){const av=new V(...a),bv=new V(...b),mid=av.add(bv).scale(.5),delta=bv.subtract(av);const m=cyl(name,mid.x,mid.y,mid.z,r,delta.length(),material,staticMesh,parent);m.rotationQuaternion=B.Quaternion.FromUnitVectorsToRef(V.Up(),delta.normalize(),new B.Quaternion());return m;}
 function ring(name,x,y,z,d,t,material){const m=M.CreateTorus(name,{diameter:d,thickness:t,tessellation:28},scene);m.rotation.x=Math.PI/2;return finish(m,material,x,y,z);}
 function blocker(name,x,y,z,sx,sy,sz){const m=M.CreateBox(name,{width:sx,height:sy,depth:sz},scene);m.position.set(x,y,z);m.isVisible=false;m.checkCollisions=true;m.isPickable=false;colliders.push(m);return m;}
 const ground=M.CreateGround('village walkable ground',{width:180,height:180,subdivisions:48},scene);ground.material=grass;ground.receiveShadows=true;ground.checkCollisions=true;
 // Soft deterministic ground mottling provides a lived-in meadow without textures/network.
 const terrainVertices=ground.getVerticesData(B.VertexBuffer.PositionKind),terrainColors=[];
 for(let i=0;i<terrainVertices.length;i+=3){
  const x=terrainVertices[i],z=terrainVertices[i+2];
  const n=Math.sin(x*.17)*Math.cos(z*.12)*.068+Math.sin(x*.43+z*.35)*.022;
  terrainColors.push(.87+n*.6,.91+n,.85+n*.45,1);
 }
 ground.setVerticesData(B.VertexBuffer.ColorKind,new Float32Array(terrainColors));
 // A broad, quiet horizon gives the village a real landscape silhouette.
 for(let i=0;i<16;i++){const angle=i/16*Math.PI*2;const r=64+random()*20;sphere('rolling distant hill',Math.cos(angle)*r,-3+random()*2,Math.sin(angle)*r,37+random()*20,14+random()*16,35+random()*18,i%2?hill2:hill);}
 function path(points,width=2.5){const p=B.Curve3.CreateCatmullRomSpline(points.map(([x,z])=>new V(x,.035,z)),10,false).getPoints();const left=[],right=[];for(let i=0;i<p.length;i++){const t=p[Math.min(i+1,p.length-1)].subtract(p[Math.max(i-1,0)]).normalize(),n=new V(t.z,0,-t.x);left.push(p[i].add(n.scale(width/2)));right.push(p[i].subtract(n.scale(width/2)));}const m=M.CreateRibbon('winding village path',{pathArray:[left,right],sideOrientation:B.Mesh.DOUBLESIDE},scene);m.material=pathmat;m.receiveShadows=true;statics.push(m);}
 for(const road of ROADS)path(road.points,road.width);
 function tree(x,z,s=1,kind='normal'){
  treeAnchors.push({x,z,s,kind});
  if(deferredNature){blocker('tree trunk collision',x,1.5*s,z,.65*s,3*s,.65*s);return;}
  cyl('tapering trunk',x,1.5*s,z,.55*s,3*s,bark,true,null,.3*s,8);blocker('tree trunk collision',x,1.5*s,z,.65*s,3*s,.65*s);
  beam([x,1.6*s,z],[x-.8*s,3*s,z],.2*s,bark);beam([x,1.8*s,z],[x+.9*s,3.2*s,z+.3*s],.2*s,bark);
  for(let j=0;j<5;j++){const a=j/5*6.28;sphere('rounded tree crown',x+Math.cos(a)*1.1*s,3.7*s+(j%2)*.6*s,z+Math.sin(a)*.9*s,2.7*s,2.7*s,2.5*s,j%3===0?leaf2:j%3===1?leaf:leaf3);}
  if(leaves.length<11){const canopy=new B.TransformNode('gentle wind in tree leaves',scene);canopy.position.set(x,3.4*s,z);const crown=sphere('swaying upper foliage',0,.45*s,0,2.2*s,1.8*s,2*s,kind==='apple'?leaf2:leaf,false,canopy,8);crown.receiveShadows=true;leaves.push({root:canopy,phase:x*.14+z*.2,amplitude:.025+.008*(leaves.length%3)});}
   if(kind==='apple')for(let j=0;j<9;j++){const a=j*2.4;sphere('apples in tree',x+Math.cos(a)*1.7*s,2.7*s+(j%3)*.55*s,z+Math.sin(a)*1.3*s,.2,.23,.2,applemat);}
 }
 tree(-2,22,2.2);tree(-20,13,1.15,'apple');tree(-17,19,1,'apple');tree(-23,19,1.2,'apple');
 [[-25,-8,1.3],[-28,4,1.8],[24,14,1.5],[29,1,1.2],[17,27,1.7],[-27,28,1.5],[-13,-14,1.3],[19,-15,1.4],[-30,-18,1.6],[31,-18,1.2],[-30,18,1.1],[29,25,1.8]].forEach(p=>tree(...p));
 function house(x,z,s=1,frontColor=door){
  sphere('grass covered hobbit mound',x,1.3*s,z+4.6*s,11*s,6*s,9*s,hill,true,null,18);sphere('golden roof edge',x,2*s,z+2.9*s,8*s,4.8*s,5.5*s,leaf,true,null,16);
  const facade=cyl('round plaster facade',x,1.95*s,z,5.6*s,.55*s,cream);facade.rotation.x=Math.PI/2;
  ring('timber frame',x,1.95*s,z-.3*s,5.35*s,.18*s,wood);
  const d=cyl('painted round hobbit door',x,1.35*s,z-.34*s,2.35*s,.17*s,frontColor);d.rotation.x=Math.PI/2;ring('door arch',x,1.35*s,z-.46*s,2.48*s,.16*s,dark);
  for(let i=-3;i<=3;i++){const xx=i*.25*s,hh=Math.sqrt(Math.max(0,1.08*1.08-i*.25*i*.25))*s;beam([x+xx,1.35*s-hh,z-.44*s],[x+xx,1.35*s+hh,z-.44*s],.025*s,wood);}
  sphere('round brass doorknob',x+.13*s,1.35*s,z-.55*s,.16*s,.16*s,.12*s,brass);
  for(const side of [-1,1]){const wx=x+side*1.92*s;const w=cyl('glowing round window',wx,1.9*s,z-.36*s,.92*s,.13*s,glass);w.rotation.x=Math.PI/2;ring('round window frame',wx,1.9*s,z-.45*s,1*s,.12*s,wood);beam([wx-.4*s,1.9*s,z-.49*s],[wx+.4*s,1.9*s,z-.49*s],.06*s,wood);beam([wx,1.5*s,z-.49*s],[wx,2.3*s,z-.49*s],.06*s,wood);cyl('flowerpot',wx,.6*s,z-.8*s,.55*s,.5*s,red);sphere('window flowers',wx,.95*s,z-.8*s,.8*s,.5*s,.6*s,leaf2);}
  cyl('stone doorstep',x,.09,z-1.1*s,2.5*s,.18,stone);cyl('chimney',x+1.7*s,4.6*s,z+2*s,.7*s,2*s,stone,true,null,.65*s,6);cyl('chimney cap',x+1.7*s,5.6*s,z+2*s,1*s,.2*s,cream);
  blocker('hobbit house solid interior',x,2*s,z+2.5*s,6*s,4*s,6*s);
 }
 for(const home of HOMES)house(home.x,home.z,home.s,home.color==='rust'?red:home.color==='blue'?blue:door);
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
 for(let i=0;i<45;i++){const x=-44+random()*88,z=-41+random()*89;
  if(Math.abs(x)<9&&z>-21&&z<19)continue;
  sphere('wild hedge bush',x,.32,z,.75+random()*.6,.8+random()*.45,.8+random()*.6,i%3?leaf3:leaf2,true,null,7);
 }
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
  const root=new B.TransformNode(id,scene);root.position.set(x,0,z);const parts=[];const S=(name,px,py,pz,sx,sy,sz,mt,segments=10)=>{const m=sphere(name,px,py,pz,sx,sy,sz,mt,false,root,segments);parts.push(m);return m;};const C=(name,px,py,pz,d,h,mt,top=null)=>{const m=cyl(name,px,py,pz,d,h,mt,false,root,top);parts.push(m);return m;};
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
 const applePositions=[[-18,12],[-17,17],[-21,15]];for(let i=0;i<3;i++){const [x,z]=applePositions[i];const root=new B.TransformNode('collectible apple '+i,scene);root.position.set(x,.4,z);sphere('collectible red apple',0,0,0,.42,.4,.42,applemat,false,root);cyl('apple stalk',0,.22,0,.035,.13,bark,false,root);sphere('apple leaf',.11,.24,0,.22,.05,.1,leaf2,false,root);const halo=M.CreateTorus('apple glow',{diameter:.75,thickness:.035,tessellation:20},scene);halo.material=brass;halo.parent=root;halo.position.y=-.22;apples.push({id:'apple-'+i,root,halo});}
 // Merge static geometry by material: a few dozen draws, rather than hundreds.
 const groups=new Map();for(const mesh of statics){const key=mesh.material.uniqueId;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mesh);}let mergedCount=0;for(const group of groups.values()){const m=B.Mesh.MergeMeshes(group,true,true,undefined,false,false);if(m){m.name='batched '+m.material.name;m.receiveShadows=true;m.freezeWorldMatrix();if(shadow&& !['warm gravel','clouds','pond water'].includes(m.material.name))shadow.addShadowCaster(m);mergedCount++;}}
 const body=M.CreateSphere('player collision ellipsoid',{diameter:1,segments:6},scene);body.position.set(0,.72,-15);body.isVisible=false;body.isPickable=false;body.ellipsoid=new V(.32,.7,.32);body.checkCollisions=true;
 dressMaterials(B,scene,Object.values(mats));
 return {player,body,characters,workers,leaves,treeAnchors,apples,birds,sun,hemi,shadow,colliders,ground,water,stats:{staticBatches:mergedCount,houses:HOMES.length,roads:ROADS.length,colliders:colliders.length,characters:characters.length,backgroundVillagers:workers.length,animatedCanopies:leaves.length,engine:'Babylon.js 9.32.1'},dispose(){scene.dispose();}};
}


