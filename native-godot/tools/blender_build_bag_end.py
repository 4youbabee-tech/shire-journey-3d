#!/usr/bin/env python3
"""ORIGINAL-GAME Bag End portal. Blender-generated editable .blend + PBR glTF GLB."""
import bpy, math, random, json, hashlib
from pathlib import Path
out=Path(__file__).resolve().parents[1]/"assets/models"
out.mkdir(parents=True,exist_ok=True)
random.seed(3018)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
def mat(name,c,r=.8,m=0,glow=0):
    a=bpy.data.materials.new(name);a.use_nodes=True
    n=a.node_tree.nodes.get("Principled BSDF")
    n.inputs["Base Color"].default_value=(*c,1)
    n.inputs["Roughness"].default_value=r
    n.inputs["Metallic"].default_value=m
    if glow:
        color_socket = "Emission Color" if "Emission Color" in n.inputs else "Emission"
        n.inputs[color_socket].default_value=(*c,1)
        if "Emission Strength" in n.inputs:
            n.inputs["Emission Strength"].default_value=glow
    return a
stones=[mat("quarried_limestone_%s"%i,c,.94) for i,c in enumerate(
    [(.56,.53,.45),(.67,.62,.52),(.73,.69,.57),(.50,.49,.42)])]
wood=mat("aged_carved_oak",(.35,.23,.13),.76)
paint=mat("painted_sage_wood",(.27,.40,.23),.76)
iron=mat("wrought_iron",(.12,.12,.10),.52,.73)
bronze=mat("aged_brass",(.61,.46,.21),.35,.67)
glass=mat("lit_amber_glass",(.85,.56,.30),.34,0,.22)
leaves=[mat("ivy_%d"%i,c,.82) for i,c in enumerate(
    [(.13,.28,.13),(.20,.34,.14),(.27,.40,.16)])]
img=bpy.data.images.new("authored_wood_grain_albedo",width=256,height=256,alpha=True)
pix=[]
for y in range(256):
    for x in range(256):
        g=.94+.07*math.sin(.14*x+math.sin(.05*y))+.025*math.sin(.4*x)
        pix.extend((.27*g,.40*g,.23*g,1))
img.pixels.foreach_set(pix);img.pack()
node=paint.node_tree.nodes.new("ShaderNodeTexImage");node.image=img
paint.node_tree.links.new(node.outputs["Color"],
    paint.node_tree.nodes["Principled BSDF"].inputs["Base Color"])
def finish(obj,name,material,bevel=0):
    obj.name=name;obj.data.materials.append(material)
    if bevel:
        b=obj.modifiers.new("soft_carved_edges","BEVEL")
        b.width=bevel;b.segments=2
    return obj
def box(name,pos,size,material,bevel=.015):
    bpy.ops.mesh.primitive_cube_add(size=1,location=pos)
    o=bpy.context.object;o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(o,name,material,bevel)
def disk(name,x,y,z,r,d,material,v=64):
    bpy.ops.mesh.primitive_cylinder_add(vertices=v,radius=r,depth=d,
        location=(x,y,z),rotation=(math.pi/2,0,0))
    return finish(bpy.context.object,name,material)
def ring(name,x,y,z,r,t,material):
    bpy.ops.mesh.primitive_torus_add(major_segments=64,minor_segments=8,
        major_radius=r,minor_radius=t,location=(x,y,z),rotation=(math.pi/2,0,0))
    return finish(bpy.context.object,name,material)
def stone(i):
    a=math.tau*i/36+.008;b=a+math.tau/36*.91
    r1=1.14;r2=1.38+random.uniform(-.02,.02)
    def p(r,t,z):return (r*math.sin(t),1.15+r*math.cos(t),z)
    v=[p(r1,a,-4.36),p(r2,a,-4.36),p(r2,b,-4.36),p(r1,b,-4.36),
       p(r1,a,-4.04),p(r2,a,-4.04),p(r2,b,-4.04),p(r1,b,-4.04)]
    mesh=bpy.data.meshes.new("quarried_stone")
    mesh.from_pydata(v,[],[(0,1,2,3),(7,6,5,4),(0,4,5,1),
        (1,5,6,2),(2,6,7,3),(3,7,4,0)]);mesh.update()
    o=bpy.data.objects.new("Cut_arch_stone_%d"%i,mesh)
    bpy.context.collection.objects.link(o);finish(o,o.name,stones[i%4],.007)
disk("Carved_sage_round_door",0,1.15,-4.21,1.10,.14,paint,80)
ring("Outer_oak_bead",0,1.15,-4.305,1.04,.055,wood)
ring("Wrought_iron_strap",0,1.15,-4.32,.96,.017,iron)
for i in range(36):stone(i)
for i in range(30):
    a=math.tau*i/30
    disk("Rivet_%d"%i,.926*math.sin(a),
        1.15+.926*math.cos(a),-4.342,.026,.026,bronze,8)
