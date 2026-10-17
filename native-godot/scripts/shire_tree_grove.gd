class_name ShireTreeGrove
extends RefCounted
## Chapter I visual hero grove. Editable ORIGINAL-GAME Blender trunk/branch/leaf meshes.
## The meshes are instanced by GPU; each species shares a mesh and its PBR surfaces.
## Provenance: VISUAL-ONLY composition reference, no movie geometry or materials.
const GROVE_SEED := 2026101704
const MAIN_TREES := 68
const WILLOWS := 10
const SPECIES := ["oak","beech","alder","willow"]
const ASSET_ROOT := "res://assets/models/shire_hero_"

static func _hero_mesh(species: String) -> Mesh:
    var path: String = ASSET_ROOT + species + ".glb"
    if not ResourceLoader.exists(path):
        return null
    var packed: PackedScene = load(path) as PackedScene
    if packed == null:
        return null
    var root: Node = packed.instantiate()
    var candidates: Array[Node] = root.find_children("*","MeshInstance3D",true,false)
    var result: Mesh = null
    for candidate in candidates:
        var instance: MeshInstance3D = candidate as MeshInstance3D
        if instance != null and instance.mesh != null:
            result = instance.mesh
            break
    root.free()
    return result

static func _append(transforms: Array, x: float, y: float,
        z: float, scale_value: float, yaw: float) -> void:
    transforms.append(Transform3D(Basis(Vector3.UP,yaw).scaled(Vector3.ONE*scale_value),
        Vector3(x,y-.13,z)))

static func _batch(parent: Node3D, species: String,
        placements: Array[Transform3D]) -> bool:
    var model: Mesh = _hero_mesh(species)
    if model == null or model.get_surface_count() < 3 or placements.is_empty():
        return false
    var copies := MultiMesh.new()
    copies.transform_format = MultiMesh.TRANSFORM_3D
    copies.mesh = model
    copies.instance_count = placements.size()
    for i in range(placements.size()):
        copies.set_instance_transform(i,placements[i])
    var view := MultiMeshInstance3D.new()
    view.name = "Hero_" + species.capitalize() + "_GPU"
    view.multimesh = copies
    # Preserve mesh's bark and four different leaf material surfaces.
    # Large plant canopies should not cast thousands of overlapping shadows.
    view.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(view)
    return true

static func populate(parent: Node3D, elevation: Callable, river_x: Callable) -> void:
    if parent.get_node_or_null("ShireLayeredWoodland") != null:
        return
    var grove := Node3D.new()
    grove.name = "ShireLayeredWoodland"
    parent.add_child(grove)
    var rng := RandomNumberGenerator.new()
    rng.seed = GROVE_SEED
    var trees: Dictionary = {"oak":[],"beech":[],"alder":[],"willow":[]}
    var placed := 0
    var doors: Array[Vector2] = [
        Vector2(-24,-20),Vector2(-44,-26),Vector2(-45,-3),
        Vector2(-18,-39),Vector2(2,30),Vector2(18,28),
        Vector2(-62,-12),Vector2(-61,11),Vector2(-34,45),Vector2(32,40)
    ]
    for attempt in range(MAIN_TREES*7):
        if placed >= MAIN_TREES:
            break
        var x := rng.randf_range(-94.0,94.0)
        var z := rng.randf_range(-91.0,91.0)
        var point := Vector2(x,z)
        if absf(x-float(river_x.call(z))) < 10.0:
            continue
        if point.distance_to(Vector2(17.0,8.0)) < 18.0:
            continue
        if point.length() < 15.0:
            continue
        var blocked := false
        for door in doors:
            if point.distance_to(door) < (15.0 if door==Vector2(-24,-20) else 8.5):
                blocked = true
                break
        if blocked:
            continue
        var kind: String = SPECIES[placed%3]
        var height: float = float(elevation.call(x,z))
        _append(trees[kind],x,height,z,rng.randf_range(.78,1.22),
                rng.randf_range(-PI,PI))
        placed += 1
    # Drooping, slender willows trace one river bank; avoid the bridge approach.
    for i in range(WILLOWS):
        var z: float = -79.0+float(i)*16.0
        if absf(z-8.0) < 10.0:
            z += 11.0
        var x: float = float(river_x.call(z))-7.4
        _append(trees["willow"],x,float(elevation.call(x,z)),z,
                rng.randf_range(.91,1.17),rng.randf_range(-PI,PI))
    var imported := 0
    for kind in SPECIES:
        var transforms: Array[Transform3D] = []
        for transform in trees[kind]:
            transforms.append(transform)
        if _batch(grove,kind,transforms):
            imported += 1
    # A source checkout before Blender generation still displays the old mesh kit.
    # CI always generates + verifies all four edited Blender sources before import.
    if imported != SPECIES.size():
        for child in grove.get_children():
            child.queue_free()
        var old := load("res://assets/models/old_oak_1.glb") as PackedScene
        var old_willow := load("res://assets/models/river_willow.glb") as PackedScene
        for kind in SPECIES:
            for transform in trees[kind]:
                var source: PackedScene = old_willow if kind=="willow" else old
                var instance: Node3D = source.instantiate() as Node3D
                instance.transform = transform
                grove.add_child(instance)
        grove.set_meta("blender_hero_assets",false)
    else:
        grove.set_meta("blender_hero_assets",true)
    grove.set_meta("tree_count",MAIN_TREES+WILLOWS)
