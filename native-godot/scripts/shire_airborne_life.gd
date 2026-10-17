class_name ShireAirborneLife
extends Node3D
## Twenty-four original geometry butterflies in six Shire meadows.
## No external images, collision, rigidbodies or per-flight pathfinding.
var fliers: Array[Node3D]=[]
var wings: Array[Array]=[]
var homes: Array[Vector3]=[]
var phase: Array[float]=[]
var time_value: float=0.0

static func _material(hex: String) -> StandardMaterial3D:
    var mat:=StandardMaterial3D.new()
    mat.albedo_color=Color(hex)
    mat.roughness=.8
    mat.cull_mode=BaseMaterial3D.CULL_DISABLED
    return mat

static func _wing(pivot: Node3D, material: Material, side: float) -> void:
    var object:=MeshInstance3D.new()
    var sphere:=SphereMesh.new()
    sphere.radial_segments=8
    sphere.rings=5
    object.mesh=sphere
    object.scale=Vector3(.22,.045,.17)
    object.position=Vector3(side*.16,0,0)
    object.material_override=material
    object.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    pivot.add_child(object)

func populate(terrain: Callable) -> void:
    var clearings: Array[Vector2]=[
        Vector2(-10,21),Vector2(0,48),Vector2(-71,-39),
        Vector2(25,53),Vector2(-54,59),Vector2(-8,-24)]
    var colors: Array[StandardMaterial3D]=[
        _material("e4c36e"),_material("c28a9c"),
        _material("ae9fc8"),_material("afc57b")]
    var dark:=_material("655441")
    for i in range(24):
        var center: Vector2=clearings[int(i/4)]
        var angle: float=float(i%4)*TAU/4.0+float(i)*.41
        var x: float=center.x+cos(angle)*(1.6+float(i%3)*1.1)
        var z: float=center.y+sin(angle)*(1.6+float(i%3)*1.1)
        var point:=Vector3(x,float(terrain.call(x,z))+1.05,z)
        var flyer:=Node3D.new()
        flyer.name="ShireButterfly_%02d" % i
        flyer.position=point
        add_child(flyer)
        var body:=MeshInstance3D.new()
        var body_mesh:=SphereMesh.new()
        body_mesh.radial_segments=8
        body_mesh.rings=5
        body.mesh=body_mesh
        body.scale=Vector3(.04,.065,.14)
        body.material_override=dark
        body.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
        flyer.add_child(body)
        var left:=Node3D.new()
        left.name="LeftWing"
        flyer.add_child(left)
        _wing(left,colors[i%colors.size()],-1.0)
        var right:=Node3D.new()
        right.name="RightWing"
        flyer.add_child(right)
        _wing(right,colors[i%colors.size()],1.0)
        fliers.append(flyer)
        homes.append(point)
        wings.append([left,right])
        phase.append(float(i)*1.37)

func tick(delta: float, weather: String, daylight: float) -> void:
    time_value+=minf(delta,.1)
    var active: bool=daylight>.28 and weather not in ["heavy_rain","storm"]
    for i in range(fliers.size()):
        var f: Node3D=fliers[i]
        f.visible=active
        if not active:
            continue
        var p: float=phase[i]
        f.position=homes[i]+Vector3(sin(time_value*.46+p)*.72,
            sin(time_value*.87+p*1.2)*.24,
            cos(time_value*.52+p)*.66)
        f.rotation.y=sin(time_value*.31+p)*.56
        var flap: float=sin(time_value*13.0+p)*.57
        var pair: Array=wings[i]
        (pair[0] as Node3D).rotation.z=.25+flap
        (pair[1] as Node3D).rotation.z=-.25-flap
