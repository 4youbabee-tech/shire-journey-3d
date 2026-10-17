#!/usr/bin/env python3
"""Produce nine individual original-game Blender Shire exteriors (Godot Y-up)."""
import bpy,math,hashlib,json
from pathlib import Path
from mathutils import Matrix
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/"assets/models"
SOURCES=ROOT.parent/"blender-production/shire_districts"
ASSETS.mkdir(parents=True,exist_ok=True)
SOURCES.mkdir(parents=True,exist_ok=True)
# Nine genuinely different professions and original palettes; no film geometry.
HOMES={
    "bagshot_cottage":("letters",(.48,.31,.17),(.49,.64,.42)),
    "garden_cottage":("seedlings",(.43,.33,.20),(.45,.67,.38)),
    "hill_cottage":("baking",(.45,.29,.16),(.72,.61,.38)),
    "northern_cottage":("weaving",(.40,.28,.22),(.58,.51,.64)),
    "market_cottage":("market",(.48,.33,.17),(.73,.57,.30)),
    "west_row_cottage":("carpentry",(.43,.29,.17),(.66,.53,.33)),
    "west_grove_cottage":("herbs",(.43,.32,.20),(.47,.66,.39)),
    "longacre_cottage":("harvest",(.50,.34,.15),(.76,.62,.31)),
    "east_orchard_cottage":("orchard",(.48,.28,.17),(.73,.34,.25)),
}
def material(name,color,rough=.84,metal=0,emissive=0):
    m=bpy.data.materials.new(name)
    m.use_nodes=True
    node=m.node_tree.nodes.get("Principled BSDF")
    node.inputs["Base Color"].default_value=(*color,1)
    node.inputs["Roughness"].default_value=rough
    node.inputs["Metallic"].default_value=metal
    if emissive:
        s="Emission Color" if "Emission Color" in node.inputs else "Emission"
        node.inputs[s].default_value=(*color,1)
        if "Emission Strength" in node.inputs: node.inputs["Emission Strength"].default_value=emissive
    return m
def prepare(wood_color,accent):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for m in tuple(bpy.data.materials): bpy.data.materials.remove(m)
    materials={
        "wood":material("oak_grain_original",wood_color,.78),
        "oak":material("weathered_wood",(.53,.36,.22),.93),
        "stone":material("rounded_fieldstone",(.60,.58,.51),.96),
        "slate":material("roof_slate",(.42,.40,.35),.94),
        "iron":material("forged_iron",(.16,.17,.16),.56,.66),
        "brass":material("warm_brass",(.61,.45,.20),.42,.65),
        "pot":material("terracotta_pots",(.62,.37,.23),.94),
        "leaf":material("ivy_and_herbs",(.31,.52,.23),.93),
        "linen":material("handwoven_linen",(.78,.70,.55),.94),
        "accent":material("household_motif_color",accent,.89),
        "glass":material("amber_glass",(.92,.64,.36),.31,0,.22),
    }
    tex=bpy.data.images.new("OriginalHandPaintedOakAlbedo",width=128,height=128,alpha=True)
    pixels=[]
    for y in range(128):
        for x in range(128):
            v=.9+.07*math.sin(x*.24+math.sin(y*.049))+.025*math.sin(x*.92)
            pixels.extend((wood_color[0]*v,wood_color[1]*v,wood_color[2]*v,1.0))
    tex.pixels.foreach_set(pixels)
    tex.pack()
    shader=materials["wood"].node_tree.nodes.get("Principled BSDF")
    image=materials["wood"].node_tree.nodes.new("ShaderNodeTexImage")
    image.image=tex
    materials["wood"].node_tree.links.new(image.outputs["Color"],shader.inputs["Base Color"])
    return materials
def finish(name,mat,bevel=.0):
    ob=bpy.context.object
    ob.name=name
    ob.data.materials.append(mat)
    if bevel:
        modifier=ob.modifiers.new("hand_worn_edges","BEVEL")
        modifier.width=bevel
        modifier.segments=2
    return ob
def cube(name,p,d,m):
    bpy.ops.mesh.primitive_cube_add(size=1,location=p)
    ob=bpy.context.object
    ob.dimensions=d
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(name,m,.015)
def orb(name,p,r,m):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=9,ring_count=6,radius=1,location=p)
    ob=bpy.context.object
    ob.scale=r
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(name,m)
def cylinder(name,p,r,h,m):
    bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=h,location=p)
    return finish(name,m,.01)
