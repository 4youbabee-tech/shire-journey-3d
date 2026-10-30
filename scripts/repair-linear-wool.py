"""One-time, fail-closed repair of the reviewed legacy GLBs' linear wool texels.
Geometry, skin, animation and non-wool image bytes are preserved exactly.
New Blender exports already encode the authored wool to sRGB; do not re-repair.
"""
from pathlib import Path
from PIL import Image,ImageStat
import struct,json,hashlib,io,sys
SOURCE_HASHES={'dc6824a25ebf15f2bc88a0acec8b24fe17ce62eb1604a8dfb5f9a92c47fd694f','f6433c092c1e50b8b73bfac813741cdadb4701a3a53b441fad4f0ed8cd511fcf','cce9c2f83e78bf60411de3a97016ac697deaca0bf746cb86607d414ad60170c5','8a47f98256f795a95cbfe5d600221dd13864d3ea399b3218209fe817a2386865'}
def encode(v):
 return 12.92*v if v<=.0031308 else 1.055*v**(1/2.4)-.055
source=Path(sys.argv[1]);target=Path(sys.argv[2]);raw=source.read_bytes();digest=hashlib.sha256(raw).hexdigest()
if digest not in SOURCE_HASHES:raise ValueError('Unreviewed input or already repaired; do not apply the transfer twice')
magic,version,length=struct.unpack_from('<III',raw);assert magic==0x46546c67 and version==2 and length==len(raw)
n=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+n]);binary=raw[28+n:];assert len(doc['buffers'])==1
replacements={};changes=[];lut=[round(255*encode(i/255)) for i in range(256)]
for image in doc['images']:
 if 'woven albedo' not in image.get('name',''):continue
 index=image['bufferView'];view=doc['bufferViews'][index];payload=binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']];im=Image.open(io.BytesIO(payload)).convert('RGB');corrected=im.point(lut*3);out=io.BytesIO();corrected.save(out,format='JPEG',quality=90,subsampling=0,optimize=True);replacements[index]=out.getvalue();image['mimeType']='image/jpeg';changes.append({'image':image['name'],'beforeMean':ImageStat.Stat(im).mean,'afterMean':ImageStat.Stat(corrected).mean})
assert replacements
repacked=bytearray()
for index,view in enumerate(doc['bufferViews']):
 assert view.get('buffer',0)==0 and not view.get('extensions')
 original=binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']];payload=replacements.get(index,original)
 repacked.extend(b'\0'*(-len(repacked)%4));view['byteOffset']=len(repacked);view['byteLength']=len(payload);repacked.extend(payload)
 if index not in replacements:assert repacked[view['byteOffset']:view['byteOffset']+view['byteLength']]==original
repacked.extend(b'\0'*(-len(repacked)%4));doc['buffers'][0]['byteLength']=len(repacked);doc['asset'].setdefault('extras',{})['shireWoolEncoding']='sRGB; repaired from reviewed linear-authored tiles'
text=json.dumps(doc,separators=(',',':'),allow_nan=False).encode();text+=b' '*(-len(text)%4);result=struct.pack('<III',magic,version,12+8+len(text)+8+len(repacked))+struct.pack('<II',len(text),0x4e4f534a)+text+struct.pack('<II',len(repacked),0x004e4942)+repacked
target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(result);print(json.dumps({'inputSha256':digest,'sha256':hashlib.sha256(result).hexdigest(),'bytes':len(result),'correctedImages':changes}))
