class_name ShireLandscapeArt
extends RefCounted
## Seven real-world vegetation/shoreline production batches throughout Hobbiton.
## Single mesh per species, instanced thousands of times; no tree-shaped spheres.
## Visual-only set dressing: never puts colliders over walking lanes or doors.
const SEED := 2026101708
const PATH_SEGMENTS := [
    [Vector2(-24,-19),Vector2(-21,-10)],
    [Vector2(-21,-10),Vector2(-9,-4)],
    [Vector2(-9,-4),Vector2(17,8)],
    [Vector2(17,8),Vector2(41,8)],
    [Vector2(-9,-4),Vector2(-3,25)],
    [Vector2(-3,25),Vector2(9,65)],
    [Vector2(-9,-4),Vector2(-44,-3)],
    [Vector2(17,8),Vector2(31,-17)]
]
const HOUSE_CLEARANCES := [
    Vector2(-44,-26),Vector2(-45,-3),Vector2(-18,-39),
    Vector2(2,30),Vector2(18,28),Vector2(-62,-12),
    Vector2(-61,11),Vector2(-34,45),Vector2(32,40)
]

static func _material(hex: String, two_sided: bool = true) -> StandardMaterial3D:
    var mat := StandardMaterial3D.new()
    mat.albedo_color = Color(hex)
    mat.roughness = .96
    if two_sided:
        mat.cull_mode = BaseMaterial3D.CULL_DISABLED
    return mat

static func _instance(zone: Node3D, name: String, model: Mesh,
        offsets: Array[Transform3D], color: String) -> MultiMeshInstance3D:
    var multi := MultiMesh.new()
    multi.transform_format = MultiMesh.TRANSFORM_3D
    multi.mesh = model
    multi.instance_count = offsets.size()
    for i in range(offsets.size()):
        multi.set_instance_transform(i,offsets[i])
    var mesh_node := MultiMeshInstance3D.new()
    mesh_node.name = name
    mesh_node.multimesh = multi
    mesh_node.material_override = _material(color)
    mesh_node.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    zone.add_child(mesh_node)
    return mesh_node

static func _growth_mesh(leaves: int, extent: float) -> Mesh:
    # True tapered long leaves with mid-curve, not billboard quads or ball clumps.
    var s := SurfaceTool.new()
    s.begin(Mesh.PRIMITIVE_TRIANGLES)
    for petal in range(leaves):
        var angle: float = TAU*float(petal)/float(leaves)
        var sway: Vector3 = Vector3(cos(angle)*extent,0,sin(angle)*extent)
        var cross: Vector3 = Vector3(-sin(angle),0,cos(angle))
        var center := Vector3.ZERO
        var knee := sway*.56+Vector3.UP*.42
        var tip := sway+Vector3.UP*.75
        var outline: Array[Vector3] = [
            center-cross*.06, center+cross*.06,
            knee-cross*.092,knee+cross*.092,
            tip
        ]
        for index in [0,1,2,1,3,2,2,3,4]:
            s.add_vertex(outline[index])
    s.generate_normals()
    return s.commit()

static func _flower_mesh() -> Mesh:
    var s := SurfaceTool.new()
    s.begin(Mesh.PRIMITIVE_TRIANGLES)
    # One branched stem and five individually modeled triangular petals.
    for a in range(3):
        var theta: float = float(a)*TAU/3.0
        var tip := Vector3(.09*cos(theta),.72,.09*sin(theta))
        var base := Vector3(.03*cos(theta),0,.03*sin(theta))
        for p in [base-Vector3(.026,0,0),base+Vector3(.026,0,0),tip]:
            s.add_vertex(p)
    for leaf in range(5):
        var a: float = TAU*float(leaf)/5.0
        var outward := Vector3(cos(a),0,sin(a))
        var side := Vector3(-sin(a),0,cos(a))
        var mid := Vector3(0,.79,0)
        var edge := mid+outward*.20
        for p in [mid+side*.075,edge+Vector3.UP*.025,mid-side*.075]:
            s.add_vertex(p)
    s.generate_normals()
    return s.commit()

static func _is_footpath(point: Vector2) -> bool:
    for line in PATH_SEGMENTS:
        var a: Vector2 = line[0]
        var b: Vector2 = line[1]
        var ray: Vector2 = b-a
        var fraction: float = clampf((point-a).dot(ray)/maxf(ray.length_squared(),.01),0.0,1.0)
        if point.distance_to(a+ray*fraction) < 2.6:
            return true
    return false

static func _is_reserved(point: Vector2, river_x: Callable) -> bool:
    if absf(point.x-float(river_x.call(point.y))) < 6.3:
        return true
    if point.distance_to(Vector2(17,8)) < 6.5:
        return true
    if point.distance_to(Vector2(-24,-20)) < 7.0:
        return true
    if point.distance_to(Vector2(-2,-3)) < 9.5:
        return true
    for home in HOUSE_CLEARANCES:
        if point.distance_to(home) < 6.7:
            return true
    return _is_footpath(point)

