class_name ShireAnimal
extends Node3D
## Original village ecology. Offline deterministic behaviour with daylight/rain shelter.
var species: String = "hen"
var home: Vector3 = Vector3.ZERO
var seed_number: int = 0
var age_seconds: float = 0.0
var destination: Vector3 = Vector3.ZERO
var body: Node3D
var gait: float = 0.0
var energy: float = 1.0

func setup(kind: String, point: Vector3, index: int) -> void:
    species = kind
    home = point
    destination = home
    position = point
    seed_number = index
    body = Node3D.new()
    add_child(body)
    if species == "hen":
        _part(Vector3(0,.20,0),Vector3(.29,.23,.36),Color("ad7852"),0)
        _part(Vector3(0,.40,-.21),Vector3(.16,.17,.19),Color("d7ac74"),0)
        _part(Vector3(0,.43,-.41),Vector3(.095,.05,.15),Color("d5aa48"),1)
        _part(Vector3(0,.60,-.22),Vector3(.065,.13,.045),Color("a74430"),0)
        for side in [-1.0,1.0]:
            _part(Vector3(side*.15,.22,.04),Vector3(.13,.18,.2),Color("855634"),0)
            _part(Vector3(side*.13,.03,.12),Vector3(.025,.10,.025),Color("d1a05e"),1)
    elif species == "rabbit":
        _part(Vector3(0,.23,0),Vector3(.26,.22,.40),Color("908274"),0)
        _part(Vector3(0,.32,-.30),Vector3(.20,.19,.19),Color("a5967e"),0)
        for side in [-1.0,1.0]:
            _part(Vector3(side*.12,.62,-.33),Vector3(.085,.29,.084),Color("b5a18c"),0)
        _part(Vector3(0,.29,.37),Vector3(.13,.13,.13),Color("dfd4bf"),0)
    else:
        _part(Vector3(0,.2,0),Vector3(.075,.095,.20),Color("8d734a"),0)
        for side in [-1.0,1.0]:
            _part(Vector3(side*.13,.26,0),Vector3(.22,.015,.145),Color("ddc879"),0)

func _part(point: Vector3, size_value: Vector3, tint: Color, box_shape: int) -> void:
    var mesh:=MeshInstance3D.new()
    mesh.mesh=BoxMesh.new() if box_shape==1 else SphereMesh.new()
    mesh.position=point
    mesh.scale=size_value
    var mat:=StandardMaterial3D.new()
    mat.albedo_color=tint
    mat.roughness=.91
    mesh.material_override=mat
    mesh.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    body.add_child(mesh)

func tick(game_hour: float, raining: bool, player_position: Vector3, dt: float, game_seconds: float, world: ShireWorld) -> void:
    age_seconds+=dt
    var tired:=game_hour<6.0 or game_hour>20.0
    var wandering:=not (raining or tired)
    if species=="butterfly" and (raining or tired):
        visible=false
        return
    var span:=7.0+float(seed_number%5)*1.7
    var cycle:=floorf(game_seconds/span)
    var random_angle:=sin(float(seed_number)*17.17+cycle*2.31)*TAU
    var radius: float = 2.8 if species=="hen" else 4.2 if species=="rabbit" else 3.2
    var gx:=home.x+(cos(random_angle)*radius if wandering else 0.0)
    var gz:=home.z+(sin(random_angle)*radius if wandering else 0.0)
    var distance:=position.distance_to(player_position)
    if species=="rabbit" and distance<3.5 and wandering:
        gx+=signf(position.x-player_position.x)*4.0
        gz+=signf(position.z-player_position.z)*4.0
    destination=Vector3(gx,world.elevation(gx,gz),gz)
    var to_target:=Vector2(destination.x-position.x,destination.z-position.z)
    if to_target.length()>.18:
        var speed:=.37 if species=="hen" else 1.05 if species=="rabbit" else .58
        var moved:=to_target.normalized()*minf(to_target.length(),dt*speed)
        position.x+=moved.x
        position.z+=moved.y
        body.rotation.y=lerp_angle(body.rotation.y,atan2(moved.x,moved.y),dt*3.0)
        gait+=dt*(6.0 if species=="rabbit" else 3.0)
    position.y=world.elevation(position.x,position.z)
    body.position.y=(.22+sin(game_seconds*2+seed_number)*.16) if species=="butterfly" else maxf(0.0,sin(gait))*.09 if species=="rabbit" else sin(gait)*.018
    energy=clampf(energy+(-dt*.015 if wandering else dt*.02),0.0,1.0)
    visible=distance<52.0

func pack() -> Dictionary:
    return {"pos":[position.x,position.y,position.z],"energy":energy,"age":age_seconds}

func unpack(data: Dictionary) -> void:
    if data.get("pos") is Array and data["pos"].size()==3:
        var a: Array=data["pos"]
        position=Vector3(clampf(float(a[0]),-100.0,100.0),clampf(float(a[1]),-50.0,75.0),clampf(float(a[2]),-100.0,100.0))
    energy=clampf(float(data.get("energy",1.0)),0.0,1.0)
    age_seconds=maxf(0.0,float(data.get("age",0.0)))