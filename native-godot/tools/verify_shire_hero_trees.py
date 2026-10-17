#!/usr/bin/env python3
"""Fail when hero tree GLBs are absent, primitive placeholders or unlicensed."""
import hashlib
import json
import struct
from pathlib import Path

models = Path(__file__).resolve().parents[1] / "assets" / "models"
for species in ("oak","beech","alder","willow"):
    file = models / ("shire_hero_"+species+".glb")
    receipt = models / ("shire_hero_"+species+".source.json")
    if not file.is_file() or not receipt.is_file():
        raise SystemExit("Missing real Blender woodland asset for "+species)
    raw=file.read_bytes()
    if raw[:4]!=b"glTF" or struct.unpack_from("<I",raw,8)[0]!=len(raw):
        raise SystemExit("Malformed GLB "+species)
    gltf_chunk_size=struct.unpack_from("<I",raw,12)[0]
    gltf=json.loads(raw[20:20+gltf_chunk_size].decode("utf-8"))
    meshes=gltf.get("meshes",[])
    if len(meshes)!=1 or len(meshes[0].get("primitives",[]))<4:
        raise SystemExit("Expected textured trunk and multiple leaf material surfaces "+species)
    polygons=sum((gltf["accessors"][part["indices"]]["count"]//3
                  for part in meshes[0]["primitives"]))
    receipt_data=json.loads(receipt.read_text(encoding="utf-8"))
    if (polygons<1100 or len(raw)<16000 or
            receipt_data.get("sha256")!=hashlib.sha256(raw).hexdigest() or
            receipt_data.get("license")!="ORIGINAL-GAME; authored for this project" or
            receipt_data.get("leaf_cards",0)<380):
        raise SystemExit("Incomplete botanical asset, geometry, or provenance: "+species)
    print("PASS: edited botanical",species,polygons,"triangles",len(raw),"bytes")
print("PASS: 4 modeled and editable Shire hero trees")
