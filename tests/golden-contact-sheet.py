"""Pair immutable 0.14.1 reference and candidate. Never synthesize missing frames."""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageStat
base, candidate, target = map(Path, sys.argv[1:])
reports = [json.loads((p/'golden-report.json').read_text()) for p in (base,candidate)]
assert all(r['status']=='PASS' and len(r['shots'])==12 for r in reports)
a={s['id']:s for s in reports[0]['shots']}; b={s['id']:s for s in reports[1]['shots']}
assert a.keys()==b.keys()
canvas=Image.new('RGB',(1280,80+12*390),'#18211d'); draw=ImageDraw.Draw(canvas)
draw.text((20,12),'B1 fixed real renders | LEFT: 0.14.1 immutable reference | RIGHT: candidate',fill='white')
draw.text((20,36),'Engineering cameras, not gameplay. Owner visual approval PENDING. No generated artwork.',fill='white')
for n,key in enumerate(sorted(a)):
    for col,(folder,shots) in enumerate(((base,a),(candidate,b))):
        shot=shots[key]; im=Image.open(folder/shot['file']).convert('RGB')
        assert max(ImageStat.Stat(im).stddev)>5, f'Blank render {key}'
        assert a[key]['camera']==b[key]['camera'], f'Camera drift {key}'
        im.thumbnail((630,355));canvas.paste(im,(col*640,80+n*390+25))
        draw.text((col*640+10,80+n*390),key+' '+str(shot['build']['commit'])[:12],fill='white')
canvas.save(target)
