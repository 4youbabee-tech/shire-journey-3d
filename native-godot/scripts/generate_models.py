"""Shire Journey - original geometry; created for this project, not ripped Tolkien film assets.
Generates glTF 2.0 binary meshes for Godot, each containing full vertex color data.
"""
from pathlib import Path
import trimesh, numpy as np, math, random
from trimesh.transformations import rotation_matrix
rng=random.Random(20261016)
ROOT=Path(__file__).resolve().parents[1]/'assets'/'models'
ROOT.mkdir(parents=True,exist_ok=True)

def tint(m,c):
    m.visual.face_colors=np.array(list(c)+[255],dtype=np.uint8)
    return m

def box(pos,size,c):
    m=trimesh.creation.box(extents=size)
    m.apply_translation(pos)
    return tint(m,c)

def ball(pos,size,c,sub=2):
    m=trimesh.creation.icosphere(subdivisions=sub)
    m.apply_scale(size)
    m.apply_translation(pos)
    return tint(m,c)

def trunk(pts,radii,c,n=10):
    vertices=[];faces=[]
    for k,(p,r) in enumerate(zip(pts,radii)):
        for j in range(n):
            a=2*math.pi*j/n
            vertices.append([p[0]+r*math.cos(a),p[1],p[2]+r*math.sin(a)])
    for k in range(len(pts)-1):
        for j in range(n):
            a=k*n+j;b=k*n+(j+1)%n;c0=(k+1)*n+j;d=(k+1)*n+(j+1)%n
            faces.extend([[a,b,c0],[b,d,c0]])
    mesh=trimesh.Trimesh(vertices=vertices,faces=faces,process=False)
    return tint(mesh,c)

def cylinder_between(a,b,r,color,sections=9):
    a=np.array(a,dtype=float);b=np.array(b,dtype=float)
    direction=b-a;length=np.linalg.norm(direction)
    mesh=trimesh.creation.cylinder(radius=r,height=length,sections=sections)
    matrix=trimesh.geometry.align_vectors([0,0,1],direction/length)
    mesh.apply_transform(matrix)
    mesh.apply_translation((a+b)/2)
    return tint(mesh,color)

def export(name,meshes):
    scene=trimesh.Scene()
    for i,m in enumerate(meshes):
        scene.add_geometry(m,geom_name=f'{name}_{i}',node_name=f'{name}_{i}')
    data=scene.export(file_type='glb')
    (ROOT/(name+'.glb')).write_bytes(data)
    print(f'{name}.glb',len(data),'triangles',sum(len(m.faces) for m in meshes))

# Bespoke natural oak - many boughs and leaf clusters, not a tree icon.
for variant in range(3):
    g=[];h=5.2+variant*.6
    g.append(trunk([[0,0,0],[.12,1,0],[.3,2.6,-.08],[.18,h,.05]], [.53,.43,.28,.11],(92+variant*9,66,43)))
    for j in range(8):
        a=j*math.tau/8+variant*.2
        reach=2.2+rng.random()*1.3
        end=[math.cos(a)*reach,h-.1+rng.random()*1.2,math.sin(a)*reach]
        start=[.2,2.8,-.08]
        g.append(cylinder_between(start,end,.11 if j%2 else .16,(87,61,44),8))
        for k in range(4):
            angle=a+(rng.random()-.5)*.45
            pos=[end[0]+math.cos(angle)*k*.25,end[1]+rng.uniform(-.65,.55),end[2]+math.sin(angle)*k*.25]
            c=[(69,103,54),(78,122,54),(96,132,65),(112,139,74),(64,101,55)][(j+k+variant)%5]
            sz=[.85+rng.random()*.3,.78+rng.random()*.6,.85+rng.random()*.3]
            g.append(ball(pos,sz,c,1))
    for i in range(9):
        a=i*2.4
        g.append(ball([math.sin(a)*1.1,h+1.2+rng.uniform(-.2,.5),math.cos(a)*1.0],
                      [1.1,1.0,1.25],(72+i%3*12,117+i%4*8,62+i%3*5),1))
    export(f'old_oak_{variant+1}',g)

# Willow-like tree by the river.
g=[trunk([[0,0,0],[.18,2.0,0],[.27,4.8,0],[.15,7,.0]],[.45,.4,.26,.06],(93,75,52))]
for k in range(18):
    a=math.tau*k/18;dist=1.1+rng.random()*2.5
    x=math.sin(a)*dist;z=math.cos(a)*dist
    g.append(cylinder_between((0,5.2,0),(x,5.7,z),.08,(92,78,54),6))
    for j in range(6):
        y=5.8-j*.5
        g.append(ball([x*(.8+j*.05),y,z*(.8+j*.05)],[.24,.5,.25],(84,131+j*2,76),1))
export('river_willow',g)

