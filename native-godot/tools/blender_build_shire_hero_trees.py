#!/usr/bin/env python3
"""Original editable botanical mesh kit for Chapter I.

These are newly authored modeled stems, crooked forks, branchlets and individual
leaf geometry, NOT primitive spheres/cones with renamed GLB extensions.
VISUAL-ONLY mood reference; no protected film scans, models or textures.
Blender 3.x / 4.x, using the standard glTF exporter.
"""
import bpy
import hashlib
import json
import math
import random
import struct
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "models"
EDIT = ROOT.parent / "blender-production" / "shire_botanical_hero"
OUT.mkdir(parents=True, exist_ok=True)
EDIT.mkdir(parents=True, exist_ok=True)
SEED = 2026101709

SPECIES = {
    "oak": {"height": 7.7, "spread": 3.2, "limbs": 16, "leaf_count": 31,
            "leaf_length": .48, "leaf_width": .20, "trunk": .44, "drop": .10,
            "colors": [(0.22,.36,.17),(.29,.45,.19),(.36,.48,.24),(.39,.53,.27)]},
    "beech": {"height": 9.1, "spread": 2.6, "limbs": 20, "leaf_count": 27,
              "leaf_length": .37, "leaf_width": .15, "trunk": .34, "drop": .02,
              "colors": [(0.28,.38,.17),(.39,.49,.22),(.46,.53,.28),(.33,.43,.19)]},
    "alder": {"height": 6.5, "spread": 2.6, "limbs": 15, "leaf_count": 28,
              "leaf_length": .35, "leaf_width": .16, "trunk": .34, "drop": .26,
              "colors": [(0.20,.37,.25),(.31,.48,.31),(.37,.52,.34),(.24,.42,.28)]},
    "willow": {"height": 8.2, "spread": 3.45, "limbs": 20, "leaf_count": 32,
               "leaf_length": .42, "leaf_width": .10, "trunk": .43, "drop": 1.25,
               "colors": [(0.32,.47,.20),(.46,.55,.28),(.49,.58,.31),(.34,.44,.18)]},
}

def material(name, color, roughness=0.95):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = 0.0
    m.diffuse_color = (*color, 1.0)
    m.use_backface_culling = False
    return m

class BotanicalMesh:
    def __init__(self, materials):
        self.vertices = []
        self.faces = []
        self.material_ids = []
        self.materials = materials

    def face(self, indices, matid):
        self.faces.append(tuple(indices))
        self.material_ids.append(matid)

    def tube(self, points, radii, matid=0, sides=8):
        """Several elliptical rings around a curved axis, tapered all the way."""
        offset = len(self.vertices)
        if len(points) != len(radii):
            raise ValueError("tube ring mismatch")
        for i, center in enumerate(points):
            tangent = ((points[min(len(points)-1, i+1)] -
                        points[max(0, i-1)])).normalized()
            side = tangent.cross(Vector((0,1,0)))
            if side.length < .02:
                side = tangent.cross(Vector((1,0,0)))
            side.normalize()
            other = tangent.cross(side).normalized()
            for ring in range(sides):
                angle = 2*math.pi*ring/sides
                wobble = 1.0 + .058*math.sin(5*angle + i*.9)
                self.vertices.append(tuple(center + radii[i]*wobble*
                                           (math.cos(angle)*side + math.sin(angle)*other)))
        for ring in range(len(points)-1):
            for s in range(sides):
                a = offset + ring*sides + s
                b = offset + ring*sides + (s+1)%sides
                c = b + sides
                d = a + sides
                self.face((a,b,c),matid)
                self.face((a,c,d),matid)
        self.face(tuple(offset + i for i in range(sides-1,-1,-1)),matid)

    def leaf(self, center, axis, length, width, matid):
        """Five outline vertices; a folded, asymmetric leaf, not a flat quad."""
        axis = axis.normalized()
        side = axis.cross(Vector((0.0,0.0,1.0)))
        if side.length < .03:
            side = axis.cross(Vector((0.0,1.0,0.0)))
        side.normalize()
        origin = len(self.vertices)
        base = center-axis*length*.45
        tip = center+axis*length*.55
        mid = center+Vector((0.0,0.0,length*.06))
        shape = [
            base,
            center-axis*length*.08+side*width*.46,
            mid+side*width*.10,
            center-axis*length*.06-side*width*.57,
            tip,
        ]
        self.vertices.extend(tuple(v) for v in shape)
        self.face((origin,origin+1,origin+2),matid)
        self.face((origin,origin+2,origin+3),matid)
        self.face((origin+1,origin+4,origin+2),matid)
        self.face((origin+2,origin+4,origin+3),matid)

    def finish(self, name):
        mesh = bpy.data.meshes.new(name + "_authored_mesh")
        mesh.from_pydata(self.vertices, [], self.faces)
        mesh.update()
        for m in self.materials:
            mesh.materials.append(m)
        for face, slot in zip(mesh.polygons, self.material_ids):
            face.material_index = slot
            face.use_smooth = len(face.vertices)==3
        ob = bpy.data.objects.new(name + "_trunks_branches_individual_leaves", mesh)
        bpy.context.collection.objects.link(ob)
        return ob

