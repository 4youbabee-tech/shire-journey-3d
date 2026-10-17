extends SceneTree
func _initialize() -> void:
    call_deferred("_check")
func _check() -> void:
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Wildlife main scene not loadable")
        quit(95)
        return
    for _i in range(7):
        await process_frame
    var result: Array[Node] = current_scene.find_children("ShireWildlifeGLB","",true,false)
    if result.size()<14:
        push_error("Expected nine hens and five rabbits imported from Blender; got %d" % result.size())
        quit(96)
        return
    for node in result:
        var animator: Node = node.find_child("AnimationPlayer",true,false)
        if animator == null or not animator is AnimationPlayer:
            push_error("Blender fauna animation player missing")
            quit(97)
            return
        if (animator as AnimationPlayer).get_animation_list().is_empty():
            push_error("No playable Blender fauna animation")
            quit(98)
            return
    print("PASS: 14 original animated Shire fauna loaded in the real game")
    quit(0)