for i,x in enumerate([-.75,-.49,-.23,.05,.31,.58]):
    box("Hand_hewn_plank_seam_%d"%i,(x,1.15,-4.295),
        (.016,2*math.sqrt(max(.01,.99-x*x)),.016),wood,.002)
for y in (.57,1.76):
    box("Door_wooden_crossbrace",(0,y,-4.333),(1.48,.08,.065),wood)
disk("Knob_brass_backplate",.52,1.17,-4.37,.12,.049,bronze,24)
disk("Carved_knob",.52,1.17,-4.424,.085,.081,bronze,24)
ring("Forged_ring_pull",-.44,1.06,-4.353,.13,.028,iron)
for i in range(12):
    box("Threshold_stone_%d"%i,(-1.43+i*.26,.05,-4.90),
        (.247,.12,.52),stones[(i*3)%4],.029)
for side in (-1,1):
    x=2.4*side
    disk("Amber_round_window_%s"%side,x,1.35,-3.57,.65,.09,glass,48)
    ring("Glazed_oak_frame_%s"%side,x,1.35,-3.637,.688,.068,wood)
    ring("Window_iron_weatherstrip_%s"%side,x,1.35,-3.65,.577,.025,iron)
    box("Mullion_%s"%side,(x,1.35,-3.675),(.075,1.22,.085),wood)
    box("Transom_%s"%side,(x,1.35,-3.684),(1.23,.076,.08),wood)
    for d in (-1,1):
        sx=x+d*.92
        panel=box("Handcarved_shutter_%s_%s"%(side,d),
             (sx,1.35,-3.60),(.39,1.46,.15),wood,.04)
        panel.rotation_euler[2]=.07*d
        for j in range(4):
            box("Shutter_iron_tack",(sx,1.02+j*.20,-3.686),
                (.032,.032,.024),iron,.002)
    box("Stone_window_sill_%s"%side,(x,.64,-3.67),
        (1.56,.17,.34),stones[(side+2)%4],.029)
for i in range(105):
    a=random.uniform(.06,math.pi*1.7);r=random.uniform(1.5,1.88)
    x=r*math.sin(a);y=1.15+r*math.cos(a)
    if y<.2:continue
    z=-4.20-random.random()*.07;size=random.uniform(.06,.16)
    mesh=bpy.data.meshes.new("ivy_leaf")
    mesh.from_pydata([(x,y+size,z),(x+size*.44,y,z-.012),
        (x,y-size*.7,z),(x-size*.43,y,z-.012),(x,y,z-.05)],[],
        [(0,1,4),(1,2,4),(2,3,4),(3,0,4)]);mesh.update()
    o=bpy.data.objects.new("Ivy_leaf_%d"%i,mesh)
    bpy.context.collection.objects.link(o)
    finish(o,o.name,leaves[i%3])
box("Forge_wall_lantern",(1.60,2.11,-4.26),(.29,.43,.09),iron,.025)
disk("Lantern_amber_pane",1.60,2.11,-4.40,.11,.18,glass,16)
# Combine objects sharing materials to avoid hundreds of additional draw calls.
for material in list(bpy.data.materials):
    group=[o for o in bpy.context.scene.objects
        if o.type=="MESH" and o.data.materials and o.data.materials[0]==material]
    if not group:continue
    bpy.ops.object.select_all(action="DESELECT")
    for obj in group:obj.select_set(True)
    bpy.context.view_layer.objects.active=group[0]
    bpy.ops.object.convert(target="MESH");bpy.ops.object.join()
    bpy.context.object.name="BagEndCrafted_"+material.name
bpy.ops.object.select_all(action="SELECT")
bpy.ops.wm.save_as_mainfile(filepath=str(out/"bag_end_crafted_portal.blend"))
bpy.ops.export_scene.gltf(filepath=str(out/"bag_end_crafted_portal.glb"),
    export_format="GLB",use_selection=True,export_apply=True,export_yup=True)
payload=(out/"bag_end_crafted_portal.glb").read_bytes()
(out/"bag_end_crafted_portal.source.json").write_text(json.dumps({
    "origin":"ORIGINAL-GAME","state":"CANDIDATE_NOT_FINAL",
    "generator":"tools/blender_build_bag_end.py",
    "license":"original authored geometry and original baked texture",
    "bytes":len(payload),"sha256":hashlib.sha256(payload).hexdigest()
},indent=2)+"\n")
print("BAG END GLB",len(payload),hashlib.sha256(payload).hexdigest())
