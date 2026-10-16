class_name ShirePhotorealProps
extends RefCounted
## Poly Haven CC0 photogrammetric PBR assets: texture fidelity prioritized at landmarks.
## Only 1K versions are admitted in CI, with sha256 receipts; no actor/film likenesses.
const ROOT := "res://assets/props/polyhaven_realistic_cc0/"
const FURNITURE := ["wooden_table_02","painted_wooden_table","wooden_lantern_01"]
const FOLIAGE := "shrub_03"
static var _loaded_scenes: Dictionary = {}

static func available(asset_id: String) -> bool:
    return ResourceLoader.exists(ROOT + asset_id + "/asset.gltf")

static func place(owner: Node3D, asset_id: String, where: Vector3, factor: float = 1.0, angle: float = 0.0) -> Node3D:
    var asset_path: String = ROOT + asset_id + "/asset.gltf"
    if not ResourceLoader.exists(asset_path):
        return null
    if not _loaded_scenes.has(asset_id):
        var loaded: Resource = load(asset_path)
        if not loaded is PackedScene:
            return null
        _loaded_scenes[asset_id] = loaded
    var scene: PackedScene = _loaded_scenes[asset_id]
    var instance: Node = scene.instantiate()
    if not instance is Node3D:
        instance.free()
        return null
    var visual: Node3D = instance as Node3D
    visual.name = "PBR_" + asset_id
    visual.position = where
    visual.rotation.y = angle
    visual.scale = Vector3.ONE * factor
    owner.add_child(visual)
    return visual

static func bag_end(owner: Node3D) -> int:
    var pbr := Node3D.new()
    pbr.name = "PhotorealPBRFurniture"
    owner.add_child(pbr)
    var successes := 0
    var specs: Array = [
        ["painted_wooden_table",Vector3(5.5,.10,3.2),.68,.15],
        ["wooden_table_02",Vector3(-6.15,.10,-1.3),.61,.0],
        ["wooden_lantern_01",Vector3(5.0,1.02,3.2),.66,.12],
    ]
    for item in specs:
        if place(pbr,str(item[0]),item[1],float(item[2]),float(item[3])) != null:
            successes+=1
    if successes >= 2:
        var old: Node=owner.get_node_or_null("CC0_Furniture")
        if old != null:
            old.visible = false
    return successes

static func cottage(owner: Node3D, seed_name: String) -> int:
    var pbr:=Node3D.new()
    pbr.name = "PhotorealPBRFurniture"
    owner.add_child(pbr)
    var scale_shift: float=.90 if seed_name=="bagshot_cottage" else .77
    var items: Array = [
        ["wooden_table_02",Vector3(2.8,.08,1.5),scale_shift,-.4],
        ["wooden_lantern_01",Vector3(2.8,.79,1.5),.44,-.4]
    ]
    var successes:=0
    for item in items:
        if place(pbr,str(item[0]),item[1],float(item[2]),float(item[3])) != null:
            successes+=1
    if successes==items.size():
        var old: Node=owner.get_node_or_null("CC0_Furniture")
        if old!=null:
            old.visible=false
    return successes

static func market(owner: Node3D, terrain_height: Callable) -> int:
    var pbr:=Node3D.new()
    pbr.name="PhotorealPBRMarket"
    owner.add_child(pbr)
    var points: Array[Vector2] = [Vector2(12.5,6.5),Vector2(22.4,12.1),Vector2(15.4,16.0)]
    var successes:=0
    for i in range(points.size()):
        var xy: Vector2=points[i]
        var ground: float=float(terrain_height.call(xy.x,xy.y))
        var asset_id: String=FURNITURE[i%2]
        if place(pbr,asset_id,Vector3(xy.x,ground+.06,xy.y),.65,float(i)*.64) != null:
            successes+=1
    if successes==points.size():
        var old: Node=owner.get_node_or_null("CC0_Furniture")
        if old!=null:
            old.visible=false
    return successes

static func gardens(owner: Node3D, terrain_height: Callable) -> int:
    var greenery:=Node3D.new()
    greenery.name="PhotorealGardenShrubs"
    owner.add_child(greenery)
    var seeds: Array[Vector2]=[
        Vector2(-31,-24),Vector2(-37,-22),Vector2(-29,-30),
        Vector2(-49,-22),Vector2(-54,-27),Vector2(-42,-32),
        Vector2(-51,-4),Vector2(-53,1),Vector2(-38,-7),
        Vector2(-22,-43),Vector2(-13,-44),Vector2(-15,-33),
        Vector2(6,34),Vector2(-4,36),Vector2(4,25),
        Vector2(16,32),Vector2(23,32),Vector2(24,23),
        Vector2(11,16),Vector2(25,15),Vector2(27,4),
        Vector2(31,-26),Vector2(36,-24),Vector2(34,-10)
    ]
    var count:=0
    for i in range(seeds.size()):
        var xy: Vector2=seeds[i]
        var ground: float=float(terrain_height.call(xy.x,xy.y))
        var size_value: float=.45+float((i*7)%5)*.08
        if place(greenery,FOLIAGE,Vector3(xy.x,ground-.10,xy.y),size_value,float(i)*1.7) != null:
            count+=1
    return count
