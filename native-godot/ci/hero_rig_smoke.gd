extends SceneTree
## Real Godot test: all four principal characters instantiate CC0 rigged GLB.
## Tests genuine skeleton and animation readiness, not AAA/face approval.
func _initialize() -> void:
    call_deferred("_run")
func _run() -> void:
    if change_scene_to_file("res://scenes/Main.tscn") != OK:
        push_error("Cannot load hero verification chapter")
        quit(110)
        return
    for _i in range(7):
        await process_frame
    var game: Node=current_scene
    var frodo: Node=game.get("frodo")
    var players: Dictionary=game.get("npcs")
    if frodo == null or not players.has("sam") or not players.has("bilbo") or not players.has("gandalf"):
        push_error("Missing one or more principal actors")
        quit(111)
        return
    var hero_avatars: Dictionary={
        "frodo":frodo.get("avatar"),
        "sam":players["sam"].get("body"),
        "bilbo":players["bilbo"].get("body"),
        "gandalf":players["gandalf"].get("body")
    }
    for id in hero_avatars.keys():
        var hero: Node=hero_avatars[id]
        if hero == null or not bool(hero.get("is_imported")):
            push_error("CC0 animated GLB did not replace placeholder for "+str(id))
            quit(112)
            return
        var model: Node=hero.get("imported_visual")
        if model == null or model.find_children("*","Skeleton3D",true,false).is_empty():
            push_error("Real GLB skeletal rig missing for "+str(id))
            quit(113)
            return
        var clips: AnimationPlayer=hero.get("external_animation")
        if clips == null or clips.get_animation_list().is_empty():
            push_error("Animated GLB missing motion clips for "+str(id))
            quit(114)
            return
        var avatar_motion: String=str(hero.call("select_motion",true,false))
        if avatar_motion.is_empty() or not clips.has_animation(avatar_motion):
            push_error("Hero cannot choose locomotion animation: "+str(id))
            quit(115)
            return
        hero.call("animate_walk",true,2.0,.02,1.0,false,true)
    print("PASS: four named heroes use imported skeletal CC0 GLB and clip-based gait selection")
    quit(0)
