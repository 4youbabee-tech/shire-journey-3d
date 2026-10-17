#!/usr/bin/env python3
"""Original Shire Blender district art: market, mill and feast, not film geometry."""
import bpy, math, json, hashlib
from pathlib import Path
from mathutils import Matrix
root=Path(__file__).resolve().parents[1]
assets=root/"assets/models"
blends=root.parent/"blender-production/shire_districts"
assets.mkdir(parents=True,exist_ok=True)
blends.mkdir(parents=True,exist_ok=True)

def material(name,rgb,rough=.83,metal=0.0,glow=0.0):
    m=bpy.data.materials.new(name);m.use_nodes=True
    s=m.node_tree.nodes.get("Principled BSDF")
    s.inputs["Base Color"].default_value=(*rgb,1)
    s.inputs["Roughness"].default_value=rough
    s.inputs["Metallic"].default_value=metal
    if glow:
        socket="Emission Color" if "Emission Color" in s.inputs else "Emission"
        s.inputs[socket].default_value=(*rgb,1)
        if "Emission Strength" in s.inputs:s.inputs["Emission Strength"].default_value=glow
    return m

def start():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for m in list(bpy.data.materials):bpy.data.materials.remove(m)
    wood=material("oak_grain",(.42,.27,.15))
    image=bpy.data.images.new("original_oak_albedo",width=128,height=128,alpha=True)
    pixels=[]
    for y in range(128):
        for x in range(128):
            k=.9+.08*math.sin(x*.19+math.sin(y*.05))
            pixels.extend((.42*k,.27*k,.15*k,1))
    image.pixels.foreach_set(pixels);image.pack()
    tex=wood.node_tree.nodes.new("ShaderNodeTexImage");tex.image=image
    wood.node_tree.links.new(tex.outputs["Color"],
        wood.node_tree.nodes["Principled BSDF"].inputs["Base Color"])
    return {"wood":wood,"plank":material("weathered_oak",(.53,.37,.22),.91),
    "iron":material("forged_iron",(.18,.18,.16),.5,.72),
    "stone":material("rough_stone",(.61,.56,.46),.95),
    "cloth":material("woven_linen",(.75,.67,.51),.94),
    "red":material("festival_madder_cloth",(.62,.20,.13),.94),
    "green":material("garden_green",(.21,.36,.13),.94),
    "bread":material("hand_baked_bread",(.67,.44,.21),.82),
    "apple":material("orchard_red_apples",(.66,.23,.14),.81),
    "brass":material("brass_trims",(.6,.42,.18),.4,.73),
    "glass":material("warm_lantern_glass",(.85,.56,.29),.31,0,.18)}

def finish(o,name,m,bevel=0):
    o.name=name;o.data.materials.append(m)
    if bevel:
        b=o.modifiers.new("small_hand_worn_edges","BEVEL")
        b.width=bevel;b.segments=2
    return o

def block(n,p,size,m,bevel=.012):
    bpy.ops.mesh.primitive_cube_add(size=1,location=p)
    o=bpy.context.object;o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(o,n,m,bevel)

def cyl(n,p,r,depth,m):
    bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=depth,location=p)
    return finish(bpy.context.object,n,m)

def ball(n,p,r,m):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=10,ring_count=6,radius=r,location=p)
    return finish(bpy.context.object,n,m)

