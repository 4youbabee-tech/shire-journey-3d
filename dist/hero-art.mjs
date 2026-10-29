// Original storybook-face and costume details using the existing articulated pivots.
// Geometry is grouped by existing material/parent by world.mjs, not individual draw calls.
export function enhanceHero({id,height,root,head,parts,sphere,materials}){
 const {skin,shirt,eye,brass,rosy,lip,wood,trousers,waistcoat,grey,hatmat,
  hair,bilboHair,frodoHair,samHair,beard}=materials;
 const hairMat=id==='bilbo'?bilboHair:id==='sam'?samHair:id==='frodo'?frodoHair:hair;
 const headPart=(name,x,y,z,sx,sy,sz,mt,segments=10)=>{
  const m=sphere(name,x,y,z,sx,sy,sz,mt,false,head,segments);parts.push(m);return m;
 };
 const bodyPart=(name,x,y,z,sx,sy,sz,mt,segments=10)=>{
  const m=sphere(name,x,y,z,sx,sy,sz,mt,false,root,segments);parts.push(m);return m;
 };
 // Eyelids, eyebrows, subtle irises, nose highlight, cheeks and warm facial expression.
 for(const side of [-1,1]){
  const eyeY=.047*height;
  headPart('storybook eye sclera',side*.114,eyeY,-.247,.081,.05,.027,shirt,12);
  headPart('storybook eye iris',side*.114,eyeY-.004,-.273,.036,.038,.018,eye,12);
  headPart('tiny eye reflection',side*.114-.012,eyeY+.011,-.291,.014,.014,.009,shirt,8);
  const brow=headPart('expressive wool-soft eyebrow',side*.119,.142,-.228,.118,.025,.036,hairMat,12);
  brow.rotation.z=side*.12;
  headPart('subtle warm cheek',side*.176,-.093,-.186,.11,.052,.022,rosy,10);
  headPart('defined small ear fold',side*.26,.007,-.07,.055,.11,.033,rosy,12);
 }
 headPart('short natural mouth',0,-.156,-.244,.115,.022,.022,lip,12);
 headPart('rounded nose bridge',0,-.031,-.251,.076,.14,.08,skin,12);
 // Flexible robe and vest silhouettes. All are ambient original designs.
 if(id!=='gandalf'){
  for(const side of [-1,1]){
   bodyPart('tailored waistcoat front panel',side*.16,.91*height,-.18,.17,.57*height,.11,waistcoat,12);
   const lapel=bodyPart('linen shirt lapel',side*.14,1.105*height,-.215,.092,.22*height,.062,shirt,10);
   lapel.rotation.z=side*.2;
   bodyPart('waistcoat shoulder seam',side*.26,1.1*height,0,.10,.10,.27,waistcoat,10);
  }
  bodyPart('belts under waistcoat',0,.64*height,-.07,.54,.11,.41,trousers,12);
  bodyPart('leather belt clasp',0,.64*height,-.279,.10,.09,.035,brass,8);
  for(const side of [-1,1]){
   headPart('hairline sideburn',side*.225,-.01,-.035,.08,.22,.105,hairMat,10);
  }
  headPart('swept hair volume',0,.268,.07,.44,.14,.39,hairMat,12);
  if(id==='bilbo')for(const side of [-1,1])headPart('aged temple grey curls',side*.244,.025,-.065,.12,.24,.11,bilboHair,12);
 }else{
  for(const side of [-1,1]){
   bodyPart('wizard weathered robe panel',side*.21,.85*height,-.20,.13,.8*height,.12,hatmat,12);
   headPart('loose wizard silver temple strands',side*.23,-.12,.035,.16,.43,.17,beard,12);
   headPart('weathered beard wisps',side*.125,-.38,-.205,.14,.42,.13,beard,12);
  }
  headPart('tapered wizard beard tuft',0,-.49,-.235,.20,.31,.125,beard,12);
 }
 return {detailTag:'storybook-anatomy-v1',faceDetails:10,clothing:!id.startsWith('farmer-')};
}
