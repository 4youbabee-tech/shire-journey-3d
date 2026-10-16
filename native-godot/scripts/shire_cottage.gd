class_name ShireCottage
extends Node3D
## ORIGINAL-GAME, low-spec explorable interiors for Hobbiton homes.
const ENTRY := Vector3(0.0,0.25,1.0)
const EXIT := Vector3(0.0,0.0,4.75)
const READING := Vector3(-3.3,0.0,-1.5)
const PANTRY := Vector3(3.25,0.0,-1.2)
const HEARTH := Vector3(0.0,0.0,-3.2)
var variant_id := "hill_cottage"
var display_name := "Hobbiton cottage"
var materials: Dictionary = {}

func _ready() -> void:
    _build()

func _material(hex: String) -> StandardMaterial3D:
    if materials.has(hex):
        return materials[hex]
    var mat := StandardMaterial3D.new()
    mat.albedo_color = Color(hex)
    mat.roughness=.89
    materials[hex]=mat
    return mat

func _block(at: Vector3, size: Vector3, tint: String, solid: bool = false) -> void:
    var node := MeshInstance3D.new()
    var geom := BoxMesh.new()
    geom.size = size
    node.mesh = geom
    node.material_override = _material(tint)
    if solid:
        var fixed := StaticBody3D.new()
        fixed.position = at
        add_child(fixed)
        var collision := CollisionShape3D.new()
        var shape := BoxShape3D.new()
        shape.size = size
        collision.shape = shape
        fixed.add_child(collision)
        fixed.add_child(node)
    else:
        node.position = at
        add_child(node)

func _bowl(at: Vector3, radius: float, color: String) -> void:
    var node := MeshInstance3D.new()
    var geom := SphereMesh.new()
    node.mesh=geom
    node.position=at
    node.scale=Vector3(radius,radius*.55,radius)
    node.material_override=_material(color)
    add_child(node)

func _build() -> void:
    var wood: String="71503a" if variant_id=="bagshot_cottage" else "8a613d" if variant_id=="garden_cottage" else "6a503c"
    var wall: String="c5af85" if variant_id=="bagshot_cottage" else "b6ab87" if variant_id=="garden_cottage" else "c0a181"
    name=display_name
    _block(Vector3(0,-.22,0),Vector3(12,.44,10),"936f4c",true)
    _block(Vector3(0,3.55,0),Vector3(12,.36,10),wall,true)
    _block(Vector3(0,1.7,-5),Vector3(12,3.4,.35),wall,true)
    for x in [-6.0,6.0]:
        _block(Vector3(x,1.7,0),Vector3(.35,3.4,10),wall,true)
    _block(Vector3(-3.9,1.7,5),Vector3(4.2,3.4,.35),wall,true)
    _block(Vector3(3.9,1.7,5),Vector3(4.2,3.4,.35),wall,true)
    _block(Vector3(0,3.0,5),Vector3(3.5,1.4,.35),wall,true)
    # Partition wall with a real central opening.
    for z in [-3.35,3.35]:
        _block(Vector3(0,1.65,z),Vector3(.30,3.3,3.3),wall,true)
    _block(Vector3(0,3.05,0),Vector3(.32,.7,3.5),wall,true)
    for z in [-3.4,0,3.4]:
        _block(Vector3(0,3.3,z),Vector3(11.4,.22,.30),wood)
    _block(Vector3(-3.3,.75,-1.25),Vector3(2.5,.17,1.1),wood,true)
    for x in [-4.2,-2.4]:
        _block(Vector3(x,.33,-1.25),Vector3(.18,.66,.18),wood)
    _block(Vector3(-5.22,1.2,-3.0),Vector3(.75,2.3,2.6),wood)
    for y in [.5,1.14,1.79]:
        _block(Vector3(-4.85,y,-3.0),Vector3(.7,.1,2.6),"ac8250")
    for i in range(7):
        _block(Vector3(-4.77,.80,-3.96+float(i)*.31),Vector3(.28,.48,.19),"67715f" if i%2==0 else "a78b53")
    _block(Vector3(3.2,.87,-1.0),Vector3(2.65,.18,1.15),wood,true)
    for x in [2.2,4.2]:
        for z in [-1.45,-.55]:
            _block(Vector3(x,.39,z),Vector3(.17,.8,.17),wood)
    for i in range(4):
        _bowl(Vector3(2.4+float(i)*.52,1.08,-.95),.22,"cca469")
    _block(Vector3(4.9,1.05,2.9),Vector3(.8,2.1,1.85),wood)
    _block(Vector3(-3.8,.35,2.9),Vector3(2.4,.5,1.65),"785238",true)
    _block(Vector3(-3.8,.64,2.9),Vector3(2.25,.13,1.5),"bcae88")
    _block(Vector3(-3.8,.78,3.42),Vector3(1.15,.20,.5),"e0cfad")
    _block(Vector3(0,.98,-4.79),Vector3(1.85,1.8,.40),"6b6253",true)
    _block(Vector3(0,.42,-4.49),Vector3(1.18,.65,.12),"35271e")
    _bowl(Vector3(0,.34,-4.30),.36,"dc853d")
    var light := OmniLight3D.new()
    light.position=Vector3(0,2.5,-3)
    light.light_color=Color("ffe0a4")
    light.light_energy=1.25
    light.omni_range=10.0
    light.shadow_enabled=false
    add_child(light)
    for i in range(6):
        _bowl(Vector3(3.35+float(i%3)*.42,.17,2.05+float(i/3)*.36),.21,"c5a074")
    for i in range(6):
        _block(Vector3(-4.7+float(i)*.31,2.38,-3.1),Vector3(.18,.34,.28),"796849" if i%2==0 else "a78b53")

func interaction_at(point: Vector3) -> String:
    if point.distance_to(EXIT)<1.7:
        return "exit"
    if point.distance_to(READING)<2.0:
        return "reading"
    if point.distance_to(PANTRY)<2.0:
        return "pantry"
    if point.distance_to(HEARTH)<1.65:
        return "hearth"
    return ""
