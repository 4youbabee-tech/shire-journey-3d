#!/usr/bin/env python3
"""Validate actual Blender-exported nine Shire house facades and SHA provenance."""
import hashlib,json,struct,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]/"assets/models"
ids=["bagshot_cottage","garden_cottage","hill_cottage","northern_cottage",
     "market_cottage","west_row_cottage","west_grove_cottage",
     "longacre_cottage","east_orchard_cottage"]
motifs=set()
for key in ids:
    try:
        glb=root/("shire_"+key+"_craftwork.glb")
        data=glb.read_bytes()
        assert len(data)>12000,"GLB missing/too small"
        assert struct.unpack_from("<4sII",data,0)==(b"glTF",2,len(data)),"Invalid GLB header"
        chunk,tag=struct.unpack_from("<I4s",data,12)
        assert tag==b"JSON","Missing glTF JSON"
        doc=json.loads(data[20:20+chunk])
        assert len(doc.get("meshes",[]))>=8,"No PBR batched facade meshes"
        assert len(doc.get("materials",[]))>=8,"Insufficient facade PBR variants"
        assert len(doc.get("images",[]))>=1,"Original wood texture missing"
        assert len(doc.get("accessors",[]))>=16,"Missing actual authored vertices"
        meta=json.loads((root/("shire_"+key+"_craftwork.source.json")).read_text())
        assert meta["sha256"]==hashlib.sha256(data).hexdigest(),"SHA mismatch"
        assert meta["bytes"]==len(data)
        assert meta["house_id"]==key
        assert meta["authored_parts"]>=100,"Custom craftwork too sparse"
        assert 8<=meta["batched_meshes"]<=14,"Material batching regression"
        assert meta["provenance"]=="ORIGINAL-GAME"
        assert meta["motif"] not in motifs,"Duplicated homestead profession"
        motifs.add(meta["motif"])
        print("PASS Blender facade",key,meta["authored_parts"],"pieces")
    except Exception as exc:
        print("FAIL Blender facade",key,repr(exc),file=sys.stderr)
        sys.exit(1)
assert len(motifs)==9
print("PASS nine textured original facades, verified hashes and professional identities")
