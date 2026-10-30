"""Author licensed human-scale Shire actors with Blender 4.5 LTS, offline.
Input: the three reviewed Quaternius Standard archives unpacked in --sources.
Never edits source files. Output is a review candidate, not an accepted actor.
"""
import bpy,bmesh,math,pathlib,argparse,sys,json
from mathutils import Vector,Matrix,Quaternion
ap=argparse.ArgumentParser();ap.add_argument('--sources',required=True);ap.add_argument('--output',required=True);ap.add_argument('--role',choices=['frodo','sam','bilbo','gandalf'],default='frodo');args=ap.parse_args(sys.argv[sys.argv.index('--')+1:])
ROLE=args.role;WIZARD=ROLE=='gandalf'
PROFILE={'frodo':(.92,.70,.91,1.24),'sam':(1.0,.72,.94,1.22),'bilbo':(.99,.69,.90,1.27),'gandalf':(.88,1.,1.,1.)}[ROLE]
ROOT=pathlib.Path(args.sources);OUT=pathlib.Path(args.output);OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def load(pattern):
 p=next(ROOT.glob(pattern));path=p
 if p.suffix=='.gltf':
  data=json.loads(p.read_text());stage=OUT/'input-staging';stage.mkdir(exist_ok=True)
  for entry in data.get('buffers',[])+data.get('images',[]):
   uri=entry.get('uri','')
   if uri and not uri.startswith('data:'):
    source=p.parent/uri
    if not source.exists() and '_png.png' in uri:source=p.parent/uri.replace('_png.png','.png')
    if not source.exists():raise FileNotFoundError(source)
    entry['uri']=str(source.resolve())
  path=stage/p.name;path.write_text(json.dumps(data))
 old=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(path));new=[o for o in bpy.data.objects if o not in old];return new
outfit=load('**/Outfits/Male_Peasant.gltf');rig=next(o for o in outfit if o.type=='ARMATURE');rig.name='Shire natural rig'
base=load('**/Base Characters/Godot - UE/Superhero_Male_FullBody.gltf')
head=next(o for o in base if o.type=='MESH' and o.name.startswith('SuperHero_Male'))
# Keep the source's actual anatomical face/ears/neck, and its bare feet.
def retain_region(obj,predicate,name):
 copy=obj.copy();copy.data=obj.data.copy();bpy.context.collection.objects.link(copy);copy.name=name
 bm=bmesh.new();bm.from_mesh(copy.data);remove=[v for v in bm.verts if not predicate(copy.matrix_world@v.co)];bmesh.ops.delete(bm,geom=remove,context='VERTS');bm.to_mesh(copy.data);bm.free();return copy
face=retain_region(head,lambda p:p.z>1.54 and abs(p.x)<.13,ROLE+' anatomical face')
feet=retain_region(head,lambda p:p.z<.43,ROLE+' bare feet')
for v in feet.data.vertices:v.co.x-=.023 if v.co.x>0 else -.023
bpy.data.objects.remove(head,do_unlink=True)
for o in list(outfit):
 if not WIZARD and o.type=='MESH' and o.name.startswith('Male_Peasant_Feet'):bpy.data.objects.remove(o,do_unlink=True)
hair=load('**/Rigged to Head Bone/glTF (Godot -Unreal)/'+('Hair_Long.gltf' if WIZARD else 'Hair_SimpleParted.gltf'))
if WIZARD:
 hair+=load('**/Rigged to Head Bone/glTF (Godot -Unreal)/Hair_Beard.gltf');bpy.data.objects.remove(feet,do_unlink=True)
# Reuse one humanoid rig; no competing object or animation authority.
meshes=[o for o in bpy.data.objects if o.type=='MESH' and len(o.vertex_groups)]
for o in meshes:
 world=o.matrix_world.copy();o.parent=rig;o.matrix_world=world
 for m in o.modifiers:
  if m.type=='ARMATURE':m.object=rig
for o in list(bpy.data.objects):
 if (o.type=='ARMATURE' and o!=rig) or (o.type=='MESH' and not len(o.vertex_groups)):bpy.data.objects.remove(o,do_unlink=True)
# Source objects share Blender world coordinates, but keep the conversion explicit.
HEAD=Vector((0,.017,1.6))
def warp(p,head_part=False):
 p=p.copy()
 if head_part:
  blend=max(0,min(1,(p.z-1.51)/.13));p=HEAD+(p-HEAD)*(1+(PROFILE[3]-1)*blend)
 p.x*=PROFILE[0];p.y*=1.04
 p.z=p.z*PROFILE[1] if p.z<=1 else PROFILE[1]+(p.z-1)*PROFILE[2]
 return p
