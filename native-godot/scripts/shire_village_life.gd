class_name ShireVillageLife
extends Node3D
## FILM-EXPANDED / ORIGINAL-GAME: lightweight animation layer for lived-in Shire props.
## 35 domestic details with a small shared animation tick, not a physics agent per prop.
var motion_nodes: Array[Node3D] = []
var phase_values: Array[float] = []
var kinds: Array[int] = []
var lantern_glows: Array[OmniLight3D] = []
var _mat_cache: Dictionary = {}

func _material(tint: Color) -> StandardMaterial3D:
    var key: String=tint.to_html()
    if _mat_cache.has(key):
        return _mat_cache[key]
    var m:=StandardMaterial3D.new()
    m.albedo_color=tint
    m.roughness=.92
    _mat_cache[key]=m
    return m

func _box(parent: Node3D, at: Vector3, extent: Vector3, tint: Color) -> void:
    var node:=MeshInstance3D.new()
    var shape:=BoxMesh.new()
    shape.size=extent
    node.mesh=shape
    node.material_override=_material(tint)
    node.position=at
    node.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(node)

func _flag(where: Vector3, seed_number: int) -> void:
    var anchor:=Node3D.new()
    anchor.position=where
    anchor.name="GardenBunting"
    add_child(anchor)
    _box(anchor,Vector3(0,1.5,0),Vector3(.06,3,.06),Color("76533a"))
    var pivot:=Node3D.new()
    pivot.position=Vector3(0,2.7,0)
    anchor.add_child(pivot)
    _box(pivot,Vector3(.47,0,0),Vector3(.94,.36,.055),
        [Color("aa6f49"),Color("7b8652"),Color("9c705e")][seed_number%3])
    motion_nodes.append(pivot)
    phase_values.append(float(seed_number)*.63)
    kinds.append(0)

func _windmill(where: Vector3) -> void:
    var root:=Node3D.new()
    root.name="GardenWeatherVane"
    root.position=where
    add_child(root)
    _box(root,Vector3(0,1.6,0),Vector3(.08,3.2,.08),Color("695a45"))
    var vane:=Node3D.new()
    vane.position=Vector3(0,3.18,0)
    root.add_child(vane)
    _box(vane,Vector3(.42,0,0),Vector3(.84,.08,.08),Color("b19467"))
    _box(vane,Vector3(.80,0,0),Vector3(.24,.40,.06),Color("9b6848"))
    motion_nodes.append(vane)
    phase_values.append(.0)
    kinds.append(1)

func _garden_props(where: Vector3, id: int) -> void:
    var root:=Node3D.new()
    root.position=where
    root.name="DomesticGardenProps"
    add_child(root)
    for i in range(4):
        var offset:=Vector3(float(i%2)*1.05-.52,0,float(i/2)*.85)
        _box(root,offset+Vector3(0,.13,0),Vector3(.86,.25,.67),Color("6c4a32"))
        _box(root,offset+Vector3(0,.31,0),Vector3(.70,.12,.51),Color("58693b"))
    _box(root,Vector3(1.6,.42,.60),Vector3(1.15,.07,.68),Color("a47d4b"))
    _box(root,Vector3(1.0,.23,.60),Vector3(.08,.45,.08),Color("6f5539"))
    _box(root,Vector3(2.1,.23,.60),Vector3(.08,.45,.08),Color("6f5539"))
    var wash:=Node3D.new()
    wash.position=Vector3(0,2.5,-1.1)
    root.add_child(wash)
    _box(wash,Vector3(0,0,0),Vector3(2.65,.035,.035),Color("a08d70"))
    for n in range(3):
        _box(wash,Vector3(-.7+float(n)*.66,-.30,0),Vector3(.48,.55,.045),
            [Color("a9a07f"),Color("7a8a65"),Color("b1866a")][(n+id)%3])
    motion_nodes.append(wash)
    phase_values.append(float(id)*.43)
    kinds.append(2)

func populate(terrain: Callable) -> void:
    var house_gardens: Array[Vector2]=[
        Vector2(-34,-27),Vector2(-50,-25),Vector2(-52,-2),
        Vector2(-24,-44),Vector2(8,32),Vector2(23,29)
    ]
    for i in range(house_gardens.size()):
        var xy: Vector2=house_gardens[i]
        var position_on_ground:=Vector3(xy.x,float(terrain.call(xy.x,xy.y)),xy.y)
        _garden_props(position_on_ground,i)
        _flag(position_on_ground+Vector3(2.4,0,-1.2),i)
    _windmill(Vector3(8,float(terrain.call(8,33)),33))
    _windmill(Vector3(-52,float(terrain.call(-52,-7)),-7))

func tick(seconds: float, wind_strength: float, delta: float) -> void:
    for i in range(motion_nodes.size()):
        var node: Node3D=motion_nodes[i]
        if not is_instance_valid(node):
            continue
        var phase: float=phase_values[i]
        match kinds[i]:
            0: node.rotation.y=sin(seconds*1.6+phase)*.27*wind_strength
            1: node.rotation.y=seconds*.32*wind_strength+phase
            2: node.rotation.x=sin(seconds*2.8+phase)*.055*wind_strength
