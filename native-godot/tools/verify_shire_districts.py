#!/usr/bin/env python3
import hashlib,json,struct,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]/"assets/models"
try:
    for name in ("shire_market_craftwork","shire_mill_craftwork","shire_feast_craftwork"):
        glb=(root/(name+".glb")).read_bytes()
        assert len(glb)>12000
        assert struct.unpack_from("<4sII",glb)==(b"glTF",2,len(glb))
        count,tag=struct.unpack_from("<I4s",glb,12)
        assert tag==b"JSON"
        d=json.loads(glb[20:20+count])
        assert len(d.get("meshes",[]))>=6
        assert len(d.get("materials",[]))>=9
        assert len(d.get("images",[]))>=1
        p=json.loads((root/(name+".source.json")).read_text())
        assert p["sha256"]==hashlib.sha256(glb).hexdigest()
        assert p["origin"]=="ORIGINAL-GAME"
        assert p["authored_meshes"]>=45
        assert p["optimized_meshes"]<=18
        print("PASS Blender district",name,"authored",p["authored_meshes"],"merged",p["optimized_meshes"])
except Exception as e:
    print("FAIL Blender district:",e,file=sys.stderr);sys.exit(1)
