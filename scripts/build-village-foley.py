from pathlib import Path
import json,hashlib,subprocess,struct,math,argparse
ap=argparse.ArgumentParser(description='Author the reviewed CC0 village foley package; no provider download or project admission.')
ap.add_argument('--sources',required=True);ap.add_argument('--output',required=True);args=ap.parse_args()
source=Path(args.sources).resolve();root=Path(args.output).resolve()
if (root/'manifest.json').exists():assert json.loads((root/'manifest.json').read_text())['id']=='shire-kenney-rpg-foley-v1','Refuse a different package'
assert 'Kenney' in (source/'License.txt').read_text() and 'CC0' in (source/'License.txt').read_text()
(root/'audio').mkdir(parents=True,exist_ok=True);(root/'LICENSE.txt').write_bytes((source/'License.txt').read_bytes())
assert hashlib.sha256((source/'footstep00.ogg').read_bytes()).hexdigest()=='6fe61ef1fc3bcf0e253bf2eb64759db6cb69e2fe452f4d88cc597ecf78a3d601'
names={'door-open':'doorOpen_1','door-close':'doorClose_1','cart-creak-1':'creak1','cart-creak-2':'creak2','cart-creak-3':'creak3','leather-1':'handleSmallLeather','leather-2':'handleSmallLeather2','book-page':'bookFlip1','cart-load':'chop'}
receipt={'author':'Kenney Vleugels / Kenney.nl','license':'CC0-1.0','official':'https://kenney.nl/assets/rpg-audio','mirror':'rowink/CC0-Sounds-Web','ref':'7ba7f169b9d30fc822475e4fb4f79d1d20627766','sourceDirectory':'public/sounds/kenney_rpgaudio/Audio','conversion':'FFmpeg: mono 22050 Hz MP3 64 kb/s, input gain 0.5 to retain headroom after lossy encoding','mirrorCrossCheck':'footstep00.ogg matches previously verified source SHA256','files':{}}
expected_sources={'doorOpen_1.ogg': '4ab93bab96522d8eb109ff96dc57cb6765deb02448fe14c10472084be5bb2a0b', 'doorClose_1.ogg': '834d29c60a8a8bfb50b158cdb6b7dfa8f02812a408a1ee9703d038dfab0b1aeb', 'creak1.ogg': '8a346186fd297254248cab8e8117060a52a5cf2a84f603153a762108550ea95e', 'creak2.ogg': '8a990afdc03aebb91d528f5385e2f95582dbfa8e2c12c71098ab01be9142294a', 'creak3.ogg': 'f9638787f95004b9d2d06f8eff8e99d4e594c21b51947daf562856fbcec905d1', 'handleSmallLeather.ogg': 'ae3cbf695aa0a8b98b5a80a835be5a3ccbd5446a24db2235cd4c3cd6fc92ed96', 'handleSmallLeather2.ogg': 'a66f6db5918ad016c28a9f2768f127a7f39b5fa04481e5a3b4e78ebe2a1c282d', 'bookFlip1.ogg': 'fa81ac2fedc8c641661b87e349630a36c9800e795e0c800e029214efdbe26a7d', 'chop.ogg': 'd00c2b3c9fff07e376145c8c8c45c90e5084ec192f6ce0387db233f7b86f1486'}
for name,original in names.items():
 inp=source/(original+'.ogg');assert hashlib.sha256(inp.read_bytes()).hexdigest()==expected_sources[inp.name],'Unreviewed source';out=root/'audio'/(name+'.mp3')
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(inp),'-af','volume=0.5','-ac','1','-ar','22050','-b:a','64k','-map_metadata','-1',str(out)],check=True)
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(out),'-f','f32le','-acodec','pcm_f32le','-ac','1','-ar','22050','pipe:1']);samples=struct.unpack('<'+'f'*(len(raw)//4),raw);peak=max(map(abs,samples));rms=math.sqrt(sum(x*x for x in samples)/len(samples));assert 0<rms<1 and peak<1,(name,peak,rms)
 b=out.read_bytes();receipt['files'][name+'.mp3']={'source':original+'.ogg','sourceSha256':hashlib.sha256(inp.read_bytes()).hexdigest(),'sourceBytes':inp.stat().st_size,'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b),'duration':len(samples)/22050,'peak':peak,'rms':rms}
(root/'source-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
files={str(p.relative_to(root)):{'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size}for p in root.rglob('*')if p.is_file()and p.name!='manifest.json'}
manifest={'id':'shire-kenney-rpg-foley-v1','version':1,'category':'audio','license':'CC0-1.0','validation':'PASS: decoded PCM, bounded peak, closed SHA256 roster','files':files};(root/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
assert {str(p.relative_to(root))for p in root.rglob('*')if p.is_file()}==set(files)|{'manifest.json'}
for path,entry in files.items():assert hashlib.sha256((root/path).read_bytes()).hexdigest()==entry['sha256']
print(json.dumps({'package':str(root),'manifestSha256':hashlib.sha256((root/'manifest.json').read_bytes()).hexdigest(),'clips':len(names),'audioBytes':sum(v['bytes']for k,v in files.items()if k.startswith('audio/')),'maxPeak':max(v['peak']for v in receipt['files'].values())}))
