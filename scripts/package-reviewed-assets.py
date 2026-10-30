"""Lossless source packaging after reviewed GLB/audio production; not used at runtime."""
from pathlib import Path
import base64,gzip,hashlib,json
root=Path(__file__).resolve().parent.parent
for source,folder,pattern in [('dist/assets/characters','scripts/character-data','*.glb'),('dist/assets/audio','scripts/audio-data','*.mp3'),('dist/assets/environment','scripts/environment-data','*.glb')]:
 target=root/folder;target.mkdir(parents=True,exist_ok=True);manifest={}
 for p in sorted((root/source).glob(pattern)):
  data=p.read_bytes();encoded=base64.b64encode(gzip.compress(data,mtime=0)).decode();parts=[]
  for i,start in enumerate(range(0,len(encoded),600000)):
   name=f'{p.stem}.{i}.b64';(target/name).write_text(encoded[start:start+600000]+'\n');parts.append(name)
  manifest[p.name]={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'parts':parts}
  if '/environment' in source:manifest[p.name]['kind']='static'
  if p.stem=='horse':manifest[p.name]['requiredAnimations']=['Idle','Walk','Eating']
 (target/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 print(folder,json.dumps({k:v['bytes'] for k,v in manifest.items()}))