for o in meshes:
 inv=o.matrix_world.inverted();is_head=o==face or 'Eyebrows' in o.name or 'Eyes' in o.name or 'Hair_' in o.name
 for v in o.data.vertices:
  p=o.matrix_world@v.co
  if o==face:
   # Young, soft jaw; retain real nose, mouth, lids and ear topology.
   jaw=max(0,min(1,(1.67-p.z)/.12));p.x*=1+({'frodo':-.07,'sam':.06,'bilbo':.025,'gandalf':-.04}[ROLE])*jaw
   if WIZARD:p.y-=.009*math.exp(-(p.x/.022)**2-((p.z-1.657)/.028)**2)
   if ROLE in ['bilbo','gandalf'] and p.y<-.035 and p.z>1.73:p.y+=.0012*math.cos(p.z*610)*math.exp(-((p.z-1.75)/.035)**2)
  if 'Eyebrows' in o.name and not WIZARD:p.z+=.0035*max(0,1-abs(p.x)/.055)
  if o==face and not WIZARD and abs(p.x)>.068 and p.z>1.67:p.z+=(abs(p.x)-.068)*.3
  if 'Hair_SimpleParted' in o.name:
   if p.z>1.74:p.z=1.74+(p.z-1.74)*.72
   p.z+=.014+.004*math.sin(p.x*190+p.y*60)+.003*math.cos(p.y*210-p.x*80);p.x*=1.035;p.y=.017+(p.y-.017)*1.035
  if 'Hair_Beard' in o.name and p.z<1.65:
   t=min(1,(1.65-p.z)/.15);p.z=1.65-(1.65-p.z)*3.0;p.x*=1-.2*t;p.y-=.018*t
  v.co=inv@warp(p,is_head)
 for poly in o.data.polygons:poly.use_smooth=True
# Make the rest skeleton match the new short, sturdy proportions.
bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
for b in rig.data.edit_bones:
 b.head=warp(b.head, b.name=='Head');b.tail=warp(b.tail,b.name=='Head')
bpy.ops.object.mode_set(mode='OBJECT')
# Source package has two bad normal-image filenames. Use the actual files and
# deliberately omit normal maps on the mobile candidate; baked color is retained.
light=next(ROOT.glob('**/Base Characters/Textures/T_Superhero_Male_Ligh.png'))
for mat in bpy.data.materials:
 if not mat.use_nodes:continue
 bsdf=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if not bsdf:continue
 bsdf.inputs['Metallic'].default_value=0;bsdf.inputs['Roughness'].default_value=.88;bsdf.inputs['Specular IOR Level'].default_value=.25
 for key in ['Normal','Metallic','Roughness']:
  for link in list(bsdf.inputs[key].links):mat.node_tree.links.remove(link)
 if 'Superhero_Male' in mat.name:
  for n in mat.node_tree.nodes:
   if n.type=='TEX_IMAGE' and n.image and 'Dark' in n.image.name:n.image=bpy.data.images.load(str(light),check_existing=True)
# Bound texture residency: faces 1024, clothing/hair 512; unused maps not exported.
for im in bpy.data.images:
 if im.source!='FILE' or im.size[0]==0:continue
 size=1024 if 'Male_Ligh' in im.name else 512
 if max(im.size)>size:im.scale(size,size)
# Pose-independent material tint: dark curls and a natural cloth palette.
for mat in bpy.data.materials:
 if mat.use_nodes and 'Hair' in mat.name:
  n=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
  if n:
   for link in list(n.inputs['Base Color'].links):mat.node_tree.links.remove(link)
   n.inputs['Base Color'].default_value={'frodo':(.035,.019,.01,1),'sam':(.2,.115,.045,1),'bilbo':(.25,.22,.18,1),'gandalf':(.37,.38,.35,1)}[ROLE]

