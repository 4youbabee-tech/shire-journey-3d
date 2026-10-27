// All art here is original procedural stylized geometry, not imported film assets.
export function createWorld(B,scene,{shadows=true}={}){
 const V=B.Vector3, M=B.MeshBuilder;let seed=7349;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const mats={},statics=[],colliders=[],characters=[],apples=[],birds=[];
 function mat(name,hex,emission=0){const m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(hex);m.specularColor=new B.Color3(.03,.03,.03);if(emission)m.emissiveColor=m.diffuseColor.scale(emission);mats[name]=m;return m;}
 const grass=mat('meadow','#7f9f5c'),hill=mat('hill','#6d914d'),hill2=mat('distant hills','#709b70'),cream=mat('lime plaster','#e8d3a0'),wood=mat('oak timber','#715034'),dark=mat('dark timber','#493d2c'),pathmat=mat('warm gravel','#c5ac7a'),bark=mat('bark','#6d5338'),leaf=mat('summer leaves','#729c47'),leaf2=mat('sunlit leaves','#a0b95b'),leaf3=mat('deep leaves','#4d7b40'),door=mat('bag end green','#355f47'),brass=mat('warm brass','#dcac4e'),glass=mat('warm windows','#f4ca75',.3),stone=mat('path stone','#9d9a7b'),white=mat('cream cloth','#eee3c0'),red=mat('rust bunting','#b97151'),blue=mat('sky bunting','#7a9a9b'),yellow=mat('wildflower gold','#e8bc53'),pink=mat('wildflower pink','#d48c8f'),skin=mat('hobbit skin','#e5b18a'),hair=mat('brown curls','#65412b'),bilboHair=mat('Bilbo silver-brown hair','#76634d'),samHair=mat('Sam sandy curls','#8b693e'),frodoHair=mat('Frodo dark curls','#47372c'),bookLeather=mat('Bilbo book leather','#54382d'),trousers=mat('trousers','#685a3b'),feetmat=mat('bare feet','#dca77c'),eye=mat('eyes','#27372b'),shirt=mat('cream shirt','#f5e6bc'),vest=mat('player vest','#99704a'),cloak=mat('green cloak','#506950'),samvest=mat('sam waistcoat','#a78e56'),bilbovest=mat('bilbo waistcoat','#a9664b'),frodoVest=mat('Frodo blue waistcoat','#426b70'),grey=mat('grey robes','#969e9a'),hatmat=mat('blue grey hat','#7c8f94'),beard=mat('grey beard','#d8d9cb'),applemat=mat('red apples','#ce6941');
 const sun=new B.DirectionalLight('warm morning sunlight',new V(-.8,-1.6,.65),scene);sun.position=new V(35,55,-30);sun.intensity=1.05;sun.diffuse=new B.Color3(1,.91,.73);const hemi=new B.HemisphericLight('sky fill',new V(0,1,0),scene);hemi.intensity=.6;hemi.groundColor=B.Color3.FromHexString('#66794c');
 scene.clearColor=B.Color4.FromHexString('#bcd9dfff');scene.fogMode=B.Scene.FOGMODE_LINEAR;scene.fogStart=50;scene.fogEnd=150;scene.fogColor=B.Color3.FromHexString('#bcd9df');scene.ambientColor=new B.Color3(.09,.09,.07);scene.collisionsEnabled=true;
 const shadow=shadows?new B.ShadowGenerator(1024,sun):null;if(shadow){shadow.usePercentageCloserFiltering=true;shadow.filteringQuality=B.ShadowGenerator.QUALITY_LOW;shadow.bias=.0015;shadow.normalBias=.035;shadow.darkness=.22;}
 function finish(mesh,material,x,y,z,staticMesh=true,parent=null){mesh.material=material;mesh.position.set(x,y,z);mesh.isPickable=false;if(parent)mesh.parent=parent;else if(staticMesh)statics.push(mesh);mesh.receiveShadows=true;return mesh;}
 function sphere(name,x,y,z,sx,sy,sz,material,staticMesh=true,parent=null,segments=10){const m=M.CreateSphere(name,{diameter:1,segments},scene);m.scaling.set(sx,sy,sz);return finish(m,material,x,y,z,staticMesh,parent);}
 function cyl(name,x,y,z,diameter,height,material,staticMesh=true,parent=null,top=null,tessellation=12){const m=M.CreateCylinder(name,{diameter,height,diameterTop:top??diameter,tessellation},scene);return finish(m,material,x,y,z,staticMesh,parent);}
 function beam(a,b,r,material,name='timber',staticMesh=true,parent=null){const av=new V(...a),bv=new V(...b),mid=av.add(bv).scale(.5),delta=bv.subtract(av);const m=cyl(name,mid.x,mid.y,mid.z,r,delta.length(),material,staticMesh,parent);m.rotationQuaternion=B.Quaternion.FromUnitVectorsToRef(V.Up(),delta.normalize(),new B.Quaternion());return m;}
 function ring(name,x,y,z,d,t,material){const m=M.CreateTorus(name,{diameter:d,thickness:t,tessellation:28},scene);m.rotation.x=Math.PI/2;return finish(m,material,x,y,z);}
 function blocker(name,x,y,z,sx,sy,sz){const m=M.CreateBox(name,{width:sx,height:sy,depth:sz},scene);m.position.set(x,y,z);m.isVisible=false;m.checkCollisions=true;m.isPickable=false;colliders.push(m);return m;}
 const ground=M.CreateGround('village walkable ground',{width:180,height:180,subdivisions:1},scene);ground.material=grass;ground.receiveShadows=true;ground.checkCollisions=true;
 // A broad, quiet horizon gives the village a real landscape silhouette.
 for(let i=0;i<16;i++){const angle=i/16*Math.PI*2;const r=64+random()*20;sphere('rolling distant hill',Math.cos(angle)*r,-3+random()*2,Math.sin(angle)*r,37+random()*20,14+random()*16,35+random()*18,i%2?hill2:hill);}
 function path(points,width=2.5){const p=B.Curve3.CreateCatmullRomSpline(points.map(([x,z])=>new V(x,.035,z)),10,false).getPoints();const left=[],right=[];for(let i=0;i<p.length;i++){const t=p[Math.min(i+1,p.length-1)].subtract(p[Math.max(i-1,0)]).normalize(),n=new V(t.z,0,-t.x);left.push(p[i].add(n.scale(width/2)));right.push(p[i].subtract(n.scale(width/2)));}const m=M.CreateRibbon('winding village path',{pathArray:[left,right],sideOrientation:B.Mesh.DOUBLESIDE},scene);m.material=pathmat;m.receiveShadows=true;statics.push(m);}
 path([[0,-25],[0,-14],[1,-6],[1,1],[4,6],[3,12],[-1,19],[1,30]],3.1);path([[1,0],[-5,1],[-10,5],[-16,10],[-20,16]],2);path([[4,6],[8,7],[11,10]],1.9);path([[-1,19],[-7,23],[-12,25]],1.8);
 function tree(x,z,s=1,kind='normal'){
  cyl('tapering trunk',x,1.5*s,z,.55*s,3*s,bark,true,null,.3*s,8);blocker('tree trunk collision',x,1.5*s,z,.65*s,3*s,.65*s);
  beam([x,1.6*s,z],[x-.8*s,3*s,z],.2*s,bark);beam([x,1.8*s,z],[x+.9*s,3.2*s,z+.3*s],.2*s,bark);
  for(let j=0;j<5;j++){const a=j/5*6.28;sphere('rounded tree crown',x+Math.cos(a)*1.1*s,3.7*s+(j%2)*.6*s,z+Math.sin(a)*.9*s,2.7*s,2.7*s,2.5*s,j%3===0?leaf2:j%3===1?leaf:leaf3);}
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
 house(11,11,1.2);house(-12,7,.9,red);house(-12,27,.85,blue);house(19,25,.75,door);
 function fence(points){for(let i=0;i<points.length;i++){const [x,z]=points[i];cyl('fence post',x,.55,z,.16,1.1,wood,true,null,.1,6);if(i){const [px,pz]=points[i-1];beam([x,.4,z],[px,.4,pz],.09,wood);beam([x,.8,z],[px,.8,pz],.09,wood);}}}
 fence([[-15,0],[-13,0],[-11,0],[-9,0],[-8,-1]]);fence([[-17,8],[-19,8],[-21,8],[-23,8],[-25,10],[-25,12]]);fence([[15,7],[17,7],[19,7],[21,7]]);fence([[-7,25],[-7,27],[-7,29]]);
 // Garden beds, pumpkins and flowers make the homes feel inhabited.
 for(let row=0;row<3;row++){path([[-15+row,-1],[-15+row,-5]],.5);for(let j=0;j<5;j++){sphere('cabbage',-15+row,.22,-1-j*.8,.43,.42,.43,leaf3);}}
 for(let i=0;i<7;i++)sphere('pumpkin',-9+random()*2,.24,3+random(),.5,.43,.48,i%2?red:yellow);
 for(let i=0;i<260;i++){const x=random()*62-31,z=random()*52-20;if(Math.abs(x)<4|| (x>6&&x<16&&z>7&&z<18)|| (x<-8&&x>-16&&z>3&&z<12))continue;const color=i%4===0?pink:i%3===0?white:yellow;const h=.14+random()*.17;cyl('flower stalk',x,h/2,z,.028,h,leaf3,true,null,null,4);sphere('meadow flower',x,h,z,.17,.09,.17,color,true,null,5);}
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
 // Closed village boundary, generous enough for the entire implemented area.
 blocker('west boundary',-33,3,5,1,6,62);blocker('east boundary',33,3,5,1,6,62);blocker('south boundary',0,3,-25,66,6,1);blocker('north boundary',0,3,34,66,6,1);
 function character(id,x,z,{wizard=false,waistcoat=vest,player=false}={}){
  const root=new B.TransformNode(id,scene);root.position.set(x,0,z);const parts=[];const S=(name,px,py,pz,sx,sy,sz,mt,segments=10)=>{const m=sphere(name,px,py,pz,sx,sy,sz,mt,false,root,segments);parts.push(m);return m;};const C=(name,px,py,pz,d,h,mt,top=null)=>{const m=cyl(name,px,py,pz,d,h,mt,false,root,top);parts.push(m);return m;};
  const height=wizard?1.45:1;const torso=S('waistcoat',0,.87*height,0,.68, .8*height,.42,wizard?grey:waistcoat);S('shirt collar',0,1.18*height,-.02,.47,.18,.4,shirt);
  const head=S('face',0,1.46*height,0,.57,.62,.52,skin,14);S('nose',0,1.43*height,-.28,.13,.16,.16,skin);for(const side of [-1,1]){S('ear',side*.29,1.47*height,0,.15,.23,.15,skin);S('eye',side*.11,1.51*height,-.245,.055,.065,.035,eye,8);}
  if(wizard){C('robe skirt',0,.5,0,.92,1,grey,.6);for(let i=0;i<7;i++){const a=i/7*Math.PI*2;S('grey hair',Math.cos(a)*.27,2.05,Math.sin(a)*.2,.23,.48,.19,beard);}S('long beard',0,1.7,-.27,.44,.7,.24,beard);C('hat brim',0,2.46,0,1.15,.065,hatmat);const cap=C('pointed hat',-.06,2.85,0,.75,.82,hatmat,0);cap.rotation.z=.12;C('wizard staff',.64,1.15,-.06,.075,2.3,bark);S('staff top',.64,2.28,-.06,.13,.25,.15,wood);}
  else {for(let i=0;i<12;i++){const a=i/12*Math.PI*2;S('individual hobbit curls',Math.cos(a)*.23,1.66+Math.sin(a)*.08,Math.sin(a)*.19,.24,.23,.23,id==='bilbo'?bilboHair:id==='sam'?samHair:id==='frodo'?frodoHair:hair,8);}S('curly hair crown',0,1.76,.03,.5,.2,.43,id==='bilbo'?bilboHair:id==='sam'?samHair:id==='frodo'?frodoHair:hair);for(let i=0;i<3;i++)S('waistcoat button',0,.75+i*.14,-.22,.045,.045,.035,brass,6);}
  let leftLeg=null,rightLeg=null;
  if(!wizard)for(const side of [-1,1]){const leg=new B.TransformNode(side<0?'left leg pivot':'right leg pivot',scene);leg.parent=root;leg.position.set(side*.19,.63,0);const t=cyl('trouser leg',0,-.26,0,.25,.49,trousers,false,leg),f=sphere('bare hobbit foot',0,-.52,-.13,.3,.2,.52,feetmat,false,leg);parts.push(t,f);if(side<0)leftLeg=leg;else rightLeg=leg;}
  const left=new B.TransformNode('left arm pivot',scene);left.parent=root;left.position.set(-.36,1.12*height,0);const right=new B.TransformNode('right arm pivot',scene);right.parent=root;right.position.set(.36,1.12*height,0);
  for(const [pivot,side] of [[left,-1],[right,1]]){const a=cyl('shirt sleeve',0,-.23*height,0,.21,.47*height,wizard?grey:shirt,false,pivot);const hand=sphere('hand',0,-.49*height,0,.18,.2,.18,skin,false,pivot);parts.push(a,hand);pivot.rotation.z=side*.13;}
  if(id==='bilbo'){const book=M.CreateBox('Bilbo hand-bound book',{width:.28,height:.37,depth:.1},scene);finish(book,bookLeather,0,-.62,-.12,false,left);parts.push(book);}
  if(id==='sam'){const handle=cyl('Sam garden trowel handle',0,-.63,-.08,.045,.4,wood,false,right),blade=sphere('Sam garden trowel blade',0,-.89,-.08,.19,.3,.07,stone,false,right);parts.push(handle,blade);}
  if(id==='frodo'){S('Frodo shoulder satchel',.29,.78,.21,.26,.35,.2,bookLeather);}
  if(player){const cape=S('travelling cloak',0,.92,.19,.74,.78,.22,cloak);cape.rotation.x=-.13;S('small pack',0,.9,.34,.38,.45,.2,wood);}
  root.rotation.y=Math.PI;if(id==='bilbo')root.scaling.setAll(1.04);if(id==='sam')root.scaling.setAll(.98);if(id==='frodo')root.scaling.setAll(.95);if(shadow)for(const part of parts)shadow.addShadowCaster(part);const obj={id,root,left,right,leftLeg,rightLeg,head,parts,wizard};characters.push(obj);return obj;
 }
 const player=character('player',0,-15,{player:true});character('bilbo',8,7,{waistcoat:bilbovest});character('sam',-6,1,{waistcoat:samvest});character('gandalf',-2,17,{wizard:true});character('frodo',3,-4,{waistcoat:frodoVest});
 const applePositions=[[-18,12],[-17,17],[-21,15]];for(let i=0;i<3;i++){const [x,z]=applePositions[i];const root=new B.TransformNode('collectible apple '+i,scene);root.position.set(x,.4,z);sphere('collectible red apple',0,0,0,.42,.4,.42,applemat,false,root);cyl('apple stalk',0,.22,0,.035,.13,bark,false,root);sphere('apple leaf',.11,.24,0,.22,.05,.1,leaf2,false,root);const halo=M.CreateTorus('apple glow',{diameter:.75,thickness:.035,tessellation:20},scene);halo.material=brass;halo.parent=root;halo.position.y=-.22;apples.push({id:'apple-'+i,root,halo});}
 // Merge static geometry by material: a few dozen draws, rather than hundreds.
 const groups=new Map();for(const mesh of statics){const key=mesh.material.uniqueId;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mesh);}let mergedCount=0;for(const group of groups.values()){const m=B.Mesh.MergeMeshes(group,true,true,undefined,false,false);if(m){m.name='batched '+m.material.name;m.receiveShadows=true;m.freezeWorldMatrix();if(shadow&& !['warm gravel','clouds','pond water'].includes(m.material.name))shadow.addShadowCaster(m);mergedCount++;}}
 const body=M.CreateSphere('player collision ellipsoid',{diameter:1,segments:6},scene);body.position.set(0,.72,-15);body.isVisible=false;body.isPickable=false;body.ellipsoid=new V(.32,.7,.32);body.checkCollisions=true;
 return {player,body,characters,apples,birds,sun,hemi,shadow,colliders,ground,water,stats:{staticBatches:mergedCount,colliders:colliders.length,characters:characters.length,engine:'Babylon.js 9.32.1'},dispose(){scene.dispose();}};
}
