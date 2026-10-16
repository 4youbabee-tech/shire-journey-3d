#!/usr/bin/env python3
"""Cheap deterministic render sanity gate for captured Godot screens.

Reject nearly blank, extremely flat, or fully clipped 1280x720 frames.
Not a visual quality certificate; prevents previously observed blocked frames.
"""
from pathlib import Path
from PIL import Image, ImageStat
import sys

root=Path(__file__).resolve().parents[1]/"dist"
files=["in_engine_hobbiton.png","in_engine_bagend.png","in_engine_cottage.png"]
failures=[]
for filename in files:
    file=root/filename
    if not file.is_file():
        failures.append(filename+": screenshot missing")
        continue
    image=Image.open(file).convert("RGB").resize((160,90))
    stat=ImageStat.Stat(image)
    ranges=[max(channel)-min(channel) for channel in image.getextrema()]
    varied_tiles=set()
    for y in range(0,90,10):
        for x in range(0,160,10):
            r,g,b=image.getpixel((x+5,y+5))
            varied_tiles.add((r//24,g//24,b//24))
    print(f"{filename}: channel_std={list(round(x,1) for x in stat.stddev)}, ranges={ranges}, distinct_tiles={len(varied_tiles)}")
    if max(stat.stddev)<12 or max(ranges)<45 or len(varied_tiles)<14:
        failures.append(filename+": visually flat, occluded, or clipped frame")
if failures:
    print("VISUAL SMOKE FAILED:", "; ".join(failures),file=sys.stderr)
    sys.exit(1)
print("PASS: three scenes contain plausible rendered variation. Manual art review still required.")
