// Original small fibre tiles on the existing weighted beard surface; no new actor meshes.
export function dressWizardBeard(B,scene,meshes){
 if(typeof document==='undefined')return;
 for(const mesh of meshes){if(!mesh.material?.name.includes('silver beard fibres'))continue;
  const material=mesh.material.clone('Gandalf silver strand material'),position=mesh.getVerticesData(B.VertexBuffer.PositionKind),uv=[];
  let low=Infinity,high=-Infinity;for(let i=1;i<position.length;i+=3){low=Math.min(low,position[i]);high=Math.max(high,position[i]);}
  for(let i=0;i<position.length;i+=3){const t=(high-position[i+1])/(high-low),width=.067*Math.pow(Math.max(0,1-t),.55)+.004;uv.push(.5+position[i]/(2*width),t);}
  mesh.setVerticesData(B.VertexBuffer.UVKind,uv);
  const colour=new B.DynamicTexture('original silver beard strands',{width:256,height:256},scene,true,B.Texture.TRILINEAR_SAMPLINGMODE),normal=new B.DynamicTexture('original beard fibre normals',{width:256,height:256},scene,true,B.Texture.TRILINEAR_SAMPLINGMODE);
  const ctx=colour.getContext(),nctx=normal.getContext(),image=ctx.createImageData(256,256),norm=nctx.createImageData(256,256);
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
   const t=y/255,phase=x*.57+2.4*Math.sin(t*7+x*.04),wave=Math.sin(phase),fine=Math.sin(x*1.7+t*19),shade=184+wave*18+fine*5-t*9,i=(y*256+x)*4;
   image.data[i]=shade;image.data[i+1]=shade+4;image.data[i+2]=shade-3;image.data[i+3]=255;
   const nx=Math.cos(phase)*.28,ny=Math.sin(t*7)*.035;
   norm.data[i]=Math.round(127.5*(1+nx));norm.data[i+1]=Math.round(127.5*(1+ny));norm.data[i+2]=Math.round(127.5*(1+Math.sqrt(1-nx*nx-ny*ny)));norm.data[i+3]=255;
  }
  ctx.putImageData(image,0,0);nctx.putImageData(norm,0,0);colour.update(false);normal.update(false);normal.level=.45;normal.gammaSpace=false;
  material.albedoColor=B.Color3.White();material.albedoTexture=colour;material.bumpTexture=normal;material.roughness=.96;mesh.material=material;
 }
}
