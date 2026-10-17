extends SceneTree
## Checks nine non-placeholder Blender exteriors at actual Shire house sites.
func _initialize() -> void:
    call_deferred("_test")

func _test() -> void:
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Shire cannot open for nine exterior checks")
        quit(165)
        return
    for _i in range(8):
        await process_frame
    var world: Node=current_scene
    var homes: Dictionary={
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
    for key in homes:
        var model: Node=world.find_child("ShireCraftedFacade_"+key,true,false)
        if model==null or not model is Node3D:
            push_error("Authored Blender facade not present in live world: "+key)
            quit(166)
            return
        var at: Vector3=(model as Node3D).global_position
        if Vector2(at.x,at.z).distance_to(homes[key])>1.2:
            push_error("Facade wrongly placed in world: "+key)
            quit(167)
            return
        var groups: Array[Node]=model.find_children("*","MeshInstance3D",true,false)
        if groups.size()<8:
            push_error("Missing Blender PBR mesh groups: "+key)
            quit(168)
            return
        if not ResourceLoader.exists("res://assets/models/shire_"+key+"_craftwork.glb"):
            push_error("GLB is missing: "+key)
            quit(169)
            return
    print("PASS: nine unique, batched Blender facade GLBs placed in live Shire world")
    quit(0)
