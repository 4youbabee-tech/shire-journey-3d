#!/usr/bin/env python3
"""Reproducible original grass/earth tileable PBR 2D material maps."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

DEST = Path(__file__).resolve().parents[1] / 'assets' / 'textures'
DEST.mkdir(parents=True, exist_ok=True)
SIZE = 768
rng = np.random.default_rng(3018)

def noise(sigma):
    img = rng.standard_normal((SIZE, SIZE)).astype(np.float32)
    out = gaussian_filter(img, sigma=sigma, mode='wrap')
    out /= max(1e-6, float(out.std()))
    return out

def mats(kind):
    coarse = noise(68)
    mid = noise(13)
    fine = noise(1.3)
    micro = noise(0.5)
    yy, xx = np.mgrid[:SIZE, :SIZE]
    if kind == 'grass':
        earthy = coarse*.33 + mid*.29 + fine*.13
        low = np.array([72, 85, 46.], np.float32)
        high = np.array([116, 136, 67.], np.float32)
        mix = np.clip(.52+earthy*.33, 0, 1)
        rgb = low[None,None,:]*(1-mix[:,:,None]) + high[None,None,:]*mix[:,:,None]
        # Narrow individual grass-flower specks; no embedded copyrighted texture.
        fleck = np.clip((fine-micro*.3-1.25)*26,0,25)
        rgb[:,:,1] += fleck
        rgb[:,:,0] += fleck*.48
        height = coarse*.16+mid*.31+fine*.19+micro*.07
        rough=.92
    else:
        earthy = coarse*.25 + mid*.18 + fine*.16 + micro*.09
        low=np.array([111,86,57.],np.float32)
        high=np.array([161,133,91.],np.float32)
        mix=np.clip(.48+earthy*.32,0,1)
        rgb=low[None,None,:]*(1-mix[:,:,None])+high[None,None,:]*mix[:,:,None]
        pebbles=np.clip((fine+micro-1.22)*14,0,42)
        rgb+=pebbles[:,:,None]*np.array([.92,.9,.78],np.float32)
        height=coarse*.17+mid*.3+fine*.23+micro*.07
        rough=.87
    albedo=Image.fromarray(np.uint8(np.clip(rgb,0,255)),'RGB')
    dy, dx=np.gradient(height)
    tangent=np.stack([-dx*.85,-dy*.85,np.ones_like(dx)*.95],axis=2)
    tangent/=np.linalg.norm(tangent,axis=2,keepdims=True)
    normal=Image.fromarray(np.uint8(np.clip(tangent*.5+.5,0,1)*255),'RGB')
    albedo.save(DEST/(kind+'_albedo.png'),optimize=True)
    normal.save(DEST/(kind+'_normal.png'),optimize=True)
    print(kind, 'roughness',rough)

for item in ['grass','path']:
    mats(item)
print('Original files in',DEST)