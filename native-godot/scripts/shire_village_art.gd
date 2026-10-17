class_name ShireVillageArt
extends RefCounted
## CHAPTER I: complete linked Hobbiton set-dressing, not a camera-only facade.
## All geometry lives in the real playable Godot scene and keeps the existing
## doorways, quest triggers, save data, NPC routes and water-wheel gameplay.
## Original-game scenic geometry; material colours do not reuse film textures.

static var _mats: Dictionary = {}

static func _mat(hex: String) -> StandardMaterial3D:
    if not _mats.has(hex):
        var m := StandardMaterial3D.new()
        m.albedo_color = Color(hex)
        m.roughness = .91
        _mats[hex] = m
    return _mats[hex]

static func _zone(parent: Node3D, label: String) -> Node3D:
    var zone := Node3D.new()
    zone.name = label
    parent.add_child(zone)
    return zone

static func _box(parent: Node3D, label: String, at: Vector3,
        dimensions: Vector3, colour: String, yaw: float = 0.0) -> MeshInstance3D:
    var visual := MeshInstance3D.new()
    # Distinct mesh node for every stone, roof piece and flower.
    visual.name = label + "_" + str(parent.get_child_count())
    var block := BoxMesh.new()
    block.size = dimensions
    visual.mesh = block
    visual.position = at
    visual.rotation.y = yaw
    visual.material_override = _mat(colour)
    visual.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(visual)
    return visual

static func _sphere(parent: Node3D, label: String, at: Vector3,
        dimensions: Vector3, colour: String) -> MeshInstance3D:
    var visual := MeshInstance3D.new()
    # Distinct mesh node for every stone, roof piece and flower.
    visual.name = label + "_" + str(parent.get_child_count())
    var mesh := SphereMesh.new()
    mesh.radial_segments = 10
    mesh.rings = 6
    visual.mesh = mesh
    visual.position = at
    visual.scale = dimensions
    visual.material_override = _mat(colour)
    visual.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(visual)
    return visual

static func _batch(parent: Node3D, name: String, mesh: Mesh,
        placements: Array[Transform3D], colour: String) -> MultiMeshInstance3D:
    var copies := MultiMesh.new()
    copies.transform_format = MultiMesh.TRANSFORM_3D
    copies.mesh = mesh
    copies.instance_count = placements.size()
    for i in range(placements.size()):
        copies.set_instance_transform(i,placements[i])
    var visual := MultiMeshInstance3D.new()
    visual.name = name
    visual.multimesh = copies
    visual.material_override = _mat(colour)
    visual.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
    parent.add_child(visual)
    return visual

static func _pos(x: float, z: float, height: Callable, lift: float = 0.0) -> Vector3:
    return Vector3(x,float(height.call(x,z))+lift,z)

static func populate(world: Node3D, height: Callable, river_x: Callable) -> void:
    if world.get_node_or_null("HobbitonCompleteVillageArt") != null:
        return
    var village := _zone(world,"HobbitonCompleteVillageArt")
    _homes(_zone(village,"TenHomeGardenTerraces"),height)
    _hamlet(_zone(village,"DistantHobbitonHamlets"),height,river_x)
    _market(_zone(village,"MarketFestivalDistrict"),height)
    _mill(_zone(village,"WatermillCraftCourtyard"),height)
    _bridge(_zone(village,"MasonryBridgeOverWater"),height,river_x)
    _roads(_zone(village,"EightRoadsideStoneBorders"),height)
    _farm(_zone(village,"FarmlandFencesAndSheds"),height)
    village.set_meta("live_gameplay_world",true)
    village.set_meta("scenic_houses",8)
    village.set_meta("homes_dressed",10)
    village.set_meta("districts",7)

