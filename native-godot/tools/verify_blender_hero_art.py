import json,struct,hashlib,sys
from pathlib import Path
try:
    root=Path(__file__).resolve().parents[1]/"assets/models"
    p=root/"bag_end_crafted_portal.glb";raw=p.read_bytes()
    assert len(raw)>16000
    assert struct.unpack_from("<4sII",raw)==(b"glTF",2,len(raw))
    size,typ=struct.unpack_from("<I4s",raw,12);assert typ==b"JSON"
    doc=json.loads(raw[20:20+size])
    assert len(doc.get("meshes",[]))>=7
    assert len(doc.get("materials",[]))>=8
    assert len(doc.get("images",[]))>=1
    meta=json.loads((root/"bag_end_crafted_portal.source.json").read_text())
    assert meta["sha256"]==hashlib.sha256(raw).hexdigest()
    assert meta["origin"]=="ORIGINAL-GAME"
    print("PASS: Blender GLB geometry, PBR and source SHA256")
except Exception as exc:
    print("FAIL: Blender art",exc,file=sys.stderr);sys.exit(1)
