class_name ShireArchitecture
extends RefCounted
## ORIGINAL-GAME Shire domestic-detail pass, grounded in the project's Location Bible:
## warm scale, circular doors, lived-in thresholds, shutters, garden beds and timber.
## Mesh batching for repeating trim prevents hundreds of per-stone draw calls.
static var _wood: StandardMaterial3D
static var _stone: StandardMaterial3D
static var _metal: StandardMaterial3D
static var _glass: StandardMaterial3D

static func _materials() -> void:
    if _wood != null:
        return
    _wood=ShireSurfaceMaterials.wooden_trim()
    _stone=StandardMaterial3D.new()
    _stone.albedo_color=Color("a69a84")
    _stone.roughness=.96
    _metal=StandardMaterial3D.new()
    _metal.albedo_color=Color("997442")
    _metal.metallic=.66
    _metal.roughness=.48
    _glass=StandardMaterial3D.new()
    _glass.albedo_color=Color("efc67a")
    _glass.emission_enabled=true
    _glass.emission=Color("b58849")
    _glass.emission_energy_multiplier=.35
    _glass.roughness=.35

static func _timber(parent: Node3D, at: Vector3, size_value: Vector3, angle: float=0.0) -> void:
    var mesh:=MeshInstance3D.new()
    var cube:=BoxMesh.new()
    cube.size=size_value
    mesh.mesh=cube
    mesh.position=at
    mesh.rotation.z=angle
    mesh.material_override=_wood
    mesh.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(mesh)

static func _batch(parent: Node3D, name: String, prototype: PrimitiveMesh, count: int, layout: Callable, mat: Material) -> void:
    var multi:=MultiMesh.new()
    multi.transform_format=MultiMesh.TRANSFORM_3D
    multi.instance_count=count
    multi.mesh=prototype
    for idx in range(count):
        multi.set_instance_transform(idx,layout.call(idx))
    var inst:=MultiMeshInstance3D.new()
    inst.name=name
    inst.multimesh=multi
    inst.material_override=mat
    inst.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(inst)

static func decorate(house: Node3D, main_house: bool) -> int:
    _materials()
    var details:=Node3D.new()
    details.name="ShireDetailedFacade"
    house.add_child(details)
    # Each window receives distinct carved wooden frames and shutter leaves.
    for side in [-1.0,1.0]:
        var center_x: float=side*2.4
        var near_z: float=-3.35
        for outer in [-1.0,1.0]:
            var at_x: float=center_x+outer*.83
            _timber(details,Vector3(at_x,1.35,near_z),Vector3(.29,1.34,.16))
            for bar in range(3):
                _timber(details,Vector3(at_x,1.0+float(bar)*.35,near_z-.105),Vector3(.28,.065,.055))
        # Wooden window box with a modest vegetable/flower planting.
        _timber(details,Vector3(center_x,.66,near_z-.28),Vector3(1.75,.19,.46))
        _timber(details,Vector3(center_x,.55,near_z-.49),Vector3(1.75,.32,.10))
    # A single batched row of weathered stone insets around the circular door.
    var insets:=BoxMesh.new()
    insets.size=Vector3(.27,.15,.15)
    _batch(details,"DoorArchWeatheredStone",insets,24,func(i: int) -> Transform3D:
        var theta: float=TAU*(float(i)+.5)/24.0
        var x: float=sin(theta)*1.36
        var y: float=1.15+cos(theta)*1.36
        var transform_basis:=Basis(Vector3.FORWARD,-theta)
        return Transform3D(transform_basis,Vector3(x,y,-4.19))
    ,_stone)
    # Rivets around the round timber door. Batching prevents 18 separate nodes.
    var rivet:=SphereMesh.new()
    rivet.radius=.055
    rivet.height=.11
    rivet.radial_segments=8
    rivet.rings=4
    _batch(details,"DoorIronRivets",rivet,16,func(i: int) -> Transform3D:
        var theta: float=TAU*float(i)/16.0
        return Transform3D(Basis.IDENTITY,Vector3(sin(theta)*.83,1.15+cos(theta)*.83,-4.04))
    ,_metal)
    # Curved roof edge: five low-profile timber braces. The hill silhouette stays intact.
    for section in range(5):
        var xx: float=-3.4+float(section)*1.7
        _timber(details,Vector3(xx,2.65,-3.0),Vector3(.14,.22,1.08))
    if main_house:
        _timber(details,Vector3(0,2.85,-3.43),Vector3(2.55,.16,.2))
        _timber(details,Vector3(0,.14,-4.40),Vector3(2.7,.19,.8))
    # Lantern model without an extra dynamic light/shadow source at each home.
    var lamp:=MeshInstance3D.new()
    lamp.name="EntranceLampWarmGlass"
    var cylinder:=CylinderMesh.new()
    cylinder.top_radius=.13
    cylinder.bottom_radius=.13
    cylinder.height=.36
    cylinder.radial_segments=9
    lamp.mesh=cylinder
    lamp.position=Vector3(1.62,2.07,-4.15)
    lamp.material_override=_glass
    details.add_child(lamp)
    _timber(details,Vector3(1.62,2.35,-4.15),Vector3(.32,.1,.38))
    # A narrow stone approach defines the entrance without collision on the road.
    var paving:=BoxMesh.new()
    paving.size=Vector3(.82,.08,.62)
    _batch(details,"ThresholdPaving",paving,6,func(i: int) -> Transform3D:
        var displacement: float=float(i)*.86
        return Transform3D(Basis.IDENTITY,Vector3(-.35+float(i%2)*.70,.02,-4.95-displacement))
    ,_stone)
    return details.get_child_count()