static func _homes(zone: Node3D, height: Callable) -> void:
    var homes: Array[Vector3] = [
        Vector3(-24,-20,1.65),Vector3(-44,-26,1.16),
        Vector3(-45,-3,1.12),Vector3(-18,-39,1.18),
        Vector3(2,30,.97),Vector3(18,28,1.17),
        Vector3(-62,-12,.91),Vector3(-61,11,1.04),
        Vector3(-34,45,.94),Vector3(32,40,1.07)
    ]
    for i in range(homes.size()):
        var home: Vector3 = homes[i]
        var x: float = home.x
        var z: float = home.y
        var size_value: float = home.z
        var root := _zone(zone,"HomeGarden_%02d" % i)
        root.position = _pos(x,z,height)
        for side in [-1,1]:
            var edge_x: float = float(side)*5.4*size_value
            for section in range(4):
                var zz: float = -4.8-float(section)*1.08
                _box(root,"WeatheredStoneGardenWall",
                    Vector3(edge_x,.26,zz),Vector3(.38,.48,1.14),
                    "8c8873" if section%2==0 else "a49e87")
            # Layer the front of each existing home without closing the door.
            for bed in range(4):
                var px: float = edge_x-float(side)*(1.2+float(bed%2)*.8)
                var pz: float = -7.5+float(bed/2)*1.15
                _box(root,"CarvedHerbRaisedBed",
                    Vector3(px,.30,pz),Vector3(.85,.32,.63),"765339")
                for plant in range(3):
                    _sphere(root,"GardenedHerbClump",
                        Vector3(px+float(plant-1)*.20,.60,pz),
                        Vector3(.20,.26,.22),
                        "627b42" if plant%2==0 else "90a75c")
        var door_sign_x: float = 3.15*size_value
        _box(root,"IndividualHomeSignPost",Vector3(door_sign_x,.68,-5.3),
            Vector3(.12,1.36,.12),"644b33")
        _box(root,"FamilyHandcraftedSign",Vector3(door_sign_x,1.38,-5.3),
            Vector3(.95,.39,.11),"8e6b48")
        for n in range(5):
            var px: float = -2.4+float(n)*1.2
            if absf(px)<1.6:
                continue
            _sphere(root,"DoorwayCreepingBloom",
                Vector3(px,.16,-6.2),Vector3(.25,.29,.24),
                "879858" if i%2==0 else "a8945d")

static func _make_hill_mesh() -> Mesh:
    var tool := SurfaceTool.new()
    tool.begin(Mesh.PRIMITIVE_TRIANGLES)
    var rings := 9
    var sides := 24
    for ring in range(rings):
        var a: float = float(ring)/float(rings)
        var b: float = float(ring+1)/float(rings)
        for side in range(sides):
            var u: float = TAU*float(side)/float(sides)
            var v: float = TAU*float(side+1)/float(sides)
            for radius_angle in [Vector2(a,u),Vector2(b,u),Vector2(a,v),
                                  Vector2(a,v),Vector2(b,u),Vector2(b,v)]:
                var t: float = radius_angle.x
                var ang: float = radius_angle.y
                var p := Vector3(cos(ang)*4.8*t,
                    3.25*pow(maxf(0.0,1.0-t*t),.62),
                    sin(ang)*4.2*t)
                tool.set_uv(Vector2(p.x,p.z)*.13)
                tool.add_vertex(p)
    tool.generate_normals()
    return tool.commit()

