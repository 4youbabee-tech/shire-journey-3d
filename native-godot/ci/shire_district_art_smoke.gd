extends SceneTree
func _initialize() -> void:
    call_deferred("_run")
func _run() -> void:
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Cannot load Shire chapter")
        quit(80)
        return
    for _i in range(8):
        await process_frame
    var root: Node = current_scene
    for label in ["ShireMarketCraftwork0","ShireMarketCraftwork1","ShireMarketCraftwork2","ShireMillCraftwork","ShireFeastCraftwork0","ShireFeastCraftwork1"]:
        var item: Node = root.find_child(label,true,false)
        if item == null:
            push_error("Authored Blender content missing from live Shire: "+label)
            quit(81)
            return
        var visuals: Array[Node] = item.find_children("*","MeshInstance3D",true,false)
        var required: int = 3 if label=="ShireMillCraftwork" else 5 if label.begins_with("ShireMarket") else 6
        if visuals.size()<required:
            push_error("Blender content missing import mesh groups: "+label)
            quit(82)
            return
    var homesteads: Dictionary={
        "bagshot_cottage":Vector2(-44,-26),
        "garden_cottage":Vector2(-45,-3),
        "hill_cottage":Vector2(-18,-39),
        "northern_cottage":Vector2(2,30),
        "market_cottage":Vector2(18,28),
        "west_row_cottage":Vector2(-62,-12),
        "west_grove_cottage":Vector2(-61,11),
        "longacre_cottage":Vector2(-34,45),
        "east_orchard_cottage":Vector2(32,40)
    }
    for key in homesteads:
        var facade: Node=root.find_child("ShireCraftedFacade_"+key,true,false)
        if facade==null or not facade is Node3D:
            push_error("Missing Blender Shire facade in live world: "+key)
            quit(83)
            return
        var point: Vector3=(facade as Node3D).global_position
        if Vector2(point.x,point.z).distance_to(homesteads[key])>1.3:
            push_error("Shire facade at wrong cottage site: "+key)
            quit(84)
            return
        if facade.find_children("*","MeshInstance3D",true,false).size()<8:
            push_error("Missing Blender facade geometry groups: "+key)
            quit(85)
            return
    print("PASS: nine distinct Blender homestead exteriors with 6 crafted district placements")

    quit(0)
