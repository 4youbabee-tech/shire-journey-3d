#!/usr/bin/env python3
"""Provenance-checked 1K Poly Haven CC0 interior PBR material fetch.

Fetch two physically plausible surface sets; verify upstream MD5+size,
emit SHA256 receipt and use Godot-native JPGs (without external image tools).
"""
import hashlib
import json
import pathlib
import urllib.request
from urllib.parse import urlparse

SOURCES = {"wood_floor_worn":"floor", "painted_plaster_wall":"plaster"}
ROOT = pathlib.Path(__file__).resolve().parents[1] / "assets" / "surfaces" / "polyhaven_cc0"
UA = "ShireJourneyPhotorealSurfaceVendor/1.0"
MAX_BYTES = 7 * 1024 * 1024

def load_json(url):
    req = urllib.request.Request(url,headers={"User-Agent":UA})
    with urllib.request.urlopen(req,timeout=60) as response:
        return json.load(response)

def read_map(files, aliases):
    for wanted in aliases:
        for key in files:
            if key.lower() != wanted.lower():
                continue
            node = files[key]
            variants = node.get("1k",{})
            if isinstance(variants,dict) and "jpg" in variants:
                info = variants["jpg"]
                if isinstance(info,dict) and info.get("url"):
                    return info
    raise ValueError("No 1K jpg map matching: "+str(aliases))

def fetch(info,destination):
    url = str(info["url"])
    u = urlparse(url)
    host = u.hostname or ""
    if u.scheme!="https" or not (host=="polyhaven.org" or host.endswith(".polyhaven.org") or host=="polyhaven.com" or host.endswith(".polyhaven.com")):
        raise ValueError("Non Poly Haven CDN URL")
    size = int(info.get("size",MAX_BYTES))
    if size>MAX_BYTES:
        raise ValueError("Surface exceeds texture budget")
    if destination.is_file():
        data=destination.read_bytes()
    else:
        req=urllib.request.Request(url,headers={"User-Agent":UA})
        with urllib.request.urlopen(req,timeout=75) as response:
            data=response.read(MAX_BYTES+1)
    if len(data)>MAX_BYTES or (info.get("size") and len(data)!=size):
        raise ValueError("Surface download truncated or too large")
    if data[:2]!=bytes.fromhex("ffd8"):
        raise ValueError("Expected JPEG PBR source")
    if info.get("md5") and hashlib.md5(data).hexdigest().lower()!=str(info["md5"]).lower():
        raise ValueError("Upstream checksum mismatch")
    destination.parent.mkdir(parents=True,exist_ok=True)
    destination.write_bytes(data)
    return {"sha256":hashlib.sha256(data).hexdigest(),"bytes":len(data),"url":url}

def main():
    receipt={"author":"Poly Haven contributors","license":"CC0-1.0","resolution":"1k","materials":{}}
    for slug,category in SOURCES.items():
        meta=load_json("https://api.polyhaven.com/info/"+slug)
        if int(meta.get("type",-1))!=1:
            raise ValueError("Not a CC0 Poly Haven texture: "+slug)
        variants=load_json("https://api.polyhaven.com/files/"+slug)
        folder=ROOT/category
        textures={}
        for filename,keys in [
            ("albedo.jpg",["Diffuse","diffuse","diff"]),
            ("normal_gl.jpg",["nor_gl","normal_gl"]),
        ]:
            textures[filename]=fetch(read_map(variants,keys),folder/filename)
        receipt["materials"][category]={"asset":slug,"page":"https://polyhaven.com/a/"+slug,
            "authors":meta.get("authors",{}),"textures":textures}
        print("PBR SURFACE VERIFIED",slug,category)
    ROOT.mkdir(parents=True,exist_ok=True)
    (ROOT/"provenance.json").write_text(json.dumps(receipt,indent=2)+"\n",encoding="utf8")
    print("READY:",len(receipt["materials"]),"PBR surfaces")

if __name__=="__main__":
    main()
