// Compact film-set relationship: Bag End rises above the party meadow.
// This is an authored playable terrain interpretation, not a surveyed film map.
import {HOMES} from './village-layout.mjs';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function hillside(x,z){const r2=((x-11)/15)**2+((z-16)/18)**2;return r2>=1?0:3.2*(1-r2)**2*smooth((Math.hypot(x+2,z-22)-5)/5);}
const terraces=HOMES.map(h=>({...h,height:hillside(h.x,h.z-1.6*h.s)}));
export function terrainHeightAt(x,z){
 let y=hillside(x,z);
 for(const h of terraces){if(!h.height)continue;
  const outside=Math.max(Math.abs(x-h.x)-3.45*h.s,Math.abs(z-(h.z-.2*h.s))-1.65*h.s,0),weight=1-smooth(outside/(1.8*h.s));
  if(weight)y+=(h.height-y)*weight;
 }
 return y;
}
export function shapeTerrain(B,ground){
 const vertices=ground.getVerticesData(B.VertexBuffer.PositionKind),indices=ground.getIndices(),normals=[];
 for(let i=0;i<vertices.length;i+=3)vertices[i+1]=terrainHeightAt(vertices[i],vertices[i+2]);
 B.VertexData.ComputeNormals(vertices,indices,normals);ground.setVerticesData(B.VertexBuffer.PositionKind,vertices);ground.setVerticesData(B.VertexBuffer.NormalKind,normals);ground.refreshBoundingInfo();
}