# An actual second garment, derived from the rigged tunic rather than a flat icon.
cloth=bpy.data.materials.new(ROLE+' woven waistcoat');cloth.diffuse_color={'frodo':(.16,.072,.038,1),'sam':(.21,.16,.075,1),'bilbo':(.24,.045,.055,1),'gandalf':(.12,.145,.14,1)}[ROLE];cloth.use_nodes=True
bs=cloth.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=cloth.diffuse_color;bs.inputs['Roughness'].default_value=.96
# Original shoulder-to-hem cape; blended spine/hips skin weights, not a rigid cone.
verts=[];faces=[];cols=24;rows=14
for row in range(rows+1):
 t=row/rows;z=1.5-t*({'frodo':.95,'sam':.8,'bilbo':.85,'gandalf':1.35}[ROLE]);r=.13+.25*math.sin(min(1,t*5)*math.pi/2)+t*.035
 for col in range(cols+1):
  u=col/cols*2-1;angle=u*1.7;fold=.008*math.cos(u*math.pi*9)*(t+.2)
  point=warp(Vector((math.sin(angle)*(r+fold),math.cos(angle)*(r*.65+fold)+.04,z)))
  verts.append(point)
  if row<rows and col<cols:
   a=row*(cols+1)+col;b=a+cols+1;faces.append((a,a+1,b+1,b))
mesh=bpy.data.meshes.new('woven cape panels');mesh.from_pydata(verts,[],faces);mesh.update();cape=bpy.data.objects.new('Frodo travelling cloak',mesh);bpy.context.collection.objects.link(cape);cape.parent=rig
for name in ['spine_03','spine_02','pelvis']:cape.vertex_groups.new(name=name)
for i in range(len(verts)):
 t=(i//(cols+1))/rows;upper=max(0,1-t*2.5);lower=min(1,max(0,(t-.25)/.65));mid=1-upper-lower
 for bone,w in [('spine_03',upper),('spine_02',mid),('pelvis',lower)]:
  if w>0:cape.vertex_groups[bone].add([i],w,'REPLACE')
mod=cape.modifiers.new('one character skeleton','ARMATURE');mod.object=rig
mat=bpy.data.materials.new('moss green wool cloak');mat.use_nodes=True;bs=mat.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value={'frodo':(.065,.105,.061,1),'sam':(.13,.115,.065,1),'bilbo':(.14,.035,.045,1),'gandalf':(.13,.15,.15,1)}[ROLE];bs.inputs['Roughness'].default_value=.98;cape.data.materials.append(mat)
for f in cape.data.polygons:f.use_smooth=True
meshes.append(cape)

if ROLE=='sam':meshes.remove(cape);bpy.data.objects.remove(cape,do_unlink=True)
# A reusable skinned surface helper for authored garments/accessories.
def skin_surface(name,vertices,polygons,material,weights):
 data=bpy.data.meshes.new(name+' topology');data.from_pydata(vertices,[],polygons);data.update();o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);o.parent=rig;o.data.materials.append(material)
 for i,point in enumerate(vertices):
  for bone,value in weights(i,point).items():
   if value<=0:continue
   if bone not in o.vertex_groups:o.vertex_groups.new(name=bone)
   o.vertex_groups[bone].add([i],value,'REPLACE')
 mod=o.modifiers.new('shared humanoid skin','ARMATURE');mod.object=rig
 for f in data.polygons:f.use_smooth=True
 meshes.append(o);return o