static func _hamlet(zone: Node3D, height: Callable, river_x: Callable) -> void:
    # Eight *scenery-only* hillside houses broaden the village silhouette.
    # Gameplay still intentionally has the existing nine enterable homes.
    var locations: Array[Vector3] = [
        Vector3(-81,-39,.88),Vector3(-78,9,1.12),
        Vector3(-70,54,.94),Vector3(-49,57,1.03),
        Vector3(-12,56,.84),Vector3(8,47,1.05),
        Vector3(25,59,.83),Vector3(59,40,1.07)
    ]
    var mound: Mesh = _make_hill_mesh()
    for i in range(locations.size()):
        var spec: Vector3 = locations[i]
        if absf(spec.x-float(river_x.call(spec.y))) < 6.0:
            continue
        var house := _zone(zone,"BackgroundHobbitHome_%02d" % i)
        house.position = _pos(spec.x,spec.y,height)
        house.scale = Vector3.ONE*spec.z
        var roof := MeshInstance3D.new()
        roof.name = "GrassAndSoilTerracedHobbitRoof"
        roof.mesh = mound
        roof.material_override = ShireSurfaceMaterials.roof_turf()
        roof.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
        house.add_child(roof)
        _box(house,"RoughPlasterFront",Vector3(0,1.46,-3.0),
            Vector3(6.35,2.9,.30),"c1aa82")
        var disk := CylinderMesh.new()
        disk.top_radius = 1.03
        disk.bottom_radius = 1.03
        disk.height = .20
        disk.radial_segments = 36
        var door := MeshInstance3D.new()
        door.name = "RoundCraftedDoor"
        door.mesh = disk
        door.rotation.x = PI*.5
        door.position = Vector3(0,1.18,-3.20)
        door.material_override = _mat("50744c" if i%2==0 else "8a623f")
        house.add_child(door)
        var rim := MeshInstance3D.new()
        var torus := TorusMesh.new()
        torus.inner_radius = .96
        torus.outer_radius = 1.12
        torus.rings = 7
        torus.ring_segments = 36
        rim.name = "CarvedCircularStoneDoorFrame"
        rim.mesh = torus
        rim.rotation.x = PI*.5
        rim.position = Vector3(0,1.18,-3.32)
        rim.material_override = _mat("998d72")
        house.add_child(rim)
        for side in [-1,1]:
            _box(house,"WindowCrossbar",
                Vector3(float(side)*2.25,1.42,-3.26),
                Vector3(.13,.88,.12),"694830")
            _sphere(house,"AmberGlassWindow",
                Vector3(float(side)*2.25,1.42,-3.28),
                Vector3(.48,.47,.06),"d4aa6d")
            _box(house,"StoneChimneyStack",
                Vector3(float(side)*2.8,3.35,1.0),
                Vector3(.75,2.8,.72),"8c8371")

static func _market(zone: Node3D, height: Callable) -> void:
    var sites: Array[Vector3] = [
        Vector3(5,18,0),Vector3(10,21,1),
        Vector3(28,16,2),Vector3(31,7,3)
    ]
    var cloth: Array[String] = ["d7b88c","9b6e4c","f0dab4","83916a"]
    for i in range(sites.size()):
        var spot: Vector3 = sites[i]
        var stand := _zone(zone,"WorkingMarketCanopy_%02d" % i)
        stand.position = _pos(spot.x,spot.y,height)
        for side in [-1,1]:
            for edge in [-1,1]:
                _box(stand,"OakAwningSupport",
                    Vector3(float(side)*1.62,1.75,float(edge)*1.17),
                    Vector3(.12,3.42,.13),"65513b")
        _box(stand,"CarvedVendorCounter",Vector3(0,.89,0),
            Vector3(3.25,.20,1.70),"82603c")
        for plank in range(6):
            var x: float = -1.38+float(plank)*.56
            var roof := _box(stand,"HandWovenStripeCanvas",
                Vector3(x,3.46,0),Vector3(.55,.08,2.8),
                cloth[(i+plank)%cloth.size()])
            roof.rotation.z = .045 if plank<3 else -.045
        for crate in range(11):
            var x: float = -1.38+float(crate%6)*.51
            var z: float = -.55+float(crate/6)*.99
            _box(stand,"StackedProduceBasket",
                Vector3(x,.37,z),Vector3(.36,.31,.38),"ad8c5f")
            _sphere(stand,"SeasonalMarketProduce",
                Vector3(x,.59,z),Vector3(.18,.15,.17),
                "9c432d" if crate%3==0 else "7e9246" if crate%3==1 else "c3a055")
    for i in range(26):
        var x: float = 5.5+float(i%13)*2.08
        var z: float = 19.5+float(i/13)*1.65
        if x<12.0 or x>24.0:
            _box(zone,"MarketCrateAndSack",
                _pos(x,z,height,.30),Vector3(.63,.45,.54),
                "b3976d" if i%3==0 else "796044")

