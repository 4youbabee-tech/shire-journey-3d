#!/usr/bin/env python3
"""Reproducibly vendor an audited subset of KayKit Furniture Bits (CC0-1.0).

Upstream source revision and each Git blob are pinned. Download ONLY upstream
public immutable raw files. No credentials, no scraping, no paid-model usage.
"""
import hashlib
import json
import urllib.request
from pathlib import Path

REVISION = "96d5930a8dbdb363409bbc2d3341718b00e17c9c"
SOURCE = "https://github.com/KayKit-Game-Assets/KayKit-Furniture-Bits-1.0"
UPSTREAM = "https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Furniture-Bits-1.0/"
PREFIX = "addons/kaykit_furniture_bits/Assets/gltf/"
ROOT = Path(__file__).resolve().parents[1] / "assets" / "props" / "kaykit_furniture_cc0"
# Exact Git blob SHA1 from upstream immutable revision; each extension is separately verified.
BLOBS = {
    "furniturebits_texture.png": ("2ede163e2773ee5cbb1d0cf0d824b427093c2454", 15605),
    "bed_single_A.gltf": ("4f7db3128a0d5da65133dc3707fc7c8738cb41cb", 3009),
    "bed_single_A.bin": ("018d6112b64aecc903cb401f5ffafbe32eacb848", 22044),
    "book_set.gltf": ("e08bf02872d2a768d297f37e89dd499ffc4c7bf9", 3051),
    "book_set.bin": ("6721532c0040bc79567dfc43956534ec78dd671f", 11576),
    "cabinet_small_decorated.gltf": ("a04fa5d18045b69e3e6f89766ad8461828151e45", 3068),
    "cabinet_small_decorated.bin": ("be853e390b75414118b70311ba48f6ecaa29238f", 27552),
    "chair_A_wood.gltf": ("a90c48ea69ce5a126912e3cd65d9bb4af5ec1e58", 3032),
    "chair_A_wood.bin": ("a8e3094d206342cd9c68cbebc896e8277cdbfbd8", 16504),
    "chair_stool_wood.gltf": ("210a7c99a2942db520e3dc618526c6685698442e", 3052),
    "chair_stool_wood.bin": ("3416d75805b30f2aa5f4da1b1217d500e0e86cf4", 10832),
    "lamp_table.gltf": ("704f7442932f3b2e2ea726214d2277c4716d07d0", 3029),
    "lamp_table.bin": ("34bf0d250b4451fd0983bffdb5a8146a50843564", 12816),
    "shelf_B_large_decorated.gltf": ("14b50e51c021286e77705649e081f1060d4ef8e5", 3069),
    "shelf_B_large_decorated.bin": ("4200618dfbcee727002857393e4dfbcd9bd54611", 25772),
    "table_medium.gltf": ("1010ced1225495d02d02a3cc3ee40ec80e05a0b3", 2973),
    "table_medium.bin": ("36b1651fe09576955a2036f40ea2c01cb8aab599", 9328),
    "table_small.gltf": ("d2b443d44029c55e7c5d74158ed6f0d9bc17550e", 2979),
    "table_small.bin": ("3dd2fb821546491b78f7d6c9998941796de88286", 9328),
}

def verified_file(name, sha, expected_size):
    target = ROOT / name
    if target.is_file():
        payload = target.read_bytes()
    else:
        uri = UPSTREAM + REVISION + "/" + PREFIX + name
        req = urllib.request.Request(uri, headers={"User-Agent": "ShireJourneyCC0AssetVendor/1.0"})
        with urllib.request.urlopen(req, timeout=90) as response:
            payload = response.read(expected_size + 1)
    checksum = hashlib.sha1(b"blob " + str(len(payload)).encode() + b"\0" + payload).hexdigest()
    if checksum != sha or len(payload) != expected_size:
        raise ValueError(f"Asset integrity mismatch: {name}")
    if name.endswith(".gltf"):
        document = json.loads(payload)
        if document.get("asset", {}).get("version") != "2.0" or not document.get("meshes"):
            raise ValueError(f"Not a valid game-ready glTF: {name}")
        buffers = document.get("buffers", [])
        images = document.get("images", [])
        if len(buffers) != 1 or buffers[0].get("uri") != name.removesuffix(".gltf") + ".bin":
            raise ValueError(f"Unexpected glTF buffer dependency: {name}")
        if any(img.get("uri") != "furniturebits_texture.png" for img in images):
            raise ValueError(f"Unexpected glTF texture dependency: {name}")
    elif name.endswith(".png") and payload[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"Texture is not PNG: {name}")
    target.write_bytes(payload)
    return {"sha256": hashlib.sha256(payload).hexdigest(), "git_blob_sha1": checksum, "bytes": len(payload)}

def main():
    ROOT.mkdir(parents=True, exist_ok=True)
    files = {}
    for name, (sha, size) in BLOBS.items():
        files[name] = verified_file(name, sha, size)
        print("CC0 FURNITURE VERIFIED", name, size)
    manifest = {"license": "CC0-1.0", "author": "Kay Lousberg / KayKit",
                "source": SOURCE, "source_revision": REVISION,
                "integrity": "git blob sha1 and sha256", "files": files}
    (ROOT / "provenance.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print("READY: %s furniture files" % len(files))

if __name__ == "__main__":
    main()
