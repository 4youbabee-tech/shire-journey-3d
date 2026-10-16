class_name ShireLicensedProps
extends RefCounted
## Reproducibly sourced CC0 furniture. References only local, verified imported glTF.
const BASE := "res://assets/props/kaykit_furniture_cc0/"

static func place(root: Node3D, item: String, at: Vector3, factor: float = 1.0, heading: float = 0.0) -> Node3D:
    var asset_path: String = BASE + item + ".gltf"
    if not ResourceLoader.exists(asset_path):
        return null
    var resource: Resource = load(asset_path)
    if not resource is PackedScene:
        return null
    var model: Node = (resource as PackedScene).instantiate()
    if not model is Node3D:
        model.free()
        return null
    var visual: Node3D = model as Node3D
    visual.name = "CC0_" + item
    visual.position = at
    visual.scale = Vector3.ONE * factor
    visual.rotation.y = heading
    root.add_child(visual)
    return visual

static func _furniture_parent(owner: Node3D) -> Node3D:
    var node := Node3D.new()
    node.name = "CC0_Furniture"
    owner.add_child(node)
    return node

static func dress_bag_end(owner: Node3D) -> int:
    var display := _furniture_parent(owner)
    var props: Array = [
        ["shelf_B_large_decorated",Vector3(-8.10,0.02,-5.96),.62,0.0],
        ["cabinet_small_decorated",Vector3(8.0,0.0,1.6),.68,-PI/2],
        ["lamp_table",Vector3(-6.35,1.0,-1.2),.28,0.0],
        ["book_set",Vector3(-6.0,1.01,-1.2),.28,-.12],
        ["chair_A_wood",Vector3(-1.9,0.0,2.45),.48,.45],
        ["chair_stool_wood",Vector3(1.9,0.0,-1.45),.56,-.55],
        ["table_small",Vector3(0.80,0.0,3.95),.46,0.0],
        ["bed_single_A",Vector3(-6.1,0.05,3.4),.43,PI/2]
    ]
    var count := 0
    for item in props:
        if place(display,str(item[0]),item[1],float(item[2]),float(item[3])) != null:
            count += 1
    return count

static func dress_cottage(owner: Node3D, variant_id: String) -> int:
    var display := _furniture_parent(owner)
    var offset: float = .12 if variant_id=="bagshot_cottage" else -.12 if variant_id=="garden_cottage" else .0
    var props: Array = [
        ["table_medium",Vector3(2.95+offset,0.0,1.35),.40,0.0],
        ["chair_A_wood",Vector3(2.0+offset,0.0,1.70),.45,.55],
        ["chair_stool_wood",Vector3(4.0,0.0,.45),.52,-.36],
        ["shelf_B_large_decorated",Vector3(-5.15,0.0,-4.35),.53,0.0],
        ["cabinet_small_decorated",Vector3(4.65,0.0,3.65),.52,0.0],
        ["bed_single_A",Vector3(-3.7,0.0,3.0),.38,PI/2]
    ]
    var count := 0
    for item in props:
        if place(display,str(item[0]),item[1],float(item[2]),float(item[3])) != null:
            count += 1
    return count

static func dress_market(owner: Node3D, terrain: Callable) -> int:
    var display := _furniture_parent(owner)
    var placements: Array[Vector2] = [Vector2(12,6),Vector2(19,5),Vector2(25,9),Vector2(15,14)]
    var count := 0
    for xy in placements:
        var point := Vector3(xy.x,float(terrain.call(xy.x,xy.y))+.08,xy.y)
        if place(display,"table_medium",point,.37,.2) != null:
            count += 1
        if place(display,"chair_stool_wood",point+Vector3(.88,0,.45),.36,0.0) != null:
            count += 1
    return count
