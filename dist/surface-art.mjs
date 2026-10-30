// Authored, deterministic 128px detail tiles shared per surface and scene.
const caches=new WeakMap();
export function surfaceTexture(B,scene,kind){
 if(typeof document==='undefined')return null;
 let cache=caches.get(scene);if(!cache)caches.set(scene,cache=new Map());if(cache.has(kind))return cache.get(kind);
 const texture=new B.DynamicTexture('Shire '+kind+' grain',{width:128,height:128},scene,false),ctx=texture.getContext(),image=ctx.createImageData(128,128);let seed=kind==='wood'?653:kind==='linen'?891:157;
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/4294967296-.5;
  let value=kind==='wood'?211+Math.sin(x*.48+Math.sin(y*.08)*1.3)*12+noise*11:kind==='linen'?229+((x+y)%2?8:-8)+noise*7:kind==='meadow'?222+noise*26+Math.sin(x*.15)*Math.cos(y*.2)*8:231+noise*14;
  if(kind==='wood'&&(x%32===0||x%32===1))value-=28;
  const i=(y*128+x)*4;image.data[i]=value;image.data[i+1]=value;image.data[i+2]=value;image.data[i+3]=255;
 }
 ctx.putImageData(image,0,0);texture.update(false);texture.wrapU=texture.wrapV=B.Texture.WRAP_ADDRESSMODE;texture.anisotropicFilteringLevel=4;cache.set(kind,texture);return texture;
}
export function dressMaterials(B,scene,materials){
 for(const m of materials){const n=m.name.toLowerCase(),kind=/oak|timber|wood|bark|book/.test(n)?'wood':/cloth|linen|robe|rug|waistcoat/.test(n)?'linen':/meadow/.test(n)?'meadow':/plaster|gravel|stone|floor/.test(n)?'plaster':null;if(!kind)continue;const t=surfaceTexture(B,scene,kind);if(!t)continue;if(kind==='meadow'){t.uScale=45;t.vScale=45;}m.diffuseTexture=t;}
}
