// Original shared art direction: warm sunlight, cool sky fill and grounded actors.
export function applyVillageLook(B,scene,{sun,hemi,shadow}){
 sun.direction.set(-.65,-1.25,.42);sun.diffuse.set(1,.87,.68);sun.intensity=1.04;
 hemi.diffuse=B.Color3.FromHexString('#d4e7ef');hemi.groundColor=B.Color3.FromHexString('#616f3d');hemi.intensity=.55;
 scene.clearColor=B.Color4.FromHexString('#b9dce9ff');scene.fogColor=B.Color3.FromHexString('#c6d7cf');scene.fogStart=85;scene.fogEnd=185;
 const image=scene.imageProcessingConfiguration;image.contrast=1.025;image.exposure=1.07;image.toneMappingEnabled=true;image.toneMappingType=B.ImageProcessingConfiguration.TONEMAPPING_ACES;
 if(shadow){shadow.normalBias=.025;shadow.bias=.0015;shadow.darkness=.18;}
 const sky=B.MeshBuilder.CreateSphere('gradient pastoral sky',{diameter:310,segments:14,sideOrientation:B.Mesh.BACKSIDE},scene),m=new B.StandardMaterial('pastoral sky light',scene);m.disableLighting=true;m.emissiveColor=B.Color3.White();m.diffuseColor=B.Color3.White();m.backFaceCulling=false;m.disableDepthWrite=true;m.fogEnabled=false;sky.material=m;sky.infiniteDistance=true;sky.isPickable=false;sky.applyFog=false;
 const p=sky.getVerticesData(B.VertexBuffer.PositionKind),colors=[];for(let i=0;i<p.length;i+=3){const t=Math.max(0,Math.min(1,p[i+1]/155)),a=B.Color3.FromHexString('#e4debf'),b=B.Color3.FromHexString('#72b2d0'),c=B.Color3.Lerp(a,b,Math.sqrt(t));colors.push(c.r,c.g,c.b,1);}sky.setVerticesData(B.VertexBuffer.ColorKind,colors);return {sky};
}
export function softenMound(B,mesh,seed=0){
 const p=mesh.getVerticesData(B.VertexBuffer.PositionKind),indices=mesh.getIndices(),n=[];
 for(let i=0;i<p.length;i+=3){const x=p[i],y=p[i+1],z=p[i+2],w=Math.max(0,y+.08),f=1-.035*w*(1+Math.sin(x*13+seed)*Math.cos(z*11-seed));p[i]*=f;p[i+2]*=f;p[i+1]-=.025*w*(1+Math.sin(x*9+z*7+seed));}
 B.VertexData.ComputeNormals(p,indices,n);mesh.setVerticesData(B.VertexBuffer.PositionKind,p);mesh.setVerticesData(B.VertexBuffer.NormalKind,n);mesh.refreshBoundingInfo();
}
export function createContactShadows(B,scene,actors){
 if(typeof document==='undefined')return {dispose(){}};
 const texture=new B.DynamicTexture('original soft contact shadow',{width:64,height:64},scene,false),ctx=texture.getContext(),g=ctx.createRadialGradient(32,32,2,32,32,31);g.addColorStop(0,'rgba(30,24,16,.34)');g.addColorStop(.4,'rgba(30,24,16,.22)');g.addColorStop(1,'rgba(30,24,16,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);texture.hasAlpha=true;texture.update();
 const material=new B.StandardMaterial('shared actor ground contact',scene);material.diffuseTexture=texture;material.useAlphaFromDiffuseTexture=true;material.disableLighting=true;material.emissiveColor=B.Color3.White();material.alpha=.65;material.backFaceCulling=false;material.zOffset=-1;
 const meshes=actors.map(c=>{const m=B.MeshBuilder.CreateGround(c.id+' soft foot contact',{width:c.id==='gandalf'?.9:.64,height:c.id==='gandalf'?.7:.5},scene);m.material=material;m.parent=c.root;m.position.y=.012;m.isPickable=false;return m;});
 return {dispose(){meshes.forEach(m=>m.dispose());material.dispose();texture.dispose();}};
}
