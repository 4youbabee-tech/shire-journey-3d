class_name ShireWorld
extends Node3D
## Original authored 3D Hobbiton scene: curved terrain, earth homes, water, mill, market, party tree.
## All GLB meshes in assets/models are newly generated meshes, not external copyrighted artwork.
const SIZE := 105
const STEP := 2.0
var sun : DirectionalLight3D
var world_environment : WorldEnvironment
var river : MeshInstance3D
var wheel : Node3D
var lanterns : Array[OmniLight3D] = []
var chimney_smoke : Array[CPUParticles3D] = []
var party_decorations: Dictionary = {}
var party_stations: Dictionary = {}
var errand_sites: Dictionary = {}
var rainfall: CPUParticles3D
var weather_particles : Array[MeshInstance3D] = []
var rng:=RandomNumberGenerator.new()
var materials: Dictionary={}
var drawn : Array[Node3D]=[]
var day_factor:=1.0
var village_life: ShireVillageLife
var airborne_life: ShireAirborneLife

func elevation(x: float,z: float) -> float:
    var roll:=2.0*sin(x*.029)*cos(z*.024)+1.3*sin(x*.066+z*.019)+.7*cos(z*.081)
    var bag_hill:=5.5*exp(-((x+24)*(x+24)+(z+21)*(z+21))/750.0)
    return roll+bag_hill

func material(color: Color, roughness: float=.86) -> StandardMaterial3D:
    var key: String=str(color.to_html())+str(roughness)
    if materials.has(key):return materials[key]
    var m:=StandardMaterial3D.new()
    m.albedo_color=color
    m.roughness=roughness
    m.specular_mode=BaseMaterial3D.SPECULAR_SCHLICK_GGX
    materials[key]=m
    return m

func _ready() -> void:
    rng.seed=3018
    _lighting()
    _rain_emitter()
    _terrain()
    _lanes()
    _water()
    _hobbit_hole(Vector2(-24,-20),1.65,true)
    _hobbit_hole(Vector2(-44,-26),1.16,false,"bagshot_cottage")
    _hobbit_hole(Vector2(-45,-3),1.12,false,"garden_cottage")
    _hobbit_hole(Vector2(-18,-39),1.18,false,"hill_cottage")
    _hobbit_hole(Vector2(2,30),.97,false,"northern_cottage")
    _hobbit_hole(Vector2(18,28),1.17,false,"market_cottage")
    # More inhabited homesteads on Bagshot Row and the southern farmland.
    # Use the same curated facade family until bespoke Blender interiors replace them.
    _hobbit_hole(Vector2(-62,-12),.91,false,"west_row_cottage")
    _hobbit_hole(Vector2(-61,11),1.04,false,"west_grove_cottage")
    _hobbit_hole(Vector2(-34,45),.94,false,"longacre_cottage")
    _hobbit_hole(Vector2(32,40),1.07,false,"east_orchard_cottage")
    _farm_fields()
    _market()
    ShireLicensedProps.dress_market(self,Callable(self,"elevation"))
    ShirePhotorealProps.market(self,Callable(self,"elevation"))
    _watermill()
    _bridge()
    _party_field()
    _neighbour_errand_props()
    ShirePhotorealProps.gardens(self,Callable(self,"elevation"))
    _trees()
    _grass_and_flowers()
    ShireWorldDressing.populate(self,Callable(self,"elevation"))
    ShireHomesteadExteriors.populate(self,Callable(self,"elevation"))
    ShireCountrysideCraft.populate(self,Callable(self,"elevation"))
    _lantern_posts()
    village_life=preload("res://scripts/shire_village_life.gd").new()
    village_life.name="AnimatedDomesticDetails"
    add_child(village_life)
    village_life.populate(Callable(self,"elevation"))
    airborne_life=ShireAirborneLife.new()
    airborne_life.name="ShireMeadowButterflies"
    add_child(airborne_life)
    airborne_life.populate(Callable(self,"elevation"))

