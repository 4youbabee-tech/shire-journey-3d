class_name ShireCountrysideCraft
extends RefCounted
## Original batched props: farm walls, crops, flowers, apiaries and rest stops.
static func _pose(terrain: Callable, x: float, z: float,
        up: float, size: Vector3, angle: float=0.0) -> Transform3D:
    return Transform3D(Basis(Vector3.UP,angle).scaled(size),
        Vector3(x,float(terrain.call(x,z))+up,z))

static func _batch(root: Node3D, label: String, mesh: Mesh,
        poses: Array[Transform3D], hex: String) -> void:
    if poses.is_empty():
        return
    var mm:=MultiMesh.new()
    mm.transform_format=MultiMesh.TRANSFORM_3D
    mm.mesh=mesh
    mm.instance_count=poses.size()
    for k in range(poses.size()):
        mm.set_instance_transform(k,poses[k])
    var node:=MultiMeshInstance3D.new()
    node.name=label
    node.multimesh=mm
    var mat:=StandardMaterial3D.new()
    mat.albedo_color=Color(hex)
    mat.roughness=.93
    node.material_override=mat
    node.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    root.add_child(node)

static func populate(world: Node3D, terrain: Callable) -> void:
    var root:=Node3D.new()
    root.name="ShireCountrysideCraftwork"
    world.add_child(root)
    var cube:=BoxMesh.new()
    cube.size=Vector3.ONE
    var bloom:=SphereMesh.new()
    bloom.radial_segments=8
    bloom.rings=5
    var walls: Array[Transform3D]=[]
    var hay: Array[Transform3D]=[]
    var flowers: Array[Transform3D]=[]
    var yellow: Array[Transform3D]=[]
    var pink: Array[Transform3D]=[]
    var violet: Array[Transform3D]=[]
    var vegetable_stems: Array[Transform3D]=[]
    var vegetable_leaves: Array[Transform3D]=[]
    var hives: Array[Transform3D]=[]
    var roofs: Array[Transform3D]=[]
    var signs: Array[Transform3D]=[]
    var signboards: Array[Transform3D]=[]
    var seats: Array[Transform3D]=[]
    var legs: Array[Transform3D]=[]
    var hedges: Array[Transform3D]=[]
    var rng:=RandomNumberGenerator.new()
    rng.seed=300110
    for i in range(145):
        var x: float=-88.0+float(i%73)*.91
        var z: float=77.0+float(int(i/73))*3.4
        walls.append(_pose(terrain,x,z,.35,Vector3(.82,.64,.62),float(i%3)*.11))
    for row in range(5):
        for col in range(11):
            var x: float=-83.0+float(col)*2.5
            var z: float=55.0+float(row)*2.1
            hay.append(_pose(terrain,x,z,.41,Vector3(1.25,.77,.83),float(col%3)*.14))
    var clearings: Array[Vector2]=[
        Vector2(-10,21),Vector2(0,48),Vector2(-71,-39),
        Vector2(25,53),Vector2(-54,59),Vector2(-8,-24)]
    for place in clearings:
        for i in range(55):
            var angle: float=rng.randf_range(0.0,TAU)
            var radius: float=sqrt(rng.randf())*8.2
            var x: float=place.x+cos(angle)*radius
            var z: float=place.y+sin(angle)*radius
            flowers.append(_pose(terrain,x,z,.21,Vector3(.045,.42,.045)))
            var head:=_pose(terrain,x,z,.42,Vector3(.13,.12,.13))
            if i%3==0:
                yellow.append(head)
            elif i%3==1:
                pink.append(head)
            else:
                violet.append(head)
    for row in range(12):
        for col in range(18):
            var x: float=-21.0+float(col)*.92
            var z: float=64.0+float(row)*.94
            vegetable_stems.append(_pose(terrain,x,z,.19,Vector3(.12,.38,.12)))
            vegetable_leaves.append(_pose(terrain,x,z,.43,Vector3(.27,.23,.27)))
    for i in range(8):
        var x: float=-88.0+float(i%4)*2.6
        var z: float=-25.0+float(int(i/4))*4.8
        hives.append(_pose(terrain,x,z,.57,Vector3(.77,1.04,.72)))
        roofs.append(_pose(terrain,x,z,1.14,Vector3(1.0,.18,.95)))
    var junctions: Array[Vector2]=[
        Vector2(-48,53),Vector2(-22,60),Vector2(7,61),
        Vector2(29,58),Vector2(-69,-45),Vector2(-38,-48)]
    for p in junctions:
        signs.append(_pose(terrain,p.x,p.y,1.05,Vector3(.16,2.1,.16)))
        signboards.append(_pose(terrain,p.x,p.y,1.80,Vector3(1.30,.32,.14)))
    var rest_sites: Array[Vector2]=[
        Vector2(-16,30),Vector2(-8,-33),Vector2(23,46),
        Vector2(-47,-42),Vector2(7,54),Vector2(-75,49)]
    for p in rest_sites:
        seats.append(_pose(terrain,p.x,p.y,.62,Vector3(1.5,.15,.46)))
        for side in [-1.0,1.0]:
            legs.append(_pose(terrain,p.x+side*.48,p.y,.32,Vector3(.13,.61,.32)))
    for i in range(112):
        var x: float=-88.0+float(i)*.77
        var z: float=82.0+sin(float(i)*.23)*.4
        hedges.append(_pose(terrain,x,z,.44,Vector3(.67,.83,.67)))
    _batch(root,"CountryDryStoneWalls",cube,walls,"b0a18a")
    _batch(root,"CountryHayBales",cube,hay,"c8ad65")
    _batch(root,"MeadowFlowerStems",cube,flowers,"709052")
    _batch(root,"MeadowYellowBlossoms",bloom,yellow,"dec568")
    _batch(root,"MeadowPinkBlossoms",bloom,pink,"ce919e")
    _batch(root,"MeadowVioletBlossoms",bloom,violet,"aa91c1")
    _batch(root,"CountryVegetableStems",cube,vegetable_stems,"658149")
    _batch(root,"CountryVegetableLeaves",bloom,vegetable_leaves,"7f9859")
    _batch(root,"OrchardBeehiveBodies",cube,hives,"bb9b68")
    _batch(root,"OrchardBeehiveRoofs",cube,roofs,"786044")
    _batch(root,"CountryDirectionPosts",cube,signs,"76583d")
    _batch(root,"CountryDirectionBoards",cube,signboards,"a68854")
    _batch(root,"CountryRestBenches",cube,seats,"86603f")
    _batch(root,"CountryRestBenchLegs",cube,legs,"674a33")
    _batch(root,"CountryBoundaryHedgerow",bloom,hedges,"61804c")