def build(kind,m):
    # Geometry is additive around the nine existing Godot facades.
    # Door disk is left unobstructed at (0,1.15,-3.83).
    for side in (-1,1):
        x=side*2.4
        for i in range(16):
            theta=math.tau*i/16
            orb("HandLaidWindowArchStone",(x+.77*math.cos(theta),1.35+.77*math.sin(theta),-3.49),
                (.12,.12,.09),m["stone"])
        for dx in (-.92,.92):
            cube("CarvedWoodWindowShutter",(x+dx,1.38,-3.57),(.28,1.13,.10),m["wood"])
            for y in (1.06,1.39,1.72):
                orb("WroughtIronShutterRivet",(x+dx,y,-3.63),(.032,.034,.027),m["iron"])
        cube("StoneWindowSill",(x,.66,-3.48),(1.83,.11,.36),m["stone"])
        cube("OakFlowerBox",(x,.45,-3.84),(1.41,.28,.37),m["oak"])
        for i in range(9):
            px=x-.57+i*.14
            orb("WindowSillHerbs",(px,.68,-3.85),(.105,.16,.11),m["leaf"])
            if i%3==0:orb("WindowBoxSeasonalBloom",(px,.81,-3.87),(.066,.073,.067),m["accent"])
    for i in range(20):
        t=math.tau*i/20
        orb("CircularDoorBrassFastener",(1.0*math.cos(t),1.15+1.0*math.sin(t),-4.04),
            (.055,.055,.026),m["brass"])
    for side in (-1,1):
        px=side*3.6
        cube("FacadeTimberCrossBeam",(px,1.45,-2.94),(.16,2.3,.18),m["wood"])
        for i in range(4):
            cube("FacadeTimberJoint",(px,.7+i*.52,-3.06),(.26,.08,.11),m["oak"])
    # A distinctive shingle roof outline; low polygons and shared PBR materials.
    for row in range(3):
        for col in range(11):
            px=-3.15+col*.63
            pz=.8+row*.71
            py=2.64+.12*math.cos(px*.6)
            cube("WeatheredRoofTile",(px,py,pz),(.56,.07,.58),m["slate"])
            if (col+row)%4==0:
                orb("RoofGardenMoss",(px,py+.07,pz),(.16,.06,.16),m["leaf"])
    # Weathered masonry, occupied leadlight windows and original rainwater craft.
    # Reuse the existing palette so nine GLBs retain material batching.
    cx=-2.7 if kind in ("letters","weaving","herbs","orchard") else 2.7
    cube("HearthChimneyFieldstone",(cx,3.23,1.67),(.84,1.22,.76),m["stone"])
    cube("WeatheredChimneyCap",(cx,3.9,1.67),(1.10,.18,1.02),m["slate"])
    cube("SootDarkenedFlue",(cx,4.0,1.67),(.44,.055,.43),m["iron"])
    for row in range(3):
        for side in (-1,1):
            for col in range(3):
                cube("IndividualChimneyStone",(cx+side*.42,2.86+row*.29,
                     1.39+col*.29),(.12,.17,.22),m["stone"])
    for side in (-1,1):
        x=side*2.4
        cube("AmberLeadedGlassWindow",(x,1.37,-3.50),(1.31,1.11,.043),m["glass"])
        for stripe in range(5):
            px=x-.53+stripe*.26
            cube("IronWindowMullion",(px,1.37,-3.56),(.026,1.06,.045),m["iron"])
        for stripe in range(4):
            py=.96+stripe*.27
            cube("IronWindowCrossbar",(x,py,-3.57),(1.29,.025,.052),m["iron"])
        cube("HandCarvedOakEaveGutter",(side*2.24,2.70,-3.50),(2.3,.14,.19),m["oak"])
        cylinder("RainwaterDrainPipe",(side*3.36,1.30,-3.50),.045,2.28,m["iron"])
        cylinder("HouseholdRainBarrel",(side*3.36,.40,-3.68),.36,.68,m["oak"])
        cylinder("RainBarrelIronRim",(side*3.36,.67,-3.68),.37,.05,m["iron"])
        for tip in range(5):
            z=2.45+tip*.32
            orb("LivingRoofEdgeHerbs",(side*(2.14+.07*tip),2.89,z),
                (.20,.09,.16),m["leaf"])
    for i in range(7):
        angle=math.tau*i/7
        orb("CarvedHouseholdPorchEmblem",(math.cos(angle)*.28,
            2.48+math.sin(angle)*.28,-3.95),(.09,.085,.05),
            m["accent"] if i%2 else m["brass"])
    # One believable amber entrance lamp without additional GPU lights.
    cylinder("OilLanternAmberGlass",(1.66,2.07,-4.15),.14,.35,m["glass"])
    cube("OilLanternWroughtCage",(1.66,2.30,-4.15),(.33,.07,.30),m["iron"])
    cube("OilLanternBracket",(1.65,2.36,-3.94),(.07,.25,.40),m["iron"])
    # Exterior occupation props are distinct, not identical houses with palette swaps.
    for i in range(18):
        x=3.85+(i%6)*.19
        z=-4.62+(i//6)*.33
        if kind=="letters":
            cube("BagshotMailAndFamilyLedger",(x,.30,z),(.15,.04,.19),m["linen"])
            if i%3==0:orb("FamilyLetterWaxSeal",(x,.34,z),(.05,.014,.04),m["accent"])
        elif kind=="seedlings":
            cylinder("GardenTerracottaSeedPot",(x,.28,z),.105,.23,m["pot"])
            orb("GardenFreshSprout",(x,.48,z),(.08,.13,.08),m["leaf"])
        elif kind=="baking":
            orb("BakersFlourSack",(x,.31,z),(.14,.22,.12),m["linen"])
            if i%3==0:cube("BakersWoodPaddle",(x,.42,z),(.08,.04,.29),m["oak"])
        elif kind=="weaving":
            orb("LoomWoolBundle",(x,.27,z),(.13,.13,.15),m["accent"])
            if i%2==0:cube("WeaversSpindle",(x,.44,z),(.032,.26,.035),m["wood"])
        elif kind=="market":
            cube("MarketCrate",(x,.27,z),(.17,.16,.18),m["oak"])
            orb("MerchantsFreshProduce",(x,.43,z),(.09,.10,.09),m["accent"])
        elif kind=="carpentry":
            cube("CarpentersCutPegs",(x,.25,z),(.12,.10,.29),m["wood"])
            if i%2==0:cube("CarpentersIronTools",(x,.39,z),(.035,.035,.27),m["iron"])
        elif kind=="herbs":
            cylinder("HerbalistsDryingJar",(x,.27,z),.11,.24,m["pot"])
            orb("HerbalistsHealingLeaves",(x,.45,z),(.11,.12,.11),m["leaf"])
        elif kind=="harvest":
            orb("HarvestGrainCanvasSack",(x,.27,z),(.13,.23,.14),m["linen"])
            if i%3==0:orb("HarvestGoldenSheaf",(x,.45,z),(.08,.18,.08),m["accent"])
        elif kind=="orchard":
            cylinder("OrchardAppleBasket",(x,.26,z),.13,.15,m["oak"])
            orb("OrchardPickedApples",(x,.41,z),(.11,.12,.11),m["accent"])
    # Inset stones at threshold, respecting interaction-zone geometry.
    for i in range(10):
        cube("StoneThreshold",(i*.19-.86,.03,-4.49),(.17,.054,.29),m["stone"])
def export(key,palette):
    kind,wood,tint=palette
    mats=prepare(wood,tint)
    build(kind,mats)
    authored=sum(o.type=="MESH" for o in bpy.context.scene.objects)
    # Tested axis convention used by the existing Shire district exporter.
    for ob in list(bpy.context.scene.objects):
        if ob.type!="MESH":continue
        ob.data.transform(ob.matrix_world)
        ob.matrix_world=Matrix.Identity(4)
        for vert in ob.data.vertices:
            p=vert.co.copy()
            vert.co=(p.x,-p.z,p.y)
    # Combine hundreds of unique handcrafted objects by PBR material.
    for mat in list(bpy.data.materials):
        elements=[o for o in bpy.context.scene.objects
                  if o.type=="MESH" and o.data.materials and o.data.materials[0]==mat]
        if not elements:continue
        bpy.ops.object.select_all(action="DESELECT")
        for ob in elements:ob.select_set(True)
        bpy.context.view_layer.objects.active=elements[0]
        bpy.ops.object.convert(target="MESH")
        bpy.ops.object.join()
        bpy.context.object.name="Art_"+mat.name
    bpy.ops.object.select_all(action="SELECT")
    source=SOURCES/("shire_facade_"+key+".blend")
    bpy.ops.wm.save_as_mainfile(filepath=str(source))
    target=ASSETS/("shire_"+key+"_craftwork.glb")
    bpy.ops.export_scene.gltf(filepath=str(target),export_format="GLB",use_selection=True,
                              export_apply=True,export_yup=True)
    binary=target.read_bytes()
    meta={"asset":"shire_"+key+"_craftwork","house_id":key,"motif":kind,
          "provenance":"ORIGINAL-GAME","license":"Original procedural Blender geometry and packed texture",
          "status":"INTEGRATED_NOT_VISUALLY_ACCEPTED",
          "editable":"blender-production/shire_districts/"+source.name,
          "sha256":hashlib.sha256(binary).hexdigest(),"bytes":len(binary),
          "authored_parts":authored,
          "batched_meshes":sum(o.type=="MESH" for o in bpy.context.scene.objects)}
    (ASSETS/("shire_"+key+"_craftwork.source.json")).write_text(json.dumps(meta,indent=2)+"\n")
    print("PASS nine-facade Blender",key,authored,meta["batched_meshes"],len(binary),flush=True)
for id,recipe in HOMES.items():export(id,recipe)