func _lighting() -> void:
    world_environment=WorldEnvironment.new()
    add_child(world_environment)
    var env:=Environment.new()
    env.background_mode=Environment.BG_SKY
    var sky:=Sky.new()
    var atmosphere:=ProceduralSkyMaterial.new()
    atmosphere.sky_top_color=Color("618bb0")
    atmosphere.sky_horizon_color=Color("cce4d0")
    atmosphere.ground_bottom_color=Color("4f654b")
    sky.sky_material=atmosphere
    env.sky=sky
    env.ambient_light_source=Environment.AMBIENT_SOURCE_SKY
    env.reflected_light_source=Environment.REFLECTION_SOURCE_BG
    env.tonemap_mode=Environment.TONE_MAPPER_FILMIC
    # Conservative grade for the 2 GB VRAM target: no expensive SSAO/SSIL in GL Compatibility.
    env.adjustment_enabled=true
    env.adjustment_brightness=1.025
    env.adjustment_contrast=1.075
    env.adjustment_saturation=0.92
    env.fog_enabled=true
    env.fog_density=.0023
    env.fog_light_color=Color("778e82")
    world_environment.environment=env
    sun=DirectionalLight3D.new()
    sun.rotation_degrees=Vector3(-38,-32,0)
    sun.light_color=Color("ffdfaa")
    sun.light_energy=.95
    sun.shadow_blur=1.35
    sun.shadow_enabled=true
    sun.directional_shadow_max_distance=65.0
    add_child(sun)

func box(parent: Node3D, point: Vector3, scale_value: Vector3, tint: Color, turn: float=0.0) -> MeshInstance3D:
    var node:=MeshInstance3D.new()
    var mesh:=BoxMesh.new()
    mesh.size=scale_value
    node.mesh=mesh
    node.position=point
    node.rotation.y=turn
    node.material_override=material(tint)
    parent.add_child(node)
    return node

func sph(parent: Node3D, point: Vector3, scale_value: Vector3, tint: Color) -> MeshInstance3D:
    var node:=MeshInstance3D.new()
    var shape:=SphereMesh.new()
    shape.radial_segments=20
    shape.rings=12
    node.mesh=shape
    node.position=point
    node.scale=scale_value
    if tint == Color("4b7234") or tint == Color("698845"):
        node.material_override=ShireSurfaceMaterials.roof_turf()
    else:
        node.material_override=material(tint)
    parent.add_child(node)
    return node

func _rain_emitter() -> void:
    rainfall=CPUParticles3D.new()
    rainfall.name="LocalRain"
    rainfall.amount=150
    rainfall.lifetime=1.5
    rainfall.emitting=false
    rainfall.emission_shape=CPUParticles3D.EMISSION_SHAPE_BOX
    rainfall.emission_box_extents=Vector3(13,5,13)
    rainfall.direction=Vector3(0,-1,0)
    rainfall.spread=7.0
    rainfall.gravity=Vector3(0,-10.0,0)
    rainfall.initial_velocity_min=9.0
    rainfall.initial_velocity_max=13.5
    rainfall.scale_amount_min=.75
    rainfall.scale_amount_max=1.15
    var drop_mesh:=BoxMesh.new()
    drop_mesh.size=Vector3(.018,.38,.018)
    var rain_material:=StandardMaterial3D.new()
    rain_material.albedo_color=Color(.68,.77,.82,.55)
    rain_material.transparency=BaseMaterial3D.TRANSPARENCY_ALPHA
    rain_material.shading_mode=BaseMaterial3D.SHADING_MODE_UNSHADED
    rain_material.cull_mode=BaseMaterial3D.CULL_DISABLED
    drop_mesh.material=rain_material
    rainfall.mesh=drop_mesh
    add_child(rainfall)

