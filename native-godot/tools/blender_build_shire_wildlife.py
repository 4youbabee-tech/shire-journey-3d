#!/usr/bin/env python3
"""Create two original animated Shire wildlife GLBs, with editable Blender scenes.
Creature work is an artistic candidate, not scanned fur or final animal rigging.
"""
import bpy, math, json, hashlib, random
from pathlib import Path
R=Path(__file__).resolve().parents[1]
OUT=R/"assets/models"
EDIT=R.parent/"blender-production/shire_wildlife"
OUT.mkdir(parents=True,exist_ok=True)
EDIT.mkdir(parents=True,exist_ok=True)

def mat(name,rgb,rough=.82,metal=0):
    m=bpy.data.materials.new(name)
    m.use_nodes=True
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*rgb,1)
    p.inputs["Roughness"].default_value=rough
    p.inputs["Metallic"].default_value=metal
    return m

def init():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for m in list(bpy.data.materials): bpy.data.materials.remove(m)
    return {"body":mat("warm_feather_or_fur",(.57,.40,.27)),
        "head":mat("pale_neck",(.80,.67,.48)),
        "wing":mat("wing_and_tail",( .38,.25,.16)),
        "eye":mat("dark_eyes",(.06,.06,.052),.21),
        "beak":mat("golden_beak_or_nose",(.79,.47,.16)),
        "red":mat("hen_comb",( .67,.12,.10)),
        "paw":mat("feet_and_claws",( .74,.41,.18)),
        "ear":mat("soft_ear_lining",(.76,.49,.49)),
        "white":mat("soft_white_down",(.90,.85,.73))}
def finish(obj,name,material):
    obj.name=name
    obj.data.materials.append(material)
    return obj
def sphere(name,pos,scale,material,segments=16):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=9,radius=1,location=pos)
    o=bpy.context.object
    o.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(o,name,material)
def cone(name,pos,radius,depth,material):
    bpy.ops.mesh.primitive_cone_add(vertices=12,radius1=radius,radius2=0,depth=depth,location=pos)
    return finish(bpy.context.object,name,material)
def featherfan(origin,material,count=9):
    for i in range(count):
        a=(i-(count-1)/2)*.12
        p=(origin[0]+a*.75,origin[1]+.015*(i%2),origin[2]+i*.013)
        o=sphere("Feather_with_individual_silhouette",p,(.035,.12,.24),material,10)
        o.rotation_euler[0]=a
def key_loop(obj, axis, distance):
    # A genuine glTF baked animation channel. The world simulation moves the animal.
    base=list(obj.rotation_euler)
    for frame,delta in ((1,0.0),(13,distance),(25,0.0)):
        rotated=base[:]
        rotated[axis]=delta
        obj.rotation_euler=rotated
        obj.keyframe_insert(data_path="rotation_euler",frame=frame)
    obj.rotation_euler=base
    if obj.animation_data and obj.animation_data.action:
        obj.animation_data.action.name="Breathe_or_flap"
def hen(m):
    sphere("Feather_body",(0,0,.28),(.26,.34,.28),m["body"],24)
    sphere("Pale_neck",(0,-.24,.46),(.16,.20,.19),m["head"])
    sphere("Head",(0,-.32,.60),(.16,.15,.14),m["head"])
    sphere("Beak",(0,-.49,.58),(.075,.12,.05),m["beak"])
    sphere("Comb",(0,-.32,.76),(.045,.12,.10),m["red"])
    for side in (-1,1):
        sphere("Alive_eye",(side*.14,-.44,.64),(.027,.026,.026),m["eye"],12)
        wing=sphere("Wing_flap_animated",(side*.245,-.05,.36),
                    (.085,.23,.16),m["wing"],16)
        key_loop(wing,1,side*.22)
        for digit in (-1,0,1):
            sphere("Chicken_toe",(side*.14+digit*.045,-.25,.038),(.025,.12,.025),m["paw"],10)
        sphere("Slender_scaled_leg",(side*.13,-.14,.12),(.034,.039,.13),m["paw"],10)
    featherfan((0,.27,.41),m["wing"],11)
def rabbit(m):
    sphere("Rabbit_body",(0,0,.31),(.28,.43,.26),m["body"],24)
    sphere("Rabbit_head",(0,-.36,.39),(.23,.22,.22),m["head"],20)
    sphere("Bunny_nose",(0,-.57,.35),(.06,.045,.045),m["ear"],12)
    sphere("White_tail",(0,.40,.37),(.12,.11,.13),m["white"],12)
    for side in (-1,1):
        sphere("Rabbit_eyes",(side*.20,-.51,.43),(.034,.03,.03),m["eye"],12)
        sphere("Rabbit_back_haunch",(side*.20,.20,.17),(.17,.17,.17),m["body"])
        sphere("Rabbit_front_paw",(side*.18,-.27,.08),(.088,.13,.08),m["white"])
        ear=sphere("Ears_sway_with_breath",(side*.12,-.35,.72),(.07,.09,.30),m["head"])
        key_loop(ear,1,side*.10)
        sphere("Pink_ear_interior",(side*.13,-.45,.73),(.035,.035,.24),m["ear"])
    for idx in range(6):
        a=(idx-2.5)*.09
        sphere("Whisker",(a,-.58,.31),(.009,.10,.009),m["white"],10)

def generate(name,builder):
    palette=init()
    builder(palette)
    frames=sum(o.type=="MESH" for o in bpy.context.scene.objects)
    animated={o.name for o in bpy.context.scene.objects if o.animation_data is not None}
    for material in list(bpy.data.materials):
        objects=[o for o in bpy.context.scene.objects if o.type=="MESH" and
                 o.data.materials and o.data.materials[0]==material and o.name not in animated]
        if len(objects)<2:continue
        bpy.ops.object.select_all(action="DESELECT")
        for ob in objects:ob.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        bpy.ops.object.join()
        bpy.context.object.name="Batched_"+material.name
    bpy.context.scene.frame_start=1
    bpy.context.scene.frame_end=25
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.wm.save_as_mainfile(filepath=str(EDIT/(name+".blend")))
    glb=OUT/(name+".glb")
    bpy.ops.export_scene.gltf(filepath=str(glb),export_format="GLB",
        export_animations=True,export_yup=True,use_selection=True,export_apply=True)
    blob=glb.read_bytes()
    meta={"asset":name,"origin":"ORIGINAL-GAME","status":"ANIMATED_ART_CANDIDATE_NOT_FINAL",
          "license":"Blender-authored geometry, no external scans or model likenesses",
          "sha256":hashlib.sha256(blob).hexdigest(),"bytes":len(blob),
          "authored_parts":frames,"optimized_scene_meshes":sum(o.type=="MESH" for o in bpy.context.scene.objects),
          "blender_source":"blender-production/shire_wildlife/"+name+".blend"}
    (OUT/(name+".source.json")).write_text(json.dumps(meta,indent=2)+"\n")
    print("WILDLIFE GLB",name,meta["bytes"],meta["optimized_scene_meshes"])

generate("shire_hen_animated",hen)
generate("shire_rabbit_animated",rabbit)
