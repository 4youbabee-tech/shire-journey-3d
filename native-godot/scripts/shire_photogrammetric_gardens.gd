class_name ShirePhotogrammetricGardens
extends RefCounted
## Instanced real CC0 1K Poly Haven scans, not cubes painted green.
## Source: shrub_03, verified by vendor_polyhaven_realistic.py SHA256 manifests.
## Many shrubs share the imported PBR mesh and textures for lower draw calls.

const MODEL := "res://assets/props/polyhaven_realistic_cc0/shrub_03/asset.gltf"
const SEED := 2026101712

static func _offset_from_root(target: Node3D, root: Node3D) -> Transform3D:
    var relative := Transform3D.IDENTITY
    var node: Node = target
    while node != root and node != null:
        if node is Node3D:
            relative = (node as Node3D).transform * relative
        node = node.get_parent()
    return relative

static func _plant_locations(height: Callable, river_x: Callable) -> Array[Transform3D]:
    var rng := RandomNumberGenerator.new()
    rng.seed=SEED
    var out: Array[Transform3D] = []
    var homes: Array[Vector2] = [
        Vector2(-24,-20),Vector2(-44,-26),Vector2(-45,-3),
        Vector2(-18,-39),Vector2(2,30),Vector2(18,28),
        Vector2(-62,-12),Vector2(-61,11),Vector2(-34,45),Vector2(32,40)
    ]
    for home in homes:
        for side in [-1,1]:
            for plant in range(4):
                var x: float = home.x + float(side)*(6.1+rng.randf_range(-.5,.7))
                var z: float = home.y - 2.0+float(plant)*1.55
                var y: float = float(height.call(x,z))
                var scale_value: float = rng.randf_range(.42,.77)
                var angle: float = rng.randf_range(-PI,PI)
                out.append(Transform3D(Basis(Vector3.UP,angle).scaled(Vector3.ONE*scale_value),Vector3(x,y-.15,z)))
    for i in range(28):
        var z: float = -62.0+float(i)*5.35
        if absf(z-8.0)<9.0:
            z += 11.0
        var side: float = -1.0 if i%2==0 else 1.0
        var x: float = float(river_x.call(z))+side*rng.randf_range(6.7,8.3)
        var y: float = float(height.call(x,z))
        out.append(Transform3D(Basis(Vector3.UP,rng.randf_range(-PI,PI)).scaled(
            Vector3.ONE*rng.randf_range(.43,.72)),Vector3(x,y-.19,z)))
    var market: Array[Vector2] = [
        Vector2(6,23),Vector2(7,27),Vector2(12,24),Vector2(17,25),
        Vector2(27,12),Vector2(30,19),Vector2(34,15),Vector2(34,9)
    ]
    for spot in market:
        for offset in [Vector2(-.8,-.6),Vector2(1.0,.5)]:
            var x: float = spot.x+offset.x
            var z: float = spot.y+offset.y
            var y: float = float(height.call(x,z))
            out.append(Transform3D(Basis(Vector3.UP,rng.randf_range(-PI,PI)).scaled(
                Vector3.ONE*rng.randf_range(.47,.75)),Vector3(x,y-.16,z)))
    return out

static func populate(world: Node3D, height: Callable, river_x: Callable) -> int:
    if world.get_node_or_null("HobbitonPhotogrammetricShrubClusters") != null:
        return 0
    if not ResourceLoader.exists(MODEL):
        return 0
    var packed: PackedScene = load(MODEL) as PackedScene
    if packed == null:
        return 0
    var prefab: Node3D = packed.instantiate() as Node3D
    if prefab == null:
        return 0
    var imported: Array[Node] = prefab.find_children("*","MeshInstance3D",true,false)
    var transforms: Array[Transform3D] = _plant_locations(height,river_x)
    if imported.is_empty() or transforms.size() < 100:
        prefab.free()
        return 0
    var root := Node3D.new()
    root.name = "HobbitonPhotogrammetricShrubClusters"
    world.add_child(root)
    var count := 0
    var mesh_index := 0
    for entry in imported:
        var source: MeshInstance3D = entry as MeshInstance3D
        if source == null or source.mesh == null:
            continue
        var copies := MultiMesh.new()
        copies.transform_format=MultiMesh.TRANSFORM_3D
        copies.mesh=source.mesh
        copies.instance_count=transforms.size()
        var mesh_offset: Transform3D = _offset_from_root(source,prefab)
        for i in range(transforms.size()):
            copies.set_instance_transform(i,transforms[i]*mesh_offset)
        var view := MultiMeshInstance3D.new()
        view.name = "PolyHavenCC0PBR_ShrubMesh_%02d" % mesh_index
        view.multimesh = copies
        view.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
        if source.material_override != null:
            view.material_override=source.material_override
        for part in range(source.mesh.get_surface_count()):
            var surface_material: Material = source.get_surface_override_material(part)
            if surface_material != null:
                view.set_surface_override_material(part,surface_material)
        root.add_child(view)
        count += 1
        mesh_index += 1
    prefab.free()
    root.set_meta("verified_cc0_photogrammetry",count>0)
    root.set_meta("visible_shrubs",transforms.size())
    return transforms.size() if count>0 else 0