def build(species, data):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat)
    rng = random.Random(SEED + sum(map(ord,species))*13)
    bark = material("M_SHIRE_%s_BARK_ROUGH" % species, (.27,.20,.145) if species!="beech" else (.43,.39,.33))
    palette = [bark] + [material("M_SHIRE_%s_LEAF_%d"%(species,k),c) for k,c in enumerate(data["colors"])]
    mesh = BotanicalMesh(palette)
    h = data["height"]
    r = data["trunk"]
    trunk_points = []
    trunk_radii = []
    for i in range(10):
        t = i/9.0
        trunk_points.append(Vector((.14*math.sin(t*4),.10*math.sin(t*5.4),h*t*.84)))
        trunk_radii.append(max(.065, r*(1.0-t*.90)*(1.18 if i==0 else 1.0)))
    mesh.tube(trunk_points,trunk_radii,0,10)
    for i in range(data["limbs"]):
        fraction = i/max(1,data["limbs"]-1)
        trunk_t = .31+.62*fraction
        azimuth = i*2.39996+rng.uniform(-.19,.19)
        reach = data["spread"]*(.78-.32*fraction)*rng.uniform(.79,1.20)
        start = Vector((.14*math.sin(trunk_t*4),.10*math.sin(trunk_t*5.4),h*trunk_t*.84))
        radial = Vector((math.cos(azimuth),math.sin(azimuth),0.0))
        bend = Vector((radial.x*reach,radial.y*reach,
                       h*(.65+.24*fraction)-start.z-data["drop"]*.27))
        tip = start+bend
        points = [start,
                  start+bend*.28+Vector((0,0,.29)),
                  start+bend*.62+Vector((0,0,.16)),
                  tip]
        rad = r*(.36-.15*fraction)*rng.uniform(.9,1.1)
        mesh.tube(points,[rad,rad*.78,rad*.38,.023],0,6)
        # Soft orchard-style boughs: leaf distribution around the actual branches.
        for leaf in range(data["leaf_count"]):
            t = rng.uniform(.61,1.15)
            sideways = rng.uniform(-.7,.7)
            around = Vector((radial.y,-radial.x,0.0))*sideways
            point = start+bend*t+around+Vector((
                rng.uniform(-.35,.35),rng.uniform(-.35,.35),
                rng.uniform(-.65,.7)-data["drop"]*rng.random()))
            direction = Vector((rng.uniform(-1,1),rng.uniform(-1,1),
                                rng.uniform(-.5,.95)))
            if species=="willow":
                direction.z -= .8
            mesh.leaf(point,direction,
                      data["leaf_length"]*rng.uniform(.72,1.32),
                      data["leaf_width"]*rng.uniform(.72,1.38),
                      1+rng.randrange(4))
    obj = mesh.finish("SM_SHIRE_%s_HERO" % species.upper())
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    blend_path = EDIT / ("shire_%s_hero.blend"%species)
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))
    glb_path = OUT / ("shire_hero_%s.glb"%species)
    bpy.ops.export_scene.gltf(filepath=str(glb_path), export_format="GLB",
                              use_selection=True, export_apply=True)
    payload = glb_path.read_bytes()
    if payload[:4] != b"glTF" or len(payload) < 200:
        raise RuntimeError("Invalid glTF export: "+species)
    gltf_length = struct.unpack_from("<I",payload,8)[0]
    if gltf_length != len(payload):
        raise RuntimeError("Truncated export: "+species)
    metadata = {
       "asset":glb_path.name,
       "sha256":hashlib.sha256(payload).hexdigest(),
       "license":"ORIGINAL-GAME; authored for this project",
       "reference_provenance":"VISUAL-ONLY; no third-party geometry",
       "source_blend":blend_path.name,
       "species":species,
       "vertices":len(mesh.vertices),
       "triangles":len(mesh.faces),
       "leaf_cards":data["limbs"]*data["leaf_count"],
       "generator":"tools/blender_build_shire_hero_trees.py",
       "seed":SEED,
       "status":"REVIEW",
    }
    (OUT/("shire_hero_%s.source.json"%species)).write_text(
        json.dumps(metadata,sort_keys=True,indent=2)+"\n",encoding="utf-8")
    print("PRODUCED",species,metadata["triangles"],"triangles",len(payload),"GLB bytes")

for species,params in SPECIES.items():
    build(species,params)
print("PASS: four original branch-and-leaf Blender source models and GLBs")
