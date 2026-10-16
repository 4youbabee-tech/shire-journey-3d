#!/usr/bin/env python3
"""Import selected photoreal Poly Haven CC0 glTFs and their PBR dependencies.

Only public API entries are admitted. Store exact downloaded byte hashes,
resolution and author details. Fail the build instead of silently showing
the former low-poly art on a supposedly upgraded release.
"""
import hashlib
import json
import os
import pathlib
import urllib.parse
import urllib.request
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parents[1] / "assets" / "props" / "polyhaven_realistic_cc0"
ASSETS = ("wooden_table_02", "painted_wooden_table", "wooden_lantern_01", "shrub_03")
RESOLUTION = "1k"
UA = "ShireJourneyCC0PhotorealAssetVendor/1.0 (attribution in source catalog)"
MAX_PART = 24 * 1024 * 1024
MAX_TOTAL = 110 * 1024 * 1024

def json_api(address: str) -> dict[str, Any]:
    req = urllib.request.Request(address, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=50) as response:
        data = response.read(3 * 1024 * 1024)
    return json.loads(data)

def valid_public_url(address: str) -> None:
    u = urllib.parse.urlparse(address)
    host = (u.hostname or "").lower()
    if u.scheme != "https" or not (
        host.endswith(".polyhaven.com") or host == "polyhaven.com"
        or host.endswith(".polyhaven.org") or host == "polyhaven.org"
    ):
        raise ValueError("Download URL outside official Poly Haven asset CDN: " + host)

def verified_download(entry: dict[str, Any], dest: pathlib.Path) -> dict[str, Any]:
    url = str(entry.get("url", ""))
    valid_public_url(url)
    maximum = entry.get("size", MAX_PART)
    if isinstance(maximum, (float, int)) and maximum > MAX_PART:
        raise ValueError("Part exceeds mobile-minded quality budget: " + dest.name)
    if dest.is_file():
        data = dest.read_bytes()
    else:
        request = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(request, timeout=100) as response:
            data = response.read(MAX_PART + 1)
    if not data or len(data) > MAX_PART:
        raise ValueError("File exceeds allowed package limit: " + dest.name)
    if entry.get("size") and int(entry["size"]) != len(data):
        raise ValueError("CDN size changed: " + dest.name)
    if entry.get("md5") and hashlib.md5(data).hexdigest().lower() != str(entry["md5"]).lower():
        raise ValueError("CDN hash mismatch: " + dest.name)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return {"sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data), "source": url}

def safe_relative_path(root: pathlib.Path, name: str) -> pathlib.Path:
    s = name.replace("\\", "/")
    p = pathlib.PurePosixPath(s)
    if p.is_absolute() or not p.parts or any(t in (".", "..") for t in p.parts):
        raise ValueError("Unsafe imported dependency " + name)
    target = root.joinpath(*p.parts)
    if not target.resolve().is_relative_to(root.resolve()):
        raise ValueError("Dependency left destination directory")
    return target

def main() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    manifest = {"license": "CC0-1.0", "provider": "Poly Haven",
                "api": "https://api.polyhaven.com", "resolution": RESOLUTION, "models": {}}
    total = 0
    for asset in ASSETS:
        details = json_api("https://api.polyhaven.com/info/" + asset)
        if str(details.get("type")) != "models":
            raise ValueError("Not a Poly Haven model " + asset)
        tree = json_api("https://api.polyhaven.com/files/" + asset)
        node = tree.get("gltf", {}).get(RESOLUTION, {}).get("gltf")
        if not isinstance(node, dict) or not node.get("url"):
            raise ValueError("No verified 1K glTF for " + asset)
        directory = ROOT / asset
        gltf_name = pathlib.PurePosixPath(urllib.parse.urlparse(node["url"]).path).name
        if not gltf_name.endswith(".gltf"):
            raise ValueError("Expected a glTF source file")
        parts = {gltf_name: node}
        for name, info in node.get("include", {}).items():
            if not isinstance(info, dict):
                raise ValueError("Bad include entry")
            parts[name] = info
        outputs = {}
        for name, info in parts.items():
            target = safe_relative_path(directory, name)
            result = verified_download(info, target)
            outputs[name] = result
            total += result["bytes"]
            if total > MAX_TOTAL:
                raise ValueError("Scene asset memory budget exceeded")
        scene = json.loads((directory / gltf_name).read_text(encoding="utf-8"))
        if scene.get("asset", {}).get("version") != "2.0" or not scene.get("meshes"):
            raise ValueError("Downloaded asset lacks valid glTF 2.0 geometry")
        required = {x.get("uri") for x in scene.get("buffers", []) if x.get("uri")}
        required.update(x.get("uri") for x in scene.get("images", []) if x.get("uri") and not x.get("uri", "").startswith("data:"))
        for item in required:
            if not safe_relative_path(directory, str(item)).is_file():
                raise ValueError("Missing required buffer/texture " + str(item))
        manifest["models"][asset] = {
            "page": "https://polyhaven.com/a/" + asset, "author": details.get("authors", {}),
            "geometry": gltf_name, "files": outputs
        }
        print("VERIFIED PHOTOREAL CC0", asset, "textures", len(outputs) - 1, "mesh groups", len(scene["meshes"]))
    (ROOT / "provenance.json").write_text(json.dumps(manifest, indent=2, default=str) + "\n", encoding="utf-8")
    print("READY: photoreal PBR models", len(ASSETS), "total bytes", total)

if __name__ == "__main__":
    main()
