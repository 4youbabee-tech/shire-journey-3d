extends SceneTree
func _initialize() -> void:
    call_deferred("_verify")
func _verify() -> void:
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Chapter did not open")
        quit(70)
        return
    for _i in range(6):
        await process_frame
    var node: Node = current_scene.find_child("BagEndCraftedPortalGLB",true,false)
    if node == null:
        push_error("Authored Blender GLB is absent from the live Shire chapter")
        quit(71)
        return
    var meshes: Array[Node] = node.find_children("*","MeshInstance3D",true,false)
    if meshes.size() < 7:
        push_error("GLB mesh integration invalid")
        quit(72)
        return
    print("PASS: Blender Bag End portal GLB loaded into Godot (%d meshes)" % meshes.size())
    quit(0)
