#!/usr/bin/env python3
"""Download and independently verify CC0 animated KayKit GLB characters.
Source revision is immutable; a different Git blob must fail the build.
"""
import hashlib, json, struct, urllib.request
from pathlib import Path
rev="672074b73ba276876a19e8816ecdc5241817ab47"
root="https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/"
prefix="addons/kaykit_character_pack_adventures/Characters/gltf/"
models={"Rogue":("c8827661105eef7b2bfbef3bc676d41a47625733",3616284),
"Rogue_Hooded":("5d2b1403240d5f9ffff12e02c007572038eca2a8",3597652),
"Mage":("c89f19f6e707f6e07e4632a08876bd6d0172b082",3589240)}
out=Path(__file__).resolve().parents[1]/"assets/characters/cc0_kaykit"
out.mkdir(parents=True,exist_ok=True)
records={}
for name,(gitsha,size) in models.items():
    url=root+rev+"/"+prefix+name+".glb"
    file=out/(name+".glb")
    if file.exists():
        blob=file.read_bytes()
    else:
        with urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":"ShireJourney/1.0"}),timeout=100) as response:
            blob=response.read(size+1)
    sha=hashlib.sha1(b"blob "+str(len(blob)).encode()+b"\0"+blob).hexdigest()
    if sha!=gitsha or len(blob)!=size or blob[:4]!=b"glTF" or struct.unpack_from("<II",blob,4)!=(2,len(blob)):
        raise RuntimeError("GLB verification failed: "+name)
    json_size,json_type=struct.unpack_from("<I4s",blob,12)
    if json_type!=b"JSON":
        raise RuntimeError("Missing glTF JSON: "+name)
    data=json.loads(blob[20:20+json_size])
    if not data.get("skins") or not data.get("animations"):
        raise RuntimeError("Rig/animation missing in "+name)
    file.write_bytes(blob)
    records[name]={"license":"CC0-1.0","source":url,"git_sha1":sha,"sha256":hashlib.sha256(blob).hexdigest(),"skin_count":len(data["skins"]),"animation_count":len(data["animations"])}
    print("VERIFIED RIGGED CC0",name,records[name]["animation_count"],"animations")
(out/"provenance.json").write_text(json.dumps(records,indent=2)+"\n")
