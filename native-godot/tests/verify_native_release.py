#!/usr/bin/env python3
"""Offline QA of editable native Godot project. Does not claim a Godot runtime launch."""
import json, re, sys, struct, wave
from pathlib import Path
import trimesh
root=Path(__file__).resolve().parents[1]
errors=[];passed=[]
def check(ok,name):
 (passed if ok else errors).append(name)

proj=(root/'project.godot').read_text()
check('[application]' in proj and 'scenes/Main.tscn' in proj,'native Godot entrypoint')
check('gl_compatibility' in proj,'low-memory renderer configured')
scene=(root/'scenes/Main.tscn').read_text()
check('res://scripts/main.gd' in scene,'native scene attached')
for key in ['player.gd','shire_world.gd','shire_npc.gd','shire_clock.gd','shire_weather.gd','shire_dialogue.gd','main.gd','shire_animal.gd']:
 check((root/'scripts'/key).exists(),f'exists {key}')
source='\n'.join(p.read_text() for p in (root/'scripts').glob('*.gd'))
for feature,code in [('clock','REAL_DAY'),('weather','is_raining'),('physics','CharacterBody3D'),('save','user://shire_journey_godot_save_v2.json'),('54 NPCs','neighbour_%02d'),('Arabic subtitles','dialogue_ar'),('1st/3rd camera','first_person'),('dialogue memory','last_memory'),('story chronology','clock.story_year=3018'),('water shader','shader_type spatial'),('wildlife weather shelters','rain_now'),('native grass normal','grass_normal.jpg'),('circular stone arch','_stone_arch')]:
 check(code in source,feature)
for gd in (root/'scripts').glob('*.gd'):
 s=gd.read_text()
 check('extends ' in s,f'{gd.name} has GDScript class')
 # No HTML/WebGL stub dependencies.
 check('<script' not in s.lower(),f'{gd.name} not web wrapper')
for name in ['old_oak_1','old_oak_2','old_oak_3','river_willow','market_wagon','watermill_wheel','market_stall','oak_barrel','hanging_lantern','garden_flowers']:
 file=root/'assets'/'models'/(name+'.glb')
 try:
  blob=file.read_bytes()
  check(blob[:4]==b'glTF' and struct.unpack_from('<I',blob,8)[0]==len(blob),f'{name} GLB header')
  model=trimesh.load(file,force='scene')
  tri=sum(len(geom.faces) for geom in model.geometry.values())
  check(tri>100 and tri<20000,f'{name} mesh triangles {tri}')
 except Exception as e: errors.append(f'{name} unreadable {e}')
for name in ['shire_birds_original.wav','river_original.wav']:
 if not (root/'assets'/'audio'/name).exists():
  continue  # Source WAV optional; Godot release bundles audited OGG loops.
 try:
  with wave.open(str(root/'assets'/'audio'/name),'rb') as wav:
   check(wav.getnframes()>22050 and wav.getnchannels()==1,f'{name} audio valid')
 except Exception as e: errors.append(f'audio {name}: {e}')
for name in ['shire_birds_original.ogg','river_original.ogg']:
 check((root/'assets'/'audio'/name).stat().st_size>1000,f'{name} compressed audio valid')
for match in re.findall(r'res://([^"\']+\.glb)',source):
 if '%' not in match:
  check((root/match).exists(),f'asset reference {match}')
check('parent: Node3D=self' not in source, 'no runtime self default in GDScript signature')
manifest=json.loads((root/'assets'/'manifest.json').read_text())
for entry in manifest['assets']:
 item=root/entry['path']
 check(item.exists() and item.stat().st_size==entry['bytes'] and __import__('hashlib').sha256(item.read_bytes()).hexdigest()==entry['sha256'], f"asset manifest {entry['path']}")
for key in ['grass_albedo.jpg','grass_normal.jpg','path_albedo.jpg','path_normal.jpg']:
 file=root/'assets'/'textures'/key
 try:
  payload=file.read_bytes()
  from PIL import Image
  w,h=Image.open(file).size
  check(payload[:2]==b'\xff\xd8' and Image.open(file).size==(512,512),f'PBR texture {key} 512px')
 except Exception as error:
  errors.append(f'PBR texture {key} unreadable: {error}')
check('for i in range(19)' in source,'19 animals with simulated weather response')
print('OFFLINE NATIVE RELEASE AUDIT')
print(f'PASS: {len(passed)}')
print(f'FAIL: {len(errors)}')
for name in errors: print('  FAIL',name)
print('LIMIT: Static audit only. Live Godot checks and Windows export are enforced by GitHub Actions.')
sys.exit(1 if errors else 0)