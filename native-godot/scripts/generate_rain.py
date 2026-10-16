#!/usr/bin/env python3
"""Generate original seamless light rain loop, no recorded or copyrighted samples."""
import numpy as np
from scipy.ndimage import gaussian_filter1d
from pathlib import Path
import wave, subprocess, tempfile
rng=np.random.default_rng(300111)
sample_rate=22050
seconds=9
N=seconds*sample_rate
signal=rng.standard_normal(N).astype(np.float32)
# Smooth weather layer plus diffuse raindrop patter.
low=gaussian_filter1d(signal,20,mode='wrap')
mid=gaussian_filter1d(signal,2,mode='wrap')
track=.09*signal+.43*mid+.37*low
for _ in range(3500):
    idx=int(rng.integers(N));lenx=int(rng.integers(40,390));
    win=np.arange(lenx)
    spike=np.exp(-win/float(rng.integers(20,65)))*rng.uniform(.12,.70)
    indices=(idx+win)%N
    track[indices]+=spike.astype(np.float32)
track=np.tanh(track*1.6)
# Crossfade the last 0.12 seconds into the start, ending exactly at 0.
fade=int(.12*sample_rate)
for i in range(fade):
    k=i/fade
    track[N-fade+i]=(1-k)*track[N-fade+i]+k*track[i]
track=np.int16(np.clip(track,-1,1)*28000)
out=Path(__file__).resolve().parents[1]/'assets/audio/shire_rain_original.ogg'
out.parent.mkdir(parents=True,exist_ok=True)
with tempfile.NamedTemporaryFile(suffix='.wav') as f:
    with wave.open(f.name,'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(sample_rate);w.writeframes(track.tobytes())
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',f.name,'-c:a','libvorbis','-qscale:a','3',str(out)],check=True)
print(out.name,out.stat().st_size)