func _terrain() -> void:
    var tool:=SurfaceTool.new()
    tool.begin(Mesh.PRIMITIVE_TRIANGLES)
    var half=float(SIZE)*STEP*.5
    for ix in range(SIZE):
        for iz in range(SIZE):
            var x=-half+float(ix)*STEP
            var z=-half+float(iz)*STEP
            var a=Vector3(x,elevation(x,z),z)
            var b=Vector3(x+STEP,elevation(x+STEP,z),z)
            var c=Vector3(x+STEP,elevation(x+STEP,z+STEP),z+STEP)
            var d=Vector3(x,elevation(x,z+STEP),z+STEP)
            for v in [a,d,b,b,d,c]:
                var hue=.045*sin(v.x*.11+v.z*.05)+.05*cos(v.z*.19)
                var color:=Color(.89+hue*.15,.93+hue*.10,.86+hue*.13)
                tool.set_color(color)
                tool.set_uv(Vector2(v.x,v.z)*.20)
                tool.add_vertex(v)
    tool.generate_normals()
    var mesh:=tool.commit()
    var node:=MeshInstance3D.new()
    node.mesh=mesh
    var grassy:=StandardMaterial3D.new()
    grassy.vertex_color_use_as_albedo=true
    grassy.albedo_texture=load("res://assets/external/polyhaven_leafy_grass/diffuse_512.jpg")
    grassy.normal_enabled=true
    grassy.normal_texture=load("res://assets/external/polyhaven_leafy_grass/normal_gl_512.jpg")
    grassy.normal_scale=.28
    grassy.roughness=.93
    grassy.cull_mode=BaseMaterial3D.CULL_DISABLED
    node.material_override=grassy
    add_child(node)
    var collider:=StaticBody3D.new()
    collider.name="WalkableTerrain"
    add_child(collider)
    var shape:=CollisionShape3D.new()
    shape.shape=mesh.create_trimesh_shape()
    collider.add_child(shape)

func _path(a: Vector2,b: Vector2,width: float) -> void:
    var length:=a.distance_to(b)
    var dir:=(b-a).normalized()
    var normal:=Vector2(-dir.y,dir.x)
    var steps:=maxi(2,int(length/2.0))
    var surface:=SurfaceTool.new()
    surface.begin(Mesh.PRIMITIVE_TRIANGLES)
    for i in range(steps):
        var p:=a.lerp(b,float(i)/steps)
        var q:=a.lerp(b,float(i+1)/steps)
        var p1:=p+normal*width*.5
        var p2:=p-normal*width*.5
        var q1:=q+normal*width*.5
        var q2:=q-normal*width*.5
        for v in [p1,q1,p2,p2,q1,q2]:
            surface.set_uv(Vector2(v.x,v.y)*.18)
            surface.add_vertex(Vector3(v.x,elevation(v.x,v.y)+.085,v.y))
    surface.generate_normals()
    var node:=MeshInstance3D.new()
    node.mesh=surface.commit()
    var earth:=StandardMaterial3D.new()
    earth.albedo_texture=load("res://assets/textures/path_albedo.jpg")
    earth.normal_enabled=true
    earth.normal_texture=load("res://assets/textures/path_normal.jpg")
    earth.normal_scale=.35
    earth.roughness=.92
    earth.cull_mode=BaseMaterial3D.CULL_DISABLED
    node.material_override=earth
    add_child(node)

func _lanes() -> void:
    _path(Vector2(-24,-19),Vector2(-21,-10),2.5)
    _path(Vector2(-21,-10),Vector2(-9,-4),3)
    _path(Vector2(-9,-4),Vector2(17,8),3)
    _path(Vector2(17,8),Vector2(41,8),3)
    _path(Vector2(-9,-4),Vector2(-3,25),2.3)
    _path(Vector2(-3,25),Vector2(9,65),2.6)
    _path(Vector2(-9,-4),Vector2(-44,-3),1.7)
    _path(Vector2(17,8),Vector2(31,-17),2.4)

func _river_x(z: float) -> float:
    return 42+4*sin(z*.048)

func _water() -> void:
    var surface:=SurfaceTool.new()
    surface.begin(Mesh.PRIMITIVE_TRIANGLES)
    for i in range(105):
        var z=-100.0+float(i)*2.0
        var z2=z+2.0
        var x=_river_x(z)
        var x2=_river_x(z2)
        for v in [Vector3(x-3,elevation(x,z)+.12,z),Vector3(x2+3,elevation(x2,z2)+.12,z2),Vector3(x+3,elevation(x,z)+.12,z),
                  Vector3(x-3,elevation(x,z)+.12,z),Vector3(x2-3,elevation(x2,z2)+.12,z2),Vector3(x2+3,elevation(x2,z2)+.12,z2)]:
            surface.set_uv(Vector2(v.x,v.z)*.06)
            surface.add_vertex(v)
    surface.generate_normals()
    river=MeshInstance3D.new()
    river.mesh=surface.commit()
    var water:=ShaderMaterial.new()
    var code="shader_type spatial; render_mode blend_mix, cull_disabled, depth_draw_opaque; uniform vec4 water_color : source_color = vec4(0.13,0.39,0.46,0.82); void fragment() { float r = sin(UV.x * 52.0 + TIME * 1.0) * 0.06 + sin(UV.y * 83.0 - TIME * 0.9) * 0.04; ALBEDO = water_color.rgb + vec3(r); ROUGHNESS = 0.13; METALLIC=0.03; ALPHA = water_color.a; }"
    water.shader=Shader.new()
    water.shader.code=code
    river.material_override=water
    add_child(river)

