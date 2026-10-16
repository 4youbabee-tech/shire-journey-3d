#!/usr/bin/env python3
"""One-time approved Poly Haven CC0 PBR download, hash and license audit.

This is a build-time asset import, not a game runtime network dependency.
The official Poly Haven API requires a distinctive User-Agent and project credit.
"""
import hashlib
import json
import os
from pathlib import Path
import urllib.request
import urllib.parse

ASSET='leafy_grass'
UA='ShireJourney3D-AssetImporter/1.0 (+https://github.com/4youbabee-tech/shire-journey-3d)'
DEST=Path(__file__).resolve().parents[1]/'assets/external/polyhaven_leafy_grass'
DEST.mkdir(parents=True,exist_ok=True)

def get_url(url):
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'application/json,image/jpeg,*/*'})
    with urllib.request.urlopen(req,timeout=55) as resp:
        data=resp.read(9_000_000)
    return data

files=json.loads(get_url('https://api.polyhaven.com/files/'+ASSET))
metadata=json.loads(get_url('https://api.polyhaven.com/info/'+ASSET))
# API documented as CC0, not vendor-specific claims or unverifiable user uploads.
if metadata.get('type') != 1:
    raise ValueError('Poly Haven asset is not a texture (type 1)')

candidates=[]
def walk(tree,keys=()):
    if isinstance(tree,dict):
        if isinstance(tree.get('url'),str):
            candidates.append((keys,tree))
        for key,value in tree.items():
            if key not in ('url','md5','size'):
                walk(value,keys+(str(key).lower(),))
    elif isinstance(tree,list):
        for idx,value in enumerate(tree):
            walk(value,keys+(str(idx),))
walk(files)

def choose(kind):
    found=[]
    for keys,info in candidates:
        desc=' '.join(keys).lower()+' '+info['url'].lower()
        if '1k' not in desc or not info['url'].lower().split('?')[0].endswith('.jpg'):
            continue
        if kind=='diff' and ('diffuse' in desc or '_diff_1k' in desc):
            found.append((keys,info))
        if kind=='normal' and ('nor_gl' in desc or 'normal gl' in desc or 'normal_opengl' in desc):
            found.append((keys,info))
    if not found:
        raise ValueError('Missing '+kind+' JPG 1K from official API. Paths: '+str([k for k,_ in candidates])[:1200])
    found.sort(key=lambda e:len(e[0]))
    return found[0][1]

result={'source':'Poly Haven','slug':ASSET,'page':'https://polyhaven.com/a/'+ASSET,
        'license':'CC0 1.0','asset_type':'texture','api':'https://api.polyhaven.com',
        'authors':metadata.get('authors',{}),'files':[]}
for kind,name in [('diff','diffuse_1k.jpg'),('normal','normal_gl_1k.jpg')]:
    info=choose(kind)
    url=info['url']
    if not url.startswith('https://dl.polyhaven.org/'):
        raise ValueError('Unexpected external domain: '+url)
    raw=get_url(url)
    if not raw.startswith(b'\xff\xd8'):
        raise ValueError('Not JPEG '+name)
    if len(raw)>6_000_000 or len(raw)<10000:
        raise ValueError('Invalid texture size '+str(len(raw)))
    md5=hashlib.md5(raw).hexdigest()
    if info.get('md5') and md5.lower()!=info['md5'].lower():
        raise ValueError('Official MD5 checksum mismatch: '+name)
    path=DEST/name
    path.write_bytes(raw)
    entry={'path':str(path.relative_to(DEST.parents[2])),'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),
           'md5':md5,'download_url':url,'official_expected_md5':info.get('md5','')}
    result['files'].append(entry)
    print('IMPORTED',name,len(raw),'MD5_OK',bool(info.get('md5')))
(DEST/'LICENSE_AND_SOURCE.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
print('CC0_IMPORT_SUCCESS',DEST)