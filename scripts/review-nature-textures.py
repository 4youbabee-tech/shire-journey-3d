from pathlib import Path
from PIL import Image
import json
p=Path('/tmp/shire-nature-source')
for f in [p/(n+'.gltf') for n in ['MapleTree_1','MapleTree_3','Grass_Small','Flower_2_Clump']]:
 d=json.loads(f.read_text())
 for m in d['materials']:
  m.pop('normalTexture',None)
  m.setdefault('pbrMetallicRoughness',{})['roughnessFactor']=.95
  if m.get('alphaMode')=='BLEND':m['alphaMode']='MASK';m['alphaCutoff']=.45
 for im in d.get('images',[]):
  if 'Normal' in im['uri']:im['uri']='MapleTree_Bark.jpg';im['mimeType']='image/jpeg'
 f.with_name(f.stem+'-reviewed.gltf').write_text(json.dumps(d))
for name,size in [('MapleTree_Bark.jpg',512),('MapleTree_Leaves.png',512),('Grass.png',256),('Flowers.png',256)]:
 im=Image.open(p/name);im.thumbnail((size,size));im.save(p/name,optimize=True)

# Summer derivative of the source autumn leaf texture; preserve alpha and painted luminance.
import colorsys
f=p/'MapleTree_Leaves.png';im=Image.open(f).convert('RGBA');pixels=[]
for r,g,b,a in im.getdata():
 h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);r,g,b=colorsys.hsv_to_rgb(.24+.03*h,s*.72,min(1,v*1.12));pixels.append((int(r*255),int(g*255),int(b*255),a))
im.putdata(pixels);im.save(f,optimize=True)
