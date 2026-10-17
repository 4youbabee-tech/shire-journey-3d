class_name ShireTreeGrove
extends RefCounted
## Authored original stylized woodland. GPU instancing, no colliders or animation
## scripts per tree; purpose-built for 720p / low-VRAM Chapter I.
const TREE_COUNT := 68

static func _material(colour: Color) -> StandardMaterial3D:
    var mat := StandardMaterial3D.new()
    mat.albedo_color = colour
    mat.roughness = 0.98
    mat.metallic = 0.0
    return mat

static func _batch(parent: Node3D, title: String, geometry: Mesh, placements: Array[Transform3D], tint: Color) -> void:
    if placements.is_empty():
        return
    var instances := MultiMesh.new()
    instances.transform_format = MultiMesh.TRANSFORM_3D
    instances.mesh = geometry
    instances.instance_count = placements.size()
    for idx in range(placements.size()):
        instances.set_instance_transform(idx, placements[idx])
    var visual := MultiMeshInstance3D.new()
    visual.name = title
    visual.multimesh = instances
    visual.material_override = _material(tint)
    visual.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(visual)

static func _placement(pos: Vector3, size: Vector3, yaw: float = 0.0, incline: float = 0.0) -> Transform3D:
    var axes := Basis(Vector3.UP, yaw)
    axes = axes.rotated(axes.x.normalized(), incline)
    return Transform3D(axes.scaled(size), pos)

static func populate(parent: Node3D, elevation: Callable, river_x: Callable) -> void:
    if parent.get_node_or_null("ShireLayeredWoodland") != null:
        return
    var grove := Node3D.new()
    grove.name = "ShireLayeredWoodland"
    parent.add_child(grove)
    var rng := RandomNumberGenerator.new()
    rng.seed = 2026101704
    var bark: Array[Transform3D] = []
    var branches: Array[Transform3D] = []
    var foliage_light: Array[Transform3D] = []
    var foliage_mid: Array[Transform3D] = []
    var foliage_dark: Array[Transform3D] = []
    var leafy := SphereMesh.new()
    leafy.radial_segments = 9
    leafy.rings = 5
    var trunk := CylinderMesh.new()
    trunk.top_radius = 0.24
    trunk.bottom_radius = 0.41
    trunk.height = 1.0
    trunk.radial_segments = 7
    var twig := CylinderMesh.new()
    twig.top_radius = 0.075
    twig.bottom_radius = 0.12
    twig.height = 1.0
    twig.radial_segments = 5
    var placed := 0
    # Three distinct silhouettes: field oak, slender beech and riverside alder.
    # Keep village roads, accessible doors, party field and water clear.
    for attempt in range(TREE_COUNT * 6):
        if placed >= TREE_COUNT:
            break
        var x := rng.randf_range(-94.0,94.0)
        var z := rng.randf_range(-91.0,91.0)
        if absf(x-float(river_x.call(z))) < 10.0:
            continue
        if Vector2(x,z).distance_to(Vector2(-24.0,-20.0)) < 17.0:
            continue
        if Vector2(x,z).distance_to(Vector2(17.0,8.0)) < 19.0:
            continue
        if Vector2(x,z).length() < 16.0:
            continue
        var doors := [Vector2(-44,-26),Vector2(-45,-3),Vector2(-18,-39),Vector2(2,30),Vector2(18,28),Vector2(-62,-12),Vector2(-61,11),Vector2(-34,45),Vector2(32,40)]
        var blocked := false
        for door in doors:
            if Vector2(x,z).distance_to(door) < 9.0:
                blocked = true
                break
        if blocked:
            continue
        var kind := placed % 3
        var size := rng.randf_range(0.82,1.22)
        var height := (6.9 if kind == 0 else 8.1 if kind == 1 else 5.9) * size
        var ground := float(elevation.call(x,z))
        var yaw := rng.randf_range(-PI,PI)
        bark.append(_placement(Vector3(x,ground+height*0.42,z),Vector3(size,height*0.84,size),yaw))
        var crown_y := ground+height*(0.88 if kind == 1 else 0.79)
        var spread := (2.45 if kind == 0 else 1.6 if kind == 1 else 2.2)*size
        var upper := (2.0 if kind == 0 else 2.9 if kind == 1 else 1.7)*size
        foliage_dark.append(_placement(Vector3(x,crown_y,z),Vector3(spread*1.2,upper*1.08,spread*1.1),yaw))
        for segment in range(5 if kind == 0 else 4):
            var angle := yaw + TAU*float(segment)/(5.0 if kind == 0 else 4.0)
            var direction := Vector3(cos(angle),0.0,sin(angle))
            var out := spread*rng.randf_range(0.58,0.84)
            var rise := rng.randf_range(-0.3,0.7)*size
            var start := Vector3(x,ground+height*0.67,z)
            var endpoint := Vector3(x,crown_y+rise,z)+direction*out
            var delta := endpoint-start
            var basis := Basis(Quaternion(Vector3.UP,delta.normalized()))
            branches.append(Transform3D(basis.scaled(Vector3(size*0.85,delta.length(),size*0.85)),(start+endpoint)*0.5))
            var tuft := Vector3(spread*0.72,upper*0.68,spread*0.72)
            var transform := _placement(endpoint,tuft,angle)
            if segment % 2 == 0:
                foliage_mid.append(transform)
            else:
                foliage_light.append(transform)
        foliage_light.append(_placement(Vector3(x,crown_y+upper*0.56,z),Vector3(spread*0.68,upper*0.76,spread*0.66),yaw))
        placed += 1
    _batch(grove,"01_BarkTrunks",trunk,bark,Color("68503a"))
    _batch(grove,"02_BranchWhorls",twig,branches,Color("574432"))
    _batch(grove,"03_DeepLeafVolume",leafy,foliage_dark,Color("426448"))
    _batch(grove,"04_MidLeafVolume",leafy,foliage_mid,Color("66844d"))
    _batch(grove,"05_SunlitLeafTips",leafy,foliage_light,Color("87a660"))
