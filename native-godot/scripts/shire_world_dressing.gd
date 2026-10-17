class_name ShireWorldDressing
extends RefCounted
## Low-drawcall original Shire surface dressing: orchards, fenced allotments,
## riverbank reeds and individually accessible gathering markers. No physics agents.
const ForagingScript=preload("res://scripts/shire_foraging.gd")

static func _material(tint: Color, double_sided: bool=false) -> StandardMaterial3D:
    var result:=StandardMaterial3D.new()
    result.albedo_color=tint
    result.roughness=.93
    if double_sided:
        result.cull_mode=BaseMaterial3D.CULL_DISABLED
    return result

static func _instance_batch(parent: Node3D, name: String, mesh: Mesh,
    transforms: Array[Transform3D], tint: Color, two_sided: bool=false) -> MultiMeshInstance3D:
    var shared:=MultiMesh.new()
    shared.transform_format=MultiMesh.TRANSFORM_3D
    shared.mesh=mesh
    shared.instance_count=transforms.size()
    for index in range(transforms.size()):
        shared.set_instance_transform(index,transforms[index])
    var visual:=MultiMeshInstance3D.new()
    visual.name=name
    visual.multimesh=shared
    visual.material_override=_material(tint,two_sided)
    visual.cast_shadow=GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(visual)
    return visual

static func _transform(x: float, y: float, z: float, scale_value: Vector3,
    angle: float=0.0) -> Transform3D:
    return Transform3D(Basis(Vector3.UP,angle).scaled(scale_value),Vector3(x,y,z))

static func populate(parent: Node3D, terrain: Callable) -> void:
    var root:=Node3D.new()
    root.name="ShireCraftedEcology"
    parent.add_child(root)
    var tree_trunks: Array[Transform3D]=[]
    var tree_crowns: Array[Transform3D]=[]
    var tree_apples: Array[Transform3D]=[]
    var post_placements: Array[Transform3D]=[]
    var rail_placements: Array[Transform3D]=[]
    var reeds: Array[Transform3D]=[]
    var trunk:=CylinderMesh.new()
    trunk.top_radius=.24
    trunk.bottom_radius=.34
    trunk.height=3.1
    trunk.radial_segments=7
    var crown:=SphereMesh.new()
    crown.radial_segments=10
    crown.rings=6
    var apple:=SphereMesh.new()
    apple.radial_segments=8
    apple.rings=5
    var rng:=RandomNumberGenerator.new()
    rng.seed=760130
    # Orchard beside the western farmland, using seven batches instead of 100+ mesh nodes.
    for index in range(18):
        var row: int=index/6
        var col: int=index%6
        var x: float=-81.0+float(col)*4.1+rng.randf_range(-.32,.32)
        var z: float=16.0+float(row)*9.5+rng.randf_range(-.45,.45)
        var h: float=float(terrain.call(x,z))
        tree_trunks.append(_transform(x,h+1.5,z,Vector3.ONE,rng.randf_range(-.2,.2)))
        tree_crowns.append(_transform(x,h+3.1,z,Vector3(1.95,1.4,1.85)))
        for fruit_index in range(4):
            var a: float=float(fruit_index)*TAU/4.0+float(index)*.37
            tree_apples.append(_transform(x+cos(a)*1.3,h+2.6+float(fruit_index%2)*.34,z+sin(a)*1.24,
                Vector3(.19,.17,.19)))
    _instance_batch(root,"OrchardTrunks",trunk,tree_trunks,Color("65472c"))
    _instance_batch(root,"OrchardCanopies",crown,tree_crowns,Color("658248"))
    _instance_batch(root,"OrchardApples",apple,tree_apples,Color("bd5441"))
    # Village allotment enclosures, with two shared wood batches and no additional physics bodies.
    var fence_patches: Array[Rect2]=[
        Rect2(-51,-24,11,9),Rect2(-42,32,13,10),Rect2(9,34,11,10)]
    for patch in fence_patches:
        for side in range(4):
            var origin:=Vector2(patch.position.x,patch.position.y)
            var a:=origin
            var b:=origin
            match side:
                0:
                    b=origin+Vector2(patch.size.x,0)
                1:
                    a=origin+Vector2(patch.size.x,0)
                    b=origin+patch.size
                2:
                    a=origin+Vector2(patch.size.x,patch.size.y)
                    b=origin+Vector2(0,patch.size.y)
                3:
                    a=origin+Vector2(0,patch.size.y)
                    b=origin
            var length: float=a.distance_to(b)
            var pieces: int=maxi(2,int(length/1.7))
            var angle: float=atan2(b.y-a.y,b.x-a.x)
            for i in range(pieces+1):
                var t: float=float(i)/float(pieces)
                var p: Vector2=a.lerp(b,t)
                var height: float=float(terrain.call(p.x,p.y))
                post_placements.append(_transform(p.x,height+.63,p.y,Vector3(.14,1.25,.14)))
                if i<pieces:
                    var q: Vector2=a.lerp(b,float(i+.5)/float(pieces))
                    var yy: float=float(terrain.call(q.x,q.y))
                    for rail_height in [.48,.91]:
                        rail_placements.append(_transform(q.x,yy+rail_height,q.y,
                            Vector3(length/float(pieces),.105,.11),-angle))
    var cube:=BoxMesh.new()
    cube.size=Vector3.ONE
    _instance_batch(root,"HobbitGardenPosts",cube,post_placements,Color("76553d"))
    _instance_batch(root,"HobbitGardenRails",cube,rail_placements,Color("986f45"))
    # Reeds bracket (not intersect) the winding water; no transparent foliage overdraw.
    var blade:=QuadMesh.new()
    blade.size=Vector2(.14,.69)
    for i in range(260):
        var z: float=rng.randf_range(-87.0,90.0)
        var x: float=42.0+4.0*sin(z*.048)
        x+=(-1.0 if i%2==0 else 1.0)*(4.0+rng.randf_range(.0,2.2))
        var h: float=float(terrain.call(x,z))
        reeds.append(_transform(x,h+.38,z,Vector3(
            rng.randf_range(.7,1.3),rng.randf_range(.7,1.8),1.0),rng.randf_range(0.0,TAU)))
    _instance_batch(root,"RiverbankReeds",blade,reeds,Color("789568"),true)
    # Clear, named plants corresponding exactly to real foraging gameplay sites.
    var patch_mesh:=SphereMesh.new()
    patch_mesh.radial_segments=10
    patch_mesh.rings=6
    for site in ForagingScript.SITES:
        var sx: float=float(site["x"])
        var sz: float=float(site["z"])
        var spot:=Node3D.new()
        spot.name="ForageSpot_"+str(site["id"])
        spot.position=Vector3(sx,float(terrain.call(sx,sz)),sz)
        root.add_child(spot)
        var cluster: Array[Transform3D]=[]
        for j in range(7):
            var angle: float=TAU*float(j)/7.0
            var distance: float=.34+.075*float(j%3)
            cluster.append(_transform(cos(angle)*distance,.20+float(j%3)*.1,
                sin(angle)*distance,Vector3(.23,.24,.23)))
        var color: Color=Color("b95038") if str(site["kind"])=="fruit" else Color("659057") if str(site["kind"])=="herb" else Color("b98ca6")
        _instance_batch(spot,"GatheringFoliage",patch_mesh,cluster,color)