func _hobbit_hole(where: Vector2, scale_factor: float, main_house: bool, homestead_id: String="") -> void:
    var center:=Vector3(where.x,elevation(where.x,where.y),where.y)
    var house:=Node3D.new()
    house.position=center
    house.scale=Vector3.ONE*scale_factor
    house.name="BagEnd" if main_house else "HobbitHouse"
    add_child(house)
    sph(house,Vector3(0,.95,1.0),Vector3(4.8,2.0,4.3),Color("4b7234"))
    sph(house,Vector3(0,1.12,-.05),Vector3(4.0,1.9,3.8),Color("6e5438"))
    sph(house,Vector3(0,2.2,.85),Vector3(4.55,.83,3.8),Color("698845"))
    ShireArchitecture.decorate(house,main_house)
    # Author-made Blender decoration only: gameplay and collision stay unchanged.
    if not homestead_id.is_empty():
        var path: String="res://assets/models/shire_"+homestead_id+"_craftwork.glb"
        if ResourceLoader.exists(path):
            var craftwork: PackedScene=load(path) as PackedScene
            if craftwork != null:
                var facade: Node3D=craftwork.instantiate() as Node3D
                if facade != null:
                    facade.name="ShireCraftedFacade_"+homestead_id
                    house.add_child(facade)
    if main_house:
        var path_to_crafted := "res://assets/models/bag_end_crafted_portal.glb"
        if ResourceLoader.exists(path_to_crafted):
            var packed_portal := load(path_to_crafted) as PackedScene
            if packed_portal != null:
                var crafted_portal := packed_portal.instantiate() as Node3D
                crafted_portal.name = "BagEndCraftedPortalGLB"
                house.add_child(crafted_portal)
    # Stone porch/facade with a true circular wooden door and arched frame.
    var door:=MeshInstance3D.new()
    var disk:=CylinderMesh.new()
    disk.top_radius=1.08
    disk.bottom_radius=1.08
    disk.height=.13
    disk.radial_segments=40
    door.mesh=disk
    door.position=Vector3(0,1.15,-3.83)
    door.rotation.x=PI/2.0
    door.material_override=material(Color("537044") if main_house else Color("83542e"))
    house.add_child(door)
    var ring:=MeshInstance3D.new()
    var torus:=TorusMesh.new()
    torus.inner_radius=.98
    torus.outer_radius=1.14
    torus.rings=8
    torus.ring_segments=40
    ring.mesh=torus
    ring.position=door.position+Vector3(0,0,-.05)
    ring.rotation.x=PI/2.0
    ring.material_override=material(Color("bd995a"))
    house.add_child(ring)
    # A single arched facade mesh saves draw calls vs. separate stone blocks.
    _stone_arch(house)
    var knob:=sph(house,Vector3(.50,1.13,-3.96),Vector3(.12,.12,.12),Color("d6b16e"))
    knob.material_override=material(Color("dfb568"),.26)
    for side in [-1.0,1.0]:
        var window:=MeshInstance3D.new()
        var window_mesh:=CylinderMesh.new()
        window_mesh.top_radius=.62
        window_mesh.bottom_radius=.62
        window_mesh.height=.07
        window_mesh.radial_segments=32
        window.mesh=window_mesh
        window.position=Vector3(side*2.4,1.35,-3.20)
        window.rotation.x=PI/2.0
        window.material_override=material(Color("f3ca79"),.19)
        house.add_child(window)
        box(house,Vector3(side*2.4,1.35,-3.28),Vector3(1.12,.085,.08),Color("9e713f"))
        box(house,Vector3(side*2.4,1.35,-3.29),Vector3(.085,1.12,.08),Color("9e713f"))
    # Stone chimney with chimney cap and raised planting beds.
    box(house,Vector3(2.2,3.06,1.1),Vector3(.78,2.45,.82),Color("857a64"))
    box(house,Vector3(2.2,4.30,1.1),Vector3(1.05,.25,1.05),Color("655b4e"))
    _smoke(house,Vector3(2.2,4.50,1.1))
    for i in range(12):
        var x=-3.6+float(i)*.65
        box(house,Vector3(x,.3,-4.7),Vector3(.12,.52,.11),Color("ad8752"))
    var flower_asset:=load("res://assets/models/garden_flowers.glb") as PackedScene
    for i in range(7):
        var flowers:=flower_asset.instantiate()
        flowers.position=Vector3(-3.3+float(i)*1.04,0.18,-4.48)
        flowers.scale=Vector3.ONE*.72
        house.add_child(flowers)

