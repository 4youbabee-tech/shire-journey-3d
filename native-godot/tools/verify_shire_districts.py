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
        # Blender intentionally merges details by material to minimize draw calls.
        # Mill carpentry uses fewer material groups than a produce market.
        expected_groups={"shire_market_craftwork":5,"shire_mill_craftwork":3,"shire_feast_craftwork":6}[name]
        minimum_materials={"shire_market_craftwork":5,"shire_mill_craftwork":3,"shire_feast_craftwork":6}[name]
        assert len(d.get("meshes",[]))>=expected_groups, (name,"mesh groups",len(d.get("meshes",[])))
        assert len(d.get("materials",[]))>=minimum_materials, (name,"PBR materials",len(d.get("materials",[])))
        assert len(d.get("images",[]))>=1
        p=json.loads((root/(name+".source.json")).read_text())
        assert p["sha256"]==hashlib.sha256(glb).hexdigest()
        assert p["origin"]=="ORIGINAL-GAME"
        assert p["authored_meshes"]>=45
        assert p["optimized_meshes"]<=18
        print("PASS Blender district",name,"authored",p["authored_meshes"],"merged",p["optimized_meshes"])
except Exception as e:
    print("FAIL Blender district:",repr(e),file=sys.stderr)
    sys.exit(1)

# Require actual nine-house Blender exports before accepting market/district art.
import runpy
runpy.run_path(str(Path(__file__).resolve().parent/"verify_shire_facades.py"),run_name="__main__")