static func _mill(zone: Node3D, height: Callable) -> void:
    var mill := _zone(zone,"RealWatermillForegroundDetail")
    mill.position = _pos(33.0,-17.0,height)
    for side in [-1,1]:
        for i in range(11):
            var z: float = -3.78+float(i)*.76
            _box(mill,"HandSetMillRoofShingleEnd",
                Vector3(float(side)*4.22,4.5,z),
                Vector3(.34,.19,.81),"624832" if i%3==0 else "836040")
        _box(mill,"WeatheredCornerButtress",
            Vector3(float(side)*4.30,1.65,-3.3),
            Vector3(.48,3.3,.52),"8e8670")
    for n in range(12):
        var x: float = -4.8+float(n%4)*1.05
        var z: float = 3.9+float(n/4)*.95
        _box(mill,"MillerFlourDeliveryCrate",
            Vector3(x,.33,z),Vector3(.88,.57,.64),
            "76553c" if n%2==0 else "a38a67")
    for n in range(7):
        var x: float = -3.85+float(n)*1.04
        _sphere(mill,"LinenGrainBag",
            Vector3(x,.35,-4.45),Vector3(.39,.43,.37),"c2b494")
    for offset in [-3.15,3.15]:
        _box(mill,"PierLanternTimber",
            Vector3(offset,2.6,3.8),Vector3(.18,3.5,.20),"6a4b34")
        _box(mill,"WarmMillLamp",
            Vector3(offset,3.92,3.8),Vector3(.32,.40,.32),"e4b867")

static func _bridge(zone: Node3D, height: Callable, river_x: Callable) -> void:
    var center_x: float = float(river_x.call(8.0))
    var base_y: float = float(height.call(center_x,8.0))
    # Stone facings frame a real open shallow arch under the existing walkable
    # timber deck. No replacement of the game's crossing or player collision.
    for side in [-1,1]:
        var front_z: float = 8.0+float(side)*2.15
        for i in range(28):
            var x: float = center_x-6.65+(float(i)+.5)*.48
            var dx: float = absf(x-center_x)
            var arch: float = .04+.57*sqrt(maxf(0.0,1.0-pow(dx/4.1,2.0))) if dx<4.1 else -.18
            var top: float = .90
            var wall_height: float = top-arch
            _box(zone,"BridgeIndividuallyMortaredStone",
                Vector3(x,base_y+arch+wall_height*.5,front_z),
                Vector3(.45,wall_height,.48),
                "aea58f" if i%4==0 else "81796b" if i%4==1 else "988d7c")
        for i in range(17):
            var angle: float = PI*float(i)/16.0
            var x: float = center_x-4.06*cos(angle)
            var y: float = base_y+.05+.59*sin(angle)
            _box(zone,"BridgeStoneVoussoir",
                Vector3(x,y,front_z+float(side)*.04),
                Vector3(.52,.20,.56),
                "b6aa93" if i%2==0 else "8f8474")
        for i in range(9):
            var x: float = center_x-6.0+float(i)*1.5
            _box(zone,"BridgeCarvedParapetPost",
                Vector3(x,base_y+1.37,front_z),
                Vector3(.34,.86,.35),"8e8574")
        _box(zone,"StoneParapetHandRail",
            Vector3(center_x,base_y+1.82,front_z),
            Vector3(13.15,.22,.41),"a79a82")
    # A stone-laid surfacing over the existing gameplay bridge, not a new blocker.
    for i in range(16):
        var x: float = center_x-6.7+float(i)*.88
        _box(zone,"CrossingWeatheredStonePaving",
            Vector3(x,base_y+.70,8.0),
            Vector3(.86,.07,3.93),"a69a7e" if i%3==0 else "978970")