func _smoke(house: Node3D, chimney: Vector3) -> void:
    # Real CPU particles: smoke from inhabited hearths, suppressed by heavy rain.
    var p:=CPUParticles3D.new()
    p.amount=18
    p.lifetime=4.8
    p.speed_scale=.65
    p.direction=Vector3(0,1,0)
    p.spread=14.0
    p.gravity=Vector3(.06,.18,0)
    p.initial_velocity_min=.20
    p.initial_velocity_max=.48
    p.scale_amount_min=.23
    p.scale_amount_max=.55
    var smoke_mesh:=SphereMesh.new()
    smoke_mesh.radius=.28
    smoke_mesh.height=.56
    var mat:=StandardMaterial3D.new()
    mat.albedo_color=Color(.45,.45,.43,.23)
    mat.transparency=BaseMaterial3D.TRANSPARENCY_ALPHA
    mat.shading_mode=BaseMaterial3D.SHADING_MODE_UNSHADED
    mat.depth_draw_mode=BaseMaterial3D.DEPTH_DRAW_DISABLED
    smoke_mesh.material=mat
    p.mesh=smoke_mesh
    p.position=chimney
    p.emitting=true
    house.add_child(p)
    chimney_smoke.append(p)

func _stone_arch(house: Node3D) -> void:
    var tool:=SurfaceTool.new()
    tool.begin(Mesh.PRIMITIVE_TRIANGLES)
    var pieces:=30
    for i in range(pieces):
        var a=TAU*float(i)/pieces
        var b=TAU*float(i+1)/pieces
        var mid_color:=Color("a89a7a") if i%3==0 else Color("b5a58b") if i%3==1 else Color("93866d")
        var inner:=1.18
        var outer:=1.49
        var verts:=[Vector3(sin(a)*inner,1.15+cos(a)*inner,-4.07),
                    Vector3(sin(b)*inner,1.15+cos(b)*inner,-4.07),
                    Vector3(sin(a)*outer,1.15+cos(a)*outer,-4.07),
                    Vector3(sin(b)*outer,1.15+cos(b)*outer,-4.07)]
        for v in [verts[0],verts[2],verts[1],verts[1],verts[2],verts[3]]:
            tool.set_color(mid_color)
            tool.add_vertex(v)
    tool.generate_normals()
    var arch:=MeshInstance3D.new()
    arch.mesh=tool.commit()
    var stone:=StandardMaterial3D.new()
    stone.vertex_color_use_as_albedo=true
    stone.cull_mode=BaseMaterial3D.CULL_DISABLED
    stone.roughness=.95
    arch.material_override=stone
    house.add_child(arch)

func _import(name: String, point: Vector3, factor: float) -> Node3D:
    var scene:=load("res://assets/models/%s.glb" % name) as PackedScene
    var node:=scene.instantiate() as Node3D
    node.position=point
    node.scale=Vector3.ONE*factor
    add_child(node)
    return node

