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
        if visuals.size()<6:
            push_error("Blender content missing import mesh groups: "+label)
            quit(82)
            return
    print("PASS: Blender-crafted market x3, mill x1, feast x2 in running Shire")
    quit(0)
