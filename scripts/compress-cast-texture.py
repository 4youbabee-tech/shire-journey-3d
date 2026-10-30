"""Deterministic mobile texture encoding, preserving alpha when required."""
from PIL import Image
import sys
source,target,size,alpha=sys.argv[1:];im=Image.open(source);im.thumbnail((int(size),int(size)),Image.Resampling.LANCZOS)
if alpha=='1':im.convert('RGBA').save(target,format='PNG',optimize=True)
else:im.convert('RGB').save(target,format='JPEG',quality=90,subsampling=0,optimize=True)