func _market() -> void:
    for i in range(3):
        var x=12.0+float(i)*5.5
        _import("market_stall",Vector3(x,elevation(x,8),8),1.0)
        _import("oak_barrel",Vector3(x-1.7,elevation(x-1.7,10),10),1.0)
    _import("market_wagon",Vector3(23,elevation(23,13)+.1,13),.8)
    # Blender-authored produce, pottery, awnings and wicker market dressings.
    for i in range(3):
        var px: float = 12.0+float(i)*5.5
        var craft := _import("shire_market_craftwork",Vector3(px,elevation(px,8),8),.84)
        craft.name="ShireMarketCraftwork%d" % i
    for i in range(6):
        box(self,Vector3(10.0+i*1.5,elevation(10.0+i*1.5,15)+.2,15),Vector3(.85,.4,.8),Color("917249"))

func _watermill() -> void:
    var x=33.0;var z=-17.0;var y=elevation(x,z)
    box(self,Vector3(x,y+2.1,z),Vector3(8.8,4.2,7.3),Color("a88e69"))
    var roof:=box(self,Vector3(x,y+4.6,z),Vector3(10,1.0,8.6),Color("765337"))
    roof.rotation.z=.10
    # Real GLB with pitched timber roof, shingles and coopered storage.
    var mill_art := _import("shire_mill_craftwork",Vector3(x,y,z),1.0)
    mill_art.name="ShireMillCraftwork"
    wheel=_import("watermill_wheel",Vector3(37,y+2.2,-16.7),1.05)
    wheel.rotation.y=PI/2.0
    for i in range(5):
        box(self,Vector3(x-3.1+i*1.5,y+.9,z-3.8),Vector3(.12,1.1,.15),Color("705539"))

func _bridge() -> void:
    var z=8.0;var bx=_river_x(z)
    var y=elevation(bx,z)+.65
    for i in range(14):
        box(self,Vector3(bx-6.3+i*.95,y,z),Vector3(.90,.22,4.2),Color("936d46"))
    for side in [-1.0,1.0]:
        for i in range(6):
            var x=bx-5.5+i*2.0
            box(self,Vector3(x,y+.85,z+side*1.9),Vector3(.17,1.65,.17),Color("715035"))
        box(self,Vector3(bx,y+1.6,z+side*1.9),Vector3(12.5,.14,.18),Color("9c754b"))

func _party_field() -> void:
    var at:=Vector3(-2,elevation(-2,-3),-3)
    var party_oak: String = "shire_hero_oak" if ResourceLoader.exists("res://assets/models/shire_hero_oak.glb") else "old_oak_1"
    _import(party_oak,at,1.35)
    # Original feast carpentry and food; existing quest stations remain untouched.
    for i in range(2):
        var xy: Vector2 = [Vector2(-7.0,-11.0),Vector2(5.5,-12.0)][i]
        var feast_art := _import("shire_feast_craftwork",Vector3(xy.x,elevation(xy.x,xy.y),xy.y),.92)
        feast_art.name="ShireFeastCraftwork%d" % i
    for i in range(10):
        var angle=i*TAU/10.0
        var x=-2+cos(angle)*9.0;var z=-3+sin(angle)*9.0
        _import("garden_flowers",Vector3(x,elevation(x,z),z),.8)
    for i in range(12):
        var x=-15+float(i)*1.8
        box(self,Vector3(x,elevation(x,-15)+.14,-15),Vector3(.09,.5,.12),Color("c2a46b"))
    # Physical birthday preparations: guests can see each setup after helping.
    var stations := [
        ["birthday_bunting", -13.0, -4.0, Color("6c513c")],
        ["birthday_tables", -8.0, 8.0, Color("7e5943")],
        ["birthday_lanterns", 9.0, 3.0, Color("6c513c")]
    ]
    for entry in stations:
        var id: String = str(entry[0])
        var x: float = float(entry[1])
        var z: float = float(entry[2])
        var site := Node3D.new()
        site.name = id
        site.position = Vector3(x,elevation(x,z),z)
        party_stations[id] = site
        add_child(site)
        box(site,Vector3(0,.75,0),Vector3(2.25,.16,1.25),entry[3])
        for side in [-.84,.84]:
            box(site,Vector3(side,.37,0),Vector3(.16,.7,.85),Color("53402e"))
        var decorations := Node3D.new()
        decorations.name = "PreparedDecorations"
        site.add_child(decorations)
        decorations.visible = false
        party_decorations[id] = decorations
        if id == "birthday_bunting":
            for i in range(7):
                var px := -1.02 + float(i)*.34
                box(decorations,Vector3(px,1.48,0),Vector3(.12,.46,.08),Color.from_hsv(float(i)/7.0,.48,.82))
            box(decorations,Vector3(0,1.73,0),Vector3(2.5,.08,.09),Color("d3b987"))
        elif id == "birthday_tables":
            for i in range(5):
                var px := -.75 + float(i)*.37
                sph(decorations,Vector3(px,.91,0),Vector3(.19,.13,.19),Color("d1a661"))
            box(decorations,Vector3(0,.83,0),Vector3(2.0,.05,1.1),Color("e1c9a0"))
        else:
            for i in range(4):
                var px := -.72 + float(i)*.48
                box(decorations,Vector3(px,1.15,0),Vector3(.2,.32,.22),Color("dcab52"))
                sph(decorations,Vector3(px,1.38,0),Vector3(.15,.14,.15),Color("f3d998"))