def market(m):
    for x in (-1.4,1.4):
        for z in (-.9,.9):
            block("oak_market_leg",(x,.52,z),(.12,1.0,.12),m["wood"])
            block("awning_post",(x,2.2,z),(.10,3.3,.10),m["plank"])
    block("carved_counter",(0,1.09,0),(3.0,.19,2.0),m["wood"],.04)
    for x in (-1.03,0,1.03):
        block("striped_canvas_awning",(x,3.85,0),(1.06,.13,2.3),
              m["cloth"] if x==0 else m["red"])
    for i in range(24):
        x=-1.25+(i%8)*.35;z=-.72+(i//8)*.64
        ball("fresh_market_produce",(x,1.27,z),.135,
             m["apple"] if i%3==0 else m["green"] if i%3==1 else m["bread"])
    for x in (-1.2,1.2):
        cyl("stoneware_pot",(x,1.26,.7),.24,.3,m["stone"])
        for j in range(7):
            cyl("basket_woven_ring",(x,.24+j*.10,-1.35),.36-j*.012,.04,m["cloth"])
    for i in range(8):
        block("stacked_shipping_crate",(-1.3+i*.38,.21,1.42),(.34,.4,.50),m["plank"])

def mill(m):
    block("roof_ridge",(0,6.21,0),(.20,.21,9.1),m["wood"])
    for s in (-1,1):
        slab=block("pitched_mill_roof",(s*2.65,5.54,0),(5.85,.20,8.95),m["plank"],.04)
        slab.rotation_euler[2]=-.28 if s>0 else .28
        for row in range(14):
            z=-4.0+row*.62
            for col in range(9):
                x=s*(.35+col*.53)
                y=6.15-(col+.5)*.14
                tile=block("overlapping_oak_shingle",(x,y,z),(.52,.07,.66),
                     m["plank"] if (row+col)%3==0 else m["wood"])
                tile.rotation_euler[2]=-.28 if s>0 else .28
    for z in (-3.77,3.77):
        for x in (-3.0,-1.65,1.65,3.0):
            block("mill_aged_timbers",(x,2.0,z),(.18,4,.16),m["wood"])
        for y in (.9,2.1,3.4):
            block("mill_horizontal_beam",(0,y,z),(8.0,.13,.15),m["plank"])
    for i in range(5):
        z=-2.0+i*.85
        cyl("mill_storage_barrel",(-4.35,.55,z),.34,1.1,m["wood"])
        cyl("metal_cooper_hoop",(-4.35,.30,z),.36,.05,m["iron"])
        cyl("metal_cooper_hoop",(-4.35,.85,z),.36,.05,m["iron"])
    for i in range(5):
        ball("grain_sack",(4.0,.30,-2+i*.8),.34,m["cloth"])

def feast(m):
    block("rustic_feast_table",(0,.82,0),(3.45,.18,1.30),m["wood"],.04)
    block("linen_runner",(0,.93,0),(3.15,.025,.40),m["cloth"])
    for x in (-1.4,1.4):
        for z in (-.45,.45):
            block("oak_table_support",(x,.41,z),(.13,.82,.14),m["plank"])
    for z in (-.96,.96):
        block("picnic_bench",(0,.42,z),(3.10,.13,.35),m["wood"],.025)
        for x in (-1.28,1.28):
            block("bench_legs",(x,.20,z),(.12,.4,.12),m["plank"])
    for i in range(12):
        x=-1.30+(i%6)*.52;z=-.38+(i//6)*.75
        cyl("earthenware_plate",(x,.98,z),.18,.045,m["stone"])
        ball("fresh_baked_loaf",(x,1.09,z),.13,m["bread"])
    cyl("brass_harvest_bowl",(0,1.03,0),.30,.09,m["brass"])
    for i in range(5):
        ball("harvest_apples",(.13*math.cos(i*math.tau/5),1.15,
             .13*math.sin(i*math.tau/5)),.10,m["apple"])
    for z in (-1.5,1.5):
        for x in (-1.7,1.7):
            block("festival_pole",(x,1.60,z),(.08,3.2,.08),m["plank"])
        for i in range(9):
            x=-1.5+i*.37
            block("fabric_bunting",(x,3.07,z),(.18,.19,.04),
                 m["red"] if i%2 else m["green"])
    for x in (-1.6,1.6):
        cyl("lamp_base",(x,1.1,0),.09,.27,m["brass"])
        ball("amber_lantern",(x,1.28,0),.11,m["glass"])

def export(name,make):
    m=start()
    make(m)
    before=sum(o.type=="MESH" for o in bpy.context.scene.objects)
    # Convert original Godot XYZ (Y up) to Blender coordinates before glTF export.
    for o in list(bpy.context.scene.objects):
        if o.type!="MESH":continue
        o.data.transform(o.matrix_world)
        o.matrix_world=Matrix.Identity(4)
        for vert in o.data.vertices:
            p=vert.co.copy();vert.co=(p.x,-p.z,p.y)
    for mat in list(bpy.data.materials):
        meshes=[o for o in bpy.context.scene.objects
            if o.type=="MESH" and o.data.materials and o.data.materials[0]==mat]
        if not meshes:continue
        bpy.ops.object.select_all(action="DESELECT")
        for o in meshes:o.select_set(True)
        bpy.context.view_layer.objects.active=meshes[0]
        bpy.ops.object.convert(target="MESH")
        bpy.ops.object.join()
        bpy.context.object.name="Crafted_"+mat.name
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.wm.save_as_mainfile(filepath=str(blends/(name+".blend")))
    dest=assets/(name+".glb")
    bpy.ops.export_scene.gltf(filepath=str(dest),export_format="GLB",
        use_selection=True,export_apply=True,export_yup=True)
    content=dest.read_bytes()
    data={"asset":name,"origin":"ORIGINAL-GAME",
        "status":"CANDIDATE_NOT_FINAL",
        "generator":"tools/blender_build_shire_districts.py",
        "license":"original geometry, original painted albedo",
        "sha256":hashlib.sha256(content).hexdigest(),"bytes":len(content),
        "authored_meshes":before,
        "optimized_meshes":sum(o.type=="MESH" for o in bpy.context.scene.objects)}
    (assets/(name+".source.json")).write_text(json.dumps(data,indent=2)+"\n")
    print("PASS Blender export",name,data["bytes"],data["authored_meshes"])

for name,make in [("shire_market_craftwork",market),
                  ("shire_mill_craftwork",mill),
                  ("shire_feast_craftwork",feast)]:
    export(name,make)

# Every existing Blender CI run now authors nine individual domestic exteriors.
import runpy
runpy.run_path(str(root/"tools/blender_build_shire_facades.py"),run_name="__main__")
