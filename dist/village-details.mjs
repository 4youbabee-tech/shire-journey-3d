// Original domestic set dressing. All static details join the existing material batches.
export function createVillageDetails(B,scene,{homes,heightAt,materials}){
 const M=B.MeshBuilder,V=B.Vector3,meshes=[],{wood,dark,stone,cream,white,red,blue,yellow,green}=materials;
 function place(m,material,x,y,z){m.material=material;m.position.set(x,y+heightAt(x,z),z);m.isPickable=false;m.receiveShadows=true;meshes.push(m);return m;}
 const box=(n,mat,x,y,z,w,h,d)=>place(M.CreateBox(n,{width:w,height:h,depth:d},scene),mat,x,y,z);
 const sphere=(n,mat,x,y,z,w,h,d)=>{const m=place(M.CreateSphere(n,{diameter:1,segments:6},scene),mat,x,y,z);m.scaling.set(w,h,d);return m;};
 function beam(n,a,b,r,mat){const av=new V(a[0],a[1]+heightAt(a[0],a[2]),a[2]),bv=new V(b[0],b[1]+heightAt(b[0],b[2]),b[2]),bvec=bv.subtract(av),mid=av.add(bv).scale(.5),m=M.CreateCylinder(n,{diameter:r,height:bvec.length(),tessellation:6},scene);m.material=mat;m.position.copyFrom(mid);m.rotationQuaternion=B.Quaternion.FromUnitVectorsToRef(V.Up(),bvec.normalize(),new B.Quaternion());m.isPickable=false;meshes.push(m);}
 for(const [i,h]of homes.entries()){
  const side=i%2?-1:1,x=h.x+side*2.8*h.s,z=h.z-1.1*h.s;
  // Firewood, a worn doorstep and a woven basket identify an occupied home.
  for(let j=0;j<5;j++)beam('stacked household firewood',[x-.28,(j%2)*.13+.12,z+Math.floor(j/2)*.16],[x+.3,(j%2)*.13+.12,z+Math.floor(j/2)*.16],.13,wood);
  const basket=place(M.CreateCylinder('doorstep woven basket',{diameter:.45,height:.32,tessellation:10},scene),wood,h.x-side*2.7*h.s,.16,h.z-.9*h.s);for(let j=0;j<3;j++)sphere('basket garden produce',j%2?green:yellow,basket.position.x+(j-1)*.09,.35,basket.position.z,.15,.13,.15);
  for(let j=0;j<3;j++){const m=sphere('worn individual doorstep stone',stone,h.x+(j-1)*.48*h.s,.055,h.z-1.9*h.s,.47*h.s,.11,.57*h.s);m.rotation.y=Math.sin(i*3+j)*.4;}
  // Small framed house plaques and a porch lantern sit outside the clear doorway.
  box('house name plaque',dark,h.x-side*2.7*h.s,1.2*h.s,h.z-.38*h.s,.38,.28,.06);
  box('porch lantern glass',yellow,h.x+side*2.8*h.s,1.95*h.s,h.z-.48*h.s,.19,.27,.18);
  for(const sx of [-1,1])box('porch lantern frame',dark,h.x+side*2.8*h.s+sx*.105,1.95*h.s,h.z-.48*h.s,.035,.31,.22);
 }
 // A washing line, folded cloth and shared bread make the village read as daily life.
 for(const x of [-22,-17])beam('washing line post',[x,0,-11],[x,2.05,-11],.11,wood);
 beam('laundry rope',[-22,1.9,-11],[-17,1.9,-11],.024,cream);
 for(let j=0;j<4;j++){const cloth=box('linen drying in sunlight',j%2?white:blue,-21.5+j*1.1,1.48,-11,.75,.8,.025);cloth.rotation.z=Math.sin(j*3)*.09;}
 for(const [x,z]of [[23,-12],[29,-16],[25,-21]]){box('market folded cloth',white,x+.55,1.11,z-.2,.45,.09,.32);for(let j=0;j<3;j++){const loaf=sphere('fresh market loaf',cream,x-.5+j*.33,1.2,z+.15,.43,.23,.22);loaf.rotation.y=.2*j;for(let k=0;k<2;k++)box('bread scored crust',wood,x-.54+j*.33+k*.085,1.302,z+.15,.02,.005,.11);}}
 return meshes;
}