if not WIZARD:
 # Clean continuous waistcoat panels. Cutting arbitrary source triangles made a
 # ragged neckline, so the garment is authored with a deliberate open V front.
 vertices=[];polygons=[];rows=16;cols=36
 for row in range(rows+1):
  t=row/rows;z=1.49-t*.50;rx=.235-.04*math.sin(t*math.pi);ry=.19-.025*math.sin(t*math.pi);end=2.55+.47*min(1,t*2.7)
  for col in range(cols+1):
   a=(col/cols*2-1)*end;fold=.0018*math.cos(a*10)*math.sin(t*math.pi)
   vertices.append(warp(Vector((math.sin(a)*(rx+fold),.025+math.cos(a)*(ry+fold),z))))
   if row<rows and col<cols:
    i=row*(cols+1)+col;j=i+cols+1;polygons.append((i,i+1,j+1,j))
 def vest_weights(i,p):
  t=(i//(cols+1))/rows;top=max(0,1-t*1.8);bottom=max(0,(t-.55)/.45);return {'spine_03':top,'spine_01':1-top-bottom,'pelvis':bottom}
 skin_surface(ROLE+' tailored waistcoat',vertices,polygons,cloth,vest_weights)
 # Sparse, fully opaque curling foot hair follows the actual foot joints.
 hairmat=next(m for m in bpy.data.materials if 'MI_Hair' in m.name)
 for side,suffix in [(1,'l'),(-1,'r')]:
  vertices=[];polygons=[]
  for strand in range(26):
   x=side*.091+((strand*13%23)/22-.5)*.065;y=-.025-(strand*7%19)/18*.09;z=.102-(-y-.025)*.28
   start=len(vertices)
   for step in range(5):
    t=step/4;cx=x+.009*math.sin(t*math.pi*1.5+strand);cy=y+t*.009;cz=z+math.sin(t*math.pi)*.008
    for edge in [-1,1]:vertices.append(warp(Vector((cx+edge*.0011,cy,cz))))
    if step<4:
     i=start+step*2;polygons.append((i,i+1,i+3,i+2))
  skin_surface(ROLE+' curling foot hair '+suffix,vertices,polygons,hairmat,lambda i,p:{'foot_'+suffix:1})
if WIZARD:
 grey=bpy.data.materials.new('weathered grey woven wool');grey.use_nodes=True;bs=grey.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(.18,.205,.20,1);bs.inputs['Roughness'].default_value=.98
 # Bell sleeves follow upper/lower arm weights through the source clips.
 for side,suffix in [(1,'l'),(-1,'r')]:
  vertices=[];polygons=[];rings=8;sides=20
  for row in range(rings+1):
   t=row/rings;x=side*(.28+t*.365);radius=.083+.012*t+.008*math.cos(t*math.pi*4)
   for col in range(sides+1):
    a=col/sides*math.tau;fold=1+.035*math.cos(a*7)
    vertices.append(warp(Vector((x,.062+math.cos(a)*radius*fold,1.456+math.sin(a)*radius*fold))))
    if row<rings and col<sides:
     i=row*(sides+1)+col;j=i+sides+1;polygons.append((i,j,j+1,i+1))
  def sleeve_weights(i,p):
   t=(i//(sides+1))/rings;w=max(0,min(1,(t-.3)/.45));return {'upperarm_'+suffix:1-w,'lowerarm_'+suffix:w}
  skin_surface('Gandalf folded sleeve '+suffix,vertices,polygons,grey,sleeve_weights)
 # Long robe, blended into pelvis/thighs; source boots remain beneath the hem.
 vertices=[];polygons=[];rows=12;sides=32
 for row in range(rows+1):
  t=row/rows;z=1.08-t*.96
  for col in range(sides+1):
   a=col/sides*math.tau;fold=1+.025*math.cos(a*12);rx=.265+t*.085;ry=.215+t*.075
   vertices.append(warp(Vector((math.sin(a)*rx*fold,.045+math.cos(a)*ry*fold,z))))
   if row<rows and col<sides:
    i=row*(sides+1)+col;j=i+sides+1;polygons.append((i,i+1,j+1,j))
 def robe_weights(i,p):
  t=(i//(sides+1))/rows;w=max(0,min(.65,(t-.22)*.65));left=max(0,min(1,.5+p.x*2));return {'pelvis':1-w,'thigh_l':w*left,'thigh_r':w*(1-left)}
 skin_surface('Gandalf long skinned robe',vertices,polygons,grey,robe_weights)
 # A gently bent cloth crown and uneven brim, authored as one detailed hat.
 vertices=[];polygons=[];sides=36;rings=[(.30,1.817),(.135,1.827),(.12,1.94),(.085,2.07),(.048,2.18),(.006,2.255)]
 for row,(radius,z) in enumerate(rings):
  for col in range(sides+1):
   a=col/sides*math.tau;bend=max(0,z-1.94)*.32
   vertices.append(warp(Vector((math.cos(a)*radius+bend,math.sin(a)*radius+.025,z+(math.sin(a*3)*.009 if row==0 else .003*math.cos(a*5))))))
   if row<len(rings)-1 and col<sides:
    i=row*(sides+1)+col;j=i+sides+1;polygons.append((i,i+1,j+1,j))
 skin_surface('Gandalf weathered pointed hat',vertices,polygons,grey,lambda i,p:{'Head':1})
 # The staff mesh has a grip-centred origin for the runtime's hand follower.
 vertices=[];polygons=[];rings=28;sides=10
 for row in range(rings+1):
  t=row/rings;z=-1.33+t*2.15;radius=.013*(1-.4*t)+(.012 if t>.84 else 0);cx=.012*math.sin(t*11)+max(0,t-.86)*.23
  for col in range(sides+1):
   a=col/sides*math.tau;vertices.append((cx+math.cos(a)*radius,math.sin(a)*radius,z))
   if row<rings and col<sides:
    i=row*(sides+1)+col;j=i+sides+1;polygons.append((i,i+1,j+1,j))
 data=bpy.data.meshes.new('crooked ash staff topology');data.from_pydata(vertices,[],polygons);data.update();staff=bpy.data.objects.new('Gandalf walking staff',data);bpy.context.collection.objects.link(staff);staff.parent=rig;staff.location=(.683,.065,1.456)
 wood=bpy.data.materials.new('worn ash staff');wood.use_nodes=True;bs=wood.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(.11,.067,.032,1);bs.inputs['Roughness'].default_value=1;staff.data.materials.append(wood);meshes.append(staff)

if WIZARD:
 # Remove trouser surfaces concealed beneath the robe, preventing z-fighting.
 for o in list(meshes):
  if o.name.startswith('Male_Peasant_Legs'):meshes.remove(o);bpy.data.objects.remove(o,do_unlink=True)
 # Continuous jaw-to-chest beard volume bridges the source facial hair tufts.
 silver=bpy.data.materials.new('silver beard fibres');silver.use_nodes=True;bs=silver.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(.39,.405,.375,1);bs.inputs['Roughness'].default_value=.95
 vertices=[];polygons=[];rows=16;cols=24
 for row in range(rows+1):
  t=row/rows;width=.073*(1-t)**.55+.004
  for col in range(cols+1):
   u=col/cols*2-1;ripple=.002*math.cos(u*31+t*8)
   vertices.append(warp(Vector((u*width,-.078-math.sqrt(max(0,1-u*u))*(.035+.02*math.sin(t*math.pi))+ripple,1.625-t*.33+.004*math.sin(u*17)*t))))
   if row<rows and col<cols:
    i=row*(cols+1)+col;j=i+cols+1;polygons.append((i,i+1,j+1,j))
 skin_surface('Gandalf full silver beard',vertices,polygons,silver,lambda i,p:{'Head':1})
 # Source cloth keeps its authored weave and seams, in a weathered grey palette.
 for material in bpy.data.materials:
  if 'MI_Peasant' not in material.name or not material.use_nodes:continue
  for node in list(material.node_tree.nodes):
   if node.type!='TEX_IMAGE' or not node.image or not node.image.name.startswith('T_Peasant_BaseColor'):continue
   image=node.image.copy();pixels=list(image.pixels)
   for i in range(0,len(pixels),4):
    l=pixels[i]*.21+pixels[i+1]*.72+pixels[i+2]*.07;pixels[i:i+3]=[l*.64,l*.72,l*.70]
   image.pixels=pixels;image.pack();node.image=image
# Generated wool colors are linear material values; encode albedo texels as sRGB.
def linear_to_srgb(v):return 12.92*v if v<=.0031308 else 1.055*v**(1/2.4)-.055
# Small deterministic woven color maps on authored garments; no runtime noise cost.
for material in [cloth,mat]+([grey] if WIZARD else []):
 if material.name not in bpy.data.materials:continue
 bs=next(n for n in material.node_tree.nodes if n.type=='BSDF_PRINCIPLED');color=tuple(bs.inputs['Base Color'].default_value);image=bpy.data.images.new(ROLE+' '+material.name+' woven albedo',width=256,height=256);pixels=[]
 for y in range(256):
  for x in range(256):
   noise=math.sin(x*12.9898+y*78.233)*43758.5453;noise-=math.floor(noise);weave=(.025 if x%3==0 else -.01)+(.018 if y%3==0 else -.007);shade=.97+weave+(noise-.5)*.045
   pixels.extend([linear_to_srgb(min(1,c*shade)) for c in color[:3]]+[1])
 image.pixels=pixels;image.pack();texture=material.node_tree.nodes.new('ShaderNodeTexImage');texture.image=image;material.node_tree.links.new(texture.outputs['Color'],bs.inputs['Base Color'])
for o in meshes:
 if o.data.uv_layers:continue
 uv=o.data.uv_layers.new(name='cloth UV')
 for polygon in o.data.polygons:
  for loop in polygon.loop_indices:
   point=o.data.vertices[o.data.loops[loop].vertex_index].co;uv.data[loop].uv=(math.atan2(point.y,point.x)/math.tau,point.z*.8)
# Facial controls on actual anatomy, retained as glTF morph targets.
for o in [face,next(o for o in meshes if o.name.startswith('Eyes'))]:
 o.shape_key_add(name='Basis');blink=o.shape_key_add(name='Blink');smile=o.shape_key_add(name='Smile') if o==face else None
 inv=o.matrix_world.inverted()
 for i,v in enumerate(o.data.vertices):
  pt=o.matrix_world@v.co
  # Converted authored eye centre. Both globes and lid rim close in the same plane.
  center=warp(HEAD+(Vector((0,-.068,1.699))-HEAD)*PROFILE[3])
  dx=abs(abs(pt.x)-.031*PROFILE[0]*PROFILE[3]);dz=abs(pt.z-center.z)
  if o.name.startswith('Eyes'):
   q=pt.copy();q.z=center.z+(pt.z-center.z)*.045;blink.data[i].co=inv@q
  elif dx<.023 and dz<.025 and pt.y<-.03:
   w=max(0,1-dx/.023)*max(0,1-dz/.025);q=pt.copy();q.z+=(center.z-pt.z)*w*.8;blink.data[i].co=inv@q
  if o==face and abs(pt.x)<.045 and 1.0<pt.z<1.75:
   mouth=warp(HEAD+(Vector((0,-.079,1.645))-HEAD)*PROFILE[3])
   distance=(abs(pt.x)/.047)**2+((pt.z-mouth.z)/.018)**2
   if distance<1.2 and pt.y<-.035:
    q=pt.copy();q.z+=.004*abs(pt.x)/.04*max(0,1-distance/1.2);smile.data[i].co=inv@q
# Eyeballs rotate inside the actual sockets; gaze is not painted into a portrait.
eye=next(o for o in meshes if o.name.startswith('Eyes'))
for name,axis,angle in [('LookLeft',(0,0,1),.18),('LookRight',(0,0,1),-.18),('LookDown',(1,0,0),.13),('LookUp',(1,0,0),-.13)]:
 target=eye.shape_key_add(name=name);rotation=Quaternion(Vector(axis),angle);inv=eye.matrix_world.inverted()
 for i,v in enumerate(eye.data.vertices):
  point=eye.matrix_world@v.co;side=1 if point.x>0 else -1;center=warp(Vector((side*.031,-.068,1.699)),True);target.data[i].co=inv@(center+rotation@(point-center))
brow=next(o for o in meshes if o.name.startswith('Eyebrows'));brow.shape_key_add(name='Basis');attention=brow.shape_key_add(name='Attention')
for i,v in enumerate(brow.data.vertices):attention.data[i].co.z+=.0035

# Reuse the compatible official humanoid action library, keeping one rig.
created=load('**/UAL1_Standard.glb');source_rig=next(o for o in created if o.type=='ARMATURE')
source_tracks={t.name:t.strips[0] for t in source_rig.animation_data.nla_tracks if len(t.strips)}
holding={}
if WIZARD:
 for track in source_rig.animation_data.nla_tracks:track.mute=True
 source_rig.animation_data.action=source_tracks['Idle_Torch_Loop'].action;source_rig.animation_data.action_slot=source_tracks['Idle_Torch_Loop'].action_slot;bpy.context.scene.frame_set(12)
 for bone in source_rig.pose.bones:
  if bone.name in ['clavicle_l','upperarm_l','lowerarm_l','hand_l'] or (bone.name.endswith('_l') and any(t in bone.name for t in ['thumb','index','middle','pinky','ring'])):holding[bone.name]=bone.rotation_quaternion.copy()
 source_rig.animation_data.action=None
rig.animation_data_create()
aliases={'Idle':'Idle_Loop','Walking_A':'Walk_Loop','Running_A':'Jog_Fwd_Loop','Interact':'Idle_Talking_Loop','Cheer':'Dance_Loop','PickUp':'Fixing_Kneeling','Sit_Chair_Idle':'Sitting_Idle_Loop','Sit_Chair_Talk':'Sitting_Talking_Loop','Board':'Jump_Start','Sit_Floor_Idle':'Sitting_Idle_Loop','Sit_Floor_StandUp':'Sitting_Exit','Sit_Floor_Down':'Sitting_Enter'}
for name,original in aliases.items():
 src=source_tracks[original];action=src.action.copy();action.name=name
 if WIZARD:
  for layer in action.layers:
   for segment in layer.strips:
    for bag in segment.channelbags:
     for curve in list(bag.fcurves):
      if any(curve.data_path=='pose.bones["'+bone+'"].rotation_quaternion' for bone in holding):bag.fcurves.remove(curve)
  rig.animation_data.action=action;rig.animation_data.action_slot=action.slots[0]
  for bone,rotation in holding.items():
   pb=rig.pose.bones[bone];pb.rotation_mode='QUATERNION';pb.rotation_quaternion=rotation
   for frame in [action.frame_range[0],action.frame_range[1]]:pb.keyframe_insert(data_path='rotation_quaternion',frame=frame)
  rig.animation_data.action=None
 track=rig.animation_data.nla_tracks.new();track.name=name;strip=track.strips.new(name,0,action);strip.action_slot=action.slots[0];track.mute=True

# A floor reading pose is authored on this actual rig. Chair idle is retained
# separately for riding; it cannot stand in for sitting beneath the tree.
if not WIZARD:
 def pose_snapshot():return {b.name:(b.location.copy(),b.rotation_quaternion.copy(),b.scale.copy()) for b in rig.pose.bones}
 for track in rig.animation_data.nla_tracks:track.mute=True
 idle_strip=next(t.strips[0] for t in rig.animation_data.nla_tracks if t.name=='Idle')
 rig.animation_data.action=idle_strip.action;rig.animation_data.action_slot=idle_strip.action_slot;bpy.context.scene.frame_set(12);bpy.context.view_layer.update();standing=pose_snapshot()
 rig.animation_data.action=source_tracks['Crouch_Idle_Loop'].action;rig.animation_data.action_slot=source_tracks['Crouch_Idle_Loop'].action_slot;bpy.context.scene.frame_set(12);bpy.context.view_layer.update();crouching=pose_snapshot()
 rig.animation_data.action=None
 for bone in rig.pose.bones:bone.matrix_basis=Matrix.Identity(4)
 bpy.context.view_layer.update();pelvis=rig.pose.bones['pelvis'];matrix=pelvis.matrix.copy();matrix.translation.z=.14;pelvis.matrix=matrix;bpy.context.view_layer.update()
 def aim(name,direction):
  bone=rig.pose.bones[name];direction=Vector(direction).normalized();delta=(bone.tail-bone.head).normalized().rotation_difference(direction);rotation=delta@bone.matrix.to_quaternion();bone.matrix=Matrix.Translation(bone.head)@rotation.to_matrix().to_4x4();bpy.context.view_layer.update()
 aim('spine_02',(0,-.12,1))
 for side,suffix in [(1,'l'),(-1,'r')]:
  aim('thigh_'+suffix,(side*.19,-1,-.04));aim('calf_'+suffix,(side*.12,-1,-.22));aim('foot_'+suffix,(0,-.75,.65))
  aim('upperarm_'+suffix,(side*.13,-.4,-.92));aim('lowerarm_'+suffix,(-side*.22,-.9,.26))
 floor_pose=pose_snapshot()
 # The cape has its own seated drape morph, independent of collision/story roots.
 if ROLE!='sam':
  cape.shape_key_add(name='Basis');seated=cape.shape_key_add(name='SeatedDrape')
  for i,v in enumerate(cape.data.vertices):
   t=(i//(cols+1))/rows if rows else 0
   # For all garment vertices, lift the lower hem behind the seated hips.
   if v.co.z<.8:
    amount=max(0,min(1,(.8-v.co.z)/.5));seated.data[i].co.y+=amount*.2;seated.data[i].co.z+=amount*.2
 def author_pose_clip(name,keys):
  old=next((t for t in rig.animation_data.nla_tracks if t.name==name),None)
  if old:rig.animation_data.nla_tracks.remove(old)
  action=bpy.data.actions.new(name+' authored');rig.animation_data.action=action
  for frame,pose in keys:
   for bone in rig.pose.bones:
    location,rotation,scale=pose[bone.name];bone.rotation_mode='QUATERNION';bone.location=location;bone.rotation_quaternion=rotation;bone.scale=scale
    for field in ['location','rotation_quaternion','scale']:bone.keyframe_insert(data_path=field,frame=frame,group=bone.name)
  track=rig.animation_data.nla_tracks.new();track.name=name;strip=track.strips.new(name,0,action);strip.action_slot=action.slots[0];track.mute=True;rig.animation_data.action=None
 author_pose_clip('Sit_Floor_Idle',[(0,floor_pose),(48,floor_pose)])
 author_pose_clip('Sit_Floor_Down',[(0,standing),(16,crouching),(34,floor_pose)])
 author_pose_clip('Sit_Floor_StandUp',[(0,floor_pose),(17,crouching),(34,standing)])

 # Bake a small corrective pelvis lift from the deformed foot vertices during
 # entering/leaving the floor. Never move the gameplay collision/root to hide it.
 for clip in ['Sit_Floor_Down','Sit_Floor_StandUp']:
  strip=next(t.strips[0] for t in rig.animation_data.nla_tracks if t.name==clip);rig.animation_data.action=strip.action;rig.animation_data.action_slot=strip.action_slot
  for frame in range(35):
   bpy.context.scene.frame_set(frame);bpy.context.view_layer.update();evaluated=feet.evaluated_get(bpy.context.evaluated_depsgraph_get());data=evaluated.to_mesh();low=min((evaluated.matrix_world@v.co).z for v in data.vertices);evaluated.to_mesh_clear()
   if low<0:
    pelvis=rig.pose.bones['pelvis'];matrix=pelvis.matrix.copy();matrix.translation.z+=-low+.002;pelvis.matrix=matrix;pelvis.keyframe_insert(data_path='location',frame=frame)
  rig.animation_data.action=None
 # Standing -> small crouch -> lifted knees -> seated bench, for a real boarding
 # action synchronized with the cart path. Root travel remains in arrival.mjs.
 rig.animation_data.action=source_tracks['Jump_Loop'].action;rig.animation_data.action_slot=source_tracks['Jump_Loop'].action_slot;bpy.context.scene.frame_set(12);bpy.context.view_layer.update();jumping=pose_snapshot()
 chair_strip=next(t.strips[0] for t in rig.animation_data.nla_tracks if t.name=='Sit_Chair_Idle');rig.animation_data.action=chair_strip.action;rig.animation_data.action_slot=chair_strip.action_slot;bpy.context.scene.frame_set(12);bpy.context.view_layer.update();chair_pose=pose_snapshot();rig.animation_data.action=None
 author_pose_clip('Board',[(0,standing),(12,crouching),(27,jumping),(42,chair_pose),(53,chair_pose)])


for o in created:
 if o.name in bpy.data.objects:bpy.data.objects.remove(o,do_unlink=True)
# Inspect the real idle deformation before export.
idle=next(t.strips[0] for t in rig.animation_data.nla_tracks if t.name=='Idle')
rig.animation_data.action=idle.action;rig.animation_data.action_slot=idle.action_slot
scene=bpy.context.scene;scene.frame_set(12)
if WIZARD:
 bpy.context.view_layer.update();staff.location=rig.pose.bones['hand_l'].matrix.translation
# Merge compatible skinned pieces once, retaining separate facial/cape morphs.
# The one shared rig and authored material/UV boundaries remain intact.
for o in meshes:
 if o.data.uv_layers:o.data.uv_layers.active.name='UVMap'
merge=[o for o in meshes if o.vertex_groups and not o.data.shape_keys]
if len(merge)>1:
 bpy.ops.object.select_all(action='DESELECT')
 for o in merge:o.select_set(True)
 bpy.context.view_layer.objects.active=merge[0];bpy.ops.object.join();joined=bpy.context.object;joined.name=ROLE+' skinned wardrobe and hair'
 meshes=[o for o in meshes if o not in merge]+[joined]

# Export selected actors only, embedding all current authored/downsized textures.
bpy.ops.object.select_all(action='DESELECT');rig.select_set(True)
for o in meshes:o.select_set(True)
rig.animation_data.action=None
for t in rig.animation_data.nla_tracks:t.mute=False
bpy.ops.export_scene.gltf(filepath=str(OUT/(ROLE+'-natural.glb')),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='NLA_TRACKS',export_force_sampling=True,export_skins=True,export_morph=True,export_morph_normal=False,export_morph_animation=False,export_yup=True)
for t in rig.animation_data.nla_tracks:t.mute=True
rig.animation_data.action=idle.action;rig.animation_data.action_slot=idle.action_slot;scene.frame_set(12)

# Render a transparent-free asset inspection, never a substitute for game evidence.
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=True
scene.world.color=(.15,.15,.15);scene.view_settings.view_transform='AgX'
scene.render.resolution_x=800;scene.render.resolution_y=800;scene.render.resolution_percentage=100
bpy.ops.object.camera_add(location=(2.2,-4.2,2.25));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,1.12 if WIZARD else .83))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=2.65 if WIZARD else 2.05;scene.camera=camera
for pos,power,size in [((2,-3,4),420,4),((-3,-1,2),260,3),((1,2,3),350,2)]:
 bpy.ops.object.light_add(type='AREA',location=pos);l=bpy.context.object;l.data.energy=power;l.data.shape='DISK';l.data.size=size;l.rotation_euler=(Vector((0,0,.9))-l.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.015));floor=bpy.context.object;floor.name='inspection floor';mat=bpy.data.materials.new('inspection warm ground');mat.diffuse_color=(.17,.2,.15,1);floor.data.materials.append(mat)
scene.render.filepath=str(OUT/(ROLE+'-source-review.png'));bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/(ROLE+'-source-review.blend')))
print('CHARACTER_REVIEW',json.dumps({'vertices':sum(len(o.data.vertices) for o in meshes),'meshes':len(meshes),'rigBones':len(rig.data.bones),'output':str(OUT)}))
