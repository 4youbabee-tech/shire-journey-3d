"""Original synthetic ambient audio (not extracted film audio)."""
from pathlib import Path
import numpy as np, wave
out=Path(__file__).resolve().parents[1]/'assets'/'audio'
out.mkdir(parents=True,exist_ok=True)
sr=22050;length=12;n=sr*length;time=np.arange(n)/sr
rng=np.random.default_rng(2103)

def wav(name,arr):
    arr=np.asarray(arr,dtype=float)
    arr/=max(1.0,np.max(np.abs(arr)))
    pcm=(arr*31000).astype('<i2')
    with wave.open(str(out/name),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes(pcm.tobytes())

# Distant birds: upward and downward narrowband frequency-modulated chirps.
birds=np.zeros(n)
for k in range(48):
    start=rng.uniform(0,length-.6);dur=rng.uniform(.10,.32);starti=int(start*sr);siz=int(dur*sr)
    t=np.linspace(0,dur,siz,endpoint=False)
    pitch=rng.uniform(1100,2200)
    sweep=rng.uniform(-300,800)
    phase=2*np.pi*(pitch*t+.5*sweep*t*t/dur)
    env=np.sin(np.pi*t/dur)**2
    chirp=(np.sin(phase)+.16*np.sin(2.01*phase))*env*rng.uniform(.018,.060)
    birds[starti:starti+siz]+=chirp
noise=rng.standard_normal(n)
wind=np.convolve(noise,np.ones(290)/290,mode='same')*.13
birds+=wind
wav('shire_birds_original.wav',birds)

# Water stream: pinkish filtered noise with slow swashes.
white=rng.standard_normal(n)
filtered=np.convolve(white,np.ones(17)/17,mode='same')*.12
flow=np.sin(2*np.pi*.53*time)*.01+filtered*(.7+.3*np.sin(2*np.pi*.17*time))
wav('river_original.wav',flow)