#!/usr/bin/env python3
"""Provenance and geometry gate for Blender-created replacement bridge."""
import hashlib,json,struct
from pathlib import Path
root=Path(__file__).resolve().parents[1]/"assets/models"
p=root/"shire_stone_bridge_hero.glb"
m=root/"shire_stone_bridge_hero.source.json"
assert p.is_file() and m.is_file(),"Missing real stone bridge output"
raw=p.read_bytes()
assert raw[:4]==b"glTF" and struct.unpack_from("<I",raw,8)[0]==len(raw)
length=struct.unpack_from("<I",raw,12)[0]
gltf=json.loads(raw[20:20+length].decode("utf-8"))
receipt=json.loads(m.read_text(encoding="utf-8"))
assert receipt["sha256"]==hashlib.sha256(raw).hexdigest()
assert receipt["license"]=="ORIGINAL-GAME" and receipt["authored_individual_stones"]>=270
assert len(gltf.get("meshes",[]))>=4 and len(gltf.get("materials",[]))>=4
assert len(raw)>25000,"Missing modeled stone surfaces"
assert gltf.get("images"),"Bridge materials require editable albedo textures"
print("PASS: hero stone bridge verified",receipt["authored_individual_stones"],"stones",len(gltf["meshes"]),"meshes")