func _neighbour_errand_props() -> void:
    # Original primitive-mesh set dressing: herb crate, flour and kitchen table.
    var sites := [["garden_herbs",-32.0,-12.0],
                  ["mill_flour",29.0,-24.0],
                  ["party_delivery",-3.0,13.0]]
    for site in sites:
        var id: String=str(site[0])
        var x: float=float(site[1])
        var z: float=float(site[2])
        var root:=Node3D.new()
        root.name="NeighbourErrand_"+id
        root.position=Vector3(x,elevation(x,z),z)
        add_child(root)
        errand_sites[id]=root
        if id=="garden_herbs":
            box(root,Vector3(0,.22,0),Vector3(1.15,.35,.84),Color("86643e"))
            for n in range(6):
                var px: float=-.39+float(n%3)*.39
                var pz: float=-.22+float(n/3)*.41
                box(root,Vector3(px,.55,pz),Vector3(.06,.49,.06),Color("577b46"))
                sph(root,Vector3(px,.82,pz),Vector3(.20,.15,.15),Color("8fae5b"))
        elif id=="mill_flour":
            box(root,Vector3(0,.14,0),Vector3(1.5,.20,1.0),Color("745137"))
            for n in range(3):
                var px: float=-.43+float(n)*.43
                sph(root,Vector3(px,.46,0),Vector3(.33,.39,.35),Color("d4c5a0"))
                box(root,Vector3(px,.83,0),Vector3(.20,.055,.24),Color("b89d74"))
        else:
            box(root,Vector3(0,.71,0),Vector3(1.8,.18,1.3),Color("875f40"))
            for side in [-.65,.65]:
                box(root,Vector3(side,.35,0),Vector3(.15,.71,.94),Color("65503a"))
            for n in range(3):
                var px: float=-.48+float(n)*.46
                box(root,Vector3(px,.92,0),Vector3(.36,.24,.36),Color("a88854"))

func set_errand_completed(id: String, complete: bool) -> void:
    if errand_sites.has(id):
        errand_sites[id].visible=not complete

func set_party_era(birthday_era: bool) -> void:
    for id in party_stations:
        if is_instance_valid(party_stations[id]):
            party_stations[id].visible=birthday_era

func set_party_prepared(id: String, ready: bool) -> void:
    if party_decorations.has(id) and is_instance_valid(party_decorations[id]):
        party_decorations[id].visible = ready

func _trees() -> void:
    # Real tree architecture from four original Blender GLBs; 78 placements
    # are GPU instanced, replacing the repeated old oaks and sphere canopies.
    ShireTreeGrove.populate(self,Callable(self,"elevation"),Callable(self,"_river_x"))