static func _scatter(zone: Node3D, height: Callable, river_x: Callable) -> void:
    var rng := RandomNumberGenerator.new()
    rng.seed = SEED
    var meadow: Array[Transform3D] = []
    var clusters: Array[Transform3D] = []
    var blooms_white: Array[Transform3D] = []
    var blooms_gold: Array[Transform3D] = []
    var blooms_rose: Array[Transform3D] = []
    for trial in range(16000):
        var x: float = rng.randf_range(-97.0,97.0)
        var z: float = rng.randf_range(-95.0,95.0)
        var xy := Vector2(x,z)
        if _is_reserved(xy,river_x):
            continue
        var y: float = float(height.call(x,z))
        var yaw: float = rng.randf_range(-PI,PI)
        var radius: float = rng.randf_range(.48,1.26)
        var basis := Basis(Vector3.UP,yaw)
        if trial%4==0:
            clusters.append(Transform3D(basis.scaled(Vector3(radius,1.1*radius,radius)),
                Vector3(x,y-.08,z)))
        else:
            meadow.append(Transform3D(basis.scaled(Vector3(radius,.69*radius,radius)),
                Vector3(x,y-.03,z)))
        if trial%5==0:
            var flower := Transform3D(basis.scaled(Vector3.ONE*rng.randf_range(.75,1.20)),
                Vector3(x,y,z))
            match trial%3:
                0: blooms_white.append(flower)
                1: blooms_gold.append(flower)
                2: blooms_rose.append(flower)
    _instance(zone,"LandscapeMeadowGrassGroundCoverGPU",
        _growth_mesh(5,.44),meadow,"8caa61")
    _instance(zone,"LandscapeHeatherAndHerbsGPU",
        _growth_mesh(8,.70),clusters,"54763b")
    var petals: Mesh = _flower_mesh()
    _instance(zone,"ShireCreamWildflowersGPU",petals,blooms_white,"e7d7bd")
    _instance(zone,"ShireGoldenWildflowersGPU",petals,blooms_gold,"cbb05c")
    _instance(zone,"ShireMeadowRoseFlowersGPU",petals,blooms_rose,"c78d88")

static func _river(zone: Node3D, height: Callable, river_x: Callable) -> void:
    var rng := RandomNumberGenerator.new()
    rng.seed = SEED+42
    var reeds: Array[Transform3D] = []
    var boulders: Array[Transform3D] = []
    var foam: Array[Transform3D] = []
    var pebble := SphereMesh.new()
    pebble.radial_segments = 9
    pebble.rings = 5
    var ripple := SphereMesh.new()
    ripple.radial_segments = 10
    ripple.rings = 5
    for n in range(1250):
        var z: float = rng.randf_range(-91.0,94.0)
        var shore: float = float(river_x.call(z))
        var side: float = -1.0 if n%2==0 else 1.0
        var x: float = shore+side*rng.randf_range(3.55,8.9)
        if Vector2(x,z).distance_to(Vector2(42.0,8.0))<8.0:
            continue
        var y: float = float(height.call(x,z))
        var rotation := Basis(Vector3.UP,rng.randf_range(-PI,PI))
        if n%3!=0:
            reeds.append(Transform3D(rotation.scaled(Vector3(
                rng.randf_range(.70,1.30),rng.randf_range(.80,1.70),
                rng.randf_range(.70,1.30))),Vector3(x,y-.06,z)))
        else:
            boulders.append(Transform3D(rotation.scaled(Vector3(
                rng.randf_range(.20,.70),rng.randf_range(.19,.48),
                rng.randf_range(.24,.75))),Vector3(x,y+.10,z)))
        if n%7==0:
            var river_middle: float = shore+rng.randf_range(-2.15,2.15)
            var foam_y: float = float(height.call(shore,z))+.17
            foam.append(Transform3D(rotation.scaled(Vector3(
                rng.randf_range(.12,.42),.045,rng.randf_range(.35,.78))),
                Vector3(river_middle,foam_y,z)))
    _instance(zone,"RiverbankOrganicReedsGPU",_growth_mesh(7,.28),
        reeds,"688b5b")
    _instance(zone,"WaterRoundedRiverPebblesGPU",pebble,boulders,"858f7e")
    _instance(zone,"WaterSurfaceDriftFoamGPU",ripple,foam,"c4d6c8")

static func _orchards(zone: Node3D, height: Callable) -> void:
    var rng := RandomNumberGenerator.new()
    rng.seed = SEED+84
    var apples: Array[Transform3D] = []
    var leaf_mesh: Mesh = _growth_mesh(6,.31)
    for row in range(12):
        for col in range(16):
            var x: float = -88.0+float(col)*2.6+rng.randf_range(-.2,.2)
            var z: float = 9.5+float(row)*3.0+rng.randf_range(-.2,.2)
            var y: float = float(height.call(x,z))
            var grow := Basis(Vector3.UP,rng.randf_range(-PI,PI))
            apples.append(Transform3D(grow.scaled(Vector3(
                rng.randf_range(.52,.90),rng.randf_range(.40,.8),
                rng.randf_range(.52,.90))),Vector3(x,y+.1,z)))
    _instance(zone,"FruitOrchardUnderplantingGPU",leaf_mesh,apples,"799a51")

static func populate(world: Node3D, height: Callable, river_x: Callable) -> void:
    if world.get_node_or_null("HobbitonLayeredGroundEcology") != null:
        return
    var root := Node3D.new()
    root.name = "HobbitonLayeredGroundEcology"
    world.add_child(root)
    var meadow := Node3D.new()
    meadow.name = "WholeTownMeadowAndFlowers"
    root.add_child(meadow)
    _scatter(meadow,height,river_x)
    var river := Node3D.new()
    river.name = "LivingRiverbankAndWhitewater"
    root.add_child(river)
    _river(river,height,river_x)
    var orchards := Node3D.new()
    orchards.name = "FruitGrovesAndOrchardGround"
    root.add_child(orchards)
    _orchards(orchards,height)
    root.set_meta("whole_town_dressing",true)
