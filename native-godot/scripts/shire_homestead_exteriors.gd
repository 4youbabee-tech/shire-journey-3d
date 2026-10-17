class_name ShireHomesteadExteriors
extends RefCounted
## Nine original outdoor workstations. Door triggers and collision unchanged.
const HOMES := [
    ["bagshot_cottage",Vector2(-44.0,-26.0)],
    ["garden_cottage",Vector2(-45.0,-3.0)],
    ["hill_cottage",Vector2(-18.0,-39.0)],
    ["northern_cottage",Vector2(2.0,30.0)],
    ["market_cottage",Vector2(18.0,28.0)],
    ["west_row_cottage",Vector2(-62.0,-12.0)],
    ["west_grove_cottage",Vector2(-61.0,11.0)],
    ["longacre_cottage",Vector2(-34.0,45.0)],
    ["east_orchard_cottage",Vector2(32.0,40.0)]
]

static func _mesh(root: Node3D, mesh: Mesh, name: String,
        pos: Vector3, shape: Vector3, material: StandardMaterial3D) -> void:
    var visual:=MeshInstance3D.new()
    visual.name=name
    visual.mesh=mesh
    visual.position=pos
    visual.scale=shape
    visual.material_override=material
    visual.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    root.add_child(visual)

static func _mat(hex: String) -> StandardMaterial3D:
    var m:=StandardMaterial3D.new()
    m.albedo_color=Color(hex)
    m.roughness=.88
    return m

static func _ground(terrain: Callable, home: Vector2, x: float, z: float) -> float:
    return float(terrain.call(home.x+x,home.y+z))-float(terrain.call(home.x,home.y))

static func populate(world: Node3D, terrain: Callable) -> void:
    var block:=BoxMesh.new()
    var ball:=SphereMesh.new()
    ball.radial_segments=9
    ball.rings=5
    var wood:=_mat("79543a")
    var pebble:=_mat("b0a187")
    var linen:=_mat("d9c49e")
    var greenery:=_mat("738b54")
    for entry in HOMES:
        var id: String=str(entry[0])
        var center: Vector2=entry[1]
        var motif: String=ShireHomeCraft.motif(id)
        var accent:=_mat(str(ShireHomeCraft.THEMES[id]["accent"]))
        var kit:=Node3D.new()
        kit.name="ShireHomesteadExterior_"+id
        kit.position=Vector3(center.x,float(terrain.call(center.x,center.y)),center.y)
        world.add_child(kit)
        for k in range(7):
            var z: float=-6.25-float(k)*.61
            var x: float=sin(float(k)*.7)*.26
            _mesh(kit,block,"PorchStone_%02d" % k,
                Vector3(x,_ground(terrain,center,x,z)+.025,z),
                Vector3(.91,.05,.56),pebble)
        var ty: float=_ground(terrain,center,6.0,-6.0)
        _mesh(kit,block,"HouseholdWorkbench",
            Vector3(6.0,ty+.82,-6.0),Vector3(2.25,.16,1.60),wood)
        for side in [-1.0,1.0]:
            _mesh(kit,block,"WorkbenchLeg_"+str(side),
                Vector3(6.0+side*.87,ty+.4,-6.0),Vector3(.12,.8,1.0),wood)
        var by: float=_ground(terrain,center,-6.0,-5.2)
        _mesh(kit,block,"GardenBench",
            Vector3(-6.0,by+.54,-5.2),Vector3(1.52,.14,.48),wood)
        for side in [-1.0,1.0]:
            _mesh(kit,block,"BenchSupport_"+str(side),
                Vector3(-6.0+side*.49,by+.26,-5.2),Vector3(.13,.52,.36),wood)
        for j in range(12):
            var x: float=5.25+float(j%4)*.47
            var z: float=-5.50-float(int(j/4))*.46
            var p:=Vector3(x,ty+.99,z)
            var form:=Vector3(.28,.12,.24)
            var tint: StandardMaterial3D=accent
            match motif:
                "letters":
                    form=Vector3(.28,.026,.22)
                    tint=linen if j%3 else accent
                "seedlings":
                    form=Vector3(.16,.31,.16)
                    tint=greenery
                "copper":
                    form=Vector3(.19,.21,.19)
                "wool":
                    form=Vector3(.23,.26,.20)
                "market":
                    form=Vector3(.27,.17,.26)
                    tint=greenery if j%2 else accent
                "joinery":
                    form=Vector3(.07,.12,.32)
                    tint=wood if j%2 else accent
                "herbal":
                    form=Vector3(.16,.26,.19)
                    tint=greenery
                "harvest":
                    form=Vector3(.23,.30,.21)
                    tint=linen
                "orchard":
                    form=Vector3(.18,.18,.18)
            if motif in ["copper","wool","seedlings","herbal","harvest","orchard"]:
                _mesh(kit,ball,"Distinct_"+motif+"_%02d" % j,p,form,tint)
            else:
                _mesh(kit,block,"Distinct_"+motif+"_%02d" % j,p,form,tint)
        for j in range(6):
            var x: float=-7.0+float(j%3)*.51
            var z: float=-6.6+float(int(j/3))*.47
            var ground: float=_ground(terrain,center,x,z)
            _mesh(kit,block,"TerracottaPlanter_%02d" % j,
                Vector3(x,ground+.20,z),Vector3(.35,.4,.35),wood)
            _mesh(kit,ball,"PorchGardenFlower_%02d" % j,
                Vector3(x,ground+.51,z),Vector3(.17,.14,.17),accent)
        var sign:=Node3D.new()
        sign.name="ShireHouseMarker_"+id
        sign.position=Vector3(7.2,_ground(terrain,center,7.2,-7.5),-7.5)
        kit.add_child(sign)
        _mesh(sign,block,"HouseholdSignPost",
            Vector3(0,.80,0),Vector3(.14,1.6,.14),wood)
        _mesh(sign,block,"HouseholdSignBoard",
            Vector3(0,1.46,0),Vector3(1.24,.4,.13),accent)
        _mesh(sign,ball,"HandCarvedMotif",
            Vector3(0,1.47,-.13),Vector3(.12,.12,.07),linen)
