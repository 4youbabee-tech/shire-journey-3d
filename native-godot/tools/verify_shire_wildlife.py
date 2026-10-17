#!/usr/bin/env python3
"""Fail the release if original animated Shire fauna lacks geometry or animation."""
import json,struct,hashlib,sys
from pathlib import Path
r=Path(__file__).resolve().parents[1]/"assets/models"
for animal in ("shire_hen_animated","shire_rabbit_animated"):
    try:
        payload=(r/(animal+".glb")).read_bytes()
        assert struct.unpack_from("<4sII",payload)==(b"glTF",2,len(payload))
        chunk,tag=struct.unpack_from("<I4s",payload,12)
        assert tag==b"JSON"
        doc=json.loads(payload[20:20+chunk])
        assert len(doc.get("materials",[]))>=5
        assert len(doc.get("meshes",[]))>=5
        assert len(doc.get("animations",[]))>=1, "No Blender-exported animation"
        assert len(doc["animations"][0].get("channels",[]))>=1
        meta=json.loads((r/(animal+".source.json")).read_text())
        assert meta["sha256"]==hashlib.sha256(payload).hexdigest()
        assert meta["origin"]=="ORIGINAL-GAME"
        assert meta["optimized_scene_meshes"]<=20
        print("PASS",animal,"GLB",meta["bytes"],"animations",len(doc["animations"]))
    except Exception as ex:
        print("FAIL",animal,repr(ex),file=sys.stderr)
        sys.exit(1)