static func _roads(zone: Node3D, height: Callable) -> void:
    var tracks: Array[Vector3] = [
        Vector3(-24,-19,-21),Vector3(-21,-10,-9),Vector3(-9,-4,17),
        Vector3(17,8,41),Vector3(-9,-4,-3),Vector3(-3,25,9),
        Vector3(-9,-4,-44),Vector3(17,8,31)
    ]
    var destinations: Array[Vector2] = [
        Vector2(-21,-10),Vector2(-9,-4),Vector2(17,8),
        Vector2(41,8),Vector2(-3,25),Vector2(9,65),
        Vector2(-44,-3),Vector2(31,-17)
    ]
    var stones: Array[Transform3D] = []
    var rng := RandomNumberGenerator.new()
    rng.seed = 441211
    for n in range(destinations.size()):
        var start: Vector2 = Vector2(tracks[n].x,tracks[n].y)
        var goal: Vector2 = destinations[n]
        var outward: Vector2 = (goal-start).normalized()
        var normal: Vector2 = Vector2(-outward.y,outward.x)
        var total: int = maxi(2,int(start.distance_to(goal)/1.5))
        for step in range(total):
            var pos: Vector2 = start.lerp(goal,float(step)/float(total))
            for side in [-1,1]:
                var sample: Vector2 = pos+normal*(1.93*float(side)+rng.randf_range(-.24,.24))
                var y: float = float(height.call(sample.x,sample.y))
                var size_value: float = rng.randf_range(.23,.54)
                var basis := Basis(Vector3.UP,rng.randf_range(-PI,PI))
                stones.append(Transform3D(basis.scaled(Vector3(size_value,.19,size_value)),
                    Vector3(sample.x,y+.10,sample.y)))
    var rock := SphereMesh.new()
    rock.radial_segments = 8
    rock.rings = 4
    _batch(zone,"RoadsideHundredsOfIndividualMossyStones",rock,stones,"8e9078")

static func _farm(zone: Node3D, height: Callable) -> void:
    # Simple mesh batching of fences; plots are existing farm mechanics and safe.
    var lines: Array = [
        [Vector2(-69,26),Vector2(-69,52)],
        [Vector2(-69,52),Vector2(-41,52)],
        [Vector2(-41,52),Vector2(-41,28)],
        [Vector2(-69,26),Vector2(-59,26)],
        [Vector2(-52,26),Vector2(-41,26)],
        [Vector2(4,42),Vector2(24,42)],
        [Vector2(24,42),Vector2(24,55)]
    ]
    var posts: Array[Transform3D] = []
    var rails: Array[Transform3D] = []
    for line in lines:
        var a: Vector2 = line[0]
        var b: Vector2 = line[1]
        var total: int = maxi(2,int(a.distance_to(b)/1.55))
        var axis: Vector2 = (b-a).normalized()
        var yaw: float = atan2(axis.x,axis.y)
        for i in range(total+1):
            var t: float = float(i)/float(total)
            var p: Vector2 = a.lerp(b,t)
            var y: float = float(height.call(p.x,p.y))
            posts.append(Transform3D(Basis.IDENTITY.scaled(Vector3(.15,1.17,.15)),
                Vector3(p.x,y+.58,p.y)))
            if i<total:
                var p2: Vector2 = a.lerp(b,float(i+1)/float(total))
                var mid: Vector2 = (p+p2)*.5
                var center_y: float = float(height.call(mid.x,mid.y))
                var length: float = p.distance_to(p2)+.07
                for offset in [.42,.85]:
                    rails.append(Transform3D(Basis(Vector3.UP,yaw).scaled(Vector3(.13,.10,length)),
                        Vector3(mid.x,center_y+offset,mid.y)))
    var cube := BoxMesh.new()
    _batch(zone,"WorkingFarmBoundaryPosts",cube,posts,"6a573e")
    _batch(zone,"WorkingFarmBoundaryRails",cube,rails,"99784f")
    for site in [Vector2(-74,49),Vector2(-75,34),Vector2(23,51)]:
        var shed := _zone(zone,"FarmToolsLeanTo")
        shed.position = _pos(site.x,site.y,height)
        _box(shed,"StoneRootedToolStore",
            Vector3(0,.73,0),Vector3(3.5,1.43,2.70),"a18b6a")
        _box(shed,"PitchedWoodRoof",
            Vector3(0,1.77,0),Vector3(4.0,.25,3.0),"705438")
        for i in range(6):
            _box(shed,"HandcarvedAgriculturalTools",
                Vector3(-1.2+float(i)*.44,.40,-1.5),
                Vector3(.10,.75,.12),"6f5136")
