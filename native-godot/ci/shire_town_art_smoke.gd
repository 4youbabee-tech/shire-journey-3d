extends SceneTree
## Chapter I *whole settlement* test: real Godot scene, not rendered mockups.
## Preserves travel, homes and save/load contracts tested by other CI scripts.
func _initialize() -> void:
    call_deferred("_verify")

func _verify() -> void:
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Complete Hobbiton art missing from Chapter I launch")
        quit(190)
        return
    for i in range(6):
        await process_frame
    var game: Node = current_scene
    # A previous CI smoke can leave a saved interior; isolate scene state.
    game.call("_new_game")
    var art: Node = game.find_child("HobbitonCompleteVillageArt",true,false)
    var ecology: Node = game.find_child("HobbitonLayeredGroundEcology",true,false)
    if art == null or ecology == null or art.get_meta("live_gameplay_world",false) != true:
        push_error("Village-wide architectural/art integration missing")
        quit(191)
        return
    var names: Array[String] = [
        "TenHomeGardenTerraces","DistantHobbitonHamlets",
        "MarketFestivalDistrict","WatermillCraftCourtyard",
        "MasonryBridgeOverWater","EightRoadsideStoneBorders",
        "FarmlandFencesAndSheds"
    ]
    for name in names:
        if art.get_node_or_null(name) == null:
            push_error("Missing complete town district: "+name)
            quit(192)
            return
    var homes: Node = art.get_node("TenHomeGardenTerraces")
    var scenic: Node = art.get_node("DistantHobbitonHamlets")
    var vendors: Node = art.get_node("MarketFestivalDistrict")
    var bridge: Node = art.get_node("MasonryBridgeOverWater")
    if homes.get_child_count() != 10 or scenic.get_child_count() < 8 or vendors.get_child_count() < 4:
        push_error("Hobbiton homes / scenic cottages / market stalls unbuilt")
        quit(193)
        return
    if bridge.find_children("BridgeStoneVoussoir_*","MeshInstance3D",true,false).size() < 30:
        push_error("Stone bridge arch not physically modeled in world")
        quit(194)
        return
    if art.find_children("*","MeshInstance3D",true,false).size() < 260:
        push_error("Whole town is still missing authored set-dressing meshes")
        quit(195)
        return
    var expected: Array[String] = [
        "WholeTownMeadowAndFlowers",
        "LivingRiverbankAndWhitewater",
        "FruitGrovesAndOrchardGround"
    ]
    var instances := 0
    for name in expected:
        var area: Node = ecology.get_node_or_null(name)
        if area == null:
            push_error("Missing physical plant/shore district: "+name)
            quit(196)
            return
        var batches: Array[Node] = area.find_children("*","MultiMeshInstance3D",true,false)
        if batches.is_empty():
            push_error("Hobbiton ecological GPU batches absent: "+name)
            quit(197)
            return
        for batch in batches:
            var visual: MultiMeshInstance3D = batch as MultiMeshInstance3D
            if visual.multimesh == null or visual.multimesh.mesh == null:
                push_error("An entire town foliage batch is a placeholder")
                quit(198)
                return
            instances += visual.multimesh.instance_count
    if instances < 6000:
        push_error("Expected thousands of instanced plants, not decorative few: %d" % instances)
        quit(199)
        return
    # A real licensed photogrammetric model, not placeholder capsules.
    var shrub_layer: Node=game.find_child("HobbitonPhotogrammetricShrubClusters",true,false)
    if shrub_layer == null or shrub_layer.get_meta("verified_cc0_photogrammetry",false) != true:
        push_error("Verified Poly Haven photogrammetric shrubs missing from the playable village")
        quit(201)
        return
    if int(shrub_layer.get_meta("visible_shrubs",0)) < 120:
        push_error("Too few instanced photogrammetric shrub clusters")
        quit(202)
        return
    if shrub_layer.find_children("*","MultiMeshInstance3D",true,false).size() < 1:
        push_error("Photogrammetric shrubs are not material-preserving GPU meshes")
        quit(203)
        return
    if game.get("inside_cottage") == true or game.get("inside_bag_end") == true:
        push_error("Whole town build unexpectedly entered a house")
        quit(200)
        return
    print("PASS: 10 decorated homes + 8 scenic homes + 4 extra stalls + mill + stone arch + lanes + farms")
    print("PASS: dense living riverbank, orchards, meadows and >6000 GPU plants in playable Hobbiton")
    quit(0)