func _grass_and_flowers() -> void:
    # One MultiMesh batch for 1200 grass blades. No thousands of Node3D draw calls.
    var grass:=MultiMesh.new()
    grass.transform_format=MultiMesh.TRANSFORM_3D
    grass.use_colors=true
    grass.instance_count=1500
    var blade:=QuadMesh.new()
    blade.size=Vector2(.19,.52)
    grass.mesh=blade
    for i in range(grass.instance_count):
        var x=rng.randf_range(-90.0,90.0);var z=rng.randf_range(-90.0,90.0)
        var basis:=Basis(Vector3.UP,rng.randf_range(0.0,TAU))
        var size_value:=rng.randf_range(.7,1.35)
        basis=basis.scaled(Vector3(size_value,size_value,size_value))
        var p:=Vector3(x,elevation(x,z)+.22,z)
        grass.set_instance_transform(i,Transform3D(basis,p))
        grass.set_instance_color(i,Color("839c5b") if i%4 else Color("c4ac6c"))
    var foliage:=MultiMeshInstance3D.new()
    foliage.multimesh=grass
    foliage.material_override=material(Color("88a868"))
    foliage.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    add_child(foliage)
    for i in range(36):
        var x=rng.randf_range(-75,70);var z=rng.randf_range(-70,70)
        if absf(x-_river_x(z))<3:continue
        _import("garden_flowers",Vector3(x,elevation(x,z),z),rng.randf_range(.55,1.2))

func _lantern_posts() -> void:
    for p in [Vector2(-21,-9),Vector2(-4,-2),Vector2(12,8),Vector2(31,-17),Vector2(38,8)]:
        var base:=Vector3(p.x,elevation(p.x,p.y),p.y)
        box(self,base+Vector3(0,1.6,0),Vector3(.16,3.2,.16),Color("665440"))
        var lantern:=_import("hanging_lantern",base+Vector3(0,2.45,0),.5)
        var light:=OmniLight3D.new()
        light.position=base+Vector3(0,3.2,0)
        light.light_energy=.0
        light.light_color=Color("ffb969")
        light.omni_range=6.0
        light.shadow_enabled=false
        add_child(light)
        lanterns.append(light)

func _farm_fields() -> void:
    # One shared mesh and two draw batches instead of 120 SphereMesh nodes.
    var seedling := SphereMesh.new()
    seedling.radial_segments=8
    seedling.rings=5
    for palette in range(2):
        var batch := MultiMesh.new()
        batch.transform_format=MultiMesh.TRANSFORM_3D
        batch.instance_count=120
        batch.mesh=seedling
        var n := 0
        for k in range(6):
            var x: float=-65.0+float(k)*3.5
            for i in range(20):
                if (i%3==0) != (palette==1):
                    continue
                var z: float=25.0+float(i)*1.2
                var y: float=elevation(x,z)
                var basis:=Basis.IDENTITY.scaled(Vector3(.19,.35,.19))
                batch.set_instance_transform(n,Transform3D(basis,Vector3(x,y+.12,z)))
                n+=1
        # Shrink to the actual instance count: ten dry stems per row, twenty green.
        batch.visible_instance_count=n
        var container:=MultiMeshInstance3D.new()
        container.name="FarmCropBatch_%d" % palette
        container.multimesh=batch
        container.material_override=material(Color("ceb96d") if palette==1 else Color("9ca35d"))
        container.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
        add_child(container)

func update_environment(time_of_day: float, night_lighting: float, weather_type: String, weather_strength: float, delta: float) -> void:
    day_factor=night_lighting
    sun.rotation_degrees=Vector3(-10.0-65.0*night_lighting, -35.0+time_of_day*5.0,0)
    sun.light_energy=.10+.95*night_lighting*(1.0-weather_strength*.42)
    sun.light_color=Color("ffd49c").lerp(Color("e5eff7"),1.0-night_lighting)
    var env:=world_environment.environment
    env.ambient_light_energy=.20+.45*night_lighting*(1.0-weather_strength*.30)
    env.fog_density=.0023 + (.017 if weather_type=="fog" else .008 if weather_type=="mist" else .002)*weather_strength
    for lamp in lanterns:
        lamp.light_energy=1.4*(1.0-smoothstep(.3,.7,night_lighting))
    for smoke in chimney_smoke:
        smoke.emitting=weather_type not in ["heavy_rain", "storm"]
    rainfall.emitting=weather_type in ["light_rain", "heavy_rain", "storm"] and weather_strength>.12

    if is_instance_valid(wheel):
        wheel.rotation.z+=delta*.23
    if is_instance_valid(village_life):
        village_life.tick(Time.get_ticks_msec()*.001,1.7 if weather_type in ["storm","heavy_rain"] else 1.0,delta)
    if is_instance_valid(airborne_life):
        airborne_life.tick(delta,weather_type,night_lighting)
