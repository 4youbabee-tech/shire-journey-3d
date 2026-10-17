#!/usr/bin/env python3
"""Produce an editable, newly modeled masonry Hobbiton bridge for the real Godot scene.
No film scans or imported copyrighted assets. Blender 3/4 -> glTF 2.0 GLB.
Five original stone and timber PBR surfaces share small embedded albedo maps.
"""
import bpy, math, random, json, hashlib, struct
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"assets/models"
EDIT=ROOT.parent/"blender-production/shire_landmarks"
OUT.mkdir(parents=True,exist_ok=True)
EDIT.mkdir(parents=True,exist_ok=True)
random.seed(2026101718)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for mat in list(bpy.data.materials): bpy.data.materials.remove(mat)
def texture(name,base,seed,wood=False):
    from math import sin, cos
    rng=random.Random(seed)
    variation=[rng.uniform(-.12,.12) for _ in range(40)]
    image=bpy.data.images.new(name, width=256,height=256,alpha=True)
    p=[]
    for y in range(256):
        for x in range(256):
            if wood:
                noise=.86+.105*sin(x*.08+sin(y*.031)*3.0)+.07*sin(x*.24)+variation[(x//7)%40]*.25
            else:
                mort=(x%59<2 or y%47<2)
                noise=.91+.06*sin(x*.12+y*.08)+.05*cos(y*.22-x*.035)+variation[(x//7+y//13)%40]
                if mort: noise*=.69
            p.extend((max(.02,min(1.,base[0]*noise)),
                      max(.02,min(1.,base[1]*noise)),
                      max(.02,min(1.,base[2]*noise)),1.0))
    image.pixels.foreach_set(p)
    image.pack()
    return image
def material(name,base,seed,wood=False):
    m=bpy.data.materials.new(name)
    m.diffuse_color=(*base,1.)
    m.use_nodes=True
    s=m.node_tree.nodes.get("Principled BSDF")
    s.inputs["Roughness"].default_value=.87 if wood else .95
    s.inputs["Metallic"].default_value=.0
    tex=m.node_tree.nodes.new("ShaderNodeTexImage")
    tex.image=texture(name+"_unique_painted_atlas",base,seed,wood)
    m.node_tree.links.new(tex.outputs["Color"],s.inputs["Base Color"])
    return m
mats={
  "warm":material("Stone_warm_hand_cut",(.70,.66,.55),13),
  "mid":material("Stone_grey_limestone",(.57,.55,.49),21),
  "moss":material("Stone_green_moss",(.48,.53,.43),33),
  "wood":material("Oak_weathered_beams",(.53,.39,.27),55,True),
  "mortar":material("Lime_mortar_hand_mixed",(.64,.59,.51),63),
  "iron":material("Hand_wrought_iron",(.17,.18,.16),77)
}
def cuboid(name,loc,size,kind,bevel=.035,rotation=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    obj=bpy.context.object
    obj.name=name
    obj.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    obj.rotation_euler[2]=rotation
    obj.data.materials.append(mats[kind])
    if bevel:
        beveler=obj.modifiers.new("hand_chipped_bevel","BEVEL")
        beveler.width=bevel
        beveler.segments=2
    return obj
def stone(i,x,y,z,dim):
    kind=("warm","mid","moss")[i%3]
    cuboid("Hand_set_limestone_%03d"%i,(x,y,z),dim,kind,
           .026 if min(dim)>.22 else .009,random.uniform(-.017,.017))
# Blender Z is Godot Y; the bridge goes across local X with two roadside parapets.
stone_id=0
for side in (-1,1):
    lateral=side*2.08
    # Two thin longitudinal bands create a readable stone arcade silhouette.
    for col in range(30):
        x=-6.83+(col+.5)*.456
        radial=abs(x)
        # Opening stays actually open under the walkway, with high central arch.
        inside= .08+.65*math.sqrt(max(0.,1.-(radial/4.25)**2)) if radial<4.25 else -.30
        for course in range(3):
            lower=inside+course*.26
            if lower>=.69: continue
            rise=min(.26,.69-lower)
            stone(stone_id,x,lateral,lower+rise*.5,(.445,.49,rise-.006))
            stone_id+=1
    # The segmented pointed arch is built from radial wedge stones, not a slab.
    for k in range(25):
        a=math.pi*float(k+.5)/25
        px=-4.22*math.cos(a)
        pz=.05+.67*math.sin(a)
        stone(stone_id,px,lateral,pz,(.50,.52,.21))
        stone_id+=1
    # Rising stone parapet with lime mortar capstones.
    for col in range(23):
        x=-6.67+(col+.5)*(.58)
        stone(stone_id,x,lateral,.94,(.57,.39,.56))
        stone_id+=1
        if col%3==0:
            stone(stone_id,x,lateral,1.29,(.55,.45,.19))
            stone_id+=1
    cuboid("Wide_handplaned_bridge_capstone",(0,lateral,1.54),
           (13.94,.60,.18),"warm",.046)
    for x in (-6.3,-3.1,0,3.1,6.3):
        cuboid("Stone_parapet_low_relief_pier",(x,lateral,1.17),
            (.47,.57,.89),"mid",.042)
# Full paving (treads are very close to the existing game bridge's top).
for row in range(6):
    for col in range(24):
        x=-6.71+col*.58+(.24 if row%2 else 0)
        y=-1.72+row*.68
        if abs(x)>6.88: continue
        stone(stone_id,x,y,.735,(.55,.64,.12))
        stone_id+=1
# Solid abutments, exposed foundation and drainage framing.
for x in (-6.46,6.46):
    for side in (-1,1):
        for layer in range(5):
            z=-.32+layer*.22
            stone(stone_id,x,side*2.08,z,(1.13,1.12,.20))
            stone_id+=1
    cuboid("Tread_edge_curved_drain", (x,0,.75),(.35,4.2,.16),"moss",.027)
# Small hand-forged lamp brackets do not generate expensive runtime light.
for x in (-5.8,5.8):
    for side in (-1,1):
        cuboid("Wrought_lantern_buttress",(x,side*2.08,1.72),
             (.11,.12,.47),"iron",.012)
        cuboid("Timber_mortise_lantern",(x,side*2.08,2.03),
             (.31,.30,.35),"wood",.035)
# Consolidate each material into one real mesh: cheap for low-VRAM Windows.
authored=sum(o.type=="MESH" for o in bpy.context.scene.objects)
for mat in mats.values():
    group=[o for o in bpy.context.scene.objects if o.type=="MESH" and o.active_material==mat]
    if not group: continue
    bpy.ops.object.select_all(action="DESELECT")
    for obj in group:obj.select_set(True)
    bpy.context.view_layer.objects.active=group[0]
    bpy.ops.object.convert(target="MESH")
    bpy.ops.object.join()
    bpy.context.object.name="StoneBridge_"+mat.name
bpy.ops.object.select_all(action="SELECT")
bpy.ops.wm.save_as_mainfile(filepath=str(EDIT/"stone_bridge_hero.blend"))
dest=OUT/"shire_stone_bridge_hero.glb"
bpy.ops.export_scene.gltf(filepath=str(dest),export_format="GLB",use_selection=True,export_apply=True)
raw=dest.read_bytes()
if raw[:4]!=b"glTF" or struct.unpack_from("<I",raw,8)[0]!=len(raw):
    raise RuntimeError("GLB damaged after Blender export")
meta={"asset":dest.name,"status":"ORIGINAL-GAME-PRODUCTION-CANDIDATE",
      "sha256":hashlib.sha256(raw).hexdigest(),"license":"ORIGINAL-GAME",
      "generator":"tools/blender_build_shire_bridge.py",
      "source_blend":"stone_bridge_hero.blend",
      "authored_individual_stones":stone_id,
      "original_mesh_objects":authored,
      "gpu_material_groups":sum(o.type=="MESH" for o in bpy.context.scene.objects),
      "bytes":len(raw),"architecture":"masonry arcade with open arch, independent voussoirs and stone paving"}
(OUT/"shire_stone_bridge_hero.source.json").write_text(json.dumps(meta,indent=2)+"\n")
print("PASS: EDITABLE-BLENDER-BRIDGE",stone_id,"hand-cut stones; groups",meta["gpu_material_groups"])
