#!/usr/bin/env python3
"""Strict Godot screenshot QA and *deterministic* choice of a real exterior frame.

Do not weaken the historical gate (std>=12, channel range>=45, tile diversity>=14).
The prior capture moved Frodo twice but still photographed camera-collision
occlusion. Capture multiple real Godot spectator-camera frames; select only one
that meets the unchanged visibility requirements. Retain all frames as CI artifacts.
"""
from pathlib import Path
from PIL import Image, ImageStat
import shutil
import sys

ROOT=Path(__file__).resolve().parents[1]/"dist"
SCENES=("in_engine_hobbiton.png","in_engine_bagend.png","in_engine_cottage.png")
MIN_STD=12
MIN_RANGE=45
MIN_TILES=14

def inspect(path: Path) -> dict:
    with Image.open(path) as image:
        image=image.convert("RGB").resize((160,90))
        stat=ImageStat.Stat(image)
        ranges=[max(channel)-min(channel) for channel in image.getextrema()]
        tiles=set()
        for y in range(0,90,10):
            for x in range(0,160,10):
                r,g,b=image.getpixel((x+5,y+5))
                tiles.add((r//24,g//24,b//24))
    return {"std":[round(v,1) for v in stat.stddev],
            "ranges":ranges,"distinct_tiles":len(tiles)}

def visible(m: dict) -> bool:
    return (max(m["std"])>=MIN_STD and
            max(m["ranges"])>=MIN_RANGE and
            m["distinct_tiles"]>=MIN_TILES)

def choose_hobbiton(root: Path) -> Path:
    candidates=sorted(root.glob("in_engine_hobbiton_candidate_*.png"))
    if len(candidates)<4:
        raise ValueError(f"Expected >=4 independent captured Hobbiton angles, got {len(candidates)}")
    accepted=[]
    for path in candidates:
        measures=inspect(path)
        print(f"{path.name}: {measures}",flush=True)
        if visible(measures):
            accepted.append((measures["distinct_tiles"],sum(measures["std"]),path))
    if not accepted:
        raise ValueError("All real Hobbiton camera viewpoints blocked or visually flat; inspect uploaded diagnostic photos")
    _,_,chosen=max(accepted,key=lambda value:(value[0],value[1],value[2].name))
    shutil.copyfile(chosen,root/SCENES[0])
    print("SELECTED REAL GODOT EXTERIOR",chosen.name,flush=True)
    return chosen

def verify(root: Path) -> int:
    try:
        choose_hobbiton(root)
    except (OSError,ValueError) as error:
        print("EXTERIOR CAPTURE FAILED:",error,file=sys.stderr,flush=True)
        return 1
    errors=[]
    for filename in SCENES:
        path=root/filename
        if not path.is_file():
            errors.append(f"{filename}: screenshot missing")
            continue
        measures=inspect(path)
        print(f"{filename}: channel_std={measures['std']}, ranges={measures['ranges']}, distinct_tiles={measures['distinct_tiles']}",flush=True)
        if not visible(measures):
            errors.append(f"{filename}: visually flat, occluded or clipped")
    if errors:
        print("VISUAL SMOKE FAILED: "+"; ".join(errors),file=sys.stderr,flush=True)
        return 1
    print("PASS: three real Godot scenes meet the unchanged visibility gate; human art approval remains pending.")
    return 0

if __name__=="__main__":
    sys.exit(verify(ROOT))