# Wagon/cart (standalone modeled GLB; turnable wheels fixed to axle).
g=[]
g += [box((0,1.12,0),(3.9,.25,1.8),(111,68,39)),box((0,1.4,.89),(4,.65,.16),(133,84,52)),
      box((0,1.4,-.89),(4,.65,.16),(133,84,52)),box((-1.9,1.4,0),(.16,.65,1.8),(142,88,55)),
      box((1.9,1.4,0),(.16,.65,1.8),(142,88,55)),box((2.9,.82,0),(3.2,.16,.11),(96,66,41))]
for x in [-1.2,1.2]:
  for z in [-1.02,1.02]:
    wheel=trimesh.creation.annulus(r_min=.37,r_max=.55,height=.12,sections=18)
    wheel.apply_transform(rotation_matrix(math.pi/2,[1,0,0]));wheel.apply_translation([x,.54,z])
    g.append(tint(wheel,(80,58,45)))
    for k in range(8):
      a=k*math.tau/8
      g.append(cylinder_between((x,.54,z),(x+.45*math.cos(a),.54+.45*math.sin(a),z),.03,(152,120,75),6))
for x in [-1.6,-.7,.3,1.2]:
    g.append(box((x,1.64,-.2),(.25,.5,.65),(190,156,93)))
export('market_wagon',g)

# Wooden mill wheel, works with Godot rotation animation.
g=[]
for i in range(20):
    a=i*math.tau/20; b=(i+1)*math.tau/20
    pa=(math.cos(a)*2.05,math.sin(a)*2.05,0);pb=(math.cos(b)*2.05,math.sin(b)*2.05,0)
    g.append(cylinder_between(pa,pb,.10,(118,83,52),7))
    if i%2==0:
      g.append(cylinder_between((0,0,0),pa,.075,(141,102,64),8))
    g.append(box(((pa[0]+pb[0])*1.03,(pa[1]+pb[1])*1.03,0),(.6,.18,.46),(89,65,48)))
g.append(cylinder_between((0,0,-.5),(0,0,.5),.2,(73,53,42)))
export('watermill_wheel',g)

# Village dry goods stand with canvas canopy and produce baskets.
g=[]
for x in [-1.3,1.3]:
 for z in [-.74,.74]:
  g.append(cylinder_between((x,0,z),(x,2.8,z),.08,(96,64,40)))
g += [box((0,1.0,0),(3.2,.14,2),(109,75,42)),box((0,2.67,0),(3.7,.14,2.4),(173,89,63))]
for i in range(10):
    x=-1.7+i*.38
    g.append(box((x,2.57,1.1),(.19,.08,.25),(212,177,132) if i%2 else (147,77,53)))
for i in range(20):
    x=rng.uniform(-1.2,1.2);z=rng.uniform(-.7,.7)
    g.append(ball((x,1.17,z),(.08,.09,.08),(202,146,55) if i%2 else (101,135,65),1))
export('market_stall',g)

# Barrels, detailed hoops and rough stave variation.
g=[]
for i in range(15):
 a=i*math.tau/15
 x=math.cos(a)*.38;z=math.sin(a)*.38
 g.append(box((x,.61,z),(.15,1.13,.14),(96+i%3*8,62+i%4*6,37)))
for y in [.16,.55,1.06]:
 band=trimesh.creation.annulus(r_min=.40,r_max=.445,height=.07,sections=20)
 band.apply_transform(rotation_matrix(math.pi/2,[1,0,0]));band.apply_translation((0,y,0))
 g.append(tint(band,(75,72,61)))
g.append(cylinder_between((0,1.18,0),(0,1.2,0),.39,(85,54,38),18))
export('oak_barrel',g)

# Honey lantern, warm emissive handled by engine material on import.
g=[box((0,0.76,0),(.30,.16,.3),(75,66,50)),box((0,1.28,0),(.37,.16,.37),(78,70,51)),
   ball((0,1.0,0),(.12,.21,.12),(230,171,72),2)]
for x in [-.14,.14]:
 for z in [-.14,.14]:
  g.append(cylinder_between((x,.82,z),(x,1.28,z),.021,(80,73,62),6))
g.append(cylinder_between((0,1.38,0),(0,1.64,0),.026,(73,68,61),7))
export('hanging_lantern',g)

# Patch of 12 flower stems, with 5 petals per flower.
g=[]
for i in range(14):
 x=rng.uniform(-.6,.6);z=rng.uniform(-.6,.6);h=rng.uniform(.4,.8)
 g.append(cylinder_between((x,0,z),(x+.05,h,z),.017,(66,113,47),5))
 palette=[(236,191,124),(236,225,174),(180,137,176),(222,163,175),(245,238,205)]
 for p in range(5):
  a=p*math.tau/5
  g.append(ball((x+math.cos(a)*.11,h,z+math.sin(a)*.11),(.09,.04,.065),palette[(i+p)%5],1))
 g.append(ball((x,h,z),(.065,.07,.065),(216,173,64),1))
export('garden_flowers',g)