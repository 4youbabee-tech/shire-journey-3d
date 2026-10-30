# Original composition using CC0 VSCO recorded instruments. See Docs/QUALITY_CANDIDATE_ASSETS.md.
from scipy.io import wavfile
from scipy.signal import resample_poly
import numpy as np, pathlib
sr=22050
out=np.zeros((sr*51,2),dtype=np.float64)
def read(name):
 rate,a=wavfile.read('/tmp/shire-score-source/'+name)
 a=a.astype(np.float64)/(2**(np.iinfo(a.dtype).bits-1));a=resample_poly(a,sr,rate,axis=0)
 peak=np.max(np.abs(a));return a/max(peak,.001)
harp=read('harp-D4.wav');flute=read('flute-C5.wav')
def note(source,midi,base,t,dur,gain,pan=0):
 rate=2**((midi-base)/12);n=int(sr*dur);idx=np.arange(n)*rate
 if idx[-1]>=len(source):idx=np.minimum(idx,len(source)-1)
 y=np.stack([np.interp(idx,np.arange(len(source)),source[:,c]) for c in [0,1]],axis=1)
 env=np.ones(n);attack=min(int(sr*.045),n//3);release=min(int(sr*.30),n//2)
 env[:attack]=np.linspace(0,1,attack);env[-release:]=np.linspace(1,0,release)**1.7
 start=int(t*sr)
 if start+n>len(out):y=y[:len(out)-start];env=env[:len(y)]
 out[start:start+len(y)]+=y*env[:,None]*gain*np.array([1-max(0,pan)*.35,1+min(0,pan)*.35])
chords=[[50,57,62,66],[55,59,62,67],[47,54,59,62],[45,52,57,61]]
melody=[[74,76,78,76,69],[71,74,76,74,67],[74,73,71,69,66],[69,73,76,74,73],[74,78,81,78,76],[79,78,76,74,71],[78,76,74,73,71],[73,71,69,73,74]]
for bar in range(16):
 t=bar*3;ch=chords[bar%4]
 for i in range(6):note(harp,ch[[0,2,1,3,2,1][i]],62,t+i*.5,2.3,.14 if i else .22,-.25)
 m=melody[bar%8]
 for i,pitch in enumerate(m):note(flute,pitch+(0 if bar<8 else (-12 if bar%2 else 0)),72,t+.25+i*.5,.67 if i<4 else .83,.105+(bar%3)*.006,.2)
# Original small-room reflections, no film audio or commercial impulse responses.
dry=out.copy()
for delay,decay in [(.061,.15),(.107,.12),(.193,.09),(.317,.065),(.491,.045)]:
 n=int(sr*delay);out[n:]+=dry[:-n,::-1]*decay
out[:sr]*=np.linspace(0,1,sr)[:,None];out[-sr*3:]*=np.linspace(1,0,sr*3)[:,None]
peak=np.max(np.abs(out));out=np.tanh(out/max(peak,.001)*.9);out*=.86/max(np.max(np.abs(out)),.001)
# Encode /tmp/shire-original-pastoral.wav with ffmpeg: -codec:a libmp3lame -b:a 96k -ar 22050
wavfile.write('/tmp/shire-original-pastoral.wav',sr,(out*32767).astype(np.int16))
print('Original harp/flute arrangement',len(out)/sr,'seconds','RMS',np.sqrt(np.mean(out**2)))
